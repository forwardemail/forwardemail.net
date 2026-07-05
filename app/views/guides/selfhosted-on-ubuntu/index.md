# Forward Email Self-Hosting Installation Guide for Ubuntu


## Table of Contents

* [Overview](#overview)
* [Prerequisites](#prerequisites)
* [System Requirements](#system-requirements)
* [Quick Start (Recommended)](#quick-start-recommended)
  * [Run the Setup Script](#run-the-setup-script)
  * [What the Setup Script Does](#what-the-setup-script-does)
  * [Non-Interactive Installation](#non-interactive-installation)
  * [Compose Profiles: Full vs Forwarding-Only](#compose-profiles-full-vs-forwarding-only)
* [Manual Installation (Advanced)](#manual-installation-advanced)
  * [Step 1: Initial System Setup](#step-1-initial-system-setup)
  * [Step 2: Configure DNS Resolvers](#step-2-configure-dns-resolvers)
  * [Step 3: Install System Dependencies](#step-3-install-system-dependencies)
  * [Step 4: Install Snap Packages](#step-4-install-snap-packages)
  * [Step 5: Install Docker](#step-5-install-docker)
  * [Step 6: Configure Docker Service](#step-6-configure-docker-service)
  * [Step 7: Configure Firewall](#step-7-configure-firewall)
  * [Step 8: Clone Forward Email Repository](#step-8-clone-forward-email-repository)
  * [Step 9: Set Up Environment Configuration](#step-9-set-up-environment-configuration)
  * [Step 10: Configure Your Domain](#step-10-configure-your-domain)
  * [Step 11: Generate SSL Certificates](#step-11-generate-ssl-certificates)
  * [Step 12: Generate Encryption Keys](#step-12-generate-encryption-keys)
  * [Step 13: Update SSL Paths in Configuration](#step-13-update-ssl-paths-in-configuration)
  * [Step 14: Set Up Basic Authentication](#step-14-set-up-basic-authentication)
  * [Step 15: Deploy with Docker Compose](#step-15-deploy-with-docker-compose)
  * [Step 16: Verify Installation](#step-16-verify-installation)
* [Post-Installation Configuration](#post-installation-configuration)
  * [DNS Records Setup](#dns-records-setup)
  * [First Login](#first-login)
* [Backup Configuration](#backup-configuration)
* [Restore from Backup](#restore-from-backup)
* [Auto-Update Configuration](#auto-update-configuration)
* [Certificate Management](#certificate-management)
  * [Certificate Methods](#certificate-methods)
  * [Certificate Renewal](#certificate-renewal)
* [Maintenance and Monitoring](#maintenance-and-monitoring)
  * [Log Locations](#log-locations)
  * [Regular Maintenance Tasks](#regular-maintenance-tasks)
* [Troubleshooting](#troubleshooting)
  * [Common Issues](#common-issues)
  * [Getting Help](#getting-help)
* [Security Best Practices](#security-best-practices)
* [Conclusion](#conclusion)


## Overview

This guide provides step-by-step instructions for installing Forward Email's self-hosted solution on Ubuntu systems. This guide is specifically tailored for Ubuntu 20.04, 22.04, and 24.04 LTS versions.

The recommended installation method is the automated setup script, which handles everything from preflight checks to DNS record generation. A full manual walkthrough is included as an [advanced appendix](#manual-installation-advanced) for users who want to understand or customize each step.


## Prerequisites

Before beginning the installation, ensure you have:

* **Ubuntu Server**: 20.04, 22.04, or 24.04 LTS
* **Root Access**: You must be able to run commands as root (sudo access)
* **Domain Name**: A domain that you control with DNS management access
* **Clean Server**: Recommended to use a fresh Ubuntu installation
* **Internet Connection**: Required for downloading packages and Docker images


## System Requirements

* **RAM**: 2GB minimum, 4GB+ recommended (the full stack runs roughly 15 containers)
* **Storage**: Minimum 20GB available space (50GB+ recommended for production)
* **CPU**: 1 vCPU minimum (2+ vCPUs recommended for production)
* **Architecture**: x86\_64 (amd64) or arm64. Docker images are published for both, so ARM-based VPSes and Raspberry Pi (models with 4GB+ RAM) work
* **Network**: Public IP address with the following ports accessible:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)

> **Important**: Many cloud providers (AWS, GCP, Azure, DigitalOcean, Hetzner Cloud) block **outbound** port 25 by default, which prevents your server from delivering email. The setup script checks for this during preflight. If it is blocked, request an unblock from your provider before continuing. See [Troubleshooting](#troubleshooting).


## Quick Start (Recommended)

### Run the Setup Script

As root, run:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Then choose option **1. Initial Setup** from the menu:

```
1. Initial Setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew Certificates
5. Restore from Backup
6. Help
7. Exit
```

### What the Setup Script Does

The script performs the entire installation in order, logging everything to `/var/log/forwardemail-setup-<timestamp>.log`:

1. **Preflight checks**: verifies CPU architecture, RAM (warns below 4GB, strongly below 2GB), free disk space, that required ports (25, 80, 443, 465, 993, 995) are free, that **outbound port 25** is not blocked by your provider, and detects your public IPv4/IPv6 addresses. You are warned about any problems **before** anything on the host is changed.
2. **DNS resolvers (asks for confirmation)**: replaces `/etc/resolv.conf` with Cloudflare/Google resolvers for reliable certificate issuance (a backup is saved to `/etc/resolv.conf.bak-forwardemail`; set `SKIP_DNS_RESOLVER_CHANGE=true` to skip).
3. **Dependency installation**: installs Docker CE with the Compose v2 plugin, plus Certbot and the AWS CLI via snap.
4. **Firewall (asks for confirmation)**: enables UFW with default-deny incoming and opens **only** ports 22, 25, 80, 443, 465, 993, and 995. Internal services are fronted by the nginx SNI router on port 443 and are not exposed.
5. **Fetch release files**: downloads only the `self-hosting/` static files and `.env.defaults` from the latest release tarball into `/root/forwardemail.net` (the application itself runs from prebuilt Docker images). An existing `.env` is never overwritten, so re-running the script is safe.
6. **Environment setup**: prompts for your domain and writes all required configuration to `self-hosting/.env`, pins the Docker images to the latest release tag (`IMAGE_TAG`), and asks whether you want the full stack or a forwarding-only stack (see [Compose Profiles](#compose-profiles-full-vs-forwarding-only)).
7. **Basic authentication**: generates temporary HTTP Basic Auth credentials for first login, prints them, and saves them to `self-hosting/CREDENTIALS.txt` (mode 0600).
8. **Certificate method choice**: asks how SSL certificates should be issued. The options are HTTP (recommended), Cloudflare DNS, DigitalOcean DNS, AWS Route53 DNS, or manual DNS. See [Certificate Management](#certificate-management).
9. **Key generation**: generates encryption keys (DKIM signing key, SRS secret, API secrets, webhook signature key, etc.). Re-runs never rotate existing keys.
10. **Deployment**: runs `docker compose up -d` and waits up to 2 minutes for all containers to report healthy.
11. **DNS record summary**: prints the complete list of DNS records you must create (MX, A, AAAA if IPv6 was detected, SPF, DKIM with your derived public key, DMARC, and PTR), using your detected server IPs.

### Non-Interactive Installation

All prompts can be answered ahead of time with flags, which makes unattended installs possible:

| Flag                    | Description                                                               |
| ----------------------- | ------------------------------------------------------------------------- |
| `-d, --domain <domain>` | Domain to set up (skips the interactive prompt)                           |
| `--email <email>`       | Email for Let's Encrypt registration                                      |
| `--cert-method <m>`     | `http`, `cloudflare`, `digitalocean`, `route53`, or `manual`              |
| `--cloudflare-ini <p>`  | Path to a Cloudflare credentials ini (implies `--cert-method cloudflare`) |
| `--bucket <name>`       | S3 bucket for backups                                                     |
| `--action <action>`     | `initial-setup`, `backups`, `auto-update`, `renew`, or `restore`          |
| `-y, --yes`             | Non-interactive: auto-confirm all prompts                                 |
| `--wait-dns`            | After setup, poll until the MX record resolves                            |
| `--dev`                 | Clone the full git repository instead of fetching only release files      |

Example fully non-interactive install:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh) \
  --action initial-setup \
  --domain example.com \
  --email you@example.com \
  --cert-method http \
  --yes
```

Note that `--action initial-setup` combined with `--yes` requires `--domain`. With `--yes`, the certificate method defaults to `http` and the full stack is selected.

### Compose Profiles: Full vs Forwarding-Only

The stack supports two deployment shapes, controlled by `COMPOSE_PROFILES` in `self-hosting/.env`:

* **Full stack** (`COMPOSE_PROFILES=storage`): email forwarding plus mailbox storage (IMAP/POP3), calendars (CalDAV), and contacts (CardDAV).
* **Forwarding-only** (`COMPOSE_PROFILES=` set to empty): a lighter stack that just forwards and sends email with no stored mailboxes. Only these services run: `nginx`, `web`, `api`, `bree`, `mx`, `smtp`, `smtp_bree`, `mongodb`, and `redis`.

The setup script asks which one you want during initial setup. To change it later, edit `COMPOSE_PROFILES` in `self-hosting/.env` and run:

```bash
docker compose -f /root/forwardemail.net/self-hosting/docker-compose-self-hosted.yml up -d
```


## Manual Installation (Advanced)

The setup script performs all of the steps below for you. Follow this appendix only if you want to understand exactly what happens on your host or need to customize a step.

### Step 1: Initial System Setup

First, ensure your system is up to date and switch to root user:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Step 2: Configure DNS Resolvers

Configure your system to use Cloudflare's DNS servers for reliable certificate generation:

```bash
# Back up the current resolver configuration
cp -L /etc/resolv.conf /etc/resolv.conf.bak-forwardemail 2>/dev/null || true

# Stop and disable systemd-resolved if running
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Configure Cloudflare DNS resolvers
tee /etc/resolv.conf > /dev/null <<EOF
nameserver 1.1.1.1
nameserver 2606:4700:4700::1111
nameserver 1.0.0.1
nameserver 2606:4700:4700::1001
nameserver 8.8.8.8
nameserver 2001:4860:4860::8888
nameserver 8.8.4.4
nameserver 2001:4860:4860::8844
EOF
```

### Step 3: Install System Dependencies

Install the required packages for Forward Email:

```bash
# Update package list
apt-get update -y

# Install basic dependencies
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    snapd
```

### Step 4: Install Snap Packages

Install AWS CLI and Certbot via snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Step 5: Install Docker

Install Docker CE with the Compose v2 plugin:

```bash
# Add Docker's official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Update package index and install Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify Docker installation
docker --version
docker compose version
```

### Step 6: Configure Docker Service

Ensure Docker starts automatically and is running:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

If Docker fails to start, try starting it manually:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 7: Configure Firewall

Set up UFW firewall to secure your server. Only the ports below need to be reachable from the outside. The nginx SNI router fronts the web, API, CalDAV, and CardDAV services on port 443, and internal services (sqlite websocket on 3456, api on 4000, caldav on 5000, carddav on 6000) talk over loopback and must **not** be exposed:

```bash
# Set default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (important - don't lock yourself out!)
ufw allow 22/tcp

# Allow email-related ports
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (for Let's Encrypt)
ufw allow 443/tcp   # HTTPS (also fronts web/api/caldav/carddav via SNI router)
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S

# Allow local database connections
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Enable firewall
echo "y" | ufw enable

# Check firewall status
ufw status numbered
```

> **Note**: Older versions of this guide opened ports 587, 2993, 2995, 3456, 4000, and 5000. These are unnecessary and should stay closed. Remove them with `ufw delete allow <port>/tcp` if you opened them previously.

### Step 8: Clone Forward Email Repository

Download the Forward Email source code:

```bash
# Set up variables
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Clone the repository
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Verify the clone was successful
ls -la
```

### Step 9: Set Up Environment Configuration

Prepare the environment configuration:

```bash
# Set up directory variables
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Copy default environment file
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Create SSL directory
mkdir -p "$SELF_HOST_DIR/ssl"

# Create database directories
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Step 10: Configure Your Domain

Set your domain name and update environment variables:

```bash
# Replace 'yourdomain.com' with your actual domain
DOMAIN="yourdomain.com"

# Function to update environment file
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Update domain-related environment variables
update_env_file "DOMAIN" "$DOMAIN"
update_env_file "NODE_ENV" "production"
update_env_file "HTTP_PROTOCOL" "https"
update_env_file "WEB_URL" "https://$DOMAIN"
update_env_file "WEB_HOST" "$DOMAIN"
update_env_file "SQLITE_HOST" "sqlite.$DOMAIN"
update_env_file "CALDAV_HOST" "caldav.$DOMAIN"
update_env_file "CARDDAV_HOST" "carddav.$DOMAIN"
update_env_file "API_HOST" "api.$DOMAIN"
update_env_file "APP_NAME" "$DOMAIN"
update_env_file "TRANSPORT_DEBUG" "true"
update_env_file "SEND_EMAIL" "true"
update_env_file "PREVIEW_EMAIL" "false"
update_env_file "MONGO_HOST" "127.0.0.1"
update_env_file "LOGS_HOST" "127.0.0.1"
update_env_file "REDIS_HOST" "127.0.0.1"
update_env_file "TURNSTILE_ENABLED" "false"
update_env_file "MX_PORT" "25"
update_env_file "SMTP_HOST" "smtp.$DOMAIN"
update_env_file "SMTP_PORT" "465"
update_env_file "IMAP_HOST" "imap.$DOMAIN"
update_env_file "IMAP_PORT" "993"
update_env_file "POP3_HOST" "pop3.$DOMAIN"
update_env_file "POP3_PORT" "995"
update_env_file "MX_HOST" "mx.$DOMAIN"
update_env_file "SMTP_EXCHANGE_DOMAINS" "mx.$DOMAIN"
update_env_file "SELF_HOSTED" "true"
update_env_file "ENABLE_MONITOR_SERVER" "false"
update_env_file "WEBSITE_URL" "$DOMAIN"
update_env_file "CACHE_RESPONSES" "true"
update_env_file "AUTH_BASIC_ENABLED" "true"

# REQUIRED: the docker compose file mounts ./sqlite-data at
# /mnt/${SQLITE_STORAGE_PATH} (the volume mounts break without this)
update_env_file "SQLITE_STORAGE_PATH" "sqlite_storage"

# Full stack (IMAP/POP3/CalDAV/CardDAV); set to "" for forwarding-only
update_env_file "COMPOSE_PROFILES" "storage"
```

### Step 11: Generate SSL Certificates

#### Option A: HTTP Challenge (Recommended)

This issues a single SAN certificate covering every subdomain the stack needs and renews fully automatically via certbot's systemd timer. Your A records (`@`, `mx`, `smtp`, `imap`, `pop3`, `api`, `caldav`, `carddav`) must already point at this server, and ports 80/443 must be reachable:

```bash
# Make the deploy hook executable (it copies renewed certs into
# self-hosting/ssl/ and restarts the affected services)
chmod +x "$SELF_HOST_DIR/scripts/deploy-certs.sh"

certbot certonly --standalone --preferred-challenges http \
  -d "$DOMAIN" -d "mx.$DOMAIN" -d "smtp.$DOMAIN" -d "imap.$DOMAIN" \
  -d "pop3.$DOMAIN" -d "api.$DOMAIN" -d "caldav.$DOMAIN" -d "carddav.$DOMAIN" \
  --non-interactive --agree-tos --register-unsafely-without-email \
  --deploy-hook "$SELF_HOST_DIR/scripts/deploy-certs.sh"
```

#### Option B: Cloudflare DNS (Wildcard, If You Use Cloudflare)

If your domain uses Cloudflare for DNS, you can issue an auto-renewing wildcard certificate with an API token that has `Zone:DNS:Edit` permission:

```bash
# Create Cloudflare credentials file
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_api_token = your-cloudflare-api-token
EOF

# Set proper permissions
chmod 600 /root/.cloudflare.ini

# Generate certificates automatically
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --register-unsafely-without-email \
  --deploy-hook "$SELF_HOST_DIR/scripts/deploy-certs.sh"
```

DigitalOcean (`certbot-dns-digitalocean`) and AWS Route53 (`certbot-dns-route53`) plugins work the same way. Install the matching snap plugin first (e.g. `snap install certbot-dns-digitalocean`).

#### Option C: Manual DNS Challenge (Last Resort)

Use this only when no other method fits. Manual certificates do **not** auto-renew, and you must repeat this process every 60–90 days:

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Important**: When prompted, you'll need to create TXT records in your DNS. You may see multiple challenges for the same domain - **create ALL of them**. Do not remove the first TXT record when adding the second one.

If you use this method, also install the weekly certificate expiry warning cron:

```bash
chmod +x "$SELF_HOST_DIR/scripts/check-cert-expiry.sh"
(crontab -l 2>/dev/null; echo "0 8 * * 1 $SELF_HOST_DIR/scripts/check-cert-expiry.sh >> /var/log/cert-expiry.log 2>&1") | crontab -
```

#### Copy Certificates

After certificate generation, copy them to the application directory:

```bash
# Copy certificates to application SSL directory
cp -L "/etc/letsencrypt/live/$DOMAIN"/*.pem "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Step 12: Generate Encryption Keys

Create the various encryption keys required for secure operation:

```bash
# Generate helper encryption key
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Generate SRS secret for email forwarding
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Generate TXT encryption key
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Generate DKIM private key for email signing
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Generate webhook signature key
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Set SMTP transport password
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)"

# Generate API secrets. The trailing comma is REQUIRED (the app parses
# this value as a comma-delimited array)
update_env_file "API_SECRETS" "$(openssl rand -hex 32),"

echo "All encryption keys generated successfully"
```

### Step 13: Update SSL Paths in Configuration

Configure the SSL certificate paths in the environment file:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Step 14: Set Up Basic Authentication

Create temporary basic authentication credentials:

```bash
# Generate a secure random password
PASSWORD=$(openssl rand -base64 16)

# Update environment file with basic auth credentials
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Save credentials to a root-only file (survives terminal scrollback)
install -m 600 /dev/null "$SELF_HOST_DIR/CREDENTIALS.txt"
{
  echo "Forward Email self-hosted first-time login (HTTP Basic Auth)"
  echo "Username: admin"
  echo "Password: $PASSWORD"
} > "$SELF_HOST_DIR/CREDENTIALS.txt"

# Display credentials (save these!)
echo ""
echo "🔐 IMPORTANT: Save these login credentials!"
echo "=================================="
echo "Username: admin"
echo "Password: $PASSWORD"
echo "=================================="
echo ""
echo "You'll need these to access the web interface after installation."
echo ""
```

### Step 15: Deploy with Docker Compose

Pin the images to the latest release and start all the Forward Email services:

```bash
# Set Docker Compose file path
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Pin the Docker images to the latest release tag so updates are explicit
# and can be rolled back (the compose file uses ${IMAGE_TAG:-latest})
IMAGE_TAG=$(curl -fsSL "https://api.github.com/repos/forwardemail/forwardemail.net/releases/latest" | grep '"tag_name"' | head -n 1 | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')
update_env_file "IMAGE_TAG" "$IMAGE_TAG"

# Stop any existing containers
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Pull the pinned images
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Start all services in detached mode
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Wait a moment for services to start
sleep 10

# Check service status
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```

### Step 16: Verify Installation

Check that all services are running correctly:

```bash
# Check Docker containers
docker ps

# Check service logs for any errors
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Test web interface connectivity
curl -I https://$DOMAIN

# Check if ports are listening
ss -tlnp | grep -E ':(25|80|443|465|993|995)'
```


## Post-Installation Configuration

### DNS Records Setup

You need to configure the following DNS records for your domain.

> **Tip**: The setup script prints all of these records at the end of installation, with your detected server IPs and the derived DKIM public key already filled in.

#### MX Record

```
@ MX 10 mx.yourdomain.com
```

#### A Records

```
@ A YOUR_SERVER_IP
mx A YOUR_SERVER_IP
smtp A YOUR_SERVER_IP
imap A YOUR_SERVER_IP
pop3 A YOUR_SERVER_IP
api A YOUR_SERVER_IP
caldav A YOUR_SERVER_IP
carddav A YOUR_SERVER_IP
```

#### AAAA Records (IPv6)

If your server has a public IPv6 address, add matching AAAA records:

```
@ AAAA YOUR_SERVER_IPV6
mx AAAA YOUR_SERVER_IPV6
smtp AAAA YOUR_SERVER_IPV6
imap AAAA YOUR_SERVER_IPV6
pop3 AAAA YOUR_SERVER_IPV6
api AAAA YOUR_SERVER_IPV6
caldav AAAA YOUR_SERVER_IPV6
carddav AAAA YOUR_SERVER_IPV6
```

#### SPF Record

```
@ TXT "v=spf1 mx ~all"
```

#### DKIM Record

Get your DKIM public key:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Create DKIM DNS record:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### DMARC Record

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

#### PTR / Reverse DNS Record

This one is configured at your **server/VPS provider** (not in your DNS zone) and is **critical for deliverability**, because many receiving mail servers reject or spam-folder email from IPs whose reverse DNS doesn't match:

* Point your server's public IP (IPv4 and IPv6 if applicable) to `mx.yourdomain.com`
* Most providers expose this in their control panel as "Reverse DNS", "PTR record", or "rDNS"

### First Login

1. Wait for your DNS records to propagate (the setup script can poll for you with `--wait-dns`)
2. Open your web browser and navigate to `https://yourdomain.com`
3. Enter the HTTP Basic Auth credentials that were printed during setup. They are also saved in `self-hosting/CREDENTIALS.txt` (readable by root only)
4. The site redirects you to a `/setup` wizard:
   1. **Create the admin account**: the first account created automatically becomes the admin
   2. **Add your domain**
   3. **Live DNS checklist**: verifies your DNS records in real time
5. Once the admin account exists, the basic-auth gate disables itself automatically (set `AUTH_BASIC_ALWAYS=true` in `.env` if you want to keep it)


## Backup Configuration

The recommended way to configure backups is to re-run the setup script and choose option **2. Setup Backups** (or use `--action backups`):

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh) --action backups
```

The script will:

* Prompt for your S3-compatible credentials (access key ID, secret access key, and an endpoint URL for non-AWS providers like Cloudflare R2). Any S3-compatible storage works
* Prompt for a bucket name (stored as `BACKUP_BUCKET` in `.env`, default `forwardemail-selfhosted`)
* Install three nightly cron jobs (running at midnight):
  * `backup-mongo.sh`: MongoDB dump (`/var/log/mongo-backup.log`)
  * `backup-redis.sh`: Redis snapshot (`/var/log/redis-backup.log`)
  * `backup-sqlite.sh`: encrypted mailbox archives (`/var/log/sqlite-backup.log`)

Verify with `crontab -l`.

> **Important**: Save a copy of your `self-hosting/.env` file somewhere safe. You will need it to restore from backup, because it contains the encryption keys that protect your mailbox data.


## Restore from Backup

To rebuild a server from your backups (e.g. after moving to a new VPS):

1. Place your saved `.env` file at `/root/.env`
2. Run the setup script and choose option **5. Restore from Backup** (or use `--action restore`):

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh) --action restore
```

The script reinstalls dependencies and the firewall, fetches the release files, re-issues certificates, and then restores Redis, MongoDB, and SQLite (mailboxes) from the latest backups found in your bucket (`BACKUP_BUCKET` in `.env`).

> **Warning**: If your saved DKIM key (`ssl/dkim.key`) is missing, the restore generates a new one and warns you. You must then update the DKIM TXT record in DNS, because the old public key is no longer valid.


## Auto-Update Configuration

The compose file pins all Forward Email images to `${IMAGE_TAG:-latest}`, and setup writes the latest release tag to `.env`. Updates are therefore explicit and roll-back-able.

To enable nightly auto-updates, re-run the setup script and choose option **3. Setup Auto Upgrades** (or use `--action auto-update`). This installs a cron job that runs `self-hosting/scripts/update.sh` every night at 1 AM and logs to `/var/log/autoupdate.log`.

### How Updates Work

`scripts/update.sh`:

1. Resolves the latest GitHub release tag (exits early if you're already on it)
2. Writes the new tag to `IMAGE_TAG` in `.env` and pulls the images
3. Restarts the stack and waits for all containers to report healthy
4. **Automatically rolls back** `IMAGE_TAG` to the previous release if the new one comes up unhealthy

You can also run it by hand at any time:

```bash
/root/forwardemail.net/self-hosting/scripts/update.sh
```

### Manual Rollback

To pin back to a previous release manually, edit `IMAGE_TAG` in `self-hosting/.env` and restart:

```bash
docker compose -f /root/forwardemail.net/self-hosting/docker-compose-self-hosted.yml up -d
```


## Certificate Management

### Certificate Methods

The setup script offers five ways to issue certificates:

1. **HTTP (recommended, default)**: issues a per-subdomain SAN certificate (covering `@`, `mx`, `smtp`, `imap`, `pop3`, `api`, `caldav`, `carddav`). Fully automatic renewal via certbot's systemd timer, with a deploy hook that copies renewed certificates to `self-hosting/ssl/` and restarts the affected services. Requires your A records to point at the server **first**.
2. **Cloudflare DNS**: wildcard certificate, automatic renewal (needs an API token with `Zone:DNS:Edit`)
3. **DigitalOcean DNS**: wildcard certificate, automatic renewal (needs an API token)
4. **AWS Route53 DNS**: wildcard certificate, automatic renewal (uses AWS credentials)
5. **Manual DNS**: wildcard certificate via copy-pasted TXT records. **No automatic renewal**: you must repeat issuance every 60–90 days. The setup script installs a weekly expiry-warning cron (`scripts/check-cert-expiry.sh`, logging to `/var/log/cert-expiry.log`) so you don't get caught out.

### Certificate Renewal

Certbot-managed methods (HTTP, Cloudflare, DigitalOcean, Route53) renew unattended. The deploy hook handles copying and restarting for you.

For manual DNS certificates (or to force a renewal), re-run the setup script and choose option **4. Renew Certificates** (or use `--action renew`):

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh) --action renew
```


## Maintenance and Monitoring

### Log Locations

* **Setup logs**: `/var/log/forwardemail-setup-*.log` (one per setup run)
* **Docker Compose logs**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Individual container logs**: `docker logs <name>` (e.g. `docker logs mx`)
* **System logs**: `/var/log/syslog`
* **Backup logs**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`, `/var/log/sqlite-backup.log`
* **Auto-update logs**: `/var/log/autoupdate.log`
* **Certificate expiry warnings** (manual cert method): `/var/log/cert-expiry.log`

### Regular Maintenance Tasks

1. **Monitor disk space**: `df -h`
2. **Check service status**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Review logs**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Update system packages**: `apt update && apt upgrade`
5. **Check certificate expiration**: automatic for certbot-managed methods; watch `/var/log/cert-expiry.log` if you used manual DNS certificates


## Troubleshooting

### Common Issues

#### 1. Outbound Port 25 Blocked by Your Provider

**Symptoms**: inbound email works, but forwarded/outbound mail never arrives; logs show connection timeouts to remote mail servers.

Most cloud providers (AWS, GCP, Azure, DigitalOcean, Hetzner Cloud) block outbound port 25 by default. Test it:

```bash
timeout 10 bash -c '</dev/tcp/smtp.gmail.com/25' && echo "port 25 open" || echo "port 25 BLOCKED"
```

If blocked, request an unblock from your provider (most have a support form for this), or move to a host that allows outbound SMTP. The setup script runs this same check during preflight.

#### 2. Poor Deliverability / Mail Marked as Spam

* Verify the **PTR (reverse DNS) record** at your VPS provider points your server IP to `mx.yourdomain.com`. A mismatch here is one of the most common deliverability killers
* Check SPF, DKIM, and DMARC records
* Verify MX records are correct

#### 3. A Single Container Keeps Failing

Check that container's logs directly:

```bash
# Container names: sni-router, web, api, bree, mx, smtp, smtp_bree,
# imap, pop3, sqlite, sqlite_bree, caldav, carddav, mongodb, redis
docker logs mx --tail=100
```

#### 4. Setup Script Failed

Every setup run writes a full log. Check the most recent one:

```bash
ls -t /var/log/forwardemail-setup-*.log | head -1 | xargs tail -50
```

#### 5. Certificate Generation Fails

* Ensure ports 80 and 443 are accessible and DNS records point to your server
* **DNS propagation**: freshly created records can take minutes to hours to become visible. Wait and retry
* **Manual DNS challenges**: you may be prompted to create **multiple TXT records with the same name** (`_acme-challenge.yourdomain.com`). Create ALL of them. Do not remove the first when adding the second; both must exist simultaneously
* If you used manual DNS certificates, watch `/var/log/cert-expiry.log` for expiry warnings and renew via setup option 4

#### 6. Docker Service Won't Start

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 7. Web Interface Not Accessible

* Check firewall settings: `ufw status`
* Verify SSL certificates: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Check basic auth credentials in `self-hosting/CREDENTIALS.txt`

### Getting Help

* **Documentation**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Community Support**: Check the project's GitHub discussions


## Security Best Practices

1. **Keep System Updated**: Regularly update Ubuntu and packages
2. **Monitor Logs**: Set up log monitoring and alerting
3. **Backup Regularly**: Test backup and restore procedures, and keep a safe copy of your `.env`
4. **Use Strong Passwords**: Generate strong passwords for all accounts
5. **Enable Fail2Ban**: Consider installing fail2ban for additional security
6. **Regular Security Audits**: Periodically review your configuration
7. **Delete CREDENTIALS.txt** once your admin account exists. It's only needed for first login


## Conclusion

Your Forward Email self-hosted installation should now be complete and running on Ubuntu. Remember to:

1. Configure your DNS records (including PTR/reverse DNS) properly
2. Complete the `/setup` wizard and create your admin account
3. Test email sending and receiving
4. Set up regular backups and save your `.env` file
5. Enable auto-updates or run `scripts/update.sh` regularly
6. Monitor your system regularly

For additional configuration options and advanced features, refer to the official Forward Email documentation at <https://forwardemail.net/self-hosted#configuration>.
