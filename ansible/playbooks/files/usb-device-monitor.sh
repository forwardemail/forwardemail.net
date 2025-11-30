#!/bin/bash
# USB Device Monitor Script
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# Monitors USB devices for unknown or unauthorized devices
# Sends email alerts when unknown devices are detected
# Usage: Executed by systemd timer every 5 minutes or triggered by udev

set -euo pipefail

# Configuration
HOSTNAME="$(hostname)"
HOST_IP="$(hostname -I | awk '{print $1}')"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
MONITOR_LOG="/var/log/usb-device-monitor.log"
LOCK_DIR="/var/lock"
LOCK_DURATION=3600  # 1 hour between alerts for same device
CONFIG_DIR="/etc/security-monitor"
AUTHORIZED_DEVICES_FILE="$CONFIG_DIR/authorized-usb-devices.conf"

# Ensure directories and files exist
mkdir -p "$CONFIG_DIR"
touch "$MONITOR_LOG" 2>/dev/null || MONITOR_LOG="/tmp/usb-device-monitor.log"
touch "$AUTHORIZED_DEVICES_FILE" 2>/dev/null || true

# Logging function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$MONITOR_LOG"
}

# Check if we should send an alert (rate limiting per device)
should_send_alert() {
    local device_id="$1"
    local lockfile="$LOCK_DIR/usb-monitor-${device_id}.lock"

    if [ -f "$lockfile" ]; then
        lockfile_time=$(stat -c %Y "$lockfile" 2>/dev/null || echo 0)
        current_time=$(date +%s)
        elapsed_time=$((current_time - lockfile_time))

        if [ $elapsed_time -lt $LOCK_DURATION ]; then
            log_message "Rate limit active for device ${device_id} (${elapsed_time}s elapsed)"
            return 1  # Don't send alert
        fi
    fi

    # Create or update lockfile
    touch "$lockfile" 2>/dev/null || true
    return 0  # Send alert
}

# Check if device is authorized
is_authorized_device() {
    local vendor_id="$1"
    local product_id="$2"
    local device_string="${vendor_id}:${product_id}"

    if [ -f "$AUTHORIZED_DEVICES_FILE" ]; then
        grep -qF "$device_string" "$AUTHORIZED_DEVICES_FILE" 2>/dev/null && return 0
    fi
    return 1
}

# Get all currently connected USB devices
get_usb_devices() {
    lsusb 2>/dev/null || echo "lsusb not available"
}

# Get detailed device information
get_device_details() {
    local vendor_id="$1"
    local product_id="$2"

    # Try to get detailed information using udevadm
    local device_path=$(find /sys/bus/usb/devices/ -name "idVendor" -exec grep -l "$vendor_id" {} \; 2>/dev/null | head -1 | xargs dirname 2>/dev/null)

    if [ -n "$device_path" ]; then
        local manufacturer=$(cat "$device_path/manufacturer" 2>/dev/null || echo "Unknown")
        local product=$(cat "$device_path/product" 2>/dev/null || echo "Unknown")
        local serial=$(cat "$device_path/serial" 2>/dev/null || echo "Unknown")

        echo "Manufacturer: $manufacturer"
        echo "Product: $product"
        echo "Serial: $serial"
    else
        echo "Detailed information not available"
    fi
}

# Detect device type
get_device_type() {
    local vendor_id="$1"
    local product_id="$2"

    # Try to determine device class
    local device_path=$(find /sys/bus/usb/devices/ -name "idVendor" -exec grep -l "$vendor_id" {} \; 2>/dev/null | head -1 | xargs dirname 2>/dev/null)

    if [ -n "$device_path" ]; then
        local device_class=$(cat "$device_path/bDeviceClass" 2>/dev/null || echo "00")

        case "$device_class" in
            "08")
                echo "Mass Storage Device"
                ;;
            "02")
                echo "Communication Device"
                ;;
            "03")
                echo "HID Device (Keyboard/Mouse)"
                ;;
            "09")
                echo "Hub"
                ;;
            "0e")
                echo "Video Device"
                ;;
            "01")
                echo "Audio Device"
                ;;
            *)
                echo "USB Device (Class: $device_class)"
                ;;
        esac
    else
        echo "Unknown Device Type"
    fi
}

# Send alert for unknown device
send_unknown_device_alert() {
    local vendor_id="$1"
    local product_id="$2"
    local device_info="$3"

    local device_details=$(get_device_details "$vendor_id" "$product_id")
    local device_type=$(get_device_type "$vendor_id" "$product_id")
    local all_devices=$(get_usb_devices)

    local subject="[SECURITY] USB Device: Unknown ${vendor_id}:${product_id} - $HOSTNAME ($HOST_IP)"

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
        .warning { color: #dc3545; font-weight: bold; }
    </style>
</head>
<body>
    <div class=\"header\">
        <h2>USB Security Alert - Unknown Device Detected</h2>
        <p><strong>Server:</strong> $HOSTNAME</p>
        <p><strong>Time:</strong> $TIMESTAMP</p>
    </div>

    <div class=\"content\">
        <div class=\"metric\">
            <div class=\"metric-title\">Alert Details</div>
            <p><strong>Alert Type:</strong> Unknown USB Device</p>
            <p><strong>Device Type:</strong> $device_type</p>
            <p><strong>Vendor ID:</strong> $vendor_id</p>
            <p><strong>Product ID:</strong> $product_id</p>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Device Information</div>
            <pre>$device_info</pre>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">Device Details</div>
            <pre>$device_details</pre>
        </div>

        <div class=\"metric\">
            <div class=\"metric-title\">All Connected USB Devices</div>
            <pre>$all_devices</pre>
        </div>

        <div class=\"recommendation\">
            <div class=\"metric-title\">Recommended Actions</div>
            <ul>
                <li><strong>IMMEDIATE:</strong> Verify this device connection was authorized</li>
                <li>Physically inspect the server to identify the device</li>
                <li>Check who has physical access to the server</li>
                <li>If device is legitimate, add to authorized list: $AUTHORIZED_DEVICES_FILE</li>
                <li>Format: <code>${vendor_id}:${product_id}</code> (one per line)</li>
                <li>If device is unauthorized, remove it immediately</li>
                <li>Review security camera footage if available</li>
                <li>Consider disabling USB storage via modprobe (already configured)</li>
            </ul>
        </div>"

    if [[ "$device_type" == *"Mass Storage"* ]]; then
        body="${body}
        <div class=\"recommendation\" style=\"border-left-color: #dc3545; background-color: #f8d7da;\">
            <div class=\"metric-title\"><span class=\"warning\">⚠ HIGH RISK WARNING</span></div>
            <p class=\"warning\">This is a USB storage device, which poses a high security risk:</p>
            <ul>
                <li>Can be used to exfiltrate sensitive data</li>
                <li>May contain malware or malicious software</li>
                <li>Could be used to install unauthorized software</li>
                <li>USB storage should be disabled via kernel module (check modprobe configuration)</li>
            </ul>
        </div>"
    fi

    body="${body}
    </div>

    <div class=\"footer\">
        <p>This is an automated alert from the USB device monitoring service.</p>
        <p>Monitor log: $MONITOR_LOG</p>
        <p>Authorized devices: $AUTHORIZED_DEVICES_FILE</p>
    </div>
</body>
</html>"

    # Send email using rate-limited email script
    if [ -x /usr/local/bin/send-rate-limited-email.sh ]; then
        /usr/local/bin/send-rate-limited-email.sh "usb-device-${vendor_id}-${product_id}" "$subject" "$body"
        log_message "Unknown device alert sent: ${vendor_id}:${product_id}"
    else
        echo -e "Subject: $subject\nContent-Type: text/html\n\n$body" | sendmail -t "{{ lookup('env', 'POSTFIX_RCPTS') | default('security@forwardemail.net') }}"
        log_message "Unknown device alert sent via sendmail: ${vendor_id}:${product_id}"
    fi
}

# Main monitoring logic
main() {
    log_message "Starting USB device monitoring check"

    # Get all USB devices
    usb_devices=$(lsusb 2>/dev/null || true)

    if [ -z "$usb_devices" ]; then
        log_message "No USB devices found or lsusb not available"
        exit 0
    fi

    # Parse each device
    echo "$usb_devices" | while IFS= read -r device; do
        # Extract vendor and product IDs
        # Format: Bus 001 Device 002: ID 1234:5678 Device Name
        if [[ $device =~ ID[[:space:]]([0-9a-f]{4}):([0-9a-f]{4}) ]]; then
            vendor_id="${BASH_REMATCH[1]}"
            product_id="${BASH_REMATCH[2]}"

            # Skip USB hubs (they're usually built-in)
            if [[ $device =~ "Hub" ]] || [[ $device =~ "hub" ]]; then
                log_message "Skipping hub device: ${vendor_id}:${product_id}"
                continue
            fi

            # Check if device is authorized
            if ! is_authorized_device "$vendor_id" "$product_id"; then
                log_message "Unknown device detected: ${vendor_id}:${product_id}"

                # Check rate limiting
                device_id="${vendor_id}-${product_id}"
                if should_send_alert "$device_id"; then
                    send_unknown_device_alert "$vendor_id" "$product_id" "$device"
                fi
            else
                log_message "Authorized device: ${vendor_id}:${product_id}"
            fi
        fi
    done

    log_message "USB device monitoring check completed"
}

# Execute main function
main

exit 0
