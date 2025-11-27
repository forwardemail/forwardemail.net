# MongoDB and Valkey Deployment Guide

> [!NOTE]
> This document describes the MongoDB (`mongo.yml`) and Valkey (`redis.yml`) Ansible playbooks for the Forward Email infrastructure.

> [!NOTE]
> We use Valkey, a Redis fork, installed directly via APT packages for maximum compatibility and control.

> [!IMPORTANT]
> These playbooks deploy production-grade database infrastructure with automated backups, security hardening, and email alerting..

## Overview

These playbooks provide complete automation for:

- **MongoDB v6** installation and configuration
- **Valkey** (Redis fork) installation and configuration
- **Dynamic swap configuration** (swap file size = system RAM)
- **TLS/SSL encryption** for both databases
- **UFW firewall** with dynamic IP whitelist management
- **DNS caching** with DNSSEC, DANE, and DNS-over-TLS support
- **Kernel optimizations** for database performance
- **Automated encrypted backups** to Cloudflare R2 every 6 hours
- **Intelligent backup retention** (30-day retention with daily consolidation after 7 days)

## Architecture

### Inheritance Model

Both MongoDB and Redis playbooks inherit base configurations from `security.yml`:

```
security.yml (imported by mongo.yml and redis.yml)
├── Transparent Huge Pages (THP) disabled
├── ulimits configured (nofile: 65536, nproc: 65536)
├── Base sysctl settings (vm.swappiness: 0)
├── devops and deploy user creation
├── SSH hardening
└── Unbound DNS caching (via unbound.yml)

mongo.yml / redis.yml
├── Database-specific sysctl optimizations
├── TLS/SSL configuration
├── UFW firewall with IP whitelist
├── Automated encrypted backups to R2
└── Database installation and configuration
```

> [!TIP]
> **Key point:** THP, ulimits, and base sysctl settings are configured once in `security.yml` and inherited by all hosts including `mongo` and `redis`. This avoids duplication and ensures consistency.

### User Model

> [!IMPORTANT]
> **Security best practice:** Database services run as dedicated unprivileged users:

- **MongoDB** runs as `mongod` user (created by MongoDB package)
- **Redis** runs as `redis` user (created by Redis package)
- **deploy** user is for application code deployment
- **devops** user has sudo access for administration

This provides proper isolation and follows the principle of least privilege.

## Files

- **`mongo.yml`** - MongoDB deployment playbook
- **`redis.yml`** - Redis deployment playbook
- **`unbound.yml`** - DNS caching with DNSSEC/DANE support
- **`security.yml`** - Security hardening (updated to include mongo/redis hosts)
- **`requirements.yml`** - Ansible Galaxy role dependencies

## Prerequisites

### Ansible Roles

Install the required Ansible roles from Galaxy:

```bash
cd /path/to/forwardemail.net
ansible-galaxy install -r ansible/requirements.yml
```

This installs:
- `trfore.mongodb_install` v3.0.5 - MongoDB installation

### Environment Variables

The following environment variables must be set before running the playbooks:

#### Common Variables

```bash
# SSL/TLS Certificates
export SSL_KEY_PATH="/path/to/ssl/key.pem"
export SSL_CERT_PATH="/path/to/ssl/cert.pem"
export SSL_CA_PATH="/path/to/ssl/ca.pem"

# Cloudflare R2 / S3-Compatible Storage
export AWS_ACCESS_KEY_ID="your-r2-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-r2-secret-access-key"
export AWS_ENDPOINT_URL="https://your-account-id.r2.cloudflarestorage.com"

# Backup Encryption
export BACKUP_SECRET="your-strong-backup-encryption-password"
```

#### MongoDB-Specific Variables

```bash
export MONGO_HOST="mongo.example.com"
export MONGO_BACKUP_BUCKET="forwardemail-backups"  # Optional, defaults to "forwardemail-backups"
```

#### Redis-Specific Variables

```bash
export REDIS_HOST="redis.example.com"
export REDIS_PASSWORD="your-strong-redis-password"
export REDIS_BACKUP_BUCKET="forwardemail-backups"  # Optional, defaults to "forwardemail-backups"
export REDIS_DATA_DIR="/var/lib/valkey"  # Optional, defaults to "/var/lib/valkey"
```

## Features

### 1. Security & Access Control

#### Dynamic IP Whitelist

> [!NOTE]
> Both playbooks automatically fetch and maintain an IP whitelist from:
```
https://forwardemail.net/ips/v4.txt?comments=false
```

- UFW rules are updated every 10 minutes via systemd timer
- Only whitelisted IPs can access MongoDB (port 27017) and Redis (port 6380)
- Automatic addition of new IPs and removal of old IPs
- Changes are applied without manual intervention

#### TLS/SSL Encryption

> [!IMPORTANT]
> All database connections are encrypted with TLS/SSL.

**MongoDB:**
- Configured with `requireTLS` mode
- Uses combined PEM file (certificate + key)
- CA certificate for client verification
- All connections must use TLS

**Redis:**
- TLS enabled on port 6380 (standard port 6379 disabled)
- Password authentication required
- Separate certificate, key, and CA files
- Client authentication optional (`tls-auth-clients no`)

### 2. Automated Encrypted Backups

#### Backup Schedule

- Backups run every 6 hours via systemd timer
- First backup runs 15 minutes after boot
- Subsequent backups run at 6-hour intervals

#### Encryption

> [!IMPORTANT]
> All backups are encrypted using **GPG symmetric encryption** with AES256 cipher before uploading to R2:

```bash
# MongoDB backup encryption
mongodump --oplog --archive --gzip | \
  gpg --symmetric --cipher-algo AES256 --batch --yes --passphrase "$BACKUP_SECRET" | \
  aws s3 cp - s3://bucket/path/backup.archive.gz.gpg

# Redis backup encryption
gpg --symmetric --cipher-algo AES256 --batch --yes --passphrase "$BACKUP_SECRET" < dump.rdb | \
  aws s3 cp - s3://bucket/path/backup.rdb.gpg
```

#### Backup Strategy

**MongoDB:**
- Uses `mongodump` with `--oplog` for point-in-time recovery capability
- Compressed with gzip before encryption
- Streamed directly to R2 (no local storage required)

**Redis:**
- Uses `BGSAVE` command (non-blocking background save)
- Creates RDB snapshot without impacting production
- Waits for BGSAVE completion before uploading

#### Storage Structure

Backups are organized in a hierarchical folder structure for easy navigation:

```
s3://bucket-name/
  mongodb/
    2025/
      11/
        18/
          00/mongodb-backup-20251118-000015.archive.gz.gpg
          06/mongodb-backup-20251118-060015.archive.gz.gpg
          12/mongodb-backup-20251118-120015.archive.gz.gpg
          18/mongodb-backup-20251118-180015.archive.gz.gpg
  redis/
    2025/
      11/
        18/
          00/redis-backup-20251118-000015.rdb.gpg
          06/redis-backup-20251118-060015.rdb.gpg
          12/redis-backup-20251118-120015.rdb.gpg
          18/redis-backup-20251118-180015.rdb.gpg
```

### 3. Intelligent Backup Retention

Cleanup runs automatically after each backup with the following retention policy:

- **0-7 days**: Keep all backups (4 per day = 28 backups)
- **8-30 days**: Keep only the latest backup per day (23 backups)
- **30+ days**: Delete all backups

This provides:
- Fine-grained recovery for the past week
- Daily recovery points for the past month
- Automatic cleanup to control storage costs

### 4. DNS Caching with DNSSEC and DANE

**Unbound DNS resolver** is automatically configured on all hosts via `unbound.yml` (imported by `security.yml`).

**Features:**
- **DNSSEC validation** - Cryptographic verification of DNS responses
- **DANE/TLSA support** - DNS-based authentication of TLS certificates
- **DNS-over-TLS (DoT)** - Encrypted DNS queries to Cloudflare (1.1.1.1)
- **Query minimization** - Enhanced privacy
- **Aggressive NSEC** - Faster negative responses
- **DNS rebinding protection** - Security hardening

**Cache TTLs optimized for fast failover:**
- Minimum TTL: 60 seconds
- Maximum TTL: 300 seconds (5 minutes)
- Negative cache TTL: 60 seconds

**Verification:**
```bash
# Test DNS resolution
dig @127.0.0.1 +short cloudflare.com

# Verify DNSSEC
dig @127.0.0.1 +dnssec cloudflare.com

# Check DANE/TLSA records
dig @127.0.0.1 +short TLSA _443._tcp.example.com

# Check Unbound status
sudo systemctl status unbound
```

### 5. Dynamic Swap Configuration

Both MongoDB and Redis playbooks automatically configure swap space per official recommendations.

**Redis Official Documentation:**
> "Ensured that swap is enabled and that your swap file size is equal to amount of memory on your system. If Linux does not have swap set up, and your Redis instance accidentally consumes too much memory, Redis can crash when it is out of memory, or the Linux kernel OOM killer can kill the Redis process."

Source: [Redis Administration - Memory](https://redis.io/docs/latest/operate/oss_and_stack/management/admin/)

**Implementation:**
- Automatically detects total system RAM using `free -m`
- Creates `/swapfile` with size equal to RAM
- Sets `vm.swappiness=1` (minimize swapping but allow for safety)
- Overrides `vm.swappiness=0` from security.yml
- Idempotent: only recreates swap if size doesn't match RAM
- Persists across reboots via `/etc/fstab`

**Verification:**
```bash
# Check swap status
sudo swapon --show

# Check swappiness setting
sysctl vm.swappiness

# View swap usage
free -h
```

**Why this matters:**
- **Without swap:** Database crashes or OOM killer terminates process
- **With swap:** Latency spikes are detectable, allowing intervention before crash
- **Swappiness=1:** Minimizes performance impact while providing safety net

### 6. Performance Optimizations

#### Kernel Parameters (Inherited from security.yml)

**Base settings for all hosts:**
- `vm.swappiness = 0` - Disable swapping (overridden to `1` for MongoDB/Redis)
- `nofile = 65536` - File descriptor limit
- `nproc = 65536` - Process limit
- THP disabled via systemd service

#### MongoDB-Specific Optimizations

```
vm.dirty_background_ratio = 10
vm.dirty_ratio = 20
net.core.somaxconn = 4096
net.ipv4.tcp_max_syn_backlog = 4096
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_intvl = 30
net.ipv4.tcp_keepalive_time = 120
```

#### Redis-Specific Optimizations

```
vm.overcommit_memory = 1
net.core.somaxconn = 65536
net.ipv4.tcp_max_syn_backlog = 65536
```

**See:** `MONGODB_PERFORMANCE_TUNING.md` and `REDIS_PERFORMANCE_TUNING.md` for detailed explanations.

### 6. Restoring Encrypted Backups

#### MongoDB Restore

```bash
# Download and decrypt backup
aws s3 cp s3://bucket/mongodb/2025/11/18/00/backup.archive.gz.gpg - \
  --endpoint-url="$AWS_ENDPOINT_URL" | \
  gpg --decrypt --batch --yes --passphrase "$BACKUP_SECRET" | \
  mongorestore --archive --gzip --oplogReplay

# Or save to file first
aws s3 cp s3://bucket/mongodb/2025/11/18/00/backup.archive.gz.gpg backup.gpg \
  --endpoint-url="$AWS_ENDPOINT_URL"
gpg --decrypt --output backup.archive.gz backup.gpg
mongorestore --archive=backup.archive.gz --gzip --oplogReplay
```

#### Redis Restore

```bash
# Stop Redis
sudo systemctl stop redis-server

# Download, decrypt, and restore
aws s3 cp s3://bucket/redis/2025/11/18/00/backup.rdb.gpg - \
  --endpoint-url="$AWS_ENDPOINT_URL" | \
  gpg --decrypt --batch --yes --passphrase "$BACKUP_SECRET" > /var/lib/valkey/dump.rdb

# Set ownership
sudo chown redis:redis /var/lib/valkey/dump.rdb

# Start Redis
sudo systemctl start redis-server
```

## Usage

### Running the Playbooks

#### MongoDB

```bash
# Set environment variables
export MONGO_HOST="mongo.example.com"
export SSL_KEY_PATH="/path/to/ssl/key.pem"
export SSL_CERT_PATH="/path/to/ssl/cert.pem"
export SSL_CA_PATH="/path/to/ssl/ca.pem"
export AWS_ACCESS_KEY_ID="your-r2-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-r2-secret-access-key"
export AWS_ENDPOINT_URL="https://your-account-id.r2.cloudflarestorage.com"
export BACKUP_SECRET="your-backup-password"

# Run playbook
ansible-playbook ansible/playbooks/mongo.yml -i ansible/playbooks/templates/hosts.yml
```

#### Redis

```bash
# Set environment variables
export REDIS_HOST="redis.example.com"
export REDIS_PASSWORD="your-redis-password"
export SSL_KEY_PATH="/path/to/ssl/key.pem"
export SSL_CERT_PATH="/path/to/ssl/cert.pem"
export SSL_CA_PATH="/path/to/ssl/ca.pem"
export AWS_ACCESS_KEY_ID="your-r2-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-r2-secret-access-key"
export AWS_ENDPOINT_URL="https://your-account-id.r2.cloudflarestorage.com"
export BACKUP_SECRET="your-backup-password"

# Run playbook
ansible-playbook ansible/playbooks/redis.yml -i ansible/playbooks/templates/hosts.yml
```

## Monitoring & Maintenance

### Check Backup Status

```bash
# MongoDB backup timer status
sudo systemctl status mongodb-backup.timer

# Redis backup timer status
sudo systemctl status redis-backup.timer

# View backup logs
sudo journalctl -u mongodb-backup.service -f
sudo journalctl -u redis-backup.service -f
```

### Check UFW Whitelist Updates

```bash
# MongoDB UFW whitelist timer status
sudo systemctl status mongo-ufw-whitelist-update.timer

# Redis UFW whitelist timer status
sudo systemctl status redis-ufw-whitelist-update.timer

# View UFW status
sudo ufw status numbered
```

### Manual Backup Trigger

```bash
# Trigger MongoDB backup manually
sudo systemctl start mongodb-backup.service

# Trigger Redis backup manually
sudo systemctl start redis-backup.service
```

### List Backups in R2

```bash
# List MongoDB backups
aws s3 ls s3://forwardemail-backups/mongodb/ --recursive --endpoint-url="$AWS_ENDPOINT_URL"

# List Redis backups
aws s3 ls s3://forwardemail-backups/redis/ --recursive --endpoint-url="$AWS_ENDPOINT_URL"
```

## Security Considerations

1. **BACKUP_SECRET**: Store securely (e.g., in a password manager or secrets management system)
2. **SSL Certificates**: Ensure certificates are properly secured with appropriate file permissions
3. **R2 Credentials**: Use dedicated R2 access keys with minimal permissions (read/write to backup bucket only)
4. **Redis Password**: Use a strong password (generate with `openssl rand -base64 32`)
5. **IP Whitelist**: Regularly verify the IP whitelist source is accurate and up-to-date

## Troubleshooting

### MongoDB won't start

```bash
# Check MongoDB logs
sudo journalctl -u mongod -n 50

# Verify TLS certificate permissions
ls -la /etc/mongodb/ssl/

# Test TLS certificate
openssl x509 -in /etc/mongodb/ssl/mongodb.pem -text -noout
```

### Redis won't start

```bash
# Check Redis logs
sudo journalctl -u redis-server -n 50

# Verify Redis configuration
redis-server --test-memory 1024

# Check TLS configuration
redis-cli --tls --cert "$SSL_CERT_PATH" --key "$SSL_KEY_PATH" --cacert "$SSL_CA_PATH" -p 6380 PING
```

### Backup failures

```bash
# Check backup service logs
sudo journalctl -u mongodb-backup.service -n 50
sudo journalctl -u redis-backup.service -n 50

# Verify R2 credentials
aws s3 ls --endpoint-url="$AWS_ENDPOINT_URL"

# Test GPG encryption
echo "test" | gpg --symmetric --cipher-algo AES256 --batch --yes --passphrase "test" | gpg --decrypt --batch --yes --passphrase "test"
```

### UFW whitelist not updating

```bash
# Check timer status
sudo systemctl status mongo-ufw-whitelist-update.timer

# Manually run update script
sudo /usr/local/bin/update-mongo-ufw-whitelist.sh

# Verify IP list is accessible
curl -s https://forwardemail.net/ips/v4.txt?comments=false
```

## Performance Considerations

### MongoDB

- Backups run with `--oplog` which captures incremental changes
- `mongodump` reads from the database but doesn't block writes
- Consider running backups during off-peak hours if performance is critical
- Monitor WiredTiger cache pressure during backups

### Redis

- `BGSAVE` uses fork() which requires free memory equal to dataset size
- No blocking of client operations during backup
- Monitor disk I/O during save operations
- RDB persistence configured with balanced save intervals

## Architecture

### MongoDB Configuration

- **Version**: MongoDB 6.0.18 (Community Edition)
- **Port**: 27017 (TLS required)
- **Authentication**: Enabled
- **Storage Engine**: WiredTiger
- **Replication**: Not configured (standalone)

### Redis Configuration

- **Port**: 6380 (TLS), 6379 disabled
- **Authentication**: Password required
- **Persistence**: RDB + AOF
- **AOF Sync**: everysec
- **RDB Save**: 900s/1 change, 300s/10 changes, 60s/10000 changes

## License

Copyright (c) Forward Email LLC
SPDX-License-Identifier: BUSL-1.1
