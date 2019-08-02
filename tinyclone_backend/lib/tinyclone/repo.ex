defmodule TinyClone.Repo do
  use Ecto.Repo,
    otp_app: :tinyclone,
    adapter: Ecto.Adapters.Postgres
end
