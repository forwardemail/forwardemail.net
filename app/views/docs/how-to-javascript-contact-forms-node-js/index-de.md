# JavaScript-Kontaktformulare Node.js-Codebeispiel {#javascript-contact-forms-nodejs-code-example}

## Inhaltsverzeichnis {#table-of-contents}

* [Installation und Anforderungen](#install-and-requirements)
* [Quellcode und Beispiel](#source-code-and-example)

## Installation und Anforderungen {#install-and-requirements}

Sie müssen die npm-Abhängigkeit `nodemailer` installieren:

```sh
npm install nodemailer
```

## Quellcode und Beispiel {#source-code-and-example}

In diesem Beispiel werden die Bibliothek **[Nodemailer](https://github.com/nodemailer/nodemailer)** und ihr offizieller Sponsor **[E-Mail weiterleiten](https://forwardemail.net)** zum Senden und zur Vorschau ausgehender E-Mails verwendet.

Sie müssen ein <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong>, um ausgehende E-Mails zu senden – befolgen Sie bitte unsere **[Senden Sie E-Mails mit einem benutzerdefinierten Domänen-SMTP-Handbuch](/guides/send-email-with-custom-domain-smtp)**.

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

Führen Sie die App aus, um die E-Mail zu senden:

```sh
node app
```

Jetzt können Sie zu **[Mein Konto → E-Mails](/my-account/emails)** gehen, um Ihren E-Mail-Zustellungsstatus in Echtzeit, E-Mail-Zustellungsprotokolle und HTML-/Klartext-/Anhangsvorschauen anzuzeigen.

> P.S. :tada: Sie können auch **[Vorschau von E-Mails in Browsern und im iOS-Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** und **[E-Mail-Vorlagen mit Node.js erstellen](/docs/send-emails-with-node-js-javascript)**.