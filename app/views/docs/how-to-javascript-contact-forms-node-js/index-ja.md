# JavaScript 連絡フォーム Node.js コード例 {#javascript-contact-forms-nodejs-code-example}


## 目次 {#table-of-contents}

* [インストールと要件](#install-and-requirements)
* [ソースコードと例](#source-code-and-example)


## インストールと要件 {#install-and-requirements}

`nodemailer` npm 依存関係をインストールする必要があります:

```sh
npm install nodemailer
```


## ソースコードと例 {#source-code-and-example}

この例では、**[Nodemailer](https://github.com/nodemailer/nodemailer)** ライブラリとその公式スポンサー **[Forward Email](https://forwardemail.net)** を使用して、送信メールの送信とプレビューを行います。

送信メールを送るには <strong class="text-success"><i class="fa fa-key"></i> パスワードを生成</strong> する必要があります – ぜひ当社の **[カスタムドメイン SMTP でメールを送信するガイド](/guides/send-email-with-custom-domain-smtp)** に従ってください。

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

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

await transporter.sendMail({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<h1>hello world</h1>'
});
```

アプリを実行してメールを送信します:

```sh
node app
```

次に、**[マイアカウント → メール](/my-account/emails)** にアクセスして、リアルタイムのメール配信状況、メール配信ログ、HTML/プレーンテキスト/添付ファイルのプレビューを確認できます。

> P.S. :tada: また、**[ブラウザや iOS シミュレーターでメールをプレビュー](/docs/test-preview-email-rendering-browsers-ios-simulator)** したり、**[Node.js でメールテンプレートを作成](/docs/send-emails-with-node-js-javascript)** したりすることもできます。
