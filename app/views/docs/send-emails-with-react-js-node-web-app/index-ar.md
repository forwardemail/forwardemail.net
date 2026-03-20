# إرسال رسائل البريد الإلكتروني مع مثال تطبيق ويب React.js Node {#send-emails-with-reactjs-node-web-app-example}


## جدول المحتويات {#table-of-contents}

* [التثبيت والمتطلبات](#install-and-requirements)
* [الكود المصدري والمثال](#source-code-and-example)


## التثبيت والمتطلبات {#install-and-requirements}

ستحتاج إلى تثبيت تبعيات npm `@react-email/render` و `nodemailer`:

```sh
npm install @react-email/render nodemailer
```


## الكود المصدري والمثال {#source-code-and-example}

أنشئ قالب البريد الإلكتروني الخاص بك باستخدام ملف `.jsx` أو `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>زر موقعنا الإلكتروني</Button>
    </Html>
  );
}
```

في هذا المثال، نستخدم مكتبة **[Nodemailer](https://github.com/nodemailer/nodemailer)** والراعي الرسمي لها **[Forward Email](https://forwardemail.net)** لإرسال ومعاينة البريد الصادر.

ستحتاج إلى <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> لإرسال البريد الصادر – يرجى اتباع دليلنا **[إرسال البريد الإلكتروني باستخدام SMTP لنطاق مخصص](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: استبدل قيم `user` و `pass` من:
    // <https://forwardemail.net/guides/send-email-with-custom-domain-smtp>
    user: 'you@example.com',
    pass: '****************************'
  },
});

const html = render(Email({ url: "https://example.com" }));

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'مرحباً بالعالم',
  html
};

transporter.sendMail(options);
```

شغّل التطبيق لإرسال البريد الإلكتروني:

```sh
node app
```

الآن يمكنك الذهاب إلى **[حسابي → الرسائل الإلكترونية](/my-account/emails)** لرؤية حالة تسليم البريد الإلكتروني في الوقت الحقيقي، وسجلات قابلية تسليم البريد، ومعاينات HTML/النص العادي/المرفقات.

> ملاحظة: :tada: يمكنك أيضاً **[معاينة الرسائل الإلكترونية في المتصفحات ومحاكي iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** و **[إنشاء قوالب البريد الإلكتروني باستخدام Node.js](/docs/send-emails-with-node-js-javascript)**.
