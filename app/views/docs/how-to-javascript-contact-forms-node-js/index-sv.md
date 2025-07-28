# JavaScript-kontaktformulär Node.js-kodexempel {#javascript-contact-forms-nodejs-code-example}

## Innehållsförteckning {#table-of-contents}

* [Installation och krav](#install-and-requirements)
* [Källkod och exempel](#source-code-and-example)

## Installation och krav {#install-and-requirements}

Du måste installera `nodemailer` npm-beroendet:

```sh
npm install nodemailer
```

## Källkod och exempel {#source-code-and-example}

Det här exemplet använder biblioteket **[Nodemailer](https://github.com/nodemailer/nodemailer)** och dess officiella sponsor **[Vidarebefordra e-post](https://forwardemail.net)** för att skicka och förhandsgranska utgående e-post.

Du måste <strong class="text-success"><i class="fa fa-key"></i>Generera lösenord</strong> för att skicka utgående e-post – följ våra **[Skicka e-post med SMTP-guide för anpassad domän](/guides/send-email-with-custom-domain-smtp)**.

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

Kör appen för att skicka e-postmeddelandet:

```sh
node app
```

Nu kan du gå till **[Mitt konto → E-postmeddelanden](/my-account/emails)** för att se din e-postleveransstatus i realtid, loggar för e-postleverans och förhandsgranskningar av HTML/klartext/bilagor.

> P.S. :tada: Du kan också **[förhandsgranska e-postmeddelanden i webbläsare och iOS-simulatorn](/docs/test-preview-email-rendering-browsers-ios-simulator)** och **[skapa e-postmallar med Node.js](/docs/send-emails-with-node-js-javascript)**.