# Legacy Postfix Removal

The `security.yml` baseline requires a host-local, send-only Postfix queue on every managed host. It provides infrastructure alerts without depending on the Forward Email SMTP service, application mail queue, or MongoDB.

Do not remove Postfix from any active host managed by `security.yml`. Removal disables independent monitoring alerts and deletes any queued notifications.


## Scope

`remove-postfix.yml` is retained only for a decommissioned or permanently unmanaged system after all Forward Email monitoring services and timers have been removed. It is not a hardening step and must not be used on HTTP, API, Redis, MongoDB, Bree, SQLite, IMAP, POP3, SMTP, MX, calendar, webmail, or other active infrastructure hosts.

The playbook requires the explicit acknowledgement variable `confirm_remove_postfix=true`. This guard is intentional.


## What It Removes

The playbook stops and disables Postfix, purges its packages, removes `/etc/postfix`, and removes `/var/spool/postfix`. Removing the spool permanently deletes queued alerts.


## Decommissioning Procedure

First confirm that the target is no longer managed, that no monitoring service can call `sendmail`, and that the Postfix queue is empty:

```bash
ansible <retired-host> -i hosts.yml -b -m shell \
  -a 'postqueue -p; systemctl list-timers --all | grep -E "monitor|health|certificate" || true'
```

Run the cleanup against one explicit retired host, never a broad active group:

```bash
ansible-playbook ansible/playbooks/remove-postfix.yml \
  -i hosts.yml \
  -e 'target_hosts=<retired-host>' \
  -e 'confirm_remove_postfix=true' \
  --limit '<retired-host>'
```


## Verification

```bash
ansible <retired-host> -i hosts.yml -b -m shell -a '
  ! systemctl is-active --quiet postfix &&
  ! dpkg-query -W postfix >/dev/null 2>&1 &&
  test ! -e /etc/postfix &&
  test ! -e /var/spool/postfix
'
```


## Restore a Host to Management

Before rerunning `security.yml`, complete the envelope-sender and HELO SPF requirements in the main [Ansible guide](../README.md#alert-transport-and-dns-prerequisites). The playbook then reinstalls the hardened transport, disables all Postfix `inet` services, limits local submissions to `root`, validates that no Postfix TCP socket is listening, and fails closed if either SPF identity does not pass.


## Related Documentation

* [Ansible alert transport and DNS prerequisites](../README.md#alert-transport-and-dns-prerequisites)
* [Security playbook](../playbooks/security.yml)
* [Monitoring guide](./MONITORING.md)
