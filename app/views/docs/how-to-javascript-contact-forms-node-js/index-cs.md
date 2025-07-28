# Příklad kódu Node.js pro kontaktní formuláře v JavaScriptu {#javascript-contact-forms-nodejs-code-example}

## Obsah {#table-of-contents}

* [Instalace a požadavky](#install-and-requirements)
* [Zdrojový kód a příklad](#source-code-and-example)

## Instalace a požadavky {#install-and-requirements}

Budete muset nainstalovat závislost `nodemailer` na npm:

```sh
npm install nodemailer
```

## Zdrojový kód a příklad {#source-code-and-example}

Tento příklad používá knihovnu **[Nodemailer](https://github.com/nodemailer/nodemailer)** a jejího oficiálního sponzora **[Přeposlat e-mail](https://forwardemail.net)** k odesílání a zobrazení náhledu odchozí pošty.

Pro odesílání odchozí pošty budete muset <strong class="text-success"><i class="fa fa-key"></i>vygenerovat heslo</strong> – postupujte podle našich pokynů **[Průvodce odesíláním e-mailů pomocí SMTP pro vlastní doménu](/guides/send-email-with-custom-domain-smtp)**.

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

Spusťte aplikaci pro odeslání e-mailu:

```sh
node app
```

Nyní můžete přejít na stránku **[Můj účet → E-maily](/my-account/emails)** a zobrazit stav doručení e-mailů v reálném čase, protokoly doručitelnosti e-mailů a náhledy HTML/prostého textu/příloh.

> P.S. :tada: Můžete také použít **[náhled e-mailů v prohlížečích a simulátoru iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** a **[vytvářet šablony e-mailů pomocí Node.js](/docs/send-emails-with-node-js-javascript)**.