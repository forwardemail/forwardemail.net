# Отправка электронных писем с помощью примера веб-приложения React.js Node {#send-emails-with-reactjs-node-web-app-example}

## Содержание {#table-of-contents}

* [Установка и требования](#install-and-requirements)
* [Исходный код и пример](#source-code-and-example)

## Установка и требования {#install-and-requirements}

Вам потребуется установить npm-зависимости `@react-email/render` и `nodemailer`:

```sh
npm install @react-email/render nodemailer
```

## Исходный код и пример {#source-code-and-example}

Создайте свой шаблон электронной почты с файлом `.jsx` или `.js`:

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

В этом примере мы используем библиотеку **[Nodemailer](https://github.com/nodemailer/nodemailer)** и ее официального спонсора **[Переслать письмо](https://forwardemail.net)** для отправки и предварительного просмотра исходящей почты.

Вам потребуется <strong class="text-success"><i class="fa fa-key"></i> сгенерировать пароль</strong> для отправки исходящей почты — перейдите по нашей **[Руководство по отправке электронных писем с использованием пользовательского домена SMTP](/guides/send-email-with-custom-domain-smtp)**.

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

Запустите приложение, чтобы отправить электронное письмо:

```sh
node app
```

Теперь вы можете перейти по ссылке **[Мой аккаунт → Электронная почта](/my-account/emails)**, чтобы увидеть статус доставки электронной почты в режиме реального времени, журналы доставки электронной почты и предварительный просмотр HTML/обычного текста/вложений.

> P.S. :tada: Вы также можете **[предварительный просмотр писем в браузерах и iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** и **[создание шаблонов электронной почты с помощью Node.js](/docs/send-emails-with-node-js-javascript)**.