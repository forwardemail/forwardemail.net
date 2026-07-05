#!/bin/bash

# Warn loudly when the TLS certificate is close to expiry. Installed as a
# weekly cron for manually-issued (DNS-01 wildcard) certs, which certbot
# cannot renew unattended.
#
# 0 8 * * 1 <SELF_HOST_DIR>/scripts/check-cert-expiry.sh >> /var/log/cert-expiry.log 2>&1

set -e

SELF_HOST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CERT_FILE="$SELF_HOST_DIR/ssl/fullchain.pem"
WARN_DAYS=21

if [[ ! -f "$CERT_FILE" ]]; then
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] No certificate found at $CERT_FILE"
  exit 1
fi

EXPIRY_DATE=$(openssl x509 -enddate -noout -in "$CERT_FILE" | cut -d'=' -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(((EXPIRY_EPOCH - NOW_EPOCH) / 86400))

if ((DAYS_LEFT <= 0)); then
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] ❌ CERTIFICATE EXPIRED ($EXPIRY_DATE)!"
  echo "All TLS services (web, IMAP, SMTP, ...) are failing. Renew immediately:"
  echo "  run the setup script and choose 'Renew Certificates'"
  exit 2
fi

if ((DAYS_LEFT <= WARN_DAYS)); then
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] ⚠️  Certificate expires in $DAYS_LEFT days ($EXPIRY_DATE)."
  echo "Manually-issued wildcard certificates do NOT auto-renew. Renew now:"
  echo "  run the setup script and choose 'Renew Certificates'"
  exit 0
fi

echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Certificate OK — $DAYS_LEFT days until expiry."
