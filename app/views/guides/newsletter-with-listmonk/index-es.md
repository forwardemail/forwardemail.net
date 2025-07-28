# Listmonk con reenvío de correo electrónico para la entrega segura de boletines {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Tabla de contenido {#table-of-contents}

* [Descripción general](#overview)
* [¿Por qué Listmonk y Forward Email?](#why-listmonk-and-forward-email)
* [Prerrequisitos](#prerequisites)
* [Instalación](#installation)
  * [1. Actualice su servidor](#1-update-your-server)
  * [2. Instalar dependencias](#2-install-dependencies)
  * [3. Descargar la configuración de Listmonk](#3-download-listmonk-configuration)
  * [4. Configurar el firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Configurar el acceso HTTPS](#5-configure-https-access)
  * [6. Iniciar Listmonk](#6-start-listmonk)
  * [7. Configurar el reenvío de correo electrónico SMTP en Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Configurar el procesamiento de rebotes](#8-configure-bounce-processing)
* [Pruebas](#testing)
  * [Crear una lista de correo](#create-a-mailing-list)
  * [Agregar suscriptores](#add-subscribers)
  * [Crear y enviar una campaña](#create-and-send-a-campaign)
* [Verificación](#verification)
* [Notas del desarrollador](#developer-notes)
* [Conclusión](#conclusion)

## Descripción general {#overview}

Esta guía proporciona a los desarrolladores instrucciones paso a paso para configurar [Listmonk](https://listmonk.app/), un potente gestor de boletines y listas de correo de código abierto, para que utilice [Reenviar correo electrónico](https://forwardemail.net/) como proveedor SMTP. Esta combinación permite gestionar las campañas eficazmente, garantizando al mismo tiempo un envío de correo electrónico seguro, privado y fiable.

**Listmonk**: Gestiona la gestión de suscriptores, la organización de listas, la creación de campañas y el seguimiento del rendimiento.

**Reenvío de correo electrónico**: Actúa como servidor SMTP seguro, gestionando el envío de correos electrónicos con funciones de seguridad integradas como SPF, DKIM, DMARC y cifrado TLS.

Al integrar estos dos, usted conserva el control total sobre sus datos e infraestructura mientras aprovecha el sólido sistema de entrega de Forward Email.

## ¿Por qué Listmonk y reenviar correo electrónico? {#why-listmonk-and-forward-email}

**Código abierto**: Tanto Listmonk como los principios de Forward Email priorizan la transparencia y el control. Usted mismo aloja Listmonk y es el propietario de sus datos.
* **Privacidad**: Forward Email se basa en la privacidad, minimizando la retención de datos y priorizando la transmisión segura.
* **Económico**: Listmonk es gratuito y Forward Email ofrece generosos planes gratuitos y planes de pago asequibles, lo que lo convierte en una solución económica.
* **Escalabilidad**: Listmonk ofrece un alto rendimiento y la infraestructura de Forward Email está diseñada para una entrega confiable a escala.
* **Fácil de usar**: Listmonk ofrece una API robusta y Forward Email proporciona una integración SMTP y webhooks sencillos.

## Requisitos previos {#prerequisites}

Antes de comenzar, asegúrese de tener lo siguiente:

* Un Servidor Virtual Privado (VPS) con una distribución reciente de Linux (se recomienda Ubuntu 20.04 o superior) con al menos 1 CPU y 1 GB de RAM (se recomiendan 2 GB).
* ¿Necesitas un proveedor? Consulta [lista de VPS recomendados](https://github.com/forwardemail/awesome-mail-server-providers).
* Un nombre de dominio que controles (se requiere acceso DNS).
* Una cuenta activa con [Reenviar correo electrónico](https://forwardemail.net/).
* Acceso root o `sudo` a tu VPS.
* Conocimientos básicos de la línea de comandos de Linux.

## Instalación {#installation}

Estos pasos lo guiarán a través de la instalación de Listmonk usando Docker y Docker Compose en su VPS.

### 1. Actualice su servidor {#1-update-your-server}

Asegúrese de que la lista de paquetes de su sistema y los paquetes instalados estén actualizados.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar dependencias {#2-install-dependencies}

Instalar Docker, Docker Compose y UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Descargar la configuración de Listmonk {#3-download-listmonk-configuration}

Cree un directorio para Listmonk y descargue el archivo oficial `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Este archivo define el contenedor de la aplicación Listmonk y el contenedor de base de datos PostgreSQL requerido.

### 4. Configurar el firewall (UFW) {#4-configure-firewall-ufw}

Permita el tráfico esencial (SSH, HTTP, HTTPS) a través del firewall. Si su SSH se ejecuta en un puerto no estándar, ajústelo según corresponda.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Confirme la habilitación del firewall cuando se le solicite.

### 5. Configurar el acceso HTTPS {#5-configure-https-access}

Ejecutar Listmonk mediante HTTPS es crucial para la seguridad. Tiene dos opciones principales:

#### Opción A: Usar el proxy de Cloudflare (recomendado por simplicidad) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Si el DNS de su dominio está administrado por Cloudflare, puede aprovechar su función de proxy para acceder a HTTPS fácilmente.

1. **DNS de punto**: Crea un registro `A` en Cloudflare para tu subdominio de Listmonk (p. ej., `listmonk.yourdomain.com`) que apunte a la dirección IP de tu VPS. Asegúrate de que el **Estado del proxy** esté configurado como **Con proxy** (nube naranja).
2. **Modifica Docker Compose**: Edita el archivo `docker-compose.yml` que descargaste:

```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Esto permite que Listmonk sea accesible internamente en el puerto 80, que Cloudflare puede usar como proxy y proteger con HTTPS.

#### Opción B: Uso de un proxy inverso (Nginx, Caddy, etc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Como alternativa, puede configurar un proxy inverso como Nginx o Caddy en su VPS para manejar la terminación HTTPS y las solicitudes de proxy a Listmonk (que se ejecuta en el puerto 9000 de manera predeterminada).

* Mantenga el valor predeterminado `ports: - "127.0.0.1:9000:9000"` en `docker-compose.yml` para garantizar que Listmonk solo sea accesible localmente.
* Configure el proxy inverso elegido para que escuche en los puertos 80 y 443, gestione la adquisición de certificados SSL (por ejemplo, mediante Let's Encrypt) y reenvíe el tráfico a `http://127.0.0.1:9000`.
* La configuración detallada del proxy inverso queda fuera del alcance de esta guía, pero hay muchos tutoriales disponibles en línea.

### 6. Iniciar Listmonk {#6-start-listmonk}

Regrese a su directorio `listmonk` (si aún no está allí) e inicie los contenedores en modo separado.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker descargará las imágenes necesarias e iniciará la aplicación Listmonk y los contenedores de la base de datos. La primera vez, podría tardar uno o dos minutos.

✅ **Acceder a Listmonk**: Ahora debería poder acceder a la interfaz web de Listmonk a través del dominio que configuró (por ejemplo, `https://listmonk.yourdomain.com`).

### 7. Configurar el reenvío de correo electrónico SMTP en Listmonk {#7-configure-forward-email-smtp-in-listmonk}

A continuación, configure Listmonk para enviar correos electrónicos utilizando su cuenta de reenvío de correo electrónico.

1. **Habilitar SMTP en el reenvío de correo**: Asegúrate de haber generado las credenciales SMTP en el panel de control de tu cuenta de reenvío de correo. Sigue el procedimiento [Guía de reenvío de correo electrónico para enviar correo electrónico con un dominio personalizado a través de SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) si aún no lo has hecho.
2. **Configurar Listmonk**: Inicia sesión en tu panel de administración de Listmonk.
* Ve a **Configuración -> SMTP**.

Listmonk cuenta con soporte integrado para reenvío de correo electrónico. Seleccione **Reenvío de correo electrónico** en la lista de proveedores o introduzca manualmente los siguientes datos:

| Configuración | Valor |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Anfitrión** | `smtp.forwardemail.net` |
| **Puerto** | `465` |
| **Protocolo de autenticación** | `LOGIN` |
| **Nombre de usuario** | Su correo electrónico de reenvío **Nombre de usuario SMTP** |
| **Contraseña** | Su correo electrónico de reenvío **Contraseña SMTP** |
| **TLS** | `SSL/TLS` |
| **Desde correo electrónico** | La dirección `From` deseada (p. ej., `newsletter@yourdomain.com`). Asegúrese de que este dominio esté configurado en Reenvío de correo electrónico. |

**Importante**: Utilice siempre el puerto `465` con `SSL/TLS` para conexiones seguras con reenvío de correo electrónico. No utilice STARTTLS (puerto 587).

* Haga clic en **Guardar**.
3. **Enviar correo electrónico de prueba**: Use el botón "Enviar correo electrónico de prueba" en la página de configuración de SMTP. Ingrese una dirección de destinatario accesible y haga clic en **Enviar**. Verifique que el correo electrónico llegue a la bandeja de entrada del destinatario.

### 8. Configurar el procesamiento de rebotes {#8-configure-bounce-processing}

El procesamiento de rebotes permite a Listmonk gestionar automáticamente los correos electrónicos que no se pudieron entregar (por ejemplo, debido a direcciones no válidas). Forward Email proporciona un webhook para notificar a Listmonk sobre los rebotes.

#### Configuración de reenvío de correo electrónico {#forward-email-setup}

1. Inicia sesión en tu [Panel de control de reenvío de correo electrónico](https://forwardemail.net/).
2. Ve a **Dominios**, selecciona el dominio que usas para enviar y ve a su página **Configuración**.
3. Desplázate hacia abajo hasta la sección **URL del Webhook de Rebote**.
4. Introduce la siguiente URL, reemplazando `<your_listmonk_domain>` por el dominio o subdominio donde se puede acceder a tu instancia de Listmonk:
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Ejemplo*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Desplázate hacia abajo hasta la sección **Clave de Verificación de la Carga Útil de la Firma del Webhook**.
6. **Copia** la clave de verificación generada. La necesitarás en Listmonk.
7. Guarda los cambios en la configuración de tu dominio de Reenvío de Correo Electrónico.

#### Configuración de Listmonk {#listmonk-setup}

1. En el panel de administración de Listmonk, ve a **Configuración -> Rebotes**.
2. Activa **Habilitar procesamiento de rebotes**.
3. Activa **Habilitar webhooks de rebote**.
4. Desplázate hacia abajo hasta la sección **Proveedores de webhooks**.
5. Activa **Reenvío de correo electrónico**.
6. Pega la **Clave de verificación de carga útil de firma de webhook** que copiaste del panel de Reenvío de correo electrónico en el campo **Clave de reenvío de correo electrónico**.
7. Haz clic en **Guardar** al final de la página.
8. ¡El procesamiento de rebotes ya está configurado! Cuando Reenvío de correo electrónico detecte un rebote en un correo electrónico enviado por Listmonk, notificará a tu instancia de Listmonk a través del webhook y Listmonk marcará al suscriptor como corresponde.
9. Completa los pasos a continuación en [Pruebas](#testing) para asegurarte de que todo funcione correctamente.

## Prueba {#testing}

A continuación se muestra una descripción general rápida de las funciones principales de Listmonk:

### Crear una lista de correo {#create-a-mailing-list}

* Ve a **Listas** en la barra lateral.
* Haz clic en **Nueva lista**.
* Completa los datos (nombre, tipo: público/privado, descripción, etiquetas) y **Guardar**.

### Agregar suscriptores {#add-subscribers}

* Ve a la sección **Suscriptores**.
* Puedes añadir suscriptores:
* **Manualmente**: Haz clic en **Nuevo suscriptor**.
* **Importar**: Haz clic en **Importar suscriptores** para subir un archivo CSV.
* **API**: Usa la API de Listmonk para añadir suscriptores programáticamente.
* Asigna suscriptores a una o más listas durante la creación o importación.
* **Práctica recomendada**: Usa un proceso de doble suscripción. Configúralo en **Configuración -> Suscripción y suscripción**.

### Crear y enviar una campaña {#create-and-send-a-campaign}

* Ve a **Campañas** -> **Nueva Campaña**.
* Completa los detalles de la campaña (Nombre, Asunto, Correo del remitente, Lista(s) a las que se enviará).
* Elige el tipo de contenido (Texto enriquecido/HTML, Texto sin formato, HTML sin formato).
* Redacta el contenido de tu correo electrónico. Puedes usar variables de plantilla como `{{ .Subscriber.Email }}` o `{{ .Subscriber.FirstName }}`.
* **¡Siempre envía un correo electrónico de prueba primero!** Usa la opción "Enviar prueba" para obtener una vista previa del correo electrónico en tu bandeja de entrada.
* Una vez que estés satisfecho, haz clic en **Iniciar campaña** para enviarlo inmediatamente o programarlo para más tarde.

## Verificación {#verification}

**Entrega SMTP**: Envía regularmente correos electrónicos de prueba a través de la página de configuración SMTP de Listmonk y realiza campañas de prueba para garantizar que se entreguen correctamente.

**Gestión de rebotes**: Envía una campaña de prueba a una dirección de correo electrónico no válida (por ejemplo, `bounce-test@yourdomain.com` si no tienes una real a mano, aunque los resultados pueden variar). Revisa las estadísticas de la campaña en Listmonk después de un rato para ver si se registra el rebote.

**Encabezados de correo electrónico**: Usa herramientas como [Probador de correo](https://www.mail-tester.com/) o inspecciona manualmente los encabezados de correo electrónico para verificar que SPF, DKIM y DMARC estén funcionando correctamente, lo que indica una configuración correcta mediante el reenvío de correo electrónico.

**Registros de reenvío de correo electrónico**: Consulta los registros del panel de reenvío de correo electrónico si sospechas que hay problemas de entrega originados por el servidor SMTP.

## Notas del desarrollador {#developer-notes}

* **Plantillas**: Listmonk utiliza el motor de plantillas de Go. Consulta su documentación para obtener opciones de personalización avanzadas: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk ofrece una API REST completa para gestionar listas, suscriptores, campañas, plantillas y más. Encuentra el enlace a la documentación de la API en el pie de página de tu instancia de Listmonk.
* **Campos personalizados**: Define campos de suscriptor personalizados en **Configuración -> Campos de suscriptor** para almacenar datos adicionales.
* **Webhooks**: Además de los rebotes, Listmonk puede enviar webhooks para otros eventos (por ejemplo, suscripciones), lo que permite la integración con otros sistemas.

## Conclusión {#conclusion}

Al integrar la potencia de Listmonk con la entrega segura y respetuosa con la privacidad de Forward Email, crea una plataforma de email marketing robusta y ética. Mantiene la plena propiedad de los datos de su audiencia y se beneficia de una alta capacidad de entrega y funciones de seguridad automatizadas.

Esta configuración proporciona una alternativa escalable, rentable y amigable para los desarrolladores a los servicios de correo electrónico propietarios, alineándose perfectamente con el espíritu del software de código abierto y la privacidad del usuario.

¡Feliz envío! 🚀