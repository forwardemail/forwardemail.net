# PM2 monitoring

[PM2][1] is checked every 10 minutes by a [systemd timer][2]. A PM2 problem sends a detailed email and a short SMS on the server running PM2.


## What triggers an alert

| Problem                                          | Alert         |
| ------------------------------------------------ | ------------- |
| `pm2-deploy.service` fails to start or crashes   | Email and SMS |
| PM2 is missing                                   | Email and SMS |
| PM2 has no managed processes                     | Email and SMS |
| A process is stopped or errored                  | Email and SMS |
| The running process list differs from `pm2 save` | Email and SMS |

The email includes the service result, current status, PM2 findings, and logs from the failing run. The SMS is short and does not include process output or logs. A sustained PM2 problem also opens an incident on the public status page for the affected service. It closes automatically after PM2 has recovered.


## Check PM2

```bash
sudo systemctl status pm2-health-check.timer --no-pager
sudo journalctl -u pm2-health-check.service -n 100 --no-pager
sudo -u deploy bash -lc 'pm2 list'
```

If the process list changed on purpose, save the new list:

```bash
sudo -u deploy bash -lc 'pm2 save'
```


## Planned maintenance

A normal `systemctl stop pm2-deploy.service` does not count as a systemd failure. The health check will still notice stopped processes unless you mark planned maintenance first.

```bash
sudo touch /run/forwardemail-pm2-maintenance
sudo systemctl stop pm2-deploy.service
```

Bring PM2 back and remove the marker when finished:

```bash
sudo systemctl start pm2-deploy.service
sudo rm -f /run/forwardemail-pm2-maintenance
sudo systemctl start pm2-health-check.service
```

The marker lasts only until reboot and skips only the scheduled PM2 health check. It does not hide a real PM2 startup failure.


## Safe test

Run the repository test instead of stopping a production PM2 service:

```bash
ansible/scripts/test-pm2-systemd-notification-runtime.sh
```

The test uses local mocks and sends no real email or SMS.


## Deployment

PM2 monitoring is deployed by `node.yml`:

```bash
ansible-playbook -i hosts.yml ansible/playbooks/node.yml
```


## References

[1]: https://pm2.keymetrics.io/docs/usage/startup/ "PM2 startup"

[2]: https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html "systemd timers"
