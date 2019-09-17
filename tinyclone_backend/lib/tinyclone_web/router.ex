defmodule TinyCloneWeb.Router do
  use TinyCloneWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  pipeline :api do
    plug(:accepts, ["json"])
  end

  scope "/", TinyCloneWeb do
    pipe_through(:browser)

    get "/", PageController, :index
    get "/:link", PageController, :show


  end

  scope "/api" do
    pipe_through :api

    post "/", Absinthe.Plug, schema: TinyCloneWeb.Schema

    forward "/graphiql", Absinthe.Plug.GraphiQL,
      schema: TinyCloneWeb.Schema
      # socket: PlateSlateWeb.UserSocket
  end
end
