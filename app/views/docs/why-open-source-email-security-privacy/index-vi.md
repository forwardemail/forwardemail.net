# Tại Sao Email Mã Nguồn Mở Là Tương Lai: Lợi Thế Của Forward Email {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Bảo mật và quyền riêng tư email mã nguồn mở" class="rounded-lg" />


## Mục Lục {#table-of-contents}

* [Lời Nói Đầu](#foreword)
* [Lợi Thế Mã Nguồn Mở: Không Chỉ Là Chiêu Thị Trường](#the-open-source-advantage-more-than-just-marketing)
  * [Mã Nguồn Mở Thực Sự Có Nghĩa Là Gì](#what-true-open-source-means)
  * [Vấn Đề Phía Backend: Nơi Hầu Hết Các Dịch Vụ Email "Mã Nguồn Mở" Thất Bại](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email: 100% Mã Nguồn Mở, Frontend VÀ Backend](#forward-email-100-open-source-frontend-and-backend)
  * [Cách Tiếp Cận Kỹ Thuật Độc Đáo Của Chúng Tôi](#our-unique-technical-approach)
* [Tùy Chọn Tự Lưu Trữ: Tự Do Lựa Chọn](#the-self-hosting-option-freedom-of-choice)
  * [Tại Sao Chúng Tôi Hỗ Trợ Tự Lưu Trữ](#why-we-support-self-hosting)
  * [Thực Tế Của Việc Tự Lưu Trữ Email](#the-reality-of-self-hosting-email)
* [Tại Sao Dịch Vụ Trả Phí Của Chúng Tôi Có Ý Nghĩa (Dù Chúng Tôi Là Mã Nguồn Mở)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [So Sánh Chi Phí](#cost-comparison)
  * [Tốt Nhất Của Cả Hai Thế Giới](#the-best-of-both-worlds)
* [Sự Lừa Dối Mã Nguồn Đóng: Những Gì Proton và Tutanota Không Nói Với Bạn](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Các Tuyên Bố Mã Nguồn Mở Của Proton Mail](#proton-mails-open-source-claims)
  * [Cách Tiếp Cận Tương Tự Của Tutanota](#tutanotas-similar-approach)
  * [Cuộc Tranh Luận Về Các Hướng Dẫn Quyền Riêng Tư](#the-privacy-guides-debate)
* [Tương Lai Là Mã Nguồn Mở](#the-future-is-open-source)
  * [Tại Sao Mã Nguồn Mở Đang Chiếm Ưu Thế](#why-open-source-is-winning)
* [Chuyển Sang Forward Email](#making-the-switch-to-forward-email)
* [Kết Luận: Email Mã Nguồn Mở Cho Một Tương Lai Riêng Tư](#conclusion-open-source-email-for-a-private-future)


## Lời Nói Đầu {#foreword}

Trong thời đại mà mối quan tâm về quyền riêng tư kỹ thuật số đang ở mức cao nhất từ trước đến nay, dịch vụ email mà chúng ta chọn càng trở nên quan trọng hơn bao giờ hết. Trong khi nhiều nhà cung cấp tuyên bố ưu tiên quyền riêng tư của bạn, có một sự khác biệt cơ bản giữa những người chỉ nói về quyền riêng tư và những người thực sự hành động. Tại Forward Email, chúng tôi xây dựng dịch vụ của mình trên nền tảng minh bạch hoàn toàn thông qua phát triển mã nguồn mở — không chỉ trong các ứng dụng frontend mà còn trong toàn bộ hạ tầng của chúng tôi.

Bài viết này khám phá lý do tại sao các giải pháp email mã nguồn mở vượt trội hơn các lựa chọn mã nguồn đóng, cách tiếp cận của chúng tôi khác biệt so với các đối thủ như Proton Mail và Tutanota, và tại sao — mặc dù cam kết hỗ trợ tùy chọn tự lưu trữ — dịch vụ trả phí của chúng tôi lại mang lại giá trị tốt nhất cho hầu hết người dùng.


## Lợi Thế Mã Nguồn Mở: Không Chỉ Là Chiêu Thị Trường {#the-open-source-advantage-more-than-just-marketing}

Thuật ngữ "mã nguồn mở" đã trở thành một từ khóa tiếp thị phổ biến trong những năm gần đây, với thị trường dịch vụ mã nguồn mở toàn cầu dự kiến tăng trưởng với tốc độ CAGR trên 16% từ 2024 đến 2032\[^1]. Nhưng thực sự thì mã nguồn mở có nghĩa là gì, và tại sao nó lại quan trọng đối với quyền riêng tư email của bạn?

### Mã Nguồn Mở Thực Sự Có Nghĩa Là Gì {#what-true-open-source-means}

Phần mềm mã nguồn mở cung cấp toàn bộ mã nguồn của nó miễn phí để bất kỳ ai cũng có thể kiểm tra, chỉnh sửa và cải tiến. Sự minh bạch này tạo ra một môi trường nơi:

* Các lỗ hổng bảo mật có thể được phát hiện và sửa chữa bởi cộng đồng nhà phát triển toàn cầu
* Các tuyên bố về quyền riêng tư có thể được xác minh thông qua việc xem xét mã độc lập
* Người dùng không bị khóa vào các hệ sinh thái độc quyền
* Đổi mới diễn ra nhanh hơn thông qua sự cải tiến hợp tác

Khi nói đến email — xương sống của danh tính trực tuyến của bạn — sự minh bạch này không chỉ là điều tốt đẹp để có; nó là điều thiết yếu cho quyền riêng tư và bảo mật thực sự.

### Vấn Đề Phía Backend: Nơi Hầu Hết Các Dịch Vụ Email "Mã Nguồn Mở" Thất Bại {#the-backend-problem-where-most-open-source-email-services-fall-short}

Đây là phần thú vị. Nhiều nhà cung cấp email "tập trung vào quyền riêng tư" phổ biến quảng cáo mình là mã nguồn mở, nhưng có một sự khác biệt quan trọng mà họ hy vọng bạn sẽ không nhận ra: **họ chỉ mở mã nguồn frontend trong khi giữ backend của họ đóng**.
Điều này có ý nghĩa gì? Frontend là những gì bạn nhìn thấy và tương tác—giao diện web hoặc ứng dụng di động. Backend là nơi xử lý email thực sự diễn ra—nơi các tin nhắn của bạn được lưu trữ, mã hóa và truyền tải. Khi một nhà cung cấp giữ backend của họ là mã nguồn đóng:

1. Bạn không thể xác minh cách email của bạn thực sự được xử lý
2. Bạn không thể xác nhận liệu các tuyên bố về quyền riêng tư của họ có hợp pháp hay không
3. Bạn đang tin tưởng vào các tuyên bố tiếp thị thay vì mã có thể kiểm chứng
4. Các lỗ hổng bảo mật có thể vẫn bị ẩn khỏi sự kiểm tra công khai

Như các cuộc thảo luận trên diễn đàn Privacy Guides đã nêu bật, cả Proton Mail và Tutanota đều tuyên bố là mã nguồn mở, nhưng backend của họ vẫn đóng và độc quyền\[^2]. Điều này tạo ra một khoảng cách tin tưởng đáng kể—bạn được yêu cầu tin vào các lời hứa về quyền riêng tư của họ mà không có khả năng xác minh chúng.


## Forward Email: 100% Mã Nguồn Mở, Frontend VÀ Backend {#forward-email-100-open-source-frontend-and-backend}

Tại Forward Email, chúng tôi đã áp dụng một cách tiếp cận hoàn toàn khác biệt. Toàn bộ mã nguồn của chúng tôi—cả frontend và backend—đều là mã nguồn mở và có sẵn cho bất kỳ ai kiểm tra tại <https://github.com/forwardemail/forwardemail.net>.

Điều này có nghĩa là:

1. **Minh bạch hoàn toàn**: Mỗi dòng mã xử lý email của bạn đều có thể được kiểm tra công khai.
2. **Quyền riêng tư có thể kiểm chứng**: Các tuyên bố về quyền riêng tư của chúng tôi không phải là lời quảng cáo—mà là sự thật có thể xác minh mà bất kỳ ai cũng có thể kiểm tra bằng cách xem mã nguồn của chúng tôi.
3. **Bảo mật dựa trên cộng đồng**: Bảo mật của chúng tôi được củng cố bởi chuyên môn tập thể của cộng đồng nhà phát triển toàn cầu.
4. **Không có chức năng ẩn**: Những gì bạn thấy là những gì bạn nhận được—không có theo dõi ẩn, không có cửa hậu bí mật.

### Cách Tiếp Cận Kỹ Thuật Độc Đáo Của Chúng Tôi {#our-unique-technical-approach}

Cam kết của chúng tôi với quyền riêng tư không chỉ dừng lại ở việc mã nguồn mở. Chúng tôi đã triển khai một số đổi mới kỹ thuật giúp chúng tôi khác biệt:

#### Hộp Thư SQLite Mã Hóa Riêng Biệt {#individually-encrypted-sqlite-mailboxes}

Không giống như các nhà cung cấp email truyền thống sử dụng cơ sở dữ liệu quan hệ chia sẻ (nơi một lần vi phạm có thể làm lộ dữ liệu của tất cả người dùng), chúng tôi sử dụng các tệp SQLite được mã hóa riêng biệt cho từng hộp thư. Điều này có nghĩa:

* Mỗi hộp thư là một tệp mã hóa riêng biệt
* Truy cập dữ liệu của một người dùng không đồng nghĩa với việc truy cập được dữ liệu của người khác
* Ngay cả nhân viên của chúng tôi cũng không thể truy cập dữ liệu của bạn—đây là một quyết định thiết kế cốt lõi

Như chúng tôi đã giải thích trong các cuộc thảo luận trên Privacy Guides:

> "Các cơ sở dữ liệu quan hệ chia sẻ (ví dụ: MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, v.v.) đều yêu cầu đăng nhập (với tên người dùng/mật khẩu) để thiết lập kết nối cơ sở dữ liệu. Điều này có nghĩa là bất kỳ ai có mật khẩu này đều có thể truy vấn cơ sở dữ liệu cho bất cứ thứ gì. Dù là nhân viên xấu hay tấn công kiểu 'người giúp việc độc ác'. Điều này cũng có nghĩa là việc có quyền truy cập dữ liệu của một người dùng đồng nghĩa với việc bạn cũng có quyền truy cập dữ liệu của tất cả người khác. Mặt khác, SQLite có thể được coi là cơ sở dữ liệu chia sẻ, nhưng cách chúng tôi sử dụng nó (mỗi hộp thư = một tệp SQLite riêng biệt) làm cho nó được cách ly."\[^3]

#### Mã Hóa Kháng Lượng Tử {#quantum-resistant-encryption}

Trong khi các nhà cung cấp khác vẫn đang theo kịp, chúng tôi đã triển khai các phương pháp mã hóa kháng lượng tử để bảo vệ quyền riêng tư email của bạn trước các mối đe dọa mới từ điện toán lượng tử.

#### Không Phụ Thuộc Bên Thứ Ba {#no-third-party-dependencies}

Không giống như các đối thủ dựa vào các dịch vụ như Amazon SES để gửi email, chúng tôi xây dựng toàn bộ hạ tầng của mình nội bộ. Điều này loại bỏ khả năng rò rỉ quyền riêng tư qua các dịch vụ bên thứ ba và cho phép chúng tôi kiểm soát hoàn toàn toàn bộ quy trình email.


## Tùy Chọn Tự Lưu Trữ: Tự Do Lựa Chọn {#the-self-hosting-option-freedom-of-choice}

Một trong những điểm mạnh nhất của phần mềm mã nguồn mở là sự tự do mà nó mang lại. Với Forward Email, bạn không bao giờ bị ràng buộc—bạn có thể tự lưu trữ toàn bộ nền tảng của chúng tôi nếu bạn muốn.

### Tại Sao Chúng Tôi Hỗ Trợ Tự Lưu Trữ {#why-we-support-self-hosting}

Chúng tôi tin tưởng vào việc trao quyền kiểm soát hoàn toàn dữ liệu cho người dùng. Đó là lý do tại sao chúng tôi đã làm cho toàn bộ nền tảng của mình có thể tự lưu trữ với tài liệu và hướng dẫn thiết lập đầy đủ. Cách tiếp cận này:

* Cung cấp quyền kiểm soát tối đa cho người dùng có kỹ thuật
* Loại bỏ mọi nhu cầu phải tin tưởng chúng tôi như một nhà cung cấp dịch vụ
* Cho phép tùy chỉnh để đáp ứng các yêu cầu cụ thể
* Đảm bảo dịch vụ có thể tiếp tục ngay cả khi công ty chúng tôi không còn hoạt động nữa
### Thực Tế Về Việc Tự Lưu Trữ Email {#the-reality-of-self-hosting-email}

Mặc dù tự lưu trữ là một lựa chọn mạnh mẽ, nhưng điều quan trọng là phải hiểu các chi phí thực sự liên quan:

#### Chi Phí Tài Chính {#financial-costs}

* Chi phí VPS hoặc máy chủ: $5-$50/tháng cho một thiết lập cơ bản\[^4]
* Đăng ký và gia hạn tên miền: $10-20/năm
* Chứng chỉ SSL (mặc dù Let's Encrypt cung cấp các tùy chọn miễn phí)
* Chi phí tiềm năng cho dịch vụ giám sát và giải pháp sao lưu

#### Chi Phí Thời Gian {#time-costs}

* Thiết lập ban đầu: Vài giờ đến vài ngày tùy thuộc vào trình độ kỹ thuật
* Bảo trì liên tục: 5-10 giờ/tháng cho cập nhật, vá lỗi bảo mật và xử lý sự cố\[^5]
* Đường cong học tập: Hiểu các giao thức email, các thực hành bảo mật tốt nhất và quản trị máy chủ

#### Thách Thức Kỹ Thuật {#technical-challenges}

* Vấn đề gửi email (tin nhắn bị đánh dấu là spam)
* Theo kịp các tiêu chuẩn bảo mật đang phát triển
* Đảm bảo tính sẵn sàng và độ tin cậy cao
* Quản lý lọc spam hiệu quả

Như một người tự lưu trữ có kinh nghiệm đã nói: "Email là một dịch vụ hàng hóa... Việc lưu trữ email của tôi tại \[một nhà cung cấp] rẻ hơn so với việc bỏ tiền *và* thời gian để tự lưu trữ nó."\[^6]


## Tại Sao Dịch Vụ Trả Phí Của Chúng Tôi Có Ý Nghĩa (Mặc Dù Chúng Tôi Mã Nguồn Mở) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Trước những thách thức của việc tự lưu trữ, dịch vụ trả phí của chúng tôi mang lại sự kết hợp tốt nhất: sự minh bạch và bảo mật của mã nguồn mở cùng với sự tiện lợi và độ tin cậy của dịch vụ được quản lý.

### So Sánh Chi Phí {#cost-comparison}

Khi bạn tính cả chi phí tài chính và thời gian, dịch vụ trả phí của chúng tôi mang lại giá trị vượt trội:

* **Tổng chi phí tự lưu trữ**: $56-$252/tháng (bao gồm chi phí máy chủ và định giá thời gian)
* **Các gói trả phí của Forward Email**: $3-$9/tháng

Dịch vụ trả phí của chúng tôi cung cấp:

* Quản lý và bảo trì chuyên nghiệp
* Danh tiếng IP đã được thiết lập để cải thiện khả năng gửi email
* Cập nhật bảo mật và giám sát thường xuyên
* Hỗ trợ khi có sự cố xảy ra
* Tất cả lợi ích về quyền riêng tư của phương pháp mã nguồn mở của chúng tôi

### Sự Kết Hợp Tốt Nhất {#the-best-of-both-worlds}

Khi chọn Forward Email, bạn nhận được:

1. **Quyền Riêng Tư Có Thể Xác Minh**: Mã nguồn mở của chúng tôi có nghĩa là bạn có thể tin tưởng vào các tuyên bố về quyền riêng tư
2. **Quản Lý Chuyên Nghiệp**: Không cần phải trở thành chuyên gia máy chủ email
3. **Hiệu Quả Về Chi Phí**: Tổng chi phí thấp hơn so với tự lưu trữ
4. **Tự Do Không Bị Ràng Buộc**: Luôn có tùy chọn tự lưu trữ


## Sự Lừa Dối Mã Nguồn Đóng: Những Gì Proton và Tutanota Không Nói Với Bạn {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Hãy xem xét kỹ hơn cách tiếp cận của chúng tôi khác với các nhà cung cấp email "tập trung vào quyền riêng tư" phổ biến.

### Các Tuyên Bố Mã Nguồn Mở Của Proton Mail {#proton-mails-open-source-claims}

Proton Mail quảng cáo mình là mã nguồn mở, nhưng điều này chỉ áp dụng cho các ứng dụng frontend của họ. Backend của họ — nơi email của bạn thực sự được xử lý và lưu trữ — vẫn là mã nguồn đóng\[^7]. Điều này có nghĩa:

* Bạn không thể xác minh cách email của bạn được xử lý
* Bạn phải tin tưởng các tuyên bố về quyền riêng tư của họ mà không có sự xác minh
* Các lỗ hổng bảo mật trong backend của họ vẫn bị ẩn khỏi sự kiểm tra công khai
* Bạn bị khóa trong hệ sinh thái của họ mà không có tùy chọn tự lưu trữ

### Cách Tiếp Cận Tương Tự Của Tutanota {#tutanotas-similar-approach}

Giống như Proton Mail, Tutanota chỉ mã nguồn mở frontend trong khi giữ backend là sở hữu riêng\[^8]. Họ gặp phải các vấn đề tin tưởng tương tự:

* Không có cách nào để xác minh các tuyên bố về quyền riêng tư của backend
* Minh bạch hạn chế về cách xử lý email thực tế
* Các vấn đề bảo mật tiềm ẩn bị ẩn khỏi tầm nhìn công chúng
* Bị khóa với nhà cung cấp mà không có tùy chọn tự lưu trữ

### Cuộc Tranh Luận Trên Privacy Guides {#the-privacy-guides-debate}

Những hạn chế này không bị cộng đồng quyền riêng tư bỏ qua. Trong các cuộc thảo luận trên Privacy Guides, chúng tôi đã nhấn mạnh sự khác biệt quan trọng này:

> "Nó cho biết cả Protonmail và Tuta đều là mã nguồn đóng. Bởi vì backend của họ thực sự là mã nguồn đóng."\[^9]

Chúng tôi cũng đã nói:

> "Chưa có cuộc kiểm toán công khai nào được chia sẻ về bất kỳ hạ tầng backend của nhà cung cấp dịch vụ email nào hiện được liệt kê trên PG cũng như không có đoạn mã nguồn mở nào được chia sẻ về cách họ xử lý email đến."\[^10]
Sự thiếu minh bạch này tạo ra một vấn đề cơ bản về niềm tin. Không có các backend mã nguồn mở, người dùng buộc phải tin tưởng vào các tuyên bố về quyền riêng tư thay vì kiểm chứng.

## Tương Lai Là Mã Nguồn Mở {#the-future-is-open-source}

Xu hướng hướng tới các giải pháp mã nguồn mở đang tăng tốc trên toàn ngành phần mềm. Theo nghiên cứu gần đây:

* Thị trường phần mềm mã nguồn mở đang tăng từ 41,83 tỷ USD năm 2024 lên 48,92 tỷ USD năm 2025\[^11]
* 80% các công ty báo cáo tăng sử dụng mã nguồn mở trong năm qua\[^12]
* Việc áp dụng mã nguồn mở dự kiến sẽ tiếp tục mở rộng nhanh chóng

Sự tăng trưởng này phản ánh một sự chuyển đổi cơ bản trong cách chúng ta nghĩ về bảo mật và quyền riêng tư phần mềm. Khi người dùng ngày càng quan tâm đến quyền riêng tư, nhu cầu về quyền riêng tư có thể kiểm chứng thông qua các giải pháp mã nguồn mở sẽ chỉ tăng lên.

### Tại Sao Mã Nguồn Mở Đang Chiếm Ưu Thế {#why-open-source-is-winning}

Những lợi thế của mã nguồn mở ngày càng rõ ràng:

1. **Bảo mật thông qua minh bạch**: Mã nguồn mở có thể được hàng ngàn chuyên gia xem xét, không chỉ một nhóm nội bộ
2. **Đổi mới nhanh hơn**: Phát triển hợp tác thúc đẩy cải tiến nhanh chóng
3. **Niềm tin thông qua kiểm chứng**: Các tuyên bố có thể được xác minh thay vì chỉ tin tưởng
4. **Tự do khỏi ràng buộc nhà cung cấp**: Người dùng duy trì quyền kiểm soát dữ liệu và dịch vụ của mình
5. **Hỗ trợ cộng đồng**: Một cộng đồng toàn cầu giúp phát hiện và sửa lỗi

## Chuyển Sang Forward Email {#making-the-switch-to-forward-email}

Việc chuyển sang Forward Email rất đơn giản, dù bạn đến từ nhà cung cấp phổ biến như Gmail hay dịch vụ tập trung vào quyền riêng tư như Proton Mail hoặc Tutanota.

Dịch vụ của chúng tôi cung cấp:

* Miền và bí danh không giới hạn
* Hỗ trợ giao thức tiêu chuẩn (SMTP, IMAP, POP3) mà không cần cầu nối độc quyền
* Tích hợp liền mạch với các ứng dụng email hiện có
* Quy trình thiết lập đơn giản với tài liệu đầy đủ
* Các gói giá cả phải chăng bắt đầu chỉ từ 3 USD/tháng

## Kết Luận: Email Mã Nguồn Mở Cho Tương Lai Riêng Tư {#conclusion-open-source-email-for-a-private-future}

Trong một thế giới mà quyền riêng tư kỹ thuật số ngày càng bị đe dọa, sự minh bạch của các giải pháp mã nguồn mở cung cấp một biện pháp bảo vệ quan trọng. Tại Forward Email, chúng tôi tự hào dẫn đầu với cách tiếp cận hoàn toàn mã nguồn mở về quyền riêng tư email.

Không giống như các đối thủ chỉ áp dụng mã nguồn mở một phần, chúng tôi đã công khai toàn bộ nền tảng—giao diện người dùng và backend—cho công chúng xem xét. Cam kết minh bạch này, kết hợp với phương pháp kỹ thuật sáng tạo của chúng tôi, mang lại mức độ quyền riêng tư có thể kiểm chứng mà các giải pháp đóng mã không thể sánh kịp.

Dù bạn chọn sử dụng dịch vụ quản lý của chúng tôi hay tự lưu trữ nền tảng, bạn sẽ được hưởng lợi từ bảo mật, quyền riêng tư và sự an tâm đến từ email thực sự mã nguồn mở.

Tương lai của email là mở, minh bạch và tập trung vào quyền riêng tư. Tương lai là Forward Email.

\[^1]: SNS Insider. "Thị trường Dịch vụ Mã Nguồn Mở được định giá 28,6 tỷ USD năm 2023 và sẽ đạt 114,8 tỷ USD vào năm 2032, tăng trưởng với tốc độ CAGR 16,70% đến năm 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (nhà cung cấp email) - Phát triển trang / Gợi ý công cụ." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (nhà cung cấp email) - Phát triển trang / Gợi ý công cụ." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Thông thường, bạn có thể phải chi từ 5 đến 50 USD mỗi tháng cho một máy chủ riêng ảo (VPS) cơ bản để chạy máy chủ email của mình." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Việc bảo trì mất khoảng 16 giờ trong khoảng thời gian đó..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)
\[^6]: Reddit r/selfhosted. "TL:DR: Như với mọi thứ tự lưu trữ, NÓ SẼ YÊU CẦU THỜI GIAN CỦA BẠN. Nếu bạn không có thời gian để dành cho nó, luôn tốt hơn khi sử dụng dịch vụ lưu trữ..." [Tự lưu trữ máy chủ email? Tại sao hoặc tại sao không? Cái gì phổ biến?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "Proton Mail tuyên bố là mã nguồn mở, nhưng phần backend của họ thực tế là mã nguồn đóng." [So sánh Tutanota và Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "Tutanota tuyên bố là mã nguồn mở, nhưng phần backend của họ thực tế là mã nguồn đóng." [So sánh Proton Mail và Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "Nó cho biết cả Protonmail và Tuta đều là mã nguồn đóng. Bởi vì backend của họ thực sự là mã nguồn đóng." [Forward Email (nhà cung cấp email) - Phát triển trang / Gợi ý công cụ](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "Chưa có bất kỳ cuộc kiểm toán công khai nào được chia sẻ về hạ tầng backend của bất kỳ nhà cung cấp dịch vụ email nào hiện được liệt kê trên PG cũng như không có đoạn mã nguồn mở nào được chia sẻ về cách họ xử lý email đến." [Forward Email (nhà cung cấp email) - Phát triển trang / Gợi ý công cụ](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "Thị trường phần mềm mã nguồn mở sẽ tăng từ 41,83 tỷ USD vào năm 2024 lên 48,92 tỷ USD vào năm 2025 với tốc độ tăng trưởng kép..." [Phần mềm mã nguồn mở là gì?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Với 80% công ty báo cáo tăng cường sử dụng các công nghệ mã nguồn mở trong năm qua, nó..." [Xu hướng mới nổi trong cộng đồng mã nguồn mở 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
