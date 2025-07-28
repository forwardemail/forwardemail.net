# שליחת מיילים עם דוגמה לאפליקציית אינטרנט של Node React.js {#send-emails-with-reactjs-node-web-app-example}

## תוכן עניינים

* [התקנה ודרישות](#install-and-requirements)
* [קוד מקור ודוגמה](#source-code-and-example)

## התקנה ודרישות {#install-and-requirements}

תצטרך להתקין את התלויות npm של `@react-email/render` ו- `nodemailer`:

```sh
npm install @react-email/render nodemailer
```

## קוד מקור ודוגמה של {#source-code-and-example}

צור את תבנית האימייל שלך עם קובץ `.jsx` או `.js`:

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

בדוגמה זו, אנו משתמשים בספרייה **[Nodemailer](https://github.com/nodemailer/nodemailer)** ובנותנת החסות הרשמי שלה **[העברת דוא"ל](https://forwardemail.net)** כדי לשלוח ולצפות בתצוגה מקדימה של דואר יוצא.

תצטרך <strong class="text-success"><i class="fa fa-key"></i>ליצור סיסמה</strong> כדי לשלוח דואר יוצא - אנא עקוב אחר **[מדריך לשליחת דוא"ל עם דומיין מותאם אישית (SMTP)](/guides/send-email-with-custom-domain-smtp)** שלנו.

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

הפעל את האפליקציה כדי לשלוח את האימייל:

```sh
node app
```

כעת תוכל לעבור אל **[החשבון שלי → אימיילים](/my-account/emails)** כדי לראות את סטטוס מסירת הדוא"ל בזמן אמת, יומני מסירה ותצוגות מקדימות של HTML/טקסט רגיל/קבצים מצורפים.

> נ.ב. :tada: אתה יכול גם **[תצוגה מקדימה של אימיילים בדפדפנים ובסימולטור iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** ו- **[צור תבניות דוא"ל עם Node.js](/docs/send-emails-with-node-js-javascript)**.