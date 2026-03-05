# خادم Forward Email MCP

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> يتيح <a href="https://github.com/forwardemail/mcp-server">خادم MCP مفتوح المصدر</a> الخاص بنا للمساعدين الذكاء الاصطناعي مثل Claude وChatGPT وCursor وWindsurf إدارة بريدك الإلكتروني ونطاقاتك وأسماءك المستعارة وجهات اتصالك وتقويماتك من خلال اللغة الطبيعية. يتم عرض جميع نقاط نهاية API الـ 68 كأدوات MCP. يعمل محليًا عبر <code>npx @forwardemail/mcp-server</code> — لا تغادر بيانات اعتمادك جهازك أبدًا.
</p>

## جدول المحتويات

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
  * [الحساب (مفتاح API أو مصادقة الاسم المستعار)](#account-api-key-or-alias-auth)
  * [النطاقات (مفتاح API)](#domains-api-key)
  * [الأسماء المستعارة (مفتاح API)](#aliases-api-key)
  * [رسائل البريد الإلكتروني - SMTP الصادر (مفتاح API؛ الإرسال يدعم كلاهما)](#emails--outbound-smtp-api-key-send-supports-both)
  * [الرسائل - IMAP (مصادقة الاسم المستعار)](#messages--imap-alias-auth)
  * [المجلدات - IMAP (مصادقة الاسم المستعار)](#folders--imap-alias-auth)
  * [جهات الاتصال - CardDAV (مصادقة الاسم المستعار)](#contacts--carddav-alias-auth)
  * [التقويمات - CalDAV (مصادقة الاسم المستعار)](#calendars--caldav-alias-auth)
  * [أحداث التقويم - CalDAV (مصادقة الاسم المستعار)](#calendar-events--caldav-alias-auth)
  * [نصوص Sieve (مفتاح API)](#sieve-scripts-api-key)
  * [نصوص Sieve (مصادقة الاسم المستعار)](#sieve-scripts-alias-auth)
  * [أعضاء النطاق والدعوات (مفتاح API)](#domain-members-and-invites-api-key)
  * [كلمات المرور الشاملة (مفتاح API)](#catch-all-passwords-api-key)
  * [السجلات (مفتاح API)](#logs-api-key)
  * [التشفير (بدون مصادقة)](#encrypt-no-auth)
* [20 حالة استخدام واقعية](#20-real-world-use-cases)
* [أمثلة على المطالبات](#example-prompts)
* [متغيرات البيئة](#environment-variables)
* [الأمان](#security)
* [الاستخدام البرمجي](#programmatic-usage)
* [مفتوح المصدر](#open-source)


## ما هو MCP؟ {#what-is-mcp}

Model Context Protocol (MCP) هو معيار مفتوح أنشأته Anthropic يتيح لنماذج الذكاء الاصطناعي استدعاء الأدوات الخارجية بأمان. بدلاً من نسخ ولصق استجابات API في نافذة الدردشة، يمنح MCP النموذج وصولاً مباشرًا ومنظمًا إلى خدماتك.

يغلف خادم MCP الخاص بنا واجهة برمجة تطبيقات Forward Email API بالكامل - كل نقطة نهاية، وكل معلمة - ويعرضها كأدوات يمكن لأي عميل متوافق مع MCP استخدامها. يعمل الخادم محليًا على جهازك باستخدام نقل stdio. تظل بيانات اعتمادك في متغيرات بيئتك ولا يتم إرسالها أبدًا إلى نموذج الذكاء الاصطناعي.


## البدء السريع {#quick-start}

### الحصول على مفتاح API {#get-an-api-key}

1. سجل الدخول إلى حسابك في [Forward Email](/my-account/domains).
2. اذهب إلى **حسابي** ← **الأمان** ← **مفاتيح API**.
3. أنشئ مفتاح API جديد وانسخه.

### Claude Desktop {#claude-desktop}

أضف هذا إلى ملف تكوين Claude Desktop الخاص بك:

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

> **ملاحظة:** متغيرات `FORWARD_EMAIL_ALIAS_USER` و`FORWARD_EMAIL_ALIAS_PASSWORD` اختيارية ولكنها مطلوبة لأدوات صندوق البريد (الرسائل، المجلدات، جهات الاتصال، التقويمات). راجع [المصادقة](#authentication) للحصول على التفاصيل.

### Cursor {#cursor}

افتح إعدادات Cursor ← MCP ← إضافة خادم:

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

افتح إعدادات Windsurf ← MCP ← إضافة خادم بنفس التكوين أعلاه.

### عملاء MCP الآخرون {#other-mcp-clients}

أي عميل يدعم نقل MCP stdio سيعمل. الأمر هو:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## المصادقة {#authentication}

تستخدم واجهة برمجة تطبيقات Forward Email API **مصادقة HTTP Basic** مع نوعين مختلفين من بيانات الاعتماد اعتمادًا على نقطة النهاية. يتعامل خادم MCP مع هذا تلقائيًا - ما عليك سوى توفير بيانات الاعتماد الصحيحة.

### مصادقة مفتاح API {#api-key-auth}

تستخدم معظم نقاط نهاية الإدارة (النطاقات، الأسماء المستعارة، رسائل البريد الإلكتروني الصادرة، السجلات) **مفتاح API** الخاص بك كاسم مستخدم لمصادقة Basic مع كلمة مرور فارغة.

هذا هو نفس مفتاح API الذي تستخدمه لواجهة برمجة تطبيقات REST. قم بتعيينه عبر متغير البيئة `FORWARD_EMAIL_API_KEY`.

### مصادقة الاسم المستعار {#alias-auth}

تستخدم نقاط نهاية صندوق البريد (الرسائل، المجلدات، جهات الاتصال، التقويمات، نصوص Sieve ذات النطاق المستعار) **بيانات اعتماد الاسم المستعار** - عنوان البريد الإلكتروني للاسم المستعار كاسم مستخدم وكلمة مرور تم إنشاؤها ككلمة مرور.

تصل نقاط النهاية هذه إلى البيانات لكل اسم مستعار عبر بروتوكولات IMAP وCalDAV وCardDAV. تتطلب عنوان البريد الإلكتروني للاسم المستعار وكلمة مرور تم إنشاؤها، وليس مفتاح API.

يمكنك توفير بيانات اعتماد الاسم المستعار بطريقتين:

1. **متغيرات البيئة** (موصى بها للاسم المستعار الافتراضي): قم بتعيين `FORWARD_EMAIL_ALIAS_USER` و`FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **معلمات استدعاء الأداة الواحدة**: قم بتمرير `alias_username` و`alias_password` كمعلمات لأي أداة مصادقة الاسم المستعار. تتجاوز هذه المتغيرات البيئية، وهو أمر مفيد عند العمل مع أسماء مستعارة متعددة.

### إنشاء كلمة مرور للاسم المستعار {#generating-an-alias-password}

قبل أن تتمكن من استخدام أدوات مصادقة الاسم المستعار، تحتاج إلى إنشاء كلمة مرور للاسم المستعار. يمكنك القيام بذلك باستخدام أداة `generateAliasPassword` أو عبر API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

يتضمن الرد حقلي `username` (البريد الإلكتروني للاسم المستعار) و`password`. استخدم هذه كبيانات اعتماد الاسم المستعار الخاصة بك.

> **نصيحة:** يمكنك أيضًا أن تطلب من مساعدك الذكاء الاصطناعي: "أنشئ كلمة مرور للمستخدم المستعار user@example.com على النطاق example.com" - سيستدعي أداة `generateAliasPassword` ويعيد بيانات الاعتماد.

يلخص الجدول أدناه طريقة المصادقة التي تتطلبها كل مجموعة أدوات:

| مجموعة الأدوات | طريقة المصادقة | بيانات الاعتماد |
|-----------|-------------|-------------|
| الحساب | مفتاح API **أو** مصادقة الاسم المستعار | أي منهما |
| النطاقات، الأسماء المستعارة، أعضاء النطاق، الدعوات، كلمات المرور الشاملة | مفتاح API | `FORWARD_EMAIL_API_KEY` |
| رسائل البريد الإلكتروني الصادرة (قائمة، الحصول، حذف، حد) | مفتاح API | `FORWARD_EMAIL_API_KEY` |
| إرسال بريد إلكتروني | مفتاح API **أو** مصادقة الاسم المستعار | أي منهما |
| الرسائل (IMAP) | مصادقة الاسم المستعار | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| المجلدات (IMAP) | مصادقة الاسم المستعار | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| جهات الاتصال (CardDAV) | مصادقة الاسم المستعار | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| التقويمات (CalDAV) | مصادقة الاسم المستعار | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| أحداث التقويم (CalDAV) | مصادقة الاسم المستعار | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| نصوص Sieve (نطاق النطاق) | مفتاح API | `FORWARD_EMAIL_API_KEY` |
| نصوص Sieve (نطاق الاسم المستعار) | مصادقة الاسم المستعار | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| السجلات | مفتاح API | `FORWARD_EMAIL_API_KEY` |
| التشفير | لا شيء | لا توجد بيانات اعتماد مطلوبة |


## جميع الأدوات الـ 68 {#all-68-tools}

كل أداة تتوافق مباشرة مع نقطة نهاية [Forward Email API](/email-api). تستخدم المعلمات نفس الأسماء الموجودة في وثائق API. يتم الإشارة إلى طريقة المصادقة في عنوان كل قسم.

### الحساب (مفتاح API أو مصادقة الاسم المستعار) {#account-api-key-or-alias-auth}

مع مصادقة مفتاح API، تعيد هذه معلومات حساب المستخدم الخاص بك. مع مصادقة الاسم المستعار، تعيد معلومات الاسم المستعار/صندوق البريد بما في ذلك حصة التخزين والإعدادات.

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | الحصول على معلومات حسابك |
| `updateAccount` | `PUT /v1/account` | تحديث إعدادات حسابك |

### النطاقات (مفتاح API) {#domains-api-key}

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | سرد جميع نطاقاتك |
| `createDomain` | `POST /v1/domains` | إضافة نطاق جديد |
| `getDomain` | `GET /v1/domains/:domain_id` | الحصول على تفاصيل النطاق |
| `updateDomain` | `PUT /v1/domains/:domain_id` | تحديث إعدادات النطاق |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | إزالة نطاق |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | التحقق من سجلات DNS |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | التحقق من تكوين SMTP |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | اختبار اتصال S3 مخصص |

### الأسماء المستعارة (مفتاح API) {#aliases-api-key}

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | سرد الأسماء المستعارة لنطاق |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | إنشاء اسم مستعار جديد |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | الحصول على تفاصيل الاسم المستعار |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | تحديث اسم مستعار |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | حذف اسم مستعار |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | إنشاء كلمة مرور IMAP/SMTP لمصادقة الاسم المستعار |

### رسائل البريد الإلكتروني - SMTP الصادر (مفتاح API؛ الإرسال يدعم كلاهما) {#emails--outbound-smtp-api-key-send-supports-both}

| الأداة | نقطة نهاية API | المصادقة | الوصف |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | مفتاح API أو مصادقة الاسم المستعار | إرسال بريد إلكتروني عبر SMTP |
| `listEmails` | `GET /v1/emails` | مفتاح API | سرد رسائل البريد الإلكتروني الصادرة |
| `getEmail` | `GET /v1/emails/:id` | مفتاح API | الحصول على تفاصيل وحالة البريد الإلكتروني |
| `deleteEmail` | `DELETE /v1/emails/:id` | مفتاح API | حذف بريد إلكتروني في قائمة الانتظار |
| `getEmailLimit` | `GET /v1/emails/limit` | مفتاح API | التحقق من حد الإرسال الخاص بك |

تقبل أداة `sendEmail` المعلمات `from` و`to` و`cc` و`bcc` و`subject` و`text` و`html` و`attachments`. هذا هو نفسه نقطة النهاية `POST /v1/emails`.

### الرسائل - IMAP (مصادقة الاسم المستعار) {#messages--imap-alias-auth}

> **يتطلب بيانات اعتماد الاسم المستعار.** قم بتمرير `alias_username` و`alias_password` أو قم بتعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و`FORWARD_EMAIL_ALIAS_PASSWORD`.

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | سرد والبحث عن الرسائل في صندوق البريد |
| `createMessage` | `POST /v1/messages` | إنشاء مسودة أو تحميل رسالة |
| `getMessage` | `GET /v1/messages/:id` | الحصول على رسالة بواسطة المعرف |
| `updateMessage` | `PUT /v1/messages/:id` | تحديث العلامات (مقروء، مميز بنجمة، إلخ) |
| `deleteMessage` | `DELETE /v1/messages/:id` | حذف رسالة |

تدعم أداة `listMessages` أكثر من 15 معلمة بحث بما في ذلك `subject` و`from` و`to` و`text` و`since` و`before` و`is_unread` و`has_attachment`. راجع [وثائق API](/email-api) للحصول على القائمة الكاملة.

### المجلدات - IMAP (مصادقة الاسم المستعار) {#folders--imap-alias-auth}

> **يتطلب بيانات اعتماد الاسم المستعار.** قم بتمرير `alias_username` و`alias_password` أو قم بتعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و`FORWARD_EMAIL_ALIAS_PASSWORD`.

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | سرد جميع مجلدات صندوق البريد |
| `createFolder` | `POST /v1/folders` | إنشاء مجلد جديد |
| `getFolder` | `GET /v1/folders/:id` | الحصول على تفاصيل المجلد |
| `updateFolder` | `PUT /v1/folders/:id` | إعادة تسمية مجلد |
| `deleteFolder` | `DELETE /v1/folders/:id` | حذف مجلد |

### جهات الاتصال - CardDAV (مصادقة الاسم المستعار) {#contacts--carddav-alias-auth}

> **يتطلب بيانات اعتماد الاسم المستعار.** قم بتمرير `alias_username` و`alias_password` أو قم بتعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و`FORWARD_EMAIL_ALIAS_PASSWORD`.

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | سرد جميع جهات الاتصال |
| `createContact` | `POST /v1/contacts` | إنشاء جهة اتصال جديدة |
| `getContact` | `GET /v1/contacts/:id` | الحصول على تفاصيل جهة الاتصال |
| `updateContact` | `PUT /v1/contacts/:id` | تحديث جهة اتصال |
| `deleteContact` | `DELETE /v1/contacts/:id` | حذف جهة اتصال |

### التقويمات - CalDAV (مصادقة الاسم المستعار) {#calendars--caldav-alias-auth}

> **يتطلب بيانات اعتماد الاسم المستعار.** قم بتمرير `alias_username` و`alias_password` أو قم بتعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و`FORWARD_EMAIL_ALIAS_PASSWORD`.

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | سرد جميع التقويمات |
| `createCalendar` | `POST /v1/calendars` | إنشاء تقويم جديد |
| `getCalendar` | `GET /v1/calendars/:id` | الحصول على تفاصيل التقويم |
| `updateCalendar` | `PUT /v1/calendars/:id` | تحديث تقويم |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | حذف تقويم |

### أحداث التقويم - CalDAV (مصادقة الاسم المستعار) {#calendar-events--caldav-alias-auth}

> **يتطلب بيانات اعتماد الاسم المستعار.** قم بتمرير `alias_username` و`alias_password` أو قم بتعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و`FORWARD_EMAIL_ALIAS_PASSWORD`.

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | سرد جميع الأحداث |
| `createCalendarEvent` | `POST /v1/calendar-events` | إنشاء حدث جديد |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | الحصول على تفاصيل الحدث |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | تحديث حدث |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | حذف حدث |

### نصوص Sieve (مفتاح API) {#sieve-scripts-api-key}

تستخدم هذه المسارات ذات النطاق النطاق وتصادق باستخدام مفتاح API الخاص بك.

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | سرد النصوص لاسم مستعار |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | إنشاء نص جديد |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | الحصول على تفاصيل النص |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | تحديث نص |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | حذف نص |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | تنشيط نص |

### نصوص Sieve (مصادقة الاسم المستعار) {#sieve-scripts-alias-auth}

تستخدم هذه المصادقة على مستوى الاسم المستعار. مفيدة للأتمتة لكل اسم مستعار دون الحاجة إلى مفتاح API.

> **يتطلب بيانات اعتماد الاسم المستعار.** قم بتمرير `alias_username` و`alias_password` أو قم بتعيين متغيرات البيئة `FORWARD_EMAIL_ALIAS_USER` و`FORWARD_EMAIL_ALIAS_PASSWORD`.

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | سرد النصوص |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | إنشاء نص |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | الحصول على تفاصيل النص |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | تحديث نص |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | حذف نص |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | تنشيط نص |

### أعضاء النطاق والدعوات (مفتاح API) {#domain-members-and-invites-api-key}

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | تغيير دور العضو |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | إزالة عضو |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | قبول دعوة معلقة |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | دعوة شخص ما إلى نطاق |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | إلغاء دعوة |

### كلمات المرور الشاملة (مفتاح API) {#catch-all-passwords-api-key}

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | سرد كلمات المرور الشاملة |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | إنشاء كلمة مرور شاملة |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | حذف كلمة مرور شاملة |

### السجلات (مفتاح API) {#logs-api-key}

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | تنزيل سجلات تسليم البريد الإلكتروني |

### التشفير (بدون مصادقة) {#encrypt-no-auth}

| الأداة | نقطة نهاية API | الوصف |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | تشفير سجل DNS TXT |

لا تتطلب هذه الأداة المصادقة. تقوم بتشفير سجلات إعادة التوجيه مثل `forward-email=user@example.com` لاستخدامها في سجلات DNS TXT.


## 20 حالة استخدام واقعية {#20-real-world-use-cases}

فيما يلي طرق عملية لاستخدام خادم MCP مع مساعدك الذكاء الاصطناعي:

### 1. فرز البريد الإلكتروني

اطلب من الذكاء الاصطناعي الخاص بك مسح صندوق الوارد الخاص بك وتلخيص الرسائل غير المقروءة. يمكنه وضع علامة على رسائل البريد الإلكتروني العاجلة، وتصنيفها حسب المرسل، وصياغة الردود - كل ذلك من خلال اللغة الطبيعية. *(يتطلب بيانات اعتماد الاسم المستعار للوصول إلى صندوق الوارد.)*

### 2. أتمتة إعداد النطاق

هل تقوم بإعداد نطاق جديد؟ اطلب من الذكاء الاصطناعي إنشاء النطاق، وإضافة أسماءك المستعارة، والتحقق من سجلات DNS، واختبار تكوين SMTP. ما يستغرق عادة 10 دقائق من النقر عبر لوحات المعلومات يصبح محادثة واحدة.

### 3. إدارة الأسماء المستعارة بالجملة

هل تحتاج إلى إنشاء 20 اسمًا مستعارًا لمشروع جديد؟ صف ما تحتاجه ودع الذكاء الاصطناعي يتعامل مع العمل المتكرر. يمكنه إنشاء أسماء مستعارة، وتعيين قواعد إعادة التوجيه، وإنشاء كلمات مرور دفعة واحدة.

### 4. مراقبة حملات البريد الإلكتروني

اطلب من الذكاء الاصطناعي الخاص بك التحقق من حدود الإرسال، وسرد رسائل البريد الإلكتروني الصادرة الأخيرة، والإبلاغ عن حالة التسليم. مفيد لمراقبة صحة البريد الإلكتروني للمعاملات.

### 5. مزامنة جهات الاتصال وتنظيفها

استخدم أدوات CardDAV لسرد جميع جهات الاتصال، والعثور على التكرارات، وتحديث المعلومات القديمة، أو إنشاء جهات اتصال بالجملة من جدول بيانات تقوم بلصقه في الدردشة. *(يتطلب بيانات اعتماد الاسم المستعار.)*

### 6. إدارة التقويم

إنشاء تقويمات، وإضافة أحداث، وتحديث أوقات الاجتماعات، وحذف الأحداث الملغاة - كل ذلك من خلال المحادثة. تدعم أدوات CalDAV عمليات CRUD الكاملة على كل من التقويمات والأحداث. *(يتطلب بيانات اعتماد الاسم المستعار.)*

### 7. أتمتة نصوص Sieve

نصوص Sieve قوية ولكن بناء الجملة غامض. اطلب من الذكاء الاصطناعي الخاص بك كتابة نصوص Sieve لك: "تصفية جميع رسائل البريد الإلكتروني من billing@example.com إلى مجلد الفواتير" يصبح نصًا عاملاً دون لمس مواصفات RFC 5228.

### 8. تأهيل الفريق

عندما ينضم عضو فريق جديد، اطلب من الذكاء الاصطناعي إنشاء اسمه المستعار، وإنشاء كلمة مرور، وإرسال بريد إلكتروني ترحيبي إليهم ببيانات اعتمادهم، وإضافتهم كعضو في النطاق. مطالبة واحدة، أربع استدعاءات API.

### 9. تدقيق الأمان

اطلب من الذكاء الاصطناعي الخاص بك سرد جميع النطاقات، والتحقق من حالة التحقق من DNS، ومراجعة تكوينات الاسم المستعار، وتحديد أي نطاقات بها سجلات غير محققة. مسح أمني سريع باللغة الطبيعية.

### 10. إعداد إعادة توجيه البريد الإلكتروني

هل تقوم بإعداد إعادة توجيه البريد الإلكتروني لنطاق جديد؟ اطلب من الذكاء الاصطناعي إنشاء النطاق، وإضافة أسماء مستعارة لإعادة التوجيه، وتشفير سجلات DNS، والتحقق من تكوين كل شيء بشكل صحيح.

### 11. البحث والتحليل في صندوق الوارد

استخدم أدوات البحث عن الرسائل للعثور على رسائل بريد إلكتروني محددة: "ابحث عن جميع رسائل البريد الإلكتروني من john@example.com في آخر 30 يومًا التي تحتوي على مرفقات." أكثر من 15 معلمة بحث تجعل هذا قويًا. *(يتطلب بيانات اعتماد الاسم المستعار.)*

### 12. تنظيم المجلدات

اطلب من الذكاء الاصطناعي الخاص بك إنشاء بنية مجلدات لمشروع جديد، أو نقل الرسائل بين المجلدات، أو تنظيف المجلدات القديمة التي لم تعد بحاجة إليها. *(يتطلب بيانات اعتماد الاسم المستعار.)*

### 13. تدوير كلمات المرور

إنشاء كلمات مرور جديدة للأسماء المستعارة بانتظام. اطلب من الذكاء الاصطناعي الخاص بك إنشاء كلمة مرور جديدة لكل اسم مستعار والإبلاغ عن بيانات الاعتماد الجديدة.

### 14. تشفير سجلات DNS

قم بتشفير سجلات إعادة التوجيه الخاصة بك قبل إضافتها إلى DNS. تتعامل أداة `encryptRecord` مع هذا دون مصادقة - مفيدة لعمليات التشفير السريعة لمرة واحدة.

### 15. تحليل سجل التسليم

قم بتنزيل سجلات تسليم البريد الإلكتروني الخاصة بك واطلب من الذكاء الاصطناعي تحليل معدلات الارتداد، وتحديد المستلمين الذين يواجهون مشكلات، أو تتبع أوقات التسليم.

### 16. إدارة النطاقات المتعددة

إذا كنت تدير نطاقات متعددة، اطلب من الذكاء الاصطناعي أن يقدم لك تقرير حالة: أي النطاقات تم التحقق منها، وأي منها به مشكلات، وكم عدد الأسماء المستعارة لكل منها، وكيف تبدو حدود الإرسال.

### 17. تكوين Catch-All

قم بإعداد كلمات مرور شاملة للنطاقات التي تحتاج إلى تلقي البريد الإلكتروني على أي عنوان. يمكن للذكاء الاصطناعي إنشاء هذه الكلمات المرور وسردها وإدارتها لك.

### 18. إدارة دعوات النطاق

دعوة أعضاء الفريق لإدارة النطاقات، والتحقق من الدعوات المعلقة، وتنظيف الدعوات المنتهية الصلاحية. مفيد للمؤسسات التي لديها العديد من مديري النطاقات.

### 19. اختبار تخزين S3

إذا كنت تستخدم تخزين S3 مخصصًا لنسخ البريد الإلكتروني الاحتياطية، اطلب من الذكاء الاصطناعي اختبار الاتصال والتحقق من أنه يعمل بشكل صحيح.

### 20. إنشاء مسودة بريد إلكتروني

إنشاء مسودات رسائل بريد إلكتروني في صندوق البريد الخاص بك دون إرسالها. مفيد لإعداد رسائل البريد الإلكتروني التي تحتاج إلى مراجعة قبل الإرسال، أو لإنشاء قوالب بريد إلكتروني. *(يتطلب بيانات اعتماد الاسم المستعار.)*


## أمثلة على المطالبات {#example-prompts}

فيما يلي مطالبات يمكنك استخدامها مباشرة مع مساعدك الذكاء الاصطناعي:

**إرسال بريد إلكتروني:**
> "أرسل بريدًا إلكترونيًا من hello@mydomain.com إلى john@example.com بعنوان 'اجتماع غدًا' ونص 'مرحبًا جون، هل ما زلنا على موعد الساعة 2 ظهرًا؟'"

**إدارة النطاق:**
> "اسرد جميع نطاقاتي وأخبرني أي منها لديه سجلات DNS غير محققة."

**إنشاء اسم مستعار:**
> "أنشئ اسمًا مستعارًا جديدًا support@mydomain.com يعيد التوجيه إلى بريدي الإلكتروني الشخصي."

**البحث في صندوق الوارد (يتطلب بيانات اعتماد الاسم المستعار):**
> "ابحث عن جميع رسائل البريد الإلكتروني غير المقروءة من الأسبوع الماضي التي تذكر 'فاتورة'."

**التقويم (يتطلب بيانات اعتماد الاسم المستعار):**
> "أنشئ تقويمًا باسم 'العمل' وأضف اجتماعًا لغدًا الساعة 2 ظهرًا باسم 'اجتماع الفريق'."

**نصوص Sieve:**
> "اكتب نص Sieve لـ info@mydomain.com يرد تلقائيًا على رسائل البريد الإلكتروني بـ 'شكرًا لتواصلك، سنرد عليك في غضون 24 ساعة'."

**العمليات بالجملة:**
> "أنشئ أسماء مستعارة لـ sales@ وsupport@ وbilling@ وinfo@ على mydomain.com، وكلها تعيد التوجيه إلى team@mydomain.com."

**فحص الأمان:**
> "تحقق من حالة التحقق من DNS وSMTP لجميع نطاقاتي وأخبرني إذا كان هناك أي شيء يحتاج إلى اهتمام."

**إنشاء كلمة مرور للاسم المستعار:**
> "أنشئ كلمة مرور للاسم المستعار user@example.com حتى أتمكن من الوصول إلى صندوق الوارد الخاص بي."


## متغيرات البيئة {#environment-variables}

| المتغير | مطلوب | الافتراضي | الوصف |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | نعم | — | مفتاح API الخاص بك لـ Forward Email (يستخدم كاسم مستخدم لمصادقة Basic لنقاط نهاية مفتاح API) |
| `FORWARD_EMAIL_ALIAS_USER` | لا | — | عنوان البريد الإلكتروني للاسم المستعار لنقاط نهاية صندوق البريد (على سبيل المثال `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | لا | — | كلمة مرور الاسم المستعار التي تم إنشاؤها لنقاط نهاية صندوق البريد |
| `FORWARD_EMAIL_API_URL` | لا | `https://api.forwardemail.net` | عنوان URL الأساسي لـ API (للاستضافة الذاتية أو الاختبار) |


## الأمان {#security}

يعمل خادم MCP محليًا على جهازك. إليك كيفية عمل الأمان:

*   **تبقى بيانات اعتمادك محلية.** يتم قراءة كل من مفتاح API الخاص بك وبيانات اعتماد الاسم المستعار من متغيرات البيئة وتستخدم لمصادقة طلبات API عبر مصادقة HTTP Basic. لا يتم إرسالها أبدًا إلى نموذج الذكاء الاصطناعي.
*   **نقل stdio.** يتواصل الخادم مع عميل الذكاء الاصطناعي عبر stdin/stdout. لا يتم فتح أي منافذ شبكة.
*   **لا يوجد تخزين للبيانات.** الخادم عديم الحالة. لا يقوم بتخزين مؤقت أو تسجيل أو تخزين أي من بيانات بريدك الإلكتروني.
*   **مفتوح المصدر.** الكود المصدري بالكامل موجود على [GitHub](https://github.com/forwardemail/mcp-server). يمكنك تدقيق كل سطر.


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

خادم Forward Email MCP [مفتوح المصدر على GitHub](https://github.com/forwardemail/mcp-server) بموجب ترخيص BUSL-1.1. نحن نؤمن بالشفافية. إذا وجدت خطأً أو أردت ميزة، [افتح مشكلة](https://github.com/forwardemail/mcp-server/issues).
