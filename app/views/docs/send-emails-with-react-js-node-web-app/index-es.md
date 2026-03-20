# Enviar correos electrónicos con ejemplo de aplicación web React.js Node {#send-emails-with-reactjs-node-web-app-example}


## Tabla de Contenidos {#table-of-contents}

* [Instalación y Requisitos](#install-and-requirements)
* [Código Fuente y Ejemplo](#source-code-and-example)


## Instalación y Requisitos {#install-and-requirements}

Necesitarás instalar las dependencias npm `@react-email/render` y `nodemailer`:

```sh
npm install @react-email/render nodemailer
```


## Código Fuente y Ejemplo {#source-code-and-example}

Crea tu plantilla de correo con un archivo `.jsx` o `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Visita nuestro sitio web</Button>
    </Html>
  );
}
```

En este ejemplo, usamos la biblioteca **[Nodemailer](https://github.com/nodemailer/nodemailer)** y su patrocinador oficial **[Forward Email](https://forwardemail.net)** para enviar y previsualizar correos salientes.

Necesitarás <strong class="text-success"><i class="fa fa-key"></i> Generar Contraseña</strong> para enviar correos salientes – por favor sigue nuestra **[Guía para Enviar Correo con SMTP de Dominio Personalizado](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: reemplaza los valores `user` y `pass` de:
    // <https://forwardemail.net/guides/send-email-with-custom-domain-smtp>
    user: 'you@example.com',
    pass: '****************************'
  },
});

const html = render(Email({ url: "https://example.com" }));

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hola mundo',
  html
};

transporter.sendMail(options);
```

Ejecuta la aplicación para enviar el correo:

```sh
node app
```

Ahora puedes ir a **[Mi Cuenta → Correos](/my-account/emails)** para ver el estado de entrega de tus correos en tiempo real, registros de entregabilidad y vistas previas en HTML/texto plano/adjuntos.

> P.D. :tada: También puedes **[previsualizar correos en navegadores y el simulador de iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** y **[crear plantillas de correo con Node.js](/docs/send-emails-with-node-js-javascript)**.
