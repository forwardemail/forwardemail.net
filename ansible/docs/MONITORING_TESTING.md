# Testing monitoring and alerts

Use the local tests first. They use mocks and do not send real email, SMS, or GitHub requests.


## Fast check

Run these from the repository after applying the alerting patch:

```bash
ansible/scripts/test-alerts.sh
```

These tests check the alert behavior that matters:

| Check                                            | Expected result                                       |
| ------------------------------------------------ | ----------------------------------------------------- |
| Genuine [systemd][1] failure                     | Detailed email attempt                                |
| MongoDB, Logs, Redis, and [PM2][2] failures      | Detailed email plus short SMS                         |
| Other systemd failures                           | Detailed email only                                   |
| Successful or stale systemd event                | No email and no SMS                                   |
| PM2 missing, stopped, errored, empty, or drifted | PM2 health failure and dual-channel alert             |
| PM2 maintenance marker                           | No PM2 health alert                                   |
| Public status incident                           | Generic component-only text with both required labels |
| Email diagnostics                                | Redacted and kept out of process arguments            |
| SMS diagnostics                                  | Not included                                          |


## Full hostname check

This slower test uses isolated namespaces to verify every alert host uses its own configured hostname instead of a provider PTR name or another server's hostname:

```bash
sudo ansible/scripts/test-alert-hostname-runtime.sh
```

Run it after changing hostnames, alert-hostname code, or SPF logic. It is not required for an ordinary alert configuration check.


## Check a deployed server

Use the detailed email as the first record of a real failure. Then inspect the affected server:

```bash
sudo systemctl status <service> --no-pager
sudo journalctl -u <service> -n 100 --no-pager
sudo journalctl -u postfix -n 100 --no-pager
sudo postqueue -p
```

For PM2:

```bash
sudo systemctl status pm2-health-check.timer --no-pager
sudo journalctl -u pm2-health-check.service -n 100 --no-pager
sudo -u deploy bash -lc 'pm2 list'
```


## Safe email check

This sends one email through the normal local queue. It never sends SMS:

```bash
sudo /usr/local/bin/send-rate-limited-email.sh \
  monitoring-test \
  'Monitoring alert test' \
  "Test from $(hostname)"
```

Check local queue activity:

```bash
sudo postqueue -p
sudo journalctl -u postfix -n 100 --no-pager
```


## Status-page token check

This is read-only and does not create an issue:

```bash
export GITHUB_OCTOKIT_TOKEN='github_pat_REDACTED'
./ansible/scripts/test-systemd-status-incident.sh
```

See [public status incidents](SYSTEMD_STATUS_INCIDENTS.md) for an explicitly gated public test.


## Do not do this

Do not stop a production database or PM2 service just to test alert delivery. Use the local tests above. If PM2 must be intentionally stopped for maintenance, create `/run/forwardemail-pm2-maintenance` first.


## References

[1]: https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html#OnFailure= "systemd OnFailure"

[2]: https://pm2.keymetrics.io/docs/usage/quick-start/ "PM2 documentation"
