[
  inputs: ["{mix,.formatter}.exs", "{config,lib,test}/**/*.{ex,exs}"],
  import_deps: [:absinthe, :ecto, :ecto_sql, :plug],
  locals_without_parens: [
    raise: :*,
    mock: :*
  ]
]
