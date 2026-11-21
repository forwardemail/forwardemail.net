#!/bin/bash
# Authorized SSH Keys Monitor Script
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Fails (so OnFailure sends the email and SMS) when an authorized_keys file
# holds a key that security.yml did not deploy, a deployed key gains options,
# or sshd takes keys from somewhere else (AuthorizedKeysCommand, principals or
# a user CA).  Each incident also emails a report: every key with its
# fingerprint, options and comment; who changed the file and from which IP
# (auditd and the login session); every login with the key and its IP; the
# SSH sessions open now; and recent SSH, sudo and shell logs.  The report and
# copies of the files are kept under /var/lib/authorized-keys-monitor.
# Usage: run by authorized-keys-monitor.path when a key file changes, and by
# its timer every 5 minutes

set -uo pipefail
umask 077
export LC_ALL=C

readonly ALLOWED_FILE=${AUTHORIZED_KEYS_ALLOWED:-/etc/security-monitor/authorized-keys.conf}
readonly KNOWN_IPS_FILE=${AUTHORIZED_KEYS_KNOWN_IPS:-/etc/security-monitor/authorized-ips.conf}
readonly STATE_DIR=${AUTHORIZED_KEYS_STATE_DIR:-/var/lib/authorized-keys-monitor}
readonly SSHD_DIR=${AUTHORIZED_KEYS_SSHD_DIR:-/etc/ssh}
readonly LOG_DIR=${AUTHORIZED_KEYS_LOG_DIR:-/var/log}
readonly ALERT=${AUTHORIZED_KEYS_ALERT:-/usr/local/bin/send-rate-limited-email.sh}
readonly MAX_FILE_BYTES=1048576
readonly MAX_INCIDENTS=50

# An authorized_keys entry: [options] type base64 [comment].  Options are one
# token (quoted strings may hold spaces).
readonly OPTIONS_RE='([^[:space:]"]|"([^"\\]|\\.)*")+'
readonly TYPE_RE='(sk-)?(ssh|ecdsa)-[a-z0-9-]+(@openssh\.com)?'
readonly ENTRY_RE="^[[:space:]]*(${OPTIONS_RE}[[:space:]]+)?(${TYPE_RE})[[:space:]]+(AAAA[A-Za-z0-9+/]+={0,3})([[:space:]]+(.*))?\$"

HOST=$(hostname -f 2>/dev/null || hostname)
NOW=$(date +%s)
STAMP=$(date -u -d "@$NOW" +%Y%m%dT%H%M%SZ)
install -d -m 0700 "$STATE_DIR" "$STATE_DIR/files" "$STATE_DIR/incidents"
LAST_RUN=$(cat "$STATE_DIR/last-run" 2>/dev/null || true)
if ! [[ "$LAST_RUN" =~ ^[0-9]+$ ]] || ((NOW - LAST_RUN > 7 * 86400)); then
  LAST_RUN=$((NOW - 3600))
fi
# Logs are read from a minute before the last run, so nothing falls between.
SINCE=$((LAST_RUN - 60))
WORK=$(mktemp -d "$STATE_DIR/run.XXXXXX") || exit 1
trap 'rm -rf "$WORK"' EXIT

problems=()
declare -A seen=()
problem() {
  [[ -n "${seen[$1]:-}" ]] && return
  seen[$1]=1
  problems+=("$1")
}

# Text safe for the journal and the SMS/failure email: no markup, no controls.
safe() {
  local value=${1//[^A-Za-z0-9._\/@:+=, -]/_}
  printf '%s' "${value:0:200}"
}

# Bounded command output for the report (never hangs the check).
run() {
  timeout --signal=KILL 15 "$@" 2>&1 | head -c 20000
}

section() {
  printf '\n=== %s ===\n' "$1" >> "$WORK/report"
}

declare -A allowed=()
if [[ -f "$ALLOWED_FILE" ]]; then
  while read -r user type key _; do
    [[ -z "$user" || "$user" == '#'* || -z "${key:-}" ]] && continue
    allowed["$user $type $key"]=1
  done < "$ALLOWED_FILE"
fi
if ((${#allowed[@]} == 0)); then
  problem "the allowed key list $ALLOWED_FILE is missing or empty"
fi

# sshd must take keys only from authorized_keys files.
sshd_settings=$(timeout 10 sshd -T 2>/dev/null || true)
configured=$(cat "$SSHD_DIR/sshd_config" "$SSHD_DIR"/sshd_config.d/*.conf \
  2>/dev/null | sed -E 's/^[[:space:]]+//' | grep -Ev '^(#|$)' || true)
for setting in authorizedkeyscommand authorizedprincipalscommand \
  authorizedprincipalsfile trustedusercakeys; do
  while read -r name value; do
    [[ "${name,,}" == "$setting" ]] || continue
    [[ -z "$value" || "${value,,}" == none ]] && continue
    problem "sshd $setting is $(safe "$value")"
  done < <(printf '%s\n%s\n' "$sshd_settings" "$configured")
done

# Every AuthorizedKeysFile pattern sshd may use, for every account.
patterns=(.ssh/authorized_keys .ssh/authorized_keys2)
while read -r name value; do
  [[ "${name,,}" == authorizedkeysfile && -n "$value" ]] || continue
  read -r -a values <<< "$value"
  patterns+=("${values[@]}")
done < <(printf '%s\n%s\n' "$sshd_settings" "$configured")

declare -A file_users=()
files=()
while IFS=: read -r user _ uid _ _ home _; do
  [[ -n "$user" && -n "$home" ]] || continue
  for pattern in "${patterns[@]}"; do
    [[ "${pattern,,}" == none ]] && continue
    path=${pattern//%%/$'\x01'}
    path=${path//%h/$home}
    path=${path//%u/$user}
    path=${path//%U/$uid}
    path=${path//$'\x01'/%}
    [[ "$path" == /* ]] || path="${home%/}/$path"
    [[ -f "$path" ]] || continue
    if [[ -z "${file_users[$path]+set}" ]]; then
      files+=("$path")
      file_users[$path]=''
    fi
    [[ " ${file_users[$path]} " == *" $user "* ]] ||
      file_users[$path]+=" $user"
  done
done < <(getent passwd)

# Every key in every file, and each key that is not allowed.
declare -A bad_files=()
fingerprints=()
: > "$WORK/keys"
: > "$WORK/entries"
for file in "${files[@]}"; do
  size=$(stat -L -c %s "$file" 2>/dev/null || echo 0)
  if ((size > MAX_FILE_BYTES)); then
    problem "$(safe "$file") is $size bytes, too large to check"
    bad_files[$file]=1
    continue
  fi
  # Read a copy, so a file that changes or grows while it is read is safe.
  head -c "$MAX_FILE_BYTES" -- "$file" > "$WORK/current" 2>/dev/null
  number=0
  while IFS= read -r line || [[ -n "$line" ]]; do
    number=$((number + 1))
    line=${line%$'\r'}
    [[ "$line" =~ ^[[:space:]]*(#|$) ]] && continue
    for user in ${file_users[$file]}; do
      where="user $(safe "$user"), $(safe "$file") line $number"
      if ! [[ "$line" =~ $ENTRY_RE ]]; then
        problem "unreadable entry for $where"
        bad_files[$file]=1
        printf 'UNREADABLE  %s\n  line: %s\n\n' "$where" "${line:0:2000}" \
          >> "$WORK/entries"
        continue
      fi
      options=${BASH_REMATCH[1]%"${BASH_REMATCH[1]##*[![:space:]]}"}
      type=${BASH_REMATCH[4]} key=${BASH_REMATCH[8]} comment=${BASH_REMATCH[10]}
      sha256=$(printf '%s %s\n' "$type" "$key" |
        ssh-keygen -l -E sha256 -f /dev/stdin 2>/dev/null | awk '{print $2}')
      fingerprint=${sha256:-invalid-key}
      status=allowed
      if [[ -z "${allowed["$user $type $key"]:-}" ]]; then
        status=UNAUTHORIZED
        problem "unauthorized $type key $fingerprint for $where"
      elif [[ -n "$options" ]]; then
        status=OPTIONS
        problem "allowed $type key $fingerprint has options for $where"
      fi
      printf '%s %s %s %s\n' "$status" "$user" "$fingerprint" "$file" \
        >> "$WORK/keys"
      [[ "$status" == allowed ]] && continue
      bad_files[$file]=1
      [[ -n "$sha256" ]] && fingerprints+=("$sha256")
      md5=$(printf '%s %s\n' "$type" "$key" |
        ssh-keygen -l -E md5 -f /dev/stdin 2>/dev/null | awk '{print $2}')
      bits=$(printf '%s %s\n' "$type" "$key" |
        ssh-keygen -l -f /dev/stdin 2>/dev/null | awk '{print $1}')
      printf '%s  %s\n  type: %s (%s bits)\n  fingerprints: %s %s\n  comment: %s\n  options: %s\n  line: %s\n\n' \
        "$status" "$where" "$type" "${bits:-?}" "$fingerprint" "${md5:-MD5:?}" \
        "${comment:-(none)}" "${options:-(none)}" "${line:0:2000}" \
        >> "$WORK/entries"
    done
  done < "$WORK/current"
done

# What changed in each file since the last run (copies are kept in state).
: > "$WORK/changes"
declare -A current=()
for file in "${files[@]}"; do
  id=$(printf '%s' "$file" | sha256sum | cut -c1-32)
  current[$id]=1
  copy="$STATE_DIR/files/$id"
  if [[ ! -f "$copy" ]]; then
    printf -- '--- %s (new since the last run)\n' "$file" >> "$WORK/changes"
  elif ! cmp -s "$copy" "$file"; then
    diff -u --label "$file (last run)" --label "$file (now)" "$copy" "$file" |
      head -c 20000 >> "$WORK/changes"
  fi
  head -c "$MAX_FILE_BYTES" "$file" > "$copy.tmp" && mv -f "$copy.tmp" "$copy"
  printf '%s\n' "$file" > "$copy.path"
done
for copy in "$STATE_DIR"/files/*.path; do
  [[ -f "$copy" ]] || continue
  id=${copy##*/}
  id=${id%.path}
  [[ -n "${current[$id]:-}" ]] && continue
  printf -- '--- %s (removed since the last run)\n' "$(cat "$copy")" \
    >> "$WORK/changes"
  rm -f "$copy" "${copy%.path}"
done
printf '%s\n' "$NOW" > "$STATE_DIR/last-run"

previous=$(cat "$STATE_DIR/incident" 2>/dev/null || true)
if ((${#problems[@]} == 0)); then
  echo "every authorized_keys entry is one that security.yml deployed"
  if [[ -n "$previous" ]]; then
    rm -f "$STATE_DIR/incident"
    "$ALERT" "authorized-keys-resolved-$previous" \
      "[RESOLVED] Unauthorized SSH key on $HOST" \
      "Every authorized_keys entry on $HOST is again one that security.yml deployed (incident $previous, report in $STATE_DIR/incidents)." ||
      true
  fi
  exit 0
fi

INCIDENT=$(printf '%s\n' "${problems[@]}" | sort | sha256sum | cut -c1-12)
SINCE_TEXT=$(date -u -d "@$SINCE" '+%Y-%m-%d %H:%M:%S UTC')
JOURNAL_SINCE=$(date -d "@$SINCE" '+%Y-%m-%d %H:%M:%S')
AUDIT_SINCE=$(date -d "@$SINCE" '+%x %T')

{
  printf 'SECURITY INCIDENT %s on %s at %s\n' "$INCIDENT" "$HOST" \
    "$(date -u -d "@$NOW" '+%Y-%m-%d %H:%M:%S UTC')"
  printf '%s\n' \
    'An SSH key that security.yml did not deploy can log in, or sshd takes keys from elsewhere.' \
    'Remove every UNAUTHORIZED or OPTIONS entry below, rotate the credentials the' \
    'account could reach, and treat the server as compromised until this is explained.'
  section PROBLEMS
  printf -- '- %s\n' "${problems[@]}"
} > "$WORK/report"
section 'UNAUTHORIZED ENTRIES'
cat "$WORK/entries" >> "$WORK/report"
section 'EVERY KEY ON THE SERVER'
cat "$WORK/keys" >> "$WORK/report"

section "CHANGES SINCE THE LAST CHECK ($SINCE_TEXT)"
if [[ -s "$WORK/changes" ]]; then
  cat "$WORK/changes" >> "$WORK/report"
else
  echo 'No change since the last check (the entries were already there).' \
    >> "$WORK/report"
fi

section 'KEY FILES'
for file in "${!bad_files[@]}"; do
  {
    run stat -c '%n owner=%U:%G mode=%a inode=%i size=%s modified=%y changed=%z' \
      -- "$file"
    [[ -L "$file" ]] && printf '  symlink to %s\n' "$(readlink -f -- "$file")"
    run stat -c '%n owner=%U:%G mode=%a modified=%y changed=%z' \
      -- "$(dirname -- "$file")"
  } >> "$WORK/report"
done

# Who wrote the files: auditd records (security.yml watches /root/.ssh and
# /home), then the login session each writer came from.
section "WHO CHANGED THE FILES (auditd since $SINCE_TEXT)"
{
  for key in root_ssh_keys user_ssh_keys; do
    run ausearch -i -k "$key" --start "$AUDIT_SINCE"
  done
} | awk -v RS='----' '/authorized_keys|\.ssh/ { printf "----%s", $0 }' |
  head -c 40000 > "$WORK/audit"
if [[ -s "$WORK/audit" ]]; then
  cat "$WORK/audit" >> "$WORK/report"
else
  echo 'No auditd record (auditd is off, or the change was older).' \
    >> "$WORK/report"
fi
sessions=$(grep -o ' ses=[0-9]\+' "$WORK/audit" | cut -d= -f2 | sort -un |
  head -n 20)
pids=$(grep -oE ' (pid|ppid)=[0-9]+' "$WORK/audit" | cut -d= -f2 | sort -un |
  head -n 40)
section 'LOGIN SESSIONS OF THE WRITERS'
for session in $sessions; do
  run ausearch -i --session "$session" -m USER_LOGIN,USER_START,USER_AUTH,CRED_ACQ \
    >> "$WORK/report"
done
[[ -z "$sessions" ]] && echo 'No session in the auditd records.' >> "$WORK/report"
if [[ -n "$pids" ]]; then
  section 'WRITER PROCESSES STILL RUNNING'
  run ps -o pid,ppid,user,lstart,tty,args -p "$(printf '%s' "$pids" |
    paste -sd, -)" >> "$WORK/report"
fi

# Every login with an unauthorized key (journal and auth.log).
section 'LOGINS WITH THE UNAUTHORIZED KEYS (last 30 days)'
: > "$WORK/logins"
if ((${#fingerprints[@]})); then
  patterns_args=()
  for fingerprint in "${fingerprints[@]}"; do
    patterns_args+=(-e "$fingerprint")
  done
  {
    run journalctl --no-pager -q -o short-iso --since -30d \
      _COMM=sshd + _COMM=sshd-session
    cat "$LOG_DIR"/auth.log "$LOG_DIR"/auth.log.1 2>/dev/null
  } | grep -F "${patterns_args[@]}" | sort -u | tail -n 200 > "$WORK/logins"
fi
if [[ -s "$WORK/logins" ]]; then
  cat "$WORK/logins" >> "$WORK/report"
else
  echo 'No login with these keys found.' >> "$WORK/report"
fi

section 'LOGGED IN NOW (who)'
run who -u >> "$WORK/report"
section 'SSH CONNECTIONS NOW (ss)'
run ss -Htnp state established | grep -F sshd >> "$WORK/report"
section 'RECENT LOGINS (last)'
run last -i -F -w -n 30 >> "$WORK/report"

section "SSH LOG SINCE $SINCE_TEXT"
run journalctl --no-pager -q -o short-iso --since "$JOURNAL_SINCE" \
  _COMM=sshd + _COMM=sshd-session | tail -n 150 >> "$WORK/report"
section "SUDO LOG SINCE $SINCE_TEXT"
run journalctl --no-pager -q -o short-iso --since "$JOURNAL_SINCE" _COMM=sudo |
  tail -n 100 >> "$WORK/report"
section 'SHELL COMMANDS THAT TOUCH SSH KEYS (bash-commands.log)'
grep -aE 'authorized_keys|\.ssh|ssh-copy-id|ssh-keygen' \
  "$LOG_DIR/bash-commands.log" 2>/dev/null | tail -n 100 >> "$WORK/report"
section 'LATEST SHELL COMMANDS (bash-commands.log)'
tail -n 50 "$LOG_DIR/bash-commands.log" 2>/dev/null >> "$WORK/report"
section 'SSHD KEY SETTINGS (sshd -T)'
printf '%s\n' "$sshd_settings" | grep -E '^(authorized|trustedusercakeys|pubkey|permitrootlogin|passwordauthentication)' \
  >> "$WORK/report"

# Every IP in the report, with its reverse DNS and whether it is a known IP.
section 'IP ADDRESSES'
# (IPv4 anywhere; IPv6 after "from", "addr=" or "rhost=", or in brackets as
# ss prints it.)  The server's own addresses are left out.
local_ips=" $(hostname -I 2>/dev/null) "
{
  grep -oE '(^|[^0-9.])([0-9]{1,3}\.){3}[0-9]{1,3}($|[^0-9.])' "$WORK/report" |
    grep -oE '([0-9]{1,3}\.){3}[0-9]{1,3}'
  grep -oE '(from |addr=|rhost=)[0-9a-fA-F]*:[0-9a-fA-F:.]+|\[[0-9a-fA-F]*:[0-9a-fA-F:.]+\]' \
    "$WORK/report" | sed -E 's/^(from |addr=|rhost=)//; s/^\[//; s/\]$//'
} | sed -E 's/^::ffff://' | grep -Ev '^(127\.|0\.|::1?$)' | sort -u |
  while read -r ip; do
    [[ "$local_ips" == *" $ip "* ]] || printf '%s\n' "$ip"
  done | head -n 30 > "$WORK/ips"
if [[ -s "$WORK/ips" ]]; then
  while read -r ip; do
    name=$(timeout 3 getent hosts "$ip" | awk '{print $2}' | head -n 1)
    known=unknown
    grep -Fxq "$ip" "$KNOWN_IPS_FILE" 2>/dev/null && known='known (authorized-ips.conf)'
    printf '%s  reverse DNS: %s  %s\n' "$ip" "${name:-(none)}" "$known"
  done < "$WORK/ips" >> "$WORK/report"
else
  echo 'No remote IP found.' >> "$WORK/report"
fi

# Keep the report and a copy of each file for this incident.
if [[ "$previous" != "$INCIDENT" ]]; then
  evidence="$STATE_DIR/incidents/$STAMP-$INCIDENT"
  install -d -m 0700 "$evidence"
  cp -- "$WORK/report" "$evidence/report.txt"
  for file in "${!bad_files[@]}"; do
    head -c "$MAX_FILE_BYTES" "$file" > \
      "$evidence/$(printf '%s' "$file" | tr '/' '_')"
  done
  printf '%s\n' "$INCIDENT" > "$STATE_DIR/incident"
  find "$STATE_DIR/incidents" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' |
    sort | head -n "-$MAX_INCIDENTS" |
    while read -r old; do rm -rf -- "${STATE_DIR:?}/incidents/$old"; done
  printf '\nReport saved in %s\n' "$evidence" >> "$WORK/report"
fi

# The email is HTML with everything escaped, so nothing from a key comment or
# a log line can become markup.  It repeats every run (each alert key waits
# 10 minutes between emails) until the entries are removed.
{
  printf '<html><body><pre style="font-family:monospace;white-space:pre-wrap">'
  tr -d '\000-\010\013-\037\177' < "$WORK/report" |
    sed -e 's/&/\&amp;/g' -e 's/</\&lt;/g' -e 's/>/\&gt;/g' | head -c 120000
  printf '</pre></body></html>\n'
} > "$WORK/email"
"$ALERT" --body-file "$WORK/email" "authorized-keys-$INCIDENT" \
  "[SECURITY INCIDENT] Unauthorized SSH key on $HOST" ||
  echo "the incident email could not be sent; OnFailure still alerts" >&2

for item in "${problems[@]}"; do
  printf 'SECURITY INCIDENT %s: %s\n' "$INCIDENT" "$item" >&2
done
while read -r ip; do
  printf 'SECURITY INCIDENT %s: IP %s\n' "$INCIDENT" "$(safe "$ip")" >&2
done < "$WORK/ips"
exit 1
