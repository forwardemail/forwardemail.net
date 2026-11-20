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
  * [Lite Install (One Small Box)](#lite-install-one-small-box)
  * [Delivery to Domains Hosted on the Same Server](#delivery-to-domains-hosted-on-the-same-server)
  * [Ending Sessions When Google or GitHub Access Is Revoked](#ending-sessions-when-google-or-github-access-is-revoked)
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


## CI/CD Workflow

### GitHub Actions Workflow

The self-hosted Docker image build and publish process is defined in `.github/workflows/docker-image-build-publish.yml`. This workflow:

1. **Triggers**: Automatically runs when a new GitHub Release is published
2. **Build Process**: one job per architecture, each on a native runner (`ubuntu-latest` for `amd64`, `ubuntu-24.04-arm` for `arm64`):
   * Checks out the repository code
   * Logs into GitHub Container Registry (GHCR)
   * Updates the schema for self-hosted deployment
   * Builds the image from `self-hosting/Dockerfile-selfhosted` and pushes it as `<version>-<arch>`
3. **Merge**: once both builds succeed, a `merge` job publishes a multi-architecture manifest tagged with the release version and `latest`, so `docker pull` picks the right image for the host

The workflow can also be run by hand (**Actions** → **Build and Publish Self-Hosted Docker Image** → **Run workflow**). A manual run tags the images with the branch's name (e.g. `master`, with any `/` replaced by `-`) and never moves `latest`, which is useful for testing an image before a release.

```yaml
# Key workflow steps
jobs:
  build-and-publish:
    strategy:
      matrix:
        include:
          - { os: ubuntu-latest, arch: amd64 }
          - { os: ubuntu-24.04-arm, arch: arm64 }
    runs-on: ${{ matrix.os }}
    steps:
      # ...
      - run: docker buildx build --platform linux/${ARCH} -t ${IMAGE}:${GITHUB_REF_NAME}-${ARCH} --provenance=false --push .
  merge:
    needs: build-and-publish
    steps:
      - run: docker buildx imagetools create -t ${IMAGE}:${GITHUB_REF_NAME} -t ${IMAGE}:latest ${IMAGE}:${GITHUB_REF_NAME}-amd64 ${IMAGE}:${GITHUB_REF_NAME}-arm64
```

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
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

This script:

1. Clones the repository
2. Sets up the environment
3. Configures DNS and firewall settings
4. Generates SSL certificates
5. Pulls the latest Docker images
6. Starts the services using Docker Compose

### Docker Compose Configuration

The `docker-compose-self-hosted.yml` file defines all the services required for the self-hosted solution:

* **nginx** (`sni-router`): SNI-based TLS router that terminates port 443 and proxies to the web, API, CalDAV, and CardDAV apps (uses the `nginx:stable` image)
* **web**: Main web interface (`node web.js`)
* **api**: API server for programmatic access (`node api.js`)
* **bree**: Scheduled job runner for the web/API tier (`node bree.js`)
* **smtp**: Outbound email (submission) service (`node smtp.js`)
* **smtp\_bree**: Scheduled job runner for the outbound queue (`node smtp-bree.js`)
* **mx**: Mail exchange service for inbound mail (`node mx.js`)
* **imap** / **pop3**: Email retrieval services (`node imap.js` / `node pop3.js`)
* **caldav**: Calendar service (`node caldav.js`)
* **carddav**: Contacts service (`node carddav.js`)
* **sqlite**: Encrypted SQLite mailbox server (`node sqlite.js`)
* **sqlite\_worker**: Runs the mailbox backups, `VACUUM`s, and alias-password rotations (rekeys) queued by the `sqlite` server. Exactly one instance may run, and it must share the same mailbox bind mount as `sqlite` (`node sqlite-worker.js`)
* **sqlite\_bree**: Scheduled job runner for the SQLite tier (`node sqlite-bree.js`)
* **mongodb**: Database for storing user data (uses the `mongo:latest` image)
* **redis**: In-memory data store (uses the `redis:latest` image)

Every Forward Email service shares the same application Docker image and only differs by its entry point (the `command`), which keeps the architecture modular while simplifying maintenance; the `nginx`, `mongodb`, and `redis` services use their respective official upstream images.

### Lite Install (One Small Box)

> \[!WARNING]
> The lite install and its CLI are experimental and not yet released: no published image includes them, and certificate renewal and backups are not built yet. Use the [installation](#installation) above for a real server.

For a single small machine (a Mac mini, a Raspberry Pi 5, a small VPS) with a domain or two and a few mailboxes, [`lite/`](lite/) is a smaller layout and [`cli/`](cli/) is a step-by-step installer for it:

* [`lite/docker-compose.yml`](lite/docker-compose.yml) has three containers: `app`, `mongodb` and `redis`. Inside `app`, [`lite/supervisor.js`](lite/supervisor.js) starts `sqlite` first, then the other processes, restarts any that exit and stops them in order. The default set is `sqlite`, `sqlite-worker`, `sqlite-bree`, `mx`, `imap`, `smtp`, `smtp-bree`, `bree` and `web`; set `LITE_SERVICES` (comma-separated) to change it, e.g. to add `pop3`, `api`, `caldav` or `carddav`.
* One hostname (`MAIL_HOST`, e.g. `mail.example.com`) serves MX, IMAP, SMTP and the web interface, so one certificate covers everything and no SNI router is needed.
* [`lite/env.example`](lite/env.example) holds the settings on top of the image's `.env.defaults`, including limits for a small box: one spam scanner thread, no ClamAV, and lower job concurrency and memory thresholds for Bree (`BREE_MAX_CONCURRENT_JOBS`, `BREE_PAUSE_BELOW_MB`, `BREE_STOP_BELOW_MB`, `BREE_WORKER_MAX_OLD_SPACE_MB`).
* [`../scripts/selfhost-provision.js`](../scripts/selfhost-provision.js) creates a user, a domain and a mailbox, and prints the DNS records to publish. Run it inside `app`: `docker compose exec app node scripts/selfhost-provision.js --email you@example.com --domain example.com`.

It needs about 2.5 GB of memory once running (4 GB for Docker is comfortable), arm64 or x86-64, and Docker with Compose v2. A Raspberry Pi 4 can't run it, because MongoDB 5+ needs a newer CPU than the Pi 4 has. As with the full install, IMAP and SMTP logins check the domain's `forward-email-site-verification` TXT record in public DNS, so a real domain is needed even on a LAN. See [`cli/README.md`](cli/README.md) for the installer.

### Delivery to Domains Hosted on the Same Server

Outbound mail is not delivered to an MX server at an address of the server itself. When one server hosts several domains and their MX records point at its public address, mail from one of these domains to another is refused.

To allow it, set:

```env
SMTP_ALLOW_LOCAL_MX=true
```

The default is `false`, and the setting only applies when `SELF_HOSTED=true`. Mail is still never delivered to loopback, private, link-local or carrier-grade NAT addresses.

### Ending Sessions When Google or GitHub Access Is Revoked

On a self-hosted install, sessions signed in with Google or GitHub are not checked with the provider by default: revoking this application's access there does not sign them out, and they stay signed in until they expire.

To end them once access is revoked, set:

```env
AUTH_OAUTH_REVOCATION_CHECK=true
```

The provider is then asked in the background, about every 5 minutes (every minute while it does not answer). An outage at the provider signs nobody out, nor does a token that the provider has never accepted.


## Maintenance Features

The self-hosted solution includes several maintenance features:

### Automatic Updates

Users can enable automatic updates that will:

* Pull the latest Docker image nightly
* Restart services with the updated image
* Log the update process

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Backup and Restore

The setup provides options for:

* Configuring regular backups to S3-compatible storage
* Backing up MongoDB, Redis, and SQLite data
* Restoring from backups in case of failure

### Certificate Renewal

SSL certificates are automatically managed with options to:

* Generate new certificates during setup
* Renew certificates when needed
* Configure DKIM for email authentication


## Versioning

Each GitHub Release creates a new Docker image tagged with:

1. The specific release version (e.g., `v1.0.0`)
2. The `latest` tag for the most recent release

Both are multi-architecture (`linux/amd64` and `linux/arm64`). The per-architecture images (`v1.0.0-amd64`, `v1.0.0-arm64`) are also published.

Users can choose to use a specific version for stability or the `latest` tag to always get the newest features.


## Accessing Images

The Docker images are publicly available at:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (example version tag)

No authentication is required to pull these images.


## Contributing

To contribute to the self-hosted solution:

1. Make changes to the relevant files in the `self-hosting` directory
2. Test locally or on an ubuntu based VPS using the provided `setup.sh` script, or with a locally built image (see below)
3. Submit a pull request
4. Once merged and a new release is created, the CI workflow will automatically build and publish the updated Docker image

### Building the Image Locally

```sh
docker build -f self-hosting/Dockerfile-selfhosted -t ghcr.io/forwardemail/forwardemail.net-selfhosted:dev .
```

`.dockerignore` excludes `.env` and `.env.*` (except `.env.defaults` and `.env.schema`), so a local `.env` holding secrets is never copied into the image. To try the lite install against this image, run the CLI with `--version dev` (see [`cli/README.md`](cli/README.md#testing-a-local-build)).
