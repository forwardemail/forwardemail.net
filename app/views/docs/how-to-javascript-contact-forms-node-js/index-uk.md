# JavaScript Контактні Форми Приклад Коду Node.js {#javascript-contact-forms-nodejs-code-example}


## Зміст {#table-of-contents}

* [Встановлення та Вимоги](#install-and-requirements)
* [Вихідний Код та Приклад](#source-code-and-example)


## Встановлення та Вимоги {#install-and-requirements}

Вам потрібно встановити npm-залежність `nodemailer`:

```sh
npm install nodemailer
```


## Вихідний Код та Приклад {#source-code-and-example}

Цей приклад використовує бібліотеку **[Nodemailer](https://github.com/nodemailer/nodemailer)** та її офіційного спонсора **[Forward Email](https://forwardemail.net)** для відправки та перегляду вихідної пошти.

Вам потрібно <strong class="text-success"><i class="fa fa-key"></i> Згенерувати Пароль</strong> для відправки вихідної пошти – будь ласка, дотримуйтесь нашого **[Посібника з Відправки Листів через SMTP з Користувацьким Доменом](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

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

await transporter.sendMail({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<h1>hello world</h1>'
});
```

Запустіть додаток для відправки листа:

```sh
node app
```

Тепер ви можете перейти до **[Мій Кабінет → Листи](/my-account/emails)**, щоб побачити статус доставки листів у реальному часі, журнали доставляння та перегляди HTML/текстових/вкладених файлів.

> P.S. :tada: Ви також можете **[переглядати листи у браузерах та iOS-симуляторі](/docs/test-preview-email-rendering-browsers-ios-simulator)** та **[створювати шаблони листів з Node.js](/docs/send-emails-with-node-js-javascript)**.
