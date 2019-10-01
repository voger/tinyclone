defmodule TinyCloneWeb.Schema.LinkTypes do
  use Absinthe.Schema.Notation

  alias TinyCloneWeb.Resolvers.{Visits, Shortener}

  import_types Absinthe.Type.Custom

  object :link do
    field :identifier, :string
    field :original, :string, resolve: &Shortener.get_original_uri/3
    field :date_created, :datetime, resolve: &Shortener.get_inserted_at/3
    field :visits, :integer, resolve: &Visits.visits_count/3

    field :visits_by_date, list_of(:visits_at_date) do
      arg :days, :integer, default_value: 10
      resolve &Visits.visits_by_date/3
    end

    field :visits_by_country, list_of(:visits_from_country) do
      resolve &Visits.visits_by_country/3
    end
  end

  object :create_link_result do
    field :link, :link
    field :errors, list_of(:input_error)
  end

  input_object :create_link_input do
    field :url, non_null(:string)
    field :custom, :string
  end

  object :visits_at_date do
    field :date, :date
    field :visits, :integer
  end

  object :visits_from_country do
    field :country, :string
    field :visits, :integer
  end
end
