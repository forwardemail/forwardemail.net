# Service User Privilege Audit


## Executive Summary

This document audits all services in the Forward Email Ansible playbooks to ensure they run with appropriate user privileges, considering that `security.yml` sets `net.ipv4.ip_unprivileged_port_start=25`, which allows ANY unprivileged user to bind to ANY port >= 25.


## Critical Configuration

**security.yml configures:**

```yaml
- name: net.ipv4.ip_unprivileged_port_start
  value: 25
```

**Impact:** Unprivileged users can bind to ports 25-65535, including:

* Port 25 (SMTP)
* Port 53 (DNS)
* Port 80 (HTTP)
* Port 443 (HTTPS)
* Port 465, 587 (SMTP TLS/submission)
* Port 993 (IMAPS)
* Port 995 (POP3S)

**This eliminates the need for root privileges solely for port binding.**


## Services Requiring Root Privileges

### fail2ban

**User:** root
**Reason:** Must manipulate iptables rules to ban IPs
**Can be changed:** NO
**Status:** ✅ Correct and required

**Why root is required:**

* fail2ban must add/remove iptables rules dynamically
* iptables operations require root privileges
* This is the standard and recommended configuration

**Configuration in security.yml:**

```yaml
- role: fail2ban
  fail2ban_maxretry: 2
  fail2ban_bantime: -1  # Permanent ban
  fail2ban_dbpurgeage: 365d
  fail2ban_findtime: 365d
```

**Default jails:**

* SSH (sshd) - Enabled by default

### ufw (Uncomplicated Firewall)

**User:** root
**Reason:** Firewall configuration and iptables manipulation
**Can be changed:** NO
**Status:** ✅ Correct and required

### sshd (OpenSSH Server)

**User:** root
**Reason:** User authentication, PAM integration, privilege separation
**Can be changed:** NO
**Status:** ✅ Correct and required

**Note:** sshd spawns unprivileged processes for each connection after authentication.

### systemd

**User:** root
**Reason:** Init system, service management
**Can be changed:** NO
**Status:** ✅ Correct and required


## Services Running as Unprivileged Users

### MongoDB

**User:** mongod (created by MongoDB package)
**Port:** 27017
**Needs root:** NO
**Status:** ✅ Correct

**Configuration:**

* Systemd service runs as `mongod` user
* Data directory owned by `mongod:mongod`
* No privileged operations required

### Redis

**User:** redis (created by Redis package)
**Port:** 6380 (TLS), 6379 (disabled in our config)
**Needs root:** NO
**Status:** ✅ Correct

**Configuration:**

* Systemd service runs as `redis` user
* Data directory owned by `redis:redis`
* No privileged operations required

### Unbound (DNS Resolver)

**User:** unbound (created by Unbound package)
**Port:** 53
**Needs root:** NO (thanks to ip\_unprivileged\_port\_start=25)
**Status:** ✅ Correct

**Configuration:**

* Configured with `username: "unbound"` in `/etc/unbound/unbound.conf`
* Can bind to port 53 without root privileges
* Drops privileges after startup

### nginx

**User:** www-data (both master and worker processes)
**Ports:** 80, 443
**Needs root:** NO (thanks to ip\_unprivileged\_port\_start=25)
**Status:** ✅ Configured to run entirely as www-data

**Configuration:**

* Master process: www-data (via systemd override)
* Worker processes: www-data
* Can bind to ports 80, 443 without root (ip\_unprivileged\_port\_start=25)

**Security improvement:**

* No root process
* Reduced attack surface
* Better security isolation
* Leverages kernel configuration for unprivileged port binding

### PM2 (Process Manager)

**User:** deploy
**Ports:** Various application ports
**Needs root:** NO
**Status:** ✅ Correct

**Configuration:**

* PM2 installed and run as `deploy` user
* Node.js applications run as `deploy`
* Can bind to any port >= 25
* No sudo access

### Node.js Applications

**User:** deploy
**Ports:** Various (all >= 25)
**Needs root:** NO
**Status:** ✅ Correct

**Configuration:**

* All Node.js apps managed by PM2 run as `deploy` user
* Can bind to privileged ports thanks to ip\_unprivileged\_port\_start=25
* Proper isolation from system services

### systemd-timesyncd / ntpd

**User:** systemd-timesync or ntp
**Port:** 123 (NTP)
**Needs root:** NO (thanks to ip\_unprivileged\_port\_start=25)
**Status:** ✅ Correct


## Complete Service Matrix

| Service                  | User             | Root Required? | Reason                                       | Status    |
| ------------------------ | ---------------- | -------------- | -------------------------------------------- | --------- |
| **System & Security**    |                  |                |                                              |           |
| systemd                  | root             | YES            | Init system                                  | ✅ Correct |
| sshd                     | root             | YES            | Authentication, PAM                          | ✅ Correct |
| ufw                      | root             | YES            | Firewall management                          | ✅ Correct |
| fail2ban                 | root             | YES            | iptables manipulation                        | ✅ Correct |
| **Web Services**         |                  |                |                                              |           |
| nginx (master)           | www-data         | NO             | Port binding (ip_unprivileged_port_start=25) | ✅ Correct |
| nginx (worker)           | www-data         | NO             | Request handling                             | ✅ Correct |
| **Database Services**    |                  |                |                                              |           |
| MongoDB                  | mongod           | NO             | Database operations                          | ✅ Correct |
| Redis                    | redis            | NO             | Cache operations                             | ✅ Correct |
| **DNS Services**         |                  |                |                                              |           |
| Unbound                  | unbound          | NO             | DNS resolution                               | ✅ Correct |
| **Application Services** |                  |                |                                              |           |
| PM2                      | deploy           | NO             | Process management                           | ✅ Correct |
| Node.js apps             | deploy           | NO             | Application code                             | ✅ Correct |
| **Time Services**        |                  |                |                                              |           |
| systemd-timesyncd        | systemd-timesync | NO             | Time sync                                    | ✅ Correct |


## User Roles

| User             | Purpose                | Sudo Access    | Created By             | Services                     |
| ---------------- | ---------------------- | -------------- | ---------------------- | ---------------------------- |
| root             | System administration  | N/A            | System                 | systemd, sshd, ufw, fail2ban |
| devops           | System administration  | Yes (NOPASSWD) | Ansible (security.yml) | -                            |
| deploy           | Application deployment | No             | Ansible (security.yml) | PM2, Node.js apps            |
| mongod           | MongoDB service        | No             | MongoDB package        | mongod                       |
| redis            | Redis service          | No             | Redis package          | redis-server                 |
| unbound          | DNS resolver service   | No             | Unbound package        | unbound                      |
| www-data         | Web server             | No             | System                 | nginx                        |
| systemd-timesync | Time synchronization   | No             | System                 | systemd-timesyncd            |


## Recommendations

### All Services Running with Appropriate Privileges ✅

**Current configuration:**

* MongoDB (mongod user) ✅
* Redis (redis user) ✅
* Unbound (unbound user) ✅
* PM2 / Node.js (deploy user) ✅
* nginx (www-data user - both master and workers) ✅
* fail2ban (root - required for iptables) ✅
* ufw (root - required) ✅
* sshd (root - required) ✅


## Security Best Practices Verified

1. ✅ **Principle of least privilege** - Services run with minimum required permissions
2. ✅ **Service isolation** - Each service type has dedicated user
3. ✅ **No unnecessary root processes** - Only services requiring root run as root
4. ✅ **Unprivileged port binding** - Enabled via ip\_unprivileged\_port\_start=25
5. ✅ **Database security** - MongoDB and Redis run as dedicated unprivileged users
6. ✅ **Application security** - Node.js apps run as unprivileged deploy user


## Conclusion

**Current state:** ALL services are running with appropriate privileges.

**Key findings:**

1. ✅ Database services (MongoDB, Redis) - Running as unprivileged users
2. ✅ DNS caching (Unbound) - Running as unprivileged user
3. ✅ Applications (PM2, Node.js) - Running as unprivileged user
4. ✅ nginx - Running entirely as www-data (both master and workers)
5. ✅ System services (ufw, sshd, fail2ban) - Running as root (required)

**Result:** Production-ready configuration following security best practices and industry standards.


## References

* [Dear Linux, Privileged Ports Must Die](https://ar.al/2022/08/30/dear-linux-privileged-ports-must-die/)
* [Stack Overflow: ip\_unprivileged\_port\_start](https://stackoverflow.com/a/51439516)
* [MongoDB Production Notes](https://www.mongodb.com/docs/manual/administration/production-notes/)
* [Redis Security](https://redis.io/docs/latest/operate/oss_and_stack/management/security/)


## License

[(BUSL-1.1 AND MPL-2.0)](LICENSE.md) © [Forward Email LLC](https://forwardemail.net)
