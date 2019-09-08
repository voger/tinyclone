defmodule TinyClone.Repo.Migrations.CreateVisits do
  use Ecto.Migration

  def change do
    create table("visits") do
      add :ip, :inet, null: false
      add :country, :string

      add :link_identifier,
          references("links", column: :identifier, type: :citext, on_delete: :delete_all),
          null: false

      timestamps()
    end
  end
end
