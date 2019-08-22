defmodule TinyClone.Repo.Migrations.CreateUrls do
  use Ecto.Migration

  def change do
    create table(:urls) do
      add :original, :string, null: true, size: 255

      timestamps()
    end

   create unique_index(:urls, [:original])

  end
end
