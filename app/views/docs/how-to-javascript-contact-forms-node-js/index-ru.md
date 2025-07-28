# Пример кода Node.js для контактных форм JavaScript {#javascript-contact-forms-nodejs-code-example}

## Содержание {#table-of-contents}

* [Установка и требования](#install-and-requirements)
* [Исходный код и пример](#source-code-and-example)

## Установка и требования {#install-and-requirements}

Вам потребуется установить npm-зависимость `nodemailer`:

```sh
npm install nodemailer
```

## Исходный код и пример {#source-code-and-example}

В этом примере используется библиотека **[Nodemailer](https://github.com/nodemailer/nodemailer)** и ее официальный спонсор **[Переслать электронное письмо](https://forwardemail.net)** для отправки и предварительного просмотра исходящей почты.

Вам потребуется <strong class="text-success"><i class="fa fa-key"></i> сгенерировать пароль</strong> для отправки исходящей почты — пожалуйста, следуйте нашим **[Руководство по отправке электронной почты с использованием пользовательского домена SMTP](/guides/send-email-with-custom-domain-smtp)**.

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

Запустите приложение, чтобы отправить электронное письмо:

```sh
node app
```

Теперь вы можете перейти в **[Моя учетная запись → Электронная почта](/my-account/emails)**, чтобы увидеть статус доставки электронной почты в реальном времени, журналы доставки электронной почты и предварительный просмотр HTML/текста/вложений.

> P.S. :tada: Вы также можете **[предварительный просмотр писем в браузерах и iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** и **[создавать шаблоны электронных писем с помощью Node.js](/docs/send-emails-with-node-js-javascript)**.