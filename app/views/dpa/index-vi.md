# Thỏa Thuận Xử Lý Dữ Liệu {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Thỏa thuận xử lý dữ liệu Forward Email" class="rounded-lg" />


## Mục Lục {#table-of-contents}

* [Thuật Ngữ Chính](#key-terms)
* [Thay Đổi Thỏa Thuận](#changes-to-the-agreement)
* [1. Mối Quan Hệ Giữa Bộ Xử Lý và Bộ Xử Lý Phụ](#1-processor-and-subprocessor-relationships)
  * [1. Nhà Cung Cấp Là Bộ Xử Lý](#1-provider-as-processor)
  * [2. Nhà Cung Cấp Là Bộ Xử Lý Phụ](#2-provider-as-subprocessor)
* [2. Xử Lý](#2-processing)
  * [1. Chi Tiết Xử Lý](#1-processing-details)
  * [2. Hướng Dẫn Xử Lý](#2-processing-instructions)
  * [3. Xử Lý Bởi Nhà Cung Cấp](#3-processing-by-provider)
  * [4. Xử Lý Bởi Khách Hàng](#4-customer-processing)
  * [5. Sự Đồng Ý Cho Việc Xử Lý](#5-consent-to-processing)
  * [6. Bộ Xử Lý Phụ](#6-subprocessors)
* [3. Chuyển Giao Bị Hạn Chế](#3-restricted-transfers)
  * [1. Ủy Quyền](#1-authorization)
  * [2. Chuyển Giao Ngoài Khu Vực EEA](#2-ex-eea-transfers)
  * [3. Chuyển Giao Ngoài Vương Quốc Anh](#3-ex-uk-transfers)
  * [4. Các Chuyển Giao Quốc Tế Khác](#4-other-international-transfers)
* [4. Phản Ứng Sự Cố An Ninh](#4-security-incident-response)
* [5. Kiểm Toán & Báo Cáo](#5-audit--reports)
  * [1. Quyền Kiểm Toán](#1-audit-rights)
  * [2. Báo Cáo An Ninh](#2-security-reports)
  * [3. Thẩm Định An Ninh](#3-security-due-diligence)
* [6. Phối Hợp & Hợp Tác](#6-coordination--cooperation)
  * [1. Phản Hồi Các Yêu Cầu](#1-response-to-inquiries)
  * [2. DPIAs và DTIAs](#2-dpias-and-dtias)
* [7. Xóa Dữ Liệu Cá Nhân Của Khách Hàng](#7-deletion-of-customer-personal-data)
  * [1. Xóa Bởi Khách Hàng](#1-deletion-by-customer)
  * [2. Xóa Khi Hết Hạn DPA](#2-deletion-at-dpa-expiration)
* [8. Giới Hạn Trách Nhiệm](#8-limitation-of-liability)
  * [1. Giới Hạn Trách Nhiệm và Miễn Trừ Thiệt Hại](#1-liability-caps-and-damages-waiver)
  * [2. Khiếu Nại Liên Quan Đến Bên Thứ Ba](#2-related-party-claims)
  * [3. Ngoại Lệ](#3-exceptions)
* [9. Xung Đột Giữa Các Tài Liệu](#9-conflicts-between-documents)
* [10. Thời Hạn Thỏa Thuận](#10-term-of-agreement)
* [11. Luật Áp Dụng và Tòa Án Được Chọn](#11-governing-law-and-chosen-courts)
* [12. Mối Quan Hệ Nhà Cung Cấp Dịch Vụ](#12-service-provider-relationship)
* [13. Định Nghĩa](#13-definitions)
* [Tín Dụng](#credits)


## Thuật Ngữ Chính {#key-terms}

| Thuật Ngữ                                  | Giá Trị                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Thỏa Thuận</strong>                 | DPA này bổ sung cho [Điều Khoản Dịch Vụ](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| <strong>Bộ Xử Lý Phụ Được Phê Duyệt</strong>    | [Cloudflare](https://cloudflare.com) (Mỹ; nhà cung cấp DNS, mạng và bảo mật), [DataPacket](https://www.datapacket.com/) (Mỹ/Anh; nhà cung cấp hosting), [Digital Ocean](https://digitalocean.com) (Mỹ; nhà cung cấp hosting), [GitHub](https://github.com) (Mỹ; lưu trữ mã nguồn, CI/CD và quản lý dự án), [Vultr](https://www.vultr.com) (Mỹ; nhà cung cấp hosting), [Stripe](https://stripe.com) (Mỹ; bộ xử lý thanh toán), [PayPal](https://paypal.com) (Mỹ; bộ xử lý thanh toán) |
| <strong>Liên Hệ Bảo Mật Nhà Cung Cấp</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                         |
| <strong>Chính Sách Bảo Mật</strong>           | Xem [Chính Sách Bảo Mật của chúng tôi trên GitHub](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                             |
| <strong>Bang Áp Dụng</strong>           | Bang Delaware, Hoa Kỳ                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
## Thay đổi đối với Thỏa thuận {#changes-to-the-agreement}

Tài liệu này là bản phái sinh của [Điều khoản Chuẩn DPA của Common Paper (Phiên bản 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) và các thay đổi sau đã được thực hiện:

1. [Luật điều chỉnh và Tòa án được chọn](#11-governing-law-and-chosen-courts) đã được đưa vào như một phần bên dưới với `Bang điều chỉnh` được xác định ở trên.
2. [Mối quan hệ Nhà cung cấp dịch vụ](#12-service-provider-relationship) đã được đưa vào như một phần bên dưới.


## 1. Mối quan hệ giữa Bộ xử lý và Bộ xử lý phụ {#1-processor-and-subprocessor-relationships}

### 1. Nhà cung cấp là Bộ xử lý {#1-provider-as-processor}

Trong các trường hợp <strong>Khách hàng</strong> là Người kiểm soát Dữ liệu Cá nhân của Khách hàng, <strong>Nhà cung cấp</strong> sẽ được coi là Bộ xử lý đang Xử lý Dữ liệu Cá nhân thay mặt cho <strong>Khách hàng</strong>.

### 2. Nhà cung cấp là Bộ xử lý phụ {#2-provider-as-subprocessor}

Trong các trường hợp <strong>Khách hàng</strong> là Bộ xử lý Dữ liệu Cá nhân của Khách hàng, <strong>Nhà cung cấp</strong> sẽ được coi là Bộ xử lý phụ của Dữ liệu Cá nhân của Khách hàng.


## 2. Xử lý {#2-processing}

### 1. Chi tiết Xử lý {#1-processing-details}

Phụ lục I(B) trên Trang Bìa mô tả đối tượng, tính chất, mục đích và thời gian của việc Xử lý này, cũng như <strong>Danh mục Dữ liệu Cá nhân</strong> được thu thập và <strong>Danh mục Chủ thể Dữ liệu</strong>.

### 2. Hướng dẫn Xử lý {#2-processing-instructions}

<strong>Khách hàng</strong> chỉ dẫn <strong>Nhà cung cấp</strong> Xử lý Dữ liệu Cá nhân của Khách hàng: (a) để cung cấp và duy trì Dịch vụ; (b) như có thể được chỉ định thêm thông qua việc <strong>Khách hàng</strong> sử dụng Dịch vụ; (c) như được ghi trong <strong>Thỏa thuận</strong>; và (d) như được ghi trong bất kỳ hướng dẫn bằng văn bản nào khác do <strong>Khách hàng</strong> đưa ra và được <strong>Nhà cung cấp</strong> xác nhận về việc Xử lý Dữ liệu Cá nhân của Khách hàng theo DPA này. <strong>Nhà cung cấp</strong> sẽ tuân thủ các hướng dẫn này trừ khi bị cấm bởi các Luật áp dụng. <strong>Nhà cung cấp</strong> sẽ ngay lập tức thông báo cho <strong>Khách hàng</strong> nếu không thể tuân theo các hướng dẫn Xử lý. <strong>Khách hàng</strong> đã và sẽ chỉ đưa ra các hướng dẫn phù hợp với các Luật áp dụng.

### 3. Xử lý bởi Nhà cung cấp {#3-processing-by-provider}

<strong>Nhà cung cấp</strong> sẽ chỉ Xử lý Dữ liệu Cá nhân của Khách hàng theo DPA này, bao gồm các chi tiết trên Trang Bìa. Nếu <strong>Nhà cung cấp</strong> cập nhật Dịch vụ để cập nhật các sản phẩm, tính năng hoặc chức năng hiện có hoặc mới, <strong>Nhà cung cấp</strong> có thể thay đổi <strong>Danh mục Chủ thể Dữ liệu</strong>, <strong>Danh mục Dữ liệu Cá nhân</strong>, <strong>Dữ liệu thuộc Danh mục Đặc biệt</strong>, <strong>Hạn chế hoặc Biện pháp bảo vệ Dữ liệu thuộc Danh mục Đặc biệt</strong>, <strong>Tần suất Chuyển giao</strong>, <strong>Bản chất và Mục đích của việc Xử lý</strong>, và <strong>Thời gian Xử lý</strong> khi cần thiết để phản ánh các cập nhật bằng cách thông báo cho <strong>Khách hàng</strong> về các cập nhật và thay đổi.

### 4. Xử lý bởi Khách hàng {#4-customer-processing}

Khi <strong>Khách hàng</strong> là Bộ xử lý và <strong>Nhà cung cấp</strong> là Bộ xử lý phụ, <strong>Khách hàng</strong> sẽ tuân thủ tất cả các Luật áp dụng liên quan đến việc <strong>Khách hàng</strong> Xử lý Dữ liệu Cá nhân của Khách hàng. Thỏa thuận của <strong>Khách hàng</strong> với Người kiểm soát của mình cũng sẽ yêu cầu <strong>Khách hàng</strong> tuân thủ tất cả các Luật áp dụng liên quan đến <strong>Khách hàng</strong> với tư cách là Bộ xử lý. Ngoài ra, <strong>Khách hàng</strong> sẽ tuân thủ các yêu cầu về Bộ xử lý phụ trong thỏa thuận của <strong>Khách hàng</strong> với Người kiểm soát của mình.

### 5. Sự đồng ý cho việc Xử lý {#5-consent-to-processing}

<strong>Khách hàng</strong> đã tuân thủ và sẽ tiếp tục tuân thủ tất cả các Luật Bảo vệ Dữ liệu áp dụng liên quan đến việc cung cấp Dữ liệu Cá nhân của Khách hàng cho <strong>Nhà cung cấp</strong> và/hoặc Dịch vụ, bao gồm việc thực hiện tất cả các công bố, thu thập tất cả các sự đồng ý, cung cấp lựa chọn đầy đủ và thực hiện các biện pháp bảo vệ liên quan theo yêu cầu của các Luật Bảo vệ Dữ liệu áp dụng.
### 6. Các bên xử lý phụ {#6-subprocessors}

a. <strong>Nhà cung cấp</strong> sẽ không cung cấp, chuyển giao hoặc bàn giao bất kỳ Dữ liệu Cá nhân Khách hàng nào cho bên xử lý phụ trừ khi <strong>Khách hàng</strong> đã phê duyệt bên xử lý phụ đó. Danh sách hiện tại các <strong>Bên xử lý phụ được phê duyệt</strong> bao gồm danh tính của các bên xử lý phụ, quốc gia nơi họ đặt trụ sở, và các nhiệm vụ Xử lý dự kiến của họ. <strong>Nhà cung cấp</strong> sẽ thông báo cho <strong>Khách hàng</strong> ít nhất 10 ngày làm việc trước và bằng văn bản về bất kỳ thay đổi dự kiến nào đối với <strong>Bên xử lý phụ được phê duyệt</strong> dù là bổ sung hay thay thế một bên xử lý phụ, điều này cho phép <strong>Khách hàng</strong> có đủ thời gian để phản đối các thay đổi trước khi <strong>Nhà cung cấp</strong> bắt đầu sử dụng bên xử lý phụ mới. <strong>Nhà cung cấp</strong> sẽ cung cấp cho <strong>Khách hàng</strong> các thông tin cần thiết để <strong>Khách hàng</strong> có thể thực hiện quyền phản đối thay đổi đối với <strong>Bên xử lý phụ được phê duyệt</strong>. <strong>Khách hàng</strong> có 30 ngày kể từ khi nhận thông báo về thay đổi đối với <strong>Bên xử lý phụ được phê duyệt</strong> để phản đối, nếu không <strong>Khách hàng</strong> sẽ được coi là chấp nhận các thay đổi. Nếu <strong>Khách hàng</strong> phản đối thay đổi trong vòng 30 ngày kể từ khi nhận thông báo, <strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> sẽ hợp tác thiện chí để giải quyết sự phản đối hoặc quan ngại của <strong>Khách hàng</strong>.

b. Khi thuê một bên xử lý phụ, <strong>Nhà cung cấp</strong> sẽ có thỏa thuận bằng văn bản với bên xử lý phụ đảm bảo bên xử lý phụ chỉ truy cập và sử dụng Dữ liệu Cá nhân Khách hàng (i) trong phạm vi cần thiết để thực hiện các nghĩa vụ được thuê lại, và (ii) phù hợp với các điều khoản của <strong>Thỏa thuận</strong>.

c. Nếu GDPR áp dụng cho việc Xử lý Dữ liệu Cá nhân Khách hàng, (i) các nghĩa vụ bảo vệ dữ liệu được mô tả trong DPA này (như được đề cập tại Điều 28(3) của GDPR, nếu có) cũng được áp đặt lên bên xử lý phụ, và (ii) thỏa thuận của <strong>Nhà cung cấp</strong> với bên xử lý phụ sẽ bao gồm các nghĩa vụ này, bao gồm chi tiết về cách <strong>Nhà cung cấp</strong> và bên xử lý phụ của mình sẽ phối hợp để phản hồi các yêu cầu hoặc thắc mắc về việc Xử lý Dữ liệu Cá nhân Khách hàng. Ngoài ra, <strong>Nhà cung cấp</strong> sẽ chia sẻ, theo yêu cầu của <strong>Khách hàng</strong>, bản sao các thỏa thuận (bao gồm cả các sửa đổi) với các bên xử lý phụ của mình. Trong phạm vi cần thiết để bảo vệ bí mật kinh doanh hoặc các thông tin mật khác, bao gồm dữ liệu cá nhân, <strong>Nhà cung cấp</strong> có thể gạch bỏ nội dung thỏa thuận với bên xử lý phụ trước khi chia sẻ bản sao.

d. <strong>Nhà cung cấp</strong> vẫn chịu trách nhiệm hoàn toàn đối với tất cả các nghĩa vụ được thuê lại cho các bên xử lý phụ của mình, bao gồm các hành vi và thiếu sót của các bên xử lý phụ trong việc Xử lý Dữ liệu Cá nhân Khách hàng. <strong>Nhà cung cấp</strong> sẽ thông báo cho Khách hàng về bất kỳ sự thất bại nào của các bên xử lý phụ trong việc thực hiện nghĩa vụ quan trọng liên quan đến Dữ liệu Cá nhân Khách hàng theo thỏa thuận giữa <strong>Nhà cung cấp</strong> và bên xử lý phụ.


## 3. Các chuyển giao bị hạn chế {#3-restricted-transfers}

### 1. Ủy quyền {#1-authorization}

<strong>Khách hàng</strong> đồng ý rằng <strong>Nhà cung cấp</strong> có thể chuyển giao Dữ liệu Cá nhân Khách hàng ra ngoài EEA, Vương quốc Anh, hoặc các khu vực địa lý liên quan khác khi cần thiết để cung cấp Dịch vụ. Nếu <strong>Nhà cung cấp</strong> chuyển giao Dữ liệu Cá nhân Khách hàng đến một khu vực mà Ủy ban Châu Âu hoặc cơ quan giám sát liên quan chưa ban hành quyết định về mức độ bảo vệ dữ liệu tương đương, <strong>Nhà cung cấp</strong> sẽ thực hiện các biện pháp bảo vệ thích hợp cho việc chuyển giao Dữ liệu Cá nhân Khách hàng đến khu vực đó phù hợp với các Luật Bảo vệ Dữ liệu Áp dụng.

### 2. Chuyển giao ngoài EEA {#2-ex-eea-transfers}

<strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> đồng ý rằng nếu GDPR bảo vệ việc chuyển giao Dữ liệu Cá nhân Khách hàng, việc chuyển giao là từ <strong>Khách hàng</strong> trong EEA đến <strong>Nhà cung cấp</strong> ngoài EEA, và việc chuyển giao không được điều chỉnh bởi quyết định mức độ bảo vệ tương đương do Ủy ban Châu Âu ban hành, thì bằng việc ký kết DPA này, <strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> được coi là đã ký các SCC EEA và Phụ lục của chúng, được nhập làm phần tham chiếu. Bất kỳ việc chuyển giao nào như vậy được thực hiện theo các SCC EEA, được hoàn thiện như sau:
a. Module Hai (Bộ điều khiển đến Bộ xử lý) của EEA SCCs áp dụng khi <strong>Khách hàng</strong> là Bộ điều khiển và <strong>Nhà cung cấp</strong> đang Xử lý Dữ liệu Cá nhân của Khách hàng cho <strong>Khách hàng</strong> với tư cách là Bộ xử lý.

b. Module Ba (Bộ xử lý đến Bộ xử lý phụ) của EEA SCCs áp dụng khi <strong>Khách hàng</strong> là Bộ xử lý và <strong>Nhà cung cấp</strong> đang Xử lý Dữ liệu Cá nhân của Khách hàng thay mặt cho <strong>Khách hàng</strong> với tư cách là Bộ xử lý phụ.

c. Đối với mỗi module, các điều sau đây áp dụng (khi có thể):

1. Điều khoản kết nối tùy chọn trong Điều 7 không áp dụng;

2. Trong Điều 9, Lựa chọn 2 (ủy quyền bằng văn bản chung) áp dụng, và thời gian tối thiểu để thông báo trước về thay đổi Bộ xử lý phụ là 10 ngày làm việc;

3. Trong Điều 11, ngôn ngữ tùy chọn không áp dụng;

4. Tất cả các dấu ngoặc vuông trong Điều 13 được loại bỏ;

5. Trong Điều 17 (Lựa chọn 1), EEA SCCs sẽ được điều chỉnh bởi luật pháp của <strong>Quốc gia Thành viên Quản lý</strong>;

6. Trong Điều 18(b), các tranh chấp sẽ được giải quyết tại tòa án của <strong>Quốc gia Thành viên Quản lý</strong>; và

7. Trang Bìa của DPA này chứa thông tin yêu cầu trong Phụ lục I, Phụ lục II và Phụ lục III của EEA SCCs.

### 3. Chuyển giao ngoài Vương quốc Anh {#3-ex-uk-transfers}

<strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> đồng ý rằng nếu UK GDPR bảo vệ việc chuyển giao Dữ liệu Cá nhân của Khách hàng, việc chuyển giao này là từ <strong>Khách hàng</strong> trong Vương quốc Anh đến <strong>Nhà cung cấp</strong> ngoài Vương quốc Anh, và việc chuyển giao này không được điều chỉnh bởi quyết định đầy đủ do Bộ trưởng Bộ Ngoại giao Vương quốc Anh ban hành, thì bằng việc ký kết DPA này, <strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> được coi là đã ký Phụ lục UK và các Phụ lục của họ, được nhập bằng cách tham chiếu. Bất kỳ việc chuyển giao nào như vậy được thực hiện theo Phụ lục UK, được hoàn thành như sau:

a. Mục 3.2 của DPA này chứa thông tin yêu cầu trong Bảng 2 của Phụ lục UK.

b. Bảng 4 của Phụ lục UK được sửa đổi như sau: Không bên nào có thể chấm dứt Phụ lục UK như được quy định trong Mục 19 của Phụ lục UK; trong phạm vi ICO ban hành Phụ lục Được Phê duyệt sửa đổi theo Mục ‎18 của Phụ lục UK, các bên sẽ làm việc thiện chí để sửa đổi DPA này cho phù hợp.

c. Trang Bìa chứa thông tin yêu cầu bởi Phụ lục 1A, Phụ lục 1B, Phụ lục II và Phụ lục III của Phụ lục UK.

### 4. Các chuyển giao quốc tế khác {#4-other-international-transfers}

Đối với các chuyển giao Dữ liệu Cá nhân mà luật Thụy Sĩ (chứ không phải luật của bất kỳ quốc gia thành viên EEA hoặc Vương quốc Anh nào) áp dụng cho tính chất quốc tế của việc chuyển giao, các tham chiếu đến GDPR trong Điều 4 của EEA SCCs, trong phạm vi pháp lý yêu cầu, được sửa đổi để thay thế bằng Luật Bảo vệ Dữ liệu Liên bang Thụy Sĩ hoặc luật kế nhiệm của nó, và khái niệm cơ quan giám sát sẽ bao gồm Ủy viên Bảo vệ Dữ liệu và Thông tin Liên bang Thụy Sĩ.

## 4. Phản ứng sự cố bảo mật {#4-security-incident-response}

1. Khi nhận biết bất kỳ Sự cố Bảo mật nào, <strong>Nhà cung cấp</strong> sẽ: (a) thông báo cho <strong>Khách hàng</strong> mà không trì hoãn không cần thiết khi có thể, nhưng không muộn hơn 72 giờ sau khi nhận biết Sự cố Bảo mật; (b) cung cấp thông tin kịp thời về Sự cố Bảo mật khi biết hoặc khi được <strong>Khách hàng</strong> yêu cầu hợp lý; và (c) nhanh chóng thực hiện các bước hợp lý để ngăn chặn và điều tra Sự cố Bảo mật. Việc <strong>Nhà cung cấp</strong> thông báo hoặc phản ứng với Sự cố Bảo mật theo yêu cầu của DPA này sẽ không được hiểu là sự thừa nhận của <strong>Nhà cung cấp</strong> về bất kỳ lỗi hoặc trách nhiệm nào đối với Sự cố Bảo mật.

## 5. Kiểm toán & Báo cáo {#5-audit--reports}

### 1. Quyền kiểm toán {#1-audit-rights}

<strong>Nhà cung cấp</strong> sẽ cung cấp cho <strong>Khách hàng</strong> tất cả thông tin hợp lý cần thiết để chứng minh sự tuân thủ của mình với DPA này và <strong>Nhà cung cấp</strong> sẽ cho phép và hỗ trợ các cuộc kiểm toán, bao gồm cả kiểm tra bởi <strong>Khách hàng</strong>, để đánh giá sự tuân thủ của <strong>Nhà cung cấp</strong> với DPA này. Tuy nhiên, <strong>Nhà cung cấp</strong> có thể hạn chế quyền truy cập vào dữ liệu hoặc thông tin nếu việc truy cập của <strong>Khách hàng</strong> vào thông tin đó sẽ ảnh hưởng tiêu cực đến quyền sở hữu trí tuệ, nghĩa vụ bảo mật hoặc các nghĩa vụ khác theo Luật áp dụng của <strong>Nhà cung cấp</strong>. <strong>Khách hàng</strong> thừa nhận và đồng ý rằng họ chỉ thực hiện quyền kiểm toán theo DPA này và bất kỳ quyền kiểm toán nào được Luật Bảo vệ Dữ liệu Áp dụng cấp bằng cách chỉ đạo <strong>Nhà cung cấp</strong> tuân thủ các yêu cầu báo cáo và thẩm định dưới đây. <strong>Nhà cung cấp</strong> sẽ lưu giữ hồ sơ về sự tuân thủ DPA này trong 3 năm sau khi DPA kết thúc.
### 2. Báo Cáo Bảo Mật {#2-security-reports}

<strong>Khách hàng</strong> thừa nhận rằng <strong>Nhà cung cấp</strong> thường xuyên được kiểm toán theo các tiêu chuẩn được định nghĩa trong <strong>Chính sách Bảo mật</strong> bởi các kiểm toán viên bên thứ ba độc lập. Theo yêu cầu bằng văn bản, <strong>Nhà cung cấp</strong> sẽ cung cấp cho <strong>Khách hàng</strong>, trên cơ sở bảo mật, một bản tóm tắt Báo cáo hiện tại của mình để <strong>Khách hàng</strong> có thể xác minh sự tuân thủ của <strong>Nhà cung cấp</strong> với các tiêu chuẩn được định nghĩa trong <strong>Chính sách Bảo mật</strong>.

### 3. Thẩm Định An Ninh {#3-security-due-diligence}

Ngoài Báo cáo, <strong>Nhà cung cấp</strong> sẽ phản hồi các yêu cầu thông tin hợp lý do <strong>Khách hàng</strong> đưa ra để xác nhận sự tuân thủ của <strong>Nhà cung cấp</strong> với DPA này, bao gồm phản hồi các bảng câu hỏi về an ninh thông tin, thẩm định và kiểm toán, hoặc bằng cách cung cấp thêm thông tin về chương trình an ninh thông tin của mình. Tất cả các yêu cầu này phải được thực hiện bằng văn bản và gửi đến <strong>Liên hệ An ninh Nhà cung cấp</strong> và chỉ được thực hiện một lần mỗi năm.


## 6. Phối Hợp & Hợp Tác {#6-coordination--cooperation}

### 1. Phản Hồi Các Yêu Cầu {#1-response-to-inquiries}

Nếu <strong>Nhà cung cấp</strong> nhận được bất kỳ yêu cầu hoặc thắc mắc nào từ bất kỳ ai khác về việc Xử lý Dữ liệu Cá nhân của Khách hàng, <strong>Nhà cung cấp</strong> sẽ thông báo cho <strong>Khách hàng</strong> về yêu cầu đó và <strong>Nhà cung cấp</strong> sẽ không phản hồi yêu cầu mà không có sự đồng ý trước của <strong>Khách hàng</strong>. Ví dụ về các loại yêu cầu và thắc mắc này bao gồm lệnh của cơ quan tư pháp, hành chính hoặc cơ quan quản lý về Dữ liệu Cá nhân của Khách hàng mà việc thông báo cho <strong>Khách hàng</strong> không bị cấm bởi Pháp luật Áp dụng, hoặc yêu cầu từ chủ thể dữ liệu. Nếu được phép bởi Pháp luật Áp dụng, <strong>Nhà cung cấp</strong> sẽ tuân theo các hướng dẫn hợp lý của <strong>Khách hàng</strong> về các yêu cầu này, bao gồm cung cấp các cập nhật trạng thái và các thông tin khác được <strong>Khách hàng</strong> yêu cầu hợp lý. Nếu một chủ thể dữ liệu đưa ra yêu cầu hợp lệ theo các Luật Bảo vệ Dữ liệu Áp dụng để xóa hoặc từ chối việc <strong>Khách hàng</strong> cung cấp Dữ liệu Cá nhân cho <strong>Nhà cung cấp</strong>, <strong>Nhà cung cấp</strong> sẽ hỗ trợ <strong>Khách hàng</strong> thực hiện yêu cầu theo Luật Bảo vệ Dữ liệu Áp dụng. <strong>Nhà cung cấp</strong> sẽ hợp tác và cung cấp sự hỗ trợ hợp lý cho <strong>Khách hàng</strong>, với chi phí do <strong>Khách hàng</strong> chịu, trong bất kỳ phản hồi pháp lý hoặc hành động thủ tục nào do <strong>Khách hàng</strong> thực hiện để đáp lại yêu cầu của bên thứ ba về việc <strong>Nhà cung cấp</strong> Xử lý Dữ liệu Cá nhân của Khách hàng theo DPA này.

### 2. DPIAs và DTIAs {#2-dpias-and-dtias}

Nếu được yêu cầu bởi các Luật Bảo vệ Dữ liệu Áp dụng, <strong>Nhà cung cấp</strong> sẽ hỗ trợ hợp lý <strong>Khách hàng</strong> trong việc tiến hành bất kỳ đánh giá tác động bảo vệ dữ liệu hoặc đánh giá tác động chuyển giao dữ liệu nào được yêu cầu và tham vấn với các cơ quan bảo vệ dữ liệu liên quan, xem xét đến tính chất của việc Xử lý và Dữ liệu Cá nhân của Khách hàng.


## 7. Xóa Dữ liệu Cá nhân của Khách hàng {#7-deletion-of-customer-personal-data}

### 1. Xóa bởi Khách hàng {#1-deletion-by-customer}

<strong>Nhà cung cấp</strong> sẽ cho phép <strong>Khách hàng</strong> xóa Dữ liệu Cá nhân của Khách hàng theo cách phù hợp với chức năng của Dịch vụ. <strong>Nhà cung cấp</strong> sẽ tuân thủ chỉ dẫn này càng sớm càng tốt trong khả năng thực tế trừ khi việc lưu trữ thêm Dữ liệu Cá nhân của Khách hàng được yêu cầu bởi Pháp luật Áp dụng.

### 2. Xóa khi Hết hạn DPA {#2-deletion-at-dpa-expiration}

a. Sau khi DPA hết hạn, <strong>Nhà cung cấp</strong> sẽ trả lại hoặc xóa Dữ liệu Cá nhân của Khách hàng theo chỉ dẫn của <strong>Khách hàng</strong> trừ khi việc lưu trữ thêm Dữ liệu Cá nhân của Khách hàng được yêu cầu hoặc cho phép bởi Pháp luật Áp dụng. Nếu việc trả lại hoặc hủy bỏ là không khả thi hoặc bị cấm bởi Pháp luật Áp dụng, <strong>Nhà cung cấp</strong> sẽ nỗ lực hợp lý để ngăn chặn việc Xử lý thêm Dữ liệu Cá nhân của Khách hàng và sẽ tiếp tục bảo vệ Dữ liệu Cá nhân của Khách hàng còn lại trong quyền sở hữu, quản lý hoặc kiểm soát của mình. Ví dụ, Pháp luật Áp dụng có thể yêu cầu <strong>Nhà cung cấp</strong> tiếp tục lưu trữ hoặc Xử lý Dữ liệu Cá nhân của Khách hàng.
b. Nếu <strong>Khách hàng</strong> và <strong>Nhà cung cấp</strong> đã nhập các EEA SCCs hoặc Phụ lục Vương quốc Anh như một phần của DPA này, <strong>Nhà cung cấp</strong> chỉ cung cấp cho <strong>Khách hàng</strong> chứng nhận xóa Dữ liệu Cá nhân được mô tả trong Điều 8.1(d) và Điều 8.5 của EEA SCCs nếu <strong>Khách hàng</strong> yêu cầu.

## 8. Giới hạn Trách nhiệm {#8-limitation-of-liability}

### 1. Giới hạn Trách nhiệm và Miễn trừ Thiệt hại {#1-liability-caps-and-damages-waiver}

**Trong phạm vi tối đa được phép theo Luật Bảo vệ Dữ liệu Áp dụng, tổng trách nhiệm tích lũy của mỗi bên đối với bên kia phát sinh từ hoặc liên quan đến DPA này sẽ chịu sự miễn trừ, loại trừ và giới hạn trách nhiệm được nêu trong <strong>Thỏa thuận</strong>.**

### 2. Khiếu nại của Bên Liên quan {#2-related-party-claims}

**Bất kỳ khiếu nại nào đối với <strong>Nhà cung cấp</strong> hoặc các Công ty liên kết của họ phát sinh từ hoặc liên quan đến DPA này chỉ có thể được đưa ra bởi thực thể <strong>Khách hàng</strong> là bên trong <strong>Thỏa thuận</strong>.**

### 3. Ngoại lệ {#3-exceptions}

1. DPA này không giới hạn bất kỳ trách nhiệm nào đối với cá nhân về quyền bảo vệ dữ liệu của cá nhân đó theo Luật Bảo vệ Dữ liệu Áp dụng. Ngoài ra, DPA này không giới hạn bất kỳ trách nhiệm nào giữa các bên đối với các vi phạm EEA SCCs hoặc Phụ lục Vương quốc Anh.

## 9. Mâu thuẫn giữa các Tài liệu {#9-conflicts-between-documents}

1. DPA này là một phần của và bổ sung cho Thỏa thuận. Nếu có bất kỳ sự không nhất quán nào giữa DPA này, <strong>Thỏa thuận</strong>, hoặc bất kỳ phần nào của chúng, phần được liệt kê trước sẽ được ưu tiên hơn phần được liệt kê sau cho sự không nhất quán đó: (1) các EEA SCCs hoặc Phụ lục Vương quốc Anh, (2) DPA này, và sau đó (3) <strong>Thỏa thuận</strong>.

## 10. Thời hạn Thỏa thuận {#10-term-of-agreement}

DPA này sẽ bắt đầu khi <strong>Nhà cung cấp</strong> và <strong>Khách hàng</strong> đồng ý với Trang Bìa cho DPA và ký hoặc chấp nhận điện tử <strong>Thỏa thuận</strong> và sẽ tiếp tục cho đến khi <strong>Thỏa thuận</strong> hết hạn hoặc bị chấm dứt. Tuy nhiên, <strong>Nhà cung cấp</strong> và <strong>Khách hàng</strong> sẽ vẫn chịu các nghĩa vụ trong DPA này và Luật Bảo vệ Dữ liệu Áp dụng cho đến khi <strong>Khách hàng</strong> ngừng chuyển Dữ liệu Cá nhân của Khách hàng cho <strong>Nhà cung cấp</strong> và <strong>Nhà cung cấp</strong> ngừng Xử lý Dữ liệu Cá nhân của Khách hàng.

## 11. Luật Áp dụng và Tòa án Được Chọn {#11-governing-law-and-chosen-courts}

Bất chấp các điều khoản về luật áp dụng hoặc tương tự trong <strong>Thỏa thuận</strong>, tất cả các diễn giải và tranh chấp về DPA này sẽ được điều chỉnh bởi luật của <strong>Bang Quản lý</strong> mà không xét đến các quy định về xung đột luật pháp của nó. Ngoài ra, và bất chấp các điều khoản về lựa chọn diễn đàn, thẩm quyền hoặc tương tự trong <strong>Thỏa thuận</strong>, các bên đồng ý đưa bất kỳ vụ kiện, hành động hoặc thủ tục pháp lý nào về DPA này đến, và mỗi bên không thể rút lại việc chấp nhận thẩm quyền độc quyền của, các tòa án của <strong>Bang Quản lý</strong>.

## 12. Mối quan hệ Nhà cung cấp Dịch vụ {#12-service-provider-relationship}

Trong phạm vi Đạo luật Bảo mật Người tiêu dùng California, Cal. Civ. Code § 1798.100 et seq ("CCPA") áp dụng, các bên thừa nhận và đồng ý rằng <strong>Nhà cung cấp</strong> là nhà cung cấp dịch vụ và đang nhận Dữ liệu Cá nhân từ <strong>Khách hàng</strong> để cung cấp Dịch vụ như đã thỏa thuận trong <strong>Thỏa thuận</strong>, điều này cấu thành mục đích kinh doanh. <strong>Nhà cung cấp</strong> sẽ không bán bất kỳ Dữ liệu Cá nhân nào do <strong>Khách hàng</strong> cung cấp theo <strong>Thỏa thuận</strong>. Ngoài ra, <strong>Nhà cung cấp</strong> sẽ không giữ lại, sử dụng hoặc tiết lộ bất kỳ Dữ liệu Cá nhân nào do <strong>Khách hàng</strong> cung cấp theo <strong>Thỏa thuận</strong> ngoại trừ khi cần thiết để cung cấp Dịch vụ cho <strong>Khách hàng</strong>, như đã nêu trong <strong>Thỏa thuận</strong>, hoặc như được phép bởi Luật Bảo vệ Dữ liệu Áp dụng. <strong>Nhà cung cấp</strong> xác nhận rằng họ hiểu các hạn chế của đoạn này.
## 13. Định nghĩa {#13-definitions}

1. **"Pháp luật áp dụng"** có nghĩa là các luật, quy tắc, quy định, lệnh tòa án và các yêu cầu ràng buộc khác của cơ quan chính phủ có thẩm quyền liên quan áp dụng cho hoặc điều chỉnh một bên.

2. **"Luật Bảo vệ Dữ liệu Áp dụng"** có nghĩa là các Pháp luật Áp dụng điều chỉnh cách Dịch vụ có thể xử lý hoặc sử dụng thông tin cá nhân, dữ liệu cá nhân, thông tin nhận dạng cá nhân hoặc thuật ngữ tương tự khác của một cá nhân.

3. **"Bên kiểm soát"** sẽ có ý nghĩa được quy định trong Luật Bảo vệ Dữ liệu Áp dụng cho công ty xác định mục đích và phạm vi Xử lý Dữ liệu Cá nhân.

4. **"Trang Bìa"** có nghĩa là tài liệu được các bên ký hoặc chấp nhận điện tử, bao gồm các Điều khoản Chuẩn DPA này và xác định <strong>Nhà cung cấp</strong>, <strong>Khách hàng</strong>, cùng chủ đề và chi tiết của việc xử lý dữ liệu.

5. **"Dữ liệu Cá nhân của Khách hàng"** có nghĩa là Dữ liệu Cá nhân mà <strong>Khách hàng</strong> tải lên hoặc cung cấp cho <strong>Nhà cung cấp</strong> như một phần của Dịch vụ và được điều chỉnh bởi DPA này.

6. **"DPA"** có nghĩa là các Điều khoản Chuẩn DPA này, Trang Bìa giữa <strong>Nhà cung cấp</strong> và <strong>Khách hàng</strong>, cùng các chính sách và tài liệu được tham chiếu hoặc đính kèm trong Trang Bìa.

7. **"EEA SCCs"** có nghĩa là các điều khoản hợp đồng chuẩn được đính kèm theo Quyết định Thi hành 2021/914 ngày 4 tháng 6 năm 2021 của Ủy ban Châu Âu về các điều khoản hợp đồng chuẩn cho việc chuyển dữ liệu cá nhân sang các nước thứ ba theo Quy định (EU) 2016/679 của Nghị viện Châu Âu và Hội đồng Châu Âu.

8. **"Khu vực Kinh tế Châu Âu"** hoặc **"EEA"** có nghĩa là các quốc gia thành viên của Liên minh Châu Âu, Na Uy, Iceland và Liechtenstein.

9. **"GDPR"** có nghĩa là Quy định Liên minh Châu Âu 2016/679 được thực thi bởi luật địa phương tại quốc gia thành viên EEA liên quan.

10. **"Dữ liệu Cá nhân"** sẽ có ý nghĩa được quy định trong Luật Bảo vệ Dữ liệu Áp dụng cho thông tin cá nhân, dữ liệu cá nhân hoặc thuật ngữ tương tự khác.

11. **"Xử lý"** hoặc **"Xử lý Dữ liệu"** sẽ có ý nghĩa được quy định trong Luật Bảo vệ Dữ liệu Áp dụng cho bất kỳ việc sử dụng nào, hoặc thực hiện thao tác máy tính nào trên Dữ liệu Cá nhân, bao gồm cả bằng phương pháp tự động.

12. **"Bên xử lý"** sẽ có ý nghĩa được quy định trong Luật Bảo vệ Dữ liệu Áp dụng cho công ty xử lý Dữ liệu Cá nhân thay mặt cho Bên kiểm soát.

13. **"Báo cáo"** có nghĩa là các báo cáo kiểm toán được chuẩn bị bởi công ty khác theo các tiêu chuẩn được định nghĩa trong Chính sách Bảo mật thay mặt cho Nhà cung cấp.

14. **"Chuyển giao bị hạn chế"** có nghĩa là (a) khi GDPR áp dụng, việc chuyển dữ liệu cá nhân từ EEA sang một quốc gia ngoài EEA không thuộc phạm vi quyết định về sự đầy đủ của Ủy ban Châu Âu; và (b) khi UK GDPR áp dụng, việc chuyển dữ liệu cá nhân từ Vương quốc Anh sang bất kỳ quốc gia nào khác không thuộc phạm vi các quy định về sự đầy đủ được ban hành theo Mục 17A của Đạo luật Bảo vệ Dữ liệu Vương quốc Anh 2018.

15. **"Sự cố Bảo mật"** có nghĩa là Vi phạm Dữ liệu Cá nhân như được định nghĩa trong Điều 4 của GDPR.

16. **"Dịch vụ"** có nghĩa là sản phẩm và/hoặc dịch vụ được mô tả trong <strong>Thỏa thuận</strong>.

17. **"Dữ liệu thuộc Danh mục Đặc biệt"** sẽ có ý nghĩa được quy định trong Điều 9 của GDPR.

18. **"Bên xử lý phụ"** sẽ có ý nghĩa được quy định trong Luật Bảo vệ Dữ liệu Áp dụng cho công ty mà với sự chấp thuận và đồng ý của Bên kiểm soát, hỗ trợ Bên xử lý trong việc Xử lý Dữ liệu Cá nhân thay mặt cho Bên kiểm soát.

19. **"UK GDPR"** có nghĩa là Quy định Liên minh Châu Âu 2016/679 được thực thi bởi mục 3 của Đạo luật Rút khỏi Liên minh Châu Âu (Withdrawal) của Vương quốc Anh năm 2018 tại Vương quốc Anh.

20. **"Phụ lục UK"** có nghĩa là phụ lục chuyển giao dữ liệu quốc tế cho EEA SCCs do Ủy viên Thông tin ban hành cho các Bên thực hiện Chuyển giao bị hạn chế theo S119A(1) Đạo luật Bảo vệ Dữ liệu 2018.


## Credits {#credits}

Tài liệu này là bản phái sinh của [Common Paper DPA Standard Terms (Phiên bản 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) và được cấp phép theo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
