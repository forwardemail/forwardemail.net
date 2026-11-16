#!/usr/bin/env bash
# The alert Postfix delivers to a recipient's MX that greets it with the alert
# hostname, as the forwardemail.net MX greets mx1 and mx2 (Postfix bounces mail
# to a server that greets it with $myhostname: "loops back to myself"). Runs a
# real Postfix with the rendered main.cf; needs root.
set -Eeuo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
MAIN_CF_TEMPLATE="$SCRIPT_DIR/../playbooks/templates/postfix-alerts-main.cf.j2"
ALERT_HOSTNAME=mx1.example.test
TEST_ROOT=$(mktemp -d /tmp/forwardemail-alert-postfix-test.XXXXXX)
CONF="$TEST_ROOT/conf"
SINK="$TEST_ROOT/sink"
SINK_PID=''

cleanup() {
  postfix -c "$CONF" stop >/dev/null 2>&1 || true
  [[ -z "$SINK_PID" ]] || kill "$SINK_PID" 2>/dev/null || true
  rm -rf "$TEST_ROOT"
}
trap cleanup EXIT

for command in postfix postconf sendmail smtp-sink; do
  command -v "$command" >/dev/null || {
    printf 'Missing required command: %s\n' "$command" >&2
    exit 1
  }
done
[[ "$(id -u)" -eq 0 ]] || {
  printf '%s\n' 'Run as root (a test Postfix is started).' >&2
  exit 2
}

# (Postfix checks for a loop only on port 25, and refuses outright an address
#  of its own: 127.0.0.1 with inet_interfaces = loopback-only)
MX_ADDRESS=127.0.0.2
PORT=25
if (exec 3<>"/dev/tcp/$MX_ADDRESS/$PORT") 2>/dev/null; then
  printf '%s\n' "$MX_ADDRESS:$PORT is in use; run where it is free." >&2
  exit 2
fi

chmod 0755 "$TEST_ROOT"
install -d "$CONF" "$SINK" "$TEST_ROOT/data" "$TEST_ROOT/queue"
chown postfix "$TEST_ROOT/data" "$SINK"
sed \
  -e "s|{{ forwardemail_alert_hostname }}|$ALERT_HOSTNAME|g" \
  -e 's|{{ alert_email_sender }}|mailerdaemon@example.test|g' \
  "$MAIN_CF_TEMPLATE" > "$CONF/main.cf"
cp /etc/postfix/master.cf "$CONF/master.cf"
postconf -c "$CONF" -F '*/*/chroot = n'
# (a queue of its own, and the recipient domain's MX at the test server)
postconf -c "$CONF" -e \
  "queue_directory = $TEST_ROOT/queue" \
  "data_directory = $TEST_ROOT/data" \
  "maillog_file_prefixes = $TEST_ROOT" \
  "maillog_file = $TEST_ROOT/maillog" \
  "transport_maps = inline:{example.test=smtp:[$MX_ADDRESS]:$PORT}" \
  'smtp_tls_security_level = none'

# The recipient's MX: greets with the alert hostname
smtp-sink -u postfix -h "$ALERT_HOSTNAME" -d "$SINK/%M." \
  "$MX_ADDRESS:$PORT" 10 &
SINK_PID=$!

postfix -c "$CONF" set-permissions >/dev/null 2>&1 || true
postfix -c "$CONF" start >/dev/null

printf 'Subject: test alert\n\nTest alert.\n' |
  sendmail -C "$CONF" -f mailerdaemon@example.test security@example.test

for _ in $(seq 1 60); do
  grep -Eq 'to=<security@example.test>.*status=' "$TEST_ROOT/maillog" \
    2>/dev/null && break
  sleep 0.5
done

status=$(grep -E 'to=<security@example.test>.*status=' "$TEST_ROOT/maillog" \
  2>/dev/null | tail -n 1 || true)
if [[ "$status" != *'status=sent'* ]]; then
  printf 'FAIL: alert to an MX that greets with the alert hostname was not delivered\n%s\n' \
    "${status:-no delivery attempt logged}" >&2
  grep -E 'greeted me|loops back' "$TEST_ROOT/maillog" | head -n 3 >&2 || true
  exit 1
fi
# Received by the test MX, from the alert hostname as HELO name (SPF and
# reverse DNS)
if ! grep -rqx "X-Helo-Args: $ALERT_HOSTNAME" "$SINK"; then
  printf '%s\n' 'FAIL: the HELO name is not the alert hostname' >&2
  cat "$SINK"/* >&2 || true
  exit 1
fi

printf '%s\n' \
  'PASS: alert Postfix delivers to an MX that greets it with the alert hostname, and keeps it as its HELO name'
