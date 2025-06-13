# Forward Email Self-Hosting Installation Guide for Ubuntu


## Table of Contents

* [Overview](#overview)
* [Prerequisites](#prerequisites)
* [System Requirements](#system-requirements)
* [Step-by-Step Installation](#step-by-step-installation)
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
  * [Set Up S3-Compatible Backup](#set-up-s3-compatible-backup)
  * [Set Up Backup Cron Jobs](#set-up-backup-cron-jobs)
* [Auto-Update Configuration](#auto-update-configuration)
* [Maintenance and Monitoring](#maintenance-and-monitoring)
  * [Log Locations](#log-locations)
  * [Regular Maintenance Tasks](#regular-maintenance-tasks)
  * [Certificate Renewal](#certificate-renewal)
* [Troubleshooting](#troubleshooting)
  * [Common Issues](#common-issues)
  * [Getting Help](#getting-help)
* [Security Best Practices](#security-best-practices)
* [Conclusion](#conclusion)


## Overview

This guide provides step-by-step instructions for installing Forward Email's self-hosted solution on Ubuntu systems. This guide is specifically tailored for Ubuntu 20.04, 22.04, and 24.04 LTS versions.


## Prerequisites

Before beginning the installation, ensure you have:

* **Ubuntu Server**: 20.04, 22.04, or 24.04 LTS
* **Root Access**: You must be able to run commands as root (sudo access)
* **Domain Name**: A domain that you control with DNS management access
* **Clean Server**: Recommended to use a fresh Ubuntu installation
* **Internet Connection**: Required for downloading packages and Docker images


## System Requirements

* **RAM**: Minimum 2GB (4GB recommended for production)
* **Storage**: Minimum 20GB available space (50GB+ recommended for production)
* **CPU**: 1 vCPU minimum (2+ vCPUs recommended for production)
* **Network**: Public IP address with the following ports accessible:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Step-by-Step Installation

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
    docker-compose \
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

Install Docker CE and Docker Compose:

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

Set up UFW firewall to secure your server:

```bash
# Set default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (important - don't lock yourself out!)
ufw allow 22/tcp

# Allow email-related ports
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (for Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (alternative port)
ufw allow 2995/tcp  # POP3 (alternative port)
ufw allow 3456/tcp  # Custom service port
ufw allow 4000/tcp  # Custom service port
ufw allow 5000/tcp  # Custom service port

# Allow local database connections
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Enable firewall
echo "y" | ufw enable

# Check firewall status
ufw status numbered
```

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
update_env_file "WEB_HOST" "$DOMAIN"
update_env_file "WEB_PORT" "443"
update_env_file "CALDAV_HOST" "caldav.$DOMAIN"
update_env_file "CARDDAV_HOST" "carddav.$DOMAIN"
update_env_file "API_HOST" "api.$DOMAIN"
update_env_file "APP_NAME" "$DOMAIN"
update_env_file "SMTP_HOST" "smtp.$DOMAIN"
update_env_file "SMTP_PORT" "465"
update_env_file "IMAP_HOST" "imap.$DOMAIN"
update_env_file "IMAP_PORT" "993"
update_env_file "POP3_HOST" "pop3.$DOMAIN"
update_env_file "POP3_PORT" "995"
update_env_file "MX_HOST" "mx.$DOMAIN"
update_env_file "SMTP_EXCHANGE_DOMAINS" "mx.$DOMAIN"
update_env_file "SELF_HOSTED" "true"
update_env_file "WEBSITE_URL" "$DOMAIN"
update_env_file "AUTH_BASIC_ENABLED" "true"
```

### Step 11: Generate SSL Certificates

#### Option A: Manual DNS Challenge (Recommended for most users)

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

#### Option B: Cloudflare DNS (If you use Cloudflare)

If your domain uses Cloudflare for DNS, you can automate certificate generation:

```bash
# Create Cloudflare credentials file
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
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
  --email "your-email@example.com"
```

#### Copy Certificates

After certificate generation, copy them to the application directory:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

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
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ All encryption keys generated successfully"
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

Start all the Forward Email services:

```bash
# Set Docker Compose file path
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Stop any existing containers
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Pull the latest images
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
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Post-Installation Configuration

### DNS Records Setup

You need to configure the following DNS records for your domain:

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

### First Login

1. Open your web browser and navigate to `https://yourdomain.com`
2. Enter the basic authentication credentials you saved earlier
3. Complete the initial setup wizard
4. Create your first email account


## Backup Configuration

### Set Up S3-Compatible Backup

Configure automated backups to S3-compatible storage:

```bash
# Create AWS credentials directory
mkdir -p ~/.aws

# Configure AWS credentials
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Configure AWS settings
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# For non-AWS S3 (like Cloudflare R2), add endpoint URL
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```

### Set Up Backup Cron Jobs

```bash
# Make backup scripts executable
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Add MongoDB backup cron job (runs daily at midnight)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Add Redis backup cron job (runs daily at midnight)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Verify cron jobs were added
crontab -l
```


## Auto-Update Configuration

Set up automatic updates for your Forward Email installation:

```bash
# Create auto-update command
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```


## Maintenance and Monitoring

### Log Locations

* **Docker Compose logs**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **System logs**: `/var/log/syslog`
* **Backup logs**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Auto-update logs**: `/var/log/autoupdate.log`

### Regular Maintenance Tasks

1. **Monitor disk space**: `df -h`
2. **Check service status**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Review logs**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Update system packages**: `apt update && apt upgrade`
5. **Renew certificates**: Certificates auto-renew, but monitor expiration

### Certificate Renewal

Certificates should auto-renew, but you can manually renew if needed:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```


## Troubleshooting

### Common Issues

#### 1. Docker Service Won't Start

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Certificate Generation Fails

* Ensure ports 80 and 443 are accessible
* Verify DNS records point to your server
* Check firewall settings

#### 3. Email Delivery Issues

* Verify MX records are correct
* Check SPF, DKIM, and DMARC records
* Ensure port 25 isn't blocked by your hosting provider

#### 4. Web Interface Not Accessible

* Check firewall settings: `ufw status`
* Verify SSL certificates: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Check basic auth credentials

### Getting Help

* **Documentation**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Community Support**: Check the project's GitHub discussions


## Security Best Practices

1. **Keep System Updated**: Regularly update Ubuntu and packages
2. **Monitor Logs**: Set up log monitoring and alerting
3. **Backup Regularly**: Test backup and restore procedures
4. **Use Strong Passwords**: Generate strong passwords for all accounts
5. **Enable Fail2Ban**: Consider installing fail2ban for additional security
6. **Regular Security Audits**: Periodically review your configuration


## Conclusion

Your Forward Email self-hosted installation should now be complete and running on Ubuntu. Remember to:

1. Configure your DNS records properly
2. Test email sending and receiving
3. Set up regular backups
4. Monitor your system regularly
5. Keep your installation updated

For additional configuration options and advanced features, refer to the official Forward Email documentation at <https://forwardemail.net/self-hosted#configuration>.
