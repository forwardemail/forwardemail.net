# Self-Hosted Releases {#self-hosted-releases}

หัวข้อนี้อธิบายเวิร์กโฟลว์ CI/CD สำหรับโซลูชันโฮสต์ด้วยตนเองของ ForwardEmail โดยอธิบายถึงวิธีการสร้าง เผยแพร่ และปรับใช้ภาพ Docker

## Table of Contents {#table-of-contents}

* [ภาพรวม](#overview)
* [เวิร์กโฟลว์ CI/CD](#cicd-workflow)
  * [เวิร์กโฟลว์การดำเนินการของ GitHub](#github-actions-workflow)
  * [โครงสร้างภาพ Docker](#docker-image-structure)
* [กระบวนการปรับใช้](#deployment-process)
  * [การติดตั้ง](#installation)
  * [การกำหนดค่า Docker Compose](#docker-compose-configuration)
* [คุณสมบัติการบำรุงรักษา](#maintenance-features)
  * [การอัพเดทอัตโนมัติ](#automatic-updates)
  * [การสำรองข้อมูลและกู้คืน](#backup-and-restore)
  * [การต่ออายุใบรับรอง](#certificate-renewal)
* [การกำหนดเวอร์ชัน](#versioning)
* [การเข้าถึงรูปภาพ](#accessing-images)
* [การมีส่วนสนับสนุน](#contributing)

## Overview {#overview}

โซลูชันโฮสต์ด้วยตนเองของ ForwardEmail ใช้ GitHub Actions เพื่อสร้างและเผยแพร่ภาพ Docker โดยอัตโนมัติทุกครั้งที่มีการสร้างเวอร์ชันใหม่ จากนั้นผู้ใช้จะสามารถใช้ภาพเหล่านี้เพื่อปรับใช้บนเซิร์ฟเวอร์ของตนเองโดยใช้สคริปต์การตั้งค่าที่ให้มา

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

กระบวนการสร้างและเผยแพร่อิมเมจ Docker ที่โฮสต์ด้วยตนเองถูกกำหนดไว้ใน `.github/workflows/docker-image-build-publish.yml` เวิร์กโฟลว์นี้:

1. **ทริกเกอร์**: จะทำงานโดยอัตโนมัติเมื่อมีการเผยแพร่ GitHub เวอร์ชันใหม่
2. **สภาพแวดล้อม**: รันบน Ubuntu ด้วย Node.js 18.20.4
3. **กระบวนการสร้าง**:
* ตรวจสอบโค้ดของที่เก็บ
* ตั้งค่า Docker Buildx สำหรับการสร้างแบบหลายแพลตฟอร์ม
* ล็อกอินเข้าสู่ GitHub Container Registry (GHCR)
* อัปเดต schema สำหรับการปรับใช้แบบโฮสต์ด้วยตนเอง
* สร้างอิมเมจ Docker โดยใช้ `self-hosting/Dockerfile-selfhosted`
* แท็กอิมเมจด้วยทั้งเวอร์ชันที่เผยแพร่และ `latest`
* พุชอิมเมจไปยัง GitHub Container Registry

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

### โครงสร้างภาพ Docker {#docker-image-structure}

อิมเมจ Docker ถูกสร้างขึ้นโดยใช้วิธีการหลายขั้นตอนตามที่กำหนดไว้ใน `self-hosting/Dockerfile-selfhosted`:

1. **ขั้นตอนการสร้าง**:
* ใช้ Node.js 20 เป็นอิมเมจพื้นฐาน
* ตั้งค่าตัวแปรสภาพแวดล้อม `SELF_HOSTED=true`
* ติดตั้ง dependencies ด้วย pnpm
* สร้างแอปพลิเคชันในโหมดการผลิต

2. **ขั้นตอนสุดท้าย**:
* ใช้ภาพ Node.js 20 ที่เล็กกว่า
* ติดตั้งเฉพาะส่วนที่ต้องพึ่งพาของระบบ
* สร้างไดเร็กทอรีที่จำเป็นสำหรับการจัดเก็บข้อมูล
* คัดลอกแอปพลิเคชันที่สร้างแล้วจากขั้นตอนการสร้าง

แนวทางนี้ช่วยให้มั่นใจว่าภาพสุดท้ายมีขนาดและความปลอดภัยที่เหมาะสมที่สุด

## กระบวนการปรับใช้ {#deployment-process}

### การติดตั้ง {#installation}

ผู้ใช้สามารถปรับใช้โซลูชันโฮสต์ด้วยตนเองโดยใช้สคริปต์การตั้งค่าที่ให้มา:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

สคริปต์นี้:

1. โคลนที่เก็บข้อมูล
2. ตั้งค่าสภาพแวดล้อม
3. กำหนดค่า DNS และการตั้งค่าไฟร์วอลล์
4. สร้างใบรับรอง SSL
5. ดึงภาพ Docker ล่าสุด
6. เริ่มบริการโดยใช้ Docker Compose

### การกำหนดค่า Docker Compose {#docker-compose-configuration}

ไฟล์ `docker-compose-self-hosted.yml` กำหนดบริการทั้งหมดที่จำเป็นสำหรับโซลูชันโฮสต์ด้วยตนเอง:

* **เว็บ**: อินเทอร์เฟซเว็บหลัก
* **API**: เซิร์ฟเวอร์ API สำหรับการเข้าถึงตามโปรแกรม
* **SMTP**: บริการส่งอีเมล
* **IMAP/POP3**: บริการดึงอีเมล
* **MX**: บริการแลกเปลี่ยนอีเมล
* **CalDAV**: บริการปฏิทิน
* **CardDAV**: บริการรายชื่อติดต่อ
* **MongoDB**: ฐานข้อมูลสำหรับจัดเก็บข้อมูลผู้ใช้
* **Redis**: ที่จัดเก็บข้อมูลในหน่วยความจำ
* **SQLite**: ฐานข้อมูลสำหรับจัดเก็บอีเมล

บริการแต่ละรายการจะใช้ภาพ Docker เดียวกัน แต่มีจุดเข้าที่แตกต่างกัน ช่วยให้มีสถาปัตยกรรมแบบโมดูลาร์และลดความซับซ้อนในการบำรุงรักษา

## คุณสมบัติการบำรุงรักษา {#maintenance-features}

โซลูชันโฮสต์ด้วยตนเองมีคุณสมบัติการบำรุงรักษาหลายประการ:

### การอัปเดตอัตโนมัติ {#automatic-updates}

ผู้ใช้สามารถเปิดใช้งานการอัปเดตอัตโนมัติที่จะ:

* ดึงภาพ Docker ล่าสุดทุกคืน
* รีสตาร์ทบริการด้วยภาพอัปเดต
* บันทึกกระบวนการอัปเดต

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### สำรองและกู้คืน {#backup-and-restore}

การตั้งค่ามีตัวเลือกให้:

* การกำหนดค่าการสำรองข้อมูลปกติไปยังที่เก็บข้อมูลที่รองรับ S3
* การสำรองข้อมูล MongoDB, Redis และ SQLite
* การคืนค่าจากการสำรองข้อมูลในกรณีที่เกิดความล้มเหลว

### การต่ออายุใบรับรอง {#certificate-renewal}

ใบรับรอง SSL ได้รับการจัดการโดยอัตโนมัติ โดยมีตัวเลือกดังนี้:

* สร้างใบรับรองใหม่ระหว่างการตั้งค่า
* ต่ออายุใบรับรองเมื่อจำเป็น
* กำหนดค่า DKIM สำหรับการตรวจสอบสิทธิ์อีเมล

## การกำหนดเวอร์ชัน {#versioning}

แต่ละรุ่นของ GitHub จะสร้างภาพ Docker ใหม่ที่มีแท็กดังนี้:

1. เวอร์ชันที่เผยแพร่เฉพาะ (เช่น `v1.0.0`)
2. แท็ก `latest` สำหรับเวอร์ชันล่าสุด

ผู้ใช้สามารถเลือกใช้เวอร์ชันเฉพาะเพื่อความเสถียรหรือแท็ก `latest` เพื่อรับฟีเจอร์ใหม่ล่าสุดอยู่เสมอ

## การเข้าถึงรูปภาพ {#accessing-images}

รูปภาพ Docker สามารถเข้าถึงได้สาธารณะที่:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (ตัวอย่างแท็กเวอร์ชัน)

ไม่จำเป็นต้องมีการตรวจสอบสิทธิ์เพื่อดึงภาพเหล่านี้

## การสนับสนุน {#contributing}

เพื่อมีส่วนสนับสนุนโซลูชันโฮสต์ด้วยตนเอง:

1. ทำการเปลี่ยนแปลงไฟล์ที่เกี่ยวข้องในไดเร็กทอรี `self-hosting`
2. ทดสอบในเครื่องหรือบน VPS ที่ใช้ Ubuntu โดยใช้สคริปต์ `setup.sh` ที่ให้มา
3. ส่งคำขอ Pull Request
4. เมื่อผสานและสร้างเวอร์ชันใหม่แล้ว เวิร์กโฟลว์ CI จะสร้างและเผยแพร่อิมเมจ Docker ที่อัปเดตโดยอัตโนมัติ