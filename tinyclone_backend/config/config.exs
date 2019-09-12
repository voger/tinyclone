# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :tinyclone,
  namespace: TinyClone,
  ecto_repos: [TinyClone.Repo]

# Configures the endpoint
config :tinyclone, TinyCloneWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "yUzXGB6DY2hQlIsZH7vGmMiM72x4dgMjnMG9TelvI/qLgvKVIC+hT2STTc2YkLly",
  render_errors: [view: TinyCloneWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: TinyClone.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Use hackney as adapter for tesla
config :tesla, adapter: Tesla.Adapter.Hackney

# Country lookup from IP is done with 
# extreme-ip-lookup.com service
config :tinyclone, ip_service: TinyClone.Visits.Services.ExtremeIpLookup

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
