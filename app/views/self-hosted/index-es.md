# Autoalojado {#self-hosted}


## Tabla de Contenidos {#table-of-contents}

* [Primeros pasos](#getting-started)
* [Requisitos](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Instalación](#install)
  * [Depurar script de instalación](#debug-install-script)
  * [Solicitudes](#prompts)
  * [Configuración inicial (Opción 1)](#initial-setup-option-1)
* [Servicios](#services)
  * [Rutas importantes de archivos](#important-file-paths)
* [Configuración](#configuration)
  * [Configuración inicial de DNS](#initial-dns-setup)
* [Incorporación](#onboarding)
* [Pruebas](#testing)
  * [Creando tu primer alias](#creating-your-first-alias)
  * [Enviando / Recibiendo tu primer correo electrónico](#sending--receiving-your-first-email)
* [Solución de problemas](#troubleshooting)
  * [¿Cuál es el nombre de usuario y contraseña de autenticación básica?](#what-is-the-basic-auth-username-and-password)
  * [¿Cómo sé qué está funcionando?](#how-do-i-know-what-is-running)
  * [¿Cómo sé si algo no está funcionando y debería estarlo?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [¿Cómo encuentro los registros?](#how-do-i-find-logs)
  * [¿Por qué mis correos salientes están agotando el tiempo?](#why-are-my-outgoing-emails-timing-out)


## Primeros pasos {#getting-started}

Nuestra solución de correo electrónico autoalojada, como todos nuestros productos, es 100% de código abierto—tanto frontend como backend. Esto significa:

1. **Transparencia completa**: Cada línea de código que procesa tus correos electrónicos está disponible para escrutinio público
2. **Contribuciones de la comunidad**: Cualquiera puede contribuir con mejoras o corregir problemas
3. **Seguridad mediante apertura**: Las vulnerabilidades pueden ser identificadas y corregidas por una comunidad global
4. **Sin dependencia del proveedor**: Nunca dependes de la existencia de nuestra empresa

Todo el código está disponible en GitHub en <https://github.com/forwardemail/forwardemail.net>, bajo licencia MIT.

La arquitectura incluye contenedores para:

* Servidor SMTP para correo saliente
* Servidores IMAP/POP3 para recuperación de correo
* Interfaz web para administración
* Base de datos para almacenamiento de configuración
* Redis para caché y rendimiento
* SQLite para almacenamiento seguro y cifrado de buzones

> \[!NOTE]
> Asegúrate de revisar nuestro [blog autoalojado](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Y para quienes estén interesados en una versión más desglosada paso a paso, vean nuestras guías basadas en [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) o [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Requisitos {#requirements}

Antes de ejecutar el script de instalación, asegúrate de tener lo siguiente:

* **Sistema operativo**: Un servidor basado en Linux (actualmente soporta Ubuntu 22.04+).
* **Recursos**: 1 vCPU y 2GB de RAM
* **Acceso root**: Privilegios administrativos para ejecutar comandos.
* **Nombre de dominio**: Un dominio personalizado listo para configuración DNS.
* **IP limpia**: Asegúrate de que tu servidor tenga una dirección IP limpia sin reputación previa de spam revisando listas negras. Más info [aquí](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Dirección IP pública con soporte para el puerto 25
* Capacidad para configurar [PTR inverso](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Soporte IPv4 e IPv6

> \[!TIP]
> Consulta nuestra lista de [proveedores increíbles de servidores de correo](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

La mayoría de los proveedores de nube soportan una configuración cloud-init para cuando se provisiona el servidor privado virtual (VPS). Esta es una excelente manera de establecer algunos archivos y variables de entorno con anticipación para que el script de configuración inicial pueda usarlos y evitar solicitar información adicional mientras se ejecuta.

**Opciones**

* `EMAIL` - correo electrónico usado para recordatorios de expiración de certbot
* `DOMAIN` - dominio personalizado (ej. `example.com`) usado para la configuración de autoalojamiento
* `AUTH_BASIC_USERNAME` - nombre de usuario usado en la configuración inicial para proteger el sitio
* `AUTH_BASIC_PASSWORD` - contraseña usada en la configuración inicial para proteger el sitio
* `/root/.cloudflare.ini` - (**Solo usuarios de Cloudflare**) archivo de configuración de Cloudflare usado por certbot para configuración DNS. Requiere que configures tu token API vía `dns_cloudflare_api_token`. Lee más [aquí](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
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

### Depurar script de instalación {#debug-install-script}

Agregue `DEBUG=true` delante del script de instalación para salida detallada:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Indicaciones {#prompts}

```sh
1. Configuración inicial
2. Configurar copias de seguridad
3. Configurar actualizaciones automáticas
4. Renovar certificados
5. Restaurar desde copia de seguridad
6. Ayuda
7. Salir
```

* **Configuración inicial**: Descarga el código más reciente de forward email, configura el entorno, solicita tu dominio personalizado y configura todos los certificados, claves y secretos necesarios.
* **Configurar copia de seguridad**: Configurará un cron para respaldar mongoDB y redis usando un almacenamiento compatible con S3 para almacenamiento remoto y seguro. Por separado, sqlite se respaldará al iniciar sesión si hay cambios para copias de seguridad seguras y cifradas.
* **Configurar actualización**: Configura un cron para buscar actualizaciones nocturnas que reconstruirán y reiniciarán de forma segura los componentes de la infraestructura.
* **Renovar certificados**: Certbot / lets encrypt se usa para certificados SSL y las claves expirarán cada 3 meses. Esto renovará los certificados para tu dominio y los colocará en la carpeta necesaria para que los componentes relacionados los consuman. Ver [rutas importantes de archivos](#important-file-paths)
* **Restaurar desde copia de seguridad**: Activará mongodb y redis para restaurar desde datos de copia de seguridad.

### Configuración inicial (Opción 1) {#initial-setup-option-1}

Elija la opción `1. Configuración inicial` para comenzar.

Una vez completado, deberías ver un mensaje de éxito. Incluso puedes ejecutar `docker ps` para ver **los** componentes iniciados. Más información sobre los componentes a continuación.


## Servicios {#services}

| Nombre del servicio |         Puerto predeterminado         | Descripción                                            |
| ------------------ | :----------------------------------: | ------------------------------------------------------ |
| Web                |                `443`                  | Interfaz web para todas las interacciones administrativas |
| API                |                `4000`                 | Capa API para abstraer bases de datos                  |
| Bree               |                Ninguno                | Trabajador de tareas y trabajos en segundo plano       |
| SMTP               | `465` (recomendado) / `587`           | Servidor SMTP para correo saliente                      |
| SMTP Bree          |                Ninguno                | Trabajo en segundo plano SMTP                            |
| MX                 |                `2525`                 | Intercambio de correo para correo entrante y reenvío   |
| IMAP               |              `993/2993`               | Servidor IMAP para correo entrante y gestión de buzones |
| POP3               |              `995/2995`               | Servidor POP3 para correo entrante y gestión de buzones |
| SQLite             |                `3456`                 | Servidor SQLite para interacciones con bases de datos sqlite |
| SQLite Bree        |                Ninguno                | Trabajo en segundo plano SQLite                          |
| CalDAV             |                `5000`                 | Servidor CalDAV para gestión de calendarios             |
| CardDAV            |                `6000`                 | Servidor CardDAV para gestión de calendarios            |
| MongoDB            |               `27017`                 | Base de datos MongoDB para la mayoría de la gestión de datos |
| Redis              |                `6379`                 | Redis para caché y gestión de estado                     |
| SQLite             |                Ninguno                | Base(s) de datos SQLite para buzones cifrados           |

### Rutas importantes de archivos {#important-file-paths}

Nota: *Ruta del host* abajo es relativa a `/root/forwardemail.net/self-hosting/`.

| Componente             |       Ruta del host       | Ruta en contenedor           |
| ---------------------- | :-----------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`       | `/backups`                   |
| Redis                  |     `./redis-data`        | `/data`                      |
| Sqlite                 |    `./sqlite-data`        | `/mnt/{SQLITE_STORAGE_PATH}` |
| Archivo Env            |        `./.env`           | `/app/.env`                  |
| Certificados/llaves SSL|        `./ssl`            | `/app/ssl/`                  |
| Llave privada          |  `./ssl/privkey.pem`      | `/app/ssl/privkey.pem`       |
| Certificado cadena completa | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`     |
| Certificado CA         |    `./ssl/cert.pem`       | `/app/ssl/cert.pem`          |
| Llave privada DKIM     |    `./ssl/dkim.key`       | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Guarde el archivo `.env` de forma segura. Es fundamental para la recuperación en caso de fallo.
> Puede encontrarlo en `/root/forwardemail.net/self-hosting/.env`.


## Configuración {#configuration}

### Configuración inicial de DNS {#initial-dns-setup}

En el proveedor de DNS de su elección, configure los registros DNS apropiados. Tenga en cuenta que todo lo que esté entre corchetes (`<>`) es dinámico y debe actualizarse con su valor.

| Tipo  | Nombre             | Contenido                    | TTL  |
| ----- | ------------------ | ---------------------------- | ---- |
| A     | "@", ".", o vacío  | <ip_address>                 | auto |
| CNAME | api                | <domain_name>                | auto |
| CNAME | caldav             | <domain_name>                | auto |
| CNAME | carddav            | <domain_name>                | auto |
| CNAME | fe-bounces         | <domain_name>                | auto |
| CNAME | imap               | <domain_name>                | auto |
| CNAME | mx                 | <domain_name>                | auto |
| CNAME | pop3               | <domain_name>                | auto |
| CNAME | smtp               | <domain_name>                | auto |
| MX    | "@", ".", o vacío  | mx.<domain_name> (prioridad 0) | auto |
| TXT   | "@", ".", o vacío  | "v=spf1 a -all"              | auto |

#### DNS inverso / registro PTR {#reverse-dns--ptr-record}

El DNS inverso (rDNS) o registros de puntero inverso (registros PTR) son esenciales para los servidores de correo electrónico porque ayudan a verificar la legitimidad del servidor que envía el correo. Cada proveedor de nube lo hace de manera diferente, por lo que deberá buscar cómo agregar "DNS inverso" para mapear el host y la IP a su nombre de host correspondiente. Lo más probable es que esté en la sección de redes del proveedor.

#### Puerto 25 bloqueado {#port-25-blocked}

Algunos ISP y proveedores de nube bloquean el puerto 25 para evitar actores malintencionados. Es posible que necesite abrir un ticket de soporte para habilitar el puerto 25 para SMTP / correo saliente.


## Incorporación {#onboarding}

1. Abra la página de inicio
   Navegue a https\://\<domain_name>, reemplazando \<domain_name> con el dominio configurado en sus ajustes DNS. Debería ver la página de inicio de Forward Email.

2. Inicie sesión y configure su dominio

* Inicie sesión con un correo electrónico y contraseña válidos.
* Ingrese el nombre de dominio que desea configurar (debe coincidir con la configuración DNS).
* Siga las indicaciones para agregar los registros **MX** y **TXT** requeridos para la verificación.

3. Complete la configuración

* Una vez verificado, acceda a la página de Alias para crear su primer alias.
* Opcionalmente, configure **SMTP para correo saliente** en la **Configuración del dominio**. Esto requiere registros DNS adicionales.

> \[!NOTE]
> No se envía información fuera de su servidor. La opción autoalojada y la cuenta inicial son solo para el inicio de sesión de administrador y la vista web para gestionar dominios, alias y configuraciones de correo relacionadas.


## Pruebas {#testing}

### Creando su primer alias {#creating-your-first-alias}

1. Navegue a la página de Alias
   Abra la página de gestión de alias:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Agregue un nuevo alias

* Haga clic en **Agregar alias** (arriba a la derecha).
* Ingrese el nombre del alias y ajuste la configuración de correo según sea necesario.
* (Opcional) Active el soporte **IMAP/POP3/CalDAV/CardDAV** seleccionando la casilla.
* Haga clic en **Crear alias.**

3. Establezca una contraseña

* Haga clic en **Generar contraseña** para crear una contraseña segura.
* Esta contraseña será necesaria para iniciar sesión en su cliente de correo.

4. Configure su cliente de correo

* Use un cliente de correo como Thunderbird.
* Ingrese el nombre del alias y la contraseña generada.
* Configure los ajustes de **IMAP** y **SMTP** según corresponda.

#### Configuración del servidor de correo {#email-server-settings}

Nombre de usuario: `<alias name>`

| Tipo | Nombre del host    | Puerto | Seguridad de conexión | Autenticación   |
| ---- | ------------------ | ------ | --------------------- | --------------- |
| SMTP | smtp.<domain_name> | 465    | SSL / TLS             | Contraseña normal |
| IMAP | imap.<domain_name> | 993    | SSL / TLS             | Contraseña normal |

### Enviando / Recibiendo su primer correo {#sending--receiving-your-first-email}

¡Una vez configurado, debería poder enviar y recibir correos a su dirección de correo recién creada y autoalojada!
## Solución de problemas {#troubleshooting}

#### ¿Por qué no funciona esto fuera de Ubuntu y Debian? {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Actualmente estamos buscando soportar MacOS y consideraremos otros sistemas. Por favor, abre una [discusión](https://github.com/orgs/forwardemail/discussions) o contribuye si te gustaría que se soportaran otros.

#### ¿Por qué falla el desafío acme de certbot? {#why-is-the-certbot-acme-challenge-failing}

El error más común es que certbot / letsencrypt a veces solicita **2** desafíos. Debes asegurarte de agregar **AMBOS** registros txt.

Ejemplo:
Podrías ver dos desafíos así:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

También es posible que la propagación DNS no se haya completado. Puedes usar herramientas como: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Esto te dará una idea si los cambios en tu registro TXT deberían reflejarse. También es posible que la caché DNS local en tu host aún esté usando un valor antiguo o no haya detectado los cambios recientes.

Otra opción es usar los cambios DNS automatizados de certbot configurando el archivo `/root/.cloudflare.ini` con el token de API en tu cloud-init / user-data durante la configuración inicial del VPS o crear este archivo y ejecutar el script nuevamente. Esto gestionará automáticamente los cambios DNS y las actualizaciones del desafío.

### ¿Cuál es el nombre de usuario y contraseña de autenticación básica? {#what-is-the-basic-auth-username-and-password}

Para autoalojamiento, añadimos una ventana emergente de autenticación nativa del navegador la primera vez con un nombre de usuario simple (`admin`) y una contraseña (generada aleatoriamente en la configuración inicial). Esto se añade como protección en caso de que la automatización / scrapers te ganen para el primer registro en la experiencia web. Puedes encontrar esta contraseña después de la configuración inicial en tu archivo `.env` bajo `AUTH_BASIC_USERNAME` y `AUTH_BASIC_PASSWORD`.

### ¿Cómo sé qué está ejecutándose? {#how-do-i-know-what-is-running}

Puedes ejecutar `docker ps` para ver todos los contenedores en ejecución que se están levantando desde el archivo `docker-compose-self-hosting.yml`. También puedes ejecutar `docker ps -a` para ver todo (incluyendo contenedores que no están en ejecución).

### ¿Cómo sé si algo que debería estar ejecutándose no lo está? {#how-do-i-know-if-something-isnt-running-that-should-be}

Puedes ejecutar `docker ps -a` para ver todo (incluyendo contenedores que no están en ejecución). Puede que veas un registro de salida o una nota.

### ¿Cómo encuentro los registros? {#how-do-i-find-logs}

Puedes obtener más registros con `docker logs -f <container_name>`. Si algo salió, probablemente esté relacionado con que el archivo `.env` está configurado incorrectamente.

Dentro de la interfaz web, puedes ver `/admin/emails` y `/admin/logs` para los registros de correos salientes y registros de errores respectivamente.

### ¿Por qué mis correos salientes están agotando el tiempo? {#why-are-my-outgoing-emails-timing-out}

Si ves un mensaje como Connection timed out when connecting to MX server... entonces puede que necesites verificar si el puerto 25 está bloqueado. Es común que los ISP o proveedores de la nube bloqueen esto por defecto, donde puede que necesites contactar soporte / abrir un ticket para que lo habiliten.

#### ¿Qué herramientas debo usar para probar las mejores prácticas de configuración de correo y la reputación IP? {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Echa un vistazo a nuestro [FAQ aquí](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
