#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
TEMPLATES="$REPO_ROOT/ansible/playbooks/templates"
TEST_ROOT=$(mktemp -d /tmp/forwardemail-database-health-check.XXXXXX)
PLAYBOOK="$TEST_ROOT/render.yml"
OUTPUT_DIR="$TEST_ROOT/rendered"
MOCK_BIN="$TEST_ROOT/bin"
MOCK_ROOT="$TEST_ROOT/mock"

cleanup() {
  rm -rf "$TEST_ROOT"
}
trap cleanup EXIT

install -d -m 0700 \
  "$OUTPUT_DIR" \
  "$MOCK_BIN" \
  "$MOCK_ROOT" \
  "$TEST_ROOT/ansible-local" \
  "$TEST_ROOT/ansible-remote"
cat > "$PLAYBOOK" <<EOF_PLAYBOOK
---
- name: Render database health checks
  hosts: localhost
  connection: local
  gather_facts: false
  vars:
    profiles:
      - { name: mongod, service: mongod, port: '27017' }
      - { name: valkey, service: valkey-server, port: '6380' }
  tasks:
    - name: Render each health check script, service and timer
      ansible.builtin.template:
        src: "$TEMPLATES/database-health-check.{{ item.1 }}.j2"
        dest: "$OUTPUT_DIR/{{ item.0.name }}-health-check.{{ item.1 }}"
        mode: '0700'
      loop: "{{ profiles | product(['sh', 'service', 'timer']) | list }}"
      vars:
        database_health_check_name: "{{ item.0.name }}"
        database_health_check_service: "{{ item.0.service }}"
        database_health_check_port: "{{ item.0.port }}"
EOF_PLAYBOOK

if ! ANSIBLE_CONFIG="$REPO_ROOT/ansible.cfg" \
  ANSIBLE_LOCAL_TEMP="$TEST_ROOT/ansible-local" \
  ANSIBLE_REMOTE_TEMP="$TEST_ROOT/ansible-remote" \
  ansible-playbook -i localhost, "$PLAYBOOK" \
  > "$TEST_ROOT/ansible.log" 2>&1; then
  cat "$TEST_ROOT/ansible.log" >&2
  exit 1
fi

for name in mongod valkey; do
  bash -n "$OUTPUT_DIR/$name-health-check.sh"
  for unit in service timer; do
    sed \
      "s|ExecStart=/usr/local/bin/$name-health-check.sh|ExecStart=/bin/true|" \
      "$OUTPUT_DIR/$name-health-check.$unit" \
      > "$OUTPUT_DIR/verify-$name-health-check.$unit"
  done
  if ! systemd-analyze verify \
    "$OUTPUT_DIR/verify-$name-health-check.service" \
    > "$OUTPUT_DIR/verify-$name.log" 2>&1; then
    cat "$OUTPUT_DIR/verify-$name.log" >&2
    exit 1
  fi
  grep -Fxq \
    'OnFailure=failure-notification@%n.service' \
    "$OUTPUT_DIR/$name-health-check.service"
done

# The real timeouts are 15 seconds per attempt and 10 seconds between
# attempts; the harness keeps the three attempts and shortens both.
for name in mongod valkey; do
  sed \
    -e 's|^readonly TIMEOUT_SECONDS=15$|readonly TIMEOUT_SECONDS=1|' \
    -e 's|^readonly RETRY_SECONDS=10$|readonly RETRY_SECONDS=0|' \
    -e "s|/usr/local/bin/mongosh|$MOCK_BIN/mongosh|" \
    "$OUTPUT_DIR/$name-health-check.sh" > "$TEST_ROOT/$name-health-check.sh"
  chmod 0700 "$TEST_ROOT/$name-health-check.sh"
done
grep -Fq 'readonly TIMEOUT_SECONDS=1' "$TEST_ROOT/mongod-health-check.sh"
grep -Fq 'readonly RETRY_SECONDS=0' "$TEST_ROOT/valkey-health-check.sh"

# systemctl reports the database unit's state from the next line of the
# states file, and each client answers with the next line of the replies file,
# or hangs on "hang" (in both, the last line repeats).
cat > "$MOCK_BIN/systemctl" <<'EOF_SYSTEMCTL'
#!/bin/bash
set -Eeuo pipefail
mock_root=${MOCK_ROOT:?}
[[ "$1 $2" == 'is-active --quiet' ]] || exit 64
printf '%s\n' "$3" > "$mock_root/systemctl.unit"
printf '%s\n' "$3" >> "$mock_root/systemctl.calls"
calls=$(wc -l < "$mock_root/systemctl.calls")
states=$(wc -l < "$mock_root/states")
[[ "$(sed -n "$((calls < states ? calls : states))p" "$mock_root/states")" == active ]]
EOF_SYSTEMCTL
cat > "$MOCK_BIN/client" <<'EOF_CLIENT'
#!/bin/bash
set -Eeuo pipefail
mock_root=${MOCK_ROOT:?}
printf '%s\n' "$*" >> "$mock_root/calls"
calls=$(wc -l < "$mock_root/calls")
replies=$(wc -l < "$mock_root/replies")
reply=$(sed -n "$((calls < replies ? calls : replies))p" "$mock_root/replies")
case "$reply" in
  hang) exec sleep 60 ;;
  refused) printf 'Could not connect\n' >&2; exit 1 ;;
  *) printf '%s\n' "$reply" ;;
esac
EOF_CLIENT
chmod 0755 "$MOCK_BIN/systemctl" "$MOCK_BIN/client"
ln -s client "$MOCK_BIN/mongosh"
ln -s client "$MOCK_BIN/valkey-cli"
export MOCK_ROOT
PATH="$MOCK_BIN:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

# check <name> <unit states> <expected exit> <expected client calls> <replies...>
# (unit states are comma-separated, one per systemctl call)
check() {
  local name=$1 state=$2 expected=$3 calls=$4 status=0
  shift 4
  rm -f "$MOCK_ROOT/calls" "$MOCK_ROOT/systemctl.unit" "$MOCK_ROOT/systemctl.calls"
  : > "$MOCK_ROOT/calls"
  tr ',' '\n' <<< "$state" > "$MOCK_ROOT/states"
  printf '%s\n' "$@" > "$MOCK_ROOT/replies"
  "$TEST_ROOT/$name-health-check.sh" > "$MOCK_ROOT/output" 2>&1 || status=$?
  if [[ "$status" -ne "$expected" ]] ||
    [[ "$(wc -l < "$MOCK_ROOT/calls")" -ne "$calls" ]]; then
    printf 'FAIL: %s (%s, replies: %s) exited %d after %d calls\n' \
      "$name" "$state" "$*" "$status" "$(wc -l < "$MOCK_ROOT/calls")" >&2
    cat "$MOCK_ROOT/output" >&2
    exit 1
  fi
}

# A stopped or restarting database is left to its own unit's alerts.
check mongod inactive 0 0 hang
grep -Fxq 'mongod.service' "$MOCK_ROOT/systemctl.unit"
check valkey activating 0 0 hang
grep -Fxq 'valkey-server.service' "$MOCK_ROOT/systemctl.unit"

check mongod active 0 1 1
# (the certificate names the public host, and mongosh would otherwise wait
# only 2 seconds for localhost)
grep -Fq 'mongodb://localhost:27017/admin?tls=true&tlsAllowInvalidCertificates=true&serverSelectionTimeoutMS=' "$MOCK_ROOT/calls"
grep -Fq 'hello: 1' "$MOCK_ROOT/calls"
# A hung mongod is killed at the timeout and fails after three attempts.
started=$(date +%s)
check mongod active 1 3 hang
if (($(date +%s) - started > 10)); then
  printf 'FAIL: a hung mongod was not cut off at the timeout\n' >&2
  exit 1
fi
grep -Fq 'did not answer within 1s (attempt 3 of 3)' "$MOCK_ROOT/output"
check mongod active 0 2 hang 1
check mongod active 1 3 refused
# Only an `ok` of 1 passes.
check mongod active 1 3 0

check valkey active 0 1 PONG
grep -Fq -- '-h 127.0.0.1 -p 6380 PING' "$MOCK_ROOT/calls"
grep -Fq -- '--tls' "$MOCK_ROOT/calls"
check valkey active 0 1 'NOAUTH Authentication required.'
check valkey active 0 1 'LOADING Valkey is loading the dataset in memory'
check valkey active 1 3 hang
check valkey active 1 3 refused
check valkey active 0 3 hang refused PONG

# A database restarted while the check retries is not a hang.
check mongod active,active,inactive 0 2 hang
check valkey active,active,active,activating 0 3 hang
check mongod active 1 3 hang
[[ "$(wc -l < "$MOCK_ROOT/systemctl.calls")" -eq 4 ]]

printf '%s\n' \
  'PASS: database health checks render as verified systemd units, skip databases that are not running, retry, and fail only when a running database stops answering'
