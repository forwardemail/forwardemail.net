# Wysyłanie e-maili za pomocą aplikacji webowej React.js Node {#send-emails-with-reactjs-node-web-app-example}


## Spis treści {#table-of-contents}

* [Instalacja i wymagania](#install-and-requirements)
* [Kod źródłowy i przykład](#source-code-and-example)


## Instalacja i wymagania {#install-and-requirements}

Musisz zainstalować zależności npm `@react-email/render` oraz `nodemailer`:

```sh
npm install @react-email/render nodemailer
```


## Kod źródłowy i przykład {#source-code-and-example}

Utwórz swój szablon e-maila w pliku `.jsx` lub `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Odwiedź naszą stronę</Button>
    </Html>
  );
}
```

W tym przykładzie używamy biblioteki **[Nodemailer](https://github.com/nodemailer/nodemailer)** oraz jej oficjalnego sponsora **[Forward Email](https://forwardemail.net)** do wysyłania i podglądu wychodzącej poczty.

Będziesz musiał <strong class="text-success"><i class="fa fa-key"></i> wygenerować hasło</strong>, aby wysyłać wychodzącą pocztę – prosimy o zapoznanie się z naszym **[Przewodnikiem Wysyłania E-maili z niestandardową domeną SMTP](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: zamień wartości `user` i `pass` na:
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

Uruchom aplikację, aby wysłać e-mail:

```sh
node app
```

Teraz możesz przejść do **[Moje konto → E-maile](/my-account/emails)**, aby zobaczyć status dostarczania e-maili w czasie rzeczywistym, logi dostarczalności oraz podglądy HTML/tekst zwykły/załączniki.

> P.S. :tada: Możesz także **[podglądać e-maile w przeglądarkach i symulatorze iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** oraz **[tworzyć szablony e-maili za pomocą Node.js](/docs/send-emails-with-node-js-javascript)**.
