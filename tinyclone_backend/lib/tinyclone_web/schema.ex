defmodule TinyCloneWeb.Schema do
  use Absinthe.Schema

  alias TinyCloneWeb.Resolvers
  alias TinyCloneWeb.Schema.Middleware

  import_types __MODULE__.LinkTypes

  query do
    field :link, :link do
      arg :identifier, non_null(:string)

      resolve &Resolvers.Shortener.get_link/2
    end
  end

  mutation do
    field :create_link, :create_link_result do
      arg :input, non_null(:create_link_input)
      resolve &Resolvers.Shortener.create_link/2
    end
  end

  @desc "An error encountered trying to persist input"
  object :input_error do
    field :key, non_null(:string)
    field :message, non_null(:string)
  end

  def middleware(middleware, _field, %{identifier: :mutation}) do
    middleware ++ [Middleware.ChangesetErrors]
  end

  def middleware(middleware, _field, _object) do
    middleware
  end
end
