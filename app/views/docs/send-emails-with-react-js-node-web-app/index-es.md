# Enviar correos electrónicos con el ejemplo de aplicación web Node de React.js {#send-emails-with-reactjs-node-web-app-example}

## Tabla de contenido {#table-of-contents}

* [Instalación y requisitos](#install-and-requirements)
* [Código fuente y ejemplo](#source-code-and-example)

## Instalación y requisitos {#install-and-requirements}

Necesitará instalar las dependencias npm `@react-email/render` y `nodemailer`:

```sh
npm install @react-email/render nodemailer
```

## Código fuente y ejemplo {#source-code-and-example}

Cree su plantilla de correo electrónico con un archivo `.jsx` o `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Visit our website</Button>
    </Html>
  );
}
```

En este ejemplo, utilizamos la biblioteca **[Nodemailer](https://github.com/nodemailer/nodemailer)** y su patrocinador oficial **[Reenviar correo electrónico](https://forwardemail.net)** para enviar y obtener una vista previa del correo saliente.

Necesitará <strong class="text-success"><i class="fa fa-key"></i>Generar contraseña</strong> para enviar correo saliente. Siga nuestro **[Guía para enviar correos electrónicos con dominio personalizado SMTP](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { Email } from './email';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from:
    // <https://forwardemail.net/guides/send-email-with-custom-domain-smtp>
    user: 'you@example.com',
    pass: '****************************'
  },
});

const html = render(Email({ url: "https://example.com" }));

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html
};

transporter.sendMail(options);
```

Ejecute la aplicación para enviar el correo electrónico:

```sh
node app
```

Ahora puede ir a **[Mi cuenta → Correos electrónicos](/my-account/emails)** para ver el estado de entrega de su correo electrónico en tiempo real, los registros de capacidad de entrega de correo electrónico y las vistas previas de HTML/texto simple/archivos adjuntos.

> P.D. :tada: También puedes usar **[Vista previa de correos electrónicos en navegadores y el simulador de iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** y **[crear plantillas de correo electrónico con Node.js](/docs/send-emails-with-node-js-javascript)**.