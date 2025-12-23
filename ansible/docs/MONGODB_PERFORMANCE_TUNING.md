# MongoDB Performance Tuning Guide

This guide covers kernel and OS-level optimizations implemented in the MongoDB playbook to maximize performance on Ubuntu systems.


## Kernel Optimizations

The `mongo.yml` and `logs.yml` playbooks automatically configures the following kernel parameters for optimal MongoDB performance.

### Sysctl Parameters

All sysctl parameters are configured in `/etc/sysctl.d/99-mongodb.conf` and applied automatically.

#### vm.swappiness = 1

**Purpose:** Minimizes swapping and keeps MongoDB data in RAM.

**Why it matters:** MongoDB performs best where swapping is avoided or kept to a minimum. Swapping causes severe performance degradation and latency spikes. Setting swappiness to 1 tells the kernel to avoid swapping unless absolutely necessary to prevent OOM (Out Of Memory) killer.

**Official MongoDB recommendation:** Mentioned in the [MongoDB production notes](https://www.mongodb.com/docs/manual/administration/production-notes/).

**Default value:** Typically 60 on Ubuntu, which is too aggressive for MongoDB.

**Performance impact:** Reduces latency by keeping hot data in memory.

#### vm.dirty\_background\_ratio = 10

**Purpose:** Controls when dirty pages are flushed to disk in the background.

**Why it matters:** MongoDB uses cache technology to enhance quick fetching of data. This setting determines the percentage of total system memory that can hold dirty pages before background flushing begins. Setting it to 10% ensures data is written to disk smoothly without hard pauses.

**Default value:** 25-35% (too high for MongoDB).

**Performance impact:** Prevents hard pauses during write operations, ensuring consistent query performance.

#### vm.dirty\_ratio = 20

**Purpose:** Controls when dirty pages cause a hard pause for synchronous writes.

**Why it matters:** If dirty pages exceed this threshold, all I/O operations pause until pages are written to disk. Setting it to 20% prevents data duplication and ensures data integrity during high write loads.

**Default value:** 25-35% (too high for MongoDB).

**Performance impact:** Avoids hard pauses that can cause timeouts and failed writes.

#### net.core.somaxconn = 4096

**Purpose:** Increases the maximum number of queued connections.

**Why it matters:** The default value (typically 128) is too low for MongoDB deployments with many clients. When the connection queue fills up, new connections are rejected, causing "connection refused" errors.

**Default value:** 128 (insufficient for production MongoDB).

**Performance impact:** Allows MongoDB to handle thousands of concurrent connections without dropping requests.

#### net.ipv4.tcp\_max\_syn\_backlog = 4096

**Purpose:** Increases the maximum number of SYN packets queued.

**Why it matters:** During high connection rates, the SYN queue can fill up, causing connection timeouts. This is especially important for MongoDB replica sets and sharded clusters with many clients.

**Must match:** The `net.core.somaxconn` setting.

**Performance impact:** Prevents connection drops during traffic spikes.

#### net.ipv4.tcp\_fin\_timeout = 30

**Purpose:** Reduces the time TCP connections stay in FIN\_WAIT state.

**Why it matters:** Shorter FIN timeout allows faster connection recycling, freeing up resources for new connections.

**Default value:** 60 seconds (too long for database workloads).

**Performance impact:** Improves connection throughput and resource utilization.

#### net.ipv4.tcp\_keepalive\_intvl = 30

**Purpose:** Sets the interval between TCP keepalive probes.

**Why it matters:** Helps detect dead connections faster, preventing resource leaks.

**Default value:** 75 seconds (too long for MongoDB).

**Performance impact:** Faster detection of failed connections.

#### net.ipv4.tcp\_keepalive\_time = 120

**Purpose:** Sets the time before sending TCP keepalive probes.

**Why it matters:** Balances between keeping connections alive and detecting failures quickly.

**Default value:** 7200 seconds (2 hours, too long for MongoDB).

**Performance impact:** Prevents idle connection timeouts while detecting failures promptly.

### Transparent Huge Pages (THP)

**Status:** Disabled via systemd service.

**Why disabled:** THP causes significant latency and memory usage issues with MongoDB.

**How it works:**

* THP allows the kernel to automatically allocate 2MB pages instead of 4KB pages
* While this sounds beneficial, it causes problems for MongoDB:
  * **Copy-on-write overhead:** When MongoDB forks for backups, THP causes excessive memory copying
  * **Latency spikes:** THP defragmentation runs in the background, causing unpredictable latency
  * **Memory bloat:** THP can cause MongoDB to use more memory than expected

**Official MongoDB recommendation:** [MongoDB documentation](https://www.mongodb.com/docs/manual/tutorial/disable-transparent-huge-pages/) explicitly recommends disabling THP.

**Implementation:** The playbook creates a systemd service (`disable-thp-mongodb.service`) that runs before MongoDB starts and disables THP:

```bash
echo never > /sys/kernel/mm/transparent_hugepage/enabled
echo never > /sys/kernel/mm/transparent_hugepage/defrag
```

**Verification:** Check THP status with:

```bash
cat /sys/kernel/mm/transparent_hugepage/enabled
# Should show: always madvise [never]
```

### File Descriptor Limits (ulimits)

**Purpose:** Allows MongoDB to open many files and processes simultaneously.

**Why it matters:** MongoDB requires high file descriptor limits to:

* Manage many database connections
* Keep multiple data files open
* Handle journal files and indexes
* Support large numbers of concurrent operations

**Configuration:** The playbook creates `/etc/security/limits.d/mongodb.conf` with:

```
mongod       soft        nofile       64000
mongod       hard        nofile       64000
mongod       soft        nproc        64000
mongod       hard        nproc        64000
```

**Recommended values:**

* `nofile` (open files): 64000
* `nproc` (max processes): 64000

**Default values:** Typically 1024 (far too low for MongoDB).

**Performance impact:** Prevents "too many open files" errors and allows MongoDB to scale to thousands of connections.

**Verification:** Check current limits for mongod user:

```bash
sudo -u mongod bash -c 'ulimit -n'  # Check open files limit
sudo -u mongod bash -c 'ulimit -u'  # Check process limit
```


## Performance Monitoring

### Check MongoDB Performance

```bash
# Connect to MongoDB
mongosh --host mongo.example.com --tls \
  --tlsCertificateKeyFile /etc/mongodb/ssl/mongodb.pem \
  --tlsCAFile /etc/mongodb/ssl/ca.pem

# Check server status
db.serverStatus()

# Check current operations
db.currentOp()

# Check database stats
db.stats()

# Check slow queries
db.system.profile.find().sort({ts:-1}).limit(10)
```

### Verify Kernel Settings

```bash
# Check sysctl parameters
sysctl vm.swappiness
sysctl vm.dirty_background_ratio
sysctl vm.dirty_ratio
sysctl net.core.somaxconn
sysctl net.ipv4.tcp_max_syn_backlog
sysctl net.ipv4.tcp_fin_timeout
sysctl net.ipv4.tcp_keepalive_intvl
sysctl net.ipv4.tcp_keepalive_time

# Check THP status
cat /sys/kernel/mm/transparent_hugepage/enabled
cat /sys/kernel/mm/transparent_hugepage/defrag

# Check if disable-thp-mongodb service is running
systemctl status disable-thp-mongodb

# Check ulimits for mongod user
sudo -u mongod bash -c 'ulimit -a'
```

### Monitor MongoDB Metrics

**Key metrics to watch:**

1. **Latency:** Should be < 10ms for most operations
2. **Memory usage:** Should not exceed 80% of available RAM
3. **Disk I/O:** Monitor read/write throughput
4. **Connections:** Track active vs available connections
5. **Replication lag:** Should be minimal (< 1 second)

**Commands:**

```bash
# Monitor in real-time
mongosh --eval "while(true) { printjson(db.serverStatus().metrics); sleep(1000); }"

# Check memory usage
mongosh --eval "printjson(db.serverStatus().mem)"

# Check connections
mongosh --eval "printjson(db.serverStatus().connections)"

# Check replication status (if using replica set)
mongosh --eval "printjson(rs.status())"
```


## Troubleshooting

### High Latency

**Symptoms:** Slow query response times, timeouts

**Possible causes:**

1. THP not disabled
2. Swapping occurring
3. Insufficient indexes
4. Disk I/O bottleneck

**Solutions:**

```bash
# Check if THP is disabled
cat /sys/kernel/mm/transparent_hugepage/enabled
# Should show [never]

# Check for swapping
free -h
vmstat 1

# Check slow queries
mongosh --eval "db.system.profile.find({millis:{$gt:100}}).sort({ts:-1}).limit(10)"

# Check disk I/O
iostat -x 1
```

### Connection Issues

**Symptoms:** "Connection refused" or "Too many connections" errors

**Possible causes:**

1. Connection backlog full
2. Max connections reached
3. File descriptor limits too low

**Solutions:**

```bash
# Check current connections
mongosh --eval "db.serverStatus().connections"

# Check connection backlog settings
sysctl net.core.somaxconn
sysctl net.ipv4.tcp_max_syn_backlog

# Check ulimits
sudo -u mongod bash -c 'ulimit -n'

# Increase max connections in MongoDB config
# Edit /etc/mongod.conf:
# net:
#   maxIncomingConnections: 10000
```

### Memory Issues

**Symptoms:** High memory usage, OOM errors, swapping

**Possible causes:**

1. Working set larger than RAM
2. Memory leaks
3. Insufficient memory allocation

**Solutions:**

```bash
# Check memory usage
mongosh --eval "printjson(db.serverStatus().mem)"

# Check working set size
mongosh --eval "printjson(db.serverStatus().wiredTiger.cache)"

# Check for swapping
vmstat 1

# Adjust WiredTiger cache size (50% of RAM minus 1GB)
# Edit /etc/mongod.conf:
# storage:
#   wiredTiger:
#     engineConfig:
#       cacheSizeGB: 8
```

### Disk I/O Issues

**Symptoms:** Slow writes, high disk latency

**Possible causes:**

1. Using wrong filesystem (not XFS)
2. Missing `noatime` mount option
3. Insufficient disk throughput

**Solutions:**

```bash
# Check filesystem type
df -T /var/lib/mongodb

# Check mount options
grep "/var/lib/mongodb" /proc/mounts
# Should include "noatime"

# Monitor disk I/O
iostat -x 1

# Check MongoDB disk stats
mongosh --eval "printjson(db.serverStatus().wiredTiger.log)"
```


## Performance Benchmarking

### MongoDB Performance Test

```bash
# Install mongoperf (included with MongoDB)
mongoperf

# Run simple benchmark
echo '{ nThreads: 16, fileSizeMB: 1000, sleepMicros: 0, mmf: true, r: true, w: true }' | mongoperf

# Use YCSB for comprehensive benchmarking
# https://github.com/brianfrankcooper/YCSB
```

### Expected Performance

**Typical performance on modern hardware:**

* **Read operations:** 10,000-50,000 ops/sec
* **Write operations:** 5,000-25,000 ops/sec
* **Latency:** < 10ms average
* **Memory overhead:** < 20% of data size

**Factors affecting performance:**

1. **CPU:** MongoDB benefits from high single-core performance
2. **Memory:** More RAM allows larger working sets
3. **Disk:** SSD/NVMe significantly improves performance
4. **Network:** Low-latency network is critical for replica sets


## Summary

The MongoDB playbook implements the following optimizations:

**Kernel Level:**

* ✅ `vm.swappiness = 1` - Minimizes swapping
* ✅ `vm.dirty_background_ratio = 10` - Smooth background writes
* ✅ `vm.dirty_ratio = 20` - Prevents hard pauses
* ✅ `net.core.somaxconn = 4096` - Increases connection queue
* ✅ `net.ipv4.tcp_max_syn_backlog = 4096` - Increases SYN queue
* ✅ `net.ipv4.tcp_fin_timeout = 30` - Faster connection recycling
* ✅ `net.ipv4.tcp_keepalive_intvl = 30` - Faster dead connection detection
* ✅ `net.ipv4.tcp_keepalive_time = 120` - Balanced keepalive timing
* ✅ Transparent Huge Pages disabled - Prevents latency spikes

**System Level:**

* ✅ `nofile = 64000` - Allows many open files
* ✅ `nproc = 64000` - Allows many processes

**Result:** Production-ready MongoDB deployment optimized for high performance, low latency, and stability.


## References

* [MongoDB Production Notes](https://www.mongodb.com/docs/manual/administration/production-notes/)
* [Disable Transparent Huge Pages](https://www.mongodb.com/docs/manual/tutorial/disable-transparent-huge-pages/)
* [Optimizing Your Linux Environment for MongoDB - SeveralNines](https://severalnines.com/blog/optimizing-your-linux-environment-mongodb/)

---

Copyright (c) Forward Email LLC
SPDX-License-Identifier: BUSL-1.1
