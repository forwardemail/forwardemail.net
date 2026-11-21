#!/usr/bin/env bash
# authorized-keys-monitor passes only the keys security.yml deploys, and for
# anything else fails (OnFailure email and SMS from every host) with an
# escaped HTML report of the key, the change, the writer's session and IP,
# the logins with the key and the IPs seen.
set -Eeuo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
PLAYBOOKS="$REPO_ROOT/ansible/playbooks"
MONITOR="$PLAYBOOKS/files/authorized-keys-monitor.sh"
TEST_ROOT=$(mktemp -d /tmp/forwardemail-authorized-keys-monitor.XXXXXX)
MOCK_BIN="$TEST_ROOT/bin"
MOCK_ROOT="$TEST_ROOT/mock"

cleanup() {
  rm -rf "$TEST_ROOT"
}
trap cleanup EXIT

install -d -m 0700 "$MOCK_BIN" "$MOCK_ROOT"

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  for file in stdout stderr; do
    [[ -f "$MOCK_ROOT/$file" ]] && cat "$MOCK_ROOT/$file" >&2
  done
  exit 1
}

bash -n "$MONITOR"
shellcheck "$MONITOR"
for unit in service timer path; do
  sed 's|ExecStart=/usr/local/bin/authorized-keys-monitor.sh|ExecStart=/bin/true|' \
    "$PLAYBOOKS/templates/authorized-keys-monitor.$unit.j2" \
    > "$TEST_ROOT/authorized-keys-monitor.$unit"
done
if ! (cd "$TEST_ROOT" && systemd-analyze verify authorized-keys-monitor.service \
  authorized-keys-monitor.timer authorized-keys-monitor.path \
  > "$TEST_ROOT/verify.log" 2>&1); then
  cat "$TEST_ROOT/verify.log" >&2
  exit 1
fi
grep -Fxq 'OnFailure=failure-notification@%n.service' \
  "$TEST_ROOT/authorized-keys-monitor.service"
grep -Fxq 'OnUnitActiveSec=5min' "$TEST_ROOT/authorized-keys-monitor.timer"
for watched in /root/.ssh /home/devops/.ssh /home/deploy/.ssh; do
  grep -Fxq "PathChanged=$watched" "$TEST_ROOT/authorized-keys-monitor.path"
done

# Keys: the two that security.yml deploys, and two others.
for name in allowed1 allowed2 rogue other; do
  ssh-keygen -q -t ed25519 -N '' -C "$name@example.com" -f "$TEST_ROOT/$name"
done
ROGUE_FP=$(ssh-keygen -l -E sha256 -f "$TEST_ROOT/rogue.pub" | awk '{print $2}')
ALLOWED_FP=$(ssh-keygen -l -E sha256 -f "$TEST_ROOT/allowed1.pub" | awk '{print $2}')
key() {
  cut -d' ' -f1,2 "$TEST_ROOT/$1.pub"
}

# The allowed key list exactly as security.yml renders it from the two keys.
python3 - "$PLAYBOOKS/security.yml" "$TEST_ROOT" <<'EOF_RENDER'
import sys
import yaml

security, root = sys.argv[1], sys.argv[2]
play = next(
    play for play in yaml.safe_load(open(security, encoding="utf-8"))
    if play.get("name") == "Security"
)
tasks = {task.get("name"): task for task in play["pre_tasks"] + play["tasks"]}
allowed = dict(tasks["Create authorized SSH keys list"])
allowed["copy"] = dict(allowed["copy"], dest=f"{root}/authorized-keys.conf")
for field in ("owner", "group"):
    allowed["copy"].pop(field)
sms = [
    tasks[name]
    for name in (
        "Choose SMS services for this server",
        "Text unencrypted disks from hosts that send SMS",
        "Text unauthorized SSH keys from every host",
    )
]
sms.append({
    "name": "Save SMS services",
    "copy": {
        "dest": f"{root}/sms-{{{{ forwardemail_alert_hostname }}}}",
        "content": "{{ forwardemail_sms_services | join(':') }}\n",
    },
})
plays = [
    {
        "hosts": "localhost",
        "connection": "local",
        "gather_facts": False,
        "vars": {
            "copy_local_key": f"{{{{ lookup('file', '{root}/allowed1.pub') }}}}",
            "copy_local_key_2": f"{{{{ lookup('file', '{root}/allowed2.pub') }}}}",
            "team_ssh_keys": play["vars"]["team_ssh_keys"],
        },
        "tasks": [allowed],
    }
]
for host, units in (
    ("ns1.forwardemail.net", []),
    ("mx1.forwardemail.net", ["pm2-deploy.service", "pm2-health-check.service"]),
):
    plays.append({
        "hosts": "localhost",
        "connection": "local",
        "gather_facts": False,
        "vars": {
            "forwardemail_alert_hostname": host,
            "forwardemail_systemd_incident_config": {"units": units} if units else {},
        },
        "tasks": sms,
    })
yaml.safe_dump(plays, open(f"{root}/render.yml", "w", encoding="utf-8"))
with open(f"{root}/team.keys", "w", encoding="utf-8") as team:
    team.write("".join(f"{key}\n" for key in play["vars"]["team_ssh_keys"]))
EOF_RENDER
if ! ANSIBLE_LOCAL_TEMP="$TEST_ROOT/ansible-local" \
  ANSIBLE_REMOTE_TEMP="$TEST_ROOT/ansible-remote" \
  ansible-playbook -i localhost, "$TEST_ROOT/render.yml" \
  > "$TEST_ROOT/ansible.log" 2>&1; then
  cat "$TEST_ROOT/ansible.log" >&2
  exit 1
fi
ALLOWED="$TEST_ROOT/authorized-keys.conf"
for user in root devops deploy; do
  for name in allowed1 allowed2; do
    grep -Fxq "$user $(key "$name")" "$ALLOWED" ||
      fail "the rendered list lacks $name for $user"
  done
done
# The team keys (titanism and shaunwarman) are allowed for each user too.
[[ "$(wc -l < "$TEST_ROOT/team.keys")" -eq 2 ]] || fail 'expected two team keys'
while read -r type team_key; do
  for user in root devops deploy; do
    grep -Fxq "$user $type $team_key" "$ALLOWED" ||
      fail "the rendered list lacks a team key for $user"
  done
done < "$TEST_ROOT/team.keys"
[[ "$(grep -vc '^#' "$ALLOWED")" -eq 12 ]] || fail 'the rendered list has other keys'
# Every host texts for unauthorized keys, not only the SMS hosts.
[[ "$(cat "$TEST_ROOT/sms-ns1.forwardemail.net")" == 'authorized-keys-monitor.service' ]] ||
  fail 'a host without SMS units does not text for unauthorized keys'
[[ "$(tr ':' '\n' < "$TEST_ROOT/sms-mx1.forwardemail.net" | sort | paste -sd:)" == 'authorized-keys-monitor.service:disk-encryption-monitor.service:pm2-deploy.service:pm2-health-check.service' ]] ||
  fail 'an SMS host does not text for unauthorized keys'

# A host: accounts, sshd settings, auditd records, the journal and sessions.
HOMES="$TEST_ROOT/fs"
install -d -m 0700 "$HOMES/root/.ssh" "$HOMES/home/devops/.ssh" \
  "$HOMES/home/deploy/.ssh" "$HOMES/home/backup/.ssh" "$HOMES/etc/ssh/sshd_config.d" \
  "$HOMES/etc/ssh/keys" "$HOMES/log"
cat > "$MOCK_ROOT/passwd" <<EOF_PASSWD
root:x:0:0:root:$HOMES/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
devops:x:1000:1000::$HOMES/home/devops:/bin/bash
deploy:x:1001:1001::$HOMES/home/deploy:/bin/bash
backup:x:1002:1002::$HOMES/home/backup:/bin/bash
EOF_PASSWD

cat > "$MOCK_BIN/getent" <<'EOF_GETENT'
#!/bin/bash
case "$1" in
  passwd) cat "${MOCK_ROOT:?}/passwd" ;;
  hosts)
    [[ "$2" == 198.51.100.9 ]] || exit 2
    printf '%s\n' '198.51.100.9    attacker.example.net'
    ;;
esac
EOF_GETENT
cat > "$MOCK_BIN/sshd" <<'EOF_SSHD'
#!/bin/bash
cat "${MOCK_ROOT:?}/sshd-T"
EOF_SSHD
cat > "$MOCK_BIN/ausearch" <<'EOF_AUSEARCH'
#!/bin/bash
case " $* " in
  *' --session 7 '*) cat "${MOCK_ROOT:?}/audit-session" ;;
  *' -k user_ssh_keys '*) cat "${MOCK_ROOT:?}/audit-keys" ;;
  *) echo '<no matches>' >&2; exit 1 ;;
esac
EOF_AUSEARCH
cat > "$MOCK_BIN/journalctl" <<'EOF_JOURNALCTL'
#!/bin/bash
cat "${MOCK_ROOT:?}/journal"
EOF_JOURNALCTL
cat > "$MOCK_BIN/who" <<'EOF_WHO'
#!/bin/bash
printf '%s\n' 'deploy   pts/1        2026-11-21 10:05   .          5000 (198.51.100.9)'
EOF_WHO
cat > "$MOCK_BIN/ss" <<'EOF_SS'
#!/bin/bash
printf '%s\n' \
  '0 0 192.0.2.1:22 198.51.100.9:50022 users:(("sshd-session",pid=5000,fd=4))' \
  '0 0 192.0.2.1:443 192.0.2.50:41000 users:(("node",pid=900,fd=30))'
EOF_SS
cat > "$MOCK_BIN/last" <<'EOF_LAST'
#!/bin/bash
printf '%s\n' 'deploy   pts/1        198.51.100.9     Sat Nov 21 10:05:00 2026   still logged in'
EOF_LAST
cat > "$MOCK_BIN/ps" <<'EOF_PS'
#!/bin/bash
printf '%s\n' '    PID    PPID USER     STARTED                  TT       COMMAND' \
  '   4200    4100 deploy   Sat Nov 21 10:04:00 2026 pts/1    bash'
EOF_PS
cat > "$MOCK_BIN/hostname" <<'EOF_HOSTNAME'
#!/bin/bash
case "${1:-}" in
  -I) printf '%s\n' '192.0.2.1 2001:db8::1' ;;
  *) printf '%s\n' 'server.example.com' ;;
esac
EOF_HOSTNAME
# The email sender: records the alert key and subject, keeps the body.
cat > "$MOCK_BIN/send-alert" <<'EOF_ALERT'
#!/bin/bash
body=''
if [[ "$1" == --body-file ]]; then
  body=$2
  shift 2
fi
printf '%s|%s\n' "$1" "$2" >> "${MOCK_ROOT:?}/alerts"
if [[ -n "$body" ]]; then
  cp "$body" "$MOCK_ROOT/body.html"
else
  printf '%s\n' "$3" > "$MOCK_ROOT/body.txt"
fi
EOF_ALERT
chmod 0755 "$MOCK_BIN"/*

export MOCK_ROOT
export AUTHORIZED_KEYS_ALLOWED="$ALLOWED"
export AUTHORIZED_KEYS_KNOWN_IPS="$TEST_ROOT/authorized-ips.conf"
export AUTHORIZED_KEYS_STATE_DIR="$TEST_ROOT/state"
export AUTHORIZED_KEYS_SSHD_DIR="$HOMES/etc/ssh"
export AUTHORIZED_KEYS_LOG_DIR="$HOMES/log"
export AUTHORIZED_KEYS_ALERT="$MOCK_BIN/send-alert"
PATH="$MOCK_BIN:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
printf '%s\n' '# Authorized IP addresses' '192.0.2.50' > "$AUTHORIZED_KEYS_KNOWN_IPS"

DEPLOY_KEYS="$HOMES/home/deploy/.ssh/authorized_keys"
# A server as security.yml leaves it: the two keys for devops and deploy (and
# root from the first run), the default sshd key settings, no auditd record.
clean_host() {
  rm -rf "$AUTHORIZED_KEYS_STATE_DIR" "$MOCK_ROOT/alerts" "$MOCK_ROOT/body.html" \
    "$HOMES/etc/ssh/sshd_config.d"/* "$HOMES/etc/ssh/keys"/* \
    "$HOMES/home/backup/.ssh"/*
  local file
  for file in "$HOMES/root/.ssh/authorized_keys" \
    "$HOMES/home/devops/.ssh/authorized_keys" "$DEPLOY_KEYS"; do
    cat "$TEST_ROOT/allowed1.pub" "$TEST_ROOT/allowed2.pub" > "$file"
  done
  printf '%s\n' 'Include /etc/ssh/sshd_config.d/*.conf' \
    '#AuthorizedKeysFile .ssh/authorized_keys .ssh/authorized_keys2' \
    'PermitRootLogin no' > "$HOMES/etc/ssh/sshd_config"
  printf '%s\n' 'permitrootlogin no' 'pubkeyauthentication yes' \
    'authorizedkeysfile .ssh/authorized_keys .ssh/authorized_keys2' \
    'authorizedkeyscommand none' 'authorizedprincipalsfile none' \
    'trustedusercakeys none' > "$MOCK_ROOT/sshd-T"
  : > "$MOCK_ROOT/audit-keys"
  : > "$MOCK_ROOT/audit-session"
  printf '%s\n' \
    "2026-11-21T09:00:00+0000 server sshd-session[4000]: Accepted publickey for devops from 192.0.2.50 port 40022 ssh2: ED25519 $ALLOWED_FP" \
    > "$MOCK_ROOT/journal"
  printf '%s\n' 'Nov 21 09:00:01 server devops: [/home/devops]$ ls' \
    > "$HOMES/log/bash-commands.log"
}

# check <expected exit> <expected problems...>
check() {
  local expected=$1 status=0 line
  shift
  bash "$MONITOR" > "$MOCK_ROOT/stdout" 2> "$MOCK_ROOT/stderr" || status=$?
  [[ "$status" -eq "$expected" ]] ||
    fail "exited $status, expected $expected"
  [[ "$(grep -c '^SECURITY INCIDENT [0-9a-f]\{12\}: [^I]' "$MOCK_ROOT/stderr" ||
    true)" -eq "$#" ]] || fail "expected $# problems"
  for line in "$@"; do
    grep -Fq ": $line" "$MOCK_ROOT/stderr" || fail "missing problem: $line"
  done
}

body_has() {
  grep -Fq -- "$1" "$MOCK_ROOT/body.html" || {
    sed 's/^/body: /' "$MOCK_ROOT/body.html" >&2
    fail "the report lacks: $1"
  }
}

# The deployed keys pass, with any comment, and send nothing; so do the team
# keys added by hand.
clean_host
sed 's/$/ added-by-hand/' "$TEST_ROOT/team.keys" >> "$HOMES/home/devops/.ssh/authorized_keys"
cat "$TEST_ROOT/team.keys" >> "$HOMES/root/.ssh/authorized_keys"
check 0
grep -Fxq 'every authorized_keys entry is one that security.yml deployed' \
  "$MOCK_ROOT/stdout" || fail 'no success message'
[[ ! -e "$MOCK_ROOT/alerts" ]] || fail 'a clean host sent an alert'

# A key added for deploy over SSH from 203.0.113.7 (auditd: session 7), then
# used from 198.51.100.9.  Its comment holds markup, which must stay text.
printf '%s <p><a href="https://example.net">x</a>\n' "$(key rogue)" >> "$DEPLOY_KEYS"
cat > "$MOCK_ROOT/audit-keys" <<EOF_AUDIT
----
type=PROCTITLE msg=audit(11/21/26 10:04:00.000:500) : proctitle=bash
type=PATH msg=audit(11/21/26 10:04:00.000:500) : item=1 name=$DEPLOY_KEYS inode=4242 nametype=NORMAL
type=SYSCALL msg=audit(11/21/26 10:04:00.000:500) : arch=x86_64 syscall=openat success=yes exit=3 ppid=4100 pid=4200 auid=deploy uid=deploy tty=pts1 ses=7 comm=bash exe=/usr/bin/bash key=user_ssh_keys
----
type=PATH msg=audit(11/21/26 10:04:30.000:501) : item=0 name=$HOMES/home/deploy/notes.txt inode=4243 nametype=NORMAL
type=SYSCALL msg=audit(11/21/26 10:04:30.000:501) : arch=x86_64 syscall=openat success=yes exit=3 ppid=4100 pid=4300 auid=deploy uid=deploy tty=pts1 ses=8 comm=vim exe=/usr/bin/vim key=user_ssh_keys
EOF_AUDIT
cat > "$MOCK_ROOT/audit-session" <<'EOF_SESSION'
----
type=USER_LOGIN msg=audit(11/21/26 10:03:00.000:480) : pid=4000 uid=root auid=deploy ses=7 msg='op=login acct=deploy exe=/usr/sbin/sshd hostname=? addr=203.0.113.7 terminal=ssh res=success'
EOF_SESSION
printf '%s\n' \
  "2026-11-21T10:05:00+0000 server sshd-session[5000]: Accepted publickey for deploy from 198.51.100.9 port 50022 ssh2: ED25519 $ROGUE_FP" \
  >> "$MOCK_ROOT/journal"
printf '%s\n' 'Nov 21 10:04:00 server deploy: [/home/deploy]$ echo ssh-ed25519 AAAA >> .ssh/authorized_keys' \
  >> "$HOMES/log/bash-commands.log"
check 1 "unauthorized ssh-ed25519 key $ROGUE_FP for user deploy, ${DEPLOY_KEYS//[^A-Za-z0-9._\/@:+=, -]/_} line 3"
for ip in 198.51.100.9 203.0.113.7; do
  grep -Fq "IP $ip" "$MOCK_ROOT/stderr" || fail "the journal summary lacks $ip"
done
if grep -q '[<>]' "$MOCK_ROOT/stderr"; then
  fail 'markup reached the journal (and so the failure email)'
fi
[[ "$(wc -l < "$MOCK_ROOT/alerts")" -eq 1 ]] || fail 'expected one email'
INCIDENT=$(grep -o '^SECURITY INCIDENT [0-9a-f]*' "$MOCK_ROOT/stderr" | head -n 1 |
  cut -d' ' -f3)
grep -Fxq "authorized-keys-$INCIDENT|[SECURITY INCIDENT] Unauthorized SSH key on server.example.com" \
  "$MOCK_ROOT/alerts" || fail 'wrong alert key or subject'
[[ "$(head -c 6 "$MOCK_ROOT/body.html")" == '<html>' ]] || fail 'the email is not HTML'
if grep -Fq '<p><a' "$MOCK_ROOT/body.html"; then
  fail 'the key comment became markup'
fi
body_has '&lt;p&gt;&lt;a href="https://example.net"&gt;x&lt;/a&gt;'
body_has "fingerprints: $ROGUE_FP $(ssh-keygen -l -E md5 -f "$TEST_ROOT/rogue.pub" | awk '{print $2}')"
body_has "+$(key rogue)"
body_has 'name='"$DEPLOY_KEYS"
body_has 'ses=7 comm=bash exe=/usr/bin/bash'
body_has 'addr=203.0.113.7 terminal=ssh'
body_has "Accepted publickey for deploy from 198.51.100.9 port 50022 ssh2: ED25519 $ROGUE_FP"
body_has '198.51.100.9  reverse DNS: attacker.example.net  unknown'
body_has '203.0.113.7  reverse DNS: (none)  unknown'
body_has '192.0.2.50  reverse DNS: (none)  known (authorized-ips.conf)'
body_has 'echo ssh-ed25519 AAAA &gt;&gt; .ssh/authorized_keys'
body_has '4200    4100 deploy'
if grep -Fq 'notes.txt' "$MOCK_ROOT/body.html"; then
  fail 'an auditd record for another file is in the report'
fi
if grep -Eq '^192\.0\.2\.1 |2001:db8::1 ' "$MOCK_ROOT/body.html"; then
  fail "the server's own address is listed as a remote IP"
fi
[[ "$(find "$AUTHORIZED_KEYS_STATE_DIR/incidents" -mindepth 1 -maxdepth 1 | wc -l)" -eq 1 ]] ||
  fail 'expected one evidence folder'
EVIDENCE=$(find "$AUTHORIZED_KEYS_STATE_DIR/incidents" -mindepth 1 -maxdepth 1)
grep -Fq "fingerprints: $ROGUE_FP" "$EVIDENCE/report.txt" || fail 'no saved report'
cmp -s "$DEPLOY_KEYS" "$EVIDENCE/${DEPLOY_KEYS//\//_}" || fail 'no saved key file'
[[ "$(stat -c %a "$AUTHORIZED_KEYS_STATE_DIR")" == 700 ]] || fail 'state is not private'

# The next run alerts again (each alert key waits 10 minutes between emails),
# without a second evidence folder, and says nothing changed.
check 1 "unauthorized ssh-ed25519 key $ROGUE_FP for user deploy, ${DEPLOY_KEYS//[^A-Za-z0-9._\/@:+=, -]/_} line 3"
[[ "$(wc -l < "$MOCK_ROOT/alerts")" -eq 2 ]] || fail 'the incident did not alert again'
[[ "$(find "$AUTHORIZED_KEYS_STATE_DIR/incidents" -mindepth 1 -maxdepth 1 | wc -l)" -eq 1 ]] ||
  fail 'a second evidence folder for the same incident'
body_has 'No change since the last check'

# Removing the key resolves the incident, with one email.
cat "$TEST_ROOT/allowed1.pub" "$TEST_ROOT/allowed2.pub" > "$DEPLOY_KEYS"
check 0
grep -Fxq "authorized-keys-resolved-$INCIDENT|[RESOLVED] Unauthorized SSH key on server.example.com" \
  "$MOCK_ROOT/alerts" || fail 'no resolved email'
check 0
[[ "$(wc -l < "$MOCK_ROOT/alerts")" -eq 3 ]] || fail 'a second resolved email'

# A deployed key with options (a forced command, a from= list) fails too.
clean_host
printf 'from="192.0.2.0/24",command="/bin/sh -c \\"id\\"" %s devops\n' "$(key allowed1)" \
  > "$HOMES/home/devops/.ssh/authorized_keys"
check 1 "allowed ssh-ed25519 key $ALLOWED_FP has options for user devops, ${HOMES//[^A-Za-z0-9._\/@:+=, -]/_}/home/devops/.ssh/authorized_keys line 1"
body_has 'options: from="192.0.2.0/24",command="/bin/sh -c \"id\""'

# A deployed key for an account security.yml does not set keys for, in
# authorized_keys2, and a line sshd may read that is not a key.
clean_host
key allowed1 > "$HOMES/home/backup/.ssh/authorized_keys2"
printf '%s\n' 'restrict ssh-ed25519' >> "$HOMES/root/.ssh/authorized_keys"
check 1 \
  "unauthorized ssh-ed25519 key $ALLOWED_FP for user backup, ${HOMES//[^A-Za-z0-9._\/@:+=, -]/_}/home/backup/.ssh/authorized_keys2 line 1" \
  "unreadable entry for user root, ${HOMES//[^A-Za-z0-9._\/@:+=, -]/_}/root/.ssh/authorized_keys line 3"

# sshd taking keys from elsewhere: a command, a user CA, or a key file only a
# drop-in names (checked for every account).
clean_host
printf '%s\n' 'AuthorizedKeysCommand /usr/local/bin/keys %u' \
  '  TrustedUserCAKeys /etc/ssh/ca.pub' \
  "AuthorizedKeysFile $HOMES/etc/ssh/keys/%u" \
  > "$HOMES/etc/ssh/sshd_config.d/50-keys.conf"
sed -i 's|^authorizedprincipalsfile none$|authorizedprincipalsfile /etc/ssh/principals/%u|' \
  "$MOCK_ROOT/sshd-T"
key other > "$HOMES/etc/ssh/keys/deploy"
OTHER_FP=$(ssh-keygen -l -E sha256 -f "$TEST_ROOT/other.pub" | awk '{print $2}')
check 1 \
  'sshd authorizedkeyscommand is /usr/local/bin/keys _u' \
  'sshd authorizedprincipalsfile is /etc/ssh/principals/_u' \
  'sshd trustedusercakeys is /etc/ssh/ca.pub' \
  "unauthorized ssh-ed25519 key $OTHER_FP for user deploy, ${HOMES//[^A-Za-z0-9._\/@:+=, -]/_}/etc/ssh/keys/deploy line 1"

# Without the allowed key list every key is a problem.
clean_host
mv "$ALLOWED" "$ALLOWED.saved"
status=0
bash "$MONITOR" > "$MOCK_ROOT/stdout" 2> "$MOCK_ROOT/stderr" || status=$?
mv "$ALLOWED.saved" "$ALLOWED"
[[ "$status" -eq 1 ]] || fail 'a missing allowed key list passed'
grep -Fq "the allowed key list ${ALLOWED} is missing or empty" "$MOCK_ROOT/stderr" ||
  fail 'no missing list problem'

# The failure email and SMS: a host with no SMS units still texts for
# authorized-keys-monitor, and only for it.
NOTIFIER="$TEST_ROOT/send-failure-notification.sh"
sed \
  -e "s|/usr/local/bin/send-rate-limited-email.sh|$MOCK_BIN/send-email|g" \
  -e "s|/etc/forwardemail-alerts/twilio.env|$MOCK_ROOT/twilio.env|g" \
  -e "s|/var/lib/forwardemail-alerts|$MOCK_ROOT/notifier-state|g" \
  -e "s|mktemp /run/|mktemp $MOCK_ROOT/|g" \
  "$PLAYBOOKS/templates/send-failure-notification.sh.j2" > "$NOTIFIER"
cat > "$MOCK_BIN/send-email" <<'EOF_EMAIL'
#!/bin/bash
status_file=''
while [[ "${1:-}" == --* ]]; do
  [[ "$1" == --report-status ]] && status_file=$2
  shift 2
done
printf '%s\n' "$2" >> "${MOCK_ROOT:?}/failure-emails"
printf '%s\n' 'EMAIL_DELIVERY_STATUS=queued' > "$status_file"
EOF_EMAIL
cat > "$MOCK_BIN/curl" <<'EOF_CURL'
#!/bin/bash
cat > /dev/null
while (($#)); do
  [[ "$1" == --output ]] && printf '%s' '{"sid":"SMtest"}' > "$2"
  shift
done
printf '%s\n' sms >> "${MOCK_ROOT:?}/sms"
printf '201'
EOF_CURL
cat > "$MOCK_BIN/systemctl" <<'EOF_SYSTEMCTL'
#!/bin/bash
printf '%s\n' 'mock'
EOF_SYSTEMCTL
cat > "$MOCK_BIN/logger" <<'EOF_LOGGER'
#!/bin/bash
printf '%s\n' "$*" >> "${MOCK_ROOT:?}/logger"
EOF_LOGGER
printf '%s\n' '#!/bin/bash' "printf '%s\n' ns1.forwardemail.net" > "$MOCK_BIN/hostname"
chmod 0755 "$MOCK_BIN"/*
printf '%s\n' "TWILIO_ACCOUNT_SID=AC$(printf '0%.0s' {1..32})" \
  "TWILIO_AUTH_TOKEN=$(printf 'a%.0s' {1..32})" \
  'TWILIO_FROM_NUMBER=+15550000000' 'TWILIO_TO_NUMBER=+15550000001' \
  > "$MOCK_ROOT/twilio.env"
notify() {
  env FORWARDEMAIL_SMS_HOST=ns1.forwardemail.net \
    FORWARDEMAIL_SMS_SERVICES="$(cat "$TEST_ROOT/sms-ns1.forwardemail.net")" \
    MONITOR_UNIT="$1" MONITOR_SERVICE_RESULT=exit-code MONITOR_EXIT_CODE=exited \
    MONITOR_EXIT_STATUS=1 MONITOR_INVOCATION_ID="$(printf 'f%.0s' {1..32})" \
    bash "$NOTIFIER" "$1" > /dev/null 2>&1
}
notify authorized-keys-monitor.service
grep -Fxq '[ALERT] Service Failure: authorized-keys-monitor.service on ns1.forwardemail.net' \
  "$MOCK_ROOT/failure-emails" || fail 'no failure email'
[[ "$(wc -l < "$MOCK_ROOT/sms" 2>/dev/null || echo 0)" -eq 1 ]] ||
  fail 'no SMS from a host without SMS units'
notify disk-encryption-monitor.service
[[ "$(wc -l < "$MOCK_ROOT/sms")" -eq 1 ]] ||
  fail 'a host without SMS units texted for another monitor'

printf '%s\n' \
  'PASS: authorized keys monitor renders as verified systemd units and the allowed key list from security.yml, passes the deployed keys, and for any other key (any account, authorized_keys2, a drop-in key file), a deployed key with options, an unreadable entry, or sshd keys from a command, principals or a user CA fails with an escaped HTML report (key, fingerprints, diff, auditd writer and session IP, logins with the key, IPs with reverse DNS, evidence kept), alerts until fixed, emails once when resolved, and texts from every host'
