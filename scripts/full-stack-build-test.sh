#!/usr/bin/env bash
# Full stack build test: backend (Maven; includes datanode-ui).
# Exits 0 only if build succeeds. For CI or local verification.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

JAVA17_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"

if [[ -d "$JAVA17_HOME" ]]; then
  export JAVA_HOME="$JAVA17_HOME"
  export PATH="$JAVA_HOME/bin:$PATH"
fi

echo "=== Full stack build test ==="
echo ""

echo "--- Backend (Maven: commons, datanode-ui, datanode) ---"
if ! mvn -q install -DskipTests -pl datanode -am; then
  echo "FAIL: Backend build failed."
  exit 1
fi
echo "OK: Backend build succeeded."
echo ""

echo "=== Full stack build test passed ==="
