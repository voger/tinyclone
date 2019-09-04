defmodule TinyCloneWeb.PageController do
  use TinyCloneWeb, :controller
  alias TinyClone.Shortener, as: Sh

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def show(conn, %{"link" => link}) do
    case Sh.expand(link) do
      {:ok, original} ->
        conn
        |> put_status(:moved_permanently)
        |> redirect(external: original)

      nil ->
        conn
        |> put_status(:not_found)
        |> put_view(TinyCloneWeb.ErrorView)
        |> render("404.html")
    end
  end
end
