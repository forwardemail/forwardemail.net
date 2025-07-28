# E-mails verzenden met React.js Node Web App-voorbeeld {#send-emails-with-reactjs-node-web-app-example}

## Inhoudsopgave {#table-of-contents}

* [Installatie en vereisten](#install-and-requirements)
* [Broncode en voorbeeld](#source-code-and-example)

## Installatie en vereisten {#install-and-requirements}

U moet de npm-afhankelijkheden `@react-email/render` en `nodemailer` installeren:

```sh
npm install @react-email/render nodemailer
```

## Broncode en voorbeeld {#source-code-and-example}

Maak uw e-mailsjabloon met een `.jsx` of een `.js` bestand:

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

In dit voorbeeld gebruiken we de bibliotheek **[Nodemailer](https://github.com/nodemailer/nodemailer)** en de officiële sponsor **[E-mail doorsturen](https://forwardemail.net)** om uitgaande e-mail te verzenden en vooraf te bekijken.

U moet een <strong class="text-success"><i class="fa fa-key"></i>wachtwoord genereren</strong> om uitgaande e-mail te kunnen versturen. Volg hiervoor onze **[E-mail verzenden met aangepaste domein SMTP-handleiding](/guides/send-email-with-custom-domain-smtp)**.

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

Start de app om de e-mail te verzenden:

```sh
node app
```

U kunt nu naar **[Mijn account → E-mails](/my-account/emails)** gaan om de realtimestatus van uw e-mailbezorging, logs over de bezorging van e-mails en voorbeelden van HTML/platte tekst/bijlagen te bekijken.

> P.S. :tada: Je kunt ook **[e-mails bekijken in browsers en de iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** en **[e-mailsjablonen maken met Node.js](/docs/send-emails-with-node-js-javascript)** gebruiken.