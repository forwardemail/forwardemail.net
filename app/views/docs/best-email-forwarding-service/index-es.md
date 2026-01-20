# Cómo el reenvío de correo electrónico protege su privacidad, dominio y seguridad: análisis técnico profundo {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" class="rounded-lg" />

## Tabla de contenido {#table-of-contents}

* [Prefacio](#foreword)
* [La filosofía de privacidad del correo electrónico de reenvío](#the-forward-email-privacy-philosophy)
* [Implementación de SQLite: durabilidad y portabilidad para sus datos](#sqlite-implementation-durability-and-portability-for-your-data)
* [Mecanismo de cola inteligente y reintento: garantizar la entrega del correo electrónico](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Recursos ilimitados con limitación de velocidad inteligente](#unlimited-resources-with-intelligent-rate-limiting)
* [Cifrado en espacio aislado para mayor seguridad](#sandboxed-encryption-for-enhanced-security)
* [Procesamiento de correo electrónico en memoria: sin almacenamiento en disco para máxima privacidad](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Cifrado de extremo a extremo con OpenPGP para una privacidad total](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Protección de contenido multicapa para una seguridad integral](#multi-layered-content-protection-for-comprehensive-security)
* [En qué nos diferenciamos de otros servicios de correo electrónico: la ventaja de la privacidad técnica](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Transparencia de código abierto para una privacidad verificable](#open-source-transparency-for-verifiable-privacy)
  * [Sin ataduras a proveedores para una privacidad sin concesiones](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Datos en espacio aislado para un verdadero aislamiento](#sandboxed-data-for-true-isolation)
  * [Portabilidad y control de datos](#data-portability-and-control)
* [Los desafíos técnicos del reenvío de correo electrónico que prioriza la privacidad](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Gestión de memoria para el procesamiento de correo electrónico sin registro](#memory-management-for-no-logging-email-processing)
  * [Detección de spam sin análisis de contenido para un filtrado que preserva la privacidad](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Mantener la compatibilidad con el diseño que prioriza la privacidad](#maintaining-compatibility-with-privacy-first-design)
* [Prácticas recomendadas de privacidad para usuarios de correo electrónico de reenvío](#privacy-best-practices-for-forward-email-users)
* [Conclusión: El futuro del reenvío de correo electrónico privado](#conclusion-the-future-of-private-email-forwarding)

## Prólogo {#foreword}

En el panorama digital actual, la privacidad del correo electrónico se ha vuelto más crucial que nunca. Ante las filtraciones de datos, la preocupación por la vigilancia y la publicidad dirigida basada en el contenido del correo electrónico, los usuarios buscan cada vez más soluciones que prioricen su privacidad. En Forward Email, hemos desarrollado nuestro servicio desde cero, con la privacidad como piedra angular de nuestra arquitectura. Esta entrada de blog explora las implementaciones técnicas que convierten a nuestro servicio en una de las soluciones de reenvío de correo electrónico más centradas en la privacidad del mercado.

## La filosofía de privacidad del correo electrónico de reenvío {#the-forward-email-privacy-philosophy}

Antes de profundizar en los detalles técnicos, es importante comprender nuestra filosofía fundamental de privacidad: **sus correos electrónicos le pertenecen a usted y solo a usted**. Este principio guía cada decisión técnica que tomamos, desde cómo gestionamos el reenvío de correo electrónico hasta cómo implementamos el cifrado.

A diferencia de muchos proveedores de correo electrónico que escanean sus mensajes con fines publicitarios o los almacenan indefinidamente en sus servidores, Forward Email opera con un enfoque radicalmente diferente:

1. **Solo procesamiento en memoria**: no almacenamos los correos reenviados en el disco.
2. **Sin almacenamiento de metadatos**: no guardamos registros de quién envía correos a quién.
3. **100 % de código abierto**: todo nuestro código base es transparente y auditable.
4. **Cifrado de extremo a extremo**: admitimos OpenPGP para comunicaciones verdaderamente privadas.

## Implementación de SQLite: durabilidad y portabilidad para sus datos {#sqlite-implementation-durability-and-portability-for-your-data}

Una de las ventajas de privacidad más significativas de Forward Email es nuestra implementación de [SQLite](https://en.wikipedia.org/wiki/SQLite), cuidadosamente diseñada. Hemos optimizado SQLite con configuraciones PRAGMA específicas y [Registro de escritura anticipada (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) para garantizar la durabilidad y la portabilidad de sus datos, manteniendo los más altos estándares de privacidad y seguridad.

A continuación se muestra cómo implementamos SQLite con [ChaCha20-Poli1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) como cifrado para cifrado resistente a los datos cuánticos:

```javascript
// Initialize the database with better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Set up encryption with ChaCha20-Poly1305 cipher
db.pragma(`key="${decrypt(session.user.password)}"`);

// Enable Write-Ahead Logging for durability and performance
db.pragma('journal_mode=WAL');

// Overwrite deleted content with zeros for privacy
db.pragma('secure_delete=ON');

// Enable auto vacuum for efficient storage management
db.pragma('auto_vacuum=FULL');

// Set busy timeout for handling concurrent access
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Optimize synchronization for reliability
db.pragma('synchronous=NORMAL');

// Enable foreign key constraints for data integrity
db.pragma('foreign_keys=ON');

// Set UTF-8 encoding for international character support
db.pragma(`encoding='UTF-8'`);

// Optimize database performance
db.pragma('optimize=0x10002;');

// Use disk for temporary storage instead of memory
db.pragma('temp_store=1;');
```

Esta implementación garantiza que sus datos no solo estén seguros, sino también sean portátiles. Puede recuperar su correo electrónico en cualquier momento exportándolo en los formatos [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) o SQLite. Y cuando desee eliminar sus datos, desaparecerán por completo: simplemente eliminamos los archivos del almacenamiento en disco en lugar de ejecutar comandos SQL DELETE ROW, que pueden dejar rastros en la base de datos.

El aspecto de cifrado cuántico de nuestra implementación utiliza ChaCha20-Poly1305 como cifrado cuando inicializamos la base de datos, lo que proporciona una sólida protección contra amenazas actuales y futuras a la privacidad de sus datos.

## Mecanismo de cola inteligente y reintento: garantizar la entrega del correo electrónico {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

En lugar de centrarnos únicamente en la gestión de encabezados, hemos implementado un sofisticado mecanismo inteligente de cola y reintento con nuestro método `getBounceInfo`. Este sistema garantiza que sus correos electrónicos tengan la mayor probabilidad de entregarse, incluso ante problemas temporales.

```javascript
function getBounceInfo(err) {
  // Initialize bounce info with default values
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analyze error response to determine appropriate action
  const response = err.response || err.message || '';

  // Determine if the issue is temporary or permanent
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorize the bounce reason for appropriate handling
  if (response.includes('mailbox full')) {
    bounceInfo.category = 'full';
    bounceInfo.action = 'defer';
  } else if (response.includes('user unknown')) {
    bounceInfo.category = 'unknown';
  }

  return bounceInfo;
}
```

> \[!NOTE]
> Este es un extracto del método `getBounceInfo` y no la implementación completa. Para ver el código completo, puede consultarlo en [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Reintentamos la entrega del correo durante 5 días, similar a los estándares de la industria como [Sufijo](https://en.wikipedia.org/wiki/Postfix_\(software\), lo que permite que los problemas temporales se resuelvan por sí solos. Este enfoque mejora significativamente las tasas de entrega, a la vez que protege la privacidad.

De forma similar, también redactamos el contenido de los correos electrónicos SMTP salientes tras su entrega. Esto está configurado en nuestro sistema de almacenamiento con un periodo de retención predeterminado de 30 días, que puede ajustar en la configuración avanzada de su dominio. Transcurrido este periodo, el contenido del correo electrónico se redacta y elimina automáticamente, quedando únicamente un mensaje provisional:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Este enfoque garantiza que los correos electrónicos enviados no permanezcan almacenados indefinidamente, lo que reduce el riesgo de violaciones de datos o acceso no autorizado a sus comunicaciones.

## Recursos ilimitados con limitación de velocidad inteligente {#unlimited-resources-with-intelligent-rate-limiting}

Aunque Forward Email ofrece dominios y alias ilimitados, hemos implementado una limitación de velocidad inteligente para proteger nuestro sistema del abuso y garantizar un uso justo para todos los usuarios. Por ejemplo, los clientes no empresariales pueden crear hasta más de 50 alias al día, lo que evita que nuestra base de datos reciba spam y se sature, y permite que nuestras funciones de protección contra abusos en tiempo real funcionen eficazmente.

```javascript
// Rate limiter implementation
const rateLimiter = new RateLimiter({
  // Configuration settings
});

// Check rate limits before processing
const limit = await rateLimiter.get({
  key: `domain:${domain.id}`,
  duration: ms('1d')
});

// Apply appropriate action based on limit status
if (limit.remaining <= 0) {
  // Handle rate limit exceeded
}
```

Este enfoque equilibrado le brinda la flexibilidad de crear tantas direcciones de correo electrónico como necesite para una gestión integral de la privacidad, manteniendo al mismo tiempo la integridad y el rendimiento de nuestro servicio para todos los usuarios.

## Cifrado en espacio aislado para mayor seguridad {#sandboxed-encryption-for-enhanced-security}

Nuestro exclusivo enfoque de cifrado en espacio aislado ofrece una ventaja de seguridad crucial que muchos usuarios pasan por alto al elegir un servicio de correo electrónico. Analicemos por qué es tan importante el aislamiento de datos, especialmente el correo electrónico.

Es muy probable que servicios como Gmail y Proton utilicen [bases de datos relacionales](https://en.wikipedia.org/wiki/Relational_database) compartido, lo que crea una vulnerabilidad de seguridad fundamental. En un entorno de base de datos compartida, si alguien accede a los datos de un usuario, potencialmente también tendrá acceso a los datos de otros usuarios. Esto se debe a que todos los datos de los usuarios residen en las mismas tablas de la base de datos, separados únicamente por sus ID de usuario o identificadores similares.

Forward Email adopta un enfoque fundamentalmente diferente con nuestro cifrado en espacio aislado:

1. **Aislamiento completo**: Los datos de cada usuario se almacenan en su propio archivo de base de datos SQLite cifrado, completamente aislado de otros usuarios.
2. **Claves de cifrado independientes**: Cada base de datos se cifra con su propia clave única derivada de la contraseña del usuario.
3. **Sin almacenamiento compartido**: A diferencia de las bases de datos relacionales, donde los correos electrónicos de todos los usuarios podrían estar en una única tabla de correos electrónicos, nuestro enfoque garantiza que no se mezclen los datos.
4. **Defensa exhaustiva**: Incluso si la base de datos de un usuario se viera comprometida, no proporcionaría acceso a los datos de ningún otro usuario.

Este enfoque de espacio aislado es similar a tener su correo electrónico en una bóveda física independiente en lugar de en un centro de almacenamiento compartido con divisiones internas. Se trata de una diferencia arquitectónica fundamental que mejora significativamente su privacidad y seguridad.

## Procesamiento de correo electrónico en memoria: sin almacenamiento en disco para máxima privacidad {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Para nuestro servicio de reenvío de correo electrónico, procesamos los correos electrónicos íntegramente en RAM y nunca los escribimos en discos ni bases de datos. Este enfoque proporciona una protección inigualable contra la vigilancia del correo electrónico y la recopilación de metadatos.

A continuación se muestra una visión simplificada de cómo funciona nuestro procesamiento de correo electrónico:

```javascript
async function onData(stream, _session, fn) {
  // Store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  try {
    // Process the email stream in memory
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });
    stream.pipe(messageSplitter);
    const body = await getStream.buffer(messageSplitter);

    const { headers } = messageSplitter;

    // Update session object with useful debug info for error logs
    await updateSession.call(this, body, headers, session);

    // Process the email without storing to disk
    // [Processing code omitted for brevity]

    // Return success without persisting email data
    fn();
  } catch (err) {
    // Handle errors without storing sensitive information
    fn(err);
  }
}
```

Este enfoque significa que, incluso si nuestros servidores se vieran comprometidos, no habría datos históricos de correo electrónico a los que los atacantes pudieran acceder. Sus correos electrónicos simplemente pasan por nuestro sistema y se reenvían inmediatamente a su destino sin dejar rastro. Este enfoque de reenvío de correo electrónico sin registro es fundamental para proteger sus comunicaciones de la vigilancia.

## Cifrado de extremo a extremo con OpenPGP para una privacidad completa {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Para los usuarios que requieren el máximo nivel de protección de la privacidad frente a la vigilancia del correo electrónico, ofrecemos compatibilidad con [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) para el cifrado de extremo a extremo. A diferencia de muchos proveedores de correo electrónico que requieren puentes o aplicaciones propietarias, nuestra implementación funciona con clientes de correo electrónico estándar, lo que facilita el acceso a la comunicación segura para todos.

Así es como implementamos el cifrado OpenPGP:

```javascript
async function encryptMessage(pubKeyArmored, raw, isArmored = true) {
  // [Initial validation code omitted for brevity]

  // Read the public key
  const pubKey = isArmored
    ? await openpgp.readKey({
        armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
        config: { tolerant: true }
      })
    : pubKeyArmored;

  if (!pubKey) throw new TypeError('Public key does not exist');

  // Perform the actual encryption using OpenPGP
  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({
      binary: Buffer.concat([Buffer.from(bodyHeaders + '\r\n\r\n'), body])
    }),
    encryptionKeys: pubKey,
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  // Format the encrypted message as a proper MIME message
  // [MIME formatting code omitted for brevity]

  return Buffer.concat([headers, breaker, Buffer.from(text)]);
}
```

Esta implementación garantiza que sus correos electrónicos se cifren antes de salir de su dispositivo y que solo el destinatario pueda descifrarlos, manteniendo así la privacidad de sus comunicaciones, incluso para nosotros. Esto es esencial para proteger las comunicaciones confidenciales del acceso no autorizado y la vigilancia.

## Protección de contenido multicapa para una seguridad integral {#multi-layered-content-protection-for-comprehensive-security}

Forward Email ofrece múltiples capas de protección de contenido que están habilitadas de forma predeterminada para brindar seguridad integral contra diversas amenazas:

1. **Protección de contenido para adultos**: Filtra contenido inapropiado sin comprometer la privacidad.
2. **Protección [Suplantación de identidad (phishing)](https://en.wikipedia.org/wiki/Phishing)**: Bloquea los intentos de robo de información y preserva el anonimato.
3. **Protección ejecutable**: Previene archivos adjuntos potencialmente dañinos sin analizar el contenido.
4. **Protección [Virus](https://en.wikipedia.org/wiki/Computer_virus)**: Analiza en busca de malware mediante técnicas que preservan la privacidad.

A diferencia de muchos proveedores que permiten habilitar estas funciones, nosotros las hemos deshabilitado, lo que garantiza que todos los usuarios se beneficien de estas protecciones por defecto. Este enfoque refleja nuestro compromiso con la privacidad y la seguridad, ofreciendo un equilibrio que muchos servicios de correo electrónico no logran.

## En qué nos diferenciamos de otros servicios de correo electrónico: la ventaja técnica de la privacidad {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Al comparar Forward Email con otros servicios de correo electrónico, varias diferencias técnicas clave resaltan nuestro enfoque de privacidad primero:

### Transparencia de código abierto para una privacidad verificable {#open-source-transparency-for-verifiable-privacy}

Aunque muchos proveedores de correo electrónico afirman ser de código abierto, suelen mantener su código backend cerrado. Forward Email es 100% [código abierto](https://en.wikipedia.org/wiki/Open_source), incluyendo tanto el código frontend como el backend. Esta transparencia permite una auditoría de seguridad independiente de todos los componentes, lo que garantiza que cualquier persona pueda verificar nuestras declaraciones de privacidad.

### Sin dependencia de proveedores para una privacidad sin concesiones {#no-vendor-lock-in-for-privacy-without-compromise}

Muchos proveedores de correo electrónico que priorizan la privacidad requieren el uso de sus aplicaciones o puentes propietarios. Forward Email funciona con cualquier cliente de correo electrónico estándar mediante los protocolos [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) y [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), lo que le da la libertad de elegir su software de correo electrónico preferido sin comprometer la privacidad.

### Datos en espacio aislado para un verdadero aislamiento {#sandboxed-data-for-true-isolation}

A diferencia de los servicios que utilizan bases de datos compartidas donde se combinan los datos de todos los usuarios, nuestro enfoque de espacio aislado garantiza que los datos de cada usuario estén completamente aislados. Esta diferencia arquitectónica fundamental ofrece garantías de privacidad significativamente más sólidas que las que ofrecen la mayoría de los servicios de correo electrónico.

### Portabilidad y control de datos {#data-portability-and-control}

Creemos que tus datos te pertenecen, por eso te facilitamos la exportación de tus correos electrónicos en formatos estándar (MBOX, EML, SQLite) y la eliminación definitiva de tus datos cuando lo desees. Este nivel de control es poco común entre los proveedores de correo electrónico, pero es esencial para una verdadera privacidad.

## Los desafíos técnicos del reenvío de correo electrónico que prioriza la privacidad {#the-technical-challenges-of-privacy-first-email-forwarding}

Desarrollar un servicio de correo electrónico que priorice la privacidad conlleva importantes desafíos técnicos. Estos son algunos de los obstáculos que hemos superado:

### Gestión de memoria para el procesamiento de correo electrónico sin registro {#memory-management-for-no-logging-email-processing}

Procesar correos electrónicos en memoria sin almacenamiento en disco requiere una gestión cuidadosa de la memoria para gestionar grandes volúmenes de tráfico de correo electrónico de forma eficiente. Hemos implementado técnicas avanzadas de optimización de memoria para garantizar un rendimiento fiable sin comprometer nuestra política de no almacenamiento, un componente fundamental de nuestra estrategia de protección de la privacidad.

### Detección de spam sin análisis de contenido para filtrado que preserva la privacidad {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

La mayoría de los sistemas de detección de [correo basura](https://en.wikipedia.org/wiki/Email_spam) se basan en el análisis del contenido del correo electrónico, lo cual contradice nuestros principios de privacidad. Hemos desarrollado técnicas para identificar patrones de spam sin leer el contenido de sus correos electrónicos, logrando un equilibrio entre privacidad y usabilidad que preserva la confidencialidad de sus comunicaciones.

### Manteniendo la compatibilidad con el diseño que prioriza la privacidad {#maintaining-compatibility-with-privacy-first-design}

Garantizar la compatibilidad con todos los clientes de correo electrónico e implementar funciones avanzadas de privacidad ha requerido soluciones de ingeniería creativas. Nuestro equipo ha trabajado incansablemente para que la privacidad sea perfecta, para que no tenga que elegir entre comodidad y seguridad al proteger sus comunicaciones por correo electrónico.

## Mejores prácticas de privacidad para usuarios de correo electrónico de reenvío {#privacy-best-practices-for-forward-email-users}

Para maximizar su protección contra la vigilancia del correo electrónico y maximizar su privacidad al utilizar Forward Email, le recomendamos las siguientes prácticas recomendadas:

1. **Usa alias únicos para diferentes servicios**: crea un alias de correo electrónico diferente para cada servicio al que te suscribas para evitar el seguimiento entre servicios.
2. **Habilita el cifrado OpenPGP**: para comunicaciones sensibles, usa cifrado de extremo a extremo para garantizar una privacidad total.
3. **Rota regularmente tus alias de correo electrónico**: actualiza periódicamente los alias de los servicios importantes para minimizar la recopilación de datos a largo plazo.
4. **Usa contraseñas seguras y únicas**: protege tu cuenta de Forward Email con una contraseña segura para evitar el acceso no autorizado.
5. **Implementa la anonimización [Dirección IP](https://en.wikipedia.org/wiki/IP_address)**: considera usar [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) junto con Forward Email para un anonimato total.

## Conclusión: El futuro del reenvío de correo electrónico privado {#conclusion-the-future-of-private-email-forwarding}

En Forward Email, creemos que la privacidad no es solo una característica, sino un derecho fundamental. Nuestras implementaciones técnicas reflejan esta convicción, brindándole un reenvío de correo electrónico que respeta su privacidad en todos los niveles y lo protege de la vigilancia del correo electrónico y la recopilación de metadatos.

A medida que continuamos desarrollando y mejorando nuestro servicio, nuestro compromiso con la privacidad se mantiene inquebrantable. Investigamos constantemente nuevos métodos de cifrado, exploramos protecciones adicionales de privacidad y perfeccionamos nuestro código para brindar la experiencia de correo electrónico más segura posible.

Al elegir Reenviar correo electrónico, no solo selecciona un servicio de correo electrónico, sino que apoya una visión de internet donde la privacidad es la norma, no la excepción. Únase a nosotros para construir un futuro digital más privado, un correo electrónico a la vez.

<!-- *Palabras clave: reenvío de correo electrónico privado, protección de la privacidad del correo electrónico, servicio de correo electrónico seguro, correo electrónico de código abierto, cifrado cuántico, correo electrónico OpenPGP, procesamiento de correo electrónico en memoria, servicio de correo electrónico sin registros, protección de metadatos del correo electrónico, privacidad del encabezado del correo electrónico, correo electrónico cifrado de extremo a extremo, correo electrónico que prioriza la privacidad, reenvío de correo electrónico anónimo, mejores prácticas de seguridad del correo electrónico, protección del contenido del correo electrónico, protección contra phishing, análisis de virus del correo electrónico, proveedor de correo electrónico centrado en la privacidad, encabezados de correo electrónico seguros, implementación de la privacidad del correo electrónico, protección contra la vigilancia del correo electrónico, reenvío de correo electrónico sin registros, evitar la fuga de metadatos del correo electrónico, técnicas de privacidad del correo electrónico, anonimización de direcciones IP para correo electrónico, alias de correo electrónico privados, seguridad del reenvío de correo electrónico, privacidad del correo electrónico de los anunciantes, cifrado de correo electrónico resistente a la tecnología cuántica, privacidad del correo electrónico sin concesiones, almacenamiento de correo electrónico SQLite, cifrado de correo electrónico en espacio aislado, portabilidad de datos para correo electrónico* -->