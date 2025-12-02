#!/bin/bash
# Lynis System Audit Monitor Script
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Runs Lynis system security audit and sends email alerts for findings
# Usage: Executed by systemd timer daily

set -euo pipefail

# Configuration
HOSTNAME="$(hostname)"
HOST_IP="$(hostname -I | awk '{print $1}')"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
MONITOR_LOG="/var/log/lynis-audit-monitor.log"
LYNIS_LOG="/var/log/lynis.log"
LYNIS_REPORT="/var/log/lynis-report.dat"
LOCK_DIR="/var/lock"
LOCK_DURATION=86400  # 24 hours (daily reports)
CONFIG_DIR="/etc/security-monitor"

# Ensure directories exist
mkdir -p "$CONFIG_DIR"
touch "$MONITOR_LOG" 2>/dev/null || MONITOR_LOG="/tmp/lynis-audit-monitor.log"

# Logging function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$MONITOR_LOG"
}

# Check if we should send an alert (rate limiting)
should_send_alert() {
    local lockfile="$LOCK_DIR/lynis-audit-monitor.lock"

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
        /usr/local/bin/send-rate-limited-email.sh "lynis-audit-monitor" "$subject" "$body"
    else
        log_message "ERROR: send-rate-limited-email.sh not found"
    fi
}

# Install Lynis if not present
install_lynis() {
    if ! command -v lynis &> /dev/null; then
        log_message "Installing Lynis..."

        # Install from package manager
        if command -v apt-get &> /dev/null; then
            apt-get update -qq
            apt-get install -y -qq lynis
        elif command -v yum &> /dev/null; then
            yum install -y -q lynis
        else
            log_message "ERROR: Cannot install Lynis - unsupported package manager"
            return 1
        fi

        log_message "Lynis installed successfully"
    fi
}

# Run Lynis audit
run_lynis_audit() {
    log_message "Running Lynis system audit..."

    # Run Lynis audit (non-interactive)
    lynis audit system --quick --quiet --log-file "$LYNIS_LOG" --report-file "$LYNIS_REPORT" || true

    if [ ! -f "$LYNIS_REPORT" ]; then
        log_message "ERROR: Lynis report not generated"
        return 1
    fi

    log_message "Lynis audit completed"
}

# Parse Lynis report
parse_lynis_report() {
    if [ ! -f "$LYNIS_REPORT" ]; then
        echo "ERROR: Lynis report file not found"
        return 1
    fi

    # Extract key metrics
    local hardening_index=$(grep "hardening_index=" "$LYNIS_REPORT" | cut -d'=' -f2 | head -1 | tr -d ' ' || echo "0")
    local tests_performed=$(grep "tests_performed=" "$LYNIS_REPORT" | cut -d'=' -f2 | head -1 | tr -d ' ' || echo "0")
    local warnings=$(grep -c "^warning\[\]=" "$LYNIS_REPORT" || echo "0")
    local suggestions=$(grep -c "^suggestion\[\]=" "$LYNIS_REPORT" || echo "0")

    echo "$hardening_index|$tests_performed|$warnings|$suggestions"
}

# Get warnings from Lynis report
get_warnings() {
    if [ ! -f "$LYNIS_REPORT" ]; then
        echo "No warnings found"
        return
    fi

    grep "^warning\[\]=" "$LYNIS_REPORT" | cut -d'=' -f2 | sed 's/|/ - /g' || echo "No warnings found"
}

# Get suggestions from Lynis report
get_suggestions() {
    if [ ! -f "$LYNIS_REPORT" ]; then
        echo "No suggestions found"
        return
    fi

    grep "^suggestion\[\]=" "$LYNIS_REPORT" | cut -d'=' -f2 | head -20 | sed 's/|/ - /g' || echo "No suggestions found"
}

# Get vulnerable packages
get_vulnerable_packages() {
    if [ ! -f "$LYNIS_REPORT" ]; then
        echo "No vulnerable packages found"
        return
    fi

    grep "^vulnerable_package\[\]=" "$LYNIS_REPORT" | cut -d'=' -f2 || echo "No vulnerable packages found"
}

# Send audit report
send_audit_report() {
    local report_data="$1"

    local hardening_index=$(echo "$report_data" | cut -d'|' -f1)
    local tests_performed=$(echo "$report_data" | cut -d'|' -f2)
    local warnings=$(echo "$report_data" | cut -d'|' -f3)
    local suggestions=$(echo "$report_data" | cut -d'|' -f4)

    # Validate hardening_index is a number
    if ! [[ "$hardening_index" =~ ^[0-9]+$ ]]; then
        hardening_index=0
    fi

    # Determine severity color
    local color="#5cb85c"  # Green
    local severity="GOOD"

    if [ "$hardening_index" -lt 50 ]; then
        color="#d9534f"  # Red
        severity="CRITICAL"
    elif [ "$hardening_index" -lt 70 ]; then
        color="#f0ad4e"  # Orange
        severity="WARNING"
    elif [ "$hardening_index" -lt 85 ]; then
        color="#5bc0de"  # Blue
        severity="INFO"
    fi

    local subject="[${severity}] Lynis Security Audit - $HOSTNAME ($HOST_IP)"
    local body="<html><body>
<h2 style='color: $color;'>🔒 Lynis System Security Audit</h2>
<p><strong>Server:</strong> $HOSTNAME</p>
<p><strong>Audit Time:</strong> $TIMESTAMP</p>
<hr>
<h3>Security Score:</h3>
<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>
<tr style='background-color: #f2f2f2;'>
  <th>Metric</th>
  <th>Value</th>
</tr>
<tr>
  <td><strong>Hardening Index</strong></td>
  <td style='color: $color; font-size: 18px;'><strong>$hardening_index / 100</strong></td>
</tr>
<tr>
  <td>Tests Performed</td>
  <td>$tests_performed</td>
</tr>
<tr>
  <td>Warnings</td>
  <td style='color: $([ "$warnings" -gt 0 ] && echo "#d9534f" || echo "#5cb85c");'>$warnings</td>
</tr>
<tr>
  <td>Suggestions</td>
  <td>$suggestions</td>
</tr>
</table>
<hr>
<h3>⚠️ Warnings:</h3>
<pre style='background-color: #f5f5f5; padding: 10px; overflow-x: auto;'>$(get_warnings)</pre>
<hr>
<h3>💡 Top Suggestions:</h3>
<pre style='background-color: #f5f5f5; padding: 10px; overflow-x: auto;'>$(get_suggestions)</pre>
<hr>
<h3>🔓 Vulnerable Packages:</h3>
<pre style='background-color: #f5f5f5; padding: 10px; overflow-x: auto;'>$(get_vulnerable_packages)</pre>
<hr>
<h3>📊 Detailed Report:</h3>
<p>Full Lynis report available at: <code>$LYNIS_REPORT</code></p>
<p>Full Lynis log available at: <code>$LYNIS_LOG</code></p>
<hr>
<h3>🛡️ Recommended Actions:</h3>
<ol>
  <li>Review warnings and address critical security issues</li>
  <li>Implement suggested security improvements</li>
  <li>Update vulnerable packages: <code>apt-get update && apt-get upgrade</code></li>
  <li>Re-run audit after changes: <code>lynis audit system</code></li>
</ol>
<p><em>This audit runs daily. Lynis is an open-source security auditing tool: <a href='https://github.com/CISOfy/lynis'>https://github.com/CISOfy/lynis</a></em></p>
</body></html>"

    send_alert "$subject" "$body"
}

# Main execution
main() {
    log_message "=== Lynis Audit Monitor Started ==="

    # Check rate limiting
    if ! should_send_alert; then
        log_message "Skipping audit - rate limit active"
        exit 0
    fi

    # Install Lynis if needed
    install_lynis || exit 1

    # Run Lynis audit
    run_lynis_audit || exit 1

    # Parse report
    local report_data=$(parse_lynis_report)

    if [ -z "$report_data" ]; then
        log_message "ERROR: Failed to parse Lynis report"
        exit 1
    fi

    # Send audit report
    send_audit_report "$report_data"

    log_message "=== Lynis Audit Monitor Completed ==="
    log_message "Report: $report_data"
}

# Run main function
main

# Explicit exit
exit 0
