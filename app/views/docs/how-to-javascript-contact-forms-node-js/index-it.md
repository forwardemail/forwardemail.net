# Esempio di codice Node.js per moduli di contatto JavaScript {#javascript-contact-forms-nodejs-code-example}

## Indice {#table-of-contents}

* [Installazione e requisiti](#install-and-requirements)
* [Codice sorgente ed esempio](#source-code-and-example)

## Installazione e requisiti {#install-and-requirements}

Sarà necessario installare la dipendenza npm `nodemailer`:

```sh
npm install nodemailer
```

## Codice sorgente ed esempio {#source-code-and-example}

Questo esempio utilizza la libreria **[Nodemailer](https://github.com/nodemailer/nodemailer)** e il suo sponsor ufficiale **[Inoltra e-mail](https://forwardemail.net)** per inviare e visualizzare in anteprima la posta in uscita.

Sarà necessario <strong class="text-success"><i class="fa fa-key"></i>generare una password</strong> per inviare la posta in uscita: segui la nostra procedura **[Guida all'invio di email con SMTP di dominio personalizzato](/guides/send-email-with-custom-domain-smtp)**.

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

Esegui l'app per inviare l'email:

```sh
node app
```

Ora puoi andare su **[Il mio account → Email](/my-account/emails)** per visualizzare lo stato di recapito delle tue email in tempo reale, i registri di recapito delle email e le anteprime HTML/testo normale/allegati.

> P.S. :tada: Puoi anche **[visualizza in anteprima le email nei browser e nel simulatore iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** e **[creare modelli di email con Node.js](/docs/send-emails-with-node-js-javascript)**.