#!/usr/bin/env bash

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

latest_gh_tag() {
  git ls-remote --tags --refs "https://github.com/$1.git" | sed 's|.*refs/tags/||' \
    | grep -E "^v$2\.[0-9]+\.[0-9]+$" | sort -V | tail -n1
}

v4=$(latest_gh_tag fingerprintjs/java-sdk 8) \
  || { echo "::error::Java v4 tag lookup failed"; exit 1; }
v3=$(latest_gh_tag fingerprintjs/fingerprint-pro-server-api-java-sdk 7) \
  || { echo "::error::Java v3 tag lookup failed"; exit 1; }

sed -i \
  -e "s|\"com.github.fingerprintjs:java-sdk:v8\.[^\"]*\"|\"com.github.fingerprintjs:java-sdk:$v4\"|" \
  -e "s|\"com.github.fingerprintjs:fingerprint-pro-server-api-java-sdk:v7\.[^\"]*\"|\"com.github.fingerprintjs:fingerprint-pro-server-api-java-sdk:$v3\"|" \
  projects/java-sdk/build.gradle.kts

echo "Java: java-sdk $v4, fingerprint-pro-server-api-java-sdk $v3"
