#!/usr/bin/env bash

set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

latest_pypi() {
  curl -fsSL "https://pypi.org/pypi/$1/json" \
    | jq -r '.releases | to_entries[] | select(any(.value[]; .yanked | not)) | .key' \
    | grep -E "^$2\.[0-9]+\.[0-9]+$" | sort -V | tail -n1
}

v4=$(latest_pypi fingerprint-server-sdk 9) \
    || { echo "::error::Python v4 PyPI lookup failed"; exit 1; }
v3=$(latest_pypi fingerprint_pro_server_api_sdk 8) \
    || { echo "::error::Python v3 PyPI lookup failed"; exit 1; }

sed -i \
  -e "s|^fingerprint-server-sdk==9\..*|fingerprint-server-sdk==$v4|" \
  -e "s|^fingerprint_pro_server_api_sdk==8\..*|fingerprint_pro_server_api_sdk==$v3|" \
  projects/python-sdk/requirements.txt

echo "Python: fingerprint-server-sdk $v4, fingerprint_pro_server_api_sdk $v3"
