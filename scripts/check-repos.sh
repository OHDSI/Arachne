#!/usr/bin/env bash
# Check only the Maven repositories declared in this project (commons + datanode).
# Run from repo root: ./scripts/check-repos.sh

set -e

check() {
  local name="$1"
  local url="$2"
  if curl -fsS --connect-timeout 5 --max-time 10 -o /dev/null -w "%{http_code}" "$url" > /tmp/check_repo_code 2>/dev/null; then
    code=$(cat /tmp/check_repo_code)
    if [[ "$code" =~ ^(200|301|302|401|403)$ ]]; then
      echo "OK   $name ($code)"
    else
      echo "FAIL $name (HTTP $code)"
    fi
  else
    echo "FAIL $name (timeout or connection error)"
  fi
}

echo "Checking Maven repositories (commons + datanode)..."
echo ""

# Odysseus (commons + datanode)
check "Odysseus snapshots" "https://nexus.odysseusinc.com/repository/community-libs-snapshot-local"
check "Odysseus releases"  "https://nexus.odysseusinc.com/repository/community-libs-release-local"

# Other datanode/engine repos
check "SpringSource"      "http://repo.springsource.org/release"
check "Alfresco"           "https://artifacts.alfresco.com/nexus/content/repositories/public/"
check "Redshift"           "https://s3.amazonaws.com/redshift-maven-repository/release"

# Default resolution (no explicit repo in root/commons; datanode transitives)
check "Maven Central"      "https://repo1.maven.org/maven2/"

echo ""
echo "Done. OK = reachable; FAIL = timeout or error."
