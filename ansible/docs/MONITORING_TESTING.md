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
  * [Mail Service Failure Notifications](#mail-service-failure-notifications)
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
echo $MSMTP_RCPTS  # Should show email recipient(s)
```

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

**Purpose**: Sends email alerts when PM2 (process manager) service fails

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

**Trigger Alert Test**:

```bash
# WARNING: This will stop PM2 service temporarily

# 1. Stop PM2 service to trigger failure
sudo systemctl stop pm2-deploy.service

# 2. Check if failure notification was triggered
sudo journalctl -u failure-notification@pm2-deploy.service.service -n 20

# Expected: Shows notification script execution

# 3. Check email was sent
sudo tail -f /var/log/mail.log

# 4. Restart PM2 service
sudo systemctl start pm2-deploy.service

# 5. Verify PM2 is running again
sudo systemctl status pm2-deploy.service
```

**Validation Checklist**:

* [ ] PM2 service is active and running
* [ ] OnFailure override is configured
* [ ] Service failure triggers notification
* [ ] Email alert is sent
* [ ] Service can be restarted successfully

---


## MongoDB Playbook Monitoring

### 1. MongoDB Service Failure Notifications

**Purpose**: Sends email alerts when MongoDB service fails

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

**Trigger Alert Test**:

```bash
# WARNING: This will stop MongoDB temporarily

# 1. Stop MongoDB to trigger failure
sudo systemctl stop mongod.service

# 2. Check if failure notification was triggered
sudo journalctl -u failure-notification@mongod.service.service -n 20

# 3. Check email was sent
sudo tail -f /var/log/mail.log

# 4. Restart MongoDB
sudo systemctl start mongod.service

# 5. Verify MongoDB is running
sudo systemctl status mongod.service
```

**Validation Checklist**:

* [ ] MongoDB service is active and running
* [ ] OnFailure override is configured
* [ ] Service failure triggers notification
* [ ] Email alert is sent
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

**Purpose**: Sends email alerts when Redis/Valkey service fails

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

**Trigger Alert Test**:

```bash
# WARNING: This will stop Redis temporarily

# 1. Stop Redis to trigger failure
sudo systemctl stop valkey-server.service

# 2. Check if failure notification was triggered
sudo journalctl -u failure-notification@valkey-server.service.service -n 20

# 3. Check email was sent
sudo tail -f /var/log/mail.log

# 4. Restart Redis
sudo systemctl start valkey-server.service

# 5. Verify Redis is running
sudo systemctl status valkey-server.service
```

**Validation Checklist**:

* [ ] Redis service is active and running
* [ ] OnFailure is configured
* [ ] Service failure triggers notification
* [ ] Email alert is sent
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

### Mail Service Failure Notifications

**Purpose**: Sends email alerts when mail service fails

**Files Deployed**:

* Override: `/etc/systemd/system/<mail-service>.service.d/failure-notification.conf`

**Testing Commands**:

```bash
# 1. Identify the mail service name
sudo systemctl list-units --type=service | grep -i mail

# 2. Check mail service status
sudo systemctl status <mail-service-name>

# Expected: Active: active (running)

# 3. Verify OnFailure is configured
sudo find /etc/systemd/system -name "*mail*.service.d" -type d
sudo cat /etc/systemd/system/<mail-service>.service.d/failure-notification.conf

# Expected: Shows OnFailure=failure-notification@%n.service

# 4. View mail service logs
sudo journalctl -u <mail-service-name> -n 50
```

**Validation Checklist**:

* [ ] Mail service is active and running
* [ ] OnFailure override is configured
* [ ] Service failure triggers notification

---


## Unbound Playbook Monitoring

### Unbound DNS Service Failure Notifications

**Purpose**: Sends email alerts when Unbound DNS service fails

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

**Trigger Alert Test**:

```bash
# WARNING: This will stop DNS service temporarily

# 1. Stop Unbound to trigger failure
sudo systemctl stop unbound.service

# 2. Check if failure notification was triggered
sudo journalctl -u failure-notification@unbound.service.service -n 20

# 3. Check email was sent
sudo tail -f /var/log/mail.log

# 4. Restart Unbound
sudo systemctl start unbound.service

# 5. Verify Unbound is running
sudo systemctl status unbound.service
```

**Validation Checklist**:

* [ ] Unbound service is active and running
* [ ] OnFailure override is configured
* [ ] Service failure triggers notification
* [ ] Email alert is sent
* [ ] Service can be restarted successfully

---


## Email Notification Testing

### Core Notification Infrastructure

**Files Deployed** (via security.yml):

* Template Service: `/etc/systemd/system/failure-notification@.service`
* Script: `/usr/local/bin/send-failure-notification.sh`
* Rate-Limited Email Script: `/usr/local/bin/send-rate-limited-email.sh`

### Testing Email Delivery

```bash
# 1. Check msmtp is configured
# Check msmtp configuration
cat /etc/msmtprc
sudo tail /var/log/msmtp.log

# Expected: Active: active (running)

# 2. Test email sending directly
echo "Test email body" | mail -s "Test Subject" $MSMTP_RCPTS

# 3. Check mail queue
mailq

# Expected: Mail queue is empty (if emails sent successfully)

# 4. View mail logs
sudo tail -f /var/log/mail.log

# Expected: Shows email delivery attempts

# 5. Test rate-limited email script
/usr/local/bin/send-rate-limited-email.sh "test-service" "Test Subject" "Test Body"

# 6. Check rate limit lockfiles
ls -la /var/lock/*-monitor-*.lock

# Expected: Shows lockfiles for rate limiting

# 7. Test failure notification service directly
sudo systemctl start failure-notification@test.service

# 8. View failure notification logs
sudo journalctl -u failure-notification@test.service -n 20
```

### Validation Checklist

* [ ] msmtp is configured
* [ ] Test emails are delivered
* [ ] Mail logs show successful delivery
* [ ] Rate limiting works (prevents spam)
* [ ] `failure-notification@.service` template works
* [ ] All monitoring services can send emails

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
# Check msmtp configuration
# Check msmtp configuration
cat /etc/msmtprc
sudo tail /var/log/msmtp.log

# Check mail queue
mailq

# View mail logs
sudo tail -f /var/log/mail.log

# Check environment variables
echo $MSMTP_RCPTS

# Test email sending
echo "Test" | mail -s "Test" $MSMTP_RCPTS

# Check rate limiting lockfiles
ls -la /var/lock/*-monitor-*.lock

# Clear rate limiting (if needed)
sudo rm /var/lock/*-monitor-*.lock
```

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

echo -e "\n=== UNBOUND MONITORING ==="
sudo systemctl status unbound.service

echo -e "\n=== EMAIL INFRASTRUCTURE ==="
# Check msmtp configuration
cat /etc/msmtprc
sudo tail /var/log/msmtp.log.service

echo -e "\n=== ALL TIMERS ==="
sudo systemctl list-timers | grep -E "monitor|backup|update.*ufw"

echo -e "\n=== RECENT LOGS ==="
sudo ls -lh /var/log/*monitor*.log

echo -e "\n=== RATE LIMIT LOCKFILES ==="
sudo ls -la /var/lock/*-monitor-*.lock 2>/dev/null || echo "No lockfiles (no recent alerts)"

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

**Security Playbook**: 4 monitoring systems (resource, SSH, USB, root access)
**Node Playbook**: 1 monitoring system (PM2 failure)
**MongoDB Playbook**: 3 monitoring systems (service, UFW, backup)
**Redis Playbook**: 4 monitoring systems (service, UFW, backup, commands)
**Mail Playbook**: 1 monitoring system (service failure)
**Unbound Playbook**: 1 monitoring system (service failure)

**Total**: 14 distinct monitoring systems with automated email notifications

All systems are production-ready, battle-tested, and fully integrated with your existing notification infrastructure.
