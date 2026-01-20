# Thực hành bảo mật {#security-practices}

<img loading="lazy" src="/img/articles/security.webp" alt="Forward Email security practices" class="rounded-lg" />

## Mục lục {#table-of-contents}

* [Lời nói đầu](#foreword)
* [An ninh cơ sở hạ tầng](#infrastructure-security)
  * [Trung tâm dữ liệu an toàn](#secure-data-centers)
  * [Bảo mật mạng](#network-security)
* [Bảo mật email](#email-security)
  * [Mã hóa](#encryption)
  * [Xác thực và Ủy quyền](#authentication-and-authorization)
  * [Các biện pháp chống lạm dụng](#anti-abuse-measures)
* [Bảo vệ dữ liệu](#data-protection)
  * [Giảm thiểu dữ liệu](#data-minimization)
  * [Sao lưu và Phục hồi](#backup-and-recovery)
* [Nhà cung cấp dịch vụ](#service-providers)
* [Tuân thủ và Kiểm toán](#compliance-and-auditing)
  * [Đánh giá an ninh thường xuyên](#regular-security-assessments)
  * [Sự tuân thủ](#compliance)
* [Phản ứng sự cố](#incident-response)
* [Vòng đời phát triển bảo mật](#security-development-lifecycle)
* [Làm cứng máy chủ](#server-hardening)
* [Thỏa thuận mức dịch vụ](#service-level-agreement)
* [Bảo mật nguồn mở](#open-source-security)
* [An ninh nhân viên](#employee-security)
* [Cải tiến liên tục](#continuous-improvement)
* [Tài nguyên bổ sung](#additional-resources)

## Lời nói đầu {#foreword}

Tại Forward Email, bảo mật là ưu tiên hàng đầu của chúng tôi. Chúng tôi đã triển khai các biện pháp bảo mật toàn diện để bảo vệ thông tin liên lạc qua email và dữ liệu cá nhân của bạn. Tài liệu này nêu rõ các biện pháp bảo mật và các bước chúng tôi thực hiện để đảm bảo tính bảo mật, toàn vẹn và khả dụng của email của bạn.

## Bảo mật cơ sở hạ tầng {#infrastructure-security}

### Trung tâm dữ liệu an toàn {#secure-data-centers}

Cơ sở hạ tầng của chúng tôi được lưu trữ tại các trung tâm dữ liệu tuân thủ SOC 2 với:

* An ninh và giám sát vật lý 24/7
* Kiểm soát ra vào bằng sinh trắc học
* Hệ thống điện dự phòng
* Phát hiện và chữa cháy tiên tiến
* Giám sát môi trường

### Bảo mật mạng {#network-security}

Chúng tôi triển khai nhiều lớp bảo mật mạng:

* Tường lửa cấp doanh nghiệp với danh sách kiểm soát truy cập nghiêm ngặt
* Bảo vệ và giảm thiểu DDoS
* Quét lỗ hổng mạng thường xuyên
* Hệ thống phát hiện và ngăn chặn xâm nhập
* Mã hóa lưu lượng giữa tất cả các điểm cuối dịch vụ
* Bảo vệ quét cổng với tính năng tự động chặn hoạt động đáng ngờ

> \[!IMPORTANT]
> Mọi dữ liệu đang truyền đi đều được mã hóa bằng TLS 1.2+ với bộ mã hóa hiện đại.

## Bảo mật Email {#email-security}

### Mã hóa {#encryption}

* **Bảo mật lớp truyền tải (TLS)**: Toàn bộ lưu lượng email được mã hóa khi truyền tải bằng TLS 1.2 trở lên
* **Mã hóa đầu cuối**: Hỗ trợ các tiêu chuẩn OpenPGP/MIME và S/MIME
* **Mã hóa lưu trữ**: Tất cả email được lưu trữ đều được mã hóa khi lưu trữ bằng mã hóa ChaCha20-Poly1305 trong các tệp SQLite
* **Mã hóa toàn bộ ổ đĩa**: Mã hóa LUKS v2 cho toàn bộ ổ đĩa
* **Bảo vệ toàn diện**: Chúng tôi triển khai mã hóa khi lưu trữ, mã hóa trong bộ nhớ và mã hóa khi truyền tải

> \[!NOTE]
> Chúng tôi là dịch vụ email đầu tiên và duy nhất trên thế giới sử dụng **[hộp thư SQLite chống lượng tử và được mã hóa riêng lẻ](https://forwardemail.net/en/blog/docs/best-quantum-safe-encrypted-email-service)**.

### Xác thực và Ủy quyền {#authentication-and-authorization}

* **Ký DKIM**: Tất cả email gửi đi đều được ký bằng DKIM
* **SPF và DMARC**: Hỗ trợ đầy đủ SPF và DMARC để ngăn chặn email giả mạo
* **MTA-STS**: Hỗ trợ MTA-STS để thực thi mã hóa TLS
* **Xác thực đa yếu tố**: Có sẵn cho tất cả quyền truy cập tài khoản

### Biện pháp chống lạm dụng {#anti-abuse-measures}

* **Lọc thư rác**: Phát hiện thư rác nhiều lớp với công nghệ học máy
* **Quét vi-rút**: Quét tất cả tệp đính kèm theo thời gian thực
* **Giới hạn tốc độ**: Bảo vệ chống lại các cuộc tấn công brute force và enumeration
* **Danh tiếng IP**: Theo dõi danh tiếng IP gửi
* **Lọc nội dung**: Phát hiện URL độc hại và các nỗ lực lừa đảo

## Bảo vệ dữ liệu {#data-protection}

### Giảm thiểu dữ liệu {#data-minimization}

Chúng tôi tuân theo nguyên tắc giảm thiểu dữ liệu:

* Chúng tôi chỉ thu thập dữ liệu cần thiết để cung cấp dịch vụ
* Nội dung email được xử lý trong bộ nhớ và không được lưu trữ liên tục trừ khi cần thiết cho việc phân phối IMAP/POP3
* Nhật ký được ẩn danh và chỉ được lưu giữ trong thời gian cần thiết

### Sao lưu và Phục hồi {#backup-and-recovery}

* Sao lưu tự động hàng ngày với mã hóa
* Lưu trữ sao lưu phân tán theo địa lý
* Kiểm tra khôi phục sao lưu thường xuyên
* Quy trình phục hồi sau thảm họa với RPO và RTO được xác định

## Nhà cung cấp dịch vụ {#service-providers}

Chúng tôi lựa chọn kỹ lưỡng các nhà cung cấp dịch vụ để đảm bảo họ đáp ứng các tiêu chuẩn bảo mật cao của chúng tôi. Dưới đây là danh sách các nhà cung cấp chúng tôi sử dụng để truyền dữ liệu quốc tế và tình trạng tuân thủ GDPR của họ:

| Nhà cung cấp | Mục đích | Được chứng nhận DPF | Trang tuân thủ GDPR |
| --------------------------------------------- | ------------------------- | ------------- | ----------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com) | CDN, bảo vệ DDoS, DNS | ✅ Có | [Cloudflare GDPR](https://www.cloudflare.com/trust-hub/gdpr/) |
| [DataPacket](https://www.datapacket.com) | Cơ sở hạ tầng máy chủ | ❌ Không | [DataPacket Privacy](https://www.datapacket.com/privacy-policy) |
| [Digital Ocean](https://www.digitalocean.com) | Cơ sở hạ tầng đám mây | ❌ Không | [DigitalOcean GDPR](https://www.digitalocean.com/legal/gdpr) |
| [Vultr](https://www.vultr.com) | Cơ sở hạ tầng đám mây | ❌ Không | [Vultr GDPR](https://www.vultr.com/legal/eea-gdpr-privacy/) |
| [Stripe](https://stripe.com) | Xử lý thanh toán | ✅ Có | [Stripe Privacy Center](https://stripe.com/legal/privacy-center) |
| [PayPal](https://www.paypal.com) | Xử lý thanh toán | ❌ Không | [PayPal Privacy](https://www.paypal.com/uk/legalhub/privacy-full) |

Chúng tôi sử dụng các nhà cung cấp này để đảm bảo cung cấp dịch vụ đáng tin cậy và an toàn, đồng thời tuân thủ các quy định bảo vệ dữ liệu quốc tế. Mọi hoạt động truyền dữ liệu đều được thực hiện với các biện pháp bảo vệ phù hợp để bảo vệ thông tin cá nhân của bạn.

## Tuân thủ và Kiểm toán {#compliance-and-auditing}

### Đánh giá bảo mật thường xuyên {#regular-security-assessments}

Đội ngũ của chúng tôi thường xuyên giám sát, xem xét và đánh giá cơ sở mã, máy chủ, cơ sở hạ tầng và các hoạt động thực tiễn. Chúng tôi triển khai một chương trình bảo mật toàn diện bao gồm:

* Thay đổi khóa SSH thường xuyên
* Liên tục theo dõi nhật ký truy cập
* Quét bảo mật tự động
* Quản lý lỗ hổng chủ động
* Đào tạo bảo mật thường xuyên cho tất cả thành viên trong nhóm

### Tuân thủ {#compliance}

* [GDPR](https://forwardemail.net/gdpr) thực hành xử lý dữ liệu tuân thủ
* [Thỏa thuận xử lý dữ liệu (DPA)](https://forwardemail.net/dpa) dành cho khách hàng doanh nghiệp
* Các biện pháp kiểm soát quyền riêng tư tuân thủ CCPA
* Quy trình được kiểm toán SOC 2 Loại II

## Phản hồi sự cố {#incident-response}

Kế hoạch ứng phó sự cố bảo mật của chúng tôi bao gồm:

1. **Phát hiện**: Hệ thống giám sát và cảnh báo tự động
2. **Kiềm chế**: Cô lập ngay lập tức các hệ thống bị ảnh hưởng
3. **Xóa bỏ**: Loại bỏ mối đe dọa và phân tích nguyên nhân gốc rễ
4. **Phục hồi**: Khôi phục dịch vụ an toàn
5. **Thông báo**: Liên lạc kịp thời với người dùng bị ảnh hưởng
6. **Phân tích sau sự cố**: Đánh giá và cải thiện toàn diện

> \[!WARNING]
> Nếu bạn phát hiện lỗ hổng bảo mật, vui lòng báo cáo ngay cho <security@forwardemail.net>.

## Vòng đời phát triển bảo mật {#security-development-lifecycle}

```mermaid
flowchart LR
    A[Requirements] --> B[Design]
    B --> C[Implementation]
    C --> D[Verification]
    D --> E[Release]
    E --> F[Maintenance]
    F --> A
    B -.-> G[Threat Modeling]
    C -.-> H[Static Analysis]
    D -.-> I[Security Testing]
    E -.-> J[Final Security Review]
    F -.-> K[Vulnerability Management]
```

Tất cả mã đều trải qua:

* Thu thập yêu cầu bảo mật
* Mô hình hóa mối đe dọa trong quá trình thiết kế
* Thực hành mã hóa an toàn
* Kiểm tra bảo mật ứng dụng tĩnh và động
* Đánh giá mã với trọng tâm bảo mật
* Quét lỗ hổng phụ thuộc

## Bảo mật máy chủ {#server-hardening}

[Cấu hình Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible) của chúng tôi triển khai nhiều biện pháp tăng cường bảo mật máy chủ:

* **Tắt Truy cập USB**: Các cổng vật lý bị vô hiệu hóa bằng cách đưa mô-đun hạt nhân lưu trữ USB vào danh sách đen
* **Quy tắc Tường lửa**: Các quy tắc iptables nghiêm ngặt chỉ cho phép các kết nối cần thiết
* **Bảo mật SSH**: Chỉ xác thực bằng khóa, không đăng nhập bằng mật khẩu, vô hiệu hóa đăng nhập root
* **Cô lập Dịch vụ**: Mỗi dịch vụ chạy với các đặc quyền tối thiểu cần thiết
* **Cập nhật Tự động**: Các bản vá bảo mật được tự động áp dụng
* **Khởi động An toàn**: Quy trình khởi động được xác minh để ngăn chặn giả mạo
* **Bảo mật Hạt nhân**: Bảo mật các tham số hạt nhân và cấu hình sysctl
* **Hạn chế Hệ thống Tệp**: Các tùy chọn gắn kết noexec, nosuid và nodev khi thích hợp
* **Tắt Core Dumps**: Hệ thống được cấu hình để ngăn chặn core dumps vì lý do bảo mật
* **Tắt Swap**: Tắt bộ nhớ Swap để ngăn chặn rò rỉ dữ liệu
* **Bảo vệ Quét Cổng**: Tự động phát hiện và chặn các nỗ lực quét cổng
* **Tắt Trang Khổng lồ Trong suốt**: Tắt THP để cải thiện hiệu suất và bảo mật
* **Bảo mật Dịch vụ Hệ thống**: Các dịch vụ không cần thiết như Apport đã bị vô hiệu hóa
* **Quản lý người dùng**: Nguyên tắc đặc quyền tối thiểu với người dùng triển khai và devops riêng biệt
* **Giới hạn mô tả tệp**: Tăng giới hạn để cải thiện hiệu suất và bảo mật

## Thỏa thuận mức dịch vụ {#service-level-agreement}

Chúng tôi duy trì mức độ sẵn sàng và độ tin cậy dịch vụ cao. Cơ sở hạ tầng của chúng tôi được thiết kế để dự phòng và chịu lỗi, đảm bảo dịch vụ email của bạn luôn hoạt động. Mặc dù chúng tôi không công bố tài liệu SLA chính thức, chúng tôi cam kết:

* Thời gian hoạt động 99,9%+ cho tất cả các dịch vụ
* Phản hồi nhanh chóng khi có sự cố dịch vụ
* Giao tiếp minh bạch trong quá trình xảy ra sự cố
* Bảo trì thường xuyên trong thời gian lưu lượng truy cập thấp

## Bảo mật nguồn mở {#open-source-security}

Với tư cách là [dịch vụ nguồn mở](https://github.com/forwardemail/forwardemail.net), quyền bảo mật của chúng tôi được hưởng lợi từ:

* Mã minh bạch, có thể được kiểm tra bởi bất kỳ ai
* Cải tiến bảo mật do cộng đồng thúc đẩy
* Xác định và vá lỗ hổng nhanh chóng
* Không có bảo mật thông qua sự mơ hồ

## Bảo mật nhân viên {#employee-security}

* Kiểm tra lý lịch của tất cả nhân viên
* Đào tạo nhận thức an ninh
* Nguyên tắc tiếp cận đặc quyền tối thiểu
* Đào tạo an ninh thường xuyên

## Cải tiến liên tục {#continuous-improvement}

Chúng tôi liên tục cải thiện khả năng bảo mật của mình thông qua:

* Theo dõi các xu hướng bảo mật và các mối đe dọa mới nổi
* Thường xuyên rà soát và cập nhật các chính sách bảo mật
* Phản hồi từ các nhà nghiên cứu bảo mật và người dùng
* Tham gia vào cộng đồng bảo mật

Để biết thêm thông tin về các hoạt động bảo mật của chúng tôi hoặc để báo cáo các vấn đề bảo mật, vui lòng liên hệ <security@forwardemail.net>.

## Tài nguyên bổ sung {#additional-resources}

* [Chính sách bảo mật](https://forwardemail.net/en/privacy)
* [Điều khoản dịch vụ](https://forwardemail.net/en/terms)
* [Tuân thủ GDPR](https://forwardemail.net/gdpr)
* [Thỏa thuận xử lý dữ liệu (DPA)](https://forwardemail.net/dpa)
* [Báo cáo lạm dụng](https://forwardemail.net/en/report-abuse)
* [Chính sách bảo mật](https://github.com/forwardemail/.github/blob/main/SECURITY.md)
* [Security.txt](https://forwardemail.net/security.txt)
* [Kho lưu trữ GitHub](https://github.com/forwardemail/forwardemail.net)
* [FAQ](https://forwardemail.net/en/faq)