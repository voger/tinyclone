defmodule TinyClone.Visit do
  import Ecto.Query
  alias TinyClone.Repo
  alias TinyClone.Visits.Visit
  alias TinyClone.Links.Link

  require Logger

  @doc """
  Registers a Visit in the database. It accepts the ip address
  that visited the link and the link identifier.
  """
  def create_visit(<<ip_addr::binary>>, <<identifier::binary>>) do
    country =
      with service when not is_nil(service) <- Application.get_env(:tinyclone, :ip_service),
           {:ok, country_code} <- service.to_country(ip_addr) do
        country_code
      else
        nil ->
          Logger.info("No country resolution module is set.")
          nil

        :error ->
          nil
      end

    params = %{ip: ip_addr, country: country, link_identifier: identifier}

    %Visit{}
    |> Visit.create_changeset(params)
    |> Repo.insert()

    # TODO: Some kind of logging needed here otherwise we will lose
    # visits and we won't know about them
  end

  def count_for(%Link{identifier: identifier}) do
    from(v in Visit,
      where: v.link_identifier == ^identifier,
      select: count()
    )
    |> Repo.one()
  end

  def count_by_date_with(%Link{identifier: identifier}, num_of_days) do
    from(v in Visit,
      right_join:
        day in fragment(
          "generate_series(CURRENT_DATE - ?::interval + INTERVAL '1 day', CURRENT_DATE, '1 day')",
          ^%Postgrex.Interval{days: num_of_days}
        ),
      on: day == fragment("date(?)", v.inserted_at) and v.link_identifier == ^identifier,
      group_by: day,
      order_by: [desc: day],
      select: %{
        date: fragment("date(?)", day),
        visits: count(v.id)
      }
    )
    |> Repo.all()
  end


  def count_by_country_with(%Link{identifier: identifier}) do
    from(v in Visit,
      where: v.link_identifier == ^identifier,
      group_by: v.country,
      select: %{
        country: v.country,
        visits: count(v.id)
      }
    )
    |> Repo.all()
  end
end
