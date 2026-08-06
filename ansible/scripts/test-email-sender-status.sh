#!/bin/bash
set -Eeuo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
SOURCE_SENDER=${1:-$SCRIPT_DIR/../playbooks/templates/send-rate-limited-email.sh.j2}
TEST_ROOT=$(mktemp -d /tmp/forwardemail-email-status-test.XXXXXX)
STATE_DIR="$TEST_ROOT/state"
MOCK_BIN="$TEST_ROOT/bin"
MOCK_ROOT="$TEST_ROOT/mock"
SENDER="$TEST_ROOT/send-rate-limited-email.sh"

cleanup() {
  rm -rf "$TEST_ROOT"
}
trap cleanup EXIT

install -d -m 0700 "$STATE_DIR" "$MOCK_BIN" "$MOCK_ROOT"
sed \
  -e "s|/var/lib/forwardemail-alerts|$STATE_DIR|g" \
  -e "s|/usr/sbin/sendmail|$MOCK_BIN/sendmail|g" \
  -e 's|{{ alert_email_recipients }}|security@example.com|g' \
  -e 's|{{ alert_email_sender }}|mailerdaemon@example.com|g' \
  "$SOURCE_SENDER" > "$SENDER"
chmod 0755 "$SENDER"

cat > "$MOCK_BIN/mv" <<'EOF_MV'
#!/bin/bash
set -Eeuo pipefail
if [[ -e "${MOCK_ROOT:?}/state-commit-failed" ]]; then
  exit 75
fi
exec /usr/bin/mv "$@"
EOF_MV

cat > "$MOCK_BIN/sendmail" <<'EOF_SENDMAIL'
#!/bin/bash
set -Eeuo pipefail
mock_root=${MOCK_ROOT:?}
count=0
[[ ! -s "$mock_root/sendmail.count" ]] || read -r count < "$mock_root/sendmail.count"
count=$((count + 1))
printf '%d\n' "$count" > "$mock_root/sendmail.count"
printf '%s\n' "$*" > "$mock_root/sendmail.args.$count"
cat > "$mock_root/sendmail.message.$count"
if [[ -e "$mock_root/sendmail-hold" ]]; then
  printf '%s\n' "$$" > "$mock_root/sendmail.pid"
  : > "$mock_root/sendmail-ready"
  while [[ -e "$mock_root/sendmail-hold" ]]; do
    sleep 0.05
  done
fi
[[ ! -e "$mock_root/sendmail-failed" ]] || exit 75
EOF_SENDMAIL
chmod 0755 "$MOCK_BIN/mv" "$MOCK_BIN/sendmail"
export MOCK_ROOT
PATH="$MOCK_BIN:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

count_sendmail() {
  if [[ -s "$MOCK_ROOT/sendmail.count" ]]; then
    cat "$MOCK_ROOT/sendmail.count"
  else
    printf '0\n'
  fi
}

run_sender() {
  set +e
  PATH="$PATH" "$SENDER" "$@" \
    >> "$MOCK_ROOT/sender.stdout" 2>> "$MOCK_ROOT/sender.stderr"
  LAST_RC=$?
  set -e
}

status_file="$TEST_ROOT/queued.status"
: > "$status_file"
run_sender --report-status "$status_file" queued-test 'Queued test' 'queued body'
[[ "$LAST_RC" -eq 0 ]]
[[ "$(cat "$status_file")" == 'EMAIL_DELIVERY_STATUS=queued' ]]
[[ "$(stat -c '%a' "$status_file")" == '600' ]]
[[ "$(count_sendmail)" -eq 1 ]]
jq -e '.email_success_at > 0' "$STATE_DIR/queued-test.json" >/dev/null

status_file="$TEST_ROOT/suppressed.status"
: > "$status_file"
run_sender --report-status "$status_file" queued-test 'Duplicate test' 'duplicate body'
[[ "$LAST_RC" -eq 0 ]]
[[ "$(cat "$status_file")" == 'EMAIL_DELIVERY_STATUS=suppressed' ]]
[[ "$(count_sendmail)" -eq 1 ]]

touch "$MOCK_ROOT/sendmail-failed"
status_file="$TEST_ROOT/failed.status"
: > "$status_file"
run_sender --report-status "$status_file" failed-test 'Failed test' 'failed body'
[[ "$LAST_RC" -eq 75 ]]
[[ "$(cat "$status_file")" == 'EMAIL_DELIVERY_STATUS=failed' ]]
[[ "$(count_sendmail)" -eq 2 ]]
[[ ! -e "$STATE_DIR/failed-test.json" ]]
rm -f "$MOCK_ROOT/sendmail-failed"

run_sender legacy-test 'Legacy caller' 'legacy body'
[[ "$LAST_RC" -eq 0 ]]
[[ "$(count_sendmail)" -eq 3 ]]
jq -e '.email_success_at > 0' "$STATE_DIR/legacy-test.json" >/dev/null

# Local Postfix already accepted this message, so a later cooldown-state write
# failure remains retryable but must never be reported as an email queue failure.
touch "$MOCK_ROOT/state-commit-failed"
status_file="$TEST_ROOT/post-queue-failure.status"
: > "$status_file"
run_sender --report-status "$status_file" post-queue-failure \
  'Post-queue state failure' 'queued before state failure'
[[ "$LAST_RC" -eq 75 ]]
[[ "$(cat "$status_file")" == 'EMAIL_DELIVERY_STATUS=queued' ]]
[[ "$(count_sendmail)" -eq 4 ]]
[[ ! -e "$STATE_DIR/post-queue-failure.json" ]]
rm -f "$MOCK_ROOT/state-commit-failed"

touch "$TEST_ROOT/status-target"
ln -s "$TEST_ROOT/status-target" "$TEST_ROOT/status-link"
run_sender --report-status "$TEST_ROOT/status-link" unsafe-test 'Unsafe path' 'body'
[[ "$LAST_RC" -eq 64 ]]
[[ "$(count_sendmail)" -eq 4 ]]

body_file="$TEST_ROOT/rich-email-body.txt"
cat > "$body_file" <<'EOF_BODY'
=== CURRENT SERVICE STATUS ===
Detailed private service status.

=== EXACT FAILURE INVOCATION JOURNAL ===
Detailed private invocation logs.
EOF_BODY
chmod 0600 "$body_file"
status_file="$TEST_ROOT/body-file.status"
: > "$status_file"
run_sender \
  --report-status "$status_file" \
  --body-file "$body_file" \
  body-file-test 'Body file caller'
[[ "$LAST_RC" -eq 0 ]]
[[ "$(cat "$status_file")" == 'EMAIL_DELIVERY_STATUS=queued' ]]
[[ "$(count_sendmail)" -eq 5 ]]
grep -Fq 'Detailed private service status.' "$MOCK_ROOT/sendmail.message.5"
grep -Fq 'Detailed private invocation logs.' "$MOCK_ROOT/sendmail.message.5"

ln -s "$body_file" "$TEST_ROOT/body-link"
run_sender --body-file "$TEST_ROOT/body-link" unsafe-body 'Unsafe body path'
[[ "$LAST_RC" -eq 64 ]]
[[ "$(count_sendmail)" -eq 5 ]]

large_body="$TEST_ROOT/large-body.txt"
head -c 131073 /dev/zero | tr '\0' x > "$large_body"
run_sender --body-file "$large_body" oversized-body 'Oversized body'
[[ "$LAST_RC" -eq 64 ]]
[[ "$(count_sendmail)" -eq 5 ]]

# Rich private diagnostics travel through a root-only file and stdin. Their
# content must never appear in sender or sendmail command lines or environments.
readonly PRIVATE_BODY_MARKER='PRIVATE_DIAGNOSTIC_DO_NOT_EXPOSE_IN_PROCESS_ARGS'
printf '%s\n' "$PRIVATE_BODY_MARKER" > "$body_file"
: > "$MOCK_ROOT/sendmail-hold"
PATH="$PATH" "$SENDER" --body-file "$body_file" \
  body-file-privacy 'Body file privacy' \
  >> "$MOCK_ROOT/sender.stdout" 2>> "$MOCK_ROOT/sender.stderr" &
sender_pid=$!
for _attempt in {1..100}; do
  [[ -s "$MOCK_ROOT/sendmail.pid" && -e "$MOCK_ROOT/sendmail-ready" ]] && break
  sleep 0.05
done
[[ -s "$MOCK_ROOT/sendmail.pid" && -e "$MOCK_ROOT/sendmail-ready" ]]
read -r sendmail_pid < "$MOCK_ROOT/sendmail.pid"
for pid in "$sender_pid" "$sendmail_pid"; do
  [[ -r "/proc/$pid/cmdline" && -r "/proc/$pid/environ" ]]
  if tr '\0' '\n' < "/proc/$pid/cmdline" | grep -Fq "$PRIVATE_BODY_MARKER" ||
    tr '\0' '\n' < "/proc/$pid/environ" | grep -Fq "$PRIVATE_BODY_MARKER"; then
    printf 'FAIL: private email diagnostic leaked from process %s\n' "$pid" >&2
    rm -f "$MOCK_ROOT/sendmail-hold"
    wait "$sender_pid" || true
    exit 1
  fi
done
rm -f "$MOCK_ROOT/sendmail-hold"
wait "$sender_pid"
[[ "$(count_sendmail)" -eq 6 ]]
grep -Fq "$PRIVATE_BODY_MARKER" "$MOCK_ROOT/sendmail.message.6"

printf '%s\n' \
  'PASS: email sender preserves legacy callers and reports queued, suppressed, and failed outcomes; rich bodies use bounded private files without process-argument exposure'
