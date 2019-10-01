defmodule TinyClone.MockCase do
  use ExUnit.CaseTemplate

  using do
    quote do
      import Tesla.Mock

      @good_ip "203.0.113.3"
      @bad_ip "203.0.113.23"
      @home_ip "127.0.0.1"

      @uris [
        com: "http://www.example.com",
        net: "http://www.example.net",
        invalid: "www.example.com"
      ]

      setup_all do
        # mock tesla calls
        mock_global(fn
          %{method: :get, url: "https://extreme-ip-lookup.com/json/" <> @good_ip} ->
            %Tesla.Env{status: 200, body: %{"status" => "success", "countryCode" => "AQ"}}

          %{method: :get, url: "https://extreme-ip-lookup.com/json/" <> @home_ip} ->
            %Tesla.Env{status: 200, body: %{"status" => "success", "countryCode" => ""}}

          %{method: :get, url: "https://extreme-ip-lookup.com/json/" <> @bad_ip} ->
            %Tesla.Env{status: 200, body: %{"status" => "fail"}}
        end)

        :ok
      end
    end
  end
end
