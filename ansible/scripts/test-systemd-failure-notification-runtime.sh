#!/usr/bin/env bash
# The failure notifier emails a failed unit with or without the MONITOR_*
# context (systemd passes it only from version 251, and only to a handler that
# one unit triggers), and ignores a unit that did not fail.
set -Eeuo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
NOTIFIER_TEMPLATE="$SCRIPT_DIR/../playbooks/templates/send-failure-notification.sh.j2"
TEST_ROOT=$(mktemp -d /tmp/forwardemail-failure-notifier-test.XXXXXX)
MOCK_BIN="$TEST_ROOT/bin"
MOCK_ROOT="$TEST_ROOT/mock"
NOTIFIER="$TEST_ROOT/send-failure-notification.sh"

cleanup() {
  rm -rf "$TEST_ROOT"
}
trap cleanup EXIT

install -d -m 0700 "$MOCK_BIN" "$MOCK_ROOT"
sed \
  -e "s|/usr/local/bin/send-rate-limited-email.sh|$MOCK_BIN/send-rate-limited-email.sh|g" \
  -e "s|/etc/forwardemail-alerts/twilio.env|$MOCK_ROOT/twilio.env|g" \
  -e "s|/var/lib/forwardemail-alerts|$MOCK_ROOT/state|g" \
  -e "s|mktemp /run/|mktemp $MOCK_ROOT/|g" \
  "$NOTIFIER_TEMPLATE" > "$NOTIFIER"
chmod 0755 "$NOTIFIER"
bash -n "$NOTIFIER"

# The email sender: records the subject and queues it
cat > "$MOCK_BIN/send-rate-limited-email.sh" <<'EOF_SENDER'
#!/usr/bin/env bash
set -Eeuo pipefail
status_file=''
body_file=''
while [[ "${1:-}" == --* ]]; do
  case "$1" in
    --report-status) status_file=$2 ;;
    --body-file) body_file=$2 ;;
  esac
  shift 2
done
printf '%s\n' "$2" >> "$MOCK_ROOT/sent"
cp "$body_file" "$MOCK_ROOT/body"
printf '%s\n' 'EMAIL_DELIVERY_STATUS=queued' > "$status_file"
EOF_SENDER

# systemctl show: the unit's properties as systemd keeps them after a run
cat > "$MOCK_BIN/systemctl" <<'EOF_SYSTEMCTL'
#!/usr/bin/env bash
case "$1" in
  show) cat "$MOCK_ROOT/unit-state" ;;
  status) printf '%s\n' 'mock status' ;;
esac
EOF_SYSTEMCTL

cat > "$MOCK_BIN/journalctl" <<'EOF_JOURNALCTL'
#!/usr/bin/env bash
printf '%s\n' "$*" > "$MOCK_ROOT/journalctl-args"
printf '%s\n' 'example check failed'
EOF_JOURNALCTL

cat > "$MOCK_BIN/logger" <<'EOF_LOGGER'
#!/usr/bin/env bash
printf '%s\n' "${@: -1}" >> "$MOCK_ROOT/alert-log"
EOF_LOGGER

cat > "$MOCK_BIN/hostname" <<'EOF_HOSTNAME'
#!/usr/bin/env bash
printf '%s\n' 'mx1.example.test'
EOF_HOSTNAME
chmod 0755 "$MOCK_BIN"/*

# Runs the notifier for example-monitor.service with the unit state
# and the environment given (as NAME=value arguments)
run_notifier() {
  local state=$1
  shift
  rm -f "$MOCK_ROOT/sent" "$MOCK_ROOT/body" "$MOCK_ROOT/alert-log" \
    "$MOCK_ROOT/journalctl-args"
  printf '%s\n' "$state" > "$MOCK_ROOT/unit-state"
  env -i \
    PATH="$MOCK_BIN:/usr/bin:/bin" \
    MOCK_ROOT="$MOCK_ROOT" \
    "$@" \
    "$NOTIFIER" example-monitor.service
}

FAILED_STATE='Result=exit-code
ExecMainCode=1
ExecMainStatus=1
InvocationID=0123456789abcdef0123456789abcdef'

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  [[ ! -e "$MOCK_ROOT/alert-log" ]] || cat "$MOCK_ROOT/alert-log" >&2
  exit 1
}

# With the context systemd 251+ passes to a handler one unit triggers
run_notifier "$FAILED_STATE" \
  MONITOR_UNIT=example-monitor.service \
  MONITOR_SERVICE_RESULT=exit-code \
  MONITOR_EXIT_CODE=exited \
  MONITOR_EXIT_STATUS=1 \
  MONITOR_INVOCATION_ID=0123456789abcdef0123456789abcdef
grep -Fxq '[ALERT] Service Failure: example-monitor.service on mx1.example.test' \
  "$MOCK_ROOT/sent" || fail 'a failure with its context is not emailed'

# Without it, the failed unit's own result is used
run_notifier "$FAILED_STATE"
grep -Fxq '[ALERT] Service Failure: example-monitor.service on mx1.example.test' \
  "$MOCK_ROOT/sent" 2>/dev/null ||
  fail 'a failure without MONITOR_* context is not emailed'
grep -Fxq 'TriggerResult=exit-code' "$MOCK_ROOT/body"
grep -Fxq 'TriggerExitCode=exited' "$MOCK_ROOT/body"
grep -Fxq 'TriggerExitStatus=1' "$MOCK_ROOT/body"
grep -Fxq 'TriggerInvocationID=0123456789abcdef0123456789abcdef' "$MOCK_ROOT/body"
grep -Fq '_SYSTEMD_INVOCATION_ID=0123456789abcdef0123456789abcdef' \
  "$MOCK_ROOT/journalctl-args"
grep -Fq 'example check failed' "$MOCK_ROOT/body"

# A unit that did not fail is not emailed about
run_notifier 'Result=success
ExecMainCode=1
ExecMainStatus=0
InvocationID=0123456789abcdef0123456789abcdef'
[[ ! -e "$MOCK_ROOT/sent" ]] || fail 'a unit that did not fail is emailed'
grep -Fq 'ignored_missing_monitor_context' "$MOCK_ROOT/alert-log"

# Nor is one systemd cannot report on
run_notifier ''
[[ ! -e "$MOCK_ROOT/sent" ]] || fail 'a unit with no result is emailed'

# Context naming another unit is still refused
run_notifier "$FAILED_STATE" \
  MONITOR_UNIT=other.service MONITOR_SERVICE_RESULT=exit-code
[[ ! -e "$MOCK_ROOT/sent" ]] || fail 'context for another unit is emailed'

printf '%s\n' \
  'PASS: failure notifier emails failed units with or without systemd MONITOR_* context and ignores units that did not fail'
