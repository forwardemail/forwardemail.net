# Eksempel på JavaScript-kontaktformularer i Node.js-kode {#javascript-contact-forms-nodejs-code-example}

## Indholdsfortegnelse {#table-of-contents}

* [Installation og krav](#install-and-requirements)
* [Kildekode og eksempel](#source-code-and-example)

## Installation og krav {#install-and-requirements}

Du skal installere `nodemailer` npm-afhængigheden:

```sh
npm install nodemailer
```

## Kildekode og eksempel {#source-code-and-example}

Dette eksempel bruger biblioteket **[Nodemailer](https://github.com/nodemailer/nodemailer)** og dets officielle sponsor **[Videresend e-mail](https://forwardemail.net)** til at sende og forhåndsvise udgående post.

Du skal <strong class="text-success"><i class="fa fa-key"></i>Generere en adgangskode</strong> for at sende udgående e-mail – følg venligst vores **[Send e-mail med brugerdefineret domæne SMTP-guide](/guides/send-email-with-custom-domain-smtp)**.

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

Kør appen for at sende e-mailen:

```sh
node app
```

Nu kan du gå til **[Min konto → E-mails](/my-account/emails)** for at se din leveringsstatus for e-mails i realtid, leveringslogfiler for e-mails og forhåndsvisninger af HTML/klartekst/vedhæftede filer.

> P.S. :tada: Du kan også **[forhåndsvisning af e-mails i browsere og iOS-simulatoren](/docs/test-preview-email-rendering-browsers-ios-simulator)** og **[Opret e-mailskabeloner med Node.js](/docs/send-emails-with-node-js-javascript)**.