# Ejemplo de Código Node.js para Formularios de Contacto en JavaScript {#javascript-contact-forms-nodejs-code-example}


## Tabla de Contenidos {#table-of-contents}

* [Instalación y Requisitos](#install-and-requirements)
* [Código Fuente y Ejemplo](#source-code-and-example)


## Instalación y Requisitos {#install-and-requirements}

Necesitarás instalar la dependencia npm `nodemailer`:

```sh
npm install nodemailer
```


## Código Fuente y Ejemplo {#source-code-and-example}

Este ejemplo usa la biblioteca **[Nodemailer](https://github.com/nodemailer/nodemailer)** y su patrocinador oficial **[Forward Email](https://forwardemail.net)** para enviar y previsualizar correos salientes.

Necesitarás <strong class="text-success"><i class="fa fa-key"></i> Generar Contraseña</strong> para enviar correos salientes – por favor sigue nuestra **[Guía para Enviar Email con SMTP de Dominio Personalizado](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: reemplazar los valores de `user` y `pass` desde:
    // <https://forwardemail.net/guides/send-email-with-custom-domain-smtp>
    user: 'you@example.com',
    pass: '****************************'
  },
});

await transporter.sendMail({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hola mundo',
  html: '<h1>hola mundo</h1>'
});
```

Ejecuta la aplicación para enviar el correo:

```sh
node app
```

Ahora puedes ir a **[Mi Cuenta → Correos](/my-account/emails)** para ver el estado de entrega de tus correos en tiempo real, registros de entregabilidad y previsualizaciones en HTML/texto plano/adjuntos.

> P.D. :tada: También puedes **[previsualizar correos en navegadores y el simulador de iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** y **[crear plantillas de correo con Node.js](/docs/send-emails-with-node-js-javascript)**.
