#!/bin/bash
# Certificate Expiry Monitor
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Emails an alert when a certificate or key this host uses expires soon, has
# expired, or cannot be read:
#
#   - the certificate served at WEB_URL
#   - certificate files: the TLS certificate and CA bundle every service reads
#     (/var/www/production/.ssl-cert and .ssl-ca, MongoDB and Valkey copies),
#     the Apple Mail push certificate (IMAP XAPPLEPUSHSERVICE), and every
#     *_CERT_PATH and *_CA_PATH in the app's .env
#   - the OpenPGP key that signs security.txt (GPG_SECURITY_KEY)
#   - the certificate each local TLS service actually serves (node, mongod,
#     valkey): a process keeps the certificate it loaded at start, so a renewed
#     file on disk does not help until the process is reloaded
#   - the Calendar and Contacts push certificates cached in Redis (aps_certs),
#     on the one host with CERT_MONITOR_APN_CACHE=true
#
# Apple .p8 keys (Sign in with Apple, APNs token auth), DKIM keys and Firebase
# service-account keys do not expire, so there is nothing to check for them.
#
# Based on: https://github.com/forwardemail/sslmonitor.com
# Usage: Executed by systemd timer daily

set -o pipefail

# NOTE: We intentionally do NOT use 'set -e' (errexit) here because many
# commands (grep, openssl pipelines) legitimately return non-zero when
# certificates cannot be retrieved, which would crash the script.

# Configuration (the CERT_MONITOR_* overrides exist for tests)
HOSTNAME="$(hostname)"
HOST_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
MONITOR_LOG="${CERT_MONITOR_LOG:-/var/log/ssl-certificate-monitor.log}"
LOCK_DIR="${CERT_MONITOR_LOCK_DIR:-/var/lock}"
# 23 hours: the daily timer starts at about the same time each day, so a full
# 24 hours would skip every other day's alert whenever a run finishes sooner
LOCK_DURATION=82800
WARNING_DAYS="${CERT_MONITOR_WARNING_DAYS:-30}"   # warn when fewer days are left
CRITICAL_DAYS="${CERT_MONITOR_CRITICAL_DAYS:-7}"  # critical when fewer days are left
SENDER="${CERT_MONITOR_SENDER:-/usr/local/bin/send-rate-limited-email.sh}"

# The app's environment, which names the certificate files it reads
ENV_FILE="${CERT_MONITOR_ENV_FILE:-/var/www/production/current/.env}"

# Where certificates.yml and gpg-security-key.yml put them
KNOWN_PATHS="${CERT_MONITOR_KNOWN_PATHS-/var/www/production/.ssl-cert /var/www/production/.ssl-ca /var/www/production/apns-mail.pem /var/www/production/.gpg-security-key /etc/mongodb/ssl/mongodb.crt /etc/mongodb/ssl/ca.pem /etc/valkey/ssl/valkey.crt /etc/valkey/ssl/ca.pem}"

# More files to check, separated by spaces (certificate_monitor_extra_paths)
EXTRA_PATHS="${CERT_MONITOR_PATHS:-}"

# Local TLS services: listening sockets of processes running these
# executables are checked. By executable, not by process name: PM2 renames
# its processes ("PM2 v5.3.0: God" owns every cluster-mode port).
SERVICE_PROCESSES="${CERT_MONITOR_PROCESSES-node mongod valkey-server redis-server}"

# Ports that start in plain text and upgrade with STARTTLS (port:protocol);
# every other port of the processes above is tried as implicit TLS
STARTTLS_PORTS="${CERT_MONITOR_STARTTLS_PORTS-25:smtp 587:smtp 2525:smtp 2587:smtp 2555:smtp 143:imap 110:pop3 2190:sieve}"

# Server name sent to local services
TLS_SERVER_NAME="${CERT_MONITOR_SERVER_NAME:-$(hostname -f 2>/dev/null || hostname)}"

# Push certificates cached in Redis: checked on one host only, since every
# host reads the same cache
APN_CACHE="${CERT_MONITOR_APN_CACHE:-false}"
APN_COMMAND="${CERT_MONITOR_APN_COMMAND:-cd /var/www/production/current && exec runuser -u deploy -- env NODE_ENV=production /home/deploy/n/bin/node scripts/apn-cert-expiry.js}"

# Get WEB_URL from environment or config
WEB_URL="${WEB_URL:-}"

# If WEB_URL not set, try to read from common config locations
if [ -z "$WEB_URL" ]; then
    if [ -f /etc/environment ]; then
        WEB_URL=$(grep "^WEB_URL=" /etc/environment | cut -d'=' -f2 | tr -d '"' || echo "")
    fi
fi

# If still not set, try to read from systemd environment
if [ -z "$WEB_URL" ]; then
    if [ -f /etc/systemd/system.conf.d/environment.conf ]; then
        WEB_URL=$(grep "^DefaultEnvironment.*WEB_URL" /etc/systemd/system.conf.d/environment.conf | grep -oP 'WEB_URL=\K[^"]+' || echo "")
    fi
fi

# Ensure directory exists
touch "$MONITOR_LOG" 2>/dev/null || MONITOR_LOG="/tmp/ssl-certificate-monitor.log"

WORK_DIR="$(mktemp -d /tmp/ssl-certificate-monitor.XXXXXX)" || exit 1
trap 'rm -rf "$WORK_DIR"' EXIT

# One line per certificate checked, fields separated by US (0x1f): status,
# kind, source, subject, issuer, expires, days left, note. Not tabs: read
# merges adjacent tabs, so an empty field would shift the ones after it.
SEP=$'\x1f'
RESULTS="$WORK_DIR/results"
: > "$RESULTS"

NOW="$(date +%s)"

# Logging function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$MONITOR_LOG"
}

# Check if we should send an alert (rate limiting)
should_send_alert() {
    local lockfile="$LOCK_DIR/ssl-certificate-monitor.lock"

    if [ -f "$lockfile" ]; then
        lockfile_time=$(stat -c %Y "$lockfile" 2>/dev/null || echo 0)
        current_time=$(date +%s)
        elapsed_time=$((current_time - lockfile_time))

        if [ $elapsed_time -lt $LOCK_DURATION ]; then
            log_message "Rate limit active (${elapsed_time}s elapsed)"
            return 1
        fi
    fi

    return 0
}

# Commit the daily cooldown only after the shared sender has accepted the email.
record_alert_sent() {
    local lockfile="$LOCK_DIR/ssl-certificate-monitor.lock"

    if ! touch "$lockfile"; then
        log_message "ERROR: Failed to record SSL alert cooldown"
        return 1
    fi
}

# Send email alert
send_alert() {
    local subject="$1"
    local body_file="$2"

    log_message "Sending alert: $subject"

    if [ ! -x "$SENDER" ]; then
        log_message "ERROR: send-rate-limited-email.sh not found"
        return 1
    fi

    # Older senders take the body only as an argument, which holds 128 KiB
    local sent
    if [ "$(stat -c %s "$body_file")" -lt 120000 ]; then
        "$SENDER" "ssl-certificate-monitor" "$subject" "$(cat "$body_file")"
    else
        "$SENDER" --body-file "$body_file" "ssl-certificate-monitor" "$subject"
    fi
    sent=$?
    if [ "$sent" -ne 0 ]; then
        log_message "ERROR: Failed to queue SSL certificate alert"
        return 1
    fi
}

# Port in a URL, 443 when it has none
extract_port() {
    local url="$1"
    local host_port
    host_port=$(echo "$url" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
    if [[ "$host_port" =~ :([0-9]+)$ ]]; then
        echo "${BASH_REMATCH[1]}"
    else
        echo 443
    fi
}

# Extract domain from URL
extract_domain() {
    local url="$1"
    # Remove protocol
    local domain=$(echo "$url" | sed -e 's|^[^/]*//||' -e 's|/.*$||' -e 's|:.*$||')
    echo "$domain"
}

# One line of text for a table cell (no tabs or line breaks)
one_line() {
    printf '%s' "$1" | tr '\t\r\n\037' '    '
}

html_escape() {
    printf '%s' "$1" | sed -e 's/&/\&amp;/g' -e 's/</\&lt;/g' -e 's/>/\&gt;/g' \
        -e 's/"/\&quot;/g' -e "s/'/\\&#39;/g"
}

# Status for an expiry time (seconds since the epoch)
expiry_status() {
    local expiry_seconds="$1"
    local seconds_left=$((expiry_seconds - NOW))
    local days_left=$((seconds_left / 86400))

    if [ "$seconds_left" -lt 0 ]; then
        echo "EXPIRED"
    elif [ "$days_left" -lt "$CRITICAL_DAYS" ]; then
        echo "CRITICAL"
    elif [ "$days_left" -lt "$WARNING_DAYS" ]; then
        echo "WARNING"
    else
        echo "OK"
    fi
}

# Days left until an expiry time, rounded down (negative once expired)
days_until() {
    local seconds_left=$(($1 - NOW))
    if [ "$seconds_left" -lt 0 ]; then
        echo $(((seconds_left - 86399) / 86400))
    else
        echo $((seconds_left / 86400))
    fi
}

add_result() {
    local status="$1" kind="$2" source="$3" subject="$4" issuer="$5" expires="$6" days="$7" note="$8"
    printf "%s${SEP}%s${SEP}%s${SEP}%s${SEP}%s${SEP}%s${SEP}%s${SEP}%s\n" \
        "$status" "$kind" "$(one_line "$source")" "$(one_line "$subject")" \
        "$(one_line "$issuer")" "$(one_line "$expires")" "$days" "$(one_line "$note")" >> "$RESULTS"
    log_message "$status: $source: $subject (expires ${expires:-n/a}) ${note}"
}

# Record one PEM certificate (a file holding exactly one)
add_certificate() {
    local pem_file="$1" kind="$2" source="$3" note="$4"
    local info expiry_date expiry_seconds subject issuer status

    info=$(openssl x509 -in "$pem_file" -noout -enddate -subject -issuer -nameopt RFC2253 2>/dev/null)
    expiry_date=$(printf '%s\n' "$info" | sed -n 's/^notAfter=//p')
    subject=$(printf '%s\n' "$info" | sed -n 's/^subject=//p')
    issuer=$(printf '%s\n' "$info" | sed -n 's/^issuer=//p')

    if [ -z "$expiry_date" ]; then
        add_result "ERROR" "$kind" "$source" "" "" "" "" "Could not parse the certificate"
        return
    fi

    expiry_seconds=$(date -d "$expiry_date" +%s 2>/dev/null || echo "")
    if [ -z "$expiry_seconds" ]; then
        add_result "ERROR" "$kind" "$source" "$subject" "$issuer" "$expiry_date" "" "Could not parse expiry date"
        return
    fi

    status=$(expiry_status "$expiry_seconds")

    # A root kept in a bundle file after it expired: clients check chains
    # against their own trusted roots, so it is noted rather than reported
    # every day. It is reported while it is about to expire, and an expired
    # leaf or intermediate is always reported.
    if [ "$status" = "EXPIRED" ] && [ "$subject" = "$issuer" ] &&
        [ "$kind" != "service" ] && [ "$kind" != "web" ] &&
        openssl x509 -in "$pem_file" -noout -ext basicConstraints 2>/dev/null | grep -q 'CA:TRUE'; then
        status="OK"
        note="Expired root certificate; clients use their own trusted roots, so it can be removed from this file"
    fi

    add_result "$status" "$kind" "$source" "$subject" "$issuer" "$expiry_date" "$(days_until "$expiry_seconds")" "$note"
}

# Every certificate in a PEM file (a chain or CA bundle holds several), or
# a single DER certificate
check_certificate_file() {
    local file="$1" kind="$2" source="$3"
    local dir count index

    if [ ! -r "$file" ]; then
        add_result "ERROR" "$kind" "$source" "" "" "" "" "Cannot read $file"
        return
    fi

    dir=$(mktemp -d "$WORK_DIR/file.XXXXXX") || return
    awk -v dir="$dir" '
        /-----BEGIN CERTIFICATE-----/ { n++; out = dir "/" n ".pem"; writing = 1 }
        writing { print > out }
        /-----END CERTIFICATE-----/ { writing = 0; close(out) }
    ' "$file"

    count=$(find "$dir" -name '*.pem' | wc -l)
    if [ "$count" -eq 0 ]; then
        if openssl x509 -inform der -in "$file" -out "$dir/1.pem" 2>/dev/null; then
            count=1
        else
            add_result "ERROR" "$kind" "$source" "" "" "" "" "No certificate found in $file"
            return
        fi
    fi

    for index in $(seq 1 "$count"); do
        if [ "$count" -gt 1 ]; then
            add_certificate "$dir/$index.pem" "$kind" "$source (certificate $index of $count)" ""
        else
            add_certificate "$dir/$index.pem" "$kind" "$source" ""
        fi
    done
}

# An OpenPGP key: when it can still sign and encrypt. A subkey that expired
# but has a replacement does not count; the primary key's expiry ends every
# subkey.
check_gpg_key() {
    local file="$1" source="$2"
    local home colons

    if [ ! -r "$file" ]; then
        add_result "ERROR" "gpg" "$source" "" "" "" "" "Cannot read $file"
        return
    fi

    if ! command -v gpg >/dev/null 2>&1; then
        add_result "ERROR" "gpg" "$source" "" "" "" "" "gpg is not installed"
        return
    fi

    home="$WORK_DIR/gnupg"
    mkdir -m 0700 "$home" 2>/dev/null
    colons=$(gpg --homedir "$home" --batch --no-tty --with-colons --fixed-list-mode --show-keys "$file" 2>/dev/null)

    if ! printf '%s\n' "$colons" | grep -qE '^(pub|sec):'; then
        add_result "ERROR" "gpg" "$source" "" "" "" "" "No OpenPGP key found in $file"
        return
    fi

    # key id, user id, then "capability expiry" per capability (0 = never);
    # "revoked" for a revoked key, and signing "none" when nothing can sign
    printf '%s\n' "$colons" | awk -F: '
        function flush(   c, best, effective) {
            if (keyid == "") return
            if (revoked) {
                print keyid "\037" uid "\037revoked\037-"
                keyid = ""
                delete caps
                return
            }
            if (!("signing" in caps)) print keyid "\037" uid "\037signing\037none"
            for (c in caps) {
                best = caps[c]
                effective = best
                if (primary != 0 && (effective == 0 || primary < effective)) effective = primary
                print keyid "\037" uid "\037" c "\037" effective
            }
            delete caps
        }
        function offer(c, expires) {
            # the latest expiry among keys with this capability (0 = never)
            if (!(c in caps)) caps[c] = expires
            else if (caps[c] != 0 && (expires == 0 || expires > caps[c])) caps[c] = expires
        }
        $1 == "pub" || $1 == "sec" {
            flush()
            keyid = $5; uid = ""; primary = ($7 == "" ? 0 : $7) + 0
            revoked = ($2 == "r")
            if (revoked) next
            if ($12 ~ /s/) offer("signing", primary)
            if ($12 ~ /e/) offer("encryption", primary)
            next
        }
        ($1 == "sub" || $1 == "ssb") && keyid != "" && !revoked && $2 != "r" {
            expires = ($7 == "" ? 0 : $7) + 0
            if ($12 ~ /s/) offer("signing", expires)
            if ($12 ~ /e/) offer("encryption", expires)
            next
        }
        $1 == "uid" && keyid != "" && uid == "" { uid = $10 }
        END { flush() }
    ' > "$WORK_DIR/gpg.keys"

    local keyid uid capability expires
    while IFS="$SEP" read -r keyid uid capability expires; do
        [ -n "$keyid" ] || continue
        if [ "$capability" = "revoked" ]; then
            add_result "ERROR" "gpg" "$source" "$uid ($keyid)" "" "" "" "The key is revoked"
        elif [ "$expires" = "none" ]; then
            add_result "ERROR" "gpg" "$source" "$uid ($keyid), $capability" "" "" "" "No key in it can sign"
        elif [ "$expires" = "0" ]; then
            add_result "OK" "gpg" "$source" "$uid ($keyid), $capability" "" "never" "" ""
        else
            add_result "$(expiry_status "$expires")" "gpg" "$source" "$uid ($keyid), $capability" "" \
                "$(date -u -d "@$expires" '+%b %e %H:%M:%S %Y GMT')" "$(days_until "$expires")" ""
        fi
    done < "$WORK_DIR/gpg.keys"
}

# Value of KEY in the app's .env, following {{KEY}} and {{{KEY}}} references
env_value() {
    local key="$1" value _
    for _ in 1 2 3 4 5; do
        value=$(grep -E "^${key}=" "$ENV_FILE" 2>/dev/null | tail -n 1 | cut -d'=' -f2-)
        value="${value%\"}"; value="${value#\"}"
        value="${value%\'}"; value="${value#\'}"
        if [[ "$value" =~ ^\{\{\{?([A-Za-z0-9_]+)\}?\}\}$ ]]; then
            key="${BASH_REMATCH[1]}"
            continue
        fi
        printf '%s' "$value"
        return
    done
}

# Certificate files to check: "path<TAB>kind<TAB>label" with each real path
# once, labeled with every name it goes by
collect_files() {
    local key value path real kind
    declare -A labels=()
    declare -A kinds=()
    local order=()

    add_path() {
        local path="$1" kind="$2" label="$3"
        [ -n "$path" ] || return
        # configured but missing: still reported, under the path itself
        real=$(realpath -e -- "$path" 2>/dev/null || printf '%s' "$path")
        if [ -z "${labels[$real]+x}" ]; then
            order+=("$real")
            labels[$real]="$label"
            kinds[$real]="$kind"
        elif [[ ", ${labels[$real]}, " != *", $label, "* ]]; then
            labels[$real]="${labels[$real]}, $label"
        fi
    }

    kind_for() {
        case "$1" in
            *APNS_MAIL*|*apns-mail*) echo "apns-mail" ;;
            *GPG*|*.gpg-security-key) echo "gpg" ;;
            /etc/mongodb/*|/etc/valkey/*) echo "database" ;;
            *) echo "tls" ;;
        esac
    }

    if [ -r "$ENV_FILE" ]; then
        for key in $(grep -oE '^[A-Z0-9_]+(_CERT_PATH|_CA_PATH)=' "$ENV_FILE" | tr -d '=' | sort -u) GPG_SECURITY_KEY; do
            value=$(env_value "$key")
            [ -n "$value" ] || continue
            add_path "$value" "$(kind_for "$key")" "$key"
        done
    else
        log_message "No app environment at $ENV_FILE"
    fi

    for path in $KNOWN_PATHS; do
        [ -e "$path" ] || continue
        add_path "$path" "$(kind_for "$path")" "$path"
    done

    for path in $EXTRA_PATHS; do
        add_path "$path" "$(kind_for "$path")" "$path"
    done

    for real in "${order[@]}"; do
        printf '%s\t%s\t%s\n' "$real" "${kinds[$real]}" "${labels[$real]}"
    done
}

check_files() {
    local path kind label source
    while IFS=$'\t' read -r path kind label; do
        if [ "$label" = "$path" ]; then
            source="$path"
        else
            source="$path ($label)"
        fi
        if [ "$kind" = "gpg" ]; then
            check_gpg_key "$path" "$source"
        else
            check_certificate_file "$path" "$kind" "$source"
        fi
    done < <(collect_files)
}

# Leaf certificate a local service presents, as PEM, or nothing
served_certificate() {
    local host="$1" port="$2" protocol="$3"
    local args=(-connect "$host:$port" -servername "$TLS_SERVER_NAME")
    [ -z "$protocol" ] || args+=(-starttls "$protocol")
    timeout 15 openssl s_client "${args[@]}" < /dev/null 2>/dev/null |
        awk '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/'
}

check_services() {
    local line address port pid exe host protocol pem wanted name
    declare -A seen=()

    if ! command -v ss >/dev/null 2>&1; then
        log_message "ss not found; skipping local TLS services"
        return
    fi
    [ -n "$SERVICE_PROCESSES" ] || return

    while read -r line; do
        address=$(printf '%s\n' "$line" | awk '{print $4}')
        port="${address##*:}"
        address="${address%:*}"

        wanted=""
        for pid in $(printf '%s\n' "$line" | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u); do
            exe=$(readlink "/proc/$pid/exe" 2>/dev/null) || continue
            # an executable replaced by an upgrade reads "... (deleted)"
            exe="${exe% (deleted)}"
            name="${exe##*/}"
            if [[ -n "$name" && " $SERVICE_PROCESSES " == *" $name "* ]]; then
                wanted="$name"
                break
            fi
        done
        [ -n "$wanted" ] || continue
        [[ "$port" =~ ^[0-9]+$ ]] || continue
        [ -z "${seen[$port]+x}" ] || continue
        seen[$port]=1

        # %interface suffix (fe80::1%eth0) is not part of the address
        address="${address%%\%*}"
        case "$address" in
            '*'|0.0.0.0|'[::]'|'::') host="127.0.0.1" ;;
            *) host="$address" ;;
        esac

        protocol=""
        for name in $STARTTLS_PORTS; do
            [ "${name%%:*}" = "$port" ] && protocol="${name#*:}"
        done

        pem=$(served_certificate "$host" "$port" "$protocol")
        # an IPv6-only wildcard socket does not answer on 127.0.0.1
        if [ -z "$pem" ] && [[ "$address" == '[::]' || "$address" == '::' ]]; then
            pem=$(served_certificate "[::1]" "$port" "$protocol")
        fi
        if [ -z "$pem" ]; then
            log_message "No TLS certificate on port $port ($wanted)"
            continue
        fi
        printf '%s\n' "$pem" > "$WORK_DIR/port.$port.pem"
        add_certificate "$WORK_DIR/port.$port.pem" "service" \
            "port $port ($wanted${protocol:+, STARTTLS})" ""
    done < <(ss -Hltnp 2>/dev/null)
}

# Calendar and Contacts push certificates cached in Redis. The cache expires
# a few days before they do and is then requested again, so they only need
# attention when the cache would outlive them.
check_apn_cache() {
    local output marker name not_after cache_end subject status note
    [ "$APN_CACHE" = "true" ] || return

    if ! output=$(bash -c "$APN_COMMAND" 2> "$WORK_DIR/apn.err"); then
        add_result "ERROR" "apn-cache" "Redis aps_certs" "" "" "" "" \
            "Could not read the cached push certificates: $(head -c 300 "$WORK_DIR/apn.err")"
        return
    fi

    while IFS=$'\t' read -r marker name not_after cache_end subject; do
        [ "$marker" = "APN_CERT" ] || continue
        [[ "$not_after" =~ ^[0-9]+$ ]] || continue
        status=$(expiry_status "$not_after")
        note=""
        if [ "$status" != "EXPIRED" ]; then
            if [[ "$cache_end" =~ ^[0-9]+$ ]] && [ "$cache_end" -lt $((not_after - 86400)) ]; then
                status="OK"
                note="Renewed after $(date -u -d "@$cache_end" '+%Y-%m-%d'), when the cache expires"
            elif [ "$status" != "OK" ]; then
                note="The cache does not expire before the certificate does, so it is not renewed"
            fi
        fi
        add_result "$status" "apn-cache" "Redis aps_certs ($name)" "$subject" "" \
            "$(date -u -d "@$not_after" '+%b %e %H:%M:%S %Y GMT')" "$(days_until "$not_after")" "$note"
    done <<< "$output"
}

# Check SSL certificate expiration
check_certificate() {
    local domain="$1"
    local expiry_date=""
    local days_left=0
    local status="OK"
    local error_message=""
    local issuer=""
    local subject=""

    log_message "Checking certificate for $domain..."

    # Get certificate information
    local cert_info=$(echo | timeout 30 openssl s_client -servername "$domain" -connect "$domain:${WEB_PORT:-443}" 2>/dev/null | openssl x509 -noout -dates -issuer -subject -nameopt RFC2253 2>/dev/null)

    if [ -z "$cert_info" ]; then
        status="ERROR"
        error_message="Could not retrieve certificate for $domain"
        days_left=0
    else
        # Extract expiry date
        expiry_date=$(echo "$cert_info" | grep "notAfter=" 2>/dev/null | sed -e 's/notAfter=//' || true)

        # Extract issuer
        issuer=$(echo "$cert_info" | grep "issuer=" 2>/dev/null | sed -e 's/issuer=//' || true)

        # Extract subject
        subject=$(echo "$cert_info" | grep "subject=" 2>/dev/null | sed -e 's/subject=//' || true)

        if [ -z "$expiry_date" ]; then
            status="ERROR"
            error_message="Could not parse certificate expiry date"
            days_left=0
        else
            # Convert expiry date to seconds since epoch
            expiry_seconds=$(date -d "$expiry_date" +%s 2>/dev/null || echo "0")

            if [ "$expiry_seconds" -eq 0 ]; then
                status="ERROR"
                error_message="Could not parse expiry date: $expiry_date"
                days_left=0
            else
                days_left=$(days_until "$expiry_seconds")
                status=$(expiry_status "$expiry_seconds")
            fi
        fi
    fi

    # Return results
    echo "$domain|$expiry_date|$days_left|$status|$error_message|$issuer|$subject"
}

check_web_url() {
    local domain cert_info

    if [ -z "$WEB_URL" ]; then
        log_message "WEB_URL not set; skipping the public certificate"
        return
    fi

    domain=$(extract_domain "$WEB_URL")
    if [ -z "$domain" ]; then
        add_result "ERROR" "web" "$WEB_URL" "" "" "" "" "Could not extract domain from WEB_URL"
        return
    fi

    WEB_DOMAIN="$domain"
    WEB_PORT=$(extract_port "$WEB_URL")
    cert_info=$(check_certificate "$domain")
    local status days
    status=$(echo "$cert_info" | cut -d'|' -f4)
    days=$(echo "$cert_info" | cut -d'|' -f3)
    [ "$status" != "ERROR" ] || days=""
    add_result "$status" "web" "$WEB_URL" \
        "$(echo "$cert_info" | cut -d'|' -f7)" "$(echo "$cert_info" | cut -d'|' -f6)" \
        "$(echo "$cert_info" | cut -d'|' -f2)" "$days" \
        "$(echo "$cert_info" | cut -d'|' -f5)"
}

# Get certificate chain information
get_cert_chain() {
    local domain="$1"
    echo | timeout 30 openssl s_client -servername "$domain" -connect "$domain:${WEB_PORT:-443}" -showcerts 2>/dev/null | grep -E "(s:|i:)" || echo "Chain information not available"
}

# Check OCSP status
check_ocsp_status() {
    local domain="$1"
    local ocsp_status=$(echo | timeout 30 openssl s_client -servername "$domain" -connect "$domain:${WEB_PORT:-443}" -status 2>/dev/null | grep "OCSP Response Status" || echo "OCSP status not available")
    echo "$ocsp_status"
}

# What to do about a certificate of each kind
renewal_steps() {
    case "$1" in
        web)
            echo "Renew the certificate (Let's Encrypt: <code>certbot renew --force-renewal</code>; otherwise submit a new CSR to the CA), deploy it, and check it with <code>openssl s_client -servername $(html_escape "${WEB_DOMAIN:-domain}") -connect $(html_escape "${WEB_DOMAIN:-domain}"):${WEB_PORT:-443} | openssl x509 -noout -dates</code>."
            ;;
        tls)
            echo "Renew the certificate with the CA, deploy the certificate, key and CA bundle with <code>node ansible-playbook ansible/playbooks/certificates.yml --user deploy</code>, then reload every service that reads them (<code>pm2 reload all</code> as deploy), since a running process keeps the certificate it started with."
            ;;
        database)
            echo "Deploy the renewed certificate and CA bundle with <code>node ansible-playbook ansible/playbooks/certificates.yml --user deploy</code>, which restarts MongoDB and Valkey."
            ;;
        apns-mail)
            echo "In the Apple Developer portal (Certificates, Identifiers &amp; Profiles), create a new Apple Push Notification service SSL certificate for the mail topic's App ID, export the certificate and its private key as PEM, deploy them with <code>node ansible-playbook ansible/playbooks/certificates.yml --user deploy</code> (the Apple Mail push prompts), then <code>pm2 reload all</code> as deploy on the IMAP servers. iOS Mail stops receiving push once it expires."
            ;;
        gpg)
            echo "Extend the key: <code>gpg --quick-set-expire FINGERPRINT 1y</code> and <code>gpg --quick-set-expire FINGERPRINT 1y '*'</code>, export it again, deploy it with <code>node ansible-playbook ansible/playbooks/gpg-security-key.yml --user deploy</code>, and publish the updated public key. security.txt is signed with it."
            ;;
        service)
            echo "The process serves the certificate it loaded when it started. If a renewed certificate is already on disk, reload it (<code>pm2 reload all</code> as deploy, or restart mongod or valkey-server); otherwise renew and deploy it first."
            ;;
        apn-cache)
            echo "The Calendar and Contacts push certificates come from Apple through helpers/get-apn-certs.js and are cached in Redis. Delete the <code>aps_certs</code> key so the next push requests new ones, then check the logs for get-apn-certs errors."
            ;;
    esac
}

kind_name() {
    case "$1" in
        web) echo "Public website (WEB_URL)" ;;
        tls) echo "TLS certificate file" ;;
        database) echo "MongoDB / Valkey certificate file" ;;
        apns-mail) echo "Apple Mail push certificate (XAPPLEPUSHSERVICE)" ;;
        gpg) echo "OpenPGP key (security.txt)" ;;
        service) echo "Certificate served by a local service" ;;
        apn-cache) echo "Calendar / Contacts push certificate (Redis)" ;;
        *) echo "$1" ;;
    esac
}

status_color() {
    case "$1" in
        EXPIRED|CRITICAL|ERROR) echo "#d9534f" ;;
        WARNING) echo "#f0ad4e" ;;
        *) echo "#5cb85c" ;;
    esac
}

# Most severe status among the results
worst_status() {
    local status
    for status in EXPIRED ERROR CRITICAL WARNING; do
        if cut -d"$SEP" -f1 "$RESULTS" | grep -qx "$status"; then
            echo "$status"
            return
        fi
    done
    echo "OK"
}

result_rows() {
    local filter="$1"
    local status kind source subject issuer expires days note color
    while IFS="$SEP" read -r status kind source subject issuer expires days note; do
        if [ "$filter" = "problems" ] && [ "$status" = "OK" ]; then
            continue
        fi
        color=$(status_color "$status")
        printf "<tr>\n  <td style='color: %s; font-weight: bold;'>%s</td>\n  <td>%s<br><small>%s</small></td>\n  <td>%s<br><small>%s</small></td>\n  <td>%s</td>\n  <td style='color: %s;'><strong>%s</strong></td>\n  <td>%s</td>\n</tr>\n" \
            "$color" "$status" \
            "$(html_escape "$(kind_name "$kind")")" "$(html_escape "$source")" \
            "$(html_escape "$subject")" "$(html_escape "${issuer:+Issuer: $issuer}")" \
            "$(html_escape "$expires")" "$color" "$(html_escape "${days:+$days days}")" \
            "$(html_escape "$note")"
    done < "$RESULTS"
}

# Send certificate alert
send_certificate_alert() {
    local worst count color icon kinds kind
    worst=$(worst_status)
    count=$(cut -d"$SEP" -f1 "$RESULTS" | grep -cvx "OK")
    color=$(status_color "$worst")

    case "$worst" in
        EXPIRED|CRITICAL) icon="🚨" ;;
        WARNING) icon="⚠️" ;;
        ERROR) icon="❌" ;;
        *) icon="✅" ;;
    esac

    local findings="findings"
    [ "$count" -ne 1 ] || findings="finding"
    local subject_line="[${worst}] Certificates: $count $findings - $HOSTNAME ($HOST_IP)"
    local header="<tr style='background-color: #f2f2f2;'>
  <th>Status</th>
  <th>Certificate</th>
  <th>Subject</th>
  <th>Expires</th>
  <th>Left</th>
  <th>Note</th>
</tr>"
    local body
    body="<html><body>
<h2 style='color: $color;'>$icon Certificate Monitor</h2>
<p><strong>Server:</strong> $(html_escape "$HOSTNAME")</p>
<p><strong>Check Time:</strong> $TIMESTAMP</p>
<hr>
<h3>Needs attention:</h3>
<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>
$header
$(result_rows problems)
</table>
<hr>
<h3>🔧 Renewal Instructions:</h3>
<ul>"

    kinds=$(awk -F"$SEP" '$1 != "OK" { print $2 }' "$RESULTS" | awk '!seen[$0]++')
    for kind in $kinds; do
        body+="
  <li><strong>$(html_escape "$(kind_name "$kind")"):</strong> $(renewal_steps "$kind")</li>"
    done
    body+="
</ul>
<hr>"

    if awk -F"$SEP" '$1 != "OK" && $2 == "web"' "$RESULTS" | grep -q . && [ -n "${WEB_DOMAIN:-}" ]; then
        body+="<h3>Certificate Chain ($(html_escape "$WEB_DOMAIN")):</h3>
<pre style='background-color: #f5f5f5; padding: 10px; overflow-x: auto;'>$(html_escape "$(get_cert_chain "$WEB_DOMAIN")")</pre>
<h3>OCSP Status:</h3>
<pre style='background-color: #f5f5f5; padding: 10px;'>$(html_escape "$(check_ocsp_status "$WEB_DOMAIN")")</pre>
<hr>"
    fi

    body+="<h3>Everything checked:</h3>
<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>
$header
$(result_rows all)
</table>
<hr>
<h3>⚠️ Thresholds:</h3>
<ul>
  <li><strong>Warning:</strong> $WARNING_DAYS days</li>
  <li><strong>Critical:</strong> $CRITICAL_DAYS days</li>
</ul>
<p><em>This monitor runs daily. Based on <a href='https://github.com/forwardemail/sslmonitor.com'>SSL Monitor</a> by Forward Email.</em></p>
</body></html>"

    printf '%s' "$body" > "$WORK_DIR/body.html"
    send_alert "$subject_line" "$WORK_DIR/body.html"
}

# Main execution
main() {
    log_message "=== Certificate Monitor Started ==="

    check_web_url
    check_files
    check_services
    check_apn_cache

    local worst
    worst=$(worst_status)
    log_message "Checked $(wc -l < "$RESULTS") certificates; worst status: $worst"

    # Send alert if needed, then commit the local daily cooldown.
    if [ "$worst" != "OK" ]; then
        if should_send_alert; then
            if ! send_certificate_alert || ! record_alert_sent; then
                log_message "ERROR: Certificate finding detected but its alert was not committed"
                return 1
            fi
        fi
    else
        log_message "All certificates are valid, no alert needed"
    fi

    log_message "=== Certificate Monitor Completed ==="
}

# Run main function and preserve delivery/state failures for systemd OnFailure.
main || exit 1

# Explicit exit
exit 0
