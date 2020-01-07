defmodule TinyClone.Repo.Migrations.AllowLongUrls do
  use Ecto.Migration

  def change do
    alter table(:urls) do
      modify :original, :text
    end

  end
end
