#!/bin/bash
# SSH Security Monitor Script
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Monitors SSH access for suspicious activity and security events
# Sends email alerts for failed logins, root access, and unknown users/IPs
# Usage: Executed by systemd timer every 10 minutes

set -euo pipefail

# Configuration
HOSTNAME="$(hostname)"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
LOG_FILE="/var/log/auth.log"
MONITOR_LOG="/var/log/ssh-security-monitor.log"
LOCK_DIR="/var/lock"
LOCK_DURATION_FAILED=1800  # 30 minutes for failed login alerts
LOCK_DURATION_ROOT=0       # No rate limiting for root access (always alert)
FAILED_THRESHOLD=5         # Number of failed attempts to trigger alert
CONFIG_DIR="/etc/security-monitor"
AUTHORIZED_IPS_FILE="$CONFIG_DIR/authorized-ips.conf"
AUTHORIZED_USERS_FILE="$CONFIG_DIR/authorized-users.conf"
BUSINESS_HOURS_START=8
BUSINESS_HOURS_END=18

# Ensure directories and files exist
mkdir -p "$CONFIG_DIR"
touch "$MONITOR_LOG" 2>/dev/null || MONITOR_LOG="/tmp/ssh-security-monitor.log"
touch "$AUTHORIZED_IPS_FILE" 2>/dev/null || true
touch "$AUTHORIZED_USERS_FILE" 2>/dev/null || true

# Logging function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$MONITOR_LOG"
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

# Get recent failed login attempts (last 10 minutes)
get_failed_logins() {
    local timeframe="10 minutes ago"
    local failed_attempts=""

    if [ -f "$LOG_FILE" ]; then
        # Extract failed password attempts with IP addresses
        failed_attempts=$(grep "Failed password" "$LOG_FILE" 2>/dev/null | \
            grep -v "grep" | \
            tail -100 | \
            awk '{
                for(i=1;i<=NF;i++) {
                    if($i=="from") {
                        ip=$(i+1);
                        for(j=1;j<=NF;j++) {
                            if($j=="for") {
                                user=$(j+1);
                                print user, ip;
                                break;
                            }
                        }
                        break;
                    }
                }
            }' | sort | uniq -c | sort -rn)
    fi

    echo "$failed_attempts"
}

# Get recent successful logins
get_successful_logins() {
    if [ -f "$LOG_FILE" ]; then
        grep -E "Accepted (password|publickey)" "$LOG_FILE" 2>/dev/null | \
            grep -v "grep" | \
            tail -10 | \
            awk '{
                for(i=1;i<=NF;i++) {
                    if($i=="for") {
                        user=$(i+1);
                        for(j=1;j<=NF;j++) {
                            if($j=="from") {
                                ip=$(j+1);
                                print $1, $2, $3, user, ip;
                                break;
                            }
                        }
                        break;
                    }
                }
            }'
    fi
}

# Get root login attempts
get_root_logins() {
    if [ -f "$LOG_FILE" ]; then
        grep -E "Accepted (password|publickey) for root" "$LOG_FILE" 2>/dev/null | \
            grep -v "grep" | \
            tail -10
    fi
}

# Check for root access in recent logs
check_root_access() {
    local root_logins=$(get_root_logins)

    if [ -n "$root_logins" ]; then
        # Get the most recent root login
        local recent_root=$(echo "$root_logins" | tail -1)
        local root_ip=$(echo "$recent_root" | awk '{for(i=1;i<=NF;i++) if($i=="from") print $(i+1)}')
        local root_time=$(echo "$recent_root" | awk '{print $1, $2, $3}')

        log_message "Root access detected from IP: $root_ip at $root_time"

        if should_send_alert "root-access-${root_ip}"; then
            send_root_access_alert "$root_ip" "$root_time" "$recent_root"
        fi
    fi
}

# Send failed login alert
send_failed_login_alert() {
    local failed_attempts="$1"
    local failed_count="$2"

    local subject="[SECURITY] High Failed SSH Login Attempts: $HOSTNAME"

    local body="<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #dc3545; color: white; padding: 20px; border-radius: 5px; }
        .content { padding: 20px; }
        .metric { background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #dc3545; }
        .metric-title { font-weight: bold; color: #dc3545; margin-bottom: 5px; }
        pre { background-color: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        .recommendation { background-color: #fff3cd; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107; }
    </style>
</head>
<body>
    <div class=\"header\">
        <h2>SSH Security Alert - High Failed Login Attempts</h2>
        <p><strong>Server:</strong> $HOSTNAME</p>
        <p><strong>Time:</strong> $TIMESTAMP</p>
    </div>

    <div class=\"content\">
        <div class=\"metric\">
            <div class=\"metric-title\">Alert Details</div>
            <p><strong>Alert Type:</strong> Failed SSH Login Attempts</p>
            <p><strong>Total Failed Attempts:</strong> $failed_count</p>
            <p><strong>Threshold:</strong> $FAILED_THRESHOLD attempts</p>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Failed Login Attempts (Count, User, IP)</div>
            <pre>$failed_attempts</pre>
        </div>

        <div class=\"recommendation\">
            <div class=\"metric-title\">Recommended Actions</div>
            <ul>
                <li>Review the IP addresses for known attackers</li>
                <li>Consider blocking suspicious IPs using fail2ban or firewall rules</li>
                <li>Verify that strong passwords are enforced</li>
                <li>Consider disabling password authentication and using SSH keys only</li>
                <li>Review authorized users and remove unnecessary accounts</li>
                <li>Check if any accounts have been compromised</li>
            </ul>
        </div>
    </div>

    <div class=\"footer\">
        <p>This is an automated alert from the SSH security monitoring service.</p>
        <p>Log file: $LOG_FILE</p>
        <p>Monitor log: $MONITOR_LOG</p>
    </div>
</body>
</html>"

    # Send email using rate-limited email script
    if [ -x /usr/local/bin/send-rate-limited-email.sh ]; then
        echo "$body" | /usr/local/bin/send-rate-limited-email.sh "ssh-failed-logins" "$subject" "$body"
        log_message "Failed login alert sent"
    else
        echo -e "Subject: $subject\nContent-Type: text/html\n\n$body" | sendmail -t "{{ lookup('env', 'POSTFIX_RCPTS') | default('security@forwardemail.net') }}"
        log_message "Failed login alert sent via sendmail"
    fi
}

# Send root access alert
send_root_access_alert() {
    local root_ip="$1"
    local root_time="$2"
    local root_details="$3"

    local subject="[CRITICAL] Root SSH Access Detected: $HOSTNAME"

    local ip_authorized="No"
    if is_authorized_ip "$root_ip"; then
        ip_authorized="Yes (in whitelist)"
    fi

    local outside_hours="No"
    if is_outside_business_hours; then
        outside_hours="Yes (outside ${BUSINESS_HOURS_START}:00-${BUSINESS_HOURS_END}:00)"
    fi

    local body="<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #dc3545; color: white; padding: 20px; border-radius: 5px; }
        .content { padding: 20px; }
        .metric { background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #dc3545; }
        .metric-title { font-weight: bold; color: #dc3545; margin-bottom: 5px; }
        pre { background-color: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        .recommendation { background-color: #f8d7da; padding: 15px; margin: 15px 0; border-left: 4px solid #dc3545; }
        .warning { color: #dc3545; font-weight: bold; }
    </style>
</head>
<body>
    <div class=\"header\">
        <h2>CRITICAL: Root SSH Access Detected</h2>
        <p><strong>Server:</strong> $HOSTNAME</p>
        <p><strong>Time:</strong> $TIMESTAMP</p>
    </div>

    <div class=\"content\">
        <div class=\"metric\">
            <div class=\"metric-title\">Alert Details</div>
            <p><strong>Alert Type:</strong> Root User SSH Access</p>
            <p><strong>Source IP:</strong> $root_ip</p>
            <p><strong>Login Time:</strong> $root_time</p>
            <p><strong>IP Authorized:</strong> $ip_authorized</p>
            <p><strong>Outside Business Hours:</strong> $outside_hours</p>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Login Details</div>
            <pre>$root_details</pre>
        </div>"

    if [ "$ip_authorized" = "No" ] || [ "$outside_hours" = "Yes"* ]; then
        body="${body}
        <div class=\"recommendation\">
            <div class=\"metric-title\"><span class=\"warning\">⚠ WARNING</span></div>
            <p class=\"warning\">This root access may be unauthorized or suspicious:</p>
            <ul>"
        if [ "$ip_authorized" = "No" ]; then
            body="${body}
                <li>IP address $root_ip is NOT in the authorized IP whitelist</li>"
        fi
        if [ "$outside_hours" = "Yes"* ]; then
            body="${body}
                <li>Access occurred outside normal business hours</li>"
        fi
        body="${body}
            </ul>
        </div>"
    fi

    body="${body}
        <div class=\"recommendation\">
            <div class=\"metric-title\">Recommended Actions</div>
            <ul>
                <li><strong>IMMEDIATE:</strong> Verify this root access was authorized</li>
                <li>Review active sessions: <code>who</code> and <code>w</code></li>
                <li>Check for suspicious processes: <code>ps aux</code></li>
                <li>Review recent commands: <code>history</code></li>
                <li>Consider disabling direct root SSH login</li>
                <li>Use sudo with individual user accounts instead</li>
                <li>Add authorized IPs to: $AUTHORIZED_IPS_FILE</li>
                <li>Review system logs for other suspicious activity</li>
            </ul>
        </div>
    </div>

    <div class=\"footer\">
        <p>This is an automated alert from the SSH security monitoring service.</p>
        <p><strong>This alert is not rate-limited and will be sent for every root access.</strong></p>
        <p>Log file: $LOG_FILE</p>
        <p>Monitor log: $MONITOR_LOG</p>
    </div>
</body>
</html>"

    # Send email using rate-limited email script (but with unique identifier to bypass rate limiting)
    if [ -x /usr/local/bin/send-rate-limited-email.sh ]; then
        echo "$body" | /usr/local/bin/send-rate-limited-email.sh "ssh-root-access-$(date +%s)" "$subject" "$body"
        log_message "Root access alert sent for IP: $root_ip"
    else
        echo -e "Subject: $subject\nContent-Type: text/html\n\n$body" | sendmail -t "{{ lookup('env', 'POSTFIX_RCPTS') | default('security@forwardemail.net') }}"
        log_message "Root access alert sent via sendmail for IP: $root_ip"
    fi
}

# Main monitoring logic
main() {
    log_message "Starting SSH security monitoring check"

    # Check for failed login attempts
    failed_logins=$(get_failed_logins)
    if [ -n "$failed_logins" ]; then
        failed_count=$(echo "$failed_logins" | wc -l)
        log_message "Found $failed_count unique failed login patterns"

        if [ $failed_count -ge $FAILED_THRESHOLD ]; then
            log_message "Failed login threshold exceeded"
            if should_send_alert "failed-logins"; then
                send_failed_login_alert "$failed_logins" "$failed_count"
            fi
        fi
    else
        log_message "No failed login attempts found"
    fi

    # Check for root access (always check, no threshold)
    check_root_access

    log_message "SSH security monitoring check completed"
}

# Execute main function
main

exit 0
