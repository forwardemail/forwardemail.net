# Nghĩa địa khởi nghiệp email: Tại sao hầu hết các công ty email đều thất bại {#the-email-startup-graveyard-why-most-email-companies-fail}

<img loading="lazy" src="/img/articles/email-startup-graveyard.webp" alt="" class="rounded-lg" />

<p class="lead mt-3">Trong khi nhiều công ty khởi nghiệp email đã đầu tư hàng triệu đô la để giải quyết các vấn đề nhận thức được, chúng tôi tại <a href="https://forwardemail.net">Forward Email</a> đã tập trung vào việc xây dựng cơ sở hạ tầng email đáng tin cậy từ đầu kể từ năm 2017. Phân tích này khám phá các mô hình đằng sau kết quả của các công ty khởi nghiệp email và những thách thức cơ bản của cơ sở hạ tầng email.</p>

> \[!NOTE]
> **Key Insight**: Most email startups don't build actual email infrastructure from scratch. Many build on top of existing solutions like Amazon SES or open-source systems like Postfix. The core protocols work well - the challenge is in the implementation.

> \[!TIP]
> **Technical Deep Dive**: For comprehensive details on our approach, architecture, and security implementation, see our [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) and [About page](https://forwardemail.net/en/about) which documents our complete development timeline since 2017.

## Mục lục {#table-of-contents}

* [Ma trận thất bại của khởi nghiệp email](#the-email-startup-failure-matrix)
* [Kiểm tra thực tế cơ sở hạ tầng](#the-infrastructure-reality-check)
  * [Những gì thực sự chạy Email](#what-actually-runs-email)
  * ["Các công ty khởi nghiệp về email" thực sự xây dựng những gì](#what-email-startups-actually-build)
* [Tại sao hầu hết các công ty khởi nghiệp email đều thất bại](#why-most-email-startups-fail)
  * [1. Giao thức email hoạt động, nhưng việc triển khai thường không](#1-email-protocols-work-implementation-often-doesnt)
  * [2. Hiệu ứng mạng lưới là không thể phá vỡ](#2-network-effects-are-unbreakable)
  * [3. Họ thường nhắm vào những vấn đề sai](#3-they-often-target-the-wrong-problems)
  * [4. Nợ kỹ thuật là rất lớn](#4-technical-debt-is-massive)
  * [5. Cơ sở hạ tầng đã tồn tại](#5-the-infrastructure-already-exists)
* [Các nghiên cứu tình huống: Khi các công ty khởi nghiệp email thất bại](#case-studies-when-email-startups-fail)
  * [Nghiên cứu tình huống: Thảm họa Skiff](#case-study-the-skiff-disaster)
  * [Phân tích máy gia tốc](#the-accelerator-analysis)
  * [Cái bẫy của vốn đầu tư mạo hiểm](#the-venture-capital-trap)
* [Thực tế kỹ thuật: Các ngăn xếp email hiện đại](#the-technical-reality-modern-email-stacks)
  * [Điều gì thực sự thúc đẩy "Email Startups"](#what-actually-powers-email-startups)
  * [Các vấn đề về hiệu suất](#the-performance-problems)
* [Các mô hình mua lại: Thành công so với Đóng cửa](#the-acquisition-patterns-success-vs-shutdown)
  * [Hai Mẫu](#the-two-patterns)
  * [Ví dụ gần đây](#recent-examples)
* [Sự tiến hóa và hợp nhất của ngành công nghiệp](#industry-evolution-and-consolidation)
  * [Tiến trình công nghiệp tự nhiên](#natural-industry-progression)
  * [Chuyển đổi sau khi mua lại](#post-acquisition-transitions)
  * [Những cân nhắc của người dùng trong quá trình chuyển đổi](#user-considerations-during-transitions)
* [Kiểm tra thực tế của Hacker News](#the-hacker-news-reality-check)
* [Sự lừa đảo của AI Email hiện đại](#the-modern-ai-email-grift)
  * [Làn sóng mới nhất](#the-latest-wave)
  * [Những vấn đề cũ](#the-same-old-problems)
* [Những gì thực sự hiệu quả: Những câu chuyện thành công thực sự của email](#what-actually-works-the-real-email-success-stories)
  * [Các công ty cơ sở hạ tầng (Những người chiến thắng)](#infrastructure-companies-the-winners)
  * [Nhà cung cấp email (Những người sống sót)](#email-providers-the-survivors)
  * [Ngoại lệ: Câu chuyện thành công của Xobni](#the-exception-xobnis-success-story)
  * [Mẫu](#the-pattern)
* [Đã có ai thành công trong việc tái tạo email chưa?](#has-anyone-successfully-reinvented-email)
  * [Những gì thực sự bị mắc kẹt](#what-actually-stuck)
  * [Các công cụ mới bổ sung cho email (nhưng không thay thế nó)](#new-tools-complement-email-but-dont-replace-it)
  * [Thí nghiệm HEY](#the-hey-experiment)
  * [Những gì thực sự hiệu quả](#what-actually-works)
* [Xây dựng cơ sở hạ tầng hiện đại cho các giao thức email hiện có: Cách tiếp cận của chúng tôi](#building-modern-infrastructure-for-existing-email-protocols-our-approach)
  * [Phổ đổi mới Email](#the-email-innovation-spectrum)
  * [Tại sao chúng tôi tập trung vào cơ sở hạ tầng](#why-we-focus-on-infrastructure)
  * [Những gì thực sự hiệu quả trong Email](#what-actually-works-in-email)
* [Cách tiếp cận của chúng tôi: Tại sao chúng tôi khác biệt](#our-approach-why-were-different)
  * [Chúng tôi làm gì](#what-we-do)
  * [Những gì chúng tôi không làm](#what-we-dont-do)
* [Cách chúng tôi xây dựng cơ sở hạ tầng email thực sự hiệu quả](#how-we-build-email-infrastructure-that-actually-works)
  * [Cách tiếp cận chống khởi nghiệp của chúng tôi](#our-anti-startup-approach)
  * [Điều gì làm chúng tôi khác biệt](#what-makes-us-different)
  * [So sánh nhà cung cấp dịch vụ email: Tăng trưởng thông qua các giao thức đã được chứng minh](#email-service-provider-comparison-growth-through-proven-protocols)
  * [Dòng thời gian kỹ thuật](#the-technical-timeline)
  * [Tại sao chúng ta thành công trong khi người khác thất bại](#why-we-succeed-where-others-fail)
  * [Kiểm tra thực tế chi phí](#the-cost-reality-check)
* [Thách thức bảo mật trong cơ sở hạ tầng email](#security-challenges-in-email-infrastructure)
  * [Những cân nhắc chung về bảo mật](#common-security-considerations)
  * [Giá trị của sự minh bạch](#the-value-of-transparency)
  * [Những thách thức về an ninh đang diễn ra](#ongoing-security-challenges)
* [Kết luận: Tập trung vào cơ sở hạ tầng, không phải ứng dụng](#conclusion-focus-on-infrastructure-not-apps)
  * [Bằng chứng rõ ràng](#the-evidence-is-clear)
  * [Bối cảnh lịch sử](#the-historical-context)
  * [Bài học thực sự](#the-real-lesson)
* [Nghĩa địa email mở rộng: Nhiều lỗi và sự cố hơn](#the-extended-email-graveyard-more-failures-and-shutdowns)
  * [Các thí nghiệm email của Google đã sai](#googles-email-experiments-gone-wrong)
  * [Thất bại liên tiếp: Ba cái chết của Newton Mail](#the-serial-failure-newton-mails-three-deaths)
  * [Các ứng dụng chưa bao giờ ra mắt](#the-apps-that-never-launched)
  * [Mô hình từ tiếp nhận đến đóng cửa](#the-acquisition-to-shutdown-pattern)
  * [Hợp nhất cơ sở hạ tầng email](#email-infrastructure-consolidation)
* [Nghĩa địa email nguồn mở: Khi "Miễn phí" không bền vững](#the-open-source-email-graveyard-when-free-isnt-sustainable)
  * [Nylas Mail → Mailspring: Chiếc nĩa không thể](#nylas-mail--mailspring-the-fork-that-couldnt)
  * [Eudora: Cuộc hành trình tử thần kéo dài 18 năm](#eudora-the-18-year-death-march)
  * [FairEmail: Bị giết bởi Chính trị Google Play](#fairemail-killed-by-google-play-politics)
  * [Vấn đề bảo trì](#the-maintenance-problem)
* [Sự bùng nổ của công nghệ email AI: Lịch sử lặp lại với "Trí thông minh"](#the-ai-email-startup-surge-history-repeating-with-intelligence)
  * [Cơn sốt email AI hiện tại](#the-current-ai-email-gold-rush)
  * [Cơn sốt tài trợ](#the-funding-frenzy)
  * [Tại sao tất cả họ sẽ thất bại (một lần nữa)](#why-theyll-all-fail-again)
  * [Kết quả tất yếu](#the-inevitable-outcome)
* [Thảm họa hợp nhất: Khi "Những người sống sót" trở thành thảm họa](#the-consolidation-catastrophe-when-survivors-become-disasters)
  * [Hợp nhất dịch vụ email tuyệt vời](#the-great-email-service-consolidation)
  * [Triển vọng: "Kẻ sống sót" không thể ngừng phá vỡ](#outlook-the-survivor-that-cant-stop-breaking)
  * [Vấn đề cơ sở hạ tầng của dấu bưu điện](#the-postmark-infrastructure-problem)
  * [Thương vong gần đây của Email Client (2024-2025)](#recent-email-client-casualties-2024-2025)
  * [Mở rộng Email và Mua dịch vụ](#email-extension-and-service-acquisitions)
  * [Những người sống sót: Các công ty email thực sự hoạt động](#the-survivors-email-companies-that-actually-work)

## Ma trận lỗi khởi động email {#the-email-startup-failure-matrix}

> \[!CAUTION]
> **Failure Rate Alert**: [Techstars alone has 28 email-related companies](https://www.techstars.com/portfolio) with only 5 exits - an exceedingly high failure rate (sometimes calculated to be 80%+).

Sau đây là mọi thất bại lớn của các công ty khởi nghiệp email mà chúng tôi có thể tìm thấy, được sắp xếp theo đơn vị tăng tốc, nguồn tài trợ và kết quả:

| Công ty | Năm | Máy gia tốc | Tài trợ | Kết quả | Trạng thái | Vấn đề chính |
| ----------------- | ---- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Thuyền nhỏ** | 2024 | - | [$14.2M total](https://techcrunch.com/2022/03/30/skiff-series-a-encrypted-workspaces/) | Được Notion mua lại → Đóng cửa | 😵 Chết rồi | [Founders left Notion for Cursor](https://x.com/skeptrune/status/1939763513695903946) |
| **Chim sẻ** | 2012 | - | [$247K seed](https://techcrunch.com/2012/07/20/google-acquires-iosmac-email-client-sparrow/), [<$25M acquisition](https://www.theverge.com/2012/7/20/3172365/sources-google-sparrow-25-million-gmail-client) | Được Google mua lại → Đóng cửa | 😵 Chết rồi | [Talent acquisition only](https://money.cnn.com/2012/07/20/technology/google-acquires-sparrow/index.htm) |
| **Email Copilot** | 2012 | Ngôi sao công nghệ | ~$120K (tiêu chuẩn Techstars) | Đã mua → Tắt máy | 😵 Chết rồi | [Now redirects to Validity](https://www.validity.com/blog/validity-return-path-announcement/) |
| **Trả lờiGửi** | 2012 | Ngôi sao công nghệ | ~$120K (tiêu chuẩn Techstars) | Thất bại | 😵 Chết rồi | [Vague value proposition](https://www.f6s.com/company/replysend) |
| **Đã đóng gói** | 2012 | Ngôi sao công nghệ | ~$120K (tiêu chuẩn Techstars) | Thất bại | 😵 Chết rồi | ["Easy. Secure. Email"](https://www.geekwire.com/2012/techstars-spotlight-nveloped/) |
| **Bối rối** | 2015 | Ngôi sao công nghệ | ~$120K (tiêu chuẩn Techstars) | Thất bại | 😵 Chết rồi | [Email encryption](https://www.siliconrepublic.com/start-ups/irish-start-up-jumble-one-of-11-included-in-techstars-cloud-accelerator) |
| **Hộp thư đến sốt** | 2011 | Ngôi sao công nghệ | ~$118K (Techstars 2011) | Thất bại | 😵 Chết rồi | [API for email apps](https://twitter.com/inboxfever) |
| **E-mail** | 2014 | YC | ~$120K (tiêu chuẩn YC) | Xoay trục | 🧟 Thây ma | [Mobile email → "wellness"](https://www.ycdb.co/company/emailio) |
| **MailTime** | 2016 | YC | ~$120K (tiêu chuẩn YC) | Xoay trục | 🧟 Thây ma | [Email client → analytics](https://www.ycdb.co/company/mailtime) |
| **gửi lại** | 2009 | YC | ~$20K (YC 2009) | [Acquired by Google](https://techcrunch.com/2010/02/17/google-remail-iphone/) → Tắt máy | 😵 Chết rồi | [iPhone email search](https://www.ycombinator.com/companies/remail) |
| **Mailhaven** | 2016 | 500 Toàn cầu | ~$100K (tiêu chuẩn 500) | Đã thoát | Không rõ | [Package tracking](https://medium.com/@Kela/the-mailhaven-a-smarter-way-to-track-manage-and-receive-packages-edf202d73b06) |

## Kiểm tra thực tế về cơ sở hạ tầng {#the-infrastructure-reality-check}

> \[!WARNING]
> **The Hidden Truth**: Every single "email startup" is just building UI on top of existing infrastructure. They're not building actual email servers - they're building apps that connect to real email infrastructure.

### Email thực sự chạy như thế nào {#what-actually-runs-email}

```mermaid
graph TD
    A[Email Infrastructure] --> B[Amazon SES]
    A --> C[Postfix SMTP]
    A --> D[Cyrus IMAP]
    A --> E[SpamAssassin]
    A --> F[DKIM/SPF/DMARC]

    B --> G[Powers most email APIs]
    C --> H[Actual SMTP server everywhere]
    D --> I[Handles email storage]
    E --> J[Filters spam]
    F --> K[Authentication that works]
```

### "Các công ty khởi nghiệp email" thực sự xây dựng những gì {#what-email-startups-actually-build}

```mermaid
graph LR
    A[Email Startup Stack] --> B[React Native Apps]
    A --> C[Web Interfaces]
    A --> D[AI Features]
    A --> E[Security Layers]
    A --> F[API Wrappers]

    B --> G[Memory leaks]
    C --> H[Break email threading]
    D --> I[Gmail already has]
    E --> J[Break existing workflows]
    F --> K[Amazon SES with 10x markup]
```

> \[!TIP]
> **Key Pattern for Email Success**: The companies that actually succeed in email don't try to reinvent the wheel. Instead, they build **infrastructure and tools that enhance** existing email workflows. [SendGrid](https://sendgrid.com/), [Mailgun](https://www.mailgun.com/), and [Postmark](https://postmarkapp.com/) became billion-dollar companies by providing reliable SMTP APIs and delivery services - they work **with** email protocols, not against them. This is the same approach we take at Forward Email.

## Tại sao hầu hết các công ty khởi nghiệp email đều thất bại {#why-most-email-startups-fail}

> \[!IMPORTANT]
> **The Fundamental Pattern**: Email *client* startups typically fail because they try to replace working protocols, while email *infrastructure* companies can succeed by enhancing existing workflows. The key is understanding what users actually need versus what entrepreneurs think they need.

### 1. Giao thức email hoạt động, nhưng việc triển khai thường không hiệu quả {#1-email-protocols-work-implementation-often-doesnt}

> \[!NOTE]
> **Email Statistics**: [347.3 billion emails sent daily](https://www.statista.com/statistics/456500/daily-number-of-e-mails-worldwide/) without major issues, serving [4.37 billion email users worldwide](https://www.statista.com/statistics/255080/number-of-e-mail-users-worldwide/) as of 2023.

Các giao thức email cốt lõi rất vững chắc, nhưng chất lượng triển khai lại rất khác nhau:

* **Khả năng tương thích toàn cầu**: Mọi thiết bị, mọi nền tảng đều hỗ trợ [SMTP](https://tools.ietf.org/html/rfc5321), [IMAP](https://tools.ietf.org/html/rfc3501) và [POP3](https://tools.ietf.org/html/rfc1939)
* **Phi tập trung**: Không có điểm lỗi đơn lẻ nào trên [hàng tỷ máy chủ email trên toàn thế giới](https://www.statista.com/statistics/456500/daily-number-of-e-mails-worldwide/)
* **Chuẩn hóa**: SMTP, IMAP, POP3 là các giao thức đã được kiểm chứng thực tế từ những năm 1980-1990
* **Độ tin cậy**: [347,3 tỷ email được gửi đi mỗi ngày](https://www.statista.com/statistics/456500/daily-number-of-e-mails-worldwide/) mà không gặp bất kỳ sự cố nghiêm trọng nào

**Cơ hội thực sự**: Triển khai tốt hơn các giao thức hiện có, chứ không phải thay thế giao thức.

### 2. Hiệu ứng mạng không thể phá vỡ {#2-network-effects-are-unbreakable}

Hiệu ứng mạng lưới của email là tuyệt đối:

* **Mọi người đều có email**: [4,37 tỷ người dùng email trên toàn thế giới](https://www.statista.com/statistics/255080/number-of-e-mail-users-worldwide/) tính đến năm 2023
* **Đa nền tảng**: Hoạt động liền mạch giữa tất cả các nhà cung cấp
* **Quan trọng đối với doanh nghiệp**: [99% doanh nghiệp sử dụng email hàng ngày](https://blog.hubspot.com/marketing/email-marketing-stats) cho hoạt động
* **Chi phí chuyển đổi**: Thay đổi địa chỉ email làm gián đoạn mọi thứ được kết nối với nó

### 3. Họ thường nhắm vào những vấn đề sai {#3-they-often-target-the-wrong-problems}

Nhiều công ty khởi nghiệp về email tập trung vào các vấn đề nhận thức được hơn là những điểm khó khăn thực sự:

* **"Email quá phức tạp"**: Quy trình làm việc cơ bản rất đơn giản - [gửi, nhận, tổ chức từ năm 1971](https://en.wikipedia.org/wiki/History_of_email)
* **"Email cần AI"**: [Gmail đã có những tính năng thông minh hiệu quả](https://support.google.com/mail/answer/9116836) như Trả lời thông minh và Hộp thư ưu tiên
* **"Email cần bảo mật tốt hơn"**: [DKIM](https://tools.ietf.org/html/rfc6376), [SPF](https://tools.ietf.org/html/rfc7208) và [DMARC](https://tools.ietf.org/html/rfc7489) cung cấp khả năng xác thực mạnh mẽ
* **"Email cần một giao diện mới"**: [Triển vọng](https://outlook.com/) và [Gmail](https://gmail.com/) giao diện được tinh chỉnh qua nhiều thập kỷ nghiên cứu người dùng

**Các vấn đề thực sự đáng giải quyết**: Độ tin cậy của cơ sở hạ tầng, khả năng phân phối, lọc thư rác và các công cụ dành cho nhà phát triển.

### 4. Nợ kỹ thuật rất lớn {#4-technical-debt-is-massive}

Việc xây dựng cơ sở hạ tầng email thực sự đòi hỏi:

* **Máy chủ SMTP**: Phân phối phức tạp và [quản lý danh tiếng](https://postmarkapp.com/blog/monitoring-your-email-delivery-and-reputation)
* **Lọc thư rác**: [cảnh quan đe dọa](https://www.spamhaus.org/) liên tục phát triển
* **Hệ thống lưu trữ**: Triển khai [IMAP](https://tools.ietf.org/html/rfc3501)/[POP3](https://tools.ietf.org/html/rfc1939) đáng tin cậy
* **Xác thực**: Tuân thủ [DKIM](https://tools.ietf.org/html/rfc6376), [SPF](https://tools.ietf.org/html/rfc7208), [DMARC](https://tools.ietf.org/html/rfc7489), [ARC](https://tools.ietf.org/html/rfc8617)
* **Khả năng phân phối**: Mối quan hệ với ISP và [quản lý danh tiếng](https://sendgrid.com/blog/what-is-email-deliverability/)

### 5. Cơ sở hạ tầng đã tồn tại {#5-the-infrastructure-already-exists}

Tại sao phải tái tạo khi bạn có thể sử dụng:

* **[Amazon SES](https://aws.amazon.com/ses/)**: Cơ sở hạ tầng phân phối đã được chứng minh
* **[Hậu tố](http://www.postfix.org/)**: Máy chủ SMTP đã được kiểm nghiệm thực tế
* **[chuồng bồ câu](https://www.dovecot.org/)**: Máy chủ IMAP/POP3 đáng tin cậy
* **[SpamAssassin](https://spamassassin.apache.org/)**: Lọc thư rác hiệu quả
* **Các nhà cung cấp hiện tại**: [Gmail](https://gmail.com/), [Triển vọng](https://outlook.com/), [Thư nhanh](https://www.fastmail.com/) hoạt động tốt

## Nghiên cứu điển hình: Khi các công ty khởi nghiệp email thất bại {#case-studies-when-email-startups-fail}

### Nghiên cứu điển hình: Thảm họa Skiff {#case-study-the-skiff-disaster}

Skiff là ví dụ điển hình cho mọi sai lầm của các công ty khởi nghiệp về email.

#### Thiết lập {#the-setup}

* **Định vị**: "Nền tảng email và năng suất ưu tiên quyền riêng tư"
* **Tài trợ**: [Vốn đầu tư mạo hiểm đáng kể](https://techcrunch.com/2022/03/30/skiff-series-a-encrypted-workspaces/)
* **Cam kết**: Email tốt hơn nhờ quyền riêng tư và mã hóa

#### Việc mua lại {#the-acquisition}

[Notion đã mua lại Skiff vào tháng 2 năm 2024](https://techcrunch.com/2024/02/09/notion-acquires-privacy-focused-productivity-platform-skiff/) với những cam kết mua lại điển hình về tích hợp và phát triển liên tục.

#### Thực tế {#the-reality}

* **Tắt máy ngay lập tức**: [Skiff đóng cửa trong vòng vài tháng](https://en.wikipedia.org/wiki/Skiff_\(email_service\))
* **Người sáng lập rời đi**: [Những người sáng lập Skiff rời Notion và gia nhập Cursor](https://x.com/skeptrune/status/1939763513695903946)
* **Người dùng bỏ cuộc**: Hàng ngàn người dùng buộc phải di chuyển

### Phân tích Accelerator {#the-accelerator-analysis}

#### Y Combinator: Nhà máy ứng dụng email {#y-combinator-the-email-app-factory}

[Y-Combinator](https://www.ycombinator.com/) đã tài trợ cho hàng chục công ty khởi nghiệp về email. Dưới đây là mô hình:

* **[E-mail](https://www.ycdb.co/company/emailio)** (2014): Ứng dụng email di động → chuyển sang "chăm sóc sức khỏe"
* **[Thời gian gửi thư](https://www.ycdb.co/company/mailtime)** (2016): Email dạng trò chuyện → chuyển sang phân tích
* **[gửi lại](https://www.ycombinator.com/companies/remail)** (2009): Tìm kiếm email trên iPhone → [được Google mua lại](https://techcrunch.com/2010/02/17/google-remail-iphone/) → ngừng hoạt động
* **[Báo cáo](https://www.ycombinator.com/companies/rapportive)** (2012): Hồ sơ mạng xã hội Gmail → [được mua lại bởi LinkedIn](https://techcrunch.com/2012/02/22/rapportive-linkedin-acquisition/) → ngừng hoạt động

**Tỷ lệ thành công**: Kết quả hỗn hợp với một số lần thoát đáng chú ý. Một số công ty đã đạt được các vụ mua lại thành công (reMail sang Google, Rapportive sang LinkedIn), trong khi những công ty khác chuyển hướng khỏi email hoặc được mua lại để tuyển dụng nhân tài.

#### Techstars: Nghĩa địa email {#techstars-the-email-graveyard}

[Ngôi sao công nghệ](https://www.techstars.com/) thậm chí còn tệ hơn:

* **[Email Copilot](https://www.validity.com/everest/returnpath/)** (2012): Đã mua → tắt
* **[Trả lờiGửi](https://www.crunchbase.com/organization/replysend)** (2012): Thất bại hoàn toàn
* **[Đã đóng bìa](https://www.crunchbase.com/organization/nveloped)** (2012): "Email dễ dàng. Bảo mật" → thất bại
* **[lộn xộn](https://www.crunchbase.com/organization/jumble/technology)** (2015): Mã hóa email → thất bại
* **[Hộp thư đếnFever](https://www.crunchbase.com/organization/inboxfever)** (2011): API email → thất bại

**Mẫu**: Giá trị đề xuất mơ hồ, không có cải tiến kỹ thuật thực sự, thất bại nhanh chóng.

### Cái bẫy của nhà đầu tư mạo hiểm {#the-venture-capital-trap}

> \[!CAUTION]
> **VC Funding Paradox**: VCs love email startups because they sound simple but are actually impossible. The fundamental assumptions that attract investment are exactly what guarantee failure.

Các nhà đầu tư mạo hiểm thích các công ty khởi nghiệp về email vì chúng nghe có vẻ đơn giản nhưng thực tế lại không khả thi:

```mermaid
graph TD
    A[VC Email Startup Pitch] --> B[Sounds Simple]
    A --> C[Seems Obvious]
    A --> D[Technical Moat Claims]
    A --> E[Network Effect Dreams]

    B --> F[Everyone uses email!]
    C --> G[Email is old and broken!]
    D --> H[We'll build better infrastructure!]
    E --> I[Once we get users, we'll dominate!]

    F --> J[Reality: Email works fine]
    G --> K[Reality: Protocols are proven]
    H --> L[Reality: Infrastructure is hard]
    I --> M[Reality: Network effects unbreakable]
```

**Thực tế**: Không có giả định nào trong số này là đúng với email.

## Thực tế kỹ thuật: Các ngăn xếp email hiện đại {#the-technical-reality-modern-email-stacks}

### Điều gì thực sự thúc đẩy "Các công ty khởi nghiệp email" {#what-actually-powers-email-startups}

Hãy cùng xem những công ty này thực sự đang kinh doanh những gì:

```mermaid
graph LR
    A[Most Email Startups] --> B[React Native App]
    B --> C[Node.js API]
    C --> D[Amazon SES]
    D --> E[Existing Email Infrastructure]

    F[Forward Email] --> G[100% Custom Node.js JavaScript Stack]
    G --> H[Built From Scratch]
```

### Các vấn đề về hiệu suất {#the-performance-problems}

**Bộ nhớ phình to**: Hầu hết các ứng dụng email đều là ứng dụng web dựa trên Electron, tiêu tốn rất nhiều RAM:

* **[Thư mùa xuân](https://getmailspring.com/)**: [500MB+ cho email cơ bản](https://github.com/Foundry376/Mailspring/issues/1758)
* **Nylas Mail**: [Sử dụng bộ nhớ 1GB+](https://github.com/nylas/nylas-mail/issues/3501) trước khi tắt máy
* **[Hộp thư](https://www.postbox-inc.com/)**: [Bộ nhớ nhàn rỗi 300MB+](https://forums.macrumors.com/threads/postbox-why-does-it-take-up-so-much-ram.1411335/)
* **[Thư Canary](https://canarymail.io/)**: [Thường xuyên bị sập do vấn đề bộ nhớ](https://www.reddit.com/r/CanaryMail/comments/10pe7jf/canary_is_crashing_on_all_my_devices/)
* **[Chim Sấm Sét](https://www.thunderbird.net/)**: [Sử dụng RAM cao lên đến 90%](https://www.reddit.com/r/Thunderbird/comments/141s473/high_ram_usage_up_to\_90/) bộ nhớ hệ thống

> \[!WARNING]
> **Electron Performance Crisis**: Modern email clients built with Electron and React Native suffer from severe memory bloat and performance issues. These cross-platform frameworks, while convenient for developers, create resource-heavy applications that consume hundreds of megabytes to gigabytes of RAM for basic email functionality.

**Tiêu hao pin**: Đồng bộ hóa liên tục và mã không hiệu quả:

* Các tiến trình nền không bao giờ ngủ
* Các cuộc gọi API không cần thiết sau mỗi vài giây
* Quản lý kết nối kém
* Không có sự phụ thuộc của bên thứ ba ngoại trừ những phụ thuộc hoàn toàn cần thiết cho chức năng cốt lõi

## Các mô hình thu hút: Thành công so với Đóng cửa {#the-acquisition-patterns-success-vs-shutdown}

### Hai Mẫu {#the-two-patterns}

**Mẫu ứng dụng khách hàng (thường thất bại)**:

```mermaid
flowchart TD
    A[Email Client Launch] --> B[VC Funding]
    B --> C[User Growth]
    C --> D[Talent Acquisition]
    D --> E[Service Shutdown]

    A -.-> A1["Revolutionary interface"]
    B -.-> B1["$5-50M raised"]
    C -.-> C1["Acquire users, burn cash"]
    D -.-> D1["Acqui-hire for talent"]
    E -.-> E1["Service discontinued"]
```

**Mô hình cơ sở hạ tầng (thường thành công)**:

```mermaid
flowchart TD
    F[Infrastructure Launch] --> G[Revenue Growth]
    G --> H[Market Position]
    H --> I[Strategic Acquisition]
    I --> J[Continued Operation]

    F -.-> F1["SMTP/API services"]
    G -.-> G1["Profitable operations"]
    H -.-> H1["Market leadership"]
    I -.-> I1["Strategic integration"]
    J -.-> J1["Enhanced service"]
```

### Ví dụ gần đây {#recent-examples}

**Lỗi ứng dụng khách hàng**:

* **Hộp thư → Dropbox → Tắt** (2013-2015)
* **[Chim sẻ → Google → Tắt máy](https://www.theverge.com/2012/7/20/3172365/sources-google-sparrow-25-million-gmail-client)** (2012-2013)
* **[reMail → Google → Tắt máy](https://techcrunch.com/2010/02/17/google-remail-iphone/)** (2010-2011)
* **[Skiff → Notion → Tắt máy](https://techcrunch.com/2024/02/09/notion-acquires-privacy-focused-productivity-platform-skiff/)** (2024)

**Ngoại lệ đáng chú ý**:

* **[Siêu nhân → Grammarly](https://www.reuters.com/business/grammarly-acquires-email-startup-superhuman-ai-platform-push-2025-07-01/)** (2025): Việc mua lại thành công với sự tích hợp chiến lược vào nền tảng năng suất

**Thành công về cơ sở hạ tầng**:

* **[GửiGrid → Twilio](https://en.wikipedia.org/wiki/SendGrid)** (2019): Mua lại 3 tỷ đô la, tiếp tục tăng trưởng
* **[Mailgun → Sinch](https://sinch.com/news/sinch-acquires-mailgun-and-mailjet/)** (2021): Tích hợp chiến lược
* **[Dấu bưu điện → ActiveCampaign](https://postmarkapp.com/blog/postmark-and-dmarc-digests-acquired-by-activecampaign)** (2022): Nền tảng nâng cao

## Sự phát triển và hợp nhất của ngành {#industry-evolution-and-consolidation}

### Tiến trình Công nghiệp Tự nhiên {#natural-industry-progression}

Ngành công nghiệp email đã phát triển theo hướng hợp nhất, với các công ty lớn hơn mua lại các công ty nhỏ hơn để tích hợp các tính năng hoặc loại bỏ đối thủ cạnh tranh. Điều này không nhất thiết là tiêu cực - đó là cách phát triển của hầu hết các ngành công nghiệp trưởng thành.

### Chuyển đổi sau khi mua lại {#post-acquisition-transitions}

Khi các công ty email được mua lại, người dùng thường phải đối mặt với:

* **Di chuyển dịch vụ**: Di chuyển sang nền tảng mới
* **Thay đổi tính năng**: Mất chức năng chuyên biệt
* **Điều chỉnh giá**: Các mô hình đăng ký khác nhau
* **Thời gian tích hợp**: Gián đoạn dịch vụ tạm thời

### Những cân nhắc của người dùng trong quá trình chuyển đổi {#user-considerations-during-transitions}

Trong quá trình hợp nhất ngành, người dùng được hưởng lợi từ:

* **Đánh giá các giải pháp thay thế**: Nhiều nhà cung cấp cung cấp các dịch vụ tương tự
* **Hiểu các lộ trình di chuyển**: Hầu hết các dịch vụ đều cung cấp các công cụ xuất
* **Cân nhắc tính ổn định lâu dài**: Các nhà cung cấp đã thành lập thường cung cấp tính liên tục hơn

## Kiểm tra thực tế của Hacker News {#the-hacker-news-reality-check}

Mọi công ty khởi nghiệp email đều nhận được những bình luận giống nhau trên [Tin tức Hacker](https://news.ycombinator.com/):

* ["Email hoạt động tốt, điều này giải quyết được vấn đề không quan trọng"](https://news.ycombinator.com/item?id=35982757)
* ["Chỉ cần sử dụng Gmail/Outlook như mọi người khác"](https://news.ycombinator.com/item?id=36001234)
* ["Một ứng dụng email khác sẽ bị đóng cửa trong 2 năm nữa"](https://news.ycombinator.com/item?id=36012345)
* ["Vấn đề thực sự là thư rác và điều này không giải quyết được vấn đề đó"](https://news.ycombinator.com/item?id=36023456)

**Cộng đồng nói đúng**. Những bình luận này xuất hiện trên mọi email khởi động khởi nghiệp vì các vấn đề cơ bản luôn giống nhau.

## Trò gian lận email AI hiện đại {#the-modern-ai-email-grift}

### Làn sóng mới nhất {#the-latest-wave}

Năm 2024 chứng kiến làn sóng khởi nghiệp "email hỗ trợ AI" mới, với những thành công lớn đầu tiên đã diễn ra:

* **[Siêu nhân](https://superhuman.com/)**: [Đã huy động được 33 triệu đô la](https://superhuman.com/), [đã được Grammarly mua lại thành công](https://www.reuters.com/business/grammarly-acquires-email-startup-superhuman-ai-platform-push-2025-07-01/) (2025) - một ứng dụng khách hàng thành công hiếm hoi
* **[Sóng ngắn](https://www.shortwave.com/)**: Trình bao bọc Gmail với tóm tắt AI
* **[Hộp Sane](https://www.sanebox.com/)**: Lọc email bằng AI (thực sự hoạt động, nhưng không mang tính đột phá)

### Những vấn đề cũ rích {#the-same-old-problems}

Việc thêm "AI" không giải quyết được những thách thức cơ bản:

* **Tóm tắt AI**: Hầu hết các email đều đã ngắn gọn
* **Trả lời thông minh**: [Gmail đã có những thứ này trong nhiều năm](https://support.google.com/mail/answer/9116836) và chúng hoạt động tốt
* **Lên lịch email**: [Outlook thực hiện điều này một cách tự nhiên](https://support.microsoft.com/en-us/office/delay-or-schedule-sending-email-messages-026af69f-c287-490a-a72f-6c65793744ba)
* **Phát hiện ưu tiên**: Các ứng dụng email hiện có có hệ thống lọc hiệu quả

**Thách thức thực sự**: Các tính năng AI đòi hỏi đầu tư cơ sở hạ tầng đáng kể trong khi vẫn giải quyết được những điểm yếu tương đối nhỏ.

## Điều thực sự hiệu quả: Những câu chuyện thành công thực sự về email {#what-actually-works-the-real-email-success-stories}

### Các công ty cơ sở hạ tầng (Những người chiến thắng) {#infrastructure-companies-the-winners}

* **[Gửi Lưới](https://sendgrid.com/)**: [Twilio mua lại với giá 3 tỷ đô la](https://en.wikipedia.org/wiki/SendGrid)
* **[Súng thư](https://www.mailgun.com/)**: [Doanh thu trên 50 triệu đô la](https://sinch.com/news/sinch-acquires-mailgun-and-mailjet/), được Sinch mua lại
* **[Dấu bưu điện](https://postmarkapp.com/)**: Có lãi, [được mua lại bởi ActiveCampaign](https://postmarkapp.com/blog/postmark-and-dmarc-digests-acquired-by-activecampaign)
* **[Amazon SES](https://aws.amazon.com/ses/)**: Doanh thu hàng tỷ đô la

**Mẫu**: Họ xây dựng cơ sở hạ tầng chứ không phải ứng dụng.

### Nhà cung cấp email (Những người sống sót) {#email-providers-the-survivors}

* **[Thư nhanh](https://www.fastmail.com/)**: [25+ năm](https://www.fastmail.com/about/), có lợi nhuận, độc lập
* **[Thư Proton](https://proton.me/)**: Tập trung vào quyền riêng tư, tăng trưởng bền vững
* **[Thư Zoho](https://www.zoho.com/mail/)**: Một phần của bộ doanh nghiệp lớn hơn
* **Chúng tôi**: Hơn 7 năm, có lợi nhuận, đang phát triển

> \[!WARNING]
> **The JMAP Investment Question**: While Fastmail invests resources in [JMAP](https://jmap.io/), a protocol that's [10+ years old with limited adoption](https://github.com/zone-eu/wildduck/issues/2#issuecomment-1765190790), they simultaneously [refuse to implement PGP encryption](https://www.fastmail.com/blog/why-we-dont-offer-pgp/) that many users request. This represents a strategic choice to prioritize protocol innovation over user-requested features. Whether JMAP will gain broader adoption remains to be seen, but the current email client ecosystem continues to rely primarily on IMAP/SMTP.

> \[!TIP]
> **Enterprise Success**: Forward Email powers [alumni email solutions for top universities](https://forwardemail.net/en/blog/docs/alumni-email-forwarding-university-case-study), including the University of Cambridge with 30,000 alumni addresses, delivering $87,000 in annual cost savings compared to traditional solutions.

**Mẫu**: Chúng cải thiện email chứ không thay thế nó.

### Ngoại lệ: Câu chuyện thành công của Xobni {#the-exception-xobnis-success-story}

[Hobney](https://en.wikipedia.org/wiki/Xobni) nổi bật là một trong số ít công ty khởi nghiệp liên quan đến email thực sự thành công nhờ áp dụng đúng phương pháp.

**Những điều Xobni đã làm đúng**:

* **Cải thiện email hiện có**: Được xây dựng trên Outlook thay vì thay thế nó
* **Giải quyết các vấn đề thực tế**: Quản lý danh bạ và tìm kiếm email
* **Tập trung vào tích hợp**: Làm việc với các quy trình công việc hiện có
* **Tập trung vào doanh nghiệp**: Nhắm mục tiêu đến người dùng doanh nghiệp có điểm khó khăn thực sự

**Thành công**: [Xobni đã được Yahoo mua lại với giá 60 triệu đô la vào năm 2013](https://en.wikipedia.org/wiki/Xobni), mang lại lợi nhuận vững chắc cho các nhà đầu tư và là lối thoát thành công cho những người sáng lập.

#### Tại sao Xobni thành công trong khi những người khác thất bại {#why-xobni-succeeded-where-others-failed}

1. **Được xây dựng trên cơ sở hạ tầng đã được chứng minh**: Sử dụng cách xử lý email hiện có của Outlook
2. **Giải quyết các vấn đề thực tế**: Quản lý danh bạ thực sự bị hỏng
3. **Thị trường doanh nghiệp**: Các doanh nghiệp trả tiền cho các công cụ năng suất
4. **Phương pháp tiếp cận tích hợp**: Cải thiện thay vì thay thế các quy trình làm việc hiện có

#### Thành công liên tục của những người sáng lập {#the-founders-continued-success}

[Matt Brezina](https://www.linkedin.com/in/mattbrezina/) và [Adam Smith](https://www.linkedin.com/in/adamjsmith/) không dừng lại sau Xobni:

* **Matt Brezina**: Trở thành một [nhà đầu tư thiên thần](https://mercury.com/investor-database/matt-brezina) năng động với các khoản đầu tư vào Dropbox, Mailbox và các công ty khác
* **Adam Smith**: Tiếp tục xây dựng các công ty thành công trong lĩnh vực năng suất
* **Cả hai nhà sáng lập**: Chứng minh rằng thành công của email đến từ việc cải tiến, chứ không phải thay thế

### Mẫu {#the-pattern}

Các công ty thành công trong việc sử dụng email khi họ:

1. **Xây dựng cơ sở hạ tầng** ([Gửi Lưới](https://sendgrid.com/), [Súng thư](https://www.mailgun.com/))
2. **Cải thiện quy trình làm việc hiện có** ([Hobney](https://en.wikipedia.org/wiki/Xobni), [Thư nhanh](https://www.fastmail.com/))
3. **Tập trung vào độ tin cậy** ([Amazon SES](https://aws.amazon.com/ses/), [Dấu bưu điện](https://postmarkapp.com/))
4. **Phục vụ nhà phát triển** (API và công cụ, không phải ứng dụng người dùng cuối)

## Đã có ai thành công trong việc tái tạo email chưa? {#has-anyone-successfully-reinvented-email}

Đây là một câu hỏi quan trọng đi thẳng vào trọng tâm của sự đổi mới email. Câu trả lời ngắn gọn là: **chưa ai thay thế email thành công, nhưng một số đã cải tiến nó thành công**.

### Những gì thực sự bị kẹt {#what-actually-stuck}

Nhìn lại những đổi mới về email trong 20 năm qua:

* **[Luồng của Gmail](https://support.google.com/mail/answer/5900)**: Cải thiện khả năng tổ chức email
* **[Tích hợp lịch của Outlook](https://support.microsoft.com/en-us/office/calendar-in-outlook-73b69a86-0a8e-4b14-9cb7-d2723397c9c5)**: Cải thiện khả năng lên lịch
* **Ứng dụng email di động**: Cải thiện khả năng truy cập
* **[DKIM](https://tools.ietf.org/html/rfc6376)/[SPF](https://tools.ietf.org/html/rfc7208)/[DMARC](https://tools.ietf.org/html/rfc7489)**: Tăng cường bảo mật

**Mẫu**: Tất cả các cải tiến thành công đều **cải thiện** các giao thức email hiện có thay vì thay thế chúng.

### Các công cụ mới bổ sung cho email (nhưng không thay thế nó) {#new-tools-complement-email-but-dont-replace-it}

* **[Chùng xuống](https://slack.com/)**: Tuyệt vời cho trò chuyện nhóm, nhưng vẫn gửi thông báo qua email
* **[Bất hòa](https://discord.com/)**: Tuyệt vời cho cộng đồng, nhưng sử dụng email để quản lý tài khoản
* **[WhatsApp](https://www.whatsapp.com/)**: Hoàn hảo cho nhắn tin, nhưng doanh nghiệp vẫn sử dụng email
* **[Phóng](https://zoom.us/)**: Thiết yếu cho các cuộc gọi video, nhưng lời mời họp sẽ được gửi qua email

### Thí nghiệm HEY {#the-hey-experiment}

> \[!IMPORTANT]
> **Real-World Validation**: HEY's founder [DHH](https://dhh.dk/) actually uses our service at Forward Email for his personal domain `dhh.dk` and has for several years, demonstrating that even email innovators rely on proven infrastructure.

[HEY](https://hey.com/) của [Trại căn cứ](https://basecamp.com/) đại diện cho nỗ lực gần đây nhất nhằm "tái tạo" email:

* **Đã ra mắt**: [2020 với sự phô trương đáng kể](https://world.hey.com/jason/hey-is-live-and-you-can-get-it-now-3aca3d9a)
* **Cách tiếp cận**: Mô hình email hoàn toàn mới với tính năng sàng lọc, đóng gói và quy trình làm việc
* **Phản hồi**: Có ý kiến trái chiều - một số người thích, hầu hết vẫn giữ nguyên email hiện tại
* **Thực tế**: Vẫn là email (SMTP/IMAP) nhưng giao diện khác

### Điều thực sự hiệu quả {#what-actually-works}

Những cải tiến thành công nhất về email là:

1. **Cơ sở hạ tầng tốt hơn**: Máy chủ nhanh hơn, lọc thư rác tốt hơn, khả năng phân phối được cải thiện
2. **Giao diện được cải tiến**: [Chế độ xem cuộc trò chuyện của Gmail](https://support.google.com/mail/answer/5900), [Tích hợp lịch của Outlook](https://support.microsoft.com/en-us/office/calendar-in-outlook-73b69a86-0a8e-4b14-9cb7-d2723397c9c5)
3. **Công cụ dành cho nhà phát triển**: API để gửi email, webhooks để theo dõi
4. **Quy trình làm việc chuyên biệt**: Tích hợp CRM, tự động hóa tiếp thị, email giao dịch

**Không có cái nào trong số này thay thế được email - chúng chỉ làm cho nó tốt hơn.**

## Xây dựng cơ sở hạ tầng hiện đại cho các giao thức email hiện có: Cách tiếp cận của chúng tôi {#building-modern-infrastructure-for-existing-email-protocols-our-approach}

Trước khi đi sâu vào các lỗi, điều quan trọng là phải hiểu những gì thực sự hiệu quả trong email. Thách thức không phải là email bị hỏng - mà là hầu hết các công ty cố gắng "sửa" thứ gì đó vốn đã hoạt động hoàn hảo.

### Phổ đổi mới email {#the-email-innovation-spectrum}

Đổi mới email được chia thành ba loại:

```mermaid
graph TD
    A[Email Innovation Spectrum] --> B[Infrastructure Enhancement]
    A --> C[Workflow Integration]
    A --> D[Protocol Replacement]

    B --> E[What works: Better servers, delivery systems, developer tools]
    C --> F[Sometimes works: Adding email to existing business processes]
    D --> G[Always fails: Trying to replace SMTP, IMAP, or POP3]
```

### Tại sao chúng tôi tập trung vào cơ sở hạ tầng {#why-we-focus-on-infrastructure}

Chúng tôi quyết định xây dựng cơ sở hạ tầng email hiện đại vì:

* **Giao thức email đã được chứng minh**: [SMTP đã hoạt động đáng tin cậy kể từ năm 1982](https://tools.ietf.org/html/rfc821)
* **Vấn đề nằm ở khâu triển khai**: Hầu hết các dịch vụ email đều sử dụng các ngăn xếp phần mềm lỗi thời
* **Người dùng muốn độ tin cậy**: Không phải các tính năng mới làm gián đoạn quy trình làm việc hiện tại
* **Nhà phát triển cần công cụ**: API và giao diện quản lý tốt hơn

### Những gì thực sự hiệu quả trong Email {#what-actually-works-in-email}

Mô hình thành công rất đơn giản: **cải thiện quy trình làm việc email hiện có thay vì thay thế chúng**. Điều này có nghĩa là:

* Xây dựng máy chủ SMTP nhanh hơn, đáng tin cậy hơn
* Tạo bộ lọc thư rác tốt hơn mà không làm hỏng email hợp lệ
* Cung cấp API thân thiện với nhà phát triển cho các giao thức hiện có
* Cải thiện khả năng phân phối thông qua cơ sở hạ tầng phù hợp

## Cách tiếp cận của chúng tôi: Tại sao chúng tôi khác biệt {#our-approach-why-were-different}

### Chúng tôi làm gì {#what-we-do}

* **Xây dựng cơ sở hạ tầng thực tế**: Máy chủ SMTP/IMAP tùy chỉnh từ đầu
* **Tập trung vào độ tin cậy**: [Thời gian hoạt động 99,99%](https://status.forwardemail.net), xử lý lỗi phù hợp
* **Cải thiện quy trình làm việc hiện có**: Làm việc với tất cả các ứng dụng email
* **Phục vụ nhà phát triển**: API và công cụ thực sự hoạt động
* **Duy trì khả năng tương thích**: Tuân thủ đầy đủ [SMTP](https://tools.ietf.org/html/rfc5321)/[IMAP](https://tools.ietf.org/html/rfc3501)/[POP3](https://tools.ietf.org/html/rfc1939)

### Những gì chúng tôi không làm {#what-we-dont-do}

* Xây dựng các ứng dụng email "mang tính cách mạng"
* Cố gắng thay thế các giao thức email hiện có
* Thêm các tính năng AI không cần thiết
* Hứa sẽ "sửa" email

## Cách chúng tôi xây dựng cơ sở hạ tầng email thực sự hiệu quả {#how-we-build-email-infrastructure-that-actually-works}

### Cách tiếp cận chống khởi nghiệp của chúng tôi {#our-anti-startup-approach}

Trong khi các công ty khác tiêu tốn hàng triệu đô la để cố gắng cải tiến email, chúng tôi tập trung vào việc xây dựng cơ sở hạ tầng đáng tin cậy:

* **Không có trục xoay**: Chúng tôi đã xây dựng cơ sở hạ tầng email trong hơn 7 năm
* **Không có chiến lược mua lại**: Chúng tôi đang xây dựng cho mục đích dài hạn
* **Không có tuyên bố "mang tính cách mạng"**: Chúng tôi chỉ làm cho email hoạt động tốt hơn

### Điều gì làm chúng ta khác biệt {#what-makes-us-different}

> \[!TIP]
> **Government-Grade Compliance**: Forward Email is [Section 889 compliant](https://forwardemail.net/en/blog/docs/federal-government-email-service-section-889-compliant) and serves organizations like the US Naval Academy, demonstrating our commitment to meeting stringent federal security requirements.

> \[!NOTE]
> **OpenPGP and OpenWKD Implementation**: Unlike Fastmail, which [refuses to implement PGP](https://www.fastmail.com/blog/why-we-dont-offer-pgp/) citing complexity concerns, Forward Email provides full OpenPGP support with OpenWKD (Web Key Directory) compliance, giving users the encryption they actually want without forcing them to use experimental protocols like JMAP.

**So sánh kỹ thuật**:

```mermaid
graph TD
    A[Proton Mail Stack] --> B[Postfix SMTP Server]
    A --> C[Custom Encryption Layer]
    A --> D[Web Interface]

    E[Forward Email Stack] --> F[100% Custom Node.js]
    E --> G[JavaScript Throughout]
    E --> H[Built From Scratch]

    B --> I[1980s C code]
    C --> J[Glue code required]
    D --> K[Integration complexity]

    F --> L[Modern language]
    G --> M[No glue code needed]
    H --> N[Web-native design]
```

* \= [Bài đăng trên blog APNIC](https://blog.apnic.net/2024/10/04/smtp-downgrade-attacks-and-mta-sts/#:\~:text=Logs%20indicate%20that%20Proton%20Mail%20uses%C2%A0postfix%2Dmta%2Dsts%2Dresolver%2C%20hinting%20that%20they%20run%20a%20Postfix%20stack) xác nhận Proton sử dụng postfix-mta-sts-resolver, cho biết họ chạy ngăn xếp Postfix

**Sự khác biệt chính**:

* **Ngôn ngữ hiện đại**: JavaScript trên toàn bộ ngăn xếp so với mã C những năm 1980
* **Không có mã cố định**: Ngôn ngữ đơn giúp loại bỏ sự phức tạp của tích hợp
* **Web-native**: Được xây dựng cho phát triển web hiện đại ngay từ đầu
* **Có thể bảo trì**: Bất kỳ nhà phát triển web nào cũng có thể hiểu và đóng góp
* **Không có nợ cũ**: Cơ sở mã sạch, hiện đại mà không cần nhiều thập kỷ vá lỗi

> \[!NOTE]
> **Privacy by Design**: Our [privacy policy](https://forwardemail.net/en/privacy) ensures we don't store forwarded emails to disk storage or databases, don't store metadata about emails, and don't store logs or IP addresses - operating in-memory only for email forwarding services.

**Tài liệu kỹ thuật**: Để biết thông tin chi tiết về phương pháp, kiến trúc và triển khai bảo mật của chúng tôi, hãy xem [sách trắng kỹ thuật](https://forwardemail.net/technical-whitepaper.pdf) và tài liệu kỹ thuật mở rộng của chúng tôi.

### So sánh Nhà cung cấp Dịch vụ Email: Tăng trưởng thông qua các Giao thức đã được Chứng minh {#email-service-provider-comparison-growth-through-proven-protocols}

> \[!NOTE]
> **Real Growth Numbers**: While other providers chase experimental protocols, Forward Email focuses on what users actually want - reliable IMAP, POP3, SMTP, CalDAV, and CardDAV that works across all devices. Our growth demonstrates the value of this approach.

| Nhà cung cấp | Tên miền (2024 qua [SecurityTrails](https://securitytrails.com/)) | Tên miền (2025 qua [ViewDNS](https://viewdns.info/reversemx/)) | Phần trăm thay đổi | Bản ghi MX |
| ------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------- | ------------------------------ |
| **Chuyển tiếp Email** | 418,477 | 506,653 | **+21.1%** | `mx1.forwardemail.net` |
| **Thư Proton** | 253,977 | 334,909 | **+31.9%** | `mail.protonmail.ch` |
| **Fastmail** | 168,433 | 192,075 | **+14%** | `in1-smtp.messagingengine.com` |
| **Hộp thư** | 38,659 | 43,337 | **+12.1%** | `mxext1.mailbox.org` |
| **Tổng cộng** | 18,781 | 21,720 | **+15.6%** | `mail.tutanota.de` |
| **Skiff (đã ngừng hoạt động)** | 7,504 | 3,361 | **-55.2%** | `inbound-smtp.skiff.com` |

**Những hiểu biết chính**:

* **Forward Email** cho thấy sự tăng trưởng mạnh mẽ (+21,1%) với hơn 500.000 tên miền sử dụng bản ghi MX của chúng tôi
* **Cơ sở hạ tầng đã được chứng minh là thành công**: Các dịch vụ với IMAP/SMTP đáng tin cậy cho thấy sự chấp nhận tên miền ổn định
* **JMAP không còn phù hợp**: Khoản đầu tư vào JMAP của Fastmail cho thấy sự tăng trưởng chậm hơn (+14%) so với các nhà cung cấp tập trung vào giao thức chuẩn
* **Skiff sụp đổ**: Công ty khởi nghiệp đã phá sản này mất 55,2% tên miền, cho thấy sự thất bại của các phương pháp tiếp cận email "mang tính cách mạng"
* **Xác minh thị trường**: Sự tăng trưởng số lượng tên miền phản ánh sự chấp nhận của người dùng thực tế, chứ không phải các chỉ số tiếp thị

### Dòng thời gian kỹ thuật {#the-technical-timeline}

Dựa trên [dòng thời gian chính thức của công ty](https://forwardemail.net/en/about) của chúng tôi, đây là cách chúng tôi xây dựng cơ sở hạ tầng email thực sự hiệu quả:

```mermaid
timeline
    title Forward Email Development Timeline
    2017 : October 2nd - Domain purchased : November 5th - 634-line JavaScript file created : November - Official launch with DNS-based forwarding
    2018 : April - Switched to Cloudflare DNS for privacy : October - Gmail and Outlook "Send Mail As" integration
    2019 : May - v2 release with performance improvements using Node.js streams
    2020 : February - Enhanced Privacy Protection plan : April - Spam Scanner alpha release and 2FA : May - Custom port forwarding and RESTful API : August - ARC email authentication support : November 23rd - Public launch out of beta
    2021 : February - 100% JavaScript/Node.js stack (removed Python) : September 27th - Regular expression alias support
    2023 : January - Redesigned website : February - Error logs and dark mode : March - Tangerine integration and DNS over HTTPS : April - New infrastructure with bare metal servers : May - Outbound SMTP feature launch : November - Encrypted mailbox storage with IMAP support : December - POP3, passkeys, WebAuthn, and OpenPGP support
    2024 : February - CalDAV support : March-July - IMAP/POP3/CalDAV optimizations : July - iOS Push support and TTI monitoring : August - EML/Mbox export and webhook signatures : September-January 2025 - Vacation responder and OpenPGP/WKD encryption
```

### Tại sao chúng ta thành công trong khi người khác thất bại {#why-we-succeed-where-others-fail}

1. **Chúng tôi xây dựng cơ sở hạ tầng, không phải ứng dụng**: Tập trung vào máy chủ và giao thức
2. **Chúng tôi cải tiến, không thay thế**: Làm việc với các ứng dụng email hiện có
3. **Chúng tôi có lợi nhuận**: Không áp lực VC phải "phát triển nhanh và đột phá"
4. **Chúng tôi hiểu rõ về email**: Hơn 7 năm kinh nghiệm kỹ thuật chuyên sâu
5. **Chúng tôi phục vụ các nhà phát triển**: API và công cụ thực sự giải quyết vấn đề

### Kiểm tra thực tế chi phí {#the-cost-reality-check}

```mermaid
graph TD
    A[Typical Email Startup] --> B[$500K-2M per month burn]
    A --> C[20-50 employees]
    A --> D[Expensive office space]
    A --> E[Marketing costs]

    F[Forward Email] --> G[Profitable from day one]
    F --> H[Small focused team]
    F --> I[Remote-first, low overhead]
    F --> J[Organic growth]
```

## Thách thức bảo mật trong cơ sở hạ tầng email {#security-challenges-in-email-infrastructure}

> \[!IMPORTANT]
> **Quantum-Safe Email Security**: Forward Email is the [world's first and only email service to use quantum-resistant and individually encrypted SQLite mailboxes](https://forwardemail.net/en/blog/docs/best-quantum-safe-encrypted-email-service), providing unprecedented security against future quantum computing threats.

Bảo mật email là một thách thức phức tạp ảnh hưởng đến tất cả các nhà cung cấp trong ngành. Thay vì nêu bật các sự cố riêng lẻ, việc hiểu các cân nhắc chung về bảo mật mà tất cả các nhà cung cấp cơ sở hạ tầng email phải giải quyết sẽ có giá trị hơn.

### Những cân nhắc chung về bảo mật {#common-security-considerations}

Tất cả các nhà cung cấp email đều phải đối mặt với những thách thức bảo mật tương tự:

* **Bảo vệ dữ liệu**: Bảo mật dữ liệu và thông tin liên lạc của người dùng
* **Kiểm soát truy cập**: Quản lý xác thực và ủy quyền
* **Bảo mật cơ sở hạ tầng**: Bảo vệ máy chủ và cơ sở dữ liệu
* **Tuân thủ**: Đáp ứng các yêu cầu quy định khác nhau như [GDPR](https://gdpr.eu/) và [CCPA](https://oag.ca.gov/privacy/ccpa)

> \[!NOTE]
> **Advanced Encryption**: Our [security practices](https://forwardemail.net/en/security) include ChaCha20-Poly1305 encryption for mailboxes, full disk encryption with LUKS v2, and comprehensive protection with encryption-at-rest, encryption-in-memory, and encryption-in-transit.

### Giá trị của sự minh bạch {#the-value-of-transparency}

Khi sự cố bảo mật xảy ra, phản ứng có giá trị nhất là sự minh bạch và hành động nhanh chóng. Các công ty:

* **Kịp thời tiết lộ sự cố**: Giúp người dùng đưa ra quyết định sáng suốt
* **Cung cấp mốc thời gian chi tiết**: Cho thấy họ hiểu rõ phạm vi của sự cố
* **Triển khai bản sửa lỗi nhanh chóng**: Thể hiện năng lực kỹ thuật
* **Chia sẻ bài học kinh nghiệm**: Đóng góp vào các cải tiến bảo mật toàn ngành

Những phản hồi này có lợi cho toàn bộ hệ sinh thái email bằng cách thúc đẩy các biện pháp thực hành tốt nhất và khuyến khích các nhà cung cấp khác duy trì các tiêu chuẩn bảo mật cao.

### Những thách thức bảo mật đang diễn ra {#ongoing-security-challenges}

Ngành công nghiệp email tiếp tục phát triển các biện pháp bảo mật của mình:

* **Tiêu chuẩn mã hóa**: Triển khai các phương pháp mã hóa tốt hơn như [TLS 1.3](https://tools.ietf.org/html/rfc8446)
* **Giao thức xác thực**: Cải thiện [DKIM](https://tools.ietf.org/html/rfc6376), [SPF](https://tools.ietf.org/html/rfc7208) và [DMARC](https://tools.ietf.org/html/rfc7489)
* **Phát hiện mối đe dọa**: Phát triển các bộ lọc thư rác và lừa đảo tốt hơn
* **Củng cố cơ sở hạ tầng**: Bảo mật máy chủ và cơ sở dữ liệu
* **Quản lý danh tiếng tên miền**: Xử lý [thư rác chưa từng có từ tên miền onmicrosoft.com của Microsoft](https://www.reddit.com/r/msp/comments/16n8p0j/spam_increase_from_onmicrosoftcom_addresses/) yêu cầu [quy tắc chặn tùy ý](https://answers.microsoft.com/en-us/msoffice/forum/all/overwhelmed-by-onmicrosoftcom-spam-emails/6dcbd5c4-b661-47f5-95bc-1f3b412f398c) và [thảo luận MSP bổ sung](https://www.reddit.com/r/msp/comments/16n8p0j/comment/k1ns3ow/)

Những thách thức này đòi hỏi sự đầu tư liên tục và chuyên môn từ tất cả các nhà cung cấp trong lĩnh vực này.

## Kết luận: Tập trung vào cơ sở hạ tầng, không phải ứng dụng {#conclusion-focus-on-infrastructure-not-apps}

### Bằng chứng rõ ràng {#the-evidence-is-clear}

Sau khi phân tích hàng trăm công ty khởi nghiệp về email:

* **[Tỷ lệ thất bại 80%+](https://www.techstars.com/portfolio)**: Hầu hết các công ty khởi nghiệp email đều thất bại hoàn toàn (con số này có thể CAO HƠN 80% rất nhiều; chúng tôi đang nói một cách tử tế)
* **Ứng dụng khách hàng thường thất bại**: Bị mua lại thường đồng nghĩa với việc các ứng dụng khách hàng email bị phá sản
* **Cơ sở hạ tầng có thể thành công**: Các công ty xây dựng dịch vụ SMTP/API thường phát triển mạnh
* **Vốn đầu tư mạo hiểm tạo ra áp lực**: Vốn đầu tư mạo hiểm tạo ra kỳ vọng tăng trưởng không thực tế
* **Nợ kỹ thuật tích tụ**: Xây dựng cơ sở hạ tầng email khó hơn bạn nghĩ

### Bối cảnh lịch sử {#the-historical-context}

Theo các công ty khởi nghiệp, email đã "chết" trong hơn 20 năm:

* **2004**: "Mạng xã hội sẽ thay thế email"
* **2008**: "Nhắn tin di động sẽ giết chết email"
* **2012**: "[Chùng xuống](https://slack.com/) sẽ thay thế email"
* **2016**: "AI sẽ cách mạng hóa email"
* **2020**: "Làm việc từ xa cần những công cụ giao tiếp mới"
* **2024**: "AI cuối cùng sẽ khắc phục được email"

**Email vẫn còn đó**. Nó vẫn đang phát triển. Nó vẫn thiết yếu.

### Bài học thực sự {#the-real-lesson}

Bài học ở đây không phải là email không thể được cải thiện. Mà là về việc lựa chọn cách tiếp cận đúng đắn:

1. **Giao thức email hoạt động**: [SMTP](https://tools.ietf.org/html/rfc5321), [IMAP](https://tools.ietf.org/html/rfc3501), [POP3](https://tools.ietf.org/html/rfc1939) đã được kiểm chứng thực tế
2. **Cơ sở hạ tầng quan trọng**: Độ tin cậy và hiệu suất vượt trội hơn các tính năng hào nhoáng
3. **Cải tiến vượt trội hơn thay thế**: Làm việc với email, đừng chống lại nó
4. **Tính bền vững vượt trội hơn tăng trưởng**: Doanh nghiệp có lợi nhuận tồn tại lâu hơn doanh nghiệp được VC tài trợ
5. **Phục vụ nhà phát triển**: Công cụ và API tạo ra nhiều giá trị hơn ứng dụng người dùng cuối

**Cơ hội**: Triển khai tốt hơn các giao thức đã được chứng minh, chứ không phải thay thế giao thức.

> \[!TIP]
> **Comprehensive Email Service Analysis**: For an in-depth comparison of 79 email services in 2025, including detailed reviews, screenshots, and technical analysis, see our comprehensive guide: [79 Best Email Services](https://forwardemail.net/en/blog/best-email-service). This analysis demonstrates why Forward Email consistently ranks as the recommended choice for reliability, security, and standards compliance.

> \[!NOTE]
> **Real-World Validation**: Our approach works for organizations ranging from [government agencies requiring Section 889 compliance](https://forwardemail.net/en/blog/docs/federal-government-email-service-section-889-compliant) to [major universities managing tens of thousands of alumni addresses](https://forwardemail.net/en/blog/docs/alumni-email-forwarding-university-case-study), proving that building reliable infrastructure is the path to email success.

Nếu bạn đang nghĩ đến việc xây dựng một công ty khởi nghiệp về email, hãy cân nhắc xây dựng cơ sở hạ tầng email. Thế giới cần các máy chủ email tốt hơn, chứ không phải nhiều ứng dụng email hơn.

## Nghĩa địa email mở rộng: Thêm nhiều lỗi và sự cố ngừng hoạt động {#the-extended-email-graveyard-more-failures-and-shutdowns}

### Các thí nghiệm email của Google đã sai {#googles-email-experiments-gone-wrong}

Google, mặc dù sở hữu [Gmail](https://gmail.com/), đã hủy bỏ nhiều dự án email:

* **[Sóng Google](https://en.wikipedia.org/wiki/Apache_Wave)** (2009-2012): "Sát thủ email" mà chẳng ai hiểu nổi
* **[Google Buzz](https://en.wikipedia.org/wiki/Google_Buzz)** (2010-2011): Thảm họa tích hợp email mạng xã hội
* **[Hộp thư đến của Gmail](https://killedbygoogle.com/)** (2014-2019): Người kế nhiệm "thông minh" của Gmail, bị bỏ rơi
* **[Google+](https://killedbygoogle.com/)** tính năng email (2011-2019): Tích hợp email mạng xã hội

**Mẫu**: Ngay cả Google cũng không thể tái tạo thành công email.

### Sự cố hàng loạt: Ba cái chết của Newton Mail {#the-serial-failure-newton-mails-three-deaths}

[Thư Newton](https://en.wikipedia.org/wiki/CloudMagic) đã chết **ba lần**:

1. **[Đám mâyMagic](https://en.wikipedia.org/wiki/CloudMagic)** (2013-2016): Ứng dụng email được Newton mua lại
2. **Newton Mail** (2016-2018): Đổi thương hiệu, mô hình đăng ký thất bại
3. **[Sự hồi sinh của Newton Mail](https://9to5mac.com/2019/02/05/newton-mail-returns-ios-download/)** (2019-2020): Cố gắng quay trở lại, lại thất bại

**Bài học**: Các ứng dụng email không thể duy trì mô hình đăng ký.

### Các ứng dụng chưa bao giờ ra mắt {#the-apps-that-never-launched}

Nhiều công ty khởi nghiệp về email đã thất bại trước khi ra mắt:

* **Tempo** (2014): Tích hợp lịch-email, ngừng hoạt động trước khi ra mắt
* **[Luồng thư](https://mailstrom.co/)** (2011): Công cụ quản lý email, được mua trước khi phát hành
* **Fluent** (2013): Ứng dụng email, ngừng phát triển

### Mô hình Thu thập-Tắt máy {#the-acquisition-to-shutdown-pattern}

* **[Chim sẻ → Google → Tắt máy](https://www.theverge.com/2012/7/20/3172365/sources-google-sparrow-25-million-gmail-client)** (2012-2013)
* **[reMail → Google → Tắt máy](https://techcrunch.com/2010/02/17/google-remail-iphone/)** (2010-2011)
* **Mailbox → Dropbox → Tắt** (2013-2015)
* **[Accompli → Microsoft → Tắt máy](https://en.wikipedia.org/wiki/Microsoft_Outlook#Mobile_versions)** (trở thành Outlook Mobile)
* **[Acompli → Microsoft → Tích hợp](https://en.wikipedia.org/wiki/Microsoft_Outlook#Mobile_versions)** (hiếm khi thành công)

### Hợp nhất cơ sở hạ tầng email {#email-infrastructure-consolidation}

* **[Hộp thư → eM Client](https://www.postbox-inc.com/)** (2024): Hộp thư bưu điện bị tắt ngay lập tức sau khi mua lại
* **Nhiều lần mua lại**: [Ngẫu hứng](https://improvmx.com/) đã được mua lại nhiều lần, với [mối quan tâm về quyền riêng tư được nêu ra](https://discuss.privacyguides.net/t/forward-email-new-features/24845/55) và [thông báo mua lại](https://improvmx.com/blog/improvmx-has-been-acquired) và [danh sách doanh nghiệp](https://quietlight.com/listings/15877422)
* **Dịch vụ xuống cấp**: Nhiều dịch vụ trở nên kém hơn sau khi mua lại

## Nghĩa địa email nguồn mở: Khi "Miễn phí" không còn bền vững {#the-open-source-email-graveyard-when-free-isnt-sustainable}

### Nylas Mail → Mailspring: Cái nĩa không thể {#nylas-mail--mailspring-the-fork-that-couldnt}

* **[Thư Nylas](https://github.com/nylas/nylas-mail)**: Ứng dụng email nguồn mở, [ngừng sản xuất năm 2017](https://github.com/nylas/nylas-mail) và có [vấn đề sử dụng bộ nhớ lớn](https://github.com/nylas/nylas-mail/issues/3501)
* **[Thư mùa xuân](https://getmailspring.com/)**: Phân nhánh cộng đồng, gặp khó khăn trong việc bảo trì và [vấn đề sử dụng RAM cao](https://github.com/Foundry376/Mailspring/issues/1758)
* **Thực tế**: Ứng dụng email nguồn mở không thể cạnh tranh với các ứng dụng gốc

### Eudora: Hành trình tử thần kéo dài 18 năm {#eudora-the-18-year-death-march}

* **1988-2006**: Ứng dụng email phổ biến trên Mac/Windows
* **2006**: [Qualcomm đã dừng phát triển](https://en.wikipedia.org/wiki/Eudora_\(email_client\))
* **2007**: Mã nguồn mở với tên gọi "Eudora OSE"
* **2010**: Dự án bị bỏ dở
* **Bài học**: Ngay cả những ứng dụng email thành công cuối cùng cũng chết

### FairEmail: Bị Google Play Politics tiêu diệt {#fairemail-killed-by-google-play-politics}

* **[FairEmail](https://email.faircode.eu/)**: Ứng dụng email Android tập trung vào quyền riêng tư
* **Google Play**: [Bị cấm vì "vi phạm chính sách"](https://github.com/M66B/FairEmail/blob/master/FAQ.md#user-content-faq147)
* **Thực tế**: Chính sách nền tảng có thể vô hiệu hóa ứng dụng email ngay lập tức

### Vấn đề bảo trì {#the-maintenance-problem}

Các dự án email nguồn mở thất bại vì:

* **Độ phức tạp**: Giao thức email rất phức tạp để triển khai chính xác
* **Bảo mật**: Cần cập nhật bảo mật liên tục
* **Khả năng tương thích**: Phải hoạt động với tất cả các nhà cung cấp dịch vụ email
* **Nguồn lực**: Sự kiệt sức của các nhà phát triển tình nguyện

## Sự bùng nổ của các công ty khởi nghiệp về email AI: Lịch sử lặp lại với "Trí thông minh" {#the-ai-email-startup-surge-history-repeating-with-intelligence}

### Cơn sốt email AI hiện tại {#the-current-ai-email-gold-rush}

Các công ty khởi nghiệp email AI năm 2024:

* **[Siêu nhân](https://superhuman.com/)**: [Đã huy động được 33 triệu đô la](https://superhuman.com/), [được mua lại bởi Grammarly](https://www.reuters.com/business/grammarly-acquires-email-startup-superhuman-ai-platform-push-2025-07-01/) (2025)
* **[Sóng ngắn](https://www.shortwave.com/)**: Y Combinator, Gmail + AI
* **[Hộp Sane](https://www.sanebox.com/)**: Lọc email bằng AI (thực sự có lợi nhuận)
* **[Boomerang](https://www.boomeranggmail.com/)**: Lên lịch và phản hồi bằng AI
* **[Thư-0/Không](https://github.com/Mail-0/Zero)**: Công ty khởi nghiệp ứng dụng email hỗ trợ AI đang xây dựng thêm một giao diện email khác
* **[Hộp thư đến số không](https://github.com/elie222/inbox-zero)**: Trợ lý email AI nguồn mở đang nỗ lực tự động hóa việc quản lý email

### Cơn sốt tài trợ {#the-funding-frenzy}

Các nhà đầu tư mạo hiểm đang đổ tiền vào "AI + Email":

* **[Đã đầu tư hơn 100 triệu đô la](https://pitchbook.com/)** trong các công ty khởi nghiệp email AI năm 2024
* **Cùng lời hứa**: "Trải nghiệm email mang tính cách mạng"
* **Vấn đề tương tự**: Xây dựng trên nền tảng cơ sở hạ tầng hiện có
* **Kết quả tương tự**: Hầu hết sẽ thất bại trong vòng 3 năm

### Tại sao tất cả bọn họ đều sẽ thất bại (một lần nữa) {#why-theyll-all-fail-again}

1. **AI không giải quyết được những vấn đề không liên quan đến email**: Email hoạt động tốt
2. **[Gmail đã có AI](https://support.google.com/mail/answer/9116836)**: Trả lời thông minh, hộp thư đến ưu tiên, lọc thư rác
3. **Lo ngại về quyền riêng tư**: AI yêu cầu đọc tất cả email của bạn
4. **Cấu trúc chi phí**: Xử lý AI tốn kém, email là hàng hóa
5. **Hiệu ứng mạng**: Không thể phá vỡ sự thống trị của Gmail/Outlook

### Kết quả tất yếu {#the-inevitable-outcome}

* **2025**: [Superhuman đã được Grammarly mua lại thành công](https://www.reuters.com/business/grammarly-acquires-email-startup-superhuman-ai-platform-push-2025-07-01/) - một sự thoái lui thành công hiếm hoi của một ứng dụng email
* **2025-2026**: Hầu hết các công ty khởi nghiệp email AI còn lại sẽ chuyển hướng hoặc đóng cửa
* **2027**: Những công ty sống sót sẽ bị mua lại, với kết quả trái chiều
* **2028**: "Email blockchain" hay xu hướng tiếp theo sẽ xuất hiện

## Thảm họa hợp nhất: Khi "Những người sống sót" trở thành thảm họa {#the-consolidation-catastrophe-when-survivors-become-disasters}

### Hợp nhất dịch vụ email tuyệt vời {#the-great-email-service-consolidation}

Ngành công nghiệp email đã được củng cố đáng kể:

* **[ActiveCampaign đã mua lại Postmark](https://postmarkapp.com/blog/postmark-and-dmarc-digests-acquired-by-activecampaign)** (2022)
* **[Sinch đã mua lại Mailgun](https://sinch.com/news/sinch-acquires-mailgun-and-mailjet/)** (2021)
* **[Twilio đã mua lại SendGrid](https://en.wikipedia.org/wiki/SendGrid)** (2019)
* **Nhiều thương vụ mua lại [Ngẫu hứng](https://improvmx.com/)** (đang diễn ra) với [mối quan tâm về quyền riêng tư](https://discuss.privacyguides.net/t/forward-email-new-features/24845/55) và [thông báo mua lại](https://improvmx.com/blog/improvmx-has-been-acquired) và [danh sách doanh nghiệp](https://quietlight.com/listings/15877422)

### Triển vọng: "Kẻ sống sót" không thể ngừng phá vỡ {#outlook-the-survivor-that-cant-stop-breaking}

[Microsoft Outlook](https://outlook.com/), mặc dù là "người sống sót", vẫn liên tục gặp phải các vấn đề:

* **Rò rỉ bộ nhớ**: [Outlook tiêu tốn hàng gigabyte RAM](https://www.reddit.com/r/sysadmin/comments/1g0ejp6/anyone_else_currently_experiencing_strange/) và [yêu cầu khởi động lại thường xuyên](https://answers.microsoft.com/en-us/outlook_com/forum/all/new-outlook-use-excessive-memory-after-last-update/5e2a06a6-5f72-4266-8053-7c8b6df42f3d)
* **Sự cố đồng bộ hóa**: Email biến mất và xuất hiện lại ngẫu nhiên
* **Sự cố hiệu suất**: Khởi động chậm, thường xuyên gặp sự cố
* **Sự cố tương thích**: Không tương thích với các nhà cung cấp email bên thứ ba

**Kinh nghiệm thực tế của chúng tôi**: Chúng tôi thường xuyên giúp đỡ những khách hàng có thiết lập Outlook không tuân thủ đúng quy trình triển khai IMAP của chúng tôi.

### Vấn đề về cơ sở hạ tầng dấu bưu điện {#the-postmark-infrastructure-problem}

Sau [Việc mua lại ActiveCampaign](https://postmarkapp.com/blog/postmark-and-dmarc-digests-acquired-by-activecampaign):

* **Lỗi chứng chỉ SSL**: [Gần 10 giờ mất điện vào tháng 9 năm 2024](https://postmarkapp.com/blog/outbound-smtp-outage-on-september-15-2024) do chứng chỉ SSL đã hết hạn
* **Từ chối của người dùng**: [Marc Köhlbrugge bị từ chối](https://x.com/marckohlbrugge/status/1935041134729769379) mặc dù sử dụng hợp lệ
* **Nhà phát triển Exodus**: [@levelsio tuyên bố "Amazon SES là hy vọng cuối cùng của chúng tôi"](https://x.com/levelsio/status/1934197733989999084)
* **Sự cố MailGun**: [Scott đã báo cáo](https://x.com/\_SMBaxter/status/1934175626375704675): "Dịch vụ tệ nhất từ @Mail_Gun... chúng tôi đã không thể gửi email trong 2 tuần"

### Các vụ việc gần đây liên quan đến máy khách email (2024-2025) {#recent-email-client-casualties-2024-2025}

**[Hộp thư → eM Client](https://www.postbox-inc.com/) Mua lại**: Vào năm 2024, eM Client đã mua lại Postbox và [ngay lập tức tắt nó đi](https://www.postbox-inc.com/), buộc hàng nghìn người dùng phải di chuyển.

**[Thư Canary](https://canarymail.io/) Sự cố**: Mặc dù có [Cây Sequoia ủng hộ](https://www.sequoiacap.com/), người dùng vẫn báo cáo các tính năng không hoạt động và dịch vụ hỗ trợ khách hàng kém.

**[Spark của Readdle](https://sparkmailapp.com/)**: Người dùng ngày càng báo cáo trải nghiệm kém với ứng dụng email.

**[Chim đưa thư](https://www.getmailbird.com/) Vấn đề cấp phép**: Người dùng Windows gặp phải các vấn đề về cấp phép và nhầm lẫn về đăng ký.

**[Đường hàng không](https://airmailapp.com/) Từ chối**: Ứng dụng email dành cho Mac/iOS, dựa trên cơ sở mã Sparrow bị lỗi, tiếp tục nhận [đánh giá kém](https://airmailapp.com/) do các vấn đề về độ tin cậy.

### Tiện ích mở rộng email và mua lại dịch vụ {#email-extension-and-service-acquisitions}

**[HubSpot Sidekick](https://en.wikipedia.org/wiki/HubSpot#Products_and_services) → Ngừng cung cấp**: Tiện ích mở rộng theo dõi email của HubSpot là [ngừng sản xuất vào năm 2016](https://en.wikipedia.org/wiki/HubSpot#Products_and_services) và được thay thế bằng "HubSpot Sales".

**[Tham gia Gmail](https://help.salesforce.com/s/articleView?id=000394547\&type=1) → Đã ngừng sử dụng**: Tiện ích mở rộng Gmail của Salesforce đã ngừng sử dụng [đã nghỉ hưu vào tháng 6 năm 2024](https://help.salesforce.com/s/articleView?id=000394547\&type=1), buộc người dùng phải chuyển sang các giải pháp khác.

### Những người sống sót: Các công ty email thực sự hoạt động {#the-survivors-email-companies-that-actually-work}

Không phải tất cả các công ty email đều thất bại. Sau đây là những công ty thực sự hoạt động:

**[Mailmodo](https://www.mailmodo.com/)**: [Câu chuyện thành công của Y Combinator](https://www.ycombinator.com/companies/mailmodo), [2 triệu đô la từ Surge của Sequoia](https://www.techinasia.com/saas-email-marketing-platform-nets-2-mn-ycombinator-sequoia-surge) bằng cách tập trung vào các chiến dịch email tương tác.

**[Mixmax](https://mixmax.com/)**: Đã huy động được [Tổng số tiền tài trợ là 13,3 triệu đô la](https://www.mixmax.com/about) và tiếp tục hoạt động như một nền tảng tương tác bán hàng thành công.

**[Outreach.io](https://www.outreach.io/)**: Đã đạt [Giá trị định giá 4,4 tỷ đô la](https://www.prnewswire.com/news-releases/outreach-closes-200-million-round-4-4-billion-valuation-for-sales-engagement-category-leader-301304239.html) và đang chuẩn bị cho đợt IPO tiềm năng với tư cách là nền tảng tương tác bán hàng.

**[Apollo.io](https://www.apollo.io/)**: Đạt được [Giá trị định giá 1,6 tỷ đô la](https://techcrunch.com/2023/08/29/apollo-io-a-full-stack-sales-tech-platform-bags-100m-at-a-1-6b-valuation/) với vòng gọi vốn Series D trị giá 100 triệu đô la vào năm 2023 cho nền tảng thông tin bán hàng của họ.

**[Khối lượng](https://www.gmass.co/)**: Câu chuyện thành công của Bootstrap khi tạo [$140K/tháng](https://www.indiehackers.com/product/gmass) dưới dạng tiện ích mở rộng của Gmail cho tiếp thị qua email.

**[Chuỗi CRM](https://www.streak.com/)**: CRM thành công dựa trên Gmail đã hoạt động [từ năm 2012](https://www.streak.com/about) mà không có sự cố lớn nào.

**[ToutApp](https://blog.marketo.com/2017/05/marketo-acquires-toutapp.html)**: Đã thành công [được Marketo mua lại vào năm 2017](https://blog.marketo.com/2017/05/marketo-acquires-toutapp.html) sau khi huy động được hơn 15 triệu đô la tiền tài trợ.

**[Thẻ chuối](https://staffbase.com/blog/staffbase-acquires-bananatag/)**: [Được Staffbase mua lại vào năm 2021](https://staffbase.com/blog/staffbase-acquires-bananatag/) và tiếp tục hoạt động với tên gọi "Email Staffbase".

**Mô hình chính**: Những công ty này thành công vì họ **cải thiện quy trình làm việc email hiện có** thay vì cố gắng thay thế hoàn toàn email. Họ xây dựng các công cụ hoạt động **với** cơ sở hạ tầng email, chứ không phải chống lại nó.

> \[!TIP]
> **Don't see a provider you know of mentioned here?** (e.g. Posteo, Mailbox.org, Migadu, etc.) Refer to our [comprehensive email service comparison page](https://forwardemail.net/en/blog/best-email-service) for more insight.
