# Enviar Emails com Exemplo de Aplicação Web React.js Node {#send-emails-with-reactjs-node-web-app-example}


## Índice {#table-of-contents}

* [Instalação e Requisitos](#install-and-requirements)
* [Código Fonte e Exemplo](#source-code-and-example)


## Instalação e Requisitos {#install-and-requirements}

Você precisará instalar as dependências npm `@react-email/render` e `nodemailer`:

```sh
npm install @react-email/render nodemailer
```


## Código Fonte e Exemplo {#source-code-and-example}

Crie seu template de email com um arquivo `.jsx` ou `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Visite nosso site</Button>
    </Html>
  );
}
```

Neste exemplo, usamos a biblioteca **[Nodemailer](https://github.com/nodemailer/nodemailer)** e seu patrocinador oficial **[Forward Email](https://forwardemail.net)** para enviar e pré-visualizar emails enviados.

Você precisará <strong class="text-success"><i class="fa fa-key"></i> Gerar Senha</strong> para enviar emails – por favor, siga nosso **[Guia para Enviar Email com SMTP de Domínio Personalizado](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: substitua os valores `user` e `pass` por:
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

Execute o app para enviar o email:

```sh
node app
```

Agora você pode acessar **[Minha Conta → Emails](/my-account/emails)** para ver o status de entrega do email em tempo real, logs de entregabilidade e pré-visualizações em HTML/texto simples/anexos.

> P.S. :tada: Você também pode **[pré-visualizar emails em navegadores e no iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** e **[criar templates de email com Node.js](/docs/send-emails-with-node-js-javascript)**.
