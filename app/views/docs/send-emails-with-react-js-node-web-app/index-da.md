# Send e-mails med React.js Node Web App Eksempel {#send-emails-with-reactjs-node-web-app-example}

## Indholdsfortegnelse {#table-of-contents}

* [Installation og krav](#install-and-requirements)
* [Kildekode og eksempel](#source-code-and-example)

## Installation og krav {#install-and-requirements}

Du skal installere `@react-email/render` og `nodemailer` npm-afhængigheder:

```sh
npm install @react-email/render nodemailer
```

## Kildekode og eksempel {#source-code-and-example}

Opret din e-mailskabelon med en `.jsx`- eller en `.js`-fil:

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

I dette eksempel bruger vi biblioteket **[Nodemailer](https://github.com/nodemailer/nodemailer)** og dets officielle sponsor **[Videresend e-mail](https://forwardemail.net)** til at sende og forhåndsvise udgående post.

Du skal <strong class="text-success"><i class="fa fa-key"></i> generere en adgangskode</strong> for at sende udgående e-mail – følg venligst vores **[Send e-mail med brugerdefineret domæne SMTP-guide](/guides/send-email-with-custom-domain-smtp)**.

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

Kør appen for at sende e-mailen:

```sh
node app
```

Nu kan du gå til **[Min konto → E-mails](/my-account/emails)** for at se din leveringsstatus for e-mails i realtid, leveringslogfiler for e-mails og forhåndsvisninger af HTML/klartekst/vedhæftede filer.

> P.S. :tada: Du kan også **[forhåndsvisning af e-mails i browsere og iOS-simulatoren](/docs/test-preview-email-rendering-browsers-ios-simulator)** og **[Opret e-mailskabeloner med Node.js](/docs/send-emails-with-node-js-javascript)**.