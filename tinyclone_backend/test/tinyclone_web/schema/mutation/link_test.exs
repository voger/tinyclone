defmodule TinyClone.Schema.Mutation.LinkTest do
  use TinyCloneWeb.ConnCase, async: true
  use TinyClone.MockCase

  @query """
  mutation($input: CreateLinkInput!) {
    createLink(input: $input) {
      link {
        identifier
        original
        dateCreated
        visits
        visitsByCountry {
          country
          visits
        }
        visitsByDate {
          date
          visits
        }
        
      }
      errors {
        key
        message
      }
    }
  }
  """
  test "mutation createLink creates a custom link" do
    url = @uris[:com]
    custom = "test"

    response =
      post(build_conn(), "/api", %{
        query: @query,
        variables: %{
          "input" => %{
            "custom" => custom,
            "url" => url
          }
        }
      })

    assert %{
             "data" => %{
               "createLink" => %{
                 "errors" => null,
                 "link" => %{
                   "dateCreated" => _,
                   "identifier" => ^custom,
                   "original" => ^url,
                   "visits" => 0,
                   "visitsByCountry" => [],
                   "visitsByDate" => [
                     %{ "date" => <<_date1::binary>>, "visits" => 0 },
                     %{ "date" => <<_date2::binary>>, "visits" => 0 },
                     %{ "date" => <<_date3::binary>>, "visits" => 0 },
                     %{ "date" => <<_date4::binary>>, "visits" => 0 },
                     %{ "date" => <<_date5::binary>>, "visits" => 0 },
                     %{ "date" => <<_date6::binary>>, "visits" => 0 },
                     %{ "date" => <<_date7::binary>>, "visits" => 0 },
                     %{ "date" => <<_date8::binary>>, "visits" => 0 },
                     %{ "date" => <<_date9::binary>>, "visits" => 0 },
                     %{ "date" => <<_date10::binary>>, "visits" => 0 }
                   ]
                 }
               }
             }
           } = json_response(response, 200)
  end

  test "mutation createLink creates a generic link" do
    url = @uris[:com]

    response =
      post(build_conn(), "/api", %{
        query: @query,
        variables: %{
          "input" => %{
            "url" => url
          }
        }
      })

    assert %{
             "data" => %{
               "createLink" => %{
                 "errors" => nil,
                 "link" => %{
                   "identifier" => identifier,
                   "original" => ^url,
                   "visits" => 0,
                   "visitsByCountry" => [],
                   "visitsByDate" => [
                     %{ "date" => <<_date1::binary>>, "visits" => 0 },
                     %{ "date" => <<_date2::binary>>, "visits" => 0 },
                     %{ "date" => <<_date3::binary>>, "visits" => 0 },
                     %{ "date" => <<_date4::binary>>, "visits" => 0 },
                     %{ "date" => <<_date5::binary>>, "visits" => 0 },
                     %{ "date" => <<_date6::binary>>, "visits" => 0 },
                     %{ "date" => <<_date7::binary>>, "visits" => 0 },
                     %{ "date" => <<_date8::binary>>, "visits" => 0 },
                     %{ "date" => <<_date9::binary>>, "visits" => 0 },
                     %{ "date" => <<_date10::binary>>, "visits" => 0 }
                   ]
                 }
               }
             }
           } = json_response(response, 200)

    assert String.length(identifier) > 0
  end

  test "invalid mutation createLink returns an error" do
    url = @uris[:invalid]

    response =
      post(build_conn(), "/api", %{
        query: @query,
        variables: %{
          "input" => %{
            "url" => url
          }
        }
      })

    assert %{
             "data" => %{
               "createLink" => %{
                 "errors" => [
                   %{
                     "key" => "original",
                     "message" => message
                   }
                 ],
                 "link" => nil
               }
             }
           } = json_response(response, 200)

    assert message == url <> " is not a valid url"
  end
end
