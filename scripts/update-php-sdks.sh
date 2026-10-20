#!/usr/bin/env bash

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

latest_packagist() {
  curl -fsSL "https://repo.packagist.org/p2/$1.json" \
    | jq -r --arg p "$1" '.packages[$p][].version' \
    | sed 's/^v//' \
    | grep -E "^$2\.[0-9]+\.[0-9]+$" | sort -V | tail -n1
}

v4=$(latest_packagist fingerprint/server-sdk 7) \
    || { echo "::error::PHP v4 Packagist lookup failed"; exit 1; }
v3=$(latest_packagist fingerprint/fingerprint-pro-server-api-sdk 6) \
    || { echo "::error::PHP v3 Packagist lookup failed"; exit 1; }

# Skip if nothing changed, otherwise --update-with-dependencies bumps guzzle etc. every day
current_v4=$(jq -r '.require["fingerprint/server-sdk"]' projects/php-sdk/composer.json)
current_v3=$(jq -r '.require["fingerprint/fingerprint-pro-server-api-sdk"]' projects/php-sdk/composer.json)
[ "$current_v4" = "$v4" ] && [ "$current_v3" = "$v3" ] && { echo "PHP: already up to date ($v4, $v3)"; exit 0; }

docker run --rm --user "$(id -u):$(id -g)" -v "$PWD/projects/php-sdk":/app -w /app composer:2 \
  require "fingerprint/server-sdk:$v4" "fingerprint/fingerprint-pro-server-api-sdk:$v3" \
  --update-with-dependencies --no-install --no-interaction

echo "PHP: fingerprint/server-sdk $v4, fingerprint/fingerprint-pro-server-api-sdk $v3"
