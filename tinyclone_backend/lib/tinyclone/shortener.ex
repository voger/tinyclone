defmodule TinyClone.Shortener do
  import Ecto.Query

  alias TinyClone.Repo
  alias TinyClone.Links.{Url, Link}
  alias Ecto.Multi

  require Cl

  def shorten(original, custom \\ nil) do
    link = get_link(original, custom)

    unless link do
      Multi.new()
      |> Multi.insert(:url, Url.create_changeset(%Url{}, %{original: original}),
        returning: [:id],

        # on_conflict: :nothing does exactly that, nothing. In that case
        # postgresql returns nothing, not even our needed :id. We trick
        # postgresql to write the :original again so it returns the :id
        on_conflict: [set: [original: original]],
        conflict_target: :original
      )
      |> Multi.insert(:link, fn %{url: %{id: id}} ->
        generated = TinyClone.Links.Encoder.encode(id)

        params = %{
          identifier: custom || generated,
          generated: generated,
          custom: !!custom,
          url_id: id
        }

        Link.create_changeset(%Link{}, params)
      end)
      |> Repo.transaction()
      |> case do
        {:ok, %{link: %Link{identifier: identifier}}} ->
          {:ok, identifier}

        {:error, :link, %{changes: %{custom: false}}, _} ->
          # if :link failed and the user didn't request a custom url
          # then it is not user's fault. It may be that we generated
          # an identifier that is a bad word, or an identifier that it 
          # is already taken. Try the transaction again
          shorten(original, custom)

        {:error, operation, value, _changes_so_far} ->
          {:error, operation, value}
      end
    else
      {:ok, link}
    end
  end

  def get_link(original, custom) do
    query =
      from u in Url,
        join: l in Link,
        on: l.url_id == u.id,
        where: ^filter_original(original),
        where: ^filter_link(custom),
        select: struct(l, [:identifier])

    with %Link{identifier: identifier} <- Repo.one(query) do
      identifier
    else
      _ -> nil
    end
  end

  def filter_original(url) do
    dynamic([u, l], u.original == ^url)
  end

  def filter_link(nil) do
    dynamic([u, l], l.custom == false)
  end

  def filter_link(custom) do
    dynamic([u, l], l.custom == true and l.identifier == ^custom)
  end
end
