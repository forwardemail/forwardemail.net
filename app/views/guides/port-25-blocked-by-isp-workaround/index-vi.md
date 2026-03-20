# Giải pháp khi ISP chặn cổng 25 {#port-25-blocked-by-isp-workaround}


## Mục lục {#table-of-contents}

* [Cách giải quyết khi ISP chặn SMTP đến trên cổng 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Cách giải quyết khi ISP chặn SMTP đi trên cổng 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Làm sao để kiểm tra ISP có chặn cổng không](#how-can-i-check-if-my-isp-blocks-ports)


## Cách giải quyết khi ISP chặn SMTP đến trên cổng 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Nếu bạn không mở được cổng 25 trên địa chỉ IP của máy chủ mail, thì hướng dẫn này dành cho bạn.

Ví dụ, bạn đang chạy một máy chủ mail tùy chỉnh tại nhà, và Nhà cung cấp dịch vụ Internet ("ISP") của bạn đã chặn cổng 25 đi ra ngoài.

Vì bạn không thể có lưu lượng đi ra ngoài trên cổng 25, thì rất có thể bạn cũng sẽ không có lưu lượng đến trên cổng 25 do bị chặn này.

Giả sử bạn đang sử dụng dịch vụ của chúng tôi để chuyển tiếp email, [bạn có thể giải quyết vấn đề này qua câu trả lời trong phần Câu hỏi thường gặp của chúng tôi ở đây](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Cách giải quyết khi ISP chặn SMTP đi trên cổng 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Nếu ISP của bạn chặn cổng 25 đi ra ngoài, thì bạn sẽ phải tìm giải pháp thay thế hoặc liên hệ với họ.


## Làm sao để kiểm tra ISP có chặn cổng không {#how-can-i-check-if-my-isp-blocks-ports}

Bạn có thể chạy `telnet smtp.forwardemail.net 25` từ dòng lệnh hoặc terminal để xem kết nối cổng 25 đi ra ngoài của bạn có bị chặn hay không.
