defmodule TinyCloneWeb.Resolvers.Shortener do
  alias TinyClone.Shortener, as: Sh

  def create_link(%{input: %{url: original, custom: custom}}, _) do
    case Sh.shorten(original, custom) do
      {:ok, identifier} ->
        {:ok, %{link: %{identifier: identifier, original: original}}}

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
end
