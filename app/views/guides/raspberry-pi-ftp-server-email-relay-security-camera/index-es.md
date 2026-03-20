# Convierte tu Raspberry Pi en un Servidor FTP Seguro con Reenvío de Email {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

¿Tienes una Raspberry Pi acumulando polvo? Ya sea la última Pi 5, una Pi 4, Pi Zero o incluso un modelo más antiguo, esta guía te mostrará cómo convertirla en un potente servidor de archivos automatizado con capacidades de reenvío de email. Perfecto para cámaras de seguridad, dispositivos IoT y más.

**Compatible con:** Raspberry Pi 5, Raspberry Pi 4 Modelo B, Raspberry Pi 3 Modelo B+, Raspberry Pi 3 Modelo B, Raspberry Pi 2 Modelo B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W y Raspberry Pi Zero.

> \[!NOTE]
> Esta guía fue probada y verificada en una Raspberry Pi 3 Modelo B ejecutando Ubuntu Server 22.04 LTS.


## Tabla de Contenidos {#table-of-contents}

* [Lo que Estamos Construyendo](#what-were-building)
* [Parte 1: Instalando Ubuntu Server en tu Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [Lo que Necesitarás](#what-youll-need)
  * [Flasheando el SO](#flashing-the-os)
  * [Arrancando y Conectando](#booting-up--connecting)
* [Parte 2: Configurando un Servidor FTP Seguro](#part-2-setting-up-a-secure-ftp-server)
  * [Instalación y Configuración](#installation--configuration)
  * [Creando un Usuario FTP](#creating-an-ftp-user)
* [Parte 3: Firewall y Protección contra Fuerza Bruta](#part-3-firewall-and-brute-force-protection)
  * [Configurando UFW](#setting-up-ufw)
  * [Configurando Fail2ban](#setting-up-fail2ban)
* [Parte 4: Procesamiento Automático de Archivos con Notificaciones por Email](#part-4-automated-file-processing-with-email-notifications)
  * [Opción 1: Usando la API de Forward Email (Recomendado)](#option-1-using-forward-email-api-recommended)
  * [Opción 2: Usando Otros Proveedores de Email](#option-2-using-other-email-providers)
  * [Crear un Servicio Systemd](#create-a-systemd-service)
* [Parte 5: Opciones de Email para Dispositivos Antiguos](#part-5-email-options-for-legacy-devices)
  * [Opción 1: Usar los Puertos Legacy TLS 1.0 de Forward Email (Recomendado)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Opción 2: Configurar un Relay SMTP Postfix](#option-2-set-up-a-postfix-smtp-relay)
* [Solución de Problemas](#troubleshooting)
* [Conclusión](#wrapping-up)


## Lo que Estamos Construyendo {#what-were-building}

Esta guía te llevará paso a paso para configurar un sistema completo que incluye:

* **Ubuntu Server 22.04 LTS:** Un sistema operativo sólido y ligero para la Pi.
* **Un Servidor FTP Seguro (vsftpd):** Para subir archivos de forma segura.
* **Un Firewall (UFW) y Fail2ban:** Para mantener alejados a los intrusos.
* **Un Procesador Automático de Archivos:** Un script que toma archivos nuevos, los envía por email como adjuntos y luego se limpia solo.
* **Opciones de Email para Dispositivos Antiguos:** Dos enfoques para dispositivos que no soportan TLS moderno:
  * Usar los puertos legacy TLS 1.0 de Forward Email (más fácil)
  * Configurar un relay SMTP Postfix (funciona con cualquier proveedor de email)

¿Listo? Vamos allá.


## Parte 1: Instalando Ubuntu Server en tu Pi {#part-1-getting-ubuntu-server-on-your-pi}

Primero lo primero, instala Ubuntu Server en la Raspberry Pi. Es sorprendentemente fácil gracias al Raspberry Pi Imager.

### Lo que Necesitarás {#what-youll-need}

* Cualquier Raspberry Pi compatible (ver lista arriba)
* Una tarjeta microSD (mínimo 8GB, recomendado 16GB o más)
* Una computadora con lector de tarjetas microSD
* Fuente de alimentación adecuada para tu modelo de Pi
* Acceso a Internet (Ethernet o Wi-Fi)

> \[!NOTE]
> Los modelos más antiguos como la Raspberry Pi 2 o Pi Zero pueden ser más lentos pero funcionarán bien para esta configuración.

### Flasheando el SO {#flashing-the-os}

1. **Obtén el Raspberry Pi Imager:** Descárgalo desde el [sitio oficial](https://www.raspberrypi.com/software/).

2. **Elige el SO:** En el imager, selecciona "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * Para modelos de 64 bits (Pi 3, 4, 5, Zero 2 W), elige **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * Para modelos antiguos de 32 bits (Pi 2, Pi Zero, Pi Zero W), elige **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Selecciona tu almacenamiento:** Elige tu tarjeta microSD.

> \[!WARNING]
> Esto borrará completamente tu tarjeta microSD. Asegúrate de haber respaldado cualquier cosa importante.

4. **Las opciones avanzadas son tus amigas:** Haz clic en el ícono de engranaje (⚙️) para configurar la Pi en modo headless (sin monitor ni teclado).
   * **Hostname:** Ponle un nombre a tu Pi (ejemplo: `pi-server`).
   * **SSH:** Actívalo y configura un usuario y contraseña.
   * **Wi-Fi:** Si no usas Ethernet, ingresa los datos de tu Wi-Fi.
   * **Locale:** Configura tu zona horaria y distribución de teclado.
5. **¡Escribe!** Haz clic en el botón "WRITE" y deja que el imager haga su trabajo.

### Arrancando y Conectando {#booting-up--connecting}

Una vez que el imager termine, inserta la tarjeta microSD en la Pi y conéctala. Dale unos minutos para que arranque. Está realizando una configuración inicial en segundo plano. Encuentra su dirección IP desde la página de administración de tu router, luego conéctate vía SSH:

```bash
ssh your_username@your_pi_ip_address
```

¡Has entrado! La Raspberry Pi ya está lista para la configuración.


## Parte 2: Configurando un Servidor FTP Seguro {#part-2-setting-up-a-secure-ftp-server}

A continuación, configura `vsftpd` (Very Secure FTP Daemon), configurado para máxima seguridad.

### Instalación y Configuración {#installation--configuration}

1. **Instalar vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Respaldar el archivo de configuración:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Editar la configuración:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Si una línea está comentada (comienza con un `#`), descoméntala quitando el `#`.

Realiza estos cambios:

| Configuración            | Valor | Propósito                                               |
| ------------------------ | ----- | ------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | Deshabilitar acceso FTP anónimo                         |
| `local_enable`           | `YES` | Permitir que usuarios locales inicien sesión            |
| `write_enable`           | `YES` | Habilitar cargas de archivos                             |
| `local_umask`            | `022` | Establecer permisos de archivos (644 para archivos, 755 para directorios) |
| `chroot_local_user`      | `YES` | Encerrar a los usuarios en su directorio home           |
| `allow_writeable_chroot` | `YES` | Permitir cargas en el entorno chroot                     |

4. **Agregar rango de puertos pasivos:** Añade estas líneas al final del archivo. Esto es necesario para el firewall.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Habilitar registro:** Añade estas líneas para habilitar el registro para Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Guardar y reiniciar:** Presiona `Ctrl+O`, `Enter`, `Ctrl+X`, luego reinicia el servicio:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Creando un Usuario FTP {#creating-an-ftp-user}

Crea un usuario dedicado y restringido para acceso FTP.

1. **Crear el usuario:**

   ```bash
   sudo adduser ftpuser
   ```

   Sigue las indicaciones para establecer una contraseña. Los otros campos (nombre, teléfono, etc.) pueden dejarse en blanco.

2. **Crear la estructura de directorios:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Directorio principal FTP
   * `/home/ftpuser/ftp/uploads` - Donde se subirán los archivos

3. **Establecer permisos:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Parte 3: Firewall y Protección contra Fuerza Bruta {#part-3-firewall-and-brute-force-protection}

Asegura la Pi con UFW (Uncomplicated Firewall) y Fail2ban.

### Configurando UFW {#setting-up-ufw}

1. **Instalar UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Establecer políticas por defecto:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Permitir SSH (¡crítico!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> ¡Siempre permite SSH antes de habilitar el firewall, o te bloquearás a ti mismo!

4. **Permitir puertos FTP:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Habilitar el firewall:**

   ```bash
   sudo ufw enable
   ```

### Configurando Fail2ban {#setting-up-fail2ban}

Fail2ban bloquea automáticamente direcciones IP tras intentos fallidos repetidos de inicio de sesión.

1. **Instalar Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Crear una configuración local:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Agregar estas configuraciones:**
   ```ini
   [DEFAULT]
   bantime = 3600
   findtime = 600
   maxretry = 5

   [sshd]
   enabled = true
   port = ssh
   logpath = /var/log/auth.log

   [vsftpd]
   enabled = true
   port = ftp,ftp-data,40000:50000
   logpath = /var/log/vsftpd.log
   maxretry = 3
   ```

4. **Restart Fail2ban:**

   ```bash
   sudo systemctl restart fail2ban
   ```


## Part 4: Automated File Processing with Email Notifications {#part-4-automated-file-processing-with-email-notifications}

Now for the magic: a script that monitors the FTP folder, emails new files as attachments, and deletes them. There are two approaches depending on your email provider:

### Option 1: Using Forward Email API (Recommended) {#option-1-using-forward-email-api-recommended}

If you have a Forward Email account, use the Email API for the most reliable delivery.

#### Get Your API Key {#get-your-api-key}

1. Log in to [Forward Email](https://forwardemail.net)
2. Navigate to [My Account → Security](https://forwardemail.net/my-account/security)
3. Scroll down to the **"Developer Access"** section at the bottom
4. Copy your API key

> \[!WARNING]
> Keep your API key private at all times. Never share it publicly or commit it to version control.

> \[!NOTE]
> The Enhanced Protection plan ($3/month) or higher is required for API access.

#### Install inotify-tools {#install-inotify-tools}

```bash
sudo apt install inotify-tools -y
```

#### Create the Monitoring Script {#create-the-monitoring-script}

```bash
sudo nano /usr/local/bin/ftp-monitor.sh
```

Paste this script:

```bash
#!/bin/bash

# Configuration
WATCH_DIR="/home/ftpuser/ftp/uploads"
FROM_EMAIL="noreply@yourdomain.com"
TO_EMAIL="your-email@example.com"
API_KEY="your_forward_email_api_key"  # Replace with your actual API key

# Monitor for new files
inotifywait -m -e close_write --format '%w%f' "$WATCH_DIR" | while read FILEPATH
do
    FILENAME=$(basename "$FILEPATH")
    FOLDERNAME=$(basename "$WATCH_DIR")
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    SUBJECT="$TIMESTAMP - $FOLDERNAME - $FILENAME"

    # Base64 encode the file
    FILE_CONTENT=$(base64 -w 0 "$FILEPATH")

    # Send email with attachment via Forward Email API
    RESPONSE=$(curl -X POST https://api.forwardemail.net/v1/emails \
      -u "$API_KEY:" \
      -H "Content-Type: application/json" \
      -d '{
        "from": "'"$FROM_EMAIL"'",
        "to": "'"$TO_EMAIL"'",
        "subject": "'"$SUBJECT"'",
        "text": "New file uploaded: '"$FILENAME"'",
        "attachments": [
          {
            "filename": "'"$FILENAME"'",
            "content": "'"$FILE_CONTENT"'",
            "encoding": "base64"
          }
        ]
      }')

    # Check if email was sent successfully
    if echo "$RESPONSE" | grep -q '"statusCode":200'; then
        echo "Email sent successfully for $FILENAME"
        # Delete the file
        rm -f "$FILEPATH"
        echo "Deleted $FILENAME"
    else
        echo "Failed to send email for $FILENAME"
        echo "Response: $RESPONSE"
    fi
done
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Option 2: Using Other Email Providers {#option-2-using-other-email-providers}

If you prefer to use Gmail, Outlook, Yahoo, or another provider, modify the script to use `sendmail` or `msmtp` instead of the Forward Email API.

#### Install msmtp {#install-msmtp}

```bash
sudo apt install msmtp msmtp-mta -y
```

#### Configure msmtp {#configure-msmtp}

Create the configuration file:

```bash
sudo nano /etc/msmtprc
```

Add your provider's settings (example for Gmail):

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        gmail
host           smtp.gmail.com
port           587
from           your-email@gmail.com
user           your-email@gmail.com
password       your-app-password

account default : gmail
```

Secure the file:

```bash
sudo chmod 600 /etc/msmtprc
```

#### Create the Alternative Monitoring Script {#create-the-alternative-monitoring-script}

```bash
sudo nano /usr/local/bin/ftp-monitor.sh
```

Paste this script:

```bash
#!/bin/bash

# Configuration
WATCH_DIR="/home/ftpuser/ftp/uploads"
FROM_EMAIL="your-email@gmail.com"
TO_EMAIL="recipient@example.com"

# Monitor for new files
inotifywait -m -e close_write --format '%w%f' "$WATCH_DIR" | while read FILEPATH
do
    FILENAME=$(basename "$FILEPATH")
    FOLDERNAME=$(basename "$WATCH_DIR")
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    SUBJECT="$TIMESTAMP - $FOLDERNAME - $FILENAME"

    # Send email with attachment using msmtp
    (
        echo "To: $TO_EMAIL"
        echo "From: $FROM_EMAIL"
        echo "Subject: $SUBJECT"
        echo "MIME-Version: 1.0"
        echo "Content-Type: multipart/mixed; boundary=\"BOUNDARY\""
        echo ""
        echo "--BOUNDARY"
        echo "Content-Type: text/plain; charset=utf-8"
        echo ""
        echo "New file uploaded: $FILENAME"
        echo ""
        echo "--BOUNDARY"
        echo "Content-Type: application/octet-stream; name=\"$FILENAME\""
        echo "Content-Transfer-Encoding: base64"
        echo "Content-Disposition: attachment; filename=\"$FILENAME\""
        echo ""
        base64 "$FILEPATH"
        echo ""
        echo "--BOUNDARY--"
    ) | msmtp -t

    # Check if email was sent successfully
    if [ $? -eq 0 ]; then
        echo "Email sent successfully for $FILENAME"
        # Delete the file
        rm -f "$FILEPATH"
        echo "Deleted $FILENAME"
    else
        echo "Failed to send email for $FILENAME"
    fi
done
```

Hazlo ejecutable:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Crear un Servicio Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Agrega este contenido:

```ini
[Unit]
Description=FTP Upload Monitor
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ftp-monitor.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Habilita e inicia el servicio:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Verifica el estado:

```bash
sudo systemctl status ftp-monitor.service
```


## Parte 5: Opciones de Email para Dispositivos Antiguos {#part-5-email-options-for-legacy-devices}

Dispositivos como las cámaras FOSSCAM a menudo no soportan versiones modernas de TLS. Hay dos soluciones:

### Opción 1: Usar los Puertos Legacy TLS 1.0 de Forward Email (Recomendado) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Si usas Forward Email, esta es la solución más sencilla. Forward Email proporciona puertos dedicados legacy TLS 1.0 específicamente para dispositivos antiguos como cámaras, impresoras, escáneres y faxes.

#### Precios {#pricing}

Forward Email ofrece varios planes:

| Plan                    | Precio       | Características                         |
| ----------------------- | ------------ | -------------------------------------- |
| Gratis                  | $0/mes       | Solo reenvío de correo (sin envío)     |
| **Protección Mejorada** | **$3/mes**   | **Acceso SMTP + puertos legacy TLS 1.0** |
| Equipo                  | $9/mes       | Protección mejorada + funciones de equipo |
| Empresa                 | $250/mes     | Equipo + solicitudes API ilimitadas    |

> \[!IMPORTANT]
> El **plan Protección Mejorada ($3/mes)** o superior es requerido para acceso SMTP y soporte de puertos legacy TLS 1.0.

Más información en [Precios de Forward Email](https://forwardemail.net/en/pricing).

#### Genera tu Contraseña {#generate-your-password}

Antes de configurar tu dispositivo, genera una contraseña en Forward Email:

1. Inicia sesión en [Forward Email](https://forwardemail.net)
2. Ve a **Mi Cuenta → Dominios → \[Tu Dominio] → Alias**
3. Crea o selecciona un alias (ejemplo: `camera@tudominio.com`)
4. Haz clic en **"Generar Contraseña"** junto al alias
5. Copia la contraseña generada - la usarás para la autenticación SMTP

> \[!TIP]
> Cada alias puede tener su propia contraseña. Esto es útil para rastrear qué dispositivo envió cada correo.

#### Configura tu Dispositivo {#configure-your-device}

Usa estos ajustes en tu cámara, impresora, escáner u otro dispositivo antiguo:

| Configuración   | Valor                                            |
| --------------- | ------------------------------------------------ |
| Servidor SMTP   | `smtp.forwardemail.net`                          |
| Puerto (SSL/TLS)| `2455`                                           |
| Puerto (STARTTLS)| `2555` (alternativo)                             |
| Usuario         | Tu correo alias (ejemplo: `camera@tudominio.com`) |
| Contraseña      | La contraseña de "Generar Contraseña"            |
| Autenticación   | Requerida                                        |
| Encriptación    | SSL/TLS (recomendado) o STARTTLS                 |

> \[!WARNING]
> Estos puertos usan el protocolo TLS 1.0 obsoleto que tiene vulnerabilidades conocidas (BEAST, POODLE). Úsalos solo si tu dispositivo no soporta TLS moderno 1.2+.

Simplemente configura tu dispositivo con estos ajustes y enviará correos directamente a través de Forward Email sin necesidad de un servidor relay local.

Para más detalles, consulta el [FAQ de Forward Email sobre Soporte Legacy TLS](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Opción 2: Configurar un Relay SMTP Postfix {#option-2-set-up-a-postfix-smtp-relay}

Si no usas Forward Email, o prefieres una solución relay local, configura Postfix en la Raspberry Pi para que actúe como intermediario. Esto funciona con cualquier proveedor de correo (Gmail, Outlook, Yahoo, AOL, etc.).

#### Instalar Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Durante la instalación:

* Seleccione **"Internet Site"**
* Ingrese el nombre de host de su Pi (por ejemplo, `raspberrypi-ftp`) para "System mail name"

#### Elija su proveedor de correo electrónico {#choose-your-email-provider}

| Proveedor | Servidor SMTP         | Puerto | ¿Se requiere contraseña de aplicación? |
| --------- | --------------------- | ------ | -------------------------------------- |
| Gmail     | smtp.gmail.com        | 587    | Sí                                     |
| Outlook   | smtp-mail.outlook.com | 587    | Sí                                     |
| Yahoo     | smtp.mail.yahoo.com   | 465    | Sí                                     |
| AOL       | smtp.aol.com          | 587    | Sí                                     |

#### Obtenga una contraseña específica para la aplicación {#get-an-app-specific-password}

La mayoría de los proveedores requieren contraseñas de aplicación para aplicaciones de terceros. Genere una desde la configuración de seguridad de su proveedor de correo electrónico:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Nunca use su contraseña de correo electrónico habitual. Siempre use una contraseña específica para la aplicación.

#### Configure la autenticación SASL {#configure-sasl-authentication}

Cree el archivo de contraseña para su proveedor elegido. Este ejemplo usa Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Agregue esta línea (ajuste el servidor y puerto para su proveedor):

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Para Gmail, use:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

Asegure y genere el hash del archivo:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Configure el mapeo de direcciones de correo electrónico {#configure-email-address-mapping}

Reescriba las direcciones de correo locales para que coincidan con su proveedor de correo:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Agregue esta línea (reemplace `HOSTNAME` con el nombre de host de su Pi y use su correo electrónico):

```
/.+@HOSTNAME/    your_email@provider.com
```

Ejemplo:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

Asegure el archivo:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Configure los ajustes principales de Postfix {#configure-postfix-main-settings}

Edite la configuración principal:

```bash
sudo nano /etc/postfix/main.cf
```

Busque y actualice el relay host (o agréguelo al final):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Agregue estas configuraciones al final del archivo:

```
# Configuración del relay SMTP
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Configuración de red
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Para Gmail (puerto 587), establezca `smtp_tls_wrappermode = no` en lugar de `yes`.

> \[!WARNING]
> Actualice `mynetworks` con el rango real de su red. Solo agregue redes confiables: cualquier dispositivo en estas redes puede enviar correo sin autenticación.

**Rangos comunes de red:**

| Rango de red     | Rango de direcciones IP       |
| ---------------- | ----------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254   |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254   |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255     |

#### Actualice el firewall y reinicie {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Verifique que Postfix esté en ejecución:

```bash
sudo systemctl status postfix
```

#### Pruebe el relay {#test-the-relay}

Envíe un correo de prueba:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

Revise los registros:

```bash
sudo tail -f /var/log/mail.log
```

Busque `status=sent` para confirmar el éxito.

#### Configure su dispositivo {#configure-your-device-1}

En la configuración de su cámara o dispositivo:
* **Servidor SMTP:** La dirección IP de tu Pi (por ejemplo, `192.168.1.100`)
* **Puerto SMTP:** `25`
* **Autenticación:** Ninguna
* **Encriptación:** Ninguna (solo red local)


## Solución de problemas {#troubleshooting}

Si surgen problemas, revisa estos archivos de registro:

**Servidor FTP:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Monitor de archivos:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Correo Postfix:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Ver cola de correo
```


## Conclusión {#wrapping-up}

La Raspberry Pi es ahora un sistema automatizado completo con cargas de archivos seguras, notificaciones automáticas por correo electrónico con adjuntos y capacidades de retransmisión SMTP para dispositivos antiguos. Ya sea usando los puertos TLS heredados de Forward Email o un relé Postfix local, los dispositivos más antiguos ahora pueden enviar correos electrónicos de forma confiable a través de proveedores modernos.
