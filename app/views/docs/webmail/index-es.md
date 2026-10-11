# Guía de webmail de Forward Email {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>Resumen:</strong> El <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">webmail</a> es donde lees y envías correo. El <a href="/my-account/domains">panel web</a> es donde configuras dominios, alias y contraseñas. Inicias sesión en el webmail con una dirección de alias y una contraseña generada en el panel. El webmail es gratuito y de <a href="/faq#do-you-offer-a-webmail-client">código abierto</a>, y la misma aplicación funciona en el navegador, en escritorio, en móvil y en una terminal.
</p>


## Tabla de contenidos {#table-of-contents}

* [Dónde conseguir el webmail](#where-to-get-webmail)
* [El webmail y el panel web](#webmail-and-the-web-dashboard)
* [Iniciar sesión](#signing-in)
  * [Generar una contraseña de alias](#generate-an-alias-password)
  * [Iniciar sesión en el webmail](#sign-in-to-webmail)
* [Usar más de una cuenta](#using-more-than-one-account)
  * [Enviar como otra cuenta con sesión iniciada](#send-as-another-signed-in-account)
* [Enviar desde cualquier dirección de tu dominio](#send-from-any-address-on-your-domain)
  * [Paso 1: Genera una contraseña catch-all en el panel](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Paso 2: Guárdala en el webmail](#step-2-save-it-in-webmail)
  * [Paso 3: Elige la dirección al redactar](#step-3-pick-the-address-when-you-compose)
  * [Qué debes saber sobre el envío catch-all](#what-to-know-about-catch-all-sending)
* [Ajustes del webmail de un vistazo](#webmail-settings-at-a-glance)
* [Privacidad y App Lock](#privacy-and-app-lock)
* [Solución de problemas](#troubleshooting)


## Dónde conseguir el webmail {#where-to-get-webmail}

| Plataforma                         | Dónde                                                                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Navegador                          | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (sin instalación) |
| Escritorio (macOS, Windows, Linux) | Nuestra <a href="/download">página de descargas</a>                                                                           |
| Móvil (Android, iOS)               | Nuestra <a href="/download">página de descargas</a>                                                                           |
| Terminal                           | El comando `forwardemail`. Consulta [¿Tienen una aplicación para terminal?](/faq#do-you-have-a-terminal-app)                  |

Todas se crean a partir del mismo proyecto de código abierto, así que todo lo que se explica en esta guía se aplica a cada una. Los ajustes y las contraseñas guardadas se almacenan en cada dispositivo, así que configúralos en cada dispositivo que uses.


## El webmail y el panel web {#webmail-and-the-web-dashboard}

Forward Email tiene dos lugares distintos para iniciar sesión, y cada uno usa credenciales diferentes:

|                                | Panel web (forwardemail.net)                                                                                     | Webmail (mail.forwardemail.net y las aplicaciones)                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Inicias sesión con**         | El correo y la contraseña de tu cuenta de Forward Email (más 2FA o una passkey)                                   | Una dirección de alias (como `you@example.com`) y su contraseña generada             |
| **Se usa para**                | Añadir dominios, DNS, alias, facturación, miembros del equipo, generar contraseñas, Configuración avanzada        | Leer y enviar correo, carpetas, etiquetas, búsqueda, calendario, contactos, filtros  |
| **Contraseñas que se crean aquí** | Contraseñas de alias y contraseñas catch-all                                                                  | Ninguna. El webmail usa las contraseñas que creaste en el panel                      |

Una configuración habitual es así:

1. En el panel, añade tu dominio y configura el DNS.
2. Crea un alias con el almacenamiento IMAP activado (por ejemplo `you@example.com`).
3. Genera una contraseña para ese alias.
4. Inicia sesión en el webmail con ese alias y esa contraseña.

Para enviar correo, tu dominio también necesita tener el SMTP saliente activado en <a href="/my-account/domains">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Configuración avanzada <i class="fa fa-angle-right"></i> Configuración de SMTP saliente, igual que con cualquier otro cliente de correo.


## Iniciar sesión {#signing-in}

### Generar una contraseña de alias {#generate-an-alias-password}

1. Ve a <a href="/my-account/domains">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> <i class="fa fa-angle-right"></i> Alias.
2. Junto al alias, haz clic en **Generar contraseña**.
3. Copia la contraseña. Solo se muestra una vez.

Es la misma contraseña que usarías para IMAP, POP3, SMTP, CalDAV y CardDAV. No sirve para iniciar sesión en el panel web.

### Iniciar sesión en el webmail {#sign-in-to-webmail}

Abre el webmail e introduce la dirección de alias completa y la contraseña generada. Si primero solo quieres echar un vistazo, prueba la demo desde la pantalla de inicio de sesión.


## Usar más de una cuenta {#using-more-than-one-account}

Puedes iniciar sesión en varios alias a la vez, incluso de dominios distintos. Cambia entre ellos desde el menú de cuentas y gestiónalos en **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Las cuentas se guardan en el dispositivo donde las añadiste y no se sincronizan.

### Enviar como otra cuenta con sesión iniciada {#send-as-another-signed-in-account}

Al redactar, el menú **From** muestra todas las cuentas con sesión iniciada en este dispositivo. Elige una para enviar desde esa dirección. El mensaje se envía con la contraseña de esa cuenta, y la copia va a la carpeta de enviados de esa cuenta.


## Enviar desde cualquier dirección de tu dominio {#send-from-any-address-on-your-domain}

Si tienes un dominio, puedes enviar desde cualquier dirección del mismo, como `billing@example.com` o `no-reply@example.com`, sin crear un alias ni iniciar sesión para cada una. Para ello se usa una **contraseña catch-all** del dominio.

**No** inicias sesión en el webmail como una cuenta comodín o catch-all, y no hay ninguna función que activar. Guardas la contraseña catch-all una vez en los ajustes del webmail, y a partir de ahí el menú From te permite escribir cualquier dirección de ese dominio.

### Paso 1: Genera una contraseña catch-all en el panel {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Ve a <a href="/my-account/domains">Mi cuenta <i class="fa fa-angle-right"></i> Dominios</a> y elige tu dominio.
2. Abre **Configuración avanzada** y busca **Contraseñas de captura general**.
3. Haz clic en **Generar contraseña**. Deja el campo en blanco para obtener una contraseña aleatoria segura y, si quieres, añade una descripción (por ejemplo "Webmail en mi portátil").
4. Copia la contraseña. Solo se muestra una vez.

Necesitas ser administrador del dominio para ver esta sección. Usa **Administrar contraseñas** en el mismo lugar para ver o eliminar contraseñas catch-all más adelante. Al eliminar una, deja de funcionar en todos los lugares donde esté guardada.

### Paso 2: Guárdala en el webmail {#step-2-save-it-in-webmail}

1. En el webmail, abre **Settings <i class="fa fa-angle-right"></i> General**.
2. Busca la tarjeta llamada **Send from any address**, justo debajo de **Your accounts**.
3. Haz clic en **Add catch-all password**.
4. Introduce el dominio (por ejemplo `example.com`) y pega la contraseña catch-all.
5. Haz clic en **Save**. Verás "You can now send from any address @example.com".

Puedes guardar contraseñas para tantos dominios como quieras. Para quitar una, haz clic en el icono de la papelera que hay a su lado.

### Paso 3: Elige la dirección al redactar {#step-3-pick-the-address-when-you-compose}

1. Empieza un mensaje nuevo.
2. Abre el menú **From**. Debajo de tus cuentas con sesión iniciada hay una entrada por cada dominio guardado: **Other address @example.com…**
3. Elígela. La línea From se convierte en un cuadro de texto seguido de `@example.com`.
4. Escribe la parte anterior a la @ (por ejemplo `billing`) y envía.

Los borradores conservan la dirección que escribiste, así que un borrador guardado se vuelve a abrir con la misma dirección From.

### Qué debes saber sobre el envío catch-all {#what-to-know-about-catch-all-sending}

* **Solo sirve para enviar.** Una contraseña catch-all solo funciona para enviar. No puede abrir un buzón, así que no puedes leer el correo de `billing@example.com` con ella. Para leer las respuestas, crea un alias (o un alias catch-all que te reenvíe el correo) para esa dirección.
* **Las copias enviadas van a la cuenta que estás usando.** Un mensaje enviado como `billing@example.com` se guarda en la carpeta de enviados de la cuenta desde la que lo redactaste.
* **Funciona desde todas las cuentas del dispositivo.** La contraseña guardada no está vinculada a una sola cuenta con sesión iniciada. Cualquier cuenta de ese dispositivo puede usarla.
* **Se queda en este dispositivo.** La contraseña solo se almacena en el dispositivo donde la guardaste. No se sincroniza, y el emparejamiento de dispositivos por QR no la copia. Añádela de nuevo en cada dispositivo.
* **App Lock la protege.** Si App Lock está activado, la contraseña se cifra junto con el resto de tus datos locales, y las entradas **Other address** se ocultan mientras la aplicación está bloqueada.
* **El envío programado no está disponible** para las direcciones que se envían con una contraseña catch-all, porque esa contraseña no puede volver a leer ni cancelar un mensaje programado. Envía el mensaje de inmediato, o envíalo como una cuenta con sesión iniciada.
* **Una contraseña incorrecta no cierra tu sesión.** Si la contraseña catch-all es incorrecta o se eliminó en el panel, el envío falla con un error y tu sesión sigue iniciada.


## Ajustes del webmail de un vistazo {#webmail-settings-at-a-glance}

| Sección                | Qué incluye                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| **General**            | Tus cuentas, enviar desde cualquier dirección (contraseñas catch-all), notificaciones, almacenamiento |
| **Appearance**         | Tema, diseño, densidad, valores predeterminados del editor, firma, fuente, enlaces externos         |
| **Privacy & Security** | App Lock, cifrado PGP, opciones de privacidad, denuncia de spam                                     |
| **Folders & Labels**   | Carpetas especiales, tus carpetas, etiquetas                                                        |
| **Filters**            | Filtros de correo para el alias con sesión iniciada                                                 |
| **Calendar**           | Primer día de la semana y tareas                                                                    |
| **Search**             | Indexación de búsqueda, estado del índice, búsquedas guardadas, operadores de búsqueda              |
| **Advanced**           | Almacenamiento del buzón, caché local y restablecimiento de la aplicación                           |
| **Keyboard Shortcuts** | Todos los atajos                                                                                    |
| **About & Help**       | Versión, descarga de la aplicación de escritorio, comentarios y enlaces                             |

Lo que pertenece al propio dominio o alias, como el DNS, los destinatarios de reenvío, los límites de almacenamiento, las respuestas automáticas de vacaciones, las contraseñas catch-all y el análisis de spam, se configura en el <a href="/my-account/domains">panel web</a>.


## Privacidad y App Lock {#privacy-and-app-lock}

El webmail guarda una copia local de tu correo para que sea rápido y funcione sin conexión. **App Lock** (en **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) cifra esos datos locales, tus ajustes y tus contraseñas guardadas en el dispositivo, y se desbloquea con una passkey o un PIN. El correo y las actualizaciones en tiempo real van directamente entre la aplicación y Forward Email, sin servicios de publicidad ni de seguimiento de por medio.


## Solución de problemas {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

El webmail no tiene ninguna contraseña para esa dirección en este dispositivo. Inicia sesión en ese alias, o guarda la contraseña catch-all del dominio en **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Si la aplicación está bloqueada, desbloquéala primero.

**La entrada "Other address" no aparece en el menú From.**

Comprueba que guardaste la contraseña catch-all en este dispositivo y que App Lock está desbloqueado.

**El envío desde una dirección catch-all falla con un error de autenticación.**

Es posible que la contraseña catch-all se haya eliminado o se haya escrito mal. Genera una nueva en el panel, luego quita la antigua en el webmail y añade la nueva.

**La contraseña del panel no funciona en el webmail.**

El webmail necesita una contraseña de alias, no la contraseña del panel. Consulta [Generar una contraseña de alias](#generate-an-alias-password).

¿Sigues con problemas? Consulta nuestras <a href="/faq">preguntas frecuentes</a> o <a href="/help">contáctanos</a>.
