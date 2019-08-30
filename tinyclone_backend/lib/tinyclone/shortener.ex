defmodule TinyClone.Shortener do
  import Ecto.Query

  alias TinyClone.Repo
  alias TinyClone.Links.{Url, Link}
  alias Ecto.Multi

  require Cl

  def shorten(original, custom \\ nil) do
    url = get_link(original, custom)

    unless url do
      
    else
      
    end
  end

  def get_link(original, custom) do
    query = from u in "urls",
      join: l in "links",
      on: l.url_id == u.id,
      where: ^filter_original(original),
      where: ^filter_link(custom),
      select: %{url: u.original, identifier: l.identifier}

      Repo.one(query)
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
