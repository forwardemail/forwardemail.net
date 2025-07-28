# JavaScript İletişim Formları Node.js Kod Örneği {#javascript-contact-forms-nodejs-code-example}

## İçindekiler {#table-of-contents}

* [Kurulum ve Gereksinimler](#install-and-requirements)
* [Kaynak Kodu ve Örnek](#source-code-and-example)

## Kurulum ve Gereksinimler {#install-and-requirements}

`nodemailer` npm bağımlılığını yüklemeniz gerekecek:

```sh
npm install nodemailer
```

## Kaynak Kodu ve Örnek {#source-code-and-example}

Bu örnek, giden postaları göndermek ve önizlemek için **[Nodemailer](https://github.com/nodemailer/nodemailer)** kütüphanesini ve resmi sponsoru **[E-postayı İlet](https://forwardemail.net)**'i kullanır.

Giden e-posta göndermek için <strong class="text-success"><i class="fa fa-key"></i>Şifre Oluştur</strong>'a ihtiyacınız olacak - lütfen **[Özel Alan Adıyla E-posta Gönderme SMTP Kılavuzu](/guides/send-email-with-custom-domain-smtp)** adımlarını izleyin.

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

E-postayı göndermek için uygulamayı çalıştırın:

```sh
node app
```

Artık gerçek zamanlı e-posta teslim durumunuzu, e-posta teslim edilebilirlik günlüklerinizi ve HTML/düz metin/ek önizlemelerinizi görmek için **[Hesabım → E-postalar](/my-account/emails)** adresine gidebilirsiniz.

> Not: :tada: Ayrıca **[tarayıcılarda ve iOS Simülatöründe e-postaları önizleme](/docs/test-preview-email-rendering-browsers-ios-simulator)** ve **[Node.js ile e-posta şablonları oluşturun](/docs/send-emails-with-node-js-javascript)** de yapabilirsiniz.