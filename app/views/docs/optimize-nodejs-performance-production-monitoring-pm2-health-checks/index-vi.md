# Cách tối ưu hóa cơ sở hạ tầng sản xuất Node.js: Các phương pháp hay nhất {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="" class="rounded-lg" />

## Mục lục {#table-of-contents}

* [Lời nói đầu](#foreword)
* [Cuộc cách mạng tối ưu hóa hiệu suất lõi đơn 573% của chúng tôi](#our-573-single-core-performance-optimization-revolution)
  * [Tại sao tối ưu hóa hiệu suất lõi đơn lại quan trọng đối với Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Nội dung liên quan](#related-content)
* [Thiết lập môi trường sản xuất Node.js: Công nghệ của chúng tôi](#nodejs-production-environment-setup-our-technology-stack)
  * [Trình quản lý gói: pnpm cho hiệu quả sản xuất](#package-manager-pnpm-for-production-efficiency)
  * [Khung web: Koa cho sản xuất Node.js hiện đại](#web-framework-koa-for-modern-nodejs-production)
  * [Xử lý công việc nền tảng: Bree cho độ tin cậy sản xuất](#background-job-processing-bree-for-production-reliability)
  * [Xử lý lỗi: @hapi/boom để đảm bảo độ tin cậy trong sản xuất](#error-handling-hapiboom-for-production-reliability)
* [Cách giám sát các ứng dụng Node.js trong sản xuất](#how-to-monitor-nodejs-applications-in-production)
  * [Giám sát sản xuất Node.js cấp hệ thống](#system-level-nodejs-production-monitoring)
  * [Giám sát cấp ứng dụng cho sản xuất Node.js](#application-level-monitoring-for-nodejs-production)
  * [Giám sát ứng dụng cụ thể](#application-specific-monitoring)
* [Giám sát sản xuất Node.js với Kiểm tra tình trạng PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Hệ thống kiểm tra sức khỏe PM2 của chúng tôi](#our-pm2-health-check-system)
  * [Cấu hình sản xuất PM2 của chúng tôi](#our-pm2-production-configuration)
  * [Triển khai PM2 tự động](#automated-pm2-deployment)
* [Hệ thống phân loại và xử lý lỗi sản xuất](#production-error-handling-and-classification-system)
  * [Triển khai isCodeBug của chúng tôi cho sản xuất](#our-iscodebug-implementation-for-production)
  * [Tích hợp với Nhật ký sản xuất của chúng tôi](#integration-with-our-production-logging)
  * [Nội dung liên quan](#related-content-1)
* [Gỡ lỗi hiệu suất nâng cao với v8-profiler-next và cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Phương pháp tiếp cận hồ sơ của chúng tôi cho sản xuất Node.js](#our-profiling-approach-for-nodejs-production)
  * [Cách chúng tôi triển khai Phân tích ảnh chụp nhanh Heap](#how-we-implement-heap-snapshot-analysis)
  * [Quy trình gỡ lỗi hiệu suất](#performance-debugging-workflow)
  * [Triển khai được đề xuất cho ứng dụng Node.js của bạn](#recommended-implementation-for-your-nodejs-application)
  * [Tích hợp với Giám sát sản xuất của chúng tôi](#integration-with-our-production-monitoring)
* [Bảo mật cơ sở hạ tầng sản xuất Node.js](#nodejs-production-infrastructure-security)
  * [Bảo mật cấp hệ thống cho sản xuất Node.js](#system-level-security-for-nodejs-production)
  * [Bảo mật ứng dụng cho các ứng dụng Node.js](#application-security-for-nodejs-applications)
  * [Tự động hóa bảo mật cơ sở hạ tầng](#infrastructure-security-automation)
  * [Nội dung bảo mật của chúng tôi](#our-security-content)
* [Kiến trúc cơ sở dữ liệu cho các ứng dụng Node.js](#database-architecture-for-nodejs-applications)
  * [Triển khai SQLite cho sản xuất Node.js](#sqlite-implementation-for-nodejs-production)
  * [Triển khai MongoDB cho sản xuất Node.js](#mongodb-implementation-for-nodejs-production)
* [Xử lý công việc nền tảng sản xuất Node.js](#nodejs-production-background-job-processing)
  * [Thiết lập máy chủ Bree của chúng tôi cho sản xuất](#our-bree-server-setup-for-production)
  * [Ví dụ về công việc sản xuất](#production-job-examples)
  * [Các mẫu lập lịch công việc của chúng tôi cho Node.js Production](#our-job-scheduling-patterns-for-nodejs-production)
* [Bảo trì tự động cho các ứng dụng Node.js sản xuất](#automated-maintenance-for-production-nodejs-applications)
  * [Việc thực hiện dọn dẹp của chúng tôi](#our-cleanup-implementation)
  * [Quản lý không gian đĩa cho sản xuất Node.js](#disk-space-management-for-nodejs-production)
  * [Tự động hóa bảo trì cơ sở hạ tầng](#infrastructure-maintenance-automation)
* [Hướng dẫn triển khai sản xuất Node.js](#nodejs-production-deployment-implementation-guide)
  * [Nghiên cứu Mã thực tế của chúng tôi để có Thực hành sản xuất tốt nhất](#study-our-actual-code-for-production-best-practices)
  * [Học hỏi từ các bài đăng trên blog của chúng tôi](#learn-from-our-blog-posts)
  * [Tự động hóa cơ sở hạ tầng cho sản xuất Node.js](#infrastructure-automation-for-nodejs-production)
  * [Các nghiên cứu điển hình của chúng tôi](#our-case-studies)
* [Kết luận: Các phương pháp triển khai sản xuất Node.js tốt nhất](#conclusion-nodejs-production-deployment-best-practices)
* [Danh sách tài nguyên đầy đủ cho Node.js Production](#complete-resource-list-for-nodejs-production)
  * [Các tập tin triển khai cốt lõi của chúng tôi](#our-core-implementation-files)
  * [Triển khai máy chủ của chúng tôi](#our-server-implementations)
  * [Tự động hóa cơ sở hạ tầng của chúng tôi](#our-infrastructure-automation)
  * [Bài viết trên blog kỹ thuật của chúng tôi](#our-technical-blog-posts)
  * [Nghiên cứu trường hợp doanh nghiệp của chúng tôi](#our-enterprise-case-studies)

## Lời nói đầu {#foreword}

Tại Forward Email, chúng tôi đã dành nhiều năm để hoàn thiện thiết lập môi trường sản xuất Node.js của mình. Hướng dẫn toàn diện này chia sẻ các phương pháp triển khai sản xuất Node.js đã được thử nghiệm thực tế của chúng tôi, tập trung vào tối ưu hóa hiệu suất, giám sát và các bài học chúng tôi đã học được khi mở rộng quy mô các ứng dụng Node.js để xử lý hàng triệu giao dịch hàng ngày.

## Cuộc cách mạng tối ưu hóa hiệu suất lõi đơn 573% của chúng tôi {#our-573-single-core-performance-optimization-revolution}

Khi chúng tôi di chuyển từ bộ xử lý Intel sang AMD Ryzen, chúng tôi đã đạt được **cải thiện hiệu suất 573%** trong các ứng dụng Node.js của mình. Đây không chỉ là một tối ưu hóa nhỏ—mà về cơ bản đã thay đổi cách các ứng dụng Node.js của chúng tôi hoạt động trong sản xuất và chứng minh tầm quan trọng của việc tối ưu hóa hiệu suất lõi đơn cho bất kỳ ứng dụng Node.js nào.

> \[!TIP]
> For Node.js production deployment best practices, hardware choice is critical. We specifically chose DataPacket hosting for their AMD Ryzen availability because single-core performance is crucial for Node.js applications since JavaScript execution is single-threaded.

### Tại sao tối ưu hóa hiệu suất lõi đơn lại quan trọng đối với Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Việc di chuyển của chúng tôi từ Intel sang AMD Ryzen đã mang lại kết quả:

* **Cải thiện hiệu suất 573%** trong quá trình xử lý yêu cầu (được ghi lại trong [Sự cố GitHub trên trang trạng thái của chúng tôi #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Đã loại bỏ độ trễ xử lý** để phản hồi gần như tức thì (đã đề cập trong [Sự cố GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Tỷ lệ giá trên hiệu năng tốt hơn** cho môi trường sản xuất Node.js
* **Thời gian phản hồi được cải thiện** trên tất cả các điểm cuối ứng dụng của chúng tôi

Hiệu suất được cải thiện đáng kể đến mức giờ đây chúng tôi coi bộ xử lý AMD Ryzen là thiết yếu cho bất kỳ triển khai sản xuất Node.js nghiêm túc nào, cho dù bạn đang chạy ứng dụng web, API, dịch vụ vi mô hay bất kỳ khối lượng công việc Node.js nào khác.

### Nội dung liên quan {#related-content}

Để biết thêm chi tiết về các lựa chọn cơ sở hạ tầng của chúng tôi, hãy xem:

* [Dịch vụ chuyển tiếp email tốt nhất](https://forwardemail.net/blog/docs/best-email-forwarding-service) - So sánh hiệu suất
* [Giải pháp tự lưu trữ](https://forwardemail.net/blog/docs/self-hosted-solution) - Khuyến nghị về phần cứng

## Thiết lập môi trường sản xuất Node.js: Công nghệ của chúng tôi {#nodejs-production-environment-setup-our-technology-stack}

Các biện pháp triển khai sản xuất Node.js tốt nhất của chúng tôi bao gồm các lựa chọn công nghệ có chủ đích dựa trên nhiều năm kinh nghiệm sản xuất. Sau đây là những gì chúng tôi sử dụng và lý do tại sao các lựa chọn này áp dụng cho bất kỳ ứng dụng Node.js nào:

### Trình quản lý gói: pnpm để nâng cao hiệu quả sản xuất {#package-manager-pnpm-for-production-efficiency}

**Những gì chúng tôi sử dụng:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (phiên bản ghim)

Chúng tôi chọn pnpm thay vì npm và yarn để thiết lập môi trường sản xuất Node.js vì:

* **Thời gian cài đặt nhanh hơn** trong các đường ống CI/CD
* **Hiệu quả không gian đĩa** thông qua liên kết cứng
* **Giải quyết phụ thuộc nghiêm ngặt** giúp ngăn ngừa phụ thuộc ảo
* **Hiệu suất tốt hơn** trong các triển khai sản xuất

> \[!NOTE]
> As part of our Node.js production deployment best practices, we pin exact versions of critical tools like pnpm to ensure consistent behavior across all environments and team members' machines.

**Chi tiết triển khai:**

* [Cấu hình package.json của chúng tôi](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Bài đăng trên blog hệ sinh thái NPM của chúng tôi](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Khung web: Koa cho sản xuất Node.js hiện đại {#web-framework-koa-for-modern-nodejs-production}

**Những gì chúng tôi sử dụng:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Chúng tôi đã chọn Koa thay vì Express cho cơ sở hạ tầng sản xuất Node.js của mình vì hỗ trợ async/await hiện đại và thành phần phần mềm trung gian sạch hơn. Nhà sáng lập của chúng tôi, Nick Baugh đã đóng góp cho cả Express và Koa, giúp chúng tôi có cái nhìn sâu sắc về cả hai khuôn khổ để sử dụng trong sản xuất.

Các mẫu này áp dụng cho dù bạn đang xây dựng REST API, máy chủ GraphQL, ứng dụng web hay dịch vụ siêu nhỏ.

**Ví dụ triển khai của chúng tôi:**

* [Thiết lập máy chủ web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Cấu hình máy chủ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Hướng dẫn triển khai biểu mẫu liên hệ](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Xử lý công việc nền: Bree cho độ tin cậy sản xuất {#background-job-processing-bree-for-production-reliability}

**Những gì chúng tôi sử dụng:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) trình lập lịch

Chúng tôi đã tạo và duy trì Bree vì các trình lập lịch công việc hiện tại không đáp ứng được nhu cầu của chúng tôi về hỗ trợ luồng công việc và các tính năng JavaScript hiện đại trong môi trường Node.js sản xuất. Điều này áp dụng cho bất kỳ ứng dụng Node.js nào cần xử lý nền, tác vụ theo lịch trình hoặc luồng công việc.

**Ví dụ triển khai của chúng tôi:**

* [Thiết lập máy chủ Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Tất cả các định nghĩa công việc của chúng tôi](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Công việc kiểm tra sức khỏe PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Thực hiện công việc dọn dẹp](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Xử lý lỗi: @hapi/boom để đảm bảo độ tin cậy trong sản xuất {#error-handling-hapiboom-for-production-reliability}

**Những gì chúng tôi sử dụng:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Chúng tôi sử dụng @hapi/boom cho các phản hồi lỗi có cấu trúc trong suốt các ứng dụng sản xuất Node.js của mình. Mẫu này hoạt động với bất kỳ ứng dụng Node.js nào cần xử lý lỗi nhất quán.

**Ví dụ triển khai của chúng tôi:**

* [Trợ lý phân loại lỗi](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Triển khai ghi nhật ký](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Cách giám sát các ứng dụng Node.js trong môi trường sản xuất {#how-to-monitor-nodejs-applications-in-production}

Cách tiếp cận của chúng tôi để giám sát các ứng dụng Node.js trong sản xuất đã phát triển qua nhiều năm chạy các ứng dụng ở quy mô lớn. Chúng tôi triển khai giám sát ở nhiều lớp để đảm bảo độ tin cậy và hiệu suất cho mọi loại ứng dụng Node.js.

### Giám sát sản xuất Node.js cấp hệ thống {#system-level-nodejs-production-monitoring}

**Triển khai cốt lõi của chúng tôi:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Những gì chúng tôi sử dụng:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Ngưỡng giám sát sản xuất của chúng tôi (từ mã sản xuất thực tế của chúng tôi):

* **Giới hạn kích thước heap 2GB** với cảnh báo tự động
* **Ngưỡng cảnh báo sử dụng bộ nhớ 25%**
* **Ngưỡng cảnh báo sử dụng CPU 80%**
* **Ngưỡng cảnh báo sử dụng đĩa 75%**

> \[!WARNING]
> These thresholds work for our specific hardware configuration. When implementing Node.js production monitoring, review our monitor-server.js implementation to understand the exact logic and adapt the values for your setup.

### Giám sát cấp ứng dụng cho Node.js Production {#application-level-monitoring-for-nodejs-production}

**Phân loại lỗi của chúng tôi:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Trợ lý này phân biệt giữa:

* **Lỗi mã thực tế** cần được xử lý ngay
* **Lỗi của người dùng** là hành vi dự kiến
* **Lỗi dịch vụ bên ngoài** mà chúng tôi không thể kiểm soát

Mẫu này áp dụng cho mọi ứng dụng Node.js - ứng dụng web, API, dịch vụ siêu nhỏ hoặc dịch vụ nền.

**Triển khai ghi nhật ký của chúng tôi:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Chúng tôi triển khai chức năng biên tập toàn diện để bảo vệ thông tin nhạy cảm trong khi vẫn duy trì khả năng gỡ lỗi hữu ích trong môi trường sản xuất Node.js của mình.

### Giám sát ứng dụng cụ thể {#application-specific-monitoring}

**Triển khai máy chủ của chúng tôi:**

* [Máy chủ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Máy chủ IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Máy chủ POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Giám sát hàng đợi:** Chúng tôi triển khai giới hạn hàng đợi 5 GB và thời gian chờ 180 giây để xử lý yêu cầu nhằm ngăn chặn tình trạng cạn kiệt tài nguyên. Các mẫu này áp dụng cho bất kỳ ứng dụng Node.js nào có hàng đợi hoặc xử lý nền.

## Giám sát sản xuất Node.js với Kiểm tra tình trạng PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Chúng tôi đã tinh chỉnh thiết lập môi trường sản xuất Node.js của mình với PM2 qua nhiều năm kinh nghiệm sản xuất. Kiểm tra tình trạng PM2 của chúng tôi rất cần thiết để duy trì độ tin cậy trong bất kỳ ứng dụng Node.js nào.

### Hệ thống kiểm tra sức khỏe PM2 của chúng tôi {#our-pm2-health-check-system}

**Triển khai cốt lõi của chúng tôi:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Giám sát sản xuất Node.js của chúng tôi với các kiểm tra tình trạng PM2 bao gồm:

* **Chạy mỗi 20 phút** thông qua lịch trình cron
* **Yêu cầu thời gian hoạt động tối thiểu 15 phút** trước khi coi một quy trình là lành mạnh
* **Xác thực trạng thái quy trình và mức sử dụng bộ nhớ**
* **Tự động khởi động lại các quy trình bị lỗi**
* **Ngăn chặn vòng lặp khởi động lại** thông qua kiểm tra tình trạng thông minh

> \[!CAUTION]
> For Node.js production deployment best practices, we require 15+ minutes uptime before considering a process healthy to avoid restart loops. This prevents cascading failures when processes are struggling with memory or other issues.

### Cấu hình sản xuất PM2 của chúng tôi {#our-pm2-production-configuration}

**Thiết lập hệ sinh thái của chúng tôi:** Nghiên cứu các tệp khởi động máy chủ của chúng tôi để thiết lập môi trường sản xuất Node.js:

* [Máy chủ web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Máy chủ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Lịch trình Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Máy chủ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Các mẫu này áp dụng cho dù bạn đang chạy ứng dụng Express, máy chủ Koa, API GraphQL hay bất kỳ ứng dụng Node.js nào khác.

### Triển khai PM2 tự động {#automated-pm2-deployment}

**Triển khai PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Chúng tôi tự động hóa toàn bộ thiết lập PM2 thông qua Ansible để đảm bảo triển khai sản xuất Node.js nhất quán trên tất cả các máy chủ của chúng tôi.

## Hệ thống phân loại và xử lý lỗi sản xuất {#production-error-handling-and-classification-system}

Một trong những biện pháp triển khai sản xuất Node.js có giá trị nhất của chúng tôi là phân loại lỗi thông minh áp dụng cho bất kỳ ứng dụng Node.js nào:

### Triển khai isCodeBug của chúng tôi cho sản xuất {#our-iscodebug-implementation-for-production}

**Nguồn:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Trình trợ giúp này cung cấp khả năng phân loại lỗi thông minh cho các ứng dụng Node.js trong quá trình sản xuất để:

* **Ưu tiên các lỗi thực tế** hơn lỗi của người dùng
* **Cải thiện phản hồi sự cố của chúng tôi** bằng cách tập trung vào các vấn đề thực tế
* **Giảm tình trạng mệt mỏi do cảnh báo** từ các lỗi dự kiến của người dùng
* **Hiểu rõ hơn** các vấn đề do ứng dụng so với do người dùng tạo ra

Mẫu này áp dụng cho mọi ứng dụng Node.js - cho dù bạn đang xây dựng trang web thương mại điện tử, nền tảng SaaS, API hay dịch vụ siêu nhỏ.

### Tích hợp với Nhật ký sản xuất của chúng tôi {#integration-with-our-production-logging}

**Tích hợp trình ghi nhật ký của chúng tôi:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Trình ghi nhật ký của chúng tôi sử dụng `isCodeBug` để xác định mức cảnh báo và biên tập trường, đảm bảo chúng tôi nhận được thông báo về các vấn đề thực tế đồng thời lọc bỏ nhiễu trong môi trường sản xuất Node.js.

### Nội dung liên quan {#related-content-1}

Tìm hiểu thêm về các mẫu xử lý lỗi của chúng tôi:

* [Xây dựng hệ thống thanh toán đáng tin cậy](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Các mẫu xử lý lỗi
* [Bảo vệ quyền riêng tư của Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Xử lý lỗi bảo mật

## Gỡ lỗi hiệu suất nâng cao với v8-profiler-next và cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Chúng tôi sử dụng các công cụ lập hồ sơ nâng cao để phân tích ảnh chụp nhanh heap và gỡ lỗi các sự cố OOM (Hết bộ nhớ), tắc nghẽn hiệu suất và các vấn đề về bộ nhớ Node.js trong môi trường sản xuất của chúng tôi. Các công cụ này rất cần thiết cho bất kỳ ứng dụng Node.js nào gặp phải sự cố rò rỉ bộ nhớ hoặc hiệu suất.

### Phương pháp lập hồ sơ của chúng tôi cho sản xuất Node.js {#our-profiling-approach-for-nodejs-production}

**Các công cụ chúng tôi khuyên dùng:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Để tạo ảnh chụp nhanh heap và hồ sơ CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Để phân tích hồ sơ CPU và ảnh chụp nhanh heap

> \[!TIP]
> We use v8-profiler-next and cpupro together to create a complete performance debugging workflow for our Node.js applications. This combination helps us identify memory leaks, performance bottlenecks, and optimize our production code.

### Cách chúng tôi triển khai Phân tích ảnh chụp nhanh Heap {#how-we-implement-heap-snapshot-analysis}

**Triển khai giám sát của chúng tôi:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Giám sát sản xuất của chúng tôi bao gồm việc tạo ảnh chụp nhanh heap tự động khi ngưỡng bộ nhớ vượt quá. Điều này giúp chúng tôi gỡ lỗi các sự cố OOM trước khi chúng gây ra sự cố ứng dụng.

**Các mẫu triển khai chính:**

* **Ảnh chụp nhanh tự động** khi kích thước heap vượt quá ngưỡng 2GB
* **Hồ sơ dựa trên tín hiệu** để phân tích theo yêu cầu trong sản xuất
* **Chính sách lưu giữ** để quản lý lưu trữ ảnh chụp nhanh
* **Tích hợp với các công việc dọn dẹp của chúng tôi** để bảo trì tự động

### Quy trình gỡ lỗi hiệu suất {#performance-debugging-workflow}

**Nghiên cứu việc triển khai thực tế của chúng tôi:**

* [Giám sát việc triển khai máy chủ](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Giám sát heap và tạo ảnh chụp nhanh
* [Công việc dọn dẹp](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Lưu giữ và dọn dẹp ảnh chụp nhanh
* [Tích hợp logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Ghi nhật ký hiệu suất

### Triển khai được đề xuất cho ứng dụng Node.js của bạn {#recommended-implementation-for-your-nodejs-application}

**Đối với phân tích ảnh chụp nhanh heap:**

1. **Cài đặt v8-profiler-next** để tạo ảnh chụp nhanh
2. **Sử dụng cpupro** để phân tích ảnh chụp nhanh đã tạo
3. **Triển khai ngưỡng giám sát** tương tự như monitor-server.js của chúng tôi
4. **Thiết lập dọn dẹp tự động** để quản lý lưu trữ ảnh chụp nhanh
5. **Tạo trình xử lý tín hiệu** để lập hồ sơ theo yêu cầu trong sản xuất

**Để phân tích CPU:**

1. **Tạo hồ sơ CPU** trong thời gian tải cao
2. **Phân tích với cpupro** để xác định các điểm nghẽn
3. **Tập trung vào các đường dẫn nóng** và các cơ hội tối ưu hóa
4. **Theo dõi cải thiện hiệu suất trước/sau**

> \[!WARNING]
> Generating heap snapshots and CPU profiles can impact performance. We recommend implementing throttling and only enabling profiling when investigating specific issues or during maintenance windows.

### Tích hợp với Giám sát Sản xuất của Chúng tôi {#integration-with-our-production-monitoring}

Các công cụ lập hồ sơ của chúng tôi tích hợp với chiến lược giám sát rộng hơn của chúng tôi:

* **Kích hoạt tự động** dựa trên ngưỡng bộ nhớ/CPU
* **Tích hợp cảnh báo** khi phát hiện sự cố về hiệu suất
* **Phân tích lịch sử** để theo dõi xu hướng hiệu suất theo thời gian
* **Tương quan với số liệu ứng dụng** để gỡ lỗi toàn diện

Phương pháp này đã giúp chúng tôi xác định và giải quyết rò rỉ bộ nhớ, tối ưu hóa đường dẫn mã nóng và duy trì hiệu suất ổn định trong môi trường sản xuất Node.js của chúng tôi.

## Bảo mật cơ sở hạ tầng sản xuất Node.js {#nodejs-production-infrastructure-security}

Chúng tôi triển khai bảo mật toàn diện cho cơ sở hạ tầng sản xuất Node.js của mình thông qua Ansible. Các biện pháp này áp dụng cho bất kỳ ứng dụng Node.js nào:

### Bảo mật cấp hệ thống cho Node.js Production {#system-level-security-for-nodejs-production}

**Triển khai Ansible của chúng tôi:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Các biện pháp bảo mật chính của chúng tôi dành cho môi trường sản xuất Node.js:

* **Vô hiệu hóa hoán đổi** để ngăn dữ liệu nhạy cảm được ghi vào đĩa
* **Vô hiệu hóa core dump** để ngăn dữ liệu bộ nhớ chứa thông tin nhạy cảm
* **Lưu trữ USB bị chặn** để ngăn dữ liệu truy cập trái phép
* **Điều chỉnh tham số kernel** cho cả bảo mật và hiệu suất

> \[!WARNING]
> When implementing Node.js production deployment best practices, disabling swap can cause out-of-memory kills if your application exceeds available RAM. We monitor memory usage carefully and size our servers appropriately.

### Bảo mật ứng dụng cho các ứng dụng Node.js {#application-security-for-nodejs-applications}

**Biên tập trường nhật ký của chúng tôi:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Chúng tôi xóa các trường nhạy cảm khỏi nhật ký bao gồm mật khẩu, mã thông báo, khóa API và thông tin cá nhân. Điều này bảo vệ quyền riêng tư của người dùng trong khi vẫn duy trì khả năng gỡ lỗi trong bất kỳ môi trường sản xuất Node.js nào.

### Tự động hóa bảo mật cơ sở hạ tầng {#infrastructure-security-automation}

**Cài đặt Ansible hoàn chỉnh của chúng tôi cho sản xuất Node.js:**

* [Sổ tay an ninh](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Quản lý khóa SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Quản lý chứng chỉ](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Thiết lập DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Nội dung bảo mật của chúng tôi {#our-security-content}

Tìm hiểu thêm về phương pháp bảo mật của chúng tôi:

* [Các công ty kiểm toán an ninh tốt nhất](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Email được mã hóa Quantum Safe](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Tại sao nên sử dụng bảo mật email nguồn mở](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Kiến trúc cơ sở dữ liệu cho các ứng dụng Node.js {#database-architecture-for-nodejs-applications}

Chúng tôi sử dụng phương pháp tiếp cận cơ sở dữ liệu lai được tối ưu hóa cho các ứng dụng Node.js của chúng tôi. Các mẫu này có thể được điều chỉnh cho bất kỳ ứng dụng Node.js nào:

### Triển khai SQLite cho Node.js Production {#sqlite-implementation-for-nodejs-production}

**Những gì chúng tôi sử dụng:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Cấu hình của chúng tôi:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Chúng tôi sử dụng SQLite cho dữ liệu cụ thể của người dùng trong các ứng dụng Node.js vì nó cung cấp:

* **Cách ly dữ liệu** cho mỗi người dùng/người thuê
* **Hiệu suất tốt hơn** cho các truy vấn của một người dùng
* **Sao lưu và di chuyển đơn giản hơn**
* **Giảm độ phức tạp** so với cơ sở dữ liệu dùng chung

Mẫu này hoạt động tốt với các ứng dụng SaaS, hệ thống đa thuê bao hoặc bất kỳ ứng dụng Node.js nào cần cô lập dữ liệu.

### Triển khai MongoDB cho Node.js Production {#mongodb-implementation-for-nodejs-production}

**Những gì chúng tôi sử dụng:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Triển khai thiết lập của chúng tôi:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Cấu hình của chúng tôi:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Chúng tôi sử dụng MongoDB cho dữ liệu ứng dụng trong môi trường sản xuất Node.js vì nó cung cấp:

* **Sơ đồ linh hoạt** cho các cấu trúc dữ liệu đang phát triển
* **Hiệu suất tốt hơn** cho các truy vấn phức tạp
* **Khả năng mở rộng theo chiều ngang**
* **Ngôn ngữ truy vấn phong phú**

> \[!NOTE]
> Our hybrid approach optimizes for our specific use case. Study our actual database usage patterns in the codebase to understand if this approach fits your Node.js application needs.

## Xử lý công việc nền tảng sản xuất Node.js {#nodejs-production-background-job-processing}

Chúng tôi xây dựng kiến trúc công việc nền của mình xung quanh Bree để triển khai sản xuất Node.js đáng tin cậy. Điều này áp dụng cho bất kỳ ứng dụng Node.js nào cần xử lý nền:

### Thiết lập máy chủ Bree của chúng tôi cho sản xuất {#our-bree-server-setup-for-production}

**Triển khai chính của chúng tôi:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Triển khai Ansible của chúng tôi:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Ví dụ về công việc sản xuất {#production-job-examples}

**Theo dõi sức khỏe:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Tự động dọn dẹp:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Tất cả công việc của chúng tôi:** [Duyệt danh mục việc làm đầy đủ của chúng tôi](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Các mẫu này áp dụng cho bất kỳ ứng dụng Node.js nào cần:

* Các tác vụ theo lịch trình (xử lý dữ liệu, báo cáo, dọn dẹp)
* Xử lý nền (thay đổi kích thước hình ảnh, gửi email, nhập dữ liệu)
* Theo dõi và bảo trì tình trạng
* Sử dụng luồng công việc cho các tác vụ sử dụng nhiều CPU

### Các mẫu lập lịch công việc của chúng tôi cho Node.js Production {#our-job-scheduling-patterns-for-nodejs-production}

Nghiên cứu các mẫu lịch trình công việc thực tế của chúng tôi trong danh mục việc làm để hiểu:

* Cách chúng tôi triển khai lịch trình giống như cron trong sản xuất Node.js
* Xử lý lỗi và logic thử lại của chúng tôi
* Cách chúng tôi sử dụng luồng công nhân cho các tác vụ sử dụng nhiều CPU

## Bảo trì tự động cho các ứng dụng Node.js sản xuất {#automated-maintenance-for-production-nodejs-applications}

Chúng tôi triển khai bảo trì chủ động để ngăn ngừa các sự cố sản xuất Node.js phổ biến. Các mẫu này áp dụng cho bất kỳ ứng dụng Node.js nào:

### Triển khai dọn dẹp của chúng tôi {#our-cleanup-implementation}

**Nguồn:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Mục tiêu bảo trì tự động của chúng tôi cho các ứng dụng sản xuất Node.js:

* **Tệp tạm thời** cũ hơn 24 giờ
* **Tệp nhật ký** vượt quá giới hạn lưu giữ
* **Tệp bộ nhớ đệm** và dữ liệu tạm thời
* **Tệp đã tải lên** không còn cần thiết nữa
* **Ảnh chụp nhanh heap** từ quá trình gỡ lỗi hiệu suất

Các mẫu này áp dụng cho bất kỳ ứng dụng Node.js nào tạo ra các tệp tạm thời, nhật ký hoặc dữ liệu được lưu trong bộ nhớ đệm.

### Quản lý dung lượng đĩa cho Node.js Production {#disk-space-management-for-nodejs-production}

**Ngưỡng giám sát của chúng tôi:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Giới hạn hàng đợi** để xử lý nền
* **Ngưỡng cảnh báo sử dụng đĩa 75%**
* **Dọn dẹp tự động** khi vượt quá ngưỡng

### Tự động hóa bảo trì cơ sở hạ tầng {#infrastructure-maintenance-automation}

**Tự động hóa Ansible của chúng tôi cho sản xuất Node.js:**

* [Triển khai môi trường](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Quản lý khóa triển khai](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Hướng dẫn triển khai Node.js Production {#nodejs-production-deployment-implementation-guide}

### Nghiên cứu Mã thực tế của chúng tôi để biết các Thực hành Sản xuất Tốt nhất {#study-our-actual-code-for-production-best-practices}

**Bắt đầu với các tệp chính sau để thiết lập môi trường sản xuất Node.js:**

1. **Cấu hình:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Giám sát:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Xử lý lỗi:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Ghi nhật ký:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Tình trạng quy trình:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Học hỏi từ các bài đăng trên blog của chúng tôi {#learn-from-our-blog-posts}

**Hướng dẫn triển khai kỹ thuật của chúng tôi cho sản xuất Node.js:**

* [Hệ sinh thái các gói NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Xây dựng hệ thống thanh toán](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Triển khai bảo mật email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Biểu mẫu liên hệ JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Tích hợp Email React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Tự động hóa cơ sở hạ tầng cho sản xuất Node.js {#infrastructure-automation-for-nodejs-production}

**Sổ tay hướng dẫn Ansible của chúng tôi để nghiên cứu triển khai sản xuất Node.js:**

* [Thư mục playbook đầy đủ](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Tăng cường bảo mật](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Thiết lập Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Các nghiên cứu điển hình của chúng tôi {#our-case-studies}

**Các triển khai doanh nghiệp của chúng tôi:**

* [Nghiên cứu trường hợp của Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Nghiên cứu trường hợp Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Chuyển tiếp email của cựu sinh viên](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Kết luận: Các phương pháp triển khai Node.js Production tốt nhất {#conclusion-nodejs-production-deployment-best-practices}

Cơ sở hạ tầng sản xuất Node.js của chúng tôi chứng minh rằng các ứng dụng Node.js có thể đạt được độ tin cậy cấp doanh nghiệp thông qua:

* **Lựa chọn phần cứng đã được chứng minh** (AMD Ryzen để tối ưu hóa hiệu suất lõi đơn 573%)
* **Giám sát sản xuất Node.js đã được thử nghiệm thực tế** với ngưỡng cụ thể và phản hồi tự động
* **Phân loại lỗi thông minh** để cải thiện phản hồi sự cố trong môi trường sản xuất
* **Gỡ lỗi hiệu suất nâng cao** với v8-profiler-next và cpupro để ngăn ngừa OOM
* **Tăng cường bảo mật toàn diện** thông qua tự động hóa Ansible
* **Kiến trúc cơ sở dữ liệu lai** được tối ưu hóa cho nhu cầu ứng dụng
* **Bảo trì tự động** để ngăn ngừa các sự cố sản xuất Node.js phổ biến

**Điểm chính:** Nghiên cứu các tệp triển khai thực tế và bài đăng trên blog của chúng tôi thay vì làm theo các phương pháp hay nhất chung chung. Cơ sở mã của chúng tôi cung cấp các mẫu thực tế để triển khai sản xuất Node.js có thể được điều chỉnh cho bất kỳ ứng dụng Node.js nào - ứng dụng web, API, dịch vụ siêu nhỏ hoặc dịch vụ nền.

## Danh sách tài nguyên đầy đủ cho Node.js Production {#complete-resource-list-for-nodejs-production}

### Các tệp triển khai cốt lõi của chúng tôi {#our-core-implementation-files}

* [Cấu hình chính](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Phụ thuộc gói](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Giám sát máy chủ](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Phân loại lỗi](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Hệ thống ghi nhật ký](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Kiểm tra sức khỏe PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Tự động dọn dẹp](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Triển khai máy chủ của chúng tôi {#our-server-implementations}

* [Máy chủ web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Máy chủ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Lịch trình Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Máy chủ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Máy chủ IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Máy chủ POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Tự động hóa cơ sở hạ tầng của chúng tôi {#our-infrastructure-automation}

* [Tất cả các playbook Ansible của chúng tôi](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Tăng cường bảo mật](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Thiết lập Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Cấu hình cơ sở dữ liệu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Bài đăng trên blog kỹ thuật của chúng tôi {#our-technical-blog-posts}

* [Phân tích hệ sinh thái NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Triển khai hệ thống thanh toán](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Hướng dẫn kỹ thuật về quyền riêng tư của email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Biểu mẫu liên hệ JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Tích hợp Email React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Hướng dẫn giải pháp tự lưu trữ](https://forwardemail.net/blog/docs/self-hosted-solution)

### Nghiên cứu điển hình về doanh nghiệp của chúng tôi {#our-enterprise-case-studies}

* [Triển khai Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Nghiên cứu trường hợp Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Tuân thủ của Chính phủ Liên bang](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Hệ thống Email Cựu sinh viên](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)