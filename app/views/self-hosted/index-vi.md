# Tự Lưu Trữ {#self-hosted}


## Mục Lục {#table-of-contents}

* [Bắt đầu](#getting-started)
* [Yêu cầu](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Cài đặt](#install)
  * [Gỡ lỗi script cài đặt](#debug-install-script)
  * [Các lời nhắc](#prompts)
  * [Thiết lập ban đầu (Tùy chọn 1)](#initial-setup-option-1)
* [Dịch vụ](#services)
  * [Đường dẫn tệp quan trọng](#important-file-paths)
* [Cấu hình](#configuration)
  * [Thiết lập DNS ban đầu](#initial-dns-setup)
* [Hướng dẫn sử dụng](#onboarding)
* [Kiểm tra](#testing)
  * [Tạo bí danh đầu tiên của bạn](#creating-your-first-alias)
  * [Gửi / Nhận email đầu tiên của bạn](#sending--receiving-your-first-email)
* [Khắc phục sự cố](#troubleshooting)
  * [Tên đăng nhập và mật khẩu xác thực cơ bản là gì](#what-is-the-basic-auth-username-and-password)
  * [Làm sao tôi biết những gì đang chạy](#how-do-i-know-what-is-running)
  * [Làm sao tôi biết nếu có thứ gì đó không chạy mà lẽ ra phải chạy](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Làm sao tôi tìm nhật ký](#how-do-i-find-logs)
  * [Tại sao email gửi đi của tôi bị hết thời gian chờ](#why-are-my-outgoing-emails-timing-out)


## Bắt đầu {#getting-started}

Giải pháp email tự lưu trữ của chúng tôi, giống như tất cả các sản phẩm của chúng tôi, hoàn toàn mã nguồn mở — cả frontend và backend. Điều này có nghĩa:

1. **Minh bạch hoàn toàn**: Mọi dòng mã xử lý email của bạn đều có sẵn để công khai xem xét
2. **Đóng góp từ cộng đồng**: Bất kỳ ai cũng có thể đóng góp cải tiến hoặc sửa lỗi
3. **Bảo mật nhờ sự minh bạch**: Các lỗ hổng có thể được phát hiện và sửa chữa bởi cộng đồng toàn cầu
4. **Không bị ràng buộc nhà cung cấp**: Bạn không bao giờ phụ thuộc vào sự tồn tại của công ty chúng tôi

Toàn bộ mã nguồn có trên GitHub tại <https://github.com/forwardemail/forwardemail.net>, được cấp phép theo giấy phép MIT.

Kiến trúc bao gồm các container cho:

* Máy chủ SMTP cho email gửi đi
* Máy chủ IMAP/POP3 để lấy email
* Giao diện web để quản trị
* Cơ sở dữ liệu để lưu trữ cấu hình
* Redis để cache và tăng hiệu suất
* SQLite để lưu trữ hộp thư an toàn, được mã hóa

> \[!NOTE]
> Hãy chắc chắn xem qua [blog tự lưu trữ của chúng tôi](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Và dành cho những ai quan tâm đến phiên bản hướng dẫn chi tiết từng bước, xem các hướng dẫn dựa trên [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) hoặc [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Yêu cầu {#requirements}

Trước khi chạy script cài đặt, hãy đảm bảo bạn có những điều sau:

* **Hệ điều hành**: Máy chủ dựa trên Linux (hiện hỗ trợ Ubuntu 22.04+).
* **Tài nguyên**: 1 vCPU và 2GB RAM
* **Quyền root**: Quyền quản trị để thực thi các lệnh.
* **Tên miền**: Một tên miền tùy chỉnh sẵn sàng cho cấu hình DNS.
* **IP sạch**: Đảm bảo máy chủ của bạn có địa chỉ IP sạch, không có lịch sử spam bằng cách kiểm tra các danh sách đen. Thêm thông tin [tại đây](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Địa chỉ IP công khai hỗ trợ cổng 25
* Khả năng thiết lập [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Hỗ trợ IPv4 và IPv6

> \[!TIP]
> Xem danh sách các [nhà cung cấp máy chủ mail tuyệt vời](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

Hầu hết các nhà cung cấp đám mây hỗ trợ cấu hình cloud-init khi máy chủ ảo riêng (VPS) được cấp phát. Đây là cách tuyệt vời để thiết lập một số tệp và biến môi trường trước để sử dụng trong logic thiết lập ban đầu của script, giúp bỏ qua việc hỏi thêm thông tin khi script đang chạy.

**Tùy chọn**

* `EMAIL` - email dùng để nhắc nhở hết hạn certbot
* `DOMAIN` - tên miền tùy chỉnh (ví dụ `example.com`) dùng cho thiết lập tự lưu trữ
* `AUTH_BASIC_USERNAME` - tên đăng nhập dùng trong lần thiết lập đầu tiên để bảo vệ trang
* `AUTH_BASIC_PASSWORD` - mật khẩu dùng trong lần thiết lập đầu tiên để bảo vệ trang
* `/root/.cloudflare.ini` - (**Chỉ dành cho người dùng Cloudflare**) tệp cấu hình cloudflare dùng bởi certbot để cấu hình DNS. Yêu cầu bạn thiết lập token API qua `dns_cloudflare_api_token`. Đọc thêm [tại đây](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
Example:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```

## Cài đặt {#install}

Chạy lệnh sau trên máy chủ của bạn để tải xuống và thực thi script cài đặt:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Gỡ lỗi script cài đặt {#debug-install-script}

Thêm `DEBUG=true` trước script cài đặt để có đầu ra chi tiết:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Các lựa chọn {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Initial setup**: Tải xuống mã forward email mới nhất, cấu hình môi trường, yêu cầu nhập tên miền tùy chỉnh của bạn và thiết lập tất cả các chứng chỉ, khóa và bí mật cần thiết.
* **Setup Backup**: Sẽ thiết lập một cron để sao lưu mongoDB và redis sử dụng kho lưu trữ tương thích S3 để lưu trữ an toàn, từ xa. Riêng biệt, sqlite sẽ được sao lưu khi đăng nhập nếu có thay đổi để sao lưu an toàn, mã hóa.
* **Setup Upgrade**: Thiết lập một cron để kiểm tra cập nhật hàng đêm, sẽ xây dựng lại và khởi động lại các thành phần hạ tầng một cách an toàn.
* **Renew certificates**: Certbot / lets encrypt được sử dụng cho chứng chỉ SSL và các khóa sẽ hết hạn sau mỗi 3 tháng. Điều này sẽ gia hạn chứng chỉ cho tên miền của bạn và đặt chúng vào thư mục cần thiết để các thành phần liên quan sử dụng. Xem [đường dẫn tệp quan trọng](#important-file-paths)
* **Restore from backup**: Sẽ kích hoạt mongodb và redis để khôi phục từ dữ liệu sao lưu.

### Thiết lập ban đầu (Lựa chọn 1) {#initial-setup-option-1}

Chọn lựa chọn `1. Initial setup` để bắt đầu.

Khi hoàn tất, bạn sẽ thấy thông báo thành công. Bạn thậm chí có thể chạy `docker ps` để xem **các** thành phần đã được khởi động. Thông tin thêm về các thành phần bên dưới.

## Dịch vụ {#services}

| Tên dịch vụ |         Cổng mặc định        | Mô tả                                                  |
| ------------ | :-------------------------: | ------------------------------------------------------ |
| Web          |            `443`            | Giao diện web cho tất cả các tương tác quản trị        |
| API          |            `4000`           | Lớp API để trừu tượng hóa cơ sở dữ liệu                 |
| Bree         |             Không           | Công việc nền và trình chạy tác vụ                      |
| SMTP         | `465` (khuyến nghị) / `587` | Máy chủ SMTP cho email gửi đi                           |
| SMTP Bree    |             Không           | Công việc nền SMTP                                      |
| MX           |            `2525`           | Máy chủ trao đổi thư cho email đến và chuyển tiếp email |
| IMAP         |          `993/2993`         | Máy chủ IMAP cho email đến và quản lý hộp thư          |
| POP3         |          `995/2995`         | Máy chủ POP3 cho email đến và quản lý hộp thư          |
| SQLite       |            `3456`           | Máy chủ SQLite cho tương tác với cơ sở dữ liệu sqlite   |
| SQLite Bree  |             Không           | Công việc nền SQLite                                    |
| CalDAV       |            `5000`           | Máy chủ CalDAV cho quản lý lịch                         |
| CardDAV      |            `6000`           | Máy chủ CardDAV cho quản lý lịch                        |
| MongoDB      |           `27017`           | Cơ sở dữ liệu MongoDB cho phần lớn quản lý dữ liệu      |
| Redis        |            `6379`           | Redis cho bộ nhớ đệm và quản lý trạng thái              |
| SQLite       |             Không           | Cơ sở dữ liệu SQLite cho các hộp thư được mã hóa        |

### Đường dẫn tệp quan trọng {#important-file-paths}

Lưu ý: *Đường dẫn máy chủ* bên dưới là tương đối so với `/root/forwardemail.net/self-hosting/`.

| Thành phần             |       Đường dẫn máy chủ       | Đường dẫn trong container       |
| ---------------------- | :---------------------------: | ------------------------------ |
| MongoDB                |   `./mongo-backups`           | `/backups`                     |
| Redis                  |     `./redis-data`            | `/data`                        |
| Sqlite                 |    `./sqlite-data`            | `/mnt/{SQLITE_STORAGE_PATH}`   |
| Tệp Env                |        `./.env`               | `/app/.env`                    |
| Chứng chỉ/khóa SSL     |        `./ssl`                | `/app/ssl/`                    |
| Khóa riêng             |  `./ssl/privkey.pem`          | `/app/ssl/privkey.pem`         |
| Chứng chỉ chuỗi đầy đủ | `./ssl/fullchain.pem`         | `/app/ssl/fullchain.pem`       |
| Chứng chỉ CA           |    `./ssl/cert.pem`           | `/app/ssl/cert.pem`            |
| Khóa riêng DKIM        |    `./ssl/dkim.key`           | `/app/ssl/dkim.key`            |
> \[!IMPORTANT]
> Lưu trữ file `.env` một cách an toàn. Đây là điều quan trọng để khôi phục trong trường hợp sự cố.
> Bạn có thể tìm thấy file này tại `/root/forwardemail.net/self-hosting/.env`.


## Cấu hình {#configuration}

### Thiết lập DNS ban đầu {#initial-dns-setup}

Trong nhà cung cấp DNS bạn chọn, cấu hình các bản ghi DNS phù hợp. Lưu ý bất cứ thứ gì trong dấu ngoặc nhọn (`<>`) là động và cần được cập nhật với giá trị của bạn.

| Loại  | Tên                | Nội dung                      | TTL  |
| ----- | ------------------ | ----------------------------- | ---- |
| A     | "@", ".", hoặc để trống | <ip_address>                  | auto |
| CNAME | api                | <domain_name>                 | auto |
| CNAME | caldav             | <domain_name>                 | auto |
| CNAME | carddav            | <domain_name>                 | auto |
| CNAME | fe-bounces         | <domain_name>                 | auto |
| CNAME | imap               | <domain_name>                 | auto |
| CNAME | mx                 | <domain_name>                 | auto |
| CNAME | pop3               | <domain_name>                 | auto |
| CNAME | smtp               | <domain_name>                 | auto |
| MX    | "@", ".", hoặc để trống | mx.<domain_name> (ưu tiên 0) | auto |
| TXT   | "@", ".", hoặc để trống | "v=spf1 a -all"               | auto |

#### Reverse DNS / bản ghi PTR {#reverse-dns--ptr-record}

Reverse DNS (rDNS) hoặc bản ghi con trỏ ngược (PTR records) rất quan trọng đối với máy chủ email vì chúng giúp xác minh tính hợp pháp của máy chủ gửi email. Mỗi nhà cung cấp đám mây làm việc này khác nhau, vì vậy bạn cần tìm hiểu cách thêm "Reverse DNS" để ánh xạ host và IP với tên máy chủ tương ứng. Thông thường nằm trong phần mạng của nhà cung cấp.

#### Cổng 25 bị chặn {#port-25-blocked}

Một số ISP và nhà cung cấp đám mây chặn cổng 25 để tránh các tác nhân xấu. Bạn có thể cần gửi yêu cầu hỗ trợ để mở cổng 25 cho SMTP / email đi.


## Đăng ký {#onboarding}

1. Mở Trang Đích
   Truy cập https\://\<domain_name>, thay thế \<domain_name> bằng tên miền đã cấu hình trong cài đặt DNS của bạn. Bạn sẽ thấy trang đích Forward Email.

2. Đăng nhập và Đăng ký Tên miền của bạn

* Đăng nhập bằng email và mật khẩu hợp lệ.
* Nhập tên miền bạn muốn thiết lập (phải khớp với cấu hình DNS).
* Làm theo hướng dẫn để thêm các bản ghi **MX** và **TXT** cần thiết để xác minh.

3. Hoàn tất Thiết lập

* Khi đã xác minh, truy cập trang Aliases để tạo bí danh đầu tiên.
* Tùy chọn, cấu hình **SMTP cho email đi** trong **Cài đặt Tên miền**. Điều này yêu cầu thêm các bản ghi DNS.

> \[!NOTE]
> Không có thông tin nào được gửi ra ngoài máy chủ của bạn. Tùy chọn tự lưu trữ và tài khoản ban đầu chỉ dành cho đăng nhập quản trị và giao diện web để quản lý tên miền, bí danh và các cấu hình email liên quan.


## Kiểm tra {#testing}

### Tạo bí danh đầu tiên của bạn {#creating-your-first-alias}

1. Truy cập Trang Aliases
   Mở trang quản lý bí danh:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Thêm Bí danh Mới

* Nhấn **Add Alias** (góc trên bên phải).
* Nhập tên bí danh và điều chỉnh cài đặt email theo nhu cầu.
* (Tùy chọn) Bật hỗ trợ **IMAP/POP3/CalDAV/CardDAV** bằng cách chọn hộp kiểm.
* Nhấn **Create Alias.**

3. Đặt Mật khẩu

* Nhấn **Generate Password** để tạo mật khẩu an toàn.
* Mật khẩu này sẽ cần để đăng nhập vào ứng dụng email của bạn.

4. Cấu hình Ứng dụng Email của bạn

* Sử dụng ứng dụng email như Thunderbird.
* Nhập tên bí danh và mật khẩu đã tạo.
* Cấu hình các cài đặt **IMAP** và **SMTP** tương ứng.

#### Cài đặt máy chủ email {#email-server-settings}

Tên đăng nhập: `<alias name>`

| Loại | Tên máy chủ        | Cổng | Bảo mật kết nối    | Xác thực        |
| ---- | ------------------ | ---- | ------------------ | --------------- |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS          | Mật khẩu bình thường |
| IMAP | imap.<domain_name> | 993  | SSL / TLS          | Mật khẩu bình thường |

### Gửi / Nhận email đầu tiên của bạn {#sending--receiving-your-first-email}

Khi đã cấu hình, bạn sẽ có thể gửi và nhận email tới địa chỉ email tự lưu trữ và mới tạo của bạn!
## Khắc phục sự cố {#troubleshooting}

#### Tại sao điều này không hoạt động ngoài Ubuntu và Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Chúng tôi hiện đang tìm cách hỗ trợ MacOS và sẽ xem xét các hệ điều hành khác. Vui lòng mở một [thảo luận](https://github.com/orgs/forwardemail/discussions) hoặc đóng góp nếu bạn muốn thấy các hệ điều hành khác được hỗ trợ.

#### Tại sao thử thách certbot acme lại thất bại {#why-is-the-certbot-acme-challenge-failing}

Sai lầm phổ biến nhất là certbot / letsencrypt đôi khi sẽ yêu cầu **2** thử thách. Bạn cần chắc chắn thêm **CẢ HAI** bản ghi txt.

Ví dụ:
Bạn có thể thấy hai thử thách như sau:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Cũng có thể việc truyền DNS chưa hoàn tất. Bạn có thể sử dụng các công cụ như: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Điều này sẽ cho bạn biết liệu các thay đổi bản ghi TXT của bạn đã được phản ánh chưa. Cũng có thể bộ nhớ đệm DNS cục bộ trên máy chủ của bạn vẫn đang sử dụng giá trị cũ hoặc chưa nhận được các thay đổi gần đây.

Một lựa chọn khác là sử dụng các thay đổi DNS tự động của certbot bằng cách thiết lập tệp `/root/.cloudflare.ini` với token api trong cloud-init / user-data khi thiết lập VPS ban đầu hoặc tạo tệp này và chạy lại script. Điều này sẽ quản lý các thay đổi DNS và cập nhật thử thách một cách tự động.

### Tên đăng nhập và mật khẩu xác thực cơ bản là gì {#what-is-the-basic-auth-username-and-password}

Đối với tự lưu trữ, chúng tôi thêm một cửa sổ xác thực gốc trình duyệt lần đầu với tên đăng nhập đơn giản (`admin`) và mật khẩu (được tạo ngẫu nhiên khi thiết lập ban đầu). Chúng tôi chỉ thêm điều này như một biện pháp bảo vệ trong trường hợp tự động hóa / trình thu thập dữ liệu nào đó đăng ký trước bạn trên trải nghiệm web. Bạn có thể tìm mật khẩu này sau khi thiết lập ban đầu trong tệp `.env` dưới `AUTH_BASIC_USERNAME` và `AUTH_BASIC_PASSWORD`.

### Làm sao tôi biết cái gì đang chạy {#how-do-i-know-what-is-running}

Bạn có thể chạy `docker ps` để xem tất cả các container đang chạy được khởi tạo từ tệp `docker-compose-self-hosting.yml`. Bạn cũng có thể chạy `docker ps -a` để xem tất cả (bao gồm cả các container không chạy).

### Làm sao tôi biết nếu có thứ gì đó không chạy mà lẽ ra phải chạy {#how-do-i-know-if-something-isnt-running-that-should-be}

Bạn có thể chạy `docker ps -a` để xem tất cả (bao gồm cả các container không chạy). Bạn có thể thấy một nhật ký thoát hoặc ghi chú.

### Làm sao tôi tìm nhật ký {#how-do-i-find-logs}

Bạn có thể lấy thêm nhật ký qua `docker logs -f <container_name>`. Nếu có container nào thoát, rất có thể liên quan đến việc cấu hình tệp `.env` không chính xác.

Trong giao diện web, bạn có thể xem `/admin/emails` và `/admin/logs` để xem nhật ký email gửi đi và nhật ký lỗi tương ứng.

### Tại sao email gửi đi của tôi bị hết thời gian chờ {#why-are-my-outgoing-emails-timing-out}

Nếu bạn thấy thông báo như Connection timed out when connecting to MX server... thì bạn có thể cần kiểm tra xem cổng 25 có bị chặn không. Nhà cung cấp dịch vụ Internet hoặc nhà cung cấp đám mây thường chặn cổng này theo mặc định, bạn có thể cần liên hệ bộ phận hỗ trợ / gửi yêu cầu để mở cổng này.

#### Tôi nên sử dụng công cụ nào để kiểm tra cấu hình email theo thực tiễn tốt nhất và uy tín IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Hãy xem qua [Câu hỏi thường gặp của chúng tôi ở đây](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
