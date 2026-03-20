# React.js Node Web Uygulaması Örneği ile E-posta Gönderme {#send-emails-with-reactjs-node-web-app-example}


## İçindekiler {#table-of-contents}

* [Kurulum ve Gereksinimler](#install-and-requirements)
* [Kaynak Kod ve Örnek](#source-code-and-example)


## Kurulum ve Gereksinimler {#install-and-requirements}

`@react-email/render` ve `nodemailer` npm bağımlılıklarını yüklemeniz gerekecek:

```sh
npm install @react-email/render nodemailer
```


## Kaynak Kod ve Örnek {#source-code-and-example}

E-posta şablonunuzu `.jsx` veya `.js` dosyası ile oluşturun:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Web sitemizi ziyaret edin</Button>
    </Html>
  );
}
```

Bu örnekte, giden postaları göndermek ve önizlemek için **[Nodemailer](https://github.com/nodemailer/nodemailer)** kütüphanesini ve resmi sponsoru **[Forward Email](https://forwardemail.net)** kullanıyoruz.

Giden posta göndermek için <strong class="text-success"><i class="fa fa-key"></i> Şifre Oluşturmanız</strong> gerekecek – lütfen **[Özel Alan Adı SMTP ile E-posta Gönderme Rehberi](/guides/send-email-with-custom-domain-smtp)**'mizi takip edin.

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
    // TODO: `user` ve `pass` değerlerini şuradan değiştirin:
    // <https://forwardemail.net/guides/send-email-with-custom-domain-smtp>
    user: 'you@example.com',
    pass: '****************************'
  },
});

const html = render(Email({ url: "https://example.com" }));

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'merhaba dünya',
  html
};

transporter.sendMail(options);
```

E-postayı göndermek için uygulamayı çalıştırın:

```sh
node app
```

Artık gerçek zamanlı e-posta teslim durumu, e-posta teslim edilebilirlik kayıtları ve HTML/düz metin/ek önizlemelerini görmek için **[Hesabım → E-postalar](/my-account/emails)** sayfasına gidebilirsiniz.

> Not: :tada: Ayrıca **[tarayıcılarda ve iOS Simülatöründe e-postaları önizleyebilirsiniz](/docs/test-preview-email-rendering-browsers-ios-simulator)** ve **[Node.js ile e-posta şablonları oluşturabilirsiniz](/docs/send-emails-with-node-js-javascript)**.
