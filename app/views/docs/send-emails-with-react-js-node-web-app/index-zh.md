# 使用 React.js Node Web 应用发送邮件示例 {#send-emails-with-reactjs-node-web-app-example}


## 目录 {#table-of-contents}

* [安装和要求](#install-and-requirements)
* [源代码和示例](#source-code-and-example)


## 安装和要求 {#install-and-requirements}

您需要安装 `@react-email/render` 和 `nodemailer` npm 依赖：

```sh
npm install @react-email/render nodemailer
```


## 源代码和示例 {#source-code-and-example}

使用 `.jsx` 或 `.js` 文件创建您的邮件模板：

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>访问我们的网站</Button>
    </Html>
  );
}
```

在此示例中，我们使用 **[Nodemailer](https://github.com/nodemailer/nodemailer)** 库及其官方赞助商 **[Forward Email](https://forwardemail.net)** 来发送和预览外发邮件。

您需要 <strong class="text-success"><i class="fa fa-key"></i> 生成密码</strong> 来发送外发邮件 – 请遵循我们的 **[使用自定义域 SMTP 发送邮件指南](/guides/send-email-with-custom-domain-smtp)**。

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
    // TODO: 替换以下 `user` 和 `pass` 的值：
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

运行应用以发送邮件：

```sh
node app
```

现在您可以前往 **[我的账户 → 邮件](/my-account/emails)** 查看您的实时邮件发送状态、邮件可达性日志以及 HTML/纯文本/附件预览。

> P.S. :tada: 您还可以 **[在浏览器和 iOS 模拟器中预览邮件](/docs/test-preview-email-rendering-browsers-ios-simulator)** 以及 **[使用 Node.js 创建邮件模板](/docs/send-emails-with-node-js-javascript)**。
