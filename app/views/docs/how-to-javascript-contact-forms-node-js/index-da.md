# JavaScript Kontaktformularer Node.js Kodeeksempel {#javascript-contact-forms-nodejs-code-example}


## Indholdsfortegnelse {#table-of-contents}

* [Installation og Krav](#install-and-requirements)
* [Kildekode og Eksempel](#source-code-and-example)


## Installation og Krav {#install-and-requirements}

Du skal installere `nodemailer` npm-afhængigheden:

```sh
npm install nodemailer
```


## Kildekode og Eksempel {#source-code-and-example}

Dette eksempel bruger **[Nodemailer](https://github.com/nodemailer/nodemailer)** biblioteket og dets officielle sponsor **[Forward Email](https://forwardemail.net)** til at sende og forhåndsvise udgående mail.

Du skal <strong class="text-success"><i class="fa fa-key"></i> Generere Adgangskode</strong> for at sende udgående mail – følg venligst vores **[Send Email with Custom Domain SMTP Guide](/guides/send-email-with-custom-domain-smtp)**.

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

Nu kan du gå til **[Min Konto → Emails](/my-account/emails)** for at se din realtidsstatus for e-mail levering, logfiler for e-mail leverbarhed og HTML/plaintekst/vedhæftningsforhåndsvisninger.

> P.S. :tada: Du kan også **[forhåndsvise e-mails i browsere og iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** og **[oprette e-mail skabeloner med Node.js](/docs/send-emails-with-node-js-javascript)**.
