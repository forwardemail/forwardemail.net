# Kirim Email dengan Contoh Aplikasi Web Node React.js {#send-emails-with-reactjs-node-web-app-example}

## Daftar Isi {#table-of-contents}

* [Instalasi dan Persyaratan](#install-and-requirements)
* [Kode Sumber dan Contoh](#source-code-and-example)

## Instalasi dan Persyaratan {#install-and-requirements}

Anda perlu menginstal dependensi npm `@react-email/render` dan `nodemailer`:

```sh
npm install @react-email/render nodemailer
```

## Kode Sumber dan Contoh {#source-code-and-example}

Buat templat email Anda dengan file `.jsx` atau `.js`:

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

Dalam contoh ini, kami menggunakan pustaka **[Nodemailer](https://github.com/nodemailer/nodemailer)** dan sponsor resminya **[Teruskan Email](https://forwardemail.net)** untuk mengirim dan melihat pratinjau surat keluar.

Anda perlu <strong class="text-success"><i class="fa fa-key"></i> Membuat Kata Sandi</strong> untuk mengirim email keluar – silakan ikuti **[Panduan Mengirim Email dengan Domain Kustom SMTP](/guides/send-email-with-custom-domain-smtp)** kami.

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

Jalankan aplikasi untuk mengirim email:

```sh
node app
```

Sekarang Anda dapat membuka **[Akun Saya → Email](/my-account/emails)** untuk melihat status pengiriman email secara real-time, log pengiriman email, dan pratinjau HTML/teks biasa/lampiran.

> P.S. :tada: Anda juga dapat **[pratinjau email di browser dan Simulator iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** dan **[membuat template email dengan Node.js](/docs/send-emails-with-node-js-javascript)**.