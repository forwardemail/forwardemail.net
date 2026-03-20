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

Lag din e-postmal med en `.jsx` eller `.js` fil:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Besøk vårt nettsted</Button>
    </Html>
  );
}
```

I dette eksempelet bruker vi **[Nodemailer](https://github.com/nodemailer/nodemailer)** biblioteket og dets offisielle sponsor **[Forward Email](https://forwardemail.net)** for å sende og forhåndsvise utgående e-post.

Du må <strong class="text-success"><i class="fa fa-key"></i> Generere passord</strong> for å sende utgående e-post – vennligst følg vår **[Send e-post med egendefinert domene SMTP-guide](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: erstatt `user` og `pass` verdier fra:
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

Nå kan du gå til **[Min konto → E-poster](/my-account/emails)** for å se sanntidsstatus for e-postlevering, logger for e-postleverbarhet, og forhåndsvisninger av HTML/ren tekst/vedlegg.

> P.S. :tada: Du kan også **[forhåndsvise e-poster i nettlesere og iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** og **[lage e-postmaler med Node.js](/docs/send-emails-with-node-js-javascript)**.
