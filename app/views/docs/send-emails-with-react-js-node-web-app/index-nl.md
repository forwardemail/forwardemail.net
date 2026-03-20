# E-mails Verzenden met React.js Node Web App Voorbeeld {#send-emails-with-reactjs-node-web-app-example}


## Inhoudsopgave {#table-of-contents}

* [Installatie en Vereisten](#install-and-requirements)
* [Broncode en Voorbeeld](#source-code-and-example)


## Installatie en Vereisten {#install-and-requirements}

Je moet de npm-afhankelijkheden `@react-email/render` en `nodemailer` installeren:

```sh
npm install @react-email/render nodemailer
```


## Broncode en Voorbeeld {#source-code-and-example}

Maak je e-mailsjabloon met een `.jsx` of `.js` bestand:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Bezoek onze website</Button>
    </Html>
  );
}
```

In dit voorbeeld gebruiken we de **[Nodemailer](https://github.com/nodemailer/nodemailer)** bibliotheek en zijn officiële sponsor **[Forward Email](https://forwardemail.net)** om uitgaande e-mail te verzenden en te bekijken.

Je moet <strong class="text-success"><i class="fa fa-key"></i> Wachtwoord Genereren</strong> om uitgaande e-mail te verzenden – volg hiervoor onze **[Handleiding E-mail Verzenden met Custom Domain SMTP](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: vervang `user` en `pass` waarden via:
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

Ga nu naar **[Mijn Account → E-mails](/my-account/emails)** om je realtime e-mailbezorgstatus, e-mailbezorglogboeken en HTML/tekst/attachment previews te bekijken.

> P.S. :tada: Je kunt ook **[e-mails bekijken in browsers en de iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** en **[e-mailsjablonen maken met Node.js](/docs/send-emails-with-node-js-javascript)**.
