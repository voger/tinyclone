defmodule TinyClone.Shortener do
  import Ecto.Query

  alias TinyClone.Repo
  alias TinyClone.Links.{Url, Link}
  alias Ecto.Multi

  # credo:disable-for-this-file Credo.Check.Refactor.UnlessWithElse

  @moduledoc """
  The shortner context module. It is responsible for generating a short link
  to represent the longer url.
  """

  @doc """
  Generates a short id that can provided instead of the long `original`.
  That id is persisted in the database and can be used later to retrieve 
  the `original` url.
  Optionally a `custom` word can be used as the returned id. 

  The id's are case insensitive and unique. 

  * If the `custom` id that is provided clashes with another existing
  id, or if it is a profanity word, the function returns 
  `{:error, :link, changeset}`. 
  * If there is something wrong with persisting the `original` in the
  database, the function returns {:error, :url, changeset}
  * On success the function returns `{:ok, identifier}` where the 
  `identifier` is the id as binary.
  """
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

  def expand(link) do
    case get_original(link) do
      %Url{original: original} ->
        {:ok, original}

      nil ->
        nil
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

    case Repo.one(query) do
      %Link{identifier: identifier} ->
        identifier

      _ ->
        nil
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

  defp get_original(nil), do: nil

  defp get_original(link) do
    query =
      from l in Link,
        join: u in Url,
        on: l.url_id == u.id,
        where: l.identifier == ^link,
        select: struct(u, [:original])

    Repo.one(query)
  end
end
