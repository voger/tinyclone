defmodule TinyCloneWeb.PageController do
  use TinyCloneWeb, :controller
  alias TinyClone.{Shortener, Visit}

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def show(conn, %{"link" => link}) do
    case Shortener.expand(link) do
      {:ok, original} ->
        # Create a visit entry in the database
        client_ip =
          conn.remote_ip
          |> :inet.ntoa()
          |> to_string

        # asynchronously
        Task.start(Visit, :create_visit, [client_ip, link])

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
