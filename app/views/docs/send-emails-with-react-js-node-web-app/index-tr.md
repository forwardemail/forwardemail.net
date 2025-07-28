# React.js Node Web Uygulaması Örneğiyle E-posta Gönderme {#send-emails-with-reactjs-node-web-app-example}

## İçindekiler {#table-of-contents}

* [Kurulum ve Gereksinimler](#install-and-requirements)
* [Kaynak Kodu ve Örnek](#source-code-and-example)

## Kurulum ve Gereksinimler {#install-and-requirements}

`@react-email/render` ve `nodemailer` npm bağımlılıklarını yüklemeniz gerekecek:

```sh
npm install @react-email/render nodemailer
```

## Kaynak Kodu ve Örnek {#source-code-and-example}

E-posta şablonunuzu `.jsx` veya `.js` dosyasıyla oluşturun:

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

Bu örnekte, giden postaları göndermek ve önizlemek için **[Nodemailer](https://github.com/nodemailer/nodemailer)** kütüphanesini ve resmi sponsoru **[E-postayı İlet](https://forwardemail.net)**'u kullanıyoruz.

Giden e-posta göndermek için <strong class="text-success"><i class="fa fa-key"></i>Şifre Oluştur</strong>'a ihtiyacınız olacak - lütfen **[Özel Alan Adıyla E-posta Gönderme SMTP Kılavuzu](/guides/send-email-with-custom-domain-smtp)** adımlarımızı izleyin.

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

E-postayı göndermek için uygulamayı çalıştırın:

```sh
node app
```

Artık gerçek zamanlı e-posta teslim durumunuzu, e-posta teslim edilebilirlik günlüklerinizi ve HTML/düz metin/ek önizlemelerinizi görmek için **[Hesabım → E-postalar](/my-account/emails)** adresine gidebilirsiniz.

> Not: :tada: Ayrıca **[tarayıcılarda ve iOS Simülatöründe e-postaları önizleme](/docs/test-preview-email-rendering-browsers-ios-simulator)** ve **[Node.js ile e-posta şablonları oluşturun](/docs/send-emails-with-node-js-javascript)**'ü de kullanabilirsiniz.