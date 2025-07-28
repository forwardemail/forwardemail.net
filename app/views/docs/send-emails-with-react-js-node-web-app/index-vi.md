# Gửi email bằng ví dụ ứng dụng web React.js Node {#send-emails-with-reactjs-node-web-app-example}

## Mục lục {#table-of-contents}

* [Cài đặt và yêu cầu](#install-and-requirements)
* [Mã nguồn và ví dụ](#source-code-and-example)

## Cài đặt và Yêu cầu {#install-and-requirements}

Bạn sẽ cần cài đặt các phụ thuộc npm `@react-email/render` và `nodemailer`:

```sh
npm install @react-email/render nodemailer
```

## Mã nguồn và Ví dụ {#source-code-and-example}

Tạo mẫu email của bạn bằng tệp `.jsx` hoặc `.js`:

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

Trong ví dụ này, chúng tôi sử dụng thư viện **[Người gửi thư nút](https://github.com/nodemailer/nodemailer)** và nhà tài trợ chính thức của nó là **[Chuyển tiếp Email](https://forwardemail.net)** để gửi và xem trước thư đi.

Bạn sẽ cần <strong class="text-success"><i class="fa fa-key"></i> Tạo mật khẩu</strong> để gửi thư đi – vui lòng làm theo **[Gửi Email với Hướng dẫn SMTP tên miền tùy chỉnh](/guides/send-email-with-custom-domain-smtp)** của chúng tôi.

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

Chạy ứng dụng để gửi email:

```sh
node app
```

Bây giờ bạn có thể truy cập **[Tài khoản của tôi → Email](/my-account/emails)** để xem trạng thái gửi email theo thời gian thực, nhật ký khả năng gửi email và bản xem trước HTML/văn bản thuần túy/tệp đính kèm.

> P.S. :tada: Bạn cũng có thể **[xem trước email trong trình duyệt và iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** và **[tạo mẫu email bằng Node.js](/docs/send-emails-with-node-js-javascript)**.