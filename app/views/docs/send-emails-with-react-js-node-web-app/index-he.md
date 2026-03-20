# שליחת מיילים עם דוגמת אפליקציית React.js Node {#send-emails-with-reactjs-node-web-app-example}


## תוכן העניינים {#table-of-contents}

* [התקנה ודרישות](#install-and-requirements)
* [קוד מקור ודוגמה](#source-code-and-example)


## התקנה ודרישות {#install-and-requirements}

תצטרכו להתקין את התלויות `@react-email/render` ו-`nodemailer` באמצעות npm:

```sh
npm install @react-email/render nodemailer
```


## קוד מקור ודוגמה {#source-code-and-example}

צרו את תבנית המייל שלכם בקובץ `.jsx` או `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>בקרו באתר שלנו</Button>
    </Html>
  );
}
```

בדוגמה זו, אנו משתמשים בספריית **[Nodemailer](https://github.com/nodemailer/nodemailer)** ובספונסר הרשמי שלה **[Forward Email](https://forwardemail.net)** כדי לשלוח ולתצוגה מקדימה של מיילים יוצאים.

תצטרכו <strong class="text-success"><i class="fa fa-key"></i> ליצור סיסמה</strong> כדי לשלוח מייל יוצא – אנא עקבו אחר **[המדריך לשליחת מייל עם SMTP בדומיין מותאם אישית](/guides/send-email-with-custom-domain-smtp)** שלנו.

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
    // TODO: החליפו את הערכים `user` ו-`pass` מ:
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

הריצו את האפליקציה כדי לשלוח את המייל:

```sh
node app
```

כעת תוכלו לגשת ל**[החשבון שלי → מיילים](/my-account/emails)** כדי לראות את סטטוס משלוח המייל בזמן אמת, יומני נגישות המייל, ותצוגות מקדימות של HTML/טקסט רגיל/קבצים מצורפים.

> הערה: :tada: תוכלו גם **[לתצוגת מקדימה של מיילים בדפדפנים ובאימולטור iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** ו-**[ליצור תבניות מייל עם Node.js](/docs/send-emails-with-node-js-javascript)**.
