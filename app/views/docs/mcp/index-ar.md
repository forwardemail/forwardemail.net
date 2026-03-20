# خادم MCP لإعادة توجيه البريد الإلكتروني {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="خادم MCP لإعادة توجيه البريد الإلكتروني" class="rounded-lg" />

<p class="lead mt-3">
  <strong>ملخص:</strong> يتيح <a href="https://github.com/forwardemail/mcp-server">خادم MCP مفتوح المصدر</a> لمساعدي الذكاء الاصطناعي مثل Claude و ChatGPT و Cursor و Windsurf إدارة بريدك الإلكتروني والنطاقات والاسماء المستعارة وجهات الاتصال والتقاويم من خلال اللغة الطبيعية. يتم عرض جميع نقاط النهاية الـ 68 لواجهة برمجة التطبيقات كأدوات MCP. يعمل محليًا عبر <code>npx @forwardemail/mcp-server</code> — بيانات اعتمادك لا تغادر جهازك أبدًا.
</p>


## جدول المحتويات {#table-of-contents}

* [ما هو MCP؟](#what-is-mcp)
* [البدء السريع](#quick-start)
  * [الحصول على مفتاح API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [عملاء MCP الآخرون](#other-mcp-clients)
* [المصادقة](#authentication)
  * [مصادقة مفتاح API](#api-key-auth)
  * [مصادقة الاسم المستعار](#alias-auth)
  * [إنشاء كلمة مرور للاسم المستعار](#generating-an-alias-password)
* [جميع الأدوات الـ 68](#all-68-tools)
  * [الحساب (مصادقة مفتاح API أو الاسم المستعار)](#account-api-key-or-alias-auth)
  * [النطاقات (مصادقة مفتاح API)](#domains-api-key)
  * [الأسماء المستعارة (مصادقة مفتاح API)](#aliases-api-key)
  * [البريد الإلكتروني — SMTP الصادر (مصادقة مفتاح API؛ Send يدعم كلاهما)](#emails--outbound-smtp-api-key-send-supports-both)
  * [الرسائل — IMAP (مصادقة الاسم المستعار)](#messages--imap-alias-auth)
  * [المجلدات — IMAP (مصادقة الاسم المستعار)](#folders--imap-alias-auth)
  * [جهات الاتصال — CardDAV (مصادقة الاسم المستعار)](#contacts--carddav-alias-auth)
  * [التقاويم — CalDAV (مصادقة الاسم المستعار)](#calendars--caldav-alias-auth)
  * [أحداث التقويم — CalDAV (مصادقة الاسم المستعار)](#calendar-events--caldav-alias-auth)
  * [سكريبتات Sieve (مصادقة مفتاح API)](#sieve-scripts-api-key)
  * [سكريبتات Sieve (مصادقة الاسم المستعار)](#sieve-scripts-alias-auth)
  * [أعضاء النطاق والدعوات (مصادقة مفتاح API)](#domain-members-and-invites-api-key)
  * [كلمات مرور Catch-All (مصادقة مفتاح API)](#catch-all-passwords-api-key)
  * [السجلات (مصادقة مفتاح API)](#logs-api-key)
  * [التشفير (بدون مصادقة)](#encrypt-no-auth)
* [20 حالة استخدام من الواقع](#20-real-world-use-cases)
  * [1. فرز البريد الإلكتروني](#1-email-triage)
  * [2. أتمتة إعداد النطاق](#2-domain-setup-automation)
  * [3. إدارة الأسماء المستعارة بالجملة](#3-bulk-alias-management)
  * [4. مراقبة حملات البريد الإلكتروني](#4-email-campaign-monitoring)
  * [5. مزامنة وتنظيف جهات الاتصال](#5-contact-sync-and-cleanup)
  * [6. إدارة التقويم](#6-calendar-management)
  * [7. أتمتة سكريبت Sieve](#7-sieve-script-automation)
  * [8. دمج الفريق](#8-team-onboarding)
  * [9. تدقيق الأمان](#9-security-auditing)
  * [10. إعداد إعادة توجيه البريد الإلكتروني](#10-email-forwarding-setup)
  * [11. البحث والتحليل في صندوق الوارد](#11-inbox-search-and-analysis)
  * [12. تنظيم المجلدات](#12-folder-organization)
  * [13. تدوير كلمات المرور](#13-password-rotation)
  * [14. تشفير سجلات DNS](#14-dns-record-encryption)
  * [15. تحليل سجلات التسليم](#15-delivery-log-analysis)
  * [16. إدارة متعددة النطاقات](#16-multi-domain-management)
  * [17. تكوين Catch-All](#17-catch-all-configuration)
  * [18. إدارة دعوات النطاق](#18-domain-invite-management)
  * [19. اختبار تخزين S3](#19-s3-storage-testing)
  * [20. صياغة مسودات البريد الإلكتروني](#20-email-draft-composition)
* [نماذج الأوامر](#example-prompts)
* [متغيرات البيئة](#environment-variables)
* [الأمان](#security)
* [الاستخدام البرمجي](#programmatic-usage)
* [المصدر المفتوح](#open-source)


## ما هو MCP؟ {#what-is-mcp}

[بروتوكول سياق النموذج](https://modelcontextprotocol.io) (MCP) هو معيار مفتوح أنشأته شركة Anthropic يتيح لنماذج الذكاء الاصطناعي استدعاء الأدوات الخارجية بأمان. بدلاً من نسخ ولصق استجابات API في نافذة الدردشة، يمنح MCP النموذج وصولًا مباشرًا ومنظمًا إلى خدماتك.

يغلف خادم MCP الخاص بنا كامل [واجهة برمجة تطبيقات Forward Email](/email-api) — كل نقطة نهاية، وكل معلمة — ويعرضها كأدوات يمكن لأي عميل متوافق مع MCP استخدامها. يعمل الخادم محليًا على جهازك باستخدام نقل stdio. تبقى بيانات اعتمادك في متغيرات البيئة الخاصة بك ولا تُرسل أبدًا إلى نموذج الذكاء الاصطناعي.


## البدء السريع {#quick-start}

### الحصول على مفتاح API {#get-an-api-key}
1. سجّل الدخول إلى [حساب Forward Email الخاص بك](/my-account/domains).
2. اذهب إلى **حسابي** → **الأمان** → **مفاتيح API**.
3. أنشئ مفتاح API جديد ونسخه.

### Claude Desktop {#claude-desktop}

أضف هذا إلى ملف إعدادات Claude Desktop الخاص بك:

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

أعد تشغيل Claude Desktop. يجب أن ترى أدوات Forward Email في منتقي الأدوات.

> **ملاحظة:** المتغيران `FORWARD_EMAIL_ALIAS_USER` و `FORWARD_EMAIL_ALIAS_PASSWORD` اختياريان لكنهما مطلوبان لأدوات صندوق البريد (الرسائل، المجلدات، جهات الاتصال، التقويمات). راجع [المصادقة](#authentication) للتفاصيل.

### Cursor {#cursor}

افتح إعدادات Cursor → MCP → أضف خادم:

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

افتح إعدادات Windsurf → MCP → أضف خادم بنفس التكوين أعلاه.

### عملاء MCP آخرون {#other-mcp-clients}

أي عميل يدعم نقل MCP stdio سيعمل. الأمر هو:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## المصادقة {#authentication}

تستخدم واجهة برمجة تطبيقات Forward Email **مصادقة HTTP Basic** مع نوعين مختلفين من بيانات الاعتماد حسب نقطة النهاية. يتولى خادم MCP هذا تلقائيًا — كل ما عليك هو توفير بيانات الاعتماد الصحيحة.

### مصادقة مفتاح API {#api-key-auth}

تستخدم معظم نقاط النهاية الإدارية (النطاقات، الأسماء المستعارة، رسائل البريد الصادرة، السجلات) **مفتاح API** الخاص بك كاسم مستخدم للمصادقة Basic مع كلمة مرور فارغة.

هذا هو نفس مفتاح API الذي تستخدمه لواجهة REST API. قم بتعيينه عبر متغير البيئة `FORWARD_EMAIL_API_KEY`.

### مصادقة الاسم المستعار {#alias-auth}

تستخدم نقاط نهاية صندوق البريد (الرسائل، المجلدات، جهات الاتصال، التقويمات، سكربتات sieve الخاصة بالاسم المستعار) **بيانات اعتماد الاسم المستعار** — عنوان البريد الإلكتروني للاسم المستعار كاسم مستخدم وكلمة مرور مولدة ككلمة مرور.

تصل هذه النقاط إلى بيانات كل اسم مستعار عبر بروتوكولات IMAP و CalDAV و CardDAV. تتطلب عنوان البريد الإلكتروني للاسم المستعار وكلمة مرور مولدة، وليس مفتاح API.

يمكنك توفير بيانات اعتماد الاسم المستعار بطريقتين:

1. **متغيرات البيئة** (موصى بها للاسم المستعار الافتراضي): عيّن `FORWARD_EMAIL_ALIAS_USER` و `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **معاملات لكل استدعاء أداة**: مرر `alias_username` و `alias_password` كوسيطات لأي أداة تستخدم مصادقة الاسم المستعار. هذه تتجاوز متغيرات البيئة، وهو أمر مفيد عند العمل مع أسماء مستعارة متعددة.

### توليد كلمة مرور للاسم المستعار {#generating-an-alias-password}

قبل أن تتمكن من استخدام أدوات مصادقة الاسم المستعار، تحتاج إلى توليد كلمة مرور للاسم المستعار. يمكنك فعل ذلك باستخدام أداة `generateAliasPassword` أو عبر API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

تتضمن الاستجابة حقول `username` (بريد الاسم المستعار) و `password`. استخدم هذه كبيانات اعتماد للاسم المستعار.

> **نصيحة:** يمكنك أيضًا أن تطلب من مساعدك الذكي: *"أنشئ كلمة مرور للاسم المستعار <user@example.com> على النطاق example.com"* — سيستدعي أداة `generateAliasPassword` ويعيد بيانات الاعتماد.

تلخص الجدول أدناه طريقة المصادقة التي يتطلبها كل مجموعة أدوات:

| مجموعة الأدوات                                                  | طريقة المصادقة           | بيانات الاعتماد                                              |
| -------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------ |
| الحساب                                                        | مفتاح API **أو** مصادقة الاسم المستعار | أي منهما                                                    |
| النطاقات، الأسماء المستعارة، أعضاء النطاق، الدعوات، كلمات مرور Catch-All | مفتاح API                | `FORWARD_EMAIL_API_KEY`                                      |
| رسائل البريد الصادرة (قائمة، جلب، حذف، حد)                   | مفتاح API                | `FORWARD_EMAIL_API_KEY`                                      |
| إرسال البريد الإلكتروني                                       | مفتاح API **أو** مصادقة الاسم المستعار | أي منهما                                                    |
| الرسائل (IMAP)                                                | مصادقة الاسم المستعار    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD`  |
| المجلدات (IMAP)                                               | مصادقة الاسم المستعار    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD`  |
| جهات الاتصال (CardDAV)                                        | مصادقة الاسم المستعار    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD`  |
| التقويمات (CalDAV)                                           | مصادقة الاسم المستعار    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD`  |
| أحداث التقويم (CalDAV)                                       | مصادقة الاسم المستعار    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD`  |
| سكربتات Sieve (محددة بالنطاق)                               | مفتاح API                | `FORWARD_EMAIL_API_KEY`                                      |
| سكربتات Sieve (محددة بالاسم المستعار)                       | مصادقة الاسم المستعار    | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD`  |
| السجلات                                                      | مفتاح API                | `FORWARD_EMAIL_API_KEY`                                      |
| التشفير                                                     | لا شيء                   | لا حاجة لبيانات اعتماد                                      |
## جميع الأدوات الـ 68 {#all-68-tools}

كل أداة ترتبط مباشرة بنقطة نهاية [Forward Email API](/email-api). تستخدم المعلمات نفس أسماء وثائق API. يتم ذكر طريقة المصادقة في عنوان كل قسم.

### الحساب (مفتاح API أو مصادقة الاسم المستعار) {#account-api-key-or-alias-auth}

مع مصادقة مفتاح API، تُرجع هذه الأدوات معلومات حساب المستخدم الخاص بك. مع مصادقة الاسم المستعار، تُرجع معلومات الاسم المستعار/صندوق البريد بما في ذلك حصة التخزين والإعدادات.

| الأداة           | نقطة نهاية API      | الوصف                        |
| --------------- | ------------------- | ---------------------------- |
| `getAccount`    | `GET /v1/account`   | الحصول على معلومات حسابك     |
| `updateAccount` | `PUT /v1/account`   | تحديث إعدادات حسابك          |

### النطاقات (مفتاح API) {#domains-api-key}

| الأداة                | نقطة نهاية API                                   | الوصف                      |
| --------------------- | ------------------------------------------------ | -------------------------- |
| `listDomains`         | `GET /v1/domains`                                | سرد جميع نطاقاتك           |
| `createDomain`        | `POST /v1/domains`                               | إضافة نطاق جديد            |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | الحصول على تفاصيل النطاق   |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | تحديث إعدادات النطاق       |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | إزالة نطاق                 |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | التحقق من سجلات DNS        |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | التحقق من إعداد SMTP       |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | اختبار تخزين S3 مخصص      |

### الأسماء المستعارة (مفتاح API) {#aliases-api-key}

| الأداة                    | نقطة نهاية API                                                      | الوصف                                  |
| ------------------------- | ------------------------------------------------------------------- | -------------------------------------- |
| `listAliases`             | `GET /v1/domains/:domain_id/aliases`                                | سرد الأسماء المستعارة لنطاق           |
| `createAlias`             | `POST /v1/domains/:domain_id/aliases`                               | إنشاء اسم مستعار جديد                  |
| `getAlias`                | `GET /v1/domains/:domain_id/aliases/:alias_id`                      | الحصول على تفاصيل الاسم المستعار      |
| `updateAlias`             | `PUT /v1/domains/:domain_id/aliases/:alias_id`                      | تحديث اسم مستعار                      |
| `deleteAlias`             | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                   | حذف اسم مستعار                       |
| `generateAliasPassword`   | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password`   | إنشاء كلمة مرور IMAP/SMTP لمصادقة الاسم المستعار |

### الرسائل الإلكترونية — SMTP الصادر (مفتاح API؛ Send يدعم كلاهما) {#emails--outbound-smtp-api-key-send-supports-both}

| الأداة           | نقطة نهاية API          | المصادقة               | الوصف                         |
| ---------------- | ----------------------- | ---------------------- | ----------------------------- |
| `sendEmail`      | `POST /v1/emails`       | مفتاح API أو مصادقة الاسم المستعار | إرسال بريد إلكتروني عبر SMTP  |
| `listEmails`     | `GET /v1/emails`        | مفتاح API              | سرد الرسائل الصادرة           |
| `getEmail`       | `GET /v1/emails/:id`    | مفتاح API              | الحصول على تفاصيل وحالة البريد |
| `deleteEmail`    | `DELETE /v1/emails/:id` | مفتاح API              | حذف بريد إلكتروني في الطابور  |
| `getEmailLimit`  | `GET /v1/emails/limit`  | مفتاح API              | التحقق من حد الإرسال الخاص بك  |

تقبل أداة `sendEmail` المعلمات `from`، `to`، `cc`، `bcc`، `subject`، `text`، `html`، و `attachments`. هذا هو نفس نقطة نهاية `POST /v1/emails`.

### الرسائل — IMAP (مصادقة الاسم المستعار) {#messages--imap-alias-auth}

> **يتطلب بيانات اعتماد الاسم المستعار.** قم بتمرير `alias_username` و `alias_password` أو تعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و `FORWARD_EMAIL_ALIAS_PASSWORD`.
| الأداة           | نقطة نهاية API             | الوصف                              |
| --------------- | ------------------------- | --------------------------------- |
| `listMessages`  | `GET /v1/messages`        | سرد والبحث في الرسائل في صندوق البريد |
| `createMessage` | `POST /v1/messages`       | إنشاء مسودة أو رفع رسالة           |
| `getMessage`    | `GET /v1/messages/:id`    | الحصول على رسالة بواسطة المعرف      |
| `updateMessage` | `PUT /v1/messages/:id`    | تحديث العلامات (مقروء، مميز، إلخ)  |
| `deleteMessage` | `DELETE /v1/messages/:id` | حذف رسالة                        |

أداة `listMessages` تدعم أكثر من 15 معلمة بحث بما في ذلك `subject`، `from`، `to`، `text`، `since`، `before`، `is_unread`، و `has_attachment`. راجع [توثيق API](/email-api) للقائمة الكاملة.

### المجلدات — IMAP (مصادقة الاسم المستعار) {#folders--imap-alias-auth}

> **يتطلب بيانات اعتماد الاسم المستعار.** مرر `alias_username` و `alias_password` أو قم بتعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و `FORWARD_EMAIL_ALIAS_PASSWORD`.

| الأداة          | نقطة نهاية API            | الوصف                     |
| -------------- | ------------------------- | ------------------------- |
| `listFolders`  | `GET /v1/folders`         | سرد جميع مجلدات صندوق البريد |
| `createFolder` | `POST /v1/folders`        | إنشاء مجلد جديد           |
| `getFolder`    | `GET /v1/folders/:id`     | الحصول على تفاصيل المجلد  |
| `updateFolder` | `PUT /v1/folders/:id`     | إعادة تسمية مجلد          |
| `deleteFolder` | `DELETE /v1/folders/:id`  | حذف مجلد                 |

### جهات الاتصال — CardDAV (مصادقة الاسم المستعار) {#contacts--carddav-alias-auth}

> **يتطلب بيانات اعتماد الاسم المستعار.** مرر `alias_username` و `alias_password` أو قم بتعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و `FORWARD_EMAIL_ALIAS_PASSWORD`.

| الأداة           | نقطة نهاية API            | الوصف                  |
| --------------- | ------------------------- | ---------------------- |
| `listContacts`  | `GET /v1/contacts`        | سرد جميع جهات الاتصال  |
| `createContact` | `POST /v1/contacts`       | إنشاء جهة اتصال جديدة  |
| `getContact`    | `GET /v1/contacts/:id`    | الحصول على تفاصيل جهة الاتصال |
| `updateContact` | `PUT /v1/contacts/:id`    | تحديث جهة اتصال        |
| `deleteContact` | `DELETE /v1/contacts/:id` | حذف جهة اتصال          |

### التقويمات — CalDAV (مصادقة الاسم المستعار) {#calendars--caldav-alias-auth}

> **يتطلب بيانات اعتماد الاسم المستعار.** مرر `alias_username` و `alias_password` أو قم بتعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و `FORWARD_EMAIL_ALIAS_PASSWORD`.

| الأداة            | نقطة نهاية API             | الوصف                  |
| ----------------- | -------------------------- | ---------------------- |
| `listCalendars`  | `GET /v1/calendars`        | سرد جميع التقويمات     |
| `createCalendar` | `POST /v1/calendars`       | إنشاء تقويم جديد       |
| `getCalendar`    | `GET /v1/calendars/:id`    | الحصول على تفاصيل التقويم |
| `updateCalendar` | `PUT /v1/calendars/:id`    | تحديث تقويم            |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | حذف تقويم              |

### أحداث التقويم — CalDAV (مصادقة الاسم المستعار) {#calendar-events--caldav-alias-auth}

> **يتطلب بيانات اعتماد الاسم المستعار.** مرر `alias_username` و `alias_password` أو قم بتعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و `FORWARD_EMAIL_ALIAS_PASSWORD`.

| الأداة                 | نقطة نهاية API                  | الوصف                 |
| ---------------------- | ------------------------------- | --------------------- |
| `listCalendarEvents`  | `GET /v1/calendar-events`        | سرد جميع الأحداث      |
| `createCalendarEvent` | `POST /v1/calendar-events`       | إنشاء حدث جديد        |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`    | الحصول على تفاصيل الحدث |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`    | تحديث حدث             |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | حذف حدث               |

### سكريبتات Sieve (مفتاح API) {#sieve-scripts-api-key}

تستخدم هذه المسارات نطاقات مخصصة للنطاق وتوثق باستخدام مفتاح API الخاص بك.

| الأداة                 | نقطة نهاية API                                                               | الوصف                    |
| ---------------------- | ---------------------------------------------------------------------------- | ------------------------ |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                         | سرد السكريبتات لاسم مستعار |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                        | إنشاء سكريبت جديد         |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`              | الحصول على تفاصيل السكريبت |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`              | تحديث سكريبت              |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | حذف سكريبت                |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate`    | تفعيل سكريبت              |
### سكريبتات Sieve (مصادقة الاسم المستعار) {#sieve-scripts-alias-auth}

تستخدم هذه المصادقة على مستوى الاسم المستعار. مفيدة لأتمتة كل اسم مستعار بدون الحاجة إلى مفتاح API.

> **يتطلب بيانات اعتماد الاسم المستعار.** مرر `alias_username` و `alias_password` أو قم بتعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و `FORWARD_EMAIL_ALIAS_PASSWORD`.

| الأداة                         | نقطة نهاية API                                | الوصف               |
| ------------------------------ | -------------------------------------------- | ------------------- |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | سرد السكريبتات      |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | إنشاء سكريبت        |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | الحصول على تفاصيل السكريبت |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | تحديث سكريبت        |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | حذف سكريبت          |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | تفعيل سكريبت        |

### أعضاء ودعوات النطاق (مفتاح API) {#domain-members-and-invites-api-key}

| الأداة                 | نقطة نهاية API                                       | الوصف                     |
| ---------------------- | ---------------------------------------------------- | ------------------------- |
| `updateDomainMember`    | `PUT /v1/domains/:domain_id/members/:member_id`      | تغيير دور عضو             |
| `removeDomainMember`    | `DELETE /v1/domains/:domain_id/members/:member_id`   | إزالة عضو                 |
| `acceptDomainInvite`    | `GET /v1/domains/:domain_id/invites`                 | قبول دعوة معلقة           |
| `createDomainInvite`    | `POST /v1/domains/:domain_id/invites`                | دعوة شخص إلى نطاق         |
| `removeDomainInvite`    | `DELETE /v1/domains/:domain_id/invites`              | إلغاء دعوة                |

### كلمات مرور Catch-All (مفتاح API) {#catch-all-passwords-api-key}

| الأداة                     | نقطة نهاية API                                                  | الوصف                      |
| -------------------------- | --------------------------------------------------------------- | -------------------------- |
| `listCatchAllPasswords`    | `GET /v1/domains/:domain_id/catch-all-passwords`                | سرد كلمات مرور Catch-All   |
| `createCatchAllPassword`   | `POST /v1/domains/:domain_id/catch-all-passwords`               | إنشاء كلمة مرور Catch-All  |
| `deleteCatchAllPassword`   | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id`   | حذف كلمة مرور Catch-All    |

### السجلات (مفتاح API) {#logs-api-key}

| الأداة           | نقطة نهاية API            | الوصف                        |
| ---------------- | ------------------------- | ---------------------------- |
| `downloadLogs`   | `GET /v1/logs/download`   | تنزيل سجلات تسليم البريد الإلكتروني |

### التشفير (بدون مصادقة) {#encrypt-no-auth}

| الأداة            | نقطة نهاية API       | الوصف                      |
| ----------------- | -------------------- | -------------------------- |
| `encryptRecord`   | `POST /v1/encrypt`   | تشفير سجل DNS TXT          |

هذه الأداة لا تتطلب مصادقة. تقوم بتشفير سجلات التوجيه مثل `forward-email=user@example.com` للاستخدام في سجلات DNS TXT.


## 20 حالة استخدام واقعية {#20-real-world-use-cases}

إليك طرق عملية لاستخدام خادم MCP مع مساعدك الذكي:

### 1. فرز البريد الإلكتروني {#1-email-triage}

اطلب من مساعدك الذكي مسح صندوق الوارد الخاص بك وتلخيص الرسائل غير المقروءة. يمكنه تمييز الرسائل العاجلة، وتصنيفها حسب المرسل، وصياغة الردود — كل ذلك من خلال اللغة الطبيعية. *(يتطلب بيانات اعتماد الاسم المستعار للوصول إلى صندوق الوارد.)*

### 2. أتمتة إعداد النطاق {#2-domain-setup-automation}

هل تقوم بإعداد نطاق جديد؟ اطلب من المساعد الذكي إنشاء النطاق، إضافة الأسماء المستعارة، التحقق من سجلات DNS، واختبار إعداد SMTP. ما كان يستغرق عادة 10 دقائق من النقر عبر لوحات التحكم يصبح محادثة واحدة.

### 3. إدارة الأسماء المستعارة بالجملة {#3-bulk-alias-management}

هل تحتاج إلى إنشاء 20 اسمًا مستعارًا لمشروع جديد؟ وصف ما تحتاجه ودع المساعد الذكي يتولى العمل المتكرر. يمكنه إنشاء الأسماء المستعارة، تعيين قواعد التوجيه، وإنشاء كلمات المرور دفعة واحدة.
### 4. مراقبة حملات البريد الإلكتروني {#4-email-campaign-monitoring}

اطلب من الذكاء الاصطناعي الخاص بك التحقق من حدود الإرسال، سرد رسائل البريد الصادرة الأخيرة، والإبلاغ عن حالة التسليم. مفيد لمراقبة صحة البريد الإلكتروني التفاعلي.

### 5. مزامنة وتنظيف جهات الاتصال {#5-contact-sync-and-cleanup}

استخدم أدوات CardDAV لسرد جميع جهات الاتصال، العثور على التكرارات، تحديث المعلومات القديمة، أو إنشاء جهات اتصال جماعية من جدول بيانات تلصقه في الدردشة. *(يتطلب بيانات اعتماد الاسم المستعار.)*

### 6. إدارة التقويم {#6-calendar-management}

أنشئ تقاويم، أضف أحداثًا، حدّث أوقات الاجتماعات، واحذف الأحداث الملغاة — كل ذلك من خلال المحادثة. تدعم أدوات CalDAV عمليات CRUD كاملة على كل من التقاويم والأحداث. *(يتطلب بيانات اعتماد الاسم المستعار.)*

### 7. أتمتة سكريبت Sieve {#7-sieve-script-automation}

سكريبتات Sieve قوية لكن الصياغة معقدة. اطلب من الذكاء الاصطناعي كتابة سكريبتات Sieve لك: "تصفية جميع الرسائل من <billing@example.com> إلى مجلد الفواتير" تصبح سكريبتًا عمليًا دون الحاجة للتعامل مع مواصفة RFC 5228.

### 8. انضمام الفريق {#8-team-onboarding}

عندما ينضم عضو جديد للفريق، اطلب من الذكاء الاصطناعي إنشاء اسمه المستعار، توليد كلمة مرور، إرسال بريد ترحيبي يحتوي على بيانات الاعتماد، وإضافته كعضو في النطاق. أمر واحد، أربع مكالمات API.

### 9. تدقيق الأمان {#9-security-auditing}

اطلب من الذكاء الاصطناعي سرد جميع النطاقات، التحقق من حالة التحقق من DNS، مراجعة تكوينات الأسماء المستعارة، وتحديد أي نطاقات بها سجلات غير مؤكدة. فحص أمني سريع بلغة طبيعية.

### 10. إعداد إعادة توجيه البريد الإلكتروني {#10-email-forwarding-setup}

هل تقوم بإعداد إعادة توجيه البريد الإلكتروني لنطاق جديد؟ اطلب من الذكاء الاصطناعي إنشاء النطاق، إضافة أسماء مستعارة لإعادة التوجيه، تشفير سجلات DNS، والتحقق من أن كل شيء مكوّن بشكل صحيح.

### 11. البحث والتحليل في صندوق الوارد {#11-inbox-search-and-analysis}

استخدم أدوات البحث عن الرسائل للعثور على رسائل محددة: "ابحث عن جميع الرسائل من <john@example.com> خلال آخر 30 يومًا التي تحتوي على مرفقات." أكثر من 15 معلمة بحث تجعل هذا قويًا. *(يتطلب بيانات اعتماد الاسم المستعار.)*

### 12. تنظيم المجلدات {#12-folder-organization}

اطلب من الذكاء الاصطناعي إنشاء هيكل مجلدات لمشروع جديد، نقل الرسائل بين المجلدات، أو تنظيف المجلدات القديمة التي لم تعد بحاجة إليها. *(يتطلب بيانات اعتماد الاسم المستعار.)*

### 13. تدوير كلمات المرور {#13-password-rotation}

توليد كلمات مرور جديدة للأسماء المستعارة بجدول زمني. اطلب من الذكاء الاصطناعي توليد كلمة مرور جديدة لكل اسم مستعار والإبلاغ عن بيانات الاعتماد الجديدة.

### 14. تشفير سجلات DNS {#14-dns-record-encryption}

قم بتشفير سجلات إعادة التوجيه قبل إضافتها إلى DNS. أداة `encryptRecord` تتولى ذلك بدون مصادقة — مفيدة للتشفير السريع لمرة واحدة.

### 15. تحليل سجلات التسليم {#15-delivery-log-analysis}

قم بتنزيل سجلات تسليم البريد الإلكتروني واطلب من الذكاء الاصطناعي تحليل معدلات الارتداد، تحديد المستلمين المشكلين، أو تتبع أوقات التسليم.

### 16. إدارة النطاقات المتعددة {#16-multi-domain-management}

إذا كنت تدير عدة نطاقات، اطلب من الذكاء الاصطناعي تزويدك بتقرير حالة: أي النطاقات مؤكدة، أيها بها مشاكل، عدد الأسماء المستعارة لكل منها، وكيف تبدو حدود الإرسال.

### 17. إعداد Catch-All {#17-catch-all-configuration}

قم بإعداد كلمات مرور catch-all للنطاقات التي تحتاج إلى استقبال البريد على أي عنوان. يمكن للذكاء الاصطناعي إنشاء هذه الكلمات، سردها، وإدارتها نيابة عنك.

### 18. إدارة دعوات النطاق {#18-domain-invite-management}

ادعُ أعضاء الفريق لإدارة النطاقات، تحقق من الدعوات المعلقة، ونظف الدعوات المنتهية. مفيد للمنظمات التي لديها عدة مديري نطاقات.

### 19. اختبار تخزين S3 {#19-s3-storage-testing}

إذا كنت تستخدم تخزين S3 مخصص لنسخ البريد الإلكتروني الاحتياطية، اطلب من الذكاء الاصطناعي اختبار الاتصال والتحقق من أنه يعمل بشكل صحيح.

### 20. صياغة مسودات البريد الإلكتروني {#20-email-draft-composition}

أنشئ مسودات بريد إلكتروني في صندوق بريدك دون إرسالها. مفيد لتحضير رسائل تحتاج مراجعة قبل الإرسال، أو لبناء قوالب بريد إلكتروني. *(يتطلب بيانات اعتماد الاسم المستعار.)*


## أمثلة على الأوامر {#example-prompts}

إليك أوامر يمكنك استخدامها مباشرة مع مساعد الذكاء الاصطناعي الخاص بك:

**إرسال بريد إلكتروني:**

> "أرسل بريدًا إلكترونيًا من <hello@mydomain.com> إلى <john@example.com> بعنوان 'الاجتماع غدًا' ومحتوى 'مرحبًا جون، هل ما زلنا على موعد الساعة 2 ظهرًا؟'"
**إدارة النطاق:**

> "أدرج جميع نطاقاتي وأخبرني أي منها يحتوي على سجلات DNS غير مؤكدة."

**إنشاء اسم مستعار:**

> "أنشئ اسمًا مستعارًا جديدًا <support@mydomain.com> يقوم بإعادة التوجيه إلى بريدي الإلكتروني الشخصي."

**البحث في صندوق الوارد (يتطلب بيانات اعتماد الاسم المستعار):**

> "ابحث عن جميع الرسائل غير المقروءة من الأسبوع الماضي التي تذكر 'invoice'."

**التقويم (يتطلب بيانات اعتماد الاسم المستعار):**

> "أنشئ تقويمًا يسمى 'العمل' وأضف اجتماعًا ليوم غد الساعة 2 مساءً يسمى 'اجتماع الفريق'."

**سكريبتات Sieve:**

> "اكتب سكريبت Sieve لـ <info@mydomain.com> يرد تلقائيًا على الرسائل بـ 'شكرًا لتواصلك معنا، سنعود إليك خلال 24 ساعة.'"

**العمليات الجماعية:**

> "أنشئ أسماء مستعارة لـ sales@، support@، billing@، و info@ على mydomain.com، جميعها تعيد التوجيه إلى <team@mydomain.com>."

**فحص الأمان:**

> "تحقق من حالة التحقق من DNS و SMTP لجميع نطاقاتي وأخبرني إذا كان هناك شيء يحتاج إلى اهتمام."

**توليد كلمة مرور للاسم المستعار:**

> "أنشئ كلمة مرور للاسم المستعار <user@example.com> حتى أتمكن من الوصول إلى صندوق الوارد الخاص بي."


## متغيرات البيئة {#environment-variables}

| المتغير                        | مطلوب   | الافتراضي                      | الوصف                                                                          |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | نعم      | —                              | مفتاح API الخاص بـ Forward Email (يستخدم كاسم مستخدم للمصادقة الأساسية لنقاط نهاية API) |
| `FORWARD_EMAIL_ALIAS_USER`     | لا       | —                              | عنوان البريد الإلكتروني للاسم المستعار لنقاط نهاية صندوق البريد (مثل `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | لا       | —                              | كلمة مرور الاسم المستعار المولدة لنقاط نهاية صندوق البريد                     |
| `FORWARD_EMAIL_API_URL`        | لا       | `https://api.forwardemail.net` | عنوان URL الأساسي لـ API (للاستضافة الذاتية أو الاختبار)                      |


## الأمان {#security}

يعمل خادم MCP محليًا على جهازك. إليك كيف يعمل الأمان:

* **تبقى بيانات اعتمادك محلية.** يتم قراءة كل من مفتاح API وبيانات اعتماد الاسم المستعار من متغيرات البيئة وتستخدم للمصادقة على طلبات API عبر المصادقة الأساسية HTTP. لا يتم إرسالها أبدًا إلى نموذج الذكاء الاصطناعي.
* **نقل stdio.** يتواصل الخادم مع عميل الذكاء الاصطناعي عبر stdin/stdout. لا يتم فتح أي منافذ شبكة.
* **عدم تخزين البيانات.** الخادم بدون حالة. لا يقوم بالتخزين المؤقت أو التسجيل أو تخزين أي من بيانات بريدك الإلكتروني.
* **مفتوح المصدر.** الكود الكامل موجود على [GitHub](https://github.com/forwardemail/mcp-server). يمكنك مراجعة كل سطر.


## الاستخدام البرمجي {#programmatic-usage}

يمكنك أيضًا استخدام الخادم كمكتبة:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## مفتوح المصدر {#open-source}

خادم Forward Email MCP هو [مفتوح المصدر على GitHub](https://github.com/forwardemail/mcp-server) تحت رخصة BUSL-1.1. نحن نؤمن بالشفافية. إذا وجدت خطأ أو أردت ميزة، [افتح تذكرة](https://github.com/forwardemail/mcp-server/issues).
