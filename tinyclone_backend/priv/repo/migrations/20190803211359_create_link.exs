defmodule TinyClone.Repo.Migrations.CreateLink do
  use Ecto.Migration

  def change do
    create table(:links, primary_key: false) do
      add :identifier, :citext, primary_key: true
      add :custom, :boolean, default: false

      timestamps()
    end
  end
end
