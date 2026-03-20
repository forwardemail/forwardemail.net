# Listmonk กับ Forward Email สำหรับการส่งจดหมายข่าวที่ปลอดภัย {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## สารบัญ {#table-of-contents}

* [ภาพรวม](#overview)
* [ทำไมต้องใช้ Listmonk และ Forward Email](#why-listmonk-and-forward-email)
* [ข้อกำหนดเบื้องต้น](#prerequisites)
* [การติดตั้ง](#installation)
  * [1. อัปเดตเซิร์ฟเวอร์ของคุณ](#1-update-your-server)
  * [2. ติดตั้ง Dependencies](#2-install-dependencies)
  * [3. ดาวน์โหลดการตั้งค่า Listmonk](#3-download-listmonk-configuration)
  * [4. กำหนดค่าไฟร์วอลล์ (UFW)](#4-configure-firewall-ufw)
  * [5. กำหนดค่าการเข้าถึง HTTPS](#5-configure-https-access)
  * [6. เริ่มต้น Listmonk](#6-start-listmonk)
  * [7. กำหนดค่า Forward Email SMTP ใน Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. กำหนดค่าการประมวลผล Bounce](#8-configure-bounce-processing)
* [การทดสอบ](#testing)
  * [สร้างรายชื่อผู้รับจดหมาย](#create-a-mailing-list)
  * [เพิ่มผู้สมัครรับจดหมาย](#add-subscribers)
  * [สร้างและส่งแคมเปญ](#create-and-send-a-campaign)
* [การตรวจสอบ](#verification)
* [บันทึกสำหรับนักพัฒนา](#developer-notes)
* [บทสรุป](#conclusion)


## ภาพรวม {#overview}

คู่มือนี้ให้คำแนะนำทีละขั้นตอนสำหรับนักพัฒนาในการตั้งค่า [Listmonk](https://listmonk.app/), เครื่องมือจัดการจดหมายข่าวและรายชื่อผู้รับจดหมายแบบโอเพนซอร์สที่ทรงพลัง เพื่อใช้ [Forward Email](https://forwardemail.net/) เป็นผู้ให้บริการ SMTP การผสานรวมนี้ช่วยให้คุณจัดการแคมเปญได้อย่างมีประสิทธิภาพในขณะที่มั่นใจได้ว่าการส่งอีเมลมีความปลอดภัย เป็นส่วนตัว และเชื่อถือได้

* **Listmonk**: จัดการการสมัครสมาชิก, การจัดระเบียบรายชื่อ, การสร้างแคมเปญ และการติดตามผลการดำเนินงาน
* **Forward Email**: ทำหน้าที่เป็นเซิร์ฟเวอร์ SMTP ที่ปลอดภัย ดูแลการส่งอีเมลจริงพร้อมฟีเจอร์ความปลอดภัยในตัว เช่น SPF, DKIM, DMARC และการเข้ารหัส TLS

ด้วยการรวมกันของทั้งสองนี้ คุณจะยังคงควบคุมข้อมูลและโครงสร้างพื้นฐานของคุณได้เต็มที่ ในขณะที่ใช้ประโยชน์จากระบบส่งอีเมลที่แข็งแกร่งของ Forward Email


## ทำไมต้องใช้ Listmonk และ Forward Email {#why-listmonk-and-forward-email}

* **โอเพนซอร์ส**: ทั้ง Listmonk และหลักการเบื้องหลัง Forward Email เน้นความโปร่งใสและการควบคุม คุณโฮสต์ Listmonk เองและเป็นเจ้าของข้อมูลของคุณ
* **เน้นความเป็นส่วนตัว**: Forward Email ถูกสร้างขึ้นโดยคำนึงถึงความเป็นส่วนตัวเป็นหลัก ลดการเก็บข้อมูลและเน้นการส่งข้อมูลที่ปลอดภัย
* **ประหยัดค่าใช้จ่าย**: Listmonk ฟรี และ Forward Email มีแผนฟรีที่ให้บริการอย่างเต็มที่และแผนชำระเงินที่ราคาไม่แพง ทำให้เป็นทางเลือกที่ประหยัดงบประมาณ
* **ปรับขนาดได้ดี**: Listmonk มีประสิทธิภาพสูง และโครงสร้างพื้นฐานของ Forward Email ถูกออกแบบมาเพื่อการส่งที่เชื่อถือได้ในระดับใหญ่
* **เหมาะสำหรับนักพัฒนา**: Listmonk มี API ที่แข็งแกร่ง และ Forward Email ให้การผสาน SMTP และเว็บฮุคที่ตรงไปตรงมา


## ข้อกำหนดเบื้องต้น {#prerequisites}

ก่อนเริ่มต้น ให้แน่ใจว่าคุณมีสิ่งต่อไปนี้:

* เซิร์ฟเวอร์ส่วนตัวเสมือน (VPS) ที่รันระบบปฏิบัติการลินุกซ์เวอร์ชันล่าสุด (แนะนำ Ubuntu 20.04 ขึ้นไป) พร้อม CPU อย่างน้อย 1 ตัว และ RAM 1GB (แนะนำ 2GB)
  * ต้องการผู้ให้บริการไหม? ดูได้ที่ [รายชื่อ VPS ที่แนะนำ](https://github.com/forwardemail/awesome-mail-server-providers)
* ชื่อโดเมนที่คุณควบคุม (ต้องเข้าถึง DNS ได้)
* บัญชีที่ใช้งานอยู่กับ [Forward Email](https://forwardemail.net/)
* สิทธิ์ root หรือ `sudo` บน VPS ของคุณ
* ความคุ้นเคยพื้นฐานกับการใช้งานคำสั่งลินุกซ์


## การติดตั้ง {#installation}

ขั้นตอนเหล่านี้จะแนะนำคุณในการติดตั้ง Listmonk โดยใช้ Docker และ Docker Compose บน VPS ของคุณ

### 1. อัปเดตเซิร์ฟเวอร์ของคุณ {#1-update-your-server}

ตรวจสอบให้แน่ใจว่ารายการแพ็กเกจและแพ็กเกจที่ติดตั้งในระบบของคุณเป็นเวอร์ชันล่าสุด

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. ติดตั้ง Dependencies {#2-install-dependencies}

ติดตั้ง Docker, Docker Compose และ UFW (ไฟร์วอลล์ที่ใช้งานง่าย)

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. ดาวน์โหลดการตั้งค่า Listmonk {#3-download-listmonk-configuration}

สร้างไดเรกทอรีสำหรับ Listmonk และดาวน์โหลดไฟล์ `docker-compose.yml` อย่างเป็นทางการ

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

ไฟล์นี้กำหนดคอนเทนเนอร์แอปพลิเคชัน Listmonk และคอนเทนเนอร์ฐานข้อมูล PostgreSQL ที่จำเป็น
### 4. กำหนดค่าไฟร์วอลล์ (UFW) {#4-configure-firewall-ufw}

อนุญาตการรับส่งข้อมูลที่จำเป็น (SSH, HTTP, HTTPS) ผ่านไฟร์วอลล์ หาก SSH ของคุณใช้พอร์ตที่ไม่ใช่มาตรฐาน ให้ปรับตามนั้น

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

ยืนยันการเปิดใช้งานไฟร์วอลล์เมื่อมีการแจ้งเตือน

### 5. กำหนดค่าการเข้าถึง HTTPS {#5-configure-https-access}

การรัน Listmonk ผ่าน HTTPS เป็นสิ่งสำคัญสำหรับความปลอดภัย คุณมีตัวเลือกหลักสองแบบ:

#### ตัวเลือก A: ใช้ Cloudflare Proxy (แนะนำสำหรับความง่าย) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

หาก DNS ของโดเมนคุณถูกจัดการโดย Cloudflare คุณสามารถใช้ฟีเจอร์พร็อกซีของพวกเขาเพื่อความง่ายในการใช้งาน HTTPS

1. **ชี้ DNS**: สร้างระเบียน `A` ใน Cloudflare สำหรับซับโดเมน Listmonk ของคุณ (เช่น `listmonk.yourdomain.com`) ชี้ไปยัง IP ของ VPS ของคุณ ตรวจสอบให้แน่ใจว่า **สถานะพร็อกซี** ตั้งเป็น **Proxied** (เมฆสีส้ม)
2. **แก้ไข Docker Compose**: แก้ไขไฟล์ `docker-compose.yml` ที่คุณดาวน์โหลดมา:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   วิธีนี้จะทำให้ Listmonk เข้าถึงได้ภายในผ่านพอร์ต 80 ซึ่ง Cloudflare จะพร็อกซีและรักษาความปลอดภัยด้วย HTTPS ให้

#### ตัวเลือก B: ใช้ Reverse Proxy (Nginx, Caddy, ฯลฯ) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

อีกทางเลือกหนึ่งคือการตั้งค่า reverse proxy เช่น Nginx หรือ Caddy บน VPS ของคุณเพื่อจัดการการสิ้นสุด HTTPS และพร็อกซีคำขอไปยัง Listmonk (ซึ่งรันบนพอร์ต 9000 ตามค่าเริ่มต้น)

* เก็บค่า `ports: - "127.0.0.1:9000:9000"` ใน `docker-compose.yml` เพื่อให้แน่ใจว่า Listmonk เข้าถึงได้เฉพาะภายในเครื่องเท่านั้น
* กำหนดค่า reverse proxy ที่คุณเลือกให้ฟังบนพอร์ต 80 และ 443 จัดการการขอใบรับรอง SSL (เช่น ผ่าน Let's Encrypt) และส่งต่อการรับส่งข้อมูลไปยัง `http://127.0.0.1:9000`
* การตั้งค่า reverse proxy อย่างละเอียดอยู่นอกเหนือขอบเขตของคู่มือนี้ แต่มีบทเรียนมากมายให้ค้นหาออนไลน์

### 6. เริ่มต้น Listmonk {#6-start-listmonk}

กลับไปที่ไดเรกทอรี `listmonk` ของคุณ (ถ้ายังไม่ได้อยู่ที่นั่น) และเริ่มคอนเทนเนอร์ในโหมด detached

```bash
cd ~/listmonk # หรือไดเรกทอรีที่คุณบันทึก docker-compose.yml
docker compose up -d
```

Docker จะดาวน์โหลดอิมเมจที่จำเป็นและเริ่มแอปพลิเคชัน Listmonk และคอนเทนเนอร์ฐานข้อมูล อาจใช้เวลาสักครู่ในครั้งแรก

✅ **เข้าถึง Listmonk**: ตอนนี้คุณควรจะสามารถเข้าถึงอินเทอร์เฟซเว็บของ Listmonk ผ่านโดเมนที่คุณกำหนดค่าไว้ (เช่น `https://listmonk.yourdomain.com`)

### 7. กำหนดค่า Forward Email SMTP ใน Listmonk {#7-configure-forward-email-smtp-in-listmonk}

ต่อไป กำหนดค่า Listmonk ให้ส่งอีเมลโดยใช้บัญชี Forward Email ของคุณ

1. **เปิดใช้งาน SMTP ใน Forward Email**: ตรวจสอบให้แน่ใจว่าคุณได้สร้างข้อมูลรับรอง SMTP ภายในแดชบอร์ดบัญชี Forward Email ของคุณแล้ว หากยังไม่เคยทำ ให้ทำตาม [คู่มือ Forward Email สำหรับส่งอีเมลด้วยโดเมนที่กำหนดเองผ่าน SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp)
2. **กำหนดค่า Listmonk**: เข้าสู่ระบบแผงควบคุมผู้ดูแลของ Listmonk
   * ไปที่ **Settings -> SMTP**

   * Listmonk มีการรองรับ Forward Email ในตัว เลือก **ForwardEmail** จากรายการผู้ให้บริการ หรือกรอกข้อมูลต่อไปนี้ด้วยตนเอง:

     | การตั้งค่า          | ค่า                                                                                                                |
     | :------------------ | :----------------------------------------------------------------------------------------------------------------- |
     | **Host**            | `smtp.forwardemail.net`                                                                                            |
     | **Port**            | `465`                                                                                                              |
     | **Auth protocol**   | `LOGIN`                                                                                                            |
     | **Username**        | ชื่อผู้ใช้ SMTP ของ Forward Email ของคุณ                                                                          |
     | **Password**        | รหัสผ่าน SMTP ของ Forward Email ของคุณ                                                                             |
     | **TLS**             | `SSL/TLS`                                                                                                          |
     | **From e-mail**     | ที่อยู่อีเมล `From` ที่คุณต้องการ (เช่น `newsletter@yourdomain.com`) ตรวจสอบให้แน่ใจว่าโดเมนนั้นถูกกำหนดค่าใน Forward Email แล้ว |
* **สำคัญ**: ใช้ Port `465` กับ `SSL/TLS` เสมอสำหรับการเชื่อมต่อที่ปลอดภัยกับ Forward Email (แนะนำ) Port `587` กับ STARTTLS ก็รองรับเช่นกันแต่แนะนำให้ใช้ SSL/TLS

   * คลิก **บันทึก**  
3. **ส่งอีเมลทดสอบ**: ใช้ปุ่ม "ส่งอีเมลทดสอบ" ภายในหน้าการตั้งค่า SMTP ใส่ที่อยู่อีเมลผู้รับที่คุณเข้าถึงได้แล้วคลิก **ส่ง** ตรวจสอบว่าอีเมลมาถึงกล่องจดหมายของผู้รับ

### 8. ตั้งค่าการประมวลผลอีเมลเด้ง {#8-configure-bounce-processing}

การประมวลผลอีเมลเด้งช่วยให้ Listmonk จัดการอีเมลที่ส่งไม่สำเร็จโดยอัตโนมัติ (เช่น เนื่องจากที่อยู่อีเมลไม่ถูกต้อง) Forward Email มี webhook เพื่อแจ้ง Listmonk เกี่ยวกับอีเมลเด้ง

#### การตั้งค่า Forward Email {#forward-email-setup}

1. เข้าสู่ระบบที่ [Forward Email Dashboard](https://forwardemail.net/)
2. ไปที่ **Domains** เลือกโดเมนที่คุณใช้ส่งอีเมล แล้วไปที่หน้าการตั้งค่า **Settings**
3. เลื่อนลงไปที่ส่วน **Bounce Webhook URL**
4. ใส่ URL ดังนี้ โดยแทนที่ `<your_listmonk_domain>` ด้วยโดเมนหรือซับโดเมนจริงที่สามารถเข้าถึง Listmonk ของคุณได้:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *ตัวอย่าง*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. เลื่อนลงไปที่ส่วน **Webhook Signature Payload Verification Key**
6. **คัดลอก** คีย์ตรวจสอบที่สร้างขึ้น คุณจะต้องใช้ใน Listmonk
7. บันทึกการเปลี่ยนแปลงในการตั้งค่าโดเมน Forward Email ของคุณ

#### การตั้งค่า Listmonk {#listmonk-setup}

1. ในแผงควบคุมผู้ดูแลของ Listmonk ไปที่ **Settings -> Bounces**
2. เปิดใช้งาน **Enable bounce processing**
3. เปิดใช้งาน **Enable bounce webhooks**
4. เลื่อนลงไปที่ส่วน **Webhook Providers**
5. เปิดใช้งาน **Forward Email**
6. วาง **Webhook Signature Payload Verification Key** ที่คุณคัดลอกจากแดชบอร์ด Forward Email ลงในช่อง **Forward Email Key**
7. คลิก **บันทึก** ที่ด้านล่างของหน้า
8. การประมวลผลอีเมลเด้งถูกตั้งค่าเรียบร้อย! เมื่อ Forward Email ตรวจพบอีเมลเด้งสำหรับอีเมลที่ส่งโดย Listmonk มันจะส่งแจ้งเตือนไปยัง Listmonk ผ่าน webhook และ Listmonk จะทำเครื่องหมายผู้สมัครสมาชิกตามนั้น
9. ทำตามขั้นตอนด้านล่างใน [การทดสอบ](#testing) เพื่อให้แน่ใจว่าทุกอย่างทำงานได้ถูกต้อง


## การทดสอบ {#testing}

นี่คือภาพรวมอย่างรวดเร็วของฟังก์ชันหลักของ Listmonk:

### สร้างรายชื่อผู้รับจดหมาย {#create-a-mailing-list}

* ไปที่ **Lists** ในแถบด้านข้าง
* คลิก **New List**
* กรอกรายละเอียด (ชื่อ, ประเภท: สาธารณะ/ส่วนตัว, คำอธิบาย, แท็ก) แล้ว **บันทึก**

### เพิ่มผู้สมัครสมาชิก {#add-subscribers}

* ไปที่ส่วน **Subscribers**
* คุณสามารถเพิ่มผู้สมัครสมาชิกได้:
  * **ด้วยตนเอง**: คลิก **New Subscriber**
  * **นำเข้า**: คลิก **Import Subscribers** เพื่ออัปโหลดไฟล์ CSV
  * **API**: ใช้ Listmonk API สำหรับการเพิ่มแบบโปรแกรม
* กำหนดผู้สมัครสมาชิกให้กับรายชื่อหนึ่งหรือหลายรายการในขณะสร้างหรือการนำเข้า
* **แนวทางปฏิบัติที่ดีที่สุด**: ใช้กระบวนการ double opt-in ตั้งค่านี้ได้ที่ **Settings -> Opt-in & Subscriptions**

### สร้างและส่งแคมเปญ {#create-and-send-a-campaign}

* ไปที่ **Campaigns** -> **New Campaign**
* กรอกรายละเอียดแคมเปญ (ชื่อ, หัวเรื่อง, อีเมลผู้ส่ง, รายชื่อที่จะส่ง)
* เลือกประเภทเนื้อหา (Rich Text/HTML, Plain Text, Raw HTML)
* เขียนเนื้อหาอีเมล คุณสามารถใช้ตัวแปรเทมเพลตเช่น `{{ .Subscriber.Email }}` หรือ `{{ .Subscriber.FirstName }}`
* **ส่งอีเมลทดสอบก่อนเสมอ!** ใช้ตัวเลือก "ส่งทดสอบ" เพื่อดูตัวอย่างอีเมลในกล่องจดหมายของคุณ
* เมื่อพอใจแล้ว คลิก **Start Campaign** เพื่อส่งทันทีหรือกำหนดเวลาส่งในภายหลัง


## การตรวจสอบ {#verification}

* **การส่ง SMTP**: ส่งอีเมลทดสอบเป็นประจำผ่านหน้าการตั้งค่า SMTP ของ Listmonk และแคมเปญทดสอบเพื่อให้แน่ใจว่าอีเมลถูกส่งอย่างถูกต้อง
* **การจัดการอีเมลเด้ง**: ส่งแคมเปญทดสอบไปยังที่อยู่อีเมลที่ไม่ถูกต้องที่รู้จัก (เช่น `bounce-test@yourdomain.com` หากคุณไม่มีที่อยู่อีเมลจริง แม้ว่าผลลัพธ์อาจแตกต่างกัน) ตรวจสอบสถิติแคมเปญใน Listmonk หลังจากเวลาสั้นๆ เพื่อดูว่าอีเมลเด้งถูกบันทึกหรือไม่
* **หัวข้ออีเมล**: ใช้เครื่องมือเช่น [Mail-Tester](https://www.mail-tester.com/) หรือตรวจสอบหัวข้ออีเมลด้วยตนเองเพื่อยืนยันว่า SPF, DKIM และ DMARC ผ่านการตรวจสอบ ซึ่งแสดงว่าการตั้งค่าผ่าน Forward Email ถูกต้อง
* **บันทึก Forward Email**: ตรวจสอบบันทึกในแดชบอร์ด Forward Email หากคุณสงสัยว่ามีปัญหาการส่งอีเมลที่มาจากเซิร์ฟเวอร์ SMTP
## Developer Notes {#developer-notes}

* **Templating**: Listmonk ใช้เครื่องมือ templating ของ Go สำรวจเอกสารประกอบเพื่อการปรับแต่งขั้นสูง: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk มี REST API ครบวงจรสำหรับจัดการรายชื่อ ผู้สมัครรับข้อมูล แคมเปญ เทมเพลต และอื่นๆ ค้นหาลิงก์เอกสาร API ได้ที่ส่วนท้ายของอินสแตนซ์ Listmonk ของคุณ
* **Custom Fields**: กำหนดฟิลด์ผู้สมัครรับข้อมูลแบบกำหนดเองได้ที่ **Settings -> Subscriber Fields** เพื่อเก็บข้อมูลเพิ่มเติม
* **Webhooks**: นอกจากการแจ้งเตือน bounce แล้ว Listmonk ยังสามารถส่ง webhook สำหรับเหตุการณ์อื่นๆ (เช่น การสมัครรับข้อมูล) เพื่อให้สามารถเชื่อมต่อกับระบบอื่นได้


## Conclusion {#conclusion}

ด้วยการผสานพลังของ Listmonk ที่โฮสต์เองกับการส่งอีเมลที่ปลอดภัยและเคารพความเป็นส่วนตัวของ Forward Email คุณจะสร้างแพลตฟอร์มการตลาดผ่านอีเมลที่แข็งแกร่งและมีจริยธรรม คุณจะยังคงเป็นเจ้าของข้อมูลผู้ชมของคุณอย่างเต็มที่ในขณะที่ได้รับประโยชน์จากอัตราการส่งที่สูงและฟีเจอร์ความปลอดภัยอัตโนมัติ

การตั้งค่านี้เป็นทางเลือกที่ขยายตัวได้ ประหยัดค่าใช้จ่าย และเป็นมิตรกับนักพัฒนาแทนบริการอีเมลแบบปิดที่มีลิขสิทธิ์ ซึ่งสอดคล้องอย่างสมบูรณ์กับจริยธรรมของซอฟต์แวร์โอเพนซอร์สและความเป็นส่วนตัวของผู้ใช้

ส่งอีเมลอย่างมีความสุข! 🚀
