# JavaScript 联系表单 Node.js 代码示例 {#javascript-contact-forms-nodejs-code-example}

## 目录 {#table-of-contents}

* [安装和要求](#install-and-requirements)
* [源代码和示例](#source-code-and-example)

## 安装和要求 {#install-and-requirements}

您将需要安装 `nodemailer` npm 依赖项：

```sh
npm install nodemailer
```

## 源代码和示例 {#source-code-and-example}

本示例使用 **[Nodemailer](https://github.com/nodemailer/nodemailer)** 库及其官方赞助商 **[转发电子邮件](https://forwardemail.net)** 来发送和预览出站邮件。

您需要<strong class="text-success"><i class="fa fa-key"></i>生成密码</strong>才能发送外发邮件 - 请遵循我们的**[使用自定义域名发送电子邮件 SMTP 指南](/guides/send-email-with-custom-domain-smtp)**。

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

运行应用程序来发送电子邮件：

```sh
node app
```

现在您可以前往**[我的账户 → 电子邮件](/my-account/emails)**查看您的实时电子邮件传递状态、电子邮件传递日志以及 HTML/纯文本/附件预览。

> 附言：tada：您还可以**[在浏览器和 iOS 模拟器中预览电子邮件](/docs/test-preview-email-rendering-browsers-ios-simulator)**和**[使用 Node.js 创建电子邮件模板](/docs/send-emails-with-node-js-javascript)**。