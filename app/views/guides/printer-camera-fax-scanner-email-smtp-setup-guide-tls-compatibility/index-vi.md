# Hướng Dẫn Toàn Diện Cài Đặt Email Cho Máy In, Camera, Fax & Máy Quét {#complete-guide-to-printer-camera-fax--scanner-email-setup}

Thiết bị văn phòng của bạn cần gửi email - máy in cảnh báo mức mực, camera IP thông báo phát hiện chuyển động, máy fax báo cáo trạng thái truyền, và máy quét xác nhận xử lý tài liệu. Vấn đề? Hầu hết nhà cung cấp email đã ngừng hỗ trợ các thiết bị cũ, khiến thiết bị của bạn không thể gửi thông báo.

[Microsoft Office 365 đã ngừng hỗ trợ TLS 1.0 và TLS 1.1 từ tháng 1 năm 2022](https://learn.microsoft.com/en-us/troubleshoot/exchange/email-delivery/fix-issues-with-printers-scanners-and-lob-applications-that-send-email-using-off), làm gián đoạn email cho hàng ngàn thiết bị. Nhiều máy in, camera và máy fax sản xuất trước năm 2020 chỉ hỗ trợ các giao thức cũ này và không thể cập nhật.

Forward Email khắc phục điều này bằng cách hỗ trợ cả thiết bị hiện đại và thiết bị cũ. Chúng tôi có các cổng riêng dành cho thiết bị hiện tại và các cổng đặc biệt dành cho thiết bị cũ không thể nâng cấp.

> \[!IMPORTANT]
> Forward Email hỗ trợ cả thiết bị hiện đại và thiết bị cũ thông qua chiến lược hai cổng của chúng tôi. Sử dụng cổng `465` (SSL/TLS, khuyến nghị) hoặc `587` (STARTTLS) cho thiết bị hiện đại hỗ trợ TLS 1.2+, và các cổng `2455`/`2555` cho thiết bị cũ chỉ hỗ trợ TLS 1.0.


## Mục Lục {#table-of-contents}

* [Giải Thích Vấn Đề TLS](#the-tls-problem-explained)
* [Tổng Quan Cấu Hình SMTP Forward Email](#forward-email-smtp-configuration-overview)
* [Bảng Tương Thích Thiết Bị Toàn Diện](#comprehensive-device-compatibility-matrix)
* [Cấu Hình Email Máy In HP](#hp-printer-email-configuration)
  * [Máy In HP Hiện Đại (2020 và Sau)](#modern-hp-printers-2020-and-later)
  * [Máy In HP Cũ (Mẫu Trước 2020)](#legacy-hp-printers-pre-2020-models)
* [Cấu Hình Email Máy In Canon](#canon-printer-email-configuration)
  * [Máy In Canon Hiện Tại](#current-canon-printers)
  * [Máy In Canon Cũ](#legacy-canon-printers)
* [Cấu Hình Email Máy In Brother](#brother-printer-email-configuration)
  * [Cấu Hình Dòng Brother MFC](#brother-mfc-series-configuration)
  * [Khắc Phục Sự Cố Email Brother](#troubleshooting-brother-email-issues)
* [Cấu Hình Email Camera IP Foscam](#foscam-ip-camera-email-configuration)
  * [Hiểu Về Giới Hạn Email Foscam](#understanding-foscam-email-limitations)
  * [Các Bước Cấu Hình Email Foscam](#foscam-email-configuration-steps)
  * [Cấu Hình Nâng Cao Foscam](#advanced-foscam-configuration)
* [Cấu Hình Email Camera An Ninh Hikvision](#hikvision-security-camera-email-configuration)
  * [Cấu Hình Camera Hikvision Hiện Đại](#modern-hikvision-camera-configuration)
  * [Cấu Hình Camera Hikvision Cũ](#legacy-hikvision-camera-configuration)
* [Cấu Hình Email Camera An Ninh Dahua](#dahua-security-camera-email-configuration)
  * [Cài Đặt Email Camera Dahua](#dahua-camera-email-setup)
  * [Cấu Hình Email NVR Dahua](#dahua-nvr-email-configuration)
* [Cấu Hình Email Thiết Bị Đa Chức Năng Xerox](#xerox-multifunction-device-email-configuration)
  * [Cài Đặt Email MFD Xerox](#xerox-mfd-email-setup)
* [Cấu Hình Email Thiết Bị Đa Chức Năng Ricoh](#ricoh-multifunction-device-email-configuration)
  * [Cấu Hình MFD Ricoh Hiện Đại](#modern-ricoh-mfd-configuration)
  * [Cấu Hình Thiết Bị Ricoh Cũ](#legacy-ricoh-device-configuration)
* [Khắc Phục Sự Cố Cấu Hình Thường Gặp](#troubleshooting-common-configuration-issues)
  * [Vấn Đề Xác Thực và Thông Tin Đăng Nhập](#authentication-and-credential-issues)
  * [Vấn Đề TLS và Mã Hóa](#tls-and-encryption-problems)
  * [Vấn Đề Kết Nối Mạng](#network-connectivity-issues)
  * [Thách Thức Cấu Hình Riêng Cho Thiết Bị](#device-specific-configuration-challenges)
* [Các Lưu Ý Bảo Mật và Thực Tiễn Tốt Nhất](#security-considerations-and-best-practices)
  * [Quản Lý Thông Tin Đăng Nhập](#credential-management)
  * [Bảo Mật Mạng](#network-security)
  * [Tiết Lộ Thông Tin](#information-disclosure)
  * [Giám Sát và Bảo Trì](#monitoring-and-maintenance)
* [Kết Luận](#conclusion)
## Vấn Đề TLS Được Giải Thích {#the-tls-problem-explained}

Chuyện đã xảy ra như sau: bảo mật email trở nên nghiêm ngặt hơn, nhưng thiết bị của bạn thì không nhận được thông báo. Thiết bị hiện đại hỗ trợ TLS 1.2+, nhưng các thiết bị cũ vẫn chỉ dùng TLS 1.0. Hầu hết nhà cung cấp email đã ngừng hỗ trợ TLS 1.0, nên thiết bị của bạn không thể kết nối được.

Điều này ảnh hưởng đến hoạt động thực tế - camera an ninh không thể gửi cảnh báo khi có sự cố, máy in không thể cảnh báo về vấn đề bảo trì, và các xác nhận fax bị thất lạc. Cấu hình [máy chủ SMTP của Forward Email](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) cung cấp nhiều cổng để giữ mọi thứ hoạt động.

> \[!TIP]
> Kiểm tra phiên bản firmware và hỗ trợ TLS của thiết bị trước khi cấu hình. Hầu hết thiết bị sản xuất sau năm 2020 đều hỗ trợ các giao thức TLS hiện đại, trong khi các thiết bị cũ thường cần các cổng tương thích với giao thức cũ.


## Tổng Quan Cấu Hình SMTP Forward Email {#forward-email-smtp-configuration-overview}

Forward Email cung cấp dịch vụ SMTP toàn diện được thiết kế đặc biệt để giải quyết các thách thức riêng biệt trong cấu hình email cho thiết bị. Hạ tầng của chúng tôi hỗ trợ nhiều loại kết nối và mức độ bảo mật khác nhau, đảm bảo tương thích với cả thiết bị hiện đại và các thiết bị cũ vẫn đang được sử dụng.

Đối với thiết bị hiện đại hỗ trợ TLS 1.2+, sử dụng máy chủ SMTP chính của chúng tôi tại smtp.forwardemail.net với cổng 465 cho kết nối SSL/TLS (khuyến nghị) hoặc cổng 587 cho kết nối STARTTLS. Các cổng này cung cấp bảo mật cấp doanh nghiệp và tương thích với tất cả các phiên bản firmware thiết bị hiện tại.

Các thiết bị cũ chỉ hỗ trợ TLS 1.0 có thể sử dụng các cổng tương thích chuyên biệt của chúng tôi. Cổng 2455 cung cấp kết nối SSL/TLS với hỗ trợ TLS 1.0, trong khi cổng 2555 cung cấp STARTTLS với khả năng tương thích giao thức cũ. Các cổng này duy trì mức bảo mật cao nhất có thể trong khi đảm bảo thiết bị cũ vẫn hoạt động bình thường.

Tất cả kết nối đều yêu cầu xác thực bằng bí danh Forward Email của bạn làm tên đăng nhập và mật khẩu được tạo từ [Tài Khoản Của Tôi -> Tên Miền -> Bí Danh](https://forwardemail.net/my-account/domains). Cách làm này cung cấp bảo mật mạnh mẽ đồng thời duy trì khả năng tương thích rộng rãi với các hệ thống xác thực thiết bị khác nhau.

> \[!CAUTION]
> Không bao giờ sử dụng mật khẩu đăng nhập tài khoản của bạn để xác thực SMTP. Luôn sử dụng mật khẩu được tạo từ [Tài Khoản Của Tôi -> Tên Miền -> Bí Danh](https://forwardemail.net/my-account/domains) để cấu hình thiết bị.


## Ma Trận Tương Thích Thiết Bị Toàn Diện {#comprehensive-device-compatibility-matrix}

Hiểu được thiết bị nào cần hỗ trợ giao thức cũ và thiết bị nào dùng cấu hình hiện đại giúp đơn giản hóa quá trình thiết lập và đảm bảo gửi email đáng tin cậy trên toàn bộ hệ sinh thái thiết bị của bạn.

| Loại Thiết Bị              | Hỗ Trợ TLS Hiện Đại | Cần TLS Cũ          | Cổng Khuyến Nghị  | Vấn Đề Thường Gặp                                                                                                                                    | Hướng Dẫn Cài Đặt/Hình Ảnh                                                                                                                      |
| -------------------------- | ------------------- | ------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Máy in HP (2020+)           | ✅ TLS 1.2+          | ❌                   | `465`, `587`      | [Xác thực chứng chỉ](https://h30434.www3.hp.com/t5/Scanning-Faxing-Copying/Scan-to-E-Mail-newer-MFP-Pro-printers-SMTP-Certificate/td-p/9194707)      | [Hướng Dẫn Cài Đặt HP LaserJet Pro MFP](https://support.hp.com/us-en/document/ish_6185297-6063300-16)                                              |
| Máy in HP (Trước 2020)      | ❌                   | ✅ Chỉ TLS 1.0       | `2455`, `2555`    | [Giới hạn firmware](https://www.reddit.com/r/sysadmin/comments/1gnpac4/printers_dont_have_tls_settings/)                                              | [Hướng Dẫn Tính Năng Scan to Email](https://support.hp.com/us-en/document/ish_6518575-6518545-16)                                                  |
| Máy in Canon (Hiện tại)     | ✅ TLS 1.2+          | ❌                   | `465`, `587`      | [Cài đặt xác thực](https://community.usa.canon.com/t5/Office-Printers/MF733CDW-Cannot-Scan-to-Email-with-SMTP-Auth-Error-806/td-p/265358)              | [Hướng Dẫn Xác Thực SMTP Canon](https://oip.manual.canon/USRMA-0320-zz-CS-enUV/contents/1T0003111775.html)                                        |
| Máy in Canon (Cũ)           | ❌                   | ✅ Chỉ TLS 1.0       | `2455`, `2555`    | [Vấn đề chứng chỉ](https://community.usa.canon.com/t5/Office-Printers/MF735cx-quot-Register-quot-Certificate-produces-error/td-p/245443)               | [Hướng Dẫn Cài Đặt Email Nâng Cao](https://oip.manual.canon/USRMA-0163-zz-CS-enGB/contents/08025025.html)                                         |
| Máy in Brother (Hiện tại)   | ✅ TLS 1.2+          | ❌                   | `465`, `587`      | [Cấu hình cổng](https://www.reddit.com/r/techsupport/comments/1548u4o/brother_printer_not_taking_scan_to_email_config/)                             | [Hướng Dẫn Cài Đặt SMTP Brother](https://support.brother.com/g/b/faqend.aspx?c=us&lang=en&prod=mfcl2690dw_us&faqid=faq00100234_512)               |
| Máy in Epson (Hiện tại)     | ✅ TLS 1.2+          | ❌                   | `465`, `587`      | Truy cập giao diện web                                                                                                                               | [Cài Đặt Thông Báo Email Epson](https://download4.epson.biz/sec_pubs/l6580_series/useg/en/GUID-5FED5794-3E76-4DE9-8B9D-EBD8F60F231C.htm)           |
| Camera IP Foscam            | ❌                   | ✅ Chỉ TLS 1.0       | `2455`, `2555`    | [Xác thực chứng chỉ](https://ipcamtalk.com/threads/foscam-ip-cameras-stopped-sending-email-in-motion-detection.80152/)                               | [FAQ Cài Đặt Email Foscam](https://www.foscam.com/faqs/view.html?id=63)                                                                           |
| Hikvision (2020+)           | ✅ TLS 1.2+          | ❌                   | `465`, `587`      | Yêu cầu SSL                                                                                                                                           | [Hướng Dẫn Cài Đặt Email Hikvision](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf) |
| Hikvision (Cũ)              | ❌                   | ✅ Chỉ TLS 1.0       | `2455`, `2555`    | Cập nhật firmware                                                                                                                                     | [Cấu Hình Hikvision Cũ](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf)            |
| Camera Dahua (Hiện tại)     | ✅ TLS 1.2+          | ❌                   | `465`, `587`      | Xác thực                                                                                                                                              | [Wiki Cài Đặt Email Dahua](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail)                                                           |
| Máy đa chức năng Xerox (Hiện tại) | ✅ TLS 1.2+    | ❌                   | `465`, `587`      | [Cấu hình TLS](https://www.support.xerox.com/en-us/article/KB0032169)                                                                                 | [Hướng Dẫn Cấu Hình TLS Xerox](https://www.support.xerox.com/en-us/article/KB0032169)                                                             |
| Máy đa chức năng Ricoh (Hiện tại) | ✅ TLS 1.2+    | ❌                   | `465`, `587`      | Cài đặt SSL                                                                                                                                           | [Cấu Hình Email Ricoh](https://www.ricoh.com/info/2025/0526_1)                                                                                   |
| Máy đa chức năng Ricoh (Cũ) | ❌                   | ✅ Chỉ TLS 1.0       | `2455`, `2555`    | [Vấn đề xác thực cơ bản](https://www.ricoh.com/info/2025/0526_1)                                                                                      | [Cài Đặt Ricoh Cũ](https://www.ricoh.com/info/2025/0526_1)                                                                                        |
Ma trận này cung cấp một tham chiếu nhanh để xác định phương pháp cấu hình phù hợp cho các thiết bị cụ thể của bạn. Khi không chắc chắn, hãy bắt đầu với các cổng hiện đại và chuyển sang các cổng cũ nếu xảy ra sự cố kết nối.

> \[!NOTE]
> Tuổi thiết bị không phải lúc nào cũng là chỉ số đáng tin cậy về hỗ trợ TLS. Một số nhà sản xuất đã cập nhật hỗ trợ TLS 1.2 cho các mẫu cũ thông qua cập nhật firmware, trong khi những nhà sản xuất khác đã ngừng hỗ trợ các sản phẩm cũ.


## Cấu hình Email Máy in HP {#hp-printer-email-configuration}

Máy in HP đại diện cho một trong những cơ sở thiết bị in kết nối mạng lớn nhất, với các mẫu từ dòng LaserJet Pro hiện tại hỗ trợ đầy đủ TLS 1.3 đến các mẫu cũ chỉ hỗ trợ TLS 1.0. Quá trình cấu hình thay đổi đáng kể giữa các thiết bị hiện đại và cũ, yêu cầu các phương pháp khác nhau để đạt được khả năng tương thích tối ưu.

### Máy in HP hiện đại (2020 trở đi) {#modern-hp-printers-2020-and-later}

Máy in HP hiện đại bao gồm dòng LaserJet Pro MFP M404, Color LaserJet Pro MFP M479 và các mẫu mới hơn hỗ trợ các tiêu chuẩn TLS hiện tại. Các thiết bị này cung cấp khả năng thông báo email toàn diện thông qua giao diện HP Embedded Web Server (EWS).

1. **Truy cập giao diện web của máy in** bằng cách nhập địa chỉ IP của máy in vào trình duyệt web. Bạn có thể tìm địa chỉ IP bằng cách in trang cấu hình mạng từ bảng điều khiển của máy in.

2. **Đi đến tab Mạng** và chọn "Email Server" hoặc "SMTP Settings" tùy theo mẫu máy in của bạn. Một số máy in HP tổ chức các cài đặt này dưới mục "System" > "Email Alerts."

3. **Cấu hình các thiết lập máy chủ SMTP** bằng cách nhập `smtp.forwardemail.net` làm địa chỉ máy chủ. Chọn "SSL/TLS" làm phương thức mã hóa và nhập `465` làm số cổng để có kết nối ổn định nhất.

4. **Thiết lập xác thực** bằng cách bật xác thực SMTP và nhập bí danh Forward Email của bạn làm tên người dùng. Sử dụng mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains), không phải mật khẩu đăng nhập tài khoản của bạn.

5. **Cấu hình thông tin người gửi** bằng cách nhập bí danh Forward Email của bạn làm địa chỉ "From" và một tên mô tả như "HP Printer - Office" để giúp nhận biết nguồn thông báo.

6. **Thiết lập địa chỉ người nhận** bằng cách thêm tối đa năm địa chỉ email sẽ nhận thông báo từ máy in. Máy in HP cho phép gửi các loại thông báo khác nhau đến các người nhận khác nhau.

7. **Kiểm tra cấu hình** bằng chức năng kiểm tra email tích hợp của HP. Máy in sẽ gửi một tin nhắn thử để xác minh rằng tất cả các cài đặt đều chính xác và việc liên lạc với máy chủ Forward Email hoạt động tốt.

> \[!TIP]
> Máy in HP thường lưu bộ nhớ đệm tra cứu DNS. Nếu bạn gặp sự cố kết nối, hãy khởi động lại máy in sau khi cấu hình để xóa các mục DNS đã lưu.

### Máy in HP cũ (Mẫu trước 2020) {#legacy-hp-printers-pre-2020-models}

Các máy in HP cũ hơn, bao gồm LaserJet Pro MFP M277 và các mẫu tương tự, thường chỉ hỗ trợ TLS 1.0 và yêu cầu cấu hình đặc biệt để làm việc với các nhà cung cấp email hiện đại. Các thiết bị này thường hiển thị lỗi "TLS certificate verification failed" khi cố gắng kết nối với các cổng SMTP tiêu chuẩn.

1. **Truy cập Embedded Web Server của máy in** bằng cách nhập địa chỉ IP của máy in vào trình duyệt web. Máy in HP cũ có thể yêu cầu Internet Explorer hoặc chế độ tương thích để hoạt động đầy đủ.

2. **Đi đến cài đặt Mạng hoặc Hệ thống** và tìm phần cấu hình "Email" hoặc "SMTP." Vị trí chính xác thay đổi tùy theo mẫu máy và phiên bản firmware.

3. **Cấu hình các thiết lập SMTP cũ của Forward Email** bằng cách nhập smtp.forwardemail.net làm địa chỉ máy chủ. Điều này rất quan trọng - sử dụng cổng 2455 cho kết nối SSL/TLS hoặc cổng 2555 cho kết nối STARTTLS thay vì các cổng tiêu chuẩn.

4. **Thiết lập xác thực** bằng cách bật xác thực SMTP và nhập bí danh Forward Email của bạn làm tên người dùng. Sử dụng mật khẩu Forward Email đã tạo để xác thực.

5. **Cấu hình cài đặt mã hóa** một cách cẩn thận. Chọn "SSL/TLS" nếu sử dụng cổng 2455, hoặc "STARTTLS" nếu sử dụng cổng 2555. Một số máy in HP cũ có thể đặt tên các tùy chọn này khác nhau.
6. **Đặt thông tin người gửi và người nhận** bằng cách sử dụng bí danh Forward Email của bạn làm địa chỉ người gửi và cấu hình các địa chỉ người nhận phù hợp cho các thông báo.

7. **Kiểm tra cấu hình** bằng chức năng kiểm tra của máy in. Nếu kiểm tra thất bại với lỗi chứng chỉ, hãy xác minh rằng bạn đang sử dụng các cổng kế thừa đúng (2455 hoặc 2555) thay vì các cổng SMTP tiêu chuẩn.

> \[!CAUTION]
> Máy in HP kế thừa có thể không nhận được các bản cập nhật firmware để khắc phục các vấn đề tương thích TLS. Nếu cấu hình vẫn tiếp tục thất bại, hãy cân nhắc sử dụng máy chủ chuyển tiếp SMTP cục bộ như một giải pháp trung gian.


## Cấu hình Email Máy In Canon {#canon-printer-email-configuration}

Máy in Canon cung cấp khả năng thông báo email mạnh mẽ trên các dòng sản phẩm imageRUNNER, PIXMA và MAXIFY của họ. Các thiết bị Canon hiện đại hỗ trợ cấu hình TLS toàn diện, trong khi các mẫu kế thừa có thể yêu cầu các thiết lập tương thích cụ thể để hoạt động với các nhà cung cấp email hiện nay.

### Máy In Canon Hiện Đại {#current-canon-printers}

Máy in Canon hiện đại cung cấp các tính năng thông báo email rộng rãi thông qua giao diện web Remote UI, hỗ trợ từ các cảnh báo trạng thái cơ bản đến các thông báo quản lý thiết bị chi tiết.

1. **Truy cập Remote UI** bằng cách nhập địa chỉ IP của máy in vào trình duyệt web. Máy in Canon thường sử dụng giao diện web cho tất cả các tác vụ cấu hình mạng.

2. **Đi đến Settings/Registration** và chọn "Device Management" từ menu. Tìm "E-Mail Notification Settings" hoặc các tùy chọn tương tự tùy theo mẫu máy in của bạn.

3. **Cấu hình máy chủ SMTP** bằng cách nhấp vào "Add Destination" và nhập smtp.forwardemail.net làm địa chỉ máy chủ. Chọn "SSL" hoặc "TLS" làm phương thức mã hóa.

4. **Đặt số cổng** là 465 cho kết nối SSL/TLS (khuyến nghị) hoặc 587 cho kết nối STARTTLS. Máy in Canon phân biệt rõ ràng giữa các phương thức mã hóa này trong giao diện của họ.

5. **Cấu hình xác thực** bằng cách bật xác thực SMTP và nhập bí danh Forward Email của bạn làm tên đăng nhập. Sử dụng mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Thiết lập thông tin người gửi** bằng cách nhập bí danh Forward Email của bạn làm địa chỉ người gửi và cấu hình tên hiển thị mô tả để dễ dàng nhận biết các thông báo.

7. **Cấu hình loại thông báo** bằng cách chọn các sự kiện sẽ kích hoạt cảnh báo email. Máy in Canon hỗ trợ kiểm soát chi tiết các loại thông báo, bao gồm các điều kiện lỗi, cảnh báo bảo trì và sự kiện bảo mật.

8. **Kiểm tra cấu hình email** bằng chức năng kiểm tra tích hợp của Canon. Máy in sẽ gửi một thông báo thử nghiệm để xác minh cấu hình và kết nối đúng.

> \[!NOTE]
> Máy in Canon thường cung cấp các thông báo lỗi chi tiết có thể giúp khắc phục sự cố cấu hình. Hãy chú ý đến các mã lỗi cụ thể để giải quyết vấn đề nhanh hơn.

### Máy In Canon Kế Thừa {#legacy-canon-printers}

Các máy in Canon cũ hơn có thể hỗ trợ TLS hạn chế và yêu cầu cấu hình cẩn thận để hoạt động với các nhà cung cấp email hiện đại. Những thiết bị này thường cần các thiết lập SMTP tương thích kế thừa để duy trì chức năng thông báo email.

1. **Truy cập giao diện web của máy in** bằng địa chỉ IP của thiết bị. Máy in Canon kế thừa có thể yêu cầu các thiết lập tương thích trình duyệt cụ thể để hoạt động đầy đủ.

2. **Đi đến phần cấu hình email** thông qua menu quản lý thiết bị hoặc cài đặt mạng. Đường dẫn chính xác thay đổi tùy theo mẫu máy và phiên bản firmware.

3. **Cấu hình các thiết lập SMTP kế thừa của Forward Email** bằng cách nhập smtp.forwardemail.net làm địa chỉ máy chủ và sử dụng cổng 2455 cho kết nối SSL hoặc cổng 2555 cho kết nối STARTTLS.

4. **Thiết lập xác thực cẩn thận** bằng cách bật xác thực SMTP và sử dụng bí danh Forward Email cùng mật khẩu đã tạo. Máy in Canon kế thừa có thể có các yêu cầu xác thực cụ thể.

5. **Cấu hình các thiết lập mã hóa** bằng cách chọn tùy chọn TLS phù hợp với cổng bạn chọn. Đảm bảo phương thức mã hóa phù hợp với cấu hình cổng (SSL cho 2455, STARTTLS cho 2555).
6. **Kiểm tra cấu hình** và theo dõi lỗi xác thực chứng chỉ. Nếu vấn đề vẫn tiếp diễn, hãy xác minh rằng bạn đang sử dụng các cổng tương thích với Forward Email thay vì các cổng SMTP tiêu chuẩn.

> \[!WARNING]
> Một số máy in Canon đời cũ có thể không hỗ trợ xác thực chứng chỉ máy chủ. Mặc dù điều này làm giảm tính bảo mật, nhưng có thể cần thiết để duy trì chức năng email trên các thiết bị cũ hơn.


## Cấu hình Email cho Máy in Brother {#brother-printer-email-configuration}

Máy in Brother, đặc biệt là dòng MFC và DCP, cung cấp các khả năng quét tới email và thông báo toàn diện. Tuy nhiên, nhiều người dùng báo cáo gặp khó khăn trong việc cấu hình chức năng email, đặc biệt với Office 365 và các nhà cung cấp email hiện đại khác đã loại bỏ các phương thức xác thực cũ.

### Cấu hình dòng Brother MFC {#brother-mfc-series-configuration}

Máy in đa chức năng Brother cung cấp nhiều khả năng email, nhưng việc cấu hình có thể phức tạp do có nhiều tùy chọn xác thực và mã hóa khác nhau.

1. **Truy cập giao diện web của máy in** bằng cách nhập địa chỉ IP của máy in vào trình duyệt web. Máy in Brother cung cấp hệ thống cấu hình dựa trên web toàn diện.

2. **Đi tới cài đặt Mạng** và chọn "Email/IFAX" hoặc "Scan to Email" tùy theo mẫu máy in của bạn. Một số máy in Brother tổ chức các cài đặt này dưới mục "Administrator Settings."

3. **Cấu hình cài đặt máy chủ SMTP** bằng cách nhập smtp.forwardemail.net làm địa chỉ máy chủ. Máy in Brother hỗ trợ cả hai phương thức mã hóa SSL/TLS và STARTTLS.

4. **Chọn cổng và mã hóa phù hợp** bằng cách chọn cổng 465 với mã hóa SSL/TLS (khuyến nghị) hoặc cổng 587 với mã hóa STARTTLS. Máy in Brother ghi rõ các tùy chọn này trong giao diện của họ.

5. **Cấu hình xác thực SMTP** bằng cách bật xác thực và nhập bí danh Forward Email của bạn làm tên đăng nhập. Sử dụng mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Thiết lập thông tin người gửi** bằng cách cấu hình bí danh Forward Email của bạn làm địa chỉ người gửi và thêm tên mô tả để nhận diện máy in trong các thông báo email.

7. **Cấu hình các cài đặt quét tới email** bằng cách thiết lập các mục trong sổ địa chỉ và các cài đặt quét mặc định. Máy in Brother cho phép tùy chỉnh rộng rãi các tham số quét và quản lý người nhận.

8. **Kiểm tra cả chức năng thông báo email và quét tới email** để đảm bảo cấu hình hoàn chỉnh. Máy in Brother cung cấp các chức năng kiểm tra riêng biệt cho các tính năng email khác nhau.

> \[!TIP]
> Máy in Brother thường yêu cầu cập nhật firmware để giải quyết các vấn đề cấu hình email. Hãy kiểm tra các bản cập nhật có sẵn trước khi khắc phục sự cố kết nối.

### Khắc phục sự cố Email Brother {#troubleshooting-brother-email-issues}

Máy in Brother thường gặp các thách thức cấu hình cụ thể có thể được giải quyết bằng các phương pháp khắc phục sự cố có mục tiêu.

Nếu máy in Brother của bạn hiển thị lỗi "Authentication Failed" khi kiểm tra cấu hình email, hãy xác minh rằng bạn đang sử dụng bí danh Forward Email của mình (không phải email tài khoản) làm tên đăng nhập và mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains). Máy in Brother đặc biệt nhạy cảm với định dạng thông tin xác thực.

Đối với các máy in không chấp nhận cài đặt quét tới email, hãy thử cấu hình các cài đặt qua giao diện web thay vì bảng điều khiển của máy in. Giao diện web thường cung cấp các thông báo lỗi chi tiết hơn và các tùy chọn cấu hình.

Khi gặp lỗi kết nối SSL/TLS, hãy xác minh rằng bạn đang sử dụng đúng kết hợp cổng và phương thức mã hóa. Máy in Brother yêu cầu sự khớp chính xác giữa số cổng và phương thức mã hóa - cổng 465 phải sử dụng SSL/TLS (khuyến nghị), trong khi cổng 587 phải sử dụng STARTTLS.

> \[!CAUTION]
> Một số mẫu máy in Brother có các vấn đề đã biết với các cấu hình máy chủ SMTP cụ thể. Nếu cấu hình tiêu chuẩn không thành công, hãy tham khảo tài liệu hỗ trợ của Brother để biết các giải pháp thay thế theo mẫu máy.
## Cấu Hình Email Camera IP Foscam {#foscam-ip-camera-email-configuration}

Camera IP Foscam là một trong những loại thiết bị khó cấu hình email nhất do chúng sử dụng rộng rãi các giao thức TLS cũ và hạn chế cập nhật firmware. Hầu hết các camera Foscam, bao gồm các mẫu phổ biến như dòng R2, chỉ hỗ trợ TLS 1.0 và không thể cập nhật để hỗ trợ các tiêu chuẩn mã hóa hiện đại.

### Hiểu Về Hạn Chế Email Của Foscam {#understanding-foscam-email-limitations}

Camera Foscam gặp những thách thức đặc thù đòi hỏi các cách cấu hình riêng biệt. Thông báo lỗi phổ biến nhất là "TLS certificate verification failed: unable to get local issuer certificate," cho thấy camera không thể xác thực các chứng chỉ SSL hiện đại được hầu hết nhà cung cấp email sử dụng.

Vấn đề này xuất phát từ nhiều nguyên nhân: kho chứng chỉ lỗi thời không thể cập nhật, hỗ trợ giao thức TLS giới hạn tối đa ở TLS 1.0, và hạn chế firmware ngăn cản nâng cấp giao thức bảo mật. Thêm vào đó, nhiều mẫu Foscam đã hết vòng đời và không còn nhận cập nhật firmware để khắc phục các vấn đề tương thích này.

Cổng SMTP kế thừa của Forward Email được thiết kế đặc biệt để giải quyết các hạn chế này bằng cách duy trì tương thích TLS 1.0 đồng thời cung cấp mức bảo mật cao nhất có thể cho các thiết bị cũ.

### Các Bước Cấu Hình Email Cho Foscam {#foscam-email-configuration-steps}

Cấu hình thông báo email trên camera Foscam cần chú ý kỹ đến lựa chọn cổng và thiết lập mã hóa để khắc phục giới hạn TLS của thiết bị.

1. **Truy cập giao diện web của camera** bằng cách nhập địa chỉ IP của camera vào trình duyệt web. Camera Foscam thường sử dụng cổng 88 để truy cập web (ví dụ: <http://192.168.1.100:88>).

2. **Đi tới menu Cài đặt** và chọn "Mail Service" hoặc "Email Settings" tùy theo mẫu camera. Một số camera Foscam tổ chức các cài đặt này dưới mục "Alarm" > "Mail Service."

3. **Cấu hình máy chủ SMTP** bằng cách nhập smtp.forwardemail.net làm địa chỉ máy chủ. Đây là bước quan trọng - không sử dụng máy chủ SMTP của nhà cung cấp email tiêu chuẩn vì chúng không còn hỗ trợ TLS 1.0.

4. **Chọn cổng và mã hóa** bằng cách chọn cổng 2455 cho mã hóa SSL hoặc cổng 2555 cho mã hóa STARTTLS. Đây là các cổng tương thích kế thừa của Forward Email được thiết kế riêng cho các thiết bị như camera Foscam.

5. **Cấu hình xác thực** bằng cách bật xác thực SMTP và nhập bí danh Forward Email của bạn làm tên đăng nhập. Sử dụng mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Thiết lập thông tin người gửi và người nhận** bằng cách cấu hình bí danh Forward Email làm địa chỉ người gửi và thêm các địa chỉ người nhận cho cảnh báo phát hiện chuyển động và cảnh báo hệ thống.

7. **Cấu hình các trình kích hoạt thông báo** bằng cách thiết lập độ nhạy phát hiện chuyển động, lịch ghi hình và các sự kiện khác sẽ kích hoạt gửi email.

8. **Kiểm tra cấu hình email** bằng chức năng kiểm tra tích hợp của Foscam. Nếu kiểm tra thành công, bạn sẽ nhận được email thử nghiệm xác nhận cấu hình đúng.

> \[!IMPORTANT]
> Camera Foscam yêu cầu sử dụng các cổng kế thừa của Forward Email (2455 hoặc 2555) do giới hạn TLS 1.0. Các cổng SMTP tiêu chuẩn sẽ không hoạt động với các thiết bị này.

### Cấu Hình Nâng Cao Cho Foscam {#advanced-foscam-configuration}

Đối với người dùng cần thiết lập thông báo phức tạp hơn, camera Foscam cung cấp các tùy chọn cấu hình bổ sung giúp nâng cao khả năng giám sát an ninh.

Cấu hình các vùng phát hiện chuyển động để giảm cảnh báo sai bằng cách xác định các khu vực cụ thể trong trường nhìn của camera sẽ kích hoạt thông báo. Điều này ngăn chặn các email không cần thiết do các yếu tố môi trường như cây cối chuyển động hoặc xe cộ đi qua.

Thiết lập lịch ghi hình phù hợp với nhu cầu giám sát của bạn, đảm bảo các thông báo email được gửi trong các khoảng thời gian thích hợp. Camera Foscam có thể tắt thông báo trong các giờ nhất định để tránh cảnh báo qua đêm cho các sự kiện không quan trọng.
Cấu hình nhiều địa chỉ người nhận cho các loại cảnh báo khác nhau, cho phép bạn chuyển tiếp cảnh báo phát hiện chuyển động đến nhân viên bảo vệ trong khi gửi cảnh báo bảo trì hệ thống đến nhân viên IT.

> \[!TIP]
> Camera Foscam có thể tạo ra lượng email lớn nếu phát hiện chuyển động quá nhạy. Bắt đầu với các cài đặt thận trọng và điều chỉnh dựa trên đặc điểm môi trường của bạn.


## Cấu hình Email Camera An Ninh Hikvision {#hikvision-security-camera-email-configuration}

Camera Hikvision chiếm phần lớn thị trường camera an ninh toàn cầu, với các mẫu từ camera IP cơ bản đến hệ thống giám sát tiên tiến sử dụng AI. Quá trình cấu hình email thay đổi đáng kể giữa các mẫu mới hỗ trợ TLS hiện đại và các thiết bị cũ yêu cầu các giải pháp tương thích.

### Cấu hình Camera Hikvision Hiện Đại {#modern-hikvision-camera-configuration}

Các camera Hikvision hiện tại chạy phiên bản firmware mới hỗ trợ TLS 1.2+ và cung cấp khả năng thông báo email toàn diện qua giao diện web.

1. **Truy cập giao diện web của camera** bằng cách nhập địa chỉ IP của camera vào trình duyệt web. Camera Hikvision thường sử dụng các cổng HTTP/HTTPS tiêu chuẩn để truy cập web.

2. **Đi tới Configuration** và chọn "Network" > "Advanced Settings" > "Email" trong cấu trúc menu. Đường dẫn chính xác có thể khác nhau tùy theo mẫu camera và phiên bản firmware.

3. **Cấu hình máy chủ SMTP** bằng cách nhập smtp.forwardemail.net làm địa chỉ máy chủ. Camera Hikvision yêu cầu cấu hình SSL cụ thể để email hoạt động đúng.

4. **Đặt mã hóa thành SSL** và cấu hình cổng 465. Camera Hikvision không hỗ trợ STARTTLS, vì vậy mã hóa SSL trên cổng 465 là cấu hình được khuyến nghị để tương thích với Forward Email.

5. **Bật xác thực SMTP** và nhập bí danh Forward Email của bạn làm tên đăng nhập. Sử dụng mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) để xác thực.

6. **Cấu hình thông tin người gửi** bằng cách đặt bí danh Forward Email của bạn làm địa chỉ người gửi và thêm tên mô tả để nhận biết camera trong các thông báo email.

7. **Thiết lập địa chỉ người nhận** bằng cách thêm các địa chỉ email sẽ nhận cảnh báo an ninh, thông báo phát hiện chuyển động và cập nhật trạng thái hệ thống.

8. **Cấu hình các sự kiện kích hoạt** bằng cách thiết lập phát hiện chuyển động, phát hiện vượt hàng rào, phát hiện xâm nhập và các sự kiện khác sẽ tạo thông báo email.

9. **Kiểm tra cấu hình email** bằng chức năng kiểm tra tích hợp của Hikvision để xác minh kết nối và xác thực đúng với máy chủ Forward Email.

> \[!NOTE]
> Camera Hikvision yêu cầu phiên bản firmware mới nhất để hỗ trợ mã hóa SSL và TLS đúng cách. Kiểm tra cập nhật firmware trước khi cấu hình email.

### Cấu hình Camera Hikvision Cũ {#legacy-hikvision-camera-configuration}

Các camera Hikvision cũ có thể hỗ trợ TLS hạn chế và yêu cầu các cổng SMTP tương thích với Forward Email phiên bản cũ để duy trì chức năng email.

1. **Truy cập giao diện web của camera** và điều hướng đến phần cấu hình email. Camera Hikvision cũ có thể có cấu trúc menu khác với các mẫu hiện đại.

2. **Cấu hình các thiết lập SMTP phiên bản cũ của Forward Email** bằng cách nhập smtp.forwardemail.net làm địa chỉ máy chủ và sử dụng cổng 2455 cho kết nối SSL.

3. **Thiết lập xác thực** sử dụng bí danh Forward Email và mật khẩu đã tạo. Camera Hikvision cũ có thể có yêu cầu hoặc giới hạn xác thực riêng.

4. **Cấu hình các thiết lập mã hóa** bằng cách chọn mã hóa SSL để phù hợp với cấu hình cổng phiên bản cũ. Đảm bảo phương thức mã hóa phù hợp với yêu cầu cổng 2455.

5. **Kiểm tra cấu hình** và theo dõi lỗi kết nối. Camera Hikvision cũ có thể cung cấp báo cáo lỗi hạn chế, làm cho việc khắc phục sự cố khó khăn hơn.

> \[!WARNING]
> Camera Hikvision cũ có thể có các lỗ hổng bảo mật đã biết. Đảm bảo các thiết bị này được cách ly đúng cách trên mạng của bạn và cân nhắc nâng cấp lên các mẫu hiện đại khi có thể.
## Cấu Hình Email Camera An Ninh Dahua {#dahua-security-camera-email-configuration}

Camera Dahua cung cấp khả năng thông báo email mạnh mẽ trên toàn bộ dòng sản phẩm của họ, từ các camera IP cơ bản đến các hệ thống giám sát tiên tiến sử dụng AI. Quá trình cấu hình thường khá đơn giản đối với các thiết bị hiện đại, với hỗ trợ đầy đủ cho các tiêu chuẩn TLS hiện nay.

### Cài Đặt Email Camera Dahua {#dahua-camera-email-setup}

Camera Dahua cung cấp cấu hình email thân thiện với người dùng thông qua giao diện web, với khả năng tương thích tốt cho các tiêu chuẩn SMTP hiện đại.

1. **Truy cập giao diện web của camera** bằng cách nhập địa chỉ IP của camera vào trình duyệt web. Camera Dahua thường cung cấp hệ thống cấu hình dựa trên web trực quan.

2. **Đi tới Setup** và chọn "Network" > "Email" từ menu cấu hình. Camera Dahua tổ chức các thiết lập email trong một phần riêng biệt để dễ dàng truy cập.

3. **Cấu hình máy chủ SMTP** bằng cách nhập smtp.forwardemail.net làm địa chỉ máy chủ. Camera Dahua hỗ trợ cả hai phương thức mã hóa SSL và STARTTLS.

4. **Đặt cổng và mã hóa** bằng cách chọn cổng 465 với mã hóa SSL/TLS (khuyến nghị) hoặc cổng 587 với mã hóa STARTTLS.

5. **Bật xác thực SMTP** và nhập bí danh Forward Email của bạn làm tên đăng nhập. Sử dụng mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Cấu hình thông tin người gửi** bằng cách đặt bí danh Forward Email của bạn làm địa chỉ người gửi và thêm tên mô tả để nhận biết nguồn camera.

7. **Thiết lập địa chỉ người nhận** bằng cách thêm các địa chỉ email cho các loại thông báo khác nhau. Camera Dahua hỗ trợ nhiều người nhận cho các loại cảnh báo khác nhau.

8. **Cấu hình các sự kiện kích hoạt** bằng cách thiết lập phát hiện chuyển động, cảnh báo can thiệp và các sự kiện an ninh khác sẽ tạo ra thông báo email.

9. **Kiểm tra chức năng email** bằng cách sử dụng tính năng kiểm tra tích hợp của Dahua để xác minh cấu hình và kết nối đúng.

> \[!TIP]
> Camera Dahua thường cung cấp các hướng dẫn cấu hình chi tiết qua tài liệu wiki của họ. Tham khảo [hướng dẫn cài đặt email của Dahua](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail) để biết chỉ dẫn theo từng mẫu.

### Cấu Hình Email Đầu Ghi NVR Dahua {#dahua-nvr-email-configuration}

Đầu ghi hình mạng Dahua (NVR) cung cấp quản lý thông báo email tập trung cho nhiều camera, giúp quản trị hiệu quả các hệ thống giám sát lớn.

1. **Truy cập giao diện web của NVR** bằng cách nhập địa chỉ IP của NVR vào trình duyệt web. NVR Dahua cung cấp giao diện quản lý toàn diện cho cấu hình hệ thống.

2. **Đi tới cấu hình Email** bằng cách chọn "Setup" > "Network" > "Email" từ menu chính. NVR thường tổ chức các thiết lập email ở cấp hệ thống.

3. **Cấu hình máy chủ SMTP** bằng cách nhập smtp.forwardemail.net làm địa chỉ máy chủ và chọn cổng 465 với mã hóa SSL/TLS (khuyến nghị) hoặc cổng 587 với STARTTLS.

4. **Thiết lập xác thực** sử dụng bí danh Forward Email và mật khẩu đã tạo. NVR hỗ trợ các phương thức xác thực SMTP tiêu chuẩn.

5. **Cấu hình lịch trình thông báo** bằng cách thiết lập các khoảng thời gian khi thông báo email nên được kích hoạt. Điều này giúp quản lý lượng thông báo trong giờ nghỉ.

6. **Thiết lập thông báo dựa trên sự kiện** bằng cách cấu hình các sự kiện camera nào sẽ kích hoạt cảnh báo email. NVR cho phép kiểm soát chi tiết các kích hoạt thông báo trên nhiều camera.

7. **Kiểm tra cấu hình email toàn hệ thống** để đảm bảo chức năng hoạt động đúng trên tất cả các camera và hệ thống giám sát kết nối.

## Cấu Hình Email Thiết Bị Đa Chức Năng Xerox {#xerox-multifunction-device-email-configuration}

Thiết bị đa chức năng Xerox cung cấp khả năng thông báo email cấp doanh nghiệp với hỗ trợ TLS toàn diện và các tùy chọn cấu hình nâng cao. Các thiết bị Xerox hiện đại hỗ trợ các tiêu chuẩn bảo mật hiện hành đồng thời duy trì khả năng tương thích với nhiều môi trường mạng khác nhau.

### Cài Đặt Email Thiết Bị Đa Chức Năng Xerox {#xerox-mfd-email-setup}

Thiết bị đa chức năng Xerox cung cấp cấu hình email tinh vi thông qua giao diện quản trị dựa trên web, hỗ trợ cả thông báo cơ bản và tích hợp quy trình làm việc nâng cao.
1. **Truy cập giao diện web của thiết bị** bằng cách nhập địa chỉ IP của thiết bị vào trình duyệt web. Các thiết bị Xerox thường cung cấp công cụ quản trị dựa trên web toàn diện.

2. **Điều hướng đến Properties** và chọn "Connectivity" > "Protocols" > "SMTP" từ menu cấu hình. Các thiết bị Xerox tổ chức các cài đặt email trong phần cấu hình giao thức của chúng.

3. **Cấu hình máy chủ SMTP** bằng cách nhập smtp.forwardemail.net làm địa chỉ máy chủ. Các thiết bị Xerox hỗ trợ các phiên bản TLS và phương thức mã hóa có thể cấu hình.

4. **Đặt cấu hình TLS** bằng cách chọn TLS 1.2 hoặc cao hơn làm phiên bản tối thiểu được hỗ trợ. Các thiết bị Xerox cho phép quản trị viên cấu hình các yêu cầu TLS cụ thể để tăng cường bảo mật.

5. **Cấu hình cổng và mã hóa** bằng cách đặt cổng 465 cho kết nối SSL/TLS (khuyến nghị) hoặc cổng 587 cho kết nối STARTTLS.

6. **Thiết lập xác thực SMTP** bằng cách bật xác thực và nhập bí danh Forward Email của bạn làm tên đăng nhập. Sử dụng mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

7. **Cấu hình thông tin người gửi** bằng cách đặt bí danh Forward Email của bạn làm địa chỉ người gửi và cấu hình các địa chỉ reply-to phù hợp để quản lý thông báo.

8. **Thiết lập các loại thông báo** bằng cách cấu hình các sự kiện thiết bị nào sẽ kích hoạt cảnh báo email, bao gồm thông báo bảo trì, điều kiện lỗi và sự kiện bảo mật.

9. **Kiểm tra cấu hình email** bằng hệ thống kiểm tra toàn diện của Xerox để xác minh kết nối và xác thực đúng.

> \[!NOTE]
> Các thiết bị Xerox cung cấp các tùy chọn cấu hình TLS chi tiết cho phép tinh chỉnh các thiết lập bảo mật. Tham khảo [hướng dẫn cấu hình TLS của Xerox](https://www.support.xerox.com/en-us/article/KB0032169) cho các yêu cầu bảo mật nâng cao.


## Cấu hình Email cho Thiết bị Đa chức năng Ricoh {#ricoh-multifunction-device-email-configuration}

Các thiết bị đa chức năng Ricoh cung cấp khả năng email mạnh mẽ trên toàn bộ dòng sản phẩm của họ, từ máy in văn phòng cơ bản đến hệ thống sản xuất tiên tiến. Tuy nhiên, [Ricoh đã thông báo những thay đổi quan trọng](https://www.ricoh.com/info/2025/0526_1) liên quan đến việc Microsoft ngừng hỗ trợ xác thực cơ bản ảnh hưởng đến chức năng email.

### Cấu hình Ricoh MFD hiện đại {#modern-ricoh-mfd-configuration}

Các thiết bị Ricoh hiện tại hỗ trợ các tiêu chuẩn TLS hiện đại và cung cấp khả năng thông báo email toàn diện thông qua giao diện web của chúng.

1. **Truy cập giao diện web của thiết bị** bằng cách nhập địa chỉ IP của thiết bị vào trình duyệt web. Các thiết bị Ricoh cung cấp hệ thống cấu hình dựa trên web trực quan.

2. **Điều hướng đến cấu hình Email** bằng cách chọn "System Settings" > "Administrator Tools" > "Network" > "Email" từ cấu trúc menu.

3. **Cấu hình máy chủ SMTP** bằng cách nhập smtp.forwardemail.net làm địa chỉ máy chủ. Các thiết bị Ricoh hỗ trợ cả phương thức mã hóa SSL và STARTTLS.

4. **Bật SSL trên trang máy chủ SMTP** để kích hoạt mã hóa TLS. Giao diện của Ricoh có thể khó hiểu, nhưng việc bật SSL là bắt buộc để có chức năng email an toàn.

5. **Đặt số cổng** thành 465 cho kết nối SSL/TLS (khuyến nghị) hoặc 587 cho kết nối STARTTLS. Đảm bảo phương thức mã hóa phù hợp với cổng đã chọn.

6. **Cấu hình xác thực SMTP** bằng cách bật xác thực và nhập bí danh Forward Email của bạn làm tên đăng nhập. Sử dụng mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

7. **Thiết lập thông tin người gửi** bằng cách cấu hình bí danh Forward Email của bạn làm địa chỉ người gửi và thêm thông tin nhận dạng phù hợp.

8. **Cấu hình các loại thông báo** bằng cách thiết lập scan-to-email, cảnh báo thiết bị và thông báo bảo trì theo yêu cầu vận hành của bạn.

9. **Kiểm tra chức năng email** bằng hệ thống kiểm tra tích hợp của Ricoh để xác minh cấu hình và kết nối đúng.

> \[!IMPORTANT]
> Các thiết bị Ricoh bị ảnh hưởng bởi thay đổi xác thực cơ bản của Microsoft yêu cầu các phương thức xác thực cập nhật. Đảm bảo firmware thiết bị của bạn hỗ trợ xác thực hiện đại hoặc sử dụng các tính năng tương thích của Forward Email.
### Cấu Hình Thiết Bị Ricoh Cũ {#legacy-ricoh-device-configuration}

Các thiết bị Ricoh cũ có thể yêu cầu các cổng SMTP tương thích với phiên bản cũ của Forward Email do hỗ trợ TLS hạn chế và các giới hạn về phương thức xác thực.

1. **Truy cập giao diện web của thiết bị** và điều hướng đến phần cấu hình email. Các thiết bị Ricoh cũ có thể có cấu trúc menu khác với các mẫu hiện tại.

2. **Cấu hình các thiết lập SMTP phiên bản cũ của Forward Email** bằng cách nhập smtp.forwardemail.net làm địa chỉ máy chủ và sử dụng cổng 2455 cho kết nối SSL.

3. **Bật mã hóa SSL** để phù hợp với cấu hình cổng phiên bản cũ. Đảm bảo các thiết lập mã hóa phù hợp với yêu cầu của cổng 2455.

4. **Thiết lập xác thực** sử dụng bí danh Forward Email và mật khẩu đã tạo. Các thiết bị Ricoh cũ có thể có các giới hạn xác thực cụ thể.

5. **Kiểm tra cấu hình** và theo dõi các lỗi xác thực hoặc kết nối. Các thiết bị cũ có thể cung cấp báo cáo lỗi hạn chế để hỗ trợ khắc phục sự cố.


## Khắc Phục Sự Cố Cấu Hình Thường Gặp {#troubleshooting-common-configuration-issues}

Cấu hình email trên thiết bị có thể gặp nhiều vấn đề do thiết lập mạng, sự cố xác thực hoặc thách thức tương thích giao thức. Hiểu các vấn đề phổ biến và cách giải quyết giúp đảm bảo việc gửi thông báo đáng tin cậy trên toàn bộ hệ sinh thái thiết bị của bạn.

### Vấn Đề Xác Thực và Thông Tin Đăng Nhập {#authentication-and-credential-issues}

Lỗi xác thực là vấn đề cấu hình email phổ biến nhất trên tất cả các loại thiết bị. Những vấn đề này thường bắt nguồn từ việc sử dụng thông tin đăng nhập sai, không khớp phương thức xác thực hoặc cấu hình tài khoản không đúng.

Xác minh rằng bạn đang sử dụng bí danh Forward Email làm tên người dùng, không phải địa chỉ email tài khoản hoặc thông tin đăng nhập. Nhiều thiết bị nhạy cảm với định dạng tên người dùng và yêu cầu phải khớp chính xác với bí danh đã cấu hình.

Đảm bảo bạn đang sử dụng mật khẩu được tạo từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) thay vì mật khẩu đăng nhập tài khoản. Xác thực SMTP yêu cầu mật khẩu được tạo riêng vì lý do bảo mật, và sử dụng thông tin đăng nhập sai sẽ dẫn đến lỗi xác thực.

Kiểm tra xem tài khoản Forward Email của bạn đã bật quyền truy cập SMTP đúng cách và các yêu cầu xác thực hai yếu tố đã được cấu hình chính xác chưa. Một số cấu hình tài khoản có thể hạn chế truy cập SMTP cho đến khi được kích hoạt đúng cách.

> \[!TIP]
> Nếu xác thực vẫn tiếp tục thất bại, hãy tạo lại mật khẩu SMTP từ [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) và cập nhật cấu hình thiết bị với thông tin đăng nhập mới.

### Vấn Đề TLS và Mã Hóa {#tls-and-encryption-problems}

Các vấn đề liên quan đến TLS thường xảy ra khi thiết bị cố gắng sử dụng các giao thức mã hóa không được hỗ trợ hoặc khi có sự không khớp giữa cấu hình cổng và thiết lập mã hóa.

Đối với các thiết bị hiện đại gặp lỗi TLS, hãy xác minh rằng bạn đang sử dụng đúng cổng và kết hợp mã hóa: cổng 465 với SSL/TLS (được khuyến nghị) hoặc cổng 587 với STARTTLS. Các thiết lập này phải khớp chính xác để kết nối thành công.

Các thiết bị cũ hiển thị lỗi xác thực chứng chỉ nên sử dụng các cổng tương thích của Forward Email (2455 hoặc 2555) thay vì các cổng SMTP tiêu chuẩn. Các cổng này duy trì khả năng tương thích TLS 1.0 đồng thời cung cấp bảo mật phù hợp cho các thiết bị cũ.

Nếu việc xác thực chứng chỉ tiếp tục thất bại trên các thiết bị cũ, hãy kiểm tra xem thiết bị có cho phép tắt xác thực chứng chỉ hay không. Mặc dù điều này làm giảm bảo mật, nhưng có thể cần thiết để duy trì chức năng trên các thiết bị không thể cập nhật.

> \[!CAUTION]
> Tắt xác thực chứng chỉ làm giảm bảo mật và chỉ nên được sử dụng như biện pháp cuối cùng cho các thiết bị cũ không thể cập nhật hoặc thay thế.

### Vấn Đề Kết Nối Mạng {#network-connectivity-issues}

Các vấn đề liên quan đến mạng có thể ngăn thiết bị kết nối đến máy chủ SMTP của Forward Email ngay cả khi các thiết lập cấu hình đúng.

Xác minh rằng mạng của bạn cho phép kết nối ra ngoài trên các cổng SMTP đã cấu hình. Tường lửa công ty hoặc chính sách mạng hạn chế có thể chặn một số cổng, yêu cầu điều chỉnh quy tắc tường lửa hoặc cấu hình cổng thay thế.
Kiểm tra phân giải DNS bằng cách đảm bảo rằng các thiết bị của bạn có thể phân giải smtp.forwardemail.net đến các địa chỉ IP chính xác. Các sự cố DNS có thể gây ra lỗi kết nối ngay cả khi kết nối mạng vẫn hoạt động bình thường.

Kiểm tra kết nối mạng từ các công cụ chẩn đoán mạng của thiết bị nếu có. Nhiều thiết bị hiện đại cung cấp khả năng kiểm tra mạng tích hợp giúp xác định các sự cố kết nối.

Xem xét độ trễ mạng và cài đặt thời gian chờ nếu các thiết bị nằm trên các kết nối mạng chậm hoặc có độ trễ cao. Một số thiết bị có thể cần điều chỉnh thời gian chờ để đảm bảo gửi email đáng tin cậy.

### Thách Thức Cấu Hình Riêng Cho Thiết Bị {#device-specific-configuration-challenges}

Các nhà sản xuất thiết bị khác nhau triển khai chức năng email theo nhiều cách khác nhau, dẫn đến các thách thức cấu hình riêng biệt theo nhà sản xuất cần các giải pháp cụ thể.

Máy in HP có thể lưu bộ nhớ đệm tra cứu DNS và cần khởi động lại sau khi thay đổi cấu hình. Nếu sự cố kết nối vẫn tiếp diễn sau khi cấu hình, hãy khởi động lại máy in để xóa thông tin mạng được lưu trong bộ nhớ đệm.

Máy in Brother đặc biệt nhạy cảm với định dạng thông tin xác thực và có thể yêu cầu cấu hình qua giao diện web thay vì bảng điều khiển thiết bị để thiết lập đáng tin cậy.

Camera Foscam yêu cầu cấu hình cổng cụ thể do giới hạn TLS và có thể không cung cấp thông báo lỗi chi tiết để khắc phục sự cố. Đảm bảo bạn đang sử dụng các cổng kế thừa của Forward Email (2455 hoặc 2555) cho các thiết bị này.

Camera Hikvision yêu cầu mã hóa SSL và không hỗ trợ STARTTLS, giới hạn các tùy chọn cấu hình chỉ ở cổng 465 với mã hóa SSL/TLS.

> \[!NOTE]
> Khi khắc phục sự cố riêng cho thiết bị, hãy tham khảo tài liệu của nhà sản xuất để biết các giới hạn hoặc yêu cầu cấu hình đã biết có thể ảnh hưởng đến chức năng email.


## Các Cân Nhắc Bảo Mật và Thực Tiễn Tốt Nhất {#security-considerations-and-best-practices}

Cấu hình thông báo email trên các thiết bị mạng liên quan đến một số cân nhắc bảo mật giúp bảo vệ hệ thống của bạn đồng thời duy trì việc gửi thông báo đáng tin cậy. Tuân thủ các thực tiễn bảo mật tốt nhất giúp ngăn chặn truy cập trái phép và đảm bảo tiết lộ thông tin phù hợp trong các thông báo.

### Quản Lý Thông Tin Xác Thực {#credential-management}

Sử dụng mật khẩu mạnh, duy nhất cho tài khoản Forward Email của bạn và bật xác thực hai yếu tố khi có thể. Mật khẩu SMTP được tạo ra nên được coi là thông tin xác thực nhạy cảm và lưu trữ an toàn trong cấu hình thiết bị.

Thường xuyên xem xét và thay đổi mật khẩu SMTP, đặc biệt sau khi có thay đổi nhân sự hoặc sự cố bảo mật. Forward Email cho phép tạo lại mật khẩu mà không ảnh hưởng đến các chức năng khác của tài khoản.

Tránh sử dụng thông tin xác thực dùng chung cho nhiều thiết bị nếu có thể. Mặc dù Forward Email hỗ trợ nhiều thiết bị kết nối với cùng thông tin xác thực, nhưng thông tin xác thực riêng cho từng thiết bị cung cấp khả năng cô lập bảo mật và kiểm tra tốt hơn.

Ghi chép thông tin xác thực thiết bị một cách an toàn và đưa vào hệ thống quản lý thông tin xác thực của tổ chức bạn. Việc ghi chép đúng cách đảm bảo cấu hình email có thể được duy trì và cập nhật khi cần thiết.

### Bảo Mật Mạng {#network-security}

Triển khai phân đoạn mạng phù hợp để cô lập các thiết bị khỏi các tài nguyên mạng khác trong khi vẫn duy trì kết nối cần thiết cho thông báo email và truy cập hợp lệ.

Cấu hình các quy tắc tường lửa để cho phép lưu lượng SMTP cần thiết đồng thời chặn truy cập mạng không cần thiết. Các thiết bị thường chỉ cần truy cập ra ngoài đến các máy chủ SMTP của Forward Email để gửi thông báo.

Giám sát lưu lượng mạng từ các thiết bị để phát hiện các mẫu bất thường hoặc các cố gắng giao tiếp trái phép. Hoạt động mạng bất thường có thể chỉ ra các vấn đề bảo mật cần điều tra.

Xem xét sử dụng VLAN hoặc phân đoạn mạng riêng cho lưu lượng quản lý thiết bị, bao gồm thông báo email, để cung cấp thêm sự cô lập bảo mật.

### Tiết Lộ Thông Tin {#information-disclosure}

Xem xét nội dung các thông báo email để đảm bảo chúng không chứa thông tin nhạy cảm có thể hữu ích cho kẻ tấn công. Một số thiết bị bao gồm thông tin hệ thống chi tiết, cấu hình mạng hoặc đường dẫn tập tin trong email thông báo.
Cấu hình lọc thông báo để giới hạn các loại thông tin được bao gồm trong cảnh báo email. Nhiều thiết bị cho phép tùy chỉnh nội dung thông báo nhằm cân bằng giữa thông tin hữu ích và yêu cầu bảo mật.

Thực hiện các chính sách lưu giữ và xử lý email phù hợp cho các thông báo thiết bị. Các thông báo liên quan đến bảo mật có thể cần được lưu giữ để tuân thủ hoặc phục vụ mục đích pháp y.

Xem xét mức độ nhạy cảm của địa chỉ email người nhận và đảm bảo rằng thông báo chỉ được gửi đến những nhân sự được ủy quyền cần truy cập thông tin.

### Giám sát và Bảo trì {#monitoring-and-maintenance}

Thường xuyên kiểm tra cấu hình thông báo email để đảm bảo chức năng liên tục. Việc kiểm tra định kỳ giúp phát hiện sự lệch cấu hình, thay đổi mạng hoặc sự cố dịch vụ trước khi chúng ảnh hưởng đến việc gửi cảnh báo quan trọng.

Giám sát các mẫu thông báo email để phát hiện dấu hiệu hoạt động đáng ngờ hoặc các cố gắng truy cập trái phép. Lượng thông báo bất thường hoặc các sự kiện hệ thống không mong đợi có thể chỉ ra các vấn đề bảo mật.

Giữ firmware thiết bị được cập nhật khi có thể để duy trì các tiêu chuẩn bảo mật hiện hành và hỗ trợ giao thức. Mặc dù một số thiết bị đã hết vòng đời, việc áp dụng các bản cập nhật bảo mật có sẵn giúp bảo vệ chống lại các lỗ hổng đã biết.

Triển khai các phương pháp thông báo dự phòng cho các cảnh báo quan trọng khi có thể. Mặc dù thông báo qua email đáng tin cậy, việc có các cơ chế cảnh báo thay thế cung cấp sự dự phòng cho các sự kiện hệ thống quan trọng nhất.


## Kết luận {#conclusion}

Cấu hình thông báo email đáng tin cậy trên các hệ sinh thái thiết bị đa dạng đòi hỏi hiểu biết về bối cảnh phức tạp của khả năng tương thích TLS, các phương thức xác thực và yêu cầu riêng của nhà sản xuất. Dịch vụ SMTP toàn diện của Forward Email giải quyết những thách thức này bằng cách cung cấp cả tiêu chuẩn bảo mật hiện đại cho các thiết bị hiện tại và khả năng tương thích với thiết bị cũ không thể cập nhật.

Quy trình cấu hình được trình bày trong hướng dẫn này cung cấp các chỉ dẫn chi tiết, từng bước cho các loại thiết bị chính, đảm bảo quản trị viên có thể thiết lập thông báo email đáng tin cậy bất kể sự đa dạng thiết bị của họ. Chiến lược hai cổng của Forward Email đặc biệt giải quyết cuộc khủng hoảng tương thích TLS ảnh hưởng đến hàng triệu thiết bị đã triển khai, cung cấp giải pháp thực tiễn duy trì bảo mật đồng thời đảm bảo chức năng liên tục.

Việc kiểm tra và bảo trì định kỳ cấu hình thông báo email đảm bảo độ tin cậy liên tục và giúp phát hiện các vấn đề tiềm ẩn trước khi chúng ảnh hưởng đến việc gửi cảnh báo quan trọng. Tuân thủ các thực hành bảo mật tốt nhất và hướng dẫn khắc phục sự cố trong hướng dẫn này giúp duy trì hệ thống thông báo an toàn, đáng tin cậy, giữ cho quản trị viên luôn được thông báo về trạng thái thiết bị và các sự kiện bảo mật.

Dù quản lý một văn phòng nhỏ với các thương hiệu máy in và camera hỗn hợp hay giám sát môi trường doanh nghiệp với hàng trăm thiết bị, Forward Email cung cấp hạ tầng và khả năng tương thích cần thiết cho các thông báo email đáng tin cậy. Tập trung của dịch vụ chúng tôi vào khả năng tương thích thiết bị, kết hợp với tài liệu và hỗ trợ toàn diện, đảm bảo các cảnh báo hệ thống quan trọng đến được bạn khi bạn cần nhất.

Để được hỗ trợ thêm về cấu hình email thiết bị hoặc các câu hỏi về khả năng tương thích của Forward Email với thiết bị cụ thể, hãy truy cập [Câu hỏi thường gặp về cấu hình máy chủ SMTP](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi. Chúng tôi cam kết giúp bạn duy trì các thông báo email đáng tin cậy trên tất cả các thiết bị kết nối mạng của bạn, bất kể tuổi đời hay giới hạn của nhà sản xuất.
