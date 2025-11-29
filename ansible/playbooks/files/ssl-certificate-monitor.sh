#!/bin/bash
# SSL Certificate Monitor Script
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Monitors SSL certificate expiration for WEB_URL environment variable
# Sends email alerts for expiring certificates
# Based on: https://github.com/forwardemail/sslmonitor.com
# Usage: Executed by systemd timer daily

set -euo pipefail

# Configuration
HOSTNAME="$(hostname)"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
MONITOR_LOG="/var/log/ssl-certificate-monitor.log"
LOCK_DIR="/var/lock"
LOCK_DURATION=86400  # 24 hours (daily reports)
WARNING_DAYS=30      # Send warning when certificate expires in less than this many days
CRITICAL_DAYS=7      # Send critical alert when certificate expires in less than this many days

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

    touch "$lockfile" 2>/dev/null || true
    return 0
}

# Send email alert
send_alert() {
    local subject="$1"
    local body="$2"

    log_message "Sending alert: $subject"

    if [ -x /usr/local/bin/send-rate-limited-email.sh ]; then
        /usr/local/bin/send-rate-limited-email.sh "ssl-certificate-monitor" "$subject" "$body"
    else
        log_message "ERROR: send-rate-limited-email.sh not found"
    fi
}

# Extract domain from URL
extract_domain() {
    local url="$1"
    # Remove protocol
    local domain=$(echo "$url" | sed -e 's|^[^/]*//||' -e 's|/.*$||' -e 's|:.*$||')
    echo "$domain"
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
    local cert_info=$(echo | openssl s_client -servername "$domain" -connect "$domain":443 2>/dev/null | openssl x509 -noout -dates -issuer -subject 2>/dev/null)

    if [ -z "$cert_info" ]; then
        status="ERROR"
        error_message="Could not retrieve certificate for $domain"
        days_left=0
    else
        # Extract expiry date
        expiry_date=$(echo "$cert_info" | grep "notAfter=" | sed -e 's/notAfter=//')

        # Extract issuer
        issuer=$(echo "$cert_info" | grep "issuer=" | sed -e 's/issuer=//')

        # Extract subject
        subject=$(echo "$cert_info" | grep "subject=" | sed -e 's/subject=//')

        if [ -z "$expiry_date" ]; then
            status="ERROR"
            error_message="Could not parse certificate expiry date"
            days_left=0
        else
            # Convert expiry date to seconds since epoch
            expiry_seconds=$(date -d "$expiry_date" +%s 2>/dev/null || echo "0")
            current_seconds=$(date +%s)

            if [ "$expiry_seconds" -eq 0 ]; then
                status="ERROR"
                error_message="Could not parse expiry date: $expiry_date"
                days_left=0
            else
                # Calculate days left
                seconds_left=$((expiry_seconds - current_seconds))
                days_left=$((seconds_left / 86400))

                # Determine status
                if [ $days_left -lt 0 ]; then
                    status="EXPIRED"
                elif [ $days_left -lt $CRITICAL_DAYS ]; then
                    status="CRITICAL"
                elif [ $days_left -lt $WARNING_DAYS ]; then
                    status="WARNING"
                fi
            fi
        fi
    fi

    # Return results
    echo "$domain|$expiry_date|$days_left|$status|$error_message|$issuer|$subject"
}

# Get certificate chain information
get_cert_chain() {
    local domain="$1"
    echo | openssl s_client -servername "$domain" -connect "$domain":443 -showcerts 2>/dev/null | grep -E "(s:|i:)" || echo "Chain information not available"
}

# Check OCSP status
check_ocsp_status() {
    local domain="$1"
    local ocsp_status=$(echo | openssl s_client -servername "$domain" -connect "$domain":443 -status 2>/dev/null | grep "OCSP Response Status" || echo "OCSP status not available")
    echo "$ocsp_status"
}

# Send certificate alert
send_certificate_alert() {
    local cert_info="$1"

    local domain=$(echo "$cert_info" | cut -d'|' -f1)
    local expiry_date=$(echo "$cert_info" | cut -d'|' -f2)
    local days_left=$(echo "$cert_info" | cut -d'|' -f3)
    local status=$(echo "$cert_info" | cut -d'|' -f4)
    local error_message=$(echo "$cert_info" | cut -d'|' -f5)
    local issuer=$(echo "$cert_info" | cut -d'|' -f6)
    local subject=$(echo "$cert_info" | cut -d'|' -f7)

    # Determine severity and color
    local color="#5cb85c"  # Green
    local severity="OK"
    local icon="✅"

    case "$status" in
        EXPIRED)
            color="#d9534f"  # Red
            severity="EXPIRED"
            icon="🚨"
            ;;
        CRITICAL)
            color="#d9534f"  # Red
            severity="CRITICAL"
            icon="🚨"
            ;;
        WARNING)
            color="#f0ad4e"  # Orange
            severity="WARNING"
            icon="⚠️"
            ;;
        ERROR)
            color="#d9534f"  # Red
            severity="ERROR"
            icon="❌"
            ;;
    esac

    local subject_line="$icon SSL Certificate Alert: $domain - $severity"
    local body="<html><body>
<h2 style='color: $color;'>$icon SSL Certificate Monitor</h2>
<p><strong>Server:</strong> $HOSTNAME</p>
<p><strong>Check Time:</strong> $TIMESTAMP</p>
<hr>
<h3>Certificate Status:</h3>
<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>
<tr style='background-color: #f2f2f2;'>
  <th>Property</th>
  <th>Value</th>
</tr>
<tr>
  <td><strong>Domain</strong></td>
  <td>$domain</td>
</tr>
<tr>
  <td><strong>Status</strong></td>
  <td style='color: $color; font-weight: bold;'>$status</td>
</tr>
<tr>
  <td><strong>Expiry Date</strong></td>
  <td>$expiry_date</td>
</tr>
<tr>
  <td><strong>Days Remaining</strong></td>
  <td style='color: $color; font-size: 18px;'><strong>$days_left days</strong></td>
</tr>
</table>
<hr>"

    if [ -n "$error_message" ]; then
        body+="<h3>❌ Error:</h3>
<p style='color: #d9534f;'>$error_message</p>
<hr>"
    fi

    if [ -n "$issuer" ]; then
        body+="<h3>Certificate Details:</h3>
<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>
<tr>
  <td><strong>Issuer</strong></td>
  <td>$issuer</td>
</tr>
<tr>
  <td><strong>Subject</strong></td>
  <td>$subject</td>
</tr>
</table>
<hr>"
    fi

    body+="<h3>Certificate Chain:</h3>
<pre style='background-color: #f5f5f5; padding: 10px; overflow-x: auto;'>$(get_cert_chain "$domain")</pre>
<hr>
<h3>OCSP Status:</h3>
<pre style='background-color: #f5f5f5; padding: 10px;'>$(check_ocsp_status "$domain")</pre>
<hr>
<h3>🔧 Renewal Instructions:</h3>
<ol>
  <li><strong>Let's Encrypt:</strong> Run <code>certbot renew --force-renewal</code></li>
  <li><strong>Manual Renewal:</strong> Generate new CSR and submit to CA</li>
  <li><strong>Verify:</strong> <code>openssl s_client -servername $domain -connect $domain:443 | openssl x509 -noout -dates</code></li>
  <li><strong>Test:</strong> <code>curl -I https://$domain</code></li>
</ol>
<hr>
<h3>⚠️ Thresholds:</h3>
<ul>
  <li><strong>Warning:</strong> $WARNING_DAYS days</li>
  <li><strong>Critical:</strong> $CRITICAL_DAYS days</li>
</ul>
<p><em>This monitor runs daily. Based on <a href='https://github.com/forwardemail/sslmonitor.com'>SSL Monitor</a> by Forward Email.</em></p>
</body></html>"

    send_alert "$subject_line" "$body"
}

# Main execution
main() {
    log_message "=== SSL Certificate Monitor Started ==="

    # Check if WEB_URL is set
    if [ -z "$WEB_URL" ]; then
        log_message "ERROR: WEB_URL environment variable not set"
        exit 1
    fi

    log_message "Monitoring SSL certificate for: $WEB_URL"

    # Extract domain from WEB_URL
    local domain=$(extract_domain "$WEB_URL")

    if [ -z "$domain" ]; then
        log_message "ERROR: Could not extract domain from WEB_URL: $WEB_URL"
        exit 1
    fi

    log_message "Domain extracted: $domain"

    # Check certificate
    local cert_info=$(check_certificate "$domain")

    if [ -z "$cert_info" ]; then
        log_message "ERROR: Failed to check certificate"
        exit 1
    fi

    # Parse status
    local status=$(echo "$cert_info" | cut -d'|' -f4)
    local days_left=$(echo "$cert_info" | cut -d'|' -f3)

    log_message "Certificate status: $status (${days_left} days remaining)"

    # Send alert if needed
    if [ "$status" != "OK" ]; then
        if should_send_alert; then
            send_certificate_alert "$cert_info"
        fi
    else
        log_message "Certificate is valid, no alert needed"
    fi

    log_message "=== SSL Certificate Monitor Completed ==="
}

# Run main function
main
