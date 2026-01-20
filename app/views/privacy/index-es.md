# Política de privacidad {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## Tabla de contenido {#table-of-contents}

* [Descargo de responsabilidad](#disclaimer)
* [Información no recopilada](#information-not-collected)
* [Información recopilada](#information-collected)
* [Información compartida](#information-shared)
* [Eliminación de información](#information-removal)
* [Divulgaciones adicionales](#additional-disclosures)

## Descargo de responsabilidad {#disclaimer}

Por favor, consulte nuestro [Términos](/terms) ya que se aplica a todo el sitio.

## Información no recopilada {#information-not-collected}

**Con la excepción de [errores](/faq#do-you-store-error-logs), [correos electrónicos SMTP salientes](/faq#do-you-support-sending-email-with-smtp) y/o cuando se detecta spam o actividad maliciosa (por ejemplo, para limitar la velocidad):**

* No almacenamos los correos electrónicos reenviados en discos ni bases de datos.
* No almacenamos metadatos de correos electrónicos en discos ni bases de datos.
* No almacenamos registros ni direcciones IP en discos ni bases de datos.

## Información recopilada {#information-collected}

Para mayor transparencia, en cualquier momento puede <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">ver nuestro código fuente</a> para ver cómo se recopila y utiliza la siguiente información:

**Estrictamente por motivos de funcionalidad y para mejorar nuestro servicio, recopilamos y almacenamos de forma segura la siguiente información:**

* Almacenamos correos electrónicos e información de calendario en su [base de datos SQLite cifrada](/blog/docs/best-quantum-safe-encrypted-email-service) exclusivamente para su acceso IMAP/POP3/CalDAV/CardDAV y la funcionalidad de su buzón.
* Tenga en cuenta que si utiliza únicamente nuestros servicios de reenvío de correo electrónico, no se almacenan correos electrónicos en el disco ni en la base de datos, como se describe en [Información no recopilada](#information-not-collected).
* Nuestros servicios de reenvío de correo electrónico funcionan únicamente en memoria (no se escribe en el disco ni en las bases de datos).
* El almacenamiento IMAP/POP3/CalDAV/CardDAV está cifrado en reposo, en tránsito y se almacena en un disco con cifrado LUKS.
* Las copias de seguridad de su almacenamiento IMAP/POP3/CalDAV/CardDAV están cifradas en reposo, en tránsito y se almacenan en [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).
* Almacenamos una cookie en cada sesión para el tráfico de su sitio web.
* Almacenamos la dirección de correo electrónico que nos proporciona. * Almacenamos los nombres de dominio, alias y configuraciones que nos proporciona.
* Almacenamos los códigos de respuesta SMTP `4xx` y `5xx` ([registros de errores](/faq#do-you-store-error-logs)) durante 7 días.
* Almacenamos [correos electrónicos SMTP salientes](/faq#do-you-support-sending-email-with-smtp) durante aproximadamente 30 días.
* Esta duración varía según el encabezado "Fecha", ya que permitimos el envío de correos electrónicos en el futuro si existe un encabezado "Fecha".
* **Tenga en cuenta que, una vez que un correo electrónico se entrega correctamente o se produce un error permanente, redactaremos y eliminaremos el cuerpo del mensaje.**
* Si desea configurar el cuerpo de su mensaje SMTP saliente para que se conserve durante más tiempo del predeterminado de 0 días (tras la entrega correcta o un error permanente), vaya a la Configuración avanzada de su dominio e introduzca un valor entre `0` y `30`. * Algunos usuarios prefieren usar la función de vista previa [Mi cuenta > Correos electrónicos](/my-account/emails) para ver cómo se procesan sus correos electrónicos, por lo que ofrecemos un periodo de retención configurable.
* Tenga en cuenta que también ofrecemos compatibilidad con __PROTECTED_LINK_30__0.
* Cualquier información adicional que nos proporcione voluntariamente, como comentarios o preguntas enviadas por correo electrónico o en nuestra página de <a href="/help">ayuda</a>.

## Información compartida {#information-shared}

No compartimos su información con terceros. Tampoco utilizamos servicios de análisis ni software de telemetría de terceros.

Es posible que tengamos que cumplir y cumpliremos con los pedidos legales ordenados por el tribunal (pero tenga en cuenta [No recopilamos la información mencionada anteriormente en "Información no recopilada".](#information-not-collected), por lo que no podremos proporcionarlo para empezar).

## Eliminación de información {#information-removal}

Si en algún momento desea eliminar la información que nos ha proporcionado, vaya a <a href="/my-account/security">Mi cuenta > Seguridad</a> y haga clic en "Eliminar cuenta".

Debido a la prevención y mitigación de abusos, es posible que nuestros administradores requieran una revisión de eliminación manual de su cuenta si la elimina dentro de los 5 días posteriores a su primer pago.

Este proceso generalmente demora menos de 24 horas y se implementó debido a que los usuarios enviaban spam con nuestro servicio y luego eliminaban rápidamente sus cuentas, lo que nos impidió bloquear sus huellas digitales de métodos de pago en Stripe.

## Divulgaciones adicionales {#additional-disclosures}

Este sitio está protegido por Cloudflare y se aplican sus [política de privacidad](https://www.cloudflare.com/privacypolicy/) y [Condiciones de servicio](https://www.cloudflare.com/website-terms/).