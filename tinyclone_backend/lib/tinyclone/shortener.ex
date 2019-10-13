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
  `identifier` is the `Tinyclone.Link.Links` struct with the :url preloaded
  """
  def shorten(original, custom \\ nil) do
    link = get_link(original, custom)

    unless link do
      Multi.new()
      |> Multi.insert(:url, Url.create_changeset(%Url{}, %{original: original}),
        returning: [:id],

        # `on_conflict: :nothing` does exactly that, nothing. In that case
        # postgresql returns nothing, not even our needed :id. We trick
        # postgresql to write the :original again so it returns the :id
        on_conflict: [set: [original: original]],
        conflict_target: :original
      )
      |> Multi.insert(:link, fn %{url: %{id: id}} ->
        Link.create_changeset(%Link{}, %{url_id: id, custom_word: custom})
      end)
      |> Repo.transaction()
      |> case do
        {:ok, %{link: link, url: url}} ->
          {:ok, %{link | url: url}}

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

  @doc """
  Returns a `TinyClone.Links.Link` struct identified
  by it's :identifier
  """
  def get_link(identifier) do
    Repo.get(Link, identifier)
    |> Repo.preload(:url)
  end

  # returns a `TinyClone.Links.Link` struct which 
  # is identified by the field :original in it's
  # associated `TinyClone.Links.Url` struct and
  # it's custom :identifier if available. Used 
  # internaly this this module.
  defp get_link(original, custom) do
    from(l in Link,
      join: u in Url,
      on: l.url_id == u.id,
      where: ^filter_original(original),
      where: ^filter_link(custom)
    )
    |> Repo.one()
    |> Repo.preload(:url)
  end

  defp filter_original(url) do
    dynamic([l, u], u.original == ^url)
  end

  defp filter_link(nil) do
    dynamic([l, u], l.custom == false)
  end

  defp filter_link(custom) do
    dynamic([l, u], l.custom == true and l.identifier == ^custom)
  end

  @doc """
  Accepts the %Link `:identifier` as a binary and returns the original
  URI as a binary.
  """
  def expand(link) do
    case get_original(link) do
      %Url{original: original} ->
        {:ok, original}

      nil ->
        nil
    end
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
