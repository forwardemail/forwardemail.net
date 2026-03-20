# Một Thập Kỷ Ảnh Hưởng: Cách Các Gói npm Của Chúng Tôi Đạt 1 Tỷ Lượt Tải Xuống và Định Hình JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Mục Lục {#table-of-contents}

* [Lời Nói Đầu](#foreword)
* [Những Người Tiên Phong Tin Tưởng Chúng Tôi: Isaac Z. Schlueter và Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Từ Việc Tạo npm Đến Lãnh Đạo Node.js](#from-npms-creation-to-nodejs-leadership)
* [Kiến Trúc Sư Đằng Sau Mã Nguồn: Hành Trình Của Nick Baugh](#the-architect-behind-the-code-nick-baughs-journey)
  * [Ủy Ban Kỹ Thuật Express và Những Đóng Góp Cốt Lõi](#express-technical-committee-and-core-contributions)
  * [Những Đóng Góp Cho Framework Koa](#koa-framework-contributions)
  * [Từ Người Đóng Góp Cá Nhân Đến Nhà Lãnh Đạo Tổ Chức](#from-individual-contributor-to-organization-leader)
* [Các Tổ Chức GitHub Của Chúng Tôi: Hệ Sinh Thái Đổi Mới](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Ghi Nhật Ký Có Cấu Trúc Cho Ứng Dụng Hiện Đại](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Chống Lại Lạm Dụng Email](#spam-scanner-fighting-email-abuse)
  * [Bree: Lập Lịch Công Việc Hiện Đại Với Worker Threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Hạ Tầng Email Mã Nguồn Mở](#forward-email-open-source-email-infrastructure)
  * [Lad: Các Tiện Ích và Công Cụ Thiết Yếu Cho Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Giám Sát Thời Gian Hoạt Động Mã Nguồn Mở](#upptime-open-source-uptime-monitoring)
* [Những Đóng Góp Của Chúng Tôi Cho Hệ Sinh Thái Forward Email](#our-contributions-to-the-forward-email-ecosystem)
  * [Từ Các Gói Đến Sản Xuất](#from-packages-to-production)
  * [Vòng Phản Hồi](#the-feedback-loop)
* [Nguyên Tắc Cốt Lõi Của Forward Email: Nền Tảng Cho Sự Xuất Sắc](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Luôn Thân Thiện Với Nhà Phát Triển, Tập Trung Bảo Mật và Minh Bạch](#always-developer-friendly-security-focused-and-transparent)
  * [Tuân Thủ Các Nguyên Tắc Phát Triển Phần Mềm Đã Được Thử Thách Thời Gian](#adherence-to-time-tested-software-development-principles)
  * [Nhắm Đến Nhà Phát Triển Tự Lập, Tự Vực Dậy](#targeting-the-scrappy-bootstrapped-developer)
  * [Nguyên Tắc Trong Thực Tiễn: Mã Nguồn Forward Email](#principles-in-practice-the-forward-email-codebase)
  * [Bảo Mật Theo Thiết Kế](#privacy-by-design)
  * [Mã Nguồn Mở Bền Vững](#sustainable-open-source)
* [Con Số Không Nói Dối: Thống Kê Lượt Tải npm Đáng Kinh Ngạc Của Chúng Tôi](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Cái Nhìn Bao Quát Về Ảnh Hưởng Của Chúng Tôi](#a-birds-eye-view-of-our-impact)
  * [Ảnh Hưởng Hàng Ngày Ở Qui Mô Lớn](#daily-impact-at-scale)
  * [Vượt Ra Ngoài Các Con Số Thô](#beyond-the-raw-numbers)
* [Hỗ Trợ Hệ Sinh Thái: Các Tài Trợ Mã Nguồn Mở Của Chúng Tôi](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Người Tiên Phong Hạ Tầng Email](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Bộ Não Các Gói Tiện Ích](#sindre-sorhus-utility-package-mastermind)
* [Phát Hiện Lỗ Hổng Bảo Mật Trong Hệ Sinh Thái JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Cứu Hộ Koa-Router](#the-koa-router-rescue)
  * [Giải Quyết Lỗ Hổng ReDoS](#addressing-redos-vulnerabilities)
  * [Vận Động Cho Bảo Mật Node.js và Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Bảo Vệ Hạ Tầng npm](#securing-npm-infrastructure)
* [Những Đóng Góp Của Chúng Tôi Cho Hệ Sinh Thái Forward Email](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Nâng Cao Chức Năng Cốt Lõi Của Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Tiến Bộ Xác Thực Email Với Mailauth](#advancing-email-authentication-with-mailauth)
  * [Các Cải Tiến Quan Trọng Cho Upptime](#key-upptime-enhancements)
* [Chất Kết Dính Giữ Mọi Thứ Lại Với Nhau: Mã Tùy Chỉnh Ở Qui Mô Lớn](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Một Nỗ Lực Phát Triển Khổng Lồ](#a-massive-development-effort)
  * [Tích Hợp Các Phụ Thuộc Cốt Lõi](#core-dependencies-integration)
  * [Hạ Tầng DNS Với Tangerine và mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Ảnh Hưởng Doanh Nghiệp: Từ Mã Nguồn Mở Đến Giải Pháp Quan Trọng Với Nhiệm Vụ Sống Còn](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Các Nghiên Cứu Trường Hợp Về Hạ Tầng Email Quan Trọng Với Nhiệm Vụ Sống Còn](#case-studies-in-mission-critical-email-infrastructure)
* [Một Thập Kỷ Mã Nguồn Mở: Nhìn Về Tương Lai](#a-decade-of-open-source-looking-forward)
## Lời Nói Đầu {#foreword}

Trong thế giới [JavaScript](https://en.wikipedia.org/wiki/JavaScript) và [Node.js](https://en.wikipedia.org/wiki/Node.js), có những gói phần mềm thiết yếu—được tải xuống hàng triệu lần mỗi ngày và hỗ trợ các ứng dụng trên toàn thế giới. Đằng sau những công cụ này là các nhà phát triển tập trung vào chất lượng mã nguồn mở. Hôm nay, chúng tôi sẽ giới thiệu cách đội ngũ của chúng tôi giúp xây dựng và duy trì các gói npm đã trở thành phần quan trọng của hệ sinh thái JavaScript.


## Những Người Tiên Phong Tin Tưởng Chúng Tôi: Isaac Z. Schlueter và Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Chúng tôi tự hào có [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) là người dùng. Isaac là người tạo ra [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) và đã góp phần xây dựng [Node.js](https://en.wikipedia.org/wiki/Node.js). Sự tin tưởng của ông vào Forward Email thể hiện sự tập trung của chúng tôi vào chất lượng và bảo mật. Isaac sử dụng Forward Email cho nhiều tên miền bao gồm izs.me.

Ảnh hưởng của Isaac đối với JavaScript là rất lớn. Năm 2009, ông là một trong những người đầu tiên nhận ra tiềm năng của Node.js, làm việc cùng với [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), người tạo ra nền tảng này. Như Isaac đã nói trong một [phỏng vấn với tạp chí Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "Trong cộng đồng rất nhỏ gồm một nhóm người cố gắng tìm cách để JavaScript chạy phía máy chủ, Ryan Dahl đã ra mắt Node, rõ ràng là cách tiếp cận đúng đắn. Tôi đã đặt cược vào đó và tham gia rất sâu vào khoảng giữa năm 2009."

> \[!NOTE]
> Đối với những ai quan tâm đến lịch sử của Node.js, có những bộ phim tài liệu xuất sắc ghi lại quá trình phát triển của nó, bao gồm [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) và [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Trang web cá nhân của Ryan Dahl [personal website](https://tinyclouds.org/) cũng chứa nhiều thông tin quý giá về công việc của ông.

### Từ Việc Tạo Ra npm Đến Vai Trò Lãnh Đạo Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac đã tạo ra npm vào tháng 9 năm 2009, với phiên bản đầu tiên có thể sử dụng được phát hành đầu năm 2010. Trình quản lý gói này đáp ứng một nhu cầu quan trọng trong Node.js, cho phép các nhà phát triển dễ dàng chia sẻ và tái sử dụng mã. Theo [trang Wikipedia về Node.js](https://en.wikipedia.org/wiki/Node.js), "Vào tháng 1 năm 2010, một trình quản lý gói được giới thiệu cho môi trường Node.js có tên là npm. Trình quản lý gói cho phép lập trình viên xuất bản và chia sẻ các gói Node.js cùng với mã nguồn kèm theo, và được thiết kế để đơn giản hóa việc cài đặt, cập nhật và gỡ bỏ các gói."

Khi Ryan Dahl rút lui khỏi Node.js vào tháng 1 năm 2012, Isaac đã tiếp quản vai trò lãnh đạo dự án. Như được ghi trên [sơ yếu lý lịch của ông](https://izs.me/resume), ông "Dẫn dắt phát triển một số API lõi quan trọng của Node.js, bao gồm hệ thống module CommonJS, API hệ thống tập tin và streams" và "Đảm nhận vai trò BDFL (Benevolent Dictator For Life) của dự án trong 2 năm, đảm bảo chất lượng ngày càng cao và quy trình xây dựng đáng tin cậy cho các phiên bản Node.js từ v0.6 đến v0.10."

Isaac đã dẫn dắt Node.js qua một giai đoạn tăng trưởng quan trọng, thiết lập các tiêu chuẩn vẫn định hình nền tảng này cho đến ngày nay. Sau đó ông thành lập npm, Inc. vào năm 2014 để hỗ trợ registry npm, mà trước đó ông đã tự vận hành.

Chúng tôi cảm ơn Isaac vì những đóng góp to lớn cho JavaScript và tiếp tục sử dụng nhiều gói do ông tạo ra. Công việc của ông đã thay đổi cách chúng ta xây dựng phần mềm và cách hàng triệu nhà phát triển chia sẻ mã trên toàn thế giới.


## Kiến Trúc Sư Đằng Sau Mã Nguồn: Hành Trình Của Nick Baugh {#the-architect-behind-the-code-nick-baughs-journey}

Ở trung tâm thành công mã nguồn mở của chúng tôi là Nick Baugh, người sáng lập và chủ sở hữu Forward Email. Công việc của ông trong lĩnh vực JavaScript kéo dài gần 20 năm và đã định hình cách vô số nhà phát triển xây dựng ứng dụng. Hành trình mã nguồn mở của ông thể hiện cả kỹ năng kỹ thuật và khả năng lãnh đạo cộng đồng.

### Ủy Ban Kỹ Thuật Express và Những Đóng Góp Cốt Lõi {#express-technical-committee-and-core-contributions}

Chuyên môn về framework web của Nick đã giúp ông có vị trí trong [Ủy Ban Kỹ Thuật Express](https://expressjs.com/en/resources/community.html), nơi ông hỗ trợ một trong những framework Node.js được sử dụng nhiều nhất. Nick hiện được liệt kê là thành viên không hoạt động trên [trang cộng đồng Express](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Express ban đầu được tạo ra bởi TJ Holowaychuk, một đóng góp viên mã nguồn mở năng suất đã định hình nhiều phần của hệ sinh thái Node.js. Chúng tôi biết ơn công việc nền tảng của TJ và tôn trọng [quyết định nghỉ ngơi](https://news.ycombinator.com/item?id=37687017) của anh ấy khỏi các đóng góp mã nguồn mở rộng lớn của mình.

Là thành viên của [Ủy ban Kỹ thuật Express](https://expressjs.com/en/resources/community.html), Nick đã thể hiện sự chú ý tỉ mỉ đến các vấn đề như làm rõ tài liệu `req.originalUrl` và sửa các vấn đề xử lý form multipart.

### Đóng góp cho Framework Koa {#koa-framework-contributions}

Công việc của Nick với [framework Koa](https://github.com/koajs/koa)—một lựa chọn hiện đại, nhẹ hơn Express cũng do TJ Holowaychuk tạo ra—càng cho thấy cam kết của anh với các công cụ phát triển web tốt hơn. Các đóng góp của anh cho Koa bao gồm cả các vấn đề và mã thông qua các pull request, giải quyết xử lý lỗi, quản lý loại nội dung và cải tiến tài liệu.

Công việc của anh trên cả Express và Koa mang lại cho anh cái nhìn độc đáo về phát triển web Node.js, giúp đội ngũ chúng tôi tạo ra các gói làm việc tốt với nhiều hệ sinh thái framework khác nhau.

### Từ Người Đóng Góp Cá Nhân đến Nhà Lãnh Đạo Tổ Chức {#from-individual-contributor-to-organization-leader}

Những gì bắt đầu là giúp đỡ các dự án hiện có đã phát triển thành việc tạo và duy trì cả hệ sinh thái gói. Nick đã thành lập nhiều tổ chức GitHub—bao gồm [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs), và [Bree](https://github.com/breejs)—mỗi tổ chức giải quyết các nhu cầu cụ thể trong cộng đồng JavaScript.

Sự chuyển đổi từ người đóng góp thành nhà lãnh đạo này cho thấy tầm nhìn của Nick về phần mềm được thiết kế tốt để giải quyết các vấn đề thực tế. Bằng cách tổ chức các gói liên quan dưới các tổ chức GitHub tập trung, anh đã xây dựng các hệ sinh thái công cụ làm việc cùng nhau trong khi vẫn giữ được tính mô-đun và linh hoạt cho cộng đồng nhà phát triển rộng lớn hơn.


## Các Tổ Chức GitHub của Chúng Tôi: Hệ Sinh Thái Đổi Mới {#our-github-organizations-ecosystems-of-innovation}

Chúng tôi tổ chức công việc mã nguồn mở của mình quanh các tổ chức GitHub tập trung, mỗi tổ chức giải quyết các nhu cầu cụ thể trong JavaScript. Cấu trúc này tạo ra các gia đình gói gắn kết làm việc tốt cùng nhau trong khi vẫn giữ được tính mô-đun.

### Cabin: Ghi Log Có Cấu Trúc cho Ứng Dụng Hiện Đại {#cabin-structured-logging-for-modern-applications}

[Tổ chức Cabin](https://github.com/cabinjs) là cách tiếp cận của chúng tôi về ghi log ứng dụng đơn giản, mạnh mẽ. Gói chính [`cabin`](https://github.com/cabinjs/cabin) có gần 900 sao trên GitHub và hơn 100,000 lượt tải xuống hàng tuần\[^1]. Cabin cung cấp ghi log có cấu trúc hoạt động với các dịch vụ phổ biến như Sentry, LogDNA, và Papertrail.

Điều làm Cabin đặc biệt là API và hệ thống plugin được thiết kế kỹ lưỡng. Các gói hỗ trợ như [`axe`](https://github.com/cabinjs/axe) cho middleware Express và [`parse-request`](https://github.com/cabinjs/parse-request) cho phân tích yêu cầu HTTP thể hiện cam kết của chúng tôi với các giải pháp hoàn chỉnh thay vì các công cụ riêng lẻ.

Gói [`bson-objectid`](https://github.com/cabinjs/bson-objectid) xứng đáng được nhắc đến đặc biệt, với hơn 1.7 triệu lượt tải xuống chỉ trong hai tháng\[^2]. Triển khai nhẹ ObjectID MongoDB này đã trở thành lựa chọn hàng đầu cho các nhà phát triển cần ID mà không phụ thuộc đầy đủ vào MongoDB.

### Spam Scanner: Chống Lại Lạm Dụng Email {#spam-scanner-fighting-email-abuse}

[Tổ chức Spam Scanner](https://github.com/spamscanner) thể hiện cam kết của chúng tôi trong việc giải quyết các vấn đề thực tế. Gói chính [`spamscanner`](https://github.com/spamscanner/spamscanner) cung cấp phát hiện spam email nâng cao, nhưng gói [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) mới là gói được áp dụng rộng rãi đáng kinh ngạc.

Với hơn 1.2 triệu lượt tải xuống trong hai tháng\[^3], `url-regex-safe` sửa các vấn đề bảo mật nghiêm trọng trong các biểu thức chính quy phát hiện URL khác. Gói này thể hiện cách tiếp cận mã nguồn mở của chúng tôi: tìm một vấn đề phổ biến (trong trường hợp này là các lỗ hổng [ReDoS](https://en.wikipedia.org/wiki/ReDoS) trong xác thực URL), tạo ra giải pháp vững chắc, và duy trì nó cẩn thận.
### Bree: Lập lịch công việc hiện đại với Worker Threads {#bree-modern-job-scheduling-with-worker-threads}

[Tổ chức Bree](https://github.com/breejs) là câu trả lời của chúng tôi cho một thách thức phổ biến trong Node.js: lập lịch công việc đáng tin cậy. Gói chính [`bree`](https://github.com/breejs/bree), với hơn 3.100 sao trên GitHub, cung cấp một bộ lập lịch công việc hiện đại sử dụng worker threads của Node.js để cải thiện hiệu suất và độ tin cậy.

> \[!NOTE]
> Bree được tạo ra sau khi chúng tôi giúp duy trì [Agenda](https://github.com/agenda/agenda), áp dụng những bài học rút ra để xây dựng một bộ lập lịch công việc tốt hơn. Những đóng góp của chúng tôi cho Agenda đã giúp tìm ra cách cải thiện việc lập lịch công việc.

Điều làm Bree khác biệt so với các bộ lập lịch khác như Agenda:

* **Không phụ thuộc bên ngoài**: Khác với Agenda cần MongoDB, Bree không yêu cầu Redis hay MongoDB để quản lý trạng thái công việc.
* **Worker Threads**: Bree sử dụng worker threads của Node.js cho các tiến trình sandbox, mang lại sự cô lập và hiệu suất tốt hơn.
* **API đơn giản**: Bree cung cấp kiểm soát chi tiết với sự đơn giản, giúp dễ dàng triển khai các nhu cầu lập lịch phức tạp.
* **Hỗ trợ tích hợp sẵn**: Các tính năng như tải lại nhẹ nhàng, công việc cron, ngày tháng và thời gian thân thiện với người dùng đều được tích hợp mặc định.

Bree là phần quan trọng của [forwardemail.net](https://github.com/forwardemail/forwardemail.net), xử lý các tác vụ nền quan trọng như xử lý email, dọn dẹp và bảo trì theo lịch trình. Việc sử dụng Bree trong Forward Email thể hiện cam kết của chúng tôi trong việc sử dụng chính các công cụ của mình trong môi trường sản xuất, đảm bảo chúng đáp ứng các tiêu chuẩn độ tin cậy cao.

Chúng tôi cũng sử dụng và đánh giá cao các gói worker thread tuyệt vời khác như [piscina](https://github.com/piscinajs/piscina) và các client HTTP như [undici](https://github.com/nodejs/undici). Piscina, giống như Bree, sử dụng worker threads của Node.js để xử lý tác vụ hiệu quả. Chúng tôi cảm ơn [Matteo Collina](https://github.com/mcollina), người duy trì cả undici và piscina, vì những đóng góp lớn của anh cho Node.js. Matteo là thành viên của Ủy ban Điều hành Kỹ thuật Node.js và đã cải thiện đáng kể khả năng của client HTTP trong Node.js.

### Forward Email: Hạ tầng email mã nguồn mở {#forward-email-open-source-email-infrastructure}

Dự án tham vọng nhất của chúng tôi là [Forward Email](https://github.com/forwardemail), một dịch vụ email mã nguồn mở cung cấp chuyển tiếp email, lưu trữ và dịch vụ API. Kho lưu trữ chính có hơn 1.100 sao trên GitHub\[^4], thể hiện sự đánh giá cao của cộng đồng đối với giải pháp thay thế các dịch vụ email độc quyền.

Gói [`preview-email`](https://github.com/forwardemail/preview-email) từ tổ chức này, với hơn 2,5 triệu lượt tải trong hai tháng\[^5], đã trở thành công cụ thiết yếu cho các nhà phát triển làm việc với mẫu email. Bằng cách cung cấp một cách đơn giản để xem trước email trong quá trình phát triển, nó giải quyết một điểm đau phổ biến khi xây dựng các ứng dụng hỗ trợ email.

### Lad: Bộ công cụ và tiện ích thiết yếu cho Koa {#lad-essential-koa-utilities-and-tools}

[Tổ chức Lad](https://github.com/ladjs) cung cấp một bộ sưu tập các tiện ích và công cụ thiết yếu chủ yếu tập trung vào việc nâng cao hệ sinh thái framework Koa. Các gói này giải quyết các thách thức phổ biến trong phát triển web và được thiết kế để hoạt động liền mạch cùng nhau trong khi vẫn hữu ích độc lập.

#### koa-better-error-handler: Cải thiện xử lý lỗi cho Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) cung cấp giải pháp xử lý lỗi tốt hơn cho các ứng dụng Koa. Với hơn 50 sao trên GitHub, gói này giúp `ctx.throw` tạo ra các thông báo lỗi thân thiện với người dùng đồng thời khắc phục một số hạn chế của trình xử lý lỗi tích hợp sẵn của Koa:

* Phát hiện và xử lý đúng các lỗi DNS của Node.js, lỗi Mongoose và lỗi Redis
* Sử dụng [Boom](https://github.com/hapijs/boom) để tạo các phản hồi lỗi nhất quán, định dạng tốt
* Giữ nguyên các header (khác với trình xử lý tích hợp của Koa)
* Duy trì mã trạng thái phù hợp thay vì mặc định là 500
* Hỗ trợ thông báo flash và bảo tồn phiên làm việc
* Cung cấp danh sách lỗi HTML cho các lỗi xác thực
* Hỗ trợ nhiều loại phản hồi (HTML, JSON và văn bản thuần túy)
Gói này đặc biệt có giá trị khi được sử dụng cùng với [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) để quản lý lỗi toàn diện trong các ứng dụng Koa.

#### passport: Xác thực cho Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) mở rộng middleware xác thực phổ biến Passport.js với các cải tiến cụ thể cho các ứng dụng web hiện đại. Gói này hỗ trợ nhiều chiến lược xác thực ngay từ đầu:

* Xác thực cục bộ bằng email
* Đăng nhập với Apple
* Xác thực GitHub
* Xác thực Google
* Xác thực mật khẩu dùng một lần (OTP)

Gói này rất dễ tùy chỉnh, cho phép các nhà phát triển điều chỉnh tên trường và cụm từ để phù hợp với yêu cầu của ứng dụng. Nó được thiết kế để tích hợp liền mạch với Mongoose cho quản lý người dùng, làm cho nó trở thành giải pháp lý tưởng cho các ứng dụng dựa trên Koa cần xác thực mạnh mẽ.

#### graceful: Tắt Ứng dụng Thanh lịch {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) giải quyết thách thức quan trọng trong việc tắt ứng dụng Node.js một cách thanh lịch. Với hơn 70 sao trên GitHub, gói này đảm bảo rằng ứng dụng của bạn có thể kết thúc một cách sạch sẽ mà không mất dữ liệu hoặc để lại các kết nối treo. Các tính năng chính bao gồm:

* Hỗ trợ đóng máy chủ HTTP một cách thanh lịch (Express/Koa/Fastify)
* Tắt kết nối cơ sở dữ liệu sạch sẽ (MongoDB/Mongoose)
* Đóng đúng cách các client Redis
* Xử lý các bộ lập lịch công việc Bree
* Hỗ trợ các trình xử lý tắt tùy chỉnh
* Cấu hình thời gian chờ
* Tích hợp với hệ thống ghi log

Gói này rất cần thiết cho các ứng dụng sản xuất nơi việc tắt đột ngột có thể dẫn đến mất hoặc hỏng dữ liệu. Bằng cách thực hiện các quy trình tắt đúng cách, `@ladjs/graceful` giúp đảm bảo độ tin cậy và ổn định của ứng dụng của bạn.

### Upptime: Giám sát Thời gian Hoạt động Mã nguồn Mở {#upptime-open-source-uptime-monitoring}

[Tổ chức Upptime](https://github.com/upptime) đại diện cho cam kết của chúng tôi về giám sát minh bạch, mã nguồn mở. Kho chính [`upptime`](https://github.com/upptime/upptime) có hơn 13.000 sao trên GitHub, làm cho nó trở thành một trong những dự án phổ biến nhất mà chúng tôi đóng góp. Upptime cung cấp một công cụ giám sát thời gian hoạt động và trang trạng thái chạy hoàn toàn không cần máy chủ, dựa trên GitHub.

Chúng tôi sử dụng Upptime cho trang trạng thái của riêng mình tại <https://status.forwardemail.net> với mã nguồn có sẵn tại <https://github.com/forwardemail/status.forwardemail.net>.

Điều làm cho Upptime đặc biệt là kiến trúc của nó:

* **100% Mã nguồn mở**: Mọi thành phần đều hoàn toàn mã nguồn mở và có thể tùy chỉnh.
* **Dựa trên GitHub**: Tận dụng GitHub Actions, Issues và Pages cho giải pháp giám sát không máy chủ.
* **Không cần máy chủ**: Khác với các công cụ giám sát truyền thống, Upptime không yêu cầu bạn vận hành hoặc duy trì máy chủ.
* **Trang trạng thái tự động**: Tạo ra một trang trạng thái đẹp mắt có thể được lưu trữ trên GitHub Pages.
* **Thông báo mạnh mẽ**: Tích hợp với nhiều kênh thông báo bao gồm email, SMS và Slack.

Để nâng cao trải nghiệm người dùng, chúng tôi đã tích hợp [@octokit/core](https://github.com/octokit/core.js/) vào mã nguồn forwardemail.net để hiển thị các cập nhật trạng thái và sự cố theo thời gian thực trực tiếp trên trang web của chúng tôi. Việc tích hợp này cung cấp sự minh bạch rõ ràng cho người dùng trong trường hợp có bất kỳ sự cố nào trên toàn bộ hệ thống của chúng tôi (Website, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, v.v.) với các thông báo toast tức thì, thay đổi biểu tượng huy hiệu, màu cảnh báo và nhiều hơn nữa.

Thư viện @octokit/core cho phép chúng tôi lấy dữ liệu thời gian thực từ kho Upptime trên GitHub, xử lý và hiển thị nó theo cách thân thiện với người dùng. Khi bất kỳ dịch vụ nào gặp sự cố hoặc hiệu suất giảm, người dùng sẽ được thông báo ngay lập tức qua các chỉ báo trực quan mà không cần rời khỏi ứng dụng chính. Việc tích hợp liền mạch này đảm bảo người dùng luôn có thông tin cập nhật về trạng thái hệ thống của chúng tôi, tăng cường tính minh bạch và sự tin tưởng.

Upptime đã được hàng trăm tổ chức áp dụng nhằm tìm kiếm một cách giám sát minh bạch, đáng tin cậy và truyền đạt trạng thái đến người dùng. Thành công của dự án cho thấy sức mạnh của việc xây dựng các công cụ tận dụng hạ tầng hiện có (trong trường hợp này là GitHub) để giải quyết các vấn đề phổ biến theo những cách mới.
## Những Đóng Góp của Chúng Tôi cho Hệ Sinh Thái Forward Email {#our-contributions-to-the-forward-email-ecosystem}

Trong khi các gói mã nguồn mở của chúng tôi được các nhà phát triển trên toàn thế giới sử dụng, chúng cũng tạo thành nền tảng cho dịch vụ Forward Email của chính chúng tôi. Vai trò kép này — vừa là người tạo ra vừa là người sử dụng các công cụ này — mang lại cho chúng tôi một góc nhìn độc đáo về ứng dụng thực tế của chúng và thúc đẩy sự cải tiến liên tục.

### Từ Các Gói Đến Sản Xuất {#from-packages-to-production}

Hành trình từ các gói riêng lẻ đến một hệ thống sản xuất thống nhất đòi hỏi sự tích hợp và mở rộng cẩn thận. Đối với Forward Email, quá trình này bao gồm:

* **Mở Rộng Tùy Chỉnh**: Xây dựng các phần mở rộng riêng cho Forward Email trên các gói mã nguồn mở của chúng tôi nhằm đáp ứng các yêu cầu đặc thù.
* **Mẫu Tích Hợp**: Phát triển các mẫu cho cách các gói này tương tác trong môi trường sản xuất.
* **Tối Ưu Hiệu Suất**: Xác định và giải quyết các nút thắt hiệu suất chỉ xuất hiện ở quy mô lớn.
* **Tăng Cường Bảo Mật**: Thêm các lớp bảo mật bổ sung đặc thù cho việc xử lý email và bảo vệ dữ liệu người dùng.

Công việc này đại diện cho hàng ngàn giờ phát triển vượt ra ngoài các gói lõi, tạo ra một dịch vụ email mạnh mẽ, an toàn tận dụng tối đa những đóng góp mã nguồn mở của chúng tôi.

### Vòng Phản Hồi {#the-feedback-loop}

Có lẽ khía cạnh giá trị nhất của việc sử dụng các gói của chính chúng tôi trong sản xuất là vòng phản hồi mà nó tạo ra. Khi chúng tôi gặp phải các giới hạn hoặc trường hợp đặc biệt trong Forward Email, chúng tôi không chỉ vá lỗi cục bộ — mà còn cải thiện các gói nền tảng, mang lại lợi ích cho cả dịch vụ của chúng tôi và cộng đồng rộng lớn hơn.

Cách tiếp cận này đã dẫn đến nhiều cải tiến:

* **Tắt Máy Mượt Mà của Bree**: Nhu cầu triển khai không gián đoạn của Forward Email đã thúc đẩy khả năng tắt máy mượt mà được nâng cao trong Bree.
* **Nhận Diện Mẫu của Bộ Quét Spam**: Các mẫu spam thực tế gặp phải trong Forward Email đã giúp cải thiện thuật toán phát hiện của Bộ Quét Spam.
* **Tối Ưu Hiệu Suất của Cabin**: Việc ghi nhật ký với khối lượng lớn trong sản xuất đã tiết lộ các cơ hội tối ưu hóa trong Cabin, mang lại lợi ích cho tất cả người dùng.

Bằng cách duy trì chu trình tích cực giữa công việc mã nguồn mở và dịch vụ sản xuất, chúng tôi đảm bảo các gói của mình luôn là giải pháp thực tiễn, được kiểm chứng thay vì chỉ là các triển khai lý thuyết.


## Nguyên Tắc Cốt Lõi của Forward Email: Nền Tảng Cho Sự Xuất Sắc {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email được thiết kế dựa trên một tập hợp các nguyên tắc cốt lõi hướng dẫn tất cả các quyết định phát triển của chúng tôi. Những nguyên tắc này, được trình bày chi tiết trên [website](/blog/docs/best-quantum-safe-encrypted-email-service#principles), đảm bảo dịch vụ của chúng tôi luôn thân thiện với nhà phát triển, an toàn và tập trung vào quyền riêng tư của người dùng.

### Luôn Thân Thiện Với Nhà Phát Triển, Tập Trung Bảo Mật và Minh Bạch {#always-developer-friendly-security-focused-and-transparent}

Nguyên tắc đầu tiên và quan trọng nhất của chúng tôi là tạo ra phần mềm thân thiện với nhà phát triển đồng thời duy trì các tiêu chuẩn cao nhất về bảo mật và quyền riêng tư. Chúng tôi tin rằng sự xuất sắc kỹ thuật không bao giờ nên đánh đổi bằng tính dễ sử dụng, và sự minh bạch xây dựng niềm tin với cộng đồng của chúng tôi.

Nguyên tắc này thể hiện qua tài liệu chi tiết, thông báo lỗi rõ ràng và giao tiếp cởi mở về cả thành công lẫn thách thức. Bằng cách công khai toàn bộ mã nguồn, chúng tôi mời gọi sự giám sát và hợp tác, củng cố cả phần mềm và hệ sinh thái rộng lớn hơn.

### Tuân Thủ Các Nguyên Tắc Phát Triển Phần Mềm Đã Được Kiểm Chứng Qua Thời Gian {#adherence-to-time-tested-software-development-principles}

Chúng tôi tuân theo một số nguyên tắc phát triển phần mềm đã được chứng minh giá trị qua nhiều thập kỷ:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Tách biệt các mối quan tâm thông qua mẫu Model-View-Controller
* **[Triết lý Unix](https://en.wikipedia.org/wiki/Unix_philosophy)**: Tạo các thành phần mô-đun làm tốt một việc duy nhất
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Giữ cho đơn giản và rõ ràng
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Không lặp lại chính mình, thúc đẩy tái sử dụng mã
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Bạn sẽ không cần nó, tránh tối ưu hóa sớm
* **[Twelve Factor](https://12factor.net/)**: Tuân theo các thực hành tốt nhất để xây dựng ứng dụng hiện đại, có khả năng mở rộng
* **[Dao cạo Occam](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Chọn giải pháp đơn giản nhất đáp ứng yêu cầu
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Sử dụng sản phẩm của chính chúng tôi một cách rộng rãi
Những nguyên tắc này không chỉ là các khái niệm lý thuyết—chúng được tích hợp trong các thực hành phát triển hàng ngày của chúng tôi. Ví dụ, việc tuân thủ triết lý Unix của chúng tôi thể hiện rõ trong cách chúng tôi cấu trúc các gói npm: các mô-đun nhỏ, tập trung có thể kết hợp với nhau để giải quyết các vấn đề phức tạp.

### Nhắm tới Nhà Phát Triển Tự Lập, Tự Vốn {#targeting-the-scrappy-bootstrapped-developer}

Chúng tôi đặc biệt nhắm tới những nhà phát triển tự lập, tự vốn, và [đạt lợi nhuận ramen](https://www.paulgraham.com/ramenprofitable.html). Sự tập trung này định hình mọi thứ từ mô hình giá cả đến các quyết định kỹ thuật của chúng tôi. Chúng tôi hiểu những thách thức khi xây dựng sản phẩm với nguồn lực hạn chế vì chính chúng tôi cũng đã trải qua điều đó.

Nguyên tắc này đặc biệt quan trọng trong cách chúng tôi tiếp cận mã nguồn mở. Chúng tôi tạo và duy trì các gói giải quyết các vấn đề thực tế cho các nhà phát triển không có ngân sách doanh nghiệp, giúp các công cụ mạnh mẽ trở nên dễ tiếp cận với mọi người bất kể nguồn lực của họ.

### Nguyên Tắc Trong Thực Tiễn: Mã Nguồn Forward Email {#principles-in-practice-the-forward-email-codebase}

Những nguyên tắc này thể hiện rõ trong mã nguồn Forward Email. Tệp package.json của chúng tôi tiết lộ một lựa chọn kỹ lưỡng các phụ thuộc, mỗi cái được chọn để phù hợp với các giá trị cốt lõi của chúng tôi:

* Các gói tập trung vào bảo mật như `mailauth` cho xác thực email
* Công cụ thân thiện với nhà phát triển như `preview-email` giúp gỡ lỗi dễ dàng hơn
* Các thành phần mô-đun như các tiện ích `p-*` khác nhau từ Sindre Sorhus

Bằng cách tuân thủ những nguyên tắc này một cách nhất quán theo thời gian, chúng tôi đã xây dựng một dịch vụ mà các nhà phát triển có thể tin tưởng cho hạ tầng email của họ—an toàn, đáng tin cậy và phù hợp với các giá trị của cộng đồng mã nguồn mở.

### Bảo Mật Theo Thiết Kế {#privacy-by-design}

Bảo mật không phải là suy nghĩ muộn hay tính năng marketing đối với Forward Email—đó là một nguyên tắc thiết kế cơ bản định hướng mọi khía cạnh của dịch vụ và mã nguồn của chúng tôi:

* **Mã hóa Không Truy Cập**: Chúng tôi đã triển khai các hệ thống khiến chúng tôi không thể đọc email của người dùng về mặt kỹ thuật.
* **Thu Thập Dữ Liệu Tối Thiểu**: Chúng tôi chỉ thu thập dữ liệu cần thiết để cung cấp dịch vụ, không hơn.
* **Chính Sách Minh Bạch**: Chính sách bảo mật của chúng tôi được viết bằng ngôn ngữ rõ ràng, dễ hiểu, không có thuật ngữ pháp lý.
* **Xác Minh Mã Nguồn Mở**: Mã nguồn mở của chúng tôi cho phép các nhà nghiên cứu bảo mật xác minh các tuyên bố về bảo mật.

Cam kết này mở rộng đến các gói mã nguồn mở của chúng tôi, được thiết kế với các thực hành tốt nhất về bảo mật và quyền riêng tư ngay từ đầu.

### Mã Nguồn Mở Bền Vững {#sustainable-open-source}

Chúng tôi tin rằng phần mềm mã nguồn mở cần các mô hình bền vững để phát triển lâu dài. Cách tiếp cận của chúng tôi bao gồm:

* **Hỗ Trợ Thương Mại**: Cung cấp hỗ trợ và dịch vụ cao cấp xung quanh các công cụ mã nguồn mở của chúng tôi.
* **Cấp Phép Cân Bằng**: Sử dụng các giấy phép bảo vệ cả quyền tự do người dùng và sự bền vững của dự án.
* **Tham Gia Cộng Đồng**: Chủ động tương tác với các đóng góp viên để xây dựng một cộng đồng hỗ trợ.
* **Lộ Trình Minh Bạch**: Chia sẻ kế hoạch phát triển để người dùng có thể lên kế hoạch phù hợp.

Bằng cách tập trung vào sự bền vững, chúng tôi đảm bảo các đóng góp mã nguồn mở của mình có thể tiếp tục phát triển và cải tiến theo thời gian thay vì bị bỏ quên.

## Con Số Không Nói Dối: Thống Kê Tải Về npm Ấn Tượng Của Chúng Tôi {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Khi nói về tác động của phần mềm mã nguồn mở, thống kê tải về cung cấp một thước đo cụ thể về sự chấp nhận và tin tưởng. Nhiều gói mà chúng tôi giúp duy trì đã đạt quy mô mà ít dự án mã nguồn mở nào từng đạt được, với tổng số lượt tải lên đến hàng tỷ.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Mặc dù chúng tôi tự hào giúp duy trì một số gói được tải về nhiều trong hệ sinh thái JavaScript, chúng tôi muốn ghi nhận rằng nhiều gói này ban đầu được tạo ra bởi các nhà phát triển tài năng khác. Các gói như superagent và supertest ban đầu được tạo bởi TJ Holowaychuk, người có những đóng góp phong phú cho mã nguồn mở đã đóng vai trò quan trọng trong việc hình thành hệ sinh thái Node.js.
### Tổng Quan Về Tác Động Của Chúng Tôi {#a-birds-eye-view-of-our-impact}

Chỉ trong khoảng thời gian hai tháng từ tháng Hai đến tháng Ba năm 2025, các gói hàng đầu mà chúng tôi đóng góp và hỗ trợ duy trì đã ghi nhận số lượt tải xuống đáng kinh ngạc:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84,575,829 lượt tải xuống\[^7] (ban đầu được tạo bởi TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76,432,591 lượt tải xuống\[^8] (ban đầu được tạo bởi TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28,539,295 lượt tải xuống\[^34] (ban đầu được tạo bởi TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11,007,327 lượt tải xuống\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3,498,918 lượt tải xuống\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2,819,520 lượt tải xuống\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2,500,000 lượt tải xuống\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1,800,000 lượt tải xuống\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1,709,938 lượt tải xuống\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1,128,139 lượt tải xuống\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1,124,686 lượt tải xuống\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1,200,000 lượt tải xuống\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894,666 lượt tải xuống\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839,585 lượt tải xuống\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145,000 lượt tải xuống\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24,270 lượt tải xuống\[^30]

> \[!NOTE]
> Một số gói khác mà chúng tôi hỗ trợ duy trì nhưng không tạo ra có số lượt tải xuống còn cao hơn, bao gồm `form-data` (hơn 738 triệu lượt tải xuống), `toidentifier` (hơn 309 triệu lượt tải xuống), `stackframe` (hơn 116 triệu lượt tải xuống), và `error-stack-parser` (hơn 113 triệu lượt tải xuống). Chúng tôi rất vinh dự được đóng góp cho các gói này trong khi tôn trọng công sức của các tác giả gốc.

Những con số này không chỉ ấn tượng mà còn đại diện cho các nhà phát triển thực sự đang giải quyết các vấn đề thực tế với mã nguồn mà chúng tôi giúp duy trì. Mỗi lượt tải xuống là một trường hợp mà các gói này đã giúp ai đó xây dựng điều gì đó có ý nghĩa, từ các dự án sở thích đến các ứng dụng doanh nghiệp được hàng triệu người sử dụng.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Tác Động Hàng Ngày Ở Quy Mô Lớn {#daily-impact-at-scale}

Mô hình tải xuống hàng ngày cho thấy mức sử dụng ổn định và khối lượng lớn, với các đỉnh điểm đạt đến hàng triệu lượt tải xuống mỗi ngày\[^13]. Sự ổn định này cho thấy tính ổn định và độ tin cậy của các gói này—các nhà phát triển không chỉ thử nghiệm chúng; họ tích hợp chúng vào quy trình làm việc cốt lõi và phụ thuộc vào chúng ngày này qua ngày khác.

Mô hình tải xuống hàng tuần còn ấn tượng hơn, luôn duy trì ở mức hàng chục triệu lượt tải xuống mỗi tuần\[^14]. Điều này thể hiện dấu chân khổng lồ trong hệ sinh thái JavaScript, với các gói này chạy trong các môi trường sản xuất trên toàn cầu.

### Vượt Xa Các Con Số Thô {#beyond-the-raw-numbers}

Mặc dù thống kê lượt tải xuống đã rất ấn tượng, chúng kể một câu chuyện sâu sắc hơn về sự tin tưởng mà cộng đồng đặt vào các gói này. Việc duy trì các gói ở quy mô này đòi hỏi một cam kết không ngừng nghỉ đối với:

* **Tương Thích Ngược**: Các thay đổi phải được cân nhắc kỹ lưỡng để tránh làm hỏng các triển khai hiện có.
* **Bảo Mật**: Với hàng triệu ứng dụng phụ thuộc vào các gói này, các lỗ hổng bảo mật có thể gây ra hậu quả sâu rộng.
* **Hiệu Suất**: Ở quy mô này, ngay cả những cải tiến hiệu suất nhỏ cũng có thể mang lại lợi ích tổng hợp đáng kể.
* **Tài Liệu**: Tài liệu rõ ràng, toàn diện là điều thiết yếu cho các gói được sử dụng bởi các nhà phát triển ở mọi cấp độ kinh nghiệm.

Sự tăng trưởng ổn định trong số lượt tải xuống theo thời gian phản ánh thành công trong việc đáp ứng các cam kết này, xây dựng niềm tin với cộng đồng nhà phát triển thông qua các gói tin cậy và được duy trì tốt.
## Hỗ Trợ Hệ Sinh Thái: Các Tài Trợ Mã Nguồn Mở Của Chúng Tôi {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Tính bền vững của mã nguồn mở không chỉ là đóng góp mã—mà còn là hỗ trợ các nhà phát triển duy trì hạ tầng quan trọng.

Ngoài các đóng góp trực tiếp cho hệ sinh thái JavaScript, chúng tôi tự hào tài trợ cho các đóng góp viên nổi bật của Node.js, những người có công tạo nền tảng cho nhiều ứng dụng hiện đại. Các khoản tài trợ của chúng tôi bao gồm:

### Andris Reinman: Người Tiên Phong Hạ Tầng Email {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) là người tạo ra [Nodemailer](https://github.com/nodemailer/nodemailer), thư viện gửi email phổ biến nhất cho Node.js với hơn 14 triệu lượt tải xuống hàng tuần\[^15]. Công việc của anh còn mở rộng đến các thành phần hạ tầng email quan trọng khác như [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser), và [WildDuck](https://github.com/nodemailer/wildduck).

Khoản tài trợ của chúng tôi giúp đảm bảo việc duy trì và phát triển liên tục các công cụ thiết yếu này, hỗ trợ giao tiếp email cho vô số ứng dụng Node.js, bao gồm cả dịch vụ Forward Email của chúng tôi.

### Sindre Sorhus: Bậc Thầy Gói Tiện Ích {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) là một trong những đóng góp viên mã nguồn mở năng suất nhất trong hệ sinh thái JavaScript, với hơn 1.000 gói npm mang tên anh. Các tiện ích của anh như [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry), và [is-stream](https://github.com/sindresorhus/is-stream) là những khối xây dựng cơ bản được sử dụng rộng rãi trong hệ sinh thái Node.js.

Bằng cách tài trợ cho công việc của Sindre, chúng tôi giúp duy trì phát triển các tiện ích quan trọng này, làm cho việc phát triển JavaScript trở nên hiệu quả và đáng tin cậy hơn.

Những khoản tài trợ này phản ánh cam kết của chúng tôi đối với hệ sinh thái mã nguồn mở rộng lớn hơn. Chúng tôi nhận thức rằng thành công của chính mình được xây dựng trên nền tảng do những đóng góp viên này và nhiều người khác tạo ra, và chúng tôi tận tâm đảm bảo tính bền vững của toàn bộ hệ sinh thái.


## Khám Phá Lỗ Hổng Bảo Mật Trong Hệ Sinh Thái JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Cam kết của chúng tôi với mã nguồn mở không chỉ dừng lại ở phát triển tính năng mà còn bao gồm việc xác định và xử lý các lỗ hổng bảo mật có thể ảnh hưởng đến hàng triệu nhà phát triển. Một số đóng góp quan trọng nhất của chúng tôi cho hệ sinh thái JavaScript nằm trong lĩnh vực bảo mật.

### Cứu Hộ Koa-Router {#the-koa-router-rescue}

Vào tháng 2 năm 2019, Nick đã phát hiện một vấn đề nghiêm trọng về việc duy trì gói koa-router phổ biến. Như anh ấy đã [báo cáo trên Hacker News](https://news.ycombinator.com/item?id=19156707), gói này đã bị người duy trì ban đầu bỏ rơi, để lại các lỗ hổng bảo mật chưa được xử lý và cộng đồng không có bản cập nhật.

> \[!WARNING]
> Các gói bị bỏ rơi có lỗ hổng bảo mật gây ra rủi ro lớn cho toàn bộ hệ sinh thái, đặc biệt khi chúng được tải xuống hàng triệu lần mỗi tuần.

Đáp lại, Nick đã tạo ra [@koa/router](https://github.com/koajs/router) và giúp cảnh báo cộng đồng về tình hình này. Anh đã duy trì gói quan trọng này kể từ đó, đảm bảo người dùng Koa có một giải pháp định tuyến an toàn và được duy trì tốt.

### Xử Lý Lỗ Hổng ReDoS {#addressing-redos-vulnerabilities}

Năm 2020, Nick đã phát hiện và xử lý một lỗ hổng nghiêm trọng [Tấn công Từ chối Dịch vụ Biểu thức Chính quy (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) trong gói `url-regex` được sử dụng rộng rãi. Lỗ hổng này ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) có thể cho phép kẻ tấn công gây ra tấn công từ chối dịch vụ bằng cách cung cấp đầu vào được tạo đặc biệt khiến biểu thức chính quy bị truy vết ngược thảm họa.

Thay vì chỉ vá gói hiện có, Nick đã tạo ra [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), một triển khai hoàn toàn viết lại nhằm xử lý lỗ hổng trong khi vẫn giữ tương thích với API gốc. Anh cũng đã xuất bản một [bài đăng blog toàn diện](/blog/docs/url-regex-javascript-node-js) giải thích về lỗ hổng và cách giảm thiểu nó.
Công trình này thể hiện cách tiếp cận của chúng tôi đối với bảo mật: không chỉ sửa các vấn đề mà còn giáo dục cộng đồng và cung cấp các giải pháp thay thế mạnh mẽ nhằm ngăn ngừa các vấn đề tương tự trong tương lai.

### Vận động cho Bảo mật Node.js và Chromium {#advocating-for-nodejs-and-chromium-security}

Nick cũng đã tích cực vận động cải thiện bảo mật trong hệ sinh thái rộng lớn hơn. Vào tháng 8 năm 2020, anh đã phát hiện một vấn đề bảo mật nghiêm trọng trong Node.js liên quan đến cách xử lý các header HTTP, được báo cáo trên [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Vấn đề này, bắt nguồn từ một bản vá trong Chromium, có thể cho phép kẻ tấn công vượt qua các biện pháp bảo mật. Việc vận động của Nick đã giúp đảm bảo rằng vấn đề được xử lý kịp thời, bảo vệ hàng triệu ứng dụng Node.js khỏi nguy cơ bị khai thác.

### Bảo mật Hạ tầng npm {#securing-npm-infrastructure}

Cùng tháng đó, Nick phát hiện một vấn đề bảo mật quan trọng khác, lần này trong hạ tầng email của npm. Như được báo cáo trên [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm không thực hiện đúng các giao thức xác thực email DMARC, SPF và DKIM, có thể cho phép kẻ tấn công gửi email lừa đảo giả mạo từ npm.

Báo cáo của Nick đã dẫn đến việc cải thiện tình trạng bảo mật email của npm, bảo vệ hàng triệu nhà phát triển dựa vào npm để quản lý gói khỏi các cuộc tấn công lừa đảo tiềm ẩn.


## Những Đóng Góp của Chúng Tôi cho Hệ Sinh Thái Forward Email {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email được xây dựng dựa trên một số dự án mã nguồn mở quan trọng, bao gồm Nodemailer, WildDuck và mailauth. Đội ngũ của chúng tôi đã có những đóng góp đáng kể cho các dự án này, giúp phát hiện và sửa các vấn đề sâu sắc ảnh hưởng đến việc gửi và bảo mật email.

### Nâng cao Chức Năng Cốt Lõi của Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) là nền tảng gửi email trong Node.js, và các đóng góp của chúng tôi đã giúp nó trở nên vững chắc hơn:

* **Cải tiến Máy chủ SMTP**: Chúng tôi đã sửa các lỗi phân tích cú pháp, vấn đề xử lý luồng và cấu hình TLS trong thành phần máy chủ SMTP\[^16]\[^17].
* **Cải tiến Bộ phân tích Mail**: Chúng tôi đã khắc phục lỗi giải mã chuỗi ký tự và các vấn đề bộ phân tích địa chỉ có thể gây lỗi xử lý email\[^18]\[^19].

Những đóng góp này đảm bảo Nodemailer vẫn là nền tảng đáng tin cậy cho xử lý email trong các ứng dụng Node.js, bao gồm Forward Email.

### Tiến bộ trong Xác thực Email với Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) cung cấp chức năng xác thực email quan trọng, và các đóng góp của chúng tôi đã cải thiện đáng kể khả năng của nó:

* **Cải tiến Xác minh DKIM**: Chúng tôi phát hiện và báo cáo rằng X/Twitter gặp sự cố bộ nhớ đệm DNS gây thất bại DKIM cho các tin nhắn gửi đi của họ, đã báo cáo trên Hacker One\[^20].
* **Cải tiến DMARC và ARC**: Chúng tôi đã sửa các vấn đề với xác minh DMARC và ARC có thể dẫn đến kết quả xác thực sai\[^21]\[^22].
* **Tối ưu Hiệu suất**: Chúng tôi đã đóng góp các tối ưu giúp cải thiện hiệu suất của các quy trình xác thực email\[^23]\[^24]\[^25]\[^26].

Những cải tiến này giúp đảm bảo xác thực email chính xác và đáng tin cậy, bảo vệ người dùng khỏi các cuộc tấn công lừa đảo và giả mạo.

### Các Cải tiến Quan trọng cho Upptime {#key-upptime-enhancements}

Các đóng góp của chúng tôi cho Upptime bao gồm:

* **Giám sát Chứng chỉ SSL**: Chúng tôi đã thêm chức năng giám sát ngày hết hạn chứng chỉ SSL, ngăn ngừa thời gian chết không mong muốn do chứng chỉ hết hạn\[^27].
* **Hỗ trợ Nhiều Số SMS**: Chúng tôi đã triển khai hỗ trợ cảnh báo nhiều thành viên trong nhóm qua SMS khi có sự cố xảy ra, cải thiện thời gian phản hồi\[^28].
* **Sửa lỗi Kiểm tra IPv6**: Chúng tôi đã sửa các vấn đề với kiểm tra kết nối IPv6, đảm bảo giám sát chính xác hơn trong môi trường mạng hiện đại\[^29].
* **Hỗ trợ Chế độ Tối/Sáng**: Chúng tôi đã thêm hỗ trợ chủ đề để cải thiện trải nghiệm người dùng của các trang trạng thái\[^31].
* **Hỗ trợ TCP-Ping Tốt hơn**: Chúng tôi đã nâng cao chức năng ping TCP để cung cấp kiểm tra kết nối đáng tin cậy hơn\[^32].
Những cải tiến này không chỉ có lợi cho việc giám sát trạng thái của Forward Email mà còn có sẵn cho toàn bộ cộng đồng người dùng Upptime, thể hiện cam kết của chúng tôi trong việc cải thiện các công cụ mà chúng tôi phụ thuộc.

## Chất Kết Nối Giữ Mọi Thứ Lại Với Nhau: Mã Tùy Chỉnh Quy Mô Lớn {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Trong khi các gói npm và đóng góp của chúng tôi cho các dự án hiện có là quan trọng, thì chính mã tùy chỉnh tích hợp các thành phần này mới thực sự thể hiện chuyên môn kỹ thuật của chúng tôi. Mã nguồn Forward Email đại diện cho một thập kỷ nỗ lực phát triển, bắt đầu từ năm 2017 khi dự án khởi đầu dưới tên [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) trước khi được hợp nhất vào một monorepo.

### Nỗ Lực Phát Triển Khổng Lồ {#a-massive-development-effort}

Quy mô của mã tích hợp tùy chỉnh này thật ấn tượng:

* **Tổng số đóng góp**: Hơn 3,217 lần cam kết
* **Kích thước mã nguồn**: Hơn 421,545 dòng mã trên các tệp JavaScript, Pug, CSS và JSON\[^33]

Điều này đại diện cho hàng nghìn giờ làm việc phát triển, các phiên gỡ lỗi và tối ưu hiệu suất. Đây là "bí quyết" biến các gói riêng lẻ thành một dịch vụ thống nhất, đáng tin cậy được hàng nghìn khách hàng sử dụng hàng ngày.

### Tích Hợp Các Phụ Thuộc Cốt Lõi {#core-dependencies-integration}

Mã nguồn Forward Email tích hợp nhiều phụ thuộc thành một tổng thể liền mạch:

* **Xử lý Email**: Tích hợp Nodemailer để gửi, SMTP Server để nhận, và Mailparser để phân tích
* **Xác thực**: Sử dụng Mailauth cho xác minh DKIM, SPF, DMARC và ARC
* **Phân giải DNS**: Tận dụng Tangerine cho DNS-over-HTTPS với bộ nhớ đệm toàn cầu
* **Kết nối MX**: Sử dụng mx-connect với tích hợp Tangerine để kết nối máy chủ thư đáng tin cậy
* **Lập lịch công việc**: Dùng Bree để xử lý tác vụ nền đáng tin cậy với các luồng công nhân
* **Mẫu thư**: Dùng email-templates để tái sử dụng các bảng kiểu từ trang web trong giao tiếp với khách hàng
* **Lưu trữ Email**: Triển khai hộp thư SQLite được mã hóa riêng biệt sử dụng better-sqlite3-multiple-ciphers với mã hóa ChaCha20-Poly1305 để bảo mật an toàn trước máy tính lượng tử, đảm bảo cách ly hoàn toàn giữa người dùng và chỉ người dùng mới có quyền truy cập vào hộp thư của họ

Mỗi tích hợp này đòi hỏi phải xem xét kỹ lưỡng các trường hợp biên, tác động hiệu suất và các mối quan tâm về bảo mật. Kết quả là một hệ thống vững chắc xử lý hàng triệu giao dịch email một cách đáng tin cậy. Triển khai SQLite của chúng tôi cũng tận dụng msgpackr để tuần tự hóa nhị phân hiệu quả và WebSockets (qua ws) để cập nhật trạng thái thời gian thực trên toàn bộ hạ tầng.

### Hạ Tầng DNS với Tangerine và mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Một thành phần quan trọng trong hạ tầng Forward Email là hệ thống phân giải DNS, xây dựng xung quanh hai gói chính:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Triển khai DNS-over-HTTPS Node.js của chúng tôi cung cấp một giải pháp thay thế trực tiếp cho bộ phân giải DNS tiêu chuẩn, với tính năng thử lại tích hợp, giới hạn thời gian, xoay máy chủ thông minh và hỗ trợ bộ nhớ đệm.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Gói này thiết lập kết nối TCP đến các máy chủ MX, nhận một tên miền mục tiêu hoặc địa chỉ email, phân giải các máy chủ MX phù hợp và kết nối theo thứ tự ưu tiên.

Chúng tôi đã tích hợp Tangerine với mx-connect thông qua [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), đảm bảo các yêu cầu DNS qua HTTP ở tầng ứng dụng trong toàn bộ Forward Email. Điều này cung cấp bộ nhớ đệm DNS toàn cầu ở quy mô lớn với tính nhất quán 1:1 trên bất kỳ vùng, ứng dụng hoặc tiến trình nào — điều quan trọng để đảm bảo giao thư đáng tin cậy trong một hệ thống phân tán.

## Tác Động Doanh Nghiệp: Từ Mã Nguồn Mở Đến Giải Pháp Quan Trọng {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Sự kết tinh của hành trình phát triển mã nguồn mở kéo dài một thập kỷ đã giúp Forward Email phục vụ không chỉ các nhà phát triển cá nhân mà còn cả các doanh nghiệp lớn và các tổ chức giáo dục, những thành phần tạo nên nền tảng của phong trào mã nguồn mở.
### Các Nghiên Cứu Trường Hợp về Hạ Tầng Email Quan Trọng {#case-studies-in-mission-critical-email-infrastructure}

Cam kết của chúng tôi về độ tin cậy, quyền riêng tư và các nguyên tắc mã nguồn mở đã biến Forward Email trở thành lựa chọn đáng tin cậy cho các tổ chức có yêu cầu email khắt khe:

* **Các Cơ Sở Giáo Dục**: Như được trình bày trong [nghiên cứu trường hợp chuyển tiếp email cựu sinh viên](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), các trường đại học lớn dựa vào hạ tầng của chúng tôi để duy trì kết nối suốt đời với hàng trăm nghìn cựu sinh viên thông qua dịch vụ chuyển tiếp email đáng tin cậy.

* **Giải Pháp Linux Doanh Nghiệp**: [Nghiên cứu trường hợp email doanh nghiệp Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) cho thấy cách tiếp cận mã nguồn mở của chúng tôi hoàn toàn phù hợp với nhu cầu của các nhà cung cấp Linux doanh nghiệp, mang lại cho họ sự minh bạch và kiểm soát mà họ cần.

* **Các Quỹ Mã Nguồn Mở**: Có lẽ điều xác thực nhất là sự hợp tác của chúng tôi với Linux Foundation, được ghi lại trong [nghiên cứu trường hợp email doanh nghiệp Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), nơi dịch vụ của chúng tôi hỗ trợ giao tiếp cho chính tổ chức quản lý phát triển Linux.

Có một sự đối xứng đẹp đẽ trong cách các gói mã nguồn mở của chúng tôi, được duy trì cẩn thận trong nhiều năm, đã cho phép chúng tôi xây dựng một dịch vụ email hiện nay hỗ trợ chính các cộng đồng và tổ chức ủng hộ phần mềm mã nguồn mở. Hành trình trọn vẹn này — từ việc đóng góp các gói riêng lẻ đến cung cấp hạ tầng email cấp doanh nghiệp cho các nhà lãnh đạo mã nguồn mở — đại diện cho sự xác thực tối thượng của cách tiếp cận phát triển phần mềm của chúng tôi.


## Một Thập Kỷ Mã Nguồn Mở: Hướng Tới Tương Lai {#a-decade-of-open-source-looking-forward}

Khi nhìn lại một thập kỷ đóng góp mã nguồn mở và hướng tới mười năm tiếp theo, chúng tôi tràn đầy lòng biết ơn đối với cộng đồng đã hỗ trợ công việc của chúng tôi và sự hào hứng với những gì sắp tới.

Hành trình của chúng tôi từ những người đóng góp gói riêng lẻ đến người duy trì một hạ tầng email toàn diện được sử dụng bởi các doanh nghiệp lớn và các quỹ mã nguồn mở là điều đáng kinh ngạc. Đây là minh chứng cho sức mạnh của phát triển mã nguồn mở và tác động mà phần mềm được duy trì cẩn thận, có suy nghĩ có thể tạo ra cho hệ sinh thái rộng lớn hơn.

Trong những năm tới, chúng tôi cam kết:

* **Tiếp tục duy trì và cải thiện các gói hiện có của mình**, đảm bảo chúng vẫn là công cụ đáng tin cậy cho các nhà phát triển trên toàn thế giới.
* **Mở rộng đóng góp của chúng tôi cho các dự án hạ tầng quan trọng**, đặc biệt trong lĩnh vực email và bảo mật.
* **Nâng cao khả năng của Forward Email** đồng thời duy trì cam kết về quyền riêng tư, bảo mật và minh bạch.
* **Hỗ trợ thế hệ tiếp theo của những người đóng góp mã nguồn mở** thông qua hướng dẫn, tài trợ và sự tham gia cộng đồng.

Chúng tôi tin rằng tương lai của phát triển phần mềm là mở, hợp tác và xây dựng trên nền tảng của sự tin tưởng. Bằng cách tiếp tục đóng góp các gói chất lượng cao, tập trung vào bảo mật cho hệ sinh thái JavaScript, chúng tôi hy vọng đóng một phần nhỏ trong việc xây dựng tương lai đó.

Cảm ơn tất cả mọi người đã sử dụng các gói của chúng tôi, đóng góp cho các dự án, báo cáo sự cố hoặc đơn giản là lan tỏa về công việc của chúng tôi. Sự hỗ trợ của các bạn đã làm cho thập kỷ ảnh hưởng này trở nên khả thi, và chúng tôi rất háo hức xem chúng ta có thể đạt được gì cùng nhau trong mười năm tới.

\[^1]: thống kê tải xuống npm cho cabin, tháng 4 năm 2025  
\[^2]: thống kê tải xuống npm cho bson-objectid, tháng 2-3 năm 2025  
\[^3]: thống kê tải xuống npm cho url-regex-safe, tháng 4 năm 2025  
\[^4]: số lượng sao GitHub cho forwardemail/forwardemail.net tính đến tháng 4 năm 2025  
\[^5]: thống kê tải xuống npm cho preview-email, tháng 4 năm 2025  
\[^7]: thống kê tải xuống npm cho superagent, tháng 2-3 năm 2025  
\[^8]: thống kê tải xuống npm cho supertest, tháng 2-3 năm 2025  
\[^9]: thống kê tải xuống npm cho preview-email, tháng 2-3 năm 2025  
\[^10]: thống kê tải xuống npm cho cabin, tháng 2-3 năm 2025  
\[^11]: thống kê tải xuống npm cho url-regex-safe, tháng 2-3 năm 2025  
\[^12]: thống kê tải xuống npm cho spamscanner, tháng 2-3 năm 2025  
\[^13]: Mẫu tải xuống hàng ngày từ thống kê npm, tháng 4 năm 2025  
\[^14]: Mẫu tải xuống hàng tuần từ thống kê npm, tháng 4 năm 2025  
\[^15]: thống kê tải xuống npm cho nodemailer, tháng 4 năm 2025  
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
\[^27]: Dựa trên các vấn đề GitHub trong kho Upptime  
\[^28]: Dựa trên các vấn đề GitHub trong kho Upptime  
\[^29]: Dựa trên các vấn đề GitHub trong kho Upptime  
\[^30]: thống kê tải xuống npm cho bree, tháng 2-3 năm 2025  
\[^31]: Dựa trên các pull request GitHub cho Upptime  
\[^32]: Dựa trên các pull request GitHub cho Upptime  
\[^34]: thống kê tải xuống npm cho koa, tháng 2-3 năm 2025  
\[^35]: thống kê tải xuống npm cho @koa/router, tháng 2-3 năm 2025  
\[^36]: thống kê tải xuống npm cho koa-router, tháng 2-3 năm 2025  
\[^37]: thống kê tải xuống npm cho url-regex, tháng 2-3 năm 2025  
\[^38]: thống kê tải xuống npm cho @breejs/later, tháng 2-3 năm 2025  
\[^39]: thống kê tải xuống npm cho email-templates, tháng 2-3 năm 2025  
\[^40]: thống kê tải xuống npm cho get-paths, tháng 2-3 năm 2025  
\[^41]: thống kê tải xuống npm cho dotenv-parse-variables, tháng 2-3 năm 2025  
\[^42]: thống kê tải xuống npm cho @koa/multer, tháng 2-3 năm 2025
