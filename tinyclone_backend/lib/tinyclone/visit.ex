defmodule TinyClone.Visit do
  alias TinyClone.Repo
  alias TinyClone.Visits.Visit

  require Logger

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
end
