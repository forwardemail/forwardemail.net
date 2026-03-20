# React.js Node Webアプリでメールを送信する例 {#send-emails-with-reactjs-node-web-app-example}


## 目次 {#table-of-contents}

* [インストールと要件](#install-and-requirements)
* [ソースコードと例](#source-code-and-example)


## インストールと要件 {#install-and-requirements}

`@react-email/render` と `nodemailer` のnpm依存関係をインストールする必要があります：

```sh
npm install @react-email/render nodemailer
```


## ソースコードと例 {#source-code-and-example}

`.jsx` または `.js` ファイルでメールテンプレートを作成します：

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>当社のウェブサイトを訪問する</Button>
    </Html>
  );
}
```

この例では、**[Nodemailer](https://github.com/nodemailer/nodemailer)** ライブラリとその公式スポンサー **[Forward Email](https://forwardemail.net)** を使用して、送信メールの送信とプレビューを行います。

送信メールを送るには <strong class="text-success"><i class="fa fa-key"></i> パスワードを生成</strong> する必要があります – ぜひ当社の **[カスタムドメインSMTPでメールを送信するガイド](/guides/send-email-with-custom-domain-smtp)** に従ってください。

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
    // TODO: 以下の `user` と `pass` の値を置き換えてください:
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

アプリを実行してメールを送信します：

```sh
node app
```

これで **[マイアカウント → メール](/my-account/emails)** にアクセスして、リアルタイムのメール配信状況、メール配信ログ、HTML/プレーンテキスト/添付ファイルのプレビューを確認できます。

> P.S. :tada: また、**[ブラウザやiOSシミュレーターでメールをプレビューする](/docs/test-preview-email-rendering-browsers-ios-simulator)** や **[Node.jsでメールテンプレートを作成する](/docs/send-emails-with-node-js-javascript)** こともできます。
