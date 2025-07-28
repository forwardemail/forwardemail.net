# Kendinden Barındırılan Sürümler {#self-hosted-releases}

Bu bölüm, ForwardEmail'in kendi kendine barındırılan çözümü için CI/CD iş akışını belgeliyor ve Docker görüntülerinin nasıl oluşturulduğunu, yayınlandığını ve dağıtıldığını açıklıyor.

## İçindekiler {#table-of-contents}

* [Genel Bakış](#overview)
* [CI/CD İş Akışı](#cicd-workflow)
  * [GitHub Eylemleri İş Akışı](#github-actions-workflow)
  * [Docker Görüntü Yapısı](#docker-image-structure)
* [Dağıtım Süreci](#deployment-process)
  * [Kurulum](#installation)
  * [Docker Compose Yapılandırması](#docker-compose-configuration)
* [Bakım Özellikleri](#maintenance-features)
  * [Otomatik Güncellemeler](#automatic-updates)
  * [Yedekleme ve Geri Yükleme](#backup-and-restore)
  * [Sertifika Yenileme](#certificate-renewal)
* [Sürümleme](#versioning)
* [Görüntülere Erişim](#accessing-images)
* [Katkıda bulunmak](#contributing)

## Genel Bakış {#overview}

ForwardEmail'in kendi kendine barındırılan çözümü, yeni bir sürüm oluşturulduğunda Docker görüntülerini otomatik olarak oluşturmak ve yayınlamak için GitHub Actions'ı kullanır. Bu görüntüler daha sonra kullanıcıların, sağlanan kurulum betiğini kullanarak kendi sunucularına dağıtmaları için kullanılabilir.

> \[!NOTE]
> Ayrıca [kendi kendine barındırılan blog](https://forwardemail.net/blog/docs/self-hosted-solution) ve [kendi kendine barındırılan geliştirici kılavuzu](https://forwardemail.net/self-hosted) versiyonlarımız da mevcut.
>
> Daha ayrıntılı adım adım versiyonlar için [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) veya [Debian](https://forwardemail.net/guides/selfhosted-on-debian) tabanlı kılavuzlara bakın.

## CI/CD İş Akışı {#cicd-workflow}

### GitHub Eylemleri İş Akışı {#github-actions-workflow}

Kendi kendine barındırılan Docker görüntüsü oluşturma ve yayınlama süreci `.github/workflows/docker-image-build-publish.yml`'da tanımlanmıştır. Bu iş akışı:

1. **Tetikleyiciler**: Yeni bir GitHub Sürümü yayınlandığında otomatik olarak çalışır
2. **Ortam**: Node.js 18.20.4 ile Ubuntu'da çalışır
3. **Derleme İşlemi**:
* Depo kodunu kontrol eder
* Çoklu platform derlemeleri için Docker Buildx'i ayarlar
* GitHub Container Registry'ye (GHCR) giriş yapar
* Kendi kendine barındırılan dağıtım için şemayı günceller
* `self-hosting/Dockerfile-selfhosted` kullanarak Docker imajını oluşturur
* İmajı hem sürüm numarası hem de `latest` ile etiketler
* İmajları GitHub Container Registry'ye gönderir

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

### Docker Görüntü Yapısı {#docker-image-structure}

Docker görüntüsü `self-hosting/Dockerfile-selfhosted`'da tanımlanan çok aşamalı bir yaklaşım kullanılarak oluşturulur:

1. **Builder Aşaması**:
* Temel görüntü olarak Node.js 20'yi kullanır
* `SELF_HOSTED=true` ortam değişkenini ayarlar
* Bağımlılıkları pnpm ile yükler
* Uygulamayı üretim modunda derler

2. **Son Aşama**:
* Daha sade bir Node.js 20 imajı kullanır
* Yalnızca gerekli sistem bağımlılıklarını yükler
* Veri depolama için gerekli dizinleri oluşturur
* Oluşturulan uygulamayı oluşturucu aşamasından kopyalar

Bu yaklaşım, son görüntünün boyut ve güvenlik açısından optimize edilmesini sağlar.

## Dağıtım Süreci {#deployment-process}

### Kurulumu {#installation}

Kullanıcılar, sağlanan kurulum betiğini kullanarak kendi barındırdıkları çözümü dağıtabilirler:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Bu betik:

1. Depoyu klonlar
2. Ortamı kurar
3. DNS ve güvenlik duvarı ayarlarını yapılandırır
4. SSL sertifikaları oluşturur
5. En son Docker imajlarını çeker
6. Docker Compose kullanarak hizmetleri başlatır

### Docker Compose Yapılandırması {#docker-compose-configuration}

`docker-compose-self-hosted.yml` dosyası, kendi kendine barındırılan çözüm için gereken tüm hizmetleri tanımlar:

* **Web**: Ana web arayüzü
* **API**: Programatik erişim için API sunucusu
* **SMTP**: E-posta gönderme hizmeti
* **IMAP/POP3**: E-posta alma hizmetleri
* **MX**: Posta değişim hizmeti
* **CalDAV**: Takvim hizmeti
* **CardDAV**: Kişiler hizmeti
* **MongoDB**: Kullanıcı verilerini depolamak için veritabanı
* **Redis**: Bellek içi veri deposu
* **SQLite**: E-postaları depolamak için veritabanı

Her servis aynı Docker imajını kullanır ancak farklı giriş noktaları kullanır, bu da bakımın basitleştirilmesini sağlarken modüler bir mimariye olanak tanır.

## Bakım Özellikleri {#maintenance-features}

Kendinden barındırılan çözüm çeşitli bakım özelliklerini içerir:

### Otomatik Güncellemeler {#automatic-updates}

Kullanıcılar aşağıdakileri sağlayacak otomatik güncellemeleri etkinleştirebilir:

* Her gece en son Docker imajını çekin
* Hizmetleri güncellenen imajla yeniden başlatın
* Güncelleme işlemini kaydedin

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Yedekleme ve Geri Yükleme {#backup-and-restore}

Kurulum şu seçenekleri sunar:

* S3 uyumlu depolamaya düzenli yedekleme yapılandırma
* MongoDB, Redis ve SQLite verilerinin yedeklenmesi
* Arıza durumunda yedeklerden geri yükleme

### Sertifika Yenileme {#certificate-renewal}

SSL sertifikaları otomatik olarak şu seçeneklerle yönetilir:

* Kurulum sırasında yeni sertifikalar oluşturun
* Gerektiğinde sertifikaları yenileyin
* E-posta kimlik doğrulaması için DKIM'i yapılandırın

## Sürümü {#versioning}

Her GitHub Sürümü, şu etiketlerle etiketlenmiş yeni bir Docker görüntüsü oluşturur:

1. Belirli sürüm (örneğin, `v1.0.0`)
2. En son sürüm için `latest` etiketi

Kullanıcılar istikrar için belirli bir sürümü kullanmayı veya her zaman en yeni özelliklere sahip olmak için `latest` etiketini kullanmayı seçebilirler.

## Görüntülere Erişim {#accessing-images}

Docker görüntüleri şu adreste herkese açıktır:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (örnek sürüm etiketi)

Bu görselleri çekmek için herhangi bir kimlik doğrulamaya gerek yoktur.

## {#contributing}'e Katkıda Bulunuyor

Kendi kendine barındırılan çözüme katkıda bulunmak için:

1. `self-hosting` dizinindeki ilgili dosyalarda değişiklikler yapın
2. Sağlanan `setup.sh` betiğini kullanarak yerel olarak veya Ubuntu tabanlı bir VPS'de test edin
3. Bir çekme isteği gönderin
4. Birleştirme ve yeni bir sürüm oluşturulduktan sonra, CI iş akışı güncellenmiş Docker imajını otomatik olarak derleyip yayınlayacaktır.