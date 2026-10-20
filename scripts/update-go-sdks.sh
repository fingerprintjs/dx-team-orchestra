#!/usr/bin/env bash

set -euo pipefail
cd "$(git rev-parse --show-toplevel)/projects/go-sdk"

docker run --rm --user "$(id -u):$(id -g)" -v "$PWD":/app -w /app \
  -e GOPATH=/tmp/go -e GOCACHE=/tmp/go-cache golang:1.23 sh -c '
    go get github.com/fingerprintjs/go-sdk/v8@latest \
           github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/v7@latest &&
    go mod tidy'

echo "Go SDK updated."
