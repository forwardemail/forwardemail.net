# Về Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Câu chuyện đội ngũ và công ty Forward Email" class="rounded-lg" />

# Về Forward Email {#about-forward-email-1}


## Mục Lục {#table-of-contents}

* [Tổng quan](#overview)
* [Người sáng lập và Sứ mệnh](#founder-and-mission)
* [Dòng thời gian](#timeline)
  * [2017 - Thành lập và Ra mắt](#2017---founding-and-launch)
  * [2018 - Cơ sở hạ tầng và Tích hợp](#2018---infrastructure-and-integration)
  * [2019 - Cuộc cách mạng Hiệu suất](#2019---performance-revolution)
  * [2020 - Tập trung vào Quyền riêng tư và Bảo mật](#2020---privacy-and-security-focus)
  * [2021 - Hiện đại hóa Nền tảng](#2021---platform-modernization)
  * [2023 - Mở rộng Cơ sở hạ tầng và Tính năng](#2023---infrastructure-and-feature-expansion)
  * [2024 - Tối ưu hóa Dịch vụ và Tính năng Nâng cao](#2024---service-optimization-and-advanced-features)
  * [2025 - Cải tiến Quyền riêng tư và Hỗ trợ Giao thức {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - Tuân thủ RFC và Lọc Nâng cao {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Nguyên tắc Cốt lõi](#core-principles)
* [Tình trạng Hiện tại](#current-status)


## Tổng quan {#overview}

> \[!TIP]
> Để biết chi tiết kỹ thuật về kiến trúc, các triển khai bảo mật và lộ trình phát triển, xem [Bản trắng Kỹ thuật](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email là một dịch vụ [chuyển tiếp email miễn phí và mã nguồn mở](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") tập trung vào [quyền riêng tư của người dùng](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). Bắt đầu như một giải pháp chuyển tiếp email đơn giản vào năm 2017, dịch vụ đã phát triển thành một nền tảng email toàn diện cung cấp tên miền tùy chỉnh không giới hạn, địa chỉ email và bí danh không giới hạn, địa chỉ email dùng một lần không giới hạn, bảo vệ chống spam và lừa đảo, lưu trữ hộp thư được mã hóa, cùng nhiều tính năng nâng cao khác.

Dịch vụ được duy trì và sở hữu bởi đội ngũ sáng lập ban đầu gồm các nhà thiết kế và phát triển. Nó được xây dựng hoàn toàn bằng phần mềm mã nguồn mở sử dụng [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS"), và [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Người sáng lập và Sứ mệnh {#founder-and-mission}

Forward Email được thành lập bởi **Nicholas Baugh** vào năm 2017. Theo [Bản trắng Kỹ thuật Forward Email](https://forwardemail.net/technical-whitepaper.pdf), Baugh ban đầu đang tìm kiếm một giải pháp tiết kiệm chi phí và đơn giản để kích hoạt email trên các tên miền cho các dự án phụ của mình. Sau khi nghiên cứu các lựa chọn có sẵn, anh bắt đầu tự viết mã giải pháp của riêng mình và mua tên miền `forwardemail.net` vào ngày 2 tháng 10 năm 2017.

Sứ mệnh của Forward Email vượt ra ngoài việc cung cấp dịch vụ email—nó nhằm mục đích thay đổi cách ngành công nghiệp tiếp cận quyền riêng tư và bảo mật email. Các giá trị cốt lõi của công ty bao gồm minh bạch, kiểm soát của người dùng và bảo vệ quyền riêng tư thông qua triển khai kỹ thuật thay vì chỉ là các cam kết chính sách.


## Dòng thời gian {#timeline}

### 2017 - Thành lập và Ra mắt {#2017---founding-and-launch}

**Ngày 2 tháng 10 năm 2017**: Nicholas Baugh đã mua tên miền `forwardemail.net` sau khi nghiên cứu các giải pháp email tiết kiệm chi phí cho các dự án phụ của mình.

**Ngày 5 tháng 11 năm 2017**: Baugh đã tạo một tệp JavaScript dài 634 dòng sử dụng [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") để chuyển tiếp email cho bất kỳ tên miền tùy chỉnh nào. Triển khai ban đầu này được công bố mã nguồn mở trên [GitHub](https://github.com/forwardemail) và dịch vụ được ra mắt sử dụng GitHub Pages.
**Tháng 11 năm 2017**: Forward Email chính thức ra mắt sau một phiên bản phát hành ban đầu. Phiên bản đầu tiên hoàn toàn dựa trên DNS mà không cần đăng ký tài khoản hay quy trình đăng ký—chỉ đơn giản là một tệp README được viết bằng Markdown với hướng dẫn. Người dùng có thể thiết lập chuyển tiếp email bằng cách cấu hình các bản ghi MX trỏ đến `mx1.forwardemail.net` và `mx2.forwardemail.net`, đồng thời thêm một bản ghi TXT với `forward-email=user@gmail.com`.

Sự đơn giản và hiệu quả của giải pháp này đã thu hút sự chú ý từ các nhà phát triển nổi tiếng, bao gồm [David Heinemeier Hansson](https://dhh.dk) (người tạo ra Ruby on Rails), người vẫn tiếp tục sử dụng Forward Email trên tên miền `dhh.dk` của mình cho đến ngày nay.

### 2018 - Cơ sở hạ tầng và Tích hợp {#2018---infrastructure-and-integration}

**Tháng 4 năm 2018**: Khi [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") ra mắt [dịch vụ DNS tiêu dùng ưu tiên quyền riêng tư](https://blog.cloudflare.com/announcing-1111/), Forward Email đã chuyển từ sử dụng [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") sang [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") để xử lý các tra cứu [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), thể hiện cam kết của công ty đối với các lựa chọn cơ sở hạ tầng tập trung vào quyền riêng tư.

**Tháng 10 năm 2018**: Forward Email cho phép người dùng "Gửi thư như" với [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") và [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), mở rộng khả năng tích hợp với các nhà cung cấp email phổ biến.

### 2019 - Cuộc cách mạng Hiệu suất {#2019---performance-revolution}

**Tháng 5 năm 2019**: Forward Email phát hành phiên bản v2, đại diện cho một sự viết lại lớn so với các phiên bản ban đầu. Bản cập nhật này tập trung vào cải thiện [hiệu suất](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") thông qua việc sử dụng các [luồng](https://en.wikipedia.org/wiki/Streams "Streams") của [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), thiết lập nền tảng cho khả năng mở rộng của nền tảng.

### 2020 - Tập trung vào Quyền riêng tư và Bảo mật {#2020---privacy-and-security-focus}

**Tháng 2 năm 2020**: Forward Email phát hành kế hoạch Bảo vệ Quyền riêng tư Nâng cao, cho phép người dùng tắt việc thiết lập các bản ghi DNS công khai với các bí danh cấu hình chuyển tiếp email của họ. Thông qua kế hoạch này, thông tin bí danh email của người dùng được ẩn khỏi việc tìm kiếm công khai trên Internet. Công ty cũng phát hành tính năng cho phép bật hoặc tắt các bí danh cụ thể trong khi vẫn cho phép chúng xuất hiện như các địa chỉ email hợp lệ và trả về các [mã trạng thái SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") thành công, với email được loại bỏ ngay lập tức (tương tự như việc chuyển đầu ra sang [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Tháng 4 năm 2020**: Sau khi gặp phải vô số trở ngại với các giải pháp phát hiện thư rác hiện có không tuân thủ chính sách quyền riêng tư của Forward Email, công ty đã phát hành phiên bản alpha ban đầu của Trình Quét Thư Rác. Giải pháp [lọc thư rác](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") hoàn toàn miễn phí và mã nguồn mở này sử dụng phương pháp lọc thư rác [Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") kết hợp với bảo vệ chống [lừa đảo](https://en.wikipedia.org/wiki/Phishing "Phishing") và tấn công [IDN homograph](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email cũng phát hành [xác thực hai yếu tố](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) sử dụng [mật khẩu dùng một lần](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) để tăng cường bảo mật tài khoản.

**Tháng 5 năm 2020**: Forward Email cho phép [chuyển tiếp cổng tùy chỉnh](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") như một giải pháp cho người dùng để vượt qua việc chặn cổng bởi [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Công ty cũng phát hành [API RESTful Chuyển tiếp Email Miễn phí](email-api) với tài liệu đầy đủ và các ví dụ yêu cầu và phản hồi theo thời gian thực, cùng với hỗ trợ webhook.
**Tháng 8 năm 2020**: Forward Email đã thêm hỗ trợ cho hệ thống xác thực email [Authenticated Received Chain](arc) ("ARC"), tăng cường bảo mật và khả năng gửi email thành công.

**Ngày 23 tháng 11 năm 2020**: Forward Email chính thức ra mắt công khai sau chương trình beta, đánh dấu một cột mốc quan trọng trong sự phát triển của nền tảng.

### 2021 - Hiện đại hóa nền tảng {#2021---platform-modernization}

**Tháng 2 năm 2021**: Forward Email đã tái cấu trúc mã nguồn để loại bỏ tất cả các phụ thuộc vào [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), cho phép hệ thống của họ trở thành 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") và [Node.js](https://en.wikipedia.org/wiki/Node.js). Quyết định kiến trúc này phù hợp với cam kết của công ty trong việc duy trì một ngăn xếp công nghệ mã nguồn mở nhất quán.

**Ngày 27 tháng 9 năm 2021**: Forward Email [thêm hỗ trợ](email-forwarding-regex-pattern-filter) cho các bí danh chuyển tiếp email để khớp với [biểu thức chính quy](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), cung cấp cho người dùng khả năng định tuyến email tinh vi hơn.

### 2023 - Mở rộng hạ tầng và tính năng {#2023---infrastructure-and-feature-expansion}

**Tháng 1 năm 2023**: Forward Email ra mắt trang web được thiết kế lại và tối ưu tốc độ tải trang, cải thiện trải nghiệm người dùng và hiệu suất.

**Tháng 2 năm 2023**: Công ty đã thêm hỗ trợ cho [nhật ký lỗi](/faq#do-you-store-error-logs) và triển khai giao diện màu [chế độ tối](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) cho trang web, đáp ứng sở thích và nhu cầu truy cập của người dùng.

**Tháng 3 năm 2023**: Forward Email phát hành [Tangerine](https://github.com/forwardemail/tangerine#readme) và tích hợp nó trong toàn bộ hạ tầng, cho phép sử dụng [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ở tầng ứng dụng. Công ty cũng thêm hỗ trợ cho [MTA-STS](/faq#do-you-support-mta-sts) và chuyển từ [hCaptcha](/) sang [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**Tháng 4 năm 2023**: Forward Email đã triển khai và tự động hóa hoàn toàn hạ tầng mới. Toàn bộ dịch vụ bắt đầu chạy trên DNS cân bằng tải toàn cầu và dựa trên vị trí gần nhất với kiểm tra sức khỏe và chuyển đổi dự phòng sử dụng [Cloudflare](https://cloudflare.com), thay thế phương pháp DNS vòng tròn trước đây. Công ty chuyển sang sử dụng **máy chủ vật lý** tại nhiều nhà cung cấp, bao gồm [Vultr](https://www.vultr.com/?ref=429848) và [Digital Ocean](https://m.do.co/c/a7cecd27e071), cả hai đều là nhà cung cấp tuân thủ SOC 2 Loại 1. Cơ sở dữ liệu MongoDB và Redis được chuyển sang cấu hình cụm với các nút chính và dự phòng để đảm bảo tính khả dụng cao, mã hóa SSL đầu-cuối, mã hóa khi lưu trữ và phục hồi điểm thời gian (PITR).

**Tháng 5 năm 2023**: Forward Email ra mắt tính năng **SMTP gửi đi** cho các yêu cầu [gửi email bằng SMTP](/faq#do-you-support-sending-email-with-smtp) và [gửi email bằng API](/faq#do-you-support-sending-email-with-api). Tính năng này bao gồm các biện pháp bảo vệ tích hợp để đảm bảo khả năng gửi thành công cao, hệ thống hàng đợi và thử lại hiện đại và mạnh mẽ, và [hỗ trợ nhật ký lỗi theo thời gian thực](/faq#do-you-store-error-logs).

**Tháng 11 năm 2023**: Forward Email ra mắt tính năng [**lưu trữ hộp thư mã hóa**](/blog/docs/best-quantum-safe-encrypted-email-service) cho [hỗ trợ IMAP](/faq#do-you-support-receiving-email-with-imap), đại diện cho bước tiến lớn trong bảo mật và riêng tư email.

**Tháng 12 năm 2023**: Công ty [thêm hỗ trợ](/faq#do-you-support-pop3) cho [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys và WebAuthn](/faq#do-you-support-passkeys-and-webauthn), giám sát [thời gian đến hộp thư](/faq#i), và [OpenPGP cho lưu trữ IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Tối ưu dịch vụ và tính năng nâng cao {#2024---service-optimization-and-advanced-features}

**Tháng 2 năm 2024**: Forward Email [thêm hỗ trợ lịch (CalDAV)](/faq#do-you-support-calendars-caldav), mở rộng khả năng của nền tảng vượt ra ngoài email để bao gồm đồng bộ lịch.
**Tháng 3 đến tháng 7 năm 2024**: Forward Email đã phát hành các tối ưu hóa và cải tiến lớn cho dịch vụ IMAP, POP3 và CalDAV của họ, với mục tiêu làm cho dịch vụ của họ nhanh như, nếu không muốn nói là nhanh hơn, các lựa chọn thay thế.

**Tháng 7 năm 2024**: Công ty [đã thêm hỗ trợ iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) để giải quyết việc Apple Mail trên iOS không hỗ trợ lệnh IMAP `IDLE`, cho phép thông báo thời gian thực cho các thiết bị Apple iOS. Forward Email cũng đã thêm giám sát thời gian vào hộp thư ("TTI") cho dịch vụ của họ và Yahoo/AOL, và bắt đầu cho phép người dùng mã hóa toàn bộ bản ghi DNS TXT ngay cả trên gói miễn phí. Theo yêu cầu trong các [thảo luận Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) và [vấn đề GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), công ty đã thêm khả năng cho các bí danh từ chối im lặng `250`, từ chối mềm `421`, hoặc từ chối cứng `550` khi bị vô hiệu hóa.

**Tháng 8 năm 2024**: Forward Email đã thêm hỗ trợ xuất hộp thư dưới định dạng [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) và [Mbox](https://en.wikipedia.org/wiki/Mbox) (bên cạnh định dạng xuất [SQLite](https://en.wikipedia.org/wiki/SQLite) hiện có). [Hỗ trợ chữ ký webhook đã được thêm](https://forwardemail.net/faq#do-you-support-bounce-webhooks), và công ty bắt đầu cho phép người dùng gửi bản tin, thông báo và tiếp thị qua email thông qua dịch vụ SMTP gửi đi của họ. Các hạn mức lưu trữ theo miền và theo bí danh cho IMAP/POP3/CalDAV cũng đã được triển khai.

### 2025 - Cải tiến quyền riêng tư và hỗ trợ giao thức {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**Tháng 9 năm 2024 đến tháng 1 năm 2025**: Forward Email [đã thêm tính năng trả lời tự động khi đi nghỉ được nhiều người yêu cầu và mã hóa OpenPGP/WKD cho chuyển tiếp email](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), xây dựng dựa trên khả năng lưu trữ hộp thư được mã hóa đã được triển khai trước đó.

**Ngày 21 tháng 1 năm 2025**: Người bạn thân nhất của nhà sáng lập "Jack", chú chó trung thành của ông, đã yên nghỉ ở tuổi gần 11. Jack [sẽ luôn được nhớ đến](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) vì sự đồng hành không ngừng nghỉ đã hỗ trợ việc tạo ra Forward Email. [Bản Báo cáo Kỹ thuật Forward Email](https://forwardemail.net/technical-whitepaper.pdf) được dành tặng cho Jack, ghi nhận vai trò của chú trong sự phát triển của dịch vụ.

**Tháng 2 năm 2025**: Forward Email chuyển sang [DataPacket](https://www.datapacket.com) làm nhà cung cấp trung tâm dữ liệu chính mới, triển khai phần cứng bare-metal tùy chỉnh, tập trung vào hiệu suất để nâng cao hơn nữa độ tin cậy và tốc độ dịch vụ.

**Tháng 3 năm 2025**: Phiên bản 1.0 của Forward Email chính thức được phát hành.

**Tháng 4 năm 2025**: Phiên bản đầu tiên của [Báo cáo Kỹ thuật Forward Email](https://forwardemail.net/technical-whitepaper.pdf) được xuất bản, và công ty bắt đầu chấp nhận thanh toán bằng tiền điện tử.

**Tháng 5 năm 2025**: Dịch vụ ra mắt tài liệu API mới sử dụng [Scalar](https://github.com/scalar/scalar).

**Tháng 6 năm 2025**: Forward Email ra mắt hỗ trợ cho [giao thức CardDAV](/faq#do-you-support-contacts-carddav), mở rộng khả năng nền tảng để bao gồm đồng bộ danh bạ bên cạnh các dịch vụ email và lịch hiện có.

**Tháng 8 năm 2025**: Nền tảng thêm hỗ trợ [CalDAV VTODO/công việc](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), cho phép quản lý công việc bên cạnh các sự kiện lịch.

**Tháng 11 năm 2025**: Bảo mật nền tảng được nâng cao với việc chuyển đổi từ PBKDF2 sang [Argon2id](https://en.wikipedia.org/wiki/Argon2) cho việc băm mật khẩu, và hạ tầng được chuyển từ Redis sang [Valkey](https://github.com/valkey-io/valkey).

**Tháng 12 năm 2025**: Phiên bản 2.0 được phát hành, giới thiệu hỗ trợ [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) để bắt buộc mã hóa TLS trên truyền tải email và nâng cấp lên [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) phiên bản 6.
### 2026 - Tuân thủ RFC và Lọc Nâng cao {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Tháng 1 năm 2026**: Forward Email đã phát hành một [tài liệu tuân thủ giao thức RFC toàn diện](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) và thêm hỗ trợ cho [mã hóa S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) cùng với [lọc email Sieve toàn diện (RFC 5228)](/faq#do-you-support-sieve-email-filtering) với hỗ trợ [giao thức ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering). REST API cũng được mở rộng lên 39 điểm cuối.

**Tháng 2 năm 2026**: Ứng dụng webmail mã nguồn mở chính thức được ra mắt tại [mail.forwardemail.net](https://mail.forwardemail.net) ([mã nguồn trên GitHub](https://github.com/forwardemail/mail.forwardemail.net)). Nền tảng cũng bổ sung hỗ trợ cho [Tiện ích Lên lịch CalDAV (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities), và [Domain Connect](https://domainconnect.org) cho thiết lập DNS chỉ với 1 cú nhấp. Thông báo đẩy thời gian thực cho IMAP, CalDAV, và CardDAV được triển khai sử dụng WebSockets.

**Tháng 3 năm 2026**: Hỗ trợ lưu trữ tùy chỉnh tương thích S3 theo từng tên miền được thêm vào, cùng với công cụ dòng lệnh để quản lý. Công việc bắt đầu phát triển ứng dụng desktop và di động đa nền tảng cho macOS, Windows, Linux, iOS, và Android sử dụng cùng mã nguồn webmail mã nguồn mở, được xây dựng với [Tauri](https://tauri.app).


## Nguyên Tắc Cốt Lõi {#core-principles}

Kể từ khi thành lập, Forward Email đã duy trì cam kết vững chắc với các nguyên tắc về quyền riêng tư và bảo mật:

**Triết lý Mã nguồn mở 100%**: Khác với các đối thủ chỉ mở mã nguồn frontend trong khi backend vẫn đóng, Forward Email đã công khai toàn bộ mã nguồn—cả frontend và backend—cho công chúng kiểm tra trên [GitHub](https://github.com/forwardemail).

**Thiết kế Ưu tiên Quyền riêng tư**: Ngay từ ngày đầu, Forward Email đã triển khai phương pháp xử lý trong bộ nhớ độc đáo, tránh ghi email ra đĩa, khác biệt với các dịch vụ email truyền thống lưu trữ tin nhắn trong cơ sở dữ liệu hoặc hệ thống tập tin.

**Đổi mới Liên tục**: Dịch vụ đã phát triển từ một giải pháp chuyển tiếp email đơn giản thành một nền tảng email toàn diện với các tính năng như hộp thư mã hóa, mã hóa chống lượng tử, và hỗ trợ các giao thức chuẩn bao gồm SMTP, IMAP, POP3, và CalDAV.

**Minh bạch**: Công khai toàn bộ mã nguồn để người dùng có thể kiểm tra các tuyên bố về quyền riêng tư thay vì chỉ tin vào các quảng cáo tiếp thị.

**Kiểm soát của Người dùng**: Trao quyền cho người dùng với các tùy chọn, bao gồm khả năng tự lưu trữ toàn bộ nền tảng nếu muốn.


## Tình Trạng Hiện Tại {#current-status}

Tính đến tháng 3 năm 2026, Forward Email phục vụ hơn 500.000 tên miền trên toàn thế giới, bao gồm các tổ chức và nhà lãnh đạo ngành đáng chú ý như:

* **Công ty Công nghệ**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Tổ chức Truyền thông**: Fox News Radio, Disney Ad Sales
* **Cơ sở Giáo dục**: Đại học Cambridge, Đại học Maryland, Đại học Washington, Đại học Tufts, Swarthmore College
* **Cơ quan Chính phủ**: Chính phủ Nam Úc, Chính phủ Cộng hòa Dominica
* **Tổ chức Khác**: RCD Hotels, Fly<span>.</span>io
* **Nhà phát triển Nổi bật**: Isaac Z. Schlueter (người tạo npm), David Heinemeier Hansson (người tạo Ruby on Rails)

Nền tảng tiếp tục phát triển với các bản phát hành tính năng và cải tiến hạ tầng thường xuyên, duy trì vị thế là dịch vụ email duy nhất 100% mã nguồn mở, mã hóa, tập trung vào quyền riêng tư, minh bạch và chống lượng tử có sẵn hiện nay.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
