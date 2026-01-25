# Giới thiệu về Chuyển tiếp Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Giới thiệu về Chuyển tiếp Email {#about-forward-email-1}

## Mục lục {#table-of-contents}

* [Tổng quan](#overview)
* [Người sáng lập và Sứ mệnh](#founder-and-mission)
* [Dòng thời gian](#timeline)
  * [2017 - Thành lập và ra mắt](#2017---founding-and-launch)
  * [2018 - Cơ sở hạ tầng và tích hợp](#2018---infrastructure-and-integration)
  * [2019 - Cuộc cách mạng hiệu suất](#2019---performance-revolution)
  * [2020 - Tập trung vào quyền riêng tư và bảo mật](#2020---privacy-and-security-focus)
  * [2021 - Hiện đại hóa nền tảng](#2021---platform-modernization)
  * [2023 - Mở rộng cơ sở hạ tầng và tính năng](#2023---infrastructure-and-feature-expansion)
  * [2024 - Tối ưu hóa dịch vụ và các tính năng nâng cao](#2024---service-optimization-and-advanced-features)
  * [2025 - Tiếp tục đổi mới](#2025---continued-innovation)
* [Nguyên tắc cốt lõi](#core-principles)
* [Tình trạng hiện tại](#current-status)

## Tổng quan về {#overview}

> \[!TIP]
> Để biết thông tin chi tiết về kiến trúc, triển khai bảo mật và lộ trình của chúng tôi, vui lòng xem [Sách trắng kỹ thuật](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email là dịch vụ [miễn phí và mã nguồn mở](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [chuyển tiếp email](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") tập trung vào [quyền riêng tư](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") của người dùng. Khởi đầu là một giải pháp chuyển tiếp email đơn giản vào năm 2017, Forward Email đã phát triển thành một nền tảng email toàn diện, cung cấp không giới hạn tên miền tùy chỉnh, không giới hạn địa chỉ và bí danh email, không giới hạn địa chỉ email dùng một lần, bảo vệ chống thư rác và lừa đảo, lưu trữ hộp thư được mã hóa và nhiều tính năng nâng cao khác.

Dịch vụ này được duy trì và sở hữu bởi đội ngũ thiết kế và phát triển ban đầu. Nó được xây dựng bằng 100% phần mềm nguồn mở, sử dụng [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") và [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Người sáng lập và Sứ mệnh {#founder-and-mission}

Forward Email được thành lập bởi **Nicholas Baugh** vào năm 2017. Theo [Chuyển tiếp Email Sách trắng kỹ thuật](https://forwardemail.net/technical-whitepaper.pdf), Baugh ban đầu đang tìm kiếm một giải pháp tiết kiệm chi phí và đơn giản để kích hoạt email trên tên miền cho các dự án phụ của mình. Sau khi nghiên cứu các tùy chọn khả dụng, anh bắt đầu viết mã giải pháp của riêng mình và mua tên miền `forwardemail.net` vào ngày 2 tháng 10 năm 2017.

Sứ mệnh của Forward Email không chỉ dừng lại ở việc cung cấp dịch vụ email mà còn hướng đến việc thay đổi cách ngành tiếp cận quyền riêng tư và bảo mật email. Các giá trị cốt lõi của công ty bao gồm tính minh bạch, khả năng kiểm soát của người dùng và bảo vệ quyền riêng tư thông qua việc triển khai kỹ thuật chứ không chỉ đơn thuần là những cam kết về chính sách.

## Dòng thời gian {#timeline}

### 2017 - Thành lập và Ra mắt {#2017---founding-and-launch}

**Ngày 2 tháng 10 năm 2017**: Nicholas Baugh đã mua tên miền `forwardemail.net` sau khi nghiên cứu các giải pháp email tiết kiệm chi phí cho các dự án phụ của mình.

**Ngày 5 tháng 11 năm 2017**: Baugh đã tạo một tệp JavaScript 634 dòng bằng [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") để chuyển tiếp email cho bất kỳ tên miền tùy chỉnh nào. Triển khai ban đầu này đã được xuất bản dưới dạng mã nguồn mở trên [GitHub](https://github.com/forwardemail) và dịch vụ đã được ra mắt bằng GitHub Pages.

**Tháng 11 năm 2017**: Forward Email chính thức ra mắt sau bản phát hành đầu tiên. Phiên bản đầu tiên hoàn toàn dựa trên DNS, không cần đăng ký tài khoản hay quy trình đăng ký nào—chỉ đơn giản là một tệp README được viết bằng Markdown kèm hướng dẫn. Người dùng có thể thiết lập chuyển tiếp email bằng cách cấu hình bản ghi MX trỏ đến `mx1.forwardemail.net` và `mx2.forwardemail.net`, và thêm bản ghi TXT với `forward-email=user@gmail.com`.

Sự đơn giản và hiệu quả của giải pháp này đã thu hút sự chú ý của nhiều nhà phát triển nổi tiếng, bao gồm [David Heinemeier Hansson](https://dhh.dk) (người tạo ra Ruby on Rails), người vẫn tiếp tục sử dụng Forward Email trên tên miền `dhh.dk` của mình cho đến ngày nay.

### 2018 - Cơ sở hạ tầng và Tích hợp {#2018---infrastructure-and-integration}

**Tháng 4 năm 2018**: Khi [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") ra mắt [dịch vụ DNS dành cho người tiêu dùng ưu tiên quyền riêng tư](https://blog.cloudflare.com/announcing-1111/), Forward Email đã chuyển từ sử dụng [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") sang [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") để xử lý tra cứu [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), thể hiện cam kết của công ty đối với các lựa chọn cơ sở hạ tầng tập trung vào quyền riêng tư.

**Tháng 10 năm 2018**: Chuyển tiếp Email cho phép người dùng "Gửi thư dưới dạng" với [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") và [Triển vọng](https://en.wikipedia.org/wiki/Outlook "Outlook"), mở rộng khả năng tích hợp với các nhà cung cấp email phổ biến.

### 2019 - Cuộc cách mạng hiệu suất {#2019---performance-revolution}

**Tháng 5 năm 2019**: Forward Email được phát hành v2, đánh dấu một sự thay đổi lớn so với các phiên bản đầu tiên. Bản cập nhật này tập trung vào các cải tiến của [hiệu suất](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") thông qua việc sử dụng [các luồng](https://en.wikipedia.org/wiki/Streams "Streams") của [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), thiết lập nền tảng cho khả năng mở rộng của nền tảng.

### 2020 - Tập trung vào Quyền riêng tư và Bảo mật {#2020---privacy-and-security-focus}

**Tháng 2 năm 2020**: Forward Email đã phát hành gói Bảo vệ Quyền riêng tư Nâng cao, cho phép người dùng tắt cài đặt mục nhập bản ghi DNS công khai với bí danh cấu hình chuyển tiếp email của họ. Thông qua gói này, thông tin bí danh email của người dùng sẽ được ẩn khỏi việc tìm kiếm công khai trên Internet. Công ty cũng đã phát hành một tính năng cho phép bật hoặc tắt các bí danh cụ thể trong khi vẫn cho phép chúng xuất hiện dưới dạng địa chỉ email hợp lệ và trả về [Mã trạng thái SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") thành công, đồng thời email sẽ bị hủy ngay lập tức (tương tự như việc chuyển tiếp đầu ra đến [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Tháng 4 năm 2020**: Sau khi gặp vô số rào cản với các giải pháp phát hiện thư rác hiện có không tuân thủ chính sách bảo mật của Forward Email, công ty đã phát hành phiên bản alpha đầu tiên của Spam Scanner. Giải pháp [lọc chống thư rác](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") hoàn toàn miễn phí và mã nguồn mở này sử dụng phương pháp [Bộ lọc thư rác Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") kết hợp với bảo vệ [chống lừa đảo](https://en.wikipedia.org/wiki/Phishing "Phishing") và [Tấn công đồng âm IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email cũng đã phát hành [xác thực hai yếu tố](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) sử dụng [mật khẩu một lần](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) để tăng cường bảo mật tài khoản.

**Tháng 5 năm 2020**: Chuyển tiếp Email cho phép tùy chỉnh [chuyển tiếp cổng](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") như một giải pháp thay thế cho việc người dùng bị [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") chặn cổng. Công ty cũng đã phát hành [API RESTful chuyển tiếp email miễn phí](email-api) với tài liệu đầy đủ và các ví dụ yêu cầu và phản hồi theo thời gian thực, cùng với hỗ trợ webhook.

**Tháng 8 năm 2020**: Forward Email đã bổ sung tính năng hỗ trợ cho hệ thống xác thực email [Chuỗi đã nhận được xác thực](arc) ("ARC"), giúp tăng cường hơn nữa khả năng gửi và bảo mật email.

**Ngày 23 tháng 11 năm 2020**: Forward Email chính thức ra mắt sau khi vượt qua chương trình beta, đánh dấu một cột mốc quan trọng trong quá trình phát triển nền tảng.

### 2021 - Hiện đại hóa nền tảng {#2021---platform-modernization}

**Tháng 2 năm 2021**: Forward Email đã tái cấu trúc cơ sở mã của họ để loại bỏ tất cả các phụ thuộc [Trăn](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (ngôn ngữ lập trình)"), cho phép ngăn xếp của họ trở thành 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") và [Node.js](https://en.wikipedia.org/wiki/Node.js). Quyết định về kiến trúc này phù hợp với cam kết của công ty trong việc duy trì một ngăn xếp công nghệ mã nguồn mở, nhất quán.

**Ngày 27 tháng 9 năm 2021**: Chuyển tiếp email [hỗ trợ thêm](email-forwarding-regex-pattern-filter) cho các bí danh chuyển tiếp email phù hợp với [biểu thức chính quy](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), cung cấp cho người dùng khả năng định tuyến email tinh vi hơn.

### 2023 - Mở rộng cơ sở hạ tầng và tính năng {#2023---infrastructure-and-feature-expansion}

**Tháng 1 năm 2023**: Forward Email ra mắt trang web được thiết kế lại và tối ưu hóa tốc độ trang, cải thiện trải nghiệm và hiệu suất của người dùng.

**Tháng 2 năm 2023**: Công ty đã bổ sung hỗ trợ cho [nhật ký lỗi](/faq#do-you-store-error-logs) và triển khai bảng màu trang web [chế độ tối](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme), đáp ứng sở thích và nhu cầu trợ năng của người dùng.

**Tháng 3 năm 2023**: Forward Email đã phát hành [Quýt](https://github.com/forwardemail/tangerine#readme) và tích hợp nó vào toàn bộ cơ sở hạ tầng của mình, cho phép sử dụng [DNS qua HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ở lớp ứng dụng. Công ty cũng đã bổ sung hỗ trợ cho [MTA-STS](/faq#do-you-support-mta-sts) và chuyển từ [hCaptcha](/) sang [Cổng xoay Cloudflare](https://developers.cloudflare.com/turnstile).

**Tháng 4 năm 2023**: Forward Email đã triển khai và tự động hóa toàn bộ cơ sở hạ tầng mới. Toàn bộ dịch vụ bắt đầu chạy trên DNS cân bằng tải toàn cầu và dựa trên khoảng cách với các kiểm tra sức khỏe và chuyển đổi dự phòng sử dụng [Cloudflare](https://cloudflare.com), thay thế phương pháp DNS vòng tròn trước đây. Công ty đã chuyển sang **máy chủ bare metal** trên nhiều nhà cung cấp, bao gồm [Vultr](https://www.vultr.com/?ref=429848) và [Đại dương số](https://m.do.co/c/a7cecd27e071), cả hai đều là nhà cung cấp tuân thủ SOC 2 Loại 1. Cơ sở dữ liệu MongoDB và Redis đã được chuyển sang cấu hình cụm với các nút chính và nút dự phòng để đạt được tính khả dụng cao, mã hóa SSL đầu cuối, mã hóa khi nghỉ và khôi phục tại một thời điểm (PITR).

**Tháng 5 năm 2023**: Forward Email đã ra mắt tính năng **SMTP gửi đi** cho các yêu cầu [gửi email bằng SMTP](/faq#do-you-support-sending-email-with-smtp) và [gửi email bằng API](/faq#do-you-support-sending-email-with-api). Tính năng này bao gồm các biện pháp bảo vệ tích hợp để đảm bảo khả năng phân phối cao, hệ thống xếp hàng và thử lại hiện đại và mạnh mẽ, cùng [hỗ trợ nhật ký lỗi theo thời gian thực](/faq#do-you-store-error-logs).

**Tháng 11 năm 2023**: Forward Email đã ra mắt tính năng [**lưu trữ hộp thư được mã hóa**](/blog/docs/best-quantum-safe-encrypted-email-service) cho [Hỗ trợ IMAP](/faq#do-you-support-receiving-email-with-imap), đánh dấu bước tiến đáng kể về quyền riêng tư và bảo mật email.

**Tháng 12 năm 2023**: Công ty [hỗ trợ thêm](/faq#do-you-support-pop3) để giám sát [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [khóa thông hành và WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [thời gian để hộp thư đến](/faq#i) và [OpenPGP cho lưu trữ IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Tối ưu hóa dịch vụ và các tính năng nâng cao {#2024---service-optimization-and-advanced-features}

**Tháng 2 năm 2024**: Chuyển tiếp Email [đã thêm hỗ trợ lịch (CalDAV)](/faq#do-you-support-calendars-caldav), mở rộng khả năng của nền tảng ngoài email để bao gồm cả tính năng đồng bộ hóa lịch.

**Tháng 3 đến tháng 7 năm 2024**: Forward Email đã phát hành các bản tối ưu hóa và cải tiến lớn cho các dịch vụ IMAP, POP3 và CalDAV, với mục tiêu làm cho dịch vụ của họ nhanh như, nếu không muốn nói là nhanh hơn, các dịch vụ thay thế.

**Tháng 7 năm 2024**: Công ty [đã thêm hỗ trợ iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) khắc phục tình trạng Apple Mail trên iOS không hỗ trợ lệnh IMAP `IDLE`, cho phép thông báo theo thời gian thực cho các thiết bị Apple iOS. Forward Email cũng đã thêm thời gian theo dõi hộp thư đến ("TTI") cho dịch vụ của riêng họ và Yahoo/AOL, đồng thời bắt đầu cho phép người dùng mã hóa toàn bộ bản ghi DNS TXT ngay cả khi sử dụng gói miễn phí. Theo yêu cầu trong [Các cuộc thảo luận về Hướng dẫn về Quyền riêng tư](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) và [Các vấn đề của GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), công ty đã bổ sung khả năng cho phép các bí danh từ chối `250` một cách âm thầm, từ chối mềm `421` hoặc từ chối cứng `550` khi bị tắt.

**Tháng 8 năm 2024**: Forward Email đã bổ sung hỗ trợ xuất hộp thư theo định dạng [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) và [Hộp thư thoại](https://en.wikipedia.org/wiki/Mbox) (ngoài định dạng xuất [SQLite](https://en.wikipedia.org/wiki/SQLite) hiện có). [Đã thêm hỗ trợ chữ ký Webhook](https://forwardemail.net/faq#do-you-support-bounce-webhooks), và công ty bắt đầu cho phép người dùng gửi bản tin, thông báo và tiếp thị qua email thông qua dịch vụ SMTP gửi đi. Hạn ngạch lưu trữ theo tên miền và theo bí danh cho IMAP/POP3/CalDAV cũng đã được triển khai.

### 2025 - Tiếp tục đổi mới {#2025---continued-innovation}

**Từ tháng 9 năm 2024 đến tháng 1 năm 2025**: Chuyển tiếp Email [đã thêm tính năng trả lời tự động được yêu cầu nhiều và mã hóa OpenPGP/WKD để chuyển tiếp email](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), dựa trên khả năng lưu trữ hộp thư được mã hóa đã triển khai của họ.

**Ngày 21 tháng 1 năm 2025**: Jack, người bạn thân nhất của nhà sáng lập, chú chó đồng hành trung thành của anh, đã ra đi thanh thản ở tuổi gần 11. Jack [sẽ luôn được ghi nhớ](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) vì sự đồng hành bền bỉ của anh, hỗ trợ cho việc tạo ra Forward Email. [Chuyển tiếp Email Sách trắng kỹ thuật](https://forwardemail.net/technical-whitepaper.pdf) được dành tặng Jack, ghi nhận vai trò của anh trong sự phát triển của dịch vụ.

**Tháng 2 năm 2025**: Forward Email chuyển sang [Gói dữ liệu](https://www.datapacket.com) làm nhà cung cấp trung tâm dữ liệu chính mới, triển khai phần cứng tùy chỉnh, tập trung vào hiệu suất, nguyên bản để nâng cao hơn nữa độ tin cậy và tốc độ của dịch vụ.

**Tháng 6 năm 2025**: Forward Email đã ra mắt hỗ trợ cho [Giao thức CardDAV](/faq#do-you-support-contacts-carddav), mở rộng khả năng của nền tảng để bao gồm tính năng đồng bộ hóa danh bạ cùng với các dịch vụ email và lịch hiện có.

### 2026 - Tuân thủ RFC và lọc nâng cao {#2026---rfc-compliance-and-advanced-filtering}

**Tháng 1 năm 2026**: Forward Email đã phát hành một tài liệu toàn diện về [tuân thủ giao thức RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) chi tiết hỗ trợ đầy đủ các tiêu chuẩn SMTP, IMAP, POP3 và CalDAV. Nền tảng cũng đã thêm [hỗ trợ REQUIRETLS (RFC 8689)](/faq#requiretls-support) cho mã hóa TLS bắt buộc trong vận chuyển email, [mã hóa S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) cho ký và mã hóa tin nhắn an toàn, và [lọc email Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) với [giao thức ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering) hỗ trợ lọc email phía máy chủ. [REST API](/email-api) đã được mở rộng lên 39 điểm cuối bao gồm tin nhắn, thư mục, danh bạ, lịch và sự kiện lịch.

## Nguyên tắc cốt lõi {#core-principles}

Kể từ khi thành lập, Forward Email luôn cam kết kiên định với các nguyên tắc về quyền riêng tư và bảo mật:

**Triết lý nguồn mở 100%**: Không giống như các đối thủ cạnh tranh chỉ mở mã nguồn cho phần giao diện người dùng trong khi vẫn giữ phần phụ trợ đóng, Forward Email đã công khai toàn bộ cơ sở mã của mình—cả phần giao diện người dùng và phần phụ trợ—để công chúng có thể theo dõi trên [GitHub](https://github.com/forwardemail).

**Thiết kế ưu tiên quyền riêng tư**: Ngay từ ngày đầu tiên, Forward Email đã triển khai phương pháp xử lý trong bộ nhớ độc đáo giúp tránh ghi email vào đĩa, khác biệt so với các dịch vụ email thông thường lưu trữ thư trong cơ sở dữ liệu hoặc hệ thống tệp.

**Đổi mới liên tục**: Dịch vụ đã phát triển từ một giải pháp chuyển tiếp email đơn giản thành một nền tảng email toàn diện với các tính năng như hộp thư được mã hóa, mã hóa chống lượng tử và hỗ trợ các giao thức chuẩn bao gồm SMTP, IMAP, POP3 và CalDAV.

**Tính minh bạch**: Công khai toàn bộ mã nguồn và cho phép kiểm tra, đảm bảo người dùng có thể xác minh các tuyên bố về quyền riêng tư thay vì chỉ tin vào các tuyên bố tiếp thị.

**Kiểm soát của người dùng**: Trao quyền cho người dùng với nhiều tùy chọn, bao gồm khả năng tự lưu trữ toàn bộ nền tảng nếu muốn.

## Trạng thái hiện tại {#current-status}

Tính đến năm 2025, Forward Email phục vụ hơn 500.000 tên miền trên toàn thế giới, bao gồm các tổ chức nổi tiếng và các công ty hàng đầu trong ngành như:

* **Các công ty công nghệ**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Các tổ chức truyền thông**: Fox News Radio, Disney Ad Sales
* **Các cơ sở giáo dục**: Đại học Cambridge, Đại học Maryland, Đại học Washington, Đại học Tufts, Cao đẳng Swarthmore
* **Các cơ quan chính phủ**: Chính phủ Nam Úc, Chính phủ Cộng hòa Dominica
* **Các tổ chức khác**: RCD Hotels, Fly<span>.</span>io
* **Các nhà phát triển nổi bật**: Isaac Z. Schlueter (người tạo npm), David Heinemeier Hansson (người tạo Ruby on Rails)

Nền tảng này tiếp tục phát triển với các bản phát hành tính năng thường xuyên và cải tiến cơ sở hạ tầng, duy trì vị thế là dịch vụ email duy nhất hiện nay có mã nguồn mở 100%, được mã hóa, tập trung vào quyền riêng tư, minh bạch và chống lượng tử.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />