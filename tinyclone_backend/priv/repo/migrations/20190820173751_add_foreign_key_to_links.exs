defmodule TinyClone.Repo.Migrations.AddForeignKeyToLinks do
  use Ecto.Migration

  def change do
    alter table(:links) do
      add :url_id, references("urls", on_delete: :restrict), null: false
    end

  end
end
