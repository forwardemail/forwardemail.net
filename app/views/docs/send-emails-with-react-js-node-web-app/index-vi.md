# Gửi Email với Ví dụ Ứng dụng Web React.js Node {#send-emails-with-reactjs-node-web-app-example}


## Mục Lục {#table-of-contents}

* [Cài đặt và Yêu cầu](#install-and-requirements)
* [Mã Nguồn và Ví dụ](#source-code-and-example)


## Cài đặt và Yêu cầu {#install-and-requirements}

Bạn sẽ cần cài đặt các phụ thuộc npm `@react-email/render` và `nodemailer`:

```sh
npm install @react-email/render nodemailer
```


## Mã Nguồn và Ví dụ {#source-code-and-example}

Tạo mẫu email của bạn với một file `.jsx` hoặc `.js`:

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Truy cập trang web của chúng tôi</Button>
    </Html>
  );
}
```

Trong ví dụ này, chúng tôi sử dụng thư viện **[Nodemailer](https://github.com/nodemailer/nodemailer)** và nhà tài trợ chính thức của nó **[Forward Email](https://forwardemail.net)** để gửi và xem trước thư gửi đi.

Bạn sẽ cần <strong class="text-success"><i class="fa fa-key"></i> Tạo Mật Khẩu</strong> để gửi thư đi – vui lòng làm theo hướng dẫn **[Gửi Email với SMTP Tên Miền Tùy Chỉnh](/guides/send-email-with-custom-domain-smtp)** của chúng tôi.

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
    // TODO: thay thế giá trị `user` và `pass` từ:
    // <https://forwardemail.net/guides/send-email-with-custom-domain-smtp>
    user: 'you@example.com',
    pass: '****************************'
  },
});

const html = render(Email({ url: "https://example.com" }));

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'xin chào thế giới',
  html
};

transporter.sendMail(options);
```

Chạy ứng dụng để gửi email:

```sh
node app
```

Bây giờ bạn có thể truy cập **[Tài Khoản Của Tôi → Email](/my-account/emails)** để xem trạng thái gửi email theo thời gian thực, nhật ký khả năng gửi email, và xem trước HTML/văn bản thuần/đính kèm.

> P.S. :tada: Bạn cũng có thể **[xem trước email trên trình duyệt và iOS Simulator](/docs/test-preview-email-rendering-browsers-ios-simulator)** và **[tạo mẫu email với Node.js](/docs/send-emails-with-node-js-javascript)**.
