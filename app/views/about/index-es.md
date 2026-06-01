# Acerca de Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Equipo y historia de la empresa Forward Email" class="rounded-lg" />

# Acerca de Forward Email {#about-forward-email-1}


## Tabla de Contenidos {#table-of-contents}

* [Resumen](#overview)
* [Fundador y Misión](#founder-and-mission)
* [Cronología](#timeline)
  * [2017 - Fundación y Lanzamiento](#2017---founding-and-launch)
  * [2018 - Infraestructura e Integración](#2018---infrastructure-and-integration)
  * [2019 - Revolución en el Rendimiento](#2019---performance-revolution)
  * [2020 - Enfoque en Privacidad y Seguridad](#2020---privacy-and-security-focus)
  * [2021 - Modernización de la Plataforma](#2021---platform-modernization)
  * [2023 - Expansión de Infraestructura y Funcionalidades](#2023---infrastructure-and-feature-expansion)
  * [2024 - Optimización del Servicio y Funciones Avanzadas](#2024---service-optimization-and-advanced-features)
  * [2025 - Mejoras en Privacidad y Soporte de Protocolos {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - Cumplimiento RFC y Filtrado Avanzado {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Principios Fundamentales](#core-principles)
* [Estado Actual](#current-status)


## Resumen {#overview}

> \[!TIP]
> Para detalles técnicos sobre nuestra arquitectura, implementaciones de seguridad y hoja de ruta, consulte el [Whitepaper Técnico](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email es un servicio de [reenvío de correo electrónico](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") [gratuito y de código abierto](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") enfocado en el [derecho a la privacidad](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") del usuario. Lo que comenzó como una solución simple de reenvío de correo electrónico en 2017 se ha convertido en una plataforma integral que ofrece nombres de dominio personalizados ilimitados, direcciones y alias de correo electrónico ilimitados, direcciones de correo desechables ilimitadas, protección contra spam y phishing, almacenamiento cifrado de buzones y numerosas funciones avanzadas.

El servicio es mantenido y propiedad de su equipo fundador original de diseñadores y desarrolladores. Está construido con software 100% de código abierto usando [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") y [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Fundador y Misión {#founder-and-mission}

Forward Email fue fundado por **Nicholas Baugh** en 2017. Según el [Whitepaper Técnico de Forward Email](https://forwardemail.net/technical-whitepaper.pdf), Baugh inicialmente buscaba una solución económica y sencilla para habilitar correo electrónico en nombres de dominio para sus proyectos secundarios. Después de investigar las opciones disponibles, comenzó a programar su propia solución y compró el dominio `forwardemail.net` el 2 de octubre de 2017.

La misión de Forward Email va más allá de proveer servicios de correo electrónico: busca transformar la forma en que la industria aborda la privacidad y seguridad del correo electrónico. Los valores fundamentales de la empresa incluyen transparencia, control del usuario y protección de la privacidad mediante implementación técnica en lugar de solo promesas políticas.


## Cronología {#timeline}

### 2017 - Fundación y Lanzamiento {#2017---founding-and-launch}

**2 de octubre de 2017**: Nicholas Baugh compró el dominio `forwardemail.net` tras investigar soluciones económicas de correo electrónico para sus proyectos secundarios.

**5 de noviembre de 2017**: Baugh creó un archivo JavaScript de 634 líneas usando [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") para reenviar correos electrónicos para cualquier nombre de dominio personalizado. Esta implementación inicial fue publicada como código abierto en [GitHub](https://github.com/forwardemail) y el servicio se lanzó usando GitHub Pages.
**Noviembre 2017**: Forward Email se lanzó oficialmente después de una versión inicial. La versión temprana era puramente basada en DNS sin registro de cuenta ni proceso de inscripción, simplemente un archivo README escrito en Markdown con instrucciones. Los usuarios podían configurar el reenvío de correo electrónico configurando registros MX para apuntar a `mx1.forwardemail.net` y `mx2.forwardemail.net`, y agregando un registro TXT con `forward-email=user@gmail.com`.

La simplicidad y efectividad de esta solución atrajo la atención de desarrolladores prominentes, incluyendo a [David Heinemeier Hansson](https://dhh.dk) (creador de Ruby on Rails), quien continúa usando Forward Email en su dominio `dhh.dk` hasta el día de hoy.

### 2018 - Infraestructura e Integración {#2018---infrastructure-and-integration}

**Abril 2018**: Cuando [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") lanzó su [servicio DNS para consumidores enfocado en la privacidad](https://blog.cloudflare.com/announcing-1111/), Forward Email cambió de usar [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") a [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") para manejar las consultas de [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), demostrando el compromiso de la empresa con elecciones de infraestructura enfocadas en la privacidad.

**Octubre 2018**: Forward Email permitió a los usuarios "Enviar correo como" con [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") y [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), ampliando las capacidades de integración con proveedores de correo electrónico populares.

### 2019 - Revolución en el Rendimiento {#2019---performance-revolution}

**Mayo 2019**: Forward Email lanzó la versión 2, que representó una reescritura importante respecto a las versiones iniciales. Esta actualización se centró en mejoras de [rendimiento](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") mediante el uso de [streams](https://en.wikipedia.org/wiki/Streams "Streams") de [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), estableciendo la base para la escalabilidad de la plataforma.

### 2020 - Enfoque en Privacidad y Seguridad {#2020---privacy-and-security-focus}

**Febrero 2020**: Forward Email lanzó el plan de Protección de Privacidad Mejorada, que permite a los usuarios desactivar la configuración de entradas públicas en registros DNS con sus alias de configuración de reenvío de correo electrónico. A través de este plan, la información del alias de correo electrónico de un usuario queda oculta para que no sea buscable públicamente en Internet. La empresa también lanzó una función para habilitar o deshabilitar alias específicos mientras aún permiten que aparezcan como direcciones de correo válidas y devuelvan códigos de estado [SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") exitosos, con los correos siendo descartados inmediatamente (similar a redirigir la salida a [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Abril 2020**: Después de enfrentar numerosos obstáculos con soluciones existentes de detección de spam que no respetaban la política de privacidad de Forward Email, la empresa lanzó su versión alfa inicial del Escáner de Spam. Esta solución completamente gratuita y de código abierto de [filtrado anti-spam](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") utiliza un enfoque de filtro de spam [Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") combinado con protección contra [phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") y ataques de homógrafos IDN ([IDN homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")). Forward Email también lanzó la [autenticación de dos factores](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) usando [contraseñas de un solo uso](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) para mejorar la seguridad de las cuentas.

**Mayo 2020**: Forward Email permitió el [reenvío de puertos](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") personalizado como una solución para que los usuarios eviten el bloqueo de puertos por parte de su [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). La empresa también lanzó su [API RESTful gratuita para reenvío de correo electrónico](email-api) con documentación completa y ejemplos en tiempo real de solicitudes y respuestas, junto con soporte para webhooks.
**Agosto 2020**: Forward Email añadió soporte para el sistema de autenticación de correo electrónico [Authenticated Received Chain](arc) ("ARC"), fortaleciendo aún más la seguridad y la entregabilidad del correo electrónico.

**23 de noviembre de 2020**: Forward Email lanzó públicamente su plataforma fuera del programa beta, marcando un hito significativo en el desarrollo de la plataforma.

### 2021 - Modernización de la Plataforma {#2021---platform-modernization}

**Febrero 2021**: Forward Email refactorizó su base de código para eliminar todas las dependencias de [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), permitiendo que su stack sea 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") y [Node.js](https://en.wikipedia.org/wiki/Node.js). Esta decisión arquitectónica se alineó con el compromiso de la empresa de mantener un stack tecnológico consistente y de código abierto.

**27 de septiembre de 2021**: Forward Email [añadió soporte](email-forwarding-regex-pattern-filter) para alias de reenvío de correo electrónico que coincidan con [expresiones regulares](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), proporcionando a los usuarios capacidades más sofisticadas de enrutamiento de correo electrónico.

### 2023 - Expansión de Infraestructura y Funcionalidades {#2023---infrastructure-and-feature-expansion}

**Enero 2023**: Forward Email lanzó un sitio web rediseñado y optimizado para velocidad de página, mejorando la experiencia del usuario y el rendimiento.

**Febrero 2023**: La empresa añadió soporte para [registros de errores](/faq#do-you-store-error-logs) e implementó un esquema de colores de sitio web en [modo oscuro](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme), respondiendo a las preferencias de los usuarios y necesidades de accesibilidad.

**Marzo 2023**: Forward Email lanzó [Tangerine](https://github.com/forwardemail/tangerine#readme) e integró esta herramienta en toda su infraestructura, habilitando el uso de [DNS sobre HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") en la capa de aplicación. La empresa también añadió soporte para [MTA-STS](/faq#do-you-support-mta-sts) y cambió de [hCaptcha](/) a [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**Abril 2023**: Forward Email implementó y automatizó una infraestructura completamente nueva. Todo el servicio comenzó a funcionar con DNS balanceado globalmente y basado en proximidad, con chequeos de salud y conmutación por error usando [Cloudflare](https://cloudflare.com), reemplazando el enfoque anterior de DNS round-robin. La empresa cambió a **servidores bare metal** en múltiples proveedores, incluyendo [Vultr](https://www.vultr.com/?ref=429848) y [Digital Ocean](https://m.do.co/c/a7cecd27e071), ambos proveedores con cumplimiento SOC 2 Tipo 1. Las bases de datos MongoDB y Redis se migraron a configuraciones en clúster con nodos primarios y de reserva para alta disponibilidad, cifrado SSL de extremo a extremo, cifrado en reposo y recuperación en punto en el tiempo (PITR).

**Mayo 2023**: Forward Email lanzó su función de **SMTP saliente** para [enviar correo con SMTP](/faq#do-you-support-sending-email-with-smtp) y [enviar correo con solicitudes API](/faq#do-you-support-sending-email-with-api). Esta función incluye salvaguardas integradas para asegurar alta entregabilidad, un sistema moderno y robusto de colas y reintentos, y [soporta registros de errores en tiempo real](/faq#do-you-store-error-logs).

**Noviembre 2023**: Forward Email lanzó su función de [**almacenamiento cifrado de buzones**](/blog/docs/best-quantum-safe-encrypted-email-service) para [soporte IMAP](/faq#do-you-support-receiving-email-with-imap), representando un avance significativo en privacidad y seguridad del correo electrónico.

**Diciembre 2023**: La empresa [añadió soporte](/faq#do-you-support-pop3) para [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys y WebAuthn](/faq#do-you-support-passkeys-and-webauthn), monitoreo de [tiempo hasta la bandeja de entrada](/faq#i), y [OpenPGP para almacenamiento IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Optimización del Servicio y Funciones Avanzadas {#2024---service-optimization-and-advanced-features}

**Febrero 2024**: Forward Email [añadió soporte para calendarios (CalDAV)](/faq#do-you-support-calendars-caldav), ampliando las capacidades de la plataforma más allá del correo electrónico para incluir sincronización de calendarios.
**Marzo a julio de 2024**: Forward Email lanzó importantes optimizaciones y mejoras en sus servicios IMAP, POP3 y CalDAV, con el objetivo de hacer que su servicio sea tan rápido como, o incluso más rápido que, las alternativas.

**Julio de 2024**: La empresa [añadió soporte para iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) para abordar la falta de soporte del comando IMAP `IDLE` en Apple Mail para iOS, habilitando notificaciones en tiempo real para dispositivos Apple iOS. Forward Email también añadió monitoreo del tiempo hasta la bandeja de entrada ("TTI") para su propio servicio y Yahoo/AOL, y comenzó a permitir a los usuarios cifrar todo su registro DNS TXT incluso en el plan gratuito. Como se solicitó en las [discusiones de Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) y en los [issues de GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), la empresa añadió la capacidad para que los alias rechacen silenciosamente con `250`, rechacen suavemente con `421` o rechacen firmemente con `550` cuando estén deshabilitados.

**Agosto de 2024**: Forward Email añadió soporte para exportar buzones en formatos [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) y [Mbox](https://en.wikipedia.org/wiki/Mbox) (además del formato de exportación existente [SQLite](https://en.wikipedia.org/wiki/SQLite)). [Se añadió soporte para firma de webhooks](https://forwardemail.net/faq#do-you-support-bounce-webhooks), y la empresa comenzó a permitir a los usuarios enviar boletines, anuncios y marketing por correo electrónico a través de su servicio SMTP saliente. También se implementaron cuotas de almacenamiento a nivel de dominio y alias para IMAP/POP3/CalDAV.

### 2025 - Mejoras de privacidad y soporte de protocolos {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**Septiembre de 2024 a enero de 2025**: Forward Email [añadió una función muy solicitada de respuesta automática por vacaciones y cifrado OpenPGP/WKD para el reenvío de correo](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), construyendo sobre sus capacidades ya implementadas de almacenamiento cifrado de buzones.

**21 de enero de 2025**: El mejor amigo del fundador, "Jack", su leal compañero canino, falleció pacíficamente a la edad de casi 11 años. Jack [siempre será recordado](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) por su inquebrantable compañía que apoyó la creación de Forward Email. El [Whitepaper Técnico de Forward Email](https://forwardemail.net/technical-whitepaper.pdf) está dedicado a Jack, reconociendo su papel en el desarrollo del servicio.

**Febrero de 2025**: Forward Email cambió a [DataPacket](https://www.datapacket.com) como su nuevo proveedor principal de centro de datos, implementando hardware bare-metal personalizado y enfocado en el rendimiento para mejorar aún más la fiabilidad y velocidad del servicio.

**Marzo de 2025**: Se lanzó oficialmente la versión 1.0 de Forward Email.

**Abril de 2025**: Se publicó la primera versión del [Whitepaper Técnico de Forward Email](https://forwardemail.net/technical-whitepaper.pdf) y la empresa comenzó a aceptar pagos en criptomonedas.

**Mayo de 2025**: El servicio lanzó nueva documentación de API usando [Scalar](https://github.com/scalar/scalar).

**Junio de 2025**: Forward Email lanzó soporte para el [protocolo CardDAV](/faq#do-you-support-contacts-carddav), ampliando las capacidades de la plataforma para incluir sincronización de contactos junto con los servicios existentes de correo electrónico y calendario.

**Agosto de 2025**: La plataforma añadió soporte para [CalDAV VTODO/tareas](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), habilitando la gestión de tareas junto con eventos de calendario.

**Noviembre de 2025**: Se mejoró la seguridad de la plataforma con una migración de PBKDF2 a [Argon2id](https://en.wikipedia.org/wiki/Argon2) para el hash de contraseñas, y la infraestructura fue migrada de Redis a [Valkey](https://github.com/valkey-io/valkey).

**Diciembre de 2025**: Se lanzó la versión 2.0, introduciendo soporte para [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) para la encriptación TLS obligatoria en el transporte de correo electrónico y actualizando a [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6.
### 2026 - Cumplimiento RFC y Filtrado Avanzado {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Enero 2026**: Forward Email lanzó un [documento completo de cumplimiento de protocolos RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) y añadió soporte para [cifrado S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) y filtrado de correo electrónico [Sieve completo (RFC 5228)](/faq#do-you-support-sieve-email-filtering) con soporte para el protocolo [ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering). La API REST también se amplió a 39 endpoints.

**Febrero 2026**: Se lanzó el cliente webmail oficial y de código abierto en [mail.forwardemail.net](https://mail.forwardemail.net) ([código fuente en GitHub](https://github.com/forwardemail/mail.forwardemail.net)). La plataforma también añadió soporte para [Extensiones de Programación CalDAV (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) y [Domain Connect](https://domainconnect.org) para configuración DNS con un solo clic. Se lanzaron notificaciones push en tiempo real para IMAP, CalDAV y CardDAV usando WebSockets.

**Marzo 2026**: Se añadió soporte para almacenamiento personalizado compatible con S3 por dominio, junto con una herramienta de línea de comandos para su gestión. Se inició el trabajo en aplicaciones de escritorio y móviles multiplataforma para macOS, Windows, Linux, iOS y Android usando la misma base de código webmail de código abierto, construidas con [Tauri](https://tauri.app).


## Principios Fundamentales {#core-principles}

Desde sus inicios, Forward Email ha mantenido un compromiso firme con los principios de privacidad y seguridad:

**Filosofía 100% Código Abierto**: A diferencia de competidores que solo liberan su frontend mientras mantienen cerrado el backend, Forward Email ha puesto a disposición pública todo su código—tanto frontend como backend—para escrutinio en [GitHub](https://github.com/forwardemail).

**Diseño con Privacidad Primero**: Desde el primer día, Forward Email implementó un enfoque único de procesamiento en memoria que evita escribir correos en disco, diferenciándose de los servicios convencionales que almacenan mensajes en bases de datos o sistemas de archivos.

**Innovación Continua**: El servicio ha evolucionado de una simple solución de reenvío de correo a una plataforma completa con características como buzones cifrados, cifrado resistente a la computación cuántica y soporte para protocolos estándar incluyendo SMTP, IMAP, POP3 y CalDAV.

**Transparencia**: Hacer todo el código abierto y disponible para inspección, asegurando que los usuarios puedan verificar las afirmaciones de privacidad en lugar de confiar solo en declaraciones de marketing.

**Control del Usuario**: Empoderar a los usuarios con opciones, incluyendo la capacidad de autoalojar toda la plataforma si así lo desean.


## Estado Actual {#current-status}

A marzo de 2026, Forward Email atiende a más de 1,6 millones de dominios en todo el mundo, incluyendo organizaciones notables y líderes de la industria como:

* **Empresas Tecnológicas**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Organizaciones de Medios**: Fox News Radio, Disney Ad Sales
* **Instituciones Educativas**: Universidad de Cambridge, Universidad de Maryland, Universidad de Washington, Tufts University, Swarthmore College
* **Entidades Gubernamentales**: Gobierno de Australia del Sur, Gobierno de República Dominicana
* **Otras Organizaciones**: RCD Hotels, Fly<span>.</span>io
* **Desarrolladores Notables**: Isaac Z. Schlueter (creador de npm), David Heinemeier Hansson (creador de Ruby on Rails)

La plataforma continúa evolucionando con lanzamientos regulares de funciones y mejoras en la infraestructura, manteniendo su posición como el único servicio de correo electrónico 100% código abierto, cifrado, enfocado en la privacidad, transparente y resistente a la computación cuántica disponible hoy en día.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
