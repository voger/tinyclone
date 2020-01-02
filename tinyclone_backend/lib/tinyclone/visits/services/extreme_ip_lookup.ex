defmodule TinyClone.Visits.Services.ExtremeIpLookup do
  use Tesla, only: [:get]
  @behaviour TinyClone.Visits.Services.Lookup

  @moduledoc """
  Uses it lookup features from https://extreme-ip.lookup.com
  """

  plug Tesla.Middleware.BaseUrl, "https://extreme-ip-lookup.com/json/"
  plug Tesla.Middleware.JSON
  plug Tesla.Middleware.Timeout, timeout: 7_000

  @impl TinyClone.Visits.Services.Lookup
  def to_country(<<ip::binary>>) do
    case get(ip) do
      {:ok, %Tesla.Env{body: %{"status" => "success", "countryCode" => code}}} ->
        {:ok, code}

      other ->
        :error
    end
  end
end
