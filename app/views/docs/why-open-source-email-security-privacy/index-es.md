# Por qué el correo electrónico de código abierto es el futuro: la ventaja del correo electrónico directo {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />

## Tabla de contenido {#table-of-contents}

* [Prefacio](#foreword)
* [La ventaja del código abierto: más que solo marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Qué significa el verdadero código abierto](#what-true-open-source-means)
  * [El problema del backend: dónde fallan la mayoría de los servicios de correo electrónico de código abierto](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Reenvío de correo electrónico: 100 % de código abierto, frontend y backend](#forward-email-100-open-source-frontend-and-backend)
  * [Nuestro enfoque técnico único](#our-unique-technical-approach)
* [La opción de autoalojamiento: libertad de elección](#the-self-hosting-option-freedom-of-choice)
  * [¿Por qué apoyamos el autoalojamiento?](#why-we-support-self-hosting)
  * [La realidad del correo electrónico autoalojado](#the-reality-of-self-hosting-email)
* [Por qué nuestro servicio de pago tiene sentido (aunque sea de código abierto)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Comparación de costos](#cost-comparison)
  * [Lo mejor de ambos mundos](#the-best-of-both-worlds)
* [El engaño del código cerrado: lo que Proton y Tutanota no te cuentan](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Afirmaciones de código abierto de Proton Mail](#proton-mails-open-source-claims)
  * [El enfoque similar de Tutanota](#tutanotas-similar-approach)
  * [El debate sobre las guías de privacidad](#the-privacy-guides-debate)
* [El futuro es de código abierto](#the-future-is-open-source)
  * [¿Por qué el código abierto está ganando?](#why-open-source-is-winning)
* [Cómo cambiar al reenvío de correo electrónico](#making-the-switch-to-forward-email)
* [Conclusión: Correo electrónico de código abierto para un futuro privado](#conclusion-open-source-email-for-a-private-future)

## Prólogo {#foreword}

En una era donde la preocupación por la privacidad digital está en su punto más alto, los servicios de correo electrónico que elegimos son más importantes que nunca. Si bien muchos proveedores afirman priorizar la privacidad, existe una diferencia fundamental entre quienes solo hablan de privacidad y quienes realmente la cumplen. En Forward Email, hemos construido nuestro servicio sobre la base de una transparencia total mediante el desarrollo de código abierto, no solo en nuestras aplicaciones frontend, sino en toda nuestra infraestructura.

Esta entrada de blog explora por qué las soluciones de correo electrónico de código abierto son superiores a las alternativas de código cerrado, cómo nuestro enfoque se diferencia de competidores como Proton Mail y Tutanota, y por qué, a pesar de nuestro compromiso con las opciones de autohospedaje, nuestro servicio pago ofrece el mejor valor para la mayoría de los usuarios.

## La ventaja del código abierto: más que solo marketing {#the-open-source-advantage-more-than-just-marketing}

El término "código abierto" se ha convertido en una palabra de moda en marketing en los últimos años, y se proyecta que el mercado global de servicios de código abierto crecerá a una tasa de crecimiento anual compuesta (TCAC) superior al 16 % entre 2024 y 2032. Pero ¿qué significa ser verdaderamente de código abierto y por qué es importante para la privacidad de tu correo electrónico?

### Qué significa el verdadero código abierto {#what-true-open-source-means}

El software de código abierto pone a disposición de todos su código fuente para que cualquiera pueda inspeccionarlo, modificarlo y mejorarlo. Esta transparencia crea un entorno donde:

* Una comunidad global de desarrolladores puede identificar y solucionar vulnerabilidades de seguridad.
* Las reclamaciones de privacidad pueden verificarse mediante una revisión de código independiente.
* Los usuarios no están limitados a ecosistemas propietarios.
* La innovación se acelera mediante la mejora colaborativa.

Cuando se trata del correo electrónico (la columna vertebral de su identidad en línea), esta transparencia no solo es agradable de tener, sino que es esencial para una verdadera privacidad y seguridad.

### El problema del backend: dónde fallan la mayoría de los servicios de correo electrónico de código abierto {#the-backend-problem-where-most-open-source-email-services-fall-short}

Aquí es donde la cosa se pone interesante. Muchos proveedores de correo electrónico populares, centrados en la privacidad, se anuncian como de código abierto, pero hay una distinción crucial que esperan que no notes: **solo publican sus frontends en código abierto, mientras que sus backends son cerrados**.

¿Qué significa esto? El frontend es lo que ves y con lo que interactúas: la interfaz web o la aplicación móvil. El backend es donde se procesa el correo electrónico: donde se almacenan, cifran y transmiten tus mensajes. Cuando un proveedor mantiene su backend de código cerrado:

1. No puedes verificar cómo se procesan realmente tus correos electrónicos.
2. No puedes confirmar si sus declaraciones de privacidad son legítimas.
3. Confías en las afirmaciones de marketing en lugar del código verificable.
4. Las vulnerabilidades de seguridad pueden permanecer ocultas al escrutinio público.

Como se ha destacado en los foros de Guías de Privacidad, tanto Proton Mail como Tutanota afirman ser de código abierto, pero sus backends siguen siendo cerrados y propietarios. Esto crea una importante brecha de confianza: se te pide que creas en sus promesas de privacidad sin poder verificarlas.

## Reenvío de correo electrónico: 100 % de código abierto, frontend y backend {#forward-email-100-open-source-frontend-and-backend}

En Forward Email, hemos adoptado un enfoque radicalmente diferente. Todo nuestro código base, tanto el frontend como el backend, es de código abierto y está disponible para que cualquiera lo revise en <https://github.com/forwardemail/forwardemail.net>.

Esto significa:

1. **Transparencia total**: Cada línea de código que procesa tus correos electrónicos está disponible para el escrutinio público.
2. **Privacidad verificable**: Nuestras afirmaciones sobre privacidad no son pura publicidad: son hechos verificables que cualquiera puede confirmar examinando nuestro código.
3. **Seguridad impulsada por la comunidad**: Nuestra seguridad está reforzada por la experiencia colectiva de la comunidad global de desarrolladores.
4. **Sin funcionalidades ocultas**: Lo que ves es lo que obtienes: sin seguimiento oculto ni puertas traseras secretas.

### Nuestro enfoque técnico único {#our-unique-technical-approach}

Nuestro compromiso con la privacidad va más allá de ser de código abierto. Hemos implementado varias innovaciones técnicas que nos distinguen:

#### Buzones SQLite cifrados individualmente {#individually-encrypted-sqlite-mailboxes}

A diferencia de los proveedores de correo electrónico tradicionales que utilizan bases de datos relacionales compartidas (donde una sola filtración podría exponer los datos de todos los usuarios), utilizamos archivos SQLite cifrados individualmente para cada buzón. Esto significa:

* Cada buzón es un archivo cifrado independiente.
* El acceso a los datos de un usuario no otorga acceso a los demás.
* Ni siquiera nuestros propios empleados pueden acceder a sus datos; es una decisión de diseño fundamental.

Como explicamos en las discusiones sobre las Guías de privacidad:

Las bases de datos relacionales compartidas (p. ej., MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, etc.) requieren un inicio de sesión (con usuario y contraseña) para establecer la conexión. Esto significa que cualquiera con esta contraseña podría consultar la base de datos para cualquier cosa, ya sea un empleado deshonesto o un ataque de una empleada doméstica malvada. Esto también significa que tener acceso a los datos de un usuario implica también tener acceso a los de todos los demás. Por otro lado, SQLite podría considerarse una base de datos compartida, pero su uso (cada buzón = un archivo SQLite individual) la convierte en un espacio aislado.

#### Cifrado resistente a los datos cuánticos {#quantum-resistant-encryption}

Mientras otros proveedores aún se están poniendo al día, nosotros ya hemos implementado métodos de cifrado resistentes a la computación cuántica para proteger la privacidad de su correo electrónico frente a las amenazas emergentes de la computación cuántica.

#### Sin dependencias de terceros {#no-third-party-dependencies}

A diferencia de la competencia, que depende de servicios como Amazon SES para la entrega de correo electrónico, hemos desarrollado toda nuestra infraestructura internamente. Esto elimina posibles filtraciones de privacidad a través de servicios de terceros y nos brinda control total sobre todo el flujo de correo electrónico.

## La opción de autoalojamiento: libertad de elección {#the-self-hosting-option-freedom-of-choice}

Uno de los aspectos más potentes del software de código abierto es la libertad que ofrece. Con Forward Email, nunca estás limitado: puedes autoalojar toda nuestra plataforma si así lo deseas.

### Por qué apoyamos el autohospedaje {#why-we-support-self-hosting}

Creemos en brindar a los usuarios control total sobre sus datos. Por eso, hemos creado nuestra plataforma autoalojada, con documentación completa y guías de configuración. Este enfoque:

* Proporciona el máximo control para usuarios con inclinaciones técnicas
* Elimina la necesidad de confiar en nosotros como proveedor de servicios
* Permite la personalización para cumplir con requisitos específicos
* Garantiza que el servicio pueda continuar incluso si nuestra empresa no lo hace

### La realidad del correo electrónico autoalojado {#the-reality-of-self-hosting-email}

Si bien el autohospedaje es una opción poderosa, es importante comprender los costos reales involucrados:

#### Costos financieros {#financial-costs}

* Costos de VPS o servidor: $5-$50 al mes para una configuración básica\[^4]
* Registro y renovación de dominio: $10-$20 al año
* Certificados SSL (aunque Let's Encrypt ofrece opciones gratuitas)
* Posibles costos de servicios de monitoreo y soluciones de respaldo

#### Costos de tiempo {#time-costs}

* Configuración inicial: De varias horas a días, según la experiencia técnica.
* Mantenimiento continuo: De 5 a 10 horas al mes para actualizaciones, parches de seguridad y resolución de problemas.
* Curva de aprendizaje: Comprensión de los protocolos de correo electrónico, las mejores prácticas de seguridad y la administración del servidor.

#### Desafíos técnicos {#technical-challenges}

* Problemas de entrega de correo electrónico (mensajes marcados como spam)
* Mantenerse al día con los estándares de seguridad en constante evolución
* Garantizar una alta disponibilidad y fiabilidad
* Gestionar eficazmente el filtrado de spam

Como dijo un experimentado autoalojador: "El correo electrónico es un servicio básico... Es más barato alojar mi correo electrónico en [un proveedor] que gastar dinero *y* tiempo en autoalojar el correo electrónico". [^6]

## Por qué nuestro servicio pago tiene sentido (aunque seamos de código abierto) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Considerando los desafíos del autohospedaje, nuestro servicio pago ofrece lo mejor de ambos mundos: la transparencia y seguridad del código abierto con la conveniencia y confiabilidad de un servicio administrado.

### Comparación de costos {#cost-comparison}

Si tenemos en cuenta los costes financieros y de tiempo, nuestro servicio pago ofrece un valor excepcional:

**Costo total del autoalojamiento**: $56-$252/mes (incluidos los costos del servidor y la valoración del tiempo)
* **Planes de pago de reenvío de correo electrónico**: $3-$9/mes

Nuestro servicio de pago ofrece:

* Gestión y mantenimiento profesionales
* Reputación IP consolidada para una mejor entrega
* Actualizaciones y supervisión de seguridad periódicas
* Soporte técnico ante cualquier incidencia
* Todos los beneficios de privacidad de nuestro enfoque de código abierto

### Lo mejor de ambos mundos {#the-best-of-both-worlds}

Al elegir Reenviar correo electrónico, obtendrá:

1. **Privacidad verificable**: Nuestro código abierto le permite confiar en nuestras declaraciones de privacidad.
2. **Gestión profesional**: No necesita ser un experto en servidores de correo electrónico.
3. **Rentabilidad**: Menor costo total que el autoalojamiento.
4. **Sin dependencia**: La opción de autoalojamiento siempre está disponible.

El engaño de las fuentes cerradas: lo que Proton y Tutanota no te cuentan {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Analicemos con más detalle cómo nuestro enfoque se diferencia del de los proveedores de correo electrónico más populares "centrados en la privacidad".

### Afirmaciones de código abierto de Proton Mail {#proton-mails-open-source-claims}

Proton Mail se anuncia como de código abierto, pero esto solo aplica a sus aplicaciones frontend. Su backend —donde se procesan y almacenan tus correos electrónicos— sigue siendo de código cerrado. Esto significa:

* No puedes verificar cómo se gestionan tus correos electrónicos.
* Debes confiar en sus declaraciones de privacidad sin verificación.
* Las vulnerabilidades de seguridad en su backend permanecen ocultas al escrutinio público.
* Estás atado a su ecosistema sin opciones de autoalojamiento.

### Enfoque similar de Tutanota {#tutanotas-similar-approach}

Al igual que Proton Mail, Tutanota solo publica su interfaz en código abierto, mientras que su backend es propietario. [^8] Se enfrentan a los mismos problemas de confianza:

* Imposibilidad de verificar las declaraciones de privacidad del backend
* Transparencia limitada en el procesamiento real del correo electrónico
* Posibles problemas de seguridad ocultos al público
* Dependencia de un proveedor sin opción de autoalojamiento

### El debate sobre las guías de privacidad {#the-privacy-guides-debate}

Estas limitaciones no han pasado desapercibidas en la comunidad de privacidad. En los debates sobre las Guías de Privacidad, destacamos esta distinción crucial:

> "Afirma que tanto Protonmail como Tuta son de código cerrado. Porque su backend es, efectivamente, de código cerrado."\[^9]

También dijimos:

> "No se han realizado auditorías públicas de las infraestructuras de backend de ningún proveedor de servicios de correo electrónico de PG que figure actualmente en la lista, ni se han compartido fragmentos de código fuente abierto sobre cómo procesan el correo electrónico entrante".\[^10]

Esta falta de transparencia crea un problema fundamental de confianza. Sin backends de código abierto, los usuarios se ven obligados a confiar en las declaraciones de privacidad en lugar de basarse en la verificación.

## El futuro es de código abierto {#the-future-is-open-source}

La tendencia hacia las soluciones de código abierto se está acelerando en la industria del software. Según investigaciones recientes:

* El mercado de software de código abierto está creciendo de 41.830 millones de dólares en 2024 a 48.920 millones de dólares en 2025\[^11]
* El 80 % de las empresas informan un mayor uso de código abierto durante el último año\[^12]
* Se proyecta que la adopción de código abierto continuará su rápida expansión.

Este crecimiento refleja un cambio fundamental en nuestra concepción de la seguridad y la privacidad del software. A medida que los usuarios se preocupan más por la privacidad, la demanda de privacidad verificable mediante soluciones de código abierto no hará más que aumentar.

### Por qué el código abierto está ganando {#why-open-source-is-winning}

Las ventajas del código abierto son cada vez más claras:

1. **Seguridad a través de la transparencia**: El código abierto puede ser revisado por miles de expertos, no solo por un equipo interno.
2. **Innovación más rápida**: El desarrollo colaborativo acelera la mejora.
3. **Confianza a través de la verificación**: Las afirmaciones pueden verificarse en lugar de aceptarse sin más.
4. **Libertad de dependencia de proveedores**: Los usuarios mantienen el control sobre sus datos y servicios.
5. **Soporte comunitario**: Una comunidad global ayuda a identificar y solucionar problemas.

## Haciendo el cambio al reenvío de correo electrónico {#making-the-switch-to-forward-email}

Pasar a Forward Email es sencillo, independientemente de si proviene de un proveedor tradicional como Gmail u otro servicio centrado en la privacidad como Proton Mail o Tutanota.

Nuestro servicio ofrece:

* Dominios y alias ilimitados
* Compatibilidad con protocolos estándar (SMTP, IMAP, POP3) sin puentes propietarios
* Integración perfecta con clientes de correo electrónico existentes
* Proceso de configuración sencillo con documentación completa
* Planes de precios asequibles desde solo $3 al mes

## Conclusión: Correo electrónico de código abierto para un futuro privado {#conclusion-open-source-email-for-a-private-future}

En un mundo donde la privacidad digital está cada vez más amenazada, la transparencia de las soluciones de código abierto ofrece una protección crucial. En Forward Email, nos enorgullece ser pioneros con nuestro enfoque totalmente de código abierto para la privacidad del correo electrónico.

A diferencia de la competencia, que solo adopta parcialmente el código abierto, hemos puesto a disposición del público toda nuestra plataforma (frontend y backend). Este compromiso con la transparencia, combinado con nuestro innovador enfoque técnico, proporciona un nivel de privacidad verificable que las alternativas de código cerrado simplemente no pueden igualar.

Ya sea que elija utilizar nuestro servicio administrado o alojar usted mismo nuestra plataforma, se beneficiará de la seguridad, privacidad y tranquilidad que brinda un correo electrónico verdaderamente de código abierto.

El futuro del correo electrónico es abierto, transparente y prioriza la privacidad. El futuro es el reenvío de correo electrónico.

\[^1]: SNS Insider. "El mercado de servicios de código abierto se valoró en 28.600 millones de dólares en 2023 y alcanzará los 114.800 millones de dólares en 2032, con una tasa de crecimiento anual compuesta (TCAC) del 16,70 % para ese año". [Informe de tamaño y análisis del mercado de servicios de código abierto 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Comunidad de Guías de Privacidad. "Reenvío de correo electrónico (proveedor de correo electrónico) - Desarrollo del sitio / Sugerencias de herramientas". [Discusión sobre guías de privacidad](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Comunidad de Guías de Privacidad. "Reenvío de correo electrónico (proveedor de correo electrónico) - Desarrollo del sitio / Sugerencias de herramientas". [Discusión sobre guías de privacidad](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Por lo general, puede esperar gastar entre $5 y $50 al mes en un servidor privado virtual (VPS) básico para administrar su servidor de correo electrónico." [Las 10 mejores plataformas de servidores de correo electrónico autoalojados para usar en 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Foro de Mail-in-a-Box. "El mantenimiento me llevó unas 16 horas en ese periodo..." [Los servidores de correo autoalojados están mal vistos](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. "En resumen: Como todo lo que se aloja en uno mismo, REQUERIRÁ TU TIEMPO. Si no tienes tiempo para dedicarle, siempre es mejor optar por un hosting..." [¿Autoalojar un servidor de correo electrónico? ¿Por qué sí o por qué no? ¿Qué es popular?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Reenvío de correo electrónico. "Proton Mail afirma ser de código abierto, pero su backend en realidad es de código cerrado." [Comparación entre Tutanota y Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Reenviar correo electrónico. "Tutanota afirma ser de código abierto, pero su backend es de código cerrado." [Comparación entre Proton Mail y Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Comunidad de Guías de Privacidad. "Afirma que tanto Protonmail como Tuta son de código cerrado. Porque su backend sí lo es." [Reenvío de correo electrónico (proveedor de correo electrónico): Desarrollo del sitio / Sugerencias de herramientas](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Comunidad de Guías de Privacidad. "No se han publicado auditorías de las infraestructuras de backend de ningún proveedor de servicios de correo electrónico de PG que figure actualmente en la lista, ni se han compartido fragmentos de código abierto sobre cómo procesan el correo electrónico entrante." [Reenvío de correo electrónico (proveedor de correo electrónico): Desarrollo del sitio / Sugerencias de herramientas](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "El mercado del software de código abierto crecerá de 41.830 millones de dólares en 2024 a 48.920 millones de dólares en 2025 a una tasa compuesta..." [¿Qué es el software de código abierto?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Con el 80% de las empresas reportando un mayor uso de tecnologías de código abierto durante el último año, es..." [Tendencias emergentes en las comunidades de código abierto 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)