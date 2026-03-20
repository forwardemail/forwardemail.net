# Cách Tối Ưu Hóa Hạ Tầng Sản Xuất Node.js: Các Thực Tiễn Tốt Nhất {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Hướng dẫn tối ưu hiệu năng Node.js" class="rounded-lg" />


## Mục Lục {#table-of-contents}

* [Lời Nói Đầu](#foreword)
* [Cuộc Cách Mạng Tối Ưu Hiệu Năng Đơn Nhân 573% Của Chúng Tôi](#our-573-single-core-performance-optimization-revolution)
  * [Tại Sao Tối Ưu Hiệu Năng Đơn Nhân Lại Quan Trọng Với Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Nội Dung Liên Quan](#related-content)
* [Thiết Lập Môi Trường Sản Xuất Node.js: Ngăn Xếp Công Nghệ Của Chúng Tôi](#nodejs-production-environment-setup-our-technology-stack)
  * [Trình Quản Lý Gói: pnpm Cho Hiệu Quả Sản Xuất](#package-manager-pnpm-for-production-efficiency)
  * [Framework Web: Koa Cho Sản Xuất Node.js Hiện Đại](#web-framework-koa-for-modern-nodejs-production)
  * [Xử Lý Công Việc Nền: Bree Cho Độ Tin Cậy Sản Xuất](#background-job-processing-bree-for-production-reliability)
  * [Xử Lý Lỗi: @hapi/boom Cho Độ Tin Cậy Sản Xuất](#error-handling-hapiboom-for-production-reliability)
* [Cách Giám Sát Ứng Dụng Node.js Trong Môi Trường Sản Xuất](#how-to-monitor-nodejs-applications-in-production)
  * [Giám Sát Node.js Cấp Hệ Thống Trong Sản Xuất](#system-level-nodejs-production-monitoring)
  * [Giám Sát Cấp Ứng Dụng Cho Node.js Trong Sản Xuất](#application-level-monitoring-for-nodejs-production)
  * [Giám Sát Riêng Cho Ứng Dụng](#application-specific-monitoring)
* [Giám Sát Sản Xuất Node.js Với Kiểm Tra Sức Khỏe PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Hệ Thống Kiểm Tra Sức Khỏe PM2 Của Chúng Tôi](#our-pm2-health-check-system)
  * [Cấu Hình PM2 Cho Sản Xuất Của Chúng Tôi](#our-pm2-production-configuration)
  * [Triển Khai PM2 Tự Động](#automated-pm2-deployment)
* [Hệ Thống Xử Lý và Phân Loại Lỗi Trong Sản Xuất](#production-error-handling-and-classification-system)
  * [Triển Khai isCodeBug Cho Sản Xuất Của Chúng Tôi](#our-iscodebug-implementation-for-production)
  * [Tích Hợp Với Ghi Nhật Ký Sản Xuất Của Chúng Tôi](#integration-with-our-production-logging)
  * [Nội Dung Liên Quan](#related-content-1)
* [Gỡ Lỗi Hiệu Năng Nâng Cao Với v8-profiler-next và cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Phương Pháp Profiling Cho Node.js Trong Sản Xuất Của Chúng Tôi](#our-profiling-approach-for-nodejs-production)
  * [Cách Chúng Tôi Triển Khai Phân Tích Heap Snapshot](#how-we-implement-heap-snapshot-analysis)
  * [Quy Trình Gỡ Lỗi Hiệu Năng](#performance-debugging-workflow)
  * [Triển Khai Được Khuyến Nghị Cho Ứng Dụng Node.js Của Bạn](#recommended-implementation-for-your-nodejs-application)
  * [Tích Hợp Với Giám Sát Sản Xuất Của Chúng Tôi](#integration-with-our-production-monitoring)
* [Bảo Mật Hạ Tầng Sản Xuất Node.js](#nodejs-production-infrastructure-security)
  * [Bảo Mật Cấp Hệ Thống Cho Node.js Trong Sản Xuất](#system-level-security-for-nodejs-production)
  * [Bảo Mật Ứng Dụng Cho Các Ứng Dụng Node.js](#application-security-for-nodejs-applications)
  * [Tự Động Hóa Bảo Mật Hạ Tầng](#infrastructure-security-automation)
  * [Nội Dung Bảo Mật Của Chúng Tôi](#our-security-content)
* [Kiến Trúc Cơ Sở Dữ Liệu Cho Ứng Dụng Node.js](#database-architecture-for-nodejs-applications)
  * [Triển Khai SQLite Cho Node.js Trong Sản Xuất](#sqlite-implementation-for-nodejs-production)
  * [Triển Khai MongoDB Cho Node.js Trong Sản Xuất](#mongodb-implementation-for-nodejs-production)
* [Xử Lý Công Việc Nền Trong Sản Xuất Node.js](#nodejs-production-background-job-processing)
  * [Thiết Lập Máy Chủ Bree Cho Sản Xuất Của Chúng Tôi](#our-bree-server-setup-for-production)
  * [Ví Dụ Công Việc Trong Sản Xuất](#production-job-examples)
  * [Mẫu Lập Lịch Công Việc Cho Node.js Trong Sản Xuất Của Chúng Tôi](#our-job-scheduling-patterns-for-nodejs-production)
* [Bảo Trì Tự Động Cho Ứng Dụng Node.js Trong Sản Xuất](#automated-maintenance-for-production-nodejs-applications)
  * [Triển Khai Dọn Dẹp Của Chúng Tôi](#our-cleanup-implementation)
  * [Quản Lý Dung Lượng Ổ Đĩa Cho Node.js Trong Sản Xuất](#disk-space-management-for-nodejs-production)
  * [Tự Động Hóa Bảo Trì Hạ Tầng](#infrastructure-maintenance-automation)
* [Hướng Dẫn Triển Khai Sản Xuất Node.js](#nodejs-production-deployment-implementation-guide)
  * [Nghiên Cứu Mã Thực Tế Của Chúng Tôi Cho Các Thực Tiễn Tốt Nhất Trong Sản Xuất](#study-our-actual-code-for-production-best-practices)
  * [Học Hỏi Từ Các Bài Viết Blog Của Chúng Tôi](#learn-from-our-blog-posts)
  * [Tự Động Hóa Hạ Tầng Cho Node.js Trong Sản Xuất](#infrastructure-automation-for-nodejs-production)
  * [Các Nghiên Cứu Trường Hợp Của Chúng Tôi](#our-case-studies)
* [Kết Luận: Các Thực Tiễn Tốt Nhất Cho Triển Khai Sản Xuất Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Danh Sách Tài Nguyên Hoàn Chỉnh Cho Node.js Trong Sản Xuất](#complete-resource-list-for-nodejs-production)
  * [Các Tệp Triển Khai Cốt Lõi Của Chúng Tôi](#our-core-implementation-files)
  * [Các Triển Khai Máy Chủ Của Chúng Tôi](#our-server-implementations)
  * [Tự Động Hóa Hạ Tầng Của Chúng Tôi](#our-infrastructure-automation)
  * [Các Bài Viết Blog Kỹ Thuật Của Chúng Tôi](#our-technical-blog-posts)
  * [Các Nghiên Cứu Trường Hợp Doanh Nghiệp Của Chúng Tôi](#our-enterprise-case-studies)
## Lời nói đầu {#foreword}

Tại Forward Email, chúng tôi đã dành nhiều năm để hoàn thiện thiết lập môi trường sản xuất Node.js của mình. Hướng dẫn toàn diện này chia sẻ các thực tiễn tốt nhất đã được kiểm chứng trong triển khai sản xuất Node.js, tập trung vào tối ưu hóa hiệu suất, giám sát và những bài học chúng tôi đã học được khi mở rộng các ứng dụng Node.js để xử lý hàng triệu giao dịch hàng ngày.

## Cuộc cách mạng tối ưu hóa hiệu suất đơn nhân 573% của chúng tôi {#our-573-single-core-performance-optimization-revolution}

Khi chúng tôi chuyển từ bộ xử lý Intel sang AMD Ryzen, chúng tôi đã đạt được **cải thiện hiệu suất 573%** trong các ứng dụng Node.js của mình. Đây không chỉ là một tối ưu nhỏ—nó đã thay đổi căn bản cách các ứng dụng Node.js của chúng tôi hoạt động trong môi trường sản xuất và chứng minh tầm quan trọng của tối ưu hóa hiệu suất đơn nhân đối với bất kỳ ứng dụng Node.js nào.

> \[!TIP]
> Đối với các thực tiễn tốt nhất triển khai sản xuất Node.js, lựa chọn phần cứng là rất quan trọng. Chúng tôi đã chọn dịch vụ lưu trữ DataPacket vì họ có sẵn AMD Ryzen bởi hiệu suất đơn nhân rất quan trọng đối với các ứng dụng Node.js do JavaScript thực thi đơn luồng.

### Tại sao tối ưu hóa hiệu suất đơn nhân lại quan trọng đối với Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Việc chuyển đổi từ Intel sang AMD Ryzen của chúng tôi đã mang lại:

* **Cải thiện hiệu suất 573%** trong xử lý yêu cầu (được ghi lại trong [vấn đề GitHub #1519 trên trang trạng thái của chúng tôi](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Loại bỏ độ trễ xử lý** để có phản hồi gần như tức thì (được đề cập trong [vấn đề GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Tỷ lệ giá trên hiệu suất tốt hơn** cho môi trường sản xuất Node.js
* **Cải thiện thời gian phản hồi** trên tất cả các điểm cuối ứng dụng của chúng tôi

Sự tăng cường hiệu suất lớn đến mức chúng tôi hiện coi bộ xử lý AMD Ryzen là thiết yếu cho bất kỳ triển khai sản xuất Node.js nghiêm túc nào, dù bạn đang chạy ứng dụng web, API, microservices hay bất kỳ khối lượng công việc Node.js nào khác.

### Nội dung liên quan {#related-content}

Để biết thêm chi tiết về lựa chọn hạ tầng của chúng tôi, hãy xem:

* [Dịch vụ chuyển tiếp email tốt nhất](https://forwardemail.net/blog/docs/best-email-forwarding-service) - So sánh hiệu suất
* [Giải pháp tự lưu trữ](https://forwardemail.net/blog/docs/self-hosted-solution) - Khuyến nghị phần cứng

## Thiết lập môi trường sản xuất Node.js: Ngăn xếp công nghệ của chúng tôi {#nodejs-production-environment-setup-our-technology-stack}

Các thực tiễn tốt nhất triển khai sản xuất Node.js của chúng tôi bao gồm các lựa chọn công nghệ có chủ đích dựa trên nhiều năm kinh nghiệm sản xuất. Dưới đây là những gì chúng tôi sử dụng và lý do các lựa chọn này áp dụng cho bất kỳ ứng dụng Node.js nào:

### Trình quản lý gói: pnpm cho hiệu quả sản xuất {#package-manager-pnpm-for-production-efficiency}

**Chúng tôi sử dụng:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (phiên bản cố định)

Chúng tôi chọn pnpm thay vì npm và yarn cho thiết lập môi trường sản xuất Node.js vì:

* **Thời gian cài đặt nhanh hơn** trong các pipeline CI/CD
* **Tiết kiệm dung lượng đĩa** thông qua liên kết cứng
* **Giải quyết phụ thuộc nghiêm ngặt** ngăn chặn các phụ thuộc ma
* **Hiệu suất tốt hơn** trong các triển khai sản xuất

> \[!NOTE]
> Là một phần trong các thực tiễn tốt nhất triển khai sản xuất Node.js, chúng tôi cố định phiên bản chính xác của các công cụ quan trọng như pnpm để đảm bảo hành vi nhất quán trên tất cả các môi trường và máy của các thành viên trong nhóm.

**Chi tiết triển khai:**

* [Cấu hình package.json của chúng tôi](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Bài viết blog về hệ sinh thái NPM của chúng tôi](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Framework web: Koa cho sản xuất Node.js hiện đại {#web-framework-koa-for-modern-nodejs-production}

**Chúng tôi sử dụng:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Chúng tôi chọn Koa thay vì Express cho hạ tầng sản xuất Node.js của mình vì hỗ trợ async/await hiện đại và cách kết hợp middleware sạch hơn. Người sáng lập của chúng tôi, Nick Baugh, đã đóng góp cho cả Express và Koa, mang lại cho chúng tôi cái nhìn sâu sắc về cả hai framework để sử dụng trong môi trường sản xuất.

Những mẫu này áp dụng cho dù bạn đang xây dựng REST API, máy chủ GraphQL, ứng dụng web hay microservices.

**Ví dụ triển khai của chúng tôi:**

* [Cài đặt máy chủ web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Cấu hình máy chủ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Hướng dẫn triển khai biểu mẫu liên hệ](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Xử lý công việc nền: Bree cho độ tin cậy sản xuất {#background-job-processing-bree-for-production-reliability}

**Chúng tôi sử dụng:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) scheduler

Chúng tôi tạo và duy trì Bree vì các bộ lập lịch công việc hiện có không đáp ứng nhu cầu của chúng tôi về hỗ trợ worker thread và các tính năng JavaScript hiện đại trong môi trường Node.js sản xuất. Điều này áp dụng cho bất kỳ ứng dụng Node.js nào cần xử lý nền, tác vụ theo lịch hoặc worker thread.

**Ví dụ triển khai của chúng tôi:**

* [Cài đặt máy chủ Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Tất cả định nghĩa công việc của chúng tôi](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Công việc kiểm tra sức khỏe PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Triển khai công việc dọn dẹp](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Xử lý lỗi: @hapi/boom cho độ tin cậy sản xuất {#error-handling-hapiboom-for-production-reliability}

**Chúng tôi sử dụng:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Chúng tôi sử dụng @hapi/boom để trả về lỗi có cấu trúc trong toàn bộ ứng dụng Node.js sản xuất của mình. Mẫu này phù hợp với bất kỳ ứng dụng Node.js nào cần xử lý lỗi nhất quán.

**Ví dụ triển khai của chúng tôi:**

* [Trợ giúp phân loại lỗi](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Triển khai logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Cách giám sát ứng dụng Node.js trong môi trường sản xuất {#how-to-monitor-nodejs-applications-in-production}

Cách tiếp cận của chúng tôi để giám sát ứng dụng Node.js trong môi trường sản xuất đã phát triển qua nhiều năm vận hành ứng dụng ở quy mô lớn. Chúng tôi triển khai giám sát ở nhiều tầng để đảm bảo độ tin cậy và hiệu suất cho bất kỳ loại ứng dụng Node.js nào.

### Giám sát Node.js cấp hệ thống trong sản xuất {#system-level-nodejs-production-monitoring}

**Triển khai cốt lõi của chúng tôi:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Chúng tôi sử dụng:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Ngưỡng giám sát sản xuất của chúng tôi (từ mã sản xuất thực tế):

* **Giới hạn heap size 2GB** với cảnh báo tự động
* **Ngưỡng cảnh báo sử dụng bộ nhớ 25%**
* **Ngưỡng cảnh báo sử dụng CPU 80%**
* **Ngưỡng cảnh báo sử dụng đĩa 75%**

> \[!WARNING]
> Những ngưỡng này phù hợp với cấu hình phần cứng cụ thể của chúng tôi. Khi triển khai giám sát Node.js trong sản xuất, hãy xem lại triển khai monitor-server.js của chúng tôi để hiểu logic chính xác và điều chỉnh các giá trị cho phù hợp với thiết lập của bạn.

### Giám sát cấp ứng dụng cho Node.js trong sản xuất {#application-level-monitoring-for-nodejs-production}

**Phân loại lỗi của chúng tôi:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Trợ giúp này phân biệt giữa:

* **Lỗi mã thực sự** cần được chú ý ngay lập tức
* **Lỗi người dùng** là hành vi mong đợi
* **Lỗi dịch vụ bên ngoài** mà chúng ta không thể kiểm soát

Mẫu này áp dụng cho bất kỳ ứng dụng Node.js nào - ứng dụng web, API, microservices hoặc dịch vụ nền.
**Triển khai ghi nhật ký của chúng tôi:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Chúng tôi thực hiện việc che giấu trường dữ liệu toàn diện để bảo vệ thông tin nhạy cảm đồng thời duy trì khả năng gỡ lỗi hữu ích trong môi trường sản xuất Node.js của mình.

### Giám sát theo ứng dụng {#application-specific-monitoring}

**Triển khai máy chủ của chúng tôi:**

* [Máy chủ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Máy chủ IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Máy chủ POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Giám sát hàng đợi:** Chúng tôi áp dụng giới hạn hàng đợi 5GB và thời gian chờ 180 giây cho xử lý yêu cầu để ngăn ngừa cạn kiệt tài nguyên. Các mẫu này áp dụng cho bất kỳ ứng dụng Node.js nào có hàng đợi hoặc xử lý nền.

## Giám sát sản xuất Node.js với kiểm tra sức khỏe PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Chúng tôi đã tinh chỉnh thiết lập môi trường sản xuất Node.js với PM2 qua nhiều năm kinh nghiệm sản xuất. Các kiểm tra sức khỏe PM2 của chúng tôi rất quan trọng để duy trì độ tin cậy trong bất kỳ ứng dụng Node.js nào.

### Hệ thống kiểm tra sức khỏe PM2 của chúng tôi {#our-pm2-health-check-system}

**Triển khai cốt lõi của chúng tôi:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Giám sát sản xuất Node.js với kiểm tra sức khỏe PM2 của chúng tôi bao gồm:

* **Chạy mỗi 20 phút** thông qua lịch cron
* **Yêu cầu thời gian hoạt động tối thiểu 15 phút** trước khi xem một tiến trình là khỏe mạnh
* **Xác thực trạng thái tiến trình và mức sử dụng bộ nhớ**
* **Tự động khởi động lại các tiến trình bị lỗi**
* **Ngăn ngừa vòng lặp khởi động lại** thông qua kiểm tra sức khỏe thông minh

> \[!CAUTION]
> Đối với các thực hành tốt nhất triển khai sản xuất Node.js, chúng tôi yêu cầu thời gian hoạt động trên 15 phút trước khi xem một tiến trình là khỏe mạnh để tránh vòng lặp khởi động lại. Điều này ngăn ngừa sự cố lan truyền khi các tiến trình gặp khó khăn về bộ nhớ hoặc các vấn đề khác.

### Cấu hình sản xuất PM2 của chúng tôi {#our-pm2-production-configuration}

**Thiết lập hệ sinh thái của chúng tôi:** Nghiên cứu các tệp khởi động máy chủ của chúng tôi để thiết lập môi trường sản xuất Node.js:

* [Máy chủ web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Máy chủ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Trình lập lịch Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Máy chủ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Các mẫu này áp dụng cho dù bạn đang chạy ứng dụng Express, máy chủ Koa, API GraphQL hay bất kỳ ứng dụng Node.js nào khác.

### Triển khai PM2 tự động {#automated-pm2-deployment}

**Triển khai PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Chúng tôi tự động hóa toàn bộ thiết lập PM2 thông qua Ansible để đảm bảo triển khai sản xuất Node.js nhất quán trên tất cả các máy chủ của mình.

## Hệ thống xử lý và phân loại lỗi sản xuất {#production-error-handling-and-classification-system}

Một trong những thực hành tốt nhất triển khai sản xuất Node.js có giá trị nhất của chúng tôi là phân loại lỗi thông minh áp dụng cho bất kỳ ứng dụng Node.js nào:

### Triển khai isCodeBug của chúng tôi cho sản xuất {#our-iscodebug-implementation-for-production}

**Nguồn:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Trợ giúp này cung cấp phân loại lỗi thông minh cho các ứng dụng Node.js trong sản xuất để:

* **Ưu tiên các lỗi thực sự** hơn lỗi do người dùng
* **Cải thiện phản ứng sự cố** bằng cách tập trung vào các vấn đề thực sự
* **Giảm mệt mỏi cảnh báo** từ các lỗi người dùng dự kiến
* **Hiểu rõ hơn** các vấn đề do ứng dụng so với do người dùng tạo ra

Mẫu này hoạt động cho bất kỳ ứng dụng Node.js nào - dù bạn đang xây dựng các trang thương mại điện tử, nền tảng SaaS, API hay microservices.

### Tích hợp với ghi nhật ký sản xuất của chúng tôi {#integration-with-our-production-logging}

**Tích hợp trình ghi nhật ký của chúng tôi:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Trình ghi nhật ký của chúng tôi sử dụng `isCodeBug` để xác định mức cảnh báo và việc che dấu trường, đảm bảo chúng tôi nhận được thông báo về các vấn đề thực sự trong khi lọc bỏ tiếng ồn trong môi trường sản xuất Node.js của mình.

### Nội dung liên quan {#related-content-1}

Tìm hiểu thêm về các mẫu xử lý lỗi của chúng tôi:

* [Xây dựng Hệ thống Thanh toán Đáng tin cậy](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Mẫu xử lý lỗi
* [Bảo vệ Quyền riêng tư Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Xử lý lỗi bảo mật


## Gỡ lỗi Hiệu suất Nâng cao với v8-profiler-next và cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Chúng tôi sử dụng các công cụ phân tích nâng cao để phân tích ảnh chụp heap và gỡ lỗi các vấn đề OOM (Hết bộ nhớ), tắc nghẽn hiệu suất và các vấn đề bộ nhớ Node.js trong môi trường sản xuất của mình. Những công cụ này rất cần thiết cho bất kỳ ứng dụng Node.js nào gặp phải rò rỉ bộ nhớ hoặc sự cố hiệu suất.

### Phương pháp Phân tích của Chúng tôi cho Node.js Production {#our-profiling-approach-for-nodejs-production}

**Các công cụ chúng tôi khuyên dùng:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Để tạo ảnh chụp heap và hồ sơ CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Để phân tích hồ sơ CPU và ảnh chụp heap

> \[!TIP]
> Chúng tôi sử dụng v8-profiler-next và cpupro cùng nhau để tạo ra một quy trình gỡ lỗi hiệu suất hoàn chỉnh cho các ứng dụng Node.js của mình. Sự kết hợp này giúp chúng tôi xác định rò rỉ bộ nhớ, tắc nghẽn hiệu suất và tối ưu hóa mã sản xuất.

### Cách Chúng tôi Triển khai Phân tích Ảnh chụp Heap {#how-we-implement-heap-snapshot-analysis}

**Triển khai giám sát của chúng tôi:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Giám sát sản xuất của chúng tôi bao gồm việc tự động tạo ảnh chụp heap khi vượt quá ngưỡng bộ nhớ. Điều này giúp chúng tôi gỡ lỗi các vấn đề OOM trước khi chúng gây ra sự cố ứng dụng.

**Các mẫu triển khai chính:**

* **Ảnh chụp tự động** khi kích thước heap vượt quá ngưỡng 2GB
* **Phân tích dựa trên tín hiệu** để phân tích theo yêu cầu trong môi trường sản xuất
* **Chính sách lưu giữ** để quản lý lưu trữ ảnh chụp
* **Tích hợp với các công việc dọn dẹp của chúng tôi** để bảo trì tự động

### Quy trình Gỡ lỗi Hiệu suất {#performance-debugging-workflow}

**Nghiên cứu triển khai thực tế của chúng tôi:**

* [Triển khai máy chủ giám sát](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Giám sát heap và tạo ảnh chụp
* [Công việc dọn dẹp](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Lưu giữ và dọn dẹp ảnh chụp
* [Tích hợp trình ghi nhật ký](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Ghi nhật ký hiệu suất

### Triển khai Được Khuyến nghị cho Ứng dụng Node.js của Bạn {#recommended-implementation-for-your-nodejs-application}

**Đối với phân tích ảnh chụp heap:**

1. **Cài đặt v8-profiler-next** để tạo ảnh chụp
2. **Sử dụng cpupro** để phân tích các ảnh chụp đã tạo
3. **Triển khai ngưỡng giám sát** tương tự như monitor-server.js của chúng tôi
4. **Thiết lập dọn dẹp tự động** để quản lý lưu trữ ảnh chụp
5. **Tạo bộ xử lý tín hiệu** để phân tích theo yêu cầu trong môi trường sản xuất

**Đối với phân tích CPU:**

1. **Tạo hồ sơ CPU** trong các giai đoạn tải cao
2. **Phân tích với cpupro** để xác định các điểm tắc nghẽn
3. **Tập trung vào các đường nóng** và cơ hội tối ưu hóa
4. **Giám sát trước/sau** các cải tiến hiệu suất

> \[!WARNING]
> Việc tạo ảnh chụp heap và hồ sơ CPU có thể ảnh hưởng đến hiệu suất. Chúng tôi khuyên bạn nên triển khai giới hạn tần suất và chỉ bật phân tích khi điều tra các vấn đề cụ thể hoặc trong các cửa sổ bảo trì.

### Tích hợp với Giám sát Sản xuất của Chúng tôi {#integration-with-our-production-monitoring}

Các công cụ phân tích của chúng tôi tích hợp với chiến lược giám sát rộng hơn:

* **Kích hoạt tự động** dựa trên ngưỡng bộ nhớ/CPU
* **Tích hợp cảnh báo** khi phát hiện sự cố hiệu suất
* **Phân tích lịch sử** để theo dõi xu hướng hiệu suất theo thời gian
* **Tương quan với các chỉ số ứng dụng** để gỡ lỗi toàn diện
Cách tiếp cận này đã giúp chúng tôi xác định và giải quyết các rò rỉ bộ nhớ, tối ưu hóa các đường dẫn mã nóng, và duy trì hiệu suất ổn định trong môi trường sản xuất Node.js của chúng tôi.


## Bảo mật Hạ tầng Sản xuất Node.js {#nodejs-production-infrastructure-security}

Chúng tôi triển khai bảo mật toàn diện cho hạ tầng sản xuất Node.js thông qua tự động hóa Ansible. Những thực hành này áp dụng cho bất kỳ ứng dụng Node.js nào:

### Bảo mật Cấp Hệ thống cho Sản xuất Node.js {#system-level-security-for-nodejs-production}

**Triển khai Ansible của chúng tôi:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Các biện pháp bảo mật chính của chúng tôi cho môi trường sản xuất Node.js:

* **Tắt swap** để ngăn dữ liệu nhạy cảm bị ghi ra đĩa
* **Tắt core dumps** để ngăn các bản dump bộ nhớ chứa thông tin nhạy cảm
* **Chặn lưu trữ USB** để ngăn truy cập dữ liệu trái phép
* **Điều chỉnh tham số kernel** cho cả bảo mật và hiệu suất

> \[!WARNING]
> Khi triển khai các thực hành tốt nhất cho triển khai sản xuất Node.js, việc tắt swap có thể gây ra việc bị kill do hết bộ nhớ nếu ứng dụng của bạn vượt quá RAM khả dụng. Chúng tôi theo dõi sử dụng bộ nhớ cẩn thận và định kích thước máy chủ phù hợp.

### Bảo mật Ứng dụng cho các Ứng dụng Node.js {#application-security-for-nodejs-applications}

**Ẩn trường log của chúng tôi:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Chúng tôi ẩn các trường nhạy cảm trong log bao gồm mật khẩu, token, khóa API và thông tin cá nhân. Điều này bảo vệ quyền riêng tư người dùng đồng thời duy trì khả năng gỡ lỗi trong bất kỳ môi trường sản xuất Node.js nào.

### Tự động hóa Bảo mật Hạ tầng {#infrastructure-security-automation}

**Thiết lập Ansible hoàn chỉnh của chúng tôi cho sản xuất Node.js:**

* [Playbook bảo mật](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Quản lý khóa SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Quản lý chứng chỉ](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Cài đặt DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Nội dung Bảo mật của Chúng tôi {#our-security-content}

Tìm hiểu thêm về cách tiếp cận bảo mật của chúng tôi:

* [Các Công ty Kiểm toán Bảo mật Tốt nhất](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Dịch vụ Email Mã hóa An toàn Quantum](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Tại sao Bảo mật Email Mã nguồn Mở](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Kiến trúc Cơ sở dữ liệu cho Ứng dụng Node.js {#database-architecture-for-nodejs-applications}

Chúng tôi sử dụng cách tiếp cận cơ sở dữ liệu lai được tối ưu cho các ứng dụng Node.js của mình. Những mẫu này có thể được điều chỉnh cho bất kỳ ứng dụng Node.js nào:

### Triển khai SQLite cho Sản xuất Node.js {#sqlite-implementation-for-nodejs-production}

**Chúng tôi sử dụng:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Cấu hình của chúng tôi:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Chúng tôi sử dụng SQLite cho dữ liệu riêng của người dùng trong các ứng dụng Node.js vì nó cung cấp:

* **Cách ly dữ liệu** theo người dùng/khách thuê
* **Hiệu suất tốt hơn** cho các truy vấn đơn người dùng
* **Sao lưu** và di chuyển đơn giản hơn
* **Giảm độ phức tạp** so với cơ sở dữ liệu chia sẻ

Mẫu này hoạt động tốt cho các ứng dụng SaaS, hệ thống đa khách thuê, hoặc bất kỳ ứng dụng Node.js nào cần cách ly dữ liệu.

### Triển khai MongoDB cho Sản xuất Node.js {#mongodb-implementation-for-nodejs-production}

**Chúng tôi sử dụng:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Triển khai thiết lập của chúng tôi:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Cấu hình của chúng tôi:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Chúng tôi sử dụng MongoDB cho dữ liệu ứng dụng trong môi trường sản xuất Node.js của mình vì nó cung cấp:

* **Lược đồ linh hoạt** cho các cấu trúc dữ liệu phát triển
* **Hiệu suất tốt hơn** cho các truy vấn phức tạp
* **Khả năng mở rộng theo chiều ngang**
* **Ngôn ngữ truy vấn phong phú**

> \[!NOTE]
> Cách tiếp cận kết hợp của chúng tôi tối ưu cho trường hợp sử dụng cụ thể của chúng tôi. Hãy nghiên cứu các mẫu sử dụng cơ sở dữ liệu thực tế trong mã nguồn để hiểu liệu cách tiếp cận này có phù hợp với nhu cầu ứng dụng Node.js của bạn hay không.


## Xử lý công việc nền trong môi trường sản xuất Node.js {#nodejs-production-background-job-processing}

Chúng tôi xây dựng kiến trúc công việc nền của mình dựa trên Bree để triển khai sản xuất Node.js đáng tin cậy. Điều này áp dụng cho bất kỳ ứng dụng Node.js nào cần xử lý nền:

### Thiết lập máy chủ Bree của chúng tôi cho môi trường sản xuất {#our-bree-server-setup-for-production}

**Triển khai chính của chúng tôi:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Triển khai Ansible của chúng tôi:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Ví dụ về công việc sản xuất {#production-job-examples}

**Giám sát sức khỏe:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Tự động dọn dẹp:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Tất cả công việc của chúng tôi:** [Duyệt thư mục công việc đầy đủ của chúng tôi](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Các mẫu này áp dụng cho bất kỳ ứng dụng Node.js nào cần:

* Tác vụ theo lịch (xử lý dữ liệu, báo cáo, dọn dẹp)
* Xử lý nền (thay đổi kích thước hình ảnh, gửi email, nhập dữ liệu)
* Giám sát sức khỏe và bảo trì
* Sử dụng luồng công nhân cho các tác vụ tốn CPU

### Mẫu lập lịch công việc của chúng tôi cho môi trường sản xuất Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Nghiên cứu các mẫu lập lịch công việc thực tế trong thư mục công việc của chúng tôi để hiểu:

* Cách chúng tôi triển khai lập lịch kiểu cron trong môi trường sản xuất Node.js
* Xử lý lỗi và logic thử lại của chúng tôi
* Cách chúng tôi sử dụng luồng công nhân cho các tác vụ tốn CPU


## Bảo trì tự động cho ứng dụng Node.js sản xuất {#automated-maintenance-for-production-nodejs-applications}

Chúng tôi triển khai bảo trì chủ động để ngăn ngừa các vấn đề phổ biến trong môi trường sản xuất Node.js. Các mẫu này áp dụng cho bất kỳ ứng dụng Node.js nào:

### Triển khai dọn dẹp của chúng tôi {#our-cleanup-implementation}

**Nguồn:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Bảo trì tự động của chúng tôi cho các ứng dụng Node.js sản xuất nhắm vào:

* **Tệp tạm thời** cũ hơn 24 giờ
* **Tệp nhật ký** vượt quá giới hạn lưu giữ
* **Tệp cache** và dữ liệu tạm thời
* **Tệp tải lên** không còn cần thiết
* **Ảnh chụp heap** từ việc gỡ lỗi hiệu suất

Các mẫu này áp dụng cho bất kỳ ứng dụng Node.js nào tạo ra tệp tạm thời, nhật ký hoặc dữ liệu cache.

### Quản lý dung lượng đĩa cho môi trường sản xuất Node.js {#disk-space-management-for-nodejs-production}

**Ngưỡng giám sát của chúng tôi:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Giới hạn hàng đợi** cho xử lý nền
* **Cảnh báo sử dụng đĩa 75%**
* **Dọn dẹp tự động** khi vượt ngưỡng

### Tự động hóa bảo trì hạ tầng {#infrastructure-maintenance-automation}

**Tự động hóa Ansible của chúng tôi cho môi trường sản xuất Node.js:**

* [Triển khai môi trường](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Quản lý khóa triển khai](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Hướng dẫn triển khai môi trường sản xuất Node.js {#nodejs-production-deployment-implementation-guide}
### Nghiên cứu Mã Thực tế của Chúng tôi cho Thực hành Tốt nhất trong Sản xuất {#study-our-actual-code-for-production-best-practices}

**Bắt đầu với các tệp chính này để thiết lập môi trường sản xuất Node.js:**

1. **Cấu hình:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Giám sát:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Xử lý lỗi:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Ghi nhật ký:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Sức khỏe tiến trình:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Học hỏi từ Các Bài viết Blog của Chúng tôi {#learn-from-our-blog-posts}

**Hướng dẫn triển khai kỹ thuật của chúng tôi cho sản xuất Node.js:**

* [Hệ sinh thái Gói NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Xây dựng Hệ thống Thanh toán](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Triển khai Bảo mật Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Biểu mẫu Liên hệ JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Tích hợp Email React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Tự động hóa Hạ tầng cho Sản xuất Node.js {#infrastructure-automation-for-nodejs-production}

**Các playbook Ansible của chúng tôi để nghiên cứu triển khai sản xuất Node.js:**

* [Thư mục playbook hoàn chỉnh](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Tăng cường bảo mật](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Thiết lập Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Các Nghiên cứu Tình huống của Chúng tôi {#our-case-studies}

**Các triển khai doanh nghiệp của chúng tôi:**

* [Nghiên cứu Tình huống Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Nghiên cứu Tình huống Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Chuyển tiếp Email Cựu sinh viên](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Kết luận: Thực hành Tốt nhất cho Triển khai Sản xuất Node.js {#conclusion-nodejs-production-deployment-best-practices}

Hạ tầng sản xuất Node.js của chúng tôi chứng minh rằng các ứng dụng Node.js có thể đạt được độ tin cậy cấp doanh nghiệp thông qua:

* **Lựa chọn phần cứng đã được chứng minh** (AMD Ryzen tối ưu hóa hiệu suất đơn nhân lên đến 573%)
* **Giám sát sản xuất Node.js đã được kiểm chứng** với các ngưỡng cụ thể và phản hồi tự động
* **Phân loại lỗi thông minh** để cải thiện phản ứng sự cố trong môi trường sản xuất
* **Gỡ lỗi hiệu suất nâng cao** với v8-profiler-next và cpupro để ngăn ngừa OOM
* **Tăng cường bảo mật toàn diện** thông qua tự động hóa Ansible
* **Kiến trúc cơ sở dữ liệu lai** tối ưu cho nhu cầu ứng dụng
* **Bảo trì tự động** để ngăn ngừa các sự cố phổ biến trong sản xuất Node.js

**Điều quan trọng cần nhớ:** Nghiên cứu các tệp triển khai thực tế và bài viết blog của chúng tôi thay vì theo các thực hành chung chung. Mã nguồn của chúng tôi cung cấp các mẫu thực tế cho triển khai sản xuất Node.js có thể được điều chỉnh cho bất kỳ ứng dụng Node.js nào - ứng dụng web, API, microservices hoặc dịch vụ nền.


## Danh sách Tài nguyên Hoàn chỉnh cho Sản xuất Node.js {#complete-resource-list-for-nodejs-production}

### Các Tệp Triển khai Cốt lõi của Chúng tôi {#our-core-implementation-files}

* [Cấu hình chính](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Phụ thuộc gói](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Giám sát máy chủ](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Phân loại lỗi](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Hệ thống ghi nhật ký](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Kiểm tra sức khỏe PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Dọn dẹp tự động](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Các Triển Khai Máy Chủ Của Chúng Tôi {#our-server-implementations}

* [Máy chủ Web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Máy chủ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Trình lập lịch Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Máy chủ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Máy chủ IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Máy chủ POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Tự Động Hóa Hạ Tầng Của Chúng Tôi {#our-infrastructure-automation}

* [Tất cả playbook Ansible của chúng tôi](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Tăng cường bảo mật](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Cài đặt Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Cấu hình cơ sở dữ liệu](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Các Bài Viết Kỹ Thuật Của Chúng Tôi {#our-technical-blog-posts}

* [Phân Tích Hệ Sinh Thái NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Triển Khai Hệ Thống Thanh Toán](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Hướng Dẫn Kỹ Thuật Bảo Mật Email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Biểu Mẫu Liên Hệ JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Tích Hợp Email với React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Hướng Dẫn Giải Pháp Tự Lưu Trữ](https://forwardemail.net/blog/docs/self-hosted-solution)

### Các Nghiên Cứu Trường Hợp Doanh Nghiệp Của Chúng Tôi {#our-enterprise-case-studies}

* [Triển Khai Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Nghiên Cứu Trường Hợp Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Tuân Thủ Chính Phủ Liên Bang](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Hệ Thống Email Cựu Sinh Viên](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
