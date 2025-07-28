# Một thập kỷ tác động: Cách các gói npm của chúng tôi đạt 1 tỷ lượt tải xuống và định hình JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="" class="rounded-lg" />

## Mục lục {#table-of-contents}

* [Lời nói đầu](#foreword)
* [Những Người Tiên Phong Tin Tưởng Chúng Tôi: Isaac Z. Schlueter và Email Chuyển Tiếp](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Từ sự sáng tạo của npm đến sự lãnh đạo của Node.js](#from-npms-creation-to-nodejs-leadership)
* [Kiến trúc sư đằng sau mã lệnh: Hành trình của Nick Baugh](#the-architect-behind-the-code-nick-baughs-journey)
  * [Ủy ban kỹ thuật Express và những đóng góp cốt lõi](#express-technical-committee-and-core-contributions)
  * [Đóng góp của Koa Framework](#koa-framework-contributions)
  * [Từ Người đóng góp cá nhân đến Lãnh đạo tổ chức](#from-individual-contributor-to-organization-leader)
* [Các tổ chức GitHub của chúng tôi: Hệ sinh thái đổi mới](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Ghi nhật ký có cấu trúc cho các ứng dụng hiện đại](#cabin-structured-logging-for-modern-applications)
  * [Máy quét thư rác: Chống lạm dụng email](#spam-scanner-fighting-email-abuse)
  * [Bree: Lên lịch công việc hiện đại với luồng công việc](#bree-modern-job-scheduling-with-worker-threads)
  * [Chuyển tiếp Email: Cơ sở hạ tầng Email nguồn mở](#forward-email-open-source-email-infrastructure)
  * [Lad: Tiện ích và công cụ thiết yếu của Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Giám sát thời gian hoạt động nguồn mở](#upptime-open-source-uptime-monitoring)
* [Những đóng góp của chúng tôi cho hệ sinh thái email chuyển tiếp](#our-contributions-to-the-forward-email-ecosystem)
  * [Từ Gói đến Sản xuất](#from-packages-to-production)
  * [Vòng phản hồi](#the-feedback-loop)
* [Nguyên tắc cốt lõi của Forward Email: Nền tảng cho sự xuất sắc](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Luôn thân thiện với nhà phát triển, tập trung vào bảo mật và minh bạch](#always-developer-friendly-security-focused-and-transparent)
  * [Tuân thủ các nguyên tắc phát triển phần mềm đã được kiểm tra theo thời gian](#adherence-to-time-tested-software-development-principles)
  * [Nhắm mục tiêu vào nhà phát triển Scrappy, Bootstrapped](#targeting-the-scrappy-bootstrapped-developer)
  * [Nguyên tắc trong thực tế: Cơ sở dữ liệu mã email chuyển tiếp](#principles-in-practice-the-forward-email-codebase)
  * [Quyền riêng tư theo thiết kế](#privacy-by-design)
  * [Nguồn mở bền vững](#sustainable-open-source)
* [Những con số không biết nói dối: Thống kê tải xuống npm đáng kinh ngạc của chúng tôi](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Góc nhìn từ trên cao về tác động của chúng tôi](#a-birds-eye-view-of-our-impact)
  * [Tác động hàng ngày ở quy mô lớn](#daily-impact-at-scale)
  * [Vượt ra ngoài những con số thô](#beyond-the-raw-numbers)
* [Hỗ trợ hệ sinh thái: Tài trợ nguồn mở của chúng tôi](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Người tiên phong về cơ sở hạ tầng email](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Bậc thầy gói tiện ích](#sindre-sorhus-utility-package-mastermind)
* [Phát hiện lỗ hổng bảo mật trong hệ sinh thái JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Cuộc giải cứu Koa-Router](#the-koa-router-rescue)
  * [Xử lý lỗ hổng ReDoS](#addressing-redos-vulnerabilities)
  * [Ủng hộ cho Node.js và Chromium Security](#advocating-for-nodejs-and-chromium-security)
  * [Bảo mật cơ sở hạ tầng npm](#securing-npm-infrastructure)
* [Những đóng góp của chúng tôi cho hệ sinh thái email chuyển tiếp](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Nâng cao chức năng cốt lõi của Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Nâng cao xác thực email với Mailauth](#advancing-email-authentication-with-mailauth)
  * [Cải tiến chính về thời gian hoạt động](#key-upptime-enhancements)
* [Chất keo gắn kết tất cả lại với nhau: Mã tùy chỉnh ở quy mô lớn](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Một nỗ lực phát triển lớn](#a-massive-development-effort)
  * [Tích hợp phụ thuộc cốt lõi](#core-dependencies-integration)
  * [Cơ sở hạ tầng DNS với Tangerine và mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Tác động của doanh nghiệp: Từ nguồn mở đến các giải pháp quan trọng](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Các nghiên cứu điển hình về cơ sở hạ tầng email quan trọng](#case-studies-in-mission-critical-email-infrastructure)
* [Một thập kỷ của nguồn mở: Nhìn về phía trước](#a-decade-of-open-source-looking-forward)

## Lời nói đầu {#foreword}

Trong thế giới [JavaScript](https://en.wikipedia.org/wiki/JavaScript) và [Node.js](https://en.wikipedia.org/wiki/Node.js), một số gói phần mềm đóng vai trò thiết yếu—được tải xuống hàng triệu lần mỗi ngày và hỗ trợ các ứng dụng trên toàn thế giới. Đằng sau những công cụ này là đội ngũ phát triển luôn chú trọng đến chất lượng mã nguồn mở. Hôm nay, chúng tôi sẽ giới thiệu cách đội ngũ của mình hỗ trợ xây dựng và duy trì các gói npm, vốn đã trở thành những thành phần quan trọng của hệ sinh thái JavaScript.

## Những người tiên phong tin tưởng chúng tôi: Isaac Z. Schlueter và Email chuyển tiếp {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Chúng tôi tự hào có người dùng [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)). Isaac đã tạo ra [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) và góp phần xây dựng [Node.js](https://en.wikipedia.org/wiki/Node.js). Sự tin tưởng của anh ấy vào Forward Email cho thấy chúng tôi luôn chú trọng đến chất lượng và bảo mật. Isaac sử dụng Forward Email cho một số tên miền, bao gồm cả izs.me.

Tác động của Isaac đối với JavaScript là rất lớn. Năm 2009, anh là một trong những người đầu tiên nhìn thấy tiềm năng của Node.js, khi làm việc với [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), người đã tạo ra nền tảng này. Như Isaac đã nói trong một [phỏng vấn với tạp chí Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "Giữa một cộng đồng rất nhỏ gồm một nhóm người đang cố gắng tìm cách hiện thực hóa JS phía máy chủ, Ryan Dahl đã tạo ra Node, một hướng đi rõ ràng là đúng đắn. Tôi đã tham gia vào đó và bắt đầu tham gia rất tích cực vào khoảng giữa năm 2009."

> \[!NOTE]
> For those interested in the history of Node.js, there are excellent documentaries available that chronicle its development, including [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) and [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahl's [personal website](https://tinyclouds.org/) also contains valuable insights into his work.

### Từ khi thành lập npm đến khi trở thành người dẫn đầu Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac đã tạo ra npm vào tháng 9 năm 2009, với phiên bản khả dụng đầu tiên được phát hành vào đầu năm 2010. Trình quản lý gói này đã đáp ứng một nhu cầu quan trọng trong Node.js, cho phép các nhà phát triển dễ dàng chia sẻ và tái sử dụng mã. Theo [Trang Wikipedia Node.js](https://en.wikipedia.org/wiki/Node.js), "Vào tháng 1 năm 2010, một trình quản lý gói được giới thiệu cho môi trường Node.js có tên là npm. Trình quản lý gói này cho phép các lập trình viên xuất bản và chia sẻ các gói Node.js, cùng với mã nguồn đi kèm, và được thiết kế để đơn giản hóa việc cài đặt, cập nhật và gỡ cài đặt các gói."

Khi Ryan Dahl rời khỏi Node.js vào tháng 1 năm 2012, Isaac đã tiếp quản vị trí trưởng dự án. Như đã ghi chú trong [tóm tắt của anh ấy](https://izs.me/resume), anh ấy "đã dẫn dắt việc phát triển một số API cốt lõi cơ bản của Node.js, bao gồm hệ thống mô-đun CommonJS, API hệ thống tệp và luồng" và "đóng vai trò là BDFL (Nhà độc tài nhân từ trọn đời) của dự án trong 2 năm, đảm bảo chất lượng ngày càng cao và quy trình xây dựng đáng tin cậy cho Node.js phiên bản v0.6 đến v0.10."

Isaac đã hướng dẫn Node.js qua một giai đoạn tăng trưởng quan trọng, thiết lập các tiêu chuẩn vẫn định hình nền tảng này cho đến ngày nay. Sau đó, anh ấy đã thành lập npm, Inc. vào năm 2014 để hỗ trợ sổ đăng ký npm, nơi anh ấy đã tự mình điều hành trước đây.

Chúng tôi cảm ơn Isaac vì những đóng góp to lớn của anh cho JavaScript và tiếp tục sử dụng nhiều gói anh đã tạo ra. Công trình của anh đã thay đổi cách chúng ta xây dựng phần mềm và cách hàng triệu nhà phát triển chia sẻ mã trên toàn thế giới.

## Kiến trúc sư đằng sau mã: Hành trình của Nick Baugh {#the-architect-behind-the-code-nick-baughs-journey}

Trọng tâm thành công của mã nguồn mở của chúng tôi là Nick Baugh, người sáng lập và chủ sở hữu của Forward Email. Công việc của ông trong JavaScript kéo dài gần 20 năm và đã định hình cách vô số nhà phát triển xây dựng ứng dụng. Hành trình mã nguồn mở của ông cho thấy cả kỹ năng kỹ thuật và khả năng lãnh đạo cộng đồng.

### Ủy ban Kỹ thuật Express và Đóng góp Cốt lõi {#express-technical-committee-and-core-contributions}

Chuyên môn về framework web của Nick đã giúp anh có được một vị trí trong [Ủy ban Kỹ thuật Express](https://expressjs.com/en/resources/community.html), nơi anh đã hỗ trợ một trong những framework Node.js được sử dụng nhiều nhất. Nick hiện được liệt kê là thành viên không hoạt động trên [Trang cộng đồng Express](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express was originally created by TJ Holowaychuk, a prolific open source contributor who has shaped much of the Node.js ecosystem. We're grateful for TJ's foundational work and respect his [decision to take a break](https://news.ycombinator.com/item?id=37687017) from his extensive open source contributions.

Là thành viên của [Ủy ban Kỹ thuật Express](https://expressjs.com/en/resources/community.html), Nick rất chú trọng đến từng chi tiết trong các vấn đề như làm rõ tài liệu `req.originalUrl` và khắc phục sự cố xử lý biểu mẫu nhiều phần.

### Đóng góp cho Khung Koa {#koa-framework-contributions}

Công việc của Nick với [Khung Koa](https://github.com/koajs/koa)—một giải pháp thay thế hiện đại, nhẹ nhàng hơn cho Express, cũng do TJ Holowaychuk tạo ra—tiếp tục cho thấy cam kết của anh ấy đối với các công cụ phát triển web tốt hơn. Những đóng góp của anh ấy cho Koa bao gồm cả vấn đề và mã thông qua các yêu cầu kéo, giải quyết vấn đề xử lý lỗi, quản lý kiểu nội dung và cải tiến tài liệu.

Công việc của anh ấy trên cả Express và Koa mang lại cho anh ấy góc nhìn độc đáo về phát triển web Node.js, giúp nhóm của chúng tôi tạo ra các gói hoạt động tốt với nhiều hệ sinh thái khung.

### Từ Người đóng góp Cá nhân đến Lãnh đạo Tổ chức {#from-individual-contributor-to-organization-leader}

Bắt đầu từ việc hỗ trợ các dự án hiện có, Nick đã phát triển thành việc tạo ra và duy trì toàn bộ hệ sinh thái gói. Nick đã thành lập nhiều tổ chức GitHub—bao gồm [Nhà gỗ](https://github.com/cabinjs), [Máy quét thư rác](https://github.com/spamscanner), [Chuyển tiếp Email](https://github.com/forwardemail), [Thanh niên](https://github.com/ladjs) và [Bree](https://github.com/breejs)—mỗi tổ chức đều giải quyết các nhu cầu cụ thể trong cộng đồng JavaScript.

Sự thay đổi này từ người đóng góp thành người lãnh đạo cho thấy tầm nhìn của Nick về phần mềm được thiết kế tốt có thể giải quyết các vấn đề thực tế. Bằng cách sắp xếp các gói liên quan theo các tổ chức GitHub tập trung, anh ấy đã xây dựng các hệ sinh thái công cụ hoạt động cùng nhau trong khi vẫn duy trì tính mô-đun và linh hoạt cho cộng đồng nhà phát triển rộng lớn hơn.

## Các tổ chức GitHub của chúng tôi: Hệ sinh thái đổi mới {#our-github-organizations-ecosystems-of-innovation}

Chúng tôi tổ chức công việc nguồn mở của mình xung quanh các tổ chức GitHub tập trung, mỗi tổ chức giải quyết các nhu cầu cụ thể trong JavaScript. Cấu trúc này tạo ra các họ gói gắn kết hoạt động tốt với nhau trong khi vẫn duy trì tính mô-đun.

### Cabin: Ghi nhật ký có cấu trúc cho các ứng dụng hiện đại {#cabin-structured-logging-for-modern-applications}

[Tổ chức cabin](https://github.com/cabinjs) là giải pháp ghi nhật ký ứng dụng đơn giản và mạnh mẽ của chúng tôi. Gói [`cabin`](https://github.com/cabinjs/cabin) chính có gần 900 sao trên GitHub và hơn 100.000 lượt tải xuống hàng tuần\[^1]. Cabin cung cấp tính năng ghi nhật ký có cấu trúc, hoạt động với các dịch vụ phổ biến như Sentry, LogDNA và Papertrail.

Điểm đặc biệt của Cabin nằm ở hệ thống API và plugin chu đáo. Việc hỗ trợ các gói như [`axe`](https://github.com/cabinjs/axe) cho phần mềm trung gian Express và [`parse-request`](https://github.com/cabinjs/parse-request) cho phân tích yêu cầu HTTP cho thấy cam kết của chúng tôi hướng đến các giải pháp toàn diện thay vì các công cụ riêng lẻ.

Gói [`bson-objectid`](https://github.com/cabinjs/bson-objectid) xứng đáng được nhắc đến đặc biệt, với hơn 1,7 triệu lượt tải xuống chỉ trong hai tháng\[^2]. Việc triển khai ObjectID MongoDB nhẹ nhàng này đã trở thành lựa chọn hàng đầu cho các nhà phát triển cần ID mà không cần phụ thuộc hoàn toàn vào MongoDB.

### Trình quét thư rác: Chống lạm dụng email {#spam-scanner-fighting-email-abuse}

[Tổ chức quét thư rác](https://github.com/spamscanner) thể hiện cam kết của chúng tôi trong việc giải quyết các vấn đề thực tế. Gói [`spamscanner`](https://github.com/spamscanner/spamscanner) chính cung cấp khả năng phát hiện thư rác email nâng cao, nhưng gói [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) mới là gói được áp dụng rộng rãi nhất.

Với hơn 1,2 triệu lượt tải xuống trong hai tháng\[^3], `url-regex-safe` đã khắc phục các vấn đề bảo mật nghiêm trọng trong các biểu thức chính quy phát hiện URL khác. Gói này thể hiện cách tiếp cận của chúng tôi với mã nguồn mở: tìm ra một vấn đề phổ biến (trong trường hợp này là lỗ hổng [Làm lại](https://en.wikipedia.org/wiki/ReDoS) trong xác thực URL), tạo ra một giải pháp vững chắc và bảo trì nó một cách cẩn thận.

### Bree: Lập lịch công việc hiện đại với luồng công việc {#bree-modern-job-scheduling-with-worker-threads}

[Tổ chức Bree](https://github.com/breejs) là câu trả lời của chúng tôi cho một thách thức phổ biến của Node.js: lập lịch tác vụ đáng tin cậy. Gói [`bree`](https://github.com/breejs/bree) chính, với hơn 3.100 sao trên GitHub, cung cấp một trình lập lịch tác vụ hiện đại sử dụng luồng công việc Node.js để cải thiện hiệu suất và độ tin cậy.

> \[!NOTE]
> Bree was created after we helped maintain [Agenda](https://github.com/agenda/agenda), applying lessons learned to build a better job scheduler. Our Agenda contributions helped us find ways to improve job scheduling.

Điều gì làm cho Bree khác biệt so với các trình lập lịch khác như Agenda:

* **Không có phụ thuộc bên ngoài**: Không giống như Agenda cần MongoDB, Bree không yêu cầu Redis hoặc MongoDB để quản lý trạng thái công việc.
* **Luồng công việc**: Bree sử dụng luồng công việc Node.js cho các quy trình được đóng hộp cát, mang lại khả năng cô lập và hiệu suất tốt hơn.
* **API đơn giản**: Bree cung cấp khả năng kiểm soát chi tiết với sự đơn giản, giúp triển khai các nhu cầu lập lịch phức tạp dễ dàng hơn.
* **Hỗ trợ tích hợp**: Những thứ như tải lại nhẹ nhàng, công việc cron, ngày tháng và thời gian thân thiện với con người được bao gồm theo mặc định.

Bree là một phần quan trọng của [forwardemail.net](https://github.com/forwardemail/forwardemail.net), xử lý các tác vụ nền quan trọng như xử lý email, dọn dẹp và bảo trì theo lịch trình. Việc sử dụng Bree trong Forward Email thể hiện cam kết của chúng tôi trong việc sử dụng các công cụ của riêng mình trong quá trình sản xuất, đảm bảo chúng đáp ứng các tiêu chuẩn độ tin cậy cao.

Chúng tôi cũng sử dụng và đánh giá cao các gói luồng công việc tuyệt vời khác như [hồ bơi](https://github.com/piscinajs/piscina) và các trình khách HTTP như [mười một](https://github.com/nodejs/undici). Piscina, giống như Bree, sử dụng luồng công việc Node.js để xử lý tác vụ hiệu quả. Chúng tôi xin cảm ơn [Đồi Matthew](https://github.com/mcollina), người duy trì cả undici và piscina, vì những đóng góp to lớn của anh ấy cho Node.js. Matteo là thành viên của Ban Chỉ đạo Kỹ thuật Node.js và đã cải thiện đáng kể khả năng của trình khách HTTP trong Node.js.

### Chuyển tiếp Email: Cơ sở hạ tầng Email Nguồn mở {#forward-email-open-source-email-infrastructure}

Dự án đầy tham vọng nhất của chúng tôi là [Chuyển tiếp Email](https://github.com/forwardemail), một dịch vụ email nguồn mở cung cấp dịch vụ chuyển tiếp email, lưu trữ và API. Kho lưu trữ chính có hơn 1.100 sao GitHub\[^4], cho thấy sự đánh giá cao của cộng đồng đối với giải pháp thay thế cho các dịch vụ email độc quyền này.

Gói [`preview-email`](https://github.com/forwardemail/preview-email) từ tổ chức này, với hơn 2,5 triệu lượt tải xuống trong hai tháng\[^5], đã trở thành một công cụ thiết yếu cho các nhà phát triển làm việc với mẫu email. Bằng cách cung cấp một cách đơn giản để xem trước email trong quá trình phát triển, gói này giải quyết một điểm khó khăn thường gặp khi xây dựng các ứng dụng hỗ trợ email.

### Lad: Tiện ích và công cụ thiết yếu của Koa {#lad-essential-koa-utilities-and-tools}

[Tổ chức Lad](https://github.com/ladjs) cung cấp một bộ sưu tập các tiện ích và công cụ thiết yếu, chủ yếu tập trung vào việc nâng cao hệ sinh thái khung Koa. Các gói này giải quyết những thách thức phổ biến trong phát triển web và được thiết kế để hoạt động liền mạch cùng nhau mà vẫn hữu ích khi hoạt động độc lập.

#### koa-better-error-handler: Cải thiện khả năng xử lý lỗi cho Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) cung cấp giải pháp xử lý lỗi tốt hơn cho các ứng dụng Koa. Với hơn 50 sao GitHub, gói này giúp `ctx.throw` tạo ra các thông báo lỗi thân thiện với người dùng, đồng thời giải quyết một số hạn chế của trình xử lý lỗi tích hợp sẵn của Koa:

* Phát hiện và xử lý chính xác lỗi DNS Node.js, lỗi Mongoose và lỗi Redis
* Sử dụng [Bùng nổ](https://github.com/hapijs/boom) để tạo phản hồi lỗi nhất quán, được định dạng tốt
* Giữ nguyên tiêu đề (không giống như trình xử lý tích hợp của Koa)
* Duy trì mã trạng thái phù hợp thay vì mặc định là 500
* Hỗ trợ tin nhắn flash và bảo toàn phiên
* Cung cấp danh sách lỗi HTML cho các lỗi xác thực
* Hỗ trợ nhiều loại phản hồi (HTML, JSON và văn bản thuần túy)

Gói này đặc biệt có giá trị khi sử dụng cùng với [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) để quản lý lỗi toàn diện trong các ứng dụng Koa.

#### hộ chiếu: Xác thực cho Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) mở rộng phần mềm trung gian xác thực Passport.js phổ biến với các cải tiến cụ thể cho các ứng dụng web hiện đại. Gói này hỗ trợ nhiều chiến lược xác thực ngay khi cài đặt:

* Xác thực cục bộ bằng email
* Đăng nhập bằng Apple
* Xác thực GitHub
* Xác thực Google
* Xác thực mật khẩu một lần (OTP)

Gói này có khả năng tùy chỉnh cao, cho phép các nhà phát triển điều chỉnh tên trường và cụm từ để phù hợp với yêu cầu của ứng dụng. Gói này được thiết kế để tích hợp liền mạch với Mongoose để quản lý người dùng, khiến nó trở thành giải pháp lý tưởng cho các ứng dụng dựa trên Koa cần xác thực mạnh mẽ.

#### duyên dáng: Tắt ứng dụng thanh lịch {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) giải quyết thách thức quan trọng trong việc đóng ứng dụng Node.js một cách an toàn. Với hơn 70 sao GitHub, gói này đảm bảo ứng dụng của bạn có thể kết thúc một cách an toàn mà không bị mất dữ liệu hoặc bị treo kết nối. Các tính năng chính bao gồm:

* Hỗ trợ đóng máy chủ HTTP một cách nhẹ nhàng (Express/Koa/Fastify)
* Đóng sạch các kết nối cơ sở dữ liệu (MongoDB/Mongoose)
* Đóng đúng các máy khách Redis
* Xử lý trình lập lịch công việc Bree
* Hỗ trợ trình xử lý tắt máy tùy chỉnh
* Cài đặt thời gian chờ có thể định cấu hình
* Tích hợp với hệ thống ghi nhật ký

Gói này rất cần thiết cho các ứng dụng sản xuất, nơi việc tắt máy đột ngột có thể dẫn đến mất dữ liệu hoặc hỏng dữ liệu. Bằng cách triển khai các quy trình tắt máy phù hợp, `@ladjs/graceful` giúp đảm bảo độ tin cậy và ổn định cho ứng dụng của bạn.

### Upptime: Giám sát thời gian hoạt động nguồn mở {#upptime-open-source-uptime-monitoring}

[Tổ chức Upptime](https://github.com/upptime) thể hiện cam kết của chúng tôi về việc giám sát minh bạch, mã nguồn mở. Kho lưu trữ [`upptime`](https://github.com/upptime/upptime) chính có hơn 13.000 sao GitHub, khiến nó trở thành một trong những dự án phổ biến nhất mà chúng tôi đóng góp. Upptime cung cấp một công cụ giám sát thời gian hoạt động và trang trạng thái được GitHub hỗ trợ, hoạt động hoàn toàn mà không cần máy chủ.

Chúng tôi sử dụng Upptime cho trang trạng thái của riêng mình tại <https://status.forwardemail.net> với mã nguồn có sẵn tại <https://github.com/forwardemail/status.forwardemail.net>.

Điều làm cho Upptime trở nên đặc biệt là kiến trúc của nó:

* **100% Nguồn mở**: Mọi thành phần đều hoàn toàn là nguồn mở và có thể tùy chỉnh.
* **Được hỗ trợ bởi GitHub**: Tận dụng GitHub Actions, Issues và Pages để tạo ra giải pháp giám sát không cần máy chủ.
* **Không cần máy chủ**: Không giống như các công cụ giám sát truyền thống, Upptime không yêu cầu bạn phải chạy hoặc bảo trì máy chủ.
* **Trang trạng thái tự động**: Tạo trang trạng thái đẹp mắt có thể lưu trữ trên GitHub Pages.
* **Thông báo mạnh mẽ**: Tích hợp với nhiều kênh thông báo khác nhau bao gồm email, SMS và Slack.

Để nâng cao trải nghiệm người dùng, chúng tôi đã tích hợp [@octokit/lõi](https://github.com/octokit/core.js/) vào cơ sở mã nguồn forwardemail.net để hiển thị cập nhật trạng thái và sự cố theo thời gian thực ngay trên trang web. Việc tích hợp này mang lại sự minh bạch rõ ràng cho người dùng trong trường hợp có bất kỳ sự cố nào trên toàn bộ ngăn xếp (Website, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, v.v.) với thông báo toast tức thì, thay đổi biểu tượng huy hiệu, màu cảnh báo, v.v.

Thư viện @octokit/core cho phép chúng tôi lấy dữ liệu thời gian thực từ kho lưu trữ Upptime GitHub của mình, xử lý và hiển thị dữ liệu theo cách thân thiện với người dùng. Khi bất kỳ dịch vụ nào bị ngừng hoạt động hoặc hiệu suất giảm, người dùng sẽ được thông báo ngay lập tức thông qua các chỉ báo trực quan mà không cần phải rời khỏi ứng dụng chính. Sự tích hợp liền mạch này đảm bảo rằng người dùng của chúng tôi luôn có thông tin cập nhật về trạng thái hệ thống của chúng tôi, tăng cường tính minh bạch và sự tin cậy.

Upptime đã được hàng trăm tổ chức áp dụng khi tìm kiếm một cách minh bạch, đáng tin cậy để giám sát các dịch vụ của họ và truyền đạt trạng thái cho người dùng. Sự thành công của dự án cho thấy sức mạnh của việc xây dựng các công cụ tận dụng cơ sở hạ tầng hiện có (trong trường hợp này là GitHub) để giải quyết các vấn đề phổ biến theo những cách mới.

## Những đóng góp của chúng tôi cho Hệ sinh thái Email Chuyển tiếp {#our-contributions-to-the-forward-email-ecosystem}

Trong khi các gói nguồn mở của chúng tôi được các nhà phát triển trên toàn thế giới sử dụng, chúng cũng tạo thành nền tảng cho dịch vụ Forward Email của riêng chúng tôi. Vai trò kép này—vừa là người sáng tạo vừa là người sử dụng các công cụ này—mang đến cho chúng tôi góc nhìn độc đáo về ứng dụng thực tế của chúng và thúc đẩy cải tiến liên tục.

### Từ Gói đến Sản xuất {#from-packages-to-production}

Hành trình từ các gói riêng lẻ đến một hệ thống sản xuất gắn kết đòi hỏi sự tích hợp và mở rộng cẩn thận. Đối với Forward Email, quy trình này bao gồm:

* **Tiện ích mở rộng tùy chỉnh**: Xây dựng các tiện ích mở rộng dành riêng cho Email chuyển tiếp cho các gói nguồn mở của chúng tôi để giải quyết các yêu cầu riêng của chúng tôi.
* **Mẫu tích hợp**: Phát triển các mẫu về cách các gói này tương tác trong môi trường sản xuất.
* **Tối ưu hóa hiệu suất**: Xác định và giải quyết các điểm nghẽn hiệu suất chỉ xuất hiện ở quy mô lớn.
* **Củng cố bảo mật**: Thêm các lớp bảo mật bổ sung dành riêng cho việc xử lý email và bảo vệ dữ liệu người dùng.

Công trình này là kết quả của hàng ngàn giờ phát triển vượt ra ngoài các gói cốt lõi, tạo ra một dịch vụ email mạnh mẽ, an toàn, tận dụng tối đa những đóng góp nguồn mở tốt nhất của chúng tôi.

### Vòng lặp phản hồi {#the-feedback-loop}

Có lẽ khía cạnh có giá trị nhất khi sử dụng các gói của riêng chúng tôi trong sản xuất là vòng phản hồi mà nó tạo ra. Khi chúng tôi gặp phải các hạn chế hoặc trường hợp ngoại lệ trong Forward Email, chúng tôi không chỉ vá chúng cục bộ mà còn cải thiện các gói cơ bản, mang lại lợi ích cho cả dịch vụ của chúng tôi và cộng đồng rộng lớn hơn.

Cách tiếp cận này đã mang lại nhiều cải tiến:

* **Tắt máy êm ái của Bree**: Nhu cầu triển khai không thời gian chết của Forward Email đã dẫn đến việc cải thiện khả năng tắt máy êm ái trong Bree.
* **Nhận dạng Mẫu của Spam Scanner**: Các mẫu thư rác thực tế gặp phải trong Forward Email đã được thông báo cho các thuật toán phát hiện của Spam Scanner.
* **Tối ưu hóa Hiệu suất của Cabin**: Việc ghi nhật ký khối lượng lớn trong môi trường sản xuất đã tiết lộ các cơ hội tối ưu hóa trong Cabin, mang lại lợi ích cho tất cả người dùng.

Bằng cách duy trì vòng tuần hoàn lành mạnh này giữa công việc nguồn mở và dịch vụ sản xuất, chúng tôi đảm bảo các gói của mình vẫn là các giải pháp thiết thực, đã được thử nghiệm thực tế chứ không phải là các triển khai lý thuyết.

## Các nguyên tắc cốt lõi của Email chuyển tiếp: Nền tảng cho sự xuất sắc {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email được thiết kế dựa trên một bộ nguyên tắc cốt lõi, định hướng cho mọi quyết định phát triển của chúng tôi. Những nguyên tắc này, được nêu chi tiết trong [trang web](/blog/docs/best-quantum-safe-encrypted-email-service#principles), đảm bảo dịch vụ của chúng tôi luôn thân thiện với nhà phát triển, an toàn và tập trung vào quyền riêng tư của người dùng.

### Luôn thân thiện với nhà phát triển, tập trung vào bảo mật và minh bạch {#always-developer-friendly-security-focused-and-transparent}

Nguyên tắc đầu tiên và quan trọng nhất của chúng tôi là tạo ra phần mềm thân thiện với nhà phát triển trong khi vẫn duy trì các tiêu chuẩn cao nhất về bảo mật và quyền riêng tư. Chúng tôi tin rằng sự xuất sắc về mặt kỹ thuật không bao giờ được đánh đổi bằng khả năng sử dụng và tính minh bạch tạo dựng lòng tin với cộng đồng của chúng tôi.

Nguyên tắc này thể hiện trong tài liệu chi tiết của chúng tôi, thông báo lỗi rõ ràng và giao tiếp cởi mở về cả thành công và thách thức. Bằng cách làm cho toàn bộ cơ sở mã nguồn mở, chúng tôi mời gọi sự giám sát và cộng tác, củng cố cả phần mềm của chúng tôi và hệ sinh thái rộng lớn hơn.

### Tuân thủ các Nguyên tắc Phát triển Phần mềm đã được Kiểm chứng theo Thời gian {#adherence-to-time-tested-software-development-principles}

Chúng tôi tuân theo một số nguyên tắc phát triển phần mềm đã được chứng minh giá trị trong nhiều thập kỷ:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Phân tách các mối quan tâm thông qua mô hình Model-View-Controller
* **[Triết lý Unix](https://en.wikipedia.org/wiki/Unix_philosophy)**: Tạo các thành phần mô-đun thực hiện tốt một chức năng
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Giữ cho mọi thứ đơn giản và dễ hiểu
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Không lặp lại chính mình, khuyến khích tái sử dụng mã
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Bạn sẽ không cần nó, tránh tối ưu hóa sớm
* **[Mười hai yếu tố](https://12factor.net/)**: Áp dụng các phương pháp hay nhất để xây dựng các ứng dụng hiện đại, có khả năng mở rộng
* **[Dao cạo của Occam](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Chọn giải pháp đơn giản nhất đáp ứng các yêu cầu
* **[Thức ăn cho chó](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Sử dụng rộng rãi các sản phẩm của chúng tôi

Những nguyên tắc này không chỉ là những khái niệm lý thuyết—chúng được nhúng vào các hoạt động phát triển hàng ngày của chúng tôi. Ví dụ, sự tuân thủ triết lý Unix của chúng tôi thể hiện rõ trong cách chúng tôi cấu trúc các gói npm của mình: các mô-đun nhỏ, tập trung có thể được kết hợp lại với nhau để giải quyết các vấn đề phức tạp.

### Hướng đến nhà phát triển tự lực, giàu kinh nghiệm {#targeting-the-scrappy-bootstrapped-developer}

Chúng tôi đặc biệt nhắm đến các nhà phát triển ít kinh nghiệm, tự lực và [ramen-có lãi](https://www.paulgraham.com/ramenprofitable.html). Trọng tâm này định hình mọi thứ, từ mô hình định giá đến các quyết định kỹ thuật của chúng tôi. Chúng tôi hiểu những thách thức khi xây dựng sản phẩm với nguồn lực hạn chế vì chính chúng tôi đã từng trải qua điều đó.

Nguyên tắc này đặc biệt quan trọng trong cách chúng tôi tiếp cận nguồn mở. Chúng tôi tạo và duy trì các gói giải quyết các vấn đề thực tế cho các nhà phát triển không có ngân sách doanh nghiệp, giúp mọi người có thể tiếp cận các công cụ mạnh mẽ bất kể nguồn lực của họ.

### Nguyên tắc thực hành: Cơ sở mã email chuyển tiếp {#principles-in-practice-the-forward-email-codebase}

Những nguyên tắc này được thể hiện rõ trong cơ sở dữ liệu mã Forward Email. Tệp package.json của chúng tôi cho thấy một lựa chọn chu đáo về các phụ thuộc, mỗi phụ thuộc được chọn để phù hợp với các giá trị cốt lõi của chúng tôi:

* Các gói tập trung vào bảo mật như `mailauth` để xác thực email
* Các công cụ thân thiện với nhà phát triển như `preview-email` để gỡ lỗi dễ dàng hơn
* Các thành phần mô-đun như các tiện ích `p-*` khác nhau từ Sindre Sorhus

Bằng cách tuân thủ các nguyên tắc này một cách nhất quán theo thời gian, chúng tôi đã xây dựng một dịch vụ mà các nhà phát triển có thể tin tưởng với cơ sở hạ tầng email của họ—an toàn, đáng tin cậy và phù hợp với các giá trị của cộng đồng nguồn mở.

### Quyền riêng tư theo thiết kế {#privacy-by-design}

Quyền riêng tư không phải là một ý tưởng chợt nảy ra hay tính năng tiếp thị cho Forward Email mà là một nguyên tắc thiết kế cơ bản chi phối mọi khía cạnh của dịch vụ và mã của chúng tôi:

* **Mã hóa không truy cập**: Chúng tôi đã triển khai các hệ thống khiến chúng tôi không thể đọc email của người dùng về mặt kỹ thuật.
* **Thu thập dữ liệu tối thiểu**: Chúng tôi chỉ thu thập dữ liệu cần thiết để cung cấp dịch vụ của mình, không có gì hơn.
* **Chính sách minh bạch**: Chính sách bảo mật của chúng tôi được viết bằng ngôn ngữ rõ ràng, dễ hiểu mà không có thuật ngữ pháp lý.
* **Xác minh nguồn mở**: Cơ sở mã nguồn mở của chúng tôi cho phép các nhà nghiên cứu bảo mật xác minh các tuyên bố về quyền riêng tư của chúng tôi.

Cam kết này mở rộng đến các gói nguồn mở của chúng tôi, được thiết kế với các biện pháp bảo mật và quyền riêng tư tốt nhất được tích hợp sẵn ngay từ đầu.

### Nguồn mở bền vững {#sustainable-open-source}

Chúng tôi tin rằng phần mềm nguồn mở cần các mô hình bền vững để phát triển lâu dài. Phương pháp tiếp cận của chúng tôi bao gồm:

* **Hỗ trợ thương mại**: Cung cấp hỗ trợ và dịch vụ cao cấp xung quanh các công cụ nguồn mở của chúng tôi.
* **Cấp phép cân bằng**: Sử dụng các giấy phép bảo vệ cả quyền tự do của người dùng và tính bền vững của dự án.
* **Tham gia cộng đồng**: Tích cực tham gia với những người đóng góp để xây dựng một cộng đồng hỗ trợ.
* **Lộ trình minh bạch**: Chia sẻ các kế hoạch phát triển của chúng tôi để cho phép người dùng lập kế hoạch phù hợp.

Bằng cách tập trung vào tính bền vững, chúng tôi đảm bảo rằng các đóng góp nguồn mở của mình có thể tiếp tục phát triển và cải thiện theo thời gian thay vì bị lãng quên.

## Những con số không biết nói dối: Thống kê tải xuống npm đáng kinh ngạc của chúng tôi {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Khi chúng ta nói về tác động của phần mềm nguồn mở, số liệu thống kê tải xuống cung cấp thước đo hữu hình về mức độ áp dụng và tin tưởng. Nhiều gói mà chúng tôi giúp duy trì đã đạt đến quy mô mà ít dự án nguồn mở nào đạt được, với tổng số lượt tải xuống lên tới hàng tỷ.

![Các gói npm hàng đầu theo lượt tải xuống](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> While we're proud to help maintain several highly-downloaded packages in the JavaScript ecosystem, we want to acknowledge that many of these packages were originally created by other talented developers. Packages like superagent and supertest were originally created by TJ Holowaychuk, whose prolific contributions to open source have been instrumental in shaping the Node.js ecosystem.

### Cái nhìn toàn cảnh về tác động của chúng tôi {#a-birds-eye-view-of-our-impact}

Chỉ trong khoảng thời gian hai tháng từ tháng 2 đến tháng 3 năm 2025, các gói hàng đầu mà chúng tôi đóng góp và giúp duy trì số lượng tải xuống đáng kinh ngạc đã được ghi nhận:

* **[siêu đại lý](https://www.npmjs.com/package/superagent)**: 84.575.829 lượt tải xuống\[^7] (do TJ Holowaychuk tạo ra ban đầu)
* **[siêu thử nghiệm](https://www.npmjs.com/package/supertest)**: 76.432.591 lượt tải xuống\[^8] (do TJ Holowaychuk tạo ra ban đầu)
* **[Mà còn](https://www.npmjs.com/package/koa)**: 28.539.295 lượt tải xuống\[^34] (do TJ Holowaychuk tạo ra ban đầu)
* **[@koa/bộ định tuyến](https://www.npmjs.com/package/@koa/router)**: 11.007.327 lượt tải xuống\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3.498.918 lượt tải xuống\[^36]
* **[url-biểu thức chính quy](https://www.npmjs.com/package/url-regex)**: 2.819.520 Lượt tải xuống\[^37]
* **[xem trước-email](https://www.npmjs.com/package/preview-email)**: 2.500.000 lượt tải xuống\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1.800.000 lượt tải xuống\[^10]
* **[@breejs/sau này](https://www.npmjs.com/package/@breejs/later)**: 1.709.938 lượt tải xuống\[^38]
* **[mẫu email](https://www.npmjs.com/package/email-templates)**: 1.128.139 lượt tải xuống\[^39]
* **[lấy đường dẫn](https://www.npmjs.com/package/get-paths)**: 1.124.686 lượt tải xuống\[^40]
* **[url-regex-an toàn](https://www.npmjs.com/package/url-regex-safe)**: 1.200.000 lượt tải xuống\[^11]
* **[dotenv-phân tích biến](https://www.npmjs.com/package/dotenv-parse-variables)**: 894.666 lượt tải xuống\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839.585 lượt tải xuống\[^42]
* **[máy quét thư rác](https://www.npmjs.com/package/spamscanner)**: 145.000 lượt tải xuống\[^12]
* **[Bree (Bờ biển)](https://www.npmjs.com/package/bree)**: 24.270 lượt tải xuống\[^30]

> \[!NOTE]
> Several other packages we help maintain but didn't create have even higher download counts, including `form-data` (738M+ downloads), `toidentifier` (309M+ downloads), `stackframe` (116M+ downloads), and `error-stack-parser` (113M+ downloads). We're honored to contribute to these packages while respecting the work of their original authors.

Đây không chỉ là những con số ấn tượng—mà còn đại diện cho các nhà phát triển thực sự giải quyết các vấn đề thực tế bằng mã mà chúng tôi giúp duy trì. Mỗi lượt tải xuống là một trường hợp mà các gói này đã giúp ai đó xây dựng một cái gì đó có ý nghĩa, từ các dự án sở thích đến các ứng dụng doanh nghiệp được hàng triệu người sử dụng.

![Phân phối danh mục gói](/img/art/category_pie_chart.svg)

### Tác động hàng ngày theo quy mô {#daily-impact-at-scale}

Các mẫu tải xuống hàng ngày cho thấy mức sử dụng nhất quán, khối lượng lớn, với mức đỉnh điểm lên tới hàng triệu lượt tải xuống mỗi ngày\[^13]. Sự nhất quán này nói lên tính ổn định và độ tin cậy của các gói này—các nhà phát triển không chỉ thử chúng; họ tích hợp chúng vào quy trình làm việc cốt lõi của mình và phụ thuộc vào chúng ngày này qua ngày khác.

Các mẫu tải xuống hàng tuần cho thấy những con số thậm chí còn ấn tượng hơn, liên tục dao động quanh hàng chục triệu lượt tải xuống mỗi tuần\[^14]. Điều này thể hiện dấu ấn to lớn trong hệ sinh thái JavaScript, với các gói này chạy trong môi trường sản xuất trên toàn cầu.

### Vượt ra ngoài những con số thô {#beyond-the-raw-numbers}

Mặc dù số liệu thống kê tải xuống tự chúng đã rất ấn tượng, nhưng chúng lại kể một câu chuyện sâu sắc hơn về sự tin tưởng mà cộng đồng dành cho các gói này. Việc duy trì các gói ở quy mô này đòi hỏi một cam kết không lay chuyển đối với:

* **Khả năng tương thích ngược**: Những thay đổi phải được cân nhắc cẩn thận để tránh phá vỡ các triển khai hiện có.
* **Bảo mật**: Với hàng triệu ứng dụng phụ thuộc vào các gói này, các lỗ hổng bảo mật có thể gây ra hậu quả sâu rộng.
* **Hiệu suất**: Ở quy mô này, ngay cả những cải tiến nhỏ về hiệu suất cũng có thể mang lại lợi ích tổng hợp đáng kể.
* **Tài liệu**: Tài liệu rõ ràng, toàn diện là điều cần thiết đối với các gói được sử dụng bởi các nhà phát triển ở mọi cấp độ kinh nghiệm.

Sự tăng trưởng ổn định về số lượt tải xuống theo thời gian phản ánh sự thành công trong việc đáp ứng các cam kết này, xây dựng lòng tin với cộng đồng nhà phát triển thông qua các gói đáng tin cậy và được bảo trì tốt.

## Hỗ trợ Hệ sinh thái: Các Nhà tài trợ Nguồn mở của Chúng tôi {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Open source sustainability isn't just about contributing code—it's also about supporting the developers who maintain critical infrastructure.

Ngoài những đóng góp trực tiếp của chúng tôi cho hệ sinh thái JavaScript, chúng tôi tự hào tài trợ cho những người đóng góp nổi bật cho Node.js, những người có công trình tạo nên nền tảng cho nhiều ứng dụng hiện đại. Các nhà tài trợ của chúng tôi bao gồm:

### Andris Reinman: Người tiên phong về cơ sở hạ tầng email {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) là tác giả của [Người gửi thư nút](https://github.com/nodemailer/nodemailer), thư viện gửi email phổ biến nhất cho Node.js với hơn 14 triệu lượt tải xuống mỗi tuần\[^15]. Công trình của ông mở rộng sang các thành phần cơ sở hạ tầng email quan trọng khác như [Máy chủ SMTP](https://github.com/nodemailer/smtp-server), [Trình phân tích thư](https://github.com/nodemailer/mailparser) và [Vịt hoang dã](https://github.com/nodemailer/wildduck).

Việc tài trợ của chúng tôi giúp đảm bảo việc duy trì và phát triển liên tục các công cụ thiết yếu này, hỗ trợ giao tiếp qua email cho vô số ứng dụng Node.js, bao gồm cả dịch vụ Chuyển tiếp Email của chúng tôi.

### Sindre Sorhus: Bậc thầy về gói tiện ích {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) là một trong những người đóng góp mã nguồn mở tích cực nhất cho hệ sinh thái JavaScript, với hơn 1.000 gói npm mang tên anh ấy. Các tiện ích của anh ấy như [bản đồ p](https://github.com/sindresorhus/p-map), [trước khi thử lại](https://github.com/sindresorhus/p-retry) và [là-luồng](https://github.com/sindresorhus/is-stream) là những khối xây dựng cơ bản được sử dụng trong toàn bộ hệ sinh thái Node.js.

Bằng cách tài trợ cho công việc của Sindre, chúng tôi giúp duy trì sự phát triển của các tiện ích quan trọng này giúp việc phát triển JavaScript hiệu quả và đáng tin cậy hơn.

Những nhà tài trợ này phản ánh cam kết của chúng tôi đối với hệ sinh thái nguồn mở rộng lớn hơn. Chúng tôi nhận ra rằng thành công của chúng tôi được xây dựng trên nền tảng do những người đóng góp này và những người khác đặt ra, và chúng tôi cam kết đảm bảo tính bền vững của toàn bộ hệ sinh thái.

## Phát hiện lỗ hổng bảo mật trong hệ sinh thái JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Cam kết của chúng tôi đối với mã nguồn mở không chỉ dừng lại ở việc phát triển tính năng mà còn bao gồm việc xác định và giải quyết các lỗ hổng bảo mật có thể ảnh hưởng đến hàng triệu nhà phát triển. Một số đóng góp quan trọng nhất của chúng tôi cho hệ sinh thái JavaScript nằm ở lĩnh vực bảo mật.

### Giải cứu Koa-Router {#the-koa-router-rescue}

Vào tháng 2 năm 2019, Nick đã phát hiện ra một vấn đề nghiêm trọng trong việc bảo trì gói koa-router phổ biến. Vì anh ấy [được báo cáo trên Hacker News](https://news.ycombinator.com/item?id=19156707), gói này đã bị người bảo trì ban đầu bỏ rơi, khiến các lỗ hổng bảo mật chưa được xử lý và cộng đồng không được cập nhật.

> \[!WARNING]
> Abandoned packages with security vulnerabilities pose significant risks to the entire ecosystem, especially when they're downloaded millions of times weekly.

Để ứng phó, Nick đã tạo ra [@koa/bộ định tuyến](https://github.com/koajs/router) và giúp cảnh báo cộng đồng về tình hình. Anh ấy đã duy trì gói quan trọng này kể từ đó, đảm bảo người dùng Koa có một giải pháp định tuyến an toàn và được bảo trì tốt.

### Xử lý lỗ hổng ReDoS {#addressing-redos-vulnerabilities}

Năm 2020, Nick đã xác định và xử lý lỗ hổng nghiêm trọng [Từ chối dịch vụ biểu thức chính quy (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) trong gói `url-regex` được sử dụng rộng rãi. Lỗ hổng này ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) có thể cho phép kẻ tấn công gây ra tình trạng từ chối dịch vụ bằng cách cung cấp dữ liệu đầu vào được thiết kế đặc biệt, gây ra lỗi truy ngược nghiêm trọng trong biểu thức chính quy.

Thay vì chỉ vá lỗi gói hiện có, Nick đã tạo ra [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), một bản triển khai được viết lại hoàn toàn để giải quyết lỗ hổng bảo mật mà vẫn duy trì khả năng tương thích với API gốc. Anh ấy cũng đã xuất bản một [bài đăng blog toàn diện](/blog/docs/url-regex-javascript-node-js) giải thích về lỗ hổng bảo mật và cách giảm thiểu nó.

Công trình này cho thấy cách tiếp cận của chúng tôi đối với vấn đề bảo mật: không chỉ giải quyết vấn đề mà còn giáo dục cộng đồng và cung cấp các giải pháp thay thế mạnh mẽ giúp ngăn ngừa các vấn đề tương tự trong tương lai.

### Ủng hộ bảo mật Node.js và Chromium {#advocating-for-nodejs-and-chromium-security}

Nick cũng tích cực vận động cải thiện bảo mật trong toàn bộ hệ sinh thái. Vào tháng 8 năm 2020, anh đã phát hiện một vấn đề bảo mật nghiêm trọng trong Node.js liên quan đến việc xử lý tiêu đề HTTP, được báo cáo trong [Sổ đăng ký](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Vấn đề này, bắt nguồn từ bản vá trong Chromium, có khả năng cho phép kẻ tấn công vượt qua các biện pháp bảo mật. Sự ủng hộ của Nick đã giúp đảm bảo rằng vấn đề được giải quyết kịp thời, bảo vệ hàng triệu ứng dụng Node.js khỏi nguy cơ bị khai thác.

### Bảo mật cơ sở hạ tầng npm {#securing-npm-infrastructure}

Cuối tháng đó, Nick phát hiện ra một vấn đề bảo mật nghiêm trọng khác, lần này là trong cơ sở hạ tầng email của npm. Theo báo cáo trong [Sổ đăng ký](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm đã không triển khai đúng các giao thức xác thực email DMARC, SPF và DKIM, có khả năng cho phép kẻ tấn công gửi email lừa đảo có vẻ như đến từ npm.

Báo cáo của Nick đã dẫn đến những cải tiến trong khả năng bảo mật email của npm, bảo vệ hàng triệu nhà phát triển dựa vào npm để quản lý gói khỏi các cuộc tấn công lừa đảo tiềm ẩn.

## Những đóng góp của chúng tôi cho Hệ sinh thái Email Chuyển tiếp {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email được xây dựng dựa trên một số dự án nguồn mở quan trọng, bao gồm Nodemailer, WildDuck và mailauth. Nhóm của chúng tôi đã có những đóng góp đáng kể cho các dự án này, giúp xác định và khắc phục các vấn đề sâu sắc ảnh hưởng đến việc gửi email và bảo mật.

### Nâng cao chức năng cốt lõi của Nodemailer {#enhancing-nodemailers-core-functionality}

[Người gửi thư nút](https://github.com/nodemailer/nodemailer) là xương sống của việc gửi email trong Node.js và những đóng góp của chúng tôi đã giúp nó trở nên mạnh mẽ hơn:

* **Cải tiến máy chủ SMTP**: Chúng tôi đã khắc phục lỗi phân tích cú pháp, sự cố xử lý luồng và sự cố cấu hình TLS trong thành phần máy chủ SMTP\[^16]\[^17].
* **Cải tiến trình phân tích cú pháp thư**: Chúng tôi đã giải quyết lỗi giải mã chuỗi ký tự và giải quyết sự cố trình phân tích cú pháp có thể gây ra lỗi xử lý email\[^18]\[^19].

Những đóng góp này đảm bảo rằng Nodemailer vẫn là nền tảng đáng tin cậy cho việc xử lý email trong các ứng dụng Node.js, bao gồm cả Forward Email.

### Nâng cao xác thực email với Mailauth {#advancing-email-authentication-with-mailauth}

[Thư tín](https://github.com/postalsys/mailauth) cung cấp chức năng xác thực email quan trọng và những đóng góp của chúng tôi đã cải thiện đáng kể khả năng của chức năng này:

* **Cải thiện xác minh DKIM**: Chúng tôi đã phát hiện và báo cáo rằng X/Twitter có vấn đề về bộ đệm DNS gây ra lỗi DKIM cho các tin nhắn gửi đi của họ, báo cáo trên Hacker One\[^20].
* **Cải tiến DMARC và ARC**: Chúng tôi đã khắc phục các sự cố với xác minh DMARC và ARC có thể dẫn đến kết quả xác thực không chính xác\[^21]\[^22].
* **Tối ưu hóa hiệu suất**: Chúng tôi đã đóng góp các tối ưu hóa giúp cải thiện hiệu suất của các quy trình xác thực email\[^23]\[^24]\[^25]\[^26].

Những cải tiến này giúp đảm bảo xác thực email chính xác và đáng tin cậy, bảo vệ người dùng khỏi các cuộc tấn công lừa đảo và giả mạo.

### Cải tiến quan trọng về thời gian hoạt động {#key-upptime-enhancements}

Những đóng góp của chúng tôi cho Upptime bao gồm:

* **Giám sát chứng chỉ SSL**: Chúng tôi đã thêm chức năng giám sát ngày hết hạn chứng chỉ SSL, ngăn ngừa thời gian ngừng hoạt động bất ngờ do chứng chỉ hết hạn\[^27].
* **Hỗ trợ nhiều số SMS**: Chúng tôi đã triển khai hỗ trợ để cảnh báo nhiều thành viên trong nhóm qua SMS khi xảy ra sự cố, cải thiện thời gian phản hồi\[^28].
* **Sửa lỗi kiểm tra IPv6**: Chúng tôi đã khắc phục sự cố với các lần kiểm tra kết nối IPv6, đảm bảo giám sát chính xác hơn trong môi trường mạng hiện đại\[^29].
* **Hỗ trợ chế độ tối/sáng**: Chúng tôi đã thêm hỗ trợ chủ đề để cải thiện trải nghiệm của người dùng trên các trang trạng thái\[^31].
* **Hỗ trợ TCP-Ping tốt hơn**: Chúng tôi đã cải thiện chức năng ping TCP để cung cấp thử nghiệm kết nối đáng tin cậy hơn\[^32].

Những cải tiến này không chỉ có lợi cho việc theo dõi trạng thái của Forward Email mà còn có sẵn cho toàn bộ cộng đồng người dùng Upptime, chứng tỏ cam kết của chúng tôi trong việc cải thiện các công cụ mà chúng tôi tin cậy.

## Chất keo gắn kết mọi thứ lại với nhau: Mã tùy chỉnh ở quy mô lớn {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Mặc dù các gói npm và đóng góp của chúng tôi cho các dự án hiện tại rất đáng kể, nhưng chính mã tùy chỉnh tích hợp các thành phần này mới thực sự thể hiện chuyên môn kỹ thuật của chúng tôi. Cơ sở mã nguồn Forward Email là kết quả của một thập kỷ nỗ lực phát triển, bắt đầu từ năm 2017 khi dự án bắt đầu với tên [chuyển tiếp email miễn phí](https://github.com/forwardemail/free-email-forwarding) trước khi được sáp nhập vào monorepo.

### Một nỗ lực phát triển lớn {#a-massive-development-effort}

Quy mô của mã tích hợp tùy chỉnh này rất ấn tượng:

* **Tổng số đóng góp**: Hơn 3.217 cam kết
* **Kích thước cơ sở mã**: Hơn 421.545 dòng mã trên các tệp JavaScript, Pug, CSS và JSON\[^33]

Điều này thể hiện hàng ngàn giờ làm việc phát triển, các phiên gỡ lỗi và tối ưu hóa hiệu suất. Đây là "bí quyết" biến các gói riêng lẻ thành một dịch vụ gắn kết, đáng tin cậy được hàng ngàn khách hàng sử dụng hàng ngày.

### Tích hợp các phụ thuộc cốt lõi {#core-dependencies-integration}

Cơ sở mã hóa Forward Email tích hợp nhiều thành phần phụ thuộc thành một khối liền mạch:

* **Xử lý email**: Tích hợp Nodemailer để gửi, Máy chủ SMTP để nhận và Mailparser để phân tích
* **Xác thực**: Sử dụng Mailauth để xác minh DKIM, SPF, DMARC và ARC
* **Giải quyết DNS**: Tận dụng Tangerine cho DNS-over-HTTPS với bộ nhớ đệm toàn cầu
* **Kết nối MX**: Sử dụng mx-connect với tích hợp Tangerine để kết nối máy chủ thư đáng tin cậy
* **Lên lịch công việc**: Sử dụng Bree để xử lý tác vụ nền đáng tin cậy với luồng công nhân
* **Tạo mẫu**: Sử dụng mẫu email để tái sử dụng các bảng định kiểu từ trang web trong thông tin liên lạc với khách hàng
* **Lưu trữ email**: Triển khai các hộp thư SQLite được mã hóa riêng lẻ bằng better-sqlite3-multiple-ciphers với mã hóa ChaCha20-Poly1305 để đảm bảo quyền riêng tư an toàn lượng tử, đảm bảo sự cô lập hoàn toàn giữa những người dùng và chỉ người dùng mới có quyền truy cập vào hộp thư của họ

Mỗi tích hợp này đều cần cân nhắc cẩn thận các trường hợp ngoại lệ, tác động đến hiệu suất và mối quan tâm về bảo mật. Kết quả là một hệ thống mạnh mẽ xử lý hàng triệu giao dịch email một cách đáng tin cậy. Việc triển khai SQLite của chúng tôi cũng tận dụng msgpackr để tuần tự hóa nhị phân hiệu quả và WebSockets (thông qua ws) để cập nhật trạng thái theo thời gian thực trên toàn bộ cơ sở hạ tầng của chúng tôi.

### Cơ sở hạ tầng DNS với Tangerine và mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Một thành phần quan trọng của cơ sở hạ tầng Forward Email là hệ thống phân giải DNS của chúng tôi, được xây dựng xung quanh hai gói chính:

* **[Quýt](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Việc triển khai DNS-over-HTTPS Node.js của chúng tôi cung cấp giải pháp thay thế cho trình phân giải DNS tiêu chuẩn, với tính năng thử lại, thời gian chờ, xoay vòng máy chủ thông minh và hỗ trợ lưu vào bộ nhớ đệm tích hợp.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Gói này thiết lập kết nối TCP tới máy chủ MX, lấy tên miền hoặc địa chỉ email mục tiêu, giải quyết các máy chủ MX phù hợp và kết nối với chúng theo thứ tự ưu tiên.

Chúng tôi đã tích hợp Tangerine với mx-connect thông qua [Pull Request #4](https://github.com/zone-eu/mx-connect/pull/4), đảm bảo các yêu cầu DNS lớp ứng dụng qua HTTP trong suốt quá trình Forward Email. Tính năng này cung cấp bộ nhớ đệm toàn cục cho DNS ở quy mô lớn với tính nhất quán 1:1 trên mọi khu vực, ứng dụng hoặc quy trình - yếu tố then chốt để phân phối email đáng tin cậy trong một hệ thống phân tán.

## Tác động đến Doanh nghiệp: Từ Nguồn Mở đến Các Giải pháp Tối quan trọng {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Kết quả của hành trình phát triển nguồn mở kéo dài một thập kỷ của chúng tôi đã cho phép Forward Email phục vụ không chỉ các nhà phát triển cá nhân mà còn cả các doanh nghiệp lớn và các tổ chức giáo dục, những đơn vị tạo nên xương sống của chính phong trào nguồn mở.

### Các Nghiên cứu Trường hợp về Cơ sở Hạ tầng Email Tối quan trọng {#case-studies-in-mission-critical-email-infrastructure}

Cam kết của chúng tôi về độ tin cậy, quyền riêng tư và các nguyên tắc nguồn mở đã biến Forward Email trở thành lựa chọn đáng tin cậy cho các tổ chức có yêu cầu khắt khe về email:

* **Các Tổ chức Giáo dục**: Như được nêu chi tiết trong [nghiên cứu trường hợp chuyển tiếp email cựu sinh viên]](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), các trường đại học lớn dựa vào cơ sở hạ tầng của chúng tôi để duy trì kết nối trọn đời với hàng trăm nghìn cựu sinh viên thông qua các dịch vụ chuyển tiếp email đáng tin cậy.

* **Giải pháp Linux cho doanh nghiệp**: [Nghiên cứu trường hợp doanh nghiệp email Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) chứng minh cách tiếp cận nguồn mở của chúng tôi hoàn toàn phù hợp với nhu cầu của các nhà cung cấp Linux cho doanh nghiệp, mang lại cho họ tính minh bạch và khả năng kiểm soát mà họ yêu cầu.

* **Tổ chức nguồn mở**: Có lẽ điều xác thực nhất là mối quan hệ đối tác của chúng tôi với Linux Foundation, như được ghi lại trong [Nghiên cứu trường hợp doanh nghiệp email của Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), trong đó dịch vụ của chúng tôi hỗ trợ truyền thông cho chính tổ chức quản lý sự phát triển của Linux.

Có một sự đối xứng tuyệt đẹp trong cách các gói nguồn mở của chúng tôi, được duy trì cẩn thận trong nhiều năm, đã cho phép chúng tôi xây dựng một dịch vụ email hiện hỗ trợ chính các cộng đồng và tổ chức ủng hộ phần mềm nguồn mở. Hành trình trọn vẹn này—từ việc đóng góp các gói riêng lẻ đến cung cấp năng lượng cho cơ sở hạ tầng email cấp doanh nghiệp cho các nhà lãnh đạo nguồn mở—đại diện cho sự xác thực cuối cùng về cách tiếp cận của chúng tôi đối với phát triển phần mềm.

## Một thập kỷ nguồn mở: Hướng tới tương lai {#a-decade-of-open-source-looking-forward}

Khi nhìn lại một thập kỷ đóng góp cho mã nguồn mở và hướng tới mười năm tiếp theo, chúng tôi vô cùng biết ơn cộng đồng đã hỗ trợ công việc của chúng tôi và háo hức với những gì sắp tới.

Hành trình của chúng tôi từ những người đóng góp gói riêng lẻ đến những người duy trì cơ sở hạ tầng email toàn diện được các doanh nghiệp lớn và các tổ chức nguồn mở sử dụng thật đáng chú ý. Đó là minh chứng cho sức mạnh của phát triển nguồn mở và tác động mà phần mềm chu đáo, được bảo trì tốt có thể mang lại cho hệ sinh thái rộng lớn hơn.

Trong những năm tới, chúng tôi cam kết:

* **Tiếp tục duy trì và cải thiện các gói hiện có của chúng tôi**, đảm bảo chúng vẫn là công cụ đáng tin cậy cho các nhà phát triển trên toàn thế giới.
* **Mở rộng các đóng góp của chúng tôi cho các dự án cơ sở hạ tầng quan trọng**, đặc biệt là trong các lĩnh vực email và bảo mật.
* **Nâng cao khả năng của Forward Email** trong khi vẫn duy trì cam kết của chúng tôi về quyền riêng tư, bảo mật và minh bạch.
* **Hỗ trợ thế hệ cộng tác viên nguồn mở tiếp theo** thông qua hoạt động cố vấn, tài trợ và tham gia cộng đồng.

Chúng tôi tin rằng tương lai của phát triển phần mềm là mở, hợp tác và được xây dựng trên nền tảng của sự tin tưởng. Bằng cách tiếp tục đóng góp các gói chất lượng cao, tập trung vào bảo mật cho hệ sinh thái JavaScript, chúng tôi hy vọng sẽ đóng góp một phần nhỏ vào việc xây dựng tương lai đó.

Xin cảm ơn tất cả mọi người đã sử dụng các gói của chúng tôi, đóng góp cho các dự án của chúng tôi, báo cáo các vấn đề hoặc chỉ đơn giản là truyền bá thông tin về công việc của chúng tôi. Sự hỗ trợ của bạn đã giúp thập kỷ tác động này trở nên khả thi và chúng tôi rất vui mừng khi thấy những gì chúng ta có thể cùng nhau hoàn thành trong mười năm tới.

\[^1]: Thống kê tải xuống npm cho cabin, tháng 4 năm 2025
\[^2]: Thống kê tải xuống npm cho bson-objectid, tháng 2-3 năm 2025
\[^3]: Thống kê tải xuống npm cho url-regex-safe, tháng 4 năm 2025
\[^4]: Số sao GitHub cho forwardemail/forwardemail.net tính đến tháng 4 năm 2025
\[^5]: Thống kê tải xuống npm cho preview-email, tháng 4 năm 2025
\[^7]: Thống kê tải xuống npm cho superagent, tháng 2-3 năm 2025
\[^8]: Thống kê tải xuống npm cho supertest, tháng 2-3 năm 2025
\[^9]: Thống kê tải xuống npm cho preview-email, tháng 2-3 năm 2025
\[^10]: Thống kê tải xuống npm cho cabin, tháng 2-3 năm 2025
\[^11]: Thống kê tải xuống npm cho url-regex-safe, Tháng 2-Tháng 3 năm 2025
\[^12]: Thống kê tải xuống npm cho spamscanner, tháng 2-Tháng 3 năm 2025
\[^13]: Mẫu tải xuống hàng ngày từ thống kê npm, tháng 4 năm 2025
\[^14]: Mẫu tải xuống hàng tuần từ thống kê npm, tháng 4 năm 2025
\[^15]: Thống kê tải xuống npm cho nodemailer, tháng 4 năm 2025
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/postalsys/mailauth/issues/73>
\[^27]: Dựa trên các sự cố GitHub trong kho lưu trữ Upptime
\[^28]: Dựa trên các sự cố GitHub trong kho lưu trữ Upptime
\[^29]: Dựa trên các sự cố GitHub trong kho lưu trữ Upptime
\[^30]: Thống kê tải xuống npm cho bree, tháng 2-3 năm 2025
\[^31]: Dựa trên các yêu cầu kéo GitHub tới Upptime
\[^32]: Dựa trên các yêu cầu kéo GitHub tới Upptime
\[^34]: Thống kê tải xuống npm cho koa, tháng 2-3 năm 2025
\[^35]: Thống kê tải xuống npm cho @koa/router, tháng 2-3 năm 2025
\[^36]: Thống kê tải xuống npm cho koa-router, tháng 2-3 năm 2025
\[^37]: Thống kê tải xuống npm cho url-regex, tháng 2-3 năm 2025
\[^38]: Thống kê tải xuống npm cho @breejs/later, tháng 2-3 năm 2025
\[^39]: Thống kê tải xuống npm cho email-templates, tháng 2-3 năm 2025
\[^40]: Thống kê tải xuống npm cho get-paths, tháng 2-3 năm 2025
\[^41]: Thống kê tải xuống npm cho dotenv-parse-variables, tháng 2-3 năm 2025
\[^42]: Thống kê tải xuống npm cho @koa/multer, tháng 2-3 năm 2025