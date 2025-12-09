#!/bin/bash
# SSH Security Monitor Script
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Monitors ALL SSH activity including successful logins, failed attempts,
# logged in users, and commands executed
# Sends email alerts for security events
# Usage: Executed by systemd timer every 10 minutes

set -euo pipefail

# Configuration
HOSTNAME="$(hostname)"
HOST_IP="$(hostname -I | awk '{print $1}')"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
LOG_FILE="/var/log/auth.log"
MONITOR_LOG="/var/log/ssh-security-monitor.log"
ACTIVITY_LOG="/var/log/ssh-activity.log"
LOCK_DIR="/var/lock"
LOCK_DURATION_FAILED=1800  # 30 minutes for failed login alerts
LOCK_DURATION_ROOT=0       # No rate limiting for root access (always alert)
LOCK_DURATION_ACTIVITY=3600  # 1 hour for activity summary
FAILED_THRESHOLD=5         # Number of failed attempts to trigger alert
CONFIG_DIR="/etc/security-monitor"
AUTHORIZED_IPS_FILE="$CONFIG_DIR/authorized-ips.conf"
AUTHORIZED_USERS_FILE="$CONFIG_DIR/authorized-users.conf"
BUSINESS_HOURS_START=8
BUSINESS_HOURS_END=18
LAST_CHECK_FILE="$CONFIG_DIR/ssh-last-check"

# Ensure directories and files exist
mkdir -p "$CONFIG_DIR"
touch "$MONITOR_LOG" 2>/dev/null || MONITOR_LOG="/tmp/ssh-security-monitor.log"
touch "$ACTIVITY_LOG" 2>/dev/null || ACTIVITY_LOG="/tmp/ssh-activity.log"
touch "$AUTHORIZED_IPS_FILE" 2>/dev/null || true
touch "$AUTHORIZED_USERS_FILE" 2>/dev/null || true
touch "$LAST_CHECK_FILE" 2>/dev/null || echo "0" > "$LAST_CHECK_FILE"

# Logging function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$MONITOR_LOG"
}

# Log SSH activity
log_activity() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$ACTIVITY_LOG"
}

# Check if we should send an alert (rate limiting)
should_send_alert() {
    local alert_type="$1"
    local lockfile="$LOCK_DIR/ssh-monitor-${alert_type}.lock"
    local lock_duration

    # Determine lock duration based on alert type
    case "$alert_type" in
        root-access*)
            lock_duration=$LOCK_DURATION_ROOT
            ;;
        activity-summary)
            lock_duration=$LOCK_DURATION_ACTIVITY
            ;;
        *)
            lock_duration=$LOCK_DURATION_FAILED
            ;;
    esac

    # No rate limiting if duration is 0
    if [ $lock_duration -eq 0 ]; then
        touch "$lockfile" 2>/dev/null || true
        return 0
    fi

    if [ -f "$lockfile" ]; then
        lockfile_time=$(stat -c %Y "$lockfile" 2>/dev/null || echo 0)
        current_time=$(date +%s)
        elapsed_time=$((current_time - lockfile_time))

        if [ $elapsed_time -lt $lock_duration ]; then
            log_message "Rate limit active for ${alert_type} (${elapsed_time}s elapsed)"
            return 1  # Don't send alert
        fi
    fi

    # Create or update lockfile
    touch "$lockfile" 2>/dev/null || true
    return 0  # Send alert
}

# Check if IP is in authorized list
is_authorized_ip() {
    local ip="$1"
    if [ -f "$AUTHORIZED_IPS_FILE" ]; then
        grep -qF "$ip" "$AUTHORIZED_IPS_FILE" 2>/dev/null && return 0
    fi
    return 1
}

# Check if user is in authorized list
is_authorized_user() {
    local user="$1"
    if [ -f "$AUTHORIZED_USERS_FILE" ]; then
        grep -qF "$user" "$AUTHORIZED_USERS_FILE" 2>/dev/null && return 0
    fi
    return 1
}

# Check if current time is outside business hours
is_outside_business_hours() {
    local hour=$(date +%H)
    hour=$((10#$hour))  # Convert to decimal
    [ $hour -lt $BUSINESS_HOURS_START ] || [ $hour -ge $BUSINESS_HOURS_END ]
}

# Send email alert using existing notification infrastructure
send_alert() {
    local subject="$1"
    local body="$2"
    local priority="${3:-normal}"

    log_message "Sending alert: $subject"

    # Use the existing send-rate-limited-email.sh script
    if [ -x /usr/local/bin/send-rate-limited-email.sh ]; then
        /usr/local/bin/send-rate-limited-email.sh "ssh-security-monitor" "$subject" "$body"
    else
        log_message "ERROR: send-rate-limited-email.sh not found"
    fi
}

# Get last check timestamp
get_last_check() {
    if [ -f "$LAST_CHECK_FILE" ]; then
        cat "$LAST_CHECK_FILE"
    else
        echo "0"
    fi
}

# Update last check timestamp
update_last_check() {
    date +%s > "$LAST_CHECK_FILE"
}

# Get new log entries since last check
get_new_entries() {
    local last_check=$(get_last_check)
    local current_time=$(date +%s)

    if [ "$last_check" -eq 0 ]; then
        # First run - check last 10 minutes
        last_check=$((current_time - 600))
    fi

    # Convert to date format for grep
    local start_date=$(date -d "@$last_check" '+%b %_d %H:%M:%S' 2>/dev/null || date '+%b %_d %H:%M:%S')

    # Get entries since last check
    awk -v start="$start_date" '
        BEGIN { found=0 }
        $0 ~ start { found=1 }
        found { print }
    ' "$LOG_FILE" 2>/dev/null || echo ""
}

# Analyze successful SSH logins
analyze_successful_logins() {
    local new_entries="$1"
    local successful_logins=""

    # Match successful SSH logins
    successful_logins=$(echo "$new_entries" | grep -E "sshd.*Accepted (password|publickey)" || true)

    if [ -n "$successful_logins" ]; then
        while IFS= read -r line; do
            local user=$(echo "$line" | grep -oP "for \K\w+" || echo "unknown")
            local ip=$(echo "$line" | grep -oP "from \K[\d\.]+" || echo "unknown")
            local method=$(echo "$line" | grep -oP "Accepted \K\w+" || echo "unknown")
            local timestamp=$(echo "$line" | awk '{print $1, $2, $3}')

            log_activity "SUCCESSFUL LOGIN: user=$user ip=$ip method=$method timestamp=$timestamp"

            # Check for root login
            if [ "$user" = "root" ] && should_send_alert "root-access-$ip"; then
                send_root_access_alert "$user" "$ip" "$method" "$timestamp"
            fi

            # Check for unknown IP
            if ! is_authorized_ip "$ip" && ! is_authorized_user "$user"; then
                log_message "WARNING: Login from unknown IP: $user@$ip"
            fi

            # Check for after-hours login
            if is_outside_business_hours; then
                log_message "INFO: After-hours login: $user@$ip"
            fi
        done <<< "$successful_logins"
    fi
}

# Analyze failed SSH login attempts
analyze_failed_logins() {
    local new_entries="$1"
    local failed_logins=""

    # Match failed SSH logins
    failed_logins=$(echo "$new_entries" | grep -E "sshd.*(Failed password|Invalid user)" || true)

    if [ -n "$failed_logins" ]; then
        # Count failed attempts by IP
        local failed_ips=$(echo "$failed_logins" | grep -oP "from \K[\d\.]+" | sort | uniq -c | sort -rn)

        while read -r count ip; do
            # Validate count is a valid number
            if [[ "$count" =~ ^[0-9]+$ ]] && [[ "$ip" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
                log_activity "FAILED LOGINS: ip=$ip count=$count"

                if [ "$count" -ge "$FAILED_THRESHOLD" ] && should_send_alert "failed-$ip"; then
                    send_failed_login_alert "$ip" "$count" "$failed_logins"
                fi
            fi
        done <<< "$failed_ips"
    fi
}

# Analyze currently logged in users
analyze_logged_in_users() {
    local logged_in=$(who)

    if [ -n "$logged_in" ]; then
        log_activity "LOGGED IN USERS:"
        while IFS= read -r line; do
            log_activity "  $line"
        done <<< "$logged_in"
    fi
}

# Analyze recent commands (from bash history, sudo logs, and bash-commands.log)
analyze_recent_commands() {
    local new_entries="$1"
    local last_check=$(get_last_check)

    # Get sudo commands from auth.log
    local sudo_commands=$(echo "$new_entries" | grep -E "sudo:.*COMMAND=" || true)

    if [ -n "$sudo_commands" ]; then
        log_activity "SUDO COMMANDS EXECUTED:"
        while IFS= read -r line; do
            local user=$(echo "$line" | grep -oP "sudo:\s+\K\w+" || echo "unknown")
            local command=$(echo "$line" | grep -oP "COMMAND=\K.*" || echo "unknown")
            local timestamp=$(echo "$line" | awk '{print $1, $2, $3}')

            log_activity "  user=$user command=$command timestamp=$timestamp"
        done <<< "$sudo_commands"
    fi

    # Get all bash commands from bash-commands.log
    if [ -f /var/log/bash-commands.log ]; then
        local bash_commands=$(awk -v start="$last_check" '
            BEGIN { 
                cmd="date +%s"
                cmd | getline current_time
                close(cmd)
            }
            {
                # Extract timestamp from log line
                match($0, /[A-Z][a-z]{2} +[0-9]+ [0-9]{2}:[0-9]{2}:[0-9]{2}/, ts)
                if (ts[0]) {
                    cmd="date -d \"" ts[0] " " strftime("%Y") "\" +%s 2>/dev/null"
                    cmd | getline log_time
                    close(cmd)
                    if (log_time >= start) print
                }
            }
        ' /var/log/bash-commands.log 2>/dev/null || echo "")

        if [ -n "$bash_commands" ]; then
            log_activity "ALL BASH COMMANDS EXECUTED:"
            while IFS= read -r line; do
                log_activity "  $line"
            done <<< "$bash_commands"
        fi
    fi

    # Get su usage
    local su_usage=$(echo "$new_entries" | grep -E "su:.*session (opened|closed)" || true)
    if [ -n "$su_usage" ]; then
        log_activity "SU USAGE:"
        while IFS= read -r line; do
            log_activity "  $line"
        done <<< "$su_usage"
    fi
}

# Send root access alert
send_root_access_alert() {
    local user="$1"
    local ip="$2"
    local method="$3"
    local timestamp="$4"

    local subject="[CRITICAL] Root SSH Access: user $user from $ip - $HOSTNAME ($HOST_IP)"
    local body="<html><body>
<h2 style='color: #d9534f;'>🚨 Root SSH Access Alert</h2>
<p><strong>Server:</strong> $HOSTNAME</p>
<p><strong>Timestamp:</strong> $TIMESTAMP</p>
<hr>
<h3>Access Details:</h3>
<ul>
  <li><strong>User:</strong> $user</li>
  <li><strong>IP Address:</strong> $ip</li>
  <li><strong>Authentication Method:</strong> $method</li>
  <li><strong>Login Time:</strong> $timestamp</li>
</ul>
<hr>
<h3>⚠️ Immediate Actions Required:</h3>
<ol>
  <li>Verify this is an authorized access</li>
  <li>Review current logged in users: <code>who</code></li>
  <li>Check recent commands: <code>history</code></li>
  <li>If unauthorized, terminate session: <code>pkill -u root</code></li>
  <li>Add to whitelist if authorized: <code>echo '$ip' >> $AUTHORIZED_IPS_FILE</code></li>
</ol>
<p><em>This is an automated security alert. Root access is always reported immediately without rate limiting.</em></p>
</body></html>"

    send_alert "$subject" "$body" "critical"
}

# Send failed login alert
send_failed_login_alert() {
    local ip="$1"
    local count="$2"
    local failed_logs="$3"

    local subject="[WARNING] Failed SSH Logins: $count attempts from $ip - $HOSTNAME ($HOST_IP)"
    local body="<html><body>
<h2 style='color: #f0ad4e;'>⚠️ Failed SSH Login Alert</h2>
<p><strong>Server:</strong> $HOSTNAME</p>
<p><strong>Timestamp:</strong> $TIMESTAMP</p>
<hr>
<h3>Attack Details:</h3>
<ul>
  <li><strong>Source IP:</strong> $ip</li>
  <li><strong>Failed Attempts:</strong> $count</li>
  <li><strong>Threshold:</strong> $FAILED_THRESHOLD</li>
</ul>
<hr>
<h3>Recent Failed Attempts:</h3>
<pre style='background-color: #f5f5f5; padding: 10px; overflow-x: auto;'>$(echo "$failed_logs" | grep "$ip" | tail -10)</pre>
<hr>
<h3>🛡️ Recommended Actions:</h3>
<ol>
  <li>Check if IP is known: <code>whois $ip</code></li>
  <li>Review fail2ban status: <code>fail2ban-client status sshd</code></li>
  <li>Block IP if malicious: <code>ufw deny from $ip</code></li>
  <li>Add to whitelist if authorized: <code>echo '$ip' >> $AUTHORIZED_IPS_FILE</code></li>
</ol>
<p><em>This alert is rate-limited to once every 30 minutes per IP address.</em></p>
</body></html>"

    send_alert "$subject" "$body" "warning"
}

# Send activity summary (periodic report)
send_activity_summary() {
    local successful_count="$1"
    local failed_count="$2"
    local logged_in_users="$3"

    # Only send report if there were successful logins or other activity besides just failed logins
    if [ "$successful_count" -eq 0 ] && [ "$failed_count" -eq 0 ]; then
        log_message "No SSH activity to report"
        return
    fi

    # Don't send report if only failed logins occurred (no successful logins)
    if [ "$successful_count" -eq 0 ]; then
        log_message "Only failed logins detected, skipping activity summary"
        return
    fi

    if ! should_send_alert "activity-summary"; then
        return
    fi

    local subject="[INFO] SSH Activity Summary - $HOSTNAME ($HOST_IP)"
    local body="<html><body>
<h2>📊 SSH Activity Report</h2>
<p><strong>Server:</strong> $HOSTNAME</p>
<p><strong>Report Time:</strong> $TIMESTAMP</p>
<hr>
<h3>Activity Summary:</h3>
<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>
<tr style='background-color: #f2f2f2;'>
  <th>Metric</th>
  <th>Count</th>
</tr>
<tr>
  <td>Successful Logins</td>
  <td>$successful_count</td>
</tr>
<tr>
  <td>Failed Login Attempts</td>
  <td>$failed_count</td>
</tr>
</table>
<hr>
<h3>Currently Logged In Users:</h3>
<pre style='background-color: #f5f5f5; padding: 10px;'>$logged_in_users</pre>
<hr>
<h3>Recent Activity Log:</h3>
<pre style='background-color: #f5f5f5; padding: 10px; overflow-x: auto;'>$(tail -50 "$ACTIVITY_LOG")</pre>
<p><em>This summary is sent hourly when SSH activity is detected.</em></p>
</body></html>"

    send_alert "$subject" "$body" "info"
}

# Main execution
main() {
    log_message "=== SSH Security Monitor Started ==="

    # Get new log entries since last check
    local new_entries=$(get_new_entries)

    if [ -z "$new_entries" ]; then
        log_message "No new SSH activity detected"
        update_last_check
        exit 0
    fi

    # Analyze all SSH activity
    analyze_successful_logins "$new_entries"
    analyze_failed_logins "$new_entries"
    analyze_logged_in_users
    analyze_recent_commands "$new_entries"

    # Count activity for summary
    local successful_count=$(echo "$new_entries" | grep -E "sshd.*Accepted" | wc -l)
    local failed_count=$(echo "$new_entries" | grep -E "sshd.*(Failed|Invalid)" | wc -l)
    local logged_in_users=$(who)

    # Send periodic activity summary
    send_activity_summary "$successful_count" "$failed_count" "$logged_in_users"

    # Update last check timestamp
    update_last_check

    log_message "=== SSH Security Monitor Completed ==="
    log_message "Successful logins: $successful_count, Failed attempts: $failed_count"
}

# Run main function
main

# Explicit exit
exit 0
