# Надсилання електронних листів за допомогою прикладу веб-застосунку React.js Node {#send-emails-with-reactjs-node-web-app-example}

## Зміст {#table-of-contents}

* [Встановлення та вимоги](#install-and-requirements)
* [Вихідний код та приклад](#source-code-and-example)

## Встановлення та вимоги {#install-and-requirements}

Вам потрібно буде встановити npm-залежності `@react-email/render` та `nodemailer`:

```sh
npm install @react-email/render nodemailer
```

## Вихідний код та приклад {#source-code-and-example}

Створіть шаблон електронної пошти з файлом `.jsx` або `.js`:

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

У цьому прикладі ми використовуємо бібліотеку **[Nodemailer](https://github.com/nodemailer/nodemailer)** та її офіційного спонсора **[Переслати електронний лист](https://forwardemail.net)** для надсилання та попереднього перегляду вихідної пошти.

Вам потрібно буде <strong class="text-success"><i class="fa fa-key"></i>Згенерувати пароль</strong>, щоб надсилати вихідну пошту – будь ласка, дотримуйтесь наших інструкцій **[Посібник з надсилання електронної пошти за допомогою SMTP-адреси користувацького домену](/guides/send-email-with-custom-domain-smtp)**.

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

Запустіть програму, щоб надіслати електронний лист:

```sh
node app
```

Тепер ви можете перейти до **[Мій обліковий запис → Електронні листи](/my-account/emails)**, щоб переглянути статус доставки електронної пошти в режимі реального часу, журнали доставки електронної пошти та попередній перегляд HTML/звичайного тексту/вкладень.

> P.S. :tada: Ви також можете **[попередній перегляд електронних листів у браузерах та симуляторі iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** та **[створення шаблонів електронних листів за допомогою Node.js](/docs/send-emails-with-node-js-javascript)**.