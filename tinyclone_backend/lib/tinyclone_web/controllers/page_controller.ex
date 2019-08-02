defmodule TinyCloneWeb.PageController do
  use TinyCloneWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
