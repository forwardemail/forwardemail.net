# Self-Hosted Releases

This section documents the CI/CD workflow for ForwardEmail's self-hosted solution, explaining how Docker images are built, published, and deployed.


## Table of Contents

* [Overview](#overview)
* [CI/CD Workflow](#cicd-workflow)
  * [GitHub Actions Workflow](#github-actions-workflow)
  * [Docker Image Structure](#docker-image-structure)
* [Deployment Process](#deployment-process)
  * [Installation](#installation)
  * [Docker Compose Configuration](#docker-compose-configuration)
* [Maintenance Features](#maintenance-features)
  * [Automatic Updates](#automatic-updates)
  * [Backup and Restore](#backup-and-restore)
  * [Certificate Renewal](#certificate-renewal)
* [Versioning](#versioning)
* [Accessing Images](#accessing-images)
* [Contributing](#contributing)


## Overview

ForwardEmail's self-hosted solution uses GitHub Actions to automatically build and publish Docker images whenever a new release is created. These images are then available for users to deploy on their own servers using the provided setup script.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.
>
> Upgrading a server that was installed with an earlier version of the setup script? See [UPGRADING.md](./UPGRADING.md).


## CI/CD Workflow

### GitHub Actions Workflow

The self-hosted Docker image build and publish process is defined in `.github/workflows/docker-image-build-publish.yml`. This workflow:

1. **Triggers**: Automatically runs when a new GitHub Release is published
2. **Architectures**: Builds natively for `linux/amd64` (ubuntu-latest) and `linux/arm64` (ubuntu-24.04-arm), so ARM VPSes and Raspberry Pi are supported
3. **Build Process**:
   * Checks out the repository code
   * Sets up Docker Buildx and logs into GitHub Container Registry (GHCR)
   * Updates the schema for self-hosted deployment
   * Builds and pushes a per-architecture image (`<tag>-amd64`, `<tag>-arm64`) from `self-hosting/Dockerfile-selfhosted`, with a registry build cache
   * A merge job combines them into multi-arch manifests for the release version and `latest`

### Docker Image Structure

The Docker image is built using a multi-stage approach defined in `self-hosting/Dockerfile-selfhosted`:

1. **Builder Stage**:
   * Uses Node.js 20 as the base image
   * Sets `SELF_HOSTED=true` environment variable
   * Installs dependencies with pnpm
   * Builds the application in production mode

2. **Final Stage**:
   * Uses a slimmer Node.js 20 image
   * Installs only the necessary system dependencies
   * Creates required directories for data storage
   * Copies the built application from the builder stage

This approach ensures the final image is optimized for size and security.


## Deployment Process

### Installation

Users can deploy the self-hosted solution using the provided setup script:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

This script:

1. Runs preflight checks (architecture, RAM, disk, free ports, outbound port 25)
2. Fetches the few needed static files from the matching release (no full repository clone)
3. Configures the environment, host DNS resolvers, and firewall
4. Generates SSL certificates (automatic HTTP validation by default, or Cloudflare/DigitalOcean/Route53 DNS wildcard) with automated renewal
5. Generates all encryption keys and credentials
6. Pulls the release-pinned Docker images and starts the services using Docker Compose
7. Verifies containers come up healthy and prints the DNS records to create

After installation, open `https://yourdomain.com`. The site is protected by one-time basic-auth credentials (printed during setup and saved to `self-hosting/CREDENTIALS.txt`) and walks you through a `/setup` wizard: create the admin account (the first account becomes admin), add your domain, and verify DNS with a live checklist. The basic-auth gate disables itself once the admin account exists (set `AUTH_BASIC_ALWAYS=true` to keep it).

Non-interactive installs are supported via flags, e.g. `--action initial-setup --domain example.com --cert-method http --yes`.

### Docker Compose Configuration

The `docker-compose-self-hosted.yml` file defines all the services required for the self-hosted solution:

* **nginx (sni-router)**: Routes TLS connections on port 443 to web/API/CalDAV/CardDAV by SNI
* **Web**: Main web interface
* **API**: API server for programmatic access
* **Bree**: Background job scheduler
* **SMTP + smtp_bree**: Email sending service and its outbound queue worker
* **IMAP/POP3**: Email retrieval services
* **MX**: Mail exchange service
* **CalDAV**: Calendar service
* **CardDAV**: Contacts service
* **MongoDB**: Database for storing user data
* **Redis**: In-memory data store
* **SQLite + sqlite_bree**: Encrypted mailbox storage and its maintenance worker

Each Forward Email service uses the same Docker image but with different entry points, allowing for a modular architecture while simplifying maintenance.

Images are pinned to a release via `IMAGE_TAG` in `.env` (falling back to `latest`). The `storage` compose profile (`COMPOSE_PROFILES=storage`, the default written by setup) enables the mailbox-storage services (IMAP, POP3, SQLite, CalDAV, CardDAV); leaving it empty runs a lighter forwarding-only stack.


## Maintenance Features

The self-hosted solution includes several maintenance features:

### Automatic Updates

Users can enable automatic updates (setup menu option 3) that install a nightly cron running `self-hosting/scripts/update.sh`, which:

* Resolves the latest release tag and pulls its Docker image
* Updates `IMAGE_TAG` in `.env` and restarts services
* Waits for containers to become healthy
* **Rolls back to the previous release automatically** if the new one is unhealthy
* Logs to `/var/log/autoupdate.log`

To pin or roll back manually, edit `IMAGE_TAG` in `.env` and run `docker compose -f docker-compose-self-hosted.yml up -d`.

### Backup and Restore

The setup provides options for:

* Configuring regular backups to any S3-compatible storage (bucket configurable via `BACKUP_BUCKET` in `.env`)
* Nightly backups of MongoDB, Redis, and the encrypted SQLite mailboxes (`scripts/backup-mongo.sh`, `backup-redis.sh`, `backup-sqlite.sh`)
* Restoring from backups (setup menu option 5): place your saved `.env` at `/root/.env` and the restore pulls the latest Mongo/Redis/SQLite backups from your bucket

> \[!IMPORTANT]
> Keep a copy of your `.env` somewhere safe. It contains the encryption keys without which backups cannot be restored.

### Certificate Renewal

SSL certificates are automatically managed:

* HTTP validation (default) and Cloudflare/DigitalOcean/Route53 DNS wildcard methods renew unattended via certbot's timer, with a deploy hook (`scripts/deploy-certs.sh`) that copies renewed certs and restarts services
* Manually-issued wildcard certificates cannot auto-renew; a weekly expiry-warning cron is installed and renewal is available via setup menu option 4
* A per-domain DKIM key is generated during setup for email authentication


## Versioning

Each GitHub Release creates a new Docker image tagged with:

1. The specific release version (e.g., `v1.0.0`)
2. The `latest` tag for the most recent release

Users can choose to use a specific version for stability or the `latest` tag to always get the newest features.


## Accessing Images

The Docker images are publicly available at:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (example version tag)

No authentication is required to pull these images.


## Contributing

To contribute to the self-hosted solution:

1. Make changes to the relevant files in the `self-hosting` directory
2. Test locally or on an ubuntu based VPS using the provided `setup.sh` script
3. Submit a pull request
4. Once merged and a new release is created, the CI workflow will automatically build and publish the updated Docker image
