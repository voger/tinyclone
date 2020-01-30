import Config

secret_key_base = System.fetch_env!("SECRET_KEY_BASE")
app_port = System.fetch_env!("APP_PORT")
app_hostname = System.fetch_env!("APP_HOSTNAME")
db_user = System.fetch_env!("PGUSER")
db_password = System.fetch_env!("PGPASSWORD")
db_host = System.fetch_env!("PGHOST")
db_port = System.fetch_env!("PGPORT") |> String.to_integer()

config :tinyclone, TinycloneWeb.Endpoint,
  http: [:inet6, port: String.to_integer(app_port)],
  secret_key_base: secret_key_base

config :tinyclone,
  port: app_port

config :tinyclone,
  app_hostname: app_hostname

# Configure your database
config :tinyclone, TinyClone.Repo,
  username: db_user,
  password: db_password,
  database: "tinyclone_prod",
  hostname: db_host,
  port: db_port,
  pool_size: 10