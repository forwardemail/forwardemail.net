# Preguntas Frecuentes {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Preguntas frecuentes sobre Forward Email" class="rounded-lg" />


## Tabla de Contenidos {#table-of-contents}

* [Inicio Rápido](#quick-start)
* [Introducción](#introduction)
  * [Qué es Forward Email](#what-is-forward-email)
  * [Quién usa Forward Email](#who-uses-forward-email)
  * [Cuál es la historia de Forward Email](#what-is-forward-emails-history)
  * [Qué tan rápido es este servicio](#how-fast-is-this-service)
* [Clientes de Correo](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Dispositivos Móviles](#mobile-devices)
  * [Configuración de Relay SMTP Sendmail](#sendmail-smtp-relay-configuration)
  * [Configuración de Relay SMTP Exim4](#exim4-smtp-relay-configuration)
  * [Configuración de Cliente SMTP msmtp](#msmtp-smtp-client-configuration)
  * [Clientes de Correo en Línea de Comandos](#command-line-email-clients)
  * [Configuración de Correo en Windows](#windows-email-configuration)
  * [Configuración de Relay SMTP Postfix](#postfix-smtp-relay-configuration)
  * [Cómo Enviar Correo Como usando Gmail](#how-to-send-mail-as-using-gmail)
  * [Cuál es la guía gratuita heredada para Enviar Correo Como usando Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Configuración Avanzada de Enrutamiento en Gmail](#advanced-gmail-routing-configuration)
  * [Configuración Avanzada de Enrutamiento en Outlook](#advanced-outlook-routing-configuration)
* [Solución de Problemas](#troubleshooting)
  * [Por qué no recibo mis correos de prueba](#why-am-i-not-receiving-my-test-emails)
  * [Cómo configuro mi cliente de correo para trabajar con Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Por qué mis correos llegan a Spam y Correo no deseado y cómo puedo verificar la reputación de mi dominio](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Qué debo hacer si recibo correos spam](#what-should-i-do-if-i-receive-spam-emails)
  * [Por qué mis correos de prueba enviados a mí mismo en Gmail aparecen como "sospechosos"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Puedo eliminar el via forwardemail dot net en Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Gestión de Datos](#data-management)
  * [Dónde están ubicados sus servidores](#where-are-your-servers-located)
  * [Cómo exporto y respaldo mi buzón](#how-do-i-export-and-backup-my-mailbox)
  * [Cómo importo y migro mi buzón existente](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Cómo uso mi propio almacenamiento compatible con S3 para respaldos](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Cómo convierto respaldos SQLite a archivos EML](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Soportan autoalojamiento](#do-you-support-self-hosting)
* [Configuración de Correo](#email-configuration)
  * [Cómo empiezo y configuro el reenvío de correo](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Puedo usar múltiples intercambios MX y servidores para reenvío avanzado](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Cómo configuro un contestador de vacaciones (respuesta automática fuera de la oficina)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Cómo configuro SPF para Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Cómo configuro DKIM para Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Cómo configuro DMARC para Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Cómo veo los Reportes DMARC](#how-do-i-view-dmarc-reports)
  * [Cómo conecto y configuro mis contactos](#how-do-i-connect-and-configure-my-contacts)
  * [Cómo conecto y configuro mis calendarios](#how-do-i-connect-and-configure-my-calendars)
  * [Cómo agrego más calendarios y gestiono calendarios existentes](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Cómo conecto y configuro tareas y recordatorios](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Por qué no puedo crear tareas en Recordatorios de macOS](#why-cant-i-create-tasks-in-macos-reminders)
  * [Cómo configuro Tasks.org en Android](#how-do-i-set-up-tasksorg-on-android)
  * [Cómo configuro SRS para Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Cómo configuro MTA-STS para Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Cómo agrego una foto de perfil a mi dirección de correo](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Funciones Avanzadas](#advanced-features)
  * [Soportan boletines o listas de correo para email relacionado con marketing](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Soportan envío de correo con API](#do-you-support-sending-email-with-api)
  * [Soportan recepción de correo con IMAP](#do-you-support-receiving-email-with-imap)
  * [Soportan POP3](#do-you-support-pop3)
  * [Soportan calendarios (CalDAV)](#do-you-support-calendars-caldav)
  * [Soportan tareas y recordatorios (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Soportan contactos (CardDAV)](#do-you-support-contacts-carddav)
  * [Soportan envío de correo con SMTP](#do-you-support-sending-email-with-smtp)
  * [Soportan OpenPGP/MIME, cifrado de extremo a extremo ("E2EE") y Web Key Directory ("WKD")] (#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Soportan cifrado S/MIME](#do-you-support-smime-encryption)
  * [Soportan filtrado de correo con Sieve](#do-you-support-sieve-email-filtering)
  * [Soportan MTA-STS](#do-you-support-mta-sts)
  * [Soportan passkeys y WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Soportan buenas prácticas de correo electrónico](#do-you-support-email-best-practices)
  * [Soportan webhooks de rebotes](#do-you-support-bounce-webhooks)
  * [Soportan webhooks](#do-you-support-webhooks)
  * [Soportan expresiones regulares o regex](#do-you-support-regular-expressions-or-regex)
  * [Cuáles son sus límites SMTP de salida](#what-are-your-outbound-smtp-limits)
  * [Necesito aprobación para habilitar SMTP](#do-i-need-approval-to-enable-smtp)
  * [Cuáles son las configuraciones de servidor SMTP](#what-are-your-smtp-server-configuration-settings)
  * [Cuáles son las configuraciones de servidor IMAP](#what-are-your-imap-server-configuration-settings)
  * [Cuáles son las configuraciones de servidor POP3](#what-are-your-pop3-server-configuration-settings)
  * [Cómo configuro autodiscovery de correo para mi dominio](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Seguridad](#security-1)
  * [Técnicas Avanzadas de Endurecimiento de Servidor](#advanced-server-hardening-techniques)
  * [Tienen certificaciones SOC 2 o ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Usan cifrado TLS para el reenvío de correo](#do-you-use-tls-encryption-for-email-forwarding)
  * [Preservan los encabezados de autenticación de correo](#do-you-preserve-email-authentication-headers)
  * [Preservan los encabezados originales del correo y previenen suplantación](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Cómo protegen contra spam y abuso](#how-do-you-protect-against-spam-and-abuse)
  * [Almacenan contenido de correo en disco](#do-you-store-email-content-on-disk)
  * [Puede el contenido de correo exponerse durante fallos del sistema](#can-email-content-be-exposed-during-system-crashes)
  * [Quién tiene acceso a su infraestructura de correo](#who-has-access-to-your-email-infrastructure)
  * [Qué proveedores de infraestructura usan](#what-infrastructure-providers-do-you-use)
  * [Ofrecen un Acuerdo de Procesamiento de Datos (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Cómo manejan notificaciones de brechas de datos](#how-do-you-handle-data-breach-notifications)
  * [Ofrecen un entorno de prueba](#do-you-offer-a-test-environment)
  * [Proveen herramientas de monitoreo y alertas](#do-you-provide-monitoring-and-alerting-tools)
  * [Cómo aseguran alta disponibilidad](#how-do-you-ensure-high-availability)
  * [Cumplen con la Sección 889 de la Ley de Autorización de Defensa Nacional (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Detalles del Sistema y Técnicos](#system-and-technical-details)
  * [Almacenan correos y su contenido](#do-you-store-emails-and-their-contents)
  * [Cómo funciona su sistema de reenvío de correo](#how-does-your-email-forwarding-system-work)
  * [Cómo procesan un correo para reenvío](#how-do-you-process-an-email-for-forwarding)
  * [Cómo manejan problemas de entrega de correo](#how-do-you-handle-email-delivery-issues)
  * [Cómo manejan que sus direcciones IP sean bloqueadas](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Qué son las direcciones postmaster](#what-are-postmaster-addresses)
  * [Qué son las direcciones no-reply](#what-are-no-reply-addresses)
  * [Cuáles son las direcciones IP de sus servidores](#what-are-your-servers-ip-addresses)
  * [Tienen una lista blanca](#do-you-have-an-allowlist)
  * [Qué extensiones de nombres de dominio están en la lista blanca por defecto](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Cuál es su criterio para la lista blanca](#what-is-your-allowlist-criteria)
  * [Qué extensiones de nombres de dominio pueden usarse gratis](#what-domain-name-extensions-can-be-used-for-free)
  * [Tienen una lista gris](#do-you-have-a-greylist)
  * [Tienen una lista negra](#do-you-have-a-denylist)
  * [Tienen limitación de tasa](#do-you-have-rate-limiting)
  * [Cómo protegen contra backscatter](#how-do-you-protect-against-backscatter)
  * [Prevenir rebotes de spammers conocidos MAIL FROM](#prevent-bounces-from-known-mail-from-spammers)
  * [Prevenir rebotes innecesarios para proteger contra backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Cómo determinan la huella digital de un correo](#how-do-you-determine-an-email-fingerprint)
  * [Puedo reenviar correos a puertos distintos del 25 (por ejemplo, si mi ISP bloqueó el puerto 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Soporta el símbolo más + para alias de Gmail](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Soporta subdominios](#does-it-support-sub-domains)
  * [Este reenvía los encabezados de mi correo](#does-this-forward-my-emails-headers)
  * [Está bien probado](#is-this-well-tested)
  * [Pasan mensajes y códigos de respuesta SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Cómo previenen spammers y aseguran buena reputación de reenvío de correo](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Cómo realizan consultas DNS en nombres de dominio](#how-do-you-perform-dns-lookups-on-domain-names)
* [Cuenta y Facturación](#account-and-billing)
  * [Ofrecen garantía de devolución de dinero en planes pagos](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Si cambio de plan, hacen prorrateo y reembolsan la diferencia](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Puedo usar este servicio de reenvío de correo solo como servidor MX "de respaldo" o "fallover"](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Puedo deshabilitar alias específicos](#can-i-disable-specific-aliases)
  * [Puedo reenviar correos a múltiples destinatarios](#can-i-forward-emails-to-multiple-recipients)
  * [Puedo tener múltiples destinatarios globales catch-all](#can-i-have-multiple-global-catch-all-recipients)
  * [Hay un límite máximo en la cantidad de direcciones de correo a las que puedo reenviar por alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Puedo reenviar correos recursivamente](#can-i-recursively-forward-emails)
  * [Pueden las personas cancelar o registrar mi reenvío de correo sin mi permiso](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Cómo es gratis](#how-is-it-free)
  * [Cuál es el límite máximo de tamaño de correo](#what-is-the-max-email-size-limit)
  * [Almacenan registros de correos](#do-you-store-logs-of-emails)
  * [Almacenan registros de errores](#do-you-store-error-logs)
  * [Leen mis correos](#do-you-read-my-emails)
  * [Puedo "enviar correo como" en Gmail con esto](#can-i-send-mail-as-in-gmail-with-this)
  * [Puedo "enviar correo como" en Outlook con esto](#can-i-send-mail-as-in-outlook-with-this)
  * [Puedo "enviar correo como" en Apple Mail y iCloud Mail con esto](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Puedo reenviar correos ilimitados con esto](#can-i-forward-unlimited-emails-with-this)
  * [Ofrecen dominios ilimitados por un precio](#do-you-offer-unlimited-domains-for-one-price)
  * [Qué métodos de pago aceptan](#which-payment-methods-do-you-accept)
* [Recursos Adicionales](#additional-resources)
## Inicio Rápido {#quick-start}

Para comenzar con Forward Email:

1. **Crea una cuenta** en [forwardemail.net/register](https://forwardemail.net/register)

2. **Agrega y verifica tu dominio** en [Mi Cuenta → Dominios](/my-account/domains)

3. **Agrega y configura alias/buzones de correo** en [Mi Cuenta → Dominios](/my-account/domains) → Alias

4. **Prueba tu configuración** enviando un correo a uno de tus nuevos alias

> \[!TIP]
> Los cambios en DNS pueden tardar hasta 24-48 horas en propagarse globalmente, aunque a menudo surten efecto mucho antes.

> \[!IMPORTANT]
> Para mejorar la entregabilidad, recomendamos configurar los registros [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) y [DMARC](#how-do-i-set-up-dmarc-for-forward-email).


## Introducción {#introduction}

### Qué es Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email es perfecto para individuos, pequeñas empresas y desarrolladores que desean direcciones de correo profesionales sin el costo y mantenimiento de una solución completa de alojamiento de correo.

Forward Email es un **proveedor de servicios de correo electrónico completamente funcional** y **proveedor de alojamiento de correo para nombres de dominio personalizados**.

Es el único servicio gratuito y de código abierto, y te permite usar direcciones de correo con dominio personalizado sin la complejidad de configurar y mantener tu propio servidor de correo.

Nuestro servicio reenvía los correos enviados a tu dominio personalizado a tu cuenta de correo existente – e incluso puedes usarnos como tu proveedor dedicado de alojamiento de correo.

Características clave de Forward Email:

* **Correo con Dominio Personalizado**: Usa direcciones de correo profesionales con tu propio nombre de dominio
* **Nivel Gratuito**: Reenvío básico de correo sin costo
* **Privacidad Mejorada**: No leemos tus correos ni vendemos tus datos
* **Código Abierto**: Todo nuestro código está disponible en GitHub
* **Soporte SMTP, IMAP y POP3**: Capacidades completas para enviar y recibir correo
* **Cifrado de Extremo a Extremo**: Soporte para OpenPGP/MIME
* **Alias Catch-All Personalizados**: Crea alias de correo ilimitados

Puedes compararnos con más de 56 otros proveedores de servicios de correo en [nuestra página de Comparación de Email](/blog/best-email-service).

> \[!TIP]
> Aprende más sobre Forward Email leyendo nuestro [Whitepaper Técnico](/technical-whitepaper.pdf) gratuito

### Quién usa Forward Email {#who-uses-forward-email}

Proveemos servicios de alojamiento y reenvío de correo a más de 1.6+ million dominios y estos usuarios destacados:

| Cliente                                 | Estudio de Caso                                                                                          |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Academia Naval de EE.UU.                 | [:page_facing_up: Estudio de Caso](/blog/docs/federal-government-email-service-section-889-compliant)    |
| Canonical                               | [:page_facing_up: Estudio de Caso](/blog/docs/canonical-ubuntu-email-enterprise-case-study)              |
| Netflix Games                           |                                                                                                          |
| The Linux Foundation                    | [:page_facing_up: Estudio de Caso](/blog/docs/linux-foundation-email-enterprise-case-study)              |
| The PHP Foundation                      |                                                                                                          |
| Fox News Radio                         |                                                                                                          |
| Disney Ad Sales                        |                                                                                                          |
| jQuery                                  | [:page_facing_up: Estudio de Caso](/blog/docs/linux-foundation-email-enterprise-case-study)              |
| LineageOS                              |                                                                                                          |
| Ubuntu                                 | [:page_facing_up: Estudio de Caso](/blog/docs/canonical-ubuntu-email-enterprise-case-study)              |
| Kubuntu                                | [:page_facing_up: Estudio de Caso](/blog/docs/canonical-ubuntu-email-enterprise-case-study)              |
| Lubuntu                                | [:page_facing_up: Estudio de Caso](/blog/docs/canonical-ubuntu-email-enterprise-case-study)              |
| Universidad de Cambridge               | [:page_facing_up: Estudio de Caso](/blog/docs/alumni-email-forwarding-university-case-study)             |
| Universidad de Maryland                | [:page_facing_up: Estudio de Caso](/blog/docs/alumni-email-forwarding-university-case-study)             |
| Universidad de Washington              | [:page_facing_up: Estudio de Caso](/blog/docs/alumni-email-forwarding-university-case-study)             |
| Universidad Tufts                     | [:page_facing_up: Estudio de Caso](/blog/docs/alumni-email-forwarding-university-case-study)             |
| Swarthmore College                    | [:page_facing_up: Estudio de Caso](/blog/docs/alumni-email-forwarding-university-case-study)             |
| Gobierno de Australia del Sur          |                                                                                                          |
| Gobierno de República Dominicana       |                                                                                                          |
| Fly<span>.</span>io                    |                                                                                                          |
| RCD Hotels                            |                                                                                                          |
| Isaac Z. Schlueter (npm)               | [:page_facing_up: Estudio de Caso](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Cuál es la historia de Forward Email {#what-is-forward-emails-history}

Puedes aprender más sobre Forward Email en [nuestra página Acerca de](/about).

### Qué tan rápido es este servicio {#how-fast-is-this-service}

> \[!NOTE]
> Nuestro sistema está diseñado para velocidad y confiabilidad, con múltiples servidores redundantes para asegurar que tus correos se entreguen puntualmente.

Forward Email entrega mensajes con un retraso mínimo, típicamente en segundos desde la recepción.

Métricas de rendimiento:

* **Tiempo promedio de entrega**: Menos de 5-10 segundos desde la recepción hasta el reenvío ([consulta nuestra página de monitoreo Tiempo a la Bandeja "TTI"](/tti))
* **Disponibilidad**: 99.9%+ de disponibilidad del servicio
* **Infraestructura global**: Servidores ubicados estratégicamente para un enrutamiento óptimo
* **Escalado automático**: Nuestro sistema escala durante los picos de correo electrónico

Operamos en tiempo real, a diferencia de otros proveedores que dependen de colas con retraso.

No escribimos en disco ni almacenamos registros – con la [excepción de errores](#do-you-store-error-logs) y [SMTP saliente](#do-you-support-sending-email-with-smtp) (consulta nuestra [Política de Privacidad](/privacy)).

Todo se realiza en memoria y [nuestro código fuente está en GitHub](https://github.com/forwardemail).


## Clientes de Correo {#email-clients}

### Thunderbird {#thunderbird}

1. Crea un alias nuevo y genera una contraseña en tu panel de Forward Email
2. Abre Thunderbird y ve a **Editar → Configuración de cuentas → Acciones de cuenta → Añadir cuenta de correo**
3. Ingresa tu nombre, dirección de Forward Email y contraseña
4. Haz clic en **Configurar manualmente** e ingresa:
   * Entrante: IMAP, `imap.forwardemail.net`, puerto 993, SSL/TLS
   * Saliente: SMTP, `smtp.forwardemail.net`, puerto 465, SSL/TLS (recomendado; también se soporta puerto 587 con STARTTLS)
5. Haz clic en **Hecho**

### Microsoft Outlook {#microsoft-outlook}

1. Crea un alias nuevo y genera una contraseña en tu panel de Forward Email
2. Ve a **Archivo → Agregar cuenta**
3. Ingresa tu dirección de Forward Email y haz clic en **Conectar**
4. Elige **Opciones avanzadas** y selecciona **Permítame configurar mi cuenta manualmente**
5. Selecciona **IMAP** e ingresa:
   * Entrante: `imap.forwardemail.net`, puerto 993, SSL
   * Saliente: `smtp.forwardemail.net`, puerto 465, SSL/TLS (recomendado; también se soporta puerto 587 con STARTTLS)
   * Nombre de usuario: Tu dirección de correo completa
   * Contraseña: Tu contraseña generada
6. Haz clic en **Conectar**

### Apple Mail {#apple-mail}

1. Crea un alias nuevo y genera una contraseña en tu panel de Forward Email
2. Ve a **Correo → Preferencias → Cuentas → +**
3. Selecciona **Otra cuenta de correo**
4. Ingresa tu nombre, dirección de Forward Email y contraseña
5. Para la configuración del servidor, ingresa:
   * Entrante: `imap.forwardemail.net`
   * Saliente: `smtp.forwardemail.net`
   * Nombre de usuario: Tu dirección de correo completa
   * Contraseña: Tu contraseña generada
6. Haz clic en **Iniciar sesión**

### eM Client {#em-client}

1. Crea un alias nuevo y genera una contraseña en tu panel de Forward Email
2. Abre eM Client y ve a **Menú → Cuentas → + Añadir cuenta**
3. Haz clic en **Correo** y luego selecciona **Otro**
4. Ingresa tu dirección de Forward Email y haz clic en **Siguiente**
5. Ingresa la siguiente configuración de servidores:
   * **Servidor entrante**: `imap.forwardemail.net`
   * **Servidor saliente**: `smtp.forwardemail.net`
6. Ingresa tu dirección de correo completa como **Nombre de usuario** y tu contraseña generada como **Contraseña** para ambos servidores, entrante y saliente.
7. eM Client probará la conexión. Una vez que pase, haz clic en **Siguiente**.
8. Ingresa tu nombre y elige un nombre para la cuenta.
9. Haz clic en **Finalizar**.

### Dispositivos Móviles {#mobile-devices}

Para iOS:

1. Ve a **Configuración → Correo → Cuentas → Añadir cuenta → Otro**
2. Toca **Añadir cuenta de correo** e ingresa tus datos
3. Para la configuración del servidor, usa las mismas configuraciones IMAP y SMTP mencionadas arriba

Para Android:

1. Ve a **Configuración → Cuentas → Añadir cuenta → Personal (IMAP)**
2. Ingresa tu dirección de Forward Email y contraseña
3. Para la configuración del servidor, usa las mismas configuraciones IMAP y SMTP mencionadas arriba

### Configuración de Relay SMTP de Sendmail {#sendmail-smtp-relay-configuration}

Puedes configurar Sendmail para reenviar correos a través de los servidores SMTP de Forward Email. Esta es una configuración común para sistemas heredados o aplicaciones que dependen de Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
  <span>Menos de 20 minutos</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Esto requiere un plan de pago con acceso SMTP habilitado.
  </span>
</div>

#### Configuración {#configuration}

1. Edite su archivo `sendmail.mc`, típicamente ubicado en `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Agregue las siguientes líneas para definir el smart host y la autenticación:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Cree el archivo de autenticación `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Agregue sus credenciales de Forward Email al archivo `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Genere la base de datos de autenticación y asegure los archivos:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Reconstruya la configuración de Sendmail y reinicie el servicio:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Pruebas {#testing}

Envíe un correo de prueba para verificar la configuración:

```bash
echo "Correo de prueba desde Sendmail" | mail -s "Prueba Sendmail" recipient@example.com
```

### Configuración de relé SMTP Exim4 {#exim4-smtp-relay-configuration}

Exim4 es un MTA popular en sistemas basados en Debian. Puede configurarlo para usar Forward Email como smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
  <span>Menos de 15 minutos</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Esto requiere un plan de pago con acceso SMTP habilitado.
  </span>
</div>

#### Configuración {#configuration-1}

1. Ejecute la herramienta de configuración de Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Seleccione las siguientes opciones:
   * **Tipo general de configuración de correo:** correo enviado por smarthost; recibido vía SMTP o fetchmail
   * **Nombre del sistema de correo:** your.hostname
   * **Direcciones IP para escuchar conexiones SMTP entrantes:** 127.0.0.1 ; ::1
   * **Otros destinos para los que se acepta correo:** (dejar en blanco)
   * **Dominios para los que se retransmite correo:** (dejar en blanco)
   * **Dirección IP o nombre del host del smarthost saliente:** smtp.forwardemail.net::465
   * **¿Ocultar el nombre local del correo en el correo saliente?** No
   * **¿Mantener el número de consultas DNS al mínimo (Dial-on-Demand)?** No
   * **Método de entrega para correo local:** formato Mbox en /var/mail/
   * **¿Dividir configuración en archivos pequeños?** No

3. Edite el archivo `passwd.client` para agregar sus credenciales:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Agregue la siguiente línea:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Actualice la configuración y reinicie Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Pruebas {#testing-1}

Envíe un correo de prueba:

```bash
echo "Prueba desde Exim4" | mail -s "Prueba Exim4" recipient@example.com
```

### Configuración del cliente SMTP msmtp {#msmtp-smtp-client-configuration}

msmtp es un cliente SMTP ligero útil para enviar correos desde scripts o aplicaciones de línea de comandos.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
  <span>Menos de 10 minutos</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Esto requiere un plan de pago con acceso SMTP habilitado.
  </span>
</div>

#### Configuración {#configuration-2}

1. Cree o edite el archivo de configuración de msmtp en `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Agregue la siguiente configuración:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. Establezca los permisos correctos para el archivo de configuración:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Pruebas {#testing-2}

Envíe un correo electrónico de prueba:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Clientes de correo en línea de comandos {#command-line-email-clients}

Clientes de correo populares en línea de comandos como [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org) y [Alpine](https://alpine.x10.mx/alpine/release/) pueden configurarse para usar los servidores SMTP de Forward Email para enviar correos. La configuración será similar a la de `msmtp`, donde proporciona los detalles del servidor SMTP y sus credenciales en los archivos de configuración respectivos (`.muttrc`, `.neomuttrc` o `.pinerc`).

### Configuración de correo en Windows {#windows-email-configuration}

Para usuarios de Windows, puede configurar clientes de correo populares como **Microsoft Outlook** y **eM Client** usando los ajustes IMAP y SMTP proporcionados en su cuenta de Forward Email. Para uso en línea de comandos o scripting, puede usar el cmdlet `Send-MailMessage` de PowerShell (aunque se considera obsoleto) o una herramienta ligera de retransmisión SMTP como [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Configuración de retransmisión SMTP en Postfix {#postfix-smtp-relay-configuration}

Puede configurar Postfix para retransmitir correos a través de los servidores SMTP de Forward Email. Esto es útil para aplicaciones de servidor que necesitan enviar correos.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
  <span>Menos de 15 minutos</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Esto requiere un plan de pago con acceso SMTP habilitado.
  </span>
</div>

#### Instalación {#installation}

1. Instale Postfix en su servidor:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Durante la instalación, seleccione "Internet Site" cuando se le solicite el tipo de configuración.

#### Configuración {#configuration-3}

1. Edite el archivo principal de configuración de Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Agregue o modifique estas configuraciones:

```
# Configuración de retransmisión SMTP
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Cree el archivo de contraseña SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Agregue sus credenciales de Forward Email:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Proteja y genere el hash del archivo de contraseñas:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Reinicie Postfix:

```bash
sudo systemctl restart postfix
```

#### Pruebas {#testing-3}

Pruebe su configuración enviando un correo de prueba:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Cómo enviar correo como usando Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
  <span>Menos de 10 minutos</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Comenzando:
  </strong>
  <span>
    Si has seguido las instrucciones anteriores en <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Cómo empezar y configurar el reenvío de correo electrónico</a>, entonces puedes continuar leyendo abajo.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Por favor asegúrate de haber leído nuestros <a href="/terms" class="alert-link" target="_blank">Términos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidad</a>, y <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Límites SMTP de salida</a> &ndash; tu uso se considera como reconocimiento y acuerdo.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Si eres desarrollador, consulta nuestra <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentación API de correo electrónico</a>.
  </span>
</div>

1. Ve a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Configuración SMTP de salida y sigue las instrucciones de configuración

2. Crea un nuevo alias para tu dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Aliases (por ejemplo, <code><hello@example.com></code>)

3. Haz clic en <strong class="text-success"><i class="fa fa-key"></i> Generar Contraseña</strong> junto al alias recién creado. Copia al portapapeles y guarda de forma segura la contraseña generada que se muestra en pantalla.

4. Ve a [Gmail](https://gmail.com) y en [Configuración <i class="fa fa-angle-right"></i> Cuentas e importación <i class="fa fa-angle-right"></i> Enviar correo como](https://mail.google.com/mail/u/0/#settings/accounts), haz clic en "Agregar otra dirección de correo electrónico"

5. Cuando se te pida "Nombre", ingresa el nombre que quieres que aparezca como remitente (por ejemplo, "Linus Torvalds").

6. Cuando se te pida "Dirección de correo electrónico", ingresa la dirección completa de un alias que creaste en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Aliases (por ejemplo, <code><hello@example.com></code>)

7. Desmarca "Tratar como un alias"

8. Haz clic en "Siguiente paso" para continuar

9. Cuando se te pida "Servidor SMTP", ingresa <code>smtp.forwardemail.net</code> y cambia el puerto a <code>465</code>

10. Cuando se te pida "Nombre de usuario", ingresa la dirección completa de un alias que creaste en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Aliases (por ejemplo, <code><hello@example.com></code>)

11. Cuando se te pida "Contraseña", pega la contraseña de <strong class="text-success"><i class="fa fa-key"></i> Generar Contraseña</strong> del paso 3 arriba

12. Selecciona el botón de opción para "Conexión segura usando SSL"

13. Haz clic en "Agregar cuenta" para continuar

14. Abre una nueva pestaña en [Gmail](https://gmail.com) y espera a que llegue tu correo de verificación (recibirás un código de verificación que confirma que eres el propietario de la dirección de correo electrónico que intentas "Enviar correo como")

15. Una vez que llegue, copia y pega el código de verificación en el aviso que recibiste en el paso anterior
16. Una vez que hayas hecho eso, vuelve al correo electrónico y haz clic en el enlace para "confirmar la solicitud". Lo más probable es que necesites hacer este paso y el paso anterior para que el correo electrónico esté configurado correctamente.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ¡Felicidades!
    </strong>
    <span>
      Has completado con éxito todos los pasos.
    </span>
  </div>
</div>

</div>

### ¿Qué es la guía legacy free para Enviar correo como usando Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> Esta guía legacy free está obsoleta desde mayo de 2023 ya que <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">ahora soportamos SMTP saliente</a>. Si usas la guía a continuación, entonces <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">esto hará que tu correo saliente</a> diga "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" en Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
  <span>Menos de 10 minutos</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Para empezar:
  </strong>
  <span>
    Si has seguido las instrucciones arriba en <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Cómo empezar y configurar el reenvío de correo</a>, entonces puedes continuar leyendo abajo.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Necesitas tener habilitada la [Autenticación de Dos Factores de Gmail][gmail-2fa] para que esto funcione. Visita <https://www.google.com/landing/2step/> si no la tienes habilitada.

2. Una vez que la Autenticación de Dos Factores esté habilitada (o si ya la tenías habilitada), visita <https://myaccount.google.com/apppasswords>.

3. Cuando se te pida "Selecciona la aplicación y el dispositivo para el que quieres generar la contraseña de la aplicación":
   * Selecciona "Correo" en el menú desplegable de "Seleccionar aplicación"
   * Selecciona "Otro" en el menú desplegable de "Seleccionar dispositivo"
   * Cuando se te pida un texto, ingresa la dirección de correo electrónico de tu dominio personalizado desde la que estás reenviando (por ejemplo, <code><hello@example.com></code> - esto te ayudará a llevar un control en caso de que uses este servicio para varias cuentas)

4. Copia la contraseña que se genera automáticamente en tu portapapeles
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Importante:
     </strong>
     <span>
       Si usas G Suite, visita tu panel de administración <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Aplicaciones <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Configuración para Gmail <i class="fa fa-angle-right"></i> Configuración</a> y asegúrate de marcar "Permitir a los usuarios enviar correo a través de un servidor SMTP externo...". Habrá un retraso para que este cambio se active, así que espera unos minutos.
     </span>
   </div>

5. Ve a [Gmail](https://gmail.com) y en [Configuración <i class="fa fa-angle-right"></i> Cuentas e importación <i class="fa fa-angle-right"></i> Enviar correo como](https://mail.google.com/mail/u/0/#settings/accounts), haz clic en "Agregar otra dirección de correo electrónico"

6. Cuando se te pida "Nombre", ingresa el nombre que quieres que se vea como remitente (por ejemplo, "Linus Torvalds")

7. Cuando se te pida "Dirección de correo electrónico", ingresa la dirección de correo electrónico con el dominio personalizado que usaste arriba (por ejemplo, <code><hello@example.com></code>)
8. Desmarque "Tratar como un alias"

9. Haga clic en "Siguiente paso" para continuar

10. Cuando se le solicite "Servidor SMTP", ingrese <code>smtp.gmail.com</code> y deje el puerto como <code>587</code>

11. Cuando se le solicite "Nombre de usuario", ingrese la parte de su dirección de Gmail sin la parte <span>gmail.com</span> (por ejemplo, solo "usuario" si mi correo es <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Importante:
      </strong>
      <span>
        Si la parte de "Nombre de usuario" se completa automáticamente, entonces <u><strong>deberá cambiar esto</strong></u> a la parte del nombre de usuario de su dirección de Gmail.
      </span>
    </div>

12. Cuando se le solicite "Contraseña", pegue desde su portapapeles la contraseña que generó en el paso 2 anterior

13. Deje seleccionado el botón de opción para "Conexión segura usando TLS"

14. Haga clic en "Agregar cuenta" para continuar

15. Abra una nueva pestaña en [Gmail](https://gmail.com) y espere a que llegue su correo de verificación (recibirá un código de verificación que confirma que usted es el propietario de la dirección de correo electrónico que está intentando "Enviar correo como")

16. Una vez que llegue, copie y pegue el código de verificación en el aviso que recibió en el paso anterior

17. Una vez hecho esto, regrese al correo electrónico y haga clic en el enlace para "confirmar la solicitud". Lo más probable es que necesite realizar este paso y el anterior para que el correo electrónico se configure correctamente.

</div>

### Configuración avanzada de enrutamiento de Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
  <span>15-30 minutos</span>
</div>

Si desea configurar un enrutamiento avanzado en Gmail para que los alias que no coincidan con un buzón se reenvíen a los intercambios de correo de Forward Email, siga estos pasos:

1. Inicie sesión en su consola de administración de Google en [admin.google.com](https://admin.google.com)
2. Vaya a **Aplicaciones → Google Workspace → Gmail → Enrutamiento**
3. Haga clic en **Agregar ruta** y configure los siguientes ajustes:

**Configuración para destinatario único:**

* Seleccione "Cambiar destinatario del sobre" e ingrese su dirección principal de Gmail
* Marque "Agregar encabezado X-Gm-Original-To con destinatario original"

**Patrones de destinatario del sobre:**

* Agregue un patrón que coincida con todos los buzones inexistentes (por ejemplo, `.*@susitio.com`)

**Configuración del servidor de correo:**

* Seleccione "Enrutar al host" e ingrese `mx1.forwardemail.net` como servidor principal
* Agregue `mx2.forwardemail.net` como servidor de respaldo
* Establezca el puerto en 25
* Seleccione "Requerir TLS" para seguridad

4. Haga clic en **Guardar** para crear la ruta

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Esta configuración solo funcionará para cuentas de Google Workspace con dominios personalizados, no para cuentas regulares de Gmail.
  </span>
</div>

### Configuración avanzada de enrutamiento de Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
  <span>15-30 minutos</span>
</div>

Para usuarios de Microsoft 365 (anteriormente Office 365) que desean configurar un enrutamiento avanzado para que los alias que no coincidan con un buzón se reenvíen a los intercambios de correo de Forward Email:

1. Inicie sesión en el centro de administración de Microsoft 365 en [admin.microsoft.com](https://admin.microsoft.com)
2. Vaya a **Exchange → Flujo de correo → Reglas**
3. Haga clic en **Agregar una regla** y seleccione **Crear una nueva regla**
4. Nombre su regla (por ejemplo, "Reenviar buzones inexistentes a Forward Email")
5. Bajo **Aplicar esta regla si**, seleccione:
   * "La dirección del destinatario coincide con..."
   * Ingrese un patrón que coincida con todas las direcciones de su dominio (por ejemplo, `*@susitio.com`)
6. Bajo **Hacer lo siguiente**, seleccione:
   * "Redirigir el mensaje a..."
   * Elija "El siguiente servidor de correo"
   * Ingrese `mx1.forwardemail.net` y puerto 25
   * Agregue `mx2.forwardemail.net` como servidor de respaldo
7. Bajo **Excepto si**, seleccione:
   * "El destinatario es..."
   * Agregue todos sus buzones existentes que no deben ser reenviados
8. Establezca la prioridad de la regla para asegurarse de que se ejecute después de otras reglas de flujo de correo
9. Haga clic en **Guardar** para activar la regla
## Solución de problemas {#troubleshooting}

### ¿Por qué no recibo mis correos electrónicos de prueba? {#why-am-i-not-receiving-my-test-emails}

Si te estás enviando un correo electrónico de prueba a ti mismo, es posible que no aparezca en tu bandeja de entrada porque tiene el mismo encabezado "Message-ID".

Este es un problema ampliamente conocido, y también afecta a servicios como Gmail.  <a href="https://support.google.com/a/answer/1703601">Aquí está la respuesta oficial de Gmail sobre este problema</a>.

Si continúas teniendo problemas, lo más probable es que sea un problema con la propagación del DNS. Deberás esperar un poco más y volver a intentarlo (o intentar establecer un valor TTL más bajo en tus registros <strong class="notranslate">TXT</strong>).

**¿Sigues teniendo problemas?**  Por favor <a href="/help">contáctanos</a> para que podamos ayudar a investigar el problema y encontrar una solución rápida.

### ¿Cómo configuro mi cliente de correo para que funcione con Forward Email? {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Nuestro servicio funciona con clientes de correo populares como:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Escritorio</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Tu nombre de usuario es la dirección de correo electrónico de tu alias y la contraseña es la que obtienes de <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> ("Contraseña normal").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
  <span>Si usas Thunderbird, asegúrate de que "Seguridad de conexión" esté configurada en "SSL/TLS" y que el método de autenticación esté configurado en "Contraseña normal".</span>
</div>

| Tipo |         Nombre de host        |         Protocolo        |                                            Puertos                                           |
| :--: | :---------------------------: | :---------------------: | :------------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net`       |  SSL/TLS **Preferido**  |                                      `993` y `2993`                                         |
| SMTP | `smtp.forwardemail.net`       | SSL/TLS **Recomendado** | `465` y `2465` para SSL/TLS (recomendado) o `587`, `2587`, `2525` y `25` para STARTTLS      |

### ¿Por qué mis correos electrónicos llegan a Spam y Correo no deseado y cómo puedo verificar la reputación de mi dominio? {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Esta sección te guía si tu correo saliente está usando nuestros servidores SMTP (por ejemplo, `smtp.forwardemail.net`) (o reenviado a través de `mx1.forwardemail.net` o `mx2.forwardemail.net`) y está siendo entregado en la carpeta de Spam o Correo no deseado de los destinatarios.

Rutinariamente monitoreamos nuestras [direcciones IP](#what-are-your-servers-ip-addresses) contra [todas las listas negras DNS reputables](#how-do-you-handle-your-ip-addresses-becoming-blocked), **por lo tanto, es muy probable que sea un problema específico de reputación del dominio**.

Los correos electrónicos pueden llegar a carpetas de spam por varias razones:

1. **Falta de Autenticación**: Configura los registros [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) y [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Reputación del Dominio**: Los dominios nuevos suelen tener una reputación neutral hasta que establecen un historial de envío.

3. **Disparadores de Contenido**: Ciertas palabras o frases pueden activar los filtros de spam.

4. **Patrones de Envío**: Aumentos repentinos en el volumen de correos pueden parecer sospechosos.

Puedes intentar usar una o más de estas herramientas para verificar la reputación y categorización de tu dominio:

#### Herramientas para Verificar Reputación y Listas Negras {#reputation-and-blocklist-check-tools}

| Nombre de la Herramienta                   | URL                                                          | Tipo                   |
| ----------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback | <https://radar.cloudflare.com/domains/feedback>              | Categorización         |
| Spamhaus IP and Domain Reputation Checker | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Reputación             |
| Barracuda IP and Domain Reputation Lookup | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                | <https://mxtoolbox.com/blacklists.aspx>                      | Lista negra            |
| Google Postmaster Tools                   | <https://www.gmail.com/postmaster/>                          | Reputación             |
| Yahoo Sender Hub                          | <https://senders.yahooinc.com/>                              | Reputación             |
| MultiRBL.valli.org Blacklist Check        | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                              | <https://senderscore.org/act/blocklist-remover/>             | Reputación             |
| Invaluement                               | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                     | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                   | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3           | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org            | <https://www.backscatterer.org/>                             | Protección contra backscatter |
| UCEPROTECT's whitelisted.org              | <https://www.whitelisted.org/> (requiere pago)               | DNSWL                  |

#### Formularios de Solicitud de Eliminación de IP por Proveedor {#ip-removal-request-forms-by-provider}

Si tu dirección IP ha sido bloqueada por un proveedor de correo específico, usa el formulario de eliminación o contacto apropiado a continuación:

| Proveedor                              | Formulario de Eliminación / Contacto                                                                 | Notas                                        |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                         | <https://support.google.com/mail/contact/bulk_send_new>                                              | Formulario de contacto para remitentes masivos |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                          | Portal de eliminación de IP de Office 365    |
| Yahoo/AOL/Verizon                    | <https://senders.yahooinc.com/>                                                                      | Yahoo Sender Hub                             |
| Apple/iCloud                       | <https://ipcheck.proofpoint.com/>                                                                    | Apple usa Proofpoint para reputación de IP   |
| Proofpoint                         | <https://ipcheck.proofpoint.com/>                                                                    | Verificación y eliminación de IP en Proofpoint |
| Barracuda Networks                 | <https://www.barracudacentral.org/lookups/lookup-reputation>                                         | Consulta y eliminación de reputación Barracuda |
| Cloudmark                        | <https://csi.cloudmark.com/en/reset/>                                                                | Solicitud de reinicio Cloudmark CSI          |
| GoDaddy/SecureServer               | <https://unblock.secureserver.net>                                                                   | Formulario de solicitud de desbloqueo GoDaddy |
| Comcast/Xfinity                  | <https://spa.xfinity.com/report>                                                                     | Solicitud de eliminación de IP Comcast       |
| Charter/Spectrum                 | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                          | Contacta soporte Spectrum para eliminación   |
| AT&T                               | `abuse_rbl@abuse-att.net`                                                                            | Correo para solicitud de eliminación         |
| Cox Communications               | `unblock.request@cox.net`                                                                            | Correo para solicitud de eliminación         |
| CenturyLink/Lumen                | `abuse@centurylink.com`                                                                              | Usa Cloudfilter                              |
| Windstream                       | `abuse@windstream.net`                                                                               | Correo para solicitud de eliminación         |
| t-online.de (Alemania)           | `tobr@rx.t-online.de`                                                                                | Correo para solicitud de eliminación         |
| Orange France                    | <https://postmaster.orange.fr/>                                                                      | Usa formulario de contacto o correo `abuse@orange.fr` |
| GMX                              | <https://postmaster.gmx.net/en/contact>                                                              | Formulario de contacto del postmaster GMX    |
| Mail.ru                          | <https://postmaster.mail.ru/>                                                                        | Portal del postmaster Mail.ru                 |
| Yandex                           | <https://postmaster.yandex.ru/>                                                                      | Portal del postmaster Yandex                  |
| QQ Mail (Tencent)                | <https://open.mail.qq.com/>                                                                          | Solicitud de lista blanca QQ Mail (Chino)    |
| Netease (163.com)                | <https://mail.163.com/postmaster/>                                                                   | Portal del postmaster Netease                 |
| Alibaba/Aliyun/HiChina           | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                 | Contacto vía consola Alibaba Cloud            |
| Amazon SES                      | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                         | Consola AWS SES > Eliminación de lista negra |
| SendGrid                       | <https://support.sendgrid.com/>                                                                      | Contacta soporte SendGrid                      |
| Mimecast                       | <https://community.mimecast.com/>                                                                    | Usa RBLs de terceros - contacta RBL específico |
| Fastmail                       | <https://www.fastmail.com/support/>                                                                  | Contacta soporte Fastmail                      |
| Zoho                           | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Contacta soporte Zoho                         |
| ProtonMail                     | <https://proton.me/support/contact>                                                                  | Contacta soporte Proton                        |
| Tutanota                       | <https://tutanota.com/support>                                                                       | Contacta soporte Tutanota                      |
| Hushmail                       | <https://www.hushmail.com/support/>                                                                  | Contacta soporte Hushmail                      |
| Mailbox.org                    | <https://mailbox.org/en/support>                                                                     | Contacta soporte Mailbox.org                   |
| Posteo                         | <https://posteo.de/en/site/contact>                                                                  | Contacta soporte Posteo                        |
| DuckDuckGo Email               | <https://duckduckgo.com/email/support>                                                               | Contacta soporte DuckDuckGo                    |
| Sonic.net                      | <https://www.sonic.com/support>                                                                      | Contacta soporte Sonic                         |
| Telus                         | <https://www.telus.com/en/support>                                                                   | Contacta soporte Telus                         |
| Vodafone Germany              | <https://www.vodafone.de/hilfe/>                                                                     | Contacta soporte Vodafone                      |
| Xtra (Spark NZ)               | <https://www.spark.co.nz/help/>                                                                      | Contacta soporte Spark NZ                      |
| UOL/BOL (Brasil)              | <https://ajuda.uol.com.br/>                                                                          | Contacta soporte UOL (Portugués)               |
| Libero (Italia)               | <https://aiuto.libero.it/>                                                                           | Contacta soporte Libero (Italiano)             |
| Telenet (Bélgica)             | <https://www2.telenet.be/en/support/>                                                                | Contacta soporte Telenet                       |
| Facebook/WhatsApp             | <https://www.facebook.com/business/help>                                                             | Contacta soporte empresarial Facebook         |
| LinkedIn                     | <https://www.linkedin.com/help/linkedin>                                                             | Contacta soporte LinkedIn                      |
| Groups.io                    | <https://groups.io/helpcenter>                                                                       | Contacta soporte Groups.io                     |
| Earthlink/Vade Secure        | <https://sendertool.vadesecure.com/en/>                                                              | Herramienta de remitentes Vade Secure         |
| Cloudflare Email Security    | <https://www.cloudflare.com/products/zero-trust/email-security/>                                     | Contacta soporte Cloudflare                    |
| Hornetsecurity/Expurgate     | <https://www.hornetsecurity.com/>                                                                    | Contacta soporte Hornetsecurity                |
| SpamExperts/Antispamcloud    | <https://www.spamexperts.com/>                                                                       | Contacta vía proveedor de hosting              |
| Mail2World                   | <https://www.mail2world.com/support/>                                                                | Contacta soporte Mail2World                    |
> \[!TIP]
> Comience con un volumen bajo de correos electrónicos de alta calidad para construir una reputación positiva antes de enviar en volúmenes mayores.

> \[!IMPORTANT]
> Si su dominio está en una lista negra, cada lista negra tiene su propio proceso de eliminación. Consulte sus sitios web para obtener instrucciones.

> \[!TIP]
> Si necesita ayuda adicional o descubre que estamos listados como falso positivo en spam por algún proveedor de servicios de correo electrónico, por favor <a href="/help">contáctenos</a>.

### ¿Qué debo hacer si recibo correos electrónicos no deseados? {#what-should-i-do-if-i-receive-spam-emails}

Debe darse de baja de la lista de correo (si es posible) y bloquear al remitente.

Por favor, no reporte el mensaje como spam, sino que reenvíelo a nuestro sistema de prevención de abusos manualmente curado y enfocado en la privacidad.

**La dirección de correo electrónico a la que debe reenviar el spam es:** <abuse@forwardemail.net>

### ¿Por qué mis correos de prueba enviados a mí mismo en Gmail aparecen como "sospechosos"? {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Si ve este mensaje de error en Gmail cuando se envía una prueba a sí mismo, o cuando una persona con la que se comunica con su alias ve un correo electrónico suyo por primera vez, entonces **por favor no se preocupe** – ya que esta es una función de seguridad incorporada en Gmail.

Simplemente puede hacer clic en "Parece seguro". Por ejemplo, si enviara un mensaje de prueba usando la función enviar correo como (a otra persona), entonces ellos no verán este mensaje.

Sin embargo, si lo ven, es porque normalmente estaban acostumbrados a ver sus correos provenientes de <john@gmail.com> en lugar de <john@customdomain.com> (solo un ejemplo). Gmail alertará a los usuarios solo para asegurarse de que todo esté seguro por si acaso, no hay solución alternativa.

### ¿Puedo eliminar el "via forwardemail dot net" en Gmail? {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Este tema está relacionado con un [problema ampliamente conocido en Gmail donde aparece información adicional junto al nombre del remitente](https://support.google.com/mail/answer/1311182).

Desde mayo de 2023, ofrecemos soporte para enviar correo con SMTP como complemento para todos los usuarios de pago – lo que significa que puede eliminar el <span class="notranslate">via forwardemail dot net</span> en Gmail.

Tenga en cuenta que este tema de preguntas frecuentes es específico para quienes usan la función [Cómo enviar correo como usando Gmail](#how-to-send-mail-as-using-gmail).

Consulte la sección sobre [¿Soportan enviar correo con SMTP?](#do-you-support-sending-email-with-smtp) para instrucciones de configuración.


## Gestión de Datos {#data-management}

### ¿Dónde están ubicados sus servidores? {#where-are-your-servers-located}

> \[!TIP]
> Pronto podríamos anunciar la ubicación de nuestro centro de datos en la UE alojado bajo [forwardemail.eu](https://forwardemail.eu). Suscríbase a la discusión en <https://github.com/orgs/forwardemail/discussions/336> para actualizaciones.

Nuestros servidores están ubicados principalmente en Denver, Colorado – vea <https://forwardemail.net/ips> para nuestra lista completa de direcciones IP.

Puede conocer a nuestros subprocesadores en nuestras páginas de [GDPR](/gdpr), [DPA](/dpa) y [Privacidad](/privacy).

### ¿Cómo exporto y respaldo mi buzón de correo? {#how-do-i-export-and-backup-my-mailbox}

En cualquier momento puede exportar sus buzones en formatos [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) o [SQLite](https://en.wikipedia.org/wiki/SQLite) cifrados.

Vaya a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Descargar Respaldo y seleccione su tipo de formato de exportación preferido.

Se le enviará un enlace para descargar la exportación una vez que haya finalizado.

Tenga en cuenta que este enlace de descarga de exportación expira después de 4 horas por razones de seguridad.

Si necesita inspeccionar sus formatos exportados EML o Mbox, estas herramientas de código abierto pueden ser útiles:

| Nombre          | Formato | Plataforma   | URL de GitHub                                       |
| --------------- | :-----: | ----------- | -------------------------------------------------- |
| MBox Viewer     |  Mbox   | Windows     | <https://github.com/eneam/mboxviewer>              |
| mbox-web-viewer |  Mbox   | Todas       | <https://github.com/PHMRanger/mbox-web-viewer>     |
| EmlReader       |   EML   | Windows     | <https://github.com/ayamadori/EmlReader>           |
| Email viewer    |   EML   | VSCode      | <https://github.com/joelharkes/vscode_email_viewer>|
| eml-reader      |   EML   | Todas       | <https://github.com/s0ph1e/eml-reader>             |
Además, si necesitas convertir un archivo Mbox a archivo EML, puedes usar <https://github.com/noelmartinon/mboxzilla>.

### ¿Cómo importo y migro mi buzón existente {#how-do-i-import-and-migrate-my-existing-mailbox}

Puedes importar fácilmente tu correo electrónico a Forward Email (por ejemplo, usando [Thunderbird](https://www.thunderbird.net)) con las instrucciones a continuación:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Debes seguir todos los pasos siguientes para importar tu correo electrónico existente.
  </span>
</div>

1. Exporta tu correo electrónico desde tu proveedor de correo electrónico actual:

   | Proveedor de correo | Formato de exportación                         | Instrucciones de exportación                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | ------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail               | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook             | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Consejo:</strong> <span>Si usas Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">formato de exportación PST</a>), entonces simplemente puedes seguir las instrucciones en "Otros" abajo. Sin embargo, hemos proporcionado enlaces a continuación para convertir PST a formato MBOX/EML según tu sistema operativo:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba para Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst para Windows cygwin</a> – (por ejemplo, <code>readpst -u -o $OUT_DIR $IN_DIR</code> reemplazando <code>$OUT_DIR</code> y <code>$IN_DIR</code> con las rutas del directorio de salida y directorio de entrada respectivamente).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst para Ubuntu/Linux</a> – (por ejemplo, <code>sudo apt-get install readpst</code> y luego <code>readpst -u -o $OUT_DIR $IN_DIR</code>, reemplazando <code>$OUT_DIR</code> y <code>$IN_DIR</code> con las rutas del directorio de salida y directorio de entrada respectivamente).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst para macOS (vía brew)</a> – (por ejemplo, <code>brew install libpst</code> y luego <code>readpst -u -o $OUT_DIR $IN_DIR</code>, reemplazando <code>$OUT_DIR</code> y <code>$IN_DIR</code> con las rutas del directorio de salida y directorio de entrada respectivamente).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter para Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail          | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail            | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail         | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota            | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi               | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho                | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Otros               | [Usa Thunderbird](https://www.thunderbird.net) | Configura tu cuenta de correo existente en Thunderbird y luego usa el plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) para exportar e importar tu correo electrónico.  **También podrías simplemente copiar/pegar o arrastrar y soltar correos entre una cuenta y otra.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Descargue, instale y abra [Thunderbird](https://www.thunderbird.net).

3. Cree una nueva cuenta usando la dirección de correo electrónico completa de su alias (por ejemplo, <code><you@yourdomain.com></code>) y su contraseña generada.  <strong>Si aún no tiene una contraseña generada, entonces <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">consulte nuestras instrucciones de configuración</a></strong>.

4. Descargue e instale el complemento [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) para Thunderbird.

5. Cree una nueva carpeta local en Thunderbird, luego haga clic derecho sobre ella → seleccione la opción `ImportExportTools NG` → elija `Import mbox file` (para formato de exportación MBOX) – o – `Import messages` / `Import all messages from a directory` (para formato de exportación EML).

6. Arrastre y suelte desde la carpeta local a una carpeta IMAP nueva (o existente) en Thunderbird a la que desee subir mensajes en el almacenamiento IMAP con nuestro servicio.  Esto asegurará que estén respaldados en línea con nuestro almacenamiento cifrado SQLite.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Consejo:
     </strong>
     <span>
       Si tiene dudas sobre cómo importar en Thunderbird, puede consultar las instrucciones oficiales en <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> y <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Una vez que haya completado el proceso de exportación e importación, también puede querer habilitar el reenvío en su cuenta de correo existente y configurar un autorespondedor para notificar a los remitentes que tiene una nueva dirección de correo electrónico (por ejemplo, si antes usaba Gmail y ahora usa un correo con su dominio personalizado).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ¡Felicidades!
    </strong>
    <span>
      Ha completado con éxito todos los pasos.
    </span>
  </div>
</div>

### ¿Cómo uso mi propio almacenamiento compatible con S3 para copias de seguridad? {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Los usuarios con plan de pago pueden configurar su propio proveedor de almacenamiento compatible con [S3](https://en.wikipedia.org/wiki/Amazon_S3) por dominio para copias de seguridad IMAP/SQLite. Esto significa que sus copias de seguridad cifradas del buzón pueden almacenarse en su propia infraestructura en lugar de (o además de) nuestro almacenamiento predeterminado.

Los proveedores compatibles incluyen [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) y cualquier otro servicio compatible con S3.

#### Configuración {#setup}

1. Cree un bucket **privado** con su proveedor compatible con S3. El bucket no debe ser accesible públicamente.
2. Cree credenciales de acceso (ID de clave de acceso y clave secreta) con permisos de lectura/escritura para el bucket.
3. Vaya a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración Avanzada <i class="fa fa-angle-right"></i> Almacenamiento Compatible con S3 Personalizado.
4. Marque **"Habilitar almacenamiento compatible con S3 personalizado"** y complete su URL de endpoint, ID de clave de acceso, clave secreta, región y nombre del bucket.
5. Haga clic en **"Probar Conexión"** para verificar sus credenciales, acceso al bucket y permisos de escritura.
6. Haga clic en **"Guardar"** para aplicar la configuración.

#### Cómo funcionan las copias de seguridad {#how-backups-work}

Las copias de seguridad se activan automáticamente para cada alias IMAP conectado. El servidor IMAP verifica todas las conexiones activas una vez por hora y envía una copia de seguridad para cada alias conectado. Un bloqueo basado en Redis evita que se ejecuten copias de seguridad duplicadas dentro de los 30 minutos entre sí, y la copia de seguridad real se omite si ya se completó una copia exitosa en las últimas 24 horas (a menos que la copia de seguridad haya sido solicitada explícitamente por un usuario para descarga).
Las copias de seguridad también se pueden activar manualmente haciendo clic en **"Descargar copia de seguridad"** para cualquier alias en el panel de control. Las copias de seguridad manuales siempre se ejecutan independientemente de la ventana de 24 horas.

El proceso de copia de seguridad funciona de la siguiente manera:

1. La base de datos SQLite se copia usando `VACUUM INTO`, lo que crea una instantánea consistente sin interrumpir las conexiones activas y preserva el cifrado de la base de datos.
2. El archivo de copia de seguridad se verifica abriéndolo para confirmar que el cifrado sigue siendo válido.
3. Se calcula un hash SHA-256 y se compara con la copia de seguridad existente en el almacenamiento. Si el hash coincide, se omite la carga (no hay cambios desde la última copia de seguridad).
4. La copia de seguridad se sube a S3 usando carga multipartita a través de la biblioteca [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. Se genera una URL de descarga firmada (válida por 4 horas) y se envía por correo electrónico al usuario.

#### Formatos de copia de seguridad {#backup-formats}

Se admiten tres formatos de copia de seguridad:

| Formato  | Extensión | Descripción                                                                 |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | Instantánea cruda cifrada de la base de datos SQLite (predeterminado para copias IMAP automáticas) |
| `mbox`   | `.zip`    | ZIP protegido con contraseña que contiene el buzón en formato mbox          |
| `eml`    | `.zip`    | ZIP protegido con contraseña que contiene archivos individuales `.eml` por mensaje |

> **Consejo:** Si tienes archivos de copia de seguridad `.sqlite` y quieres convertirlos a archivos `.eml` localmente, usa nuestra herramienta CLI independiente **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Funciona en Windows, Linux y macOS y no requiere conexión a la red.

#### Nomenclatura de archivos y estructura de claves {#file-naming-and-key-structure}

Al usar **almacenamiento S3 personalizado**, los archivos de copia de seguridad se almacenan con un prefijo de marca de tiempo [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) para que cada copia se preserve como un objeto separado. Esto te proporciona un historial completo de copias en tu propio bucket.

El formato de la clave es:

```
{marca de tiempo ISO 8601}-{alias_id}.{extensión}
```

Por ejemplo:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

El `alias_id` es el ObjectId de MongoDB del alias. Puedes encontrarlo en la página de configuración del alias o mediante la API.

Al usar el **almacenamiento predeterminado (del sistema)**, la clave es plana (por ejemplo, `65a31c53c36b75ed685f3fda.sqlite`) y cada copia sobrescribe la anterior.

> **Nota:** Dado que el almacenamiento S3 personalizado conserva todas las versiones de copias de seguridad, el uso de almacenamiento crecerá con el tiempo. Recomendamos configurar [reglas de ciclo de vida](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) en tu bucket para que las copias antiguas expiren automáticamente (por ejemplo, eliminar objetos con más de 30 o 90 días).

#### Propiedad de los datos y política de eliminación {#data-ownership-and-deletion-policy}

Tu bucket S3 personalizado está completamente bajo tu control. **Nunca eliminamos ni modificamos** archivos en tu bucket S3 personalizado — ni cuando se elimina un alias, ni cuando se elimina un dominio, ni durante ninguna operación de limpieza. Solo escribimos nuevos archivos de copia de seguridad en tu bucket.

Esto significa:

* **Eliminación de alias** — Cuando eliminas un alias, eliminamos la copia de seguridad solo de nuestro almacenamiento predeterminado del sistema. Las copias previamente escritas en tu bucket S3 personalizado permanecen intactas.
* **Eliminación de dominio** — Eliminar un dominio no afecta los archivos en tu bucket personalizado.
* **Gestión de retención** — Eres responsable de gestionar el almacenamiento en tu propio bucket, incluyendo la configuración de reglas de ciclo de vida para que las copias antiguas expiren.

Si desactivas el almacenamiento S3 personalizado o vuelves a nuestro almacenamiento predeterminado, los archivos existentes en tu bucket se conservan. Las copias futuras simplemente se escribirán en nuestro almacenamiento predeterminado.

#### Seguridad {#security}

* Tu ID de clave de acceso y clave de acceso secreta están **cifrados en reposo** usando [AES-256-GCM](https://es.wikipedia.org/wiki/Modo_Galois/Contador) antes de almacenarse en nuestra base de datos. Solo se descifran en tiempo de ejecución al realizar operaciones de copia de seguridad.
* Validamos automáticamente que tu bucket **no sea accesible públicamente**. Si se detecta un bucket público, la configuración será rechazada al guardar. Si se detecta acceso público en el momento de la copia, volvemos a nuestro almacenamiento predeterminado y notificamos a todos los administradores de dominio por correo electrónico.
* Las credenciales se validan al guardar mediante una llamada [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) para asegurar que el bucket existe y las credenciales son correctas. Si la validación falla, el almacenamiento S3 personalizado se desactiva automáticamente.
* Cada archivo de copia de seguridad incluye un hash SHA-256 en sus metadatos S3, que se usa para detectar bases de datos sin cambios y omitir cargas redundantes.
#### Notificaciones de errores {#error-notifications}

Si una copia de seguridad falla al usar tu almacenamiento S3 personalizado (por ejemplo, debido a credenciales expiradas o un problema de conectividad), todos los administradores del dominio serán notificados por correo electrónico. Estas notificaciones tienen un límite de frecuencia de una vez cada 6 horas para evitar alertas duplicadas. Si se detecta que tu bucket es accesible públicamente en el momento de la copia de seguridad, los administradores serán notificados una vez al día.

#### API {#api}

También puedes configurar almacenamiento S3 personalizado a través de la API:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

Para probar la conexión vía la API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### ¿Cómo convierto copias de seguridad SQLite a archivos EML? {#how-do-i-convert-sqlite-backups-to-eml-files}

Si descargas o almacenas copias de seguridad SQLite (ya sea desde nuestro almacenamiento predeterminado o tu propio [bucket S3 personalizado](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), puedes convertirlas a archivos estándar `.eml` usando nuestra herramienta CLI independiente **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. Los archivos EML pueden abrirse con cualquier cliente de correo ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail), etc.) o importarse en otros servidores de correo.

#### Instalación {#installation-1}

Puedes descargar un binario precompilado (no se requiere [Node.js](https://github.com/nodejs/node)) o ejecutarlo directamente con [Node.js](https://github.com/nodejs/node):

**Binarios precompilados** — Descarga la última versión para tu plataforma desde [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Plataforma | Arquitectura  | Archivo                              |
| --------- | ------------- | ----------------------------------- |
| Linux     | x64           | `convert-sqlite-to-eml-linux-x64`   |
| Linux     | arm64         | `convert-sqlite-to-eml-linux-arm64` |
| macOS     | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64`|
| Windows   | x64           | `convert-sqlite-to-eml-win-x64.exe` |

> **Usuarios de macOS:** Después de descargar, puede que necesites eliminar el atributo de cuarentena antes de ejecutar el binario:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Reemplaza `./convert-sqlite-to-eml-darwin-arm64` con la ruta real al archivo descargado.)

> **Usuarios de Linux:** Después de descargar, puede que necesites hacer el binario ejecutable:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Reemplaza `./convert-sqlite-to-eml-linux-x64` con la ruta real al archivo descargado.)

**Desde el código fuente** (requiere [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Uso {#usage}

La herramienta soporta modos interactivo y no interactivo.

**Modo interactivo** — ejecútalo sin argumentos y se te solicitarán todas las entradas:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Convertir copia de seguridad SQLite a EML
  =============================================

  Ruta al archivo de copia de seguridad SQLite: /path/to/backup.sqlite
  Contraseña IMAP/alias: ********
  Ruta de salida ZIP [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Modo no interactivo** — pasa argumentos mediante flags en la línea de comandos para scripting y automatización:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "tu-contraseña-imap" \
  --output /path/to/output.zip
```

| Flag                | Descripción                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| `--path <path>`     | Ruta al archivo de copia de seguridad SQLite cifrada                           |
| `--password <pass>` | Contraseña IMAP/alias para la descifrado                                      |
| `--output <path>`   | Ruta de salida para el archivo ZIP (por defecto: generado automáticamente con marca de tiempo ISO 8601) |
| `--help`            | Mostrar mensaje de ayuda                                                       |
#### Formato de Salida {#output-format}

La herramienta produce un archivo ZIP protegido con contraseña (cifrado AES-256) que contiene:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

Los archivos EML están organizados por carpeta del buzón. La contraseña del ZIP es la misma que la de su contraseña IMAP/alias. Cada archivo `.eml` es un mensaje de correo electrónico estándar [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) con encabezados completos, texto del cuerpo y archivos adjuntos reconstruidos desde la base de datos SQLite.

#### Cómo Funciona {#how-it-works}

1. Abre la base de datos SQLite cifrada usando su contraseña IMAP/alias (soporta cifrados [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) y [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. Lee la tabla Mailboxes para descubrir la estructura de carpetas.
3. Para cada mensaje, decodifica el mimeTree (almacenado como JSON comprimido con [Brotli](https://github.com/google/brotli)) desde la tabla Messages.
4. Reconstruye el EML completo recorriendo el árbol MIME y obteniendo los cuerpos de los archivos adjuntos desde la tabla Attachments.
5. Empaqueta todo en un archivo ZIP protegido con contraseña usando [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### ¿Soportan autoalojamiento? {#do-you-support-self-hosting}

Sí, a partir de marzo de 2025, soportamos una opción autoalojada. Lea el blog [aquí](https://forwardemail.net/blog/docs/self-hosted-solution). Consulte la [guía de autoalojamiento](https://forwardemail.net/self-hosted) para comenzar. Y para quienes estén interesados en una versión más desglosada paso a paso, vean nuestras guías basadas en [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) o [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Configuración de Correo Electrónico {#email-configuration}

### ¿Cómo empiezo y configuro el reenvío de correo electrónico? {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tiempo Estimado de Configuración:</strong>
  <span>Menos de 10 minutos</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Para Comenzar:
  </strong>
  <span>
    Lea cuidadosamente y siga los pasos del uno al ocho listados a continuación. Asegúrese de reemplazar la dirección de correo electrónico <code>user@gmail.com</code> con la dirección de correo electrónico a la que desea reenviar los correos (si no es ya correcta). De igual forma, asegúrese de reemplazar <code>example.com</code> con su nombre de dominio personalizado (si no es ya correcto).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Si ya ha registrado su nombre de dominio en algún lugar, entonces debe saltarse completamente este paso y pasar al paso dos. De lo contrario, puede <a href="/domain-registration" rel="noopener noreferrer">hacer clic aquí para registrar su nombre de dominio</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  ¿Recuerda dónde registró su dominio? Una vez que lo recuerde, siga las instrucciones a continuación:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Debe abrir una nueva pestaña e iniciar sesión en su registrador de dominios. Puede hacer clic fácilmente en su "Registrador" a continuación para hacerlo automáticamente. En esta nueva pestaña, debe navegar a la página de gestión DNS en su registrador – y hemos proporcionado los pasos de navegación detallados a continuación en la columna "Pasos para Configurar". Una vez que haya navegado a esta página en la nueva pestaña, puede regresar a esta pestaña y continuar con el paso tres a continuación.
    <strong class="font-weight-bold">¡No cierre la pestaña abierta todavía; la necesitará para pasos futuros!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Registrador</th>
      <th>Pasos para Configurar</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Centro de Dominios <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> Editar Configuración DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Zonas Alojadas <i class="fa fa-angle-right"></i> (Seleccione su dominio)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Mis Servidores <i class="fa fa-angle-right"></i> Gestión de Dominios <i class="fa fa-angle-right"></i> Administrador DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>PARA ROCK: Inicie sesión <i class="fa fa-angle-right"></i> Dominios <i class="fa fa-angle-right"></i> (Haga clic en el icono ▼ junto a administrar) <i class="fa fa-angle-right"></i> DNS
      <br />
      PARA LEGACY: Inicie sesión <i class="fa fa-angle-right"></i> Dominios <i class="fa fa-angle-right"></i> Editor de zona <i class="fa fa-angle-right"></i> (Seleccione su dominio)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Seleccione su dominio)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> (Seleccione su dominio)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Administrar</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Redes <i class="fa fa-angle-right"></i> Dominios <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> Más <i class="fa fa-angle-right"></i> Administrar Dominio</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> En vista de tarjetas, haga clic en administrar en su dominio <i class="fa fa-angle-right"></i> En vista de lista, haga clic en
el icono de engranaje <i class="fa fa-angle-right"></i> DNS y Servidores de Nombres <i class="fa fa-angle-right"></i> Registros DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Ver</a>
      </td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> Administrar <i class="fa fa-angle-right"></i> (haga clic en el icono de engranaje) <i class="fa fa-angle-right"></i> Haga clic en DNS y Servidores de Nombres en el menú lateral</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Dominios <i class="fa fa-angle-right"></i> Administrar Dominios <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Resumen <i class="fa fa-angle-right"></i> Administrar <i class="fa fa-angle-right"></i> Editor Simple <i class="fa fa-angle-right"></i> Registros</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> Gestión <i class="fa fa-angle-right"></i> Editar la zona</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Ver</a>
      </td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Administrar Mis Dominios <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> Administrar DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Ver</a>
      </td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> Configurar DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Ver</a>
      </td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Lista de Dominios <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> Administrar <i class="fa fa-angle-right"></i> DNS Avanzado</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> Configurar DNS de Netlify</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Administrador de Cuenta <i class="fa fa-angle-right"></i> Mis Nombres de Dominio <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> Administrar <i class="fa fa-angle-right"></i> Cambiar Dónde Apunta el Dominio <i class="fa fa-angle-right"></i> DNS Avanzado</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Ver</a>
      </td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Dominios Gestionados <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> Configuración DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Menú principal <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Dominios <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i>
Configuración avanzada <i class="fa fa-angle-right"></i> Registros personalizados</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Now de Vercel</a></td>
      <td>Usando la CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Página de Dominios <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Página de Dominios <i class="fa fa-angle-right"></i> (Haga clic en el icono <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Seleccione Administrar Registros DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Inicie sesión <i class="fa fa-angle-right"></i> Dominios <i class="fa fa-angle-right"></i> Mis Dominios</td>
    </tr>
    <tr>
      <td>Otro</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> ¿No ve el nombre de su registrador listado aquí? Simplemente busque en Internet "cómo cambiar registros DNS en $REGISTRAR" (reemplazando $REGISTRAR con el nombre de su registrador – por ejemplo, "cómo cambiar registros DNS en GoDaddy" si usa GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Usando la página de gestión DNS de su registrador (la otra pestaña que tiene abierta), configure los siguientes registros "MX":
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Tenga en cuenta que NO debe haber otros registros MX configurados. Ambos registros que se muestran a continuación DEBEN existir. Asegúrese de que no haya errores tipográficos; y que tenga ambos mx1 y mx2 escritos correctamente. Si ya existían registros MX, elimínelos completamente.
    El valor "TTL" no necesita ser 3600, puede ser un valor menor o mayor si es necesario.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Prioridad</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Usando la página de gestión DNS de su registrador (la otra pestaña que tiene abierta), configure el/los siguiente(s) registro(s) <strong class="notranslate">TXT</strong>:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Si está en un plan de pago, debe omitir completamente este paso y pasar al paso cinco. Si no está en un plan de pago, entonces sus direcciones reenviadas serán públicamente buscables – vaya a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> y actualice su dominio a un plan de pago si lo desea. Si desea saber más sobre los planes de pago, consulte nuestra página de <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Precios</a>. De lo contrario, puede continuar eligiendo una o más combinaciones de la Opción A a la Opción F listadas a continuación.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opción A:
  </strong>
  <span>
    Si está reenviando todos los correos electrónicos de su dominio, (por ejemplo, "all@example.com", "hello@example.com", etc.) a una dirección específica "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
  <span>
    Asegúrese de reemplazar los valores anteriores en la columna "Valor" con su propia dirección de correo electrónico. El valor "TTL" no necesita ser 3600, puede ser un valor menor o mayor si es necesario. Un valor de tiempo de vida ("TTL") más bajo asegurará que cualquier cambio futuro realizado en sus registros DNS se propague por Internet más rápido – piense en esto como cuánto tiempo se almacenará en caché en memoria (en segundos). Puede aprender más sobre el <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL en Wikipedia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opción B:
  </strong>
  <span>
    Si solo necesita reenviar una única dirección de correo electrónico (por ejemplo, <code>hello@example.com</code> a <code>user@gmail.com</code>; esto también reenviará automáticamente "hello+test@example.com" a "user+test@gmail.com"):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opción C:
  </strong>
  <span>
    Si estás reenviando múltiples correos electrónicos, entonces querrás separarlos con una coma:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opción D:
  </strong>
  <span>
    Puedes configurar una cantidad infinita de correos electrónicos para reenvío – solo asegúrate de no superar los 255 caracteres en una sola línea y comenzar cada línea con "forward-email=". Un ejemplo se muestra a continuación:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opción E:
  </strong>
  <span>
    También puedes especificar un nombre de dominio en tu registro <strong class="notranslate">TXT</strong> para tener reenvío global de alias (por ejemplo, "user@example.com" será reenviado a "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=example.net</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opción F:
  </strong>
  <span>
    Incluso puedes usar webhooks como un alias global o individual para reenviar correos electrónicos. Consulta el ejemplo y la sección completa sobre webhooks titulada <a href="#do-you-support-webhooks" class="alert-link">¿Soportan webhooks?</a> a continuación.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opción G:
  </strong>
  <span>
    Incluso puedes usar expresiones regulares ("regex") para coincidir con alias y para manejar sustituciones a las que reenviar correos electrónicos. Consulta los ejemplos y la sección completa sobre regex titulada <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">¿Soportan expresiones regulares o regex?</a> a continuación.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>¿Necesitas regex avanzada con sustitución?</strong> Consulta los ejemplos y la sección completa sobre regex titulada <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">¿Soportan expresiones regulares o regex?</a> a continuación.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Ejemplo simple:</strong> Si quiero que todos los correos que vayan a `linus@example.com` o `torvalds@example.com` se reenvíen a `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Las reglas de reenvío catch-all también podrían describirse como "fall-through".
    Esto significa que los correos entrantes que coincidan con al menos una regla de reenvío específica se usarán en lugar del catch-all.
    Las reglas específicas incluyen direcciones de correo electrónico y expresiones regulares.
    <br /><br />
    Por ejemplo:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    Los correos enviados a <code>hello@example.com</code> **no** serán reenviados a <code>second@gmail.com</code> (catch-all) con esta configuración, y en su lugar solo se entregarán a <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Usando la página de gestión DNS de tu registrador (la otra pestaña que tienes abierta), adicionalmente configura el siguiente registro <strong class="notranslate">TXT</strong>:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Si usas Gmail (por ejemplo, Enviar correo como) o G Suite, entonces necesitarás añadir <code>include:_spf.google.com</code> al valor anterior, por ejemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
  <span>
    Si ya tienes una línea similar con "v=spf1", entonces deberás añadir <code>include:spf.forwardemail.net</code> justo antes de cualquier registro existente "include:host.com" y antes del "-all" en la misma línea, por ejemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Ten en cuenta que hay una diferencia entre "-all" y "~all". El "-" indica que la verificación SPF debe FALLAR si no coincide, y "~" indica que la verificación SPF debe SOFTFAIL. Recomendamos usar el enfoque "-all" para prevenir la falsificación de dominio.
    <br /><br />
    También puede que necesites incluir el registro SPF para el host desde el que envías correo (por ejemplo, Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Verifique sus registros DNS utilizando nuestra herramienta "Verificar Registros" disponible en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración.

</li><li class="mb-2 mb-md-3 mb-lg-5">Envíe un correo electrónico de prueba para confirmar que funciona. Tenga en cuenta que puede tomar algún tiempo para que sus registros DNS se propaguen.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
  <span>
  </span>
    Si no está recibiendo correos electrónicos de prueba, o recibe un correo de prueba que dice "Tenga cuidado con este mensaje", consulte las respuestas para <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Por qué no estoy recibiendo mis correos de prueba</a> y <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Por qué mis correos de prueba enviados a mí mismo en Gmail aparecen como "sospechosos"</a> respectivamente.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Si desea "Enviar correo como" desde Gmail, entonces necesitará <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">ver este video</a></strong>, o seguir los pasos en <a href="#how-to-send-mail-as-using-gmail">Cómo enviar correo como usando Gmail</a> a continuación.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ¡Felicidades!
    </strong>
    <span>
      Ha completado con éxito todos los pasos.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
  <span>
    Los complementos opcionales se enumeran a continuación. Tenga en cuenta que estos complementos son completamente opcionales y pueden no ser necesarios. Queríamos al menos proporcionarle información adicional si fuera necesario.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Complemento Opcional:
  </strong>
  <span>
    Si está utilizando la función <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Cómo enviar correo como usando Gmail</a>, entonces puede que desee agregarse a una lista blanca. Consulte <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">estas instrucciones de Gmail</a> sobre este tema.
  </span>
</div>

### ¿Puedo usar múltiples intercambios MX y servidores para reenvío avanzado? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Sí, pero **solo debe tener un intercambio MX listado en sus registros DNS**.

No intente usar "Prioridad" como una forma de configurar múltiples intercambios MX.

En su lugar, debe configurar su intercambio MX existente para reenviar el correo de todos los alias que no coincidan a los intercambios de nuestro servicio (`mx1.forwardemail.net` y/o `mx2.forwardemail.net`).

Si está usando Google Workspace y desea reenviar todos los alias que no coincidan a nuestro servicio, consulte <https://support.google.com/a/answer/6297084>.

Si está usando Microsoft 365 (Outlook) y desea reenviar todos los alias que no coincidan a nuestro servicio, consulte <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> y <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### ¿Cómo configuro un contestador de vacaciones (respuesta automática de fuera de la oficina)? {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Vaya a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias y cree o edite el alias para el que desea configurar un contestador automático de vacaciones.
Tienes la capacidad de configurar una fecha de inicio, fecha de finalización, asunto y mensaje, y habilitarlo o deshabilitarlo en cualquier momento:

* Actualmente se soportan asunto y mensaje en texto plano (usamos el paquete `striptags` internamente para eliminar cualquier HTML).
* El asunto está limitado a 100 caracteres.
* El mensaje está limitado a 1000 caracteres.
* La configuración requiere configuración SMTP saliente (por ejemplo, necesitarás configurar registros DNS DKIM, DMARC y Return-Path).
  * Ve a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Configuración SMTP Saliente y sigue las instrucciones de configuración.
* El contestador de vacaciones no puede habilitarse en nombres de dominio globales personalizados (por ejemplo, no se soportan [direcciones desechables](/disposable-addresses)).
* El contestador de vacaciones no puede habilitarse para alias con comodín/captura total (`*`) ni expresiones regulares.

A diferencia de sistemas de correo como `postfix` (por ejemplo, que usan la extensión de filtro de vacaciones `sieve`), Forward Email añade automáticamente tu firma DKIM, protege contra problemas de conexión al enviar respuestas de vacaciones (por ejemplo, debido a problemas comunes de conexión SSL/TLS y servidores mantenidos antiguos), e incluso soporta Open WKD y cifrado PGP para respuestas de vacaciones.

<!--
* Para prevenir abusos, se descontará 1 crédito SMTP saliente por cada mensaje de contestador de vacaciones enviado.
  * Todas las cuentas pagadas incluyen 300 créditos por día por defecto. Si necesitas una cantidad mayor, por favor contáctanos.
-->

1. Solo enviamos una vez por remitente [permitido](#do-you-have-an-allowlist) cada 4 días (lo cual es similar al comportamiento de Gmail).

   * Nuestra caché Redis usa una huella digital de `alias_id` y `sender`, donde `alias_id` es el ID de alias en MongoDB y `sender` es la dirección From (si está permitida) o el dominio raíz en la dirección From (si no está permitida). Para simplificar, la expiración de esta huella en caché está establecida en 4 días.

   * Nuestro enfoque de usar el dominio raíz analizado en la dirección From para remitentes no permitidos previene abusos de remitentes relativamente desconocidos (por ejemplo, actores maliciosos) que inunden con mensajes del contestador de vacaciones.

2. Solo enviamos cuando MAIL FROM y/o From no están en blanco y no contienen (sin distinguir mayúsculas) un [nombre de usuario postmaster](#what-are-postmaster-addresses) (la parte antes de la @ en un correo electrónico).

3. No enviamos si el mensaje original tenía alguno de los siguientes encabezados (sin distinguir mayúsculas):

   * Encabezado `auto-submitted` con un valor distinto de `no`.
   * Encabezado `x-auto-response-suppress` con un valor de `dr`, `autoreply`, `auto-reply`, `auto_reply` o `all`.
   * Encabezado `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` o `x-auto-respond` (independientemente del valor).
   * Encabezado `precedence` con un valor de `bulk`, `autoreply`, `auto-reply`, `auto_reply` o `list`.

4. No enviamos si la dirección MAIL FROM o From termina con `+donotreply`, `-donotreply`, `+noreply` o `-noreply`.

5. No enviamos si la parte del nombre de usuario de la dirección From era `mdaemon` y tenía un encabezado `X-MDDSN-Message` sin distinguir mayúsculas.

6. No enviamos si había un encabezado `content-type` sin distinguir mayúsculas de tipo `multipart/report`.

### ¿Cómo configuro SPF para Forward Email? {#how-do-i-set-up-spf-for-forward-email}

Usando la página de gestión DNS de tu registrador, configura el siguiente registro <strong class="notranslate">TXT</strong>:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o en blanco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Si usas Gmail (por ejemplo, Enviar correo como) o G Suite, entonces necesitarás añadir <code>include:_spf.google.com</code> al valor anterior, por ejemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Si estás usando Microsoft Outlook o Live.com, necesitarás añadir <code>include:spf.protection.outlook.com</code> a tu registro SPF <strong class="notranslate">TXT</strong>, por ejemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
  <span>
    Si ya tienes una línea similar con "v=spf1", entonces necesitarás añadir <code>include:spf.forwardemail.net</code> justo antes de cualquier registro existente "include:host.com" y antes del "-all" en la misma línea, por ejemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Ten en cuenta que hay una diferencia entre "-all" y "~all". El "-" indica que la verificación SPF debe FALLAR si no coincide, y "~" indica que la verificación SPF debe SOFTFAIL. Recomendamos usar el enfoque "-all" para prevenir la falsificación de dominio.
    <br /><br />
    También puede que necesites incluir el registro SPF para el host desde el que envías correo (por ejemplo, Outlook).
  </span>
</div>

### ¿Cómo configuro DKIM para Forward Email? {#how-do-i-set-up-dkim-for-forward-email}

Ve a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Configuración SMTP Saliente y sigue las instrucciones de configuración.

### ¿Cómo configuro DMARC para Forward Email? {#how-do-i-set-up-dmarc-for-forward-email}

Ve a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Configuración SMTP Saliente y sigue las instrucciones de configuración.

### ¿Cómo veo los Reportes DMARC? {#how-do-i-view-dmarc-reports}

Forward Email ofrece un panel completo de Reportes DMARC que te permite monitorear el rendimiento de la autenticación de tus correos electrónicos en todos tus dominios desde una sola interfaz.

**¿Qué son los Reportes DMARC?**

Los reportes DMARC (Autenticación, Reporte y Conformidad de Mensajes Basados en Dominio) son archivos XML enviados por los servidores de correo receptores que te indican cómo se están autenticando tus correos electrónicos. Estos reportes te ayudan a entender:

* Cuántos correos se están enviando desde tu dominio
* Si esos correos están pasando la autenticación SPF y DKIM
* Qué acciones están tomando los servidores receptores (aceptar, poner en cuarentena o rechazar)
* Qué direcciones IP están enviando correo en nombre de tu dominio

**Cómo acceder a los Reportes DMARC**

Ve a <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Reportes DMARC</a> para ver tu panel. También puedes acceder a reportes específicos de dominio desde <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> haciendo clic en el botón "DMARC" junto a cualquier dominio.

**Características del Panel**

El panel de Reportes DMARC ofrece:

* **Métricas Resumen**: Total de reportes recibidos, total de mensajes analizados, tasa de alineación SPF, tasa de alineación DKIM y tasa general de aprobación
* **Gráfico de Mensajes en el Tiempo**: Tendencia visual del volumen de correos y tasas de autenticación en los últimos 30 días
* **Resumen de Alineación**: Gráfico de dona mostrando la distribución de alineación SPF vs DKIM
* **Disposición de Mensajes**: Gráfico de barras apiladas mostrando cómo los servidores receptores manejaron tus correos (aceptados, en cuarentena o rechazados)
* **Tabla de Reportes Recientes**: Lista detallada de reportes DMARC individuales con filtrado y paginación
* **Filtrado por Dominio**: Filtra reportes por dominio específico cuando gestionas múltiples dominios
**Por qué esto importa**

Para organizaciones que gestionan múltiples dominios (como empresas, organizaciones sin fines de lucro o agencias), los informes DMARC son esenciales para:

* **Identificar remitentes no autorizados**: Detectar si alguien está suplantando tu dominio
* **Mejorar la entregabilidad**: Asegurar que tus correos legítimos pasen la autenticación
* **Monitorear la infraestructura de correo electrónico**: Rastrear qué servicios e IPs están enviando en tu nombre
* **Cumplimiento**: Mantener visibilidad en la autenticación de correo electrónico para auditorías de seguridad

A diferencia de otros servicios que requieren herramientas separadas para monitorear DMARC, Forward Email incluye el procesamiento y visualización de informes DMARC como parte de tu cuenta sin costo adicional.

**Requisitos**

* Los informes DMARC están disponibles solo para planes pagos
* Tu dominio debe tener DMARC configurado (ver [Cómo configurar DMARC para Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Los informes se recopilan automáticamente cuando los servidores de correo receptores los envían a tu dirección configurada para reportes DMARC

**Informes semanales por correo electrónico**

Los usuarios de planes pagos reciben automáticamente resúmenes semanales de informes DMARC por correo electrónico. Estos correos incluyen:

* Estadísticas resumidas para todos tus dominios
* Tasas de alineación SPF y DKIM
* Desglose de la disposición de mensajes (aceptados, en cuarentena, rechazados)
* Principales organizaciones que reportan (Google, Microsoft, Yahoo, etc.)
* Direcciones IP con problemas de alineación que pueden necesitar atención
* Enlaces directos a tu panel de informes DMARC

Los informes semanales se envían automáticamente y no pueden desactivarse por separado de otras notificaciones por correo electrónico.

### Cómo conecto y configuro mis contactos {#how-do-i-connect-and-configure-my-contacts}

**Para configurar tus contactos, usa la URL CardDAV:** `https://carddav.forwardemail.net` (o simplemente `carddav.forwardemail.net` si tu cliente lo permite)

### Cómo conecto y configuro mis calendarios {#how-do-i-connect-and-configure-my-calendars}

**Para configurar tu calendario, usa la URL CalDAV:** `https://caldav.forwardemail.net` (o simplemente `caldav.forwardemail.net` si tu cliente lo permite)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Cómo agrego más calendarios y gestiono calendarios existentes {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Si deseas agregar calendarios adicionales, simplemente añade una nueva URL de calendario: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**asegúrate de reemplazar `calendar-name` con el nombre deseado para tu calendario**)

Puedes cambiar el nombre y color de un calendario después de crearlo – solo usa tu aplicación de calendario preferida (por ejemplo, Apple Mail o [Thunderbird](https://thunderbird.net)).

### Cómo conecto y configuro tareas y recordatorios {#how-do-i-connect-and-configure-tasks-and-reminders}

**Para configurar tareas y recordatorios, usa la misma URL CalDAV que para calendarios:** `https://caldav.forwardemail.net` (o simplemente `caldav.forwardemail.net` si tu cliente lo permite)

Las tareas y recordatorios se separarán automáticamente de los eventos del calendario en su propia colección de calendario llamada "Recordatorios" o "Tareas".

**Instrucciones de configuración por plataforma:**

**macOS/iOS:**

1. Añade una nueva cuenta CalDAV en Preferencias del Sistema > Cuentas de Internet (o Ajustes > Cuentas en iOS)
2. Usa `caldav.forwardemail.net` como servidor
3. Ingresa tu alias de Forward Email y la contraseña generada
4. Después de la configuración, verás las colecciones "Calendario" y "Recordatorios"
5. Usa la app Recordatorios para crear y gestionar tareas

**Android con Tasks.org:**

1. Instala Tasks.org desde Google Play Store o F-Droid
2. Ve a Ajustes > Sincronización > Añadir cuenta > CalDAV
3. Ingresa el servidor: `https://caldav.forwardemail.net`
4. Ingresa tu alias de Forward Email y la contraseña generada
5. Tasks.org descubrirá automáticamente tus calendarios de tareas

**Thunderbird:**

1. Instala el complemento Lightning si no está instalado
2. Crea un nuevo calendario con tipo "CalDAV"
3. Usa la URL: `https://caldav.forwardemail.net`
4. Ingresa tus credenciales de Forward Email
5. Tanto eventos como tareas estarán disponibles en la interfaz del calendario

### ¿Por qué no puedo crear tareas en Recordatorios de macOS? {#why-cant-i-create-tasks-in-macos-reminders}
Si tienes problemas para crear tareas en macOS Recordatorios, prueba estos pasos de solución de problemas:

1. **Verifica la configuración de la cuenta**: Asegúrate de que tu cuenta CalDAV esté configurada correctamente con `caldav.forwardemail.net`

2. **Verifica calendarios separados**: Deberías ver tanto "Calendario" como "Recordatorios" en tu cuenta. Si solo ves "Calendario", es posible que el soporte de tareas aún no esté completamente activado.

3. **Actualiza la cuenta**: Intenta eliminar y volver a agregar tu cuenta CalDAV en Preferencias del Sistema > Cuentas de Internet

4. **Verifica la conectividad con el servidor**: Prueba que puedas acceder a `https://caldav.forwardemail.net` en tu navegador

5. **Verifica las credenciales**: Asegúrate de usar el alias de correo electrónico correcto y la contraseña generada (no la contraseña de tu cuenta)

6. **Forzar sincronización**: En la app Recordatorios, intenta crear una tarea y luego actualiza manualmente la sincronización

**Problemas comunes:**

* **"Calendario de recordatorios no encontrado"**: El servidor puede necesitar un momento para crear la colección de Recordatorios en el primer acceso
* **Las tareas no se sincronizan**: Verifica que ambos dispositivos estén usando las mismas credenciales de cuenta CalDAV
* **Contenido mixto**: Asegúrate de que las tareas se estén creando en el calendario "Recordatorios", no en el "Calendario" general

### ¿Cómo configuro Tasks.org en Android? {#how-do-i-set-up-tasksorg-on-android}

Tasks.org es un gestor de tareas de código abierto popular que funciona excelentemente con el soporte de tareas CalDAV de Forward Email.

**Instalación y configuración:**

1. **Instala Tasks.org**:
   * Desde Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Desde F-Droid: [Tasks.org en F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Configura la sincronización CalDAV**:
   * Abre Tasks.org
   * Ve a ☰ Menú > Configuración > Sincronización
   * Toca "Agregar cuenta"
   * Selecciona "CalDAV"

3. **Introduce la configuración de Forward Email**:
   * **URL del servidor**: `https://caldav.forwardemail.net`
   * **Nombre de usuario**: Tu alias de Forward Email (por ejemplo, `tú@tudominio.com`)
   * **Contraseña**: Tu contraseña generada específica para el alias
   * Toca "Agregar cuenta"

4. **Descubrimiento de cuenta**:
   * Tasks.org descubrirá automáticamente tus calendarios de tareas
   * Deberías ver aparecer tu colección "Recordatorios"
   * Toca "Suscribirse" para habilitar la sincronización del calendario de tareas

5. **Prueba la sincronización**:
   * Crea una tarea de prueba en Tasks.org
   * Verifica que aparezca en otros clientes CalDAV (como Recordatorios en macOS)
   * Confirma que los cambios se sincronizan en ambas direcciones

**Funciones disponibles:**

* ✅ Creación y edición de tareas
* ✅ Fechas de vencimiento y recordatorios
* ✅ Finalización y estado de tareas
* ✅ Niveles de prioridad
* ✅ Subtareas y jerarquía de tareas
* ✅ Etiquetas y categorías
* ✅ Sincronización bidireccional con otros clientes CalDAV

**Solución de problemas:**

* Si no aparecen calendarios de tareas, intenta actualizar manualmente en la configuración de Tasks.org
* Asegúrate de tener al menos una tarea creada en el servidor (puedes crear una primero en Recordatorios de macOS)
* Verifica la conectividad de red con `caldav.forwardemail.net`

### ¿Cómo configuro SRS para Forward Email? {#how-do-i-set-up-srs-for-forward-email}

Configuramos automáticamente el [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – no necesitas hacerlo tú mismo.

### ¿Cómo configuro MTA-STS para Forward Email? {#how-do-i-set-up-mta-sts-for-forward-email}

Por favor, consulta [nuestra sección sobre MTA-STS](#do-you-support-mta-sts) para más información.

### ¿Cómo agrego una foto de perfil a mi dirección de correo electrónico? {#how-do-i-add-a-profile-picture-to-my-email-address}

Si usas Gmail, sigue estos pasos:

1. Ve a <https://google.com> y cierra sesión en todas las cuentas de correo
2. Haz clic en "Iniciar sesión" y en el menú desplegable selecciona "otra cuenta"
3. Selecciona "Usar otra cuenta"
4. Selecciona "Crear cuenta"
5. Selecciona "Usar mi dirección de correo electrónico actual en su lugar"
6. Ingresa tu dirección de correo electrónico de dominio personalizado
7. Recupera el correo de verificación enviado a tu dirección de correo
8. Ingresa el código de verificación de ese correo
9. Completa la información del perfil para tu nueva cuenta de Google
10. Acepta todas las políticas de Privacidad y Términos de Uso
11. Ve a <https://google.com> y en la esquina superior derecha, haz clic en tu ícono de perfil y luego en el botón "cambiar"
12. Sube una nueva foto o avatar para tu cuenta
13. Los cambios tardarán aproximadamente 1-2 horas en propagarse, aunque a veces puede ser muy rápido.
14. Envía un correo de prueba y la foto de perfil debería aparecer.
## Funciones Avanzadas {#advanced-features}

### ¿Soportan boletines o listas de correo para correos electrónicos relacionados con marketing? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Sí, puedes leer más en <https://forwardemail.net/guides/newsletter-with-listmonk>.

Ten en cuenta que para mantener la reputación de IP y asegurar la entregabilidad, Forward Email tiene un proceso de revisión manual por dominio para la **aprobación de boletines**. Envía un correo a <support@forwardemail.net> o abre una [solicitud de ayuda](https://forwardemail.net/help) para la aprobación. Esto normalmente toma menos de 24 horas, con la mayoría de las solicitudes siendo aprobadas en 1-2 horas. En un futuro cercano, planeamos hacer este proceso instantáneo con controles adicionales de spam y alertas. Este proceso asegura que tus correos lleguen a la bandeja de entrada y que tus mensajes no sean marcados como spam.

### ¿Soportan el envío de correos electrónicos mediante API? {#do-you-support-sending-email-with-api}

Sí, desde mayo de 2023 soportamos el envío de correos electrónicos mediante API como complemento para todos los usuarios de pago.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Por favor asegúrate de haber leído nuestros <a href="/terms" class="alert-link" target="_blank">Términos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidad</a>, y <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Límites SMTP de Salida</a> &ndash; tu uso se considera como reconocimiento y aceptación.
  </span>
</div>

Por favor revisa nuestra sección sobre [Correos Electrónicos](/email-api#outbound-emails) en nuestra documentación API para opciones, ejemplos y más información.

Para enviar correos electrónicos salientes con nuestra API, debes usar tu token API disponible en [Mi Seguridad](/my-account/security).

### ¿Soportan la recepción de correos electrónicos mediante IMAP? {#do-you-support-receiving-email-with-imap}

Sí, desde el 16 de octubre de 2023 soportamos la recepción de correos electrónicos vía IMAP como complemento para todos los usuarios de pago.  **Por favor lee nuestro artículo detallado** sobre [cómo funciona nuestra característica de almacenamiento cifrado en SQLite para buzones](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Por favor asegúrate de haber leído nuestros <a href="/terms" class="alert-link" target="_blank">Términos</a> y <a href="/privacy" class="alert-link" target="_blank">Política de Privacidad</a> &ndash; tu uso se considera como reconocimiento y aceptación.
  </span>
</div>

1. Crea un nuevo alias para tu dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Aliases (por ejemplo, <code><hello@example.com></code>)

2. Haz clic en <strong class="text-success"><i class="fa fa-key"></i> Generar Contraseña</strong> junto al alias recién creado. Copia al portapapeles y guarda de forma segura la contraseña generada que se muestra en pantalla.

3. Usando tu aplicación de correo preferida, añade o configura una cuenta con tu alias recién creado (por ejemplo, <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Consejo:
     </strong>
     <span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, o <a href="/blog/open-source" class="alert-link" target="_blank">una alternativa de código abierto y enfocada en la privacidad</a>.</span>
   </div>

4. Cuando se te solicite el nombre del servidor IMAP, ingresa `imap.forwardemail.net`

5. Cuando se te solicite el puerto del servidor IMAP, ingresa `993` (SSL/TLS) – consulta los [puertos IMAP alternativos](/faq#what-are-your-imap-server-configuration-settings) si es necesario
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Consejo:
     </strong>
     <span>Si usas Thunderbird, asegúrate de que "Seguridad de conexión" esté configurada en "SSL/TLS" y el método de autenticación en "Contraseña normal".</span>
   </div>
6. Cuando se le solicite la contraseña del servidor IMAP, pegue la contraseña desde <strong class="text-success"><i class="fa fa-key"></i> Generar Contraseña</strong> en el paso 2 anterior

7. **Guarde sus configuraciones** – si tiene problemas, por favor <a href="/help">contáctenos</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ¡Felicidades!
    </strong>
    <span>
      Ha completado con éxito todos los pasos.
    </span>
  </div>
</div>

</div>

### ¿Soportan POP3? {#do-you-support-pop3}

Sí, desde el 4 de diciembre de 2023 soportamos [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) como complemento para todos los usuarios de pago.  **Por favor lea nuestro artículo detallado** sobre [cómo funciona nuestra función de almacenamiento de buzón cifrado SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Por favor asegúrese de haber leído nuestros <a href="/terms" class="alert-link" target="_blank">Términos</a> y <a href="/privacy" class="alert-link" target="_blank">Política de Privacidad</a> &ndash; su uso se considera como reconocimiento y aceptación.
  </span>
</div>

1. Cree un nuevo alias para su dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias (por ejemplo, <code><hello@example.com></code>)

2. Haga clic en <strong class="text-success"><i class="fa fa-key"></i> Generar Contraseña</strong> junto al alias recién creado. Copie al portapapeles y guarde de forma segura la contraseña generada que se muestra en pantalla.

3. Usando su aplicación de correo preferida, agregue o configure una cuenta con su alias recién creado (por ejemplo, <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Consejo:
     </strong>
     <span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, o <a href="/blog/open-source" class="alert-link" target="_blank">una alternativa de código abierto y enfocada en la privacidad</a>.</span>
   </div>

4. Cuando se le solicite el nombre del servidor POP3, ingrese `pop3.forwardemail.net`

5. Cuando se le solicite el puerto del servidor POP3, ingrese `995` (SSL/TLS) – vea [puertos alternativos para POP3](/faq#what-are-your-pop3-server-configuration-settings) si es necesario
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Consejo:
     </strong>
     <span>Si usa Thunderbird, asegúrese de que "Seguridad de conexión" esté configurada en "SSL/TLS" y el método de autenticación en "Contraseña normal".</span>
   </div>

6. Cuando se le solicite la contraseña del servidor POP3, pegue la contraseña desde <strong class="text-success"><i class="fa fa-key"></i> Generar Contraseña</strong> en el paso 2 anterior

7. **Guarde sus configuraciones** – si tiene problemas, por favor <a href="/help">contáctenos</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ¡Felicidades!
    </strong>
    <span>
      Ha completado con éxito todos los pasos.
    </span>
  </div>
</div>

</div>

### ¿Soportan calendarios (CalDAV)? {#do-you-support-calendars-caldav}

Sí, desde el 5 de febrero de 2024 hemos añadido esta función. Nuestro servidor es `caldav.forwardemail.net` y también se monitorea en nuestra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de estado</a>.
Soporta tanto IPv4 como IPv6 y está disponible a través del puerto `443` (HTTPS).

| Inicio de sesión | Ejemplo                    | Descripción                                                                                                                                                                               |
| ---------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre de usuario | `user@example.com`         | Dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a>. |
| Contraseña       | `************************` | Contraseña generada específica para el alias.                                                                                                                                             |

Para usar el soporte de calendario, el **usuario** debe ser la dirección de correo electrónico de un alias que exista para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> – y la **contraseña** debe ser una contraseña generada específica para el alias.

### ¿Soportan tareas y recordatorios (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Sí, desde el 14 de octubre de 2025 hemos añadido soporte CalDAV VTODO para tareas y recordatorios. Esto utiliza el mismo servidor que nuestro soporte de calendario: `caldav.forwardemail.net`.

Nuestro servidor CalDAV soporta tanto eventos de calendario (VEVENT) como componentes de tareas (VTODO) usando **calendarios unificados**. Esto significa que cada calendario puede contener tanto eventos como tareas, proporcionando máxima flexibilidad y compatibilidad en todos los clientes CalDAV.

**Cómo funcionan los calendarios y listas:**

* **Cada calendario soporta tanto eventos como tareas** - Puedes añadir eventos, tareas o ambos a cualquier calendario
* **Listas de Apple Reminders** - Cada lista que creas en Apple Reminders se convierte en un calendario separado en el servidor
* **Múltiples calendarios** - Puedes crear tantos calendarios como necesites, cada uno con su propio nombre, color y organización
* **Sincronización entre clientes** - Las tareas y eventos se sincronizan sin problemas entre todos los clientes compatibles

**Clientes de tareas soportados:**

* **macOS Reminders** - Soporte nativo completo para creación, edición, finalización y sincronización de tareas
* **iOS Reminders** - Soporte nativo completo en todos los dispositivos iOS
* **Tasks.org (Android)** - Popular gestor de tareas de código abierto con sincronización CalDAV
* **Thunderbird** - Soporte de tareas y calendario en cliente de correo de escritorio
* **Cualquier gestor de tareas compatible con CalDAV** - Soporte estándar para componente VTODO

**Características de tareas soportadas:**

* Creación, edición y eliminación de tareas
* Fechas de vencimiento y fechas de inicio
* Estado de finalización de tareas (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Niveles de prioridad de tareas
* Tareas recurrentes
* Descripciones y notas de tareas
* Sincronización multi-dispositivo
* Subtareas con propiedad RELATED-TO
* Recordatorios de tareas con VALARM

Las credenciales de inicio de sesión son las mismas que para el soporte de calendario:

| Inicio de sesión | Ejemplo                    | Descripción                                                                                                                                                                               |
| ---------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre de usuario | `user@example.com`         | Dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a>. |
| Contraseña       | `************************` | Contraseña generada específica para el alias.                                                                                                                                             |

**Notas importantes:**

* **Cada lista de Reminders es un calendario separado** - Cuando creas una nueva lista en Apple Reminders, se crea un nuevo calendario en el servidor CalDAV
* **Usuarios de Thunderbird** - Necesitarás suscribirte manualmente a cada calendario/lista que quieras sincronizar, o usar la URL de inicio del calendario: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Usuarios de Apple** - El descubrimiento de calendarios ocurre automáticamente, por lo que todos tus calendarios y listas aparecerán en Calendar.app y Reminders.app
* **Calendarios unificados** - Todos los calendarios soportan tanto eventos como tareas, dándote flexibilidad en cómo organizas tus datos
### ¿Soportan contactos (CardDAV) {#do-you-support-contacts-carddav}

Sí, desde el 12 de junio de 2025 hemos añadido esta función. Nuestro servidor es `carddav.forwardemail.net` y también se monitorea en nuestra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de estado</a>.

Soporta tanto IPv4 como IPv6 y está disponible a través del puerto `443` (HTTPS).

| Inicio de sesión | Ejemplo                   | Descripción                                                                                                                                                                               |
| ---------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre de usuario | `user@example.com`        | Dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a>. |
| Contraseña       | `************************` | Contraseña generada específica para el alias.                                                                                                                                             |

Para usar el soporte de contactos, el **usuario** debe ser la dirección de correo electrónico de un alias que exista para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> – y la **contraseña** debe ser una contraseña generada específica para el alias.

### ¿Soportan el envío de correo electrónico con SMTP {#do-you-support-sending-email-with-smtp}

Sí, desde mayo de 2023 soportamos el envío de correo electrónico con SMTP como un complemento para todos los usuarios de pago.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Por favor asegúrese de haber leído nuestros <a href="/terms" class="alert-link" target="_blank">Términos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidad</a>, y <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Límites de SMTP Saliente</a> &ndash; su uso se considera como reconocimiento y aceptación.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Si usa Gmail, consulte nuestra <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Guía para Enviar Correo Como con Gmail</a>. Si es desarrollador, consulte nuestra <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentación de la API de correo electrónico</a>.
  </span>
</div>

1. Vaya a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Configuración SMTP Saliente y siga las instrucciones de configuración

2. Cree un nuevo alias para su dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Aliases (por ejemplo, <code><hello@example.com></code>)

3. Haga clic en <strong class="text-success"><i class="fa fa-key"></i> Generar Contraseña</strong> junto al alias recién creado. Copie al portapapeles y guarde de forma segura la contraseña generada que se muestra en pantalla.

4. Usando su aplicación de correo preferida, agregue o configure una cuenta con su alias recién creado (por ejemplo, <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Consejo:
     </strong>
     <span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, o <a href="/blog/open-source" class="alert-link" target="_blank">una alternativa de código abierto y enfocada en la privacidad</a>.</span>
   </div>
5. Cuando se le solicite el nombre del servidor SMTP, ingrese `smtp.forwardemail.net`

6. Cuando se le solicite el puerto del servidor SMTP, ingrese `465` (SSL/TLS) – consulte [puertos SMTP alternativos](/faq#what-are-your-smtp-server-configuration-settings) si es necesario
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Consejo:
     </strong>
     <span>Si está usando Thunderbird, asegúrese de que "Seguridad de conexión" esté configurada en "SSL/TLS" y que el método de autenticación esté configurado en "Contraseña normal".</span>
   </div>

7. Cuando se le solicite la contraseña del servidor SMTP, pegue la contraseña de <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> en el paso 3 anterior

8. **Guarde sus configuraciones y envíe su primer correo de prueba** – si tiene problemas, por favor <a href="/help">contáctenos</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Tenga en cuenta que para mantener la reputación de IP y asegurar la entregabilidad, tenemos un proceso de revisión manual por dominio para la aprobación de SMTP saliente. Esto generalmente toma menos de 24 horas, con la mayoría de las solicitudes siendo aprobadas en 1-2 horas. En un futuro cercano, nuestro objetivo es hacer este proceso instantáneo con controles adicionales de spam y alertas. Este proceso garantiza que sus correos lleguen a la bandeja de entrada y que sus mensajes no sean marcados como spam.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ¡Felicidades!
    </strong>
    <span>
      Ha completado con éxito todos los pasos.
    </span>
  </div>
</div>

</div>

### ¿Soportan OpenPGP/MIME, cifrado de extremo a extremo ("E2EE") y Web Key Directory ("WKD")? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Sí, soportamos [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [cifrado de extremo a extremo ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) y el descubrimiento de claves públicas usando [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Puede configurar OpenPGP usando [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) o [alojar sus propias claves](https://wiki.gnupg.org/WKDHosting) (consulte [este gist para la configuración del servidor WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Las búsquedas WKD se almacenan en caché por 1 hora para asegurar la entrega oportuna del correo → por lo tanto, si agrega, cambia o elimina su clave WKD, por favor envíenos un correo a `support@forwardemail.net` con su dirección de correo para que podamos purgar manualmente la caché.
* Soportamos cifrado PGP para mensajes reenviados mediante búsqueda WKD o usando una clave PGP cargada en nuestra interfaz.
* Las claves cargadas tienen prioridad mientras la casilla PGP esté habilitada/marcada.
* Los mensajes enviados a webhooks actualmente no se cifran con PGP.
* Si tiene múltiples alias que coinciden para una dirección de reenvío dada (por ejemplo, combinación regex/wildcard/exacta) y si más de uno contiene una clave PGP cargada y tiene PGP marcado → entonces le enviaremos un correo de alerta de error y no cifraremos el mensaje con su clave PGP cargada. Esto es muy raro y usualmente aplica solo a usuarios avanzados con reglas complejas de alias.
* **El cifrado PGP no se aplicará al reenvío de correo a través de nuestros servidores MX si el remitente tiene una política DMARC de rechazo. Si requiere cifrado PGP en *todos* los correos, sugerimos usar nuestro servicio IMAP y configurar su clave PGP para su alias en el correo entrante.**

**Puede validar su configuración de Web Key Directory en <https://wkd.chimbosonic.com/> (código abierto) o <https://www.webkeydirectory.com/> (propietario).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Cifrado automático:
  </strong>
  <span>Si está usando nuestro <a href="#do-you-support-sending-email-with-smtp" class="alert-link">servicio SMTP saliente</a> y envía mensajes sin cifrar, intentaremos automáticamente cifrar los mensajes por destinatario usando <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Debe seguir todos los pasos siguientes para habilitar OpenPGP para su nombre de dominio personalizado.
  </span>
</div>

1. Descargue e instale el complemento recomendado para su cliente de correo electrónico a continuación:

   | Cliente de correo | Plataforma | Complemento recomendado                                                                                                                                                              | Notas                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | ----------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird       | Escritorio | [Configurar OpenPGP en Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird tiene soporte integrado para OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Gmail             | Navegador | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licencia propietaria)                                                                          | Gmail no soporta OpenPGP, sin embargo puede descargar el complemento de código abierto [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                               |
   | Apple Mail        | macOS     | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                        | Apple Mail no soporta OpenPGP, sin embargo puede descargar el complemento de código abierto [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                  |
   | Apple Mail        | iOS       | [PGPro](https://github.com/opensourceios/PGPro/) o [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (licencia propietaria)                         | Apple Mail no soporta OpenPGP, sin embargo puede descargar el complemento de código abierto [PGPro](https://github.com/opensourceios/PGPro/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                               |
   | Outlook           | Windows   | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                        | El cliente de correo de escritorio Outlook no soporta OpenPGP, sin embargo puede descargar el complemento de código abierto [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                  |
   | Outlook           | Navegador | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licencia propietaria)                                                                          | El cliente de correo web Outlook no soporta OpenPGP, sin embargo puede descargar el complemento de código abierto [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                      |
   | Android           | Móvil     | [OpenKeychain](https://www.openkeychain.org/) o [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                     | [Clientes de correo Android](/blog/open-source/android-email-clients) como [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) y [FairEmail](https://github.com/M66B/FairEmail) ambos soportan el complemento de código abierto [OpenKeychain](https://www.openkeychain.org/). Alternativamente, puede usar el complemento de código abierto (licencia propietaria) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome     | Navegador | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licencia propietaria)                                                                          | Puede descargar la extensión de navegador de código abierto [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                         |
   | Mozilla Firefox   | Navegador | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licencia propietaria)                                                                          | Puede descargar la extensión de navegador de código abierto [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                         |
   | Microsoft Edge    | Navegador | [Mailvelope](https://mailvelope.com/)                                                                                                                                               | Puede descargar la extensión de navegador de código abierto [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                      |
   | Brave             | Navegador | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licencia propietaria)                                                                          | Puede descargar la extensión de navegador de código abierto [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                         |
   | Balsa             | Escritorio | [Configurar OpenPGP en Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                          | Balsa tiene soporte integrado para OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                              |
   | KMail             | Escritorio | [Configurar OpenPGP en KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                             | KMail tiene soporte integrado para OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                              |
   | GNOME Evolution   | Escritorio | [Configurar OpenPGP en Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                             | GNOME Evolution tiene soporte integrado para OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                    |
   | Terminal          | Escritorio | [Configurar gpg en Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                       | Puede usar la herramienta de línea de comandos de código abierto [gpg](https://www.gnupg.org/download/) para generar una nueva clave desde la línea de comandos.                                                                                                                                                                                                                                                                          |
2. Abra el plugin, cree su clave pública y configure su cliente de correo electrónico para usarla.

3. Suba su clave pública en <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Consejo:
     </strong>
     <span>Puede visitar <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> para administrar su clave en el futuro.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Complemento opcional:
     </strong>
     <span>
       Si está usando nuestro servicio de <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">almacenamiento cifrado (IMAP/POP3)</a> y desea que <i>todos</i> los correos electrónicos almacenados en su base de datos SQLite (ya cifrada) estén cifrados con su clave pública, entonces vaya a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias (por ejemplo, <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Editar <i class="fa fa-angle-right"></i> OpenPGP y suba su clave pública.
     </span>
   </div>

4. Añada un nuevo registro `CNAME` a su nombre de dominio (por ejemplo, `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Nombre/Host/Alias</th>
         <th class="text-center">TTL</th>
         <th>Tipo</th>
         <th>Respuesta/Valor</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td><code>openpgpkey</code></td>
         <td class="text-center">3600</td>
         <td class="notranslate">CNAME</td>
         <td><code>wkd.keys.openpgp.org</code></td>
       </tr>
     </tbody>
   </table>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Consejo:
     </strong>
     <span>Si su alias usa nuestros <a class="alert-link" href="/disposable-addresses" target="_blank">dominios desechables/de vanidad</a> (por ejemplo, <code>hideaddress.net</code>), entonces puede omitir este paso.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ¡Felicidades!
    </strong>
    <span>
      Ha completado con éxito todos los pasos.
    </span>
  </div>
</div>

### ¿Soportan cifrado S/MIME {#do-you-support-smime-encryption}

Sí, soportamos el cifrado [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) tal como se define en [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME proporciona cifrado de extremo a extremo usando certificados X.509, que es ampliamente soportado por clientes de correo electrónico empresariales.

Soportamos certificados tanto RSA como ECC (Criptografía de Curva Elíptica):

* **Certificados RSA**: mínimo 2048 bits, recomendado 4096 bits
* **Certificados ECC**: curvas NIST P-256, P-384 y P-521

Para configurar el cifrado S/MIME para su alias:

1. Obtenga un certificado S/MIME de una Autoridad Certificadora (CA) confiable o genere un certificado autofirmado para pruebas.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Consejo:
     </strong>
     <span>Certificados S/MIME gratuitos están disponibles de proveedores como <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> o <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Exporte su certificado en formato PEM (solo el certificado público, no la clave privada).

3. Vaya a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias (por ejemplo, <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Editar <i class="fa fa-angle-right"></i> S/MIME y suba su certificado público.
4. Una vez configurado, todos los correos entrantes a tu alias serán cifrados usando tu certificado S/MIME antes de ser almacenados o reenviados.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Nota:
     </strong>
     <span>
       El cifrado S/MIME se aplica a los mensajes entrantes que no están ya cifrados. Si un mensaje ya está cifrado con OpenPGP o S/MIME, no se volverá a cifrar.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Importante:
     </strong>
     <span>
       El cifrado S/MIME no se aplicará al reenvío de correo electrónico a través de nuestros servidores MX si el remitente tenía una política DMARC de rechazo. Si necesitas cifrado S/MIME en <em>todos</em> los correos, te sugerimos usar nuestro servicio IMAP y configurar tu certificado S/MIME para tu alias en el correo entrante.
     </span>
   </div>

Los siguientes clientes de correo tienen soporte integrado para S/MIME:

| Cliente de correo | Plataforma | Notas                                                                                                               |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------------------ |
| Apple Mail        | macOS     | Soporte S/MIME integrado. Ve a Mail > Preferences > Accounts > tu cuenta > Trust para configurar certificados.      |
| Apple Mail        | iOS       | Soporte S/MIME integrado. Ve a Settings > Mail > Accounts > tu cuenta > Advanced > S/MIME para configurar.          |
| Microsoft Outlook | Windows   | Soporte S/MIME integrado. Ve a File > Options > Trust Center > Trust Center Settings > Email Security para configurar. |
| Microsoft Outlook | macOS     | Soporte S/MIME integrado. Ve a Tools > Accounts > Advanced > Security para configurar.                              |
| Thunderbird       | Escritorio| Soporte S/MIME integrado. Ve a Account Settings > End-To-End Encryption > S/MIME para configurar.                   |
| GNOME Evolution   | Escritorio| Soporte S/MIME integrado. Ve a Edit > Preferences > Mail Accounts > tu cuenta > Security para configurar.           |
| KMail             | Escritorio| Soporte S/MIME integrado. Ve a Settings > Configure KMail > Identities > tu identidad > Cryptography para configurar.|

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ¡Felicidades!
    </strong>
    <span>
      Has configurado correctamente el cifrado S/MIME para tu alias.
    </span>
  </div>
</div>

### ¿Soportan filtrado de correo con Sieve? {#do-you-support-sieve-email-filtering}

¡Sí! Soportamos el filtrado de correo con [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) tal como se define en [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve es un lenguaje de scripting potente y estandarizado para el filtrado de correo en el servidor que te permite organizar, filtrar y responder automáticamente a los mensajes entrantes.

#### Extensiones Sieve soportadas {#supported-sieve-extensions}

Soportamos un conjunto completo de extensiones Sieve:

| Extensión                   | RFC                                                                                     | Descripción                                      |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | Archivar mensajes en carpetas específicas        |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                               | Rechazar mensajes con un error                    |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                               | Respuestas automáticas de vacaciones/ausencia     |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                               | Intervalos detallados para respuestas de vacaciones |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                               | Establecer flags IMAP (\Seen, \Flagged, etc.)     |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | Probar remitente/destinatario del sobre           |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                               | Probar contenido del cuerpo del mensaje           |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                               | Almacenar y usar variables en scripts             |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                               | Comparaciones relacionales (mayor que, menor que) |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                               | Comparaciones numéricas                            |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                               | Copiar mensajes mientras se redirigen             |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                               | Añadir o eliminar encabezados de mensajes         |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | Probar valores de fecha/hora                        |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | Acceder a ocurrencias específicas de encabezados  |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)  | Coincidencia con expresiones regulares             |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                               | Enviar notificaciones (por ejemplo, mailto:)       |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                               | Acceder a información del entorno                   |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                               | Probar existencia de buzones, crear buzones        |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                               | Archivar en buzones de uso especial (\Junk, \Trash)|
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                               | Detectar mensajes duplicados                        |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                               | Probar disponibilidad de extensiones               |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                               | Acceder a partes de direcciones user+detalle       |
#### Extensiones No Soportadas {#extensions-not-supported}

Las siguientes extensiones no están soportadas actualmente:

| Extensión                                                      | Razón                                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                      | Riesgo de seguridad (inyección de scripts) y requiere almacenamiento global de scripts |
| `mboxmetadata` / `servermetadata`                              | Requiere soporte para la extensión IMAP METADATA                   |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Manipulación compleja del árbol MIME aún no implementada           |

#### Ejemplos de Scripts Sieve {#example-sieve-scripts}

**Archivar boletines en una carpeta:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Respuesta automática cuando estás de vacaciones:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Fuera de la oficina"
    "Actualmente estoy fuera de la oficina y responderé cuando regrese.";
```

**Marcar mensajes de remitentes importantes:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Rechazar spam con asuntos específicos:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Mensaje rechazado debido a contenido de spam.";
}
```

#### Gestión de Scripts Sieve {#managing-sieve-scripts}

Puedes gestionar tus scripts Sieve de varias maneras:

1. **Interfaz Web**: Ve a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Scripts Sieve para crear y administrar scripts.

2. **Protocolo ManageSieve**: Conéctate usando cualquier cliente compatible con ManageSieve (como el complemento Sieve de Thunderbird o [sieve-connect](https://github.com/philpennock/sieve-connect)) a `imap.forwardemail.net`. Usa el puerto `2190` con STARTTLS (recomendado para la mayoría de clientes) o el puerto `4190` con TLS implícito.

3. **API**: Usa nuestra [API REST](/api#sieve-scripts) para gestionar scripts programáticamente.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Nota:
  </strong>
  <span>
    El filtrado Sieve se aplica a los mensajes entrantes antes de que se almacenen en tu buzón. Los scripts se ejecutan en orden de prioridad, y la primera acción coincidente determina cómo se maneja el mensaje.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Seguridad:
  </strong>
  <span>
    Por seguridad, las acciones de redirección están limitadas a 10 por script y 100 por día. Las respuestas de vacaciones tienen limitación de frecuencia para prevenir abusos.
  </span>
</div>

### ¿Soportan MTA-STS? {#do-you-support-mta-sts}

Sí, desde el 2 de marzo de 2023 soportamos [MTA-STS](https://www.hardenize.com/blog/mta-sts). Puedes usar [esta plantilla](https://github.com/jpawlowski/mta-sts.template) si deseas habilitarlo en tu dominio.

Nuestra configuración está disponible públicamente en GitHub en <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### ¿Soportan passkeys y WebAuthn? {#do-you-support-passkeys-and-webauthn}

¡Sí! Desde el 13 de diciembre de 2023 hemos añadido soporte para passkeys [debido a la alta demanda](https://github.com/orgs/forwardemail/discussions/182).

Las passkeys te permiten iniciar sesión de forma segura sin requerir contraseña ni autenticación de dos factores.

Puedes validar tu identidad con toque, reconocimiento facial, contraseña basada en dispositivo o PIN.

Permitimos gestionar hasta 30 passkeys a la vez, para que puedas iniciar sesión con todos tus dispositivos fácilmente.

Aprende más sobre passkeys en los siguientes enlaces:

* [Inicia sesión en tus aplicaciones y sitios web con passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Usa passkeys para iniciar sesión en apps y sitios web en iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Artículo de Wikipedia sobre Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### ¿Soportan las mejores prácticas de correo electrónico {#do-you-support-email-best-practices}

Sí. Tenemos soporte integrado para SPF, DKIM, DMARC, ARC y SRS en todos los planes. También hemos trabajado extensamente con los autores originales de estas especificaciones y otros expertos en correo electrónico para asegurar la perfección y una alta entregabilidad.

### ¿Soportan webhooks de rebote {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
    ¿Buscas documentación sobre webhooks de correo electrónico? Consulta <a href="/faq#do-you-support-webhooks" class="alert-link">¿Soportan webhooks?</a> para más información.
  <span>
  </span>
</div>

Sí, desde el 14 de agosto de 2024 hemos añadido esta función. Ahora puedes ir a Mi Cuenta → Dominios → Configuración → URL de Webhook de Rebote y configurar una URL `http://` o `https://` a la que enviaremos una solicitud `POST` cada vez que un correo SMTP saliente rebote.

Esto es útil para que gestiones y monitorees tu SMTP saliente, y puede usarse para mantener suscriptores, gestionar bajas y detectar cuando ocurren rebotes.

Las cargas útiles del webhook de rebote se envían como un JSON con estas propiedades:

* `email_id` (String) - ID del correo que corresponde a un correo en Mi Cuenta → Correos (SMTP saliente)
* `list_id` (String) - el valor del encabezado `List-ID` (insensible a mayúsculas) si existe, del correo saliente original
* `list_unsubscribe` (String) - el valor del encabezado `List-Unsubscribe` (insensible a mayúsculas) si existe, del correo saliente original
* `feedback_id` (String) - el valor del encabezado `Feedback-ID` (insensible a mayúsculas) si existe, del correo saliente original
* `recipient` (String) - la dirección de correo del destinatario que rebotó o tuvo error
* `message` (String) - un mensaje de error detallado para el rebote
* `response` (String) - el mensaje de respuesta SMTP
* `response_code` (Number) - el código de respuesta SMTP analizado
* `truth_source` (String) - si el código de respuesta provino de una fuente confiable, este valor contendrá el nombre del dominio raíz (ej. `google.com` o `yahoo.com`)
* `bounce` (Object) - un objeto que contiene las siguientes propiedades que detallan el estado del rebote y rechazo
  * `action` (String) - acción del rebote (ej. `"reject"`)
  * `message` (String) - motivo del rebote (ej. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - categoría del rebote (ej. `"block"`)
  * `code` (Number) - código de estado del rebote (ej. `554`)
  * `status` (String) - código del rebote del mensaje de respuesta (ej. `5.7.1`)
  * `line` (Number) - número de línea analizado, si existe, [de la lista de análisis de rebotes de Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (ej. `526`)
* `headers` (Object) - pares clave-valor de los encabezados del correo saliente
* `bounced_at` (String) - fecha en formato [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) cuando ocurrió el error de rebote

Por ejemplo:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "La cuenta de correo a la que intentaste llegar está sobre cuota.",
  "response": "552 5.2.2 La cuenta de correo a la que intentaste llegar está sobre cuota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Buzón de Gmail lleno",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Aquí algunas notas adicionales sobre los webhooks de rebote:

* Si la carga útil del webhook contiene un valor `list_id`, `list_unsubscribe` o `feedback_id`, entonces debes tomar la acción apropiada para eliminar al `recipient` de la lista si es necesario.
  * Si el valor `bounce.category` fue uno de `"block"`, `"recipient"`, `"spam"` o `"virus"`, entonces definitivamente debes eliminar al usuario de la lista.
* Si necesitas verificar las cargas útiles del webhook (para asegurarte de que realmente provienen de nuestro servidor), puedes [resolver la dirección IP remota del cliente y el nombre de host usando una búsqueda inversa](https://nodejs.org/api/dns.html#dnspromisesreverseip) – debería ser `smtp.forwardemail.net`.
  * También puedes verificar la IP contra [nuestras direcciones IP publicadas](#what-are-your-servers-ip-addresses).
  * Ve a Mi Cuenta → Dominios → Configuración → Clave de Verificación de Firma de Carga Útil del Webhook para obtener tu clave de webhook.
    * Puedes rotar esta clave en cualquier momento por razones de seguridad.
    * Calcula y compara el valor `X-Webhook-Signature` de nuestra solicitud webhook con el valor calculado del cuerpo usando esta clave. Un ejemplo de cómo hacerlo está disponible en [esta publicación de Stack Overflow](https://stackoverflow.com/a/68885281).
  * Consulta la discusión en <https://github.com/forwardemail/free-email-forwarding/issues/235> para más información.
* Esperaremos hasta `5` segundos para que tu endpoint de webhook responda con un código de estado `200`, y reintentaremos hasta `1` vez.
* Si detectamos que tu URL de webhook de rebote tiene un error al intentar enviar una solicitud, te enviaremos un correo de cortesía una vez por semana.
### ¿Soportan webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
    ¿Buscas documentación sobre webhooks de rebote? Consulta <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">¿Soportan webhooks de rebote?</a> para más información.
  <span>
  </span>
</div>

Sí, desde el 15 de mayo de 2020 hemos añadido esta función. ¡Puedes simplemente añadir webhook(s) exactamente como lo harías con cualquier destinatario! Por favor asegúrate de que la URL del webhook tenga el prefijo del protocolo "http" o "https".

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Protección de privacidad mejorada:
  </strong>
  <span>
    Si estás en un plan de pago (que incluye protección de privacidad mejorada), entonces por favor ve a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> y haz clic en "Aliases" junto a tu dominio para configurar tus webhooks. Si quieres saber más sobre los planes de pago, consulta nuestra página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Precios</a>. De lo contrario, puedes continuar siguiendo las instrucciones a continuación.
  </span>
</div>

Si estás en el plan gratuito, simplemente añade un nuevo registro DNS <strong class="notranslate">TXT</strong> como se muestra a continuación:

Por ejemplo, si quiero que todos los correos que vayan a `alias@example.com` se reenvíen a un nuevo endpoint de prueba [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

O quizás quieres que todos los correos que vayan a `example.com` se reenvíen a este endpoint:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Aquí hay notas adicionales respecto a los webhooks:**

* Si necesitas verificar las cargas útiles de los webhooks (para asegurarte de que realmente provienen de nuestro servidor), entonces puedes [resolver la dirección IP remota del cliente y el nombre de host usando una búsqueda inversa](https://nodejs.org/api/dns.html#dnspromisesreverseip) – debería ser `mx1.forwardemail.net` o `mx2.forwardemail.net`.
  * También puedes verificar la IP contra [nuestras direcciones IP publicadas](#what-are-your-servers-ip-addresses).
  * Si estás en un plan de pago, ve a Mi Cuenta → Dominios → Configuración → Clave de Verificación de Firma de Webhook para obtener tu clave de webhook.
    * Puedes rotar esta clave en cualquier momento por razones de seguridad.
    * Calcula y compara el valor `X-Webhook-Signature` de nuestra solicitud webhook con el valor calculado del cuerpo usando esta clave. Un ejemplo de cómo hacerlo está disponible en [esta publicación de Stack Overflow](https://stackoverflow.com/a/68885281).
  * Consulta la discusión en <https://github.com/forwardemail/free-email-forwarding/issues/235> para más información.
* Si un webhook no responde con un código de estado `200`, almacenaremos su respuesta en el [registro de errores creado](#do-you-store-error-logs) – lo cual es útil para depuración.
* Las solicitudes HTTP de webhook se reintentarán hasta 3 veces en cada intento de conexión SMTP, con un tiempo máximo de espera de 60 segundos por solicitud POST al endpoint. **Nota que esto no significa que solo se reintente 3 veces**, en realidad se reintentará continuamente con el tiempo enviando un código SMTP 421 (que indica al remitente reintentar más tarde) después del tercer intento fallido de solicitud POST HTTP. Esto significa que el correo se reintentará continuamente durante días hasta que se logre un código de estado 200.
* Reintentaremos automáticamente basándonos en los códigos de estado y error predeterminados usados en el [método retry de superagent](https://ladjs.github.io/superagent/#retrying-requests) (somos mantenedores).
* Agrupamos las solicitudes HTTP de webhook al mismo endpoint en una sola solicitud en lugar de múltiples para ahorrar recursos y acelerar el tiempo de respuesta. Por ejemplo, si envías un correo a <webhook1@example.com>, <webhook2@example.com> y <webhook3@example.com>, y todos están configurados para apuntar al mismo URL *exacto* del endpoint, solo se hará una solicitud. Agrupamos por coincidencia exacta del endpoint con igualdad estricta.
* Ten en cuenta que usamos el método "simpleParser" de la librería [mailparser](https://nodemailer.com/extras/mailparser/) para analizar el mensaje en un objeto amigable con JSON.
* El valor del correo en bruto como String se da en la propiedad "raw".
* Los resultados de autenticación se dan en las propiedades "dkim", "spf", "arc", "dmarc" y "bimi".
* Los encabezados analizados del correo se dan en la propiedad "headers" – pero también puedes usar "headerLines" para una iteración y análisis más fácil.
* Los destinatarios agrupados para este webhook están agrupados y dados en la propiedad "recipients".
* La información de la sesión SMTP se da en la propiedad "session". Esto contiene información sobre el remitente del mensaje, hora de llegada del mensaje, HELO y nombre de host del cliente. El valor del nombre de host del cliente como `session.clientHostname` es ya sea el FQDN (de una búsqueda PTR inversa) o es `session.remoteAddress` entre corchetes (por ejemplo `"[127.0.0.1]"`).
* Si necesitas una forma rápida de obtener el valor de `X-Original-To`, puedes usar el valor de `session.recipient` (ver ejemplo abajo). El encabezado `X-Original-To` es un encabezado que añadimos a los mensajes para depuración con el destinatario original (antes del reenvío enmascarado) del mensaje.
* Si necesitas eliminar las propiedades `attachments` y/o `raw` del cuerpo de la carga útil, simplemente añade `?attachments=false`, `?raw=false` o `?attachments=false&raw=false` a tu endpoint de webhook como parámetro de consulta (por ejemplo `https://example.com/webhook?attachments=false&raw=false`).
* Si hay archivos adjuntos, se añadirán al Array `attachments` con valores Buffer. Puedes volver a analizarlos en contenido usando un enfoque con JavaScript como:
  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
  <span>
  </span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### ¿Soportan expresiones regulares o regex? {#do-you-support-regular-expressions-or-regex}

Sí, desde el 27 de septiembre de 2021 hemos añadido esta función. Puedes simplemente escribir expresiones regulares ("regex") para hacer coincidir alias y realizar sustituciones.

Los alias que soportan expresiones regulares son aquellos que comienzan con `/` y terminan con `/` y cuyos destinatarios son direcciones de correo electrónico o webhooks. Los destinatarios también pueden incluir soporte para sustituciones regex (por ejemplo, `$1`, `$2`).

Soportamos dos flags de expresiones regulares incluyendo `i` y `g`. El flag de insensibilidad a mayúsculas y minúsculas `i` es un valor predeterminado permanente y siempre se aplica. El flag global `g` puede ser añadido por ti agregando `/g` al final del `/`.

Ten en cuenta que también soportamos nuestra <a href="#can-i-disable-specific-aliases">función de alias deshabilitados</a> para la parte del destinatario con nuestro soporte regex.

Las expresiones regulares no están soportadas en <a href="/disposable-addresses" target="_blank">dominios globales de vanidad</a> (ya que esto podría ser una vulnerabilidad de seguridad).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Protección de Privacidad Mejorada:
  </strong>
  <span>
    Si estás en un plan de pago (que incluye protección de privacidad mejorada), por favor ve a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> y haz clic en "Aliases" junto a tu dominio para configurar alias, incluyendo aquellos con expresiones regulares. Si deseas saber más sobre los planes de pago, consulta nuestra página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Precios</a>.
  </span>
</div>

#### Ejemplos para Protección de Privacidad Mejorada {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre del Alias</th>
      <th>Efecto</th>
      <th>Prueba</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>Correos a `linus@example.com` o `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">ver prueba en RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>Correos a `24highst@example.com` o `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">ver prueba en RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
    Para probar estas expresiones en <a href="https://regexr.com" class="alert-link">RegExr</a>, escribe la expresión en el cuadro superior y luego escribe un alias de ejemplo en el cuadro de texto inferior. Si coincide, se pondrá azul.
  <span>
  </span>
</div>

#### Ejemplos para el plan gratuito {#examples-for-the-free-plan}

Si estás en el plan gratuito, simplemente añade un nuevo registro DNS <strong class="notranslate">TXT</strong> usando uno o más de los ejemplos proporcionados a continuación:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Ejemplo Simple:</strong> Si quiero que todos los correos que vayan a `linus@example.com` o `torvalds@example.com` se reenvíen a `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Ejemplo de Sustitución Nombre Apellido:</strong> Imagina que todas las direcciones de correo de tu empresa tienen el patrón `firstname.lastname@example.com`. Si quiero que todos los correos que vayan al patrón `firstname.lastname@example.com` se reenvíen a `firstname.lastname@company.com` con soporte de sustitución (<a href="https://regexr.com/66hnu" class="alert-link">ver prueba en RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Ejemplo de sustitución de filtrado con símbolo más:</strong> Si quiero que todos los correos que vayan a `info@example.com` o `support@example.com` se reenvíen a `user+info@gmail.com` o `user+support@gmail.com` respectivamente (con soporte de sustitución) (<a href="https://regexr.com/66ho7" class="alert-link">ver prueba en RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Ejemplo de sustitución en cadena de consulta de webhook:</strong> Quizás quieras que todos los correos que vayan a `example.com` vayan a un <a href="#do-you-support-webhooks" class="alert-link">webhook</a> y tengan una clave dinámica en la cadena de consulta llamada "to" con un valor que sea la parte del nombre de usuario de la dirección de correo (<a href="https://regexr.com/66ho4" class="alert-link">ver prueba en RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Ejemplo de rechazo silencioso:</strong> Si quieres que todos los correos que coincidan con cierto patrón sean deshabilitados y rechazados silenciosamente (aparece para el remitente como si el mensaje se enviara correctamente, pero en realidad no llega a ningún lado) con código de estado `250` (ver <a href="#can-i-disable-specific-aliases" class="alert-link">¿Puedo deshabilitar alias específicos?</a>), simplemente usa el mismo enfoque con un solo signo de exclamación "!". Esto indica al remitente que el mensaje fue entregado con éxito, pero en realidad no llegó a ningún lado (por ejemplo, agujero negro o `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Ejemplo de rechazo suave:</strong> Si quieres que todos los correos que coincidan con cierto patrón sean deshabilitados y rechazados suavemente con código de estado `421` (ver <a href="#can-i-disable-specific-aliases" class="alert-link">¿Puedo deshabilitar alias específicos?</a>), simplemente usa el mismo enfoque con un doble signo de exclamación "!!". Esto indica al remitente que reintente enviar su correo, y los correos a este alias serán reintentados durante aproximadamente 5 días y luego rechazados permanentemente.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Ejemplo de rechazo duro:</strong> Si desea que todos los correos electrónicos que coincidan con un cierto patrón sean deshabilitados y rechazados de forma definitiva con el código de estado `550` (vea <a href="#can-i-disable-specific-aliases" class="alert-link">¿Puedo deshabilitar alias específicos?</a>), entonces simplemente use el mismo enfoque con tres signos de exclamación "!!!". Esto indica al remitente un error permanente y los correos no se reintentaran, serán rechazados para este alias.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
    ¿Tienes curiosidad sobre cómo escribir una expresión regular o necesitas probar tu reemplazo? Puedes ir al sitio web gratuito de pruebas de expresiones regulares <a href="https://regexr.com" class="alert-link">RegExr</a> en <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### ¿Cuáles son sus límites de SMTP saliente? {#what-are-your-outbound-smtp-limits}

Limitamos a los usuarios y dominios a 300 mensajes SMTP salientes por 1 día. Esto promedia más de 9000 correos electrónicos en un mes calendario. Si necesita superar esta cantidad o tiene correos electrónicos consistentemente grandes, por favor [contáctenos](https://forwardemail.net/help).

### ¿Necesito aprobación para habilitar SMTP? {#do-i-need-approval-to-enable-smtp}

Sí, tenga en cuenta que para mantener la reputación de IP y asegurar la entregabilidad, Forward Email tiene un proceso de revisión manual por dominio para la aprobación de SMTP saliente. Envíe un correo a <support@forwardemail.net> o abra una [solicitud de ayuda](https://forwardemail.net/help) para la aprobación. Esto típicamente toma menos de 24 horas, con la mayoría de las solicitudes siendo aprobadas en 1-2 horas. En un futuro cercano, planeamos hacer este proceso instantáneo con controles adicionales de spam y alertas. Este proceso asegura que sus correos lleguen a la bandeja de entrada y que sus mensajes no sean marcados como spam.

### ¿Cuáles son los ajustes de configuración de su servidor SMTP? {#what-are-your-smtp-server-configuration-settings}

Nuestro servidor es `smtp.forwardemail.net` y también se monitorea en nuestra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de estado</a>.

Soporta tanto IPv4 como IPv6 y está disponible en los puertos `465` y `2465` para SSL/TLS (recomendado) y `587`, `2587`, `2525` y `25` para TLS (STARTTLS).

**A partir de octubre de 2025**, ahora soportamos conexiones **TLS 1.0 heredadas** en los puertos `2455` (SSL/TLS) y `2555` (STARTTLS) para dispositivos antiguos como impresoras, escáneres, cámaras y clientes de correo heredados que no pueden soportar versiones modernas de TLS. Estos puertos se ofrecen como alternativa a Gmail, Yahoo, Outlook y otros proveedores que han discontinuado el soporte para protocolos TLS antiguos.

> \[!CAUTION]
> **Soporte TLS 1.0 heredado (Puertos 2455 y 2555)**: Estos puertos usan el protocolo TLS 1.0 obsoleto que tiene vulnerabilidades de seguridad conocidas (BEAST, POODLE). Use estos puertos solo si su dispositivo absolutamente no puede soportar TLS 1.2 o superior. Recomendamos encarecidamente actualizar el firmware de su dispositivo o cambiar a clientes de correo modernos siempre que sea posible. Estos puertos están destinados únicamente para compatibilidad con hardware heredado (impresoras antiguas, escáneres, cámaras, dispositivos IoT).

|                                     Protocolo                                     | Nombre de host          |            Puertos           |        IPv4        |        IPv6        | Notas                                  |
| :--------------------------------------------------------------------------------: | ----------------------- | :--------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Preferido**                              | `smtp.forwardemail.net` |        `465`, `2465`         | :white_check_mark: | :white_check_mark: | TLS 1.2+ moderno (Recomendado)         |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))          | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25`  | :white_check_mark: | :white_check_mark: | Soportado (preferir puerto SSL/TLS `465`) |
|                             `SSL/TLS` **Solo heredado**                           | `smtp.forwardemail.net` |            `2455`            | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 solo para dispositivos antiguos |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Solo heredado** | `smtp.forwardemail.net` |            `2555`            | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 solo para dispositivos antiguos |
| Inicio de sesión | Ejemplo                   | Descripción                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre de usuario | `user@example.com`         | Dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a>. |
| Contraseña | `************************` | Alias                                                                                                                                                                                     |

Para enviar correo saliente con SMTP, el **usuario SMTP** debe ser la dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> – y la **contraseña SMTP** debe ser una contraseña generada específica para el alias.

Por favor, consulte [¿Soportan el envío de correo con SMTP](#do-you-support-sending-email-with-smtp) para instrucciones paso a paso.

### ¿Cuáles son los ajustes de configuración de su servidor IMAP? {#what-are-your-imap-server-configuration-settings}

Nuestro servidor es `imap.forwardemail.net` y también se supervisa en nuestra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de estado</a>.

Soporta tanto IPv4 como IPv6 y está disponible en los puertos `993` y `2993` para SSL/TLS.

|         Protocolo        | Nombre del host          |     Puertos   |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferido** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Inicio de sesión | Ejemplo                   | Descripción                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre de usuario | `user@example.com`         | Dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a>. |
| Contraseña | `************************` | Contraseña generada específica para el alias.                                                                                                                                             |

Para conectarse con IMAP, el **usuario IMAP** debe ser la dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> – y la **contraseña IMAP** debe ser una contraseña generada específica para el alias.

Por favor, consulte [¿Soportan la recepción de correo con IMAP](#do-you-support-receiving-email-with-imap) para instrucciones paso a paso.

### ¿Cuáles son los ajustes de configuración de su servidor POP3? {#what-are-your-pop3-server-configuration-settings}

Nuestro servidor es `pop3.forwardemail.net` y también se supervisa en nuestra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de estado</a>.

Soporta tanto IPv4 como IPv6 y está disponible en los puertos `995` y `2995` para SSL/TLS.

|         Protocolo        | Nombre del host          |     Puertos   |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferido** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Inicio de sesión | Ejemplo                   | Descripción                                                                                                                                                                              |
| --------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre de usuario | `user@example.com`        | Dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a>. |
| Contraseña      | `************************` | Contraseña generada específica para el alias.                                                                                                                                           |

Para conectarse con POP3, el **usuario POP3** debe ser la dirección de correo electrónico de un alias que exista para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> – y la **contraseña IMAP** debe ser una contraseña generada específica para el alias.

Por favor, consulte [¿Soportan POP3](#do-you-support-pop3) para instrucciones paso a paso.

### ¿Cómo configuro la autodetección de correo electrónico para mi dominio? {#how-do-i-set-up-email-autodiscovery-for-my-domain}

La autodetección de correo electrónico permite que clientes de correo como **Thunderbird**, **Apple Mail**, **Microsoft Outlook** y dispositivos móviles detecten automáticamente la configuración correcta de los servidores IMAP, SMTP, POP3, CalDAV y CardDAV cuando un usuario añade su cuenta de correo. Esto está definido por [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (correo electrónico) y [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) y utiliza registros DNS SRV.

Forward Email publica registros de autodetección en `forwardemail.net`. Puede añadir registros SRV directamente a su dominio, o usar un método más sencillo con CNAME.

#### Opción A: registros CNAME (más sencillo) {#option-a-cname-records-simplest}

Añada estos dos registros CNAME al DNS de su dominio. Esto delega la autodetección a los servidores de Forward Email:

|  Tipo | Nombre/Host    | Destino/Valor                  |
| :---: | -------------- | ----------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net` |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

El registro `autoconfig` es usado por **Thunderbird** y otros clientes basados en Mozilla. El registro `autodiscover` es usado por **Microsoft Outlook**.

#### Opción B: registros SRV (directo) {#option-b-srv-records-direct}

Si prefiere añadir los registros directamente (o su proveedor DNS no soporta CNAME en subdominios), añada estos registros SRV a su dominio:

| Tipo | Nombre/Host           | Prioridad | Peso | Puerto | Destino/Valor              | Propósito                              |
| :--: | -------------------- | :-------: | :--: | :----: | ------------------------- | ------------------------------------- |
|  SRV | `_imaps._tcp`        |     0     |  1   |  993   | `imap.forwardemail.net`   | IMAP sobre SSL/TLS (preferido)        |
|  SRV | `_imap._tcp`         |     0     |  0   |   0    | `.`                       | IMAP en texto plano deshabilitado     |
|  SRV | `_submissions._tcp`  |     0     |  1   |  465   | `smtp.forwardemail.net`   | Envío SMTP (SSL/TLS, recomendado)     |
|  SRV | `_submission._tcp`   |     5     |  1   |  587   | `smtp.forwardemail.net`   | Envío SMTP (STARTTLS)                  |
|  SRV | `_pop3s._tcp`        |    10     |  1   |  995   | `pop3.forwardemail.net`   | POP3 sobre SSL/TLS                     |
|  SRV | `_pop3._tcp`         |     0     |  0   |   0    | `.`                       | POP3 en texto plano deshabilitado     |
|  SRV | `_caldavs._tcp`      |     0     |  1   |  443   | `caldav.forwardemail.net` | CalDAV sobre TLS (calendarios)        |
|  SRV | `_caldav._tcp`       |     0     |  0   |   0    | `.`                       | CalDAV en texto plano deshabilitado   |
|  SRV | `_carddavs._tcp`     |     0     |  1   |  443   | `carddav.forwardemail.net`| CardDAV sobre TLS (contactos)          |
|  SRV | `_carddav._tcp`      |     0     |  0   |   0    | `.`                       | CardDAV en texto plano deshabilitado  |
> \[!NOTE]
> IMAP tiene un valor de prioridad más bajo (0) que POP3 (10), lo que indica a los clientes de correo que prefieran IMAP sobre POP3 cuando ambos están disponibles. Los registros con un destino de `.` (un solo punto) indican que las versiones en texto plano (no cifradas) de esos protocolos están intencionalmente deshabilitadas según [RFC 6186 Sección 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). Los registros SRV de CalDAV y CardDAV siguen [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) para el autodescubrimiento de calendarios y contactos.

#### ¿Qué clientes de correo soportan el autodescubrimiento? {#which-email-clients-support-autodiscovery}

| Cliente            | Correo                                           | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | Registros CNAME o SRV `autoconfig`                | Registros XML o SRV `autoconfig` (RFC 6764) |
| Apple Mail (macOS) | Registros SRV (RFC 6186)                          | Registros SRV (RFC 6764)                     |
| Apple Mail (iOS)   | Registros SRV (RFC 6186)                          | Registros SRV (RFC 6764)                     |
| Microsoft Outlook  | CNAME `autodiscover` o SRV `_autodiscover._tcp` | No soportado                              |
| GNOME (Evolution)  | Registros SRV (RFC 6186)                          | Registros SRV (RFC 6764)                     |
| KDE (KMail)        | Registros SRV (RFC 6186)                          | Registros SRV (RFC 6764)                     |
| eM Client          | `autoconfig` o `autodiscover`                     | Registros SRV (RFC 6764)                     |

> \[!TIP]
> Para la mejor compatibilidad en todos los clientes, recomendamos usar **Opción A** (registros CNAME) combinada con los registros SRV de la **Opción B**. El enfoque CNAME por sí solo cubre la mayoría de los clientes de correo. Los registros SRV de CalDAV/CardDAV aseguran que los clientes de calendario y contactos también puedan descubrir automáticamente la configuración de su servidor.


## Seguridad {#security-1}

### Técnicas avanzadas de endurecimiento del servidor {#advanced-server-hardening-techniques}

> \[!TIP]
> Aprende más sobre nuestra infraestructura de seguridad en [nuestra página de Seguridad](/security).

Forward Email implementa numerosas técnicas de endurecimiento del servidor para garantizar la seguridad de nuestra infraestructura y tus datos:

1. **Seguridad de red**:
   * Firewall con reglas estrictas en tablas IP
   * Fail2ban para protección contra fuerza bruta
   * Auditorías de seguridad y pruebas de penetración regulares
   * Acceso administrativo solo vía VPN

2. **Endurecimiento del sistema**:
   * Instalación mínima de paquetes
   * Actualizaciones de seguridad regulares
   * SELinux en modo enforcing
   * Acceso SSH root deshabilitado
   * Autenticación solo con claves

3. **Seguridad de la aplicación**:
   * Encabezados Content Security Policy (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * Encabezados de protección contra XSS
   * Opciones de frame y política de referer
   * Auditorías regulares de dependencias

4. **Protección de datos**:
   * Cifrado completo del disco con LUKS
   * Gestión segura de claves
   * Copias de seguridad regulares con cifrado
   * Prácticas de minimización de datos

5. **Monitoreo y respuesta**:
   * Detección de intrusiones en tiempo real
   * Escaneo de seguridad automatizado
   * Registro y análisis centralizados
   * Procedimientos de respuesta a incidentes

> \[!IMPORTANT]
> Nuestras prácticas de seguridad se actualizan continuamente para abordar amenazas y vulnerabilidades emergentes.

> \[!TIP]
> Para máxima seguridad, recomendamos usar nuestro servicio con cifrado de extremo a extremo mediante OpenPGP.

### ¿Tienen certificaciones SOC 2 o ISO 27001? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email opera sobre infraestructura proporcionada por subprocesadores certificados para garantizar el cumplimiento con los estándares de la industria.

Forward Email no posee directamente certificaciones SOC 2 Tipo II o ISO 27001. Sin embargo, el servicio opera sobre infraestructura proporcionada por subprocesadores certificados:

* **DigitalOcean**: certificado SOC 2 Tipo II y SOC 3 Tipo II (auditado por Schellman & Company LLC), certificado ISO 27001 en múltiples centros de datos. Detalles: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: Certificado SOC 2+ (HIPAA), certificaciones ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detalles: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: Cumple con SOC 2 (contactar directamente a DataPacket para obtener la certificación), proveedor de infraestructura de nivel empresarial (ubicación en Denver). Detalles: <https://www.datapacket.com/datacenters/denver>

Forward Email sigue las mejores prácticas de la industria para auditorías de seguridad y se relaciona regularmente con investigadores de seguridad independientes. Fuente: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### ¿Usan cifrado TLS para el reenvío de correo electrónico {#do-you-use-tls-encryption-for-email-forwarding}

Sí. Forward Email aplica estrictamente TLS 1.2+ para todas las conexiones (HTTPS, SMTP, IMAP, POP3) e implementa MTA-STS para soporte TLS mejorado. La implementación incluye:

* Aplicación de TLS 1.2+ para todas las conexiones de correo electrónico
* Intercambio de claves ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) para secreto perfecto hacia adelante
* Suites de cifrado modernas con actualizaciones regulares de seguridad
* Soporte HTTP/2 para mejor rendimiento y seguridad
* HSTS (HTTP Strict Transport Security) con precarga en los principales navegadores
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** para aplicación estricta de TLS

Fuente: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementación de MTA-STS**: Forward Email implementa una aplicación estricta de MTA-STS en la base de código. Cuando ocurren errores TLS y MTA-STS está aplicado, el sistema devuelve códigos de estado SMTP 421 para asegurar que los correos se reintenten más tarde en lugar de entregarse de forma insegura. Detalles de implementación:

* Detección de errores TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Aplicación de MTA-STS en el helper send-email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validación de terceros: <https://www.hardenize.com/report/forwardemail.net/1750312779> muestra calificaciones "Good" para todas las medidas de TLS y seguridad de transporte.

### ¿Preservan los encabezados de autenticación de correo electrónico {#do-you-preserve-email-authentication-headers}

Sí. Forward Email implementa y preserva de manera integral los encabezados de autenticación de correo electrónico:

* **SPF (Sender Policy Framework)**: Implementado y preservado correctamente
* **DKIM (DomainKeys Identified Mail)**: Soporte completo con gestión adecuada de claves
* **DMARC**: Aplicación de políticas para correos que fallan la validación SPF o DKIM
* **ARC**: Aunque no se detalla explícitamente, las puntuaciones perfectas de cumplimiento del servicio sugieren un manejo integral de encabezados de autenticación

Fuente: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validación: La prueba de correo de Internet.nl muestra una puntuación de 100/100 específicamente para la implementación de "SPF, DKIM y DMARC". La evaluación de Hardenize confirma calificaciones "Good" para SPF y DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### ¿Preservan los encabezados originales del correo y previenen el spoofing {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implementa protección sofisticada contra spoofing para prevenir el abuso de correo electrónico.

Forward Email preserva los encabezados originales del correo mientras implementa protección integral contra spoofing a través de la base de código MX:

* **Preservación de encabezados**: Se mantienen los encabezados de autenticación originales durante el reenvío
* **Anti-Spoofing**: La aplicación de políticas DMARC previene el spoofing de encabezados rechazando correos que fallan la validación SPF o DKIM
* **Prevención de inyección de encabezados**: Validación y saneamiento de entradas usando la biblioteca striptags
* **Protección avanzada**: Detección sofisticada de phishing con detección de spoofing, prevención de suplantación e sistemas de notificación al usuario

**Detalles de implementación MX**: La lógica principal de procesamiento de correo es manejada por la base de código del servidor MX, específicamente:

* Manejador principal de datos MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtrado arbitrario de correo (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

El helper `isArbitrary` implementa reglas sofisticadas anti-spoofing incluyendo detección de suplantación de dominio, frases bloqueadas y varios patrones de phishing.
### ¿Cómo se protege contra el spam y el abuso {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementa una protección integral de múltiples capas:

* **Limitación de tasa**: Aplicada a intentos de autenticación, endpoints de API y conexiones SMTP
* **Aislamiento de recursos**: Entre usuarios para prevenir el impacto de usuarios de alto volumen
* **Protección DDoS**: Protección de múltiples capas a través del sistema Shield de DataPacket y Cloudflare
* **Escalado automático**: Ajuste dinámico de recursos basado en la demanda
* **Prevención de abuso**: Controles específicos para cada usuario y bloqueo basado en hash para contenido malicioso
* **Autenticación de correo electrónico**: Protocolos SPF, DKIM, DMARC con detección avanzada de phishing

Fuentes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Detalles de protección DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### ¿Almacenan el contenido del correo electrónico en disco? {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email utiliza una arquitectura de conocimiento cero que impide que el contenido del correo electrónico se escriba en disco.

* **Arquitectura de conocimiento cero**: Buzones SQLite cifrados individualmente que impiden que Forward Email acceda al contenido del correo
* **Procesamiento en memoria**: El procesamiento del correo ocurre completamente en memoria, evitando el almacenamiento en disco
* **No registro de contenido**: "No registramos ni almacenamos contenido o metadatos de correo en disco"
* **Cifrado en sandbox**: Las claves de cifrado nunca se almacenan en disco en texto plano

**Evidencia en el código MX**: El servidor MX procesa los correos completamente en memoria sin escribir contenido en disco. El manejador principal de procesamiento de correo demuestra este enfoque en memoria: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fuentes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Resumen)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detalles de conocimiento cero)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Cifrado en sandbox)

### ¿Puede exponerse el contenido del correo durante fallos del sistema? {#can-email-content-be-exposed-during-system-crashes}

No. Forward Email implementa salvaguardas integrales contra la exposición de datos relacionada con fallos:

* **Core dumps deshabilitados**: Previene la exposición de memoria durante fallos
* **Memoria swap deshabilitada**: Completamente deshabilitada para evitar extracción de datos sensibles de archivos swap
* **Arquitectura en memoria**: El contenido del correo existe solo en memoria volátil durante el procesamiento
* **Protección de claves de cifrado**: Las claves nunca se almacenan en disco en texto plano
* **Seguridad física**: Discos cifrados con LUKS v2 que previenen acceso físico a los datos
* **Almacenamiento USB deshabilitado**: Previene extracción no autorizada de datos

**Manejo de errores para problemas del sistema**: Forward Email usa funciones auxiliares `isCodeBug` e `isTimeoutError` para asegurar que si ocurren problemas de conectividad con la base de datos, problemas de red/DNS/listas negras o problemas de conectividad upstream, el sistema devuelve códigos SMTP 421 para asegurar que los correos se reintenten más tarde en lugar de perderse o exponerse.

Detalles de implementación:

* Clasificación de errores: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Manejo de errores por timeout en procesamiento MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fuente: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### ¿Quién tiene acceso a su infraestructura de correo electrónico? {#who-has-access-to-your-email-infrastructure}

Forward Email implementa controles de acceso exhaustivos para su equipo mínimo de ingeniería de 2-3 personas con estrictos requisitos de 2FA:

* **Control de acceso basado en roles**: Para cuentas de equipo con permisos basados en recursos
* **Principio de menor privilegio**: Aplicado en todos los sistemas
* **Segregación de funciones**: Entre roles operativos
* **Gestión de usuarios**: Usuarios separados para despliegue y devops con permisos distintos
* **Inicio de sesión root deshabilitado**: Obliga a acceder mediante cuentas autenticadas correctamente
* **2FA estricta**: Sin 2FA por SMS debido al riesgo de ataques MiTM - solo tokens basados en app o hardware
* **Registro de auditoría completo**: Con redacción de datos sensibles
* **Detección automática de anomalías**: Para patrones de acceso inusuales
* **Revisiones regulares de seguridad**: De los registros de acceso
* **Prevención de ataques Evil Maid**: Almacenamiento USB deshabilitado y otras medidas de seguridad física
Fuentes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Controles de Autorización)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Seguridad de la Red)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Prevención de ataques de mayordomo malicioso)

### ¿Qué proveedores de infraestructura utilizan {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email utiliza múltiples subprocesadores de infraestructura con certificaciones de cumplimiento exhaustivas.

Los detalles completos están disponibles en nuestra página de cumplimiento GDPR: <https://forwardemail.net/gdpr>

**Subprocesadores principales de infraestructura:**

| Proveedor        | Certificado en Marco de Privacidad de Datos | Página de Cumplimiento GDPR                                                               |
| ---------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Cloudflare**   | ✅ Sí                                       | <https://www.cloudflare.com/trust-hub/gdpr/>                                               |
| **DataPacket**   | ❌ No                                       | <https://www.datapacket.com/privacy-policy>                                                |
| **DigitalOcean** | ❌ No                                       | <https://www.digitalocean.com/legal/gdpr>                                                  |
| **GitHub**       | ✅ Sí                                       | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ No                                       | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                            |

**Certificaciones detalladas:**

**DigitalOcean**

* SOC 2 Tipo II y SOC 3 Tipo II (auditado por Schellman & Company LLC)
* Certificado ISO 27001 en múltiples centros de datos
* Cumple con PCI-DSS
* Certificado CSA STAR Nivel 1
* Certificado APEC CBPR PRP
* Detalles: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Certificado SOC 2+ (HIPAA)
* Cumple con PCI Merchant
* Certificado CSA STAR Nivel 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detalles: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* Cumple con SOC 2 (contactar directamente a DataPacket para obtener certificación)
* Infraestructura de nivel empresarial (ubicación en Denver)
* Protección DDoS mediante la pila de ciberseguridad Shield
* Soporte técnico 24/7
* Red global con 58 centros de datos
* Detalles: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Certificado en Marco de Privacidad de Datos (EU-U.S., Swiss-U.S. y Extensión UK)
* Hospedaje de código fuente, CI/CD y gestión de proyectos
* Acuerdo de Protección de Datos de GitHub disponible
* Detalles: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Procesadores de Pago:**

* **Stripe**: Certificado en Marco de Privacidad de Datos - <https://stripe.com/legal/privacy-center>
* **PayPal**: No certificado en DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### ¿Ofrecen un Acuerdo de Procesamiento de Datos (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Sí, Forward Email ofrece un Acuerdo de Procesamiento de Datos (DPA) completo que puede firmarse con nuestro acuerdo empresarial. Una copia de nuestro DPA está disponible en: <https://forwardemail.net/dpa>

**Detalles del DPA:**

* Cubre el cumplimiento GDPR y los marcos de Privacy Shield EU-US/Suizo-US
* Aceptado automáticamente al aceptar nuestros Términos de Servicio
* No se requiere firma separada para el DPA estándar
* Arreglos personalizados de DPA disponibles mediante Licencia Empresarial

**Marco de Cumplimiento GDPR:**
Nuestro DPA detalla el cumplimiento con GDPR así como los requisitos internacionales de transferencia de datos. Información completa disponible en: <https://forwardemail.net/gdpr>

Para clientes empresariales que requieran términos personalizados de DPA o acuerdos contractuales específicos, estos pueden gestionarse a través de nuestro programa de **Licencia Empresarial ($250/mes)**.

### ¿Cómo manejan las notificaciones de violaciones de datos {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> La arquitectura de conocimiento cero de Forward Email limita significativamente el impacto de las violaciones.
* **Exposición limitada de datos**: No puede acceder al contenido de correos electrónicos cifrados debido a la arquitectura de conocimiento cero  
* **Recopilación mínima de datos**: Solo información básica del suscriptor y registros limitados de IP para seguridad  
* **Marcos de subprocesadores**: DigitalOcean, GitHub y Vultr mantienen procedimientos de respuesta a incidentes compatibles con GDPR  

**Información del representante GDPR:**  
Forward Email ha designado representantes GDPR de acuerdo con el Artículo 27:  

**Representante de la UE:**  
Osano International Compliance Services Limited  
ATTN: LFHC  
3 Dublin Landings, North Wall Quay  
Dublín 1, D01C4E0  

**Representante del Reino Unido:**  
Osano UK Compliance LTD  
ATTN: LFHC  
42-46 Fountain Street, Belfast  
Antrim, BT1 - 5EF  

Para clientes empresariales que requieran SLA específicos de notificación de brechas, estos deben discutirse como parte de un acuerdo de **Licencia Empresarial**.  

Fuentes:  

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>  
* <https://forwardemail.net/gdpr>  

### ¿Ofrecen un entorno de prueba {#do-you-offer-a-test-environment}  

La documentación técnica de Forward Email no describe explícitamente un modo sandbox dedicado. Sin embargo, los enfoques potenciales para pruebas incluyen:  

* **Opción de autoalojamiento**: Capacidades completas de autoalojamiento para crear entornos de prueba  
* **Interfaz API**: Potencial para pruebas programáticas de configuraciones  
* **Código abierto**: Código 100% abierto que permite a los clientes examinar la lógica de reenvío  
* **Múltiples dominios**: Soporte para múltiples dominios que podría permitir la creación de dominios de prueba  

Para clientes empresariales que requieran capacidades formales de sandbox, esto debe discutirse como parte de un acuerdo de **Licencia Empresarial**.  

Fuente: <https://github.com/forwardemail/forwardemail.net> (Detalles del entorno de desarrollo)  

### ¿Proveen herramientas de monitoreo y alertas {#do-you-provide-monitoring-and-alerting-tools}  

Forward Email ofrece monitoreo en tiempo real con algunas limitaciones:  

**Disponible:**  

* **Monitoreo de entrega en tiempo real**: Métricas de rendimiento visibles públicamente para los principales proveedores de correo electrónico  
* **Alertas automáticas**: Equipo de ingeniería alertado cuando los tiempos de entrega superan los 10 segundos  
* **Monitoreo transparente**: Sistemas de monitoreo 100% de código abierto  
* **Monitoreo de infraestructura**: Detección automática de anomalías y registro completo de auditorías  

**Limitaciones:**  

* No se documentan explícitamente webhooks orientados al cliente ni notificaciones de estado de entrega basadas en API  

Para clientes empresariales que requieran webhooks detallados de estado de entrega o integraciones personalizadas de monitoreo, estas capacidades pueden estar disponibles mediante acuerdos de **Licencia Empresarial**.  

Fuentes:  

* <https://forwardemail.net> (Visualización de monitoreo en tiempo real)  
* <https://github.com/forwardemail/forwardemail.net> (Implementación de monitoreo)  

### ¿Cómo aseguran alta disponibilidad {#how-do-you-ensure-high-availability}  

> \[!IMPORTANT]  
> Forward Email implementa redundancia integral a través de múltiples proveedores de infraestructura.  

* **Infraestructura distribuida**: Múltiples proveedores (DigitalOcean, Vultr, DataPacket) en regiones geográficas  
* **Balanceo de carga geográfico**: Balanceo de carga geo-localizado basado en Cloudflare con conmutación por error automática  
* **Escalado automático**: Ajuste dinámico de recursos según la demanda  
* **Protección DDoS multicapa**: A través del sistema Shield de DataPacket y Cloudflare  
* **Redundancia de servidores**: Múltiples servidores por región con conmutación por error automática  
* **Replicación de bases de datos**: Sincronización de datos en tiempo real en múltiples ubicaciones  
* **Monitoreo y alertas**: Monitoreo 24/7 con respuesta automática a incidentes  

**Compromiso de disponibilidad**: Disponibilidad del servicio del 99.9%+ con monitoreo transparente disponible en <https://forwardemail.net>  

Fuentes:  

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>  
* <https://www.datapacket.com/datacenters/denver>  

### ¿Cumplen con la Sección 889 de la Ley de Autorización de Defensa Nacional (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}  

> \[!IMPORTANT]  
> Forward Email cumple plenamente con la Sección 889 mediante la cuidadosa selección de socios de infraestructura.  

Sí, Forward Email es **compatible con la Sección 889**. La Sección 889 de la Ley de Autorización de Defensa Nacional (NDAA) prohíbe a las agencias gubernamentales usar o contratar con entidades que utilicen equipos de telecomunicaciones y videovigilancia de compañías específicas (Huawei, ZTE, Hikvision, Dahua y Hytera).
**Cómo Forward Email cumple con la Sección 889:**

Forward Email depende exclusivamente de dos proveedores clave de infraestructura, ninguno de los cuales utiliza equipos prohibidos por la Sección 889:

1. **Cloudflare**: Nuestro socio principal para servicios de red y seguridad de correo electrónico
2. **DataPacket**: Nuestro proveedor principal de infraestructura de servidores (utilizando exclusivamente equipos de Arista Networks y Cisco)
3. **Proveedores de respaldo**: Nuestros proveedores de respaldo Digital Ocean y Vultr están además confirmados por escrito como cumplidores de la Sección 889.

**Compromiso de Cloudflare**: Cloudflare declara explícitamente en su Código de Conducta para Terceros que no utilizan equipos de telecomunicaciones, productos de videovigilancia ni servicios de ninguna entidad prohibida por la Sección 889.

**Caso de uso gubernamental**: Nuestra conformidad con la Sección 889 fue validada cuando la **Academia Naval de EE. UU.** seleccionó Forward Email para sus necesidades de reenvío seguro de correo electrónico, requiriendo documentación de nuestros estándares de cumplimiento federal.

Para detalles completos sobre nuestro marco de cumplimiento gubernamental, incluyendo regulaciones federales más amplias, lea nuestro estudio de caso completo: [Servicio de correo electrónico del gobierno federal conforme a la Sección 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Detalles del sistema y técnicos {#system-and-technical-details}

### ¿Almacenan correos electrónicos y su contenido? {#do-you-store-emails-and-their-contents}

No, no escribimos en disco ni almacenamos registros – con la [excepción de errores](#do-you-store-error-logs) y [SMTP saliente](#do-you-support-sending-email-with-smtp) (vea nuestra [Política de Privacidad](/privacy)).

Todo se realiza en memoria y [nuestro código fuente está en GitHub](https://github.com/forwardemail).

### ¿Cómo funciona su sistema de reenvío de correo electrónico? {#how-does-your-email-forwarding-system-work}

El correo electrónico se basa en el [protocolo SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Este protocolo consiste en comandos enviados a un servidor (que comúnmente funciona en el puerto 25). Hay una conexión inicial, luego el remitente indica quién envía el correo ("MAIL FROM"), seguido de a quién va dirigido ("RCPT TO"), y finalmente las cabeceras y el cuerpo del correo electrónico ("DATA"). El flujo de nuestro sistema de reenvío de correo se describe en relación con cada comando del protocolo SMTP a continuación:

* Conexión inicial (sin nombre de comando, por ejemplo `telnet example.com 25`) - Esta es la conexión inicial. Verificamos los remitentes que no están en nuestra [lista blanca](#do-you-have-an-allowlist) contra nuestra [lista negra](#do-you-have-a-denylist). Finalmente, si un remitente no está en nuestra lista blanca, verificamos si ha sido [lista gris](#do-you-have-a-greylist).

* `HELO` - Esto indica un saludo para identificar el FQDN del remitente, dirección IP o nombre del manejador de correo. Este valor puede ser falsificado, por lo que no confiamos en estos datos y en su lugar usamos la búsqueda inversa del nombre de host de la dirección IP de la conexión.

* `MAIL FROM` - Esto indica la dirección de correo del sobre del email. Si se ingresa un valor, debe ser una dirección de correo válida según RFC 5322. Se permiten valores vacíos. Aquí [verificamos el backscatter](#how-do-you-protect-against-backscatter) y también comprobamos el MAIL FROM contra nuestra [lista negra](#do-you-have-a-denylist). Finalmente, verificamos los remitentes que no están en la lista blanca para limitar la tasa (vea la sección sobre [Limitación de tasa](#do-you-have-rate-limiting) y [lista blanca](#do-you-have-an-allowlist) para más información).

* `RCPT TO` - Esto indica el(los) destinatario(s) del correo. Deben ser direcciones válidas según RFC 5322. Solo permitimos hasta 50 destinatarios en el sobre por mensaje (esto es diferente del encabezado "Para" de un correo). También verificamos una dirección válida de [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") aquí para proteger contra suplantación con nuestro nombre de dominio SRS.

* `DATA` - Esta es la parte central de nuestro servicio que procesa un correo electrónico. Vea la sección [¿Cómo procesan un correo para reenvío?](#how-do-you-process-an-email-for-forwarding) a continuación para más detalles.
### ¿Cómo procesas un correo electrónico para reenviar {#how-do-you-process-an-email-for-forwarding}

Esta sección describe nuestro proceso relacionado con el comando del protocolo SMTP `DATA` en la sección [¿Cómo funciona su sistema de reenvío de correo electrónico?](#how-does-your-email-forwarding-system-work) arriba – es cómo procesamos los encabezados, cuerpo, seguridad del correo electrónico, determinamos a dónde debe ser entregado y cómo manejamos las conexiones.

1. Si el mensaje excede el tamaño máximo de 50mb, entonces es rechazado con un código de error 552.

2. Si el mensaje no contenía un encabezado "From", o si alguno de los valores en el encabezado "From" no eran direcciones de correo electrónico válidas según RFC 5322, entonces es rechazado con un código de error 550.

3. Si el mensaje tenía más de 25 encabezados "Received", entonces se determinó que estaba atrapado en un bucle de redirección, y es rechazado con un código de error 550.

4. Usando la huella digital del correo electrónico (ver la sección sobre [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), verificaremos si el mensaje ha intentado ser reenviado por más de 5 días (lo cual coincide con el [comportamiento predeterminado de postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), y si es así, será rechazado con un código de error 550.

5. Almacenamos en memoria los resultados del escaneo del correo electrónico usando [Spam Scanner](https://spamscanner.net).

6. Si hubo algún resultado arbitrario de Spam Scanner, entonces es rechazado con un código de error 554. Los resultados arbitrarios solo incluyen la prueba GTUBE al momento de esta redacción. Vea <https://spamassassin.apache.org/gtube/> para más información.

7. Añadiremos los siguientes encabezados al mensaje para propósitos de depuración y prevención de abuso:

   * `Received` - añadimos este encabezado estándar Received con IP y host de origen, tipo de transmisión, información de conexión TLS, fecha/hora y destinatario.
   * `X-Original-To` - el destinatario original del mensaje:
     * Esto es útil para determinar a dónde fue entregado originalmente un correo electrónico (además del encabezado "Received").
     * Se añade por destinatario en el momento del reenvío IMAP y/o enmascarado (para proteger la privacidad).
   * `X-Forward-Email-Website` - contiene un enlace a nuestro sitio web <https://forwardemail.net>
   * `X-Forward-Email-Version` - la versión actual [SemVer](https://semver.org/) desde `package.json` de nuestra base de código.
   * `X-Forward-Email-Session-ID` - un valor de ID de sesión usado para propósitos de depuración (solo aplica en entornos no productivos).
   * `X-Forward-Email-Sender` - una lista separada por comas que contiene la dirección original MAIL FROM del sobre (si no estaba en blanco), el FQDN PTR inverso del cliente (si existe), y la dirección IP del remitente.
   * `X-Forward-Email-ID` - esto solo aplica para SMTP saliente y se correlaciona con el ID de correo almacenado en Mi Cuenta → Correos
   * `X-Report-Abuse` - con un valor de `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - con un valor de `abuse@forwardemail.net`.
   * `X-Complaints-To` - con un valor de `abuse@forwardemail.net`.

8. Luego verificamos el mensaje para [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), y [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Si el mensaje falló DMARC y el dominio tenía una política de rechazo (por ejemplo, `p=reject` [estaba en la política DMARC](https://wikipedia.org/wiki/DMARC)), entonces es rechazado con un código de error 550. Normalmente una política DMARC para un dominio puede encontrarse en el registro <strong class="notranslate">TXT</strong> del subdominio `_dmarc` (por ejemplo, `dig _dmarc.example.com txt`).
   * Si el mensaje falló SPF y el dominio tenía una política de fallo estricto (por ejemplo, `-all` estaba en la política SPF en lugar de `~all` o ninguna política), entonces es rechazado con un código de error 550. Normalmente una política SPF para un dominio puede encontrarse en el registro <strong class="notranslate">TXT</strong> del dominio raíz (por ejemplo, `dig example.com txt`). Vea esta sección para más información sobre [enviar correo como con Gmail](#can-i-send-mail-as-in-gmail-with-this) respecto a SPF.
9. Ahora procesamos los destinatarios del mensaje tal como se recopilaron a partir del comando `RCPT TO` en la sección [¿Cómo funciona tu sistema de reenvío de correo electrónico?](#how-does-your-email-forwarding-system-work) arriba. Para cada destinatario, realizamos las siguientes operaciones:

   * Consultamos los registros <strong class="notranslate">TXT</strong> del nombre de dominio (la parte después del símbolo `@`, por ejemplo `example.com` si la dirección de correo electrónico era `test@example.com`). Por ejemplo, si el dominio es `example.com` hacemos una consulta DNS como `dig example.com txt`.
   * Analizamos todos los registros <strong class="notranslate">TXT</strong> que comienzan con `forward-email=` (planes gratuitos) o `forward-email-site-verification=` (planes de pago). Nota que analizamos ambos, para procesar correos mientras un usuario está actualizando o degradando planes.
   * De estos registros <strong class="notranslate">TXT</strong> analizados, iteramos sobre ellos para extraer la configuración de reenvío (como se describe en la sección [¿Cómo empiezo y configuro el reenvío de correo electrónico?](#how-do-i-get-started-and-set-up-email-forwarding) arriba). Nota que solo soportamos un valor `forward-email-site-verification=`, y si se suministran más de uno, ocurrirá un error 550 y el remitente recibirá un rebote para este destinatario.
   * Recursivamente iteramos sobre la configuración de reenvío extraída para determinar el reenvío global, el reenvío basado en expresiones regulares y todas las demás configuraciones de reenvío compatibles, que ahora se conocen como nuestras "Direcciones de Reenvío".
   * Para cada Dirección de Reenvío, soportamos una búsqueda recursiva (que iniciará esta serie de operaciones sobre la dirección dada). Si se encontró una coincidencia recursiva, entonces el resultado padre será eliminado de las Direcciones de Reenvío y se agregarán los hijos.
   * Las Direcciones de Reenvío se analizan para garantizar unicidad (ya que no queremos enviar duplicados a una dirección ni generar conexiones SMTP adicionales innecesarias).
   * Para cada Dirección de Reenvío, consultamos su nombre de dominio contra nuestro endpoint API `/v1/max-forwarded-addresses` (para determinar cuántas direcciones puede reenviar el dominio por alias, por ejemplo 10 por defecto – ver la sección sobre [límite máximo de reenvío por alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Si se excede este límite, ocurrirá un error 550 y el remitente recibirá un rebote para este destinatario.
   * Consultamos la configuración del destinatario original contra nuestro endpoint API `/v1/settings`, que soporta una consulta para usuarios de pago (con una alternativa para usuarios gratuitos). Esto devuelve un objeto de configuración para ajustes avanzados de `port` (Número, por ejemplo `25`), `has_adult_content_protection` (Booleano), `has_phishing_protection` (Booleano), `has_executable_protection` (Booleano) y `has_virus_protection` (Booleano).
   * Basándonos en estos ajustes, luego verificamos los resultados del Escáner de Spam y si ocurre algún error, el mensaje es rechazado con un código de error 554 (por ejemplo, si `has_virus_protection` está habilitado, entonces verificaremos los resultados del Escáner de Spam para virus). Nota que todos los usuarios del plan gratuito estarán inscritos para las verificaciones contra contenido para adultos, phishing, ejecutables y virus. Por defecto, todos los usuarios de planes de pago también están inscritos, pero esta configuración puede modificarse en la página de Configuración para un dominio en el panel de Forward Email).

10. Para cada Dirección de Reenvío procesada de cada destinatario, luego realizamos las siguientes operaciones:

    * La dirección se verifica contra nuestra [lista de denegación](#do-you-have-a-denylist), y si está listada, ocurrirá un código de error 421 (indica al remitente que intente nuevamente más tarde).
    * Si la dirección es un webhook, entonces establecemos un Booleano para operaciones futuras (ver más abajo – agrupamos webhooks similares para hacer una sola solicitud POST en lugar de múltiples para la entrega).
    * Si la dirección es una dirección de correo electrónico, entonces analizamos el host para operaciones futuras (ver más abajo – agrupamos hosts similares para hacer una conexión en lugar de múltiples conexiones individuales para la entrega).
11. Si no hay destinatarios y no hay rebotes, entonces respondemos con un error 550 de "Destinatarios inválidos".

12. Si hay destinatarios, entonces iteramos sobre ellos (agrupados por el mismo host) y entregamos los correos electrónicos. Consulte la sección [¿Cómo manejan los problemas de entrega de correo electrónico?](#how-do-you-handle-email-delivery-issues) a continuación para más información.

    * Si ocurre algún error al enviar correos electrónicos, los almacenaremos en memoria para su procesamiento posterior.
    * Tomaremos el código de error más bajo (si hay alguno) de los envíos de correos electrónicos y lo usaremos como código de respuesta al comando `DATA`. Esto significa que los correos no entregados normalmente serán reintentados por el remitente original, pero los correos que ya fueron entregados no se reenviarán la próxima vez que se envíe el mensaje (ya que usamos [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Si no ocurrieron errores, enviaremos un código de estado SMTP 250 de éxito.
    * Un rebote se determina como cualquier intento de entrega que resulte en un código de estado >= 500 (fallos permanentes).

13. Si no ocurrieron rebotes (fallos permanentes), entonces devolveremos un código de estado SMTP del error más bajo de fallos no permanentes (o un código 250 de éxito si no hubo ninguno).

14. Si ocurrieron rebotes, enviaremos correos de rebote en segundo plano después de devolver el código de error más bajo a todos los remitentes. Sin embargo, si el código de error más bajo es >= 500, no enviamos correos de rebote. Esto se debe a que si lo hiciéramos, los remitentes recibirían un correo de rebote doble (por ejemplo, uno de su MTA saliente, como Gmail, y también uno de nosotros). Consulte la sección sobre [¿Cómo protegen contra el backscatter?](#how-do-you-protect-against-backscatter) a continuación para más información.

### ¿Cómo manejan los problemas de entrega de correo electrónico? {#how-do-you-handle-email-delivery-issues}

Tenga en cuenta que haremos una reescritura "Friendly-From" en los correos electrónicos solo si la política DMARC del remitente no pasó Y ninguna firma DKIM estaba alineada con el encabezado "From". Esto significa que alteraremos el encabezado "From" en el mensaje, estableceremos "X-Original-From" y también configuraremos un "Reply-To" si no estaba ya establecido. También volveremos a sellar el sello ARC en el mensaje después de alterar estos encabezados.

También usamos un análisis inteligente de mensajes de error en todos los niveles de nuestra pila: en nuestro código, solicitudes DNS, internos de Node.js, solicitudes HTTP (por ejemplo, 408, 413 y 429 se mapean al código de respuesta SMTP 421 si el destinatario es un webhook) y respuestas del servidor de correo (por ejemplo, respuestas con "defer" o "slowdown" se reintentaran como errores 421).

Nuestra lógica es a prueba de tontos y también reintentará en caso de errores SSL/TLS, problemas de conexión y más. El objetivo de esta protección es maximizar la entregabilidad a todos los destinatarios para una configuración de reenvío.

Si el destinatario es un webhook, permitiremos un tiempo de espera de 60 segundos para que la solicitud se complete con hasta 3 reintentos (por lo que 4 solicitudes en total antes de un fallo). Tenga en cuenta que analizamos correctamente los códigos de error 408, 413 y 429 y los mapeamos a un código de respuesta SMTP 421.

De lo contrario, si el destinatario es una dirección de correo electrónico, intentaremos enviar el correo con TLS oportunista (intentamos usar STARTTLS si está disponible en el servidor de correo del destinatario). Si ocurre un error SSL/TLS al intentar enviar el correo, intentaremos enviarlo sin TLS (sin usar STARTTLS).

Si ocurren errores DNS o de conexión, devolveremos al comando `DATA` un código de respuesta SMTP 421; de lo contrario, si hay errores de nivel >= 500, se enviarán rebotes.

Si detectamos que un servidor de correo al que intentamos entregar tiene una o más de nuestras direcciones IP de intercambio de correo bloqueadas (por ejemplo, por la tecnología que usan para retrasar spammers), enviaremos un código de respuesta SMTP 421 para que el remitente reintente su mensaje más tarde (y se nos alerta del problema para que podamos resolverlo antes del próximo intento).

### ¿Cómo manejan que sus direcciones IP sean bloqueadas? {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Rutinariamente monitoreamos todas las principales listas negras DNS y si alguna de nuestras direcciones IP de intercambio de correo ("MX") está listada en una lista negra importante, la retiraremos del registro DNS A correspondiente en el round robin si es posible hasta que se resuelva el problema.

Al momento de escribir esto, también estamos listados en varias listas blancas DNS, y tomamos en serio el monitoreo de listas negras. Si observa algún problema antes de que tengamos la oportunidad de resolverlo, por favor notifíquenos por escrito a <support@forwardemail.net>.

Nuestras direcciones IP son públicas, [vea esta sección a continuación para más información](#what-are-your-servers-ip-addresses).

### ¿Qué son las direcciones postmaster? {#what-are-postmaster-addresses}

Para evitar rebotes mal dirigidos y el envío de mensajes de respuesta automática de vacaciones a buzones no monitoreados o inexistentes, mantenemos una lista de nombres de usuario similares a mailer-daemon:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [y cualquier dirección no-reply](#what-are-no-reply-addresses)

Consulte [RFC 5320 Sección 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) para obtener más información sobre cómo se utilizan listas como estas para crear sistemas de correo electrónico eficientes.

### ¿Qué son las direcciones no-reply? {#what-are-no-reply-addresses}

Los nombres de usuario de correo electrónico iguales a cualquiera de los siguientes (sin distinguir mayúsculas o minúsculas) se consideran direcciones no-reply:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

Esta lista se mantiene [como un proyecto de código abierto en GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### ¿Cuáles son las direcciones IP de su servidor? {#what-are-your-servers-ip-addresses}

Publicamos nuestras direcciones IP en <https://forwardemail.net/ips>.

### ¿Tiene una lista blanca? {#do-you-have-an-allowlist}

Sí, tenemos una [lista de extensiones de nombres de dominio](#what-domain-name-extensions-are-allowlisted-by-default) que están en la lista blanca por defecto y una lista blanca dinámica, en caché y rotativa basada en [criterios estrictos](#what-is-your-allowlist-criteria).

Todos los dominios, correos electrónicos y direcciones IP usados por clientes que pagan son verificados automáticamente contra nuestra lista negra cada hora, lo que alerta a los administradores que pueden intervenir manualmente si es necesario.

Además, si uno de sus dominios o sus direcciones de correo electrónico están en la lista negra (por ejemplo, por enviar spam, virus o debido a ataques de suplantación) – entonces los administradores del dominio (usted) y los administradores de nuestro equipo serán notificados por correo electrónico inmediatamente. Recomendamos encarecidamente que [configure DMARC](#how-do-i-set-up-dmarc-for-forward-email) para evitar esto.

### ¿Qué extensiones de nombres de dominio están en la lista blanca por defecto? {#what-domain-name-extensions-are-allowlisted-by-default}

Las siguientes extensiones de nombres de dominio se consideran en la lista blanca por defecto (independientemente de si están en la Lista de Popularidad Umbrella o no):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
  <li class="list-inline-item"><code class="notranslate">dni.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fed.us</code></li>
  <li class="list-inline-item"><code class="notranslate">isa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">kids.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ak.us</code></li>
  <li class="list-inline-item"><code class="notranslate">al.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ar.us</code></li>
  <li class="list-inline-item"><code class="notranslate">as.us</code></li>
  <li class="list-inline-item"><code class="notranslate">az.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ca.us</code></li>
  <li class="list-inline-item"><code class="notranslate">co.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ct.us</code></li>
  <li class="list-inline-item"><code class="notranslate">dc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">de.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fl.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ga.us</code></li>
  <li class="list-inline-item"><code class="notranslate">gu.us</code></li>
  <li class="list-inline-item"><code class="notranslate">hi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ia.us</code></li>
  <li class="list-inline-item"><code class="notranslate">id.us</code></li>
  <li class="list-inline-item"><code class="notranslate">il.us</code></li>
  <li class="list-inline-item"><code class="notranslate">in.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ks.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ky.us</code></li>
  <li class="list-inline-item"><code class="notranslate">la.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ma.us</code></li>
  <li class="list-inline-item"><code class="notranslate">md.us</code></li>
  <li class="list-inline-item"><code class="notranslate">me.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mo.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ne.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nj.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nm.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ny.us</code></li>
  <li class="list-inline-item"><code class="notranslate">oh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ok.us</code></li>
  <li class="list-inline-item"><code class="notranslate">or.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pr.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ri.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.au</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.at</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.br</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">school.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">health.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.in</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.in</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">es.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.es</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.th</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.th</code></li>
  <li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
  <li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">go.id</code></li>
  <li class="list-inline-item"><code class="notranslate">go.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">go.ke</code></li>
  <li class="list-inline-item"><code class="notranslate">go.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">go.th</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.es</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.af</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.al</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.am</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.au</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.az</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.be</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gov.by</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.co</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.il</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.im</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.in</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.it</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.je</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.my</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.np</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.py</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.se</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.si</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.za</code></li>
  <li class="list-inline-item"><code class="notranslate">government.pn</code></li>
  <li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gv.at</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">police.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>
Además, estos [dominios de nivel superior de marca y corporativos](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) están en la lista blanca por defecto (por ejemplo, `apple` para `applecard.apple` para los estados de cuenta bancarios de Apple):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
A partir del 18 de marzo de 2025 también hemos añadido estos territorios franceses de ultramar a esta lista ([según esta solicitud de GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

A partir del 8 de julio de 2025 hemos añadido estos países específicos de Europa:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

En octubre de 2025 también hemos añadido <code class="notranslate">cz</code> (República Checa) debido a la demanda.

Específicamente no incluimos `ru` y `ua` debido a la alta actividad de spam.

### ¿Cuál es su criterio para la lista blanca? {#what-is-your-allowlist-criteria}

Tenemos una lista estática de [extensiones de nombres de dominio permitidas por defecto](#what-domain-name-extensions-are-allowlisted-by-default) – y también mantenemos una lista blanca dinámica, en caché y rotativa basada en los siguientes criterios estrictos:

* El dominio raíz del remitente debe ser de una [extensión de nombre de dominio que coincida con la lista que ofrecemos en nuestro plan gratuito](#what-domain-name-extensions-can-be-used-for-free) (con la adición de `biz` e `info`). También incluimos coincidencias parciales de `edu`, `gov` y `mil`, tales como `xyz.gov.au` y `xyz.edu.au`.
* El dominio raíz del remitente debe estar dentro de los 100,000 principales resultados únicos de dominios raíz analizados de la [Lista de Popularidad Umbrella](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* El dominio raíz del remitente debe estar dentro de los 50,000 principales resultados de dominios raíz únicos que aparecen en al menos 4 de los últimos 7 días de UPL (~50%+).
* El dominio raíz del remitente no debe estar [clasificado](https://radar.cloudflare.com/categorization-feedback/) como contenido para adultos o malware por Cloudflare.
* El dominio raíz del remitente debe tener registros A o MX configurados.
* El dominio raíz del remitente debe tener registros A, registros MX, un registro DMARC con `p=reject` o `p=quarantine`, o un registro SPF con el calificador `-all` o `~all`.

Si se cumple este criterio, entonces el dominio raíz del remitente se almacenará en caché durante 7 días. Tenga en cuenta que nuestro trabajo automatizado se ejecuta diariamente, por lo que esta es una caché rotativa de lista blanca que se actualiza diariamente.

Nuestro trabajo automatizado descargará los últimos 7 días de UPL en memoria, los descomprimirá y luego los analizará en memoria según los estrictos criterios anteriores.

Los dominios populares en el momento de esta redacción, como Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify y más, por supuesto están incluidos.
Si usted es un remitente que no está en nuestra lista blanca, entonces la primera vez que su dominio raíz FQDN o dirección IP envíe un correo electrónico, será [limitado por tasa](#do-you-have-rate-limiting) y [lista gris](#do-you-have-a-greylist). Tenga en cuenta que esta es una práctica estándar adoptada como estándar de correo electrónico. La mayoría de los clientes de servidores de correo intentarán reintentar si reciben un error de límite de tasa o lista gris (por ejemplo, un código de estado de error 421 o de nivel 4xx).

**Tenga en cuenta que remitentes específicos como `a@gmail.com`, `b@xyz.edu` y `c@gov.au` aún pueden ser [lista negra](#do-you-have-a-denylist)** (por ejemplo, si detectamos automáticamente spam, phishing o malware de esos remitentes).

### Qué extensiones de nombres de dominio se pueden usar gratis {#what-domain-name-extensions-can-be-used-for-free}

A partir del 31 de marzo de 2023, aplicamos una nueva regla general contra el spam para proteger a nuestros usuarios y servicio.

Esta nueva regla permite usar solo las siguientes extensiones de nombres de dominio en nuestro plan gratuito:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### ¿Tienes una lista gris {#do-you-have-a-greylist}

Sí, tenemos una política de [lista gris de correo electrónico](https://en.wikipedia.org/wiki/Greylisting_\(email\)) muy laxa. La lista gris solo se aplica a remitentes que no están en nuestra lista blanca y dura en nuestra caché por 30 días.

Para cualquier remitente nuevo, almacenamos una clave en nuestra base de datos Redis por 30 días con un valor establecido en la hora de llegada inicial de su primera solicitud. Luego rechazamos su correo electrónico con un código de estado de reintento 450 y solo permitimos que pase una vez que hayan pasado 5 minutos.

Si han esperado con éxito 5 minutos desde esta hora de llegada inicial, entonces sus correos electrónicos serán aceptados y no recibirán este código de estado 450.

La clave consiste en el dominio raíz FQDN o la dirección IP del remitente. Esto significa que cualquier subdominio que pase la lista gris también pasará para el dominio raíz, y viceversa (esto es lo que queremos decir con una política "muy laxa").

Por ejemplo, si un correo electrónico proviene de `test.example.com` antes de que veamos un correo de `example.com`, entonces cualquier correo de `test.example.com` y/o `example.com` tendrá que esperar 5 minutos desde la hora de llegada inicial de la conexión. No hacemos que tanto `test.example.com` como `example.com` esperen sus propios períodos de 5 minutos (nuestra política de lista gris se aplica a nivel del dominio raíz).

Ten en cuenta que la lista gris no se aplica a ningún remitente en nuestra [lista blanca](#do-you-have-an-allowlist) (por ejemplo, Meta, Amazon, Netflix, Google, Microsoft al momento de esta redacción).

### ¿Tienes una lista negra {#do-you-have-a-denylist}

Sí, operamos nuestra propia lista negra y la actualizamos automáticamente en tiempo real y manualmente basándonos en spam y actividad maliciosa detectada.

También extraemos todas las direcciones IP de la lista negra UCEPROTECT Nivel 1 en <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> cada hora y las incorporamos a nuestra lista negra con una expiración de 7 días.

Los remitentes encontrados en la lista negra recibirán un código de error 421 (indica al remitente que reintente más tarde) si [no están en la lista blanca](#do-you-have-an-allowlist).

Al usar un código de estado 421 en lugar de un código 554, se pueden aliviar posibles falsos positivos en tiempo real y luego el mensaje puede ser entregado con éxito en el siguiente intento.

**Esto está diseñado a diferencia de otros servicios de correo**, donde si te ponen en una lista de bloqueo, ocurre un fallo duro y permanente. A menudo es difícil pedir a los remitentes que reintenten mensajes (especialmente de grandes organizaciones), por lo que este enfoque da aproximadamente 5 días desde el intento inicial de correo para que el remitente, destinatario o nosotros intervengamos y solucionemos el problema (solicitando la eliminación de la lista negra).

Todas las solicitudes de eliminación de la lista negra son monitoreadas en tiempo real por administradores (por ejemplo, para que falsos positivos recurrentes puedan ser permanentemente incluidos en la lista blanca por los administradores).

Las solicitudes de eliminación de la lista negra pueden solicitarse en <https://forwardemail.net/denylist>. Los usuarios pagos tienen sus solicitudes de eliminación procesadas instantáneamente, mientras que los usuarios no pagos deben esperar a que los administradores procesen su solicitud.

Los remitentes detectados enviando spam o contenido de virus serán añadidos a la lista negra con el siguiente enfoque:

1. La [huella digital del mensaje inicial](#how-do-you-determine-an-email-fingerprint) se pone en lista gris al detectar spam o lista de bloqueo de un remitente "confiable" (por ejemplo, `gmail.com`, `microsoft.com`, `apple.com`).
   * Si el remitente estaba en la lista blanca, el mensaje se pone en lista gris por 1 hora.
   * Si el remitente no está en la lista blanca, el mensaje se pone en lista gris por 6 horas.
2. Analizamos claves de la lista negra a partir de la información del remitente y mensaje, y para cada una de estas claves creamos (si no existe ya) un contador, lo incrementamos en 1 y lo almacenamos en caché por 24 horas.
   * Para remitentes en lista blanca:
     * Añadir una clave para la dirección de correo electrónico "MAIL FROM" del sobre si pasó SPF o no tiene SPF, y no era [un nombre de usuario postmaster](#what-are-postmaster-addresses) ni [un nombre de usuario no-reply](#what-are-no-reply-addresses).
     * Si el encabezado "From" estaba en lista blanca, entonces añadir una clave para la dirección de correo electrónico del encabezado "From" si pasó SPF o pasó y alineó DKIM.
     * Si el encabezado "From" no estaba en lista blanca, entonces añadir una clave para la dirección de correo electrónico del encabezado "From" y su dominio raíz analizado.
   * Para remitentes no en lista blanca:
     * Añadir una clave para la dirección de correo electrónico "MAIL FROM" del sobre si pasó SPF.
     * Si el encabezado "From" estaba en lista blanca, entonces añadir una clave para la dirección de correo electrónico del encabezado "From" si pasó SPF o pasó y alineó DKIM.
     * Si el encabezado "From" no estaba en lista blanca, entonces añadir una clave para la dirección de correo electrónico del encabezado "From" y su dominio raíz analizado.
     * Añadir una clave para la dirección IP remota del remitente.
     * Añadir una clave para el nombre de host resuelto del cliente por búsqueda inversa desde la dirección IP del remitente (si existe).
     * Añadir una clave para el dominio raíz del nombre de host resuelto del cliente (si existe, y si difiere del nombre de host resuelto del cliente).
3. Si el contador alcanza 5 para un remitente y clave no en lista blanca, entonces ponemos la clave en lista negra por 30 días y se envía un correo a nuestro equipo de abuso. Estos números pueden cambiar y las actualizaciones se reflejarán aquí mientras monitoreamos el abuso.
4. Si el contador alcanza 10 para un remitente y clave en lista blanca, entonces ponemos la clave en lista negra por 7 días y se envía un correo a nuestro equipo de abuso. Estos números pueden cambiar y las actualizaciones se reflejarán aquí mientras monitoreamos el abuso.
> **NOTA:** En un futuro cercano introduciremos la monitorización de reputación. La monitorización de reputación calculará cuándo incluir en la lista negra a un remitente basándose en un umbral porcentual (en lugar de un contador rudimentario como se indicó anteriormente).

### ¿Tienes limitación de tasa {#do-you-have-rate-limiting}

La limitación de tasa del remitente es ya sea por el dominio raíz obtenido de una búsqueda PTR inversa en la dirección IP del remitente – o si eso no da resultado, entonces simplemente usa la dirección IP del remitente. Nota que nos referimos a esto como `Sender` a continuación.

Nuestros servidores MX tienen límites diarios para el correo entrante recibido para [almacenamiento IMAP cifrado](/blog/docs/best-quantum-safe-encrypted-email-service):

* En lugar de limitar la tasa del correo entrante recibido en base a un alias individual (por ejemplo, `you@yourdomain.com`) – limitamos la tasa por el nombre de dominio del alias mismo (por ejemplo, `yourdomain.com`). Esto previene que los `Senders` inunden los buzones de todos los alias en tu dominio a la vez.
* Tenemos límites generales que aplican a todos los `Senders` en nuestro servicio sin importar el destinatario:
  * Los `Senders` que consideramos "confiables" como fuente de verdad (por ejemplo, `gmail.com`, `microsoft.com`, `apple.com`) están limitados a enviar 100 GB por día.
  * Los `Senders` que están [en la lista blanca](#do-you-have-an-allowlist) están limitados a enviar 10 GB por día.
  * Todos los demás `Senders` están limitados a enviar 1 GB y/o 1000 mensajes por día.
* Tenemos un límite específico por `Sender` y `yourdomain.com` de 1 GB y/o 1000 mensajes diarios.

Los servidores MX también limitan los mensajes que se reenvían a uno o más destinatarios mediante limitación de tasa – pero esto solo aplica a `Senders` que no están en la [lista blanca](#do-you-have-an-allowlist):

* Solo permitimos hasta 100 conexiones por hora, por dominio raíz FQDN resuelto del `Sender` (o) dirección IP remota del `Sender` (si no hay PTR inverso disponible), y por destinatario del sobre. Guardamos la clave para la limitación de tasa como un hash criptográfico en nuestra base de datos Redis.

* Si envías correo a través de nuestro sistema, por favor asegúrate de tener configurado un PTR inverso para todas tus direcciones IP (de lo contrario, cada dominio raíz FQDN único o dirección IP desde la que envíes será limitado en tasa).

* Nota que si envías a través de un sistema popular como Amazon SES, entonces no serás limitado en tasa ya que (al momento de escribir esto) Amazon SES está listado en nuestra lista blanca.

* Si envías desde un dominio como `test.abc.123.example.com`, entonces el límite de tasa se impondrá en `example.com`. Muchos spammers usan cientos de subdominios para evadir filtros de spam comunes que solo limitan la tasa por nombres de host únicos en lugar de dominios raíz FQDN únicos.

* Los `Senders` que excedan el límite de tasa serán rechazados con un error 421.

Nuestros servidores IMAP y SMTP limitan que tus alias tengan más de `60` conexiones concurrentes a la vez.

Nuestros servidores MX limitan a los remitentes [no en la lista blanca](#do-you-have-an-allowlist) a establecer más de 10 conexiones concurrentes (con expiración de caché de 3 minutos para el contador, que refleja nuestro tiempo de espera de socket de 3 minutos).

### ¿Cómo protegen contra el backscatter {#how-do-you-protect-against-backscatter}

Los rebotes mal dirigidos o spam de rebote (conocido como "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") pueden causar una reputación negativa a las direcciones IP del remitente.

Tomamos dos medidas para proteger contra el backscatter, que se detallan en las siguientes secciones [Prevenir rebotes de spammers conocidos MAIL FROM](#prevent-bounces-from-known-mail-from-spammers) y [Prevenir rebotes innecesarios para proteger contra backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) a continuación.

### Prevenir rebotes de spammers conocidos MAIL FROM {#prevent-bounces-from-known-mail-from-spammers}

Obtenemos la lista de [Backscatter.org](https://www.backscatterer.org/) (impulsado por [UCEPROTECT](https://www.uceprotect.net/)) en <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> cada hora y la alimentamos en nuestra base de datos Redis (también comparamos la diferencia por adelantado; en caso de que alguna IP haya sido removida y deba ser respetada).
Si el MAIL FROM está en blanco O es igual (sin distinguir mayúsculas de minúsculas) a cualquiera de las [direcciones postmaster](#what-are-postmaster-addresses) (la parte antes de la @ en un correo electrónico), entonces verificamos si la IP del remitente coincide con alguna de esta lista.

Si la IP del remitente está listada (y no está en nuestra [lista blanca](#do-you-have-an-allowlist)), entonces enviamos un error 554 con el mensaje `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Seremos alertados si un remitente está tanto en la lista de Backscatterer como en nuestra lista blanca para poder resolver el problema si es necesario.

Las técnicas descritas en esta sección se adhieren a la recomendación de "MODO SEGURO" en <https://www.backscatterer.org/?target=usage> – donde solo verificamos la IP del remitente si ya se han cumplido ciertas condiciones.

### Prevenir rebotes innecesarios para proteger contra backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Los rebotes son correos electrónicos que indican que el reenvío del correo electrónico falló completamente al destinatario y el correo no será reintentado.

Una razón común para ser listado en la lista de Backscatterer son los rebotes mal dirigidos o el spam de rebotes, por lo que debemos protegernos contra esto de varias maneras:

1. Solo enviamos cuando ocurren errores con código de estado >= 500 (cuando los correos intentados para reenviar han fallado, por ejemplo, Gmail responde con un error de nivel 500).

2. Solo enviamos una vez y solo una vez (usamos una clave de huella digital de rebote calculada y la almacenamos en caché para evitar envíos duplicados). La huella digital de rebote es una clave que es la huella digital del mensaje combinada con un hash de la dirección de rebote y su código de error). Vea la sección sobre [Fingerprinting](#how-do-you-determine-an-email-fingerprint) para más información sobre cómo se calcula la huella digital del mensaje. Las huellas digitales de rebotes enviados con éxito expirarán después de 7 días en nuestra caché Redis.

3. Solo enviamos cuando el MAIL FROM y/o From no están en blanco y no contienen (sin distinguir mayúsculas de minúsculas) un [nombre de usuario postmaster](#what-are-postmaster-addresses) (la parte antes de la @ en un correo electrónico).

4. No enviamos si el mensaje original tenía cualquiera de los siguientes encabezados (sin distinguir mayúsculas de minúsculas):

   * Encabezado `auto-submitted` con un valor distinto de `no`.
   * Encabezado `x-auto-response-suppress` con un valor de `dr`, `autoreply`, `auto-reply`, `auto_reply` o `all`.
   * Encabezado `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` o `x-auto-respond` (independientemente del valor).
   * Encabezado `precedence` con un valor de `bulk`, `autoreply`, `auto-reply`, `auto_reply` o `list`.

5. No enviamos si la dirección de correo MAIL FROM o From termina con `+donotreply`, `-donotreply`, `+noreply` o `-noreply`.

6. No enviamos si la parte del nombre de usuario de la dirección From era `mdaemon` y tenía un encabezado (sin distinguir mayúsculas de minúsculas) `X-MDDSN-Message`.

7. No enviamos si había un encabezado (sin distinguir mayúsculas de minúsculas) `content-type` de tipo `multipart/report`.

### ¿Cómo determinan la huella digital de un correo electrónico? {#how-do-you-determine-an-email-fingerprint}

La huella digital de un correo electrónico se usa para determinar la unicidad de un correo y para evitar que se entreguen mensajes duplicados y se envíen [rebotes duplicados](#prevent-unnecessary-bounces-to-protect-against-backscatter).

La huella digital se calcula a partir de la siguiente lista:

* Nombre de host FQDN resuelto del cliente o dirección IP
* Valor del encabezado `Message-ID` (si existe)
* Valor del encabezado `Date` (si existe)
* Valor del encabezado `From` (si existe)
* Valor del encabezado `To` (si existe)
* Valor del encabezado `Cc` (si existe)
* Valor del encabezado `Subject` (si existe)
* Valor del `Body` (si existe)

### ¿Puedo reenviar correos a puertos distintos al 25 (por ejemplo, si mi ISP ha bloqueado el puerto 25)? {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Sí, desde el 5 de mayo de 2020 hemos añadido esta función. Actualmente la función es específica por dominio, en lugar de específica por alias. Si necesita que sea específica por alias, por favor contáctenos para informarnos de sus necesidades.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Protección de Privacidad Mejorada:
  </strong>
  <span>
    Si está en un plan de pago (que incluye protección de privacidad mejorada), por favor vaya a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a>, haga clic en "Configuración" junto a su dominio, y luego haga clic en "Ajustes". Si desea saber más sobre los planes de pago, vea nuestra página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Precios</a>. De lo contrario, puede continuar siguiendo las instrucciones a continuación.
  </span>
</div>
Si estás en el plan gratuito, simplemente agrega un nuevo registro DNS <strong class="notranslate">TXT</strong> como se muestra a continuación, pero cambia el puerto de 25 al puerto que elijas.

Por ejemplo, si quiero que todos los correos electrónicos que vayan a `example.com` se reenvíen al puerto SMTP de los destinatarios alias 1337 en lugar de 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
    El escenario más común para la configuración de reenvío de puerto personalizado es cuando quieres reenviar todos los correos electrónicos que van a example.com a un puerto diferente en example.com, distinto al estándar SMTP del puerto 25. Para configurarlo, simplemente agrega el siguiente registro <strong class="notranslate">TXT</strong> catch-all.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### ¿Soporta el símbolo más + para alias de Gmail? {#does-it-support-the-plus--symbol-for-gmail-aliases}

Sí, absolutamente.

### ¿Soporta subdominios? {#does-it-support-sub-domains}

Sí, absolutamente. En lugar de usar "@", ".", o vacío como nombre/host/alias, simplemente usas el nombre del subdominio como valor.

Si quieres que `foo.example.com` reenvíe correos electrónicos, entonces ingresa `foo` como valor de nombre/host/alias en tu configuración DNS (para ambos registros MX y <strong class="notranslate">TXT</strong>).

### ¿Esto reenvía los encabezados de mis correos electrónicos? {#does-this-forward-my-emails-headers}

Sí, absolutamente.

### ¿Está bien probado? {#is-this-well-tested}

Sí, tiene pruebas escritas con [ava](https://github.com/avajs/ava) y también tiene cobertura de código.

### ¿Pasas los mensajes y códigos de respuesta SMTP? {#do-you-pass-along-smtp-response-messages-and-codes}

Sí, absolutamente. Por ejemplo, si envías un correo a `hello@example.com` y está registrado para reenviar a `user@gmail.com`, entonces el mensaje y código de respuesta SMTP del servidor SMTP de "gmail.com" será devuelto en lugar del servidor proxy en "mx1.forwardemail.net" o "mx2.forwardemail.net".

### ¿Cómo previenen a los spammers y aseguran una buena reputación de reenvío de correo? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Consulta nuestras secciones sobre [¿Cómo funciona tu sistema de reenvío de correo?](#how-does-your-email-forwarding-system-work), [¿Cómo manejas los problemas de entrega de correo?](#how-do-you-handle-email-delivery-issues), y [¿Cómo manejas que tus direcciones IP sean bloqueadas?](#how-do-you-handle-your-ip-addresses-becoming-blocked) arriba.

### ¿Cómo realizas consultas DNS en nombres de dominio? {#how-do-you-perform-dns-lookups-on-domain-names}

Creamos un proyecto de software de código abierto :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) y lo usamos para consultas DNS. Los servidores DNS predeterminados usados son `1.1.1.1` y `1.0.0.1`, y las consultas DNS se hacen a través de [DNS sobre HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") en la capa de aplicación.

:tangerine: [Tangerine](https://github.com/tangerine) usa por defecto el servicio DNS para consumidores centrado en la privacidad de CloudFlare [cloudflare-dns].


## Cuenta y Facturación {#account-and-billing}

### ¿Ofrecen garantía de devolución de dinero en planes pagos? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

¡Sí! Los reembolsos automáticos ocurren cuando actualizas, bajas de plan o cancelas tu cuenta dentro de los 30 días desde que tu plan comenzó. Esto solo aplica para clientes primerizos.
### Si cambio de plan, ¿hacen prorrateo y reembolsan la diferencia? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

No hacemos prorrateo ni reembolsamos la diferencia cuando cambias de plan. En su lugar, convertimos la duración restante desde la fecha de expiración de tu plan actual a la duración relativa más cercana para tu nuevo plan (redondeada hacia abajo por mes).

Ten en cuenta que si mejoras o reduces entre planes pagos dentro de una ventana de 30 días desde que comenzaste un plan pago, entonces reembolsaremos automáticamente el monto total de tu plan actual.

### ¿Puedo usar este servicio de reenvío de correo electrónico solo como un servidor MX de "respaldo" o "fallover"? {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

No, no se recomienda, ya que solo puedes usar un servidor de intercambio de correo a la vez. Los respaldos usualmente nunca se reintentan debido a configuraciones erróneas de prioridad y a que los servidores de correo no respetan la verificación de prioridad de intercambio MX.

### ¿Puedo deshabilitar alias específicos? {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Si estás en un plan pago, debes ir a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Editar Alias <i class="fa fa-angle-right"></i> Desmarcar la casilla "Activo" <i class="fa fa-angle-right"></i> Continuar.
  </span>
</div>

Sí, simplemente edita tu registro DNS <strong class="notranslate">TXT</strong> y antepone al alias uno, dos o tres signos de exclamación (ver abajo).

Ten en cuenta que *debes* preservar el mapeo ":" ya que es necesario si alguna vez decides desactivar esto (y también se usa para importar si mejoras a uno de nuestros planes pagos).

**Para rechazo silencioso (aparece al remitente como si el mensaje se enviara con éxito, pero en realidad no llega a ningún lado) (código de estado `250`):** Si antepones un alias con "!" (signo de exclamación simple) devolverá un código de estado exitoso `250` a los remitentes que intenten enviar a esta dirección, pero los correos no llegarán a ningún lado (por ejemplo, un agujero negro o `/dev/null`).

**Para rechazo suave (código de estado `421`):** Si antepones un alias con "!!" (doble signo de exclamación) devolverá un código de error suave `421` a los remitentes que intenten enviar a esta dirección, y los correos a menudo se reintentaran hasta por 5 días antes de ser rechazados y devueltos.

**Para rechazo duro (código de estado `550`):** Si antepones un alias con "!!!" (triple signo de exclamación) devolverá un código de error permanente `550` a los remitentes que intenten enviar a esta dirección y los correos serán rechazados y devueltos.

Por ejemplo, si quiero que todos los correos que lleguen a `alias@example.com` dejen de reenviarse a `user@gmail.com` y sean rechazados y devueltos (por ejemplo, usar tres signos de exclamación):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
  <span>
    También puedes reescribir la dirección del destinatario reenviado simplemente a "nobody@forwardemail.net", lo que la dirigirá a nadie como en el ejemplo a continuación.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vacío</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
  <span>
    Si desea mayor seguridad, también puede eliminar la parte ":user@gmail.com" (o ":nobody@forwardemail.net"), dejando solo "!!!alias" como en el ejemplo a continuación.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o en blanco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### ¿Puedo reenviar correos electrónicos a múltiples destinatarios? {#can-i-forward-emails-to-multiple-recipients}

Sí, absolutamente. Solo especifique múltiples destinatarios en sus registros <strong class="notranslate">TXT</strong>.

Por ejemplo, si quiero que un correo que llegue a `hello@example.com` se reenvíe a `user+a@gmail.com` y `user+b@gmail.com`, entonces mi registro <strong class="notranslate">TXT</strong> se vería así:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o en blanco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

O, podría especificarlos en dos líneas separadas, como esta:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o en blanco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", o en blanco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

¡Depende de usted!

### ¿Puedo tener múltiples destinatarios globales catch-all? {#can-i-have-multiple-global-catch-all-recipients}

Sí, puede. Solo especifique múltiples destinatarios globales catch-all en sus registros <strong class="notranslate">TXT</strong>.

Por ejemplo, si quiero que cada correo que llegue a `*@example.com` (el asterisco significa que es un comodín, también llamado catch-all) se reenvíe a `user+a@gmail.com` y `user+b@gmail.com`, entonces mi registro <strong class="notranslate">TXT</strong> se vería así:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o en blanco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

O, podría especificarlos en dos líneas separadas, como esta:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nombre/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Tipo</th>
      <th>Respuesta/Valor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o en blanco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", o en blanco</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
¡Depende de ti!

### ¿Existe un límite máximo en la cantidad de direcciones de correo electrónico a las que puedo reenviar por alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Sí, el límite predeterminado es 10. Esto NO significa que solo puedas tener 10 alias en tu nombre de dominio. Puedes tener tantos alias como quieras (una cantidad ilimitada). Significa que solo puedes reenviar un alias a 10 direcciones de correo electrónico únicas. Podrías tener `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (del 1 al 10) – y cualquier correo enviado a `hello@example.com` se reenviaría a `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (del 1 al 10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Consejo:
  </strong>
  <span>
    ¿Necesitas más de 10 destinatarios por alias? Envíanos un correo electrónico y con gusto aumentaremos el límite de tu cuenta.
  </span>
</div>

### ¿Puedo reenviar correos electrónicos de forma recursiva {#can-i-recursively-forward-emails}

Sí, puedes, sin embargo, aún debes respetar el límite máximo. Si tienes `hello:linus@example.com` y `linus:user@gmail.com`, entonces los correos enviados a `hello@example.com` se reenviarían a `linus@example.com` y `user@gmail.com`. Ten en cuenta que se generará un error si intentas reenviar correos de forma recursiva más allá del límite máximo.

### ¿Pueden las personas cancelar o registrar mi reenvío de correo electrónico sin mi permiso {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Usamos verificación de registros MX y <strong class="notranslate">TXT</strong>, por lo tanto, si agregas los respectivos registros MX y <strong class="notranslate">TXT</strong> de este servicio, entonces estás registrado. Si los eliminas, entonces estás dado de baja. Tú tienes la propiedad de tu dominio y la gestión del DNS, así que si alguien tiene acceso a eso, entonces eso es un problema.

### ¿Cómo es gratis {#how-is-it-free}

Forward Email ofrece un nivel gratuito mediante una combinación de desarrollo de código abierto, infraestructura eficiente y planes pagos opcionales que apoyan el servicio.

Nuestro nivel gratuito está respaldado por:

1. **Desarrollo de Código Abierto**: Nuestra base de código es de código abierto, permitiendo contribuciones de la comunidad y operación transparente.

2. **Infraestructura Eficiente**: Hemos optimizado nuestros sistemas para manejar el reenvío de correos con recursos mínimos.

3. **Planes Premium Pagos**: Los usuarios que necesitan funciones adicionales como envío SMTP, recepción IMAP o opciones de privacidad mejoradas se suscriben a nuestros planes pagos.

4. **Límites de Uso Razonables**: El nivel gratuito tiene políticas de uso justo para prevenir abusos.

> \[!NOTE]
> Estamos comprometidos a mantener el reenvío básico de correos gratuito mientras ofrecemos funciones premium para usuarios con necesidades más avanzadas.

> \[!TIP]
> Si encuentras valioso nuestro servicio, considera actualizar a un plan pago para apoyar el desarrollo y mantenimiento continuo.

### ¿Cuál es el límite máximo de tamaño de correo electrónico {#what-is-the-max-email-size-limit}

Por defecto, tenemos un límite de tamaño de 50MB, que incluye contenido, encabezados y archivos adjuntos. Ten en cuenta que servicios como Gmail y Outlook permiten solo un límite de 25MB, y si excedes el límite al enviar a direcciones en esos proveedores recibirás un mensaje de error.

Se devuelve un error con el código de respuesta adecuado si se excede el límite de tamaño del archivo.

### ¿Almacenan registros de correos electrónicos {#do-you-store-logs-of-emails}

No, no escribimos en disco ni almacenamos registros – con la [excepción de errores](#do-you-store-error-logs) y [SMTP saliente](#do-you-support-sending-email-with-smtp) (consulta nuestra [Política de Privacidad](/privacy)).

Todo se hace en memoria y [nuestro código fuente está en GitHub](https://github.com/forwardemail).

### ¿Almacenan registros de errores {#do-you-store-error-logs}

**Sí. Puedes acceder a los registros de errores en [Mi Cuenta → Registros](/my-account/logs) o [Mi Cuenta → Dominios](/my-account/domains).**

Desde febrero de 2023, almacenamos registros de errores para códigos de respuesta SMTP `4xx` y `5xx` por un período de 7 días – que contienen el error SMTP, el sobre y los encabezados del correo (no **almacenamos** el cuerpo del correo ni los archivos adjuntos).
Los registros de errores le permiten verificar correos electrónicos importantes faltantes y mitigar falsos positivos de spam para [sus dominios](/my-account/domains). También son un gran recurso para depurar problemas con [webhooks de correo electrónico](#do-you-support-webhooks) (ya que los registros de errores contienen la respuesta del endpoint del webhook).

Los registros de errores para [limitación de tasa](#do-you-have-rate-limiting) y [lista gris] (#do-you-have-a-greylist) no son accesibles ya que la conexión termina temprano (por ejemplo, antes de que se puedan transmitir los comandos `RCPT TO` y `MAIL FROM`).

Consulte nuestra [Política de Privacidad](/privacy) para obtener más información.

### ¿Lees mis correos electrónicos? {#do-you-read-my-emails}

No, absolutamente no. Consulte nuestra [Política de Privacidad](/privacy).

Muchos otros servicios de reenvío de correo electrónico almacenan y podrían potencialmente leer su correo electrónico. No hay razón para que los correos reenviados necesiten almacenarse en disco, por lo que diseñamos la primera solución de código abierto que lo hace todo en memoria.

Creemos que usted debe tener derecho a la privacidad y la respetamos estrictamente. El código que se implementa en el servidor es [software de código abierto en GitHub](https://github.com/forwardemail) para transparencia y para generar confianza.

### ¿Puedo "enviar correo como" en Gmail con esto? {#can-i-send-mail-as-in-gmail-with-this}

¡Sí! Desde el 2 de octubre de 2018 hemos añadido esta función. ¡Vea [Cómo enviar correo como usando Gmail](#how-to-send-mail-as-using-gmail) arriba!

También debe configurar el registro SPF para Gmail en su configuración DNS en un registro <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Si está usando Gmail (por ejemplo, Enviar correo como) o G Suite, deberá agregar <code>include:_spf.google.com</code> a su registro SPF <strong class="notranslate">TXT</strong>, por ejemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### ¿Puedo "enviar correo como" en Outlook con esto? {#can-i-send-mail-as-in-outlook-with-this}

¡Sí! Desde el 2 de octubre de 2018 hemos añadido esta función. Simplemente consulte estos dos enlaces de Microsoft a continuación:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

También debe configurar el registro SPF para Outlook en su configuración DNS en un registro <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Si está usando Microsoft Outlook o Live.com, deberá agregar <code>include:spf.protection.outlook.com</code> a su registro SPF <strong class="notranslate">TXT</strong>, por ejemplo:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### ¿Puedo "enviar correo como" en Apple Mail y iCloud Mail con esto? {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Si es suscriptor de iCloud+, puede usar un dominio personalizado. [Nuestro servicio también es compatible con Apple Mail](#apple-mail).

Consulte <https://support.apple.com/en-us/102540> para más información.

### ¿Puedo reenviar correos ilimitados con esto? {#can-i-forward-unlimited-emails-with-this}

Sí, sin embargo, los remitentes "relativamente desconocidos" tienen un límite de 100 conexiones por hora por nombre de host o IP. Consulte la sección sobre [Limitación de tasa](#do-you-have-rate-limiting) y [Lista gris](#do-you-have-a-greylist) arriba.

Por "relativamente desconocidos" nos referimos a remitentes que no aparecen en la [lista blanca](#do-you-have-an-allowlist).

Si se excede este límite, enviamos un código de respuesta 421 que indica al servidor de correo del remitente que intente nuevamente más tarde.

### ¿Ofrecen dominios ilimitados por un solo precio? {#do-you-offer-unlimited-domains-for-one-price}

Sí. Independientemente del plan que tenga, pagará solo una tarifa mensual, que cubre todos sus dominios.
### ¿Qué métodos de pago aceptan? {#which-payment-methods-do-you-accept}

Forward Email acepta los siguientes métodos de pago únicos o mensuales/trimestrales/anuales:

1. **Tarjetas de crédito/débito/transferencias bancarias**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, etc.
2. **PayPal**: Conecta tu cuenta de PayPal para pagos fáciles
3. **Criptomonedas**: Aceptamos pagos a través de los pagos con stablecoin de Stripe en las redes Ethereum, Polygon y Solana

> \[!NOTE]
> Almacenamos información limitada de pago en nuestros servidores, que solo incluye identificadores de pago y referencias a las transacciones, clientes, suscripciones e ID de pago de [Stripe](https://stripe.com/global) y [PayPal](https://www.paypal.com).

> \[!TIP]
> Para máxima privacidad, considera usar pagos con criptomonedas.

Todos los pagos se procesan de forma segura a través de Stripe o PayPal. Los detalles de tu pago nunca se almacenan en nuestros servidores.


## Recursos adicionales {#additional-resources}

> \[!TIP]
> Nuestros artículos a continuación se actualizan regularmente con nuevas guías, consejos e información técnica. Revisa con frecuencia para ver el contenido más reciente.

* [Estudios de caso y documentación para desarrolladores](/blog/docs)
* [Recursos](/resources)
* [Guías](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
