#!/bin/bash

# Update the self-hosted stack to the latest release, verify health, and
# roll back to the previous image tag when the new release comes up unhealthy.
#
# 0 1 * * * <SELF_HOST_DIR>/scripts/update.sh >> /var/log/autoupdate.log 2>&1

set -e
set -o pipefail

SELF_HOST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$SELF_HOST_DIR/.env"
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"
GITHUB_REPO="forwardemail/forwardemail.net"
HEALTH_TIMEOUT=120

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  else
    docker-compose "$@"
  fi
}

get_env_value() {
  grep -E "^$1=" "$ENV_FILE" 2>/dev/null | head -n 1 | cut -d'=' -f2-
}

set_env_value() {
  local key="$1"
  local value="$2"
  if grep -qE "^${key}=" "$ENV_FILE"; then
    awk -v k="$key" -v v="$value" 'index($0, k"=") == 1 { print k "=" v; next } { print }' "$ENV_FILE" >"$ENV_FILE.tmp" && mv "$ENV_FILE.tmp" "$ENV_FILE"
  else
    printf '%s=%s\n' "$key" "$value" >>"$ENV_FILE"
  fi
}

wait_for_health() {
  local deadline=$((SECONDS + HEALTH_TIMEOUT))
  while ((SECONDS < deadline)); do
    local unhealthy starting exited
    unhealthy=$(docker ps --filter "health=unhealthy" --format '{{.Names}}')
    starting=$(docker ps --filter "health=starting" --format '{{.Names}}')
    exited=$(compose -f "$DOCKER_COMPOSE_FILE" ps --status exited --format '{{.Name}}' 2>/dev/null || true)
    if [[ -z "$unhealthy" && -z "$starting" && -z "$exited" ]]; then
      return 0
    fi
    sleep 5
  done
  return 1
}

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Checking for updates..."

CURRENT_TAG="$(get_env_value IMAGE_TAG)"
LATEST_TAG=$(curl -fsSL "https://api.github.com/repos/$GITHUB_REPO/releases/latest" | grep '"tag_name"' | head -n 1 | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')

if [[ -z "$LATEST_TAG" ]]; then
  echo "Could not determine the latest release tag; skipping update."
  exit 1
fi

if [[ "$CURRENT_TAG" == "$LATEST_TAG" ]]; then
  echo "Already on latest release ($CURRENT_TAG); nothing to do."
  exit 0
fi

echo "Updating from ${CURRENT_TAG:-latest} to $LATEST_TAG..."

export IMAGE_TAG="$LATEST_TAG"
set_env_value IMAGE_TAG "$LATEST_TAG"

if ! compose -f "$DOCKER_COMPOSE_FILE" pull; then
  echo "Image pull failed; reverting IMAGE_TAG to ${CURRENT_TAG:-latest}."
  set_env_value IMAGE_TAG "${CURRENT_TAG:-latest}"
  exit 1
fi

compose -f "$DOCKER_COMPOSE_FILE" up -d

if wait_for_health; then
  echo "✅ Updated to $LATEST_TAG — all services healthy."
  exit 0
fi

echo "❌ Services unhealthy after updating to $LATEST_TAG — rolling back to ${CURRENT_TAG:-latest}."
compose -f "$DOCKER_COMPOSE_FILE" ps || true

set_env_value IMAGE_TAG "${CURRENT_TAG:-latest}"
export IMAGE_TAG="${CURRENT_TAG:-latest}"
compose -f "$DOCKER_COMPOSE_FILE" up -d

if wait_for_health; then
  echo "Rolled back to ${CURRENT_TAG:-latest} — services healthy again."
else
  echo "⚠️  Rollback completed but some services are still unhealthy; manual attention required."
fi

exit 1
