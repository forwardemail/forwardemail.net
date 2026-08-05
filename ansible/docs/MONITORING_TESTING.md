# Comprehensive Ansible Monitoring Testing Guide

This guide provides complete testing procedures for all **18 monitoring systems** deployed across the Forward Email infrastructure.

---


## Table of Contents

* [Overview](#overview)
  * [Monitoring Systems Deployed](#monitoring-systems-deployed)
* [Prerequisites](#prerequisites)
  * [SSH Access](#ssh-access)
  * [Required Permissions](#required-permissions)
  * [Environment Variables](#environment-variables)
* [Security Playbook Monitoring](#security-playbook-monitoring)
  * [1. System Resource Monitor](#1-system-resource-monitor)
  * [2. SSH Security Monitor (Enhanced)](#2-ssh-security-monitor-enhanced)
  * [3. USB Device Monitor](#3-usb-device-monitor)
  * [4. Root Access Monitor](#4-root-access-monitor)
  * [5. Lynis System Audit Monitor](#5-lynis-system-audit-monitor)
  * [6. Package Installation Monitor](#6-package-installation-monitor)
  * [7. Open Ports Monitor](#7-open-ports-monitor)
  * [8. SSL Certificate Monitor](#8-ssl-certificate-monitor)
* [Node Playbook Monitoring](#node-playbook-monitoring)
  * [PM2 Service Failure Notifications](#pm2-service-failure-notifications)
* [MongoDB Playbook Monitoring](#mongodb-playbook-monitoring)
  * [1. MongoDB Service Failure Notifications](#1-mongodb-service-failure-notifications)
  * [2. MongoDB UFW Whitelist Update Monitoring](#2-mongodb-ufw-whitelist-update-monitoring)
  * [3. MongoDB Backup Monitoring](#3-mongodb-backup-monitoring)
* [Redis Playbook Monitoring](#redis-playbook-monitoring)
  * [1. Valkey/Redis Service Failure Notifications](#1-valkeyredis-service-failure-notifications)
  * [2. Redis UFW Whitelist Update Monitoring](#2-redis-ufw-whitelist-update-monitoring)
  * [3. Redis Backup Monitoring](#3-redis-backup-monitoring)
  * [4. Redis Command Usage Monitoring](#4-redis-command-usage-monitoring)
* [Mail Playbook Monitoring](#mail-playbook-monitoring)
  * [Mail Service and SnappyMail Health Failure Notifications](#mail-service-and-snappymail-health-failure-notifications)
* [Unbound Playbook Monitoring](#unbound-playbook-monitoring)
  * [Unbound DNS Service Failure Notifications](#unbound-dns-service-failure-notifications)
* [Email Notification Testing](#email-notification-testing)
  * [Core Notification Infrastructure](#core-notification-infrastructure)
  * [Testing Email Delivery](#testing-email-delivery)
  * [Validation Checklist](#validation-checklist)
* [Troubleshooting](#troubleshooting)
  * [Common Issues](#common-issues)
* [Complete System Health Check](#complete-system-health-check)
* [Summary](#summary)


## Overview

### Monitoring Systems Deployed

**Security Playbook (security.yml) - 8 systems**

* System Resource Monitor (CPU/Memory/Disk at 75%, 80%, 90%, 95%, 100% thresholds)
* SSH Security Monitor (Enhanced - logs ALL SSH activity: successful/failed logins, logged in users, commands)
* USB Device Monitor (Unknown device detection with whitelisting)
* Root Access Monitor (Sudo, su, and direct root login tracking)
* Lynis System Audit Monitor (Daily security audits with hardening index)
* Package Installation Monitor (Track installations, upgrades, removals)
* Open Ports Monitor (Monitor network ports and detect changes)
* SSL Certificate Monitor (Certificate expiration tracking for WEB\_URL)

**Node Playbook (node.yml)**

* PM2 Service Failure Notifications

**MongoDB Playbook (mongo.yml)**

* MongoDB Service Failure Notifications
* MongoDB UFW Whitelist Update Monitoring
* MongoDB Backup Monitoring

**Redis Playbook (redis.yml)**

* Valkey/Redis Service Failure Notifications
* Redis UFW Whitelist Update Monitoring
* Redis Backup Monitoring
* Redis Command Usage Monitoring (BGSAVE, KEYS)

**Mail Playbook (mail.yml)**

* Mail Service Failure Notifications

**Unbound Playbook (unbound.yml)**

* Unbound DNS Service Failure Notifications

---


## Prerequisites

### SSH Access

```bash
# SSH into your server
ssh devops@<server-hostname>
```

### Required Permissions

* `sudo` access on the target server
* Access to systemd journal logs
* Access to monitoring log files in `/var/log/`

### Environment Variables

Ensure these are set (usually configured via Ansible):

```bash
printf '%s\n' "${ALERT_EMAIL_RECIPIENTS:-security@forwardemail.net}"
```

`MSMTP_RCPTS` is accepted only as a deprecated migration fallback. Every alert sends email. Optional [Twilio](https://github.com/twilio) SMS is sent only by the fleet-wide [systemd](https://github.com/systemd/systemd) `OnFailure` wrapper; set all four of `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, and `TWILIO_TO_NUMBER`, or leave all four unset. Routine monitor alerts are always email-only.

---


## Security Playbook Monitoring

### 1. System Resource Monitor

**Purpose**: Monitors CPU, memory, and disk usage at 75%, 80%, 90%, 95%, 100% thresholds

**Files Deployed**:

* Script: `/usr/local/bin/system-resource-monitor.sh`
* Service: `/etc/systemd/system/system-resource-monitor.service`
* Timer: `/etc/systemd/system/system-resource-monitor.timer`
* Log: `/var/log/system-resource-monitor.log`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status system-resource-monitor.timer

# Expected output: Active: active (waiting)

# 2. Check timer schedule
sudo systemctl list-timers | grep system-resource-monitor

# Expected: Shows next run time (every 5 minutes)

# 3. Manually trigger the monitor
sudo systemctl start system-resource-monitor.service

# 4. Check the log output
sudo tail -f /var/log/system-resource-monitor.log

# Expected: Shows timestamp, CPU%, Memory%, Disk%, and status

# 5. Check service status
sudo systemctl status system-resource-monitor.service

# Expected: Shows recent execution and exit code

# 6. View journal logs
sudo journalctl -u system-resource-monitor.service -n 50

# Expected: Shows execution history
```

**Trigger Alert Test**:

```bash
# Install stress tool
sudo apt-get install -y stress

# Trigger high CPU usage (will send alert if >75%)
stress --cpu 4 --timeout 60s &

# Wait for next timer execution (up to 5 minutes) or manually trigger
sudo systemctl start system-resource-monitor.service

# Check for email alert
sudo tail -f /var/log/mail.log
sudo journalctl -u system-resource-monitor.service -n 20
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] Service executes without errors
* [ ] Log file is being written to
* [ ] High CPU/memory/disk triggers email alert
* [ ] Rate limiting prevents alert spam

---

### 2. SSH Security Monitor (Enhanced)

**Purpose**: Monitors ALL SSH activity including successful logins, failed attempts, logged in users, and commands executed

**Files Deployed**:

* Script: `/usr/local/bin/ssh-security-monitor.sh`
* Service: `/etc/systemd/system/ssh-security-monitor.service`
* Timer: `/etc/systemd/system/ssh-security-monitor.timer`
* Log: `/var/log/ssh-security-monitor.log`
* Activity Log: `/var/log/ssh-activity.log` (logs ALL SSH activity)
* Whitelist: `/etc/security-monitor/authorized-ips.conf`
* Whitelist: `/etc/security-monitor/authorized-users.conf`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status ssh-security-monitor.timer

# Expected: Active: active (waiting)

# 2. Check timer schedule
sudo systemctl list-timers | grep ssh-security-monitor

# Expected: Shows next run time (every 10 minutes)

# 3. Manually trigger the monitor
sudo systemctl start ssh-security-monitor.service

# 4. Check the monitoring log output
sudo tail -f /var/log/ssh-security-monitor.log

# Expected: Shows SSH monitoring status

# 5. Check the activity log (logs ALL SSH activity)
sudo tail -f /var/log/ssh-activity.log

# Expected: Shows successful logins, failed attempts, sudo commands

# 6. View authorized IPs whitelist
sudo cat /etc/security-monitor/authorized-ips.conf

# 7. View authorized users whitelist
sudo cat /etc/security-monitor/authorized-users.conf

# 8. Check recent SSH authentication attempts
sudo journalctl -u ssh.service -n 100 | grep -i "failed\|accepted"

# 9. Check currently logged in users
who

# 10. Check recent sudo commands
sudo journalctl -n 100 | grep sudo
```

**Trigger Alert Test**:

```bash
# Test 1: Successful login logging
ssh valid_user@localhost

# Check activity log for successful login
sudo grep "SUCCESSFUL LOGIN" /var/log/ssh-activity.log

# Test 2: Failed login detection
# From another machine, attempt failed SSH logins (5+ times)
ssh invalid_user@localhost  # Repeat 5+ times

# Check for failed login detection
sudo grep "FAILED LOGINS" /var/log/ssh-activity.log

# Test 3: Root SSH access (immediate alert, no rate limiting)
# (Only if root login is enabled for testing)
ssh root@localhost

# Check for immediate root access alert
sudo grep "ROOT SSH ACCESS" /var/log/ssh-activity.log

# Test 4: Sudo command logging
sudo ls /root

# Check for sudo command logging
sudo grep "SUDO COMMANDS" /var/log/ssh-activity.log

# Trigger monitoring to send alerts
sudo systemctl start ssh-security-monitor.service

# Check for alerts
sudo tail -f /var/log/ssh-security-monitor.log
sudo tail -f /var/log/mail.log
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] Service executes without errors
* [ ] Monitoring log shows status
* [ ] Activity log shows ALL SSH activity
* [ ] Successful logins are logged
* [ ] Failed login attempts are detected
* [ ] Currently logged in users are tracked
* [ ] Sudo commands are logged
* [ ] Root SSH access triggers immediate alert (no rate limiting)
* [ ] Failed login alerts sent after threshold
* [ ] Hourly activity summaries sent
* [ ] Unknown IPs are detected
* [ ] Whitelisted IPs/users don't trigger alerts

---

### 3. USB Device Monitor

**Purpose**: Detects unknown USB devices plugged into the server

**Files Deployed**:

* Script: `/usr/local/bin/usb-device-monitor.sh`
* Service: `/etc/systemd/system/usb-device-monitor.service`
* Timer: `/etc/systemd/system/usb-device-monitor.timer`
* udev Rules: `/etc/udev/rules.d/99-usb-monitor.rules`
* Log: `/var/log/usb-device-monitor.log`
* Whitelist: `/etc/security-monitor/authorized-usb-devices.conf`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status usb-device-monitor.timer

# Expected: Active: active (waiting)

# 2. Check udev rules are loaded
sudo udevadm control --reload-rules
sudo udevadm trigger

# 3. List currently connected USB devices
lsusb

# Expected: Shows vendor:product IDs

# 4. Manually trigger the monitor
sudo systemctl start usb-device-monitor.service

# 5. Check the log output
sudo tail -f /var/log/usb-device-monitor.log

# 6. View authorized USB devices whitelist
sudo cat /etc/security-monitor/authorized-usb-devices.conf

# Format: vendorID:productID (e.g., 046d:c52b)
```

**Trigger Alert Test**:

```bash
# 1. Plug in a USB device (if server has USB ports)

# 2. Check if real-time udev alert was triggered
sudo journalctl -u usb-device-monitor.service -n 20

# 3. Or wait for periodic check (every 5 minutes)
sudo systemctl start usb-device-monitor.service

# 4. Check for alert
sudo tail -f /var/log/usb-device-monitor.log
sudo tail -f /var/log/mail.log

# 5. Add device to whitelist to prevent future alerts
# Get vendor:product ID from lsusb output
lsusb
# Add to whitelist
echo "046d:c52b" | sudo tee -a /etc/security-monitor/authorized-usb-devices.conf
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] udev rules are loaded
* [ ] Service executes without errors
* [ ] Currently connected USB devices are detected
* [ ] New USB device triggers real-time alert (via udev)
* [ ] Periodic checks work (every 5 minutes)
* [ ] Whitelisted devices don't trigger alerts

---

### 4. Root Access Monitor

**Purpose**: Monitors sudo, su, and direct root login attempts

**Files Deployed**:

* Script: `/usr/local/bin/root-access-monitor.sh`
* Service: `/etc/systemd/system/root-access-monitor.service`
* Timer: `/etc/systemd/system/root-access-monitor.timer`
* Log: `/var/log/root-access-monitor.log`
* Whitelist: `/etc/security-monitor/authorized-root-users.conf`
* Whitelist: `/etc/security-monitor/authorized-sudo-users.conf`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status root-access-monitor.timer

# Expected: Active: active (waiting)

# 2. Check timer schedule
sudo systemctl list-timers | grep root-access-monitor

# Expected: Shows next run time (every 5 minutes)

# 3. Manually trigger the monitor
sudo systemctl start root-access-monitor.service

# 4. Check the log output
sudo tail -f /var/log/root-access-monitor.log

# 5. View authorized root users whitelist
sudo cat /etc/security-monitor/authorized-root-users.conf

# 6. View authorized sudo users whitelist
sudo cat /etc/security-monitor/authorized-sudo-users.conf

# 7. Check recent sudo/su activity
sudo journalctl -n 100 | grep -E "sudo|su\[|su:"
```

**Trigger Alert Test**:

```bash
# 1. Execute sudo command (will be logged)
sudo ls /root

# 2. Wait for next timer execution or manually trigger
sudo systemctl start root-access-monitor.service

# 3. Check for alert (if your user is not whitelisted)
sudo tail -f /var/log/root-access-monitor.log
sudo tail -f /var/log/mail.log

# 4. Add your user to whitelist to prevent alerts
echo "$(whoami)" | sudo tee -a /etc/security-monitor/authorized-sudo-users.conf

# 5. Test again - should not trigger alert
sudo ls /root
sudo systemctl start root-access-monitor.service
sudo tail -f /var/log/root-access-monitor.log
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] Service executes without errors
* [ ] Log file shows root access activity
* [ ] Sudo commands are detected
* [ ] Su commands are detected
* [ ] Direct root logins are detected
* [ ] Whitelisted users don't trigger alerts
* [ ] Non-whitelisted users trigger alerts

---

### 5. Lynis System Audit Monitor

**Purpose**: Run daily security audits using [Lynis](https://github.com/CISOfy/lynis) and report findings

**Files Deployed**:

* Script: `/usr/local/bin/lynis-audit-monitor.sh`
* Service: `/etc/systemd/system/lynis-audit-monitor.service`
* Timer: `/etc/systemd/system/lynis-audit-monitor.timer`
* Log: `/var/log/lynis-audit-monitor.log`
* Lynis Report: `/var/log/lynis-report.dat`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status lynis-audit-monitor.timer

# Expected: Active: active (waiting)

# 2. Check timer schedule
sudo systemctl list-timers | grep lynis-audit-monitor

# Expected: Shows next run time (daily)

# 3. Manually trigger the audit
sudo systemctl start lynis-audit-monitor.service

# 4. Check the log output
sudo tail -f /var/log/lynis-audit-monitor.log

# Expected: Shows audit progress and results

# 5. View Lynis report
sudo cat /var/log/lynis-report.dat

# 6. Check hardening index
sudo grep "hardening_index=" /var/log/lynis-report.dat

# Expected: Shows score 0-100

# 7. Check if Lynis is installed
which lynis

# Expected: /usr/local/lynis/lynis or similar
```

**Trigger Alert Test**:

```bash
# Run manual Lynis audit
sudo lynis audit system --quick

# Wait for next timer execution or manually trigger
sudo systemctl start lynis-audit-monitor.service

# Check for email alert
sudo tail -f /var/log/mail.log
sudo journalctl -u lynis-audit-monitor.service -n 20
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] Service executes without errors
* [ ] Lynis is installed (auto-installed if missing)
* [ ] Audit runs successfully
* [ ] Hardening index is calculated
* [ ] Warnings and suggestions are reported
* [ ] Vulnerable packages are identified
* [ ] Email alert is sent daily

---

### 6. Package Installation Monitor

**Purpose**: Track package installations, upgrades, and removals

**Files Deployed**:

* Script: `/usr/local/bin/package-monitor.sh`
* Service: `/etc/systemd/system/package-monitor.service`
* Timer: `/etc/systemd/system/package-monitor.timer`
* Log: `/var/log/package-monitor.log`
* State File: `/var/lib/package-monitor/package-state.txt`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status package-monitor.timer

# Expected: Active: active (waiting)

# 2. Check timer schedule
sudo systemctl list-timers | grep package-monitor

# Expected: Shows next run time (hourly)

# 3. Manually trigger the monitor
sudo systemctl start package-monitor.service

# 4. Check the log output
sudo tail -f /var/log/package-monitor.log

# Expected: Shows package monitoring status

# 5. View current package state
sudo cat /var/lib/package-monitor/package-state.txt | head -20

# Expected: Shows list of installed packages

# 6. Check state directory exists
ls -la /var/lib/package-monitor/

# Expected: Shows package-state.txt file
```

**Trigger Alert Test**:

```bash
# Install a test package
sudo apt-get install -y htop

# Wait for next timer execution or manually trigger
sudo systemctl start package-monitor.service

# Check for package change detection
sudo grep "Package changes detected" /var/log/package-monitor.log

# Check for email alert
sudo tail -f /var/log/mail.log

# Remove the test package
sudo apt-get remove -y htop

# Trigger monitoring again
sudo systemctl start package-monitor.service

# Check for removal detection
sudo grep "removed" /var/log/package-monitor.log
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] Service executes without errors
* [ ] Package state file is created
* [ ] Installations are detected
* [ ] Upgrades are detected
* [ ] Removals are detected
* [ ] Email alerts are sent for changes

---

### 7. Open Ports Monitor

**Purpose**: Monitor open network ports and detect new or closed ports

**Files Deployed**:

* Script: `/usr/local/bin/open-ports-monitor.sh`
* Service: `/etc/systemd/system/open-ports-monitor.service`
* Timer: `/etc/systemd/system/open-ports-monitor.timer`
* Log: `/var/log/open-ports-monitor.log`
* State File: `/var/lib/open-ports-monitor/ports-state.txt`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status open-ports-monitor.timer

# Expected: Active: active (waiting)

# 2. Check timer schedule
sudo systemctl list-timers | grep open-ports-monitor

# Expected: Shows next run time (hourly)

# 3. Manually trigger the monitor
sudo systemctl start open-ports-monitor.service

# 4. Check the log output
sudo tail -f /var/log/open-ports-monitor.log

# Expected: Shows port monitoring status

# 5. View current open ports
sudo ss -tuln | grep LISTEN

# Expected: Shows listening ports

# 6. View monitored ports state
sudo cat /var/lib/open-ports-monitor/ports-state.txt

# Expected: Shows list of open ports

# 7. Check state directory exists
ls -la /var/lib/open-ports-monitor/

# Expected: Shows ports-state.txt file
```

**Trigger Alert Test**:

```bash
# Start a test service on a new port
python3 -m http.server 8888 &

# Note the process ID
echo $!

# Wait for next timer execution or manually trigger
sudo systemctl start open-ports-monitor.service

# Check for new port detection
sudo grep "Port changes detected" /var/log/open-ports-monitor.log
sudo grep "8888" /var/log/open-ports-monitor.log

# Check for email alert
sudo tail -f /var/log/mail.log

# Stop the test service
pkill -f "http.server 8888"

# Trigger monitoring again
sudo systemctl start open-ports-monitor.service

# Check for closed port detection
sudo grep "closed" /var/log/open-ports-monitor.log
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] Service executes without errors
* [ ] Ports state file is created
* [ ] Open ports are tracked
* [ ] New ports are detected
* [ ] Closed ports are detected
* [ ] Process information is included
* [ ] Firewall status is checked
* [ ] Email alerts are sent for changes

---

### 8. SSL Certificate Monitor

**Purpose**: Monitor SSL certificate expiration for WEB\_URL environment variable

**Files Deployed**:

* Script: `/usr/local/bin/ssl-certificate-monitor.sh`
* Service: `/etc/systemd/system/ssl-certificate-monitor.service`
* Timer: `/etc/systemd/system/ssl-certificate-monitor.timer`
* Log: `/var/log/ssl-certificate-monitor.log`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status ssl-certificate-monitor.timer

# Expected: Active: active (waiting)

# 2. Check timer schedule
sudo systemctl list-timers | grep ssl-certificate-monitor

# Expected: Shows next run time (daily)

# 3. Check WEB_URL environment variable
echo $WEB_URL

# Expected: Shows URL (e.g., https://forwardemail.net)

# 4. Manually trigger the monitor
sudo systemctl start ssl-certificate-monitor.service

# 5. Check the log output
sudo tail -f /var/log/ssl-certificate-monitor.log

# Expected: Shows certificate status

# 6. Check certificate manually
echo | openssl s_client -servername forwardemail.net -connect forwardemail.net:443 2>/dev/null | openssl x509 -noout -dates

# Expected: Shows certificate validity dates

# 7. View service logs
sudo journalctl -u ssl-certificate-monitor.service -n 50
```

**Trigger Alert Test**:

```bash
# Set WEB_URL if not set
export WEB_URL=https://forwardemail.net

# Run monitoring with explicit WEB_URL
sudo WEB_URL=https://forwardemail.net systemctl start ssl-certificate-monitor.service

# Check for certificate status in logs
sudo grep "Certificate status" /var/log/ssl-certificate-monitor.log

# Check for days remaining
sudo grep "days remaining" /var/log/ssl-certificate-monitor.log

# Check for email alert (if certificate is expiring soon)
sudo tail -f /var/log/mail.log

# Test with a different URL (optional)
sudo WEB_URL=https://expired.badssl.com systemctl start ssl-certificate-monitor.service

# Check for expiration alert
sudo grep "CRITICAL\|WARNING" /var/log/ssl-certificate-monitor.log
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] Service executes without errors
* [ ] WEB\_URL environment variable is read
* [ ] Certificate expiration is checked
* [ ] Days remaining is calculated
* [ ] Warning alerts sent (< 30 days)
* [ ] Critical alerts sent (< 7 days)
* [ ] Certificate chain information included
* [ ] OCSP status checked

---

---


## Node Playbook Monitoring

### PM2 Service Failure Notifications

**Purpose**: Sends email and, when Twilio is configured, SMS when the PM2 systemd service fails

**Files Deployed**:

* Override: `/etc/systemd/system/pm2-deploy.service.d/failure-notification.conf`

**Testing Commands**:

```bash
# 1. Check PM2 service status
sudo systemctl status pm2-deploy.service

# Expected: Active: active (running)

# 2. Verify OnFailure is configured
sudo cat /etc/systemd/system/pm2-deploy.service.d/failure-notification.conf

# Expected: Shows OnFailure=failure-notification@%n.service

# 3. Check PM2 is running
sudo -u deploy pm2 list

# Expected: Shows running PM2 processes

# 4. View PM2 service logs
sudo journalctl -u pm2-deploy.service -n 50
```

**Safe Trigger Test**:

Do not stop PM2 to test notifications. An intentional `systemctl stop` is a clean transition and does not exercise `OnFailure`. Run the failed transient-unit procedure in [Core Notification Infrastructure](#core-notification-infrastructure), then verify PM2 inherits the hook:

```bash
sudo systemctl cat pm2-deploy.service | grep -F 'OnFailure='
sudo journalctl -t forwardemail-alert -n 100 --no-pager
```

The synthetic failure must send email. When Twilio is configured, it must also send one diagnostics-rich SMS from the systemd wrapper.

**Validation Checklist**:

* [ ] PM2 service is active and running
* [ ] OnFailure override is configured
* [ ] Service failure triggers notification
* [ ] Email alert is sent
* [ ] Optional Twilio SMS is sent only by the systemd failure wrapper
* [ ] Service can be restarted successfully

---


## MongoDB Playbook Monitoring

### 1. MongoDB Service Failure Notifications

**Purpose**: Sends email and, when Twilio is configured, SMS when the MongoDB systemd service fails

**Files Deployed**:

* Override: `/etc/systemd/system/mongod.service.d/failure-notification.conf`

**Testing Commands**:

```bash
# 1. Check MongoDB service status
sudo systemctl status mongod.service

# Expected: Active: active (running)

# 2. Verify OnFailure is configured
sudo cat /etc/systemd/system/mongod.service.d/failure-notification.conf

# Expected: Shows OnFailure=failure-notification@%n.service

# 3. Check MongoDB is responding
mongo --eval "db.adminCommand('ping')"

# Expected: { ok: 1 }

# 4. View MongoDB service logs
sudo journalctl -u mongod.service -n 50
```

**Safe Trigger Test**:

Do not stop MongoDB to test notifications. Run the failed transient-unit procedure in [Core Notification Infrastructure](#core-notification-infrastructure), then verify MongoDB inherits the hook without disrupting production:

```bash
sudo systemctl cat mongod.service | grep -F 'OnFailure='
sudo journalctl -t forwardemail-alert -n 100 --no-pager
```

The synthetic failure must send email. When Twilio is configured, it must also send one diagnostics-rich SMS from the systemd wrapper.

**Validation Checklist**:

* [ ] MongoDB service is active and running
* [ ] OnFailure override is configured
* [ ] Service failure triggers notification
* [ ] Email alert is sent
* [ ] Optional Twilio SMS is sent only by the systemd failure wrapper
* [ ] Service can be restarted successfully

---

### 2. MongoDB UFW Whitelist Update Monitoring

**Purpose**: Monitors the MongoDB UFW whitelist update service

**Files Deployed**:

* Service: `/etc/systemd/system/update-mongo-ufw-whitelist.service`
* Timer: `/etc/systemd/system/update-mongo-ufw-whitelist.timer`
* Script: `/usr/local/bin/update-mongo-ufw-whitelist.sh`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status update-mongo-ufw-whitelist.timer

# Expected: Active: active (waiting)

# 2. Check timer schedule
sudo systemctl list-timers | grep update-mongo-ufw-whitelist

# 3. Manually trigger the update
sudo systemctl start update-mongo-ufw-whitelist.service

# 4. Check service status
sudo systemctl status update-mongo-ufw-whitelist.service

# Expected: Shows successful execution

# 5. View UFW rules for MongoDB
sudo ufw status numbered | grep 27017

# Expected: Shows MongoDB port rules

# 6. View service logs
sudo journalctl -u update-mongo-ufw-whitelist.service -n 50
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] Service executes successfully
* [ ] UFW rules are updated
* [ ] Service failure triggers notification

---

### 3. MongoDB Backup Monitoring

**Purpose**: Monitors MongoDB backup to Cloudflare R2

**Files Deployed**:

* Service: `/etc/systemd/system/mongo-backup.service`
* Timer: `/etc/systemd/system/mongo-backup.timer`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status mongo-backup.timer

# Expected: Active: active (waiting)

# 2. Check timer schedule
sudo systemctl list-timers | grep mongo-backup

# Expected: Shows next backup time

# 3. Manually trigger backup
sudo systemctl start mongo-backup.service

# 4. Check backup status
sudo systemctl status mongo-backup.service

# Expected: Shows successful execution (may take time)

# 5. View backup logs
sudo journalctl -u mongo-backup.service -n 100

# Expected: Shows backup progress and completion
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] Backup service executes successfully
* [ ] Backup completes without errors
* [ ] Service failure triggers notification

---


## Redis Playbook Monitoring

### 1. Valkey/Redis Service Failure Notifications

**Purpose**: Sends email and, when Twilio is configured, SMS when the Redis/Valkey systemd service fails

**Files Deployed**:

* Service: `/etc/systemd/system/valkey-server.service` (with OnFailure)

**Testing Commands**:

```bash
# 1. Check Redis/Valkey service status
sudo systemctl status valkey-server.service

# Expected: Active: active (running)

# 2. Verify OnFailure is configured
sudo systemctl cat valkey-server.service | grep OnFailure

# Expected: Shows OnFailure=failure-notification@%n.service

# 3. Check Redis is responding
redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD ping

# Expected: PONG

# 4. View Redis service logs
sudo journalctl -u valkey-server.service -n 50
```

**Safe Trigger Test**:

Do not stop Redis/Valkey to test notifications. Run the failed transient-unit procedure in [Core Notification Infrastructure](#core-notification-infrastructure), then verify the service inherits the hook:

```bash
sudo systemctl cat valkey-server.service | grep -F 'OnFailure='
sudo journalctl -t forwardemail-alert -n 100 --no-pager
```

The synthetic failure must send email. When Twilio is configured, it must also send one diagnostics-rich SMS from the systemd wrapper.

**Validation Checklist**:

* [ ] Redis service is active and running
* [ ] OnFailure is configured
* [ ] Service failure triggers notification
* [ ] Email alert is sent
* [ ] Optional Twilio SMS is sent only by the systemd failure wrapper
* [ ] Service can be restarted successfully

---

### 2. Redis UFW Whitelist Update Monitoring

**Purpose**: Monitors the Redis UFW whitelist update service

**Files Deployed**:

* Service: `/etc/systemd/system/update-redis-ufw-whitelist.service`
* Timer: `/etc/systemd/system/update-redis-ufw-whitelist.timer`
* Script: `/usr/local/bin/update-redis-ufw-whitelist.sh`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status update-redis-ufw-whitelist.timer

# Expected: Active: active (waiting)

# 2. Check timer schedule
sudo systemctl list-timers | grep update-redis-ufw-whitelist

# 3. Manually trigger the update
sudo systemctl start update-redis-ufw-whitelist.service

# 4. Check service status
sudo systemctl status update-redis-ufw-whitelist.service

# Expected: Shows successful execution

# 5. View UFW rules for Redis
sudo ufw status numbered | grep 6379

# Expected: Shows Redis port rules

# 6. View service logs
sudo journalctl -u update-redis-ufw-whitelist.service -n 50
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] Service executes successfully
* [ ] UFW rules are updated
* [ ] Service failure triggers notification

---

### 3. Redis Backup Monitoring

**Purpose**: Monitors Redis backup to Cloudflare R2

**Files Deployed**:

* Service: `/etc/systemd/system/redis-backup.service`
* Timer: `/etc/systemd/system/redis-backup.timer`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status redis-backup.timer

# Expected: Active: active (waiting)

# 2. Check timer schedule
sudo systemctl list-timers | grep redis-backup

# Expected: Shows next backup time

# 3. Manually trigger backup
sudo systemctl start redis-backup.service

# 4. Check backup status
sudo systemctl status redis-backup.service

# Expected: Shows successful execution

# 5. View backup logs
sudo journalctl -u redis-backup.service -n 100

# Expected: Shows backup progress and completion
```

**Validation Checklist**:

* [ ] Timer is active and enabled
* [ ] Backup service executes successfully
* [ ] Backup completes without errors
* [ ] Service failure triggers notification

---

### 4. Redis Command Usage Monitoring

**Purpose**: Monitors dangerous Redis commands (BGSAVE, KEYS)

**Files Deployed**:

* Service: `/etc/systemd/system/redis-command-monitor.service`
* Timer: `/etc/systemd/system/redis-command-monitor.timer`
* Script: `/usr/local/bin/monitor-redis-commands.sh`

**Testing Commands**:

```bash
# 1. Check timer is active
sudo systemctl status redis-command-monitor.timer

# Expected: Active: active (waiting)

# 2. Check timer schedule (runs every hour)
sudo systemctl list-timers | grep redis-command-monitor

# Expected: Shows next run time (hourly)

# 3. Manually trigger the monitor
sudo systemctl start redis-command-monitor.service

# 4. Check service status
sudo systemctl status redis-command-monitor.service

# Expected: Shows execution status

# 5. View monitor logs
sudo journalctl -u redis-command-monitor.service -n 50

# Expected: Shows command usage statistics
```

**Trigger Alert Test**:

```bash
# 1. Execute a monitored command (KEYS)
redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD KEYS "*"

# WARNING: KEYS command is dangerous in production!

# 2. Trigger the monitor
sudo systemctl start redis-command-monitor.service

# 3. Check for alert
sudo journalctl -u redis-command-monitor.service -n 20
sudo tail -f /var/log/mail.log

# Expected: Alert if KEYS or BGSAVE usage detected
```

**Validation Checklist**:

* [ ] Timer is active and enabled (hourly)
* [ ] Service executes successfully
* [ ] Dangerous commands are detected
* [ ] Alerts are sent when commands are used
* [ ] Service failure triggers notification

---


## Mail Playbook Monitoring

### Mail Service and SnappyMail Health Failure Notifications

**Purpose**: Sends routine email-only alerts for SnappyMail health findings and, when Twilio is configured, adds SMS only when a mail-host systemd unit genuinely fails. The five-minute SnappyMail probe attempts to recover PHP-FPM or Nginx, includes recovery and local HTTP findings in one routine email, and exits successfully after that email queues. Only monitor execution or email-queue faults fail the health unit.

**Files Deployed**:

* Fleet drop-in: `/etc/systemd/system/service.d/forwardemail-failure-notification.conf`
* Health service: `/etc/systemd/system/snappymail-health-check.service`
* Health timer: `/etc/systemd/system/snappymail-health-check.timer`

**Testing Commands**:

```bash
# 1. Check mail-host services and the SnappyMail timer
sudo systemctl status postfix.service nginx.service php8.2-fpm.service
sudo systemctl status snappymail-health-check.timer
sudo systemctl list-timers snappymail-health-check.timer

# 2. Verify the five-minute schedule and inherited failure hook
sudo systemctl cat snappymail-health-check.timer
sudo systemctl cat snappymail-health-check.service | grep -F 'OnFailure='

# 3. Run the health probe without stopping a production dependency
sudo systemctl start snappymail-health-check.service
sudo systemctl show snappymail-health-check.service -p Result -p ExecMainStatus
sudo journalctl -u snappymail-health-check.service -n 50 --no-pager

# 4. Exercise notification delivery with the safe failed transient unit from
# Core Notification Infrastructure; do not stop Nginx, PHP-FPM, or Postfix.
```

**Validation Checklist**:

* [ ] Postfix, Nginx, and PHP-FPM are active
* [ ] The SnappyMail timer is enabled and scheduled every five minutes
* [ ] The health service succeeds silently when PHP-FPM, Nginx, and the local HTTP endpoint are healthy
* [ ] A service-recovery or HTTP finding queues one routine email and leaves the health unit successful
* [ ] A failed routine-email queue leaves the health unit failed for retry visibility
* [ ] The health service inherits `failure-notification@%n.service`
* [ ] A genuine health-service execution or queueing failure triggers email and optional systemd-only SMS

---


## Unbound Playbook Monitoring

### Unbound DNS Service Failure Notifications

**Purpose**: Sends email and, when Twilio is configured, SMS when the Unbound systemd service fails

**Files Deployed**:

* Override: `/etc/systemd/system/unbound.service.d/failure-notification.conf`

**Testing Commands**:

```bash
# 1. Check Unbound service status
sudo systemctl status unbound.service

# Expected: Active: active (running)

# 2. Verify OnFailure is configured
sudo cat /etc/systemd/system/unbound.service.d/failure-notification.conf

# Expected: Shows OnFailure=failure-notification@%n.service

# 3. Test DNS resolution
dig @127.0.0.1 google.com

# Expected: Shows successful DNS resolution

# 4. View Unbound service logs
sudo journalctl -u unbound.service -n 50
```

**Safe Trigger Test**:

Do not stop Unbound to test notifications. Run the failed transient-unit procedure in [Core Notification Infrastructure](#core-notification-infrastructure), then verify Unbound inherits the hook:

```bash
sudo systemctl cat unbound.service | grep -F 'OnFailure='
sudo journalctl -t forwardemail-alert -n 100 --no-pager
```

The synthetic failure must send email. When Twilio is configured, it must also send one diagnostics-rich SMS from the systemd wrapper.

**Validation Checklist**:

* [ ] Unbound service is active and running
* [ ] OnFailure override is configured
* [ ] Service failure triggers notification
* [ ] Email alert is sent
* [ ] Optional Twilio SMS is sent only by the systemd failure wrapper
* [ ] Service can be restarted successfully

---


## Email Notification Testing

### Core Notification Infrastructure

**Files Deployed** (via security.yml):

* Template Service: `/etc/systemd/system/failure-notification@.service`
* Script: `/usr/local/bin/send-failure-notification.sh`
* Email-Only Rate-Limited Script: `/usr/local/bin/send-rate-limited-email.sh`
* Root-Only Twilio Environment: `/etc/forwardemail-alerts/twilio.env` (only when configured)
* Independent Cooldown State: `/var/lib/forwardemail-alerts`

The shared sender is the email path for every alert and contains no Twilio delivery code. Only `send-failure-notification.sh`, invoked by systemd `OnFailure`, may read the Twilio environment and send SMS. Routine monitors commit their local cooldowns, event cursors, and package baselines only after required email is accepted; a queue or state-commit failure leaves the finding retryable and fails the monitor unit so the infrastructure fault is visible.

### Testing Email Delivery

```bash
# 1. Validate configuration and root-only submission
sudo postfix check
sudo postconf -h master_service_disable   # Expected: inet
sudo postconf -h authorized_submit_users  # Expected: root
sudo postconf -h relayhost                # Expected: empty

# 2. Prove that Postfix owns no TCP listening socket
if sudo ss -H -ltnp | grep -Eq 'users:\(\("(master|smtpd|postscreen|smtp-sink)"'; then
  echo "FAIL: Postfix has a TCP listener" >&2
  exit 1
fi

# 3. Test the shared routine-monitor path; this sends email only
sudo /usr/local/bin/send-rate-limited-email.sh \
  monitoring-test \
  "Monitoring test" \
  "Test from $(hostname)"

# 4. Inspect the local retry queue, delivery log, and email cooldown
sudo postqueue -p
sudo journalctl -u postfix -n 100 --no-pager
sudo cat /var/lib/forwardemail-alerts/monitoring-test.json

# 5. Safely create a failed transient unit.  Do not stop a production service:
# an intentional systemctl stop is clean and does not exercise OnFailure.
sudo systemd-run --unit=forwardemail-notification-test \
  --property=Type=oneshot /bin/false
sleep 3

# 6. Confirm that the global OnFailure hook invoked the wrapper
sudo journalctl \
  -u failure-notification@forwardemail-notification-test.service.service \
  -n 50 --no-pager

# 7. Confirm email and, only when configured, the independent SMS result
sudo journalctl -u postfix -n 100 --no-pager
sudo journalctl -t forwardemail-alert -n 100 --no-pager | \
  grep 'key=forwardemail-notification-test'
sudo cat /var/lib/forwardemail-alerts/forwardemail-notification-test.json
sudo test ! -r /etc/forwardemail-alerts/twilio.env || \
  sudo cat /var/lib/forwardemail-alerts/systemd-sms-forwardemail-notification-test.json

# 8. Remove the transient failed unit from systemd's failed-unit list
sudo systemctl reset-failed forwardemail-notification-test.service
```

### Validation Checklist

* [ ] `postfix check` succeeds
* [ ] `master_service_disable` is `inet`
* [ ] `authorized_submit_users` is `root`
* [ ] `relayhost` is empty
* [ ] Postfix owns no TCP listening socket
* [ ] Envelope-sender and HELO SPF preflights return pass
* [ ] Routine test alerts are delivered by email and do not attempt SMS
* [ ] Postfix logs show successful direct-MX delivery
* [ ] Successful-email rate limiting works
* [ ] Monitor cooldowns, cursors, and package baselines advance only after email queue acceptance
* [ ] A sender or state-commit failure leaves the finding retryable and fails the monitor unit
* [ ] A failed transient systemd unit invokes `failure-notification@.service`
* [ ] Failure email contains bounded status and journal diagnostics
* [ ] When Twilio is configured, failure SMS contains unit, result, and journal context
* [ ] Email and systemd-failure SMS cooldown states are independent
* [ ] All monitoring services can queue email alerts

---


## Troubleshooting

### Common Issues

#### 1. Timer Not Running

```bash
# Check if timer is enabled
sudo systemctl is-enabled <timer-name>

# Enable timer
sudo systemctl enable <timer-name>

# Start timer
sudo systemctl start <timer-name>

# Reload systemd daemon
sudo systemctl daemon-reload
```

#### 2. Service Failing

```bash
# Check service status
sudo systemctl status <service-name>

# View detailed logs
sudo journalctl -u <service-name> -n 100 --no-pager

# Check script syntax
bash -n /usr/local/bin/<script-name>.sh

# Run script manually with debug
sudo bash -x /usr/local/bin/<script-name>.sh
```

#### 3. No Email Alerts

```bash
# Validate the locked-down runtime
sudo postfix check
sudo postconf -h master_service_disable
sudo postconf -h authorized_submit_users
sudo postconf -h relayhost
sudo ss -H -ltnp | grep -E 'master|smtpd|postscreen|smtp-sink'

# Inspect queue and delivery logs
sudo postqueue -p
sudo journalctl -u postfix -n 100 --no-pager

# Confirm recipients and rate-limit state
printf '%s\n' "${ALERT_EMAIL_RECIPIENTS:-security@forwardemail.net}"
sudo ls -la /var/lib/forwardemail-alerts

# Test the production sender path
sudo /usr/local/bin/send-rate-limited-email.sh \
  monitoring-test \
  "Monitoring test" \
  "Test from $(hostname)"
```

`master_service_disable` must be `inet`; `authorized_submit_users` must be `root`; `relayhost` and the `ss`/`grep` output must be empty. If delivery still fails, re-run both SPF commands from the [monitoring guide](./MONITORING.md#no-alerts-received).

#### 4. Permission Errors

```bash
# Check script permissions
ls -la /usr/local/bin/*monitor*.sh

# Expected: -rwxr-xr-x (executable)

# Fix permissions
sudo chmod +x /usr/local/bin/<script-name>.sh

# Check log file permissions
ls -la /var/log/*monitor*.log

# Fix log permissions
sudo chmod 644 /var/log/<log-file>.log
```

#### 5. Configuration Issues

```bash
# Check whitelist files exist
ls -la /etc/security-monitor/

# Expected: Shows all whitelist .conf files

# Create missing whitelist files
sudo mkdir -p /etc/security-monitor
sudo touch /etc/security-monitor/authorized-ips.conf
sudo touch /etc/security-monitor/authorized-users.conf
sudo touch /etc/security-monitor/authorized-usb-devices.conf
sudo touch /etc/security-monitor/authorized-root-users.conf
sudo touch /etc/security-monitor/authorized-sudo-users.conf

# Set proper permissions
sudo chmod 644 /etc/security-monitor/*.conf
```

---


## Complete System Health Check

Run this comprehensive check to verify all monitoring systems:

```bash
#!/bin/bash
# Complete Monitoring Health Check

echo "=== SECURITY MONITORING ==="
sudo systemctl status system-resource-monitor.timer
sudo systemctl status ssh-security-monitor.timer
sudo systemctl status usb-device-monitor.timer
sudo systemctl status root-access-monitor.timer
sudo systemctl status lynis-audit-monitor.timer
sudo systemctl status package-monitor.timer
sudo systemctl status open-ports-monitor.timer
sudo systemctl status ssl-certificate-monitor.timer


echo -e "\n=== NODE MONITORING ==="
sudo systemctl status pm2-deploy.service

echo -e "\n=== MONGODB MONITORING ==="
sudo systemctl status mongod.service
sudo systemctl status update-mongo-ufw-whitelist.timer
sudo systemctl status mongo-backup.timer

echo -e "\n=== REDIS MONITORING ==="
sudo systemctl status valkey-server.service
sudo systemctl status update-redis-ufw-whitelist.timer
sudo systemctl status redis-backup.timer
sudo systemctl status redis-command-monitor.timer

echo -e "\n=== MAIL MONITORING ==="
sudo systemctl status snappymail-health-check.timer
sudo systemctl status snappymail-health-check.service

echo -e "\n=== SQLITE MIRROR MONITORING ==="
sudo systemctl status sqlite-mirror-health.timer 2>/dev/null || true

echo -e "\n=== UNBOUND MONITORING ==="
sudo systemctl status unbound.service

echo -e "\n=== EMAIL INFRASTRUCTURE ==="
sudo postfix check
sudo postconf -h master_service_disable
sudo postconf -h authorized_submit_users
sudo postconf -h relayhost
sudo postqueue -p
sudo journalctl -u postfix -n 20 --no-pager
if sudo ss -H -ltnp | grep -Eq 'users:\(\("(master|smtpd|postscreen|smtp-sink)"'; then
  echo "FAIL: Postfix has a TCP listener" >&2
fi

echo -e "\n=== ALL TIMERS ==="
sudo systemctl list-timers | grep -E "monitor|backup|update.*ufw"

echo -e "\n=== RECENT LOGS ==="
sudo ls -lh /var/log/*monitor*.log

echo -e "\n=== RATE LIMIT STATE ==="
sudo ls -la /var/lib/forwardemail-alerts 2>/dev/null || echo "No rate-limit state"

echo -e "\n=== HEALTH CHECK COMPLETE ==="
```

Save this as `check-monitoring.sh`, make it executable, and run:

```bash
chmod +x check-monitoring.sh
./check-monitoring.sh
```

---


## Summary

This guide covers **all monitoring systems** deployed across your Ansible infrastructure:

**Security Playbook**: Eight shared monitors on every selected host (resource, SSH, USB, root access, Lynis, packages, open ports, and certificates).

**Service Playbooks**: PM2 health and service failures, MongoDB service/UFW/backup paths, Redis service/UFW/backup/command paths, the SQLite mirror health check, the SnappyMail health timer, mail-host services, and Unbound.

Successfully queued routine findings remain email-only. Genuine systemd `OnFailure` events—including monitor execution, queueing, or state-commit failures—also send optional Twilio SMS with bounded diagnostics. All systemd-managed paths use the shared email sender and the recursion-safe fleet failure notifier.
