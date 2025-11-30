# PM2 Health Monitoring

Automated PM2 process health monitoring with alerting for Node.js deployments.


## Overview

The PM2 health monitoring system automatically checks the health of all PM2-managed processes and sends email alerts when issues are detected. It runs every 10 minutes via a systemd timer.


## Features

* **Process Status Monitoring** - Detects errored or stopped processes
* **Uptime Tracking** - Reports uptime for all processes via `pm2 jlist`
* **Process List Drift Detection** - Alerts if current processes differ from saved state
* **No Process Detection** - Alerts if PM2 has no running processes
* **Email Alerts** - Sends detailed alerts to configured recipients
* **Systemd Integration** - Runs as a systemd timer service
* **Comprehensive Logging** - All checks logged to journalctl


## How It Works

The monitoring script performs the following checks every 10 minutes:

1. **Verify PM2 Installation** - Ensures PM2 is available
2. **Get Process List** - Uses `pm2 jlist` to get JSON output of all processes
3. **Check Process Count** - Alerts if no processes are running
4. **Check Process Status** - Identifies errored or stopped processes
5. **Compare with Saved State** - Compares current list with `~/.pm2/dump.pm2`
6. **Send Alerts** - Emails detailed report if any issues detected


## Files Created

### Script

* `/usr/local/bin/pm2-health-check.sh` - Main health check script

### Systemd Units

* `/etc/systemd/system/pm2-health-check.service` - Oneshot service
* `/etc/systemd/system/pm2-health-check.timer` - Timer (runs every 10 minutes)


## Configuration

### Email Recipients

Set the `POSTFIX_RCPTS` environment variable to configure alert recipients:

```bash
export POSTFIX_RCPTS="devops@example.com,security@example.com"
```

Default: `security@forwardemail.net`

### Timer Interval

The timer runs every 10 minutes by default. To change this, edit `/etc/systemd/system/pm2-health-check.timer`:

```ini
[Timer]
OnBootSec=5min
OnUnitActiveSec=10min  # Change this value
AccuracySec=1min
```

Then reload systemd:

```bash
sudo systemctl daemon-reload
sudo systemctl restart pm2-health-check.timer
```


## Usage

### Manual Health Check

Run the health check manually:

```bash
sudo /usr/local/bin/pm2-health-check.sh
```

### View Logs

View recent health check logs:

```bash
sudo journalctl -u pm2-health-check.service -n 50
```

Follow logs in real-time:

```bash
sudo journalctl -u pm2-health-check.service -f
```

### Check Timer Status

View timer status and next run time:

```bash
sudo systemctl status pm2-health-check.timer
```

List all timers:

```bash
sudo systemctl list-timers
```

### Enable/Disable Monitoring

Disable monitoring:

```bash
sudo systemctl stop pm2-health-check.timer
sudo systemctl disable pm2-health-check.timer
```

Re-enable monitoring:

```bash
sudo systemctl enable pm2-health-check.timer
sudo systemctl start pm2-health-check.timer
```


## Alert Conditions

The monitoring system sends alerts when any of the following conditions are detected:

### No Processes Detected

```
⚠️  NO PM2 PROCESSES DETECTED
```

**Cause:** PM2 has no running processes\
**Action:** Check if PM2 processes crashed or were manually stopped

### Errored Processes

```
⚠️  ERRORED PROCESSES: api, worker
```

**Cause:** One or more processes are in "errored" state\
**Action:** Check process logs with `pm2 logs <process_name>`

### Stopped Processes

```
⚠️  STOPPED PROCESSES: scheduler
```

**Cause:** One or more processes are in "stopped" state\
**Action:** Restart with `pm2 restart <process_name>`

### Process List Drift

```
⚠️  PROCESS LIST DRIFT DETECTED
Saved:   api,worker,scheduler
Current: api,worker
```

**Cause:** Current process list differs from saved state\
**Action:** Verify if processes were intentionally removed, then run `pm2 save`


## Baseline Setup

To establish a baseline for drift detection, save the current PM2 state:

```bash
sudo -u deploy bash -c 'source /home/deploy/.bashrc && pm2 save'
```

This creates `/home/deploy/.pm2/dump.pm2` which the health check uses for comparison.


## Example Alert Email

```
Subject: [ALERT] PM2 Health Check Failed on web-server-01

PM2 Health Check Alert - web-server-01
Timestamp: 2024-11-30T15:30:00+00:00

⚠️  ERRORED PROCESSES: worker

⚠️  PROCESS LIST DRIFT DETECTED
Saved:   api,worker,scheduler
Current: api,worker

Full PM2 Status:
┌─────┬──────────┬─────────────┬─────────┬─────────┬──────────┐
│ id  │ name     │ mode        │ ↺       │ status  │ cpu      │
├─────┼──────────┼─────────────┼─────────┼─────────┼──────────┤
│ 0   │ api      │ cluster     │ 0       │ online  │ 0%       │
│ 1   │ worker   │ fork        │ 15      │ errored │ 0%       │
└─────┴──────────┴─────────────┴─────────┴─────────┴──────────┘
```


## Troubleshooting

### Health Check Not Running

Check if timer is active:

```bash
sudo systemctl status pm2-health-check.timer
```

Check for errors:

```bash
sudo journalctl -u pm2-health-check.timer -n 20
```

### No Alerts Received

Verify mail is configured:

```bash
echo "Test email" | mail -s "Test" your@email.com
```

Check script logs:

```bash
sudo journalctl -u pm2-health-check.service -n 50
```

### False Positive: Process List Drift

If you intentionally changed processes, update the saved state:

```bash
sudo -u deploy bash -c 'source /home/deploy/.bashrc && pm2 save'
```

### Permission Issues

Ensure the script can access PM2 as the deploy user:

```bash
sudo -u deploy bash -c 'source /home/deploy/.bashrc && pm2 list'
```


## Integration with Existing Monitoring

The PM2 health check integrates seamlessly with:

* **UFW Allowlist Monitoring** - Both use the same email alert system
* **PM2 Startup Service** - Monitors processes managed by `pm2-deploy.service`
* **System Logs** - All output goes to journalctl for centralized logging


## Best Practices

1. **Set Up Baseline** - Always run `pm2 save` after deploying new processes
2. **Monitor Logs** - Periodically review health check logs
3. **Test Alerts** - Manually trigger the script to verify email delivery
4. **Adjust Timing** - Increase/decrease check frequency based on your needs
5. **Multiple Recipients** - Configure multiple email addresses for redundancy


## Deployment

The PM2 health monitoring is automatically deployed when running the `node.yml` playbook:

```bash
ansible-playbook ansible/playbooks/node.yml -i hosts.yml
```

After deployment, the timer starts automatically and runs every 10 minutes.
