#!/bin/bash
# Root Access Monitor Script
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Monitors root user access and privilege escalation
# Sends email alerts for sudo usage, su to root, and direct root logins
# Usage: Executed by systemd timer every 5 minutes

set -euo pipefail

# Configuration
HOSTNAME="$(hostname)"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
AUTH_LOG="/var/log/auth.log"
SUDO_LOG="/var/log/sudo.log"
MONITOR_LOG="/var/log/root-access-monitor.log"
LOCK_DIR="/var/lock"
LOCK_DURATION=1800  # 30 minutes between alerts
CONFIG_DIR="/etc/security-monitor"
AUTHORIZED_ROOT_USERS_FILE="$CONFIG_DIR/authorized-root-users.conf"
AUTHORIZED_SUDO_USERS_FILE="$CONFIG_DIR/authorized-sudo-users.conf"

# Ensure directories and files exist
mkdir -p "$CONFIG_DIR"
touch "$MONITOR_LOG" 2>/dev/null || MONITOR_LOG="/tmp/root-access-monitor.log"
touch "$AUTHORIZED_ROOT_USERS_FILE" 2>/dev/null || true
touch "$AUTHORIZED_SUDO_USERS_FILE" 2>/dev/null || true

# Logging function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$MONITOR_LOG"
}

# Check if we should send an alert (rate limiting)
should_send_alert() {
    local alert_type="$1"
    local user="$2"
    local lockfile="$LOCK_DIR/root-monitor-${alert_type}-${user}.lock"

    if [ -f "$lockfile" ]; then
        lockfile_time=$(stat -c %Y "$lockfile" 2>/dev/null || echo 0)
        current_time=$(date +%s)
        elapsed_time=$((current_time - lockfile_time))

        if [ $elapsed_time -lt $LOCK_DURATION ]; then
            log_message "Rate limit active for ${alert_type} by ${user} (${elapsed_time}s elapsed)"
            return 1  # Don't send alert
        fi
    fi

    # Create or update lockfile
    touch "$lockfile" 2>/dev/null || true
    return 0  # Send alert
}

# Check if user is authorized for root access
is_authorized_root_user() {
    local user="$1"
    if [ -f "$AUTHORIZED_ROOT_USERS_FILE" ]; then
        grep -qF "$user" "$AUTHORIZED_ROOT_USERS_FILE" 2>/dev/null && return 0
    fi
    return 1
}

# Check if user is authorized for sudo
is_authorized_sudo_user() {
    local user="$1"
    if [ -f "$AUTHORIZED_SUDO_USERS_FILE" ]; then
        grep -qF "$user" "$AUTHORIZED_SUDO_USERS_FILE" 2>/dev/null && return 0
    fi
    return 1
}

# Get recent sudo commands (last 10 minutes)
get_recent_sudo_commands() {
    if [ -f "$AUTH_LOG" ]; then
        # Look for sudo commands in auth.log
        grep "sudo:" "$AUTH_LOG" 2>/dev/null | \
            grep -v "grep" | \
            tail -50 | \
            grep "COMMAND=" | \
            awk '{
                for(i=1;i<=NF;i++) {
                    if($i ~ /^USER=/) {
                        user=$i;
                        sub(/USER=/, "", user);
                    }
                    if($i ~ /^COMMAND=/) {
                        cmd="";
                        for(j=i;j<=NF;j++) cmd=cmd" "$j;
                        print $1, $2, $3, user, cmd;
                        break;
                    }
                }
            }'
    fi
}

# Get recent su to root attempts
get_su_to_root() {
    if [ -f "$AUTH_LOG" ]; then
        grep -E "su\[.*\].*session opened for user root" "$AUTH_LOG" 2>/dev/null | \
            grep -v "grep" | \
            tail -20
    fi
}

# Get console root logins
get_console_root_logins() {
    if [ -f "$AUTH_LOG" ]; then
        grep -E "login\[.*\].*ROOT LOGIN" "$AUTH_LOG" 2>/dev/null | \
            grep -v "grep" | \
            tail -20
    fi
}

# Get current root sessions
get_active_root_sessions() {
    who | grep "^root " || echo "No active root sessions"
}

# Send sudo usage alert
send_sudo_alert() {
    local user="$1"
    local command="$2"
    local timestamp="$3"

    local subject="[WARNING] Sudo Usage Detected: $user on $HOSTNAME"

    local authorized="No"
    if is_authorized_sudo_user "$user"; then
        authorized="Yes (in whitelist)"
    fi

    local recent_sudo=$(get_recent_sudo_commands)
    local active_sessions=$(get_active_root_sessions)

    local body="<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #ffc107; color: #333; padding: 20px; border-radius: 5px; }
        .content { padding: 20px; }
        .metric { background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #ffc107; }
        .metric-title { font-weight: bold; color: #856404; margin-bottom: 5px; }
        pre { background-color: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        .recommendation { background-color: #e7f3ff; padding: 15px; margin: 15px 0; border-left: 4px solid #0066cc; }
    </style>
</head>
<body>
    <div class=\"header\">
        <h2>Root Access Alert - Sudo Usage</h2>
        <p><strong>Server:</strong> $HOSTNAME</p>
        <p><strong>Time:</strong> $TIMESTAMP</p>
    </div>

    <div class=\"content\">
        <div class=\"metric\">
            <div class=\"metric-title\">Alert Details</div>
            <p><strong>Alert Type:</strong> Sudo Command Execution</p>
            <p><strong>User:</strong> $user</p>
            <p><strong>Command:</strong> $command</p>
            <p><strong>Timestamp:</strong> $timestamp</p>
            <p><strong>User Authorized:</strong> $authorized</p>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Recent Sudo Commands (Last 50)</div>
            <pre>$recent_sudo</pre>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Active Root Sessions</div>
            <pre>$active_sessions</pre>
        </div>

        <div class=\"recommendation\">
            <div class=\"metric-title\">Recommended Actions</div>
            <ul>
                <li>Verify this sudo usage was authorized and necessary</li>
                <li>Review the command executed for any suspicious activity</li>
                <li>Check if the user should have sudo privileges</li>
                <li>Add authorized sudo users to: $AUTHORIZED_SUDO_USERS_FILE</li>
                <li>Review sudo configuration in /etc/sudoers</li>
                <li>Consider implementing sudo logging and auditing</li>
                <li>Monitor for privilege escalation attempts</li>
            </ul>
        </div>
    </div>

    <div class=\"footer\">
        <p>This is an automated alert from the root access monitoring service.</p>
        <p>Auth log: $AUTH_LOG</p>
        <p>Monitor log: $MONITOR_LOG</p>
    </div>
</body>
</html>"

    # Send email using rate-limited email script
    if [ -x /usr/local/bin/send-rate-limited-email.sh ]; then
        echo "$body" | /usr/local/bin/send-rate-limited-email.sh "root-sudo-${user}" "$subject" "$body"
        log_message "Sudo alert sent for user: $user"
    else
        echo -e "Subject: $subject\nContent-Type: text/html\n\n$body" | sendmail -t "{{ lookup('env', 'POSTFIX_RCPTS') | default('security@forwardemail.net') }}"
        log_message "Sudo alert sent via sendmail for user: $user"
    fi
}

# Send su to root alert
send_su_alert() {
    local user="$1"
    local details="$2"

    local subject="[WARNING] Su to Root Detected: $user on $HOSTNAME"

    local authorized="No"
    if is_authorized_root_user "$user"; then
        authorized="Yes (in whitelist)"
    fi

    local recent_su=$(get_su_to_root)
    local active_sessions=$(get_active_root_sessions)

    local body="<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #fd7e14; color: white; padding: 20px; border-radius: 5px; }
        .content { padding: 20px; }
        .metric { background-color: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #fd7e14; }
        .metric-title { font-weight: bold; color: #fd7e14; margin-bottom: 5px; }
        pre { background-color: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        .recommendation { background-color: #fff3cd; padding: 15px; margin: 15px 0; border-left: 4px solid #ffc107; }
    </style>
</head>
<body>
    <div class=\"header\">
        <h2>Root Access Alert - Su to Root</h2>
        <p><strong>Server:</strong> $HOSTNAME</p>
        <p><strong>Time:</strong> $TIMESTAMP</p>
    </div>

    <div class=\"content\">
        <div class=\"metric\">
            <div class=\"metric-title\">Alert Details</div>
            <p><strong>Alert Type:</strong> Su to Root</p>
            <p><strong>User:</strong> $user</p>
            <p><strong>User Authorized:</strong> $authorized</p>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Session Details</div>
            <pre>$details</pre>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Recent Su to Root Attempts</div>
            <pre>$recent_su</pre>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Active Root Sessions</div>
            <pre>$active_sessions</pre>
        </div>

        <div class=\"recommendation\">
            <div class=\"metric-title\">Recommended Actions</div>
            <ul>
                <li>Verify this root access was authorized and necessary</li>
                <li>Check what commands are being executed as root</li>
                <li>Consider using sudo instead of su for better auditing</li>
                <li>Add authorized root users to: $AUTHORIZED_ROOT_USERS_FILE</li>
                <li>Review who has access to the root password</li>
                <li>Monitor active root sessions for suspicious activity</li>
                <li>Consider implementing PAM restrictions for su</li>
            </ul>
        </div>
    </div>

    <div class=\"footer\">
        <p>This is an automated alert from the root access monitoring service.</p>
        <p>Auth log: $AUTH_LOG</p>
        <p>Monitor log: $MONITOR_LOG</p>
    </div>
</body>
</html>"

    # Send email using rate-limited email script
    if [ -x /usr/local/bin/send-rate-limited-email.sh ]; then
        echo "$body" | /usr/local/bin/send-rate-limited-email.sh "root-su-${user}" "$subject" "$body"
        log_message "Su to root alert sent for user: $user"
    else
        echo -e "Subject: $subject\nContent-Type: text/html\n\n$body" | sendmail -t "{{ lookup('env', 'POSTFIX_RCPTS') | default('security@forwardemail.net') }}"
        log_message "Su to root alert sent via sendmail for user: $user"
    fi
}

# Main monitoring logic
main() {
    log_message "Starting root access monitoring check"

    # Check for recent sudo commands
    sudo_commands=$(get_recent_sudo_commands)
    if [ -n "$sudo_commands" ]; then
        # Get the most recent sudo command
        recent_sudo=$(echo "$sudo_commands" | tail -1)
        if [ -n "$recent_sudo" ]; then
            # Extract user and command
            sudo_user=$(echo "$recent_sudo" | awk '{print $4}')
            sudo_command=$(echo "$recent_sudo" | awk '{for(i=5;i<=NF;i++) printf "%s ", $i; print ""}')
            sudo_time=$(echo "$recent_sudo" | awk '{print $1, $2, $3}')

            log_message "Sudo command detected: $sudo_user executed $sudo_command"

            if ! is_authorized_sudo_user "$sudo_user"; then
                if should_send_alert "sudo" "$sudo_user"; then
                    send_sudo_alert "$sudo_user" "$sudo_command" "$sudo_time"
                fi
            else
                log_message "Sudo user $sudo_user is authorized"
            fi
        fi
    fi

    # Check for su to root
    su_attempts=$(get_su_to_root)
    if [ -n "$su_attempts" ]; then
        # Get the most recent su attempt
        recent_su=$(echo "$su_attempts" | tail -1)
        if [ -n "$recent_su" ]; then
            # Extract user who performed su
            su_user=$(echo "$recent_su" | grep -oP 'by \K[^ ]+' | head -1)

            if [ -n "$su_user" ]; then
                log_message "Su to root detected by user: $su_user"

                if ! is_authorized_root_user "$su_user"; then
                    if should_send_alert "su" "$su_user"; then
                        send_su_alert "$su_user" "$recent_su"
                    fi
                else
                    log_message "Su user $su_user is authorized"
                fi
            fi
        fi
    fi

    # Check for console root logins
    console_logins=$(get_console_root_logins)
    if [ -n "$console_logins" ]; then
        log_message "Console root login detected"
        # This is handled by SSH monitor for SSH logins
        # Console logins are logged but not alerted separately
    fi

    log_message "Root access monitoring check completed"
}

# Execute main function
main

exit 0
