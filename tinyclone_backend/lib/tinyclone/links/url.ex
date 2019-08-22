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
    |> unique_constraint(:original)
  end
end
