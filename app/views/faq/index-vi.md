# Câu hỏi thường gặp {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Mục lục {#table-of-contents}

* [Bắt đầu nhanh](#quick-start)
* [Giới thiệu](#introduction)
  * [Email chuyển tiếp là gì](#what-is-forward-email)
  * [Ai sử dụng Email chuyển tiếp](#who-uses-forward-email)
  * [Lịch sử của Forward Email là gì](#what-is-forward-emails-history)
  * [Dịch vụ này nhanh như thế nào](#how-fast-is-this-service)
* [Khách hàng Email](#email-clients)
  * [Chim Sấm Sét](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Thiết bị di động](#mobile-devices)
  * [Cách gửi thư bằng Gmail](#how-to-send-mail-as-using-gmail)
  * [Hướng dẫn miễn phí cho tính năng Gửi thư dưới dạng sử dụng Gmail là gì?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Cấu hình định tuyến Gmail nâng cao](#advanced-gmail-routing-configuration)
  * [Cấu hình định tuyến Outlook nâng cao](#advanced-outlook-routing-configuration)
* [Xử lý sự cố](#troubleshooting)
  * [Tại sao tôi không nhận được email thử nghiệm của mình?](#why-am-i-not-receiving-my-test-emails)
  * [Làm thế nào để cấu hình máy khách email của tôi hoạt động với Forward Email?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Tại sao email của tôi lại rơi vào mục Spam và Junk và làm thế nào tôi có thể kiểm tra uy tín tên miền của mình?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Tôi nên làm gì nếu tôi nhận được email rác](#what-should-i-do-if-i-receive-spam-emails)
  * [Tại sao các email thử nghiệm tôi gửi cho chính mình trong Gmail lại hiển thị là "đáng ngờ"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Tôi có thể xóa via forwardemail dot net trong Gmail không?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Quản lý dữ liệu](#data-management)
  * [Máy chủ của bạn được đặt ở đâu](#where-are-your-servers-located)
  * [Làm thế nào để xuất và sao lưu hộp thư của tôi](#how-do-i-export-and-backup-my-mailbox)
  * [Làm thế nào để nhập và di chuyển hộp thư hiện tại của tôi](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Bạn có hỗ trợ tự lưu trữ không?](#do-you-support-self-hosting)
* [Cấu hình Email](#email-configuration)
  * [Làm thế nào để tôi bắt đầu và thiết lập chuyển tiếp email](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Tôi có thể sử dụng nhiều máy chủ và trao đổi MX để chuyển tiếp nâng cao không?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Làm thế nào để thiết lập chế độ trả lời tự động khi không có mặt tại văn phòng?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Làm thế nào để thiết lập SPF cho Email chuyển tiếp](#how-do-i-set-up-spf-for-forward-email)
  * [Làm thế nào để thiết lập DKIM cho Email chuyển tiếp](#how-do-i-set-up-dkim-for-forward-email)
  * [Làm thế nào để thiết lập DMARC cho Chuyển tiếp Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Làm thế nào để kết nối và cấu hình danh bạ của tôi](#how-do-i-connect-and-configure-my-contacts)
  * [Làm thế nào để kết nối và cấu hình lịch của tôi](#how-do-i-connect-and-configure-my-calendars)
  * [Làm thế nào để thêm nhiều lịch hơn và quản lý các lịch hiện có](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Làm thế nào để thiết lập SRS cho Email chuyển tiếp](#how-do-i-set-up-srs-for-forward-email)
  * [Làm thế nào để thiết lập MTA-STS cho Email chuyển tiếp](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Làm thế nào để thêm ảnh đại diện vào địa chỉ email của tôi](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Tính năng nâng cao](#advanced-features)
  * [Bạn có hỗ trợ bản tin hoặc danh sách gửi thư cho email liên quan đến tiếp thị không?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Bạn có hỗ trợ gửi email bằng API không?](#do-you-support-sending-email-with-api)
  * [Bạn có hỗ trợ nhận email bằng IMAP không?](#do-you-support-receiving-email-with-imap)
  * [Bạn có hỗ trợ POP3 không?](#do-you-support-pop3)
  * [Bạn có hỗ trợ lịch (CalDAV) không?](#do-you-support-calendars-caldav)
  * [Bạn có hỗ trợ danh bạ (CardDAV) không?](#do-you-support-contacts-carddav)
  * [Bạn có hỗ trợ gửi email bằng SMTP không?](#do-you-support-sending-email-with-smtp)
  * [Bạn có hỗ trợ OpenPGP/MIME, mã hóa đầu cuối ("E2EE") và Thư mục khóa web ("WKD") không?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Bạn có hỗ trợ MTA-STS không?](#do-you-support-mta-sts)
  * [Bạn có hỗ trợ passkey và WebAuthn không?](#do-you-support-passkeys-and-webauthn)
  * [Bạn có hỗ trợ các biện pháp tốt nhất về email không?](#do-you-support-email-best-practices)
  * [Bạn có hỗ trợ webhooks trả lại không?](#do-you-support-bounce-webhooks)
  * [Bạn có hỗ trợ webhooks không?](#do-you-support-webhooks)
  * [Bạn có hỗ trợ biểu thức chính quy hoặc regex không?](#do-you-support-regular-expressions-or-regex)
  * [Giới hạn SMTP gửi đi của bạn là bao nhiêu?](#what-are-your-outbound-smtp-limits)
  * [Tôi có cần sự chấp thuận để kích hoạt SMTP không?](#do-i-need-approval-to-enable-smtp)
  * [Cài đặt cấu hình máy chủ SMTP của bạn là gì?](#what-are-your-smtp-server-configuration-settings)
  * [Cài đặt cấu hình máy chủ IMAP của bạn là gì?](#what-are-your-imap-server-configuration-settings)
  * [Cài đặt cấu hình máy chủ POP3 của bạn là gì?](#what-are-your-pop3-server-configuration-settings)
  * [Cấu hình chuyển tiếp SMTP Postfix](#postfix-smtp-relay-configuration)
* [Bảo vệ](#security)
  * [Kỹ thuật tăng cường bảo mật máy chủ nâng cao](#advanced-server-hardening-techniques)
  * [Bạn có chứng chỉ SOC 2 hoặc ISO 27001 không?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Bạn có sử dụng mã hóa TLS để chuyển tiếp email không?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Bạn có lưu giữ tiêu đề xác thực email không?](#do-you-preserve-email-authentication-headers)
  * [Bạn có giữ nguyên tiêu đề email gốc và ngăn chặn giả mạo không?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Làm thế nào để bạn bảo vệ chống lại thư rác và lạm dụng](#how-do-you-protect-against-spam-and-abuse)
  * [Bạn có lưu trữ nội dung email trên đĩa không?](#do-you-store-email-content-on-disk)
  * [Nội dung email có thể bị lộ khi hệ thống gặp sự cố không?](#can-email-content-be-exposed-during-system-crashes)
  * [Ai có quyền truy cập vào cơ sở hạ tầng email của bạn](#who-has-access-to-your-email-infrastructure)
  * [Bạn sử dụng nhà cung cấp cơ sở hạ tầng nào?](#what-infrastructure-providers-do-you-use)
  * [Bạn có cung cấp Thỏa thuận xử lý dữ liệu (DPA) không?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Bạn xử lý thông báo vi phạm dữ liệu như thế nào](#how-do-you-handle-data-breach-notifications)
  * [Bạn có cung cấp môi trường thử nghiệm không?](#do-you-offer-a-test-environment)
  * [Bạn có cung cấp công cụ giám sát và cảnh báo không?](#do-you-provide-monitoring-and-alerting-tools)
  * [Làm thế nào để bạn đảm bảo tính khả dụng cao](#how-do-you-ensure-high-availability)
  * [Bạn có tuân thủ Mục 889 của Đạo luật Ủy quyền Quốc phòng Quốc gia (NDAA) không?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Hệ thống và Chi tiết Kỹ thuật](#system-and-technical-details)
  * [Bạn có lưu trữ email và nội dung của chúng không?](#do-you-store-emails-and-their-contents)
  * [Hệ thống chuyển tiếp email của bạn hoạt động như thế nào](#how-does-your-email-forwarding-system-work)
  * [Bạn xử lý email để chuyển tiếp như thế nào?](#how-do-you-process-an-email-for-forwarding)
  * [Bạn xử lý các vấn đề gửi email như thế nào?](#how-do-you-handle-email-delivery-issues)
  * [Bạn xử lý thế nào khi địa chỉ IP của bạn bị chặn?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Địa chỉ bưu điện là gì](#what-are-postmaster-addresses)
  * [Địa chỉ không trả lời là gì](#what-are-no-reply-addresses)
  * [Địa chỉ IP của máy chủ của bạn là gì?](#what-are-your-servers-ip-addresses)
  * [Bạn có danh sách cho phép không?](#do-you-have-an-allowlist)
  * [Những phần mở rộng tên miền nào được cho phép theo mặc định](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Tiêu chí danh sách cho phép của bạn là gì?](#what-is-your-allowlist-criteria)
  * [Những phần mở rộng tên miền nào có thể được sử dụng miễn phí?](#what-domain-name-extensions-can-be-used-for-free)
  * [Bạn có danh sách xám không?](#do-you-have-a-greylist)
  * [Bạn có danh sách từ chối không?](#do-you-have-a-denylist)
  * [Bạn có giới hạn tỷ lệ không?](#do-you-have-rate-limiting)
  * [Làm thế nào để bảo vệ chống lại sự tán xạ ngược](#how-do-you-protect-against-backscatter)
  * [Ngăn chặn thư trả lại từ những người gửi thư rác đã biết](#prevent-bounces-from-known-mail-from-spammers)
  * [Ngăn chặn sự phản xạ không cần thiết để bảo vệ chống lại sự tán xạ ngược](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Làm thế nào để xác định dấu vân tay email](#how-do-you-determine-an-email-fingerprint)
  * [Tôi có thể chuyển tiếp email đến các cổng khác ngoài 25 không (ví dụ: nếu ISP của tôi đã chặn cổng 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Nó có hỗ trợ biểu tượng dấu cộng + cho bí danh Gmail không?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Nó có hỗ trợ tên miền phụ không?](#does-it-support-sub-domains)
  * [Điều này có chuyển tiếp tiêu đề email của tôi không?](#does-this-forward-my-emails-headers)
  * [Điều này đã được kiểm tra kỹ lưỡng chưa?](#is-this-well-tested)
  * [Bạn có chuyển tiếp các thông báo và mã phản hồi SMTP không?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Làm thế nào để ngăn chặn những kẻ gửi thư rác và đảm bảo uy tín chuyển tiếp email tốt?](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Làm thế nào để thực hiện tra cứu DNS trên tên miền](#how-do-you-perform-dns-lookups-on-domain-names)
* [Tài khoản và Thanh toán](#account-and-billing)
  * [Bạn có cung cấp bảo đảm hoàn lại tiền cho các gói trả phí không?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Nếu tôi chuyển đổi kế hoạch, bạn có tính tỷ lệ và hoàn lại phần chênh lệch không?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Tôi có thể sử dụng dịch vụ chuyển tiếp email này như một máy chủ MX "dự phòng" hoặc "thay thế" không?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Tôi có thể vô hiệu hóa các bí danh cụ thể không?](#can-i-disable-specific-aliases)
  * [Tôi có thể chuyển tiếp email cho nhiều người nhận không?](#can-i-forward-emails-to-multiple-recipients)
  * [Tôi có thể có nhiều người nhận toàn cầu không?](#can-i-have-multiple-global-catch-all-recipients)
  * [Có giới hạn tối đa về số lượng địa chỉ email tôi có thể chuyển tiếp đến cho mỗi bí danh không?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Tôi có thể chuyển tiếp email theo cách đệ quy không?](#can-i-recursively-forward-emails)
  * [Mọi người có thể hủy đăng ký hoặc đăng ký chuyển tiếp email của tôi mà không cần sự cho phép của tôi không?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Nó miễn phí như thế nào?](#how-is-it-free)
  * [Kích thước email tối đa giới hạn là bao nhiêu?](#what-is-the-max-email-size-limit)
  * [Bạn có lưu trữ nhật ký email không?](#do-you-store-logs-of-emails)
  * [Bạn có lưu trữ nhật ký lỗi không?](#do-you-store-error-logs)
  * [Bạn có đọc email của tôi không?](#do-you-read-my-emails)
  * [Tôi có thể "gửi thư dưới dạng" trong Gmail bằng cách này không?](#can-i-send-mail-as-in-gmail-with-this)
  * [Tôi có thể "gửi thư dưới dạng" trong Outlook bằng cách này không?](#can-i-send-mail-as-in-outlook-with-this)
  * [Tôi có thể "gửi thư dưới dạng" trong Apple Mail và iCloud Mail bằng cách này không?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Tôi có thể chuyển tiếp email không giới hạn bằng cách này không?](#can-i-forward-unlimited-emails-with-this)
  * [Bạn có cung cấp tên miền không giới hạn với một mức giá không?](#do-you-offer-unlimited-domains-for-one-price)
  * [Bạn chấp nhận những phương thức thanh toán nào?](#which-payment-methods-do-you-accept)
* [Tài nguyên bổ sung](#additional-resources)

## Khởi động nhanh {#quick-start}

Để bắt đầu sử dụng Forward Email:

1. **Tạo tài khoản** tại [forwardemail.net/register](https://forwardemail.net/register)

2. **Thêm và xác minh tên miền của bạn** tại [Tài khoản của tôi → Tên miền](/my-account/domains)

3. **Thêm và cấu hình bí danh email/hộp thư** trong [Tài khoản của tôi → Tên miền](/my-account/domains) → Bí danh

4. **Kiểm tra thiết lập** của bạn bằng cách gửi email đến một trong những bí danh mới của bạn

> \[!TIP]
> Việc thay đổi DNS có thể mất tới 24-48 giờ để lan truyền trên toàn cầu, mặc dù chúng thường có hiệu lực sớm hơn nhiều.

> \[!IMPORTANT]
> Để tăng khả năng phân phối, chúng tôi khuyên bạn nên thiết lập các bản ghi [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) và [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

## Giới thiệu {#introduction}

### Email chuyển tiếp là gì {#what-is-forward-email}

> \[!NOTE]
> Forward Email là lựa chọn hoàn hảo cho cá nhân, doanh nghiệp nhỏ và nhà phát triển muốn có địa chỉ email chuyên nghiệp mà không phải tốn kém và chi phí bảo trì như giải pháp lưu trữ email đầy đủ.

Forward Email là **nhà cung cấp dịch vụ email đầy đủ tính năng** và **nhà cung cấp dịch vụ lưu trữ email cho tên miền tùy chỉnh**.

Đây là dịch vụ mã nguồn mở và miễn phí duy nhất cho phép bạn sử dụng địa chỉ email tên miền tùy chỉnh mà không cần phải phức tạp trong việc thiết lập và duy trì máy chủ email của riêng mình.

Dịch vụ của chúng tôi chuyển tiếp email được gửi đến tên miền tùy chỉnh của bạn đến tài khoản email hiện tại của bạn – và bạn thậm chí có thể sử dụng chúng tôi làm nhà cung cấp dịch vụ lưu trữ email chuyên dụng.

Các tính năng chính của Forward Email:

* **Email tên miền tùy chỉnh**: Sử dụng địa chỉ email chuyên nghiệp với tên miền riêng của bạn
* **Gói miễn phí**: Chuyển tiếp email cơ bản miễn phí
* **Bảo mật nâng cao**: Chúng tôi không đọc email hoặc bán dữ liệu của bạn
* **Mã nguồn mở**: Toàn bộ cơ sở mã của chúng tôi có sẵn trên GitHub
* **Hỗ trợ SMTP, IMAP và POP3**: Khả năng gửi và nhận email đầy đủ
* **Mã hóa đầu cuối**: Hỗ trợ OpenPGP/MIME
* **Bí danh Catch-All tùy chỉnh**: Tạo bí danh email không giới hạn

Bạn có thể so sánh chúng tôi với hơn 56 nhà cung cấp dịch vụ email khác trên [trang So sánh Email của chúng tôi](/blog/best-email-service).

> \[!TIP]
> Tìm hiểu thêm về Chuyển tiếp Email bằng cách đọc [Sách trắng kỹ thuật](/technical-whitepaper.pdf) miễn phí của chúng tôi

### Ai sử dụng Email chuyển tiếp {#who-uses-forward-email}

Chúng tôi cung cấp dịch vụ lưu trữ email và chuyển tiếp email cho hơn 500.000 tên miền và những người dùng đáng chú ý sau:

| Khách hàng | Nghiên cứu điển hình |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Học viện Hải quân Hoa Kỳ | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Chính tắc | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Trò chơi Netflix |  |
| Quỹ Linux | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| Quỹ PHP |  |
| Đài phát thanh Fox News |  |
| Doanh số quảng cáo của Disney |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Miễn phí | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Đại học Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Đại học Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Đại học Washington | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Đại học Tufts | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Cao đẳng Swarthmore | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Chính phủ Nam Úc |  |
| Chính phủ Cộng hòa Dominica |  |
| Fly<span>.</span>io |  |
| Khách sạn RCD |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Lịch sử Email chuyển tiếp là gì {#what-is-forward-emails-history}

Bạn có thể tìm hiểu thêm về Chuyển tiếp Email trên [trang Giới thiệu của chúng tôi](/about).

### Dịch vụ này nhanh như thế nào {#how-fast-is-this-service}

> \[!NOTE]
> Hệ thống của chúng tôi được thiết kế để đạt được tốc độ và độ tin cậy, với nhiều máy chủ dự phòng để đảm bảo email của bạn được gửi nhanh chóng.

Chuyển tiếp Email gửi tin nhắn với độ trễ tối thiểu, thường chỉ trong vòng vài giây sau khi nhận được.

Chỉ số hiệu suất:

* **Thời gian giao hàng trung bình**: Dưới 5-10 giây từ khi nhận đến khi chuyển tiếp ([xem trang theo dõi Thời gian gửi thư đến "TTI" của chúng tôi](/tti))
* **Thời gian hoạt động**: Khả năng sử dụng dịch vụ trên 99,9%
* **Cơ sở hạ tầng toàn cầu**: Máy chủ được đặt ở vị trí chiến lược để tối ưu hóa định tuyến
* **Tự động mở rộng**: Hệ thống của chúng tôi mở rộng trong thời gian cao điểm email

Chúng tôi hoạt động theo thời gian thực, không giống như các nhà cung cấp khác phụ thuộc vào hàng đợi bị trì hoãn.

Chúng tôi không ghi vào đĩa hoặc lưu trữ nhật ký – với [ngoại lệ của lỗi](#do-you-store-error-logs) và [SMTP gửi đi](#do-you-support-sending-email-with-smtp) (xem [Chính sách bảo mật](/privacy) của chúng tôi).

Mọi thứ đều được thực hiện trong bộ nhớ và [mã nguồn của chúng tôi có trên GitHub](https://github.com/forwardemail).

## Máy khách Email {#email-clients}

### Thunderbird {#thunderbird}

1. Tạo bí danh mới và tạo mật khẩu trong bảng điều khiển Email Chuyển tiếp của bạn
2. Mở Thunderbird và vào **Chỉnh sửa → Cài đặt Tài khoản → Hành động Tài khoản → Thêm Tài khoản Thư**
3. Nhập tên, địa chỉ Email Chuyển tiếp và mật khẩu của bạn
4. Nhấp vào **Cấu hình thủ công** và nhập:
* Đến: IMAP, `imap.forwardemail.net`, cổng 993, SSL/TLS
* Đi: SMTP, `smtp.forwardemail.net`, cổng 587, STARTTLS
5. Nhấp vào **Hoàn tất**

### Microsoft Outlook {#microsoft-outlook}

1. Tạo bí danh mới và tạo mật khẩu trong bảng điều khiển Email Chuyển tiếp của bạn
2. Vào **Tệp → Thêm Tài khoản**
3. Nhập địa chỉ Email Chuyển tiếp của bạn và nhấp vào **Kết nối**
4. Chọn **Tùy chọn Nâng cao** và chọn **Để tôi thiết lập tài khoản theo cách thủ công**
5. Chọn **IMAP** và nhập:
* Đến: `imap.forwardemail.net`, cổng 993, SSL
* Đi: `smtp.forwardemail.net`, cổng 587, TLS
* Tên người dùng: Địa chỉ email đầy đủ của bạn
* Mật khẩu: Mật khẩu bạn đã tạo
6. Nhấp vào **Kết nối**

### Apple Mail {#apple-mail}

1. Tạo bí danh mới và tạo mật khẩu trong bảng điều khiển Email Chuyển tiếp của bạn
2. Vào **Thư → Tùy chọn → Tài khoản → +**
3. Chọn **Tài khoản Thư Khác**
4. Nhập tên, địa chỉ Email Chuyển tiếp và mật khẩu của bạn
5. Để thiết lập máy chủ, hãy nhập:
* Thư đến: `imap.forwardemail.net`
* Thư đi: `smtp.forwardemail.net`
* Tên người dùng: Địa chỉ email đầy đủ của bạn
* Mật khẩu: Mật khẩu bạn đã tạo
6. Nhấp vào **Đăng nhập**

### Thiết bị di động {#mobile-devices}

Đối với iOS:

1. Vào **Cài đặt → Thư → Tài khoản → Thêm tài khoản → Khác**
2. Nhấn **Thêm tài khoản Thư** và nhập thông tin của bạn
3. Đối với cài đặt máy chủ, hãy sử dụng cùng cài đặt IMAP và SMTP như trên

Đối với Android:

1. Vào **Cài đặt → Tài khoản → Thêm tài khoản → Cá nhân (IMAP)**
2. Nhập địa chỉ Email Chuyển tiếp và mật khẩu của bạn
3. Đối với cài đặt máy chủ, hãy sử dụng cùng cài đặt IMAP và SMTP như trên

### Cách gửi thư dưới dạng sử dụng Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Thời gian thiết lập ước tính:</strong>
<span>Dưới 10 phút</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Bắt đầu:
</strong>
<span>
Nếu bạn đã làm theo hướng dẫn ở trên trong mục <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Cách bắt đầu và thiết lập chuyển tiếp email</a>, bạn có thể tiếp tục đọc bên dưới.
</span>
</div>

<div id="gửi-thư-dưới-dạng-nội-dung">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Vui lòng đảm bảo bạn đã đọc <a href="/terms" class="alert-link" target="_blank">Điều khoản</a>, <a href="/privacy" class="alert-link" target="_blank">Chính sách Quyền riêng tư</a> và <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giới hạn SMTP gửi đi</a> của chúng tôi &ndash; việc sử dụng của bạn được coi là sự thừa nhận và đồng ý.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Nếu bạn là nhà phát triển, hãy tham khảo <a class="alert-link" href="/email-api#outbound-emails" target="_blank">tài liệu API email</a> của chúng tôi.
</span>
</div>

1. Vào <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Cài đặt <i class="fa fa-angle-right"></i> Cấu hình SMTP gửi đi và làm theo hướng dẫn thiết lập

2. Tạo bí danh mới cho tên miền của bạn trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ: <code><hello@example.com></code>)

3. Nhấp vào <strong class="text-success"><i class="fa fa-key"></i> Tạo Mật khẩu</strong> bên cạnh bí danh vừa tạo. Sao chép vào bảng tạm và lưu trữ an toàn mật khẩu đã tạo hiển thị trên màn hình.

4. Đi tới [Gmail](https://gmail.com) và bên dưới [Cài đặt <i class="fa fa-angle-right"></i> Tài khoản và Nhập <i class="fa fa-angle-right"></i> Gửi thư dưới dạng](https://mail.google.com/mail/u/0/#settings/accounts), nhấp vào "Thêm địa chỉ email khác"

5. Khi được nhắc nhập "Tên", hãy nhập tên mà bạn muốn email của mình được hiển thị là "Từ" (ví dụ: "Linus Torvalds").

6. Khi được nhắc nhập "Địa chỉ email", hãy nhập địa chỉ email đầy đủ của bí danh mà bạn đã tạo trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ: <code><hello@example.com></code>)

7. Bỏ chọn "Xử lý như một bí danh"

8. Nhấp vào "Bước tiếp theo" để tiếp tục

9. Khi được nhắc nhập "Máy chủ SMTP", hãy nhập <code>smtp.forwardemail.net</code> và giữ nguyên cổng là <code>587</code>

10. Khi được nhắc nhập "Tên người dùng", hãy nhập địa chỉ email đầy đủ của bí danh mà bạn đã tạo trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ: <code><hello@example.com></code>)

11. Khi được nhắc nhập "Mật khẩu", hãy dán mật khẩu từ <strong class="text-success"><i class="fa fa-key"></i> Tạo mật khẩu</strong> ở bước 3 ở trên

12. Giữ nguyên nút chọn "Kết nối an toàn sử dụng TLS"

13. Nhấp vào "Thêm tài khoản" để tiếp tục

14. Mở một tab mới đến [Gmail](https://gmail.com) và đợi email xác minh của bạn đến (bạn sẽ nhận được mã xác minh xác nhận bạn là chủ sở hữu của địa chỉ email mà bạn đang cố gắng "Gửi thư dưới dạng")

15. Khi nhận được mã, hãy sao chép và dán mã xác minh vào dấu nhắc bạn nhận được ở bước trước

16. Sau khi hoàn tất, hãy quay lại email và nhấp vào liên kết để "xác nhận yêu cầu". Rất có thể bạn sẽ cần thực hiện bước này và bước trước đó để email được cấu hình chính xác.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Xin chúc mừng!
</strong>
<span>
Bạn đã hoàn thành tất cả các bước.
</span>
</div>
</div>

</div>

### Hướng dẫn miễn phí cũ cho tính năng Gửi thư dưới dạng sử dụng Gmail là gì {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Quan trọng:</strong> Hướng dẫn miễn phí cũ này đã ngừng sử dụng kể từ tháng 5 năm 2023 vì <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we hiện đã hỗ trợ SMTP gửi đi</a>. Nếu bạn sử dụng hướng dẫn bên dưới, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this sẽ khiến email gửi đi của bạn</a> hiển thị "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" trong Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Thời gian thiết lập ước tính:</strong>
<span>Dưới 10 phút</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Bắt đầu:
</strong>
<span>
Nếu bạn đã làm theo hướng dẫn ở trên trong mục <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Cách bắt đầu và thiết lập chuyển tiếp email</a>, bạn có thể tiếp tục đọc bên dưới.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Cách gửi thư bằng Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Bạn cần bật [Xác thực hai yếu tố của Gmail][gmail-2fa] để tính năng này hoạt động. Truy cập <https://www.google.com/landing/2step/> nếu bạn chưa bật.

2. Sau khi Xác thực hai yếu tố được bật (hoặc nếu bạn đã bật), hãy truy cập <https://myaccount.google.com/apppasswords>.

3. Khi được nhắc "Chọn ứng dụng và thiết bị bạn muốn tạo mật khẩu ứng dụng":
* Chọn "Thư" trong danh sách thả xuống cho "Chọn ứng dụng"
* Chọn "Khác" trong danh sách thả xuống cho "Chọn thiết bị"
* Khi được nhắc nhập văn bản, hãy nhập địa chỉ email của tên miền tùy chỉnh mà bạn đang chuyển tiếp (ví dụ: <code><hello@example.com></code> - điều này sẽ giúp bạn theo dõi trong trường hợp bạn sử dụng dịch vụ này cho nhiều tài khoản)

4. Sao chép mật khẩu vào bảng tạm được tạo tự động.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Nếu bạn đang sử dụng G Suite, hãy truy cập bảng quản trị <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Ứng dụng <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Cài đặt cho Gmail <i class="fa fa-angle-right"></i> Cài đặt</a> và đảm bảo chọn "Cho phép người dùng gửi thư qua máy chủ SMTP bên ngoài...". Sẽ có một chút chậm trễ để thay đổi này được kích hoạt, vì vậy vui lòng đợi vài phút.
</span>
</div>

5. Đi tới [Gmail](https://gmail.com) và bên dưới [Cài đặt <i class="fa fa-angle-right"></i> Tài khoản và Nhập <i class="fa fa-angle-right"></i> Gửi thư dưới dạng](https://mail.google.com/mail/u/0/#settings/accounts), nhấp vào "Thêm địa chỉ email khác"

6. Khi được nhắc nhập "Tên", hãy nhập tên mà bạn muốn email của mình được hiển thị là "Từ" (ví dụ: "Linus Torvalds")

7. Khi được nhắc nhập "Địa chỉ email", hãy nhập địa chỉ email có tên miền tùy chỉnh mà bạn đã sử dụng ở trên (ví dụ: <code><hello@example.com></code>)

8. Bỏ chọn "Xử lý như một bí danh"

9. Nhấp vào "Bước tiếp theo" để tiếp tục

10. Khi được nhắc nhập "Máy chủ SMTP", hãy nhập <code>smtp.gmail.com</code> và giữ nguyên cổng là <code>587</code>

11. Khi được nhắc nhập "Tên người dùng", hãy nhập phần địa chỉ Gmail của bạn mà không có phần <span>gmail.com</span> (ví dụ: chỉ cần "user" nếu email của tôi là <span><user@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Nếu phần "Tên người dùng" được tự động điền, thì <u><strong>bạn sẽ cần thay đổi phần này</strong></u> thành phần tên người dùng trong địa chỉ Gmail của bạn.
</span>
</div>

12. Khi được nhắc nhập "Mật khẩu", hãy dán từ bảng tạm mật khẩu bạn đã tạo ở bước 2 ở trên

13. Giữ nguyên nút chọn "Kết nối an toàn sử dụng TLS"

14. Nhấp vào "Thêm tài khoản" để tiếp tục

15. Mở một tab mới đến [Gmail](https://gmail.com) và đợi email xác minh của bạn đến (bạn sẽ nhận được mã xác minh xác nhận bạn là chủ sở hữu của địa chỉ email mà bạn đang cố gắng "Gửi thư dưới dạng")

16. Khi nhận được mã, hãy sao chép và dán mã xác minh vào dấu nhắc bạn nhận được ở bước trước

17. Sau khi hoàn tất, hãy quay lại email và nhấp vào liên kết để "xác nhận yêu cầu". Rất có thể bạn sẽ cần thực hiện bước này và bước trước đó để email được cấu hình chính xác.

</div>

### Cấu hình định tuyến Gmail nâng cao {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Thời gian thiết lập ước tính:</strong>
<span>15-30 phút</span>
</div>

Nếu bạn muốn thiết lập định tuyến nâng cao trong Gmail để các bí danh không khớp với hộp thư sẽ chuyển tiếp đến hộp thư trao đổi của Forward Email, hãy làm theo các bước sau:

1. Đăng nhập vào bảng điều khiển Google Admin của bạn tại [admin.google.com](https://admin.google.com)
2. Vào **Ứng dụng → Google Workspace → Gmail → Định tuyến**
3. Nhấp vào **Thêm Tuyến đường** và cấu hình các thiết lập sau:

**Cài đặt cho người nhận đơn lẻ:**

* Chọn "Thay đổi người nhận trên phong bì" và nhập địa chỉ Gmail chính của bạn.
* Chọn "Thêm tiêu đề X-Gm-Original-To với người nhận gốc"

**Mẫu phong bì người nhận:**

* Thêm mẫu phù hợp với tất cả các hộp thư không tồn tại (ví dụ: `.*@yourdomain.com`)

**Cài đặt máy chủ email:**

* Chọn "Định tuyến đến máy chủ" và nhập `mx1.forwardemail.net` làm máy chủ chính
* Thêm `mx2.forwardemail.net` làm máy chủ dự phòng
* Đặt cổng thành 25
* Chọn "Yêu cầu TLS" để bảo mật

4. Nhấp vào **Lưu** để tạo tuyến đường

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Cấu hình này chỉ áp dụng cho tài khoản Google Workspace có tên miền tùy chỉnh, không áp dụng cho tài khoản Gmail thông thường.
</span>
</div>

### Cấu hình định tuyến Outlook nâng cao {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Thời gian thiết lập ước tính:</strong>
<span>15-30 phút</span>
</div>

Đối với người dùng Microsoft 365 (trước đây là Office 365) muốn thiết lập định tuyến nâng cao để các bí danh không khớp với hộp thư sẽ chuyển tiếp đến các trao đổi thư của Forward Email:

1. Đăng nhập vào trung tâm quản trị Microsoft 365 tại [admin.microsoft.com](https://admin.microsoft.com)
2. Vào **Exchange → Luồng thư → Quy tắc**
3. Nhấp vào **Thêm quy tắc** và chọn **Tạo quy tắc mới**
4. Đặt tên cho quy tắc của bạn (ví dụ: "Chuyển tiếp hộp thư không tồn tại đến Chuyển tiếp Email")
5. Trong mục **Áp dụng quy tắc này nếu**, hãy chọn:
* "Địa chỉ người nhận khớp với..."
* Nhập mẫu khớp với tất cả các địa chỉ trong miền của bạn (ví dụ: `*@yourdomain.com`)
6. Trong mục **Thực hiện các thao tác sau**, hãy chọn:
* "Chuyển hướng thư đến..."
* Chọn "Máy chủ thư sau"
* Nhập `mx1.forwardemail.net` và cổng 25
* Thêm `mx2.forwardemail.net` làm máy chủ dự phòng
7. Trong mục **Ngoại trừ nếu**, hãy chọn:
* "Người nhận là..."
* Thêm tất cả các hộp thư hiện có của bạn không nên được chuyển tiếp
8. Đặt mức độ ưu tiên của quy tắc thành đảm bảo nó chạy sau các quy tắc luồng thư khác
9. Nhấp vào **Lưu** để kích hoạt quy tắc

## Khắc phục sự cố {#troubleshooting}

### Tại sao tôi không nhận được email thử nghiệm {#why-am-i-not-receiving-my-test-emails}

Nếu bạn gửi email thử nghiệm cho chính mình, thì email đó có thể không hiển thị trong hộp thư đến vì tiêu đề "Message-ID" giống nhau.

Đây là một vấn đề được nhiều người biết đến và cũng ảnh hưởng đến các dịch vụ như Gmail. <a href="https://support.google.com/a/answer/1703601">Here là câu trả lời chính thức của Gmail về vấn đề này</a>.

Nếu bạn vẫn gặp sự cố, thì rất có thể vấn đề nằm ở việc truyền tải DNS. Bạn sẽ cần đợi thêm một chút rồi thử lại (hoặc thử đặt giá trị TTL thấp hơn trên các bản ghi <strong class="notranslate">TXT</strong> của mình).

**Vẫn gặp sự cố?** Vui lòng <a href="/help">liên hệ với chúng tôi</a> để chúng tôi có thể giúp bạn điều tra sự cố và tìm ra giải pháp nhanh chóng.

### Làm thế nào để cấu hình máy khách email của tôi hoạt động với Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Dịch vụ của chúng tôi hoạt động với các trình duyệt email phổ biến như:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Máy tính để bàn</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Thiết bị đầu cuối</a></li>
</ul>
</div>

<div class="alert alert-primary">
Tên người dùng của bạn là địa chỉ email bí danh và mật khẩu là từ <strong class="text-success"><i class="fa fa-key"></i> Tạo mật khẩu</strong> ("Mật khẩu thường").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>Nếu bạn đang sử dụng Thunderbird, hãy đảm bảo "Bảo mật kết nối" được đặt thành "SSL/TLS" và "Phương thức xác thực" được đặt thành "Mật khẩu thông thường".</span>
</div>

| Kiểu | Tên máy chủ | Giao thức | Cổng |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Ưu tiên** | `993` và `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Ưu tiên** hoặc TLS (STARTTLS) | `465` và `2465` cho SSL/TLS (hoặc) `587`, `2587`, `2525` và `25` cho TLS (STARTTLS) |

### Tại sao email của tôi lại rơi vào mục Spam và Junk và làm thế nào tôi có thể kiểm tra uy tín tên miền của mình {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Phần này hướng dẫn bạn nếu thư gửi đi của bạn đang sử dụng máy chủ SMTP của chúng tôi (ví dụ: `smtp.forwardemail.net`) (hoặc được chuyển tiếp qua `mx1.forwardemail.net` hoặc `mx2.forwardemail.net`) và thư đó đang được chuyển vào thư mục Spam hoặc Junk của người nhận.

Chúng tôi thường xuyên theo dõi [Địa chỉ IP](#what-are-your-servers-ip-addresses) so với [tất cả các danh sách từ chối DNS có uy tín](#how-do-you-handle-your-ip-addresses-becoming-blocked), **do đó, rất có thể đây là vấn đề liên quan đến danh tiếng tên miền**.

Email có thể bị chuyển vào thư mục thư rác vì một số lý do sau:

1. **Thiếu xác thực**: Thiết lập các bản ghi [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) và [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Uy tín tên miền**: Tên miền mới thường có uy tín trung lập cho đến khi chúng thiết lập được lịch sử gửi thư.

3. **Nội dung kích hoạt**: Một số từ hoặc cụm từ nhất định có thể kích hoạt bộ lọc thư rác.

4. **Mẫu gửi**: Việc số lượng email tăng đột ngột có thể trông đáng ngờ.

Bạn có thể thử sử dụng một hoặc nhiều công cụ sau để kiểm tra danh tiếng và phân loại tên miền của mình:

| Tên công cụ | URL | Kiểu |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Phản hồi về Phân loại tên miền Cloudflare | <https://radar.cloudflare.com/domains/feedback> | Phân loại |
| Công cụ kiểm tra uy tín IP và tên miền của Spamhaus | <https://check.spamhaus.org/> | DNSBL |
| Trung tâm danh tiếng IP và tên miền Cisco Talos | <https://talosintelligence.com/reputation_center> | Danh tiếng |
| Tra cứu danh tiếng IP và tên miền Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| Kiểm tra danh sách đen MX Toolbox | <https://mxtoolbox.com/blacklists.aspx> | Danh sách đen |
| Công cụ quản lý bưu chính của Google | <https://www.gmail.com/postmaster/> | Danh tiếng |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | Danh tiếng |
| Kiểm tra danh sách đen MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| Điểm người gửi | <https://senderscore.org/act/blocklist-remover/> | Danh tiếng |
| Sự mất giá trị | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Xóa IP của Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | Loại bỏ |
| Xóa IP của Cloudmark | <https://csi.cloudmark.com/en/reset/> | Loại bỏ |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Xóa IP của Microsoft Outlook và Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Loại bỏ |
| Các cấp độ 1, 2 và 3 của UCEPROTECT | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| backscatterer.org của UCEPROTECT | <https://www.backscatterer.org/> | Bảo vệ chống tán xạ ngược |
| Whitelisted.org của UCEPROTECT | <https://www.whitelisted.org/> (yêu cầu trả phí) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Loại bỏ |
| AOL/Verizon (ví dụ: `[IPTS04]`) | <https://senders.yahooinc.com/> | Loại bỏ |
| Truyền thông Cox | `unblock.request@cox.net` | Loại bỏ |
| t-online.de (tiếng Đức/T-Mobile) | `tobr@rx.t-online.de` | Loại bỏ |

> \[!TIP]
> Hãy bắt đầu với số lượng nhỏ email chất lượng cao để xây dựng uy tín tích cực trước khi gửi số lượng lớn hơn.

> \[!IMPORTANT]
> Nếu tên miền của bạn nằm trong danh sách đen, mỗi danh sách đen sẽ có quy trình xóa riêng. Vui lòng kiểm tra trang web của từng danh sách đen để biết hướng dẫn.

> \[!TIP]
> Nếu bạn cần thêm trợ giúp hoặc phát hiện chúng tôi bị một nhà cung cấp dịch vụ email nào đó liệt kê là thư rác, vui lòng <a href="/help">liên hệ với chúng tôi</a>.

### Tôi phải làm gì nếu nhận được email rác {#what-should-i-do-if-i-receive-spam-emails}

Bạn nên hủy đăng ký khỏi danh sách gửi email (nếu có thể) và chặn người gửi.

Vui lòng không báo cáo tin nhắn là thư rác mà hãy chuyển tiếp tin nhắn đó đến hệ thống phòng chống lạm dụng tập trung vào quyền riêng tư và được quản lý thủ công của chúng tôi.

**Địa chỉ email để chuyển tiếp thư rác là:** <abuse@forwardemail.net>

### Tại sao các email thử nghiệm tôi gửi cho chính mình trong Gmail lại hiển thị là "đáng ngờ" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Nếu bạn thấy thông báo lỗi này trong Gmail khi gửi thư thử nghiệm cho chính mình hoặc khi người mà bạn gửi email bằng bí danh nhìn thấy email từ bạn lần đầu tiên, thì **đừng lo lắng** – vì đây là tính năng an toàn tích hợp của Gmail.

Bạn chỉ cần nhấp vào "Trông có vẻ an toàn". Ví dụ: nếu bạn gửi tin nhắn thử nghiệm bằng tính năng "gửi thư dưới dạng" (cho người khác), thì họ sẽ không thấy tin nhắn này.

Tuy nhiên, nếu họ thấy thông báo này, đó là vì họ thường thấy email của bạn được gửi từ <john@gmail.com> thay vì <john@customdomain.com> (chỉ là ví dụ). Gmail sẽ cảnh báo người dùng để đảm bảo mọi thứ an toàn, phòng trường hợp không có cách giải quyết nào khác.

### Tôi có thể xóa via forwardemail dot net trong Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail} không?

Chủ đề này liên quan đến [sự cố phổ biến trong Gmail khi thông tin bổ sung xuất hiện bên cạnh tên người gửi](https://support.google.com/mail/answer/1311182).

Kể từ tháng 5 năm 2023, chúng tôi hỗ trợ gửi email bằng SMTP dưới dạng tiện ích bổ sung cho tất cả người dùng trả phí – điều này có nghĩa là bạn có thể xóa <span class="notranslate">qua forwardemail dot net</span> trong Gmail.

Lưu ý rằng chủ đề Câu hỏi thường gặp này dành riêng cho những người sử dụng tính năng [Cách gửi thư bằng Gmail](#how-to-send-mail-as-using-gmail).

Vui lòng xem phần [Bạn có hỗ trợ gửi email bằng SMTP không?](#do-you-support-sending-email-with-smtp) để biết hướng dẫn cấu hình.

## Quản lý dữ liệu {#data-management}

### Máy chủ của bạn được đặt ở đâu {#where-are-your-servers-located}

> \[!TIP]
> Chúng tôi có thể sớm công bố vị trí trung tâm dữ liệu EU được lưu trữ tại [forwardemail.eu](https://forwardemail.eu). Đăng ký tham gia thảo luận tại <https://github.com/orgs/forwardemail/discussions/336> để cập nhật thông tin.

Máy chủ của chúng tôi chủ yếu đặt tại Denver, Colorado – xem <https://forwardemail.net/ips> để biết danh sách đầy đủ các địa chỉ IP của chúng tôi.

Bạn có thể tìm hiểu về các bộ xử lý phụ của chúng tôi trên các trang [GDPR](/gdpr), [DPA](/dpa) và [Sự riêng tư](/privacy).

### Làm thế nào để xuất và sao lưu hộp thư của tôi {#how-do-i-export-and-backup-my-mailbox}

Bạn có thể xuất hộp thư của mình theo định dạng [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Hộp thư thoại](https://en.wikipedia.org/wiki/Mbox) hoặc [SQLite](https://en.wikipedia.org/wiki/SQLite) được mã hóa bất cứ lúc nào.

Truy cập <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh <i class="fa fa-angle-right"></i> Tải xuống bản sao lưu và chọn loại định dạng xuất ưa thích của bạn.

Bạn sẽ nhận được email có liên kết để tải xuống bản xuất sau khi hoàn tất.

Lưu ý rằng liên kết tải xuống này sẽ hết hạn sau 4 giờ vì lý do bảo mật.

Nếu bạn cần kiểm tra các định dạng EML hoặc Mbox đã xuất, thì các công cụ nguồn mở sau đây có thể hữu ích:

| Tên | Định dạng | Nền tảng | URL GitHub |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| Trình xem MBox | Hộp thư thoại | Cửa sổ | <https://github.com/eneam/mboxviewer> |
| trình xem web mbox | Hộp thư thoại | Tất cả các nền tảng | <https://github.com/PHMRanger/mbox-web-viewer> |
| Trình đọc Eml | EML | Cửa sổ | <https://github.com/ayamadori/EmlReader> |
| Trình xem email | EML | Mã VS | <https://github.com/joelharkes/vscode_email_viewer> |
| trình đọc eml | EML | Tất cả các nền tảng | <https://github.com/s0ph1e/eml-reader> |

Ngoài ra, nếu bạn cần chuyển đổi tệp Mbox sang tệp EML, thì bạn có thể sử dụng <https://github.com/noelmartinon/mboxzilla>.

### Làm thế nào để nhập và di chuyển hộp thư hiện tại của tôi {#how-do-i-import-and-migrate-my-existing-mailbox}

Bạn có thể dễ dàng nhập email của mình vào Forward Email (ví dụ: sử dụng [Chim Sấm Sét](https://www.thunderbird.net)) bằng cách làm theo hướng dẫn bên dưới:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Bạn phải làm theo tất cả các bước sau để nhập email hiện có của mình.
</span>
</div>

1. Xuất email của bạn từ nhà cung cấp email hiện tại:

| Nhà cung cấp email | Định dạng xuất | Hướng dẫn xuất khẩu |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Triển vọng | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Mẹo:</strong> <span>Nếu bạn đang sử dụng Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">Định dạng xuất PST</a>), thì bạn chỉ cần làm theo hướng dẫn trong mục "Khác" bên dưới. Tuy nhiên, chúng tôi đã cung cấp các liên kết bên dưới để chuyển đổi định dạng PST sang MBOX/EML dựa trên hệ điều hành của bạn: <ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba cho Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst cho Windows cygwin</a> – (ví dụ: <code>readpst -u -o $OUT_DIR $IN_DIR</code> thay thế <code>$OUT_DIR</code> và <code>$IN_DIR</code> bằng thư mục đầu ra và thư mục đầu vào đường dẫn thư mục tương ứng).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst cho Ubuntu/Linux</a> – (ví dụ: <code>sudo apt-get install readpst</code> rồi <code>readpst -u -o $OUT_DIR $IN_DIR</code>, thay thế <code>$OUT_DIR</code> và <code>$IN_DIR</code> bằng đường dẫn thư mục đầu ra và thư mục đầu vào tương ứng).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst cho macOS (thông qua brew)</a> – (ví dụ: <code>brew install libpst</code> rồi <code>readpst -u -o $OUT_DIR $IN_DIR</code>, thay thế <code>$OUT_DIR</code> và <code>$IN_DIR</code> với đường dẫn thư mục đầu ra và thư mục đầu vào tương ứng).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Bộ chuyển đổi PST cho Windows (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| Thư Proton | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Nghĩ | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Khác | [Use Thunderbird](https://www.thunderbird.net) | Thiết lập tài khoản email hiện có của bạn trong Thunderbird, sau đó sử dụng plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) để xuất và nhập email. **Bạn cũng có thể chỉ cần sao chép/dán hoặc kéo/thả email giữa các tài khoản.** |

2. Tải xuống, cài đặt và mở [Chim Sấm Sét](https://www.thunderbird.net).

3. Tạo một tài khoản mới bằng địa chỉ email đầy đủ của bí danh của bạn (ví dụ: <code><you@yourdomain.com></code>) và mật khẩu bạn đã tạo. <strong>Nếu bạn chưa có mật khẩu, hãy <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">tham khảo hướng dẫn thiết lập của chúng tôi</a></strong>.

4. Tải xuống và cài đặt plugin [ImportExportTools OF](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird.

5. Tạo một thư mục cục bộ mới trong Thunderbird, sau đó nhấp chuột phải vào thư mục đó → chọn tùy chọn `ImportExportTools NG` → chọn `Import mbox file` (cho định dạng xuất MBOX) – hoặc – `Import messages` / `Import all messages from a directory` (cho định dạng xuất EML).

6. Kéo/thả từ thư mục cục bộ vào thư mục IMAP mới (hoặc hiện có) trong Thunderbird mà bạn muốn tải tin nhắn lên bộ nhớ IMAP với dịch vụ của chúng tôi. Thao tác này sẽ đảm bảo chúng được sao lưu trực tuyến với bộ nhớ được mã hóa SQLite của chúng tôi.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>
Nếu bạn chưa biết cách nhập vào Thunderbird, bạn có thể tham khảo hướng dẫn chính thức tại <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> và <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>

Sau khi hoàn tất quy trình xuất và nhập, bạn cũng có thể muốn bật tính năng chuyển tiếp trên tài khoản email hiện tại và thiết lập chế độ trả lời tự động để thông báo cho người gửi rằng bạn có địa chỉ email mới (ví dụ: nếu trước đây bạn đang sử dụng Gmail và hiện đang sử dụng email với tên miền tùy chỉnh).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Xin chúc mừng!
</strong>
<span>
Bạn đã hoàn thành tất cả các bước.
</span>
</div>
</div>

### Bạn có hỗ trợ tự lưu trữ không {#do-you-support-self-hosting}

Có, kể từ tháng 3 năm 2025, chúng tôi hỗ trợ tùy chọn tự lưu trữ. Đọc blog [đây](https://forwardemail.net/blog/docs/self-hosted-solution). Xem [hướng dẫn tự lưu trữ](https://forwardemail.net/self-hosted) để bắt đầu. Nếu bạn quan tâm đến phiên bản hướng dẫn chi tiết hơn, hãy xem hướng dẫn [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) hoặc [Debian](https://forwardemail.net/guides/selfhosted-on-debian) của chúng tôi.

## Cấu hình Email {#email-configuration}

### Làm thế nào để bắt đầu và thiết lập chuyển tiếp email {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Thời gian thiết lập ước tính:</strong>
<span>Dưới 10 phút</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Bắt đầu:
</strong>
<span>
Hãy đọc kỹ và làm theo các bước từ một đến tám được liệt kê dưới đây. Hãy nhớ thay thế địa chỉ email <code>user@gmail.com</code> bằng địa chỉ email bạn muốn chuyển tiếp email đến (nếu địa chỉ này chưa chính xác). Tương tự, hãy nhớ thay thế <code>example.com</code> bằng tên miền tùy chỉnh của bạn (nếu địa chỉ này chưa chính xác).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Nếu bạn đã đăng ký tên miền ở đâu đó, hãy bỏ qua bước này và chuyển sang bước hai! Nếu không, bạn có thể <a href="/domain-registration" rel="noopener noreferrer">nhấp vào đây để đăng ký tên miền</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Bạn có nhớ mình đã đăng ký tên miền ở đâu không? Khi nhớ ra, hãy làm theo hướng dẫn bên dưới:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Bạn phải mở một tab mới và đăng nhập vào nhà đăng ký tên miền của mình. Bạn có thể dễ dàng nhấp vào "Nhà đăng ký" bên dưới để tự động thực hiện việc này. Trong tab mới này, bạn phải điều hướng đến trang quản lý DNS tại nhà đăng ký của mình &ndash; và chúng tôi đã cung cấp các bước điều hướng từng bước bên dưới trong cột "Các bước cấu hình". Sau khi bạn đã điều hướng đến trang này trong tab mới, bạn có thể quay lại tab này và tiếp tục bước ba bên dưới.
<strong class="font-weight-bold">Đừng đóng tab đã mở ngay; bạn sẽ cần nó cho các bước sau!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nhà đăng ký</th>
<th>Các bước cấu hình</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> Trung tâm tên miền <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Chỉnh sửa cài đặt DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Tuyến 53</a></td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> Vùng lưu trữ <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> Máy chủ của tôi <i class="fa fa-angle-right"></i> Quản lý tên miền <i class="fa fa-angle-right"></i> Trình quản lý DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>DÀNH CHO ROCK: Đăng nhập <i class="fa fa-angle-right"></i> Tên miền <i class="fa fa-angle-right"></i> (Nhấp vào biểu tượng ▼ bên cạnh quản lý) <i class="fa fa-angle-right"></i> DNS
<br />
DÀNH CHO NGƯỜI CŨ: Đăng nhập <i class="fa fa-angle-right"></i> Tên miền <i class="fa fa-angle-right"></i> Trình chỉnh sửa vùng <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Dễ dàng</a></td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Chọn (tên miền)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Quản lý</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> Mạng <i class="fa fa-angle-right"></i> Tên miền <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Xem thêm <i class="fa fa-angle-right"></i> Quản lý tên miền</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> Ở chế độ xem thẻ, nhấp vào quản lý tên miền của bạn <i class="fa fa-angle-right"></i> Ở chế độ xem danh sách, nhấp vào
biểu tượng bánh răng <i class="fa fa-angle-right"></i> DNS & Máy chủ tên <i class="fa fa-angle-right"></i> Bản ghi DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> Xem</a>
</td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Quản lý <i class="fa fa-angle-right"></i> (nhấp vào biểu tượng bánh răng) <i class="fa fa-angle-right"></i> Nhấp vào DNS & Máy chủ tên trong menu bên trái</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>Đăng nhập <i class="fa fa-angle-right"></i> Bảng điều khiển <i class="fa fa-angle-right"></i> Tên miền <i class="fa fa-angle-right"></i> Quản lý tên miền <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>

<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>Đăng nhập <i class="fa fa-angle-right"></i> Tổng quan <i class="fa fa-angle-right"></i> Quản lý <i class="fa fa-angle-right"></i> Trình soạn thảo đơn giản <i class="fa fa-angle-right"></i> Bản ghi</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>Đăng nhập <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Quản lý <i class="fa fa-angle-right"></i> Chỉnh sửa vùng</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> Xem</a>
</td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> Quản lý tên miền của tôi <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Quản lý DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 tên miền</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> Xem</a>
</td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Cấu hình DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> Xem</a>
</td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> Danh sách tên miền <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Quản lý <i class="fa fa-angle-right"></i> DNS Nâng cao</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>Đăng nhập <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Thiết lập DNS Netlify</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 Solutions</a></td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> Quản lý Tài khoản <i class="fa fa-angle-right"></i> Tên Miền Của Tôi <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Quản lý <i class="fa fa-angle-right"></i> Thay đổi vị trí trỏ tên miền <i class="fa fa-angle-right"></i> DNS nâng cao</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> Xem</a>
</td>
<td>Đăng nhập <i class="fa fa-angle-right"></i> Tên miền được quản lý <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Cài đặt DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>Đăng nhập <i class="fa fa-angle-right"></i> Menu chính <i class="fa fa-angle-right"></i> Cài đặt <i class="fa fa-angle-right"></i> Tên miền <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i>
Cài đặt nâng cao <i class="fa fa-angle-right"></i> Bản ghi tùy chỉnh</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 Now</a></td>
<td>Sử dụng CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6
<td>Đăng nhập <i class="fa fa-angle-right"></i> Trang tên miền <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7
<td>Đăng nhập <i class="fa fa-angle-right"></i> Trang tên miền <i class="fa fa-angle-right"></i> (Nhấp vào biểu tượng <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Chọn Quản lý Bản ghi DNS</td>

</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8
<td>Đăng nhập <i class="fa fa-angle-right"></i> Tên miền <i class="fa fa-angle-right"></i> Tên miền của tôi</td>
</tr>
<tr>
<td>Khác</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Quan trọng:</strong> Bạn không thấy tên nhà đăng ký của mình được liệt kê ở đây? Chỉ cần tìm kiếm trên Internet "cách thay đổi bản ghi DNS trên $REGISTRAR" (thay $REGISTRAR bằng tên nhà đăng ký của bạn - ví dụ: "cách thay đổi bản ghi DNS trên GoDaddy" nếu bạn đang sử dụng GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Sử dụng trang quản lý DNS của nhà đăng ký (tab khác mà bạn đã mở), hãy thiết lập các bản ghi "MX" sau:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Lưu ý rằng KHÔNG được thiết lập bất kỳ bản ghi MX nào khác. Cả hai bản ghi hiển thị bên dưới PHẢI tồn tại. Hãy đảm bảo không có lỗi chính tả; và bạn đã viết đúng chính tả cả mx1 và mx2. Nếu đã có bản ghi MX tồn tại, vui lòng xóa hoàn toàn.
Giá trị "TTL" không nhất thiết phải là 3600, có thể thấp hơn hoặc cao hơn nếu cần.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Mức độ ưu tiên</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Sử dụng trang quản lý DNS của cơ quan đăng ký (tab khác mà bạn đã mở), hãy thiết lập các bản ghi <strong class="notranslate">TXT</strong> sau:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Nếu bạn đang sử dụng gói trả phí, bạn phải bỏ qua hoàn toàn bước này và chuyển sang bước năm! Nếu bạn không sử dụng gói trả phí, địa chỉ được chuyển tiếp của bạn sẽ được tìm kiếm công khai – hãy truy cập <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> và nâng cấp tên miền của bạn lên gói trả phí nếu muốn. Nếu bạn muốn tìm hiểu thêm về các gói trả phí, hãy xem trang <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Bảng giá</a> của chúng tôi. Nếu không, bạn có thể tiếp tục chọn một hoặc nhiều gói kết hợp từ Tùy chọn A đến Tùy chọn F được liệt kê bên dưới.

</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Lựa chọn A:
</strong>
<span>
Nếu bạn đang chuyển tiếp tất cả email từ tên miền của mình (ví dụ: "all@example.com", "hello@example.com", v.v.) đến một địa chỉ cụ thể "user@gmail.com":
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>
Hãy nhớ thay thế các giá trị ở trên trong cột "Giá trị" bằng địa chỉ email của bạn. Giá trị "TTL" không nhất thiết phải là 3600, có thể thấp hơn hoặc cao hơn nếu cần. Giá trị thời gian tồn tại ("TTL") thấp hơn sẽ đảm bảo bất kỳ thay đổi nào được thực hiện trong tương lai đối với bản ghi DNS của bạn sẽ được lan truyền trên Internet nhanh hơn - hãy nghĩ về điều này như thời gian lưu trữ đệm trong bộ nhớ (tính bằng giây). Bạn có thể tìm hiểu thêm về <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL trên Wikipedia</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Lựa chọn B:
</strong>
<span>
Nếu bạn chỉ cần chuyển tiếp một địa chỉ email duy nhất (ví dụ: <code>hello@example.com</code> đến <code>user@gmail.com</code>; thao tác này cũng sẽ tự động chuyển tiếp "hello+test@example.com" đến "user+test@gmail.com"):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Lựa chọn C:
</strong>
<span>
Nếu bạn đang chuyển tiếp nhiều email, hãy phân cách chúng bằng dấu phẩy:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tùy chọn D:
</strong>
<span>
Bạn có thể thiết lập vô số email chuyển tiếp – chỉ cần đảm bảo không viết quá 255 ký tự trên một dòng và bắt đầu mỗi dòng bằng "forward-email=". Ví dụ như sau:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tùy chọn E:
</strong>
<span>
Bạn cũng có thể chỉ định tên miền trong bản ghi <strong class="notranslate">TXT</strong> của mình để chuyển tiếp bí danh toàn cục (ví dụ: "user@example.com" sẽ được chuyển tiếp đến "user@example.net"):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=example.net</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tùy chọn F:
</strong>
<span>
Bạn thậm chí có thể sử dụng webhooks làm bí danh toàn cục hoặc riêng lẻ để chuyển tiếp email đến. Xem ví dụ và phần đầy đủ về webhooks có tiêu đề <a href="#do-you-support-webhooks" class="alert-link">Bạn có hỗ trợ webhooks không</a> bên dưới.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tùy chọn G:
</strong>
<span>
Bạn thậm chí có thể sử dụng biểu thức chính quy ("regex") để khớp các bí danh và xử lý các phép thay thế để chuyển tiếp email đến. Xem các ví dụ và phần đầy đủ về regex có tiêu đề <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Bạn có hỗ trợ biểu thức chính quy hay regex không</a> bên dưới.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Cần regex nâng cao với phép thế?</strong> Xem các ví dụ và phần đầy đủ về regex có tiêu đề <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Bạn có hỗ trợ biểu thức chính quy hoặc regex không</a> bên dưới.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ví dụ đơn giản:</strong> Nếu tôi muốn tất cả email gửi đến `linus@example.com` hoặc `torvalds@example.com` được chuyển tiếp đến `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Kiểu</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Quy tắc chuyển tiếp catch-all cũng có thể được mô tả là "fall-through".
Điều này có nghĩa là các email đến khớp với ít nhất một quy tắc chuyển tiếp cụ thể sẽ được sử dụng thay vì catch-all.
Các quy tắc cụ thể bao gồm địa chỉ email và biểu thức chính quy.
<br /><br />
Ví dụ:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
Email được gửi đến <code>hello@example.com</code> sẽ **không** được chuyển tiếp đến <code>second@gmail.com</code> (catch-all) với cấu hình này, thay vào đó chỉ được gửi đến <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Sử dụng trang quản lý DNS của cơ quan đăng ký (tab khác mà bạn đã mở), đồng thời thiết lập bản ghi <strong class="notranslate">TXT</strong> sau:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Nếu bạn đang sử dụng Gmail (ví dụ: Gửi thư dưới dạng) hoặc G Suite, bạn cần thêm <code>include:_spf.google.com</code> vào giá trị trên, ví dụ:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>

Nếu bạn đã có một dòng tương tự với "v=spf1", thì bạn cần thêm <code>include:spf.forwardemail.net</code> ngay trước bất kỳ bản ghi "include:host.com" nào hiện có và trước dấu "-all" trong cùng một dòng, ví dụ:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Lưu ý rằng có sự khác biệt giữa "-all" và "~all". Dấu "-" biểu thị rằng kiểm tra SPF sẽ KHÔNG THÀNH CÔNG nếu không khớp, và dấu "~" biểu thị rằng kiểm tra SPF sẽ KHÔNG THÀNH CÔNG MỀM. Chúng tôi khuyên bạn nên sử dụng dấu "-all" để ngăn chặn việc giả mạo tên miền.

<br /><br />
Bạn cũng có thể cần thêm bản ghi SPF cho bất kỳ máy chủ nào bạn đang sử dụng để gửi thư (ví dụ: Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Xác minh bản ghi DNS của bạn bằng công cụ "Xác minh bản ghi" có sẵn tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Thiết lập.

</li><li class="mb-2 mb-md-3 mb-lg-5">Gửi email thử nghiệm để xác nhận hoạt động. Lưu ý rằng có thể mất một thời gian để bản ghi DNS của bạn được lan truyền.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>
</span>
Nếu bạn không nhận được email thử nghiệm, hoặc nhận được email thử nghiệm có nội dung "Hãy cẩn thận với thông báo này", hãy xem câu trả lời cho <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Tại sao tôi không nhận được email thử nghiệm</a> và <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Tại sao email thử nghiệm được gửi cho tôi trong Gmail lại hiển thị là "đáng ngờ"</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Nếu bạn muốn "Gửi thư dưới dạng" từ Gmail, thì bạn sẽ cần <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">xem video này</a></strong> hoặc làm theo các bước trong <a href="#how-to-send-mail-as-using-gmail">How để Gửi thư dưới dạng bằng Gmail</a> bên dưới.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Xin chúc mừng!
</strong>
<span>
Bạn đã hoàn thành tất cả các bước.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>
Các tiện ích bổ sung tùy chọn được liệt kê bên dưới. Lưu ý rằng những tiện ích bổ sung này hoàn toàn tùy chọn và có thể không cần thiết. Chúng tôi muốn cung cấp cho bạn ít nhất thông tin bổ sung nếu cần.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tiện ích bổ sung tùy chọn:
</strong>
<span>
Nếu bạn đang sử dụng tính năng <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How để Gửi Thư Dưới Dạng Gmail</a>, bạn có thể muốn thêm mình vào danh sách cho phép. Xem <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">hướng dẫn này của Gmail</a> về chủ đề này.
</span>
</div>

### Tôi có thể sử dụng nhiều máy chủ và trao đổi MX để chuyển tiếp nâng cao không {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Có, nhưng **bạn chỉ nên liệt kê một sàn giao dịch MX trong bản ghi DNS của mình**.

Không nên cố gắng sử dụng "Ưu tiên" để cấu hình nhiều trao đổi MX.

Thay vào đó, bạn cần cấu hình trao đổi MX hiện tại của mình để chuyển tiếp thư cho tất cả các bí danh không khớp đến các trao đổi của dịch vụ của chúng tôi (`mx1.forwardemail.net` và/hoặc `mx2.forwardemail.net`).

Nếu bạn đang sử dụng Google Workspace và muốn chuyển tiếp tất cả các bí danh không khớp đến dịch vụ của chúng tôi, hãy xem <https://support.google.com/a/answer/6297084>.

Nếu bạn đang sử dụng Microsoft 365 (Outlook) và muốn chuyển tiếp tất cả các bí danh không khớp đến dịch vụ của chúng tôi, hãy xem <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> và <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Làm thế nào để thiết lập chế độ trả lời tự động khi không có mặt tại văn phòng? {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Vào <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh và tạo hoặc chỉnh sửa bí danh mà bạn muốn cấu hình trả lời tự động khi đi nghỉ.

Bạn có thể cấu hình ngày bắt đầu, ngày kết thúc, chủ đề và tin nhắn, cũng như bật hoặc tắt bất cứ lúc nào:

* Hiện tại, tiêu đề và tin nhắn dạng văn bản thuần túy được hỗ trợ (chúng tôi sử dụng gói `striptags` nội bộ để xóa bất kỳ mã HTML nào).
* Tiêu đề bị giới hạn ở 100 ký tự.
* Tin nhắn bị giới hạn ở 1000 ký tự.
* Thiết lập yêu cầu cấu hình SMTP gửi đi (ví dụ: bạn sẽ cần thiết lập các bản ghi DNS DKIM, DMARC và Return-Path).
* Truy cập <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Cài đặt <i class="fa fa-angle-right"></i> Cấu hình SMTP gửi đi và làm theo hướng dẫn thiết lập.
* Không thể bật tính năng trả lời tự động trên tên miền toàn cầu (ví dụ: [địa chỉ dùng một lần](/disposable-addresses) không được hỗ trợ).
* Không thể bật tính năng trả lời tự động cho các bí danh có ký tự đại diện/bắt tất cả (`*`) hoặc biểu thức chính quy.

Không giống như các hệ thống thư như `postfix` (ví dụ: sử dụng tiện ích mở rộng bộ lọc thư tạm thời `sieve`) – Forward Email tự động thêm chữ ký DKIM của bạn, loại bỏ các sự cố kết nối khi gửi phản hồi thư tạm thời (ví dụ: do các sự cố kết nối SSL/TLS phổ biến và máy chủ được duy trì cũ) và thậm chí còn hỗ trợ mã hóa Open WKD và PGP cho các phản hồi thư tạm thời.

<!--
* Để tránh lạm dụng, 1 tín dụng SMTP gửi đi sẽ bị trừ cho mỗi tin nhắn trả lời tự động được gửi đi.
* Tất cả tài khoản trả phí đều được mặc định 300 tín dụng mỗi ngày. Nếu bạn cần số lượng lớn hơn, vui lòng liên hệ với chúng tôi.
-->

1. Chúng tôi chỉ gửi một lần cho mỗi người gửi [được phép đưa vào danh sách](#do-you-have-an-allowlist) sau mỗi 4 ngày (tương tự như cách hoạt động của Gmail).

* Bộ nhớ đệm Redis của chúng tôi sử dụng dấu vân tay `alias_id` và `sender`, trong đó `alias_id` là ID MongoDB bí danh và `sender` là địa chỉ Từ (nếu nằm trong danh sách cho phép) hoặc tên miền gốc trong địa chỉ Từ (nếu không nằm trong danh sách cho phép). Để đơn giản hóa, dấu vân tay này trong bộ nhớ đệm được đặt là 4 ngày.

* Phương pháp sử dụng tên miền gốc được phân tích trong địa chỉ Từ đối với người gửi không nằm trong danh sách cho phép của chúng tôi giúp ngăn chặn việc lạm dụng từ những người gửi tương đối không quen biết (ví dụ: tác nhân độc hại) bằng cách gửi tin nhắn trả lời tự động.

2. Chúng tôi chỉ gửi khi MAIL FROM và/hoặc From không để trống và không chứa (không phân biệt chữ hoa chữ thường) [tên người dùng bưu điện](#what-are-postmaster-addresses) (phần trước @ trong email).

3. Chúng tôi sẽ không gửi nếu tin nhắn gốc có bất kỳ tiêu đề nào sau đây (không phân biệt chữ hoa chữ thường):

* Tiêu đề của `auto-submitted` có giá trị không bằng `no`.
* Tiêu đề của `x-auto-response-suppress` có giá trị `dr`, `autoreply`, `auto-reply`, `auto_reply` hoặc `all`
* Tiêu đề của `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 hoặc `no`7 (bất kể giá trị).

* Tiêu đề của `no`8 có giá trị là `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 hoặc `x-auto-response-suppress`3.

4. Chúng tôi sẽ không gửi nếu địa chỉ email MAIL FROM hoặc From kết thúc bằng `+donotreply`, `-donotreply`, `+noreply` hoặc `-noreply`.

5. Chúng tôi sẽ không gửi nếu phần tên người dùng của địa chỉ email Từ là `mdaemon` và có tiêu đề không phân biệt chữ hoa chữ thường là `X-MDDSN-Message`.

6. Chúng tôi không gửi nếu có tiêu đề `content-type` không phân biệt chữ hoa chữ thường của `multipart/report`.

### Làm thế nào để thiết lập SPF cho Email chuyển tiếp {#how-do-i-set-up-spf-for-forward-email}

Sử dụng trang quản lý DNS của cơ quan đăng ký tên miền, hãy thiết lập bản ghi <strong class="notranslate">TXT</strong> sau:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Nếu bạn đang sử dụng Gmail (ví dụ: Gửi thư dưới dạng) hoặc G Suite, bạn cần thêm <code>include:_spf.google.com</code> vào giá trị trên, ví dụ:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>

Nếu bạn đang sử dụng Microsoft Outlook hoặc Live.com, bạn cần thêm <code>include:spf.protection.outlook.com</code> vào bản ghi SPF <strong class="notranslate">TXT</strong> của mình, ví dụ:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>

Nếu bạn đã có một dòng tương tự với "v=spf1", thì bạn cần thêm <code>include:spf.forwardemail.net</code> ngay trước bất kỳ bản ghi "include:host.com" nào hiện có và trước dấu "-all" trong cùng một dòng, ví dụ:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Lưu ý rằng có sự khác biệt giữa "-all" và "~all". Dấu "-" biểu thị rằng kiểm tra SPF sẽ KHÔNG THÀNH CÔNG nếu không khớp, và dấu "~" biểu thị rằng kiểm tra SPF sẽ KHÔNG THÀNH CÔNG MỀM. Chúng tôi khuyên bạn nên sử dụng dấu "-all" để ngăn chặn việc giả mạo tên miền.

<br /><br />
Bạn cũng có thể cần thêm bản ghi SPF cho bất kỳ máy chủ nào bạn đang sử dụng để gửi thư (ví dụ: Outlook).
</span>
</div>

### Làm thế nào để thiết lập DKIM cho Email chuyển tiếp {#how-do-i-set-up-dkim-for-forward-email}

Vào <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Cài đặt <i class="fa fa-angle-right"></i> Cấu hình SMTP đi và làm theo hướng dẫn thiết lập.

### Làm thế nào để thiết lập DMARC cho Email chuyển tiếp {#how-do-i-set-up-dmarc-for-forward-email}

Vào <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Cài đặt <i class="fa fa-angle-right"></i> Cấu hình SMTP đi và làm theo hướng dẫn thiết lập.

### Làm thế nào để kết nối và cấu hình danh bạ của tôi {#how-do-i-connect-and-configure-my-contacts}

**Để cấu hình danh bạ của bạn, hãy sử dụng URL CardDAV của:** `https://carddav.forwardemail.net` (hoặc đơn giản là `carddav.forwardemail.net` nếu máy khách của bạn cho phép)

### Làm thế nào để kết nối và cấu hình lịch của tôi {#how-do-i-connect-and-configure-my-calendars}

**Để cấu hình lịch của bạn, hãy sử dụng URL CalDAV của:** `https://caldav.forwardemail.net` (hoặc đơn giản là `caldav.forwardemail.net` nếu máy khách của bạn cho phép)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Ví dụ về thiết lập Lịch Email Chuyển tiếp CalDAV Thunderbird" />

### Làm thế nào để thêm nhiều lịch hơn và quản lý các lịch hiện có {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Nếu bạn muốn thêm lịch bổ sung, chỉ cần thêm URL lịch mới là: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**đảm bảo thay thế `calendar-name` bằng tên lịch bạn muốn**)

Bạn có thể thay đổi tên và màu của lịch sau khi tạo – chỉ cần sử dụng ứng dụng lịch bạn thích (ví dụ: Apple Mail hoặc [Chim Sấm Sét](https://thunderbird.net)).

### Làm thế nào để thiết lập SRS cho Email chuyển tiếp {#how-do-i-set-up-srs-for-forward-email}

Chúng tôi tự động cấu hình [Sơ đồ viết lại người gửi](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – bạn không cần phải tự mình thực hiện việc này.

### Làm thế nào để thiết lập MTA-STS cho Email chuyển tiếp {#how-do-i-set-up-mta-sts-for-forward-email}

Vui lòng tham khảo [phần của chúng tôi về MTA-STS](#do-you-support-mta-sts) để biết thêm thông tin chi tiết.

### Làm thế nào để thêm ảnh đại diện vào địa chỉ email của tôi {#how-do-i-add-a-profile-picture-to-my-email-address}

Nếu bạn đang sử dụng Gmail, hãy làm theo các bước dưới đây:

1. Truy cập <https://google.com> và đăng xuất khỏi tất cả các tài khoản email
2. Nhấp vào "Đăng nhập" và trên menu thả xuống, nhấp vào "tài khoản khác"
3. Chọn "Sử dụng tài khoản khác"
4. Chọn "Tạo tài khoản"
5. Chọn "Sử dụng địa chỉ email hiện tại của tôi"
6. Nhập địa chỉ email tên miền tùy chỉnh của bạn
7. Nhận email xác minh được gửi đến địa chỉ email của bạn
8. Nhập mã xác minh từ email này
9. Hoàn tất thông tin hồ sơ cho tài khoản Google mới của bạn
10. Đồng ý với tất cả các chính sách về Quyền riêng tư và Điều khoản Sử dụng
11. Truy cập <https://google.com> và ở góc trên bên phải, nhấp vào biểu tượng hồ sơ của bạn và nhấp vào nút "thay đổi"
12. Tải lên ảnh hoặc ảnh đại diện mới cho tài khoản của bạn
13. Các thay đổi sẽ mất khoảng 1-2 giờ để áp dụng, nhưng đôi khi có thể rất nhanh.
14. Gửi email thử nghiệm và ảnh hồ sơ sẽ xuất hiện.

## Tính năng nâng cao {#advanced-features}

### Bạn có hỗ trợ bản tin hoặc danh sách gửi thư cho email liên quan đến tiếp thị không {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Có, bạn có thể đọc thêm tại <https://forwardemail.net/guides/newsletter-with-listmonk>.

Xin lưu ý rằng để duy trì uy tín IP và đảm bảo khả năng gửi thư, Forward Email có quy trình xem xét thủ công theo từng tên miền để **phê duyệt bản tin**. Vui lòng gửi email đến địa chỉ <support@forwardemail.net> hoặc mở [yêu cầu trợ giúp](https://forwardemail.net/help) để được phê duyệt. Quá trình này thường mất chưa đến 24 giờ, với hầu hết các yêu cầu được xử lý trong vòng 1-2 giờ. Trong tương lai gần, chúng tôi đặt mục tiêu thực hiện quy trình này ngay lập tức với các biện pháp kiểm soát thư rác và cảnh báo bổ sung. Quy trình này đảm bảo email của bạn đến được hộp thư đến và tin nhắn của bạn không bị đánh dấu là thư rác.

### Bạn có hỗ trợ gửi email bằng API {#do-you-support-sending-email-with-api} không?

Có, kể từ tháng 5 năm 2023, chúng tôi hỗ trợ gửi email bằng API dưới dạng tiện ích bổ sung cho tất cả người dùng trả phí.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Vui lòng đảm bảo bạn đã đọc <a href="/terms" class="alert-link" target="_blank">Điều khoản</a>, <a href="/privacy" class="alert-link" target="_blank">Chính sách Quyền riêng tư</a> và <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giới hạn SMTP gửi đi</a> của chúng tôi &ndash; việc sử dụng của bạn được coi là sự thừa nhận và đồng ý.
</span>
</div>

Vui lòng xem phần [Email](/email-api#outbound-emails) trong tài liệu API của chúng tôi để biết các tùy chọn, ví dụ và thông tin chi tiết hơn.

Để gửi email đi bằng API của chúng tôi, bạn phải sử dụng mã thông báo API có sẵn tại [An ninh của tôi](/my-account/security).

### Bạn có hỗ trợ nhận email bằng IMAP không {#do-you-support-receiving-email-with-imap}

Có, kể từ ngày 16 tháng 10 năm 2023, chúng tôi hỗ trợ nhận email qua IMAP dưới dạng tiện ích bổ sung cho tất cả người dùng trả phí. **Vui lòng đọc bài viết chuyên sâu của chúng tôi** về [cách thức hoạt động của tính năng lưu trữ hộp thư SQLite được mã hóa của chúng tôi](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Vui lòng đảm bảo bạn đã đọc <a href="/terms" class="alert-link" target="_blank">Điều khoản</a> và <a href="/privacy" class="alert-link" target="_blank">Chính sách Quyền riêng tư</a> của chúng tôi - việc sử dụng của bạn được coi là sự thừa nhận và đồng ý.
</span>
</div>

1. Tạo bí danh mới cho tên miền của bạn trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ: <code><hello@example.com></code>)

2. Nhấp vào <strong class="text-success"><i class="fa fa-key"></i> Tạo Mật khẩu</strong> bên cạnh bí danh vừa tạo. Sao chép vào bảng tạm và lưu trữ an toàn mật khẩu đã tạo hiển thị trên màn hình.

3. Sử dụng ứng dụng email ưa thích của bạn, hãy thêm hoặc cấu hình một tài khoản với bí danh mới tạo (ví dụ: <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>Chúng tôi khuyên bạn nên sử dụng <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> hoặc <a href="/blog/open-source" class="alert-link" target="_blank">một giải pháp thay thế mã nguồn mở và tập trung vào quyền riêng tư</a>.</span>
</div>

4. Khi được nhắc nhập tên máy chủ IMAP, hãy nhập `imap.forwardemail.net`

5. Khi được nhắc nhập cổng máy chủ IMAP, hãy nhập `993` (SSL/TLS) – xem [các cổng IMAP thay thế](/faq#what-are-your-imap-server-configuration-settings) nếu cần
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>Nếu bạn đang sử dụng Thunderbird, hãy đảm bảo "Bảo mật kết nối" được đặt thành "SSL/TLS" và "Phương thức xác thực" được đặt thành "Mật khẩu thông thường".</span>
</div>

6. Khi được nhắc nhập mật khẩu máy chủ IMAP, hãy dán mật khẩu từ <strong class="text-success"><i class="fa fa-key"></i> Tạo mật khẩu</strong> ở bước 2 ở trên

7. **Lưu cài đặt của bạn** – nếu bạn gặp sự cố, vui lòng <a href="/help">liên hệ với chúng tôi</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Xin chúc mừng!
</strong>
<span>
Bạn đã hoàn thành tất cả các bước.
</span>
</div>
</div>

</div>

### Bạn có hỗ trợ POP3 không {#do-you-support-pop3}

Có, kể từ ngày 4 tháng 12 năm 2023, chúng tôi hỗ trợ [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) dưới dạng tiện ích bổ sung cho tất cả người dùng trả phí. **Vui lòng đọc bài viết chuyên sâu của chúng tôi** về [cách thức hoạt động của tính năng lưu trữ hộp thư SQLite được mã hóa của chúng tôi](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Vui lòng đảm bảo bạn đã đọc <a href="/terms" class="alert-link" target="_blank">Điều khoản</a> và <a href="/privacy" class="alert-link" target="_blank">Chính sách Quyền riêng tư</a> của chúng tôi - việc sử dụng của bạn được coi là sự thừa nhận và đồng ý.
</span>
</div>

1. Tạo bí danh mới cho tên miền của bạn trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ: <code><hello@example.com></code>)

2. Nhấp vào <strong class="text-success"><i class="fa fa-key"></i> Tạo Mật khẩu</strong> bên cạnh bí danh vừa tạo. Sao chép vào bảng tạm và lưu trữ an toàn mật khẩu đã tạo hiển thị trên màn hình.

3. Sử dụng ứng dụng email ưa thích của bạn, hãy thêm hoặc cấu hình một tài khoản với bí danh mới tạo (ví dụ: <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>Chúng tôi khuyên bạn nên sử dụng <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> hoặc <a href="/blog/open-source" class="alert-link" target="_blank">một giải pháp thay thế mã nguồn mở và tập trung vào quyền riêng tư</a>.</span>
</div>

4. Khi được nhắc nhập tên máy chủ POP3, hãy nhập `pop3.forwardemail.net`

5. Khi được nhắc nhập cổng máy chủ POP3, hãy nhập `995` (SSL/TLS) – xem [cổng POP3 thay thế](/faq#what-are-your-pop3-server-configuration-settings) nếu cần
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>Nếu bạn đang sử dụng Thunderbird, hãy đảm bảo "Bảo mật kết nối" được đặt thành "SSL/TLS" và "Phương thức xác thực" được đặt thành "Mật khẩu thông thường".</span>
</div>

6. Khi được nhắc nhập mật khẩu máy chủ POP3, hãy dán mật khẩu từ <strong class="text-success"><i class="fa fa-key"></i> Tạo mật khẩu</strong> ở bước 2 ở trên

7. **Lưu cài đặt của bạn** – nếu bạn gặp sự cố, vui lòng <a href="/help">liên hệ với chúng tôi</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Xin chúc mừng!
</strong>
<span>
Bạn đã hoàn thành tất cả các bước.
</span>
</div>
</div>

</div>

### Bạn có hỗ trợ lịch (CalDAV) không {#do-you-support-calendars-caldav}

Có, kể từ ngày 5 tháng 2 năm 2024, chúng tôi đã thêm tính năng này. Máy chủ của chúng tôi là `caldav.forwardemail.net` và cũng được theo dõi trên <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">trang trạng thái</a>.

Nó hỗ trợ cả IPv4 và IPv6 và có sẵn trên cổng `443` (HTTPS).

| Đăng nhập | Ví dụ | Sự miêu tả |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên người dùng | `user@example.com` | Địa chỉ email của bí danh tồn tại cho tên miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a>. |
| Mật khẩu | `************************` | Mật khẩu được tạo theo bí danh cụ thể. |

Để sử dụng hỗ trợ lịch, **người dùng** phải là địa chỉ email của bí danh tồn tại cho tên miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> – và **mật khẩu** phải là mật khẩu do bí danh tạo ra.

### Bạn có hỗ trợ danh bạ (CardDAV) không {#do-you-support-contacts-carddav}

Có, kể từ ngày 12 tháng 6 năm 2025, chúng tôi đã thêm tính năng này. Máy chủ của chúng tôi là `carddav.forwardemail.net` và cũng được theo dõi trên <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">trang trạng thái</a>.

Nó hỗ trợ cả IPv4 và IPv6 và có sẵn trên cổng `443` (HTTPS).

| Đăng nhập | Ví dụ | Sự miêu tả |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên người dùng | `user@example.com` | Địa chỉ email của bí danh tồn tại cho tên miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a>. |
| Mật khẩu | `************************` | Mật khẩu được tạo theo bí danh cụ thể. |

Để sử dụng hỗ trợ liên hệ, **người dùng** phải là địa chỉ email của bí danh tồn tại cho tên miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> – và **mật khẩu** phải là mật khẩu do bí danh tạo ra.

### Bạn có hỗ trợ gửi email bằng SMTP {#do-you-support-sending-email-with-smtp} không?

Có, kể từ tháng 5 năm 2023, chúng tôi hỗ trợ gửi email bằng SMTP dưới dạng tiện ích bổ sung cho tất cả người dùng trả phí.

<div id="hướng dẫn smtp">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Vui lòng đảm bảo bạn đã đọc <a href="/terms" class="alert-link" target="_blank">Điều khoản</a>, <a href="/privacy" class="alert-link" target="_blank">Chính sách Quyền riêng tư</a> và <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giới hạn SMTP gửi đi</a> của chúng tôi &ndash; việc sử dụng của bạn được coi là sự thừa nhận và đồng ý.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Nếu bạn đang sử dụng Gmail, hãy tham khảo <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Hướng dẫn Gửi Thư Tương tự Gmail</a> của chúng tôi. Nếu bạn là nhà phát triển, hãy tham khảo <a class="alert-link" href="/email-api#outbound-emails" target="_blank">tài liệu API email</a> của chúng tôi.
</span>
</div>

1. Vào <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Cài đặt <i class="fa fa-angle-right"></i> Cấu hình SMTP gửi đi và làm theo hướng dẫn thiết lập

2. Tạo bí danh mới cho tên miền của bạn trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ: <code><hello@example.com></code>)

3. Nhấp vào <strong class="text-success"><i class="fa fa-key"></i> Tạo Mật khẩu</strong> bên cạnh bí danh vừa tạo. Sao chép vào bảng tạm và lưu trữ an toàn mật khẩu đã tạo hiển thị trên màn hình.

4. Sử dụng ứng dụng email ưa thích của bạn, hãy thêm hoặc cấu hình một tài khoản với bí danh mới tạo (ví dụ: <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>Chúng tôi khuyên bạn nên sử dụng <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> hoặc <a href="/blog/open-source" class="alert-link" target="_blank">một giải pháp thay thế mã nguồn mở và tập trung vào quyền riêng tư</a>.</span>
</div>

5. Khi được nhắc nhập tên máy chủ SMTP, hãy nhập `smtp.forwardemail.net`

6. Khi được nhắc nhập cổng máy chủ SMTP, hãy nhập `465` (SSL/TLS) – xem [cổng SMTP thay thế](/faq#what-are-your-smtp-server-configuration-settings) nếu cần
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>Nếu bạn đang sử dụng Thunderbird, hãy đảm bảo "Bảo mật kết nối" được đặt thành "SSL/TLS" và "Phương thức xác thực" được đặt thành "Mật khẩu thông thường".</span>
</div>

7. Khi được nhắc nhập mật khẩu máy chủ SMTP, hãy dán mật khẩu từ <strong class="text-success"><i class="fa fa-key"></i> Tạo mật khẩu</strong> ở bước 3 ở trên

8. **Lưu cài đặt của bạn và gửi email thử nghiệm đầu tiên** – nếu bạn gặp sự cố, vui lòng <a href="/help">liên hệ với chúng tôi</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Xin lưu ý rằng để duy trì uy tín IP và đảm bảo khả năng gửi thư, chúng tôi có quy trình xem xét thủ công trên từng tên miền để phê duyệt SMTP gửi đi. Quy trình này thường mất chưa đến 24 giờ, với hầu hết các yêu cầu được xử lý trong vòng 1-2 giờ. Trong tương lai gần, chúng tôi đặt mục tiêu thực hiện quy trình này ngay lập tức với các biện pháp kiểm soát thư rác và cảnh báo bổ sung. Quy trình này đảm bảo email của bạn đến được hộp thư đến và thư của bạn không bị đánh dấu là thư rác.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Xin chúc mừng!
</strong>
<span>
Bạn đã hoàn thành tất cả các bước.
</span>
</div>
</div>

</div>

### Bạn có hỗ trợ OpenPGP/MIME, mã hóa đầu cuối ("E2EE") và Thư mục khóa web ("WKD") không? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Có, chúng tôi hỗ trợ [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [mã hóa đầu cuối ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) và tính năng khám phá khóa công khai bằng [Thư mục khóa web ("WKD")](https://wiki.gnupg.org/WKD). Bạn có thể cấu hình OpenPGP bằng [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) hoặc [tự lưu trữ khóa của riêng bạn](https://wiki.gnupg.org/WKDHosting) (tham khảo [gist này để thiết lập máy chủ WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Tra cứu WKD được lưu trong bộ nhớ đệm trong 1 giờ để đảm bảo gửi email kịp thời → do đó, nếu bạn thêm, thay đổi hoặc xóa khóa WKD, vui lòng gửi email cho chúng tôi theo địa chỉ `support@forwardemail.net` kèm theo địa chỉ email của bạn để chúng tôi xóa bộ nhớ đệm theo cách thủ công.
* Chúng tôi hỗ trợ mã hóa PGP cho các tin nhắn được chuyển tiếp qua tra cứu WKD hoặc sử dụng khóa PGP đã tải lên trên giao diện của chúng tôi.
* Khóa đã tải lên sẽ có hiệu lực miễn là hộp kiểm PGP được bật/chọn.
* Tin nhắn được gửi đến webhooks hiện không được mã hóa bằng PGP.
* Nếu bạn có nhiều bí danh khớp với một địa chỉ chuyển tiếp nhất định (ví dụ: kết hợp regex/wildcard/exact) và nếu nhiều hơn một trong số chúng chứa khóa PGP đã tải lên và đã chọn PGP → thì chúng tôi sẽ gửi cho bạn email cảnh báo lỗi và sẽ không mã hóa tin nhắn bằng khóa PGP đã tải lên của bạn. Điều này rất hiếm khi xảy ra và thường chỉ áp dụng cho người dùng nâng cao với các quy tắc bí danh phức tạp.

* **Mã hóa PGP sẽ không được áp dụng cho việc chuyển tiếp email qua máy chủ MX của chúng tôi nếu người gửi có chính sách từ chối DMARC. Nếu bạn cần mã hóa PGP trên *tất cả* thư, chúng tôi khuyên bạn nên sử dụng dịch vụ IMAP của chúng tôi và cấu hình khóa PGP cho bí danh của bạn cho thư đến.**

**Bạn có thể xác thực thiết lập Web Key Directory của mình tại <https://wkd.chimbosonic.com/> (mã nguồn mở) hoặc <https://www.webkeydirectory.com/> (độc quyền).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mã hóa tự động:
</strong>
<span>Nếu bạn đang sử dụng <a href="#do-you-support-sending-email-with-smtp" class="alert-link">dịch vụ SMTP gửi đi</a> của chúng tôi và gửi tin nhắn không được mã hóa, thì chúng tôi sẽ tự động mã hóa tin nhắn cho từng người nhận bằng <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Bạn phải làm theo tất cả các bước sau để kích hoạt OpenPGP cho tên miền tùy chỉnh của mình.
</span>
</div>

1. Tải xuống và cài đặt plugin được đề xuất của ứng dụng email của bạn bên dưới:

| Máy khách email | Nền tảng | Plugin được đề xuất | Ghi chú |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chim Sấm Sét | Máy tính để bàn | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird có hỗ trợ tích hợp cho OpenPGP. |
| Gmail | Trình duyệt | [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download) (giấy phép độc quyền) | Gmail không hỗ trợ OpenPGP, tuy nhiên bạn có thể tải xuống plugin nguồn mở [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download). |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail không hỗ trợ OpenPGP, tuy nhiên bạn có thể tải xuống plugin nguồn mở [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) hoặc [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (giấy phép độc quyền) | Apple Mail không hỗ trợ OpenPGP, tuy nhiên bạn có thể tải xuống plugin nguồn mở [PGPro](https://github.com/opensourceios/PGPro/) hoặc [FlowCrypt](https://flowcrypt.com/download). |
| Triển vọng | Cửa sổ | [gpg4win](https://www.gpg4win.de/index.html) | Trình quản lý email trên máy tính để bàn của Outlook không hỗ trợ OpenPGP, tuy nhiên bạn có thể tải xuống plugin nguồn mở [gpg4win](https://www.gpg4win.de/index.html). |
| Triển vọng | Trình duyệt | [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download) (giấy phép độc quyền) | Trình duyệt email dựa trên web của Outlook không hỗ trợ OpenPGP, tuy nhiên bạn có thể tải xuống plugin nguồn mở [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download). |
| Android | Di động | [OpenKeychain](https://www.openkeychain.org/) hoặc [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients), chẳng hạn như [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) và [FairEmail](https://github.com/M66B/FairEmail), đều hỗ trợ plugin nguồn mở [OpenKeychain](https://www.openkeychain.org/). Bạn cũng có thể sử dụng plugin nguồn mở (có giấy phép độc quyền) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Trình duyệt | [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download) (giấy phép độc quyền) | Bạn có thể tải xuống tiện ích mở rộng trình duyệt nguồn mở [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download). |
| Trình duyệt Mozilla Firefox | Trình duyệt | [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download) (giấy phép độc quyền) | Bạn có thể tải xuống tiện ích mở rộng trình duyệt nguồn mở [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Trình duyệt | [Mailvelope](https://mailvelope.com/) | Bạn có thể tải xuống tiện ích mở rộng trình duyệt nguồn mở [Mailvelope](https://mailvelope.com/). |
| Can đảm | Trình duyệt | [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download) (giấy phép độc quyền) | Bạn có thể tải xuống tiện ích mở rộng trình duyệt nguồn mở [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download). |
| Gỗ balsa | Máy tính để bàn | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa có hỗ trợ tích hợp cho OpenPGP. |
| KMail | Máy tính để bàn | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail có hỗ trợ tích hợp cho OpenPGP. |
| Sự tiến hóa của GNOME | Máy tính để bàn | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution có hỗ trợ tích hợp cho OpenPGP. |
| Phần cuối | Máy tính để bàn | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Bạn có thể sử dụng [gpg command line tool](https://www.gnupg.org/download/) mã nguồn mở để tạo khóa mới từ dòng lệnh. |

2. Mở plugin, tạo khóa công khai và cấu hình ứng dụng email của bạn để sử dụng khóa đó.

3. Tải khóa công khai của bạn lên tại <https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>Bạn có thể truy cập <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> để quản lý khóa của mình trong tương lai.</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tiện ích bổ sung tùy chọn:
</strong>
<span>
Nếu bạn đang sử dụng dịch vụ <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">lưu trữ được mã hóa (IMAP/POP3)</a> của chúng tôi và muốn <i>tất cả</i> email được lưu trữ trong cơ sở dữ liệu SQLite (đã được mã hóa) của bạn được mã hóa bằng khóa công khai, hãy truy cập <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ: <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Chỉnh sửa <i class="fa fa-angle-right"></i> Mở PGP và tải lên khóa công khai của bạn.
</span>
</div>

4. Thêm bản ghi `CNAME` mới vào tên miền của bạn (ví dụ: `example.com`):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Kiểu</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>openpgpkey</code></td>
<td class="text-center">3600</td>
<td class="notranslate">CNAME</td>
<td><code>wkd.keys.openpgp.org</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>Nếu bí danh của bạn đang sử dụng <a class="alert-link" href="/disposable-addresses" target="_blank">tên miền tùy chỉnh/dùng một lần</a> của chúng tôi (ví dụ: <code>hideaddress.net</code>), thì bạn có thể bỏ qua bước này.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Xin chúc mừng!
</strong>
<span>
Bạn đã hoàn thành tất cả các bước.
</span>
</div>
</div>

### Bạn có hỗ trợ MTA-STS không {#do-you-support-mta-sts}

Có, kể từ ngày 2 tháng 3 năm 2023, chúng tôi hỗ trợ [MTA-STS](https://www.hardenize.com/blog/mta-sts). Bạn có thể sử dụng [mẫu này](https://github.com/jpawlowski/mta-sts.template) nếu muốn bật tính năng này trên miền của mình.

Cấu hình của chúng tôi có thể được tìm thấy công khai trên GitHub tại <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Bạn có hỗ trợ khóa mật khẩu và WebAuthn không {#do-you-support-passkeys-and-webauthn}

Có! Kể từ ngày 13 tháng 12 năm 2023, chúng tôi đã thêm hỗ trợ cho mã khóa [do nhu cầu cao](https://github.com/orgs/forwardemail/discussions/182).

Khóa mật khẩu cho phép bạn đăng nhập an toàn mà không cần mật khẩu và xác thực hai yếu tố.

Bạn có thể xác thực danh tính của mình bằng cách chạm, nhận dạng khuôn mặt, mật khẩu trên thiết bị hoặc mã PIN.

Chúng tôi cho phép bạn quản lý tối đa 30 mã khóa cùng lúc để bạn có thể đăng nhập dễ dàng bằng mọi thiết bị.

Tìm hiểu thêm về khóa thông hành tại các liên kết sau:

* [Đăng nhập vào ứng dụng và trang web của bạn bằng mật khẩu](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Sử dụng mật khẩu để đăng nhập vào ứng dụng và trang web trên iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Bài viết trên Wikipedia về Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Bạn có hỗ trợ các biện pháp tốt nhất về email không {#do-you-support-email-best-practices}

Có. Chúng tôi tích hợp sẵn hỗ trợ SPF, DKIM, DMARC, ARC và SRS trên tất cả các gói dịch vụ. Chúng tôi cũng đã hợp tác chặt chẽ với các tác giả ban đầu của các thông số kỹ thuật này và các chuyên gia email khác để đảm bảo tính hoàn hảo và khả năng gửi email thành công cao.

### Bạn có hỗ trợ webhooks trả lại không {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
Bạn đang tìm kiếm tài liệu về webhooks email? Xem <a href="/faq#do-you-support-webhooks" class="alert-link">Bạn có hỗ trợ webhooks không?</a> để biết thêm thông tin chi tiết.
<span>
</span>
</div>

Có, kể từ ngày 14 tháng 8 năm 2024, chúng tôi đã thêm tính năng này. Giờ đây, bạn có thể vào Tài khoản của tôi → Tên miền → Cài đặt → URL Webhook trả về và cấu hình URL `http://` hoặc `https://` mà chúng tôi sẽ gửi yêu cầu `POST` đến bất cứ khi nào email SMTP gửi đi bị trả về.

Tính năng này hữu ích cho bạn trong việc quản lý và giám sát SMTP gửi đi – và có thể được sử dụng để duy trì người đăng ký, chọn không tham gia và phát hiện bất cứ khi nào xảy ra lỗi trả lại.

Tải trọng webhook Bounce được gửi dưới dạng JSON với các thuộc tính sau:

* `email_id` (Chuỗi) - ID email tương ứng với email trong Tài khoản của tôi → Email (SMTP gửi đi)
* `list_id` (Chuỗi) - giá trị tiêu đề `List-ID` (không phân biệt chữ hoa chữ thường) nếu có, từ email gửi đi ban đầu
* `list_unsubscribe` (Chuỗi) - giá trị tiêu đề `List-Unsubscribe` (không phân biệt chữ hoa chữ thường) nếu có, từ email gửi đi ban đầu
* `feedback_id` (Chuỗi) - giá trị tiêu đề `Feedback-ID` (không phân biệt chữ hoa chữ thường) nếu có, từ email gửi đi ban đầu
* `recipient` (Chuỗi) - địa chỉ email của người nhận bị trả lại hoặc lỗi
* `message` (Chuỗi) - thông báo lỗi chi tiết cho lần trả lại
* `response` (Chuỗi) - phản hồi SMTP tin nhắn
* `list_id`0 (Số) - mã phản hồi SMTP đã được phân tích cú pháp
* `list_id`1 (Chuỗi) - nếu mã phản hồi đến từ một nguồn đáng tin cậy, giá trị này sẽ được điền bằng tên miền gốc (ví dụ: `list_id`2 hoặc `list_id`3)
* `list_id`4 (Đối tượng) - một đối tượng chứa các thuộc tính sau, mô tả chi tiết trạng thái trả lại và từ chối
* `list_id`5 (Chuỗi) - hành động trả lại (ví dụ: `list_id`6)
* `list_id`7 (Chuỗi) - lý do trả lại (ví dụ: `list_id`8)
* `list_id`9 (Chuỗi) - danh mục trả lại (ví dụ: `List-ID`0)
* `List-ID`1 (Số) - mã trạng thái trả lại (ví dụ: `List-ID`2)
* `List-ID`3 (Chuỗi) - mã trả lại từ tin nhắn phản hồi (ví dụ: `List-ID`4)
* `List-ID`5 (Số) - số dòng đã phân tích cú pháp, nếu có, `List-ID`6 (ví dụ: `List-ID`7)
* `List-ID`8 (Đối tượng) - cặp giá trị khóa của tiêu đề cho email gửi đi
* `List-ID`9 (Chuỗi) - `list_unsubscribe`0 định dạng Ngày xảy ra lỗi trả lại

Ví dụ:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Sau đây là một số lưu ý bổ sung về webhook trả lại:

* Nếu tải trọng webhook chứa giá trị `list_id`, `list_unsubscribe` hoặc `feedback_id`, thì bạn nên thực hiện hành động thích hợp để xóa `recipient` khỏi danh sách nếu cần.
* Nếu giá trị `bounce.category` là một `"block"`, `"recipient"`, `"spam"` hoặc `"virus"`, thì bạn chắc chắn nên xóa người dùng khỏi danh sách.
* Nếu bạn cần xác minh tải trọng webhook (để đảm bảo chúng thực sự đến từ máy chủ của chúng tôi), thì bạn có thể [giải quyết địa chỉ IP của máy khách từ xa tên máy chủ của máy khách bằng cách sử dụng tra cứu ngược](https://nodejs.org/api/dns.html#dnspromisesreverseip) – giá trị đó phải là `list_unsubscribe`0.
* Bạn cũng có thể kiểm tra IP với `list_unsubscribe`1.
* Vào Tài khoản của tôi → Tên miền → Cài đặt → Khóa Xác minh Tải trọng Chữ ký Webhook để lấy khóa webhook của bạn.
* Bạn có thể thay đổi khóa này bất kỳ lúc nào vì lý do bảo mật.
* Tính toán và so sánh giá trị `list_unsubscribe`2 từ yêu cầu webhook của chúng tôi với giá trị phần thân được tính toán bằng khóa này. Ví dụ về cách thực hiện việc này có tại `list_unsubscribe`3.
* Xem phần thảo luận tại <`list_unsubscribe`4 để biết thêm thông tin chi tiết.
* Chúng tôi sẽ đợi tối đa `list_unsubscribe`5 giây để điểm cuối webhook của bạn phản hồi với mã trạng thái `list_unsubscribe`6 và chúng tôi sẽ thử lại tối đa `list_unsubscribe`7 lần.
* Nếu chúng tôi phát hiện URL webhook trả lại của bạn có lỗi trong khi chúng tôi cố gắng gửi yêu cầu đến URL đó, chúng tôi sẽ gửi cho bạn một email hỗ trợ mỗi tuần một lần.

### Bạn có hỗ trợ webhooks không {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
Bạn đang tìm kiếm tài liệu về webhooks trả lại? Xem <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Bạn có hỗ trợ webhooks trả lại không?</a> để biết thêm thông tin chi tiết.
<span>
</span>
</div>

Có, kể từ ngày 15 tháng 5 năm 2020, chúng tôi đã thêm tính năng này. Bạn có thể dễ dàng thêm webhook giống như với bất kỳ người nhận nào! Vui lòng đảm bảo bạn đã thêm tiền tố giao thức "http" hoặc "https" vào URL của webhook.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Bảo vệ Quyền riêng tư Nâng cao:
</strong>
<span>
Nếu bạn đang sử dụng gói trả phí (có tính năng bảo vệ quyền riêng tư nâng cao), vui lòng truy cập <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> và nhấp vào "Bí danh" bên cạnh tên miền của bạn để cấu hình webhooks. Nếu bạn muốn tìm hiểu thêm về các gói trả phí, hãy xem trang <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Bảng giá</a> của chúng tôi. Nếu không, bạn có thể tiếp tục làm theo hướng dẫn bên dưới.
</span>
</div>

Nếu bạn đang sử dụng gói miễn phí, chỉ cần thêm bản ghi DNS <strong class="notranslate">TXT</strong> mới như hiển thị bên dưới:

Ví dụ, nếu tôi muốn tất cả email gửi đến `alias@example.com` được chuyển tiếp đến điểm cuối thử nghiệm [yêu cầu thùng rác](https://requestbin.com/r/en8pfhdgcculn?inspect) mới:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Hoặc có thể bạn muốn tất cả email gửi đến `example.com` được chuyển tiếp đến điểm cuối này:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Dưới đây là các lưu ý bổ sung về webhooks:**

* Nếu bạn cần xác minh tải trọng webhook (để đảm bảo chúng thực sự đến từ máy chủ của chúng tôi), bạn có thể sử dụng [giải quyết địa chỉ IP của máy khách từ xa tên máy chủ của máy khách bằng cách sử dụng tra cứu ngược](https://nodejs.org/api/dns.html#dnspromisesreverseip) – giá trị này phải là `mx1.forwardemail.net` hoặc `mx2.forwardemail.net`.
* Bạn cũng có thể kiểm tra IP với [địa chỉ IP đã công bố của chúng tôi](#what-are-your-servers-ip-addresses).
* Nếu bạn đang sử dụng gói trả phí, hãy vào Tài khoản của tôi → Tên miền → Cài đặt → Khóa Xác minh Tải trọng Chữ ký Webhook để lấy khóa webhook.
* Bạn có thể thay đổi khóa này bất kỳ lúc nào vì lý do bảo mật.
* Tính toán và so sánh giá trị `X-Webhook-Signature` từ yêu cầu webhook của chúng tôi với giá trị phần thân được tính toán bằng khóa này. Ví dụ về cách thực hiện việc này có tại [bài đăng Stack Overflow này](https://stackoverflow.com/a/68885281).
* Xem phần thảo luận tại <https://github.com/forwardemail/free-email-forwarding/issues/235> để biết thêm thông tin chi tiết.
* Nếu webhook không phản hồi với mã trạng thái `200`, chúng tôi sẽ lưu trữ phản hồi của nó trong [nhật ký lỗi đã được tạo](#do-you-store-error-logs) – điều này rất hữu ích cho việc gỡ lỗi.
* Các yêu cầu HTTP của webhook sẽ thử lại tối đa 3 lần cho mỗi lần kết nối SMTP, với thời gian chờ tối đa 60 giây cho mỗi yêu cầu POST điểm cuối. **Lưu ý rằng điều này không có nghĩa là nó chỉ thử lại 3 lần**, mà thực tế nó sẽ thử lại liên tục theo thời gian bằng cách gửi mã SMTP là 421 (cho người gửi biết thử lại sau) sau lần thử yêu cầu HTTP POST không thành công thứ 3. Điều này có nghĩa là email sẽ thử lại liên tục trong nhiều ngày cho đến khi đạt được mã trạng thái 200.
* Chúng tôi sẽ tự động thử lại dựa trên mã trạng thái và mã lỗi mặc định được sử dụng trong [phương pháp thử lại của siêu tác nhân](https://ladjs.github.io/superagent/#retrying-requests) (chúng tôi là người bảo trì).
* Chúng tôi nhóm các yêu cầu HTTP của webhook đến cùng một điểm cuối thành một yêu cầu thay vì nhiều yêu cầu) để tiết kiệm tài nguyên và tăng tốc thời gian phản hồi. Ví dụ: nếu bạn gửi email đến <webhook1@example.com>, <webhook2@example.com> và <webhook3@example.com>, và tất cả các địa chỉ này đều được cấu hình để truy cập cùng một URL điểm cuối *chính xác*, thì chỉ một yêu cầu sẽ được thực hiện. Chúng tôi nhóm lại với nhau bằng cách so khớp điểm cuối chính xác với sự tương đương nghiêm ngặt.
* Lưu ý rằng chúng tôi sử dụng phương thức "simpleParser" của thư viện `mx1.forwardemail.net`0 để phân tích cú pháp tin nhắn thành một đối tượng JSON thân thiện.
* Giá trị email thô dưới dạng Chuỗi được cung cấp dưới dạng thuộc tính "raw".
* Kết quả xác thực được cung cấp dưới dạng các thuộc tính "dkim", "spf", "arc", "dmarc" và "bimi".
* Tiêu đề email đã phân tích cú pháp được cung cấp dưới dạng thuộc tính "headers" – nhưng cũng lưu ý rằng bạn có thể sử dụng "headerLines" để lặp lại và phân tích cú pháp dễ dàng hơn.
* Những người nhận được nhóm cho webhook này được nhóm lại với nhau và được cung cấp dưới dạng thuộc tính "recipients".
* Thông tin phiên SMTP được cung cấp dưới dạng thuộc tính "session". Thuộc tính này chứa thông tin về người gửi tin nhắn, thời gian đến của tin nhắn, HELO và tên máy chủ của máy khách. Giá trị tên máy chủ của máy khách là `mx1.forwardemail.net`1 có thể là FQDN (từ tra cứu PTR ngược) hoặc là `mx1.forwardemail.net`2 được đặt trong dấu ngoặc vuông (ví dụ: `mx1.forwardemail.net`3).
* Nếu bạn cần một cách nhanh chóng để lấy giá trị của `mx1.forwardemail.net`4, thì bạn có thể sử dụng giá trị của `mx1.forwardemail.net`5 (xem ví dụ bên dưới). Tiêu đề `mx1.forwardemail.net`6 là tiêu đề chúng tôi thêm vào tin nhắn để gỡ lỗi với người nhận ban đầu (trước khi chuyển tiếp ẩn) cho tin nhắn.

* Nếu bạn cần xóa các thuộc tính `mx1.forwardemail.net`7 và/hoặc `mx1.forwardemail.net`8 khỏi phần thân payload, chỉ cần thêm `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 hoặc `mx2.forwardemail.net`1 vào điểm cuối webhook của bạn dưới dạng tham số chuỗi truy vấn (ví dụ: `mx2.forwardemail.net`2).
* Nếu có tệp đính kèm, chúng sẽ được thêm vào Mảng `mx2.forwardemail.net`3 với các giá trị Bộ đệm. Bạn có thể phân tích cú pháp chúng thành nội dung bằng cách sử dụng một phương pháp với JavaScript như sau:

  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
Bạn có tò mò muốn biết yêu cầu webhook trông như thế nào trong các email được chuyển tiếp không? Chúng tôi đã đính kèm một ví dụ bên dưới cho bạn!
<span>
</span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### Bạn có hỗ trợ biểu thức chính quy hoặc regex không {#do-you-support-regular-expressions-or-regex}

Có, kể từ ngày 27 tháng 9 năm 2021, chúng tôi đã thêm tính năng này. Bạn chỉ cần viết biểu thức chính quy ("regex") để khớp các bí danh và thực hiện thay thế.

Các bí danh được hỗ trợ bởi biểu thức chính quy là các bí danh bắt đầu bằng `/` và kết thúc bằng `/`, với người nhận là địa chỉ email hoặc webhook. Người nhận cũng có thể bao gồm hỗ trợ thay thế regex (ví dụ: `$1`, `$2`).

Chúng tôi hỗ trợ hai cờ biểu thức chính quy, bao gồm `i` và `g`. Cờ không phân biệt chữ hoa chữ thường `i` là mặc định cố định và luôn được áp dụng. Bạn có thể thêm cờ toàn cục `g` bằng cách thêm `/g` vào đuôi `/`.

Xin lưu ý rằng chúng tôi cũng hỗ trợ <a href="#can-i-disable-specific-aliases">disabled tính năng bí danh</a> cho phần người nhận với sự hỗ trợ biểu thức chính quy của chúng tôi.

Biểu thức chính quy không được hỗ trợ trên <a href="/disposable-addresses" target="_blank">tên miền ảo toàn cầu</a> (vì đây có thể là lỗ hổng bảo mật).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Bảo vệ Quyền riêng tư Nâng cao:
</strong>
<span>
Nếu bạn đang sử dụng gói trả phí (có tính năng bảo vệ quyền riêng tư nâng cao), vui lòng truy cập <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> và nhấp vào "Bí danh" bên cạnh tên miền của bạn để cấu hình biểu thức chính quy. Nếu bạn muốn tìm hiểu thêm về các gói trả phí, hãy xem trang <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Bảng giá</a> của chúng tôi. Nếu không, bạn có thể tiếp tục làm theo hướng dẫn bên dưới.
</span>
</div>

Nếu bạn đang sử dụng gói miễn phí, chỉ cần thêm bản ghi DNS <strong class="notranslate">TXT</strong> mới bằng cách sử dụng một hoặc nhiều ví dụ được cung cấp bên dưới:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ví dụ đơn giản:</strong> Nếu tôi muốn tất cả email gửi đến `linus@example.com` hoặc `torvalds@example.com` được chuyển tiếp đến `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ví dụ về thay thế Họ/Tên:</strong> Hãy tưởng tượng tất cả địa chỉ email công ty của bạn đều theo mẫu `firstname.lastname@example.com`. Nếu tôi muốn tất cả email gửi đến mẫu `firstname.lastname@example.com` được chuyển tiếp đến `firstname.lastname@company.com` với hỗ trợ thay thế (<a href="https://regexr.com/66hnu" class="alert-link">xem thử nghiệm trên RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ví dụ về thay thế ký hiệu dấu cộng:</strong> Nếu tôi muốn tất cả email gửi đến `info@example.com` hoặc `support@example.com` được chuyển tiếp đến `user+info@gmail.com` hoặc `user+support@gmail.com` (có hỗ trợ thay thế) (<a href="https://regexr.com/66ho7" class="alert-link">xem thử nghiệm trên RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ví dụ về Thay thế Chuỗi Truy vấn Webhook:</strong> Có lẽ bạn muốn tất cả email gửi đến `example.com` đều được chuyển đến một <a href="#do-you-support-webhooks" class="alert-link">webhook</a> và có khóa chuỗi truy vấn động là "to" với giá trị là phần tên người dùng của địa chỉ email (<a href="https://regexr.com/66ho4" class="alert-link">xem thử nghiệm trên RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ví dụ về từ chối thầm lặng:</strong> Nếu bạn muốn tất cả email khớp với một mẫu nhất định bị vô hiệu hóa và từ chối thầm lặng (người gửi sẽ thấy như thể tin nhắn đã được gửi thành công, nhưng thực tế không đi đến đâu) với mã trạng thái `250` (xem <a href="#can-i-disable-specific-aliases" class="alert-link">Tôi có thể vô hiệu hóa các bí danh cụ thể không</a>), thì chỉ cần sử dụng phương pháp tương tự với một dấu chấm than "!". Điều này cho người gửi biết rằng tin nhắn đã được gửi thành công, nhưng thực tế không đi đến đâu (ví dụ: blackhole hoặc `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Kiểu</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ví dụ về từ chối mềm:</strong> Nếu bạn muốn tắt tất cả email trùng với một mẫu nhất định và từ chối mềm với mã trạng thái `421` (xem <a href="#can-i-disable-specific-aliases" class="alert-link">Tôi có thể tắt các bí danh cụ thể không</a>), hãy sử dụng cách tiếp cận tương tự với dấu chấm than kép "!!". Điều này báo hiệu cho người gửi thử lại email của họ và email gửi đến bí danh này sẽ được thử lại trong khoảng 5 ngày và sau đó từ chối vĩnh viễn.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Kiểu</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Ví dụ về từ chối cứng:</strong> Nếu bạn muốn tất cả email khớp với một mẫu nhất định bị vô hiệu hóa và từ chối cứng với mã trạng thái `550` (xem <a href="#can-i-disable-specific-aliases" class="alert-link">Tôi có thể vô hiệu hóa các bí danh cụ thể không</a>), thì chỉ cần sử dụng phương pháp tương tự với ba dấu chấm than "!!!". Điều này báo hiệu cho người gửi biết về một lỗi cố định và email sẽ không được gửi lại, chúng sẽ bị từ chối vì bí danh này.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Kiểu</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>

Bạn tò mò về cách viết biểu thức chính quy hoặc cần kiểm tra phần thay thế của mình? Bạn có thể truy cập trang web kiểm tra biểu thức chính quy miễn phí <a href="https://regexr.com" class="alert-link">RegExr</a> tại <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Giới hạn SMTP gửi đi của bạn là bao nhiêu {#what-are-your-outbound-smtp-limits}

Chúng tôi giới hạn người dùng và tên miền ở mức 300 tin nhắn SMTP gửi đi mỗi ngày. Trung bình mỗi tháng dương lịch có hơn 9000 email. Nếu bạn cần vượt quá số lượng này hoặc thường xuyên có lượng email lớn, vui lòng chọn [liên hệ với chúng tôi](https://forwardemail.net/help).

### Tôi có cần phê duyệt để bật SMTP {#do-i-need-approval-to-enable-smtp} không?

Vâng, xin lưu ý rằng để duy trì uy tín IP và đảm bảo khả năng gửi thư, Forward Email có quy trình xem xét thủ công trên từng tên miền để phê duyệt SMTP gửi đi. Vui lòng gửi email đến địa chỉ <support@forwardemail.net> hoặc mở [yêu cầu trợ giúp](https://forwardemail.net/help) để được phê duyệt. Quá trình này thường mất chưa đến 24 giờ, với hầu hết các yêu cầu được xử lý trong vòng 1-2 giờ. Trong tương lai gần, chúng tôi đặt mục tiêu thực hiện quy trình này ngay lập tức với các biện pháp kiểm soát thư rác và cảnh báo bổ sung. Quy trình này đảm bảo email của bạn đến được hộp thư đến và thư của bạn không bị đánh dấu là thư rác.

### Cài đặt cấu hình máy chủ SMTP của bạn là gì {#what-are-your-smtp-server-configuration-settings}

Máy chủ của chúng tôi là `smtp.forwardemail.net` và cũng được theo dõi trên <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">trang trạng thái</a> của chúng tôi.

Nó hỗ trợ cả IPv4 và IPv6 và có sẵn trên các cổng `465` và `2465` cho SSL/TLS và `587`, `2587`, `2525` và `25` cho TLS (STARTTLS).

| Giao thức | Tên máy chủ | Cổng | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Ưu tiên** | `smtp.forwardemail.net` | `465`, `2465` | :white_check_mark: | :white_check_mark: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: |

| Đăng nhập | Ví dụ | Sự miêu tả |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên người dùng | `user@example.com` | Địa chỉ email của bí danh tồn tại cho tên miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a>. |
| Mật khẩu | `************************` | Mật khẩu được tạo theo bí danh cụ thể. |

Để gửi email đi bằng SMTP, **người dùng SMTP** phải là địa chỉ email của bí danh tồn tại cho tên miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> – và **mật khẩu SMTP** phải là mật khẩu do bí danh tạo ra.

Vui lòng tham khảo [Bạn có hỗ trợ gửi email bằng SMTP không?](#do-you-support-sending-email-with-smtp) để biết hướng dẫn từng bước.

### Cài đặt cấu hình máy chủ IMAP của bạn là gì {#what-are-your-imap-server-configuration-settings}

Máy chủ của chúng tôi là `imap.forwardemail.net` và cũng được theo dõi trên <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">trang trạng thái</a> của chúng tôi.

Nó hỗ trợ cả IPv4 và IPv6 và có sẵn trên các cổng `993` và `2993` cho SSL/TLS.

| Giao thức | Tên máy chủ | Cổng | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Ưu tiên** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Đăng nhập | Ví dụ | Sự miêu tả |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên người dùng | `user@example.com` | Địa chỉ email của bí danh tồn tại cho tên miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a>. |
| Mật khẩu | `************************` | Mật khẩu được tạo theo bí danh cụ thể. |

Để kết nối với IMAP, **người dùng IMAP** phải là địa chỉ email của bí danh tồn tại cho tên miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> – và **mật khẩu IMAP** phải là mật khẩu do bí danh tạo ra.

Vui lòng tham khảo [Bạn có hỗ trợ nhận email bằng IMAP không?](#do-you-support-receiving-email-with-imap) để biết hướng dẫn từng bước.

### Cài đặt cấu hình máy chủ POP3 của bạn là gì {#what-are-your-pop3-server-configuration-settings}

Máy chủ của chúng tôi là `pop3.forwardemail.net` và cũng được theo dõi trên <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">trang trạng thái</a> của chúng tôi.

Nó hỗ trợ cả IPv4 và IPv6 và có sẵn trên các cổng `995` và `2995` cho SSL/TLS.

| Giao thức | Tên máy chủ | Cổng | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Ưu tiên** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |

| Đăng nhập | Ví dụ | Sự miêu tả |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên người dùng | `user@example.com` | Địa chỉ email của bí danh tồn tại cho tên miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a>. |
| Mật khẩu | `************************` | Mật khẩu được tạo theo bí danh cụ thể. |

Để kết nối với POP3, **người dùng POP3** phải là địa chỉ email của một bí danh tồn tại cho tên miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> – và **mật khẩu IMAP** phải là mật khẩu do bí danh tạo ra.

Vui lòng tham khảo [Bạn có hỗ trợ POP3 không?](#do-you-support-pop3) để biết hướng dẫn từng bước.

### Cấu hình chuyển tiếp SMTP Postfix {#postfix-smtp-relay-configuration}

Bạn có thể cấu hình Postfix để chuyển tiếp email qua máy chủ SMTP của Forward Email. Điều này hữu ích cho các ứng dụng máy chủ cần gửi email.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Thời gian thiết lập ước tính:</strong>
<span>Dưới 15 phút</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Điều này yêu cầu gói trả phí có bật quyền truy cập SMTP.
</span>
</div>

#### Cài đặt {#installation}

1. Cài đặt Postfix trên máy chủ của bạn:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Trong quá trình cài đặt, hãy chọn "Internet Site" khi được nhắc nhập loại cấu hình.

#### Cấu hình {#configuration}

1. Chỉnh sửa tệp cấu hình Postfix chính:

```bash
sudo nano /etc/postfix/main.cf
```

2. Thêm hoặc sửa đổi các cài đặt sau:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Tạo tệp mật khẩu SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Thêm thông tin đăng nhập Email chuyển tiếp của bạn:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Bảo mật và băm tệp mật khẩu:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Khởi động lại Postfix:

```bash
sudo systemctl restart postfix
```

#### Kiểm tra {#testing}

Kiểm tra cấu hình của bạn bằng cách gửi email thử nghiệm:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Bảo mật {#security}

### Kỹ thuật tăng cường bảo mật máy chủ nâng cao {#advanced-server-hardening-techniques}

> \[!TIP]
> Tìm hiểu thêm về cơ sở hạ tầng bảo mật của chúng tôi tại [trang Bảo mật của chúng tôi](/security).

Forward Email triển khai nhiều kỹ thuật tăng cường bảo mật máy chủ để đảm bảo an ninh cho cơ sở hạ tầng và dữ liệu của bạn:

1. **Bảo mật mạng**:
* Tường lửa bảng IP với các quy tắc nghiêm ngặt
* Fail2ban để bảo vệ chống tấn công brute force
* Kiểm tra bảo mật và kiểm tra xâm nhập thường xuyên
* Quyền truy cập quản trị chỉ dành cho VPN

2. **Củng cố hệ thống**:
* Cài đặt gói tối thiểu
* Cập nhật bảo mật thường xuyên
* SELinux ở chế độ thực thi
* Vô hiệu hóa quyền truy cập SSH gốc
* Chỉ xác thực bằng khóa

3. **Bảo mật ứng dụng**:
* Tiêu đề Chính sách bảo mật nội dung (CSP)
* Bảo mật truyền tải nghiêm ngặt HTTPS (HSTS)
* Tiêu đề bảo vệ XSS
* Tùy chọn khung và tiêu đề chính sách giới thiệu
* Kiểm tra phụ thuộc thường xuyên

4. **Bảo vệ dữ liệu**:
* Mã hóa toàn bộ ổ đĩa bằng LUKS
* Quản lý khóa an toàn
* Sao lưu thường xuyên bằng mã hóa
* Thực hành giảm thiểu dữ liệu

5. **Giám sát và Phản hồi**:
* Phát hiện xâm nhập theo thời gian thực
* Quét bảo mật tự động
* Ghi nhật ký và phân tích tập trung
* Quy trình ứng phó sự cố

> \[!IMPORTANT]
> Các biện pháp bảo mật của chúng tôi liên tục được cập nhật để giải quyết các mối đe dọa và lỗ hổng mới nổi.

> \[!TIP]
> Để bảo mật tối đa, chúng tôi khuyên bạn nên sử dụng dịch vụ của chúng tôi với mã hóa đầu cuối thông qua OpenPGP.

### Bạn có chứng chỉ SOC 2 hoặc ISO 27001 không {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Chuyển tiếp Email hoạt động trên cơ sở hạ tầng do các bộ xử lý phụ được chứng nhận cung cấp để đảm bảo tuân thủ các tiêu chuẩn ngành.

Forward Email không trực tiếp sở hữu chứng chỉ SOC 2 Loại II hoặc ISO 27001. Tuy nhiên, dịch vụ này hoạt động trên cơ sở hạ tầng được cung cấp bởi các đơn vị xử lý phụ được chứng nhận:

* **DigitalOcean**: Được chứng nhận SOC 2 Loại II và SOC 3 Loại II (được kiểm toán bởi Schellman & Company LLC), được chứng nhận ISO 27001 tại nhiều trung tâm dữ liệu. Chi tiết: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: Được chứng nhận SOC 2+ (HIPAA), chứng nhận ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Chi tiết: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: Tuân thủ SOC 2 (liên hệ trực tiếp với DataPacket để xin chứng nhận), nhà cung cấp cơ sở hạ tầng cấp doanh nghiệp (địa điểm Denver). Chi tiết: <https://www.datapacket.com/datacenters/denver>

Forward Email tuân thủ các thông lệ tốt nhất của ngành về kiểm tra bảo mật và thường xuyên hợp tác với các nhà nghiên cứu bảo mật độc lập. Nguồn: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Bạn có sử dụng mã hóa TLS để chuyển tiếp email không {#do-you-use-tls-encryption-for-email-forwarding}

Có. Forward Email áp dụng nghiêm ngặt TLS 1.2+ cho tất cả các kết nối (HTTPS, SMTP, IMAP, POP3) và triển khai MTA-STS để hỗ trợ TLS nâng cao. Việc triển khai bao gồm:

* Thực thi TLS 1.2+ cho tất cả các kết nối email
* Trao đổi khóa ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) đảm bảo tính bảo mật chuyển tiếp hoàn hảo
* Bộ mã hóa hiện đại với các bản cập nhật bảo mật thường xuyên
* Hỗ trợ HTTP/2 để cải thiện hiệu suất và bảo mật
* HSTS (HTTP Strict Transport Security) với tính năng tải trước trong các trình duyệt chính
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** để thực thi TLS nghiêm ngặt

Nguồn: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Triển khai MTA-STS**: Forward Email triển khai việc thực thi MTA-STS nghiêm ngặt trong cơ sở mã. Khi xảy ra lỗi TLS và MTA-STS được áp dụng, hệ thống sẽ trả về mã trạng thái SMTP 421 để đảm bảo email được gửi lại sau đó thay vì bị gửi đi một cách không an toàn. Chi tiết triển khai:

* Phát hiện lỗi TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Thực thi MTA-STS trong trình trợ giúp gửi email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Xác thực của bên thứ ba: <https://www.hardenize.com/report/forwardemail.net/1750312779> hiển thị xếp hạng "Tốt" cho tất cả các biện pháp bảo mật TLS và vận chuyển.

### Bạn có lưu giữ tiêu đề xác thực email không {#do-you-preserve-email-authentication-headers}

Có. Forward Email triển khai và lưu giữ toàn diện các tiêu đề xác thực email:

* **SPF (Khung Chính sách Người gửi)**: Được triển khai và bảo quản đúng cách
* **DKIM (Thư được Xác thực Khóa Miền)**: Hỗ trợ đầy đủ với quản lý khóa phù hợp
* **DMARC**: Thực thi chính sách đối với các email không vượt qua xác thực SPF hoặc DKIM
* **ARC**: Mặc dù không được nêu chi tiết rõ ràng, nhưng điểm tuân thủ hoàn hảo của dịch vụ cho thấy khả năng xử lý tiêu đề xác thực toàn diện

Nguồn: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Xác thực: Kiểm tra Thư Internet.nl cho thấy điểm số 100/100 cho việc triển khai "SPF, DKIM và DMARC". Đánh giá Hardenize xác nhận xếp hạng "Tốt" cho SPF và DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Bạn có giữ nguyên tiêu đề email gốc và ngăn chặn việc giả mạo không {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Email chuyển tiếp triển khai tính năng bảo vệ chống giả mạo tinh vi để ngăn chặn việc lạm dụng email.

Forward Email giữ nguyên tiêu đề email gốc trong khi triển khai tính năng bảo vệ chống giả mạo toàn diện thông qua cơ sở mã MX:

* **Bảo toàn Tiêu đề**: Tiêu đề xác thực gốc được duy trì trong quá trình chuyển tiếp
* **Chống Giả mạo**: Việc thực thi chính sách DMARC ngăn chặn giả mạo tiêu đề bằng cách từ chối các email không vượt qua xác thực SPF hoặc DKIM
* **Ngăn chặn Tiêm Tiêu đề**: Xác thực và khử trùng đầu vào bằng thư viện striptags
* **Bảo vệ Nâng cao**: Phát hiện lừa đảo tinh vi với hệ thống phát hiện giả mạo, ngăn chặn mạo danh và thông báo cho người dùng

**Chi tiết triển khai MX**: Logic xử lý email cốt lõi được xử lý bởi cơ sở mã máy chủ MX, cụ thể là:

* Trình xử lý dữ liệu MX chính: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Lọc email tùy ý (chống giả mạo): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Trình trợ giúp `isArbitrary` triển khai các quy tắc chống giả mạo tinh vi bao gồm phát hiện mạo danh tên miền, cụm từ bị chặn và nhiều kiểu lừa đảo khác nhau.

Nguồn: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Bạn bảo vệ chống lại thư rác và lạm dụng như thế nào {#how-do-you-protect-against-spam-and-abuse}

Forward Email triển khai bảo vệ đa lớp toàn diện:

* **Giới hạn tốc độ**: Áp dụng cho các lần xác thực, điểm cuối API và kết nối SMTP
* **Cách ly tài nguyên**: Giữa những người dùng để ngăn chặn tác động từ người dùng có lưu lượng lớn
* **Bảo vệ DDoS**: Bảo vệ nhiều lớp thông qua hệ thống Shield của DataPacket và Cloudflare
* **Tự động mở rộng**: Điều chỉnh tài nguyên linh hoạt dựa trên nhu cầu
* **Ngăn chặn lạm dụng**: Kiểm tra phòng ngừa lạm dụng cụ thể cho người dùng và chặn nội dung độc hại dựa trên hàm băm
* **Xác thực email**: Giao thức SPF, DKIM, DMARC với tính năng phát hiện lừa đảo nâng cao

Nguồn:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Chi tiết bảo vệ DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Bạn có lưu trữ nội dung email trên đĩa không {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Chuyển tiếp Email sử dụng kiến trúc không kiến thức giúp ngăn nội dung email bị ghi vào đĩa.

* **Kiến trúc Zero-Knowledge**: Các hộp thư SQLite được mã hóa riêng lẻ có nghĩa là Forward Email không thể truy cập nội dung email.
* **Xử lý trong bộ nhớ**: Quá trình xử lý email diễn ra hoàn toàn trong bộ nhớ, tránh lưu trữ trên đĩa.
* **Không ghi nhật ký nội dung**: "Chúng tôi không ghi nhật ký hoặc lưu trữ nội dung email hoặc siêu dữ liệu vào đĩa"
* **Mã hóa hộp cát**: Khóa mã hóa không bao giờ được lưu trữ trên đĩa dưới dạng văn bản thuần túy

**Bằng chứng về Cơ sở Mã MX**: Máy chủ MX xử lý email hoàn toàn trong bộ nhớ mà không ghi nội dung vào đĩa. Trình xử lý email chính minh họa cách tiếp cận trong bộ nhớ này: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Nguồn:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Tóm tắt)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Chi tiết không kiến thức)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Mã hóa hộp cát)

### Nội dung email có thể bị lộ khi hệ thống gặp sự cố không {#can-email-content-be-exposed-during-system-crashes}

Không. Forward Email triển khai các biện pháp bảo vệ toàn diện chống lại việc lộ dữ liệu liên quan đến sự cố:

* **Tắt Core Dump**: Ngăn chặn việc lộ bộ nhớ khi gặp sự cố
* **Tắt Bộ nhớ Swap**: Tắt hoàn toàn để ngăn chặn việc trích xuất dữ liệu nhạy cảm từ các tệp Swap
* **Kiến trúc Trong Bộ nhớ**: Nội dung email chỉ tồn tại trong bộ nhớ tạm trong quá trình xử lý
* **Bảo vệ Khóa Mã hóa**: Khóa không bao giờ được lưu trữ trên đĩa dưới dạng văn bản thuần túy
* **Bảo mật Vật lý**: Đĩa được mã hóa LUKS v2 ngăn chặn việc truy cập vật lý vào dữ liệu
* **Lưu trữ USB bị tắt**: Ngăn chặn việc trích xuất dữ liệu trái phép

**Xử lý lỗi cho các sự cố hệ thống**: Chuyển tiếp Email sử dụng các hàm trợ giúp `isCodeBug` và `isTimeoutError` để đảm bảo rằng nếu xảy ra bất kỳ sự cố kết nối cơ sở dữ liệu, sự cố mạng DNS/danh sách chặn hoặc sự cố kết nối ngược dòng nào, hệ thống sẽ trả về mã trạng thái SMTP 421 để đảm bảo email sẽ được thử lại sau thay vì bị mất hoặc bị lộ.

Chi tiết triển khai:

* Phân loại lỗi: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Xử lý lỗi thời gian chờ trong quá trình xử lý MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Nguồn: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Ai có quyền truy cập vào cơ sở hạ tầng email của bạn {#who-has-access-to-your-email-infrastructure}

Forward Email triển khai các biện pháp kiểm soát truy cập toàn diện cho nhóm kỹ sư tối thiểu 2-3 người với các yêu cầu 2FA nghiêm ngặt:

* **Kiểm soát Truy cập Dựa trên Vai trò**: Dành cho tài khoản nhóm có quyền dựa trên tài nguyên
* **Nguyên tắc Đặc quyền Tối thiểu**: Áp dụng trên toàn bộ hệ thống
* **Phân chia Nhiệm vụ**: Giữa các vai trò vận hành
* **Quản lý Người dùng**: Phân tách người dùng triển khai và devops với các quyền riêng biệt
* **Đăng nhập Gốc bị Vô hiệu hóa**: Buộc truy cập thông qua các tài khoản đã được xác thực đúng
* **Xác thực 2 yếu tố nghiêm ngặt**: Không xác thực 2 yếu tố dựa trên SMS do nguy cơ tấn công MiTM - chỉ sử dụng mã thông báo dựa trên ứng dụng hoặc phần cứng
* **Ghi nhật ký Kiểm tra Toàn diện**: Có chức năng xóa dữ liệu nhạy cảm
* **Phát hiện Bất thường Tự động**: Đối với các kiểu truy cập bất thường
* **Đánh giá Bảo mật Định kỳ**: Nhật ký truy cập
* **Phòng ngừa Tấn công Evil Maid**: Vô hiệu hóa bộ nhớ USB và các biện pháp bảo mật vật lý khác

Nguồn:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Kiểm soát ủy quyền)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Bảo mật mạng)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Phòng chống tấn công Evil Maid)

### Bạn sử dụng nhà cung cấp cơ sở hạ tầng nào {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email sử dụng nhiều bộ xử lý cơ sở hạ tầng phụ với các chứng nhận tuân thủ toàn diện.

Thông tin chi tiết đầy đủ có sẵn trên trang tuân thủ GDPR của chúng tôi: <https://forwardemail.net/gdpr>

**Bộ xử lý cơ sở hạ tầng chính:**

| Nhà cung cấp | Được chứng nhận về Khung bảo mật dữ liệu | Trang tuân thủ GDPR |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Có | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Gói dữ liệu** | ❌ Không | <https://www.datapacket.com/privacy-policy> |
| **DigitalOcean** | ❌ Không | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Không | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Chứng nhận chi tiết:**

**DigitalOcean**

* SOC 2 Loại II & SOC 3 Loại II (đã được kiểm toán bởi Schellman & Company LLC)
* Được chứng nhận ISO 27001 tại nhiều trung tâm dữ liệu
* Tuân thủ PCI-DSS
* Được chứng nhận CSA STAR Cấp độ 1
* Được chứng nhận APEC CBPR PRP
* Chi tiết: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Được chứng nhận SOC 2+ (HIPAA)
* Tuân thủ PCI Merchant
* Được chứng nhận CSA STAR Cấp độ 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Chi tiết: <https://www.vultr.com/legal/compliance/>

**Gói dữ liệu**

* Tuân thủ SOC 2 (liên hệ trực tiếp với DataPacket để xin chứng nhận)
* Cơ sở hạ tầng cấp doanh nghiệp (tại Denver)
* Bảo vệ DDoS thông qua giải pháp an ninh mạng Shield
* Hỗ trợ kỹ thuật 24/7
* Mạng lưới toàn cầu tại 58 trung tâm dữ liệu
* Chi tiết: <https://www.datapacket.com/datacenters/denver>

**Bộ xử lý thanh toán:**

* **Stripe**: Được chứng nhận theo Khung Bảo mật Dữ liệu - <https://stripe.com/legal/privacy-center>
* **PayPal**: Chưa được chứng nhận theo DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Bạn có cung cấp Thỏa thuận xử lý dữ liệu (DPA) không {#do-you-offer-a-data-processing-agreement-dpa}

Có, Forward Email cung cấp Thỏa thuận Xử lý Dữ liệu (DPA) toàn diện có thể được ký kết cùng với thỏa thuận doanh nghiệp của chúng tôi. Bản sao DPA của chúng tôi có sẵn tại: <https://forwardemail.net/dpa>

**Chi tiết về DPA:**

* Bao gồm tuân thủ GDPR và khuôn khổ Bảo vệ Quyền riêng tư EU-Hoa Kỳ/Thụy Sĩ-Hoa Kỳ
* Tự động chấp nhận khi đồng ý với Điều khoản Dịch vụ của chúng tôi
* Không yêu cầu chữ ký riêng cho DPA tiêu chuẩn
* Có sẵn các thỏa thuận DPA tùy chỉnh thông qua Giấy phép Doanh nghiệp

**Khung Tuân thủ GDPR:**
DPA của chúng tôi nêu chi tiết việc tuân thủ GDPR cũng như các yêu cầu chuyển giao dữ liệu quốc tế. Thông tin đầy đủ có tại: <https://forwardemail.net/gdpr>

Đối với khách hàng doanh nghiệp yêu cầu các điều khoản DPA tùy chỉnh hoặc thỏa thuận hợp đồng cụ thể, những vấn đề này có thể được giải quyết thông qua chương trình **Giấy phép doanh nghiệp (250 đô la/tháng)** của chúng tôi.

### Bạn xử lý thông báo vi phạm dữ liệu như thế nào {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Kiến trúc không kiến thức của Email chuyển tiếp giúp hạn chế đáng kể tác động của vi phạm.

* **Hạn chế tiết lộ dữ liệu**: Không thể truy cập nội dung email được mã hóa do kiến trúc không kiến thức
* **Thu thập dữ liệu tối thiểu**: Chỉ thông tin cơ bản về người đăng ký và nhật ký IP hạn chế để bảo mật
* **Khung xử lý phụ**: DigitalOcean và Vultr duy trì các quy trình ứng phó sự cố tuân thủ GDPR

**Thông tin về Đại diện GDPR:**
Forward Email đã chỉ định đại diện GDPR theo Điều 27:

**Đại diện EU:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Đại diện tại Vương quốc Anh:**
Osano UK Compliance LTD
Gửi: LFHC
42-46 Đường Fountain, Belfast
Antrim, BT1 - 5EF

Đối với khách hàng doanh nghiệp yêu cầu SLA thông báo vi phạm cụ thể, những điều này cần được thảo luận như một phần của thỏa thuận **Giấy phép doanh nghiệp**.

Nguồn:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Bạn có cung cấp môi trường thử nghiệm không {#do-you-offer-a-test-environment}

Tài liệu kỹ thuật của Forward Email không mô tả rõ ràng chế độ hộp cát chuyên dụng. Tuy nhiên, các phương pháp thử nghiệm tiềm năng bao gồm:

* **Tùy chọn tự lưu trữ**: Khả năng tự lưu trữ toàn diện để tạo môi trường thử nghiệm
* **Giao diện API**: Tiềm năng cho việc kiểm tra cấu hình theo chương trình
* **Mã nguồn mở**: Mã nguồn mở 100% cho phép khách hàng kiểm tra logic chuyển tiếp
* **Nhiều tên miền**: Hỗ trợ nhiều tên miền có thể cho phép tạo tên miền thử nghiệm

Đối với khách hàng doanh nghiệp yêu cầu khả năng sandbox chính thức, điều này cần được thảo luận như một phần của thỏa thuận **Giấy phép doanh nghiệp**.

Nguồn: <https://github.com/forwardemail/forwardemail.net> (Chi tiết về môi trường phát triển)

### Bạn có cung cấp công cụ giám sát và cảnh báo không {#do-you-provide-monitoring-and-alerting-tools}

Forward Email cung cấp tính năng giám sát theo thời gian thực với một số hạn chế:

**Có sẵn:**

* **Giám sát phân phối theo thời gian thực**: Các số liệu hiệu suất hiển thị công khai cho các nhà cung cấp email lớn
* **Cảnh báo tự động**: Đội ngũ kỹ thuật được cảnh báo khi thời gian phân phối vượt quá 10 giây
* **Giám sát minh bạch**: Hệ thống giám sát mã nguồn mở 100%
* **Giám sát cơ sở hạ tầng**: Tự động phát hiện bất thường và ghi nhật ký kiểm tra toàn diện

**Hạn chế:**

* Webhook hướng tới khách hàng hoặc thông báo trạng thái giao hàng dựa trên API không được ghi chép rõ ràng

Đối với khách hàng doanh nghiệp yêu cầu webhook trạng thái giao hàng chi tiết hoặc tích hợp giám sát tùy chỉnh, những khả năng này có thể được cung cấp thông qua các thỏa thuận **Giấy phép doanh nghiệp**.

Nguồn:

* <https://forwardemail.net> (Hiển thị giám sát theo thời gian thực)
* <https://github.com/forwardemail/forwardemail.net> (Triển khai giám sát)

### Làm thế nào để đảm bảo tính khả dụng cao {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Chuyển tiếp Email triển khai tính năng dự phòng toàn diện trên nhiều nhà cung cấp cơ sở hạ tầng.

* **Cơ sở hạ tầng phân tán**: Nhiều nhà cung cấp (DigitalOcean, Vultr, DataPacket) trên khắp các khu vực địa lý
* **Cân bằng tải địa lý**: Cân bằng tải theo vị trí địa lý dựa trên Cloudflare với khả năng tự động chuyển đổi dự phòng
* **Tự động mở rộng**: Điều chỉnh tài nguyên linh hoạt theo nhu cầu
* **Bảo vệ DDoS đa lớp**: Thông qua hệ thống Shield của DataPacket và Cloudflare
* **Dự phòng máy chủ**: Nhiều máy chủ trên mỗi khu vực với khả năng tự động chuyển đổi dự phòng
* **Sao chép cơ sở dữ liệu**: Đồng bộ hóa dữ liệu theo thời gian thực trên nhiều vị trí
* **Giám sát và cảnh báo**: Giám sát 24/7 với khả năng phản hồi sự cố tự động

**Cam kết thời gian hoạt động**: Khả năng sử dụng dịch vụ 99,9%+ với khả năng giám sát minh bạch tại <https://forwardemail.net>

Nguồn:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Bạn có tuân thủ Mục 889 của Đạo luật Ủy quyền Quốc phòng Quốc gia (NDAA) không {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Email chuyển tiếp tuân thủ đầy đủ Mục 889 thông qua việc lựa chọn cẩn thận các đối tác cơ sở hạ tầng.

Có, tính năng Chuyển tiếp Email **tuân thủ Mục 889**. Mục 889 của Đạo luật Ủy quyền Quốc phòng Quốc gia (NDAA) nghiêm cấm các cơ quan chính phủ sử dụng hoặc ký hợp đồng với các đơn vị sử dụng thiết bị viễn thông và giám sát video từ các công ty cụ thể (Huawei, ZTE, Hikvision, Dahua và Hytera).

**Cách Forward Email đạt được sự tuân thủ Mục 889:**

Forward Email chỉ dựa vào hai nhà cung cấp cơ sở hạ tầng chính, không nhà cung cấp nào sử dụng thiết bị bị cấm theo Mục 889:

1. **Cloudflare**: Đối tác chính của chúng tôi về dịch vụ mạng và bảo mật email
2. **DataPacket**: Nhà cung cấp chính về cơ sở hạ tầng máy chủ (chỉ sử dụng thiết bị của Arista Networks và Cisco)
3. **Nhà cung cấp dịch vụ sao lưu**: Các nhà cung cấp dịch vụ sao lưu của chúng tôi là Digital Ocean và Vultr cũng được xác nhận bằng văn bản là tuân thủ Mục 889.

**Cam kết của Cloudflare**: Cloudflare nêu rõ trong Quy tắc ứng xử của bên thứ ba rằng họ không sử dụng thiết bị viễn thông, sản phẩm giám sát video hoặc dịch vụ từ bất kỳ thực thể nào bị cấm theo Mục 889.

**Trường hợp sử dụng cho chính phủ**: Việc tuân thủ Mục 889 của chúng tôi đã được xác thực khi **Học viện Hải quân Hoa Kỳ** chọn Chuyển tiếp Email cho nhu cầu chuyển tiếp email an toàn của họ, yêu cầu phải ghi lại các tiêu chuẩn tuân thủ liên bang của chúng tôi.

Để biết thông tin chi tiết đầy đủ về khuôn khổ tuân thủ của chính phủ, bao gồm các quy định liên bang rộng hơn, hãy đọc nghiên cứu điển hình toàn diện của chúng tôi: [Tuân thủ Mục 889 của Dịch vụ Email Chính phủ Liên bang](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Chi tiết hệ thống và kỹ thuật {#system-and-technical-details}

### Bạn có lưu trữ email và nội dung của chúng không {#do-you-store-emails-and-their-contents}

Không, chúng tôi không ghi vào đĩa hoặc lưu trữ nhật ký – với [ngoại lệ của lỗi](#do-you-store-error-logs) và [SMTP gửi đi](#do-you-support-sending-email-with-smtp) (xem [Chính sách bảo mật](/privacy) của chúng tôi).

Mọi thứ đều được thực hiện trong bộ nhớ và [mã nguồn của chúng tôi có trên GitHub](https://github.com/forwardemail).

### Hệ thống chuyển tiếp email của bạn hoạt động như thế nào {#how-does-your-email-forwarding-system-work}

Email dựa trên [Giao thức SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Giao thức này bao gồm các lệnh được gửi đến máy chủ (thường chạy trên cổng 25). Ban đầu, có một kết nối, sau đó người gửi chỉ định người nhận thư ("MAIL FROM"), tiếp theo là địa chỉ nhận thư ("RCPT TO"), và cuối cùng là tiêu đề và nội dung của email ("DATA"). Luồng hệ thống chuyển tiếp email của chúng tôi được mô tả liên quan đến từng lệnh giao thức SMTP bên dưới:

* Kết nối ban đầu (không có tên lệnh, ví dụ: `telnet example.com 25`) - Đây là kết nối ban đầu. Chúng tôi sẽ so sánh những người gửi không nằm trong [danh sách cho phép](#do-you-have-an-allowlist) với [danh sách từ chối](#do-you-have-a-denylist). Cuối cùng, nếu người gửi không nằm trong danh sách cho phép, chúng tôi sẽ kiểm tra xem họ có nằm trong [danh sách xám](#do-you-have-a-greylist) hay không.

* `HELO` - Giá trị này dùng để xác định FQDN, địa chỉ IP hoặc tên trình xử lý thư của người gửi. Giá trị này có thể bị giả mạo, vì vậy chúng tôi không dựa vào dữ liệu này mà thay vào đó sử dụng tra cứu tên máy chủ ngược của địa chỉ IP của kết nối.

* `MAIL FROM` - Giá trị này cho biết địa chỉ thư từ phong bì của email. Nếu nhập giá trị, đó phải là địa chỉ email hợp lệ theo RFC 5322. Giá trị để trống được phép. Chúng tôi sử dụng [kiểm tra sự tán xạ ngược](#how-do-you-protect-against-backscatter) ở đây, và chúng tôi cũng kiểm tra MAIL FROM với [danh sách từ chối](#do-you-have-a-denylist). Cuối cùng, chúng tôi sẽ kiểm tra những người gửi không có trong danh sách cho phép để giới hạn tốc độ (xem phần [Giới hạn tỷ lệ](#do-you-have-rate-limiting) và [danh sách cho phép](#do-you-have-an-allowlist) để biết thêm thông tin).

* `RCPT TO` - Trường này cho biết người nhận email. Đây phải là địa chỉ email hợp lệ theo chuẩn RFC 5322. Chúng tôi chỉ cho phép tối đa 50 người nhận phong bì cho mỗi thư (khác với tiêu đề "Đến" của email). Chúng tôi cũng kiểm tra địa chỉ [Sơ đồ viết lại người gửi](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") hợp lệ tại đây để bảo vệ chống giả mạo bằng tên miền SRS của chúng tôi.

* `DATA` - Đây là phần cốt lõi của dịch vụ xử lý email của chúng tôi. Xem phần [Bạn xử lý email để chuyển tiếp như thế nào?](#how-do-you-process-an-email-for-forwarding) bên dưới để biết thêm thông tin chi tiết.

### Bạn xử lý email để chuyển tiếp như thế nào {#how-do-you-process-an-email-for-forwarding}

Phần này mô tả quy trình của chúng tôi liên quan đến lệnh giao thức SMTP `DATA` trong phần [Hệ thống chuyển tiếp email của bạn hoạt động như thế nào](#how-does-your-email-forwarding-system-work) ở trên – đây là cách chúng tôi xử lý tiêu đề, nội dung, bảo mật của email, xác định nơi cần gửi đến và cách chúng tôi xử lý các kết nối.

1. Nếu tin nhắn vượt quá kích thước tối đa 50mb, thì tin nhắn sẽ bị từ chối với mã lỗi 552.

2. Nếu tin nhắn không chứa tiêu đề "Từ" hoặc nếu bất kỳ giá trị nào trong tiêu đề "Từ" không phải là địa chỉ email RFC 5322 hợp lệ, thì tin nhắn sẽ bị từ chối với mã lỗi 550.

3. Nếu tin nhắn có hơn 25 tiêu đề "Đã nhận", thì tin nhắn được xác định là bị kẹt trong vòng lặp chuyển hướng và bị từ chối với mã lỗi 550.

4. Sử dụng dấu vân tay của email (xem phần về [Lấy dấu vân tay](#how-do-you-determine-an-email-fingerprint)), chúng tôi sẽ kiểm tra xem tin nhắn đã được thử gửi lại trong hơn 5 ngày (trùng khớp với [hành vi hậu tố mặc định](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)) hay chưa và nếu có, tin nhắn sẽ bị từ chối với mã lỗi 550.

5. Chúng tôi lưu trữ trong bộ nhớ kết quả quét email bằng [Máy quét thư rác](https://spamscanner.net).

6. Nếu có bất kỳ kết quả ngẫu nhiên nào từ Spam Scanner, kết quả đó sẽ bị từ chối với mã lỗi 554. Kết quả ngẫu nhiên chỉ bao gồm bài kiểm tra GTUBE tại thời điểm viết bài này. Xem <https://spamassassin.apache.org/gtube/> để biết thêm thông tin chi tiết.

7. Chúng tôi sẽ thêm các tiêu đề sau vào tin nhắn cho mục đích gỡ lỗi và ngăn chặn việc lạm dụng:

* `Received` - chúng tôi thêm tiêu đề Đã nhận tiêu chuẩn này với IP gốc và máy chủ, loại truyền, thông tin kết nối TLS, ngày/giờ và người nhận.
* `X-Original-To` - người nhận ban đầu của thư:
* Điều này hữu ích để xác định nơi email ban đầu được gửi đến (ngoài tiêu đề "Đã nhận").
* Điều này được thêm vào trên cơ sở mỗi người nhận tại thời điểm chuyển tiếp IMAP và/hoặc che giấu (để bảo vệ quyền riêng tư).
* `X-Forward-Email-Website` - chứa liên kết đến trang web của chúng tôi <https://forwardemail.net>
* `X-Forward-Email-Version` - phiên bản [SemVer](https://semver.org/) hiện tại từ `package.json` trong cơ sở mã của chúng tôi.
* `X-Forward-Email-Session-ID` - giá trị ID phiên được sử dụng cho mục đích gỡ lỗi (chỉ áp dụng trong môi trường không phải môi trường sản xuất).
* `X-Forward-Email-Sender` - danh sách được phân cách bằng dấu phẩy, bao gồm địa chỉ MAIL FROM gốc trên phong bì (nếu không để trống), FQDN của máy khách PTR ngược (nếu có) và địa chỉ IP của người gửi.
* `X-Forward-Email-ID` - chỉ áp dụng cho SMTP gửi đi và tương ứng với ID email được lưu trữ trong Tài khoản của tôi → Email
* `X-Original-To`0 - với giá trị `X-Original-To`1.
* `X-Original-To`2 - với giá trị `X-Original-To`3.
* `X-Original-To`4 - với giá trị `X-Original-To`5.

8. Sau đó, chúng tôi kiểm tra thông báo cho [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) và [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Nếu tin nhắn không vượt qua được DMARC và tên miền có chính sách từ chối (ví dụ: `p=reject` [đã có trong chính sách DMARC](https://wikipedia.org/wiki/DMARC)), thì tin nhắn sẽ bị từ chối với mã lỗi 550. Thông thường, chính sách DMARC cho tên miền có thể được tìm thấy trong bản ghi <strong class="notranslate">TXT</strong> của tên miền phụ `_dmarc` (ví dụ: `dig _dmarc.example.com txt`).
* Nếu tin nhắn không vượt qua được SPF và tên miền có chính sách lỗi cứng (ví dụ: `-all` nằm trong chính sách SPF thay vì `~all` hoặc không có chính sách nào cả), thì tin nhắn sẽ bị từ chối với mã lỗi 550. Thông thường, chính sách SPF cho tên miền có thể được tìm thấy trong bản ghi <strong class="notranslate">TXT</strong> của tên miền gốc (ví dụ: `dig example.com txt`). Xem phần này để biết thêm thông tin về [gửi thư như với Gmail](#can-i-send-mail-as-in-gmail-with-this) liên quan đến SPF.

9. Bây giờ, chúng ta xử lý người nhận tin nhắn được thu thập từ lệnh `RCPT TO` trong phần [Hệ thống chuyển tiếp email của bạn hoạt động như thế nào](#how-does-your-email-forwarding-system-work) ở trên. Với mỗi người nhận, chúng ta thực hiện các thao tác sau:

* Chúng tôi tra cứu các bản ghi <strong class="notranslate">TXT</strong> của tên miền (phần sau ký hiệu `@`, ví dụ: `example.com` nếu địa chỉ email là `test@example.com`). Ví dụ: nếu tên miền là `example.com`, chúng tôi sẽ thực hiện tra cứu DNS như `dig example.com txt`.
* Chúng tôi phân tích cú pháp tất cả các bản ghi <strong class="notranslate">TXT</strong> bắt đầu bằng `forward-email=` (gói miễn phí) hoặc `forward-email-site-verification=` (gói trả phí). Lưu ý rằng chúng tôi phân tích cú pháp cả hai để xử lý email trong khi người dùng đang nâng cấp hoặc hạ cấp gói.
* Từ các bản ghi <strong class="notranslate">TXT</strong> đã phân tích cú pháp này, chúng tôi lặp lại chúng để trích xuất cấu hình chuyển tiếp (như được mô tả trong phần [Làm thế nào để tôi bắt đầu và thiết lập chuyển tiếp email](#how-do-i-get-started-and-set-up-email-forwarding) ở trên). Lưu ý rằng chúng tôi chỉ hỗ trợ một giá trị `forward-email-site-verification=`, và nếu cung cấp nhiều hơn một giá trị, lỗi 550 sẽ xảy ra và người gửi sẽ nhận được thư trả lại cho người nhận này.
* Chúng tôi lặp lại cấu hình chuyển tiếp đã trích xuất một cách đệ quy để xác định chuyển tiếp toàn cục, chuyển tiếp dựa trên regex và tất cả các cấu hình chuyển tiếp được hỗ trợ khác – hiện được gọi là "Địa chỉ Chuyển tiếp" của chúng tôi.
* Đối với mỗi Địa chỉ Chuyển tiếp, chúng tôi hỗ trợ một lần tra cứu đệ quy (sẽ bắt đầu lại chuỗi thao tác này trên địa chỉ đã cho). Nếu tìm thấy kết quả trùng khớp đệ quy, kết quả cha sẽ bị xóa khỏi Địa chỉ Chuyển tiếp và các kết quả con sẽ được thêm vào.
* Địa chỉ Chuyển tiếp được phân tích cú pháp để đảm bảo tính duy nhất (vì chúng tôi không muốn gửi các bản sao đến một địa chỉ hoặc tạo thêm các kết nối máy khách SMTP không cần thiết).

* Đối với mỗi Địa chỉ Chuyển tiếp, chúng tôi tra cứu tên miền của địa chỉ đó với điểm cuối API `/v1/max-forwarded-addresses` (để xác định số lượng địa chỉ mà tên miền được phép chuyển tiếp email đến cho mỗi bí danh, ví dụ: 10 địa chỉ theo mặc định – xem phần `example.com`0). Nếu vượt quá giới hạn này, lỗi 550 sẽ xảy ra và người gửi sẽ nhận được thư trả lại cho người nhận này.
* Chúng tôi tra cứu cài đặt của người nhận ban đầu với điểm cuối API `example.com`1, hỗ trợ tra cứu cho người dùng trả phí (với tùy chọn dự phòng cho người dùng miễn phí). Thao tác này trả về một đối tượng cấu hình cho các thiết lập nâng cao cho `example.com`2 (Số, ví dụ: `example.com`3), `example.com`4 (Boolean), `example.com`5 (Boolean), `example.com`6 (Boolean) và `example.com`7 (Boolean).
* Dựa trên các thiết lập này, chúng tôi sẽ kiểm tra kết quả của Trình quét Thư rác và nếu có bất kỳ lỗi nào xảy ra, thư sẽ bị từ chối với mã lỗi 554 (ví dụ: nếu `example.com`8 được bật, chúng tôi sẽ kiểm tra kết quả của Trình quét Thư rác để tìm vi-rút). Lưu ý rằng tất cả người dùng gói miễn phí sẽ được chọn tham gia kiểm tra nội dung người lớn, lừa đảo, tệp thực thi và vi-rút. Theo mặc định, tất cả người dùng gói trả phí cũng được chọn tham gia, nhưng cấu hình này có thể được thay đổi trong trang Cài đặt cho tên miền trong bảng điều khiển Chuyển tiếp Email).

10. Đối với mỗi Địa chỉ chuyển tiếp của người nhận đã xử lý, chúng tôi thực hiện các thao tác sau:

* Địa chỉ được kiểm tra với [danh sách từ chối](#do-you-have-a-denylist) của chúng tôi, và nếu địa chỉ được liệt kê, mã lỗi 421 sẽ xuất hiện (yêu cầu người gửi thử lại sau).
* Nếu địa chỉ là webhook, chúng tôi sẽ đặt Boolean cho các hoạt động trong tương lai (xem bên dưới – chúng tôi nhóm các webhook tương tự lại với nhau để thực hiện một yêu cầu POST thay vì nhiều yêu cầu để gửi).
* Nếu địa chỉ là địa chỉ email, chúng tôi sẽ phân tích cú pháp máy chủ cho các hoạt động trong tương lai (xem bên dưới – chúng tôi nhóm các máy chủ tương tự lại với nhau để thực hiện một kết nối thay vì nhiều kết nối riêng lẻ để gửi).

11. Nếu không có người nhận và không có thư trả lại, chúng tôi sẽ phản hồi bằng lỗi 550 "Người nhận không hợp lệ".

12. Nếu có người nhận, chúng tôi sẽ lặp lại các email đó (được nhóm lại theo cùng một máy chủ) và gửi email. Xem phần [Bạn xử lý các vấn đề gửi email như thế nào?](#how-do-you-handle-email-delivery-issues) bên dưới để biết thêm chi tiết.

* Nếu có bất kỳ lỗi nào xảy ra trong quá trình gửi email, chúng tôi sẽ lưu trữ chúng trong bộ nhớ để xử lý sau.
* Chúng tôi sẽ lấy mã lỗi thấp nhất (nếu có) từ việc gửi email – và sử dụng mã đó làm mã phản hồi cho lệnh `DATA`. Điều này có nghĩa là các email chưa được gửi thường sẽ được người gửi ban đầu thử lại, nhưng các email đã được gửi sẽ không được gửi lại vào lần gửi tiếp theo (vì chúng tôi sử dụng [Lấy dấu vân tay](#how-do-you-determine-an-email-fingerprint)).
* Nếu không có lỗi nào xảy ra, chúng tôi sẽ gửi mã trạng thái phản hồi SMTP thành công 250.
* Một email bị trả lại được xác định là bất kỳ nỗ lực gửi nào dẫn đến mã trạng thái >= 500 (lỗi vĩnh viễn).

13. Nếu không xảy ra lỗi trả lại (lỗi cố định), thì chúng tôi sẽ trả về mã trạng thái phản hồi SMTP có mã lỗi thấp nhất trong số các lỗi không cố định (hoặc mã trạng thái thành công 250 nếu không có lỗi nào).

14. Nếu email bị trả lại, chúng tôi sẽ gửi email trả lại ở chế độ nền sau khi trả về mã lỗi thấp nhất cho người gửi. Tuy nhiên, nếu mã lỗi thấp nhất >= 500, chúng tôi sẽ không gửi email trả lại nào. Lý do là vì nếu chúng tôi gửi email trả lại, người gửi sẽ nhận được email trả lại kép (ví dụ: một email từ MTA gửi đi của họ, chẳng hạn như Gmail – và một email từ chúng tôi). Xem phần [Làm thế nào để bảo vệ chống lại sự tán xạ ngược](#how-do-you-protect-against-backscatter) bên dưới để biết thêm chi tiết.

### Bạn xử lý sự cố gửi email như thế nào {#how-do-you-handle-email-delivery-issues}

Lưu ý rằng chúng tôi sẽ viết lại "Friendly-From" trên email chỉ khi chính sách DMARC của người gửi không được thông qua VÀ không có chữ ký DKIM nào được căn chỉnh với tiêu đề "From". Điều này có nghĩa là chúng tôi sẽ thay đổi tiêu đề "From" trên thư, đặt "X-Original-From" và cũng đặt "Reply-To" nếu nó chưa được đặt. Chúng tôi cũng sẽ đóng lại dấu ARC trên thư sau khi thay đổi các tiêu đề này.

Chúng tôi cũng sử dụng tính năng phân tích thông minh các thông báo lỗi ở mọi cấp độ của ngăn xếp – trong mã của chúng tôi, các yêu cầu DNS, nội bộ Node.js, các yêu cầu HTTP (ví dụ: 408, 413 và 429 được ánh xạ tới mã phản hồi SMTP là 421 nếu người nhận là webhook) và các phản hồi của máy chủ thư (ví dụ: các phản hồi có "defer" hoặc "slowdown" sẽ được thử lại dưới dạng lỗi 421).

Logic của chúng tôi có khả năng chống giả mạo và cũng sẽ thử lại để tìm lỗi SSL/TLS, sự cố kết nối, v.v. Mục tiêu của việc chống giả mạo là tối đa hóa khả năng phân phối đến tất cả người nhận cho một cấu hình chuyển tiếp.

Nếu người nhận là webhook, chúng tôi sẽ cho phép thời gian chờ 60 giây để yêu cầu hoàn tất với tối đa 3 lần thử lại (tức là tổng cộng 4 yêu cầu trước khi lỗi xảy ra). Lưu ý rằng chúng tôi phân tích cú pháp chính xác các mã lỗi 408, 413 và 429 và ánh xạ chúng thành mã phản hồi SMTP là 421.

Ngược lại, nếu người nhận là một địa chỉ email, chúng tôi sẽ cố gắng gửi email bằng TLS tùy chọn (chúng tôi cố gắng sử dụng STARTTLS nếu giao thức này khả dụng trên máy chủ thư của người nhận). Nếu xảy ra lỗi SSL/TLS khi cố gắng gửi email, chúng tôi sẽ cố gắng gửi email mà không sử dụng TLS (không sử dụng STARTTLS).

Nếu xảy ra bất kỳ lỗi DNS hoặc lỗi kết nối nào, chúng tôi sẽ trả về lệnh `DATA` mã phản hồi SMTP là 421, nếu không, nếu có lỗi cấp độ >= 500, thì sẽ gửi trả lại.

Nếu chúng tôi phát hiện máy chủ email mà chúng tôi đang cố gắng gửi thư đến có một hoặc nhiều địa chỉ IP trao đổi thư của chúng tôi bị chặn (ví dụ: bằng bất kỳ công nghệ nào họ sử dụng để trì hoãn những người gửi thư rác), thì chúng tôi sẽ gửi mã phản hồi SMTP là 421 để người gửi thử lại tin nhắn của họ sau (và chúng tôi sẽ được cảnh báo về sự cố này để hy vọng có thể giải quyết trước lần thử tiếp theo).

### Bạn xử lý thế nào khi địa chỉ IP của bạn bị chặn {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Chúng tôi thường xuyên theo dõi tất cả các danh sách từ chối DNS chính và nếu bất kỳ địa chỉ IP trao đổi thư ("MX") nào của chúng tôi được liệt kê trong danh sách từ chối chính, chúng tôi sẽ loại địa chỉ đó ra khỏi vòng lặp bản ghi A DNS có liên quan nếu có thể cho đến khi sự cố được giải quyết.

Tại thời điểm viết bài này, chúng tôi cũng nằm trong một số danh sách DNS cho phép và chúng tôi rất coi trọng việc giám sát danh sách từ chối. Nếu bạn thấy bất kỳ sự cố nào trước khi chúng tôi có cơ hội giải quyết, vui lòng thông báo cho chúng tôi bằng văn bản theo địa chỉ <support@forwardemail.net>.

Địa chỉ IP của chúng tôi được công khai, [xem phần này bên dưới để biết thêm thông tin chi tiết](#what-are-your-servers-ip-addresses).

### Địa chỉ bưu điện là gì {#what-are-postmaster-addresses}

Để ngăn chặn việc trả lại nhầm địa chỉ và gửi tin nhắn trả lời tự động đến các hộp thư không được giám sát hoặc không tồn tại, chúng tôi duy trì một danh sách tên người dùng giống như trình quản lý thư:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [và bất kỳ địa chỉ không trả lời nào](#what-are-no-reply-addresses)

Xem [RFC 5320 Mục 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) để biết thêm thông tin chi tiết về cách sử dụng các danh sách như thế này để tạo ra hệ thống email hiệu quả.

### Địa chỉ không trả lời là gì {#what-are-no-reply-addresses}

Tên người dùng email có bất kỳ ký tự nào sau đây (không phân biệt chữ hoa chữ thường) đều được coi là địa chỉ không trả lời:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

Danh sách này được duy trì tại [như một dự án nguồn mở trên GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Địa chỉ IP của máy chủ của bạn là gì {#what-are-your-servers-ip-addresses}

Chúng tôi công bố địa chỉ IP của mình tại <https://forwardemail.net/ips>.

### Bạn có danh sách cho phép không {#do-you-have-an-allowlist}

Đúng, chúng tôi có [danh sách các phần mở rộng tên miền](#what-domain-name-extensions-are-allowlisted-by-default) được cho phép theo mặc định và danh sách cho phép động, được lưu trong bộ nhớ đệm và liên tục dựa trên [tiêu chí nghiêm ngặt](#what-is-your-allowlist-criteria).

Tất cả email, tên miền và người nhận từ khách hàng sử dụng gói trả phí sẽ tự động được thêm vào danh sách cho phép của chúng tôi.

### Những phần mở rộng tên miền nào được cho phép theo mặc định {#what-domain-name-extensions-are-allowlisted-by-default}

Các phần mở rộng tên miền sau đây được coi là được cho phép theo mặc định (bất kể chúng có nằm trong Danh sách phổ biến của Umbrella hay không):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">edu</code></li>
<li class="list-inline-item"><code class="notranslate">gov</code></li>
<li class="list-inline-item"><code class="notranslate">mil</code></li>
<li class="list-inline-item"><code class="notranslate">int</code></li>
<li class="list-inline-item"><code class="notranslate">arpa</code></li>
<li class="list-inline-item"><code class="notranslate">dni.us</code></li>
<li class="list-inline-item"><code class="notranslate">fed.us</code></li>
<li class="list-inline-item"><code class="notranslate">isa.us</code></li>
<li class="list-inline-item"><code class="notranslate">kids.us</code></li>
<li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
<li class="list-inline-item"><code class="notranslate">ak.us</code></li>
<li class="list-inline-item"><code class="notranslate">al.us</code></li>
<li class="list-inline-item"><code class="notranslate">ar.us</code></li>
<li class="list-inline-item"><code class="notranslate">as.us</code></li>
<li class="list-inline-item"><code class="notranslate">az.us</code></li>
<li class="list-inline-item"><code class="notranslate">ca.us</code></li>
<li class="list-inline-item"><code class="notranslate">co.us</code></li>
<li class="list-inline-item"><code class="notranslate">ct.us</code></li>
<li class="list-inline-item"><code class="notranslate">dc.us</code></li>
<li class="list-inline-item"><code class="notranslate">de.us</code></li>
<li class="list-inline-item"><code class="notranslate">fl.us</code></li>
<li class="list-inline-item"><code class="notranslate">ga.us</code></li>
<li class="list-inline-item"><code class="notranslate">gu.us</code></li>
<li class="list-inline-item"><code class="notranslate">hi.us</code></li>
<li class="list-inline-item"><code class="notranslate">ia.us</code></li>
<li class="list-inline-item"><code class="notranslate">id.us</code></li>
<li class="list-inline-item"><code class="notranslate">il.us</code></li>
<li class="list-inline-item"><code class="notranslate">in.us</code></li>
<li class="list-inline-item"><code class="notranslate">ks.us</code></li>
<li class="list-inline-item"><code class="notranslate">ky.us</code></li>
<li class="list-inline-item"><code class="notranslate">la.us</code></li>
<li class="list-inline-item"><code class="notranslate">ma.us</code></li>
<li class="list-inline-item"><code class="notranslate">md.us</code></li>
<li class="list-inline-item"><code class="notranslate">me.us</code></li>
<li class="list-inline-item"><code class="notranslate">mi.us</code></li>
<li class="list-inline-item"><code class="notranslate">mn.us</code></li>
<li class="list-inline-item"><code class="notranslate">mo.us</code></li>
<li class="list-inline-item"><code class="notranslate">ms.us</code></li>
<li class="list-inline-item"><code class="notranslate">mt.us</code></li>
<li class="list-inline-item"><code class="notranslate">nc.us</code></li>
<li class="list-inline-item"><code class="notranslate">nd.us</code></li>
<li class="list-inline-item"><code class="notranslate">ne.us</code></li>
<li class="list-inline-item"><code class="notranslate">nh.us</code></li>
<li class="list-inline-item"><code class="notranslate">nj.us</code></li>
<li class="list-inline-item"><code class="notranslate">nm.us</code></li>
<li class="list-inline-item"><code class="notranslate">nv.us</code></li>
<li class="list-inline-item"><code class="notranslate">ny.us</code></li>
<li class="list-inline-item"><code class="notranslate">oh.us</code></li>
<li class="list-inline-item"><code class="notranslate">ok.us</code></li>
<li class="list-inline-item"><code class="notranslate">or.us</code></li>
<li class="list-inline-item"><code class="notranslate">pa.us</code></li>
<li class="list-inline-item"><code class="notranslate">pr.us</code></li>
<li class="list-inline-item"><code class="notranslate">ri.us</code></li>
<li class="list-inline-item"><code class="notranslate">sc.us</code></li>
<li class="list-inline-item"><code class="notranslate">sd.us</code></li>
<li class="list-inline-item"><code class="notranslate">tn.us</code></li>
<li class="list-inline-item"><code class="notranslate">tx.us</code></li>
<li class="list-inline-item"><code class="notranslate">ut.us</code></li>
<li class="list-inline-item"><code class="notranslate">va.us</code></li>
<li class="list-inline-item"><code class="notranslate">vi.us</code></li>
<li class="list-inline-item"><code class="notranslate">vt.us</code></li>
<li class="list-inline-item"><code class="notranslate">wa.us</code></li>
<li class="list-inline-item"><code class="notranslate">wi.us</code></li>
<li class="list-inline-item"><code class="notranslate">wv.us</code></li>
<li class="list-inline-item"><code class="notranslate">wy.us</code></li>
<li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
<li class="list-inline-item"><code class="notranslate">edu.au</code></li>
<li class="list-inline-item"><code class="notranslate">ac.at</code></li>
<li class="list-inline-item"><code class="notranslate">edu.br</code></li>
<li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
<li class="list-inline-item"><code class="notranslate">school.nz</code></li>
<li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
<li class="list-inline-item"><code class="notranslate">health.nz</code></li>
<li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
<li class="list-inline-item"><code class="notranslate">ac.in</code></li>
<li class="list-inline-item"><code class="notranslate">edu.in</code></li>
<li class="list-inline-item"><code class="notranslate">mil.in</code></li>
<li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
<li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ac.za</code></li>
<li class="list-inline-item"><code class="notranslate">edu.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.za</code></li>
<li class="list-inline-item"><code class="notranslate">school.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
<li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
<li class="list-inline-item"><code class="notranslate">es.kr</code></li>
<li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
<li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.es</code></li>
<li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
<li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
<li class="list-inline-item"><code class="notranslate">ac.th</code></li>
<li class="list-inline-item"><code class="notranslate">mi.th</code></li>
<li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
<li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">go.id</code></li>
<li class="list-inline-item"><code class="notranslate">go.jp</code></li>
<li class="list-inline-item"><code class="notranslate">go.ke</code></li>
<li class="list-inline-item"><code class="notranslate">go.kr</code></li>
<li class="list-inline-item"><code class="notranslate">go.th</code></li>
<li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
<li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gob.es</code></li>
<li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
<li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
<li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
<li class="list-inline-item"><code class="notranslate">gov.af</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
<li class="list-inline-item"><code class="notranslate">gov.al</code></li>
<li class="list-inline-item"><code class="notranslate">gov.am</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
<li class="list-inline-item"><code class="notranslate">gov.au</code></li>
<li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
<li class="list-inline-item"><code class="notranslate">gov.az</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.be</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
<li class="list-inline-item"><code class="notranslate">gov.by</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.co</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
<li class="list-inline-item"><code class="notranslate">gov.il</code></li>
<li class="list-inline-item"><code class="notranslate">gov.im</code></li>
<li class="list-inline-item"><code class="notranslate">gov.in</code></li>
<li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
<li class="list-inline-item"><code class="notranslate">gov.it</code></li>
<li class="list-inline-item"><code class="notranslate">gov.je</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
<li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.my</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
<li class="list-inline-item"><code class="notranslate">gov.np</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.py</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
<li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
<li class="list-inline-item"><code class="notranslate">gov.se</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.si</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
<li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
<li class="list-inline-item"><code class="notranslate">gov.za</code></li>
<li class="list-inline-item"><code class="notranslate">government.pn</code></li>
<li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
<li class="list-inline-item"><code class="notranslate">gv.at</code></li>
<li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
<li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
<li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
<li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
<li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
<li class="list-inline-item"><code class="notranslate">police.uk</code></li>
<li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
<li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
<li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

Ngoài ra, [tên miền cấp cao nhất của thương hiệu và công ty](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) này được cho phép theo mặc định (ví dụ: `apple` cho `applecard.apple` đối với sao kê ngân hàng Apple Card):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">accenture</code></li>
<li class="list-inline-item"><code class="notranslate">aco</code></li>
<li class="list-inline-item"><code class="notranslate">aeg</code></li>
<li class="list-inline-item"><code class="notranslate">aetna</code></li>
<li class="list-inline-item"><code class="notranslate">afl</code></li>
<li class="list-inline-item"><code class="notranslate">agakhan</code></li>
<li class="list-inline-item"><code class="notranslate">aig</code></li>
<li class="list-inline-item"><code class="notranslate">aigo</code></li>
<li class="list-inline-item"><code class="notranslate">airbus</code></li>
<li class="list-inline-item"><code class="notranslate">airtel</code></li>
<li class="list-inline-item"><code class="notranslate">akdn</code></li>
<li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
<li class="list-inline-item"><code class="notranslate">alibaba</code></li>
<li class="list-inline-item"><code class="notranslate">alipay</code></li>
<li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
<li class="list-inline-item"><code class="notranslate">allstate</code></li>
<li class="list-inline-item"><code class="notranslate">ally</code></li>
<li class="list-inline-item"><code class="notranslate">alstom</code></li>
<li class="list-inline-item"><code class="notranslate">amazon</code></li>
<li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
<li class="list-inline-item"><code class="notranslate">amex</code></li>
<li class="list-inline-item"><code class="notranslate">amica</code></li>
<li class="list-inline-item"><code class="notranslate">android</code></li>
<li class="list-inline-item"><code class="notranslate">anz</code></li>
<li class="list-inline-item"><code class="notranslate">aol</code></li>
<li class="list-inline-item"><code class="notranslate">apple</code></li>
<li class="list-inline-item"><code class="notranslate">màu nước</code></li>
<li class="list-inline-item"><code class="notranslate">aramco</code></li>
<li class="list-inline-item"><code class="notranslate">audi</code></li>
<li class="list-inline-item"><code class="notranslate">auspost</code></li>
<li class="list-inline-item"><code class="notranslate">aws</code></li>
<li class="list-inline-item"><code class="notranslate">axa</code></li>
<li class="list-inline-item"><code class="notranslate">azure</code></li>
<li class="list-inline-item"><code class="notranslate">baidu</code></li>
<li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
<li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
<li class="list-inline-item"><code class="notranslate">barclays</code></li>
<li class="list-inline-item"><code class="notranslate">bóng rổ</code></li>
<li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
<li class="list-inline-item"><code class="notranslate">bbc</code></li>
<li class="list-inline-item"><code class="notranslate">bbt</code></li>
<li class="list-inline-item"><code class="notranslate">bbva</code></li>
<li class="list-inline-item"><code class="notranslate">bcg</code></li>
<li class="list-inline-item"><code class="notranslate">bentley</code></li>
<li class="list-inline-item"><code class="notranslate">bharti</code></li>
<li class="list-inline-item"><code class="notranslate">bing</code></li>
<li class="list-inline-item"><code class="notranslate">blanco</code></li>
<li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
<li class="list-inline-item"><code class="notranslate">bms</code></li>
<li class="list-inline-item"><code class="notranslate">bmw</code></li>
<li class="list-inline-item"><code class="notranslate">bnl</code></li>
<li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
<li class="list-inline-item"><code class="notranslate">boehringer</code></li>
<li class="list-inline-item"><code class="notranslate">bond</code></li>
<li class="list-inline-item"><code class="notranslate">đặt vé</code></li>
<li class="list-inline-item"><code class="notranslate">bosch</code></li>
<li class="list-inline-item"><code class="notranslate">bostik</code></li>
<li class="list-inline-item"><code class="notranslate">bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">brother</code></li>
<li class="list-inline-item"><code class="notranslate">brother</code></li>
<li class="list-inline-item"><code class="notranslate">bugatti</code></li>
<li class="list-inline-item"><code class="notranslate">cal</code></li>
<li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
<li class="list-inline-item"><code class="notranslate">canon</code></li>
<li class="list-inline-item"><code class="notranslate">capitalone</code></li>
<li class="list-inline-item"><code class="notranslate">caravan</code></li>
<li class="list-inline-item"><code class="notranslate">cartier</code></li>
<li class="list-inline-item"><code class="notranslate">cba</code></li>
<li class="list-inline-item"><code class="notranslate">cbn</code></li>
<li class="list-inline-item"><code class="notranslate">cbre</code></li>
<li class="list-inline-item"><code class="notranslate">cbs</code></li>
<li class="list-inline-item"><code class="notranslate">cern</code></li>
<li class="list-inline-item"><code class="notranslate">cfa</code></li>
<li class="list-inline-item"><code class="notranslate">kênh</code></li>
<li class="list-inline-item"><code class="notranslate">chase</code></li>
<li class="list-inline-item"><code class="notranslate">chintai</code></li>
<li class="list-inline-item"><code class="notranslate">chrome</code></li>
<li class="list-inline-item"><code class="notranslate">Chrysler</code></li>
<li class="list-inline-item"><code class="notranslate">cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">cisco</code></li>
<li class="list-inline-item"><code class="notranslate">citadel</code></li>
<li class="list-inline-item"><code class="notranslate">citi</code></li>
<li class="list-inline-item"><code class="notranslate">citic</code></li>
<li class="list-inline-item"><code class="notranslate">clubmed</code></li>
<li class="list-inline-item"><code class="notranslate">comcast</code></li>
<li class="list-inline-item"><code class="notranslate">commbank</code></li>
<li class="list-inline-item"><code class="notranslate">creditunion</code></li>
<li class="list-inline-item"><code class="notranslate">crown</code></li>
<li class="list-inline-item"><code class="notranslate">crs</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><code class="notranslate">dabur</code></li>
<li class="list-inline-item"><code class="notranslate">datsun</code></li>
<li class="list-inline-item"><code class="notranslate">đại lý</code></li>
<li class="list-inline-item"><code class="notranslate">đại lý</code></li>
<li class="list-inline-item"><code class="notranslate">dell</code></li>
<li class="list-inline-item"><code class="notranslate">deloitte</code></li>
<li class="list-inline-item"><code class="notranslate">delta</code></li>
<li class="list-inline-item"><code class="notranslate">dhl</code></li>
<li class="list-inline-item"><code class="notranslate">discover</code></li>
<li class="list-inline-item"><code class="notranslate">dish</code></li>
<li class="list-inline-item"><code class="notranslate">dnp</code></li>
<li class="list-inline-item"><code class="notranslate">dodge</code></li>
<li class="list-inline-item"><code class="notranslate">dunlop</code></li>
<li class="list-inline-item"><code class="notranslate">dupont</code></li>
<li class="list-inline-item"><code class="notranslate">dvag</code></li>
<li class="list-inline-item"><code class="notranslate">edeka</code></li>
<li class="list-inline-item"><code class="notranslate">emerck</code></li>
<li class="list-inline-item"><code class="notranslate">epson</code></li>
<li class="list-inline-item"><code class="notranslate">ericsson</code></li>
<li class="list-inline-item"><code class="notranslate">erni</code></li>
<li class="list-inline-item"><code class="notranslate">esurance</code></li>
<li class="list-inline-item"><code class="notranslate">etisalat</code></li>
<li class="list-inline-item"><code class="notranslate">eurovision</code></li>
<li class="list-inline-item"><code class="notranslate">everbank</code></li>
<li class="list-inline-item"><code class="notranslate">extraspace</code></li>
<li class="list-inline-item"><code class="notranslate">fage</code></li>
<li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
<li class="list-inline-item"><code class="notranslate">nông dân</code></li>
<li class="list-inline-item"><code class="notranslate">fedex</code></li>
<li class="list-inline-item"><code class="notranslate">ferrari</code></li>
<li class="list-inline-item"><code class="notranslate">ferrero</code></li>
<li class="list-inline-item"><code class="notranslate">fiat</code></li>
<li class="list-inline-item"><code class="notranslate">fidelity</code></li>
<li class="list-inline-item"><code class="notranslate">firestone</code></li>
<li class="list-inline-item"><code class="notranslate">firmdale</code></li>
<li class="list-inline-item"><code class="notranslate">flickr</code></li>
<li class="list-inline-item"><code class="notranslate">flir</code></li>
<li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
<li class="list-inline-item"><code class="notranslate">ford</code></li>
<li class="list-inline-item"><code class="notranslate">fox</code></li>
<li class="list-inline-item"><code class="notranslate">fresenius</code></li>
<li class="list-inline-item"><code class="notranslate">forex</code></li>
<li class="list-inline-item"><code class="notranslate">frogans</code></li>
<li class="list-inline-item"><code class="notranslate">frontier</code></li>
<li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
<li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
<li class="list-inline-item"><code class="notranslate">gallo</code></li>
<li class="list-inline-item"><code class="notranslate">gallup</code></li>
<li class="list-inline-item"><code class="notranslate">gap</code></li>
<li class="list-inline-item"><code class="notranslate">gbiz</code></li>
<li class="list-inline-item"><code class="notranslate">gea</code></li>
<li class="list-inline-item"><code class="notranslate">genting</code></li>
<li class="list-inline-item"><code class="notranslate">giving</code></li>
<li class="list-inline-item"><code class="notranslate">gle</code></li>
<li class="list-inline-item"><code class="notranslate">globo</code></li>
<li class="list-inline-item"><code class="notranslate">gmail</code></li>
<li class="list-inline-item"><code class="notranslate">gmo</code></li>
<li class="list-inline-item"><code class="notranslate">gmx</code></li>
<li class="list-inline-item"><code class="notranslate">godaddy</code></li>
<li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
<li class="list-inline-item"><code class="notranslate">goodyear</code></li>
<li class="list-inline-item"><code class="notranslate">goog</code></li>
<li class="list-inline-item"><code class="notranslate">google</code></li>
<li class="list-inline-item"><code class="notranslate">grainger</code></li>
<li class="list-inline-item"><code class="notranslate">người bảo vệ</code></li>
<li class="list-inline-item"><code class="notranslate">gucci</code></li>
<li class="list-inline-item"><code class="notranslate">hbo</code></li>
<li class="list-inline-item"><code class="notranslate">hdfc</code></li>
<li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
<li class="list-inline-item"><code class="notranslate">hermes</code></li>
<li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
<li class="list-inline-item"><code class="notranslate">hitachi</code></li>
<li class="list-inline-item"><code class="notranslate">hkt</code></li>
<li class="list-inline-item"><code class="notranslate">honda</code></li>
<li class="list-inline-item"><code class="notranslate">honeywell</code></li>
<li class="list-inline-item"><code class="notranslate">hotmail</code></li>
<li class="list-inline-item"><code class="notranslate">hsbc</code></li>
<li class="list-inline-item"><code class="notranslate">hughes</code></li>
<li class="list-inline-item"><code class="notranslate">hyatt</code></li>
<li class="list-inline-item"><code class="notranslate">hyundai</code></li>
<li class="list-inline-item"><code class="notranslate">ibm</code></li>
<li class="list-inline-item"><code class="notranslate">ieee</code></li>
<li class="list-inline-item"><code class="notranslate">ifm</code></li>
<li class="list-inline-item"><code class="notranslate">ikano</code></li>
<li class="list-inline-item"><code class="notranslate">imdb</code></li>
<li class="list-inline-item"><code class="notranslate">infiniti</code></li>
<li class="list-inline-item"><code class="notranslate">intel</code></li>
<li class="list-inline-item"><code class="notranslate">intuit</code></li>
<li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
<li class="list-inline-item"><code class="notranslate">iselect</code></li>
<li class="list-inline-item"><code class="notranslate">itau</code></li>
<li class="list-inline-item"><code class="notranslate">itv</code></li>
<li class="list-inline-item"><code class="notranslate">iveco</code></li>
<li class="list-inline-item"><code class="notranslate">jaguar</code></li>
<li class="list-inline-item"><code class="notranslate">java</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code class="notranslate">jcp</code></li>
<li class="list-inline-item"><code class="notranslate">jeep</code></li>
<li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
<li class="list-inline-item"><code class="notranslate">juniper</code></li>
<li class="list-inline-item"><code class="notranslate">kddi</code></li>
<li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
<li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
<li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
<li class="list-inline-item"><code class="notranslate">kfh</code></li>
<li class="list-inline-item"><code class="notranslate">kia</code></li>
<li class="list-inline-item"><code class="notranslate">kinder</code></li>
<li class="list-inline-item"><code class="notranslate">kindle</code></li>
<li class="list-inline-item"><code class="notranslate">komatsu</code></li>
<li class="list-inline-item"><code class="notranslate">kpmg</code></li>
<li class="list-inline-item"><code class="notranslate">kred</code></li>
<li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
<li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
<li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
<li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
<li class="list-inline-item"><code class="notranslate">lancaster</code></li>
<li class="list-inline-item"><code class="notranslate">lancia</code></li>
<li class="list-inline-item"><code class="notranslate">lancome</code></li>
<li class="list-inline-item"><code class="notranslate">landrover</code></li>
<li class="list-inline-item"><code class="notranslate">lanxess</code></li>
<li class="list-inline-item"><code class="notranslate">lasalle</code></li>
<li class="list-inline-item"><code class="notranslate">latrobe</code></li>
<li class="list-inline-item"><code class="notranslate">lds</code></li>
<li class="list-inline-item"><code class="notranslate">leclerc</code></li>
<li class="list-inline-item"><code class="notranslate">lego</code></li>
<li class="list-inline-item"><code class="notranslate">liên lạc</code></li>
<li class="list-inline-item"><code class="notranslate">lexus</code></li>
<li class="list-inline-item"><code class="notranslate">lidl</code></li>
<li class="list-inline-item"><code class="notranslate">phong cách sống</code></li>
<li class="list-inline-item"><code class="notranslate">lilly</code></li>
<li class="list-inline-item"><code class="notranslate">lincoln</code></li>
<li class="list-inline-item"><code class="notranslate">linde</code></li>
<li class="list-inline-item"><code class="notranslate">Lipsy</code></li>
<li class="list-inline-item"><code class="notranslate">lixil</code></li>
<li class="list-inline-item"><code class="notranslate">locus</code></li>
<li class="list-inline-item"><code class="notranslate">lotte</code></li>
<li class="list-inline-item"><code class="notranslate">lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
<li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
<li class="list-inline-item"><code class="notranslate">lupin</code></li>
<li class="list-inline-item"><code class="notranslate">lupin</code></li>
<li class="list-inline-item"><code class="notranslate">macys</code></li>
<li class="list-inline-item"><code class="notranslate">maif</code></li>
<li class="list-inline-item"><code class="notranslate">man</code></li>
<li class="list-inline-item"><code class="notranslate">mango</code></li>
<li class="list-inline-item"><code class="notranslate">marriott</code></li>
<li class="list-inline-item"><code class="notranslate">maserati</code></li>
<li class="list-inline-item"><code class="notranslate">mattel</code></li>
<li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
<li class="list-inline-item"><code class="notranslate">metlife</code></li>
<li class="list-inline-item"><code class="notranslate">microsoft</code></li>
<li class="list-inline-item"><code class="notranslate">mini</code></li>
<li class="list-inline-item"><code class="notranslate">mit</code></li>
<li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
<li class="list-inline-item"><code class="notranslate">mlb</code></li>
<li class="list-inline-item"><code class="notranslate">mma</code></li>
<li class="list-inline-item"><code class="notranslate">monash</code></li>
<li class="list-inline-item"><code class="notranslate">mormon</code></li>
<li class="list-inline-item"><code class="notranslate">moto</code></li>
<li class="list-inline-item"><code class="notranslate">movistar</code></li>
<li class="list-inline-item"><code class="notranslate">msd</code></li>
<li class="list-inline-item"><code class="notranslate">mtn</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">mutual</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">toàn quốc</code></li>
<li class="list-inline-item"><code class="notranslate">natura</code></ li>
<li class="list-inline-item"><code class="notranslate">nba</code></li>
<li class="list-inline-item"><code class="notranslate">nec</code></li>
<li class="list-inline-item"><code class="notranslate">netflix</code></li>
<li class="list-inline-item"><code class="notranslate">neustar</code></li>
<li class="list-inline-item"><code class="notranslate">newholland</code></li>
<li class="list-inline-item"><code class="notranslate">nfl</code></li>
<li class="list-inline-item"><code class="notranslate">nhk</code></li>
<li class="list-inline-item"><code class="notranslate">nico</code></li>
<li class="list-inline-item"><code class="notranslate">nike</code></li>
<li class="list-inline-item"><code class="notranslate">nikon</code></li>
<li class="list-inline-item"><code class="notranslate">nissan</code></li>
<li class="list-inline-item"><code class="notranslate">nissay</code></li>
<li class="list-inline-item"><code class="notranslate">nokia</code></li>
<li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
<li class="list-inline-item"><code class="notranslate">norton</code></li>
<li class="list-inline-item"><code class="notranslate">nra</code></li>
<li class="list-inline-item"><code class="notranslate">ntt</code></li>
<li class="list-inline-item"><code class="notranslate">obi</code></li>
<li class="list-inline-item"><code class="notranslate">office</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oracle</code></li>
<li class="list-inline-item"><code class="notranslate">orange</code></li>
<li class="list-inline-item"><code class="notranslate">otsuka</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li class="list-inline-item"><code class="notranslate">panasonic</code></li>
<li class="list-inline-item"><code class="notranslate">pccw</code></li>
<li class="list-inline-item"><code class="notranslate">pfizer</code></li>
<li class="list-inline-item"><code class="notranslate">philips</code></li>
<li class="list-inline-item"><code class="notranslate">piaget</code></li>
<li class="list-inline-item"><code class="notranslate">pictet</code></li>
<li class="list-inline-item"><code class="notranslate">ping</code></li>
<li class="list-inline-item"><code class="notranslate">pioneer</code></li>
<li class="list-inline-item"><code class="notranslate">play</code></li>
<li class="list-inline-item"><code class="notranslate">play</code></li>
<li class="list-inline-item"><code class="notranslate">pohl</code></li>
<li class="list-inline-item"><code class="notranslate">politie</code></li>
<li class="list-inline-item"><code class="notranslate">praxi</code></li>
<li class="list-inline-item"><code class="notranslate">prod</code></li>
<li class="list-inline-item"><code class="notranslate">progressive</code></li>
<li class="list-inline-item"><code class="notranslate">pru</code></li>
<li class="list-inline-item"><code class="notranslate">prudential</code></li>
<li class="list-inline-item"><code class="notranslate">pwc</code></li>
<!--<li class="list-inline-item"><code class="notranslate">nhiệm vụ</code></li>-->
<li class="list-inline-item"><code class="notranslate">qvc</code></li>
<li class="list-inline-item"><code class="notranslate">redstone</code></li>
<li class="list-inline-item"><code class="notranslate">reliance</code></li>
<li class="list-inline-item"><code class="notranslate">rexroth</code></li>
<li class="list-inline-item"><code class="notranslate">ricoh</code></li>
<li class="list-inline-item"><code class="notranslate">rmit</code></li>
<li class="list-inline-item"><code class="notranslate">rocher</code></li>
<li class="list-inline-item"><code class="notranslate">rogers</code></li>
<li class="list-inline-item"><code class="notranslate">rwe</code></li>
<li class="list-inline-item"><code class="notranslate">an toàn</code></li>
<li class="list-inline-item"><code class="notranslate">sakura</code></li>
<li class="list-inline-item"><code class="notranslate">samsung</code></li>
<li class="list-inline-item"><code class="notranslate">sandvik</code></li>
<li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
<li class="list-inline-item"><code class="notranslate">sanofi</code></li>
<li class="list-inline-item"><code class="notranslate">sap</code></li>
<li class="list-inline-item"><code class="notranslate">saxo</code></li>
<li class="list-inline-item"><code class="notranslate">sbi</code></li>
<!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
<li class="list-inline-item"><code class="notranslate">sca</code></li>
<li class="list-inline-item"><code class="notranslate">scb</code></li>
<li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
<li class="list-inline-item"><code class="notranslate">schmidt</code></li>
<li class="list-inline-item"><code class="notranslate">schwarz</code></li>
<li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><code class="notranslate">scor</code></li>
<li class="list-inline-item"><code class="notranslate">seat</code></li>
<li class="list-inline-item"><code class="notranslate">sener</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">sew</code></li>
<li class="list-inline-item"><code class="notranslate">seven</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">seek</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">sharp</code></li>
<li class="list-inline-item"><code class="notranslate">shaw</code></li>
<li class="list-inline-item"><code class="notranslate">shell</code></li>
<li class="list-inline-item"><code class="notranslate">shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li>
<li class="list-inline-item"><code class="notranslate">sky</code></li>
<li class="list-inline-item"><code class="notranslate">sky</code></li>
<li class="list-inline-item"><code class="notranslate">sky</code></li>
<li class="list-inline-item"><code class="notranslate">thông minh</code></li>
<li class="list-inline-item"><code class="notranslate">sncf</code></li>
<li class="list-inline-item"><code class="notranslate">softbank</code></li>
<li class="list-inline-item"><code class="notranslate">sohu</code></li>
<li class="list-inline-item"><code class="notranslate">sony</code></li>
<li class="list-inline-item"><code class="notranslate">spiegel</code></li>
<li class="list-inline-item"><code class="notranslate">stada</code></li>
<li class="list-inline-item"><code class="notranslate">kim bấm</code></li>
<li class="list-inline-item"><code class="notranslate">sao</code></li>
<li class="list-inline-item"><code class="notranslate">starhub</code></li>
<li class="list-inline-item"><code class="notranslate">statebank</code></li>
<li class="list-inline-item"><code class="notranslate">statefarm</code></li>
<li class="list-inline-item"><code class="notranslate">statoil</code></li>
<li class="list-inline-item"><code class="notranslate">stc</code></li>
<li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
<li class="list-inline-item"><code class="notranslate">suzuki</code></li>
<li class="list-inline-item"><code class="notranslate">swatch</code></li>
<li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
<li class="list-inline-item"><code class="notranslate">symantec</code></li>
<li class="list-inline-item"><code class="notranslate">taobao</code></li>
<li class="list-inline-item"><code class="notranslate">target</code></li>
<li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
<li class="list-inline-item"><code class="notranslate">tdk</code></li>
<li class="list-inline-item"><code class="notranslate">telecity</code></li>
<li class="list-inline-item"><code class="notranslate">telefonica</code></li>
<li class="list-inline-item"><code class="notranslate">temasek</code></li>
<li class="list-inline-item"><code class="notranslate">teva</code></li>
<li class="list-inline-item"><code class="notranslate">tiffany</code></li>
<li class="list-inline-item"><code class="notranslate">tjx</code></li>
<li class="list-inline-item"><code class="notranslate">toray</code></li>
<li class="list-inline-item"><code class="notranslate">toshiba</code></li>
<li class="list-inline-item"><code class="notranslate">total</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">du khách</code></li>
<li class="list-inline-item"><code class="notranslate">tui</code></li>
<li class="list-inline-item"><code class="notranslate">tvs</code></li>
<li class="list-inline-item"><code class="notranslate">ubs</code></li>
<li class="list-inline-item"><code class="notranslate">unicom</code></li>
<li class="list-inline-item"><code class="notranslate">uol</code></li>
<li class="list-inline-item"><code class="notranslate">ups</code></li>
<li class="list-inline-item"><code class="notranslate">vanguard</code></li>
<li class="list-inline-item"><code class="notranslate">verisign</code></li>
<li class="list-inline-item"><code class="notranslate">vig</code></li>
<li class="list-inline-item"><code class="notranslate">viking</code></li>
<li class="list-inline-item"><code class="notranslate">virgin</code></li>
<li class="list-inline-item"><code class="notranslate">visa</code></li>
<li class="list-inline-item"><code class="notranslate">vista</code></li>
<li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">vivo</code></li>
<li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
<li class="list-inline-item"><code class="notranslate">volvo</code></li>
<li class="list-inline-item"><code class="notranslate">walmart</code></li>
<li class="list-inline-item"><code class="notranslate">walter</code></li>
<li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
<li class="list-inline-item"><code class="notranslate">weber</code></li>
<li class="list-inline-item"><code class="notranslate">đập</code></li>
<li class="list-inline-item"><code class="notranslate">williamhill</code></li>
<li class="list-inline-item"><code class="notranslate">cửa sổ</code></li>
<li class="list-inline-item"><code class="notranslate">wme</code></li>
<li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
<li class="list-inline-item"><code class="notranslate">woodside</code></li>
<li class="list-inline-item"><code class="notranslate">wtc</code></li>
<li class="list-inline-item"><code class="notranslate">xbox</code></li>
<li class="list-inline-item"><code class="notranslate">xerox</code></li>
<li class="list-inline-item"><code class="notranslate">xfinity</code></li>
<li class="list-inline-item"><code class="notranslate">yahoo</code></li>
<li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
<li class="list-inline-item"><code class="notranslate">yandex</code></li>
<li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
<li class="list-inline-item"><code class="notranslate">youtube</code></li>
<li class="list-inline-item"><code class="notranslate">zappos</code></li>
<li class="list-inline-item"><code class="notranslate">zara</code></li>
<li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>

Tính đến ngày 18 tháng 3 năm 2025, chúng tôi cũng đã thêm các vùng lãnh thổ hải ngoại của Pháp sau vào danh sách này ([theo yêu cầu GitHub này](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">bzh</code></li>
<li class="list-inline-item"><code class="notranslate">gf</code></li>
<li class="list-inline-item"><code class="notranslate">gp</code></li>
<li class="list-inline-item"><code class="notranslate">mq</code></li>
<li class="list-inline-item"><code class="notranslate">nc</code></li>
<li class="list-inline-item"><code class="notranslate">pf</code></li>
<li class="list-inline-item"><code class="notranslate">pm</code></li>
<li class="list-inline-item"><code class="notranslate">re</code></li>
<li class="list-inline-item"><code class="notranslate">tf</code></li>
<li class="list-inline-item"><code class="notranslate">wf</code></li>
<li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

Tính đến ngày 8 tháng 7 năm 2025, chúng tôi đã thêm các quốc gia cụ thể sau vào Châu Âu:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ax</code></li>
<li class="list-inline-item"><code class="notranslate">bg</code></li>
<li class="list-inline-item"><code class="notranslate">fo</code></li>
<li class="list-inline-item"><code class="notranslate">gi</code></li>
<li class="list-inline-item"><code class="notranslate">gr</code></li>
<li class="list-inline-item"><code class="notranslate">hr</code></li>
<li class="list-inline-item"><code class="notranslate">hu</code></li>
<li class="list-inline-item"><code class="notranslate">lt</code></li>
<li class="list-inline-item"><code class="notranslate">lu</code></li>
<li class="list-inline-item"><code class="notranslate">mc</code></li>
<li class="list-inline-item"><code class="notranslate">mk</code></li>
<li class="list-inline-item"><code class="notranslate">mt</code></li>
<li class="list-inline-item"><code class="notranslate">ro</code></li>
<li class="list-inline-item"><code class="notranslate">sk</code></li>
<li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

Chúng tôi đặc biệt không bao gồm `cz`, `ru` và `ua` do hoạt động spam cao.

### Tiêu chí danh sách cho phép của bạn là gì {#what-is-your-allowlist-criteria}

Chúng tôi có danh sách tĩnh [phần mở rộng tên miền được cho phép theo mặc định](#what-domain-name-extensions-are-allowlisted-by-default) – và chúng tôi cũng duy trì danh sách cho phép động, được lưu trong bộ nhớ đệm, dựa trên các tiêu chí nghiêm ngặt sau:

* Tên miền gốc của người gửi phải là [phần mở rộng tên miền phù hợp với danh sách chúng tôi cung cấp trong gói miễn phí của mình](#what-domain-name-extensions-can-be-used-for-free) (cùng với `biz` và `info`). Chúng tôi cũng bao gồm các kết quả trùng khớp một phần `edu`, `gov` và `mil`, chẳng hạn như `xyz.gov.au` và `xyz.edu.au`.
* Tên miền gốc của người gửi phải nằm trong top 100.000 kết quả phân tích tên miền gốc duy nhất từ [Danh sách phổ biến của ô](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Tên miền gốc của người gửi phải nằm trong top 50.000 kết quả từ các tên miền gốc duy nhất xuất hiện trong ít nhất 4 trong 7 ngày gần nhất của UPL (khoảng 50%+).
* Tên miền gốc của người gửi không được là [được phân loại](https://radar.cloudflare.com/categorization-feedback/) vì Cloudflare cho rằng đây là nội dung người lớn hoặc phần mềm độc hại.
* Tên miền gốc của người gửi phải có bản ghi A hoặc MX được thiết lập.
* Tên miền gốc của người gửi phải có một trong các bản ghi A, một số bản ghi MX, bản ghi DMARC có `biz`0 hoặc `biz`1, hoặc bản ghi SPF có `biz`2 hoặc `biz`3.

Nếu tiêu chí này được đáp ứng, tên miền gốc của người gửi sẽ được lưu trữ đệm trong 7 ngày. Lưu ý rằng tác vụ tự động của chúng tôi chạy hàng ngày – do đó, đây là bộ nhớ đệm danh sách cho phép luân phiên được cập nhật hàng ngày.

Công việc tự động của chúng tôi sẽ tải xuống 7 ngày trước đó của UPL trong bộ nhớ, giải nén chúng và sau đó phân tích cú pháp trong bộ nhớ theo các tiêu chí nghiêm ngặt ở trên.

Tất nhiên, các tên miền phổ biến tại thời điểm viết bài này như Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify, v.v. đều được bao gồm.

Nếu bạn là người gửi không nằm trong danh sách cho phép của chúng tôi, thì lần đầu tiên tên miền gốc FQDN hoặc địa chỉ IP của bạn gửi email, bạn sẽ là [tỷ lệ giới hạn](#do-you-have-rate-limiting) và [danh sách xám](#do-you-have-a-greylist). Lưu ý rằng đây là thông lệ tiêu chuẩn được áp dụng làm tiêu chuẩn email. Hầu hết các máy chủ email sẽ thử lại nếu nhận được lỗi giới hạn tốc độ hoặc lỗi danh sách xám (ví dụ: mã trạng thái lỗi cấp độ 421 hoặc 4xx).

**Lưu ý rằng những người gửi cụ thể như `a@gmail.com`, `b@xyz.edu` và `c@gov.au` vẫn có thể là [bị từ chối trong danh sách](#do-you-have-a-denylist)** (ví dụ: nếu chúng tôi tự động phát hiện thư rác, lừa đảo hoặc phần mềm độc hại từ những người gửi đó).

### Những phần mở rộng tên miền nào có thể được sử dụng miễn phí {#what-domain-name-extensions-can-be-used-for-free}

Kể từ ngày 31 tháng 3 năm 2023, chúng tôi đã áp dụng quy tắc chống thư rác mới để bảo vệ người dùng và dịch vụ của mình.

Quy định mới này chỉ cho phép sử dụng các phần mở rộng tên miền sau đây trên gói miễn phí của chúng tôi:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">tại</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">bởi</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
<li class="list-inline-item"><code class="notranslate">cc</code></li>
<li class="list-inline-item"><code class="notranslate">cd</code></li>
<li class="list-inline-item"><code class="notranslate">ch</code></li>
<li class="list-inline-item"><code class="notranslate">ck</code></li>
<li class="list-inline-item"><code class="notranslate">co</code></li>
<li class="list-inline-item"><code class="notranslate">com</code></li>
<li class="list-inline-item"><code class="notranslate">de</code></li>
<li class="list-inline-item"><code class="notranslate">dev</code></li>
<li class="list-inline-item"><code class="notranslate">dj</code></li>
<li class="list-inline-item"><code class="notranslate">dk</code></li>
<li class="list-inline-item"><code class="notranslate">ee</code></li>
<li class="list-inline-item"><code class="notranslate">es</code></li>
<li class="list-inline-item"><code class="notranslate">eu</code></li>
<li class="list-inline-item"><code class="notranslate">family</code></li>
<li class="list-inline-item"><code class="notranslate">fi</code></li>
<li class="list-inline-item"><code class="notranslate">fm</code></li>
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">ie</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">in</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">is</code></li>
<li class="list-inline-item"><code class="notranslate">it</code></li>
<li class="list-inline-item"><code class="notranslate">je</code></li>
<li class="list-inline-item"><code class="notranslate">jp</code></li>
<li class="list-inline-item"><code class="notranslate">ke</code></li>
<li class="list-inline-item"><code class="notranslate">kr</code></li>
<li class="list-inline-item"><code class="notranslate">la</code></li>
<li class="list-inline-item"><code class="notranslate">li</code></li>
<li class="list-inline-item"><code class="notranslate">lv</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">không</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">uk</code></li>
<li class="list-inline-item"><code class="notranslate">us</code></li>
<li class="list-inline-item"><code class="notranslate">uz</code></li>
<li class="list-inline-item"><code class="notranslate">vc</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### Bạn có danh sách xám {#do-you-have-a-greylist} không?

Có, chúng tôi áp dụng chính sách [danh sách email xám](https://en.wikipedia.org/wiki/Greylisting_\(email\)) rất lỏng lẻo. Danh sách xám chỉ áp dụng cho những người gửi không có trong danh sách cho phép của chúng tôi và sẽ tồn tại trong bộ nhớ đệm của chúng tôi trong 30 ngày.

Đối với bất kỳ người gửi mới nào, chúng tôi sẽ lưu trữ một khóa trong cơ sở dữ liệu Redis trong 30 ngày với giá trị được đặt theo thời gian đến ban đầu của yêu cầu đầu tiên của họ. Sau đó, chúng tôi từ chối email của họ với mã trạng thái thử lại là 450 và chỉ cho phép email đó được gửi đi sau 5 phút.

Nếu họ đã đợi thành công trong 5 phút kể từ thời gian đến ban đầu này, thì email của họ sẽ được chấp nhận và họ sẽ không nhận được mã trạng thái 450 này.

Khóa bao gồm tên miền gốc FQDN hoặc địa chỉ IP của người gửi. Điều này có nghĩa là bất kỳ tên miền phụ nào vượt qua danh sách xám cũng sẽ được chấp nhận cho tên miền gốc, và ngược lại (đây là chính sách "rất lỏng lẻo").

Ví dụ, nếu một email đến từ `test.example.com` trước khi chúng tôi thấy một email đến từ `example.com`, thì bất kỳ email nào từ `test.example.com` và/hoặc `example.com` sẽ phải chờ 5 phút kể từ thời điểm kết nối ban đầu. Chúng tôi không bắt cả `test.example.com` và `example.com` phải chờ 5 phút riêng (chính sách danh sách xám của chúng tôi áp dụng ở cấp tên miền gốc).

Xin lưu ý rằng danh sách xám không áp dụng cho bất kỳ người gửi nào trên [danh sách cho phép](#do-you-have-an-allowlist) của chúng tôi (ví dụ: Meta, Amazon, Netflix, Google, Microsoft tại thời điểm viết bài này).

### Bạn có danh sách từ chối không {#do-you-have-a-denylist}

Có, chúng tôi vận hành danh sách từ chối của riêng mình và cập nhật tự động theo thời gian thực và thủ công dựa trên thư rác và hoạt động độc hại được phát hiện.

Chúng tôi cũng sẽ lấy tất cả các địa chỉ IP từ danh sách từ chối UCEPROTECT Cấp độ 1 tại <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> mỗi giờ và đưa vào danh sách từ chối của chúng tôi với thời hạn hết hạn là 7 ngày.

Người gửi được tìm thấy trong danh sách từ chối sẽ nhận được mã lỗi 421 (chỉ ra cho người gửi thử lại sau) nếu họ [không được đưa vào danh sách cho phép](#do-you-have-an-allowlist).

Bằng cách sử dụng mã trạng thái 421 thay vì mã trạng thái 554, các lỗi cảnh báo sai tiềm ẩn có thể được giảm thiểu theo thời gian thực và sau đó tin nhắn có thể được gửi thành công trong lần thử tiếp theo.

**Dịch vụ này được thiết kế khác với các dịch vụ thư khác**, nơi nếu bạn bị đưa vào danh sách chặn, một lỗi nghiêm trọng và vĩnh viễn sẽ xảy ra. Việc yêu cầu người gửi thử lại thư thường rất khó khăn (đặc biệt là từ các tổ chức lớn), do đó, phương pháp này cho phép người gửi, người nhận hoặc chúng tôi có khoảng 5 ngày kể từ lần gửi email đầu tiên để can thiệp và khắc phục sự cố (bằng cách yêu cầu xóa khỏi danh sách từ chối).

Tất cả các yêu cầu xóa khỏi danh sách từ chối đều được quản trị viên theo dõi theo thời gian thực (ví dụ: để quản trị viên có thể cho phép vĩnh viễn các yêu cầu xóa khỏi danh sách từ chối).

Bạn có thể yêu cầu xóa danh sách từ chối tại <https://forwardemail.net/denylist>.. Yêu cầu xóa danh sách từ chối của người dùng trả phí sẽ được xử lý ngay lập tức, trong khi người dùng không trả phí phải đợi quản trị viên xử lý yêu cầu của họ.

Những người gửi bị phát hiện gửi nội dung thư rác hoặc vi-rút sẽ được thêm vào danh sách từ chối theo cách sau:

1. [dấu vân tay tin nhắn ban đầu](#how-do-you-determine-an-email-fingerprint) sẽ bị đưa vào danh sách xám khi phát hiện thư rác hoặc danh sách chặn từ người gửi "đáng tin cậy" (ví dụ: `gmail.com`, `microsoft.com`, `apple.com`).
* Nếu người gửi nằm trong danh sách cho phép, tin nhắn sẽ bị đưa vào danh sách xám trong 1 giờ.
* Nếu người gửi không nằm trong danh sách cho phép, tin nhắn sẽ bị đưa vào danh sách xám trong 6 giờ.
2. Chúng tôi phân tích các khóa danh sách từ chối từ thông tin từ người gửi và tin nhắn, và đối với mỗi khóa này, chúng tôi tạo một bộ đếm (nếu chưa có), tăng giá trị của khóa lên 1 và lưu vào bộ nhớ đệm trong 24 giờ.
* Đối với người gửi nằm trong danh sách cho phép:
* Thêm khóa cho địa chỉ email "MAIL FROM" trên phong bì nếu địa chỉ đó đạt SPF hoặc không đạt SPF, và địa chỉ đó không phải là [tên người dùng của bưu điện](#what-are-postmaster-addresses) hoặc [tên người dùng không trả lời](#what-are-no-reply-addresses).
* Nếu tiêu đề "Từ" được liệt kê trong danh sách cho phép, hãy thêm khóa cho địa chỉ email tiêu đề "Từ" nếu nó có SPF đạt hoặc DKIM đạt và được căn chỉnh.
* Nếu tiêu đề "Từ" không được liệt kê trong danh sách cho phép, hãy thêm khóa cho địa chỉ email tiêu đề "Từ" và tên miền gốc đã được phân tích cú pháp.
* Đối với người gửi không được liệt kê trong danh sách cho phép:
* Thêm khóa cho địa chỉ email "MAIL FROM" trên phong bì nếu nó có SPF đạt.
* Nếu tiêu đề "Từ" được liệt kê trong danh sách cho phép, hãy thêm khóa cho địa chỉ email tiêu đề "Từ" nếu nó có SPF đạt hoặc DKIM đạt và được căn chỉnh.
* Nếu tiêu đề "Từ" không được liệt kê trong danh sách cho phép, hãy thêm khóa cho địa chỉ email tiêu đề "Từ" và tên miền gốc đã được phân tích cú pháp.
* Thêm khóa cho địa chỉ IP từ xa của người gửi.
* Thêm khóa cho tên máy chủ được máy khách phân giải bằng cách tra cứu ngược từ địa chỉ IP của người gửi (nếu có).

* Thêm khóa cho tên miền gốc của tên máy chủ do khách hàng phân giải (nếu có, và nếu khóa này khác với tên máy chủ do khách hàng phân giải).
3. Nếu bộ đếm đạt 5 đối với người gửi và khóa không nằm trong danh sách cho phép, chúng tôi sẽ từ chối khóa trong 30 ngày và gửi email đến nhóm xử lý vi phạm. Các con số này có thể thay đổi và các cập nhật sẽ được phản ánh tại đây khi chúng tôi theo dõi vi phạm.
4. Nếu bộ đếm đạt 10 đối với người gửi và khóa nằm trong danh sách cho phép, chúng tôi sẽ từ chối khóa trong 7 ngày và gửi email đến nhóm xử lý vi phạm. Các con số này có thể thay đổi và các cập nhật sẽ được phản ánh tại đây khi chúng tôi theo dõi vi phạm.

> **LƯU Ý:** Trong tương lai gần, chúng tôi sẽ giới thiệu tính năng giám sát danh tiếng. Thay vào đó, tính năng giám sát danh tiếng sẽ tính toán thời điểm từ chối người gửi dựa trên ngưỡng phần trăm (thay vì bộ đếm thô sơ như đã đề cập ở trên).

### Bạn có giới hạn tỷ lệ không {#do-you-have-rate-limiting}

Giới hạn tốc độ người gửi được xác định bằng tên miền gốc được phân tích từ tra cứu PTR ngược trên địa chỉ IP của người gửi – hoặc nếu không tìm được kết quả, thì chỉ cần sử dụng địa chỉ IP của người gửi. Lưu ý rằng chúng tôi gọi giá trị này là `Sender` bên dưới.

Máy chủ MX của chúng tôi có giới hạn hàng ngày đối với thư đến được nhận cho [lưu trữ IMAP được mã hóa](/blog/docs/best-quantum-safe-encrypted-email-service):

* Thay vì giới hạn tốc độ thư đến nhận được trên cơ sở từng bí danh (ví dụ: `you@yourdomain.com`) – chúng tôi giới hạn tốc độ theo chính tên miền của bí danh (ví dụ: `yourdomain.com`). Điều này ngăn `Senders` làm quá tải hộp thư đến của tất cả các bí danh trên miền của bạn cùng một lúc.
* Chúng tôi có các giới hạn chung áp dụng cho tất cả `Senders` trên toàn bộ dịch vụ của chúng tôi, bất kể người nhận là ai:
* `Senders` mà chúng tôi coi là "đáng tin cậy" là nguồn đáng tin cậy (ví dụ: `gmail.com`, `microsoft.com`, `apple.com`) bị giới hạn gửi 100 GB mỗi ngày.
* `Senders` là [được phép đưa vào danh sách](#do-you-have-an-allowlist) bị giới hạn gửi 10 GB mỗi ngày.

* Tất cả các `yourdomain.com`0 khác đều bị giới hạn gửi 1 GB và/hoặc 1000 tin nhắn mỗi ngày.
* Chúng tôi có giới hạn cụ thể cho `yourdomain.com`1 và `yourdomain.com`2 là 1 GB và/hoặc 1000 tin nhắn mỗi ngày.

Máy chủ MX cũng giới hạn việc chuyển tiếp tin nhắn đến một hoặc nhiều người nhận thông qua giới hạn tốc độ – nhưng điều này chỉ áp dụng cho `Senders` chứ không phải [danh sách cho phép](#do-you-have-an-allowlist):

* Chúng tôi chỉ cho phép tối đa 100 kết nối mỗi giờ, trên mỗi tên miền gốc FQDN `Sender` đã được giải quyết (hoặc) địa chỉ IP từ xa `Sender` (nếu không có PTR ngược) và trên mỗi người nhận phong bì. Chúng tôi lưu trữ khóa để giới hạn tốc độ dưới dạng băm mật mã trong cơ sở dữ liệu Redis của mình.

* Nếu bạn gửi email qua hệ thống của chúng tôi, vui lòng đảm bảo bạn đã thiết lập PTR ngược cho tất cả các địa chỉ IP của mình (nếu không, mỗi tên miền gốc FQDN hoặc địa chỉ IP duy nhất mà bạn gửi sẽ bị giới hạn tốc độ).

* Lưu ý rằng nếu bạn gửi qua một hệ thống phổ biến như Amazon SES, thì bạn sẽ không bị giới hạn giá vì (tại thời điểm viết bài này) Amazon SES được liệt kê trong danh sách cho phép của chúng tôi.

* Nếu bạn gửi từ một tên miền như `test.abc.123.example.com`, thì giới hạn tốc độ sẽ được áp dụng cho `example.com`. Nhiều người gửi thư rác sử dụng hàng trăm tên miền phụ để vượt qua các bộ lọc thư rác thông thường, vốn chỉ giới hạn tốc độ cho các tên máy chủ duy nhất, thay vì các tên miền gốc FQDN duy nhất.

* `Senders` vượt quá giới hạn tốc độ sẽ bị từ chối với lỗi 421.

Máy chủ IMAP và SMTP của chúng tôi giới hạn các bí danh của bạn không có nhiều hơn `60` kết nối đồng thời cùng một lúc.

Máy chủ MX của chúng tôi giới hạn người gửi [không được phép](#do-you-have-an-allowlist) thiết lập hơn 10 kết nối đồng thời (với thời gian hết hạn bộ nhớ đệm là 3 phút cho bộ đếm, tương ứng với thời gian chờ ổ cắm là 3 phút của chúng tôi).

### Làm thế nào để bảo vệ chống lại tán xạ ngược {#how-do-you-protect-against-backscatter}

Thư trả lại sai địa chỉ hoặc thư rác trả lại (được gọi là "[Phản xạ ngược](https://en.wikipedia.org/wiki/Backscatter_\(email\))") có thể gây ảnh hưởng tiêu cực đến danh tiếng của địa chỉ IP người gửi.

Chúng tôi thực hiện hai bước để bảo vệ chống lại hiện tượng tán xạ ngược, được trình bày chi tiết trong các phần [Ngăn chặn thư trả lại từ những người gửi thư rác đã biết](#prevent-bounces-from-known-mail-from-spammers) và [Ngăn chặn sự phản xạ không cần thiết để bảo vệ chống lại sự tán xạ ngược](#prevent-unnecessary-bounces-to-protect-against-backscatter) bên dưới.

### Ngăn chặn thư trả lại từ MAIL đã biết TỪ những kẻ gửi thư rác {#prevent-bounces-from-known-mail-from-spammers}

Chúng tôi lấy danh sách từ [Backscatter.org](https://www.backscatterer.org/) (do [UCEPROTECT](https://www.uceprotect.net/) cung cấp) tại <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> mỗi giờ và đưa vào cơ sở dữ liệu Redis của chúng tôi (chúng tôi cũng so sánh sự khác biệt trước; trong trường hợp bất kỳ IP nào bị xóa cần được tôn trọng).

Nếu MAIL FROM để trống OR bằng (không phân biệt chữ hoa chữ thường) bất kỳ [địa chỉ của người quản lý bưu điện](#what-are-postmaster-addresses) (phần trước @ trong email), thì chúng tôi sẽ kiểm tra xem IP của người gửi có khớp với một IP trong danh sách này không.

Nếu IP của người gửi được liệt kê (và không nằm trong [danh sách cho phép](#do-you-have-an-allowlist) của chúng tôi), chúng tôi sẽ gửi lỗi 554 kèm thông báo `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Chúng tôi sẽ được cảnh báo nếu người gửi nằm trong cả danh sách Backscatterer và danh sách cho phép của chúng tôi để có thể giải quyết sự cố nếu cần.

Các kỹ thuật được mô tả trong phần này tuân thủ khuyến nghị "CHẾ ĐỘ AN TOÀN" tại <https://www.backscatterer.org/?target=usage> – nơi chúng tôi chỉ kiểm tra IP của người gửi nếu một số điều kiện nhất định đã được đáp ứng.

### Ngăn chặn các phản xạ không cần thiết để bảo vệ chống lại hiện tượng tán xạ ngược {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Email bị trả lại là email cho biết việc chuyển tiếp email đến người nhận đã thất bại hoàn toàn và email sẽ không được thử lại.

Một lý do phổ biến khiến thư bị đưa vào danh sách Backscatterer là thư trả lại sai địa chỉ hoặc thư rác trả lại, vì vậy chúng ta phải bảo vệ thư này theo một số cách sau:

1. Chúng tôi chỉ gửi khi xảy ra lỗi mã trạng thái >= 500 (khi nỗ lực chuyển tiếp email không thành công, ví dụ: Gmail phản hồi với lỗi cấp độ 500).

2. Chúng tôi chỉ gửi một lần duy nhất (chúng tôi sử dụng khóa vân tay trả lại được tính toán và lưu trữ trong bộ nhớ đệm để tránh gửi trùng lặp). Vân tay trả lại là khóa bao gồm vân tay của tin nhắn kết hợp với hàm băm của địa chỉ trả lại và mã lỗi của nó). Xem phần [Lấy dấu vân tay](#how-do-you-determine-an-email-fingerprint) để biết thêm thông tin chi tiết về cách tính vân tay tin nhắn. Vân tay trả lại được gửi thành công sẽ hết hạn sau 7 ngày trong bộ nhớ đệm Redis của chúng tôi.

3. Chúng tôi chỉ gửi khi MAIL FROM và/hoặc From không để trống và không chứa (không phân biệt chữ hoa chữ thường) [tên người dùng bưu điện](#what-are-postmaster-addresses) (phần trước @ trong email).

4. Chúng tôi sẽ không gửi nếu tin nhắn gốc có bất kỳ tiêu đề nào sau đây (không phân biệt chữ hoa chữ thường):

* Tiêu đề của `auto-submitted` có giá trị không bằng `no`.
* Tiêu đề của `x-auto-response-suppress` có giá trị `dr`, `autoreply`, `auto-reply`, `auto_reply` hoặc `all`
* Tiêu đề của `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 hoặc `no`7 (bất kể giá trị).

* Tiêu đề của `no`8 có giá trị là `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 hoặc `x-auto-response-suppress`3.

5. Chúng tôi sẽ không gửi nếu địa chỉ email MAIL FROM hoặc From kết thúc bằng `+donotreply`, `-donotreply`, `+noreply` hoặc `-noreply`.

6. Chúng tôi sẽ không gửi nếu phần tên người dùng của địa chỉ email Từ là `mdaemon` và có tiêu đề không phân biệt chữ hoa chữ thường là `X-MDDSN-Message`.

7. Chúng tôi không gửi nếu có tiêu đề `content-type` không phân biệt chữ hoa chữ thường của `multipart/report`.

### Làm thế nào để xác định dấu vân tay email {#how-do-you-determine-an-email-fingerprint}

Dấu vân tay của email được sử dụng để xác định tính duy nhất của email và ngăn chặn việc gửi các tin nhắn trùng lặp cũng như gửi [các lần trả lại trùng lặp](#prevent-unnecessary-bounces-to-protect-against-backscatter).

Dấu vân tay được tính toán từ danh sách sau:

* Máy khách đã giải quyết tên máy chủ FQDN hoặc địa chỉ IP
* Giá trị tiêu đề `Message-ID` (nếu có)
* Giá trị tiêu đề `Date` (nếu có)
* Giá trị tiêu đề `From` (nếu có)
* Giá trị tiêu đề `To` (nếu có)
* Giá trị tiêu đề `Cc` (nếu có)
* Giá trị tiêu đề `Subject` (nếu có)
* Giá trị tiêu đề `Body` (nếu có)

### Tôi có thể chuyển tiếp email đến các cổng khác ngoài 25 không (ví dụ: nếu ISP của tôi đã chặn cổng 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Có, kể từ ngày 5 tháng 5 năm 2020, chúng tôi đã thêm tính năng này. Hiện tại, tính năng này dành riêng cho từng tên miền, thay vì dành riêng cho từng bí danh. Nếu bạn cần tính năng này dành riêng cho từng bí danh, vui lòng liên hệ với chúng tôi để cho chúng tôi biết nhu cầu của bạn.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Bảo vệ Quyền riêng tư Nâng cao:
</strong>
<span>
Nếu bạn đang sử dụng gói trả phí (có tính năng bảo vệ quyền riêng tư nâng cao), vui lòng truy cập <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a>, nhấp vào "Thiết lập" bên cạnh tên miền của bạn, sau đó nhấp vào "Cài đặt". Nếu bạn muốn tìm hiểu thêm về các gói trả phí, hãy xem trang <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Bảng giá</a> của chúng tôi. Nếu không, bạn có thể tiếp tục làm theo hướng dẫn bên dưới.
</span>
</div>

Nếu bạn đang sử dụng gói miễn phí, chỉ cần thêm bản ghi DNS <strong class="notranslate">TXT</strong> mới như hiển thị bên dưới, nhưng hãy thay đổi cổng từ 25 thành cổng bạn chọn.

Ví dụ, nếu tôi muốn tất cả email gửi đến `example.com` được chuyển tiếp đến cổng SMTP 1337 của người nhận bí danh thay vì 25:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email-port=1337</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>

Trường hợp phổ biến nhất khi thiết lập chuyển tiếp cổng tùy chỉnh là khi bạn muốn chuyển tiếp tất cả email đến example.com sang một cổng khác tại example.com, ngoài cổng 25 theo chuẩn SMTP. Để thiết lập, chỉ cần thêm bản ghi catch-all <strong class="notranslate">TXT</strong> sau.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Có hỗ trợ ký hiệu dấu cộng + cho bí danh Gmail không {#does-it-support-the-plus--symbol-for-gmail-aliases}

Có, chắc chắn rồi.

### Có hỗ trợ tên miền phụ {#does-it-support-sub-domains} không

Có, chắc chắn rồi. Thay vì sử dụng "@", "." hoặc khoảng trống làm tên/máy chủ/bí danh, bạn chỉ cần sử dụng tên miền phụ làm giá trị.

Nếu bạn muốn `foo.example.com` chuyển tiếp email, hãy nhập `foo` làm giá trị tên/máy chủ/bí danh trong cài đặt DNS của bạn (cho cả bản ghi MX và <strong class="notranslate">TXT</strong>).

### Điều này có chuyển tiếp tiêu đề email của tôi không {#does-this-forward-my-emails-headers}

Có, chắc chắn rồi.

### Liệu đây có phải là {#is-this-well-tested} đã được kiểm tra kỹ lưỡng không?

Có, nó có các bài kiểm tra được viết bằng [ava](https://github.com/avajs/ava) và cũng có phạm vi bao phủ mã.

### Bạn có chuyển tiếp các thông báo và mã phản hồi SMTP không {#do-you-pass-along-smtp-response-messages-and-codes}

Vâng, chắc chắn rồi. Ví dụ: nếu bạn gửi email đến `hello@example.com` và email đó được đăng ký chuyển tiếp đến `user@gmail.com`, thì tin nhắn phản hồi SMTP và mã từ máy chủ SMTP "gmail.com" sẽ được trả về thay vì máy chủ proxy tại "mx1.forwardemail.net" hoặc "mx2.forwardemail.net".

### Làm thế nào để ngăn chặn những kẻ gửi thư rác và đảm bảo uy tín chuyển tiếp email tốt {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Xem các phần của chúng tôi về [Hệ thống chuyển tiếp email của bạn hoạt động như thế nào](#how-does-your-email-forwarding-system-work), [Bạn xử lý các vấn đề gửi email như thế nào?](#how-do-you-handle-email-delivery-issues) và [Bạn xử lý thế nào khi địa chỉ IP của bạn bị chặn?](#how-do-you-handle-your-ip-addresses-becoming-blocked) ở trên.

### Bạn thực hiện tra cứu DNS trên tên miền {#how-do-you-perform-dns-lookups-on-domain-names} như thế nào?

Chúng tôi đã tạo một dự án phần mềm nguồn mở :tangerine: [Quýt](https://github.com/forwardemail/tangerine) và sử dụng nó để tra cứu DNS. Các máy chủ DNS mặc định được sử dụng là `1.1.1.1` và `1.0.0.1`, và các truy vấn DNS được thực hiện thông qua [DNS qua HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ở lớp ứng dụng.

:tangerine: [Quýt](https://github.com/tangerine) sử dụng [dịch vụ DNS dành cho người tiêu dùng ưu tiên quyền riêng tư của CloudFlare theo mặc định][cloudflare-dns].

## Tài khoản và Thanh toán {#account-and-billing}

### Bạn có cung cấp bảo đảm hoàn tiền cho các gói trả phí không {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Có! Hoàn tiền tự động sẽ được áp dụng khi bạn nâng cấp, hạ cấp hoặc hủy tài khoản trong vòng 30 ngày kể từ ngày bắt đầu gói dịch vụ. Điều này chỉ áp dụng cho khách hàng đăng ký lần đầu.

### Nếu tôi đổi gói cước, bạn có tính theo tỷ lệ và hoàn lại phần chênh lệch không? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Chúng tôi không tính tỷ lệ hoặc hoàn lại khoản chênh lệch khi bạn chuyển đổi gói cước. Thay vào đó, chúng tôi sẽ chuyển đổi thời hạn còn lại từ ngày hết hạn của gói cước hiện tại sang thời hạn tương đối gần nhất của gói cước mới (làm tròn xuống theo tháng).

Xin lưu ý rằng nếu bạn nâng cấp hoặc hạ cấp giữa các gói trả phí trong vòng 30 ngày kể từ lần đầu tiên bắt đầu gói trả phí, chúng tôi sẽ tự động hoàn lại toàn bộ số tiền từ gói hiện tại của bạn.

### Tôi có thể sử dụng dịch vụ chuyển tiếp email này làm máy chủ MX "dự phòng" hoặc "dự phòng" không {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Không, không khuyến khích vì bạn chỉ có thể sử dụng một máy chủ trao đổi thư tại một thời điểm. Các máy chủ dự phòng thường không bao giờ được thử lại do cấu hình ưu tiên sai và máy chủ thư không tuân thủ quy trình kiểm tra ưu tiên trao đổi MX.

### Tôi có thể vô hiệu hóa các bí danh cụ thể {#can-i-disable-specific-aliases} không?

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>

Nếu bạn đang sử dụng gói trả phí, bạn phải truy cập <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh <i class="fa fa-angle-right"></i> Chỉnh sửa bí danh <i class="fa fa-angle-right"></i> Bỏ chọn hộp kiểm "Đang hoạt động" <i class="fa fa-angle-right"></i> Tiếp tục.
</span>
</div>

Có, chỉ cần chỉnh sửa bản ghi DNS <strong class="notranslate">TXT</strong> của bạn và thêm tiền tố vào bí danh bằng một, hai hoặc ba dấu chấm than (xem bên dưới).

Lưu ý rằng bạn *nên* giữ nguyên ánh xạ ":", vì điều này là bắt buộc nếu bạn quyết định tắt (và nó cũng được sử dụng để nhập nếu bạn nâng cấp lên một trong các gói trả phí của chúng tôi).

**Đối với trường hợp từ chối im lặng (người gửi sẽ thấy tin nhắn như thể đã gửi thành công, nhưng thực tế không đi đến đâu cả) (mã trạng thái `250`):** Nếu bạn thêm tiền tố "!" (dấu chấm than đơn) vào một bí danh thì nó sẽ trả về mã trạng thái thành công là `250` cho những người gửi đang cố gắng gửi đến địa chỉ này, nhưng bản thân email sẽ không đi đến đâu cả (ví dụ: hố đen hoặc `/dev/null`).

**Đối với trường hợp từ chối mềm (mã trạng thái `421`):** Nếu bạn thêm tiền tố "!!" (dấu chấm than kép) vào bí danh thì mã trạng thái lỗi mềm `421` sẽ được trả về cho những người gửi đang cố gắng gửi đến địa chỉ này và email thường sẽ được thử lại trong tối đa 5 ngày trước khi bị từ chối và trả lại.

**Đối với trường hợp từ chối cứng (mã trạng thái `550`):** Nếu bạn thêm tiền tố "!!!" (ba dấu chấm than) vào bí danh thì hệ thống sẽ trả về mã trạng thái lỗi cố định là `550` cho những người gửi đang cố gắng gửi đến địa chỉ này và email sẽ bị từ chối và trả lại.

Ví dụ, nếu tôi muốn tất cả email gửi đến `alias@example.com` ngừng chuyển đến `user@gmail.com` và bị từ chối và trả lại (ví dụ: sử dụng ba dấu chấm than):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>
Bạn cũng có thể viết lại địa chỉ người nhận được chuyển tiếp thành "nobody@forwardemail.net", điều này sẽ chuyển hướng nó đến không ai cả như trong ví dụ bên dưới.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>
Nếu bạn muốn tăng cường bảo mật, bạn cũng có thể xóa phần ":user@gmail.com" (hoặc ":nobody@forwardemail.net"), chỉ để lại "!!!alias" như trong ví dụ bên dưới.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### Tôi có thể chuyển tiếp email đến nhiều người nhận không {#can-i-forward-emails-to-multiple-recipients}

Có, chắc chắn rồi. Chỉ cần chỉ định nhiều người nhận trong bản ghi <strong class="notranslate">TXT</strong> của bạn.

Ví dụ, nếu tôi muốn một email gửi đến `hello@example.com` được chuyển tiếp đến `user+a@gmail.com` và `user+b@gmail.com`, thì bản ghi <strong class="notranslate">TXT</strong> của tôi sẽ trông như thế này:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Hoặc bạn có thể chỉ định chúng trong hai dòng riêng biệt, chẳng hạn như sau:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Tùy bạn đấy!

### Tôi có thể có nhiều người nhận toàn cầu không {#can-i-have-multiple-global-catch-all-recipients}

Có, bạn có thể. Chỉ cần chỉ định nhiều người nhận toàn cầu trong bản ghi <strong class="notranslate">TXT</strong> của bạn.

Ví dụ, nếu tôi muốn mọi email gửi đến `*@example.com` (dấu hoa thị có nghĩa là ký tự đại diện hay còn gọi là bắt tất cả) được chuyển tiếp đến `user+a@gmail.com` và `user+b@gmail.com`, thì bản ghi <strong class="notranslate">TXT</strong> của tôi sẽ trông như thế này:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Hoặc bạn có thể chỉ định chúng trong hai dòng riêng biệt, chẳng hạn như sau:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Tên/Máy chủ/Bí danh</th>
<th class="text-center">TTL</th>
<th>Loại</th>
<th>Câu trả lời/Giá trị</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, ".", hoặc để trống</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Tùy bạn đấy!

### Có giới hạn tối đa về số lượng địa chỉ email tôi có thể chuyển tiếp đến cho mỗi bí danh {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias} không?

Vâng, giới hạn mặc định là 10. Điều này KHÔNG có nghĩa là bạn chỉ có thể có 10 bí danh trên tên miền của mình. Bạn có thể có bao nhiêu bí danh tùy thích (không giới hạn số lượng). Điều này có nghĩa là bạn chỉ có thể chuyển tiếp một bí danh đến 10 địa chỉ email duy nhất. Bạn có thể có `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (từ 1-10) – và bất kỳ email nào gửi đến `hello@example.com` sẽ được chuyển tiếp đến `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (từ 1-10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Mẹo:
</strong>
<span>
Bạn cần nhiều hơn 10 người nhận cho mỗi bí danh? Hãy gửi email cho chúng tôi và chúng tôi sẽ rất vui lòng tăng giới hạn tài khoản của bạn.
</span>
</div>

### Tôi có thể chuyển tiếp email theo cách đệ quy {#can-i-recursively-forward-emails} không?

Có, bạn có thể, tuy nhiên bạn vẫn phải tuân thủ giới hạn tối đa. Nếu bạn có `hello:linus@example.com` và `linus:user@gmail.com`, thì email gửi đến `hello@example.com` sẽ được chuyển tiếp đến `linus@example.com` và `user@gmail.com`. Lưu ý rằng lỗi sẽ xuất hiện nếu bạn cố gắng chuyển tiếp email vượt quá giới hạn tối đa một cách đệ quy.

### Mọi người có thể hủy đăng ký hoặc đăng ký chuyển tiếp email của tôi mà không cần sự cho phép của tôi không {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Chúng tôi sử dụng xác minh bản ghi MX và <strong class="notranslate">TXT</strong>, do đó, nếu bạn thêm bản ghi MX và <strong class="notranslate">TXT</strong> tương ứng của dịch vụ này, bạn sẽ được đăng ký. Nếu bạn xóa chúng, bạn sẽ bị hủy đăng ký. Bạn sở hữu quyền sở hữu tên miền và quản lý DNS của mình, vì vậy nếu ai đó có quyền truy cập vào đó thì đó là một vấn đề.

### Nó miễn phí như thế nào {#how-is-it-free}

Forward Email cung cấp gói dịch vụ miễn phí thông qua sự kết hợp giữa phát triển nguồn mở, cơ sở hạ tầng hiệu quả và các gói trả phí tùy chọn hỗ trợ dịch vụ.

Gói miễn phí của chúng tôi được hỗ trợ bởi:

1. **Phát triển nguồn mở**: Cơ sở mã của chúng tôi là nguồn mở, cho phép cộng đồng đóng góp và hoạt động minh bạch.

2. **Cơ sở hạ tầng hiệu quả**: Chúng tôi đã tối ưu hóa hệ thống của mình để xử lý việc chuyển tiếp email với lượng tài nguyên tối thiểu.

3. **Gói trả phí cao cấp**: Người dùng cần các tính năng bổ sung như gửi SMTP, nhận IMAP hoặc tùy chọn bảo mật nâng cao sẽ đăng ký gói trả phí của chúng tôi.

4. **Giới hạn sử dụng hợp lý**: Gói miễn phí có chính sách sử dụng hợp lý để ngăn chặn việc lạm dụng.

> \[!NOTE]
> Chúng tôi cam kết duy trì tính năng chuyển tiếp email cơ bản miễn phí đồng thời cung cấp các tính năng cao cấp cho người dùng có nhu cầu nâng cao hơn.

> \[!TIP]
> Nếu bạn thấy dịch vụ của chúng tôi hữu ích, hãy cân nhắc nâng cấp lên gói trả phí để hỗ trợ phát triển và bảo trì liên tục.

### Giới hạn kích thước email tối đa là bao nhiêu {#what-is-the-max-email-size-limit}

Chúng tôi mặc định giới hạn kích thước là 50MB, bao gồm nội dung, tiêu đề và tệp đính kèm. Lưu ý rằng các dịch vụ như Gmail và Outlook chỉ cho phép giới hạn kích thước là 25MB, và nếu bạn vượt quá giới hạn khi gửi đến các địa chỉ tại các nhà cung cấp đó, bạn sẽ nhận được thông báo lỗi.

Một lỗi có mã phản hồi thích hợp sẽ được trả về nếu vượt quá giới hạn kích thước tệp.

### Bạn có lưu trữ nhật ký email không {#do-you-store-logs-of-emails}

Không, chúng tôi không ghi vào đĩa hoặc lưu trữ nhật ký – với [ngoại lệ của lỗi](#do-you-store-error-logs) và [SMTP gửi đi](#do-you-support-sending-email-with-smtp) (xem [Chính sách bảo mật](/privacy) của chúng tôi).

Mọi thứ đều được thực hiện trong bộ nhớ và [mã nguồn của chúng tôi có trên GitHub](https://github.com/forwardemail).

### Bạn có lưu trữ nhật ký lỗi không {#do-you-store-error-logs}

**Có. Bạn có thể truy cập nhật ký lỗi tại [Tài khoản của tôi → Nhật ký](/my-account/logs) hoặc [Tài khoản của tôi → Tên miền](/my-account/domains).**

Tính đến tháng 2 năm 2023, chúng tôi lưu trữ nhật ký lỗi cho mã phản hồi SMTP `4xx` và `5xx` trong thời gian 7 ngày – bao gồm lỗi SMTP, phong bì và tiêu đề email (chúng tôi **không** lưu trữ nội dung email hoặc tệp đính kèm).

Nhật ký lỗi cho phép bạn kiểm tra các email quan trọng bị thiếu và giảm thiểu các trường hợp thư rác dương tính giả đối với [tên miền của bạn](/my-account/domains). Chúng cũng là một nguồn tài nguyên tuyệt vời để gỡ lỗi các sự cố với [webhooks email](#do-you-support-webhooks) (vì nhật ký lỗi chứa phản hồi điểm cuối webhook).

Không thể truy cập nhật ký lỗi cho [giới hạn tỷ lệ](#do-you-have-rate-limiting) và [danh sách xám](#do-you-have-a-greylist) vì kết nối kết thúc sớm (ví dụ: trước khi lệnh `RCPT TO` và `MAIL FROM` có thể được truyền đi).

Xem [Chính sách bảo mật](/privacy) của chúng tôi để biết thêm thông tin chi tiết.

### Bạn có đọc email của tôi không {#do-you-read-my-emails}

Không, hoàn toàn không. Hãy xem [Chính sách bảo mật](/privacy) của chúng tôi.

Nhiều dịch vụ chuyển tiếp email khác lưu trữ và có khả năng đọc email của bạn. Không có lý do gì email đã chuyển tiếp cần phải được lưu trữ trên ổ đĩa – và do đó, chúng tôi đã thiết kế giải pháp nguồn mở đầu tiên thực hiện tất cả trong bộ nhớ.

Chúng tôi tin rằng bạn có quyền riêng tư và chúng tôi hoàn toàn tôn trọng điều đó. Mã được triển khai trên máy chủ là [phần mềm nguồn mở trên GitHub](https://github.com/forwardemail) để đảm bảo tính minh bạch và xây dựng lòng tin.

### Tôi có thể "gửi thư dưới dạng" trong Gmail bằng {#can-i-send-mail-as-in-gmail-with-this} này không?

Có! Kể từ ngày 2 tháng 10 năm 2018, chúng tôi đã thêm tính năng này. Xem [Cách gửi thư bằng Gmail](#how-to-send-mail-as-using-gmail) ở trên!

Bạn cũng nên thiết lập bản ghi SPF cho Gmail trong bản ghi cấu hình DNS <strong class="notranslate">TXT</strong> của mình.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>
Nếu bạn đang sử dụng Gmail (ví dụ: Gửi thư dưới dạng) hoặc G Suite, bạn sẽ cần thêm <code>include:_spf.google.com</code> vào bản ghi SPF <strong class="notranslate">TXT</strong> của mình, ví dụ:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Tôi có thể "gửi thư dưới dạng" trong Outlook bằng {#can-i-send-mail-as-in-outlook-with-this} này không?

Có! Tính năng này đã được thêm vào từ ngày 2 tháng 10 năm 2018. Vui lòng xem hai liên kết từ Microsoft bên dưới:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Bạn cũng nên thiết lập bản ghi SPF cho Outlook trong bản ghi cấu hình DNS <strong class="notranslate">TXT</strong> của mình.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Quan trọng:
</strong>
<span>

Nếu bạn đang sử dụng Microsoft Outlook hoặc Live.com, bạn cần thêm <code>include:spf.protection.outlook.com</code> vào bản ghi SPF <strong class="notranslate">TXT</strong> của mình, ví dụ:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Tôi có thể "gửi thư dưới dạng" trong Apple Mail và iCloud Mail bằng {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this} này không?

Nếu bạn là người đăng ký iCloud+, bạn có thể sử dụng tên miền tùy chỉnh. [Dịch vụ của chúng tôi cũng tương thích với Apple Mail](#apple-mail).

Vui lòng xem <https://support.apple.com/en-us/102540> để biết thêm thông tin.

### Tôi có thể chuyển tiếp email không giới hạn bằng {#can-i-forward-unlimited-emails-with-this} này không?

Có, tuy nhiên, người gửi "tương đối không rõ danh tính" bị giới hạn ở mức 100 kết nối mỗi giờ cho mỗi tên máy chủ hoặc IP. Xem phần [Giới hạn tỷ lệ](#do-you-have-rate-limiting) và [Danh sách xám](#do-you-have-a-greylist) ở trên.

Khi nói "tương đối không xác định", chúng tôi muốn nói đến những người gửi không xuất hiện trong [danh sách cho phép](#do-you-have-an-allowlist).

Nếu vượt quá giới hạn này, chúng tôi sẽ gửi mã phản hồi 421 để thông báo cho máy chủ thư của người gửi thử lại sau.

### Bạn có cung cấp tên miền không giới hạn với một mức giá không? {#do-you-offer-unlimited-domains-for-one-price}

Có. Bất kể bạn chọn gói nào, bạn sẽ chỉ phải trả một mức phí hàng tháng – áp dụng cho tất cả tên miền của bạn.

### Bạn chấp nhận phương thức thanh toán nào {#which-payment-methods-do-you-accept}

Forward Email chấp nhận các phương thức thanh toán một lần hoặc hàng tháng/hàng quý/hàng năm sau:

1. **Thẻ Tín dụng/Ghi nợ/Chuyển khoản Ngân hàng**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, v.v.
2. **PayPal**: Kết nối tài khoản PayPal của bạn để thanh toán dễ dàng
3. **Tiền điện tử**: Chúng tôi chấp nhận thanh toán bằng stablecoin của Stripe trên các mạng lưới Ethereum, Polygon và Solana

> \[!NOTE]
> Chúng tôi lưu trữ thông tin thanh toán hạn chế trên máy chủ, chỉ bao gồm mã định danh thanh toán và tham chiếu đến giao dịch [Sọc](https://stripe.com/global) và [PayPal](https://www.paypal.com), khách hàng, đăng ký và ID thanh toán.

> \[!TIP]
> Để đảm bảo quyền riêng tư tối đa, hãy cân nhắc sử dụng thanh toán bằng tiền điện tử.

Mọi khoản thanh toán đều được xử lý an toàn thông qua Stripe hoặc PayPal. Thông tin thanh toán của bạn sẽ không bao giờ được lưu trữ trên máy chủ của chúng tôi.

## Tài nguyên bổ sung {#additional-resources}

> \[!TIP]
> Các bài viết bên dưới của chúng tôi được cập nhật thường xuyên với các hướng dẫn, mẹo và thông tin kỹ thuật mới. Hãy thường xuyên quay lại để biết nội dung mới nhất.

* [Nghiên cứu tình huống & Tài liệu dành cho nhà phát triển](/blog/docs)
* [Tài nguyên](/resources)
* [Hướng dẫn](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/