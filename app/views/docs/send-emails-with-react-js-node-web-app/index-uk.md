# Надсилання електронних листів за допомогою React.js Node Web App Приклад {#send-emails-with-reactjs-node-web-app-example}


## Зміст {#table-of-contents}

* [Встановлення та вимоги](#install-and-requirements)
* [Вихідний код та приклад](#source-code-and-example)


## Встановлення та вимоги {#install-and-requirements}

Вам потрібно встановити npm-залежності `@react-email/render` та `nodemailer`:

```sh
npm install @react-email/render nodemailer
```


## Вихідний код та приклад {#source-code-and-example}

Створіть шаблон електронного листа у файлі з розширенням `.jsx` або `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Відвідати наш вебсайт</Button>
    </Html>
  );
}
```

У цьому прикладі ми використовуємо бібліотеку **[Nodemailer](https://github.com/nodemailer/nodemailer)** та її офіційного спонсора **[Forward Email](https://forwardemail.net)** для надсилання та попереднього перегляду вихідної пошти.

Вам потрібно <strong class="text-success"><i class="fa fa-key"></i> Згенерувати пароль</strong> для надсилання вихідної пошти – будь ласка, дотримуйтесь нашого **[Посібника з надсилання електронної пошти через SMTP з власним доменом](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: замініть значення `user` та `pass` з:
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

Запустіть додаток, щоб надіслати лист:

```sh
node app
```

Тепер ви можете перейти до **[Мій акаунт → Листи](/my-account/emails)**, щоб побачити статус доставки листів у реальному часі, журнали доставлення та попередній перегляд HTML/текстових/вкладень.

> P.S. :tada: Ви також можете **[переглядати листи у браузерах та iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** та **[створювати шаблони листів за допомогою Node.js](/docs/send-emails-with-node-js-javascript)**.
