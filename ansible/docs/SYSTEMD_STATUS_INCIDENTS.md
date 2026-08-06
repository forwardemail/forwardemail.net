# Public status incidents

Public GitHub incidents are used only for sustained database outages under the [Upptime lifecycle][1]. They support the status page; they do not replace private email or SMS alerts.

| Public component | Service                                             | Status-page label        |
| ---------------- | --------------------------------------------------- | ------------------------ |
| MongoDB          | `mongod.service` on `mongo.forwardemail.net`        | `mongo-forwardemail-net` |
| Logs             | `mongod.service` on `logs.forwardemail.net`         | `logs-forwardemail-net`  |
| Valkey/Redis     | `valkey-server.service` on `redis.forwardemail.net` | `redis-forwardemail-net` |

PM2 and all other systemd services do not create public incidents.


## What appears publicly

An incident says only that the component is unavailable or has recovered. It does not contain service logs, commands, host diagnostics, IP addresses, tokens, or credentials.

An issue needs two labels to appear in the correct [status-page][3] history: `status` and the component label in the table. The deployment creates a missing component label when needed. It never changes the shared `status` label.


## When an incident opens and closes

The default is three failed checks in a row to open an incident and three healthy checks in a row to close it. This avoids public incidents for a brief restart.


## Token setup

Create a fine-grained GitHub token for `forwardemail/status.forwardemail.net` with **Metadata: read** and **Issues: read and write**, as required by the [GitHub Issues API][2]. Then set it only in the Ansible environment:

```bash
export GITHUB_OCTOKIT_TOKEN='github_pat_REDACTED'
```

Without this token, public incidents are disabled. Private email and SMS alerts continue to work.


## Deploy

Run the normal playbook for each database host:

```bash
./ansible-playbook.js ansible/playbooks/mongo.yml
./ansible-playbook.js ansible/playbooks/logs.yml
./ansible-playbook.js ansible/playbooks/redis.yml
```


## Check the token safely

This is read-only and does not create an issue:

```bash
export GITHUB_OCTOKIT_TOKEN='github_pat_REDACTED'
./ansible/scripts/test-systemd-status-incident.sh
```

To test another component:

```bash
SYSTEMD_INCIDENT_TEST_COMPONENT=logs.forwardemail.net \
  ./ansible/scripts/test-systemd-status-incident.sh
```

The separate `create-open-status-incident-test.sh` script is for an explicit planned public test. Its `create` mode leaves the issue open for manual closure. Use a newly rotated token and follow that script's README.


## Check the deployed integration

```bash
sudo systemctl status forwardemail-systemd-incident-reconcile.timer --no-pager
sudo journalctl -t forwardemail-systemd-incident -n 50 --no-pager
```

Do not stop a production database just to test the status page. Use the read-only token check or the local test suite.


## References

[1]: https://github.com/upptime/uptime-monitor/blob/v1.43.13/src/update.ts "Upptime incident lifecycle"

[2]: https://docs.github.com/en/rest/issues/issues "GitHub Issues REST API"

[3]: https://github.com/upptime/status-page/tree/master/src/components "Upptime status-page components"
