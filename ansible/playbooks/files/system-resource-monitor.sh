#!/bin/bash
# System Resource Monitor Script
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Monitors CPU and memory usage with multiple threshold levels
# Sends email alerts via rate-limited email system
# Usage: Executed by systemd timer every 5 minutes

set -euo pipefail

# Configuration
HOSTNAME="$(hostname)"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
LOCK_DIR="/var/lock"
LOCK_DURATION=3600  # 1 hour between alerts for same threshold
LOG_FILE="/var/log/system-resource-monitor.log"

# Thresholds (percentages)
declare -A THRESHOLDS=(
    [75]="WARNING"
    [80]="ELEVATED"
    [90]="CRITICAL"
    [95]="SEVERE"
    [100]="MAXIMUM"
)

# Ensure log file exists and is writable
touch "$LOG_FILE" 2>/dev/null || LOG_FILE="/tmp/system-resource-monitor.log"

# Logging function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Check if we should send an alert (rate limiting per threshold)
should_send_alert() {
    local resource="$1"
    local threshold="$2"
    local lockfile="$LOCK_DIR/resource-monitor-${resource}-${threshold}.lock"

    if [ -f "$lockfile" ]; then
        lockfile_time=$(stat -c %Y "$lockfile" 2>/dev/null || echo 0)
        current_time=$(date +%s)
        elapsed_time=$((current_time - lockfile_time))

        if [ $elapsed_time -lt $LOCK_DURATION ]; then
            log_message "Rate limit active for ${resource} ${threshold}% (${elapsed_time}s elapsed)"
            return 1  # Don't send alert
        fi
    fi

    # Create or update lockfile
    touch "$lockfile" 2>/dev/null || true
    return 0  # Send alert
}

# Get CPU usage percentage
get_cpu_usage() {
    # Get CPU usage over 2 seconds for accuracy
    top -bn2 -d 1 | grep "Cpu(s)" | tail -1 | awk '{print 100 - $8}' | cut -d. -f1
}

# Get memory usage percentage
get_memory_usage() {
    free | grep Mem | awk '{printf "%.0f", ($3/$2) * 100}'
}

# Get top processes by CPU
get_top_cpu_processes() {
    ps aux --sort=-%cpu | head -11 | tail -10 | awk '{printf "%-10s %5s%% %5s %s\n", $1, $3, $4, substr($0, index($0,$11))}'
}

# Get top processes by memory
get_top_mem_processes() {
    ps aux --sort=-%mem | head -11 | tail -10 | awk '{printf "%-10s %5s%% %5s %s\n", $1, $4, $3, substr($0, index($0,$11))}'
}

# Get system load averages
get_load_averages() {
    uptime | awk -F'load average:' '{print $2}'
}

# Get disk usage
get_disk_usage() {
    df -h / | tail -1 | awk '{printf "%s used of %s (%s)", $3, $2, $5}'
}

# Get memory details
get_memory_details() {
    free -h | awk 'NR==2{printf "Total: %s, Used: %s, Free: %s, Available: %s", $2, $3, $4, $7}'
}

# Get swap usage
get_swap_usage() {
    free -h | awk 'NR==3{if($2 != "0B" && $2 != "0") printf "Total: %s, Used: %s, Free: %s", $2, $3, $4; else print "Swap disabled"}'
}

# Get system uptime
get_uptime() {
    uptime -p
}

# Send email alert
send_alert() {
    local resource="$1"
    local current_value="$2"
    local threshold="$3"
    local severity="${THRESHOLDS[$threshold]}"

    # Determine alert level for subject
    local alert_level
    if [ $threshold -ge 95 ]; then
        alert_level="CRITICAL"
    elif [ $threshold -ge 90 ]; then
        alert_level="CRITICAL"
    elif [ $threshold -ge 80 ]; then
        alert_level="WARNING"
    else
        alert_level="WARNING"
    fi

    # Build subject
    local subject="[${alert_level}] ${resource^^} Usage ${current_value}% (Threshold: ${threshold}%): $HOSTNAME"

    # Get system information
    local top_cpu_processes=$(get_top_cpu_processes)
    local top_mem_processes=$(get_top_mem_processes)
    local load_averages=$(get_load_averages)
    local disk_usage=$(get_disk_usage)
    local memory_details=$(get_memory_details)
    local swap_usage=$(get_swap_usage)
    local uptime_info=$(get_uptime)
    local cpu_current=$(get_cpu_usage)
    local mem_current=$(get_memory_usage)

    # Determine color based on severity
    local color
    if [ $threshold -ge 95 ]; then
        color="#dc3545"  # Red
    elif [ $threshold -ge 90 ]; then
        color="#fd7e14"  # Orange
    elif [ $threshold -ge 80 ]; then
        color="#ffc107"  # Yellow
    else
        color="#17a2b8"  # Blue
    fi

    # Build HTML email body
    local body="<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: ${color}; color: white; padding: 20px; border-radius: 5px; }
        .content { padding: 20px; }
        .metric { background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid ${color}; }
        .metric-title { font-weight: bold; color: ${color}; margin-bottom: 5px; }
        pre { background-color: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        .recommendation { background-color: #e7f3ff; padding: 15px; margin: 15px 0; border-left: 4px solid #0066cc; }
    </style>
</head>
<body>
    <div class=\"header\">
        <h2>System Resource Alert - ${severity}</h2>
        <p><strong>Server:</strong> $HOSTNAME</p>
        <p><strong>Time:</strong> $TIMESTAMP</p>
    </div>

    <div class=\"content\">
        <div class=\"metric\">
            <div class=\"metric-title\">Alert Details</div>
            <p><strong>Resource:</strong> ${resource^^}</p>
            <p><strong>Current Usage:</strong> ${current_value}%</p>
            <p><strong>Threshold Exceeded:</strong> ${threshold}%</p>
            <p><strong>Severity Level:</strong> ${severity}</p>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Current System Status</div>
            <p><strong>CPU Usage:</strong> ${cpu_current}%</p>
            <p><strong>Memory Usage:</strong> ${mem_current}%</p>
            <p><strong>Load Averages:</strong>${load_averages}</p>
            <p><strong>Uptime:</strong> ${uptime_info}</p>
            <p><strong>Disk Usage:</strong> ${disk_usage}</p>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Memory Details</div>
            <p>${memory_details}</p>
            <p><strong>Swap:</strong> ${swap_usage}</p>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Top 10 Processes by CPU Usage</div>
            <pre>${top_cpu_processes}</pre>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Top 10 Processes by Memory Usage</div>
            <pre>${top_mem_processes}</pre>
        </div>

        <div class=\"recommendation\">
            <div class=\"metric-title\">Recommended Actions</div>
            <ul>
                <li>Review the top processes consuming resources</li>
                <li>Check for any runaway processes or memory leaks</li>
                <li>Consider scaling resources if this is a persistent issue</li>
                <li>Review application logs for errors or unusual activity</li>
                <li>Monitor the situation for the next hour</li>"

    if [ $threshold -ge 90 ]; then
        body="${body}
                <li><strong>URGENT:</strong> Consider immediate intervention if usage remains above 90%</li>"
    fi

    body="${body}
            </ul>
        </div>
    </div>

    <div class=\"footer\">
        <p>This is an automated alert from the system resource monitoring service.</p>
        <p>Next alert for this threshold will be sent after ${LOCK_DURATION} seconds if the condition persists.</p>
        <p>Log file: $LOG_FILE</p>
    </div>
</body>
</html>"

    # Send email using rate-limited email script
    if [ -x /usr/local/bin/send-rate-limited-email.sh ]; then
        echo "$body" | /usr/local/bin/send-rate-limited-email.sh "resource-monitor-${resource}-${threshold}" "$subject" "$body"
        log_message "Alert sent: ${resource} ${current_value}% (threshold: ${threshold}%)"
    else
        # Fallback to sendmail
        echo -e "Subject: $subject\nContent-Type: text/html\n\n$body" | sendmail -t "{{ lookup('env', 'POSTFIX_RCPTS') | default('security@forwardemail.net') }}"
        log_message "Alert sent via sendmail: ${resource} ${current_value}% (threshold: ${threshold}%)"
    fi
}

# Main monitoring logic
main() {
    log_message "Starting resource monitoring check"

    # Get current CPU and memory usage
    cpu_usage=$(get_cpu_usage)
    mem_usage=$(get_memory_usage)

    log_message "Current usage - CPU: ${cpu_usage}%, Memory: ${mem_usage}%"

    # Check CPU thresholds (from highest to lowest)
    for threshold in 100 95 90 80 75; do
        if [ "$cpu_usage" -ge "$threshold" ]; then
            log_message "CPU threshold ${threshold}% exceeded (current: ${cpu_usage}%)"
            if should_send_alert "cpu" "$threshold"; then
                send_alert "cpu" "$cpu_usage" "$threshold"
            fi
            break  # Only alert for the highest threshold exceeded
        fi
    done

    # Check memory thresholds (from highest to lowest)
    for threshold in 100 95 90 80 75; do
        if [ "$mem_usage" -ge "$threshold" ]; then
            log_message "Memory threshold ${threshold}% exceeded (current: ${mem_usage}%)"
            if should_send_alert "memory" "$threshold"; then
                send_alert "memory" "$mem_usage" "$threshold"
            fi
            break  # Only alert for the highest threshold exceeded
        fi
    done

    log_message "Resource monitoring check completed"
}

# Execute main function
main

exit 0
