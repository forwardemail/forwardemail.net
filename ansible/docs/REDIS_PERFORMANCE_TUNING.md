# Redis Performance Tuning Guide

This guide covers kernel and OS-level optimizations implemented in the Redis playbook to maximize performance on Ubuntu systems.


## Kernel Optimizations

The `redis.yml` playbook automatically configures the following kernel parameters for optimal Redis performance.

### Sysctl Parameters

All sysctl parameters are configured in `/etc/sysctl.d/99-redis.conf` and applied automatically.

#### vm.overcommit\_memory = 1

**Purpose:** Prevents background save failures during RDB snapshots.

**Why it matters:** Redis uses `fork()` to create background processes for saving data to disk. Without overcommit enabled, the kernel may refuse to allocate memory for the forked process, causing background saves to fail with errors like "Can't save in background: fork: Cannot allocate memory".

**Official Redis recommendation:** This is a critical setting mentioned in the [Redis administration documentation](https://redis.io/docs/latest/operate/oss_and_stack/management/admin/).

#### vm.swappiness = 1

**Purpose:** Minimizes swapping and keeps Redis data in RAM.

**Why it matters:** Redis is an in-memory database. Swapping Redis data to disk causes severe performance degradation and latency spikes. Setting swappiness to 1 tells the kernel to avoid swapping unless absolutely necessary.

**Default value:** Typically 60 on Ubuntu, which is too aggressive for Redis.

**Performance impact:** Reduces latency by keeping hot data in memory.

#### net.core.somaxconn = 65536

**Purpose:** Increases the maximum number of queued connections.

**Why it matters:** The default value (typically 128) is too low for high-traffic Redis deployments. When the connection queue fills up, new connections are rejected, causing "connection refused" errors.

**Must match:** The `tcp-backlog` setting in Redis configuration.

**Performance impact:** Allows Redis to handle thousands of concurrent connections without dropping requests.

#### net.ipv4.tcp\_max\_syn\_backlog = 65536

**Purpose:** Increases the maximum number of SYN packets queued.

**Why it matters:** During high connection rates, the SYN queue can fill up, causing connection timeouts. This is especially important for Redis clusters with many clients.

**Must match:** The `net.core.somaxconn` setting.

**Performance impact:** Prevents connection drops during traffic spikes.

### Transparent Huge Pages (THP)

**Status:** Disabled via systemd service.

**Why disabled:** THP causes significant latency and memory usage issues with Redis.

**How it works:**

* THP allows the kernel to automatically allocate 2MB pages instead of 4KB pages
* While this sounds beneficial, it causes problems for Redis:
  * **Copy-on-write overhead:** When Redis forks for background saves, THP causes excessive memory copying
  * **Latency spikes:** THP defragmentation runs in the background, causing unpredictable latency
  * **Memory bloat:** THP can cause Redis to use more memory than expected

**Official Redis recommendation:** [Redis documentation](https://redis.io/docs/latest/operate/oss_and_stack/management/admin/) explicitly recommends disabling THP.

**Implementation:** The playbook creates a systemd service (`disable-thp.service`) that runs before Redis starts and disables THP:

```bash
echo never > /sys/kernel/mm/transparent_hugepage/enabled
echo never > /sys/kernel/mm/transparent_hugepage/defrag
```

**Verification:** Check THP status with:

```bash
cat /sys/kernel/mm/transparent_hugepage/enabled
# Should show: always madvise [never]
```


## Redis Configuration Optimizations

The playbook automatically configures the following Redis parameters for optimal performance.

### tcp-backlog = 65536

**Purpose:** Increases the TCP listen backlog queue size.

**Why it matters:** In high requests-per-second environments, the default backlog (511) fills up quickly, causing connection timeouts and errors.

**Must match:** The `net.core.somaxconn` kernel parameter.

**Performance impact:** Allows Redis to queue thousands of pending connections during traffic bursts.

**Configuration:**

```
tcp-backlog 65536
```

### tcp-keepalive = 0

**Purpose:** Enables TCP keepalive to reuse connections.

**Why it matters:** When keepalive is disabled (default is 300 seconds), Redis may close idle connections, forcing clients to reconnect frequently. Setting to 0 enables keepalive with system defaults.

**Performance impact:** Reduces connection overhead by reusing existing TCP connections instead of creating new ones for each request.

**Configuration:**

```
tcp-keepalive 0
```

### maxclients = 10000

**Purpose:** Sets the maximum number of concurrent client connections.

**Why it matters:** The default (10000) is reasonable for most deployments, but can be adjusted based on your workload.

**When to increase:** If you see "max number of clients reached" errors in Redis logs.

**When to decrease:** If you have limited resources and want to prevent resource exhaustion.

**Configuration:**

```
maxclients 10000
```


## Performance Monitoring

### Check Redis Performance

```bash
# Connect to Redis
redis-cli -h redis.example.com -p 6380 --tls --cert /path/to/client.crt --key /path/to/client.key --cacert /path/to/ca.crt

# Check latency
redis-cli --latency -h redis.example.com -p 6380 --tls --cert /path/to/client.crt --key /path/to/client.key --cacert /path/to/ca.crt

# Check slow log
SLOWLOG GET 10

# Check memory usage
INFO memory

# Check stats
INFO stats
```

### Verify Kernel Settings

```bash
# Check sysctl parameters
sysctl vm.overcommit_memory
sysctl vm.swappiness
sysctl net.core.somaxconn
sysctl net.ipv4.tcp_max_syn_backlog

# Check THP status
cat /sys/kernel/mm/transparent_hugepage/enabled
cat /sys/kernel/mm/transparent_hugepage/defrag

# Check if disable-thp service is running
systemctl status disable-thp
```

### Monitor Redis Metrics

**Key metrics to watch:**

1. **Latency:** Should be < 1ms for most operations
2. **Memory usage:** Should not exceed 80% of available RAM
3. **Hit rate:** Should be > 90% for cache use cases
4. **Evictions:** Should be minimal
5. **Rejected connections:** Should be zero

**Commands:**

```bash
# Latency monitoring
redis-cli --latency-history -h redis.example.com -p 6380 --tls --cert /path/to/client.crt --key /path/to/client.key --cacert /path/to/ca.crt

# Memory stats
redis-cli INFO memory | grep -E "used_memory_human|used_memory_peak_human|mem_fragmentation_ratio"

# Hit rate
redis-cli INFO stats | grep -E "keyspace_hits|keyspace_misses"

# Connections
redis-cli INFO clients | grep -E "connected_clients|rejected_connections"
```


## Troubleshooting

### High Latency

**Symptoms:** Slow response times, timeouts

**Possible causes:**

1. THP not disabled
2. Swapping occurring
3. Background saves blocking
4. Network issues

**Solutions:**

```bash
# Check if THP is disabled
cat /sys/kernel/mm/transparent_hugepage/enabled
# Should show [never]

# Check for swapping
free -h
vmstat 1

# Check Redis slow log
redis-cli SLOWLOG GET 10

# Check network latency
redis-cli --latency
```

### Connection Refused Errors

**Symptoms:** Clients cannot connect to Redis

**Possible causes:**

1. Connection backlog full
2. Max clients reached
3. Firewall blocking connections

**Solutions:**

```bash
# Check current connections
redis-cli INFO clients

# Check backlog settings
sysctl net.core.somaxconn
redis-cli CONFIG GET tcp-backlog

# Check firewall rules
sudo ufw status | grep 6380

# Increase maxclients if needed
redis-cli CONFIG SET maxclients 20000
```

### Memory Issues

**Symptoms:** High memory usage, OOM errors

**Possible causes:**

1. Memory fragmentation
2. No maxmemory limit set
3. Memory leaks

**Solutions:**

```bash
# Check memory fragmentation
redis-cli INFO memory | grep mem_fragmentation_ratio
# Should be close to 1.0

# Set maxmemory limit (80% of available RAM)
redis-cli CONFIG SET maxmemory 8gb
redis-cli CONFIG SET maxmemory-policy volatile-ttl

# Restart Redis to defragment memory
sudo systemctl restart redis-server
```


## Performance Benchmarking

### Run Redis Benchmark

```bash
# Basic benchmark
redis-benchmark -h redis.example.com -p 6380 --tls --cert /path/to/client.crt --key /path/to/client.key --cacert /path/to/ca.crt

# Benchmark specific operations
redis-benchmark -h redis.example.com -p 6380 --tls --cert /path/to/client.crt --key /path/to/client.key --cacert /path/to/ca.crt -t set,get -n 1000000 -q

# Benchmark with pipelining
redis-benchmark -h redis.example.com -p 6380 --tls --cert /path/to/client.crt --key /path/to/client.key --cacert /path/to/ca.crt -P 16 -q
```

### Expected Performance

**Typical performance on modern hardware:**

* **GET operations:** 100,000+ ops/sec
* **SET operations:** 80,000+ ops/sec
* **Latency:** < 1ms average
* **Memory overhead:** < 20% of data size

**Factors affecting performance:**

1. **CPU:** Redis is single-threaded, so single-core performance matters
2. **Memory:** Faster RAM improves performance
3. **Network:** Low-latency network is critical
4. **Disk:** Only matters for persistence operations


## Summary

The Redis playbook implements the following optimizations:

**Kernel Level:**

* ✅ `vm.overcommit_memory = 1` - Prevents fork failures
* ✅ `vm.swappiness = 1` - Minimizes swapping
* ✅ `net.core.somaxconn = 65536` - Increases connection queue
* ✅ `net.ipv4.tcp_max_syn_backlog = 65536` - Increases SYN queue
* ✅ Transparent Huge Pages disabled - Prevents latency spikes

**Redis Configuration:**

* ✅ `tcp-backlog 65536` - Matches kernel settings
* ✅ `tcp-keepalive 0` - Enables connection reuse
* ✅ `maxclients 10000` - Allows concurrent connections

**Result:** Production-ready Redis deployment optimized for high performance, low latency, and stability.


## References

* [Redis Administration Documentation](https://redis.io/docs/latest/operate/oss_and_stack/management/admin/)
* [Redis Latency Diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)
* [Performance Tuning for Redis - SeveralNines](https://severalnines.com/blog/performance-tuning-redis/)

---

Copyright (c) Forward Email LLC
SPDX-License-Identifier: BUSL-1.1
