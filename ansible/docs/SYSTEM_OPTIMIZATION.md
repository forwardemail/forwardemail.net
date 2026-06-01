# System-Wide Optimization Guide

This document describes the system-wide optimizations applied to all servers for improved performance, reduced SSD wear, and enhanced security.


## Overview

The `system-optimization.yml` playbook applies fundamental system-level optimizations that benefit all servers regardless of their specific role. These optimizations focus on:

* **tmpfs for /tmp** - Move temporary files to RAM
* **Filesystem mount options** - Reduce SSD wear and improve performance
* **SSD TRIM support** - Maintain SSD performance over time


## Features

### 1. tmpfs for /tmp (RAM-based Temporary Storage)

**What it does:**

* Mounts `/tmp` directory in RAM using tmpfs filesystem
* Temporary files are stored in memory instead of on SSD

**Benefits:**

* ✅ **Faster I/O**: RAM is orders of magnitude faster than SSD
* ✅ **Reduced SSD wear**: Eliminates frequent writes to SSD
* ✅ **Enhanced security**: Temporary files are automatically wiped on reboot
* ✅ **Better privacy**: Sensitive temporary data doesn't persist on disk

**Configuration:**

```
tmpfs /tmp tmpfs defaults,noatime,mode=1777,size=2G 0 0
```

**Parameters:**

* `defaults`: Standard mount options
* `noatime`: Don't update access times (performance optimization)
* `mode=1777`: Sticky bit set (only file owner can delete their files)
* `size=2G`: Maximum size of 2GB (adjust based on server RAM)

**Automatic size calculation:**

* Servers with ≥8GB RAM: 2GB tmpfs
* Servers with <8GB RAM: 1GB tmpfs

### 2. Filesystem Mount Options

The playbook checks and recommends optimal mount options for the root filesystem and data directories.

#### noatime (No Access Time Updates)

**What it does:**

* Disables updating file access timestamps on read operations

**Benefits:**

* Reduces write operations to SSD
* Improves read performance (no metadata writes)
* Extends SSD lifespan

**Alternative: relatime**

* Updates access time only if older than modify time
* Good compromise between noatime and full atime tracking

#### nodiratime (No Directory Access Time Updates)

**What it does:**

* Disables updating directory access timestamps

**Benefits:**

* Complementary to noatime
* Further reduces metadata writes
* Improves directory traversal performance

#### discard (SSD TRIM Support)

**What it does:**

* Enables automatic TRIM operations for SSDs
* Informs SSD which blocks are no longer in use

**Benefits:**

* Maintains SSD performance over time
* Prevents performance degradation
* Extends SSD lifespan
* Enables SSD garbage collection

**Note**: Only applicable to SSD/NVMe drives, not HDDs.

### 3. Filesystem Type Detection

The playbook automatically detects the filesystem type and provides appropriate recommendations:

* **ext4**: Supports noatime, nodiratime, discard
* **xfs**: Supports noatime, nodiratime, discard (recommended for MongoDB)
* **btrfs**: Supports noatime, nodiratime, discard (with additional features)


## Usage

### Standalone Deployment

```bash
ansible-playbook ansible/playbooks/system-optimization.yml -i hosts.yml
```

### Import in Other Playbooks

The system-optimization playbook is designed to be imported by other playbooks:

```yaml
- name: Import system-wide optimizations
  import_playbook: system-optimization.yml
  vars:
    target_hosts: all
```

### Import in security.yml

To apply system optimizations to all servers, add this to `security.yml`:

```yaml
---
- name: Import system-wide optimizations
  import_playbook: system-optimization.yml
  vars:
    target_hosts: all

# ... rest of security.yml ...
```


## Verification

### Check tmpfs for /tmp

```bash
# Verify /tmp is mounted as tmpfs
mount | grep /tmp

# Expected output:
# tmpfs on /tmp type tmpfs (rw,nosuid,nodev,noatime,size=2097152k,mode=1777)

# Check tmpfs size and usage
df -h /tmp
```

### Check Filesystem Mount Options

```bash
# View current mount options for root filesystem
mount | grep "on / "

# Example output with optimizations:
# /dev/sda1 on / type ext4 (rw,noatime,nodiratime,discard,errors=remount-ro)

# Check specific data directory mount options
mount | grep /var/lib/mongodb
```

### Verify TRIM is Enabled

```bash
# Check if TRIM is supported and enabled
sudo fstrim -v /

# Expected output:
# /: 123.4 GiB (132456789012 bytes) trimmed

# Check TRIM status (for systemd-based systems)
sudo systemctl status fstrim.timer
```


## Recommended Mount Options by Service

| Service     | Filesystem          | Recommended Options                            |
| ----------- | ------------------- | ---------------------------------------------- |
| All servers | Root (/)            | `noatime,nodiratime,discard,errors=remount-ro` |
| MongoDB     | /var/lib/mongodb    | `noatime,nodiratime,discard` (XFS preferred)   |
| Redis       | /var/lib/valkey     | `noatime,nodiratime,discard`                   |
| SQLite      | /home/deploy/sqlite | `noatime,nodiratime,discard,data=ordered`      |


## Automated Mount Options Application

The playbook **automatically applies optimal mount options** to the root filesystem:

✅ **Fully Automated:**

* Detects current mount options
* Adds missing optimizations (noatime, nodiratime, discard)
* Updates `/etc/fstab` (creates backup automatically)
* Remounts root filesystem immediately with new options
* Changes persist across reboots
* Idempotent (safe to run multiple times)

### What the Playbook Does

**Before:**

```
UUID=abc123... / ext4 defaults 0 1
```

**After (automatically applied):**

```
UUID=abc123... / ext4 defaults,noatime,nodiratime,discard 0 1
```

### Automation Details

1. **Detection**: Checks current mount options for root filesystem
2. **Backup**: Creates `/etc/fstab.backup` before any changes
3. **Update**: Adds missing options (noatime, nodiratime, discard) to fstab
4. **Remount**: Applies changes immediately without reboot
5. **Verification**: Confirms new options are active

### Manual Verification

After playbook runs, verify mount options:

```bash
# Check current mount options
mount | grep "on / "

# Check fstab entry
grep " / " /etc/fstab

# Verify backup was created
ls -l /etc/fstab.backup
```


## Performance Impact

### tmpfs for /tmp

* **I/O Performance**: 10-100x faster than SSD for temporary files
* **SSD Wear**: Eliminates all /tmp writes to SSD
* **Memory Usage**: 2GB reserved (but only used as needed)

### noatime + nodiratime

* **Read Performance**: 5-10% improvement for metadata-heavy workloads
* **Write Reduction**: 20-30% fewer writes for read-heavy workloads
* **SSD Lifespan**: Significantly extended due to reduced writes

### discard (TRIM)

* **Long-term Performance**: Prevents SSD slowdown over months/years
* **Write Amplification**: Reduced by 20-40%
* **SSD Lifespan**: Extended by maintaining optimal performance


## Security Considerations

### tmpfs for /tmp

**Benefits:**

* Temporary files automatically wiped on reboot
* No persistent storage of sensitive temporary data
* Reduces attack surface (no temp file persistence)

**Considerations:**

* Large temporary files may consume significant RAM
* System crash = all /tmp data lost (expected behavior)
* Monitor RAM usage if applications heavily use /tmp

### Mount Options

**noatime/nodiratime:**

* No security impact (purely performance optimization)

**discard:**

* Helps securely erase deleted data on SSDs
* Makes data recovery more difficult after deletion


## Troubleshooting

### tmpfs /tmp Issues

**Problem**: Application fails with "No space left on device" in /tmp

**Solution**: Increase tmpfs size in /etc/fstab:

```
tmpfs /tmp tmpfs defaults,noatime,mode=1777,size=4G 0 0
```

**Problem**: High RAM usage

**Solution**: Reduce tmpfs size or move large temp files to disk-based directory

### Mount Options Not Applied

**Problem**: Mount options don't persist after reboot

**Solution**: Verify /etc/fstab syntax and UUID correctness:

```bash
sudo findmnt --verify
```

### TRIM Not Working

**Problem**: `fstrim` command fails

**Solution**: Check if SSD supports TRIM:

```bash
sudo hdparm -I /dev/sda | grep TRIM
```

If TRIM is not supported, remove `discard` mount option.


## Integration with Other Playbooks

This playbook is automatically imported by:

* ✅ **security.yml** (recommended) - Applies to all servers
* ✅ **mongo.yml** - MongoDB servers
* ✅ **redis.yml** - Redis servers
* ✅ **sqlite.yml** - SQLite servers


## References

* [Linux tmpfs documentation](https://www.kernel.org/doc/html/latest/filesystems/tmpfs.html)
* [ext4 mount options](https://www.kernel.org/doc/html/latest/filesystems/ext4.html)
* [SSD TRIM support](https://wiki.archlinux.org/title/Solid_state_drive#TRIM)
* [Filesystem performance tuning](https://wiki.debian.org/SystemOptimization/Filesystem)


## Related Documentation

* [I/O and Filesystem Tuning](./IO_FILESYSTEM_TUNING.md) - Database-specific I/O optimizations
* [High-Traffic Sysctl Tuning](./SYSCTL_HIGH_TRAFFIC.md) - Kernel parameter tuning
* [AMD Ryzen NUMA Optimization](./AMD_RYZEN_NUMA.md) - AMD processor-specific optimizations
