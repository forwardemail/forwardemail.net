# Thỏa thuận xử lý dữ liệu {#data-processing-agreement}

<!-- v1.0 từ <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## Mục lục {#table-of-contents}

* [Các thuật ngữ chính](#key-terms)
* [Những thay đổi trong Thỏa thuận](#changes-to-the-agreement)
* [1. Mối quan hệ giữa bộ xử lý và bộ xử lý phụ](#1-processor-and-subprocessor-relationships)
  * [1. Nhà cung cấp là bên xử lý](#1-provider-as-processor)
  * [2. Nhà cung cấp là Bộ xử lý phụ](#2-provider-as-subprocessor)
* [2. Xử lý](#2-processing)
  * [1. Chi tiết xử lý](#1-processing-details)
  * [2. Hướng dẫn xử lý](#2-processing-instructions)
  * [3. Xử lý bởi Nhà cung cấp](#3-processing-by-provider)
  * [4. Xử lý khách hàng](#4-customer-processing)
  * [5. Đồng ý xử lý](#5-consent-to-processing)
  * [6. Bộ xử lý phụ](#6-subprocessors)
* [3. Chuyển nhượng bị hạn chế](#3-restricted-transfers)
  * [1. Ủy quyền](#1-authorization)
  * [2. Chuyển khoản ngoài EEA](#2-ex-eea-transfers)
  * [3. Chuyển nhượng từ Anh](#3-ex-uk-transfers)
  * [4. Chuyển khoản quốc tế khác](#4-other-international-transfers)
* [4. Phản hồi sự cố bảo mật](#4-security-incident-response)
* [5. Kiểm toán & Báo cáo](#5-audit--reports)
  * [1. Quyền kiểm toán](#1-audit-rights)
  * [2. Báo cáo bảo mật](#2-security-reports)
  * [3. Thẩm định an ninh](#3-security-due-diligence)
* [6. Phối hợp và hợp tác](#6-coordination--cooperation)
  * [1. Trả lời các câu hỏi](#1-response-to-inquiries)
  * [2. DPIA và DTIA](#2-dpias-and-dtias)
* [7. Xóa dữ liệu cá nhân của khách hàng](#7-deletion-of-customer-personal-data)
  * [1. Xóa bởi Khách hàng](#1-deletion-by-customer)
  * [2. Xóa khi DPA hết hạn](#2-deletion-at-dpa-expiration)
* [8. Giới hạn trách nhiệm](#8-limitation-of-liability)
  * [1. Giới hạn trách nhiệm và miễn trừ thiệt hại](#1-liability-caps-and-damages-waiver)
  * [2. Khiếu nại của bên liên quan](#2-related-party-claims)
  * [3. Ngoại lệ](#3-exceptions)
* [9. Xung đột giữa các tài liệu](#9-conflicts-between-documents)
* [10. Điều khoản thỏa thuận](#10-term-of-agreement)
* [11. Luật điều chỉnh và Tòa án được lựa chọn](#11-governing-law-and-chosen-courts)
* [12. Mối quan hệ với nhà cung cấp dịch vụ](#12-service-provider-relationship)
* [13. Định nghĩa](#13-definitions)
* [Tín dụng](#credits)

## Thuật ngữ chính {#key-terms}

| Thuật ngữ | Giá trị |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Thỏa thuận</strong> | DPA này bổ sung cho [Terms of Service](/terms) |
| <strong>Bộ xử lý phụ được phê duyệt</strong> | [Cloudflare](https://cloudflare.com) (Mỹ; nhà cung cấp DNS, mạng và bảo mật), [DataPacket](https://www.datapacket.com/) (Mỹ/Anh; nhà cung cấp dịch vụ lưu trữ), [Digital Ocean](https://digitalocean.com) (Mỹ; nhà cung cấp dịch vụ lưu trữ), [GitHub](https://github.com) (US; source code hosting, CI/CD, and project management), [Vultr](https://www.vultr.com) (Mỹ; nhà cung cấp dịch vụ lưu trữ), [Stripe](https://stripe.com) (Mỹ; bộ xử lý thanh toán), [PayPal](https://paypal.com) (Mỹ; bộ xử lý thanh toán) |
| <strong>Liên hệ bảo mật nhà cung cấp</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>Chính sách bảo mật</strong> | Xem [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| <strong>Nhà nước quản lý</strong> | Tiểu bang Delaware, Hoa Kỳ |

## Thay đổi đối với Thỏa thuận {#changes-to-the-agreement}

Tài liệu này là phiên bản phái sinh của [Các thuật ngữ tiêu chuẩn DPA phổ biến (Phiên bản 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) và đã thực hiện những thay đổi sau:

1. [Luật điều chỉnh và Tòa án được lựa chọn](#11-governing-law-and-chosen-courts) đã được đưa vào phần bên dưới với `Governing State` đã được xác định ở trên.
2. [Mối quan hệ với nhà cung cấp dịch vụ](#12-service-provider-relationship) đã được đưa vào phần bên dưới.

## 1. Mối quan hệ giữa Bộ xử lý và Bộ xử lý phụ {#1-processor-and-subprocessor-relationships}

### 1. Nhà cung cấp là Bộ xử lý {#1-provider-as-processor}

Trong trường hợp <strong>Khách hàng</strong> là Người kiểm soát Dữ liệu cá nhân của Khách hàng, <strong>Nhà cung cấp</strong> sẽ được coi là Bộ xử lý đang Xử lý Dữ liệu cá nhân thay mặt cho <strong>Khách hàng</strong>.

### 2. Nhà cung cấp là Bộ xử lý phụ {#2-provider-as-subprocessor}

Trong trường hợp <strong>Khách hàng</strong> là Bộ xử lý Dữ liệu cá nhân của Khách hàng, <strong>Nhà cung cấp</strong> sẽ được coi là Bộ xử lý phụ của Dữ liệu cá nhân của Khách hàng.

## 2. Đang xử lý {#2-processing}

### 1. Chi tiết xử lý {#1-processing-details}

Phụ lục I(B) trên Trang bìa mô tả nội dung, bản chất, mục đích và thời gian xử lý này, cũng như <strong>Các loại Dữ liệu cá nhân</strong> được thu thập và <strong>Các loại Chủ thể dữ liệu</strong>.

### 2. Hướng dẫn xử lý {#2-processing-instructions}

<strong>Khách hàng</strong> chỉ thị <strong>Nhà cung cấp</strong> Xử lý Dữ liệu Cá nhân của Khách hàng: (a) cung cấp và duy trì Dịch vụ; (b) như có thể được chỉ định thêm thông qua việc <strong>Khách hàng</strong> sử dụng Dịch vụ; (c) như được ghi trong <strong>Thỏa thuận</strong>; và (d) như được ghi trong bất kỳ hướng dẫn bằng văn bản nào khác do <strong>Khách hàng</strong> đưa ra và được <strong>Nhà cung cấp</strong> xác nhận về việc Xử lý Dữ liệu Cá nhân của Khách hàng theo DPA này. <strong>Nhà cung cấp</strong> sẽ tuân thủ các hướng dẫn này trừ khi bị Luật hiện hành cấm. <strong>Nhà cung cấp</strong> sẽ thông báo ngay cho <strong>Khách hàng</strong> nếu không thể làm theo Hướng dẫn Xử lý. <strong>Khách hàng</strong> đã đưa ra và sẽ chỉ đưa ra các hướng dẫn tuân thủ Luật hiện hành.

### 3. Xử lý bởi Nhà cung cấp {#3-processing-by-provider}

<strong>Nhà cung cấp</strong> sẽ chỉ Xử lý Dữ liệu Cá nhân của Khách hàng theo DPA này, bao gồm các chi tiết trong Trang bìa. Nếu <strong>Nhà cung cấp</strong> cập nhật Dịch vụ để cập nhật các sản phẩm, tính năng hoặc chức năng hiện có hoặc bao gồm các sản phẩm, tính năng hoặc chức năng mới, <strong>Nhà cung cấp</strong> có thể thay đổi <strong>Danh mục Chủ thể Dữ liệu</strong>, <strong>Danh mục Dữ liệu Cá nhân</strong>, <strong>Dữ liệu Loại Đặc biệt</strong>, <strong>Hạn chế hoặc Biện pháp Bảo vệ Dữ liệu Loại Đặc biệt</strong>, <strong>Tần suất Chuyển giao</strong>, <strong>Bản chất và Mục đích Xử lý</strong> và <strong>Thời lượng Xử lý</strong> khi cần thiết để phản ánh các cập nhật bằng cách thông báo cho <strong>Khách hàng</strong> về các cập nhật và thay đổi.

### 4. Xử lý khách hàng {#4-customer-processing}

Trong trường hợp <strong>Khách hàng</strong> là Bên xử lý và <strong>Nhà cung cấp</strong> là Bên xử lý phụ, <strong>Khách hàng</strong> sẽ tuân thủ tất cả các Luật hiện hành áp dụng cho việc <strong>Khách hàng</strong> Xử lý Dữ liệu Cá nhân của Khách hàng. Thỏa thuận của <strong>Khách hàng</strong> với Bên kiểm soát cũng sẽ yêu cầu <strong>Khách hàng</strong> tuân thủ tất cả các Luật hiện hành áp dụng cho <strong>Khách hàng</strong> với tư cách là Bên xử lý. Ngoài ra, <strong>Khách hàng</strong> sẽ tuân thủ các yêu cầu của Bên xử lý phụ trong thỏa thuận của <strong>Khách hàng</strong> với Bên kiểm soát.

### 5. Đồng ý xử lý {#5-consent-to-processing}

<strong>Khách hàng</strong> đã tuân thủ và sẽ tiếp tục tuân thủ mọi Luật bảo vệ dữ liệu hiện hành liên quan đến việc cung cấp Dữ liệu cá nhân của Khách hàng cho <strong>Nhà cung cấp</strong> và/hoặc Dịch vụ, bao gồm việc thực hiện mọi tiết lộ, xin mọi sự đồng ý, cung cấp lựa chọn phù hợp và thực hiện các biện pháp bảo vệ có liên quan theo yêu cầu của Luật bảo vệ dữ liệu hiện hành.

### 6. Bộ xử lý phụ {#6-subprocessors}

a. <strong>Nhà cung cấp</strong> sẽ không cung cấp, chuyển giao hoặc bàn giao bất kỳ Dữ liệu cá nhân nào của Khách hàng cho Bộ xử lý phụ trừ khi <strong>Khách hàng</strong> đã chấp thuận Bộ xử lý phụ. Danh sách <strong>Bộ xử lý phụ được chấp thuận</strong> hiện tại bao gồm danh tính của Bộ xử lý phụ, quốc gia của họ và các tác vụ Xử lý dự kiến của họ. <strong>Nhà cung cấp</strong> sẽ thông báo cho <strong>Khách hàng</strong> trước ít nhất 10 ngày làm việc và bằng văn bản về bất kỳ thay đổi dự kiến nào đối với <strong>Bộ xử lý phụ được chấp thuận</strong> cho dù bằng cách bổ sung hay thay thế Bộ xử lý phụ, cho phép <strong>Khách hàng</strong> có đủ thời gian để phản đối các thay đổi trước khi <strong>Nhà cung cấp</strong> bắt đầu sử dụng (các) Bộ xử lý phụ mới. <strong>Nhà cung cấp</strong> sẽ cung cấp cho <strong>Khách hàng</strong> thông tin cần thiết để cho phép <strong>Khách hàng</strong> thực hiện quyền phản đối thay đổi đối với <strong>Bộ xử lý phụ được chấp thuận</strong>. <strong>Khách hàng</strong> có 30 ngày sau khi nhận được thông báo về việc thay đổi đối với <strong>Bộ xử lý phụ được Phê duyệt</strong> để phản đối, nếu không, <strong>Khách hàng</strong> sẽ được coi là chấp nhận các thay đổi. Nếu <strong>Khách hàng</strong> phản đối thay đổi trong vòng 30 ngày kể từ ngày nhận được thông báo, <strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> sẽ hợp tác thiện chí để giải quyết khiếu nại hoặc thắc mắc của <strong>Khách hàng</strong>.

b. Khi thuê một Bộ xử lý phụ, <strong>Nhà cung cấp</strong> sẽ có một thỏa thuận bằng văn bản với Bộ xử lý phụ đảm bảo rằng Bộ xử lý phụ chỉ truy cập và sử dụng Dữ liệu cá nhân của Khách hàng (i) trong phạm vi cần thiết để thực hiện các nghĩa vụ được giao cho Nhà cung cấp phụ và (ii) phù hợp với các điều khoản của <strong>Thỏa thuận</strong>.

c. Nếu GDPR áp dụng cho việc Xử lý Dữ liệu Cá nhân của Khách hàng, (i) các nghĩa vụ bảo vệ dữ liệu được mô tả trong DPA này (như được đề cập trong Điều 28(3) của GDPR, nếu có) cũng được áp dụng cho Bộ xử lý phụ và (ii) thỏa thuận của <strong>Nhà cung cấp</strong> với Bộ xử lý phụ sẽ kết hợp các nghĩa vụ này, bao gồm các chi tiết về cách <strong>Nhà cung cấp</strong> và Bộ xử lý phụ của mình sẽ phối hợp để trả lời các câu hỏi hoặc yêu cầu về việc Xử lý Dữ liệu Cá nhân của Khách hàng. Ngoài ra, <strong>Nhà cung cấp</strong> sẽ chia sẻ, theo yêu cầu của <strong>Khách hàng</strong>, một bản sao các thỏa thuận của mình (bao gồm bất kỳ sửa đổi nào) với các Bộ xử lý phụ của mình. Trong phạm vi cần thiết để bảo vệ bí mật kinh doanh hoặc thông tin bí mật khác, bao gồm dữ liệu cá nhân, <strong>Nhà cung cấp</strong> có thể biên tập văn bản thỏa thuận của mình với Bộ xử lý phụ trước khi chia sẻ bản sao.

d. <strong>Nhà cung cấp</strong> vẫn hoàn toàn chịu trách nhiệm đối với mọi nghĩa vụ được giao cho các Bộ xử lý phụ của mình, bao gồm cả hành vi và thiếu sót của các Bộ xử lý phụ trong việc Xử lý Dữ liệu Cá nhân của Khách hàng. <strong>Nhà cung cấp</strong> sẽ thông báo cho Khách hàng về bất kỳ trường hợp nào các Bộ xử lý phụ của mình không thực hiện nghĩa vụ quan trọng liên quan đến Dữ liệu Cá nhân của Khách hàng theo thỏa thuận giữa <strong>Nhà cung cấp</strong> và Bộ xử lý phụ.

## 3. Chuyển nhượng bị hạn chế {#3-restricted-transfers}

### 1. Ủy quyền {#1-authorization}

<strong>Khách hàng</strong> đồng ý rằng <strong>Nhà cung cấp</strong> có thể chuyển Dữ liệu Cá nhân của Khách hàng ra ngoài Khu vực Kinh tế Châu Âu (EEA), Vương quốc Anh hoặc các lãnh thổ địa lý liên quan khác khi cần thiết để cung cấp Dịch vụ. Nếu <strong>Nhà cung cấp</strong> chuyển Dữ liệu Cá nhân của Khách hàng đến một lãnh thổ mà Ủy ban Châu Âu hoặc cơ quan giám sát có liên quan khác chưa ban hành quyết định về tính đầy đủ, <strong>Nhà cung cấp</strong> sẽ thực hiện các biện pháp bảo vệ phù hợp cho việc chuyển Dữ liệu Cá nhân của Khách hàng đến lãnh thổ đó, phù hợp với Luật Bảo vệ Dữ liệu Hiện hành.

### 2. Chuyển nhượng ngoài EEA {#2-ex-eea-transfers}

<strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> đồng ý rằng nếu GDPR bảo vệ việc chuyển giao Dữ liệu Cá nhân của Khách hàng, việc chuyển giao sẽ được thực hiện từ <strong>Khách hàng</strong> trong EEA đến <strong>Nhà cung cấp</strong> bên ngoài EEA, và việc chuyển giao không chịu sự điều chỉnh của quyết định về tính đầy đủ của Ủy ban Châu Âu, thì bằng việc ký kết DPA này, <strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> được coi là đã ký các SCC của EEA và các Phụ lục của chúng, được hợp nhất bằng cách tham chiếu. Bất kỳ việc chuyển giao nào như vậy đều được thực hiện theo các SCC của EEA, được hoàn thành như sau:

a. Mô-đun Hai (Bộ điều khiển đến Bộ xử lý) của SCC EEA áp dụng khi <strong>Khách hàng</strong> là Bộ điều khiển và <strong>Nhà cung cấp</strong> đang Xử lý Dữ liệu cá nhân của Khách hàng cho <strong>Khách hàng</strong> với tư cách là Bộ xử lý.

b. Mô-đun Ba (Bộ xử lý đến Bộ xử lý phụ) của SCC EEA được áp dụng khi <strong>Khách hàng</strong> là Bộ xử lý và <strong>Nhà cung cấp</strong> đang Xử lý Dữ liệu cá nhân của Khách hàng thay mặt cho <strong>Khách hàng</strong> với tư cách là Bộ xử lý phụ.

c. Đối với mỗi mô-đun, những điều sau đây được áp dụng (khi có thể):

1. Điều khoản neo đậu tùy chọn trong Điều 7 không áp dụng;

2. Trong Điều khoản 9, Tùy chọn 2 (ủy quyền chung bằng văn bản) được áp dụng và thời gian tối thiểu để thông báo trước về những thay đổi của Bộ xử lý phụ là 10 ngày làm việc;

3. Trong Điều 11, ngôn ngữ tùy chọn không được áp dụng;

4. Tất cả các dấu ngoặc vuông trong Điều 13 đều bị xóa bỏ;

5. Trong Điều khoản 17 (Tùy chọn 1), các SCC EEA sẽ được điều chỉnh bởi luật pháp của <strong>Quốc gia thành viên quản lý</strong>;

6. Trong Điều 18(b), các tranh chấp sẽ được giải quyết tại tòa án của <strong>Quốc gia thành viên quản lý</strong>; và

7. Trang bìa của DPA này chứa thông tin được yêu cầu trong Phụ lục I, Phụ lục II và Phụ lục III của SCC EEA.

### 3. Chuyển nhượng ngoài Vương quốc Anh {#3-ex-uk-transfers}

<strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> đồng ý rằng nếu GDPR của Vương quốc Anh bảo vệ việc chuyển giao Dữ liệu Cá nhân của Khách hàng, việc chuyển giao sẽ được thực hiện từ <strong>Khách hàng</strong> trong Vương quốc Anh đến <strong>Nhà cung cấp</strong> bên ngoài Vương quốc Anh, và việc chuyển giao không chịu sự điều chỉnh của quyết định về tính đầy đủ do Bộ trưởng Ngoại giao Vương quốc Anh đưa ra, thì bằng việc ký kết DPA này, <strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> được coi là đã ký Phụ lục Vương quốc Anh và các Phụ lục của Phụ lục này, được hợp nhất bằng cách tham chiếu. Bất kỳ việc chuyển giao nào như vậy đều được thực hiện theo Phụ lục Vương quốc Anh, được hoàn thành như sau:

a. Mục 3.2 của DPA này chứa thông tin được yêu cầu trong Bảng 2 của Phụ lục của Vương quốc Anh.

b. Bảng 4 của Phụ lục Vương quốc Anh được sửa đổi như sau: Không bên nào được chấm dứt Phụ lục Vương quốc Anh theo quy định tại Mục 19 của Phụ lục Vương quốc Anh; trong phạm vi ICO ban hành Phụ lục được phê duyệt sửa đổi theo Mục 18 của Phụ lục Vương quốc Anh, các bên sẽ hợp tác thiện chí để sửa đổi DPA này cho phù hợp.

c. Trang bìa chứa thông tin theo yêu cầu của Phụ lục 1A, Phụ lục 1B, Phụ lục II và Phụ lục III của Phụ lục Vương quốc Anh.

### 4. Chuyển khoản quốc tế khác {#4-other-international-transfers}

Đối với việc chuyển Dữ liệu cá nhân mà luật Thụy Sĩ (và không phải luật của bất kỳ quốc gia thành viên EEA nào hoặc Vương quốc Anh) áp dụng cho bản chất quốc tế của việc chuyển giao, các tham chiếu đến GDPR trong Điều khoản 4 của SCC EEA, trong phạm vi pháp luật yêu cầu, sẽ được sửa đổi để đề cập đến Đạo luật bảo vệ dữ liệu liên bang của Thụy Sĩ hoặc văn bản kế nhiệm, và khái niệm về cơ quan giám sát sẽ bao gồm Ủy viên thông tin và bảo vệ dữ liệu liên bang của Thụy Sĩ.

## 4. Phản hồi sự cố bảo mật {#4-security-incident-response}

1. Khi nhận biết được bất kỳ Sự cố Bảo mật nào, <strong>Nhà cung cấp</strong> sẽ: (a) thông báo cho <strong>Khách hàng</strong> mà không chậm trễ quá mức khi có thể, nhưng không muộn hơn 72 giờ sau khi nhận biết được Sự cố Bảo mật; (b) cung cấp thông tin kịp thời về Sự cố Bảo mật khi biết được hoặc khi được <strong>Khách hàng</strong> yêu cầu một cách hợp lý; và (c) nhanh chóng thực hiện các bước hợp lý để ngăn chặn và điều tra Sự cố Bảo mật. Thông báo hoặc phản hồi của <strong>Nhà cung cấp</strong> về Sự cố Bảo mật theo yêu cầu của DPA này sẽ không được hiểu là <strong>Nhà cung cấp</strong> thừa nhận bất kỳ lỗi hoặc trách nhiệm nào đối với Sự cố Bảo mật.

## 5. Kiểm toán & Báo cáo {#5-audit--reports}

### 1. Quyền kiểm tra {#1-audit-rights}

Nhà cung cấp sẽ cung cấp cho Khách hàng tất cả thông tin cần thiết hợp lý để chứng minh việc tuân thủ DPA này và Nhà cung cấp sẽ cho phép và đóng góp vào các cuộc kiểm toán, bao gồm cả việc Khách hàng kiểm tra, để đánh giá việc Nhà cung cấp tuân thủ DPA này. Tuy nhiên, Nhà cung cấp có thể hạn chế quyền truy cập vào dữ liệu hoặc thông tin nếu việc Khách hàng truy cập vào thông tin sẽ ảnh hưởng tiêu cực đến quyền sở hữu trí tuệ, nghĩa vụ bảo mật hoặc các nghĩa vụ khác của Nhà cung cấp theo Luật hiện hành. Khách hàng thừa nhận và đồng ý rằng Nhà cung cấp sẽ chỉ thực hiện các quyền kiểm toán theo DPA này và bất kỳ quyền kiểm toán nào được Luật bảo vệ dữ liệu hiện hành cấp bằng cách hướng dẫn Nhà cung cấp tuân thủ các yêu cầu báo cáo và thẩm định dưới đây. Nhà cung cấp sẽ lưu giữ hồ sơ về việc tuân thủ DPA này trong 3 năm sau khi DPA kết thúc.

### 2. Báo cáo bảo mật {#2-security-reports}

<strong>Khách hàng</strong> thừa nhận rằng <strong>Nhà cung cấp</strong> được kiểm toán định kỳ theo các tiêu chuẩn được xác định trong <strong>Chính sách Bảo mật</strong> bởi các kiểm toán viên bên thứ ba độc lập. Khi có yêu cầu bằng văn bản, <strong>Nhà cung cấp</strong> sẽ cung cấp cho <strong>Khách hàng</strong> một bản tóm tắt Báo cáo hiện hành của mình trên cơ sở bảo mật để <strong>Khách hàng</strong> có thể xác minh việc <strong>Nhà cung cấp</strong> tuân thủ các tiêu chuẩn được xác định trong <strong>Chính sách Bảo mật</strong>.

### 3. Thẩm định an ninh {#3-security-due-diligence}

Ngoài Báo cáo, <strong>Nhà cung cấp</strong> sẽ phản hồi các yêu cầu thông tin hợp lý do <strong>Khách hàng</strong> đưa ra để xác nhận việc <strong>Nhà cung cấp</strong> tuân thủ DPA này, bao gồm các phản hồi về bảo mật thông tin, thẩm định và bảng câu hỏi kiểm toán, hoặc bằng cách cung cấp thêm thông tin về chương trình bảo mật thông tin của mình. Tất cả các yêu cầu như vậy phải được lập thành văn bản và gửi đến <strong>Người liên hệ về bảo mật của Nhà cung cấp</strong> và chỉ được thực hiện mỗi năm một lần.

## 6. Phối hợp & Hợp tác {#6-coordination--cooperation}

### 1. Phản hồi yêu cầu {#1-response-to-inquiries}

Nếu <strong>Nhà cung cấp</strong> nhận được bất kỳ yêu cầu hoặc thắc mắc nào từ bất kỳ ai khác về việc Xử lý Dữ liệu Cá nhân của Khách hàng, <strong>Nhà cung cấp</strong> sẽ thông báo cho <strong>Khách hàng</strong> về yêu cầu đó và <strong>Nhà cung cấp</strong> sẽ không phản hồi yêu cầu mà không có sự đồng ý trước của <strong>Khách hàng</strong>. Ví dụ về các loại yêu cầu và thắc mắc này bao gồm lệnh của cơ quan tư pháp, hành chính hoặc quản lý về Dữ liệu Cá nhân của Khách hàng, trong trường hợp việc thông báo cho <strong>Khách hàng</strong> không bị Luật Hiện hành cấm, hoặc yêu cầu từ chủ thể dữ liệu. Nếu được Luật Hiện hành cho phép, <strong>Nhà cung cấp</strong> sẽ tuân theo các hướng dẫn hợp lý của <strong>Khách hàng</strong> về các yêu cầu này, bao gồm việc cung cấp cập nhật trạng thái và các thông tin khác mà <strong>Khách hàng</strong> yêu cầu một cách hợp lý. Nếu chủ thể dữ liệu đưa ra yêu cầu hợp lệ theo Luật Bảo vệ Dữ liệu Hiện hành để xóa hoặc từ chối việc <strong>Khách hàng</strong> cung cấp Dữ liệu Cá nhân của Khách hàng cho <strong>Nhà cung cấp</strong>, <strong>Nhà cung cấp</strong> sẽ hỗ trợ <strong>Khách hàng</strong> thực hiện yêu cầu theo Luật Bảo vệ Dữ liệu Hiện hành. <strong>Nhà cung cấp</strong> sẽ hợp tác và cung cấp hỗ trợ hợp lý cho <strong>Khách hàng</strong>, với chi phí <strong>do</strong> Khách hàng chi trả, trong bất kỳ phản hồi pháp lý hoặc hành động thủ tục nào khác do <strong>Khách hàng</strong> thực hiện để đáp lại yêu cầu của bên thứ ba về việc <strong>Nhà cung cấp</strong> Xử lý Dữ liệu Cá nhân của Khách hàng theo DPA này.

### 2. DPIA và DTIA {#2-dpias-and-dtias}

Nếu được yêu cầu theo Luật bảo vệ dữ liệu hiện hành, <strong>Nhà cung cấp</strong> sẽ hỗ trợ <strong>Khách hàng</strong> một cách hợp lý trong việc tiến hành bất kỳ đánh giá tác động bảo vệ dữ liệu bắt buộc nào hoặc đánh giá tác động chuyển giao dữ liệu và tham vấn với các cơ quan bảo vệ dữ liệu có liên quan, có tính đến bản chất của Dữ liệu cá nhân của Khách hàng và Xử lý.

## 7. Xóa dữ liệu cá nhân của khách hàng {#7-deletion-of-customer-personal-data}

### 1. Xóa bởi Khách hàng {#1-deletion-by-customer}

<strong>Nhà cung cấp</strong> sẽ cho phép <strong>Khách hàng</strong> xóa Dữ liệu Cá nhân của Khách hàng theo cách phù hợp với chức năng của Dịch vụ. <strong>Nhà cung cấp</strong> sẽ tuân thủ hướng dẫn này ngay khi có thể, trừ khi Luật hiện hành yêu cầu lưu trữ thêm Dữ liệu Cá nhân của Khách hàng.

### 2. Xóa khi DPA hết hạn {#2-deletion-at-dpa-expiration}

a. Sau khi DPA hết hạn, <strong>Nhà cung cấp</strong> sẽ trả lại hoặc xóa Dữ liệu Cá nhân của Khách hàng theo chỉ dẫn của <strong>Khách hàng</strong>, trừ khi việc lưu trữ Dữ liệu Cá nhân của Khách hàng được yêu cầu hoặc cho phép theo Luật Hiện hành. Nếu việc trả lại hoặc hủy bỏ là không khả thi hoặc bị Luật Hiện hành cấm, <strong>Nhà cung cấp</strong> sẽ thực hiện các nỗ lực hợp lý để ngăn chặn việc Xử lý Dữ liệu Cá nhân của Khách hàng thêm nữa và sẽ tiếp tục bảo vệ Dữ liệu Cá nhân của Khách hàng còn lại trong quyền sở hữu, lưu giữ hoặc kiểm soát của mình. Ví dụ: Luật Hiện hành có thể yêu cầu <strong>Nhà cung cấp</strong> tiếp tục lưu trữ hoặc Xử lý Dữ liệu Cá nhân của Khách hàng.

b. Nếu <strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> đã nhập SCC EEA hoặc Phụ lục của Vương quốc Anh như một phần của DPA này, <strong>Nhà cung cấp</strong> sẽ chỉ cấp cho <strong>Khách hàng</strong> chứng nhận xóa Dữ liệu cá nhân được mô tả trong Điều khoản 8.1(d) và Điều khoản 8.5 của SCC EEA nếu <strong>Khách hàng</strong> yêu cầu.

## 8. Giới hạn trách nhiệm pháp lý {#8-limitation-of-liability}

### 1. Giới hạn trách nhiệm và miễn trừ thiệt hại {#1-liability-caps-and-damages-waiver}

**Ở mức độ tối đa được phép theo Luật bảo vệ dữ liệu hiện hành, tổng trách nhiệm tích lũy của mỗi bên đối với bên kia phát sinh từ hoặc liên quan đến DPA này sẽ tuân theo các điều khoản miễn trừ, loại trừ và giới hạn trách nhiệm được nêu trong <strong>Thỏa thuận</strong>.**

### 2. Khiếu nại của bên liên quan {#2-related-party-claims}

**Mọi khiếu nại đối với <strong>Nhà cung cấp</strong> hoặc các Công ty liên kết của Nhà cung cấp phát sinh từ hoặc liên quan đến DPA này chỉ có thể được đưa ra bởi thực thể <strong>Khách hàng</strong> là một bên tham gia <strong>Thỏa thuận</strong>.**

### 3. Ngoại lệ {#3-exceptions}

1. DPA này không giới hạn bất kỳ trách nhiệm pháp lý nào đối với cá nhân liên quan đến quyền bảo vệ dữ liệu của cá nhân theo Luật Bảo vệ Dữ liệu Hiện hành. Ngoài ra, DPA này không giới hạn bất kỳ trách nhiệm pháp lý nào giữa các bên đối với việc vi phạm các Điều khoản và Điều kiện Chung của Khu vực Kinh tế Châu Âu (EEA SCC) hoặc Phụ lục Vương quốc Anh.

## 9. Xung đột giữa các tài liệu {#9-conflicts-between-documents}

1. DPA này là một phần và bổ sung cho Thỏa thuận. Nếu có bất kỳ mâu thuẫn nào giữa DPA này, <strong>Thỏa thuận</strong>, hoặc bất kỳ phần nào của chúng, phần được liệt kê trước đó sẽ chi phối phần được liệt kê sau đó về sự mâu thuẫn đó: (1) các SCC của EEA hoặc Phụ lục Vương quốc Anh, (2) DPA này, và sau đó (3) <strong>Thỏa thuận</strong>.

## 10. Điều khoản thỏa thuận {#10-term-of-agreement}

DPA này sẽ bắt đầu có hiệu lực khi <strong>Nhà cung cấp</strong> và <strong>Khách hàng</strong> đồng ý với Trang bìa của DPA và ký hoặc chấp nhận <strong>Thỏa thuận</strong> điện tử và sẽ tiếp tục cho đến khi <strong>Thỏa thuận</strong> hết hạn hoặc bị chấm dứt. Tuy nhiên, <strong>Nhà cung cấp</strong> và <strong>Khách hàng</strong> sẽ vẫn tuân thủ các nghĩa vụ trong DPA này và Luật Bảo vệ Dữ liệu Hiện hành cho đến khi <strong>Khách hàng</strong> ngừng chuyển Dữ liệu Cá nhân của Khách hàng cho <strong>Nhà cung cấp</strong> và <strong>Nhà cung cấp</strong> ngừng Xử lý Dữ liệu Cá nhân của Khách hàng.

## 11. Luật áp dụng và Tòa án được lựa chọn {#11-governing-law-and-chosen-courts}

Bất chấp luật áp dụng hoặc các điều khoản tương tự của <strong>Thỏa thuận</strong>, mọi diễn giải và tranh chấp liên quan đến DPA này sẽ được điều chỉnh bởi luật pháp của <strong>Quốc gia Quản lý</strong> mà không tính đến các điều khoản xung đột pháp luật của quốc gia đó. Ngoài ra, bất chấp việc lựa chọn diễn đàn, thẩm quyền tài phán hoặc các điều khoản tương tự của <strong>Thỏa thuận</strong>, các bên đồng ý đưa bất kỳ vụ kiện, hành động hoặc thủ tục pháp lý nào liên quan đến DPA này ra, và mỗi bên đồng ý tuân theo thẩm quyền độc quyền của tòa án <strong>Quốc gia Quản lý</strong>.

## 12. Mối quan hệ với nhà cung cấp dịch vụ {#12-service-provider-relationship}

Trong phạm vi áp dụng Đạo luật Quyền riêng tư của Người tiêu dùng California, Bộ luật Dân sự California § 1798.100 et seq ("CCPA"), các bên thừa nhận và đồng ý rằng <strong>Nhà cung cấp</strong> là nhà cung cấp dịch vụ và đang nhận Dữ liệu Cá nhân từ <strong>Khách hàng</strong> để cung cấp Dịch vụ theo thỏa thuận trong <strong>Thỏa thuận</strong>, đây là mục đích kinh doanh. <strong>Nhà cung cấp</strong> sẽ không bán bất kỳ Dữ liệu Cá nhân nào do <strong>Khách hàng</strong> cung cấp theo <strong>Thỏa thuận</strong>. Ngoài ra, <strong>Nhà cung cấp</strong> sẽ không lưu giữ, sử dụng hoặc tiết lộ bất kỳ Dữ liệu Cá nhân nào do <strong>Khách hàng</strong> cung cấp theo <strong>Thỏa thuận</strong>, trừ khi cần thiết để cung cấp Dịch vụ cho <strong>Khách hàng</strong>, như đã nêu trong <strong>Thỏa thuận</strong>, hoặc được Luật Bảo vệ Dữ liệu Hiện hành cho phép. <strong>Nhà cung cấp</strong> xác nhận rằng mình hiểu các hạn chế của đoạn này.

## 13. Định nghĩa {#13-definitions}

1. **"Luật áp dụng"** có nghĩa là luật, quy tắc, quy định, lệnh của tòa án và các yêu cầu ràng buộc khác của cơ quan chính phủ có liên quan áp dụng hoặc chi phối một bên.

2. **"Luật bảo vệ dữ liệu hiện hành"** có nghĩa là Luật hiện hành chi phối cách Dịch vụ có thể xử lý hoặc sử dụng thông tin cá nhân, dữ liệu cá nhân, thông tin nhận dạng cá nhân hoặc các thuật ngữ tương tự khác của một cá nhân.

3. **"Bộ điều khiển"** sẽ có nghĩa như được nêu trong Luật bảo vệ dữ liệu hiện hành của công ty xác định mục đích và phạm vi Xử lý Dữ liệu cá nhân.

4. **"Trang bìa"** có nghĩa là tài liệu được các bên ký hoặc chấp nhận điện tử, trong đó kết hợp các Điều khoản Tiêu chuẩn DPA này và xác định <strong>Nhà cung cấp</strong>, <strong>Khách hàng</strong>, cũng như chủ đề và chi tiết về việc xử lý dữ liệu.

5. **"Dữ liệu cá nhân của khách hàng"** có nghĩa là Dữ liệu cá nhân mà <strong>Khách hàng</strong> tải lên hoặc cung cấp cho <strong>Nhà cung cấp</strong> như một phần của Dịch vụ và được quản lý bởi DPA này.

6. **"DPA"** có nghĩa là các Điều khoản Tiêu chuẩn DPA này, Trang bìa giữa <strong>Nhà cung cấp</strong> và <strong>Khách hàng</strong>, cũng như các chính sách và tài liệu được tham chiếu trong hoặc đính kèm vào Trang bìa.

7. **"EEA SCCs"** có nghĩa là các điều khoản hợp đồng tiêu chuẩn được đính kèm vào Quyết định thực hiện 2021/914 của Ủy ban Châu Âu ngày 4 tháng 6 năm 2021 về các điều khoản hợp đồng tiêu chuẩn để chuyển dữ liệu cá nhân sang các quốc gia thứ ba theo Quy định (EU) 2016/679 của Nghị viện Châu Âu và Hội đồng Châu Âu.

8. **"Khu vực kinh tế châu Âu"** hoặc **"EEA"** có nghĩa là các quốc gia thành viên của Liên minh châu Âu, Na Uy, Iceland và Liechtenstein.

9. **"GDPR"** có nghĩa là Quy định 2016/679 của Liên minh Châu Âu được thực hiện theo luật pháp địa phương tại quốc gia thành viên EEA có liên quan.

10. **"Dữ liệu cá nhân"** sẽ có nghĩa như được nêu trong Luật bảo vệ dữ liệu hiện hành đối với thông tin cá nhân, dữ liệu cá nhân hoặc các thuật ngữ tương tự khác.

11. **"Xử lý"** hoặc **"Xử lý"** sẽ có ý nghĩa như được nêu trong Luật bảo vệ dữ liệu hiện hành đối với bất kỳ việc sử dụng hoặc thực hiện thao tác máy tính nào trên Dữ liệu cá nhân, bao gồm cả bằng các phương pháp tự động.

12. **"Bộ xử lý"** sẽ có nghĩa như được nêu trong Luật bảo vệ dữ liệu hiện hành đối với công ty Xử lý Dữ liệu cá nhân thay mặt cho Bộ điều khiển.

13. **"Báo cáo"** có nghĩa là báo cáo kiểm toán do một công ty khác lập theo các tiêu chuẩn được xác định trong Chính sách bảo mật thay mặt cho Nhà cung cấp.

14. **"Chuyển giao bị hạn chế"** có nghĩa là (a) khi GDPR được áp dụng, việc chuyển giao dữ liệu cá nhân từ EEA sang một quốc gia bên ngoài EEA không phải tuân theo quyết định về tính đầy đủ của Ủy ban Châu Âu; và (b) khi GDPR của Vương quốc Anh được áp dụng, việc chuyển giao dữ liệu cá nhân từ Vương quốc Anh sang bất kỳ quốc gia nào khác không phải tuân theo các quy định về tính đầy đủ được thông qua theo Mục 17A của Đạo luật Bảo vệ Dữ liệu của Vương quốc Anh năm 2018.

15. **"Sự cố bảo mật"** có nghĩa là Vi phạm dữ liệu cá nhân như được định nghĩa trong Điều 4 của GDPR.

16. **"Dịch vụ"** có nghĩa là sản phẩm và/hoặc dịch vụ được mô tả trong <strong>Thỏa thuận</strong>.

17. **"Dữ liệu danh mục đặc biệt"** sẽ có nghĩa như được nêu trong Điều 9 của GDPR.

18. **"Bộ xử lý phụ"** sẽ có nghĩa như được nêu trong Luật bảo vệ dữ liệu hiện hành đối với một công ty, với sự chấp thuận và chấp thuận của Bộ điều khiển, hỗ trợ Bộ xử lý trong việc Xử lý Dữ liệu cá nhân thay mặt cho Bộ điều khiển.

19. **"GDPR của Vương quốc Anh"** có nghĩa là Quy định 2016/679 của Liên minh Châu Âu được thực hiện theo phần 3 của Đạo luật (Rút lui) Liên minh Châu Âu của Vương quốc Anh năm 2018 tại Vương quốc Anh.

20. **"Phụ lục của Vương quốc Anh"** có nghĩa là phụ lục chuyển dữ liệu quốc tế cho các SCC của EEA do Ủy viên thông tin ban hành cho các Bên thực hiện Chuyển giao bị hạn chế theo Đạo luật Bảo vệ dữ liệu S119A(1) năm 2018.

## Tín dụng {#credits}

Tài liệu này là phiên bản phái sinh của [Các thuật ngữ tiêu chuẩn DPA phổ biến (Phiên bản 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) và được cấp phép theo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).