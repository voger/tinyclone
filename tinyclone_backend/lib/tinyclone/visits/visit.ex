defmodule TinyClone.Visits.Visit do
  use Ecto.Schema

  import Ecto.Changeset

  alias TinyClone.Visits.Visit

  schema "visits" do
    field :ip, EctoNetwork.INET
    field :country, :string

    belongs_to :link, TinyClone.Links.Link,
      foreign_key: :link_identifier,
      references: :identifier,
      type: :string,
      source: :link_identifier

    timestamps()
  end

  @required [:ip, :link_identifier]
  @optional [:country]

  def create_changeset(%Visit{} = link, attrs) do
    link
    |> cast(attrs, @required ++ @optional)
    |> validate_required(@required)
    |> foreign_key_constraint(:link_identifier)
  end
end
