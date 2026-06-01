# Remove Postfix Playbook

This playbook removes Postfix from servers where it was unintentionally installed.


## Problem

The `security.yml` playbook installs and configures Postfix on **all hosts** for SMTP relay functionality. This caused Postfix to be installed on servers where it shouldn't be running (HTTP, Redis, Bree, MongoDB, etc.).


## Solution

The `remove-postfix.yml` playbook completely removes Postfix from affected servers.


## What It Does

1. **Stops Postfix service** - Immediately stops the running Postfix daemon
2. **Disables Postfix service** - Prevents Postfix from starting on boot
3. **Removes Postfix packages** - Uninstalls postfix and postfix-pcre packages
4. **Purges configuration** - Removes all Postfix configuration files
5. **Cleans up directories** - Removes /etc/postfix and /var/spool/postfix


## Usage

### Remove Postfix from specific servers

```bash
# Remove from HTTP servers
ansible-playbook ansible/playbooks/remove-postfix.yml \
  -i hosts.yml \
  -e "target_hosts=http"

# Remove from Redis servers
ansible-playbook ansible/playbooks/remove-postfix.yml \
  -i hosts.yml \
  -e "target_hosts=redis"

# Remove from Bree servers
ansible-playbook ansible/playbooks/remove-postfix.yml \
  -i hosts.yml \
  -e "target_hosts=bree"

# Remove from MongoDB servers
ansible-playbook ansible/playbooks/remove-postfix.yml \
  -i hosts.yml \
  -e "target_hosts=mongo"
```

### Remove from multiple server groups

```bash
# Remove from all non-mail servers
ansible-playbook ansible/playbooks/remove-postfix.yml \
  -i hosts.yml \
  -e "target_hosts=http:redis:bree:mongo:sqlite"
```


## Servers That SHOULD Have Postfix

**Do NOT run this playbook on:**

* MX servers (mx1, mx2)
* SMTP servers
* IMAP servers
* POP3 servers
* Mail relay servers

These servers legitimately need Postfix for mail handling.


## Servers That Should NOT Have Postfix

**Run this playbook on:**

* HTTP/API servers
* Redis servers
* MongoDB servers
* Bree job scheduler servers
* SQLite servers
* Any other non-mail servers


## Verification

After running the playbook, verify Postfix is removed:

```bash
# Check if Postfix is running
systemctl status postfix

# Check if Postfix package is installed
dpkg -l | grep postfix

# Check if Postfix directories exist
ls -la /etc/postfix
ls -la /var/spool/postfix
```

All of these should show that Postfix is not installed or running.


## Impact

**Removing Postfix will:**

* ✅ Stop the Postfix service immediately
* ✅ Free up system resources (memory, CPU)
* ✅ Remove unnecessary mail relay functionality
* ✅ Eliminate potential security concerns from unused services

**Removing Postfix will NOT:**

* ❌ Affect mail delivery on actual mail servers (if you don't run it there)
* ❌ Break application functionality (apps should use SMTP directly, not local Postfix)
* ❌ Cause data loss (Postfix on these servers shouldn't have any queued mail)


## Why This Happened

The `security.yml` playbook was designed to run on all servers and includes Postfix configuration for sending system alerts and notifications. However, this is not needed on servers that:

1. Don't send system notifications
2. Have applications that connect directly to SMTP servers
3. Are not mail handling servers


## Prevention

To prevent Postfix from being reinstalled:

1. **Don't run security.yml on non-mail servers** if it includes Postfix installation
2. **Modify security.yml** to conditionally install Postfix only on mail servers
3. **Use this removal playbook** after running security.yml on affected servers


## Related Documentation

* [Security Playbook](../playbooks/security.yml) - Contains Postfix installation
* [System Optimization](./SYSTEM_OPTIMIZATION.md) - System-wide optimizations
