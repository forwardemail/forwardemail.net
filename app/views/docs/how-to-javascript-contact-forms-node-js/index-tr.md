# JavaScript İletişim Formları Node.js Kod Örneği {#javascript-contact-forms-nodejs-code-example}


## İçindekiler {#table-of-contents}

* [Kurulum ve Gereksinimler](#install-and-requirements)
* [Kaynak Kod ve Örnek](#source-code-and-example)


## Kurulum ve Gereksinimler {#install-and-requirements}

`nodemailer` npm bağımlılığını yüklemeniz gerekecek:

```sh
npm install nodemailer
```


## Kaynak Kod ve Örnek {#source-code-and-example}

Bu örnek, **[Nodemailer](https://github.com/nodemailer/nodemailer)** kütüphanesini ve resmi sponsoru **[Forward Email](https://forwardemail.net)** kullanarak giden postaları gönderir ve önizler.

Giden posta göndermek için <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluşturmanız</strong> gerekecek – lütfen **[Özel Alan Adı SMTP ile E-posta Gönderme Rehberi](/guides/send-email-with-custom-domain-smtp)**'mizi takip edin.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: `user` ve `pass` değerlerini şuradan değiştirin:
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

Postayı göndermek için uygulamayı çalıştırın:

```sh
node app
```

Şimdi gerçek zamanlı e-posta teslimat durumunuzu, e-posta teslim edilebilirlik kayıtlarını ve HTML/düz metin/ek önizlemelerini görmek için **[Hesabım → E-postalar](/my-account/emails)** sayfasına gidebilirsiniz.

> Not: :tada: Ayrıca **[tarayıcılarda ve iOS Simülatöründe e-postaları önizleyebilir](/docs/test-preview-email-rendering-browsers-ios-simulator)** ve **[Node.js ile e-posta şablonları oluşturabilirsiniz](/docs/send-emails-with-node-js-javascript)**.
