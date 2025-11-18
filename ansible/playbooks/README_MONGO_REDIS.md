# MongoDB and Redis Ansible Playbooks

This document describes the MongoDB (`mongo.yml`) and Redis (`redis.yml`) Ansible playbooks for the Forward Email infrastructure.

## Overview

These playbooks provide complete automation for:

- **MongoDB v6** installation and configuration
- **Redis** installation and configuration
- **TLS/SSL encryption** for both databases
- **UFW firewall** with dynamic IP whitelist management
- **Automated encrypted backups** to Cloudflare R2 every 6 hours
- **Intelligent backup retention** (30-day retention with daily consolidation after 7 days)

## Prerequisites

### Ansible Roles

Install the required Ansible roles from Galaxy:

```bash
ansible-galaxy install trfore.mongodb_install
ansible-galaxy install geerlingguy.redis
```

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
export REDIS_DATA_DIR="/var/lib/redis"  # Optional, defaults to "/var/lib/redis"
```

## Features

### 1. Security & Access Control

#### Dynamic IP Whitelist

Both playbooks automatically fetch and maintain an IP whitelist from:
```
https://forwardemail.net/ips/v4.txt?comments=false
```

- UFW rules are updated every 10 minutes via systemd timer
- Only whitelisted IPs can access MongoDB (port 27017) and Redis (port 6380)
- Automatic addition of new IPs and removal of old IPs
- Changes are applied without manual intervention

#### TLS/SSL Encryption

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

All backups are encrypted using **GPG symmetric encryption** with AES256 cipher before uploading to R2:

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

### 4. Restoring Encrypted Backups

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
  gpg --decrypt --batch --yes --passphrase "$BACKUP_SECRET" > /var/lib/redis/dump.rdb

# Set ownership
sudo chown redis:redis /var/lib/redis/dump.rdb

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
