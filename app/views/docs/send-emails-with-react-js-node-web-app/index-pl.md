# Wysyłanie wiadomości e-mail za pomocą przykładu aplikacji internetowej Node w React.js {#send-emails-with-reactjs-node-web-app-example}

## Spis treści {#table-of-contents}

* [Instalacja i wymagania](#install-and-requirements)
* [Kod źródłowy i przykład](#source-code-and-example)

## Instalacja i wymagania {#install-and-requirements}

Będziesz musiał zainstalować zależności npm `@react-email/render` i `nodemailer`:

```sh
npm install @react-email/render nodemailer
```

## Kod źródłowy i przykład {#source-code-and-example}

Utwórz szablon wiadomości e-mail przy użyciu pliku `.jsx` lub `.js`:

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

W tym przykładzie używamy biblioteki **[Nodemailer](https://github.com/nodemailer/nodemailer)** i jej oficjalnego sponsora **[Przekaż dalej e-mail](https://forwardemail.net)** do wysyłania i podglądu poczty wychodzącej.

Aby wysłać pocztę wychodzącą, musisz <strong class="text-success"><i class="fa fa-key"></i>wygenerować hasło</strong> – postępuj zgodnie z instrukcją **[Przewodnik SMTP po wysyłaniu wiadomości e-mail z niestandardową domeną](/guides/send-email-with-custom-domain-smtp)**.

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

Uruchom aplikację, aby wysłać wiadomość e-mail:

```sh
node app
```

Teraz możesz przejść do **[Moje konto → E-maile](/my-account/emails)**, aby zobaczyć status dostarczania wiadomości e-mail w czasie rzeczywistym, dzienniki dostarczalności wiadomości e-mail oraz podglądy w formacie HTML/zwykłego tekstu/załączników.

> P.S. :tada: Możesz również użyć **[podgląd wiadomości e-mail w przeglądarkach i symulatorze iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** i **[twórz szablony wiadomości e-mail za pomocą Node.js](/docs/send-emails-with-node-js-javascript)**.