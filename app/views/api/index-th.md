# Email API {#email-api}


## Table of Contents {#table-of-contents}

* [ไลบรารี](#libraries)
* [Base URI](#base-uri)
* [การตรวจสอบสิทธิ์](#authentication)
  * [การตรวจสอบสิทธิ์ด้วย API Token (แนะนำสำหรับส่วนใหญ่ของ endpoints)](#api-token-authentication-recommended-for-most-endpoints)
  * [การตรวจสอบสิทธิ์ด้วย Alias Credentials (สำหรับอีเมลขาออก)](#alias-credentials-authentication-for-outbound-email)
  * [Alias-Only Endpoints](#alias-only-endpoints)
* [ข้อผิดพลาด](#errors)
* [การแปลภาษา](#localization)
* [การแบ่งหน้า](#pagination)
* [บันทึก](#logs)
  * [ดึงบันทึก](#retrieve-logs)
* [บัญชี](#account)
  * [สร้างบัญชี](#create-account)
  * [ดึงข้อมูลบัญชี](#retrieve-account)
  * [อัปเดตบัญชี](#update-account)
* [Alias Contacts (CardDAV)](#alias-contacts-carddav)
  * [รายการผู้ติดต่อ](#list-contacts)
  * [สร้างผู้ติดต่อ](#create-contact)
  * [ดึงข้อมูลผู้ติดต่อ](#retrieve-contact)
  * [อัปเดตผู้ติดต่อ](#update-contact)
  * [ลบผู้ติดต่อ](#delete-contact)
* [Alias Calendars (CalDAV)](#alias-calendars-caldav)
  * [รายการปฏิทิน](#list-calendars)
  * [สร้างปฏิทิน](#create-calendar)
  * [ดึงข้อมูลปฏิทิน](#retrieve-calendar)
  * [อัปเดตปฏิทิน](#update-calendar)
  * [ลบปฏิทิน](#delete-calendar)
* [Alias Messages (IMAP/POP3)](#alias-messages-imappop3)
  * [รายการและค้นหาข้อความ](#list-and-search-for-messages)
  * [สร้างข้อความ](#create-message)
  * [ดึงข้อมูลข้อความ](#retrieve-message)
  * [อัปเดตข้อความ](#update-message)
  * [ลบข้อความ](#delete-message)
* [Alias Folders (IMAP/POP3)](#alias-folders-imappop3)
  * [รายการโฟลเดอร์](#list-folders)
  * [สร้างโฟลเดอร์](#create-folder)
  * [ดึงข้อมูลโฟลเดอร์](#retrieve-folder)
  * [อัปเดตโฟลเดอร์](#update-folder)
  * [ลบโฟลเดอร์](#delete-folder)
  * [คัดลอกโฟลเดอร์](#copy-folder)
* [อีเมลขาออก](#outbound-emails)
  * [รับขีดจำกัดอีเมล SMTP ขาออก](#get-outbound-smtp-email-limit)
  * [รายการอีเมล SMTP ขาออก](#list-outbound-smtp-emails)
  * [สร้างอีเมล SMTP ขาออก](#create-outbound-smtp-email)
  * [ดึงข้อมูลอีเมล SMTP ขาออก](#retrieve-outbound-smtp-email)
  * [ลบอีเมล SMTP ขาออก](#delete-outbound-smtp-email)
* [โดเมน](#domains)
  * [รายการโดเมน](#list-domains)
  * [สร้างโดเมน](#create-domain)
  * [ดึงข้อมูลโดเมน](#retrieve-domain)
  * [ยืนยันระเบียนโดเมน](#verify-domain-records)
  * [ยืนยันระเบียน SMTP ของโดเมน](#verify-domain-smtp-records)
  * [รายการรหัสผ่าน catch-all ทั่วโดเมน](#list-domain-wide-catch-all-passwords)
  * [สร้างรหัสผ่าน catch-all ทั่วโดเมน](#create-domain-wide-catch-all-password)
  * [ลบรหัสผ่าน catch-all ทั่วโดเมน](#remove-domain-wide-catch-all-password)
  * [อัปเดตโดเมน](#update-domain)
  * [ลบโดเมน](#delete-domain)
* [คำเชิญ](#invites)
  * [ยอมรับคำเชิญโดเมน](#accept-domain-invite)
  * [สร้างคำเชิญโดเมน](#create-domain-invite)
  * [ลบคำเชิญโดเมน](#remove-domain-invite)
* [สมาชิก](#members)
  * [อัปเดตสมาชิกโดเมน](#update-domain-member)
  * [ลบสมาชิกโดเมน](#remove-domain-member)
* [อาลิอาส](#aliases)
  * [สร้างรหัสผ่านอาลิอาส](#generate-an-alias-password)
  * [รายการอาลิอาสโดเมน](#list-domain-aliases)
  * [สร้างอาลิอาสโดเมนใหม่](#create-new-domain-alias)
  * [ดึงข้อมูลอาลิอาสโดเมน](#retrieve-domain-alias)
  * [อัปเดตอาลิอาสโดเมน](#update-domain-alias)
  * [ลบอาลิอาสโดเมน](#delete-domain-alias)
* [การเข้ารหัส](#encrypt)
  * [เข้ารหัสระเบียน TXT](#encrypt-txt-record)


## Libraries {#libraries}

ขณะนี้เรายังไม่ได้ปล่อย API wrappers ใด ๆ แต่เราวางแผนที่จะทำในอนาคตอันใกล้นี้ ส่งอีเมลไปที่ <api@forwardemail.net> หากคุณต้องการรับแจ้งเมื่อ API wrapper สำหรับภาษาการเขียนโปรแกรมใดถูกปล่อยออกมา ในระหว่างนี้ คุณสามารถใช้ไลบรารี HTTP request ที่แนะนำเหล่านี้ในแอปพลิเคชันของคุณ หรือใช้ [curl](https://stackoverflow.com/a/27442239/3586413) ตามตัวอย่างด้านล่างได้เลย

| ภาษา       | ไลบรารี                                                                |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (เราคือผู้ดูแล)       |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (เราคือผู้ดูแล)       |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

เส้นทาง HTTP base URI ปัจจุบันคือ: `BASE_URI`.


## Authentication {#authentication}

ทุก endpoint ต้องการการยืนยันตัวตนโดยใช้ [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication) เรารองรับวิธีการยืนยันตัวตนสองแบบ:

### API Token Authentication (แนะนำสำหรับ endpoint ส่วนใหญ่) {#api-token-authentication-recommended-for-most-endpoints}

ตั้งค่า [API key](https://forwardemail.net/my-account/security) ของคุณเป็นค่า "username" โดยเว้นรหัสผ่านว่างไว้:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

สังเกตเครื่องหมายโคลอน (`:`) หลัง API token – นี่แสดงถึงรหัสผ่านว่างในรูปแบบ Basic Auth

### Alias Credentials Authentication (สำหรับอีเมลขาออก) {#alias-credentials-authentication-for-outbound-email}

[Create outbound SMTP email](#create-outbound-smtp-email) endpoint ยังรองรับการยืนยันตัวตนโดยใช้ที่อยู่อีเมล alias ของคุณและ [รหัสผ่าน alias ที่สร้างขึ้น](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

วิธีนี้มีประโยชน์เมื่อส่งอีเมลจากแอปพลิเคชันที่ใช้ข้อมูลรับรอง SMTP อยู่แล้ว และช่วยให้การย้ายจาก SMTP ไปยัง API ของเราเป็นไปอย่างราบรื่น

### Alias-Only Endpoints {#alias-only-endpoints}

[Alias Contacts](#alias-contacts-carddav), [Alias Calendars](#alias-calendars-caldav), [Alias Messages](#alias-messages-imappop3), และ [Alias Folders](#alias-folders-imappop3) endpoint ต้องการข้อมูลรับรอง alias และไม่รองรับการยืนยันตัวตนด้วย API token

ไม่ต้องกังวล – ตัวอย่างมีให้ด้านล่างสำหรับคุณหากคุณไม่แน่ใจว่านี่คืออะไร


## Errors {#errors}

หากเกิดข้อผิดพลาดใด ๆ ร่างกายของการตอบสนอง API จะมีข้อความแสดงข้อผิดพลาดอย่างละเอียด

| Code | Name                  |
| ---- | --------------------- |
| 200  | สำเร็จ (OK)           |
| 400  | คำขอไม่ถูกต้อง (Bad Request) |
| 401  | ไม่ได้รับอนุญาต (Unauthorized) |
| 403  | ห้ามเข้าใช้ (Forbidden) |
| 404  | ไม่พบ (Not Found)     |
| 429  | คำขอมากเกินไป (Too Many Requests) |
| 500  | ข้อผิดพลาดภายในเซิร์ฟเวอร์ (Internal Server Error) |
| 501  | ยังไม่รองรับ (Not Implemented) |
| 502  | เกตเวย์ผิดพลาด (Bad Gateway) |
| 503  | บริการไม่พร้อมใช้งาน (Service Unavailable) |
| 504  | เกตเวย์หมดเวลา (Gateway Time-out) |

> \[!TIP]
> หากคุณได้รับรหัสสถานะ 5xx (ซึ่งไม่ควรเกิดขึ้น) กรุณาติดต่อเราที่ <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> และเราจะช่วยคุณแก้ไขปัญหาทันที


## Localization {#localization}

บริการของเราแปลเป็นมากกว่า 25 ภาษา ข้อความตอบกลับ API ทั้งหมดจะแปลเป็นภาษาท้องถิ่นล่าสุดที่ตรวจพบของผู้ใช้ที่ทำคำขอ API คุณสามารถเปลี่ยนแปลงได้โดยส่ง header `Accept-Language` แบบกำหนดเอง ลองใช้ได้โดยเลือกภาษาจากเมนูแบบเลื่อนลงที่ด้านล่างของหน้านี้


## Pagination {#pagination}

> \[!NOTE]
> ตั้งแต่วันที่ 1 พฤศจิกายน 2024 เป็นต้นไป API endpoint สำหรับ [List domains](#list-domains) และ [List domain aliases](#list-domain-aliases) จะตั้งค่าเริ่มต้นให้แสดงผลลัพธ์สูงสุด `1000` รายการต่อหน้า หากคุณต้องการเลือกใช้พฤติกรรมนี้ก่อนเวลา คุณสามารถส่ง `?paginate=true` เป็นพารามิเตอร์ querystring เพิ่มเติมใน URL ของ endpoint นั้นได้

การแบ่งหน้า (Pagination) รองรับโดยทุก API endpoint ที่แสดงรายการผลลัพธ์

เพียงแค่ระบุคุณสมบัติ querystring `page` (และถ้าต้องการ `limit`)

คุณสมบัติ `page` ควรเป็นตัวเลขที่มากกว่าหรือเท่ากับ `1` หากไม่ระบุค่า `page` จะเป็น `1` โดยค่าเริ่มต้น หากระบุ `limit` (ซึ่งเป็นตัวเลขเช่นกัน) ค่าต่ำสุดคือ `10` และค่าสูงสุดคือ `50` (เว้นแต่จะระบุไว้เป็นอย่างอื่น)

| Querystring Parameter | Required | Type   | Description                                                                                                                                               |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | ไม่จำเป็น | Number | หน้าของผลลัพธ์ที่จะส่งกลับ หากไม่ระบุ ค่า `page` จะเป็น `1` ต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ `1`                                                  |
| `limit`               | ไม่จำเป็น | Number | จำนวนผลลัพธ์ที่จะส่งกลับต่อหน้า ค่าเริ่มต้นคือ `10` หากไม่ระบุ ต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ `1` และน้อยกว่าหรือเท่ากับ `50`               |
In order to determine whether or not more results are available, we provide these HTTP response headers (which you can parse in order to paginate programmatically):

| HTTP Response Header | Example                                                                                                                                                                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | จำนวนหน้าทั้งหมดที่มีให้ใช้งาน                                                                                                                                                                                                                                                                                                                                    |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | หน้าปัจจุบันของผลลัพธ์ที่ส่งกลับ (เช่น อิงจากพารามิเตอร์ querystring `page`)                                                                                                                                                                                                                                                                                |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | จำนวนผลลัพธ์ทั้งหมดในหน้าที่ส่งกลับ (เช่น อิงจากพารามิเตอร์ querystring `limit` และผลลัพธ์ที่แท้จริงที่ส่งกลับ)                                                                                                                                                                                                                                       |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | จำนวนรายการทั้งหมดที่มีให้ใช้งานในทุกหน้า                                                                                                                                                                                                                                                                                                              |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | เราจะให้ HTTP response header ชื่อ `Link` ที่คุณสามารถแยกวิเคราะห์ได้ตามตัวอย่างที่แสดง นี่คือ [คล้ายกับ GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (เช่น ไม่ใช่ทุกค่าจะถูกส่งมา หากไม่เกี่ยวข้องหรือไม่มี เช่น `"next"` จะไม่ถูกส่งมา หากไม่มีหน้าถัดไป) |
> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## บันทึก {#logs}

### ดึงบันทึก {#retrieve-logs}

API ของเราช่วยให้คุณดาวน์โหลดบันทึกสำหรับบัญชีของคุณได้โดยอัตโนมัติ การส่งคำขอไปยัง endpoint นี้จะประมวลผลบันทึกทั้งหมดสำหรับบัญชีของคุณและส่งอีเมลพร้อมไฟล์แนบ ([Gzip](https://en.wikipedia.org/wiki/Gzip) บีบอัดไฟล์ [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)) เมื่อเสร็จสิ้น

สิ่งนี้ช่วยให้คุณสร้างงานเบื้องหลังด้วย [Cron job](https://en.wikipedia.org/wiki/Cron) หรือใช้ซอฟต์แวร์จัดตารางงาน [Node.js Bree](https://github.com/breejs/bree) เพื่อรับบันทึกเมื่อใดก็ได้ตามต้องการ โปรดทราบว่า endpoint นี้จำกัดที่ `10` คำขอต่อวัน

ไฟล์แนบจะเป็นรูปแบบตัวพิมพ์เล็กของ `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` และอีเมลจะมีสรุปสั้น ๆ ของบันทึกที่ดึงมา คุณยังสามารถดาวน์โหลดบันทึกได้ทุกเวลาจาก [บัญชีของฉัน → บันทึก](/my-account/logs)

> `GET /v1/logs/download`

| ตัวแปร Querystring  | จำเป็น | ประเภท         | คำอธิบาย                                                                                                                      |
| ------------------- | ------ | -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `domain`            | ไม่     | String (FQDN)  | กรองบันทึกตามโดเมนที่ระบุแบบเต็ม ("FQDN") หากไม่ระบุจะดึงบันทึกทั้งหมดจากทุกโดเมน                                          |
| `q`                 | ไม่     | String         | ค้นหาบันทึกโดยอีเมล, โดเมน, ชื่ออาลิอัส, ที่อยู่ IP หรือวันที่ (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY`, หรือ `M.D.YY` รูปแบบ)       |
| `bounce_category`    | ไม่     | String         | ค้นหาบันทึกตามหมวดหมู่การเด้งเฉพาะ (เช่น `blocklist`)                                                                       |
| `response_code`      | ไม่     | Number         | ค้นหาบันทึกตามรหัสตอบกลับข้อผิดพลาดเฉพาะ (เช่น `421` หรือ `550`)                                                           |

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> ตัวอย่าง Cron job (ทุกเที่ยงคืนทุกวัน):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

โปรดทราบว่าคุณสามารถใช้บริการเช่น [Crontab.guru](https://crontab.guru/) เพื่อตรวจสอบไวยากรณ์ของนิพจน์ cron job ของคุณ

> ตัวอย่าง Cron job (ทุกเที่ยงคืนทุกวัน **และดึงบันทึกของวันก่อนหน้า**):

สำหรับ MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

สำหรับ Linux และ Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## บัญชี {#account}

### สร้างบัญชี {#create-account}

> `POST /v1/account`

| ตัวแปรใน Body | จำเป็น | ประเภท           | คำอธิบาย       |
| ------------- | ------ | ---------------- | -------------- |
| `email`       | ใช่    | String (Email)   | ที่อยู่อีเมล    |
| `password`    | ใช่    | String           | รหัสผ่าน       |

> ตัวอย่างคำขอ:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### ดึงข้อมูลบัญชี {#retrieve-account}

> `GET /v1/account`

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### อัปเดตบัญชี {#update-account}

> `PUT /v1/account`

| ตัวแปรใน Body | จำเป็น | ประเภท           | คำอธิบาย          |
| ------------- | ------ | ---------------- | ------------------ |
| `email`       | ไม่     | String (Email)   | ที่อยู่อีเมล        |
| `given_name`  | ไม่     | String           | ชื่อจริง           |
| `family_name` | ไม่     | String           | นามสกุล            |
| `avatar_url`  | ไม่     | String (URL)     | ลิงก์ไปยังรูปอวาตาร์ |

> ตัวอย่างคำขอ:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## รายชื่อติดต่ออาลิอัส (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> ต่างจาก API endpoints อื่น ๆ จุดนี้ต้องใช้ [Authentication](#authentication) โดย "username" ต้องเท่ากับชื่อผู้ใช้อาลิอัส และ "password" ต้องเท่ากับรหัสผ่านที่สร้างขึ้นสำหรับอาลิอัสนั้นในส่วนหัว Basic Authorization เท่านั้น
> \[!WARNING]
> ส่วนของ endpoint นี้กำลังอยู่ในระหว่างการพัฒนาและคาดว่าจะปล่อยใช้งานในปี 2024 ในระหว่างนี้กรุณาใช้ไคลเอนต์ IMAP จากเมนู "Apps" ในแถบนำทางของเว็บไซต์ของเรา

### รายชื่อผู้ติดต่อ {#list-contacts}

> `GET /v1/contacts`

**เร็วๆ นี้**

### สร้างผู้ติดต่อ {#create-contact}

> `POST /v1/contacts`

**เร็วๆ นี้**

### ดึงข้อมูลผู้ติดต่อ {#retrieve-contact}

> `GET /v1/contacts/:id`

**เร็วๆ นี้**

### อัปเดตผู้ติดต่อ {#update-contact}

> `PUT /v1/contacts/:id`

**เร็วๆ นี้**

### ลบผู้ติดต่อ {#delete-contact}

> `DELETE /v1/contacts/:id`

**เร็วๆ นี้**


## ปฏิทิน Alias (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> แตกต่างจาก endpoint API อื่นๆ ส่วนนี้ต้องใช้ [Authentication](#authentication) โดย "username" ต้องตรงกับชื่อผู้ใช้ alias และ "password" ต้องตรงกับรหัสผ่านที่สร้างขึ้นสำหรับ alias ในส่วนหัว Basic Authorization

> \[!WARNING]
> ส่วนของ endpoint นี้กำลังอยู่ในระหว่างการพัฒนาและคาดว่าจะปล่อยใช้งานในปี 2024 ในระหว่างนี้กรุณาใช้ไคลเอนต์ IMAP จากเมนู "Apps" ในแถบนำทางของเว็บไซต์ของเรา

### รายการปฏิทิน {#list-calendars}

> `GET /v1/calendars`

**เร็วๆ นี้**

### สร้างปฏิทิน {#create-calendar}

> `POST /v1/calendars`

**เร็วๆ นี้**

### ดึงข้อมูลปฏิทิน {#retrieve-calendar}

> `GET /v1/calendars/:id`

**เร็วๆ นี้**

### อัปเดตปฏิทิน {#update-calendar}

> `PUT /v1/calendars/:id`

**เร็วๆ นี้**

### ลบปฏิทิน {#delete-calendar}

> `DELETE /v1/calendars/:id`

**เร็วๆ นี้**


## ข้อความ Alias (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> แตกต่างจาก endpoint API อื่นๆ ส่วนนี้ต้องใช้ [Authentication](#authentication) โดย "username" ต้องตรงกับชื่อผู้ใช้ alias และ "password" ต้องตรงกับรหัสผ่านที่สร้างขึ้นสำหรับ alias ในส่วนหัว Basic Authorization

> \[!WARNING]
> ส่วนของ endpoint นี้กำลังอยู่ในระหว่างการพัฒนาและคาดว่าจะปล่อยใช้งานในปี 2024 ในระหว่างนี้กรุณาใช้ไคลเอนต์ IMAP จากเมนู "Apps" ในแถบนำทางของเว็บไซต์ของเรา

โปรดตรวจสอบว่าคุณได้ทำตามคำแนะนำการตั้งค่าสำหรับโดเมนของคุณแล้ว

คำแนะนำเหล่านี้สามารถดูได้ในส่วนคำถามที่พบบ่อยของเรา [คุณรองรับการรับอีเมลด้วย IMAP หรือไม่?](/faq#do-you-support-receiving-email-with-imap)

### รายการและค้นหาข้อความ {#list-and-search-for-messages}

> `GET /v1/messages`

**เร็วๆ นี้**

### สร้างข้อความ {#create-message}

> \[!NOTE]
> การดำเนินการนี้จะ **ไม่** ส่งอีเมล – จะเป็นเพียงการเพิ่มข้อความลงในโฟลเดอร์กล่องจดหมายของคุณเท่านั้น (เช่นเดียวกับคำสั่ง IMAP `APPEND`) หากคุณต้องการส่งอีเมล โปรดดูที่ [สร้างอีเมล SMTP ขาออก](#create-outbound-smtp-email) ด้านล่าง หลังจากสร้างอีเมล SMTP ขาออกแล้ว คุณสามารถเพิ่มสำเนาของอีเมลนั้นโดยใช้ endpoint นี้เพื่อเก็บไว้ในกล่องจดหมายของ alias

> `POST /v1/messages`

**เร็วๆ นี้**

### ดึงข้อมูลข้อความ {#retrieve-message}

> `GET /v1/messages/:id`

**เร็วๆ นี้**

### อัปเดตข้อความ {#update-message}

> `PUT /v1/messages/:id`

**เร็วๆ นี้**

### ลบข้อความ {#delete-message}

> `DELETE /v1/messages:id`

**เร็วๆ นี้**


## โฟลเดอร์ Alias (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Endpoint โฟลเดอร์ที่ใช้เส้นทางโฟลเดอร์ <code>/v1/folders/:path</code> สามารถใช้แทนกันได้กับ ID ของโฟลเดอร์ <code>:id</code> หมายความว่าคุณสามารถอ้างอิงโฟลเดอร์โดยใช้ค่า <code>path</code> หรือ <code>id</code> ก็ได้

> \[!WARNING]
> ส่วนของ endpoint นี้กำลังอยู่ในระหว่างการพัฒนาและคาดว่าจะปล่อยใช้งานในปี 2024 ในระหว่างนี้กรุณาใช้ไคลเอนต์ IMAP จากเมนู "Apps" ในแถบนำทางของเว็บไซต์ของเรา

### รายการโฟลเดอร์ {#list-folders}

> `GET /v1/folders`

**เร็วๆ นี้**

### สร้างโฟลเดอร์ {#create-folder}

> `POST /v1/folders`

**เร็วๆ นี้**

### ดึงข้อมูลโฟลเดอร์ {#retrieve-folder}

> `GET /v1/folders/:id`

**เร็วๆ นี้**

### อัปเดตโฟลเดอร์ {#update-folder}

> `PUT /v1/folders/:id`

**เร็วๆ นี้**

### ลบโฟลเดอร์ {#delete-folder}

> `DELETE /v1/folders/:id`

**เร็วๆ นี้**

### คัดลอกโฟลเดอร์ {#copy-folder}

> `POST /v1/folders/:id/copy`

**เร็วๆ นี้**


## อีเมลขาออก {#outbound-emails}

โปรดตรวจสอบว่าคุณได้ทำตามคำแนะนำการตั้งค่าสำหรับโดเมนของคุณแล้ว

คำแนะนำเหล่านี้สามารถดูได้ที่ [บัญชีของฉัน → โดเมน → การตั้งค่า → การกำหนดค่า SMTP ขาออก](/my-account/domains) คุณต้องตั้งค่า DKIM, Return-Path และ DMARC สำหรับการส่ง SMTP ขาออกด้วยโดเมนของคุณ
### รับขีดจำกัดอีเมล SMTP ขาออก {#get-outbound-smtp-email-limit}

นี่คือ endpoint ง่ายๆ ที่ส่งกลับวัตถุ JSON ซึ่งประกอบด้วย `count` และ `limit` สำหรับจำนวนข้อความ SMTP ขาออกรายวันในแต่ละบัญชี

> `GET /v1/emails/limit`

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### รายการอีเมล SMTP ขาออก {#list-outbound-smtp-emails}

โปรดทราบว่า endpoint นี้จะไม่ส่งค่าคุณสมบัติสำหรับ `message`, `headers` หรือ `rejectedErrors` ของอีเมลกลับมา

หากต้องการส่งคืนคุณสมบัติเหล่านั้นและค่าของพวกมัน โปรดใช้ endpoint [Retrieve email](#retrieve-email) พร้อมกับ ID ของอีเมล

> `GET /v1/emails`

| Querystring Parameter | Required | Type                      | Description                                                                                                                                      |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | No       | String (RegExp supported) | ค้นหาอีเมลโดยใช้เมตาดาต้า                                                                                                                     |
| `domain`              | No       | String (RegExp supported) | ค้นหาอีเมลโดยใช้ชื่อโดเมน                                                                                                                      |
| `sort`                | No       | String                    | เรียงลำดับตามฟิลด์เฉพาะ (เติมเครื่องหมายลบ `-` หน้าฟิลด์เพื่อเรียงลำดับในทิศทางย้อนกลับ) ค่าเริ่มต้นคือ `created_at` หากไม่ได้ตั้งค่า                 |
| `page`                | No       | Number                    | ดูรายละเอียดเพิ่มเติมได้ที่ [Pagination](#pagination)                                                                                          |
| `limit`               | No       | Number                    | ดูรายละเอียดเพิ่มเติมได้ที่ [Pagination](#pagination)                                                                                          |

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### สร้างอีเมล SMTP ขาออก {#create-outbound-smtp-email}

API ของเราในการสร้างอีเมลได้รับแรงบันดาลใจและใช้การตั้งค่าตัวเลือกข้อความของ Nodemailer โปรดดูที่ [Nodemailer message configuration](https://nodemailer.com/message/) สำหรับพารามิเตอร์เนื้อหาทั้งหมดด้านล่างนี้

โปรดทราบว่า นอกจาก `envelope` และ `dkim` (ซึ่งเราจะตั้งค่าให้อัตโนมัติ) แล้ว เรารองรับตัวเลือก Nodemailer ทั้งหมด เราจะตั้งค่า `disableFileAccess` และ `disableUrlAccess` เป็น `true` โดยอัตโนมัติเพื่อความปลอดภัย

คุณควรส่งพารามิเตอร์ตัวเลือกเดียวคือ `raw` พร้อมอีเมลฉบับเต็มแบบ raw รวมทั้ง headers **หรือ** ส่งพารามิเตอร์ตัวเลือกเนื้อหาแต่ละตัวด้านล่างนี้

API endpoint นี้จะเข้ารหัสอิโมจิให้โดยอัตโนมัติหากพบใน headers (เช่น หัวเรื่อง `Subject: 🤓 Hello` จะถูกแปลงเป็น `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello` โดยอัตโนมัติ) เป้าหมายของเราคือการสร้าง API อีเมลที่เป็นมิตรกับนักพัฒนาและใช้งานง่ายมาก

**การยืนยันตัวตน:** Endpoint นี้รองรับทั้ง [API token authentication](#api-token-authentication-recommended-for-most-endpoints) และ [alias credentials authentication](#alias-credentials-authentication-for-outbound-email) ดูรายละเอียดในส่วน [Authentication](#authentication) ข้างต้น

> `POST /v1/emails`

| Body Parameter   | Required | Type             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | No       | String (Email)   | ที่อยู่อีเมลของผู้ส่ง (ต้องมีอยู่ในฐานะ alias ของโดเมน)                                                                                                                                                                                                                                                                                                                                                                                                        |
| `to`             | No       | String or Array  | รายชื่อผู้รับใน header "To" แยกด้วยเครื่องหมายจุลภาค หรือเป็น Array                                                                                                                                                                                                                                                                                                                                                                                            |
| `cc`             | No       | String or Array  | รายชื่อผู้รับใน header "Cc" แยกด้วยเครื่องหมายจุลภาค หรือเป็น Array                                                                                                                                                                                                                                                                                                                                                                                            |
| `bcc`            | No       | String or Array  | รายชื่อผู้รับใน header "Bcc" แยกด้วยเครื่องหมายจุลภาค หรือเป็น Array                                                                                                                                                                                                                                                                                                                                                                                           |
| `subject`        | No       | String           | หัวเรื่องของอีเมล                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `text`           | No       | String or Buffer | เวอร์ชันข้อความธรรมดาของข้อความ                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `html`           | No       | String or Buffer | เวอร์ชัน HTML ของข้อความ                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `attachments`    | No       | Array            | อาร์เรย์ของวัตถุแนบไฟล์ (ดู [Nodemailer's common fields](https://nodemailer.com/message/#common-fields))                                                                                                                                                                                                                                                                                                                                                      |
| `sender`         | No       | String           | ที่อยู่อีเมลสำหรับ header "Sender" (ดู [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields))                                                                                                                                                                                                                                                                                                                             |
| `replyTo`        | No       | String           | ที่อยู่อีเมลสำหรับ header "Reply-To"                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `inReplyTo`      | No       | String           | Message-ID ที่ข้อความนี้เป็นการตอบกลับ                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `references`     | No       | String or Array  | รายการ Message-ID แยกด้วยช่องว่าง หรือเป็น Array                                                                                                                                                                                                                                                                                                                                                                                                               |
| `attachDataUrls` | No       | Boolean          | หากเป็น `true` จะเปลี่ยนรูปภาพ `data:` ในเนื้อหา HTML ของข้อความเป็นไฟล์แนบฝังตัว                                                                                                                                                                                                                                                                                                                                                                             |
| `watchHtml`      | No       | String           | เวอร์ชัน HTML เฉพาะสำหรับ Apple Watch ([ตามเอกสาร Nodemailer](https://nodemailer.com/message/#content-options)) นาฬิกาล่าสุดไม่จำเป็นต้องตั้งค่านี้                                                                                                                                                                                                                                                                                                         |
| `amp`            | No       | String           | เวอร์ชัน HTML เฉพาะสำหรับ AMP4EMAIL (ดู [ตัวอย่าง Nodemailer](https://nodemailer.com/message/#amp-example))                                                                                                                                                                                                                                                                                                                                                   |
| `icalEvent`      | No       | Object           | เหตุการณ์ iCalendar ที่ใช้เป็นเนื้อหาข้อความทางเลือก (ดู [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/))                                                                                                                                                                                                                                                                                                                   |
| `alternatives`   | No       | Array            | อาร์เรย์ของเนื้อหาข้อความทางเลือก (ดู [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/))                                                                                                                                                                                                                                                                                                                                      |
| `encoding`       | No       | String           | การเข้ารหัสสำหรับข้อความ text และ HTML (ค่าเริ่มต้นคือ `"utf-8"` แต่รองรับ `"hex"` และ `"base64"` ด้วย)                                                                                                                                                                                                                                                                                                                                                       |
| `raw`            | No       | String or Buffer | ข้อความที่สร้างขึ้นเองในรูปแบบ RFC822 เพื่อใช้แทนข้อความที่สร้างโดย Nodemailer (ดู [Nodemailer's custom source](https://nodemailer.com/message/custom-source/))                                                                                                                                                                                                                                                                                             |
| `textEncoding`   | No       | String           | การเข้ารหัสที่บังคับใช้กับค่าข้อความ (เป็น `"quoted-printable"` หรือ `"base64"`) ค่าเริ่มต้นคือค่าที่ตรวจพบใกล้เคียงที่สุด (สำหรับ ASCII ใช้ `"quoted-printable"`)                                                                                                                                                                                                                                                                                     |
| `priority`       | No       | String           | ระดับความสำคัญของอีเมล (สามารถเป็น `"high"`, `"normal"` (ค่าเริ่มต้น), หรือ `"low"`) โปรดทราบว่าค่า `"normal"` จะไม่ตั้ง header ความสำคัญ (นี่คือพฤติกรรมเริ่มต้น) หากตั้งค่าเป็น `"high"` หรือ `"low"` จะมีการตั้งค่า header `X-Priority`, `X-MSMail-Priority`, และ `Importance` [ตามที่กำหนด](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240) |
| `headers`        | No       | Object or Array  | อ็อบเจ็กต์หรืออาร์เรย์ของฟิลด์ header เพิ่มเติมที่ต้องการตั้งค่า (ดู [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/))                                                                                                                                                                                                                                                                                                      |
| `messageId`      | No       | String           | ค่าตัวเลือก Message-ID สำหรับ header "Message-ID" (จะสร้างค่าเริ่มต้นให้อัตโนมัติหากไม่ได้ตั้งค่า – โปรดทราบว่าค่าควร [เป็นไปตามข้อกำหนด RFC2822](https://stackoverflow.com/a/4031705))                                                                                                                                                                                                                                                               |
| `date`           | No       | String or Date   | ค่าวันที่ตัวเลือกที่จะใช้หาก header วันที่หายไปหลังการแยกวิเคราะห์ มิฉะนั้นจะใช้สตริง UTC ปัจจุบันหากไม่ได้ตั้งค่า header วันที่ไม่สามารถล่วงหน้ากว่าเวลาปัจจุบันเกิน 30 วัน                                                                                                                                            |
| `list`           | No       | Object           | อ็อบเจ็กต์ตัวเลือกของ header `List-*` (ดู [Nodemailer's list headers](https://nodemailer.com/message/list-headers/))                                                                                                                                                                                                                                                                                                                                          |
> ตัวอย่างคำขอ (API Token):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> ตัวอย่างคำขอ (ข้อมูลรับรอง Alias):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> ตัวอย่างคำขอ (อีเมลดิบ):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### ดึงอีเมล SMTP ขาออก {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### ลบอีเมล SMTP ขาออก {#delete-outbound-smtp-email}

การลบอีเมลจะตั้งสถานะเป็น `"rejected"` (และจะไม่ประมวลผลในคิวต่อไป) ก็ต่อเมื่อสถานะปัจจุบันเป็นหนึ่งใน `"pending"`, `"queued"`, หรือ `"deferred"` เท่านั้น เราอาจลบอีเมลโดยอัตโนมัติหลังจาก 30 วันนับตั้งแต่สร้างและ/หรือส่งแล้ว – ดังนั้นคุณควรเก็บสำเนาอีเมล SMTP ขาออกไว้ในไคลเอนต์ ฐานข้อมูล หรือแอปพลิเคชันของคุณ คุณสามารถอ้างอิงค่า ID อีเมลของเราในฐานข้อมูลของคุณได้หากต้องการ – ค่านี้จะถูกส่งกลับจากทั้ง [สร้างอีเมล](#create-email) และ [ดึงอีเมล](#retrieve-email) endpoints

> `DELETE /v1/emails/:id`

> ตัวอย่างคำขอ:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## โดเมน {#domains}

> \[!TIP]
> endpoints ของโดเมนที่ใช้ชื่อโดเมน <code>/v1/domains/:domain_name</code> เป็น endpoint สามารถใช้แทนกันได้กับ ID ของโดเมน <code>:domain_id</code> ซึ่งหมายความว่าคุณสามารถอ้างอิงโดเมนโดยใช้ค่า <code>name</code> หรือ <code>id</code> ก็ได้

### รายการโดเมน {#list-domains}

> \[!NOTE]
> ตั้งแต่วันที่ 1 พฤศจิกายน 2024 เป็นต้นไป API endpoints สำหรับ [รายการโดเมน](#list-domains) และ [รายการนามแฝงโดเมน](#list-domain-aliases) จะตั้งค่าเริ่มต้นเป็นผลลัพธ์สูงสุด `1000` รายการต่อหน้า หากคุณต้องการเลือกใช้พฤติกรรมนี้ก่อนเวลา คุณสามารถส่ง `?paginate=true` เป็นพารามิเตอร์ querystring เพิ่มเติมใน URL ของ endpoint นั้น ดูรายละเอียดเพิ่มเติมได้ที่ [การแบ่งหน้า](#pagination)

> `GET /v1/domains`

| Querystring Parameter | Required | Type                      | คำอธิบาย                                                                                                                                          |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | ไม่จำเป็น | String (รองรับ RegExp)    | ค้นหาโดเมนตามชื่อ                                                                                                                                |
| `name`                | ไม่จำเป็น | String (รองรับ RegExp)    | ค้นหาโดเมนตามชื่อ                                                                                                                                |
| `sort`                | ไม่จำเป็น | String                    | เรียงลำดับตามฟิลด์เฉพาะ (เติมเครื่องหมายลบ `-` หน้าฟิลด์เพื่อเรียงลำดับย้อนกลับ) ค่าเริ่มต้นคือ `created_at` หากไม่ได้ตั้งค่า                      |
| `page`                | ไม่จำเป็น | Number                    | ดูรายละเอียดเพิ่มเติมได้ที่ [การแบ่งหน้า](#pagination)                                                                                          |
| `limit`               | ไม่จำเป็น | Number                    | ดูรายละเอียดเพิ่มเติมได้ที่ [การแบ่งหน้า](#pagination)                                                                                          |

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### สร้างโดเมน {#create-domain}

> `POST /v1/domains`

| Body Parameter                 | Required | Type                                          | คำอธิบาย                                                                                                                                                                                                                                                                                                          |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | ใช่      | String (FQDN หรือ IP)                         | ชื่อโดเมนเต็มรูปแบบ ("FQDN") หรือที่อยู่ IP                                                                                                                                                                                                                                                                       |
| `team_domain`                  | ไม่จำเป็น | String (ID โดเมน หรือชื่อโดเมน; FQDN)         | กำหนดโดเมนนี้ให้อัตโนมัติกับทีมเดียวกันกับโดเมนอื่น ซึ่งหมายความว่าสมาชิกทั้งหมดจากโดเมนนี้จะถูกกำหนดเป็นสมาชิกทีม และ `plan` จะถูกตั้งค่าเป็น `team` โดยอัตโนมัติ คุณสามารถตั้งค่าเป็น `"none"` หากต้องการปิดใช้งานอย่างชัดเจน แต่ไม่จำเป็นต้องทำเช่นนั้น                     |
| `plan`                         | ไม่จำเป็น | String (ค่าที่กำหนดได้)                       | ประเภทแผน (ต้องเป็น `"free"`, `"enhanced_protection"`, หรือ `"team"` ค่าเริ่มต้นคือ `"free"` หรือแผนชำระเงินปัจจุบันของผู้ใช้หากมี)                                                                                                                                                                               |
| `catchall`                     | ไม่จำเป็น | String (ที่อยู่อีเมลที่คั่นด้วยตัวคั่น) หรือ Boolean | สร้างนามแฝง catch-all เริ่มต้น ค่าเริ่มต้นเป็น `true` (ถ้าเป็น `true` จะใช้ที่อยู่อีเมลของผู้ใช้ API เป็นผู้รับ และถ้าเป็น `false` จะไม่สร้าง catch-all) หากส่งเป็น String จะเป็นรายการที่อยู่อีเมลที่คั่นด้วยตัวคั่นเพื่อใช้เป็นผู้รับ (แยกด้วยการขึ้นบรรทัดใหม่ ช่องว่าง และ/หรือจุลภาค)     |
| `has_adult_content_protection` | ไม่จำเป็น | Boolean                                       | เปิดใช้งานการป้องกันเนื้อหาผู้ใหญ่ของ Spam Scanner บนโดเมนนี้                                                                                                                                                                                                                                                   |
| `has_phishing_protection`      | ไม่จำเป็น | Boolean                                       | เปิดใช้งานการป้องกันฟิชชิ่งของ Spam Scanner บนโดเมนนี้                                                                                                                                                                                                                                                          |
| `has_executable_protection`    | ไม่จำเป็น | Boolean                                       | เปิดใช้งานการป้องกันไฟล์ปฏิบัติการของ Spam Scanner บนโดเมนนี้                                                                                                                                                                                                                                                  |
| `has_virus_protection`         | ไม่จำเป็น | Boolean                                       | เปิดใช้งานการป้องกันไวรัสของ Spam Scanner บนโดเมนนี้                                                                                                                                                                                                                                                           |
| `has_recipient_verification`   | ไม่จำเป็น | Boolean                                       | ค่าเริ่มต้นทั่วโลกของโดเมนสำหรับการบังคับให้ผู้รับนามแฝงคลิกที่ลิงก์ยืนยันอีเมลเพื่อให้อีเมลไหลผ่าน                                                                                                                                                                                                             |
| `ignore_mx_check`              | ไม่จำเป็น | Boolean                                       | เลือกที่จะไม่ตรวจสอบระเบียน MX ของโดเมนสำหรับการยืนยัน ซึ่งเหมาะสำหรับผู้ใช้ที่มีการตั้งค่ากฎการแลกเปลี่ยน MX ขั้นสูงและต้องการเก็บการแลกเปลี่ยน MX เดิมไว้แล้วส่งต่อไปยังของเรา                                                                                                                        |
| `retention_days`               | ไม่จำเป็น | Number                                        | จำนวนเต็มระหว่าง `0` ถึง `30` ที่ระบุจำนวนวันเก็บรักษาอีเมล SMTP ขาออกหลังจากส่งสำเร็จหรือเกิดข้อผิดพลาดถาวร ค่าเริ่มต้นคือ `0` ซึ่งหมายความว่าอีเมล SMTP ขาออกจะถูกลบและแก้ไขข้อมูลทันทีเพื่อความปลอดภัยของคุณ                                                                                     |
| `bounce_webhook`               | ไม่จำเป็น | String (URL) หรือ Boolean (false)             | URL webhook `http://` หรือ `https://` ที่คุณเลือกสำหรับส่ง webhook การเด้งกลับ เราจะส่งคำขอ `POST` ไปยัง URL นี้พร้อมข้อมูลเกี่ยวกับความล้มเหลวของ SMTP ขาออก (เช่น ความล้มเหลวแบบนุ่มนวลหรือรุนแรง – เพื่อให้คุณจัดการสมาชิกและจัดการอีเมลขาออกของคุณได้อย่างเป็นโปรแกรม)                        |
| `max_quota_per_alias`          | ไม่จำเป็น | String                                        | ขีดจำกัดพื้นที่เก็บข้อมูลสูงสุดสำหรับนามแฝงในชื่อโดเมนนี้ ป้อนค่าเช่น "1 GB" ซึ่งจะถูกแปลงโดย [bytes](https://github.com/visionmedia/bytes.js)                                                                                                                                                        |
> ตัวอย่างคำขอ:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### ดึงข้อมูลโดเมน {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### ตรวจสอบระเบียนโดเมน {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### ตรวจสอบระเบียน SMTP ของโดเมน {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### รายการรหัสผ่าน catch-all ทั่วโดเมน {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### สร้างรหัสผ่าน catch-all ทั่วโดเมน {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body Parameter | Required | Type   | Description                                                                                                                                                                                                               |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | No       | String | รหัสผ่านใหม่ที่คุณกำหนดเองสำหรับใช้เป็นรหัสผ่าน catch-all ทั่วโดเมน  โปรดทราบว่าคุณสามารถเว้นว่างหรือละเว้นพารามิเตอร์นี้ในคำขอ API ของคุณได้หากต้องการให้ระบบสร้างรหัสผ่านที่แข็งแรงแบบสุ่มให้แทน  รหัสผ่านกล่องจดหมายที่กำหนดเองต้องมีความยาวไม่เกิน 128 อักขระ ห้ามขึ้นต้นหรือขึ้นท้ายด้วยช่องว่าง และห้ามมีเครื่องหมายคำพูดหรืออัพอสทรอฟี รหัสผ่าน catch-all ใช้สำหรับการส่ง SMTP เท่านั้น สำหรับการใช้งาน IMAP, POP3, CalDAV, CardDAV และการเข้าถึงกล่องจดหมาย ให้สร้างรหัสผ่านสำหรับนามแฝงเฉพาะแทน |
| `description`  | No       | String | คำอธิบายเพื่อวัตถุประสงค์ในการจัดระเบียบเท่านั้น                                                                                                                                                                         |

> ตัวอย่างคำขอ:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### ลบรหัสผ่าน catch-all ทั่วโดเมน {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> ตัวอย่างคำขอ:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### อัปเดตโดเมน {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parameter                 | Required | Type                            | Description                                                                                                                                                                                                                                                                                   |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                    | No       | String or Number                | พอร์ตที่กำหนดเองสำหรับตั้งค่าการส่งต่อ SMTP (ค่าเริ่มต้นคือ `"25"`)                                                                                                                                                                                                                         |
| `has_adult_content_protection` | No       | Boolean                         | เปิดใช้งานการป้องกันเนื้อหาผู้ใหญ่ของ Spam Scanner บนโดเมนนี้หรือไม่                                                                                                                                                                                                                         |
| `has_phishing_protection`      | No       | Boolean                         | เปิดใช้งานการป้องกันฟิชชิงของ Spam Scanner บนโดเมนนี้หรือไม่                                                                                                                                                                                                                                |
| `has_executable_protection`    | No       | Boolean                         | เปิดใช้งานการป้องกันไฟล์ปฏิบัติการของ Spam Scanner บนโดเมนนี้หรือไม่                                                                                                                                                                                                                         |
| `has_virus_protection`         | No       | Boolean                         | เปิดใช้งานการป้องกันไวรัสของ Spam Scanner บนโดเมนนี้หรือไม่                                                                                                                                                                                                                                  |
| `has_recipient_verification`   | No       | Boolean                         | ค่าเริ่มต้นทั่วโลกของโดเมนสำหรับการกำหนดว่าผู้รับอีเมลแบบนามแฝงต้องคลิกลิงก์ยืนยันอีเมลเพื่อให้อีเมลไหลผ่านหรือไม่                                                                                                                                                                         |
| `ignore_mx_check`              | No       | Boolean                         | กำหนดว่าจะละเว้นการตรวจสอบระเบียน MX บนโดเมนสำหรับการยืนยันหรือไม่  ซึ่งเหมาะสำหรับผู้ใช้ที่มีการตั้งค่ากฎการแลกเปลี่ยน MX ขั้นสูงและต้องการเก็บการแลกเปลี่ยน MX เดิมไว้แล้วส่งต่อไปยังของเรา                                                                           |
| `retention_days`               | No       | Number                          | จำนวนเต็มระหว่าง `0` ถึง `30` ที่ระบุจำนวนวันเก็บรักษาอีเมล SMTP ขาออกหลังจากส่งสำเร็จหรือเกิดข้อผิดพลาดถาวร  ค่าเริ่มต้นคือ `0` ซึ่งหมายความว่าอีเมล SMTP ขาออกจะถูกลบและแก้ไขข้อมูลทันทีเพื่อความปลอดภัยของคุณ                                                        |
| `bounce_webhook`               | No       | String (URL) or Boolean (false) | URL webhook แบบ `http://` หรือ `https://` ที่คุณเลือกสำหรับส่ง webhook การเด้งกลับ เราจะส่งคำขอ `POST` ไปยัง URL นี้พร้อมข้อมูลเกี่ยวกับความล้มเหลวของ SMTP ขาออก (เช่น ความล้มเหลวแบบนุ่มนวลหรือรุนแรง – เพื่อให้คุณจัดการผู้สมัครรับข้อมูลและจัดการอีเมลขาออกของคุณได้อย่างเป็นโปรแกรม) |
| `max_quota_per_alias`          | No       | String                          | โควต้าสูงสุดของพื้นที่เก็บข้อมูลสำหรับนามแฝงบนชื่อโดเมนนี้  ป้อนค่าตัวอย่างเช่น "1 GB" ซึ่งจะถูกแปลงโดย [bytes](https://github.com/visionmedia/bytes.js)                                                                                                                                 |
> ตัวอย่างคำขอ:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### ลบโดเมน {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> ตัวอย่างคำขอ:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## คำเชิญ {#invites}

### ยอมรับคำเชิญโดเมน {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### สร้างคำเชิญโดเมน {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| ตัวแปรในเนื้อหา | จำเป็น | ประเภท              | คำอธิบาย                                                                                  |
| -------------- | ------ | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`        | ใช่    | สตริง (อีเมล)      | ที่อยู่อีเมลที่จะเชิญเข้าร่วมรายชื่อสมาชิกโดเมน                                         |
| `group`        | ใช่    | สตริง (แบบเลือกได้) | กลุ่มที่จะเพิ่มผู้ใช้เข้าสู่สมาชิกโดเมน (สามารถเป็น `"admin"` หรือ `"user"`)             |

> ตัวอย่างคำขอ:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> หากผู้ใช้ที่ถูกเชิญเป็นสมาชิกที่ยอมรับแล้วของโดเมนอื่นใดที่แอดมินที่เชิญเป็นสมาชิกอยู่ด้วย ระบบจะยอมรับคำเชิญโดยอัตโนมัติและจะไม่ส่งอีเมล

### ลบคำเชิญโดเมน {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| ตัวแปรในเนื้อหา | จำเป็น | ประเภท           | คำอธิบาย                                      |
| -------------- | ------ | ---------------- | ---------------------------------------------- |
| `email`        | ใช่    | สตริง (อีเมล)   | ที่อยู่อีเมลที่จะลบออกจากรายชื่อสมาชิกโดเมน |

> ตัวอย่างคำขอ:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## สมาชิก {#members}

### อัปเดตสมาชิกโดเมน {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| ตัวแปรในเนื้อหา | จำเป็น | ประเภท              | คำอธิบาย                                                                                  |
| -------------- | ------ | ------------------- | ------------------------------------------------------------------------------------------ |
| `group`        | ใช่    | สตริง (แบบเลือกได้) | กลุ่มที่จะอัปเดตผู้ใช้เข้าสู่สมาชิกโดเมน (สามารถเป็น `"admin"` หรือ `"user"`)             |

> ตัวอย่างคำขอ:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### ลบสมาชิกโดเมน {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> ตัวอย่างคำขอ:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## นามแฝง {#aliases}

### สร้างรหัสผ่านนามแฝง {#generate-an-alias-password}

โปรดทราบว่าหากคุณไม่ส่งอีเมลคำแนะนำ รหัสผู้ใช้และรหัสผ่านจะอยู่ในเนื้อหาการตอบกลับ JSON ของคำขอที่สำเร็จในรูปแบบ `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| ตัวแปรในเนื้อหา       | จำเป็น | ประเภท   | คำอธิบาย                                                                                                                                                                                                                                                                                         |
| ---------------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | ไม่ใช่ | สตริง   | รหัสผ่านใหม่ที่คุณกำหนดเองสำหรับนามแฝง โปรดทราบว่าคุณสามารถเว้นว่างหรือละเว้นตัวแปรนี้จากเนื้อหา API หากต้องการรับรหัสผ่านที่สร้างขึ้นแบบสุ่มและแข็งแรง                                                                                                                                     รหัสผ่านกล่องจดหมายที่กำหนดเองต้องมีความยาวไม่เกิน 128 อักขระ ห้ามขึ้นต้นหรือขึ้นท้ายด้วยช่องว่าง และห้ามมีเครื่องหมายคำพูดหรืออัพอสทรอฟี |
| `password`             | ไม่ใช่ | สตริง   | รหัสผ่านเดิมของนามแฝงเพื่อเปลี่ยนรหัสผ่านโดยไม่ลบที่เก็บข้อมูล IMAP เดิม (ดูตัวเลือก `is_override` ด้านล่างหากคุณไม่มีรหัสผ่านเดิมแล้ว)                                                                                                                                                     |
| `is_override`          | ไม่ใช่ | บูลีน   | **ใช้ด้วยความระมัดระวัง**: ตัวเลือกนี้จะเขียนทับรหัสผ่านนามแฝงและฐานข้อมูลเดิมทั้งหมด และจะลบที่เก็บข้อมูล IMAP เดิมอย่างถาวรและรีเซ็ตฐานข้อมูลอีเมล SQLite ของนามแฝงทั้งหมด โปรดสำรองข้อมูลหากเป็นไปได้หากคุณมีตู้จดหมายที่แนบกับนามแฝงนี้อยู่                                                                                   |
| `emailed_instructions` | ไม่ใช่ | สตริง   | ที่อยู่อีเมลที่จะส่งรหัสผ่านนามแฝงและคำแนะนำการตั้งค่าไปให้                                                                                                                                                                                                                                    |
> ตัวอย่างคำขอ:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### รายการชื่อโดเมนแฝง {#list-domain-aliases}

> \[!NOTE]
> ตั้งแต่วันที่ 1 พฤศจิกายน 2024 เป็นต้นไป API endpoints สำหรับ [รายการโดเมน](#list-domains) และ [รายการชื่อโดเมนแฝง](#list-domain-aliases) จะตั้งค่าเริ่มต้นเป็นผลลัพธ์สูงสุด `1000` รายการต่อหน้า หากคุณต้องการเลือกใช้พฤติกรรมนี้ก่อนเวลา คุณสามารถส่ง `?paginate=true` เป็นพารามิเตอร์ querystring เพิ่มเติมไปยัง URL สำหรับการเรียก endpoint นั้น ดูรายละเอียดเพิ่มเติมได้ที่ [การแบ่งหน้า](#pagination)

> `GET /v1/domains/DOMAIN_NAME/aliases`

| พารามิเตอร์ Querystring | จำเป็น | ประเภท                      | คำอธิบาย                                                                                                                                      |
| ------------------------ | ------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                      | ไม่     | String (รองรับ RegExp)       | ค้นหาชื่อโดเมนแฝงในโดเมนโดยใช้ชื่อ, ป้ายกำกับ หรือผู้รับ                                                                                      |
| `name`                   | ไม่     | String (รองรับ RegExp)       | ค้นหาชื่อโดเมนแฝงในโดเมนโดยใช้ชื่อ                                                                                                           |
| `recipient`              | ไม่     | String (รองรับ RegExp)       | ค้นหาชื่อโดเมนแฝงในโดเมนโดยใช้ผู้รับ                                                                                                        |
| `sort`                   | ไม่     | String                      | เรียงลำดับตามฟิลด์เฉพาะ (เติมเครื่องหมายลบ `-` หน้าฟิลด์เพื่อเรียงลำดับในทิศทางย้อนกลับ) ค่าเริ่มต้นคือ `created_at` หากไม่ได้ตั้งค่า                 |
| `page`                   | ไม่     | Number                      | ดูรายละเอียดเพิ่มเติมได้ที่ [การแบ่งหน้า](#pagination)                                                                                       |
| `limit`                  | ไม่     | Number                      | ดูรายละเอียดเพิ่มเติมได้ที่ [การแบ่งหน้า](#pagination)                                                                                       |

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### สร้างชื่อโดเมนแฝงใหม่ {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| พารามิเตอร์ใน Body             | จำเป็น | ประเภท                                   | คำอธิบาย                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------ | ------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                         | ไม่     | String                                   | ชื่อโดเมนแฝง (ถ้าไม่ระบุหรือเว้นว่าง จะสร้างชื่อโดเมนแฝงแบบสุ่ม)                                                                                                                                                                                                                                                                                                                        |
| `recipients`                   | ไม่     | String หรือ Array                        | รายชื่อผู้รับ (ต้องเป็น String ที่แยกด้วยการขึ้นบรรทัดใหม่/เว้นวรรค/คอมม่า หรือ Array ของที่อยู่อีเมลที่ถูกต้อง, ชื่อโดเมนที่สมบูรณ์ ("FQDN"), ที่อยู่ IP และ/หรือ URL webhook – และถ้าไม่ระบุหรือเป็น Array ว่าง จะตั้งค่าอีเมลของผู้ใช้ที่ทำคำขอ API เป็นผู้รับ)                                                                                     |
| `description`                  | ไม่     | String                                   | คำอธิบายของชื่อโดเมนแฝง                                                                                                                                                                                                                                                                                                                                                                   |
| `labels`                      | ไม่     | String หรือ Array                        | รายการป้ายกำกับ (ต้องเป็น String ที่แยกด้วยการขึ้นบรรทัดใหม่/เว้นวรรค/คอมม่า หรือ Array)                                                                                                                                                                                                                                                                                                 |
| `has_recipient_verification`   | ไม่     | Boolean                                  | ต้องการให้ผู้รับคลิกลิงก์ยืนยันอีเมลเพื่อให้อีเมลไหลผ่าน (ค่าเริ่มต้นจะใช้การตั้งค่าของโดเมนถ้าไม่ได้ตั้งค่าอย่างชัดเจนใน body ของคำขอ)                                                                                                                                                                                                                                              |
| `is_enabled`                   | ไม่     | Boolean                                  | เปิดใช้งานหรือปิดใช้งานชื่อโดเมนแฝงนี้ (ถ้าปิดใช้งาน อีเมลจะไม่ถูกส่งไปที่ใดแต่จะส่งสถานะสำเร็จกลับ หากส่งค่ามา จะถูกแปลงเป็น boolean โดยใช้ [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`       | ไม่     | Number (เป็น `250`, `421` หรือ `550`)    | อีเมลขาเข้าที่ส่งไปยังชื่อโดเมนแฝงนี้จะถูกปฏิเสธถ้า `is_enabled` เป็น `false` โดยใช้รหัส `250` (ส่งเงียบๆ ไปยังที่ว่าง เช่น blackhole หรือ `/dev/null`), `421` (ปฏิเสธแบบชั่วคราว; และจะลองส่งใหม่ประมาณ ~5 วัน) หรือ `550` (ล้มเหลวถาวรและปฏิเสธ) ค่าเริ่มต้นคือ `250`                                                                                   |
| `has_imap`                    | ไม่     | Boolean                                  | เปิดหรือปิดการเก็บอีเมลผ่าน IMAP สำหรับชื่อโดเมนแฝงนี้ (ถ้าปิดใช้งาน อีเมลขาเข้าที่ได้รับจะไม่ถูกเก็บไว้ใน [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service) หากส่งค่ามา จะถูกแปลงเป็น boolean โดยใช้ [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                     | ไม่     | Boolean                                  | เปิดหรือปิดการเข้ารหัส [OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) สำหรับ [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) โดยใช้ `public_key` ของชื่อโดเมนแฝง                                                                                                                                          |
| `public_key`                  | ไม่     | String                                   | กุญแจสาธารณะ OpenPGP ในรูปแบบ ASCII Armor ([คลิกที่นี่เพื่อดูตัวอย่าง](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); เช่น กุญแจ GPG สำหรับ `support@forwardemail.net`) ใช้ได้เฉพาะเมื่อ `has_pgp` ตั้งค่าเป็น `true` เท่านั้น [เรียนรู้เพิ่มเติมเกี่ยวกับการเข้ารหัสแบบ end-to-end ใน FAQ ของเรา](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) |
| `max_quota`                   | ไม่     | String                                   | โควต้าสูงสุดของพื้นที่เก็บข้อมูลสำหรับชื่อโดเมนแฝงนี้ ปล่อยว่างเพื่อรีเซ็ตเป็นโควต้าปัจจุบันของโดเมน หรือใส่ค่าเช่น "1 GB" ซึ่งจะถูกแปลงโดย [bytes](https://github.com/visionmedia/bytes.js) ค่านี้สามารถปรับได้เฉพาะผู้ดูแลโดเมนเท่านั้น                                                                                                                                            |
| `vacation_responder_is_enabled` | ไม่     | Boolean                                  | เปิดหรือปิดการตอบกลับอัตโนมัติเมื่อไม่อยู่                                                                                                                                                                                                                                                                                                                                                   |
| `vacation_responder_start_date` | ไม่     | String                                   | วันที่เริ่มต้นสำหรับการตอบกลับอัตโนมัติเมื่อไม่อยู่ (ถ้าเปิดใช้งานและไม่ได้ตั้งค่าวันที่เริ่มต้นที่นี่ จะถือว่าเริ่มต้นแล้ว) รองรับรูปแบบวันที่เช่น `MM/DD/YYYY`, `YYYY-MM-DD` และรูปแบบวันที่อื่นๆ ผ่านการแปลงอัจฉริยะโดยใช้ `dayjs`                                                                                                                                                      |
| `vacation_responder_end_date`   | ไม่     | String                                   | วันที่สิ้นสุดสำหรับการตอบกลับอัตโนมัติเมื่อไม่อยู่ (ถ้าเปิดใช้งานและไม่ได้ตั้งค่าวันที่สิ้นสุดที่นี่ จะถือว่าไม่มีวันสิ้นสุดและตอบกลับตลอดไป) รองรับรูปแบบวันที่เช่น `MM/DD/YYYY`, `YYYY-MM-DD` และรูปแบบวันที่อื่นๆ ผ่านการแปลงอัจฉริยะโดยใช้ `dayjs`                                                                                                                                            |
| `vacation_responder_subject`    | ไม่     | String                                   | หัวข้อข้อความในรูปแบบข้อความธรรมดาสำหรับการตอบกลับอัตโนมัติเมื่อไม่อยู่ เช่น "ไม่อยู่ที่สำนักงาน" เราใช้ `striptags` เพื่อลบ HTML ทั้งหมดที่นี่                                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | ไม่     | String                                   | ข้อความในรูปแบบข้อความธรรมดาสำหรับการตอบกลับอัตโนมัติเมื่อไม่อยู่ เช่น "ฉันจะไม่อยู่ที่สำนักงานจนถึงเดือนกุมภาพันธ์" เราใช้ `striptags` เพื่อลบ HTML ทั้งหมดที่นี่                                                                                                                                                                                                                                               |
> ตัวอย่างคำขอ:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### ดึงข้อมูลโดเมนอาลิอัส {#retrieve-domain-alias}

คุณสามารถดึงข้อมูลโดเมนอาลิอัสได้โดยใช้ค่า `id` หรือ `name`

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> ตัวอย่างคำขอ:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### อัปเดตโดเมนอาลิอัส {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Body Parameter                  | Required | Type                                   | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | ไม่จำเป็น | String                                 | ชื่ออาลิอัส                                                                                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | ไม่จำเป็น | String หรือ Array                      | รายชื่อผู้รับ (ต้องเป็น String ที่คั่นด้วยการขึ้นบรรทัดใหม่/ช่องว่าง/คอมม่า หรือ Array ของที่อยู่อีเมลที่ถูกต้อง, ชื่อโดเมนที่ระบุอย่างสมบูรณ์ ("FQDN"), ที่อยู่ IP และ/หรือ URL เว็บฮุก)                                                                                                                                                                                                           |
| `description`                   | ไม่จำเป็น | String                                 | คำอธิบายอาลิอัส                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | ไม่จำเป็น | String หรือ Array                      | รายการป้ายกำกับ (ต้องเป็น String ที่คั่นด้วยการขึ้นบรรทัดใหม่/ช่องว่าง/คอมม่า หรือ Array)                                                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | ไม่จำเป็น | Boolean                                | กำหนดให้ผู้รับต้องคลิกลิงก์ยืนยันอีเมลเพื่อให้อีเมลสามารถส่งผ่านได้ (ค่าเริ่มต้นจะใช้การตั้งค่าของโดเมนหากไม่ได้ระบุในเนื้อหาคำขอ)                                                                                                                                                                                                                              |
| `is_enabled`                    | ไม่จำเป็น | Boolean                                | เปิดใช้งานหรือปิดใช้งานอาลิอัสนี้ (ถ้าปิดใช้งาน อีเมลจะไม่ถูกส่งไปที่ใดแต่จะส่งกลับสถานะสำเร็จ) หากส่งค่ามา จะถูกแปลงเป็น boolean โดยใช้ [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`        | ไม่จำเป็น | Number (เป็น `250`, `421` หรือ `550`) | อีเมลขาเข้าที่ส่งไปยังอาลิอัสนี้จะถูกปฏิเสธหาก `is_enabled` เป็น `false` โดยใช้รหัสสถานะ `250` (ส่งเงียบๆ ไปยังที่ว่าง เช่น blackhole หรือ `/dev/null`), `421` (ปฏิเสธแบบชั่วคราว; และจะลองส่งซ้ำประมาณ 5 วัน) หรือ `550` (ล้มเหลวถาวรและปฏิเสธ) ค่าเริ่มต้นคือ `250`                                                                                                                               |
| `has_imap`                      | ไม่จำเป็น | Boolean                                | เปิดหรือปิดการเก็บอีเมลผ่าน IMAP สำหรับอาลิอัสนี้ (ถ้าปิดใช้งาน อีเมลขาเข้าจะไม่ถูกเก็บไว้ใน [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service)) หากส่งค่ามา จะถูกแปลงเป็น boolean โดยใช้ [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                       | ไม่จำเป็น | Boolean                                | เปิดหรือปิดการเข้ารหัส [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) สำหรับ [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) โดยใช้ `public_key` ของอาลิอัส                                                                                                                                                                         |
| `public_key`                    | ไม่จำเป็น | String                                 | กุญแจสาธารณะ OpenPGP ในรูปแบบ ASCII Armor ([คลิกที่นี่เพื่อดูตัวอย่าง](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); เช่น กุญแจ GPG สำหรับ `support@forwardemail.net`) ใช้ได้เฉพาะเมื่อ `has_pgp` ตั้งค่าเป็น `true` เท่านั้น [เรียนรู้เพิ่มเติมเกี่ยวกับการเข้ารหัสแบบ end-to-end ใน FAQ ของเรา](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) |
| `max_quota`                     | ไม่จำเป็น | String                                 | โควต้าสูงสุดของพื้นที่เก็บข้อมูลสำหรับอาลิอัสนี้ ปล่อยว่างเพื่อรีเซ็ตเป็นโควต้าปัจจุบันของโดเมน หรือใส่ค่าเช่น "1 GB" ซึ่งจะถูกแปลงโดย [bytes](https://github.com/visionmedia/bytes.js) ค่านี้สามารถปรับได้เฉพาะผู้ดูแลโดเมนเท่านั้น                                                                                                                                      |
| `vacation_responder_is_enabled` | ไม่จำเป็น | Boolean                                | เปิดหรือปิดการตอบกลับอัตโนมัติขณะลาหยุด                                                                                                                                                                                                                                                                                                                               |
| `vacation_responder_start_date` | ไม่จำเป็น | String                                 | วันที่เริ่มต้นสำหรับการตอบกลับขณะลาหยุด (ถ้าเปิดใช้งานและไม่ได้ตั้งค่าวันที่เริ่มต้น จะถือว่าเริ่มแล้ว) รองรับรูปแบบวันที่เช่น `MM/DD/YYYY`, `YYYY-MM-DD` และรูปแบบวันที่อื่นๆ ผ่านการแปลงอัจฉริยะโดยใช้ `dayjs`                                                                                                                                                      |
| `vacation_responder_end_date`   | ไม่จำเป็น | String                                 | วันที่สิ้นสุดสำหรับการตอบกลับขณะลาหยุด (ถ้าเปิดใช้งานและไม่ได้ตั้งค่าวันที่สิ้นสุด จะถือว่าไม่มีวันสิ้นสุดและตอบกลับตลอดไป) รองรับรูปแบบวันที่เช่น `MM/DD/YYYY`, `YYYY-MM-DD` และรูปแบบวันที่อื่นๆ ผ่านการแปลงอัจฉริยะโดยใช้ `dayjs`                                                                                                                                            |
| `vacation_responder_subject`    | ไม่จำเป็น | String                                 | หัวข้อข้อความในรูปแบบข้อความธรรมดาสำหรับการตอบกลับขณะลาหยุด เช่น "ไม่อยู่ที่สำนักงาน" เราใช้ `striptags` เพื่อลบ HTML ทั้งหมดที่นี่                                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | ไม่จำเป็น | String                                 | ข้อความในรูปแบบข้อความธรรมดาสำหรับการตอบกลับขณะลาหยุด เช่น "ฉันจะไม่อยู่ที่สำนักงานจนถึงเดือนกุมภาพันธ์" เราใช้ `striptags` เพื่อลบ HTML ทั้งหมดที่นี่                                                                                                                                                                                                                                               |
> ตัวอย่างคำขอ:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### ลบโดเมนอาลิอัส {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> ตัวอย่างคำขอ:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## การเข้ารหัส {#encrypt}

เราช่วยให้คุณเข้ารหัสระเบียนได้แม้ในแผนฟรีโดยไม่มีค่าใช้จ่าย ความเป็นส่วนตัวไม่ควรเป็นเพียงฟีเจอร์ แต่มันควรถูกสร้างขึ้นโดยเนื้อแท้ในทุกแง่มุมของผลิตภัณฑ์ ตามที่มีการร้องขออย่างมากใน [การอภิปราย Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) และใน [ปัญหาบน GitHub ของเรา](https://github.com/forwardemail/forwardemail.net/issues/254) เราได้เพิ่มสิ่งนี้แล้ว

### เข้ารหัสระเบียน TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| ตัวแปรในเนื้อหา | จำเป็น | ประเภท  | คำอธิบาย                                  |
| -------------- | ------ | ------- | -------------------------------------------- |
| `input`        | ใช่     | String  | ระเบียน TXT แบบ plaintext ของ Forward Email ที่ถูกต้องใดๆ |

> ตัวอย่างคำขอ:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
