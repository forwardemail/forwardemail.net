# Cách thức hoạt động của tính năng Chuyển tiếp Email với Email Chuyển tiếp: Hướng dẫn đầy đủ {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lazy" src="/img/articles/email-privacy.webp" alt="" class="rounded-lg" />

## Mục lục {#table-of-contents}

* [Lời nói đầu](#foreword)
* [Chuyển tiếp email là gì](#what-is-email-forwarding)
* [Chuyển tiếp email hoạt động như thế nào: Giải thích kỹ thuật](#how-email-forwarding-works-the-technical-explanation)
  * [Quá trình chuyển tiếp email](#the-email-forwarding-process)
  * [Vai trò của SRS (Sender Rewriting Scheme)](#the-role-of-srs-sender-rewriting-scheme)
* [Chuyển tiếp email hoạt động như thế nào: Giải thích đơn giản](#how-email-forwarding-works-the-simple-explanation)
* [Thiết lập chuyển tiếp email với Forward Email](#setting-up-email-forwarding-with-forward-email)
  * [1. Đăng ký tài khoản](#1-sign-up-for-an-account)
  * [2. Thêm tên miền của bạn](#2-add-your-domain)
  * [3. Cấu hình Bản ghi DNS](#3-configure-dns-records)
  * [4. Tạo Chuyển tiếp Email](#4-create-email-forwards)
  * [5. Bắt đầu sử dụng địa chỉ email mới của bạn](#5-start-using-your-new-email-addresses)
* [Các tính năng nâng cao của Forward Email](#advanced-features-of-forward-email)
  * [Địa chỉ dùng một lần](#disposable-addresses)
  * [Nhiều người nhận và ký tự đại diện](#multiple-recipients-and-wildcards)
  * [Tích hợp "Gửi thư dưới dạng"](#send-mail-as-integration)
  * [Bảo mật chống lượng tử](#quantum-resistant-security)
  * [Hộp thư SQLite được mã hóa riêng lẻ](#individually-encrypted-sqlite-mailboxes)
* [Tại sao nên chọn Forward Email thay vì đối thủ cạnh tranh](#why-choose-forward-email-over-competitors)
  * [1. 100% Nguồn mở](#1-100-open-source)
  * [2. Tập trung vào quyền riêng tư](#2-privacy-focused)
  * [3. Không phụ thuộc vào bên thứ ba](#3-no-third-party-reliance)
  * [4. Giá cả hiệu quả](#4-cost-effective-pricing)
  * [5. Tài nguyên vô hạn](#5-unlimited-resources)
  * [6. Được các tổ chức lớn tin tưởng](#6-trusted-by-major-organizations)
* [Các trường hợp sử dụng phổ biến cho việc chuyển tiếp email](#common-use-cases-for-email-forwarding)
  * [Dành cho doanh nghiệp](#for-businesses)
  * [Dành cho nhà phát triển](#for-developers)
  * [Dành cho những cá nhân quan tâm đến quyền riêng tư](#for-privacy-conscious-individuals)
* [Thực hành tốt nhất để chuyển tiếp email](#best-practices-for-email-forwarding)
  * [1. Sử dụng Địa chỉ Mô tả](#1-use-descriptive-addresses)
  * [2. Triển khai xác thực phù hợp](#2-implement-proper-authentication)
  * [3. Thường xuyên xem lại các mục chuyển tiếp của bạn](#3-regularly-review-your-forwards)
  * [4. Thiết lập "Gửi thư dưới dạng" để trả lời liền mạch](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Sử dụng địa chỉ Catch-All một cách thận trọng](#5-use-catch-all-addresses-cautiously)
* [Phần kết luận](#conclusion)

## Lời nói đầu {#foreword}

Chuyển tiếp email là một công cụ mạnh mẽ có thể thay đổi cách bạn quản lý các thông tin liên lạc trực tuyến của mình. Cho dù bạn là chủ doanh nghiệp muốn tạo địa chỉ email chuyên nghiệp với tên miền tùy chỉnh của mình, một cá nhân quan tâm đến quyền riêng tư muốn bảo vệ email chính của mình hay một nhà phát triển cần quản lý email linh hoạt, thì việc hiểu về chuyển tiếp email là điều cần thiết trong bối cảnh kỹ thuật số ngày nay.

Tại Forward Email, chúng tôi đã xây dựng dịch vụ chuyển tiếp email an toàn, riêng tư và linh hoạt nhất thế giới. Trong hướng dẫn toàn diện này, chúng tôi sẽ giải thích cách thức hoạt động của dịch vụ chuyển tiếp email (cả về mặt kỹ thuật và thực tế), hướng dẫn bạn qua quy trình thiết lập đơn giản của chúng tôi và nêu bật lý do tại sao dịch vụ của chúng tôi nổi bật so với các đối thủ cạnh tranh.

## Chuyển tiếp email là gì {#what-is-email-forwarding}

Chuyển tiếp email là một quá trình tự động chuyển hướng email được gửi đến một địa chỉ email đến một địa chỉ đích khác. Ví dụ: khi ai đó gửi email đến <contact@yourdomain.com>, tin nhắn đó có thể được tự động chuyển tiếp đến Gmail cá nhân, Outlook hoặc bất kỳ tài khoản email nào khác của bạn.

Khả năng có vẻ đơn giản này mang lại những lợi ích to lớn:

* **Thương hiệu chuyên nghiệp**: Sử dụng địa chỉ email với tên miền tùy chỉnh của bạn (<you@yourdomain.com>) trong khi quản lý mọi thứ từ hộp thư đến cá nhân hiện tại của bạn
* **Bảo vệ quyền riêng tư**: Tạo địa chỉ dùng một lần hoặc địa chỉ dành riêng cho mục đích bảo vệ email chính của bạn
* **Quản lý đơn giản hóa**: Hợp nhất nhiều địa chỉ email thành một hộp thư đến duy nhất
* **Tính linh hoạt**: Tạo địa chỉ không giới hạn cho các mục đích khác nhau mà không cần quản lý nhiều tài khoản

## Cách thức hoạt động của Chuyển tiếp Email: Giải thích kỹ thuật {#how-email-forwarding-works-the-technical-explanation}

Đối với những ai quan tâm đến thông tin chi tiết về kỹ thuật, chúng ta hãy cùng khám phá những gì xảy ra ở hậu trường khi một email được chuyển tiếp.

### Quy trình chuyển tiếp email {#the-email-forwarding-process}

1. **Cấu hình DNS**: Quá trình bắt đầu với các bản ghi DNS của tên miền của bạn. Khi bạn thiết lập chuyển tiếp email, bạn cấu hình các bản ghi MX (Mail Exchange) để cho internet biết email cho tên miền của bạn sẽ được gửi đến đâu. Các bản ghi này trỏ đến máy chủ email của chúng tôi.

2. **Tiếp nhận email**: Khi ai đó gửi email đến địa chỉ tên miền tùy chỉnh của bạn (ví dụ: <you@yourdomain.com>), máy chủ email của họ sẽ tra cứu bản ghi MX của tên miền của bạn và chuyển thư đến máy chủ của chúng tôi.

3. **Xử lý và Xác thực**: Máy chủ của chúng tôi nhận email và thực hiện một số chức năng quan trọng:
* Xác minh tính xác thực của người gửi bằng các giao thức như SPF, DKIM và DMARC
* Quét nội dung độc hại
* Kiểm tra người nhận theo các quy tắc chuyển tiếp của bạn

4. **Sender Rewriting**: Đây là nơi phép thuật xảy ra. Chúng tôi triển khai Sender Rewriting Scheme (SRS) để sửa đổi đường dẫn trả về của email. Điều này rất quan trọng vì nhiều nhà cung cấp email từ chối các email được chuyển tiếp mà không triển khai SRS phù hợp, vì chúng có thể bị giả mạo.

5. **Chuyển tiếp**: Sau đó, email sẽ được gửi đến địa chỉ đích của bạn với nội dung gốc còn nguyên vẹn.

6. **Gửi**: Email đến hộp thư đến của bạn và hiển thị như thể nó được gửi đến địa chỉ chuyển tiếp của bạn, duy trì giao diện chuyên nghiệp của tên miền tùy chỉnh của bạn.

### Vai trò của SRS (Sơ đồ viết lại người gửi) {#the-role-of-srs-sender-rewriting-scheme}

SRS đáng được chú ý đặc biệt vì nó rất cần thiết cho việc chuyển tiếp email đáng tin cậy. Khi chuyển tiếp email, địa chỉ của người gửi cần được viết lại để đảm bảo email vượt qua kiểm tra SPF tại đích cuối cùng.

Nếu không có SRS, email được chuyển tiếp thường không vượt qua được xác minh SPF và bị đánh dấu là thư rác hoặc bị từ chối hoàn toàn. Việc triển khai SRS của chúng tôi đảm bảo email được chuyển tiếp của bạn được chuyển đi một cách đáng tin cậy trong khi vẫn duy trì thông tin người gửi ban đầu theo cách minh bạch đối với bạn.

## Cách thức hoạt động của Chuyển tiếp Email: Giải thích đơn giản {#how-email-forwarding-works-the-simple-explanation}

Nếu các chi tiết kỹ thuật có vẻ quá phức tạp, sau đây là cách đơn giản hơn để hiểu về chuyển tiếp email:

Hãy nghĩ về việc chuyển tiếp email giống như chuyển tiếp thư cho thư vật lý. Khi bạn chuyển đến nhà mới, bạn có thể yêu cầu dịch vụ bưu chính chuyển tiếp tất cả thư từ địa chỉ cũ của bạn đến địa chỉ mới. Chuyển tiếp email hoạt động tương tự, nhưng đối với tin nhắn kỹ thuật số.

Với Email chuyển tiếp:

1. Bạn cho chúng tôi biết địa chỉ email nào trên tên miền của bạn mà bạn muốn thiết lập (như <sales@yourdomain.com> hoặc <contact@yourdomain.com>)
2. Bạn cho chúng tôi biết nơi bạn muốn gửi những email đó (như tài khoản Gmail hoặc Outlook của bạn)
3. Chúng tôi xử lý tất cả các chi tiết kỹ thuật để đảm bảo email được gửi đến địa chỉ tùy chỉnh của bạn đến nơi an toàn trong hộp thư đến đã chỉ định của bạn

Thật đơn giản! Bạn có thể sử dụng địa chỉ email chuyên nghiệp mà không cần thay đổi quy trình email hiện tại của mình.

## Thiết lập Chuyển tiếp Email với Forward Email {#setting-up-email-forwarding-with-forward-email}

Một trong những lợi thế lớn nhất của Forward Email là cách thiết lập dễ dàng. Sau đây là hướng dẫn từng bước:

### 1. Đăng ký tài khoản {#1-sign-up-for-an-account}

Truy cập [forwardemail.net](https://forwardemail.net) và tạo một tài khoản miễn phí. Quá trình đăng ký của chúng tôi chỉ mất chưa đầy một phút.

### 2. Thêm tên miền của bạn {#2-add-your-domain}

Sau khi đăng nhập, hãy thêm tên miền bạn muốn sử dụng để chuyển tiếp email. Nếu bạn chưa sở hữu tên miền, trước tiên bạn cần mua một tên miền từ công ty đăng ký tên miền.

### 3. Cấu hình Bản ghi DNS {#3-configure-dns-records}

Chúng tôi sẽ cung cấp cho bạn các bản ghi DNS chính xác mà bạn cần thêm vào tên miền của mình. Thông thường, điều này bao gồm:

* Thêm bản ghi MX trỏ đến máy chủ email của chúng tôi
* Thêm bản ghi TXT để xác minh và bảo mật

Hầu hết các đơn vị đăng ký tên miền đều có giao diện đơn giản để thêm các bản ghi này. Chúng tôi cung cấp hướng dẫn chi tiết cho tất cả các đơn vị đăng ký tên miền lớn để quá trình này diễn ra suôn sẻ nhất có thể.

### 4. Tạo Chuyển tiếp Email {#4-create-email-forwards}

Sau khi bản ghi DNS của bạn được xác minh (thường chỉ mất vài phút), bạn có thể tạo email chuyển tiếp. Chỉ cần chỉ định:

* Địa chỉ email trên tên miền của bạn (ví dụ: <contact@yourdomain.com>)
* Địa chỉ đích mà bạn muốn gửi email (ví dụ: địa chỉ Gmail cá nhân của bạn)

### 5. Bắt đầu sử dụng địa chỉ email mới của bạn {#5-start-using-your-new-email-addresses}

Vậy là xong! Email được gửi đến địa chỉ miền tùy chỉnh của bạn giờ sẽ được chuyển tiếp đến đích bạn chỉ định. Bạn có thể tạo bao nhiêu địa chỉ chuyển tiếp tùy ý, bao gồm cả địa chỉ catch-all chuyển tiếp tất cả email được gửi đến bất kỳ địa chỉ nào trên miền của bạn.

## Các tính năng nâng cao của Chuyển tiếp Email {#advanced-features-of-forward-email}

Trong khi tính năng chuyển tiếp email cơ bản đã rất mạnh mẽ, Forward Email còn cung cấp một số tính năng nâng cao giúp chúng tôi trở nên khác biệt:

### Địa chỉ dùng một lần {#disposable-addresses}

Tạo địa chỉ email cụ thể hoặc ẩn danh chuyển tiếp đến tài khoản chính của bạn. Bạn có thể gán nhãn cho các địa chỉ này và bật hoặc tắt chúng bất kỳ lúc nào để giữ cho hộp thư đến của bạn được ngăn nắp. Địa chỉ email thực tế của bạn không bao giờ bị lộ.

### Nhiều người nhận và ký tự đại diện {#multiple-recipients-and-wildcards}

Chuyển tiếp một địa chỉ duy nhất đến nhiều người nhận, giúp dễ dàng chia sẻ thông tin với nhóm. Bạn cũng có thể sử dụng địa chỉ đại diện (chuyển tiếp catch-all) để nhận email được gửi đến bất kỳ địa chỉ nào trên tên miền của bạn.

### Tích hợp "Gửi thư dưới dạng" {#send-mail-as-integration}

Bạn sẽ không bao giờ phải rời khỏi hộp thư đến để gửi email từ tên miền tùy chỉnh của mình. Gửi và trả lời tin nhắn như thể chúng đến từ <you@yourdomain.com> trực tiếp từ tài khoản Gmail hoặc Outlook của bạn.

### Bảo mật chống lượng tử {#quantum-resistant-security}

Chúng tôi là dịch vụ email đầu tiên và duy nhất trên thế giới sử dụng mã hóa chống lượng tử, bảo vệ thông tin liên lạc của bạn ngay cả trước những mối đe dọa tiên tiến nhất trong tương lai.

### Hộp thư SQLite được mã hóa riêng lẻ {#individually-encrypted-sqlite-mailboxes}

Không giống như các nhà cung cấp khác lưu trữ tất cả email của người dùng trong cơ sở dữ liệu dùng chung, chúng tôi sử dụng hộp thư SQLite được mã hóa riêng để đảm bảo quyền riêng tư và bảo mật vô song.

## Tại sao nên chọn Forward Email thay vì đối thủ cạnh tranh {#why-choose-forward-email-over-competitors}

Thị trường chuyển tiếp email có nhiều đối thủ cạnh tranh, nhưng Forward Email nổi bật ở một số điểm quan trọng sau:

### 1. 100% Mã nguồn mở {#1-100-open-source}

Chúng tôi là dịch vụ chuyển tiếp email duy nhất hoàn toàn là mã nguồn mở, bao gồm cả mã nguồn phụ trợ của chúng tôi. Sự minh bạch này tạo dựng lòng tin và cho phép kiểm toán bảo mật độc lập. Các dịch vụ khác có thể tuyên bố là mã nguồn mở nhưng không phát hành mã nguồn phụ trợ của họ.

### 2. Tập trung vào quyền riêng tư {#2-privacy-focused}

Chúng tôi tạo ra dịch vụ này vì bạn có quyền riêng tư. Chúng tôi sử dụng mã hóa mạnh mẽ với TLS, không lưu trữ nhật ký SMTP (trừ lỗi và SMTP gửi đi) và không ghi email của bạn vào bộ nhớ đĩa.

### 3. Không phụ thuộc vào bên thứ ba {#3-no-third-party-reliance}

Không giống như các đối thủ cạnh tranh dựa vào Amazon SES hoặc các dịch vụ của bên thứ ba khác, chúng tôi duy trì toàn quyền kiểm soát cơ sở hạ tầng của mình, nâng cao cả độ tin cậy và quyền riêng tư.

### 4. Giá cả phải chăng {#4-cost-effective-pricing}

Mô hình định giá của chúng tôi cho phép bạn mở rộng quy mô một cách hiệu quả về mặt chi phí. Chúng tôi không tính phí cho mỗi người dùng và bạn có thể trả tiền khi sử dụng dung lượng lưu trữ. Với mức giá 3 đô la/tháng, chúng tôi cung cấp nhiều tính năng hơn với mức giá thấp hơn so với các đối thủ cạnh tranh như Gandi (3,99 đô la/tháng).

### 5. Tài nguyên không giới hạn {#5-unlimited-resources}

Chúng tôi không áp đặt giới hạn nhân tạo cho tên miền, bí danh hoặc địa chỉ email như nhiều đối thủ cạnh tranh khác vẫn làm.

### 6. Được các tổ chức lớn tin cậy {#6-trusted-by-major-organizations}

Dịch vụ của chúng tôi được hơn 500.000 tên miền sử dụng, bao gồm các tổ chức nổi tiếng như [Học viện Hải quân Hoa Kỳ](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [Quỹ Linux](/blog/docs/linux-foundation-email-enterprise-case-study), [Chuẩn/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales và nhiều tổ chức khác.

## Các trường hợp sử dụng phổ biến cho Chuyển tiếp Email {#common-use-cases-for-email-forwarding}

Chuyển tiếp email giải quyết được nhiều thách thức cho nhiều loại người dùng khác nhau:

### Dành cho doanh nghiệp {#for-businesses}

* Tạo địa chỉ email chuyên nghiệp cho các phòng ban khác nhau (sales@, support@, info@)
* Dễ dàng quản lý các liên lạc qua email của nhóm
* Duy trì tính nhất quán của thương hiệu trong mọi liên lạc
* Đơn giản hóa việc quản lý email trong quá trình thay đổi nhân sự

### Dành cho nhà phát triển {#for-developers}

* Thiết lập hệ thống thông báo tự động
* Tạo địa chỉ mục đích cụ thể cho các dự án khác nhau
* Tích hợp với webhooks để tự động hóa nâng cao
* Tận dụng API của chúng tôi để triển khai tùy chỉnh

### Dành cho những người coi trọng quyền riêng tư {#for-privacy-conscious-individuals}

* Tạo các địa chỉ email riêng cho các dịch vụ khác nhau để theo dõi những người chia sẻ thông tin của bạn
* Sử dụng địa chỉ dùng một lần cho các lần đăng ký một lần
* Duy trì quyền riêng tư bằng cách bảo vệ địa chỉ email chính của bạn
* Dễ dàng vô hiệu hóa các địa chỉ bắt đầu nhận thư rác

## Các phương pháp hay nhất để chuyển tiếp email {#best-practices-for-email-forwarding}

Để tận dụng tối đa tính năng chuyển tiếp email, hãy cân nhắc những biện pháp tốt nhất sau:

### 1. Sử dụng Địa chỉ Mô tả {#1-use-descriptive-addresses}

Tạo các địa chỉ email nêu rõ mục đích (ví dụ: <newsletter@yourdomain.com>, <shopping@yourdomain.com>) để giúp sắp xếp thư đến của bạn.

### 2. Triển khai xác thực phù hợp {#2-implement-proper-authentication}

Đảm bảo tên miền của bạn có các bản ghi SPF, DKIM và DMARC phù hợp để tối đa hóa khả năng phân phối. Forward Email giúp bạn thực hiện việc này dễ dàng với thiết lập có hướng dẫn của chúng tôi.

### 3. Thường xuyên xem lại các email chuyển tiếp của bạn {#3-regularly-review-your-forwards}

Kiểm tra email chuyển tiếp của bạn định kỳ để vô hiệu hóa những email không còn cần thiết hoặc đang nhận quá nhiều thư rác.

### 4. Thiết lập "Gửi thư dưới dạng" để trả lời liền mạch {#4-set-up-send-mail-as-for-seamless-replies}

Cấu hình ứng dụng email chính của bạn để gửi thư theo địa chỉ tên miền tùy chỉnh của bạn để có trải nghiệm nhất quán khi trả lời email được chuyển tiếp.

### 5. Sử dụng Địa chỉ Catch-All một cách Thận trọng {#5-use-catch-all-addresses-cautiously}

Mặc dù địa chỉ catch-all rất tiện lợi, nhưng chúng có khả năng nhận được nhiều thư rác hơn. Hãy cân nhắc tạo các chuyển tiếp cụ thể cho các thông tin liên lạc quan trọng.

## Kết luận {#conclusion}

Chuyển tiếp email là một công cụ mạnh mẽ mang lại sự chuyên nghiệp, riêng tư và đơn giản cho các giao tiếp email của bạn. Với Forward Email, bạn sẽ nhận được dịch vụ chuyển tiếp email an toàn, riêng tư và linh hoạt nhất hiện có.

Là nhà cung cấp mã nguồn mở 100% duy nhất có mã hóa chống lượng tử và tập trung vào quyền riêng tư, chúng tôi đã xây dựng một dịch vụ tôn trọng quyền của bạn đồng thời cung cấp chức năng đặc biệt.

Cho dù bạn đang muốn tạo địa chỉ email chuyên nghiệp cho doanh nghiệp của mình, bảo vệ quyền riêng tư bằng địa chỉ dùng một lần hay đơn giản hóa việc quản lý nhiều tài khoản email, Forward Email đều cung cấp giải pháp hoàn hảo.

Bạn đã sẵn sàng thay đổi trải nghiệm email của mình chưa? [Đăng ký miễn phí](https://forwardemail.net) ngay hôm nay và tham gia cùng hơn 500.000 tên miền đang được hưởng lợi từ dịch vụ của chúng tôi.

---

*Bài viết này được viết bởi đội ngũ Forward Email, những người sáng tạo ra dịch vụ chuyển tiếp email an toàn, riêng tư và linh hoạt nhất thế giới. Truy cập [forwardemail.net](https://forwardemail.net) để tìm hiểu thêm về dịch vụ của chúng tôi và bắt đầu chuyển tiếp email một cách tự tin.*