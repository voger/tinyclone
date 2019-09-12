defmodule TinyClone.VisitTest do
  use TinyClone.DataCase, async: false
  alias TinyClone.Visit
  import Tesla.Mock

  @good_ip "203.0.113.3"
  @bad_ip "203.0.113.23"
  @home_ip "127.0.0.1"

  setup do
    # mock tesla calls
    # FIXME: mocking the tests globaly as a workaround for this bug
    # https://github.com/teamon/tesla/issues/157
    mock_global(fn
      %{method: :get, url: "https://extreme-ip-lookup.com/json/" <> @good_ip} ->
        %Tesla.Env{status: 200, body: %{"status" => "success", "countryCode" => "AQ"}}

      %{method: :get, url: "https://extreme-ip-lookup.com/json/" <> @home_ip} ->
        %Tesla.Env{status: 200, body: %{"status" => "success", "countryCode" => ""}}

      %{method: :get, url: "https://extreme-ip-lookup.com/json/" <> @bad_ip} ->
        %Tesla.Env{status: 200, body: %{"status" => "fail"}}
    end)

    # create a link
    {:ok, link} = TinyClone.Shortener.shorten("http://www.example.com")
    [link: link]
  end

  test "create_visit/2 with good ip creates a visit", %{link: link} do
    assert {:ok,
            %TinyClone.Visits.Visit{
              country: "AQ",
              ip: %Postgrex.INET{address: {203, 0, 113, 3}, netmask: 32}
            }} = Visit.create_visit(@good_ip, link)
  end

  test "create_visit/2 with bad ip creates a visit", %{link: link} do
    assert {:ok,
            %TinyClone.Visits.Visit{
              country: nil,
              ip: %Postgrex.INET{address: {203, 0, 113, 23}, netmask: 32}
            }} = Visit.create_visit(@bad_ip, link)
  end

  test "create_visit/2 with home ip creates a visit", %{link: link} do
    assert {:ok,
            %TinyClone.Visits.Visit{
              country: nil,
              ip: %Postgrex.INET{address: {127, 0, 0, 1}, netmask: 32}
            }} = Visit.create_visit(@home_ip, link)
  end

  test "create_visit/2 without ip service configured creates a visit", %{link: link} do
    old_env = Application.get_env(:tinyclone, :ip_service)
    Application.delete_env(:tinyclone, :ip_service)

    assert {:ok,
            %TinyClone.Visits.Visit{
              country: nil,
              ip: %Postgrex.INET{address: {203, 0, 113, 3}, netmask: 32}
            }} = Visit.create_visit(@good_ip, link)

    on_exit(fn ->
      Application.put_env(:tinyclone, :ip_service, old_env)
    end)
  end
end
