# Email tự lưu trữ: Cam kết về nguồn mở {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="" class="rounded-lg" />

## Mục lục {#table-of-contents}

* [Lời nói đầu](#foreword)
* [Tại sao Email tự lưu trữ lại quan trọng](#why-self-hosted-email-matters)
  * [Vấn đề với các dịch vụ email truyền thống](#the-problem-with-traditional-email-services)
  * [Giải pháp thay thế tự lưu trữ](#the-self-hosted-alternative)
* [Triển khai tự lưu trữ của chúng tôi: Tổng quan kỹ thuật](#our-self-hosted-implementation-technical-overview)
  * [Kiến trúc dựa trên Docker cho tính đơn giản và khả năng di động](#docker-based-architecture-for-simplicity-and-portability)
  * [Cài đặt Bash Script: Khả năng truy cập đáp ứng bảo mật](#bash-script-installation-accessibility-meets-security)
  * [Mã hóa an toàn lượng tử cho quyền riêng tư trong tương lai](#quantum-safe-encryption-for-future-proof-privacy)
  * [Bảo trì và cập nhật tự động](#automated-maintenance-and-updates)
* [Cam kết nguồn mở](#the-open-source-commitment)
* [Tự lưu trữ so với được quản lý: Lựa chọn đúng đắn](#self-hosted-vs-managed-making-the-right-choice)
  * [Thực tế của việc tự lưu trữ email](#the-reality-of-self-hosting-email)
  * [Khi nào nên chọn dịch vụ được quản lý của chúng tôi](#when-to-choose-our-managed-service)
* [Bắt đầu với Email chuyển tiếp tự lưu trữ](#getting-started-with-self-hosted-forward-email)
  * [Yêu cầu hệ thống](#system-requirements)
  * [Các bước cài đặt](#installation-steps)
* [Tương lai của Email tự lưu trữ](#the-future-of-self-hosted-email)
* [Kết luận: Tự do email cho mọi người](#conclusion-email-freedom-for-everyone)
* [Tài liệu tham khảo](#references)

## Lời nói đầu {#foreword}

Trong bối cảnh kỹ thuật số ngày nay, email vẫn là xương sống của danh tính và giao tiếp trực tuyến của chúng ta. Tuy nhiên, khi mối quan tâm về quyền riêng tư ngày càng tăng, nhiều người dùng phải đối mặt với một lựa chọn khó khăn: sự tiện lợi với cái giá phải trả là quyền riêng tư hoặc quyền riêng tư với cái giá phải trả là sự tiện lợi. Tại Forward Email, chúng tôi luôn tin rằng bạn không nên phải lựa chọn giữa hai điều này.

Hôm nay, chúng tôi rất vui mừng thông báo về một cột mốc quan trọng trong hành trình của mình: ra mắt giải pháp email tự lưu trữ. Tính năng này thể hiện cam kết sâu sắc nhất của chúng tôi đối với các nguyên tắc nguồn mở, thiết kế tập trung vào quyền riêng tư và trao quyền cho người dùng. Với tùy chọn tự lưu trữ, chúng tôi trao toàn bộ sức mạnh và quyền kiểm soát giao tiếp email của bạn trực tiếp vào tay bạn.

Bài đăng trên blog này khám phá triết lý đằng sau giải pháp tự lưu trữ của chúng tôi, cách triển khai kỹ thuật của giải pháp và lý do tại sao nó lại quan trọng đối với người dùng coi trọng quyền riêng tư và quyền sở hữu trong các hoạt động truyền thông kỹ thuật số của họ.

## Tại sao Email tự lưu trữ lại quan trọng {#why-self-hosted-email-matters}

Giải pháp email tự lưu trữ của chúng tôi là biểu hiện rõ ràng nhất cho niềm tin của chúng tôi rằng quyền riêng tư thực sự có nghĩa là kiểm soát và kiểm soát bắt đầu bằng mã nguồn mở. Đối với những người dùng yêu cầu quyền sở hữu hoàn toàn đối với các phương tiện truyền thông kỹ thuật số của họ, tự lưu trữ không còn là một ý tưởng xa vời nữa — đó là một quyền thiết yếu. Chúng tôi tự hào ủng hộ niềm tin đó với một nền tảng hoàn toàn mở, có thể xác minh mà bạn có thể tự chạy theo các điều khoản của mình.

### Vấn đề với các dịch vụ email truyền thống {#the-problem-with-traditional-email-services}

Các dịch vụ email truyền thống đặt ra một số thách thức cơ bản cho người dùng quan tâm đến quyền riêng tư:

1. **Yêu cầu về sự tin cậy**: Bạn phải tin tưởng nhà cung cấp không truy cập, phân tích hoặc chia sẻ dữ liệu của bạn
2. **Kiểm soát tập trung**: Quyền truy cập của bạn có thể bị thu hồi bất kỳ lúc nào vì bất kỳ lý do gì
3. **Lỗ hổng giám sát**: Các dịch vụ tập trung là mục tiêu chính để giám sát
4. **Tính minh bạch hạn chế**: Hầu hết các dịch vụ đều sử dụng phần mềm độc quyền, nguồn đóng
5. **Khóa nhà cung cấp**: Việc di chuyển khỏi các dịch vụ này có thể khó khăn hoặc không thể

Ngay cả các nhà cung cấp dịch vụ email "tập trung vào quyền riêng tư" cũng thường không đạt yêu cầu khi chỉ cung cấp mã nguồn mở cho các ứng dụng frontend trong khi vẫn giữ các hệ thống backend độc quyền và đóng. Điều này tạo ra khoảng cách tin cậy đáng kể—bạn được yêu cầu tin vào lời hứa về quyền riêng tư của họ mà không có khả năng xác minh chúng.

### Giải pháp thay thế tự lưu trữ {#the-self-hosted-alternative}

Tự lưu trữ email của bạn cung cấp một cách tiếp cận hoàn toàn khác:

1. **Kiểm soát hoàn toàn**: Bạn sở hữu và kiểm soát toàn bộ cơ sở hạ tầng email
2. **Quyền riêng tư có thể xác minh**: Toàn bộ hệ thống minh bạch và có thể kiểm toán
3. **Không cần tin cậy**: Bạn không cần tin cậy bên thứ ba với thông tin liên lạc của mình
4. **Tự do tùy chỉnh**: Điều chỉnh hệ thống theo nhu cầu cụ thể của bạn
5. **Khả năng phục hồi**: Dịch vụ của bạn vẫn tiếp tục bất kể quyết định của bất kỳ công ty nào

Như một người dùng đã nói: "Tự lưu trữ email cũng giống như việc tự trồng thực phẩm vậy—cần nhiều công sức hơn, nhưng tôi biết chính xác những gì có trong đó".

## Triển khai tự lưu trữ của chúng tôi: Tổng quan kỹ thuật {#our-self-hosted-implementation-technical-overview}

Giải pháp email tự lưu trữ của chúng tôi được xây dựng dựa trên các nguyên tắc ưu tiên quyền riêng tư giống như tất cả các sản phẩm của chúng tôi. Hãy cùng khám phá cách triển khai kỹ thuật giúp điều này trở nên khả thi.

### Kiến trúc dựa trên Docker cho tính đơn giản và khả năng di động {#docker-based-architecture-for-simplicity-and-portability}

Chúng tôi đã đóng gói toàn bộ cơ sở hạ tầng email của mình bằng Docker, giúp dễ dàng triển khai trên hầu như mọi hệ thống dựa trên Linux. Phương pháp chứa này mang lại một số lợi ích chính:

1. **Triển khai đơn giản**: Một lệnh duy nhất thiết lập toàn bộ cơ sở hạ tầng
2. **Môi trường nhất quán**: Loại bỏ các vấn đề "hoạt động trên máy của tôi"
3. **Thành phần biệt lập**: Mỗi dịch vụ chạy trong vùng chứa riêng của nó để bảo mật
4. **Cập nhật dễ dàng**: Các lệnh đơn giản để cập nhật toàn bộ ngăn xếp
5. **Phụ thuộc tối thiểu**: Chỉ yêu cầu Docker và Docker Compose

Kiến trúc bao gồm các thùng chứa cho:

* Giao diện web để quản trị
* Máy chủ SMTP cho email gửi đi
* Máy chủ IMAP/POP3 để truy xuất email
* Máy chủ CalDAV cho lịch
* Máy chủ CardDAV cho danh bạ
* Cơ sở dữ liệu để lưu trữ cấu hình
* Redis để lưu trữ đệm và hiệu suất
* SQLite để lưu trữ hộp thư an toàn, được mã hóa

> \[!NOTE]
> Be sure to check out our [self-hosted developer guide](https://forwardemail.net/self-hosted)

### Cài đặt tập lệnh Bash: Khả năng truy cập đáp ứng bảo mật {#bash-script-installation-accessibility-meets-security}

Chúng tôi đã thiết kế quy trình cài đặt sao cho đơn giản nhất có thể nhưng vẫn đảm bảo các biện pháp bảo mật tốt nhất:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Lệnh duy nhất này:

1. Xác minh các yêu cầu hệ thống
2. Hướng dẫn bạn cấu hình
3. Thiết lập bản ghi DNS
4. Cấu hình chứng chỉ TLS
5. Triển khai các container Docker
6. Thực hiện tăng cường bảo mật ban đầu

Đối với những ai quan tâm đến việc chuyển các tập lệnh sang bash (như bạn nên làm!), chúng tôi khuyến khích xem lại tập lệnh trước khi thực thi. Nó hoàn toàn là mã nguồn mở và có thể kiểm tra.

### Mã hóa an toàn lượng tử cho quyền riêng tư bền vững trong tương lai {#quantum-safe-encryption-for-future-proof-privacy}

Giống như dịch vụ lưu trữ của chúng tôi, giải pháp tự lưu trữ của chúng tôi triển khai mã hóa chống lượng tử bằng ChaCha20-Poly1305 làm mật mã cho cơ sở dữ liệu SQLite. Phương pháp này bảo vệ dữ liệu email của bạn không chỉ chống lại các mối đe dọa hiện tại mà còn chống lại các cuộc tấn công điện toán lượng tử trong tương lai.

Mỗi hộp thư được lưu trữ trong tệp cơ sở dữ liệu SQLite được mã hóa riêng, mang lại sự cô lập hoàn toàn giữa những người dùng—một lợi thế bảo mật đáng kể so với các phương pháp cơ sở dữ liệu dùng chung truyền thống.

### Bảo trì và cập nhật tự động {#automated-maintenance-and-updates}

Chúng tôi đã xây dựng các tiện ích bảo trì toàn diện trực tiếp vào giải pháp tự lưu trữ:

1. **Sao lưu tự động**: Sao lưu theo lịch trình tất cả dữ liệu quan trọng
2. **Gia hạn chứng chỉ**: Quản lý chứng chỉ Let's Encrypt tự động
3. **Cập nhật hệ thống**: Lệnh đơn giản để cập nhật lên phiên bản mới nhất
4. **Giám sát tình trạng**: Kiểm tra tích hợp để đảm bảo tính toàn vẹn của hệ thống

Có thể truy cập các tiện ích này thông qua menu tương tác đơn giản:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## Cam kết nguồn mở {#the-open-source-commitment}

Giải pháp email tự lưu trữ của chúng tôi, giống như tất cả các sản phẩm của chúng tôi, là 100% mã nguồn mở—cả giao diện và phần phụ trợ. Điều này có nghĩa là:

1. **Hoàn toàn minh bạch**: Mọi dòng mã xử lý email của bạn đều có thể được công khai để giám sát
2. **Đóng góp của cộng đồng**: Bất kỳ ai cũng có thể đóng góp cải tiến hoặc khắc phục sự cố
3. **Bảo mật thông qua tính minh bạch**: Các lỗ hổng có thể được xác định và khắc phục bởi cộng đồng toàn cầu
4. **Không có sự ràng buộc của nhà cung cấp**: Bạn không bao giờ phụ thuộc vào sự tồn tại của công ty chúng tôi

Toàn bộ cơ sở mã có sẵn trên GitHub tại <https://github.com/forwardemail/forwardemail.net>.

## Tự lưu trữ so với Được quản lý: Lựa chọn đúng đắn {#self-hosted-vs-managed-making-the-right-choice}

Mặc dù chúng tôi tự hào cung cấp tùy chọn tự lưu trữ, chúng tôi nhận ra rằng đây không phải là lựa chọn phù hợp với tất cả mọi người. Email tự lưu trữ đi kèm với những trách nhiệm và thách thức thực sự:

### Thực tế của việc tự lưu trữ email {#the-reality-of-self-hosting-email}

#### Những cân nhắc về mặt kỹ thuật {#technical-considerations}

* **Quản lý máy chủ**: Bạn sẽ cần duy trì VPS hoặc máy chủ chuyên dụng
* **Cấu hình DNS**: Thiết lập DNS phù hợp là rất quan trọng đối với khả năng phân phối
* **Cập nhật bảo mật**: Luôn cập nhật các bản vá bảo mật là điều cần thiết
* **Quản lý thư rác**: Bạn sẽ cần xử lý việc lọc thư rác
* **Chiến lược sao lưu**: Triển khai các bản sao lưu đáng tin cậy là trách nhiệm của bạn

#### Đầu tư thời gian {#time-investment}

* **Thiết lập ban đầu**: Thời gian thiết lập, xác minh và đọc tài liệu
* **Bảo trì đang diễn ra**: Cập nhật và giám sát thỉnh thoảng
* **Khắc phục sự cố**: Thời gian thỉnh thoảng để giải quyết sự cố

#### Những cân nhắc về tài chính {#financial-considerations}

* **Chi phí máy chủ**: $5-$20/tháng cho VPS cơ bản
* **Đăng ký tên miền**: $10-$20/năm
* **Giá trị thời gian**: Khoản đầu tư thời gian của bạn có giá trị thực

### Khi nào nên chọn dịch vụ được quản lý của chúng tôi {#when-to-choose-our-managed-service}

Đối với nhiều người dùng, dịch vụ được quản lý của chúng tôi vẫn là lựa chọn tốt nhất:

1. **Tiện lợi**: Chúng tôi xử lý mọi công việc bảo trì, cập nhật và giám sát
2. **Độ tin cậy**: Tận dụng cơ sở hạ tầng và chuyên môn đã được thiết lập của chúng tôi
3. **Hỗ trợ**: Nhận trợ giúp khi có sự cố phát sinh
4. **Khả năng phân phối**: Tận dụng danh tiếng IP đã được thiết lập của chúng tôi
5. **Hiệu quả về chi phí**: Khi bạn tính đến chi phí thời gian, dịch vụ của chúng tôi thường tiết kiệm hơn

Cả hai lựa chọn đều mang lại lợi ích về quyền riêng tư và tính minh bạch nguồn mở như nhau—sự khác biệt chỉ nằm ở người quản lý cơ sở hạ tầng.

## Bắt đầu với Email Chuyển tiếp Tự lưu trữ {#getting-started-with-self-hosted-forward-email}

Sẵn sàng kiểm soát cơ sở hạ tầng email của bạn chưa? Sau đây là cách bắt đầu:

### Yêu cầu hệ thống {#system-requirements}

* Ubuntu 20.04 LTS hoặc mới hơn (khuyến nghị)
* RAM tối thiểu 1GB (khuyến nghị 2GB trở lên)
* Dung lượng lưu trữ khuyến nghị 20GB
* Tên miền do bạn kiểm soát
* Địa chỉ IP công cộng hỗ trợ cổng 25
* Khả năng thiết lập [đảo ngược PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Hỗ trợ IPv4 và IPv6

> \[!TIP]
> We recommend several mail server providers at <https://forwardemail.net/blog/docs/best-mail-server-providers> (source at <https://github.com/forwardemail/awesome-mail-server-providers>)

### Các bước cài đặt {#installation-steps}

1. **Chạy tập lệnh cài đặt**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Thực hiện theo các lời nhắc tương tác**:
* Nhập tên miền của bạn
* Cấu hình thông tin đăng nhập của quản trị viên
* Thiết lập bản ghi DNS theo hướng dẫn
* Chọn tùy chọn cấu hình ưa thích của bạn

3. **Xác minh cài đặt**:
Sau khi cài đặt hoàn tất, bạn có thể xác minh mọi thứ đang hoạt động bằng cách:
* Kiểm tra trạng thái container: `docker ps`
* Gửi email kiểm tra
* Đăng nhập vào giao diện web

## Tương lai của Email tự lưu trữ {#the-future-of-self-hosted-email}

Giải pháp tự lưu trữ của chúng tôi chỉ là bước khởi đầu. Chúng tôi cam kết liên tục cải thiện dịch vụ này với:

1. **Công cụ quản trị nâng cao**: Quản lý dựa trên web mạnh mẽ hơn
2. **Tùy chọn xác thực bổ sung**: Bao gồm hỗ trợ khóa bảo mật phần cứng
3. **Giám sát nâng cao**: Thông tin chi tiết tốt hơn về tình trạng và hiệu suất của hệ thống
4. **Triển khai nhiều máy chủ**: Tùy chọn cho cấu hình có tính khả dụng cao
5. **Cải tiến do cộng đồng thúc đẩy**: Kết hợp các đóng góp từ người dùng

## Kết luận: Tự do email cho mọi người {#conclusion-email-freedom-for-everyone}

Việc ra mắt giải pháp email tự lưu trữ của chúng tôi đánh dấu một cột mốc quan trọng trong sứ mệnh cung cấp các dịch vụ email minh bạch, tập trung vào quyền riêng tư của chúng tôi. Cho dù bạn chọn dịch vụ được quản lý hay tùy chọn tự lưu trữ của chúng tôi, bạn đều được hưởng lợi từ cam kết không ngừng nghỉ của chúng tôi đối với các nguyên tắc nguồn mở và thiết kế ưu tiên quyền riêng tư.

Email quá quan trọng để được kiểm soát bởi các hệ thống độc quyền, khép kín ưu tiên thu thập dữ liệu hơn quyền riêng tư của người dùng. Với giải pháp tự lưu trữ của Forward Email, chúng tôi tự hào cung cấp một giải pháp thay thế thực sự—giải pháp giúp bạn kiểm soát hoàn toàn các hoạt động truyền thông kỹ thuật số của mình.

Chúng tôi tin rằng quyền riêng tư không chỉ là một tính năng; đó là một quyền cơ bản. Và với tùy chọn email tự lưu trữ của chúng tôi, chúng tôi đang làm cho quyền đó dễ tiếp cận hơn bao giờ hết.

Bạn đã sẵn sàng kiểm soát email của mình chưa? [Bắt đầu ngay hôm nay](https://forwardemail.net/self-hosted) hoặc khám phá [Kho lưu trữ GitHub](https://github.com/forwardemail/forwardemail.net) của chúng tôi để tìm hiểu thêm.

## Tham chiếu {#references}

\[1] Chuyển tiếp Email Kho lưu trữ GitHub: <https://github.com/forwardemail/forwardemail.net>

\[2] Tài liệu tự lưu trữ: <https://forwardemail.net/en/self-hosted>

\[3] Triển khai kỹ thuật bảo mật email: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Tại sao Email nguồn mở lại quan trọng: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>