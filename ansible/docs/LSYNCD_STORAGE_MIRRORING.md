# Lsyncd Real-time Storage Mirroring


## Overview

The **`lsyncd.yml`** playbook configures real-time file synchronization between primary and secondary encrypted storage volumes on SQLite servers. It uses `lsyncd` (Live Syncing Daemon) which monitors file system changes via inotify and mirrors them using rsync.

This is critical for disaster recovery, ensuring that the secondary LUKS-encrypted volume (`/mnt/storage_do_2`) always contains an up-to-date copy of the primary storage (`/mnt/storage_do_1`).


## Features

### Core Functionality

* **Real-time file mirroring** using inotify + rsync
* **Sub-second sync delay** - Changes are mirrored within 1 second
* **Efficient delta sync** - Only changed data is transferred
* **Delete propagation** - Deletions are mirrored to maintain consistency

### Safety Features

* **Pre-flight safety checks** - Prevents accidental data loss
* **Source/target validation** - Verifies directories exist and are mounted
* **Existing data detection** - Fails if target has data (prevents deletion)
* **Skip safety option** - `LSYNCD_SKIP_SAFETY=true` to bypass checks

### Monitoring & Alerts

* **Email notifications** for sync errors and failures
* **Health monitoring** every 5 minutes via systemd timer
* **Rate-limited alerts** to prevent notification spam
* **Disk space monitoring** on target volume

### Reliability

* **Automatic restart** on service failure (10 second delay)
* **Systemd integration** with failure notifications
* **Persistent across reboots** via systemd enable


## Architecture

### File Structure

```
ansible/playbooks/
├── lsyncd.yml                              # Main lsyncd playbook

/etc/lsyncd/
├── lsyncd.conf.lua                         # Lsyncd configuration

/usr/local/bin/
├── lsyncd-monitor.sh                       # Health check script

/etc/systemd/system/
├── lsyncd.service.d/override.conf          # Systemd override for failure notifications
├── lsyncd-monitor.service                  # Health monitor service
├── lsyncd-monitor.timer                    # Health monitor timer (every 5 min)

/var/log/lsyncd/
├── lsyncd.log                              # Sync activity log
├── lsyncd.status                           # Current sync status
```

### Storage Layout

```
/mnt/storage_do_1/          (Primary - LUKS encrypted NVMe)
    └── [SQLite databases and files]
           │
           │  lsyncd (real-time)
           ▼
/mnt/storage_do_2/          (Secondary - LUKS encrypted NVMe)
    └── [Mirror copy]
```


## Environment Variables

| Variable             | Description                           | Default                     |
| -------------------- | ------------------------------------- | --------------------------- |
| `LSYNCD_SOURCE`      | Source directory to mirror            | `/mnt/storage_do_1`         |
| `LSYNCD_TARGET`      | Target directory for mirror           | `/mnt/storage_do_2`         |
| `MSMTP_RCPTS`        | Email recipients for alerts           | `security@forwardemail.net` |
| `LSYNCD_SKIP_SAFETY` | Skip safety checks (use with caution) | `false`                     |


## Usage

### Initial Deployment

```bash
# Deploy lsyncd to SQLite servers
ansible-playbook ansible/playbooks/lsyncd.yml -l sqlite

# Or with custom paths
LSYNCD_SOURCE=/mnt/primary LSYNCD_TARGET=/mnt/backup \
  ansible-playbook ansible/playbooks/lsyncd.yml -l sqlite
```

### Standalone Execution

The playbook can be run independently without importing other playbooks:

```bash
ansible-playbook ansible/playbooks/lsyncd.yml --user deploy -l 'sqlite' --ask-become-pass
```

### Skipping Safety Checks

> \[!WARNING]
> Only skip safety checks if you have verified the target directory is empty or expendable.

```bash
LSYNCD_SKIP_SAFETY=true ansible-playbook ansible/playbooks/lsyncd.yml -l sqlite
```


## Safety Checks

The playbook includes several safety checks to prevent accidental data loss:

### 1. Source Directory Validation

* Verifies source directory exists
* Warns if source is empty (would mirror empty directory)

### 2. Target Directory Validation

* Verifies target directory exists
* **FAILS if target has existing data** (prevents deletion)

### 3. Bypassing Safety Checks

If you need to skip safety checks (e.g., target has old data you want to overwrite):

```bash
# First, verify what's in the target
ls -la /mnt/storage_do_2/
du -sh /mnt/storage_do_2/

# Optionally backup if needed
rsync -avP /mnt/storage_do_2/ /path/to/backup/

# Then run with safety checks disabled
LSYNCD_SKIP_SAFETY=true ansible-playbook ansible/playbooks/lsyncd.yml -l sqlite
```


## Configuration Details

### Lsyncd Settings

The default configuration (`/etc/lsyncd/lsyncd.conf.lua`) uses these optimized settings:

| Setting          | Value    | Purpose                                                 |
| ---------------- | -------- | ------------------------------------------------------- |
| `delay`          | 1 second | Time to wait before syncing (batches rapid changes)     |
| `archive`        | true     | Preserves permissions, timestamps, symlinks             |
| `compress`       | false    | Disabled for local sync (no benefit, adds CPU overhead) |
| `whole_file`     | true     | Better for local disk-to-disk sync                      |
| `--delete`       | enabled  | Removes files from target that don't exist in source    |
| `--delete-after` | enabled  | Delete after transfer (safer)                           |
| `--inplace`      | enabled  | Update files in place (better for large files)          |

### Rsync Options Explained

* **`--delete`**: Ensures target is an exact mirror (removes orphaned files)
* **`--delete-after`**: Performs deletions after all transfers complete (safer)
* **`--inplace`**: Updates destination files in-place (reduces I/O for large SQLite files)
* **`--no-perms`**: Don't sync permissions (both volumes owned by same user)
* **`--omit-dir-times`**: Don't sync directory timestamps (reduces unnecessary updates)


## Email Notifications

### Alert Triggers

The health monitor sends alerts when:

1. **Service not running** - lsyncd service has stopped
2. **Source/target unmounted** - LUKS volumes not accessible
3. **Sync errors** - rsync failures in log file
4. **Large backlog** - More than 100 pending sync items
5. **Disk space low** - Target volume > 90% full

### Email Subject Format

* **Health check failure**: `[ALERT] Lsyncd Health Check Failed on {hostname}`
* **Service failure**: `[FAILED] lsyncd.service on {hostname}` (via systemd)

### Email Content

Alerts include:

* Timestamp and hostname
* Specific issues detected
* Service status output
* Disk usage information
* Recent log entries
* Investigation commands


## Operational Commands

### Service Management

```bash
# Check service status
sudo systemctl status lsyncd

# Restart service
sudo systemctl restart lsyncd

# Stop service (for maintenance)
sudo systemctl stop lsyncd

# View service logs
sudo journalctl -u lsyncd -f
```

### Monitoring

```bash
# Check sync status
cat /var/log/lsyncd/lsyncd.status

# View sync log
tail -f /var/log/lsyncd/lsyncd.log

# Check health monitor timer
sudo systemctl status lsyncd-monitor.timer

# Run health check manually
sudo /usr/local/bin/lsyncd-monitor.sh
```

### Verification

```bash
# Compare source and target (dry-run)
rsync -avnc /mnt/storage_do_1/ /mnt/storage_do_2/

# Count files in both locations
find /mnt/storage_do_1 -type f | wc -l
find /mnt/storage_do_2 -type f | wc -l

# Check for differences
diff -rq /mnt/storage_do_1 /mnt/storage_do_2
```


## Troubleshooting

### Issue: Lsyncd not starting

```bash
# Check for configuration errors
lsyncd -nodaemon -log all /etc/lsyncd/lsyncd.conf.lua

# Check systemd logs
sudo journalctl -u lsyncd -n 50 --no-pager
```

### Issue: Files not syncing

```bash
# Check if inotify watches are exhausted
cat /proc/sys/fs/inotify/max_user_watches

# Increase if needed (add to /etc/sysctl.conf)
echo "fs.inotify.max_user_watches = 524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Issue: High CPU usage

```bash
# Check for too many small file changes
tail -f /var/log/lsyncd/lsyncd.log

# Increase delay if needed (edit /etc/lsyncd/lsyncd.conf.lua)
# Change: delay = 1
# To:     delay = 5
```

### Issue: Sync falling behind

```bash
# Check pending items
grep -c "Delay" /var/log/lsyncd/lsyncd.status

# Check I/O wait
iostat -x 1 5

# Check if rsync is running
ps aux | grep rsync
```


## Disaster Recovery

### Failover to Secondary Storage

If the primary storage fails:

1. **Stop lsyncd** to prevent sync attempts:
   ```bash
   sudo systemctl stop lsyncd
   ```

2. **Verify secondary data integrity**:
   ```bash
   # Check filesystem
   sudo fsck /dev/mapper/nvme2n1

   # Verify SQLite databases
   find /mnt/storage_do_2 -name "*.sqlite" -exec sqlite3 {} "PRAGMA integrity_check;" \;
   ```

3. **Update application configuration** to use secondary storage:
   ```bash
   # Update SQLITE_STORAGE_PATH in .env
   SQLITE_STORAGE_PATH=/mnt/storage_do_2
   ```

4. **Restart services**:
   ```bash
   pm2 restart all
   ```

### Restoring Primary Storage

After replacing/repairing primary storage:

1. **Recreate LUKS volume** (see README.md Bare Metal Advice section)

2. **Initial sync from secondary to primary**:
   ```bash
   rsync -avP /mnt/storage_do_2/ /mnt/storage_do_1/
   ```

3. **Reconfigure lsyncd** (source/target remain the same)

4. **Start lsyncd**:
   ```bash
   sudo systemctl start lsyncd
   ```


## Performance Considerations

### For SQLite Workloads

* **WAL mode**: SQLite's Write-Ahead Logging works well with lsyncd
* **Checkpoint frequency**: Consider SQLite checkpoint settings for consistency
* **Large databases**: The `--inplace` rsync option minimizes I/O for large files

### Tuning for High I/O

For servers with heavy write loads:

```lua
-- In /etc/lsyncd/lsyncd.conf.lua
sync {
    default.rsync,
    source    = "/mnt/storage_do_1/",
    target    = "/mnt/storage_do_2/",
    delay     = 5,  -- Increase delay to batch more changes
    ...
}
```

### Inotify Limits

For directories with many files:

```bash
# Check current limit
cat /proc/sys/fs/inotify/max_user_watches

# Increase limit
echo "fs.inotify.max_user_watches = 524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```


## Security Considerations

1. **Both volumes are LUKS encrypted** - Data at rest is protected
2. **Local sync only** - No network exposure
3. **Root-only access** - Configuration files are mode 0644, owned by root
4. **No credentials stored** - Uses local filesystem permissions


## Integration with SQLite Playbook

The lsyncd playbook is designed to be run after the main SQLite playbook:

```yaml
# In sqlite.yml (optional integration)
- name: Import lsyncd storage mirroring playbook
  import_playbook: lsyncd.yml
```

Or run standalone:

```bash
# After initial SQLite server setup
ansible-playbook ansible/playbooks/lsyncd.yml -l sqlite
```


## License

[(BUSL-1.1 AND MPL-2.0)](LICENSE.md) © [Forward Email LLC](https://forwardemail.net)
