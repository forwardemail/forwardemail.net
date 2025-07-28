# Ví dụ về mã Node.js cho biểu mẫu liên hệ JavaScript {#javascript-contact-forms-nodejs-code-example}

## Mục lục {#table-of-contents}

* [Cài đặt và Yêu cầu](#install-and-requirements)
* [Mã nguồn và ví dụ](#source-code-and-example)

## Cài đặt và Yêu cầu {#install-and-requirements}

Bạn sẽ cần cài đặt `nodemailer` npm dependency:

```sh
npm install nodemailer
```

## Mã nguồn và ví dụ {#source-code-and-example}

Ví dụ này sử dụng thư viện **[Nodemailer](https://github.com/nodemailer/nodemailer)** và nhà tài trợ chính thức của nó là **[Chuyển tiếp Email](https://forwardemail.net)** để gửi và xem trước thư đi.

Bạn sẽ cần <strong class="text-success"><i class="fa fa-key"></i> Tạo mật khẩu</strong> để gửi thư đi – vui lòng làm theo **[Hướng dẫn Gửi Email với SMTP Tên miền Tùy chỉnh](/guides/send-email-with-custom-domain-smtp)** của chúng tôi.

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

Chạy ứng dụng để gửi email:

```sh
node app
```

Bây giờ bạn có thể truy cập **[Tài khoản của tôi → Email](/my-account/emails)** để xem trạng thái gửi email theo thời gian thực, nhật ký khả năng gửi email và bản xem trước HTML/văn bản thuần túy/tệp đính kèm.

> P.S. :tada: Bạn cũng có thể **[xem trước email trong trình duyệt và Trình mô phỏng iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** và **[tạo mẫu email bằng Node.js](/docs/send-emails-with-node-js-javascript)**.