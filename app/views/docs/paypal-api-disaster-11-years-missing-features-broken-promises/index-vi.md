# Thảm họa API kéo dài 11 năm của PayPal: Cách chúng tôi xây dựng các giải pháp thay thế trong khi họ bỏ qua các nhà phát triển {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Tại Forward Email, chúng tôi đã xử lý các API bị lỗi của PayPal trong hơn một thập kỷ. Những gì bắt đầu từ những sự cố nhỏ đã trở thành một thảm họa thực sự, buộc chúng tôi phải tự xây dựng các giải pháp thay thế, chặn các mẫu lừa đảo của chúng và cuối cùng là dừng tất cả các khoản thanh toán PayPal trong quá trình di chuyển tài khoản quan trọng.</p>
<p class="lead mt-3">Đây là câu chuyện về 11 năm PayPal phớt lờ các nhu cầu cơ bản của nhà phát triển trong khi chúng tôi đã cố gắng hết sức để nền tảng của họ hoạt động.</p>

## Mục lục {#table-of-contents}

* [Mảnh ghép còn thiếu: Không có cách nào để liệt kê các đăng ký](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Vấn đề nổi lên](#2014-2017-the-problem-emerges)
* [2020: Chúng tôi cung cấp cho họ phản hồi rộng rãi](#2020-we-give-them-extensive-feedback)
  * [Danh sách phản hồi gồm 27 mục](#the-27-item-feedback-list)
  * [Các đội đã tham gia, những lời hứa đã được thực hiện](#teams-got-involved-promises-were-made)
  * [Kết quả thì sao? Chẳng có gì cả.](#the-result-nothing)
* [Cuộc di cư của các giám đốc điều hành: PayPal đã mất toàn bộ ký ức của tổ chức như thế nào](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Lãnh đạo mới, vấn đề cũ](#2025-new-leadership-same-problems)
  * [CEO mới tham gia](#the-new-ceo-gets-involved)
  * [Phản hồi của Michelle Gill](#michelle-gills-response)
  * [Phản hồi của chúng tôi: Không còn cuộc họp nào nữa](#our-response-no-more-meetings)
  * [Phản ứng quá mức của Marty Brodbeck](#marty-brodbecks-overengineering-response)
  * [Mâu thuẫn "CRUD đơn giản"](#the-simple-crud-contradiction)
  * [Sự ngắt kết nối trở nên rõ ràng](#the-disconnect-becomes-clear)
* [Nhiều năm báo cáo lỗi mà họ đã bỏ qua](#years-of-bug-reports-they-ignored)
  * [2016: Những khiếu nại ban đầu về UI/UX](#2016-early-uiux-complaints)
  * [2021: Báo cáo lỗi email doanh nghiệp](#2021-business-email-bug-report)
  * [2021: Đề xuất cải tiến giao diện người dùng](#2021-ui-improvement-suggestions)
  * [2021: Lỗi môi trường Sandbox](#2021-sandbox-environment-failures)
  * [2021: Hệ thống báo cáo bị hỏng hoàn toàn](#2021-reports-system-completely-broken)
  * [2022: Tính năng API cốt lõi bị thiếu (Lại nữa)](#2022-core-api-feature-missing-again)
* [Cơn ác mộng về trải nghiệm của nhà phát triển](#the-developer-experience-nightmare)
  * [Giao diện người dùng bị hỏng](#broken-user-interface)
  * [Sự cố SDK](#sdk-problems)
  * [Vi phạm Chính sách bảo mật nội dung](#content-security-policy-violations)
  * [Sự hỗn loạn trong tài liệu](#documentation-chaos)
  * [Lỗ hổng bảo mật](#security-vulnerabilities)
  * [Thảm họa quản lý phiên](#session-management-disaster)
* [Tháng 7 năm 2025: Giọt nước tràn ly](#july-2025-the-final-straw)
* [Tại sao chúng ta không thể bỏ PayPal](#why-we-cant-just-drop-paypal)
* [Giải pháp thay thế của cộng đồng](#the-community-workaround)
* [Chặn mẫu PayPal do lừa đảo](#blocking-paypal-templates-due-to-phishing)
  * [Vấn đề thực sự: Mẫu của PayPal trông giống như lừa đảo](#the-real-problem-paypals-templates-look-like-scams)
  * [Việc triển khai của chúng tôi](#our-implementation)
  * [Tại sao chúng tôi phải chặn PayPal](#why-we-had-to-block-paypal)
  * [Quy mô của vấn đề](#the-scale-of-the-problem)
  * [Sự trớ trêu](#the-irony)
  * [Tác động thực tế: Các vụ lừa đảo PayPal mới](#real-world-impact-novel-paypal-scams)
* [Quy trình KYC ngược của PayPal](#paypals-backwards-kyc-process)
  * [Nó nên hoạt động như thế nào](#how-it-should-work)
  * [PayPal thực sự hoạt động như thế nào](#how-paypal-actually-works)
  * [Tác động thực tế](#the-real-world-impact)
  * [Thảm họa di chuyển tài khoản tháng 7 năm 2025](#the-july-2025-account-migration-disaster)
  * [Tại sao điều này quan trọng](#why-this-matters)
* [Cách mọi bộ xử lý thanh toán khác thực hiện đúng](#how-every-other-payment-processor-does-it-right)
  * [Sọc](#stripe)
  * [mái chèo](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Quảng trường](#square)
  * [Tiêu chuẩn công nghiệp](#the-industry-standard)
  * [Những Bộ Xử Lý Khác Cung Cấp Gì So Với PayPal](#what-other-processors-provide-vs-paypal)
* [Sự che đậy có hệ thống của PayPal: Làm im lặng 6 triệu tiếng nói](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Sự xóa sổ vĩ đại](#the-great-erasure)
  * [Giải cứu của bên thứ ba](#the-third-party-rescue)
* [Thảm họa bắt côn trùng kéo dài 11 năm: 1.899 đô la và vẫn tiếp tục tăng](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Email chuyển tiếp mất 1.899 đô la](#forward-emails-1899-loss)
  * [Báo cáo gốc năm 2013: Hơn 11 năm bỏ bê](#the-2013-original-report-11-years-of-negligence)
  * [Bản thừa nhận năm 2016: PayPal phá vỡ SDK của chính họ](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Sự leo thang năm 2024: Vẫn chưa hoàn thành](#the-2024-escalation-still-broken)
  * [Thảm họa về độ tin cậy của Webhook](#the-webhook-reliability-disaster)
  * [Mô hình của sự cẩu thả có hệ thống](#the-pattern-of-systematic-negligence)
  * [Yêu cầu không có giấy tờ](#the-undocumented-requirement)
* [Mô hình lừa đảo rộng hơn của PayPal](#paypals-broader-pattern-of-deception)
  * [Hành động của Sở Dịch vụ Tài chính New York](#the-new-york-department-of-financial-services-action)
  * [Vụ kiện Honey: Viết lại liên kết liên kết](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Cái giá phải trả cho sự bất cẩn của PayPal](#the-cost-of-paypals-negligence)
  * [Sự dối trá về tài liệu](#the-documentation-lie)
* [Điều này có ý nghĩa gì đối với các nhà phát triển](#what-this-means-for-developers)

## Mảnh ghép còn thiếu: Không có cách nào để liệt kê các đăng ký {#the-missing-piece-no-way-to-list-subscriptions}

Đây là điều khiến chúng tôi ngạc nhiên: PayPal đã áp dụng hình thức thanh toán theo đăng ký từ năm 2014, nhưng họ chưa bao giờ cung cấp cách để các thương gia liệt kê các đăng ký của riêng họ.

Hãy suy nghĩ về điều đó một chút. Bạn có thể tạo đăng ký, hủy đăng ký nếu có ID, nhưng bạn không thể có danh sách tất cả các đăng ký đang hoạt động cho tài khoản của mình. Giống như việc có một cơ sở dữ liệu không có câu lệnh SELECT vậy.

Chúng tôi cần điều này cho các hoạt động kinh doanh cơ bản:

* Hỗ trợ khách hàng (khi có người gửi email hỏi về đăng ký)
* Báo cáo tài chính và đối chiếu
* Quản lý hóa đơn tự động
* Tuân thủ và kiểm toán

Nhưng PayPal thì sao? Họ... chưa bao giờ xây dựng nó.

## 2014-2017: Vấn đề nảy sinh {#2014-2017-the-problem-emerges}

Vấn đề về danh sách đăng ký lần đầu tiên xuất hiện trên diễn đàn cộng đồng của PayPal vào năm 2017. Các nhà phát triển đã đặt ra câu hỏi hiển nhiên: "Làm thế nào để tôi có được danh sách tất cả các đăng ký của mình?"

Phản ứng của PayPal là gì? Im lặng.

Các thành viên cộng đồng bắt đầu cảm thấy bực bội:

> "Thật kỳ lạ khi một thương gia không thể liệt kê tất cả các Thỏa thuận đang hoạt động. Nếu ID Thỏa thuận bị mất, điều này có nghĩa là chỉ người dùng mới có thể hủy hoặc tạm dừng thỏa thuận." - leafspider

> "+1. Đã gần 3 năm rồi." - laudukang (có nghĩa là vấn đề đã tồn tại từ \~2014)

[bài đăng cộng đồng gốc](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) từ năm 2017 cho thấy các nhà phát triển đang cầu xin chức năng cơ bản này. Phản hồi của PayPal là lưu trữ kho lưu trữ nơi mọi người báo cáo sự cố.

## 2020: Chúng tôi cung cấp cho họ phản hồi rộng rãi {#2020-we-give-them-extensive-feedback}

Vào tháng 10 năm 2020, PayPal đã liên hệ với chúng tôi để tổ chức một buổi phản hồi chính thức. Đây không phải là một buổi trò chuyện thông thường - họ đã tổ chức một cuộc gọi Microsoft Teams kéo dài 45 phút với 8 giám đốc điều hành của PayPal, bao gồm Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze và những người khác.

### Danh sách phản hồi gồm 27 mục {#the-27-item-feedback-list}

Chúng tôi đã chuẩn bị sẵn sàng. Sau 6 giờ cố gắng tích hợp với API của họ, chúng tôi đã tổng hợp được 27 vấn đề cụ thể. Mark Stuart từ nhóm PayPal Checkout cho biết:

> Chào Nick, cảm ơn bạn đã chia sẻ với mọi người hôm nay! Tôi nghĩ đây sẽ là động lực để nhóm chúng tôi nhận được thêm sự hỗ trợ và đầu tư để khắc phục những vấn đề này. Thật khó để nhận được những phản hồi chất lượng như những gì bạn đã để lại cho chúng tôi cho đến nay.

Phản hồi không phải là lý thuyết - nó đến từ những nỗ lực tích hợp thực tế:

1. **Việc tạo mã thông báo truy cập không hoạt động**:

> Việc tạo mã thông báo truy cập không hoạt động. Ngoài ra, cần có nhiều ví dụ hơn là chỉ cURL.

2. **Không có giao diện người dùng web để tạo đăng ký**:

> Làm sao bạn có thể tạo đăng ký mà không cần dùng cURL? Hình như không có giao diện web nào để làm việc này (như Stripe)

Mark Stuart thấy vấn đề về mã thông báo truy cập đặc biệt đáng lo ngại:

> Chúng tôi thường không nghe thấy bất kỳ vấn đề nào liên quan đến việc tạo mã thông báo truy cập.

### Các đội đã tham gia, lời hứa đã được đưa ra {#teams-got-involved-promises-were-made}

Khi chúng tôi phát hiện thêm nhiều vấn đề, PayPal liên tục bổ sung thêm các nhóm vào cuộc thảo luận. Darshan Raju từ nhóm Giao diện người dùng Quản lý Đăng ký đã tham gia và phát biểu:

> Hãy thừa nhận sai sót. Chúng tôi sẽ theo dõi và khắc phục. Cảm ơn bạn một lần nữa vì phản hồi!

Phiên họp được mô tả là nhằm tìm kiếm:

> chia sẻ thẳng thắn về trải nghiệm của bạn

ĐẾN:

> biến PayPal thành ứng dụng lý tưởng dành cho các nhà phát triển.

### Kết quả? Không có gì cả. {#the-result-nothing}

Bất chấp phiên phản hồi chính thức, danh sách 27 mục dài, sự tham gia của nhiều nhóm và những lời hứa sẽ:

> theo dõi và địa chỉ

vấn đề, hoàn toàn không có gì được sửa chữa.

## Cuộc di cư của các giám đốc điều hành: PayPal đã đánh mất toàn bộ ký ức của tổ chức như thế nào {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Đây mới là phần thú vị nhất. Tất cả những người nhận được phản hồi năm 2020 của chúng tôi đều đã rời khỏi PayPal:

**Thay đổi lãnh đạo:**

* [Dan Schulman (Giám đốc điều hành trong 9 năm) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (Tháng 9 năm 2023)
* [Sri Shivananda (Giám đốc công nghệ, người tổ chức phản hồi) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (Tháng 1 năm 2024)

**Các nhà lãnh đạo kỹ thuật đã hứa hẹn rồi rời đi:**

* **Mark Stuart** (hứa hẹn phản hồi sẽ là "chất xúc tác") → [Hiện tại Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (cựu chiến binh PayPal 18 năm) → [Tổng giám đốc điều hành của MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (Phó Chủ tịch Sản phẩm Tiêu dùng Toàn cầu) → [Đã nghỉ hưu](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (một trong những người cuối cùng còn lại) → [Vừa rời đi Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (tháng 1 năm 2025)

PayPal đã trở thành nơi các giám đốc điều hành thu thập phản hồi của nhà phát triển, đưa ra lời hứa, sau đó chuyển sang các công ty tốt hơn như JPMorgan, Ripple và các công ty công nghệ tài chính khác.

Điều này giải thích tại sao phản hồi về sự cố GitHub năm 2025 có vẻ hoàn toàn không liên quan đến phản hồi năm 2020 của chúng tôi - thực tế là tất cả những người nhận được phản hồi đó đều đã rời khỏi PayPal.

## 2025: Lãnh đạo mới, vấn đề cũ {#2025-new-leadership-same-problems}

Đến năm 2025, mô hình tương tự lại xuất hiện. Sau nhiều năm không có tiến triển, ban lãnh đạo mới của PayPal lại một lần nữa lên tiếng.

### Tổng Giám đốc Điều hành Mới Tham gia {#the-new-ceo-gets-involved}

Vào ngày 30 tháng 6 năm 2025, chúng tôi đã liên hệ trực tiếp với CEO mới của PayPal, Alex Chriss. Ông ấy trả lời ngắn gọn:

> Chào Nick – Cảm ơn bạn đã liên hệ và phản hồi. Michelle (đã gửi kèm) đang cùng nhóm của cô ấy tích cực hỗ trợ và giải quyết vấn đề này với bạn. Cảm ơn -A

### Phản hồi của Michelle Gill {#michelle-gills-response}

Michelle Gill, Phó chủ tịch điều hành kiêm Tổng giám đốc phụ trách Doanh nghiệp nhỏ và Dịch vụ tài chính, trả lời:

> Cảm ơn Nick rất nhiều, đã chuyển Alex sang BCC. Chúng tôi đã xem xét việc này từ bài đăng trước của bạn. Chúng tôi sẽ gọi cho bạn trước khi tuần này kết thúc. Bạn vui lòng gửi cho tôi thông tin liên lạc để một đồng nghiệp của tôi có thể liên lạc nhé. Michelle

### Phản hồi của chúng tôi: Không còn cuộc họp nào nữa {#our-response-no-more-meetings}

Chúng tôi từ chối một cuộc họp khác và giải thích sự thất vọng của mình:

> Cảm ơn bạn. Tuy nhiên, tôi không cảm thấy việc gọi điện thoại sẽ mang lại kết quả gì. Lý do là... Trước đây tôi đã từng gọi điện thoại nhưng chẳng đi đến đâu cả. Tôi đã lãng phí hơn 2 tiếng đồng hồ để nói chuyện với toàn bộ nhóm và ban lãnh đạo mà chẳng được gì... Hàng tá email qua lại. Hoàn toàn chẳng được gì. Phản hồi chẳng đi đến đâu. Tôi đã cố gắng nhiều năm, được lắng nghe, nhưng rồi chẳng đi đến đâu cả.

### Phản hồi về kỹ thuật quá mức của Marty Brodbeck {#marty-brodbecks-overengineering-response}

Sau đó, Marty Brodbeck, người đứng đầu bộ phận kỹ thuật tiêu dùng tại PayPal, đã liên hệ:

Chào Nick, tôi là Marty Brodbeck. Tôi phụ trách toàn bộ mảng kỹ thuật tiêu dùng tại PayPal và đang thúc đẩy phát triển API cho công ty. Bạn có thể chia sẻ với tôi về vấn đề bạn đang gặp phải và cách chúng ta có thể hỗ trợ bạn không?

Khi chúng tôi giải thích nhu cầu đơn giản về điểm cuối danh sách đăng ký, phản hồi của anh ấy đã chỉ ra vấn đề chính xác:

> Cảm ơn Nick, chúng tôi đang trong quá trình tạo một API đăng ký duy nhất với SDK đầy đủ (hỗ trợ xử lý lỗi đầy đủ, theo dõi đăng ký dựa trên sự kiện, thời gian hoạt động mạnh mẽ) trong đó việc thanh toán cũng được tách thành một API riêng để các thương gia sử dụng thay vì phải sắp xếp trên nhiều điểm cuối để nhận được một phản hồi duy nhất.

Đây hoàn toàn là cách tiếp cận sai lầm. Chúng ta không cần hàng tháng trời xây dựng kiến trúc phức tạp. Chúng ta chỉ cần một điểm cuối REST đơn giản liệt kê các đăng ký - một thứ lẽ ra đã phải tồn tại từ năm 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Mâu thuẫn "CRUD đơn giản" {#the-simple-crud-contradiction}

Khi chúng tôi chỉ ra rằng đây là chức năng CRUD cơ bản đáng lẽ phải có từ năm 2014, phản hồi của Marty rất rõ ràng:

> Các thao tác Crud đơn giản là một phần của API cốt lõi, bạn của tôi ạ, vì vậy sẽ không mất nhiều tháng để phát triển

PayPal TypeScript SDK, hiện chỉ hỗ trợ ba điểm cuối sau nhiều tháng phát triển, cùng với mốc thời gian lịch sử của nó, chứng minh rõ ràng rằng những dự án như vậy cần nhiều hơn vài tháng để hoàn thành.

Câu trả lời này cho thấy anh ta không hiểu API của chính mình. Nếu "các thao tác CRUD đơn giản là một phần của API cốt lõi", vậy thì điểm cuối của danh sách đăng ký nằm ở đâu? Chúng tôi đã trả lời:

> Nếu "các thao tác CRUD đơn giản là một phần của API cốt lõi" thì điểm cuối của danh sách đăng ký ở đâu? Các nhà phát triển đã yêu cầu "thao tác CRUD đơn giản" này từ năm 2014. Đã 11 năm trôi qua. Mọi bộ xử lý thanh toán khác đều đã có chức năng cơ bản này ngay từ ngày đầu.

### Ngắt kết nối trở nên rõ ràng {#the-disconnect-becomes-clear}

Các cuộc trao đổi năm 2025 với Alex Chriss, Michelle Gill và Marty Brodbeck cho thấy cùng một sự rối loạn chức năng của tổ chức:

1. **Lãnh đạo mới không biết gì về các buổi phản hồi trước đó**
2. **Họ đề xuất cùng một giải pháp được thiết kế quá mức**
3. **Họ không hiểu những hạn chế của API của chính mình**
4. **Họ muốn có nhiều cuộc họp hơn thay vì chỉ giải quyết vấn đề**

Mẫu hình này giải thích lý do tại sao các nhóm PayPal vào năm 2025 dường như hoàn toàn không liên quan đến phản hồi toàn diện được cung cấp vào năm 2020 - những người nhận được phản hồi đó đã không còn nữa và ban lãnh đạo mới đang lặp lại những sai lầm tương tự.

## Nhiều năm báo cáo lỗi mà họ đã bỏ qua {#years-of-bug-reports-they-ignored}

Chúng tôi không chỉ phàn nàn về việc thiếu tính năng. Chúng tôi còn tích cực báo cáo lỗi và cố gắng cải thiện. Dưới đây là dòng thời gian đầy đủ về các vấn đề mà chúng tôi đã ghi nhận:

### 2016: Khiếu nại ban đầu về UI/UX {#2016-early-uiux-complaints}

Ngay từ năm 2016, chúng tôi đã công khai liên hệ với ban lãnh đạo PayPal, bao gồm cả Dan Schulman, về các vấn đề giao diện và khả năng sử dụng. 9 năm trước, và những vấn đề về UI/UX vẫn tồn tại cho đến ngày nay.

### 2021: Báo cáo lỗi email doanh nghiệp {#2021-business-email-bug-report}

Vào tháng 3 năm 2021, chúng tôi đã báo cáo rằng hệ thống email doanh nghiệp của PayPal đã gửi thông báo hủy không chính xác. Mẫu email có các biến được hiển thị không chính xác, khiến khách hàng khó hiểu về thông báo.

Mark Stuart đã thừa nhận vấn đề này:

> Cảm ơn Nick! Chuyển sang BCC. @Prasy, nhóm của anh có chịu trách nhiệm về email này không, hay anh biết ai chịu trách nhiệm không? Câu "Niftylettuce, LLC, chúng tôi sẽ không tính phí cho anh nữa" khiến tôi tin rằng có sự nhầm lẫn về người nhận và nội dung email.

**Kết quả**: Họ thực sự đã sửa lỗi này! Mark Stuart đã xác nhận:

> Tôi vừa nhận được thông báo từ nhóm thông báo rằng mẫu email đã được sửa và triển khai. Cảm ơn bạn đã liên hệ để báo cáo. Cảm ơn bạn!

Điều này cho thấy họ CÓ THỂ sửa chữa mọi thứ khi họ muốn - họ chỉ chọn không sửa chữa hầu hết các vấn đề.

### 2021: Đề xuất cải tiến giao diện người dùng {#2021-ui-improvement-suggestions}

Vào tháng 2 năm 2021, chúng tôi đã cung cấp phản hồi chi tiết về giao diện người dùng bảng điều khiển của họ, cụ thể là phần "Hoạt động gần đây của PayPal":

> Tôi nghĩ bảng điều khiển tại paypal.com, cụ thể là "Hoạt động gần đây của PayPal" cần được cải thiện. Tôi không nghĩ bạn nên hiển thị dòng trạng thái "Đã tạo" của khoản thanh toán định kỳ $0 - nó chỉ thêm hàng tá dòng thừa và bạn không thể dễ dàng nhìn thoáng qua để biết được doanh thu tạo ra trong ngày/vài ngày qua là bao nhiêu.

Mark Stuart đã chuyển tiếp nó cho nhóm sản phẩm tiêu dùng:

> Cảm ơn! Tôi không chắc nhóm nào chịu trách nhiệm về Hoạt động, nhưng tôi đã chuyển tiếp thông tin này cho trưởng bộ phận sản phẩm tiêu dùng để tìm đúng nhóm. Khoản thanh toán định kỳ $0,00 có vẻ là lỗi. Có lẽ nên được lọc bỏ.

**Kết quả**: Không bao giờ sửa được. Giao diện người dùng vẫn hiển thị những mục $0 vô dụng này.

### 2021: Lỗi môi trường Sandbox {#2021-sandbox-environment-failures}

Vào tháng 11 năm 2021, chúng tôi đã báo cáo các sự cố nghiêm trọng với môi trường thử nghiệm của PayPal:

* Khóa API bí mật của Sandbox đã bị thay đổi ngẫu nhiên và bị vô hiệu hóa
* Tất cả tài khoản thử nghiệm Sandbox đã bị xóa mà không cần thông báo
* Thông báo lỗi khi cố gắng xem chi tiết tài khoản Sandbox
* Lỗi tải không liên tục

> Vì lý do nào đó, khóa API bí mật Sandbox của tôi đã bị thay đổi và bị Vô hiệu hóa. Ngoài ra, tất cả tài khoản thử nghiệm Sandbox cũ của tôi cũng đã bị xóa.

> Đôi khi chúng tải được, đôi khi lại không. Điều này thực sự rất khó chịu.

**Kết quả**: Không có phản hồi, không có cách khắc phục. Các nhà phát triển vẫn gặp phải vấn đề về độ tin cậy của hộp cát.

### 2021: Báo cáo Hệ thống bị hỏng hoàn toàn {#2021-reports-system-completely-broken}

Vào tháng 5 năm 2021, chúng tôi đã báo cáo rằng hệ thống tải xuống báo cáo giao dịch của PayPal đã bị hỏng hoàn toàn:

> Có vẻ như tính năng báo cáo lượt tải xuống hiện không hoạt động và đã không hoạt động cả ngày nay. Ngoài ra, có lẽ nên nhận thông báo qua email nếu không hoạt động.

Chúng tôi cũng chỉ ra thảm họa quản lý phiên:

> Ngoài ra, nếu bạn không hoạt động khi đăng nhập vào PayPal trong khoảng 5 phút, bạn sẽ bị đăng xuất. Vì vậy, khi bạn làm mới lại nút bên cạnh báo cáo bạn muốn kiểm tra trạng thái (sau khi bạn chờ đợi rất lâu), thật bất tiện khi phải đăng nhập lại.

Mark Stuart đã thừa nhận vấn đề hết thời gian phiên:

> Tôi nhớ bạn đã báo cáo rằng trước đây phiên của bạn thường xuyên hết hạn và làm gián đoạn luồng phát triển của bạn khi bạn chuyển đổi giữa IDE và developer.paypal.com hoặc bảng điều khiển của người bán, sau đó bạn quay lại và lại bị đăng xuất.

**Kết quả**: Thời gian chờ phiên vẫn là 60 giây. Hệ thống báo cáo vẫn thường xuyên bị lỗi.

### 2022: Tính năng API cốt lõi bị thiếu (một lần nữa) {#2022-core-api-feature-missing-again}

Vào tháng 1 năm 2022, chúng tôi lại đưa vấn đề về danh sách đăng ký lên cấp cao hơn, lần này còn nêu chi tiết hơn về cách tài liệu của họ sai:

> Không có GET liệt kê tất cả các đăng ký (trước đây gọi là thỏa thuận thanh toán)

Chúng tôi phát hiện ra tài liệu chính thức của họ hoàn toàn không chính xác:

> Tài liệu API cũng hoàn toàn không chính xác. Chúng tôi nghĩ có thể giải quyết vấn đề bằng cách tải xuống danh sách ID đăng ký được mã hóa cứng. Nhưng điều đó thậm chí không hiệu quả!

> Theo tài liệu chính thức tại đây... Tài liệu nói rằng bạn có thể làm điều này... Vấn đề là không có trường "ID đăng ký" nào để bạn có thể đánh dấu chọn.

Christina Monti từ PayPal đã trả lời:

> Xin lỗi vì sự thất vọng do các bước này sai, chúng tôi sẽ khắc phục trong tuần này.

Sri Shivananda (CTO) đã cảm ơn chúng tôi:

> Cảm ơn sự giúp đỡ liên tục của bạn để chúng tôi ngày càng tốt hơn. Chúng tôi rất trân trọng điều đó.

**Kết quả**: Tài liệu chưa bao giờ được sửa. Điểm cuối danh sách đăng ký chưa bao giờ được tạo.

## Cơn ác mộng trải nghiệm của nhà phát triển {#the-developer-experience-nightmare}

Làm việc với API của PayPal giống như quay ngược thời gian 10 năm về trước. Dưới đây là các vấn đề kỹ thuật mà chúng tôi đã ghi nhận:

### Giao diện người dùng bị hỏng {#broken-user-interface}

Bảng điều khiển dành cho nhà phát triển của PayPal thật là thảm họa. Dưới đây là những gì chúng tôi phải đối mặt hàng ngày:

<figure>
<figcaption><div class="alert alert-danger small text-center">
Giao diện người dùng của PayPal bị lỗi đến mức bạn thậm chí không thể tắt thông báo.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Trình duyệt của bạn không hỗ trợ thẻ video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Bảng điều khiển dành cho nhà phát triển thực sự bắt bạn kéo một thanh trượt rồi đăng xuất sau 60 giây.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">

Trình duyệt của bạn không hỗ trợ thẻ video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">

Thêm nhiều lỗi giao diện người dùng trong giao diện nhà phát triển PayPal cho thấy quy trình làm việc bị lỗi
</div></figcaption>

<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">

Trình duyệt của bạn không hỗ trợ thẻ video.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Giao diện quản lý đăng ký - giao diện tệ đến mức chúng tôi phải dựa vào mã để tạo sản phẩm và gói đăng ký.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Hình ảnh giao diện đăng ký bị hỏng, thiếu chức năng (bạn không thể dễ dàng tạo sản phẩm/gói/đăng ký &ndash; và dường như không có cách nào để xóa sản phẩm hoặc gói sau khi đã tạo trong giao diện người dùng)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Thông báo lỗi thường gặp của PayPal - khó hiểu và không hữu ích
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Sự cố SDK {#sdk-problems}

* Không thể xử lý cả thanh toán một lần và đăng ký mà không cần giải pháp phức tạp liên quan đến việc hoán đổi và hiển thị lại các nút trong khi tải lại SDK bằng thẻ script
* JavaScript SDK vi phạm các quy ước cơ bản (tên lớp viết thường, không kiểm tra phiên bản)
* Thông báo lỗi không cho biết trường nào bị thiếu
* Kiểu dữ liệu không nhất quán (yêu cầu số lượng chuỗi thay vì số)

### Vi phạm Chính sách bảo mật nội dung {#content-security-policy-violations}

SDK của họ yêu cầu unsafe-inline và unsafe-eval trong CSP của bạn, **buộc bạn phải đánh đổi tính bảo mật của trang web**.

### Tài liệu hỗn loạn {#documentation-chaos}

Bản thân Mark Stuart đã thừa nhận:

> Đồng ý là có quá nhiều API cũ và mới. Thật khó để tìm ra thứ cần tìm (ngay cả với những người làm việc ở đây).

### Lỗ hổng bảo mật {#security-vulnerabilities}

**Việc triển khai 2FA của PayPal khá lạc hậu**. Ngay cả khi bật ứng dụng TOTP, chúng vẫn buộc phải xác minh qua SMS - khiến tài khoản dễ bị tấn công hoán đổi SIM. Nếu bạn đã bật TOTP, ứng dụng sẽ chỉ sử dụng phương thức này. Phương án dự phòng nên là email, không phải SMS.

### Thảm họa quản lý phiên {#session-management-disaster}

**Bảng điều khiển dành cho nhà phát triển của họ sẽ đăng xuất bạn sau 60 giây không hoạt động**. Thử làm bất cứ điều gì có ích thì bạn liên tục phải trải qua các bước sau: đăng nhập → nhập captcha → xác thực hai bước → đăng xuất → lặp lại. Bạn đang sử dụng VPN? Chúc may mắn.

## Tháng 7 năm 2025: Giọt nước tràn ly {#july-2025-the-final-straw}

Sau 11 năm gặp phải những vấn đề tương tự, điểm đột phá đã đến trong quá trình di chuyển tài khoản định kỳ. Chúng tôi cần chuyển sang một tài khoản PayPal mới để phù hợp với tên công ty "Forward Email LLC" nhằm đảm bảo tính minh bạch trong kế toán.

Những điều tưởng chừng đơn giản lại trở thành một thảm họa hoàn toàn:

* Kiểm tra ban đầu cho thấy mọi thứ hoạt động bình thường
* Vài giờ sau, PayPal đột nhiên chặn tất cả các khoản thanh toán đăng ký mà không báo trước
* Khách hàng không thể thanh toán, gây nhầm lẫn và gánh nặng hỗ trợ
* Bộ phận hỗ trợ của PayPal đưa ra phản hồi trái chiều, khẳng định tài khoản đã được xác minh
* Chúng tôi buộc phải dừng hoàn toàn các khoản thanh toán qua PayPal

<figure>
<figcaption><div class="alert alert-danger small text-center">
Lỗi mà khách hàng gặp phải khi thanh toán - không có lời giải thích, không có nhật ký, không có gì cả
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Bộ phận hỗ trợ của PayPal khẳng định mọi thứ đều ổn trong khi thanh toán bị lỗi hoàn toàn. Tin nhắn cuối cùng cho thấy họ nói rằng họ đã "khôi phục một số tính năng" nhưng vẫn yêu cầu thêm thông tin không xác định - màn hình hỗ trợ PayPal kinh điển
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
Quá trình xác minh danh tính được cho là "không sửa chữa" được gì
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
Thông báo mơ hồ và vẫn chưa có giải pháp. Không có thông tin, thông báo hay bất cứ thông tin bổ sung nào cần thiết. Bộ phận hỗ trợ khách hàng im lặng.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Tại sao chúng ta không thể bỏ PayPal {#why-we-cant-just-drop-paypal}

Bất chấp tất cả những vấn đề này, chúng tôi không thể hoàn toàn từ bỏ PayPal vì một số khách hàng chỉ sử dụng PayPal làm phương thức thanh toán. Như một khách hàng đã nói trên [trang trạng thái](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515) của chúng tôi:

> PayPal là lựa chọn thanh toán duy nhất của tôi

**Chúng tôi bị mắc kẹt khi hỗ trợ một nền tảng bị lỗi vì PayPal đã tạo ra sự độc quyền thanh toán cho một số người dùng nhất định.**

## Giải pháp thay thế của cộng đồng {#the-community-workaround}

Vì PayPal không cung cấp chức năng liệt kê đăng ký cơ bản, cộng đồng nhà phát triển đã xây dựng các giải pháp thay thế. Chúng tôi đã tạo một tập lệnh giúp quản lý đăng ký PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Tập lệnh này tham chiếu đến [ý chính của cộng đồng](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), nơi các nhà phát triển chia sẻ giải pháp. Người dùng thực ra là [cảm ơn chúng tôi](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) vì đã cung cấp những gì PayPal đáng lẽ phải xây dựng từ nhiều năm trước.

## Đang chặn các mẫu PayPal do lừa đảo {#blocking-paypal-templates-due-to-phishing}

Vấn đề không chỉ nằm ở API. Các mẫu email của PayPal được thiết kế kém đến mức chúng tôi phải triển khai bộ lọc cụ thể trong dịch vụ email của mình vì chúng không thể phân biệt được với các nỗ lực lừa đảo.

### Vấn đề thực sự: Các mẫu của PayPal trông giống như lừa đảo {#the-real-problem-paypals-templates-look-like-scams}

Chúng tôi thường xuyên nhận được báo cáo về các email PayPal trông giống hệt các nỗ lực lừa đảo. Dưới đây là một ví dụ thực tế từ các báo cáo lạm dụng của chúng tôi:

**Chủ đề:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Email này đã được chuyển tiếp đến `abuse@microsoft.com` vì có vẻ như đây là một nỗ lực lừa đảo. Vấn đề là gì? Thực ra, nó đến từ môi trường sandbox của PayPal, nhưng thiết kế mẫu của họ quá kém đến mức kích hoạt hệ thống phát hiện lừa đảo.

### Triển khai của chúng tôi {#our-implementation}

Bạn có thể thấy bộ lọc dành riêng cho PayPal của chúng tôi được triển khai trong [mã lọc email](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Tại sao chúng tôi phải chặn PayPal {#why-we-had-to-block-paypal}

Chúng tôi thực hiện điều này vì PayPal từ chối khắc phục các vấn đề spam/lừa đảo/gian lận nghiêm trọng mặc dù chúng tôi đã nhiều lần báo cáo với nhóm xử lý vi phạm của họ. Các loại email cụ thể mà chúng tôi chặn bao gồm:

* **RT000238** - Thông báo hóa đơn đáng ngờ
* **PPC001017** - Xác nhận thanh toán có vấn đề
* **RT000542** - Nỗ lực hack tin nhắn quà tặng

### Mức độ của vấn đề {#the-scale-of-the-problem}

Nhật ký lọc thư rác của chúng tôi cho thấy khối lượng lớn thư rác hóa đơn PayPal mà chúng tôi xử lý hàng ngày. Ví dụ về các chủ đề bị chặn bao gồm:

* "Hóa đơn từ Nhóm Thanh toán PayPal: Khoản phí này sẽ được tự động trừ vào tài khoản của bạn. Vui lòng liên hệ ngay với chúng tôi theo số \[ĐIỆN THOẠI]"
* "Hóa đơn từ \[TÊN CÔNG TY] (\[MÃ ĐƠN HÀNG])"
* Nhiều biến thể với số điện thoại khác nhau và mã đơn hàng giả

Những email này thường đến từ các máy chủ `outlook.com` nhưng dường như xuất phát từ các hệ thống hợp pháp của PayPal, khiến chúng đặc biệt nguy hiểm. Các email này vượt qua được xác thực SPF, DKIM và DMARC vì chúng được gửi qua cơ sở hạ tầng thực tế của PayPal.

Nhật ký kỹ thuật của chúng tôi cho thấy những email rác này chứa tiêu đề PayPal hợp pháp:

* `X-Email-Type-Id: RT000238` (cùng ID chúng tôi chặn)
* `From: "service@paypal.com" <service@paypal.com>`
* Chữ ký DKIM hợp lệ từ `paypal.com`
* Bản ghi SPF phù hợp hiển thị máy chủ thư của PayPal

Điều này tạo ra một tình huống không thể xảy ra: cả email PayPal hợp pháp và thư rác đều có đặc điểm kỹ thuật giống hệt nhau.

### Sự trớ trêu {#the-irony}

PayPal, một công ty đáng lẽ phải đi đầu trong cuộc chiến chống gian lận tài chính, lại có các mẫu email được thiết kế kém đến mức kích hoạt hệ thống chống lừa đảo. Chúng tôi buộc phải chặn các email PayPal hợp lệ vì chúng không thể phân biệt được với lừa đảo.

Điều này được ghi lại trong nghiên cứu bảo mật: [Hãy cẩn thận với lừa đảo địa chỉ mới của PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - cho thấy hệ thống của PayPal bị khai thác để gian lận như thế nào.

### Tác động thực tế: Các vụ lừa đảo PayPal mới {#real-world-impact-novel-paypal-scams}

Vấn đề không chỉ nằm ở thiết kế mẫu kém. Hệ thống hóa đơn của PayPal dễ bị khai thác đến mức kẻ lừa đảo thường xuyên lợi dụng nó để gửi các hóa đơn giả mạo trông có vẻ hợp lệ. Nhà nghiên cứu bảo mật Gavin Anderegg đã ghi nhận trường hợp [Một trò lừa đảo mới của PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), trong đó kẻ lừa đảo gửi hóa đơn PayPal thật vượt qua mọi bước kiểm tra xác thực:

> "Kiểm tra nguồn gốc, email trông giống như được gửi từ PayPal (SPF, DKIM và DMARC đều vượt qua). Nút này cũng liên kết đến một URL trông giống như URL PayPal hợp lệ... Phải mất một giây tôi mới nhận ra đó là email hợp lệ. Tôi vừa nhận được một 'hóa đơn' ngẫu nhiên từ một kẻ lừa đảo."

<figure>
<figcaption><div class="alert alert-danger small text-center">
Ảnh chụp màn hình cho thấy nhiều hóa đơn PayPal gian lận đang tràn ngập hộp thư đến, tất cả đều có vẻ hợp lệ vì thực chất chúng đến từ hệ thống của PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Nhà nghiên cứu lưu ý:

> "Có vẻ như đây cũng là một tính năng tiện lợi mà PayPal nên cân nhắc khóa lại. Tôi ngay lập tức cho rằng đây là một hình thức lừa đảo và chỉ quan tâm đến các chi tiết kỹ thuật. Việc này có vẻ quá dễ dàng, và tôi lo rằng những người khác có thể mắc bẫy."

Điều này minh họa rõ ràng vấn đề: Hệ thống hợp pháp của PayPal được thiết kế rất kém đến mức tạo điều kiện cho gian lận xảy ra đồng thời khiến các giao tiếp hợp pháp trở nên đáng ngờ.

Tệ hơn nữa, điều này ảnh hưởng đến khả năng phân phối của chúng tôi tới Yahoo, khiến khách hàng phàn nàn và mất nhiều giờ thử nghiệm và kiểm tra mẫu tỉ mỉ.

## Quy trình KYC ngược của PayPal {#paypals-backwards-kyc-process}

Một trong những khía cạnh gây khó chịu nhất của nền tảng PayPal là cách tiếp cận lạc hậu của họ đối với quy trình tuân thủ và quy trình Hiểu biết Khách hàng (KYC). Không giống như mọi bộ xử lý thanh toán khác, PayPal cho phép các nhà phát triển tích hợp API của họ và bắt đầu thu tiền trong quá trình sản xuất trước khi hoàn tất xác minh đúng cách.

### Cách thức hoạt động {#how-it-should-work}

Mọi bộ xử lý thanh toán hợp pháp đều tuân theo trình tự logic sau:

1. **Hoàn tất xác minh KYC trước**
2. **Phê duyệt tài khoản người bán**
3. **Cung cấp quyền truy cập API sản xuất**
4. **Cho phép thu tiền**

Điều này bảo vệ cả bên xử lý thanh toán và bên bán bằng cách đảm bảo tuân thủ trước khi giao dịch.

### PayPal thực sự hoạt động như thế nào {#how-paypal-actually-works}

Quy trình của PayPal hoàn toàn ngược lại:

1. **Cung cấp quyền truy cập API sản xuất ngay lập tức**
2. **Cho phép thu tiền trong nhiều giờ hoặc nhiều ngày**
3. **Đột ngột chặn thanh toán mà không cần thông báo trước**
4. **Yêu cầu cung cấp tài liệu KYC sau khi khách hàng đã bị ảnh hưởng**
5. **Không thông báo cho người bán**
6. **Cho phép khách hàng tự phát hiện sự cố và báo cáo**

### Tác động thực tế {#the-real-world-impact}

Quá trình ngược này gây ra thảm họa cho doanh nghiệp:

* **Khách hàng không thể hoàn tất giao dịch mua** trong thời gian cao điểm bán hàng
* **Không có cảnh báo trước** về việc cần xác minh
* **Không có thông báo qua email** khi thanh toán bị chặn
* **Nhà cung cấp biết được sự cố từ khách hàng đang bối rối**
* **Mất doanh thu** trong thời gian kinh doanh quan trọng
* **Niềm tin của khách hàng bị tổn hại** khi thanh toán không thành công một cách bí ẩn

### Thảm họa di chuyển tài khoản tháng 7 năm 2025 {#the-july-2025-account-migration-disaster}

Tình huống chính xác này đã xảy ra trong quá trình di chuyển tài khoản định kỳ của chúng tôi vào tháng 7 năm 2025. Ban đầu, PayPal cho phép thanh toán, nhưng sau đó đột nhiên chặn mà không hề thông báo. Chúng tôi chỉ phát hiện ra vấn đề khi khách hàng bắt đầu báo cáo rằng họ không thể thanh toán.

Khi liên hệ với bộ phận hỗ trợ, chúng tôi nhận được những phản hồi trái chiều về các tài liệu cần thiết, không có thời hạn giải quyết rõ ràng. Điều này buộc chúng tôi phải tạm dừng hoàn toàn việc thanh toán qua PayPal, gây hoang mang cho khách hàng vì họ không có lựa chọn thanh toán nào khác.

### Tại sao điều này quan trọng {#why-this-matters}

Cách tiếp cận tuân thủ của PayPal cho thấy sự hiểu lầm cơ bản về cách thức hoạt động của doanh nghiệp. KYC đúng cách nên được thực hiện **trước** khi tích hợp sản xuất, chứ không phải sau khi khách hàng đã cố gắng thanh toán. Việc thiếu giao tiếp chủ động khi phát sinh vấn đề cho thấy PayPal không đáp ứng được nhu cầu của người bán.

Quá trình ngược này là triệu chứng của các vấn đề tổ chức rộng hơn của PayPal: họ ưu tiên các quy trình nội bộ hơn trải nghiệm của người bán và khách hàng, dẫn đến những thảm họa hoạt động khiến doanh nghiệp tránh xa nền tảng của họ.

## Cách thức hoạt động đúng đắn của từng bộ xử lý thanh toán khác {#how-every-other-payment-processor-does-it-right}

Chức năng liệt kê đăng ký mà PayPal từ chối triển khai đã trở thành tiêu chuẩn trong ngành trong hơn một thập kỷ. Sau đây là cách các bộ xử lý thanh toán khác xử lý yêu cầu cơ bản này:

### Sọc {#stripe}

Stripe đã có danh sách đăng ký kể từ khi API của họ ra mắt. Tài liệu hướng dẫn của họ trình bày rõ ràng cách lấy tất cả các đăng ký cho tài khoản khách hàng hoặc tài khoản thương gia. Đây được coi là chức năng CRUD cơ bản.

### Mái chèo {#paddle}

Paddle cung cấp các API quản lý đăng ký toàn diện, bao gồm danh sách, lọc và phân trang. Họ hiểu rằng các nhà bán hàng cần theo dõi các luồng doanh thu định kỳ của mình.

### Coinbase Commerce {#coinbase-commerce}

Ngay cả các bộ xử lý thanh toán bằng tiền điện tử như Coinbase Commerce cũng cung cấp dịch vụ quản lý đăng ký tốt hơn PayPal.

### Hình vuông {#square}

API của Square bao gồm danh sách đăng ký như một tính năng cơ bản, không phải là tính năng bổ sung.

### Tiêu chuẩn công nghiệp {#the-industry-standard}

Mọi bộ xử lý thanh toán hiện đại đều cung cấp:

* Liệt kê tất cả các đăng ký
* Lọc theo trạng thái, ngày tháng, khách hàng
* Phân trang cho các tập dữ liệu lớn
* Thông báo webhook về các thay đổi đăng ký
* Tài liệu toàn diện với các ví dụ thực tế

### Các bộ xử lý khác cung cấp gì so với PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Liệt kê tất cả các đăng ký:**

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

**Stripe - Lọc theo Khách hàng:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Sọc - Lọc theo Trạng thái:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Những gì bạn thực sự nhận được:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**Các điểm cuối khả dụng của PayPal:**

* `POST /v1/billing/subscriptions` - Tạo đăng ký
* `GET /v1/billing/subscriptions/{id}` - Nhận MỘT đăng ký (nếu bạn biết ID)
* `PATCH /v1/billing/subscriptions/{id}` - Cập nhật đăng ký
* `POST /v1/billing/subscriptions/{id}/cancel` - Hủy đăng ký
* `POST /v1/billing/subscriptions/{id}/suspend` - Tạm dừng đăng ký

**Những gì còn thiếu trong PayPal:**

* ❌ Không có `GET /v1/billing/subscriptions` (liệt kê tất cả)
* ❌ Không có chức năng tìm kiếm
* ❌ Không lọc theo trạng thái, khách hàng, ngày tháng
* ❌ Không hỗ trợ phân trang

PayPal là bộ xử lý thanh toán lớn duy nhất buộc các nhà phát triển phải theo dõi thủ công ID đăng ký trong cơ sở dữ liệu của riêng họ.

## Sự che đậy có hệ thống của PayPal: Làm im lặng 6 triệu tiếng nói {#paypals-systematic-cover-up-silencing-6-million-voices}

Trong một động thái thể hiện hoàn hảo cách tiếp cận của PayPal trong việc xử lý những lời chỉ trích, gần đây họ đã tắt toàn bộ diễn đàn cộng đồng của mình, khiến hơn 6 triệu thành viên im lặng và xóa hàng trăm nghìn bài đăng ghi lại những thất bại của họ.

### Sự xóa sổ vĩ đại {#the-great-erasure}

Cộng đồng PayPal ban đầu tại `paypal-community.com` đã lưu trữ **6.003.558 thành viên** và chứa hàng trăm nghìn bài đăng, báo cáo lỗi, khiếu nại và thảo luận về các lỗi API của PayPal. Điều này đại diện cho hơn một thập kỷ bằng chứng được ghi nhận về các vấn đề mang tính hệ thống của PayPal.

Vào ngày 30 tháng 6 năm 2025, PayPal đã lặng lẽ đưa toàn bộ diễn đàn ngoại tuyến. Tất cả các liên kết `paypal-community.com` hiện trả về lỗi 404. Đây không phải là bản cập nhật hay nâng cấp.

### Giải cứu bên thứ ba {#the-third-party-rescue}

May mắn thay, một dịch vụ của bên thứ ba tại [ppl.lithium.com](https://ppl.lithium.com/) đã lưu giữ một số nội dung, cho phép chúng tôi truy cập các cuộc thảo luận mà PayPal đã cố gắng ẩn. Tuy nhiên, việc lưu giữ của bên thứ ba này chưa hoàn chỉnh và có thể biến mất bất cứ lúc nào.

Mô hình che giấu bằng chứng này không phải là mới đối với PayPal. Họ có lịch sử được ghi nhận về:

* Xóa các báo cáo lỗi nghiêm trọng khỏi chế độ xem công khai
* Ngừng cung cấp các công cụ dành cho nhà phát triển mà không báo trước
* Thay đổi API mà không có tài liệu hướng dẫn phù hợp
* Làm im lặng các cuộc thảo luận của cộng đồng về những lỗi của họ

Việc gỡ bỏ diễn đàn này là nỗ lực trắng trợn nhất từ trước đến nay nhằm che giấu những thất bại có hệ thống của họ khỏi sự giám sát của công chúng.

## Thảm họa bắt bọ kéo dài 11 năm: 1.899 đô la và vẫn tiếp tục tăng {#the-11-year-capture-bug-disaster-1899-and-counting}

Trong khi PayPal bận rộn tổ chức các buổi phản hồi và đưa ra lời hứa, hệ thống xử lý thanh toán cốt lõi của họ đã bị hỏng hoàn toàn trong hơn 11 năm. Bằng chứng thật tàn khốc.

### Chuyển tiếp email mất 1.899 đô la {#forward-emails-1899-loss}

Trong hệ thống sản xuất của chúng tôi, chúng tôi đã phát hiện 108 khoản thanh toán PayPal với tổng giá trị **$1.899** bị mất do lỗi xử lý của PayPal. Các khoản thanh toán này cho thấy một mô hình nhất quán:

* Đã nhận được `CHECKOUT.ORDER.APPROVED` webhooks
* API thu thập của PayPal trả về lỗi 404
* Không thể truy cập đơn hàng thông qua API của PayPal

Không thể xác định liệu khách hàng có bị tính phí hay không vì PayPal ẩn hoàn toàn nhật ký gỡ lỗi sau 14 ngày và xóa toàn bộ dữ liệu khỏi bảng điều khiển đối với ID đơn hàng không được ghi lại.

Con số này chỉ đại diện cho một doanh nghiệp. **Tổng thiệt hại của hàng nghìn thương gia trong hơn 11 năm qua có thể lên tới hàng triệu đô la.**

**Chúng tôi xin nhắc lại một lần nữa: tổng số tiền thua lỗ của hàng nghìn thương gia trong hơn 11 năm qua có thể lên tới hàng triệu đô la.**

Lý do duy nhất khiến chúng tôi phát hiện ra điều này là vì chúng tôi cực kỳ tỉ mỉ và dựa trên dữ liệu.

### Báo cáo gốc năm 2013: Hơn 11 năm bất cẩn {#the-2013-original-report-11-years-of-negligence}

Báo cáo được ghi chép sớm nhất về vấn đề này xuất hiện trên [Stack Overflow vào tháng 11 năm 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([đã lưu trữ](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Tiếp tục nhận được Lỗi 404 với Rest API khi thực hiện chụp"

Lỗi được báo cáo vào năm 2013 **giống hệt** lỗi mà Forward Email gặp phải vào năm 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Phản ứng của cộng đồng vào năm 2013 cho thấy:

> "Hiện tại đang có báo cáo về sự cố liên quan đến REST API. PayPal đang xử lý sự cố này."

**Hơn 11 năm sau, họ vẫn đang "xử lý vấn đề đó".**

### Bản ghi nhớ năm 2016: PayPal phá vỡ SDK của chính họ {#the-2016-admission-paypal-breaks-their-own-sdk}

Năm 2016, kho lưu trữ GitHub của PayPal đã ghi nhận lỗi [thất bại bắt giữ hàng loạt](https://github.com/paypal/PayPal-PHP-SDK/issues/660) ảnh hưởng đến SDK PHP chính thức của họ. Quy mô của lỗi này thật đáng kinh ngạc:

> "Kể từ ngày 20/9/2016, tất cả các nỗ lực thu thập thông tin PayPal đều không thành công với lỗi 'INVALID_RESOURCE_ID - Không tìm thấy ID tài nguyên được yêu cầu.'. Không có thay đổi nào trong quá trình tích hợp API từ ngày 19/9 đến ngày 20/9. **100% các nỗ lực thu thập thông tin kể từ ngày 20/9 đều trả về lỗi này.**"

Một thương gia đã báo cáo:

> "Tôi đã có **hơn 1.400 lần chụp không thành công trong 24 giờ qua**, tất cả đều có phản hồi lỗi INVALID_RESOURCE_ID."

Phản ứng ban đầu của PayPal là đổ lỗi cho nhà cung cấp và chuyển họ đến bộ phận hỗ trợ kỹ thuật. Chỉ sau khi chịu áp lực lớn, họ mới thừa nhận lỗi:

> "Tôi có thông tin cập nhật từ các Nhà phát triển Sản phẩm của chúng tôi. Họ nhận thấy trong các tiêu đề đang được gửi đi, PayPal-Request-ID được gửi đi với 42 ký tự, nhưng **có vẻ như một thay đổi gần đây đã diễn ra, giới hạn ID này chỉ còn 38 ký tự.**"

Lời thừa nhận này cho thấy sự tắc trách có hệ thống của PayPal:

1. **Họ đã thực hiện những thay đổi vi phạm không được ghi chép**
2. **Họ đã phá hỏng SDK chính thức của mình**
3. **Họ đổ lỗi cho các nhà cung cấp trước**
4. **Họ chỉ thừa nhận lỗi khi bị áp lực**

Ngay cả sau khi "sửa" được vấn đề, các thương gia vẫn báo cáo:

> "Đã nâng cấp SDK lên phiên bản 1.7.4 và **vấn đề vẫn xảy ra.**"

### Sự leo thang năm 2024: Vẫn chưa hoàn thành {#the-2024-escalation-still-broken}

Các báo cáo gần đây từ Cộng đồng PayPal được bảo tồn cho thấy vấn đề thực sự đã trở nên nghiêm trọng hơn. [Thảo luận tháng 9 năm 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([đã lưu trữ](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) ghi lại chính xác những vấn đề tương tự:

> "Vấn đề này chỉ mới bắt đầu xuất hiện khoảng 2 tuần trước và không ảnh hưởng đến tất cả các đơn hàng. **Lỗi phổ biến hơn có vẻ là lỗi 404 khi chụp.**"

Người bán hàng mô tả cùng một mô hình mà Forward Email đã trải qua:

> "Sau khi cố gắng nắm bắt đơn hàng, PayPal trả về lỗi 404. Khi truy xuất Chi tiết đơn hàng: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Điều này không cho thấy bất kỳ dấu hiệu nắm bắt thành công nào từ phía chúng tôi.**"

### Thảm họa về độ tin cậy của Webhook {#the-webhook-reliability-disaster}

Một [thảo luận cộng đồng được bảo tồn](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) khác cho thấy hệ thống webhook của PayPal về cơ bản là không đáng tin cậy:

> "Về mặt lý thuyết, sự kiện Webhook phải có hai sự kiện (CHECKOUT.ORDER.APPROVED và PAYMENT.CAPTURE.COMPLETED). Trên thực tế, **hai sự kiện này hiếm khi được nhận ngay lập tức, PAYMENT.CAPTURE.COMPLETED hầu như không thể nhận được hoặc sẽ được nhận trong vài giờ.**"

Đối với thanh toán đăng ký:

> "**'THANH TOÁN.BÁN HÀNG.ĐÃ HOÀN THÀNH' đôi khi không nhận được hoặc phải mất vài giờ sau mới nhận được.**"

Câu hỏi của người bán hàng cho thấy mức độ nghiêm trọng của các vấn đề về độ tin cậy của PayPal:

1. **"Tại sao điều này lại xảy ra?"** - Hệ thống webhook của PayPal bị lỗi cơ bản.
2. **"Nếu trạng thái đơn hàng là 'ĐÃ HOÀN THÀNH', tôi có thể coi như đã nhận được tiền không?"** - Người bán không thể tin tưởng phản hồi API của PayPal.
3. **"Tại sao 'Nhật ký sự kiện->Sự kiện Webhook' không tìm thấy bất kỳ nhật ký nào?"** - Ngay cả hệ thống ghi nhật ký của PayPal cũng không hoạt động

### Mô hình của sự cẩu thả có hệ thống {#the-pattern-of-systematic-negligence}

Bằng chứng kéo dài hơn 11 năm và cho thấy một mô hình rõ ràng:

* **2013**: "PayPal đang xử lý"
* **2016**: PayPal thừa nhận lỗi thay đổi, cung cấp bản sửa lỗi
* **2024**: Vẫn xảy ra lỗi tương tự, ảnh hưởng đến Forward Email và vô số lỗi khác

Đây không phải là lỗi - **đây là sự cẩu thả có hệ thống.** PayPal đã biết về những lỗi xử lý thanh toán quan trọng này trong hơn một thập kỷ và luôn:

1. **Đổ lỗi cho các nhà cung cấp về lỗi của PayPal**
2. **Thực hiện các thay đổi không được ghi chép rõ ràng**
3. **Cung cấp các bản sửa lỗi không đầy đủ và không hiệu quả**
4. **Bỏ qua tác động tài chính đối với doanh nghiệp**
5. **Ẩn bằng chứng bằng cách xóa bỏ các diễn đàn cộng đồng**

### Yêu cầu không có tài liệu {#the-undocumented-requirement}

Không có chỗ nào trong tài liệu chính thức của PayPal đề cập đến việc người bán phải triển khai logic thử lại cho các thao tác thu thập. Tài liệu của họ quy định người bán phải "thu thập ngay sau khi phê duyệt", nhưng lại không đề cập đến việc API của họ ngẫu nhiên trả về lỗi 404, đòi hỏi cơ chế thử lại phức tạp.

Điều này buộc mọi thương gia phải:

* Triển khai logic thử lại theo cấp số nhân
* Xử lý việc phân phối webhook không nhất quán
* Xây dựng hệ thống quản lý trạng thái phức tạp
* Theo dõi thủ công các lần chụp không thành công

**Mọi bộ xử lý thanh toán khác đều cung cấp API thu thập dữ liệu đáng tin cậy có thể hoạt động ngay lần đầu tiên.**

## Mô hình lừa đảo rộng hơn của PayPal {#paypals-broader-pattern-of-deception}

Thảm họa bắt lỗi chỉ là một ví dụ về cách tiếp cận có hệ thống của PayPal nhằm lừa dối khách hàng và che giấu những thất bại của họ.

### Hành động của Sở Dịch vụ Tài chính New York {#the-new-york-department-of-financial-services-action}

Vào tháng 1 năm 2025, Sở Dịch vụ Tài chính New York đã ban hành [hành động thực thi chống lại PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) về các hành vi lừa đảo, chứng minh rằng mô hình lừa đảo của PayPal không chỉ giới hạn ở API của họ.

Hành động quản lý này cho thấy PayPal sẵn sàng thực hiện các hành vi lừa đảo trên toàn bộ doanh nghiệp của họ, không chỉ riêng các công cụ dành cho nhà phát triển.

### Vụ kiện Honey: Viết lại các liên kết liên kết {#the-honey-lawsuit-rewriting-affiliate-links}

Việc PayPal mua lại Honey đã dẫn đến [các vụ kiện cáo buộc Honey viết lại các liên kết liên kết](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), đánh cắp hoa hồng từ các nhà sáng tạo nội dung và người có sức ảnh hưởng. Đây là một hình thức lừa đảo có hệ thống khác, trong đó PayPal kiếm lời bằng cách chuyển hướng doanh thu đáng lẽ phải thuộc về người khác.

Mô hình này rất rõ ràng:

1. **Lỗi API**: Ẩn chức năng bị lỗi, đổ lỗi cho nhà bán hàng
2. **Làm im lặng cộng đồng**: Xóa bằng chứng về sự cố
3. **Vi phạm quy định**: Thực hiện các hành vi lừa đảo
4. **Trộm cắp liên kết**: Ăn cắp hoa hồng thông qua thao túng kỹ thuật

### Cái giá phải trả cho sự bất cẩn của PayPal {#the-cost-of-paypals-negligence}

Khoản lỗ 1.899 đô la của Forward Email chỉ là phần nổi của tảng băng chìm. Hãy xem xét tác động rộng hơn:

* **Các thương gia cá nhân**: Hàng ngàn người mất từ hàng trăm đến hàng ngàn đô la mỗi người
* **Khách hàng doanh nghiệp**: Có khả năng mất hàng triệu đô la doanh thu
* **Thời gian của nhà phát triển**: Vô số giờ xây dựng giải pháp khắc phục sự cố API bị lỗi của PayPal
* **Niềm tin của khách hàng**: Các doanh nghiệp mất khách hàng do lỗi thanh toán của PayPal

Nếu một dịch vụ email nhỏ mất gần 2.000 đô la và vấn đề này đã tồn tại trong hơn 11 năm, ảnh hưởng đến hàng nghìn thương gia, thì tổng thiệt hại tài chính có thể lên tới **hàng trăm triệu đô la**.

### Tài liệu nằm {#the-documentation-lie}

Tài liệu chính thức của PayPal thường không đề cập đến những hạn chế và lỗi quan trọng mà người bán sẽ gặp phải. Ví dụ:

* **API Capture**: Không đề cập đến việc lỗi 404 thường gặp và cần logic thử lại
* **Độ tin cậy của webhook**: Không đề cập đến việc webhook thường bị trễ hàng giờ
* **Danh sách đăng ký**: Tài liệu cho thấy việc liệt kê có thể thực hiện được khi không có điểm cuối nào tồn tại
* **Hết thời gian phiên**: Không đề cập đến việc hết thời gian 60 giây

Việc bỏ sót thông tin quan trọng một cách có hệ thống này buộc các thương gia phải khám phá ra những hạn chế của PayPal thông qua quá trình thử nghiệm trong hệ thống sản xuất, thường dẫn đến tổn thất tài chính.

## Điều này có ý nghĩa gì đối với nhà phát triển {#what-this-means-for-developers}

Việc PayPal không đáp ứng được nhu cầu cơ bản của nhà phát triển một cách có hệ thống trong khi vẫn thu thập phản hồi rộng rãi cho thấy một vấn đề cốt lõi trong tổ chức. Họ coi việc thu thập phản hồi như một giải pháp thay thế cho việc thực sự khắc phục sự cố.

Mô hình này rất rõ ràng:

1. Các nhà phát triển báo cáo vấn đề
2. PayPal tổ chức các buổi phản hồi với ban điều hành
3. Phản hồi được cung cấp rộng rãi
4. Các nhóm thừa nhận những thiếu sót và hứa sẽ "theo dõi và giải quyết"
5. Không có gì được triển khai
6. Các giám đốc điều hành rời đi để tìm kiếm công ty tốt hơn
7. Các nhóm mới yêu cầu phản hồi tương tự
8. Chu kỳ lặp lại

Trong khi đó, các nhà phát triển buộc phải xây dựng các giải pháp thay thế, đánh đổi bảo mật và xử lý giao diện người dùng bị hỏng chỉ để chấp nhận thanh toán.

Nếu bạn đang xây dựng một hệ thống thanh toán, hãy học hỏi từ kinh nghiệm của chúng tôi: xây dựng [cách tiếp cận ba bên](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) với nhiều bộ xử lý, nhưng đừng mong đợi PayPal cung cấp các chức năng cơ bản bạn cần. Hãy lên kế hoạch xây dựng các giải pháp thay thế ngay từ ngày đầu.

> Bài viết này ghi lại 11 năm kinh nghiệm của chúng tôi với API PayPal tại Forward Email. Tất cả các ví dụ mã và liên kết đều được lấy từ hệ thống sản xuất thực tế của chúng tôi. Chúng tôi vẫn tiếp tục hỗ trợ thanh toán PayPal bất chấp những vấn đề này vì một số khách hàng không có lựa chọn nào khác.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />