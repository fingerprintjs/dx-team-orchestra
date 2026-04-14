#!/bin/bash
set -e

LANGUAGE=$1        # node, java, dotnet, go, python, php
EVENT_NAME=$2      # workflow_dispatch, push, pull_request, schedule
SDK_VERSION=$3     # SDK version or "latest"

GITHUB_REPO="fingerprintjs"

case $LANGUAGE in
    "node")   REPO_NAME="node-sdk" ;;
    "java")   REPO_NAME="java-sdk" ;;
    "dotnet") REPO_NAME="dotnet-sdk" ;;
    "go")     REPO_NAME="go-sdk" ;;
    "python") REPO_NAME="python-sdk" ;;
    "php")    REPO_NAME="php-sdk" ;;
    *)
        echo "Unknown SDK language: $LANGUAGE"
        exit 1
        ;;
esac

echo "Setting up $LANGUAGE SDK..."

if [[ "$EVENT_NAME" != "workflow_dispatch" && "$EVENT_NAME" != "repository_dispatch" || -z "$SDK_VERSION" || "$SDK_VERSION" == "latest" ]]; then
    echo "Fetching latest release from GitHub for $REPO_NAME..."
    SDK_VERSION=$(curl -s "https://api.github.com/repos/$GITHUB_REPO/$REPO_NAME/releases/latest" | jq -r '.tag_name')

    if [[ -z "$SDK_VERSION" || "$SDK_VERSION" == "null" ]]; then
        echo "Failed to fetch latest version for $LANGUAGE from GitHub!"
        exit 1
    fi
fi

if [[ "$LANGUAGE" == "php" || "$LANGUAGE" == "python" || "$LANGUAGE" == "dotnet" || "$LANGUAGE" == "node" ]]; then
    SDK_VERSION=${SDK_VERSION#v}  # Remove leading `v` if presented
fi

if [[ "$LANGUAGE" == "node" ]]; then
    # Node.js: If SDK_VERSION has only version without full tag, add the correct package name
    if [[ "$SDK_VERSION" != @* ]]; then
        SDK_VERSION="@fingerprint/node-sdk@$SDK_VERSION"
    fi
fi

if [[ "$LANGUAGE" == "java" || "$LANGUAGE" == "go" ]]; then
    # Add leading `v`, if absent
    [[ "$SDK_VERSION" != v* ]] && SDK_VERSION="v$SDK_VERSION"
fi

replace_java_dep() {
  local file="build.gradle.kts"
  local pattern="com.github.fingerprintjs:java-sdk:[^\"' ]*"
  local replacement="com.github.fingerprintjs:java-sdk:$SDK_VERSION"

  if command -v gsed >/dev/null 2>&1; then
    # GNU sed (often installed as gsed on macOS via Homebrew)
    gsed -i "s|$pattern|$replacement|g" "$file"
  else
    case "$(uname -s)" in
      Darwin)
        # macOS BSD sed requires a zero-length backup suffix: -i ''
        sed -i '' "s|$pattern|$replacement|g" "$file"
        ;;
      *)
        # Linux (GNU sed)
        sed -i "s|$pattern|$replacement|g" "$file"
        ;;
    esac
  fi
}

echo "Using SDK version: $SDK_VERSION"

case $LANGUAGE in
    "node")
        pnpm install $SDK_VERSION
        ;;
    "java")
        replace_java_dep
        ./gradlew dependencies --refresh-dependencies
        ;;
    "dotnet")
        dotnet add package Fingerprint.ServerSdk --version $SDK_VERSION
        ;;
    "go")
        MAJOR_VERSION=$(echo $SDK_VERSION | cut -d'.' -f1)
        go get github.com/fingerprintjs/go-sdk/$MAJOR_VERSION@$SDK_VERSION
        ;;
    "python")
        pip install "fingerprint-server-sdk==$SDK_VERSION"
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
