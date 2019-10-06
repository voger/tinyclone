defmodule TinyClone.Links.Link do
  use Ecto.Schema
  import Ecto.Changeset
  alias TinyClone.Links.Link

  @primary_key {:identifier, :string, autogenerate: false}
  @derive {Phoenix.Param, key: :identifier}

  schema "links" do
    field :custom, :boolean
    field :custom_word, :string, virtual: true
    belongs_to :url, TinyClone.Links.Url
    has_many :visits, TinyClone.Visits.Visit
    timestamps()
  end

  @required [:url_id]
  @optional [:custom_word]
  def create_changeset(%Link{} = link, attrs) do
    link
    |> cast(attrs, @required ++ @optional)
    |> validate_required(@required)
    |> assign_identifier
    |> validate_no_profanity
    |> validate_no_spaces
    |> unique_constraint(:identifier, name: "links_pkey")
  end

  defp assign_identifier(%{valid?: false} = changeset) do
    changeset
  end

  defp assign_identifier(%{changes: %{url_id: url_id}} = changeset) do
    custom_word = get_change(changeset, :custom_word, nil)

    changeset
    |> put_change(:identifier, custom_word || TinyClone.Links.Encoder.encode(url_id))
    |> put_change(:custom, !!custom_word)
  end

  defp validate_no_spaces(changeset) do
    validate_change(changeset, :identifier, fn field, value ->
      if Regex.match?(~r/\s/, value) do
        [{field, "must contain only numbers and letters"}]
      else
        []
      end
    end)
  end

  defp validate_no_profanity(changeset) do
    validate_change(changeset, :identifier, fn field, value ->
      if TinyClone.Links.Profanities.is_profanity?(value) do
        [{field, {"%{word} is a bad word", word: value}}]
      else
        []
      end
    end)
  end
end
