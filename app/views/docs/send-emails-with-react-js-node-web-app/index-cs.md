# Odesílání e-mailů s React.js Node webovou aplikací – příklad {#send-emails-with-reactjs-node-web-app-example}


## Obsah {#table-of-contents}

* [Instalace a požadavky](#install-and-requirements)
* [Zdrojový kód a příklad](#source-code-and-example)


## Instalace a požadavky {#install-and-requirements}

Budete potřebovat nainstalovat npm závislosti `@react-email/render` a `nodemailer`:

```sh
npm install @react-email/render nodemailer
```


## Zdrojový kód a příklad {#source-code-and-example}

Vytvořte si šablonu e-mailu v souboru `.jsx` nebo `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Navštivte naše webové stránky</Button>
    </Html>
  );
}
```

V tomto příkladu používáme knihovnu **[Nodemailer](https://github.com/nodemailer/nodemailer)** a jejího oficiálního sponzora **[Forward Email](https://forwardemail.net)** pro odesílání a náhled odchozí pošty.

Budete muset <strong class="text-success"><i class="fa fa-key"></i> Vygenerovat heslo</strong> pro odesílání odchozí pošty – prosím, postupujte podle našeho **[návodu na odesílání e-mailů přes SMTP s vlastním doménovým jménem](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: nahraďte hodnoty `user` a `pass` z:
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

Spusťte aplikaci pro odeslání e-mailu:

```sh
node app
```

Nyní můžete přejít na **[Můj účet → E-maily](/my-account/emails)** a sledovat stav doručení e-mailů v reálném čase, protokoly doručitelnosti a náhledy HTML/čistého textu/příloh.

> P.S. :tada: Můžete také **[náhled e-mailů v prohlížečích a iOS simulátoru](/docs/test-preview-email-rendering-browsers-ios-simulator)** a **[vytvářet e-mailové šablony s Node.js](/docs/send-emails-with-node-js-javascript)**.
