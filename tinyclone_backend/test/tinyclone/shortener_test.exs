defmodule TinyClone.ShortenerTest do
  use TinyClone.DataCase, async: true
  alias TinyClone.Shortener, as: Sh
  alias TinyClone.Links.{Link, Url, Encoder}

  setup do
    # Reset database sequence
    reset_urls_id(1)
    :ok
  end

  @uris [com: "http://www.example.com", net: "http://www.example.net", invalid: "www.example.com"]

  @doc """
  Helper function to reset the id sequence of table `urls` to
  a specific number

  `id` the specific integer to reset the table
  """
  def reset_urls_id(id) do
    {:ok, _} = Repo.query("ALTER SEQUENCE urls_id_seq RESTART WITH #{id};")
  end

  test "create new link without custom" do
    assert {:ok, "" <> _} = Sh.shorten(@uris[:com])
  end

  test "create new link with custom" do
    custom = "example"
    assert {:ok, ^custom} = Sh.shorten(@uris[:com], custom)
  end

  test "create new link with invalid url fails" do
    invalid_url = @uris[:invalid]
    {:error, :url, %Ecto.Changeset{} = changeset} = Sh.shorten(invalid_url)
    assert "#{invalid_url} is not a valid url" in errors_on(changeset).original
  end

  test "create new link with custom bad word fails" do
    custom = "shit"
    {:error, :link, %Ecto.Changeset{} = changeset} = Sh.shorten(@uris[:com], custom)

    assert "#{custom} is a bad word" in errors_on(changeset).identifier
  end

  test "create custom link that clashes with generated link fails" do
    {:ok, link} = Sh.shorten(@uris[:com])

    {:error, :link, %Ecto.Changeset{} = changeset} = Sh.shorten(@uris[:net], link)

    assert "has already been taken" in errors_on(changeset).identifier
  end

  test "create custom link that clashes with custom link fails" do
    Sh.shorten(@uris[:com], "example")

    {:error, :link, %Ecto.Changeset{} = changeset} = Sh.shorten(@uris[:net], "example")

    assert "has already been taken" in errors_on(changeset).identifier
  end

  test "sequence creates a bad word ignores and creates a new, good link" do
    bad_link = "shit"
    {:ok, bad_id} = Encoder.decode(bad_link)
    reset_urls_id(bad_id)

    {:ok, link} = Sh.shorten(@uris[:com])

    url_id =
      Repo.one(
        from l in Link,
          join: u in Url,
          where: l.identifier == ^link,
          where: l.url_id == u.id,
          select: u.id
      )

    refute bad_link == link
    assert url_id == bad_id + 1
  end

  test "sequence creates a link that clashes with a custom link, ignores it and creates a new link" do
    {:ok, bad_link} = Sh.shorten(@uris[:com], "example")

    {:ok, bad_id} = Encoder.decode("example")
    reset_urls_id(bad_id)
    {:ok, link} = Sh.shorten(@uris[:net])

    url_id =
      Repo.one(
        from l in Link,
          join: u in Url,
          where: l.identifier == ^link,
          where: l.url_id == u.id,
          select: u.id
      )

    refute bad_link == link
    assert url_id == bad_id + 1
  end
end
