# Bản phát hành tự lưu trữ {#self-hosted-releases}

Phần này ghi lại quy trình làm việc CI/CD cho giải pháp tự lưu trữ của ForwardEmail, giải thích cách hình ảnh Docker được xây dựng, xuất bản và triển khai.

## Mục lục {#table-of-contents}

* [Tổng quan](#overview)
* [Quy trình làm việc CI/CD](#cicd-workflow)
  * [Quy trình làm việc của GitHub Actions](#github-actions-workflow)
  * [Cấu trúc hình ảnh Docker](#docker-image-structure)
* [Quy trình triển khai](#deployment-process)
  * [Cài đặt](#installation)
  * [Cấu hình Docker Compose](#docker-compose-configuration)
* [Tính năng bảo trì](#maintenance-features)
  * [Cập nhật tự động](#automatic-updates)
  * [Sao lưu và khôi phục](#backup-and-restore)
  * [Gia hạn chứng chỉ](#certificate-renewal)
* [Phiên bản](#versioning)
* [Truy cập hình ảnh](#accessing-images)
* [Đóng góp](#contributing)

## Tổng quan về {#overview}

Giải pháp tự lưu trữ của ForwardEmail sử dụng GitHub Actions để tự động xây dựng và xuất bản hình ảnh Docker mỗi khi có bản phát hành mới. Những hình ảnh này sau đó sẽ có sẵn để người dùng triển khai trên máy chủ của riêng họ bằng tập lệnh thiết lập được cung cấp.

> \[!NOTE]
> Ngoài ra còn có [blog tự lưu trữ](https://forwardemail.net/blog/docs/self-hosted-solution) và [hướng dẫn dành cho nhà phát triển tự lưu trữ](https://forwardemail.net/self-hosted)
>
> Để biết thêm chi tiết về các phiên bản hướng dẫn từng bước, hãy xem hướng dẫn [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) hoặc [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Quy trình làm việc CI/CD {#cicd-workflow}

### Quy trình làm việc GitHub Actions {#github-actions-workflow}

Quy trình xây dựng và xuất bản hình ảnh Docker tự lưu trữ được định nghĩa trong `.github/workflows/docker-image-build-publish.yml`. Quy trình làm việc này:

1. **Triggers**: Tự động chạy khi có Bản phát hành GitHub mới được xuất bản
2. **Môi trường**: Chạy trên Ubuntu với Node.js 18.20.4
3. **Quy trình xây dựng**:
* Kiểm tra mã kho lưu trữ
* Thiết lập Docker Buildx cho các bản dựng đa nền tảng
* Đăng nhập vào GitHub Container Registry (GHCR)
* Cập nhật lược đồ cho việc triển khai tự lưu trữ
* Xây dựng hình ảnh Docker bằng `self-hosting/Dockerfile-selfhosted`
* Gắn thẻ hình ảnh bằng cả phiên bản phát hành và `latest`
* Đẩy hình ảnh lên GitHub Container Registry

```yaml
# Key workflow steps
name: Build and Publish Self-Hosted Docker Image

on:
  release:
    types: [published]  # Trigger on new releases

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      # Setup steps...

      # Build and publish Docker image
      - name: Build / Publish Docker image to GitHub Container Registry
        run: |
          IMAGE_NAME=ghcr.io/${{ github.repository }}-selfhosted:${{ github.ref_name }}
          docker build -f self-hosting/Dockerfile-selfhosted -t $IMAGE_NAME .
          docker tag $IMAGE_NAME ghcr.io/${{ github.repository }}-selfhosted:latest
          docker push $IMAGE_NAME
          docker push ghcr.io/${{ github.repository }}-selfhosted:latest
```

### Cấu trúc hình ảnh Docker {#docker-image-structure}

Hình ảnh Docker được xây dựng bằng cách sử dụng phương pháp nhiều giai đoạn được xác định trong `self-hosting/Dockerfile-selfhosted`:

1. **Giai đoạn xây dựng**:
* Sử dụng Node.js 20 làm ảnh cơ sở
* Đặt biến môi trường `SELF_HOSTED=true`
* Cài đặt các phần phụ thuộc bằng pnpm
* Xây dựng ứng dụng ở chế độ sản xuất

2. **Giai đoạn cuối cùng**:
* Sử dụng ảnh Node.js 20 gọn nhẹ hơn
* Chỉ cài đặt các phụ thuộc hệ thống cần thiết
* Tạo các thư mục cần thiết để lưu trữ dữ liệu
* Sao chép ứng dụng đã xây dựng từ giai đoạn xây dựng

Phương pháp này đảm bảo hình ảnh cuối cùng được tối ưu hóa về kích thước và bảo mật.

## Quy trình triển khai {#deployment-process}

### Cài đặt {#installation}

Người dùng có thể triển khai giải pháp tự lưu trữ bằng cách sử dụng tập lệnh thiết lập được cung cấp:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Kịch bản này:

1. Sao chép kho lưu trữ
2. Thiết lập môi trường
3. Cấu hình DNS và cài đặt tường lửa
4. Tạo chứng chỉ SSL
5. Tải xuống các hình ảnh Docker mới nhất
6. Khởi động các dịch vụ bằng Docker Compose

### Cấu hình Docker Compose {#docker-compose-configuration}

Tệp `docker-compose-self-hosted.yml` xác định tất cả các dịch vụ cần thiết cho giải pháp tự lưu trữ:

* **Web**: Giao diện web chính
* **API**: Máy chủ API để truy cập theo chương trình
* **SMTP**: Dịch vụ gửi email
* **IMAP/POP3**: Dịch vụ truy xuất email
* **MX**: Dịch vụ trao đổi thư
* **CalDAV**: Dịch vụ lịch
* **CardDAV**: Dịch vụ danh bạ
* **MongoDB**: Cơ sở dữ liệu lưu trữ dữ liệu người dùng
* **Redis**: Kho dữ liệu trong bộ nhớ
* **SQLite**: Cơ sở dữ liệu lưu trữ email

Mỗi dịch vụ đều sử dụng cùng một hình ảnh Docker nhưng có các điểm vào khác nhau, cho phép sử dụng kiến trúc mô-đun đồng thời đơn giản hóa việc bảo trì.

## Tính năng bảo trì {#maintenance-features}

Giải pháp tự lưu trữ bao gồm một số tính năng bảo trì:

### Cập nhật tự động {#automatic-updates}

Người dùng có thể bật tính năng cập nhật tự động để:

* Tải ảnh Docker mới nhất hàng đêm
* Khởi động lại dịch vụ với ảnh đã cập nhật
* Ghi lại quá trình cập nhật

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Sao lưu và khôi phục {#backup-and-restore}

Thiết lập này cung cấp các tùy chọn cho:

* Cấu hình sao lưu thường xuyên vào bộ lưu trữ tương thích S3
* Sao lưu dữ liệu MongoDB, Redis và SQLite
* Khôi phục từ bản sao lưu trong trường hợp lỗi

### Gia hạn chứng chỉ {#certificate-renewal}

Chứng chỉ SSL được quản lý tự động với các tùy chọn sau:

* Tạo chứng chỉ mới trong quá trình thiết lập
* Gia hạn chứng chỉ khi cần thiết
* Cấu hình DKIM để xác thực email

## Phiên bản {#versioning}

Mỗi bản phát hành GitHub sẽ tạo một hình ảnh Docker mới được gắn thẻ:

1. Phiên bản phát hành cụ thể (ví dụ: `v1.0.0`)
2. Thẻ `latest` cho phiên bản phát hành gần đây nhất

Người dùng có thể chọn sử dụng phiên bản cụ thể để đảm bảo tính ổn định hoặc thẻ `latest` để luôn nhận được các tính năng mới nhất.

## Đang truy cập hình ảnh {#accessing-images}

Hình ảnh Docker có sẵn công khai tại:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (thẻ phiên bản ví dụ)

Không cần xác thực để kéo những hình ảnh này.

## Đóng góp {#contributing}

Để đóng góp vào giải pháp tự lưu trữ:

1. Thực hiện thay đổi đối với các tệp liên quan trong thư mục `self-hosting`
2. Kiểm tra cục bộ hoặc trên VPS chạy Ubuntu bằng tập lệnh `setup.sh` được cung cấp
3. Gửi yêu cầu kéo
4. Sau khi hợp nhất và tạo bản phát hành mới, quy trình CI sẽ tự động xây dựng và xuất bản hình ảnh Docker đã cập nhật