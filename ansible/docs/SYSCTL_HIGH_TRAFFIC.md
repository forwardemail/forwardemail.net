# High-Traffic Server Sysctl Tuning


## Overview

The `sysctl-high-traffic.yml` playbook provides comprehensive kernel parameter tuning for servers handling high traffic volumes with long-lived connections. This is essential for database servers (MongoDB, Redis, SQLite) that maintain persistent connections and handle thousands of concurrent requests.

**Note:** Ubuntu 22.04 uses AppArmor by default for mandatory access control, not SELinux. AppArmor is already enabled and configured through the security.yml playbook.


## Chrony Time Synchronization

Accurate time synchronization is critical for distributed systems, database replication, and TLS certificate validation. The `chrony-timesync.yml` playbook ensures all servers maintain accurate time:

```yaml
- name: Import chrony time synchronization
  import_playbook: chrony-timesync.yml
  vars:
    target_hosts: all
```

**Features:**

* **Primary**: Cloudflare NTP (time.cloudflare.com) - Anycast, sub-millisecond accuracy
* **Fallback**: Google NTP (time.google.com, time2-4.google.com) - Global infrastructure
* Automatic clock stepping for large offsets
* Hardware RTC synchronization
* Leap second handling
* Replaces systemd-timesyncd (conflicts with chrony)

**Why Cloudflare and Google?**

* **Anycast routing**: Connects to nearest server automatically
* **High accuracy**: Sub-millisecond precision
* **Global infrastructure**: Multiple data centers worldwide
* **DDoS protection**: Built-in protection against attacks
* **Free and reliable**: No rate limiting or authentication required

**Verify synchronization:**

```bash
sudo chronyc tracking
sudo chronyc sources
```


## Auto-Scaling Memory Values

All memory-related parameters are automatically calculated based on available system RAM:

* **TCP buffers**: Capped at 16MB (safe kernel limit), or 5% of RAM if less
* **TCP memory**: FIXED at 2GB (min), 3GB (pressure), 4GB (max) - prevents OOM on large RAM systems
* **min\_free\_kbytes**: 1% of RAM (clamped between 64MB-512MB)

This ensures optimal performance across servers with different RAM configurations without manual tuning.


## Features

### Memory Management

* **vm.swappiness=1**: Minimizes swapping to prefer RAM usage
* **vm.dirty\_ratio=20**: Maximum percentage of RAM for dirty pages before blocking writes
* **vm.dirty\_background\_ratio=10**: Starts background writeback at 10% dirty pages
* **vm.dirty\_expire\_centisecs=3000**: Writes dirty data older than 30 seconds
* **vm.dirty\_writeback\_centisecs=500**: Checks for dirty data every 5 seconds

### Network - Connection Queue Tuning

* **net.core.somaxconn=65536**: Maximum connection backlog queue size
* **net.ipv4.tcp\_max\_syn\_backlog=65536**: Maximum SYN backlog for new connections
* **net.core.netdev\_max\_backlog=65536**: Maximum packets in kernel network backlog

### Network - TCP Keepalive (Long-Lived Connections)

* **net.ipv4.tcp\_keepalive\_time=120**: Start keepalive probes after 2 minutes of idle time
* **net.ipv4.tcp\_keepalive\_intvl=30**: Send keepalive probes every 30 seconds
* **net.ipv4.tcp\_keepalive\_probes=3**: Consider connection dead after 3 failed probes

### Network - TCP Connection Lifecycle

* **net.ipv4.tcp\_fin\_timeout=30**: Fast cleanup of closed connections (30 seconds)
* **net.ipv4.tcp\_tw\_reuse=1**: Reuse TIME\_WAIT sockets for new outgoing connections
* **net.ipv4.tcp\_max\_tw\_buckets=2000000**: Maximum TIME\_WAIT sockets to hold

### Network - Port Range

* **net.ipv4.ip\_local\_port\_range=10000 65535**: Expanded ephemeral port range for high connection volumes

### Network - TCP Buffer Tuning (Auto-Scaled)

* **net.core.rmem\_max**: Auto-scaled (max 16MB or 5% of RAM, whichever is less)
* **net.core.wmem\_max**: Auto-scaled (max 16MB or 5% of RAM, whichever is less)
* **net.ipv4.tcp\_rmem**: TCP read buffer (min 4KB, default 87KB, max 16MB)
* **net.ipv4.tcp\_wmem**: TCP write buffer (min 4KB, default 64KB, max 16MB)
* **net.ipv4.tcp\_mem**: FIXED at 524288/786432/1048576 pages (2GB/3GB/4GB total)
* **vm.min\_free\_kbytes**: Auto-scaled to 1% of RAM (minimum 64MB, maximum 512MB)

### Network - TCP Performance

* **net.ipv4.tcp\_slow\_start\_after\_idle=0**: Disable slow start after idle period
* **net.ipv4.tcp\_window\_scaling=1**: Enable TCP window scaling for high-bandwidth connections
* **net.ipv4.tcp\_timestamps=1**: Enable TCP timestamps for better RTT estimation
* **net.ipv4.tcp\_sack=1**: Enable selective acknowledgments for better recovery
* **net.ipv4.tcp\_congestion\_control=bbr**: Use BBR congestion control (better for WebSockets and high-latency networks)

### File System

* **fs.file-max=2097152**: Maximum open file descriptors system-wide (2 million)
* **fs.nr\_open=2097152**: Maximum open file descriptors per process (2 million)

### I/O Scheduler and Filesystem Tuning

**Note**: I/O scheduler configuration, read-ahead tuning, and filesystem mount options are now handled by the separate `io-filesystem-tuning.yml` playbook. See [I/O and Filesystem Tuning](./IO_FILESYSTEM_TUNING.md) for comprehensive documentation.

**Quick summary:**

* **I/O Scheduler**: Automatically selects `deadline` or `mq-deadline` based on device type
* **Read-ahead**: 16KB for database workloads (optimized for random I/O)
* **Filesystem**: Checks for `noatime` mount option and provides recommendations
* **Applied to**: MongoDB, Redis/Valkey, SQLite

### Connection Limits

For high-traffic servers, connection limits are tuned to handle large numbers of concurrent connections:

| Service | Parameter              | Value | Default |
| ------- | ---------------------- | ----- | ------- |
| MongoDB | maxIncomingConnections | 65536 | 65536   |
| Redis   | maxclients             | 65536 | 10000   |

**Why increase connection limits?**

* Default limits are too low for high-traffic production servers
* Prevents "connection refused" errors under load
* Matches kernel socket limits (net.core.somaxconn)
* Essential for microservices architectures with connection pooling


## Usage

### In Playbooks

Import the playbook with service-specific variables:

```yaml
- name: Import high-traffic sysctl tuning for MongoDB
  import_playbook: sysctl-high-traffic.yml
  vars:
    target_hosts: mongo
    service_name: MongoDB
    sysctl_file_name: mongodb
```

### Required Variables

* **target\_hosts**: Ansible host group to target (e.g., `mongo`, `redis`, `sqlite`)
* **service\_name**: Human-readable service name for logging (e.g., `MongoDB`, `Redis`, `SQLite`)
* **sysctl\_file\_name**: Name for the sysctl config file (creates `/etc/sysctl.d/99-{service}.conf`)

### Integrated Services

This playbook is automatically imported by:

* **mongo.yml** - MongoDB servers
* **redis.yml** - Redis/Valkey servers
* **sqlite.yml** - SQLite servers with WebSocket connections


## Service-Specific Additions

Each service adds its own specific parameters in addition to the common high-traffic settings:

### Chrony Time Synchronization (All Servers)

Integrated into all playbooks for accurate time synchronization:

```yaml
- name: Import chrony time synchronization
  import_playbook: chrony-timesync.yml
  vars:
    target_hosts: "{{ target_hosts }}"
```

**Verification:**

```bash
# Check sync status
sudo chronyc tracking

# View time sources
sudo chronyc sources -v

# Check service status
sudo systemctl status chrony
```

### MongoDB

* **vm.max\_map\_count=262144**: Required for WiredTiger storage engine's mmap() usage
* **I/O Scheduler**: deadline for optimal SSD performance
* **Read-ahead**: 16KB for database workloads
* **maxIncomingConnections**: 65536 concurrent connections
* **Authentication**: MONGO\_USER + MONGO\_PASSWORD with security.authorization=enabled
* **Telemetry**: Disabled (mongosh config)
* **Filesystem**: noatime recommended

### Redis/Valkey

* **vm.overcommit\_memory=1**: Required for Redis background saves (BGSAVE)
* **I/O Scheduler**: deadline for optimal SSD performance
* **Read-ahead**: 16KB for database workloads
* **maxclients**: 65536 concurrent connections (increased from default 10000)
* **Filesystem**: noatime recommended

### SQLite

* **vm.swappiness=0**: **DISABLED** (overrides high-traffic default of 1) - No swapping for SQLite
* **vm.max\_map\_count=262144**: Required for mmap() in WAL mode
* **vm.vfs\_cache\_pressure=50**: Prefer keeping inode/dentry cache for SQLite files
* **vm.min\_free\_kbytes=65536**: Reserve 64MB for emergency allocations (overridden by auto-scaling if RAM > 6.4GB)
* **I/O Scheduler**: deadline for optimal SSD performance
* **Read-ahead**: 16KB for random I/O patterns
* **Filesystem**: noatime,data=ordered recommended
* **TCP congestion control**: BBR for WebSocket optimization


## Verification

After deployment, verify the settings:

```bash
# Check all sysctl settings
sysctl -a | grep -E "vm.swappiness|tcp_keepalive|somaxconn|ip_local_port_range"

# Check service-specific config file
cat /etc/sysctl.d/99-mongodb.conf  # or redis, sqlite

# Reload sysctl settings manually if needed
sudo sysctl --system

# Check MongoDB connection limit
mongosh --eval "db.serverStatus().connections"

# Check Redis connection limit
redis-cli CONFIG GET maxclients

# Check time synchronization
sudo chronyc tracking

# For I/O scheduler and filesystem verification, see:
# docs/IO_FILESYSTEM_TUNING.md
```


## Performance Impact

These optimizations provide:

* **Reduced latency** for long-lived connections
* **Higher throughput** with optimized TCP buffers
* **Better connection handling** with larger backlogs
* **Faster recovery** from network issues
* **Improved memory management** for database workloads
* **Auto-scaled parameters** based on available RAM
* **BBR congestion control** for better WebSocket performance
* **Optimized I/O performance** for random access patterns
* **Reduced filesystem overhead** with noatime
* **Accurate time synchronization** across all servers
* **Higher connection capacity** for microservices architectures


## References

* [Linux Kernel Documentation - sysctl](https://www.kernel.org/doc/Documentation/sysctl/)
* [MongoDB Production Notes](https://docs.mongodb.com/manual/administration/production-notes/)
* [Redis Administration](https://redis.io/docs/latest/operate/oss_and_stack/management/admin/)
* [SQLite WAL Mode](https://www.sqlite.org/wal.html)
* [BBR Congestion Control](https://cloud.google.com/blog/products/networking/tcp-bbr-congestion-control-comes-to-gcp-your-internet-just-got-faster)
* [Chrony Documentation](https://chrony.tuxfamily.org/documentation.html)
* [Linux I/O Schedulers](https://www.kernel.org/doc/html/latest/block/index.html)
