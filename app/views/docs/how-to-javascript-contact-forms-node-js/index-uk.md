# Приклад коду Node.js для контактних форм на JavaScript {#javascript-contact-forms-nodejs-code-example}

## Зміст {#table-of-contents}

* [Встановлення та вимоги](#install-and-requirements)
* [Вихідний код та приклад](#source-code-and-example)

## Встановлення та вимоги {#install-and-requirements}

Вам потрібно буде встановити залежність `nodemailer` від npm:

```sh
npm install nodemailer
```

## Вихідний код та приклад {#source-code-and-example}

У цьому прикладі використовується бібліотека **[Nodemailer](https://github.com/nodemailer/nodemailer)** та її офіційного спонсора **[Переслати електронний лист](https://forwardemail.net)** для надсилання та попереднього перегляду вихідної пошти.

Вам потрібно буде <strong class="text-success"><i class="fa fa-key"></i>Згенерувати пароль</strong>, щоб надсилати вихідну пошту – будь ласка, скористайтеся нашими **[Посібник з надсилання електронної пошти за допомогою SMTP-адреси користувацького домену](/guides/send-email-with-custom-domain-smtp)**.

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

Запустіть програму, щоб надіслати електронний лист:

```sh
node app
```

Тепер ви можете перейти за посиланням **[Мій обліковий запис → Електронні листи](/my-account/emails)**, щоб переглянути статус доставки електронної пошти в режимі реального часу, журнали доставки електронної пошти та попередній перегляд HTML/відкритого тексту/вкладень.

> P.S. :tada: Ви також можете **[попередній перегляд електронних листів у браузерах та симуляторі iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** та **[створення шаблонів електронних листів за допомогою Node.js](/docs/send-emails-with-node-js-javascript)**.