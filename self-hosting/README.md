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


## CI/CD Workflow

### GitHub Actions Workflow

The self-hosted Docker image build and publish process is defined in `.github/workflows/docker-image-build-publish.yml`. This workflow:

1. **Triggers**: Automatically runs when a new GitHub Release is published
2. **Environment**: Runs on Ubuntu with Node.js 18.20.4
3. **Build Process**:
   * Checks out the repository code
   * Sets up Docker Buildx for multi-platform builds
   * Logs into GitHub Container Registry (GHCR)
   * Updates the schema for self-hosted deployment
   * Builds the Docker image using `self-hosting/Dockerfile-selfhosted`
   * Tags the image with both the release version and `latest`
   * Pushes the images to GitHub Container Registry

```yaml
# Key workflow steps
name: Build and Publish Self-Hosted Docker Image

on:
  release:
    types: [published]  # Trigger on new releases

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      # Setup steps...

      # Build and publish Docker image
      - name: Build / Publish Docker image to GitHub Container Registry
        run: |
          IMAGE_NAME=ghcr.io/${{ github.repository }}-selfhosted:${{ github.ref_name }}
          docker build -f self-hosting/Dockerfile-selfhosted -t $IMAGE_NAME .
          docker tag $IMAGE_NAME ghcr.io/${{ github.repository }}-selfhosted:latest
          docker push $IMAGE_NAME
          docker push ghcr.io/${{ github.repository }}-selfhosted:latest
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

* **Web**: Main web interface
* **API**: API server for programmatic access
* **SMTP**: Email sending service
* **IMAP/POP3**: Email retrieval services
* **MX**: Mail exchange service
* **CalDAV**: Calendar service
* **CardDAV**: Contacts service
* **MongoDB**: Database for storing user data
* **Redis**: In-memory data store
* **SQLite**: Database for storing emails

Each service uses the same Docker image but with different entry points, allowing for a modular architecture while simplifying maintenance.


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
