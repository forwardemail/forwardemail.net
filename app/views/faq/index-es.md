# Preguntas frecuentes {#frequently-asked-questions}

<img loading="perezoso" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Tabla de contenido {#table-of-contents}

* [Inicio rápido](#quick-start)
* [Introducción](#introduction)
  * [¿Qué es el reenvío de correo electrónico?](#what-is-forward-email)
  * [¿Quién utiliza el reenvío de correo electrónico?](#who-uses-forward-email)
  * [¿Cuál es el historial de Forward Email?](#what-is-forward-emails-history)
  * [¿Qué tan rápido es este servicio?](#how-fast-is-this-service)
* [Clientes de correo electrónico](#email-clients)
  * [Pájaro de trueno](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Correo de Apple](#apple-mail)
  * [Dispositivos móviles](#mobile-devices)
  * [Cómo enviar correos electrónicos usando Gmail](#how-to-send-mail-as-using-gmail)
  * [¿Qué es la guía gratuita heredada para enviar correo como usando Gmail?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Configuración avanzada de enrutamiento de Gmail](#advanced-gmail-routing-configuration)
  * [Configuración avanzada de enrutamiento de Outlook](#advanced-outlook-routing-configuration)
* [Solución de problemas](#troubleshooting)
  * [¿Por qué no recibo mis correos electrónicos de prueba?](#why-am-i-not-receiving-my-test-emails)
  * [¿Cómo configuro mi cliente de correo electrónico para que funcione con Reenvío de correo electrónico?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [¿Por qué mis correos electrónicos llegan a Spam y Correo No Deseado y cómo puedo comprobar la reputación de mi dominio?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [¿Qué debo hacer si recibo correos electrónicos no deseados?](#what-should-i-do-if-i-receive-spam-emails)
  * [¿Por qué los correos electrónicos de prueba que me envían en Gmail aparecen como "sospechosos"?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [¿Puedo eliminar el correo forwardemail.net en Gmail?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Gestión de datos](#data-management)
  * [¿Dónde están ubicados sus servidores?](#where-are-your-servers-located)
  * [¿Cómo exporto y hago una copia de seguridad de mi buzón de correo?](#how-do-i-export-and-backup-my-mailbox)
  * [¿Cómo importo y migro mi buzón de correo existente?](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [¿Apoya el autoalojamiento?](#do-you-support-self-hosting)
* [Configuración de correo electrónico](#email-configuration)
  * [¿Cómo puedo empezar y configurar el reenvío de correo electrónico?](#how-do-i-get-started-and-set-up-email-forwarding)
  * [¿Puedo utilizar varios intercambios y servidores MX para reenvío avanzado?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [¿Cómo configuro un contestador automático de vacaciones (contestador automático fuera de la oficina)?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [¿Cómo configuro SPF para el reenvío de correo electrónico?](#how-do-i-set-up-spf-for-forward-email)
  * [¿Cómo configuro DKIM para el reenvío de correo electrónico?](#how-do-i-set-up-dkim-for-forward-email)
  * [¿Cómo configuro DMARC para el reenvío de correo electrónico?](#how-do-i-set-up-dmarc-for-forward-email)
  * [¿Cómo conecto y configuro mis contactos?](#how-do-i-connect-and-configure-my-contacts)
  * [¿Cómo conecto y configuro mis calendarios?](#how-do-i-connect-and-configure-my-calendars)
  * [¿Cómo puedo agregar más calendarios y administrar los calendarios existentes?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [¿Cómo configuro SRS para el reenvío de correo electrónico?](#how-do-i-set-up-srs-for-forward-email)
  * [¿Cómo configuro MTA-STS para el reenvío de correo electrónico?](#how-do-i-set-up-mta-sts-for-forward-email)
  * [¿Cómo puedo agregar una foto de perfil a mi dirección de correo electrónico?](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Funciones avanzadas](#advanced-features)
  * [¿Apoya el envío de boletines informativos o listas de correo electrónico para correo electrónico relacionado con marketing?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [¿Admite el envío de correo electrónico con API?](#do-you-support-sending-email-with-api)
  * [¿Admite la recepción de correo electrónico con IMAP?](#do-you-support-receiving-email-with-imap)
  * [¿Es compatible con POP3?](#do-you-support-pop3)
  * [¿Es compatible con calendarios (CalDAV)?](#do-you-support-calendars-caldav)
  * [¿Soporta contactos (CardDAV)?](#do-you-support-contacts-carddav)
  * [¿Admiten el envío de correo electrónico con SMTP?](#do-you-support-sending-email-with-smtp)
  * [¿Es compatible con OpenPGP/MIME, cifrado de extremo a extremo ("E2EE") y directorio de claves web ("WKD")?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [¿Apoya usted el MTA-STS?](#do-you-support-mta-sts)
  * [¿Admiten claves de acceso y WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [¿Apoya las mejores prácticas de correo electrónico?](#do-you-support-email-best-practices)
  * [¿Se admiten webhooks de rebote?](#do-you-support-bounce-webhooks)
  * [¿Soportas webhooks?](#do-you-support-webhooks)
  * [¿Admite expresiones regulares o regex?](#do-you-support-regular-expressions-or-regex)
  * [¿Cuáles son sus límites de SMTP saliente?](#what-are-your-outbound-smtp-limits)
  * [¿Necesito aprobación para habilitar SMTP?](#do-i-need-approval-to-enable-smtp)
  * [¿Cuáles son los parámetros de configuración de su servidor SMTP?](#what-are-your-smtp-server-configuration-settings)
  * [¿Cuáles son los ajustes de configuración de su servidor IMAP?](#what-are-your-imap-server-configuration-settings)
  * [¿Cuáles son los parámetros de configuración de su servidor POP3?](#what-are-your-pop3-server-configuration-settings)
  * [Configuración del relé SMTP de Postfix](#postfix-smtp-relay-configuration)
* [Seguridad](#security)
  * [Técnicas avanzadas de refuerzo de servidores](#advanced-server-hardening-techniques)
  * [¿Tiene certificaciones SOC 2 o ISO 27001?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [¿Utiliza cifrado TLS para el reenvío de correo electrónico?](#do-you-use-tls-encryption-for-email-forwarding)
  * [¿Conservas los encabezados de autenticación de correo electrónico?](#do-you-preserve-email-authentication-headers)
  * [¿Conserva los encabezados de correo electrónico originales y evita la suplantación?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [¿Cómo protegerse del spam y el abuso?](#how-do-you-protect-against-spam-and-abuse)
  * [¿Almacena el contenido del correo electrónico en el disco?](#do-you-store-email-content-on-disk)
  * [¿Puede quedar expuesto el contenido del correo electrónico durante fallas del sistema?](#can-email-content-be-exposed-during-system-crashes)
  * [¿Quién tiene acceso a su infraestructura de correo electrónico?](#who-has-access-to-your-email-infrastructure)
  * [¿Qué proveedores de infraestructura utiliza?](#what-infrastructure-providers-do-you-use)
  * [¿Ofrecen un Acuerdo de Procesamiento de Datos (APD)?](#do-you-offer-a-data-processing-agreement-dpa)
  * [¿Cómo se gestionan las notificaciones de violación de datos?](#how-do-you-handle-data-breach-notifications)
  * [¿Ofrecen un entorno de prueba?](#do-you-offer-a-test-environment)
  * [¿Ofrecen herramientas de monitoreo y alerta?](#do-you-provide-monitoring-and-alerting-tools)
  * [¿Cómo se garantiza una alta disponibilidad?](#how-do-you-ensure-high-availability)
  * [¿Cumple usted con la Sección 889 de la Ley de Autorización de Defensa Nacional (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Sistema y detalles técnicos](#system-and-technical-details)
  * [¿Almacenas correos electrónicos y sus contenidos?](#do-you-store-emails-and-their-contents)
  * [¿Cómo funciona su sistema de reenvío de correo electrónico?](#how-does-your-email-forwarding-system-work)
  * [¿Cómo se procesa un correo electrónico para reenviarlo?](#how-do-you-process-an-email-for-forwarding)
  * [¿Cómo gestiona los problemas de entrega de correo electrónico?](#how-do-you-handle-email-delivery-issues)
  * [¿Cómo gestionas el bloqueo de tus direcciones IP?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [¿Qué son las direcciones postales?](#what-are-postmaster-addresses)
  * [¿Qué son las direcciones de no respuesta?](#what-are-no-reply-addresses)
  * [¿Cuáles son las direcciones IP de su servidor?](#what-are-your-servers-ip-addresses)
  * [¿Tienes una lista de permitidos?](#do-you-have-an-allowlist)
  * [¿Qué extensiones de nombre de dominio están permitidas de forma predeterminada?](#what-domain-name-extensions-are-allowlisted-by-default)
  * [¿Cuáles son sus criterios de inclusión en la lista de permitidos?](#what-is-your-allowlist-criteria)
  * [¿Qué extensiones de nombre de dominio se pueden utilizar de forma gratuita?](#what-domain-name-extensions-can-be-used-for-free)
  * [¿Tienes una lista gris?](#do-you-have-a-greylist)
  * [¿Tienes una lista de denegados?](#do-you-have-a-denylist)
  * [¿Tiene limitación de velocidad?](#do-you-have-rate-limiting)
  * [¿Cómo protegerse contra la retrodispersión?](#how-do-you-protect-against-backscatter)
  * [Evitar rebotes de correos spam conocidos](#prevent-bounces-from-known-mail-from-spammers)
  * [Evite rebotes innecesarios para protegerse contra la retrodispersión](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [¿Cómo se determina una huella digital de correo electrónico?](#how-do-you-determine-an-email-fingerprint)
  * [¿Puedo reenviar correos electrónicos a puertos distintos del 25 (por ejemplo, si mi ISP ha bloqueado el puerto 25)?](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [¿Es compatible con el símbolo más + para los alias de Gmail?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [¿Admite subdominios?](#does-it-support-sub-domains)
  * [¿Esto reenvía los encabezados de mis correos electrónicos?](#does-this-forward-my-emails-headers)
  * [¿Está esto bien probado?](#is-this-well-tested)
  * [¿Transmite mensajes y códigos de respuesta SMTP?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [¿Cómo evitar a los spammers y garantizar una buena reputación en el reenvío de correo electrónico?](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [¿Cómo se realizan búsquedas DNS en nombres de dominio?](#how-do-you-perform-dns-lookups-on-domain-names)
* [Cuenta y facturación](#account-and-billing)
  * [¿Ofrecen una garantía de devolución de dinero en los planes pagos?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Si cambio de plan, ¿me pagan a prorrata y me reembolsan la diferencia?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [¿Puedo usar este servicio de reenvío de correo electrónico como un servidor MX de "respaldo" o "suplente"?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [¿Puedo desactivar alias específicos?](#can-i-disable-specific-aliases)
  * [¿Puedo reenviar correos electrónicos a varios destinatarios?](#can-i-forward-emails-to-multiple-recipients)
  * [¿Puedo tener varios destinatarios globales de catch-all?](#can-i-have-multiple-global-catch-all-recipients)
  * [¿Existe un límite máximo en la cantidad de direcciones de correo electrónico a las que puedo reenviar por alias?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [¿Puedo reenviar correos electrónicos de forma recursiva?](#can-i-recursively-forward-emails)
  * [¿Pueden las personas cancelar o registrar mi reenvío de correo electrónico sin mi permiso?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [¿Cómo es gratis?](#how-is-it-free)
  * [¿Cuál es el límite máximo de tamaño del correo electrónico?](#what-is-the-max-email-size-limit)
  * [¿Almacenas registros de correos electrónicos?](#do-you-store-logs-of-emails)
  * [¿Almacena registros de errores?](#do-you-store-error-logs)
  * [¿Lees mis correos electrónicos?](#do-you-read-my-emails)
  * [¿Puedo "enviar correo como" en Gmail con esto?](#can-i-send-mail-as-in-gmail-with-this)
  * [¿Puedo "enviar correo como" en Outlook con esto?](#can-i-send-mail-as-in-outlook-with-this)
  * [¿Puedo "enviar correo como" en Apple Mail y iCloud Mail con esto?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [¿Puedo reenviar correos electrónicos ilimitados con esto?](#can-i-forward-unlimited-emails-with-this)
  * [¿Ofrecen dominios ilimitados por un precio único?](#do-you-offer-unlimited-domains-for-one-price)
  * [¿Qué métodos de pago aceptan?](#which-payment-methods-do-you-accept)
* [Recursos adicionales](#additional-resources)

## Inicio rápido {#quick-start}

Para comenzar a utilizar el reenvío de correo electrónico:

1. **Crea una cuenta** en [forwardemail.net/register](https://forwardemail.net/register)

2. **Agregue y verifique su dominio** en [Mi cuenta → Dominios](/my-account/domains)

3. **Agregue y configure alias/buzones de correo electrónico** en [Mi cuenta → Dominios](/my-account/domains) → Alias

4. **Prueba tu configuración** enviando un correo electrónico a uno de tus nuevos alias

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

## Introducción {#introduction}

### ¿Qué es el reenvío de correo electrónico? {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email es un **proveedor de servicios de correo electrónico con todas las funciones** y un **proveedor de alojamiento de correo electrónico para nombres de dominio personalizados**.

Es el único servicio gratuito y de código abierto que le permite utilizar direcciones de correo electrónico de dominio personalizado sin la complejidad de configurar y mantener su propio servidor de correo electrónico.

Nuestro servicio reenvía los correos electrónicos enviados a su dominio personalizado a su cuenta de correo electrónico existente; incluso puede utilizarnos como su proveedor de alojamiento de correo electrónico dedicado.

Características principales de Forward Email:

* **Correo electrónico de dominio personalizado**: Usa direcciones de correo electrónico profesionales con tu propio nombre de dominio
* **Nivel gratuito**: Reenvío de correo electrónico básico sin costo
* **Privacidad mejorada**: No leemos tus correos electrónicos ni vendemos tus datos
* **Código abierto**: Todo nuestro código base está disponible en GitHub
* **Compatibilidad con SMTP, IMAP y POP3**: Capacidad completa para enviar y recibir correos electrónicos
* **Cifrado de extremo a extremo**: Compatibilidad con OpenPGP/MIME
* **Alias de captura general personalizados**: Crea alias de correo electrónico ilimitados

Puede compararnos con más de 56 proveedores de servicios de correo electrónico en [Nuestra página de comparación de correo electrónico](/blog/best-email-service).

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### ¿Quién utiliza el reenvío de correo electrónico? {#who-uses-forward-email}

Ofrecemos servicios de alojamiento y reenvío de correo electrónico a más de 500 000 dominios y a estos destacados usuarios:

| Cliente | Estudio de caso |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Academia Naval de los Estados Unidos | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Canónico | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Juegos de Netflix |  |
| La Fundación Linux | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| La Fundación PHP |  |
| Fox News Radio |  |
| Disney Ad Sales |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| en la humanidad | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| La Universidad de Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| La Universidad de Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| La Universidad de Washington | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Universidad Tufts | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Colegio Swarthmore | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Gobierno de Australia del Sur |  |
| Gobierno de la República Dominicana |  |
| Fly<span>.</span>io |  |
| Hoteles RCD |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### ¿Cuál es el historial de reenvío de correo electrónico? {#what-is-forward-emails-history}

Puede obtener más información sobre el reenvío de correo electrónico en [Nuestra página Acerca de](/about).

### ¿Qué tan rápido es este servicio? {#how-fast-is-this-service}

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

El reenvío de correo electrónico entrega mensajes con un retraso mínimo, generalmente en cuestión de segundos desde su recepción.

Métricas de rendimiento:

* **Tiempo promedio de entrega**: Menos de 5-10 segundos desde la recepción hasta el reenvío ([Consulte nuestra página de monitoreo de tiempo de recepción en la bandeja de entrada (TTI)](/tti))
* **Tiempo de actividad**: Más del 99.9% de disponibilidad del servicio
* **Infraestructura global**: Servidores estratégicamente ubicados para un enrutamiento óptimo
* **Escalado automático**: Nuestro sistema se escala durante los períodos de mayor tráfico de correo electrónico

Operamos en tiempo real, a diferencia de otros proveedores que dependen de colas retrasadas.

No escribimos en el disco ni almacenamos registros con [excepción de errores](#do-you-store-error-logs) y [SMTP saliente](#do-you-support-sending-email-with-smtp) (consulte nuestro [política de privacidad](/privacy)).

Todo se hace en memoria y [Nuestro código fuente está en GitHub](https://github.com/forwardemail).

## Clientes de correo electrónico {#email-clients}

__URL_PROTEGIDA_463__ Thunderbird {__URL_PROTEGIDA_464__

1. Crea un nuevo alias y genera una contraseña en tu panel de control de reenvío de correo.
2. Abre Thunderbird y ve a **Editar → Configuración de la cuenta → Acciones de la cuenta → Añadir cuenta de correo**.
3. Introduce tu nombre, dirección de reenvío de correo y contraseña.
4. Haz clic en **Configurar manualmente** e introduce:
* Entrante: IMAP, `imap.forwardemail.net`, puerto 993, SSL/TLS.
* Saliente: SMTP, `smtp.forwardemail.net`, puerto 587, STARTTLS.
5. Haz clic en **Listo**.

__URL_PROTEGIDA_465__ Microsoft Outlook {__URL_PROTEGIDA_466__

1. Crea un nuevo alias y genera una contraseña en tu panel de control de reenvío de correo electrónico.
2. Ve a **Archivo → Añadir cuenta**.
3. Introduce tu dirección de reenvío de correo electrónico y haz clic en **Conectar**.
4. Selecciona **Opciones avanzadas** y **Permíteme configurar mi cuenta manualmente**.
5. Selecciona **IMAP** e introduce:
* Entrante: `imap.forwardemail.net`, puerto 993, SSL.
* Saliente: `smtp.forwardemail.net`, puerto 587, TLS.
* Nombre de usuario: Tu dirección de correo electrónico completa.
* Contraseña: La contraseña generada.
6. Haz clic en **Conectar**.

### Correo de Apple {#apple-mail}

1. Crea un nuevo alias y genera una contraseña en tu panel de control de reenvío de correo.
2. Ve a **Correo → Preferencias → Cuentas → +**
3. Selecciona **Otra cuenta de correo**
4. Introduce tu nombre, dirección de reenvío de correo y contraseña.
5. Para la configuración del servidor, introduce:
* Entrante: `imap.forwardemail.net`
* Saliente: `smtp.forwardemail.net`
* Nombre de usuario: Tu dirección de correo electrónico completa
* Contraseña: La contraseña generada
6. Haz clic en **Iniciar sesión**

### Dispositivos móviles {#mobile-devices}

Para iOS:

1. Ve a **Configuración → Correo → Cuentas → Agregar cuenta → Otros**
2. Pulsa **Agregar cuenta de correo** e ingresa tus datos.
3. Para la configuración del servidor, usa la misma configuración de IMAP y SMTP que la anterior.

Para Android:

1. Vaya a **Configuración → Cuentas → Agregar cuenta → Personal (IMAP)**
2. Ingrese su dirección de correo electrónico de reenvío y contraseña
3. Para la configuración del servidor, use la misma configuración de IMAP y SMTP que la anterior.

### Cómo enviar correo como si usara Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
<span>Menos de 10 minutos</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Cómo empezar:

</strong>

Si has seguido las instrucciones anteriores en <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Cómo empezar y configurar el reenvío de correo electrónico</a>, puedes continuar leyendo a continuación.

</span>
</div>

<div id="enviar-correo-como-contenido">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Asegúrese de leer nuestros <a href="/terms" class="alert-link" target="_blank">Términos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidad</a> y <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Límites de SMTP de salida</a>. Su uso se considera un reconocimiento y aceptación.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Si eres desarrollador, consulta nuestra <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentación de la API de correo electrónico</a>.
</span>
</div>

1. Vaya a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Configuración de SMTP saliente y siga las instrucciones de configuración.

2. Crea un nuevo alias para tu dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias (p. ej., <code><hello@example.com></code>)

3. Haga clic en <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> junto al alias recién creado. Cópielo en el portapapeles y guarde de forma segura la contraseña generada que se muestra en pantalla.

4. Vaya a [Gmail](https://gmail.com) y, en [Configuración <i class="fa fa-angle-right"></i> Cuentas e importación <i class="fa fa-angle-right"></i> Enviar correo como](https://mail.google.com/mail/u/0/#settings/accounts), haga clic en "Agregar otra dirección de correo electrónico".

5. Cuando se le solicite "Nombre", ingrese el nombre que desea que aparezca como "De" en su correo electrónico (por ejemplo, "Linus Torvalds").

6. Cuando se le solicite "Dirección de correo electrónico", ingrese la dirección completa de un alias que haya creado en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias (p. ej., <code><hello@example.com></code>)

7. Desmarca la opción "Tratar como un alias".

8. Haga clic en "Siguiente paso" para continuar.

9. Cuando se le solicite "Servidor SMTP", ingrese <code>smtp.forwardemail.net</code> y deje el puerto como <code>587</code>.

10. Cuando se le solicite "Nombre de usuario", ingrese la dirección de correo electrónico completa de un alias que haya creado en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias (p. ej., <code><hello@example.com></code>)

11. Cuando se le solicite "Contraseña", pegue la contraseña obtenida en <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> en el paso 3 anterior.

12. Deje marcada la opción "Conexión segura mediante TLS".

13. Haga clic en "Agregar cuenta" para continuar.

14. Abra una nueva pestaña en [Gmail](https://gmail.com) y espere a que llegue su correo electrónico de verificación (recibirá un código de verificación que confirma que es el propietario de la dirección de correo electrónico que intenta "Enviar correo como").

15. Una vez que llegue, copie y pegue el código de verificación en el mensaje que recibió en el paso anterior.

16. Una vez hecho esto, vuelve al correo electrónico y haz clic en el enlace para confirmar la solicitud. Probablemente necesites realizar este paso y el anterior para que el correo electrónico se configure correctamente.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
¡Felicitaciones!
</strong>
<span>
Has completado todos los pasos correctamente.
</span>
</div>
</div>

</div>

### ¿Cuál es la guía gratuita heredada para Enviar correo como usando Gmail? {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> Esta guía gratuita antigua quedó obsoleta a partir de mayo de 2023, ya que <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we ahora admite SMTP saliente</a>. Si usa la guía a continuación, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this hará que su correo saliente</a> indique "<span class="notranslate text-danger font-weight-bold">vía forwardemail.net</span>" en Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
<span>Menos de 10 minutos</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Cómo empezar:

</strong>

Si has seguido las instrucciones anteriores en <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Cómo empezar y configurar el reenvío de correo electrónico</a>, puedes continuar leyendo a continuación.

</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Cómo enviar correo como si usara Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="guía gratuita de legado">

1. Necesita tener habilitada la autenticación de dos factores de Gmail (gmail-2fa) para que esto funcione. Visite <https://www.google.com/landing/2step/> si no la tiene habilitada.

2. Una vez habilitada la autenticación de dos factores (o si ya la tenía habilitada), visite <https://myaccount.google.com/apppasswords>.

3. Cuando se le solicite "Seleccione la aplicación y el dispositivo para el que desea generar la contraseña de la aplicación":
* Seleccione "Correo" en el menú desplegable "Seleccionar aplicación".
* Seleccione "Otro" en el menú desplegable "Seleccionar dispositivo".
* Cuando se le solicite ingresar texto, ingrese la dirección de correo electrónico de su dominio personalizado desde el que reenvía los correos (por ejemplo, <code><hello@example.com></code>; esto le ayudará a realizar un seguimiento en caso de que use este servicio para varias cuentas).

4. Copia la contraseña generada automáticamente al portapapeles.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Si usas G Suite, visita tu panel de administración <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Aplicaciones <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Configuración de Gmail <i class="fa fa-angle-right"></i> Configuración</a> y asegúrate de marcar la opción "Permitir que los usuarios envíen correo a través de un servidor SMTP externo...". Este cambio tardará unos minutos en activarse.
</span>
</div>

5. Vaya a [Gmail](https://gmail.com) y, en [Configuración <i class="fa fa-angle-right"></i> Cuentas e importación <i class="fa fa-angle-right"></i> Enviar correo como](https://mail.google.com/mail/u/0/#settings/accounts), haga clic en "Agregar otra dirección de correo electrónico".

6. Cuando se le solicite "Nombre", ingrese el nombre que desea que aparezca como "De" en su correo electrónico (por ejemplo, "Linus Torvalds").

7. Cuando se le solicite "Dirección de correo electrónico", introduzca la dirección de correo electrónico con el dominio personalizado que utilizó anteriormente (p. ej., <code><hello@example.com></code>)

8. Desmarca la opción "Tratar como un alias".

9. Haga clic en "Siguiente paso" para continuar.

10. Cuando se le solicite "Servidor SMTP", ingrese <code>smtp.gmail.com</code> y deje el puerto <code>587</code>.

11. Cuando se te solicite "Nombre de usuario", introduce la parte de tu dirección de Gmail sin la parte <span>gmail.com</span> (por ejemplo, solo "usuario" si mi correo electrónico es <span><usuario@gmail.com></span>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Si la parte "Nombre de usuario" se rellena automáticamente, tendrás que cambiarla por la parte del nombre de usuario de tu dirección de Gmail.
</span>
</div>

12. Cuando se le solicite "Contraseña", pegue desde el portapapeles la contraseña que generó en el paso 2 anterior.

13. Deje marcada la opción "Conexión segura mediante TLS".

14. Haga clic en "Agregar cuenta" para continuar.

15. Abra una nueva pestaña en [Gmail](https://gmail.com) y espere a que llegue su correo electrónico de verificación (recibirá un código de verificación que confirma que es el propietario de la dirección de correo electrónico que intenta "Enviar correo como").

16. Una vez que llegue, copie y pegue el código de verificación en el mensaje que recibió en el paso anterior.

17. Una vez hecho esto, vuelve al correo electrónico y haz clic en el enlace para confirmar la solicitud. Probablemente necesites realizar este paso y el anterior para que el correo electrónico se configure correctamente.

</div>

### Configuración avanzada de enrutamiento de Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
<span>15-30 minutos</span>
</div>

Si desea configurar el enrutamiento avanzado en Gmail para que los alias que no coincidan con un buzón se reenvíen a los intercambios de correo de Forward Email, siga estos pasos:

1. Inicia sesión en tu consola de administración de Google en [admin.google.com](https://admin.google.com)
2. Ve a **Aplicaciones → Google Workspace → Gmail → Enrutamiento**
3. Haz clic en **Añadir ruta** y configura los siguientes ajustes:

**Configuración de destinatario único:**

* Selecciona "Cambiar el destinatario del sobre" e introduce tu dirección de Gmail principal.
* Marca "Añadir encabezado X-Gm-Original-To con el destinatario original".

**Patrones para destinatarios de sobres:**

* Agregue un patrón que coincida con todos los buzones inexistentes (por ejemplo, `.*@yourdomain.com`)

**Configuración del servidor de correo electrónico:**

* Seleccione "Enrutar al host" e ingrese `mx1.forwardemail.net` como servidor principal.
* Agregue `mx2.forwardemail.net` como servidor de respaldo.
* Establezca el puerto en 25.
* Seleccione "Requerir TLS" por seguridad.

4. Haga clic en **Guardar** para crear la ruta

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:

</strong>
<span>
Esta configuración solo funciona con cuentas de Google Workspace con dominios personalizados, no con cuentas de Gmail.

</span>
</div>

### Configuración avanzada de enrutamiento de Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
<span>15-30 minutos</span>
</div>

Para los usuarios de Microsoft 365 (anteriormente Office 365) que desean configurar un enrutamiento avanzado para que los alias que no coincidan con un buzón se reenvíen a los intercambios de correo de Forward Email:

1. Inicie sesión en el Centro de administración de Microsoft 365 en [admin.microsoft.com](https://admin.microsoft.com)
2. Vaya a **Exchange → Flujo de correo → Reglas**
3. Haga clic en **Agregar una regla** y seleccione **Crear una nueva regla**
4. Asigne un nombre a la regla (p. ej., "Reenviar buzones inexistentes a Reenvío de correo electrónico")
5. En **Aplicar esta regla si**, seleccione:
* "La dirección del destinatario coincide..."
* Introduzca un patrón que coincida con todas las direcciones de su dominio (p. ej., `*@yourdomain.com`)
6. En **Hacer lo siguiente**, seleccione:
* "Redirigir el mensaje a..."
* Elija "El siguiente servidor de correo"
* Introduzca `mx1.forwardemail.net` y el puerto 25
* Agregue `mx2.forwardemail.net` como servidor de respaldo
7. En **Excepto si**, seleccione:
* "El destinatario es..."
* Agregue todos los buzones existentes que no deben reenviarse.
8. Establezca la prioridad de la regla para garantizar que se ejecute después de otras reglas de flujo de correo.
9. Haga clic en **Guardar** para activar la regla.

## Solución de problemas {#troubleshooting}

### ¿Por qué no recibo mis correos electrónicos de prueba? {#why-am-i-not-receiving-my-test-emails}

Si se envía un correo electrónico de prueba a sí mismo, es posible que no aparezca en su bandeja de entrada porque tiene el mismo encabezado "ID de mensaje".

Este es un problema ampliamente conocido y también afecta a servicios como Gmail. <a href="https://support.google.com/a/answer/1703601">Here es la respuesta oficial de Gmail con respecto a este problema</a>.

Si sigues teniendo problemas, lo más probable es que se trate de un problema con la propagación del DNS. Tendrás que esperar un poco más e intentarlo de nuevo (o intentar configurar un valor TTL más bajo para tus registros <strong class="notranslate">TXT</strong>).

**¿Aún tienes problemas?** Comunícate con <a href="/help">nosotros</a> para que podamos ayudarte a investigar el problema y encontrar una solución rápida.

### ¿Cómo configuro mi cliente de correo electrónico para que funcione con el reenvío de correo electrónico? {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Nuestro servicio funciona con clientes de correo electrónico populares como:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light Texto oscuro"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light Texto oscuro"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light Texto oscuro"><i class="fas fa-desktop"></i> Escritorio</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light <i class="fab fa-firefox-browser"></i> Mozilla Firefox®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-claro texto-oscuro"><i class="fas fa-terminal"></i> Terminal</a></li>
</ul>
</div>

<div class="alert alert-primary">
Tu nombre de usuario es la dirección de correo electrónico de tu alias y la contraseña es de <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> ("Contraseña normal").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
<span>Si usa Thunderbird, asegúrese de que la "Seguridad de conexión" esté configurada en "SSL/TLS" y que el método de autenticación esté configurado en "Contraseña normal".</span>
</div>

| Tipo | Nombre de host | Protocolo | Puertos |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Preferido** | __CÓDIGO_CELDA_0__ y __CÓDIGO_CELDA_1__ |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Preferido** o TLS (STARTTLS) | `465` y `2465` para SSL/TLS (o) `587`, `2587`, `2525` y `25` para TLS (STARTTLS) |

### ¿Por qué mis correos electrónicos llegan a Spam y Correo No Deseado y cómo puedo comprobar la reputación de mi dominio? {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Esta sección le orienta si su correo saliente utiliza nuestros servidores SMTP (por ejemplo, `smtp.forwardemail.net`) (o se reenvía a través de `mx1.forwardemail.net` o `mx2.forwardemail.net`) y se entrega en la carpeta de correo no deseado o spam de los destinatarios.

Monitoreamos rutinariamente nuestro [Direcciones IP](#what-are-your-servers-ip-addresses) contra [todas las listas de denegación de DNS de buena reputación](#how-do-you-handle-your-ip-addresses-becoming-blocked), **por lo tanto, es muy probable que se trate de un problema específico de reputación del dominio**.

Los correos electrónicos pueden llegar a las carpetas de correo no deseado por varios motivos:

1. **Autenticación faltante**: configure los registros [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) y [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Reputación del dominio**: Los dominios nuevos suelen tener una reputación neutral hasta que establecen un historial de envío.

3. **Desencadenantes de contenido**: Ciertas palabras o frases pueden activar los filtros de spam.

4. **Patrones de envío**: Los aumentos repentinos en el volumen de correos electrónicos pueden parecer sospechosos.

Puede intentar utilizar una o más de estas herramientas para comprobar la reputación y la categorización de su dominio:

| Nombre de la herramienta | URL | Tipo |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Comentarios sobre la categorización de dominios de Cloudflare | <https://radar.cloudflare.com/domains/feedback> | Categorización |
| Comprobador de reputación de IP y dominios de Spamhaus | <https://check.spamhaus.org/> | DNSBL |
| Centro de reputación de IP y dominios de Cisco Talos | <https://talosintelligence.com/centro_de_reputación> | Reputación |
| Búsqueda de reputación de dominio e IP de Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| Comprobación de la lista negra de MX Toolbox | <https://mxtoolbox.com/blacklists.aspx> | Lista negra |
| Herramientas del administrador de correo de Google | <https://www.gmail.com/postmaster/> | Reputación |
| Centro de remitentes de Yahoo | <https://senders.yahooinc.com/> | Reputación |
| Comprobación de la lista negra de MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| Puntuación del remitente | <https://senderscore.org/act/blocklist-remover/> | Reputación |
| Invaluación | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Eliminación de IP de Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | Eliminación |
| Eliminación de IP de Cloudmark | <https://csi.cloudmark.com/es/reset/> | Eliminación |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Eliminación de IP de Microsoft Outlook y Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Eliminación |
| Niveles 1, 2 y 3 de UCEPROTECT | <https://www.uceprotect.net/es/rblcheck.php> | DNSBL |
| El backscatterer.org de UCEPROTECT | <https://www.backscatterer.org/> | Protección contra retrodispersión |
| Sitio web de UCEPROTECT en la lista blanca | <https://www.whitelisted.org/> (requiere una tarifa) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Eliminación |
| AOL/Verizon (p. ej., `[IPTS04]`) | <https://senders.yahooinc.com/> | Eliminación |
| Comunicaciones Cox | `unblock.request@cox.net` | Eliminación |
| t-online.de (alemán/T-Mobile) | `tobr@rx.t-online.de` | Eliminación |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### ¿Qué debo hacer si recibo correos electrónicos no deseados? {#what-should-i-do-if-i-receive-spam-emails}

Debes cancelar tu suscripción a la lista de correo electrónico (si es posible) y bloquear al remitente.

No reporte el mensaje como spam, sino reenvíelo a nuestro sistema de prevención de abusos seleccionado manualmente y centrado en la privacidad.

**La dirección de correo electrónico a la que reenviar spam es:** <abuse@forwardemail.net>

### ¿Por qué los correos electrónicos de prueba que me envían en Gmail aparecen como "sospechosos"? {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Si ve este mensaje de error en Gmail cuando se envía una prueba a sí mismo o cuando una persona a la que le envía un correo electrónico con su alias ve un correo electrónico suyo por primera vez, **no se preocupe**, ya que se trata de una función de seguridad incorporada de Gmail.

Puedes simplemente hacer clic en "Parece seguro". Por ejemplo, si envías un mensaje de prueba usando la función "Enviar correo como" (a otra persona), esta no lo verá.

Sin embargo, si ven este mensaje, es porque estaban acostumbrados a ver que sus correos provenían de <john@gmail.com> en lugar de <john@customdomain.com> (solo un ejemplo). Gmail alertará a los usuarios para garantizar la seguridad, por si acaso; no hay solución alternativa.

### ¿Puedo eliminar el correo forwardemail punto net en Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}?

Este tema está relacionado con [Problema ampliamente conocido en Gmail donde aparece información adicional junto al nombre del remitente.](https://support.google.com/mail/answer/1311182).

A partir de mayo de 2023, admitimos el envío de correo electrónico con SMTP como complemento para todos los usuarios pagos, lo que significa que puede eliminar <span class="notranslate">via forwardemail dot net</span> en Gmail.

Tenga en cuenta que este tema de preguntas frecuentes es específico para quienes utilizan la función [Cómo enviar correos electrónicos usando Gmail](#how-to-send-mail-as-using-gmail).

Consulte la sección sobre [¿Admiten el envío de correo electrónico con SMTP?](#do-you-support-sending-email-with-smtp) para obtener instrucciones de configuración.

## Gestión de datos {#data-management}

### ¿Dónde están ubicados sus servidores? {#where-are-your-servers-located}

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

Nuestros servidores están ubicados principalmente en Denver, Colorado; consulte <https://forwardemail.net/ips> para ver nuestra lista completa de direcciones IP.

Puede obtener más información sobre nuestros subprocesadores en nuestras páginas [GDPR](/gdpr), [DPA](/dpa) y [Privacidad](/privacy).

### ¿Cómo exporto y hago una copia de seguridad de mi buzón de correo? {#how-do-i-export-and-backup-my-mailbox}

En cualquier momento puede exportar sus buzones de correo en formatos [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) o cifrados [SQLite](https://en.wikipedia.org/wiki/SQLite).

Vaya a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Descargue la copia de seguridad y seleccione el tipo de formato de exportación que prefiera.

Se le enviará por correo electrónico un enlace para descargar la exportación una vez que haya finalizado.

Tenga en cuenta que este enlace de descarga de exportación caduca después de 4 horas por cuestiones de seguridad.

Si necesita inspeccionar sus formatos EML o Mbox exportados, estas herramientas de código abierto pueden ser útiles:

| Nombre | Formato | Plataforma | URL de GitHub |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| Visor de MBox | Mbox | Ventanas | <https://github.com/eneam/mboxviewer> |
| Visor web mbox | Mbox | Todas las plataformas | <https://github.com/PHMRanger/visor web mbox> |
| Lector de correo electrónico | EML | Ventanas | <https://github.com/ayamadori/EmlReader> |
| Visor de correo electrónico | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| lector eml | EML | Todas las plataformas | <https://github.com/s0ph1e/eml-reader> |

Además, si necesita convertir un archivo Mbox a un archivo EML, puede usar <https://github.com/noelmartinon/mboxzilla>.

### ¿Cómo importo y migro mi buzón existente? {#how-do-i-import-and-migrate-my-existing-mailbox}

Puede importar fácilmente su correo electrónico a Forward Email (por ejemplo, usando [Pájaro de trueno](https://www.thunderbird.net)) con las siguientes instrucciones:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:

</strong>

Debe seguir todos los pasos siguientes para importar su correo electrónico existente.

</span>
</div>

1. Exporta tu correo electrónico desde tu proveedor de correo electrónico actual:

| Proveedor de correo electrónico | Formato de exportación | Instrucciones de exportación |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Perspectiva | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Sugerencia:</strong> <span>Si usa Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">formato de exportación PST</a>), puede seguir las instrucciones que se indican en "Otros" a continuación. Sin embargo, hemos proporcionado enlaces a continuación para convertir PST al formato MBOX/EML según su sistema operativo:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba para Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst para Windows cygwin</a> – (p. ej., <code>readpst -u -o $OUT_DIR $IN_DIR</code> reemplazando <code>$OUT_DIR</code> y <code>$IN_DIR</code> con las rutas del directorio de salida y del directorio de entrada respectivamente).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst para Ubuntu/Linux</a> (p. ej., <code>sudo apt-get install readpst</code> y luego <code>readpst -u -o $OUT_DIR $IN_DIR</code>, reemplazando <code>$OUT_DIR</code> y <code>$IN_DIR</code> con las rutas del directorio de salida y del directorio de entrada respectivamente).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst para macOS (a través de brew)</a> (p. ej., <code>brew install libpst</code> y luego <code>readpst -u -o $OUT_DIR $IN_DIR</code>, reemplazando <code>$OUT_DIR</code> y <code>$IN_DIR</code> con las rutas del directorio de salida y del directorio de entrada respectivamente).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Conversor PST para Windows (GitHub)</a></li></ul><br /></span></div> |
| Correo de Apple | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Correo rápido | EML | <https://www.fastmail.help/hc/es-es/articles/360060590573-Descarga-todos-tus-datos#downloadmail> |
| Correo de protones | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Pensar | EML | <https://docs.gandi.net/es/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Otro | [Use Thunderbird](https://www.thunderbird.net) | Configura tu cuenta de correo electrónico en Thunderbird y usa el complemento [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) para exportar e importar tus correos. **También puedes copiar y pegar o arrastrar y soltar correos entre cuentas.** |

2. Descargue, instale y abra [Pájaro de trueno](https://www.thunderbird.net).

3. Crea una cuenta nueva usando la dirección de correo electrónico completa de tu alias (p. ej., <code><tú@tudominio.com></code>) y la contraseña generada. <strong>Si aún no tienes una contraseña generada, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">consulta nuestras instrucciones de configuración</a></strong>.

4. Descargue e instale el complemento Thunderbird [Herramientas de importación y exportación de](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/).

5. Cree una nueva carpeta local en Thunderbird y luego haga clic derecho sobre ella → seleccione la opción `ImportExportTools NG` → elija `Import mbox file` (para el formato de exportación MBOX) – o – `Import messages` / `Import all messages from a directory` (para el formato de exportación EML).

6. Arrastre y suelte desde la carpeta local a una carpeta IMAP nueva (o existente) en Thunderbird donde desee cargar los mensajes en el almacenamiento IMAP con nuestro servicio. Esto garantizará que se respalden en línea con nuestro almacenamiento cifrado con SQLite.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
<span>
Si no sabe cómo importar a Thunderbird, puede consultar las instrucciones oficiales en <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> y <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Una vez que haya completado el proceso de exportación e importación, también puede habilitar el reenvío en su cuenta de correo electrónico existente y configurar una respuesta automática para notificar a los remitentes que tiene una nueva dirección de correo electrónico (por ejemplo, si antes usaba Gmail y ahora usa un correo electrónico con su nombre de dominio personalizado).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
¡Felicitaciones!
</strong>
<span>
Has completado todos los pasos correctamente.
</span>
</div>
</div>

### ¿Admite el autohospedaje de {#do-you-support-self-hosting}?

Sí, a partir de marzo de 2025, ofrecemos una opción autoalojada. Lea el blog [aquí](https://forwardemail.net/blog/docs/self-hosted-solution). Consulte [guía autoalojada](https://forwardemail.net/self-hosted) para comenzar. Si le interesa una versión paso a paso más detallada, consulte nuestras guías [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) o [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Configuración de correo electrónico {#email-configuration}

### ¿Cómo puedo empezar y configurar el reenvío de correo electrónico? {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tiempo estimado de configuración:</strong>
<span>Menos de 10 minutos</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Cómo empezar:
</strong>
<span>
Lea y siga atentamente los pasos del uno al ocho que se indican a continuación. Asegúrese de reemplazar la dirección de correo electrónico <code>usuario@gmail.com</code> por la dirección a la que desea reenviar los correos electrónicos (si no es correcta). De igual manera, asegúrese de reemplazar <code>ejemplo.com</code> por su nombre de dominio personalizado (si no es correcto).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Si ya registraste tu dominio, ¡omite este paso y ve al paso dos! De lo contrario, puedes <a href="/domain-registration" rel="noopener noreferrer">hacer clic aquí para registrar tu dominio</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
¿Recuerdas dónde registraste tu dominio? Una vez que lo recuerdes, sigue las instrucciones a continuación:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Debe abrir una nueva pestaña e iniciar sesión en su registrador de dominios. Puede hacer clic fácilmente en "Registrador" a continuación para hacerlo automáticamente. En esta nueva pestaña, debe navegar a la página de administración de DNS de su registrador; le proporcionamos los pasos de navegación paso a paso a continuación, en la columna "Pasos para configurar". Una vez que haya accedido a esta página en la nueva pestaña, puede volver a esta pestaña y continuar con el paso tres.
<strong class="font-weight-bold">No cierre la pestaña abierta todavía; la necesitará para los próximos pasos.</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Registrador</th>
<th>Pasos para la configuración</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> Centro de dominios <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> Editar la configuración de DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Ruta 53</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> Zonas alojadas <i class="fa fa-angle-right"></i> (Selecciona tu dominio)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> Mis servidores <i class="fa fa-angle-right"></i> Administración de dominios <i class="fa fa-angle-right"></i> Administrador de DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>PARA ROCK: Iniciar sesión <i class="fa fa-angle-right"></i> Dominios <i class="fa fa-angle-right"></i> (Haga clic en el icono ▼ junto a Administrar) <i class="fa fa-angle-right"></i> DNS
<br />
PARA HERMANDAD: Iniciar sesión <i class="fa fa-angle-right"></i> Dominios <i class="fa fa-angle-right"></i> Editor de zonas <i class="fa fa-angle-right"></i> (Seleccione su dominio)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Fácil</a></td>
<td>Iniciar sesión DNS (Selecciona tu dominio)


<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>

<td>Iniciar sesión (Selecciona tu dominio)

<i class="fa fa-angle-right"></i> DNS Administrar


<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean"</a></td>

<td>Iniciar sesión Redes Dominios fa-angle-right"></i> (Selecciona tu dominio) <i class="fa fa-angle-right"></i> Más <i class="fa fa-angle-right"></i> Administrar dominio</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> En la vista de tarjeta, haz clic en Administrar en tu dominio. <i class="fa fa-angle-right"></i> En la vista de lista, haz clic en el icono del engranaje. <i class="fa fa-angle-right"></i> DNS y servidores de nombres <i class="fa fa-angle-right"></i> Registros DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Ver</a>
</td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> (Selecciona tu dominio) <i class="fa fa-angle-right"></i> Administrar <i class="fa fa-angle-right"></i> (haz clic en el icono del engranaje) <i class="fa fa-angle-right"></i> Haz clic en DNS y servidores de nombres en el menú de la izquierda</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Dominios Administrar dominios DNS

Iniciar sesión
Resumen
Administrar
Editor simple
Registros

Editor simple
Administrar
Registros

(Seleccione su dominio)
Administración Editar la zona


<a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>


<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"> Ver


Iniciar sesión

Administrar mis dominios

(Selecciona tu dominio)

Administrar DNS

<a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Dominios</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Ver</a>
</td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> (Selecciona tu dominio) <i class="fa fa-angle-right"></i> Configurar DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Ver</a>
</td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> Lista de dominios <i class="fa fa-angle-right"></i> (Selecciona tu dominio) <i class="fa fa-angle-right"></i> Administrar <i class="fa fa-angle-right"></i> DNS avanzado</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> (Selecciona tu dominio) <i class="fa fa-angle-right"></i> Configurar DNS de Netlify</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Soluciones</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> Administrador de cuentas <i class="fa fa-angle-right"></i> Mis dominios <i class="fa fa-angle-right"></i> (Selecciona tu dominio) <i class="fa fa-angle-right"></i> Administrar <i class="fa fa-angle-right"></i> Cambiar la dirección del dominio <i class="fa fa-angle-right"></i> DNS avanzado</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Ver</a>
</td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> Dominios administrados <i class="fa fa-angle-right"></i> (Selecciona tu dominio) <i class="fa fa-angle-right"></i> Configuración de DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> Menú de inicio <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Dominios <i class="fa fa-angle-right"></i> (Selecciona tu dominio) <i class="fa fa-angle-right"></i>
Configuración avanzada <i class="fa fa-angle-right"></i> Registros personalizados</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Ahora</a></td>
<td>Usando la CLI "ahora" <i class="fa fa-angle-right"></i> <code>ahora dns add [dominio] '@' MX [valor-de-registro] [prioridad]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> Página de dominios <i class="fa fa-angle-right"></i> (Seleccione su dominio) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> Dominios <i class="fa fa-angle-right"></i> (Haga clic en el icono <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Seleccione Administrar registros DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
<td>Iniciar sesión <i class="fa fa-angle-right"></i> Dominios <i class="fa fa-angle-right"></i> Mis dominios</td>
</tr>
<tr>
<td>Otros</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> ¿No ves el nombre de tu registrador aquí? Simplemente busca en internet "cómo cambiar los registros DNS en $REGISTRAR" (reemplaza $REGISTRAR con el nombre de tu registrador; por ejemplo, "cómo cambiar los registros DNS en GoDaddy" si usas GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Usando la página de administración de DNS de tu registrador (la otra pestaña que tienes abierta), configura los siguientes registros "MX":

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Tenga en cuenta que NO debe haber otros registros MX configurados. Ambos registros que se muestran a continuación DEBEN existir. Asegúrese de que no haya errores tipográficos y de que tanto mx1 como mx2 estén escritos correctamente. Si ya existían registros MX, elimínelos por completo.
El valor "TTL" no necesita ser 3600; puede ser un valor menor o mayor si es necesario.
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
<td><em>"@", ".", o en blanco</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", ".", o en blanco</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Usando la página de administración de DNS de su registrador (la otra pestaña que ha abierto), configure los siguientes registros <strong class="notranslate">TXT</strong>:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Si tiene un plan de pago, debe omitir este paso y pasar al paso cinco. Si no tiene un plan de pago, sus direcciones reenviadas se podrán buscar públicamente. Vaya a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> y actualice su dominio a un plan de pago si lo desea. Si desea obtener más información sobre los planes de pago, consulte nuestra página de <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Precios</a>. De lo contrario, puede continuar eligiendo una o más combinaciones de las opciones A a F que se enumeran a continuación.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opción A:
</strong>
<span>
Si reenvía todos los correos electrónicos de su dominio (p. ej., "all@example.com", "hello@example.com", etc.) a una dirección específica: "user@gmail.com":
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
Asegúrate de reemplazar los valores anteriores en la columna "Valor" con tu propia dirección de correo electrónico. El valor "TTL" no necesita ser 3600; puede ser un valor menor o mayor si es necesario. Un valor menor de tiempo de vida ("TTL") garantizará que cualquier cambio futuro realizado en tus registros DNS se propague por Internet más rápido; piensa en esto como el tiempo que permanecerá en la memoria caché (en segundos). Puedes obtener más información sobre <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL en Wikipedia</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opción B:
</strong>
<span>
Si solo necesita reenviar una sola dirección de correo electrónico (p. ej., <code>hola@ejemplo.com</code> a <code>usuario@gmail.com</code>; esto también reenviará "hola+prueba@ejemplo.com" a "usuario+prueba@gmail.com" automáticamente):
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
Si reenvía varios correos electrónicos, deberá separarlos con una coma:
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
Puede configurar un número ilimitado de reenvíos de correo electrónico. Solo asegúrese de no incluir más de 255 caracteres en una sola línea y de comenzar cada línea con "forward-email=". A continuación, se muestra un ejemplo:
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
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", o en blanco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:usuario@gmail.com,foo:usuario@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", o en blanco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:usuario@gmail.com,baz:usuario@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", o en blanco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:usuario@gmail.com,beep:usuario@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", o en blanco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=errors:usuario@gmail.com,boop:usuario@gmail.com</code>
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
También puede especificar un nombre de dominio en su registro <strong class="notranslate">TXT</strong> para tener reenvío de alias global (por ejemplo, "usuario@ejemplo.com" se reenviará a "usuario@ejemplo.net"):
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
Incluso puedes usar webhooks como alias global o individual para reenviar correos electrónicos. Consulta el ejemplo y la sección completa sobre webhooks titulada <a href="#do-you-support-webhooks" class="alert-link">¿Soportas webhooks?</a> a continuación.
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
Incluso puede usar expresiones regulares ("regex") para encontrar alias y gestionar sustituciones a las que reenviar correos electrónicos. Consulte los ejemplos y la sección completa sobre expresiones regulares titulada <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">¿Admite expresiones regulares o regex?</a> a continuación.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>¿Necesita expresiones regulares avanzadas con sustitución?</strong> Consulte los ejemplos y la sección completa sobre expresiones regulares titulada <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">¿Admite expresiones regulares o expresiones regulares</a> a continuación?
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ejemplo simple:</strong> Si quiero que todos los correos electrónicos dirigidos a `linus@example.com` o `torvalds@example.com` se reenvíen a `user@gmail.com`:
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
Las reglas de reenvío general también se pueden describir como "de paso".
Esto significa que se utilizarán los correos electrónicos entrantes que coincidan con al menos una regla de reenvío específica en lugar de la general.
Las reglas específicas incluyen direcciones de correo electrónico y expresiones regulares.
<br /><br />
Por ejemplo:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
Los correos electrónicos enviados a <code>hello@example.com</code> **no** se reenviarán a <code>second@gmail.com</code> (general) con esta configuración, sino que solo se entregarán a <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Utilizando la página de administración de DNS de su registrador (la otra pestaña que ha abierto), configure adicionalmente el siguiente registro <strong class="notranslate">TXT</strong>:

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
Si usa Gmail (p. ej., "Enviar correo como") o G Suite, deberá añadir <code>include:_spf.google.com</code> al valor anterior, por ejemplo:
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
Si ya tiene una línea similar con "v=spf1", deberá añadir <code>include:spf.forwardemail.net</code> justo antes de cualquier registro "include:host.com" existente y antes de "-all" en la misma línea, por ejemplo:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Tenga en cuenta que existe una diferencia entre "-all" y "~all". "-" indica que la comprobación de SPF debe fallar si no coincide, y "~" indica que la comprobación de SPF debe fallar suavemente. Recomendamos usar el método "-all" para evitar la falsificación de dominios.
<br /><br />
También podría ser necesario incluir el registro SPF del host desde el que envía el correo (por ejemplo, Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Verifique sus registros DNS usando nuestra herramienta "Verificar registros" disponible en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración.

</li><li class="mb-2 mb-md-3 mb-lg-5">Envíe un correo electrónico de prueba para confirmar que funciona. Tenga en cuenta que la propagación de sus registros DNS puede tardar un tiempo.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
<span>
</span>
Si no recibes correos electrónicos de prueba o recibes uno que dice "Ten cuidado con este mensaje", consulta las respuestas a <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">¿Por qué no recibo mis correos electrónicos de prueba?</a> y <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">¿Por qué los correos electrónicos de prueba que me envían en Gmail aparecen como "sospechosos"</a>, respectivamente.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Si desea "Enviar correo como" desde Gmail, deberá <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">ver este video</a></strong> o seguir los pasos <a href="#how-to-send-mail-as-using-gmail">How para enviar correo como usando Gmail</a> a continuación.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
¡Felicitaciones!
</strong>
<span>
Has completado todos los pasos correctamente.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
<span>
A continuación se enumeran los complementos opcionales. Tenga en cuenta que estos complementos son completamente opcionales y podrían no ser necesarios. Queríamos, al menos, proporcionarle información adicional si fuera necesario.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Complemento opcional:
</strong>
<span>
Si utiliza la función <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How para enviar correo como si usara Gmail</a>, le recomendamos agregarse a una lista de permitidos. Consulte <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">estas instrucciones de Gmail</a> sobre este tema.
</span>
</div>

### ¿Puedo usar varios intercambios y servidores MX para reenvío avanzado? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Sí, pero **solo deberías tener un intercambio MX listado en tus registros DNS**.

No intente utilizar “Prioridad” como una forma de configurar múltiples intercambios MX.

En su lugar, debe configurar su intercambio MX existente para reenviar el correo de todos los alias que no coincidan a los intercambios de nuestro servicio (`mx1.forwardemail.net` y/o `mx2.forwardemail.net`).

Si está utilizando Google Workspace y desea reenviar todos los alias que no coincidan a nuestro servicio, consulte <https://support.google.com/a/answer/6297084>.

Si usa Microsoft 365 (Outlook) y desea reenviar todos los alias que no coincidan a nuestro servicio, consulte <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> y <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### ¿Cómo configuro un contestador automático de vacaciones (contestador automático fuera de la oficina)? {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Vaya a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias y cree o edite el alias para el cual desea configurar un autorespondedor de vacaciones.

Tienes la posibilidad de configurar una fecha de inicio, una fecha de finalización, un asunto y un mensaje, y habilitarlo o deshabilitarlo en cualquier momento:

* Actualmente se admiten el asunto y el mensaje en texto plano (utilizamos el paquete `striptags` internamente para eliminar cualquier HTML).
* El asunto está limitado a 100 caracteres.
* El mensaje está limitado a 1000 caracteres.
* La configuración requiere la configuración de SMTP saliente (por ejemplo, deberá configurar los registros DKIM, DMARC y Return-Path DNS).
* Vaya a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Configuración de SMTP saliente y siga las instrucciones de configuración.
* El respondedor automático no se puede habilitar en nombres de dominio vanidosos globales (por ejemplo, [direcciones desechables](/disposable-addresses) no es compatible). * La función de respuesta de vacaciones no se puede habilitar para alias con comodines/catch-all (`*`) ni expresiones regulares.

A diferencia de los sistemas de correo como `postfix` (por ejemplo, que usan la extensión de filtro de vacaciones `sieve`), Forward Email agrega automáticamente su firma DKIM, crea problemas de conexión a prueba de errores al enviar respuestas de vacaciones (por ejemplo, debido a problemas de conexión SSL/TLS comunes y servidores mantenidos por legados) e incluso admite el cifrado Open WKD y PGP para respuestas de vacaciones.

<!--
* Para evitar abusos, se deducirá 1 crédito SMTP saliente por cada mensaje de respuesta automática enviado.
* Todas las cuentas de pago incluyen 300 créditos diarios por defecto. Si necesita una cantidad mayor, contáctenos.
-->

1. Solo enviamos una vez por remitente cada 4 días (lo que es similar al comportamiento de Gmail).

* Nuestra caché de Redis utiliza las huellas digitales `alias_id` y `sender`, donde `alias_id` es el ID del alias de MongoDB y `sender` es la dirección de remitente (si está en la lista de permitidos) o el dominio raíz en la dirección de remitente (si no está en la lista de permitidos). Para simplificar, la caducidad de esta huella digital en la caché se establece en 4 días.

* Nuestro enfoque de utilizar el dominio raíz analizado en la dirección De para remitentes no incluidos en la lista blanca evita que remitentes relativamente desconocidos (por ejemplo, actores maliciosos) inunden con mensajes de respuesta automática.

2. Solo enviamos cuando el MAIL FROM y/o From no está en blanco y no contiene (sin distinguir entre mayúsculas y minúsculas) un [nombre de usuario del administrador de correos](#what-are-postmaster-addresses) (la parte antes del @ en un correo electrónico).

3. No enviamos si el mensaje original tenía alguno de los siguientes encabezados (sin distinguir entre mayúsculas y minúsculas):

* Encabezado de `auto-submitted` con un valor distinto de `no`. * Encabezado de `x-auto-response-suppress` con un valor de `dr`, `autoreply`, `auto-reply`, `auto_reply` o `all`
* Encabezado de `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply` `x-autorespond` o `x-auto-respond` (independientemente del valor).
* Encabezado de `precedence` con un valor de `bulk`, `autoreply`, `auto-reply`, `auto_reply` o `list`.

4. No enviamos si la dirección de correo electrónico MAIL FROM o From termina con `+donotreply`, `-donotreply`, `+noreply` o `-noreply`.

5. No enviamos si la parte del nombre de usuario de la dirección de correo electrónico del remitente era `mdaemon` y tenía un encabezado `X-MDDSN-Message` que no distingue entre mayúsculas y minúsculas.

6. No enviamos si había un encabezado `content-type` que no distingue entre mayúsculas y minúsculas o `multipart/report`.

### ¿Cómo configuro SPF para reenviar correo electrónico? {#how-do-i-set-up-spf-for-forward-email}

Utilizando la página de administración de DNS de su registrador, configure el siguiente registro <strong class="notranslate">TXT</strong>:

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
Si usa Gmail (p. ej., "Enviar correo como") o G Suite, deberá añadir <code>include:_spf.google.com</code> al valor anterior, por ejemplo:
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
Si usa Microsoft Outlook o Live.com, deberá agregar <code>include:spf.protection.outlook.com</code> a su registro SPF <strong class="notranslate">TXT</strong>, por ejemplo:
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
Si ya tiene una línea similar con "v=spf1", deberá añadir <code>include:spf.forwardemail.net</code> justo antes de cualquier registro "include:host.com" existente y antes de "-all" en la misma línea, por ejemplo:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Tenga en cuenta que existe una diferencia entre "-all" y "~all". "-" indica que la comprobación de SPF debe fallar si no coincide, y "~" indica que la comprobación de SPF debe fallar suavemente. Recomendamos usar el método "-all" para evitar la falsificación de dominios.
<br /><br />
También podría ser necesario incluir el registro SPF del host desde el que envía el correo (por ejemplo, Outlook).
</span>
</div>

### ¿Cómo configuro DKIM para el reenvío de correo electrónico? {#how-do-i-set-up-dkim-for-forward-email}

Vaya a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Configuración SMTP saliente y siga las instrucciones de configuración.

### ¿Cómo configuro DMARC para el reenvío de correo electrónico? {#how-do-i-set-up-dmarc-for-forward-email}

Vaya a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Configuración SMTP saliente y siga las instrucciones de configuración.

### ¿Cómo conecto y configuro mis contactos? {#how-do-i-connect-and-configure-my-contacts}

**Para configurar sus contactos, utilice la URL de CardDAV de:** `https://carddav.forwardemail.net` (o simplemente `carddav.forwardemail.net` si su cliente lo permite)

### ¿Cómo conecto y configuro mis calendarios? {#how-do-i-connect-and-configure-my-calendars}

**Para configurar su calendario, utilice la URL de CalDAV de:** `https://caldav.forwardemail.net` (o simplemente `caldav.forwardemail.net` si su cliente lo permite)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Ejemplo de configuración de reenvío de correo electrónico de calendario CalDAV Thunderbird" />

### ¿Cómo puedo agregar más calendarios y administrar los calendarios existentes? {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Si desea agregar calendarios adicionales, simplemente agregue una nueva URL de calendario de: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**asegúrese de reemplazar `calendar-name` con el nombre de calendario deseado**)

Puedes cambiar el nombre y el color de un calendario después de crearlo; simplemente usa tu aplicación de calendario preferida (por ejemplo, Apple Mail o [Pájaro de trueno](https://thunderbird.net)).

### ¿Cómo configuro SRS para reenviar correo electrónico? {#how-do-i-set-up-srs-for-forward-email}

Configuramos automáticamente [Esquema de reescritura del remitente](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – no necesita hacerlo usted mismo.

### ¿Cómo configuro MTA-STS para reenviar correo electrónico? {#how-do-i-set-up-mta-sts-for-forward-email}

Consulte [Nuestra sección sobre MTA-STS](#do-you-support-mta-sts) para obtener más información.

### ¿Cómo agrego una foto de perfil a mi dirección de correo electrónico? {#how-do-i-add-a-profile-picture-to-my-email-address}

Si utiliza Gmail, siga estos pasos a continuación:

1. Ve a <https://google.com> y cierra sesión en todas tus cuentas de correo electrónico.
2. Haz clic en "Iniciar sesión" y, en el menú desplegable, en "Otra cuenta".
3. Selecciona "Usar otra cuenta".
4. Selecciona "Crear cuenta".
5. Selecciona "Usar mi dirección de correo electrónico actual".
6. Introduce la dirección de correo electrónico de tu dominio personalizado.
7. Recibe el correo electrónico de verificación que se envió a tu dirección de correo electrónico.
8. Introduce el código de verificación de este correo electrónico.
9. Completa la información de perfil de tu nueva cuenta de Google.
10. Acepta todas las políticas de privacidad y los Términos de uso.
11. Ve a <https://google.com> y, en la esquina superior derecha, haz clic en el icono de tu perfil y, a continuación, en el botón "Cambiar".
12. Sube una nueva foto o avatar para tu cuenta.
13. Los cambios tardarán aproximadamente de 1 a 2 horas en implementarse, pero a veces pueden ser muy rápidos.
14. Envía un correo electrónico de prueba y debería aparecer la foto de perfil.

## Funciones avanzadas {#advanced-features}

### ¿Admite boletines informativos o listas de correo electrónico para correo electrónico relacionado con marketing? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Sí, puedes leer más en <https://forwardemail.net/guides/newsletter-with-listmonk>.

Tenga en cuenta que, para mantener la reputación de IP y garantizar la entregabilidad, Forward Email cuenta con un proceso de revisión manual por dominio para la **aprobación del boletín**. Envíe un correo electrónico a <support@forwardemail.net> o abra un [solicitud de ayuda](https://forwardemail.net/help) para su aprobación. Esto suele tardar menos de 24 horas, y la mayoría de las solicitudes se procesan en un plazo de 1 a 2 horas. Próximamente, nuestro objetivo es que este proceso sea instantáneo con controles y alertas adicionales de spam. Este proceso garantiza que sus correos electrónicos lleguen a la bandeja de entrada y que sus mensajes no se marquen como spam.

### ¿Admite el envío de correo electrónico con API {#do-you-support-sending-email-with-api}?

Sí, a partir de mayo de 2023 admitimos el envío de correo electrónico con API como complemento para todos los usuarios pagos.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Asegúrese de leer nuestros <a href="/terms" class="alert-link" target="_blank">Términos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidad</a> y <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Límites de SMTP de salida</a>. Su uso se considera un reconocimiento y aceptación.
</span>
</div>

Consulte nuestra sección sobre [Correos electrónicos](/email-api#outbound-emails) en nuestra documentación de API para obtener opciones, ejemplos y más información.

Para enviar correo electrónico saliente con nuestra API, debe utilizar su token de API disponible en [Mi seguridad](/my-account/security).

### ¿Admite la recepción de correo electrónico con IMAP {#do-you-support-receiving-email-with-imap}?

Sí, a partir del 16 de octubre de 2023, admitimos la recepción de correo electrónico por IMAP como complemento para todos los usuarios de pago. **Lea nuestro artículo detallado** sobre [Cómo funciona nuestra función de almacenamiento de buzones de correo SQLite cifrados](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="instrucciones-imap">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Asegúrese de leer nuestros <a href="/terms" class="alert-link" target="_blank">Términos</a> y <a href="/privacy" class="alert-link" target="_blank">Política de Privacidad</a>. Su uso se considera un reconocimiento y aceptación.
</span>
</div>

1. Crea un nuevo alias para tu dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias (p. ej., <code><hello@example.com></code>)

2. Haga clic en <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> junto al alias recién creado. Cópielo en el portapapeles y guarde de forma segura la contraseña generada que se muestra en pantalla.

3. Con su aplicación de correo electrónico preferida, agregue o configure una cuenta con el alias recién creado (p. ej., <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
<span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, o <a href="/blog/open-source" class="alert-link" target="_blank">una alternativa de código abierto y centrada en la privacidad</a>.</span>
</div>

4. Cuando se le solicite el nombre del servidor IMAP, ingrese `imap.forwardemail.net`

5. Cuando se le solicite el puerto del servidor IMAP, introduzca `993` (SSL/TLS); consulte [puertos IMAP alternativos](/faq#what-are-your-imap-server-configuration-settings) si es necesario.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
<span>Si utiliza Thunderbird, asegúrese de que la "Seguridad de conexión" esté configurada en "SSL/TLS" y que el método de autenticación esté configurado en "Contraseña normal".</span>
</div>

6. Cuando se le solicite la contraseña del servidor IMAP, pegue la contraseña de <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> en el paso 2 anterior.

7. **Guarde su configuración**: si tiene problemas, <a href="/help">contáctenos</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
¡Felicitaciones!
</strong>
<span>
Has completado todos los pasos correctamente.
</span>
</div>
</div>

</div>

### ¿Es compatible con POP3? {#do-you-support-pop3}

Sí, a partir del 4 de diciembre de 2023, admitimos [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) como complemento para todos los usuarios de pago. **Lea nuestro artículo detallado** sobre [Cómo funciona nuestra función de almacenamiento de buzones de correo SQLite cifrados](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="instrucciones-pop3">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Asegúrese de leer nuestros <a href="/terms" class="alert-link" target="_blank">Términos</a> y <a href="/privacy" class="alert-link" target="_blank">Política de Privacidad</a>. Su uso se considera un reconocimiento y aceptación.
</span>
</div>

1. Crea un nuevo alias para tu dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias (p. ej., <code><hello@example.com></code>)

2. Haga clic en <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> junto al alias recién creado. Cópielo en el portapapeles y guarde de forma segura la contraseña generada que se muestra en pantalla.

3. Con su aplicación de correo electrónico preferida, agregue o configure una cuenta con el alias recién creado (p. ej., <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
<span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, o <a href="/blog/open-source" class="alert-link" target="_blank">una alternativa de código abierto y centrada en la privacidad</a>.</span>
</div>

4. Cuando se le solicite el nombre del servidor POP3, ingrese `pop3.forwardemail.net`

5. Cuando se le solicite el puerto del servidor POP3, introduzca `995` (SSL/TLS); consulte [puertos POP3 alternativos](/faq#what-are-your-pop3-server-configuration-settings) si es necesario.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
<span>Si utiliza Thunderbird, asegúrese de que la "Seguridad de conexión" esté configurada en "SSL/TLS" y que el método de autenticación esté configurado en "Contraseña normal".</span>
</div>

6. Cuando se le solicite la contraseña del servidor POP3, pegue la contraseña de <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> en el paso 2 anterior.

7. **Guarde su configuración**: si tiene problemas, <a href="/help">contáctenos</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
¡Felicitaciones!
</strong>
<span>
Has completado todos los pasos correctamente.
</span>
</div>
</div>

</div>

### ¿Es compatible con calendarios (CalDAV)? {#do-you-support-calendars-caldav}

Sí, a partir del 5 de febrero de 2024, añadimos esta función. Nuestro servidor es `caldav.forwardemail.net` y también se supervisa en nuestra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de estado</a>.

Es compatible con IPv4 e IPv6 y está disponible a través del puerto `443` (HTTPS).

| Acceso | Ejemplo | Descripción |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre de usuario | `user@example.com` | Dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a>. |
| Contraseña | `************************` | Contraseña generada específica de alias. |

Para utilizar el soporte del calendario, el **usuario** debe ser la dirección de correo electrónico de un alias que exista para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a>, y la **contraseña** debe ser una contraseña generada específica del alias.

### ¿Admite contactos (CardDAV)? {#do-you-support-contacts-carddav}

Sí, a partir del 12 de junio de 2025, añadimos esta función. Nuestro servidor es `carddav.forwardemail.net` y también se supervisa en nuestra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de estado</a>.

Es compatible con IPv4 e IPv6 y está disponible a través del puerto `443` (HTTPS).

| Acceso | Ejemplo | Descripción |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre de usuario | `user@example.com` | Dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a>. |
| Contraseña | `************************` | Contraseña generada específica de alias. |

Para utilizar el soporte de contactos, el **usuario** debe ser la dirección de correo electrónico de un alias que exista para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a>, y la **contraseña** debe ser una contraseña generada específica del alias.

### ¿Admite el envío de correo electrónico con SMTP? {#do-you-support-sending-email-with-smtp}

Sí, a partir de mayo de 2023 admitimos el envío de correo electrónico con SMTP como complemento para todos los usuarios pagos.

<div id="instrucciones-smtp">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Asegúrese de leer nuestros <a href="/terms" class="alert-link" target="_blank">Términos</a>, <a href="/privacy" class="alert-link" target="_blank">Política de Privacidad</a> y <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Límites de SMTP de salida</a>. Su uso se considera un reconocimiento y aceptación.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Si usas Gmail, consulta nuestra <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">guía "Enviar correo como con Gmail"</a>. Si eres desarrollador, consulta nuestra <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentación de la API de correo electrónico</a>.
</span>
</div>

1. Vaya a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración <i class="fa fa-angle-right"></i> Configuración de SMTP saliente y siga las instrucciones de configuración.

2. Crea un nuevo alias para tu dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias (p. ej., <code><hello@example.com></code>)

3. Haga clic en <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> junto al alias recién creado. Cópielo en el portapapeles y guarde de forma segura la contraseña generada que se muestra en pantalla.

4. Con su aplicación de correo electrónico preferida, agregue o configure una cuenta con el alias recién creado (p. ej., <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
<span>Recomendamos usar <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, o <a href="/blog/open-source" class="alert-link" target="_blank">una alternativa de código abierto y centrada en la privacidad</a>.</span>
</div>

5. Cuando se le solicite el nombre del servidor SMTP, ingrese `smtp.forwardemail.net`

6. Cuando se le solicite el puerto del servidor SMTP, introduzca `465` (SSL/TLS); consulte [puertos SMTP alternativos](/faq#what-are-your-smtp-server-configuration-settings) si es necesario.

<div class="alert my-3 alert-warning">

<i class="fa fa-info-circle font-weight-bold"></i>

<strong class="font-weight-bold">

Consejo:

<span>Si utiliza Thunderbird, asegúrese de que la "Seguridad de conexión" esté configurada en "SSL/TLS" y que el método de autenticación esté configurado en "Contraseña normal".</span>

<span>

7. Cuando se le solicite la contraseña del servidor SMTP, pegue la contraseña de <strong class="text-success"><i class="fa fa-key"></i> Generar contraseña</strong> en el paso 3 anterior.

8. **Guarde su configuración y envíe su primer correo electrónico de prueba**. Si tiene problemas, <a href="/help">contáctenos</a>.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Tenga en cuenta que, para mantener la reputación de la IP y garantizar la entregabilidad, contamos con un proceso de revisión manual por dominio para la aprobación de SMTP saliente. Este proceso suele tardar menos de 24 horas, y la mayoría de las solicitudes se procesan en un plazo de 1 a 2 horas. Próximamente, nuestro objetivo es que este proceso sea instantáneo con controles de spam y alertas adicionales. Este proceso garantiza que sus correos electrónicos lleguen a la bandeja de entrada y que sus mensajes no se marquen como spam.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
¡Felicitaciones!
</strong>
<span>
Has completado todos los pasos correctamente.
</span>
</div>
</div>

</div>

### ¿Es compatible con OpenPGP/MIME, cifrado de extremo a extremo ("E2EE") y directorio de claves web ("WKD")? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Sí, admitimos [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [cifrado de extremo a extremo ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) y el descubrimiento de claves públicas mediante [Directorio de claves web ("WKD")](https://wiki.gnupg.org/WKD). Puede configurar OpenPGP mediante [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) o [aloja tus propias claves](https://wiki.gnupg.org/WKDHosting) (consulte [Esta es la esencia de la configuración del servidor WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Las búsquedas WKD se almacenan en caché durante una hora para garantizar la entrega puntual de los correos electrónicos. Por lo tanto, si agrega, modifica o elimina su clave WKD, envíenos un correo electrónico a `support@forwardemail.net` con su dirección de correo electrónico para que podamos purgar la caché manualmente.
* Admitimos el cifrado PGP para los mensajes que se reenvían mediante búsquedas WKD o utilizando una clave PGP cargada en nuestra interfaz.
* Las claves cargadas prevalecen siempre que la casilla PGP esté habilitada o marcada.
* Los mensajes enviados a webhooks no están actualmente cifrados con PGP.
* Si tiene varios alias que coinciden con una dirección de reenvío determinada (por ejemplo, combinación de expresiones regulares, comodines y exactas) y más de uno de ellos contiene una clave PGP cargada y tiene PGP activado, le enviaremos un correo electrónico de alerta de error y no cifraremos el mensaje con su clave PGP cargada. Esto es muy poco frecuente y suele aplicarse solo a usuarios avanzados con reglas de alias complejas.
**El cifrado PGP no se aplicará al reenvío de correo electrónico a través de nuestros servidores MX si el remitente tenía una política de rechazo DMARC. Si necesita cifrado PGP para *todo* el correo, le sugerimos usar nuestro servicio IMAP y configurar su clave PGP para su alias para el correo entrante.**

**Puede validar la configuración de su directorio de claves web en <https://wkd.chimbosonic.com/> (código abierto) o <https://www.webkeydirectory.com/> (propietario).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Cifrado automático:
</strong>
<span>Si utiliza nuestro <a href="#do-you-support-sending-email-with-smtp" class="alert-link">servicio SMTP saliente</a> y envía mensajes sin cifrar, intentaremos cifrar automáticamente los mensajes por destinatario mediante el <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Directorio de claves ("WKD")</a>.</span>
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

| Cliente de correo electrónico | Plataforma | Plugin recomendado | Notas |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pájaro de trueno | De oficina | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird tiene soporte integrado para OpenPGP. |
| Gmail | Navegador | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licencia propietaria) | Gmail no es compatible con OpenPGP, sin embargo puedes descargar el complemento de código abierto [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download). |
| Correo de Apple | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail no es compatible con OpenPGP, sin embargo puedes descargar el complemento de código abierto [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Correo de Apple | iOS | [PGPro](https://github.com/opensourceios/PGPro/) o [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (licencia propietaria) | Apple Mail no es compatible con OpenPGP, sin embargo puedes descargar el complemento de código abierto [PGPro](https://github.com/opensourceios/PGPro/) o [FlowCrypt](https://flowcrypt.com/download). |
| Perspectiva | Ventanas | [gpg4win](https://www.gpg4win.de/index.html) | El cliente de correo de escritorio de Outlook no es compatible con OpenPGP, sin embargo, puedes descargar el complemento de código abierto [gpg4win](https://www.gpg4win.de/index.html). |
| Perspectiva | Navegador | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licencia propietaria) | El cliente de correo basado en web de Outlook no admite OpenPGP, sin embargo, puede descargar el complemento de código abierto [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download). |
| Androide | Móvil | [OpenKeychain](https://www.openkeychain.org/) o [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | Tanto [Android mail clients](/blog/open-source/android-email-clients) como [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) y [FairEmail](https://github.com/M66B/FairEmail) son compatibles con el complemento de código abierto [OpenKeychain](https://www.openkeychain.org/). También puede usar el complemento de código abierto (licencia propietaria) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Navegador | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licencia propietaria) | Puede descargar la extensión de navegador de código abierto [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download). |
| Mozilla Firefox | Navegador | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licencia propietaria) | Puede descargar la extensión de navegador de código abierto [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Navegador | [Mailvelope](https://mailvelope.com/) | Puedes descargar la extensión de navegador de código abierto [Mailvelope](https://mailvelope.com/). |
| Corajudo | Navegador | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licencia propietaria) | Puede descargar la extensión de navegador de código abierto [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download). |
| Balsa | De oficina | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa tiene soporte integrado para OpenPGP. |
| KMail | De oficina | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail tiene soporte integrado para OpenPGP. |
| Evolución de GNOME | De oficina | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution tiene soporte integrado para OpenPGP. |
| Terminal | De oficina | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Puede utilizar [gpg command line tool](https://www.gnupg.org/download/) de código abierto para generar una nueva clave desde la línea de comandos. |

2. Abra el complemento, cree su clave pública y configure su cliente de correo electrónico para usarla.

3. Sube tu clave pública a <https://keys.openpgp.org/upload>.

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
Si utiliza nuestro servicio de <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">almacenamiento cifrado (IMAP/POP3)</a> y desea que <i>todo</i> el correo electrónico almacenado en su base de datos SQLite (ya cifrada) se cifre con su clave pública, vaya a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias (p. ej. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Edita OpenPGP y sube tu clave pública.
</span>
</div>

4. Agregue un nuevo registro `CNAME` a su nombre de dominio (por ejemplo, `example.com`):

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
<span>Si tu alias utiliza nuestros <a class="alert-link" href="/disposable-addresses" target="_blank">dominios personalizados/desechables</a> (p. ej., <code>hideaddress.net</code>), puedes omitir este paso.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
¡Felicitaciones!
</strong>
<span>
Has completado todos los pasos correctamente.
</span>
</div>
</div>

### ¿Es compatible con MTA-STS? {#do-you-support-mta-sts}

Sí, desde el 2 de marzo de 2023, admitimos [MTA-STS](https://www.hardenize.com/blog/mta-sts). Puedes usar [esta plantilla](https://github.com/jpawlowski/mta-sts.template) si deseas habilitarlo en tu dominio.

Nuestra configuración se puede encontrar públicamente en GitHub en <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### ¿Admite claves de acceso y WebAuthn? {#do-you-support-passkeys-and-webauthn}

¡Sí! A partir del 13 de diciembre de 2023, añadimos compatibilidad con las claves de acceso [debido a la alta demanda](https://github.com/orgs/forwardemail/discussions/182).

Las claves de acceso le permiten iniciar sesión de forma segura sin necesidad de una contraseña ni autenticación de dos factores.

Puede validar su identidad con el tacto, reconocimiento facial, contraseña basada en el dispositivo o PIN.

Le permitimos administrar hasta 30 claves de acceso a la vez, para que pueda iniciar sesión con todos sus dispositivos con facilidad.

Obtenga más información sobre las claves de acceso en los siguientes enlaces:

* [Inicie sesión en sus aplicaciones y sitios web con claves de acceso](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Utilice claves de acceso para iniciar sesión en aplicaciones y sitios web en iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Artículo de Wikipedia sobre claves de acceso](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### ¿Apoya las mejores prácticas de correo electrónico? {#do-you-support-email-best-practices}

Sí. Ofrecemos compatibilidad integrada con SPF, DKIM, DMARC, ARC y SRS en todos los planes. Además, hemos colaborado estrechamente con los autores originales de estas especificaciones y otros expertos en correo electrónico para garantizar la perfección y una alta capacidad de entrega.

### ¿Admiten webhooks de rebote? {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
¿Buscas documentación sobre webhooks de correo electrónico? Consulta <a href="/faq#do-you-support-webhooks" class="alert-link">¿Soportan webhooks?</a> para más información.
<span>
</span>
</div>

Sí, a partir del 14 de agosto de 2024, añadimos esta función. Ahora puede ir a Mi cuenta → Dominios → Configuración → URL de webhook de rebote y configurar una URL `http://` o `https://` a la que enviaremos una solicitud `POST` cada vez que reboten los correos electrónicos SMTP salientes.

Esto le resultará útil para administrar y supervisar su SMTP saliente, y puede usarse para mantener suscriptores, cancelar su suscripción y detectar cuando ocurren rebotes.

Las cargas útiles de los webhooks de rebote se envían como JSON con estas propiedades:

* `email_id` (Cadena) - ID de correo electrónico que corresponde a un correo electrónico en Mi cuenta → Correos electrónicos (SMTP saliente)
* `list_id` (Cadena) - El valor del encabezado `List-ID` (sin distinguir entre mayúsculas y minúsculas), si lo hay, del correo electrónico saliente original
* `list_unsubscribe` (Cadena) - El valor del encabezado `List-Unsubscribe` (sin distinguir entre mayúsculas y minúsculas), si lo hay, del correo electrónico saliente original
* `feedback_id` (Cadena) - El valor del encabezado `Feedback-ID` (sin distinguir entre mayúsculas y minúsculas), si lo hay, del correo electrónico saliente original
* `recipient` (Cadena) - El correo electrónico Dirección del destinatario que rebotó o generó un error
* `message` (Cadena) - Mensaje de error detallado del rebote
* `response` (Cadena) - Mensaje de respuesta SMTP
* `response_code` (Número) - Código de respuesta SMTP analizado
* `truth_source` (Cadena) - Si el código de respuesta proviene de una fuente confiable, este valor se completará con el nombre del dominio raíz (p. ej., `google.com` o `yahoo.com`)
* `bounce` (Objeto) - Objeto que contiene las siguientes propiedades que detallan el estado de rebote y rechazo
* `action` (Cadena) - Acción de rebote (p. ej., `"reject"`)
* `message` (Cadena) - motivo del rebote (p. ej., `"Message Sender Blocked By Receiving Server"`)
* `category` (Cadena) - categoría del rebote (p. ej., `"block"`)
* `code` (Número) - código de estado del rebote (p. ej., `554`)
* `status` (Cadena) - código de rebote del mensaje de respuesta (p. ej., `5.7.1`)
* `line` (Número) - número de línea analizado, si Cualquiera, [de la lista de análisis de rebotes de Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (p. ej., `526`)
* `headers` (Objeto) - par clave-valor de los encabezados del correo electrónico saliente
* `bounced_at` (Cadena) - Fecha con formato [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) en la que se produjo el error de rebote

Por ejemplo:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

A continuación se incluyen algunas notas adicionales sobre los webhooks de rebote:

* Si la carga útil del webhook contiene un valor `list_id`, `list_unsubscribe` o `feedback_id`, debe tomar las medidas necesarias para eliminar `recipient` de la lista, si es necesario.
* Si el valor `bounce.category` era `"block"`, `"recipient"`, `"spam"` o `"virus"`, debe eliminar al usuario de la lista. * Si necesita verificar las cargas útiles de los webhooks (para asegurarse de que realmente provienen de nuestro servidor), puede usar [Resolver la dirección IP del cliente remoto y el nombre de host del cliente mediante una búsqueda inversa](https://nodejs.org/api/dns.html#dnspromisesreverseip); debería ser `smtp.forwardemail.net`.
* También puede comparar la IP con [nuestras direcciones IP publicadas](#what-are-your-servers-ip-addresses).
* Vaya a Mi cuenta → Dominios → Configuración → Clave de verificación de la carga útil de la firma del webhook para obtener su clave de webhook.
* Puede rotar esta clave en cualquier momento por razones de seguridad.
* Calcule y compare el valor `X-Webhook-Signature` de nuestra solicitud de webhook con el valor del cuerpo calculado usando esta clave. Un ejemplo de cómo hacerlo está disponible en [esta publicación de Stack Overflow](https://stackoverflow.com/a/68885281).
* Consulte la discusión en <https://github.com/forwardemail/free-email-forwarding/issues/235> para más información. * Esperaremos hasta `5` segundos para que el punto final de tu webhook responda con un código de estado `200` y lo volveremos a intentar hasta `1` veces.
* Si detectamos que la URL de tu webhook de rebote tiene un error al intentar enviarle una solicitud, te enviaremos un correo electrónico de cortesía una vez por semana.

### ¿Soporta webhooks? {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
¿Buscas documentación sobre webhooks de rebote? Consulta <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">¿Soportan webhooks de rebote?</a> para más información.
<span>
</span>
</div>

Sí, a partir del 15 de mayo de 2020, añadimos esta función. ¡Puedes añadir webhooks de forma sencilla, igual que con cualquier destinatario! Asegúrate de incluir el protocolo "http" o "https" como prefijo en la URL del webhook.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Protección de Privacidad Mejorada:
</strong>
<span>
Si tiene un plan de pago (que incluye protección de privacidad mejorada), vaya a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> y haga clic en "Alias" junto a su dominio para configurar sus webhooks. Si desea obtener más información sobre los planes de pago, consulte nuestra página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Precios</a>. De lo contrario, puede seguir las instrucciones a continuación.
</span>
</div>

Si tiene el plan gratuito, simplemente agregue un nuevo registro DNS <strong class="notranslate">TXT</strong> como se muestra a continuación:

Por ejemplo, si quiero que todos los correos electrónicos que van a `alias@example.com` se reenvíen a un nuevo punto final de prueba [contenedor de solicitudes](https://requestbin.com/r/en8pfhdgcculn?inspect):

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
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

O tal vez desee que todos los correos electrónicos que van a `example.com` se reenvíen a este punto final:

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
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Aquí hay notas adicionales sobre los webhooks:**

* Si necesita verificar las cargas útiles de los webhooks (para asegurarse de que realmente provienen de nuestro servidor), puede usar [Resolver la dirección IP del cliente remoto y el nombre de host del cliente mediante una búsqueda inversa](https://nodejs.org/api/dns.html#dnspromisesreverseip); debe ser `mx1.forwardemail.net` o `mx2.forwardemail.net`.
* También puede comparar la IP con [nuestras direcciones IP publicadas](#what-are-your-servers-ip-addresses).
* Si tiene un plan de pago, vaya a Mi cuenta → Dominios → Configuración → Clave de verificación de la carga útil de la firma del webhook para obtener su clave de webhook.
* Puede rotar esta clave en cualquier momento por razones de seguridad.
* Calcule y compare el valor `X-Webhook-Signature` de nuestra solicitud de webhook con el valor del cuerpo calculado usando esta clave. Un ejemplo de cómo hacerlo está disponible en [esta publicación de Stack Overflow](https://stackoverflow.com/a/68885281). * Consulte la discusión en <https://github.com/forwardemail/free-email-forwarding/issues/235> para obtener más información.
* Si un webhook no responde con un código de estado `200`, almacenaremos su respuesta en [registro de errores creado](#do-you-store-error-logs), lo cual resulta útil para la depuración.
* Las solicitudes HTTP del webhook se reintentan hasta 3 veces por cada intento de conexión SMTP, con un tiempo de espera máximo de 60 segundos por solicitud POST de punto final. **Tenga en cuenta que esto no significa que solo se reintente 3 veces**, sino que se reintentará continuamente enviando un código SMTP de 421 (que indica al remitente que debe reintentar más tarde) después del tercer intento fallido de solicitud HTTP POST. Esto significa que el correo electrónico se reintentará continuamente durante días hasta que se alcance el código de estado 200.
* Reintentaremos automáticamente según el estado predeterminado y los códigos de error utilizados en [método de reintento del superagente](https://ladjs.github.io/superagent/#retrying-requests) (somos los encargados del mantenimiento).

* Agrupamos las solicitudes HTTP de webhook al mismo endpoint en una sola solicitud (en lugar de varias) para ahorrar recursos y acelerar el tiempo de respuesta. Por ejemplo, si envía un correo electrónico a <webhook1@example.com>, <webhook2@example.com> y <webhook3@example.com>, y todos están configurados para acceder a la misma URL *exacta* del endpoint, solo se realizará una solicitud. Agrupamos por coincidencia exacta del endpoint con igualdad estricta.
* Tenga en cuenta que utilizamos el método "simpleParser" de la biblioteca [analizador de correo](https://nodemailer.com/extras/mailparser/) para analizar el mensaje en un objeto compatible con JSON.
* El valor del correo electrónico sin procesar como cadena se proporciona como la propiedad "raw".
* Los resultados de la autenticación se proporcionan como las propiedades "dkim", "spf", "arc", "dmarc" y "bimi". * Los encabezados de correo electrónico analizados se proporcionan como la propiedad "headers" (encabezados); sin embargo, tenga en cuenta que puede usar "headerLines" para facilitar la iteración y el análisis.
* Los destinatarios agrupados para este webhook se proporcionan como la propiedad "recipients" (destinatarios).
* La información de la sesión SMTP se proporciona como la propiedad "session" (sesión). Esta contiene información sobre el remitente del mensaje, la hora de llegada, el HELO y el nombre de host del cliente. El valor del nombre de host del cliente, como `session.clientHostname`, es el FQDN (de una búsqueda PTR inversa) o `session.remoteAddress` entre corchetes (por ejemplo, `"[127.0.0.1]"`).
* Si necesita obtener rápidamente el valor de `X-Original-To`, puede usar el valor de `session.recipient` (vea el ejemplo a continuación). El encabezado `X-Original-To` se añade a los mensajes para la depuración con el destinatario original (antes del reenvío enmascarado).
* Si necesita eliminar las propiedades `attachments` o `raw` del cuerpo de la carga útil, simplemente añada `?attachments=false`, `?raw=false` o `?attachments=false&raw=false` al punto final de su webhook como parámetro de cadena de consulta (p. ej., `https://example.com/webhook?attachments=false&raw=false`). * Si hay archivos adjuntos, se añadirán a la matriz `attachments` con los valores del búfer. Puedes convertirlos en contenido mediante un enfoque con JavaScript como el siguiente:

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
Consejo:
</strong>
¿Te interesa saber cómo se ve la solicitud de webhook desde los correos electrónicos reenviados? ¡A continuación te ofrecemos un ejemplo!
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

### ¿Admite expresiones regulares o regex {#do-you-support-regular-expressions-or-regex}?

Sí, a partir del 27 de septiembre de 2021, añadimos esta función. Puedes escribir expresiones regulares ("regex") para buscar alias y realizar sustituciones.

Los alias compatibles con expresiones regulares empiezan por `/` y terminan por `/`, y sus destinatarios son direcciones de correo electrónico o webhooks. Los destinatarios también pueden incluir compatibilidad con la sustitución de expresiones regulares (p. ej., `$1`, `$2`).

Se admiten dos indicadores de expresiones regulares: `i` y `g`. El indicador `i`, que no distingue entre mayúsculas y minúsculas, es un valor predeterminado permanente y siempre se aplica. Puede añadir el indicador global `g` añadiendo `/g` a la terminación `/`.

Tenga en cuenta que también admitimos nuestra función de alias <a href="#can-i-disable-specific-aliases">disabled</a> para la parte del destinatario con nuestro soporte de expresiones regulares.

Las expresiones regulares no son compatibles con los <a href="/disposable-addresses" target="_blank">dominios de vanidad globales</a> (ya que esto podría ser una vulnerabilidad de seguridad).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Protección de Privacidad Mejorada:
</strong>
<span>
Si tiene un plan de pago (que incluye protección de privacidad mejorada), vaya a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a> y haga clic en "Alias" junto a su dominio para configurar expresiones regulares. Si desea obtener más información sobre los planes de pago, consulte nuestra página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Precios</a>. De lo contrario, puede seguir las instrucciones a continuación.
</span>
</div>

Si tiene el plan gratuito, simplemente agregue un nuevo registro DNS <strong class="notranslate">TXT</strong> utilizando uno o más de los ejemplos proporcionados a continuación:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ejemplo simple:</strong> Si quiero que todos los correos electrónicos dirigidos a `linus@example.com` o `torvalds@example.com` se reenvíen a `user@gmail.com`:
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
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ejemplo de sustitución de nombre y apellido:</strong> Imagine que todas las direcciones de correo electrónico de su empresa siguen el patrón `firstname.lastname@example.com`. Si quiero que todos los correos electrónicos que siguen el patrón `firstname.lastname@example.com` se reenvíen a `firstname.lastname@company.com` con compatibilidad con la sustitución (<a href="https://regexr.com/66hnu" class="alert-link">ver prueba en RegExr</a>):
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
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ejemplo de sustitución de filtrado de símbolos Plus:</strong> Si quiero que todos los correos electrónicos que se dirigen a `info@example.com` o `support@example.com` se reenvíen a `user+info@gmail.com` o `user+support@gmail.com` respectivamente (con compatibilidad con sustitución) (<a href="https://regexr.com/66ho7" class="alert-link">ver prueba en RegExr</a>):
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
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ejemplo de sustitución de cadena de consulta de webhook:</strong> Quizás desee que todos los correos electrónicos que dirigen a `example.com` dirijan a un <a href="#do-you-support-webhooks" class="alert-link">webhook</a> y tengan una clave de cadena de consulta dinámica de "to" con un valor igual a la parte del nombre de usuario de la dirección de correo electrónico (<a href="https://regexr.com/66ho4" class="alert-link">ver prueba en RegExr</a>):
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
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ejemplo de rechazo silencioso:</strong> Si desea que todos los correos electrónicos que coinciden con un patrón determinado se desactiven y se rechacen silenciosamente (parece que el remitente lo envió correctamente, pero en realidad no llega a ninguna parte) con el código de estado `250` (consulte <a href="#can-i-disable-specific-aliases" class="alert-link">¿Puedo desactivar alias específicos?</a>), simplemente utilice el mismo método con un solo signo de exclamación "!". Esto indica al remitente que el mensaje se entregó correctamente, pero en realidad no llegó a ninguna parte (por ejemplo, blackhole o `/dev/null`).
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
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ejemplo de rechazo suave:</strong> Si desea que todos los correos electrónicos que coincidan con un patrón determinado se deshabiliten y se rechacen con el código de estado `421` (consulte <a href="#can-i-disable-specific-aliases" class="alert-link">¿Puedo deshabilitar alias específicos?</a>), simplemente utilice el mismo método con un doble signo de exclamación "!!". Esto indica al remitente que debe reintentar el envío, y los correos electrónicos dirigidos a este alias se reintentarán durante aproximadamente 5 días y luego se rechazarán definitivamente.
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
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ejemplo de rechazo total:</strong> Si desea que todos los correos electrónicos que coincidan con un patrón determinado se deshabiliten y se rechacen con el código de estado `550` (consulte <a href="#can-i-disable-specific-aliases" class="alert-link">¿Puedo deshabilitar alias específicos?</a>), simplemente utilice el mismo método con tres signos de exclamación "!!!". Esto indica al remitente un error permanente y los correos electrónicos no se reintentarán, sino que se rechazarán con este alias.
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
<td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
¿Tienes curiosidad por saber cómo escribir una expresión regular o necesitas probar tu reemplazo? Puedes visitar el sitio web gratuito de pruebas de expresiones regulares <a href="https://regexr.com" class="alert-link">RegExr</a> en <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### ¿Cuáles son sus límites de SMTP saliente? {#what-are-your-outbound-smtp-limits}

Limitamos la tasa de usuarios y dominios a 300 mensajes SMTP salientes por día. Esto equivale a un promedio de más de 9000 correos electrónicos al mes. Si necesita superar esta cantidad o recibe correos electrónicos de gran volumen de forma constante, por favor, marque [Contáctanos](https://forwardemail.net/help).

### ¿Necesito aprobación para habilitar SMTP? {#do-i-need-approval-to-enable-smtp}

Sí, tenga en cuenta que, para mantener la reputación de IP y garantizar la entregabilidad, Forward Email cuenta con un proceso de revisión manual por dominio para la aprobación de SMTP saliente. Envíe un correo electrónico a <support@forwardemail.net> o abra un [solicitud de ayuda](https://forwardemail.net/help) para su aprobación. Esto suele tardar menos de 24 horas, y la mayoría de las solicitudes se procesan en un plazo de 1 a 2 horas. Próximamente, nuestro objetivo es que este proceso sea instantáneo con controles y alertas de spam adicionales. Este proceso garantiza que sus correos electrónicos lleguen a la bandeja de entrada y que sus mensajes no se marquen como spam.

### ¿Cuáles son los ajustes de configuración de su servidor SMTP? {#what-are-your-smtp-server-configuration-settings}

Nuestro servidor es `smtp.forwardemail.net` y también se monitorea en nuestra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de estado</a>.

Es compatible con IPv4 e IPv6 y está disponible en los puertos `465` y `2465` para SSL/TLS y `587`, `2587`, `2525` y `25` para TLS (STARTTLS).

| Protocolo | Nombre de host | Puertos | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferido** | `smtp.forwardemail.net` | `465`, `2465` | :marca de verificación blanca: | :marca de verificación blanca: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :marca de verificación blanca: | :marca de verificación blanca: |

| Acceso | Ejemplo | Descripción |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre de usuario | `user@example.com` | Dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a>. |
| Contraseña | `************************` | Contraseña generada específica de alias. |

Para enviar correo electrónico saliente con SMTP, el **usuario SMTP** debe ser la dirección de correo electrónico de un alias que exista para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a>, y la **contraseña SMTP** debe ser una contraseña generada específica del alias.

Consulte [¿Admiten el envío de correo electrónico con SMTP?](#do-you-support-sending-email-with-smtp) para obtener instrucciones paso a paso.

### ¿Cuáles son los ajustes de configuración de su servidor IMAP? {#what-are-your-imap-server-configuration-settings}

Nuestro servidor es `imap.forwardemail.net` y también se monitorea en nuestra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de estado</a>.

Es compatible con IPv4 e IPv6 y está disponible en los puertos `993` y `2993` para SSL/TLS.

| Protocolo | Nombre de host | Puertos | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferido** | `imap.forwardemail.net` | `993`, `2993` | :marca de verificación blanca: | :marca de verificación blanca: |

| Acceso | Ejemplo | Descripción |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre de usuario | `user@example.com` | Dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a>. |
| Contraseña | `************************` | Contraseña generada específica de alias. |

Para conectarse con IMAP, el **usuario IMAP** debe ser la dirección de correo electrónico de un alias que exista para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a>, y la **contraseña IMAP** debe ser una contraseña generada específica del alias.

Consulte [¿Admite la recepción de correo electrónico con IMAP?](#do-you-support-receiving-email-with-imap) para obtener instrucciones paso a paso.

### ¿Cuáles son los ajustes de configuración de su servidor POP3? {#what-are-your-pop3-server-configuration-settings}

Nuestro servidor es `pop3.forwardemail.net` y también se monitorea en nuestra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">página de estado</a>.

Es compatible con IPv4 e IPv6 y está disponible en los puertos `995` y `2995` para SSL/TLS.

| Protocolo | Nombre de host | Puertos | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferido** | `pop3.forwardemail.net` | `995`, `2995` | :marca de verificación blanca: | :marca de verificación blanca: |

| Acceso | Ejemplo | Descripción |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre de usuario | `user@example.com` | Dirección de correo electrónico de un alias que existe para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a>. |
| Contraseña | `************************` | Contraseña generada específica de alias. |

Para conectarse con POP3, el **usuario POP3** debe ser la dirección de correo electrónico de un alias que exista para el dominio en <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a>, y la **contraseña IMAP** debe ser una contraseña generada específica del alias.

Consulte [¿Es compatible con POP3?](#do-you-support-pop3) para obtener instrucciones paso a paso.

### Configuración de retransmisión SMTP de Postfix {#postfix-smtp-relay-configuration}

Puedes configurar Postfix para que retransmita correos electrónicos a través de los servidores SMTP de Forward Email. Esto resulta útil para aplicaciones de servidor que necesitan enviar correos electrónicos.

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

2. Durante la instalación, seleccione “Sitio de Internet” cuando se le solicite el tipo de configuración.

#### Configuración {#configuration}

1. Edite el archivo de configuración principal de Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Agregue o modifique estas configuraciones:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Cree el archivo de contraseña SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Agregue sus credenciales de reenvío de correo electrónico:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Asegure y haga hash del archivo de contraseña:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Reiniciar Postfix:

```bash
sudo systemctl restart postfix
```

#### Prueba {#testing}

Pruebe su configuración enviando un correo electrónico de prueba:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Seguridad {#security}

### Técnicas avanzadas de refuerzo de servidores {#advanced-server-hardening-techniques}

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

Forward Email implementa numerosas técnicas de fortalecimiento del servidor para garantizar la seguridad de nuestra infraestructura y sus datos:

1. **Seguridad de red**:
* Cortafuegos de tablas IP con reglas estrictas
* Fail2ban para protección contra ataques de fuerza bruta
* Auditorías de seguridad periódicas y pruebas de penetración
* Acceso administrativo solo mediante VPN

2. **Fortalecimiento del sistema**:
* Instalación mínima de paquetes
* Actualizaciones de seguridad periódicas
* SELinux en modo de cumplimiento
* Acceso SSH root deshabilitado
* Autenticación basada únicamente en clave

3. **Seguridad de la aplicación**:
* Encabezados de la Política de Seguridad de Contenido (CSP)
* Seguridad de Transporte Estricta HTTPS (HSTS)
* Encabezados de protección XSS
* Opciones de marco y encabezados de la política de referencia
* Auditorías periódicas de dependencias

4. **Protección de datos**:
* Cifrado completo del disco con LUKS
* Gestión segura de claves
* Copias de seguridad periódicas con cifrado
* Prácticas de minimización de datos

5. **Monitoreo y Respuesta**:
* Detección de intrusiones en tiempo real
* Análisis de seguridad automatizado
* Registro y análisis centralizados
* Procedimientos de respuesta ante incidentes

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### ¿Tiene certificaciones SOC 2 o ISO 27001? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

Forward Email no cuenta directamente con las certificaciones SOC 2 Tipo II ni ISO 27001. Sin embargo, el servicio opera con infraestructura proporcionada por subencargados del tratamiento de datos certificados:

**DigitalOcean**: Certificación SOC 2 Tipo II y SOC 3 Tipo II (auditada por Schellman & Company LLC), certificación ISO 27001 en varios centros de datos. Detalles: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**: Certificación SOC 2+ (HIPAA), certificaciones ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Detalles: <https://www.vultr.com/legal/compliance/>

**DataPacket**: Proveedor de infraestructura empresarial compatible con SOC 2 (contacte directamente con DataPacket para obtener la certificación) (sede en Denver). Detalles: <https://www.datapacket.com/datacenters/denver>

Forward Email sigue las mejores prácticas de la industria para auditorías de seguridad y colabora regularmente con investigadores de seguridad independientes. Fuente: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### ¿Utiliza cifrado TLS para el reenvío de correo electrónico? {#do-you-use-tls-encryption-for-email-forwarding}

Sí. Forward Email aplica estrictamente TLS 1.2+ para todas las conexiones (HTTPS, SMTP, IMAP, POP3) e implementa MTA-STS para una mejor compatibilidad con TLS. La implementación incluye:

* Cumplimiento de TLS 1.2+ para todas las conexiones de correo electrónico
* Intercambio de claves ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) para una perfecta confidencialidad hacia adelante
* Conjuntos de cifrado modernos con actualizaciones de seguridad periódicas
* Compatibilidad con HTTP/2 para un mejor rendimiento y seguridad
* HSTS (HTTP Strict Transport Security) preinstalado en los principales navegadores
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** para un cumplimiento estricto de TLS

Fuente: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementación de MTA-STS**: El reenvío de correo electrónico implementa una estricta aplicación de MTA-STS en el código base. Cuando se producen errores TLS y se aplica MTA-STS, el sistema devuelve códigos de estado SMTP 421 para garantizar que los correos electrónicos se reintenten posteriormente en lugar de entregarse de forma insegura. Detalles de la implementación:

* Detección de error TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Aplicación de MTA-STS en el asistente de envío de correo electrónico: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validación de terceros: <https://www.hardenize.com/report/forwardemail.net/1750312779> muestra calificaciones "Buenas" para todas las medidas de seguridad de transporte y TLS.

### ¿Conserva los encabezados de autenticación de correo electrónico? {#do-you-preserve-email-authentication-headers}

Sí. Forward Email implementa y preserva de forma integral los encabezados de autenticación de correo electrónico:

* **SPF (Sender Policy Framework)**: Implementado y preservado correctamente
* **DKIM (DomainKeys Identified Mail)**: Soporte completo con gestión de claves adecuada
* **DMARC**: Aplicación de políticas para correos electrónicos que no superan la validación SPF o DKIM
* **ARC**: Si bien no se detalla explícitamente, las puntuaciones de cumplimiento perfectas del servicio sugieren una gestión integral de los encabezados de autenticación

Fuente: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validación: La prueba de correo de Internet.nl muestra una puntuación de 100/100 específicamente para la implementación de SPF, DKIM y DMARC. La evaluación de Hardenize confirma las calificaciones de "Bueno" para SPF y DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### ¿Conserva los encabezados de correo electrónico originales y evita la suplantación? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

Forward Email conserva los encabezados de correo electrónico originales al tiempo que implementa una protección integral contra suplantación de identidad a través de la base de código MX:

**Conservación de encabezados**: Los encabezados de autenticación originales se conservan durante el reenvío.
* **Anti-Spoofing**: La aplicación de políticas DMARC previene la suplantación de encabezados al rechazar los correos electrónicos que no superan la validación SPF o DKIM.
* **Prevención de inyección de encabezados**: Validación y desinfección de entradas mediante la biblioteca de striptags.
* **Protección avanzada**: Detección avanzada de phishing con detección de suplantación de identidad, prevención de suplantación de identidad y sistemas de notificación al usuario.

**Detalles de implementación de MX**: La lógica principal de procesamiento de correo electrónico es manejada por la base de código del servidor MX, específicamente:

* Controlador principal de datos MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtrado de correo electrónico arbitrario (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

El asistente `isArbitrary` implementa reglas sofisticadas contra la suplantación de identidad, incluida la detección de suplantación de dominio, frases bloqueadas y varios patrones de phishing.

Fuente: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### ¿Cómo te proteges contra el spam y el abuso? {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementa una protección integral de múltiples capas:

* **Límite de velocidad**: Se aplica a intentos de autenticación, endpoints de API y conexiones SMTP
* **Aislamiento de recursos**: Entre usuarios para evitar el impacto de usuarios con un alto volumen de tráfico
* **Protección DDoS**: Protección multicapa mediante el sistema Shield de DataPacket y Cloudflare
* **Escalado automático**: Ajuste dinámico de recursos según la demanda
* **Prevención de abuso**: Comprobaciones de prevención de abuso específicas para cada usuario y bloqueo basado en hash para contenido malicioso
* **Autenticación de correo electrónico**: Protocolos SPF, DKIM y DMARC con detección avanzada de phishing

Fuentes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Detalles de protección DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### ¿Almacena el contenido del correo electrónico en el disco? {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

**Arquitectura de conocimiento cero**: Los buzones SQLite cifrados individualmente impiden que Forward Email acceda al contenido del correo electrónico.
* **Procesamiento en memoria**: El procesamiento del correo electrónico se realiza completamente en memoria, evitando el almacenamiento en disco.
* **Sin registro de contenido**: No registramos ni almacenamos el contenido ni los metadatos del correo electrónico en disco.
* **Cifrado en espacio aislado**: Las claves de cifrado nunca se almacenan en disco en texto plano.

**Evidencia de la base de código MX**: El servidor MX procesa los correos electrónicos completamente en memoria, sin escribir contenido en el disco. El controlador principal de procesamiento de correo electrónico demuestra este enfoque en memoria: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fuentes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Resumen)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detalles de conocimiento cero)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Cifrado en espacio aislado)

### ¿Se puede exponer el contenido del correo electrónico durante fallas del sistema? {#can-email-content-be-exposed-during-system-crashes}

No. Forward Email implementa protecciones integrales contra la exposición de datos relacionada con fallas:

* **Volcados de memoria deshabilitados**: Evita la exposición de la memoria durante fallos
* **Memoria de intercambio deshabilitada**: Completamente deshabilitada para evitar la extracción de datos confidenciales de los archivos de intercambio
* **Arquitectura en memoria**: El contenido del correo electrónico solo existe en la memoria volátil durante el procesamiento
* **Protección de clave de cifrado**: Las claves nunca se almacenan en el disco en texto plano
* **Seguridad física**: Los discos cifrados con LUKS v2 impiden el acceso físico a los datos
* **Almacenamiento USB deshabilitado**: Evita la extracción de datos no autorizada

**Manejo de errores para problemas del sistema**: Forward Email utiliza funciones auxiliares `isCodeBug` y `isTimeoutError` para garantizar que si ocurren problemas de conectividad de base de datos, problemas de red/lista de bloqueo DNS o problemas de conectividad ascendente, el sistema devuelve códigos de estado SMTP 421 para garantizar que los correos electrónicos se vuelvan a intentar más tarde en lugar de perderse o exponerse.

Detalles de implementación:

* Clasificación de errores: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Manejo de errores de tiempo de espera en el procesamiento de MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fuente: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Quién tiene acceso a su infraestructura de correo electrónico {#who-has-access-to-your-email-infrastructure}

Forward Email implementa controles de acceso integrales para el acceso de su equipo mínimo de ingeniería de 2 a 3 personas con estrictos requisitos de 2FA:

* **Control de acceso basado en roles**: Para cuentas de equipo con permisos basados en recursos
* **Principio de privilegios mínimos**: Aplicado en todos los sistemas
* **Segregación de funciones**: Entre roles operativos
* **Gestión de usuarios**: Usuarios de implementación y desarrollo separados con permisos distintos
* **Inicio de sesión raíz deshabilitado**: Fuerza el acceso a través de cuentas correctamente autenticadas
* **Autenticación en dos pasos estricta**: Sin autenticación en dos pasos basada en SMS debido al riesgo de ataques MiTM; solo tokens basados en aplicaciones o hardware
* **Registro de auditoría completo**: Con redacción de datos confidenciales
* **Detección automatizada de anomalías**: Para patrones de acceso inusuales
* **Revisiones de seguridad periódicas**: De los registros de acceso
* **Prevención de ataques de Evil Maid**: Almacenamiento USB deshabilitado y otras medidas de seguridad físicas

Fuentes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Controles de autorización)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Seguridad de red)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Prevención de ataques de doncellas malvadas)

### ¿Qué proveedores de infraestructura utiliza? {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

Los detalles completos están disponibles en nuestra página de cumplimiento del RGPD: <https://forwardemail.net/gdpr>

**Subprocesadores de infraestructura primaria:**

| Proveedor | Marco de Privacidad de Datos Certificado | Página de cumplimiento del RGPD |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Sí | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Paquete de datos** | ❌ No | <https://www.datapacket.com/politica-de-privacidad> |
| **DigitalOcean** | ❌ No | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ No | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Certificaciones detalladas:**

**DigitalOcean**

* SOC 2 Tipo II y SOC 3 Tipo II (auditados por Schellman & Company LLC)
* Certificación ISO 27001 en múltiples centros de datos
* Cumple con PCI-DSS
* Certificación CSA STAR Nivel 1
* Certificación APEC CBPR PRP
* Detalles: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Certificación SOC 2+ (HIPAA)
* Cumple con la normativa PCI para comercios
* Certificación CSA STAR Nivel 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Detalles: <https://www.vultr.com/legal/compliance/>

**Paquete de datos**

* Cumple con SOC 2 (contacte directamente con DataPacket para obtener la certificación)
* Infraestructura de nivel empresarial (ubicación en Denver)
* Protección contra DDoS mediante la pila de ciberseguridad Shield
* Soporte técnico 24/7
* Red global en 58 centros de datos
* Detalles: <https://www.datapacket.com/datacenters/denver>

**Procesadores de pagos:**

* **Stripe**: Certificado por el Marco de Privacidad de Datos - <https://stripe.com/legal/privacy-center>
* **PayPal**: Sin certificación DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### ¿Ofrecen un Acuerdo de Procesamiento de Datos (APD)? {#do-you-offer-a-data-processing-agreement-dpa}

Sí, Forward Email ofrece un Acuerdo de Procesamiento de Datos (APD) completo que puede firmarse junto con nuestro acuerdo empresarial. Puede encontrar una copia de nuestro APD en: <https://forwardemail.net/dpa>

**Detalles de la DPA:**

* Cubre el cumplimiento del RGPD y los marcos del Escudo de Privacidad UE-EE. UU./Suiza-EE. UU.
* Se acepta automáticamente al aceptar nuestros Términos de Servicio
* No se requiere firma por separado para el DPA estándar
* Acuerdos de DPA personalizados disponibles a través de la Licencia Empresarial

**Marco de Cumplimiento del RGPD:**
Nuestro DPA detalla el cumplimiento del RGPD, así como los requisitos de transferencia internacional de datos. Puede encontrar información completa en: <https://forwardemail.net/gdpr>

Los clientes empresariales que requieren términos DPA personalizados o acuerdos contractuales específicos pueden abordarlos a través de nuestro programa **Licencia empresarial ($250/mes)**.

### ¿Cómo se gestionan las notificaciones de violación de datos? {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

**Exposición limitada de datos**: No se puede acceder al contenido cifrado del correo electrónico debido a la arquitectura de conocimiento cero.
* **Recopilación mínima de datos**: Solo información básica del suscriptor y registros de IP limitados por seguridad.
* **Entornos de subprocesamiento**: DigitalOcean y Vultr mantienen procedimientos de respuesta a incidentes que cumplen con el RGPD.

**Información del representante conforme al RGPD:**
Forward Email ha designado representantes conforme al RGPD de conformidad con el artículo 27:

**Representante en la UE:**
Osano International Compliance Services Limited
ATENCIÓN: LFHC
3 Dublin Landings, North Wall Quay
Dublín 1, D01C4E0

**Representante en el Reino Unido:**
Osano UK Compliance LTD
ATENCIÓN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Para los clientes empresariales que requieren SLA de notificación de infracciones específicos, estos deben analizarse como parte de un acuerdo de **Licencia empresarial**.

Fuentes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### ¿Ofrecen un entorno de prueba? {#do-you-offer-a-test-environment}

La documentación técnica de Forward Email no describe explícitamente un modo sandbox dedicado. Sin embargo, entre los posibles enfoques de prueba se incluyen:

**Opción de autoalojamiento**: Capacidades completas de autoalojamiento para crear entornos de prueba
* **Interfaz API**: Posibilidad de realizar pruebas programáticas de configuraciones
* **Código abierto**: El código 100 % abierto permite a los clientes examinar la lógica de reenvío
* **Dominios múltiples**: La compatibilidad con varios dominios podría permitir la creación de dominios de prueba

Para los clientes empresariales que requieren capacidades de espacio aislado formales, esto debe discutirse como parte de un acuerdo de **Licencia empresarial**.

Fuente: <https://github.com/forwardemail/forwardemail.net> (Detalles del entorno de desarrollo)

### ¿Proporciona herramientas de monitoreo y alerta? {#do-you-provide-monitoring-and-alerting-tools}

Forward Email proporciona monitoreo en tiempo real con algunas limitaciones:

**Disponible:**

* **Monitoreo de entrega en tiempo real**: Métricas de rendimiento visibles públicamente para los principales proveedores de correo electrónico
* **Alertas automáticas**: El equipo de ingeniería recibe alertas cuando los tiempos de entrega superan los 10 segundos
* **Monitoreo transparente**: Sistemas de monitoreo 100 % de código abierto
* **Monitoreo de infraestructura**: Detección automatizada de anomalías y registro de auditoría completo

**Limitaciones:**

* Los webhooks orientados al cliente o las notificaciones de estado de entrega basadas en API no están documentados explícitamente.

Para los clientes empresariales que requieren webhooks de estado de entrega detallados o integraciones de monitoreo personalizadas, estas capacidades pueden estar disponibles a través de acuerdos de **Licencia empresarial**.

Fuentes:

* <https://forwardemail.net> (Visualización de monitoreo en tiempo real)
* <https://github.com/forwardemail/forwardemail.net> (Implementación de monitoreo)

### ¿Cómo se garantiza una alta disponibilidad? {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **Infraestructura distribuida**: Múltiples proveedores (DigitalOcean, Vultr, DataPacket) en diferentes regiones geográficas
* **Balanceo de carga geográfica**: Balanceo de carga geolocalizado basado en Cloudflare con conmutación por error automática
* **Escalado automático**: Ajuste dinámico de recursos según la demanda
* **Protección multicapa contra DDoS**: Mediante el sistema Shield de DataPacket y Cloudflare
* **Redundancia de servidores**: Múltiples servidores por región con conmutación por error automática
* **Replicación de bases de datos**: Sincronización de datos en tiempo real en múltiples ubicaciones
* **Monitoreo y alertas**: Monitoreo 24/7 con respuesta automática a incidentes

**Compromiso de tiempo de actividad**: Más del 99,9 % de disponibilidad del servicio con monitoreo transparente disponible en <https://forwardemail.net>

Fuentes:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### ¿Cumple con la Sección 889 de la Ley de Autorización de Defensa Nacional (NDAA)? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

Sí, Forward Email cumple con la Sección 889. La Sección 889 de la Ley de Autorización de Defensa Nacional (NDAA) prohíbe a las agencias gubernamentales utilizar o contratar entidades que utilicen equipos de telecomunicaciones y videovigilancia de ciertas compañías (Huawei, ZTE, Hikvision, Dahua e Hytera).

**Cómo el reenvío de correo electrónico cumple con la Sección 889:**

Forward Email depende exclusivamente de dos proveedores de infraestructura clave, ninguno de los cuales utiliza equipos prohibidos por la Sección 889:

1. **Cloudflare**: Nuestro socio principal para servicios de red y seguridad de correo electrónico
2. **DataPacket**: Nuestro proveedor principal para infraestructura de servidores (utilizando exclusivamente equipos de Arista Networks y Cisco)
3. **Proveedores de respaldo**: Nuestros proveedores de respaldo, Digital Ocean y Vultr, también han sido confirmados por escrito como conformes con la Sección 889.

**Compromiso de Cloudflare**: Cloudflare declara explícitamente en su Código de conducta de terceros que no utiliza equipos de telecomunicaciones, productos de videovigilancia ni servicios de ninguna entidad prohibida por la Sección 889.

**Caso de uso gubernamental**: Nuestro cumplimiento de la Sección 889 se validó cuando la **Academia Naval de los EE. UU.** seleccionó Forward Email para sus necesidades de reenvío de correo electrónico seguro, lo que requirió documentación de nuestros estándares de cumplimiento federal.

Para obtener detalles completos sobre nuestro marco de cumplimiento gubernamental, incluidas las regulaciones federales más amplias, lea nuestro estudio de caso completo: [Servicio de correo electrónico del gobierno federal conforme a la Sección 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Detalles técnicos y del sistema {#system-and-technical-details}

### ¿Almacena correos electrónicos y sus contenidos? {#do-you-store-emails-and-their-contents}

No, no escribimos en el disco ni almacenamos registros con [excepción de errores](#do-you-store-error-logs) y [SMTP saliente](#do-you-support-sending-email-with-smtp) (consulte nuestro [política de privacidad](/privacy)).

Todo se hace en memoria y [Nuestro código fuente está en GitHub](https://github.com/forwardemail).

### ¿Cómo funciona su sistema de reenvío de correo electrónico? {#how-does-your-email-forwarding-system-work}

El correo electrónico se basa en el protocolo [Protocolo SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Este protocolo consiste en comandos enviados a un servidor (que se ejecuta generalmente en el puerto 25). Hay una conexión inicial, luego el remitente indica de quién proviene el correo ("MAIL FROM"), seguido del destinatario ("RCPT TO") y, finalmente, los encabezados y el cuerpo del correo electrónico ("DATA"). El flujo de nuestro sistema de reenvío de correo electrónico se describe a continuación en relación con cada comando del protocolo SMTP:

* Conexión inicial (sin nombre de comando, p. ej., `telnet example.com 25`): Esta es la conexión inicial. Comprobamos los remitentes que no están en nuestro [lista de permitidos](#do-you-have-an-allowlist) con nuestro [lista de negacionistas](#do-you-have-a-denylist). Finalmente, si un remitente no está en nuestra lista de permitidos, comprobamos si ha sido [en la lista gris](#do-you-have-a-greylist).

* `HELO` - Indica un saludo para identificar el FQDN, la dirección IP o el nombre del gestor de correo del remitente. Este valor puede ser falsificado, por lo que no nos basamos en estos datos y, en su lugar, utilizamos la búsqueda inversa del nombre de host de la dirección IP de la conexión.

* `MAIL FROM` - Indica la dirección del remitente del correo electrónico. Si se introduce un valor, debe ser una dirección de correo electrónico válida según RFC 5322. Se permiten valores vacíos. Aquí se utiliza [comprobar la retrodispersión](#how-do-you-protect-against-backscatter) y también se compara el remitente con nuestro [lista de negacionistas](#do-you-have-a-denylist). Finalmente, se verifica la limitación de velocidad de los remitentes que no están en la lista de permitidos (consulte la sección sobre [Limitación de velocidad](#do-you-have-rate-limiting) y [lista de permitidos](#do-you-have-an-allowlist) para más información).

* `RCPT TO` - Indica el/los destinatario(s) del correo electrónico. Deben ser direcciones de correo electrónico RFC 5322 válidas. Solo permitimos un máximo de 50 destinatarios por mensaje (esto es diferente del encabezado "Para" de un correo electrónico). También verificamos que la dirección [Esquema de reescritura del remitente](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") sea válida para proteger contra la suplantación de identidad con nuestro nombre de dominio SRS.

* `DATA` - Esta es la parte principal de nuestro servicio que procesa un correo electrónico. Consulte la sección [¿Cómo se procesa un correo electrónico para reenviarlo?](#how-do-you-process-an-email-for-forwarding) a continuación para obtener más información.

### ¿Cómo se procesa un correo electrónico para reenviarlo? {#how-do-you-process-an-email-for-forwarding}

Esta sección describe nuestro proceso relacionado con el comando de protocolo SMTP `DATA` en la sección [¿Cómo funciona su sistema de reenvío de correo electrónico?](#how-does-your-email-forwarding-system-work) anterior: es cómo procesamos los encabezados, el cuerpo y la seguridad de un correo electrónico, determinamos dónde debe entregarse y cómo manejamos las conexiones.

1. Si el mensaje supera el tamaño máximo de 50 MB, se rechaza con un código de error 552.

2. Si el mensaje no contiene un encabezado "De", o si alguno de los valores en el encabezado "De" no corresponde a una dirección de correo electrónico RFC 5322 válida, se rechaza con un código de error 550.

3. Si el mensaje tenía más de 25 encabezados "Recibido", se determinó que estaba atascado en un bucle de redirección y se rechazó con un código de error 550.

4. Utilizando la huella digital del correo electrónico (ver la sección sobre [Toma de huellas dactilares](#how-do-you-determine-an-email-fingerprint)), verificaremos si se ha intentado volver a enviar el mensaje durante más de 5 días (lo que coincide con [comportamiento predeterminado del sufijo](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)) y, de ser así, se rechazará con un código de error 550.

5. Almacenamos en memoria los resultados del escaneo del correo electrónico utilizando [Escáner de spam](https://spamscanner.net).

6. Si el Escáner de Spam arroja resultados aleatorios, se rechaza con un código de error 554. Al momento de escribir este artículo, los resultados aleatorios solo incluyen la prueba GTUBE. Consulte <https://spamassassin.apache.org/gtube/> para obtener más información.

7. Agregaremos los siguientes encabezados al mensaje con fines de depuración y prevención de abusos:

* `Received` - Añadimos este encabezado estándar de "Recibido" con la IP y el host de origen, el tipo de transmisión, la información de la conexión TLS, la fecha/hora y el destinatario.
* `X-Original-To` - El destinatario original del mensaje:
* Esto es útil para determinar dónde se entregó originalmente un correo electrónico (además del encabezado "Recibido").
* Se añade por destinatario al realizar el reenvío IMAP o enmascarado (para proteger la privacidad).
* `X-Forward-Email-Website` - Contiene un enlace a nuestro sitio web <https://forwardemail.net>
* `X-Forward-Email-Version` - La versión actual [SemVer](https://semver.org/) de `package.json` de nuestro código base. * `X-Forward-Email-Session-ID`: un valor de ID de sesión utilizado para fines de depuración (solo aplica en entornos que no son de producción).
* `X-Forward-Email-Sender`: una lista separada por comas que contiene la dirección de remitente del correo original (si no estaba en blanco), el FQDN del cliente PTR inverso (si existe) y la dirección IP del remitente.
* `X-Forward-Email-ID`: esto solo aplica para SMTP saliente y se correlaciona con el ID de correo electrónico almacenado en Mi cuenta → Correos electrónicos.
* `X-Report-Abuse`: con un valor de `abuse@forwardemail.net`.
* `X-Report-Abuse-To`: con un valor de `abuse@forwardemail.net`. * `X-Complaints-To` - con un valor de `abuse@forwardemail.net`.

8. Luego verificamos el mensaje para [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) y [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Si el mensaje no superó la prueba DMARC y el dominio tenía una política de rechazo (p. ej., `p=reject` [estaba en la política DMARC](https://wikipedia.org/wiki/DMARC)), se rechaza con un código de error 550. Normalmente, la política DMARC de un dominio se encuentra en el registro <strong class="notranslate">TXT</strong> del subdominio `_dmarc` (p. ej., `dig _dmarc.example.com txt`).
* Si el mensaje no superó la prueba SPF y el dominio tenía una política de rechazo total (p. ej., `-all` estaba en la política SPF en lugar de `~all` o ninguna política), se rechaza con un código de error 550. Normalmente, la política SPF de un dominio se encuentra en el registro <strong class="notranslate">TXT</strong> del dominio raíz (p. ej., `dig example.com txt`). Consulte esta sección para obtener más información sobre [enviar correo como con Gmail](#can-i-send-mail-as-in-gmail-with-this) en relación con SPF.

9. Ahora procesamos los destinatarios del mensaje recopilados mediante el comando `RCPT TO` en la sección [¿Cómo funciona su sistema de reenvío de correo electrónico?](#how-does-your-email-forwarding-system-work) anterior. Para cada destinatario, realizamos las siguientes operaciones:

* Buscamos los registros <strong class="notranslate">TXT</strong> del nombre de dominio (la parte después del símbolo `@`, p. ej., `example.com` si la dirección de correo electrónico era `test@example.com`). Por ejemplo, si el dominio es `example.com`, realizamos una búsqueda DNS como `dig example.com txt`.
* Analizamos todos los registros <strong class="notranslate">TXT</strong> que empiezan por `forward-email=` (planes gratuitos) o `forward-email-site-verification=` (planes de pago). Tenga en cuenta que analizamos ambos para procesar los correos electrónicos mientras un usuario cambia de plan. * A partir de estos registros <strong class="notranslate">TXT</strong> analizados, los iteramos para extraer la configuración de reenvío (como se describe en la sección [¿Cómo puedo empezar y configurar el reenvío de correo electrónico?](#how-do-i-get-started-and-set-up-email-forwarding) anterior). Tenga en cuenta que solo se admite un valor `forward-email-site-verification=` y, si se proporciona más de uno, se producirá un error 550 y el remitente recibirá un rebote para este destinatario.
* Iteramos recursivamente sobre la configuración de reenvío extraída para determinar el reenvío global, el reenvío basado en expresiones regulares y todas las demás configuraciones de reenvío compatibles, que ahora se conocen como nuestras "Direcciones de Reenvío".
* Para cada Dirección de Reenvío, se admite una búsqueda recursiva (que inicia esta serie de operaciones en la dirección dada). Si se encuentra una coincidencia recursiva, el resultado principal se eliminará de las Direcciones de Reenvío y se añadirán los secundarios. * Las direcciones de reenvío se analizan para garantizar su unicidad (ya que no queremos enviar duplicados a una misma dirección ni generar conexiones de cliente SMTP innecesarias).
* Para cada dirección de reenvío, verificamos su nombre de dominio en nuestro punto final de API `/v1/max-forwarded-addresses` (para determinar a cuántas direcciones puede el dominio reenviar correo electrónico por alias; por ejemplo, 10 por defecto; consulte la sección sobre [límite máximo de reenvío por alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Si se supera este límite, se producirá un error 550 y el remitente recibirá un rebote para este destinatario.
* Verificamos la configuración del destinatario original en nuestro punto final de API `/v1/settings`, que permite la búsqueda para usuarios de pago (con una alternativa para usuarios gratuitos). Esto devuelve un objeto de configuración para la configuración avanzada de `port` (Número, p. ej., `25`), `has_adult_content_protection` (Booleano), `has_phishing_protection` (Booleano), `has_executable_protection` (Booleano) y `has_virus_protection` (Booleano).
* Con base en esta configuración, verificamos los resultados del Escáner de Spam y, si se produce algún error, el mensaje se rechaza con un código de error 554 (p. ej., si `has_virus_protection` está habilitado, verificaremos los resultados del Escáner de Spam en busca de virus). Tenga en cuenta que todos los usuarios del plan gratuito estarán habilitados para las comprobaciones de contenido para adultos, phishing, ejecutables y virus. De manera predeterminada, todos los usuarios del plan pago también están suscritos, pero esta configuración se puede modificar en la página de Configuración de un dominio en el panel de Reenvío de correo electrónico).

10. Para cada dirección de reenvío de destinatario procesada, realizamos las siguientes operaciones:

* La dirección se compara con nuestro [lista de negacionistas](#do-you-have-a-denylist) y, si figuraba en la lista, se generará un código de error 421 (que indica al remitente que debe volver a intentarlo más tarde).
* Si la dirección es un webhook, se establece un valor booleano para futuras operaciones (véase más abajo: agrupamos webhooks similares para realizar una sola solicitud POST en lugar de varias para la entrega).
* Si la dirección es una dirección de correo electrónico, analizamos el host para futuras operaciones (véase más abajo: agrupamos hosts similares para realizar una sola conexión en lugar de varias conexiones individuales para la entrega).

11. Si no hay destinatarios ni rebotes, respondemos con un error 550: "Destinatarios no válidos".

12. Si hay destinatarios, los iteramos (agrupados por el mismo host) y entregamos los correos electrónicos. Consulte la sección [¿Cómo gestiona los problemas de entrega de correo electrónico?](#how-do-you-handle-email-delivery-issues) a continuación para obtener más información.

* Si se produce algún error al enviar correos electrónicos, lo almacenaremos en memoria para su posterior procesamiento.
* Tomaremos el código de error más bajo (si lo hay) del envío de correos electrónicos y lo usaremos como código de respuesta al comando `DATA`. Esto significa que los correos electrónicos no entregados normalmente serán reintentados por el remitente original, pero los correos electrónicos ya entregados no se reenviarán la próxima vez que se envíe el mensaje (ya que usamos [Toma de huellas dactilares](#how-do-you-determine-an-email-fingerprint)).
* Si no se produjeron errores, enviaremos un código de estado de respuesta SMTP 250 "Correcto".
* Se considera rebote cualquier intento de entrega que resulte en un código de estado ≥ 500 (errores permanentes).

13. Si no se produjeron rebotes (fallas permanentes), devolveremos un código de estado de respuesta SMTP del código de error más bajo de las fallas no permanentes (o un código de estado exitoso 250 si no hubo ninguno).

14. Si se produjeran rebotes, enviaríamos los correos electrónicos de rebote en segundo plano tras devolver al remitente el código de error más bajo. Sin embargo, si el código de error más bajo es >= 500, no enviaríamos ningún correo electrónico de rebote. Esto se debe a que, de hacerlo, los remitentes recibirían un doble rebote (por ejemplo, uno de su MTA saliente, como Gmail, y otro nuestro). Consulte la sección sobre [¿Cómo protegerse contra la retrodispersión?](#how-do-you-protect-against-backscatter) a continuación para obtener más información.

### ¿Cómo se gestionan los problemas de entrega de correo electrónico? {#how-do-you-handle-email-delivery-issues}

Tenga en cuenta que reescribiremos el encabezado "Friendly-From" en los correos electrónicos si y solo si la política DMARC del remitente no se aprobaba Y no había firmas DKIM alineadas con el encabezado "From". Esto significa que modificaremos el encabezado "From" en el mensaje, estableceremos "X-Original-From" y también estableceremos un "Reply-To" si aún no estaba establecido. También volveremos a sellar el sello ARC en el mensaje después de modificar estos encabezados.

También utilizamos análisis inteligente de mensajes de error en cada nivel de nuestra pila: en nuestro código, solicitudes DNS, elementos internos de Node.js, solicitudes HTTP (por ejemplo, 408, 413 y 429 se asignan al código de respuesta SMTP 421 si el destinatario es un webhook) y respuestas del servidor de correo (por ejemplo, las respuestas con "aplazar" o "desaceleración" se volverían a intentar como errores 421).

Nuestra lógica es a prueba de errores y reintentará errores de SSL/TLS, problemas de conexión, etc. El objetivo de la a prueba de errores es maximizar la entrega a todos los destinatarios de una configuración de reenvío.

Si el destinatario es un webhook, permitiremos un tiempo de espera de 60 segundos para que la solicitud se complete con hasta 3 reintentos (es decir, 4 solicitudes en total antes de que falle). Tenga en cuenta que analizamos correctamente los códigos de error 408, 413 y 429 y los asignamos al código de respuesta SMTP 421.

De lo contrario, si el destinatario es una dirección de correo electrónico, intentaremos enviar el correo electrónico con TLS oportunista (intentamos usar STARTTLS si está disponible en el servidor de correo del destinatario). Si se produce un error de SSL/TLS al intentar enviar el correo electrónico, intentaremos enviarlo sin TLS (sin usar STARTTLS).

Si ocurre algún error de DNS o de conexión, devolveremos al comando `DATA` un código de respuesta SMTP de 421, de lo contrario, si hay errores de nivel >= 500, se enviarán rebotes.

Si detectamos que un servidor de correo electrónico al que intentamos enviar correos tiene una o más de nuestras direcciones IP de intercambio de correo bloqueadas (por ejemplo, por cualquier tecnología que utilicen para diferir a los spammers), entonces enviaremos un código de respuesta SMTP 421 para que el remitente vuelva a intentar enviar su mensaje más tarde (y se nos alerta sobre el problema para que podamos resolverlo antes del próximo intento).

### ¿Cómo gestiona el bloqueo de sus direcciones IP? {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Monitoreamos rutinariamente todas las principales listas de denegación de DNS y si alguna de nuestras direcciones IP de intercambio de correo ("MX") figura en una lista de denegación importante, la retiraremos de la lista rotatoria de registros A de DNS relevante, si es posible, hasta que se resuelva el problema.

Al momento de escribir esto, también figuramos en varias listas de permitidos de DNS y nos tomamos muy en serio la supervisión de las listas de denegados. Si detecta algún problema antes de que podamos resolverlo, por favor, notifíquenoslo por escrito a <support@forwardemail.net>.

Nuestras direcciones IP están disponibles públicamente, [Consulte esta sección a continuación para obtener más información.](#what-are-your-servers-ip-addresses).

### ¿Qué son las direcciones de correos? {#what-are-postmaster-addresses}

Para evitar rebotes mal dirigidos y el envío de mensajes de respuesta automática a buzones de correo no monitoreados o inexistentes, mantenemos una lista de nombres de usuario similares a mailer-daemon:

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
* [y cualquier dirección de no respuesta](#what-are-no-reply-addresses)

Consulte [RFC 5320 Sección 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) para obtener más información sobre cómo se utilizan listas como estas para crear sistemas de correo electrónico eficientes.

### ¿Qué son las direcciones de no respuesta? {#what-are-no-reply-addresses}

Los nombres de usuario de correo electrónico que coincidan con cualquiera de los siguientes (sin distinguir entre mayúsculas y minúsculas) se consideran direcciones de no respuesta:

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

### ¿Tiene una lista de permitidos {#do-you-have-an-allowlist}?

Sí, tenemos un [lista de extensiones de nombres de dominio](#what-domain-name-extensions-are-allowlisted-by-default) que está en la lista de permitidos de manera predeterminada y una lista de permitidos dinámica, almacenada en caché y continua basada en [criterios estrictos](#what-is-your-allowlist-criteria).

Todos los correos electrónicos, dominios y destinatarios de los clientes con planes pagos se agregan automáticamente a nuestra lista de permitidos.

### ¿Qué extensiones de nombre de dominio están en la lista de permitidos de forma predeterminada? {#what-domain-name-extensions-are-allowlisted-by-default}

Las siguientes extensiones de nombre de dominio se consideran permitidas de manera predeterminada (independientemente de si están en la Lista de popularidad general o no):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">edu</code></li>
<li class="list-inline-item"><code class="notranslate">gov</code></li>
<li class="list-inline-item"><code class="notranslate">mil</code></li>
<li class="list-inline-item"><code class="notranslate">int</code></li>
<li class="list-inline-item"><code class="notranslate">arpa</code></li>
<li class="list-inline-item"><code class="notranslate">dni.us</code></li>
<li class="list-inline-item"><code class="notranslate">fed.us</code></li>
<li class="list-inline-item"><code isa.us
<li class="list-inline-item"><code class="notranslate">kids.us</code></li>
<li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
<li class="list-inline-item"><code class="notranslate">ak.us
<li class="list-inline-item"><code class="notranslate">al.us
<li class="list-inline-item"><code class="notranslate">ar.us
<li class="list-inline-item"><code class="notranslate">as.us
<li class="list-inline-item"><code class="notranslate">az.us
<li class="list-inline-item"><code <li class="notranslate">ca.us</li>
<li class="list-inline-item"><code class="notranslate">co.us</code></li>
<li class="list-inline-item"><code class="notranslate">ct.us</code></li>
<li class="list-inline-item"><code class="notranslate">dc.us</code></li>
<li class="list-inline-item"><code class="notranslate">de.us</code></li>
<li class="list-inline-item"><code class="notranslate">fl.us</code></li>
<li class="list-inline-item"><code class="notranslate">ga.us</code></li>
<li class="list-inline-item"><code class="notranslate">gu.us</code></li>
<li class="list-inline-item"><code <li class="notranslate">hi.us</code></li>
<li class="list-inline-item"><code class="notranslate">ia.us</code></li>
<li class="list-inline-item"><code class="notranslate">id.us</code></li>
<li class="list-inline-item"><code class="notranslate">il.us</code></li>
<li class="list-inline-item"><code class="notranslate">in.us</code></li>
<li class="list-inline-item"><code class="notranslate">ks.us</code></li>
<li class="list-inline-item"><code class="notranslate">ky.us</code></li>
<li class="list-inline-item"><code class="notranslate">la.us</code></li>
<li class="list-inline-item"><code <li class="notranslate">ma.us</code></li>
<li class="list-inline-item"><code class="notranslate">md.us</code></li>
<li class="list-inline-item"><code class="notranslate">me.us</code></li>
<li class="list-inline-item"><code class="notranslate">mi.us</code></li>
<li class="list-inline-item"><code class="notranslate">mn.us</code></li>
<li class="list-inline-item"><code class="notranslate">mo.us</code></li>
<li class="list-inline-item"><code class="notranslate">ms.us</code></li>
<li class="list-inline-item"><code class="notranslate">mt.us</code></li>
<li class="list-inline-item"><code nc.us

nd.us
ne.us
nh.us
nj.us
nm.us
nv.us
ny.us

nh.us <li class="notranslate">oh.us</code></li>
<li class="list-inline-item"><code class="notranslate">ok.us</code></li>
<li class="list-inline-item"><code class="notranslate">or.us</code></li>
<li class="list-inline-item"><code class="notranslate">pa.us</code></li>
<li class="list-inline-item"><code class="notranslate">pr.us</code></li>
<li class="list-inline-item"><code class="notranslate">ri.us</code></li>
<li class="list-inline-item"><code class="notranslate">sc.us</code></li>
<li class="list-inline-item"><code class="notranslate">sd.us</code></li>
<li class="list-inline-item"><code tn.us

tx.us
ut.us
va.us
vi.us
vt.us
wa.us
wi.us
wi.us wv.us

wy.us
mil.tt
edu.tt
edu.tr
edu.ua
edu.au
ac.at

ac.at <li class="notranslate">edu.br</li>
<li class="list-inline-item"><code class="notranslate">ac.nz</li>
<li class="list-inline-item"><code class="notranslate">school.nz</li>
<li class="list-inline-item"><code class="notranslate">cri.nz</li>
<li class="list-inline-item"><code class="notranslate">health.nz</li>
<li class="list-inline-item"><code class="notranslate">mil.nz</li>
<li class="list-inline-item"><code class="notranslate">parliament.nz</li>
<li class="list-inline-item"><code class="notranslate">ac.in</li>
<li class="list-inline-item"><code <li class="notranslate">edu.in</li>
<li class="list-inline-item"><code class="notranslate">mil.in</code></li>
<li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
<li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ac.za</code></li>
<li class="list-inline-item"><code class="notranslate">edu.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.za</code></li>
<li class="list-inline-item"><code <li>escuela.za</li>
<li>mil.kr</li>
<li>ac.kr</li>
<li>hs.kr</li>
<li>ms.kr</li>
<li>es.kr</li>
<li>sc.kr</li>
<li>kg.kr</li>
<li> <li>edu.es</li>
<li>ac.lk</li>
<li>sch.lk</li>
<li>edu.lk</li>
<li>ac.th</li>
<li>mi.th</li>
<li>admin.ch</li>
<li>canada.ca</li>
<li> gc.ca
go.id
go.jp
go.ke
go.kr
go.th
go.ar
go.cl
go.kr gob.es

gob.mx
gob.pe
gob.ve
gob.sv
gouv.fr
gouv.nc
gouv.nc gouv.qc.ca

gov.ad

gov.af

gov.ai

gov.al

gov.am

gov.ao

gov.au

gov.au gov.aw
<li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
<li class="list-inline-item"><code class="notranslate">gov.az</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.be</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
<li gov.by
<li gov.cl
<li gov.cn
<li gov.co
<li gov.cy
<li gov.cz
<li gov.dz
<li gov.eg
<li <li>gov.fi</li>
<li>gov.fk</li>
<li>gov.gg</li>
<li>gov.gr</li>
<li>gov.hk</li>
<li>gov.hr</li>
<li>gov.hu</li>
<li>gov.ie</li>
<li> gov.il

gov.im
gov.in
gov.iq
gov.ir
gov.it
gov.je
gov.kp

li gov.krd

gov.ky
gov.kz
gov.lb
gov.lk
gov.lt
gov.lt
gov.lv
gov.ma


<li>gob.mm</li>
<li>gob.mo</li>
<li>gob.mt</li>
<li>gob.my</li>
<li>gob.ng</li>
<li>gob.np</li>
<li>gob.ph</li>
<li>gob.pk</li>
<li> <li>gov.pl</li>
<li>gov.pt</li>
<li>gov.py</li>
<li>gov.ro</li>
<li>gov.ru</li>
<li>gov.scot</li>
<li>gov.se</li>
<li>gov.sg</li>
<li> gov.si

gov.sk
gov.tr
gov.tt
gov.tw
gov.ua
gov.uk
gov.vn

<code class="notranslate">gov.wales</code></li>
<li class="notranslate">gov.za</code></li>
<li class="notranslate">government.pn</code></li>
<li class="notranslate">govt.nz</code></li>
<!--<li class="notranslate">gub.uy</code></li>-->
<li class="notranslate">gv.at</code></li>
<li class="notranslate">ac.uk</code></li>
<li class="notranslate">government.pn</code></li>
<li class="notranslate">govt.nz</code></li> bl.uk

judiciary.uk
mod.uk
NHS.uk
parlamento.uk
policía.uk
rct.uk
real.uk

<li>class="list-inline-item"><code class="notranslate">sch.uk</code></li>
<li>class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

Además, estos [dominios de nivel superior de marca y corporativos](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) están permitidos de manera predeterminada (por ejemplo, `apple` para `applecard.apple` para los extractos bancarios de Apple Card):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code Accenture
<li class="list-inline-item"><code class="notranslate">aco</code></li>
<li class="list-inline-item"><code class="notranslate">aeg</code></li>
<li class="list-inline-item"><code class="notranslate">aetna</code></li>
<li class="list-inline-item"><code class="notranslate">afl</code></li>
<li class="list-inline-item"><code class="notranslate">agakhan</code></li>
<li class="list-inline-item"><code class="notranslate">aig</code></li>
<li class="list-inline-item"><code class="notranslate">aigo</code></li>
<li class="list-inline-item"><code Airbus

Airtel
Akdn
Alfaromeo
Alibaba
Alipay
Allfinanz
Allstate

Allstate Aliado

Alstom
Amazon
AmericanExpress
Amex
Amica
Android
Anz

Anz
Código AOL

Apple
Acuarela
Aramco
Audi
Auspost
Aws
Axa
Axa
Axa
Audi
Auspost
Auspost
Aws
Axa ... Azure

Baidu

BanaRepublic

Barclaycard

Barclays

Basketball

Bauhaus

BBC

Código Clase="notranslate">bbt</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">bbva</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">bcg</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">bentley</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">bharti</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">bing</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">blanco</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">bloomberg</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">BMS</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">BMW</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">BNL</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">BNP Paribas</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">Boehringer</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">Bond</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">Booking</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">Bosch</code></li>
<li Clase="list-inline-item"><code Bostik
Bradesco
Bridgestone
Brother
Bugatti
Cal
Calvinklein
Canon
Código Capitalone

Caravana

Cartier

CBA

CBN

CBRE

CBS

CERN

CBRE

CBS

CERN

CERN

CERN

CERN
CERN CFA

Chanel
Chase
Chance
Chrome
Chrysler
Cipriani
Cisco
Cisco Ciudadela

Citi
Citi
Citic
ClubMed
Comcast
Commbank
Cooperativa de Crédito
Corona

Courn Clase="notranslate">crs</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">csc</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">cuisinella</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">dabur</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">datsun</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">distribuidor</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">dell</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">deloitte</code></li>
<li Clase="list-inline-item"><code Delta
<li class="list-inline-item"><code class="notranslate">DHL</code></li>
<li class="list-inline-item"><code class="notranslate">Discover</code></li>
<li class="list-inline-item"><code class="notranslate">Dish</code></li>
<li class="list-inline-item"><code class="notranslate">DNP</code></li>
<li class="list-inline-item"><code class="notranslate">Dodge</code></li>
<li class="list-inline-item"><code class="notranslate">Dunlop</code></li>
<li class="list-inline-item"><code class="notranslate">Dupont</code></li>
<li class="list-inline-item"><code dvag

edeka
Emerck
Epson
Ericsson
Ericsson
Erni
Esurance
Etisalat
Etisalat Eurovisión

Everbank
Extraspace
Fage
Fairwinds
Agricultores
Fedex
Ferrari

Código Ferrero
<li>Fiat</li>
<li>Fidelity</li>
<li>Firestone</li>
<li>Firdale</li>
<li>Flickr</li>
<li>Flir</li>
<li>Flsmidth</li>
<li> Ford

Fox
Fresenius
Forex
Frogans
Frontier
Fujitsu
Fujixerox

Código Gallo

Gallup

Gap

Gbiz

Gea

Gente

Gente

Gente

Donación

Gente

Donación

Globo ... <li class="list-inline-item"><code class="notranslate">gmail</code></li>
<li class="list-inline-item"><code class="notranslate">gmo</code></li>
<li class="list-inline-item"><code class="notranslate">gmx</code></li>
<li class="list-inline-item"><code class="notranslate">godaddy</code></li>
<li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
<li class="list-inline-item"><code class="notranslate">goodyear</code></li>
<li class="list-inline-item"><code class="notranslate">goog</code></li>
<li class="list-inline-item"><code class="notranslate">google</code></li>
<li class="list-inline-item"><code Grainger
<li>Guardian</li>
<li>Gucci</li>
<li>HBO</li>
<li>HDFC</li>
<li>HDFC Bank</li>
<li>Hermes</li>
<li>Hisamitsu</li>
<li> Hitachi

HKT
Honda
Honeywell
Hotmail
HSBC
Hughes
Hyatt

Hyatt Hyundai

IBM
IEEE
IFM
IKANO
IMDB
Infiniti
Intel
Intel
Intel
Intuit

Ipiranga

Iselect
ITAU
ITV
Iveco
Jaguar

Java

Java

ITV
ITV
Iveco
Jaguar

Java

Java

Java

Iselect
Itaú
ITV
Iveco
Iveco
Jaguar
Iveco
Jaguar
Iva JCB

JCP
Jeep
JPMorgan
Juniper
KDDI
Hoteles Kerry
Logística Kerry

Logística Kerry Propiedades Kerry

KFH
Kia
Kinder
Komatsu
Komatsu
Kpmg
Kred
Kred
Komatsu
Komatsu Kuokgroup

Lacaixa
Ladbrokes
Lamborghini
Lancaster
Lancia
Lancia
Lancia
Lancia
Lancôme
Land Rover
Land Rover

Land Rover Lanxess

Lasalle
Latrobe
SUD
Leclerc
Lego
Enlace
Lexus
Lexus
Lexus Lidl

Estilo de vida
Lilly
Lincoln
Linde
Lipsy
Lipsy
Lixil
Locus

Lyxil
Locus Lotte

LPL

LPLfinancial

Lundbeck

Lupin

Macy's

Maif

Hombre

Lundbeck

Macy's

Maif

Hombre

Lundbeck

Lundbeck

Macy's

Macy's

Macy's

Maif

Hombre

Lundbeck

Macy's ... Mango

Marriott
Maserati
Mattel
McKinsey
MetLife
Microsoft
Mini
Code MIT
<li class="list-inline-item"><code class="notranslate">Mitsubishi</code></li>
<li class="list-inline-item"><code class="notranslate">MLB</code></li>
<li class="list-inline-item"><code class="notranslate">MMA</code></li>
<li class="list-inline-item"><code class="notranslate">Monash</code></li>
<li class="list-inline-item"><code class="notranslate">Mormón</code></li>
<li class="list-inline-item"><code class="notranslate">Moto</code></li>
<li class="list-inline-item"><code class="notranslate">Movistar</code></li>
<li class="list-inline-item"><code Clase="notranslate">msd</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">mtn</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">mtr</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">mutual</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">nadex</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">nationwide</code></li>
<li Clase="list-inline-item"><code Clase="notranslate">natura</code></ li>
<li class="list-inline-item"><code class="notranslate">NBA</code></li>
<li class="list-inline-item"><code class="notranslate">NEC</code></li>
<li class="list-inline-item"><code class="notranslate">Netflix</code></li>
<li class="list-inline-item"><code class="notranslate">Neustar</code></li>
<li class="list-inline-item"><code class="notranslate">Newholland</code></li>
<li class="list-inline-item"><code class="notranslate">NFL</code></li>
<li class="list-inline-item"><code class="notranslate">NHK</code></li>
<li class="list-inline-item"><code class="notranslate">Nico</code></li>
<li Nike

Nikon
Nissan
Nissay
Nokia
Nokia
Northwestern Mutual
Norton
NRA

Clase="List-inline-item"><code class="notranslate">ntt</code></li>
<li Clase="List-inline-item"><code class="notranslate">obi</code></li>
<li Clase="List-inline-item"><code class="notranslate">oficina</code></li>
<li Clase="List-inline-item"><code class="notranslate">omega</code></li>
<li Clase="List-inline-item"><code class="notranslate">oracle</code></li>
<li Clase="List-inline-item"><code class="notranslate">naranja</code></li>
<li Clase="List-inline-item"><code class="notranslate">otsuka</code></li>
<!--<li Clase="List-inline-item"><code class="notranslate">ovh</code></li>-->
<li Panasonic

PCCW
Pfizer
Philips
Piaget
Pictet
Ping
Pioner

<li>Jugar</li>
<li>PlayStation</li>
<li>Pohl</li>
<li>Política</li>
<li>Práctica</li>
<li>Producción</li>
<li>Progresivo</li>
<li>Pru</li>

<li>Pru</li> Prudential

PwC
Quest
QVC
Redstone
Reliance
Rexroth
Ricoh

Ricoh

Code <li class="notranslate">rmit</li>
<li class="list-inline-item"><code class="notranslate">rocher</li>
<li class="list-inline-item"><code class="notranslate">rogers</li>
<li class="list-inline-item"><code class="notranslate">rwe</li>
<li class="list-inline-item"><code class="notranslate">seguridad</li>
<li class="list-inline-item"><code class="notranslate">sakura</li>
<li class="list-inline-item"><code class="notranslate">samsung</li>
<li class="list-inline-item"><code class="notranslate">sandvik</li>
<li class="list-inline-item"><code Sandvikcoromant
<li class="list-inline-item"><code class="notranslate">Sanofi</code></li>
<li class="list-inline-item"><code class="notranslate">SAP</code></li>
<li class="list-inline-item"><code class="notranslate">Saxo</code></li>
<li class="list-inline-item"><code class="notranslate">SBI</code></li>
<!--<li class="list-inline-item"><code class="notranslate">SBS</code></li>-->
<li class="list-inline-item"><code class="notranslate">SCA</code></li>
<li class="list-inline-item"><code class="notranslate">SCB</code></li>
<li class="list-inline-item"><code <li class="notranslate">Schaeffler</code></li>
<li class="list-inline-item"><code class="notranslate">Schmidt</code></li>
<li class="list-inline-item"><code class="notranslate">Schwarz</code></li>
<li class="list-inline-item"><code class="notranslate">ScJohnson</code></li>
<li class="list-inline-item"><code class="notranslate">Scor</code></li>
<li class="list-inline-item"><code class="notranslate">Seat</code></li>
<li class="list-inline-item"><code class="notranslate">Sener</code></li>
<li class="list-inline-item"><code class="notranslate">Ses</code></li>
<li class="list-inline-item"><code <li class="notranslate">coser</li>
<li class="list-inline-item"><code class="notranslate">siete</li>
<li class="list-inline-item"><code class="notranslate">sfr</li>
<li class="list-inline-item"><code class="notranslate">buscar</li>
<li class="list-inline-item"><code class="notranslate">Shangrila</li>
<li class="list-inline-item"><code class="notranslate">afilado</li>
<li class="list-inline-item"><code class="notranslate">shaw</li>
<li class="list-inline-item"><code class="notranslate">concha</li>
<li class="list-inline-item"><code Clase ="notranslate">Shriram</code></li>
<li Clase ="list-inline-item"><code Clase ="notranslate">Sina</code></li>
<li Clase ="list-inline-item"><code Clase ="notranslate">Cielo</code></li>
<li Clase ="list-inline-item"><code Clase ="notranslate">Skype</code></li>
<li Clase ="list-inline-item"><code Clase ="notranslate">Inteligente</code></li>
<li Clase ="list-inline-item"><code Clase ="notranslate">SNCF</code></li>
<li Clase ="list-inline-item"><code Clase ="notranslate">Softbank</code></li>
<li Clase ="list-inline-item"><code Clase ="notranslate">Sohu</code></li>
<li Clase ="list-inline-item"><code Sony

Spiegel

Stada
Staples

Star

Star

Starhub

Statebank

Statefarm


Statefarm Statoil

STC

STC

STC

Grupo
Suzuki

Swatch

Swiftcover

Symantec

Taobao

Taobao Target

Tatamotors
Tdk
Telecity
Telefónica
Telefónica
Temasek
Teva
Tiffany

Tiffany TJX

Toray
Toshiba
Total
Total
Toyota
TravelChannel
Viajeros
Tui

Código Televisores

UBS
Unicom
UOL
UPS
Vanguard
Verisign
Vig ... Viking

Virgin
Visa
Vista
Vistaprint
Vivo
Volkswagen
Volvo
Volvo

Código Walmart

Walter
Weather Channel
Weir Weir
Williamhill
Windows
WME
WME Wolterskluwer

Woodside
WTC
Xbox
Xerox
Xfinity
Yahoo
Yamaxun

Yamaxun Yandex

Yodobashi
YouTube
Zappos
Zara
Zappo

Zippo

</ul>

A partir del 18 de marzo de 2025, también hemos añadido estos territorios franceses de ultramar a esta lista ([según esta solicitud de GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">bzh</code></li>
<li class="list-inline-item"><code class="notranslate">gf</code></li>
<li class="list-inline-item"><code class="notranslate">gp</code></li>
<li class="list-inline-item"><code class="notranslate">mq</code></li>
<li class="list-inline-item"><code class="notranslate">nc</code></li>
<li class="list-inline-item"><code class="notranslate">pf</code></li>
<li class="list-inline-item"><code class="notranslate">pm</code></li>
<li class="list-inline-item"><code class="notranslate">re</code></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">tf</código></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">wf</código></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">yt</código></li>
</ul>

A partir del 8 de julio de 2025, hemos agregado estos países específicos de Europa:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ax</code></li>
<li class="list-inline-item"><code class="notranslate">bg</code></li>
<li class="list-inline-item"><code class="notranslate">fo</code></li>
<li class="list-inline-item"><code class="notranslate">gi</code></li>
<li class="list-inline-item"><code class="notranslate">gr</code></li>
<li class="list-inline-item"><code class="notranslate">hr</code></li>
<li class="list-inline-item"><code class="notranslate">hu</code></li>
<li class="list-inline-item"><code class="notranslate">lt</code></li>
<li Clase="elemento-en-línea"><código de clase="notranslate">lu</código></li>
<li Clase="elemento-en-línea"><código de clase="notranslate">mc</código></li>
<li Clase="elemento-en-línea"><código de clase="notranslate">mk</código></li>
<li Clase="elemento-en-línea"><código de clase="notranslate">mt</código></li>
<li Clase="elemento-en-línea"><código de clase="notranslate">ro</código></li>
<li Clase="elemento-en-línea"><código de clase="notranslate">sk</código></li>
<li Clase="elemento-en-línea"><código de clase="notranslate">va</código></li>
</ul>

Específicamente no incluimos `cz`, `ru` y `ua` debido a la alta actividad de spam.

### ¿Cuáles son sus criterios de lista blanca? {#what-is-your-allowlist-criteria}

Tenemos una lista estática de [extensiones de nombre de dominio permitidas de forma predeterminada](#what-domain-name-extensions-are-allowlisted-by-default) y también mantenemos una lista de permitidos dinámica, almacenada en caché y continua basada en los siguientes criterios estrictos:

* El dominio raíz del remitente debe ser [extensión de nombre de dominio que coincida con la lista que ofrecemos en nuestro plan gratuito](#what-domain-name-extensions-can-be-used-for-free) (con la adición de `biz` y `info`). También incluimos coincidencias parciales de `edu`, `gov` y `mil`, como `xyz.gov.au` y `xyz.edu.au`.
* El dominio raíz del remitente debe estar entre los 100 000 dominios raíz únicos analizados más importantes de [Lista de popularidad de paraguas](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL"). * El dominio raíz del remitente debe estar entre los 50 000 resultados principales de dominios raíz únicos que hayan aparecido en al menos 4 de los últimos 7 días de UPL (~50 %).
* El dominio raíz del remitente no debe estar clasificado como contenido para adultos ni malware por Cloudflare.
* El dominio raíz del remitente debe tener registros A o MX.
* El dominio raíz del remitente debe tener registros A, MX, un registro DMARC con `p=reject` o `p=quarantine`, o un registro SPF con el calificador `-all` o `~all`.

Si se cumple este criterio, el dominio raíz del remitente se almacenará en caché durante 7 días. Tenga en cuenta que nuestro trabajo automatizado se ejecuta a diario; por lo tanto, se trata de una caché de lista blanca continua que se actualiza diariamente.

Nuestro trabajo automatizado descargará los últimos 7 días de UPL en memoria, los descomprimirá y luego analizará en memoria de acuerdo con los estrictos criterios anteriores.

Los dominios populares en el momento de escribir este artículo, como Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify y más, están incluidos, por supuesto.

Si no está en nuestra lista de permitidos, la primera vez que su dominio raíz FQDN o dirección IP envíe un correo electrónico, se le asignarán los códigos [tasa limitada](#do-you-have-rate-limiting) y [en la lista gris](#do-you-have-a-greylist). Tenga en cuenta que esta es una práctica estándar de correo electrónico. La mayoría de los clientes de servidores de correo electrónico intentarán reintentar el envío si reciben un error de límite de velocidad o de lista gris (por ejemplo, un código de estado de error de nivel 421 o 4xx).

**Tenga en cuenta que remitentes específicos como `a@gmail.com`, `b@xyz.edu` y `c@gov.au` aún pueden ser [en la lista negra](#do-you-have-a-denylist)** (por ejemplo, si detectamos automáticamente spam, phishing o malware de esos remitentes).

### ¿Qué extensiones de nombre de dominio se pueden utilizar de forma gratuita? {#what-domain-name-extensions-can-be-used-for-free}

A partir del 31 de marzo de 2023, aplicamos una nueva regla general contra spam para proteger a nuestros usuarios y nuestro servicio.

Esta nueva regla solo permite el uso de las siguientes extensiones de nombre de dominio en nuestro plan gratuito:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li <clase="list-inline-item"><code class="notranslate">at</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">by</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
<li class="list-inline-item"><code clase="notranslate">cd</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">ch</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">ck</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">co</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">com</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">de</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">dev</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">dj</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">dk</code></li>
<li Clase="List-inline-item"><código de clase="notranslate">ee</código></li>
<li Clase="List-inline-item"><código de clase="notranslate">es</código></li>
<li Clase="List-inline-item"><código de clase="notranslate">eu</código></li>
<li Clase="List-inline-item"><código de clase="notranslate">family</código></li>
<li Clase="List-inline-item"><código de clase="notranslate">fi</código></li>
<li Clase="List-inline-item"><código de clase="notranslate">fm</código></li>
<li Clase="List-inline-item"><código de clase="notranslate">fr</código></li>
<li Clase="List-inline-item"><código de clase="notranslate">gg</código></li>
<li Clase="List-inline-item"><código clase="notranslate">gl</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">id</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">ie</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">il</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">im</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">in</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">io</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">ir</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">is</code></li>
<li <li>eso</li>
<li>je</li>
<li>jp</li>
<li>ke</li>
<li>kr</li>
<li>la</li>
<li>li</li>
<li>lv</li>
<li>lv</li> clase="notranslate">mente</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">md</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">yo</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">mn</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">ms</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">mu</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">mx</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">net</code></li>
<li clase="lista-en-línea-ítem"><code clase="notranslate">ni</code></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">nl</código></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">no</código></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">nu</código></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">nz</código></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">org</código></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">pl</código></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">pr</código></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">pt</código></li>
<li clase="lista-elemento-en-línea"><código clase="notranslate">pw</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">rs</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">sc</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">se</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">sh</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">si</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">sm</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">sr</code></li>
<li clase="lista-elemento-en-línea"><code clase="notranslate">st</code></li>
<li <li>tc</li>
<li>tm</li>
<li>a</li>
<li>tv</li>
<li>reino unido</li>
<li>ee.uu.</li>
<li>uz</li>
<li>vc</li>
<li> vg
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### ¿Tiene una lista gris {#do-you-have-a-greylist}?

Sí, utilizamos una política muy laxa ([listas grises de correo electrónico](https://en.wikipedia.org/wiki/Greylisting_\(email\)). La inclusión en listas grises solo aplica a remitentes que no están en nuestra lista de permitidos y permanece en nuestra caché durante 30 días.

Para cada remitente nuevo, almacenamos una clave en nuestra base de datos de Redis durante 30 días con un valor establecido en la hora de llegada inicial de su primera solicitud. Posteriormente, rechazamos su correo electrónico con un código de estado de reintento de 450 y solo lo permitimos pasar después de 5 minutos.

Si han esperado con éxito 5 minutos desde esta hora de llegada inicial, se aceptarán sus correos electrónicos y no recibirán este código de estado 450.

La clave consiste en el dominio raíz FQDN o la dirección IP del remitente. Esto significa que cualquier subdominio que pase la lista gris también pasará por el dominio raíz, y viceversa (esto es lo que llamamos una política "muy laxa").

Por ejemplo, si un correo electrónico proviene de `test.example.com` antes de que veamos uno de `example.com`, cualquier correo electrónico de `test.example.com` o `example.com` tendrá que esperar 5 minutos desde la hora de llegada inicial de la conexión. No hacemos que `test.example.com` ni `example.com` esperen cada uno sus propios periodos de 5 minutos (nuestra política de listas grises se aplica al dominio raíz).

Tenga en cuenta que la lista gris no se aplica a ningún remitente en nuestro [lista de permitidos](#do-you-have-an-allowlist) (por ejemplo, Meta, Amazon, Netflix, Google, Microsoft al momento de escribir este artículo).

### ¿Tiene una lista de denegados {#do-you-have-a-denylist}?

Sí, operamos nuestra propia lista de rechazados y la actualizamos automáticamente en tiempo real y manualmente en función del spam y la actividad maliciosa detectada.

También extraemos todas las direcciones IP de la lista de denegados de nivel 1 de UCEPROTECT en <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> cada hora y las introducimos en nuestra lista de denegados con un vencimiento de 7 días.

Los remitentes que se encuentren en la lista de rechazados recibirán un código de error 421 (indica al remitente que debe volver a intentarlo más tarde) si [no están en la lista de permitidos](#do-you-have-an-allowlist).

Al utilizar un código de estado 421 en lugar de un código de estado 554, se pueden reducir los posibles falsos positivos en tiempo real y luego el mensaje se puede entregar con éxito en el próximo intento.

**Este método está diseñado a diferencia de otros servicios de correo**, donde si se le incluye en una lista negra, se produce un fallo grave y permanente. A menudo es difícil pedir a los remitentes que vuelvan a intentar enviar los mensajes (especialmente de grandes organizaciones), por lo que este enfoque da aproximadamente 5 días desde el primer intento de correo electrónico para que el remitente, el destinatario o nosotros intervengamos y solucionemos el problema (solicitando la eliminación de la lista negra).

Los administradores monitorean en tiempo real todas las solicitudes de eliminación de listas de bloqueados (por ejemplo, para que los administradores puedan incluir en la lista de permitidos de forma permanente los falsos positivos recurrentes).

Las solicitudes de eliminación de la lista de bloqueados se pueden realizar en <https://forwardemail.net/denylist>. Los usuarios pagos tienen sus solicitudes de eliminación de la lista de bloqueados procesadas instantáneamente, mientras que los usuarios no pagos deben esperar a que los administradores procesen su solicitud.

Los remitentes que se detecte que envían spam o contenido viral se agregarán a la lista de bloqueados mediante el siguiente enfoque:

1. El enlace [huella digital del mensaje inicial](#how-do-you-determine-an-email-fingerprint) se incluye en la lista gris al detectar spam o lista negra de un remitente de confianza (p. ej., `gmail.com`, `microsoft.com`, `apple.com`).
* Si el remitente estaba en la lista blanca, el mensaje se incluye en la lista gris durante 1 hora.
* Si el remitente no está en la lista blanca, el mensaje se incluye en la lista gris durante 6 horas.
2. Analizamos las claves de la lista negra a partir de la información del remitente y del mensaje, y para cada una de estas claves creamos un contador (si no existe uno ya), lo incrementamos en 1 y lo almacenamos en caché durante 24 horas. * Para remitentes incluidos en la lista de permitidos:
* Agregue una clave para la dirección de correo electrónico "MAIL FROM" del sobre si tenía SPF válido o no, y no era [un nombre de usuario de administrador de correos](#what-are-postmaster-addresses) ni [un nombre de usuario que no responde](#what-are-no-reply-addresses).
* Si el encabezado "De" estaba en la lista de permitidos, agregue una clave para la dirección de correo electrónico del encabezado "De" si tenía SPF válido o DKIM válido y alineado.
* Si el encabezado "De" no estaba en la lista de permitidos, agregue una clave para la dirección de correo electrónico del encabezado "De" y su nombre de dominio raíz analizado.
* Para remitentes no incluidos en la lista de permitidos:
* Agregue una clave para la dirección de correo electrónico "MAIL FROM" del sobre si tenía SPF válido.
* Si el encabezado "De" estaba en la lista de permitidos, agregue una clave para la dirección de correo electrónico del encabezado "De" si tenía SPF válido o DKIM válido y alineado. * Si el encabezado "De" no está en la lista de permitidos, agregue una clave para la dirección de correo electrónico del encabezado "De" y su nombre de dominio raíz analizado.
* Agregue una clave para la dirección IP remota del remitente.
* Agregue una clave para el nombre de host resuelto por el cliente mediante búsqueda inversa a partir de la dirección IP del remitente (si corresponde).
* Agregue una clave para el dominio raíz del nombre de host resuelto por el cliente (si corresponde y si es diferente al nombre de host resuelto por el cliente).

3. Si el contador llega a 5 para un remitente y una clave no incluidos en la lista de permitidos, la rechazamos durante 30 días y enviamos un correo electrónico a nuestro equipo de control de abusos. Estos números pueden cambiar y las actualizaciones se verán reflejadas aquí a medida que monitoreamos el abuso.

4. Si el contador llega a 10 para un remitente y una clave incluidos en la lista de permitidos, la rechazamos durante 7 días y enviamos un correo electrónico a nuestro equipo de control de abusos. Estos números pueden cambiar y las actualizaciones se verán reflejadas aquí a medida que monitoreamos el abuso.

**NOTA:** Próximamente, implementaremos la monitorización de reputación. Esta monitorización calculará cuándo rechazar a un remitente según un porcentaje (en lugar de un contador rudimentario como el mencionado anteriormente).

### ¿Tiene limitación de velocidad {#do-you-have-rate-limiting}

La limitación de la velocidad del remitente se realiza mediante el dominio raíz analizado a partir de una búsqueda PTR inversa de la dirección IP del remitente; si esto no arroja ningún resultado, simplemente se utiliza la dirección IP del remitente. Tenga en cuenta que a continuación nos referimos a esto como `Sender`.

Nuestros servidores MX tienen límites diarios para el correo entrante recibido para [almacenamiento IMAP cifrado](/blog/docs/best-quantum-safe-encrypted-email-service):

* En lugar de limitar la velocidad del correo entrante recibido por cada alias (p. ej., `you@yourdomain.com`), limitamos la velocidad según el nombre de dominio del alias (p. ej., `yourdomain.com`). Esto evita que `Senders` sature las bandejas de entrada de todos los alias de su dominio a la vez.
* Tenemos límites generales que se aplican a todos los `Senders` de nuestro servicio, independientemente del destinatario:
* Los `Senders` que consideramos confiables como fuente de información veraz (p. ej., `gmail.com`, `microsoft.com`, `apple.com`) tienen un límite de envío de 100 GB al día. * Los `Senders` que son [en la lista de permitidos](#do-you-have-an-allowlist) tienen un límite de envío de 10 GB al día.
* Todos los demás `Senders` tienen un límite de envío de 1 GB o 1000 mensajes al día.
* Tenemos un límite específico para `Sender` y `yourdomain.com` de 1 GB o 1000 mensajes al día.

Los servidores MX también limitan los mensajes que se reenvían a uno o más destinatarios mediante la limitación de velocidad, pero esto solo se aplica a `Senders`, no a [lista de permitidos](#do-you-have-an-allowlist):

* Solo permitimos hasta 100 conexiones por hora, por dominio raíz FQDN resuelto `Sender` o dirección IP remota `Sender` (si no hay PTR inverso disponible) y por destinatario del sobre. Almacenamos la clave para limitar la velocidad como un hash criptográfico en nuestra base de datos de Redis.

* Si envía correo electrónico a través de nuestro sistema, asegúrese de tener configurado un PTR inverso para todas sus direcciones IP (de lo contrario, cada dominio raíz FQDN o dirección IP única desde la que envíe tendrá una velocidad limitada).

* Tenga en cuenta que si envía a través de un sistema popular como Amazon SES, no tendrá límite de velocidad ya que (al momento de escribir este artículo) Amazon SES figura en nuestra lista de permitidos.

* Si envía desde un dominio como `test.abc.123.example.com`, el límite de velocidad se aplicará a `example.com`. Muchos spammers usan cientos de subdominios para sortear los filtros de spam comunes, que solo limitan la velocidad de nombres de host únicos, en lugar de dominios raíz FQDN únicos.

* `Senders` que excedan el límite de velocidad serán rechazados con un error 421.

Nuestros servidores IMAP y SMTP limitan que sus alias tengan más de `60` conexiones simultáneas a la vez.

Nuestros servidores MX limitan a los remitentes de [no incluido en la lista de permitidos](#do-you-have-an-allowlist) a establecer más de 10 conexiones simultáneas (con un vencimiento de caché de 3 minutos para el contador, que refleja nuestro tiempo de espera de socket de 3 minutos).

### ¿Cómo se protege contra la retrodispersión? {#how-do-you-protect-against-backscatter}

Los rebotes mal dirigidos o spam rebotado (conocidos como "[Retrodispersión](https://en.wikipedia.org/wiki/Backscatter_\(email\))") pueden causar una reputación negativa en las direcciones IP del remitente.

Tomamos dos medidas para protegernos contra la retrodispersión, que se detallan en las siguientes secciones [Evitar rebotes de correos spam conocidos](#prevent-bounces-from-known-mail-from-spammers) y [Evite rebotes innecesarios para protegerse contra la retrodispersión](#prevent-unnecessary-bounces-to-protect-against-backscatter) a continuación.

### Evitar rebotes de correos de spammers conocidos {#prevent-bounces-from-known-mail-from-spammers}

Extraemos la lista de [Backscatter.org](https://www.backscatterer.org/) (desarrollado por [UCEPROTECT](https://www.uceprotect.net/)) en <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> cada hora y la ingresamos en nuestra base de datos Redis (también comparamos la diferencia de antemano; en caso de que se hayan eliminado direcciones IP que deban respetarse).

Si el MAIL FROM está en blanco O es igual a (sin distinguir entre mayúsculas y minúsculas) cualquiera de los [direcciones de correos](#what-are-postmaster-addresses) (la parte antes del @ en un correo electrónico), entonces verificamos si la IP del remitente coincide con una de esta lista.

Si la IP del remitente está en la lista (y no en nuestro [lista de permitidos](#do-you-have-an-allowlist)), enviamos un error 554 con el mensaje `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Recibiremos una alerta si un remitente está en la lista de retrodispersión y en nuestra lista de permitidos para que podamos resolver el problema si es necesario.

Las técnicas descritas en esta sección se adhieren a la recomendación del "MODO SEGURO" en <https://www.backscatterer.org/?target=usage>, donde solo verificamos la IP del remitente si ya se han cumplido ciertas condiciones.

### Evita rebotes innecesarios para proteger contra la retrodispersión {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Los rebotes son correos electrónicos que indican que el reenvío del correo electrónico al destinatario falló por completo y no se volverá a intentar enviar el correo electrónico.

Un motivo común para aparecer en la lista de Backscatterer son los rebotes mal dirigidos o el spam rebotado, por lo que debemos protegernos contra esto de algunas maneras:

1. Solo enviamos cuando ocurren errores de código de estado >= 500 (cuando los correos electrónicos que se intentaron reenviar fallaron, por ejemplo, Gmail responde con un error de nivel 500).

2. Solo enviamos una vez (utilizamos una clave de huella de rebote calculada y la almacenamos en caché para evitar el envío de duplicados). La huella de rebote es una clave que representa la huella del mensaje combinada con un hash de la dirección de rebote y su código de error. Consulta la sección sobre [Toma de huellas dactilares](#how-do-you-determine-an-email-fingerprint) para obtener más información sobre cómo se calcula la huella del mensaje. Las huellas de rebote enviadas correctamente expirarán después de 7 días en nuestra caché de Redis.

3. Solo enviamos cuando el MAIL FROM y/o From no está en blanco y no contiene (sin distinguir entre mayúsculas y minúsculas) un [nombre de usuario del administrador de correos](#what-are-postmaster-addresses) (la parte antes del @ en un correo electrónico).

4. No enviamos si el mensaje original tenía alguno de los siguientes encabezados (sin distinguir entre mayúsculas y minúsculas):

* Encabezado de `auto-submitted` con un valor distinto de `no`. * Encabezado de `x-auto-response-suppress` con un valor de `dr`, `autoreply`, `auto-reply`, `auto_reply` o `all`
* Encabezado de `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive` `x-autoreply`, `x-autorespond` o `x-auto-respond` (independientemente del valor).
* Encabezado de `precedence` con un valor de `bulk`, `autoreply`, `auto-reply`, `auto_reply` o `list`.

5. No enviamos si la dirección de correo electrónico MAIL FROM o From termina con `+donotreply`, `-donotreply`, `+noreply` o `-noreply`.

6. No enviamos si la parte del nombre de usuario de la dirección de correo electrónico De era `mdaemon` y tenía un encabezado que no distingue entre mayúsculas y minúsculas de `X-MDDSN-Message`.

7. No enviamos si había un encabezado `content-type` que no distingue entre mayúsculas y minúsculas o `multipart/report`.

### ¿Cómo se determina una huella digital de correo electrónico? {#how-do-you-determine-an-email-fingerprint}

La huella digital de un correo electrónico se utiliza para determinar la singularidad de un correo electrónico y para evitar que se entreguen mensajes duplicados y que se envíen [rebotes duplicados](#prevent-unnecessary-bounces-to-protect-against-backscatter).

La huella dactilar se calcula a partir de la siguiente lista:

* Nombre de host o dirección IP FQDN resuelto por el cliente
* Valor del encabezado `Message-ID` (si lo hay)
* Valor del encabezado `Date` (si lo hay)
* Valor del encabezado `From` (si lo hay)
* Valor del encabezado `To` (si lo hay)
* Valor del encabezado `Cc` (si lo hay)
* Valor del encabezado `Subject` (si lo hay)
* Valor del encabezado `Body` (si lo hay)

### ¿Puedo reenviar correos electrónicos a puertos distintos del 25 (por ejemplo, si mi ISP ha bloqueado el puerto 25)? {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Sí, a partir del 5 de mayo de 2020, añadimos esta función. Actualmente, es específica del dominio, no del alias. Si necesita que sea específica del alias, contáctenos para informarnos de sus necesidades.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Protección de Privacidad Mejorada:
</strong>
<span>
Si tiene un plan de pago (que incluye protección de privacidad mejorada), vaya a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi Cuenta <i class="fa fa-angle-right"></i> Dominios</a>, haga clic en "Configuración" junto a su dominio y luego en "Configuración". Si desea obtener más información sobre los planes de pago, consulte nuestra página de <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Precios</a>. De lo contrario, puede seguir las instrucciones a continuación.
</span>
</div>

Si está en el plan gratuito, simplemente agregue un nuevo registro DNS <strong class="notranslate">TXT</strong> como se muestra a continuación, pero cambie el puerto de 25 al puerto que elija.

Por ejemplo, si quiero que todos los correos electrónicos que van a `example.com` se reenvíen al puerto SMTP 1337 de los destinatarios alias en lugar del 25:

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
<td><code>forward-email-port=1337</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
La situación más común para la configuración de reenvío de puertos personalizado es cuando se desea reenviar todos los correos electrónicos que van a ejemplo.com a un puerto diferente en ejemplo.com, distinto del estándar SMTP 25. Para configurarlo, simplemente agregue el siguiente registro general <strong class="notranslate">TXT</strong>.
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
<td><em>"@", ".", o en blanco</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### ¿Admite el símbolo más + para los alias de Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

Sí, absolutamente.

### ¿Admite subdominios {#does-it-support-sub-domains}?

Sí, por supuesto. En lugar de usar "@", "." o dejar un espacio en blanco como nombre/host/alias, simplemente use el nombre del subdominio como valor.

Si desea que `foo.example.com` reenvíe correos electrónicos, ingrese `foo` como valor de nombre/host/alias en su configuración de DNS (para registros MX y <strong class="notranslate">TXT</strong>).

### ¿Esto reenvía los encabezados de mi correo electrónico? {#does-this-forward-my-emails-headers}

Sí, absolutamente.

### ¿Está bien probado? {#is-this-well-tested}

Sí, tiene pruebas escritas con [ava](https://github.com/avajs/ava) y también tiene cobertura de código.

### ¿Transmite mensajes y códigos de respuesta SMTP? {#do-you-pass-along-smtp-response-messages-and-codes}

Sí, por supuesto. Por ejemplo, si envía un correo electrónico a `hello@example.com` y está registrado para reenviarse a `user@gmail.com`, se devolverá el mensaje de respuesta SMTP y el código del servidor SMTP "gmail.com" en lugar del servidor proxy en "mx1.forwardemail.net" o "mx2.forwardemail.net".

### ¿Cómo evitar a los spammers y garantizar una buena reputación de reenvío de correo electrónico? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Consulte nuestras secciones sobre [¿Cómo funciona su sistema de reenvío de correo electrónico?](#how-does-your-email-forwarding-system-work), [¿Cómo gestiona los problemas de entrega de correo electrónico?](#how-do-you-handle-email-delivery-issues) y [¿Cómo gestionas el bloqueo de tus direcciones IP?](#how-do-you-handle-your-ip-addresses-becoming-blocked) más arriba.

### ¿Cómo se realizan búsquedas DNS en nombres de dominio {#how-do-you-perform-dns-lookups-on-domain-names}?

Creamos un proyecto de software de código abierto :tangerine: [Mandarina](https://github.com/forwardemail/tangerine) y lo usamos para búsquedas DNS. Los servidores DNS predeterminados son `1.1.1.1` y `1.0.0.1`, y las consultas DNS se realizan a través de [DNS sobre HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") en la capa de aplicación.

:tangerine: [Mandarina](https://github.com/tangerine) utiliza [el servicio DNS de consumidor de privacidad prioritaria de CloudFlare de manera predeterminada][cloudflare-dns].

## Cuenta y facturación {#account-and-billing}

### ¿Ofrecen una garantía de devolución de dinero en los planes pagos? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

¡Sí! Los reembolsos automáticos se aplican al actualizar, reducir o cancelar su cuenta dentro de los 30 días posteriores al inicio de su plan. Esto solo aplica para nuevos clientes.

### Si cambio de plan, ¿me prorratean y me reembolsan la diferencia? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

No prorrateamos ni reembolsamos la diferencia al cambiar de plan. En su lugar, convertimos la duración restante de la fecha de vencimiento de su plan actual a la duración relativa más cercana de su nuevo plan (redondeando al mes inferior).

Tenga en cuenta que si actualiza o degrada un plan pago dentro de un período de 30 días desde que inició un plan pago, le reembolsaremos automáticamente el monto total de su plan actual.

### ¿Puedo usar este servicio de reenvío de correo electrónico como un servidor MX "de respaldo" o "de reemplazo"? {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

No, no se recomienda, ya que solo se puede usar un servidor de intercambio de correo a la vez. Normalmente, las opciones de respaldo nunca se reintentan debido a configuraciones de prioridad incorrectas y a que los servidores de correo no respetan la verificación de prioridad de intercambio MX.

### ¿Puedo desactivar alias específicos? {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Si tienes un plan de pago, debes ir a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Editar alias <i class="fa fa-angle-right"></i> Desmarcar la casilla "Activo" <i class="fa fa-angle-right"></i> Continuar.
</span>
</div>

Sí, simplemente edite su registro DNS <strong class="notranslate">TXT</strong> y anteponga al alias uno, dos o tres signos de exclamación (ver a continuación).

Tenga en cuenta que *debe* conservar la asignación ":", ya que esto es necesario si alguna vez decide desactivar esta opción (y también se utiliza para importar si actualiza a uno de nuestros planes pagos).

**Para un rechazo silencioso (al remitente le parece que el mensaje se envió correctamente, pero en realidad no llega a ninguna parte) (código de estado `250`):** Si antepone un alias con "!" (un signo de exclamación simple), devolverá un código de estado exitoso de `250` a los remitentes que intenten enviar a esta dirección, pero los correos electrónicos en sí no llegarán a ninguna parte (por ejemplo, un agujero negro o `/dev/null`).

**Para rechazo suave (código de estado `421`):** Si antepone un alias con "!!" (doble signo de exclamación), devolverá un código de estado de error suave de `421` a los remitentes que intenten enviar a esta dirección y, a menudo, los correos electrónicos se volverán a intentar hasta 5 días antes del rechazo y el rebote.

**Para rechazo total (código de estado `550`):** Si antepone "!!!" (triple signo de exclamación) a un alias, devolverá un código de estado de error permanente `550` a los remitentes que intenten enviar a esta dirección y los correos electrónicos serán rechazados y rebotarán.

Por ejemplo, si quiero que todos los correos electrónicos que van a `alias@example.com` dejen de fluir a `user@gmail.com` y sean rechazados y reboten (por ejemplo, use tres signos de exclamación):

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
También puede reescribir la dirección del destinatario reenviado simplemente como "nobody@forwardemail.net", lo que lo redirigirá a nadie, como en el ejemplo a continuación.
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
Si desea mayor seguridad, también puede eliminar la parte ":user@gmail.com" (o ":nobody@forwardemail.net") y dejar solo "!!!alias", como en el ejemplo a continuación.
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

### ¿Puedo reenviar correos electrónicos a varios destinatarios? {#can-i-forward-emails-to-multiple-recipients}

Sí, por supuesto. Solo especifica varios destinatarios en tus registros <strong class="notranslate">TXT</strong>.

Por ejemplo, si quiero que un correo electrónico que va a `hello@example.com` se reenvíe a `user+a@gmail.com` y `user+b@gmail.com`, entonces mi registro <strong class="notranslate">TXT</strong> se vería así:

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

O bien, puede especificarlos en dos líneas separadas, como esta:

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
<td clase="notranslate">TXT</td>
<td><code>reenvío-correo-electrónico=hola:usuario+b@gmail.com</code></td>
</tr>
</tbody>
</table>

¡Tu decides!

### ¿Puedo tener varios destinatarios globales de captura general? {#can-i-have-multiple-global-catch-all-recipients}

Sí, puedes. Simplemente especifica varios destinatarios globales en tus registros <strong class="notranslate">TXT</strong>.

Por ejemplo, si quiero que todos los correos electrónicos que van a `*@example.com` (el asterisco significa que es un comodín, también conocido como catch-all) se reenvíen a `user+a@gmail.com` y `user+b@gmail.com`, entonces mi registro <strong class="notranslate">TXT</strong> se vería así:

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
<td><code>forward-email=usuario+a@gmail.com,usuario+b@gmail.com</code></td>
</tr>
</tbody>
</table>

O bien, puede especificarlos en dos líneas separadas, como esta:

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
<td clase="notranslate">TXT</td>
<td><code>reenvío-correo-email=usuario+b@gmail.com</code></td>
</tr>
</tbody>
</table>

¡Tu decides!

### ¿Existe un límite máximo en la cantidad de direcciones de correo electrónico a las que puedo reenviar por alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}?

Sí, el límite predeterminado es 10. Esto NO significa que solo pueda tener 10 alias en su nombre de dominio. Puede tener tantos alias como desee (cantidad ilimitada). Significa que solo puede reenviar un alias a 10 direcciones de correo electrónico únicas. Podría tener `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (del 1 al 10); y cualquier correo dirigido a `hello@example.com` se reenviaría a `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (del 1 al 10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Consejo:
</strong>
<span>
¿Necesita más de 10 destinatarios por alias? Envíenos un correo electrónico y con gusto aumentaremos el límite de su cuenta.
</span>
</div>

### ¿Puedo reenviar correos electrónicos de forma recursiva? {#can-i-recursively-forward-emails}

Sí, puedes, pero debes respetar el límite máximo. Si tienes `hello:linus@example.com` y `linus:user@gmail.com`, los correos dirigidos a `hello@example.com` se reenviarán a `linus@example.com` y `user@gmail.com`. Ten en cuenta que se generará un error si intentas reenviar recursivamente correos que superen el límite máximo.

### ¿Pueden las personas cancelar o registrar mi reenvío de correo electrónico sin mi permiso? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Usamos verificación de registros MX y TXT. Por lo tanto, si agrega los registros MX y TXT correspondientes de este servicio, quedará registrado. Si los elimina, quedará dado de baja. Usted es el propietario de su dominio y de la administración de DNS, así que si alguien tiene acceso a ellos, es un problema.

### ¿Cómo es gratis? {#how-is-it-free}

Forward Email ofrece un nivel gratuito a través de una combinación de desarrollo de código abierto, infraestructura eficiente y planes pagos opcionales que respaldan el servicio.

Nuestro nivel gratuito está respaldado por:

1. **Desarrollo de código abierto**: Nuestra base de código es de código abierto, lo que permite contribuciones de la comunidad y un funcionamiento transparente.

2. **Infraestructura eficiente**: Hemos optimizado nuestros sistemas para manejar el reenvío de correo electrónico con recursos mínimos.

3. **Planes Premium pagos**: Los usuarios que necesitan funciones adicionales como envío SMTP, recepción IMAP u opciones de privacidad mejoradas se suscriben a nuestros planes pagos.

4. **Límites de uso razonables**: el nivel gratuito tiene políticas de uso justo para evitar el abuso.

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### ¿Cuál es el límite de tamaño máximo de correo electrónico? {#what-is-the-max-email-size-limit}

El límite de tamaño predeterminado es de 50 MB, que incluye contenido, encabezados y archivos adjuntos. Tenga en cuenta que servicios como Gmail y Outlook solo permiten un límite de 25 MB, y si supera este límite al enviar a direcciones de estos proveedores, recibirá un mensaje de error.

Se devuelve un error con el código de respuesta adecuado si se excede el límite de tamaño del archivo.

### ¿Almacena registros de correos electrónicos? {#do-you-store-logs-of-emails}

No, no escribimos en el disco ni almacenamos registros con [excepción de errores](#do-you-store-error-logs) y [SMTP saliente](#do-you-support-sending-email-with-smtp) (consulte nuestro [política de privacidad](/privacy)).

Todo se hace en memoria y [Nuestro código fuente está en GitHub](https://github.com/forwardemail).

### ¿Almacena registros de errores? {#do-you-store-error-logs}

Sí. Puede acceder a los registros de errores en [Mi cuenta → Registros](/my-account/logs) o [Mi cuenta → Dominios](/my-account/domains).

A partir de febrero de 2023, almacenamos registros de errores para los códigos de respuesta SMTP `4xx` y `5xx` durante un período de 7 días, que contienen el error SMTP, el sobre y los encabezados de correo electrónico (**no** almacenamos el cuerpo del correo electrónico ni los archivos adjuntos).

Los registros de errores permiten comprobar si faltan correos electrónicos importantes y mitigar los falsos positivos de spam para [tus dominios](/my-account/domains). También son un excelente recurso para depurar problemas con [webhooks de correo electrónico](#do-you-support-webhooks) (ya que contienen la respuesta del punto final del webhook).

Los registros de errores de [limitación de velocidad](#do-you-have-rate-limiting) y [lista gris](#do-you-have-a-greylist) no son accesibles porque la conexión finaliza antes de tiempo (por ejemplo, antes de que se puedan transmitir los comandos `RCPT TO` y `MAIL FROM`).

Consulte nuestro [política de privacidad](/privacy) para obtener más información.

### ¿Lees mis correos electrónicos? {#do-you-read-my-emails}

No, en absoluto. Consulta nuestro [política de privacidad](/privacy).

Muchos otros servicios de reenvío de correo electrónico almacenan y podrían leer sus correos. No hay razón para que los correos reenviados deban almacenarse en disco, por lo que diseñamos la primera solución de código abierto que lo hace todo en memoria.

Creemos que tiene derecho a la privacidad y lo respetamos estrictamente. El código implementado en el servidor es [software de código abierto en GitHub](https://github.com/forwardemail) para mayor transparencia y para generar confianza.

### ¿Puedo "enviar correo como" en Gmail con este {#can-i-send-mail-as-in-gmail-with-this}?

¡Sí! A partir del 2 de octubre de 2018, añadimos esta función. Consulta [Cómo enviar correos electrónicos usando Gmail](#how-to-send-mail-as-using-gmail) más arriba.

También debes configurar el registro SPF para Gmail en tu configuración de DNS como registro <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Si usa Gmail (p. ej., "Enviar correo como") o G Suite, deberá añadir <code>include:_spf.google.com</code> a su registro SPF <strong class="notranslate">TXT</strong>, por ejemplo:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### ¿Puedo "enviar correo como" en Outlook con este {#can-i-send-mail-as-in-outlook-with-this}?

¡Sí! A partir del 2 de octubre de 2018, añadimos esta función. Simplemente vea estos dos enlaces de Microsoft a continuación:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

También debe configurar el registro SPF para Outlook en su registro <strong class="notranslate">TXT</strong> de configuración de DNS.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Si usa Microsoft Outlook o Live.com, deberá agregar <code>include:spf.protection.outlook.com</code> a su registro SPF <strong class="notranslate">TXT</strong>, por ejemplo:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### ¿Puedo "enviar correo como" en Apple Mail y iCloud Mail con este {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}?

Si eres suscriptor de iCloud+, puedes usar un dominio personalizado. [Nuestro servicio también es compatible con Apple Mail](#apple-mail).

Consulte <https://support.apple.com/en-us/102540> para obtener más información.

### ¿Puedo reenviar correos electrónicos ilimitados con este {#can-i-forward-unlimited-emails-with-this}?

Sí, sin embargo, los remitentes "relativamente desconocidos" tienen un límite de 100 conexiones por hora por nombre de host o IP. Consulte la sección sobre [Limitación de velocidad](#do-you-have-rate-limiting) y [Lista gris](#do-you-have-a-greylist) más arriba.

Por "relativamente desconocido" nos referimos a remitentes que no aparecen en [lista de permitidos](#do-you-have-an-allowlist).

Si se excede este límite, enviamos un código de respuesta 421 que le indica al servidor de correo del remitente que lo intente nuevamente más tarde.

### ¿Ofrecen dominios ilimitados por un precio único? {#do-you-offer-unlimited-domains-for-one-price}

Sí. Independientemente del plan que tengas, pagarás una única tarifa mensual que cubre todos tus dominios.

### ¿Qué métodos de pago aceptan? {#which-payment-methods-do-you-accept}

Forward Email acepta los siguientes métodos de pago únicos o mensuales/trimestrales/anuales:

1. **Tarjetas de crédito/débito/Transferencias bancarias**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, etc.
2. **PayPal**: Conecta tu cuenta de PayPal para pagos fáciles.
3. **Criptomonedas**: Aceptamos pagos con la moneda estable de Stripe en las redes Ethereum, Polygon y Solana.

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

Todos los pagos se procesan de forma segura a través de Stripe o PayPal. Tus datos de pago nunca se almacenan en nuestros servidores.

## Recursos adicionales {#additional-resources}

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [Estudios de caso y documentación para desarrolladores](/blog/docs)
* [Recursos](/resources)
* [Guías](/guides)

[gmail-2fa]: __URL_PROTEGIDA_868__

[cloudflare-dns]: __URL_PROTEGIDA_869__