#!/bin/bash

set -e  # Exit script on any error

# Derive paths from this script's location so the install dir can live anywhere
SELF_HOST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$SELF_HOST_DIR/.env"

# Bucket is configurable via BACKUP_BUCKET in .env (or the environment)
if [[ -z "$BACKUP_BUCKET" && -f "$ENV_FILE" ]]; then
  BACKUP_BUCKET="$(grep -E '^BACKUP_BUCKET=' "$ENV_FILE" | head -n 1 | cut -d'=' -f2-)"
fi

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
RETENTION_DAYS=7
CONTAINER_BACKUP_DIR="/backups"
BACKUP_DIR="$SELF_HOST_DIR/mongo-backups"
BACKUP_NAME="mongo-backup-$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
TAR_FILE="$BACKUP_DIR/$BACKUP_NAME.tgz"

S3_BUCKET="${BACKUP_BUCKET:-forwardemail-selfhosted}"
S3_PATH="s3://$S3_BUCKET/mongo-backups/"

# 0 0 * * * <SELF_HOST_DIR>/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1

# NOTE: restore
# aws s3 cp s3://<bucket>/mongo-backups/mongo-backup-YYYY-MM-DD_HH-MM.tgz /tmp/mongo-backup.tgz
# tar -xzf /tmp/mongo-backup.tgz -C /tmp
# docker exec -i mongodb mongorestore --drop --dir "/tmp/mongo-backup-YYYY-MM-DD_HH-MM"

mkdir -p "$BACKUP_DIR"

echo "Starting MongoDB backup..."
docker exec mongodb mongodump --out "$CONTAINER_BACKUP_DIR/$BACKUP_NAME"

echo "Compressing backup..."
tar -czf "$TAR_FILE" -C "$BACKUP_DIR" "$BACKUP_NAME"

echo "Cleaning up uncompressed backup..."
rm -rf "$BACKUP_PATH"

# Delete old backups
echo "Removing backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "mongo-backup-*.tgz" -mtime +$RETENTION_DAYS -exec rm -f {} \;

# Upload to S3 if enabled
echo "Uploading to S3..."

aws s3api create-bucket --bucket "$S3_BUCKET" 2>/dev/null || true
if aws s3 cp "$TAR_FILE" "$S3_PATH"; then
    echo "Backup successfully uploaded to S3: $S3_PATH"
else
    echo "Error uploading backup to S3." >&2
    exit 1
fi

echo "MongoDB backup process completed!"
