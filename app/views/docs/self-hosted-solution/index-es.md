# Correo electrónico autoalojado: Compromiso con el código abierto {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Tabla de contenido {#table-of-contents}

* [Prefacio](#foreword)
* [Por qué es importante el correo electrónico autoalojado](#why-self-hosted-email-matters)
  * [El problema con los servicios de correo electrónico tradicionales](#the-problem-with-traditional-email-services)
  * [La alternativa autoalojada](#the-self-hosted-alternative)
* [Nuestra implementación autoalojada: descripción técnica](#our-self-hosted-implementation-technical-overview)
  * [Arquitectura basada en Docker para simplicidad y portabilidad](#docker-based-architecture-for-simplicity-and-portability)
  * [Instalación de scripts Bash: la accesibilidad se une a la seguridad](#bash-script-installation-accessibility-meets-security)
  * [Cifrado cuántico seguro para una privacidad a prueba de futuro](#quantum-safe-encryption-for-future-proof-privacy)
  * [Mantenimiento y actualizaciones automatizadas](#automated-maintenance-and-updates)
* [El compromiso con el código abierto](#the-open-source-commitment)
* [Alojamiento propio vs. administrado: la elección correcta](#self-hosted-vs-managed-making-the-right-choice)
  * [La realidad del correo electrónico autoalojado](#the-reality-of-self-hosting-email)
  * [Cuándo elegir nuestro servicio gestionado](#when-to-choose-our-managed-service)
* [Introducción al reenvío de correo electrónico autoalojado](#getting-started-with-self-hosted-forward-email)
  * [Requisitos del sistema](#system-requirements)
  * [Pasos de instalación](#installation-steps)
* [El futuro del correo electrónico autoalojado](#the-future-of-self-hosted-email)
* [Conclusión: Libertad de correo electrónico para todos](#conclusion-email-freedom-for-everyone)
* [Referencias](#references)

## Prólogo {#foreword}

En el panorama digital actual, el correo electrónico sigue siendo la base de nuestra identidad y comunicación en línea. Sin embargo, a medida que crece la preocupación por la privacidad, muchos usuarios se enfrentan a una difícil decisión: comodidad a costa de la privacidad, o privacidad a costa de comodidad. En Forward Email, siempre hemos creído que no debería tener que elegir entre ambas opciones.

Hoy nos complace anunciar un hito importante en nuestra trayectoria: el lanzamiento de nuestra solución de correo electrónico autoalojada. Esta función representa nuestro firme compromiso con los principios de código abierto, el diseño centrado en la privacidad y el empoderamiento del usuario. Con nuestra opción autoalojada, ponemos todo el control de sus comunicaciones por correo electrónico directamente en sus manos.

Esta publicación de blog explora la filosofía detrás de nuestra solución autohospedada, su implementación técnica y por qué es importante para los usuarios que priorizan tanto la privacidad como la propiedad en sus comunicaciones digitales.

## Por qué es importante el correo electrónico autoalojado {#why-self-hosted-email-matters}

Nuestra solución de correo electrónico autoalojada es la expresión más clara de nuestra convicción de que la verdadera privacidad implica control, y el control empieza con el código abierto. Para los usuarios que exigen plena propiedad sobre sus comunicaciones digitales, el autoalojamiento ya no es una idea marginal: es un derecho esencial. Nos enorgullece respaldar esta convicción con una plataforma totalmente abierta y verificable que puede gestionar bajo sus propios términos.

### El problema con los servicios de correo electrónico tradicionales {#the-problem-with-traditional-email-services}

Los servicios de correo electrónico tradicionales presentan varios desafíos fundamentales para los usuarios preocupados por la privacidad:

1. **Requisitos de confianza**: Debe confiar en que el proveedor no accederá, analizará ni compartirá sus datos.
2. **Control centralizado**: Su acceso puede ser revocado en cualquier momento y por cualquier motivo.
3. **Vulnerabilidad de vigilancia**: Los servicios centralizados son objetivos prioritarios de la vigilancia.
4. **Transparencia limitada**: La mayoría de los servicios utilizan software propietario de código cerrado.
5. **Dependencia del proveedor**: Migrar de estos servicios puede ser difícil o imposible.

Incluso los proveedores de correo electrónico centrados en la privacidad a menudo se quedan cortos al publicar únicamente sus aplicaciones frontend de código abierto, mientras que sus sistemas backend son propietarios y cerrados. Esto crea una importante brecha de confianza: se le pide al usuario que crea en sus promesas de privacidad sin poder verificarlas.

### La alternativa autoalojada {#the-self-hosted-alternative}

El autohospedaje de su correo electrónico proporciona un enfoque fundamentalmente diferente:

1. **Control total**: Usted posee y controla toda la infraestructura de correo electrónico
2. **Privacidad verificable**: Todo el sistema es transparente y auditable
3. **Sin necesidad de confianza**: No necesita confiar sus comunicaciones a terceros
4. **Libertad de personalización**: Adapte el sistema a sus necesidades específicas
5. **Resiliencia**: Su servicio continúa independientemente de las decisiones de la empresa

Como dijo un usuario: "Alojar mi propio correo electrónico es el equivalente digital a cultivar mi propia comida: requiere más trabajo, pero sé exactamente qué contiene".

## Nuestra implementación autohospedada: descripción técnica {#our-self-hosted-implementation-technical-overview}

Nuestra solución de correo electrónico autoalojada se basa en los mismos principios de privacidad que rigen todos nuestros productos. Exploremos la implementación técnica que lo hace posible.

### Arquitectura basada en Docker para simplicidad y portabilidad {#docker-based-architecture-for-simplicity-and-portability}

Hemos empaquetado toda nuestra infraestructura de correo electrónico con Docker, lo que facilita su implementación en prácticamente cualquier sistema Linux. Este enfoque contenedorizado ofrece varias ventajas clave:

1. **Implementación simplificada**: Un solo comando configura toda la infraestructura
2. **Entorno consistente**: Elimina los problemas de "funciona en mi máquina"
3. **Componentes aislados**: Cada servicio se ejecuta en su propio contenedor para mayor seguridad
4. **Actualizaciones sencillas**: Comandos sencillos para actualizar toda la pila
5. **Dependencias mínimas**: Solo requiere Docker y Docker Compose

La arquitectura incluye contenedores para:

* Interfaz web para administración
* Servidor SMTP para correo saliente
* Servidores IMAP/POP3 para recuperación de correo
* Servidor CalDAV para calendarios
* Servidor CardDAV para contactos
* Base de datos para almacenamiento de configuración
* Redis para almacenamiento en caché y rendimiento
* SQLite para almacenamiento seguro y cifrado de buzones de correo

> \[!NOTE]
> No olvides consultar nuestro [guía para desarrolladores autoalojados](https://forwardemail.net/self-hosted)

### Instalación del script Bash: la accesibilidad se une a la seguridad {#bash-script-installation-accessibility-meets-security}

Hemos diseñado el proceso de instalación para que sea lo más simple posible manteniendo las mejores prácticas de seguridad:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Este único comando:

1. Verifica los requisitos del sistema
2. Te guía en la configuración
3. Configura los registros DNS
4. Configura los certificados TLS
5. Implementa los contenedores Docker
6. Realiza el reforzamiento de seguridad inicial

Para quienes se preocupen por enviar scripts a bash (¡como debería ser!), les recomendamos revisar el script antes de ejecutarlo. Es completamente de código abierto y está disponible para su inspección.

### Cifrado cuántico seguro para una privacidad a prueba de futuro {#quantum-safe-encryption-for-future-proof-privacy}

Al igual que nuestro servicio alojado, nuestra solución autoalojada implementa cifrado resistente a la computación cuántica utilizando ChaCha20-Poly1305 como cifrado para bases de datos SQLite. Este enfoque protege sus datos de correo electrónico no solo contra amenazas actuales, sino también contra futuros ataques de computación cuántica.

Cada buzón se almacena en su propio archivo de base de datos SQLite encriptado, lo que proporciona un aislamiento completo entre usuarios: una ventaja de seguridad significativa con respecto a los enfoques tradicionales de bases de datos compartidas.

### Mantenimiento y actualizaciones automatizadas {#automated-maintenance-and-updates}

Hemos incorporado utilidades de mantenimiento integrales directamente en la solución alojada automáticamente:

1. **Copias de seguridad automáticas**: Copias de seguridad programadas de todos los datos críticos
2. **Renovación de certificados**: Gestión automatizada de certificados Let's Encrypt
3. **Actualizaciones del sistema**: Comando sencillo para actualizar a la última versión
4. **Supervisión del estado**: Comprobaciones integradas para garantizar la integridad del sistema

A estas utilidades se puede acceder a través de un sencillo menú interactivo:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## El compromiso de código abierto {#the-open-source-commitment}

Nuestra solución de correo electrónico autoalojada, al igual que todos nuestros productos, es 100 % de código abierto, tanto en el frontend como en el backend. Esto significa:

1. **Transparencia total**: Cada línea de código que procesa tus correos electrónicos está disponible para el escrutinio público.
2. **Contribuciones de la comunidad**: Cualquiera puede contribuir con mejoras o solucionar problemas.
3. **Seguridad a través de la transparencia**: Una comunidad global puede identificar y solucionar vulnerabilidades.
4. **Sin dependencia de un proveedor**: Nunca dependes de la existencia de nuestra empresa.

El código base completo está disponible en GitHub en <https://github.com/forwardemail/forwardemail.net>.

## Alojamiento propio vs. administrado: la elección correcta {#self-hosted-vs-managed-making-the-right-choice}

Si bien nos enorgullece ofrecer una opción de correo electrónico autoalojado, reconocemos que no es la opción ideal para todos. El correo electrónico autoalojado conlleva responsabilidades y desafíos reales:

### La realidad del correo electrónico autoalojado {#the-reality-of-self-hosting-email}

#### Consideraciones técnicas {#technical-considerations}

**Administración del servidor**: Necesitará mantener un VPS o un servidor dedicado.
* **Configuración de DNS**: Una configuración de DNS adecuada es fundamental para la entrega.
* **Actualizaciones de seguridad**: Mantenerse al día con los parches de seguridad es esencial.
* **Administración de spam**: Necesitará gestionar el filtrado de spam.
* **Estrategia de copias de seguridad**: Implementar copias de seguridad fiables es su responsabilidad.

#### Inversión de tiempo {#time-investment}

* **Configuración inicial**: Tiempo para configurar, verificar y leer la documentación
* **Mantenimiento continuo**: Actualizaciones y supervisión ocasionales
* **Solución de problemas**: Tiempo ocasional para resolver problemas

#### Consideraciones financieras {#financial-considerations}

* **Costos del servidor**: $5-$20/mes para un VPS básico
* **Registro de dominio**: $10-$20/año
* **Valor temporal**: Su inversión de tiempo tiene un valor real

### Cuándo elegir nuestro servicio administrado {#when-to-choose-our-managed-service}

Para muchos usuarios, nuestro servicio gestionado sigue siendo la mejor opción:

1. **Conveniencia**: Nos encargamos de todo el mantenimiento, las actualizaciones y la supervisión.
2. **Confiabilidad**: Benefíciese de nuestra infraestructura y experiencia consolidadas.
3. **Soporte**: Reciba ayuda cuando surjan problemas.
4. **Capacidad de entrega**: Aproveche nuestra reputación de IP consolidada.
5. **Rentable**: Al considerar los costos de tiempo, nuestro servicio suele ser más económico.

Ambas opciones ofrecen los mismos beneficios de privacidad y transparencia de código abierto; la diferencia es simplemente quién administra la infraestructura.

## Primeros pasos con el reenvío de correo electrónico autoalojado {#getting-started-with-self-hosted-forward-email}

¿Listo para tomar el control de tu infraestructura de correo electrónico? Aquí te explicamos cómo empezar:

### Requisitos del sistema {#system-requirements}

* Ubuntu 20.04 LTS o posterior (recomendado)
* 1 GB de RAM mínimo (se recomiendan más de 2 GB)
* 20 GB de almacenamiento recomendado
* Un nombre de dominio que usted controle
* Dirección IP pública compatible con el puerto 25
* Posibilidad de configurar [PTR inverso](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Compatibilidad con IPv4 e IPv6

> \[!TIP]
> Recomendamos varios proveedores de servidores de correo en <https://forwardemail.net/blog/docs/best-mail-server-providers> (fuente en <https://github.com/forwardemail/awesome-mail-server-providers>)

### Pasos de instalación {#installation-steps}

1. **Ejecutar el script de instalación**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Siga las instrucciones interactivas**:
* Ingrese su nombre de dominio
* Configure las credenciales de administrador
* Configure los registros DNS según las instrucciones
* Elija sus opciones de configuración preferidas

3. **Verificar la instalación**:

Una vez completada la instalación, puede verificar que todo funciona correctamente:

* Verificar el estado del contenedor: `docker ps`
* Enviar un correo electrónico de prueba
* Iniciar sesión en la interfaz web

## El futuro del correo electrónico autoalojado {#the-future-of-self-hosted-email}

Nuestra solución autoalojada es solo el comienzo. Nos comprometemos a mejorar continuamente esta oferta con:

1. **Herramientas de administración mejoradas**: Administración web más potente
2. **Opciones de autenticación adicionales**: Incluye compatibilidad con claves de seguridad de hardware
3. **Monitoreo avanzado**: Mejor conocimiento del estado y el rendimiento del sistema
4. **Implementación multiservidor**: Opciones para configuraciones de alta disponibilidad
5. **Mejoras impulsadas por la comunidad**: Incorporación de las contribuciones de los usuarios

## Conclusión: Libertad de correo electrónico para todos {#conclusion-email-freedom-for-everyone}

El lanzamiento de nuestra solución de correo electrónico autoalojada representa un hito importante en nuestra misión de ofrecer servicios de correo electrónico transparentes y centrados en la privacidad. Tanto si elige nuestro servicio gestionado como si elige la opción autoalojada, se beneficiará de nuestro firme compromiso con los principios de código abierto y un diseño que prioriza la privacidad.

El correo electrónico es demasiado importante como para ser controlado por sistemas cerrados y propietarios que priorizan la recopilación de datos sobre la privacidad del usuario. Con la solución autoalojada de Forward Email, nos enorgullece ofrecer una alternativa genuina que le brinda control total sobre sus comunicaciones digitales.

Creemos que la privacidad no es solo una característica; es un derecho fundamental. Y con nuestra opción de correo electrónico alojado por nosotros mismos, hacemos que ese derecho sea más accesible que nunca.

¿Listo para tomar el control de tu correo electrónico? [Empieza hoy](https://forwardemail.net/self-hosted) o explora nuestro [repositorio de GitHub](https://github.com/forwardemail/forwardemail.net) para obtener más información.

## Referencias {#references}

\[1] Reenvío de correo electrónico al repositorio de GitHub: <https://github.com/forwardemail/forwardemail.net>

\[2] Documentación autoalojada: <https://forwardemail.net/en/self-hosted>

\[3] Implementación técnica de privacidad del correo electrónico: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Por qué es importante el correo electrónico de código abierto: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>