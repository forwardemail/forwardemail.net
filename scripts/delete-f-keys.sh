#!/bin/bash

#
# Delete Fingerprint Keys Without TTL
#
# Processes f:* keys in batches of 50000 with 5 second delays.
# Uses UNLINK for non-blocking deletion.
#
# Usage:
#   ./delete-f-keys.sh
#

set -e

BATCH_SIZE=50000
DELAY=5
REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"
REDIS_DB="${REDIS_DB:-0}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LUA_SCRIPT="${SCRIPT_DIR}/delete-f-keys-batch.lua"

if [ ! -f "$LUA_SCRIPT" ]; then
  echo "Error: Lua script not found at $LUA_SCRIPT"
  exit 1
fi

if ! command -v redis-cli &> /dev/null; then
  echo "Error: redis-cli not found"
  exit 1
fi

TOTAL_DELETED=0
TOTAL_CHECKED=0
BATCH_COUNT=0
CURSOR="0"

echo "Deleting f:* keys without TTL"
echo "Batch size: $BATCH_SIZE, Delay: ${DELAY}s"
echo ""

while true; do
  BATCH_COUNT=$((BATCH_COUNT + 1))
  
  # Run Lua script
  RESULT=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -n "$REDIS_DB" --eval "$LUA_SCRIPT" , "$CURSOR" "$BATCH_SIZE")
  
  # Parse result
  DELETED=$(echo "$RESULT" | sed -n '1p')
  CHECKED=$(echo "$RESULT" | sed -n '2p')
  CURSOR=$(echo "$RESULT" | sed -n '3p')
  
  TOTAL_DELETED=$((TOTAL_DELETED + DELETED))
  TOTAL_CHECKED=$((TOTAL_CHECKED + CHECKED))
  
  echo "[Batch $BATCH_COUNT] Checked: $CHECKED, Deleted: $DELETED (Total: $TOTAL_DELETED deleted, $TOTAL_CHECKED checked)"
  
  if [ "$CURSOR" = "0" ]; then
    echo ""
    echo "COMPLETE: $TOTAL_DELETED keys deleted, $TOTAL_CHECKED keys checked"
    break
  fi
  
  sleep "$DELAY"
done

exit 0
