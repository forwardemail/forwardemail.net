# Upgrading an Existing Self-Hosted Install

This document is for servers that were set up with an earlier version of `setup.sh`. New installs get all of this automatically and can skip it.

The nightly auto-update cron only pulls new Docker images. It never updates the compose file, the scripts, or your firewall. The changes below therefore need one manual step: re-run the setup script.

## TL;DR

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Choose option 1 (Initial Setup). Re-running is safe on an existing install:

* Your `.env` is kept as is. Existing secrets, keys, and passwords are never rotated.
* Your TLS certificates and DKIM key are kept.
* Mailbox, MongoDB, and Redis data are untouched (see the sqlite note below).

Afterwards, re-run option 2 (Backups) and option 3 (Auto Upgrades) once so the crons point at the new scripts.

## What changes on upgrade

### SQLite mailbox data is merged into one directory

Older compose files mounted `/mnt/sqlite_storage` (a bare host path) into the `mx` and `sqlite_bree` containers while `imap`, `pop3`, and `sqlite` used `self-hosting/sqlite-data`. Mailbox data could end up split across the two directories.

The new compose file uses `self-hosting/sqlite-data` everywhere. During setup, `migrate_sqlite_data()` merges anything found in `/mnt/sqlite_storage` into `self-hosting/sqlite-data` (newer file wins on collision) and renames the old directory to `/mnt/sqlite_storage.migrated-<date>`. You can delete that directory once you have confirmed mail is intact.

Note: the `sqlite_bree` maintenance jobs previously operated on the wrong (mostly empty) directory. After this migration they will see your real mailbox data for the first time, so expect some one-time cleanup activity in its logs.

### Images are pinned to a release tag

The compose file now uses `ghcr.io/forwardemail/forwardemail.net-selfhosted:${IMAGE_TAG:-latest}` and setup writes the current release tag to `IMAGE_TAG` in `.env`.

The auto-update cron (option 3) now runs `scripts/update.sh`, which updates to the latest release, waits for containers to become healthy, and rolls `IMAGE_TAG` back automatically if they do not. To pin or roll back by hand, edit `IMAGE_TAG` in `.env` and run:

```bash
docker compose -f docker-compose-self-hosted.yml up -d
```

### Firewall ports are reduced

Only 22, 25, 80, 443, 465, 993, and 995 need to be open. Earlier versions of the script also opened 587, 2993, 2995, 3456 (sqlite websocket), 4000 (api), and 5000 (caldav). These are internal or unused and should be closed. Re-running setup closes them, or do it manually:

```bash
for port in 587 2993 2995 3456 4000 5000; do ufw delete allow "$port/tcp"; done
```

### Basic auth now turns itself off

The HTTP basic-auth gate only protects the site until the first admin account exists, then it stops being enforced. No `.env` edit or restart is needed. If you want it enforced permanently, set `AUTH_BASIC_ALWAYS=true` in `.env`.

Since your install already has an admin account, basic auth stops applying as soon as you update to an image that includes this change.

### Backups

* The backup bucket is configurable via `BACKUP_BUCKET` in `.env` (default `forwardemail-selfhosted`, unchanged).
* There is a new `scripts/backup-sqlite.sh` that archives the encrypted mailboxes nightly. Re-run option 2 to install its cron.
* Redis backups are written to `redis-backups/` instead of the live `redis-data/` directory.
* Restore (option 5) now restores mailboxes from your own bucket. Earlier versions pointed at a bucket that self-hosted installs have no access to, so restore did not work.

### Certificates

* If you use `/root/.cloudflare.ini`, nothing changes. Renewal now also installs a deploy hook that copies renewed certs and restarts services.
* If you issued a wildcard cert through the manual DNS challenge, be aware it does not renew on its own. Re-running setup installs a weekly expiry check that logs to `/var/log/cert-expiry.log`. Consider switching to the HTTP method or a DNS provider plugin so renewal is unattended: run setup option 4, or option 1 with `--cert-method http`.

### New secrets

`SMTP_TRANSPORT_PASS` (previously a hardcoded default) and `API_SECRETS` (previously missing) are generated on the next setup run, but only when they are absent or still set to the shipped default. Values you have already customized are kept.

### Compose profiles

`.env` gains `COMPOSE_PROFILES=storage`, which is the full stack you already run. Setting it empty gives a forwarding-only deployment without IMAP/POP3/CalDAV/CardDAV/SQLite. Existing installs should keep `storage`.

## Verifying after upgrade

```bash
# everything running and healthy
docker compose -f docker-compose-self-hosted.yml ps

# mailboxes in one place
ls self-hosting/sqlite-data

# firewall
ufw status

# pinned release
grep IMAGE_TAG self-hosting/.env
```

Then send yourself a test email and log in over IMAP.
