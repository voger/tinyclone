defmodule TinyClone.Visits.Services.Lookup do
  @moduledoc """
  Behaviour that converts a given IP address to country of origin. 
  """

  @doc """
  Converts a given IP address, given as a binary, to country code.

  Returns `{:ok, country}` on success `:error` on failure.
  """
  @callback to_country(String.t()) :: {:ok, String.t()} | :error
end
