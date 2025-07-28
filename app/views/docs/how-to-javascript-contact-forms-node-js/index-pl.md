# Przykład kodu Node.js dla formularzy kontaktowych JavaScript {#javascript-contact-forms-nodejs-code-example}

## Spis treści {#table-of-contents}

* [Instalacja i wymagania](#install-and-requirements)
* [Kod źródłowy i przykład](#source-code-and-example)

## Instalacja i wymagania {#install-and-requirements}

Będziesz musiał zainstalować zależność npm `nodemailer`:

```sh
npm install nodemailer
```

## Kod źródłowy i przykład {#source-code-and-example}

W tym przykładzie do wysyłania i podglądu poczty wychodzącej użyto biblioteki **[Nodemailer](https://github.com/nodemailer/nodemailer)** i jej oficjalnego sponsora **[Przekaż dalej e-mail](https://forwardemail.net)**.

Aby wysłać pocztę wychodzącą, musisz <strong class="text-success"><i class="fa fa-key"></i>wygenerować hasło</strong> – postępuj zgodnie z instrukcją **[Przewodnik SMTP po wysyłaniu wiadomości e-mail z niestandardową domeną](/guides/send-email-with-custom-domain-smtp)**.

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

Uruchom aplikację, aby wysłać wiadomość e-mail:

```sh
node app
```

Teraz możesz przejść do **[Moje konto → E-maile](/my-account/emails)**, aby zobaczyć status dostarczania wiadomości e-mail w czasie rzeczywistym, dzienniki dostarczalności wiadomości e-mail oraz podglądy w formacie HTML/zwykłego tekstu/załączników.

> P.S. :tada: Możesz również użyć **[podgląd wiadomości e-mail w przeglądarkach i symulatorze iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** i **[twórz szablony wiadomości e-mail za pomocą Node.js](/docs/send-emails-with-node-js-javascript)**.