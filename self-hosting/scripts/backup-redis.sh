#!/bin/bash

set -e  # Exit script on error

# Derive paths from this script's location so the install dir can live anywhere
SELF_HOST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$SELF_HOST_DIR/.env"

# Bucket is configurable via BACKUP_BUCKET in .env (or the environment)
if [[ -z "$BACKUP_BUCKET" && -f "$ENV_FILE" ]]; then
  BACKUP_BUCKET="$(grep -E '^BACKUP_BUCKET=' "$ENV_FILE" | head -n 1 | cut -d'=' -f2-)"
fi

BACKUP_DIR="$SELF_HOST_DIR/redis-backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
BACKUP_FILE="redis-$TIMESTAMP.rdb"
LOCAL_REDIS_DUMP="/data/dump.rdb"
RETENTION_DAYS=7

S3_BUCKET="${BACKUP_BUCKET:-forwardemail-selfhosted}"
S3_PATH="s3://$S3_BUCKET/redis-backups/"

# 0 0 * * * <SELF_HOST_DIR>/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1

# NOTE: restore
# aws s3 cp s3://<bucket>/redis-backups/redis-YYYY-MM-DD_HH-MM.rdb /tmp/dump.rdb
# mv /tmp/dump.rdb <SELF_HOST_DIR>/redis-data/dump.rdb
# restart services

mkdir -p "$BACKUP_DIR"

echo "Triggering Redis backup..."
docker exec redis redis-cli bgsave

# Wait for Redis to complete the background save
echo "Waiting for Redis to complete BGSAVE..."
while true; do
    SAVE_STATUS=$(docker exec redis redis-cli info persistence | grep "rdb_bgsave_in_progress")
    if [[ "$SAVE_STATUS" == *"0"* ]]; then
        echo "Redis BGSAVE completed."
        break
    fi
    sleep 1
done

# Copy the dump file to backup directory
if docker cp redis:"$LOCAL_REDIS_DUMP" "$BACKUP_DIR/dump.rdb"; then
    mv "$BACKUP_DIR/dump.rdb" "$BACKUP_DIR/$BACKUP_FILE"
    echo "Backup saved to: $BACKUP_DIR/$BACKUP_FILE"
else
    echo "Error: Redis backup failed. Dump file not found!" >&2
    exit 1
fi

# Upload to AWS S3 (if enabled)
echo "Uploading to S3..."

aws s3api create-bucket --bucket "$S3_BUCKET" 2>/dev/null || true
if aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "$S3_PATH"; then
    echo "Backup successfully uploaded to S3: $S3_PATH"
else
    echo "Error uploading backup to S3." >&2
    exit 1
fi

# Cleanup old backups
echo "Deleting backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -name "redis-*.rdb" -mtime +$RETENTION_DAYS -exec rm -f {} \;

echo "Redis backup process finished!"
