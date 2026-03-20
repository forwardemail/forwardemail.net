# דוגמא לקוד טפסי יצירת קשר ב-JavaScript עם Node.js {#javascript-contact-forms-nodejs-code-example}


## תוכן העניינים {#table-of-contents}

* [התקנה ודרישות](#install-and-requirements)
* [קוד מקור ודוגמא](#source-code-and-example)


## התקנה ודרישות {#install-and-requirements}

תצטרכו להתקין את התלות `nodemailer` ב-npm:

```sh
npm install nodemailer
```


## קוד מקור ודוגמא {#source-code-and-example}

דוגמא זו משתמשת בספריית **[Nodemailer](https://github.com/nodemailer/nodemailer)** ובספונסר הרשמי שלה **[Forward Email](https://forwardemail.net)** כדי לשלוח ולתצוגה מקדימה של דואר יוצא.

תצטרכו <strong class="text-success"><i class="fa fa-key"></i> ליצור סיסמה</strong> כדי לשלוח דואר יוצא – אנא עקבו אחר **[המדריך שלנו לשליחת דואר עם SMTP של דומיין מותאם אישית](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: החליפו את הערכים `user` ו-`pass` מ:
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

הריצו את האפליקציה כדי לשלוח את המייל:

```sh
node app
```

כעת תוכלו לגשת ל-**[החשבון שלי → מיילים](/my-account/emails)** כדי לראות את סטטוס משלוח המייל בזמן אמת, יומני יכולת המסירה, ותצוגות מקדימות של HTML/טקסט רגיל/קבצים מצורפים.

> הערה: :tada: תוכלו גם **[לתצוגה מקדימה של מיילים בדפדפנים ובאימולטור iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** ו-**[ליצור תבניות מייל עם Node.js](/docs/send-emails-with-node-js-javascript)**.
