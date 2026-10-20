#!/usr/bin/env bash

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

v4=$(pnpm view "@fingerprint/node-sdk@^7" version) \
  || { echo "::error::Node v4 version lookup failed"; exit 1; }
v3=$(pnpm view "@fingerprintjs/fingerprintjs-pro-server-api@^6" version) \
  || { echo "::error::Node v3 version lookup failed"; exit 1; }
# `pnpm view` can print nothing and still exit 0 when no version matches
[ -n "$v4" ] && [ -n "$v3" ] || {
  echo "::error::Node version lookup returned no version"; exit 1
}
pnpm --filter node-sdk add --save-exact --ignore-scripts "@fingerprint/node-sdk@$v4" \
    "@fingerprintjs/fingerprintjs-pro-server-api@$v3"
pnpm --filter conductor add --save-exact --ignore-scripts "@fingerprint/node-sdk@$v4" \
    "@fingerprintjs/fingerprintjs-pro-server-api@$v3"

echo "NodeJS: node-sdk $v4 & $v3"
