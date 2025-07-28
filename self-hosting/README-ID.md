# Self-Hosted Releases {#self-hosted-releases}

Bagian ini mendokumentasikan alur kerja CI/CD untuk solusi yang dihosting sendiri oleh ForwardEmail, yang menjelaskan cara gambar Docker dibuat, diterbitkan, dan disebarkan.

## Table of Contents {#table-of-contents}

* [Ringkasan](#overview)
* [Alur Kerja CI/CD](#cicd-workflow)
  * [Alur Kerja Tindakan GitHub](#github-actions-workflow)
  * [Struktur Gambar Docker](#docker-image-structure)
* [Proses Penyebaran](#deployment-process)
  * [Instalasi](#installation)
  * [Konfigurasi Docker Compose](#docker-compose-configuration)
* [Fitur Perawatan](#maintenance-features)
  * [Pembaruan Otomatis](#automatic-updates)
  * [Pencadangan dan Pemulihan](#backup-and-restore)
  * [Perpanjangan Sertifikat](#certificate-renewal)
* [Pembuatan versi](#versioning)
* [Mengakses Gambar](#accessing-images)
* [Berkontribusi](#contributing)

## Overview {#overview}

Solusi ForwardEmail yang dihosting sendiri menggunakan GitHub Actions untuk secara otomatis membuat dan menerbitkan gambar Docker setiap kali rilis baru dibuat. Gambar-gambar ini kemudian tersedia bagi pengguna untuk disebarkan di server mereka sendiri menggunakan skrip penyiapan yang disediakan.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

Proses pembuatan dan penerbitan citra Docker yang dihosting sendiri dijelaskan dalam `.github/workflows/docker-image-build-publish.yml`. Alur kerja ini:

1. **Pemicu**: Berjalan otomatis ketika Rilis GitHub baru diterbitkan
2. **Lingkungan**: Berjalan di Ubuntu dengan Node.js 18.20.4
3. **Proses Build**:
* Memeriksa kode repositori
* Menyiapkan Docker Buildx untuk build multi-platform
* Masuk ke GitHub Container Registry (GHCR)
* Memperbarui skema untuk penerapan yang dihosting sendiri
* Membangun citra Docker menggunakan `self-hosting/Dockerfile-selfhosted`
* Menandai citra dengan versi rilis dan `latest`
* Mengirim citra ke GitHub Container Registry

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

### Struktur Gambar Docker {#docker-image-structure}

Citra Docker dibangun menggunakan pendekatan multi-tahap yang didefinisikan dalam `self-hosting/Dockerfile-selfhosted`:

1. **Tahap Builder**:
* Menggunakan Node.js 20 sebagai image dasar
* Menetapkan variabel lingkungan `SELF_HOSTED=true`
* Menginstal dependensi dengan pnpm
* Membangun aplikasi dalam mode produksi

2. **Tahap Akhir**:
* Menggunakan image Node.js 20 yang lebih ramping
* Menginstal hanya dependensi sistem yang diperlukan
* Membuat direktori yang diperlukan untuk penyimpanan data
* Menyalin aplikasi yang dibangun dari tahap pembangun

Pendekatan ini memastikan gambar akhir dioptimalkan untuk ukuran dan keamanan.

## Proses Penyebaran {#deployment-process}

### Instalasi {#installation}

Pengguna dapat menerapkan solusi yang dihosting sendiri menggunakan skrip pengaturan yang disediakan:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Skrip ini:

1. Mengkloning repositori
2. Menyiapkan lingkungan
3. Mengonfigurasi pengaturan DNS dan firewall
4. Membuat sertifikat SSL
5. Mengambil gambar Docker terbaru
6. Memulai layanan menggunakan Docker Compose

### Konfigurasi Docker Compose {#docker-compose-configuration}

File `docker-compose-self-hosted.yml` mendefinisikan semua layanan yang diperlukan untuk solusi yang dihosting sendiri:

* **Web**: Antarmuka web utama
* **API**: Server API untuk akses terprogram
* **SMTP**: Layanan pengiriman email
* **IMAP/POP3**: Layanan pengambilan email
* **MX**: Layanan pertukaran email
* **CalDAV**: Layanan kalender
* **CardDAV**: Layanan kontak
* **MongoDB**: Basis data untuk menyimpan data pengguna
* **Redis**: Penyimpanan data dalam memori
* **SQLite**: Basis data untuk menyimpan email

Setiap layanan menggunakan citra Docker yang sama tetapi dengan titik masuk yang berbeda, memungkinkan arsitektur modular sekaligus menyederhanakan pemeliharaan.

## Fitur Pemeliharaan {#maintenance-features}

Solusi yang dihosting sendiri mencakup beberapa fitur pemeliharaan:

### Pembaruan Otomatis {#automatic-updates}

Pengguna dapat mengaktifkan pembaruan otomatis yang akan:

* Tarik gambar Docker terbaru setiap malam
* Mulai ulang layanan dengan gambar yang diperbarui
* Catat proses pembaruan

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Pencadangan dan Pemulihan {#backup-and-restore}

Pengaturan ini menyediakan opsi untuk:

* Mengonfigurasi cadangan rutin ke penyimpanan yang kompatibel dengan S3
* Mencadangkan data MongoDB, Redis, dan SQLite
* Memulihkan dari cadangan jika terjadi kegagalan

### Perpanjangan Sertifikat {#certificate-renewal}

Sertifikat SSL dikelola secara otomatis dengan opsi untuk:

* Hasilkan sertifikat baru selama penyiapan
* Perbarui sertifikat bila diperlukan
* Konfigurasikan DKIM untuk autentikasi email

## Versi {#versioning}

Setiap Rilis GitHub membuat gambar Docker baru yang diberi tag dengan:

1. Versi rilis spesifik (misalnya, `v1.0.0`)
2. Tag `latest` untuk rilis terbaru

Pengguna dapat memilih untuk menggunakan versi tertentu untuk stabilitas atau tag `latest` untuk selalu mendapatkan fitur terbaru.

## Mengakses Gambar {#accessing-images}

Gambar Docker tersedia untuk umum di:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (contoh tag versi)

Tidak diperlukan autentikasi untuk menarik gambar-gambar ini.

## Berkontribusi {#contributing}

Untuk berkontribusi pada solusi yang dihosting sendiri:

1. Lakukan perubahan pada berkas terkait di direktori `self-hosting`
2. Uji secara lokal atau di VPS berbasis Ubuntu menggunakan skrip `setup.sh` yang disediakan
3. Ajukan permintaan tarik
4. Setelah digabungkan dan rilis baru dibuat, alur kerja CI akan secara otomatis membangun dan menerbitkan citra Docker yang diperbarui.