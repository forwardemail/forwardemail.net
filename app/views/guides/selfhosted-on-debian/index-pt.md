# Guia de instalação de auto-hospedagem de e-mail para Debian {#forward-email-self-hosting-installation-guide-for-debian}

## Índice {#table-of-contents}

* [Visão geral](#overview)
* [Pré-requisitos](#prerequisites)
* [Requisitos do sistema](#system-requirements)
* [Instalação passo a passo](#step-by-step-installation)
  * [Etapa 1: Configuração inicial do sistema](#step-1-initial-system-setup)
  * [Etapa 2: Configurar resolvedores de DNS](#step-2-configure-dns-resolvers)
  * [Etapa 3: instalar dependências do sistema](#step-3-install-system-dependencies)
  * [Etapa 4: Instalar e configurar o Snapd](#step-4-install-and-configure-snapd)
  * [Etapa 5: instalar pacotes Snap](#step-5-install-snap-packages)
  * [Etapa 6: Instalar o Docker](#step-6-install-docker)
  * [Etapa 7: Configurar o serviço Docker](#step-7-configure-docker-service)
  * [Etapa 8: Instalar e configurar o firewall UFW](#step-8-install-and-configure-ufw-firewall)
  * [Etapa 9: Clonar o repositório de e-mail encaminhado](#step-9-clone-forward-email-repository)
  * [Etapa 10: Configurar o ambiente](#step-10-set-up-environment-configuration)
  * [Etapa 11: Configure seu domínio](#step-11-configure-your-domain)
  * [Etapa 12: Gerar certificados SSL](#step-12-generate-ssl-certificates)
  * [Etapa 13: Gerar chaves de criptografia](#step-13-generate-encryption-keys)
  * [Etapa 14: Atualizar caminhos SSL na configuração](#step-14-update-ssl-paths-in-configuration)
  * [Etapa 15: Configurar autenticação básica](#step-15-set-up-basic-authentication)
  * [Etapa 16: Implantar com o Docker Compose](#step-16-deploy-with-docker-compose)
  * [Etapa 17: Verificar instalação](#step-17-verify-installation)
* [Configuração pós-instalação](#post-installation-configuration)
  * [Configuração de registros DNS](#dns-records-setup)
  * [Primeiro Login](#first-login)
* [Configuração de backup](#backup-configuration)
  * [Configurar backup compatível com S3](#set-up-s3-compatible-backup)
  * [Configurar tarefas de backup do Cron](#set-up-backup-cron-jobs)
* [Configuração de atualização automática](#auto-update-configuration)
* [Considerações específicas do Debian](#debian-specific-considerations)
  * [Diferenças no gerenciamento de pacotes](#package-management-differences)
  * [Gestão de Serviços](#service-management)
  * [Configuração de rede](#network-configuration)
* [Manutenção e Monitoramento](#maintenance-and-monitoring)
  * [Locais de registro](#log-locations)
  * [Tarefas regulares de manutenção](#regular-maintenance-tasks)
  * [Renovação de Certificado](#certificate-renewal)
* [Solução de problemas](#troubleshooting)
  * [Problemas específicos do Debian](#debian-specific-issues)
  * [Problemas comuns](#common-issues)
  * [Obtendo ajuda](#getting-help)
* [Melhores práticas de segurança](#security-best-practices)
* [Conclusão](#conclusion)

## Visão geral {#overview}

Este guia fornece instruções passo a passo para instalar a solução auto-hospedada da Forward Email em sistemas Debian. Este guia foi desenvolvido especificamente para Debian 11 (Bullseye) e Debian 12 (Bookworm).

## Pré-requisitos {#prerequisites}

Antes de iniciar a instalação, certifique-se de ter:

* **Servidor Debian**: Versão 11 (Bullseye) ou 12 (Bookworm)
* **Acesso Root**: Você deve conseguir executar comandos como root (acesso sudo)
* **Nome de Domínio**: Um domínio que você controla com acesso de gerenciamento de DNS
* **Servidor Limpo**: Recomenda-se usar uma instalação Debian nova
* **Conexão com a Internet**: Necessária para baixar pacotes e imagens Docker

## Requisitos do sistema {#system-requirements}

* **RAM**: Mínimo de 2 GB (4 GB recomendados para produção)
* **Armazenamento**: Mínimo de 20 GB de espaço disponível (50 GB ou mais recomendados para produção)
* **CPU**: Mínimo de 1 vCPU (2 ou mais vCPUs recomendadas para produção)
* **Rede**: Endereço IP público com as seguintes portas acessíveis:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Instalação passo a passo {#step-by-step-installation}

### Etapa 1: Configuração inicial do sistema {#step-1-initial-system-setup}

Primeiro, certifique-se de que seu sistema esteja atualizado e mude para o usuário root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Etapa 2: Configurar resolvedores DNS {#step-2-configure-dns-resolvers}

Configure seu sistema para usar os servidores DNS da Cloudflare para geração confiável de certificados:

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

### Etapa 3: Instalar dependências do sistema {#step-3-install-system-dependencies}

Instale os pacotes necessários para o Forward Email no Debian:

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

### Etapa 4: Instalar e configurar o Snapd {#step-4-install-and-configure-snapd}

O Debian não inclui o snapd por padrão, então precisamos instalá-lo e configurá-lo:

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

### Etapa 5: Instalar pacotes Snap {#step-5-install-snap-packages}

Instale o AWS CLI e o Certbot via snap:

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

### Etapa 6: Instalar o Docker {#step-6-install-docker}

Instale o Docker CE e o Docker Compose no Debian:

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

### Etapa 7: Configurar o serviço Docker {#step-7-configure-docker-service}

Certifique-se de que o Docker inicie automaticamente e esteja em execução:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Se o Docker não iniciar, tente iniciá-lo manualmente:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Etapa 8: Instalar e configurar o Firewall UFW {#step-8-install-and-configure-ufw-firewall}

As instalações mínimas do Debian podem não incluir o UFW, então instale-o primeiro:

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

### Etapa 9: Clonar o repositório de e-mail de encaminhamento {#step-9-clone-forward-email-repository}

Baixe o código fonte do Forward Email:

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

### Etapa 10: Definir a configuração do ambiente {#step-10-set-up-environment-configuration}

Preparar a configuração do ambiente:

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

### Etapa 11: Configure seu domínio {#step-11-configure-your-domain}

Defina seu nome de domínio e atualize as variáveis de ambiente:

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

### Etapa 12: Gerar certificados SSL {#step-12-generate-ssl-certificates}

#### Opção A: Desafio DNS manual (recomendado para a maioria dos usuários) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Importante**: Quando solicitado, você precisará criar registros TXT no seu DNS. Você poderá ver vários desafios para o mesmo domínio - **crie TODOS eles**. Não remova o primeiro registro TXT ao adicionar o segundo.

#### Opção B: DNS Cloudflare (se você usar Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Se o seu domínio usa o Cloudflare para DNS, você pode automatizar a geração de certificados:

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

#### Copiar Certificados {#copy-certificates}

Após a geração do certificado, copie-o para o diretório do aplicativo:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Etapa 13: Gerar chaves de criptografia {#step-13-generate-encryption-keys}

Crie as várias chaves de criptografia necessárias para uma operação segura:

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

### Etapa 14: Atualizar caminhos SSL na configuração {#step-14-update-ssl-paths-in-configuration}

Configure os caminhos do certificado SSL no arquivo de ambiente:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Etapa 15: Configurar autenticação básica {#step-15-set-up-basic-authentication}

Crie credenciais de autenticação básica temporárias:

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

### Etapa 16: Implantar com o Docker Compose {#step-16-deploy-with-docker-compose}

Inicie todos os serviços de encaminhamento de e-mail:

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

### Etapa 17: Verificar instalação {#step-17-verify-installation}

Verifique se todos os serviços estão sendo executados corretamente:

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

## Configuração pós-instalação {#post-installation-configuration}

### Configuração de registros DNS {#dns-records-setup}

Você precisa configurar os seguintes registros DNS para seu domínio:

#### Registro MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Um registro {#a-records}

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

#### Registro SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### Registro DKIM {#dkim-record}

Obtenha sua chave pública DKIM:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Criar registro DNS DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Registro DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Primeiro login {#first-login}

1. Abra seu navegador e navegue até `https://yourdomain.com`
2. Insira as credenciais básicas de autenticação que você salvou anteriormente
3. Conclua o assistente de configuração inicial
4. Crie sua primeira conta de e-mail

## Configuração de backup {#backup-configuration}

### Configurar backup compatível com S3 {#set-up-s3-compatible-backup}

Configurar backups automatizados para armazenamento compatível com S3:

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

### Configurar tarefas Cron de backup {#set-up-backup-cron-jobs}

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

## Configuração de atualização automática {#auto-update-configuration}

Configure atualizações automáticas para sua instalação do Forward Email:

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

## Considerações específicas do Debian {#debian-specific-considerations}

### Diferenças no gerenciamento de pacotes {#package-management-differences}

* **Snapd**: Não instalado por padrão no Debian, requer instalação manual
* **Docker**: Utiliza repositórios específicos do Debian e chaves GPG
* **UFW**: Pode não estar incluído em instalações mínimas do Debian
* **systemd**: O comportamento pode ser ligeiramente diferente do Ubuntu

### Gerenciamento de Serviços {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Configuração de rede {#network-configuration}

O Debian pode ter diferentes nomes ou configurações de interface de rede:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Manutenção e Monitoramento {#maintenance-and-monitoring}

### Locais de registro {#log-locations}

* **Registros do Docker Compose**: Use o comando docker compose apropriado com base na instalação
* **Registros do sistema**: `/var/log/syslog`
* **Registros de backup**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Registros de atualização automática**: `/var/log/autoupdate.log`
* **Registros do Snapd**: `journalctl -u snapd`

### Tarefas regulares de manutenção {#regular-maintenance-tasks}

1. **Monitorar o espaço em disco**: `df -h`
2. **Verificar o status do serviço**: Usar o comando docker compose apropriado
3. **Revisar os logs**: Verificar os logs do aplicativo e do sistema
4. **Atualizar os pacotes do sistema**: `apt update && apt upgrade`
5. **Monitorar o snapd**: `snap list` e `snap refresh`

### Renovação do Certificado {#certificate-renewal}

Os certificados devem ser renovados automaticamente, mas você pode renová-los manualmente, se necessário:

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

## Solução de problemas {#troubleshooting}

### Problemas específicos do Debian {#debian-specific-issues}

#### 1. Snapd não está funcionando {#1-snapd-not-working}

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

#### 2. Comando Docker Compose não encontrado {#2-docker-compose-command-not-found}

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

#### 3. Problemas de instalação do pacote {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Problemas comuns {#common-issues}

#### 1. O serviço Docker não inicia {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Falha na geração do certificado {#2-certificate-generation-fails}

* Certifique-se de que as portas 80 e 443 estejam acessíveis
* Verifique se os registros DNS apontam para o seu servidor
* Verifique as configurações do firewall com `ufw status`

#### 3. Problemas de entrega de e-mail {#3-email-delivery-issues}

* Verifique se os registros MX estão corretos
* Verifique os registros SPF, DKIM e DMARC
* Certifique-se de que a porta 25 não esteja bloqueada pelo seu provedor de hospedagem

### Obtendo ajuda {#getting-help}

* **Documentação**: <https://forwardemail.net/self-hosted>
* **Problemas no GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Documentação do Debian**: <https://www.debian.org/doc/>

## Melhores práticas de segurança {#security-best-practices}

1. **Mantenha o sistema atualizado**: atualize o Debian e os pacotes regularmente
2. **Monitore os logs**: configure o monitoramento de logs e alertas
3. **Faça backups regularmente**: teste os procedimentos de backup e restauração
4. **Use senhas fortes**: gere senhas fortes para todas as contas
5. **Habilite o Fail2Ban**: considere instalar o fail2ban para segurança adicional
6. **Auditorias de segurança regulares**: revise sua configuração periodicamente
7. **Monitore o Snapd**: mantenha os pacotes snap atualizados com `snap refresh`

## Conclusão {#conclusion}

A instalação auto-hospedada do Forward Email agora deve estar concluída e em execução no Debian. Lembre-se de:

1. Configure seus registros DNS corretamente
2. Teste o envio e o recebimento de e-mails
3. Configure backups regulares
4. Monitore seu sistema regularmente
5. Mantenha sua instalação atualizada
6. Monitore os pacotes snapd e snap

As principais diferenças em relação ao Ubuntu são a instalação do snapd e a configuração do repositório Docker. Uma vez configuradas corretamente, o aplicativo Forward Email se comporta de forma idêntica em ambos os sistemas.

Para opções de configuração adicionais e recursos avançados, consulte a documentação oficial do Forward Email em <https://forwardemail.net/self-hosted#configuration>.