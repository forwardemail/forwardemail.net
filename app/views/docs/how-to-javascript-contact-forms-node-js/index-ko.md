# JavaScript 연락처 양식 Node.js 코드 예제 {#javascript-contact-forms-nodejs-code-example}


## 목차 {#table-of-contents}

* [설치 및 요구사항](#install-and-requirements)
* [소스 코드 및 예제](#source-code-and-example)


## 설치 및 요구사항 {#install-and-requirements}

`nodemailer` npm 의존성을 설치해야 합니다:

```sh
npm install nodemailer
```


## 소스 코드 및 예제 {#source-code-and-example}

이 예제는 **[Nodemailer](https://github.com/nodemailer/nodemailer)** 라이브러리와 공식 후원사 **[Forward Email](https://forwardemail.net)** 를 사용하여 발신 메일을 보내고 미리 봅니다.

발신 메일을 보내려면 <strong class="text-success"><i class="fa fa-key"></i> 비밀번호 생성</strong>이 필요합니다 – 저희 **[사용자 지정 도메인 SMTP로 이메일 보내기 가이드](/guides/send-email-with-custom-domain-smtp)** 를 따라주세요.

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

앱을 실행하여 이메일을 보내세요:

```sh
node app
```

이제 **[내 계정 → 이메일](/my-account/emails)** 에서 실시간 이메일 전송 상태, 이메일 전달 로그, HTML/텍스트/첨부파일 미리보기를 확인할 수 있습니다.

> P.S. :tada: 또한 **[브라우저 및 iOS 시뮬레이터에서 이메일 미리보기](/docs/test-preview-email-rendering-browsers-ios-simulator)** 와 **[Node.js로 이메일 템플릿 만들기](/docs/send-emails-with-node-js-javascript)** 가 가능합니다.
