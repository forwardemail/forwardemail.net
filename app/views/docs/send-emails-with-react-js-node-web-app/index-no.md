# Send e-poster med React.js Node Web App Eksempel {#send-emails-with-reactjs-node-web-app-example}

## Innholdsfortegnelse {#table-of-contents}

* [Installasjon og krav](#install-and-requirements)
* [Kildekode og eksempel](#source-code-and-example)

## Installasjon og krav {#install-and-requirements}

Du må installere `@react-email/render` og `nodemailer` npm-avhengigheter:

```sh
npm install @react-email/render nodemailer
```

## Kildekode og eksempel {#source-code-and-example}

Opprett e-postmalen din med en `.jsx`- eller en `.js`-fil:

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

I dette eksemplet bruker vi biblioteket **[Nodemailer](https://github.com/nodemailer/nodemailer)** og dets offisielle sponsor **[Videresend e-post](https://forwardemail.net)** til å sende og forhåndsvise utgående e-post.

Du må <strong class="text-success"><i class="fa fa-key"></i> generere passord</strong> for å sende utgående e-post – følg vår **[Send e-post med SMTP-veiledning for tilpasset domene](/guides/send-email-with-custom-domain-smtp)**.

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

Kjør appen for å sende e-posten:

```sh
node app
```

Nå kan du gå til **[Min konto → E-poster](/my-account/emails)** for å se leveringsstatusen for e-post i sanntid, logger for e-postlevering og forhåndsvisninger av HTML/klartekst/vedlegg.

> PS: Du kan også **[forhåndsvis e-poster i nettlesere og iOS-simulatoren](/docs/test-preview-email-rendering-browsers-ios-simulator)** og **[lag e-postmaler med Node.js](/docs/send-emails-with-node-js-javascript)**.