# JavaScript Kapcsolatfelvételi Űrlapok Node.js Kód Példa {#javascript-contact-forms-nodejs-code-example}

## Tartalomjegyzék {#table-of-contents}

* [Telepítés és követelmények](#install-and-requirements)
* [Forráskód és példa](#source-code-and-example)

## Telepítés és követelmények {#install-and-requirements}

Telepítenie kell a `nodemailer` npm függőséget:

```sh
npm install nodemailer
```

## Forráskód és példa {#source-code-and-example}

Ez a példa a **[Nodemailer](https://github.com/nodemailer/nodemailer)** könyvtárat és hivatalos szponzorát, a **[E-mail továbbítása](https://forwardemail.net)**-ot használja a kimenő levelek küldéséhez és megtekintéséhez.

A kimenő levelek küldéséhez <strong class="text-success"><i class="fa fa-key"></i>jelszó generálása</strong> szükséges – kérjük, kövesse a **[E-mail küldése egyéni domain SMTP-útmutatóval](/guides/send-email-with-custom-domain-smtp)** irányelveinket.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

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

await transporter.sendMail({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<h1>hello world</h1>'
});
```

Futtassa az alkalmazást az e-mail küldéséhez:

```sh
node app
```

Mostantól a **[Fiókom → E-mailek](/my-account/emails)** oldalon megtekintheti a valós idejű e-mail kézbesítési állapotát, az e-mail kézbesíthetőségi naplókat, valamint a HTML/szöveges/mellékletek előnézeteit.

> Ui.: :tada: **[e-mailek előnézete böngészőkben és az iOS-szimulátorban](/docs/test-preview-email-rendering-browsers-ios-simulator)** és **[e-mail sablonok létrehozása Node.js segítségével](/docs/send-emails-with-node-js-javascript)** is használhatod.