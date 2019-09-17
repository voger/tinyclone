defmodule TinyCloneWeb.Schema do
  use Absinthe.Schema

  query do
    field :hello, :string do
      resolve fn _,_ -> {:ok, "O hai there."} end
    end
  end
end
