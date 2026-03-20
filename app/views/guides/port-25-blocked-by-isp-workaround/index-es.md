# Solución para bloqueo del puerto 25 por parte del ISP {#port-25-blocked-by-isp-workaround}


## Tabla de Contenidos {#table-of-contents}

* [Cómo solucionar el bloqueo del ISP para SMTP entrante en el puerto 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Cómo solucionar el bloqueo del ISP para SMTP saliente en el puerto 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Cómo puedo verificar si mi ISP bloquea puertos](#how-can-i-check-if-my-isp-blocks-ports)


## Cómo solucionar el bloqueo del ISP para SMTP entrante en el puerto 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Si no tienes el puerto 25 abierto en la dirección IP de tu servidor de correo, entonces esta guía es para ti.

Por ejemplo, estás ejecutando un servidor de correo personalizado en casa, y tu Proveedor de Servicios de Internet ("ISP") ha bloqueado el puerto 25 saliente.

Dado que no puedes tener tráfico saliente en el puerto 25, lo más probable es que tampoco tengas tráfico entrante en el puerto 25 debido a este bloqueo.

Asumiendo que estás usando nuestro servicio para reenviar correos electrónicos, [puedes solucionar este problema a través de nuestra respuesta en las preguntas frecuentes aquí](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Cómo solucionar el bloqueo del ISP para SMTP saliente en el puerto 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Si tu ISP bloquea el puerto 25 saliente, entonces tendrás que encontrar una solución alternativa o contactarlos.


## Cómo puedo verificar si mi ISP bloquea puertos {#how-can-i-check-if-my-isp-blocks-ports}

Puedes ejecutar `telnet smtp.forwardemail.net 25` desde la línea de comandos o terminal para ver si tu conexión saliente al puerto 25 está bloqueada.
