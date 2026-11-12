#!/bin/bash
# Disk Encryption Monitor Script
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Fails (so OnFailure sends the email, and SMS where SMS is set up) when a
# disk is not encrypted with LUKS: every mounted filesystem on a disk, every
# swap area, and the MongoDB and Valkey data directories (the database files
# and the RDB snapshot).  /boot cannot be encrypted and is skipped.
# Usage: Executed by systemd timer daily and at boot

set -uo pipefail

readonly DATA_DIRS=(/var/lib/mongodb /var/lib/valkey)
readonly SYS_BLOCK=/sys/class/block

problems=()

# Whether a block device is LUKS, or every device under it (LVM, RAID) is: a
# plain disk added to an encrypted volume group or RAID still fails.
on_luks() {
  local name slave found=false
  name=$(lsblk --nodeps --noheadings --output KNAME "$1" 2>/dev/null)
  [[ -n "$name" ]] || return 1
  if [[ "$(lsblk --nodeps --noheadings --output TYPE "/dev/$name" \
    2>/dev/null)" == crypt ]]; then
    return 0
  fi
  for slave in "$SYS_BLOCK/$name/slaves/"*; do
    [[ -e "$slave" ]] || continue
    found=true
    on_luks "/dev/${slave##*/}" || return 1
  done
  [[ "$found" == true ]]
}

# Each problem once (bind mounts list a device more than once).
declare -A seen=()
problem() {
  [[ -n "${seen[$1]:-}" ]] && return
  seen[$1]=1
  problems+=("$1")
}

# The block device holding a path (btrfs adds the subvolume in brackets).
device_of() {
  local source
  source=$(findmnt --noheadings --output SOURCE --target "$1" 2>/dev/null |
    head -n 1)
  printf '%s\n' "${source%%\[*}"
}

while read -r source target; do
  source=${source%%\[*}
  case "$source" in
    /dev/loop* | /dev/zram* | /dev/sr*) continue ;;
    /dev/*) ;;
    *) continue ;;
  esac
  case "$target" in
    /boot | /boot/*) continue ;;
  esac
  if ! on_luks "$source"; then
    problem "filesystem $target is on $source"
  fi
done < <(findmnt --noheadings --raw --output SOURCE,TARGET)

while read -r name type; do
  case "$type" in
    file) device=$(device_of "$name") ;;
    *) device=$name ;;
  esac
  case "$device" in
    /dev/zram*) continue ;;
  esac
  if ! on_luks "$device"; then
    problem "swap $name is on $device"
  fi
done < <(swapon --show=NAME,TYPE --noheadings --raw 2>/dev/null)

for dir in "${DATA_DIRS[@]}"; do
  [[ -d "$dir" ]] || continue
  device=$(device_of "$dir")
  if ! on_luks "$device"; then
    problem "data directory $dir is on $device"
  fi
done

if ((${#problems[@]} == 0)); then
  echo "every disk, swap area and data directory is on LUKS"
  exit 0
fi

printf 'not encrypted with LUKS: %s\n' "${problems[@]}" >&2
exit 1
