defmodule TinyClone.Links.Url do
  use Ecto.Schema
  import Ecto.Changeset
  alias TinyClone.Links.Url

  schema "urls" do
    field :original, :string
    has_many :links, TinyClone.Links.Link

    timestamps()
  end

  @required [:original]

  def create_changeset(%Url{} = url, attrs) do
    url
    |> cast(attrs, @required)
    |> validate_required(@required)
    |> validate_url
    |> unique_constraint(:original)
  end

  defp validate_url(changeset) do
    validate_change(changeset, :original, fn :original, value ->
      url = URI.parse(value)

      if url.scheme in ["http", "https"] && url.host =~ "." do
        []
      else
        [{:original, {"%{original} is not a valid url", original: value}}]
      end
    end)
  end
end
