defmodule TinyClone.Shortener do
  import Ecto.Query

  alias TinyClone.Repo
  alias TinyClone.Links.{Url, Link}
  alias Ecto.Multi

  require Cl

  def shorten(original, custom \\ nil) do
    url =
      Url
      |> Repo.get_by(original: original)
      |> Repo.preload(:links)

    unless url do
      Multi.new()
      |> Multi.insert(:url, Url.create_changeset(%Url{}, %{original: original}))
      |> Multi.insert(:link, fn %{url: %{id: id} = url} ->
        identifier = custom || TinyClone.Links.Encoder.encode(id)

        Ecto.build_assoc(url, :links)
        |> Link.create_changeset(%{identifier: identifier, custom: !!custom})
      end)
      |> Repo.transaction()
      |> Cl.inspect(label: "-b Transaction result")
    end
  end
end
