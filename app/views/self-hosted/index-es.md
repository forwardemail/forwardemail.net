# Auto hospedado {#self-hosted}

## Tabla de contenido {#table-of-contents}

* [Empezando](#getting-started)
* [Requisitos](#requirements)
  * [Cloud-init / Datos de usuario](#cloud-init--user-data)
* [Instalar](#install)
  * [Script de instalación de depuración](#debug-install-script)
  * [Indicaciones](#prompts)
  * [Configuración inicial (Opción 1)](#initial-setup-option-1)
* [Servicios](#services)
  * [Rutas de archivos importantes](#important-file-paths)
* [Configuración](#configuration)
  * [Configuración inicial de DNS](#initial-dns-setup)
* [Incorporación](#onboarding)
* [Pruebas](#testing)
  * [Creando tu primer alias](#creating-your-first-alias)
  * [Enviar/Recibir su primer correo electrónico](#sending--receiving-your-first-email)
* [Solución de problemas](#troubleshooting)
  * [¿Cuál es el nombre de usuario y la contraseña de autenticación básicos?](#what-is-the-basic-auth-username-and-password)
  * [¿Cómo sé qué se está ejecutando?](#how-do-i-know-what-is-running)
  * [¿Cómo puedo saber si algo que debería estar funcionando no se está ejecutando?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [¿Cómo encuentro registros?](#how-do-i-find-logs)
  * [¿Por qué se agota el tiempo de espera de mis correos electrónicos salientes?](#why-are-my-outgoing-emails-timing-out)

## Primeros pasos {#getting-started}

Nuestra solución de correo electrónico autoalojada, al igual que todos nuestros productos, es 100 % de código abierto, tanto en el frontend como en el backend. Esto significa:

1. **Transparencia total**: Cada línea de código que procesa tus correos electrónicos está disponible para el escrutinio público.
2. **Contribuciones de la comunidad**: Cualquiera puede contribuir con mejoras o solucionar problemas.
3. **Seguridad a través de la transparencia**: Una comunidad global puede identificar y solucionar vulnerabilidades.
4. **Sin dependencia de un proveedor**: Nunca dependes de la existencia de nuestra empresa.

El código base completo está disponible en GitHub en <https://github.com/forwardemail/forwardemail.net>, con licencia MIT.

La arquitectura incluye contenedores para:

* Servidor SMTP para correo saliente
* Servidores IMAP/POP3 para la recuperación de correo
* Interfaz web para la administración
* Base de datos para el almacenamiento de la configuración
* Redis para el almacenamiento en caché y el rendimiento
* SQLite para el almacenamiento seguro y cifrado del buzón

> \[!NOTE]
> No olvides consultar nuestra guía [blog autoalojado](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Si te interesa una versión más detallada, consulta nuestras guías [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) o [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Requisitos {#requirements}

Antes de ejecutar el script de instalación, asegúrese de tener lo siguiente:

* **Sistema operativo**: Un servidor basado en Linux (actualmente compatible con Ubuntu 22.04 o superior).
* **Recursos**: 1 vCPU y 2 GB de RAM
* **Acceso root**: Privilegios administrativos para ejecutar comandos.
* **Nombre de dominio**: Un dominio personalizado listo para la configuración de DNS.
* **IP limpia**: Asegúrese de que su servidor tenga una dirección IP limpia y sin reputación de spam previa revisando las listas negras. Más información: [aquí](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Dirección IP pública compatible con el puerto 25
* Posibilidad de configurar [PTR inverso](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Compatibilidad con IPv4 e IPv6

> \[!TIP]
> Consulta nuestra lista de [proveedores de servidores de correo increíbles](https://github.com/forwardemail/awesome-mail-server-providers)

### Inicialización de nube / Datos de usuario {#cloud-init--user-data}

La mayoría de los proveedores de nube admiten una configuración de cloud-init para cuando se aprovisiona el servidor privado virtual (VPS). Esta es una excelente manera de configurar algunos archivos y variables de entorno con antelación para su uso en la lógica de configuración inicial de los scripts, lo que evita la necesidad de solicitar información adicional mientras el script se ejecuta.

**Opciones**

* `EMAIL` - Correo electrónico usado para recordatorios de expiración de Certbot
* `DOMAIN` - Dominio personalizado (p. ej., `example.com`) usado para la configuración de autoalojamiento
* `AUTH_BASIC_USERNAME` - Nombre de usuario usado en la primera configuración para proteger el sitio
* `AUTH_BASIC_PASSWORD` - Contraseña usada en la primera configuración para proteger el sitio
* `/root/.cloudflare.ini` - (**Solo para usuarios de Cloudflare**) Archivo de configuración de Cloudflare usado por Certbot para la configuración de DNS. Requiere que configures tu token de API mediante `dns_cloudflare_api_token`. Más información sobre [aquí](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

Ejemplo:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```

## Instalar {#install}

Ejecute el siguiente comando en su servidor para descargar y ejecutar el script de instalación:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Script de instalación de depuración {#debug-install-script}

Agregue `DEBUG=true` delante del script de instalación para obtener una salida detallada:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Indicaciones {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Configuración inicial**: Descargue el código de reenvío de correo electrónico más reciente, configure el entorno, solicite su dominio personalizado y configure todos los certificados, claves y secretos necesarios.
* **Configurar copia de seguridad**: Se configurará un cron para realizar copias de seguridad de MongoDB y Redis mediante un almacén compatible con S3 para un almacenamiento remoto seguro. Por separado, se realizará una copia de seguridad de SQLite al iniciar sesión si hay cambios para realizar copias de seguridad seguras y cifradas.
* **Configurar actualización**: Configure un cron para buscar actualizaciones nocturnas que reconstruyan y reinicien de forma segura los componentes de la infraestructura.
* **Renovar certificados**: Certbot/lets encrypt se utiliza para certificados SSL y las claves caducan cada 3 meses. Esto renovará los certificados de su dominio y los colocará en la carpeta necesaria para que los componentes relacionados los consuman. Consulte [rutas de archivos importantes](#important-file-paths)
* **Restaurar desde copia de seguridad**: Activará MongoDB y Redis para restaurar los datos de la copia de seguridad.

### Configuración inicial (Opción 1) {#initial-setup-option-1}

Elija la opción `1. Initial setup` para comenzar.

Una vez completado, debería ver un mensaje de éxito. Incluso puede ejecutar `docker ps` para ver **los** componentes activados. Más información sobre los componentes a continuación.

## Servicios {#services}

| Nombre del servicio | Puerto predeterminado | Descripción |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Interfaz web para todas las interacciones de administración |
| API | `4000` | Capa de API para abstraer bases de datos |
| Bree | Ninguno | Ejecutor de tareas y trabajos en segundo plano |
| SMTP | `465/587` | Servidor SMTP para correo electrónico saliente |
| SMTP Bree | Ninguno | Trabajo en segundo plano SMTP |
| MX | `2525` | Intercambio de correo para correo electrónico entrante y reenvío de correo electrónico |
| IMAP | `993/2993` | Servidor IMAP para la gestión de correo electrónico entrante y buzones de correo |
| POP3 | `995/2995` | Servidor POP3 para la gestión de buzones y correo electrónico entrante |
| SQLite | `3456` | Servidor SQLite para interacciones con bases de datos SQLite |
| SQLite Bree | Ninguno | Trabajo en segundo plano de SQLite |
| CalDAV | `5000` | Servidor CalDAV para la gestión del calendario |
| Tarjeta DAV | `6000` | Servidor CardDAV para la gestión del calendario |
| MongoDB | `27017` | Base de datos MongoDB para la mayoría de las gestiones de datos |
| Redis | `6379` | Redis para almacenamiento en caché y gestión de estado |
| SQLite | Ninguno | Bases de datos SQLite para buzones de correo cifrados |

### Rutas de archivos importantes {#important-file-paths}

Nota: La *ruta del host* a continuación es relativa a `/root/forwardemail.net/self-hosting/`.

| Componente | Ruta del host | Ruta del contenedor |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| SQLite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Archivo env | `./.env` | `/app/.env` |
| Certificados/claves SSL | `./ssl` | `/app/ssl/` |
| Clave privada | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Certificado de cadena completa | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| CA certificadas | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| Clave privada DKIM | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Guarde el archivo `.env` de forma segura. Es fundamental para la recuperación en caso de fallo.
> Puede encontrarlo en `/root/forwardemail.net/self-hosting/.env`.

## Configuración {#configuration}

### Configuración inicial de DNS {#initial-dns-setup}

En el proveedor de DNS que prefiera, configure los registros DNS adecuados. Tenga en cuenta que todo lo que esté entre corchetes (`<>`) es dinámico y debe actualizarse con su valor.

| Tipo | Nombre | Contenido | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", ".", o en blanco | <dirección_ip> | auto |
| CNAME | API | <nombre_de_dominio> | auto |
| CNAME | Caldav | <nombre_de_dominio> | auto |
| CNAME | carddav | <nombre_de_dominio> | auto |
| CNAME | rebotes de fe | <nombre_de_dominio> | auto |
| CNAME | IMAP | <nombre_de_dominio> | auto |
| CNAME | mx | <nombre_de_dominio> | auto |
| CNAME | pop3 | <nombre_de_dominio> | auto |
| CNAME | SMTP | <nombre_de_dominio> | auto |
| MX | "@", ".", o en blanco | mx.<nombre_de_dominio> (prioridad 0) | auto |
| TXT | "@", ".", o en blanco | "v=spf1 a -all" | auto |

#### Registro DNS/PTR inverso {#reverse-dns--ptr-record}

El DNS inverso (rDNS) o los registros de puntero inverso (PTR) son esenciales para los servidores de correo electrónico, ya que ayudan a verificar la legitimidad del servidor que envía el correo electrónico. Cada proveedor de nube lo hace de forma diferente, por lo que deberá consultar cómo agregar "DNS inverso" para asignar el host y la IP a su nombre de host correspondiente. Probablemente se encuentre en la sección de redes del proveedor.

#### Puerto 25 bloqueado {#port-25-blocked}

Algunos ISP y proveedores de nube bloquean el puerto 25 para evitar ataques maliciosos. Es posible que deba enviar un ticket de soporte para abrir el puerto 25 para SMTP/correo electrónico saliente.

## Incorporación {#onboarding}

1. Abra la página de destino.
Vaya a https\://\<nombre_de_dominio> y reemplace \<nombre_de_dominio> con el dominio configurado en su configuración de DNS. Debería ver la página de destino "Reenviar correo electrónico".

2. Inicia sesión y registra tu dominio

* Inicia sesión con un correo electrónico y una contraseña válidos.
* Introduce el nombre de dominio que deseas configurar (debe coincidir con la configuración de DNS).
* Sigue las instrucciones para agregar los registros **MX** y **TXT** necesarios para la verificación.

3. Configuración completa

* Una vez verificado, accede a la página de Alias para crear tu primer alias.
* Opcionalmente, configura **SMTP para correo saliente** en **Configuración del dominio**. Esto requiere registros DNS adicionales.

> \[!NOTE]
> No se envía información fuera de su servidor. La opción de alojamiento propio y la cuenta inicial son solo para el inicio de sesión de administrador y la vista web para gestionar dominios, alias y configuraciones de correo electrónico relacionadas.

## Prueba {#testing}

### Creando su primer alias {#creating-your-first-alias}

1. Acceda a la página de alias.
Abra la página de administración de alias:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Agregar un nuevo alias

* Haga clic en **Añadir alias** (arriba a la derecha).
* Introduzca el nombre del alias y ajuste la configuración del correo electrónico según sea necesario.
* (Opcional) Active la compatibilidad con **IMAP/POP3/CalDAV/CardDAV** marcando la casilla de verificación.
* Haga clic en **Crear alias**.

3. Establecer una contraseña

* Haga clic en **Generar contraseña** para crear una contraseña segura.
* Esta contraseña será necesaria para iniciar sesión en su cliente de correo electrónico.

4. Configure su cliente de correo electrónico

* Use un cliente de correo electrónico como Betterbird.
* Ingrese el alias y la contraseña generada.
* Configure los ajustes **IMAP** y **SMTP** según corresponda.

#### Configuración del servidor de correo electrónico {#email-server-settings}

Nombre de usuario: `<alias name>`

| Tipo | Nombre de host | Puerto | Seguridad de la conexión | Autenticación |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<nombre_de_dominio> | 465 | SSL / TLS | Contraseña normal |
| IMAP | imap.<nombre_de_dominio> | 993 | SSL / TLS | Contraseña normal |

### Enviando / Recepción de su primer correo electrónico {#sending--receiving-your-first-email}

Una vez configurado, ¡debería poder enviar y recibir correos electrónicos a su dirección de correo electrónico recién creada y alojada!

## Solución de problemas {#troubleshooting}

#### ¿Por qué esto no funciona fuera de Ubuntu y Debian? {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Actualmente buscamos compatibilidad con macOS y buscaremos otras opciones. Si desea que otros usuarios también lo sean, abra un [discusión](https://github.com/orgs/forwardemail/discussions) o contribuya.

#### ¿Por qué falla el desafío acme de certbot? {#why-is-the-certbot-acme-challenge-failing}

El problema más común es que certbot/letsencrypt a veces solicita **2** desafíos. Debe asegurarse de agregar **AMBOS** registros txt.

Ejemplo:
Podrías ver dos desafíos como este:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

También es posible que la propagación del DNS no se haya completado. Puedes usar herramientas como `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Esto te dará una idea de si los cambios en tu registro TXT deberían reflejarse. También es posible que la caché DNS local de tu host siga usando un valor antiguo o no haya detectado los cambios recientes.

Otra opción es usar los cambios de DNS automatizados de cerbot configurando el archivo `/root/.cloudflare.ini` con el token de la API en cloud-init/user-data durante la configuración inicial del VPS, o crear este archivo y ejecutar el script de nuevo. Esto gestionará los cambios de DNS y las actualizaciones de desafío automáticamente.

### ¿Cuál es el nombre de usuario y la contraseña de autenticación básica? {#what-is-the-basic-auth-username-and-password}

Para el autoalojamiento, añadimos una ventana emergente de autenticación nativa del navegador para el primer acceso con un nombre de usuario simple (`admin`) y una contraseña (generada aleatoriamente durante la configuración inicial). Esto se añade como protección en caso de que la automatización o los scrapers se adelanten a su primer registro en la experiencia web. Puede encontrar esta contraseña después de la configuración inicial en su archivo `.env`, dentro de `AUTH_BASIC_USERNAME` y `AUTH_BASIC_PASSWORD`.

### ¿Cómo sé qué se está ejecutando? {#how-do-i-know-what-is-running}

Puede ejecutar `docker ps` para ver todos los contenedores en ejecución que se generan desde el archivo `docker-compose-self-hosting.yml`. También puede ejecutar `docker ps -a` para verlo todo (incluidos los contenedores que no se están ejecutando).

### ¿Cómo sé si algo que debería estar en ejecución no se está ejecutando? {#how-do-i-know-if-something-isnt-running-that-should-be}

Puedes ejecutar `docker ps -a` para verlo todo (incluidos los contenedores que no se están ejecutando). Es posible que veas un registro de salida o una nota.

### ¿Cómo encuentro registros? {#how-do-i-find-logs}

Puede obtener más registros mediante `docker logs -f <container_name>`. Si se produjo algún error, probablemente se deba a una configuración incorrecta del archivo `.env`.

Dentro de la interfaz de usuario web, puede ver `/admin/emails` y `/admin/logs` para los registros de correo electrónico saliente y los registros de errores respectivamente.

### ¿Por qué se agota el tiempo de espera de mis correos electrónicos salientes? {#why-are-my-outgoing-emails-timing-out}

Si ves un mensaje como "Tiempo de conexión agotado" al conectarte al servidor MX..., quizás debas verificar si el puerto 25 está bloqueado. Es común que los ISP o proveedores de nube lo bloqueen por defecto, por lo que podrías tener que contactar con soporte técnico o abrir un ticket para que lo abran.

#### ¿Qué herramientas debo usar para probar las mejores prácticas de configuración de correo electrónico y la reputación de IP? {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Eche un vistazo a nuestro [Preguntas frecuentes aquí](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).