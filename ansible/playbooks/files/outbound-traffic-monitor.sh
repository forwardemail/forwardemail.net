#!/usr/bin/env bash
# SPDX-License-Identifier: BUSL-1.1
#
# Measures aggregate outbound traffic from the default-route interface and
# alerts only after a sustained threshold breach.  The interface counters are
# authoritative for host-wide traffic; socket and process sections provide a
# contemporaneous attribution snapshot for investigation.

set -uo pipefail

readonly CONFIG_FILE=/etc/security-monitor/outbound-traffic-monitor.conf
readonly STATE_DIR=/var/lib/outbound-traffic-monitor
readonly ALERT_SENDER=/usr/local/bin/send-rate-limited-email.sh
readonly LOGGER_TAG=outbound-traffic-monitor

log() {
  logger -t "$LOGGER_TAG" -- "$*" 2>/dev/null || true
}

if [[ ! -r "$CONFIG_FILE" ]]; then
  log "configuration_missing path=$CONFIG_FILE"
  exit 0
fi

# shellcheck disable=SC1090
source "$CONFIG_FILE"

INTERFACE=${INTERFACE:-auto}
THRESHOLD_BPS=${THRESHOLD_BPS:-1000000000}
INTERVAL_SECONDS=${INTERVAL_SECONDS:-15}
CONSECUTIVE_BREACHES=${CONSECUTIVE_BREACHES:-2}
TOP_LINES=${TOP_LINES:-25}

if ! [[ "$THRESHOLD_BPS" =~ ^[1-9][0-9]*$ ]] ||
  ! [[ "$INTERVAL_SECONDS" =~ ^[1-9][0-9]*$ ]] ||
  ! [[ "$CONSECUTIVE_BREACHES" =~ ^[1-9][0-9]*$ ]] ||
  ! [[ "$TOP_LINES" =~ ^[1-9][0-9]*$ ]]; then
  log "invalid_configuration"
  exit 0
fi

if [[ "$INTERFACE" == auto ]]; then
  INTERFACE=$(ip route get 1.1.1.1 2>/dev/null | awk '{for (i = 1; i <= NF; i++) if ($i == "dev") {print $(i + 1); exit}}')
fi

if [[ -z "$INTERFACE" || ! -r "/sys/class/net/$INTERFACE/statistics/tx_bytes" ]]; then
  log "interface_unavailable interface=$INTERFACE"
  exit 0
fi

if ! mkdir -p "$STATE_DIR" || ! chmod 0700 "$STATE_DIR"; then
  log "state_directory_unavailable path=$STATE_DIR"
  exit 0
fi

state_name=$(printf '%s' "$INTERFACE" | tr -c 'A-Za-z0-9_.-' '_')
state_file="$STATE_DIR/$state_name.state"

read_counter() {
  local value
  value=$(cat "/sys/class/net/$INTERFACE/statistics/tx_bytes" 2>/dev/null || true)
  if [[ "$value" =~ ^[0-9]+$ ]]; then
    printf '%s' "$value"
  fi
}

format_bps() {
  awk -v bps="$1" 'BEGIN {
    if (bps >= 1000000000) printf "%.2f Gbps", bps / 1000000000;
    else if (bps >= 1000000) printf "%.2f Mbps", bps / 1000000;
    else if (bps >= 1000) printf "%.2f Kbps", bps / 1000;
    else printf "%.0f bps", bps;
  }'
}

read -r previous_bytes previous_timestamp previous_breaches previous_alerted < "$state_file" 2>/dev/null || true
previous_breaches=${previous_breaches:-0}
previous_alerted=${previous_alerted:-0}

start_bytes=$(read_counter)
start_timestamp=$(date +%s)
if [[ -z "$start_bytes" ]]; then
  log "counter_read_failed interface=$INTERFACE"
  exit 0
fi

# First observation seeds state only; it cannot produce a rate measurement.
if [[ -z "${previous_bytes:-}" || ! "$previous_bytes" =~ ^[0-9]+$ ]]; then
  printf '%s %s 0 0\n' "$start_bytes" "$start_timestamp" > "$state_file"
  chmod 0600 "$state_file"
  log "baseline_recorded interface=$INTERFACE"
  exit 0
fi

sleep "$INTERVAL_SECONDS"
end_bytes=$(read_counter)
end_timestamp=$(date +%s)
if [[ -z "$end_bytes" || ! "$end_timestamp" =~ ^[0-9]+$ ]]; then
  log "counter_read_failed interface=$INTERFACE"
  exit 0
fi

elapsed=$((end_timestamp - start_timestamp))
if (( elapsed < 1 || end_bytes < start_bytes )); then
  # The interface counter was reset or the clock moved. Seed safely.
  printf '%s %s 0 0\n' "$end_bytes" "$end_timestamp" > "$state_file"
  chmod 0600 "$state_file"
  log "counter_reset_or_invalid_elapsed interface=$INTERFACE"
  exit 0
fi

bytes_delta=$((end_bytes - start_bytes))
bps=$((bytes_delta * 8 / elapsed))
threshold_human=$(format_bps "$THRESHOLD_BPS")
rate_human=$(format_bps "$bps")

capture_diagnostics() {
  local report_file=$1
  local report_heading=$2
  {
    printf 'Outbound traffic %s\n\n' "$report_heading"
    printf 'Host: %s\n' "$(hostname -f 2>/dev/null || hostname)"
    printf 'Timestamp (UTC): %s\n' "$(date --utc --iso-8601=seconds)"
    printf 'Interface: %s\n' "$INTERFACE"
    printf 'Measured outbound rate: %s (%s bytes over %s seconds)\n' "$rate_human" "$bytes_delta" "$elapsed"
    printf 'Configured threshold: %s\n' "$threshold_human"
    printf 'Consecutive threshold breaches: %s of %s required\n' "$breaches" "$CONSECUTIVE_BREACHES"
    printf 'Interface byte counters: start=%s end=%s\n\n' "$start_bytes" "$end_bytes"

    printf 'Interface statistics\n====================\n'
    ip -s link show dev "$INTERFACE" 2>&1 || true

    printf '\nDefault route\n=============\n'
    ip route show default 2>&1 || true

    printf '\nRemote TCP endpoints by active socket count\n============================================\n'
    ss -H -tn state established 2>/dev/null |
      awk 'NF >= 5 {print $5}' |
      sort | uniq -c | sort -nr | head -n "$TOP_LINES" || true

    printf '\nEstablished TCP/UDP sockets with owning processes\n==================================================\n'
    ss -H -tunap state established 2>&1 | head -n "$TOP_LINES" || true

    printf '\nDetailed established TCP transport state\n========================================\n'
    ss -H -tinap state established 2>&1 | head -n "$TOP_LINES" || true

    printf '\nTop CPU processes at capture time\n=================================\n'
    ps -eo pid,ppid,user,comm,%cpu,%mem,args --sort=-%cpu | head -n $((TOP_LINES + 1)) || true

    printf '\nTop memory processes at capture time\n====================================\n'
    ps -eo pid,ppid,user,comm,%cpu,%mem,args --sort=-%mem | head -n $((TOP_LINES + 1)) || true

    printf '\nRelevant backup and SQLite processes\n====================================\n'
    ps -eo pid,ppid,user,comm,args | grep -E '[s]qlite(-worker)?|[r]clone|[n]ode|[p]m2' | head -n "$TOP_LINES" || true
  } > "$report_file"
}

send_report() {
  local subject=$1
  local key=$2
  local report_heading=$3
  local report_file
  report_file=$(mktemp /tmp/outbound-traffic-report.XXXXXX) || return 1
  chmod 0600 "$report_file"
  local sender_status=0
  capture_diagnostics "$report_file" "$report_heading"
  if [[ "$(stat -c %s "$report_file" 2>/dev/null || printf '0')" =~ ^[0-9]+$ ]] &&
    (( $(stat -c %s "$report_file") > 120000 )); then
    # The shared sender accepts bodies up to 128 KiB. Keep the alert useful
    # while leaving header and MIME overhead headroom.
    head -c 120000 "$report_file" > "${report_file}.truncated"
    mv -f "${report_file}.truncated" "$report_file"
    printf '\n\n[Diagnostic output truncated at 120000 bytes]\n' >> "$report_file"
  fi
  "$ALERT_SENDER" --body-file "$report_file" "$key" "$subject" || sender_status=$?
  rm -f "$report_file"
  return "$sender_status"
}

breaches=0
alerted=0
if (( bps >= THRESHOLD_BPS )); then
  breaches=$((previous_breaches + 1))
  alerted=$previous_alerted
  if (( breaches >= CONSECUTIVE_BREACHES && previous_alerted == 0 )); then
    subject="[CRITICAL] Outbound traffic ${rate_human} >= ${threshold_human} - $(hostname -f 2>/dev/null || hostname) (${INTERFACE})"
    if send_report "$subject" "outbound-traffic-$state_name" 'threshold alert'; then
      alerted=1
      log "threshold_alerted interface=$INTERFACE bps=$bps threshold_bps=$THRESHOLD_BPS"
    else
      log "threshold_alert_delivery_failed interface=$INTERFACE bps=$bps threshold_bps=$THRESHOLD_BPS"
    fi
  fi
else
  if (( previous_alerted == 1 )); then
    subject="[RECOVERED] Outbound traffic ${rate_human} below ${threshold_human} - $(hostname -f 2>/dev/null || hostname) (${INTERFACE})"
    send_report "$subject" "outbound-traffic-recovery-$state_name" 'recovery'
    log "threshold_recovered interface=$INTERFACE bps=$bps threshold_bps=$THRESHOLD_BPS"
  fi
fi

printf '%s %s %s %s\n' "$end_bytes" "$end_timestamp" "$breaches" "$alerted" > "$state_file"
chmod 0600 "$state_file"
log "sample interface=$INTERFACE bps=$bps breaches=$breaches alerted=$alerted"
