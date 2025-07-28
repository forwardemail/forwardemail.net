# Odesílání e-mailů s příkladem webové aplikace React.js Node {#send-emails-with-reactjs-node-web-app-example}

__CHRÁNĚNÁ_URL_9__ Obsah {__CHRÁNĚNÁ_URL_10__

* [Instalace a požadavky](#install-and-requirements)
* [Zdrojový kód a příklad](#source-code-and-example)

## Instalace a požadavky {#install-and-requirements}

Budete muset nainstalovat závislosti `@react-email/render` a `nodemailer` npm:

```sh
npm install @react-email/render nodemailer
```

## Zdrojový kód a příklad {#source-code-and-example}

Vytvořte si šablonu e-mailu se souborem `.jsx` nebo `.js`:

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

V tomto příkladu používáme knihovnu **[Nodemailer](https://github.com/nodemailer/nodemailer)** a jejího oficiálního sponzora **[Přeposlat e-mail](https://forwardemail.net)** k odesílání a náhledu odchozí pošty.

Pro odesílání odchozí pošty budete muset <strong class="text-success"><i class="fa fa-key"></i>vygenerovat heslo</strong> – postupujte prosím podle našich **[Odeslat e-mail s průvodcem SMTP vlastní domény](/guides/send-email-with-custom-domain-smtp)**.

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

Spusťte aplikaci a odešlete e-mail:

```sh
node app
```

Nyní můžete na stránce **[Můj účet → E-maily](/my-account/emails)** zobrazit stav doručení e-mailů v reálném čase, protokoly doručitelnosti e-mailů a náhledy HTML/prostého textu/příloh.

> P.S. :tada: Můžete také **[náhled e-mailů v prohlížečích a simulátoru iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** a **[vytvářet e-mailové šablony pomocí Node.js](/docs/send-emails-with-node-js-javascript)**.