# เซิร์ฟเวอร์ Forward Email MCP

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://github.com/forwardemail/mcp-server">เซิร์ฟเวอร์ MCP แบบโอเพนซอร์ส</a> ของเราช่วยให้ผู้ช่วย AI เช่น Claude, ChatGPT, Cursor และ Windsurf จัดการอีเมล โดเมน นามแฝง ผู้ติดต่อ และปฏิทินของคุณผ่านภาษาธรรมชาติ ปลายทาง API ทั้ง 68 รายการถูกเปิดเผยเป็นเครื่องมือ MCP โดยทำงานในเครื่องผ่าน <code>npx @forwardemail/mcp-server</code> — ข้อมูลรับรองของคุณจะไม่ออกจากเครื่องของคุณ
</p>

## สารบัญ {#table-of-contents}

* [MCP คืออะไร?](#what-is-mcp)
* [เริ่มต้นอย่างรวดเร็ว](#quick-start)
  * [รับคีย์ API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [ไคลเอนต์ MCP อื่นๆ](#other-mcp-clients)
* [การรับรองความถูกต้อง](#authentication)
  * [การรับรองความถูกต้องด้วยคีย์ API](#api-key-auth)
  * [การรับรองความถูกต้องด้วยนามแฝง](#alias-auth)
  * [การสร้างรหัสผ่านนามแฝง](#generating-an-alias-password)
* [เครื่องมือทั้งหมด 68 รายการ](#all-68-tools)
  * [บัญชี (คีย์ API หรือการรับรองความถูกต้องด้วยนามแฝง)](#account-api-key-or-alias-auth)
  * [โดเมน (คีย์ API)](#domains-api-key)
  * [นามแฝง (คีย์ API)](#aliases-api-key)
  * [อีเมล — SMTP ขาออก (คีย์ API; การส่งรองรับทั้งสองแบบ)](#emails--outbound-smtp-api-key-send-supports-both)
  * [ข้อความ — IMAP (การรับรองความถูกต้องด้วยนามแฝง)](#messages--imap-alias-auth)
  * [โฟลเดอร์ — IMAP (การรับรองความถูกต้องด้วยนามแฝง)](#folders--imap-alias-auth)
  * [ผู้ติดต่อ — CardDAV (การรับรองความถูกต้องด้วยนามแฝง)](#contacts--carddav-alias-auth)
  * [ปฏิทิน — CalDAV (การรับรองความถูกต้องด้วยนามแฝง)](#calendars--caldav-alias-auth)
  * [กิจกรรมในปฏิทิน — CalDAV (การรับรองความถูกต้องด้วยนามแฝง)](#calendar-events--caldav-alias-auth)
  * [สคริปต์ Sieve (คีย์ API)](#sieve-scripts-api-key)
  * [สคริปต์ Sieve (การรับรองความถูกต้องด้วยนามแฝง)](#sieve-scripts-alias-auth)
  * [สมาชิกโดเมนและคำเชิญ (คีย์ API)](#domain-members-and-invites-api-key)
  * [รหัสผ่าน Catch-All (คีย์ API)](#catch-all-passwords-api-key)
  * [บันทึก (คีย์ API)](#logs-api-key)
  * [เข้ารหัส (ไม่มีการรับรองความถูกต้อง)](#encrypt-no-auth)
* [20 กรณีการใช้งานจริง](#20-real-world-use-cases)
* [ตัวอย่างคำสั่ง](#example-prompts)
* [ตัวแปรสภาพแวดล้อม](#environment-variables)
* [ความปลอดภัย](#security)
* [การใช้งานแบบโปรแกรม](#programmatic-usage)
* [โอเพนซอร์ส](#open-source)


## MCP คืออะไร? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) เป็นมาตรฐานเปิดที่สร้างโดย Anthropic ซึ่งช่วยให้โมเดล AI สามารถเรียกใช้เครื่องมือภายนอกได้อย่างปลอดภัย แทนที่จะคัดลอกและวางการตอบสนอง API ลงในหน้าต่างแชท MCP ช่วยให้โมเดลเข้าถึงบริการของคุณได้โดยตรงและมีโครงสร้าง

เซิร์ฟเวอร์ MCP ของเราครอบคลุม [Forward Email API](/email-api) ทั้งหมด — ทุกปลายทาง ทุกพารามิเตอร์ — และเปิดเผยเป็นเครื่องมือที่ไคลเอนต์ที่เข้ากันได้กับ MCP สามารถใช้งานได้ เซิร์ฟเวอร์ทำงานในเครื่องของคุณโดยใช้การส่งข้อมูลแบบ stdio ข้อมูลรับรองของคุณจะอยู่ในตัวแปรสภาพแวดล้อมของคุณและจะไม่ถูกส่งไปยังโมเดล AI


## เริ่มต้นอย่างรวดเร็ว {#quick-start}

### รับคีย์ API {#get-an-api-key}

1. เข้าสู่ระบบ [บัญชี Forward Email](/my-account/domains) ของคุณ
2. ไปที่ **บัญชีของฉัน** → **ความปลอดภัย** → **คีย์ API**
3. สร้างคีย์ API ใหม่และคัดลอก

### Claude Desktop {#claude-desktop}

เพิ่มสิ่งนี้ลงในไฟล์การกำหนดค่า Claude Desktop ของคุณ:

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

รีสตาร์ท Claude Desktop คุณควรเห็นเครื่องมือ Forward Email ในตัวเลือกเครื่องมือ

> **หมายเหตุ:** ตัวแปร `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD` เป็นตัวเลือก แต่จำเป็นสำหรับเครื่องมือกล่องจดหมาย (ข้อความ โฟลเดอร์ ผู้ติดต่อ ปฏิทิน) ดู [การรับรองความถูกต้อง](#authentication) สำหรับรายละเอียด

### Cursor {#cursor}

เปิด Cursor Settings → MCP → เพิ่มเซิร์ฟเวอร์:

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

เปิด Windsurf Settings → MCP → เพิ่มเซิร์ฟเวอร์ด้วยการกำหนดค่าเดียวกันกับด้านบน

### ไคลเอนต์ MCP อื่นๆ {#other-mcp-clients}

ไคลเอนต์ใดๆ ที่รองรับการส่งข้อมูล MCP stdio จะทำงานได้ คำสั่งคือ:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## การรับรองความถูกต้อง {#authentication}

Forward Email API ใช้ **HTTP Basic authentication** พร้อมประเภทข้อมูลรับรองสองประเภทที่แตกต่างกันขึ้นอยู่กับปลายทาง เซิร์ฟเวอร์ MCP จัดการสิ่งนี้โดยอัตโนมัติ — คุณเพียงแค่ต้องให้ข้อมูลรับรองที่ถูกต้อง

### การรับรองความถูกต้องด้วยคีย์ API {#api-key-auth}

ปลายทางการจัดการส่วนใหญ่ (โดเมน นามแฝง อีเมลขาออก บันทึก) ใช้ **คีย์ API** ของคุณเป็นชื่อผู้ใช้ Basic auth โดยไม่มีรหัสผ่าน

นี่คือคีย์ API เดียวกันกับที่คุณใช้สำหรับ REST API ตั้งค่าผ่านตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_API_KEY`

### การรับรองความถูกต้องด้วยนามแฝง {#alias-auth}

ปลายทางกล่องจดหมาย (ข้อความ โฟลเดอร์ ผู้ติดต่อ ปฏิทิน สคริปต์ Sieve ที่กำหนดขอบเขตนามแฝง) ใช้ **ข้อมูลรับรองนามแฝง** — ที่อยู่อีเมลนามแฝงเป็นชื่อผู้ใช้และรหัสผ่านที่สร้างขึ้นเป็นรหัสผ่าน

ปลายทางเหล่านี้เข้าถึงข้อมูลต่อนามแฝงผ่านโปรโตคอล IMAP, CalDAV และ CardDAV พวกเขาต้องการอีเมลนามแฝงและรหัสผ่านที่สร้างขึ้น ไม่ใช่คีย์ API

คุณสามารถให้ข้อมูลรับรองนามแฝงได้สองวิธี:

1. **ตัวแปรสภาพแวดล้อม** (แนะนำสำหรับนามแฝงเริ่มต้น): ตั้งค่า `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`
2. **พารามิเตอร์การเรียกใช้เครื่องมือต่อครั้ง**: ส่ง `alias_username` และ `alias_password` เป็นอาร์กิวเมนต์ไปยังเครื่องมือการรับรองความถูกต้องด้วยนามแฝงใดๆ สิ่งเหล่านี้จะแทนที่ตัวแปรสภาพแวดล้อม ซึ่งมีประโยชน์เมื่อทำงานกับนามแฝงหลายรายการ

### การสร้างรหัสผ่านนามแฝง {#generating-an-alias-password}

ก่อนที่คุณจะสามารถใช้เครื่องมือการรับรองความถูกต้องด้วยนามแฝงได้ คุณต้องสร้างรหัสผ่านสำหรับนามแฝง คุณสามารถทำได้ด้วยเครื่องมือ `generateAliasPassword` หรือผ่าน API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

การตอบสนองประกอบด้วยฟิลด์ `username` (อีเมลนามแฝง) และ `password` ใช้สิ่งเหล่านี้เป็นข้อมูลรับรองนามแฝงของคุณ

> **เคล็ดลับ:** คุณยังสามารถถามผู้ช่วย AI ของคุณได้ว่า: *"สร้างรหัสผ่านสำหรับนามแฝง user@example.com บนโดเมน example.com"* — มันจะเรียกใช้เครื่องมือ `generateAliasPassword` และส่งคืนข้อมูลรับรอง

ตารางด้านล่างสรุปวิธีการรับรองความถูกต้องที่กลุ่มเครื่องมือแต่ละกลุ่มต้องการ:

| กลุ่มเครื่องมือ | วิธีการรับรองความถูกต้อง | ข้อมูลรับรอง |
|-----------|-------------|-------------|
| บัญชี | คีย์ API **หรือ** การรับรองความถูกต้องด้วยนามแฝง | อย่างใดอย่างหนึ่ง |
| โดเมน, นามแฝง, สมาชิกโดเมน, คำเชิญ, รหัสผ่าน Catch-All | คีย์ API | `FORWARD_EMAIL_API_KEY` |
| อีเมลขาออก (รายการ, รับ, ลบ, จำกัด) | คีย์ API | `FORWARD_EMAIL_API_KEY` |
| ส่งอีเมล | คีย์ API **หรือ** การรับรองความถูกต้องด้วยนามแฝง | อย่างใดอย่างหนึ่ง |
| ข้อความ (IMAP) | การรับรองความถูกต้องด้วยนามแฝง | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| โฟลเดอร์ (IMAP) | การรับรองความถูกต้องด้วยนามแฝง | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| ผู้ติดต่อ (CardDAV) | การรับรองความถูกต้องด้วยนามแฝง | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| ปฏิทิน (CalDAV) | การรับรองความถูกต้องด้วยนามแalias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| กิจกรรมในปฏิทิน (CalDAV) | การรับรองความถูกต้องด้วยนามแฝง | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| สคริปต์ Sieve (กำหนดขอบเขตโดเมน) | คีย์ API | `FORWARD_EMAIL_API_KEY` |
| สคริปต์ Sieve (กำหนดขอบเขตนามแฝง) | การรับรองความถูกต้องด้วยนามแฝง | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| บันทึก | คีย์ API | `FORWARD_EMAIL_API_KEY` |
| เข้ารหัส | ไม่มี | ไม่ต้องใช้ข้อมูลรับรอง |


## เครื่องมือทั้งหมด 68 รายการ {#all-68-tools}

เครื่องมือทุกชิ้นจะแมปโดยตรงกับปลายทาง [Forward Email API](/email-api) พารามิเตอร์ใช้ชื่อเดียวกันกับเอกสาร API วิธีการรับรองความถูกต้องจะถูกระบุในส่วนหัวของแต่ละส่วน

### บัญชี (คีย์ API หรือการรับรองความถูกต้องด้วยนามแฝง) {#account-api-key-or-alias-auth}

ด้วยการรับรองความถูกต้องด้วยคีย์ API สิ่งเหล่านี้จะส่งคืนข้อมูลบัญชีผู้ใช้ของคุณ ด้วยการรับรองความถูกต้องด้วยนามแฝง สิ่งเหล่านี้จะส่งคืนข้อมูลนามแฝง/กล่องจดหมาย รวมถึงโควต้าพื้นที่เก็บข้อมูลและการตั้งค่า

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | รับข้อมูลบัญชีของคุณ |
| `updateAccount` | `PUT /v1/account` | อัปเดตการตั้งค่าบัญชีของคุณ |

### โดเมน (คีย์ API) {#domains-api-key}

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | แสดงรายการโดเมนทั้งหมดของคุณ |
| `createDomain` | `POST /v1/domains` | เพิ่มโดเมนใหม่ |
| `getDomain` | `GET /v1/domains/:domain_id` | รับรายละเอียดโดเมน |
| `updateDomain` | `PUT /v1/domains/:domain_id` | อัปเดตการตั้งค่าโดเมน |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | ลบโดเมน |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | ตรวจสอบระเบียน DNS |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | ตรวจสอบการกำหนดค่า SMTP |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | ทดสอบการเชื่อมต่อ S3 แบบกำหนดเอง |

### นามแฝง (คีย์ API) {#aliases-api-key}

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | แสดงรายการนามแฝงสำหรับโดเมน |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | สร้างนามแฝงใหม่ |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | รับรายละเอียดนามแฝง |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | อัปเดตนามแฝง |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | ลบนามแฝง |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | สร้างรหัสผ่าน IMAP/SMTP สำหรับการรับรองความถูกต้องด้วยนามแฝง |

### อีเมล — SMTP ขาออก (คีย์ API; การส่งรองรับทั้งสองแบบ) {#emails--outbound-smtp-api-key-send-supports-both}

| เครื่องมือ | ปลายทาง API | การรับรองความถูกต้อง | คำอธิบาย |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | คีย์ API หรือการรับรองความถูกต้องด้วยนามแฝง | ส่งอีเมลผ่าน SMTP |
| `listEmails` | `GET /v1/emails` | คีย์ API | แสดงรายการอีเมลขาออก |
| `getEmail` | `GET /v1/emails/:id` | คีย์ API | รับรายละเอียดและสถานะอีเมล |
| `deleteEmail` | `DELETE /v1/emails/:id` | คีย์ API | ลบอีเมลที่อยู่ในคิว |
| `getEmailLimit` | `GET /v1/emails/limit` | คีย์ API | ตรวจสอบขีดจำกัดการส่งของคุณ |

เครื่องมือ `sendEmail` ยอมรับ `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` และ `attachments` นี่เหมือนกับปลายทาง `POST /v1/emails`

### ข้อความ — IMAP (การรับรองความถูกต้องด้วยนามแฝง) {#messages--imap-alias-auth}

> **ต้องใช้ข้อมูลรับรองนามแฝง** ส่ง `alias_username` และ `alias_password` หรือตั้งค่าตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | แสดงรายการและค้นหาข้อความในกล่องจดหมาย |
| `createMessage` | `POST /v1/messages` | สร้างฉบับร่างหรืออัปโหลดข้อความ |
| `getMessage` | `GET /v1/messages/:id` | รับข้อความตาม ID |
| `updateMessage` | `PUT /v1/messages/:id` | อัปเดตสถานะ (อ่านแล้ว, ติดดาว, ฯลฯ) |
| `deleteMessage` | `DELETE /v1/messages/:id` | ลบข้อความ |

เครื่องมือ `listMessages` รองรับพารามิเตอร์การค้นหามากกว่า 15 รายการ รวมถึง `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` และ `has_attachment` ดู [เอกสาร API](/email-api) สำหรับรายการทั้งหมด

### โฟลเดอร์ — IMAP (การรับรองความถูกต้องด้วยนามแฝง) {#folders--imap-alias-auth}

> **ต้องใช้ข้อมูลรับรองนามแฝง** ส่ง `alias_username` และ `alias_password` หรือตั้งค่าตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | แสดงรายการโฟลเดอร์กล่องจดหมายทั้งหมด |
| `createFolder` | `POST /v1/folders` | สร้างโฟลเดอร์ใหม่ |
| `getFolder` | `GET /v1/folders/:id` | รับรายละเอียดโฟลเดอร์ |
| `updateFolder` | `PUT /v1/folders/:id` | เปลี่ยนชื่อโฟลเดอร์ |
| `deleteFolder` | `DELETE /v1/folders/:id` | ลบโฟลเดอร์ |

### ผู้ติดต่อ — CardDAV (การรับรองความถูกต้องด้วยนามแฝง) {#contacts--carddav-alias-auth}

> **ต้องใช้ข้อมูลรับรองนามแฝง** ส่ง `alias_username` และ `alias_password` หรือตั้งค่าตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | แสดงรายการผู้ติดต่อทั้งหมด |
| `createContact` | `POST /v1/contacts` | สร้างผู้ติดต่อใหม่ |
| `getContact` | `GET /v1/contacts/:id` | รับรายละเอียดผู้ติดต่อ |
| `updateContact` | `PUT /v1/contacts/:id` | อัปเดตผู้ติดต่อ |
| `deleteContact` | `DELETE /v1/contacts/:id` | ลบผู้ติดต่อ |

### ปฏิทิน — CalDAV (การรับรองความถูกต้องด้วยนามแฝง) {#calendars--caldav-alias-auth}

> **ต้องใช้ข้อมูลรับรองนามแฝง** ส่ง `alias_username` และ `alias_password` หรือตั้งค่าตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | แสดงรายการปฏิทินทั้งหมด |
| `createCalendar` | `POST /v1/calendars` | สร้างปฏิทินใหม่ |
| `getCalendar` | `GET /v1/calendars/:id` | รับรายละเอียดปฏิทิน |
| `updateCalendar` | `PUT /v1/calendars/:id` | อัปเดตปฏิทิน |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | ลบปฏิทิน |

### กิจกรรมในปฏิทิน — CalDAV (การรับรองความถูกต้องด้วยนามแฝง) {#calendar-events--caldav-alias-auth}

> **ต้องใช้ข้อมูลรับรองนามแฝง** ส่ง `alias_username` และ `alias_password` หรือตั้งค่าตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | แสดงรายการกิจกรรมทั้งหมด |
| `createCalendarEvent` | `POST /v1/calendar-events` | สร้างกิจกรรมใหม่ |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | รับรายละเอียดกิจกรรม |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | อัปเดตกิจกรรม |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | ลบกิจกรรม |

### สคริปต์ Sieve (คีย์ API) {#sieve-scripts-api-key}

สิ่งเหล่านี้ใช้เส้นทางที่กำหนดขอบเขตโดเมนและรับรองความถูกต้องด้วยคีย์ API ของคุณ

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | แสดงรายการสคริปต์สำหรับนามแฝง |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | สร้างสคริปต์ใหม่ |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | รับรายละเอียดสคริปต์ |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | อัปเดตสคริปต์ |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | ลบสคริปต์ |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | เปิดใช้งานสคริปต์ |

### สคริปต์ Sieve (การรับรองความถูกต้องด้วยนามแฝง) {#sieve-scripts-alias-auth}

สิ่งเหล่านี้ใช้การรับรองความถูกต้องระดับนามแฝง มีประโยชน์สำหรับการทำงานอัตโนมัติแบบต่อนามแฝงโดยไม่จำเป็นต้องใช้คีย์ API

> **ต้องใช้ข้อมูลรับรองนามแฝง** ส่ง `alias_username` และ `alias_password` หรือตั้งค่าตัวแปรสภาพแวดล้อม `FORWARD_EMAIL_ALIAS_USER` และ `FORWARD_EMAIL_ALIAS_PASSWORD`

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | แสดงรายการสคริปต์ |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | สร้างสคริปต์ |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | รับรายละเอียดสคริปต์ |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | อัปเดตสคริปต์ |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | ลบสคริปต์ |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | เปิดใช้งานสคริปต์ |

### สมาชิกโดเมนและคำเชิญ (คีย์ API) {#domain-members-and-invites-api-key}

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | เปลี่ยนบทบาทของสมาชิก |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | ลบสมาชิก |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | ยอมรับคำเชิญที่รอดำเนินการ |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | เชิญใครบางคนเข้าร่วมโดเมน |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | เพิกถอนคำเชิญ |

### รหัสผ่าน Catch-All (คีย์ API) {#catch-all-passwords-api-key}

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | แสดงรายการรหัสผ่าน catch-all |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | สร้างรหัสผ่าน catch-all |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | ลบรหัสผ่าน catch-all |

### บันทึก (คีย์ API) {#logs-api-key}

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | ดาวน์โหลดบันทึกการส่งอีเมล |

### เข้ารหัส (ไม่มีการรับรองความถูกต้อง) {#encrypt-no-auth}

| เครื่องมือ | ปลายทาง API | คำอธิบาย |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | เข้ารหัสระเบียน DNS TXT |

เครื่องมือนี้ไม่ต้องการการรับรองความถูกต้อง มันเข้ารหัสระเบียนการส่งต่อเช่น `forward-email=user@example.com` เพื่อใช้ในระเบียน DNS TXT

## 20 กรณีการใช้งานจริง {#20-real-world-use-cases}

นี่คือวิธีปฏิบัติในการใช้เซิร์ฟเวอร์ MCP กับผู้ช่วย AI ของคุณ:

### 1. การคัดแยกอีเมล {#email-triage}

ขอให้ AI ของคุณสแกนกล่องจดหมายและสรุปข้อความที่ยังไม่ได้อ่าน มันสามารถตั้งค่าสถานะอีเมลเร่งด่วน จัดหมวดหมู่ตามผู้ส่ง และร่างการตอบกลับ — ทั้งหมดผ่านภาษาธรรมชาติ *(ต้องใช้ข้อมูลรับรองนามแฝงสำหรับการเข้าถึงกล่องจดหมาย)*

### 2. การตั้งค่าโดเมนอัตโนมัติ {#domain-setup-automation}

กำลังตั้งค่าโดเมนใหม่ใช่ไหม? ขอให้ AI สร้างโดเมน เพิ่มนามแฝงของคุณ ตรวจสอบระเบียน DNS และทดสอบการกำหนดค่า SMTP สิ่งที่ปกติใช้เวลา 10 นาทีในการคลิกผ่านแดชบอร์ดจะกลายเป็นการสนทนาเดียว

### 3. การจัดการนามแฝงจำนวนมาก {#bulk-alias-management}

ต้องการสร้างนามแฝง 20 รายการสำหรับโปรเจกต์ใหม่หรือไม่? อธิบายสิ่งที่คุณต้องการและให้ AI จัดการงานที่ซ้ำซาก มันสามารถสร้างนามแฝง ตั้งค่ากฎการส่งต่อ และสร้างรหัสผ่านได้ในครั้งเดียว

### 4. การตรวจสอบแคมเปญอีเมล {#email-campaign-monitoring}

ขอให้ AI ของคุณตรวจสอบขีดจำกัดการส่ง แสดงรายการอีเมลขาออกล่าสุด และรายงานสถานะการจัดส่ง มีประโยชน์สำหรับการตรวจสอบสุขภาพของอีเมลธุรกรรม

### 5. การซิงค์และทำความสะอาดผู้ติดต่อ {#contact-sync-and-cleanup}

ใช้เครื่องมือ CardDAV เพื่อแสดงรายการผู้ติดต่อทั้งหมด ค้นหาข้อมูลที่ซ้ำกัน อัปเดตข้อมูลที่ล้าสมัย หรือสร้างผู้ติดต่อจำนวนมากจากสเปรดชีตที่คุณวางลงในการแชท *(ต้องใช้ข้อมูลรับรองนามแฝง)*

### 6. การจัดการปฏิทิน {#calendar-management}

สร้างปฏิทิน เพิ่มกิจกรรม อัปเดตเวลาการประชุม และลบกิจกรรมที่ถูกยกเลิก — ทั้งหมดผ่านการสนทนา เครื่องมือ CalDAV รองรับ CRUD เต็มรูปแบบทั้งบนปฏิทินและกิจกรรม *(ต้องใช้ข้อมูลรับรองนามแฝง)*

### 7. การทำงานอัตโนมัติด้วยสคริปต์ Sieve {#sieve-script-automation}

สคริปต์ Sieve มีประสิทธิภาพ แต่ไวยากรณ์นั้นเข้าใจยาก ขอให้ AI ของคุณเขียนสคริปต์ Sieve ให้คุณ: "กรองอีเมลทั้งหมดจาก billing@example.com ไปยังโฟลเดอร์ Billing" จะกลายเป็นสคริปต์ที่ใช้งานได้โดยไม่ต้องแตะข้อกำหนด RFC 5228

### 8. การเริ่มต้นใช้งานทีม {#team-onboarding}

เมื่อสมาชิกทีมใหม่เข้าร่วม ขอให้ AI สร้างนามแฝง สร้างรหัสผ่าน ส่งอีเมลต้อนรับพร้อมข้อมูลรับรอง และเพิ่มพวกเขาเป็นสมาชิกโดเมน หนึ่งคำสั่งเรียก API สี่ครั้ง

### 9. การตรวจสอบความปลอดภัย {#security-auditing}

ขอให้ AI ของคุณแสดงรายการโดเมนทั้งหมด ตรวจสอบสถานะการยืนยัน DNS ตรวจสอบการกำหนดค่าของนามแฝง และระบุโดเมนใดๆ ที่มีระเบียนที่ยังไม่ได้รับการยืนยัน การตรวจสอบความปลอดภัยอย่างรวดเร็วในภาษาธรรมชาติ

### 10. การตั้งค่าการส่งต่ออีเมล {#email-forwarding-setup}

กำลังตั้งค่าการส่งต่ออีเมลสำหรับโดเมนใหม่ใช่ไหม? ขอให้ AI สร้างโดเมน เพิ่มนามแฝงการส่งต่อ เข้ารหัสระเบียน DNS และตรวจสอบว่าทุกอย่างได้รับการกำหนดค่าอย่างถูกต้อง

### 11. การค้นหาและวิเคราะห์กล่องจดหมาย {#inbox-search-and-analysis}

ใช้เครื่องมือค้นหาข้อความเพื่อค้นหาอีเมลที่เฉพาะเจาะจง: "ค้นหาอีเมลทั้งหมดจาก john@example.com ใน 30 วันที่ผ่านมาที่มีไฟล์แนบ" พารามิเตอร์การค้นหามากกว่า 15 รายการทำให้สิ่งนี้มีประสิทธิภาพ *(ต้องใช้ข้อมูลรับรองนามแฝง)*

### 12. การจัดระเบียบโฟลเดอร์ {#folder-organization}

ขอให้ AI ของคุณสร้างโครงสร้างโฟลเดอร์สำหรับโปรเจกต์ใหม่ ย้ายข้อความระหว่างโฟลเดอร์ หรือทำความสะอาดโฟลเดอร์เก่าที่คุณไม่ต้องการอีกต่อไป *(ต้องใช้ข้อมูลรับรองนามแฝง)*

### 13. การหมุนเวียนรหัสผ่าน {#password-rotation}

สร้างรหัสผ่านนามแฝงใหม่ตามกำหนดเวลา ขอให้ AI ของคุณสร้างรหัสผ่านใหม่สำหรับแต่ละนามแฝงและรายงานข้อมูลรับรองใหม่

### 14. การเข้ารหัสระเบียน DNS {#dns-record-encryption}

เข้ารหัสระเบียนการส่งต่อของคุณก่อนที่จะเพิ่มลงใน DNS เครื่องมือ `encryptRecord` จัดการสิ่งนี้โดยไม่ต้องมีการรับรองความถูกต้อง — มีประโยชน์สำหรับการเข้ารหัสแบบครั้งเดียวอย่างรวดเร็ว

### 15. การวิเคราะห์บันทึกการจัดส่ง {#delivery-log-analysis}

ดาวน์โหลดบันทึกการจัดส่งอีเมลของคุณและขอให้ AI วิเคราะห์อัตราการตีกลับ ระบุผู้รับที่มีปัญหา หรือติดตามเวลาการจัดส่ง

### 16. การจัดการหลายโดเมน {#multi-domain-management}

หากคุณจัดการหลายโดเมน ขอให้ AI ให้รายงานสถานะแก่คุณ: โดเมนใดได้รับการยืนยัน โดเมนใดมีปัญหา มีนามแฝงกี่รายการ และขีดจำกัดการส่งเป็นอย่างไร

### 17. การกำหนดค่า Catch-All {#catch-all-configuration}

ตั้งค่ารหัสผ่าน catch-all สำหรับโดเมนที่ต้องการรับอีเมลที่ที่อยู่ใดๆ AI สามารถสร้าง แสดงรายการ และจัดการรหัสผ่านเหล่านี้ให้คุณได้

### 18. การจัดการคำเชิญโดเมน {#domain-invite-management}

เชิญสมาชิกทีมมาจัดการโดเมน ตรวจสอบคำเชิญที่รอดำเนินการ และล้างข้อมูลที่หมดอายุ มีประโยชน์สำหรับองค์กรที่มีผู้ดูแลโดเมนหลายคน

### 19. การทดสอบพื้นที่เก็บข้อมูล S3 {#s3-storage-testing}

หากคุณใช้พื้นที่เก็บข้อมูล S3 แบบกำหนดเองสำหรับการสำรองข้อมูลอีเมล ขอให้ AI ทดสอบการเชื่อมต่อและตรวจสอบว่าทำงานได้อย่างถูกต้อง

### 20. การเขียนฉบับร่างอีเมล {#email-draft-composition}

สร้างฉบับร่างอีเมลในกล่องจดหมายของคุณโดยไม่ต้องส่ง มีประโยชน์สำหรับการเตรียมอีเมลที่ต้องมีการตรวจสอบก่อนส่ง หรือสำหรับการสร้างเทมเพลตอีเมล *(ต้องใช้ข้อมูลรับรองนามแฝง)*


## ตัวอย่างคำสั่ง {#example-prompts}

นี่คือคำสั่งที่คุณสามารถใช้โดยตรงกับผู้ช่วย AI ของคุณ:

**การส่งอีเมล:**
> "ส่งอีเมลจาก hello@mydomain.com ถึง john@example.com พร้อมหัวข้อ 'Meeting Tomorrow' และเนื้อหา 'Hi John, are we still on for 2pm?'"

**การจัดการโดเมน:**
> "แสดงรายการโดเมนทั้งหมดของฉันและบอกฉันว่าโดเมนใดมีระเบียน DNS ที่ยังไม่ได้รับการยืนยัน"

**การสร้างนามแฝง:**
> "สร้างนามแฝงใหม่ support@mydomain.com ที่ส่งต่อไปยังอีเมลส่วนตัวของฉัน"

**การค้นหากล่องจดหมาย (ต้องใช้ข้อมูลรับรองนามแฝง):**
> "ค้นหาอีเมลที่ยังไม่ได้อ่านทั้งหมดจากสัปดาห์ที่แล้วที่กล่าวถึง 'invoice'"

**ปฏิทิน (ต้องใช้ข้อมูลรับรองนามแฝง):**
> "สร้างปฏิทินชื่อ 'Work' และเพิ่มการประชุมสำหรับวันพรุ่งนี้เวลา 14.00 น. ชื่อ 'Team Standup'"

**สคริปต์ Sieve:**
> "เขียนสคริปต์ Sieve สำหรับ info@mydomain.com ที่ตอบกลับอีเมลโดยอัตโนมัติด้วย 'Thanks for reaching out, we'll get back to you within 24 hours.'"

**การดำเนินการจำนวนมาก:**
> "สร้างนามแฝงสำหรับ sales@, support@, billing@ และ info@ บน mydomain.com ทั้งหมดส่งต่อไปยัง team@mydomain.com"

**การตรวจสอบความปลอดภัย:**
> "ตรวจสอบสถานะการยืนยัน DNS และ SMTP สำหรับโดเมนทั้งหมดของฉันและบอกฉันว่ามีอะไรที่ต้องให้ความสนใจหรือไม่"

**สร้างรหัสผ่านนามแฝง:**
> "สร้างรหัสผ่านสำหรับนามแฝง user@example.com เพื่อให้ฉันสามารถเข้าถึงกล่องจดหมายของฉันได้"


## ตัวแปรสภาพแวดล้อม {#environment-variables}

| ตัวแปร | จำเป็น | ค่าเริ่มต้น | คำอธิบาย |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | ใช่ | — | คีย์ API ของ Forward Email ของคุณ (ใช้เป็นชื่อผู้ใช้ Basic auth สำหรับปลายทางที่ใช้คีย์ API) |
| `FORWARD_EMAIL_ALIAS_USER` | ไม่ | — | ที่อยู่อีเมลนามแฝงสำหรับปลายทางกล่องจดหมาย (เช่น `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | ไม่ | — | รหัสผ่านนามแฝงที่สร้างขึ้นสำหรับปลายทางกล่องจดหมาย |
| `FORWARD_EMAIL_API_URL` | ไม่ | `https://api.forwardemail.net` | URL พื้นฐานของ API (สำหรับโฮสต์เองหรือการทดสอบ) |


## ความปลอดภัย {#security}

เซิร์ฟเวอร์ MCP ทำงานในเครื่องของคุณ นี่คือวิธีการทำงานของความปลอดภัย:

* **ข้อมูลรับรองของคุณยังคงอยู่ในเครื่อง** ทั้งคีย์ API และข้อมูลรับรองนามแฝงของคุณจะถูกอ่านจากตัวแปรสภาพแวดล้อมและใช้เพื่อรับรองความถูกต้องของคำขอ API ผ่าน HTTP Basic auth พวกเขาจะไม่ถูกส่งไปยังโมเดล AI
* **การส่งข้อมูลแบบ stdio** เซิร์ฟเวอร์สื่อสารกับไคลเอนต์ AI ผ่าน stdin/stdout ไม่มีการเปิดพอร์ตเครือข่าย
* **ไม่มีการจัดเก็บข้อมูล** เซิร์ฟเวอร์ไม่มีสถานะ มันไม่แคช บันทึก หรือจัดเก็บข้อมูลอีเมลใดๆ ของคุณ
* **โอเพนซอร์ส** ซอร์สโค้ดทั้งหมดอยู่บน [GitHub](https://github.com/forwardemail/mcp-server) คุณสามารถตรวจสอบทุกบรรทัดได้


## การใช้งานแบบโปรแกรม {#programmatic-usage}

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


## โอเพนซอร์ส {#open-source}

Forward Email MCP Server เป็น [โอเพนซอร์สบน GitHub](https://github.com/forwardemail/mcp-server) ภายใต้ใบอนุญาต BUSL-1.1 เราเชื่อมั่นในความโปร่งใส หากคุณพบข้อผิดพลาดหรือต้องการคุณสมบัติ [เปิดประเด็น](https://github.com/forwardemail/mcp-server/issues)
