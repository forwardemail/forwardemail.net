# Ansible Documentation

> [!NOTE]
> This directory contains comprehensive documentation for deploying and managing the Forward Email infrastructure using Ansible.

## 📚 Table of Contents

- [Getting Started](#getting-started)
- [Deployment Guides](#deployment-guides)
- [Operations & Maintenance](#operations--maintenance)
- [Performance Tuning](#performance-tuning)
- [Disaster Recovery](#disaster-recovery)
- [Security & Auditing](#security--auditing)

---

## 🚀 Getting Started

> [!IMPORTANT]
> Before deploying any services, ensure you have:
> - Ansible 2.9+ installed
> - SSH access to target servers
> - Required environment variables configured
> - SSL/TLS certificates ready

### Quick Start

```bash
# 1. Install Ansible dependencies
ansible-galaxy install -r ansible/requirements.yml

# 2. Configure environment variables
export POSTFIX_USERNAME=mailerdaemon@forwardemail.net
export POSTFIX_PASSWORD=<secure_password>
export POSTFIX_RCPTS=security@forwardemail.net

# 3. Deploy security baseline
ansible-playbook ansible/playbooks/security.yml -i hosts.yml

# 4. Deploy your services
ansible-playbook ansible/playbooks/node.yml -i hosts.yml
```

---

## 📖 Deployment Guides

### Database Deployment

**[MongoDB & Redis/Valkey Deployment Guide](README_MONGO_REDIS.md)**

Complete guide for deploying MongoDB v6 and Valkey (Redis fork) with:
- ✅ SSL/TLS encryption
- ✅ UFW firewall configuration
- ✅ Automated backups to Cloudflare R2
- ✅ Email alerting system
- ✅ Security hardening

> [!TIP]
> Start here if you're deploying database services for the first time.

### Mail Server Deployment

**[Mail Server Deployment Guide](MAIL_DEPLOYMENT.md)**

Step-by-step guide for deploying SMTP, IMAP, POP3, and other mail services:
- 📧 SMTP server configuration (ports 25, 587, 465, 2525, 2587, 2465, 2455, 2555)
- 📬 IMAP server setup (ports 993, 2993)
- 📮 POP3 server setup (ports 995, 2995)
- 🔐 TLS/SSL certificate management
- 🛡️ Security best practices

> [!WARNING]
> Mail servers require proper DNS configuration (MX, SPF, DKIM, DMARC) before deployment.

---

## 🔧 Operations & Maintenance

### MongoDB Operations

**[MongoDB Operations Guide](MONGODB_OPERATIONS_GUIDE.md)**

Comprehensive operational procedures including:
- 🔄 Backup and restore procedures
- 📊 Monitoring and health checks
- 🔍 Query optimization
- 🗄️ Index management
- 📈 Capacity planning
- 🚨 Troubleshooting common issues

> [!NOTE]
> This guide covers day-to-day MongoDB administration tasks.

### Service User Management

**[Service User Audit](SERVICE_USER_AUDIT.md)**

Documentation of service users and their permissions:
- 👤 User roles and responsibilities
- 🔑 Permission matrices
- 📁 File ownership guidelines
- 🔒 Security considerations

---

## ⚡ Performance Tuning

### MongoDB Performance

**[MongoDB Performance Tuning Guide](MONGODB_PERFORMANCE_TUNING.md)**

Optimize MongoDB for production workloads:
- 🎯 WiredTiger cache configuration
- 💾 Memory allocation strategies
- 🔄 Connection pool tuning
- 📊 Query performance optimization
- 🗂️ Index strategies
- 💿 Storage engine tuning

> [!TIP]
> Apply these optimizations after initial deployment and load testing.

### Redis/Valkey Performance

**[Redis Performance Tuning Guide](REDIS_PERFORMANCE_TUNING.md)**

Maximize Redis/Valkey performance:
- 🚀 Memory optimization
- ⚡ I/O threading configuration
- 🔄 Persistence strategies
- 📈 Monitoring and metrics
- 🎯 Eviction policies
- 🔧 Kernel parameter tuning

---

## 🆘 Disaster Recovery

**[Disaster Recovery Guide](DISASTER_RECOVERY.md)**

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

| Service | Frequency | Retention | Storage |
|---------|-----------|-----------|---------|
| MongoDB | Every 6 hours | 30 days | Cloudflare R2 |
| Redis/Valkey | Every 6 hours | 30 days | Cloudflare R2 |
| System configs | Daily | 90 days | Cloudflare R2 |

> [!NOTE]
> Backups older than 7 days are consolidated to one per day to save storage space.

---

## 🔒 Security & Auditing

### Email Alerting System

All critical system events are monitored and reported via email:

- 🚫 **fail2ban** - IP ban notifications
- 📦 **unattended-upgrades** - System update alerts
- 💾 **MongoDB backups** - Backup failure alerts
- 💾 **Redis backups** - Backup failure alerts
- 🔴 **PM2 errors** - Application crash notifications
- ⚠️ **systemd failures** - Service failure alerts

> [!IMPORTANT]
> Configure `POSTFIX_RCPTS` environment variable to receive alerts.

### Rate Limiting

Email alerts are rate-limited to prevent flooding:
- **Limit**: 10 emails per hour per service
- **Tracking**: JSON-based in `/var/lib/email-rate-limits/`
- **Logging**: All rate limit events logged to syslog

---

## 🔗 Related Resources

### External Documentation

- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Valkey Documentation](https://valkey.io/docs/)
- [Ansible Documentation](https://docs.ansible.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

### Ansible Roles Used

- `trfore/ansible-role-mongodb-install` v3.0.5 - MongoDB installation
- `hifis.toolkit` collection v6.2.2 - System hardening and unattended upgrades

> [!NOTE]
> Valkey (Redis fork) is installed directly via APT packages without using Galaxy roles for maximum control and compatibility.

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
4. Keep the table of contents updated
5. Test all commands before documenting them

---

## 📧 Support

For questions or issues:

1. Check the relevant guide in this directory
2. Review the troubleshooting sections
3. Check application logs: `/var/log/pm2/`, `/var/log/mongodb/`, `/var/log/redis/`
4. Contact the infrastructure team

---

**Last Updated**: November 25, 2025  
**Version**: 2.0.0  
**Maintained By**: Forward Email Infrastructure Team
