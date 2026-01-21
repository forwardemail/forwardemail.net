# Tại sao Email nguồn mở là tương lai: Ưu điểm của Email chuyển tiếp {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />

## Mục lục {#table-of-contents}

* [Lời nói đầu](#foreword)
* [Lợi thế của nguồn mở: Không chỉ là tiếp thị](#the-open-source-advantage-more-than-just-marketing)
  * [Nguồn mở thực sự có nghĩa là gì](#what-true-open-source-means)
  * [Vấn đề Backend: Hầu hết các dịch vụ email "nguồn mở" đều không đáp ứng được yêu cầu](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Chuyển tiếp Email: 100% Mã nguồn mở, Giao diện người dùng VÀ Giao diện người dùng](#forward-email-100-open-source-frontend-and-backend)
  * [Phương pháp kỹ thuật độc đáo của chúng tôi](#our-unique-technical-approach)
* [Tùy chọn tự lưu trữ: Tự do lựa chọn](#the-self-hosting-option-freedom-of-choice)
  * [Tại sao chúng tôi hỗ trợ tự lưu trữ](#why-we-support-self-hosting)
  * [Thực tế của việc tự lưu trữ email](#the-reality-of-self-hosting-email)
* [Tại sao dịch vụ trả phí của chúng tôi lại hợp lý (mặc dù chúng tôi là mã nguồn mở)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [So sánh chi phí](#cost-comparison)
  * [Sự kết hợp tốt nhất của cả hai thế giới](#the-best-of-both-worlds)
* [Sự lừa dối của nguồn đóng: Những điều Proton và Tutanota không nói với bạn](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Các tuyên bố nguồn mở của Proton Mail](#proton-mails-open-source-claims)
  * [Cách tiếp cận tương tự của Tutanota](#tutanotas-similar-approach)
  * [Cuộc tranh luận về Hướng dẫn Quyền riêng tư](#the-privacy-guides-debate)
* [Tương lai là nguồn mở](#the-future-is-open-source)
  * [Tại sao mã nguồn mở đang chiến thắng](#why-open-source-is-winning)
* [Chuyển sang chuyển tiếp email](#making-the-switch-to-forward-email)
* [Kết luận: Email nguồn mở cho tương lai riêng tư](#conclusion-open-source-email-for-a-private-future)

## Lời nói đầu {#foreword}

Trong thời đại mà mối lo ngại về quyền riêng tư kỹ thuật số đang ở mức cao nhất mọi thời đại, các dịch vụ email chúng ta lựa chọn lại càng quan trọng hơn bao giờ hết. Mặc dù nhiều nhà cung cấp tuyên bố ưu tiên quyền riêng tư của bạn, nhưng có một sự khác biệt cơ bản giữa những nhà cung cấp chỉ nói suông về quyền riêng tư và những nhà cung cấp thực sự hành động. Tại Forward Email, chúng tôi xây dựng dịch vụ của mình trên nền tảng minh bạch hoàn toàn thông qua phát triển mã nguồn mở—không chỉ trong các ứng dụng front-end mà còn trong toàn bộ cơ sở hạ tầng của chúng tôi.

Bài đăng trên blog này khám phá lý do tại sao các giải pháp email nguồn mở vượt trội hơn các giải pháp nguồn đóng, cách tiếp cận của chúng tôi khác với các đối thủ cạnh tranh như Proton Mail và Tutanota như thế nào và tại sao—mặc dù chúng tôi cam kết cung cấp các tùy chọn tự lưu trữ—dịch vụ trả phí của chúng tôi lại mang lại giá trị tốt nhất cho hầu hết người dùng.

## Lợi thế của mã nguồn mở: Không chỉ là tiếp thị {#the-open-source-advantage-more-than-just-marketing}

Thuật ngữ "nguồn mở" đã trở thành một thuật ngữ tiếp thị phổ biến trong những năm gần đây, với thị trường dịch vụ nguồn mở toàn cầu dự kiến sẽ tăng trưởng với tốc độ CAGR hơn 16% từ năm 2024 đến năm 2032. Nhưng nguồn mở thực sự có nghĩa là gì, và tại sao nó lại quan trọng đối với quyền riêng tư email của bạn?

### Nguồn mở thực sự có nghĩa là gì {#what-true-open-source-means}

Phần mềm nguồn mở cung cấp toàn bộ mã nguồn miễn phí cho bất kỳ ai có thể kiểm tra, chỉnh sửa và cải tiến. Tính minh bạch này tạo ra một môi trường nơi:

* Các lỗ hổng bảo mật có thể được xác định và khắc phục bởi cộng đồng nhà phát triển toàn cầu
* Các khiếu nại về quyền riêng tư có thể được xác minh thông qua quá trình đánh giá mã độc lập
* Người dùng không bị bó buộc trong các hệ sinh thái độc quyền
* Sự đổi mới diễn ra nhanh hơn thông qua cải tiến hợp tác

Khi nói đến email - xương sống của danh tính trực tuyến của bạn - tính minh bạch này không chỉ tốt mà còn cần thiết cho sự riêng tư và bảo mật thực sự.

### Vấn đề về Backend: Hầu hết các dịch vụ email "nguồn mở" đều gặp vấn đề ở đâu {#the-backend-problem-where-most-open-source-email-services-fall-short}

Đây mới là lúc mọi chuyện trở nên thú vị. Nhiều nhà cung cấp email "tập trung vào quyền riêng tư" phổ biến tự quảng cáo là mã nguồn mở, nhưng có một điểm khác biệt quan trọng mà họ hy vọng bạn sẽ không nhận ra: **họ chỉ mã nguồn mở phần frontend trong khi vẫn giữ phần backend đóng**.

Điều này có nghĩa là gì? Giao diện người dùng là những gì bạn nhìn thấy và tương tác—giao diện web hoặc ứng dụng di động. Phần nền tảng là nơi diễn ra quá trình xử lý email thực tế—nơi tin nhắn của bạn được lưu trữ, mã hóa và truyền đi. Khi nhà cung cấp giữ phần nền tảng của họ là mã nguồn đóng:

1. Bạn không thể xác minh cách thức email của mình thực sự được xử lý
2. Bạn không thể xác nhận liệu các tuyên bố về quyền riêng tư của họ có hợp lệ hay không
3. Bạn tin tưởng vào các tuyên bố tiếp thị hơn là mã có thể xác minh
4. Các lỗ hổng bảo mật có thể vẫn bị che giấu khỏi sự giám sát của công chúng

Như các cuộc thảo luận trên diễn đàn Hướng dẫn Quyền riêng tư đã nêu bật, cả Proton Mail và Tutanota đều tuyên bố là mã nguồn mở, nhưng hệ thống backend của họ vẫn đóng và độc quyền\[^2]. Điều này tạo ra một khoảng cách đáng kể về lòng tin—bạn bị yêu cầu tin vào những lời hứa về quyền riêng tư của họ mà không có khả năng xác minh chúng.

## Chuyển tiếp Email: 100% Mã nguồn mở, Giao diện người dùng VÀ Giao diện quản trị {#forward-email-100-open-source-frontend-and-backend}

Tại Forward Email, chúng tôi đã áp dụng một cách tiếp cận hoàn toàn khác. Toàn bộ cơ sở mã nguồn của chúng tôi—cả front-end và back-end—đều là mã nguồn mở và bất kỳ ai cũng có thể kiểm tra tại <https://github.com/forwardemail/forwardemail.net>.

Điều này có nghĩa là:

1. **Minh bạch hoàn toàn**: Mọi dòng mã xử lý email của bạn đều có thể được công khai để kiểm tra.
2. **Quyền riêng tư có thể xác minh**: Các tuyên bố về quyền riêng tư của chúng tôi không phải là lời quảng cáo—mà là những sự thật có thể xác minh mà bất kỳ ai cũng có thể xác nhận bằng cách kiểm tra mã của chúng tôi.
3. **Bảo mật do cộng đồng thúc đẩy**: Bảo mật của chúng tôi được tăng cường nhờ chuyên môn chung của cộng đồng nhà phát triển toàn cầu.
4. **Không có chức năng ẩn**: Những gì bạn thấy là những gì bạn nhận được—không có theo dõi ẩn, không có cửa hậu bí mật.

### Phương pháp kỹ thuật độc đáo của chúng tôi {#our-unique-technical-approach}

Cam kết của chúng tôi về quyền riêng tư không chỉ dừng lại ở việc sử dụng mã nguồn mở. Chúng tôi đã triển khai một số cải tiến kỹ thuật giúp chúng tôi trở nên khác biệt:

#### Hộp thư SQLite được mã hóa riêng lẻ {#individually-encrypted-sqlite-mailboxes}

Không giống như các nhà cung cấp dịch vụ email truyền thống sử dụng cơ sở dữ liệu quan hệ dùng chung (nơi một vi phạm duy nhất có thể làm lộ dữ liệu của tất cả người dùng), chúng tôi sử dụng các tệp SQLite được mã hóa riêng cho từng hộp thư. Điều này có nghĩa là:

* Mỗi hộp thư là một tệp được mã hóa riêng biệt
* Quyền truy cập vào dữ liệu của một người dùng không cấp quyền truy cập cho người khác
* Ngay cả nhân viên của chúng tôi cũng không thể truy cập dữ liệu của bạn—đó là một quyết định thiết kế cốt lõi

Như chúng tôi đã giải thích trong các cuộc thảo luận về Hướng dẫn về quyền riêng tư:

> "Các cơ sở dữ liệu quan hệ dùng chung (ví dụ: MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, v.v.) đều yêu cầu đăng nhập (với tên người dùng/mật khẩu) để thiết lập kết nối cơ sở dữ liệu. Điều này có nghĩa là bất kỳ ai có mật khẩu này đều có thể truy vấn cơ sở dữ liệu cho bất kỳ mục đích gì. Cho dù đó là một nhân viên gian lận hay một cuộc tấn công của người giúp việc độc ác. Điều này cũng có nghĩa là việc truy cập dữ liệu của một người dùng đồng nghĩa với việc bạn cũng có quyền truy cập dữ liệu của những người khác. Mặt khác, SQLite có thể được coi là một cơ sở dữ liệu dùng chung, nhưng cách chúng ta sử dụng nó (mỗi hộp thư = một tệp SQLite riêng lẻ) khiến nó trở nên bị cô lập."\[^3]

#### Mã hóa chống lượng tử {#quantum-resistant-encryption}

Trong khi các nhà cung cấp khác vẫn đang trong quá trình bắt kịp, chúng tôi đã triển khai các phương pháp mã hóa chống lượng tử để bảo vệ quyền riêng tư email của bạn khỏi các mối đe dọa mới nổi từ điện toán lượng tử.

#### Không có sự phụ thuộc của bên thứ ba {#no-third-party-dependencies}

Không giống như các đối thủ cạnh tranh phụ thuộc vào các dịch vụ như Amazon SES để gửi email, chúng tôi đã xây dựng toàn bộ cơ sở hạ tầng nội bộ. Điều này giúp loại bỏ nguy cơ rò rỉ quyền riêng tư thông qua các dịch vụ của bên thứ ba và cho phép chúng tôi kiểm soát hoàn toàn toàn bộ quy trình email.

## Tùy chọn tự lưu trữ: Tự do lựa chọn {#the-self-hosting-option-freedom-of-choice}

Một trong những khía cạnh mạnh mẽ nhất của phần mềm nguồn mở là sự tự do mà nó mang lại. Với Forward Email, bạn không bao giờ bị bó buộc—bạn có thể tự lưu trữ toàn bộ nền tảng của chúng tôi nếu muốn.

### Tại sao chúng tôi hỗ trợ tự lưu trữ {#why-we-support-self-hosting}

Chúng tôi tin tưởng vào việc trao cho người dùng quyền kiểm soát hoàn toàn dữ liệu của họ. Đó là lý do tại sao chúng tôi đã thiết lập toàn bộ nền tảng của mình có thể tự lưu trữ với tài liệu hướng dẫn thiết lập và tài liệu hướng dẫn toàn diện. Cách tiếp cận này:

* Cung cấp khả năng kiểm soát tối đa cho người dùng có chuyên môn kỹ thuật
* Loại bỏ mọi nhu cầu tin tưởng chúng tôi là nhà cung cấp dịch vụ
* Cho phép tùy chỉnh để đáp ứng các yêu cầu cụ thể
* Đảm bảo dịch vụ có thể tiếp tục ngay cả khi công ty chúng tôi không

### Thực tế của việc tự lưu trữ email {#the-reality-of-self-hosting-email}

Mặc dù tự lưu trữ là một lựa chọn hiệu quả, nhưng điều quan trọng là phải hiểu rõ chi phí thực tế liên quan:

#### Chi phí tài chính {#financial-costs}

* Chi phí VPS hoặc máy chủ: 5-50 đô la/tháng cho thiết lập cơ bản\[^4]
* Đăng ký và gia hạn tên miền: 10-20 đô la/năm
* Chứng chỉ SSL (mặc dù Let's Encrypt cung cấp tùy chọn miễn phí)
* Chi phí tiềm ẩn cho các dịch vụ giám sát và giải pháp sao lưu

#### Chi phí thời gian {#time-costs}

* Thiết lập ban đầu: Vài giờ đến vài ngày tùy thuộc vào chuyên môn kỹ thuật
* Bảo trì liên tục: 5-10 giờ/tháng để cập nhật, vá lỗi bảo mật và khắc phục sự cố\[^5]
* Đường cong học tập: Hiểu các giao thức email, các biện pháp bảo mật tốt nhất và quản trị máy chủ

#### Thách thức kỹ thuật {#technical-challenges}

* Sự cố về khả năng gửi email (thư bị đánh dấu là thư rác)
* Theo kịp các tiêu chuẩn bảo mật đang phát triển
* Đảm bảo tính khả dụng và độ tin cậy cao
* Quản lý bộ lọc thư rác hiệu quả

Như một người tự lưu trữ có kinh nghiệm đã nói: "Email là một dịch vụ hàng hóa... Lưu trữ email của tôi tại \[một nhà cung cấp] rẻ hơn là tốn tiền *và* thời gian tự lưu trữ nó."\[^6]

## Tại sao dịch vụ trả phí của chúng tôi lại hợp lý (mặc dù chúng tôi là mã nguồn mở) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Với những thách thức của việc tự lưu trữ, dịch vụ trả phí của chúng tôi cung cấp những điều tốt nhất của cả hai thế giới: tính minh bạch và bảo mật của mã nguồn mở với sự tiện lợi và độ tin cậy của dịch vụ được quản lý.

### So sánh chi phí {#cost-comparison}

Khi bạn tính đến cả chi phí về tài chính và thời gian, dịch vụ trả phí của chúng tôi mang lại giá trị đặc biệt:

* **Tổng chi phí tự lưu trữ**: $56-$252/tháng (bao gồm chi phí máy chủ và định giá thời gian)
* **Gói trả phí Chuyển tiếp Email**: $3-$9/tháng

Dịch vụ trả phí của chúng tôi cung cấp:

* Quản lý và bảo trì chuyên nghiệp
* Uy tín IP được khẳng định để nâng cao khả năng phân phối
* Cập nhật và giám sát bảo mật thường xuyên
* Hỗ trợ khi phát sinh sự cố
* Tất cả các lợi ích về quyền riêng tư của phương pháp mã nguồn mở của chúng tôi

### Sự kết hợp hoàn hảo {#the-best-of-both-worlds}

Khi chọn Chuyển tiếp Email, bạn sẽ nhận được:

1. **Quyền riêng tư có thể xác minh**: Cơ sở mã nguồn mở của chúng tôi cho phép bạn tin tưởng vào các tuyên bố về quyền riêng tư của chúng tôi.
2. **Quản lý chuyên nghiệp**: Không cần phải là chuyên gia về máy chủ email.
3. **Hiệu quả về chi phí**: Tổng chi phí thấp hơn so với tự lưu trữ.
4. **Tự do khỏi sự ràng buộc**: Tùy chọn tự lưu trữ luôn khả dụng.

## Sự lừa dối của nguồn đóng: Những điều Proton và Tutanota không nói với bạn {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Hãy cùng xem xét kỹ hơn cách tiếp cận của chúng tôi khác biệt như thế nào so với các nhà cung cấp email "tập trung vào quyền riêng tư" phổ biến.

### Các tuyên bố về mã nguồn mở của Proton Mail {#proton-mails-open-source-claims}

Proton Mail tự quảng cáo là mã nguồn mở, nhưng điều này chỉ áp dụng cho các ứng dụng front-end của họ. Phần back-end của họ - nơi email của bạn được xử lý và lưu trữ - vẫn là mã nguồn đóng\[^7]. Điều này có nghĩa là:

* Bạn không thể xác minh cách email của mình được xử lý
* Bạn phải tin vào các tuyên bố về quyền riêng tư của họ mà không cần xác minh
* Các lỗ hổng bảo mật trong phần phụ trợ của họ vẫn bị che giấu khỏi sự giám sát của công chúng
* Bạn bị khóa trong hệ sinh thái của họ mà không có tùy chọn tự lưu trữ

### Cách tiếp cận tương tự của Tutanota {#tutanotas-similar-approach}

Giống như Proton Mail, Tutanota chỉ mã nguồn mở cho giao diện người dùng trong khi vẫn giữ bản quyền cho phần phụ trợ\[^8]. Họ gặp phải những vấn đề về lòng tin tương tự:

* Không có cách nào để xác minh các tuyên bố về quyền riêng tư ở phía sau
* Tính minh bạch trong quá trình xử lý email thực tế còn hạn chế
* Các vấn đề bảo mật tiềm ẩn không được công khai
* Khóa chặt nhà cung cấp mà không có tùy chọn tự lưu trữ

### Cuộc tranh luận về Hướng dẫn Quyền riêng tư {#the-privacy-guides-debate}

Những hạn chế này đã được cộng đồng bảo mật nhận thấy. Trong các cuộc thảo luận về Hướng dẫn Bảo mật, chúng tôi đã nêu bật sự khác biệt quan trọng này:

> "Nó nói rằng cả Protonmail và Tuta đều là mã nguồn đóng. Bởi vì phần phụ trợ của chúng thực sự là mã nguồn đóng."\[^9]

Chúng tôi cũng tuyên bố:

> "Không có bất kỳ cuộc kiểm toán nào được chia sẻ công khai về cơ sở hạ tầng phụ trợ của bất kỳ nhà cung cấp dịch vụ email PG nào hiện được liệt kê cũng như không có đoạn mã nguồn mở nào được chia sẻ về cách họ xử lý email đến."\[^10]

Sự thiếu minh bạch này tạo ra một vấn đề cốt lõi về lòng tin. Nếu không có nền tảng mã nguồn mở, người dùng buộc phải chấp nhận các khiếu nại về quyền riêng tư dựa trên niềm tin thay vì xác minh.

## Tương lai là mã nguồn mở {#the-future-is-open-source}

Xu hướng hướng tới các giải pháp nguồn mở đang tăng tốc trong toàn ngành công nghiệp phần mềm. Theo nghiên cứu gần đây:

* Thị trường phần mềm nguồn mở đang tăng trưởng từ 41,83 tỷ đô la vào năm 2024 lên 48,92 tỷ đô la vào năm 2025\[^11]
* 80% công ty báo cáo việc sử dụng phần mềm nguồn mở đã tăng lên trong năm qua\[^12]
* Việc áp dụng phần mềm nguồn mở được dự đoán sẽ tiếp tục mở rộng nhanh chóng

Sự tăng trưởng này phản ánh sự thay đổi căn bản trong cách chúng ta nhìn nhận về bảo mật và quyền riêng tư phần mềm. Khi người dùng ngày càng ý thức hơn về quyền riêng tư, nhu cầu về quyền riêng tư có thể xác minh thông qua các giải pháp nguồn mở sẽ ngày càng tăng.

### Tại sao mã nguồn mở đang chiến thắng {#why-open-source-is-winning}

Những lợi thế của mã nguồn mở đang ngày càng trở nên rõ ràng hơn:

1. **Bảo mật thông qua minh bạch**: Mã nguồn mở có thể được hàng ngàn chuyên gia xem xét, không chỉ bởi một nhóm nội bộ.
2. **Đổi mới nhanh hơn**: Phát triển cộng tác thúc đẩy cải tiến.
3. **Tin cậy thông qua xác minh**: Các tuyên bố có thể được xác minh thay vì tin tưởng tuyệt đối.
4. **Tự do khỏi sự phụ thuộc vào nhà cung cấp**: Người dùng duy trì quyền kiểm soát dữ liệu và dịch vụ của mình.
5. **Hỗ trợ cộng đồng**: Một cộng đồng toàn cầu giúp xác định và khắc phục sự cố.

## Chuyển sang Chuyển tiếp Email {#making-the-switch-to-forward-email}

Việc chuyển sang Forward Email rất đơn giản, cho dù bạn sử dụng nhà cung cấp chính thống như Gmail hay dịch vụ chú trọng quyền riêng tư khác như Proton Mail hoặc Tutanota.

Dịch vụ của chúng tôi cung cấp:

* Không giới hạn tên miền và bí danh
* Hỗ trợ giao thức chuẩn (SMTP, IMAP, POP3) mà không cần cầu nối độc quyền
* Tích hợp liền mạch với các ứng dụng email hiện có
* Quy trình thiết lập đơn giản với tài liệu hướng dẫn đầy đủ
* Gói giá cả phải chăng chỉ từ 3 đô la/tháng

## Kết luận: Email nguồn mở cho tương lai riêng tư {#conclusion-open-source-email-for-a-private-future}

Trong một thế giới mà quyền riêng tư kỹ thuật số ngày càng bị đe dọa, tính minh bạch của các giải pháp nguồn mở mang lại một biện pháp bảo vệ quan trọng. Tại Forward Email, chúng tôi tự hào dẫn đầu với phương pháp tiếp cận hoàn toàn nguồn mở về quyền riêng tư email.

Không giống như các đối thủ cạnh tranh chỉ áp dụng mã nguồn mở một phần, chúng tôi đã công khai toàn bộ nền tảng của mình - cả giao diện người dùng lẫn nền tảng quản trị - để công chúng có thể giám sát. Cam kết minh bạch này, kết hợp với phương pháp kỹ thuật tiên tiến, mang lại mức độ bảo mật có thể xác minh mà các giải pháp thay thế mã nguồn đóng không thể sánh kịp.

Cho dù bạn chọn sử dụng dịch vụ được quản lý của chúng tôi hay tự lưu trữ nền tảng của chúng tôi, bạn đều được hưởng lợi từ tính bảo mật, quyền riêng tư và sự an tâm đến từ email nguồn mở thực sự.

Tương lai của email là mở, minh bạch và tập trung vào quyền riêng tư. Tương lai đó chính là Forward Email.

\[^1]: SNS Insider. "Thị trường dịch vụ nguồn mở được định giá 28,6 tỷ đô la Mỹ vào năm 2023 và sẽ đạt 114,8 tỷ đô la Mỹ vào năm 2032, với tốc độ tăng trưởng kép hàng năm (CAGR) là 16,70% vào năm 2032." [Báo cáo phân tích và quy mô thị trường dịch vụ nguồn mở năm 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Cộng đồng Hướng dẫn Quyền riêng tư. "Chuyển tiếp Email (nhà cung cấp email) - Đề xuất Phát triển Trang web/Công cụ." [Thảo luận về Hướng dẫn Quyền riêng tư](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Hướng dẫn về Quyền riêng tư Cộng đồng. "Chuyển tiếp Email (nhà cung cấp email) - Đề xuất Phát triển Trang web/Công cụ." [Thảo luận về Hướng dẫn Quyền riêng tư](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Thông thường, bạn có thể phải chi từ 5 đến 50 đô la mỗi tháng cho một máy chủ riêng ảo (VPS) cơ bản để chạy máy chủ email của mình." [10 Nền tảng Máy chủ Email Tự lưu trữ Tốt nhất để Sử dụng vào năm 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Diễn đàn Mail-in-a-Box. "Việc bảo trì mất khoảng 16 giờ trong khoảng thời gian đó..." [Máy chủ thư tự lưu trữ bị phản đối](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. "Tóm tắt: Vì mọi thứ đều tự lưu trữ, NÓ SẼ CẦN BẠN TỐN THỜI GIAN. Nếu bạn không có thời gian, tốt hơn hết là nên chọn dịch vụ lưu trữ..." [Tự lưu trữ máy chủ email? Tại sao có hoặc không? Giải pháp nào phổ biến?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Chuyển tiếp email. "Proton Mail tuyên bố là mã nguồn mở, nhưng phần mềm quản lý của họ thực chất là mã nguồn đóng." [So sánh Tutanota và Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Chuyển tiếp email. "Tutanota tuyên bố là mã nguồn mở, nhưng phần mềm quản lý của họ thực chất là mã nguồn đóng." [So sánh Proton Mail và Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Cộng đồng Hướng dẫn Quyền riêng tư. "Nó nói rằng cả Protonmail và Tuta đều là mã nguồn đóng. Bởi vì phần phụ trợ của họ thực sự là mã nguồn đóng." [Chuyển tiếp Email (nhà cung cấp email) - Phát triển trang web / Đề xuất công cụ](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Cộng đồng Hướng dẫn Quyền riêng tư. "Không có bất kỳ cuộc kiểm tra nào được chia sẻ công khai về cơ sở hạ tầng phụ trợ của bất kỳ nhà cung cấp dịch vụ email PG nào hiện đang được liệt kê, cũng như không có đoạn mã nguồn mở nào được chia sẻ về cách họ xử lý email đến." [Chuyển tiếp Email (nhà cung cấp email) - Phát triển trang web / Đề xuất công cụ](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "Thị trường phần mềm nguồn mở sẽ tăng trưởng từ 41,83 tỷ đô la Mỹ vào năm 2024 lên 48,92 tỷ đô la Mỹ vào năm 2025 với tốc độ gộp..." [Phần mềm nguồn mở là gì?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Với 80% công ty báo cáo việc sử dụng công nghệ nguồn mở đã tăng lên trong năm qua, thì..." [Xu hướng mới nổi trong cộng đồng nguồn mở năm 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)