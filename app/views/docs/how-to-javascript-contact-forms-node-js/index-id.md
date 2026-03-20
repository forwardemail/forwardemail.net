# Contoh Kode Formulir Kontak JavaScript Node.js {#javascript-contact-forms-nodejs-code-example}


## Daftar Isi {#table-of-contents}

* [Instalasi dan Persyaratan](#install-and-requirements)
* [Kode Sumber dan Contoh](#source-code-and-example)


## Instalasi dan Persyaratan {#install-and-requirements}

Anda perlu menginstal dependensi npm `nodemailer`:

```sh
npm install nodemailer
```


## Kode Sumber dan Contoh {#source-code-and-example}

Contoh ini menggunakan pustaka **[Nodemailer](https://github.com/nodemailer/nodemailer)** dan sponsor resminya **[Forward Email](https://forwardemail.net)** untuk mengirim dan melihat pratinjau email keluar.

Anda perlu <strong class="text-success"><i class="fa fa-key"></i> Menghasilkan Kata Sandi</strong> untuk mengirim email keluar – silakan ikuti **[Panduan Kirim Email dengan SMTP Domain Kustom](/guides/send-email-with-custom-domain-smtp)** kami.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: ganti nilai `user` dan `pass` dari:
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

Jalankan aplikasi untuk mengirim email:

```sh
node app
```

Sekarang Anda dapat pergi ke **[Akun Saya → Email](/my-account/emails)** untuk melihat status pengiriman email secara real-time, log keterkiriman email, dan pratinjau HTML/teks biasa/lampiran.

> P.S. :tada: Anda juga dapat **[melihat pratinjau email di browser dan Simulator iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** dan **[membuat template email dengan Node.js](/docs/send-emails-with-node-js-javascript)**.
