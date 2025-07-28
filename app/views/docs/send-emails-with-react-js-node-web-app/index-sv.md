# Skicka e-postmeddelanden med React.js Node Web App Exempel {#send-emails-with-reactjs-node-web-app-example}

## Innehållsförteckning {#table-of-contents}

* [Installation och krav](#install-and-requirements)
* [Källkod och exempel](#source-code-and-example)

## Installation och krav {#install-and-requirements}

Du måste installera `@react-email/render` och `nodemailer` npm-beroenden:

```sh
npm install @react-email/render nodemailer
```

## Källkod och exempel {#source-code-and-example}

Skapa din e-postmall med en `.jsx`- eller en `.js`-fil:

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

I det här exemplet använder vi biblioteket **[Nodemailer](https://github.com/nodemailer/nodemailer)** och dess officiella sponsor **[Vidarebefordra e-post](https://forwardemail.net)** för att skicka och förhandsgranska utgående e-post.

Du måste <strong class="text-success"><i class="fa fa-key"></i>Generera lösenord</strong> för att skicka utgående e-post – följ våra **[Skicka e-post med SMTP-guide för anpassad domän](/guides/send-email-with-custom-domain-smtp)**.

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

Kör appen för att skicka e-postmeddelandet:

```sh
node app
```

Nu kan du gå till **[Mitt konto → E-postmeddelanden](/my-account/emails)** för att se din e-postleveransstatus i realtid, leveransloggar för e-post och förhandsgranskningar av HTML/klartext/bilagor.

> P.S. :tada: Du kan också **[förhandsgranska e-postmeddelanden i webbläsare och iOS-simulatorn](/docs/test-preview-email-rendering-browsers-ios-simulator)** och **[skapa e-postmallar med Node.js](/docs/send-emails-with-node-js-javascript)**.