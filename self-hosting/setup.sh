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

ROOT_DIR="/$(whoami)/$REPO_FOLDER_NAME"
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

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

run_cmd() {
  if [[ "$DEBUG" == "true" ]]; then
    echo "+ $*" # Print the command (optional for debugging)
    "$@"
  else
    "$@" >/dev/null 2>&1
  fi
}

run_silent() {
  if [[ "$DEBUG" == "true" ]]; then
    "$@" # Run the command with output shown
  else
    "$@" >/dev/null 2>&1 || echo "Command failed: $*"
  fi
}

# Prompt user to confirm setup
prompt_command() {
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

    read -rp "Press Enter to continue or Ctrl+C to cancel..."

    initial_setup
    ;;
  2)
    echo -e "\n========================================="
    echo "Setup Backups"
    echo "========================================="
    echo -e "\nSetting up backups will create crons that will:"
    echo "* Prompt for AWS Access Key ID, Secret and Endpoint URL (if necessary)."
    echo "* Any S3 compatible option should work (e.g. AWS S3, Cloudflare R2, etc)."
    echo "* Create crons for backing up redis and mongodb."
    echo "* Note: Sqlite backups created on login, if mailbox changes (password needed for safe, encrypted mailbox backups)"
    echo -e "=========================================\n"

    read -rp "Press Enter to continue or Ctrl+C to cancel..."

    read -rp "What is the S3 ACCESS KEY ID?: " AWS_ACCESS_KEY_ID
    export AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
    update_env_file AWS_ACCESS_KEY_ID "$AWS_ACCESS_KEY_ID"

    read -rp "What is the S3 SECRET ACCESS KEY?: " AWS_SECRET_ACCESS_KEY
    export AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
    update_env_file AWS_SECRET_ACCESS_KEY "$AWS_SECRET_ACCESS_KEY"

    read -rp "Will you be using AWS S3 directly? (yes/no): " isAwsS3
    isAwsS3=$(echo "$isAwsS3" | tr '[:upper:]' '[:lower:]')
    if [[ "$isAwsS3" == "no" || "$isAwsS3" == "n" ]]; then
      read -rp "What is the S3 endpoint URL?: " AWS_ENDPOINT_URL
      export AWS_ENDPOINT_URL="$AWS_ENDPOINT_URL"
      update_env_file AWS_ENDPOINT_URL "$AWS_ENDPOINT_URL"
    fi

    set_aws_credentials
    chmod +x "$HOME"/forwardemail.net/self-hosting/scripts/backup-mongo.sh
    chmod +x "$HOME"/forwardemail.net/self-hosting/scripts/backup-redis.sh

    MONGO_BACKUP_CRON="0 0 * * * $HOME/forwardemail.net/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1"
    (crontab -l 2>/dev/null | grep -Fq "$MONGO_BACKUP_CRON") || (
      crontab -l 2>/dev/null
      echo "$MONGO_BACKUP_CRON"
    ) | crontab -

    REDIS_BACKUP_CRON="0 0 * * * $HOME/forwardemail.net/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1"
    (crontab -l 2>/dev/null | grep -Fq "$REDIS_BACKUP_CRON") || (
      crontab -l 2>/dev/null
      echo "$REDIS_BACKUP_CRON"
    ) | crontab -

    echo "✅ Backup setup complete!"
    echo "You can find the crons using: \`crontab -l\`. These will run at midnight by default."
    echo "NOTE: Please be sure to save your .env file in a safe place in the event of a restore from backup."
    ;;
  3)
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
    AUTO_UPDATE_CRON="0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1"

    if crontab -l 2>/dev/null | grep -Fq "$AUTO_UPDATE_CRON"; then
      echo "✅ Cron job is already set. No changes made."
      exit 0
    fi

    echo -e "\n========================================="
    echo "Setup Auto Updates"
    echo "========================================="
    echo "Setting up auto updates will setup a cron that will:"
    echo "* Pull the latest Docker image."
    echo "* Restart your self-hosted services using docker-compose."
    echo "* Log the output to /var/log/autoupdate.log."
    echo -e "\nOnce setup, this will run every night just after midnight (1 AM)."
    echo -e "=========================================\n"

    read -rp "Press Enter to continue or Ctrl+C to cancel..."

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
    echo "* add your .env file to the /root/.env"
    echo "* have AWS S3 compatible credentials ready"
    echo "* have backup files in forwardemail-selfhosted bucket"
    echo -e "\nOnce complete, you should have a running email setup from last checkpoint."
    echo -e "=========================================\n"

    read -rp "Press Enter to continue or Ctrl+C to cancel..."

    if [ ! -e "$ROOT_DIR/$ENV_FILE" ]; then
      echo "$ROOT_DIR/$ENV_FILE does not exist. Add .env and retry."
      exit 1
    fi

    cp "$ROOT_DIR/$ENV_FILE" "$SELF_HOST_DIR/$ENV_FILE"
    mkdir -p "$SELF_HOST_DIR/ssl"

    export_from_env_file AWS_ACCESS_KEY_ID
    export_from_env_file AWS_SECRET_ACCESS_KEY
    export_from_env_file AWS_ENDPOINT_URL
    export_from_env_file DOMAIN

    set_aws_credentials
    update_dns_resolvers
    install_dependencies
    setup_firewall
    clone_repo

    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    generate_certificates
    update_ssl_paths

    openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
    update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

    # restore redis
    LATEST_REDIS_BACKUP=$(aws s3api list-objects-v2 --bucket forwardemail-selfhosted --prefix redis-backups/ \
      --query 'Contents | sort_by(@, &LastModified) | [-1].Key' --output text)
    aws s3 cp s3://forwardemail-selfhosted/"$LATEST_REDIS_BACKUP" /tmp/dump.rdb
    mv /tmp/dump.rdb "$SELF_HOST_DIR"/redis-data/dump.rdb

    # restore mongo
    LATEST_MONGO_BACKUP=$(aws s3api list-objects-v2 --bucket forwardemail-selfhosted --prefix mongo-backups/ \
      --query 'Contents | sort_by(@, &LastModified) | [-1].Key' --output text)
    aws s3 cp s3://forwardemail-selfhosted/"$LATEST_MONGO_BACKUP" /tmp/mongo-backup.tgz
    tar -xzf /tmp/mongo-backup.tgz -C "$SELF_HOST_DIR"/mongo-backups/
    LATEST_MONGO_BACKUP_PATH=$(basename "$LATEST_MONGO_BACKUP" .tgz)

    # restore sqlite
    LATEST_SQLITE_BACKUP=$(aws s3api list-objects-v2 --bucket production-sqlite-storage \
      --query 'Contents | sort_by(@, &LastModified) | [-1].Key' --output text)
    aws s3 cp s3://production-sqlite-storage/"$LATEST_SQLITE_BACKUP" /tmp/
    mv /tmp/*sqlite* "$HOME"/forwardemail.net/sqlite-data/

    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    docker exec -i mongodb mongorestore --drop --dir /backups/"$LATEST_MONGO_BACKUP_PATH"

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
  else
    export "$1"="$(grep "^$1=" "$ENV_FILE" | cut -d'=' -f2-)"
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
    docker-compose \
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

  # Install docker-compose separately if the plugin version doesn't work
  if ! command -v docker-compose &> /dev/null; then
    apt-get install -y -q docker-compose
  fi

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
  # lots of issues with local resolvers for some cloud providers, so use cloudflare by default
  # this directly affects certbot setup and acme-challenge txt record checks
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

  local sed_flag="-i"

  # Check if the key exists in the file
  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed $sed_flag -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >>"$SELF_HOST_DIR/$ENV_FILE"
  fi
}

update_default_env() {
  update_env_file NODE_ENV production
  update_env_file HTTP_PROTOCOL https
  update_env_file SQLITE_HOST sqlite.{{DOMAIN}}
  update_env_file WEB_HOST {{DOMAIN}}
  update_env_file WEB_PORT 443
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
  update_env_file SMTP_TRANSPORT_PASS "Thisisapassword123"
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

# Generate SSL certificates and DKIM key
generate_certificates() {
  rm -rf /etc/letsencrypt/live/"$DOMAIN"*/*

  # https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.$DOMAIN

  # let's encrypt doesn't need an email because they don't send renewal notices anymore
  # https://letsencrypt.org/2025/01/22/ending-expiration-emails/
  if [[ -f "/root/.cloudflare.ini" ]]; then
    certbot certonly --dns-cloudflare --dns-cloudflare-credentials /root/.cloudflare.ini -d "$DOMAIN" -d "*.$DOMAIN" --non-interactive --agree-tos --email "$EMAIL"
  else
    certbot certonly --manual --agree-tos --preferred-challenges dns -d "*.$DOMAIN" -d "$DOMAIN" </dev/tty >/dev/tty 2>&1
  fi

  # https://certbot-dns-cloudflare.readthedocs.io/en/stable/
  # /root/.cloudflare.ini
  # dns_cloudflare_email = "your-email@example.com"
  # dns_cloudflare_api_key = "your-cloudflare-global-api-key"
  # certbot certonly --dns-cloudflare --dns-cloudflare-credentials /root/.cloudflare.ini \ -d "$DOMAIN" -d "*.$DOMAIN" --non-interactive --agree-tos --email admin@example.com

  cp /etc/letsencrypt/live/"$DOMAIN"*/* "$SELF_HOST_DIR/ssl"
}

renew_certificates() {
  input_custom_domain

  # TODO: should we check expiration of current certs?
  # /etc/letsencrypt/live/$domain*/*

  certbot certonly --manual --agree-tos --preferred-challenges dns -d "*.$DOMAIN" -d "$DOMAIN" </dev/tty >/dev/tty 2>&1

  cp /etc/letsencrypt/live/"$DOMAIN"*/* "$SELF_HOST_DIR/ssl"
}

# Generate various encryption keys
generate_encryption_keys() {
  helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
  update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

  srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
  update_env_file "SRS_SECRET" "$srs_secret"

  txt_encryption_key=$(openssl rand -hex 16)
  update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

  openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
  update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

  webhook_signature_key=$(openssl rand -hex 16)
  update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

  echo "Helper, DKIM and SRS encryption keys generated."
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

  PORTS=(22 25 80 443 465 587 993 995 2993 2995 3456 4000 5000)

  for port in "${PORTS[@]}"; do
    ufw allow "${port}/tcp" >/dev/null 2>&1
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
  else
    PASSWORD=$(openssl rand -base64 16)

    echo -e "\nTo prevent unauthorized access before setup, a temporary"
    echo "Basic Auth gate has been enabled."
    echo ""
    echo "Save the following credentials for first time login:"
    echo ""
    echo "  🔑 Username: admin"
    echo "  🔑 Password: $PASSWORD"
    echo ""

    read -rp "Press Enter to continue..."

    update_env_file "AUTH_BASIC_USERNAME" "admin"
    update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"
  fi
}

initial_setup() {
  echo "Updating system to use Cloudflare DNS..."
  run_silent update_dns_resolvers

  echo "Installing necessary dependencies, this could take a moment..."
  run_silent install_dependencies

  echo "Setting up firewall..."
  run_silent setup_firewall

  echo "Cloning repository..."
  run_silent clone_repo

  cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"
  mkdir -p "$SELF_HOST_DIR/ssl"

  run_silent check_docker_running

  input_custom_domain

  echo "Updating default environment variables..."
  run_silent update_default_env

  setup_one_time_login

  echo "Generating SSL certificates for *.$DOMAIN"

  if [[ ! -f "/root/.cloudflare.ini" ]]; then
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
"
    read -rp "Press Enter to continue or Ctrl+C to cancel..."
  fi

  run_silent generate_certificates

  echo "Generating encryption keys..."
  run_silent generate_encryption_keys

  echo "Updating SSL paths..."
  run_silent update_ssl_paths

  # export env vars needed for docker compose file template strings
  export SQLITE_STORAGE_PATH="sqlite_storage" # TODO: needs to be dynamic or come from env?

  run_silent create_db_directories

  # take down any previous setup
  docker-compose -f "$DOCKER_COMPOSE_FILE" down

  echo "Spinning up necessary infrastructure..."
  docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

  echo "✅ Setup completed successfully!"

  echo -e "\nContinue with the rest of the self hosted guide: https://forwardemail.net/self-hosted#configuration"
}

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

prompt_command

