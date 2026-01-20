# Acerca del reenvío de correo electrónico {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Acerca del reenvío de correo electrónico {#about-forward-email-1}

## Tabla de contenido {#table-of-contents}

* [Descripción general](#overview)
* [Fundador y Misión](#founder-and-mission)
* [Cronología](#timeline)
  * [2017 - Fundación y lanzamiento](#2017---founding-and-launch)
  * [2018 - Infraestructura e Integración](#2018---infrastructure-and-integration)
  * [2019 - Revolución del rendimiento](#2019---performance-revolution)
  * [2020 - Enfoque en la privacidad y la seguridad](#2020---privacy-and-security-focus)
  * [2021 - Modernización de la plataforma](#2021---platform-modernization)
  * [2023 - Expansión de infraestructura y funciones](#2023---infrastructure-and-feature-expansion)
  * [2024 - Optimización del servicio y funciones avanzadas](#2024---service-optimization-and-advanced-features)
  * [2025 - Innovación continua](#2025---continued-innovation)
* [Principios básicos](#core-principles)
* [Estado actual](#current-status)

## Descripción general {#overview}

> \[!TIP]
> Para obtener detalles técnicos sobre nuestra arquitectura, implementaciones de seguridad y hoja de ruta, consulte [Documento técnico](https://forwardemail.net/technical-whitepaper.pdf).

Reenvío de correo electrónico es un servicio [libre y de código abierto](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [reenvío de correo electrónico](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") centrado en el [derecho a la privacidad](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") del usuario. Lo que comenzó como una sencilla solución de reenvío de correo electrónico en 2017 se ha convertido en una plataforma integral que ofrece nombres de dominio personalizados ilimitados, direcciones de correo electrónico y alias ilimitados, direcciones de correo electrónico desechables ilimitadas, protección contra spam y phishing, almacenamiento cifrado del buzón y numerosas funciones avanzadas.

El servicio es mantenido y propiedad de su equipo fundador original de diseñadores y desarrolladores. Está desarrollado con software 100 % de código abierto utilizando [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") y [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Fundador y Misión {#founder-and-mission}

Forward Email fue fundada por **Nicholas Baugh** en 2017. Según [Documento técnico sobre reenvío de correo electrónico](https://forwardemail.net/technical-whitepaper.pdf), Baugh buscaba inicialmente una solución rentable y sencilla para habilitar el correo electrónico en nombres de dominio para sus proyectos paralelos. Tras analizar las opciones disponibles, comenzó a desarrollar su propia solución y adquirió el dominio `forwardemail.net` el 2 de octubre de 2017.

La misión de Forward Email va más allá de la prestación de servicios de correo electrónico: busca transformar la forma en que la industria aborda la privacidad y la seguridad del correo electrónico. Los valores fundamentales de la empresa incluyen la transparencia, el control del usuario y la protección de la privacidad mediante la implementación técnica, en lugar de meras promesas de políticas.

## Línea de tiempo {#timeline}

### 2017 - Fundación y lanzamiento {#2017---founding-and-launch}

**2 de octubre de 2017**: Nicholas Baugh compró el dominio `forwardemail.net` después de investigar soluciones de correo electrónico rentables para sus proyectos paralelos.

**5 de noviembre de 2017**: Baugh creó un archivo JavaScript de 634 líneas usando [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") para reenviar correos electrónicos a cualquier nombre de dominio personalizado. Esta implementación inicial se publicó como código abierto en [GitHub](https://github.com/forwardemail) y el servicio se lanzó mediante páginas de GitHub.

**Noviembre de 2017**: Reenvío de correo electrónico se lanzó oficialmente tras una versión inicial. La versión inicial se basaba exclusivamente en DNS, sin registro de cuenta ni proceso de registro; simplemente consistía en un archivo README escrito en Markdown con instrucciones. Los usuarios podían configurar el reenvío de correo electrónico configurando los registros MX para que apuntaran a `mx1.forwardemail.net` y `mx2.forwardemail.net`, y añadiendo un registro TXT con `forward-email=user@gmail.com`.

La simplicidad y eficacia de esta solución atrajeron la atención de desarrolladores destacados, incluido [David Heinemeier Hansson](https://dhh.dk) (creador de Ruby on Rails), quien continúa utilizando Forward Email en su dominio `dhh.dk` hasta el día de hoy.

### 2018 - Infraestructura e Integración {#2018---infrastructure-and-integration}

**Abril de 2018**: Cuando [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") lanzó su [servicio DNS para consumidores que prioriza la privacidad](https://blog.cloudflare.com/announcing-1111/), Forward Email cambió de usar [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") a [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") para manejar las búsquedas de [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), lo que demuestra el compromiso de la empresa con las opciones de infraestructura centradas en la privacidad.

**Octubre de 2018**: Reenviar correo electrónico permitió a los usuarios "Enviar correo como" con [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") y [Perspectiva](https://en.wikipedia.org/wiki/Outlook "Outlook"), ampliando las capacidades de integración con proveedores de correo electrónico populares.

### 2019 - Revolución del rendimiento {#2019---performance-revolution}

**Mayo de 2019**: Forward Email lanzó la versión 2, que representó una importante reescritura de las versiones iniciales. Esta actualización se centró en las mejoras de [actuación](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") mediante el uso de [arroyos](https://en.wikipedia.org/wiki/Streams "Streams") de [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), sentando las bases para la escalabilidad de la plataforma.

### 2020 - Enfoque en la privacidad y seguridad {#2020---privacy-and-security-focus}

**Febrero de 2020**: Forward Email lanzó el plan de Protección de Privacidad Mejorada, que permite a los usuarios desactivar la configuración de entradas públicas de registros DNS con sus alias de configuración de reenvío de correo electrónico. Con este plan, la información del alias de correo electrónico de un usuario queda oculta y no se puede buscar públicamente en internet. La compañía también lanzó una función para habilitar o deshabilitar alias específicos, permitiéndoles seguir apareciendo como direcciones de correo electrónico válidas y devolver un [Códigos de estado SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") correcto, descartando los correos electrónicos inmediatamente (similar a la canalización de la salida a [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Abril de 2020**: Tras enfrentarse a innumerables obstáculos con las soluciones de detección de spam existentes que no respetaban la política de privacidad de Forward Email, la empresa lanzó su versión alfa inicial de Spam Scanner. Esta solución [filtrado antispam](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques"), completamente gratuita y de código abierto, utiliza un enfoque [Filtro de spam Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") combinado con la protección [antiphishing](https://en.wikipedia.org/wiki/Phishing "Phishing") y [Ataque de homógrafo de IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email también lanzó [autenticación de dos factores](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) con [contraseñas de un solo uso](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) para mejorar la seguridad de las cuentas.

**Mayo de 2020**: El reenvío de correo electrónico permitió el uso de [reenvío de puertos](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") personalizado como solución alternativa para que los usuarios evitaran el bloqueo de puertos por su [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). La compañía también lanzó su [API RESTful de reenvío de correo electrónico gratuito](email-api) con documentación completa y ejemplos de solicitudes y respuestas en tiempo real, además de compatibilidad con webhooks.

**Agosto de 2020**: Forward Email agregó soporte para el sistema de autenticación de correo electrónico [Cadena recibida autenticada](arc) ("ARC"), fortaleciendo aún más la seguridad y capacidad de entrega del correo electrónico.

**23 de noviembre de 2020**: Forward Email salió públicamente de su programa beta, lo que marca un hito importante en el desarrollo de la plataforma.

### 2021 - Modernización de la plataforma {#2021---platform-modernization}

**Febrero de 2021**: Forward Email refactorizó su código base para eliminar todas las dependencias de [Pitón](https://en.wikipedia.org/wiki/Python_\(programming_language\) (lenguaje de programación Python), lo que permitió que su pila se convirtiera 100% en [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") y [Node.js](https://en.wikipedia.org/wiki/Node.js). Esta decisión arquitectónica se alineó con el compromiso de la empresa de mantener una pila tecnológica consistente y de código abierto.

**27 de septiembre de 2021**: Reenviar el correo electrónico [soporte añadido](email-forwarding-regex-pattern-filter) para que los alias de reenvío de correo electrónico coincidan con [expresiones regulares](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), lo que proporciona a los usuarios capacidades de enrutamiento de correo electrónico más sofisticadas.

### 2023 - Expansión de infraestructura y funciones {#2023---infrastructure-and-feature-expansion}

**Enero de 2023**: Forward Email lanzó un sitio web rediseñado y optimizado para la velocidad de la página, mejorando la experiencia y el rendimiento del usuario.

**Febrero de 2023**: La empresa agregó soporte para [registros de errores](/faq#do-you-store-error-logs) e implementó un esquema de color de sitio web [modo oscuro](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme), respondiendo a las preferencias del usuario y las necesidades de accesibilidad.

**Marzo de 2023**: Forward Email lanzó [Mandarina](https://github.com/forwardemail/tangerine#readme) y lo integró en toda su infraestructura, lo que permitió el uso de [DNS sobre HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") en la capa de aplicación. La empresa también añadió compatibilidad con [MTA-STS](/faq#do-you-support-mta-sts) y cambió de [hCaptcha](/) a [Torniquete de Cloudflare](https://developers.cloudflare.com/turnstile).

**Abril de 2023**: Forward Email implementó y automatizó una infraestructura completamente nueva. Todo el servicio comenzó a funcionar con un DNS con balanceo de carga global y basado en proximidad, con comprobaciones de estado y conmutación por error mediante [Cloudflare](https://cloudflare.com), lo que sustituyó el anterior enfoque de DNS round-robin. La empresa cambió a servidores físicos de varios proveedores, incluyendo [Vultr](https://www.vultr.com/?ref=429848) y [Océano digital](https://m.do.co/c/a7cecd27e071), ambos compatibles con SOC 2 Tipo 1. Las bases de datos MongoDB y Redis se migraron a configuraciones en clúster con nodos principales y en espera para lograr alta disponibilidad, cifrado SSL de extremo a extremo, cifrado en reposo y recuperación en un punto en el tiempo (PITR).

**Mayo de 2023**: Forward Email lanzó su función **SMTP saliente** para las solicitudes [envío de correo electrónico con SMTP](/faq#do-you-support-sending-email-with-smtp) y [Envío de correo electrónico con API](/faq#do-you-support-sending-email-with-api). Esta función incluye medidas de seguridad integradas para garantizar una alta capacidad de entrega, un sistema de colas y reintentos moderno y robusto, y [Admite registros de errores en tiempo real](/faq#do-you-store-error-logs).

**Noviembre de 2023**: Forward Email lanzó su función [**Almacenamiento de buzón cifrado**](/blog/docs/best-quantum-safe-encrypted-email-service) para [Compatibilidad con IMAP](/faq#do-you-support-receiving-email-with-imap), lo que representa un avance significativo en la privacidad y seguridad del correo electrónico.

**Diciembre de 2023**: La empresa [soporte añadido](/faq#do-you-support-pop3) para la supervisión de [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [claves de acceso y WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [hora de enviar la bandeja de entrada](/faq#i) y [OpenPGP para almacenamiento IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Optimización del servicio y funciones avanzadas {#2024---service-optimization-and-advanced-features}

**Febrero de 2024**: Reenvío de correo electrónico [Se agregó compatibilidad con calendario (CalDAV)](/faq#do-you-support-calendars-caldav), ampliando las capacidades de la plataforma más allá del correo electrónico para incluir la sincronización del calendario.

**Marzo a julio de 2024**: Forward Email lanzó importantes optimizaciones y mejoras en sus servicios IMAP, POP3 y CalDAV, con el objetivo de que su servicio sea tan rápido, o incluso más rápido, que las alternativas.

**Julio de 2024**: La empresa [Se agregó soporte para iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) solucionó la falta de compatibilidad con el comando IMAP `IDLE` de Apple Mail en iOS, lo que permitió notificaciones en tiempo real para dispositivos iOS de Apple. Forward Email también añadió tiempo a la monitorización de la bandeja de entrada ("TTI") para su propio servicio y Yahoo/AOL, y comenzó a permitir a los usuarios cifrar todo su registro DNS TXT, incluso en el plan gratuito. Como se solicitó en [Discusiones sobre las Guías de Privacidad](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) y [Problemas de GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), la empresa añadió la capacidad de que los alias rechacen silenciosamente `250`, rechacen temporalmente `421` o rechacen definitivamente `550` cuando estén deshabilitados.

**Agosto de 2024**: Forward Email añadió compatibilidad para exportar buzones en los formatos [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) y [Mbox](https://en.wikipedia.org/wiki/Mbox) (además del formato de exportación [SQLite](https://en.wikipedia.org/wiki/SQLite) ya existente). [Se agregó compatibilidad con firmas de webhook](https://forwardemail.net/faq#do-you-support-bounce-webhooks), y la empresa comenzó a permitir a los usuarios enviar boletines informativos, anuncios y marketing por correo electrónico a través de su servicio SMTP saliente. También se implementaron cuotas de almacenamiento para todo el dominio y por alias para IMAP/POP3/CalDAV.

### 2025 - Innovación continua {#2025---continued-innovation}

**Septiembre de 2024 a enero de 2025**: Reenviar correo electrónico [Se agregó una función de respuesta automática muy solicitada y cifrado OpenPGP/WKD para el reenvío de correo electrónico.](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), aprovechando sus capacidades de almacenamiento de buzón cifrado ya implementadas.

**21 de enero de 2025**: El mejor amigo del fundador, "Jack", su fiel compañero canino, falleció en paz a los casi 11 años. Jack [siempre será recordado](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) por su inquebrantable compañía que apoyó la creación de Forward Email. El [Documento técnico sobre reenvío de correo electrónico](https://forwardemail.net/technical-whitepaper.pdf) está dedicado a Jack, en reconocimiento a su papel en el desarrollo del servicio.

**Febrero de 2025**: Forward Email cambió a [Paquete de datos](https://www.datapacket.com) como su nuevo proveedor principal de centro de datos e implementó hardware dedicado personalizado y centrado en el rendimiento para mejorar aún más la confiabilidad y la velocidad del servicio.

**Junio de 2025**: Forward Email lanzó soporte para [Protocolo CardDAV](/faq#do-you-support-contacts-carddav), expandiendo las capacidades de la plataforma para incluir la sincronización de contactos junto con los servicios de correo electrónico y calendario existentes.

## Principios básicos {#core-principles}

Desde sus inicios, Forward Email ha mantenido un firme compromiso con los principios de privacidad y seguridad:

**Filosofía de código 100 % abierto**: a diferencia de los competidores, que solo abren el código de sus frontends mientras mantienen cerrados los backends, Forward Email ha puesto todo su código base (tanto el frontend como el backend) a disposición del público para el escrutinio en [GitHub](https://github.com/forwardemail).

**Diseño que prioriza la privacidad**: desde el primer día, Forward Email implementó un enfoque de procesamiento en memoria único que evita escribir correos electrónicos en el disco, lo que lo distingue de los servicios de correo electrónico convencionales que almacenan mensajes en bases de datos o sistemas de archivos.

**Innovación continua**: El servicio ha evolucionado desde una simple solución de reenvío de correo electrónico a una plataforma de correo electrónico integral con características como buzones de correo cifrados, cifrado resistente a la tecnología cuántica y compatibilidad con protocolos estándar, incluidos SMTP, IMAP, POP3 y CalDAV.

**Transparencia**: Hacer que todo el código sea de código abierto y esté disponible para inspección, asegurando que los usuarios puedan verificar las declaraciones de privacidad en lugar de simplemente confiar en las declaraciones de marketing.

**Control de usuario**: Ofrece a los usuarios opciones, incluida la capacidad de alojar ellos mismos toda la plataforma si así lo desean.

## Estado actual {#current-status}

A partir de 2025, Forward Email presta servicio a más de 500 000 dominios en todo el mundo, incluidas organizaciones destacadas y líderes de la industria como:

* **Empresas tecnológicas**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Organizaciones de medios**: Fox News Radio, Disney Ad Sales
* **Instituciones educativas**: Universidad de Cambridge, Universidad de Maryland, Universidad de Washington, Universidad de Tufts, Swarthmore College
* **Entidades gubernamentales**: Gobierno de Australia Meridional, Gobierno de República Dominicana
* **Otras organizaciones**: RCD Hotels, Fly<span>.</span>io
* **Desarrolladores destacados**: Isaac Z. Schlueter (creador de npm), David Heinemeier Hansson (creador de Ruby on Rails)

La plataforma continúa evolucionando con lanzamientos regulares de funciones y mejoras de infraestructura, manteniendo su posición como el único servicio de correo electrónico 100% de código abierto, encriptado, centrado en la privacidad, transparente y resistente a la tecnología cuántica disponible en la actualidad.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />