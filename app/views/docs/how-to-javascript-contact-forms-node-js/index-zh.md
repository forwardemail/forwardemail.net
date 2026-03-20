# JavaScript 联系表单 Node.js 代码示例 {#javascript-contact-forms-nodejs-code-example}


## 目录 {#table-of-contents}

* [安装和要求](#install-and-requirements)
* [源代码和示例](#source-code-and-example)


## 安装和要求 {#install-and-requirements}

您需要安装 `nodemailer` npm 依赖：

```sh
npm install nodemailer
```


## 源代码和示例 {#source-code-and-example}

此示例使用 **[Nodemailer](https://github.com/nodemailer/nodemailer)** 库及其官方赞助商 **[Forward Email](https://forwardemail.net)** 来发送和预览外发邮件。

您需要 <strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong> 来发送外发邮件 – 请参阅我们的 **[使用自定义域 SMTP 发送邮件指南](/guides/send-email-with-custom-domain-smtp)**。

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

运行应用以发送邮件：

```sh
node app
```

现在您可以前往 **[我的账户 → 邮箱](/my-account/emails)** 查看您的实时邮件发送状态、邮件可达性日志，以及 HTML/纯文本/附件预览。

> P.S. :tada: 您还可以 **[在浏览器和 iOS 模拟器中预览邮件](/docs/test-preview-email-rendering-browsers-ios-simulator)** 以及 **[使用 Node.js 创建邮件模板](/docs/send-emails-with-node-js-javascript)**。
