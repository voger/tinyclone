defmodule TinyCloneWeb.Resolvers.Shortener do
  alias TinyClone.Shortener

  def create_link(%{input: %{url: original, custom: custom}}, _) do
    case Shortener.shorten(original, custom) do
      {:ok, link} ->
        {:ok, %{link: link}}

      {:error, _, changeset} ->
        {:error, changeset}
    end
  end

  # Can't set explicit default `nil` in absinthe field `:default_value`
  # this is a workaround
  # see https://github.com/absinthe-graphql/absinthe/issues/656
  def create_link(args, context) do
    args
    |> put_in([:input, :custom], nil)
    |> create_link(context)
  end

  def get_link(%{identifier: identifier}, _) do
    {:ok, Shortener.get_link(identifier) |> TinyClone.Repo.preload(:url)}
  end

  def get_original_uri(%{url: %{original: original}}, _, _) do
    {:ok, original}
  end

  def get_inserted_at(%{inserted_at: inserted_at}, _, _) do
    date_time = DateTime.from_naive!(inserted_at, "Etc/UTC")
    {:ok, date_time}
  end
end
