# JavaScript Kontaktformulär Node.js Kodexempel {#javascript-contact-forms-nodejs-code-example}


## Innehållsförteckning {#table-of-contents}

* [Installation och Krav](#install-and-requirements)
* [Källkod och Exempel](#source-code-and-example)


## Installation och Krav {#install-and-requirements}

Du behöver installera npm-paketet `nodemailer`:

```sh
npm install nodemailer
```


## Källkod och Exempel {#source-code-and-example}

Detta exempel använder **[Nodemailer](https://github.com/nodemailer/nodemailer)**-biblioteket och dess officiella sponsor **[Forward Email](https://forwardemail.net)** för att skicka och förhandsgranska utgående mail.

Du behöver <strong class="text-success"><i class="fa fa-key"></i> Generera Lösenord</strong> för att skicka utgående mail – följ gärna vår **[Skicka E-post med Egen Domän SMTP-guide](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: ersätt `user` och `pass` värden från:
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

Kör appen för att skicka e-post:

```sh
node app
```

Nu kan du gå till **[Mitt Konto → E-post](/my-account/emails)** för att se din realtidsstatus för e-postleverans, loggar för e-postleveransbarhet och förhandsvisningar av HTML/plaintext/bilagor.

> P.S. :tada: Du kan också **[förhandsgranska e-post i webbläsare och iOS-simulatorn](/docs/test-preview-email-rendering-browsers-ios-simulator)** och **[skapa e-postmallar med Node.js](/docs/send-emails-with-node-js-javascript)**.
