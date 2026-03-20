# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>สรุปสั้น ๆ:</strong> <a href="https://github.com/forwardemail/mcp-server">เซิร์ฟเวอร์ MCP แบบโอเพนซอร์สของเรา</a> ช่วยให้ผู้ช่วย AI อย่าง Claude, ChatGPT, Cursor และ Windsurf จัดการอีเมล โดเมน อลิอาส รายชื่อผู้ติดต่อ และปฏิทินของคุณผ่านภาษาธรรมชาติ ทั้ง 68 จุดเชื่อมต่อ API ถูกเปิดเผยเป็นเครื่องมือ MCP ทั้งหมด มันทำงานบนเครื่องของคุณผ่าน <code>npx @forwardemail/mcp-server</code> — ข้อมูลรับรองของคุณจะไม่ถูกส่งออกจากเครื่องของคุณ
</p>


## Table of Contents {#table-of-contents}

* [MCP คืออะไร?](#what-is-mcp)
* [เริ่มต้นอย่างรวดเร็ว](#quick-start)
  * [รับ API Key](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [ลูกค้า MCP อื่น ๆ](#other-mcp-clients)
* [การตรวจสอบสิทธิ์](#authentication)
  * [การตรวจสอบสิทธิ์ด้วย API Key](#api-key-auth)
  * [การตรวจสอบสิทธิ์ด้วย Alias](#alias-auth)
  * [การสร้างรหัสผ่าน Alias](#generating-an-alias-password)
* [เครื่องมือทั้ง 68 รายการ](#all-68-tools)
  * [บัญชี (API Key หรือ Alias Auth)](#account-api-key-or-alias-auth)
  * [โดเมน (API Key)](#domains-api-key)
  * [อลิอาส (API Key)](#aliases-api-key)
  * [อีเมล — SMTP ขาออก (API Key; Send รองรับทั้งสอง)](#emails--outbound-smtp-api-key-send-supports-both)
  * [ข้อความ — IMAP (Alias Auth)](#messages--imap-alias-auth)
  * [โฟลเดอร์ — IMAP (Alias Auth)](#folders--imap-alias-auth)
  * [รายชื่อผู้ติดต่อ — CardDAV (Alias Auth)](#contacts--carddav-alias-auth)
  * [ปฏิทิน — CalDAV (Alias Auth)](#calendars--caldav-alias-auth)
  * [กิจกรรมปฏิทิน — CalDAV (Alias Auth)](#calendar-events--caldav-alias-auth)
  * [สคริปต์ Sieve (API Key)](#sieve-scripts-api-key)
  * [สคริปต์ Sieve (Alias Auth)](#sieve-scripts-alias-auth)
  * [สมาชิกโดเมนและคำเชิญ (API Key)](#domain-members-and-invites-api-key)
  * [รหัสผ่าน Catch-All (API Key)](#catch-all-passwords-api-key)
  * [บันทึก (API Key)](#logs-api-key)
  * [การเข้ารหัส (ไม่ต้องตรวจสอบสิทธิ์)](#encrypt-no-auth)
* [20 กรณีใช้งานจริง](#20-real-world-use-cases)
  * [1. การคัดแยกอีเมล](#1-email-triage)
  * [2. การตั้งค่าโดเมนอัตโนมัติ](#2-domain-setup-automation)
  * [3. การจัดการอลิอาสจำนวนมาก](#3-bulk-alias-management)
  * [4. การติดตามแคมเปญอีเมล](#4-email-campaign-monitoring)
  * [5. การซิงค์และทำความสะอาดรายชื่อผู้ติดต่อ](#5-contact-sync-and-cleanup)
  * [6. การจัดการปฏิทิน](#6-calendar-management)
  * [7. การทำงานอัตโนมัติของสคริปต์ Sieve](#7-sieve-script-automation)
  * [8. การเริ่มต้นทีม](#8-team-onboarding)
  * [9. การตรวจสอบความปลอดภัย](#9-security-auditing)
  * [10. การตั้งค่าการส่งต่ออีเมล](#10-email-forwarding-setup)
  * [11. การค้นหาและวิเคราะห์กล่องจดหมาย](#11-inbox-search-and-analysis)
  * [12. การจัดระเบียบโฟลเดอร์](#12-folder-organization)
  * [13. การหมุนรหัสผ่าน](#13-password-rotation)
  * [14. การเข้ารหัสระเบียน DNS](#14-dns-record-encryption)
  * [15. การวิเคราะห์บันทึกการส่ง](#15-delivery-log-analysis)
  * [16. การจัดการหลายโดเมน](#16-multi-domain-management)
  * [17. การตั้งค่า Catch-All](#17-catch-all-configuration)
  * [18. การจัดการคำเชิญโดเมน](#18-domain-invite-management)
  * [19. การทดสอบที่เก็บ S3](#19-s3-storage-testing)
  * [20. การร่างอีเมล](#20-email-draft-composition)
* [ตัวอย่างคำสั่ง](#example-prompts)
* [ตัวแปรสภาพแวดล้อม](#environment-variables)
* [ความปลอดภัย](#security)
* [การใช้งานแบบโปรแกรม](#programmatic-usage)
* [โอเพนซอร์ส](#open-source)


## MCP คืออะไร? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) คือมาตรฐานเปิดที่สร้างโดย Anthropic ซึ่งช่วยให้โมเดล AI เรียกใช้เครื่องมือภายนอกได้อย่างปลอดภัย แทนที่จะคัดลอกและวางการตอบสนอง API ลงในหน้าต่างแชท MCP ให้โมเดลเข้าถึงบริการของคุณโดยตรงและมีโครงสร้าง

เซิร์ฟเวอร์ MCP ของเราห่อหุ้ม [Forward Email API](/email-api) ทั้งหมด — ทุกจุดเชื่อมต่อ ทุกพารามิเตอร์ — และเปิดเผยเป็นเครื่องมือที่ลูกค้า MCP ที่รองรับสามารถใช้ได้ เซิร์ฟเวอร์ทำงานบนเครื่องของคุณโดยใช้การสื่อสารแบบ stdio ข้อมูลรับรองของคุณจะเก็บไว้ในตัวแปรสภาพแวดล้อมและไม่เคยถูกส่งไปยังโมเดล AI


## เริ่มต้นอย่างรวดเร็ว {#quick-start}

### รับ API Key {#get-an-api-key}
1. เข้าสู่ระบบบัญชี [Forward Email ของคุณ](/my-account/domains)
2. ไปที่ **บัญชีของฉัน** → **ความปลอดภัย** → **คีย์ API**
3. สร้างคีย์ API ใหม่และคัดลอกมัน

### Claude Desktop {#claude-desktop}

เพิ่มสิ่งนี้ลงในไฟล์ config ของ Claude Desktop ของคุณ:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

รีสตาร์ท Claude Desktop คุณจะเห็นเครื่องมือ Forward Email ในตัวเลือกเครื่องมือ

> **หมายเหตุ:** ตัวแปร `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD` เป็นตัวเลือกแต่จำเป็นสำหรับเครื่องมือกล่องจดหมาย (ข้อความ, โฟลเดอร์, รายชื่อ, ปฏิทิน) ดูรายละเอียดได้ที่ [การตรวจสอบสิทธิ์](#authentication)

### Cursor {#cursor}

เปิดการตั้งค่า Cursor → MCP → เพิ่มเซิร์ฟเวอร์:

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

เปิดการตั้งค่า Windsurf → MCP → เพิ่มเซิร์ฟเวอร์โดยใช้การตั้งค่าเดียวกับด้านบน

### ลูกค้า MCP อื่น ๆ {#other-mcp-clients}

ลูกค้าใด ๆ ที่รองรับการขนส่ง MCP stdio จะใช้งานได้ คำสั่งคือ:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```

## การตรวจสอบสิทธิ์ {#authentication}

API ของ Forward Email ใช้ **การตรวจสอบสิทธิ์ HTTP Basic** โดยมีประเภทข้อมูลรับรองสองแบบขึ้นอยู่กับจุดเชื่อมต่อ เซิร์ฟเวอร์ MCP จะจัดการสิ่งนี้โดยอัตโนมัติ — คุณเพียงแค่ต้องให้ข้อมูลรับรองที่ถูกต้อง

### การตรวจสอบสิทธิ์ด้วยคีย์ API {#api-key-auth}

จุดเชื่อมต่อการจัดการส่วนใหญ่ (โดเมน, อลิอาส, อีเมลขาออก, บันทึก) ใช้ **คีย์ API** ของคุณเป็นชื่อผู้ใช้ Basic auth โดยไม่ต้องใช้รหัสผ่าน

นี่คือคีย์ API เดียวกับที่คุณใช้สำหรับ REST API ตั้งค่าผ่านตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_API_KEY`

### การตรวจสอบสิทธิ์ด้วยอลิอาส {#alias-auth}

จุดเชื่อมต่อกล่องจดหมาย (ข้อความ, โฟลเดอร์, รายชื่อ, ปฏิทิน, สคริปต์ sieve ที่จำกัดตามอลิอาส) ใช้ **ข้อมูลรับรองอลิอาส** — ที่อยู่อีเมลอลิอาสเป็นชื่อผู้ใช้ และรหัสผ่านที่สร้างขึ้นเป็นรหัสผ่าน

จุดเชื่อมต่อเหล่านี้เข้าถึงข้อมูลต่ออลิอาสผ่านโปรโตคอล IMAP, CalDAV และ CardDAV ต้องใช้ที่อยู่อีเมลอลิอาสและรหัสผ่านที่สร้างขึ้น ไม่ใช่คีย์ API

คุณสามารถให้ข้อมูลรับรองอลิอาสได้สองวิธี:

1. **ตัวแปรสภาพแวดล้อม** (แนะนำสำหรับอลิอาสเริ่มต้น): ตั้งค่า `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`  
2. **พารามิเตอร์ต่อการเรียกใช้เครื่องมือ**: ส่ง `alias_username` และ `alias_password` เป็นอาร์กิวเมนต์ให้กับเครื่องมือที่ใช้การตรวจสอบสิทธิ์อลิอาส วิธีนี้จะเขียนทับตัวแปรสภาพแวดล้อม ซึ่งมีประโยชน์เมื่อทำงานกับหลายอลิอาส

### การสร้างรหัสผ่านอลิอาส {#generating-an-alias-password}

ก่อนที่คุณจะใช้เครื่องมือที่ต้องการการตรวจสอบสิทธิ์อลิอาส คุณต้องสร้างรหัสผ่านสำหรับอลิอาสก่อน คุณสามารถทำได้ด้วยเครื่องมือ `generateAliasPassword` หรือผ่าน API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

การตอบกลับจะรวมถึงฟิลด์ `username` (อีเมลอลิอาส) และ `password` ใช้ข้อมูลเหล่านี้เป็นข้อมูลรับรองอลิอาสของคุณ

> **เคล็ดลับ:** คุณยังสามารถถามผู้ช่วย AI ของคุณได้ว่า: *"สร้างรหัสผ่านสำหรับอลิอาส <user@example.com> บนโดเมน example.com"* — มันจะเรียกใช้เครื่องมือ `generateAliasPassword` และส่งคืนข้อมูลรับรองให้

ตารางด้านล่างสรุปวิธีการตรวจสอบสิทธิ์ที่แต่ละกลุ่มเครื่องมือต้องการ:

| กลุ่มเครื่องมือ                                               | วิธีการตรวจสอบสิทธิ์       | ข้อมูลรับรอง                                               |
| -------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------- |
| บัญชี                                                          | คีย์ API **หรือ** การตรวจสอบสิทธิ์อลิอาส | อย่างใดอย่างหนึ่ง                                            |
| โดเมน, อลิอาส, สมาชิกโดเมน, คำเชิญ, รหัสผ่าน Catch-All       | คีย์ API                   | `FORWARD_EMAIL_API_KEY`                                     |
| อีเมลขาออก (รายการ, ดึงข้อมูล, ลบ, จำกัด)                     | คีย์ API                   | `FORWARD_EMAIL_API_KEY`                                     |
| ส่งอีเมล                                                      | คีย์ API **หรือ** การตรวจสอบสิทธิ์อลิอาส | อย่างใดอย่างหนึ่ง                                            |
| ข้อความ (IMAP)                                                | การตรวจสอบสิทธิ์อลิอาส    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| โฟลเดอร์ (IMAP)                                               | การตรวจสอบสิทธิ์อลิอาส    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| รายชื่อ (CardDAV)                                             | การตรวจสอบสิทธิ์อลิอาส    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| ปฏิทิน (CalDAV)                                              | การตรวจสอบสิทธิ์อลิอาส    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| เหตุการณ์ปฏิทิน (CalDAV)                                     | การตรวจสอบสิทธิ์อลิอาส    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| สคริปต์ Sieve (จำกัดตามโดเมน)                                | คีย์ API                   | `FORWARD_EMAIL_API_KEY`                                     |
| สคริปต์ Sieve (จำกัดตามอลิอาส)                              | การตรวจสอบสิทธิ์อลิอาส    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| บันทึก                                                        | คีย์ API                   | `FORWARD_EMAIL_API_KEY`                                     |
| การเข้ารหัส                                                  | ไม่มี                      | ไม่ต้องใช้ข้อมูลรับรอง                                      |
## เครื่องมือทั้งหมด 68 รายการ {#all-68-tools}

เครื่องมือแต่ละตัวจะเชื่อมต่อโดยตรงกับ [Forward Email API](/email-api) endpoint พารามิเตอร์ใช้ชื่อเดียวกับเอกสาร API วิธีการยืนยันตัวตนจะระบุไว้ในหัวข้อแต่ละส่วน

### บัญชี (API Key หรือ Alias Auth) {#account-api-key-or-alias-auth}

ด้วยการยืนยันตัวตนแบบ API key เครื่องมือเหล่านี้จะส่งคืนข้อมูลบัญชีผู้ใช้ของคุณ ด้วยการยืนยันตัวตนแบบ alias จะส่งคืนข้อมูล alias/กล่องจดหมาย รวมถึงโควต้าพื้นที่เก็บและการตั้งค่า

| เครื่องมือ         | API Endpoint      | คำอธิบาย                     |
| ----------------- | ----------------- | ---------------------------- |
| `getAccount`      | `GET /v1/account` | รับข้อมูลบัญชีของคุณ         |
| `updateAccount`   | `PUT /v1/account` | อัปเดตการตั้งค่าบัญชีของคุณ |

### โดเมน (API Key) {#domains-api-key}

| เครื่องมือ             | API Endpoint                                     | คำอธิบาย                  |
| --------------------- | ------------------------------------------------ | -------------------------- |
| `listDomains`         | `GET /v1/domains`                                | แสดงรายการโดเมนทั้งหมด    |
| `createDomain`        | `POST /v1/domains`                               | เพิ่มโดเมนใหม่             |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | รับรายละเอียดโดเมน        |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | อัปเดตการตั้งค่าโดเมน    |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | ลบโดเมน                   |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | ตรวจสอบระเบียน DNS         |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | ตรวจสอบการตั้งค่า SMTP    |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | ทดสอบการเชื่อมต่อ S3 แบบกำหนดเอง |

### อาลิอาส (API Key) {#aliases-api-key}

| เครื่องมือ                 | API Endpoint                                                      | คำอธิบาย                          |
| ------------------------- | ----------------------------------------------------------------- | ---------------------------------- |
| `listAliases`             | `GET /v1/domains/:domain_id/aliases`                              | แสดงรายการอาลิอาสสำหรับโดเมน      |
| `createAlias`             | `POST /v1/domains/:domain_id/aliases`                             | สร้างอาลิอาสใหม่                  |
| `getAlias`                | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | รับรายละเอียดอาลิอาส             |
| `updateAlias`             | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | อัปเดตอาลิอาส                   |
| `deleteAlias`             | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | ลบอาลิอาส                       |
| `generateAliasPassword`   | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | สร้างรหัสผ่าน IMAP/SMTP สำหรับการยืนยันตัวตนแบบอาลิอาส |

### อีเมล — SMTP ขาออก (API Key; Send รองรับทั้งสองแบบ) {#emails--outbound-smtp-api-key-send-supports-both}

| เครื่องมือ         | API Endpoint            | การยืนยันตัวตน          | คำอธิบาย                     |
| ----------------- | ----------------------- | ----------------------- | ---------------------------- |
| `sendEmail`       | `POST /v1/emails`       | API Key หรือ Alias Auth | ส่งอีเมลผ่าน SMTP            |
| `listEmails`      | `GET /v1/emails`        | API Key                 | แสดงรายการอีเมลขาออก        |
| `getEmail`        | `GET /v1/emails/:id`    | API Key                 | รับรายละเอียดและสถานะอีเมล   |
| `deleteEmail`     | `DELETE /v1/emails/:id` | API Key                 | ลบอีเมลที่อยู่ในคิว          |
| `getEmailLimit`   | `GET /v1/emails/limit`  | API Key                 | ตรวจสอบขีดจำกัดการส่งของคุณ |

เครื่องมือ `sendEmail` รองรับพารามิเตอร์ `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` และ `attachments` เหมือนกับ endpoint `POST /v1/emails`

### ข้อความ — IMAP (Alias Auth) {#messages--imap-alias-auth}

> **ต้องใช้ข้อมูลรับรองอาลิอาส** ส่งค่า `alias_username` และ `alias_password` หรือกำหนดตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`
| เครื่องมือ         | API Endpoint              | คำอธิบาย                           |
| --------------- | ------------------------- | ------------------------------------- |
| `listMessages`  | `GET /v1/messages`        | แสดงรายการและค้นหาข้อความในกล่องจดหมาย |
| `createMessage` | `POST /v1/messages`       | สร้างร่างข้อความหรืออัปโหลดข้อความ    |
| `getMessage`    | `GET /v1/messages/:id`    | ดึงข้อความตาม ID                   |
| `updateMessage` | `PUT /v1/messages/:id`    | อัปเดตสถานะ (อ่าน, ติดดาว, ฯลฯ)    |
| `deleteMessage` | `DELETE /v1/messages/:id` | ลบข้อความ                      |

เครื่องมือ `listMessages` รองรับพารามิเตอร์ค้นหามากกว่า 15 รายการ รวมถึง `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread`, และ `has_attachment` ดู [API docs](/email-api) สำหรับรายการทั้งหมด

### โฟลเดอร์ — IMAP (Alias Auth) {#folders--imap-alias-auth}

> **ต้องใช้ข้อมูลรับรอง alias** ส่ง `alias_username` และ `alias_password` หรือกำหนดตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`

| เครื่องมือ       | API Endpoint             | คำอธิบาย              |
| -------------- | ------------------------ | ------------------------ |
| `listFolders`  | `GET /v1/folders`        | แสดงรายการโฟลเดอร์ทั้งหมดในกล่องจดหมาย |
| `createFolder` | `POST /v1/folders`       | สร้างโฟลเดอร์ใหม่      |
| `getFolder`    | `GET /v1/folders/:id`    | ดึงรายละเอียดโฟลเดอร์       |
| `updateFolder` | `PUT /v1/folders/:id`    | เปลี่ยนชื่อโฟลเดอร์          |
| `deleteFolder` | `DELETE /v1/folders/:id` | ลบโฟลเดอร์          |

### รายชื่อผู้ติดต่อ — CardDAV (Alias Auth) {#contacts--carddav-alias-auth}

> **ต้องใช้ข้อมูลรับรอง alias** ส่ง `alias_username` และ `alias_password` หรือกำหนดตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`

| เครื่องมือ         | API Endpoint              | คำอธิบาย          |
| --------------- | ------------------------- | -------------------- |
| `listContacts`  | `GET /v1/contacts`        | แสดงรายชื่อผู้ติดต่อทั้งหมด    |
| `createContact` | `POST /v1/contacts`       | สร้างรายชื่อผู้ติดต่อใหม่ |
| `getContact`    | `GET /v1/contacts/:id`    | ดึงรายละเอียดรายชื่อผู้ติดต่อ  |
| `updateContact` | `PUT /v1/contacts/:id`    | อัปเดตรายชื่อผู้ติดต่อ     |
| `deleteContact` | `DELETE /v1/contacts/:id` | ลบรายชื่อผู้ติดต่อ     |

### ปฏิทิน — CalDAV (Alias Auth) {#calendars--caldav-alias-auth}

> **ต้องใช้ข้อมูลรับรอง alias** ส่ง `alias_username` และ `alias_password` หรือกำหนดตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`

| เครื่องมือ          | API Endpoint               | คำอธิบาย           |
| ---------------- | -------------------------- | --------------------- |
| `listCalendars`  | `GET /v1/calendars`        | แสดงรายการปฏิทินทั้งหมด    |
| `createCalendar` | `POST /v1/calendars`       | สร้างปฏิทินใหม่ |
| `getCalendar`    | `GET /v1/calendars/:id`    | ดึงรายละเอียดปฏิทิน  |
| `updateCalendar` | `PUT /v1/calendars/:id`    | อัปเดตปฏิทิน     |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | ลบปฏิทิน     |

### เหตุการณ์ปฏิทิน — CalDAV (Alias Auth) {#calendar-events--caldav-alias-auth}

> **ต้องใช้ข้อมูลรับรอง alias** ส่ง `alias_username` และ `alias_password` หรือกำหนดตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`

| เครื่องมือ               | API Endpoint                     | คำอธิบาย        |
| --------------------- | -------------------------------- | ------------------ |
| `listCalendarEvents`  | `GET /v1/calendar-events`        | แสดงรายการเหตุการณ์ทั้งหมด    |
| `createCalendarEvent` | `POST /v1/calendar-events`       | สร้างเหตุการณ์ใหม่ |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`    | ดึงรายละเอียดเหตุการณ์  |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`    | อัปเดตเหตุการณ์    |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | ลบเหตุการณ์    |

### สคริปต์ Sieve (API Key) {#sieve-scripts-api-key}

ใช้เส้นทางที่จำกัดโดเมนและยืนยันตัวตนด้วย API key ของคุณ

| เครื่องมือ               | API Endpoint                                                              | คำอธิบาย               |
| --------------------- | ------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | แสดงรายการสคริปต์สำหรับ alias |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | สร้างสคริปต์ใหม่       |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | ดึงรายละเอียดสคริปต์        |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | อัปเดตสคริปต์           |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | ลบสคริปต์           |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | เปิดใช้งานสคริปต์         |
### สคริปต์ Sieve (Alias Auth) {#sieve-scripts-alias-auth}

สคริปต์เหล่านี้ใช้การตรวจสอบสิทธิ์ระดับอาลิอัส เหมาะสำหรับการทำงานอัตโนมัติแบบต่ออาลิอัสโดยไม่ต้องใช้คีย์ API

> **ต้องใช้ข้อมูลรับรองอาลิอัส** ส่ง `alias_username` และ `alias_password` หรือกำหนดตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`

| เครื่องมือ                      | API Endpoint                                 | คำอธิบาย           |
| ------------------------------ | -------------------------------------------- | ------------------- |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | แสดงรายการสคริปต์  |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | สร้างสคริปต์       |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | ดูรายละเอียดสคริปต์ |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | อัปเดตสคริปต์      |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | ลบสคริปต์          |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | เปิดใช้งานสคริปต์   |

### สมาชิกโดเมนและคำเชิญ (API Key) {#domain-members-and-invites-api-key}

| เครื่องมือ             | API Endpoint                                       | คำอธิบาย                  |
| ---------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember`   | `PUT /v1/domains/:domain_id/members/:member_id`    | เปลี่ยนบทบาทสมาชิก        |
| `removeDomainMember`   | `DELETE /v1/domains/:domain_id/members/:member_id` | ลบสมาชิก                  |
| `acceptDomainInvite`   | `GET /v1/domains/:domain_id/invites`               | ยอมรับคำเชิญที่รอดำเนินการ |
| `createDomainInvite`   | `POST /v1/domains/:domain_id/invites`              | เชิญใครสักคนเข้าร่วมโดเมน |
| `removeDomainInvite`   | `DELETE /v1/domains/:domain_id/invites`            | ยกเลิกคำเชิญ              |

### รหัสผ่าน Catch-All (API Key) {#catch-all-passwords-api-key}

| เครื่องมือ                 | API Endpoint                                                  | คำอธิบาย                  |
| -------------------------- | ------------------------------------------------------------- | -------------------------- |
| `listCatchAllPasswords`    | `GET /v1/domains/:domain_id/catch-all-passwords`              | แสดงรายการรหัสผ่าน catch-all |
| `createCatchAllPassword`   | `POST /v1/domains/:domain_id/catch-all-passwords`             | สร้างรหัสผ่าน catch-all    |
| `deleteCatchAllPassword`   | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | ลบรหัสผ่าน catch-all       |

### บันทึก (API Key) {#logs-api-key}

| เครื่องมือ       | API Endpoint            | คำอธิบาย                  |
| ---------------- | ----------------------- | -------------------------- |
| `downloadLogs`   | `GET /v1/logs/download` | ดาวน์โหลดบันทึกการส่งอีเมล |

### การเข้ารหัส (ไม่ต้องยืนยันตัวตน) {#encrypt-no-auth}

| เครื่องมือ        | API Endpoint       | คำอธิบาย                  |
| ----------------- | ------------------ | -------------------------- |
| `encryptRecord`   | `POST /v1/encrypt` | เข้ารหัสระเบียน DNS TXT   |

เครื่องมือนี้ไม่ต้องการการยืนยันตัวตน ใช้เข้ารหัสระเบียนการส่งต่อ เช่น `forward-email=user@example.com` สำหรับใช้ในระเบียน DNS TXT


## 20 กรณีการใช้งานจริง {#20-real-world-use-cases}

นี่คือวิธีใช้งาน MCP server กับผู้ช่วย AI ของคุณอย่างเป็นประโยชน์:

### 1. การคัดกรองอีเมล {#1-email-triage}

ขอให้ AI สแกนกล่องจดหมายของคุณและสรุปข้อความที่ยังไม่ได้อ่าน มันสามารถทำเครื่องหมายอีเมลเร่งด่วน แยกประเภทตามผู้ส่ง และร่างคำตอบ — ทั้งหมดนี้ด้วยภาษาธรรมชาติ *(ต้องใช้ข้อมูลรับรองอาลิอัสเพื่อเข้าถึงกล่องจดหมาย)*

### 2. การตั้งค่าโดเมนอัตโนมัติ {#2-domain-setup-automation}

กำลังตั้งค่าโดเมนใหม่? ขอให้ AI สร้างโดเมน เพิ่มอาลิอัสของคุณ ตรวจสอบระเบียน DNS และทดสอบการตั้งค่า SMTP สิ่งที่ปกติใช้เวลาคลิกผ่านแดชบอร์ด 10 นาที จะกลายเป็นบทสนทนาเดียว

### 3. การจัดการอาลิอัสจำนวนมาก {#3-bulk-alias-management}

ต้องการสร้างอาลิอัส 20 รายการสำหรับโปรเจกต์ใหม่? อธิบายสิ่งที่คุณต้องการและปล่อยให้ AI จัดการงานซ้ำๆ มันสามารถสร้างอาลิอัส ตั้งกฎการส่งต่อ และสร้างรหัสผ่านในครั้งเดียวได้
### 4. การติดตามแคมเปญอีเมล {#4-email-campaign-monitoring}

ขอให้ AI ของคุณตรวจสอบขีดจำกัดการส่ง รายการอีเมลขาออกล่าสุด และรายงานสถานะการจัดส่ง เหมาะสำหรับการติดตามสุขภาพของอีเมลธุรกรรม

### 5. การซิงค์และทำความสะอาดรายชื่อผู้ติดต่อ {#5-contact-sync-and-cleanup}

ใช้เครื่องมือ CardDAV เพื่อแสดงรายชื่อผู้ติดต่อทั้งหมด ค้นหาผู้ติดต่อซ้ำ อัปเดตข้อมูลที่ล้าสมัย หรือสร้างผู้ติดต่อจำนวนมากจากสเปรดชีตที่คุณวางลงในแชท *(ต้องใช้ข้อมูลรับรอง alias)*

### 6. การจัดการปฏิทิน {#6-calendar-management}

สร้างปฏิทิน เพิ่มกิจกรรม อัปเดตเวลาการประชุม และลบกิจกรรมที่ถูกยกเลิก — ทั้งหมดผ่านการสนทนา เครื่องมือ CalDAV รองรับการสร้าง อ่าน อัปเดต และลบ ทั้งปฏิทินและกิจกรรม *(ต้องใช้ข้อมูลรับรอง alias)*

### 7. การทำงานอัตโนมัติด้วยสคริปต์ Sieve {#7-sieve-script-automation}

สคริปต์ Sieve มีพลังแต่ไวยากรณ์ซับซ้อน ขอให้ AI ของคุณเขียนสคริปต์ Sieve ให้คุณ: "กรองอีเมลทั้งหมดจาก <billing@example.com> ไปยังโฟลเดอร์ Billing" จะกลายเป็นสคริปต์ที่ใช้งานได้โดยไม่ต้องแตะต้องสเปค RFC 5228

### 8. การเริ่มต้นทีม {#8-team-onboarding}

เมื่อสมาชิกทีมใหม่เข้าร่วม ขอให้ AI สร้าง alias ให้ สร้างรหัสผ่าน ส่งอีเมลต้อนรับพร้อมข้อมูลรับรอง และเพิ่มเป็นสมาชิกโดเมน หนึ่งคำสั่งสั่งงาน สี่คำขอ API

### 9. การตรวจสอบความปลอดภัย {#9-security-auditing}

ขอให้ AI ของคุณแสดงรายชื่อโดเมนทั้งหมด ตรวจสอบสถานะการยืนยัน DNS ทบทวนการตั้งค่า alias และระบุโดเมนที่มีระเบียนที่ยังไม่ยืนยัน การตรวจสอบความปลอดภัยอย่างรวดเร็วด้วยภาษาธรรมชาติ

### 10. การตั้งค่าการส่งต่ออีเมล {#10-email-forwarding-setup}

กำลังตั้งค่าการส่งต่ออีเมลสำหรับโดเมนใหม่? ขอให้ AI สร้างโดเมน เพิ่ม alias สำหรับส่งต่อ เข้ารหัสระเบียน DNS และตรวจสอบว่าทุกอย่างตั้งค่าอย่างถูกต้อง

### 11. การค้นหาและวิเคราะห์กล่องจดหมาย {#11-inbox-search-and-analysis}

ใช้เครื่องมือค้นหาข้อความเพื่อค้นหาอีเมลเฉพาะ: "ค้นหาอีเมลทั้งหมดจาก <john@example.com> ใน 30 วันที่ผ่านมา ที่มีไฟล์แนบ" พารามิเตอร์การค้นหากว่า 15 ตัวทำให้มีประสิทธิภาพ *(ต้องใช้ข้อมูลรับรอง alias)*

### 12. การจัดระเบียบโฟลเดอร์ {#12-folder-organization}

ขอให้ AI สร้างโครงสร้างโฟลเดอร์สำหรับโครงการใหม่ ย้ายข้อความระหว่างโฟลเดอร์ หรือทำความสะอาดโฟลเดอร์เก่าที่คุณไม่ต้องการแล้ว *(ต้องใช้ข้อมูลรับรอง alias)*

### 13. การหมุนเวียนรหัสผ่าน {#13-password-rotation}

สร้างรหัสผ่าน alias ใหม่ตามตารางเวลา ขอให้ AI สร้างรหัสผ่านใหม่สำหรับแต่ละ alias และรายงานข้อมูลรับรองใหม่

### 14. การเข้ารหัสระเบียน DNS {#14-dns-record-encryption}

เข้ารหัสระเบียนส่งต่อของคุณก่อนเพิ่มลงใน DNS เครื่องมือ `encryptRecord` จัดการเรื่องนี้โดยไม่ต้องยืนยันตัวตน — เหมาะสำหรับการเข้ารหัสแบบครั้งเดียวอย่างรวดเร็ว

### 15. การวิเคราะห์บันทึกการจัดส่ง {#15-delivery-log-analysis}

ดาวน์โหลดบันทึกการจัดส่งอีเมลของคุณและขอให้ AI วิเคราะห์อัตราการเด้ง ระบุผู้รับที่มีปัญหา หรือ ติดตามเวลาการจัดส่ง

### 16. การจัดการหลายโดเมน {#16-multi-domain-management}

ถ้าคุณจัดการหลายโดเมน ขอให้ AI รายงานสถานะ: โดเมนใดได้รับการยืนยัน โดเมนใดมีปัญหา alias แต่ละโดเมนมีกี่อัน และขีดจำกัดการส่งเป็นอย่างไร

### 17. การตั้งค่า Catch-All {#17-catch-all-configuration}

ตั้งค่ารหัสผ่าน catch-all สำหรับโดเมนที่ต้องรับอีเมลที่อยู่อีเมลใดก็ได้ AI สามารถสร้าง แสดงรายการ และจัดการรหัสผ่านเหล่านี้ให้คุณ

### 18. การจัดการคำเชิญโดเมน {#18-domain-invite-management}

เชิญสมาชิกทีมมาจัดการโดเมน ตรวจสอบคำเชิญที่รอดำเนินการ และทำความสะอาดคำเชิญที่หมดอายุ เหมาะสำหรับองค์กรที่มีผู้ดูแลโดเมนหลายคน

### 19. การทดสอบที่เก็บข้อมูล S3 {#19-s3-storage-testing}

ถ้าคุณใช้ที่เก็บข้อมูล S3 แบบกำหนดเองสำหรับสำรองอีเมล ขอให้ AI ทดสอบการเชื่อมต่อและตรวจสอบว่าทำงานถูกต้อง

### 20. การร่างอีเมล {#20-email-draft-composition}

สร้างร่างอีเมลในกล่องจดหมายของคุณโดยไม่ต้องส่ง เหมาะสำหรับเตรียมอีเมลที่ต้องตรวจสอบก่อนส่ง หรือสำหรับสร้างแม่แบบอีเมล *(ต้องใช้ข้อมูลรับรอง alias)*


## ตัวอย่างคำสั่ง {#example-prompts}

นี่คือตัวอย่างคำสั่งที่คุณสามารถใช้กับผู้ช่วย AI ของคุณได้โดยตรง:

**ส่งอีเมล:**

> "ส่งอีเมลจาก <hello@mydomain.com> ถึง <john@example.com> โดยมีหัวข้อ 'ประชุมพรุ่งนี้' และเนื้อหา 'สวัสดีจอห์น เรายังนัดกันตอนบ่ายสองอยู่ไหม?'"
**การจัดการโดเมน:**

> "แสดงรายชื่อโดเมนทั้งหมดของฉันและบอกฉันว่าโดเมนใดมีระเบียน DNS ที่ยังไม่ได้ยืนยัน"

**การสร้างนามแฝง:**

> "สร้างนามแฝงใหม่ <support@mydomain.com> ที่ส่งต่อไปยังอีเมลส่วนตัวของฉัน"

**การค้นหาในกล่องจดหมาย (ต้องใช้ข้อมูลรับรองนามแฝง):**

> "ค้นหาอีเมลที่ยังไม่ได้อ่านทั้งหมดจากสัปดาห์ที่ผ่านมา ที่มีคำว่า 'invoice'"

**ปฏิทิน (ต้องใช้ข้อมูลรับรองนามแฝง):**

> "สร้างปฏิทินชื่อ 'Work' และเพิ่มการประชุมสำหรับวันพรุ่งนี้เวลา 14:00 น. ชื่อ 'Team Standup'"

**สคริปต์ Sieve:**

> "เขียนสคริปต์ Sieve สำหรับ <info@mydomain.com> ที่ตอบกลับอีเมลโดยอัตโนมัติด้วยข้อความ 'ขอบคุณที่ติดต่อมา เราจะติดต่อกลับภายใน 24 ชั่วโมง'"

**การดำเนินการจำนวนมาก:**

> "สร้างนามแฝงสำหรับ sales@, support@, billing@, และ info@ บน mydomain.com ทั้งหมดส่งต่อไปยัง <team@mydomain.com>"

**การตรวจสอบความปลอดภัย:**

> "ตรวจสอบสถานะการยืนยัน DNS และ SMTP สำหรับโดเมนทั้งหมดของฉันและบอกฉันหากมีสิ่งใดที่ต้องดูแล"

**สร้างรหัสผ่านนามแฝง:**

> "สร้างรหัสผ่านสำหรับนามแฝง <user@example.com> เพื่อให้ฉันสามารถเข้าถึงกล่องจดหมายของฉันได้"


## Environment Variables {#environment-variables}

| ตัวแปร                         | จำเป็น   | ค่าเริ่มต้น                     | คำอธิบาย                                                                      |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | ใช่      | —                              | คีย์ API ของ Forward Email ของคุณ (ใช้เป็นชื่อผู้ใช้ Basic auth สำหรับจุดสิ้นสุด API-key) |
| `FORWARD_EMAIL_ALIAS_USER`     | ไม่ใช่   | —                              | ที่อยู่อีเมลนามแฝงสำหรับจุดสิ้นสุดกล่องจดหมาย (เช่น `user@example.com`)       |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | ไม่ใช่   | —                              | รหัสผ่านนามแฝงที่สร้างขึ้นสำหรับจุดสิ้นสุดกล่องจดหมาย                       |
| `FORWARD_EMAIL_API_URL`        | ไม่ใช่   | `https://api.forwardemail.net` | URL พื้นฐานของ API (สำหรับการโฮสต์เองหรือทดสอบ)                              |


## Security {#security}

เซิร์ฟเวอร์ MCP ทำงานบนเครื่องของคุณเอง นี่คือวิธีการทำงานของความปลอดภัย:

* **ข้อมูลรับรองของคุณจะอยู่ในเครื่องของคุณเท่านั้น** ทั้งคีย์ API และข้อมูลรับรองนามแฝงจะถูกอ่านจากตัวแปรสภาพแวดล้อมและใช้สำหรับการยืนยันตัวตนของคำขอ API ผ่าน HTTP Basic auth โดยจะไม่ถูกส่งไปยังโมเดล AI
* **การสื่อสารผ่าน stdio** เซิร์ฟเวอร์สื่อสารกับไคลเอนต์ AI ผ่าน stdin/stdout ไม่มีการเปิดพอร์ตเครือข่ายใดๆ
* **ไม่มีการจัดเก็บข้อมูล** เซิร์ฟเวอร์ไม่มีสถานะ ไม่เก็บแคช บันทึก หรือจัดเก็บข้อมูลอีเมลของคุณใดๆ
* **โอเพนซอร์ส** โค้ดทั้งหมดอยู่บน [GitHub](https://github.com/forwardemail/mcp-server) คุณสามารถตรวจสอบโค้ดทุกบรรทัดได้


## Programmatic Usage {#programmatic-usage}

คุณยังสามารถใช้เซิร์ฟเวอร์เป็นไลบรารีได้:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Open Source {#open-source}

Forward Email MCP Server เป็น [โอเพนซอร์สบน GitHub](https://github.com/forwardemail/mcp-server) ภายใต้ใบอนุญาต BUSL-1.1 เราเชื่อในความโปร่งใส หากคุณพบข้อบกพร่องหรือต้องการฟีเจอร์ใหม่ [เปิด issue](https://github.com/forwardemail/mcp-server/issues) ได้เลย
