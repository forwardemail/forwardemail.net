#!/bin/bash
# Package Installation Monitor Script
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Monitors package installations, upgrades, and removals
# Sends email alerts for package changes
# Usage: Executed by systemd timer every hour

set -euo pipefail

# Configuration
HOSTNAME="$(hostname)"
HOST_IP="$(hostname -I | awk '{print $1}')"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
MONITOR_LOG="/var/log/package-monitor.log"
PACKAGE_STATE_FILE="/var/lib/package-monitor/package-state.txt"
LOCK_DIR="/var/lock"
LOCK_DURATION=3600  # 1 hour
CONFIG_DIR="/etc/security-monitor"

# Ensure directories exist
mkdir -p "$(dirname "$PACKAGE_STATE_FILE")"
mkdir -p "$CONFIG_DIR"
touch "$MONITOR_LOG" 2>/dev/null || MONITOR_LOG="/tmp/package-monitor.log"

# Logging function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$MONITOR_LOG"
}

# Check if we should send an alert (rate limiting)
should_send_alert() {
    local lockfile="$LOCK_DIR/package-monitor.lock"

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
        /usr/local/bin/send-rate-limited-email.sh "package-monitor" "$subject" "$body"
    else
        log_message "ERROR: send-rate-limited-email.sh not found"
    fi
}

# Get current package list
get_package_list() {
    if command -v dpkg &> /dev/null; then
        # Debian/Ubuntu
        dpkg -l | grep '^ii' | awk '{print $2 " " $3}'
    elif command -v rpm &> /dev/null; then
        # RedHat/CentOS
        rpm -qa --queryformat '%{NAME} %{VERSION}-%{RELEASE}\n'
    else
        log_message "ERROR: Unsupported package manager"
        return 1
    fi
}

# Initialize package state file
initialize_state() {
    if [ ! -f "$PACKAGE_STATE_FILE" ]; then
        log_message "Initializing package state file..."
        get_package_list > "$PACKAGE_STATE_FILE"
        log_message "Package state initialized with $(wc -l < "$PACKAGE_STATE_FILE") packages"
        return 1  # Skip first run
    fi
    return 0
}

# Compare package lists
compare_packages() {
    local old_state="$1"
    local new_state="$2"

    # Find installed packages
    local installed=$(comm -13 <(echo "$old_state" | sort) <(echo "$new_state" | sort))

    # Find removed packages
    local removed=$(comm -23 <(echo "$old_state" | sort) <(echo "$new_state" | sort))

    # Find upgraded packages (version changed)
    local upgraded=""
    while IFS= read -r line; do
        local pkg_name=$(echo "$line" | awk '{print $1}')
        local old_version=$(echo "$old_state" | grep "^$pkg_name " | awk '{print $2}')
        local new_version=$(echo "$new_state" | grep "^$pkg_name " | awk '{print $2}')

        if [ -n "$old_version" ] && [ -n "$new_version" ] && [ "$old_version" != "$new_version" ]; then
            upgraded+="$pkg_name: $old_version → $new_version\n"
        fi
    done <<< "$(echo "$new_state" | awk '{print $1}' | sort -u)"

    echo "$installed|$removed|$upgraded"
}

# Get recent package manager logs
get_package_logs() {
    local log_entries=""

    if [ -f /var/log/dpkg.log ]; then
        # Debian/Ubuntu - last 50 lines
        log_entries=$(tail -50 /var/log/dpkg.log | grep -E "(install|upgrade|remove)" || echo "No recent package operations")
    elif [ -f /var/log/yum.log ]; then
        # RedHat/CentOS - last 50 lines
        log_entries=$(tail -50 /var/log/yum.log | grep -E "(Installed|Updated|Erased)" || echo "No recent package operations")
    else
        log_entries="Package manager logs not found"
    fi

    echo "$log_entries"
}

# Send package change alert
send_package_alert() {
    local installed="$1"
    local removed="$2"
    local upgraded="$3"

    local installed_count=$(echo -e "$installed" | grep -c "." || echo "0")
    local removed_count=$(echo -e "$removed" | grep -c "." || echo "0")
    local upgraded_count=$(echo -e "$upgraded" | grep -c "." || echo "0")

    # Determine severity
    local color="#5bc0de"  # Blue (info)
    local severity="INFO"

    if [ "$removed_count" -gt 0 ]; then
        color="#f0ad4e"  # Orange (warning)
        severity="WARNING"
    fi

    local subject="[${severity}] Package Changes - $HOSTNAME ($HOST_IP)"
    local body="<html><body>
<h2 style='color: $color;'>📦 Package Installation Monitor</h2>
<p><strong>Server:</strong> $HOSTNAME</p>
<p><strong>Check Time:</strong> $TIMESTAMP</p>
<hr>
<h3>Summary:</h3>
<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>
<tr style='background-color: #f2f2f2;'>
  <th>Change Type</th>
  <th>Count</th>
</tr>
<tr>
  <td>Installed</td>
  <td style='color: #5cb85c;'>$installed_count</td>
</tr>
<tr>
  <td>Upgraded</td>
  <td style='color: #5bc0de;'>$upgraded_count</td>
</tr>
<tr>
  <td>Removed</td>
  <td style='color: $([ "$removed_count" -gt 0 ] && echo "#d9534f" || echo "#5cb85c");'>$removed_count</td>
</tr>
</table>
<hr>"

    if [ "$installed_count" -gt 0 ]; then
        body+="<h3>✅ Installed Packages:</h3>
<pre style='background-color: #f5f5f5; padding: 10px; overflow-x: auto;'>$(echo -e "$installed")</pre>
<hr>"
    fi

    if [ "$upgraded_count" -gt 0 ]; then
        body+="<h3>⬆️ Upgraded Packages:</h3>
<pre style='background-color: #f5f5f5; padding: 10px; overflow-x: auto;'>$(echo -e "$upgraded")</pre>
<hr>"
    fi

    if [ "$removed_count" -gt 0 ]; then
        body+="<h3>❌ Removed Packages:</h3>
<pre style='background-color: #f5f5f5; padding: 10px; overflow-x: auto;'>$(echo -e "$removed")</pre>
<hr>"
    fi

    body+="<h3>📋 Recent Package Manager Activity:</h3>
<pre style='background-color: #f5f5f5; padding: 10px; overflow-x: auto;'>$(get_package_logs)</pre>
<hr>
<h3>🛡️ Security Considerations:</h3>
<ul>
  <li>Review installed packages for unauthorized changes</li>
  <li>Verify removed packages were intentionally uninstalled</li>
  <li>Check for security updates: <code>apt-get update && apt-get upgrade -s</code></li>
  <li>Review package manager logs: <code>tail -100 /var/log/dpkg.log</code></li>
</ul>
<p><em>This monitor runs hourly and tracks all package changes.</em></p>
</body></html>"

    send_alert "$subject" "$body"
}

# Main execution
main() {
    log_message "=== Package Monitor Started ==="

    # Initialize state file if needed
    if ! initialize_state; then
        log_message "First run - state initialized, skipping alert"
        exit 0
    fi

    # Get current package list
    local new_state=$(get_package_list)

    if [ -z "$new_state" ]; then
        log_message "ERROR: Failed to get package list"
        exit 1
    fi

    # Read old state
    local old_state=$(cat "$PACKAGE_STATE_FILE")

    # Compare package lists
    local changes=$(compare_packages "$old_state" "$new_state")

    local installed=$(echo "$changes" | cut -d'|' -f1)
    local removed=$(echo "$changes" | cut -d'|' -f2)
    local upgraded=$(echo "$changes" | cut -d'|' -f3)

    # Count changes
    local installed_count=$(echo -e "$installed" | grep -c "." || echo "0")
    local removed_count=$(echo -e "$removed" | grep -c "." || echo "0")
    local upgraded_count=$(echo -e "$upgraded" | grep -c "." || echo "0")
    local total_changes=$((installed_count + removed_count + upgraded_count))

    if [ "$total_changes" -eq 0 ]; then
        log_message "No package changes detected"
    else
        log_message "Package changes detected: $installed_count installed, $upgraded_count upgraded, $removed_count removed"

        # Send alert if rate limit allows
        if should_send_alert; then
            send_package_alert "$installed" "$removed" "$upgraded"
        fi

        # Update state file
        echo "$new_state" > "$PACKAGE_STATE_FILE"
    fi

    log_message "=== Package Monitor Completed ==="
}

# Run main function
main

# Explicit exit
exit 0
