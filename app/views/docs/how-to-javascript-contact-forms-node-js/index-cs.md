# JavaScript Kontaktní Formuláře Node.js Příklad Kódu {#javascript-contact-forms-nodejs-code-example}


## Obsah {#table-of-contents}

* [Instalace a Požadavky](#install-and-requirements)
* [Zdrojový Kód a Příklad](#source-code-and-example)


## Instalace a Požadavky {#install-and-requirements}

Budete potřebovat nainstalovat npm závislost `nodemailer`:

```sh
npm install nodemailer
```


## Zdrojový Kód a Příklad {#source-code-and-example}

Tento příklad používá knihovnu **[Nodemailer](https://github.com/nodemailer/nodemailer)** a jejího oficiálního sponzora **[Forward Email](https://forwardemail.net)** pro odesílání a náhled odchozí pošty.

Budete muset <strong class="text-success"><i class="fa fa-key"></i> Vygenerovat Heslo</strong> pro odesílání odchozí pošty – prosím, postupujte podle našeho **[Průvodce Odesíláním E-mailu s Vlastní Doménou SMTP](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

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

Nyní můžete přejít na **[Můj Účet → E-maily](/my-account/emails)** a zobrazit stav doručení e-mailu v reálném čase, protokoly doručitelnosti e-mailů a náhledy HTML/čistého textu/příloh.

> P.S. :tada: Můžete také **[náhled e-mailů v prohlížečích a iOS Simulatoru](/docs/test-preview-email-rendering-browsers-ios-simulator)** a **[vytvářet e-mailové šablony s Node.js](/docs/send-emails-with-node-js-javascript)**.
