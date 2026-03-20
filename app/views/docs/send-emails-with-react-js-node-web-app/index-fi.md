# Lähetä sähköposteja React.js Node -verkkosovellus-esimerkillä {#send-emails-with-reactjs-node-web-app-example}


## Sisällysluettelo {#table-of-contents}

* [Asennus ja vaatimukset](#install-and-requirements)
* [Lähdekoodi ja esimerkki](#source-code-and-example)


## Asennus ja vaatimukset {#install-and-requirements}

Sinun tulee asentaa `@react-email/render` ja `nodemailer` npm-riippuvuudet:

```sh
npm install @react-email/render nodemailer
```


## Lähdekoodi ja esimerkki {#source-code-and-example}

Luo sähköpostipohjasi `.jsx`- tai `.js`-tiedostolla:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Vieraile verkkosivustollamme</Button>
    </Html>
  );
}
```

Tässä esimerkissä käytämme **[Nodemailer](https://github.com/nodemailer/nodemailer)**-kirjastoa ja sen virallista sponsoria **[Forward Email](https://forwardemail.net)** lähettämään ja esikatsomaan lähtevää sähköpostia.

Sinun tulee <strong class="text-success"><i class="fa fa-key"></i> luoda salasana</strong> lähtevän sähköpostin lähettämistä varten – seuraa ohjeitamme **[Lähetä sähköposti mukautetulla SMTP-domainilla -opas](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: korvaa `user` ja `pass` arvot osoitteesta:
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

Käynnistä sovellus lähettääksesi sähköpostin:

```sh
node app
```

Nyt voit siirtyä kohtaan **[Oma tili → Sähköpostit](/my-account/emails)** nähdäksesi reaaliaikaisen sähköpostin toimitustilanteen, sähköpostin toimituslokit sekä HTML-/tekstiversio- ja liite-esikatselut.

> P.S. :tada: Voit myös **[esikatsella sähköposteja selaimissa ja iOS-simulaattorissa](/docs/test-preview-email-rendering-browsers-ios-simulator)** sekä **[luoda sähköpostipohjia Node.js:llä](/docs/send-emails-with-node-js-javascript)**.
