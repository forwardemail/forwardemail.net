# Security Monitoring System


## Overview

This monitoring system provides comprehensive automated email notifications for system resource thresholds, SSH security events, USB device detection, and root access monitoring. All monitoring is implemented using battle-tested bash scripts with systemd timers for reliable periodic execution.


## Features

### 1. System Resource Monitoring

Monitors CPU and memory usage with multiple threshold levels:

* **75%** - Warning level (first alert)
* **80%** - Elevated warning
* **90%** - Critical warning
* **95%** - Severe warning
* **100%** - Maximum capacity

**Monitoring Frequency**: Every 5 minutes

**Alert Content**:

* Current CPU/Memory percentages
* Threshold exceeded
* Top 10 processes by CPU usage
* Top 10 processes by memory usage
* System uptime and load averages
* Available disk space
* Memory breakdown (used, free, cached, swap)
* Actionable recommendations

### 2. SSH Security Monitoring

Monitors SSH access for suspicious activity:

**Monitored Events**:

* Failed login attempts (threshold: 5 attempts)
* Successful logins (all)
* Root user access (immediate alert)
* Logins from unknown IP addresses
* Logins outside business hours (8am-6pm by default)

**Monitoring Frequency**: Every 10 minutes

**Alert Content**:

* Event type (failed login, root access, etc.)
* Username and IP address
* Timestamp
* Recent login history
* Failed attempt count
* Actionable recommendations

### 3. USB Device Monitoring

Detects and alerts on unknown USB devices:

**Monitored Events**:

* New USB device connected
* Unknown device (not in whitelist)
* USB storage device connected
* Device removal

**Monitoring Method**: Periodic checks every 5 minutes + real-time via udev rules

**Alert Content**:

* Device type and description
* Vendor and product ID
* Serial number
* Connection timestamp
* Current authorized devices list
* Actionable recommendations

### 4. Root Access Monitoring

Monitors root user access and privilege escalation:

**Monitored Events**:

* Direct root login via SSH
* Direct root login via console
* sudo usage by users
* su to root
* Privilege escalation attempts

**Monitoring Frequency**: Every 5 minutes

**Alert Content**:

* Access method (SSH, console, sudo, su)
* Username
* Source IP (if applicable)
* Command executed (for sudo)
* Timestamp
* Actionable recommendations


## Installation

The monitoring system is automatically deployed via the `security.yml` Ansible playbook. To deploy:

```bash
cd ansible
ansible-playbook -i hosts.yml playbooks/security.yml
```


## Configuration

### Email Notifications

Email notifications use the existing Postfix SMTP relay configuration. Ensure these environment variables are set:

* `POSTFIX_USERNAME` - SMTP username
* `POSTFIX_PASSWORD` - SMTP password
* `POSTFIX_RCPTS` - Alert recipients (comma-separated)
* `SMTP_HOST` - SMTP server (default: smtp.forwardemail.net)
* `SMTP_PORT` - SMTP port (default: 465)

### Whitelists

Whitelist configuration files are located in `/etc/security-monitor/`:

#### Authorized IP Addresses

File: `/etc/security-monitor/authorized-ips.conf`

Format: One IP address per line

```
192.168.1.100
10.0.0.50
```

#### Authorized Users

File: `/etc/security-monitor/authorized-users.conf`

Format: One username per line

```
devops
deploy
admin
```

#### Authorized USB Devices

File: `/etc/security-monitor/authorized-usb-devices.conf`

Format: `vendor_id:product_id` (one per line)

Get device IDs using `lsusb`:

```bash
lsusb
# Output: Bus 001 Device 002: ID 1234:5678 Device Name
# Add to whitelist: 1234:5678
```

Example:

```
1234:5678
abcd:ef01
```

#### Authorized Root Users

File: `/etc/security-monitor/authorized-root-users.conf`

Format: One username per line

```
devops
```

#### Authorized Sudo Users

File: `/etc/security-monitor/authorized-sudo-users.conf`

Format: One username per line

```
devops
deploy
```

### Business Hours Configuration

To change business hours for SSH monitoring, edit the script:

```bash
sudo nano /usr/local/bin/ssh-security-monitor.sh
```

Modify these variables:

```bash
BUSINESS_HOURS_START=8   # 8am
BUSINESS_HOURS_END=18    # 6pm
```


## Rate Limiting

All monitoring scripts implement intelligent rate limiting to prevent alert flooding:

* **Resource thresholds**: 1 hour cooldown per threshold
* **SSH failed logins**: 30 minutes cooldown
* **SSH root access**: No rate limiting (always alert)
* **USB unknown device**: 1 hour cooldown per device
* **Root access (sudo/su)**: 30 minutes cooldown per user

Rate limiting uses lockfiles in `/var/lock/` with unique identifiers for each alert type and threshold.


## Systemd Services

### Services

* `system-resource-monitor.service` - System resource monitoring
* `ssh-security-monitor.service` - SSH security monitoring
* `usb-device-monitor.service` - USB device monitoring
* `root-access-monitor.service` - Root access monitoring

### Timers

* `system-resource-monitor.timer` - Runs every 5 minutes
* `ssh-security-monitor.timer` - Runs every 10 minutes
* `usb-device-monitor.timer` - Runs every 5 minutes
* `root-access-monitor.timer` - Runs every 5 minutes

### Managing Services

Check status:

```bash
sudo systemctl status system-resource-monitor.timer
sudo systemctl status ssh-security-monitor.timer
sudo systemctl status usb-device-monitor.timer
sudo systemctl status root-access-monitor.timer
```

View logs:

```bash
sudo journalctl -u system-resource-monitor.service -n 50
sudo journalctl -u ssh-security-monitor.service -n 50
sudo journalctl -u usb-device-monitor.service -n 50
sudo journalctl -u root-access-monitor.service -n 50
```

Manually trigger a check:

```bash
sudo systemctl start system-resource-monitor.service
sudo systemctl start ssh-security-monitor.service
sudo systemctl start usb-device-monitor.service
sudo systemctl start root-access-monitor.service
```

Stop/Start timers:

```bash
sudo systemctl stop system-resource-monitor.timer
sudo systemctl start system-resource-monitor.timer
```

Disable monitoring:

```bash
sudo systemctl disable --now system-resource-monitor.timer
```


## Log Files

Monitoring logs are stored in:

* `/var/log/system-resource-monitor.log`
* `/var/log/ssh-security-monitor.log`
* `/var/log/usb-device-monitor.log`
* `/var/log/root-access-monitor.log`

View logs:

```bash
sudo tail -f /var/log/system-resource-monitor.log
sudo tail -f /var/log/ssh-security-monitor.log
sudo tail -f /var/log/usb-device-monitor.log
sudo tail -f /var/log/root-access-monitor.log
```


## Testing

### Test Email Notifications

1. Ensure Postfix is configured and running:

```bash
sudo systemctl status postfix
```

2. Test email delivery:

```bash
echo "Test email body" | mail -s "Test Subject" your-email@example.com
```

3. Check Postfix logs:

```bash
sudo tail -f /var/log/mail.log
```

### Test Monitoring Scripts

Run scripts manually to test functionality:

```bash
# Test system resource monitor
sudo /usr/local/bin/system-resource-monitor.sh

# Test SSH security monitor
sudo /usr/local/bin/ssh-security-monitor.sh

# Test USB device monitor
sudo /usr/local/bin/usb-device-monitor.sh

# Test root access monitor
sudo /usr/local/bin/root-access-monitor.sh
```

### Trigger Test Alerts

#### CPU/Memory Alert

Use stress testing tools to increase resource usage:

```bash
# Install stress tool
sudo apt-get install stress

# Stress CPU (4 workers for 60 seconds)
stress --cpu 4 --timeout 60s

# Stress memory (allocate 2GB)
stress --vm 1 --vm-bytes 2G --timeout 60s
```

Wait for the next monitoring cycle (5 minutes) to receive an alert.

#### SSH Failed Login Alert

Generate failed SSH login attempts:

```bash
# From another machine, attempt SSH login with wrong password
# Repeat 5+ times to trigger threshold
ssh wronguser@your-server
```

#### Root Access Alert

Trigger root access monitoring:

```bash
# Use sudo (will trigger alert if not in whitelist)
sudo ls

# Or switch to root
sudo su -
```

#### USB Device Alert

Connect an unknown USB device (not in whitelist) to trigger an alert.


## Troubleshooting

### No Alerts Received

1. Check if timers are running:

```bash
sudo systemctl list-timers | grep monitor
```

2. Check service status:

```bash
sudo systemctl status system-resource-monitor.service
```

3. Check logs for errors:

```bash
sudo journalctl -u system-resource-monitor.service -n 50
```

4. Verify Postfix is running:

```bash
sudo systemctl status postfix
```

5. Check Postfix logs:

```bash
sudo tail -f /var/log/mail.log
```

6. Test email delivery manually:

```bash
echo "Test" | mail -s "Test" your-email@example.com
```

### Rate Limiting Issues

If alerts are being rate-limited too aggressively, you can:

1. Clear lockfiles:

```bash
sudo rm /var/lock/resource-monitor-*.lock
sudo rm /var/lock/ssh-monitor-*.lock
sudo rm /var/lock/usb-monitor-*.lock
sudo rm /var/lock/root-monitor-*.lock
```

2. Adjust lock duration in scripts:

```bash
sudo nano /usr/local/bin/system-resource-monitor.sh
# Modify LOCK_DURATION variable
```

### Script Errors

Check script syntax:

```bash
bash -n /usr/local/bin/system-resource-monitor.sh
bash -n /usr/local/bin/ssh-security-monitor.sh
bash -n /usr/local/bin/usb-device-monitor.sh
bash -n /usr/local/bin/root-access-monitor.sh
```

Run with debug output:

```bash
sudo bash -x /usr/local/bin/system-resource-monitor.sh
```

### Whitelist Not Working

1. Verify whitelist file exists and has correct permissions:

```bash
ls -la /etc/security-monitor/
```

2. Check file format (no extra spaces, one entry per line):

```bash
cat /etc/security-monitor/authorized-ips.conf
```

3. Ensure no trailing whitespace or special characters


## Security Considerations

1. **Script Permissions**: All scripts run as root but with minimal privileges via systemd security hardening
2. **Log File Security**: Monitoring logs are readable only by root
3. **Credential Protection**: Email credentials use environment variables, never hardcoded
4. **Rate Limiting**: Prevents DoS via alert flooding
5. **Whitelist Management**: Secure storage with restricted modification


## Maintenance

### Weekly Tasks

* Review monitoring logs for patterns
* Update whitelists as needed
* Verify email delivery

### Monthly Tasks

* Review alert thresholds and adjust if needed
* Check disk space for log files
* Update authorized users/IPs/devices lists

### Quarterly Tasks

* Review and update business hours configuration
* Audit monitoring effectiveness
* Update documentation


## Architecture

The monitoring system follows these design principles:

1. **Minimal System Impact**: Scripts consume minimal resources (< 10% CPU, < 256MB RAM)
2. **Rate-Limited Notifications**: Intelligent rate limiting prevents alert flooding
3. **Comprehensive Coverage**: Monitors all critical system metrics and security events
4. **Battle-Tested Reliability**: Uses proven patterns from existing infrastructure
5. **Consistent Architecture**: Follows existing systemd-based notification patterns


## Support

For issues or questions:

1. Check logs: `/var/log/*-monitor.log`
2. Check systemd journal: `sudo journalctl -u <service-name>`
3. Review this documentation
4. Contact the infrastructure team


## References

* [Server Auditing Best Practices](https://serverauditing.com/)
* [SSH Monitoring Guide](https://sshmonitor.com/)
* [SSL Certificate Monitoring](https://sslmonitor.com/)
* [Forward Email Documentation](https://forwardemail.net/)
* [Systemd Timer Documentation](https://www.freedesktop.org/software/systemd/man/systemd.timer.html)
