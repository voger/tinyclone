defmodule TinyClone.Links.Link do
  use Ecto.Schema
  import Ecto.Changeset
  alias TinyClone.Links.Link

  @primary_key {:identifier, :string, autogenerate: false}
  @derive {Phoenix.Param, key: :identifier}

  schema "links" do
    field :custom, :boolean
    field :generated, :string, virtual: true
    belongs_to :url, TinyClone.Links.Url
    timestamps()
  end

  @required [:identifier, :url_id, :generated]
  @optional [:custom]
  def create_changeset(%Link{} = link, attrs) do
    link
    |> cast(attrs, @required ++ @optional)
    |> validate_required(@required)
    |> validate_no_profanity
    |> unique_constraint(:identifier, name: "links_pkey")
  end

  defp validate_no_profanity(changeset) do
    changeset
    |> validate_no_profanity(:identifier)
    |> validate_no_profanity(:generated)
  end

  defp validate_no_profanity(%{changes: %{custom: false}} = changeset, :generated) do
    # If the `:identifier` field is generated we don't need to validate the `:generated`
    # field. It is the same as the `:identifier` field.
    changeset
  end

  defp validate_no_profanity(changeset, field) do
    validate_change(changeset, field, fn field, value ->
      if TinyClone.Links.Profanities.is_profanity?(value) do
        [{field, {"%{word} is a bad word", word: value}}]
      else
        []
      end
    end)
  end
end
