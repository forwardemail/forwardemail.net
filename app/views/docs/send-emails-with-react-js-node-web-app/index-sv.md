# Skicka e-post med React.js Node webbapp-exempel {#send-emails-with-reactjs-node-web-app-example}


## Innehållsförteckning {#table-of-contents}

* [Installation och krav](#install-and-requirements)
* [Källkod och exempel](#source-code-and-example)


## Installation och krav {#install-and-requirements}

Du behöver installera npm-paketen `@react-email/render` och `nodemailer`:

```sh
npm install @react-email/render nodemailer
```


## Källkod och exempel {#source-code-and-example}

Skapa din e-postmall med en `.jsx` eller `.js` fil:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Besök vår webbplats</Button>
    </Html>
  );
}
```

I detta exempel använder vi **[Nodemailer](https://github.com/nodemailer/nodemailer)**-biblioteket och dess officiella sponsor **[Forward Email](https://forwardemail.net)** för att skicka och förhandsgranska utgående e-post.

Du behöver <strong class="text-success"><i class="fa fa-key"></i> generera lösenord</strong> för att skicka utgående e-post – följ gärna vår **[Skicka e-post med anpassad domän SMTP-guide](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: ersätt `user` och `pass` värden från:
    // <https://forwardemail.net/guides/send-email-with-custom-domain-smtp>
    user: 'you@example.com',
    pass: '****************************'
  },
});

const html = render(Email({ url: "https://example.com" }));

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hej världen',
  html
};

transporter.sendMail(options);
```

Kör appen för att skicka e-post:

```sh
node app
```

Nu kan du gå till **[Mitt konto → E-post](/my-account/emails)** för att se din realtidsstatus för e-postleverans, loggar för e-postleveransbarhet och förhandsvisningar av HTML/ren text/bilagor.

> P.S. :tada: Du kan också **[förhandsgranska e-post i webbläsare och iOS-simulatorn](/docs/test-preview-email-rendering-browsers-ios-simulator)** och **[skapa e-postmallar med Node.js](/docs/send-emails-with-node-js-javascript)**.
