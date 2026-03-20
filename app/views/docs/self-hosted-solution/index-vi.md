# Email Tự Lưu Trữ: Cam Kết Với Mã Nguồn Mở {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Minh họa giải pháp email tự lưu trữ" class="rounded-lg" />


## Mục Lục {#table-of-contents}

* [Lời Nói Đầu](#foreword)
* [Tại Sao Email Tự Lưu Trữ Lại Quan Trọng](#why-self-hosted-email-matters)
  * [Vấn Đề Với Dịch Vụ Email Truyền Thống](#the-problem-with-traditional-email-services)
  * [Giải Pháp Tự Lưu Trữ](#the-self-hosted-alternative)
* [Triển Khai Email Tự Lưu Trữ Của Chúng Tôi: Tổng Quan Kỹ Thuật](#our-self-hosted-implementation-technical-overview)
  * [Kiến Trúc Dựa Trên Docker Cho Sự Đơn Giản Và Di Động](#docker-based-architecture-for-simplicity-and-portability)
  * [Cài Đặt Bằng Bash Script: Tiếp Cận Dễ Dàng Kết Hợp An Toàn](#bash-script-installation-accessibility-meets-security)
  * [Mã Hóa An Toàn Trước Lượng Tử Cho Quyền Riêng Tư Bền Vững](#quantum-safe-encryption-for-future-proof-privacy)
  * [Bảo Trì Và Cập Nhật Tự Động](#automated-maintenance-and-updates)
* [Cam Kết Mã Nguồn Mở](#the-open-source-commitment)
* [Tự Lưu Trữ So Với Dịch Vụ Quản Lý: Lựa Chọn Đúng Đắn](#self-hosted-vs-managed-making-the-right-choice)
  * [Thực Tế Của Việc Tự Lưu Trữ Email](#the-reality-of-self-hosting-email)
  * [Khi Nào Nên Chọn Dịch Vụ Quản Lý Của Chúng Tôi](#when-to-choose-our-managed-service)
* [Bắt Đầu Với Forward Email Tự Lưu Trữ](#getting-started-with-self-hosted-forward-email)
  * [Yêu Cầu Hệ Thống](#system-requirements)
  * [Các Bước Cài Đặt](#installation-steps)
* [Tương Lai Của Email Tự Lưu Trữ](#the-future-of-self-hosted-email)
* [Kết Luận: Tự Do Email Cho Mọi Người](#conclusion-email-freedom-for-everyone)
* [Tài Liệu Tham Khảo](#references)


## Lời Nói Đầu {#foreword}

Trong bối cảnh kỹ thuật số ngày nay, email vẫn là xương sống của danh tính và giao tiếp trực tuyến của chúng ta. Tuy nhiên, khi các mối quan tâm về quyền riêng tư ngày càng tăng, nhiều người dùng phải đối mặt với một lựa chọn khó khăn: sự tiện lợi đánh đổi bằng quyền riêng tư, hoặc quyền riêng tư đánh đổi bằng sự tiện lợi. Tại Forward Email, chúng tôi luôn tin rằng bạn không nên phải chọn giữa hai điều đó.

Hôm nay, chúng tôi rất vui mừng thông báo một cột mốc quan trọng trong hành trình của mình: ra mắt giải pháp email tự lưu trữ. Tính năng này thể hiện cam kết sâu sắc nhất của chúng tôi với các nguyên tắc mã nguồn mở, thiết kế tập trung vào quyền riêng tư và trao quyền cho người dùng. Với tùy chọn tự lưu trữ, chúng tôi trao toàn bộ quyền lực và kiểm soát giao tiếp email trực tiếp vào tay bạn.

Bài viết này khám phá triết lý đằng sau giải pháp tự lưu trữ của chúng tôi, cách triển khai kỹ thuật, và lý do tại sao nó quan trọng đối với người dùng ưu tiên cả quyền riêng tư lẫn quyền sở hữu trong giao tiếp kỹ thuật số của họ.


## Tại Sao Email Tự Lưu Trữ Lại Quan Trọng {#why-self-hosted-email-matters}

Giải pháp email tự lưu trữ của chúng tôi là biểu hiện rõ ràng nhất của niềm tin rằng quyền riêng tư thực sự nghĩa là kiểm soát, và kiểm soát bắt đầu từ mã nguồn mở. Đối với những người dùng đòi hỏi quyền sở hữu hoàn toàn đối với giao tiếp kỹ thuật số của mình, tự lưu trữ không còn là ý tưởng ngoại vi — đó là một quyền thiết yếu. Chúng tôi tự hào đứng sau niềm tin đó với một nền tảng hoàn toàn mở, có thể xác minh mà bạn có thể vận hành theo điều kiện của riêng mình.

### Vấn Đề Với Dịch Vụ Email Truyền Thống {#the-problem-with-traditional-email-services}

Các dịch vụ email truyền thống đặt ra nhiều thách thức cơ bản cho người dùng quan tâm đến quyền riêng tư:

1. **Yêu Cầu Tin Cậy**: Bạn phải tin tưởng nhà cung cấp không truy cập, phân tích hoặc chia sẻ dữ liệu của bạn
2. **Kiểm Soát Tập Trung**: Quyền truy cập của bạn có thể bị thu hồi bất cứ lúc nào vì bất kỳ lý do gì
3. **Dễ Bị Giám Sát**: Các dịch vụ tập trung là mục tiêu hàng đầu cho giám sát
4. **Thiếu Minh Bạch**: Hầu hết dịch vụ sử dụng phần mềm độc quyền, đóng nguồn
5. **Khó Chuyển Đổi Nhà Cung Cấp**: Việc di chuyển khỏi các dịch vụ này có thể khó hoặc không thể thực hiện

Ngay cả các nhà cung cấp email "tập trung vào quyền riêng tư" cũng thường không đáp ứng đầy đủ khi chỉ mở mã nguồn ứng dụng giao diện trong khi giữ hệ thống backend độc quyền và đóng. Điều này tạo ra một khoảng cách tin tưởng lớn — bạn được yêu cầu tin vào lời hứa về quyền riêng tư của họ mà không có khả năng xác minh.

### Giải Pháp Tự Lưu Trữ {#the-self-hosted-alternative}
Tự lưu trữ email của bạn cung cấp một cách tiếp cận hoàn toàn khác biệt:

1. **Kiểm soát Toàn diện**: Bạn sở hữu và kiểm soát toàn bộ hạ tầng email
2. **Quyền riêng tư Có thể Xác minh**: Toàn bộ hệ thống minh bạch và có thể kiểm tra
3. **Không Cần Tin tưởng**: Bạn không cần phải tin tưởng bên thứ ba với các liên lạc của mình
4. **Tự do Tùy chỉnh**: Điều chỉnh hệ thống theo nhu cầu cụ thể của bạn
5. **Độ bền cao**: Dịch vụ của bạn tiếp tục hoạt động bất kể quyết định của bất kỳ công ty nào

Như một người dùng đã nói: "Tự lưu trữ email của tôi giống như việc tự trồng thực phẩm — mất nhiều công sức hơn, nhưng tôi biết chính xác những gì có trong đó."


## Our Self-Hosted Implementation: Technical Overview {#our-self-hosted-implementation-technical-overview}

Giải pháp email tự lưu trữ của chúng tôi được xây dựng dựa trên các nguyên tắc ưu tiên quyền riêng tư giống như tất cả các sản phẩm của chúng tôi. Hãy cùng khám phá cách triển khai kỹ thuật giúp điều này trở thành hiện thực.

### Docker-Based Architecture for Simplicity and Portability {#docker-based-architecture-for-simplicity-and-portability}

Chúng tôi đã đóng gói toàn bộ hạ tầng email bằng Docker, giúp dễ dàng triển khai trên hầu hết các hệ thống dựa trên Linux. Cách tiếp cận container hóa này mang lại một số lợi ích chính:

1. **Triển khai Đơn giản**: Một lệnh duy nhất thiết lập toàn bộ hạ tầng
2. **Môi trường Đồng nhất**: Loại bỏ các vấn đề "chỉ chạy trên máy tôi"
3. **Các Thành phần Tách biệt**: Mỗi dịch vụ chạy trong container riêng để đảm bảo an ninh
4. **Cập nhật Dễ dàng**: Các lệnh đơn giản để cập nhật toàn bộ hệ thống
5. **Phụ thuộc Tối thiểu**: Chỉ yêu cầu Docker và Docker Compose

Kiến trúc bao gồm các container cho:

* Giao diện web để quản trị
* Máy chủ SMTP cho email gửi đi
* Máy chủ IMAP/POP3 để lấy email
* Máy chủ CalDAV cho lịch
* Máy chủ CardDAV cho danh bạ
* Cơ sở dữ liệu để lưu cấu hình
* Redis để cache và tăng hiệu suất
* SQLite để lưu trữ hộp thư mã hóa an toàn

> \[!NOTE]
> Hãy chắc chắn xem qua [hướng dẫn dành cho nhà phát triển tự lưu trữ của chúng tôi](https://forwardemail.net/self-hosted)

### Bash Script Installation: Accessibility Meets Security {#bash-script-installation-accessibility-meets-security}

Chúng tôi thiết kế quy trình cài đặt đơn giản nhất có thể trong khi vẫn duy trì các thực hành bảo mật tốt nhất:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Lệnh duy nhất này:

1. Kiểm tra yêu cầu hệ thống
2. Hướng dẫn bạn qua cấu hình
3. Thiết lập các bản ghi DNS
4. Cấu hình chứng chỉ TLS
5. Triển khai các container Docker
6. Thực hiện các bước tăng cường bảo mật ban đầu

Đối với những ai lo ngại về việc pipe script vào bash (điều bạn nên cẩn thận!), chúng tôi khuyến khích bạn xem xét script trước khi thực thi. Nó hoàn toàn mã nguồn mở và có thể kiểm tra được.

### Quantum-Safe Encryption for Future-Proof Privacy {#quantum-safe-encryption-for-future-proof-privacy}

Giống như dịch vụ được lưu trữ của chúng tôi, giải pháp tự lưu trữ cũng áp dụng mã hóa chống lượng tử sử dụng ChaCha20-Poly1305 làm thuật toán mã hóa cho cơ sở dữ liệu SQLite. Cách tiếp cận này bảo vệ dữ liệu email của bạn không chỉ chống lại các mối đe dọa hiện tại mà còn chống lại các cuộc tấn công máy tính lượng tử trong tương lai.

Mỗi hộp thư được lưu trữ trong một file cơ sở dữ liệu SQLite mã hóa riêng biệt, cung cấp sự cô lập hoàn toàn giữa các người dùng — một lợi thế bảo mật đáng kể so với cách tiếp cận cơ sở dữ liệu chia sẻ truyền thống.

### Automated Maintenance and Updates {#automated-maintenance-and-updates}

Chúng tôi đã xây dựng các tiện ích bảo trì toàn diện trực tiếp trong giải pháp tự lưu trữ:

1. **Sao lưu Tự động**: Sao lưu định kỳ tất cả dữ liệu quan trọng
2. **Gia hạn Chứng chỉ**: Quản lý chứng chỉ Let's Encrypt tự động
3. **Cập nhật Hệ thống**: Lệnh đơn giản để cập nhật lên phiên bản mới nhất
4. **Giám sát Sức khỏe**: Kiểm tra tích hợp để đảm bảo tính toàn vẹn hệ thống

Các tiện ích này có thể truy cập qua menu tương tác đơn giản:

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


## The Open-Source Commitment {#the-open-source-commitment}

Giải pháp email tự lưu trữ của chúng tôi, giống như tất cả các sản phẩm khác, hoàn toàn mã nguồn mở — cả frontend và backend. Điều này có nghĩa là:
1. **Minh Bạch Tuyệt Đối**: Mọi dòng mã xử lý email của bạn đều có sẵn để công chúng kiểm tra  
2. **Đóng Góp Cộng Đồng**: Bất kỳ ai cũng có thể đóng góp cải tiến hoặc sửa lỗi  
3. **Bảo Mật Qua Sự Mở Rộng**: Các lỗ hổng có thể được phát hiện và sửa chữa bởi cộng đồng toàn cầu  
4. **Không Bị Ràng Buộc Nhà Cung Cấp**: Bạn không bao giờ phụ thuộc vào sự tồn tại của công ty chúng tôi  

Toàn bộ mã nguồn có sẵn trên GitHub tại <https://github.com/forwardemail/forwardemail.net>.


## Tự Lưu Trữ vs. Quản Lý: Lựa Chọn Đúng Đắn {#self-hosted-vs-managed-making-the-right-choice}

Mặc dù chúng tôi tự hào cung cấp tùy chọn tự lưu trữ, chúng tôi nhận ra rằng không phải ai cũng phù hợp với lựa chọn này. Tự lưu trữ email đi kèm với những trách nhiệm và thách thức thực sự:

### Thực Tế Của Việc Tự Lưu Trữ Email {#the-reality-of-self-hosting-email}

#### Các Cân Nhắc Kỹ Thuật {#technical-considerations}

* **Quản Lý Máy Chủ**: Bạn sẽ cần duy trì một VPS hoặc máy chủ chuyên dụng  
* **Cấu Hình DNS**: Thiết lập DNS đúng cách rất quan trọng cho khả năng gửi thư thành công  
* **Cập Nhật Bảo Mật**: Luôn cập nhật các bản vá bảo mật là điều thiết yếu  
* **Quản Lý Spam**: Bạn sẽ phải xử lý việc lọc thư rác  
* **Chiến Lược Sao Lưu**: Thực hiện sao lưu đáng tin cậy là trách nhiệm của bạn  

#### Đầu Tư Thời Gian {#time-investment}

* **Thiết Lập Ban Đầu**: Thời gian để thiết lập, xác minh và đọc tài liệu  
* **Bảo Trì Liên Tục**: Cập nhật và giám sát định kỳ  
* **Khắc Phục Sự Cố**: Thỉnh thoảng dành thời gian để giải quyết các vấn đề  

#### Cân Nhắc Tài Chính {#financial-considerations}

* **Chi Phí Máy Chủ**: 5-20 USD/tháng cho một VPS cơ bản  
* **Đăng Ký Tên Miền**: 10-20 USD/năm  
* **Giá Trị Thời Gian**: Thời gian bạn đầu tư có giá trị thực tế  

### Khi Nào Nên Chọn Dịch Vụ Quản Lý Của Chúng Tôi {#when-to-choose-our-managed-service}

Đối với nhiều người dùng, dịch vụ quản lý của chúng tôi vẫn là lựa chọn tốt nhất:

1. **Tiện Lợi**: Chúng tôi xử lý tất cả bảo trì, cập nhật và giám sát  
2. **Đáng Tin Cậy**: Hưởng lợi từ hạ tầng và chuyên môn đã được thiết lập  
3. **Hỗ Trợ**: Nhận trợ giúp khi có sự cố xảy ra  
4. **Khả Năng Gửi Thư**: Tận dụng uy tín IP đã được thiết lập  
5. **Hiệu Quả Chi Phí**: Khi tính đến chi phí thời gian, dịch vụ của chúng tôi thường kinh tế hơn  

Cả hai lựa chọn đều cung cấp lợi ích về quyền riêng tư và minh bạch mã nguồn mở — sự khác biệt chỉ là ai quản lý hạ tầng.


## Bắt Đầu Với Forward Email Tự Lưu Trữ {#getting-started-with-self-hosted-forward-email}

Sẵn sàng kiểm soát hạ tầng email của bạn? Đây là cách bắt đầu:

### Yêu Cầu Hệ Thống {#system-requirements}

* Ubuntu 20.04 LTS hoặc mới hơn (khuyến nghị)  
* Tối thiểu 1GB RAM (khuyến nghị 2GB trở lên)  
* Khuyến nghị 20GB dung lượng lưu trữ  
* Một tên miền bạn kiểm soát  
* Địa chỉ IP công khai hỗ trợ cổng 25  
* Khả năng thiết lập [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)  
* Hỗ trợ IPv4 và IPv6  

> \[!TIP]  
> Chúng tôi khuyến nghị một số nhà cung cấp máy chủ mail tại <https://forwardemail.net/blog/docs/best-mail-server-providers> (nguồn tại <https://github.com/forwardemail/awesome-mail-server-providers>)  

### Các Bước Cài Đặt {#installation-steps}

1. **Chạy Script Cài Đặt**:  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Theo Các Hướng Dẫn Tương Tác**:  
   * Nhập tên miền của bạn  
   * Cấu hình thông tin quản trị viên  
   * Thiết lập các bản ghi DNS theo hướng dẫn  
   * Chọn các tùy chọn cấu hình bạn ưu tiên  

3. **Xác Minh Cài Đặt**:  
   Khi cài đặt hoàn tất, bạn có thể kiểm tra mọi thứ hoạt động bằng cách:  
   * Kiểm tra trạng thái container: `docker ps`  
   * Gửi một email thử nghiệm  
   * Đăng nhập vào giao diện web  


## Tương Lai Của Email Tự Lưu Trữ {#the-future-of-self-hosted-email}

Giải pháp tự lưu trữ của chúng tôi chỉ mới là khởi đầu. Chúng tôi cam kết liên tục cải tiến sản phẩm này với:

1. **Công Cụ Quản Trị Nâng Cao**: Quản lý web mạnh mẽ hơn  
2. **Tùy Chọn Xác Thực Bổ Sung**: Bao gồm hỗ trợ khóa bảo mật phần cứng  
3. **Giám Sát Tiên Tiến**: Cung cấp cái nhìn sâu sắc hơn về sức khỏe và hiệu suất hệ thống  
4. **Triển Khai Đa Máy Chủ**: Tùy chọn cấu hình độ sẵn sàng cao  
5. **Cải Tiến Dựa Trên Cộng Đồng**: Kết hợp các đóng góp từ người dùng
## Kết luận: Tự do Email cho Mọi Người {#conclusion-email-freedom-for-everyone}

Việc ra mắt giải pháp email tự lưu trữ của chúng tôi đánh dấu một cột mốc quan trọng trong sứ mệnh cung cấp dịch vụ email tập trung vào quyền riêng tư và minh bạch. Dù bạn chọn dịch vụ quản lý của chúng tôi hay tùy chọn tự lưu trữ, bạn đều được hưởng lợi từ cam kết kiên định của chúng tôi đối với các nguyên tắc mã nguồn mở và thiết kế ưu tiên quyền riêng tư.

Email quá quan trọng để bị kiểm soát bởi các hệ thống đóng, độc quyền ưu tiên thu thập dữ liệu hơn là quyền riêng tư của người dùng. Với giải pháp tự lưu trữ của Forward Email, chúng tôi tự hào cung cấp một lựa chọn thực sự—một lựa chọn đặt bạn vào quyền kiểm soát hoàn toàn các giao tiếp kỹ thuật số của mình.

Chúng tôi tin rằng quyền riêng tư không chỉ là một tính năng; đó là một quyền cơ bản. Và với tùy chọn email tự lưu trữ của chúng tôi, chúng tôi đang làm cho quyền đó trở nên dễ tiếp cận hơn bao giờ hết.

Sẵn sàng kiểm soát email của bạn? [Bắt đầu ngay hôm nay](https://forwardemail.net/self-hosted) hoặc khám phá [kho GitHub của chúng tôi](https://github.com/forwardemail/forwardemail.net) để tìm hiểu thêm.


## Tài liệu tham khảo {#references}

\[1] Kho GitHub Forward Email: <https://github.com/forwardemail/forwardemail.net>

\[2] Tài liệu Tự Lưu Trữ: <https://forwardemail.net/en/self-hosted>

\[3] Triển khai Kỹ thuật Bảo vệ Quyền riêng tư Email: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Tại sao Email Mã Nguồn Mở Quan Trọng: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
