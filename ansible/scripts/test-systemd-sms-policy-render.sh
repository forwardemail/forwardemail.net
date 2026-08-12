#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
TEMPLATE="$REPO_ROOT/ansible/playbooks/templates/failure-notification@.service.j2"
TEST_ROOT=$(mktemp -d /tmp/forwardemail-sms-policy-render.XXXXXX)
PLAYBOOK="$TEST_ROOT/render.yml"
OUTPUT_DIR="$TEST_ROOT/rendered"

cleanup() {
  rm -rf "$TEST_ROOT"
}
trap cleanup EXIT

install -d -m 0700 \
  "$OUTPUT_DIR" \
  "$TEST_ROOT/ansible-local" \
  "$TEST_ROOT/ansible-remote"
cat > "$PLAYBOOK" <<EOF_PLAYBOOK
---
- name: Render systemd SMS policies
  hosts: localhost
  connection: local
  gather_facts: false
  vars:
    profiles:
      - { name: mongo, host: mongo.forwardemail.net, units: [mongod.service] }
      - { name: logs, host: logs.forwardemail.net, units: [mongod.service] }
      - { name: redis, host: redis.forwardemail.net, units: [valkey-server.service] }
      - { name: bree, host: bree.forwardemail.net, units: [pm2-deploy.service, pm2-health-check.service] }
      - { name: web, host: forwardemail.net, units: [pm2-deploy.service, pm2-health-check.service] }
      - { name: api, host: api.forwardemail.net, units: [pm2-deploy.service, pm2-health-check.service] }
      - { name: caldav, host: caldav.forwardemail.net, units: [pm2-deploy.service, pm2-health-check.service] }
      - { name: carddav, host: carddav.forwardemail.net, units: [pm2-deploy.service, pm2-health-check.service] }
      - { name: imap, host: imap.forwardemail.net, units: [pm2-deploy.service, pm2-health-check.service] }
      - { name: mx1, host: mx1.forwardemail.net, units: [pm2-deploy.service, pm2-health-check.service] }
      - { name: mx2, host: mx2.forwardemail.net, units: [pm2-deploy.service, pm2-health-check.service] }
      - { name: pop3, host: pop3.forwardemail.net, units: [pm2-deploy.service, pm2-health-check.service] }
      - { name: smtp, host: smtp.forwardemail.net, units: [pm2-deploy.service, pm2-health-check.service] }
      - { name: sqlite, host: sqlite.forwardemail.net, units: [pm2-deploy.service, pm2-health-check.service] }
      - { name: email-only, host: ns1.forwardemail.net, units: [] }
  tasks:
    - name: Render each exact host and unit policy
      ansible.builtin.template:
        src: "$TEMPLATE"
        dest: "$OUTPUT_DIR/{{ item.name }}.service"
        mode: '0600'
      loop: "{{ profiles }}"
      vars:
        forwardemail_alert_hostname: "{{ item.host }}"
        forwardemail_sms_services: "{{ item.units }}"
EOF_PLAYBOOK

if ! ANSIBLE_CONFIG="$REPO_ROOT/ansible.cfg" \
  ANSIBLE_LOCAL_TEMP="$TEST_ROOT/ansible-local" \
  ANSIBLE_REMOTE_TEMP="$TEST_ROOT/ansible-remote" \
  ansible-playbook -i localhost, "$PLAYBOOK" \
  > "$TEST_ROOT/ansible.log" 2>&1; then
  cat "$TEST_ROOT/ansible.log" >&2
  exit 1
fi

assert_policy() {
  local name=$1 host=$2 units=$3
  local unit="$OUTPUT_DIR/$name.service"
  local verify_unit="$OUTPUT_DIR/verify-$name.service"
  grep -Fxq \
    "Environment=\"FORWARDEMAIL_SMS_HOST=$host\"" \
    "$unit"
  grep -Fxq \
    "Environment=\"FORWARDEMAIL_SMS_SERVICES=$units\"" \
    "$unit"
  grep -Fxq 'RefuseManualStart=true' "$unit"
  grep -Fxq 'ConditionPathExists=/etc/forwardemail-alerts/systemd-notifier-policy' "$unit"
  grep -Fxq 'ExecStart=/usr/local/bin/send-failure-notification.sh %i' "$unit"
  if grep -Fq 'FORWARDEMAIL_SMS_SERVICE=' "$unit"; then
    printf 'FAIL: %s rendered obsolete singular SMS unit policy\n' "$name" >&2
    exit 1
  fi

  sed \
    's|ExecStart=/usr/local/bin/send-failure-notification.sh %i|ExecStart=/bin/true|' \
    "$unit" > "$verify_unit"
  if ! systemd-analyze verify "$verify_unit" \
    > "$verify_unit.log" 2>&1; then
    cat "$verify_unit.log" >&2
    exit 1
  fi
}

assert_policy mongo mongo.forwardemail.net mongod.service
assert_policy logs logs.forwardemail.net mongod.service
assert_policy redis redis.forwardemail.net valkey-server.service
assert_policy web forwardemail.net 'pm2-deploy.service:pm2-health-check.service'
for profile in bree api caldav carddav imap mx1 mx2 pop3 smtp sqlite; do
  assert_policy \
    "$profile" \
    "$profile.forwardemail.net" \
    'pm2-deploy.service:pm2-health-check.service'
done
assert_policy email-only ns1.forwardemail.net ''

printf '%s\n' \
  'PASS: all database, PM2, and email-only handler profiles render exact validated host and unit policies and verify as systemd units'
