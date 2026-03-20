# JavaScript Kapcsolati Űrlapok Node.js Kód Példa {#javascript-contact-forms-nodejs-code-example}


## Tartalomjegyzék {#table-of-contents}

* [Telepítés és követelmények](#install-and-requirements)
* [Forráskód és példa](#source-code-and-example)


## Telepítés és követelmények {#install-and-requirements}

Telepítened kell a `nodemailer` npm függőséget:

```sh
npm install nodemailer
```


## Forráskód és példa {#source-code-and-example}

Ez a példa a **[Nodemailer](https://github.com/nodemailer/nodemailer)** könyvtárat és annak hivatalos támogatóját, a **[Forward Email](https://forwardemail.net)** szolgáltatást használja a kimenő levelek küldésére és előnézetére.

Kimenő levelek küldéséhez <strong class="text-success"><i class="fa fa-key"></i> Jelszót kell generálnod</strong> – kérjük, kövesd a **[Egyedi domain SMTP-vel történő e-mail küldés útmutatónkat](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

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

await transporter.sendMail({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<h1>hello world</h1>'
});
```

Futtasd az alkalmazást az e-mail elküldéséhez:

```sh
node app
```

Most már meglátogathatod a **[Fiókom → E-mailek](/my-account/emails)** oldalt, hogy valós időben lásd az e-mailek kézbesítési állapotát, a kézbesítési naplókat, valamint az HTML/szöveges/melléklet előnézeteket.

> U.I. :tada: Ezenkívül **[böngészőkben és iOS szimulátorban is megtekintheted az e-mailek előnézetét](/docs/test-preview-email-rendering-browsers-ios-simulator)**, valamint **[Node.js-sel is készíthetsz e-mail sablonokat](/docs/send-emails-with-node-js-javascript)**.
