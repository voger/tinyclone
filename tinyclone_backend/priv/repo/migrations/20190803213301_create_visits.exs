defmodule TinyClone.Repo.Migrations.CreateVisits do
  use Ecto.Migration

  def change do
    create table("visits") do
      add :ip, :inet
      add :country, :string
      references(:links, column: :identifier)

      timestamps()
    end

  end
end
