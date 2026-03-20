# ส่งอีเมลด้วย React.js Node Web App ตัวอย่าง {#send-emails-with-reactjs-node-web-app-example}


## สารบัญ {#table-of-contents}

* [การติดตั้งและความต้องการ](#install-and-requirements)
* [ซอร์สโค้ดและตัวอย่าง](#source-code-and-example)


## การติดตั้งและความต้องการ {#install-and-requirements}

คุณจะต้องติดตั้ง dependencies npm `@react-email/render` และ `nodemailer`:

```sh
npm install @react-email/render nodemailer
```


## ซอร์สโค้ดและตัวอย่าง {#source-code-and-example}

สร้างเทมเพลตอีเมลของคุณด้วยไฟล์ `.jsx` หรือ `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>เยี่ยมชมเว็บไซต์ของเรา</Button>
    </Html>
  );
}
```

ในตัวอย่างนี้ เราใช้ไลบรารี **[Nodemailer](https://github.com/nodemailer/nodemailer)** และผู้สนับสนุนอย่างเป็นทางการของมัน **[Forward Email](https://forwardemail.net)** เพื่อส่งและดูตัวอย่างอีเมลขาออก

คุณจะต้อง <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> เพื่อส่งอีเมลขาออก – กรุณาทำตาม **[คู่มือส่งอีเมลด้วย SMTP โดเมนที่กำหนดเอง](/guides/send-email-with-custom-domain-smtp)**

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
    // TODO: แทนที่ค่า `user` และ `pass` จาก:
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

รันแอปเพื่อส่งอีเมล:

```sh
node app
```

ตอนนี้คุณสามารถไปที่ **[บัญชีของฉัน → อีเมล](/my-account/emails)** เพื่อดูสถานะการส่งอีเมลแบบเรียลไทม์, บันทึกการส่งอีเมล, และดูตัวอย่าง HTML/ข้อความธรรมดา/ไฟล์แนบ

> ป.ล. :tada: คุณยังสามารถ **[ดูตัวอย่างอีเมลในเบราว์เซอร์และ iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** และ **[สร้างเทมเพลตอีเมลด้วย Node.js](/docs/send-emails-with-node-js-javascript)** ได้อีกด้วย
