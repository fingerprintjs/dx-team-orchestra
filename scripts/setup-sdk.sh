#!/bin/bash
set -e

LANGUAGE=$1        # node, java, dotnet, go, python, php
EVENT_NAME=$2      # workflow_dispatch, push, pull_request, schedule
SDK_VERSION=$3     # SDK version or "latest"

GITHUB_REPO="fingerprintjs"

case $LANGUAGE in
    "node")   REPO_NAME="fingerprintjs-pro-server-api-node-sdk" ;;
    "java")   REPO_NAME="fingerprint-pro-server-api-java-sdk" ;;
    "dotnet") REPO_NAME="fingerprint-pro-server-api-dotnet-sdk" ;;
    "go")     REPO_NAME="fingerprint-pro-server-api-go-sdk" ;;
    "python") REPO_NAME="fingerprint-pro-server-api-python-sdk" ;;
    "php")    REPO_NAME="fingerprint-pro-server-api-php-sdk" ;;
    *)
        echo "Unknown SDK language: $LANGUAGE"
        exit 1
        ;;
esac

echo "Setting up $LANGUAGE SDK..."

if [[ "$EVENT_NAME" != "workflow_dispatch" || -z "$SDK_VERSION" || "$SDK_VERSION" == "latest" ]]; then
    echo "Fetching latest release from GitHub for $REPO_NAME..."

    SDK_VERSION=$(curl -s "https://api.github.com/repos/$GITHUB_REPO/$REPO_NAME/releases/latest" | jq -r '.tag_name')

    if [[ -z "$SDK_VERSION" || "$SDK_VERSION" == "null" ]]; then
        echo "Failed to fetch latest version for $LANGUAGE from GitHub!"
        exit 1
    fi
fi

if [[ "$LANGUAGE" == "php"  || "$LANGUAGE" == "python" || "$LANGUAGE" == "dotnet" || "$LANGUAGE" == "node" ]]; then
    SDK_VERSION=${SDK_VERSION#v}  # Remove leading `v` if presented
fi

if [[ "$LANGUAGE" == "node" ]]; then
    # Node.js: If SDK_VERSION has only version without full tag, add `@fingerprintjs/fingerprintjs-pro-server-api@`
    if [[ "$SDK_VERSION" != @* ]]; then
        SDK_VERSION="@fingerprintjs/fingerprintjs-pro-server-api@$SDK_VERSION"
    fi
fi

if [[ "$LANGUAGE" == "java" || "$LANGUAGE" == "go" ]]; then
    # Add leading `v`, if absent
    [[ "$SDK_VERSION" != v* ]] && SDK_VERSION="v$SDK_VERSION"
fi

echo "Using SDK version: $SDK_VERSION"

case $LANGUAGE in
    "node")
        pnpm install $SDK_VERSION
        ;;
    "java")
        sed -i "s|com.github.fingerprintjs:fingerprint-pro-server-api-java-sdk:[^\"']*|com.github.fingerprintjs:fingerprint-pro-server-api-java-sdk:$SDK_VERSION|g" build.gradle.kts
        ./gradlew dependencies --refresh-dependencies
        ;;
    "dotnet")
        dotnet add package FingerprintPro.ServerSdk --version $SDK_VERSION
        ;;
    "go")
        MAJOR_VERSION=$(echo $SDK_VERSION | cut -d'.' -f1)
        go get github.com/fingerprintjs/fingerprint-pro-server-api-go-sdk/$MAJOR_VERSION@$SDK_VERSION
        ;;
    "python")
        pip install "fingerprint_pro_server_api_sdk==$SDK_VERSION"
        ;;
    "php")
        composer require fingerprint/fingerprint-pro-server-api-sdk:$SDK_VERSION --update-with-dependencies
        ;;
    *)
        echo "Unknown language: $LANGUAGE"
        exit 1
        ;;
esac

echo "$LANGUAGE SDK setup complete!"
