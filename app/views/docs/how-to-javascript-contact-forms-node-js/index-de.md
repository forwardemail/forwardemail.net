# JavaScript Kontaktformulare Node.js Code Beispiel {#javascript-contact-forms-nodejs-code-example}


## Inhaltsverzeichnis {#table-of-contents}

* [Installation und Anforderungen](#install-and-requirements)
* [Quellcode und Beispiel](#source-code-and-example)


## Installation und Anforderungen {#install-and-requirements}

Sie müssen die `nodemailer` npm-Abhängigkeit installieren:

```sh
npm install nodemailer
```


## Quellcode und Beispiel {#source-code-and-example}

Dieses Beispiel verwendet die **[Nodemailer](https://github.com/nodemailer/nodemailer)** Bibliothek und ihren offiziellen Sponsor **[Forward Email](https://forwardemail.net)**, um ausgehende E-Mails zu senden und anzuzeigen.

Sie müssen ein <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong>, um ausgehende E-Mails zu senden – bitte folgen Sie unserem **[Leitfaden zum Senden von E-Mails mit benutzerdefiniertem Domain-SMTP](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: ersetzen Sie die Werte für `user` und `pass` durch:
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

Jetzt können Sie zu **[Mein Konto → E-Mails](/my-account/emails)** gehen, um den Echtzeit-Status der E-Mail-Zustellung, Protokolle zur Zustellbarkeit und Vorschauen von HTML/Text-Anhängen zu sehen.

> P.S. :tada: Sie können auch **[E-Mails in Browsern und dem iOS Simulator anzeigen lassen](/docs/test-preview-email-rendering-browsers-ios-simulator)** und **[E-Mail-Vorlagen mit Node.js erstellen](/docs/send-emails-with-node-js-javascript)**.
