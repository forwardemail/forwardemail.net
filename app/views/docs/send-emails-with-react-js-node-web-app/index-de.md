# Senden Sie E-Mails mit dem React.js Node Web App-Beispiel {#send-emails-with-reactjs-node-web-app-example}

## Inhaltsverzeichnis {#table-of-contents}

* [Installation und Anforderungen](#install-and-requirements)
* [Quellcode und Beispiel](#source-code-and-example)

## Installation und Anforderungen {#install-and-requirements}

Sie müssen die npm-Abhängigkeiten `@react-email/render` und `nodemailer` installieren:

```sh
npm install @react-email/render nodemailer
```

## Quellcode und Beispiel {#source-code-and-example}

Erstellen Sie Ihre E-Mail-Vorlage mit einer `.jsx`- oder einer `.js`-Datei:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Visit our website</Button>
    </Html>
  );
}
```

In diesem Beispiel verwenden wir die Bibliothek **[Nodemailer](https://github.com/nodemailer/nodemailer)** und ihren offiziellen Sponsor **[E-Mail weiterleiten](https://forwardemail.net)** zum Senden und zur Vorschau ausgehender E-Mails.

Sie müssen ein <strong class="text-success"><i class="fa fa-key"></i> Passwort generieren</strong>, um ausgehende E-Mails zu senden – befolgen Sie bitte unsere **[Senden Sie E-Mails mit einem benutzerdefinierten Domänen-SMTP-Handbuch](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: replace `user` and `pass` values from:
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

Führen Sie die App aus, um die E-Mail zu senden:

```sh
node app
```

Jetzt können Sie zu **[Mein Konto → E-Mails](/my-account/emails)** gehen, um Ihren E-Mail-Zustellungsstatus in Echtzeit, E-Mail-Zustellungsprotokolle und HTML-/Klartext-/Anhangsvorschauen anzuzeigen.

> P.S. :tada: Sie können auch **[Vorschau von E-Mails in Browsern und im iOS-Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** und **[E-Mail-Vorlagen mit Node.js erstellen](/docs/send-emails-with-node-js-javascript)**.