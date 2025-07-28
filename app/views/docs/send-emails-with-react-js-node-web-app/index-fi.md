# Lähetä sähköposteja React.js:llä Node-verkkosovelluksen esimerkki {#send-emails-with-reactjs-node-web-app-example}

## Sisällysluettelo {#table-of-contents}

* [Asennus ja vaatimukset](#install-and-requirements)
* [Lähdekoodi ja esimerkki](#source-code-and-example)

## Asennus ja vaatimukset {#install-and-requirements}

Sinun on asennettava `@react-email/render` ja `nodemailer` npm-riippuvuudet:

```sh
npm install @react-email/render nodemailer
```

## Lähdekoodi ja esimerkki {#source-code-and-example}

Luo sähköpostipohja tiedostolla `.jsx` tai `.js`:

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

Tässä esimerkissä käytämme **[Nodemailer](https://github.com/nodemailer/nodemailer)**-kirjastoa ja sen virallista sponsoria **[Lähetä sähköpostia eteenpäin](https://forwardemail.net)** lähtevän postin lähettämiseen ja esikatseluun.

Sinun on <strong class="text-success"><i class="fa fa-key"></i>luotava salasana</strong> lähettääksesi lähtevää postia – noudata **[Lähetä sähköpostia mukautetulla verkkotunnuksella SMTP-opas](/guides/send-email-with-custom-domain-smtp)**-ohjeitamme.

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

Suorita sovellus lähettääksesi sähköpostin:

```sh
node app
```

Nyt voit siirtyä osoitteeseen **[Oma tili → Sähköpostit](/my-account/emails)** nähdäksesi reaaliaikaisen sähköpostien toimitustilan, sähköpostien toimituslokit ja HTML-/selkotekstisten/liitteiden esikatselut.

> P.S. :tada: Voit myös **[esikatsele sähköposteja selaimissa ja iOS-simulaattorissa](/docs/test-preview-email-rendering-browsers-ios-simulator)** ja **[luo sähköpostipohjia Node.js:llä](/docs/send-emails-with-node-js-javascript)**.