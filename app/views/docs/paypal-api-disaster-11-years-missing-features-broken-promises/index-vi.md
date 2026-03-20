# Thảm Họa API 11 Năm Của PayPal: Cách Chúng Tôi Xây Dựng Các Giải Pháp Thay Thế Trong Khi Họ Phớt Lờ Các Nhà Phát Triển {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Thành công! PayPal cuối cùng đã thêm endpoint `GET /v1/billing/subscriptions`.**
>
> Sau khi chúng tôi đăng bài viết này và gửi email cho ban lãnh đạo cấp cao của PayPal, các nhóm của họ đã triển khai endpoint rất cần thiết để liệt kê các đăng ký. Thay đổi này xuất hiện vào khoảng thời gian giữa [25 tháng 6, 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) và [9 tháng 7, 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Tuy nhiên, theo phong cách đặc trưng của PayPal, họ không bao giờ thông báo cho chúng tôi. Chúng tôi chỉ phát hiện cập nhật này một cách độc lập vào tháng 12 năm 2025, nhiều tháng sau khi tính năng được phát hành một cách lặng lẽ.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Tại Forward Email, chúng tôi đã phải đối mặt với các API hỏng hóc của PayPal hơn một thập kỷ. Những khó chịu nhỏ ban đầu đã biến thành một thảm họa hoàn toàn buộc chúng tôi phải xây dựng các giải pháp thay thế riêng, chặn các mẫu email lừa đảo của họ, và cuối cùng là ngừng tất cả các khoản thanh toán PayPal trong quá trình di chuyển tài khoản quan trọng.</p>
<p class="lead mt-3">Đây là câu chuyện về 11 năm PayPal phớt lờ những nhu cầu cơ bản của nhà phát triển trong khi chúng tôi cố gắng mọi cách để làm cho nền tảng của họ hoạt động.</p>


## Mục Lục {#table-of-contents}

* [Mảnh Ghép Thiếu: Không Có Cách Nào Để Liệt Kê Các Đăng Ký](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Vấn Đề Bắt Đầu Xuất Hiện](#2014-2017-the-problem-emerges)
* [2020: Chúng Tôi Gửi Phản Hồi Chi Tiết](#2020-we-give-them-extensive-feedback)
  * [Danh Sách Phản Hồi 27 Mục](#the-27-item-feedback-list)
  * [Các Nhóm Tham Gia, Những Lời Hứa Được Đưa Ra](#teams-got-involved-promises-were-made)
  * [Kết Quả? Không Có Gì.](#the-result-nothing)
* [Cuộc Ra Đi Của Ban Lãnh Đạo: Cách PayPal Mất Hết Ký Ức Tổ Chức](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Lãnh Đạo Mới, Vấn Đề Cũ](#2025-new-leadership-same-problems)
  * [CEO Mới Tham Gia](#the-new-ceo-gets-involved)
  * [Phản Hồi Của Michelle Gill](#michelle-gills-response)
  * [Phản Hồi Của Chúng Tôi: Không Họp Nữa](#our-response-no-more-meetings)
  * [Phản Ứng Quá Kỹ Thuật Của Marty Brodbeck](#marty-brodbecks-overengineering-response)
  * [Mâu Thuẫn "CRUD Đơn Giản"](#the-simple-crud-contradiction)
  * [Sự Mất Kết Nối Trở Nên Rõ Ràng](#the-disconnect-becomes-clear)
* [Nhiều Năm Báo Cáo Lỗi Bị Phớt Lờ](#years-of-bug-reports-they-ignored)
  * [2016: Phàn Nàn Sớm Về Giao Diện Người Dùng/Trải Nghiệm Người Dùng](#2016-early-uiux-complaints)
  * [2021: Báo Cáo Lỗi Email Doanh Nghiệp](#2021-business-email-bug-report)
  * [2021: Gợi Ý Cải Thiện Giao Diện Người Dùng](#2021-ui-improvement-suggestions)
  * [2021: Thất Bại Môi Trường Sandbox](#2021-sandbox-environment-failures)
  * [2021: Hệ Thống Báo Cáo Hoàn Toàn Hỏng](#2021-reports-system-completely-broken)
  * [2022: Tính Năng API Cốt Lõi Bị Thiếu (Lại)](#2022-core-api-feature-missing-again)
* [Cơn Ác Mộng Trải Nghiệm Nhà Phát Triển](#the-developer-experience-nightmare)
  * [Giao Diện Người Dùng Hỏng](#broken-user-interface)
  * [Vấn Đề SDK](#sdk-problems)
  * [Vi Phạm Chính Sách Bảo Mật Nội Dung](#content-security-policy-violations)
  * [Sự Hỗn Loạn Trong Tài Liệu](#documentation-chaos)
  * [Lỗ Hổng Bảo Mật](#security-vulnerabilities)
  * [Thảm Họa Quản Lý Phiên](#session-management-disaster)
* [Tháng 7 Năm 2025: Giọt Nước Tràn Ly](#july-2025-the-final-straw)
* [Tại Sao Chúng Tôi Không Thể Bỏ PayPal](#why-we-cant-just-drop-paypal)
* [Giải Pháp Thay Thế Cộng Đồng](#the-community-workaround)
* [Chặn Mẫu PayPal Do Lừa Đảo](#blocking-paypal-templates-due-to-phishing)
  * [Vấn Đề Thực Sự: Mẫu PayPal Trông Giống Lừa Đảo](#the-real-problem-paypals-templates-look-like-scams)
  * [Việc Triển Khai Của Chúng Tôi](#our-implementation)
  * [Tại Sao Chúng Tôi Phải Chặn PayPal](#why-we-had-to-block-paypal)
  * [Quy Mô Vấn Đề](#the-scale-of-the-problem)
  * [Sự Mỉa Mai](#the-irony)
  * [Tác Động Thực Tế: Các Chiêu Lừa Đảo PayPal Mới](#real-world-impact-novel-paypal-scams)
* [Quy Trình KYC Ngược Của PayPal](#paypals-backwards-kyc-process)
  * [Cách Nó Nên Hoạt Động](#how-it-should-work)
  * [Cách PayPal Thực Sự Hoạt Động](#how-paypal-actually-works)
  * [Tác Động Thực Tế](#the-real-world-impact)
  * [Thảm Họa Di Chuyển Tài Khoản Tháng 7 Năm 2025](#the-july-2025-account-migration-disaster)
  * [Tại Sao Điều Này Quan Trọng](#why-this-matters)
* [Cách Các Bộ Xử Lý Thanh Toán Khác Làm Đúng](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Tiêu Chuẩn Ngành](#the-industry-standard)
  * [Những Gì Các Bộ Xử Lý Khác Cung Cấp So Với PayPal](#what-other-processors-provide-vs-paypal)
* [Chiêu Trò Che Đậy Có Hệ Thống Của PayPal: Im Lặng 6 Triệu Tiếng Nói](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Sự Xóa Bỏ Lớn](#the-great-erasure)
  * [Sự Cứu Trợ Bên Thứ Ba](#the-third-party-rescue)
* [Thảm Họa Lỗi Capture 11 Năm: $1,899 Và Còn Tăng](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Mất Mát $1,899 Của Forward Email](#forward-emails-1899-loss)
  * [Báo Cáo Gốc Năm 2013: Hơn 11 Năm Bỏ Qua](#the-2013-original-report-11-years-of-negligence)
  * [Thừa Nhận Năm 2016: PayPal Phá Vỡ SDK Của Chính Họ](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Tăng Cấp Năm 2024: Vẫn Hỏng](#the-2024-escalation-still-broken)
  * [Thảm Họa Độ Tin Cậy Webhook](#the-webhook-reliability-disaster)
  * [Mô Hình Bỏ Qua Có Hệ Thống](#the-pattern-of-systematic-negligence)
  * [Yêu Cầu Không Được Tài Liệu Hóa](#the-undocumented-requirement)
* [Mô Hình Lừa Dối Rộng Lớn Hơn Của PayPal](#paypals-broader-pattern-of-deception)
  * [Hành Động Của Sở Dịch Vụ Tài Chính New York](#the-new-york-department-of-financial-services-action)
  * [Vụ Kiện Honey: Viết Lại Liên Kết Affiliate](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Chi Phí Của Sự Bỏ Qua Của PayPal](#the-cost-of-paypals-negligence)
  * [Lời Nói Dối Trong Tài Liệu](#the-documentation-lie)
* [Điều Này Có Ý Nghĩa Gì Với Các Nhà Phát Triển](#what-this-means-for-developers)
## Mảnh Ghép Thiếu: Không Có Cách Nào Để Liệt Kê Các Đăng Ký {#the-missing-piece-no-way-to-list-subscriptions}

Đây là điều khiến chúng tôi kinh ngạc: PayPal đã có tính năng thanh toán đăng ký từ năm 2014, nhưng họ chưa bao giờ cung cấp cách để các thương nhân liệt kê các đăng ký của chính họ.

Hãy nghĩ về điều đó một chút. Bạn có thể tạo đăng ký, bạn có thể hủy chúng nếu bạn có ID, nhưng bạn không thể lấy danh sách tất cả các đăng ký đang hoạt động cho tài khoản của mình. Nó giống như có một cơ sở dữ liệu mà không có câu lệnh SELECT.

Chúng tôi cần điều này cho các hoạt động kinh doanh cơ bản:

* Hỗ trợ khách hàng (khi ai đó gửi email hỏi về đăng ký của họ)
* Báo cáo tài chính và đối chiếu
* Quản lý thanh toán tự động
* Tuân thủ và kiểm toán

Nhưng PayPal? Họ chỉ... chưa bao giờ xây dựng nó.


## 2014-2017: Vấn Đề Xuất Hiện {#2014-2017-the-problem-emerges}

Vấn đề liệt kê đăng ký lần đầu tiên xuất hiện trên các diễn đàn cộng đồng của PayPal vào năm 2017. Các nhà phát triển đã đặt câu hỏi rõ ràng: "Làm thế nào để tôi lấy danh sách tất cả các đăng ký của mình?"

Phản hồi của PayPal? Im lặng.

Các thành viên cộng đồng bắt đầu cảm thấy thất vọng:

> "Thiếu sót rất kỳ lạ nếu một thương nhân không thể liệt kê tất cả các Thỏa thuận đang hoạt động. Nếu mất ID Thỏa thuận, điều này có nghĩa chỉ người dùng mới có thể hủy hoặc tạm ngưng thỏa thuận." - leafspider

> "+1. Đã gần 3 năm rồi." - laudukang (ý nói vấn đề đã tồn tại từ khoảng \~2014)

[Bài đăng cộng đồng gốc](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) từ năm 2017 cho thấy các nhà phát triển đang cầu xin tính năng cơ bản này. Phản hồi của PayPal là lưu trữ kho lưu trữ nơi mọi người báo cáo vấn đề.


## 2020: Chúng Tôi Đưa Ra Phản Hồi Chi Tiết {#2020-we-give-them-extensive-feedback}

Vào tháng 10 năm 2020, PayPal đã liên hệ với chúng tôi để tổ chức một buổi phản hồi chính thức. Đây không phải là một cuộc trò chuyện bình thường - họ đã tổ chức một cuộc gọi Microsoft Teams kéo dài 45 phút với 8 giám đốc điều hành PayPal bao gồm Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze, và những người khác.

### Danh Sách 27 Vấn Đề Phản Hồi {#the-27-item-feedback-list}

Chúng tôi đã chuẩn bị kỹ lưỡng. Sau 6 giờ cố gắng tích hợp với API của họ, chúng tôi đã tổng hợp được 27 vấn đề cụ thể. Mark Stuart từ nhóm PayPal Checkout nói:

> Chào Nick, cảm ơn bạn đã chia sẻ với mọi người hôm nay! Tôi nghĩ đây sẽ là chất xúc tác để nhận được nhiều hỗ trợ và đầu tư hơn cho nhóm của chúng tôi để đi và sửa những thứ này. Thật khó để có được phản hồi sâu sắc như những gì bạn đã để lại cho chúng tôi cho đến nay.

Phản hồi không phải là lý thuyết - nó đến từ các nỗ lực tích hợp thực tế:

1. **Việc tạo access token không hoạt động**:

> Việc tạo access token không hoạt động. Ngoài ra, nên có nhiều ví dụ hơn chỉ là cURL.

2. **Không có giao diện web để tạo đăng ký**:

> Làm sao có thể tạo đăng ký mà không phải dùng cURL? Dường như không có giao diện web để làm điều này (như Stripe có)

Mark Stuart thấy vấn đề tạo access token đặc biệt đáng lo ngại:

> Chúng tôi thường không nghe về các vấn đề liên quan đến việc tạo access token.

### Các Nhóm Tham Gia, Lời Hứa Được Đưa Ra {#teams-got-involved-promises-were-made}

Khi chúng tôi phát hiện thêm nhiều vấn đề, PayPal tiếp tục thêm nhiều nhóm vào cuộc thảo luận. Darshan Raju từ nhóm giao diện quản lý Đăng ký đã tham gia và nói:

> Thừa nhận khoảng trống. Chúng tôi sẽ theo dõi và giải quyết điều này. Cảm ơn bạn một lần nữa vì phản hồi!

Buổi họp được mô tả là nhằm:

> đi qua một cách thẳng thắn trải nghiệm của bạn

để:

> làm cho PayPal trở thành những gì nó nên có đối với các nhà phát triển.

### Kết Quả? Không Có Gì. {#the-result-nothing}

Mặc dù có buổi phản hồi chính thức, danh sách 27 vấn đề chi tiết, sự tham gia của nhiều nhóm, và lời hứa sẽ:

> theo dõi và giải quyết

vấn đề, tuyệt đối không có gì được sửa chữa.


## Cuộc Ra Đi Của Ban Lãnh Đạo: PayPal Đã Mất Toàn Bộ Bộ Nhớ Tổ Chức Như Thế Nào {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Đây là phần trở nên thực sự thú vị. Mọi người từng nhận phản hồi của chúng tôi năm 2020 đều đã rời PayPal:

**Thay Đổi Lãnh Đạo:**

* [Dan Schulman (CEO trong 9 năm) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (tháng 9 năm 2023)
* [Sri Shivananda (CTO người tổ chức phản hồi) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (tháng 1 năm 2024)
**Các Nhà Lãnh Đạo Kỹ Thuật Đã Đưa Ra Lời Hứa, Rồi Rời Đi:**

* **Mark Stuart** (đã hứa phản hồi sẽ là "chất xúc tác") → [Hiện tại tại Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (cựu nhân viên PayPal 18 năm) → [CEO của MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (Phó Chủ tịch Sản phẩm Tiêu dùng Toàn cầu) → [Đã nghỉ hưu](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (một trong những người còn lại cuối cùng) → [Vừa rời đi sang Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (Tháng 1 năm 2025)

PayPal đã trở thành một cánh cửa quay nơi các giám đốc thu thập phản hồi từ nhà phát triển, đưa ra lời hứa, rồi rời đi đến các công ty tốt hơn như JPMorgan, Ripple và các công ty fintech khác.

Điều này giải thích tại sao phản hồi về vấn đề GitHub năm 2025 dường như hoàn toàn không liên quan đến phản hồi của chúng tôi từ năm 2020 - thực sự mọi người nhận được phản hồi đó đều đã rời PayPal.


## 2025: Lãnh Đạo Mới, Vấn Đề Cũ {#2025-new-leadership-same-problems}

Tiến đến năm 2025, và mô hình tương tự lại xuất hiện. Sau nhiều năm không tiến triển, lãnh đạo mới của PayPal lại tiếp cận lần nữa.

### CEO Mới Tham Gia {#the-new-ceo-gets-involved}

Vào ngày 30 tháng 6 năm 2025, chúng tôi đã trực tiếp gửi lên CEO mới của PayPal, Alex Chriss. Phản hồi của ông ngắn gọn:

> Hi Nick – Cảm ơn bạn đã liên hệ và phản hồi. Michelle (được cc) đang phối hợp với đội của cô ấy để làm việc cùng bạn. Cảm ơn -A

### Phản Hồi Của Michelle Gill {#michelle-gills-response}

Michelle Gill, Phó Chủ tịch Điều hành và Giám đốc Điều hành Kinh doanh Nhỏ và Dịch vụ Tài chính, đã trả lời:

> Cảm ơn rất nhiều Nick, chuyển Alex vào bcc. Chúng tôi đã xem xét vấn đề này từ bài đăng trước của bạn. Chúng tôi sẽ gọi cho bạn trước khi tuần kết thúc. Bạn vui lòng gửi thông tin liên hệ để một trong các đồng nghiệp của tôi có thể liên lạc. Michelle

### Phản Hồi Của Chúng Tôi: Không Họp Nữa {#our-response-no-more-meetings}

Chúng tôi từ chối một cuộc họp nữa, giải thích sự thất vọng của mình:

> Cảm ơn bạn. Tuy nhiên tôi không nghĩ việc gọi điện sẽ giúp được gì. Lý do là... Tôi đã từng gọi điện trước đây và nó hoàn toàn không đi đến đâu. Tôi đã lãng phí hơn 2 giờ nói chuyện với toàn bộ đội và lãnh đạo mà không có kết quả gì... Rất nhiều email qua lại. Hoàn toàn không có gì được thực hiện. Phản hồi không đi đến đâu. Tôi đã cố gắng nhiều năm, được lắng nghe, rồi cũng không đi đến đâu.

### Phản Hồi Quá Kỹ Thuật Của Marty Brodbeck {#marty-brodbecks-overengineering-response}

Sau đó Marty Brodbeck, người đứng đầu kỹ thuật tiêu dùng tại PayPal, đã liên hệ:

> Hi Nick, tôi là Marty Brodbeck. Tôi đứng đầu toàn bộ kỹ thuật tiêu dùng tại PayPal và đã dẫn dắt phát triển API cho công ty. Bạn và tôi có thể kết nối về vấn đề bạn đang gặp phải và cách chúng tôi có thể giúp đỡ.

Khi chúng tôi giải thích nhu cầu đơn giản về một endpoint liệt kê đăng ký, phản hồi của ông cho thấy chính xác vấn đề:

> Cảm ơn Nick, chúng tôi đang trong quá trình tạo một API đăng ký duy nhất với SDK đầy đủ (hỗ trợ xử lý lỗi toàn diện, theo dõi đăng ký dựa trên sự kiện, độ ổn định cao) trong đó thanh toán cũng được tách ra thành một API riêng để các thương nhân truy cập thay vì phải phối hợp qua nhiều endpoint để có một phản hồi duy nhất.

Đây chính xác là cách tiếp cận sai lầm. Chúng tôi không cần kiến trúc phức tạp kéo dài nhiều tháng. Chúng tôi cần một endpoint REST đơn giản liệt kê các đăng ký - điều lẽ ra phải có từ năm 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Mâu Thuẫn "CRUD Đơn Giản" {#the-simple-crud-contradiction}

Khi chúng tôi chỉ ra đây là chức năng CRUD cơ bản lẽ ra phải có từ năm 2014, phản hồi của Marty rất đáng chú ý:

> Các thao tác CRUD đơn giản là một phần của API cốt lõi bạn tôi ạ, nên sẽ không mất nhiều tháng phát triển

SDK TypeScript của PayPal, hiện chỉ hỗ trợ ba endpoint sau nhiều tháng phát triển, cùng với dòng thời gian lịch sử của nó, rõ ràng cho thấy các dự án như vậy cần nhiều hơn vài tháng để hoàn thành.
Phản hồi này cho thấy anh ta không hiểu API của chính mình. Nếu "các thao tác CRUD đơn giản là một phần của API cốt lõi," thì điểm cuối danh sách đăng ký ở đâu? Chúng tôi đã trả lời:

> Nếu 'các thao tác CRUD đơn giản là một phần của API cốt lõi' thì điểm cuối danh sách đăng ký ở đâu? Các nhà phát triển đã yêu cầu 'thao tác CRUD đơn giản' này từ năm 2014. Đã 11 năm rồi. Mọi bộ xử lý thanh toán khác đều có chức năng cơ bản này từ ngày đầu tiên.

### Sự Mất Kết Nối Trở Nên Rõ Ràng {#the-disconnect-becomes-clear}

Các trao đổi năm 2025 với Alex Chriss, Michelle Gill và Marty Brodbeck cho thấy cùng một sự rối loạn tổ chức:

1. **Lãnh đạo mới không biết về các phiên phản hồi trước đó**
2. **Họ đề xuất các giải pháp quá phức tạp giống nhau**
3. **Họ không hiểu các giới hạn của chính API của họ**
4. **Họ muốn nhiều cuộc họp hơn thay vì chỉ sửa vấn đề**

Mô hình này giải thích tại sao các nhóm PayPal năm 2025 dường như hoàn toàn mất kết nối với các phản hồi rộng rãi được cung cấp vào năm 2020 - những người nhận phản hồi đó đã rời đi, và lãnh đạo mới đang lặp lại những sai lầm tương tự.


## Nhiều Năm Báo Cáo Lỗi Họ Phớt Lờ {#years-of-bug-reports-they-ignored}

Chúng tôi không chỉ phàn nàn về các tính năng thiếu sót. Chúng tôi đã chủ động báo cáo lỗi và cố gắng giúp họ cải thiện. Dưới đây là dòng thời gian toàn diện các vấn đề chúng tôi đã ghi nhận:

### 2016: Phàn Nàn Sớm Về UI/UX {#2016-early-uiux-complaints}

Ngay từ năm 2016, chúng tôi đã công khai liên hệ với lãnh đạo PayPal bao gồm Dan Schulman về các vấn đề giao diện và trải nghiệm người dùng. Đó là 9 năm trước, và các vấn đề UI/UX tương tự vẫn tồn tại đến ngày nay.

### 2021: Báo Cáo Lỗi Email Doanh Nghiệp {#2021-business-email-bug-report}

Vào tháng 3 năm 2021, chúng tôi báo cáo rằng hệ thống email doanh nghiệp của PayPal gửi thông báo hủy không chính xác. Mẫu email có các biến được hiển thị sai, gây ra các thông điệp gây nhầm lẫn cho khách hàng.

Mark Stuart đã thừa nhận vấn đề:

> Cảm ơn Nick! Đang chuyển sang BCC. @Prasy, đội của bạn có chịu trách nhiệm email này không hoặc biết ai chịu trách nhiệm? "Niftylettuce, LLC, chúng tôi sẽ không còn tính phí bạn nữa" khiến tôi nghĩ có sự nhầm lẫn về người nhận và nội dung email.

**Kết quả**: Họ thực sự đã sửa lỗi này! Mark Stuart xác nhận:

> Vừa nhận được thông tin từ đội thông báo rằng mẫu email đã được sửa và triển khai. Cảm ơn bạn đã liên hệ báo cáo. Xin cảm ơn!

Điều này cho thấy họ CÓ THỂ sửa lỗi khi họ muốn - họ chỉ chọn không làm vậy với hầu hết các vấn đề khác.

### 2021: Gợi Ý Cải Thiện Giao Diện {#2021-ui-improvement-suggestions}

Vào tháng 2 năm 2021, chúng tôi đã cung cấp phản hồi chi tiết về giao diện bảng điều khiển của họ, cụ thể là phần "Hoạt động Gần đây của PayPal":

> Tôi nghĩ bảng điều khiển tại paypal.com, cụ thể là "Hoạt động Gần đây của PayPal" cần được cải thiện. Tôi không nghĩ bạn nên hiển thị các dòng trạng thái "Tạo" thanh toán định kỳ $0 - nó chỉ thêm rất nhiều dòng thừa và bạn không thể dễ dàng nhìn thấy ngay thu nhập tạo ra trong ngày/các ngày trước đó.

Mark Stuart đã chuyển tiếp cho đội sản phẩm tiêu dùng:

> Cảm ơn! Tôi không chắc đội nào chịu trách nhiệm về Hoạt động, nhưng tôi đã chuyển cho trưởng bộ phận sản phẩm tiêu dùng để tìm đội phù hợp. Thanh toán định kỳ $0.00 có vẻ như là lỗi. Có lẽ nên lọc ra.

**Kết quả**: Chưa bao giờ được sửa. Giao diện vẫn hiển thị các mục $0 vô dụng này.

### 2021: Sự Cố Môi Trường Sandbox {#2021-sandbox-environment-failures}

Vào tháng 11 năm 2021, chúng tôi báo cáo các vấn đề nghiêm trọng với môi trường sandbox của PayPal:

* Khóa API bí mật sandbox bị thay đổi và vô hiệu hóa ngẫu nhiên
* Tất cả tài khoản thử nghiệm sandbox bị xóa mà không thông báo
* Thông báo lỗi khi cố xem chi tiết tài khoản sandbox
* Lỗi tải không ổn định

> Vì lý do nào đó khóa API bí mật sandbox của tôi bị thay đổi và bị Vô hiệu hóa. Cũng như tất cả tài khoản thử nghiệm Sandbox cũ của tôi bị xóa.

> Đôi khi chúng tải được, đôi khi không. Điều này thật sự rất khó chịu.

**Kết quả**: Không phản hồi, không sửa lỗi. Các nhà phát triển vẫn gặp vấn đề về độ tin cậy sandbox.

### 2021: Hệ Thống Báo Cáo Hoàn Toàn Hỏng {#2021-reports-system-completely-broken}
Vào tháng 5 năm 2021, chúng tôi đã báo cáo rằng hệ thống tải xuống báo cáo giao dịch của PayPal hoàn toàn bị hỏng:

> Có vẻ như việc tải xuống báo cáo hiện không hoạt động và đã không hoạt động cả ngày. Ngoài ra có lẽ nên nhận được thông báo qua email nếu nó thất bại.

Chúng tôi cũng chỉ ra thảm họa quản lý phiên làm việc:

> Ngoài ra nếu bạn không hoạt động trong khi đăng nhập vào PayPal khoảng 5 phút thì bạn sẽ bị đăng xuất. Vì vậy khi bạn làm mới nút bên cạnh báo cáo bạn muốn kiểm tra trạng thái (sau khi bạn chờ đợi mãi), thật phiền phức khi phải đăng nhập lại.

Mark Stuart đã thừa nhận vấn đề hết thời gian phiên làm việc:

> Tôi nhớ bạn đã báo cáo điều đó trước đây với việc phiên làm việc của bạn thường xuyên hết hạn và làm gián đoạn luồng phát triển của bạn khi bạn chuyển đổi giữa IDE và developer.paypal.com hoặc bảng điều khiển thương nhân, rồi bạn quay lại và lại bị đăng xuất.

**Kết quả**: Thời gian hết phiên vẫn là 60 giây. Hệ thống báo cáo vẫn thường xuyên thất bại.

### 2022: Thiếu Tính Năng API Cốt Lõi (Lại) {#2022-core-api-feature-missing-again}

Vào tháng 1 năm 2022, chúng tôi đã tiếp tục báo cáo vấn đề liệt kê đăng ký, lần này với chi tiết hơn về việc tài liệu của họ sai:

> Không có GET nào liệt kê tất cả các đăng ký (trước đây gọi là thỏa thuận thanh toán)

Chúng tôi phát hiện tài liệu chính thức của họ hoàn toàn không chính xác:

> Tài liệu API cũng hoàn toàn không chính xác. Chúng tôi nghĩ có thể làm giải pháp thay thế bằng cách tải xuống danh sách ID đăng ký được mã hóa cứng. Nhưng điều đó thậm chí còn không hoạt động!

> Từ tài liệu chính thức ở đây... Nó nói bạn có thể làm điều này... Đây là điểm mấu chốt - không có trường "Subscription ID" nào cả để kiểm tra.

Christina Monti từ PayPal đã phản hồi:

> Xin lỗi vì sự khó chịu do các bước sai này gây ra, chúng tôi sẽ sửa trong tuần này.

Sri Shivananda (CTO) đã cảm ơn chúng tôi:

> Cảm ơn bạn đã tiếp tục giúp chúng tôi trở nên tốt hơn. Rất trân trọng.

**Kết quả**: Tài liệu chưa bao giờ được sửa. Điểm cuối liệt kê đăng ký chưa bao giờ được tạo ra.


## Cơn Ác Mộng Trải Nghiệm Nhà Phát Triển {#the-developer-experience-nightmare}

Làm việc với API của PayPal giống như quay ngược thời gian 10 năm. Dưới đây là các vấn đề kỹ thuật chúng tôi đã ghi nhận:

### Giao Diện Người Dùng Bị Hỏng {#broken-user-interface}

Bảng điều khiển nhà phát triển PayPal là một thảm họa. Đây là những gì chúng tôi phải đối mặt hàng ngày:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Giao diện PayPal bị hỏng đến mức bạn thậm chí không thể tắt thông báo
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Trình duyệt của bạn không hỗ trợ thẻ video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Bảng điều khiển nhà phát triển thực sự bắt bạn kéo thanh trượt rồi đăng xuất bạn sau 60 giây
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Trình duyệt của bạn không hỗ trợ thẻ video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Thêm các thảm họa giao diện người dùng trong giao diện nhà phát triển PayPal cho thấy các quy trình làm việc bị hỏng
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Trình duyệt của bạn không hỗ trợ thẻ video.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Giao diện quản lý đăng ký - giao diện tệ đến mức chúng tôi phải dựa vào mã để tạo sản phẩm và kế hoạch đăng ký
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="Ảnh chụp màn hình đăng ký PayPal" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Một góc nhìn về giao diện đăng ký bị hỏng với chức năng thiếu hụt (bạn không thể dễ dàng tạo sản phẩm/kế hoạch/đăng ký – và dường như không có cách nào để xóa sản phẩm hoặc kế hoạch sau khi tạo trong giao diện)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="Ảnh chụp màn hình đăng ký PayPal 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Các thông báo lỗi điển hình của PayPal - khó hiểu và không hữu ích
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Vấn đề với SDK {#sdk-problems}

* Không thể xử lý cả thanh toán một lần và đăng ký mà không có các giải pháp phức tạp liên quan đến việc thay đổi và kết xuất lại nút trong khi tải lại SDK bằng các thẻ script
* SDK JavaScript vi phạm các quy ước cơ bản (tên lớp viết thường, không kiểm tra thể hiện)
* Thông báo lỗi không chỉ ra trường nào bị thiếu
* Kiểu dữ liệu không nhất quán (yêu cầu số tiền dạng chuỗi thay vì số)

### Vi phạm Chính sách Bảo mật Nội dung {#content-security-policy-violations}

SDK của họ yêu cầu unsafe-inline và unsafe-eval trong CSP của bạn, **buộc bạn phải đánh đổi bảo mật trang web của mình**.

### Hỗn loạn Tài liệu {#documentation-chaos}

Chính Mark Stuart đã thừa nhận:

> Đồng ý rằng có một lượng lớn API cũ và mới lộn xộn. Thật sự rất khó để tìm thứ cần tìm (ngay cả với chúng tôi, những người làm việc ở đây).

### Lỗ hổng Bảo mật {#security-vulnerabilities}

**Việc triển khai 2FA của PayPal là ngược đời**. Ngay cả khi đã bật ứng dụng TOTP, họ vẫn buộc xác minh qua SMS - khiến tài khoản dễ bị tấn công đổi SIM. Nếu bạn đã bật TOTP, nên chỉ sử dụng phương thức đó. Phương án dự phòng nên là email, không phải SMS.

### Thảm họa Quản lý Phiên làm việc {#session-management-disaster}

**Bảng điều khiển dành cho nhà phát triển của họ đăng xuất bạn sau 60 giây không hoạt động**. Cố gắng làm việc gì đó hiệu quả và bạn liên tục phải trải qua: đăng nhập → captcha → 2FA → đăng xuất → lặp lại. Dùng VPN? Chúc may mắn.

## Tháng 7 năm 2025: Giọt nước tràn ly {#july-2025-the-final-straw}

Sau 11 năm với cùng những vấn đề, điểm bùng phát xảy ra trong một lần di chuyển tài khoản định kỳ. Chúng tôi cần chuyển sang tài khoản PayPal mới để phù hợp với tên công ty "Forward Email LLC" cho việc kế toán rõ ràng hơn.

Điều đáng lẽ đơn giản lại trở thành thảm họa hoàn toàn:

* Thử nghiệm ban đầu cho thấy mọi thứ hoạt động đúng
* Vài giờ sau, PayPal đột ngột chặn tất cả các khoản thanh toán đăng ký mà không thông báo
* Khách hàng không thể thanh toán, gây nhầm lẫn và gánh nặng hỗ trợ
* Hỗ trợ PayPal đưa ra các phản hồi mâu thuẫn, khẳng định tài khoản đã được xác minh
* Chúng tôi buộc phải hoàn toàn ngừng thanh toán qua PayPal

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Lỗi khách hàng thấy khi cố gắng thanh toán - không giải thích, không nhật ký, không gì cả
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Hỗ trợ PayPal khẳng định mọi thứ đều ổn trong khi thanh toán hoàn toàn bị hỏng. Tin nhắn cuối cùng cho thấy họ nói đã "khôi phục một số tính năng" nhưng vẫn yêu cầu thêm thông tin không rõ - điển hình của hỗ trợ PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Quá trình xác minh danh tính mà theo đó "không sửa được gì"
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Thông điệp mơ hồ và vẫn chưa có giải pháp. Không có thông tin, thông báo hay bất cứ điều gì về những thông tin bổ sung cần thiết. Bộ phận hỗ trợ khách hàng im lặng.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Tại Sao Chúng Ta Không Thể Bỏ PayPal {#why-we-cant-just-drop-paypal}

Mặc dù có tất cả những vấn đề này, chúng ta không thể hoàn toàn từ bỏ PayPal vì một số khách hàng chỉ có PayPal là lựa chọn thanh toán. Như một khách hàng đã nói trên [trang trạng thái](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515) của chúng tôi:

> PayPal là lựa chọn duy nhất của tôi để thanh toán

**Chúng tôi bị mắc kẹt trong việc hỗ trợ một nền tảng hỏng vì PayPal đã tạo ra độc quyền thanh toán cho một số người dùng nhất định.**


## Giải Pháp Tạm Thời Cộng Đồng {#the-community-workaround}

Vì PayPal không cung cấp chức năng liệt kê đăng ký cơ bản, cộng đồng nhà phát triển đã xây dựng các giải pháp thay thế. Chúng tôi đã tạo một script giúp quản lý các đăng ký PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Script này tham chiếu đến một [gist cộng đồng](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) nơi các nhà phát triển chia sẻ giải pháp. Người dùng thực sự đang [cảm ơn chúng tôi](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) vì đã cung cấp những gì PayPal đáng lẽ phải xây dựng từ nhiều năm trước.


## Chặn Mẫu Email PayPal Do Lừa Đảo {#blocking-paypal-templates-due-to-phishing}

Các vấn đề vượt ra ngoài API. Mẫu email của PayPal được thiết kế kém đến mức chúng tôi phải triển khai bộ lọc cụ thể trong dịch vụ email của mình vì chúng không thể phân biệt với các nỗ lực lừa đảo.

### Vấn Đề Thực Sự: Mẫu Email PayPal Trông Giống Như Lừa Đảo {#the-real-problem-paypals-templates-look-like-scams}

Chúng tôi thường xuyên nhận được báo cáo về các email PayPal trông giống hệt như các nỗ lực lừa đảo. Đây là một ví dụ thực tế từ các báo cáo lạm dụng của chúng tôi:

**Chủ đề:** `[Sandbox] TEST - Hóa đơn mới từ PaypalBilling434567 sandbox #A4D369E8-0001`

Email này đã được chuyển tiếp đến `abuse@microsoft.com` vì nó có vẻ là một nỗ lực lừa đảo. Vấn đề? Thực ra nó đến từ môi trường sandbox của PayPal, nhưng thiết kế mẫu của họ kém đến mức kích hoạt hệ thống phát hiện lừa đảo.

### Triển Khai Của Chúng Tôi {#our-implementation}

Bạn có thể xem bộ lọc riêng cho PayPal được triển khai trong [mã lọc email](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Do ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Tại Sao Chúng Tôi Phải Chặn PayPal {#why-we-had-to-block-paypal}

Chúng tôi triển khai điều này vì PayPal từ chối sửa các vấn đề spam/lừa đảo/gian lận nghiêm trọng mặc dù chúng tôi đã báo cáo nhiều lần cho các đội ngũ xử lý lạm dụng của họ. Các loại email cụ thể mà chúng tôi chặn bao gồm:

* **RT000238** - Thông báo hóa đơn đáng ngờ
* **PPC001017** - Xác nhận thanh toán có vấn đề
* **RT000542** - Nỗ lực hack tin nhắn quà tặng

### Quy Mô Vấn Đề {#the-scale-of-the-problem}

Nhật ký lọc spam của chúng tôi cho thấy khối lượng lớn spam hóa đơn PayPal mà chúng tôi xử lý hàng ngày. Ví dụ về các chủ đề bị chặn bao gồm:

* "Hóa đơn từ Nhóm Thanh Toán PayPal:- Khoản phí này sẽ được tự động trừ từ tài khoản của bạn. Vui lòng liên hệ ngay với chúng tôi tại \[PHONE]"
* "Hóa đơn từ \[COMPANY NAME] (\[ORDER-ID])"
* Nhiều biến thể với các số điện thoại khác nhau và mã đơn hàng giả
Những email này thường đến từ các máy chủ `outlook.com` nhưng có vẻ như xuất phát từ hệ thống hợp pháp của PayPal, khiến chúng đặc biệt nguy hiểm. Các email này vượt qua xác thực SPF, DKIM và DMARC vì chúng được gửi qua hạ tầng thực sự của PayPal.

Nhật ký kỹ thuật của chúng tôi cho thấy các email spam này chứa các tiêu đề PayPal hợp pháp:

* `X-Email-Type-Id: RT000238` (cùng ID mà chúng tôi chặn)
* `From: "service@paypal.com" <service@paypal.com>`
* Chữ ký DKIM hợp lệ từ `paypal.com`
* Bản ghi SPF đúng cho thấy máy chủ mail của PayPal

Điều này tạo ra một tình huống không thể: email PayPal hợp pháp và spam đều có đặc điểm kỹ thuật giống hệt nhau.

### Sự Mỉa Mai {#the-irony}

PayPal, một công ty lẽ ra phải dẫn đầu cuộc chiến chống gian lận tài chính, lại có các mẫu email thiết kế kém đến mức kích hoạt hệ thống chống lừa đảo. Chúng tôi buộc phải chặn các email PayPal hợp pháp vì chúng không thể phân biệt được với các email lừa đảo.

Điều này được ghi nhận trong nghiên cứu bảo mật: [Cảnh báo gian lận địa chỉ mới của PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - cho thấy hệ thống của chính PayPal bị lợi dụng để gian lận.

### Tác Động Thực Tế: Các Chiêu Thức Lừa Đảo Mới Của PayPal {#real-world-impact-novel-paypal-scams}

Vấn đề không chỉ nằm ở thiết kế mẫu kém. Hệ thống hóa đơn của PayPal dễ bị lợi dụng đến mức kẻ lừa đảo thường xuyên sử dụng nó để gửi các hóa đơn giả mạo trông hợp pháp. Nhà nghiên cứu bảo mật Gavin Anderegg đã ghi lại [Một Chiêu Thức Lừa Đảo Mới Của PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) nơi kẻ lừa đảo gửi các hóa đơn PayPal thực sự vượt qua tất cả các kiểm tra xác thực:

> "Kiểm tra nguồn, email trông như thực sự đến từ PayPal (SPF, DKIM và DMARC đều vượt qua). Nút bấm cũng liên kết đến một URL PayPal hợp pháp... Mất một lúc tôi mới nhận ra đó là email thật. Tôi vừa nhận được một 'hóa đơn' ngẫu nhiên từ một kẻ lừa đảo."

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Ảnh chụp màn hình cho thấy nhiều hóa đơn PayPal giả mạo tràn vào hộp thư, tất cả đều trông hợp pháp vì thực sự đến từ hệ thống của PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="Ảnh cảnh báo lừa đảo PayPal" class="rounded-lg" />
</figure>

Nhà nghiên cứu lưu ý:

> "Nó cũng có vẻ như một tính năng tiện lợi mà PayPal nên xem xét khóa lại. Tôi ngay lập tức cho rằng đây là một dạng lừa đảo và chỉ quan tâm đến các chi tiết kỹ thuật. Việc này quá dễ thực hiện, và tôi lo ngại người khác có thể bị mắc bẫy."

Điều này minh họa hoàn hảo vấn đề: hệ thống hợp pháp của chính PayPal thiết kế kém đến mức tạo điều kiện cho gian lận đồng thời làm cho các liên lạc hợp pháp trông đáng ngờ.

Tệ hơn nữa, điều này ảnh hưởng đến khả năng gửi thư của chúng tôi với Yahoo, dẫn đến khiếu nại của khách hàng và hàng giờ thử nghiệm tỉ mỉ cùng kiểm tra mẫu.

## Quy Trình KYC Ngược Của PayPal {#paypals-backwards-kyc-process}

Một trong những khía cạnh gây bực bội nhất của nền tảng PayPal là cách tiếp cận ngược trong tuân thủ và thủ tục Know Your Customer (KYC). Khác với mọi nhà cung cấp thanh toán khác, PayPal cho phép nhà phát triển tích hợp API và bắt đầu thu tiền trong môi trường sản xuất trước khi hoàn tất xác minh đúng quy trình.

### Cách Nên Làm {#how-it-should-work}

Mọi nhà cung cấp thanh toán hợp pháp đều tuân theo trình tự logic sau:

1. **Hoàn tất xác minh KYC trước**
2. **Phê duyệt tài khoản thương nhân**
3. **Cung cấp quyền truy cập API sản xuất**
4. **Cho phép thu tiền**

Điều này bảo vệ cả nhà cung cấp thanh toán và thương nhân bằng cách đảm bảo tuân thủ trước khi có bất kỳ giao dịch tiền tệ nào.

### Cách PayPal Thực Sự Hoạt Động {#how-paypal-actually-works}

Quy trình của PayPal hoàn toàn ngược lại:

1. **Cung cấp quyền truy cập API sản xuất ngay lập tức**
2. **Cho phép thu tiền trong vài giờ hoặc vài ngày**
3. **Đột ngột chặn thanh toán mà không thông báo**
4. **Yêu cầu tài liệu KYC sau khi khách hàng đã bị ảnh hưởng**
5. **Không thông báo cho thương nhân**
6. **Để khách hàng tự phát hiện vấn đề và báo cáo**
### Tác Động Thực Tế {#the-real-world-impact}

Quy trình ngược này tạo ra thảm họa cho doanh nghiệp:

* **Khách hàng không thể hoàn tất mua hàng** trong các giai đoạn bán hàng cao điểm
* **Không có cảnh báo trước** rằng cần xác minh
* **Không có thông báo qua email** khi thanh toán bị chặn
* **Người bán chỉ biết về sự cố từ khách hàng bối rối**
* **Mất doanh thu** trong các giai đoạn kinh doanh quan trọng
* **Mất lòng tin của khách hàng** khi thanh toán thất bại một cách bí ẩn

### Thảm Họa Di Cư Tài Khoản Tháng 7 Năm 2025 {#the-july-2025-account-migration-disaster}

Kịch bản chính xác này đã xảy ra trong quá trình di cư tài khoản định kỳ của chúng tôi vào tháng 7 năm 2025. PayPal cho phép thanh toán hoạt động ban đầu, sau đó đột ngột chặn mà không có bất kỳ thông báo nào. Chúng tôi chỉ phát hiện ra sự cố khi khách hàng bắt đầu báo rằng họ không thể thanh toán.

Khi liên hệ với bộ phận hỗ trợ, chúng tôi nhận được các phản hồi mâu thuẫn về tài liệu cần thiết, không có thời gian rõ ràng để giải quyết. Điều này buộc chúng tôi phải hoàn toàn ngừng thanh toán qua PayPal, gây nhầm lẫn cho khách hàng khi họ không có lựa chọn thanh toán khác.

### Tại Sao Điều Này Quan Trọng {#why-this-matters}

Cách tiếp cận tuân thủ của PayPal cho thấy sự hiểu lầm cơ bản về cách doanh nghiệp vận hành. Việc KYC đúng cách nên diễn ra **trước** khi tích hợp sản xuất, không phải sau khi khách hàng đã cố gắng thanh toán. Việc thiếu giao tiếp chủ động khi có sự cố xảy ra cho thấy PayPal không hiểu nhu cầu của người bán.

Quy trình ngược này là biểu hiện của các vấn đề tổ chức rộng hơn của PayPal: họ ưu tiên quy trình nội bộ hơn trải nghiệm của người bán và khách hàng, dẫn đến những thảm họa vận hành khiến doanh nghiệp rời bỏ nền tảng của họ.


## Cách Mọi Bộ Xử Lý Thanh Toán Khác Làm Đúng {#how-every-other-payment-processor-does-it-right}

Chức năng liệt kê đăng ký mà PayPal từ chối triển khai đã là tiêu chuẩn trong ngành hơn một thập kỷ. Đây là cách các bộ xử lý thanh toán khác xử lý yêu cầu cơ bản này:

### Stripe {#stripe}

Stripe đã có chức năng liệt kê đăng ký kể từ khi API của họ ra mắt. Tài liệu của họ rõ ràng cho thấy cách lấy tất cả các đăng ký cho một khách hàng hoặc tài khoản người bán. Đây được coi là chức năng CRUD cơ bản.

### Paddle {#paddle}

Paddle cung cấp API quản lý đăng ký toàn diện bao gồm liệt kê, lọc và phân trang. Họ hiểu rằng người bán cần xem các dòng doanh thu định kỳ của họ.

### Coinbase Commerce {#coinbase-commerce}

Ngay cả các bộ xử lý thanh toán tiền điện tử như Coinbase Commerce cũng cung cấp quản lý đăng ký tốt hơn PayPal.

### Square {#square}

API của Square bao gồm liệt kê đăng ký như một tính năng cơ bản, không phải là suy nghĩ sau cùng.

### Tiêu Chuẩn Ngành {#the-industry-standard}

Mọi bộ xử lý thanh toán hiện đại đều cung cấp:

* Liệt kê tất cả các đăng ký
* Lọc theo trạng thái, ngày, khách hàng
* Phân trang cho bộ dữ liệu lớn
* Thông báo webhook cho các thay đổi đăng ký
* Tài liệu toàn diện với các ví dụ hoạt động

### Những Gì Các Bộ Xử Lý Khác Cung Cấp So Với PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Liệt Kê Tất Cả Đăng Ký:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Lọc Theo Khách Hàng:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Lọc Theo Trạng Thái:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Những Gì Bạn Thực Sự Nhận Được:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Bạn CHỈ có thể lấy MỘT đăng ký nếu bạn đã biết ID
# KHÔNG có endpoint để liệt kê tất cả đăng ký
# KHÔNG có cách nào để tìm kiếm hoặc lọc
# Bạn phải tự theo dõi tất cả các ID đăng ký
```

**Các Endpoint Có Sẵn Của PayPal:**

* `POST /v1/billing/subscriptions` - Tạo đăng ký
* `GET /v1/billing/subscriptions/{id}` - Lấy MỘT đăng ký (nếu bạn biết ID)
* `PATCH /v1/billing/subscriptions/{id}` - Cập nhật đăng ký
* `POST /v1/billing/subscriptions/{id}/cancel` - Hủy đăng ký
* `POST /v1/billing/subscriptions/{id}/suspend` - Tạm ngưng đăng ký
**Những Điều Thiếu Sót từ PayPal:**

* ❌ Không có `GET /v1/billing/subscriptions` (liệt kê tất cả)
* ❌ Không có chức năng tìm kiếm
* ❌ Không có lọc theo trạng thái, khách hàng, ngày tháng
* ❌ Không hỗ trợ phân trang

PayPal là nhà xử lý thanh toán lớn duy nhất buộc các nhà phát triển phải tự theo dõi ID đăng ký trong cơ sở dữ liệu của riêng họ.


## Việc Che Giấu Có Hệ Thống của PayPal: Im Lặng 6 Triệu Tiếng Nói {#paypals-systematic-cover-up-silencing-6-million-voices}

Trong một động thái thể hiện rõ cách PayPal xử lý các chỉ trích, họ gần đây đã tắt toàn bộ diễn đàn cộng đồng của mình, khiến hơn 6 triệu thành viên bị im lặng và xóa hàng trăm nghìn bài đăng ghi lại những thất bại của họ.

### Sự Xóa Bỏ Lớn {#the-great-erasure}

Cộng đồng PayPal ban đầu tại `paypal-community.com` có **6.003.558 thành viên** và chứa hàng trăm nghìn bài đăng, báo cáo lỗi, khiếu nại và thảo luận về các lỗi API của PayPal. Đây là hơn một thập kỷ bằng chứng được ghi lại về các vấn đề có hệ thống của PayPal.

Vào ngày 30 tháng 6 năm 2025, PayPal lặng lẽ tắt toàn bộ diễn đàn. Tất cả các liên kết `paypal-community.com` hiện trả về lỗi 404. Đây không phải là một cuộc di chuyển hay nâng cấp.

### Sự Cứu Trợ Bên Thứ Ba {#the-third-party-rescue}

May mắn thay, một dịch vụ bên thứ ba tại [ppl.lithium.com](https://ppl.lithium.com/) đã lưu giữ một số nội dung, cho phép chúng ta truy cập các cuộc thảo luận mà PayPal cố gắng giấu đi. Tuy nhiên, việc lưu giữ này không đầy đủ và có thể biến mất bất cứ lúc nào.

Mẫu hình che giấu bằng chứng này không phải là mới đối với PayPal. Họ có lịch sử được ghi nhận về:

* Xóa các báo cáo lỗi quan trọng khỏi tầm nhìn công chúng
* Ngừng các công cụ dành cho nhà phát triển mà không thông báo
* Thay đổi API mà không có tài liệu thích hợp
* Im lặng các cuộc thảo luận cộng đồng về các thất bại của họ

Việc đóng diễn đàn là nỗ lực táo bạo nhất cho đến nay nhằm che giấu các thất bại có hệ thống của họ khỏi sự giám sát của công chúng.


## Thảm Họa Lỗi Capture Kéo Dài 11 Năm: $1,899 và Còn Tăng {#the-11-year-capture-bug-disaster-1899-and-counting}

Trong khi PayPal bận tổ chức các phiên phản hồi và đưa ra lời hứa, hệ thống xử lý thanh toán cốt lõi của họ đã bị hỏng cơ bản hơn 11 năm. Bằng chứng thật thảm khốc.

### Mất Mát $1,899 của Forward Email {#forward-emails-1899-loss}

Trong hệ thống sản xuất của chúng tôi, chúng tôi phát hiện 108 khoản thanh toán PayPal tổng cộng **$1,899** bị mất do lỗi capture của PayPal. Các khoản thanh toán này cho thấy một mô hình nhất quán:

* webhook `CHECKOUT.ORDER.APPROVED` đã được nhận
* API capture của PayPal trả về lỗi 404
* Các đơn hàng trở nên không thể truy cập qua API của PayPal

Không thể xác định liệu khách hàng có bị tính phí hay không vì PayPal hoàn toàn ẩn nhật ký gỡ lỗi sau 14 ngày và xóa tất cả dữ liệu từ bảng điều khiển cho các ID đơn hàng không được capture.

Điều này chỉ đại diện cho một doanh nghiệp. **Tổng thiệt hại của hàng ngàn thương nhân trong hơn 11 năm có thể lên đến hàng triệu đô la.**

**Chúng tôi sẽ nói lại: tổng thiệt hại của hàng ngàn thương nhân trong hơn 11 năm có thể lên đến hàng triệu đô la.**

Lý do duy nhất chúng tôi phát hiện ra điều này là vì chúng tôi cực kỳ tỉ mỉ và dựa trên dữ liệu.

### Báo Cáo Gốc Năm 2013: Hơn 11 Năm Bỏ Qua {#the-2013-original-report-11-years-of-negligence}

Báo cáo được ghi nhận sớm nhất về vấn đề chính xác này xuất hiện trên [Stack Overflow vào tháng 11 năm 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([lưu trữ](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Liên tục nhận lỗi 404 với Rest API khi thực hiện capture"

Lỗi được báo cáo năm 2013 **giống hệt** với những gì Forward Email trải qua vào năm 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Phản hồi của cộng đồng năm 2013 rất đáng chú ý:

> "Hiện tại có một vấn đề được báo cáo với REST API. PayPal đang làm việc để khắc phục."
**Hơn 11 năm sau, họ vẫn "đang làm việc về nó."**

### Lời thừa nhận năm 2016: PayPal Phá Vỡ SDK Chính Họ {#the-2016-admission-paypal-breaks-their-own-sdk}

Năm 2016, kho lưu trữ GitHub chính thức của PayPal đã ghi nhận [lỗi capture hàng loạt](https://github.com/paypal/PayPal-PHP-SDK/issues/660) ảnh hưởng đến SDK PHP chính thức của họ. Quy mô thật kinh ngạc:

> "Kể từ ngày 20/9/2016, tất cả các lần capture của PayPal đều thất bại với lỗi 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. Không có thay đổi nào giữa ngày 19 và 20/9 đối với tích hợp API. **100% các lần capture kể từ ngày 20/9 đều trả về lỗi này.**"

Một thương nhân báo cáo:

> "Tôi đã có **hơn 1.400 lần capture thất bại trong 24 giờ qua**, tất cả đều với phản hồi lỗi INVALID_RESOURCE_ID."

Phản hồi ban đầu của PayPal là đổ lỗi cho thương nhân và hướng họ đến bộ phận hỗ trợ kỹ thuật. Chỉ sau áp lực lớn, họ mới thừa nhận lỗi:

> "Tôi có cập nhật từ các Nhà Phát Triển Sản Phẩm của chúng tôi. Họ nhận thấy trong các header được gửi đi rằng PayPal-Request-ID được gửi với 42 ký tự, nhưng **dường như có một thay đổi gần đây giới hạn ID này chỉ còn 38 ký tự.**"

Lời thừa nhận này cho thấy sự cẩu thả có hệ thống của PayPal:

1. **Họ đã thực hiện các thay đổi phá vỡ không được ghi chép**
2. **Họ phá vỡ SDK chính thức của chính họ**
3. **Họ đổ lỗi cho thương nhân trước tiên**
4. **Họ chỉ thừa nhận lỗi khi bị áp lực**

Ngay cả sau khi "sửa" lỗi, các thương nhân vẫn báo cáo:

> "Nâng cấp SDK lên v1.7.4 và **vấn đề vẫn tiếp diễn.**"

### Tình trạng leo thang năm 2024: Vẫn Bị Hỏng {#the-2024-escalation-still-broken}

Các báo cáo gần đây từ cộng đồng PayPal được lưu giữ cho thấy vấn đề thực sự đã trở nên tồi tệ hơn. Một [thảo luận tháng 9 năm 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([lưu trữ](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) ghi lại chính xác các vấn đề tương tự:

> "Vấn đề chỉ bắt đầu xuất hiện khoảng 2 tuần trước và không ảnh hưởng đến tất cả các đơn hàng. **Lỗi phổ biến hơn dường như là 404 khi capture.**"

Thương nhân mô tả cùng một mô hình mà Forward Email đã trải qua:

> "Sau khi cố gắng capture đơn hàng, PayPal trả về lỗi 404. Khi truy xuất Chi tiết Đơn hàng: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Không có dấu hiệu nào của việc capture thành công ở phía chúng tôi.**"

### Thảm Họa Độ Tin Cậy của Webhook {#the-webhook-reliability-disaster}

Một [thảo luận cộng đồng được lưu giữ khác](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) tiết lộ hệ thống webhook của PayPal về cơ bản là không đáng tin cậy:

> "Về lý thuyết, nó nên có hai sự kiện (CHECKOUT.ORDER.APPROVED và PAYMENT.CAPTURE.COMPLETED) từ sự kiện Webhook. Thực tế, **hai sự kiện đó hiếm khi được nhận ngay lập tức, PAYMENT.CAPTURE.COMPLETED thường không được nhận hoặc phải chờ vài giờ.**"

Đối với thanh toán đăng ký:

> "**'PAYMENT.SALE.COMPLETED' đôi khi không được nhận hoặc phải chờ vài giờ.**"

Các câu hỏi của thương nhân cho thấy mức độ nghiêm trọng của vấn đề độ tin cậy PayPal:

1. **"Tại sao điều này xảy ra?"** - Hệ thống webhook của PayPal về cơ bản bị hỏng
2. **"Nếu trạng thái đơn hàng là 'COMPLETED', tôi có thể coi là đã nhận được tiền không?"** - Thương nhân không thể tin tưởng phản hồi API của PayPal
3. **"Tại sao 'Event Logs->Webhook Events' không tìm thấy bất kỳ bản ghi nào?"** - Ngay cả hệ thống ghi nhật ký của PayPal cũng không hoạt động

### Mô Hình Cẩu Thả Có Hệ Thống {#the-pattern-of-systematic-negligence}

Bằng chứng kéo dài hơn 11 năm và cho thấy một mô hình rõ ràng:

* **2013**: "PayPal đang làm việc về nó"
* **2016**: PayPal thừa nhận thay đổi phá vỡ, cung cấp bản sửa lỗi hỏng
* **2024**: Các lỗi tương tự vẫn xảy ra, ảnh hưởng đến Forward Email và vô số người khác

Đây không phải là lỗi phần mềm - **đây là sự cẩu thả có hệ thống.** PayPal đã biết về các lỗi nghiêm trọng trong xử lý thanh toán này hơn một thập kỷ và liên tục:
1. **Đổ lỗi cho thương nhân về các lỗi của PayPal**
2. **Thực hiện các thay đổi phá vỡ không được ghi chép**
3. **Cung cấp các bản sửa lỗi không đầy đủ và không hiệu quả**
4. **Phớt lờ tác động tài chính đối với doanh nghiệp**
5. **Ẩn bằng chứng bằng cách gỡ bỏ các diễn đàn cộng đồng**

### Yêu cầu không được ghi chép {#the-undocumented-requirement}

Trong tài liệu chính thức của PayPal không hề đề cập rằng các thương nhân phải triển khai logic thử lại cho các thao tác capture. Tài liệu của họ chỉ nói rằng thương nhân nên "capture ngay sau khi được phê duyệt," nhưng không đề cập rằng API của họ đôi khi trả về lỗi 404 ngẫu nhiên, đòi hỏi các cơ chế thử lại phức tạp.

Điều này buộc mỗi thương nhân phải:

* Triển khai logic thử lại với độ trễ tăng dần theo cấp số nhân
* Xử lý việc giao webhook không nhất quán
* Xây dựng hệ thống quản lý trạng thái phức tạp
* Giám sát thủ công các capture thất bại

**Mọi nhà cung cấp thanh toán khác đều cung cấp API capture đáng tin cậy hoạt động ngay lần đầu tiên.**


## Mô hình lừa dối rộng hơn của PayPal {#paypals-broader-pattern-of-deception}

Thảm họa lỗi capture chỉ là một ví dụ trong cách tiếp cận có hệ thống của PayPal nhằm lừa dối khách hàng và che giấu thất bại của họ.

### Hành động của Sở Dịch vụ Tài chính New York {#the-new-york-department-of-financial-services-action}

Vào tháng 1 năm 2025, Sở Dịch vụ Tài chính New York đã ban hành một [hành động cưỡng chế đối với PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) vì các hành vi lừa dối, cho thấy mô hình lừa dối của PayPal không chỉ giới hạn ở API của họ.

Hành động quản lý này cho thấy PayPal sẵn sàng tham gia vào các hành vi lừa dối trên toàn bộ hoạt động kinh doanh của họ, không chỉ riêng các công cụ dành cho nhà phát triển.

### Vụ kiện Honey: Viết lại liên kết tiếp thị {#the-honey-lawsuit-rewriting-affiliate-links}

Việc PayPal mua lại Honey đã dẫn đến các [vụ kiện cáo buộc Honey viết lại liên kết tiếp thị](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), đánh cắp hoa hồng từ các nhà sáng tạo nội dung và người ảnh hưởng. Đây là một hình thức lừa dối có hệ thống khác, nơi PayPal kiếm lợi bằng cách chuyển hướng doanh thu vốn thuộc về người khác.

Mô hình rõ ràng:

1. **Lỗi API**: Che giấu chức năng bị hỏng, đổ lỗi cho thương nhân
2. **Im lặng cộng đồng**: Gỡ bỏ bằng chứng về các vấn đề
3. **Vi phạm quy định**: Tham gia các hành vi lừa dối
4. **Trộm hoa hồng tiếp thị**: Đánh cắp hoa hồng qua thao tác kỹ thuật

### Chi phí của sự cẩu thả của PayPal {#the-cost-of-paypals-negligence}

Mức thiệt hại 1.899 đô la của Forward Email chỉ là phần nổi của tảng băng chìm. Hãy xem xét tác động rộng hơn:

* **Thương nhân cá nhân**: Hàng ngàn người mất hàng trăm đến hàng nghìn đô la mỗi người
* **Khách hàng doanh nghiệp**: Có thể mất hàng triệu đô la doanh thu
* **Thời gian của nhà phát triển**: Vô số giờ xây dựng các giải pháp thay thế cho API bị hỏng của PayPal
* **Niềm tin khách hàng**: Doanh nghiệp mất khách hàng do lỗi thanh toán của PayPal

Nếu một dịch vụ email nhỏ mất gần 2.000 đô la, và vấn đề này tồn tại hơn 11 năm ảnh hưởng đến hàng ngàn thương nhân, thiệt hại tài chính tổng cộng có thể lên tới **hàng trăm triệu đô la**.

### Lời nói dối trong tài liệu {#the-documentation-lie}

Tài liệu chính thức của PayPal liên tục không đề cập đến các giới hạn và lỗi quan trọng mà thương nhân sẽ gặp phải. Ví dụ:

* **API capture**: Không đề cập rằng lỗi 404 thường xảy ra và cần logic thử lại
* **Độ tin cậy webhook**: Không đề cập rằng webhook thường bị trì hoãn hàng giờ
* **Liệt kê đăng ký**: Tài liệu ngụ ý có thể liệt kê khi không có endpoint nào tồn tại
* **Timeout phiên làm việc**: Không đề cập đến timeout 60 giây rất nghiêm ngặt

Việc bỏ sót có hệ thống các thông tin quan trọng này buộc thương nhân phải tự khám phá các giới hạn của PayPal qua thử nghiệm thực tế trên hệ thống sản xuất, thường dẫn đến thiệt hại tài chính.


## Điều này có ý nghĩa gì với nhà phát triển {#what-this-means-for-developers}

Việc PayPal liên tục thất bại trong việc đáp ứng các nhu cầu cơ bản của nhà phát triển trong khi thu thập phản hồi rộng rãi cho thấy một vấn đề tổ chức căn bản. Họ coi việc thu thập phản hồi như một sự thay thế cho việc thực sự sửa lỗi.
Mô hình rất rõ ràng:

1. Các nhà phát triển báo cáo các vấn đề
2. PayPal tổ chức các buổi phản hồi với các giám đốc điều hành
3. Phản hồi chi tiết được cung cấp
4. Các nhóm thừa nhận các thiếu sót và hứa sẽ "theo dõi và giải quyết"
5. Không có gì được triển khai
6. Các giám đốc điều hành rời đi để đến các công ty tốt hơn
7. Các nhóm mới yêu cầu cùng một phản hồi
8. Chu trình lặp lại

Trong khi đó, các nhà phát triển buộc phải xây dựng các giải pháp tạm thời, thỏa hiệp về bảo mật và xử lý các giao diện người dùng bị hỏng chỉ để chấp nhận thanh toán.

Nếu bạn đang xây dựng một hệ thống thanh toán, hãy học hỏi từ kinh nghiệm của chúng tôi: xây dựng [phương pháp ba mũi nhọn của bạn](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) với nhiều bộ xử lý, nhưng đừng mong PayPal cung cấp các chức năng cơ bản bạn cần. Hãy lên kế hoạch xây dựng các giải pháp tạm thời ngay từ ngày đầu tiên.

> Bài viết này ghi lại kinh nghiệm 11 năm của chúng tôi với các API của PayPal tại Forward Email. Tất cả các ví dụ mã và liên kết đều từ các hệ thống sản xuất thực tế của chúng tôi. Chúng tôi tiếp tục hỗ trợ thanh toán PayPal mặc dù có những vấn đề này vì một số khách hàng không có lựa chọn khác

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="Minh họa thảm họa API PayPal" class="rounded-lg" />
