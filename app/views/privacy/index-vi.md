# Chính sách bảo mật {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## Mục lục {#table-of-contents}

* [Tuyên bố miễn trừ trách nhiệm](#disclaimer)
* [Thông tin không được thu thập](#information-not-collected)
* [Thông tin được thu thập](#information-collected)
* [Thông tin được chia sẻ](#information-shared)
* [Xóa thông tin](#information-removal)
* [Tiết lộ bổ sung](#additional-disclosures)

## Tuyên bố miễn trừ trách nhiệm {#disclaimer}

Vui lòng tuân theo [Điều khoản](/terms) của chúng tôi vì nó áp dụng cho toàn bộ trang web.

## Thông tin không được thu thập {#information-not-collected}

**Ngoại trừ [lỗi](/faq#do-you-store-error-logs), [email SMTP gửi đi](/faq#do-you-support-sending-email-with-smtp) và/hoặc khi phát hiện hoạt động spam hoặc độc hại (ví dụ: để giới hạn tốc độ):**

* Chúng tôi không lưu trữ bất kỳ email nào được chuyển tiếp vào bộ nhớ đĩa hoặc cơ sở dữ liệu.
* Chúng tôi không lưu trữ bất kỳ siêu dữ liệu nào về email vào bộ nhớ đĩa hoặc cơ sở dữ liệu.
* Chúng tôi không lưu trữ bất kỳ nhật ký hoặc địa chỉ IP nào vào bộ nhớ đĩa hoặc cơ sở dữ liệu.

## Thông tin được thu thập {#information-collected}

Để đảm bảo tính minh bạch, bất cứ lúc nào bạn cũng có thể <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">xem mã nguồn của chúng tôi</a> để biết thông tin bên dưới được thu thập và sử dụng như thế nào:

**Chỉ để đảm bảo chức năng và cải thiện dịch vụ, chúng tôi thu thập và lưu trữ an toàn những thông tin sau:**

* Chúng tôi lưu trữ email và thông tin lịch trong [cơ sở dữ liệu SQLite được mã hóa](/blog/docs/best-quantum-safe-encrypted-email-service) của bạn chỉ dành cho chức năng truy cập IMAP/POP3/CalDAV/CardDAV và hộp thư của bạn.
* Lưu ý rằng nếu bạn chỉ sử dụng dịch vụ chuyển tiếp email của chúng tôi, thì sẽ không có email nào được lưu trữ trên đĩa hoặc cơ sở dữ liệu như được mô tả trong [Thông tin không được thu thập](#information-not-collected).
* Dịch vụ chuyển tiếp email của chúng tôi chỉ hoạt động trong bộ nhớ (không ghi vào bộ nhớ đĩa hoặc cơ sở dữ liệu).
* Bộ nhớ IMAP/POP3/CalDAV/CardDAV được mã hóa khi lưu trữ, mã hóa khi truyền tải và được lưu trữ trên đĩa được mã hóa LUKS.
* Các bản sao lưu cho bộ nhớ IMAP/POP3/CalDAV/CardDAV của bạn được mã hóa khi lưu trữ, mã hóa khi truyền tải và được lưu trữ trên [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).
* Chúng tôi lưu trữ cookie trong một phiên cho lưu lượng truy cập trang web của bạn.
* Chúng tôi lưu trữ địa chỉ email mà bạn cung cấp cho chúng tôi.
* Chúng tôi lưu trữ tên miền, bí danh và cấu hình mà bạn cung cấp cho chúng tôi.
* Chúng tôi lưu trữ mã phản hồi SMTP `4xx` và `5xx` [nhật ký lỗi](/faq#do-you-store-error-logs) trong 7 ngày.
* Chúng tôi lưu trữ [email SMTP gửi đi](/faq#do-you-support-sending-email-with-smtp) trong khoảng 30 ngày.
* Độ dài này thay đổi tùy theo tiêu đề "Ngày"; vì chúng tôi cho phép gửi email trong tương lai nếu tiêu đề "Ngày" trong tương lai tồn tại.
* **Lưu ý rằng sau khi email được gửi thành công hoặc lỗi vĩnh viễn, chúng tôi sẽ biên tập và xóa nội dung thư.**
* Nếu bạn muốn cấu hình nội dung email SMTP gửi đi của mình được lưu trữ lâu hơn mặc định là 0 ngày (sau khi gửi thành công hoặc lỗi vĩnh viễn), hãy vào Cài đặt Nâng cao cho tên miền của bạn và nhập giá trị từ `0` đến `30`.
* Một số người dùng thích sử dụng tính năng xem trước [Tài khoản của tôi > Email](/my-account/emails) để xem email của họ được hiển thị như thế nào, do đó chúng tôi hỗ trợ thời gian lưu trữ có thể cấu hình.
* Lưu ý rằng chúng tôi cũng hỗ trợ __PROTECTED_LINK_30__0.
* Bất kỳ thông tin bổ sung nào bạn tự nguyện cung cấp cho chúng tôi, chẳng hạn như nhận xét hoặc câu hỏi được gửi đến chúng tôi qua email hoặc trên trang <a href="/help">trợ giúp</a> của chúng tôi.

## Thông tin được chia sẻ {#information-shared}

Chúng tôi không chia sẻ thông tin của bạn với bất kỳ bên thứ ba nào. Chúng tôi cũng không sử dụng bất kỳ dịch vụ phần mềm phân tích hoặc đo từ xa nào của bên thứ ba.

Chúng tôi có thể cần và sẽ tuân thủ các yêu cầu pháp lý theo lệnh của tòa án (nhưng hãy ghi nhớ [chúng tôi không thu thập thông tin được đề cập ở trên trong mục "Thông tin không được thu thập"](#information-not-collected), vì vậy chúng tôi sẽ không thể cung cấp ngay từ đầu).

## Xóa thông tin {#information-removal}

Nếu bất kỳ lúc nào bạn muốn xóa thông tin đã cung cấp cho chúng tôi, hãy vào <a href="/my-account/security">Tài khoản của tôi > Bảo mật</a> và nhấp vào "Xóa tài khoản".

Để ngăn ngừa và giảm thiểu tình trạng lạm dụng, tài khoản của bạn có thể cần được quản trị viên của chúng tôi xem xét xóa thủ công nếu bạn xóa tài khoản trong vòng 5 ngày kể từ lần thanh toán đầu tiên.

Quá trình này thường mất chưa đầy 24 giờ và được triển khai do người dùng gửi thư rác với dịch vụ của chúng tôi, sau đó nhanh chóng xóa tài khoản của họ – điều này ngăn chúng tôi chặn dấu vân tay phương thức thanh toán của họ trong Stripe.

## Thông tin bổ sung {#additional-disclosures}

Trang web này được bảo vệ bởi Cloudflare và [Chính sách bảo mật](https://www.cloudflare.com/privacypolicy/) và [Điều khoản dịch vụ](https://www.cloudflare.com/website-terms/) được áp dụng.