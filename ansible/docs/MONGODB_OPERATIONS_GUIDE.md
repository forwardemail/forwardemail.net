# MongoDB Operations Guide

> \[!WARNING]
> **DO NOT UPGRADE TO MONGODB v7 OR v8**
>
> MongoDB v7 and v8 have **severe performance regressions** compared to v6:
>
> * Up to **3x slower query performance** in real-world workloads
> * Significant **memory overhead increases**
> * **Degraded performance under high concurrency**
>
> **References:**
>
> * [MongoDB 8.0 Performance is 36% Higher? Nope, It's Not](https://dev.to/manoj_from_revisit_dot_tech/mongodb-80-performance-is-36-higher-nope-its-not--35jk)
> * [Performance Drop After Upgrade 6.0.10 → 7.0.1 (MongoDB Forums)](https://www.mongodb.com/community/forums/t/performance-drop-after-upgrade-6-0-10-7-0-1/246712/30?ref=revisit.tech)
> * [MongoDB 8.0 Performance is 36% Higher, But There's a Catch](https://revisit.tech/blog/mongodb-8-0-performanace-is-36-percent-higher-but-there-is-a-catch/)
>
> **Our deployment is LOCKED to MongoDB v6.0.18 until these issues are resolved.**

> \[!NOTE]
> This guide covers advanced MongoDB operations including version upgrades, migrations, performance analysis, troubleshooting, and index optimization.
>
> **MongoDB Installation Method:** We use a **custom installation** directly from the official MongoDB repository (no third-party Ansible Galaxy roles). This gives us full control over configuration and follows the same pattern as our Valkey/Redis deployment.
>
> **User Configuration:** Single admin user (`MONGO_USER`/`MONGO_PASS`) with all necessary roles (root, userAdmin, dbAdmin, backup, restore).


## Table of Contents

* [MongoDB Version Upgrades](#mongodb-version-upgrades)
  * [Upgrade Path Requirements](#upgrade-path-requirements)
  * [Upgrading from MongoDB 6.0 to 7.0](#upgrading-from-mongodb-60-to-70)
  * [Updating the Ansible Playbook for New Versions](#updating-the-ansible-playbook-for-new-versions)
* [Database Migration](#database-migration)
  * [Migrating Between MongoDB Instances](#migrating-between-mongodb-instances)
* [Troubleshooting Frozen/Locked Databases](#troubleshooting-frozenlocked-databases)
  * [Identifying Frozen/Stuck Operations](#identifying-frozenstuck-operations)
  * [Killing Stuck Operations](#killing-stuck-operations)
  * [Common Causes of Frozen Databases](#common-causes-of-frozen-databases)
  * [Emergency Recovery Procedures](#emergency-recovery-procedures)
* [Performance Analysis](#performance-analysis)
  * [Using serverStatus for Performance Metrics](#using-serverstatus-for-performance-metrics)
  * [Using mongostat (Real-Time Monitoring)](#using-mongostat-real-time-monitoring)
  * [Using mongotop (Collection-Level Activity)](#using-mongotop-collection-level-activity)
  * [Enabling Database Profiler](#enabling-database-profiler)
  * [Analyzing Slow Queries from Logs](#analyzing-slow-queries-from-logs)
* [Index Analysis and Optimization](#index-analysis-and-optimization)
  * [Viewing Existing Indexes](#viewing-existing-indexes)
  * [Identifying Unused Indexes](#identifying-unused-indexes)
  * [Dropping Unused Indexes](#dropping-unused-indexes)
  * [Creating Optimal Indexes](#creating-optimal-indexes)
  * [Index Monitoring](#index-monitoring)
* [Using explain()](#using-explain)
  * [Explain Modes](#explain-modes)
  * [Basic Usage](#basic-usage)
  * [Analyzing explain() Output](#analyzing-explain-output)
  * [Example Analysis](#example-analysis)
  * [Using explain() with Aggregations](#using-explain-with-aggregations)
  * [Using explain() with Updates and Deletes](#using-explain-with-updates-and-deletes)
  * [Identifying Missing Indexes from explain()](#identifying-missing-indexes-from-explain)
  * [Comparing Query Plans](#comparing-query-plans)
* [Performance Optimization Checklist](#performance-optimization-checklist)
  * [Quick Wins](#quick-wins)
  * [Index Optimization](#index-optimization)
  * [Query Optimization](#query-optimization)
  * [System Optimization](#system-optimization)
* [Additional Resources](#additional-resources)
* [License](#license)


## MongoDB Version Upgrades

### Upgrade Path Requirements

MongoDB requires **sequential major version upgrades**. You cannot skip major versions.

**Upgrade Path:**

```
MongoDB 6.0 → 7.0 → 8.0
```

**Important:** You must upgrade to each major version sequentially. For example, to upgrade from 6.0 to 8.0, you must first upgrade to 7.0, then to 8.0.

### Upgrading from MongoDB 6.0 to 7.0

#### Prerequisites

1. **Check Feature Compatibility Version (FCV)**

```javascript
db.adminCommand({ getParameter: 1, featureCompatibilityVersion: 1 })
```

Expected output:

```javascript
{ featureCompatibilityVersion: { version: "6.0" }, ok: 1 }
```

2. **Set FCV to 6.0 if needed**

```javascript
db.adminCommand({ setFeatureCompatibilityVersion: "6.0" })
```

3. **Verify Driver Compatibility**

Check that your application drivers are compatible with MongoDB 7.0. Consult the [MongoDB driver compatibility matrix](https://www.mongodb.com/docs/drivers/).

4. **Review Compatibility Changes**

Read the [MongoDB 7.0 Compatibility Changes](https://www.mongodb.com/docs/manual/release-notes/7.0-compatibility/) document to identify any breaking changes.

5. **Test in Staging**

Always test the upgrade in a staging environment before upgrading production.

#### Upgrade Procedure (Standalone)

**Step 1: Create a Backup**

```bash
# Using the backup script from the playbook
sudo systemctl start mongodb-backup.service

# Or manually
mongodump --host=localhost --port=27017 --oplog --archive=/backup/pre-upgrade-backup.archive --gzip
```

**Step 2: Shut Down MongoDB**

```bash
# Via mongosh
mongosh --tls --tlsCertificateKeyFile=/etc/mongodb/ssl/mongodb.pem --tlsCAFile=/etc/mongodb/ssl/ca.pem
db.adminCommand({ shutdown: 1 })

# Or via systemctl
sudo systemctl stop mongod
```

**Step 3: Update MongoDB Packages**

```bash
# For Ubuntu/Debian (using apt)
# First, update the repository to MongoDB 7.0
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt-get update
sudo apt-get install -y mongodb-org=7.0.18 mongodb-org-database=7.0.18 mongodb-org-server=7.0.18 mongodb-org-mongos=7.0.18 mongodb-org-tools=7.0.18

# For RHEL/CentOS (using yum)
sudo yum install -y mongodb-org-7.0.18 mongodb-org-database-7.0.18 mongodb-org-server-7.0.18 mongodb-org-mongos-7.0.18 mongodb-org-tools-7.0.18
```

**Step 4: Verify Binary Version**

```bash
mongod --version
```

Expected output should show version 7.0.x.

**Step 5: Start MongoDB**

```bash
sudo systemctl start mongod
```

**Step 6: Verify MongoDB is Running**

```bash
sudo systemctl status mongod

# Connect and check version
mongosh --tls --tlsCertificateKeyFile=/etc/mongodb/ssl/mongodb.pem --tlsCAFile=/etc/mongodb/ssl/ca.pem
db.version()
```

**Step 7: Enable 7.0 Features (After Burn-In Period)**

After running MongoDB 7.0 for a period (recommended: 1-2 weeks) to ensure stability, enable 7.0-specific features:

```javascript
db.adminCommand({ setFeatureCompatibilityVersion: "7.0", confirm: true })
```

**Important:** MongoDB 7.0+ requires the `confirm: true` parameter.

#### Upgrading from 7.0 to 8.0

Follow the same procedure as above, but:

1. Set FCV to `"7.0"` before upgrading
2. Update repositories to MongoDB 8.0
3. Install MongoDB 8.0 packages
4. After burn-in, set FCV to `"8.0"` with `confirm: true`

### Updating the Ansible Playbook for New Versions

> \[!WARNING]
> **DO NOT UPGRADE TO v7 OR v8** - See performance warnings at the top of this document.

If you absolutely must upgrade (not recommended), update the `mongodb_version` variable in `mongo.yml`:

```yaml
vars:
  # WARNING: See performance warnings before changing this!
  mongodb_version: "7.0.18"  # Change this to desired version
```

**Note**: Our custom installation uses direct APT package installation from the official MongoDB repository, not third-party Ansible roles. You'll also need to update the APT repository configuration in the playbook to match the new major version.

---


## Database Migration

### Migrating Between MongoDB Instances

#### Method 1: Using mongodump/mongorestore (Recommended for Small-Medium Databases)

**On Source Server:**

```bash
# Dump entire database
mongodump --host=source.example.com --port=27017 \
  --username=admin --authenticationDatabase=admin \
  --oplog --archive=/backup/migration.archive --gzip

# Dump specific database
mongodump --host=source.example.com --port=27017 \
  --username=admin --authenticationDatabase=admin \
  --db=mydb --archive=/backup/mydb.archive --gzip
```

**Transfer to Target Server:**

```bash
# Using scp
scp /backup/migration.archive target-server:/backup/

# Or stream directly
mongodump --host=source.example.com --archive --gzip | \
  ssh target-server "mongorestore --archive --gzip"
```

**On Target Server:**

```bash
# Restore entire database
mongorestore --host=localhost --port=27017 \
  --username=admin --authenticationDatabase=admin \
  --oplogReplay --archive=/backup/migration.archive --gzip

# Restore specific database
mongorestore --host=localhost --port=27017 \
  --username=admin --authenticationDatabase=admin \
  --db=mydb --archive=/backup/mydb.archive --gzip
```

#### Method 2: Using Filesystem Snapshots (Fastest for Large Databases)

**Prerequisites:**

* Both servers must use the same MongoDB version
* Target server must be shut down

**Steps:**

1. **Stop MongoDB on source (if possible) or use consistent snapshot**

```bash
sudo systemctl stop mongod
```

2. **Copy data directory**

```bash
# On source
sudo rsync -avz /var/lib/mongodb/ target-server:/var/lib/mongodb/

# Or create a tarball
sudo tar czf /backup/mongodb-data.tar.gz -C /var/lib/mongodb .
```

3. **On target server, extract and set permissions**

```bash
sudo tar xzf /backup/mongodb-data.tar.gz -C /var/lib/mongodb/
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo systemctl start mongod
```

#### Method 3: Using Replica Set Sync (Zero-Downtime Migration)

**Best for:** Production migrations with minimal downtime

**Steps:**

1. **Add target server as a replica set member**

```javascript
// On source (primary)
rs.add("target-server.example.com:27017")
```

2. **Wait for initial sync to complete**

```javascript
rs.status()
// Check that target server state is "SECONDARY" and fully synced
```

3. **Step down primary and promote target**

```javascript
// On source
rs.stepDown()

// Wait for election, then on new primary (target)
rs.remove("source-server.example.com:27017")
```

4. **Update application connection strings**

Point your application to the new server.

---


## Troubleshooting Frozen/Locked Databases

### Identifying Frozen/Stuck Operations

#### Check Current Operations

```javascript
// Connect to MongoDB
mongosh --tls --tlsCertificateKeyFile=/etc/mongodb/ssl/mongodb.pem --tlsCAFile=/etc/mongodb/ssl/ca.pem

// View all current operations
db.currentOp()

// View only active operations
db.currentOp({ active: true })

// View long-running operations (> 5 seconds)
db.currentOp({ "secs_running": { $gt: 5 } })

// View operations waiting for locks
db.currentOp({ "waitingForLock": true })
```

#### Using $currentOp Aggregation (More Flexible)

```javascript
// Find queries running longer than 10 seconds
db.aggregate([
  { $currentOp: { allUsers: true, idleConnections: false } },
  { $match: { secs_running: { $gt: 10 } } },
  { $sort: { secs_running: -1 } }
])

// Find operations on a specific database
db.aggregate([
  { $currentOp: { allUsers: true } },
  { $match: { "ns": /^mydb\./ } }
])
```

### Killing Stuck Operations

#### Kill a Single Operation

```javascript
// Get the operation ID (opid) from db.currentOp()
db.killOp(12345)

// Or using the command
db.adminCommand({ killOp: 1, op: 12345 })
```

#### Kill All Operations on a Database

```javascript
// Get all operations on a database and kill them
db.currentOp({ "ns": /^mydb\./ }).inprog.forEach(function(op) {
  if (op.secs_running > 10) {
    db.killOp(op.opid);
  }
})
```

#### Kill All Long-Running Queries

```javascript
db.currentOp({ "secs_running": { $gt: 60 } }).inprog.forEach(function(op) {
  print("Killing operation: " + op.opid + " running for " + op.secs_running + " seconds");
  db.killOp(op.opid);
})
```

### Common Causes of Frozen Databases

#### 1. Lock Contention

**Symptoms:**

* Operations showing `"waitingForLock": true`
* High number of queued operations

**Diagnosis:**

```javascript
// Check lock statistics
db.serverStatus().locks

// Check for lock waits
db.currentOp({ "waitingForLock": true })
```

**Solutions:**

* Identify and optimize slow queries causing locks
* Consider using read preference `secondaryPreferred` for read-heavy workloads
* Ensure indexes exist for frequently queried fields

#### 2. WiredTiger Cache Pressure

**Symptoms:**

* High cache eviction rate
* Slow query performance
* High disk I/O

**Diagnosis:**

```javascript
// Check WiredTiger cache statistics
db.serverStatus().wiredTiger.cache

// Key metrics to watch:
// - "bytes currently in the cache"
// - "tracked dirty bytes in the cache"
// - "pages evicted by application threads"
```

**Solutions:**

```javascript
// Increase WiredTiger cache size (requires restart)
// Edit /etc/mongod.conf:
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 8  # Set to ~50% of available RAM
```

Or set via command line:

```bash
mongod --wiredTigerCacheSizeGB 8
```

#### 3. Long-Running Index Builds

**Symptoms:**

* `createIndexes` operation running for extended time
* Database appears frozen

**Diagnosis:**

```javascript
db.currentOp({ "op": "command", "command.createIndexes": { $exists: true } })
```

**Solutions:**

* Wait for index build to complete (can take hours for large collections)
* Kill the operation if necessary: `db.killOp(opid)`
* Build indexes during off-peak hours
* Use background index builds (default in MongoDB 4.2+)

#### 4. Insufficient Resources

**Symptoms:**

* High CPU usage
* High memory usage
* Slow disk I/O

**Diagnosis:**

```bash
# Check system resources
top
htop
iostat -x 1

# Check MongoDB metrics
mongosh
db.serverStatus().connections
db.serverStatus().opcounters
```

**Solutions:**

* Scale up hardware (CPU, RAM, faster disks)
* Optimize queries and add indexes
* Implement connection pooling in applications
* Consider sharding for horizontal scaling

### Emergency Recovery Procedures

#### Force Restart MongoDB

```bash
# If MongoDB is completely frozen
sudo systemctl stop mongod

# If stop hangs, force kill
sudo pkill -9 mongod

# Check for lock file
sudo rm -f /var/lib/mongodb/mongod.lock

# Repair if needed (only if unclean shutdown)
sudo -u mongodb mongod --repair --dbpath /var/lib/mongodb

# Start MongoDB
sudo systemctl start mongod
```

#### Check and Repair Database

```bash
# Run validation on a collection
mongosh
db.myCollection.validate({ full: true })

# Repair database (requires downtime)
sudo systemctl stop mongod
sudo -u mongodb mongod --repair --dbpath /var/lib/mongodb
sudo systemctl start mongod
```

---


## Performance Analysis

### Using serverStatus for Performance Metrics

```javascript
// Get comprehensive server statistics
db.serverStatus()

// Key sections to monitor:
db.serverStatus().connections  // Connection count
db.serverStatus().opcounters    // Operation counts
db.serverStatus().wiredTiger.cache  // Cache statistics
db.serverStatus().locks         // Lock statistics
db.serverStatus().network       // Network statistics
```

### Using mongostat (Real-Time Monitoring)

```bash
# Monitor MongoDB in real-time
mongostat --host=localhost --port=27017

# Monitor specific fields
mongostat --host=localhost --port=27017 -o 'host,insert,query,update,delete,command'

# Monitor with TLS
mongostat --tls --tlsCertificateKeyFile=/etc/mongodb/ssl/mongodb.pem --tlsCAFile=/etc/mongodb/ssl/ca.pem
```

### Using mongotop (Collection-Level Activity)

```bash
# Show time spent reading/writing to collections
mongotop --host=localhost --port=27017

# Update every 5 seconds
mongotop 5
```

### Enabling Database Profiler

The database profiler logs slow operations to the `system.profile` collection.

```javascript
// Enable profiler for slow operations (> 100ms)
db.setProfilingLevel(1, { slowms: 100 })

// Enable profiler for all operations (use with caution!)
db.setProfilingLevel(2)

// Check profiler status
db.getProfilingStatus()

// Query slow operations
db.system.profile.find({ millis: { $gt: 100 } }).sort({ ts: -1 }).limit(10)

// Disable profiler
db.setProfilingLevel(0)
```

### Analyzing Slow Queries from Logs

```bash
# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Filter for slow queries (> 100ms)
sudo grep "Slow query" /var/log/mongodb/mongod.log

# Extract slow queries with execution time
sudo grep -E "ms$" /var/log/mongodb/mongod.log | grep -E "[0-9]{3,}ms$"
```

---


## Index Analysis and Optimization

### Viewing Existing Indexes

```javascript
// List all indexes on a collection
db.myCollection.getIndexes()

// Get index statistics
db.myCollection.aggregate([{ $indexStats: {} }])

// Check index sizes
db.myCollection.stats().indexSizes
```

### Identifying Unused Indexes

```javascript
// Get index usage statistics
db.myCollection.aggregate([
  { $indexStats: {} },
  { $sort: { "accesses.ops": 1 } }
])

// Find indexes that have never been used
db.myCollection.aggregate([
  { $indexStats: {} },
  { $match: { "accesses.ops": 0 } }
])
```

### Dropping Unused Indexes

```javascript
// Drop a specific index
db.myCollection.dropIndex("index_name")

// Drop all indexes except _id
db.myCollection.dropIndexes()

// Drop multiple indexes
db.myCollection.dropIndexes(["index1", "index2"])
```

### Creating Optimal Indexes

#### ESR Rule (Equality, Sort, Range)

When creating compound indexes, follow the ESR rule:

1. **E**quality: Fields with equality conditions first
2. **S**ort: Fields used in sorting second
3. **R**ange: Fields with range conditions last

**Example:**

```javascript
// Query: Find users in a city, sorted by age, with score > 50
db.users.find({ city: "New York", score: { $gt: 50 } }).sort({ age: 1 })

// Optimal index (ESR):
db.users.createIndex({ city: 1, age: 1, score: 1 })
```

#### Index Best Practices

```javascript
// Create index with name
db.collection.createIndex({ field: 1 }, { name: "field_idx" })

// Create unique index
db.collection.createIndex({ email: 1 }, { unique: true })

// Create partial index (index only documents matching filter)
db.collection.createIndex(
  { status: 1 },
  { partialFilterExpression: { status: { $exists: true } } }
)

// Create TTL index (auto-delete documents after time)
db.collection.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 86400 }  // 24 hours
)

// Create text index for full-text search
db.collection.createIndex({ description: "text" })

// Create compound index
db.collection.createIndex({ field1: 1, field2: -1 })
```

### Index Monitoring

```javascript
// Check if index is being built
db.currentOp({ "op": "command", "command.createIndexes": { $exists: true } })

// Get index build progress (MongoDB 4.4+)
db.currentOp({
  $or: [
    { op: "command", "command.createIndexes": { $exists: true } },
    { op: "none", msg: /^Index Build/ }
  ]
})
```

---


## Using explain()

The `explain()` method provides detailed information about query execution, including query plan, execution statistics, and index usage.

### Explain Modes

MongoDB supports three explain modes:

1. **queryPlanner** (default): Shows the query plan
2. **executionStats**: Shows execution statistics
3. **allPlansExecution**: Shows all considered plans and their execution stats

### Basic Usage

```javascript
// Query planner mode (default)
db.collection.find({ field: value }).explain()

// Execution statistics mode (recommended)
db.collection.find({ field: value }).explain("executionStats")

// All plans execution mode
db.collection.find({ field: value }).explain("allPlansExecution")
```

### Analyzing explain() Output

#### Key Metrics to Check

**1. executionTimeMillis**

* Total time to execute the query
* Lower is better
* Target: < 100ms for most queries

**2. totalDocsExamined**

* Number of documents scanned
* Should be close to `nReturned` for optimal queries
* High values indicate missing indexes

**3. totalKeysExamined**

* Number of index keys scanned
* Should be close to `nReturned`

**4. nReturned**

* Number of documents returned
* Compare with `totalDocsExamined` to calculate efficiency

**5. stage**

* Query execution stage
* **COLLSCAN**: Full collection scan (bad, add index)
* **IXSCAN**: Index scan (good)
* **FETCH**: Fetching documents after index scan
* **SORT**: In-memory sort (consider adding sort index)

### Example Analysis

```javascript
// Example query
db.users.find({ city: "New York", age: { $gt: 25 } }).sort({ createdAt: -1 }).explain("executionStats")
```

**Good Output (Using Index):**

```javascript
{
  "executionStats": {
    "executionSuccess": true,
    "nReturned": 100,
    "executionTimeMillis": 15,
    "totalKeysExamined": 100,
    "totalDocsExamined": 100,
    "executionStages": {
      "stage": "FETCH",
      "inputStage": {
        "stage": "IXSCAN",
        "keyPattern": { "city": 1, "age": 1 },
        "indexName": "city_1_age_1"
      }
    }
  }
}
```

**Analysis:**

* ✅ Uses index (`IXSCAN`)
* ✅ Low execution time (15ms)
* ✅ Efficient: `nReturned` = `totalDocsExamined` = 100

**Bad Output (Collection Scan):**

```javascript
{
  "executionStats": {
    "executionSuccess": true,
    "nReturned": 100,
    "executionTimeMillis": 2500,
    "totalKeysExamined": 0,
    "totalDocsExamined": 1000000,
    "executionStages": {
      "stage": "COLLSCAN",
      "direction": "forward"
    }
  }
}
```

**Analysis:**

* ❌ Full collection scan (`COLLSCAN`)
* ❌ High execution time (2500ms)
* ❌ Inefficient: Scanned 1M docs to return 100
* **Solution:** Create index on `{ city: 1, age: 1 }`

### Using explain() with Aggregations

```javascript
// Explain aggregation pipeline
db.collection.aggregate([
  { $match: { status: "active" } },
  { $group: { _id: "$category", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } }
]).explain("executionStats")
```

### Using explain() with Updates and Deletes

```javascript
// Explain update operation
db.collection.explain("executionStats").update(
  { field: value },
  { $set: { status: "updated" } }
)

// Explain delete operation
db.collection.explain("executionStats").remove({ field: value })
```

### Identifying Missing Indexes from explain()

**Signs you need an index:**

1. **COLLSCAN** stage present
2. `totalDocsExamined` >> `nReturned`
3. `executionTimeMillis` > 100ms
4. **SORT** stage with large dataset (in-memory sort)

**Create the index:**

```javascript
// If query is: db.users.find({ city: "NYC", age: { $gt: 25 } }).sort({ createdAt: -1 })
// Create index following ESR rule:
db.users.createIndex({ city: 1, createdAt: -1, age: 1 })
```

### Comparing Query Plans

```javascript
// Compare two queries
var plan1 = db.collection.find({ field1: value }).explain("executionStats")
var plan2 = db.collection.find({ field2: value }).explain("executionStats")

// Compare execution times
print("Plan 1: " + plan1.executionStats.executionTimeMillis + "ms")
print("Plan 2: " + plan2.executionStats.executionTimeMillis + "ms")
```

---


## Performance Optimization Checklist

### Quick Wins

* ✅ Add indexes for frequently queried fields
* ✅ Use projection to limit returned fields
* ✅ Use `limit()` to restrict result set size
* ✅ Enable query profiler to identify slow queries
* ✅ Monitor `db.currentOp()` for long-running operations

### Index Optimization

* ✅ Follow ESR rule for compound indexes
* ✅ Remove unused indexes (check with `$indexStats`)
* ✅ Use covered queries (query only uses index, no FETCH stage)
* ✅ Create indexes for sort operations
* ✅ Use partial indexes for filtered queries

### Query Optimization

* ✅ Use `explain("executionStats")` to analyze queries
* ✅ Avoid `$where` and `$regex` without anchors
* ✅ Use `$in` instead of multiple `$or` conditions
* ✅ Limit array sizes in documents
* ✅ Use aggregation pipeline for complex queries

### System Optimization

* ✅ Tune WiredTiger cache size (\~50% of RAM)
* ✅ Use SSD storage for better I/O performance
* ✅ Enable compression for storage efficiency
* ✅ Monitor system resources (CPU, RAM, disk I/O)
* ✅ Implement connection pooling in applications

---


## Additional Resources

* [MongoDB Manual](https://www.mongodb.com/docs/manual/)
* [MongoDB Performance Best Practices](https://www.mongodb.com/company/blog/performance-best-practices-indexing)
* [MongoDB University](https://university.mongodb.com/)
* [MongoDB Community Forums](https://www.mongodb.com/community/forums/)

---


## License

[(BUSL-1.1 AND MPL-2.0)](LICENSE.md) © [Forward Email LLC](https://forwardemail.net)
