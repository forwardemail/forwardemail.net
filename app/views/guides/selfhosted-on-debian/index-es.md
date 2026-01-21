# Guía de instalación de autohospedaje de correo electrónico de reenvío para Debian {#forward-email-self-hosting-installation-guide-for-debian}

## Tabla de contenido {#table-of-contents}

* [Descripción general](#overview)
* [Prerrequisitos](#prerequisites)
* [Requisitos del sistema](#system-requirements)
* [Instalación paso a paso](#step-by-step-installation)
  * [Paso 1: Configuración inicial del sistema](#step-1-initial-system-setup)
  * [Paso 2: Configurar los solucionadores de DNS](#step-2-configure-dns-resolvers)
  * [Paso 3: Instalar las dependencias del sistema](#step-3-install-system-dependencies)
  * [Paso 4: Instalar y configurar Snapd](#step-4-install-and-configure-snapd)
  * [Paso 5: Instalar paquetes Snap](#step-5-install-snap-packages)
  * [Paso 6: Instalar Docker](#step-6-install-docker)
  * [Paso 7: Configurar el servicio Docker](#step-7-configure-docker-service)
  * [Paso 8: Instalar y configurar el firewall UFW](#step-8-install-and-configure-ufw-firewall)
  * [Paso 9: Clonar el repositorio de correo electrónico de reenvío](#step-9-clone-forward-email-repository)
  * [Paso 10: Configurar la configuración del entorno](#step-10-set-up-environment-configuration)
  * [Paso 11: Configura tu dominio](#step-11-configure-your-domain)
  * [Paso 12: Generar certificados SSL](#step-12-generate-ssl-certificates)
  * [Paso 13: Generar claves de cifrado](#step-13-generate-encryption-keys)
  * [Paso 14: Actualizar las rutas SSL en la configuración](#step-14-update-ssl-paths-in-configuration)
  * [Paso 15: Configurar la autenticación básica](#step-15-set-up-basic-authentication)
  * [Paso 16: Implementar con Docker Compose](#step-16-deploy-with-docker-compose)
  * [Paso 17: Verificar la instalación](#step-17-verify-installation)
* [Configuración posterior a la instalación](#post-installation-configuration)
  * [Configuración de registros DNS](#dns-records-setup)
  * [Primer inicio de sesión](#first-login)
* [Configuración de respaldo](#backup-configuration)
  * [Configurar una copia de seguridad compatible con S3](#set-up-s3-compatible-backup)
  * [Configurar trabajos cron de respaldo](#set-up-backup-cron-jobs)
* [Configuración de actualización automática](#auto-update-configuration)
* [Consideraciones específicas de Debian](#debian-specific-considerations)
  * [Diferencias en la gestión de paquetes](#package-management-differences)
  * [Gestión de servicios](#service-management)
  * [Configuración de red](#network-configuration)
* [Mantenimiento y Monitoreo](#maintenance-and-monitoring)
  * [Ubicaciones de registros](#log-locations)
  * [Tareas de mantenimiento regulares](#regular-maintenance-tasks)
  * [Renovación de certificado](#certificate-renewal)
* [Solución de problemas](#troubleshooting)
  * [Problemas específicos de Debian](#debian-specific-issues)
  * [Problemas comunes](#common-issues)
  * [Obtener ayuda](#getting-help)
* [Mejores prácticas de seguridad](#security-best-practices)
* [Conclusión](#conclusion)

## Descripción general {#overview}

Esta guía proporciona instrucciones paso a paso para instalar la solución autoalojada de Forward Email en sistemas Debian. Está diseñada específicamente para Debian 11 (Bullseye) y Debian 12 (Bookworm).

## Requisitos previos {#prerequisites}

Antes de comenzar la instalación, asegúrese de tener:

* **Servidor Debian**: Versión 11 (Bullseye) o 12 (Bookworm)
* **Acceso root**: Debe poder ejecutar comandos como root (acceso sudo)
* **Nombre de dominio**: Un dominio que usted controla con acceso de administración DNS
* **Servidor limpio**: Se recomienda usar una instalación nueva de Debian
* **Conexión a Internet**: Necesaria para descargar paquetes e imágenes de Docker

## Requisitos del sistema {#system-requirements}

* **RAM**: Mínimo 2 GB (se recomiendan 4 GB para producción)
* **Almacenamiento**: Mínimo 20 GB de espacio disponible (se recomiendan más de 50 GB para producción)
* **CPU**: Mínimo 1 vCPU (se recomiendan más de 2 vCPU para producción)
* **Red**: Dirección IP pública con los siguientes puertos accesibles:
* 22 (SSH)
* 25 (SMTP)
* 80 (HTTP)
* 443 (HTTPS)
* 465 (SMTPS)
* 993 (IMAPS)
* 995 (POP3S)

## Instalación paso a paso {#step-by-step-installation}

### Paso 1: Configuración inicial del sistema {#step-1-initial-system-setup}

Primero, asegúrese de que su sistema esté actualizado y cambie al usuario root:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Switch to root user (required for the installation)
sudo su -
```

### Paso 2: Configurar los solucionadores de DNS {#step-2-configure-dns-resolvers}

Configure su sistema para utilizar los servidores DNS de Cloudflare para la generación confiable de certificados:

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

### Paso 3: Instalar las dependencias del sistema {#step-3-install-system-dependencies}

Instale los paquetes necesarios para reenviar correo electrónico en Debian:

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

### Paso 4: Instalar y configurar Snapd {#step-4-install-and-configure-snapd}

Debian no incluye snapd por defecto, por lo que necesitamos instalarlo y configurarlo:

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

### Paso 5: Instalar paquetes Snap {#step-5-install-snap-packages}

Instalar AWS CLI y Certbot mediante snap:

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

### Paso 6: Instalar Docker {#step-6-install-docker}

Instalar Docker CE y Docker Compose en Debian:

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

### Paso 7: Configurar el servicio Docker {#step-7-configure-docker-service}

Asegúrese de que Docker se inicie automáticamente y esté en ejecución:

```bash
# Enable and start Docker service
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verify Docker is running
docker info
```

Si Docker no se inicia, intenta iniciarlo manualmente:

```bash
# Alternative startup method if systemctl fails
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Paso 8: Instalar y configurar el firewall UFW {#step-8-install-and-configure-ufw-firewall}

Es posible que las instalaciones mínimas de Debian no incluyan UFW, así que instálelo primero:

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

### Paso 9: Clonar el repositorio de correo electrónico de reenvío {#step-9-clone-forward-email-repository}

Descargue el código fuente de Forward Email:

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

### Paso 10: Configurar la configuración del entorno {#step-10-set-up-environment-configuration}

Preparar la configuración del entorno:

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

### Paso 11: Configure su dominio {#step-11-configure-your-domain}

Establezca su nombre de dominio y actualice las variables de entorno:

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

### Paso 12: Generar certificados SSL {#step-12-generate-ssl-certificates}

#### Opción A: Desafío DNS manual (recomendado para la mayoría de los usuarios) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Importante**: Cuando se te solicite, deberás crear registros TXT en tu DNS. Es posible que veas varios desafíos para el mismo dominio: **créalos TODOS**. No elimines el primer registro TXT al agregar el segundo.

#### Opción B: DNS de Cloudflare (si usa Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Si su dominio utiliza Cloudflare para DNS, puede automatizar la generación de certificados:

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

#### Copiar certificados {#copy-certificates}

Después de generar el certificado, cópielo al directorio de la aplicación:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Paso 13: Generar claves de cifrado {#step-13-generate-encryption-keys}

Cree las distintas claves de cifrado necesarias para una operación segura:

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

### Paso 14: Actualizar las rutas SSL en la configuración {#step-14-update-ssl-paths-in-configuration}

Configure las rutas del certificado SSL en el archivo de entorno:

```bash
# Update SSL paths to point to the correct certificate files
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Paso 15: Configurar la autenticación básica {#step-15-set-up-basic-authentication}

Crear credenciales de autenticación básica temporales:

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

### Paso 16: Implementar con Docker Compose {#step-16-deploy-with-docker-compose}

Inicie todos los servicios de reenvío de correo electrónico:

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

### Paso 17: Verificar la instalación {#step-17-verify-installation}

Compruebe que todos los servicios se estén ejecutando correctamente:

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

## Configuración posterior a la instalación {#post-installation-configuration}

### Configuración de registros DNS {#dns-records-setup}

Necesita configurar los siguientes registros DNS para su dominio:

#### Registro MX {#mx-record}

```
@ MX 10 mx.yourdomain.com
```

#### Registros A {#a-records}

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

Obtenga su clave pública DKIM:

```bash
# Extract DKIM public key
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Crear registro DNS DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Registro DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Primer inicio de sesión {#first-login}

1. Abra su navegador web y navegue hasta `https://yourdomain.com`
2. Ingrese las credenciales de autenticación básicas que guardó anteriormente
3. Complete el asistente de configuración inicial
4. Cree su primera cuenta de correo electrónico

## Configuración de respaldo {#backup-configuration}

### Configurar copia de seguridad compatible con S3 {#set-up-s3-compatible-backup}

Configure copias de seguridad automatizadas en almacenamiento compatible con S3:

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

### Configurar trabajos cron de respaldo {#set-up-backup-cron-jobs}

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

## Configuración de actualización automática {#auto-update-configuration}

Configure actualizaciones automáticas para su instalación de Forward Email:

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

## Consideraciones específicas de Debian {#debian-specific-considerations}

### Diferencias en la gestión de paquetes {#package-management-differences}

* **Snapd**: No se instala por defecto en Debian; requiere instalación manual.
* **Docker**: Utiliza repositorios específicos de Debian y claves GPG.
* **UFW**: Puede no estar incluido en instalaciones mínimas de Debian.
* **systemd**: Su comportamiento puede ser ligeramente diferente al de Ubuntu.

### Gestión de servicios {#service-management}

```bash
# Check service status (Debian-specific commands)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Restart services if needed
systemctl restart snapd
systemctl restart docker
```

### Configuración de red {#network-configuration}

Debian puede tener diferentes nombres o configuraciones de interfaz de red:

```bash
# Check network interfaces
ip addr show

# Check routing
ip route show

# Check DNS resolution
nslookup google.com
```

## Mantenimiento y Monitoreo {#maintenance-and-monitoring}

### Ubicaciones de registro {#log-locations}

* **Registros de Docker Compose**: Use el comando de Docker Compose adecuado según la instalación
* **Registros del sistema**: `/var/log/syslog`
* **Registros de copias de seguridad**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Registros de actualización automática**: `/var/log/autoupdate.log`
* **Registros de Snapd**: `journalctl -u snapd`

### Tareas de mantenimiento regular {#regular-maintenance-tasks}

1. **Supervisar el espacio en disco**: `df -h`
2. **Verificar el estado del servicio**: Usar el comando docker compose adecuado
3. **Revisar registros**: Verificar los registros de la aplicación y del sistema
4. **Actualizar paquetes del sistema**: `apt update && apt upgrade`
5. **Supervisar snapd**: `snap list` y `snap refresh`

### Renovación de certificado {#certificate-renewal}

Los certificados deben renovarse automáticamente, pero puedes renovarlos manualmente si es necesario:

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

## Solución de problemas {#troubleshooting}

### Problemas específicos de Debian {#debian-specific-issues}

#### 1. Snapd no funciona {#1-snapd-not-working}

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

#### 2. Comando Docker Compose no encontrado {#2-docker-compose-command-not-found}

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

#### 3. Problemas de instalación del paquete {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Problemas comunes {#common-issues}

#### 1. El servicio Docker no se inicia {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Error en la generación del certificado {#2-certificate-generation-fails}

* Asegúrese de que los puertos 80 y 443 sean accesibles
* Verifique que los registros DNS apunten a su servidor
* Verifique la configuración del firewall con `ufw status`

#### 3. Problemas de entrega de correo electrónico {#3-email-delivery-issues}

* Verificar que los registros MX sean correctos
* Verificar los registros SPF, DKIM y DMARC
* Asegurarse de que el puerto 25 no esté bloqueado por el proveedor de hosting

### Obtención de ayuda {#getting-help}

* **Documentación**: <https://forwardemail.net/self-hosted>
* **Problemas de GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Documentación de Debian**: <https://www.debian.org/doc/>

## Mejores prácticas de seguridad {#security-best-practices}

1. **Mantenga el sistema actualizado**: Actualice Debian y sus paquetes regularmente
2. **Supervise los registros**: Configure la monitorización y las alertas de registros
3. **Realice copias de seguridad regularmente**: Pruebe los procedimientos de copia de seguridad y restauración
4. **Use contraseñas seguras**: Genere contraseñas seguras para todas las cuentas
5. **Habilite Fail2Ban**: Considere instalar Fail2ban para mayor seguridad
6. **Auditorías de seguridad regulares**: Revise periódicamente su configuración
7. **Supervise Snapd**: Mantenga los paquetes Snap actualizados con `snap refresh`

## Conclusión {#conclusion}

Su instalación autoalojada de Forward Email ya debería estar completa y funcionando en Debian. Recuerde:

1. Configura tus registros DNS correctamente
2. Prueba el envío y la recepción de correos electrónicos
3. Configura copias de seguridad periódicas
4. Supervisa tu sistema periódicamente
5. Mantén tu instalación actualizada
6. Supervisa snapd y los paquetes snap

Las principales diferencias con Ubuntu son la instalación de snapd y la configuración del repositorio de Docker. Una vez configurados correctamente, la aplicación Reenvío de correo electrónico funciona de forma idéntica en ambos sistemas.

Para obtener opciones de configuración adicionales y funciones avanzadas, consulte la documentación oficial de Reenvío de correo electrónico en <https://forwardemail.net/self-hosted#configuration>.