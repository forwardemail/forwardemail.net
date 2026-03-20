# Guía de Instalación de Forward Email Autoalojado para Debian {#forward-email-self-hosting-installation-guide-for-debian}


## Tabla de Contenidos {#table-of-contents}

* [Resumen](#overview)
* [Requisitos Previos](#prerequisites)
* [Requisitos del Sistema](#system-requirements)
* [Instalación Paso a Paso](#step-by-step-installation)
  * [Paso 1: Configuración Inicial del Sistema](#step-1-initial-system-setup)
  * [Paso 2: Configurar Resolutores DNS](#step-2-configure-dns-resolvers)
  * [Paso 3: Instalar Dependencias del Sistema](#step-3-install-system-dependencies)
  * [Paso 4: Instalar y Configurar Snapd](#step-4-install-and-configure-snapd)
  * [Paso 5: Instalar Paquetes Snap](#step-5-install-snap-packages)
  * [Paso 6: Instalar Docker](#step-6-install-docker)
  * [Paso 7: Configurar el Servicio Docker](#step-7-configure-docker-service)
  * [Paso 8: Instalar y Configurar el Firewall UFW](#step-8-install-and-configure-ufw-firewall)
  * [Paso 9: Clonar el Repositorio de Forward Email](#step-9-clone-forward-email-repository)
  * [Paso 10: Configurar el Entorno](#step-10-set-up-environment-configuration)
  * [Paso 11: Configurar Tu Dominio](#step-11-configure-your-domain)
  * [Paso 12: Generar Certificados SSL](#step-12-generate-ssl-certificates)
  * [Paso 13: Generar Claves de Encriptación](#step-13-generate-encryption-keys)
  * [Paso 14: Actualizar Rutas SSL en la Configuración](#step-14-update-ssl-paths-in-configuration)
  * [Paso 15: Configurar Autenticación Básica](#step-15-set-up-basic-authentication)
  * [Paso 16: Desplegar con Docker Compose](#step-16-deploy-with-docker-compose)
  * [Paso 17: Verificar la Instalación](#step-17-verify-installation)
* [Configuración Post-Instalación](#post-installation-configuration)
  * [Configuración de Registros DNS](#dns-records-setup)
  * [Primer Inicio de Sesión](#first-login)
* [Configuración de Copias de Seguridad](#backup-configuration)
  * [Configurar Copias de Seguridad Compatibles con S3](#set-up-s3-compatible-backup)
  * [Configurar Tareas Cron para Copias de Seguridad](#set-up-backup-cron-jobs)
* [Configuración de Actualización Automática](#auto-update-configuration)
* [Consideraciones Específicas para Debian](#debian-specific-considerations)
  * [Diferencias en la Gestión de Paquetes](#package-management-differences)
  * [Gestión de Servicios](#service-management)
  * [Configuración de Red](#network-configuration)
* [Mantenimiento y Monitoreo](#maintenance-and-monitoring)
  * [Ubicaciones de Logs](#log-locations)
  * [Tareas Regulares de Mantenimiento](#regular-maintenance-tasks)
  * [Renovación de Certificados](#certificate-renewal)
* [Solución de Problemas](#troubleshooting)
  * [Problemas Específicos de Debian](#debian-specific-issues)
  * [Problemas Comunes](#common-issues)
  * [Obtener Ayuda](#getting-help)
* [Mejores Prácticas de Seguridad](#security-best-practices)
* [Conclusión](#conclusion)


## Resumen {#overview}

Esta guía proporciona instrucciones paso a paso para instalar la solución autoalojada de Forward Email en sistemas Debian. Esta guía está específicamente diseñada para Debian 11 (Bullseye) y Debian 12 (Bookworm).


## Requisitos Previos {#prerequisites}

Antes de comenzar la instalación, asegúrate de tener:

* **Servidor Debian**: Versión 11 (Bullseye) o 12 (Bookworm)
* **Acceso Root**: Debes poder ejecutar comandos como root (acceso sudo)
* **Nombre de Dominio**: Un dominio que controles con acceso a la gestión DNS
* **Servidor Limpio**: Se recomienda usar una instalación fresca de Debian
* **Conexión a Internet**: Necesaria para descargar paquetes e imágenes Docker


## Requisitos del Sistema {#system-requirements}

* **RAM**: Mínimo 2GB (4GB recomendado para producción)
* **Almacenamiento**: Mínimo 20GB de espacio disponible (50GB+ recomendado para producción)
* **CPU**: 1 vCPU mínimo (2+ vCPUs recomendado para producción)
* **Red**: Dirección IP pública con los siguientes puertos accesibles:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Instalación Paso a Paso {#step-by-step-installation}

### Paso 1: Configuración Inicial del Sistema {#step-1-initial-system-setup}

Primero, asegúrate de que tu sistema esté actualizado y cambia al usuario root:

```bash
# Actualizar paquetes del sistema
sudo apt update && sudo apt upgrade -y

# Cambiar a usuario root (requerido para la instalación)
sudo su -
```
### Paso 2: Configurar los Resolutores DNS {#step-2-configure-dns-resolvers}

Configure su sistema para usar los servidores DNS de Cloudflare para una generación confiable de certificados:

```bash
# Detener y deshabilitar systemd-resolved si está en ejecución
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Configurar los resolutores DNS de Cloudflare
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

### Paso 3: Instalar Dependencias del Sistema {#step-3-install-system-dependencies}

Instale los paquetes requeridos para Forward Email en Debian:

```bash
# Actualizar la lista de paquetes
apt-get update -y

# Instalar dependencias básicas (lista de paquetes específica para Debian)
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

### Paso 4: Instalar y Configurar Snapd {#step-4-install-and-configure-snapd}

Debian no incluye snapd por defecto, por lo que necesitamos instalarlo y configurarlo:

```bash
# Instalar snapd
apt-get install -y snapd

# Habilitar e iniciar el servicio snapd
systemctl enable snapd
systemctl start snapd

# Crear enlace simbólico para que snap funcione correctamente
ln -sf /var/lib/snapd/snap /snap

# Esperar a que snapd esté listo
sleep 10

# Verificar que snapd esté funcionando
snap version
```

### Paso 5: Instalar Paquetes Snap {#step-5-install-snap-packages}

Instale AWS CLI y Certbot vía snap:

```bash
# Instalar AWS CLI
snap install aws-cli --classic

# Instalar Certbot y el plugin DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Verificar instalaciones
aws --version
certbot --version
```

### Paso 6: Instalar Docker {#step-6-install-docker}

Instale Docker CE y Docker Compose en Debian:

```bash
# Añadir la clave GPG oficial de Docker (específico para Debian)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Añadir el repositorio de Docker (específico para Debian)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Actualizar índice de paquetes e instalar Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Instalar docker-compose independiente como respaldo (si el plugin no funciona)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Verificar instalación de Docker
docker --version
docker compose version || docker-compose --version
```

### Paso 7: Configurar el Servicio Docker {#step-7-configure-docker-service}

Asegúrese de que Docker se inicie automáticamente y esté en ejecución:

```bash
# Habilitar e iniciar el servicio Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verificar que Docker esté en ejecución
docker info
```

Si Docker falla al iniciar, intente iniciarlo manualmente:

```bash
# Método alternativo de inicio si systemctl falla
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Paso 8: Instalar y Configurar el Cortafuegos UFW {#step-8-install-and-configure-ufw-firewall}

Las instalaciones mínimas de Debian pueden no incluir UFW, así que instálelo primero:

```bash
# Instalar UFW si no está presente
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Establecer políticas predeterminadas
ufw default deny incoming
ufw default allow outgoing

# Permitir SSH (importante - ¡no se bloquee a sí mismo!)
ufw allow 22/tcp

# Permitir puertos relacionados con correo electrónico
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (para Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (puerto alternativo)
ufw allow 2995/tcp  # POP3 (puerto alternativo)
ufw allow 3456/tcp  # Puerto de servicio personalizado
ufw allow 4000/tcp  # Puerto de servicio personalizado
ufw allow 5000/tcp  # Puerto de servicio personalizado

# Permitir conexiones locales a bases de datos
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Habilitar el cortafuegos
echo "y" | ufw enable

# Verificar estado del cortafuegos
ufw status numbered
```
### Paso 9: Clonar el Repositorio de Forward Email {#step-9-clone-forward-email-repository}

Descarga el código fuente de Forward Email:

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

### Paso 10: Configurar la Configuración del Entorno {#step-10-set-up-environment-configuration}

Prepara la configuración del entorno:

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

### Paso 11: Configura Tu Dominio {#step-11-configure-your-domain}

Establece el nombre de tu dominio y actualiza las variables de entorno:

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

### Paso 12: Generar Certificados SSL {#step-12-generate-ssl-certificates}

#### Opción A: Desafío DNS Manual (Recomendado para la mayoría de usuarios) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Importante**: Cuando se te solicite, deberás crear registros TXT en tu DNS. Puede que veas múltiples desafíos para el mismo dominio - **crea TODOS ellos**. No elimines el primer registro TXT al añadir el segundo.

#### Opción B: DNS de Cloudflare (Si usas Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Si tu dominio usa Cloudflare para DNS, puedes automatizar la generación de certificados:

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

Después de generar los certificados, cópialos al directorio de la aplicación:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Paso 13: Generar Claves de Encriptación {#step-13-generate-encryption-keys}

Crea las diversas claves de encriptación necesarias para una operación segura:

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
### Paso 14: Actualizar rutas SSL en la configuración {#step-14-update-ssl-paths-in-configuration}

Configure las rutas del certificado SSL en el archivo de entorno:

```bash
# Actualizar rutas SSL para apuntar a los archivos de certificado correctos
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Paso 15: Configurar autenticación básica {#step-15-set-up-basic-authentication}

Cree credenciales temporales para la autenticación básica:

```bash
# Generar una contraseña segura aleatoria
PASSWORD=$(openssl rand -base64 16)

# Actualizar archivo de entorno con credenciales de autenticación básica
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Mostrar credenciales (¡guárdelas!)
echo ""
echo "🔐 IMPORTANTE: ¡Guarde estas credenciales de acceso!"
echo "=================================="
echo "Usuario: admin"
echo "Contraseña: $PASSWORD"
echo "=================================="
echo ""
echo "Necesitará estas para acceder a la interfaz web después de la instalación."
echo ""
```

### Paso 16: Desplegar con Docker Compose {#step-16-deploy-with-docker-compose}

Inicie todos los servicios de Forward Email:

```bash
# Establecer ruta del archivo Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Detener cualquier contenedor existente
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Descargar las imágenes más recientes
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Iniciar todos los servicios en modo desacoplado
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Esperar un momento para que los servicios inicien
sleep 10

# Verificar estado de los servicios
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Paso 17: Verificar la instalación {#step-17-verify-installation}

Verifique que todos los servicios estén funcionando correctamente:

```bash
# Verificar contenedores Docker
docker ps

# Revisar los logs de los servicios para detectar errores
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Probar conectividad de la interfaz web
curl -I https://$DOMAIN

# Verificar si los puertos están escuchando
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Configuración posterior a la instalación {#post-installation-configuration}

### Configuración de registros DNS {#dns-records-setup}

Debe configurar los siguientes registros DNS para su dominio:

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
# Extraer clave pública DKIM
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Cree el registro DNS DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=YOUR_DKIM_PUBLIC_KEY"
```

#### Registro DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com"
```

### Primer inicio de sesión {#first-login}

1. Abra su navegador web y navegue a `https://yourdomain.com`
2. Ingrese las credenciales de autenticación básica que guardó anteriormente
3. Complete el asistente de configuración inicial
4. Cree su primera cuenta de correo electrónico


## Configuración de respaldo {#backup-configuration}

### Configurar respaldo compatible con S3 {#set-up-s3-compatible-backup}

Configure respaldos automáticos a almacenamiento compatible con S3:

```bash
# Crear directorio de credenciales AWS
mkdir -p ~/.aws

# Configurar credenciales AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
EOF

# Configurar ajustes AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Para S3 no-AWS (como Cloudflare R2), agregue la URL del endpoint
echo "endpoint_url = YOUR_S3_ENDPOINT_URL" >> ~/.aws/config
```
### Configurar trabajos cron de respaldo {#set-up-backup-cron-jobs}

```bash
# Hacer los scripts de respaldo ejecutables
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Agregar trabajo cron de respaldo de MongoDB (se ejecuta diariamente a medianoche)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Agregar trabajo cron de respaldo de Redis (se ejecuta diariamente a medianoche)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Verificar que los trabajos cron fueron agregados
crontab -l
```


## Configuración de actualización automática {#auto-update-configuration}

Configura actualizaciones automáticas para tu instalación de Forward Email:

```bash
# Crear comando de actualización automática (usar el comando docker compose apropiado)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Agregar trabajo cron de actualización automática (se ejecuta diariamente a la 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verificar que el trabajo cron fue agregado
crontab -l
```


## Consideraciones específicas para Debian {#debian-specific-considerations}

### Diferencias en la gestión de paquetes {#package-management-differences}

* **Snapd**: No instalado por defecto en Debian, requiere instalación manual
* **Docker**: Usa repositorios y claves GPG específicas de Debian
* **UFW**: Puede no estar incluido en instalaciones mínimas de Debian
* **systemd**: El comportamiento puede diferir ligeramente de Ubuntu

### Gestión de servicios {#service-management}

```bash
# Verificar estado de servicios (comandos específicos de Debian)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Reiniciar servicios si es necesario
systemctl restart snapd
systemctl restart docker
```

### Configuración de red {#network-configuration}

Debian puede tener nombres o configuraciones de interfaces de red diferentes:

```bash
# Ver interfaces de red
ip addr show

# Ver rutas
ip route show

# Ver resolución DNS
nslookup google.com
```


## Mantenimiento y monitoreo {#maintenance-and-monitoring}

### Ubicaciones de logs {#log-locations}

* **Logs de Docker Compose**: Usa el comando docker compose apropiado según la instalación
* **Logs del sistema**: `/var/log/syslog`
* **Logs de respaldo**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Logs de actualización automática**: `/var/log/autoupdate.log`
* **Logs de Snapd**: `journalctl -u snapd`

### Tareas regulares de mantenimiento {#regular-maintenance-tasks}

1. **Monitorear espacio en disco**: `df -h`
2. **Verificar estado de servicios**: Usa el comando docker compose apropiado
3. **Revisar logs**: Ver tanto logs de la aplicación como del sistema
4. **Actualizar paquetes del sistema**: `apt update && apt upgrade`
5. **Monitorear snapd**: `snap list` y `snap refresh`

### Renovación de certificados {#certificate-renewal}

Los certificados deberían renovarse automáticamente, pero puedes renovarlos manualmente si es necesario:

```bash
# Renovación manual de certificados
certbot renew

# Copiar certificados renovados
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Reiniciar servicios para usar los nuevos certificados
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
# Verificar estado de snapd
systemctl status snapd

# Reiniciar snapd
systemctl restart snapd

# Verificar ruta de snap
echo $PATH | grep snap

# Agregar snap al PATH si falta
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Comando Docker Compose no encontrado {#2-docker-compose-command-not-found}

```bash
# Verificar qué comando docker compose está disponible
command -v docker-compose
command -v docker

# Usar el comando apropiado en los scripts
if command -v docker-compose &> /dev/null; then
    echo "Usando docker-compose"
else
    echo "Usando docker compose"
fi
```
#### 3. Problemas de Instalación de Paquetes {#3-package-installation-issues}

```bash
# Update package cache
apt update

# Fix broken packages
apt --fix-broken install

# Check for held packages
apt-mark showhold
```

### Problemas Comunes {#common-issues}

#### 1. El Servicio Docker No Arranca {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Check Docker logs
journalctl -u docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Fallo en la Generación de Certificados {#2-certificate-generation-fails}

* Asegúrate de que los puertos 80 y 443 estén accesibles
* Verifica que los registros DNS apunten a tu servidor
* Revisa la configuración del firewall con `ufw status`

#### 3. Problemas con la Entrega de Correos {#3-email-delivery-issues}

* Verifica que los registros MX sean correctos
* Revisa los registros SPF, DKIM y DMARC
* Asegúrate de que el puerto 25 no esté bloqueado por tu proveedor de hosting

### Obtener Ayuda {#getting-help}

* **Documentación**: <https://forwardemail.net/self-hosted>
* **Issues en GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Documentación de Debian**: <https://www.debian.org/doc/>


## Buenas Prácticas de Seguridad {#security-best-practices}

1. **Mantén el Sistema Actualizado**: Actualiza regularmente Debian y los paquetes
2. **Monitorea los Logs**: Configura monitoreo y alertas de logs
3. **Realiza Copias de Seguridad Regularmente**: Prueba los procedimientos de respaldo y restauración
4. **Usa Contraseñas Fuertes**: Genera contraseñas seguras para todas las cuentas
5. **Habilita Fail2Ban**: Considera instalar fail2ban para mayor seguridad
6. **Auditorías de Seguridad Regulares**: Revisa periódicamente tu configuración
7. **Monitorea Snapd**: Mantén los paquetes snap actualizados con `snap refresh`


## Conclusión {#conclusion}

Tu instalación self-hosted de Forward Email debería estar ahora completa y funcionando en Debian. Recuerda:

1. Configurar correctamente tus registros DNS
2. Probar el envío y recepción de correos
3. Configurar copias de seguridad regulares
4. Monitorear tu sistema regularmente
5. Mantener tu instalación actualizada
6. Monitorear snapd y los paquetes snap

Las principales diferencias con Ubuntu son la instalación de snapd y la configuración del repositorio de Docker. Una vez configurados correctamente, la aplicación Forward Email se comporta de manera idéntica en ambos sistemas.

Para opciones de configuración adicionales y funciones avanzadas, consulta la documentación oficial de Forward Email en <https://forwardemail.net/self-hosted#configuration>.
