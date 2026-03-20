# Por qué el correo electrónico de código abierto es el futuro: La ventaja de Forward Email {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Seguridad y privacidad del correo electrónico de código abierto" class="rounded-lg" />


## Tabla de Contenidos {#table-of-contents}

* [Prólogo](#foreword)
* [La ventaja del código abierto: Más que solo marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Qué significa realmente el código abierto](#what-true-open-source-means)
  * [El problema del backend: Dónde fallan la mayoría de los servicios de correo "de código abierto"](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email: 100% código abierto, frontend Y backend](#forward-email-100-open-source-frontend-and-backend)
  * [Nuestro enfoque técnico único](#our-unique-technical-approach)
* [La opción de autoalojamiento: Libertad de elección](#the-self-hosting-option-freedom-of-choice)
  * [Por qué apoyamos el autoalojamiento](#why-we-support-self-hosting)
  * [La realidad del autoalojamiento de correo electrónico](#the-reality-of-self-hosting-email)
* [Por qué nuestro servicio de pago tiene sentido (aunque somos de código abierto)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Comparación de costos](#cost-comparison)
  * [Lo mejor de ambos mundos](#the-best-of-both-worlds)
* [El engaño del código cerrado: Lo que Proton y Tutanota no te cuentan](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Las afirmaciones de código abierto de Proton Mail](#proton-mails-open-source-claims)
  * [El enfoque similar de Tutanota](#tutanotas-similar-approach)
  * [El debate de las guías de privacidad](#the-privacy-guides-debate)
* [El futuro es código abierto](#the-future-is-open-source)
  * [Por qué el código abierto está ganando](#why-open-source-is-winning)
* [Cómo cambiar a Forward Email](#making-the-switch-to-forward-email)
* [Conclusión: Correo electrónico de código abierto para un futuro privado](#conclusion-open-source-email-for-a-private-future)


## Prólogo {#foreword}

En una era donde las preocupaciones sobre la privacidad digital están en su punto más alto, los servicios de correo electrónico que elegimos importan más que nunca. Aunque muchos proveedores afirman priorizar tu privacidad, hay una diferencia fundamental entre quienes solo hablan de privacidad y quienes realmente la practican. En Forward Email, hemos construido nuestro servicio sobre una base de completa transparencia mediante el desarrollo de código abierto—no solo en nuestras aplicaciones frontend, sino en toda nuestra infraestructura.

Esta publicación explora por qué las soluciones de correo electrónico de código abierto son superiores a las alternativas de código cerrado, cómo nuestro enfoque difiere de competidores como Proton Mail y Tutanota, y por qué—a pesar de nuestro compromiso con las opciones de autoalojamiento—nuestro servicio de pago ofrece el mejor valor para la mayoría de los usuarios.


## La ventaja del código abierto: Más que solo marketing {#the-open-source-advantage-more-than-just-marketing}

El término "código abierto" se ha convertido en una palabra de moda popular en marketing en los últimos años, con el mercado global de servicios de código abierto proyectado para crecer a una tasa compuesta anual (CAGR) de más del 16% entre 2024 y 2032\[^1]. Pero, ¿qué significa realmente ser de código abierto y por qué importa para la privacidad de tu correo electrónico?

### Qué significa realmente el código abierto {#what-true-open-source-means}

El software de código abierto pone todo su código fuente a disposición de cualquiera para inspeccionar, modificar y mejorar libremente. Esta transparencia crea un entorno donde:

* Las vulnerabilidades de seguridad pueden ser identificadas y corregidas por una comunidad global de desarrolladores
* Las afirmaciones de privacidad pueden ser verificadas mediante revisión independiente del código
* Los usuarios no quedan atrapados en ecosistemas propietarios
* La innovación ocurre más rápido gracias a la mejora colaborativa

Cuando se trata del correo electrónico—la columna vertebral de tu identidad en línea—esta transparencia no es solo algo deseable; es esencial para una privacidad y seguridad genuinas.

### El problema del backend: Dónde fallan la mayoría de los servicios de correo "de código abierto" {#the-backend-problem-where-most-open-source-email-services-fall-short}

Aquí es donde las cosas se ponen interesantes. Muchos proveedores populares de correo "enfocados en la privacidad" se anuncian como de código abierto, pero hay una distinción crítica que esperan que no notes: **solo liberan el código de sus frontends mientras mantienen sus backends cerrados**.
¿Qué significa esto? El frontend es lo que ves y con lo que interactúas: la interfaz web o la aplicación móvil. El backend es donde ocurre el procesamiento real del correo electrónico: donde se almacenan, encriptan y transmiten tus mensajes. Cuando un proveedor mantiene su backend cerrado:

1. No puedes verificar cómo se procesan realmente tus correos electrónicos
2. No puedes confirmar si sus afirmaciones de privacidad son legítimas
3. Confías en afirmaciones de marketing en lugar de código verificable
4. Las vulnerabilidades de seguridad pueden permanecer ocultas al escrutinio público

Como han destacado las discusiones en los foros de Privacy Guides, tanto Proton Mail como Tutanota afirman ser de código abierto, pero sus backends permanecen cerrados y propietarios\[^2]. Esto crea una brecha significativa de confianza: se te pide que creas en sus promesas de privacidad sin la capacidad de verificarlas.


## Forward Email: 100% Código Abierto, Frontend Y Backend {#forward-email-100-open-source-frontend-and-backend}

En Forward Email, hemos adoptado un enfoque fundamentalmente diferente. Toda nuestra base de código—tanto frontend como backend—es de código abierto y está disponible para que cualquiera la inspeccione en <https://github.com/forwardemail/forwardemail.net>.

Esto significa:

1. **Transparencia Completa**: Cada línea de código que procesa tus correos electrónicos está disponible para escrutinio público.
2. **Privacidad Verificable**: Nuestras afirmaciones de privacidad no son solo palabras de marketing—son hechos verificables que cualquiera puede confirmar examinando nuestro código.
3. **Seguridad Impulsada por la Comunidad**: Nuestra seguridad se fortalece con la experiencia colectiva de la comunidad global de desarrolladores.
4. **Sin Funcionalidad Oculta**: Lo que ves es lo que obtienes—sin rastreos ocultos, sin puertas traseras secretas.

### Nuestro Enfoque Técnico Único {#our-unique-technical-approach}

Nuestro compromiso con la privacidad va más allá de ser solo código abierto. Hemos implementado varias innovaciones técnicas que nos distinguen:

#### Buzones SQLite Encriptados Individualmente {#individually-encrypted-sqlite-mailboxes}

A diferencia de los proveedores tradicionales de correo electrónico que usan bases de datos relacionales compartidas (donde una sola brecha podría exponer los datos de todos los usuarios), usamos archivos SQLite encriptados individualmente para cada buzón. Esto significa:

* Cada buzón es un archivo encriptado separado
* El acceso a los datos de un usuario no concede acceso a otros
* Ni siquiera nuestros propios empleados pueden acceder a tus datos—es una decisión de diseño fundamental

Como explicamos en las discusiones de Privacy Guides:

> "Las bases de datos relacionales compartidas (por ejemplo, MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, etc.) todas requieren un inicio de sesión (con usuario/contraseña) para establecer la conexión a la base de datos. Esto significa que cualquiera con esta contraseña podría consultar la base de datos para cualquier cosa. Ya sea un empleado deshonesto o un ataque de mucama malintencionada. Esto también significa que tener acceso a los datos de un usuario significa que también tienes acceso a los de todos los demás. Por otro lado, SQLite podría considerarse una base de datos compartida, pero cómo la usamos (cada buzón = archivo SQLite individual) la hace aislada."\[^3]

#### Encriptación Resistente a la Computación Cuántica {#quantum-resistant-encryption}

Mientras otros proveedores aún están poniéndose al día, nosotros ya hemos implementado métodos de encriptación resistentes a la computación cuántica para proteger tu privacidad de correo electrónico frente a amenazas emergentes de la computación cuántica.

#### Sin Dependencias de Terceros {#no-third-party-dependencies}

A diferencia de competidores que dependen de servicios como Amazon SES para la entrega de correos, hemos construido toda nuestra infraestructura internamente. Esto elimina posibles fugas de privacidad a través de servicios de terceros y nos da control completo sobre toda la cadena de correo electrónico.


## La Opción de Autoalojamiento: Libertad de Elección {#the-self-hosting-option-freedom-of-choice}

Uno de los aspectos más poderosos del software de código abierto es la libertad que proporciona. Con Forward Email, nunca estás atado—aunque quieras, puedes autoalojar toda nuestra plataforma.

### Por Qué Apoyamos el Autoalojamiento {#why-we-support-self-hosting}

Creemos en dar a los usuarios control total sobre sus datos. Por eso hemos hecho que toda nuestra plataforma sea autoalojable con documentación completa y guías de configuración. Este enfoque:

* Proporciona máximo control para usuarios con conocimientos técnicos
* Elimina la necesidad de confiar en nosotros como proveedor de servicios
* Permite personalización para cumplir requisitos específicos
* Asegura que el servicio pueda continuar incluso si nuestra empresa no lo hace
### La Realidad de Autoalojar el Correo Electrónico {#the-reality-of-self-hosting-email}

Aunque el autoalojamiento es una opción poderosa, es importante entender los costos reales involucrados:

#### Costos Financieros {#financial-costs}

* Costos de VPS o servidor: $5-$50/mes para una configuración básica\[^4]
* Registro y renovación de dominio: $10-20/año
* Certificados SSL (aunque Let's Encrypt ofrece opciones gratuitas)
* Costos potenciales para servicios de monitoreo y soluciones de respaldo

#### Costos de Tiempo {#time-costs}

* Configuración inicial: Varias horas a días dependiendo de la experiencia técnica
* Mantenimiento continuo: 5-10 horas/mes para actualizaciones, parches de seguridad y resolución de problemas\[^5]
* Curva de aprendizaje: Entender protocolos de correo electrónico, mejores prácticas de seguridad y administración de servidores

#### Desafíos Técnicos {#technical-challenges}

* Problemas de entregabilidad del correo (mensajes marcados como spam)
* Mantenerse al día con estándares de seguridad en evolución
* Asegurar alta disponibilidad y confiabilidad
* Gestionar efectivamente el filtrado de spam

Como dijo un experimentado autoalojador: "El correo electrónico es un servicio básico... Es más barato alojar mi correo en \[un proveedor] que gastar dinero *y* tiempo autoalojándolo."\[^6]


## Por Qué Nuestro Servicio de Pago Tiene Sentido (Aunque Somos de Código Abierto) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Dado los desafíos del autoalojamiento, nuestro servicio de pago ofrece lo mejor de ambos mundos: la transparencia y seguridad del código abierto con la conveniencia y confiabilidad de un servicio gestionado.

### Comparación de Costos {#cost-comparison}

Cuando consideras tanto los costos financieros como de tiempo, nuestro servicio de pago ofrece un valor excepcional:

* **Costo total de autoalojamiento**: $56-$252/mes (incluyendo costos de servidor y valoración del tiempo)
* **Planes pagos de Forward Email**: $3-$9/mes

Nuestro servicio de pago proporciona:

* Gestión y mantenimiento profesional
* Reputación IP establecida para mejor entregabilidad
* Actualizaciones y monitoreo de seguridad regulares
* Soporte cuando surgen problemas
* Todos los beneficios de privacidad de nuestro enfoque de código abierto

### Lo Mejor de Ambos Mundos {#the-best-of-both-worlds}

Al elegir Forward Email, obtienes:

1. **Privacidad Verificable**: Nuestra base de código abierto significa que puedes confiar en nuestras afirmaciones de privacidad
2. **Gestión Profesional**: No necesitas convertirte en un experto en servidores de correo
3. **Rentabilidad**: Costo total menor que el autoalojamiento
4. **Libertad sin Bloqueos**: La opción de autoalojar siempre está disponible


## La Decepción del Código Cerrado: Lo Que Proton y Tutanota No Te Dicen {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Veamos más de cerca cómo nuestro enfoque difiere de los populares proveedores de correo "enfocados en la privacidad".

### Las Afirmaciones de Código Abierto de Proton Mail {#proton-mails-open-source-claims}

Proton Mail se publicita como código abierto, pero esto solo aplica a sus aplicaciones frontend. Su backend—donde realmente se procesan y almacenan tus correos—permanece cerrado\[^7]. Esto significa:

* No puedes verificar cómo se manejan tus correos
* Debes confiar en sus afirmaciones de privacidad sin verificación
* Las vulnerabilidades de seguridad en su backend permanecen ocultas al escrutinio público
* Estás atrapado en su ecosistema sin opciones de autoalojamiento

### Enfoque Similar de Tutanota {#tutanotas-similar-approach}

Al igual que Proton Mail, Tutanota solo libera el código de su frontend mientras mantiene su backend propietario\[^8]. Enfrentan los mismos problemas de confianza:

* No hay forma de verificar las afirmaciones de privacidad del backend
* Transparencia limitada en el procesamiento real del correo
* Posibles problemas de seguridad ocultos al público
* Bloqueo con el proveedor sin opción de autoalojamiento

### El Debate en Privacy Guides {#the-privacy-guides-debate}

Estas limitaciones no han pasado desapercibidas en la comunidad de privacidad. En discusiones en Privacy Guides, destacamos esta distinción crítica:

> "Se indica que tanto Protonmail como Tuta son de código cerrado. Porque su backend es efectivamente cerrado."\[^9]

También afirmamos:

> "No ha habido auditorías públicas compartidas de ninguna infraestructura backend de proveedores de servicios de correo listados actualmente en PG ni fragmentos de código abierto compartidos de cómo procesan el correo entrante."\[^10]
Esta falta de transparencia crea un problema fundamental de confianza. Sin backends de código abierto, los usuarios se ven obligados a aceptar las afirmaciones de privacidad por fe en lugar de por verificación.


## El futuro es de código abierto {#the-future-is-open-source}

La tendencia hacia soluciones de código abierto se está acelerando en toda la industria del software. Según investigaciones recientes:

* El mercado de software de código abierto está creciendo de $41.83 mil millones en 2024 a $48.92 mil millones en 2025\[^11]
* El 80% de las empresas reportan un aumento en el uso de código abierto durante el último año\[^12]
* Se proyecta que la adopción de código abierto continuará su rápida expansión

Este crecimiento refleja un cambio fundamental en cómo pensamos sobre la seguridad y la privacidad del software. A medida que los usuarios se vuelven más conscientes de la privacidad, la demanda de privacidad verificable a través de soluciones de código abierto solo aumentará.

### Por qué el código abierto está ganando {#why-open-source-is-winning}

Las ventajas del código abierto se están volviendo cada vez más claras:

1. **Seguridad a través de la transparencia**: El código abierto puede ser revisado por miles de expertos, no solo por un equipo interno
2. **Innovación más rápida**: El desarrollo colaborativo acelera la mejora
3. **Confianza mediante la verificación**: Las afirmaciones pueden ser verificadas en lugar de aceptadas por fe
4. **Libertad frente al bloqueo del proveedor**: Los usuarios mantienen el control sobre sus datos y servicios
5. **Soporte comunitario**: Una comunidad global ayuda a identificar y solucionar problemas


## Cambiando a Forward Email {#making-the-switch-to-forward-email}

Pasar a Forward Email es sencillo, ya sea que vengas de un proveedor convencional como Gmail o de otro servicio enfocado en la privacidad como Proton Mail o Tutanota.

Nuestro servicio ofrece:

* Dominios y alias ilimitados
* Soporte de protocolos estándar (SMTP, IMAP, POP3) sin puentes propietarios
* Integración perfecta con clientes de correo existentes
* Proceso de configuración simple con documentación completa
* Planes de precios asequibles desde solo $3/mes


## Conclusión: Correo electrónico de código abierto para un futuro privado {#conclusion-open-source-email-for-a-private-future}

En un mundo donde la privacidad digital está cada vez más amenazada, la transparencia de las soluciones de código abierto proporciona una salvaguarda crucial. En Forward Email, estamos orgullosos de liderar el camino con nuestro enfoque completamente de código abierto para la privacidad del correo electrónico.

A diferencia de competidores que solo adoptan parcialmente el código abierto, hemos puesto toda nuestra plataforma—frontend y backend—a disposición del escrutinio público. Este compromiso con la transparencia, combinado con nuestro enfoque técnico innovador, ofrece un nivel de privacidad verificable que las alternativas de código cerrado simplemente no pueden igualar.

Ya sea que elijas usar nuestro servicio gestionado o alojar nuestra plataforma por ti mismo, te beneficias de la seguridad, privacidad y tranquilidad que provienen de un correo electrónico verdaderamente de código abierto.

El futuro del correo electrónico es abierto, transparente y enfocado en la privacidad. El futuro es Forward Email.

\[^1]: SNS Insider. "The Open Source Services Market was valued at USD 28.6 billion in 2023 and will reach to USD 114.8 Billion by 2032, growing at a CAGR of 16.70% by 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generally, you can expect to spend anywhere from $5 to $50 monthly for a basic virtual private server (VPS) to run your email server." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Maintenance took me maybe 16 hours in that period..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)
\[^6]: Reddit r/selfhosted. "TL:DR: Como todo lo autoalojado, REQUERIRÁ TU TIEMPO. Si no tienes tiempo para dedicarle, siempre es mejor quedarse con un servicio alojado..." [¿Autoalojar un servidor de correo electrónico? ¿Por qué o por qué no? ¿Qué es popular?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "Proton Mail afirma ser de código abierto, pero su back-end en realidad es código cerrado." [Comparación Tutanota vs Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "Tutanota afirma ser de código abierto, pero su back-end en realidad es código cerrado." [Comparación Proton Mail vs Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Comunidad Privacy Guides. "Se indica que tanto Protonmail como Tuta son de código cerrado. Porque su backend efectivamente es código cerrado." [Forward Email (proveedor de correo) - Desarrollo del sitio / Sugerencias de herramientas](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Comunidad Privacy Guides. "No ha habido auditorías públicas compartidas de ninguna infraestructura backend de proveedores de servicios de correo electrónico listados actualmente en PG ni fragmentos de código abierto compartidos sobre cómo procesan el correo entrante." [Forward Email (proveedor de correo) - Desarrollo del sitio / Sugerencias de herramientas](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "El mercado de software de código abierto crecerá de USD 41.83 mil millones en 2024 a USD 48.92 mil millones en 2025 a una tasa compuesta..." [¿Qué es el software de código abierto?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Con un 80% de las empresas reportando un aumento en la utilización de tecnologías de código abierto durante el último año, es..." [Tendencias emergentes en comunidades de código abierto 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
