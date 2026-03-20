# JavaScript Contactformulieren Node.js Codevoorbeeld {#javascript-contact-forms-nodejs-code-example}


## Inhoudsopgave {#table-of-contents}

* [Installatie en Vereisten](#install-and-requirements)
* [Broncode en Voorbeeld](#source-code-and-example)


## Installatie en Vereisten {#install-and-requirements}

Je moet de `nodemailer` npm-afhankelijkheid installeren:

```sh
npm install nodemailer
```


## Broncode en Voorbeeld {#source-code-and-example}

Dit voorbeeld gebruikt de **[Nodemailer](https://github.com/nodemailer/nodemailer)** bibliotheek en zijn officiële sponsor **[Forward Email](https://forwardemail.net)** om uitgaande e-mail te verzenden en te bekijken.

Je moet <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord Genereren</strong> om uitgaande e-mail te verzenden – volg hiervoor onze **[Handleiding E-mail Verzenden met Eigen Domein SMTP](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: vervang `user` en `pass` waarden via:
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

Ga nu naar **[Mijn Account → E-mails](/my-account/emails)** om je realtime e-mailbezorgstatus, e-mailbezorglogs en HTML/tekst/attachment previews te bekijken.

> P.S. :tada: Je kunt ook **[e-mails bekijken in browsers en de iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** en **[e-mailsjablonen maken met Node.js](/docs/send-emails-with-node-js-javascript)**.
