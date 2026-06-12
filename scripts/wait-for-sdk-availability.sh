#!/bin/bash
set -e

LANGUAGE=$1
SDK_VERSION=$2
PACKAGE_NAME=$3    # Optional: custom package name (empty = use default)

MAX_ATTEMPTS=30
INITIAL_DELAY=10
MAX_DELAY=60
CURL_OPTS=(-sf -o /dev/null)

if [[ -z "$LANGUAGE" || -z "$SDK_VERSION" ]]; then
    echo "Usage: wait-for-sdk-availability.sh <language> <version> [package-name]"
    echo "Languages: node, java, dotnet, go, python, php"
    exit 1
fi

strip_v="${SDK_VERSION#v}"
with_v="v$strip_v"

# Normalize version and build registry check URL per language
case $LANGUAGE in
    "node")
        VERSION="$strip_v"
        NODE_PACKAGE="${PACKAGE_NAME:-@fingerprint/node-sdk}"
        ENCODED_PACKAGE="${NODE_PACKAGE/\//%2F}"
        CHECK_URL="https://registry.npmjs.org/${ENCODED_PACKAGE}/$VERSION"
        ;;
    "java")
        VERSION="$with_v"
        JAVA_PACKAGE="${PACKAGE_NAME:-com.github.fingerprintjs:java-sdk}"
        JAVA_GROUP=$(echo "$JAVA_PACKAGE" | cut -d: -f1)
        JAVA_ARTIFACT=$(echo "$JAVA_PACKAGE" | cut -d: -f2)
        JAVA_GROUP_PATH=$(echo "$JAVA_GROUP" | tr '.' '/')
        CHECK_URL="https://jitpack.io/${JAVA_GROUP_PATH}/${JAVA_ARTIFACT}/${VERSION}/${JAVA_ARTIFACT}-${VERSION}.pom"
        ;;
    "dotnet")
        VERSION=$(echo "$strip_v" | tr '[:upper:]' '[:lower:]')
        DOTNET_PACKAGE="${PACKAGE_NAME:-Fingerprint.ServerSdk}"
        DOTNET_LOWER=$(echo "$DOTNET_PACKAGE" | tr '[:upper:]' '[:lower:]')
        CHECK_URL="https://api.nuget.org/v3-flatcontainer/${DOTNET_LOWER}/${VERSION}/${DOTNET_LOWER}.nuspec"
        ;;
    "go")
        VERSION="$with_v"
        MAJOR_VERSION=$(echo "$VERSION" | cut -d'.' -f1)
        GO_MODULE="${PACKAGE_NAME:-github.com/fingerprintjs/go-sdk}"
        CHECK_URL="https://proxy.golang.org/${GO_MODULE}/${MAJOR_VERSION}/@v/${VERSION}.info"
        ;;
    "python")
        VERSION="$strip_v"
        PY_PACKAGE="${PACKAGE_NAME:-fingerprint-server-sdk}"
        CHECK_URL="https://pypi.org/pypi/${PY_PACKAGE}/${VERSION}/json"
        ;;
    "php")
        VERSION="$strip_v"
        PHP_PACKAGE="${PACKAGE_NAME:-fingerprint/server-sdk}"
        CHECK_URL="https://repo.packagist.org/p2/${PHP_PACKAGE}.json"
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
            jq -e ".packages[\"${PHP_PACKAGE}\"][] | select(.version == \"$VERSION\")" > /dev/null
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
