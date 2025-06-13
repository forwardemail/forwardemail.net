# Forward Email Self-Hosting Installation Guide for Debian


## Table of Contents

* [Overview](#overview)
* [Prerequisites](#prerequisites)
* [System Requirements](#system-requirements)
* [Step-by-Step Installation](#step-by-step-installation)
  * [Step 1: Initial System Setup](#step-1-initial-system-setup)
  * [Step 2: Configure DNS Resolvers](#step-2-configure-dns-resolvers)
  * [Step 3: Install System Dependencies](#step-3-install-system-dependencies)
  * [Step 4: Install and Configure Snapd](#step-4-install-and-configure-snapd)
  * [Step 5: Install Snap Packages](#step-5-install-snap-packages)
  * [Step 6: Install Docker](#step-6-install-docker)
  * [Step 7: Configure Docker Service](#step-7-configure-docker-service)
  * [Step 8: Install and Configure UFW Firewall](#step-8-install-and-configure-ufw-firewall)
  * [Step 9: Clone Forward Email Repository](#step-9-clone-forward-email-repository)
  * [Step 10: Set Up Environment Configuration](#step-10-set-up-environment-configuration)
  * [Step 11: Configure Your Domain](#step-11-configure-your-domain)
  * [Step 12: Generate SSL Certificates](#step-12-generate-ssl-certificates)
  * [Step 13: Generate Encryption Keys](#step-13-generate-encryption-keys)
  * [Step 14: Update SSL Paths in Configuration](#step-14-update-ssl-paths-in-configuration)
  * [Step 15: Set Up Basic Authentication](#step-15-set-up-basic-authentication)
  * [Step 16: Deploy with Docker Compose](#step-16-deploy-with-docker-compose)
  * [Step 17: Verify Installation](#step-17-verify-installation)
* [Post-Installation Configuration](#post-installation-configuration)
  * [DNS Records Setup](#dns-records-setup)
  * [First Login](#first-login)
* [Backup Configuration](#backup-configuration)
  * [Set Up S3-Compatible Backup](#set-up-s3-compatible-backup)
  * [Set Up Backup Cron Jobs](#set-up-backup-cron-jobs)
* [Auto-Update Configuration](#auto-update-configuration)
* [Debian-Specific Considerations](#debian-specific-considerations)
  * [Package Management Differences](#package-management-differences)
  * [Service Management](#service-management)
  * [Network Configuration](#network-configuration)
* [Maintenance and Monitoring](#maintenance-and-monitoring)
  * [Log Locations](#log-locations)
  * [Regular Maintenance Tasks](#regular-maintenance-tasks)
  * [Certificate Renewal](#certificate-renewal)
* [Troubleshooting](#troubleshooting)
  * [Debian-Specific Issues](#debian-specific-issues)
  * [Common Issues](#common-issues)
  * [Getting Help](#getting-help)
* [Security Best Practices](#security-best-practices)
* [Conclusion](#conclusion)


## Overview

This guide provides step-by-step instructions for installing Forward Email's self-hosted solution on Debian systems. This guide is specifically tailored for Debian 11 (Bullseye) and Debian 12 (Bookworm).


## Prerequisites

Before beginning the installation, ensure you have:

* **Debian Server**: Version 11 (Bullseye) or 12 (Bookworm)
* **Root Access**: You must be able to run commands as root (sudo access)
* **Domain Name**: A domain that you control with DNS management access
* **Clean Server**: Recommended to use a fresh Debian installation
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

Install the required packages for Forward Email on Debian:

```bash
# Update package list
apt-get update -y

# Install basic dependencies (Debian-specific package list)
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    lsb-release \
    apt-transport-https \
    software-properties-common
```

### Step 4: Install and Configure Snapd

Debian doesn't include snapd by default, so we need to install and configure it:

```bash
# Install snapd
apt-get install -y snapd

# Enable and start snapd service
systemctl enable snapd
systemctl start snapd

# Create symlink for snap to work properly
ln -sf /var/lib/snapd/snap /snap

# Wait for snapd to be ready
sleep 10

# Verify snapd is working
snap version
```

### Step 5: Install Snap Packages

Install AWS CLI and Certbot via snap:

```bash
# Install AWS CLI
snap install aws-cli --classic

# Install Certbot and DNS plugin
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Verify installations
aws --version
certbot --version
```

### Step 6: Install Docker

Install Docker CE and Docker Compose on Debian:

```bash
# Add Docker's official GPG key (Debian-specific)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository (Debian-specific)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Update package index and install Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install standalone docker-compose as fallback (if plugin doesn't work)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Verify Docker installation
docker --version
docker compose version || docker-compose --version
```

### Step 7: Configure Docker Service

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

### Step 8: Install and Configure UFW Firewall

Debian minimal installations may not include UFW, so install it first:

```bash
# Install UFW if not present
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

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

### Step 9: Clone Forward Email Repository

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

### Step 10: Set Up Environment Configuration

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

### Step 11: Configure Your Domain

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

### Step 12: Generate SSL Certificates

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

### Step 13: Generate Encryption Keys

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

### Step 14: Update SSL Paths in Configuration

Configure the SSL certificate paths in the environment file:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Step 15: Set Up Basic Authentication

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

### Step 16: Deploy with Docker Compose

Start all the Forward Email services:

```bash
# Set Docker Compose file path
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Stop any existing containers
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Pull the latest images
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Start all services in detached mode
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Wait a moment for services to start
sleep 10

# Check service status
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Step 17: Verify Installation

Check that all services are running correctly:

```bash
# Check Docker containers
docker ps

# Check service logs for any errors
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Test web interface connectivity
curl -I https://$DOMAIN

# Check if ports are listening
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
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
# Create auto-update command (use appropriate docker compose command)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Add auto-update cron job (runs daily at 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verify the cron job was added
crontab -l
```


## Debian-Specific Considerations

### Package Management Differences

* **Snapd**: Not installed by default on Debian, requires manual installation
* **Docker**: Uses Debian-specific repositories and GPG keys
* **UFW**: May not be included in minimal Debian installations
* **systemd**: Behavior may differ slightly from Ubuntu

### Service Management

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Network Configuration

Debian may have different network interface names or configurations:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```


## Maintenance and Monitoring

### Log Locations

* **Docker Compose logs**: Use appropriate docker compose command based on installation
* **System logs**: `/var/log/syslog`
* **Backup logs**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Auto-update logs**: `/var/log/autoupdate.log`
* **Snapd logs**: `journalctl -u snapd`

### Regular Maintenance Tasks

1. **Monitor disk space**: `df -h`
2. **Check service status**: Use appropriate docker compose command
3. **Review logs**: Check both application and system logs
4. **Update system packages**: `apt update && apt upgrade`
5. **Monitor snapd**: `snap list` and `snap refresh`

### Certificate Renewal

Certificates should auto-renew, but you can manually renew if needed:

```bash
# Manual certificate renewal
certbot renew

# Copy renewed certificates
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Restart services to use new certificates
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Troubleshooting

### Debian-Specific Issues

#### 1. Snapd Not Working

```bash
# Check snapd status
systemctl status snapd

# Restart snapd
systemctl restart snapd

# Check snap path
echo $PATH | grep snap

# Add snap to PATH if missing
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Docker Compose Command Not Found

```bash
# Check which docker compose command is available
command -v docker-compose
command -v docker

# Use the appropriate command in scripts
if command -v docker-compose &> /dev/null; then
    echo "Using docker-compose"
else
    echo "Using docker compose"
fi
```

#### 3. Package Installation Issues

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Common Issues

#### 1. Docker Service Won't Start

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Certificate Generation Fails

* Ensure ports 80 and 443 are accessible
* Verify DNS records point to your server
* Check firewall settings with `ufw status`

#### 3. Email Delivery Issues

* Verify MX records are correct
* Check SPF, DKIM, and DMARC records
* Ensure port 25 isn't blocked by your hosting provider

### Getting Help

* **Documentation**: <https://forwardemail.net/self-hosted>
* **GitHub Issues**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Debian Documentation**: <https://www.debian.org/doc/>


## Security Best Practices

1. **Keep System Updated**: Regularly update Debian and packages
2. **Monitor Logs**: Set up log monitoring and alerting
3. **Backup Regularly**: Test backup and restore procedures
4. **Use Strong Passwords**: Generate strong passwords for all accounts
5. **Enable Fail2Ban**: Consider installing fail2ban for additional security
6. **Regular Security Audits**: Periodically review your configuration
7. **Monitor Snapd**: Keep snap packages updated with `snap refresh`


## Conclusion

Your Forward Email self-hosted installation should now be complete and running on Debian. Remember to:

1. Configure your DNS records properly
2. Test email sending and receiving
3. Set up regular backups
4. Monitor your system regularly
5. Keep your installation updated
6. Monitor snapd and snap packages

The main differences from Ubuntu are the snapd installation and Docker repository configuration. Once these are properly set up, the Forward Email application behaves identically on both systems.

For additional configuration options and advanced features, refer to the official Forward Email documentation at <https://forwardemail.net/self-hosted#configuration>.
