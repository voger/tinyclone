defmodule TinyCloneWeb.Resolvers.Visits do
  alias TinyClone.Visit


  def visits_by_date(link, %{days: days}, _) do
    {:ok, Visit.count_by_date_with(link, days)}
  end

  def visits_by_country(link, _, _) do
    {:ok, Visit.count_by_country_with(link)}
  end

  def visits_count(link, _, _) do
    {:ok, Visit.count_for(link)}
  end
end
