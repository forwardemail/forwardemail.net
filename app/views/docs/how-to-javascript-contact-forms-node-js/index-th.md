# ตัวอย่างโค้ดแบบฟอร์มติดต่อ JavaScript Node.js {#javascript-contact-forms-nodejs-code-example}

## สารบัญ {#table-of-contents}

* [การติดตั้งและข้อกำหนด](#install-and-requirements)
* [ซอร์สโค้ดและตัวอย่าง](#source-code-and-example)

## การติดตั้งและข้อกำหนด {#install-and-requirements}

คุณจะต้องติดตั้งการอ้างอิง `nodemailer` npm:

```sh
npm install nodemailer
```

## รหัสต้นฉบับและตัวอย่าง {#source-code-and-example}

ตัวอย่างนี้ใช้ไลบรารี **[โนเดเมลเลอร์](https://github.com/nodemailer/nodemailer)** และผู้สนับสนุนอย่างเป็นทางการ **[ส่งต่ออีเมล์](https://forwardemail.net)** เพื่อส่งและดูตัวอย่างอีเมลขาออก

คุณจะต้อง <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> เพื่อส่งอีเมลขาออก – โปรดปฏิบัติตาม **[ส่งอีเมลด้วยคู่มือ SMTP โดเมนที่กำหนดเอง](/guides/send-email-with-custom-domain-smtp)** ของเรา

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

เรียกใช้แอปเพื่อส่งอีเมล:

```sh
node app
```

ตอนนี้คุณสามารถไปที่ **[บัญชีของฉัน → อีเมล์](/my-account/emails)** เพื่อดูสถานะการจัดส่งอีเมลแบบเรียลไทม์ บันทึกการจัดส่งอีเมล และการแสดงตัวอย่าง HTML/ข้อความธรรมดา/ไฟล์แนบ

> ป.ล. :tada: คุณยังสามารถ **[ดูตัวอย่างอีเมลในเบราว์เซอร์และ iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** และ **[สร้างเทมเพลตอีเมลด้วย Node.js](/docs/send-emails-with-node-js-javascript)** ได้ด้วย