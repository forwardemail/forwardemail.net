# Invia email con l'esempio di app Web Node React.js {#send-emails-with-reactjs-node-web-app-example}

## Indice {#table-of-contents}

* [Installazione e requisiti](#install-and-requirements)
* [Codice sorgente ed esempio](#source-code-and-example)

## Installazione e requisiti {#install-and-requirements}

Sarà necessario installare le dipendenze npm `@react-email/render` e `nodemailer`:

```sh
npm install @react-email/render nodemailer
```

## Codice sorgente ed esempio {#source-code-and-example}

Crea il tuo modello di email con un file `.jsx` o `.js`:

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

In questo esempio, utilizziamo la libreria **[Nodemailer](https://github.com/nodemailer/nodemailer)** e il suo sponsor ufficiale **[Inoltra e-mail](https://forwardemail.net)** per inviare e visualizzare in anteprima la posta in uscita.

Sarà necessario <strong class="text-success"><i class="fa fa-key"></i>generare una password</strong> per inviare la posta in uscita: seguire la nostra procedura **[Guida all'invio di email con SMTP di dominio personalizzato](/guides/send-email-with-custom-domain-smtp)**.

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

Esegui l'app per inviare l'e-mail:

```sh
node app
```

Ora puoi andare su **[Il mio account → Email](/my-account/emails)** per visualizzare lo stato di recapito delle tue email in tempo reale, i registri di recapito delle email e le anteprime HTML/testo normale/allegati.

> P.S. :tada: Puoi anche **[visualizza in anteprima le email nei browser e nel simulatore iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** e **[creare modelli di email con Node.js](/docs/send-emails-with-node-js-javascript)**.