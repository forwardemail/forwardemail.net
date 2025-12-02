#!/bin/bash
# Detect base physical block device for a given directory
# Usage: detect-block-device.sh <directory>

set -e

DATA_DIR="$1"

if [ -z "$DATA_DIR" ]; then
  echo "ERROR: No directory specified" >&2
  exit 1
fi

# Get the device from df
DEVICE=$(df "$DATA_DIR" 2>/dev/null | tail -1 | awk '{print $1}')
if [ -z "$DEVICE" ]; then
  echo "ERROR: Could not detect device for $DATA_DIR" >&2
  exit 1
fi

# Extract just the device name (without /dev/ or /dev/mapper/)
TARGET_NAME=$(basename "$DEVICE")

# Use lsblk with JSON output for reliable parsing
# Get ALL block devices and find which disk contains our target
BASE_DEVICE=$(lsblk -J -o NAME,TYPE 2>/dev/null | \
  python3 -c "
import sys, json

target = '$TARGET_NAME'
data = json.load(sys.stdin)

def contains_device(device, target_name):
    '''Recursively check if this device or its children contain the target'''
    if device.get('name') == target_name:
        return True
    for child in device.get('children', []):
        if contains_device(child, target_name):
            return True
    return False

# Find the disk that contains our target device
for device in data['blockdevices']:
    if device.get('type') == 'disk' and contains_device(device, target):
        print(device['name'])
        sys.exit(0)

sys.exit(1)
" 2>/dev/null)

if [ -z "$BASE_DEVICE" ]; then
  echo "ERROR: Could not find base physical device for $DEVICE" >&2
  echo "DEBUG: Target device name: $TARGET_NAME" >&2
  echo "DEBUG: lsblk output:" >&2
  lsblk -s "$DEVICE" >&2
  exit 1
fi

echo "$BASE_DEVICE"
