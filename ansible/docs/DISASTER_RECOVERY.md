# Disaster Recovery Guide

> \[!CAUTION]
> This guide provides comprehensive procedures for recovering MongoDB and Redis databases from catastrophic failures and migrating to new servers with minimal downtime.

> \[!IMPORTANT]
> Review and test these procedures regularly. Don't wait for an actual disaster!


## Table of Contents

* [DNS TTL Configuration](#dns-ttl-configuration)
  * [Recommended TTL Values](#recommended-ttl-values)
  * [Setting DNS TTL for Database Hostnames](#setting-dns-ttl-for-database-hostnames)
* [MongoDB Disaster Recovery](#mongodb-disaster-recovery)
  * [Scenario 1: Complete Server Failure](#scenario-1-complete-server-failure)
  * [Scenario 2: Data Corruption](#scenario-2-data-corruption)
* [Redis Disaster Recovery](#redis-disaster-recovery)
  * [Scenario 1: Complete Server Failure](#scenario-1-complete-server-failure-1)
  * [Scenario 2: Data Loss (Cache Invalidation)](#scenario-2-data-loss-cache-invalidation)
* [Failover to New Server](#failover-to-new-server)
  * [Pre-Failover Checklist](#pre-failover-checklist)
  * [Planned Failover Procedure (Zero-Downtime)](#planned-failover-procedure-zero-downtime)
* [Testing Disaster Recovery](#testing-disaster-recovery)
  * [Regular DR Testing Schedule](#regular-dr-testing-schedule)
  * [DR Test Procedure](#dr-test-procedure)
  * [Backup Verification Script](#backup-verification-script)
* [Emergency Contacts and Escalation](#emergency-contacts-and-escalation)
  * [Critical Incident Response](#critical-incident-response)
  * [Escalation Path](#escalation-path)
* [Post-Incident Review](#post-incident-review)
* [Additional Resources](#additional-resources)
* [License](#license)


## DNS TTL Configuration

### Recommended TTL Values

The playbooks configure local DNS caching with [Unbound](https://github.com/NLnetLabs/unbound) to enable fast failover during outages.

**For MongoDB and Redis hostnames:**

* **Production A/AAAA Records**: 300 seconds (5 minutes)
* **Staging/Dev A/AAAA Records**: 60 seconds (1 minute)

**Rationale:**

Short TTL values allow quick DNS propagation when switching to a new server during an outage. A 5-minute TTL strikes the right balance between fast failover and reducing DNS query load.

**Local DNS Cache Settings:**

The Unbound DNS resolver is configured with:

```yaml
cache-min-ttl: 60      # 1 minute minimum
cache-max-ttl: 300     # 5 minutes maximum
cache-neg-ttl: 60      # 1 minute for negative responses
```

These settings ensure that even if upstream DNS has longer TTLs, the local cache will refresh within 5 minutes, enabling rapid failover.

### Setting DNS TTL for Database Hostnames

**Example DNS Records (Cloudflare):**

```
# MongoDB Server
mongo.example.com    A      1.2.3.4      TTL: 300
mongo.example.com    AAAA   2001:db8::1  TTL: 300

# Redis Server
redis.example.com    A      1.2.3.5      TTL: 300
redis.example.com    AAAA   2001:db8::2  TTL: 300
```

> \[!WARNING]
> **Important:** Set these TTL values **before** an outage occurs. Changing TTL during an outage will not take effect until the old TTL expires.

---


## MongoDB Disaster Recovery

### Scenario 1: Complete Server Failure

> \[!CAUTION]
> **Critical scenario requiring immediate action**

**Symptoms:**

* MongoDB server is completely unreachable
* Hardware failure, data center outage, or catastrophic software failure

**Recovery Steps:**

#### Step 1: Provision New Server

```bash
# Provision new server with same or better specs
# Recommended: Same MongoDB version as backup

# Run Ansible playbook to configure new server
ansible-playbook -i inventory ansible/playbooks/mongo.yml
```

#### Step 2: Restore from Cloudflare R2 Backup

```bash
# List available backups
aws s3 ls s3://forwardemail-backups/mongodb/ --recursive --endpoint-url="$AWS_ENDPOINT_URL"

# Choose the most recent backup
BACKUP_PATH="mongodb/2025/11/20/00/mongodb-backup-20251120-000000.archive.gz.gpg"

# Stop MongoDB on new server
sudo systemctl stop mongod

# Restore encrypted backup
aws s3 cp "s3://forwardemail-backups/${BACKUP_PATH}" - --endpoint-url="$AWS_ENDPOINT_URL" | \
  gpg --decrypt --batch --yes --passphrase "$BACKUP_SECRET" | \
  mongorestore --archive --gzip --oplogReplay --drop

# Start MongoDB
sudo systemctl start mongod

# Verify restoration
mongosh --tls --tlsCertificateKeyFile=/etc/mongodb/ssl/mongodb.pem --tlsCAFile=/etc/mongodb/ssl/ca.pem
db.adminCommand({ listDatabases: 1 })
```

#### Step 3: Update DNS Records

```bash
# Update DNS A/AAAA records to point to new server IP
# Example using Cloudflare API:
curl -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"type":"A","name":"mongo.example.com","content":"NEW_IP","ttl":300}'
```

#### Step 4: Wait for DNS Propagation

```bash
# Wait for DNS TTL to expire (5 minutes for production)
# Monitor DNS propagation
watch -n 10 'dig +short mongo.example.com'

# Verify local DNS cache has updated
dig @127.0.0.1 +short mongo.example.com
```

#### Step 5: Verify Application Connectivity

```bash
# Test MongoDB connection from application servers
mongosh --host mongo.example.com --tls --tlsCertificateKeyFile=/path/to/client.pem --tlsCAFile=/path/to/ca.pem

# Check application logs for successful reconnection
```

**Expected Downtime:** 5-10 minutes (DNS TTL + restoration time)

### Scenario 2: Data Corruption

**Symptoms:**

* MongoDB is running but data is corrupted
* Queries returning incorrect results
* Database validation errors

**Recovery Steps:**

#### Step 1: Stop Application Writes

```bash
# Put MongoDB in read-only mode
mongosh --tls --tlsCertificateKeyFile=/etc/mongodb/ssl/mongodb.pem --tlsCAFile=/etc/mongodb/ssl/ca.pem
db.adminCommand({ fsync: 1, lock: true })
```

#### Step 2: Validate Database

```bash
# Check database integrity
db.adminCommand({ validate: "collectionName", full: true })

# If corruption is confirmed, proceed with restore
```

#### Step 3: Restore from Point-in-Time Backup

```bash
# Stop MongoDB
sudo systemctl stop mongod

# Backup current (corrupted) data
sudo mv /var/lib/mongodb /var/lib/mongodb.corrupted.$(date +%Y%m%d-%H%M%S)

# Restore from R2 backup (choose backup before corruption occurred)
aws s3 cp "s3://forwardemail-backups/mongodb/2025/11/19/18/mongodb-backup-20251119-180000.archive.gz.gpg" - \
  --endpoint-url="$AWS_ENDPOINT_URL" | \
  gpg --decrypt --batch --yes --passphrase "$BACKUP_SECRET" | \
  mongorestore --archive --gzip --oplogReplay

# Start MongoDB
sudo systemctl start mongod
```

#### Step 4: Verify Data Integrity

```bash
# Validate restored data
mongosh --tls --tlsCertificateKeyFile=/etc/mongodb/ssl/mongodb.pem --tlsCAFile=/etc/mongodb/ssl/ca.pem
db.adminCommand({ validate: "collectionName", full: true })
```

#### Step 5: Resume Application Writes

```bash
# Unlock MongoDB
db.adminCommand({ fsyncUnlock: 1 })
```

**Expected Downtime:** 10-30 minutes (depending on database size)

---


## Redis Disaster Recovery

### Scenario 1: Complete Server Failure

> \[!CAUTION]
> **Critical scenario requiring immediate action**

**Symptoms:**

* Redis server is completely unreachable
* Hardware failure or data center outage

**Recovery Steps:**

#### Step 1: Provision New Server

```bash
# Run Ansible playbook to configure new server
ansible-playbook -i inventory ansible/playbooks/redis.yml
```

#### Step 2: Restore from Cloudflare R2 Backup

```bash
# List available backups
aws s3 ls s3://forwardemail-backups/redis/ --recursive --endpoint-url="$AWS_ENDPOINT_URL"

# Choose the most recent backup
BACKUP_PATH="redis/2025/11/20/00/redis-backup-20251120-000000.rdb.gpg"

# Stop Redis
sudo systemctl stop redis-server

# Restore encrypted backup
aws s3 cp "s3://forwardemail-backups/${BACKUP_PATH}" - --endpoint-url="$AWS_ENDPOINT_URL" | \
  gpg --decrypt --batch --yes --passphrase "$BACKUP_SECRET" > /var/lib/valkey/dump.rdb

# Set correct permissions
sudo chown redis:redis /var/lib/valkey/dump.rdb
sudo chmod 640 /var/lib/valkey/dump.rdb

# Start Redis
sudo systemctl start redis-server
```

#### Step 3: Update DNS Records

```bash
# Update DNS A/AAAA records to point to new server IP
curl -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"type":"A","name":"redis.example.com","content":"NEW_IP","ttl":300}'
```

#### Step 4: Wait for DNS Propagation

```bash
# Wait for DNS TTL to expire (5 minutes)
watch -n 10 'dig +short redis.example.com'
```

#### Step 5: Verify Application Connectivity

```bash
# Test Redis connection
redis-cli -h redis.example.com -p 6380 --tls --cert /path/to/client.crt --key /path/to/client.key --cacert /path/to/ca.crt PING

# Check application logs for successful reconnection
```

**Expected Downtime:** 5-10 minutes (DNS TTL + restoration time)

### Scenario 2: Data Loss (Cache Invalidation)

**Symptoms:**

* Redis is running but data is missing or stale
* Cache hit rate drops to zero

**Recovery Steps:**

#### Step 1: Verify Redis is Running

```bash
sudo systemctl status redis-server
```

#### Step 2: Restore from Latest Backup (Optional)

```bash
# If you need to restore cached data (usually not necessary for cache)
sudo systemctl stop redis-server

aws s3 cp "s3://forwardemail-backups/redis/LATEST_BACKUP.rdb.gpg" - \
  --endpoint-url="$AWS_ENDPOINT_URL" | \
  gpg --decrypt --batch --yes --passphrase "$BACKUP_SECRET" > /var/lib/valkey/dump.rdb

sudo chown redis:redis /var/lib/valkey/dump.rdb
sudo systemctl start redis-server
```

#### Step 3: Warm Up Cache

```bash
# Allow application to repopulate cache naturally
# Monitor cache hit rate
redis-cli -h redis.example.com -p 6380 --tls --cert /path/to/client.crt --key /path/to/client.key --cacert /path/to/ca.crt INFO stats | grep hit_rate
```

**Expected Downtime:** 0-5 minutes (cache warm-up period)

---


## Failover to New Server

### Pre-Failover Checklist

Before initiating a planned failover, ensure the following:

* [ ] New server is provisioned and configured via Ansible playbooks
* [ ] Latest backup is available and verified
* [ ] DNS TTL is set to 300 seconds (5 minutes) or lower
* [ ] Application connection strings use hostnames (not IPs)
* [ ] Monitoring is in place to detect issues
* [ ] Rollback plan is documented

### Planned Failover Procedure (Zero-Downtime)

**For MongoDB:**

#### Step 1: Set Up Replica Set (Temporary)

```bash
# On old server, convert to replica set
mongosh --tls --tlsCertificateKeyFile=/etc/mongodb/ssl/mongodb.pem --tlsCAFile=/etc/mongodb/ssl/ca.pem
rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "old-mongo.example.com:27017" }]
})

# Add new server as secondary
rs.add("new-mongo.example.com:27017")

# Wait for initial sync to complete
rs.status()
```

#### Step 2: Step Down Primary

```bash
# On old server, step down as primary
rs.stepDown()

# Wait for new server to become primary
rs.status()
```

#### Step 3: Update DNS

```bash
# Update DNS to point to new server
# Wait for TTL to expire (5 minutes)
```

#### Step 4: Remove Old Server

```bash
# On new server (now primary)
rs.remove("old-mongo.example.com:27017")
```

**Expected Downtime:** 0 minutes (seamless failover)

**For Redis:**

Redis does not support built-in replication in standalone mode. Use backup/restore method with short downtime.

#### Step 1: Create Final Backup

```bash
# On old server, trigger immediate backup
sudo systemctl start redis-backup.service
```

#### Step 2: Restore to New Server

```bash
# Follow "Restore from Cloudflare R2 Backup" steps above
```

#### Step 3: Update DNS

```bash
# Update DNS to point to new server
# Wait for TTL to expire (5 minutes)
```

**Expected Downtime:** 5-10 minutes

---


## Testing Disaster Recovery

### Regular DR Testing Schedule

**Recommended Frequency:**

* **Full DR Test**: Quarterly (every 3 months)
* **Backup Verification**: Monthly
* **Restore Test**: Monthly

### DR Test Procedure

#### Step 1: Create Test Environment

```bash
# Provision test server (separate from production)
# Use same Ansible playbooks
ansible-playbook -i test-inventory ansible/playbooks/mongo.yml
```

#### Step 2: Restore from Production Backup

```bash
# Choose a recent production backup
aws s3 ls s3://forwardemail-backups/mongodb/ --recursive --endpoint-url="$AWS_ENDPOINT_URL"

# Restore to test server
aws s3 cp "s3://forwardemail-backups/mongodb/BACKUP_PATH.archive.gz.gpg" - \
  --endpoint-url="$AWS_ENDPOINT_URL" | \
  gpg --decrypt --batch --yes --passphrase "$BACKUP_SECRET" | \
  mongorestore --archive --gzip --oplogReplay --host test-mongo.example.com
```

#### Step 3: Verify Data Integrity

```bash
# Connect to test server
mongosh --host test-mongo.example.com --tls --tlsCertificateKeyFile=/etc/mongodb/ssl/mongodb.pem --tlsCAFile=/etc/mongodb/ssl/ca.pem

# Verify databases and collections
db.adminCommand({ listDatabases: 1 })

# Run validation on critical collections
db.collectionName.validate({ full: true })

# Check document counts match production
db.collectionName.countDocuments({})
```

#### Step 4: Test Application Connectivity

```bash
# Update test application config to use test database
# Run application smoke tests
# Verify read/write operations work correctly
```

#### Step 5: Document Results

```bash
# Record test results:
# - Backup size and age
# - Restoration time
# - Data integrity verification results
# - Any issues encountered
# - Lessons learned
```

#### Step 6: Clean Up Test Environment

```bash
# Destroy test server after successful test
# Keep documentation of test results
```

### Backup Verification Script

Create a script to automatically verify backups:

```bash
#!/bin/bash
# /usr/local/bin/verify-backups.sh

set -e

# List recent backups
RECENT_BACKUPS=$(aws s3 ls s3://forwardemail-backups/mongodb/ --recursive --endpoint-url="$AWS_ENDPOINT_URL" | tail -10)

echo "Recent MongoDB backups:"
echo "$RECENT_BACKUPS"

# Check if backups exist in last 24 hours
LATEST_BACKUP=$(echo "$RECENT_BACKUPS" | tail -1 | awk '{print $1, $2}')
LATEST_TIMESTAMP=$(date -d "$LATEST_BACKUP" +%s)
CURRENT_TIMESTAMP=$(date +%s)
AGE=$((CURRENT_TIMESTAMP - LATEST_TIMESTAMP))

if [ $AGE -gt 86400 ]; then
  echo "ERROR: No backup in last 24 hours!"
  exit 1
else
  echo "OK: Latest backup is $(($AGE / 3600)) hours old"
fi

# Verify backup can be decrypted
LATEST_FILE=$(echo "$RECENT_BACKUPS" | tail -1 | awk '{print $4}')
aws s3 cp "s3://forwardemail-backups/${LATEST_FILE}" - --endpoint-url="$AWS_ENDPOINT_URL" | \
  gpg --decrypt --batch --yes --passphrase "$BACKUP_SECRET" | head -c 1000 > /dev/null

if [ $? -eq 0 ]; then
  echo "OK: Backup can be decrypted"
else
  echo "ERROR: Backup decryption failed!"
  exit 1
fi

echo "Backup verification completed successfully"
```

Run this script daily via cron:

```bash
# Add to crontab
0 8 * * * /usr/local/bin/verify-backups.sh | mail -s "Backup Verification Report" admin@example.com
```

---


## Emergency Contacts and Escalation

### Critical Incident Response

**Priority 1 (Database Down):**

1. Alert on-call engineer immediately
2. Begin disaster recovery procedure
3. Update status page
4. Notify stakeholders every 15 minutes

**Priority 2 (Performance Degradation):**

1. Investigate root cause
2. Consider failover if issue persists
3. Update status page
4. Notify stakeholders every 30 minutes

### Escalation Path

1. **On-Call Engineer** (0-15 minutes)
2. **Database Administrator** (15-30 minutes)
3. **Infrastructure Lead** (30-60 minutes)
4. **CTO** (60+ minutes)

---


## Post-Incident Review

After any disaster recovery event, conduct a post-incident review:

1. **Timeline**: Document exact sequence of events
2. **Root Cause**: Identify what caused the failure
3. **Response**: Evaluate effectiveness of recovery procedures
4. **Improvements**: Identify areas for improvement
5. **Action Items**: Assign tasks to prevent recurrence

---


## Additional Resources

* [MongoDB Backup and Restore Documentation](https://www.mongodb.com/docs/manual/core/backups/)
* [Redis Persistence Documentation](https://redis.io/docs/management/persistence/)
* [Unbound DNS Resolver](https://github.com/NLnetLabs/unbound)
* [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)

---


## License

[(BUSL-1.1 AND MPL-2.0)](LICENSE.md) © [Forward Email LLC](https://forwardemail.net)
