# UFW IP Allowlist Management - Reusable Playbook


## Overview

The **`ufw-allowlist.yml`** playbook provides a reusable, centralized solution for managing UFW IP allowlists across multiple services (Redis, MongoDB, SQLite). It automates the process of fetching approved IPs from a central source and maintaining UFW firewall rules.


## Features

### Core Functionality

* **Automatic IP allowlist updates** from `https://forwardemail.net/ips/v4.txt`
* **Orphaned rule cleanup** - Removes rules with outdated ports from previous deployments
* **Email notifications** for all changes (or status reports when no changes occur)
* **Retry logic** for network failures (3 attempts with 10-second timeout)
* **Rate-limited email reporting** to prevent notification spam
* **Systemd timer-based automation** - Updates every 10 minutes

### Safety Features

* **Graceful failure handling** - Preserves existing rules if IP fetch fails
* **No UFW reload** - Rules applied immediately without connection drops
* **Diff-based updates** - Only adds/removes IPs that have changed
* **Detailed logging** - All operations logged with timestamps


## Architecture

### File Structure

```
ansible/playbooks/
├── ufw-allowlist.yml          # Reusable UFW allowlist management playbook
├── redis.yml                  # Redis playbook (imports ufw-allowlist.yml)
├── mongo.yml                  # MongoDB playbook (imports ufw-allowlist.yml)
└── sqlite.yml                 # SQLite playbook (imports ufw-allowlist.yml)
```

### Integration Pattern

Each service-specific playbook imports `ufw-allowlist.yml` with custom variables:

```yaml
- name: Import UFW allowlist playbook for Redis
  import_playbook: ufw-allowlist.yml
  vars:
    target_hosts: redis
    service_name: Redis
    service_port_var: REDIS_PORT
    service_port_default: "6380"
    service_identifier: redis
    ufw_comment: "Auto-whitelist Redis TLS"
```


## Variables

| Variable               | Description                        | Example                                   |
| ---------------------- | ---------------------------------- | ----------------------------------------- |
| `target_hosts`         | Ansible host group to target       | `redis`, `mongo`, `sqlite`                |
| `service_name`         | Display name for the service       | `Redis`, `MongoDB`, `SQLite`              |
| `service_port_var`     | Environment variable name for port | `REDIS_PORT`, `MONGO_PORT`, `SQLITE_PORT` |
| `service_port_default` | Default port if env var not set    | `6380`, `27017`, `3456`                   |
| `service_identifier`   | Short identifier for files/scripts | `redis`, `mongo`, `sqlite`                |
| `ufw_comment`          | Comment for UFW rules              | `Auto-whitelist Redis TLS`                |


## Generated Components

For each service, the playbook creates:

### 1. Update Script

* **Location**: `/usr/local/bin/update-{service_identifier}-ufw-whitelist.sh`
* **Purpose**: Fetches IPs and updates UFW rules
* **Features**:
  * Retry logic (3 attempts)
  * Orphaned rule cleanup
  * Diff calculation
  * Email reporting

### 2. Systemd Service

* **Location**: `/etc/systemd/system/{service_identifier}-ufw-whitelist-update.service`
* **Type**: `oneshot`
* **Failure handling**: Triggers `failure-notification@%n.service`

### 3. Systemd Timer

* **Location**: `/etc/systemd/system/{service_identifier}-ufw-whitelist-update.timer`
* **Schedule**:
  * Initial run: 5 minutes after boot
  * Recurring: Every 10 minutes


## Email Notifications

### Email Subject Format

* **Changes detected**: `[UFW] Whitelist Updated: {service_name} (Port {port})`
* **No changes**: `[UFW] Whitelist Status: {service_name} (Port {port}) - No Changes`

### Email Content

* Timestamp
* Status (Changes Applied / No Changes Needed)
* Added IPs (first 20, with count if more)
* Removed IPs (first 20, with count if more)
* Orphaned rules cleaned
* Summary statistics
* Server hostname
* Port number
* Log viewing command


## Usage Examples

### For Redis

```yaml
- name: Import UFW allowlist playbook for Redis
  import_playbook: ufw-allowlist.yml
  vars:
    target_hosts: redis
    service_name: Redis
    service_port_var: REDIS_PORT
    service_port_default: "6380"
    service_identifier: redis
    ufw_comment: "Auto-whitelist Redis TLS"
```

### For MongoDB

```yaml
- name: Import UFW allowlist playbook for MongoDB
  import_playbook: ufw-allowlist.yml
  vars:
    target_hosts: mongo
    service_name: MongoDB
    service_port_var: MONGO_PORT
    service_port_default: "27017"
    service_identifier: mongo
    ufw_comment: "Auto-whitelist MongoDB"
```

### For SQLite

```yaml
- name: Import UFW allowlist playbook for SQLite
  import_playbook: ufw-allowlist.yml
  vars:
    target_hosts: sqlite
    service_name: SQLite
    service_port_var: SQLITE_PORT
    service_port_default: "3456"
    service_identifier: sqlite
    ufw_comment: "Auto-whitelist SQLite"
```


## Operational Commands

### View Timer Status

```bash
# Check if timer is active
sudo systemctl status redis-ufw-whitelist-update.timer

# List all timer schedules
sudo systemctl list-timers
```

### View Logs

```bash
# View recent logs
sudo journalctl -u redis-ufw-whitelist-update.service -n 50

# Follow logs in real-time
sudo journalctl -u redis-ufw-whitelist-update.service -f
```

### Manual Execution

```bash
# Run update script manually
sudo /usr/local/bin/update-redis-ufw-whitelist.sh

# Trigger service manually
sudo systemctl start redis-ufw-whitelist-update.service
```

### View Current UFW Rules

```bash
# List all UFW rules
sudo ufw status numbered

# Filter by service comment
sudo ufw status | grep "Auto-whitelist Redis TLS"
```


## Troubleshooting

### Issue: Timer not running

```bash
# Check timer status
sudo systemctl status redis-ufw-whitelist-update.timer

# Enable and start timer
sudo systemctl enable --now redis-ufw-whitelist-update.timer
```

### Issue: IP fetch failures

```bash
# Test IP list URL manually
curl -s https://forwardemail.net/ips/v4.txt?comments=false

# Check script logs
sudo journalctl -u redis-ufw-whitelist-update.service -n 100
```

### Issue: Orphaned rules

The script automatically detects and removes orphaned rules (rules with the correct comment but wrong port from old deployments). Check logs for cleanup activity:

```bash
sudo journalctl -u redis-ufw-whitelist-update.service | grep "orphaned"
```


## Migration Notes

### From Old Implementation

If migrating from the old inline UFW configuration:

1. **Existing rules are preserved** - The script detects current IPs and only modifies what's changed
2. **Orphaned rules are cleaned** - Old rules with incorrect ports are automatically removed
3. **No manual intervention required** - First run will sync to current IP list

### Environment Variables

Ensure the following environment variables are set:

* `REDIS_PORT` / `MONGO_PORT` / `SQLITE_PORT` - Service port number
* `POSTFIX_RCPTS` - Email recipients for notifications (defaults to `security@forwardemail.net`)


## Security Considerations

1. **IP Source**: IPs are fetched from `https://forwardemail.net/ips/v4.txt?comments=false`
2. **Validation**: Only valid IPv4 addresses are processed (regex: `^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$`)
3. **Failure Mode**: If IP fetch fails after 3 attempts, existing rules are preserved unchanged
4. **No Reload**: UFW rules are applied immediately without reload to prevent connection drops


## Benefits of Reusable Approach

### Before (Inline Implementation)

* **Duplicated code** across redis.yml, mongo.yml, sqlite.yml
* **Maintenance burden** - Changes needed in 3+ places
* **Inconsistency risk** - Different implementations could diverge
* **Harder to test** - Logic embedded in each playbook

### After (Reusable Playbook)

* **Single source of truth** - One playbook for all services
* **Easy maintenance** - Update once, applies everywhere
* **Consistency guaranteed** - Same logic for all services
* **Testable** - Playbook can be tested independently
* **Extensible** - Easy to add new services


## Adding New Services

To add UFW allowlist management to a new service:

1. Import the playbook in your service's playbook:

```yaml
- name: Import UFW allowlist playbook for NewService
  import_playbook: ufw-allowlist.yml
  vars:
    target_hosts: newservice
    service_name: NewService
    service_port_var: NEWSERVICE_PORT
    service_port_default: "9999"
    service_identifier: newservice
    ufw_comment: "Auto-whitelist NewService"
```

2. Ensure environment variable is set:

```bash
export NEWSERVICE_PORT=9999
```

3. Run the playbook - UFW rules will be automatically configured!


## License

[(BUSL-1.1 AND MPL-2.0)](LICENSE.md) © [Forward Email LLC](https://forwardemail.net)
