#!/bin/bash
# fail2ban cluster bans
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Shares the bans of the local `sshd` jail with every other server, so an
# address banned on one server is banned on all of them.
#
#   fail2ban-cluster publish <ip>     called by fail2ban when `sshd` bans an
#                                     address; only queues it locally (never
#                                     blocks or fails the ban)
#   fail2ban-cluster unban <ip|cidr>  lifts every ban overlapping it, on
#                                     every server (sshd and sshd-cluster)
#   fail2ban-cluster target <ip>      prints what an address is banned as
#                                     here (exit 1 if invalid or ignored)
#   fail2ban-cluster run              the service: sends queued bans to Redis
#                                     and applies everyone's bans locally
#
# Bans are appended to a Redis stream (TLS, the application's Redis), so a
# server that was down or restarted catches up from where it left off, and
# a new server receives every earlier ban (and the ones this server had
# before the service was installed are sent once).  Each server applies
# them to its own `sshd-cluster` jail, which only bans (it does not publish
# again, so there is no loop), for SSH only:
#
#   - an IPv4 address is banned as is
#   - an IPv6 address is banned as its /64 (one host usually has a whole
#     /64), or as itself if the /64 overlaps the ignore list
#   - once SUBNET_THRESHOLD distinct IPv4 addresses of one /24 have been
#     banned (on any server), the whole /24 is banned
#
# Nothing that overlaps the ignore list (/etc/fail2ban-cluster/ignore: our
# own servers, the operators' addresses) is ever banned: fail2ban's `banip`
# does not check `ignoreip` itself.  When the ignore list changes, bans
# that overlap it are lifted, in both jails.  While a host name of the list
# cannot be resolved (and was never resolved before), no ban is applied.
#
# Full resync of a server: stop the service, remove /var/lib/fail2ban-cluster
# and start it again (every ban in the stream is applied again).
#

set -o pipefail
umask 077

JAIL="${FAIL2BAN_CLUSTER_JAIL:-sshd-cluster}"
SOURCE_JAIL="${FAIL2BAN_CLUSTER_SOURCE_JAIL:-sshd}"
STREAM="${FAIL2BAN_CLUSTER_STREAM:-fail2ban_cluster:sshd}"
STREAM_MAXLEN="${FAIL2BAN_CLUSTER_STREAM_MAXLEN:-500000}"
SUBNET_THRESHOLD="${FAIL2BAN_CLUSTER_SUBNET_THRESHOLD:-3}"
POLL_SECONDS="${FAIL2BAN_CLUSTER_POLL_SECONDS:-5}"
IGNORE_REFRESH_SECONDS="${FAIL2BAN_CLUSTER_IGNORE_REFRESH_SECONDS:-600}"
STATE_DIR="${FAIL2BAN_CLUSTER_STATE_DIR:-/var/lib/fail2ban-cluster}"
SPOOL_DIR="${FAIL2BAN_CLUSTER_SPOOL_DIR:-/var/spool/fail2ban-cluster}"
IGNORE_FILE="${FAIL2BAN_CLUSTER_IGNORE_FILE:-/etc/fail2ban-cluster/ignore}"
PASSWORD_FILE="${FAIL2BAN_CLUSTER_PASSWORD_FILE:-/etc/fail2ban-cluster/redis-password}"
read -r -a FAIL2BAN_CLIENT <<< "${FAIL2BAN_CLUSTER_CLIENT:-fail2ban-client}"
BATCH=500

RE_STREAM_ID='^[0-9]+-[0-9]+$'
RE_JAIL='^[A-Za-z0-9_-]+$'

# the last error, logged once per failure streak by `run`
LAST_ERROR=''

log() {
  printf '%s\n' "$*" >&2
}

f2b() {
  timeout 300 "${FAIL2BAN_CLIENT[@]}" "$@"
}

# ---------------------------------------------------------------------------
# Addresses
#
# An address or range is handled as a hex string (8 digits for IPv4, 32 for
# IPv6) and a prefix length, so ranges of either family compare the same way.
# ---------------------------------------------------------------------------

is_ipv4() {
  local octet='(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])'
  [[ $1 =~ ^$octet\.$octet\.$octet\.$octet$ ]]
}

# sets HEX to the 8 hex digits of an IPv4 address
ipv4_hex() {
  local IFS=.
  # shellcheck disable=SC2086
  set -- $1
  printf -v HEX '%02x%02x%02x%02x' "$1" "$2" "$3" "$4"
}

# sets HEX to the 32 hex digits of an IPv6 address, or fails
ipv6_hex() {
  local ip="${1,,}" head tail v4 hex group part i
  local -a groups=() left=() right=()

  (( ${#ip} >= 2 && ${#ip} <= 45 )) || return 1
  [[ $ip =~ ^[0-9a-f:.]+$ ]] || return 1
  # a single leading or trailing ":" is invalid (only "::" may be there)
  [[ $ip == :* && $ip != ::* ]] && return 1
  [[ $ip == *: && $ip != *:: ]] && return 1

  # embedded IPv4 (::ffff:192.0.2.1), only as the last part
  if [[ $ip == *.* ]]; then
    v4="${ip##*:}"
    is_ipv4 "$v4" || return 1
    ipv4_hex "$v4"
    hex="$HEX"
    ip="${ip%:*}:${hex:0:4}:${hex:4:4}"
  fi

  if [[ $ip == *::* ]]; then
    head="${ip%%::*}"
    tail="${ip#*::}"
    [[ $tail == *::* ]] && return 1
    [[ -n $head ]] && IFS=: read -r -a left <<< "$head"
    [[ -n $tail ]] && IFS=: read -r -a right <<< "$tail"
    (( ${#left[@]} + ${#right[@]} <= 7 )) || return 1
    groups=("${left[@]}")
    for (( i = ${#left[@]} + ${#right[@]}; i < 8; i++ )); do groups+=(0); done
    groups+=("${right[@]}")
  else
    IFS=: read -r -a groups <<< "$ip"
  fi

  (( ${#groups[@]} == 8 )) || return 1
  hex=''
  for group in "${groups[@]}"; do
    [[ $group =~ ^[0-9a-f]{1,4}$ ]] || return 1
    printf -v part '%04x' "$((16#$group))"
    hex+="$part"
  done
  HEX="$hex"
}

# whether two ranges (hex, prefix length) overlap: they share the shorter
# prefix
ranges_overlap() {
  local a="$1" alen="$2" b="$3" blen="$4" len nibbles bits
  (( ${#a} == ${#b} )) || return 1
  len=$(( alen < blen ? alen : blen ))
  nibbles=$(( len / 4 ))
  bits=$(( len % 4 ))
  [[ ${a:0:nibbles} == "${b:0:nibbles}" ]] || return 1
  (( bits == 0 )) && return 0
  (( (16#${a:nibbles:1} >> (4 - bits)) == (16#${b:nibbles:1} >> (4 - bits)) ))
}

# Parses an address or CIDR range into RANGE_HEX and RANGE_LEN.
parse_range() {
  local text="$1" address len max
  address="${text%/*}"
  len=''
  [[ $text == */* ]] && len="${text#*/}"

  if is_ipv4 "$address"; then
    ipv4_hex "$address"
    max=32
  else
    ipv6_hex "$address" || return 1
    max=128
  fi

  [[ -z $len ]] && len=$max
  [[ $len =~ ^[0-9]{1,3}$ ]] || return 1
  len=$(( 10#$len ))
  (( len <= max )) || return 1
  RANGE_HEX="$HEX" RANGE_LEN="$len"
}

# Parses an address into TARGET (what fail2ban bans), TARGET_HEX and
# TARGET_LEN, TARGET_V4 (the IPv4 address, for /24 counting) and, for IPv6,
# TARGET_ADDRESS / TARGET_ADDRESS_HEX (the single address).
parse_target() {
  local ip="$1" hex
  TARGET='' TARGET_HEX='' TARGET_LEN=0 TARGET_V4='' TARGET_ADDRESS='' TARGET_ADDRESS_HEX=''

  if is_ipv4 "$ip"; then
    ipv4_hex "$ip"
    TARGET="$ip" TARGET_HEX="$HEX" TARGET_LEN=32 TARGET_V4="$ip"
    return 0
  fi

  ipv6_hex "$ip" || return 1
  hex="$HEX"

  # IPv4-mapped (::ffff:0:0/96)
  if [[ ${hex:0:24} == 00000000000000000000ffff ]]; then
    TARGET_V4="$((16#${hex:24:2})).$((16#${hex:26:2})).$((16#${hex:28:2})).$((16#${hex:30:2}))"
    TARGET="$TARGET_V4" TARGET_HEX="${hex:24:8}" TARGET_LEN=32
    return 0
  fi

  printf -v TARGET '%x:%x:%x:%x::/64' "$((16#${hex:0:4}))" "$((16#${hex:4:4}))" "$((16#${hex:8:4}))" "$((16#${hex:12:4}))"
  TARGET_HEX="${hex:0:16}0000000000000000"
  TARGET_LEN=64
  TARGET_ADDRESS="${ip,,}" TARGET_ADDRESS_HEX="$hex"
}

# After parse_target: what may be banned without overlapping the ignore list
# (an IPv6 /64 falls back to the single address).  Fails if nothing may.
allowed_target() {
  is_ignored "$TARGET_HEX" "$TARGET_LEN" || return 0
  if (( TARGET_LEN == 64 )) && ! is_ignored "$TARGET_ADDRESS_HEX" 128; then
    TARGET="$TARGET_ADDRESS" TARGET_HEX="$TARGET_ADDRESS_HEX" TARGET_LEN=128
    return 0
  fi
  return 1
}

# ---------------------------------------------------------------------------
# Ignore list: addresses, CIDR ranges and host names.  Names are resolved
# again every IGNORE_REFRESH_SECONDS; a name that stops resolving keeps its
# last addresses (also kept across restarts, in STATE_DIR/resolved).
# ---------------------------------------------------------------------------

IGNORE_HEX=()
IGNORE_LEN=()
IGNORE_COMPLETE=1
UNRESOLVED=''
declare -A RESOLVED=()

add_ignore() {
  parse_range "$1" || return 1
  IGNORE_HEX+=("$RANGE_HEX")
  IGNORE_LEN+=("$RANGE_LEN")
}

load_resolved_cache() {
  local name addresses
  [[ -r $STATE_DIR/resolved ]] || return 0
  while read -r name addresses; do
    [[ -n $name && -n $addresses ]] && RESOLVED[$name]="$addresses"
  done < "$STATE_DIR/resolved"
}

save_resolved_cache() {
  local name
  [[ -d $STATE_DIR && -w $STATE_DIR ]] || return 0
  for name in "${!RESOLVED[@]}"; do
    printf '%s %s\n' "$name" "$(tr '\n' ' ' <<< "${RESOLVED[$name]}")"
  done > "$STATE_DIR/resolved.tmp" && mv -f "$STATE_DIR/resolved.tmp" "$STATE_DIR/resolved"
}

load_ignore() {
  local line entry addresses address changed=0
  IGNORE_HEX=()
  IGNORE_LEN=()
  IGNORE_COMPLETE=1
  UNRESOLVED=''

  # never ban loopback, whatever the file says
  add_ignore 127.0.0.0/8
  add_ignore ::1

  if [[ ! -r $IGNORE_FILE ]]; then
    IGNORE_COMPLETE=0
    UNRESOLVED="$IGNORE_FILE (unreadable)"
    return 0
  fi

  while IFS= read -r line || [[ -n $line ]]; do
    line="${line%%#*}"
    for entry in $line; do
      if add_ignore "$entry"; then
        continue
      elif [[ $entry == */* ]] || ! [[ $entry =~ ^[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?$ ]]; then
        log "warning: invalid ignore entry: ${entry:0:100}"
        continue
      fi

      addresses="$(timeout 10 getent ahosts "$entry" | awk '{ print $1 }' | sort -u)"
      if [[ -n $addresses ]]; then
        [[ $addresses != "${RESOLVED[$entry]:-}" ]] && changed=1
        RESOLVED[$entry]="$addresses"
      elif [[ -z ${RESOLVED[$entry]:-} ]]; then
        # (never resolved: its addresses are unknown)
        IGNORE_COMPLETE=0
        UNRESOLVED+="$entry "
      fi

      for address in ${RESOLVED[$entry]:-}; do
        add_ignore "$address" || true
      done
    done
  done < "$IGNORE_FILE"

  (( changed )) && save_resolved_cache
  return 0
}

is_ignored() {
  local hex="$1" len="$2" i
  for i in "${!IGNORE_HEX[@]}"; do
    ranges_overlap "$hex" "$len" "${IGNORE_HEX[$i]}" "${IGNORE_LEN[$i]}" && return 0
  done
  return 1
}

ignore_signature() {
  local i
  for i in "${!IGNORE_HEX[@]}"; do
    printf '%s/%s\n' "${IGNORE_HEX[$i]}" "${IGNORE_LEN[$i]}"
  done | sort -u | tr '\n' ' '
}

# ---------------------------------------------------------------------------
# fail2ban
# ---------------------------------------------------------------------------

# sets BANNED to the entries a jail has banned, one per line
banned() {
  local out
  out="$(f2b get "$1" banned 2>&1)" || {
    LAST_ERROR="fail2ban: ${out:0:200}"
    return 1
  }
  # (none: grep finds nothing)
  BANNED="$(grep -oE "'[0-9A-Fa-f:./]+'" <<< "$out" | tr -d "'" || true)"
  return 0
}

# Bans entries in the cluster jail (in batches); fails with LAST_ERROR.
ban_now() {
  local out i
  local -a entries=("$@")
  for (( i = 0; i < ${#entries[@]}; i += BATCH )); do
    out="$(f2b set "$JAIL" banip "${entries[@]:i:BATCH}" 2>&1)" || {
      LAST_ERROR="fail2ban: ${out:0:200}"
      return 1
    }
  done
}

# Ranges to look for (CHECK_HEX, CHECK_LEN) in BANNED.  Sets CANDIDATES to
# the entries that may overlap one: IPv6 entries, ranges, and IPv4
# addresses starting with the text of a range's whole octets.  A cheap
# filter for lists of many thousands of bans; candidates are then checked
# exactly.
CHECK_HEX=()
CHECK_LEN=()

filter_candidates() {
  local i octets o prefix
  local -a prefixes=()
  for i in "${!CHECK_HEX[@]}"; do
    (( ${#CHECK_HEX[$i]} == 8 )) || continue
    octets=$(( CHECK_LEN[i] / 8 ))
    if (( octets == 0 )); then
      CANDIDATES="$BANNED"
      return 0
    fi

    prefix=''
    for (( o = 0; o < octets; o++ )); do
      prefix+="$((16#${CHECK_HEX[$i]:o*2:2}))"
      (( o < 3 )) && prefix+='.'
    done
    prefixes+=("$prefix")
  done

  CANDIDATES="$(awk -v list="${prefixes[*]}" '
    BEGIN { n = split(list, prefixes, " ") }
    /[:\/]/ { print; next }
    {
      for (i = 1; i <= n; i++) {
        p = prefixes[i]
        if ((p ~ /\.$/ && index($0, p) == 1) || $0 == p) { print; next }
      }
    }' <<< "$BANNED")"
}

# Lifts the bans (in both jails) overlapping any of CHECK_HEX/CHECK_LEN.
lift_overlapping() {
  local reason="$1" jail entry out i
  local -a entries=()
  for jail in "$JAIL" "$SOURCE_JAIL"; do
    banned "$jail" || return 1
    filter_candidates
    entries=()
    while read -r entry; do
      [[ -n $entry ]] && parse_range "$entry" || continue
      for i in "${!CHECK_HEX[@]}"; do
        if ranges_overlap "$RANGE_HEX" "$RANGE_LEN" "${CHECK_HEX[$i]}" "${CHECK_LEN[$i]}"; then
          entries+=("$entry")
          break
        fi
      done
    done <<< "$CANDIDATES"

    for (( i = 0; i < ${#entries[@]}; i += BATCH )); do
      out="$(f2b set "$jail" unbanip "${entries[@]:i:BATCH}" 2>&1)" || {
        LAST_ERROR="fail2ban: ${out:0:200}"
        return 1
      }
    done
    (( ${#entries[@]} > 0 )) && log "unbanned in $jail ($reason): ${entries[*]:0:20}"
  done
  return 0
}

# the recorded addresses of a /24 (STATE_DIR/ipv4/a.b.c) that may still be
# banned, one by one, into REBAN
queue_rebans() {
  local address
  while read -r address; do
    parse_target "$address" && allowed_target && REBAN+=("$TARGET")
  done < "$1"
}

# the narrowest range `unban` accepts: /16 (IPv4) or /32 (IPv6)
unban_range_allowed() {
  if (( ${#RANGE_HEX} == 8 )); then (( RANGE_LEN >= 16 )); else (( RANGE_LEN >= 32 )); fi
}

# Lifts every ban (in both jails) overlapping a range, on this server.  A
# /24 the range is part of is lifted too; its other recorded addresses stay
# banned, one by one.
unban_overlapping() {
  local hex="$1" len="$2" file address
  local -a keep=()
  REBAN=()
  CHECK_HEX=("$hex") CHECK_LEN=("$len")
  lift_overlapping unban || return 1

  (( ${#hex} == 8 )) || return 0
  # (a /16 at most: the files of its first two octets)
  for file in "$STATE_DIR/ipv4/$((16#${hex:0:2})).$((16#${hex:2:2}))."*; do
    [[ -e $file && $file != *.banned ]] || continue
    parse_range "${file##*/}.0/24" && ranges_overlap "$hex" "$len" "$RANGE_HEX" 24 || continue

    if (( len <= 24 )); then
      rm -f "$file" "$file.banned"
      continue
    fi

    keep=()
    while read -r address; do
      parse_range "$address" && ! ranges_overlap "$hex" "$len" "$RANGE_HEX" 32 && keep+=("$address")
    done < "$file"
    if (( ${#keep[@]} > 0 )); then printf '%s\n' "${keep[@]}" > "$file"; else rm -f "$file"; fi

    if [[ -e $file.banned ]]; then
      rm -f "$file.banned"
      [[ -e $file ]] && queue_rebans "$file"
    fi
  done

  if (( ${#REBAN[@]} > 0 )); then
    ban_now "${REBAN[@]}" || return 1
    log "banned again one by one: ${REBAN[*]:0:20}"
  fi
  return 0
}

# When the ignore list changed: lift the bans that overlap it.  A /24 that
# overlaps it is no longer banned as a whole; its other recorded addresses
# stay banned, one by one.
reconcile() {
  local signature marker
  signature="$(ignore_signature)"
  [[ $signature == "$(cat "$STATE_DIR/reconciled" 2> /dev/null)" ]] && return 0

  # (loopback, the first two, is never banned)
  CHECK_HEX=("${IGNORE_HEX[@]:2}") CHECK_LEN=("${IGNORE_LEN[@]:2}")
  if (( ${#CHECK_HEX[@]} > 0 )); then
    lift_overlapping 'now on the ignore list' || return 1
  fi

  REBAN=()
  for marker in "$STATE_DIR"/ipv4/*.banned; do
    [[ -e $marker ]] || continue
    parse_range "$(basename "$marker" .banned).0/24" && is_ignored "$RANGE_HEX" 24 || continue
    rm -f "$marker"
    [[ -e ${marker%.banned} ]] && queue_rebans "${marker%.banned}"
  done

  if (( ${#REBAN[@]} > 0 )); then
    ban_now "${REBAN[@]}" || return 1
    log "banned again one by one: ${REBAN[*]:0:20}"
  fi

  printf '%s\n' "$signature" > "$STATE_DIR/reconciled" || {
    LAST_ERROR="cannot write $STATE_DIR/reconciled"
    return 1
  }
}

# ---------------------------------------------------------------------------
# Redis
# ---------------------------------------------------------------------------

REDIS_ADDRESS=''

resolve_redis() {
  if is_ipv4 "$REDIS_HOST"; then
    REDIS_ADDRESS="$REDIS_HOST"
    return 0
  fi

  # IPv4, as the application connects (the Redis allowlist is IPv4 only)
  local address
  address="$(timeout 10 getent ahostsv4 "$REDIS_HOST" | awk 'NR == 1 { print $1 }')"
  [[ -n $address ]] && REDIS_ADDRESS="$address"
  [[ -n $REDIS_ADDRESS ]]
}

redis() {
  # valkey-cli where Valkey is installed (its redis-cli is only a symlink)
  local cli
  cli="$(type -P valkey-cli || type -P redis-cli)" || {
    printf 'neither valkey-cli nor redis-cli is installed' > "$STATE_DIR/redis.err"
    return 127
  }

  local -a args=(--tls --sni "$REDIS_HOST" -h "$REDIS_ADDRESS" -p "$REDIS_PORT")
  [[ -n ${REDIS_CACERT:-} ]] && args+=(--cacert "$REDIS_CACERT")
  # the password is read from REDISCLI_AUTH (never the command line)
  timeout 30 "$cli" "${args[@]}" "$@" 2> "$STATE_DIR/redis.err"
}

redis_error() {
  local error
  error="$(head -c 200 "$STATE_DIR/redis.err" 2> /dev/null)"
  LAST_ERROR="Redis: ${error:-${1:0:200}}"
}

# appends each argument to the stream
readonly XADD_SCRIPT='
for i = 2, #ARGV do
  redis.call("XADD", KEYS[1], "MAXLEN", "~", ARGV[1], "*", "b", ARGV[i])
end
return #ARGV - 1
'

# entries after ARGV[1] as "<id> <value>", one per line (only the characters
# a value can contain are kept, so a line can never be misread)
readonly XRANGE_SCRIPT='
local entries = redis.call("XRANGE", KEYS[1], ARGV[1], "+", "COUNT", tonumber(ARGV[2]))
local out = {}
for i, entry in ipairs(entries) do
  local value = ""
  local fields = entry[2]
  for j = 1, #fields - 1, 2 do
    if fields[j] == "b" then value = fields[j + 1] end
  end
  value = string.gsub(value, "[^%w%.:,/%-]", "")
  out[i] = entry[1] .. " " .. value
end
return out
'

# ---------------------------------------------------------------------------
# Local queue of bans (and unbans) to publish
# ---------------------------------------------------------------------------

queue() {
  mkdir -p "$SPOOL_DIR" || return 1
  (
    flock -w 10 9 || exit 1
    printf '%s\n' "$@" >> "$SPOOL_DIR/outbox"
  ) 9> "$SPOOL_DIR/.lock"
}

publish() {
  local ip="$1"
  if ! parse_target "$ip"; then
    log "publish: not an IP address: ${ip:0:100}"
    return 0
  fi

  queue "$ip" || log "publish: could not queue $ip"
  # never fail fail2ban's ban action
  return 0
}

HOST_NAME=''

flush_outbox() {
  local sending="$SPOOL_DIR/sending" line reply
  local -a values=()

  if [[ ! -s $sending ]]; then
    [[ -s $SPOOL_DIR/outbox ]] || return 0
    (
      flock -w 10 9 || exit 1
      mv -f "$SPOOL_DIR/outbox" "$sending"
    ) 9> "$SPOOL_DIR/.lock" || {
      LAST_ERROR="cannot read $SPOOL_DIR/outbox"
      return 1
    }
  fi

  while IFS= read -r line || [[ -n $line ]]; do
    if [[ $line == 'unban '* ]]; then
      parse_range "${line#unban }" && values+=("${line#unban },$HOST_NAME,$SOURCE_JAIL,unban")
    else
      parse_target "$line" && values+=("$line,$HOST_NAME,$SOURCE_JAIL")
    fi
  done < "$sending"

  local i
  local -a batch=()
  for (( i = 0; i < ${#values[@]}; i += BATCH )); do
    batch=("${values[@]:i:BATCH}")
    reply="$(redis EVAL "$XADD_SCRIPT" 1 "$STREAM" "$STREAM_MAXLEN" "${batch[@]}")"
    if [[ $reply != "${#batch[@]}" ]]; then
      redis_error "$reply"
      # (kept, and sent again; a ban received twice is harmless)
      return 1
    fi
  done

  rm -f "$sending"
  (( ${#values[@]} > 0 )) && log "published ${#values[@]} ban(s)"
  return 0
}

# Once, queue the bans the local jail already has (from before this service
# was installed).  They are read from fail2ban's database: after a restart,
# fail2ban restores its bans in the background, so the jail's own list can
# still be incomplete.  Returns 2 while waiting.
SEED_LIST=''
SEED_SINCE=0

seed() {
  local list db ip now rows
  local -A ips=()

  [[ $SOURCE_JAIL =~ $RE_JAIL ]] || {
    LAST_ERROR="invalid jail name: $SOURCE_JAIL"
    return 1
  }
  banned "$SOURCE_JAIL" || return 1
  list="$BANNED"

  db="$(f2b get dbfile 2> /dev/null | awk '$1 == "`-" { print $2 }')"
  if [[ -n $db && -r $db ]] && type -P sqlite3 > /dev/null; then
    # (current bans only: permanent ones, and temporary ones not expired)
    rows="$(sqlite3 -readonly -cmd '.timeout 10000' "$db" \
      "SELECT DISTINCT ip FROM bips WHERE jail = '$SOURCE_JAIL' AND (bantime < 0 OR timeofban + bantime > CAST(strftime('%s', 'now') AS INTEGER));" 2>&1)" || {
      LAST_ERROR="fail2ban database: ${rows:0:200}"
      return 1
    }
    list+=$'\n'"$rows"
  else
    # without the database: once the jail's list stopped changing for a minute
    now="$(date +%s)"
    if [[ $list != "$SEED_LIST" ]]; then
      SEED_LIST="$list" SEED_SINCE="$now"
      return 2
    fi
    (( now - SEED_SINCE >= 60 )) || return 2
  fi

  while read -r ip; do
    parse_target "$ip" && ips[$ip]=1
  done <<< "$list"

  if (( ${#ips[@]} > 0 )); then
    queue "${!ips[@]}" || {
      LAST_ERROR="cannot write $SPOOL_DIR/outbox"
      return 1
    }
  fi

  touch "$STATE_DIR/seeded"
  log "queued ${#ips[@]} existing ban(s) of $SOURCE_JAIL"
}

# ---------------------------------------------------------------------------
# Applying bans
# ---------------------------------------------------------------------------

LAST_ID='0'

load_last_id() {
  local id
  id="$(cat "$STATE_DIR/last-id" 2> /dev/null)"
  [[ $id =~ $RE_STREAM_ID ]] && LAST_ID="$id"
}

save_last_id() {
  printf '%s\n' "$1" > "$STATE_DIR/last-id.tmp" &&
    mv -f "$STATE_DIR/last-id.tmp" "$STATE_DIR/last-id" && LAST_ID="$1"
}

PENDING=()
MARKERS=()
declare -A SEEN=()

apply_pending() {
  local out marker
  if (( ${#PENDING[@]} > 0 )); then
    out="$(f2b set "$JAIL" banip "${PENDING[@]}" 2>&1)" || {
      LAST_ERROR="fail2ban: ${out:0:200}"
      return 1
    }

    for marker in "${MARKERS[@]}"; do touch "$marker"; done
    log "banned ${#PENDING[@]}: ${PENDING[*]:0:20}$( (( ${#PENDING[@]} > 20 )) && printf ' ...')"
  fi

  PENDING=()
  MARKERS=()
  SEEN=()
}

# Reads the next entries after LAST_ID and applies them, in order.
# Returns 0 when a full batch was read (more may follow), 2 when caught up,
# 1 on error (nothing is marked read, so it is retried; applying an entry
# twice is harmless).
pull() {
  local start out line id value ip subnet subnet_file count last='' read_count=0

  if [[ $LAST_ID == 0 ]]; then start='-'; else start="($LAST_ID"; fi
  out="$(redis EVAL "$XRANGE_SCRIPT" 1 "$STREAM" "$start" "$BATCH")" || {
    redis_error "$out"
    return 1
  }

  PENDING=()
  MARKERS=()
  SEEN=()

  while IFS= read -r line; do
    [[ -z $line ]] && continue
    id="${line%% *}"
    if [[ ! $id =~ $RE_STREAM_ID ]]; then
      redis_error "$out"
      return 1
    fi

    last="$id"
    read_count=$(( read_count + 1 ))
    value="${line#* }"
    ip="${value%%,*}"

    if [[ ${value##*,} == unban ]]; then
      parse_range "$ip" || continue
      if ! unban_range_allowed; then
        log "skipped an unban of $ip: wider than /16 (IPv4) or /32 (IPv6)"
        continue
      fi
      apply_pending || return 1
      unban_overlapping "$RANGE_HEX" "$RANGE_LEN" || return 1
      continue
    fi

    parse_target "$ip" || continue
    allowed_target || continue

    if [[ -n $TARGET_V4 ]] && (( SUBNET_THRESHOLD > 0 )); then
      subnet="${TARGET_V4%.*}"
      subnet_file="$STATE_DIR/ipv4/$subnet"
      grep -qxF "$TARGET_V4" "$subnet_file" 2> /dev/null || printf '%s\n' "$TARGET_V4" >> "$subnet_file"
      # already banned as part of its /24 (still recorded, in case the /24
      # is lifted)
      [[ -e $subnet_file.banned ]] && continue
      count="$(wc -l < "$subnet_file")"
      if (( count >= SUBNET_THRESHOLD )) && [[ -z ${SEEN[$subnet.0/24]:-} ]] &&
        ! is_ignored "${TARGET_HEX:0:6}00" 24; then
        SEEN[$subnet.0/24]=1
        PENDING+=("$subnet.0/24")
        MARKERS+=("$subnet_file.banned")
        continue
      fi
    fi

    [[ -n ${SEEN[$TARGET]:-} ]] && continue
    SEEN[$TARGET]=1
    PENDING+=("$TARGET")
  done <<< "$out"

  apply_pending || return 1

  if [[ -n $last ]] && ! save_last_id "$last"; then
    LAST_ERROR="cannot write $STATE_DIR/last-id"
    return 1
  fi

  (( read_count >= BATCH )) && return 0
  return 2
}

run() {
  if [[ -z ${REDIS_HOST:-} || -z ${REDIS_PORT:-} ]]; then
    log "REDIS_HOST and REDIS_PORT are required"
    exit 1
  fi

  # redis-cli reads the password from REDISCLI_AUTH (never the command line)
  if [[ -z ${REDISCLI_AUTH:-} && -r $PASSWORD_FILE ]]; then
    REDISCLI_AUTH="$(< "$PASSWORD_FILE")"
    export REDISCLI_AUTH
  fi

  [[ $SUBNET_THRESHOLD =~ ^[0-9]+$ ]] || SUBNET_THRESHOLD=3
  [[ $POLL_SECONDS =~ ^[0-9]+$ ]] && (( POLL_SECONDS > 0 )) || POLL_SECONDS=5
  [[ $IGNORE_REFRESH_SECONDS =~ ^[0-9]+$ ]] || IGNORE_REFRESH_SECONDS=600

  HOST_NAME="${FAIL2BAN_CLUSTER_HOSTNAME:-$(hostname -f 2> /dev/null || hostname)}"
  HOST_NAME="${HOST_NAME//[^A-Za-z0-9.-]/}"
  mkdir -p "$STATE_DIR/ipv4" "$SPOOL_DIR" || exit 1
  load_last_id
  load_resolved_cache

  local loaded=0 now healthy=1 status seeded
  while true; do
    now="$(date +%s)"
    LAST_ERROR=''

    if (( ! IGNORE_COMPLETE || now - loaded >= IGNORE_REFRESH_SECONDS )); then
      load_ignore
      resolve_redis
      loaded="$now"
    elif [[ -z $REDIS_ADDRESS ]]; then
      resolve_redis
    fi

    status=1
    if [[ -z $REDIS_ADDRESS ]]; then
      LAST_ERROR="$REDIS_HOST did not resolve"
    else
      # (publishing does not depend on the ignore list)
      flush_outbox

      if (( ! IGNORE_COMPLETE )); then
        LAST_ERROR="no bans applied until the ignore list is known: ${UNRESOLVED}did not resolve"
      elif reconcile; then
        seeded=0
        if [[ -e $STATE_DIR/seeded ]]; then
          seeded=1
        else
          seed
          case $? in
            0) seeded=1 ;;
            # (waiting for fail2ban to restore its bans)
            2) status=2 ;;
          esac
        fi

        if (( seeded )) && [[ -z $LAST_ERROR ]]; then
          pull
          status=$?
        fi
      fi
    fi

    [[ -n $LAST_ERROR ]] && status=1

    if (( status == 1 )); then
      (( healthy )) && log "error: ${LAST_ERROR:-unknown} (retrying every ${POLL_SECONDS}s)"
      healthy=0
    elif (( ! healthy )); then
      log "recovered"
      healthy=1
    fi

    (( status == 0 )) && continue
    sleep "$POLL_SECONDS"
  done
}

case "${1:-}" in
  publish)
    publish "${2:-}"
    ;;
  unban)
    if ! parse_range "${2:-}"; then
      log "usage: $0 unban <ip or CIDR range>"
      exit 64
    fi
    if ! unban_range_allowed; then
      log "refused: wider than /16 (IPv4) or /32 (IPv6)"
      exit 64
    fi
    queue "unban ${2,,}" || exit 1
    log "queued: bans overlapping ${2,,} will be lifted on every server"
    ;;
  target)
    load_resolved_cache
    load_ignore
    parse_target "${2:-}" || { log "not an IP address"; exit 1; }
    if ! allowed_target; then
      log "ignored: $TARGET"
      exit 1
    fi
    printf '%s\n' "$TARGET"
    ;;
  run)
    run
    ;;
  *)
    log "usage: $0 publish <ip> | unban <ip|cidr> | target <ip> | run"
    exit 64
    ;;
esac
