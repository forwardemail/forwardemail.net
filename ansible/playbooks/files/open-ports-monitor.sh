#!/bin/bash
# Open Ports Monitor Script
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Monitors open network ports and listening services
# Sends email alerts for new or unexpected open ports
# Usage: Executed by systemd timer every hour

set -euo pipefail

# Configuration
HOSTNAME="$(hostname)"
HOST_IP="$(hostname -I | awk '{print $1}')"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
MONITOR_LOG="/var/log/open-ports-monitor.log"
PORTS_STATE_FILE="/var/lib/open-ports-monitor/ports-state.txt"
LOCK_DIR="/var/lock"
LOCK_DURATION=3600  # 1 hour
CONFIG_DIR="/etc/security-monitor"
AUTHORIZED_PORTS_FILE="$CONFIG_DIR/authorized-ports.conf"

# Ensure directories exist
mkdir -p "$(dirname "$PORTS_STATE_FILE")"
mkdir -p "$CONFIG_DIR"
touch "$MONITOR_LOG" 2>/dev/null || MONITOR_LOG="/tmp/open-ports-monitor.log"
touch "$AUTHORIZED_PORTS_FILE" 2>/dev/null || true

# Logging function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$MONITOR_LOG"
}

# Check if we should send an alert (rate limiting)
should_send_alert() {
    local lockfile="$LOCK_DIR/open-ports-monitor.lock"

    if [ -f "$lockfile" ]; then
        lockfile_time=$(stat -c %Y "$lockfile" 2>/dev/null || echo 0)
        current_time=$(date +%s)
        elapsed_time=$((current_time - lockfile_time))

        if [ $elapsed_time -lt $LOCK_DURATION ]; then
            log_message "Rate limit active (${elapsed_time}s elapsed)"
            return 1
        fi
    fi

    touch "$lockfile" 2>/dev/null || true
    return 0
}

# Send email alert
send_alert() {
    local subject="$1"
    local body="$2"

    log_message "Sending alert: $subject"

    if [ -x /usr/local/bin/send-rate-limited-email.sh ]; then
        /usr/local/bin/send-rate-limited-email.sh "open-ports-monitor" "$subject" "$body"
    else
        log_message "ERROR: send-rate-limited-email.sh not found"
    fi
}

# Check if port is authorized
is_authorized_port() {
    local port="$1"
    if [ -f "$AUTHORIZED_PORTS_FILE" ]; then
        grep -qF "$port" "$AUTHORIZED_PORTS_FILE" 2>/dev/null && return 0
    fi
    return 1
}

# Get current open ports
get_open_ports() {
    # Use ss (socket statistics) or fallback to netstat
    if command -v ss &> /dev/null; then
        ss -tuln | grep LISTEN | awk '{print $5}' | sed 's/.*://' | sort -un
    elif command -v netstat &> /dev/null; then
        netstat -tuln | grep LISTEN | awk '{print $4}' | sed 's/.*://' | sort -un
    else
        log_message "ERROR: Neither ss nor netstat available"
        return 1
    fi
}

# Get detailed port information
get_port_details() {
    local port="$1"
    local details=""

    if command -v ss &> /dev/null; then
        details=$(ss -tulnp | grep ":$port " || echo "No details available")
    elif command -v netstat &> /dev/null; then
        details=$(netstat -tulnp | grep ":$port " || echo "No details available")
    fi

    # Get process information
    local pid=$(echo "$details" | grep -oP 'pid=\K[0-9]+' | head -1 || lsof -ti:$port 2>/dev/null | head -1 || echo "unknown")

    if [ "$pid" != "unknown" ] && [ -n "$pid" ]; then
        local process=$(ps -p "$pid" -o comm= 2>/dev/null || echo "unknown")
        local user=$(ps -p "$pid" -o user= 2>/dev/null || echo "unknown")
        echo "$port|$process|$user|$pid"
    else
        echo "$port|unknown|unknown|unknown"
    fi
}

# Get firewall status
get_firewall_status() {
    local port="$1"
    local status="unknown"

    if command -v ufw &> /dev/null; then
        if ufw status | grep -q "$port"; then
            status="UFW: allowed"
        else
            status="UFW: not explicitly allowed"
        fi
    elif command -v iptables &> /dev/null; then
        if iptables -L INPUT -n | grep -q "$port"; then
            status="iptables: rule exists"
        else
            status="iptables: no rule"
        fi
    fi

    echo "$status"
}

# Initialize ports state file
initialize_state() {
    if [ ! -f "$PORTS_STATE_FILE" ]; then
        log_message "Initializing ports state file..."
        get_open_ports > "$PORTS_STATE_FILE"
        log_message "Ports state initialized with $(wc -l < "$PORTS_STATE_FILE") open ports"
        return 1  # Skip first run
    fi
    return 0
}

# Compare port lists
compare_ports() {
    local old_ports="$1"
    local new_ports="$2"

    # Find new ports
    local new=$(comm -13 <(echo "$old_ports" | sort -n) <(echo "$new_ports" | sort -n))

    # Find closed ports
    local closed=$(comm -23 <(echo "$old_ports" | sort -n) <(echo "$new_ports" | sort -n))

    echo "$new|$closed"
}

# Send port change alert
send_port_alert() {
    local new_ports="$1"
    local closed_ports="$2"
    local all_ports="$3"

    local new_count
    local closed_count
    local total_count
    new_count=$(echo -e "$new_ports" | grep -c "." 2>/dev/null) || new_count=0
    closed_count=$(echo -e "$closed_ports" | grep -c "." 2>/dev/null) || closed_count=0
    total_count=$(echo -e "$all_ports" | grep -c "." 2>/dev/null) || total_count=0

    # Determine severity
    local color="#5bc0de"  # Blue (info)
    local severity="INFO"

    if [ "$new_count" -gt 0 ]; then
        color="#f0ad4e"  # Orange (warning)
        severity="WARNING"
    fi

    local subject="[${severity}] Open Ports Changed - $HOSTNAME ($HOST_IP)"
    local body="<html><body>
<h2 style='color: $color;'>🔌 Open Ports Monitor</h2>
<p><strong>Server:</strong> $HOSTNAME</p>
<p><strong>Check Time:</strong> $TIMESTAMP</p>
<hr>
<h3>Summary:</h3>
<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>
<tr style='background-color: #f2f2f2;'>
  <th>Status</th>
  <th>Count</th>
</tr>
<tr>
  <td>Total Open Ports</td>
  <td>$total_count</td>
</tr>
<tr>
  <td>New Ports</td>
  <td style='color: $([ "$new_count" -gt 0 ] && echo "#f0ad4e" || echo "#5cb85c");'>$new_count</td>
</tr>
<tr>
  <td>Closed Ports</td>
  <td style='color: #5bc0de;'>$closed_count</td>
</tr>
</table>
<hr>"

    if [ "$new_count" -gt 0 ]; then
        body+="<h3>⚠️ New Open Ports:</h3>
<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>
<tr style='background-color: #f2f2f2;'>
  <th>Port</th>
  <th>Process</th>
  <th>User</th>
  <th>PID</th>
  <th>Firewall</th>
  <th>Status</th>
</tr>"

        while IFS= read -r port; do
            [ -z "$port" ] && continue
            local details=$(get_port_details "$port")
            local process=$(echo "$details" | cut -d'|' -f2)
            local user=$(echo "$details" | cut -d'|' -f3)
            local pid=$(echo "$details" | cut -d'|' -f4)
            local firewall=$(get_firewall_status "$port")

            local status="⚠️ Unauthorized"
            local status_color="#f0ad4e"
            if is_authorized_port "$port"; then
                status="✅ Authorized"
                status_color="#5cb85c"
            fi

            body+="<tr>
  <td>$port</td>
  <td>$process</td>
  <td>$user</td>
  <td>$pid</td>
  <td>$firewall</td>
  <td style='color: $status_color;'>$status</td>
</tr>"
        done <<< "$new_ports"

        body+="</table>
<hr>"
    fi

    if [ "$closed_count" -gt 0 ]; then
        body+="<h3>✅ Closed Ports:</h3>
<pre style='background-color: #f5f5f5; padding: 10px;'>$(echo -e "$closed_ports")</pre>
<hr>"
    fi

    body+="<h3>📊 All Currently Open Ports:</h3>
<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>
<tr style='background-color: #f2f2f2;'>
  <th>Port</th>
  <th>Process</th>
  <th>User</th>
  <th>PID</th>
  <th>Firewall</th>
</tr>"

    while IFS= read -r port; do
        [ -z "$port" ] && continue
        local details=$(get_port_details "$port")
        local process=$(echo "$details" | cut -d'|' -f2)
        local user=$(echo "$details" | cut -d'|' -f3)
        local pid=$(echo "$details" | cut -d'|' -f4)
        local firewall=$(get_firewall_status "$port")

        body+="<tr>
  <td>$port</td>
  <td>$process</td>
  <td>$user</td>
  <td>$pid</td>
  <td>$firewall</td>
</tr>"
    done <<< "$all_ports"

    body+="</table>
<hr>
<h3>🛡️ Recommended Actions:</h3>
<ol>
  <li>Review new ports for unauthorized services</li>
  <li>Verify processes listening on new ports</li>
  <li>Update firewall rules if needed: <code>ufw allow &lt;port&gt;</code></li>
  <li>Add authorized ports to whitelist: <code>echo '&lt;port&gt;' >> $AUTHORIZED_PORTS_FILE</code></li>
  <li>Close unnecessary ports: <code>systemctl stop &lt;service&gt;</code></li>
</ol>
<p><em>This monitor runs hourly and tracks all open network ports.</em></p>
</body></html>"

    send_alert "$subject" "$body"
}

# Main execution
main() {
    log_message "=== Open Ports Monitor Started ==="

    # Initialize state file if needed
    if ! initialize_state; then
        log_message "First run - state initialized, skipping alert"
        exit 0
    fi

    # Get current open ports
    local new_ports=$(get_open_ports)

    if [ -z "$new_ports" ]; then
        log_message "ERROR: Failed to get open ports"
        exit 1
    fi

    # Read old state
    local old_ports=$(cat "$PORTS_STATE_FILE")

    # Compare port lists
    local changes=$(compare_ports "$old_ports" "$new_ports")

    local new=$(echo "$changes" | cut -d'|' -f1)
    local closed=$(echo "$changes" | cut -d'|' -f2)

    # Count changes (handle empty strings properly)
    local new_count
    local closed_count
    new_count=$(echo -e "$new" | grep -c "." 2>/dev/null) || new_count=0
    closed_count=$(echo -e "$closed" | grep -c "." 2>/dev/null) || closed_count=0
    local total_changes=$((new_count + closed_count))

    if [ "$total_changes" -eq 0 ]; then
        log_message "No port changes detected"
    else
        log_message "Port changes detected: $new_count new, $closed_count closed"

        # Send alert if rate limit allows
        if should_send_alert; then
            send_port_alert "$new" "$closed" "$new_ports"
        fi

        # Update state file
        echo "$new_ports" > "$PORTS_STATE_FILE"
    fi

    log_message "=== Open Ports Monitor Completed ==="
}

# Run main function
main

# Explicit exit
exit 0
