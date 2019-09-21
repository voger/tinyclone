defmodule TinyCloneWeb.Schema.LinkTypes do
  use Absinthe.Schema.Notation

  object :link do
    field :identifier, :string
    field :original, :string
  end

  object :create_link_result do
    field :link, :link
    field :errors, list_of(:input_error)
  end

  input_object :create_link_input do
    field :url, non_null(:string)
    field :custom, :string
  end
end
