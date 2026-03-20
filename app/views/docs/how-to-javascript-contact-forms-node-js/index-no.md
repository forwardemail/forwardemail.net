# JavaScript Kontakt Skjemaer Node.js Kodeeksempel {#javascript-contact-forms-nodejs-code-example}


## Innholdsfortegnelse {#table-of-contents}

* [Installasjon og Krav](#install-and-requirements)
* [Kildekode og Eksempel](#source-code-and-example)


## Installasjon og Krav {#install-and-requirements}

Du må installere `nodemailer` npm-avhengighet:

```sh
npm install nodemailer
```


## Kildekode og Eksempel {#source-code-and-example}

Dette eksempelet bruker **[Nodemailer](https://github.com/nodemailer/nodemailer)** biblioteket og dets offisielle sponsor **[Forward Email](https://forwardemail.net)** for å sende og forhåndsvise utgående e-post.

Du må <strong class="text-success"><i class="fa fa-key"></i> Generere Passord</strong> for å sende utgående e-post – vennligst følg vår **[Send E-post med Egendefinert Domene SMTP Guide](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

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

await transporter.sendMail({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<h1>hello world</h1>'
});
```

Kjør appen for å sende e-posten:

```sh
node app
```

Nå kan du gå til **[Min Konto → E-poster](/my-account/emails)** for å se din sanntidsstatus for e-postlevering, logger for e-postleverbarhet, og forhåndsvisninger av HTML/ren tekst/vedlegg.

> P.S. :tada: Du kan også **[forhåndsvise e-poster i nettlesere og iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** og **[lage e-postmaler med Node.js](/docs/send-emails-with-node-js-javascript)**.
