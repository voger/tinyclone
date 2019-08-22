defmodule TinyClone.Links.Link do
  use Ecto.Schema
  import Ecto.Changeset
  alias TinyClone.Links.Link

  @primary_key {:identifier, :string, autogenerate: false}
  @derive {Phoenix.Param, key: :identifier}

  schema "links" do
    field :custom, :boolean
    belongs_to :url, TinyClone.Links.Url
    timestamps()
  end

  @required [:identifier]
  @optional [:custom]
  def create_changeset(%Link{} = link, attrs) do
    link
    |> cast(attrs, @required ++ @optional)
    |> validate_required(@required)
    |> validate_no_profanity()
    |> unique_constraint(:identifier, name: "links_pkey")
  end

  def validate_no_profanity(changeset) do
    validate_change(changeset, :identifier, fn field, value ->
      if TinyClone.Links.Profanities.is_profanity?(value) do
        [identifier: {"%{word} is a bad word", word: value}]
      else
        []
      end
    end)
  end
end
