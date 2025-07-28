# Cổng 25 bị chặn bởi giải pháp thay thế của ISP {#port-25-blocked-by-isp-workaround}

## Mục lục {#table-of-contents}

* [Cách khắc phục sự cố ISP chặn SMTP đến trên cổng 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Cách khắc phục sự cố ISP chặn SMTP gửi đi trên cổng 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Làm thế nào tôi có thể kiểm tra xem ISP của tôi có chặn cổng không](#how-can-i-check-if-my-isp-blocks-ports)

## Cách khắc phục sự cố ISP chặn SMTP đến trên cổng 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Nếu bạn không mở cổng 25 trên địa chỉ IP của máy chủ thư thì hướng dẫn này là dành cho bạn.

Ví dụ, bạn đang chạy một máy chủ thư tùy chỉnh tại nhà và Nhà cung cấp dịch vụ Internet ("ISP") của bạn đã chặn cổng đi 25.

Vì bạn không thể có lưu lượng truy cập đi trên cổng 25, nên rất có thể bạn cũng sẽ không có lưu lượng truy cập đến trên cổng 25 do lệnh chặn này.

Giả sử bạn đang sử dụng dịch vụ của chúng tôi để chuyển tiếp email, [bạn có thể giải quyết vấn đề này thông qua câu trả lời FAQ của chúng tôi tại đây](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Cách khắc phục sự cố ISP chặn SMTP đi trên cổng 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Nếu ISP của bạn chặn cổng ra 25, thì bạn sẽ phải tìm giải pháp thay thế hoặc liên hệ với họ.

## Làm thế nào để tôi có thể kiểm tra xem ISP của tôi có chặn các cổng {#how-can-i-check-if-my-isp-blocks-ports} không

Bạn có thể chạy `telnet smtp.forwardemail.net 25` từ dòng lệnh hoặc thiết bị đầu cuối để xem kết nối cổng 25 đi của bạn có bị chặn không.