# Guía de Instalación de Forward Email Autoalojado para Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Tabla de Contenidos {#table-of-contents}

* [Resumen](#overview)
* [Requisitos Previos](#prerequisites)
* [Requisitos del Sistema](#system-requirements)
* [Instalación Paso a Paso](#step-by-step-installation)
  * [Paso 1: Configuración Inicial del Sistema](#step-1-initial-system-setup)
  * [Paso 2: Configurar Resolutores DNS](#step-2-configure-dns-resolvers)
  * [Paso 3: Instalar Dependencias del Sistema](#step-3-install-system-dependencies)
  * [Paso 4: Instalar Paquetes Snap](#step-4-install-snap-packages)
  * [Paso 5: Instalar Docker](#step-5-install-docker)
  * [Paso 6: Configurar el Servicio Docker](#step-6-configure-docker-service)
  * [Paso 7: Configurar el Firewall](#step-7-configure-firewall)
  * [Paso 8: Clonar el Repositorio de Forward Email](#step-8-clone-forward-email-repository)
  * [Paso 9: Configurar el Entorno](#step-9-set-up-environment-configuration)
  * [Paso 10: Configurar Tu Dominio](#step-10-configure-your-domain)
  * [Paso 11: Generar Certificados SSL](#step-11-generate-ssl-certificates)
  * [Paso 12: Generar Claves de Encriptación](#step-12-generate-encryption-keys)
  * [Paso 13: Actualizar Rutas SSL en la Configuración](#step-13-update-ssl-paths-in-configuration)
  * [Paso 14: Configurar Autenticación Básica](#step-14-set-up-basic-authentication)
  * [Paso 15: Desplegar con Docker Compose](#step-15-deploy-with-docker-compose)
  * [Paso 16: Verificar la Instalación](#step-16-verify-installation)
* [Configuración Post-Instalación](#post-installation-configuration)
  * [Configuración de Registros DNS](#dns-records-setup)
  * [Primer Inicio de Sesión](#first-login)
* [Configuración de Copias de Seguridad](#backup-configuration)
  * [Configurar Copia de Seguridad Compatible con S3](#set-up-s3-compatible-backup)
  * [Configurar Tareas Cron para Copias de Seguridad](#set-up-backup-cron-jobs)
* [Configuración de Actualización Automática](#auto-update-configuration)
* [Mantenimiento y Monitoreo](#maintenance-and-monitoring)
  * [Ubicaciones de Logs](#log-locations)
  * [Tareas Regulares de Mantenimiento](#regular-maintenance-tasks)
  * [Renovación de Certificados](#certificate-renewal)
* [Solución de Problemas](#troubleshooting)
  * [Problemas Comunes](#common-issues)
  * [Obtener Ayuda](#getting-help)
* [Mejores Prácticas de Seguridad](#security-best-practices)
* [Conclusión](#conclusion)


## Resumen {#overview}

Esta guía proporciona instrucciones paso a paso para instalar la solución autoalojada de Forward Email en sistemas Ubuntu. Esta guía está específicamente diseñada para las versiones LTS de Ubuntu 20.04, 22.04 y 24.04.


## Requisitos Previos {#prerequisites}

Antes de comenzar la instalación, asegúrate de tener:

* **Servidor Ubuntu**: 20.04, 22.04 o 24.04 LTS
* **Acceso Root**: Debes poder ejecutar comandos como root (acceso sudo)
* **Nombre de Dominio**: Un dominio que controles con acceso a la gestión DNS
* **Servidor Limpio**: Se recomienda usar una instalación fresca de Ubuntu
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

### Paso 2: Configurar Resolutores DNS {#step-2-configure-dns-resolvers}

Configura tu sistema para usar los servidores DNS de Cloudflare para una generación confiable de certificados:

```bash
# Detener y deshabilitar systemd-resolved si está en ejecución
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Configurar resolutores DNS de Cloudflare
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

Instale los paquetes requeridos para Forward Email:

```bash
# Actualizar lista de paquetes
apt-get update -y

# Instalar dependencias básicas
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Paso 4: Instalar Paquetes Snap {#step-4-install-snap-packages}

Instale AWS CLI y Certbot vía snap:

```bash
# Instalar AWS CLI
snap install aws-cli --classic

# Instalar Certbot y plugin DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Paso 5: Instalar Docker {#step-5-install-docker}

Instale Docker CE y Docker Compose:

```bash
# Añadir la clave GPG oficial de Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Añadir repositorio de Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Actualizar índice de paquetes e instalar Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verificar instalación de Docker
docker --version
docker compose version
```

### Paso 6: Configurar el Servicio Docker {#step-6-configure-docker-service}

Asegúrese de que Docker se inicie automáticamente y esté en ejecución:

```bash
# Habilitar e iniciar el servicio Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verificar que Docker esté en ejecución
docker info
```

Si Docker no se inicia, intente iniciarlo manualmente:

```bash
# Método alternativo de inicio si systemctl falla
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Paso 7: Configurar el Firewall {#step-7-configure-firewall}

Configure el firewall UFW para asegurar su servidor:

```bash
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

# Habilitar firewall
echo "y" | ufw enable

# Verificar estado del firewall
ufw status numbered
```

### Paso 8: Clonar el Repositorio de Forward Email {#step-8-clone-forward-email-repository}

Descargue el código fuente de Forward Email:

```bash
# Configurar variables
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Clonar el repositorio
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Verificar que la clonación fue exitosa
ls -la
```

### Paso 9: Configurar la Configuración del Entorno {#step-9-set-up-environment-configuration}

Prepare la configuración del entorno:

```bash
# Configurar variables de directorio
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Copiar archivo de entorno por defecto
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Crear directorio SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# Crear directorios para bases de datos
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Paso 10: Configurar Su Dominio {#step-10-configure-your-domain}

Establezca su nombre de dominio y actualice las variables de entorno:

```bash
# Reemplace 'yourdomain.com' con su dominio real
DOMAIN="yourdomain.com"

# Función para actualizar archivo de entorno
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Actualizar variables de entorno relacionadas con el dominio
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
### Paso 11: Generar Certificados SSL {#step-11-generate-ssl-certificates}

#### Opción A: Desafío DNS Manual (Recomendado para la mayoría de usuarios) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generar certificados usando desafío DNS manual
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Importante**: Cuando se le solicite, deberá crear registros TXT en su DNS. Puede ver múltiples desafíos para el mismo dominio - **cree TODOS ellos**. No elimine el primer registro TXT al agregar el segundo.

#### Opción B: DNS de Cloudflare (Si usa Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Si su dominio usa Cloudflare para DNS, puede automatizar la generación de certificados:

```bash
# Crear archivo de credenciales de Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Establecer permisos adecuados
chmod 600 /root/.cloudflare.ini

# Generar certificados automáticamente
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

Después de generar los certificados, cópielos al directorio de la aplicación:

```bash
# Copiar certificados al directorio SSL de la aplicación
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verificar que los certificados fueron copiados
ls -la "$SELF_HOST_DIR/ssl/"
```

### Paso 12: Generar Claves de Encriptación {#step-12-generate-encryption-keys}

Cree las diversas claves de encriptación necesarias para la operación segura:

```bash
# Generar clave de encriptación auxiliar
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Generar secreto SRS para reenvío de correo
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Generar clave de encriptación TXT
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Generar clave privada DKIM para firma de correo
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Generar clave de firma para webhook
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Establecer contraseña para transporte SMTP
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Todas las claves de encriptación generadas con éxito"
```

### Paso 13: Actualizar Rutas SSL en la Configuración {#step-13-update-ssl-paths-in-configuration}

Configure las rutas de los certificados SSL en el archivo de entorno:

```bash
# Actualizar rutas SSL para apuntar a los archivos de certificado correctos
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Paso 14: Configurar Autenticación Básica {#step-14-set-up-basic-authentication}

Cree credenciales temporales para autenticación básica:

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

### Paso 15: Desplegar con Docker Compose {#step-15-deploy-with-docker-compose}

Inicie todos los servicios de Forward Email:

```bash
# Establecer ruta del archivo Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Detener cualquier contenedor existente
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Descargar las imágenes más recientes
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Iniciar todos los servicios en modo desacoplado
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Esperar un momento para que los servicios inicien
sleep 10

# Verificar estado de los servicios
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Paso 16: Verificar la Instalación {#step-16-verify-installation}

Verifique que todos los servicios estén funcionando correctamente:

```bash
# Verificar contenedores Docker
docker ps

# Revisar los registros del servicio para detectar errores
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Probar la conectividad de la interfaz web
curl -I https://$DOMAIN

# Verificar si los puertos están escuchando
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Configuración Post-Instalación {#post-installation-configuration}

### Configuración de Registros DNS {#dns-records-setup}

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

### Primer Inicio de Sesión {#first-login}

1. Abra su navegador web y navegue a `https://yourdomain.com`
2. Ingrese las credenciales de autenticación básica que guardó anteriormente
3. Complete el asistente de configuración inicial
4. Cree su primera cuenta de correo electrónico


## Configuración de Copias de Seguridad {#backup-configuration}

### Configurar Copias de Seguridad Compatibles con S3 {#set-up-s3-compatible-backup}

Configure copias de seguridad automáticas a almacenamiento compatible con S3:

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

### Configurar Tareas Cron para Copias de Seguridad {#set-up-backup-cron-jobs}

```bash
# Hacer ejecutables los scripts de respaldo
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Agregar tarea cron para respaldo de MongoDB (se ejecuta diariamente a medianoche)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Agregar tarea cron para respaldo de Redis (se ejecuta diariamente a medianoche)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Verificar que las tareas cron fueron agregadas
crontab -l
```


## Configuración de Actualización Automática {#auto-update-configuration}

Configure actualizaciones automáticas para su instalación de Forward Email:

```bash
# Crear comando de actualización automática
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Agregar tarea cron para actualización automática (se ejecuta diariamente a la 1 AM)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verificar que la tarea cron fue agregada
crontab -l
```


## Mantenimiento y Monitoreo {#maintenance-and-monitoring}

### Ubicación de los Registros {#log-locations}

* **Registros de Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Registros del sistema**: `/var/log/syslog`
* **Registros de respaldo**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Registros de actualización automática**: `/var/log/autoupdate.log`

### Tareas Regulares de Mantenimiento {#regular-maintenance-tasks}

1. **Monitorear espacio en disco**: `df -h`
2. **Verificar estado de servicios**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Revisar registros**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Actualizar paquetes del sistema**: `apt update && apt upgrade`
5. **Renovar certificados**: Los certificados se renuevan automáticamente, pero monitoree su expiración

### Renovación de Certificados {#certificate-renewal}

Los certificados deberían renovarse automáticamente, pero puede renovarlos manualmente si es necesario:

```bash
# Renovación manual de certificados
certbot renew

# Copiar certificados renovados
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Reiniciar servicios para usar los nuevos certificados
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Solución de Problemas {#troubleshooting}

### Problemas Comunes {#common-issues}

#### 1. El Servicio Docker No Se Inicia {#1-docker-service-wont-start}

```bash
# Check Docker status
systemctl status docker

# Try alternative startup
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Fallo en la Generación del Certificado {#2-certificate-generation-fails}

* Asegúrate de que los puertos 80 y 443 estén accesibles
* Verifica que los registros DNS apunten a tu servidor
* Revisa la configuración del firewall

#### 3. Problemas con la Entrega de Correo {#3-email-delivery-issues}

* Verifica que los registros MX sean correctos
* Revisa los registros SPF, DKIM y DMARC
* Asegúrate de que el puerto 25 no esté bloqueado por tu proveedor de hosting

#### 4. Interfaz Web No Accesible {#4-web-interface-not-accessible}

* Revisa la configuración del firewall: `ufw status`
* Verifica los certificados SSL: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Comprueba las credenciales de autenticación básica

### Obtener Ayuda {#getting-help}

* **Documentación**: <https://forwardemail.net/self-hosted>
* **Issues en GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Soporte Comunitario**: Consulta las discusiones en GitHub del proyecto


## Mejores Prácticas de Seguridad {#security-best-practices}

1. **Mantén el Sistema Actualizado**: Actualiza regularmente Ubuntu y los paquetes
2. **Monitorea los Registros**: Configura monitoreo y alertas de logs
3. **Realiza Copias de Seguridad Regularmente**: Prueba los procedimientos de respaldo y restauración
4. **Usa Contraseñas Fuertes**: Genera contraseñas seguras para todas las cuentas
5. **Activa Fail2Ban**: Considera instalar fail2ban para mayor seguridad
6. **Auditorías de Seguridad Regulares**: Revisa periódicamente tu configuración


## Conclusión {#conclusion}

Tu instalación de Forward Email autoalojada debería estar ahora completa y funcionando en Ubuntu. Recuerda:

1. Configurar correctamente tus registros DNS
2. Probar el envío y recepción de correos
3. Configurar copias de seguridad regulares
4. Monitorear tu sistema regularmente
5. Mantener tu instalación actualizada

Para opciones de configuración adicionales y funciones avanzadas, consulta la documentación oficial de Forward Email en <https://forwardemail.net/self-hosted#configuration>.
