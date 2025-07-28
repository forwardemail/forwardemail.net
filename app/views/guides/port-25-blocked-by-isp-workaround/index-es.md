# Puerto 25 bloqueado por solución alternativa del ISP {#port-25-blocked-by-isp-workaround}

## Tabla de contenido {#table-of-contents}

* [Cómo evitar que el ISP bloquee el SMTP entrante en el puerto 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Cómo evitar que el ISP bloquee el SMTP saliente en el puerto 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [¿Cómo puedo comprobar si mi ISP bloquea puertos?](#how-can-i-check-if-my-isp-blocks-ports)

## Cómo evitar que el ISP bloquee el SMTP entrante en el puerto 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Si no tiene abierto el puerto 25 en la dirección IP de su servidor de correo, esta guía es para usted.

Por ejemplo, supongamos que está ejecutando un servidor de correo personalizado en su casa y su proveedor de servicios de Internet ("ISP") ha bloqueado el puerto de salida 25.

Dado que no puede tener tráfico saliente en el puerto 25, lo más probable es que tampoco tenga tráfico entrante en el puerto 25 debido a este bloqueo.

Suponiendo que está utilizando nuestro servicio para reenviar correos electrónicos, [Puede solucionar este problema a través de nuestras respuestas a preguntas frecuentes aquí.](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Cómo evitar que el ISP bloquee el SMTP saliente en el puerto 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Si su ISP bloquea el puerto de salida 25, tendrá que buscar una solución alternativa o contactarlo.

## ¿Cómo puedo comprobar si mi ISP bloquea los puertos {#how-can-i-check-if-my-isp-blocks-ports}?

Puede ejecutar `telnet smtp.forwardemail.net 25` desde la línea de comando o la terminal para ver si su conexión del puerto saliente 25 está bloqueada.