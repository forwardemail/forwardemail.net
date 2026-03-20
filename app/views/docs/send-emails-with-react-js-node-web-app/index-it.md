# Invia Email con Esempio di Web App React.js Node {#send-emails-with-reactjs-node-web-app-example}


## Indice {#table-of-contents}

* [Installazione e Requisiti](#install-and-requirements)
* [Codice Sorgente ed Esempio](#source-code-and-example)


## Installazione e Requisiti {#install-and-requirements}

Dovrai installare le dipendenze npm `@react-email/render` e `nodemailer`:

```sh
npm install @react-email/render nodemailer
```


## Codice Sorgente ed Esempio {#source-code-and-example}

Crea il tuo template email con un file `.jsx` o `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Visita il nostro sito web</Button>
    </Html>
  );
}
```

In questo esempio, utilizziamo la libreria **[Nodemailer](https://github.com/nodemailer/nodemailer)** e il suo sponsor ufficiale **[Forward Email](https://forwardemail.net)** per inviare e visualizzare in anteprima le email in uscita.

Dovrai <strong class="text-success"><i class="fa fa-key"></i> Generare una Password</strong> per inviare email in uscita – segui la nostra **[Guida per Inviare Email con SMTP su Dominio Personalizzato](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: sostituire i valori `user` e `pass` da:
    // <https://forwardemail.net/guides/send-email-with-custom-domain-smtp>
    user: 'you@example.com',
    pass: '****************************'
  },
});

const html = render(Email({ url: "https://example.com" }));

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'ciao mondo',
  html
};

transporter.sendMail(options);
```

Esegui l'app per inviare l'email:

```sh
node app
```

Ora puoi andare su **[Il Mio Account → Email](/my-account/emails)** per vedere lo stato di consegna delle email in tempo reale, i log di deliverability e le anteprime HTML/plaintext/allegati.

> P.S. :tada: Puoi anche **[visualizzare in anteprima le email nei browser e nell'iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** e **[creare template email con Node.js](/docs/send-emails-with-node-js-javascript)**.
