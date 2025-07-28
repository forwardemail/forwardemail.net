# דוגמה לקוד Node.js של טפסי יצירת קשר ב-JavaScript {#javascript-contact-forms-nodejs-code-example}

## תוכן עניינים

* [התקנה ודרישות](#install-and-requirements)
* [קוד מקור ודוגמה](#source-code-and-example)

## התקנה ודרישות {#install-and-requirements}

תצטרך להתקין את התלות `nodemailer` npm:

```sh
npm install nodemailer
```

## קוד מקור ודוגמה של {#source-code-and-example}

דוגמה זו משתמשת בספרייה **[Nodemailer](https://github.com/nodemailer/nodemailer)** ובנותן החסות הרשמי שלה **[העברת דוא"ל](https://forwardemail.net)** כדי לשלוח ולצפות בתצוגה מקדימה של דואר יוצא.

תצטרך <strong class="text-success"><i class="fa fa-key"></i>ליצור סיסמה</strong> כדי לשלוח דואר יוצא - אנא עקוב אחר **[מדריך לשליחת דוא"ל עם דומיין מותאם אישית (SMTP)](/guides/send-email-with-custom-domain-smtp)** שלנו.

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

הפעל את האפליקציה כדי לשלוח את האימייל:

```sh
node app
```

כעת תוכל לעבור אל **[החשבון שלי → אימיילים](/my-account/emails)** כדי לראות את סטטוס מסירת הדוא"ל בזמן אמת, יומני מסירה ותצוגות מקדימות של HTML/טקסט רגיל/קבצים מצורפים.

> נ.ב. :tada: אתה יכול גם **[תצוגה מקדימה של אימיילים בדפדפנים ובסימולטור iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** ו- **[צור תבניות דוא"ל עם Node.js](/docs/send-emails-with-node-js-javascript)**.