#!/usr/bin/env bash

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

latest_nuget() {
  curl -fsSL "https://api.nuget.org/v3-flatcontainer/$(echo "$1" | tr '[:upper:]' '[:lower:]')/index.json" \
    | jq -r '.versions[]' \
    | grep -E "^$2\.[0-9]+\.[0-9]+$" | sort -V | tail -n1
}

v4=$(latest_nuget Fingerprint.ServerSdk 8) \
  || { echo "::error::.NET v4 NuGet lookup failed"; exit 1; }
v3=$(latest_nuget FingerprintPro.ServerSdk 7) \
  || { echo "::error::.NET v3 NuGet lookup failed"; exit 1; }

sed -i \
  -e "s|Include=\"Fingerprint\.ServerSdk\" Version=\"8\.[^\"]*\"|Include=\"Fingerprint.ServerSdk\" Version=\"$v4\"|" \
  -e "s|Include=\"FingerprintPro\.ServerSdk\" Version=\"7\.[^\"]*\"|Include=\"FingerprintPro.ServerSdk\" Version=\"$v3\"|" \
  projects/dotnet-sdk/dotnet-sdk.csproj

echo "Dotnet: Fingerprint.ServerSdk $v4, FingerprintPro.ServerSdk $v3"
