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
            }} = Visit.create_visit(@good_ip, link.identifier)
  end

  test "create_visit/2 with bad ip creates a visit", %{link: link} do
    assert {:ok,
            %TinyClone.Visits.Visit{
              country: nil,
              ip: %Postgrex.INET{address: {203, 0, 113, 23}, netmask: 32}
            }} = Visit.create_visit(@bad_ip, link.identifier)
  end

  test "create_visit/2 with home ip creates a visit", %{link: link} do
    assert {:ok,
            %TinyClone.Visits.Visit{
              country: nil,
              ip: %Postgrex.INET{address: {127, 0, 0, 1}, netmask: 32}
            }} = Visit.create_visit(@home_ip, link.identifier)
  end

  test "create_visit/2 without ip service configured creates a visit", %{link: link} do
    old_env = Application.get_env(:tinyclone, :ip_service)
    Application.delete_env(:tinyclone, :ip_service)

    assert {:ok,
            %TinyClone.Visits.Visit{
              country: nil,
              ip: %Postgrex.INET{address: {203, 0, 113, 3}, netmask: 32}
            }} = Visit.create_visit(@good_ip, link.identifier)

    on_exit(fn ->
      Application.put_env(:tinyclone, :ip_service, old_env)
    end)
  end

  test "count_by_date_with/2 returns a map with visits", %{link: link} do
    day = 24 * 60 * 60

    today = NaiveDateTime.utc_now()
    yesterday = NaiveDateTime.add(today, -1 * day)
    five_days_ago = NaiveDateTime.add(today, -5 * day)

    # 3 visits today
    create_visits_for_date(3, today, link.identifier)
    # 6 visits yesterday
    create_visits_for_date(6, yesterday, link.identifier)
    # 2 visits 5 days ago
    create_visits_for_date(2, five_days_ago, link.identifier)

    visits_calendar = Visit.count_by_date_with(link, 10)

    dates = Date.range(Date.utc_today(), Date.add(Date.utc_today(), -9))

    calendar_unziped =
      Enum.reduce(visits_calendar, %{dates: [], visits: []}, fn %{date: day, visits: visits},
                                                                acc ->
        %{
          dates: [day | acc.dates],
          visits: [visits | acc.visits]
        }
      end)

    assert dates |> Enum.to_list() |> Enum.reverse() == calendar_unziped.dates
    assert [0, 0, 0, 0, 2, 0, 0, 0, 6, 3] == calendar_unziped.visits
  end

  test "count_by_country_with/1 returns a map with vists per country", %{link: link} do
    countries = %{
      # 1 visit  from Antartica
      "AQ" => 1,
      # 2 visits from United States
      "US" => 2,
      # 3 visits from Germany
      "DE" => 3,
      # 4 visits from Greece
      "GR" => 4
    }

    for {country, number_of_visits} <- countries do
      create_visits_for_country(number_of_visits, country, link.identifier)
    end

    assert [
             %{country: "AQ", visits: 1},
             %{country: "US", visits: 2},
             %{country: "DE", visits: 3},
             %{country: "GR", visits: 4}
           ] ==
             link
             |> Visit.count_by_country_with()
             |> Enum.sort_by(&Map.get(&1, :visits))
  end

  # Creates a number of visits.
  # amount is the number of visits to create.
  # link is the link for which the visits should be created
  # ip (optional) the ip from which the visits originated
  # Returns a list with created visits ids
  defp create_visits(amount, link, ip) do
    for _ <- 1..amount, into: [] do
      {:ok, visit} = Visit.create_visit(ip, link)
      visit
    end
    |> Enum.map(& &1.id)
  end

  # Creates a number of visits for date.
  # date is the date for which the visits are done. 
  # The rest of the parametters are the same as create_visits/3
  defp create_visits_for_date(amount, date, identifier, ip \\ @good_ip) do
    visits = create_visits(amount, identifier, ip)

    update_query =
      from(v in TinyClone.Visits.Visit,
        where: v.id in ^visits,
        update: [set: [inserted_at: ^date]]
      )

    Repo.update_all(update_query, [])
  end

  # Creates a number of visits for country.
  # country is the country from which the visits are done. 
  # The rest of the parametters are the same as create_visits/3
  defp create_visits_for_country(amount, country, identifier, ip \\ @good_ip) do
    visits = create_visits(amount, identifier, ip)

    update_query =
      from(v in TinyClone.Visits.Visit,
        where: v.id in ^visits,
        update: [set: [country: ^country]]
      )

    Repo.update_all(update_query, [])
  end
end
