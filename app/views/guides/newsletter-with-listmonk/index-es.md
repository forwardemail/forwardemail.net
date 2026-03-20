# Listmonk con Forward Email para Entrega Segura de Boletines {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Tabla de Contenidos {#table-of-contents}

* [Resumen](#overview)
* [Por qué Listmonk y Forward Email](#why-listmonk-and-forward-email)
* [Requisitos Previos](#prerequisites)
* [Instalación](#installation)
  * [1. Actualiza tu Servidor](#1-update-your-server)
  * [2. Instala Dependencias](#2-install-dependencies)
  * [3. Descarga la Configuración de Listmonk](#3-download-listmonk-configuration)
  * [4. Configura el Firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Configura el Acceso HTTPS](#5-configure-https-access)
  * [6. Inicia Listmonk](#6-start-listmonk)
  * [7. Configura Forward Email SMTP en Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Configura el Procesamiento de Rebotes](#8-configure-bounce-processing)
* [Pruebas](#testing)
  * [Crea una Lista de Correo](#create-a-mailing-list)
  * [Agrega Suscriptores](#add-subscribers)
  * [Crea y Envía una Campaña](#create-and-send-a-campaign)
* [Verificación](#verification)
* [Notas para Desarrolladores](#developer-notes)
* [Conclusión](#conclusion)


## Resumen {#overview}

Esta guía proporciona a los desarrolladores instrucciones paso a paso para configurar [Listmonk](https://listmonk.app/), un potente gestor de boletines y listas de correo de código abierto, para usar [Forward Email](https://forwardemail.net/) como su proveedor SMTP. Esta combinación te permite gestionar tus campañas de manera efectiva mientras aseguras una entrega de correo segura, privada y confiable.

* **Listmonk**: Maneja la gestión de suscriptores, organización de listas, creación de campañas y seguimiento de rendimiento.
* **Forward Email**: Actúa como el servidor SMTP seguro, manejando el envío real de correos con funciones de seguridad integradas como SPF, DKIM, DMARC y cifrado TLS.

Al integrar ambos, mantienes el control total sobre tus datos e infraestructura mientras aprovechas el robusto sistema de entrega de Forward Email.


## Por qué Listmonk y Forward Email {#why-listmonk-and-forward-email}

* **Código Abierto**: Tanto Listmonk como los principios detrás de Forward Email enfatizan la transparencia y el control. Hospedas Listmonk tú mismo, siendo dueño de tus datos.
* **Enfoque en la Privacidad**: Forward Email está construido con la privacidad como núcleo, minimizando la retención de datos y enfocándose en la transmisión segura.
* **Económico**: Listmonk es gratuito, y Forward Email ofrece niveles gratuitos generosos y planes pagos accesibles, haciendo esta una solución amigable con el presupuesto.
* **Escalabilidad**: Listmonk es altamente eficiente, y la infraestructura de Forward Email está diseñada para una entrega confiable a gran escala.
* **Amigable para Desarrolladores**: Listmonk ofrece una API robusta, y Forward Email proporciona integración SMTP sencilla y webhooks.


## Requisitos Previos {#prerequisites}

Antes de comenzar, asegúrate de tener lo siguiente:

* Un Servidor Privado Virtual (VPS) con una distribución Linux reciente (se recomienda Ubuntu 20.04+) con al menos 1 CPU y 1GB de RAM (se recomiendan 2GB).
  * ¿Necesitas un proveedor? Consulta la [lista recomendada de VPS](https://github.com/forwardemail/awesome-mail-server-providers).
* Un nombre de dominio que controles (acceso DNS requerido).
* Una cuenta activa con [Forward Email](https://forwardemail.net/).
* Acceso root o `sudo` a tu VPS.
* Familiaridad básica con operaciones en la línea de comandos de Linux.


## Instalación {#installation}

Estos pasos te guían para instalar Listmonk usando Docker y Docker Compose en tu VPS.

### 1. Actualiza tu Servidor {#1-update-your-server}

Asegúrate de que la lista de paquetes y los paquetes instalados estén actualizados.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instala Dependencias {#2-install-dependencies}

Instala Docker, Docker Compose y UFW (Firewall Simple).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Descarga la Configuración de Listmonk {#3-download-listmonk-configuration}

Crea un directorio para Listmonk y descarga el archivo oficial `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Este archivo define el contenedor de la aplicación Listmonk y su contenedor de base de datos PostgreSQL requerido.
### 4. Configurar Firewall (UFW) {#4-configure-firewall-ufw}

Permita el tráfico esencial (SSH, HTTP, HTTPS) a través del firewall. Si su SSH funciona en un puerto no estándar, ajústelo en consecuencia.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Confirme la activación del firewall cuando se le solicite.

### 5. Configurar Acceso HTTPS {#5-configure-https-access}

Ejecutar Listmonk sobre HTTPS es crucial para la seguridad. Tiene dos opciones principales:

#### Opción A: Usar Proxy de Cloudflare (Recomendado por su Simplicidad) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Si el DNS de su dominio está gestionado por Cloudflare, puede aprovechar su función de proxy para un HTTPS sencillo.

1. **Apuntar DNS**: Cree un registro `A` en Cloudflare para su subdominio de Listmonk (por ejemplo, `listmonk.sudominio.com`) apuntando a la dirección IP de su VPS. Asegúrese de que el **Estado del proxy** esté configurado en **Proxied** (nube naranja).
2. **Modificar Docker Compose**: Edite el archivo `docker-compose.yml` que descargó:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Esto hace que Listmonk sea accesible internamente en el puerto 80, que Cloudflare puede luego proxyar y asegurar con HTTPS.

#### Opción B: Usar un Proxy Reverso (Nginx, Caddy, etc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativamente, puede configurar un proxy reverso como Nginx o Caddy en su VPS para manejar la terminación HTTPS y reenviar las solicitudes a Listmonk (que por defecto corre en el puerto 9000).

* Mantenga el valor por defecto `ports: - "127.0.0.1:9000:9000"` en `docker-compose.yml` para asegurar que Listmonk solo sea accesible localmente.
* Configure su proxy reverso elegido para escuchar en los puertos 80 y 443, manejar la adquisición del certificado SSL (por ejemplo, vía Let's Encrypt) y reenviar el tráfico a `http://127.0.0.1:9000`.
* La configuración detallada del proxy reverso está fuera del alcance de esta guía, pero hay muchos tutoriales disponibles en línea.

### 6. Iniciar Listmonk {#6-start-listmonk}

Navegue de nuevo a su directorio `listmonk` (si no está ya allí) y arranque los contenedores en modo desacoplado.

```bash
cd ~/listmonk # O el directorio donde guardó docker-compose.yml
docker compose up -d
```

Docker descargará las imágenes necesarias y arrancará los contenedores de la aplicación Listmonk y la base de datos. Puede tardar uno o dos minutos la primera vez.

✅ **Acceder a Listmonk**: Ahora debería poder acceder a la interfaz web de Listmonk a través del dominio que configuró (por ejemplo, `https://listmonk.sudominio.com`).

### 7. Configurar SMTP de Forward Email en Listmonk {#7-configure-forward-email-smtp-in-listmonk}

A continuación, configure Listmonk para enviar correos usando su cuenta de Forward Email.

1. **Habilitar SMTP en Forward Email**: Asegúrese de haber generado credenciales SMTP dentro del panel de su cuenta de Forward Email. Siga la [guía de Forward Email para enviar correo con un dominio personalizado vía SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) si aún no lo ha hecho.
2. **Configurar Listmonk**: Inicie sesión en el panel de administración de Listmonk.
   * Navegue a **Configuración -> SMTP**.

   * Listmonk tiene soporte integrado para Forward Email. Seleccione **ForwardEmail** en la lista de proveedores, o ingrese manualmente los siguientes datos:

     | Configuración     | Valor                                                                                                              |
     | :---------------- | :----------------------------------------------------------------------------------------------------------------- |
     | **Host**          | `smtp.forwardemail.net`                                                                                            |
     | **Puerto**        | `465`                                                                                                              |
     | **Protocolo Auth**| `LOGIN`                                                                                                            |
     | **Usuario**       | Su **nombre de usuario SMTP** de Forward Email                                                                    |
     | **Contraseña**    | Su **contraseña SMTP** de Forward Email                                                                            |
     | **TLS**           | `SSL/TLS`                                                                                                          |
     | **Correo desde**  | La dirección `From` deseada (por ejemplo, `newsletter@sudominio.com`). Asegúrese de que este dominio esté configurado en Forward Email. |
* **Importante**: Siempre use el Puerto `465` con `SSL/TLS` para conexiones seguras con Forward Email (recomendado). El puerto `587` con STARTTLS también es compatible, pero se prefiere SSL/TLS.

   * Haga clic en **Guardar**.
3. **Enviar correo de prueba**: Use el botón "Enviar correo de prueba" dentro de la página de configuración SMTP. Ingrese una dirección de destinatario a la que tenga acceso y haga clic en **Enviar**. Verifique que el correo llegue a la bandeja de entrada del destinatario.

### 8. Configurar el procesamiento de rebotes {#8-configure-bounce-processing}

El procesamiento de rebotes permite que Listmonk maneje automáticamente los correos que no pudieron ser entregados (por ejemplo, debido a direcciones inválidas). Forward Email proporciona un webhook para notificar a Listmonk sobre los rebotes.

#### Configuración de Forward Email {#forward-email-setup}

1. Inicie sesión en su [Panel de Forward Email](https://forwardemail.net/).
2. Navegue a **Dominios**, seleccione el dominio que está usando para enviar y vaya a su página de **Configuración**.
3. Desplácese hacia abajo hasta la sección **URL del webhook de rebotes**.
4. Ingrese la siguiente URL, reemplazando `<your_listmonk_domain>` con el dominio o subdominio real donde su instancia de Listmonk es accesible:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Ejemplo*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Desplácese aún más hacia abajo hasta la sección **Clave de verificación de la carga útil de la firma del webhook**.
6. **Copie** la clave de verificación generada. La necesitará en Listmonk.
7. Guarde los cambios en la configuración del dominio de Forward Email.

#### Configuración de Listmonk {#listmonk-setup}

1. En el panel de administración de Listmonk, navegue a **Configuración -> Rebotes**.
2. Active **Habilitar procesamiento de rebotes**.
3. Active **Habilitar webhooks de rebotes**.
4. Desplácese a la sección **Proveedores de webhook**.
5. Active **Forward Email**.
6. Pegue la **Clave de verificación de la carga útil de la firma del webhook** que copió del panel de Forward Email en el campo **Clave de Forward Email**.
7. Haga clic en **Guardar** al final de la página.
8. ¡El procesamiento de rebotes ya está configurado! Cuando Forward Email detecte un rebote de un correo enviado por Listmonk, notificará a su instancia de Listmonk vía webhook, y Listmonk marcará al suscriptor en consecuencia.
9. Complete los pasos a continuación en [Pruebas](#testing) para asegurarse de que todo funcione correctamente.


## Pruebas {#testing}

Aquí tiene un resumen rápido de las funciones principales de Listmonk:

### Crear una lista de correo {#create-a-mailing-list}

* Vaya a **Listas** en la barra lateral.
* Haga clic en **Nueva lista**.
* Complete los detalles (Nombre, Tipo: Público/Privado, Descripción, Etiquetas) y **Guarde**.

### Añadir suscriptores {#add-subscribers}

* Navegue a la sección **Suscriptores**.
* Puede añadir suscriptores:
  * **Manualmente**: Haga clic en **Nuevo suscriptor**.
  * **Importar**: Haga clic en **Importar suscriptores** para subir un archivo CSV.
  * **API**: Use la API de Listmonk para adiciones programáticas.
* Asigne suscriptores a una o más listas durante la creación o importación.
* **Mejor práctica**: Use un proceso de doble opt-in. Configure esto en **Configuración -> Opt-in y suscripciones**.

### Crear y enviar una campaña {#create-and-send-a-campaign}

* Vaya a **Campañas** -> **Nueva campaña**.
* Complete los detalles de la campaña (Nombre, Asunto, Correo del remitente, Lista(s) a enviar).
* Elija su tipo de contenido (Texto enriquecido/HTML, Texto plano, HTML sin procesar).
* Redacte el contenido de su correo. Puede usar variables de plantilla como `{{ .Subscriber.Email }}` o `{{ .Subscriber.FirstName }}`.
* **¡Siempre envíe un correo de prueba primero!** Use la opción "Enviar prueba" para previsualizar el correo en su bandeja de entrada.
* Una vez satisfecho, haga clic en **Iniciar campaña** para enviar inmediatamente o prográmela para más tarde.


## Verificación {#verification}

* **Entrega SMTP**: Envíe regularmente correos de prueba a través de la página de configuración SMTP de Listmonk y campañas de prueba para asegurar que los correos se entreguen correctamente.
* **Manejo de rebotes**: Envíe una campaña de prueba a una dirección de correo inválida conocida (por ejemplo, `bounce-test@yourdomain.com` si no tiene una real a mano, aunque los resultados pueden variar). Revise las estadísticas de la campaña en Listmonk después de un rato para ver si el rebote se registró.
* **Encabezados de correo**: Use herramientas como [Mail-Tester](https://www.mail-tester.com/) o inspeccione manualmente los encabezados del correo para verificar que SPF, DKIM y DMARC estén pasando, indicando una configuración correcta a través de Forward Email.
* **Registros de Forward Email**: Revise los registros en su panel de Forward Email si sospecha problemas de entrega originados en el servidor SMTP.
## Notas para Desarrolladores {#developer-notes}

* **Plantillas**: Listmonk utiliza el motor de plantillas de Go. Explora su documentación para personalización avanzada: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk ofrece una API REST completa para gestionar listas, suscriptores, campañas, plantillas y más. Encuentra el enlace a la documentación de la API en el pie de página de tu instancia de Listmonk.
* **Campos Personalizados**: Define campos personalizados para suscriptores en **Configuración -> Campos de Suscriptores** para almacenar datos adicionales.
* **Webhooks**: Además de rebotes, Listmonk puede enviar webhooks para otros eventos (p. ej., suscripciones), permitiendo la integración con otros sistemas.


## Conclusión {#conclusion}

Al integrar el poder autoalojado de Listmonk con la entrega segura y respetuosa con la privacidad de Forward Email, creas una plataforma de marketing por correo electrónico robusta y ética. Mantienes la propiedad total de los datos de tu audiencia mientras te beneficias de una alta entregabilidad y funciones de seguridad automatizadas.

Esta configuración ofrece una alternativa escalable, rentable y amigable para desarrolladores frente a servicios de correo electrónico propietarios, alineándose perfectamente con la filosofía del software de código abierto y la privacidad del usuario.

¡Feliz envío! 🚀
