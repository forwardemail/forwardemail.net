# Server monitoring and alerts


## What you receive

Every real [systemd][1] service failure sends a detailed **email**. The email contains the service name, host, failure result, current service status, and logs from the failing run. Sensitive values are redacted before the email is queued.

Only a small set of important services also sends an **SMS**. Text messages are intentionally short. They contain the service, host, time, failure result, exit information, and whether the email was queued. They do not contain logs, commands, process output, passwords, tokens, or other sensitive details.

| Service                                                       | Email | SMS                     | Public status page |
| ------------------------------------------------------------- | ----- | ----------------------- | ------------------ |
| Any genuine systemd failure                                   | Yes   | No, unless listed below | No                 |
| MongoDB on `mongo.forwardemail.net`                           | Yes   | Yes                     | Yes                |
| MongoDB on `logs.forwardemail.net`                            | Yes   | Yes                     | Yes                |
| Valkey on `redis.forwardemail.net`                            | Yes   | Yes                     | Yes                |
| PM2 startup or PM2 health check on a Node.js server           | Yes   | Yes                     | Yes                |
| Timers, package updates, Unbound, backups, and other services | Yes   | No                      | No                 |

A successful, stale, malformed, or mismatched systemd event sends no alert. This prevents messages like the earlier `fwupd-refresh.service` alert that mixed an old successful run with an empty failure result.


## Automatic security-update reboots

Non-database hosts may reboot automatically at **08:00 UTC** after security updates. `logs`, `mongo`, and `redis` hosts never reboot automatically; schedule their maintenance restart yourself.


## Email and SMS cooldowns

Each service has a separate **10-minute** cooldown for email and SMS.

| Channel | Cooldown begins when            | What happens during the cooldown          |
| ------- | ------------------------------- | ----------------------------------------- |
| Email   | Local Postfix accepts the email | Another email for that service is skipped |
| SMS     | Twilio accepts the text message | Another SMS for that service is skipped   |

The two cooldowns are independent. A failed SMS can retry later without sending another email. `EmailQueue=queued` means Postfix accepted the email locally; it does not guarantee final inbox delivery.


## PM2

[PM2][2] is checked every 10 minutes. An alert is sent when PM2 is missing, has no managed processes, has a stopped or errored process, or no longer matches its saved process list. See [PM2 monitoring](PM2_MONITORING.md) for the short maintenance procedure.


## Public status page

When the GitHub token is configured, sustained database and PM2 failures create public incidents. Each incident is attached to the affected status-page component and closes automatically after recovery. The public page never shows private logs, host diagnostics, IP addresses, commands, or credentials. See [status incidents](SYSTEMD_STATUS_INCIDENTS.md) if you need to manage that integration.


## Check an alert

Start with the email. It is the detailed private record of the failure. On the affected host, use these commands:

```bash
sudo systemctl status <service> --no-pager
sudo journalctl -u <service> -n 100 --no-pager
sudo journalctl -u postfix -n 100 --no-pager
sudo postqueue -p
```

For a PM2 alert, also run:

```bash
sudo systemctl status pm2-health-check.timer --no-pager
sudo journalctl -u pm2-health-check.service -n 100 --no-pager
sudo -u deploy bash -lc 'pm2 list'
```


## Planned PM2 maintenance

If PM2 will be intentionally stopped for longer than one health-check interval, create the maintenance marker first:

```bash
sudo touch /run/forwardemail-pm2-maintenance
sudo systemctl stop pm2-deploy.service
```

When maintenance is complete:

```bash
sudo systemctl start pm2-deploy.service
sudo rm -f /run/forwardemail-pm2-maintenance
sudo systemctl start pm2-health-check.service
```


## Alert email setup

Alerts use the server's local send-only [Postfix](https://github.com/vdukhovni/postfix) queue. Configure the sender and recipients before deployment:

```bash
export ALERT_EMAIL_FROM=mailerdaemon@forwardemail.net
export ALERT_EMAIL_RECIPIENTS=security@forwardemail.net
```

The server's configured hostname is used as the Postfix HELO name. Deployment checks SPF before changing Postfix. See the [Ansible alert transport guide](../README.md#alert-transport-and-dns-prerequisites) for DNS requirements.


## Routine monitors

Routine monitors remain email-only. They cover resource use, SSH activity, USB devices, root access, audits, package changes, open ports, and certificates.

| Check                   | Usual interval             |
| ----------------------- | -------------------------- |
| Resource usage          | 5 minutes                  |
| SSH activity            | 10 minutes                 |
| USB devices             | 5 minutes plus udev events |
| Root access             | 5 minutes                  |
| Open ports              | 5 minutes                  |
| Package changes         | Hourly                     |
| Audits and certificates | Daily                      |


## Apply an alert update

A `git pull` or PM2 reload updates the application only. It does **not** update systemd alert files on servers.

Run this from the Ansible directory after pulling the alerting code:

```bash
node ../ansible-playbook.js playbooks/security.yml --tags forwardemail-alert-policy
```

The rollout pauses notifications, replaces the shared notifier on every host, checks that the old detailed-SMS script is gone, then turns notifications back on. If the check fails, notifications stay off instead of using the old script.


## Safe local tests

Use the repository tests for channel-routing checks. They use local mocks and do not send email or SMS:

```bash
ansible/scripts/test-alerts.sh
```

Do not stop a production database or PM2 service just to test alerts.


## References

[1]: https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html#OnFailure= "systemd OnFailure"

[2]: https://pm2.keymetrics.io/docs/usage/quick-start/ "PM2 documentation"
