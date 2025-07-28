# Enviar e-mails com React.js Node Web App Exemplo {#send-emails-with-reactjs-node-web-app-example}

## Índice {#table-of-contents}

* [Instalação e Requisitos](#install-and-requirements)
* [Código-fonte e exemplo](#source-code-and-example)

## Instalação e Requisitos {#install-and-requirements}

Você precisará instalar as dependências npm `@react-email/render` e `nodemailer`:

```sh
npm install @react-email/render nodemailer
```

## Código-fonte e exemplo {#source-code-and-example}

Crie seu modelo de e-mail com um arquivo `.jsx` ou `.js`:

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

Neste exemplo, usamos a biblioteca **[Nodemailer](https://github.com/nodemailer/nodemailer)** e seu patrocinador oficial **[Encaminhar e-mail](https://forwardemail.net)** para enviar e visualizar e-mails de saída.

Você precisará <strong class="text-success"><i class="fa fa-key"></i>Gerar senha</strong> para enviar e-mails de saída – siga nosso **[Guia para envio de e-mail com SMTP de domínio personalizado](/guides/send-email-with-custom-domain-smtp)**.

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

Execute o aplicativo para enviar o e-mail:

```sh
node app
```

Agora você pode acessar **[Minha conta → E-mails](/my-account/emails)** para ver seu status de entrega de e-mail em tempo real, registros de entrega de e-mail e visualizações de HTML/texto simples/anexos.

> P.S. :tada: Você também pode **[visualizar e-mails em navegadores e no simulador iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** e **[crie modelos de e-mail com Node.js](/docs/send-emails-with-node-js-javascript)**.