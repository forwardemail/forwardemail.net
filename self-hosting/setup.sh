#!/bin/bash

# Forward Email Self-Hosted Setup Script
# Enhanced version with Debian support
#
# How to install:
# bash <(curl -fsSL selfhost.forwardemail.net)

set -e          # Exit immediately if a command exits with a non-zero status
set -o pipefail # Exit if any command in a pipeline fails

DEBUG=${DEBUG:-false}

REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"

MONGODB_DB_BACKUPS_DIR="mongo-backups"
REDIS_DB_BACKUPS_DIR="redis-backups"
SQLITE_DB_DIR="sqlite-data"

ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

ROOT_DIR="${ROOT_DIR:-/root/$REPO_FOLDER_NAME}"
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

LOG_FILE="/var/log/forwardemail-setup-$(date +%Y%m%d-%H%M%S).log"

log() {
  echo "[$(date +%H:%M:%S)] $*" >>"$LOG_FILE"
}

on_error() {
  local exit_code=$?
  local line_no=$1
  echo ""
  echo "❌ Setup failed at line $line_no (exit code $exit_code)."
  echo "   Full log: $LOG_FILE"
  if [[ -s "$LOG_FILE" ]]; then
    echo "   Last 20 lines:"
    tail -n 20 "$LOG_FILE" | sed 's/^/   | /'
  fi
  exit "$exit_code"
}

trap 'on_error $LINENO' ERR

# Use docker compose v2 when available, fall back to legacy docker-compose
compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  else
    docker-compose "$@"
  fi
}

# Detect operating system
detect_os() {
  if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    OS=$ID
    OS_VERSION=$VERSION_ID
  elif [[ -f /etc/lsb-release ]]; then
    . /etc/lsb-release
    OS=$DISTRIB_ID
    OS_VERSION=$DISTRIB_RELEASE
  else
    echo "❌ Cannot detect operating system. This script supports Ubuntu and Debian only."
    exit 1
  fi

  # Convert to lowercase for consistency
  OS=$(echo "$OS" | tr '[:upper:]' '[:lower:]')

  echo "Detected OS: $OS $OS_VERSION"
}

# Check if the operating system is supported
check_os_support() {
  case "$OS" in
    ubuntu)
      if [[ "$OS_VERSION" != "20.04" && "$OS_VERSION" != "22.04" && "$OS_VERSION" != "24.04" ]]; then
        echo "⚠️  Warning: This script has been tested on Ubuntu 20.04, 22.04, and 24.04. Your version ($OS_VERSION) may not be fully supported."
        read -rp "Do you want to continue anyway? (y/N): " continue_anyway
        if [[ "$continue_anyway" != "y" && "$continue_anyway" != "Y" ]]; then
          exit 1
        fi
      fi
      ;;
    debian)
      if [[ "$OS_VERSION" != "11" && "$OS_VERSION" != "12" ]]; then
        echo "⚠️  Warning: This script has been tested on Debian 11 and 12. Your version ($OS_VERSION) may not be fully supported."
        read -rp "Do you want to continue anyway? (y/N): " continue_anyway
        if [[ "$continue_anyway" != "y" && "$continue_anyway" != "Y" ]]; then
          exit 1
        fi
      fi
      ;;
    *)
      echo "❌ Unsupported operating system: $OS"
      echo "This script currently supports Ubuntu (20.04, 22.04, 24.04) and Debian (11, 12)."
      exit 1
      ;;
  esac
}

# Run a setup step: log all output, fail loudly with a pointer to the log.
# Usage: run_step "Description of step" command [args...]
run_step() {
  local description="$1"
  shift

  echo "$description..."
  log "STEP: $description"
  log "+ $*"

  local exit_code=0
  if [[ "$DEBUG" == "true" ]]; then
    "$@" 2>&1 | tee -a "$LOG_FILE" || exit_code=$?
  else
    "$@" >>"$LOG_FILE" 2>&1 || exit_code=$?
  fi

  if [[ $exit_code -ne 0 ]]; then
    echo ""
    echo "❌ ${description} failed (exit code $exit_code)."
    echo "   Full log: $LOG_FILE"
    echo "   Last 20 lines:"
    tail -n 20 "$LOG_FILE" | sed 's/^/   | /'
    exit "$exit_code"
  fi
}

# "Press Enter to continue" gate, skipped in non-interactive mode
pause_for_confirm() {
  if [[ "${ASSUME_YES:-false}" == "true" ]]; then
    return 0
  fi
  read -rp "Press Enter to continue or Ctrl+C to cancel..." </dev/tty
}

# Prompt for confirmation before a destructive/system-level change.
# Skipped when ASSUME_YES=true.
confirm_step() {
  local message="$1"

  echo ""
  echo "⚠️  $message"

  if [[ "${ASSUME_YES:-false}" == "true" ]]; then
    echo "   (auto-confirmed via --yes)"
    return 0
  fi

  read -rp "Continue? (y/N): " answer </dev/tty
  if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
    echo "Aborted by user."
    exit 1
  fi
}

# Prompt user to confirm setup (or run the pre-selected choice from --action)
prompt_command() {
  local choice="${1:-}"

  if [[ -z "$choice" ]]; then
    echo "Please select an option:"
    echo "1. Initial Setup"
    echo "2. Setup Backups"
    echo "3. Setup Auto Upgrades"
    echo "4. Renew Certificates"
    echo "5. Restore from Backup"
    echo "6. Help"
    echo "7. Exit"
    echo -n "Enter your choice [1-7]: " >/dev/tty
    read -r choice </dev/tty
  fi

  case $choice in
  1)
    echo -e "\n========================================="
    echo "Forward Email Self Hosted - Initial Setup"
    echo "========================================="
    echo -e "\nInitial setup will:"
    echo "* Download the latest code and dependencies."
    echo "* Configure the environments basic DNS, firewall, configuration and certificates."
    echo "* Download and spin up the relevant email components."
    echo -e "\nIt is recommended you run this on a clean host."
    echo -e "=========================================\n"

    pause_for_confirm

    initial_setup
    ;;
  2)
    echo -e "\n========================================="
    echo "Setup Backups"
    echo "========================================="
    echo -e "\nSetting up backups will create crons that will:"
    echo "* Prompt for AWS Access Key ID, Secret and Endpoint URL (if necessary)."
    echo "* Any S3 compatible option should work (e.g. AWS S3, Cloudflare R2, etc)."
    echo "* Create crons for backing up redis, mongodb and sqlite (mailboxes)."
    echo -e "=========================================\n"

    pause_for_confirm

    if [[ -z "$AWS_ACCESS_KEY_ID" ]]; then
      read -rp "What is the S3 ACCESS KEY ID?: " AWS_ACCESS_KEY_ID </dev/tty
    fi
    export AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
    update_env_file AWS_ACCESS_KEY_ID "$AWS_ACCESS_KEY_ID"

    if [[ -z "$AWS_SECRET_ACCESS_KEY" ]]; then
      read -rp "What is the S3 SECRET ACCESS KEY?: " AWS_SECRET_ACCESS_KEY </dev/tty
    fi
    export AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
    update_env_file AWS_SECRET_ACCESS_KEY "$AWS_SECRET_ACCESS_KEY"

    if [[ -z "$AWS_ENDPOINT_URL" && "${ASSUME_YES:-false}" != "true" ]]; then
      read -rp "Will you be using AWS S3 directly? (yes/no): " isAwsS3 </dev/tty
      isAwsS3=$(echo "$isAwsS3" | tr '[:upper:]' '[:lower:]')
      if [[ "$isAwsS3" == "no" || "$isAwsS3" == "n" ]]; then
        read -rp "What is the S3 endpoint URL?: " AWS_ENDPOINT_URL </dev/tty
      fi
    fi
    if [[ -n "$AWS_ENDPOINT_URL" ]]; then
      export AWS_ENDPOINT_URL="$AWS_ENDPOINT_URL"
      update_env_file AWS_ENDPOINT_URL "$AWS_ENDPOINT_URL"
    fi

    if [[ -z "$BACKUP_BUCKET" && "${ASSUME_YES:-false}" != "true" ]]; then
      read -rp "S3 bucket name for backups [forwardemail-selfhosted]: " BACKUP_BUCKET </dev/tty
    fi
    BACKUP_BUCKET="${BACKUP_BUCKET:-forwardemail-selfhosted}"
    export BACKUP_BUCKET
    update_env_file BACKUP_BUCKET "$BACKUP_BUCKET"

    set_aws_credentials
    chmod +x "$SELF_HOST_DIR"/scripts/backup-mongo.sh
    chmod +x "$SELF_HOST_DIR"/scripts/backup-redis.sh
    chmod +x "$SELF_HOST_DIR"/scripts/backup-sqlite.sh

    install_backup_cron() {
      local cron_line="0 0 * * * $SELF_HOST_DIR/scripts/backup-$1.sh >> /var/log/$1-backup.log 2>&1"
      (crontab -l 2>/dev/null | grep -Fq "$cron_line") || (
        crontab -l 2>/dev/null
        echo "$cron_line"
      ) | crontab -
    }

    install_backup_cron mongo
    install_backup_cron redis
    install_backup_cron sqlite

    echo "✅ Backup setup complete!"
    echo "You can find the crons using: \`crontab -l\`. These will run at midnight by default."
    echo "NOTE: Please be sure to save your .env file in a safe place in the event of a restore from backup."
    ;;
  3)
    AUTO_UPDATE_CRON="0 1 * * * $SELF_HOST_DIR/scripts/update.sh >> /var/log/autoupdate.log 2>&1"

    if crontab -l 2>/dev/null | grep -Fq "$AUTO_UPDATE_CRON"; then
      echo "✅ Cron job is already set. No changes made."
      exit 0
    fi

    echo -e "\n========================================="
    echo "Setup Auto Updates"
    echo "========================================="
    echo "Setting up auto updates will setup a cron that will:"
    echo "* Update to the latest release tag and pull its Docker image."
    echo "* Restart your self-hosted services and verify they come up healthy."
    echo "* Roll back to the previous release if the new one is unhealthy."
    echo "* Log the output to /var/log/autoupdate.log."
    echo -e "\nOnce setup, this will run every night just after midnight (1 AM)."
    echo -e "=========================================\n"

    pause_for_confirm

    chmod +x "$SELF_HOST_DIR/scripts/update.sh"

    # drop the legacy raw pull && up -d cron if present
    if crontab -l 2>/dev/null | grep -Fq "docker compose -f $DOCKER_COMPOSE_FILE pull"; then
      crontab -l 2>/dev/null | grep -Fv "docker compose -f $DOCKER_COMPOSE_FILE pull" | crontab -
      echo "Removed legacy auto-update cron."
    fi

    (crontab -l 2>/dev/null | grep -Fq "$AUTO_UPDATE_CRON") || (
      crontab -l 2>/dev/null
      echo "$AUTO_UPDATE_CRON"
    ) | crontab -

    echo "crontab -l"
    crontab -l
    echo "✅ Upgrade cron setup complete..."
    ;;
  4)
    echo "Renewing certificates..."
    renew_certificates
    ;;
  5)
    echo -e "\n========================================="
    echo "Restore from Backup"
    echo "========================================="
    echo "You are about to attempt to restore from a backup! You must:"
    echo "* place your saved .env file at /root/.env"
    echo "* have AWS S3 compatible credentials ready"
    echo "* have backup files in your backup bucket (BACKUP_BUCKET in .env)"
    echo -e "\nOnce complete, you should have a running email setup from last checkpoint."
    echo -e "=========================================\n"

    pause_for_confirm

    # accept the saved .env from /root/.env or an existing install dir
    ENV_SOURCE=""
    for candidate in "/root/$ENV_FILE" "$ROOT_DIR/$ENV_FILE" "$SELF_HOST_DIR/$ENV_FILE"; do
      if [ -e "$candidate" ]; then
        ENV_SOURCE="$candidate"
        break
      fi
    done

    if [ -z "$ENV_SOURCE" ]; then
      echo "No .env found at /root/$ENV_FILE. Add your saved .env and retry."
      exit 1
    fi

    update_dns_resolvers
    install_dependencies
    setup_firewall
    fetch_release_files

    mkdir -p "$SELF_HOST_DIR/ssl"
    if [ "$ENV_SOURCE" != "$SELF_HOST_DIR/$ENV_FILE" ]; then
      cp "$ENV_SOURCE" "$SELF_HOST_DIR/$ENV_FILE"
    fi

    export_from_env_file AWS_ACCESS_KEY_ID
    export_from_env_file AWS_SECRET_ACCESS_KEY
    export_from_env_file DOMAIN

    # optional keys
    AWS_ENDPOINT_URL="$(get_env_value AWS_ENDPOINT_URL)"
    export AWS_ENDPOINT_URL
    BACKUP_BUCKET="$(get_env_value BACKUP_BUCKET)"
    BACKUP_BUCKET="${BACKUP_BUCKET:-forwardemail-selfhosted}"

    set_aws_credentials

    compose -f "$DOCKER_COMPOSE_FILE" down
    choose_cert_method
    generate_certificates
    update_ssl_paths

    # only generate a DKIM key when the saved one is gone — a regenerated
    # key invalidates the DKIM TXT record already published in DNS
    if [ ! -f "$SELF_HOST_DIR/ssl/dkim.key" ]; then
      echo "⚠️  No dkim.key found — generating a new one. You MUST update your"
      echo "   DKIM TXT record in DNS to match (the old public key is now invalid)."
      openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
    fi

    update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

    create_db_directories
    mkdir -p "$SELF_HOST_DIR/redis-data"

    # restore redis
    LATEST_REDIS_BACKUP=$(aws s3api list-objects-v2 --bucket "$BACKUP_BUCKET" --prefix redis-backups/ \
      --query 'Contents | sort_by(@, &LastModified) | [-1].Key' --output text)
    if [[ -n "$LATEST_REDIS_BACKUP" && "$LATEST_REDIS_BACKUP" != "None" ]]; then
      aws s3 cp s3://"$BACKUP_BUCKET"/"$LATEST_REDIS_BACKUP" /tmp/dump.rdb
      mv /tmp/dump.rdb "$SELF_HOST_DIR"/redis-data/dump.rdb
    else
      echo "No redis backup found in s3://$BACKUP_BUCKET/redis-backups/ — skipping."
    fi

    # restore mongo
    LATEST_MONGO_BACKUP=$(aws s3api list-objects-v2 --bucket "$BACKUP_BUCKET" --prefix mongo-backups/ \
      --query 'Contents | sort_by(@, &LastModified) | [-1].Key' --output text)
    LATEST_MONGO_BACKUP_PATH=""
    if [[ -n "$LATEST_MONGO_BACKUP" && "$LATEST_MONGO_BACKUP" != "None" ]]; then
      aws s3 cp s3://"$BACKUP_BUCKET"/"$LATEST_MONGO_BACKUP" /tmp/mongo-backup.tgz
      tar -xzf /tmp/mongo-backup.tgz -C "$SELF_HOST_DIR"/mongo-backups/
      LATEST_MONGO_BACKUP_PATH=$(basename "$LATEST_MONGO_BACKUP" .tgz)
    else
      echo "No mongo backup found in s3://$BACKUP_BUCKET/mongo-backups/ — skipping."
    fi

    # restore sqlite (mailboxes)
    LATEST_SQLITE_BACKUP=$(aws s3api list-objects-v2 --bucket "$BACKUP_BUCKET" --prefix sqlite-backups/ \
      --query 'Contents | sort_by(@, &LastModified) | [-1].Key' --output text)
    if [[ -n "$LATEST_SQLITE_BACKUP" && "$LATEST_SQLITE_BACKUP" != "None" ]]; then
      aws s3 cp s3://"$BACKUP_BUCKET"/"$LATEST_SQLITE_BACKUP" /tmp/sqlite-backup.tgz
      tar -xzf /tmp/sqlite-backup.tgz -C "$SELF_HOST_DIR"/sqlite-data/
    else
      echo "No sqlite backup found in s3://$BACKUP_BUCKET/sqlite-backups/ — skipping."
    fi

    compose -f "$DOCKER_COMPOSE_FILE" up -d

    if [[ -n "$LATEST_MONGO_BACKUP_PATH" ]]; then
      docker exec -i mongodb mongorestore --drop --dir /backups/"$LATEST_MONGO_BACKUP_PATH"
    fi

    echo "✅ Restore from backup complete..."
    ;;
  6)
    echo "Help:"
    echo "1. Initial setup: Sets up the application for the first time."
    echo "2. Backup: Creates a backup of your data."
    echo "3. Upgrade: Stay up to date with the latest code and security fixes"
    echo "4. Renew certificates: Renews SSL certificates for your domain."
    echo "5. Restore: Backup from a previous point in time"
    echo "6. Help: All commands and related information"
    echo "7. Exit: Exits the script."
    ;;
  7)
    echo "Exiting..."
    ;;
  *)
    echo "Invalid choice. Please select a valid option."
    ;;
  esac
}

export_from_env_file() {
  if ! grep -q "^$1=" "$SELF_HOST_DIR/$ENV_FILE"; then
    echo "Error: The following key is missing in $SELF_HOST_DIR/$ENV_FILE: $1"
    exit 1
  else
    export "$1"="$(grep "^$1=" "$SELF_HOST_DIR/$ENV_FILE" | cut -d'=' -f2-)"
  fi
}

# Enhanced dependency installation with OS-specific handling
install_dependencies() {
  echo "Installing dependencies for $OS $OS_VERSION..."

  case "$OS" in
    ubuntu)
      install_dependencies_ubuntu
      ;;
    debian)
      install_dependencies_debian
      ;;
    *)
      echo "❌ Unsupported OS for dependency installation: $OS"
      exit 1
      ;;
  esac
}

install_dependencies_ubuntu() {
  # Update package list and install dependencies
  apt-get update -y -q
  apt-get install -y -q \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    snapd

  # Install snap packages
  snap install aws-cli --classic
  snap install certbot --classic
  snap set certbot trust-plugin-with-root=ok
  snap install certbot-dns-cloudflare

  # Add Docker's official GPG key
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  # Add Docker repository
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

  # Update package index and install Docker
  apt-get update -y -q
  apt-get install -y -q docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  # Verify installation
  docker --version
}

install_dependencies_debian() {
  # Update package list and install dependencies
  apt-get update -y -q
  apt-get install -y -q \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    lsb-release \
    apt-transport-https \
    software-properties-common

  # Install snapd if not present (Debian doesn't include it by default)
  if ! command -v snap &> /dev/null; then
    apt-get install -y -q snapd
    systemctl enable snapd
    systemctl start snapd
    # Create symlink for snap to work properly
    ln -sf /var/lib/snapd/snap /snap
    # Wait for snapd to be ready
    sleep 5
  fi

  # Install snap packages
  snap install aws-cli --classic
  snap install certbot --classic
  snap set certbot trust-plugin-with-root=ok
  snap install certbot-dns-cloudflare

  # Add Docker's official GPG key
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  # Add Docker repository (using Debian-specific URL and codename)
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

  # Update package index and install Docker
  apt-get update -y -q
  apt-get install -y -q docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  # Verify installation
  docker --version
}

# Function to check if Docker is running
check_docker_running() {
  if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Attempting to start it."
    systemctl unmask docker
    systemctl enable docker
    systemctl start docker
    if ! docker info >/dev/null 2>&1; then
      echo "Docker issues with systemctl, using dockerd directly..."
      nohup dockerd >/dev/null 2>/dev/null &
      sleep 5
    fi
  else
    echo "✅ Docker is running."
  fi
}

set_aws_credentials() {
  mkdir -p ~/.aws

  if [[ -f ~/.aws/credentials ]]; then
    cp ~/.aws/credentials ~/.aws/credentials.bak-forwardemail
    echo "Existing ~/.aws/credentials backed up to ~/.aws/credentials.bak-forwardemail"
  fi

  cat >~/.aws/credentials <<EOF
[default]
aws_access_key_id = $AWS_ACCESS_KEY_ID
aws_secret_access_key = $AWS_SECRET_ACCESS_KEY
EOF

  cat >~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

  if [[ -n $AWS_ENDPOINT_URL ]]; then
    echo "endpoint_url = $AWS_ENDPOINT_URL" >>~/.aws/config
  fi
}

update_dns_resolvers() {
  if [[ "${SKIP_DNS_RESOLVER_CHANGE:-false}" == "true" ]]; then
    echo "Skipping DNS resolver change (SKIP_DNS_RESOLVER_CHANGE=true)."
    return 0
  fi

  # lots of issues with local resolvers for some cloud providers, so use cloudflare by default
  # this directly affects certbot setup and acme-challenge txt record checks
  if [[ -f /etc/resolv.conf ]]; then
    cp -L /etc/resolv.conf /etc/resolv.conf.bak-forwardemail 2>/dev/null || true
  fi

  if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
  fi

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
}

update_env_file() {
  local key="$1"
  local value="$2"
  local file="$SELF_HOST_DIR/$ENV_FILE"

  # Treat the value as literal text (sed would break on |, &, \ in
  # generated passwords and keys)
  if grep -qE "^${key}=" "$file"; then
    awk -v k="$key" -v v="$value" -F '=' 'index($0, k"=") == 1 { print k "=" v; next } { print }' "$file" >"$file.tmp" && mv "$file.tmp" "$file"
  else
    printf '%s=%s\n' "$key" "$value" >>"$file"
  fi
}

update_default_env() {
  update_env_file NODE_ENV production
  update_env_file HTTP_PROTOCOL https
  update_env_file WEB_URL https://{{DOMAIN}}
  update_env_file WEB_HOST {{DOMAIN}}
  update_env_file SQLITE_HOST sqlite.{{DOMAIN}}
  update_env_file CALDAV_HOST caldav.{{DOMAIN}}
  update_env_file CARDDAV_HOST carddav.{{DOMAIN}}
  update_env_file API_HOST api.{{DOMAIN}}
  update_env_file APP_NAME {{DOMAIN}}
  update_env_file TRANSPORT_DEBUG true
  update_env_file SEND_EMAIL true
  update_env_file PREVIEW_EMAIL false
  update_env_file MONGO_HOST 127.0.0.1
  update_env_file LOGS_HOST 127.0.0.1
  update_env_file REDIS_HOST 127.0.0.1
  update_env_file TURNSTILE_ENABLED false
  update_env_file MX_PORT 25
  update_env_file SQLITE_STORAGE_PATH sqlite_storage
  update_env_file SMTP_HOST smtp.{{DOMAIN}}
  update_env_file SMTP_PORT 465
  update_env_file IMAP_HOST imap.{{DOMAIN}}
  update_env_file IMAP_PORT 993
  update_env_file POP3_HOST pop3.{{DOMAIN}}
  update_env_file POP3_PORT 995
  update_env_file MX_HOST mx.{{DOMAIN}}
  update_env_file SMTP_EXCHANGE_DOMAINS mx.{{DOMAIN}}
  update_env_file SELF_HOSTED true
  update_env_file ENABLE_MONITOR_SERVER false
  update_env_file DOMAIN "$DOMAIN"
  update_env_file WEBSITE_URL "$DOMAIN"
  update_env_file CACHE_RESPONSES true
  update_env_file AUTH_BASIC_ENABLED true
}

update_ssl_paths() {
  # Update SSL paths
  sed -i -E \
    -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
    -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
    -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
    "$SELF_HOST_DIR/$ENV_FILE"
}

# Validate a domain name
validate_domain() {
  [[ "$1" =~ ^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]
}

# Copy the current Let's Encrypt certs for $DOMAIN into the ssl dir,
# resolving the exact live directory (a bare glob would also match stale
# duplicates like example.com-0001)
copy_live_certs() {
  local live_dir="/etc/letsencrypt/live/$DOMAIN"

  if [[ ! -d "$live_dir" ]]; then
    live_dir=$(ls -td /etc/letsencrypt/live/"$DOMAIN"* 2>/dev/null | head -n 1)
  fi

  if [[ -z "$live_dir" || ! -d "$live_dir" ]]; then
    echo "❌ No Let's Encrypt live directory found for $DOMAIN"
    return 1
  fi

  cp -L "$live_dir"/*.pem "$SELF_HOST_DIR/ssl/"
}

# Pick how certificates are issued/renewed. All methods except "manual"
# renew unattended via certbot's own timer + our deploy hook.
choose_cert_method() {
  if [[ -n "$CERT_METHOD" ]]; then
    echo "CERT_METHOD already set: $CERT_METHOD"
    return 0
  fi

  # existing installs with a cloudflare ini keep working with zero prompts
  if [[ -f "/root/.cloudflare.ini" ]]; then
    CERT_METHOD="cloudflare"
    return 0
  fi

  if [[ "${ASSUME_YES:-false}" == "true" ]]; then
    CERT_METHOD="http"
    return 0
  fi

  echo ""
  echo "How should SSL certificates be issued?"
  echo "1. HTTP (recommended): per-subdomain cert, fully automatic renewal."
  echo "   Requires your A records to point at this server FIRST."
  echo "2. Cloudflare DNS: wildcard cert, automatic renewal (needs API token)."
  echo "3. DigitalOcean DNS: wildcard cert, automatic renewal (needs API token)."
  echo "4. AWS Route53 DNS: wildcard cert, automatic renewal (uses AWS credentials)."
  echo "5. Manual DNS: wildcard cert via copy-pasted TXT records."
  echo "   NO automatic renewal — you must repeat this every ~60-90 days."

  local cert_choice
  read -rp "Enter your choice [1-5] (default 1): " cert_choice </dev/tty

  case "$cert_choice" in
    2) CERT_METHOD="cloudflare" ;;
    3) CERT_METHOD="digitalocean" ;;
    4) CERT_METHOD="route53" ;;
    5) CERT_METHOD="manual" ;;
    *) CERT_METHOD="http" ;;
  esac
}

# Prompt for a DNS provider API token and write the certbot credentials ini
write_dns_credentials() {
  local ini_path="$1"
  local key_name="$2"

  if [[ -f "$ini_path" ]]; then
    echo "Using existing credentials at $ini_path"
    return 0
  fi

  local token
  read -rp "Enter your API token: " token </dev/tty
  install -m 600 /dev/null "$ini_path"
  printf '%s = %s\n' "$key_name" "$token" >"$ini_path"
}

# Generate SSL certificates via the chosen method
generate_certificates() {
  local deploy_hook="$SELF_HOST_DIR/scripts/deploy-certs.sh"
  chmod +x "$deploy_hook" 2>/dev/null || true

  # let's encrypt doesn't need an email because they don't send renewal notices anymore
  # https://letsencrypt.org/2025/01/22/ending-expiration-emails/
  local email_args=(--register-unsafely-without-email)
  if [[ -n "$EMAIL" ]]; then
    email_args=(--email "$EMAIL")
  fi

  case "${CERT_METHOD:-manual}" in
    http)
      echo ""
      echo "HTTP certificate issuance requires these A records to exist FIRST"
      echo "(pointing at this server${PUBLIC_IPV4:+, $PUBLIC_IPV4}):"
      echo "  @ mx smtp imap pop3 api caldav carddav"

      if [[ "${ASSUME_YES:-false}" != "true" ]]; then
        read -rp "Press Enter once the A records are in place (or Ctrl+C to cancel)..." </dev/tty
      fi

      certbot certonly --standalone --preferred-challenges http \
        -d "$DOMAIN" -d "mx.$DOMAIN" -d "smtp.$DOMAIN" -d "imap.$DOMAIN" \
        -d "pop3.$DOMAIN" -d "api.$DOMAIN" -d "caldav.$DOMAIN" -d "carddav.$DOMAIN" \
        --non-interactive --agree-tos "${email_args[@]}" \
        --deploy-hook "$deploy_hook"
      ;;
    cloudflare)
      # https://certbot-dns-cloudflare.readthedocs.io/en/stable/
      # dns_cloudflare_api_token = <token with Zone:DNS:Edit>
      write_dns_credentials /root/.cloudflare.ini dns_cloudflare_api_token
      certbot certonly --dns-cloudflare --dns-cloudflare-credentials /root/.cloudflare.ini \
        -d "$DOMAIN" -d "*.$DOMAIN" \
        --non-interactive --agree-tos "${email_args[@]}" \
        --deploy-hook "$deploy_hook"
      ;;
    digitalocean)
      snap install certbot-dns-digitalocean >/dev/null 2>&1 || true
      write_dns_credentials /root/.digitalocean.ini dns_digitalocean_token
      certbot certonly --dns-digitalocean --dns-digitalocean-credentials /root/.digitalocean.ini \
        -d "$DOMAIN" -d "*.$DOMAIN" \
        --non-interactive --agree-tos "${email_args[@]}" \
        --deploy-hook "$deploy_hook"
      ;;
    route53)
      snap install certbot-dns-route53 >/dev/null 2>&1 || true
      echo "Route53 uses AWS credentials from the environment or ~/.aws/credentials."
      certbot certonly --dns-route53 \
        -d "$DOMAIN" -d "*.$DOMAIN" \
        --non-interactive --agree-tos "${email_args[@]}" \
        --deploy-hook "$deploy_hook"
      ;;
    manual)
      echo "
IMPORTANT: When generating SSL certificates with Certbot using DNS challenges,
you may be prompted to create MULTIPLE TXT records with the SAME name.
This typically happens when requesting wildcard certificates or multiple domains.

Example:
You might see two challenges like this:
  _acme-challenge.example.com -> \"randomstring1\"
  _acme-challenge.example.com -> \"randomstring2\"

Do NOT remove or replace the first TXT record when adding the second one.
Both TXT records must exist simultaneously for the verification to succeed.

Double-check that your DNS settings contain BOTH records before proceeding!
" >/dev/tty
      certbot certonly --manual --agree-tos --preferred-challenges dns -d "*.$DOMAIN" -d "$DOMAIN" </dev/tty >/dev/tty 2>&1

      install_cert_expiry_cron
      ;;
    *)
      echo "❌ Unknown CERT_METHOD: $CERT_METHOD"
      exit 1
      ;;
  esac

  copy_live_certs
}

# Manual wildcard certs cannot auto-renew; warn weekly when expiry nears
install_cert_expiry_cron() {
  chmod +x "$SELF_HOST_DIR/scripts/check-cert-expiry.sh" 2>/dev/null || true

  local cron_line="0 8 * * 1 $SELF_HOST_DIR/scripts/check-cert-expiry.sh >> /var/log/cert-expiry.log 2>&1"
  (crontab -l 2>/dev/null | grep -Fq "$cron_line") || (
    crontab -l 2>/dev/null
    echo "$cron_line"
  ) | crontab -

  echo "⚠️  Manual certificates do NOT auto-renew. A weekly expiry check was"
  echo "   installed (logs to /var/log/cert-expiry.log) — renew via this"
  echo "   script's 'Renew Certificates' option before expiry."
}

renew_certificates() {
  input_custom_domain

  # certbot-managed methods renew via the certbot timer; 'renew' also works
  # on demand and triggers the deploy hook. Manual wildcards must re-issue.
  if certbot renew --cert-name "$DOMAIN" --non-interactive 2>/dev/null; then
    echo "Certificates renewed via certbot."
  else
    certbot certonly --manual --agree-tos --preferred-challenges dns -d "*.$DOMAIN" -d "$DOMAIN" </dev/tty >/dev/tty 2>&1
  fi

  copy_live_certs

  # restart running services so they pick up the new certificates
  "$SELF_HOST_DIR/scripts/deploy-certs.sh" || true
}

# Return the current value of a key in the .env file (empty when unset)
get_env_value() {
  grep -E "^$1=" "$SELF_HOST_DIR/$ENV_FILE" 2>/dev/null | head -n 1 | cut -d'=' -f2-
}

# Set a secret in .env only when missing or still the shipped default, so
# re-running setup on an existing install never rotates credentials or
# encryption keys (rotating HELPER/TXT keys would orphan encrypted data)
ensure_env_secret() {
  local key="$1"
  local value="$2"
  local shipped_default="${3:-}"

  local current
  current=$(get_env_value "$key")
  if [[ -z "$current" || "$current" == "$shipped_default" ]]; then
    update_env_file "$key" "$value"
  fi
}

# Generate various encryption keys
generate_encryption_keys() {
  ensure_env_secret "HELPER_ENCRYPTION_KEY" "$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)"

  ensure_env_secret "SRS_SECRET" "$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)"

  ensure_env_secret "TXT_ENCRYPTION_KEY" "$(openssl rand -hex 16)"

  if [[ ! -f "$SELF_HOST_DIR/ssl/dkim.key" ]]; then
    openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
  fi

  update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

  ensure_env_secret "WEBHOOK_SIGNATURE_KEY" "$(openssl rand -hex 16)"

  # password used by the app itself to send system email through smtp.$DOMAIN
  ensure_env_secret "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)" "Thisisapassword123"

  # bearer secret for the REST API and the internal mx/imap/pop3 <-> sqlite
  # websocket auth; the trailing comma makes the app parse it as an array
  ensure_env_secret "API_SECRETS" "$(openssl rand -hex 32)," "secret,"

  echo "Helper, DKIM, SRS, SMTP and API encryption keys generated."
}

clone_repo() {
  if [ -d "$ROOT_DIR" ]; then
    echo "Directory $ROOT_DIR already exists. Skipping git clone."
    cd "$ROOT_DIR"
  else
    git clone "$REPO_URL" "$ROOT_DIR"
    cd "$ROOT_DIR"
  fi
}

# Resolve the latest release tag once; used to fetch matching static files
# and to pin the Docker images
resolve_latest_tag() {
  if [[ -n "$RESOLVED_TAG" ]]; then
    return 0
  fi
  RESOLVED_TAG=$(curl -fsSL "https://api.github.com/repos/forwardemail/forwardemail.net/releases/latest" 2>/dev/null | grep '"tag_name"' | head -n 1 | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')
}

# Only a handful of static files are needed on the host (the app itself runs
# from the Docker image), so fetch just those from the release tarball
# instead of cloning the whole monorepo. --dev falls back to a git clone.
fetch_release_files() {
  if [[ "${DEV_MODE:-false}" == "true" ]]; then
    clone_repo
    return 0
  fi

  resolve_latest_tag

  local url
  if [[ -n "$RESOLVED_TAG" ]]; then
    url="https://github.com/forwardemail/forwardemail.net/archive/refs/tags/$RESOLVED_TAG.tar.gz"
  else
    echo "⚠️  Could not resolve the latest release tag; fetching from master."
    url="https://github.com/forwardemail/forwardemail.net/archive/refs/heads/master.tar.gz"
  fi

  mkdir -p "$ROOT_DIR"

  # extraction writes only self-hosting/ static files and .env.defaults —
  # it never touches an existing .env, ssl/ or data directories (none of
  # those exist in the tarball)
  curl -fsSL "$url" | tar -xz -C "$ROOT_DIR" --strip-components=1 \
    --wildcards '*/self-hosting' '*/.env.defaults'

  chmod +x "$SELF_HOST_DIR"/scripts/*.sh 2>/dev/null || true
  chmod +x "$SELF_HOST_DIR"/setup.sh 2>/dev/null || true

  cd "$ROOT_DIR"
}

setup_firewall() {
  # Check if ufw is installed, install if not
  if ! command -v ufw &> /dev/null; then
    case "$OS" in
      ubuntu|debian)
        apt-get update -y -q
        apt-get install -y -q ufw
        ;;
    esac
  fi

  ufw default deny incoming >/dev/null 2>&1

  # only what must be reachable from outside: ssh, smtp, http (ACME), https
  # (the SNI router fronts web/api/caldav/carddav), smtps, imaps, pop3s.
  # Internal services (sqlite ws 3456, api 4000, caldav 5000, carddav 6000)
  # talk over loopback and must NOT be exposed.
  PORTS=(22 25 80 443 465 993 995)

  for port in "${PORTS[@]}"; do
    ufw allow "${port}/tcp" >/dev/null 2>&1
  done

  # close ports that previous versions of this script opened unnecessarily
  for port in 587 2993 2995 3456 4000 5000; do
    ufw delete allow "${port}/tcp" >/dev/null 2>&1 || true
  done

  ufw allow from 127.0.0.1 to any port 27017 >/dev/null 2>&1
  ufw allow from 127.0.0.1 to any port 6379 >/dev/null 2>&1

  echo "y" | ufw enable >/dev/null 2>&1
  ufw status
}

create_db_directories() {
  mkdir -p "$SELF_HOST_DIR/$SQLITE_DB_DIR"
  mkdir -p "$SELF_HOST_DIR/$MONGODB_DB_BACKUPS_DIR"
  mkdir -p "$SELF_HOST_DIR/$REDIS_DB_BACKUPS_DIR"
}

# Older compose files mounted the bare host path /mnt/sqlite_storage into the
# mx and sqlite_bree services while imap/pop3/sqlite used ./sqlite-data,
# splitting mailbox data across two host directories. Merge any data from the
# old location into the canonical ./sqlite-data before starting.
migrate_sqlite_data() {
  local old_dir="/mnt/${SQLITE_STORAGE_PATH:-sqlite_storage}"
  local new_dir="$SELF_HOST_DIR/$SQLITE_DB_DIR"

  if [[ ! -d "$old_dir" ]] || [[ -z "$(ls -A "$old_dir" 2>/dev/null)" ]]; then
    return 0
  fi

  echo "Found legacy sqlite data in $old_dir — merging into $new_dir..."

  compose -f "$DOCKER_COMPOSE_FILE" down 2>/dev/null || true
  mkdir -p "$new_dir"
  # keep the newer copy on filename collisions
  rsync -au "$old_dir"/ "$new_dir"/
  mv "$old_dir" "${old_dir}.migrated-$(date +%Y%m%d)"

  echo "✅ Legacy sqlite data merged (old dir kept at ${old_dir}.migrated-*)."
}

# Pin the compose stack to the latest release tag so updates are explicit
# and can be rolled back (scripts/update.sh)
pin_image_tag() {
  resolve_latest_tag

  if [[ -n "$RESOLVED_TAG" ]]; then
    update_env_file IMAGE_TAG "$RESOLVED_TAG"
    export IMAGE_TAG="$RESOLVED_TAG"
    echo "Pinned Docker images to release $RESOLVED_TAG."
  else
    echo "⚠️  Could not resolve the latest release tag; using :latest images."
  fi
}

# Choose between the full stack (mailbox storage, IMAP/POP3, CalDAV/CardDAV)
# and a lighter forwarding-only deployment
choose_compose_profile() {
  if [[ -n "$COMPOSE_PROFILES" ]]; then
    update_env_file COMPOSE_PROFILES "$COMPOSE_PROFILES"
    echo "COMPOSE_PROFILES already set: $COMPOSE_PROFILES"
    return 0
  fi

  echo ""
  echo "Which deployment do you want?"
  echo "1. Full: email forwarding + mailbox storage (IMAP/POP3), calendars (CalDAV) and contacts (CardDAV)"
  echo "2. Forwarding only: lighter stack that just forwards and sends email (no stored mailboxes)"

  local profile_choice
  if [[ "${ASSUME_YES:-false}" == "true" ]]; then
    profile_choice=1
  else
    read -rp "Enter your choice [1-2] (default 1): " profile_choice </dev/tty
  fi

  if [[ "$profile_choice" == "2" ]]; then
    update_env_file COMPOSE_PROFILES ""
    export COMPOSE_PROFILES=""
    echo "Forwarding-only stack selected."
  else
    update_env_file COMPOSE_PROFILES "storage"
    export COMPOSE_PROFILES="storage"
    echo "Full stack selected."
  fi
}

input_custom_domain() {
  if [[ -n "$DOMAIN" ]]; then
    echo "DOMAIN already set: $DOMAIN"
    update_env_file "DOMAIN" "$DOMAIN"
  else
    while true; do
      read -rp "Enter the domain name you are setting up (e.g. example.com): " DOMAIN </dev/tty
      if validate_domain "$DOMAIN"; then
        echo "✅ Domain name is valid."
        update_env_file "DOMAIN" "$DOMAIN"
        break
      else
        echo "❌ Invalid domain name. Please enter a valid one."
      fi
    done
  fi
}

setup_one_time_login() {
  if [[ -n "$AUTH_BASIC_USERNAME" || -n "$AUTH_BASIC_PASSWORD" ]]; then
    update_env_file "AUTH_BASIC_USERNAME" "$AUTH_BASIC_USERNAME"
    update_env_file "AUTH_BASIC_PASSWORD" "$AUTH_BASIC_PASSWORD"
    echo "Basic username / password already set, skipping."
    return 0
  fi

  # keep existing credentials on re-runs
  local existing_password
  existing_password=$(get_env_value "AUTH_BASIC_PASSWORD")
  if [[ -n "$existing_password" ]]; then
    echo "Basic auth credentials already present in .env, keeping them."
    return 0
  fi

  PASSWORD=$(openssl rand -base64 16)

  update_env_file "AUTH_BASIC_USERNAME" "admin"
  update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

  # also save to a root-only file so the credentials survive scrollback
  CREDENTIALS_FILE="$SELF_HOST_DIR/CREDENTIALS.txt"
  install -m 600 /dev/null "$CREDENTIALS_FILE"
  {
    echo "Forward Email self-hosted first-time login (HTTP Basic Auth)"
    echo "Username: admin"
    echo "Password: $PASSWORD"
    echo ""
    echo "These credentials are only needed until you create your admin"
    echo "account in the web interface; you can delete this file afterwards."
  } >"$CREDENTIALS_FILE"

  echo -e "\nTo prevent unauthorized access before setup, a temporary"
  echo "Basic Auth gate has been enabled."
  echo ""
  echo "Save the following credentials for first time login:"
  echo ""
  echo "  🔑 Username: admin"
  echo "  🔑 Password: $PASSWORD"
  echo ""
  echo "(also saved to $CREDENTIALS_FILE)"
  echo ""

  if [[ "${ASSUME_YES:-false}" != "true" ]]; then
    read -rp "Press Enter to continue..." </dev/tty
  fi
}

# Check host suitability BEFORE mutating anything, so users find out about
# blockers (blocked port 25, low RAM, wrong arch) up front instead of after
# a broken install
preflight_checks() {
  echo ""
  echo "Running preflight checks..."

  local warnings=0

  # architecture
  local arch
  arch=$(uname -m)
  case "$arch" in
    x86_64|aarch64|arm64)
      echo "✅ Architecture: $arch"
      ;;
    *)
      echo "❌ Unsupported architecture: $arch (images are published for amd64 and arm64)"
      exit 1
      ;;
  esac

  # memory
  local mem_kb mem_gb
  mem_kb=$(awk '/MemTotal/ {print $2}' /proc/meminfo 2>/dev/null || echo 0)
  mem_gb=$((mem_kb / 1024 / 1024))
  if ((mem_kb == 0)); then
    echo "⚠️  Could not determine system memory."
    warnings=$((warnings + 1))
  elif ((mem_kb < 2 * 1024 * 1024)); then
    echo "⚠️  Only ${mem_gb}GB RAM detected. The full stack runs ~15 containers and"
    echo "   is very likely to crash or swap heavily below 2GB. 4GB+ is recommended."
    warnings=$((warnings + 1))
  elif ((mem_kb < 4 * 1024 * 1024)); then
    echo "⚠️  ${mem_gb}GB RAM detected — the stack will run, but 4GB+ is recommended."
    warnings=$((warnings + 1))
  else
    echo "✅ Memory: ${mem_gb}GB"
  fi

  # disk space
  local disk_free_gb
  disk_free_gb=$(df -BG --output=avail / 2>/dev/null | tail -n 1 | tr -dc '0-9' || echo 0)
  if ((disk_free_gb > 0 && disk_free_gb < 20)); then
    echo "⚠️  Only ${disk_free_gb}GB free disk space on / — 20GB+ is recommended"
    echo "   (Docker images, databases and mailboxes all live here)."
    warnings=$((warnings + 1))
  else
    echo "✅ Disk space: ${disk_free_gb}GB free"
  fi

  # required ports must be free
  local bound_ports=""
  for port in 25 80 443 465 993 995; do
    if ss -tln 2>/dev/null | awk '{print $4}' | grep -qE "[:.]${port}$"; then
      bound_ports="$bound_ports $port"
    fi
  done

  if [[ -n "$bound_ports" ]]; then
    echo "⚠️  The following required ports are already in use:$bound_ports"
    echo "   (another mail/web server running? stop it before continuing)"
    warnings=$((warnings + 1))
  else
    echo "✅ Required ports (25, 80, 443, 465, 993, 995) are free"
  fi

  # outbound port 25 — many cloud providers block it, which silently breaks
  # all outbound email
  if timeout 10 bash -c 'exec 3<>/dev/tcp/smtp.gmail.com/25' 2>/dev/null; then
    echo "✅ Outbound port 25 is open"
  else
    echo "⚠️  OUTBOUND PORT 25 APPEARS TO BE BLOCKED."
    echo "   Your server cannot deliver email directly. Most cloud providers"
    echo "   (AWS, GCP, Azure, DigitalOcean, Hetzner Cloud) block port 25 by"
    echo "   default — request an unblock from your provider, or use a host"
    echo "   that allows outbound SMTP."
    warnings=$((warnings + 1))
  fi

  # public IP detection (also used later for the DNS record summary)
  PUBLIC_IPV4=$(curl -4fsS --max-time 10 https://icanhazip.com 2>/dev/null | tr -d '[:space:]' || true)
  PUBLIC_IPV6=$(curl -6fsS --max-time 10 https://icanhazip.com 2>/dev/null | tr -d '[:space:]' || true)

  if [[ -n "$PUBLIC_IPV4" ]]; then
    echo "✅ Public IPv4: $PUBLIC_IPV4"
  else
    echo "⚠️  Could not detect a public IPv4 address."
    warnings=$((warnings + 1))
  fi
  if [[ -n "$PUBLIC_IPV6" ]]; then
    echo "✅ Public IPv6: $PUBLIC_IPV6"
  fi

  if ((warnings > 0)); then
    confirm_step "$warnings preflight warning(s) above. You can continue, but email delivery or stability may be affected."
  else
    echo "✅ All preflight checks passed."
  fi
  echo ""
}

# Print the exact DNS records the user must create, using everything the
# setup just generated (detected IPs, DKIM public key, chosen hostnames)
print_dns_summary() {
  local selector
  selector="$(get_env_value DKIM_KEY_SELECTOR)"
  selector="${selector:-default}"

  local dkim_pub=""
  if [[ -f "$SELF_HOST_DIR/ssl/dkim.key" ]]; then
    dkim_pub=$(openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER 2>/dev/null | openssl base64 -A)
  fi

  local ipv4="${PUBLIC_IPV4:-YOUR_SERVER_IPV4}"

  echo ""
  echo "==================================================================="
  echo "REQUIRED DNS RECORDS FOR $DOMAIN"
  echo "==================================================================="
  echo ""
  echo "Add these records at your DNS provider, then email will work:"
  echo ""
  echo "  ;; MX (inbound mail)"
  echo "  @        MX   10  mx.$DOMAIN."
  echo ""
  echo "  ;; A records"
  for sub in "@" mx smtp imap pop3 api caldav carddav; do
    printf '  %-8s A    %s\n' "$sub" "$ipv4"
  done
  if [[ -n "$PUBLIC_IPV6" ]]; then
    echo ""
    echo "  ;; AAAA records"
    for sub in "@" mx smtp imap pop3 api caldav carddav; do
      printf '  %-8s AAAA %s\n' "$sub" "$PUBLIC_IPV6"
    done
  fi
  echo ""
  echo "  ;; SPF (authorizes your server to send)"
  echo "  @        TXT  \"v=spf1 mx ~all\""
  echo ""
  echo "  ;; DKIM (signs your outbound mail)"
  if [[ -n "$dkim_pub" ]]; then
    echo "  ${selector}._domainkey TXT \"v=DKIM1; k=rsa; p=$dkim_pub\""
  else
    echo "  ${selector}._domainkey TXT \"v=DKIM1; k=rsa; p=<run: openssl rsa -in $SELF_HOST_DIR/ssl/dkim.key -pubout -outform DER | openssl base64 -A>\""
  fi
  echo ""
  echo "  ;; DMARC"
  echo "  _dmarc   TXT  \"v=DMARC1; p=quarantine; rua=mailto:dmarc@$DOMAIN\""
  echo ""
  echo "  ;; PTR / reverse DNS (set at your SERVER/VPS provider, not in your zone)"
  if [[ -n "$PUBLIC_IPV4" ]]; then
    echo "  $PUBLIC_IPV4 -> mx.$DOMAIN   (critical for deliverability)"
  else
    echo "  <your server IP> -> mx.$DOMAIN   (critical for deliverability)"
  fi
  echo ""
  echo "==================================================================="

  if [[ "${WAIT_DNS:-false}" == "true" ]]; then
    wait_for_dns
  fi
}

# Optionally poll until the MX record resolves so the user gets immediate
# confirmation their DNS changes took effect
wait_for_dns() {
  echo "Waiting for the MX record of $DOMAIN to resolve (checking every 15s, up to 10 minutes)..."

  local deadline=$((SECONDS + 600))
  while ((SECONDS < deadline)); do
    if dig +short MX "$DOMAIN" @1.1.1.1 2>/dev/null | grep -q "mx.$DOMAIN"; then
      echo "✅ MX record for $DOMAIN resolves."
      return 0
    fi
    sleep 15
  done

  echo "⚠️  MX record still not visible after 10 minutes — DNS propagation can"
  echo "   take a while; verify your records and check again later."
  return 0
}

# Wait for containers to come up healthy before declaring success
verify_containers_healthy() {
  echo "Waiting for services to become healthy (up to 2 minutes)..."

  local deadline=$((SECONDS + 120))
  while ((SECONDS < deadline)); do
    local unhealthy
    unhealthy=$(docker ps --filter "health=unhealthy" --format '{{.Names}}')
    local starting
    starting=$(docker ps --filter "health=starting" --format '{{.Names}}')
    local exited
    exited=$(compose -f "$DOCKER_COMPOSE_FILE" ps --status exited --format '{{.Name}}' 2>/dev/null || true)

    if [[ -z "$starting" && -z "$unhealthy" && -z "$exited" ]]; then
      echo "✅ All services are running and healthy."
      return 0
    fi

    sleep 5
  done

  echo ""
  echo "❌ Some services did not become healthy in time:"
  compose -f "$DOCKER_COMPOSE_FILE" ps
  echo ""
  echo "Check individual container logs with: docker logs <name>"
  echo "Setup log: $LOG_FILE"
  return 1
}

initial_setup() {
  preflight_checks

  confirm_step "This will replace /etc/resolv.conf with Cloudflare/Google DNS resolvers and disable systemd-resolved (a backup is saved to /etc/resolv.conf.bak-forwardemail). Set SKIP_DNS_RESOLVER_CHANGE=true to skip this."
  run_step "Updating system DNS resolvers" update_dns_resolvers

  run_step "Installing dependencies (this could take a few minutes)" install_dependencies

  confirm_step "This will enable the ufw firewall (default deny incoming) and open the ports required for email."
  run_step "Setting up firewall" setup_firewall

  run_step "Fetching self-hosting files" fetch_release_files

  # never overwrite an existing .env (re-runs would lose keys/credentials)
  if [[ ! -f "$SELF_HOST_DIR/$ENV_FILE" ]]; then
    cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "Existing $SELF_HOST_DIR/$ENV_FILE found — keeping it."
  fi

  mkdir -p "$SELF_HOST_DIR/ssl"

  run_step "Checking Docker daemon" check_docker_running

  input_custom_domain

  run_step "Updating default environment variables" update_default_env

  pin_image_tag

  choose_compose_profile

  setup_one_time_login

  echo "Generating SSL certificates for $DOMAIN..."

  choose_cert_method

  # runs outside run_step: several methods prompt on the terminal
  generate_certificates

  run_step "Generating encryption keys" generate_encryption_keys

  run_step "Updating SSL paths" update_ssl_paths

  # export env vars needed for docker compose file template strings
  export SQLITE_STORAGE_PATH="sqlite_storage" # TODO: needs to be dynamic or come from env?

  run_step "Creating database directories" create_db_directories

  migrate_sqlite_data

  # take down any previous setup
  compose -f "$DOCKER_COMPOSE_FILE" down

  echo "Spinning up necessary infrastructure..."
  compose -f "$DOCKER_COMPOSE_FILE" up -d

  verify_containers_healthy

  echo "✅ Setup completed successfully!"

  print_dns_summary

  echo -e "\nOnce your DNS records are in place, open https://$DOMAIN to finish"
  echo "setup in the browser (log in with the basic-auth credentials above)."
  echo -e "\nFull guide: https://forwardemail.net/self-hosted#configuration"
}

usage() {
  cat <<'EOF'
Forward Email Self-Hosted Setup Script

Usage: setup.sh [options]

Options:
  -d, --domain <domain>       Domain to set up (skips the interactive prompt)
      --email <email>         Email for Let's Encrypt registration
      --cert-method <method>  http | cloudflare | digitalocean | route53 | manual
      --cloudflare-ini <path> Cloudflare credentials ini (implies --cert-method cloudflare)
      --bucket <name>         S3 bucket for backups
      --action <action>       initial-setup | backups | auto-update | renew | restore
  -y, --yes                   Non-interactive: auto-confirm all prompts
      --wait-dns              After setup, poll until the MX record resolves
      --dev                   Clone the full git repository instead of
                              fetching only the self-hosting files
  -h, --help                  Show this help

Without --action an interactive menu is shown.
EOF
}

# Parse CLI flags (the script is usually run via `bash <(curl ...) [options]`)
ACTION=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    -d|--domain)
      DOMAIN="$2"
      shift 2
      ;;
    --email)
      EMAIL="$2"
      shift 2
      ;;
    --cert-method)
      CERT_METHOD="$2"
      shift 2
      ;;
    --cloudflare-ini)
      cp "$2" /root/.cloudflare.ini
      chmod 600 /root/.cloudflare.ini
      CERT_METHOD="cloudflare"
      shift 2
      ;;
    --bucket)
      BACKUP_BUCKET="$2"
      shift 2
      ;;
    --action)
      ACTION="$2"
      shift 2
      ;;
    -y|--yes)
      ASSUME_YES=true
      shift
      ;;
    --wait-dns)
      WAIT_DNS=true
      shift
      ;;
    --dev)
      DEV_MODE=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

# Main execution starts here
echo "Forward Email Self-Hosted Setup Script"
echo "======================================"

# Detect and check OS support
detect_os
check_os_support

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "This script must be run as root. Exiting."
  exit 1
fi

echo "✅ OS check passed. Proceeding with setup for $OS $OS_VERSION"
echo ""

if [[ -n "$ACTION" ]]; then
  if [[ "${ASSUME_YES:-false}" == "true" && "$ACTION" == "initial-setup" && -z "$DOMAIN" ]]; then
    echo "❌ --action initial-setup with --yes requires --domain."
    exit 1
  fi

  case "$ACTION" in
    initial-setup) prompt_command 1 ;;
    backups) prompt_command 2 ;;
    auto-update) prompt_command 3 ;;
    renew) prompt_command 4 ;;
    restore) prompt_command 5 ;;
    *)
      echo "Unknown action: $ACTION"
      usage
      exit 1
      ;;
  esac
else
  prompt_command
fi

