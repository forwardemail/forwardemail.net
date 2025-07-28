# Exemplo de código Node.js para formulários de contato em JavaScript {#javascript-contact-forms-nodejs-code-example}

## Índice {#table-of-contents}

* [Instalação e Requisitos](#install-and-requirements)
* [Código-fonte e exemplo](#source-code-and-example)

## Instalação e Requisitos {#install-and-requirements}

Você precisará instalar a dependência npm `nodemailer`:

```sh
npm install nodemailer
```

## Código-fonte e exemplo {#source-code-and-example}

Este exemplo usa a biblioteca **[Nodemailer](https://github.com/nodemailer/nodemailer)** e seu patrocinador oficial **[Encaminhar e-mail](https://forwardemail.net)** para enviar e visualizar e-mails de saída.

Você precisará <strong class="text-success"><i class="fa fa-key"></i>Gerar senha</strong> para enviar e-mails de saída – siga nosso **[Guia para envio de e-mail com SMTP de domínio personalizado](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

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

await transporter.sendMail({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<h1>hello world</h1>'
});
```

Execute o aplicativo para enviar o e-mail:

```sh
node app
```

Agora você pode acessar **[Minha conta → E-mails](/my-account/emails)** para ver seu status de entrega de e-mail em tempo real, registros de entrega de e-mail e visualizações de HTML/texto simples/anexos.

> P.S. :tada: Você também pode **[visualizar e-mails em navegadores e no simulador iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** e **[crie modelos de e-mail com Node.js](/docs/send-emails-with-node-js-javascript)**.