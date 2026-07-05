#!/bin/bash

set -e  # Exit script on error

# Derive paths from this script's location so the install dir can live anywhere
SELF_HOST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$SELF_HOST_DIR/.env"

# Bucket is configurable via BACKUP_BUCKET in .env (or the environment)
if [[ -z "$BACKUP_BUCKET" && -f "$ENV_FILE" ]]; then
  BACKUP_BUCKET="$(grep -E '^BACKUP_BUCKET=' "$ENV_FILE" | head -n 1 | cut -d'=' -f2-)"
fi

SQLITE_DATA_DIR="$SELF_HOST_DIR/sqlite-data"
BACKUP_DIR="$SELF_HOST_DIR/sqlite-backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
BACKUP_NAME="sqlite-backup-$TIMESTAMP"
TAR_FILE="$BACKUP_DIR/$BACKUP_NAME.tgz"
RETENTION_DAYS=7

S3_BUCKET="${BACKUP_BUCKET:-forwardemail-selfhosted}"
S3_PATH="s3://$S3_BUCKET/sqlite-backups/"

# 0 0 * * * <SELF_HOST_DIR>/scripts/backup-sqlite.sh >> /var/log/sqlite-backup.log 2>&1

# NOTE: restore
# aws s3 cp s3://<bucket>/sqlite-backups/sqlite-backup-YYYY-MM-DD_HH-MM.tgz /tmp/sqlite-backup.tgz
# tar -xzf /tmp/sqlite-backup.tgz -C <SELF_HOST_DIR>/sqlite-data/
# restart services

if [[ ! -d "$SQLITE_DATA_DIR" ]]; then
    echo "No sqlite data directory at $SQLITE_DATA_DIR — nothing to back up."
    exit 0
fi

mkdir -p "$BACKUP_DIR"

# The mailbox files are encrypted at rest (per-alias keys), so a file-level
# copy is safe to store off-site. Archiving the whole directory captures each
# database together with its -wal/-shm siblings, which keeps a live database
# recoverable (sqlite replays the WAL on next open).
echo "Creating sqlite backup archive..."
tar -czf "$TAR_FILE" -C "$SQLITE_DATA_DIR" .

# Delete old backups
echo "Removing backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "sqlite-backup-*.tgz" -mtime +$RETENTION_DAYS -exec rm -f {} \;

# Upload to S3
echo "Uploading to S3..."

aws s3api create-bucket --bucket "$S3_BUCKET" 2>/dev/null || true
if aws s3 cp "$TAR_FILE" "$S3_PATH"; then
    echo "Backup successfully uploaded to S3: $S3_PATH"
else
    echo "Error uploading backup to S3." >&2
    exit 1
fi

echo "SQLite backup process finished!"
