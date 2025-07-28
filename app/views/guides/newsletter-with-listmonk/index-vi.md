# Listmonk với Email chuyển tiếp để phân phối bản tin an toàn {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Mục lục {#table-of-contents}

* [Tổng quan](#overview)
* [Tại sao Listmonk và Forward Email](#why-listmonk-and-forward-email)
* [Điều kiện tiên quyết](#prerequisites)
* [Cài đặt](#installation)
  * [1. Cập nhật máy chủ của bạn](#1-update-your-server)
  * [2. Cài đặt các phụ thuộc](#2-install-dependencies)
  * [3. Tải xuống cấu hình Listmonk](#3-download-listmonk-configuration)
  * [4. Cấu hình Tường lửa (UFW)](#4-configure-firewall-ufw)
  * [5. Cấu hình truy cập HTTPS](#5-configure-https-access)
  * [6. Bắt đầu Listmonk](#6-start-listmonk)
  * [7. Cấu hình Forward Email SMTP trong Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Cấu hình xử lý Bounce](#8-configure-bounce-processing)
* [Kiểm tra](#testing)
  * [Tạo danh sách gửi thư](#create-a-mailing-list)
  * [Thêm người đăng ký](#add-subscribers)
  * [Tạo và Gửi Chiến dịch](#create-and-send-a-campaign)
* [Xác minh](#verification)
* [Ghi chú của nhà phát triển](#developer-notes)
* [Phần kết luận](#conclusion)

## Tổng quan {#overview}

Hướng dẫn này cung cấp cho các nhà phát triển hướng dẫn từng bước để thiết lập [Danh sáchMonk](https://listmonk.app/), một trình quản lý danh sách gửi thư và bản tin nguồn mở mạnh mẽ, để sử dụng [Chuyển tiếp Email](https://forwardemail.net/) làm nhà cung cấp SMTP. Sự kết hợp này cho phép bạn quản lý các chiến dịch hiệu quả, đồng thời đảm bảo việc gửi email an toàn, riêng tư và đáng tin cậy.

* **Listmonk**: Xử lý việc quản lý người đăng ký, tổ chức danh sách, tạo chiến dịch và theo dõi hiệu suất.
* **Chuyển tiếp Email**: Hoạt động như máy chủ SMTP an toàn, xử lý việc gửi email thực tế với các tính năng bảo mật tích hợp như SPF, DKIM, DMARC và mã hóa TLS.

Bằng cách tích hợp cả hai, bạn vẫn giữ được quyền kiểm soát hoàn toàn đối với dữ liệu và cơ sở hạ tầng của mình đồng thời tận dụng hệ thống phân phối mạnh mẽ của Forward Email.

## Tại sao nên sử dụng Listmonk và Chuyển tiếp Email {#why-listmonk-and-forward-email}

* **Mã nguồn mở**: Cả Listmonk và các nguyên tắc đằng sau Forward Email đều nhấn mạnh vào tính minh bạch và khả năng kiểm soát. Bạn tự lưu trữ Listmonk, sở hữu dữ liệu của mình.
* **Tập trung vào quyền riêng tư**: Forward Email được xây dựng với quyền riêng tư là cốt lõi, giảm thiểu việc lưu giữ dữ liệu và tập trung vào việc truyền tải an toàn.
* **Tiết kiệm chi phí**: Listmonk miễn phí và Forward Email cung cấp các gói miễn phí hào phóng và các gói trả phí phải chăng, khiến đây trở thành giải pháp thân thiện với ngân sách.
* **Khả năng mở rộng**: Listmonk có hiệu suất cao và cơ sở hạ tầng của Forward Email được thiết kế để phân phối đáng tin cậy ở quy mô lớn.
* **Thân thiện với nhà phát triển**: Listmonk cung cấp API mạnh mẽ và Forward Email cung cấp tích hợp SMTP và webhook đơn giản.

## Điều kiện tiên quyết {#prerequisites}

Trước khi bắt đầu, hãy đảm bảo bạn có những điều sau:

* Máy chủ riêng ảo (VPS) chạy bản phân phối Linux mới nhất (khuyến nghị Ubuntu 20.04 trở lên) với ít nhất 1 CPU và 1GB RAM (khuyến nghị 2GB).
* Cần nhà cung cấp? Hãy xem [danh sách VPS được đề xuất](https://github.com/forwardemail/awesome-mail-server-providers).
* Tên miền do bạn kiểm soát (cần quyền truy cập DNS).
* Tài khoản đang hoạt động với [Chuyển tiếp Email](https://forwardemail.net/).
* Quyền truy cập root hoặc `sudo` vào VPS của bạn.
* Nắm vững các thao tác dòng lệnh Linux cơ bản.

## Cài đặt {#installation}

Các bước sau đây sẽ hướng dẫn bạn cài đặt Listmonk bằng Docker và Docker Compose trên VPS của bạn.

### 1. Cập nhật máy chủ của bạn {#1-update-your-server}

Đảm bảo danh sách gói của hệ thống và các gói đã cài đặt được cập nhật.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Cài đặt các phụ thuộc {#2-install-dependencies}

Cài đặt Docker, Docker Compose và UFW (Tường lửa đơn giản).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Tải xuống Cấu hình Listmonk {#3-download-listmonk-configuration}

Tạo thư mục cho Listmonk và tải xuống tệp `docker-compose.yml` chính thức.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Tệp này định nghĩa vùng chứa ứng dụng Listmonk và vùng chứa cơ sở dữ liệu PostgreSQL cần thiết.

### 4. Cấu hình Tường lửa (UFW) {#4-configure-firewall-ufw}

Cho phép lưu lượng truy cập thiết yếu (SSH, HTTP, HTTPS) qua tường lửa. Nếu SSH của bạn chạy trên cổng không chuẩn, hãy điều chỉnh cho phù hợp.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Xác nhận bật tường lửa khi được nhắc.

### 5. Cấu hình quyền truy cập HTTPS {#5-configure-https-access}

Chạy Listmonk qua HTTPS rất quan trọng đối với bảo mật. Bạn có hai lựa chọn chính:

#### Tùy chọn A: Sử dụng Proxy Cloudflare (Khuyến nghị vì tính đơn giản) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Nếu DNS của tên miền của bạn được quản lý bởi Cloudflare, bạn có thể tận dụng tính năng proxy của họ để dễ dàng sử dụng HTTPS.

1. **Trỏ DNS**: Tạo bản ghi `A` trong Cloudflare cho tên miền phụ Listmonk của bạn (ví dụ: `listmonk.yourdomain.com`) trỏ đến địa chỉ IP VPS của bạn. Đảm bảo **Trạng thái proxy** được đặt thành **Đã ủy quyền** (đám mây màu cam).
2. **Sửa đổi Docker Compose**: Chỉnh sửa tệp `docker-compose.yml` mà bạn đã tải xuống:
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Thao tác này cho phép Listmonk có thể truy cập nội bộ trên cổng 80, sau đó Cloudflare có thể ủy quyền và bảo mật bằng HTTPS.

#### Tùy chọn B: Sử dụng Proxy ngược (Nginx, Caddy, v.v.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Ngoài ra, bạn có thể thiết lập proxy ngược như Nginx hoặc Caddy trên VPS của mình để xử lý việc chấm dứt HTTPS và yêu cầu proxy tới Listmonk (chạy trên cổng 9000 theo mặc định).

* Giữ nguyên giá trị mặc định `ports: - "127.0.0.1:9000:9000"` trong `docker-compose.yml` để đảm bảo Listmonk chỉ có thể truy cập cục bộ.
* Cấu hình proxy ngược bạn đã chọn để lắng nghe trên các cổng 80 và 443, xử lý việc lấy chứng chỉ SSL (ví dụ: thông qua Let's Encrypt) và chuyển tiếp lưu lượng đến `http://127.0.0.1:9000`.
* Hướng dẫn này không đề cập chi tiết về thiết lập proxy ngược, nhưng có nhiều hướng dẫn trực tuyến.

### 6. Khởi động Listmonk {#6-start-listmonk}

Quay lại thư mục `listmonk` của bạn (nếu bạn chưa vào đó) và khởi động các vùng chứa ở chế độ tách biệt.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker sẽ tải xuống các hình ảnh cần thiết và khởi động ứng dụng Listmonk và các container cơ sở dữ liệu. Có thể mất một hoặc hai phút vào lần đầu tiên.

✅ **Truy cập Listmonk**: Bây giờ bạn có thể truy cập giao diện web Listmonk thông qua tên miền bạn đã cấu hình (ví dụ: `https://listmonk.yourdomain.com`).

### 7. Cấu hình Chuyển tiếp Email SMTP trong Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Tiếp theo, hãy cấu hình Listmonk để gửi email bằng tài khoản Forward Email của bạn.

1. **Bật SMTP trong Forward Email**: Đảm bảo bạn đã tạo thông tin đăng nhập SMTP trong bảng điều khiển tài khoản Forward Email. Nếu chưa, hãy làm theo [Hướng dẫn chuyển tiếp email để gửi email với tên miền tùy chỉnh qua SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp).
2. **Cấu hình Listmonk**: Đăng nhập vào bảng quản trị Listmonk của bạn.
* Điều hướng đến **Cài đặt -> SMTP**.

* Listmonk có hỗ trợ tích hợp cho Forward Email. Chọn **ForwardEmail** từ danh sách nhà cung cấp hoặc nhập thủ công các thông tin sau:

| Cài đặt | Giá trị |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Chủ nhà** | `smtp.forwardemail.net` |
| **Cảng** | `465` |
| **Giao thức xác thực** | `LOGIN` |
| **Tên người dùng** | Email chuyển tiếp của bạn **Tên người dùng SMTP** |
| **Mật khẩu** | Email chuyển tiếp của bạn **Mật khẩu SMTP** |
| **TLS** | `SSL/TLS` |
| **Từ email** | Địa chỉ `From` mong muốn của bạn (ví dụ: `newsletter@yourdomain.com`). Đảm bảo tên miền này được cấu hình trong Forward Email. |

* **Quan trọng**: Luôn sử dụng Cổng `465` với `SSL/TLS` cho các kết nối an toàn với Chuyển tiếp Email. Không sử dụng STARTTLS (cổng 587).

* Nhấp vào **Lưu**.
3. **Gửi Email Kiểm tra**: Sử dụng nút "Gửi Email Kiểm tra" trong trang cài đặt SMTP. Nhập địa chỉ người nhận mà bạn có thể truy cập và nhấp vào **Gửi**. Xác minh rằng email đã đến hộp thư đến của người nhận.

### 8. Cấu hình Xử lý trả lại {#8-configure-bounce-processing}

Xử lý trả lại cho phép Listmonk tự động xử lý các email không thể gửi được (ví dụ: do địa chỉ không hợp lệ). Forward Email cung cấp một webhook để thông báo cho Listmonk về các email trả lại.

#### Thiết lập chuyển tiếp email {#forward-email-setup}

1. Đăng nhập vào [Bảng điều khiển chuyển tiếp email](https://forwardemail.net/) của bạn.
2. Điều hướng đến **Tên miền**, chọn tên miền bạn đang sử dụng để gửi và đi đến trang **Cài đặt** của tên miền đó.
3. Cuộn xuống phần **URL Webhook trả lại**.
4. Nhập URL sau, thay thế `<your_listmonk_domain>` bằng tên miền hoặc tên miền phụ thực tế mà phiên bản Listmonk của bạn có thể truy cập:
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Ví dụ*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Cuộn xuống phần **Khóa Xác minh Tải trọng Chữ ký Webhook**.
6. **Sao chép** khóa xác minh đã tạo. Bạn sẽ cần khóa này trong Listmonk.
7. Lưu các thay đổi trong cài đặt tên miền Email Chuyển tiếp của bạn.

#### Thiết lập Listmonk {#listmonk-setup}

1. Trong bảng quản trị Listmonk, hãy điều hướng đến **Cài đặt -> Thư trả lại**.
2. Bật **Bật xử lý thư trả lại**.
3. Bật **Bật webhook trả lại**.
4. Cuộn xuống phần **Nhà cung cấp Webhook**.
5. Bật **Chuyển tiếp Email**.
6. Dán **Khóa Xác minh Tải trọng Chữ ký Webhook** mà bạn đã sao chép từ bảng điều khiển Chuyển tiếp Email vào trường **Khóa Chuyển tiếp Email**.
7. Nhấp vào **Lưu** ở cuối trang.
8. Xử lý thư trả lại hiện đã được cấu hình! Khi Chuyển tiếp Email phát hiện thư trả lại cho email do Listmonk gửi, nó sẽ thông báo cho phiên bản Listmonk của bạn thông qua webhook và Listmonk sẽ đánh dấu người đăng ký tương ứng.
9. Hoàn thành các bước bên dưới trong [Kiểm tra](#testing) để đảm bảo mọi thứ hoạt động bình thường.

## Đang thử nghiệm {#testing}

Sau đây là tổng quan nhanh về các chức năng cốt lõi của Listmonk:

### Tạo danh sách gửi thư {#create-a-mailing-list}

* Vào **Danh sách** trong thanh bên.
* Nhấp vào **Danh sách mới**.
* Điền thông tin chi tiết (Tên, Loại: Công khai/Riêng tư, Mô tả, Thẻ) và **Lưu**.

### Thêm người đăng ký {#add-subscribers}

* Điều hướng đến phần **Người đăng ký**.
* Bạn có thể thêm người đăng ký:
* **Thủ công**: Nhấp vào **Người đăng ký mới**.
* **Nhập**: Nhấp vào **Nhập người đăng ký** để tải lên tệp CSV.
* **API**: Sử dụng API Listmonk để thêm theo chương trình.
* Chỉ định người đăng ký vào một hoặc nhiều danh sách trong quá trình tạo hoặc nhập.
* **Thực hành tốt nhất**: Sử dụng quy trình chọn tham gia kép. Cấu hình quy trình này trong **Cài đặt -> Chọn tham gia & Đăng ký**.

### Tạo và gửi chiến dịch {#create-and-send-a-campaign}

* Vào **Chiến dịch** -> **Chiến dịch mới**.
* Điền thông tin chi tiết về chiến dịch (Tên, Chủ đề, Email người gửi, Danh sách gửi đến).
* Chọn loại nội dung (Văn bản đa dạng thức/HTML, Văn bản thuần túy, HTML thô).
* Soạn nội dung email. Bạn có thể sử dụng các biến mẫu như `{{ .Subscriber.Email }}` hoặc `{{ .Subscriber.FirstName }}`.
* **Luôn gửi email thử nghiệm trước!** Sử dụng tùy chọn "Gửi thử nghiệm" để xem trước email trong hộp thư đến của bạn.
* Sau khi hoàn tất, hãy nhấp vào **Bắt đầu Chiến dịch** để gửi ngay hoặc lên lịch gửi sau.

## Xác minh {#verification}

* **Giao hàng SMTP**: Thường xuyên gửi email thử nghiệm qua trang cài đặt SMTP của Listmonk và thử nghiệm các chiến dịch để đảm bảo email được gửi chính xác.
* **Xử lý thư trả lại**: Gửi một chiến dịch thử nghiệm đến một địa chỉ email không hợp lệ đã biết (ví dụ: `bounce-test@yourdomain.com` nếu bạn không có email thật, mặc dù kết quả có thể khác nhau). Kiểm tra số liệu thống kê chiến dịch trong Listmonk sau một thời gian ngắn để xem thư trả lại có được ghi nhận hay không.
* **Tiêu đề Email**: Sử dụng các công cụ như [Kiểm tra thư](https://www.mail-tester.com/) hoặc kiểm tra thủ công tiêu đề email để xác minh SPF, DKIM và DMARC có được chuyển tiếp hay không, cho biết thiết lập chính xác thông qua Chuyển tiếp Email.
* **Nhật ký Chuyển tiếp Email**: Kiểm tra nhật ký bảng điều khiển Chuyển tiếp Email của bạn nếu bạn nghi ngờ sự cố gửi thư bắt nguồn từ máy chủ SMTP.

## Ghi chú của nhà phát triển {#developer-notes}

* **Tạo mẫu**: Listmonk sử dụng công cụ tạo mẫu của Go. Khám phá tài liệu hướng dẫn để cá nhân hóa nâng cao: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk cung cấp một REST API toàn diện để quản lý danh sách, người đăng ký, chiến dịch, mẫu, v.v. Tìm liên kết tài liệu API trong phần chân trang của phiên bản Listmonk của bạn.
* **Trường Tùy chỉnh**: Xác định các trường người đăng ký tùy chỉnh trong **Cài đặt -> Trường Người đăng ký** để lưu trữ dữ liệu bổ sung.
* **Webhooks**: Bên cạnh các phản hồi, Listmonk có thể gửi webhooks cho các sự kiện khác (ví dụ: đăng ký), cho phép tích hợp với các hệ thống khác.

## Kết luận {#conclusion}

Bằng cách tích hợp sức mạnh tự lưu trữ của Listmonk với dịch vụ phân phối bảo mật, tôn trọng quyền riêng tư của Forward Email, bạn tạo ra một nền tảng tiếp thị qua email mạnh mẽ và có đạo đức. Bạn duy trì quyền sở hữu hoàn toàn đối với dữ liệu đối tượng của mình trong khi vẫn được hưởng lợi từ khả năng phân phối cao và các tính năng bảo mật tự động.

Thiết lập này cung cấp một giải pháp thay thế có khả năng mở rộng, tiết kiệm chi phí và thân thiện với nhà phát triển cho các dịch vụ email độc quyền, hoàn toàn phù hợp với tinh thần của phần mềm nguồn mở và quyền riêng tư của người dùng.

Chúc bạn gửi vui vẻ! 🚀