# DX Team Orchestra

Orchestra is the internal testing framework for Fingerprint Server SDKs.
It simulates an “orchestra” of services where:

- **🎻 Musicians** → individual Web API applications (one per SDK: Node, Java, .NET, Go, PHP, Python). Each exposes endpoints that map to Server SDK methods.
- **🎼 Conductor** → a Playwright test project that orchestrates the musicians by sending requests and asserting responses.
- **🎶 Orchestra** → the whole system: Musicians + Conductor working together.

> **Note**
> This repository is part of our internal tooling.
> It is not included in our core product and is provided “as-is” with no guaranteed level of support from Fingerprint.

- [DX Team Orchestra](#dx-team-orchestra)
  - [Architecture](#architecture)
  - [Getting Started](#getting-started)
    - [Requirements](#requirements)
    - [Running musicians](#running-musicians)
    - [Running conductor](#running-conductor)
  - [Endpoints \& Requests](#endpoints--requests)
  - [Development Guide](#development-guide)
    - [Adding test cases](#adding-test-cases)
      - [A) Add a new search events filter](#a-add-a-new-search-events-filter)
      - [B) Add a new endpoint (end-to-end)](#b-add-a-new-endpoint-end-to-end)
      - [C) Protecting test ordering (how \& why)](#c-protecting-test-ordering-how--why)
  - [Updating SDK versions](#updating-sdk-versions)

## Architecture

```text
       ┌──────────────┐          ┌──────────────┐
       │  Conductor   │ ───────► │   Musician   │
       │ (Playwright) │          │ (Server SDK) │
       └──────────────┘          └──────────────┘
             ▲
             │
       orchestrates
```

- Conductor drives test flows.
- Each Musician is a containerized server exposing endpoints (searchEvents, unseal, etc.).
- Orchestra provides Make targets for starting/stopping all or specific SDK musicians.

## Getting Started

### Requirements

- Node.js + pnpm
- Docker + Docker Compose
- Make

### Running musicians

You can start SDK servers individually or all at once.

| SDK    | Start               | Stop               | Port |
| ------ | ------------------- | ------------------ | ---- |
| Node   | `make start-node`   | `make stop-node`   | 3002 |
| Java   | `make start-java`   | `make stop-java`   | 8080 |
| .NET   | `make start-dotnet` | `make stop-dotnet` | 5243 |
| Go     | `make start-go`     | `make stop-go`     | 8081 |
| PHP    | `make start-php`    | `make stop-php`    | 3004 |
| Python | `make start-python` | `make stop-python` | 3003 |

Start all:

```shell
make start-all
```

Stop all:

```shell
make stop-all
```

### Running conductor

1. Start at least one Musician.
2. Copy its port.
3. Update `MUSICIAN_PORT` in `projects/conductor/.env`. If you don’t have one, copy/inspect `.env.example`
4. Run tests from the root folder:

```shell
pnpm playwright test
```

## Endpoints & Requests

Example GET request:

```http request
http://localhost:<SDK_PORT>/getEvents?apiKey=<SECRET_KEY>&region=<REGION>&requestId=<REQUEST_ID>
```

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

## Development Guide

### Adding test cases

#### A) Add a new search events filter

For example, to add a new search event filter:

1. Conductor side:
   - Update test: `with all params` inside test file `projects/conductor/tests/004-searchEvents.test.ts`.
   - Update types/serializers: Type: `SearchEventsParams` and serializer function `searchEvents` inside util file `projects/conductor/utils/api.ts`
2. Musician side:
   - Find the controller/handler (`EventController` or `searchEvents` in each SDK).
   - Add the new query param to the method signature if necessary.
   - Pass it down to Fingerprint’s SDK call.
     > For Python, handlers are in `main.py`.
3. Re-run the musician(s) + conductor tests.

#### B) Add a new endpoint (end-to-end)

Suppose we’re adding `/getRelatedVisitors`:

1. Define the contract (request & response)
   - **Request shape:** query params or JSON body (document clearly in test).
   - **Response shape:** what Conductor will assert (fields, status, error cases).
2. Musicians (per language)
   - Add the route:
     - Create or extend the appropriate controller/handler (naming matches each language’s conventions, e.g., `RelatedVisitorsController` or an action inside `EventController`).
     - Call the corresponding Server SDK method.
     - Return a normalized response format so Conductor can assert consistently across SDKs (status code + JSON body fields).
   - If SDK requires version bumps, use your helper script / manual steps per [Updating SDK versions](#updating-sdk-versions)
3. Conductor
   - **Utility:** add a small wrapper/serializer for this endpoint in projects/conductor/utils/api.ts.
   - Test file: create a new numbered test file under `projects/conductor/tests/`, e.g.:
     ```shell
     projects/conductor/tests/005-relatedVisitors.test.ts
     ```
     Use a numeric prefix so filenames convey intended execution order in CI and make it easy to scan. (See Ordering below.)
   - **Assertions:**
     - Happy path (200) with representative inputs.
     - Edge cases (missing param, invalid param).
     - Negative tests (403/401 with bad key, 4xx on invalid dates, etc.), if they’re stable and not flaky.
4. Env & fixtures
   - Add any new keys to `projects/conductor/.env` (and `.env.example`) if needed (e.g., extra secrets, test IDs). Mention in the test header comments what is required.

#### C) Protecting test ordering (how & why)

**Why ordering matters here**

- Some Orchestra tests are stateful or rate-limited by the external API.

  Examples:
  - Reusing the same `requestId`, `visitorId` across steps.

- Uncontrolled parallelism or reordering can cause flaky tests (race conditions, throttling, temporary 429s/5xx), or non-deterministic assertions.

**How to enforce order with Playwright**

- **Within a file:** wrap a flow in a serial suite:

  ```typescript
  import { test, expect } from '@playwright/test'

  test.describe.configure({ mode: 'serial' })

  test('step 1: prepares data', async ({ request }) => {
    // ...
  })

  test('step 2: consumes prepared data', async ({ request }) => {
    // ...
  })
  ```

- **Across files:** use numeric filename prefixes (e.g., `001-…`, `002-…`, `003-…`).

  This doesn’t guarantee runner ordering by itself (Playwright may parallelize files), but it:
  - Signals the intended sequence to contributors/CI reviews.
  - Pairs well with running the suite with a single worker (or disabling full parallelism) when ordering is truly required.
    - In CI or locally for ordering-sensitive runs:
    ```shell
    # run with a single worker
    pnpm playwright test --workers=1
    # or set in playwright.config.ts
    // export default defineConfig({ fullyParallel: false })
    ```
  - Keep only the flows that must be ordered in these files; leave independent tests parallelizable.

**Guidelines**

- Prefer stateless tests where possible; reserve serial/ordered suites for scenarios that truly need it.
- If a test mutates shared state or depends on prior artifacts, put it in a serial describe and add a short header comment explaining the dependency (future readers will thank you).
- If you hit API limits, add conservative timeouts and retries only for the affected tests; avoid blanket retries that can hide real issues.

## Updating SDK versions

There are two supported ways to bump Server SDK versions: via the helper script (recommended) or manually per language.

> Heads-up:
>
> - `scripts/setup-sdk.sh` does not change directories. You must cd into the specific musician project first, then call the script via a relative path (e.g., `../../scripts/setup-sdk.sh`).
> - For Python, remember to also update requirements.txt manually to keep the pin consistent with what you installed.

1. Recommended: use the helper script

   From inside the musician folder (e.g., `projects/java-sdk`, `projects/node-sdk`, …):

   ```shell
   # cd into the musician first
   cd projects/<language>-sdk
   # e.g. cd projects/java-sdk

   # usage:
   # ../../scripts/setup-sdk.sh <language> <event_name> <sdk_version_or_latest>

   # Examples:

   # (A) Install a specific version:
   ../../scripts/setup-sdk.sh java workflow_dispatch 7.9.0

   # (B) Install the latest release (let the script fetch it):
   #     Any EVENT_NAME other than 'workflow_dispatch' or 'repository_dispatch', or leaving version as 'latest',
   #     will make the script fetch the latest GitHub release tag.
   ../../scripts/setup-sdk.sh node push latest
   ```

   For Node, the helper script updates the v4 SDK package only: `@fingerprint/node-sdk`.
   If your change also depends on the legacy v3 musician endpoints, update `@fingerprintjs/fingerprintjs-pro-server-api` separately.

   > After updating, rebuild/restart the relevant container(s) and run Conductor tests:

2. Manual updates (language-by-language)
   Use this if you can’t or don’t want to run the script. Still cd into the specific musician first.

   **Node:**

   The Node musician currently depends on two different packages:
   - `@fingerprintjs/fingerprintjs-pro-server-api` for the legacy v3 endpoints
   - `@fingerprint/node-sdk` for the v4 endpoints

   Only bump the package(s) your change actually needs. They do not need to share the same version number.

   ```shell
   cd projects/node-sdk

   # v3 endpoints
   pnpm add @fingerprintjs/fingerprintjs-pro-server-api@<v3-version>

   # v4 endpoints
   pnpm add @fingerprint/node-sdk@<v4-version>
   ```

   **Java:**

   ```shell
   cd projects/java-sdk
   # Linux:
   sed -i "s|com.github.fingerprintjs:java-sdk:[^\"']*|com.github.fingerprintjs:java-sdk:v<version>|g" build.gradle.kts
   # macOS (note the empty string after -i):
   sed -i '' "s|com.github.fingerprintjs:java-sdk:[^\"']*|com.github.fingerprintjs:java-sdk:v<version>|g" build.gradle.kts
   ./gradlew dependencies --refresh-dependencies
   ```

   **Dotnet:**

   ```shell
   cd projects/dotnet-sdk
   dotnet add package FingerprintPro.ServerSdk --version <version>
   ```

   **Go:**

   ```shell
   cd projects/go-sdk
   go get github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/v7@v<version>
   ```

   **Python:**

   ```shell
   cd projects/python-sdk
   pip install "fingerprint_pro_server_api_sdk==<version>"
   # ALSO pin it in requirements.txt to match what you installed:
   # open requirements.txt and set:
   # fingerprint_pro_server_api_sdk==<version>
   # (re)install from the file if needed:
   pip install -r requirements.txt
   ```

   **PHP:**

   ```shell
   cd projects/php-sdk
   composer require fingerprint/fingerprint-pro-server-api-sdk:<version> --update-with-dependencies
   ```
