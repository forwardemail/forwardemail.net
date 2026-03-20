# Guía Completa para Configurar el Email en NAS con Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Configurar las notificaciones por email en tu NAS no debería ser un dolor de cabeza. Ya sea que tengas un Synology, QNAP o incluso un Raspberry Pi, esta guía hará que tu dispositivo se comunique con Forward Email para que realmente sepas cuándo algo sale mal.

La mayoría de los dispositivos NAS pueden enviar alertas por email sobre fallos en los discos, advertencias de temperatura, finalización de copias de seguridad y eventos de seguridad. ¿El problema? Muchos proveedores de email se han vuelto exigentes con la seguridad, y los dispositivos más antiguos a menudo no pueden mantenerse al día. Ahí es donde entra Forward Email: soportamos tanto dispositivos modernos como heredados.

Esta guía cubre la configuración de email para más de 75 proveedores de NAS con instrucciones paso a paso, información de compatibilidad y consejos para solucionar problemas. No importa qué dispositivo uses, haremos que tus notificaciones funcionen.


## Tabla de Contenidos {#table-of-contents}

* [Por Qué Necesitas Notificaciones por Email en tu NAS](#why-you-need-nas-email-notifications)
* [El Problema del TLS (Y Cómo Lo Solucionamos)](#the-tls-problem-and-how-we-fix-it)
* [Configuración SMTP de Forward Email](#forward-email-smtp-settings)
* [Matriz Completa de Compatibilidad con Proveedores NAS](#comprehensive-nas-provider-compatibility-matrix)
* [Configuración de Email en Synology NAS](#synology-nas-email-configuration)
  * [Pasos de Configuración](#configuration-steps)
* [Configuración de Email en QNAP NAS](#qnap-nas-email-configuration)
  * [Pasos de Configuración](#configuration-steps-1)
  * [Problemas Comunes de Solución en QNAP](#common-qnap-troubleshooting-issues)
* [Configuración Legacy en ReadyNAS](#readynas-legacy-configuration)
  * [Pasos de Configuración Legacy](#legacy-configuration-steps)
  * [Solución de Problemas en ReadyNAS](#readynas-troubleshooting)
* [Configuración de TerraMaster NAS](#terramaster-nas-configuration)
* [Configuración de ASUSTOR NAS](#asustor-nas-configuration)
* [Configuración de Buffalo TeraStation](#buffalo-terastation-configuration)
* [Configuración de Western Digital My Cloud](#western-digital-my-cloud-configuration)
* [Configuración de Email en TrueNAS](#truenas-email-configuration)
* [Configuración de OpenMediaVault](#openmediavault-configuration)
* [Configuración de Raspberry Pi NAS](#raspberry-pi-nas-configuration)
  * [Configuración Inicial de Raspberry Pi](#initial-raspberry-pi-setup)
  * [Configuración de Compartición de Archivos Samba](#samba-file-sharing-configuration)
  * [Configuración del Servidor FTP](#ftp-server-setup)
  * [Configuración de Notificaciones por Email](#email-notification-configuration)
  * [Funciones Avanzadas de Raspberry Pi NAS](#advanced-raspberry-pi-nas-features)
  * [Solución de Problemas de Email en Raspberry Pi](#raspberry-pi-email-troubleshooting)
  * [Optimización del Rendimiento](#performance-optimization)
  * [Consideraciones de Seguridad](#security-considerations)


## Por Qué Necesitas Notificaciones por Email en tu NAS {#why-you-need-nas-email-notifications}

Tu NAS monitorea un montón de cosas: salud de los discos, temperatura, problemas de red, eventos de seguridad. Sin alertas por email, los problemas pueden pasar desapercibidos durante semanas, lo que podría causar pérdida de datos o brechas de seguridad.

Las notificaciones por email te dan alertas inmediatas cuando los discos comienzan a fallar, advierten sobre intentos de acceso no autorizados, confirman copias de seguridad exitosas y te mantienen informado sobre la salud del sistema. Forward Email se asegura de que estas notificaciones críticas realmente te lleguen.


## El Problema del TLS (Y Cómo Lo Solucionamos) {#the-tls-problem-and-how-we-fix-it}

Aquí está el asunto: si tu NAS fue fabricado antes de 2020, probablemente solo soporte TLS 1.0. Gmail, Outlook y la mayoría de los proveedores dejaron de soportarlo hace años. Tu dispositivo intenta enviar email, es rechazado y te quedas en la oscuridad.

Forward Email soluciona esto con soporte de doble puerto. Los dispositivos modernos usan nuestros puertos estándar (`465` y `587`), mientras que los dispositivos antiguos pueden usar nuestros puertos legacy (`2455` y `2555`) que aún soportan TLS 1.0.

> \[!IMPORTANT]
> Forward Email soporta tanto dispositivos NAS modernos como legacy a través de nuestra estrategia de doble puerto. Usa los puertos 465/587 para dispositivos modernos con soporte TLS 1.2+, y los puertos 2455/2555 para dispositivos legacy que solo soportan TLS 1.0.


## Configuración SMTP de Forward Email {#forward-email-smtp-settings}
Aquí tienes lo que necesitas saber sobre nuestra configuración SMTP:

**Para dispositivos NAS modernos (2020+):** Usa `smtp.forwardemail.net` con el puerto `465` (SSL/TLS) o el puerto `587` (STARTTLS). Estos funcionan con el firmware actual que soporta TLS 1.2+.

**Para dispositivos NAS antiguos:** Usa `smtp.forwardemail.net` con el puerto `2455` (SSL/TLS) o el puerto `2555` (STARTTLS). Estos soportan TLS 1.0 para dispositivos heredados.

**Autenticación:** Usa tu alias de Forward Email como nombre de usuario y la contraseña generada desde [Mi Cuenta -> Dominios -> Alias](https://forwardemail.net/my-account/domains) (no tu contraseña de cuenta).

> \[!CAUTION]
> Nunca uses la contraseña de inicio de sesión de tu cuenta para la autenticación SMTP. Siempre usa la contraseña generada desde [Mi Cuenta -> Dominios -> Alias](https://forwardemail.net/my-account/domains) para la configuración del NAS.

> \[!TIP]
> Verifica la versión del firmware de tu dispositivo NAS y el soporte TLS antes de la configuración. La mayoría de los dispositivos fabricados después de 2020 soportan protocolos TLS modernos, mientras que los dispositivos más antiguos normalmente requieren puertos de compatibilidad heredada.


## Matriz completa de compatibilidad de proveedores NAS {#comprehensive-nas-provider-compatibility-matrix}

La siguiente matriz proporciona información detallada sobre la compatibilidad de los principales proveedores de NAS, incluyendo niveles de soporte TLS, estado del firmware y configuraciones recomendadas para Forward Email.

| Proveedor NAS    | Modelos actuales | Soporte TLS | Estado del firmware | Puertos recomendados | Problemas comunes                                                                                                                                       | Guía de configuración/Capturas de pantalla                                                                                                      |
| ---------------- | ---------------- | ----------- | ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology         | DSM 7.x          | TLS 1.2+    | Activo              | `465`, `587`         | [Configuración STARTTLS](https://community.synology.com/enu/forum/2/post/124584)                                                                       | [Configuración de notificaciones por email DSM](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)              |
| QNAP             | QTS 5.x          | TLS 1.2+    | Activo              | `465`, `587`         | [Fallas en el Centro de Notificaciones](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525) | [Configuración del servidor de email QTS](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi     | Raspberry Pi OS  | TLS 1.2+    | Activo              | `465`, `587`         | [Problemas de resolución DNS](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                              | [Guía de configuración de email para Raspberry Pi](#raspberry-pi-nas-configuration)                                                            |
| ASUSTOR          | ADM 4.x          | TLS 1.2+    | Activo              | `465`, `587`         | [Validación de certificados](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                    | [Configuración de notificaciones ASUSTOR](https://www.asustor.com/en/online/online_help?id=8)                                                   |
| TerraMaster      | TOS 6.x          | TLS 1.2     | Activo              | `465`, `587`         | [Autenticación SMTP](https://www.terra-master.com/global/forum/)                                                                                       | [Configuración de email TerraMaster](https://www.terra-master.com/global/support/download.php)                                                  |
| TrueNAS          | SCALE/CORE       | TLS 1.2+    | Activo              | `465`, `587`         | [Configuración de certificado SSL](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                   | [Guía de configuración de email TrueNAS](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)         |
| Buffalo          | TeraStation      | TLS 1.2     | Limitado            | `465`, `587`         | [Compatibilidad de firmware](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)       | [Configuración de email TeraStation](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital  | My Cloud OS 5    | TLS 1.2     | Limitado            | `465`, `587`         | [Compatibilidad con OS heredado](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                           | [Configuración de email My Cloud](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                   |
| OpenMediaVault   | OMV 7.x          | TLS 1.2+    | Activo              | `465`, `587`         | [Dependencias de plugins](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                   | [Configuración de notificaciones OMV](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                      |
| Netgear ReadyNAS | OS 6.x           | Solo TLS 1.0| Descontinuado       | `2455`, `2555`       | [Soporte TLS heredado](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                        | [Configuración de alertas por email ReadyNAS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) |
| Drobo            | Dashboard        | TLS 1.2     | Descontinuado       | `465`, `587`         | [Soporte limitado](https://myprojects.drobo.com/support/)                                                                                            | [Notificaciones por email Drobo](https://www.drobo.com/support/)                                                                                 |
Esta matriz demuestra la clara división entre los sistemas NAS modernos y activamente mantenidos y los dispositivos heredados que requieren consideraciones especiales de compatibilidad. La mayoría de los dispositivos NAS actuales soportan estándares TLS modernos y pueden usar los puertos SMTP principales de Forward Email sin ninguna configuración especial.


## Configuración de correo electrónico en Synology NAS {#synology-nas-email-configuration}

Los dispositivos Synology con DSM son bastante sencillos de configurar. Soportan TLS moderno, por lo que puedes usar nuestros puertos estándar sin problemas.

> \[!NOTE]
> Synology DSM 7.x ofrece las funciones de notificación por correo electrónico más completas. Las versiones anteriores de DSM pueden tener opciones de configuración limitadas.

### Pasos de configuración {#configuration-steps}

1. **Accede a la interfaz web de DSM** ingresando la dirección IP de tu dispositivo NAS o el ID de QuickConnect en un navegador web.

2. **Navega al Panel de control** y selecciona la sección "Notificación", luego haz clic en la pestaña "Correo electrónico" para acceder a las opciones de configuración de correo.

3. **Habilita las notificaciones por correo electrónico** marcando la casilla "Habilitar notificaciones por correo electrónico".

4. **Configura el servidor SMTP** ingresando `smtp.forwardemail.net` como la dirección del servidor.

5. **Establece la configuración del puerto** al puerto 465 para conexiones SSL/TLS (recomendado). El puerto 587 con STARTTLS también es compatible como alternativa.

6. **Configura la autenticación** seleccionando "Se requiere autenticación SMTP" e ingresando tu alias de Forward Email en el campo de nombre de usuario.

7. **Ingresa tu contraseña** usando la contraseña generada desde [Mi Cuenta -> Dominios -> Alias](https://forwardemail.net/my-account/domains).

8. **Configura las direcciones de los destinatarios** ingresando hasta cinco direcciones de correo electrónico que deberían recibir las notificaciones.

9. **Configura el filtrado de notificaciones** para controlar qué eventos activan alertas por correo, evitando la sobrecarga de notificaciones y asegurando que se reporten eventos críticos.

10. **Prueba la configuración** usando la función de prueba incorporada en DSM para verificar que todos los ajustes sean correctos y la comunicación con los servidores de Forward Email funcione adecuadamente.

> \[!TIP]
> Synology permite diferentes tipos de notificaciones para distintos destinatarios, proporcionando flexibilidad en cómo se distribuyen las alertas dentro de tu equipo.


## Configuración de correo electrónico en QNAP NAS {#qnap-nas-email-configuration}

Los dispositivos QNAP con QTS funcionan muy bien con Forward Email. Soportan TLS moderno y tienen una interfaz web agradable para la configuración.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 tuvo un problema conocido con las notificaciones por correo electrónico que fue [resuelto en QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Asegúrate de que tu firmware esté actualizado para evitar fallos en las notificaciones.

### Pasos de configuración {#configuration-steps-1}

1. **Accede a la interfaz web de tu dispositivo QNAP** ingresando su dirección IP en un navegador web.

2. **Navega al Panel de control** y selecciona "Cuenta de servicio y emparejamiento de dispositivos", luego haz clic en la sección "Correo electrónico" para comenzar la configuración del correo.

3. **Haz clic en "Agregar servicio SMTP"** para crear una nueva configuración de correo electrónico.

4. **Configura el servidor SMTP** ingresando `smtp.forwardemail.net` como la dirección del servidor SMTP.

5. **Selecciona el protocolo de seguridad adecuado** - elige "SSL/TLS" con el puerto `465` (recomendado). El puerto `587` con STARTTLS también es compatible.

6. **Configura el número de puerto** - se recomienda el puerto `465` con SSL/TLS. El puerto `587` con STARTTLS también está disponible si es necesario.

7. **Ingresa tus credenciales de autenticación** usando tu alias de Forward Email como nombre de usuario y la contraseña generada desde [Mi Cuenta -> Dominios -> Alias](https://forwardemail.net/my-account/domains).

8. **Configura la información del remitente** ingresando un nombre descriptivo para el campo "De", como "Sistema NAS QNAP" o el nombre de host de tu dispositivo.

9. **Configura las direcciones de los destinatarios** para diferentes tipos de notificación. QNAP permite configurar múltiples grupos de destinatarios para distintos tipos de alertas.

10. **Prueba la configuración** usando la función de prueba de correo incorporada en QNAP para verificar que todos los ajustes funcionen correctamente.

> \[!TIP]
> Si encuentras [problemas con la configuración SMTP de Gmail](https://forum.qnap.com/viewtopic.php?t=152466), los mismos pasos de solución aplican para Forward Email. Asegúrate de que la autenticación esté correctamente habilitada y que las credenciales sean correctas.
> \[!NOTE]
> Los dispositivos QNAP soportan programación avanzada de notificaciones, permitiéndote configurar horas de silencio cuando se suprimen las notificaciones no críticas. Esto es particularmente útil en entornos empresariales.

### Problemas comunes de solución de problemas en QNAP {#common-qnap-troubleshooting-issues}

Si tu dispositivo QNAP [no envía correos de notificación](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), verifica lo siguiente:

* Verifica que tus credenciales de Forward Email sean correctas
* Asegúrate de que la dirección del servidor SMTP sea exactamente `smtp.forwardemail.net`
* Confirma que el puerto coincida con tu método de cifrado (`465` para SSL/TLS es recomendado; `587` para STARTTLS también es compatible)
* Revisa que tu [configuración del servidor SMTP](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) permita la conexión


## Configuración Legacy de ReadyNAS {#readynas-legacy-configuration}

Los dispositivos Netgear ReadyNAS presentan desafíos únicos debido a la descontinuación del soporte de firmware y la dependencia de protocolos TLS 1.0 legacy. Sin embargo, el soporte de puertos legacy de Forward Email asegura que estos dispositivos puedan seguir enviando notificaciones por correo electrónico de manera confiable.

> \[!CAUTION]
> ReadyNAS OS 6.x solo soporta TLS 1.0, lo que requiere los puertos de compatibilidad legacy de Forward Email `2455` y `2555`. Los puertos modernos `465` y `587` no funcionarán con estos dispositivos.

### Pasos para configuración legacy {#legacy-configuration-steps}

1. **Accede a la interfaz web de ReadyNAS** ingresando la dirección IP del dispositivo en un navegador web.

2. **Navega a Sistema > Configuración > Alertas** para acceder a la sección de configuración de correo electrónico.

3. **Configura el servidor SMTP** ingresando `smtp.forwardemail.net` como la dirección del servidor.

4. **Establece la configuración del puerto** a `2455` para conexiones SSL/TLS o `2555` para conexiones STARTTLS - estos son los puertos de compatibilidad legacy de Forward Email.

5. **Habilita la autenticación** e ingresa tu alias de Forward Email como nombre de usuario y tu contraseña generada desde [Mi Cuenta -> Dominios -> Alias](https://forwardemail.net/my-account/domains).

6. **Configura la información del remitente** con una dirección "De" descriptiva para identificar el dispositivo ReadyNAS.

7. **Agrega direcciones de correo de destinatarios** usando el botón + en la sección de contactos de correo electrónico.

8. **Prueba la configuración** para asegurar que la conexión TLS legacy funcione correctamente.

> \[!IMPORTANT]
> Los dispositivos ReadyNAS requieren los puertos legacy porque no pueden establecer conexiones seguras usando protocolos TLS modernos. Esta es una [limitación conocida](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) del firmware descontinuado.

### Solución de problemas en ReadyNAS {#readynas-troubleshooting}

Los problemas comunes con la configuración de correo en ReadyNAS incluyen:

* **Desajuste de versión TLS**: Asegúrate de usar los puertos `2455` o `2555`, no los puertos modernos
* **Fallos de autenticación**: Verifica que tus credenciales de Forward Email sean correctas
* **Conectividad de red**: Revisa que ReadyNAS pueda alcanzar `smtp.forwardemail.net`
* **Limitaciones del firmware**: Algunos modelos ReadyNAS antiguos pueden tener requisitos adicionales de [configuración HTTPS](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

Los dispositivos ReadyNAS que ejecutan OS 6.x y versiones anteriores solo soportan conexiones TLS 1.0, que la mayoría de los proveedores modernos de correo ya no aceptan. Los puertos legacy dedicados de Forward Email (2455 y 2555) soportan específicamente estos protocolos antiguos, asegurando funcionalidad continua para usuarios de ReadyNAS.

Para configurar el correo en dispositivos ReadyNAS, accede a la interfaz web del dispositivo a través de su dirección IP. Navega a la sección Sistema y selecciona "Notificaciones" para acceder a las opciones de configuración de correo.

En la sección de configuración de correo, habilita las notificaciones por correo e ingresa smtp.forwardemail.net como el servidor SMTP. Esto es crucial: usa los puertos compatibles legacy de Forward Email en lugar de los puertos SMTP estándar.

Para conexiones SSL/TLS, configura el puerto 2455 en lugar del puerto estándar 465 (recomendado). Para conexiones STARTTLS, usa el puerto 2555 en lugar del puerto 587. Estos puertos especiales mantienen la compatibilidad con TLS 1.0 mientras proporcionan la mejor seguridad disponible para dispositivos legacy.
Ingrese su alias de Forward Email como nombre de usuario y su contraseña generada para la autenticación. Los dispositivos ReadyNAS soportan autenticación SMTP, la cual es requerida para las conexiones de Forward Email.

Configure la dirección de correo electrónico del remitente y las direcciones de los destinatarios según sus requisitos de notificación. ReadyNAS permite múltiples direcciones de destinatarios, lo que le permite distribuir alertas a diferentes miembros del equipo o cuentas de correo electrónico.

Pruebe la configuración cuidadosamente, ya que los dispositivos ReadyNAS pueden no proporcionar mensajes de error detallados si la configuración falla. Si la prueba estándar no funciona, verifique que esté utilizando los puertos heredados correctos (2455 o 2555) en lugar de los puertos SMTP modernos.

Considere las implicaciones de seguridad al usar protocolos TLS heredados. Aunque los puertos heredados de Forward Email proporcionan la mejor seguridad disponible para dispositivos antiguos, se recomienda actualizar a un sistema NAS moderno con soporte TLS actual cuando sea posible.


## Configuración de TerraMaster NAS {#terramaster-nas-configuration}

Los dispositivos TerraMaster que ejecutan TOS 6.x soportan TLS moderno y funcionan bien con los puertos estándar de Forward Email.

> \[!NOTE]
> TerraMaster TOS 6.x ofrece funciones completas de notificación por correo electrónico. Asegúrese de que su firmware esté actualizado para la mejor compatibilidad.

1. **Acceda a Configuración del Sistema**
   * Inicie sesión en la interfaz web de TerraMaster
   * Navegue a **Panel de Control** > **Notificación**

2. **Configure los Ajustes SMTP**
   * Servidor: `smtp.forwardemail.net`
   * Puerto: `465` (SSL/TLS, recomendado) o `587` (STARTTLS)
   * Nombre de usuario: Su alias de Forward Email
   * Contraseña: Contraseña generada desde [Mi Cuenta -> Dominios -> Aliases](https://forwardemail.net/my-account/domains)

3. **Habilite las Notificaciones**
   * Marque los tipos de notificación que desea recibir
   * Pruebe la configuración con la función de prueba incorporada

> \[!TIP]
> Los dispositivos TerraMaster funcionan mejor con el puerto `465` para conexiones SSL/TLS (recomendado). Si experimenta problemas, el puerto `587` con STARTTLS también es compatible.


## Configuración de ASUSTOR NAS {#asustor-nas-configuration}

Los dispositivos ASUSTOR con ADM 4.x tienen un sólido soporte para notificaciones por correo electrónico y funcionan sin problemas con Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x incluye opciones avanzadas de filtrado de notificaciones. Puede personalizar qué eventos activan alertas por correo electrónico.

1. **Abra Configuración de Notificaciones**
   * Acceda a la interfaz web de ADM
   * Vaya a **Configuración** > **Notificación**

2. **Configure SMTP**
   * Servidor SMTP: `smtp.forwardemail.net`
   * Puerto: `465` (SSL/TLS, recomendado) o `587` (STARTTLS)
   * Autenticación: Habilitar
   * Nombre de usuario: Su alias de Forward Email
   * Contraseña: Contraseña generada desde [Mi Cuenta -> Dominios -> Aliases](https://forwardemail.net/my-account/domains)

3. **Configure Tipos de Alertas**
   * Seleccione qué eventos del sistema deben activar correos electrónicos
   * Configure las direcciones de los destinatarios
   * Pruebe la configuración

> \[!IMPORTANT]
> Los dispositivos ASUSTOR requieren que la autenticación esté explícitamente habilitada en la configuración SMTP. No olvide marcar esta opción.


## Configuración de Buffalo TeraStation {#buffalo-terastation-configuration}

Los dispositivos Buffalo TeraStation tienen capacidades limitadas pero funcionales para notificaciones por correo electrónico. La configuración es sencilla una vez que sabe dónde buscar.

> \[!CAUTION]
> Las actualizaciones de firmware de Buffalo TeraStation son poco frecuentes. Asegúrese de usar el firmware más reciente disponible para su modelo antes de configurar el correo electrónico.

1. **Acceda a la Configuración Web**
   * Conéctese a la interfaz web de su TeraStation
   * Navegue a **Sistema** > **Notificación**

2. **Configure los Ajustes de Correo**
   * Servidor SMTP: `smtp.forwardemail.net`
   * Puerto: `465` (SSL/TLS, recomendado) o `587` (STARTTLS)
   * Nombre de usuario: Su alias de Forward Email
   * Contraseña: Contraseña generada desde [Mi Cuenta -> Dominios -> Aliases](https://forwardemail.net/my-account/domains)
   * Habilite la encriptación SSL/TLS

3. **Configure Preferencias de Notificación**
   * Elija qué eventos activan correos electrónicos (errores de disco, alertas de temperatura, etc.)
   * Ingrese las direcciones de correo electrónico de los destinatarios
   * Guarde y pruebe la configuración

> \[!NOTE]
> Algunos modelos antiguos de TeraStation pueden tener opciones limitadas de configuración SMTP. Consulte la documentación de su modelo para capacidades específicas.
## Configuración de Western Digital My Cloud {#western-digital-my-cloud-configuration}

Los dispositivos Western Digital My Cloud que ejecutan OS 5 soportan notificaciones por correo electrónico, aunque la interfaz puede estar un poco oculta en la configuración.

> \[!WARNING]
> Western Digital ha descontinuado el soporte para muchos modelos de My Cloud. Verifique si su dispositivo aún recibe actualizaciones de firmware antes de depender de las notificaciones por correo electrónico para alertas críticas.

1. **Navegar a Configuración**
   * Abra el panel web de My Cloud
   * Vaya a **Configuración** > **General** > **Notificaciones**

2. **Configurar detalles SMTP**
   * Servidor de correo: `smtp.forwardemail.net`
   * Puerto: `465` (SSL/TLS, recomendado) o `587` (STARTTLS)
   * Nombre de usuario: Su alias de Forward Email
   * Contraseña: Contraseña generada desde [Mi Cuenta -> Dominios -> Alias](https://forwardemail.net/my-account/domains)
   * Habilitar cifrado

3. **Configurar tipos de alerta**
   * Seleccione categorías de notificación (alertas del sistema, salud del disco, etc.)
   * Añada direcciones de correo electrónico de destinatarios
   * Pruebe la configuración del correo electrónico

> \[!TIP]
> Recomendamos usar el puerto `465` con SSL/TLS. Si experimenta problemas, el puerto `587` con STARTTLS también es compatible.


## Configuración de correo electrónico en TrueNAS {#truenas-email-configuration}

TrueNAS (tanto SCALE como CORE) tiene un excelente soporte para notificaciones por correo electrónico con opciones detalladas de configuración.

> \[!NOTE]
> TrueNAS ofrece algunas de las funciones de notificación por correo electrónico más completas entre los sistemas NAS. Puede configurar reglas detalladas de alerta y múltiples destinatarios.

1. **Acceder a Configuración del Sistema**
   * Inicie sesión en la interfaz web de TrueNAS
   * Navegue a **Sistema** > **Correo electrónico**

2. **Configurar ajustes SMTP**
   * Servidor de correo saliente: `smtp.forwardemail.net`
   * Puerto del servidor de correo: `465` (recomendado) o `587`
   * Seguridad: SSL/TLS (para 465, recomendado) o STARTTLS (para 587)
   * Nombre de usuario: Su alias de Forward Email
   * Contraseña: Contraseña generada desde [Mi Cuenta -> Dominios -> Alias](https://forwardemail.net/my-account/domains)

3. **Configurar alertas**
   * Vaya a **Sistema** > **Servicios de alerta**
   * Configure qué alertas deben enviarse por correo electrónico
   * Establezca direcciones de destinatarios y niveles de alerta
   * Pruebe la configuración con la función de prueba incorporada

> \[!IMPORTANT]
> TrueNAS le permite configurar diferentes niveles de alerta (INFO, NOTICE, WARNING, ERROR, CRITICAL). Elija niveles apropiados para evitar spam de correo electrónico mientras asegura que se reporten problemas críticos.


## Configuración de OpenMediaVault {#openmediavault-configuration}

OpenMediaVault ofrece capacidades sólidas de notificación por correo electrónico a través de su interfaz web. El proceso de configuración es limpio y sencillo.

> \[!NOTE]
> El sistema de notificaciones de OpenMediaVault está basado en plugins. Asegúrese de tener instalado y habilitado el plugin de notificaciones por correo electrónico.

1. **Acceder a Configuración de Notificaciones**
   * Abra la interfaz web de OpenMediaVault
   * Vaya a **Sistema** > **Notificación** > **Correo electrónico**

2. **Configurar parámetros SMTP**
   * Servidor SMTP: `smtp.forwardemail.net`
   * Puerto: `465` (SSL/TLS, recomendado) o `587` (STARTTLS)
   * Nombre de usuario: Su alias de Forward Email
   * Contraseña: Contraseña generada desde [Mi Cuenta -> Dominios -> Alias](https://forwardemail.net/my-account/domains)
   * Habilitar SSL/TLS

3. **Configurar reglas de notificación**
   * Navegue a **Sistema** > **Notificación** > **Notificaciones**
   * Configure qué eventos del sistema deben activar correos electrónicos
   * Establezca direcciones de destinatarios
   * Pruebe la funcionalidad del correo electrónico

> \[!TIP]
> OpenMediaVault le permite configurar horarios de notificación. Puede establecer horas de silencio o limitar la frecuencia de notificaciones para evitar ser abrumado por alertas.


## Configuración de NAS en Raspberry Pi {#raspberry-pi-nas-configuration}

La Raspberry Pi representa un excelente punto de entrada a la funcionalidad NAS, ofreciendo una solución rentable para entornos domésticos y pequeñas oficinas. Configurar una Raspberry Pi como dispositivo NAS implica configurar protocolos de compartición de archivos, notificaciones por correo electrónico y servicios de red esenciales.

> \[!TIP]
> Para los entusiastas de Raspberry Pi, recomendamos complementar su configuración NAS con [PiKVM](https://pikvm.org/) para la gestión remota del servidor y [Pi-hole](https://pi-hole.net/) para bloqueo de anuncios y gestión DNS a nivel de red. Estas herramientas crean un entorno completo de laboratorio en casa.
### Configuración inicial de Raspberry Pi {#initial-raspberry-pi-setup}

Antes de configurar los servicios NAS, asegúrate de que tu Raspberry Pi esté ejecutando la última versión de Raspberry Pi OS y tenga almacenamiento adecuado. Una tarjeta microSD de alta calidad (Clase 10 o superior) o un SSD USB 3.0 ofrecen mejor rendimiento y fiabilidad para las operaciones NAS.

1. **Actualiza el sistema** ejecutando `sudo apt update && sudo apt upgrade -y` para asegurar que todos los paquetes estén actualizados.

2. **Habilita el acceso SSH** usando `sudo systemctl enable ssh && sudo systemctl start ssh` para administración remota.

3. **Configura una dirección IP estática** editando `/etc/dhcpcd.conf` para asegurar un acceso de red consistente.

4. **Configura almacenamiento externo** conectando y montando unidades USB o configurando arreglos RAID para redundancia de datos.

### Configuración de compartición de archivos Samba {#samba-file-sharing-configuration}

Samba proporciona compartición de archivos compatible con Windows, haciendo que tu Raspberry Pi sea accesible desde cualquier dispositivo en tu red. El proceso de configuración implica instalar Samba, crear recursos compartidos y configurar la autenticación de usuarios.

Instala Samba usando `sudo apt install samba samba-common-bin` y configura el archivo principal en `/etc/samba/smb.conf`. Crea directorios compartidos y establece permisos adecuados con `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Configura los recursos compartidos de Samba añadiendo secciones al archivo de configuración para cada directorio compartido. Configura la autenticación de usuarios usando `sudo smbpasswd -a username` para crear contraseñas específicas de Samba para el acceso en red.

> \[!IMPORTANT]
> Siempre usa contraseñas fuertes para los usuarios de Samba y considera habilitar el acceso de invitados solo para carpetas compartidas no sensibles. Revisa la [documentación oficial de Samba](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) para configuraciones avanzadas de seguridad.

### Configuración del servidor FTP {#ftp-server-setup}

FTP proporciona otro método para acceder a archivos, particularmente útil para copias de seguridad automatizadas y gestión remota de archivos. Instala y configura vsftpd (Very Secure FTP Daemon) para servicios FTP confiables.

Instala vsftpd usando `sudo apt install vsftpd` y configura el servicio editando `/etc/vsftpd.conf`. Habilita el acceso de usuarios locales, configura los ajustes de modo pasivo y establece las restricciones de seguridad apropiadas.

Crea usuarios FTP y configura permisos de acceso a directorios. Considera usar SFTP (SSH File Transfer Protocol) en lugar del FTP tradicional para mayor seguridad, ya que cifra toda la transmisión de datos.

> \[!CAUTION]
> El FTP tradicional transmite las contraseñas en texto plano. Siempre usa SFTP o configura FTP con cifrado TLS para transferencias de archivos seguras. Revisa las [mejores prácticas de seguridad de vsftpd](https://security.appspot.com/vsftpd.html) antes de la implementación.

### Configuración de notificaciones por correo electrónico {#email-notification-configuration}

Configura tu NAS Raspberry Pi para enviar notificaciones por correo electrónico sobre eventos del sistema, alertas de almacenamiento y estado de finalización de copias de seguridad. Esto implica instalar y configurar un agente de transferencia de correo y configurar la integración con Forward Email.

Instala `msmtp` como cliente SMTP ligero usando `sudo apt install msmtp msmtp-mta`. Crea el archivo de configuración en `/etc/msmtprc` con los siguientes ajustes:

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

Configura las notificaciones del sistema estableciendo tareas cron y scripts de monitoreo que usen `msmtp` para enviar alertas. Crea scripts para monitoreo de espacio en disco, alertas de temperatura y notificaciones de finalización de copias de seguridad.

### Funciones avanzadas del NAS Raspberry Pi {#advanced-raspberry-pi-nas-features}

Mejora tu NAS Raspberry Pi con servicios adicionales y capacidades de monitoreo. Instala y configura herramientas de monitoreo de red, soluciones de respaldo automatizadas y servicios de acceso remoto.

Configura [Nextcloud](https://nextcloud.com/) para funcionalidad tipo nube con acceso a archivos vía web, sincronización de calendario y funciones colaborativas. Instálalo usando Docker o la guía oficial de instalación de Nextcloud para Raspberry Pi.
Configure copias de seguridad automáticas usando `rsync` y `cron` para crear respaldos programados de datos críticos. Configure notificaciones por correo electrónico para la finalización de copias de seguridad y alertas de fallos utilizando su configuración de Forward Email.

Implemente monitoreo de red usando herramientas como [Nagios](https://www.nagios.org/) o [Zabbix](https://www.zabbix.com/) para supervisar la salud del sistema, la conectividad de red y la disponibilidad de servicios.

> \[!NOTE]
> Para usuarios que gestionan infraestructura de red, considere integrar [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) con su configuración PiKVM para el control remoto físico de interruptores. Esta [guía de integración en Python](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) proporciona instrucciones detalladas para automatizar la gestión de dispositivos físicos.

### Solución de problemas de correo electrónico en Raspberry Pi {#raspberry-pi-email-troubleshooting}

Los problemas comunes con la configuración de correo electrónico en Raspberry Pi incluyen problemas de resolución DNS, restricciones de firewall y fallos de autenticación. La naturaleza ligera de los sistemas Raspberry Pi a veces puede causar problemas de sincronización con las conexiones SMTP.

Si las notificaciones por correo electrónico fallan, revise el archivo de registro de `msmtp` en `/var/log/msmtp.log` para mensajes de error detallados. Verifique que sus credenciales de Forward Email sean correctas y que la Raspberry Pi pueda resolver `smtp.forwardemail.net`.

Pruebe la funcionalidad del correo electrónico usando la línea de comandos: `echo "Test message" | msmtp recipient@example.com`. Esto ayuda a aislar problemas de configuración de problemas específicos de la aplicación.

Configure los ajustes DNS adecuados en `/etc/resolv.conf` si encuentra problemas de resolución DNS. Considere usar servidores DNS públicos como `8.8.8.8` o `1.1.1.1` si el DNS local no es confiable.

### Optimización del rendimiento {#performance-optimization}

Optimice el rendimiento de su Raspberry Pi NAS mediante la configuración adecuada del almacenamiento, ajustes de red y recursos del sistema. Use dispositivos de almacenamiento de alta calidad y configure opciones apropiadas del sistema de archivos para su caso de uso.

Habilite el arranque USB 3.0 para un mejor rendimiento de almacenamiento si usa discos externos. Configure la división de memoria GPU usando `sudo raspi-config` para asignar más RAM a las operaciones del sistema en lugar del procesamiento gráfico.

Monitoree el rendimiento del sistema usando herramientas como `htop`, `iotop` y `nethogs` para identificar cuellos de botella y optimizar el uso de recursos. Considere actualizar a una Raspberry Pi 4 con 8GB de RAM para aplicaciones NAS exigentes.

Implemente soluciones de enfriamiento adecuadas para prevenir el estrangulamiento térmico durante operaciones intensivas. Monitoree la temperatura de la CPU usando `/opt/vc/bin/vcgencmd measure_temp` y asegure una ventilación adecuada.

### Consideraciones de seguridad {#security-considerations}

Asegure su Raspberry Pi NAS implementando controles de acceso adecuados, medidas de seguridad de red y actualizaciones regulares de seguridad. Cambie las contraseñas predeterminadas, desactive servicios innecesarios y configure reglas de firewall.

Instale y configure `fail2ban` para protegerse contra ataques de fuerza bruta en SSH y otros servicios. Configure actualizaciones automáticas de seguridad usando `unattended-upgrades` para asegurar que los parches críticos de seguridad se apliquen rápidamente.

Configure la segmentación de red para aislar su NAS de otros dispositivos de red cuando sea posible. Use acceso VPN para conexiones remotas en lugar de exponer servicios directamente a internet.

Realice copias de seguridad regulares de la configuración y datos de su Raspberry Pi para prevenir pérdida de datos por fallos de hardware o incidentes de seguridad. Pruebe los procedimientos de restauración de copias de seguridad para asegurar la capacidad de recuperación de datos.

La configuración de Raspberry Pi NAS proporciona una excelente base para aprender conceptos de almacenamiento en red mientras ofrece funcionalidad práctica para entornos domésticos y pequeñas oficinas. La combinación con Forward Email garantiza una entrega confiable de notificaciones para la supervisión del sistema y alertas de mantenimiento.
