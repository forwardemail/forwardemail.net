# Moduli di Contatto JavaScript Esempio di Codice Node.js {#javascript-contact-forms-nodejs-code-example}


## Indice {#table-of-contents}

* [Installazione e Requisiti](#install-and-requirements)
* [Codice Sorgente ed Esempio](#source-code-and-example)


## Installazione e Requisiti {#install-and-requirements}

Dovrai installare la dipendenza npm `nodemailer`:

```sh
npm install nodemailer
```


## Codice Sorgente ed Esempio {#source-code-and-example}

Questo esempio utilizza la libreria **[Nodemailer](https://github.com/nodemailer/nodemailer)** e il suo sponsor ufficiale **[Forward Email](https://forwardemail.net)** per inviare e visualizzare in anteprima le email in uscita.

Dovrai <strong class="text-success"><i class="fa fa-key"></i> Generare una Password</strong> per inviare email in uscita – segui la nostra **[Guida per Inviare Email con SMTP e Dominio Personalizzato](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: sostituire i valori `user` e `pass` da:
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

Ora puoi andare su **[Il Mio Account → Email](/my-account/emails)** per vedere lo stato di consegna delle email in tempo reale, i log di deliverability e le anteprime HTML/testo semplice/allegati.

> P.S. :tada: Puoi anche **[visualizzare in anteprima le email nei browser e nell’iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** e **[creare modelli di email con Node.js](/docs/send-emails-with-node-js-javascript)**.
