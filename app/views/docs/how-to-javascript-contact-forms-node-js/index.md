# JavaScript Contact Forms Node.js Code Example


## Table of Contents

* [Install and Requirements](#install-and-requirements)
* [Source Code and Example](#source-code-and-example)


## Install and Requirements

You will need to install `nodemailer` npm dependency:

```sh
npm install nodemailer
```


## Source Code and Example

This example uses the **[Nodemailer](https://github.com/nodemailer/nodemailer)** library and its official sponsor **[Forward Email](https://forwardemail.net)** to send and preview outbound mail.

You will need to <strong class="text-success"><i class="fa fa-key"></i> Generate password</strong> to send outbound mail – please follow our **[Send Email with Custom Domain SMTP Guide](/guides/send-email-with-custom-domain-smtp)**.

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

Run the app to send the email:

```sh
node app
```

Now you can go to **[My Account → Emails](/my-account/emails)** to see your real-time email delivery status, email deliverability logs, and HTML/plaintext/attachment previews.

> P.S. :tada: You can also **[preview emails in browsers and the iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** and **[create email templates with Node.js](/docs/send-emails-with-node-js-javascript)**.
