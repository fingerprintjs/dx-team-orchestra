#!/bin/bash
set -e

LANGUAGE=$1
SDK_VERSION=$2

MAX_ATTEMPTS=30
INITIAL_DELAY=10
MAX_DELAY=60
CURL_OPTS=(-sf -o /dev/null)

if [[ -z "$LANGUAGE" || -z "$SDK_VERSION" ]]; then
    echo "Usage: wait-for-sdk-availability.sh <language> <version>"
    echo "Languages: node, java, dotnet, go, python, php"
    exit 1
fi

strip_v="${SDK_VERSION#v}"
with_v="v$strip_v"

# Normalize version and build registry check URL per language
case $LANGUAGE in
    "node")
        VERSION="$strip_v"
        CHECK_URL="https://registry.npmjs.org/@fingerprint%2Fnode-sdk/$VERSION"
        ;;
    "java")
        VERSION="$with_v"
        CHECK_URL="https://jitpack.io/com/github/fingerprintjs/java-sdk/$VERSION/java-sdk-$VERSION.pom"
        ;;
    "dotnet")
        VERSION=$(echo "$strip_v" | tr '[:upper:]' '[:lower:]')
        CHECK_URL="https://api.nuget.org/v3-flatcontainer/fingerprint.serversdk/$VERSION/fingerprint.serversdk.nuspec"
        ;;
    "go")
        VERSION="$with_v"
        MAJOR_VERSION=$(echo "$VERSION" | cut -d'.' -f1)
        CHECK_URL="https://proxy.golang.org/github.com/fingerprintjs/go-sdk/$MAJOR_VERSION/@v/$VERSION.info"
        ;;
    "python")
        VERSION="$strip_v"
        CHECK_URL="https://pypi.org/pypi/fingerprint-server-sdk/$VERSION/json"
        ;;
    "php")
        VERSION="$strip_v"
        CHECK_URL="https://repo.packagist.org/p2/fingerprint/server-sdk.json"
        ;;
    *)
        echo "Unknown language: $LANGUAGE"
        exit 1
        ;;
esac

check_version_available() {
    # PHP requires parsing the JSON response to find the specific version
    if [[ "$LANGUAGE" == "php" ]]; then
        curl -sf "$CHECK_URL" | \
            jq -e ".packages[\"fingerprint/server-sdk\"][] | select(.version == \"$VERSION\")" > /dev/null
    else
        curl "${CURL_OPTS[@]}" "$CHECK_URL"
    fi
}

echo "Waiting for $LANGUAGE SDK version $VERSION to become available on the package registry..."

delay=$INITIAL_DELAY
for attempt in $(seq 1 $MAX_ATTEMPTS); do
    if check_version_available; then
        echo "Version $VERSION is available on the registry (attempt $attempt)"
        exit 0
    fi

    if [[ $attempt -eq $MAX_ATTEMPTS ]]; then
        echo "ERROR: Version $VERSION not available after $MAX_ATTEMPTS attempts. Giving up."
        exit 1
    fi

    echo "Attempt $attempt/$MAX_ATTEMPTS: Version $VERSION not yet available. Retrying in ${delay}s..."
    sleep "$delay"

    delay=$((delay * 2))
    if [[ $delay -gt $MAX_DELAY ]]; then
        delay=$MAX_DELAY
    fi
done
