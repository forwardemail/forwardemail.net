# Ansible Infrastructure Documentation

> [!NOTE]
> This directory contains [Ansible](https://github.com/ansible/ansible) playbooks and comprehensive documentation for deploying and managing the Forward Email infrastructure.

## 📁 Directory Structure

```
ansible/
├── README.md                    # This file - Complete documentation index
├── docs/                        # Documentation guides
│   ├── MONITORING.md           # Security monitoring system guide
│   ├── MONITORING_TESTING.md   # Comprehensive monitoring testing guide
│   ├── README_MONGO_REDIS.md   # MongoDB & Redis/Valkey deployment
│   ├── MAIL_DEPLOYMENT.md      # Mail server deployment guide
│   ├── MONGODB_OPERATIONS_GUIDE.md
│   ├── MONGODB_PERFORMANCE_TUNING.md
│   ├── REDIS_PERFORMANCE_TUNING.md
│   ├── DISASTER_RECOVERY.md
│   └── SERVICE_USER_AUDIT.md
├── playbooks/                   # Ansible playbooks
│   ├── security.yml            # Security baseline & monitoring
│   ├── node.yml                # Node.js & PM2 deployment
│   ├── mongo.yml               # MongoDB deployment
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
└── requirements.yml             # Ansible Galaxy dependencies
```

---

## 📚 Table of Contents

- [Getting Started](#getting-started)
- [Deployment Guides](#deployment-guides)
- [Monitoring & Alerting](#monitoring--alerting)
- [Operations & Maintenance](#operations--maintenance)
- [Performance Tuning](#performance-tuning)
- [Disaster Recovery](#disaster-recovery)
- [Security & Auditing](#security--auditing)
- [Common Commands](#common-commands)
- [Related Resources](#related-resources)

---

## 🚀 Getting Started

> [!IMPORTANT]
> Before deploying any services, ensure you have:
>
> - [Ansible](https://github.com/ansible/ansible) 2.9+ installed
> - SSH access to target servers
> - Required environment variables configured
> - SSL/TLS certificates ready

### Prerequisites

```bash
# Install Ansible
pip install ansible

# Install Ansible Galaxy dependencies
ansible-galaxy install -r ansible/requirements.yml
```

### Environment Variables

Configure these environment variables before deployment:

```bash
# Email notifications
export POSTFIX_USERNAME=mailerdaemon@forwardemail.net
export POSTFIX_PASSWORD=<secure_password>
export POSTFIX_RCPTS=security@forwardemail.net

# SMTP configuration (optional, defaults provided)
export SMTP_HOST=smtp.forwardemail.net
export SMTP_PORT=465
```

### Quick Start

```bash
# 1. Deploy security baseline and monitoring
ansible-playbook ansible/playbooks/security.yml -i hosts.yml

# 2. Deploy Node.js and PM2
ansible-playbook ansible/playbooks/node.yml -i hosts.yml

# 3. Deploy MongoDB
ansible-playbook ansible/playbooks/mongo.yml -i hosts.yml

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

- ✅ SSL/TLS encryption
- ✅ UFW firewall configuration
- ✅ Automated backups to Cloudflare R2
- ✅ Email alerting system
- ✅ Security hardening

> [!TIP]
> Start here if you're deploying database services for the first time.

### Mail Server Deployment

**[Mail Server Deployment Guide](docs/MAIL_DEPLOYMENT.md)**

Step-by-step guide for deploying SMTP, IMAP, POP3, and other mail services:

- 📧 SMTP server configuration (ports 25, 587, 465, 2525, 2587, 2465, 2455, 2555)
- 📬 IMAP server setup (ports 993, 2993)
- 📮 POP3 server setup (ports 995, 2995)
- 🔐 TLS/SSL certificate management
- 🛡️ Security best practices

> [!WARNING]
> Mail servers require proper DNS configuration (MX, SPF, DKIM, DMARC) before deployment.

---

## 🔔 Monitoring & Alerting

### Security Monitoring System

**[Security Monitoring Guide](docs/MONITORING.md)**

Comprehensive automated monitoring with email notifications for:

- 📊 **System Resource Monitoring** - CPU/Memory at 75%, 80%, 90%, 95%, 100% thresholds
- 🔐 **SSH Security Monitoring** - ALL SSH activity (successful/failed logins, logged in users, commands)
- 🔌 **USB Device Monitoring** - Unknown device detection with whitelisting
- 👤 **Root Access Monitoring** - Sudo, su, and direct root login tracking
- 🔍 **[Lynis](https://github.com/CISOfy/lynis) System Audit** - Daily security audits with hardening index
- 📦 **Package Installation Monitoring** - Track package installations, upgrades, removals
- 🌐 **Open Ports Monitoring** - Monitor network ports and detect changes
- 🔒 **SSL Certificate Monitoring** - Certificate expiration tracking for WEB_URL

**Features**:

- ⏱️ Periodic monitoring via [systemd](https://github.com/systemd/systemd) timers
- 📧 HTML-formatted email alerts
- 🚦 Intelligent rate limiting
- 🎯 Whitelist-based filtering
- 🔒 Security hardened services

> [!NOTE]
> All monitoring integrates with the existing Postfix SMTP relay and notification infrastructure.

### Comprehensive Monitoring Testing

**[Monitoring Testing Guide](docs/MONITORING_TESTING.md)**

Complete testing procedures for **all 18 monitoring systems** across the infrastructure:

**Security Playbook (8 systems)**:

1. System Resource Monitor
2. SSH Security Monitor (Enhanced - logs ALL SSH activity)
3. USB Device Monitor
4. Root Access Monitor
5. [Lynis](https://github.com/CISOfy/lynis) System Audit Monitor
6. Package Installation Monitor
7. Open Ports Monitor
8. SSL Certificate Monitor
9. **Node Playbook (1 system)**:
   - [PM2](https://github.com/Unitech/pm2) Service Failure Notifications
10. **MongoDB Playbook (3 systems)**:
    - [MongoDB](https://github.com/mongodb/mongo) Service Failure Notifications
    - MongoDB UFW Whitelist Update Monitoring
    - MongoDB Backup Monitoring
11. **Redis Playbook (4 systems)**:

- [Valkey](https://github.com/valkey-io/valkey)/Redis Service Failure Notifications
- Redis UFW Whitelist Update Monitoring
- Redis Backup Monitoring
- Redis Command Usage Monitoring

12. **Mail & DNS Playbooks (2 systems)**:

- Mail Service Failure Notifications
- [Unbound](https://github.com/NLnetLabs/unbound) DNS Service Failure Notifications

**Each system includes**:

- ✅ Purpose and description
- ✅ Files deployed
- ✅ Testing commands
- ✅ Alert trigger tests
- ✅ Validation checklists
- ✅ Troubleshooting procedures

> [!TIP]
> Use this guide to verify all monitoring systems after deployment or infrastructure changes.

---

## 🔧 Operations & Maintenance

### MongoDB Operations

**[MongoDB Operations Guide](docs/MONGODB_OPERATIONS_GUIDE.md)**

Comprehensive operational procedures including:

- 🔄 Backup and restore procedures
- 📊 Monitoring and health checks
- 🔍 Query optimization
- 🗄️ Index management
- 📈 Capacity planning
- 🚨 Troubleshooting common issues

> [!NOTE]
> This guide covers day-to-day [MongoDB](https://github.com/mongodb/mongo) administration tasks.

### Service User Management

**[Service User Audit](docs/SERVICE_USER_AUDIT.md)**

Documentation of service users and their permissions:

- 👤 User roles and responsibilities
- 🔑 Permission matrices
- 📁 File ownership guidelines
- 🔒 Security considerations

---

## ⚡ Performance Tuning

### MongoDB Performance

**[MongoDB Performance Tuning Guide](docs/MONGODB_PERFORMANCE_TUNING.md)**

Optimize [MongoDB](https://github.com/mongodb/mongo) for production workloads:

- 🎯 WiredTiger cache configuration
- 💾 Memory allocation strategies
- 🔄 Connection pool tuning
- 📊 Query performance optimization
- 🗂️ Index strategies
- 💿 Storage engine tuning

> [!TIP]
> Apply these optimizations after initial deployment and load testing.

### Redis/Valkey Performance

**[Redis Performance Tuning Guide](docs/REDIS_PERFORMANCE_TUNING.md)**

Maximize [Redis](https://github.com/redis/redis)/[Valkey](https://github.com/valkey-io/valkey) performance:

- 🚀 Memory optimization
- ⚡ I/O threading configuration
- 🔄 Persistence strategies
- 📈 Monitoring and metrics
- 🎯 Eviction policies
- 🔧 Kernel parameter tuning

---

## 🆘 Disaster Recovery

**[Disaster Recovery Guide](docs/DISASTER_RECOVERY.md)**

Complete disaster recovery procedures:

- 💾 Backup strategies and schedules
- 🔄 Restore procedures
- 🚨 Incident response workflows
- 📋 Recovery checklists
- 🧪 Testing procedures
- 📞 Escalation paths

> [!CAUTION]
> Review and test disaster recovery procedures regularly. Don't wait for an actual disaster!

### Backup Schedule

| Service        | Frequency     | Retention | Storage       |
| -------------- | ------------- | --------- | ------------- |
| MongoDB        | Every 6 hours | 30 days   | Cloudflare R2 |
| Redis/Valkey   | Every 6 hours | 30 days   | Cloudflare R2 |
| System configs | Daily         | 90 days   | Cloudflare R2 |

> [!NOTE]
> Backups older than 7 days are consolidated to one per day to save storage space.

---

## 🔒 Security & Auditing

### Email Alerting System

All critical system events are monitored and reported via email:

- 🚫 **[fail2ban](https://github.com/fail2ban/fail2ban)** - IP ban notifications
- 📦 **unattended-upgrades** - System update alerts
- 💾 **MongoDB backups** - Backup failure alerts
- 💾 **Redis backups** - Backup failure alerts
- 🔴 **[PM2](https://github.com/Unitech/pm2) errors** - Application crash notifications
- ⚠️ **[systemd](https://github.com/systemd/systemd) failures** - Service failure alerts
- 📊 **Resource monitoring** - CPU/Memory threshold alerts
- 🔐 **SSH security** - Failed login and root access alerts
- 🔌 **USB devices** - Unknown device detection alerts
- 👤 **Root access** - Privilege escalation alerts

> [!IMPORTANT]
> Configure `POSTFIX_RCPTS` environment variable to receive alerts.

### Rate Limiting

Email alerts are rate-limited to prevent flooding:

- **Limit**: 10 emails per hour per service (varies by alert type)
- **Tracking**: Lockfile-based in `/var/lock/` and JSON-based in `/var/lib/email-rate-limits/`
- **Logging**: All rate limit events logged to syslog and service logs

---

## 🔧 Common Commands

### Check Monitoring Status

```bash
# View all monitoring timers
sudo systemctl list-timers | grep -E "monitor|backup|update.*ufw"

# Check specific monitoring service
sudo systemctl status system-resource-monitor.timer
sudo systemctl status ssh-security-monitor.timer

# View monitoring logs
sudo tail -f /var/log/system-resource-monitor.log
sudo tail -f /var/log/ssh-security-monitor.log
```

### Manually Trigger Monitoring

```bash
# Trigger resource monitoring
sudo systemctl start system-resource-monitor.service

# Trigger SSH security check
sudo systemctl start ssh-security-monitor.service

# Trigger USB device check
sudo systemctl start usb-device-monitor.service

# Trigger root access check
sudo systemctl start root-access-monitor.service
```

### View Service Status

```bash
# Check PM2 status
sudo systemctl status pm2-deploy.service

# Check MongoDB status
sudo systemctl status mongod.service

# Check Redis/Valkey status
sudo systemctl status valkey-server.service

# Check mail services
sudo systemctl status postfix.service
```

### Check Logs

```bash
# Application logs
sudo tail -f /var/log/pm2/app-out.log
sudo tail -f /var/log/pm2/app-error.log

# Database logs
sudo tail -f /var/log/mongodb/mongod.log
sudo tail -f /var/log/redis/redis-server.log

# Monitoring logs
sudo tail -f /var/log/*monitor*.log

# Mail logs
sudo tail -f /var/log/mail.log

# System logs
sudo journalctl -u <service-name> -n 50
```

---

## 🔗 Related Resources

### External Documentation

- [Ansible Documentation](https://docs.ansible.com/)
- [Ansible GitHub](https://github.com/ansible/ansible)
- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [MongoDB GitHub](https://github.com/mongodb/mongo)
- [Redis Documentation](https://redis.io/documentation)
- [Redis GitHub](https://github.com/redis/redis)
- [Valkey Documentation](https://valkey.io/docs/)
- [Valkey GitHub](https://github.com/valkey-io/valkey)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [PM2 GitHub](https://github.com/Unitech/pm2)
- [systemd Documentation](https://www.freedesktop.org/wiki/Software/systemd/)
- [systemd GitHub](https://github.com/systemd/systemd)
- [fail2ban GitHub](https://github.com/fail2ban/fail2ban)
- [Unbound Documentation](https://nlnetlabs.nl/documentation/unbound/)
- [Unbound GitHub](https://github.com/NLnetLabs/unbound)

### Ansible Roles Used

- [`trfore/ansible-role-mongodb-install`](https://github.com/trfore/ansible-role-mongodb-install) v3.0.5 - MongoDB installation
- [`hifis.toolkit`](https://github.com/hifis-net/ansible-collection-toolkit) collection v6.2.2 - System hardening and unattended upgrades

> [!NOTE] > [Valkey](https://github.com/valkey-io/valkey) (Redis fork) is installed directly via APT packages without using Galaxy roles for maximum control and compatibility.

---

## 📝 Document Conventions

Throughout this documentation, you'll see these GitHub-style alerts:

> [!NOTE]
> General information and helpful context

> [!TIP]
> Suggestions and best practices

> [!IMPORTANT]
> Critical information that must be followed

> [!WARNING]
> Potential issues or risks to be aware of

> [!CAUTION]
> Dangerous operations that could cause data loss or downtime

---

## 🤝 Contributing

When adding new documentation:

1. Use GitHub-style markdown alerts for important information
2. Include practical examples and commands
3. Add cross-references to related documents
4. Keep this table of contents updated
5. Test all commands before documenting them
6. Add GitHub links for all mentioned tools and libraries
7. Place all documentation files in the `docs/` directory

When making infrastructure changes:

1. Test playbooks in a staging environment first
2. Update relevant documentation in `docs/`
3. Follow existing patterns and conventions
4. Document all environment variables and configuration

---

## 📧 Support

For questions or issues:

1. Check the relevant guide in the `docs/` directory
2. Review the troubleshooting sections
3. Check application logs: `/var/log/pm2/`, `/var/log/mongodb/`, `/var/log/redis/`, `/var/log/*monitor*.log`
4. Contact the infrastructure team
