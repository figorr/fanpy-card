#!/usr/bin/env bash
set -euo pipefail
version="$1"
: "${HA_VERSION:=2025.9.3}"
echo "Updating files to version $version and HA $HA_VERSION"
jq --arg ver "$version" '.version = $ver' package.json > tmp.json && mv tmp.json package.json
jq --arg ver "$version" '.version = $ver | .packages[""].version = $ver' package-lock.json > tmp.json && mv tmp.json package-lock.json
jq --arg ver "$HA_VERSION" '.homeassistant = $ver' hacs.json > tmp.json && mv tmp.json hacs.json
echo "Files updated."
