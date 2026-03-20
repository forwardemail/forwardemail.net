# Przykład kodu formularzy kontaktowych JavaScript Node.js {#javascript-contact-forms-nodejs-code-example}


## Spis treści {#table-of-contents}

* [Instalacja i wymagania](#install-and-requirements)
* [Kod źródłowy i przykład](#source-code-and-example)


## Instalacja i wymagania {#install-and-requirements}

Musisz zainstalować zależność npm `nodemailer`:

```sh
npm install nodemailer
```


## Kod źródłowy i przykład {#source-code-and-example}

Ten przykład używa biblioteki **[Nodemailer](https://github.com/nodemailer/nodemailer)** oraz jej oficjalnego sponsora **[Forward Email](https://forwardemail.net)** do wysyłania i podglądu wychodzącej poczty.

Będziesz musiał <strong class="text-success"><i class="fa fa-key"></i> wygenerować hasło</strong>, aby wysyłać pocztę wychodzącą – prosimy o zapoznanie się z naszym **[Przewodnikiem wysyłania e-maili z niestandardową domeną SMTP](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: zastąp wartości `user` i `pass` z:
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

Uruchom aplikację, aby wysłać e-mail:

```sh
node app
```

Teraz możesz przejść do **[Moje konto → E-maile](/my-account/emails)**, aby zobaczyć status dostarczenia e-maili w czasie rzeczywistym, logi dostarczalności oraz podglądy HTML/tekst zwykły/załączniki.

> P.S. :tada: Możesz także **[podglądać e-maile w przeglądarkach i symulatorze iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** oraz **[tworzyć szablony e-maili z Node.js](/docs/send-emails-with-node-js-javascript)**.
