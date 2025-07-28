# إرسال رسائل البريد الإلكتروني باستخدام مثال تطبيق الويب React.js Node {#send-emails-with-reactjs-node-web-app-example}

## جدول المحتويات {#table-of-contents}

* [التثبيت والمتطلبات](#install-and-requirements)
* [الكود المصدر والمثال](#source-code-and-example)

## التثبيت والمتطلبات {#install-and-requirements}

سوف تحتاج إلى تثبيت تبعيات npm `@react-email/render` و `nodemailer`:

```sh
npm install @react-email/render nodemailer
```

## كود المصدر والمثال {#source-code-and-example}

قم بإنشاء قالب البريد الإلكتروني الخاص بك باستخدام ملف `.jsx` أو `.js`:

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

في هذا المثال، نستخدم مكتبة **[نوداميلر](https://github.com/nodemailer/nodemailer)** والراعي الرسمي لها **[إعادة توجيه البريد الإلكتروني](https://forwardemail.net)** لإرسال البريد الصادر ومعاينته.

سوف تحتاج إلى <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> لإرسال بريد صادر - يرجى اتباع **[إرسال بريد إلكتروني باستخدام دليل SMTP للنطاق المخصص](/guides/send-email-with-custom-domain-smtp)**.

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

قم بتشغيل التطبيق لإرسال البريد الإلكتروني:

```sh
node app
```

يمكنك الآن الانتقال إلى **[حسابي → رسائل البريد الإلكتروني](/my-account/emails)** للاطلاع على حالة تسليم البريد الإلكتروني في الوقت الفعلي، وسجلات إمكانية تسليم البريد الإلكتروني، ومعاينات HTML/النص العادي/المرفقات.

> ملاحظة: :tada: يمكنك أيضًا **[معاينة رسائل البريد الإلكتروني في المتصفحات ومحاكي iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** و**[إنشاء قوالب البريد الإلكتروني باستخدام Node.js](/docs/send-emails-with-node-js-javascript)**.