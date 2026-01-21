# Tự lưu trữ {#self-hosted}

## Mục lục {#table-of-contents}

* [Bắt đầu](#getting-started)
* [Yêu cầu](#requirements)
  * [Cloud-init / Dữ liệu người dùng](#cloud-init--user-data)
* [Cài đặt](#install)
  * [Gỡ lỗi tập lệnh cài đặt](#debug-install-script)
  * [Lời nhắc](#prompts)
  * [Thiết lập ban đầu (Tùy chọn 1)](#initial-setup-option-1)
* [Dịch vụ](#services)
  * [Đường dẫn tệp quan trọng](#important-file-paths)
* [Cấu hình](#configuration)
  * [Thiết lập DNS ban đầu](#initial-dns-setup)
* [Lên tàu](#onboarding)
* [Kiểm tra](#testing)
  * [Tạo bí danh đầu tiên của bạn](#creating-your-first-alias)
  * [Gửi / Nhận email đầu tiên của bạn](#sending--receiving-your-first-email)
* [Xử lý sự cố](#troubleshooting)
  * [Tên người dùng và mật khẩu xác thực cơ bản là gì?](#what-is-the-basic-auth-username-and-password)
  * [Làm sao tôi biết cái gì đang chạy](#how-do-i-know-what-is-running)
  * [Làm sao tôi biết được có thứ gì đó không chạy mà đáng lẽ phải chạy?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Làm thế nào để tôi tìm thấy nhật ký](#how-do-i-find-logs)
  * [Tại sao email gửi đi của tôi lại hết thời gian chờ](#why-are-my-outgoing-emails-timing-out)

## Bắt đầu {#getting-started}

Giải pháp email tự lưu trữ của chúng tôi, giống như tất cả các sản phẩm khác, đều là mã nguồn mở 100%—cả giao diện người dùng và giao diện quản trị. Điều này có nghĩa là:

1. **Minh bạch hoàn toàn**: Mọi dòng mã xử lý email của bạn đều được công khai để công chúng giám sát.
2. **Đóng góp của cộng đồng**: Bất kỳ ai cũng có thể đóng góp cải tiến hoặc khắc phục sự cố.
3. **Bảo mật thông qua tính minh bạch**: Các lỗ hổng có thể được xác định và khắc phục bởi cộng đồng toàn cầu.
4. **Không bị ràng buộc bởi nhà cung cấp**: Bạn không bao giờ phụ thuộc vào sự tồn tại của công ty chúng tôi

Toàn bộ cơ sở mã có sẵn trên GitHub tại <https://github.com/forwardemail/forwardemail.net>, được cấp phép theo Giấy phép MIT.

Kiến trúc bao gồm các thùng chứa cho:

* Máy chủ SMTP cho email gửi đi
* Máy chủ IMAP/POP3 để truy xuất email
* Giao diện web để quản trị
* Cơ sở dữ liệu để lưu trữ cấu hình
* Redis để lưu trữ bộ nhớ đệm và tăng hiệu suất
* SQLite để lưu trữ hộp thư an toàn, được mã hóa

> \[!NOTE]
> Đừng quên xem [blog tự lưu trữ](https://forwardemail.net/blog/docs/self-hosted-solution) của chúng tôi
>
> Và nếu bạn quan tâm đến phiên bản hướng dẫn chi tiết hơn, hãy xem hướng dẫn [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) hoặc [Debian](https://forwardemail.net/guides/selfhosted-on-debian) của chúng tôi.

## Yêu cầu {#requirements}

Trước khi chạy tập lệnh cài đặt, hãy đảm bảo bạn có những điều sau:

* **Hệ điều hành**: Máy chủ chạy Linux (hiện hỗ trợ Ubuntu 22.04 trở lên).
* **Tài nguyên**: 1 vCPU và 2GB RAM
* **Quyền truy cập gốc**: Quyền quản trị để thực thi lệnh.
* **Tên miền**: Tên miền tùy chỉnh, sẵn sàng cho cấu hình DNS.
* **IP sạch**: Đảm bảo máy chủ của bạn có địa chỉ IP sạch, không có tiền sử spam bằng cách kiểm tra danh sách đen. Thông tin thêm [đây](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Địa chỉ IP công cộng hỗ trợ cổng 25
* Khả năng thiết lập [PTR đảo ngược](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Hỗ trợ IPv4 và IPv6

> \[!TIP]
> Xem danh sách [nhà cung cấp máy chủ thư tuyệt vời](https://github.com/forwardemail/awesome-mail-server-providers) của chúng tôi

### Khởi tạo đám mây / Dữ liệu người dùng {#cloud-init--user-data}

Hầu hết các nhà cung cấp dịch vụ đám mây đều hỗ trợ cấu hình cloud-init khi máy chủ riêng ảo (VPS) được cung cấp. Đây là một cách tuyệt vời để thiết lập trước một số tệp và biến môi trường để logic thiết lập ban đầu của tập lệnh sử dụng, giúp bỏ qua việc phải nhắc nhở trong khi tập lệnh đang chạy để lấy thêm thông tin.

**Tùy chọn**

* `EMAIL` - email dùng để nhắc nhở certbot hết hạn
* `DOMAIN` - tên miền tùy chỉnh (ví dụ: `example.com`) dùng để thiết lập tự lưu trữ
* `AUTH_BASIC_USERNAME` - tên người dùng được sử dụng trong lần thiết lập đầu tiên để bảo vệ trang web
* `AUTH_BASIC_PASSWORD` - mật khẩu được sử dụng trong lần thiết lập đầu tiên để bảo vệ trang web
* `/root/.cloudflare.ini` - (**Chỉ dành cho người dùng Cloudflare**) tệp cấu hình Cloudflare được certbot sử dụng để cấu hình DNS. Tệp này yêu cầu bạn thiết lập mã thông báo API thông qua `dns_cloudflare_api_token`. Đọc thêm [đây](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

Ví dụ:

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

Chạy lệnh sau trên máy chủ của bạn để tải xuống và thực thi tập lệnh cài đặt:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Tập lệnh cài đặt gỡ lỗi {#debug-install-script}

Thêm `DEBUG=true` vào trước tập lệnh cài đặt để có đầu ra chi tiết:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Nhắc nhở {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Thiết lập ban đầu**: Tải xuống mã email chuyển tiếp mới nhất, cấu hình môi trường, nhắc nhở cho tên miền tùy chỉnh của bạn và thiết lập tất cả chứng chỉ, khóa và bí mật cần thiết.
* **Thiết lập Sao lưu**: Sẽ thiết lập cron để sao lưu mongoDB và redis bằng kho lưu trữ tương thích với S3 để lưu trữ từ xa an toàn. Riêng sqlite sẽ được sao lưu khi đăng nhập nếu có thay đổi đối với các bản sao lưu được mã hóa an toàn.
* **Thiết lập Nâng cấp**: Thiết lập cron để tìm kiếm các bản cập nhật hàng đêm, giúp xây dựng lại và khởi động lại các thành phần cơ sở hạ tầng một cách an toàn.
* **Gia hạn chứng chỉ**: Certbot / lets encrypt được sử dụng cho chứng chỉ SSL và khóa sẽ hết hạn sau mỗi 3 tháng. Thao tác này sẽ gia hạn chứng chỉ cho tên miền của bạn và đặt chúng vào thư mục cần thiết để các thành phần liên quan sử dụng. Xem [đường dẫn tập tin quan trọng](#important-file-paths)
* **Khôi phục từ bản sao lưu**: Sẽ kích hoạt mongodb và redis khôi phục từ dữ liệu sao lưu.

### Thiết lập ban đầu (Tùy chọn 1) {#initial-setup-option-1}

Chọn tùy chọn `1. Initial setup` để bắt đầu.

Sau khi hoàn tất, bạn sẽ thấy thông báo thành công. Bạn thậm chí có thể chạy `docker ps` để xem **các** thành phần** đã được tạo. Thông tin thêm về các thành phần bên dưới.

## Dịch vụ {#services}

| Tên dịch vụ | Cổng mặc định | Sự miêu tả |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Giao diện web cho tất cả các tương tác của quản trị viên |
| API | `4000` | Lớp API để trừu tượng hóa cơ sở dữ liệu |
| Bree | Không có | Trình chạy tác vụ và công việc nền |
| SMTP | `465/587` | Máy chủ SMTP cho email gửi đi |
| SMTP Bree | Không có | Công việc nền SMTP |
| MX | `2525` | Trao đổi thư cho email đến và chuyển tiếp email |
| IMAP | `993/2993` | Máy chủ IMAP để quản lý email đến và hộp thư |
| POP3 | `995/2995` | Máy chủ POP3 để quản lý email đến và hộp thư |
| SQLite | `3456` | Máy chủ SQLite để tương tác với cơ sở dữ liệu SQLite |
| SQLite Bree | Không có | Công việc nền SQLite |
| CalDAV | `5000` | Máy chủ CalDAV để quản lý lịch |
| ThẻDAV | `6000` | Máy chủ CardDAV để quản lý lịch |
| MongoDB | `27017` | Cơ sở dữ liệu MongoDB cho hầu hết việc quản lý dữ liệu |
| Redis | `6379` | Redis để lưu trữ đệm và quản lý trạng thái |
| SQLite | Không có | Cơ sở dữ liệu SQLite cho hộp thư được mã hóa |

### Đường dẫn tệp quan trọng {#important-file-paths}

Lưu ý: *Đường dẫn máy chủ* bên dưới liên quan đến `/root/forwardemail.net/self-hosting/`.

| Thành phần | Đường dẫn máy chủ | Đường dẫn chứa |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Tệp env | `./.env` | `/app/.env` |
| Chứng chỉ/khóa SSL | `./ssl` | `/app/ssl/` |
| Khóa riêng tư | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Chứng chỉ chuỗi đầy đủ | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| CA được chứng nhận | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| Khóa riêng DKIM | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Lưu tệp `.env` một cách an toàn. Điều này rất quan trọng để khôi phục trong trường hợp xảy ra lỗi.
> Bạn có thể tìm thấy tệp này trong `/root/forwardemail.net/self-hosting/.env`.

## Cấu hình {#configuration}

### Thiết lập DNS ban đầu {#initial-dns-setup}

Trong nhà cung cấp DNS bạn chọn, hãy cấu hình các bản ghi DNS phù hợp. Lưu ý rằng bất kỳ thông tin nào trong ngoặc (`<>`) đều là thông tin động và cần được cập nhật theo giá trị của bạn.

| Kiểu | Tên | Nội dung | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", ".", hoặc để trống | <địa chỉ IP> | tự động |
| CNAME | API | <tên_miền> | tự động |
| CNAME | caldav | <tên_miền> | tự động |
| CNAME | carddav | <tên_miền> | tự động |
| CNAME | fe-bounces | <tên_miền> | tự động |
| CNAME | imap | <tên_miền> | tự động |
| CNAME | mx | <tên_miền> | tự động |
| CNAME | nhạc pop3 | <tên_miền> | tự động |
| CNAME | smtp | <tên_miền> | tự động |
| MX | "@", ".", hoặc để trống | mx.<tên_miền> (mức độ ưu tiên 0) | tự động |
| TXT | "@", ".", hoặc để trống | "v=spf1 a -all" | tự động |

#### Bản ghi DNS / PTR ngược {#reverse-dns--ptr-record}

Bản ghi DNS ngược (rDNS) hoặc bản ghi con trỏ ngược (bản ghi PTR) rất cần thiết cho máy chủ email vì chúng giúp xác minh tính hợp lệ của máy chủ gửi email. Mỗi nhà cung cấp dịch vụ đám mây thực hiện việc này theo cách khác nhau, vì vậy bạn sẽ cần tìm hiểu cách thêm "DNS ngược" để ánh xạ máy chủ và IP với tên máy chủ tương ứng. Nhiều khả năng là trong phần mạng của nhà cung cấp.

#### Cổng 25 bị chặn {#port-25-blocked}

Một số ISP và nhà cung cấp dịch vụ đám mây chặn cổng 25 để tránh kẻ xấu. Bạn có thể cần gửi yêu cầu hỗ trợ để mở cổng 25 cho SMTP/email gửi đi.

## Đang tích hợp {#onboarding}

1. Mở Trang Đích
Điều hướng đến https\://\<tên_miền>, thay thế \<tên_miền> bằng tên miền đã được cấu hình trong cài đặt DNS của bạn. Bạn sẽ thấy trang đích Chuyển tiếp Email.

2. Đăng nhập và đưa tên miền của bạn lên tàu

* Đăng nhập bằng email và mật khẩu hợp lệ.
* Nhập tên miền bạn muốn thiết lập (tên miền này phải khớp với cấu hình DNS).
* Làm theo hướng dẫn để thêm các bản ghi **MX** và **TXT** cần thiết để xác minh.

3. Hoàn tất thiết lập

* Sau khi xác minh, hãy truy cập trang Bí danh để tạo bí danh đầu tiên của bạn.
* Tùy chọn, hãy cấu hình **SMTP cho email gửi đi** trong **Cài đặt tên miền**. Thao tác này yêu cầu thêm bản ghi DNS.

> \[!NOTE]
> Không có thông tin nào được gửi ra ngoài máy chủ của bạn. Tùy chọn tự lưu trữ và tài khoản ban đầu chỉ dành cho đăng nhập quản trị viên và chế độ xem web để quản lý tên miền, bí danh và cấu hình email liên quan.

## Kiểm tra {#testing}

### Tạo bí danh đầu tiên của bạn {#creating-your-first-alias}

1. Điều hướng đến Trang Biệt danh
Mở trang quản lý biệt danh:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Thêm bí danh mới

* Nhấp vào **Thêm Biệt danh** (góc trên bên phải).
* Nhập tên biệt danh và điều chỉnh cài đặt email nếu cần.
* (Tùy chọn) Bật hỗ trợ **IMAP/POP3/CalDAV/CardDAV** bằng cách chọn hộp kiểm.
* Nhấp vào **Tạo Biệt danh**

3. Đặt mật khẩu

* Nhấp vào **Tạo mật khẩu** để tạo mật khẩu an toàn.
* Mật khẩu này sẽ được yêu cầu để đăng nhập vào ứng dụng email của bạn.

4. Cấu hình máy khách email của bạn

* Sử dụng ứng dụng email như Thunderbird.
* Nhập tên bí danh và mật khẩu đã tạo.
* Cấu hình cài đặt **IMAP** và **SMTP** cho phù hợp.

#### Cài đặt máy chủ email {#email-server-settings}

Tên người dùng: `<alias name>`

| Kiểu | Tên máy chủ | Cảng | Bảo mật kết nối | Xác thực |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<tên_miền> | 465 | SSL / TLS | Mật khẩu thông thường |
| IMAP | imap.<tên_miền> | 993 | SSL / TLS | Mật khẩu thông thường |

### Đang gửi / Nhận email đầu tiên của bạn {#sending--receiving-your-first-email}

Sau khi cấu hình xong, bạn sẽ có thể gửi và nhận email đến địa chỉ email mới tạo và tự lưu trữ của mình!

## Khắc phục sự cố {#troubleshooting}

#### Tại sao điều này không hoạt động bên ngoài Ubuntu và Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Hiện tại, chúng tôi đang tìm kiếm sự hỗ trợ cho MacOS và sẽ xem xét các dự án khác. Vui lòng mở [cuộc thảo luận](https://github.com/orgs/forwardemail/discussions) hoặc đóng góp nếu bạn muốn thấy các dự án khác được hỗ trợ.

#### Tại sao thử thách certbot acme lại thất bại {#why-is-the-certbot-acme-challenge-failing}

Lỗi thường gặp nhất là certbot / letsencrypt đôi khi sẽ yêu cầu **2** thử thách. Bạn cần đảm bảo thêm **CẢ HAI** bản ghi txt.

Ví dụ:
Bạn có thể thấy hai thử thách như thế này:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Cũng có thể quá trình truyền DNS chưa hoàn tất. Bạn có thể sử dụng các công cụ như: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Công cụ này sẽ cho bạn biết liệu các thay đổi trong bản ghi TXT của bạn có cần được phản ánh hay không. Cũng có thể bộ nhớ đệm DNS cục bộ trên máy chủ của bạn vẫn đang sử dụng giá trị cũ, không cập nhật hoặc chưa nhận được các thay đổi gần đây.

Một lựa chọn khác là sử dụng tính năng tự động thay đổi DNS của cerbot bằng cách đặt tệp `/root/.cloudflare.ini` với mã thông báo api trong cloud-init/user-data khi thiết lập VPS ban đầu hoặc tạo tệp này và chạy lại tập lệnh. Thao tác này sẽ tự động quản lý các thay đổi DNS và cập nhật thử thách.

### Tên người dùng và mật khẩu xác thực cơ bản là gì {#what-is-the-basic-auth-username-and-password}

Đối với dịch vụ tự lưu trữ, chúng tôi thêm một cửa sổ bật lên xác thực gốc trên trình duyệt lần đầu với tên người dùng đơn giản (`admin`) và mật khẩu (được tạo ngẫu nhiên khi thiết lập ban đầu). Chúng tôi chỉ thêm điều này như một biện pháp bảo vệ trong trường hợp tự động hóa/trình thu thập dữ liệu nào đó đánh bại bạn trong việc đăng ký trải nghiệm web đầu tiên. Bạn có thể tìm thấy mật khẩu này sau khi thiết lập ban đầu trong tệp `.env` của mình tại `AUTH_BASIC_USERNAME` và `AUTH_BASIC_PASSWORD`.

### Làm sao tôi biết được {#how-do-i-know-what-is-running} đang chạy cái gì

Bạn có thể chạy lệnh `docker ps` để xem tất cả các container đang chạy được tạo từ tệp `docker-compose-self-hosting.yml`. Bạn cũng có thể chạy lệnh `docker ps -a` để xem tất cả (bao gồm cả các container không chạy).

### Làm sao tôi biết được có thứ gì đó không chạy trong khi nó phải là {#how-do-i-know-if-something-isnt-running-that-should-be}

Bạn có thể chạy lệnh `docker ps -a` để xem mọi thứ (bao gồm cả các container không chạy). Bạn có thể thấy nhật ký thoát hoặc ghi chú.

### Làm thế nào để tìm nhật ký {#how-do-i-find-logs}

Bạn có thể lấy thêm nhật ký qua `docker logs -f <container_name>`. Nếu có bất kỳ lỗi nào xảy ra, có thể liên quan đến việc tệp `.env` được cấu hình không chính xác.

Trong giao diện người dùng web, bạn có thể xem `/admin/emails` và `/admin/logs` cho nhật ký email gửi đi và nhật ký lỗi tương ứng.

### Tại sao email gửi đi của tôi lại hết thời gian chờ {#why-are-my-outgoing-emails-timing-out}

Nếu bạn thấy thông báo "Kết nối đã hết thời gian chờ" khi kết nối với máy chủ MX... thì có thể bạn cần kiểm tra xem cổng 25 có bị chặn hay không. Các nhà cung cấp dịch vụ Internet (ISP) hoặc nhà cung cấp dịch vụ đám mây thường mặc định chặn cổng này, do đó bạn có thể cần liên hệ với bộ phận hỗ trợ/gửi yêu cầu để mở cổng này.

#### Tôi nên sử dụng công cụ nào để kiểm tra các biện pháp thực hành tốt nhất về cấu hình email và danh tiếng IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Hãy xem [Câu hỏi thường gặp ở đây](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation) của chúng tôi.