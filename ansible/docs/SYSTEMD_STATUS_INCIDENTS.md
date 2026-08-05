# Privacy-preserving systemd status incidents

The shared `security.yml` playbook can publish a minimal public GitHub incident after a sustained failure of one allowlisted database process. It complements the existing private email and optional SMS notifications; it does not replace them and never publishes their diagnostics.

| Public component | Required host FQDN       | Watched unit            | Upptime label            |
| ---------------- | ------------------------ | ----------------------- | ------------------------ |
| MongoDB          | `mongo.forwardemail.net` | `mongod.service`        | `mongo-forwardemail-net` |
| Logs             | `logs.forwardemail.net`  | `mongod.service`        | `logs-forwardemail-net`  |
| Valkey/Redis     | `redis.forwardemail.net` | `valkey-server.service` | `redis-forwardemail-net` |

No other host or unit is eligible. The playbook derives the mapping from the immutable, host-owned alert identity and does not accept a runtime component name from a failed service.


## Incident lifecycle

The fleet-wide `OnFailure` service records the first unhealthy observation. A one-minute timer then reconciles the watched process. By default, an incident opens only after **three consecutive unhealthy observations** and resolves only after **three consecutive healthy observations**. These thresholds suppress ordinary restart noise while ensuring a process that stays stopped is still detected.

The reporter searches for an open issue containing its unique, non-diagnostic ownership marker before creating anything. It creates at most one issue per component, locks it, and assigns both `status` and the exact Upptime monitor-slug label. This matches the repository's pinned Upptime incident contract.[1][] The ownership marker, not the labels, prevents the reporter from adopting an unrelated SSH-monitor incident.

Before opening an issue, the reporter verifies both repository labels. It never creates or redefines `status`. If the allowlisted component label is absent, it creates that label with the same neutral `ededed` color used by Upptime, then re-reads it before proceeding. This is required for `logs-forwardemail-net`, which is a live monitor slug but does not currently exist in the repository label catalog. The operation uses the same fine-grained `Issues: write` permission as issue creation and labeling.[2][]

On each unhealthy reconciliation after an incident opens, the reporter verifies its marker-owned issue remains open, locked, and correctly labeled. If another workflow closes it while the systemd unit is still unhealthy, the reporter opens a replacement. On stable recovery, the reporter unlocks the owned issue, adds one generic resolution comment, closes it, and locks it again.


## Public data contract

The title is limited to `🛑 <public-component> is unavailable`. The body says only that automated health checks detected a sustained interruption and that the team is investigating. The resolution says only that automated checks confirm recovery.

The reporter never publishes journal output, process output, exit codes, restart counts, hostnames other than the public component, IP addresses, paths, database names, command lines, usernames, environment values, or token fragments. Detailed diagnostics remain exclusively in the existing private email and optional SMS path.


## GitHub token

Use a fine-grained token restricted to `forwardemail/status.forwardemail.net` with these repository permissions:

| Permission | Access         |
| ---------- | -------------- |
| Metadata   | Read-only      |
| Issues     | Read and write |

Export the token only in the controller environment used to run Ansible:

```bash
export GITHUB_OCTOKIT_TOKEN='github_pat_REDACTED'
export SYSTEMD_INCIDENT_FAILURE_THRESHOLD=3
export SYSTEMD_INCIDENT_RECOVERY_THRESHOLD=3
```

Both thresholds must be integers from 2 through 10. Leaving `GITHUB_OCTOKIT_TOKEN` unset disables public incidents while preserving private alerts. On an eligible host, Ansible writes the token only to `/etc/forwardemail-alerts/github-systemd-incident.env`, owned by `root:root` with mode `0600`. The reporter never puts the token on its command line or in the journal.


## Deployment

Run the appropriate playbook for each host after exporting the environment variables:

```bash
./ansible-playbook.js ansible/playbooks/mongo.yml
./ansible-playbook.js ansible/playbooks/logs.yml
./ansible-playbook.js ansible/playbooks/redis.yml
```

Verify the deployment without exposing the token:

```bash
sudo test "$(stat -c '%U:%G %a' /etc/forwardemail-alerts/github-systemd-incident.env)" = 'root:root 600'
sudo systemctl is-enabled forwardemail-systemd-incident-reconcile.timer
sudo systemctl is-active forwardemail-systemd-incident-reconcile.timer
sudo systemctl cat failure-notification@.service | grep -F 'Wants=network-online.target forwardemail-systemd-incident-event@%i.service'
sudo systemctl cat forwardemail-systemd-incident-event@.service | grep -F 'ExecStart=/usr/local/bin/report-systemd-status-incident.sh event %i'
sudo journalctl -t forwardemail-systemd-incident -n 50 --no-pager
```

Do not print or `cat` the root-only environment file.


## Environment-driven API test

The tracked `ansible/scripts/test-systemd-status-incident.sh` script uses `GITHUB_OCTOKIT_TOKEN` directly and defaults to read-only checks.

```bash
export GITHUB_OCTOKIT_TOKEN='github_pat_REDACTED'
./ansible/scripts/test-systemd-status-incident.sh
```

This verifies repository access, the `status` label, the selected component label, and the two-label issue query without creating an issue or repository label. The default component is `mongo.forwardemail.net`. Select another allowlisted component with `SYSTEMD_INCIDENT_TEST_COMPONENT`:

```bash
export SYSTEMD_INCIDENT_TEST_COMPONENT=logs.forwardemail.net
./ansible/scripts/test-systemd-status-incident.sh
```

If the component label is absent, read-only mode reports that fact without creating it.

To prove create, lock, comment, close, and re-lock permissions without placing an incident on the status page, run:

```bash
export SYSTEMD_INCIDENT_TEST_MODE=lifecycle
export SYSTEMD_INCIDENT_TEST_CONFIRM=CREATE_AND_CLOSE_GITHUB_TEST_ISSUE
./ansible/scripts/test-systemd-status-incident.sh
```

For a true end-to-end public status test, the following explicit mode creates and immediately resolves an issue labeled with both `status` and the selected component slug. Run it only during a planned test window:

```bash
export SYSTEMD_INCIDENT_TEST_COMPONENT=mongo.forwardemail.net
export SYSTEMD_INCIDENT_TEST_MODE=status-lifecycle
export SYSTEMD_INCIDENT_TEST_CONFIRM=CREATE_AND_CLOSE_PUBLIC_STATUS_INCIDENT
./ansible/scripts/test-systemd-status-incident.sh
```

The test verifies both labels while the issue is open and again after closure. It creates an absent component slug label only in this explicitly confirmed public mode. The test uses a unique ownership marker and best-effort cleanup if interrupted. It never includes production host diagnostics in the issue.

The public page's active-incident query uses `status`; each component history page requires `status` and the component slug.[3][] The page caches GitHub responses in browser local storage for up to two minutes by default, so a newly opened incident may require a hard refresh or a short wait. Issue labels do not change the component's live green/red tile; that tile comes from Upptime's generated `history/summary.json`.[3][]


## Runtime inspection

Use these commands to inspect state without disrupting production processes:

```bash
sudo systemctl status forwardemail-systemd-incident-reconcile.timer
sudo systemctl status forwardemail-systemd-incident-reconcile.service
sudo journalctl -t forwardemail-systemd-incident -n 100 --no-pager
sudo jq . /var/lib/forwardemail-alerts/systemd-incident-*.json
```

Do not stop MongoDB, Logs MongoDB, or Valkey to test the integration. Use the environment-driven API test above. The deployment validation suite exercises the debounce state machine against a local mock of the GitHub API.


## Failure behavior and rollback

GitHub transport or API failures are recorded locally with only the public component, operation name, and status code. They never make the `OnFailure` notification unit fail, never trigger recursive public incidents, and never weaken private email or SMS delivery. Local state is committed atomically and every invocation is serialized with `flock`.

To disable public incident reporting without removing private alerts, unset `GITHUB_OCTOKIT_TOKEN` and rerun the three playbooks. Ansible removes the root-only token file and stops/disables the reconciliation timer. Existing public incidents remain under operator control; resolve an open owned incident before disabling the bridge if the component is healthy.


## References

The lifecycle follows the repository's pinned [Upptime uptime-monitor](https://github.com/upptime/uptime-monitor) behavior: create with `status` and the monitor slug, lock on outage, then unlock, comment, close, and lock on recovery. GitHub calls use the versioned [Issues REST API](https://docs.github.com/en/rest/issues/issues), [labels REST API](https://docs.github.com/en/rest/issues/labels), and [issue locking API](https://docs.github.com/en/rest/issues/locking).

[1]: https://github.com/upptime/uptime-monitor/blob/v1.43.13/src/update.ts#L606-L648 "Upptime v1.43.13 incident labels"

[2]: https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens "GitHub fine-grained REST permissions"

[3]: https://github.com/upptime/status-page/tree/master/src/components "Upptime status-page incident and live-status components"
