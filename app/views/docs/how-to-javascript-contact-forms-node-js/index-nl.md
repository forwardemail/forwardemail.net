# JavaScript Contactformulieren Node.js Codevoorbeeld {#javascript-contact-forms-nodejs-code-example}

## Inhoudsopgave {#table-of-contents}

* [Installatie en vereisten](#install-and-requirements)
* [Broncode en voorbeeld](#source-code-and-example)

## Installatie en vereisten {#install-and-requirements}

U moet de npm-afhankelijkheid `nodemailer` installeren:

```sh
npm install nodemailer
```

## Broncode en voorbeeld {#source-code-and-example}

In dit voorbeeld wordt de bibliotheek **[Nodemailer](https://github.com/nodemailer/nodemailer)** en de officiële sponsor **[E-mail doorsturen](https://forwardemail.net)** gebruikt om uitgaande e-mail te verzenden en vooraf te bekijken.

U moet een <strong class="text-success"><i class="fa fa-key"></i>wachtwoord genereren</strong> om uitgaande e-mail te kunnen versturen. Volg hiervoor onze **[E-mail verzenden met aangepaste domein SMTP-handleiding](/guides/send-email-with-custom-domain-smtp)**.

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

Start de app om de e-mail te verzenden:

```sh
node app
```

U kunt nu naar **[Mijn account → E-mails](/my-account/emails)** gaan om de realtimestatus van uw e-mailbezorging, logs over de bezorging van e-mails en voorbeelden van HTML/platte tekst/bijlagen te bekijken.

> P.S. :tada: Je kunt ook **[e-mails bekijken in browsers en de iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** en **[e-mailsjablonen maken met Node.js](/docs/send-emails-with-node-js-javascript)** gebruiken.