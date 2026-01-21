# Email tự lưu trữ: Cam kết về nguồn mở {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Mục lục {#table-of-contents}

* [Lời nói đầu](#foreword)
* [Tại sao Email tự lưu trữ lại quan trọng](#why-self-hosted-email-matters)
  * [Vấn đề với các dịch vụ email truyền thống](#the-problem-with-traditional-email-services)
  * [Giải pháp thay thế tự lưu trữ](#the-self-hosted-alternative)
* [Triển khai tự lưu trữ của chúng tôi: Tổng quan kỹ thuật](#our-self-hosted-implementation-technical-overview)
  * [Kiến trúc dựa trên Docker cho tính đơn giản và khả năng di động](#docker-based-architecture-for-simplicity-and-portability)
  * [Cài đặt Bash Script: Khả năng truy cập đáp ứng bảo mật](#bash-script-installation-accessibility-meets-security)
  * [Mã hóa lượng tử an toàn cho quyền riêng tư trong tương lai](#quantum-safe-encryption-for-future-proof-privacy)
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

Trong bối cảnh kỹ thuật số ngày nay, email vẫn là xương sống của danh tính và giao tiếp trực tuyến. Tuy nhiên, khi những lo ngại về quyền riêng tư ngày càng gia tăng, nhiều người dùng phải đối mặt với một lựa chọn khó khăn: đánh đổi sự tiện lợi bằng quyền riêng tư, hay đánh đổi sự riêng tư bằng sự tiện lợi. Tại Forward Email, chúng tôi luôn tin rằng bạn không nên phải lựa chọn giữa hai điều này.

Hôm nay, chúng tôi vui mừng thông báo một cột mốc quan trọng trong hành trình của mình: ra mắt giải pháp email tự lưu trữ. Tính năng này thể hiện cam kết sâu sắc nhất của chúng tôi đối với các nguyên tắc nguồn mở, thiết kế tập trung vào quyền riêng tư và trao quyền cho người dùng. Với tùy chọn tự lưu trữ, chúng tôi trao toàn bộ sức mạnh và quyền kiểm soát hoạt động giao tiếp email của bạn trực tiếp vào tay bạn.

Bài đăng trên blog này khám phá triết lý đằng sau giải pháp tự lưu trữ của chúng tôi, cách triển khai kỹ thuật và lý do tại sao giải pháp này lại quan trọng đối với những người dùng coi trọng quyền riêng tư và quyền sở hữu trong hoạt động truyền thông kỹ thuật số của họ.

## Tại sao Email tự lưu trữ lại quan trọng {#why-self-hosted-email-matters}

Giải pháp email tự lưu trữ của chúng tôi là minh chứng rõ ràng nhất cho niềm tin của chúng tôi rằng quyền riêng tư thực sự đồng nghĩa với quyền kiểm soát, và quyền kiểm soát bắt đầu từ mã nguồn mở. Đối với những người dùng yêu cầu quyền sở hữu hoàn toàn đối với các thông tin liên lạc kỹ thuật số của mình, việc tự lưu trữ không còn là một ý tưởng xa vời nữa — đó là một quyền thiết yếu. Chúng tôi tự hào bảo vệ niềm tin đó bằng một nền tảng hoàn toàn mở, có thể xác minh mà bạn có thể vận hành theo cách riêng của mình.

### Vấn đề với các dịch vụ email truyền thống {#the-problem-with-traditional-email-services}

Các dịch vụ email truyền thống đặt ra một số thách thức cơ bản đối với người dùng quan tâm đến quyền riêng tư:

1. **Yêu cầu về độ tin cậy**: Bạn phải tin tưởng nhà cung cấp sẽ không truy cập, phân tích hoặc chia sẻ dữ liệu của bạn.
2. **Kiểm soát tập trung**: Quyền truy cập của bạn có thể bị thu hồi bất cứ lúc nào vì bất kỳ lý do gì.
3. **Lỗ hổng giám sát**: Các dịch vụ tập trung là mục tiêu chính của giám sát.
4. **Tính minh bạch hạn chế**: Hầu hết các dịch vụ đều sử dụng phần mềm độc quyền, mã nguồn đóng.
5. **Khóa chặt nhà cung cấp**: Việc di chuyển khỏi các dịch vụ này có thể khó khăn hoặc không thể thực hiện được.

Ngay cả các nhà cung cấp dịch vụ email "tập trung vào quyền riêng tư" cũng thường thiếu sót khi chỉ cung cấp mã nguồn mở cho các ứng dụng frontend trong khi vẫn giữ hệ thống backend độc quyền và khép kín. Điều này tạo ra một khoảng cách đáng kể về lòng tin - bạn bị yêu cầu tin vào những cam kết về quyền riêng tư của họ mà không có khả năng xác minh chúng.

### Giải pháp thay thế tự lưu trữ {#the-self-hosted-alternative}

Tự lưu trữ email của bạn cung cấp một cách tiếp cận cơ bản khác:

1. **Kiểm soát hoàn toàn**: Bạn sở hữu và kiểm soát toàn bộ cơ sở hạ tầng email
2. **Quyền riêng tư có thể xác minh**: Toàn bộ hệ thống minh bạch và có thể kiểm tra
3. **Không cần ủy thác**: Bạn không cần ủy thác bên thứ ba cho hoạt động truyền thông của mình
4. **Tự do tùy chỉnh**: Điều chỉnh hệ thống theo nhu cầu cụ thể của bạn
5. **Khả năng phục hồi**: Dịch vụ của bạn vẫn tiếp tục bất kể quyết định của công ty

Như một người dùng đã nói: "Tự lưu trữ email của tôi cũng giống như việc tự trồng thực phẩm vậy—nó tốn nhiều công sức hơn, nhưng tôi biết chính xác những gì có trong đó."

## Triển khai tự lưu trữ của chúng tôi: Tổng quan kỹ thuật {#our-self-hosted-implementation-technical-overview}

Giải pháp email tự lưu trữ của chúng tôi được xây dựng dựa trên cùng nguyên tắc đặt quyền riêng tư lên hàng đầu, nguyên tắc đã được áp dụng cho tất cả các sản phẩm của chúng tôi. Hãy cùng khám phá cách triển khai kỹ thuật giúp điều này trở nên khả thi.

### Kiến trúc dựa trên Docker cho tính đơn giản và khả năng di động {#docker-based-architecture-for-simplicity-and-portability}

Chúng tôi đã đóng gói toàn bộ cơ sở hạ tầng email của mình bằng Docker, giúp việc triển khai dễ dàng trên hầu hết mọi hệ thống chạy Linux. Phương pháp container hóa này mang lại một số lợi ích chính:

1. **Triển khai đơn giản**: Chỉ cần một lệnh để thiết lập toàn bộ cơ sở hạ tầng
2. **Môi trường nhất quán**: Loại bỏ vấn đề "hoạt động trên máy của tôi"
3. **Thành phần biệt lập**: Mỗi dịch vụ chạy trong vùng chứa riêng để bảo mật
4. **Cập nhật dễ dàng**: Các lệnh đơn giản để cập nhật toàn bộ ngăn xếp
5. **Phụ thuộc tối thiểu**: Chỉ yêu cầu Docker và Docker Compose

Kiến trúc bao gồm các thùng chứa cho:

* Giao diện web để quản trị
* Máy chủ SMTP cho email gửi đi
* Máy chủ IMAP/POP3 để truy xuất email
* Máy chủ CalDAV cho lịch
* Máy chủ CardDAV cho danh bạ
* Cơ sở dữ liệu để lưu trữ cấu hình
* Redis để lưu trữ bộ nhớ đệm và tăng hiệu suất
* SQLite để lưu trữ hộp thư an toàn, được mã hóa

> \[!NOTE]
> Đừng quên xem [hướng dẫn dành cho nhà phát triển tự lưu trữ](https://forwardemail.net/self-hosted) của chúng tôi

### Cài đặt tập lệnh Bash: Khả năng truy cập đáp ứng bảo mật {#bash-script-installation-accessibility-meets-security}

Chúng tôi đã thiết kế quy trình cài đặt sao cho đơn giản nhất có thể nhưng vẫn đảm bảo các biện pháp bảo mật tốt nhất:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Lệnh đơn này:

1. Xác minh các yêu cầu hệ thống
2. Hướng dẫn bạn cấu hình
3. Thiết lập bản ghi DNS
4. Cấu hình chứng chỉ TLS
5. Triển khai các container Docker
6. Thực hiện tăng cường bảo mật ban đầu

Đối với những ai lo lắng về việc chuyển đổi tập lệnh sang bash (điều mà bạn nên làm!), chúng tôi khuyến khích bạn xem lại tập lệnh trước khi thực thi. Nó hoàn toàn mã nguồn mở và có thể được kiểm tra.

### Mã hóa lượng tử an toàn cho quyền riêng tư bền vững trong tương lai {#quantum-safe-encryption-for-future-proof-privacy}

Giống như dịch vụ lưu trữ của chúng tôi, giải pháp tự lưu trữ của chúng tôi triển khai mã hóa chống lượng tử bằng cách sử dụng ChaCha20-Poly1305 làm mật mã cho cơ sở dữ liệu SQLite. Phương pháp này bảo vệ dữ liệu email của bạn không chỉ khỏi các mối đe dọa hiện tại mà còn khỏi các cuộc tấn công điện toán lượng tử trong tương lai.

Mỗi hộp thư được lưu trữ trong tệp cơ sở dữ liệu SQLite được mã hóa riêng, mang lại sự cô lập hoàn toàn giữa những người dùng—một lợi thế bảo mật đáng kể so với các phương pháp cơ sở dữ liệu dùng chung truyền thống.

### Bảo trì và cập nhật tự động {#automated-maintenance-and-updates}

Chúng tôi đã xây dựng các tiện ích bảo trì toàn diện trực tiếp vào giải pháp tự lưu trữ:

1. **Sao lưu tự động**: Sao lưu theo lịch trình tất cả dữ liệu quan trọng
2. **Gia hạn chứng chỉ**: Quản lý chứng chỉ Let's Encrypt tự động
3. **Cập nhật hệ thống**: Lệnh đơn giản để cập nhật lên phiên bản mới nhất
4. **Giám sát tình trạng**: Các kiểm tra tích hợp để đảm bảo tính toàn vẹn của hệ thống

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

Giải pháp email tự lưu trữ của chúng tôi, giống như tất cả các sản phẩm khác, đều là mã nguồn mở 100%—cả giao diện người dùng và giao diện quản trị. Điều này có nghĩa là:

1. **Minh bạch hoàn toàn**: Mọi dòng mã xử lý email của bạn đều được công khai để công chúng giám sát.
2. **Đóng góp của cộng đồng**: Bất kỳ ai cũng có thể đóng góp cải tiến hoặc khắc phục sự cố.
3. **Bảo mật thông qua tính minh bạch**: Các lỗ hổng có thể được xác định và khắc phục bởi cộng đồng toàn cầu.
4. **Không bị ràng buộc bởi nhà cung cấp**: Bạn không bao giờ phụ thuộc vào sự tồn tại của công ty chúng tôi

Toàn bộ cơ sở mã có sẵn trên GitHub tại <https://github.com/forwardemail/forwardemail.net>.

## Tự lưu trữ so với Được quản lý: Lựa chọn đúng đắn {#self-hosted-vs-managed-making-the-right-choice}

Mặc dù chúng tôi tự hào cung cấp tùy chọn tự lưu trữ, nhưng chúng tôi hiểu rằng đây không phải là lựa chọn phù hợp cho tất cả mọi người. Email tự lưu trữ đi kèm với những trách nhiệm và thách thức thực sự:

### Thực tế của việc tự lưu trữ email {#the-reality-of-self-hosting-email}

#### Cân nhắc kỹ thuật {#technical-considerations}

* **Quản lý Máy chủ**: Bạn cần duy trì VPS hoặc máy chủ chuyên dụng
* **Cấu hình DNS**: Thiết lập DNS đúng cách rất quan trọng để đảm bảo khả năng phân phối
* **Cập nhật Bảo mật**: Việc cập nhật các bản vá bảo mật là điều cần thiết
* **Quản lý Thư rác**: Bạn cần xử lý việc lọc thư rác
* **Chiến lược Sao lưu**: Việc triển khai các bản sao lưu đáng tin cậy là trách nhiệm của bạn

#### Đầu tư thời gian {#time-investment}

* **Thiết lập ban đầu**: Thời gian thiết lập, xác minh và đọc tài liệu.
* **Bảo trì liên tục**: Cập nhật và giám sát định kỳ.
* **Khắc phục sự cố**: Thời gian giải quyết sự cố định kỳ

#### Cân nhắc về tài chính {#financial-considerations}

* **Chi phí máy chủ**: 5-20 đô la/tháng cho VPS cơ bản
* **Đăng ký tên miền**: 10-20 đô la/năm
* **Giá trị thời gian**: Khoản đầu tư thời gian của bạn có giá trị thực

### Khi nào nên chọn dịch vụ được quản lý của chúng tôi {#when-to-choose-our-managed-service}

Đối với nhiều người dùng, dịch vụ được quản lý của chúng tôi vẫn là lựa chọn tốt nhất:

1. **Tiện lợi**: Chúng tôi xử lý mọi công việc bảo trì, cập nhật và giám sát
2. **Độ tin cậy**: Tận hưởng lợi ích từ cơ sở hạ tầng và chuyên môn vững chắc của chúng tôi
3. **Hỗ trợ**: Nhận hỗ trợ khi phát sinh sự cố
4. **Khả năng phân phối**: Tận dụng uy tín IP đã được khẳng định của chúng tôi
5. **Hiệu quả về chi phí**: Khi tính đến chi phí thời gian, dịch vụ của chúng tôi thường tiết kiệm hơn

Cả hai lựa chọn đều mang lại lợi ích về quyền riêng tư và tính minh bạch nguồn mở như nhau—sự khác biệt chỉ nằm ở người quản lý cơ sở hạ tầng.

## Bắt đầu với Email Chuyển tiếp Tự lưu trữ {#getting-started-with-self-hosted-forward-email}

Bạn đã sẵn sàng kiểm soát cơ sở hạ tầng email của mình chưa? Dưới đây là cách bắt đầu:

### Yêu cầu hệ thống {#system-requirements}

* Ubuntu 20.04 LTS hoặc mới hơn (khuyến nghị)
* RAM tối thiểu 1GB (khuyến nghị 2GB trở lên)
* Dung lượng lưu trữ khuyến nghị 20GB
* Tên miền do bạn kiểm soát
* Địa chỉ IP công cộng hỗ trợ cổng 25
* Khả năng thiết lập [PTR đảo ngược](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Hỗ trợ IPv4 và IPv6

> \[!TIP]
> Chúng tôi đề xuất một số nhà cung cấp máy chủ thư tại <https://forwardemail.net/blog/docs/best-mail-server-providers> (nguồn tại <https://github.com/forwardemail/awesome-mail-server-providers>)

### Các bước cài đặt {#installation-steps}

1. **Chạy tập lệnh cài đặt**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Làm theo lời nhắc tương tác**:
* Nhập tên miền của bạn
* Cấu hình thông tin đăng nhập quản trị viên
* Thiết lập bản ghi DNS theo hướng dẫn
* Chọn tùy chọn cấu hình bạn muốn

3. **Xác minh cài đặt**:
Sau khi cài đặt hoàn tất, bạn có thể xác minh mọi thứ đang hoạt động bằng cách:
* Kiểm tra trạng thái container: `docker ps`
* Gửi email kiểm tra
* Đăng nhập vào giao diện web

## Tương lai của Email tự lưu trữ {#the-future-of-self-hosted-email}

Giải pháp tự lưu trữ của chúng tôi chỉ là bước khởi đầu. Chúng tôi cam kết liên tục cải thiện dịch vụ này với:

1. **Công cụ Quản trị Nâng cao**: Quản lý dựa trên web mạnh mẽ hơn
2. **Tùy chọn Xác thực Bổ sung**: Bao gồm hỗ trợ khóa bảo mật phần cứng
3. **Giám sát Nâng cao**: Thông tin chi tiết hơn về tình trạng và hiệu suất hệ thống
4. **Triển khai Nhiều Máy chủ**: Các tùy chọn cho cấu hình có tính khả dụng cao
5. **Cải tiến Do Cộng đồng Thúc đẩy**: Kết hợp các đóng góp từ người dùng

## Kết luận: Tự do email cho mọi người {#conclusion-email-freedom-for-everyone}

Việc ra mắt giải pháp email tự lưu trữ của chúng tôi đánh dấu một cột mốc quan trọng trong sứ mệnh cung cấp các dịch vụ email minh bạch, tập trung vào quyền riêng tư. Dù bạn chọn dịch vụ được quản lý hay tùy chọn tự lưu trữ, bạn đều được hưởng lợi từ cam kết vững chắc của chúng tôi đối với các nguyên tắc nguồn mở và thiết kế đặt quyền riêng tư lên hàng đầu.

Email quá quan trọng để bị kiểm soát bởi các hệ thống khép kín, độc quyền, ưu tiên thu thập dữ liệu hơn quyền riêng tư của người dùng. Với giải pháp tự lưu trữ của Forward Email, chúng tôi tự hào cung cấp một giải pháp thay thế thực sự - một giải pháp cho phép bạn hoàn toàn kiểm soát các hoạt động truyền thông kỹ thuật số của mình.

Chúng tôi tin rằng quyền riêng tư không chỉ là một tính năng; đó là một quyền cơ bản. Và với tùy chọn email tự lưu trữ, chúng tôi đang giúp quyền đó dễ tiếp cận hơn bao giờ hết.

Bạn đã sẵn sàng kiểm soát email của mình chưa? [Bắt đầu ngay hôm nay](https://forwardemail.net/self-hosted) hoặc khám phá [Kho lưu trữ GitHub](https://github.com/forwardemail/forwardemail.net) của chúng tôi để tìm hiểu thêm.

## Tham chiếu {#references}

\[1] Chuyển tiếp Email Kho lưu trữ GitHub: <https://github.com/forwardemail/forwardemail.net>

\[2] Tài liệu tự lưu trữ: <https://forwardemail.net/en/self-hosted>

\[3] Triển khai kỹ thuật bảo mật email: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Tại sao Email nguồn mở lại quan trọng: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>