#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
NODE_PLAYBOOK=${1:-$SCRIPT_DIR/../playbooks/node.yml}
HEALTH_UNIT_TEMPLATE=${2:-$SCRIPT_DIR/../playbooks/templates/pm2-health-check.service.j2}
TEST_ROOT=$(mktemp -d /tmp/forwardemail-pm2-notifier-test.XXXXXX)
MOCK_BIN="$TEST_ROOT/bin"
MOCK_ROOT="$TEST_ROOT/mock"
HEALTH_SCRIPT="$TEST_ROOT/pm2-health-check.sh"

cleanup() {
  rm -rf "$TEST_ROOT"
}
trap cleanup EXIT

install -d -m 0700 "$MOCK_BIN" "$MOCK_ROOT"
python3 - "$NODE_PLAYBOOK" "$HEALTH_SCRIPT" <<'PY'
from pathlib import Path
import sys
import textwrap

source = Path(sys.argv[1]).read_text()
start_marker = "    - name: Create PM2 health check script\n"
end_marker = "    - name: Create PM2 health check systemd service\n"
start = source.index(start_marker)
content = source.index("        content: |\n", start) + len("        content: |\n")
end = source.index(end_marker, content)
Path(sys.argv[2]).write_text(textwrap.dedent(source[content:end]).rstrip() + "\n")
PY

sed -i \
  -e "s|/home/deploy/n/bin/pm2|$MOCK_BIN/pm2|g" \
  -e 's|source /home/deploy/.bashrc && ||g' \
  -e "s|/home/deploy/.pm2/dump.pm2|$MOCK_ROOT/dump.pm2|g" \
  "$HEALTH_SCRIPT"
chmod 0755 "$HEALTH_SCRIPT"
bash -n "$HEALTH_SCRIPT"
shellcheck --severity=warning -x "$HEALTH_SCRIPT"

if grep -Fq 'send-rate-limited-email.sh' "$HEALTH_SCRIPT"; then
  printf '%s\n' 'FAIL: PM2 health script bypasses centralized systemd delivery' >&2
  exit 1
fi

grep -Fq 'ConditionPathExists=!/run/forwardemail-pm2-maintenance' \
  "$NODE_PLAYBOOK"
grep -Fq 'ConditionPathExists=!/run/forwardemail-pm2-maintenance' \
  "$HEALTH_UNIT_TEMPLATE"

cat > "$MOCK_BIN/sudo" <<'EOF_SUDO'
#!/usr/bin/env bash
set -Eeuo pipefail
if [[ "${1:-}" == '-u' ]]; then
  shift 2
fi
exec "$@"
EOF_SUDO
chmod 0755 "$MOCK_BIN/sudo"

write_pm2_mock() {
  cat > "$MOCK_BIN/pm2" <<'EOF_PM2'
#!/usr/bin/env bash
set -Eeuo pipefail
case "${1:-}" in
  jlist)
    cat "${PM2_JLIST_FILE:?}"
    ;;
  list)
    printf '%s\n' 'mock PM2 process table'
    ;;
  *)
    exit 64
    ;;
esac
EOF_PM2
  chmod 0755 "$MOCK_BIN/pm2"
}

run_health() {
  local name=$1 expected_rc=$2 expected_text=$3 json=$4 dump=$5
  local output="$MOCK_ROOT/$name.log"
  printf '%s\n' "$json" > "$MOCK_ROOT/$name.json"
  if [[ "$dump" == '__missing__' ]]; then
    rm -f "$MOCK_ROOT/dump.pm2"
  else
    printf '%s\n' "$dump" > "$MOCK_ROOT/dump.pm2"
  fi
  set +e
  PM2_JLIST_FILE="$MOCK_ROOT/$name.json" \
    PATH="$MOCK_BIN:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
    "$HEALTH_SCRIPT" > "$output" 2>&1
  local rc=$?
  set -e
  if [[ "$rc" -ne "$expected_rc" ]]; then
    printf 'FAIL: %s expected rc=%s, got rc=%s\n' \
      "$name" "$expected_rc" "$rc" >&2
    cat "$output" >&2
    exit 1
  fi
  grep -Fq "$expected_text" "$output"
}

# A missing PM2 executable is a failed health invocation and therefore enters
# the centralized systemd email-plus-SMS path on an approved Node.js host.
rm -f "$MOCK_BIN/pm2"
run_health \
  missing-pm2 1 \
  'PM2 is not installed or not executable' \
  '[]' \
  '[]'

write_pm2_mock
run_health \
  no-processes 1 \
  'NO PM2 PROCESSES DETECTED' \
  '[]' \
  '[]'
run_health \
  errored 1 \
  'ERRORED PROCESSES: api' \
  '[{"name":"api","pm2_env":{"status":"errored","pm_uptime":1,"pmx_module":false}}]' \
  '[{"name":"api"}]'
run_health \
  stopped 1 \
  'STOPPED PROCESSES: smtp' \
  '[{"name":"smtp","pm2_env":{"status":"stopped","pm_uptime":1,"pmx_module":false}}]' \
  '[{"name":"smtp"}]'
run_health \
  drift 1 \
  'PROCESS LIST DRIFT DETECTED' \
  '[{"name":"api","pm2_env":{"status":"online","pm_uptime":1,"pmx_module":false}}]' \
  '[{"name":"api"},{"name":"smtp"}]'
run_health \
  healthy 0 \
  'All PM2 processes healthy' \
  '[{"name":"api","pm2_env":{"status":"online","pm_uptime":1,"pmx_module":false}}]' \
  '[{"name":"api"}]'

# Prove the systemd negated path condition independently without touching the
# production maintenance path.
condition_marker="$TEST_ROOT/maintenance"
systemd-analyze condition "ConditionPathExists=!$condition_marker" >/dev/null
: > "$condition_marker"
if systemd-analyze condition "ConditionPathExists=!$condition_marker" >/dev/null 2>&1; then
  printf '%s\n' 'FAIL: PM2 maintenance condition did not suppress execution' >&2
  exit 1
fi

printf '%s\n' \
  'PASS: PM2 missing, empty, errored, stopped, and drifted states fail into centralized notification; healthy and maintenance states do not alert'
