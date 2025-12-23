# I/O and Filesystem Tuning for Database Servers


## Overview

The `io-filesystem-tuning.yml` playbook provides comprehensive I/O scheduler and filesystem optimization for database servers running MongoDB, Redis/Valkey, and SQLite. This reusable component automatically detects the block device type and applies appropriate optimizations for maximum database performance.


## Features

### Automatic Device Detection

* Detects the block device for the specified data directory
* Identifies whether device is multi-queue (NVMe, modern SSD) or single-queue
* Automatically selects appropriate I/O scheduler based on device type

### I/O Scheduler Optimization

* **Multi-queue devices** (NVMe, modern SSDs): Uses `mq-deadline` scheduler
* **Single-queue devices** (older SSDs, SATA): Uses `deadline` scheduler
* **Why deadline?** Provides predictable latency and optimal throughput for database random I/O patterns
* Makes scheduler settings persistent via udev rules

### Read-Ahead Tuning

* Sets read-ahead to 16KB for database workloads
* Optimized for random I/O patterns typical of databases
* Reduces unnecessary prefetching that wastes memory and I/O bandwidth
* Persistent across reboots via udev rules

### Filesystem Mount Options Check

* Verifies if `noatime` or `relatime` is enabled
* Displays recommendations if not configured
* **Why noatime?** Prevents updating file access timestamps on every read, significantly reducing I/O overhead


## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 io-filesystem-tuning.yml                    │
│                  (Reusable Playbook)                        │
└─────────────────────────────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   ┌──────────┐      ┌──────────┐    ┌──────────┐
   │ mongo.yml│      │redis.yml │    │sqlite.yml│
   └──────────┘      └──────────┘    └──────────┘
   data_directory:   data_directory:  data_directory:
   /var/lib/mongodb  /var/lib/valkey  /home/deploy/sqlite
   read_ahead: 16KB  read_ahead: 16KB read_ahead: 16KB
```


## Integration

### MongoDB (Primary)

```yaml
- name: Import I/O and filesystem tuning for MongoDB
  import_playbook: io-filesystem-tuning.yml
  vars:
    target_hosts: mongo
    service_name: MongoDB
    service_identifier: mongo
    data_directory: /var/lib/mongodb
    read_ahead_kb: 16
```

### Redis/Valkey

```yaml
- name: Import I/O and filesystem tuning for Redis
  import_playbook: io-filesystem-tuning.yml
  vars:
    target_hosts: redis
    service_name: Redis
    service_identifier: redis
    data_directory: /var/lib/valkey
    read_ahead_kb: 16
```

### SQLite

```yaml
- name: Import I/O and filesystem tuning for SQLite
  import_playbook: io-filesystem-tuning.yml
  vars:
    target_hosts: sqlite
    service_name: SQLite
    service_identifier: sqlite
    data_directory: /home/deploy/sqlite
    read_ahead_kb: 16
```


## Variable Reference

| Variable             | Type    | Required | Description                                                         |
| -------------------- | ------- | -------- | ------------------------------------------------------------------- |
| `target_hosts`       | string  | Yes      | Ansible inventory group (e.g., "mongo", "redis", "sqlite")          |
| `service_name`       | string  | Yes      | Human-readable service name for display                             |
| `service_identifier` | string  | Yes      | Short identifier for file naming (e.g., "mongo", "redis", "sqlite") |
| `data_directory`     | string  | Yes      | Path to database data directory                                     |
| `read_ahead_kb`      | integer | Yes      | Read-ahead size in KB (recommended: 16 for databases)               |


## How It Works

### 1. Device Detection

```bash
# Detects block device for data directory
df /var/lib/mongodb | tail -1 | awk '{print $1}' | sed 's/[0-9]*$//'
# Example output: /dev/nvme0n1
```

### 2. Multi-Queue Detection

```bash
# Checks if device supports multi-queue
ls /sys/block/nvme0n1/mq
# If exists: use mq-deadline
# If not exists: use deadline
```

### 3. I/O Scheduler Configuration

```bash
# Set scheduler immediately
echo "mq-deadline" > /sys/block/nvme0n1/queue/scheduler

# Make persistent via udev rule
# /etc/udev/rules.d/60-mongo-scheduler.rules
ACTION=="add|change", KERNEL=="nvme0n1", ATTR{queue/scheduler}="mq-deadline"
```

### 4. Read-Ahead Configuration

```bash
# Set read-ahead to 16KB (32 sectors of 512 bytes)
blockdev --setra 32 /dev/nvme0n1

# Make persistent via udev rule
# /etc/udev/rules.d/60-mongo-readahead.rules
ACTION=="add|change", KERNEL=="nvme0n1", ATTR{bdi/read_ahead_kb}="16"
```

### 5. Filesystem Mount Check

```bash
# Check current mount options
mount | grep "/dev/nvme0n1" | awk '{print $6}'

# Displays recommendation if noatime not enabled
```


## Verification

### Check I/O Scheduler

```bash
# View current scheduler (active one in brackets)
cat /sys/block/nvme0n1/queue/scheduler
# Output: [mq-deadline] none

# Or use this one-liner
for dev in /sys/block/*/queue/scheduler; do echo "$dev: $(cat $dev)"; done
```

### Check Read-Ahead

```bash
# View read-ahead setting in KB
cat /sys/block/nvme0n1/queue/read_ahead_kb
# Output: 16

# Or use blockdev
blockdev --getra /dev/nvme0n1
# Output: 32 (sectors, 16KB)
```

### Check Mount Options

```bash
# View mount options for root filesystem
mount | grep ' / ' | awk '{print $6}'
# Look for: noatime or relatime
```

### Verify Udev Rules

```bash
# List udev rules created by playbook
ls -la /etc/udev/rules.d/60-*-scheduler.rules
ls -la /etc/udev/rules.d/60-*-readahead.rules

# View rule content
cat /etc/udev/rules.d/60-mongo-scheduler.rules
```


## Performance Impact

### I/O Scheduler (deadline/mq-deadline)

* **Benefit**: Predictable latency for database operations
* **Impact**: 10-30% improvement in random I/O throughput
* **Why**: Sorts I/O requests by sector number, reduces seek time
* **Tradeoff**: Slightly less fair than CFQ, but databases benefit from throughput

### Read-Ahead (16KB)

* **Benefit**: Reduces unnecessary prefetching for random I/O
* **Impact**: 5-15% reduction in memory pressure and I/O bandwidth waste
* **Why**: Databases have random access patterns, large read-ahead wastes resources
* **Default**: Most systems default to 128KB or 256KB (too large for databases)

### noatime Mount Option

* **Benefit**: Eliminates access time metadata writes
* **Impact**: 5-10% reduction in I/O operations for read-heavy workloads
* **Why**: Every file read normally triggers a metadata write to update access time
* **Tradeoff**: Some backup tools rely on atime (rare in modern systems)


## Research Sources

### MongoDB (Primary)

* **Official Documentation**: [MongoDB Production Notes](https://www.mongodb.com/docs/manual/administration/production-notes/)
* Recommends `deadline` I/O scheduler for physical servers
* Recommends `noop` for virtual machines (delegates to hypervisor)

### Redis/Valkey

* **Official Documentation**: [Redis Performance Tuning Best Practices](https://redis.io/kb/doc/1mebipyp1e/performance-tuning-best-practices)
* Focus on memory management and command optimization
* No explicit I/O scheduler recommendation (community consensus: deadline)

### SQLite

* **PowerSync Guide**: [SQLite Optimizations For Ultra High-Performance](https://www.powersync.com/blog/sqlite-optimizations-for-ultra-high-performance)
* WAL mode benefits from sequential write optimization
* Recommends noatime mount option for reduced I/O overhead

### Linux I/O Schedulers

* **Red Hat Documentation**: [I/O Scheduler Tuning](https://access.redhat.com/solutions/5427)
* **Academic Research**: "BFQ, Multiqueue-Deadline, or Kyber? Performance Comparison" (2024)
* **Phoronix**: [MQ-Deadline Scalability Improvements](https://www.phoronix.com/news/MQ-Deadline-Scalability) (2024)


## Best Practices

### When to Use This Playbook

* ✅ All database servers (MongoDB, Redis, SQLite)
* ✅ Production environments with performance requirements
* ✅ Servers with dedicated database workloads
* ✅ Both physical servers and VMs (auto-detects appropriate scheduler)

### When NOT to Use

* ❌ Multi-purpose servers running diverse workloads
* ❌ Development/testing environments (unless testing performance)
* ❌ Servers with RAID controllers that handle I/O scheduling internally

### Additional Recommendations

1. **Enable noatime**: Edit `/etc/fstab` and add `noatime` to mount options
2. **Use ext4 or XFS**: Best filesystem choices for databases
3. **Disable transparent huge pages**: For MongoDB and Redis
4. **Monitor I/O metrics**: Use `iostat`, `iotop`, or monitoring tools
5. **Test before production**: Benchmark your specific workload


## Troubleshooting

### Scheduler Not Applied

```bash
# Check if device supports scheduler configuration
ls /sys/block/nvme0n1/queue/scheduler

# If file doesn't exist, device may not support I/O scheduling
# (e.g., some RAID controllers, some cloud providers)
```

### Read-Ahead Not Persistent After Reboot

```bash
# Verify udev rules exist
ls -la /etc/udev/rules.d/60-*-readahead.rules

# Reload udev rules
udevadm control --reload-rules
udevadm trigger

# Check if rule is applied
udevadm test /sys/block/nvme0n1
```

### noatime Recommendation Ignored

```bash
# Check current mount options
mount | grep ' / '

# If relatime is present, it's acceptable (updates atime only if older than mtime)
# To change to noatime, edit /etc/fstab:
sudo nano /etc/fstab
# Add noatime to options column
# Then remount:
sudo mount -o remount /
```


## Files Created

| File                                             | Purpose                                |
| ------------------------------------------------ | -------------------------------------- |
| `/etc/udev/rules.d/60-{service}-scheduler.rules` | Persistent I/O scheduler configuration |
| `/etc/udev/rules.d/60-{service}-readahead.rules` | Persistent read-ahead configuration    |


## Related Documentation

* [System-Wide Optimization](./SYSTEM_OPTIMIZATION.md) - tmpfs and filesystem mount options for all servers
* [AMD Ryzen NUMA Optimization](./AMD_RYZEN_NUMA.md) - AMD processor-specific NUMA optimizations
* [High-Traffic Server Kernel Tuning](./SYSCTL_HIGH_TRAFFIC.md) - Comprehensive kernel parameter tuning
* [UFW IP Allowlist Management](./UFW_ALLOWLIST.md) - Firewall configuration for database servers
* [PM2 Health Monitoring](./PM2_MONITORING.md) - Process monitoring for Node.js applications


## GitHub References

* **MongoDB**: <https://github.com/mongodb/mongo>
* **Valkey**: <https://github.com/valkey-io/valkey>
* **SQLite**: <https://github.com/sqlite/sqlite>
* **Linux Kernel I/O Schedulers**: <https://www.kernel.org/doc/html/latest/block/index.html>
