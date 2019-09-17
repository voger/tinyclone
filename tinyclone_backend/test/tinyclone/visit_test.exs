defmodule TinyClone.VisitTest do
  use TinyClone.DataCase, async: false
  use TinyClone.MockCase
  alias TinyClone.Visit

  setup do
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
