# مثال على كود نماذج الاتصال JavaScript Node.js {#javascript-contact-forms-nodejs-code-example}

## جدول المحتويات {#table-of-contents}

* [التثبيت والمتطلبات](#install-and-requirements)
* [الكود المصدر والمثال](#source-code-and-example)

## التثبيت والمتطلبات {#install-and-requirements}

سوف تحتاج إلى تثبيت `nodemailer` تبعية npm:

```sh
npm install nodemailer
```

## كود المصدر والمثال {#source-code-and-example}

يستخدم هذا المثال مكتبة **[نوداميلر](https://github.com/nodemailer/nodemailer)** والراعي الرسمي لها **[إعادة توجيه البريد الإلكتروني](https://forwardemail.net)** لإرسال البريد الصادر ومعاينته.

سوف تحتاج إلى <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> لإرسال بريد صادر - يرجى اتباع **[إرسال بريد إلكتروني باستخدام دليل SMTP للنطاق المخصص](/guides/send-email-with-custom-domain-smtp)**.

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

قم بتشغيل التطبيق لإرسال البريد الإلكتروني:

```sh
node app
```

يمكنك الآن الانتقال إلى **[حسابي → رسائل البريد الإلكتروني](/my-account/emails)** للاطلاع على حالة تسليم البريد الإلكتروني في الوقت الفعلي، وسجلات إمكانية تسليم البريد الإلكتروني، ومعاينات HTML/النص العادي/المرفقات.

> ملاحظة: :tada: يمكنك أيضًا **[معاينة رسائل البريد الإلكتروني في المتصفحات ومحاكي iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** و**[إنشاء قوالب البريد الإلكتروني باستخدام Node.js](/docs/send-emails-with-node-js-javascript)**.