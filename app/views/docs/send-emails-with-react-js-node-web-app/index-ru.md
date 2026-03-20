# Отправка писем с помощью React.js Node веб-приложения {#send-emails-with-reactjs-node-web-app-example}


## Содержание {#table-of-contents}

* [Установка и требования](#install-and-requirements)
* [Исходный код и пример](#source-code-and-example)


## Установка и требования {#install-and-requirements}

Вам нужно установить npm-зависимости `@react-email/render` и `nodemailer`:

```sh
npm install @react-email/render nodemailer
```


## Исходный код и пример {#source-code-and-example}

Создайте шаблон письма в файле с расширением `.jsx` или `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Посетите наш сайт</Button>
    </Html>
  );
}
```

В этом примере мы используем библиотеку **[Nodemailer](https://github.com/nodemailer/nodemailer)** и её официального спонсора **[Forward Email](https://forwardemail.net)** для отправки и предварительного просмотра исходящих писем.

Вам нужно <strong class="text-success"><i class="fa fa-key"></i> Сгенерировать пароль</strong> для отправки исходящих писем – пожалуйста, следуйте нашему **[руководству по отправке писем через SMTP с пользовательским доменом](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: замените значения `user` и `pass` из:
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

Запустите приложение для отправки письма:

```sh
node app
```

Теперь вы можете перейти в **[Мой аккаунт → Письма](/my-account/emails)**, чтобы увидеть статус доставки писем в реальном времени, логи доставляемости и предварительный просмотр HTML/текста/вложений.

> P.S. :tada: Вы также можете **[просматривать письма в браузерах и iOS-симуляторе](/docs/test-preview-email-rendering-browsers-ios-simulator)** и **[создавать шаблоны писем с Node.js](/docs/send-emails-with-node-js-javascript)**.
