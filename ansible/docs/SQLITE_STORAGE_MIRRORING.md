# SQLite Storage Mirroring (Cron Rsync)


## Overview

The **`sqlite-mirror.yml`** playbook configures periodic rsync-based mirroring between primary and secondary encrypted storage volumes on SQLite servers.

This replaces the previous lsyncd-based approach which consumed excessive memory (78GB+) due to inotify overhead when watching 272K+ SQLite database files. The cron rsync approach uses near-zero memory between runs (\~100MB during rsync execution).


## Architecture

```
/mnt/storage_do_1/          (Primary - LUKS encrypted NVMe)
    └── [SQLite databases]
           │
           │  rsync (every 2 min via cron)
           ▼
/mnt/storage_do_2/          (Secondary - LUKS encrypted NVMe)
    └── [Mirror copy]
```

### File Structure

```
/usr/local/bin/
├── sqlite-mirror.sh                    # Mirror script (rsync wrapper)
├── sqlite-mirror-monitor.sh            # Health check script

/etc/cron.d/
├── sqlite-mirror                       # Cron schedule (every 2 min)

/etc/systemd/system/
├── sqlite-mirror-monitor.service       # Health monitor service
├── sqlite-mirror-monitor.timer         # Health monitor timer (every 5 min)

/var/log/sqlite-mirror/
├── mirror.log                          # Mirror activity log
```


## How It Works

1. Cron triggers `/usr/local/bin/sqlite-mirror.sh` every 2 minutes
2. Script acquires an exclusive flock (skips if previous run still active)
3. Rsync mirrors source to target with `--whole-file` (no delta computation)
4. WAL/SHM/journal files are excluded (transient, not needed for backup)
5. Runs at lowest I/O priority (`ionice -c 3 nice -n 19`)
6. Health monitor checks every 5 minutes for staleness or errors


## Why Not Lsyncd

| Factor              | Lsyncd                                           | Cron Rsync                        |
| ------------------- | ------------------------------------------------ | --------------------------------- |
| Memory (272K files) | 78GB+ (inotify watches + Lua state + page cache) | ~100MB during run, 0 between      |
| CPU                 | 1.5 days continuous                              | Seconds per run                   |
| Correctness         | `--inplace` risks partial page writes            | `--whole-file` atomic replacement |
| Complexity          | inotify + Lua + rsync daemon                     | Single rsync command              |
| RPO                 | Sub-second (theoretical)                         | 2 minutes                         |

The 2-minute RPO is acceptable because:

* Both volumes are on the same physical machine
* This is a disaster recovery backup, not a HA failover
* SQLite databases are encrypted (sqlite3-rsync/litestream incompatible)


## Environment Variables

| Variable             | Description                 | Default                     |
| -------------------- | --------------------------- | --------------------------- |
| `MIRROR_SOURCE`      | Source directory to mirror  | `/mnt/storage_do_1`         |
| `MIRROR_TARGET`      | Target directory for mirror | `/mnt/storage_do_2`         |
| `MIRROR_INTERVAL`    | Cron interval in minutes    | `2`                         |
| `MSMTP_RCPTS`        | Email recipients for alerts | `security@forwardemail.net` |
| `MIRROR_SKIP_SAFETY` | Skip safety checks          | `false`                     |


## Usage

### Deployment

```bash
# Deploy to SQLite servers
ansible-playbook ansible/playbooks/sqlite-mirror.yml -l sqlite

# With custom interval (5 minutes)
MIRROR_INTERVAL=5 ansible-playbook ansible/playbooks/sqlite-mirror.yml -l sqlite

# Skip safety checks (target already has data)
MIRROR_SKIP_SAFETY=true ansible-playbook ansible/playbooks/sqlite-mirror.yml -l sqlite
```

### Operational Commands

```bash
# Check mirror log
tail -f /var/log/sqlite-mirror/mirror.log

# Run mirror manually
/usr/local/bin/sqlite-mirror.sh

# Run health check manually
/usr/local/bin/sqlite-mirror-monitor.sh

# Check cron schedule
cat /etc/cron.d/sqlite-mirror

# Verify mirror is running (check recent log entries)
tail -5 /var/log/sqlite-mirror/mirror.log

# Compare source and target (dry-run)
rsync -avnc /mnt/storage_do_1/ /mnt/storage_do_2/ | head -20
```


## Monitoring

The health monitor checks every 5 minutes for:

1. Source/target directories exist
2. No errors in recent log entries
3. Last successful mirror was within 10 minutes
4. Target disk usage below 90%

Alerts are sent via the existing `send-rate-limited-email.sh` mechanism.


## Disaster Recovery

### Failover to Secondary Storage

1. Stop the mirror cron (prevent writes to secondary):
   ```bash
   rm /etc/cron.d/sqlite-mirror
   ```

2. Update application to use secondary storage:
   ```bash
   # Update SQLITE_STORAGE_PATH in .env
   SQLITE_STORAGE_PATH=/mnt/storage_do_2
   pm2 restart all
   ```

### Restoring Primary Storage

1. Recreate LUKS volume (see README.md Bare Metal Advice section)

2. Initial sync from secondary to primary:
   ```bash
   rsync -avP /mnt/storage_do_2/ /mnt/storage_do_1/
   ```

3. Re-deploy mirror:
   ```bash
   MIRROR_SKIP_SAFETY=true ansible-playbook ansible/playbooks/sqlite-mirror.yml -l sqlite
   ```


## License

[(BUSL-1.1 AND MPL-2.0)](LICENSE.md) © [Forward Email LLC](https://forwardemail.net)
