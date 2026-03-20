# Listmonk với Forward Email để Gửi Bản Tin An Toàn {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Mục Lục {#table-of-contents}

* [Tổng Quan](#overview)
* [Tại Sao Chọn Listmonk và Forward Email](#why-listmonk-and-forward-email)
* [Yêu Cầu Trước](#prerequisites)
* [Cài Đặt](#installation)
  * [1. Cập Nhật Máy Chủ](#1-update-your-server)
  * [2. Cài Đặt Các Phụ Thuộc](#2-install-dependencies)
  * [3. Tải Cấu Hình Listmonk](#3-download-listmonk-configuration)
  * [4. Cấu Hình Tường Lửa (UFW)](#4-configure-firewall-ufw)
  * [5. Cấu Hình Truy Cập HTTPS](#5-configure-https-access)
  * [6. Khởi Động Listmonk](#6-start-listmonk)
  * [7. Cấu Hình SMTP Forward Email trong Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Cấu Hình Xử Lý Bounce](#8-configure-bounce-processing)
* [Kiểm Tra](#testing)
  * [Tạo Danh Sách Gửi Thư](#create-a-mailing-list)
  * [Thêm Người Đăng Ký](#add-subscribers)
  * [Tạo và Gửi Chiến Dịch](#create-and-send-a-campaign)
* [Xác Minh](#verification)
* [Ghi Chú Dành Cho Nhà Phát Triển](#developer-notes)
* [Kết Luận](#conclusion)


## Tổng Quan {#overview}

Hướng dẫn này cung cấp cho các nhà phát triển các bước chi tiết để thiết lập [Listmonk](https://listmonk.app/), một công cụ quản lý bản tin và danh sách gửi thư mã nguồn mở mạnh mẽ, sử dụng [Forward Email](https://forwardemail.net/) làm nhà cung cấp SMTP. Sự kết hợp này cho phép bạn quản lý chiến dịch hiệu quả đồng thời đảm bảo việc gửi email an toàn, riêng tư và đáng tin cậy.

* **Listmonk**: Quản lý người đăng ký, tổ chức danh sách, tạo chiến dịch và theo dõi hiệu suất.
* **Forward Email**: Đóng vai trò là máy chủ SMTP an toàn, xử lý việc gửi email thực tế với các tính năng bảo mật tích hợp như SPF, DKIM, DMARC và mã hóa TLS.

Bằng cách tích hợp hai công cụ này, bạn giữ quyền kiểm soát hoàn toàn dữ liệu và hạ tầng của mình trong khi tận dụng hệ thống gửi thư mạnh mẽ của Forward Email.


## Tại Sao Chọn Listmonk và Forward Email {#why-listmonk-and-forward-email}

* **Mã Nguồn Mở**: Cả Listmonk và nguyên tắc của Forward Email đều nhấn mạnh tính minh bạch và kiểm soát. Bạn tự lưu trữ Listmonk, sở hữu dữ liệu của mình.
* **Tập Trung Vào Quyền Riêng Tư**: Forward Email được xây dựng với trọng tâm là quyền riêng tư, giảm thiểu lưu trữ dữ liệu và tập trung vào truyền tải an toàn.
* **Tiết Kiệm Chi Phí**: Listmonk miễn phí, Forward Email cung cấp các gói miễn phí hào phóng và các gói trả phí hợp lý, tạo thành giải pháp tiết kiệm ngân sách.
* **Khả Năng Mở Rộng**: Listmonk có hiệu suất cao, hạ tầng của Forward Email được thiết kế để gửi thư đáng tin cậy ở quy mô lớn.
* **Thân Thiện Với Nhà Phát Triển**: Listmonk cung cấp API mạnh mẽ, Forward Email hỗ trợ tích hợp SMTP đơn giản và webhook.


## Yêu Cầu Trước {#prerequisites}

Trước khi bắt đầu, hãy đảm bảo bạn có những điều sau:

* Một máy chủ riêng ảo (VPS) chạy bản phân phối Linux mới (khuyến nghị Ubuntu 20.04+), với ít nhất 1 CPU và 1GB RAM (khuyến nghị 2GB).
  * Cần nhà cung cấp? Xem danh sách [nhà cung cấp VPS được đề xuất](https://github.com/forwardemail/awesome-mail-server-providers).
* Một tên miền bạn kiểm soát (cần truy cập DNS).
* Tài khoản hoạt động với [Forward Email](https://forwardemail.net/).
* Quyền truy cập root hoặc `sudo` trên VPS của bạn.
* Hiểu biết cơ bản về thao tác dòng lệnh Linux.


## Cài Đặt {#installation}

Các bước này hướng dẫn bạn cài đặt Listmonk sử dụng Docker và Docker Compose trên VPS của bạn.

### 1. Cập Nhật Máy Chủ {#1-update-your-server}

Đảm bảo danh sách gói và các gói đã cài đặt trên hệ thống của bạn được cập nhật.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Cài Đặt Các Phụ Thuộc {#2-install-dependencies}

Cài đặt Docker, Docker Compose và UFW (Tường lửa đơn giản).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Tải Cấu Hình Listmonk {#3-download-listmonk-configuration}

Tạo thư mục cho Listmonk và tải file `docker-compose.yml` chính thức.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

File này định nghĩa container ứng dụng Listmonk và container cơ sở dữ liệu PostgreSQL cần thiết.
### 4. Cấu hình Tường lửa (UFW) {#4-configure-firewall-ufw}

Cho phép lưu lượng thiết yếu (SSH, HTTP, HTTPS) qua tường lửa. Nếu SSH của bạn chạy trên cổng không chuẩn, hãy điều chỉnh cho phù hợp.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Xác nhận bật tường lửa khi được yêu cầu.

### 5. Cấu hình Truy cập HTTPS {#5-configure-https-access}

Chạy Listmonk qua HTTPS rất quan trọng để đảm bảo bảo mật. Bạn có hai lựa chọn chính:

#### Lựa chọn A: Sử dụng Proxy Cloudflare (Khuyến nghị để đơn giản) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Nếu DNS của tên miền bạn được quản lý bởi Cloudflare, bạn có thể tận dụng tính năng proxy của họ để dễ dàng có HTTPS.

1. **Trỏ DNS**: Tạo một bản ghi `A` trong Cloudflare cho tên miền phụ Listmonk của bạn (ví dụ: `listmonk.yourdomain.com`) trỏ đến địa chỉ IP VPS của bạn. Đảm bảo **Trạng thái Proxy** được đặt thành **Proxied** (đám mây màu cam).
2. **Sửa Docker Compose**: Chỉnh sửa file `docker-compose.yml` bạn đã tải về:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Điều này giúp Listmonk có thể truy cập nội bộ trên cổng 80, mà Cloudflare có thể proxy và bảo mật bằng HTTPS.

#### Lựa chọn B: Sử dụng Reverse Proxy (Nginx, Caddy, v.v.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Ngoài ra, bạn có thể thiết lập reverse proxy như Nginx hoặc Caddy trên VPS của bạn để xử lý việc kết thúc HTTPS và proxy các yêu cầu đến Listmonk (chạy mặc định trên cổng 9000).

* Giữ mặc định `ports: - "127.0.0.1:9000:9000"` trong `docker-compose.yml` để đảm bảo Listmonk chỉ truy cập được từ localhost.
* Cấu hình reverse proxy bạn chọn để lắng nghe trên cổng 80 và 443, xử lý việc lấy chứng chỉ SSL (ví dụ qua Let's Encrypt), và chuyển tiếp lưu lượng đến `http://127.0.0.1:9000`.
* Việc thiết lập reverse proxy chi tiết vượt quá phạm vi hướng dẫn này, nhưng có nhiều bài hướng dẫn có sẵn trên mạng.

### 6. Khởi động Listmonk {#6-start-listmonk}

Quay lại thư mục `listmonk` của bạn (nếu bạn chưa ở đó) và khởi động các container ở chế độ nền.

```bash
cd ~/listmonk # Hoặc thư mục bạn đã lưu docker-compose.yml
docker compose up -d
```

Docker sẽ tải các image cần thiết và khởi động ứng dụng Listmonk cùng các container cơ sở dữ liệu. Lần đầu có thể mất một hoặc hai phút.

✅ **Truy cập Listmonk**: Bây giờ bạn có thể truy cập giao diện web Listmonk qua tên miền bạn đã cấu hình (ví dụ: `https://listmonk.yourdomain.com`).

### 7. Cấu hình Forward Email SMTP trong Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Tiếp theo, cấu hình Listmonk để gửi email sử dụng tài khoản Forward Email của bạn.

1. **Bật SMTP trong Forward Email**: Đảm bảo bạn đã tạo thông tin đăng nhập SMTP trong bảng điều khiển tài khoản Forward Email của bạn. Nếu chưa, hãy làm theo [hướng dẫn Forward Email để gửi email với tên miền tùy chỉnh qua SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp).
2. **Cấu hình Listmonk**: Đăng nhập vào bảng quản trị Listmonk.
   * Điều hướng đến **Settings -> SMTP**.

   * Listmonk hỗ trợ tích hợp sẵn Forward Email. Chọn **ForwardEmail** từ danh sách nhà cung cấp, hoặc nhập thủ công các thông tin sau:

     | Cài đặt           | Giá trị                                                                                                             |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                            |
     | **Port**          | `465`                                                                                                              |
     | **Giao thức Auth**| `LOGIN`                                                                                                            |
     | **Tên đăng nhập** | Tên đăng nhập **SMTP** của bạn trên Forward Email                                                                 |
     | **Mật khẩu**      | Mật khẩu **SMTP** của bạn trên Forward Email                                                                       |
     | **TLS**           | `SSL/TLS`                                                                                                          |
     | **Email gửi đi**  | Địa chỉ `From` bạn muốn (ví dụ: `newsletter@yourdomain.com`). Đảm bảo tên miền này đã được cấu hình trong Forward Email. |
* **Quan trọng**: Luôn sử dụng Cổng `465` với `SSL/TLS` để kết nối an toàn với Forward Email (được khuyến nghị). Cổng `587` với STARTTLS cũng được hỗ trợ nhưng SSL/TLS được ưu tiên.

   * Nhấn **Lưu**.
3. **Gửi Email Thử**: Sử dụng nút "Gửi Email Thử" trong trang cài đặt SMTP. Nhập địa chỉ người nhận mà bạn có thể truy cập và nhấn **Gửi**. Xác nhận rằng email đã đến hộp thư người nhận.

### 8. Cấu hình Xử lý Bounce {#8-configure-bounce-processing}

Xử lý bounce cho phép Listmonk tự động xử lý các email không thể gửi được (ví dụ: do địa chỉ không hợp lệ). Forward Email cung cấp một webhook để thông báo cho Listmonk về các bounce.

#### Cài đặt Forward Email {#forward-email-setup}

1. Đăng nhập vào [Bảng điều khiển Forward Email](https://forwardemail.net/).
2. Điều hướng đến **Domains**, chọn tên miền bạn đang sử dụng để gửi, và vào trang **Settings** của nó.
3. Cuộn xuống phần **Bounce Webhook URL**.
4. Nhập URL sau, thay thế `<your_listmonk_domain>` bằng tên miền hoặc tên miền phụ thực tế nơi bạn truy cập được Listmonk:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Ví dụ*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Tiếp tục cuộn xuống phần **Webhook Signature Payload Verification Key**.
6. **Sao chép** khóa xác thực được tạo. Bạn sẽ cần khóa này trong Listmonk.
7. Lưu các thay đổi trong cài đặt tên miền Forward Email của bạn.

#### Cài đặt Listmonk {#listmonk-setup}

1. Trong bảng quản trị Listmonk, điều hướng đến **Settings -> Bounces**.
2. Bật **Enable bounce processing**.
3. Bật **Enable bounce webhooks**.
4. Cuộn xuống phần **Webhook Providers**.
5. Bật **Forward Email**.
6. Dán **Webhook Signature Payload Verification Key** bạn đã sao chép từ bảng điều khiển Forward Email vào trường **Forward Email Key**.
7. Nhấn **Lưu** ở cuối trang.
8. Xử lý bounce đã được cấu hình! Khi Forward Email phát hiện một bounce cho email được gửi bởi Listmonk, nó sẽ thông báo cho instance Listmonk của bạn qua webhook, và Listmonk sẽ đánh dấu người đăng ký tương ứng.
9. Hoàn thành các bước dưới đây trong [Testing](#testing) để đảm bảo mọi thứ hoạt động.

## Kiểm tra {#testing}

Dưới đây là tổng quan nhanh về các chức năng cốt lõi của Listmonk:

### Tạo Danh sách Gửi thư {#create-a-mailing-list}

* Vào **Lists** trong thanh bên.
* Nhấn **New List**.
* Điền thông tin chi tiết (Tên, Loại: Công khai/Riêng tư, Mô tả, Thẻ) và **Lưu**.

### Thêm Người đăng ký {#add-subscribers}

* Điều hướng đến phần **Subscribers**.
* Bạn có thể thêm người đăng ký:
  * **Thủ công**: Nhấn **New Subscriber**.
  * **Nhập khẩu**: Nhấn **Import Subscribers** để tải lên file CSV.
  * **API**: Sử dụng API của Listmonk để thêm tự động.
* Gán người đăng ký vào một hoặc nhiều danh sách trong quá trình tạo hoặc nhập khẩu.
* **Thực hành tốt nhất**: Sử dụng quy trình double opt-in. Cấu hình điều này trong **Settings -> Opt-in & Subscriptions**.

### Tạo và Gửi Chiến dịch {#create-and-send-a-campaign}

* Vào **Campaigns** -> **New Campaign**.
* Điền thông tin chiến dịch (Tên, Chủ đề, Email người gửi, Danh sách gửi).
* Chọn loại nội dung (Rich Text/HTML, Plain Text, Raw HTML).
* Soạn nội dung email. Bạn có thể sử dụng biến mẫu như `{{ .Subscriber.Email }}` hoặc `{{ .Subscriber.FirstName }}`.
* **Luôn gửi email thử trước!** Sử dụng tùy chọn "Send Test" để xem trước email trong hộp thư của bạn.
* Khi hài lòng, nhấn **Start Campaign** để gửi ngay hoặc lên lịch gửi sau.

## Xác minh {#verification}

* **Giao hàng SMTP**: Thường xuyên gửi email thử qua trang cài đặt SMTP của Listmonk và các chiến dịch thử để đảm bảo email được gửi đúng.
* **Xử lý Bounce**: Gửi chiến dịch thử đến địa chỉ email không hợp lệ đã biết (ví dụ: `bounce-test@yourdomain.com` nếu bạn không có địa chỉ thực, mặc dù kết quả có thể khác nhau). Kiểm tra thống kê chiến dịch trong Listmonk sau một thời gian ngắn để xem bounce có được ghi nhận không.
* **Tiêu đề Email**: Sử dụng các công cụ như [Mail-Tester](https://www.mail-tester.com/) hoặc kiểm tra thủ công tiêu đề email để xác minh SPF, DKIM và DMARC đều hợp lệ, cho thấy cấu hình đúng qua Forward Email.
* **Nhật ký Forward Email**: Kiểm tra nhật ký trong bảng điều khiển Forward Email nếu bạn nghi ngờ có sự cố giao hàng phát sinh từ máy chủ SMTP.
## Developer Notes {#developer-notes}

* **Templating**: Listmonk sử dụng engine templating của Go. Khám phá tài liệu của nó để cá nhân hóa nâng cao: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk cung cấp một REST API toàn diện để quản lý danh sách, người đăng ký, chiến dịch, mẫu và nhiều hơn nữa. Tìm liên kết tài liệu API trong phần chân trang của phiên bản Listmonk của bạn.
* **Custom Fields**: Định nghĩa các trường người đăng ký tùy chỉnh dưới **Settings -> Subscriber Fields** để lưu trữ dữ liệu bổ sung.
* **Webhooks**: Ngoài các bounce, Listmonk có thể gửi webhook cho các sự kiện khác (ví dụ: đăng ký), cho phép tích hợp với các hệ thống khác.


## Conclusion {#conclusion}

Bằng cách tích hợp sức mạnh tự lưu trữ của Listmonk với việc gửi email an toàn, tôn trọng quyền riêng tư của Forward Email, bạn tạo ra một nền tảng tiếp thị email mạnh mẽ và có đạo đức. Bạn duy trì quyền sở hữu hoàn toàn dữ liệu khán giả của mình trong khi hưởng lợi từ khả năng gửi email cao và các tính năng bảo mật tự động.

Cài đặt này cung cấp một giải pháp thay thế có thể mở rộng, tiết kiệm chi phí và thân thiện với nhà phát triển so với các dịch vụ email độc quyền, phù hợp hoàn hảo với tinh thần phần mềm mã nguồn mở và quyền riêng tư của người dùng.

Chúc bạn gửi email thành công! 🚀
