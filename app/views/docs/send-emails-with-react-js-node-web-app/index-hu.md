# E-mailek küldése React.js-sel Node webalkalmazás-példa {#send-emails-with-reactjs-node-web-app-example}

## Tartalomjegyzék {#table-of-contents}

* [Telepítés és követelmények](#install-and-requirements)
* [Forráskód és példa](#source-code-and-example)

## Telepítés és követelmények {#install-and-requirements}

Telepítenie kell a `@react-email/render` és `nodemailer` npm függőségeket:

```sh
npm install @react-email/render nodemailer
```

## Forráskód és példa {#source-code-and-example}

Hozd létre az e-mail sablonodat egy `.jsx` vagy egy `.js` fájllal:

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

Ebben a példában a **[Nodemailer](https://github.com/nodemailer/nodemailer)** könyvtárat és hivatalos szponzorát, a **[E-mail továbbítása](https://forwardemail.net)**-et használjuk a kimenő levelek küldéséhez és megtekintéséhez.

A kimenő levelek küldéséhez <strong class="text-success"><i class="fa fa-key"></i>jelszó generálása</strong> szükséges – kérjük, kövesse az **IDEIGLENES_HELYTARTÓS_0** irányelveinket.

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

Futtassa az alkalmazást az e-mail küldéséhez:

```sh
node app
```

Mostantól a **[Fiókom → E-mailek](/my-account/emails)** oldalon megtekintheti a valós idejű e-mail kézbesítési állapotát, az e-mail kézbesíthetőségi naplókat, valamint a HTML/szöveges/mellékletek előnézeteit.

> Ui.: :tada: Használhatod a **[e-mailek előnézete böngészőkben és az iOS-szimulátorban](/docs/test-preview-email-rendering-browsers-ios-simulator)** és a **[e-mail sablonok létrehozása Node.js segítségével](/docs/send-emails-with-node-js-javascript)** értékeket is.