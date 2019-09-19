defmodule TinyClone.Schema.Mutation.LinkTest do
  use TinyCloneWeb.ConnCase, async: true
  use TinyClone.MockCase

  @query """
  mutation($input: CreateLinkInput!) {
    createLink(input: $input) {
      link {
        identifier
        original
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
                 "errors" => nil,
                 "link" => %{
                   "identifier" => ^custom,
                   "original" => ^url
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
                   "original" => ^url
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
