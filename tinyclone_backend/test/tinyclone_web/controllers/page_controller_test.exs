defmodule TinyCloneWeb.PageControllerTest do
  use TinyCloneWeb.ConnCase
  use TinyClone.MockCase
  alias TinyClone.Repo

  setup do
    # create a link
    {:ok, link} = TinyClone.Shortener.shorten("http://www.example.com")
    [link: link]
  end

  # test "GET /", %{conn: conn} do
  #   conn = get(conn, "/")
  #   assert html_response(conn, 200) =~ "Welcome to Phoenix!"
  # end

  test "GET link redirects", %{link: link} do
    {:ok, address} =
      @good_ip
      |> to_charlist
      |> :inet.parse_address()

    conn =
      build_conn()
      |> Map.put(:remote_ip, address)
      |> get("/" <> link.identifier)

    assert response(conn, 301)
    assert Enum.any?(conn.resp_headers, &({"location", "http://www.example.com"} == &1))
  end

  test "GET link creates a visit item", %{link: link} do
    {:ok, address} =
      @good_ip
      |> to_charlist
      |> :inet.parse_address()

    # No Visit entry in the database before the request
    refute Repo.one(TinyClone.Visits.Visit)

    build_conn()
    |> Map.put(:remote_ip, address)
    |> get("/" <> link.identifier)

    # Wait a little as visits are created asynchronously
    Process.sleep(500)

    # Any Visits here?
    assert Repo.one(TinyClone.Visits.Visit)
  end
end
