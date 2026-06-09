# Ansible Infrastructure Documentation

> \[!NOTE]
> This directory contains [Ansible](https://github.com/ansible/ansible) playbooks and comprehensive documentation for deploying and managing the Forward Email infrastructure.


## 📁 Directory Structure

```
ansible/
├── README.md                    # This file - Complete documentation index
├── docs/                        # Documentation guides
│   ├── MONITORING.md           # Security monitoring system guide
│   ├── MONITORING_TESTING.md   # Comprehensive monitoring testing guide
│   ├── PM2_MONITORING.md       # PM2 health monitoring guide
│   ├── SYSTEM_OPTIMIZATION.md  # System-wide optimization (tmpfs, mount options)
│   ├── AMD_RYZEN_NUMA.md       # AMD Ryzen NUMA optimization guide
│   ├── SYSCTL_HIGH_TRAFFIC.md  # High-traffic server kernel tuning guide
│   ├── IO_FILESYSTEM_TUNING.md # I/O scheduler and filesystem optimization guide
│   ├── UFW_ALLOWLIST.md        # UFW IP allowlist management guide
│   ├── REMOVE_POSTFIX.md       # Postfix removal guide (cleanup tool)
│   ├── README_MONGO_REDIS.md   # MongoDB & Redis/Valkey deployment
│   ├── MAIL_DEPLOYMENT.md      # Mail server deployment guide
│   ├── MONGODB_OPERATIONS_GUIDE.md
│   ├── MONGODB_PERFORMANCE_TUNING.md
│   ├── REDIS_PERFORMANCE_TUNING.md
│   ├── DISASTER_RECOVERY.md
│   ├── SERVICE_USER_AUDIT.md
│   └── LSYNCD_STORAGE_MIRRORING.md  # Real-time storage mirroring guide
├── playbooks/                   # Ansible playbooks
│   ├── security.yml            # Security baseline & monitoring (uses msmtp)
│   ├── node.yml                # Node.js & PM2 deployment
│   ├── chrony-timesync.yml     # Reusable time synchronization (chrony)
│   ├── system-optimization.yml # Reusable system-wide optimization (tmpfs, mount options)
│   ├── amd-ryzen-numa.yml      # Reusable AMD Ryzen NUMA optimization
│   ├── sysctl-high-traffic.yml # Reusable high-traffic server kernel tuning
│   ├── io-filesystem-tuning.yml # Reusable I/O scheduler and filesystem optimization
│   ├── ufw-allowlist.yml       # Reusable UFW IP allowlist management
│   ├── remove-postfix.yml      # Remove Postfix from servers (cleanup tool)
│   ├── mongo.yml               # MongoDB deployment
│   ├── logs.yml                # Logs MongoDB deployment (separate instance)
│   ├── redis.yml               # Redis/Valkey deployment
│   ├── bree.yml                # Bree job scheduler
│   ├── http.yml                # HTTP/API servers
│   ├── mail.yml                # Mail server deployment
│   ├── smtp.yml                # SMTP server
│   ├── imap.yml                # IMAP server
│   ├── pop3.yml                # POP3 server
│   ├── mx1.yml                 # MX1 mail exchanger
│   ├── mx2.yml                 # MX2 mail exchanger
│   ├── unbound.yml             # Unbound DNS resolver
│   ├── sqlite.yml              # SQLite server
│   ├── sqlite-mirror.yml        # Storage mirroring (cron rsync)
│   ├── certificates.yml        # SSL/TLS certificates
│   ├── dkim.yml                # DKIM key deployment
│   ├── env.yml                 # Environment variables
│   ├── ecosystem.yml           # PM2 ecosystem config
│   ├── fonts.yml               # Font deployment
│   ├── gapp-creds.yml          # Google App credentials
│   ├── gpg-security-key.yml    # GPG security keys
│   ├── ssh-keys.yml            # SSH key deployment
│   ├── deployment-keys.yml     # Deployment keys
│   └── patch-dns-role.yml      # DNS role patches
└── requirements.yml             # Ansible collections and roles
```

---


## 📚 Table of Contents

* [Getting Started](#getting-started)
* [Deployment Guides](#deployment-guides)
* [System-Wide Optimization](#system-wide-optimization)
* [AMD Ryzen NUMA Optimization](#amd-ryzen-numa-optimization)
* [UFW IP Allowlist Management](#ufw-ip-allowlist-management)
* [High-Traffic Server Kernel Tuning](#high-traffic-server-kernel-tuning)
* [Monitoring & Alerting](#monitoring--alerting)
* [Operations & Maintenance](#operations--maintenance)
* [Performance Tuning](#performance-tuning)
* [Real-time Storage Mirroring](#real-time-storage-mirroring)
* [Disaster Recovery](#disaster-recovery)
* [Security & Auditing](#security--auditing)
* [Common Commands](#common-commands)
* [Related Resources](#related-resources)

---


## 🚀 Getting Started

> \[!IMPORTANT]
> Before deploying any services, ensure you have:
>
> * [Ansible](https://github.com/ansible/ansible) 2.9+ installed
> * SSH access to target servers
> * Required environment variables configured
> * SSL/TLS certificates ready

### Prerequisites

```bash
# Install Ansible
pip install ansible
```

> \[!NOTE]
> **No Ansible Galaxy dependencies required!** Our playbooks use custom installations:
>
> * **MongoDB 6.0.27**: Installed directly from official MongoDB repository
> * **Valkey**: Compiled from source
>
> This eliminates external role dependencies and gives us full control.

### Environment Variables

Configure these environment variables before deployment:

```bash
# Email notifications (used by msmtp - lightweight SMTP client)
export MSMTP_USERNAME=mailerdaemon@forwardemail.net
export MSMTP_PASSWORD=<secure_password>
export MSMTP_RCPTS=security@forwardemail.net

# SMTP configuration (optional, defaults provided)
export SMTP_HOST=smtp.forwardemail.net
export SMTP_PORT=465
```

> \[!NOTE]
> **msmtp replaces Postfix**: We use msmtp (lightweight SMTP client) instead of Postfix for sending email notifications. msmtp doesn't run as a daemon, has no listening ports, and is more secure for send-only use cases.

### Quick Start

```bash
# 1. Deploy security baseline and monitoring
ansible-playbook ansible/playbooks/security.yml -i hosts.yml

# 2. Deploy Node.js and PM2
ansible-playbook ansible/playbooks/node.yml -i hosts.yml

# 3. Deploy MongoDB (primary)
ansible-playbook ansible/playbooks/mongo.yml -i hosts.yml

# 3b. Deploy Logs MongoDB (separate instance)
ansible-playbook ansible/playbooks/logs.yml -i hosts.yml

# 4. Deploy Redis/Valkey
ansible-playbook ansible/playbooks/redis.yml -i hosts.yml

# 5. Deploy mail servers
ansible-playbook ansible/playbooks/mail.yml -i hosts.yml
```

---


## 📖 Deployment Guides

### Database Deployment

**[MongoDB & Redis/Valkey Deployment Guide](docs/README_MONGO_REDIS.md)**

Complete guide for deploying [MongoDB](https://github.com/mongodb/mongo) v6 and [Valkey](https://github.com/valkey-io/valkey) (Redis fork) with:

* ✅ SSL/TLS encryption
* ✅ UFW firewall configuration
* ✅ Automated backups to Cloudflare R2
* ✅ Email alerting system
* ✅ Security hardening

> \[!WARNING]
> **MongoDB is LOCKED to v6.0.27** - Do not upgrade to v7 or v8 due to severe performance regressions. See [MONGODB\_OPERATIONS\_GUIDE.md](docs/MONGODB_OPERATIONS_GUIDE.md) for details.

> \[!TIP]
> Start here if you're deploying database services for the first time.

### Mail Server Deployment

**[Mail Server Deployment Guide](docs/MAIL_DEPLOYMENT.md)**

Step-by-step guide for deploying SMTP, IMAP, POP3, and other mail services:

* 📧 SMTP server configuration (ports 25, 587, 465, 2525, 2587, 2465, 2455, 2555)
* 📬 IMAP server setup (ports 993, 2993)
* 📮 POP3 server setup (ports 995, 2995)
* 🔐 TLS/SSL certificate management
* 🛡️ Security best practices

> \[!WARNING]
> Mail servers require proper DNS configuration (MX, SPF, DKIM, DMARC) before deployment.

---


## 🔧 System-Wide Optimization

**[System Optimization Guide](docs/SYSTEM_OPTIMIZATION.md)**

Automated system-wide optimizations applied to ALL servers via `security.yml`:

* 🚀 **tmpfs /tmp**: RAM-based temporary storage (2GB, auto-configured)
* 🔒 **/dev/shm hardening**: Secured with noexec (1GB limit, blocks malware execution)
* 💾 **Mount options**: noatime, nodiratime, discard (TRIM for SSDs)
* 🔄 **Automated fstab editing**: Automatically updates /etc/fstab and remounts
* 🛡️ **LUKS/LVM support**: Works with all device formats (UUID, /dev/disk/by-id/, dm-uuid, etc.)
* ✅ **Idempotent**: Safe to run multiple times

**Imported by**: `security.yml` (applies to all servers)

**Benefits**:

* ⚡ Faster temporary file operations
* 🔒 Enhanced security (noexec on /dev/shm blocks malware)
* 📉 Reduced SSD wear (noatime, nodiratime)
* 🔄 Extended SSD lifespan (TRIM support)
* 🧹 Automatic /tmp cleanup on reboot

> \[!NOTE]
> All filesystem changes are **fully automated** - no manual intervention required.

---


## 🔥 AMD Ryzen NUMA Optimization

**[AMD Ryzen NUMA Optimization Guide](docs/AMD_RYZEN_NUMA.md)**

Critical NUMA optimizations for AMD Ryzen/EPYC processors with **automatic CPU detection**:

* 🎯 **zone\_reclaim\_mode=0**: Prevents 10-100x tail latency spikes
* ⚖️ **numa\_balancing=0**: Reduces latency variance by 20-50%
* 🚫 **THP disabled**: Eliminates 10-100ms THP-related stalls
* 🔍 **Auto-detection**: Only applies if AMD Ryzen/EPYC detected

**Imported by**: `security.yml` (applies to all servers with auto-detection)

**Performance Impact**:

* **10-100x** reduction in tail latency
* **20-50%** reduction in latency variance
* **Elimination** of THP-related latency spikes

> \[!IMPORTANT]
> These optimizations are **critical for database servers** (MongoDB, Redis) running on AMD hardware.

---


## 🔥 UFW IP Allowlist Management

**[UFW Allowlist Management Guide](docs/UFW_ALLOWLIST.md)**

Reusable [UFW](https://help.ubuntu.com/community/UFW) (Uncomplicated Firewall) IP allowlist management system for database and service security:

* 🔒 **Automated IP allowlist updates** - Fetches approved IPs from central source
* 🧹 **Orphaned rule cleanup** - Removes outdated rules from previous deployments
* 📧 **Email notifications** - Alerts for all changes with detailed reports
* 🔄 **Retry logic** - Network failure resilience (3 attempts, 10s timeout)
* ⏱️ **Systemd timer automation** - Updates every 10 minutes
* 🛡️ **Safety features** - Graceful failure handling, no connection drops

**Integrated Services**:

* 🔴 **Redis/Valkey** - Port 6380 (TLS)
* 🍃 **MongoDB** - Port 27017
* 🗄️ **SQLite** - Port 3456

**Architecture**:

```yaml
# Reusable playbook with service-specific variables
- name: Import UFW allowlist playbook for Redis
  import_playbook: ufw-allowlist.yml
  vars:
    target_hosts: redis
    service_name: Redis
    service_port_var: REDIS_PORT
    service_port_default: "6380"
    service_identifier: redis
    ufw_comment: "Auto-whitelist Redis TLS"
```

**Benefits**:

* ✅ **Single source of truth** - One playbook for all services
* ✅ **Easy maintenance** - Update once, applies everywhere
* ✅ **Consistency guaranteed** - Same logic across all services
* ✅ **Extensible** - Easy to add new services

> \[!TIP]
> The UFW allowlist system is automatically integrated into `mongo.yml`, `redis.yml`, and `sqlite.yml` playbooks.

> \[!NOTE]
> IP allowlists are fetched from `https://forwardemail.net/ips/v4.txt` and validated before application.

---


## ⚡ High-Traffic Server Kernel Tuning

**[High-Traffic Server Kernel Tuning Guide](docs/SYSCTL_HIGH_TRAFFIC.md)**

Kernel parameter optimizations for high-traffic servers (databases, APIs, mail servers):

* 🌐 **BBR congestion control**: Modern TCP congestion control algorithm
* 📊 **Auto-scaled buffers**: Automatically scales based on available RAM (256MB cap)
* 🔌 **Connection tracking**: Optimized for high connection counts
* 🚀 **TCP optimizations**: Fast open, window scaling, timestamps

**Integrated into**: `mongo.yml`, `logs.yml`, `redis.yml`, `sqlite.yml`

**Benefits**:

* 📈 Better throughput under load
* 📉 Lower latency
* 🔄 Improved connection handling

---


## 🔔 Monitoring & Alerting

### Security Monitoring System

**[Security Monitoring System Guide](docs/MONITORING.md)**

Comprehensive automated monitoring with email notifications for:

* 📊 **System Resource Monitoring** - CPU/Memory/Disk at 75%, 80%, 90%, 95%, 100% thresholds
* 🔐 **SSH Security Monitoring** - ALL SSH activity (successful/failed logins, logged in users, commands)
* 🔌 **USB Device Monitoring** - Unknown device detection with whitelisting
* 👤 **Root Access Monitoring** - Sudo, su, and direct root login tracking
* 🔍 **[Lynis](https://github.com/CISOfy/lynis) System Audit** - Daily security audits with hardening index
* 📦 **Package Installation Monitoring** - Track package installations, upgrades, removals
* 🔓 **Open Ports Monitoring** - Detect unexpected listening services
* 📜 **SSL Certificate Monitoring** - Expiration alerts (30/14/7 days before expiry)

**Features**:

* ⏱️ **Systemd timers** - Reliable periodic execution
* 📧 **Email alerts** - Detailed notifications via msmtp (lightweight SMTP client)
* 🔒 **Whitelisting** - Authorized IPs, users, devices, sudo users
* 🚦 **Rate limiting** - Intelligent alert throttling to prevent flooding
* 📝 **Comprehensive logs** - All events logged to `/var/log/*-monitor.log`

> \[!NOTE]
> All monitoring integrates with msmtp (lightweight SMTP client) for email notifications.

**Testing Guide**: See [MONITORING\_TESTING.md](docs/MONITORING_TESTING.md) for comprehensive testing procedures.

### PM2 Health Monitoring

**[PM2 Health Monitoring Guide](docs/PM2_MONITORING.md)**

Automated PM2 process health monitoring for Node.js applications:

* ✅ **Uptime checks** - Detects processes with < 90% uptime
* 🔴 **Errored process detection** - Alerts on errored or stopped processes
* ⏰ **Drift detection** - Identifies processes with excessive restarts
* 📧 **Email notifications** - Detailed alerts with process status via msmtp
* ⏱️ **Scheduled checks** - Runs every 20 minutes via cron

**Integrated into**: `node.yml`

**Environment Variables**:

* `MSMTP_RCPTS` - Email recipients for alerts

> \[!TIP]
> Configure `MSMTP_RCPTS` environment variable to receive alerts.

---


## 🛠️ Operations & Maintenance

### MongoDB Operations

**[MongoDB Operations Guide](docs/MONGODB_OPERATIONS_GUIDE.md)**

Complete MongoDB operations manual:

* 🔧 Version management (LOCKED to v6.0.27)
* 💾 Backup and restore procedures
* 🔄 Replica set management
* 📊 Performance monitoring
* 🐛 Troubleshooting

---


## 💾 Storage Mirroring

**[SQLite Storage Mirroring Guide](docs/SQLITE_STORAGE_MIRRORING.md)**

Periodic rsync-based mirroring between primary and secondary encrypted storage volumes:

* 🔄 **Cron rsync** - Mirrors every 2 minutes with near-zero memory usage
* 🛡️ **Safety checks** - Prevents accidental data loss
* 📧 **Email notifications** - Alerts for sync errors and failures
* ⏱️ **Health monitoring** - Systemd timer checks every 5 minutes
* 🔒 **LUKS support** - Works with encrypted volumes

**Usage**:

```bash
# Deploy sqlite-mirror to SQLite servers
ansible-playbook ansible/playbooks/sqlite-mirror.yml -l sqlite

# With custom source/target
MIRROR_SOURCE=/mnt/primary MIRROR_TARGET=/mnt/backup \
  ansible-playbook ansible/playbooks/sqlite-mirror.yml -l sqlite
```

**Environment Variables**:

| Variable             | Description                 | Default                     |
| -------------------- | --------------------------- | --------------------------- |
| `MIRROR_SOURCE`      | Source directory to mirror  | `/mnt/storage_do_1`         |
| `MIRROR_TARGET`      | Target directory for mirror | `/mnt/storage_do_2`         |
| `MIRROR_INTERVAL`    | Cron interval in minutes    | `2`                         |
| `MSMTP_RCPTS`        | Email recipients for alerts | `security@forwardemail.net` |
| `MIRROR_SKIP_SAFETY` | Skip safety checks          | `false`                     |

> \[!WARNING]
> The playbook will **fail** if the target directory contains existing data to prevent accidental deletion. Set `MIRROR_SKIP_SAFETY=true` to bypass this check after verifying the target data is expendable.

> \[!TIP]
> Run this playbook after setting up LUKS-encrypted storage volumes (see README.md "Bare Metal Advice" section).

---


## 🛠️ Disaster Recovery

**[Disaster Recovery Guide](docs/DISASTER_RECOVERY.md)**

Comprehensive disaster recovery procedures:

* 💾 Backup strategies
* 🔄 Restore procedures
* 🚨 Emergency response
* 📋 Recovery checklists

---


## 🚀 Performance Tuning

### MongoDB Performance

**[MongoDB Performance Tuning Guide](docs/MONGODB_PERFORMANCE_TUNING.md)**

Optimize MongoDB for production workloads:

* 📊 Index optimization
* 💾 WiredTiger configuration
* 🔄 Connection pooling
* 📈 Query optimization

### Redis Performance

**[Redis Performance Tuning Guide](docs/REDIS_PERFORMANCE_TUNING.md)**

Optimize Redis/Valkey for high-performance caching:

* 💾 Memory management
* 🔄 Persistence configuration
* 📊 Monitoring and metrics
* ⚡ Performance best practices

---


## 🔒 Security & Auditing

### Service User Audit

**[Service User Audit Guide](docs/SERVICE_USER_AUDIT.md)**

Security audit procedures for service accounts:

* 👤 User permission audits
* 🔐 SSH key management
* 📝 Access logging
* 🛡️ Security hardening

---


## 💻 Common Commands

### Deployment

```bash
# Deploy security baseline (includes system optimization and AMD Ryzen NUMA)
ansible-playbook ansible/playbooks/security.yml -i hosts.yml

# Deploy all database optimizations
ansible-playbook ansible/playbooks/mongo.yml -i hosts.yml

# 3b. Deploy Logs MongoDB (separate instance)
ansible-playbook ansible/playbooks/logs.yml -i hosts.yml
ansible-playbook ansible/playbooks/redis.yml -i hosts.yml

# Deploy Node.js with PM2 monitoring
ansible-playbook ansible/playbooks/node.yml -i hosts.yml
```

### Monitoring

```bash
# Check monitoring service status
sudo systemctl status system-resource-monitor.timer
sudo systemctl status ssh-security-monitor.timer

# View monitoring logs
sudo tail -f /var/log/system-resource-monitor.log
sudo tail -f /var/log/ssh-security-monitor.log

# Manually trigger monitoring check
sudo systemctl start system-resource-monitor.service
```

### Mail Services

```bash
# Check msmtp configuration (no service - it's a command-line tool)
cat /etc/msmtprc
sudo tail /var/log/msmtp.log

# Test email delivery
echo "Test email" | sendmail your-email@example.com

# Check msmtp logs
sudo tail -f /var/log/msmtp.log
```

### Database Services

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check Redis/Valkey status
sudo systemctl status valkey

# View database logs
sudo journalctl -u mongod -f
sudo journalctl -u valkey -f
```

### System Optimization

```bash
# Verify tmpfs /tmp is mounted
mount | grep /tmp

# Check mount options
mount | grep "on / "

# Verify AMD Ryzen NUMA settings (if applicable)
cat /proc/sys/vm/zone_reclaim_mode  # Should be 0
cat /proc/sys/kernel/numa_balancing  # Should be 0
cat /sys/kernel/mm/transparent_hugepage/enabled  # Should be [never]
```

---


## 🧹 Cleanup & Maintenance

### Remove Postfix (if previously installed)

**[Postfix Removal Guide](docs/REMOVE_POSTFIX.md)**

If you previously ran playbooks that installed Postfix, use the removal playbook:

```bash
# Remove from all non-mail servers
ansible-playbook ansible/playbooks/remove-postfix.yml \
  -i hosts.yml \
  -e "target_hosts=all" \
  --limit '!mx1:!mx2:!smtp:!imap:!mail'

# Or remove from specific server groups
ansible-playbook ansible/playbooks/remove-postfix.yml \
  -i hosts.yml \
  -e "target_hosts=http:redis:bree:mongo:logs:sqlite"
```

> \[!WARNING]
> Do NOT run on actual mail servers (MX, SMTP, IMAP) that legitimately need Postfix.

---


## 📚 Related Resources

* [Forward Email Documentation](https://forwardemail.net/)
* [Ansible Documentation](https://docs.ansible.com/)
* [MongoDB Documentation](https://docs.mongodb.com/)
* [Valkey Documentation](https://valkey.io/)
* [Ubuntu Server Guide](https://ubuntu.com/server/docs)
* [Systemd Documentation](https://www.freedesktop.org/software/systemd/man/)
