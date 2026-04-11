# Câu Hỏi Thường Gặp {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Các câu hỏi thường gặp về Forward Email" class="rounded-lg" />


## Mục Lục {#table-of-contents}

* [Bắt Đầu Nhanh](#quick-start)
* [Giới Thiệu](#introduction)
  * [Forward Email là gì](#what-is-forward-email)
  * [Ai sử dụng Forward Email](#who-uses-forward-email)
  * [Lịch sử của Forward Email là gì](#what-is-forward-emails-history)
  * [Dịch vụ này nhanh như thế nào](#how-fast-is-this-service)
* [Khách Hàng Email](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Thiết Bị Di Động](#mobile-devices)
  * [Cấu Hình Sendmail SMTP Relay](#sendmail-smtp-relay-configuration)
  * [Cấu Hình Exim4 SMTP Relay](#exim4-smtp-relay-configuration)
  * [Cấu Hình msmtp SMTP Client](#msmtp-smtp-client-configuration)
  * [Khách Hàng Email Dòng Lệnh](#command-line-email-clients)
  * [Cấu Hình Email Windows](#windows-email-configuration)
  * [Cấu Hình Postfix SMTP Relay](#postfix-smtp-relay-configuration)
  * [Cách Gửi Mail As sử dụng Gmail](#how-to-send-mail-as-using-gmail)
  * [Hướng Dẫn Miễn Phí Cũ cho Send Mail As sử dụng Gmail là gì](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Cấu Hình Định Tuyến Gmail Nâng Cao](#advanced-gmail-routing-configuration)
  * [Cấu Hình Định Tuyến Outlook Nâng Cao](#advanced-outlook-routing-configuration)
* [Khắc Phục Sự Cố](#troubleshooting)
  * [Tại sao tôi không nhận được email thử nghiệm của mình](#why-am-i-not-receiving-my-test-emails)
  * [Làm thế nào để cấu hình khách hàng email của tôi để làm việc với Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Tại sao email của tôi lại vào thư Spam và Junk và làm sao để kiểm tra uy tín tên miền của tôi](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Tôi nên làm gì nếu nhận được email spam](#what-should-i-do-if-i-receive-spam-emails)
  * [Tại sao email thử nghiệm gửi cho chính tôi trong Gmail lại hiển thị là "đáng ngờ"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Tôi có thể loại bỏ via forwardemail dot net trong Gmail không](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Quản Lý Dữ Liệu](#data-management)
  * [Máy chủ của bạn đặt ở đâu](#where-are-your-servers-located)
  * [Làm thế nào để xuất và sao lưu hộp thư của tôi](#how-do-i-export-and-backup-my-mailbox)
  * [Làm thế nào để nhập và di chuyển hộp thư hiện có của tôi](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Làm thế nào để sử dụng bộ nhớ tương thích S3 của riêng tôi cho sao lưu](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Làm thế nào để chuyển đổi sao lưu SQLite sang tập tin EML](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Bạn có hỗ trợ tự lưu trữ không](#do-you-support-self-hosting)
* [Cấu Hình Email](#email-configuration)
  * [Làm thế nào để bắt đầu và thiết lập chuyển tiếp email](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Tôi có thể sử dụng nhiều MX exchanges và máy chủ cho chuyển tiếp nâng cao không](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Làm thế nào để thiết lập trả lời tự động khi nghỉ phép (out of office auto-responder)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Làm thế nào để thiết lập SPF cho Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Làm thế nào để thiết lập DKIM cho Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Làm thế nào để thiết lập DMARC cho Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Làm thế nào để xem Báo Cáo DMARC](#how-do-i-view-dmarc-reports)
  * [Làm thế nào để kết nối và cấu hình danh bạ của tôi](#how-do-i-connect-and-configure-my-contacts)
  * [Làm thế nào để kết nối và cấu hình lịch của tôi](#how-do-i-connect-and-configure-my-calendars)
  * [Làm thế nào để thêm nhiều lịch hơn và quản lý các lịch hiện có](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Làm thế nào để kết nối và cấu hình công việc và nhắc nhở](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Tại sao tôi không thể tạo công việc trong macOS Reminders](#why-cant-i-create-tasks-in-macos-reminders)
  * [Làm thế nào để thiết lập Tasks.org trên Android](#how-do-i-set-up-tasksorg-on-android)
  * [Làm thế nào để thiết lập SRS cho Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Làm thế nào để thiết lập MTA-STS cho Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Làm thế nào để thêm ảnh hồ sơ vào địa chỉ email của tôi](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Tính Năng Nâng Cao](#advanced-features)
  * [Bạn có hỗ trợ bản tin hoặc danh sách gửi thư cho email liên quan đến marketing không](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Bạn có hỗ trợ gửi email bằng API không](#do-you-support-sending-email-with-api)
  * [Bạn có hỗ trợ nhận email bằng IMAP không](#do-you-support-receiving-email-with-imap)
  * [Bạn có hỗ trợ POP3 không](#do-you-support-pop3)
  * [Bạn có hỗ trợ lịch (CalDAV) không](#do-you-support-calendars-caldav)
  * [Bạn có hỗ trợ công việc và nhắc nhở (CalDAV VTODO) không](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Bạn có hỗ trợ danh bạ (CardDAV) không](#do-you-support-contacts-carddav)
  * [Bạn có hỗ trợ gửi email bằng SMTP không](#do-you-support-sending-email-with-smtp)
  * [Bạn có hỗ trợ OpenPGP/MIME, mã hóa đầu-cuối ("E2EE"), và Web Key Directory ("WKD") không](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Bạn có hỗ trợ mã hóa S/MIME không](#do-you-support-smime-encryption)
  * [Bạn có hỗ trợ lọc email bằng Sieve không](#do-you-support-sieve-email-filtering)
  * [Bạn có hỗ trợ MTA-STS không](#do-you-support-mta-sts)
  * [Bạn có hỗ trợ passkeys và WebAuthn không](#do-you-support-passkeys-and-webauthn)
  * [Bạn có hỗ trợ các thực hành tốt nhất về email không](#do-you-support-email-best-practices)
  * [Bạn có hỗ trợ bounce webhooks không](#do-you-support-bounce-webhooks)
  * [Bạn có hỗ trợ webhooks không](#do-you-support-webhooks)
  * [Bạn có hỗ trợ biểu thức chính quy hoặc regex không](#do-you-support-regular-expressions-or-regex)
  * [Giới hạn SMTP gửi đi của bạn là gì](#what-are-your-outbound-smtp-limits)
  * [Tôi có cần phê duyệt để bật SMTP không](#do-i-need-approval-to-enable-smtp)
  * [Cài đặt cấu hình máy chủ SMTP của bạn là gì](#what-are-your-smtp-server-configuration-settings)
  * [Cài đặt cấu hình máy chủ IMAP của bạn là gì](#what-are-your-imap-server-configuration-settings)
  * [Cài đặt cấu hình máy chủ POP3 của bạn là gì](#what-are-your-pop3-server-configuration-settings)
  * [Làm thế nào để thiết lập tự động phát hiện email cho tên miền của tôi](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Bảo Mật](#security-1)
  * [Kỹ Thuật Tăng Cường Máy Chủ Nâng Cao](#advanced-server-hardening-techniques)
  * [Bạn có chứng nhận SOC 2 hoặc ISO 27001 không](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Bạn có sử dụng mã hóa TLS cho chuyển tiếp email không](#do-you-use-tls-encryption-for-email-forwarding)
  * [Bạn có giữ nguyên các header xác thực email không](#do-you-preserve-email-authentication-headers)
  * [Bạn có giữ nguyên header email gốc và ngăn chặn giả mạo không](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Bạn bảo vệ chống spam và lạm dụng như thế nào](#how-do-you-protect-against-spam-and-abuse)
  * [Bạn có lưu trữ nội dung email trên đĩa không](#do-you-store-email-content-on-disk)
  * [Nội dung email có thể bị lộ trong trường hợp hệ thống bị sự cố không](#can-email-content-be-exposed-during-system-crashes)
  * [Ai có quyền truy cập vào hạ tầng email của bạn](#who-has-access-to-your-email-infrastructure)
  * [Bạn sử dụng nhà cung cấp hạ tầng nào](#what-infrastructure-providers-do-you-use)
  * [Bạn có cung cấp Thỏa Thuận Xử Lý Dữ Liệu (DPA) không](#do-you-offer-a-data-processing-agreement-dpa)
  * [Bạn xử lý thông báo vi phạm dữ liệu như thế nào](#how-do-you-handle-data-breach-notifications)
  * [Bạn có cung cấp môi trường thử nghiệm không](#do-you-offer-a-test-environment)
  * [Bạn có cung cấp công cụ giám sát và cảnh báo không](#do-you-provide-monitoring-and-alerting-tools)
  * [Bạn đảm bảo tính sẵn sàng cao như thế nào](#how-do-you-ensure-high-availability)
  * [Bạn có tuân thủ Mục 889 của Đạo Luật Ủy Quyền Quốc Phòng (NDAA) không](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Chi Tiết Hệ Thống và Kỹ Thuật](#system-and-technical-details)
  * [Bạn có lưu trữ email và nội dung của chúng không](#do-you-store-emails-and-their-contents)
  * [Hệ thống chuyển tiếp email của bạn hoạt động như thế nào](#how-does-your-email-forwarding-system-work)
  * [Bạn xử lý một email để chuyển tiếp như thế nào](#how-do-you-process-an-email-for-forwarding)
  * [Bạn xử lý các vấn đề giao nhận email như thế nào](#how-do-you-handle-email-delivery-issues)
  * [Bạn xử lý khi địa chỉ IP của bạn bị chặn như thế nào](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Địa chỉ postmaster là gì](#what-are-postmaster-addresses)
  * [Địa chỉ no-reply là gì](#what-are-no-reply-addresses)
  * [Địa chỉ IP của máy chủ bạn là gì](#what-are-your-servers-ip-addresses)
  * [Bạn có danh sách cho phép không](#do-you-have-an-allowlist)
  * [Các phần mở rộng tên miền nào được cho phép mặc định](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Tiêu chí danh sách cho phép của bạn là gì](#what-is-your-allowlist-criteria)
  * [Các phần mở rộng tên miền nào có thể sử dụng miễn phí](#what-domain-name-extensions-can-be-used-for-free)
  * [Bạn có danh sách xám không](#do-you-have-a-greylist)
  * [Bạn có danh sách từ chối không](#do-you-have-a-denylist)
  * [Bạn có giới hạn tốc độ không](#do-you-have-rate-limiting)
  * [Bạn bảo vệ chống lại backscatter như thế nào](#how-do-you-protect-against-backscatter)
  * [Ngăn chặn bounce từ các spammer MAIL FROM đã biết](#prevent-bounces-from-known-mail-from-spammers)
  * [Ngăn chặn bounce không cần thiết để bảo vệ chống lại backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Bạn xác định dấu vân tay email như thế nào](#how-do-you-determine-an-email-fingerprint)
  * [Tôi có thể chuyển tiếp email đến các cổng khác ngoài 25 (ví dụ nếu ISP của tôi đã chặn cổng 25) không](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Nó có hỗ trợ ký hiệu cộng + cho bí danh Gmail không](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Nó có hỗ trợ các tên miền phụ không](#does-it-support-sub-domains)
  * [Nó có chuyển tiếp các header email của tôi không](#does-this-forward-my-emails-headers)
  * [Nó có được kiểm tra kỹ lưỡng không](#is-this-well-tested)
  * [Bạn có truyền các thông điệp và mã phản hồi SMTP không](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Bạn ngăn chặn spammer và đảm bảo uy tín chuyển tiếp email tốt như thế nào](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Bạn thực hiện tra cứu DNS trên tên miền như thế nào](#how-do-you-perform-dns-lookups-on-domain-names)
* [Tài Khoản và Thanh Toán](#account-and-billing)
  * [Bạn có đảm bảo hoàn tiền cho các gói trả phí không](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Nếu tôi đổi gói, bạn có tính tỷ lệ và hoàn tiền phần chênh lệch không](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Tôi có thể chỉ sử dụng dịch vụ chuyển tiếp email này như một máy chủ MX "dự phòng" hoặc "dự phòng chuyển đổi" không](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Tôi có thể vô hiệu hóa các bí danh cụ thể không](#can-i-disable-specific-aliases)
  * [Tôi có thể chuyển tiếp email đến nhiều người nhận không](#can-i-forward-emails-to-multiple-recipients)
  * [Tôi có thể có nhiều người nhận toàn cầu catch-all không](#can-i-have-multiple-global-catch-all-recipients)
  * [Có giới hạn tối đa số địa chỉ email tôi có thể chuyển tiếp cho mỗi bí danh không](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Tôi có thể chuyển tiếp email theo kiểu đệ quy không](#can-i-recursively-forward-emails)
  * [Mọi người có thể hủy đăng ký hoặc đăng ký chuyển tiếp email của tôi mà không có sự cho phép của tôi không](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Nó miễn phí như thế nào](#how-is-it-free)
  * [Giới hạn kích thước email tối đa là bao nhiêu](#what-is-the-max-email-size-limit)
  * [Bạn có lưu trữ nhật ký email không](#do-you-store-logs-of-emails)
  * [Bạn có lưu trữ nhật ký lỗi không](#do-you-store-error-logs)
  * [Bạn có đọc email của tôi không](#do-you-read-my-emails)
  * [Tôi có thể "gửi mail as" trong Gmail với cái này không](#can-i-send-mail-as-in-gmail-with-this)
  * [Tôi có thể "gửi mail as" trong Outlook với cái này không](#can-i-send-mail-as-in-outlook-with-this)
  * [Tôi có thể "gửi mail as" trong Apple Mail và iCloud Mail với cái này không](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Tôi có thể chuyển tiếp email không giới hạn với cái này không](#can-i-forward-unlimited-emails-with-this)
  * [Bạn có cung cấp tên miền không giới hạn với một mức giá không](#do-you-offer-unlimited-domains-for-one-price)
  * [Bạn chấp nhận các phương thức thanh toán nào](#which-payment-methods-do-you-accept)
* [Tài Nguyên Bổ Sung](#additional-resources)
## Bắt Đầu Nhanh {#quick-start}

Để bắt đầu với Forward Email:

1. **Tạo tài khoản** tại [forwardemail.net/register](https://forwardemail.net/register)

2. **Thêm và xác minh tên miền của bạn** trong [Tài Khoản Của Tôi → Tên Miền](/my-account/domains)

3. **Thêm và cấu hình các bí danh/hộp thư email** trong [Tài Khoản Của Tôi → Tên Miền](/my-account/domains) → Bí Danh

4. **Kiểm tra thiết lập của bạn** bằng cách gửi email đến một trong các bí danh mới của bạn

> \[!TIP]
> Thay đổi DNS có thể mất đến 24-48 giờ để lan truyền toàn cầu, mặc dù thường có hiệu lực sớm hơn nhiều.

> \[!IMPORTANT]
> Để tăng cường khả năng gửi thành công, chúng tôi khuyến nghị thiết lập các bản ghi [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), và [DMARC](#how-do-i-set-up-dmarc-for-forward-email).


## Giới Thiệu {#introduction}

### Forward Email là gì {#what-is-forward-email}

> \[!NOTE]
> Forward Email rất phù hợp cho cá nhân, doanh nghiệp nhỏ và nhà phát triển muốn có địa chỉ email chuyên nghiệp mà không phải chịu chi phí và bảo trì của một giải pháp lưu trữ email đầy đủ.

Forward Email là một **nhà cung cấp dịch vụ email đầy đủ tính năng** và **nhà cung cấp lưu trữ email cho tên miền tùy chỉnh**.

Đây là dịch vụ duy nhất miễn phí và mã nguồn mở, cho phép bạn sử dụng địa chỉ email tên miền tùy chỉnh mà không phải phức tạp trong việc thiết lập và duy trì máy chủ email riêng.

Dịch vụ của chúng tôi chuyển tiếp email gửi đến tên miền tùy chỉnh của bạn đến tài khoản email hiện có của bạn – và bạn thậm chí có thể sử dụng chúng tôi làm nhà cung cấp lưu trữ email chuyên dụng.

Các tính năng chính của Forward Email:

* **Email Tên Miền Tùy Chỉnh**: Sử dụng địa chỉ email chuyên nghiệp với tên miền riêng của bạn
* **Gói Miễn Phí**: Chuyển tiếp email cơ bản không mất phí
* **Bảo Mật Nâng Cao**: Chúng tôi không đọc email của bạn hoặc bán dữ liệu của bạn
* **Mã Nguồn Mở**: Toàn bộ mã nguồn của chúng tôi có trên GitHub
* **Hỗ Trợ SMTP, IMAP, và POP3**: Khả năng gửi và nhận email đầy đủ
* **Mã Hóa Đầu Cuối**: Hỗ trợ OpenPGP/MIME
* **Bí Danh Catch-All Tùy Chỉnh**: Tạo không giới hạn bí danh email

Bạn có thể so sánh chúng tôi với hơn 56 nhà cung cấp dịch vụ email khác trên [trang So Sánh Email của chúng tôi](/blog/best-email-service).

> \[!TIP]
> Tìm hiểu thêm về Forward Email bằng cách đọc [Bản Báo Cáo Kỹ Thuật](/technical-whitepaper.pdf) miễn phí của chúng tôi

### Ai sử dụng Forward Email {#who-uses-forward-email}

Chúng tôi cung cấp dịch vụ lưu trữ email và chuyển tiếp email cho hơn 1.6+ million tên miền và các khách hàng nổi bật sau:

| Khách Hàng                              | Nghiên Cứu Trường Hợp                                                                                   |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Học Viện Hải Quân Hoa Kỳ                | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                              | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                         |                                                                                                          |
| The Linux Foundation                  | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| The PHP Foundation                    |                                                                                                          |
| Fox News Radio                       |                                                                                                          |
| Disney Ad Sales                      |                                                                                                          |
| jQuery                               | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                            |                                                                                                          |
| Ubuntu                               | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                              | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                              | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Đại Học Cambridge                   | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Đại Học Maryland                    | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Đại Học Washington                 | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Đại Học Tufts                      | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Swarthmore College                 | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Chính Phủ Nam Úc                  |                                                                                                          |
| Chính Phủ Cộng Hòa Dominican     |                                                                                                          |
| Fly<span>.</span>io               |                                                                                                          |
| RCD Hotels                       |                                                                                                          |
| Isaac Z. Schlueter (npm)          | [:page_facing_up: Nghiên Cứu Trường Hợp](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Lịch sử của Forward Email {#what-is-forward-emails-history}

Bạn có thể tìm hiểu thêm về Forward Email trên [trang Giới thiệu của chúng tôi](/about).

### Dịch vụ này nhanh như thế nào {#how-fast-is-this-service}

> \[!NOTE]
> Hệ thống của chúng tôi được thiết kế để nhanh chóng và đáng tin cậy, với nhiều máy chủ dự phòng để đảm bảo email của bạn được gửi đi kịp thời.

Forward Email chuyển tiếp tin nhắn với độ trễ tối thiểu, thường trong vòng vài giây sau khi nhận.

Các chỉ số hiệu suất:

* **Thời gian giao hàng trung bình**: Dưới 5-10 giây từ lúc nhận đến khi chuyển tiếp ([xem trang giám sát Thời gian vào hộp thư "TTI"](/tti))
* **Thời gian hoạt động**: Độ sẵn sàng dịch vụ trên 99,9%
* **Hạ tầng toàn cầu**: Máy chủ được đặt chiến lược để định tuyến tối ưu
* **Tự động mở rộng**: Hệ thống của chúng tôi mở rộng trong các thời điểm cao điểm gửi email

Chúng tôi hoạt động theo thời gian thực, không giống các nhà cung cấp khác dựa vào hàng đợi trì hoãn.

Chúng tôi không ghi vào đĩa hoặc lưu trữ nhật ký – ngoại trừ [lỗi](#do-you-store-error-logs) và [SMTP gửi đi](#do-you-support-sending-email-with-smtp) (xem [Chính sách Bảo mật](/privacy)).

Mọi thứ được thực hiện trong bộ nhớ và [mã nguồn của chúng tôi có trên GitHub](https://github.com/forwardemail).


## Các ứng dụng Email {#email-clients}

### Thunderbird {#thunderbird}

1. Tạo một bí danh mới và tạo mật khẩu trong bảng điều khiển Forward Email của bạn
2. Mở Thunderbird và vào **Chỉnh sửa → Cài đặt tài khoản → Hành động tài khoản → Thêm tài khoản thư**
3. Nhập tên, địa chỉ Forward Email và mật khẩu của bạn
4. Nhấn **Cấu hình thủ công** và nhập:
   * Máy chủ đến: IMAP, `imap.forwardemail.net`, cổng 993, SSL/TLS
   * Máy chủ đi: SMTP, `smtp.forwardemail.net`, cổng 465, SSL/TLS (khuyến nghị; cổng 587 với STARTTLS cũng được hỗ trợ)
5. Nhấn **Xong**

### Microsoft Outlook {#microsoft-outlook}

1. Tạo một bí danh mới và tạo mật khẩu trong bảng điều khiển Forward Email của bạn
2. Vào **Tệp → Thêm tài khoản**
3. Nhập địa chỉ Forward Email của bạn và nhấn **Kết nối**
4. Chọn **Tùy chọn nâng cao** và chọn **Cho phép tôi thiết lập tài khoản thủ công**
5. Chọn **IMAP** và nhập:
   * Máy chủ đến: `imap.forwardemail.net`, cổng 993, SSL
   * Máy chủ đi: `smtp.forwardemail.net`, cổng 465, SSL/TLS (khuyến nghị; cổng 587 với STARTTLS cũng được hỗ trợ)
   * Tên đăng nhập: Địa chỉ email đầy đủ của bạn
   * Mật khẩu: Mật khẩu bạn đã tạo
6. Nhấn **Kết nối**

### Apple Mail {#apple-mail}

1. Tạo một bí danh mới và tạo mật khẩu trong bảng điều khiển Forward Email của bạn
2. Vào **Mail → Tùy chọn → Tài khoản → +**
3. Chọn **Tài khoản Thư khác**
4. Nhập tên, địa chỉ Forward Email và mật khẩu của bạn
5. Đối với cài đặt máy chủ, nhập:
   * Máy chủ đến: `imap.forwardemail.net`
   * Máy chủ đi: `smtp.forwardemail.net`
   * Tên đăng nhập: Địa chỉ email đầy đủ của bạn
   * Mật khẩu: Mật khẩu bạn đã tạo
6. Nhấn **Đăng nhập**

### eM Client {#em-client}

1. Tạo một bí danh mới và tạo mật khẩu trong bảng điều khiển Forward Email của bạn
2. Mở eM Client và vào **Menu → Tài khoản → + Thêm tài khoản**
3. Nhấn vào **Thư** rồi chọn **Khác**
4. Nhập địa chỉ Forward Email của bạn và nhấn **Tiếp theo**
5. Nhập các cài đặt máy chủ sau:
   * **Máy chủ đến**: `imap.forwardemail.net`
   * **Máy chủ đi**: `smtp.forwardemail.net`
6. Nhập địa chỉ email đầy đủ của bạn làm **Tên người dùng** và mật khẩu bạn đã tạo làm **Mật khẩu** cho cả máy chủ đến và đi.
7. eM Client sẽ kiểm tra kết nối. Khi thành công, nhấn **Tiếp theo**.
8. Nhập tên của bạn và chọn tên tài khoản.
9. Nhấn **Hoàn tất**.

### Thiết bị di động {#mobile-devices}

Đối với iOS:

1. Vào **Cài đặt → Thư → Tài khoản → Thêm tài khoản → Khác**
2. Nhấn **Thêm tài khoản thư** và nhập thông tin của bạn
3. Đối với cài đặt máy chủ, sử dụng các cài đặt IMAP và SMTP như trên

Đối với Android:

1. Vào **Cài đặt → Tài khoản → Thêm tài khoản → Cá nhân (IMAP)**
2. Nhập địa chỉ Forward Email và mật khẩu của bạn
3. Đối với cài đặt máy chủ, sử dụng các cài đặt IMAP và SMTP như trên

### Cấu hình Sendmail SMTP Relay {#sendmail-smtp-relay-configuration}

Bạn có thể cấu hình Sendmail để chuyển tiếp email qua các máy chủ SMTP của Forward Email. Đây là thiết lập phổ biến cho các hệ thống cũ hoặc ứng dụng dựa vào Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Thời gian thiết lập ước tính:</strong>
  <span>Ít hơn 20 phút</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Điều này yêu cầu gói trả phí với quyền truy cập SMTP được bật.
  </span>
</div>

#### Cấu hình {#configuration}

1. Chỉnh sửa tệp `sendmail.mc` của bạn, thường nằm tại `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Thêm các dòng sau để định nghĩa smart host và xác thực:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Tạo tệp xác thực `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Thêm thông tin đăng nhập Forward Email của bạn vào tệp `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Tạo cơ sở dữ liệu xác thực và bảo mật các tệp:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Xây dựng lại cấu hình Sendmail và khởi động lại dịch vụ:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Kiểm tra {#testing}

Gửi email thử để xác minh cấu hình:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Cấu hình Exim4 SMTP Relay {#exim4-smtp-relay-configuration}

Exim4 là một MTA phổ biến trên các hệ thống dựa trên Debian. Bạn có thể cấu hình nó để sử dụng Forward Email làm smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Thời gian thiết lập ước tính:</strong>
  <span>Ít hơn 15 phút</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Điều này yêu cầu gói trả phí với quyền truy cập SMTP được bật.
  </span>
</div>

#### Cấu hình {#configuration-1}

1. Chạy công cụ cấu hình Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Chọn các tùy chọn sau:
   * **Loại cấu hình mail chung:** mail gửi qua smarthost; nhận qua SMTP hoặc fetchmail
   * **Tên mail hệ thống:** your.hostname
   * **Địa chỉ IP để lắng nghe kết nối SMTP đến:** 127.0.0.1 ; ::1
   * **Các điểm đến khác mà mail được chấp nhận:** (để trống)
   * **Tên miền để chuyển tiếp mail:** (để trống)
   * **Địa chỉ IP hoặc tên host của smarthost gửi đi:** smtp.forwardemail.net::465
   * **Ẩn tên mail cục bộ trong mail gửi đi?** Không
   * **Giữ số lượng truy vấn DNS tối thiểu (Dial-on-Demand)?** Không
   * **Phương thức giao hàng cho mail cục bộ:** Định dạng Mbox trong /var/mail/
   * **Chia cấu hình thành các tệp nhỏ?** Không

3. Chỉnh sửa tệp `passwd.client` để thêm thông tin đăng nhập của bạn:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Thêm dòng sau:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Cập nhật cấu hình và khởi động lại Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Kiểm tra {#testing-1}

Gửi email thử:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### Cấu hình msmtp SMTP Client {#msmtp-smtp-client-configuration}

msmtp là một client SMTP nhẹ, hữu ích để gửi email từ các script hoặc ứng dụng dòng lệnh.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Thời gian thiết lập ước tính:</strong>
  <span>Ít hơn 10 phút</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Điều này yêu cầu gói trả phí với quyền truy cập SMTP được bật.
  </span>
</div>

#### Cấu hình {#configuration-2}

1. Tạo hoặc chỉnh sửa tệp cấu hình msmtp tại `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Thêm cấu hình sau:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. Đặt quyền truy cập chính xác cho tệp cấu hình:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Kiểm tra {#testing-2}

Gửi email thử:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Các trình khách email dòng lệnh {#command-line-email-clients}

Các trình khách email dòng lệnh phổ biến như [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org), và [Alpine](https://alpine.x10.mx/alpine/release/) có thể được cấu hình để sử dụng máy chủ SMTP của Forward Email để gửi thư. Cấu hình sẽ tương tự như thiết lập `msmtp`, nơi bạn cung cấp chi tiết máy chủ SMTP và thông tin đăng nhập của bạn trong các tệp cấu hình tương ứng (`.muttrc`, `.neomuttrc`, hoặc `.pinerc`).

### Cấu hình email trên Windows {#windows-email-configuration}

Đối với người dùng Windows, bạn có thể cấu hình các trình khách email phổ biến như **Microsoft Outlook** và **eM Client** sử dụng các thiết lập IMAP và SMTP được cung cấp trong tài khoản Forward Email của bạn. Đối với việc sử dụng dòng lệnh hoặc scripting, bạn có thể dùng cmdlet `Send-MailMessage` của PowerShell (mặc dù nó được coi là lỗi thời) hoặc một công cụ chuyển tiếp SMTP nhẹ như [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Cấu hình chuyển tiếp SMTP Postfix {#postfix-smtp-relay-configuration}

Bạn có thể cấu hình Postfix để chuyển tiếp email qua các máy chủ SMTP của Forward Email. Điều này hữu ích cho các ứng dụng máy chủ cần gửi email.

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
    Điều này yêu cầu gói trả phí với quyền truy cập SMTP được bật.
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

2. Trong quá trình cài đặt, chọn "Internet Site" khi được hỏi loại cấu hình.

#### Cấu hình {#configuration-3}

1. Chỉnh sửa tệp cấu hình chính của Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Thêm hoặc sửa các thiết lập sau:

```
# Cấu hình chuyển tiếp SMTP
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Tạo tệp mật khẩu SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Thêm thông tin đăng nhập Forward Email của bạn:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
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

#### Kiểm tra {#testing-3}

Kiểm tra cấu hình bằng cách gửi email thử:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

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
    Nếu bạn đã làm theo hướng dẫn ở trên trong <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Làm thế nào để bắt đầu và thiết lập chuyển tiếp email</a>, thì bạn có thể tiếp tục đọc bên dưới.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Vui lòng đảm bảo bạn đã đọc <a href="/terms" class="alert-link" target="_blank">Điều khoản</a>, <a href="/privacy" class="alert-link" target="_blank">Chính sách bảo mật</a>, và <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giới hạn SMTP gửi đi</a> &ndash; việc bạn sử dụng được coi là sự thừa nhận và đồng ý.
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

1. Truy cập <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Cài đặt <i class="fa fa-angle-right"></i> Cấu hình SMTP gửi đi và làm theo hướng dẫn thiết lập

2. Tạo một bí danh mới cho tên miền của bạn trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ <code><hello@example.com></code>)

3. Nhấp vào <strong class="text-success"><i class="fa fa-key"></i> Tạo mật khẩu</strong> bên cạnh bí danh mới tạo. Sao chép vào bộ nhớ tạm và lưu trữ an toàn mật khẩu được tạo hiển thị trên màn hình.

4. Truy cập [Gmail](https://gmail.com) và trong [Cài đặt <i class="fa fa-angle-right"></i> Tài khoản và Nhập khẩu <i class="fa fa-angle-right"></i> Gửi thư dưới dạng](https://mail.google.com/mail/u/0/#settings/accounts), nhấp "Thêm địa chỉ email khác"

5. Khi được yêu cầu "Tên", nhập tên bạn muốn hiển thị trong phần "Từ" của email (ví dụ "Linus Torvalds").

6. Khi được yêu cầu "Địa chỉ email", nhập địa chỉ email đầy đủ của bí danh bạn đã tạo trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ <code><hello@example.com></code>)

7. Bỏ chọn "Xử lý như một bí danh"

8. Nhấp "Bước tiếp theo" để tiếp tục

9. Khi được yêu cầu "Máy chủ SMTP", nhập <code>smtp.forwardemail.net</code> và đổi cổng thành <code>465</code>

10. Khi được yêu cầu "Tên đăng nhập", nhập địa chỉ email đầy đủ của bí danh bạn đã tạo trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ <code><hello@example.com></code>)

11. Khi được yêu cầu "Mật khẩu", dán mật khẩu từ <strong class="text-success"><i class="fa fa-key"></i> Tạo mật khẩu</strong> ở bước 3 phía trên

12. Chọn nút radio cho "Kết nối bảo mật sử dụng SSL"

13. Nhấp "Thêm tài khoản" để tiếp tục

14. Mở tab mới đến [Gmail](https://gmail.com) và chờ email xác minh của bạn đến (bạn sẽ nhận được mã xác minh xác nhận bạn là chủ sở hữu của địa chỉ email bạn đang cố gắng "Gửi thư dưới dạng")

15. Khi nhận được, sao chép và dán mã xác minh vào lời nhắc bạn nhận được ở bước trước đó
16. Khi bạn đã làm xong bước đó, quay lại email và nhấp vào liên kết để "xác nhận yêu cầu". Bạn rất có thể sẽ cần thực hiện bước này và bước trước đó để email được cấu hình đúng cách.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Chúc mừng!
    </strong>
    <span>
      Bạn đã hoàn thành tất cả các bước thành công.
    </span>
  </div>
</div>

</div>

### Hướng dẫn miễn phí cũ cho Send Mail As sử dụng Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Quan trọng:</strong> Hướng dẫn miễn phí cũ này đã bị ngưng sử dụng kể từ tháng 5 năm 2023 vì <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">chúng tôi hiện hỗ trợ SMTP gửi đi</a>. Nếu bạn sử dụng hướng dẫn bên dưới, thì <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">điều này sẽ khiến email gửi đi của bạn</a> hiển thị "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" trong Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Thời gian ước tính thiết lập:</strong>
  <span>Dưới 10 phút</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Bắt đầu:
  </strong>
  <span>
    Nếu bạn đã làm theo hướng dẫn ở trên trong phần <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Làm thế nào để bắt đầu và thiết lập chuyển tiếp email</a>, thì bạn có thể tiếp tục đọc bên dưới.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Bạn cần bật [Xác thực hai yếu tố của Gmail][gmail-2fa] để điều này hoạt động. Truy cập <https://www.google.com/landing/2step/> nếu bạn chưa bật.

2. Khi Xác thực hai yếu tố được bật (hoặc nếu bạn đã bật trước đó), hãy truy cập <https://myaccount.google.com/apppasswords>.

3. Khi được yêu cầu "Chọn ứng dụng và thiết bị bạn muốn tạo mật khẩu ứng dụng cho":
   * Chọn "Mail" trong menu thả xuống "Chọn ứng dụng"
   * Chọn "Other" trong menu thả xuống "Chọn thiết bị"
   * Khi được yêu cầu nhập văn bản, hãy nhập địa chỉ email của tên miền tùy chỉnh mà bạn đang chuyển tiếp từ đó (ví dụ <code><hello@example.com></code> - điều này sẽ giúp bạn theo dõi nếu bạn sử dụng dịch vụ này cho nhiều tài khoản)

4. Sao chép mật khẩu được tạo tự động vào bộ nhớ tạm của bạn
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Quan trọng:
     </strong>
     <span>
       Nếu bạn đang sử dụng G Suite, hãy truy cập bảng điều khiển quản trị của bạn <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Apps <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Settings for Gmail <i class="fa fa-angle-right"></i> Settings</a> và đảm bảo đánh dấu chọn "Cho phép người dùng gửi thư qua máy chủ SMTP bên ngoài...". Sẽ có một khoảng thời gian chậm trễ để thay đổi này được kích hoạt, vì vậy vui lòng chờ vài phút.
     </span>
   </div>

5. Truy cập [Gmail](https://gmail.com) và trong phần [Cài đặt <i class="fa fa-angle-right"></i> Tài khoản và Nhập <i class="fa fa-angle-right"></i> Gửi thư dưới dạng](https://mail.google.com/mail/u/0/#settings/accounts), nhấp vào "Thêm địa chỉ email khác"

6. Khi được yêu cầu "Tên", nhập tên mà bạn muốn hiển thị trong phần "Từ" của email (ví dụ "Linus Torvalds")

7. Khi được yêu cầu "Địa chỉ email", nhập địa chỉ email với tên miền tùy chỉnh bạn đã dùng ở trên (ví dụ <code><hello@example.com></code>)
8. Bỏ chọn "Xử lý như một bí danh"

9. Nhấn "Bước tiếp theo" để tiếp tục

10. Khi được yêu cầu nhập "Máy chủ SMTP", nhập <code>smtp.gmail.com</code> và giữ nguyên cổng là <code>587</code>

11. Khi được yêu cầu nhập "Tên đăng nhập", nhập phần địa chỉ Gmail của bạn không bao gồm phần <span>gmail.com</span> (ví dụ chỉ nhập "user" nếu email của tôi là <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Quan trọng:
      </strong>
      <span>
        Nếu phần "Tên đăng nhập" được tự động điền, thì <u><strong>bạn sẽ cần thay đổi điều này</strong></u> thành phần tên đăng nhập của địa chỉ Gmail của bạn thay vào đó.
      </span>
    </div>

12. Khi được yêu cầu nhập "Mật khẩu", dán mật khẩu bạn đã tạo ở bước 2 phía trên từ bộ nhớ tạm của bạn

13. Giữ nguyên nút radio đã chọn cho "Kết nối bảo mật sử dụng TLS"

14. Nhấn "Thêm tài khoản" để tiếp tục

15. Mở tab mới đến [Gmail](https://gmail.com) và chờ email xác minh của bạn đến (bạn sẽ nhận được mã xác minh xác nhận bạn là chủ sở hữu của địa chỉ email mà bạn đang cố gắng "Gửi thư như")

16. Khi email đến, sao chép và dán mã xác minh vào lời nhắc bạn nhận được ở bước trước

17. Sau khi làm xong, quay lại email và nhấn vào liên kết để "xác nhận yêu cầu". Bạn rất có thể sẽ cần thực hiện bước này và bước trước đó để email được cấu hình đúng.

</div>

### Cấu hình định tuyến Gmail nâng cao {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Thời gian ước tính thiết lập:</strong>
  <span>15-30 phút</span>
</div>

Nếu bạn muốn thiết lập định tuyến nâng cao trong Gmail để các bí danh không khớp với hộp thư sẽ được chuyển tiếp đến các máy chủ thư của Forward Email, hãy làm theo các bước sau:

1. Đăng nhập vào bảng điều khiển quản trị Google của bạn tại [admin.google.com](https://admin.google.com)
2. Vào **Apps → Google Workspace → Gmail → Routing**
3. Nhấn vào **Add Route** và cấu hình các thiết lập sau:

**Cài đặt người nhận đơn lẻ:**

* Chọn "Change envelope recipient" và nhập địa chỉ Gmail chính của bạn
* Chọn "Add X-Gm-Original-To header with original recipient"

**Mẫu người nhận phong bì:**

* Thêm một mẫu khớp với tất cả các hộp thư không tồn tại (ví dụ, `.*@yourdomain.com`)

**Cài đặt máy chủ email:**

* Chọn "Route to host" và nhập `mx1.forwardemail.net` làm máy chủ chính
* Thêm `mx2.forwardemail.net` làm máy chủ dự phòng
* Đặt cổng là 25
* Chọn "Require TLS" để bảo mật

4. Nhấn **Save** để tạo định tuyến

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Cấu hình này chỉ hoạt động cho các tài khoản Google Workspace với tên miền tùy chỉnh, không áp dụng cho các tài khoản Gmail thông thường.
  </span>
</div>

### Cấu hình định tuyến Outlook nâng cao {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Thời gian ước tính thiết lập:</strong>
  <span>15-30 phút</span>
</div>

Đối với người dùng Microsoft 365 (trước đây là Office 365) muốn thiết lập định tuyến nâng cao để các bí danh không khớp với hộp thư sẽ được chuyển tiếp đến các máy chủ thư của Forward Email:

1. Đăng nhập vào trung tâm quản trị Microsoft 365 tại [admin.microsoft.com](https://admin.microsoft.com)
2. Vào **Exchange → Mail flow → Rules**
3. Nhấn **Add a rule** và chọn **Create a new rule**
4. Đặt tên cho quy tắc của bạn (ví dụ, "Chuyển tiếp các hộp thư không tồn tại đến Forward Email")
5. Trong phần **Apply this rule if**, chọn:
   * "The recipient address matches..."
   * Nhập mẫu khớp với tất cả địa chỉ tại tên miền của bạn (ví dụ, `*@yourdomain.com`)
6. Trong phần **Do the following**, chọn:
   * "Redirect the message to..."
   * Chọn "The following mail server"
   * Nhập `mx1.forwardemail.net` và cổng 25
   * Thêm `mx2.forwardemail.net` làm máy chủ dự phòng
7. Trong phần **Except if**, chọn:
   * "The recipient is..."
   * Thêm tất cả các hộp thư hiện có của bạn mà không nên chuyển tiếp
8. Đặt độ ưu tiên của quy tắc để đảm bảo nó chạy sau các quy tắc luồng thư khác
9. Nhấn **Save** để kích hoạt quy tắc
## Khắc phục sự cố {#troubleshooting}

### Tại sao tôi không nhận được email thử nghiệm của mình {#why-am-i-not-receiving-my-test-emails}

Nếu bạn gửi email thử nghiệm cho chính mình, thì nó có thể không xuất hiện trong hộp thư đến của bạn vì nó có cùng tiêu đề "Message-ID".

Đây là một vấn đề được biết rộng rãi, và cũng ảnh hưởng đến các dịch vụ như Gmail.  <a href="https://support.google.com/a/answer/1703601">Đây là câu trả lời chính thức của Gmail về vấn đề này</a>.

Nếu bạn tiếp tục gặp sự cố, thì rất có thể là do vấn đề với việc truyền phát DNS.  Bạn sẽ cần đợi lâu hơn một chút và thử lại (hoặc thử đặt giá trị TTL thấp hơn trên các bản ghi <strong class="notranslate">TXT</strong> của bạn).

**Vẫn gặp sự cố?**  Vui lòng <a href="/help">liên hệ với chúng tôi</a> để chúng tôi có thể giúp điều tra vấn đề và tìm giải pháp nhanh chóng.

### Làm thế nào để cấu hình trình khách email của tôi để làm việc với Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Dịch vụ của chúng tôi hoạt động với các trình khách email phổ biến như:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Tên đăng nhập của bạn là địa chỉ email bí danh của bạn và mật khẩu lấy từ <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("Mật khẩu bình thường").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Mẹo:
  </strong>
  <span>Nếu bạn đang sử dụng Thunderbird, hãy đảm bảo "Connection security" được đặt thành "SSL/TLS" và phương thức xác thực được đặt thành "Normal password".</span>
</div>

| Loại |         Tên máy chủ        |         Giao thức        |                                            Cổng                                           |
| :--: | :------------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net`    |  SSL/TLS **Ưu tiên**    |                                      `993` và `2993`                                      |
| SMTP | `smtp.forwardemail.net`    | SSL/TLS **Khuyến nghị** | `465` và `2465` cho SSL/TLS (khuyến nghị) hoặc `587`, `2587`, `2525`, và `25` cho STARTTLS |

### Tại sao email của tôi lại vào thư mục Spam và Junk và làm thế nào để kiểm tra uy tín tên miền của tôi {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Phần này hướng dẫn bạn nếu thư gửi đi của bạn sử dụng máy chủ SMTP của chúng tôi (ví dụ `smtp.forwardemail.net`) (hoặc được chuyển tiếp qua `mx1.forwardemail.net` hoặc `mx2.forwardemail.net`) và thư đó bị đưa vào thư mục Spam hoặc Junk của người nhận.

Chúng tôi thường xuyên theo dõi [địa chỉ IP](#what-are-your-servers-ip-addresses) của mình trên [tất cả các danh sách DNS uy tín](#how-do-you-handle-your-ip-addresses-becoming-blocked), **do đó rất có thể đây là vấn đề liên quan đến uy tín tên miền cụ thể**.

Email có thể bị đưa vào thư mục spam vì một số lý do sau:

1. **Thiếu xác thực**: Thiết lập các bản ghi [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), và [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Uy tín tên miền**: Các tên miền mới thường có uy tín trung lập cho đến khi thiết lập được lịch sử gửi thư.

3. **Kích hoạt bộ lọc nội dung**: Một số từ hoặc cụm từ có thể kích hoạt bộ lọc spam.

4. **Mẫu gửi thư**: Tăng đột ngột về số lượng email gửi đi có thể bị coi là đáng ngờ.

Bạn có thể thử sử dụng một hoặc nhiều công cụ sau để kiểm tra uy tín và phân loại tên miền của bạn:

#### Công cụ kiểm tra uy tín và danh sách chặn {#reputation-and-blocklist-check-tools}

| Tên công cụ                                | URL                                                          | Loại                   |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback   | <https://radar.cloudflare.com/domains/feedback>              | Phân loại              |
| Spamhaus IP and Domain Reputation Checker   | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Uy tín                 |
| Barracuda IP and Domain Reputation Lookup   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                  | <https://mxtoolbox.com/blacklists.aspx>                      | Danh sách đen          |
| Google Postmaster Tools                     | <https://www.gmail.com/postmaster/>                          | Uy tín                 |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                              | Uy tín                 |
| MultiRBL.valli.org Blacklist Check          | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | Uy tín                 |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3             | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org              | <https://www.backscatterer.org/>                             | Bảo vệ chống phản hồi  |
| UCEPROTECT's whitelisted.org                | <https://www.whitelisted.org/> (yêu cầu phí)                 | DNSWL                  |

#### Biểu mẫu yêu cầu gỡ chặn IP theo nhà cung cấp {#ip-removal-request-forms-by-provider}

Nếu địa chỉ IP của bạn bị chặn bởi nhà cung cấp email cụ thể, hãy sử dụng biểu mẫu gỡ chặn hoặc liên hệ phù hợp dưới đây:

| Nhà cung cấp                           | Biểu mẫu gỡ chặn / Liên hệ                                                                                 | Ghi chú                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | Biểu mẫu liên hệ người gửi hàng loạt         |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Cổng gỡ chặn IP Office 365                    |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Yahoo Sender Hub                             |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple sử dụng Proofpoint cho uy tín IP        |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | Kiểm tra và gỡ chặn IP Proofpoint             |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Tra cứu và gỡ chặn uy tín Barracuda           |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | Yêu cầu đặt lại Cloudmark CSI                  |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | Biểu mẫu yêu cầu gỡ chặn IP GoDaddy            |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | Yêu cầu gỡ chặn IP Comcast                     |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Liên hệ hỗ trợ Spectrum để gỡ chặn             |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | Email yêu cầu gỡ chặn                          |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | Email yêu cầu gỡ chặn                          |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | Sử dụng Cloudfilter                           |
| Windstream                             | `abuse@windstream.net`                                                                                     | Email yêu cầu gỡ chặn                          |
| t-online.de (Đức)                     | `tobr@rx.t-online.de`                                                                                      | Email yêu cầu gỡ chặn                          |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | Sử dụng biểu mẫu liên hệ hoặc email `abuse@orange.fr` |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | Biểu mẫu liên hệ postmaster GMX               |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | Cổng postmaster Mail.ru                        |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | Cổng postmaster Yandex                         |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | Đăng ký whitelist QQ Mail (Tiếng Trung)       |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | Cổng postmaster Netease                        |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Liên hệ qua bảng điều khiển Alibaba Cloud     |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | Bảng điều khiển AWS SES > Gỡ chặn danh sách đen |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | Liên hệ hỗ trợ SendGrid                        |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | Sử dụng RBL bên thứ ba - liên hệ RBL cụ thể   |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | Liên hệ hỗ trợ Fastmail                        |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Liên hệ hỗ trợ Zoho                            |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | Liên hệ hỗ trợ Proton                          |
| Tutanota                               | <https://tutanota.com/support>                                                                             | Liên hệ hỗ trợ Tutanota                        |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | Liên hệ hỗ trợ Hushmail                        |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | Liên hệ hỗ trợ Mailbox.org                     |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | Liên hệ hỗ trợ Posteo                          |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | Liên hệ hỗ trợ DuckDuckGo                      |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | Liên hệ hỗ trợ Sonic                           |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | Liên hệ hỗ trợ Telus                           |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | Liên hệ hỗ trợ Vodafone                        |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | Liên hệ hỗ trợ Spark NZ                        |
| UOL/BOL (Brazil)                       | <https://ajuda.uol.com.br/>                                                                                | Liên hệ hỗ trợ UOL (Tiếng Bồ Đào Nha)         |
| Libero (Italy)                         | <https://aiuto.libero.it/>                                                                                 | Liên hệ hỗ trợ Libero (Tiếng Ý)                |
| Telenet (Belgium)                      | <https://www2.telenet.be/en/support/>                                                                      | Liên hệ hỗ trợ Telenet                         |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | Liên hệ hỗ trợ doanh nghiệp Facebook           |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | Liên hệ hỗ trợ LinkedIn                        |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | Liên hệ hỗ trợ Groups.io                        |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | Công cụ người gửi Vade Secure                   |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Liên hệ hỗ trợ Cloudflare                      |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | Liên hệ hỗ trợ Hornetsecurity                   |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | Liên hệ qua nhà cung cấp hosting                |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | Liên hệ hỗ trợ Mail2World                       |
> \[!TIP]
> Bắt đầu với số lượng email chất lượng cao thấp để xây dựng danh tiếng tích cực trước khi gửi với số lượng lớn hơn.

> \[!IMPORTANT]
> Nếu tên miền của bạn nằm trong danh sách đen, mỗi danh sách đen có quy trình gỡ bỏ riêng. Kiểm tra trang web của họ để biết hướng dẫn.

> \[!TIP]
> Nếu bạn cần hỗ trợ thêm hoặc phát hiện chúng tôi bị liệt kê nhầm là spam bởi một nhà cung cấp dịch vụ email nào đó, vui lòng <a href="/help">liên hệ với chúng tôi</a>.

### Tôi nên làm gì nếu nhận được email rác {#what-should-i-do-if-i-receive-spam-emails}

Bạn nên hủy đăng ký khỏi danh sách gửi email (nếu có thể) và chặn người gửi.

Vui lòng không báo cáo tin nhắn là spam, thay vào đó hãy chuyển tiếp nó đến hệ thống phòng chống lạm dụng được quản lý thủ công và tập trung vào quyền riêng tư của chúng tôi.

**Địa chỉ email để chuyển tiếp spam là:** <abuse@forwardemail.net>

### Tại sao các email thử nghiệm gửi cho chính tôi trong Gmail lại hiển thị là "đáng ngờ" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Nếu bạn thấy thông báo lỗi này trong Gmail khi gửi thử cho chính mình, hoặc khi người bạn gửi email với bí danh của bạn lần đầu tiên nhận được email từ bạn, thì **xin đừng lo lắng** – vì đây là tính năng bảo mật tích hợp của Gmail.

Bạn chỉ cần nhấn "Looks safe". Ví dụ, nếu bạn gửi tin nhắn thử nghiệm sử dụng tính năng gửi mail như (send mail as) cho người khác, họ sẽ không thấy thông báo này.

Tuy nhiên nếu họ thấy thông báo này, đó là vì họ thường quen nhận email từ <john@gmail.com> thay vì <john@customdomain.com> (chỉ là ví dụ). Gmail cảnh báo người dùng để đảm bảo an toàn, không có cách nào bỏ qua.

### Tôi có thể loại bỏ phần via forwardemail dot net trong Gmail không {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Chủ đề này liên quan đến [vấn đề phổ biến trong Gmail khi thông tin bổ sung xuất hiện bên cạnh tên người gửi](https://support.google.com/mail/answer/1311182).

Từ tháng 5 năm 2023, chúng tôi hỗ trợ gửi email bằng SMTP như một tiện ích bổ sung cho tất cả người dùng trả phí – điều này có nghĩa là bạn có thể loại bỏ <span class="notranslate">via forwardemail dot net</span> trong Gmail.

Lưu ý rằng chủ đề FAQ này dành riêng cho những người sử dụng tính năng [Cách gửi mail như sử dụng Gmail](#how-to-send-mail-as-using-gmail).

Vui lòng xem phần [Bạn có hỗ trợ gửi email bằng SMTP không](#do-you-support-sending-email-with-smtp) để biết hướng dẫn cấu hình.


## Quản lý dữ liệu {#data-management}

### Máy chủ của bạn đặt ở đâu {#where-are-your-servers-located}

> \[!TIP]
> Chúng tôi có thể sớm công bố vị trí trung tâm dữ liệu EU được lưu trữ tại [forwardemail.eu](https://forwardemail.eu). Đăng ký thảo luận tại <https://github.com/orgs/forwardemail/discussions/336> để cập nhật.

Máy chủ của chúng tôi chủ yếu đặt tại Denver, Colorado – xem <https://forwardemail.net/ips> để biết danh sách đầy đủ các địa chỉ IP.

Bạn có thể tìm hiểu về các nhà xử lý phụ của chúng tôi trên các trang [GDPR](/gdpr), [DPA](/dpa), và [Quyền riêng tư](/privacy).

### Làm thế nào để xuất và sao lưu hộp thư của tôi {#how-do-i-export-and-backup-my-mailbox}

Bất cứ lúc nào bạn có thể xuất hộp thư của mình dưới định dạng [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox), hoặc [SQLite](https://en.wikipedia.org/wiki/SQLite) được mã hóa.

Đi tới <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh <i class="fa fa-angle-right"></i> Tải xuống sao lưu và chọn loại định dạng xuất ưa thích của bạn.

Bạn sẽ nhận được email chứa liên kết tải xuống sau khi quá trình xuất hoàn tất.

Lưu ý rằng liên kết tải xuống này hết hạn sau 4 giờ vì lý do bảo mật.

Nếu bạn cần kiểm tra các định dạng EML hoặc Mbox đã xuất, thì các công cụ mã nguồn mở sau có thể hữu ích:

| Tên             | Định dạng | Nền tảng     | URL GitHub                                          |
| --------------- | :-------: | ------------ | -------------------------------------------------- |
| MBox Viewer     |   Mbox    | Windows      | <https://github.com/eneam/mboxviewer>              |
| mbox-web-viewer |   Mbox    | Tất cả nền tảng | <https://github.com/PHMRanger/mbox-web-viewer>     |
| EmlReader       |    EML    | Windows      | <https://github.com/ayamadori/EmlReader>           |
| Email viewer    |    EML    | VSCode       | <https://github.com/joelharkes/vscode_email_viewer>|
| eml-reader      |    EML    | Tất cả nền tảng | <https://github.com/s0ph1e/eml-reader>             |
Ngoài ra nếu bạn cần chuyển đổi file Mbox sang file EML, bạn có thể sử dụng <https://github.com/noelmartinon/mboxzilla>.

### Làm thế nào để tôi nhập và di chuyển hộp thư hiện có của mình {#how-do-i-import-and-migrate-my-existing-mailbox}

Bạn có thể dễ dàng nhập email của mình vào Forward Email (ví dụ sử dụng [Thunderbird](https://www.thunderbird.net)) theo hướng dẫn dưới đây:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Bạn phải làm theo tất cả các bước sau để nhập email hiện có của mình.
  </span>
</div>

1. Xuất email từ nhà cung cấp email hiện tại của bạn:

   | Nhà cung cấp Email | Định dạng Xuất                               | Hướng dẫn Xuất                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | ------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail              | MBOX                                         | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook            | PST                                          | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Mẹo:</strong> <span>Nếu bạn đang sử dụng Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">định dạng xuất PST</a>), thì bạn có thể làm theo hướng dẫn trong phần "Khác" bên dưới. Tuy nhiên chúng tôi đã cung cấp các liên kết dưới đây để chuyển đổi PST sang định dạng MBOX/EML dựa trên hệ điều hành của bạn:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba cho Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst cho Windows cygwin</a> – (ví dụ <code>readpst -u -o $OUT_DIR $IN_DIR</code> thay thế <code>$OUT_DIR</code> và <code>$IN_DIR</code> bằng đường dẫn thư mục xuất và thư mục nhập tương ứng).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst cho Ubuntu/Linux</a> – (ví dụ <code>sudo apt-get install readpst</code> rồi <code>readpst -u -o $OUT_DIR $IN_DIR</code>, thay thế <code>$OUT_DIR</code> và <code>$IN_DIR</code> bằng đường dẫn thư mục xuất và thư mục nhập tương ứng).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst cho macOS (qua brew)</a> – (ví dụ <code>brew install libpst</code> rồi <code>readpst -u -o $OUT_DIR $IN_DIR</code>, thay thế <code>$OUT_DIR</code> và <code>$IN_DIR</code> bằng đường dẫn thư mục xuất và thư mục nhập tương ứng).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter cho Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail         | MBOX                                         | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail           | EML                                          | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail        | MBOX/EML                                     | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota           | EML                                          | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi              | EML                                          | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho               | EML                                          | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Khác               | [Sử dụng Thunderbird](https://www.thunderbird.net) | Thiết lập tài khoản email hiện có của bạn trong Thunderbird rồi sử dụng plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) để xuất và nhập email.  **Bạn cũng có thể đơn giản sao chép/dán hoặc kéo/thả email giữa các tài khoản với nhau.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Tải xuống, cài đặt và mở [Thunderbird](https://www.thunderbird.net).

3. Tạo một tài khoản mới sử dụng địa chỉ email đầy đủ của bí danh của bạn (ví dụ <code><you@yourdomain.com></code>) và mật khẩu đã tạo của bạn.  <strong>Nếu bạn chưa có mật khẩu được tạo, thì <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">tham khảo hướng dẫn thiết lập của chúng tôi</a></strong>.

4. Tải xuống và cài đặt plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) cho Thunderbird.

5. Tạo một thư mục cục bộ mới trong Thunderbird, sau đó nhấp chuột phải vào nó → chọn tùy chọn `ImportExportTools NG` → chọn `Import mbox file` (cho định dạng xuất MBOX) – hoặc – `Import messages` / `Import all messages from a directory` (cho định dạng xuất EML).

6. Kéo/thả từ thư mục cục bộ sang một thư mục IMAP mới (hoặc đã tồn tại) trong Thunderbird mà bạn muốn tải lên các tin nhắn vào bộ nhớ IMAP với dịch vụ của chúng tôi.  Điều này sẽ đảm bảo chúng được sao lưu trực tuyến với bộ nhớ mã hóa SQLite của chúng tôi.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Mẹo:
     </strong>
     <span>
       Nếu bạn bối rối về cách nhập vào Thunderbird, bạn có thể tham khảo hướng dẫn chính thức tại <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> và <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Khi bạn đã hoàn thành quá trình xuất và nhập, bạn cũng có thể muốn bật chuyển tiếp trên tài khoản email hiện tại của mình và thiết lập trả lời tự động để thông báo cho người gửi rằng bạn có địa chỉ email mới (ví dụ nếu trước đây bạn sử dụng Gmail và bây giờ sử dụng email với tên miền tùy chỉnh của bạn).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Chúc mừng!
    </strong>
    <span>
      Bạn đã hoàn thành tất cả các bước thành công.
    </span>
  </div>
</div>

### Làm thế nào để tôi sử dụng bộ nhớ tương thích S3 của riêng tôi cho việc sao lưu {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Người dùng gói trả phí có thể cấu hình nhà cung cấp bộ nhớ tương thích [S3](https://en.wikipedia.org/wiki/Amazon_S3) của riêng họ trên cơ sở từng tên miền cho sao lưu IMAP/SQLite.  Điều này có nghĩa là các bản sao lưu hộp thư mã hóa của bạn có thể được lưu trữ trên hạ tầng của riêng bạn thay vì (hoặc bổ sung cho) bộ nhớ mặc định của chúng tôi.

Các nhà cung cấp được hỗ trợ bao gồm [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces), và bất kỳ dịch vụ tương thích S3 nào khác.

#### Thiết lập {#setup}

1. Tạo một bucket **riêng tư** với nhà cung cấp tương thích S3 của bạn. Bucket không được truy cập công khai.
2. Tạo thông tin xác thực truy cập (access key ID và secret access key) với quyền đọc/ghi vào bucket.
3. Truy cập <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Cài đặt nâng cao <i class="fa fa-angle-right"></i> Bộ nhớ tương thích S3 tùy chỉnh.
4. Đánh dấu **"Bật bộ nhớ tương thích S3 tùy chỉnh"** và điền URL điểm cuối, access key ID, secret access key, vùng, và tên bucket của bạn.
5. Nhấn **"Kiểm tra kết nối"** để xác minh thông tin xác thực, quyền truy cập bucket, và quyền ghi.
6. Nhấn **"Lưu"** để áp dụng cài đặt.

#### Cách hoạt động của sao lưu {#how-backups-work}

Sao lưu được kích hoạt tự động cho mỗi bí danh IMAP được kết nối. Máy chủ IMAP kiểm tra tất cả các kết nối hoạt động mỗi giờ một lần và gửi một bản sao lưu cho mỗi bí danh được kết nối. Một khóa dựa trên Redis ngăn chặn việc chạy sao lưu trùng lặp trong vòng 30 phút, và bản sao lưu thực tế sẽ bị bỏ qua nếu một bản sao lưu thành công đã được hoàn thành trong vòng 24 giờ qua (trừ khi bản sao lưu được yêu cầu rõ ràng bởi người dùng để tải xuống).
Sao lưu cũng có thể được kích hoạt thủ công bằng cách nhấp vào **"Download Backup"** cho bất kỳ bí danh nào trong bảng điều khiển. Sao lưu thủ công luôn chạy bất kể cửa sổ 24 giờ.

Quy trình sao lưu hoạt động như sau:

1. Cơ sở dữ liệu SQLite được sao chép bằng `VACUUM INTO`, tạo ra một bản chụp nhất quán mà không làm gián đoạn các kết nối đang hoạt động và giữ nguyên mã hóa cơ sở dữ liệu.
2. Tệp sao lưu được xác minh bằng cách mở nó để xác nhận mã hóa vẫn còn hợp lệ.
3. Một hàm băm SHA-256 được tính toán và so sánh với bản sao lưu hiện có trong bộ nhớ. Nếu hàm băm khớp, việc tải lên sẽ bị bỏ qua (không có thay đổi kể từ lần sao lưu cuối).
4. Sao lưu được tải lên S3 bằng cách sử dụng tải lên đa phần qua thư viện [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. Một URL tải xuống có chữ ký (hợp lệ trong 4 giờ) được tạo và gửi email cho người dùng.

#### Backup Formats {#backup-formats}

Hỗ trợ ba định dạng sao lưu:

| Định dạng | Phần mở rộng | Mô tả                                                                 |
| -------- | ------------ | -------------------------------------------------------------------- |
| `sqlite` | `.sqlite`    | Bản chụp cơ sở dữ liệu SQLite được mã hóa thô (mặc định cho sao lưu IMAP tự động) |
| `mbox`   | `.zip`       | Tệp ZIP được bảo vệ bằng mật khẩu chứa hộp thư theo định dạng mbox   |
| `eml`    | `.zip`       | Tệp ZIP được bảo vệ bằng mật khẩu chứa các tệp `.eml` riêng lẻ cho mỗi tin nhắn |

> **Mẹo:** Nếu bạn có các tệp sao lưu `.sqlite` và muốn chuyển đổi chúng thành các tệp `.eml` cục bộ, hãy sử dụng công cụ CLI độc lập của chúng tôi **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Nó hoạt động trên Windows, Linux và macOS và không yêu cầu kết nối mạng.

#### File Naming and Key Structure {#file-naming-and-key-structure}

Khi sử dụng **lưu trữ S3 tùy chỉnh**, các tệp sao lưu được lưu với tiền tố dấu thời gian [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) để mỗi bản sao lưu được giữ dưới dạng một đối tượng riêng biệt. Điều này cung cấp cho bạn lịch sử sao lưu đầy đủ trong bucket của riêng bạn.

Định dạng khóa là:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Ví dụ:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` là ObjectId MongoDB của bí danh. Bạn có thể tìm thấy nó trong trang cài đặt bí danh hoặc qua API.

Khi sử dụng **lưu trữ mặc định (hệ thống)**, khóa là phẳng (ví dụ `65a31c53c36b75ed685f3fda.sqlite`) và mỗi bản sao lưu sẽ ghi đè lên bản sao lưu trước đó.

> **Lưu ý:** Vì lưu trữ S3 tùy chỉnh giữ lại tất cả các phiên bản sao lưu, việc sử dụng bộ nhớ sẽ tăng theo thời gian. Chúng tôi khuyến nghị cấu hình [quy tắc vòng đời](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) trên bucket của bạn để tự động hết hạn các bản sao lưu cũ (ví dụ xóa các đối tượng cũ hơn 30 hoặc 90 ngày).

#### Data Ownership and Deletion Policy {#data-ownership-and-deletion-policy}

Bucket S3 tùy chỉnh của bạn hoàn toàn do bạn kiểm soát. Chúng tôi **không bao giờ xóa hoặc sửa đổi** các tệp trong bucket S3 tùy chỉnh của bạn — không khi nào xóa bí danh, không khi nào xóa tên miền, và không trong bất kỳ hoạt động dọn dẹp nào. Chúng tôi chỉ ghi các tệp sao lưu mới vào bucket của bạn.

Điều này có nghĩa:

* **Xóa bí danh** — Khi bạn xóa một bí danh, chúng tôi chỉ xóa bản sao lưu khỏi lưu trữ hệ thống mặc định của chúng tôi. Bất kỳ bản sao lưu nào đã ghi vào bucket S3 tùy chỉnh của bạn vẫn không bị ảnh hưởng.
* **Xóa tên miền** — Việc xóa tên miền không ảnh hưởng đến các tệp trong bucket tùy chỉnh của bạn.
* **Quản lý lưu giữ** — Bạn chịu trách nhiệm quản lý bộ nhớ trong bucket của riêng bạn, bao gồm cấu hình quy tắc vòng đời để hết hạn các bản sao lưu cũ.

Nếu bạn tắt lưu trữ S3 tùy chỉnh hoặc chuyển về lưu trữ mặc định của chúng tôi, các tệp hiện có trong bucket của bạn vẫn được giữ nguyên. Các bản sao lưu trong tương lai sẽ được ghi vào lưu trữ mặc định của chúng tôi.

#### Security {#security}

* Khóa truy cập ID và khóa truy cập bí mật của bạn được **mã hóa khi lưu trữ** bằng [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) trước khi được lưu trong cơ sở dữ liệu của chúng tôi. Chúng chỉ được giải mã khi chạy để thực hiện các thao tác sao lưu.
* Chúng tôi tự động xác thực rằng bucket của bạn **không công khai truy cập**. Nếu phát hiện bucket công khai, cấu hình sẽ bị từ chối khi lưu. Nếu phát hiện truy cập công khai khi sao lưu, chúng tôi sẽ chuyển sang lưu trữ mặc định và thông báo cho tất cả quản trị viên tên miền qua email.
* Thông tin xác thực được xác thực khi lưu qua cuộc gọi [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) để đảm bảo bucket tồn tại và thông tin xác thực chính xác. Nếu xác thực thất bại, lưu trữ S3 tùy chỉnh sẽ tự động bị vô hiệu hóa.
* Mỗi tệp sao lưu bao gồm một hàm băm SHA-256 trong metadata S3 của nó, được sử dụng để phát hiện cơ sở dữ liệu không thay đổi và bỏ qua việc tải lên thừa.
#### Thông báo lỗi {#error-notifications}

Nếu một bản sao lưu thất bại khi sử dụng lưu trữ S3 tùy chỉnh của bạn (ví dụ do thông tin đăng nhập hết hạn hoặc sự cố kết nối), tất cả quản trị viên miền sẽ được thông báo qua email. Các thông báo này được giới hạn tần suất gửi mỗi 6 giờ để tránh cảnh báo trùng lặp. Nếu bucket của bạn được phát hiện có thể truy cập công khai vào thời điểm sao lưu, quản trị viên sẽ được thông báo một lần mỗi ngày.

#### API {#api}

Bạn cũng có thể cấu hình lưu trữ S3 tùy chỉnh qua API:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

Để kiểm tra kết nối qua API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Làm thế nào để chuyển đổi bản sao lưu SQLite sang file EML {#how-do-i-convert-sqlite-backups-to-eml-files}

Nếu bạn tải xuống hoặc lưu trữ các bản sao lưu SQLite (dù từ lưu trữ mặc định của chúng tôi hoặc [bucket S3 tùy chỉnh của bạn](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), bạn có thể chuyển đổi chúng thành các file `.eml` chuẩn bằng công cụ CLI độc lập của chúng tôi **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. File EML có thể được mở bằng bất kỳ ứng dụng email nào ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail), v.v.) hoặc nhập vào các máy chủ mail khác.

#### Cài đặt {#installation-1}

Bạn có thể tải xuống bản nhị phân đã được biên dịch sẵn (không cần [Node.js](https://github.com/nodejs/node)) hoặc chạy trực tiếp với [Node.js](https://github.com/nodejs/node):

**Bản nhị phân đã biên dịch sẵn** — Tải bản phát hành mới nhất cho nền tảng của bạn từ [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Nền tảng | Kiến trúc     | File                                  |
| -------- | ------------- | ------------------------------------ |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **Người dùng macOS:** Sau khi tải xuống, bạn có thể cần xóa thuộc tính cách ly trước khi chạy file nhị phân:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Thay `./convert-sqlite-to-eml-darwin-arm64` bằng đường dẫn thực tế đến file đã tải.)

> **Người dùng Linux:** Sau khi tải xuống, bạn có thể cần cấp quyền thực thi cho file nhị phân:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Thay `./convert-sqlite-to-eml-linux-x64` bằng đường dẫn thực tế đến file đã tải.)

**Từ mã nguồn** (yêu cầu [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Cách sử dụng {#usage}

Công cụ hỗ trợ cả chế độ tương tác và không tương tác.

**Chế độ tương tác** — chạy mà không có tham số và bạn sẽ được hỏi nhập tất cả thông tin:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Chuyển đổi bản sao lưu SQLite sang EML
  =============================================

  Đường dẫn đến file sao lưu SQLite: /path/to/backup.sqlite
  Mật khẩu IMAP/bí danh: ********
  Đường dẫn ZIP đầu ra [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Chế độ không tương tác** — truyền tham số qua các cờ dòng lệnh để lập trình và tự động hóa:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Cờ                  | Mô tả                                                                         |
| ------------------- | ----------------------------------------------------------------------------- |
| `--path <path>`     | Đường dẫn đến file sao lưu SQLite được mã hóa                                  |
| `--password <pass>` | Mật khẩu IMAP/bí danh để giải mã                                             |
| `--output <path>`   | Đường dẫn đầu ra cho file ZIP (mặc định: tự động tạo với dấu thời gian ISO 8601) |
| `--help`            | Hiển thị thông báo trợ giúp                                                    |
#### Định Dạng Đầu Ra {#output-format}

Công cụ tạo ra một tệp ZIP được bảo vệ bằng mật khẩu (mã hóa AES-256) chứa:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

Các tệp EML được tổ chức theo thư mục hộp thư. Mật khẩu ZIP giống với mật khẩu IMAP/bí danh của bạn. Mỗi tệp `.eml` là một tin nhắn email chuẩn theo [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) với đầy đủ tiêu đề, nội dung và tệp đính kèm được tái tạo từ cơ sở dữ liệu SQLite.

#### Cách Thức Hoạt Động {#how-it-works}

1. Mở cơ sở dữ liệu SQLite được mã hóa bằng mật khẩu IMAP/bí danh của bạn (hỗ trợ cả mã hóa [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) và [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. Đọc bảng Mailboxes để phát hiện cấu trúc thư mục.
3. Với mỗi tin nhắn, giải mã mimeTree (được lưu dưới dạng JSON nén bằng [Brotli](https://github.com/google/brotli)) từ bảng Messages.
4. Tái tạo đầy đủ tệp EML bằng cách duyệt cây MIME và lấy nội dung tệp đính kèm từ bảng Attachments.
5. Đóng gói tất cả vào tệp ZIP được bảo vệ bằng mật khẩu sử dụng [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Bạn có hỗ trợ tự lưu trữ không {#do-you-support-self-hosting}

Có, kể từ tháng 3 năm 2025, chúng tôi hỗ trợ tùy chọn tự lưu trữ. Đọc bài blog [tại đây](https://forwardemail.net/blog/docs/self-hosted-solution). Xem hướng dẫn [tự lưu trữ](https://forwardemail.net/self-hosted) để bắt đầu. Và với những ai quan tâm đến phiên bản hướng dẫn chi tiết hơn, xem các hướng dẫn dựa trên [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) hoặc [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Cấu Hình Email {#email-configuration}

### Làm thế nào để bắt đầu và thiết lập chuyển tiếp email {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Thời gian ước tính để thiết lập:</strong>
  <span>Ít hơn 10 phút</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Bắt đầu:
  </strong>
  <span>
    Đọc kỹ và làm theo các bước từ một đến tám được liệt kê dưới đây. Hãy chắc chắn thay thế địa chỉ email <code>user@gmail.com</code> bằng địa chỉ email bạn muốn chuyển tiếp email đến (nếu chưa chính xác). Tương tự, hãy thay thế <code>example.com</code> bằng tên miền tùy chỉnh của bạn (nếu chưa chính xác).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Nếu bạn đã đăng ký tên miền của mình ở đâu đó, thì bạn phải hoàn toàn bỏ qua bước này và chuyển sang bước hai! Nếu chưa, bạn có thể <a href="/domain-registration" rel="noopener noreferrer">nhấn vào đây để đăng ký tên miền của bạn</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Bạn có nhớ nơi bạn đã đăng ký tên miền không? Khi nhớ ra, hãy làm theo hướng dẫn dưới đây:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Bạn phải mở một tab mới và đăng nhập vào nhà đăng ký tên miền của bạn. Bạn có thể dễ dàng nhấn vào "Registrar" bên dưới để tự động làm điều này. Trong tab mới này, bạn phải điều hướng đến trang quản lý DNS tại nhà đăng ký – và chúng tôi đã cung cấp các bước điều hướng từng bước dưới cột "Steps to Configure". Khi bạn đã vào trang này trong tab mới, bạn có thể quay lại tab này và tiếp tục bước ba bên dưới.
    <strong class="font-weight-bold">Đừng đóng tab vừa mở; bạn sẽ cần nó cho các bước tiếp theo!</strong>
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
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> My Servers <i class="fa fa-angle-right"></i> Quản lý tên miền <i class="fa fa-angle-right"></i> Trình quản lý DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>DÀNH CHO ROCK: Đăng nhập <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Nhấn biểu tượng ▼ bên cạnh quản lý) <i class="fa fa-angle-right"></i> DNS
      <br />
      DÀNH CHO LEGACY: Đăng nhập <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Zone editor <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Quản lý</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Mạng <i class="fa fa-angle-right"></i> Tên miền <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Thêm <i class="fa fa-angle-right"></i> Quản lý tên miền</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Trong chế độ xem thẻ, nhấn quản lý tên miền <i class="fa fa-angle-right"></i> Trong chế độ xem danh sách, nhấn biểu tượng bánh răng <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> Bản ghi DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Xem</a>
      </td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Quản lý <i class="fa fa-angle-right"></i> (nhấn biểu tượng bánh răng) <i class="fa fa-angle-right"></i> Nhấn vào DNS &amp; Nameservers trong menu bên trái</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Bảng điều khiển <i class="fa fa-angle-right"></i> Tên miền <i class="fa fa-angle-right"></i> Quản lý tên miền <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Tổng quan <i class="fa fa-angle-right"></i> Quản lý <i class="fa fa-angle-right"></i> Trình chỉnh sửa đơn giản <i class="fa fa-angle-right"></i> Bản ghi</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Quản lý <i class="fa fa-angle-right"></i> Chỉnh sửa vùng</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Xem</a>
      </td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Quản lý tên miền của tôi <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Quản lý DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Xem</a>
      </td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Cấu hình DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Xem</a>
      </td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Danh sách tên miền <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Quản lý <i class="fa fa-angle-right"></i> DNS nâng cao</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Thiết lập DNS Netlify</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Quản lý tài khoản <i class="fa fa-angle-right"></i> Tên miền của tôi <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Quản lý <i class="fa fa-angle-right"></i> Thay đổi nơi tên miền trỏ đến <i class="fa fa-angle-right"></i> DNS nâng cao</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Xem</a>
      </td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Tên miền được quản lý <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> Cài đặt DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Menu chính <i class="fa fa-angle-right"></i> Cài đặt <i class="fa fa-angle-right"></i> Tên miền <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i>
Cài đặt nâng cao <i class="fa fa-angle-right"></i> Bản ghi tùy chỉnh</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Sử dụng CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Trang tên miền <i class="fa fa-angle-right"></i> (Chọn tên miền của bạn) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Trang tên miền <i class="fa fa-angle-right"></i> (Nhấn biểu tượng <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Chọn Quản lý bản ghi DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Đăng nhập <i class="fa fa-angle-right"></i> Tên miền <i class="fa fa-angle-right"></i> Tên miền của tôi</td>
    </tr>
    <tr>
      <td>Khác</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Quan trọng:</strong> Không thấy tên nhà đăng ký của bạn trong danh sách? Chỉ cần tìm kiếm trên Internet với từ khóa "cách thay đổi bản ghi DNS trên $REGISTRAR" (thay $REGISTRAR bằng tên nhà đăng ký của bạn – ví dụ "cách thay đổi bản ghi DNS trên GoDaddy" nếu bạn dùng GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Sử dụng trang quản lý DNS của nhà đăng ký (tab khác bạn đã mở), thiết lập các bản ghi "MX" sau:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Lưu ý rằng KHÔNG được thiết lập bất kỳ bản ghi MX nào khác. Cả hai bản ghi được hiển thị bên dưới PHẢI tồn tại. Hãy chắc chắn không có lỗi chính tả; và bạn đã viết đúng mx1 và mx2. Nếu đã có các bản ghi MX tồn tại, vui lòng xóa chúng hoàn toàn.
    Giá trị "TTL" không nhất thiết phải là 3600, có thể là giá trị thấp hơn hoặc cao hơn nếu cần thiết.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Priority</th>
      <th>Answer/Value</th>
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Sử dụng trang quản lý DNS của nhà đăng ký của bạn (tab khác mà bạn đã mở), thiết lập các bản ghi <strong class="notranslate">TXT</strong> sau:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Nếu bạn đang sử dụng gói trả phí, thì bạn phải hoàn toàn bỏ qua bước này và chuyển sang bước năm! Nếu bạn không sử dụng gói trả phí, thì các địa chỉ chuyển tiếp của bạn sẽ có thể tìm kiếm công khai – hãy vào <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> và nâng cấp tên miền của bạn lên gói trả phí nếu muốn. Nếu bạn muốn tìm hiểu thêm về các gói trả phí, xem trang <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Giá cả</a> của chúng tôi. Nếu không, bạn có thể tiếp tục chọn một hoặc nhiều kết hợp từ Tùy chọn A đến Tùy chọn F được liệt kê bên dưới.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tùy chọn A:
  </strong>
  <span>
    Nếu bạn đang chuyển tiếp tất cả email từ tên miền của bạn, (ví dụ "all@example.com", "hello@example.com", v.v.) đến một địa chỉ cụ thể "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
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
    Hãy chắc chắn thay thế các giá trị ở trên trong cột "Giá trị" bằng địa chỉ email của bạn. Giá trị "TTL" không nhất thiết phải là 3600, có thể là giá trị thấp hơn hoặc cao hơn nếu cần thiết. Giá trị thời gian sống ("TTL") thấp hơn sẽ đảm bảo các thay đổi trong tương lai đối với bản ghi DNS của bạn được truyền tải nhanh hơn trên Internet – hãy nghĩ đây là thời gian lưu trong bộ nhớ đệm (tính bằng giây). Bạn có thể tìm hiểu thêm về <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL trên Wikipedia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tùy chọn B:
  </strong>
  <span>
    Nếu bạn chỉ cần chuyển tiếp một địa chỉ email duy nhất (ví dụ <code>hello@example.com</code> đến <code>user@gmail.com</code>; điều này cũng sẽ tự động chuyển tiếp "hello+test@example.com" đến "user+test@gmail.com"):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
    Tùy chọn C:
  </strong>
  <span>
    Nếu bạn đang chuyển tiếp nhiều email, thì bạn sẽ muốn phân tách chúng bằng dấu phẩy:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
    Bạn có thể thiết lập vô số email chuyển tiếp – chỉ cần đảm bảo không vượt quá 255 ký tự trong một dòng và bắt đầu mỗi dòng bằng "forward-email=". Ví dụ được cung cấp bên dưới:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
    Bạn cũng có thể chỉ định một tên miền trong bản ghi <strong class="notranslate">TXT</strong> của bạn để có chuyển tiếp bí danh toàn cầu (ví dụ "user@example.com" sẽ được chuyển tiếp đến "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
    Bạn thậm chí có thể sử dụng webhooks làm bí danh toàn cầu hoặc cá nhân để chuyển tiếp email đến. Xem ví dụ và phần đầy đủ về webhooks có tiêu đề <a href="#do-you-support-webhooks" class="alert-link">Bạn có hỗ trợ webhooks không</a> bên dưới.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
    Bạn thậm chí có thể sử dụng biểu thức chính quy ("regex") để khớp các bí danh và xử lý thay thế để chuyển tiếp email đến. Xem các ví dụ và phần đầy đủ về regex có tiêu đề <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Bạn có hỗ trợ biểu thức chính quy hay regex không</a> bên dưới.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Cần regex nâng cao với thay thế?</strong> Xem các ví dụ và phần đầy đủ về regex có tiêu đề <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Bạn có hỗ trợ biểu thức chính quy hay regex không</a> bên dưới.
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
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
    Các quy tắc chuyển tiếp bắt tất cả cũng có thể được mô tả là "rơi qua".
    Điều này có nghĩa là các email đến khớp với ít nhất một quy tắc chuyển tiếp cụ thể sẽ được sử dụng thay vì quy tắc bắt tất cả.
    Các quy tắc cụ thể bao gồm địa chỉ email và biểu thức chính quy.
    <br /><br />
    Ví dụ:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    Email gửi đến <code>hello@example.com</code> sẽ **không** được chuyển tiếp đến <code>second@gmail.com</code> (bắt tất cả) với cấu hình này, và thay vào đó chỉ được gửi đến <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Sử dụng trang quản lý DNS của nhà đăng ký của bạn (tab khác mà bạn đã mở), thêm vào đó thiết lập bản ghi <strong class="notranslate">TXT</strong> sau:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
    Nếu bạn đang sử dụng Gmail (ví dụ Gửi thư như) hoặc G Suite, thì bạn cần thêm <code>include:_spf.google.com</code> vào giá trị trên, ví dụ:
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
    Nếu bạn đã có một dòng tương tự với "v=spf1", thì bạn cần thêm <code>include:spf.forwardemail.net</code> ngay trước bất kỳ bản ghi "include:host.com" nào hiện có và trước "-all" trong cùng dòng, ví dụ:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Lưu ý rằng có sự khác biệt giữa "-all" và "~all". Dấu "-" chỉ ra rằng kiểm tra SPF sẽ THẤT BẠI nếu không khớp, và "~" chỉ ra rằng kiểm tra SPF sẽ SOFTFAIL. Chúng tôi khuyến nghị sử dụng cách tiếp cận "-all" để ngăn chặn giả mạo tên miền.
    <br /><br />
    Bạn cũng có thể cần bao gồm bản ghi SPF cho máy chủ mà bạn gửi thư từ đó (ví dụ Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Xác minh các bản ghi DNS của bạn bằng công cụ "Verify Records" có sẵn tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài Khoản Của Tôi <i class="fa fa-angle-right"></i> Tên Miền</a> <i class="fa fa-angle-right"></i> Thiết Lập.

</li><li class="mb-2 mb-md-3 mb-lg-5">Gửi một email thử để xác nhận nó hoạt động. Lưu ý rằng có thể mất một thời gian để các bản ghi DNS của bạn được truyền bá.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Mẹo:
  </strong>
  <span>
  </span>
    Nếu bạn không nhận được email thử, hoặc nhận được email thử có nội dung "Hãy cẩn thận với tin nhắn này", thì hãy xem câu trả lời cho <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Tại sao tôi không nhận được email thử</a> và <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Tại sao email thử gửi cho chính tôi trong Gmail lại hiển thị là "đáng ngờ"</a> tương ứng.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Nếu bạn muốn "Gửi Thư Như" từ Gmail, thì bạn cần <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">xem video này</a></strong>, hoặc làm theo các bước dưới mục <a href="#how-to-send-mail-as-using-gmail">Cách Gửi Thư Như Sử Dụng Gmail</a> bên dưới.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Chúc mừng!
    </strong>
    <span>
      Bạn đã hoàn thành tất cả các bước thành công.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Mẹo:
  </strong>
  <span>
    Các tiện ích bổ sung tùy chọn được liệt kê bên dưới. Lưu ý rằng các tiện ích bổ sung này hoàn toàn tùy chọn và có thể không cần thiết. Chúng tôi muốn ít nhất cung cấp cho bạn thông tin bổ sung nếu cần thiết.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tiện ích Bổ sung Tùy chọn:
  </strong>
  <span>
    Nếu bạn đang sử dụng tính năng <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Cách Gửi Thư Như sử dụng Gmail</a>, thì bạn có thể muốn thêm chính mình vào danh sách cho phép. Xem <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">hướng dẫn này của Gmail</a> về chủ đề này.
  </span>
</div>

### Tôi có thể sử dụng nhiều máy chủ MX và máy chủ cho chuyển tiếp nâng cao không {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Có, nhưng **bạn chỉ nên có một máy chủ MX được liệt kê trong các bản ghi DNS của bạn**.

Không nên cố gắng sử dụng "Ưu tiên" như một cách để cấu hình nhiều máy chủ MX.

Thay vào đó, bạn cần cấu hình máy chủ MX hiện tại của bạn để chuyển tiếp thư cho tất cả các bí danh không khớp đến các máy chủ của dịch vụ chúng tôi (`mx1.forwardemail.net` và/hoặc `mx2.forwardemail.net`).

Nếu bạn đang sử dụng Google Workspace và muốn chuyển tiếp tất cả các bí danh không khớp đến dịch vụ của chúng tôi, thì xem <https://support.google.com/a/answer/6297084>.

Nếu bạn đang sử dụng Microsoft 365 (Outlook) và muốn chuyển tiếp tất cả các bí danh không khớp đến dịch vụ của chúng tôi, thì xem <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> và <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Làm thế nào để tôi thiết lập trả lời tự động khi đi nghỉ (trả lời tự động khi vắng mặt) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Đi đến <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài Khoản Của Tôi <i class="fa fa-angle-right"></i> Tên Miền</a> <i class="fa fa-angle-right"></i> Bí Danh và tạo mới hoặc chỉnh sửa bí danh mà bạn muốn cấu hình trả lời tự động khi đi nghỉ.
Bạn có khả năng cấu hình ngày bắt đầu, ngày kết thúc, chủ đề và tin nhắn, và bật hoặc tắt nó bất cứ lúc nào:

* Chủ đề và tin nhắn dạng văn bản thuần túy hiện được hỗ trợ (chúng tôi sử dụng gói `striptags` nội bộ để loại bỏ bất kỳ HTML nào).
* Chủ đề giới hạn trong 100 ký tự.
* Tin nhắn giới hạn trong 1000 ký tự.
* Việc thiết lập yêu cầu cấu hình SMTP gửi đi (ví dụ: bạn sẽ cần thiết lập các bản ghi DNS DKIM, DMARC và Return-Path).
  * Truy cập <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Cài đặt <i class="fa fa-angle-right"></i> Cấu hình SMTP gửi đi và làm theo hướng dẫn thiết lập.
* Trình trả lời tự động khi nghỉ phép không thể được bật trên các tên miền vanity toàn cục (ví dụ: [địa chỉ dùng một lần](/disposable-addresses) không được hỗ trợ).
* Trình trả lời tự động khi nghỉ phép không thể được bật cho các bí danh có ký tự đại diện/catch-all (`*`) hoặc biểu thức chính quy.

Không giống như các hệ thống mail như `postfix` (ví dụ: sử dụng phần mở rộng bộ lọc nghỉ phép `sieve`) – Forward Email tự động thêm chữ ký DKIM của bạn, bảo vệ giả mạo các sự cố kết nối khi gửi phản hồi nghỉ phép (ví dụ: do các sự cố kết nối SSL/TLS phổ biến và các máy chủ duy trì cũ), và thậm chí hỗ trợ Open WKD và mã hóa PGP cho các phản hồi nghỉ phép.

<!--
* Để ngăn chặn lạm dụng, 1 tín chỉ SMTP gửi đi sẽ bị trừ cho mỗi tin nhắn trả lời nghỉ phép được gửi.
  * Tất cả các tài khoản trả phí mặc định bao gồm 300 tín chỉ mỗi ngày. Nếu bạn cần số lượng lớn hơn, vui lòng liên hệ với chúng tôi.
-->

1. Chúng tôi chỉ gửi một lần cho mỗi người gửi [được phép](#do-you-have-an-allowlist) mỗi 4 ngày (tương tự như hành vi của Gmail).

   * Bộ nhớ đệm Redis của chúng tôi sử dụng dấu vân tay của `alias_id` và `sender`, trong đó `alias_id` là ID MongoDB của bí danh và `sender` là địa chỉ From (nếu được phép) hoặc tên miền gốc trong địa chỉ From (nếu không được phép). Để đơn giản, thời gian hết hạn của dấu vân tay này trong bộ nhớ đệm được đặt là 4 ngày.

   * Cách tiếp cận của chúng tôi sử dụng tên miền gốc phân tích trong địa chỉ From cho người gửi không được phép giúp ngăn chặn lạm dụng từ các người gửi tương đối không rõ (ví dụ: các tác nhân độc hại) gửi tràn ngập các tin nhắn trả lời nghỉ phép.

2. Chúng tôi chỉ gửi khi MAIL FROM và/hoặc From không để trống và không chứa (không phân biệt chữ hoa chữ thường) một [tên người dùng postmaster](#what-are-postmaster-addresses) (phần trước dấu @ trong email).

3. Chúng tôi không gửi nếu tin nhắn gốc có bất kỳ tiêu đề nào sau đây (không phân biệt chữ hoa chữ thường):

   * Tiêu đề `auto-submitted` với giá trị khác `no`.
   * Tiêu đề `x-auto-response-suppress` với giá trị là `dr`, `autoreply`, `auto-reply`, `auto_reply`, hoặc `all`
   * Tiêu đề `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, hoặc `x-auto-respond` (bất kể giá trị).
   * Tiêu đề `precedence` với giá trị là `bulk`, `autoreply`, `auto-reply`, `auto_reply`, hoặc `list`.

4. Chúng tôi không gửi nếu địa chỉ MAIL FROM hoặc From kết thúc bằng `+donotreply`, `-donotreply`, `+noreply`, hoặc `-noreply`.

5. Chúng tôi không gửi nếu phần tên người dùng của địa chỉ email From là `mdaemon` và có tiêu đề không phân biệt chữ hoa chữ thường là `X-MDDSN-Message`.

6. Chúng tôi không gửi nếu có tiêu đề `content-type` không phân biệt chữ hoa chữ thường là `multipart/report`.

### Làm thế nào để tôi thiết lập SPF cho Forward Email {#how-do-i-set-up-spf-for-forward-email}

Sử dụng trang quản lý DNS của nhà đăng ký của bạn, thiết lập bản ghi <strong class="notranslate">TXT</strong> sau:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Host/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Giá trị/Trả lời</th>
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
    Nếu bạn đang sử dụng Gmail (ví dụ: Gửi thư như) hoặc G Suite, bạn sẽ cần thêm <code>include:_spf.google.com</code> vào giá trị trên, ví dụ:
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
    Nếu bạn đang sử dụng Microsoft Outlook hoặc Live.com, bạn cần thêm <code>include:spf.protection.outlook.com</code> vào bản ghi SPF <strong class="notranslate">TXT</strong> của bạn, ví dụ:
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
    Nếu bạn đã có một dòng tương tự với "v=spf1", thì bạn cần thêm <code>include:spf.forwardemail.net</code> ngay trước bất kỳ bản ghi "include:host.com" nào hiện có và trước "-all" trong cùng một dòng, ví dụ:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Lưu ý rằng có sự khác biệt giữa "-all" và "~all". Dấu "-" chỉ ra rằng kiểm tra SPF sẽ THẤT BẠI nếu không khớp, và dấu "~" chỉ ra rằng kiểm tra SPF sẽ SOFTFAIL. Chúng tôi khuyên bạn nên sử dụng cách tiếp cận "-all" để ngăn chặn giả mạo tên miền.
    <br /><br />
    Bạn cũng có thể cần bao gồm bản ghi SPF cho máy chủ mà bạn đang gửi thư (ví dụ: Outlook).
  </span>
</div>

### Làm thế nào để thiết lập DKIM cho Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Đi đến <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài Khoản Của Tôi <i class="fa fa-angle-right"></i> Tên Miền</a> <i class="fa fa-angle-right"></i> Cài Đặt <i class="fa fa-angle-right"></i> Cấu Hình SMTP Đi Ra và làm theo hướng dẫn thiết lập.

### Làm thế nào để thiết lập DMARC cho Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Đi đến <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài Khoản Của Tôi <i class="fa fa-angle-right"></i> Tên Miền</a> <i class="fa fa-angle-right"></i> Cài Đặt <i class="fa fa-angle-right"></i> Cấu Hình SMTP Đi Ra và làm theo hướng dẫn thiết lập.

### Làm thế nào để xem Báo Cáo DMARC {#how-do-i-view-dmarc-reports}

Forward Email cung cấp một bảng điều khiển Báo Cáo DMARC toàn diện cho phép bạn theo dõi hiệu suất xác thực email của mình trên tất cả các tên miền từ một giao diện duy nhất.

**Báo Cáo DMARC là gì?**

Báo cáo DMARC (Xác thực, Báo cáo và Tuân thủ Tin nhắn dựa trên Tên miền) là các tệp XML được gửi bởi các máy chủ nhận thư cho bạn biết cách email của bạn được xác thực như thế nào. Những báo cáo này giúp bạn hiểu:

* Có bao nhiêu email được gửi từ tên miền của bạn
* Liệu những email đó có vượt qua xác thực SPF và DKIM hay không
* Các hành động mà máy chủ nhận thực hiện (chấp nhận, cách ly, hoặc từ chối)
* Địa chỉ IP nào đang gửi email thay mặt cho tên miền của bạn

**Cách Truy Cập Báo Cáo DMARC**

Đi đến <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Tài Khoản Của Tôi <i class="fa fa-angle-right"></i> Báo Cáo DMARC</a> để xem bảng điều khiển của bạn. Bạn cũng có thể truy cập báo cáo theo tên miền từ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài Khoản Của Tôi <i class="fa fa-angle-right"></i> Tên Miền</a> bằng cách nhấn nút "DMARC" bên cạnh bất kỳ tên miền nào.

**Tính Năng Bảng Điều Khiển**

Bảng điều khiển Báo Cáo DMARC cung cấp:

* **Chỉ Số Tóm Tắt**: Tổng số báo cáo nhận được, tổng số tin nhắn đã phân tích, tỷ lệ căn chỉnh SPF, tỷ lệ căn chỉnh DKIM, và tỷ lệ vượt tổng thể
* **Biểu Đồ Tin Nhắn Theo Thời Gian**: Xu hướng trực quan về khối lượng email và tỷ lệ xác thực trong 30 ngày qua
* **Tóm Tắt Căn Chỉnh**: Biểu đồ donut hiển thị phân bố căn chỉnh SPF và DKIM
* **Phân Loại Tin Nhắn**: Biểu đồ thanh xếp chồng cho thấy cách máy chủ nhận xử lý email của bạn (chấp nhận, cách ly, hoặc từ chối)
* **Bảng Báo Cáo Gần Đây**: Danh sách chi tiết các báo cáo DMARC cá nhân với bộ lọc và phân trang
* **Lọc Theo Tên Miền**: Lọc báo cáo theo tên miền cụ thể khi quản lý nhiều tên miền
**Tại Sao Điều Này Quan Trọng**

Đối với các tổ chức quản lý nhiều tên miền (như doanh nghiệp, tổ chức phi lợi nhuận hoặc đại lý), báo cáo DMARC rất cần thiết để:

* **Xác định người gửi không được phép**: Phát hiện nếu ai đó giả mạo tên miền của bạn
* **Cải thiện khả năng gửi thư**: Đảm bảo email hợp pháp của bạn vượt qua xác thực
* **Giám sát hạ tầng email**: Theo dõi các dịch vụ và IP đang gửi thay mặt bạn
* **Tuân thủ**: Duy trì khả năng nhìn thấy xác thực email cho các cuộc kiểm tra bảo mật

Không giống như các dịch vụ khác yêu cầu công cụ giám sát DMARC riêng biệt, Forward Email bao gồm xử lý và trực quan hóa báo cáo DMARC như một phần của tài khoản của bạn mà không mất thêm phí.

**Yêu Cầu**

* Báo cáo DMARC chỉ có sẵn cho các gói trả phí
* Tên miền của bạn phải được cấu hình DMARC (xem [Làm thế nào để thiết lập DMARC cho Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Báo cáo được tự động thu thập khi các máy chủ nhận thư gửi chúng đến địa chỉ báo cáo DMARC bạn đã cấu hình

**Báo Cáo Email Hàng Tuần**

Người dùng gói trả phí tự động nhận được tóm tắt báo cáo DMARC hàng tuần qua email. Các email này bao gồm:

* Thống kê tóm tắt cho tất cả các tên miền của bạn
* Tỷ lệ căn chỉnh SPF và DKIM
* Phân tích tình trạng tin nhắn (chấp nhận, cách ly, từ chối)
* Các tổ chức báo cáo hàng đầu (Google, Microsoft, Yahoo, v.v.)
* Địa chỉ IP có vấn đề căn chỉnh có thể cần chú ý
* Liên kết trực tiếp đến bảng điều khiển Báo cáo DMARC của bạn

Báo cáo hàng tuần được gửi tự động và không thể tắt riêng biệt so với các thông báo email khác.

### Làm thế nào để kết nối và cấu hình danh bạ của tôi {#how-do-i-connect-and-configure-my-contacts}

**Để cấu hình danh bạ, sử dụng URL CardDAV:** `https://carddav.forwardemail.net` (hoặc đơn giản là `carddav.forwardemail.net` nếu ứng dụng của bạn cho phép)

### Làm thế nào để kết nối và cấu hình lịch của tôi {#how-do-i-connect-and-configure-my-calendars}

**Để cấu hình lịch, sử dụng URL CalDAV:** `https://caldav.forwardemail.net` (hoặc đơn giản là `caldav.forwardemail.net` nếu ứng dụng của bạn cho phép)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Làm thế nào để thêm nhiều lịch hơn và quản lý các lịch hiện có {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Nếu bạn muốn thêm lịch bổ sung, chỉ cần thêm URL lịch mới: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**hãy chắc chắn thay thế `calendar-name` bằng tên lịch bạn muốn**)

Bạn có thể thay đổi tên và màu của lịch sau khi tạo – chỉ cần sử dụng ứng dụng lịch bạn thích (ví dụ Apple Mail hoặc [Thunderbird](https://thunderbird.net)).

### Làm thế nào để kết nối và cấu hình tác vụ và nhắc nhở {#how-do-i-connect-and-configure-tasks-and-reminders}

**Để cấu hình tác vụ và nhắc nhở, sử dụng cùng URL CalDAV với lịch:** `https://caldav.forwardemail.net` (hoặc đơn giản là `caldav.forwardemail.net` nếu ứng dụng của bạn cho phép)

Tác vụ và nhắc nhở sẽ tự động được tách riêng khỏi sự kiện lịch thành bộ sưu tập lịch "Reminders" hoặc "Tasks".

**Hướng dẫn thiết lập theo nền tảng:**

**macOS/iOS:**

1. Thêm tài khoản CalDAV mới trong System Preferences > Internet Accounts (hoặc Settings > Accounts trên iOS)
2. Sử dụng `caldav.forwardemail.net` làm máy chủ
3. Nhập bí danh Forward Email và mật khẩu đã tạo
4. Sau khi thiết lập, bạn sẽ thấy cả bộ sưu tập "Calendar" và "Reminders"
5. Sử dụng ứng dụng Reminders để tạo và quản lý tác vụ

**Android với Tasks.org:**

1. Cài đặt Tasks.org từ Google Play Store hoặc F-Droid
2. Vào Settings > Synchronization > Add Account > CalDAV
3. Nhập máy chủ: `https://caldav.forwardemail.net`
4. Nhập bí danh Forward Email và mật khẩu đã tạo
5. Tasks.org sẽ tự động phát hiện các lịch tác vụ của bạn

**Thunderbird:**

1. Cài đặt add-on Lightning nếu chưa có
2. Tạo lịch mới với loại "CalDAV"
3. Sử dụng URL: `https://caldav.forwardemail.net`
4. Nhập thông tin đăng nhập Forward Email của bạn
5. Cả sự kiện và tác vụ sẽ có sẵn trong giao diện lịch

### Tại sao tôi không thể tạo tác vụ trong macOS Reminders {#why-cant-i-create-tasks-in-macos-reminders}
Nếu bạn gặp khó khăn khi tạo tác vụ trong macOS Reminders, hãy thử các bước khắc phục sự cố sau:

1. **Kiểm tra cài đặt tài khoản**: Đảm bảo tài khoản CalDAV của bạn được cấu hình đúng với `caldav.forwardemail.net`

2. **Xác minh lịch riêng biệt**: Bạn nên thấy cả "Calendar" và "Reminders" trong tài khoản của mình. Nếu bạn chỉ thấy "Calendar", có thể tính năng hỗ trợ tác vụ chưa được kích hoạt đầy đủ.

3. **Làm mới tài khoản**: Thử xóa và thêm lại tài khoản CalDAV trong System Preferences > Internet Accounts

4. **Kiểm tra kết nối máy chủ**: Kiểm tra xem bạn có thể truy cập `https://caldav.forwardemail.net` trong trình duyệt không

5. **Xác minh thông tin đăng nhập**: Đảm bảo bạn đang sử dụng email bí danh đúng và mật khẩu được tạo (không phải mật khẩu tài khoản của bạn)

6. **Ép đồng bộ**: Trong ứng dụng Reminders, thử tạo một tác vụ rồi thủ công làm mới đồng bộ

**Các vấn đề thường gặp:**

* **"Reminders calendar not found"**: Máy chủ có thể cần một chút thời gian để tạo bộ sưu tập Reminders khi truy cập lần đầu
* **Tác vụ không đồng bộ**: Kiểm tra cả hai thiết bị đều sử dụng cùng thông tin đăng nhập tài khoản CalDAV
* **Nội dung hỗn hợp**: Đảm bảo các tác vụ được tạo trong lịch "Reminders", không phải "Calendar" chung

### Làm thế nào để thiết lập Tasks.org trên Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org là một ứng dụng quản lý tác vụ mã nguồn mở phổ biến, hoạt động rất tốt với hỗ trợ tác vụ CalDAV của Forward Email.

**Cài đặt và Thiết lập:**

1. **Cài đặt Tasks.org**:
   * Từ Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Từ F-Droid: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Cấu hình đồng bộ CalDAV**:
   * Mở Tasks.org
   * Vào ☰ Menu > Settings > Synchronization
   * Nhấn "Add Account"
   * Chọn "CalDAV"

3. **Nhập cài đặt Forward Email**:
   * **Server URL**: `https://caldav.forwardemail.net`
   * **Username**: Bí danh Forward Email của bạn (ví dụ: `you@yourdomain.com`)
   * **Password**: Mật khẩu được tạo riêng cho bí danh của bạn
   * Nhấn "Add Account"

4. **Phát hiện tài khoản**:
   * Tasks.org sẽ tự động phát hiện các lịch tác vụ của bạn
   * Bạn sẽ thấy bộ sưu tập "Reminders" xuất hiện
   * Nhấn "Subscribe" để bật đồng bộ cho lịch tác vụ

5. **Kiểm tra đồng bộ**:
   * Tạo một tác vụ thử trong Tasks.org
   * Kiểm tra xem nó có xuất hiện trong các ứng dụng CalDAV khác (như macOS Reminders) không
   * Xác nhận các thay đổi đồng bộ hai chiều

**Các tính năng có sẵn:**

* ✅ Tạo và chỉnh sửa tác vụ
* ✅ Ngày đến hạn và nhắc nhở
* ✅ Hoàn thành và trạng thái tác vụ
* ✅ Mức độ ưu tiên
* ✅ Tác vụ con và cấu trúc phân cấp tác vụ
* ✅ Thẻ và danh mục
* ✅ Đồng bộ hai chiều với các ứng dụng CalDAV khác

**Khắc phục sự cố:**

* Nếu không thấy lịch tác vụ nào, thử làm mới thủ công trong cài đặt Tasks.org
* Đảm bảo bạn đã tạo ít nhất một tác vụ trên máy chủ (bạn có thể tạo trước trong macOS Reminders)
* Kiểm tra kết nối mạng tới `caldav.forwardemail.net`

### Làm thế nào để thiết lập SRS cho Forward Email {#how-do-i-set-up-srs-for-forward-email}

Chúng tôi tự động cấu hình [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – bạn không cần phải làm điều này.

### Làm thế nào để thiết lập MTA-STS cho Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Vui lòng tham khảo [phần của chúng tôi về MTA-STS](#do-you-support-mta-sts) để biết thêm thông tin.

### Làm thế nào để thêm ảnh hồ sơ vào địa chỉ email của tôi {#how-do-i-add-a-profile-picture-to-my-email-address}

Nếu bạn đang sử dụng Gmail, hãy làm theo các bước dưới đây:

1. Truy cập <https://google.com> và đăng xuất khỏi tất cả các tài khoản email
2. Nhấn "Sign In" và trong menu thả xuống chọn "other account"
3. Chọn "Use another account"
4. Chọn "Create account"
5. Chọn "Use my current email address instead"
6. Nhập địa chỉ email tên miền tùy chỉnh của bạn
7. Lấy email xác minh được gửi đến địa chỉ email của bạn
8. Nhập mã xác minh từ email này
9. Hoàn thành thông tin hồ sơ cho tài khoản Google mới của bạn
10. Đồng ý với tất cả các chính sách Quyền riêng tư và Điều khoản sử dụng
11. Truy cập <https://google.com> và ở góc trên bên phải, nhấn vào biểu tượng hồ sơ của bạn, rồi nhấn nút "change"
12. Tải lên ảnh hoặc avatar mới cho tài khoản của bạn
13. Thay đổi sẽ mất khoảng 1-2 giờ để cập nhật, nhưng đôi khi có thể rất nhanh.
14. Gửi email thử và ảnh hồ sơ sẽ hiển thị.
## Tính Năng Nâng Cao {#advanced-features}

### Bạn có hỗ trợ bản tin hoặc danh sách gửi thư cho email liên quan đến marketing không {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Vâng, bạn có thể đọc thêm tại <https://forwardemail.net/guides/newsletter-with-listmonk>.

Xin lưu ý rằng để duy trì uy tín IP và đảm bảo khả năng gửi thành công, Forward Email có quy trình xem xét thủ công theo từng tên miền cho **phê duyệt bản tin**. Gửi email tới <support@forwardemail.net> hoặc mở một [yêu cầu trợ giúp](https://forwardemail.net/help) để được phê duyệt. Thông thường quá trình này mất chưa đến 24 giờ, với hầu hết các yêu cầu được chấp thuận trong vòng 1-2 giờ. Trong tương lai gần, chúng tôi dự định làm cho quy trình này trở nên tức thì với các kiểm soát spam bổ sung và cảnh báo. Quy trình này đảm bảo email của bạn đến được hộp thư đến và tin nhắn của bạn không bị đánh dấu là spam.

### Bạn có hỗ trợ gửi email bằng API không {#do-you-support-sending-email-with-api}

Vâng, kể từ tháng 5 năm 2023, chúng tôi hỗ trợ gửi email bằng API như một tiện ích bổ sung cho tất cả người dùng trả phí.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Vui lòng đảm bảo bạn đã đọc <a href="/terms" class="alert-link" target="_blank">Điều khoản</a>, <a href="/privacy" class="alert-link" target="_blank">Chính sách bảo mật</a>, và <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giới hạn SMTP gửi đi</a> &ndash; việc bạn sử dụng được coi là sự thừa nhận và đồng ý.
  </span>
</div>

Vui lòng xem phần [Emails](/email-api#outbound-emails) trong tài liệu API của chúng tôi để biết các tùy chọn, ví dụ và thông tin chi tiết hơn.

Để gửi email gửi đi bằng API của chúng tôi, bạn phải sử dụng token API có sẵn trong [My Security](/my-account/security).

### Bạn có hỗ trợ nhận email bằng IMAP không {#do-you-support-receiving-email-with-imap}

Vâng, kể từ ngày 16 tháng 10 năm 2023, chúng tôi hỗ trợ nhận email qua IMAP như một tiện ích bổ sung cho tất cả người dùng trả phí.  **Vui lòng đọc bài viết chuyên sâu của chúng tôi** về [cách tính năng lưu trữ hộp thư SQLite được mã hóa hoạt động](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Vui lòng đảm bảo bạn đã đọc <a href="/terms" class="alert-link" target="_blank">Điều khoản</a> và <a href="/privacy" class="alert-link" target="_blank">Chính sách bảo mật</a> &ndash; việc bạn sử dụng được coi là sự thừa nhận và đồng ý.
  </span>
</div>

1. Tạo một bí danh mới cho tên miền của bạn trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ <code><hello@example.com></code>)

2. Nhấp vào <strong class="text-success"><i class="fa fa-key"></i> Tạo Mật khẩu</strong> bên cạnh bí danh mới tạo. Sao chép vào bộ nhớ tạm và lưu trữ an toàn mật khẩu được hiển thị trên màn hình.

3. Sử dụng ứng dụng email ưa thích của bạn, thêm hoặc cấu hình tài khoản với bí danh mới tạo (ví dụ <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Mẹo:
     </strong>
     <span>Chúng tôi khuyên bạn nên sử dụng <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, hoặc <a href="/blog/open-source" class="alert-link" target="_blank">một lựa chọn thay thế mã nguồn mở và tập trung vào quyền riêng tư</a>.</span>
   </div>

4. Khi được yêu cầu tên máy chủ IMAP, nhập `imap.forwardemail.net`

5. Khi được yêu cầu cổng máy chủ IMAP, nhập `993` (SSL/TLS) – xem [cổng IMAP thay thế](/faq#what-are-your-imap-server-configuration-settings) nếu cần thiết
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Mẹo:
     </strong>
     <span>Nếu bạn sử dụng Thunderbird, hãy đảm bảo "Bảo mật kết nối" được đặt thành "SSL/TLS" và phương thức xác thực được đặt thành "Mật khẩu bình thường".</span>
   </div>
6. Khi được yêu cầu nhập mật khẩu máy chủ IMAP, hãy dán mật khẩu từ <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ở bước 2 phía trên

7. **Lưu cài đặt của bạn** – nếu bạn gặp sự cố, vui lòng <a href="/help">liên hệ với chúng tôi</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Chúc mừng!
    </strong>
    <span>
      Bạn đã hoàn thành tất cả các bước thành công.
    </span>
  </div>
</div>

</div>

### Bạn có hỗ trợ POP3 {#do-you-support-pop3}

Có, kể từ ngày 4 tháng 12 năm 2023, chúng tôi hỗ trợ [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) như một tiện ích bổ sung cho tất cả người dùng trả phí.  **Vui lòng đọc bài viết chuyên sâu của chúng tôi** về [cách tính năng lưu trữ hộp thư SQLite được mã hóa hoạt động](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Vui lòng đảm bảo bạn đã đọc <a href="/terms" class="alert-link" target="_blank">Điều khoản</a> và <a href="/privacy" class="alert-link" target="_blank">Chính sách bảo mật</a> của chúng tôi &ndash; việc bạn sử dụng được coi là sự thừa nhận và đồng ý.
  </span>
</div>

1. Tạo một bí danh mới cho tên miền của bạn trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ <code><hello@example.com></code>)

2. Nhấp vào <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> bên cạnh bí danh mới tạo. Sao chép vào bộ nhớ tạm và lưu trữ an toàn mật khẩu được tạo hiển thị trên màn hình.

3. Sử dụng ứng dụng email ưa thích của bạn, thêm hoặc cấu hình tài khoản với bí danh mới tạo (ví dụ <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Mẹo:
     </strong>
     <span>Chúng tôi khuyên bạn nên sử dụng <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, hoặc <a href="/blog/open-source" class="alert-link" target="_blank">một lựa chọn mã nguồn mở và tập trung vào quyền riêng tư</a>.</span>
   </div>

4. Khi được yêu cầu nhập tên máy chủ POP3, hãy nhập `pop3.forwardemail.net`

5. Khi được yêu cầu nhập cổng máy chủ POP3, hãy nhập `995` (SSL/TLS) – xem [cổng POP3 thay thế](/faq#what-are-your-pop3-server-configuration-settings) nếu cần thiết
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Mẹo:
     </strong>
     <span>Nếu bạn sử dụng Thunderbird, hãy đảm bảo "Bảo mật kết nối" được đặt thành "SSL/TLS" và Phương thức xác thực được đặt thành "Mật khẩu bình thường".</span>
   </div>

6. Khi được yêu cầu nhập mật khẩu máy chủ POP3, hãy dán mật khẩu từ <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ở bước 2 phía trên

7. **Lưu cài đặt của bạn** – nếu bạn gặp sự cố, vui lòng <a href="/help">liên hệ với chúng tôi</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Chúc mừng!
    </strong>
    <span>
      Bạn đã hoàn thành tất cả các bước thành công.
    </span>
  </div>
</div>

</div>

### Bạn có hỗ trợ lịch (CalDAV) {#do-you-support-calendars-caldav}

Có, kể từ ngày 5 tháng 2 năm 2024, chúng tôi đã thêm tính năng này. Máy chủ của chúng tôi là `caldav.forwardemail.net` và cũng được giám sát trên <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">trang trạng thái</a> của chúng tôi.
Nó hỗ trợ cả IPv4 và IPv6 và có sẵn qua cổng `443` (HTTPS).

| Đăng nhập | Ví dụ                      | Mô tả                                                                                                                                                                                    |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên đăng nhập | `user@example.com`         | Địa chỉ email của một bí danh tồn tại cho miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Miền</a>. |
| Mật khẩu  | `************************` | Mật khẩu được tạo riêng cho bí danh.                                                                                                                                                     |

Để sử dụng hỗ trợ lịch, **người dùng** phải là địa chỉ email của một bí danh tồn tại cho miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Miền</a> – và **mật khẩu** phải là mật khẩu được tạo riêng cho bí danh.

### Bạn có hỗ trợ tác vụ và nhắc nhở (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Có, kể từ ngày 14 tháng 10 năm 2025, chúng tôi đã thêm hỗ trợ CalDAV VTODO cho tác vụ và nhắc nhở. Điều này sử dụng cùng máy chủ với hỗ trợ lịch của chúng tôi: `caldav.forwardemail.net`.

Máy chủ CalDAV của chúng tôi hỗ trợ cả sự kiện lịch (VEVENT) và thành phần tác vụ (VTODO) sử dụng **lịch hợp nhất**. Điều này có nghĩa là mỗi lịch có thể chứa cả sự kiện và tác vụ, cung cấp sự linh hoạt tối đa và tương thích trên tất cả các khách hàng CalDAV.

**Cách hoạt động của lịch và danh sách:**

* **Mỗi lịch hỗ trợ cả sự kiện và tác vụ** - Bạn có thể thêm sự kiện, tác vụ hoặc cả hai vào bất kỳ lịch nào
* **Danh sách Apple Reminders** - Mỗi danh sách bạn tạo trong Apple Reminders trở thành một lịch riêng biệt trên máy chủ
* **Nhiều lịch** - Bạn có thể tạo bao nhiêu lịch tùy ý, mỗi lịch có tên, màu sắc và tổ chức riêng
* **Đồng bộ chéo khách hàng** - Tác vụ và sự kiện đồng bộ liền mạch giữa tất cả các khách hàng tương thích

**Các khách hàng tác vụ được hỗ trợ:**

* **macOS Reminders** - Hỗ trợ đầy đủ gốc cho tạo, chỉnh sửa, hoàn thành và đồng bộ tác vụ
* **iOS Reminders** - Hỗ trợ đầy đủ gốc trên tất cả các thiết bị iOS
* **Tasks.org (Android)** - Trình quản lý tác vụ mã nguồn mở phổ biến với đồng bộ CalDAV
* **Thunderbird** - Hỗ trợ tác vụ và lịch trong khách hàng email trên máy tính để bàn
* **Bất kỳ trình quản lý tác vụ tương thích CalDAV nào** - Hỗ trợ thành phần VTODO tiêu chuẩn

**Các tính năng tác vụ được hỗ trợ:**

* Tạo, chỉnh sửa và xóa tác vụ
* Ngày đến hạn và ngày bắt đầu
* Trạng thái hoàn thành tác vụ (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Mức độ ưu tiên tác vụ
* Tác vụ định kỳ
* Mô tả và ghi chú tác vụ
* Đồng bộ đa thiết bị
* Tác vụ con với thuộc tính RELATED-TO
* Nhắc nhở tác vụ với VALARM

Thông tin đăng nhập giống như đối với hỗ trợ lịch:

| Đăng nhập | Ví dụ                      | Mô tả                                                                                                                                                                                    |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên đăng nhập | `user@example.com`         | Địa chỉ email của một bí danh tồn tại cho miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Miền</a>. |
| Mật khẩu  | `************************` | Mật khẩu được tạo riêng cho bí danh.                                                                                                                                                     |

**Lưu ý quan trọng:**

* **Mỗi danh sách Reminders là một lịch riêng biệt** - Khi bạn tạo danh sách mới trong Apple Reminders, nó sẽ tạo một lịch mới trên máy chủ CalDAV
* **Người dùng Thunderbird** - Bạn cần đăng ký thủ công từng lịch/danh sách bạn muốn đồng bộ, hoặc sử dụng URL trang chủ lịch: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Người dùng Apple** - Việc phát hiện lịch diễn ra tự động, vì vậy tất cả lịch và danh sách của bạn sẽ xuất hiện trong Calendar.app và Reminders.app
* **Lịch hợp nhất** - Tất cả các lịch đều hỗ trợ cả sự kiện và tác vụ, mang lại sự linh hoạt trong cách bạn tổ chức dữ liệu của mình
### Bạn có hỗ trợ danh bạ (CardDAV) {#do-you-support-contacts-carddav}

Vâng, kể từ ngày 12 tháng 6 năm 2025 chúng tôi đã thêm tính năng này. Máy chủ của chúng tôi là `carddav.forwardemail.net` và cũng được giám sát trên <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">trang trạng thái</a>.

Nó hỗ trợ cả IPv4 và IPv6 và có thể truy cập qua cổng `443` (HTTPS).

| Đăng nhập | Ví dụ                      | Mô tả                                                                                                                                                                                    |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên đăng nhập | `user@example.com`         | Địa chỉ email của bí danh tồn tại cho miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Miền</a>.         |
| Mật khẩu  | `************************` | Mật khẩu được tạo riêng cho bí danh.                                                                                                                                                      |

Để sử dụng hỗ trợ danh bạ, **người dùng** phải là địa chỉ email của một bí danh tồn tại cho miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Miền</a> – và **mật khẩu** phải là mật khẩu được tạo riêng cho bí danh đó.

### Bạn có hỗ trợ gửi email bằng SMTP không {#do-you-support-sending-email-with-smtp}

Vâng, kể từ tháng 5 năm 2023 chúng tôi hỗ trợ gửi email bằng SMTP như một tiện ích bổ sung cho tất cả người dùng trả phí.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Vui lòng đảm bảo bạn đã đọc <a href="/terms" class="alert-link" target="_blank">Điều khoản</a>, <a href="/privacy" class="alert-link" target="_blank">Chính sách bảo mật</a>, và <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Giới hạn SMTP gửi đi</a> &ndash; việc bạn sử dụng được coi là sự thừa nhận và đồng ý.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Nếu bạn đang sử dụng Gmail, hãy tham khảo <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Hướng dẫn Gửi thư như với Gmail</a> của chúng tôi. Nếu bạn là nhà phát triển, hãy tham khảo <a class="alert-link" href="/email-api#outbound-emails" target="_blank">tài liệu API email</a> của chúng tôi.
  </span>
</div>

1. Truy cập <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Miền</a> <i class="fa fa-angle-right"></i> Cài đặt <i class="fa fa-angle-right"></i> Cấu hình SMTP gửi đi và làm theo hướng dẫn thiết lập

2. Tạo một bí danh mới cho miền của bạn trong <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ <code><hello@example.com></code>)

3. Nhấp vào <strong class="text-success"><i class="fa fa-key"></i> Tạo mật khẩu</strong> bên cạnh bí danh mới tạo. Sao chép vào bộ nhớ tạm và lưu trữ an toàn mật khẩu được tạo hiển thị trên màn hình.

4. Sử dụng ứng dụng email ưa thích của bạn, thêm hoặc cấu hình tài khoản với bí danh mới tạo (ví dụ <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Mẹo:
     </strong>
     <span>Chúng tôi khuyên bạn nên sử dụng <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, hoặc <a href="/blog/open-source" class="alert-link" target="_blank">một lựa chọn thay thế mã nguồn mở và tập trung vào quyền riêng tư</a>.</span>
   </div>
5. Khi được yêu cầu nhập tên máy chủ SMTP, hãy nhập `smtp.forwardemail.net`

6. Khi được yêu cầu nhập cổng máy chủ SMTP, hãy nhập `465` (SSL/TLS) – xem [cổng SMTP thay thế](/faq#what-are-your-smtp-server-configuration-settings) nếu cần thiết
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Mẹo:
     </strong>
     <span>Nếu bạn đang sử dụng Thunderbird, hãy đảm bảo "Bảo mật kết nối" được đặt thành "SSL/TLS" và phương thức Xác thực được đặt thành "Mật khẩu bình thường".</span>
   </div>

7. Khi được yêu cầu nhập mật khẩu máy chủ SMTP, hãy dán mật khẩu từ <strong class="text-success"><i class="fa fa-key"></i> Tạo Mật Khẩu</strong> trong bước 3 ở trên

8. **Lưu cài đặt của bạn và gửi email thử nghiệm đầu tiên** – nếu bạn gặp sự cố, vui lòng <a href="/help">liên hệ với chúng tôi</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Xin lưu ý rằng để duy trì uy tín IP và đảm bảo khả năng gửi thư, chúng tôi có quy trình xem xét thủ công trên cơ sở từng tên miền để phê duyệt SMTP gửi đi. Thông thường quy trình này mất chưa đến 24 giờ, với hầu hết các yêu cầu được xử lý trong vòng 1-2 giờ. Trong tương lai gần, chúng tôi dự định làm cho quy trình này trở nên tức thì với các kiểm soát spam bổ sung và cảnh báo. Quy trình này đảm bảo email của bạn đến được hộp thư đến và tin nhắn của bạn không bị đánh dấu là spam.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Chúc mừng!
    </strong>
    <span>
      Bạn đã hoàn thành tất cả các bước thành công.
    </span>
  </div>
</div>

</div>

### Bạn có hỗ trợ OpenPGP/MIME, mã hóa đầu cuối ("E2EE"), và Thư mục Khóa Web ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Vâng, chúng tôi hỗ trợ [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [mã hóa đầu cuối ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption), và việc tìm kiếm khóa công khai sử dụng [Thư mục Khóa Web ("WKD")](https://wiki.gnupg.org/WKD). Bạn có thể cấu hình OpenPGP bằng cách sử dụng [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) hoặc [tự lưu trữ khóa của riêng bạn](https://wiki.gnupg.org/WKDHosting) (tham khảo [gist này để thiết lập máy chủ WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Tra cứu WKD được lưu trong bộ nhớ đệm trong 1 giờ để đảm bảo việc gửi email kịp thời → do đó nếu bạn thêm, thay đổi hoặc xóa khóa WKD của mình, vui lòng gửi email cho chúng tôi tại `support@forwardemail.net` kèm theo địa chỉ email của bạn để chúng tôi có thể xóa bộ nhớ đệm thủ công.
* Chúng tôi hỗ trợ mã hóa PGP cho các tin nhắn được chuyển tiếp qua tra cứu WKD hoặc sử dụng khóa PGP đã tải lên trên giao diện của chúng tôi.
* Khóa đã tải lên sẽ được ưu tiên miễn là hộp kiểm PGP được bật/đánh dấu.
* Tin nhắn gửi đến webhook hiện tại không được mã hóa bằng PGP.
* Nếu bạn có nhiều bí danh phù hợp với một địa chỉ chuyển tiếp nhất định (ví dụ: kết hợp regex/wildcard/chính xác) và nếu hơn một trong số đó chứa khóa PGP đã tải lên và có PGP được đánh dấu → thì chúng tôi sẽ gửi cho bạn email cảnh báo lỗi và sẽ không mã hóa tin nhắn bằng khóa PGP đã tải lên của bạn. Điều này rất hiếm và thường chỉ áp dụng cho người dùng nâng cao với các quy tắc bí danh phức tạp.
* **Mã hóa PGP sẽ không được áp dụng cho việc chuyển tiếp email qua máy chủ MX của chúng tôi nếu người gửi có chính sách DMARC là từ chối. Nếu bạn cần mã hóa PGP cho *tất cả* thư thì chúng tôi đề xuất sử dụng dịch vụ IMAP của chúng tôi và cấu hình khóa PGP cho bí danh của bạn cho thư đến.**

**Bạn có thể xác thực thiết lập Thư mục Khóa Web của mình tại <https://wkd.chimbosonic.com/> (mã nguồn mở) hoặc <https://www.webkeydirectory.com/> (bản quyền).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Mã hóa Tự động:
  </strong>
  <span>Nếu bạn đang sử dụng <a href="#do-you-support-sending-email-with-smtp" class="alert-link">dịch vụ SMTP gửi đi</a> của chúng tôi và gửi các tin nhắn chưa được mã hóa, thì chúng tôi sẽ tự động cố gắng mã hóa tin nhắn trên cơ sở từng người nhận bằng cách sử dụng <a class="alert-link" href="https://wiki.gnupg.org/WKD">Thư mục Khóa Web ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Bạn phải làm theo tất cả các bước sau để kích hoạt OpenPGP cho tên miền tùy chỉnh của bạn.
  </span>
</div>

1. Tải xuống và cài đặt plugin được đề xuất cho ứng dụng email của bạn dưới đây:

   | Ứng dụng Email | Nền tảng | Plugin Được Đề Xuất                                                                                                                                                                    | Ghi chú                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | Máy tính để bàn  | [Cấu hình OpenPGP trong Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird có hỗ trợ OpenPGP tích hợp sẵn.                                                                                                                                                                                                                                                                                                                                                                                            |
   | Gmail           | Trình duyệt  | [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download) (giấy phép độc quyền)                                                                            | Gmail không hỗ trợ OpenPGP, tuy nhiên bạn có thể tải plugin mã nguồn mở [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                    |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple Mail không hỗ trợ OpenPGP, tuy nhiên bạn có thể tải plugin mã nguồn mở [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                       |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) hoặc [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (giấy phép độc quyền)                           | Apple Mail không hỗ trợ OpenPGP, tuy nhiên bạn có thể tải plugin mã nguồn mở [PGPro](https://github.com/opensourceios/PGPro/) hoặc [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                    |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | Ứng dụng email máy tính để bàn Outlook không hỗ trợ OpenPGP, tuy nhiên bạn có thể tải plugin mã nguồn mở [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                    |
   | Outlook         | Trình duyệt  | [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download) (giấy phép độc quyền)                                                                            | Ứng dụng email web Outlook không hỗ trợ OpenPGP, tuy nhiên bạn có thể tải plugin mã nguồn mở [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                          |
   | Android         | Di động   | [OpenKeychain](https://www.openkeychain.org/) hoặc [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [Các ứng dụng email Android](/blog/open-source/android-email-clients) như [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) và [FairEmail](https://github.com/M66B/FairEmail) đều hỗ trợ plugin mã nguồn mở [OpenKeychain](https://www.openkeychain.org/). Bạn cũng có thể sử dụng plugin mã nguồn mở (giấy phép độc quyền) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome   | Trình duyệt  | [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download) (giấy phép độc quyền)                                                                            | Bạn có thể tải tiện ích mở rộng trình duyệt mã nguồn mở [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Mozilla Firefox | Trình duyệt  | [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download) (giấy phép độc quyền)                                                                            | Bạn có thể tải tiện ích mở rộng trình duyệt mã nguồn mở [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Microsoft Edge  | Trình duyệt  | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | Bạn có thể tải tiện ích mở rộng trình duyệt mã nguồn mở [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                                |
   | Brave           | Trình duyệt  | [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download) (giấy phép độc quyền)                                                                            | Bạn có thể tải tiện ích mở rộng trình duyệt mã nguồn mở [Mailvelope](https://mailvelope.com/) hoặc [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Balsa           | Máy tính để bàn  | [Cấu hình OpenPGP trong Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                            | Balsa có hỗ trợ OpenPGP tích hợp sẵn.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | KMail           | Máy tính để bàn  | [Cấu hình OpenPGP trong KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                 | KMail có hỗ trợ OpenPGP tích hợp sẵn.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | GNOME Evolution | Máy tính để bàn  | [Cấu hình OpenPGP trong Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                               | GNOME Evolution có hỗ trợ OpenPGP tích hợp sẵn.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Terminal        | Máy tính để bàn  | [Cấu hình gpg trong Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                           | Bạn có thể sử dụng công cụ dòng lệnh mã nguồn mở [gpg](https://www.gnupg.org/download/) để tạo khóa mới từ dòng lệnh.                                                                                                                                                                                                                                                                                                            |
2. Mở plugin, tạo khóa công khai của bạn và cấu hình trình khách email để sử dụng nó.

3. Tải lên khóa công khai của bạn tại <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Mẹo:
     </strong>
     <span>Bạn có thể truy cập <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> để quản lý khóa của bạn trong tương lai.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tùy chọn bổ sung:
     </strong>
     <span>
       Nếu bạn đang sử dụng dịch vụ <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">lưu trữ mã hóa (IMAP/POP3)</a> của chúng tôi và muốn <i>tất cả</i> email được lưu trong cơ sở dữ liệu SQLite (đã được mã hóa) của bạn được mã hóa bằng khóa công khai của bạn, thì hãy vào <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Chỉnh sửa <i class="fa fa-angle-right"></i> OpenPGP và tải lên khóa công khai của bạn.
     </span>
   </div>

4. Thêm một bản ghi `CNAME` mới vào tên miền của bạn (ví dụ `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Tên/Máy chủ/Bí danh</th>
         <th class="text-center">TTL</th>
         <th>Loại</th>
         <th>Trả lời/Giá trị</th>
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
     <span>Nếu bí danh của bạn đang sử dụng <a class="alert-link" href="/disposable-addresses" target="_blank">tên miền vanity/dùng một lần</a> của chúng tôi (ví dụ <code>hideaddress.net</code>), thì bạn có thể bỏ qua bước này.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Chúc mừng!
    </strong>
    <span>
      Bạn đã hoàn thành tất cả các bước thành công.
    </span>
  </div>
</div>

### Bạn có hỗ trợ mã hóa S/MIME {#do-you-support-smime-encryption}

Có, chúng tôi hỗ trợ mã hóa [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) như được định nghĩa trong [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME cung cấp mã hóa đầu cuối sử dụng chứng chỉ X.509, được hỗ trợ rộng rãi bởi các trình khách email doanh nghiệp.

Chúng tôi hỗ trợ cả chứng chỉ RSA và ECC (Mã hóa đường cong elliptic):

* **Chứng chỉ RSA**: tối thiểu 2048-bit, khuyến nghị 4096-bit
* **Chứng chỉ ECC**: các đường cong NIST P-256, P-384 và P-521

Để cấu hình mã hóa S/MIME cho bí danh của bạn:

1. Lấy chứng chỉ S/MIME từ một Cơ quan cấp chứng chỉ (CA) đáng tin cậy hoặc tạo chứng chỉ tự ký để thử nghiệm.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Mẹo:
     </strong>
     <span>Các chứng chỉ S/MIME miễn phí có sẵn từ các nhà cung cấp như <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> hoặc <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Xuất chứng chỉ của bạn ở định dạng PEM (chỉ chứng chỉ công khai, không phải khóa riêng).

3. Truy cập <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh (ví dụ <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Chỉnh sửa <i class="fa fa-angle-right"></i> S/MIME và tải lên chứng chỉ công khai của bạn.
4. Khi đã cấu hình, tất cả email đến alias của bạn sẽ được mã hóa bằng chứng chỉ S/MIME trước khi được lưu trữ hoặc chuyển tiếp.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Lưu ý:
     </strong>
     <span>
       Mã hóa S/MIME được áp dụng cho các tin nhắn đến chưa được mã hóa. Nếu một tin nhắn đã được mã hóa bằng OpenPGP hoặc S/MIME, nó sẽ không bị mã hóa lại.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Quan trọng:
     </strong>
     <span>
       Mã hóa S/MIME sẽ không được áp dụng cho việc chuyển tiếp email qua các máy chủ MX của chúng tôi nếu người gửi có chính sách DMARC là từ chối. Nếu bạn cần mã hóa S/MIME cho <em>tất cả</em> thư, chúng tôi đề xuất sử dụng dịch vụ IMAP của chúng tôi và cấu hình chứng chỉ S/MIME cho alias của bạn đối với thư đến.
     </span>
   </div>

Các ứng dụng email sau đây có hỗ trợ S/MIME tích hợp sẵn:

| Ứng dụng Email    | Nền tảng | Ghi chú                                                                                                               |
| ----------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | Hỗ trợ S/MIME tích hợp sẵn. Vào Mail > Preferences > Accounts > tài khoản của bạn > Trust để cấu hình chứng chỉ.       |
| Apple Mail        | iOS      | Hỗ trợ S/MIME tích hợp sẵn. Vào Settings > Mail > Accounts > tài khoản của bạn > Advanced > S/MIME để cấu hình.        |
| Microsoft Outlook | Windows  | Hỗ trợ S/MIME tích hợp sẵn. Vào File > Options > Trust Center > Trust Center Settings > Email Security để cấu hình.   |
| Microsoft Outlook | macOS    | Hỗ trợ S/MIME tích hợp sẵn. Vào Tools > Accounts > Advanced > Security để cấu hình.                                   |
| Thunderbird       | Desktop  | Hỗ trợ S/MIME tích hợp sẵn. Vào Account Settings > End-To-End Encryption > S/MIME để cấu hình.                        |
| GNOME Evolution   | Desktop  | Hỗ trợ S/MIME tích hợp sẵn. Vào Edit > Preferences > Mail Accounts > tài khoản của bạn > Security để cấu hình.         |
| KMail             | Desktop  | Hỗ trợ S/MIME tích hợp sẵn. Vào Settings > Configure KMail > Identities > danh tính của bạn > Cryptography để cấu hình.|

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Chúc mừng!
    </strong>
    <span>
      Bạn đã cấu hình thành công mã hóa S/MIME cho alias của mình.
    </span>
  </div>
</div>

### Bạn có hỗ trợ lọc email bằng Sieve {#do-you-support-sieve-email-filtering}

Có! Chúng tôi hỗ trợ lọc email bằng [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) theo định nghĩa trong [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve là một ngôn ngữ kịch bản chuẩn, mạnh mẽ để lọc email phía máy chủ, cho phép bạn tự động tổ chức, lọc và phản hồi các tin nhắn đến.

#### Các phần mở rộng Sieve được hỗ trợ {#supported-sieve-extensions}

Chúng tôi hỗ trợ một bộ phần mở rộng Sieve toàn diện:

| Phần mở rộng                | RFC                                                                                      | Mô tả                                            |
| -------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                 | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                                | Lưu tin nhắn vào các thư mục cụ thể               |
| `reject` / `ereject`       | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                                | Từ chối tin nhắn với lỗi                          |
| `vacation`                 | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                                | Trả lời tự động khi nghỉ/vắng mặt                  |
| `vacation-seconds`         | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                                | Khoảng thời gian trả lời nghỉ chi tiết hơn         |
| `imap4flags`               | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                                | Đặt cờ IMAP (\Seen, \Flagged, v.v.)               |
| `envelope`                 | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                                | Kiểm tra người gửi/người nhận trong phong bì      |
| `body`                     | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                                | Kiểm tra nội dung thân tin nhắn                    |
| `variables`                | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                                | Lưu trữ và sử dụng biến trong kịch bản             |
| `relational`               | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                                | So sánh quan hệ (lớn hơn, nhỏ hơn)                 |
| `comparator-i;ascii-numeric` | [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | So sánh số học                                    |
| `copy`                     | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                                | Sao chép tin nhắn khi chuyển tiếp                  |
| `editheader`               | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                                | Thêm hoặc xóa tiêu đề tin nhắn                      |
| `date`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                                | Kiểm tra giá trị ngày/giờ                           |
| `index`                    | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                                | Truy cập các lần xuất hiện tiêu đề cụ thể          |
| `regex`                    | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)   | So khớp biểu thức chính quy                         |
| `enotify`                  | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                                | Gửi thông báo (ví dụ: mailto:)                      |
| `environment`              | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                                | Truy cập thông tin môi trường                       |
| `mailbox`                  | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                                | Kiểm tra sự tồn tại hộp thư, tạo hộp thư           |
| `special-use`              | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                                | Lưu vào các hộp thư đặc biệt (\Junk, \Trash)       |
| `duplicate`                | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                                | Phát hiện tin nhắn trùng lặp                        |
| `ihave`                    | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                                | Kiểm tra sự có mặt của phần mở rộng                 |
| `subaddress`               | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                                | Truy cập các phần địa chỉ user+detail               |
#### Các Tiện Ích Mở Rộng Không Hỗ Trợ {#extensions-not-supported}

Các tiện ích mở rộng sau hiện không được hỗ trợ:

| Tiện Ích Mở Rộng                                               | Lý Do                                                              |
| -------------------------------------------------------------- | ----------------------------------------------------------------- |
| `include`                                                     | Rủi ro bảo mật (chèn script) và yêu cầu lưu trữ script toàn cục   |
| `mboxmetadata` / `servermetadata`                             | Yêu cầu hỗ trợ tiện ích mở rộng IMAP METADATA                     |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Chưa triển khai thao tác phức tạp trên cây MIME                   |

#### Ví Dụ Các Script Sieve {#example-sieve-scripts}

**Lưu bản tin vào thư mục:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Tự động trả lời khi đi nghỉ:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "Tôi hiện đang nghỉ và sẽ trả lời khi trở lại.";
```

**Đánh dấu thư từ người gửi quan trọng:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Từ chối thư rác với các chủ đề cụ thể:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Tin nhắn bị từ chối do nội dung spam.";
}
```

#### Quản Lý Các Script Sieve {#managing-sieve-scripts}

Bạn có thể quản lý các script Sieve của mình bằng nhiều cách:

1. **Giao Diện Web**: Truy cập <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài Khoản Của Tôi <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Aliases <i class="fa fa-angle-right"></i> Sieve Scripts để tạo và quản lý script.

2. **Giao Thức ManageSieve**: Kết nối bằng bất kỳ client tương thích ManageSieve nào (như tiện ích Sieve của Thunderbird hoặc [sieve-connect](https://github.com/philpennock/sieve-connect)) tới `imap.forwardemail.net`. Sử dụng cổng `2190` với STARTTLS (khuyến nghị cho hầu hết client) hoặc cổng `4190` với TLS ngầm định.

3. **API**: Sử dụng [REST API](/api#sieve-scripts) của chúng tôi để quản lý script một cách lập trình.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Lưu ý:
  </strong>
  <span>
    Lọc Sieve được áp dụng cho các thư đến trước khi chúng được lưu vào hộp thư của bạn. Các script được thực thi theo thứ tự ưu tiên, và hành động phù hợp đầu tiên sẽ quyết định cách xử lý thư.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Bảo mật:
  </strong>
  <span>
    Vì lý do bảo mật, các hành động chuyển tiếp bị giới hạn 10 lần mỗi script và 100 lần mỗi ngày. Phản hồi nghỉ phép cũng bị giới hạn tần suất để ngăn chặn lạm dụng.
  </span>
</div>

### Bạn có hỗ trợ MTA-STS không? {#do-you-support-mta-sts}

Có, kể từ ngày 2 tháng 3 năm 2023 chúng tôi hỗ trợ [MTA-STS](https://www.hardenize.com/blog/mta-sts). Bạn có thể sử dụng [mẫu này](https://github.com/jpawlowski/mta-sts.template) nếu muốn kích hoạt trên tên miền của mình.

Cấu hình của chúng tôi được công khai trên GitHub tại <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Bạn có hỗ trợ passkeys và WebAuthn không? {#do-you-support-passkeys-and-webauthn}

Có! Kể từ ngày 13 tháng 12 năm 2023, chúng tôi đã thêm hỗ trợ passkeys [do nhu cầu cao](https://github.com/orgs/forwardemail/discussions/182).

Passkeys cho phép bạn đăng nhập an toàn mà không cần mật khẩu và xác thực hai yếu tố.

Bạn có thể xác thực danh tính bằng cảm ứng, nhận diện khuôn mặt, mật khẩu thiết bị hoặc mã PIN.

Chúng tôi cho phép bạn quản lý tối đa 30 passkeys cùng lúc, giúp bạn đăng nhập dễ dàng với tất cả thiết bị của mình.

Tìm hiểu thêm về passkeys tại các liên kết sau:

* [Đăng nhập vào ứng dụng và trang web của bạn bằng passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Sử dụng passkeys để đăng nhập vào ứng dụng và trang web trên iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Bài viết Wikipedia về Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Bạn có hỗ trợ các thực hành tốt nhất về email không {#do-you-support-email-best-practices}

Có. Chúng tôi có hỗ trợ tích hợp cho SPF, DKIM, DMARC, ARC và SRS trên tất cả các gói. Chúng tôi cũng đã làm việc rộng rãi với các tác giả gốc của các đặc tả này và các chuyên gia email khác để đảm bảo sự hoàn hảo và khả năng gửi thư cao.

### Bạn có hỗ trợ webhook bounce không {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Mẹo:
  </strong>
    Bạn đang tìm tài liệu về webhook email? Xem <a href="/faq#do-you-support-webhooks" class="alert-link">Bạn có hỗ trợ webhook không?</a> để biết thêm thông tin.
  <span>
  </span>
</div>

Có, kể từ ngày 14 tháng 8 năm 2024 chúng tôi đã thêm tính năng này. Bạn có thể truy cập Tài khoản của tôi → Tên miền → Cài đặt → URL Webhook Bounce và cấu hình một URL `http://` hoặc `https://` mà chúng tôi sẽ gửi yêu cầu `POST` đến mỗi khi email SMTP gửi đi bị trả lại.

Điều này hữu ích để bạn quản lý và giám sát SMTP gửi đi – và có thể dùng để duy trì người đăng ký, hủy đăng ký, và phát hiện khi nào xảy ra bounce.

Payload webhook bounce được gửi dưới dạng JSON với các thuộc tính sau:

* `email_id` (Chuỗi) - ID email tương ứng với một email trong Tài khoản của tôi → Email (SMTP gửi đi)
* `list_id` (Chuỗi) - giá trị header `List-ID` (không phân biệt chữ hoa chữ thường), nếu có, từ email gửi đi gốc
* `list_unsubscribe` (Chuỗi) - giá trị header `List-Unsubscribe` (không phân biệt chữ hoa chữ thường), nếu có, từ email gửi đi gốc
* `feedback_id` (Chuỗi) - giá trị header `Feedback-ID` (không phân biệt chữ hoa chữ thường), nếu có, từ email gửi đi gốc
* `recipient` (Chuỗi) - địa chỉ email của người nhận bị bounce hoặc lỗi
* `message` (Chuỗi) - thông báo lỗi chi tiết cho bounce
* `response` (Chuỗi) - thông điệp phản hồi SMTP
* `response_code` (Số) - mã phản hồi SMTP đã được phân tích
* `truth_source` (Chuỗi) - nếu mã phản hồi đến từ nguồn tin cậy, giá trị này sẽ được điền tên miền gốc (ví dụ `google.com` hoặc `yahoo.com`)
* `bounce` (Đối tượng) - một đối tượng chứa các thuộc tính sau mô tả trạng thái bounce và từ chối
  * `action` (Chuỗi) - hành động bounce (ví dụ `"reject"`)
  * `message` (Chuỗi) - lý do bounce (ví dụ `"Message Sender Blocked By Receiving Server"`)
  * `category` (Chuỗi) - loại bounce (ví dụ `"block"`)
  * `code` (Số) - mã trạng thái bounce (ví dụ `554`)
  * `status` (Chuỗi) - mã bounce từ thông điệp phản hồi (ví dụ `5.7.1`)
  * `line` (Số) - số dòng đã phân tích, nếu có, [từ danh sách phân tích bounce Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (ví dụ `526`)
* `headers` (Đối tượng) - cặp khóa-giá trị của các header cho email gửi đi
* `bounced_at` (Chuỗi) - ngày giờ định dạng [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) khi lỗi bounce xảy ra

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

Dưới đây là một vài lưu ý bổ sung về webhook bounce:

* Nếu payload webhook chứa giá trị `list_id`, `list_unsubscribe`, hoặc `feedback_id`, thì bạn nên thực hiện hành động thích hợp để loại bỏ `recipient` khỏi danh sách nếu cần thiết.
  * Nếu giá trị `bounce.category` là một trong `"block"`, `"recipient"`, `"spam"`, hoặc `"virus"`, thì bạn chắc chắn nên loại bỏ người dùng khỏi danh sách.
* Nếu bạn cần xác minh payload webhook (để đảm bảo chúng thực sự đến từ máy chủ của chúng tôi), bạn có thể [giải quyết địa chỉ IP client từ hostname bằng tra cứu ngược](https://nodejs.org/api/dns.html#dnspromisesreverseip) – nó nên là `smtp.forwardemail.net`.
  * Bạn cũng có thể kiểm tra IP với [các địa chỉ IP đã công bố của chúng tôi](#what-are-your-servers-ip-addresses).
  * Truy cập Tài khoản của tôi → Tên miền → Cài đặt → Khóa Xác minh Payload Chữ ký Webhook để lấy khóa webhook của bạn.
    * Bạn có thể thay đổi khóa này bất cứ lúc nào vì lý do bảo mật.
    * Tính toán và so sánh giá trị `X-Webhook-Signature` từ yêu cầu webhook của chúng tôi với giá trị body đã tính toán bằng khóa này. Ví dụ cách làm có tại [bài đăng Stack Overflow này](https://stackoverflow.com/a/68885281).
  * Xem thảo luận tại <https://github.com/forwardemail/free-email-forwarding/issues/235> để biết thêm thông tin.
* Chúng tôi sẽ chờ tối đa `5` giây để endpoint webhook của bạn phản hồi với mã trạng thái `200`, và sẽ thử lại tối đa `1` lần.
* Nếu chúng tôi phát hiện URL webhook bounce của bạn có lỗi khi cố gắng gửi yêu cầu, chúng tôi sẽ gửi email nhắc nhở bạn một lần mỗi tuần.
### Bạn có hỗ trợ webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Mẹo:
  </strong>
    Bạn đang tìm tài liệu về bounce webhooks? Xem <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Bạn có hỗ trợ bounce webhooks không?</a> để biết thêm thông tin.
  <span>
  </span>
</div>

Vâng, kể từ ngày 15 tháng 5 năm 2020 chúng tôi đã thêm tính năng này. Bạn có thể đơn giản thêm webhook(s) giống như bạn làm với bất kỳ người nhận nào! Vui lòng đảm bảo rằng bạn đã thêm tiền tố "http" hoặc "https" trong URL của webhook.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Bảo vệ quyền riêng tư nâng cao:
  </strong>
  <span>
    Nếu bạn đang sử dụng gói trả phí (có tính năng bảo vệ quyền riêng tư nâng cao), thì vui lòng truy cập <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> và nhấp vào "Bí danh" bên cạnh tên miền của bạn để cấu hình webhook. Nếu bạn muốn tìm hiểu thêm về các gói trả phí, xem trang <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Giá cả</a> của chúng tôi. Nếu không, bạn có thể tiếp tục làm theo hướng dẫn bên dưới.
  </span>
</div>

Nếu bạn đang sử dụng gói miễn phí, thì chỉ cần thêm một bản ghi DNS <strong class="notranslate">TXT</strong> mới như dưới đây:

Ví dụ, nếu tôi muốn tất cả email gửi đến `alias@example.com` được chuyển tiếp đến một điểm kiểm tra [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) mới:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Host/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
      <th>Tên/Host/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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

**Dưới đây là các ghi chú bổ sung liên quan đến webhooks:**

* Nếu bạn cần xác minh payload webhook (để đảm bảo chúng thực sự đến từ máy chủ của chúng tôi), thì bạn có thể [giải quyết địa chỉ IP máy khách từ hostname bằng tra cứu ngược](https://nodejs.org/api/dns.html#dnspromisesreverseip) – nó nên là `mx1.forwardemail.net` hoặc `mx2.forwardemail.net`.
  * Bạn cũng có thể kiểm tra IP với [các địa chỉ IP đã công bố của chúng tôi](#what-are-your-servers-ip-addresses).
  * Nếu bạn đang sử dụng gói trả phí, thì hãy vào Tài khoản của tôi → Tên miền → Cài đặt → Khóa xác minh payload chữ ký webhook để lấy khóa webhook của bạn.
    * Bạn có thể thay đổi khóa này bất cứ lúc nào vì lý do bảo mật.
    * Tính toán và so sánh giá trị `X-Webhook-Signature` từ yêu cầu webhook của chúng tôi với giá trị thân đã tính toán sử dụng khóa này. Ví dụ về cách làm điều này có tại [bài đăng Stack Overflow này](https://stackoverflow.com/a/68885281).
  * Xem thảo luận tại <https://github.com/forwardemail/free-email-forwarding/issues/235> để biết thêm thông tin.
* Nếu webhook không phản hồi với mã trạng thái `200`, thì chúng tôi sẽ lưu phản hồi đó vào [nhật ký lỗi được tạo](#do-you-store-error-logs) – điều này hữu ích cho việc gỡ lỗi.
* Các yêu cầu HTTP webhook sẽ thử lại tối đa 3 lần trong mỗi lần kết nối SMTP, với thời gian chờ tối đa 60 giây cho mỗi yêu cầu POST đến điểm cuối. **Lưu ý rằng điều này không có nghĩa là nó chỉ thử lại 3 lần**, thực tế nó sẽ thử lại liên tục theo thời gian bằng cách gửi mã SMTP 421 (báo cho người gửi thử lại sau) sau lần thử POST HTTP thứ 3 thất bại. Điều này có nghĩa email sẽ thử lại liên tục trong nhiều ngày cho đến khi đạt mã trạng thái 200.
* Chúng tôi sẽ tự động thử lại dựa trên các mã trạng thái và lỗi mặc định được sử dụng trong [phương thức retry của superagent](https://ladjs.github.io/superagent/#retrying-requests) (chúng tôi là người duy trì).
* Chúng tôi gom nhóm các yêu cầu HTTP webhook đến cùng một điểm cuối thành một yêu cầu thay vì nhiều yêu cầu để tiết kiệm tài nguyên và tăng tốc độ phản hồi. Ví dụ, nếu bạn gửi email đến <webhook1@example.com>, <webhook2@example.com>, và <webhook3@example.com>, và tất cả đều được cấu hình để gọi cùng một URL điểm cuối *chính xác*, thì chỉ có một yêu cầu được gửi. Chúng tôi gom nhóm dựa trên sự trùng khớp chính xác của điểm cuối với so sánh nghiêm ngặt.
* Lưu ý rằng chúng tôi sử dụng phương thức "simpleParser" của thư viện [mailparser](https://nodemailer.com/extras/mailparser/) để phân tích thông điệp thành đối tượng thân thiện với JSON.
* Giá trị email thô dưới dạng Chuỗi được cung cấp dưới thuộc tính "raw".
* Kết quả xác thực được cung cấp dưới các thuộc tính "dkim", "spf", "arc", "dmarc", và "bimi".
* Các tiêu đề email đã phân tích được cung cấp dưới thuộc tính "headers" – nhưng cũng lưu ý bạn có thể dùng "headerLines" để dễ dàng lặp và phân tích hơn.
* Các người nhận được nhóm cho webhook này được gom lại và cung cấp dưới thuộc tính "recipients".
* Thông tin phiên SMTP được cung cấp dưới thuộc tính "session". Điều này chứa thông tin về người gửi tin nhắn, thời gian đến của tin nhắn, HELO, và hostname của máy khách. Giá trị hostname máy khách dưới `session.clientHostname` là FQDN (từ tra cứu PTR ngược) hoặc là `session.remoteAddress` được bao trong dấu ngoặc (ví dụ `"[127.0.0.1]"`).
* Nếu bạn cần cách nhanh để lấy giá trị của `X-Original-To`, thì bạn có thể dùng giá trị của `session.recipient` (xem ví dụ bên dưới). Tiêu đề `X-Original-To` là tiêu đề chúng tôi thêm vào tin nhắn để gỡ lỗi với người nhận gốc (trước khi chuyển tiếp ẩn danh) của tin nhắn.
* Nếu bạn cần loại bỏ thuộc tính `attachments` và/hoặc `raw` khỏi payload thân, chỉ cần thêm `?attachments=false`, `?raw=false`, hoặc `?attachments=false&raw=false` vào điểm cuối webhook của bạn dưới dạng tham số truy vấn (ví dụ `https://example.com/webhook?attachments=false&raw=false`).
* Nếu có tệp đính kèm, chúng sẽ được thêm vào mảng `attachments` với giá trị Buffer. Bạn có thể phân tích lại nội dung bằng cách sử dụng phương pháp với JavaScript như:
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
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
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

### Bạn có hỗ trợ biểu thức chính quy hay regex không {#do-you-support-regular-expressions-or-regex}

Vâng, kể từ ngày 27 tháng 9 năm 2021, chúng tôi đã thêm tính năng này. Bạn có thể đơn giản viết các biểu thức chính quy ("regex") để khớp các bí danh và thực hiện thay thế.

Các bí danh hỗ trợ biểu thức chính quy là những bí danh bắt đầu bằng `/` và kết thúc bằng `/` và người nhận của chúng là địa chỉ email hoặc webhook. Người nhận cũng có thể bao gồm hỗ trợ thay thế regex (ví dụ: `$1`, `$2`).

Chúng tôi hỗ trợ hai cờ biểu thức chính quy bao gồm `i` và `g`. Cờ không phân biệt chữ hoa chữ thường `i` là mặc định vĩnh viễn và luôn được áp dụng. Cờ toàn cục `g` có thể được bạn thêm vào bằng cách gắn `/g` vào cuối dấu `/`.

Lưu ý rằng chúng tôi cũng hỗ trợ <a href="#can-i-disable-specific-aliases">tính năng vô hiệu hóa bí danh</a> cho phần người nhận với hỗ trợ regex của chúng tôi.

Biểu thức chính quy không được hỗ trợ trên <a href="/disposable-addresses" target="_blank">các tên miền vanity toàn cầu</a> (vì điều này có thể là một lỗ hổng bảo mật).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Bảo vệ quyền riêng tư nâng cao:
  </strong>
  <span>
    Nếu bạn đang sử dụng gói trả phí (có tính năng bảo vệ quyền riêng tư nâng cao), vui lòng truy cập <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> và nhấp vào "Bí danh" bên cạnh tên miền của bạn để cấu hình các bí danh, bao gồm cả những bí danh có biểu thức chính quy. Nếu bạn muốn tìm hiểu thêm về các gói trả phí, xem trang <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Giá cả</a> của chúng tôi.
  </span>
</div>

#### Ví dụ cho Bảo vệ quyền riêng tư nâng cao {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên bí danh</th>
      <th>Hiệu quả</th>
      <th>Kiểm tra</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>Email gửi đến `linus@example.com` hoặc `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">xem kiểm tra trên RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>Email gửi đến `24highst@example.com` hoặc `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">xem kiểm tra trên RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Mẹo:
  </strong>
    Để kiểm tra những điều này tại <a href="https://regexr.com" class="alert-link">RegExr</a>, hãy viết biểu thức trong ô trên cùng, sau đó nhập một bí danh ví dụ vào ô bên dưới. Nếu khớp, nó sẽ chuyển sang màu xanh.
  <span>
  </span>
</div>

#### Ví dụ cho gói miễn phí {#examples-for-the-free-plan}

Nếu bạn đang sử dụng gói miễn phí, chỉ cần thêm một bản ghi DNS <strong class="notranslate">TXT</strong> mới sử dụng một hoặc nhiều ví dụ được cung cấp dưới đây:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Ví dụ đơn giản:</strong> Nếu tôi muốn tất cả email gửi đến `linus@example.com` hoặc `torvalds@example.com` được chuyển tiếp đến `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Host/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
  <strong>Ví dụ thay thế Họ Tên:</strong> Giả sử tất cả địa chỉ email công ty của bạn đều theo mẫu `firstname.lastname@example.com`. Nếu tôi muốn tất cả email gửi đến mẫu `firstname.lastname@example.com` được chuyển tiếp đến `firstname.lastname@company.com` với hỗ trợ thay thế (<a href="https://regexr.com/66hnu" class="alert-link">xem kiểm tra trên RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
  <strong>Ví dụ thay thế lọc ký hiệu cộng:</strong> Nếu tôi muốn tất cả email gửi đến `info@example.com` hoặc `support@example.com` được chuyển tiếp đến `user+info@gmail.com` hoặc `user+support@gmail.com` tương ứng (với hỗ trợ thay thế) (<a href="https://regexr.com/66ho7" class="alert-link">xem thử nghiệm trên RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
  <strong>Ví dụ thay thế chuỗi truy vấn Webhook:</strong> Có thể bạn muốn tất cả email gửi đến `example.com` đi đến một <a href="#do-you-support-webhooks" class="alert-link">webhook</a> và có một khóa chuỗi truy vấn động là "to" với giá trị là phần tên người dùng của địa chỉ email (<a href="https://regexr.com/66ho4" class="alert-link">xem thử nghiệm trên RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
  <strong>Ví dụ từ chối im lặng:</strong> Nếu bạn muốn tất cả email khớp với một mẫu nhất định bị vô hiệu hóa và từ chối im lặng (người gửi sẽ thấy như thể tin nhắn đã gửi thành công, nhưng thực tế không đi đến đâu) với mã trạng thái `250` (xem <a href="#can-i-disable-specific-aliases" class="alert-link">Tôi có thể vô hiệu hóa các bí danh cụ thể không</a>), thì chỉ cần sử dụng cách tương tự với một dấu chấm than "!". Điều này báo cho người gửi rằng tin nhắn đã được gửi thành công, nhưng thực tế không đi đến đâu (ví dụ như hố đen hoặc `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
  <strong>Ví dụ từ chối mềm:</strong> Nếu bạn muốn tất cả email khớp với một mẫu nhất định bị vô hiệu hóa và từ chối mềm với mã trạng thái `421` (xem <a href="#can-i-disable-specific-aliases" class="alert-link">Tôi có thể vô hiệu hóa các bí danh cụ thể không</a>), thì chỉ cần sử dụng cách tương tự với hai dấu chấm than "!!". Điều này báo cho người gửi thử lại email của họ, và email đến bí danh này sẽ được thử lại trong khoảng 5 ngày rồi mới từ chối vĩnh viễn.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
  <strong>Ví dụ từ chối cứng:</strong> Nếu bạn muốn tất cả email khớp với một mẫu nhất định bị vô hiệu hóa và từ chối cứng với mã trạng thái `550` (xem <a href="#can-i-disable-specific-aliases" class="alert-link">Tôi có thể vô hiệu hóa các bí danh cụ thể không</a>), thì chỉ cần sử dụng cùng cách tiếp cận với ba dấu chấm than "!!!". Điều này báo cho người gửi biết lỗi vĩnh viễn và email sẽ không được thử lại, chúng sẽ bị từ chối cho bí danh này.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
    Bạn tò mò cách viết biểu thức chính quy hoặc cần kiểm tra thay thế của mình? Bạn có thể truy cập trang web kiểm tra biểu thức chính quy miễn phí <a href="https://regexr.com" class="alert-link">RegExr</a> tại <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Giới hạn SMTP gửi đi của bạn là gì {#what-are-your-outbound-smtp-limits}

Chúng tôi giới hạn người dùng và tên miền ở mức 300 tin nhắn SMTP gửi đi mỗi ngày. Điều này trung bình hơn 9000 email trong một tháng lịch. Nếu bạn cần vượt quá số lượng này hoặc có email lớn liên tục, vui lòng [liên hệ với chúng tôi](https://forwardemail.net/help).

### Tôi có cần phê duyệt để bật SMTP không {#do-i-need-approval-to-enable-smtp}

Có, xin lưu ý rằng để duy trì uy tín IP và đảm bảo khả năng gửi thư, Forward Email có quy trình xem xét thủ công trên cơ sở từng tên miền để phê duyệt SMTP gửi đi. Gửi email tới <support@forwardemail.net> hoặc mở một [yêu cầu trợ giúp](https://forwardemail.net/help) để được phê duyệt. Thông thường mất chưa đến 24 giờ, với hầu hết yêu cầu được chấp nhận trong vòng 1-2 giờ. Trong tương lai gần, chúng tôi dự định làm cho quy trình này trở nên tức thì với các kiểm soát spam bổ sung và cảnh báo. Quy trình này đảm bảo email của bạn đến hộp thư đến và tin nhắn của bạn không bị đánh dấu là spam.

### Cài đặt cấu hình máy chủ SMTP của bạn là gì {#what-are-your-smtp-server-configuration-settings}

Máy chủ của chúng tôi là `smtp.forwardemail.net` và cũng được giám sát trên <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">trang trạng thái</a>.

Nó hỗ trợ cả IPv4 và IPv6 và có sẵn qua các cổng `465` và `2465` cho SSL/TLS (khuyến nghị) và `587`, `2587`, `2525`, và `25` cho TLS (STARTTLS).

**Từ tháng 10 năm 2025**, chúng tôi hiện hỗ trợ **kết nối TLS 1.0 cũ** trên các cổng `2455` (SSL/TLS) và `2555` (STARTTLS) cho các thiết bị cũ như máy in, máy quét, camera và các ứng dụng email cũ không thể hỗ trợ các phiên bản TLS hiện đại. Các cổng này được cung cấp như một lựa chọn thay thế cho Gmail, Yahoo, Outlook và các nhà cung cấp khác đã ngừng hỗ trợ các giao thức TLS cũ.

> \[!CAUTION]
> **Hỗ trợ TLS 1.0 cũ (Cổng 2455 và 2555)**: Các cổng này sử dụng giao thức TLS 1.0 đã lỗi thời và có các lỗ hổng bảo mật đã biết (BEAST, POODLE). Chỉ sử dụng các cổng này nếu thiết bị của bạn hoàn toàn không thể hỗ trợ TLS 1.2 trở lên. Chúng tôi khuyến nghị mạnh mẽ nâng cấp firmware thiết bị hoặc chuyển sang các ứng dụng email hiện đại bất cứ khi nào có thể. Các cổng này chỉ dành cho tương thích phần cứng cũ (máy in, máy quét, camera, thiết bị IoT cũ).

|                                     Giao thức                                     | Tên máy chủ             |            Cổng             |        IPv4        |        IPv6        | Ghi chú                                |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Ưu tiên**                              | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | TLS 1.2+ hiện đại (Khuyến nghị)        |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Hỗ trợ (ưu tiên cổng SSL/TLS `465`)    |
|                             `SSL/TLS` **Chỉ dành cho cũ**                       | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 chỉ dành cho thiết bị cũ |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Chỉ dành cho cũ** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 chỉ dành cho thiết bị cũ |
| Đăng nhập | Ví dụ                      | Mô tả                                                                                                                                                                                    |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên đăng nhập | `user@example.com`         | Địa chỉ email của bí danh tồn tại cho miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Miền</a>.         |
| Mật khẩu  | `************************` | Bí danh                                                                                                                                                                                  |

Để gửi email đi bằng SMTP, **người dùng SMTP** phải là địa chỉ email của một bí danh tồn tại cho miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Miền</a> – và **mật khẩu SMTP** phải là mật khẩu được tạo riêng cho bí danh đó.

Vui lòng tham khảo [Bạn có hỗ trợ gửi email bằng SMTP không](#do-you-support-sending-email-with-smtp) để biết hướng dẫn từng bước.

### Cấu hình máy chủ IMAP của bạn là gì {#what-are-your-imap-server-configuration-settings}

Máy chủ của chúng tôi là `imap.forwardemail.net` và cũng được giám sát trên <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">trang trạng thái</a> của chúng tôi.

Nó hỗ trợ cả IPv4 và IPv6 và có thể truy cập qua các cổng `993` và `2993` cho SSL/TLS.

|         Giao thức         | Tên máy chủ             |     Cổng      |        IPv4        |        IPv6        |
| :----------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Ưu tiên**     | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Đăng nhập | Ví dụ                      | Mô tả                                                                                                                                                                                    |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên đăng nhập | `user@example.com`         | Địa chỉ email của bí danh tồn tại cho miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Miền</a>.         |
| Mật khẩu  | `************************` | Mật khẩu được tạo riêng cho bí danh.                                                                                                                                                     |

Để kết nối với IMAP, **người dùng IMAP** phải là địa chỉ email của một bí danh tồn tại cho miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài khoản của tôi <i class="fa fa-angle-right"></i> Miền</a> – và **mật khẩu IMAP** phải là mật khẩu được tạo riêng cho bí danh đó.

Vui lòng tham khảo [Bạn có hỗ trợ nhận email bằng IMAP không](#do-you-support-receiving-email-with-imap) để biết hướng dẫn từng bước.

### Cấu hình máy chủ POP3 của bạn là gì {#what-are-your-pop3-server-configuration-settings}

Máy chủ của chúng tôi là `pop3.forwardemail.net` và cũng được giám sát trên <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">trang trạng thái</a> của chúng tôi.

Nó hỗ trợ cả IPv4 và IPv6 và có thể truy cập qua các cổng `995` và `2995` cho SSL/TLS.

|         Giao thức         | Tên máy chủ             |     Cổng      |        IPv4        |        IPv6        |
| :----------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Ưu tiên**     | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Đăng nhập | Ví dụ                      | Mô tả                                                                                                                                                                                    |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên đăng nhập | `user@example.com`         | Địa chỉ email của bí danh tồn tại cho miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài Khoản Của Tôi <i class="fa fa-angle-right"></i> Miền</a>.       |
| Mật khẩu  | `************************` | Mật khẩu được tạo riêng cho bí danh.                                                                                                                                                      |

Để kết nối với POP3, **người dùng POP3** phải là địa chỉ email của bí danh tồn tại cho miền tại <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Tài Khoản Của Tôi <i class="fa fa-angle-right"></i> Miền</a> – và **mật khẩu IMAP** phải là mật khẩu được tạo riêng cho bí danh.

Vui lòng tham khảo [Bạn có hỗ trợ POP3 không](#do-you-support-pop3) để biết hướng dẫn từng bước.

### Làm thế nào để tôi thiết lập tự động phát hiện email cho miền của mình {#how-do-i-set-up-email-autodiscovery-for-my-domain}

Tự động phát hiện email cho phép các ứng dụng email như **Thunderbird**, **Apple Mail**, **Microsoft Outlook**, và các thiết bị di động tự động phát hiện các cài đặt máy chủ IMAP, SMTP, POP3, CalDAV, và CardDAV chính xác khi người dùng thêm tài khoản email của họ. Điều này được định nghĩa bởi [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (email) và [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) và sử dụng các bản ghi DNS SRV.

Forward Email công bố các bản ghi tự động phát hiện trên `forwardemail.net`. Bạn có thể thêm các bản ghi SRV trực tiếp vào miền của mình, hoặc sử dụng phương pháp CNAME đơn giản hơn.

#### Lựa chọn A: Bản ghi CNAME (đơn giản nhất) {#option-a-cname-records-simplest}

Thêm hai bản ghi CNAME này vào DNS của miền bạn. Điều này ủy quyền tự động phát hiện cho các máy chủ của Forward Email:

|  Loại | Tên/Host      | Đích/Giá trị                   |
| :----:| --------------| ------------------------------ |
| CNAME | `autoconfig`  | `autoconfig.forwardemail.net`  |
| CNAME | `autodiscover`| `autodiscover.forwardemail.net`|

Bản ghi `autoconfig` được sử dụng bởi **Thunderbird** và các ứng dụng dựa trên Mozilla khác. Bản ghi `autodiscover` được sử dụng bởi **Microsoft Outlook**.

#### Lựa chọn B: Bản ghi SRV (trực tiếp) {#option-b-srv-records-direct}

Nếu bạn muốn thêm bản ghi trực tiếp (hoặc nhà cung cấp DNS của bạn không hỗ trợ CNAME trên các tên miền phụ), hãy thêm các bản ghi SRV này vào miền của bạn:

| Loại | Tên/Host           | Ưu tiên | Trọng số | Cổng | Đích/Giá trị               | Mục đích                              |
| :---:| -------------------| :------:| :-------:| :---:| --------------------------| -------------------------------------|
|  SRV | `_imaps._tcp`      |    0    |    1     |  993 | `imap.forwardemail.net`    | IMAP qua SSL/TLS (ưu tiên)            |
|  SRV | `_imap._tcp`       |    0    |    0     |   0  | `.`                        | IMAP không mã hóa bị vô hiệu hóa      |
|  SRV | `_submissions._tcp`|    0    |    1     |  465 | `smtp.forwardemail.net`    | Gửi SMTP (SSL/TLS, khuyến nghị)       |
|  SRV | `_submission._tcp` |    5    |    1     |  587 | `smtp.forwardemail.net`    | Gửi SMTP (STARTTLS)                   |
|  SRV | `_pop3s._tcp`      |   10    |    1     |  995 | `pop3.forwardemail.net`    | POP3 qua SSL/TLS                      |
|  SRV | `_pop3._tcp`       |    0    |    0     |   0  | `.`                        | POP3 không mã hóa bị vô hiệu hóa      |
|  SRV | `_caldavs._tcp`    |    0    |    1     |  443 | `caldav.forwardemail.net`  | CalDAV qua TLS (lịch)                 |
|  SRV | `_caldav._tcp`     |    0    |    0     |   0  | `.`                        | CalDAV không mã hóa bị vô hiệu hóa    |
|  SRV | `_carddavs._tcp`   |    0    |    1     |  443 | `carddav.forwardemail.net` | CardDAV qua TLS (danh bạ)             |
|  SRV | `_carddav._tcp`    |    0    |    0     |   0  | `.`                        | CardDAV không mã hóa bị vô hiệu hóa   |
> \[!NOTE]
> IMAP có giá trị ưu tiên thấp hơn (0) so với POP3 (10), điều này cho phép các ứng dụng email ưu tiên IMAP hơn POP3 khi cả hai đều có sẵn. Các bản ghi với mục tiêu là `.` (một dấu chấm đơn) cho thấy các phiên bản văn bản thuần túy (không mã hóa) của các giao thức đó bị vô hiệu hóa theo [RFC 6186 Mục 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). Các bản ghi SRV CalDAV và CardDAV tuân theo [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) để tự động phát hiện lịch và danh bạ.

#### Những ứng dụng email nào hỗ trợ tự động phát hiện? {#which-email-clients-support-autodiscovery}

| Ứng dụng           | Email                                            | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | Bản ghi `autoconfig` CNAME hoặc SRV              | Bản ghi `autoconfig` XML hoặc SRV (RFC 6764) |
| Apple Mail (macOS) | Bản ghi SRV (RFC 6186)                           | Bản ghi SRV (RFC 6764)                     |
| Apple Mail (iOS)   | Bản ghi SRV (RFC 6186)                           | Bản ghi SRV (RFC 6764)                     |
| Microsoft Outlook  | Bản ghi `autodiscover` CNAME hoặc SRV `_autodiscover._tcp` | Không hỗ trợ                              |
| GNOME (Evolution)  | Bản ghi SRV (RFC 6186)                           | Bản ghi SRV (RFC 6764)                     |
| KDE (KMail)        | Bản ghi SRV (RFC 6186)                           | Bản ghi SRV (RFC 6764)                     |
| eM Client          | `autoconfig` hoặc `autodiscover`                  | Bản ghi SRV (RFC 6764)                     |

> \[!TIP]
> Để tương thích tốt nhất với tất cả các ứng dụng, chúng tôi khuyên bạn nên sử dụng **Tùy chọn A** (bản ghi CNAME) kết hợp với các bản ghi SRV từ **Tùy chọn B**. Phương pháp CNAME đơn lẻ đã bao phủ phần lớn các ứng dụng email. Các bản ghi SRV CalDAV/CardDAV đảm bảo rằng các ứng dụng lịch và danh bạ cũng có thể tự động phát hiện cài đặt máy chủ của bạn.


## Bảo mật {#security-1}

### Kỹ thuật tăng cường bảo mật máy chủ nâng cao {#advanced-server-hardening-techniques}

> \[!TIP]
> Tìm hiểu thêm về hạ tầng bảo mật của chúng tôi trên [trang Bảo mật của chúng tôi](/security).

Forward Email triển khai nhiều kỹ thuật tăng cường bảo mật máy chủ để đảm bảo an toàn cho hạ tầng và dữ liệu của bạn:

1. **Bảo mật mạng**:
   * Tường lửa IP tables với các quy tắc nghiêm ngặt
   * Fail2ban để bảo vệ chống tấn công brute force
   * Kiểm tra bảo mật và thử nghiệm xâm nhập định kỳ
   * Truy cập quản trị chỉ qua VPN

2. **Tăng cường hệ thống**:
   * Cài đặt gói tối thiểu
   * Cập nhật bảo mật định kỳ
   * SELinux ở chế độ enforcing
   * Vô hiệu hóa truy cập SSH root
   * Chỉ xác thực bằng khóa

3. **Bảo mật ứng dụng**:
   * Header Chính sách Bảo mật Nội dung (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * Header bảo vệ XSS
   * Header tùy chọn khung và chính sách referrer
   * Kiểm tra phụ thuộc định kỳ

4. **Bảo vệ dữ liệu**:
   * Mã hóa toàn bộ ổ đĩa với LUKS
   * Quản lý khóa an toàn
   * Sao lưu định kỳ có mã hóa
   * Thực hành giảm thiểu dữ liệu

5. **Giám sát và phản ứng**:
   * Phát hiện xâm nhập thời gian thực
   * Quét bảo mật tự động
   * Ghi nhật ký và phân tích tập trung
   * Quy trình phản ứng sự cố

> \[!IMPORTANT]
> Các thực hành bảo mật của chúng tôi liên tục được cập nhật để đối phó với các mối đe dọa và lỗ hổng mới phát sinh.

> \[!TIP]
> Để bảo mật tối đa, chúng tôi khuyên bạn sử dụng dịch vụ của chúng tôi với mã hóa đầu cuối qua OpenPGP.

### Bạn có chứng nhận SOC 2 hoặc ISO 27001 không? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email hoạt động trên hạ tầng do các nhà cung cấp phụ có chứng nhận cung cấp nhằm đảm bảo tuân thủ các tiêu chuẩn ngành.

Forward Email không trực tiếp sở hữu chứng nhận SOC 2 Loại II hoặc ISO 27001. Tuy nhiên, dịch vụ hoạt động trên hạ tầng do các nhà cung cấp phụ có chứng nhận:

* **DigitalOcean**: được chứng nhận SOC 2 Loại II và SOC 3 Loại II (được kiểm toán bởi Schellman & Company LLC), chứng nhận ISO 27001 tại nhiều trung tâm dữ liệu. Chi tiết: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: được chứng nhận SOC 2+ (HIPAA), các chứng nhận ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Chi tiết: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: tuân thủ SOC 2 (liên hệ trực tiếp với DataPacket để lấy chứng nhận), nhà cung cấp hạ tầng cấp doanh nghiệp (địa điểm Denver). Chi tiết: <https://www.datapacket.com/datacenters/denver>

Forward Email tuân theo các thực hành tốt nhất trong ngành cho các cuộc kiểm toán bảo mật và thường xuyên hợp tác với các nhà nghiên cứu bảo mật độc lập. Nguồn: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Bạn có sử dụng mã hóa TLS cho việc chuyển tiếp email không {#do-you-use-tls-encryption-for-email-forwarding}

Có. Forward Email nghiêm ngặt áp dụng TLS 1.2+ cho tất cả các kết nối (HTTPS, SMTP, IMAP, POP3) và triển khai MTA-STS để tăng cường hỗ trợ TLS. Việc triển khai bao gồm:

* Áp dụng TLS 1.2+ cho tất cả các kết nối email
* Trao đổi khóa ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) cho bảo mật chuyển tiếp hoàn hảo
* Bộ mã hóa hiện đại với các bản cập nhật bảo mật thường xuyên
* Hỗ trợ HTTP/2 để cải thiện hiệu suất và bảo mật
* HSTS (HTTP Strict Transport Security) với tính năng tải trước trên các trình duyệt lớn
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** để thực thi TLS nghiêm ngặt

Nguồn: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Triển khai MTA-STS**: Forward Email thực thi việc áp dụng MTA-STS nghiêm ngặt trong mã nguồn. Khi xảy ra lỗi TLS và MTA-STS được áp dụng, hệ thống trả về mã trạng thái SMTP 421 để đảm bảo email được thử gửi lại sau thay vì bị gửi đi không an toàn. Chi tiết triển khai:

* Phát hiện lỗi TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Áp dụng MTA-STS trong helper gửi email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Xác thực bên thứ ba: <https://www.hardenize.com/report/forwardemail.net/1750312779> cho thấy đánh giá "Tốt" cho tất cả các biện pháp bảo mật TLS và truyền tải.

### Bạn có giữ nguyên các header xác thực email không {#do-you-preserve-email-authentication-headers}

Có. Forward Email triển khai đầy đủ và giữ nguyên các header xác thực email:

* **SPF (Sender Policy Framework)**: Triển khai và giữ nguyên đúng cách
* **DKIM (DomainKeys Identified Mail)**: Hỗ trợ đầy đủ với quản lý khóa đúng chuẩn
* **DMARC**: Thực thi chính sách cho các email không đạt xác thực SPF hoặc DKIM
* **ARC**: Mặc dù không được mô tả chi tiết, điểm tuân thủ hoàn hảo của dịch vụ cho thấy xử lý toàn diện các header xác thực

Nguồn: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Xác thực: Bài kiểm tra Mail Test của Internet.nl cho điểm 100/100 riêng cho việc triển khai "SPF, DKIM, và DMARC". Đánh giá Hardenize xác nhận điểm "Tốt" cho SPF và DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Bạn có giữ nguyên các header email gốc và ngăn chặn giả mạo không {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email triển khai bảo vệ chống giả mạo tinh vi để ngăn chặn việc lạm dụng email.

Forward Email giữ nguyên các header email gốc đồng thời thực thi bảo vệ chống giả mạo toàn diện thông qua mã nguồn MX:

* **Giữ nguyên Header**: Các header xác thực gốc được duy trì trong quá trình chuyển tiếp
* **Chống giả mạo**: Thực thi chính sách DMARC ngăn chặn giả mạo header bằng cách từ chối các email không đạt xác thực SPF hoặc DKIM
* **Ngăn chặn chèn header**: Kiểm tra và làm sạch đầu vào sử dụng thư viện striptags
* **Bảo vệ nâng cao**: Phát hiện phishing tinh vi với phát hiện giả mạo, ngăn chặn mạo danh và hệ thống thông báo người dùng

**Chi tiết triển khai MX**: Logic xử lý email chính được thực hiện bởi mã nguồn máy chủ MX, cụ thể:

* Bộ xử lý dữ liệu MX chính: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Lọc email tùy ý (chống giả mạo): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Helper `isArbitrary` triển khai các quy tắc chống giả mạo tinh vi bao gồm phát hiện mạo danh tên miền, các cụm từ bị chặn và nhiều mẫu phishing khác nhau.
### Làm thế nào bạn bảo vệ chống lại spam và lạm dụng {#how-do-you-protect-against-spam-and-abuse}

Forward Email triển khai bảo vệ đa lớp toàn diện:

* **Giới hạn Tốc độ**: Áp dụng cho các lần thử xác thực, các điểm cuối API và kết nối SMTP
* **Cách ly Tài nguyên**: Giữa các người dùng để ngăn ảnh hưởng từ người dùng có lưu lượng cao
* **Bảo vệ DDoS**: Bảo vệ đa lớp thông qua hệ thống Shield của DataPacket và Cloudflare
* **Tự động Mở rộng**: Điều chỉnh tài nguyên động dựa trên nhu cầu
* **Phòng chống Lạm dụng**: Kiểm tra phòng chống lạm dụng theo người dùng và chặn dựa trên băm cho nội dung độc hại
* **Xác thực Email**: Các giao thức SPF, DKIM, DMARC với phát hiện phishing nâng cao

Nguồn:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Chi tiết bảo vệ DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Bạn có lưu trữ nội dung email trên đĩa không {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email sử dụng kiến trúc không kiến thức (zero-knowledge) ngăn nội dung email được ghi vào đĩa.

* **Kiến trúc Không Kiến Thức**: Hộp thư SQLite được mã hóa riêng biệt có nghĩa là Forward Email không thể truy cập nội dung email
* **Xử lý Trong Bộ Nhớ**: Xử lý email diễn ra hoàn toàn trong bộ nhớ, tránh lưu trữ trên đĩa
* **Không Ghi Nhật Ký Nội Dung**: "Chúng tôi không ghi nhật ký hoặc lưu trữ nội dung email hoặc siêu dữ liệu lên đĩa"
* **Mã hóa trong Môi trường Cách ly**: Khóa mã hóa không bao giờ được lưu trữ trên đĩa dưới dạng văn bản thuần túy

**Bằng chứng từ Mã nguồn MX**: Máy chủ MX xử lý email hoàn toàn trong bộ nhớ mà không ghi nội dung ra đĩa. Bộ xử lý chính cho email minh họa cách tiếp cận trong bộ nhớ này: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Nguồn:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Tóm tắt)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Chi tiết zero-knowledge)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Mã hóa trong môi trường cách ly)

### Nội dung email có thể bị lộ khi hệ thống bị sự cố không {#can-email-content-be-exposed-during-system-crashes}

Không. Forward Email triển khai các biện pháp bảo vệ toàn diện chống lộ dữ liệu do sự cố hệ thống:

* **Tắt Core Dumps**: Ngăn lộ bộ nhớ khi sự cố xảy ra
* **Tắt Bộ nhớ Swap**: Hoàn toàn tắt để ngăn trích xuất dữ liệu nhạy cảm từ file swap
* **Kiến trúc Trong Bộ Nhớ**: Nội dung email chỉ tồn tại trong bộ nhớ tạm thời khi xử lý
* **Bảo vệ Khóa Mã hóa**: Khóa không bao giờ được lưu trên đĩa dưới dạng văn bản thuần túy
* **Bảo mật Vật lý**: Đĩa mã hóa LUKS v2 ngăn truy cập vật lý vào dữ liệu
* **Tắt Lưu trữ USB**: Ngăn trích xuất dữ liệu trái phép

**Xử lý lỗi cho các vấn đề hệ thống**: Forward Email sử dụng các hàm trợ giúp `isCodeBug` và `isTimeoutError` để đảm bảo nếu có sự cố kết nối cơ sở dữ liệu, sự cố mạng/DNS/blocklist hoặc sự cố kết nối upstream xảy ra, hệ thống trả về mã trạng thái SMTP 421 để đảm bảo email sẽ được thử lại sau thay vì bị mất hoặc lộ.

Chi tiết triển khai:

* Phân loại lỗi: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Xử lý lỗi timeout trong xử lý MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Nguồn: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Ai có quyền truy cập vào hạ tầng email của bạn {#who-has-access-to-your-email-infrastructure}

Forward Email triển khai kiểm soát truy cập toàn diện cho nhóm kỹ sư tối thiểu 2-3 người với yêu cầu 2FA nghiêm ngặt:

* **Kiểm soát Truy cập Theo Vai trò**: Cho các tài khoản nhóm với quyền dựa trên tài nguyên
* **Nguyên tắc Quyền Ít Nhất**: Áp dụng trên tất cả hệ thống
* **Phân tách Nhiệm vụ**: Giữa các vai trò vận hành
* **Quản lý Người dùng**: Người dùng deploy và devops riêng biệt với quyền khác nhau
* **Tắt đăng nhập Root**: Buộc truy cập qua các tài khoản được xác thực đúng cách
* **2FA Nghiêm ngặt**: Không dùng 2FA qua SMS do rủi ro tấn công MiTM - chỉ dùng app hoặc token phần cứng
* **Ghi nhật ký Kiểm toán Toàn diện**: Có che dữ liệu nhạy cảm
* **Phát hiện Bất thường Tự động**: Cho các mẫu truy cập bất thường
* **Đánh giá Bảo mật Định kỳ**: Đối với nhật ký truy cập
* **Phòng chống Tấn công Evil Maid**: Tắt lưu trữ USB và các biện pháp bảo mật vật lý khác
Nguồn:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Kiểm soát ủy quyền)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Bảo mật mạng)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Phòng chống tấn công evil maid)

### Bạn sử dụng nhà cung cấp hạ tầng nào {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email sử dụng nhiều nhà xử lý phụ hạ tầng với các chứng nhận tuân thủ toàn diện.

Chi tiết đầy đủ có trên trang tuân thủ GDPR của chúng tôi: <https://forwardemail.net/gdpr>

**Nhà xử lý phụ hạ tầng chính:**

| Nhà cung cấp     | Chứng nhận Khung Bảo mật Dữ liệu | Trang Tuân thủ GDPR                                                                       |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------ |
| **Cloudflare**   | ✅ Có                            | <https://www.cloudflare.com/trust-hub/gdpr/>                                               |
| **DataPacket**   | ❌ Không                         | <https://www.datapacket.com/privacy-policy>                                                |
| **DigitalOcean** | ❌ Không                         | <https://www.digitalocean.com/legal/gdpr>                                                  |
| **GitHub**       | ✅ Có                            | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Không                         | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                            |

**Chứng nhận chi tiết:**

**DigitalOcean**

* SOC 2 Loại II & SOC 3 Loại II (được kiểm toán bởi Schellman & Company LLC)
* Chứng nhận ISO 27001 tại nhiều trung tâm dữ liệu
* Tuân thủ PCI-DSS
* Chứng nhận CSA STAR Cấp độ 1
* Chứng nhận APEC CBPR PRP
* Chi tiết: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Chứng nhận SOC 2+ (HIPAA)
* Tuân thủ PCI Merchant
* Chứng nhận CSA STAR Cấp độ 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Chi tiết: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* Tuân thủ SOC 2 (liên hệ trực tiếp DataPacket để lấy chứng nhận)
* Hạ tầng cấp doanh nghiệp (vị trí Denver)
* Bảo vệ DDoS qua bộ công nghệ an ninh mạng Shield
* Hỗ trợ kỹ thuật 24/7
* Mạng lưới toàn cầu với 58 trung tâm dữ liệu
* Chi tiết: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Chứng nhận Khung Bảo mật Dữ liệu (EU-Mỹ, Thụy Sĩ-Mỹ, và Mở rộng Vương quốc Anh)
* Lưu trữ mã nguồn, CI/CD, và quản lý dự án
* Có Thỏa thuận Bảo vệ Dữ liệu GitHub
* Chi tiết: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Nhà xử lý thanh toán:**

* **Stripe**: Chứng nhận Khung Bảo mật Dữ liệu - <https://stripe.com/legal/privacy-center>
* **PayPal**: Không được chứng nhận DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Bạn có cung cấp Thỏa thuận Xử lý Dữ liệu (DPA) không {#do-you-offer-a-data-processing-agreement-dpa}

Có, Forward Email cung cấp Thỏa thuận Xử lý Dữ liệu (DPA) toàn diện có thể ký kết cùng với hợp đồng doanh nghiệp của chúng tôi. Bản sao DPA có tại: <https://forwardemail.net/dpa>

**Chi tiết DPA:**

* Bao gồm tuân thủ GDPR và các khung bảo mật EU-Mỹ/Thụy Sĩ-Mỹ
* Tự động được chấp nhận khi đồng ý với Điều khoản Dịch vụ của chúng tôi
* Không cần chữ ký riêng cho DPA tiêu chuẩn
* Có thể sắp xếp DPA tùy chỉnh qua Giấy phép Doanh nghiệp

**Khung Tuân thủ GDPR:**
DPA của chúng tôi chi tiết việc tuân thủ GDPR cũng như các yêu cầu chuyển dữ liệu quốc tế. Thông tin đầy đủ có tại: <https://forwardemail.net/gdpr>

Đối với khách hàng doanh nghiệp cần điều khoản DPA tùy chỉnh hoặc thỏa thuận hợp đồng cụ thể, có thể được xử lý qua chương trình **Giấy phép Doanh nghiệp (250$/tháng)** của chúng tôi.

### Bạn xử lý thông báo vi phạm dữ liệu như thế nào {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Kiến trúc không kiến thức của Forward Email hạn chế đáng kể tác động của vi phạm.
* **Tiếp xúc dữ liệu hạn chế**: Không thể truy cập nội dung email được mã hóa do kiến trúc không biết gì (zero-knowledge)
* **Thu thập dữ liệu tối thiểu**: Chỉ thông tin cơ bản của người đăng ký và nhật ký IP giới hạn cho mục đích bảo mật
* **Khung xử lý phụ**: DigitalOcean, GitHub và Vultr duy trì quy trình phản ứng sự cố tuân thủ GDPR

**Thông tin đại diện GDPR:**
Forward Email đã chỉ định đại diện GDPR theo Điều 27:

**Đại diện EU:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Đại diện Vương quốc Anh:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Đối với khách hàng doanh nghiệp yêu cầu SLA thông báo vi phạm cụ thể, điều này nên được thảo luận trong khuôn khổ thỏa thuận **Enterprise License**.

Nguồn:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Bạn có cung cấp môi trường thử nghiệm không {#do-you-offer-a-test-environment}

Tài liệu kỹ thuật của Forward Email không mô tả rõ ràng chế độ sandbox riêng biệt. Tuy nhiên, các phương pháp thử nghiệm tiềm năng bao gồm:

* **Tùy chọn tự lưu trữ**: Khả năng tự lưu trữ toàn diện để tạo môi trường thử nghiệm
* **Giao diện API**: Khả năng thử nghiệm cấu hình theo chương trình
* **Mã nguồn mở**: Mã nguồn 100% mở cho phép khách hàng kiểm tra logic chuyển tiếp
* **Nhiều tên miền**: Hỗ trợ nhiều tên miền có thể cho phép tạo tên miền thử nghiệm

Đối với khách hàng doanh nghiệp yêu cầu khả năng sandbox chính thức, điều này nên được thảo luận trong khuôn khổ thỏa thuận **Enterprise License**.

Nguồn: <https://github.com/forwardemail/forwardemail.net> (Chi tiết môi trường phát triển)

### Bạn có cung cấp công cụ giám sát và cảnh báo không {#do-you-provide-monitoring-and-alerting-tools}

Forward Email cung cấp giám sát thời gian thực với một số giới hạn:

**Có sẵn:**

* **Giám sát giao hàng thời gian thực**: Các chỉ số hiệu suất công khai cho các nhà cung cấp email lớn
* **Cảnh báo tự động**: Đội ngũ kỹ thuật được cảnh báo khi thời gian giao hàng vượt quá 10 giây
* **Giám sát minh bạch**: Hệ thống giám sát mã nguồn mở 100%
* **Giám sát hạ tầng**: Phát hiện bất thường tự động và ghi nhật ký kiểm toán toàn diện

**Giới hạn:**

* Các webhook dành cho khách hàng hoặc thông báo trạng thái giao hàng dựa trên API không được tài liệu hóa rõ ràng

Đối với khách hàng doanh nghiệp yêu cầu webhook trạng thái giao hàng chi tiết hoặc tích hợp giám sát tùy chỉnh, các khả năng này có thể có thông qua thỏa thuận **Enterprise License**.

Nguồn:

* <https://forwardemail.net> (Hiển thị giám sát thời gian thực)
* <https://github.com/forwardemail/forwardemail.net> (Triển khai giám sát)

### Làm thế nào bạn đảm bảo tính khả dụng cao {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email triển khai dự phòng toàn diện trên nhiều nhà cung cấp hạ tầng.

* **Hạ tầng phân tán**: Nhiều nhà cung cấp (DigitalOcean, Vultr, DataPacket) trên các vùng địa lý khác nhau
* **Cân bằng tải theo địa lý**: Cân bằng tải định vị địa lý dựa trên Cloudflare với chuyển đổi dự phòng tự động
* **Tự động mở rộng**: Điều chỉnh tài nguyên động dựa trên nhu cầu
* **Bảo vệ DDoS đa lớp**: Qua hệ thống Shield của DataPacket và Cloudflare
* **Dự phòng máy chủ**: Nhiều máy chủ mỗi vùng với chuyển đổi dự phòng tự động
* **Sao chép cơ sở dữ liệu**: Đồng bộ dữ liệu thời gian thực trên nhiều vị trí
* **Giám sát và cảnh báo**: Giám sát 24/7 với phản ứng sự cố tự động

**Cam kết thời gian hoạt động**: 99,9%+ khả dụng dịch vụ với giám sát minh bạch có sẵn tại <https://forwardemail.net>

Nguồn:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Bạn có tuân thủ Mục 889 của Đạo luật Ủy quyền Quốc phòng Quốc gia (NDAA) không {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email hoàn toàn tuân thủ Mục 889 thông qua việc lựa chọn cẩn thận các đối tác hạ tầng.

Có, Forward Email **tuân thủ Mục 889**. Mục 889 của Đạo luật Ủy quyền Quốc phòng Quốc gia (NDAA) cấm các cơ quan chính phủ sử dụng hoặc ký hợp đồng với các thực thể sử dụng thiết bị viễn thông và giám sát video từ các công ty cụ thể (Huawei, ZTE, Hikvision, Dahua và Hytera).
**Cách Forward Email Đạt Được Tuân Thủ Mục 889:**

Forward Email hoàn toàn dựa vào hai nhà cung cấp hạ tầng chính, không sử dụng thiết bị bị cấm theo Mục 889:

1. **Cloudflare**: Đối tác chính của chúng tôi về dịch vụ mạng và bảo mật email
2. **DataPacket**: Nhà cung cấp chính của chúng tôi về hạ tầng máy chủ (chỉ sử dụng thiết bị của Arista Networks và Cisco)
3. **Nhà cung cấp dự phòng**: Các nhà cung cấp dự phòng của chúng tôi là Digital Ocean và Vultr cũng được xác nhận bằng văn bản tuân thủ Mục 889.

**Cam kết của Cloudflare**: Cloudflare tuyên bố rõ ràng trong Bộ Quy Tắc Ứng Xử Bên Thứ Ba của họ rằng họ không sử dụng thiết bị viễn thông, sản phẩm giám sát video hoặc dịch vụ từ bất kỳ thực thể nào bị cấm theo Mục 889.

**Trường hợp sử dụng của Chính phủ**: Việc tuân thủ Mục 889 của chúng tôi đã được xác nhận khi **Học viện Hải quân Hoa Kỳ** chọn Forward Email cho nhu cầu chuyển tiếp email an toàn của họ, yêu cầu tài liệu về các tiêu chuẩn tuân thủ liên bang của chúng tôi.

Để biết chi tiết đầy đủ về khung tuân thủ của chính phủ, bao gồm các quy định liên bang rộng hơn, hãy đọc nghiên cứu trường hợp toàn diện của chúng tôi: [Dịch vụ Email Chính phủ Liên bang Tuân thủ Mục 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Chi tiết Hệ thống và Kỹ thuật {#system-and-technical-details}

### Bạn có lưu trữ email và nội dung của chúng không {#do-you-store-emails-and-their-contents}

Không, chúng tôi không ghi vào đĩa hoặc lưu trữ nhật ký – ngoại trừ [lỗi](#do-you-store-error-logs) và [SMTP gửi đi](#do-you-support-sending-email-with-smtp) (xem [Chính sách Bảo mật](/privacy) của chúng tôi).

Mọi thứ được thực hiện trong bộ nhớ và [mã nguồn của chúng tôi có trên GitHub](https://github.com/forwardemail).

### Hệ thống chuyển tiếp email của bạn hoạt động như thế nào {#how-does-your-email-forwarding-system-work}

Email dựa trên [giao thức SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Giao thức này bao gồm các lệnh gửi đến máy chủ (thường chạy trên cổng 25). Có một kết nối ban đầu, sau đó người gửi chỉ định địa chỉ gửi ("MAIL FROM"), tiếp theo là địa chỉ nhận ("RCPT TO"), và cuối cùng là phần tiêu đề và nội dung email ("DATA"). Luồng hệ thống chuyển tiếp email của chúng tôi được mô tả tương ứng với từng lệnh giao thức SMTP dưới đây:

* Kết nối ban đầu (không có tên lệnh, ví dụ `telnet example.com 25`) - Đây là kết nối ban đầu. Chúng tôi kiểm tra người gửi không có trong [danh sách cho phép](#do-you-have-an-allowlist) so với [danh sách cấm](#do-you-have-a-denylist). Cuối cùng, nếu người gửi không có trong danh sách cho phép, chúng tôi kiểm tra xem họ có bị [đưa vào danh sách xám](#do-you-have-a-greylist) hay không.

* `HELO` - Đây là lời chào để xác định tên miền đầy đủ (FQDN), địa chỉ IP hoặc tên trình xử lý thư của người gửi. Giá trị này có thể bị giả mạo, vì vậy chúng tôi không dựa vào dữ liệu này mà thay vào đó sử dụng tra cứu tên máy chủ ngược của địa chỉ IP kết nối.

* `MAIL FROM` - Đây là địa chỉ gửi thư trong phong bì của email. Nếu có giá trị nhập vào, nó phải là địa chỉ email hợp lệ theo RFC 5322. Giá trị trống được phép. Chúng tôi [kiểm tra chống lại thư phản hồi ngược](#how-do-you-protect-against-backscatter) tại đây, và cũng kiểm tra MAIL FROM với [danh sách cấm](#do-you-have-a-denylist). Cuối cùng, chúng tôi kiểm tra người gửi không có trong danh sách cho phép để giới hạn tần suất (xem phần [Giới hạn tần suất](#do-you-have-rate-limiting) và [danh sách cho phép](#do-you-have-an-allowlist) để biết thêm thông tin).

* `RCPT TO` - Đây là người nhận của email. Đây phải là các địa chỉ email hợp lệ theo RFC 5322. Chúng tôi chỉ cho phép tối đa 50 người nhận trong phong bì cho mỗi tin nhắn (khác với trường "To" trong tiêu đề email). Chúng tôi cũng kiểm tra địa chỉ [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") hợp lệ tại đây để bảo vệ chống giả mạo với tên miền SRS của chúng tôi.

* `DATA` - Đây là phần cốt lõi của dịch vụ chúng tôi xử lý email. Xem phần [Bạn xử lý email để chuyển tiếp như thế nào](#how-do-you-process-an-email-for-forwarding) bên dưới để hiểu rõ hơn.
### Bạn xử lý một email để chuyển tiếp như thế nào {#how-do-you-process-an-email-for-forwarding}

Phần này mô tả quy trình của chúng tôi liên quan đến lệnh giao thức SMTP `DATA` trong phần [Hệ thống chuyển tiếp email của bạn hoạt động như thế nào](#how-does-your-email-forwarding-system-work) ở trên – đó là cách chúng tôi xử lý các tiêu đề, nội dung, bảo mật của email, xác định nơi cần gửi đến, và cách chúng tôi xử lý các kết nối.

1. Nếu tin nhắn vượt quá kích thước tối đa 50mb, thì nó sẽ bị từ chối với mã lỗi 552.

2. Nếu tin nhắn không chứa tiêu đề "From", hoặc nếu bất kỳ giá trị nào trong tiêu đề "From" không phải là địa chỉ email hợp lệ theo RFC 5322, thì nó sẽ bị từ chối với mã lỗi 550.

3. Nếu tin nhắn có hơn 25 tiêu đề "Received", thì được xác định là bị kẹt trong vòng lặp chuyển hướng, và nó sẽ bị từ chối với mã lỗi 550.

4. Sử dụng dấu vân tay của email (xem phần về [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), chúng tôi sẽ kiểm tra xem tin nhắn đã được thử gửi lại hơn 5 ngày chưa (điều này khớp với [hành vi mặc định của postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), và nếu có, thì nó sẽ bị từ chối với mã lỗi 550.

5. Chúng tôi lưu trữ trong bộ nhớ kết quả quét email bằng cách sử dụng [Spam Scanner](https://spamscanner.net).

6. Nếu có bất kỳ kết quả tùy ý nào từ Spam Scanner, thì nó sẽ bị từ chối với mã lỗi 554. Kết quả tùy ý chỉ bao gồm bài kiểm tra GTUBE tại thời điểm viết này. Xem <https://spamassassin.apache.org/gtube/> để hiểu thêm.

7. Chúng tôi sẽ thêm các tiêu đề sau vào tin nhắn để phục vụ mục đích gỡ lỗi và ngăn chặn lạm dụng:

   * `Received` - chúng tôi thêm tiêu đề Received tiêu chuẩn này với IP và host nguồn gốc, loại truyền tải, thông tin kết nối TLS, ngày/giờ, và người nhận.
   * `X-Original-To` - người nhận gốc của tin nhắn:
     * Điều này hữu ích để xác định nơi email được gửi đến ban đầu (ngoài tiêu đề "Received").
     * Tiêu đề này được thêm theo từng người nhận vào thời điểm IMAP và/hoặc chuyển tiếp ẩn danh (để bảo vệ quyền riêng tư).
   * `X-Forward-Email-Website` - chứa liên kết đến trang web của chúng tôi tại <https://forwardemail.net>
   * `X-Forward-Email-Version` - phiên bản [SemVer](https://semver.org/) hiện tại từ `package.json` của mã nguồn chúng tôi.
   * `X-Forward-Email-Session-ID` - giá trị ID phiên dùng cho mục đích gỡ lỗi (chỉ áp dụng trong môi trường không phải sản xuất).
   * `X-Forward-Email-Sender` - danh sách phân tách bằng dấu phẩy chứa địa chỉ MAIL FROM phong bì gốc (nếu không trống), tên máy khách PTR ngược FQDN (nếu có), và địa chỉ IP của người gửi.
   * `X-Forward-Email-ID` - chỉ áp dụng cho SMTP gửi đi và tương ứng với ID email được lưu trong Tài khoản của tôi → Emails
   * `X-Report-Abuse` - với giá trị `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - với giá trị `abuse@forwardemail.net`.
   * `X-Complaints-To` - với giá trị `abuse@forwardemail.net`.

8. Sau đó chúng tôi kiểm tra tin nhắn với [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), và [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Nếu tin nhắn không đạt DMARC và tên miền có chính sách từ chối (ví dụ `p=reject` [có trong chính sách DMARC](https://wikipedia.org/wiki/DMARC)), thì nó sẽ bị từ chối với mã lỗi 550. Thông thường chính sách DMARC cho một tên miền có thể được tìm thấy trong bản ghi <strong class="notranslate">TXT</strong> phụ miền `_dmarc` (ví dụ `dig _dmarc.example.com txt`).
   * Nếu tin nhắn không đạt SPF và tên miền có chính sách thất bại nghiêm ngặt (ví dụ `-all` có trong chính sách SPF thay vì `~all` hoặc không có chính sách), thì nó sẽ bị từ chối với mã lỗi 550. Thông thường chính sách SPF cho một tên miền có thể được tìm thấy trong bản ghi <strong class="notranslate">TXT</strong> của tên miền gốc (ví dụ `dig example.com txt`). Xem phần này để biết thêm thông tin về [gửi mail như với Gmail](#can-i-send-mail-as-in-gmail-with-this) liên quan đến SPF.
9. Bây giờ chúng ta xử lý các người nhận của tin nhắn như đã thu thập từ lệnh `RCPT TO` trong phần [Hệ thống chuyển tiếp email của bạn hoạt động như thế nào](#how-does-your-email-forwarding-system-work) ở trên. Đối với mỗi người nhận, chúng ta thực hiện các thao tác sau:

   * Chúng ta tra cứu các bản ghi <strong class="notranslate">TXT</strong> của tên miền (phần sau ký hiệu `@`, ví dụ `example.com` nếu địa chỉ email là `test@example.com`). Ví dụ, nếu tên miền là `example.com` thì chúng ta thực hiện tra cứu DNS như `dig example.com txt`.
   * Chúng ta phân tích tất cả các bản ghi <strong class="notranslate">TXT</strong> bắt đầu bằng `forward-email=` (gói miễn phí) hoặc `forward-email-site-verification=` (gói trả phí). Lưu ý rằng chúng ta phân tích cả hai để xử lý email trong khi người dùng đang nâng cấp hoặc hạ cấp gói.
   * Từ các bản ghi <strong class="notranslate">TXT</strong> đã phân tích, chúng ta lặp qua để trích xuất cấu hình chuyển tiếp (như mô tả trong phần [Làm thế nào để bắt đầu và thiết lập chuyển tiếp email](#how-do-i-get-started-and-set-up-email-forwarding) ở trên). Lưu ý rằng chúng tôi chỉ hỗ trợ một giá trị `forward-email-site-verification=`, và nếu có nhiều hơn một giá trị được cung cấp, thì sẽ xảy ra lỗi 550 và người gửi sẽ nhận được thư trả lại cho người nhận này.
   * Đệ quy, chúng ta lặp qua cấu hình chuyển tiếp đã trích xuất để xác định chuyển tiếp toàn cục, chuyển tiếp dựa trên regex, và tất cả các cấu hình chuyển tiếp được hỗ trợ khác – hiện được gọi là "Địa chỉ Chuyển tiếp" của chúng tôi.
   * Đối với mỗi Địa chỉ Chuyển tiếp, chúng tôi hỗ trợ một lần tra cứu đệ quy (sẽ bắt đầu lại chuỗi các thao tác này trên địa chỉ được cho). Nếu tìm thấy kết quả đệ quy, thì kết quả cha sẽ bị loại khỏi Địa chỉ Chuyển tiếp, và các kết quả con sẽ được thêm vào.
   * Địa chỉ Chuyển tiếp được phân tích để đảm bảo tính duy nhất (vì chúng tôi không muốn gửi trùng lặp đến một địa chỉ hoặc tạo thêm các kết nối SMTP không cần thiết).
   * Đối với mỗi Địa chỉ Chuyển tiếp, chúng tôi tra cứu tên miền của nó qua điểm cuối API `/v1/max-forwarded-addresses` (để xác định số lượng địa chỉ mà tên miền được phép chuyển tiếp email đến mỗi bí danh, ví dụ mặc định là 10 – xem phần [giới hạn tối đa về số lượng địa chỉ email tôi có thể chuyển tiếp đến mỗi bí danh](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Nếu vượt quá giới hạn này, sẽ xảy ra lỗi 550 và người gửi sẽ nhận được thư trả lại cho người nhận này.
   * Chúng tôi tra cứu cài đặt của người nhận gốc qua điểm cuối API `/v1/settings`, hỗ trợ tra cứu cho người dùng trả phí (với phương án dự phòng cho người dùng miễn phí). Điều này trả về một đối tượng cấu hình cho các cài đặt nâng cao như `port` (Số, ví dụ `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean), và `has_virus_protection` (Boolean).
   * Dựa trên các cài đặt này, chúng tôi kiểm tra kết quả của Bộ quét Spam và nếu có lỗi xảy ra, tin nhắn sẽ bị từ chối với mã lỗi 554 (ví dụ nếu `has_virus_protection` được bật, chúng tôi sẽ kiểm tra kết quả Bộ quét Spam về virus). Lưu ý rằng tất cả người dùng gói miễn phí sẽ được tự động kiểm tra nội dung người lớn, lừa đảo, tệp thực thi và virus. Mặc định, tất cả người dùng gói trả phí cũng được tự động kiểm tra, nhưng cấu hình này có thể thay đổi trong trang Cài đặt cho một tên miền trong bảng điều khiển Forward Email).

10. Đối với mỗi Địa chỉ Chuyển tiếp của người nhận đã xử lý, chúng tôi thực hiện các thao tác sau:

    * Địa chỉ được kiểm tra trong [danh sách từ chối](#do-you-have-a-denylist), và nếu có trong danh sách, sẽ xảy ra lỗi 421 (báo cho người gửi thử lại sau).
    * Nếu địa chỉ là webhook, chúng tôi đặt một biến Boolean cho các thao tác sau này (xem bên dưới – chúng tôi nhóm các webhook tương tự lại để thực hiện một yêu cầu POST thay vì nhiều yêu cầu cho việc gửi).
    * Nếu địa chỉ là địa chỉ email, chúng tôi phân tích máy chủ cho các thao tác sau này (xem bên dưới – chúng tôi nhóm các máy chủ tương tự lại để tạo một kết nối thay vì nhiều kết nối riêng biệt cho việc gửi).
11. Nếu không có người nhận và không có thư bị trả lại, thì chúng tôi sẽ phản hồi với lỗi 550 "Người nhận không hợp lệ".

12. Nếu có người nhận, thì chúng tôi sẽ lặp qua họ (nhóm lại theo cùng một máy chủ) và gửi email. Xem phần [Bạn xử lý các vấn đề giao hàng email như thế nào](#how-do-you-handle-email-delivery-issues) bên dưới để hiểu thêm.

    * Nếu có lỗi xảy ra khi gửi email, thì chúng tôi sẽ lưu trữ chúng trong bộ nhớ để xử lý sau.
    * Chúng tôi sẽ lấy mã lỗi thấp nhất (nếu có) từ việc gửi email – và sử dụng đó làm mã phản hồi cho lệnh `DATA`. Điều này có nghĩa là các email không được gửi sẽ thường được người gửi gốc thử lại, trong khi các email đã được gửi sẽ không bị gửi lại lần tiếp theo (vì chúng tôi sử dụng [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Nếu không có lỗi xảy ra, thì chúng tôi sẽ gửi mã trạng thái phản hồi SMTP 250 thành công.
    * Một thư bị trả lại được xác định là bất kỳ lần thử giao hàng nào dẫn đến mã trạng thái >= 500 (lỗi vĩnh viễn).

13. Nếu không có thư bị trả lại (lỗi vĩnh viễn), thì chúng tôi sẽ trả về mã trạng thái phản hồi SMTP là mã lỗi thấp nhất từ các lỗi không vĩnh viễn (hoặc mã trạng thái 250 thành công nếu không có lỗi nào).

14. Nếu có thư bị trả lại thì chúng tôi sẽ gửi email trả lại trong nền sau khi trả về mã lỗi thấp nhất trong tất cả các mã lỗi cho người gửi. Tuy nhiên, nếu mã lỗi thấp nhất >= 500, thì chúng tôi sẽ không gửi bất kỳ email trả lại nào. Điều này là vì nếu gửi, người gửi sẽ nhận được email trả lại kép (ví dụ một từ MTA gửi đi của họ, như Gmail – và một từ chúng tôi). Xem phần [Bạn bảo vệ chống lại backscatter như thế nào](#how-do-you-protect-against-backscatter) bên dưới để hiểu thêm.

### Bạn xử lý các vấn đề giao hàng email như thế nào {#how-do-you-handle-email-delivery-issues}

Lưu ý rằng chúng tôi sẽ thực hiện "Friendly-From" rewrite trên email chỉ khi chính sách DMARC của người gửi không đạt và không có chữ ký DKIM nào phù hợp với tiêu đề "From". Điều này có nghĩa là chúng tôi sẽ thay đổi tiêu đề "From" trên tin nhắn, đặt "X-Original-From", và cũng đặt "Reply-To" nếu nó chưa được đặt. Chúng tôi cũng sẽ đóng lại con dấu ARC trên tin nhắn sau khi thay đổi các tiêu đề này.

Chúng tôi cũng sử dụng phân tích thông minh các thông báo lỗi ở mọi cấp độ trong hệ thống của mình – trong mã, yêu cầu DNS, nội bộ Node.js, yêu cầu HTTP (ví dụ 408, 413, và 429 được ánh xạ thành mã phản hồi SMTP 421 nếu người nhận là webhook), và phản hồi máy chủ thư (ví dụ các phản hồi có "defer" hoặc "slowdown" sẽ được thử lại như lỗi 421).

Logic của chúng tôi rất dễ hiểu và cũng sẽ thử lại với các lỗi SSL/TLS, sự cố kết nối, và nhiều hơn nữa. Mục tiêu của việc làm cho logic dễ hiểu là tối đa hóa khả năng gửi thành công đến tất cả người nhận cho cấu hình chuyển tiếp.

Nếu người nhận là webhook, thì chúng tôi sẽ cho phép thời gian chờ 60 giây để yêu cầu hoàn thành với tối đa 3 lần thử lại (tổng cộng 4 yêu cầu trước khi thất bại). Lưu ý rằng chúng tôi phân tích đúng các mã lỗi 408, 413, và 429 và ánh xạ chúng thành mã phản hồi SMTP 421.

Nếu người nhận là địa chỉ email, thì chúng tôi sẽ cố gắng gửi email với TLS cơ hội (chúng tôi cố gắng sử dụng STARTTLS nếu có trên máy chủ thư người nhận). Nếu xảy ra lỗi SSL/TLS khi cố gắng gửi email, thì chúng tôi sẽ cố gắng gửi email mà không dùng TLS (không sử dụng STARTTLS).

Nếu có lỗi DNS hoặc kết nối xảy ra, thì chúng tôi sẽ trả về lệnh `DATA` mã phản hồi SMTP 421, nếu có lỗi cấp >= 500, thì sẽ gửi thư trả lại.

Nếu chúng tôi phát hiện máy chủ email mà chúng tôi cố gắng gửi đến đã chặn một hoặc nhiều địa chỉ IP mail exchange của chúng tôi (ví dụ bởi công nghệ họ dùng để trì hoãn spammer), thì chúng tôi sẽ gửi mã phản hồi SMTP 421 để người gửi thử lại tin nhắn sau (và chúng tôi được cảnh báo về vấn đề để hy vọng giải quyết trước lần thử tiếp theo).

### Bạn xử lý các địa chỉ IP của mình bị chặn như thế nào {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Chúng tôi thường xuyên theo dõi tất cả các danh sách từ chối DNS lớn và nếu bất kỳ địa chỉ IP trao đổi thư ("MX") nào của chúng tôi bị liệt kê trong một danh sách từ chối lớn, chúng tôi sẽ loại bỏ nó khỏi bản ghi DNS A vòng quay liên quan nếu có thể cho đến khi vấn đề được giải quyết.

Tại thời điểm viết bài này, chúng tôi cũng được liệt kê trong một số danh sách cho phép DNS, và chúng tôi rất nghiêm túc trong việc theo dõi các danh sách từ chối. Nếu bạn thấy bất kỳ vấn đề nào trước khi chúng tôi có cơ hội giải quyết, vui lòng thông báo cho chúng tôi bằng văn bản tại <support@forwardemail.net>.

Địa chỉ IP của chúng tôi được công khai, [xem phần này bên dưới để hiểu rõ hơn](#what-are-your-servers-ip-addresses).

### Địa chỉ postmaster là gì {#what-are-postmaster-addresses}

Để ngăn chặn các thư trả lại bị gửi sai và gửi các thông báo trả lời tự động kỳ nghỉ đến các hộp thư không được giám sát hoặc không tồn tại, chúng tôi duy trì một danh sách các tên người dùng giống mailer-daemon:

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

Xem [RFC 5320 Mục 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) để hiểu rõ hơn về cách các danh sách như thế này được sử dụng để tạo ra các hệ thống email hiệu quả.

### Địa chỉ không trả lời là gì {#what-are-no-reply-addresses}

Tên người dùng email bằng bất kỳ giá trị nào sau đây (không phân biệt chữ hoa chữ thường) được coi là địa chỉ không trả lời:

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

Danh sách này được duy trì [như một dự án mã nguồn mở trên GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Địa chỉ IP của máy chủ bạn là gì {#what-are-your-servers-ip-addresses}

Chúng tôi công bố địa chỉ IP của mình tại <https://forwardemail.net/ips>.

### Bạn có danh sách cho phép không {#do-you-have-an-allowlist}

Có, chúng tôi có một [danh sách các phần mở rộng tên miền](#what-domain-name-extensions-are-allowlisted-by-default) được phép theo mặc định và một danh sách cho phép động, được lưu trong bộ nhớ đệm và xoay vòng dựa trên [tiêu chí nghiêm ngặt](#what-is-your-allowlist-criteria).

Tất cả các tên miền, email và địa chỉ IP được sử dụng bởi khách hàng trả phí đều được kiểm tra tự động với danh sách từ chối của chúng tôi hàng giờ – điều này cảnh báo các quản trị viên có thể can thiệp thủ công nếu cần thiết.

Ngoài ra, nếu một trong các tên miền hoặc địa chỉ email của bạn bị liệt vào danh sách từ chối (ví dụ: do gửi thư rác, virus hoặc do các cuộc tấn công giả mạo) – thì quản trị viên tên miền (bạn) và quản trị viên nhóm của chúng tôi sẽ được thông báo ngay lập tức qua email. Chúng tôi khuyến nghị mạnh mẽ rằng bạn [cấu hình DMARC](#how-do-i-set-up-dmarc-for-forward-email) để ngăn chặn điều này.

### Các phần mở rộng tên miền nào được phép theo mặc định {#what-domain-name-extensions-are-allowlisted-by-default}

Các phần mở rộng tên miền sau được coi là được phép theo mặc định (bất kể chúng có nằm trong Danh sách Phổ biến Umbrella hay không):

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
Ngoài ra, những [miền cấp cao thương hiệu và doanh nghiệp](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) này được phép mặc định (ví dụ `apple` cho `applecard.apple` cho sao kê ngân hàng Apple Card):

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
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
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
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
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
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
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
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
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
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
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
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
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
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
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
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
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
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
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
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
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
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
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
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
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
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
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
Tính đến ngày 18 tháng 3 năm 2025, chúng tôi cũng đã thêm các lãnh thổ hải ngoại của Pháp này vào danh sách này ([theo yêu cầu GitHub này](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

Tính đến ngày 8 tháng 7 năm 2025, chúng tôi đã thêm các quốc gia riêng biệt ở châu Âu này:

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

Vào tháng 10 năm 2025, chúng tôi cũng đã thêm <code class="notranslate">cz</code> (Cộng hòa Séc) do nhu cầu.

Chúng tôi đặc biệt không bao gồm `ru` và `ua` do hoạt động spam cao.

### Tiêu chí danh sách cho phép của bạn là gì {#what-is-your-allowlist-criteria}

Chúng tôi có một danh sách tĩnh các [phần mở rộng tên miền được phép theo mặc định](#what-domain-name-extensions-are-allowlisted-by-default) – và chúng tôi cũng duy trì một danh sách cho phép động, được lưu trong bộ nhớ đệm, dựa trên các tiêu chí nghiêm ngặt sau:

* Tên miền gốc của người gửi phải thuộc [phần mở rộng tên miền phù hợp với danh sách mà chúng tôi cung cấp trong gói miễn phí](#what-domain-name-extensions-can-be-used-for-free) (có bổ sung `biz` và `info`).  Chúng tôi cũng bao gồm các khớp một phần với `edu`, `gov`, và `mil`, chẳng hạn như `xyz.gov.au` và `xyz.edu.au`.
* Tên miền gốc của người gửi phải nằm trong top 100.000 kết quả tên miền gốc duy nhất được phân tích từ [Danh sách phổ biến Umbrella](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Tên miền gốc của người gửi phải nằm trong top 50.000 kết quả từ các tên miền gốc duy nhất xuất hiện ít nhất 4 trong 7 ngày gần đây của UPL (~50%+).
* Tên miền gốc của người gửi không được [được phân loại](https://radar.cloudflare.com/categorization-feedback/) là nội dung người lớn hoặc phần mềm độc hại bởi Cloudflare.
* Tên miền gốc của người gửi phải có bản ghi A hoặc MX được thiết lập.
* Tên miền gốc của người gửi phải có bản ghi A, bản ghi MX, bản ghi DMARC với `p=reject` hoặc `p=quarantine`, hoặc bản ghi SPF với bộ phân loại `-all` hoặc `~all`.

Nếu tiêu chí này được đáp ứng, thì tên miền gốc của người gửi sẽ được lưu trong bộ nhớ đệm trong 7 ngày. Lưu ý rằng công việc tự động của chúng tôi chạy hàng ngày – do đó đây là bộ nhớ đệm danh sách cho phép cuộn cập nhật hàng ngày.

Công việc tự động của chúng tôi sẽ tải xuống 7 ngày trước của UPL trong bộ nhớ, giải nén chúng, và sau đó phân tích trong bộ nhớ theo các tiêu chí nghiêm ngặt ở trên.

Các tên miền phổ biến tại thời điểm viết bài như Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify, và nhiều hơn nữa – tất nhiên đều được bao gồm.
Nếu bạn là người gửi không có trong danh sách cho phép của chúng tôi, thì lần đầu tiên tên miền gốc FQDN hoặc địa chỉ IP của bạn gửi email, bạn sẽ bị [giới hạn tần suất](#do-you-have-rate-limiting) và [đưa vào danh sách xám](#do-you-have-a-greylist).  Lưu ý rằng đây là thực tiễn tiêu chuẩn được áp dụng như một tiêu chuẩn email.  Hầu hết các máy chủ email sẽ cố gắng gửi lại nếu họ nhận được lỗi giới hạn tần suất hoặc danh sách xám (ví dụ: mã trạng thái lỗi cấp 421 hoặc 4xx).

**Lưu ý rằng các người gửi cụ thể như `a@gmail.com`, `b@xyz.edu`, và `c@gov.au` vẫn có thể bị [đưa vào danh sách chặn](#do-you-have-a-denylist)** (ví dụ: nếu chúng tôi tự động phát hiện spam, lừa đảo, hoặc phần mềm độc hại từ những người gửi đó).

### Những phần mở rộng tên miền nào có thể sử dụng miễn phí {#what-domain-name-extensions-can-be-used-for-free}

Tính đến ngày 31 tháng 3 năm 2023, chúng tôi đã thực thi một quy tắc chống spam tổng quát mới để bảo vệ người dùng và dịch vụ của mình.

Quy tắc mới này chỉ cho phép các phần mở rộng tên miền sau được sử dụng trong gói miễn phí của chúng tôi:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
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
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
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
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### Bạn có sử dụng greylist {#do-you-have-a-greylist}

Vâng, chúng tôi sử dụng chính sách [greylisting email](https://en.wikipedia.org/wiki/Greylisting_\(email\)) rất lỏng lẻo. Greylisting chỉ áp dụng cho những người gửi không có trong danh sách cho phép của chúng tôi và được lưu trong bộ nhớ đệm của chúng tôi trong 30 ngày.

Đối với bất kỳ người gửi mới nào, chúng tôi lưu một khóa trong cơ sở dữ liệu Redis của mình trong 30 ngày với giá trị được đặt là thời gian đến ban đầu của yêu cầu đầu tiên của họ. Sau đó, chúng tôi từ chối email của họ với mã trạng thái thử lại 450 và chỉ cho phép email đó đi qua khi đã qua 5 phút.

Nếu họ đã chờ thành công 5 phút kể từ thời gian đến ban đầu này, thì email của họ sẽ được chấp nhận và họ sẽ không nhận mã trạng thái 450 này.

Khóa bao gồm hoặc là tên miền gốc FQDN hoặc địa chỉ IP của người gửi. Điều này có nghĩa là bất kỳ tên miền phụ nào vượt qua greylist cũng sẽ vượt qua cho tên miền gốc, và ngược lại (đây là điều chúng tôi gọi là chính sách "rất lỏng lẻo").

Ví dụ, nếu một email đến từ `test.example.com` trước khi chúng tôi thấy một email đến từ `example.com`, thì bất kỳ email nào từ `test.example.com` và/hoặc `example.com` sẽ phải chờ 5 phút kể từ thời gian đến ban đầu của kết nối. Chúng tôi không bắt cả `test.example.com` và `example.com` phải chờ riêng biệt 5 phút (chính sách greylisting của chúng tôi áp dụng ở cấp độ tên miền gốc).

Lưu ý rằng greylisting không áp dụng cho bất kỳ người gửi nào trong [danh sách cho phép](#do-you-have-an-allowlist) của chúng tôi (ví dụ: Meta, Amazon, Netflix, Google, Microsoft tại thời điểm viết này).

### Bạn có sử dụng denylist {#do-you-have-a-denylist}

Vâng, chúng tôi vận hành denylist riêng của mình và cập nhật nó tự động theo thời gian thực và thủ công dựa trên các hoạt động spam và độc hại được phát hiện.

Chúng tôi cũng lấy tất cả các địa chỉ IP từ denylist UCEPROTECT Cấp 1 tại <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> mỗi giờ và đưa vào denylist của chúng tôi với thời hạn 7 ngày.

Người gửi bị phát hiện trong denylist sẽ nhận mã lỗi 421 (báo cho người gửi thử lại sau) nếu họ [không có trong danh sách cho phép](#do-you-have-an-allowlist).

Bằng cách sử dụng mã trạng thái 421 thay vì 554, các trường hợp dương tính giả tiềm năng có thể được giảm thiểu ngay lập tức và sau đó tin nhắn có thể được gửi thành công trong lần thử tiếp theo.

**Điều này được thiết kế khác với các dịch vụ thư khác**, nơi nếu bạn bị đưa vào danh sách chặn, sẽ xảy ra lỗi cứng và vĩnh viễn. Thường rất khó để yêu cầu người gửi thử lại tin nhắn (đặc biệt từ các tổ chức lớn), do đó cách tiếp cận này cho phép khoảng 5 ngày kể từ lần thử email đầu tiên để người gửi, người nhận hoặc chúng tôi can thiệp và giải quyết vấn đề (bằng cách yêu cầu gỡ bỏ denylist).

Tất cả các yêu cầu gỡ bỏ denylist được quản trị viên giám sát theo thời gian thực (ví dụ: để các trường hợp dương tính giả lặp lại có thể được quản trị viên cho phép vĩnh viễn).

Yêu cầu gỡ bỏ denylist có thể được gửi tại <https://forwardemail.net/denylist>. Người dùng trả phí sẽ được xử lý yêu cầu gỡ bỏ denylist ngay lập tức, trong khi người dùng không trả phí phải chờ quản trị viên xử lý yêu cầu.

Người gửi bị phát hiện gửi spam hoặc nội dung virus sẽ được thêm vào denylist theo cách sau:

1. [Dấu vân tay tin nhắn ban đầu](#how-do-you-determine-an-email-fingerprint) bị greylist khi phát hiện spam hoặc bị chặn từ người gửi "đáng tin cậy" (ví dụ: `gmail.com`, `microsoft.com`, `apple.com`).
   * Nếu người gửi đã được cho phép, tin nhắn bị greylist trong 1 giờ.
   * Nếu người gửi không được cho phép, tin nhắn bị greylist trong 6 giờ.
2. Chúng tôi phân tích các khóa denylist từ thông tin của người gửi và tin nhắn, và với mỗi khóa này chúng tôi tạo (nếu chưa tồn tại) một bộ đếm, tăng nó lên 1, và lưu trong bộ nhớ đệm 24 giờ.
   * Đối với người gửi được cho phép:
     * Thêm một khóa cho địa chỉ email "MAIL FROM" trong phong bì nếu nó có SPF hợp lệ hoặc không có SPF, và không phải là [tên người dùng postmaster](#what-are-postmaster-addresses) hoặc [tên người dùng no-reply](#what-are-no-reply-addresses).
     * Nếu tiêu đề "From" được cho phép, thì thêm một khóa cho địa chỉ email trong tiêu đề "From" nếu nó có SPF hợp lệ hoặc DKIM hợp lệ và căn chỉnh.
     * Nếu tiêu đề "From" không được cho phép, thì thêm một khóa cho địa chỉ email trong tiêu đề "From" và tên miền gốc đã phân tích.
   * Đối với người gửi không được cho phép:
     * Thêm một khóa cho địa chỉ email "MAIL FROM" trong phong bì nếu nó có SPF hợp lệ.
     * Nếu tiêu đề "From" được cho phép, thì thêm một khóa cho địa chỉ email trong tiêu đề "From" nếu nó có SPF hợp lệ hoặc DKIM hợp lệ và căn chỉnh.
     * Nếu tiêu đề "From" không được cho phép, thì thêm một khóa cho địa chỉ email trong tiêu đề "From" và tên miền gốc đã phân tích.
     * Thêm một khóa cho địa chỉ IP từ xa của người gửi.
     * Thêm một khóa cho tên máy chủ được phân giải của client bằng tra cứu ngược từ địa chỉ IP của người gửi (nếu có).
     * Thêm một khóa cho tên miền gốc của tên máy chủ được phân giải của client (nếu có, và nếu khác với tên máy chủ được phân giải của client).
3. Nếu bộ đếm đạt 5 đối với người gửi và khóa không được cho phép, thì chúng tôi đưa khóa vào denylist trong 30 ngày và gửi email cho đội ngũ xử lý lạm dụng của chúng tôi. Các con số này có thể thay đổi và sẽ được cập nhật tại đây khi chúng tôi giám sát lạm dụng.
4. Nếu bộ đếm đạt 10 đối với người gửi và khóa được cho phép, thì chúng tôi đưa khóa vào denylist trong 7 ngày và gửi email cho đội ngũ xử lý lạm dụng của chúng tôi. Các con số này có thể thay đổi và sẽ được cập nhật tại đây khi chúng tôi giám sát lạm dụng.
> **LƯU Ý:** Trong tương lai gần, chúng tôi sẽ giới thiệu giám sát uy tín. Giám sát uy tín sẽ tính toán khi nào cần đưa người gửi vào danh sách đen dựa trên ngưỡng phần trăm (thay vì bộ đếm sơ khai như đã nêu ở trên).

### Bạn có giới hạn tốc độ {#do-you-have-rate-limiting}

Giới hạn tốc độ người gửi được thực hiện theo tên miền gốc phân tích từ tra cứu PTR ngược trên địa chỉ IP của người gửi – hoặc nếu không có kết quả, thì đơn giản sử dụng địa chỉ IP của người gửi. Lưu ý rằng chúng tôi gọi đây là `Sender` bên dưới.

Máy chủ MX của chúng tôi có giới hạn hàng ngày cho thư đến nhận được cho [lưu trữ IMAP được mã hóa](/blog/docs/best-quantum-safe-encrypted-email-service):

* Thay vì giới hạn tốc độ thư đến nhận được trên từng bí danh riêng lẻ (ví dụ `you@yourdomain.com`) – chúng tôi giới hạn theo tên miền của bí danh đó (ví dụ `yourdomain.com`). Điều này ngăn chặn `Senders` gửi tràn vào hộp thư của tất cả các bí danh trên toàn bộ tên miền của bạn cùng lúc.
* Chúng tôi có các giới hạn chung áp dụng cho tất cả `Senders` trên toàn dịch vụ bất kể người nhận:
  * `Senders` mà chúng tôi coi là "đáng tin cậy" như nguồn thông tin chính xác (ví dụ `gmail.com`, `microsoft.com`, `apple.com`) bị giới hạn gửi 100 GB mỗi ngày.
  * `Senders` được [cho phép trong danh sách trắng](#do-you-have-an-allowlist) bị giới hạn gửi 10 GB mỗi ngày.
  * Tất cả các `Senders` khác bị giới hạn gửi 1 GB và/hoặc 1000 tin nhắn mỗi ngày.
* Chúng tôi có giới hạn cụ thể cho từng `Sender` và `yourdomain.com` là 1 GB và/hoặc 1000 tin nhắn mỗi ngày.

Máy chủ MX cũng giới hạn tin nhắn được chuyển tiếp đến một hoặc nhiều người nhận thông qua giới hạn tốc độ – nhưng điều này chỉ áp dụng cho `Senders` không có trong [danh sách trắng](#do-you-have-an-allowlist):

* Chúng tôi chỉ cho phép tối đa 100 kết nối mỗi giờ, mỗi tên miền gốc FQDN được phân giải của `Sender` (hoặc) địa chỉ IP từ xa của `Sender` (nếu không có PTR ngược), và mỗi người nhận trong phong bì. Chúng tôi lưu khóa giới hạn tốc độ dưới dạng băm mật mã trong cơ sở dữ liệu Redis của mình.

* Nếu bạn gửi email qua hệ thống của chúng tôi, vui lòng đảm bảo bạn đã thiết lập PTR ngược cho tất cả địa chỉ IP của bạn (nếu không, mỗi tên miền gốc FQDN hoặc địa chỉ IP duy nhất bạn gửi sẽ bị giới hạn tốc độ).

* Lưu ý rằng nếu bạn gửi qua hệ thống phổ biến như Amazon SES, thì bạn sẽ không bị giới hạn tốc độ vì (tại thời điểm viết bài này) Amazon SES đã được liệt kê trong danh sách trắng của chúng tôi.

* Nếu bạn gửi từ một tên miền như `test.abc.123.example.com`, thì giới hạn tốc độ sẽ được áp dụng cho `example.com`. Nhiều kẻ gửi thư rác sử dụng hàng trăm tên miền phụ để tránh các bộ lọc thư rác phổ biến chỉ giới hạn tốc độ theo tên máy chủ duy nhất thay vì tên miền gốc FQDN duy nhất.

* `Senders` vượt quá giới hạn tốc độ sẽ bị từ chối với lỗi 421.

Máy chủ IMAP và SMTP của chúng tôi giới hạn bí danh của bạn không được có hơn `60` kết nối đồng thời cùng lúc.

Máy chủ MX của chúng tôi giới hạn các người gửi [không có trong danh sách trắng](#do-you-have-an-allowlist) không được thiết lập hơn 10 kết nối đồng thời (với thời gian lưu bộ đếm trong bộ nhớ cache là 3 phút, tương ứng với thời gian chờ socket của chúng tôi là 3 phút).

### Làm thế nào bạn bảo vệ chống lại backscatter {#how-do-you-protect-against-backscatter}

Các thư trả lại sai hướng hoặc thư rác trả lại (được gọi là "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") có thể gây ảnh hưởng tiêu cực đến uy tín địa chỉ IP người gửi.

Chúng tôi thực hiện hai bước để bảo vệ chống lại backscatter, được trình bày chi tiết trong các phần sau đây [Ngăn chặn thư trả lại từ các kẻ gửi MAIL FROM đã biết](#prevent-bounces-from-known-mail-from-spammers) và [Ngăn chặn thư trả lại không cần thiết để bảo vệ chống lại backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter).

### Ngăn chặn thư trả lại từ các kẻ gửi MAIL FROM đã biết {#prevent-bounces-from-known-mail-from-spammers}

Chúng tôi lấy danh sách từ [Backscatter.org](https://www.backscatterer.org/) (được hỗ trợ bởi [UCEPROTECT](https://www.uceprotect.net/)) tại <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> mỗi giờ và đưa vào cơ sở dữ liệu Redis của chúng tôi (chúng tôi cũng so sánh sự khác biệt trước; trong trường hợp có IP nào bị loại bỏ cần được tôn trọng).
Nếu MAIL FROM để trống HOẶC bằng (không phân biệt chữ hoa chữ thường) bất kỳ địa chỉ [postmaster](#what-are-postmaster-addresses) nào (phần trước dấu @ trong email), thì chúng tôi sẽ kiểm tra xem IP người gửi có khớp với một trong danh sách này không.

Nếu IP người gửi được liệt kê (và không nằm trong [danh sách cho phép](#do-you-have-an-allowlist) của chúng tôi), thì chúng tôi sẽ gửi lỗi 554 với thông báo `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`.  Chúng tôi sẽ được cảnh báo nếu một người gửi nằm trong cả danh sách Backscatterer và danh sách cho phép để có thể giải quyết vấn đề nếu cần thiết.

Các kỹ thuật được mô tả trong phần này tuân thủ khuyến nghị "SAFE MODE" tại <https://www.backscatterer.org/?target=usage> – nơi chúng tôi chỉ kiểm tra IP người gửi nếu một số điều kiện nhất định đã được đáp ứng.

### Ngăn chặn trả lại không cần thiết để bảo vệ chống lại backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Bounces là các email báo hiệu việc chuyển tiếp email hoàn toàn thất bại đến người nhận và email sẽ không được thử lại.

Một lý do phổ biến khiến bị liệt kê trong danh sách Backscatterer là do trả lại sai địa chỉ hoặc spam trả lại, vì vậy chúng ta phải bảo vệ chống lại điều này bằng một vài cách:

1. Chúng tôi chỉ gửi khi xảy ra lỗi mã trạng thái >= 500 (khi các email cố gắng chuyển tiếp đã thất bại, ví dụ Gmail trả về lỗi cấp 500).

2. Chúng tôi chỉ gửi một lần duy nhất (chúng tôi sử dụng một khóa dấu vân tay bounce được tính toán và lưu trong bộ nhớ đệm để ngăn gửi trùng lặp).  Dấu vân tay bounce là một khóa là dấu vân tay của tin nhắn kết hợp với một hàm băm của địa chỉ bounce và mã lỗi của nó).  Xem phần [Fingerprinting](#how-do-you-determine-an-email-fingerprint) để hiểu thêm về cách tính dấu vân tay tin nhắn.  Các dấu vân tay bounce gửi thành công sẽ hết hạn sau 7 ngày trong bộ nhớ đệm Redis của chúng tôi.

3. Chúng tôi chỉ gửi khi MAIL FROM và/hoặc From không để trống và không chứa (không phân biệt chữ hoa chữ thường) tên người dùng [postmaster](#what-are-postmaster-addresses) (phần trước dấu @ trong email).

4. Chúng tôi không gửi nếu tin nhắn gốc có bất kỳ header nào sau đây (không phân biệt chữ hoa chữ thường):

   * Header `auto-submitted` với giá trị khác `no`.
   * Header `x-auto-response-suppress` với giá trị `dr`, `autoreply`, `auto-reply`, `auto_reply`, hoặc `all`
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, hoặc `x-auto-respond` (bất kể giá trị).
   * Header `precedence` với giá trị `bulk`, `autoreply`, `auto-reply`, `auto_reply`, hoặc `list`.

5. Chúng tôi không gửi nếu địa chỉ email MAIL FROM hoặc From kết thúc bằng `+donotreply`, `-donotreply`, `+noreply`, hoặc `-noreply`.

6. Chúng tôi không gửi nếu phần tên người dùng của địa chỉ email From là `mdaemon` và có header `X-MDDSN-Message` không phân biệt chữ hoa chữ thường.

7. Chúng tôi không gửi nếu có header `content-type` không phân biệt chữ hoa chữ thường là `multipart/report`.

### Làm thế nào để xác định dấu vân tay email {#how-do-you-determine-an-email-fingerprint}

Dấu vân tay email được sử dụng để xác định tính duy nhất của một email và ngăn chặn việc gửi các tin nhắn trùng lặp và [trả lại trùng lặp](#prevent-unnecessary-bounces-to-protect-against-backscatter).

Dấu vân tay được tính toán từ danh sách sau:

* Tên máy chủ FQDN hoặc địa chỉ IP được client phân giải
* Giá trị header `Message-ID` (nếu có)
* Giá trị header `Date` (nếu có)
* Giá trị header `From` (nếu có)
* Giá trị header `To` (nếu có)
* Giá trị header `Cc` (nếu có)
* Giá trị header `Subject` (nếu có)
* Giá trị `Body` (nếu có)

### Tôi có thể chuyển tiếp email đến các cổng khác ngoài 25 (ví dụ nếu ISP của tôi đã chặn cổng 25) không {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Có, kể từ ngày 5 tháng 5 năm 2020 chúng tôi đã thêm tính năng này.  Hiện tại tính năng này áp dụng theo tên miền, không theo alias.  Nếu bạn cần tính năng theo alias, vui lòng liên hệ với chúng tôi để cho biết nhu cầu của bạn.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Bảo vệ quyền riêng tư nâng cao:
  </strong>
  <span>
    Nếu bạn đang sử dụng gói trả phí (có tính năng bảo vệ quyền riêng tư nâng cao), vui lòng truy cập <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a>, nhấp vào "Thiết lập" bên cạnh tên miền của bạn, sau đó nhấp vào "Cài đặt".  Nếu bạn muốn tìm hiểu thêm về các gói trả phí, xem trang <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Bảng giá</a> của chúng tôi.  Nếu không, bạn có thể tiếp tục theo các hướng dẫn bên dưới.
  </span>
</div>
Nếu bạn đang sử dụng gói miễn phí, thì chỉ cần thêm một bản ghi DNS <strong class="notranslate">TXT</strong> mới như hình dưới đây, nhưng thay đổi cổng từ 25 sang cổng bạn chọn.

Ví dụ, nếu tôi muốn tất cả email gửi đến `example.com` được chuyển tiếp đến cổng SMTP của người nhận bí danh là 1337 thay vì 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
    Kịch bản phổ biến nhất cho thiết lập chuyển tiếp cổng tùy chỉnh là khi bạn muốn chuyển tiếp tất cả email gửi đến example.com đến một cổng khác tại example.com, không phải cổng SMTP chuẩn là 25. Để thiết lập điều này, chỉ cần thêm bản ghi <strong class="notranslate">TXT</strong> catch-all sau.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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

### Có hỗ trợ ký hiệu cộng + cho bí danh Gmail không {#does-it-support-the-plus--symbol-for-gmail-aliases}

Có, hoàn toàn có.

### Có hỗ trợ các tên miền phụ không {#does-it-support-sub-domains}

Có, hoàn toàn có. Thay vì sử dụng "@", ".", hoặc để trống làm tên/máy chủ/bí danh, bạn chỉ cần sử dụng tên miền phụ làm giá trị thay thế.

Nếu bạn muốn `foo.example.com` chuyển tiếp email, thì nhập `foo` làm giá trị tên/máy chủ/bí danh trong cài đặt DNS của bạn (cho cả bản ghi MX và <strong class="notranslate">TXT</strong>).

### Điều này có chuyển tiếp các tiêu đề email của tôi không {#does-this-forward-my-emails-headers}

Có, hoàn toàn có.

### Điều này đã được kiểm tra kỹ chưa {#is-this-well-tested}

Có, nó có các bài kiểm tra được viết bằng [ava](https://github.com/avajs/ava) và cũng có độ bao phủ mã.

### Bạn có chuyển tiếp các thông điệp và mã phản hồi SMTP không {#do-you-pass-along-smtp-response-messages-and-codes}

Có, hoàn toàn có. Ví dụ nếu bạn gửi email đến `hello@example.com` và nó được đăng ký chuyển tiếp đến `user@gmail.com`, thì thông điệp và mã phản hồi SMTP từ máy chủ SMTP "gmail.com" sẽ được trả về thay vì máy chủ proxy tại "mx1.forwardemail.net" hoặc "mx2.forwardemail.net".

### Làm thế nào bạn ngăn chặn spammer và đảm bảo uy tín chuyển tiếp email tốt {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Xem các phần của chúng tôi về [Hệ thống chuyển tiếp email của bạn hoạt động như thế nào](#how-does-your-email-forwarding-system-work), [Bạn xử lý các vấn đề giao nhận email như thế nào](#how-do-you-handle-email-delivery-issues), và [Bạn xử lý khi địa chỉ IP của bạn bị chặn như thế nào](#how-do-you-handle-your-ip-addresses-becoming-blocked) ở trên.

### Làm thế nào bạn thực hiện tra cứu DNS trên tên miền {#how-do-you-perform-dns-lookups-on-domain-names}

Chúng tôi đã tạo một dự án phần mềm mã nguồn mở :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) và sử dụng nó để tra cứu DNS. Các máy chủ DNS mặc định được sử dụng là `1.1.1.1` và `1.0.0.1`, và các truy vấn DNS được thực hiện qua [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ở tầng ứng dụng.

:tangerine: [Tangerine](https://github.com/tangerine) sử dụng [dịch vụ DNS dành cho người dùng ưu tiên quyền riêng tư của CloudFlare theo mặc định][cloudflare-dns].


## Tài khoản và Thanh toán {#account-and-billing}

### Bạn có cung cấp đảm bảo hoàn tiền cho các gói trả phí không {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Có! Hoàn tiền tự động xảy ra khi bạn nâng cấp, hạ cấp hoặc hủy tài khoản trong vòng 30 ngày kể từ khi gói của bạn bắt đầu. Điều này chỉ áp dụng cho khách hàng lần đầu.
### Nếu tôi chuyển đổi gói, bạn có tính tỷ lệ và hoàn tiền phần chênh lệch không {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Chúng tôi không tính tỷ lệ hay hoàn tiền phần chênh lệch khi bạn chuyển đổi gói. Thay vào đó, chúng tôi sẽ chuyển đổi thời gian còn lại từ ngày hết hạn của gói hiện tại sang thời gian tương đối gần nhất cho gói mới của bạn (làm tròn xuống theo tháng).

Lưu ý rằng nếu bạn nâng cấp hoặc hạ cấp giữa các gói trả phí trong vòng 30 ngày kể từ khi bắt đầu gói trả phí đầu tiên, thì chúng tôi sẽ tự động hoàn tiền toàn bộ số tiền của gói hiện tại.

### Tôi có thể chỉ sử dụng dịch vụ chuyển tiếp email này như một máy chủ MX "dự phòng" hoặc "dự phòng chuyển tiếp" không {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Không, điều này không được khuyến nghị, vì bạn chỉ có thể sử dụng một máy chủ trao đổi thư tại một thời điểm. Các máy chủ dự phòng thường không được thử lại do cấu hình ưu tiên sai và các máy chủ thư không tôn trọng việc kiểm tra ưu tiên trao đổi MX.

### Tôi có thể tắt các bí danh cụ thể không {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Nếu bạn đang sử dụng gói trả phí, thì bạn phải vào <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Tài khoản của tôi <i class="fa fa-angle-right"></i> Tên miền</a> <i class="fa fa-angle-right"></i> Bí danh <i class="fa fa-angle-right"></i> Chỉnh sửa bí danh <i class="fa fa-angle-right"></i> Bỏ chọn hộp kiểm "Hoạt động" <i class="fa fa-angle-right"></i> Tiếp tục.
  </span>
</div>

Có, chỉ cần chỉnh sửa bản ghi DNS <strong class="notranslate">TXT</strong> của bạn và thêm tiền tố cho bí danh bằng một, hai hoặc ba dấu chấm than (xem bên dưới).

Lưu ý rằng bạn *nên* giữ nguyên dấu ":" trong ánh xạ, vì điều này cần thiết nếu bạn quyết định bật lại (và nó cũng được sử dụng để nhập nếu bạn nâng cấp lên một trong các gói trả phí của chúng tôi).

**Đối với từ chối im lặng (người gửi sẽ thấy như thể tin nhắn đã gửi thành công, nhưng thực tế không đi đâu) (mã trạng thái `250`):** Nếu bạn thêm tiền tố cho bí danh bằng "!" (một dấu chấm than) thì nó sẽ trả về mã trạng thái thành công `250` cho người gửi cố gắng gửi đến địa chỉ này, nhưng email sẽ không đi đâu (ví dụ như hố đen hoặc `/dev/null`).

**Đối với từ chối mềm (mã trạng thái `421`):** Nếu bạn thêm tiền tố cho bí danh bằng "!!" (hai dấu chấm than) thì nó sẽ trả về mã lỗi mềm `421` cho người gửi cố gắng gửi đến địa chỉ này, và email thường sẽ được thử lại trong tối đa 5 ngày trước khi bị từ chối và trả lại.

**Đối với từ chối cứng (mã trạng thái `550`):** Nếu bạn thêm tiền tố cho bí danh bằng "!!!" (ba dấu chấm than) thì nó sẽ trả về mã lỗi vĩnh viễn `550` cho người gửi cố gắng gửi đến địa chỉ này và email sẽ bị từ chối và trả lại.

Ví dụ, nếu tôi muốn tất cả email gửi đến `alias@example.com` ngừng chuyển tiếp đến `user@gmail.com` và bị từ chối và trả lại (ví dụ sử dụng ba dấu chấm than):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
    Bạn cũng có thể viết lại địa chỉ người nhận được chuyển tiếp thành "nobody@forwardemail.net", điều này sẽ chuyển hướng đến nobody như trong ví dụ dưới đây.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
    Nếu bạn muốn tăng cường bảo mật, bạn cũng có thể loại bỏ phần ":user@gmail.com" (hoặc ":nobody@forwardemail.net"), chỉ để lại "!!!alias" như trong ví dụ dưới đây.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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

Có, hoàn toàn có thể. Chỉ cần chỉ định nhiều người nhận trong các bản ghi <strong class="notranslate">TXT</strong> của bạn.

Ví dụ, nếu tôi muốn một email gửi đến `hello@example.com` được chuyển tiếp đến `user+a@gmail.com` và `user+b@gmail.com`, thì bản ghi <strong class="notranslate">TXT</strong> của tôi sẽ trông như sau:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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

Hoặc, bạn có thể chỉ định chúng trên hai dòng riêng biệt, như sau:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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

Tùy bạn quyết định!

### Tôi có thể có nhiều người nhận toàn cục bắt tất cả không {#can-i-have-multiple-global-catch-all-recipients}

Có, bạn có thể. Chỉ cần chỉ định nhiều người nhận toàn cục bắt tất cả trong các bản ghi <strong class="notranslate">TXT</strong> của bạn.

Ví dụ, nếu tôi muốn mọi email gửi đến `*@example.com` (dấu hoa thị có nghĩa là ký tự đại diện hay bắt tất cả) được chuyển tiếp đến `user+a@gmail.com` và `user+b@gmail.com`, thì bản ghi <strong class="notranslate">TXT</strong> của tôi sẽ trông như sau:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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

Hoặc, bạn có thể chỉ định chúng trên hai dòng riêng biệt, như sau:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Tên/Máy chủ/Bí danh</th>
      <th class="text-center">TTL</th>
      <th>Loại</th>
      <th>Trả lời/Giá trị</th>
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
Tùy bạn quyết định!

### Có giới hạn tối đa về số lượng địa chỉ email tôi có thể chuyển tiếp cho mỗi bí danh không {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Có, giới hạn mặc định là 10. Điều này KHÔNG có nghĩa là bạn chỉ có thể có 10 bí danh trên tên miền của mình. Bạn có thể có bao nhiêu bí danh tùy thích (không giới hạn). Nó có nghĩa là bạn chỉ có thể chuyển tiếp một bí danh đến 10 địa chỉ email duy nhất. Bạn có thể có `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (từ 1-10) – và bất kỳ email nào gửi đến `hello@example.com` sẽ được chuyển tiếp đến `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (từ 1-10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Mẹo:
  </strong>
  <span>
    Cần nhiều hơn 10 người nhận cho mỗi bí danh? Gửi email cho chúng tôi và chúng tôi sẽ vui lòng tăng giới hạn tài khoản của bạn.
  </span>
</div>

### Tôi có thể chuyển tiếp email đệ quy không {#can-i-recursively-forward-emails}

Có, bạn có thể, tuy nhiên bạn vẫn phải tuân thủ giới hạn tối đa. Nếu bạn có `hello:linus@example.com` và `linus:user@gmail.com`, thì email gửi đến `hello@example.com` sẽ được chuyển tiếp đến `linus@example.com` và `user@gmail.com`. Lưu ý rằng sẽ có lỗi xảy ra nếu bạn cố gắng chuyển tiếp email đệ quy vượt quá giới hạn tối đa.

### Người khác có thể hủy đăng ký hoặc đăng ký chuyển tiếp email của tôi mà không có sự cho phép không {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Chúng tôi sử dụng xác minh bản ghi MX và <strong class="notranslate">TXT</strong>, do đó nếu bạn thêm các bản ghi MX và <strong class="notranslate">TXT</strong> tương ứng của dịch vụ này, thì bạn đã đăng ký. Nếu bạn xóa chúng, thì bạn đã hủy đăng ký. Bạn sở hữu tên miền và quản lý DNS của mình, nên nếu ai đó có quyền truy cập vào đó thì đó là một vấn đề.

### Làm sao mà nó miễn phí {#how-is-it-free}

Forward Email cung cấp một gói miễn phí thông qua sự kết hợp giữa phát triển mã nguồn mở, hạ tầng hiệu quả và các gói trả phí tùy chọn hỗ trợ dịch vụ.

Gói miễn phí của chúng tôi được hỗ trợ bởi:

1. **Phát triển Mã Nguồn Mở**: Mã nguồn của chúng tôi là mã nguồn mở, cho phép cộng đồng đóng góp và vận hành minh bạch.

2. **Hạ tầng Hiệu quả**: Chúng tôi đã tối ưu hệ thống để xử lý chuyển tiếp email với tài nguyên tối thiểu.

3. **Gói Cao cấp Trả phí**: Người dùng cần các tính năng bổ sung như gửi SMTP, nhận IMAP hoặc tùy chọn bảo mật nâng cao sẽ đăng ký các gói trả phí.

4. **Giới hạn Sử dụng Hợp lý**: Gói miễn phí có chính sách sử dụng công bằng để ngăn chặn lạm dụng.

> \[!NOTE]
> Chúng tôi cam kết giữ chuyển tiếp email cơ bản miễn phí trong khi cung cấp các tính năng cao cấp cho người dùng có nhu cầu nâng cao hơn.

> \[!TIP]
> Nếu bạn thấy dịch vụ của chúng tôi có giá trị, hãy cân nhắc nâng cấp lên gói trả phí để hỗ trợ phát triển và bảo trì liên tục.

### Giới hạn kích thước email tối đa là bao nhiêu {#what-is-the-max-email-size-limit}

Chúng tôi mặc định giới hạn kích thước 50MB, bao gồm nội dung, tiêu đề và tệp đính kèm. Lưu ý rằng các dịch vụ như Gmail và Outlook chỉ cho phép giới hạn 25MB, và nếu bạn vượt quá giới hạn khi gửi đến các địa chỉ tại những nhà cung cấp đó, bạn sẽ nhận được thông báo lỗi.

Một lỗi với mã phản hồi thích hợp sẽ được trả về nếu vượt quá giới hạn kích thước tệp.

### Bạn có lưu trữ nhật ký email không {#do-you-store-logs-of-emails}

Không, chúng tôi không ghi vào đĩa hoặc lưu trữ nhật ký – ngoại trừ [lỗi](#do-you-store-error-logs) và [SMTP gửi đi](#do-you-support-sending-email-with-smtp) (xem [Chính sách Bảo mật](/privacy)).

Mọi thứ được xử lý trong bộ nhớ và [mã nguồn của chúng tôi có trên GitHub](https://github.com/forwardemail).

### Bạn có lưu trữ nhật ký lỗi không {#do-you-store-error-logs}

**Có. Bạn có thể truy cập nhật ký lỗi tại [Tài khoản của tôi → Nhật ký](/my-account/logs) hoặc [Tài khoản của tôi → Tên miền](/my-account/domains).**

Từ tháng 2 năm 2023, chúng tôi lưu trữ nhật ký lỗi cho các mã phản hồi SMTP `4xx` và `5xx` trong vòng 7 ngày – bao gồm lỗi SMTP, phong bì và tiêu đề email (chúng tôi **không** lưu trữ nội dung email hay tệp đính kèm).
Các nhật ký lỗi cho phép bạn kiểm tra các email quan trọng bị thiếu và giảm thiểu các trường hợp nhận diện nhầm spam cho [các tên miền của bạn](/my-account/domains). Chúng cũng là một nguồn tài nguyên tuyệt vời để gỡ lỗi các vấn đề với [webhook email](#do-you-support-webhooks) (vì nhật ký lỗi chứa phản hồi từ điểm cuối webhook).

Nhật ký lỗi cho [giới hạn tần suất] (#do-you-have-rate-limiting) và [danh sách xám] (#do-you-have-a-greylist) không thể truy cập được vì kết nối kết thúc sớm (ví dụ: trước khi các lệnh `RCPT TO` và `MAIL FROM` có thể được truyền).

Xem [Chính sách Bảo mật](/privacy) của chúng tôi để hiểu thêm.

### Bạn có đọc email của tôi không {#do-you-read-my-emails}

Không, tuyệt đối không. Xem [Chính sách Bảo mật](/privacy) của chúng tôi.

Nhiều dịch vụ chuyển tiếp email khác lưu trữ và có thể đọc email của bạn. Không có lý do gì để các email được chuyển tiếp phải được lưu trữ trên ổ đĩa – và vì vậy chúng tôi đã thiết kế giải pháp mã nguồn mở đầu tiên thực hiện tất cả trong bộ nhớ.

Chúng tôi tin rằng bạn nên có quyền riêng tư và chúng tôi tôn trọng nghiêm ngặt điều đó. Mã nguồn được triển khai trên máy chủ là [phần mềm mã nguồn mở trên GitHub](https://github.com/forwardemail) để minh bạch và xây dựng niềm tin.

### Tôi có thể "gửi thư như" trong Gmail với cái này không {#can-i-send-mail-as-in-gmail-with-this}

Có! Từ ngày 2 tháng 10 năm 2018, chúng tôi đã thêm tính năng này. Xem [Cách gửi thư như sử dụng Gmail](#how-to-send-mail-as-using-gmail) ở trên!

Bạn cũng nên thiết lập bản ghi SPF cho Gmail trong cấu hình DNS của bạn với bản ghi <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Nếu bạn đang sử dụng Gmail (ví dụ như Gửi thư như) hoặc G Suite, bạn cần thêm <code>include:_spf.google.com</code> vào bản ghi SPF <strong class="notranslate">TXT</strong> của bạn, ví dụ:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Tôi có thể "gửi thư như" trong Outlook với cái này không {#can-i-send-mail-as-in-outlook-with-this}

Có! Từ ngày 2 tháng 10 năm 2018, chúng tôi đã thêm tính năng này. Chỉ cần xem hai liên kết từ Microsoft dưới đây:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Bạn cũng nên thiết lập bản ghi SPF cho Outlook trong cấu hình DNS của bạn với bản ghi <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Quan trọng:
  </strong>
  <span>
    Nếu bạn đang sử dụng Microsoft Outlook hoặc Live.com, bạn cần thêm <code>include:spf.protection.outlook.com</code> vào bản ghi SPF <strong class="notranslate">TXT</strong> của bạn, ví dụ:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Tôi có thể "gửi thư như" trong Apple Mail và iCloud Mail với cái này không {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Nếu bạn là người đăng ký iCloud+, bạn có thể sử dụng tên miền tùy chỉnh. [Dịch vụ của chúng tôi cũng tương thích với Apple Mail](#apple-mail).

Vui lòng xem <https://support.apple.com/en-us/102540> để biết thêm thông tin.

### Tôi có thể chuyển tiếp email không giới hạn với cái này không {#can-i-forward-unlimited-emails-with-this}

Có, tuy nhiên các người gửi "tương đối chưa biết" bị giới hạn tần suất ở mức 100 kết nối mỗi giờ cho mỗi tên máy chủ hoặc IP. Xem phần về [Giới hạn tần suất](#do-you-have-rate-limiting) và [Danh sách xám](#do-you-have-a-greylist) ở trên.

Bằng "tương đối chưa biết", chúng tôi ám chỉ các người gửi không xuất hiện trong [danh sách cho phép](#do-you-have-an-allowlist).

Nếu vượt quá giới hạn này, chúng tôi sẽ gửi mã phản hồi 421, yêu cầu máy chủ gửi thư thử lại sau.

### Bạn có cung cấp tên miền không giới hạn với một mức giá không {#do-you-offer-unlimited-domains-for-one-price}

Có. Bất kể bạn đang sử dụng gói nào, bạn chỉ phải trả một mức phí hàng tháng – bao gồm tất cả các tên miền của bạn.
### Bạn chấp nhận những phương thức thanh toán nào {#which-payment-methods-do-you-accept}

Forward Email chấp nhận các phương thức thanh toán một lần hoặc hàng tháng/hàng quý/hàng năm sau:

1. **Thẻ tín dụng/thẻ ghi nợ/chuyển khoản ngân hàng**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, v.v.
2. **PayPal**: Kết nối tài khoản PayPal của bạn để thanh toán dễ dàng
3. **Tiền điện tử**: Chúng tôi chấp nhận thanh toán qua các khoản thanh toán stablecoin của Stripe trên các mạng Ethereum, Polygon và Solana

> \[!NOTE]
> Chúng tôi lưu trữ thông tin thanh toán giới hạn trên máy chủ của mình, chỉ bao gồm các định danh thanh toán và tham chiếu đến các giao dịch, khách hàng, đăng ký và ID thanh toán của [Stripe](https://stripe.com/global) và [PayPal](https://www.paypal.com).

> \[!TIP]
> Để bảo mật tối đa, hãy cân nhắc sử dụng thanh toán bằng tiền điện tử.

Tất cả các khoản thanh toán đều được xử lý an toàn qua Stripe hoặc PayPal. Thông tin thanh toán của bạn không bao giờ được lưu trữ trên máy chủ của chúng tôi.


## Tài nguyên bổ sung {#additional-resources}

> \[!TIP]
> Các bài viết dưới đây của chúng tôi được cập nhật thường xuyên với các hướng dẫn, mẹo và thông tin kỹ thuật mới. Hãy thường xuyên quay lại để xem nội dung mới nhất.

* [Nghiên cứu trường hợp & Tài liệu dành cho nhà phát triển](/blog/docs)
* [Tài nguyên](/resources)
* [Hướng dẫn](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
