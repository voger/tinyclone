defmodule TinyClone.Schema.Query.LinkTest do
  use TinyCloneWeb.ConnCase, async: true
  use TinyClone.MockCase

  setup do
    {:ok, link} = TinyClone.Shortener.shorten("http://www.example.com")
    [link: link]
  end

  @query """
  query GetLink($identifier: String!){
    link(identifier: $identifier) {
      original
      identifier
      dateCreated
      visitsByCountry {
        country
        visits
      }
      visits
      
      visitsByDate {
        date
        visits
      }
    }
  }
  """
  test "query returns a link with all the things", %{link: link} do
    identifier = link.identifier
    original = link.url.original

    response =
      post(build_conn(), "/api", %{
        query: @query,
        variables: %{"identifier" => link.identifier}
      })

    assert %{
             "data" => %{
               "link" => %{
                 "dateCreated" => date_created,
                 "identifier" => ^identifier,
                 "original" => ^original,
                 "visits" => 0,
                 "visitsByCountry" => [],
                 "visitsByDate" => [
                   %{"date" => <<_date1::binary>>, "visits" => 0},
                   %{"date" => <<_date2::binary>>, "visits" => 0},
                   %{"date" => <<_date3::binary>>, "visits" => 0},
                   %{"date" => <<_date4::binary>>, "visits" => 0},
                   %{"date" => <<_date5::binary>>, "visits" => 0},
                   %{"date" => <<_date6::binary>>, "visits" => 0},
                   %{"date" => <<_date7::binary>>, "visits" => 0},
                   %{"date" => <<_date8::binary>>, "visits" => 0},
                   %{"date" => <<_date9::binary>>, "visits" => 0},
                   %{"date" => <<_date10::binary>>, "visits" => 0}
                 ]
               }
             }
           } = json_response(response, 200)
  end

  @query """
  query GetLink($identifier: String!, $days: Int){
    link(identifier: $identifier) {
      visitsByDate(days: $days) {
        date
        visits
      }
    }
  }
  """
  test "query returns a custom number of days for visits", %{link: link} do
    identifier = link.identifier

    response =
      post(build_conn(), "/api", %{
        query: @query,
        variables: %{
          "identifier" => identifier,
          "days" => 5
        }
      })

    assert %{
             "data" => %{
               "link" => %{
                 "visitsByDate" => [
                   %{"date" => <<_date1::binary>>, "visits" => 0},
                   %{"date" => <<_date2::binary>>, "visits" => 0},
                   %{"date" => <<_date3::binary>>, "visits" => 0},
                   %{"date" => <<_date4::binary>>, "visits" => 0},
                   %{"date" => <<_date5::binary>>, "visits" => 0}
                 ]
               }
             }
           } = json_response(response, 200)
  end

  test "invalid non-existent identifier returns null" do
    # bad words should never be valid link identifiers
    bad_identifier = "shit"

    response =
      post(build_conn(), "/api", %{
        query: @query,
        variables: %{"identifier" => bad_identifier}
      })

    assert %{
             "data" => %{
               "link" => nil
             }
           } = json_response(response, 200)
  end
end
