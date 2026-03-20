# نماذج الاتصال بجافاسكريبت مثال كود Node.js {#javascript-contact-forms-nodejs-code-example}


## جدول المحتويات {#table-of-contents}

* [التثبيت والمتطلبات](#install-and-requirements)
* [الكود المصدري والمثال](#source-code-and-example)


## التثبيت والمتطلبات {#install-and-requirements}

ستحتاج إلى تثبيت تبعية npm `nodemailer`:

```sh
npm install nodemailer
```


## الكود المصدري والمثال {#source-code-and-example}

يستخدم هذا المثال مكتبة **[Nodemailer](https://github.com/nodemailer/nodemailer)** والراعي الرسمي لها **[Forward Email](https://forwardemail.net)** لإرسال ومعاينة البريد الصادر.

ستحتاج إلى <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> لإرسال البريد الصادر – يرجى اتباع دليلنا **[إرسال البريد الإلكتروني باستخدام SMTP لنطاق مخصص](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

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

await transporter.sendMail({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<h1>hello world</h1>'
});
```

شغّل التطبيق لإرسال البريد الإلكتروني:

```sh
node app
```

الآن يمكنك الذهاب إلى **[حسابي → الرسائل الإلكترونية](/my-account/emails)** لرؤية حالة تسليم البريد الإلكتروني في الوقت الحقيقي، وسجلات قابلية تسليم البريد، ومعاينات HTML/النص العادي/المرفقات.

> ملاحظة: :tada: يمكنك أيضًا **[معاينة الرسائل الإلكترونية في المتصفحات ومحاكي iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** و **[إنشاء قوالب بريد إلكتروني باستخدام Node.js](/docs/send-emails-with-node-js-javascript)**.
