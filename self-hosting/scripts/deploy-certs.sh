#!/bin/bash

# Copy the current Let's Encrypt certificates into the ssl/ dir the
# containers mount and restart them so they pick the new certs up.
# Registered as certbot's --deploy-hook so renewals propagate automatically.

set -e
set -o pipefail

SELF_HOST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$SELF_HOST_DIR/.env"
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  else
    docker-compose "$@"
  fi
}

DOMAIN="${DOMAIN:-$(grep -E '^DOMAIN=' "$ENV_FILE" 2>/dev/null | head -n 1 | cut -d'=' -f2-)}"

if [[ -z "$DOMAIN" ]]; then
  echo "DOMAIN not set and not found in $ENV_FILE" >&2
  exit 1
fi

# certbot passes RENEWED_LINEAGE when invoked as a deploy hook; prefer it
LIVE_DIR="${RENEWED_LINEAGE:-/etc/letsencrypt/live/$DOMAIN}"

if [[ ! -d "$LIVE_DIR" ]]; then
  LIVE_DIR=$(ls -td /etc/letsencrypt/live/"$DOMAIN"* 2>/dev/null | head -n 1)
fi

if [[ -z "$LIVE_DIR" || ! -d "$LIVE_DIR" ]]; then
  echo "No Let's Encrypt live directory found for $DOMAIN" >&2
  exit 1
fi

echo "Deploying certificates from $LIVE_DIR to $SELF_HOST_DIR/ssl/..."
mkdir -p "$SELF_HOST_DIR/ssl"
cp -L "$LIVE_DIR"/*.pem "$SELF_HOST_DIR/ssl/"

# containers read certs at boot only; restart everything that's running
echo "Restarting services to pick up new certificates..."
compose -f "$DOCKER_COMPOSE_FILE" restart

echo "✅ Certificates deployed."
