defmodule TinyClone.Repo.Migrations.AddForeignKeyToLinks do
  use Ecto.Migration

  def change do
    alter table(:links) do
      add :url_id, references("urls")
    end

  end
end
