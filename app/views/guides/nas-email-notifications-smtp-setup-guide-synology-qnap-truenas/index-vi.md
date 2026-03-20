# Hướng Dẫn Toàn Diện Cài Đặt Email NAS với Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Việc thiết lập thông báo email trên NAS của bạn không nên là một điều phiền toái. Dù bạn đang sử dụng Synology, QNAP, hay thậm chí là một thiết lập Raspberry Pi, hướng dẫn này sẽ giúp thiết bị của bạn kết nối với Forward Email để bạn thực sự biết khi có sự cố xảy ra.

Hầu hết các thiết bị NAS có thể gửi cảnh báo email về lỗi ổ đĩa, cảnh báo nhiệt độ, hoàn thành sao lưu và các sự kiện bảo mật. Vấn đề? Nhiều nhà cung cấp email đã trở nên khắt khe về bảo mật, và các thiết bị cũ thường không theo kịp. Đó là lý do Forward Email ra đời - chúng tôi hỗ trợ cả thiết bị hiện đại và thiết bị cũ.

Hướng dẫn này bao gồm cài đặt email cho hơn 75 nhà cung cấp NAS với các hướng dẫn từng bước, thông tin tương thích và mẹo khắc phục sự cố. Dù bạn đang dùng thiết bị nào, chúng tôi sẽ giúp thông báo của bạn hoạt động.


## Mục Lục {#table-of-contents}

* [Tại Sao Bạn Cần Thông Báo Email NAS](#why-you-need-nas-email-notifications)
* [Vấn Đề TLS (Và Cách Chúng Tôi Khắc Phục)](#the-tls-problem-and-how-we-fix-it)
* [Cài Đặt SMTP Forward Email](#forward-email-smtp-settings)
* [Bảng Tương Thích Toàn Diện Các Nhà Cung Cấp NAS](#comprehensive-nas-provider-compatibility-matrix)
* [Cấu Hình Email Synology NAS](#synology-nas-email-configuration)
  * [Các Bước Cấu Hình](#configuration-steps)
* [Cấu Hình Email QNAP NAS](#qnap-nas-email-configuration)
  * [Các Bước Cấu Hình](#configuration-steps-1)
  * [Các Vấn Đề Thường Gặp Khi Khắc Phục Sự Cố QNAP](#common-qnap-troubleshooting-issues)
* [Cấu Hình Legacy ReadyNAS](#readynas-legacy-configuration)
  * [Các Bước Cấu Hình Legacy](#legacy-configuration-steps)
  * [Khắc Phục Sự Cố ReadyNAS](#readynas-troubleshooting)
* [Cấu Hình TerraMaster NAS](#terramaster-nas-configuration)
* [Cấu Hình ASUSTOR NAS](#asustor-nas-configuration)
* [Cấu Hình Buffalo TeraStation](#buffalo-terastation-configuration)
* [Cấu Hình Western Digital My Cloud](#western-digital-my-cloud-configuration)
* [Cấu Hình Email TrueNAS](#truenas-email-configuration)
* [Cấu Hình OpenMediaVault](#openmediavault-configuration)
* [Cấu Hình Raspberry Pi NAS](#raspberry-pi-nas-configuration)
  * [Thiết Lập Raspberry Pi Ban Đầu](#initial-raspberry-pi-setup)
  * [Cấu Hình Chia Sẻ File Samba](#samba-file-sharing-configuration)
  * [Thiết Lập Máy Chủ FTP](#ftp-server-setup)
  * [Cấu Hình Thông Báo Email](#email-notification-configuration)
  * [Tính Năng Nâng Cao Raspberry Pi NAS](#advanced-raspberry-pi-nas-features)
  * [Khắc Phục Sự Cố Email Raspberry Pi](#raspberry-pi-email-troubleshooting)
  * [Tối Ưu Hiệu Suất](#performance-optimization)
  * [Các Lưu Ý Bảo Mật](#security-considerations)


## Tại Sao Bạn Cần Thông Báo Email NAS {#why-you-need-nas-email-notifications}

NAS của bạn giám sát rất nhiều thứ - sức khỏe ổ đĩa, nhiệt độ, sự cố mạng, các sự kiện bảo mật. Nếu không có cảnh báo email, các vấn đề có thể bị bỏ qua trong nhiều tuần, có thể gây mất dữ liệu hoặc vi phạm bảo mật.

Thông báo email giúp bạn nhận cảnh báo ngay lập tức khi ổ đĩa bắt đầu hỏng, cảnh báo về các cố gắng truy cập trái phép, xác nhận sao lưu thành công và giữ bạn luôn được cập nhật về tình trạng hệ thống. Forward Email đảm bảo những thông báo quan trọng này thực sự đến được với bạn.


## Vấn Đề TLS (Và Cách Chúng Tôi Khắc Phục) {#the-tls-problem-and-how-we-fix-it}

Vấn đề là: nếu NAS của bạn được sản xuất trước năm 2020, nó có thể chỉ hỗ trợ TLS 1.0. Gmail, Outlook và hầu hết các nhà cung cấp đã ngừng hỗ trợ TLS 1.0 từ nhiều năm trước. Thiết bị của bạn cố gắng gửi email, bị từ chối, và bạn không biết gì cả.

Forward Email khắc phục điều này với hỗ trợ cổng kép. Các thiết bị hiện đại sử dụng các cổng tiêu chuẩn của chúng tôi (`465` và `587`), trong khi các thiết bị cũ có thể dùng các cổng legacy (`2455` và `2555`) vẫn hỗ trợ TLS 1.0.

> \[!IMPORTANT]
> Forward Email hỗ trợ cả thiết bị NAS hiện đại và legacy thông qua chiến lược cổng kép của chúng tôi. Sử dụng cổng 465/587 cho thiết bị hiện đại hỗ trợ TLS 1.2+, và cổng 2455/2555 cho thiết bị legacy chỉ hỗ trợ TLS 1.0.


## Cài Đặt SMTP Forward Email {#forward-email-smtp-settings}
Đây là những gì bạn cần biết về thiết lập SMTP của chúng tôi:

**Đối với các thiết bị NAS hiện đại (2020+):** Sử dụng `smtp.forwardemail.net` với cổng `465` (SSL/TLS) hoặc cổng `587` (STARTTLS). Những cổng này hoạt động với firmware hiện tại hỗ trợ TLS 1.2+.

**Đối với các thiết bị NAS cũ hơn:** Sử dụng `smtp.forwardemail.net` với cổng `2455` (SSL/TLS) hoặc cổng `2555` (STARTTLS). Những cổng này hỗ trợ TLS 1.0 cho các thiết bị kế thừa.

**Xác thực:** Sử dụng bí danh Forward Email của bạn làm tên đăng nhập và mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) (không phải mật khẩu tài khoản của bạn).

> \[!CAUTION]
> Không bao giờ sử dụng mật khẩu đăng nhập tài khoản của bạn để xác thực SMTP. Luôn sử dụng mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) để cấu hình NAS.

> \[!TIP]
> Kiểm tra phiên bản firmware và hỗ trợ TLS của thiết bị NAS trước khi cấu hình. Hầu hết các thiết bị sản xuất sau năm 2020 đều hỗ trợ các giao thức TLS hiện đại, trong khi các thiết bị cũ thường yêu cầu các cổng tương thích kế thừa.


## Ma trận tương thích nhà cung cấp NAS toàn diện {#comprehensive-nas-provider-compatibility-matrix}

Ma trận sau cung cấp thông tin chi tiết về tương thích cho các nhà cung cấp NAS lớn, bao gồm mức độ hỗ trợ TLS, trạng thái firmware và các cài đặt cấu hình Forward Email được khuyến nghị.

| Nhà cung cấp NAS | Mẫu hiện tại  | Hỗ trợ TLS  | Trạng thái Firmware | Cổng được khuyến nghị | Vấn đề phổ biến                                                                                                                                       | Hướng dẫn cài đặt/Hình ảnh minh họa                                                                                                             |
| ---------------- | ------------- | ----------- | ------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Synology         | DSM 7.x       | TLS 1.2+    | Hoạt động           | `465`, `587`          | [Cấu hình STARTTLS](https://community.synology.com/enu/forum/2/post/124584)                                                                          | [Cài đặt Thông báo Email DSM](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                                 |
| QNAP             | QTS 5.x       | TLS 1.2+    | Hoạt động           | `465`, `587`          | [Lỗi Trung tâm Thông báo](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)    | [Cấu hình Máy chủ Email QTS](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html)      |
| Raspberry Pi     | Raspberry Pi OS | TLS 1.2+  | Hoạt động           | `465`, `587`          | [Vấn đề phân giải DNS](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                    | [Hướng dẫn Cài đặt Email Raspberry Pi](#raspberry-pi-nas-configuration)                                                                          |
| ASUSTOR          | ADM 4.x       | TLS 1.2+    | Hoạt động           | `465`, `587`          | [Xác thực chứng chỉ](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                          | [Cài đặt Thông báo ASUSTOR](https://www.asustor.com/en/online/online_help?id=8)                                                                 |
| TerraMaster      | TOS 6.x       | TLS 1.2     | Hoạt động           | `465`, `587`          | [Xác thực SMTP](https://www.terra-master.com/global/forum/)                                                                                          | [Cấu hình Email TerraMaster](https://www.terra-master.com/global/support/download.php)                                                           |
| TrueNAS          | SCALE/CORE    | TLS 1.2+    | Hoạt động           | `465`, `587`          | [Cài đặt chứng chỉ SSL](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                            | [Hướng dẫn Cài đặt Email TrueNAS](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)                 |
| Buffalo          | TeraStation   | TLS 1.2     | Giới hạn            | `465`, `587`          | [Tương thích firmware](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)           | [Cài đặt Email TeraStation](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital  | My Cloud OS 5 | TLS 1.2     | Giới hạn            | `465`, `587`          | [Tương thích hệ điều hành kế thừa](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                      | [Cấu hình Email My Cloud](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                           |
| OpenMediaVault   | OMV 7.x       | TLS 1.2+    | Hoạt động           | `465`, `587`          | [Phụ thuộc plugin](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                         | [Cài đặt Thông báo OMV](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                    |
| Netgear ReadyNAS | OS 6.x        | Chỉ TLS 1.0 | Ngừng hỗ trợ        | `2455`, `2555`        | [Hỗ trợ TLS kế thừa](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                         | [Cài đặt Cảnh báo Email ReadyNAS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)        |
| Drobo            | Dashboard     | TLS 1.2     | Ngừng hỗ trợ        | `465`, `587`          | [Hỗ trợ giới hạn](https://myprojects.drobo.com/support/)                                                                                            | [Thông báo Email Drobo](https://www.drobo.com/support/)                                                                                          |
Ma trận này cho thấy sự phân chia rõ ràng giữa các hệ thống NAS hiện đại, được duy trì tích cực và các thiết bị cũ cần xem xét đặc biệt về khả năng tương thích. Phần lớn các thiết bị NAS hiện nay hỗ trợ các tiêu chuẩn TLS hiện đại và có thể sử dụng các cổng SMTP chính của Forward Email mà không cần cấu hình đặc biệt.


## Cấu hình Email cho Synology NAS {#synology-nas-email-configuration}

Các thiết bị Synology với DSM khá dễ dàng để thiết lập. Chúng hỗ trợ TLS hiện đại, vì vậy bạn có thể sử dụng các cổng tiêu chuẩn của chúng tôi mà không gặp vấn đề gì.

> \[!NOTE]
> Synology DSM 7.x cung cấp các tính năng thông báo email toàn diện nhất. Các phiên bản DSM cũ hơn có thể có các tùy chọn cấu hình hạn chế.

### Các bước cấu hình {#configuration-steps}

1. **Truy cập giao diện web DSM** bằng cách nhập địa chỉ IP hoặc QuickConnect ID của thiết bị NAS vào trình duyệt web.

2. **Đi tới Bảng điều khiển (Control Panel)** và chọn phần "Notification", sau đó nhấp vào tab "Email" để truy cập các tùy chọn cấu hình email.

3. **Bật thông báo email** bằng cách đánh dấu vào ô "Enable email notifications".

4. **Cấu hình máy chủ SMTP** bằng cách nhập `smtp.forwardemail.net` làm địa chỉ máy chủ.

5. **Đặt cấu hình cổng** thành cổng 465 cho kết nối SSL/TLS (khuyến nghị). Cổng 587 với STARTTLS cũng được hỗ trợ như một lựa chọn thay thế.

6. **Cấu hình xác thực** bằng cách chọn "SMTP authentication required" và nhập bí danh Forward Email của bạn vào trường tên người dùng.

7. **Nhập mật khẩu của bạn** sử dụng mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

8. **Thiết lập địa chỉ người nhận** bằng cách nhập tối đa năm địa chỉ email sẽ nhận thông báo.

9. **Cấu hình lọc thông báo** để kiểm soát các sự kiện kích hoạt cảnh báo email, tránh quá tải thông báo đồng thời đảm bảo các sự kiện quan trọng được báo cáo.

10. **Kiểm tra cấu hình** bằng chức năng kiểm tra tích hợp của DSM để xác minh tất cả các thiết lập đúng và việc liên lạc với máy chủ Forward Email hoạt động tốt.

> \[!TIP]
> Synology cho phép các loại thông báo khác nhau cho các người nhận khác nhau, cung cấp sự linh hoạt trong cách phân phối cảnh báo trong nhóm của bạn.


## Cấu hình Email cho QNAP NAS {#qnap-nas-email-configuration}

Các thiết bị QNAP với QTS hoạt động rất tốt với Forward Email. Chúng hỗ trợ TLS hiện đại và có giao diện web đẹp để cấu hình.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 đã gặp sự cố với thông báo email mà đã được [khắc phục trong QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Hãy đảm bảo firmware của bạn được cập nhật để tránh lỗi thông báo.

### Các bước cấu hình {#configuration-steps-1}

1. **Truy cập giao diện web của thiết bị QNAP** bằng cách nhập địa chỉ IP của nó vào trình duyệt web.

2. **Đi tới Bảng điều khiển (Control Panel)** và chọn "Service Account and Device Pairing", sau đó nhấp vào phần "E-mail" để bắt đầu cấu hình email.

3. **Nhấp "Add SMTP Service"** để tạo cấu hình email mới.

4. **Cấu hình máy chủ SMTP** bằng cách nhập `smtp.forwardemail.net` làm địa chỉ máy chủ SMTP.

5. **Chọn giao thức bảo mật phù hợp** - chọn "SSL/TLS" với cổng `465` (khuyến nghị). Cổng `587` với STARTTLS cũng được hỗ trợ.

6. **Cấu hình số cổng** - cổng `465` với SSL/TLS được khuyến nghị. Cổng `587` với STARTTLS cũng có sẵn nếu cần.

7. **Nhập thông tin xác thực** sử dụng bí danh Forward Email của bạn làm tên người dùng và mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

8. **Cấu hình thông tin người gửi** bằng cách nhập tên mô tả cho trường "From", ví dụ như "QNAP NAS System" hoặc tên máy của thiết bị bạn.

9. **Thiết lập địa chỉ người nhận** cho các loại thông báo khác nhau. QNAP cho phép bạn cấu hình nhiều nhóm người nhận cho các loại cảnh báo khác nhau.

10. **Kiểm tra cấu hình** bằng chức năng kiểm tra email tích hợp của QNAP để xác minh tất cả các thiết lập hoạt động đúng.

> \[!TIP]
> Nếu bạn gặp phải [vấn đề cấu hình SMTP Gmail](https://forum.qnap.com/viewtopic.php?t=152466), các bước khắc phục tương tự cũng áp dụng cho Forward Email. Hãy đảm bảo xác thực được bật đúng cách và thông tin đăng nhập chính xác.
> \[!NOTE]
> Thiết bị QNAP hỗ trợ lập lịch thông báo nâng cao, cho phép bạn cấu hình giờ yên tĩnh khi các thông báo không quan trọng bị tắt. Điều này đặc biệt hữu ích trong môi trường doanh nghiệp.

### Các Vấn Đề Thường Gặp Khi Khắc Phục Sự Cố QNAP {#common-qnap-troubleshooting-issues}

Nếu thiết bị QNAP của bạn [không gửi được email thông báo](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), hãy kiểm tra các mục sau:

* Xác minh thông tin đăng nhập Forward Email của bạn chính xác
* Đảm bảo địa chỉ máy chủ SMTP chính xác là `smtp.forwardemail.net`
* Xác nhận cổng phù hợp với phương thức mã hóa của bạn (`465` cho SSL/TLS được khuyến nghị; `587` cho STARTTLS cũng được hỗ trợ)
* Kiểm tra rằng [cấu hình máy chủ SMTP](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) cho phép kết nối


## Cấu Hình ReadyNAS Cũ {#readynas-legacy-configuration}

Thiết bị Netgear ReadyNAS gặp những thách thức riêng do việc ngừng hỗ trợ firmware và phụ thuộc vào giao thức TLS 1.0 cũ. Tuy nhiên, hỗ trợ cổng cũ của Forward Email đảm bảo các thiết bị này vẫn có thể gửi thông báo email một cách đáng tin cậy.

> \[!CAUTION]
> ReadyNAS OS 6.x chỉ hỗ trợ TLS 1.0, yêu cầu sử dụng các cổng tương thích cũ của Forward Email là `2455` và `2555`. Các cổng hiện đại `465` và `587` sẽ không hoạt động với các thiết bị này.

### Các Bước Cấu Hình Cũ {#legacy-configuration-steps}

1. **Truy cập giao diện web ReadyNAS** bằng cách nhập địa chỉ IP của thiết bị vào trình duyệt web.

2. **Đi tới System > Settings > Alerts** để truy cập phần cấu hình email.

3. **Cấu hình máy chủ SMTP** bằng cách nhập `smtp.forwardemail.net` làm địa chỉ máy chủ.

4. **Đặt cấu hình cổng** thành `2455` cho kết nối SSL/TLS hoặc `2555` cho kết nối STARTTLS - đây là các cổng tương thích cũ của Forward Email.

5. **Bật xác thực** và nhập bí danh Forward Email của bạn làm tên đăng nhập cùng với mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Cấu hình thông tin người gửi** với địa chỉ "From" mô tả để nhận dạng thiết bị ReadyNAS.

7. **Thêm địa chỉ email người nhận** bằng cách sử dụng nút + trong phần danh bạ email.

8. **Kiểm tra cấu hình** để đảm bảo kết nối TLS cũ hoạt động đúng.

> \[!IMPORTANT]
> Thiết bị ReadyNAS yêu cầu các cổng cũ vì chúng không thể thiết lập kết nối bảo mật bằng các giao thức TLS hiện đại. Đây là một [hạn chế đã biết](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) của firmware đã ngừng hỗ trợ.

### Khắc Phục Sự Cố ReadyNAS {#readynas-troubleshooting}

Các vấn đề phổ biến với cấu hình email ReadyNAS bao gồm:

* **Không khớp phiên bản TLS**: Đảm bảo bạn sử dụng cổng `2455` hoặc `2555`, không phải các cổng hiện đại
* **Lỗi xác thực**: Xác minh thông tin đăng nhập Forward Email của bạn chính xác
* **Kết nối mạng**: Kiểm tra ReadyNAS có thể kết nối tới `smtp.forwardemail.net`
* **Hạn chế firmware**: Một số mẫu ReadyNAS cũ có thể yêu cầu thêm [cấu hình HTTPS](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

Thiết bị ReadyNAS chạy OS 6.x và các phiên bản cũ hơn chỉ hỗ trợ kết nối TLS 1.0, mà hầu hết nhà cung cấp email hiện đại không còn chấp nhận. Các cổng dành riêng cho legacy của Forward Email (2455 và 2555) hỗ trợ các giao thức cũ này, đảm bảo chức năng liên tục cho người dùng ReadyNAS.

Để cấu hình email trên thiết bị ReadyNAS, truy cập giao diện web của thiết bị qua địa chỉ IP. Điều hướng đến phần System và chọn "Notifications" để truy cập các tùy chọn cấu hình email.

Trong phần cấu hình email, bật thông báo email và nhập smtp.forwardemail.net làm máy chủ SMTP. Điều này rất quan trọng - sử dụng các cổng tương thích legacy của Forward Email thay vì các cổng SMTP tiêu chuẩn.

Đối với kết nối SSL/TLS, cấu hình cổng 2455 thay vì cổng tiêu chuẩn 465 (được khuyến nghị). Đối với kết nối STARTTLS, sử dụng cổng 2555 thay vì cổng 587. Các cổng đặc biệt này duy trì khả năng tương thích TLS 1.0 đồng thời cung cấp bảo mật tốt nhất có thể cho các thiết bị legacy.
Nhập bí danh Forward Email của bạn làm tên đăng nhập và mật khẩu đã tạo để xác thực. Thiết bị ReadyNAS hỗ trợ xác thực SMTP, điều này là bắt buộc cho các kết nối Forward Email.

Cấu hình địa chỉ email người gửi và các địa chỉ người nhận theo yêu cầu thông báo của bạn. ReadyNAS cho phép nhiều địa chỉ người nhận, giúp bạn phân phối cảnh báo đến các thành viên nhóm hoặc tài khoản email khác nhau.

Kiểm tra cấu hình cẩn thận, vì thiết bị ReadyNAS có thể không cung cấp thông báo lỗi chi tiết nếu cấu hình thất bại. Nếu việc kiểm tra tiêu chuẩn không hoạt động, hãy xác minh rằng bạn đang sử dụng các cổng kế thừa đúng (2455 hoặc 2555) thay vì các cổng SMTP hiện đại.

Hãy cân nhắc các tác động về bảo mật khi sử dụng các giao thức TLS kế thừa. Mặc dù các cổng kế thừa của Forward Email cung cấp bảo mật tốt nhất có thể cho các thiết bị cũ, nhưng nên nâng cấp lên hệ thống NAS hiện đại với hỗ trợ TLS mới nhất khi có thể.


## Cấu hình TerraMaster NAS {#terramaster-nas-configuration}

Thiết bị TerraMaster chạy TOS 6.x hỗ trợ TLS hiện đại và hoạt động tốt với các cổng tiêu chuẩn của Forward Email.

> \[!NOTE]
> TerraMaster TOS 6.x cung cấp các tính năng thông báo email toàn diện. Hãy đảm bảo firmware của bạn được cập nhật để có khả năng tương thích tốt nhất.

1. **Truy cập Cài đặt Hệ thống**
   * Đăng nhập vào giao diện web TerraMaster của bạn
   * Điều hướng đến **Control Panel** > **Notification**

2. **Cấu hình SMTP**
   * Máy chủ: `smtp.forwardemail.net`
   * Cổng: `465` (SSL/TLS, khuyến nghị) hoặc `587` (STARTTLS)
   * Tên đăng nhập: Bí danh Forward Email của bạn
   * Mật khẩu: Mật khẩu đã tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Bật Thông báo**
   * Chọn các loại thông báo bạn muốn nhận
   * Kiểm tra cấu hình bằng chức năng kiểm tra tích hợp sẵn

> \[!TIP]
> Thiết bị TerraMaster hoạt động tốt nhất với cổng `465` cho kết nối SSL/TLS (khuyến nghị). Nếu gặp sự cố, cổng `587` với STARTTLS cũng được hỗ trợ.


## Cấu hình ASUSTOR NAS {#asustor-nas-configuration}

Thiết bị ASUSTOR với ADM 4.x có hỗ trợ thông báo email vững chắc và hoạt động liền mạch với Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x bao gồm các tùy chọn lọc thông báo nâng cao. Bạn có thể tùy chỉnh các sự kiện kích hoạt cảnh báo email.

1. **Mở Cài đặt Thông báo**
   * Truy cập giao diện web ADM
   * Vào **Settings** > **Notification**

2. **Thiết lập cấu hình SMTP**
   * Máy chủ SMTP: `smtp.forwardemail.net`
   * Cổng: `465` (SSL/TLS, khuyến nghị) hoặc `587` (STARTTLS)
   * Xác thực: Bật
   * Tên đăng nhập: Bí danh Forward Email của bạn
   * Mật khẩu: Mật khẩu đã tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Cấu hình loại cảnh báo**
   * Chọn các sự kiện hệ thống sẽ kích hoạt email
   * Thiết lập địa chỉ người nhận
   * Kiểm tra cấu hình

> \[!IMPORTANT]
> Thiết bị ASUSTOR yêu cầu xác thực phải được bật rõ ràng trong cài đặt SMTP. Đừng quên đánh dấu tùy chọn này.


## Cấu hình Buffalo TeraStation {#buffalo-terastation-configuration}

Thiết bị Buffalo TeraStation có khả năng thông báo email hạn chế nhưng vẫn hoạt động. Việc thiết lập khá đơn giản khi bạn biết nơi cần tìm.

> \[!CAUTION]
> Các bản cập nhật firmware Buffalo TeraStation không thường xuyên. Hãy đảm bảo bạn đang sử dụng firmware mới nhất cho mẫu của mình trước khi cấu hình email.

1. **Truy cập cấu hình web**
   * Kết nối với giao diện web của TeraStation
   * Điều hướng đến **System** > **Notification**

2. **Cấu hình Email**
   * Máy chủ SMTP: `smtp.forwardemail.net`
   * Cổng: `465` (SSL/TLS, khuyến nghị) hoặc `587` (STARTTLS)
   * Tên đăng nhập: Bí danh Forward Email của bạn
   * Mật khẩu: Mật khẩu đã tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Bật mã hóa SSL/TLS

3. **Thiết lập tùy chọn thông báo**
   * Chọn các sự kiện kích hoạt email (lỗi ổ đĩa, cảnh báo nhiệt độ, v.v.)
   * Nhập địa chỉ email người nhận
   * Lưu và kiểm tra cấu hình

> \[!NOTE]
> Một số mẫu TeraStation cũ có thể có tùy chọn cấu hình SMTP hạn chế. Kiểm tra tài liệu của mẫu bạn để biết khả năng cụ thể.
## Cấu Hình Western Digital My Cloud {#western-digital-my-cloud-configuration}

Các thiết bị Western Digital My Cloud chạy OS 5 hỗ trợ thông báo qua email, mặc dù giao diện có thể hơi ẩn trong phần cài đặt.

> \[!WARNING]
> Western Digital đã ngừng hỗ trợ nhiều mẫu My Cloud. Hãy kiểm tra xem thiết bị của bạn còn nhận được cập nhật firmware trước khi dựa vào thông báo email cho các cảnh báo quan trọng.

1. **Đi tới Cài Đặt**
   * Mở bảng điều khiển web My Cloud
   * Vào **Settings** > **General** > **Notifications**

2. **Cấu Hình Chi Tiết SMTP**
   * Máy chủ thư: `smtp.forwardemail.net`
   * Cổng: `465` (SSL/TLS, khuyến nghị) hoặc `587` (STARTTLS)
   * Tên đăng nhập: Bí danh Forward Email của bạn
   * Mật khẩu: Mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Bật mã hóa

3. **Thiết Lập Loại Cảnh Báo**
   * Chọn các loại thông báo (cảnh báo hệ thống, sức khỏe ổ đĩa, v.v.)
   * Thêm địa chỉ email người nhận
   * Kiểm tra cấu hình email

> \[!TIP]
> Chúng tôi khuyên dùng cổng `465` với SSL/TLS. Nếu gặp sự cố, cổng `587` với STARTTLS cũng được hỗ trợ.


## Cấu Hình Email TrueNAS {#truenas-email-configuration}

TrueNAS (cả SCALE và CORE) có hỗ trợ thông báo email xuất sắc với các tùy chọn cấu hình chi tiết.

> \[!NOTE]
> TrueNAS cung cấp một trong những tính năng thông báo email toàn diện nhất trong các hệ thống NAS. Bạn có thể cấu hình các quy tắc cảnh báo chi tiết và nhiều người nhận.

1. **Truy Cập Cài Đặt Hệ Thống**
   * Đăng nhập vào giao diện web TrueNAS
   * Điều hướng tới **System** > **Email**

2. **Cấu Hình SMTP**
   * Máy chủ thư đi: `smtp.forwardemail.net`
   * Cổng máy chủ thư: `465` (khuyến nghị) hoặc `587`
   * Bảo mật: SSL/TLS (cho 465, khuyến nghị) hoặc STARTTLS (cho 587)
   * Tên đăng nhập: Bí danh Forward Email của bạn
   * Mật khẩu: Mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Thiết Lập Cảnh Báo**
   * Vào **System** > **Alert Services**
   * Cấu hình các cảnh báo sẽ được gửi qua email
   * Đặt địa chỉ người nhận và mức cảnh báo
   * Kiểm tra cấu hình bằng chức năng kiểm tra tích hợp

> \[!IMPORTANT]
> TrueNAS cho phép bạn cấu hình các mức cảnh báo khác nhau (INFO, NOTICE, WARNING, ERROR, CRITICAL). Chọn mức phù hợp để tránh spam email đồng thời đảm bảo các vấn đề quan trọng được báo cáo.


## Cấu Hình OpenMediaVault {#openmediavault-configuration}

OpenMediaVault cung cấp khả năng thông báo email vững chắc qua giao diện web của nó. Quá trình thiết lập rõ ràng và đơn giản.

> \[!NOTE]
> Hệ thống thông báo của OpenMediaVault dựa trên plugin. Hãy đảm bảo bạn đã cài đặt và kích hoạt plugin thông báo email.

1. **Truy Cập Cài Đặt Thông Báo**
   * Mở giao diện web OpenMediaVault
   * Vào **System** > **Notification** > **Email**

2. **Cấu Hình Tham Số SMTP**
   * Máy chủ SMTP: `smtp.forwardemail.net`
   * Cổng: `465` (SSL/TLS, khuyến nghị) hoặc `587` (STARTTLS)
   * Tên đăng nhập: Bí danh Forward Email của bạn
   * Mật khẩu: Mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Bật SSL/TLS

3. **Thiết Lập Quy Tắc Thông Báo**
   * Điều hướng tới **System** > **Notification** > **Notifications**
   * Cấu hình các sự kiện hệ thống sẽ kích hoạt email
   * Đặt địa chỉ người nhận
   * Kiểm tra chức năng email

> \[!TIP]
> OpenMediaVault cho phép bạn cấu hình lịch trình thông báo. Bạn có thể đặt giờ yên tĩnh hoặc giới hạn tần suất thông báo để tránh bị quá tải bởi các cảnh báo.


## Cấu Hình Raspberry Pi NAS {#raspberry-pi-nas-configuration}

Raspberry Pi là một điểm khởi đầu tuyệt vời cho chức năng NAS, cung cấp giải pháp tiết kiệm chi phí cho môi trường gia đình và văn phòng nhỏ. Việc thiết lập Raspberry Pi làm thiết bị NAS bao gồm cấu hình các giao thức chia sẻ tệp, thông báo email và các dịch vụ mạng thiết yếu.

> \[!TIP]
> Đối với những người yêu thích Raspberry Pi, chúng tôi rất khuyến khích bổ sung thiết lập NAS của bạn với [PiKVM](https://pikvm.org/) để quản lý máy chủ từ xa và [Pi-hole](https://pi-hole.net/) để chặn quảng cáo toàn mạng và quản lý DNS. Những công cụ này tạo nên một môi trường phòng thí nghiệm tại nhà toàn diện.
### Thiết Lập Ban Đầu Raspberry Pi {#initial-raspberry-pi-setup}

Trước khi cấu hình các dịch vụ NAS, hãy đảm bảo Raspberry Pi của bạn đang chạy phiên bản Raspberry Pi OS mới nhất và có dung lượng lưu trữ đủ. Một thẻ microSD chất lượng cao (Class 10 hoặc tốt hơn) hoặc ổ SSD USB 3.0 sẽ cung cấp hiệu suất và độ tin cậy tốt hơn cho các hoạt động NAS.

1. **Cập nhật hệ thống** bằng cách chạy `sudo apt update && sudo apt upgrade -y` để đảm bảo tất cả các gói phần mềm đều mới nhất.

2. **Kích hoạt truy cập SSH** sử dụng `sudo systemctl enable ssh && sudo systemctl start ssh` để quản trị từ xa.

3. **Cấu hình địa chỉ IP tĩnh** bằng cách chỉnh sửa `/etc/dhcpcd.conf` để đảm bảo truy cập mạng ổn định.

4. **Thiết lập lưu trữ ngoài** bằng cách kết nối và gắn kết các ổ USB hoặc cấu hình các mảng RAID để dự phòng dữ liệu.

### Cấu Hình Chia Sẻ Tệp Samba {#samba-file-sharing-configuration}

Samba cung cấp chia sẻ tệp tương thích với Windows, giúp Raspberry Pi của bạn có thể truy cập từ bất kỳ thiết bị nào trong mạng. Quá trình cấu hình bao gồm cài đặt Samba, tạo các thư mục chia sẻ và thiết lập xác thực người dùng.

Cài đặt Samba bằng lệnh `sudo apt install samba samba-common-bin` và cấu hình tệp chính tại `/etc/samba/smb.conf`. Tạo các thư mục chia sẻ và đặt quyền phù hợp bằng lệnh `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Cấu hình các chia sẻ Samba bằng cách thêm các phần vào tệp cấu hình cho từng thư mục chia sẻ. Thiết lập xác thực người dùng bằng lệnh `sudo smbpasswd -a username` để tạo mật khẩu riêng cho Samba phục vụ truy cập mạng.

> \[!IMPORTANT]
> Luôn sử dụng mật khẩu mạnh cho người dùng Samba và cân nhắc chỉ bật truy cập khách cho các thư mục chia sẻ không nhạy cảm. Xem lại [tài liệu chính thức của Samba](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) để biết các cấu hình bảo mật nâng cao.

### Thiết Lập Máy Chủ FTP {#ftp-server-setup}

FTP cung cấp một phương thức truy cập tệp khác, đặc biệt hữu ích cho sao lưu tự động và quản lý tệp từ xa. Cài đặt và cấu hình vsftpd (Very Secure FTP Daemon) để có dịch vụ FTP đáng tin cậy.

Cài đặt vsftpd bằng lệnh `sudo apt install vsftpd` và cấu hình dịch vụ bằng cách chỉnh sửa `/etc/vsftpd.conf`. Kích hoạt truy cập người dùng cục bộ, cấu hình chế độ thụ động và thiết lập các hạn chế bảo mật phù hợp.

Tạo người dùng FTP và cấu hình quyền truy cập thư mục. Cân nhắc sử dụng SFTP (SSH File Transfer Protocol) thay vì FTP truyền thống để tăng cường bảo mật, vì nó mã hóa toàn bộ dữ liệu truyền tải.

> \[!CAUTION]
> FTP truyền mật khẩu dưới dạng văn bản thuần túy. Luôn sử dụng SFTP hoặc cấu hình FTP với mã hóa TLS để truyền tệp an toàn. Xem lại [các thực hành bảo mật tốt nhất của vsftpd](https://security.appspot.com/vsftpd.html) trước khi triển khai.

### Cấu Hình Thông Báo Email {#email-notification-configuration}

Cấu hình NAS Raspberry Pi của bạn để gửi thông báo email cho các sự kiện hệ thống, cảnh báo lưu trữ và trạng thái hoàn thành sao lưu. Việc này bao gồm cài đặt và cấu hình một trình chuyển thư và thiết lập tích hợp Forward Email.

Cài đặt `msmtp` như một client SMTP nhẹ bằng lệnh `sudo apt install msmtp msmtp-mta`. Tạo tệp cấu hình tại `/etc/msmtprc` với các thiết lập sau:

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

Cấu hình thông báo hệ thống bằng cách thiết lập các công việc cron và các script giám sát hệ thống sử dụng `msmtp` để gửi cảnh báo. Tạo các script giám sát dung lượng đĩa, cảnh báo nhiệt độ và thông báo hoàn thành sao lưu.

### Các Tính Năng Nâng Cao Cho Raspberry Pi NAS {#advanced-raspberry-pi-nas-features}

Nâng cao NAS Raspberry Pi của bạn với các dịch vụ bổ sung và khả năng giám sát. Cài đặt và cấu hình các công cụ giám sát mạng, giải pháp sao lưu tự động và dịch vụ truy cập từ xa.

Thiết lập [Nextcloud](https://nextcloud.com/) để có chức năng giống đám mây với truy cập tệp qua web, đồng bộ lịch và các tính năng cộng tác. Cài đặt bằng Docker hoặc theo hướng dẫn cài đặt chính thức của Nextcloud cho Raspberry Pi.
Cấu hình sao lưu tự động sử dụng `rsync` và `cron` để tạo các bản sao lưu theo lịch cho dữ liệu quan trọng. Thiết lập thông báo qua email khi hoàn thành sao lưu và cảnh báo lỗi sử dụng cấu hình Forward Email của bạn.

Triển khai giám sát mạng sử dụng các công cụ như [Nagios](https://www.nagios.org/) hoặc [Zabbix](https://www.zabbix.com/) để theo dõi tình trạng hệ thống, kết nối mạng và khả năng sẵn sàng của dịch vụ.

> \[!NOTE]
> Đối với người dùng quản lý hạ tầng mạng, hãy cân nhắc tích hợp [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) với thiết lập PiKVM của bạn để điều khiển công tắc vật lý từ xa. Hướng dẫn tích hợp [Python này](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) cung cấp chỉ dẫn chi tiết để tự động hóa quản lý thiết bị vật lý.

### Khắc phục sự cố email Raspberry Pi {#raspberry-pi-email-troubleshooting}

Các vấn đề phổ biến với cấu hình email trên Raspberry Pi bao gồm sự cố phân giải DNS, hạn chế tường lửa và lỗi xác thực. Tính nhẹ của hệ thống Raspberry Pi đôi khi gây ra các vấn đề về thời gian kết nối SMTP.

Nếu thông báo email không gửi được, kiểm tra file nhật ký `msmtp` tại `/var/log/msmtp.log` để xem các thông báo lỗi chi tiết. Xác nhận rằng thông tin đăng nhập Forward Email của bạn chính xác và Raspberry Pi có thể phân giải `smtp.forwardemail.net`.

Kiểm tra chức năng email bằng dòng lệnh: `echo "Test message" | msmtp recipient@example.com`. Điều này giúp tách biệt các vấn đề cấu hình khỏi các lỗi riêng của ứng dụng.

Cấu hình đúng các thiết lập DNS trong `/etc/resolv.conf` nếu bạn gặp sự cố phân giải DNS. Hãy cân nhắc sử dụng các máy chủ DNS công cộng như `8.8.8.8` hoặc `1.1.1.1` nếu DNS nội bộ không ổn định.

### Tối ưu hiệu suất {#performance-optimization}

Tối ưu hiệu suất NAS Raspberry Pi của bạn thông qua cấu hình đúng thiết bị lưu trữ, cài đặt mạng và tài nguyên hệ thống. Sử dụng thiết bị lưu trữ chất lượng cao và cấu hình các tùy chọn hệ thống tập tin phù hợp với mục đích sử dụng.

Kích hoạt khởi động USB 3.0 để cải thiện hiệu suất lưu trữ nếu sử dụng ổ đĩa ngoài. Cấu hình phân bổ bộ nhớ GPU bằng `sudo raspi-config` để cấp nhiều RAM hơn cho hoạt động hệ thống thay vì xử lý đồ họa.

Giám sát hiệu suất hệ thống bằng các công cụ như `htop`, `iotop`, và `nethogs` để xác định điểm nghẽn và tối ưu hóa sử dụng tài nguyên. Cân nhắc nâng cấp lên Raspberry Pi 4 với 8GB RAM cho các ứng dụng NAS đòi hỏi cao.

Triển khai các giải pháp làm mát phù hợp để tránh hiện tượng giảm hiệu suất do nhiệt trong quá trình hoạt động nặng. Giám sát nhiệt độ CPU bằng lệnh `/opt/vc/bin/vcgencmd measure_temp` và đảm bảo thông gió đầy đủ.

### Các cân nhắc về bảo mật {#security-considerations}

Bảo mật NAS Raspberry Pi của bạn bằng cách triển khai các kiểm soát truy cập phù hợp, các biện pháp bảo mật mạng và cập nhật bảo mật định kỳ. Thay đổi mật khẩu mặc định, vô hiệu hóa các dịch vụ không cần thiết và cấu hình các quy tắc tường lửa.

Cài đặt và cấu hình `fail2ban` để bảo vệ chống lại các cuộc tấn công brute force trên SSH và các dịch vụ khác. Thiết lập cập nhật bảo mật tự động sử dụng `unattended-upgrades` để đảm bảo các bản vá bảo mật quan trọng được áp dụng kịp thời.

Cấu hình phân đoạn mạng để cô lập NAS của bạn khỏi các thiết bị mạng khác khi có thể. Sử dụng truy cập VPN cho kết nối từ xa thay vì mở trực tiếp dịch vụ ra internet.

Sao lưu định kỳ cấu hình và dữ liệu Raspberry Pi để tránh mất dữ liệu do lỗi phần cứng hoặc sự cố bảo mật. Thử nghiệm quy trình phục hồi sao lưu để đảm bảo khả năng khôi phục dữ liệu.

Cấu hình NAS Raspberry Pi cung cấp nền tảng tuyệt vời để học các khái niệm lưu trữ mạng đồng thời mang lại chức năng thực tiễn cho môi trường gia đình và văn phòng nhỏ. Sự kết hợp với Forward Email đảm bảo việc gửi thông báo đáng tin cậy cho việc giám sát hệ thống và cảnh báo bảo trì.
