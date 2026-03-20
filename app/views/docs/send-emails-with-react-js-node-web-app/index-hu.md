# E-mailek küldése React.js Node Webalkalmazással – Példa {#send-emails-with-reactjs-node-web-app-example}


## Tartalomjegyzék {#table-of-contents}

* [Telepítés és követelmények](#install-and-requirements)
* [Forráskód és példa](#source-code-and-example)


## Telepítés és követelmények {#install-and-requirements}

Telepítened kell az `@react-email/render` és a `nodemailer` npm csomagokat:

```sh
npm install @react-email/render nodemailer
```


## Forráskód és példa {#source-code-and-example}

Hozd létre az e-mail sablonodat egy `.jsx` vagy `.js` fájlban:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Látogasd meg weboldalunkat</Button>
    </Html>
  );
}
```

Ebben a példában a **[Nodemailer](https://github.com/nodemailer/nodemailer)** könyvtárat és annak hivatalos támogatóját, a **[Forward Email](https://forwardemail.net)** szolgáltatást használjuk a kimenő levelek küldésére és előnézetére.

A kimenő levelek küldéséhez <strong class="text-success"><i class="fa fa-key"></i> jelszót kell generálnod</strong> – kérjük, kövesd a **[E-mail küldése egyedi domain SMTP-vel útmutatónkat](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: cseréld ki a `user` és `pass` értékeket innen:
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

Futtasd az alkalmazást az e-mail elküldéséhez:

```sh
node app
```

Most már meglátogathatod a **[Saját fiók → E-mailek](/my-account/emails)** oldalt, hogy valós időben lásd az e-mailek kézbesítési állapotát, a kézbesítési naplókat, valamint az HTML/szöveges/melléklet előnézeteket.

> Ui.: :tada: Ezen felül **[böngészőkben és iOS szimulátorban is megtekintheted az e-mailek előnézetét](/docs/test-preview-email-rendering-browsers-ios-simulator)**, valamint **[Node.js segítségével is készíthetsz e-mail sablonokat](/docs/send-emails-with-node-js-javascript)**.
