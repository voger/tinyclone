defmodule TinyClone.Repo.Migrations.CreateLink do
  use Ecto.Migration

  def change do
    create table(:links, primary_key: false) do
      add :identifier, :string, primary_key: true

      timestamps()
    end

  end
end
