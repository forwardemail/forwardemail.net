# Пример кода контактных форм на JavaScript с Node.js {#javascript-contact-forms-nodejs-code-example}


## Содержание {#table-of-contents}

* [Установка и требования](#install-and-requirements)
* [Исходный код и пример](#source-code-and-example)


## Установка и требования {#install-and-requirements}

Вам нужно установить зависимость npm `nodemailer`:

```sh
npm install nodemailer
```


## Исходный код и пример {#source-code-and-example}

Этот пример использует библиотеку **[Nodemailer](https://github.com/nodemailer/nodemailer)** и её официального спонсора **[Forward Email](https://forwardemail.net)** для отправки и предварительного просмотра исходящей почты.

Вам нужно <strong class="text-success"><i class="fa fa-key"></i> Сгенерировать пароль</strong> для отправки исходящей почты – пожалуйста, следуйте нашему **[руководству по отправке почты через SMTP с пользовательским доменом](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

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

await transporter.sendMail({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<h1>hello world</h1>'
});
```

Запустите приложение для отправки письма:

```sh
node app
```

Теперь вы можете перейти в **[Мой аккаунт → Письма](/my-account/emails)**, чтобы увидеть статус доставки писем в реальном времени, логи доставляемости и предварительный просмотр HTML/текста/вложений.

> P.S. :tada: Вы также можете **[просматривать письма в браузерах и iOS-симуляторе](/docs/test-preview-email-rendering-browsers-ios-simulator)** и **[создавать шаблоны писем с Node.js](/docs/send-emails-with-node-js-javascript)**.
