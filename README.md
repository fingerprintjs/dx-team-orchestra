# DX Team Orchestra

More info: https://www.notion.so/fingerprintjs/E2E-tests-for-server-SDKs-14302f125ebd80ceadfcf9eafeea1d41

Work in progress.

## How to run

| SDK    | Start Command       | Stop Command       |
|--------|---------------------|--------------------|
| Node   | `make start-node`   | `make stop-node`   |
| Java   | `make start-java`   | `make stop-java`   |
| DotNET | `make start-dotnet` | `make stop-dotnet` |
| Go     | `make start-go`     | `make stop-go`     |
| PHP    | `make start-php`    | `make stop-php`    |
| Python | `make start-python` | `make stop-python` |

### All SDKs

To run all SDKs just run `make start-all`, it will run Docker containers with all available server SDKs (musicians).
To stop these containers just run `make stop-all`.

### Ports of SDKs

| SDK    | Port |
|--------|------|
| Node   | 3002 |
| Java   | 8080 |
| DotNET | 5243 |
| Go     | 8081 |
| PHP    | 3004 |
| Python | 3003 |

### Making requests

Then You can make GET request in format:
`http://localhost:<SDK_PORT>/getEvents?apiKey=<SECRET_KEY>&region=<REGION>&requestId=<REQUEST_ID>`

For `/unseal` method use POST with JSON body like:

```json
{
  "sealedData": "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",
  "keys": [
    {
      "key": "JgowL5M8OykFOfWdWz7KmtAeb4Zbwafqf/NbkYAJe3I=",
      "algorithm": "aes-256-gcm"
    }
  ]
}
```
