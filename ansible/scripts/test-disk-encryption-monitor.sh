#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
PLAYBOOKS="$REPO_ROOT/ansible/playbooks"
MONITOR="$PLAYBOOKS/files/disk-encryption-monitor.sh"
TEST_ROOT=$(mktemp -d /tmp/forwardemail-disk-encryption-monitor.XXXXXX)
MOCK_BIN="$TEST_ROOT/bin"
MOCK_ROOT="$TEST_ROOT/mock"

cleanup() {
  rm -rf "$TEST_ROOT"
}
trap cleanup EXIT

install -d -m 0700 "$MOCK_BIN" "$MOCK_ROOT"

bash -n "$MONITOR"
for unit in service timer; do
  sed 's|ExecStart=/usr/local/bin/disk-encryption-monitor.sh|ExecStart=/bin/true|' \
    "$PLAYBOOKS/templates/disk-encryption-monitor.$unit.j2" \
    > "$TEST_ROOT/disk-encryption-monitor.$unit"
done
if ! systemd-analyze verify "$TEST_ROOT/disk-encryption-monitor.service" \
  > "$TEST_ROOT/verify.log" 2>&1; then
  cat "$TEST_ROOT/verify.log" >&2
  exit 1
fi
grep -Fxq 'OnFailure=failure-notification@%n.service' \
  "$TEST_ROOT/disk-encryption-monitor.service"
grep -Fxq 'OnCalendar=daily' "$TEST_ROOT/disk-encryption-monitor.timer"

# A host is described by three files: "mounts" (SOURCE TARGET per line, as
# findmnt lists them), "swaps" (NAME TYPE per line) and "devices" (a device
# path, its kernel name, its TYPE, then the kernel names of the devices
# under it, which become its sysfs "slaves").  findmnt --target answers with
# the longest mount containing a path.
cat > "$MOCK_BIN/findmnt" <<'EOF_FINDMNT'
#!/bin/bash
set -Eeuo pipefail
mounts="${MOCK_ROOT:?}/mounts"
target=''
while (($#)); do
  case "$1" in
    --target) target=$2; shift ;;
  esac
  shift
done
if [[ -z "$target" ]]; then
  cat "$mounts"
  exit 0
fi
best_source='' best_length=-1
while read -r source mount; do
  if [[ "$target" == "$mount" || "$target" == "${mount%/}/"* ]] &&
    ((${#mount} > best_length)); then
    best_source=$source best_length=${#mount}
  fi
done < "$mounts"
printf '%s\n' "$best_source"
EOF_FINDMNT
cat > "$MOCK_BIN/swapon" <<'EOF_SWAPON'
#!/bin/bash
cat "${MOCK_ROOT:?}/swaps"
EOF_SWAPON
cat > "$MOCK_BIN/lsblk" <<'EOF_LSBLK'
#!/bin/bash
set -Eeuo pipefail
device=${!#}
column=''
while (($#)); do
  [[ "$1" == --output ]] && column=$2
  shift
done
while read -r path kname type _; do
  [[ "$path" == "$device" || "/dev/$kname" == "$device" ]] || continue
  case "$column" in
    KNAME) printf '%s\n' "$kname" ;;
    TYPE) printf '%s\n' "$type" ;;
    *) exit 64 ;;
  esac
  exit 0
done < "${MOCK_ROOT:?}/devices"
printf 'lsblk: %s: not a block device\n' "$device" >&2
exit 32
EOF_LSBLK
chmod 0755 "$MOCK_BIN/findmnt" "$MOCK_BIN/swapon" "$MOCK_BIN/lsblk"
# The data directories move under the test root, so they exist here.
DATA="$TEST_ROOT/data"
install -d -m 0700 "$DATA/var/lib/mongodb" "$DATA/var/lib/valkey"
sed "s|^readonly DATA_DIRS=(/var/lib/mongodb /var/lib/valkey)$|readonly DATA_DIRS=($DATA/var/lib/mongodb $DATA/var/lib/valkey)|" \
  "$MONITOR" > "$TEST_ROOT/disk-encryption-monitor.sh"
sed -i "s|^readonly SYS_BLOCK=/sys/class/block$|readonly SYS_BLOCK=$MOCK_ROOT/sys|" \
  "$TEST_ROOT/disk-encryption-monitor.sh"
grep -Fq "readonly DATA_DIRS=($DATA/var/lib/mongodb" "$TEST_ROOT/disk-encryption-monitor.sh"
grep -Fq "readonly SYS_BLOCK=$MOCK_ROOT/sys" "$TEST_ROOT/disk-encryption-monitor.sh"

# The sysfs "slaves" of each device, from the devices file.
build_sys() {
  rm -rf "$MOCK_ROOT/sys"
  local kname slave slaves
  while read -r _ kname _ slaves; do
    mkdir -p "$MOCK_ROOT/sys/$kname/slaves"
    for slave in $slaves; do
      mkdir -p "$MOCK_ROOT/sys/$kname/slaves/$slave"
    done
  done < "$MOCK_ROOT/devices"
}
MONITOR="$TEST_ROOT/disk-encryption-monitor.sh"
export MOCK_ROOT
PATH="$MOCK_BIN:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# A bare-metal host as DEPLOYMENT.md sets it up: LVM on LUKS for /, with
# /boot, the EFI partition, snaps and zram left out of the check.
encrypted_host() {
  cat > "$MOCK_ROOT/mounts" <<'EOF_MOUNTS'
proc /proc
/dev/mapper/ubuntu--vg-ubuntu--lv /
/dev/mapper/ubuntu--vg-ubuntu--lv /DATA
/dev/nvme0n1p2 /boot
/dev/nvme0n1p1 /boot/efi
/dev/loop3 /snap/core20/2318
tmpfs /run
/dev/mapper/ubuntu--vg-ubuntu--lv[/var/lib/docker] /srv/bind
EOF_MOUNTS
  sed -i "s|^\(/dev/mapper/ubuntu--vg-ubuntu--lv\) /DATA$|\1 $DATA|" "$MOCK_ROOT/mounts"
  printf '%s\n' '/swap.img file' '/dev/zram0 partition' > "$MOCK_ROOT/swaps"
  cat > "$MOCK_ROOT/devices" <<'EOF_DEVICES'
/dev/mapper/ubuntu--vg-ubuntu--lv dm-1 lvm dm-0
/dev/mapper/dm_crypt-0 dm-0 crypt nvme0n1p3
/dev/nvme0n1p3 nvme0n1p3 part
/dev/nvme0n1p2 nvme0n1p2 part
/dev/nvme0n1p1 nvme0n1p1 part
/dev/nvme1n1 nvme1n1 disk
/dev/mapper/nvme1n1 dm-2 crypt nvme1n1
/dev/nvme2n1 nvme2n1 disk
/dev/md0 md0 raid1 dm-2 nvme2n1
/dev/vda1 vda1 part
/dev/vda2 vda2 part
EOF_DEVICES
  build_sys
}

# check <expected exit> <expected problem lines...>
check() {
  local expected=$1 status=0
  shift
  bash "$MONITOR" > "$MOCK_ROOT/stdout" 2> "$MOCK_ROOT/stderr" || status=$?
  if [[ "$status" -ne "$expected" ]] ||
    [[ "$(wc -l < "$MOCK_ROOT/stderr")" -ne "$#" ]]; then
    printf 'FAIL: exited %d, expected %d with %d problems\n' \
      "$status" "$expected" "$#" >&2
    cat "$MOCK_ROOT/stdout" "$MOCK_ROOT/stderr" >&2
    exit 1
  fi
  local line
  for line in "$@"; do
    if ! grep -Fxq "not encrypted with LUKS: $line" "$MOCK_ROOT/stderr"; then
      printf 'FAIL: missing problem: %s\n' "$line" >&2
      cat "$MOCK_ROOT/stderr" >&2
      exit 1
    fi
  done
}

encrypted_host
check 0
grep -Fq 'every disk, swap area and data directory is on LUKS' \
  "$MOCK_ROOT/stdout"

# A second data disk that is LUKS passes; a plain one fails, and so does the
# Valkey RDB directory on it.
encrypted_host
printf '%s\n' "/dev/mapper/nvme1n1 $DATA/var/lib/mongodb" >> "$MOCK_ROOT/mounts"
check 0
encrypted_host
printf '%s\n' "/dev/nvme1n1 $DATA/var/lib/valkey" >> "$MOCK_ROOT/mounts"
check 1 \
  "filesystem $DATA/var/lib/valkey is on /dev/nvme1n1" \
  "data directory $DATA/var/lib/valkey is on /dev/nvme1n1"

# A cloud host with a plain disk: /, the swap partition, and the swap file.
encrypted_host
printf '%s\n' '/dev/vda1 /' > "$MOCK_ROOT/mounts"
printf '%s\n' '/dev/vda2 partition' '/swapfile file' > "$MOCK_ROOT/swaps"
check 1 \
  'filesystem / is on /dev/vda1' \
  'swap /dev/vda2 is on /dev/vda2' \
  'swap /swapfile is on /dev/vda1' \
  "data directory $DATA/var/lib/mongodb is on /dev/vda1" \
  "data directory $DATA/var/lib/valkey is on /dev/vda1"

# A plain disk added to the encrypted volume group, or mirrored with an
# encrypted one, leaves part of the data in plain text.
encrypted_host
sed -i 's|^/dev/mapper/ubuntu--vg-ubuntu--lv dm-1 lvm dm-0$|& nvme2n1|' "$MOCK_ROOT/devices"
build_sys
check 1 \
  'filesystem / is on /dev/mapper/ubuntu--vg-ubuntu--lv' \
  "filesystem $DATA is on /dev/mapper/ubuntu--vg-ubuntu--lv" \
  'filesystem /srv/bind is on /dev/mapper/ubuntu--vg-ubuntu--lv' \
  'swap /swap.img is on /dev/mapper/ubuntu--vg-ubuntu--lv' \
  "data directory $DATA/var/lib/mongodb is on /dev/mapper/ubuntu--vg-ubuntu--lv" \
  "data directory $DATA/var/lib/valkey is on /dev/mapper/ubuntu--vg-ubuntu--lv"
encrypted_host
printf '%s\n' '/dev/md0 /srv' >> "$MOCK_ROOT/mounts"
check 1 'filesystem /srv is on /dev/md0'

# A device lsblk does not know is not called encrypted.
encrypted_host
printf '%s\n' '/dev/mapper/unknown /data' >> "$MOCK_ROOT/mounts"
check 1 'filesystem /data is on /dev/mapper/unknown'

printf '%s\n' \
  'PASS: disk encryption monitor renders as verified systemd units, passes LUKS (including LVM on LUKS and bind mounts), skips /boot, snaps and zram, and fails for every plain filesystem, swap area and database directory, including a plain disk under an encrypted volume group or RAID'
