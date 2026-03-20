# واجهة برمجة تطبيقات البريد الإلكتروني {#email-api}


## جدول المحتويات {#table-of-contents}

* [المكتبات](#libraries)
* [عنوان الأساس](#base-uri)
* [المصادقة](#authentication)
  * [مصادقة رمز API (موصى بها لمعظم النقاط النهائية)](#api-token-authentication-recommended-for-most-endpoints)
  * [مصادقة بيانات اعتماد الاسم المستعار (للبريد الصادر)](#alias-credentials-authentication-for-outbound-email)
  * [نقاط نهاية الاسم المستعار فقط](#alias-only-endpoints)
* [الأخطاء](#errors)
* [التعريب](#localization)
* [التقسيم إلى صفحات](#pagination)
* [السجلات](#logs)
  * [استرجاع السجلات](#retrieve-logs)
* [الحساب](#account)
  * [إنشاء حساب](#create-account)
  * [استرجاع الحساب](#retrieve-account)
  * [تحديث الحساب](#update-account)
* [جهات اتصال الاسم المستعار (CardDAV)](#alias-contacts-carddav)
  * [قائمة جهات الاتصال](#list-contacts)
  * [إنشاء جهة اتصال](#create-contact)
  * [استرجاع جهة اتصال](#retrieve-contact)
  * [تحديث جهة اتصال](#update-contact)
  * [حذف جهة اتصال](#delete-contact)
* [تقويمات الاسم المستعار (CalDAV)](#alias-calendars-caldav)
  * [قائمة التقويمات](#list-calendars)
  * [إنشاء تقويم](#create-calendar)
  * [استرجاع تقويم](#retrieve-calendar)
  * [تحديث تقويم](#update-calendar)
  * [حذف تقويم](#delete-calendar)
* [رسائل الاسم المستعار (IMAP/POP3)](#alias-messages-imappop3)
  * [قائمة والبحث عن الرسائل](#list-and-search-for-messages)
  * [إنشاء رسالة](#create-message)
  * [استرجاع رسالة](#retrieve-message)
  * [تحديث رسالة](#update-message)
  * [حذف رسالة](#delete-message)
* [مجلدات الاسم المستعار (IMAP/POP3)](#alias-folders-imappop3)
  * [قائمة المجلدات](#list-folders)
  * [إنشاء مجلد](#create-folder)
  * [استرجاع مجلد](#retrieve-folder)
  * [تحديث مجلد](#update-folder)
  * [حذف مجلد](#delete-folder)
  * [نسخ مجلد](#copy-folder)
* [رسائل البريد الصادرة](#outbound-emails)
  * [الحصول على حد البريد الصادر SMTP](#get-outbound-smtp-email-limit)
  * [قائمة رسائل البريد الصادرة SMTP](#list-outbound-smtp-emails)
  * [إنشاء رسالة بريد صادرة SMTP](#create-outbound-smtp-email)
  * [استرجاع رسالة بريد صادرة SMTP](#retrieve-outbound-smtp-email)
  * [حذف رسالة بريد صادرة SMTP](#delete-outbound-smtp-email)
* [النطاقات](#domains)
  * [قائمة النطاقات](#list-domains)
  * [إنشاء نطاق](#create-domain)
  * [استرجاع نطاق](#retrieve-domain)
  * [التحقق من سجلات النطاق](#verify-domain-records)
  * [التحقق من سجلات SMTP للنطاق](#verify-domain-smtp-records)
  * [قائمة كلمات مرور التقاط الكل على مستوى النطاق](#list-domain-wide-catch-all-passwords)
  * [إنشاء كلمة مرور التقاط الكل على مستوى النطاق](#create-domain-wide-catch-all-password)
  * [إزالة كلمة مرور التقاط الكل على مستوى النطاق](#remove-domain-wide-catch-all-password)
  * [تحديث النطاق](#update-domain)
  * [حذف النطاق](#delete-domain)
* [الدعوات](#invites)
  * [قبول دعوة النطاق](#accept-domain-invite)
  * [إنشاء دعوة نطاق](#create-domain-invite)
  * [إزالة دعوة نطاق](#remove-domain-invite)
* [الأعضاء](#members)
  * [تحديث عضو النطاق](#update-domain-member)
  * [إزالة عضو النطاق](#remove-domain-member)
* [الأسماء المستعارة](#aliases)
  * [توليد كلمة مرور لاسم مستعار](#generate-an-alias-password)
  * [قائمة أسماء النطاق المستعارة](#list-domain-aliases)
  * [إنشاء اسم مستعار جديد للنطاق](#create-new-domain-alias)
  * [استرجاع اسم مستعار للنطاق](#retrieve-domain-alias)
  * [تحديث اسم مستعار للنطاق](#update-domain-alias)
  * [حذف اسم مستعار للنطاق](#delete-domain-alias)
* [التشفير](#encrypt)
  * [تشفير سجل TXT](#encrypt-txt-record)


## المكتبات {#libraries}

حتى الآن لم نطلق أي أغلفة API، لكننا نخطط للقيام بذلك في المستقبل القريب. أرسل بريدًا إلكترونيًا إلى <api@forwardemail.net> إذا كنت ترغب في أن يتم إعلامك عند إصدار غلاف API للغة برمجة معينة. في هذه الأثناء، يمكنك استخدام مكتبات طلب HTTP الموصى بها هذه في تطبيقك، أو ببساطة استخدام [curl](https://stackoverflow.com/a/27442239/3586413) كما في الأمثلة أدناه.

| اللغة      | المكتبة                                                                |
| ---------- | ---------------------------------------------------------------------- |
| روبي       | [Faraday](https://github.com/lostisland/faraday)                       |
| بايثون     | [requests](https://github.com/psf/requests)                            |
| جافا       | [OkHttp](https://github.com/square/okhttp/)                            |
| بي إتش بي   | [guzzle](https://github.com/guzzle/guzzle)                             |
| جافا سكريبت| [superagent](https://github.com/ladjs/superagent) (نحن من القائمين عليها) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (نحن من القائمين عليها) |
| جو         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

مسار URI الأساسي الحالي لـ HTTP هو: `BASE_URI`.


## Authentication {#authentication}

جميع نقاط النهاية تتطلب المصادقة باستخدام [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). نحن ندعم طريقتين للمصادقة:

### API Token Authentication (موصى به لمعظم نقاط النهاية) {#api-token-authentication-recommended-for-most-endpoints}

قم بتعيين [مفتاح API الخاص بك](https://forwardemail.net/my-account/security) كقيمة "اسم المستخدم" مع كلمة مرور فارغة:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

لاحظ النقطتين (`:`) بعد رمز API – هذا يشير إلى كلمة مرور فارغة في صيغة المصادقة الأساسية.

### Alias Credentials Authentication (للبريد الصادر) {#alias-credentials-authentication-for-outbound-email}

نقطة النهاية [إنشاء بريد SMTP صادر](#create-outbound-smtp-email) تدعم أيضًا المصادقة باستخدام عنوان بريدك الإلكتروني المستعار وكلمة مرور مستعارة [مولدة](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

تُستخدم هذه الطريقة عند إرسال رسائل البريد الإلكتروني من التطبيقات التي تستخدم بالفعل بيانات اعتماد SMTP وتجعل الانتقال من SMTP إلى API الخاص بنا سلسًا.

### Alias-Only Endpoints {#alias-only-endpoints}

نقاط النهاية [جهات اتصال المستعار](#alias-contacts-carddav)، [تقويمات المستعار](#alias-calendars-caldav)، [رسائل المستعار](#alias-messages-imappop3)، و [مجلدات المستعار](#alias-folders-imappop3) تتطلب بيانات اعتماد المستعار ولا تدعم مصادقة رمز API.

لا تقلق – تم توفير أمثلة أدناه لك إذا لم تكن متأكدًا مما يعنيه هذا.


## Errors {#errors}

إذا حدثت أي أخطاء، فإن جسم الاستجابة لطلب API سيحتوي على رسالة خطأ مفصلة.

| Code | Name                  |
| ---- | --------------------- |
| 200  | تم بنجاح              |
| 400  | طلب غير صالح          |
| 401  | غير مصرح              |
| 403  | ممنوع                 |
| 404  | غير موجود             |
| 429  | عدد الطلبات كبير جدًا |
| 500  | خطأ في الخادم الداخلي |
| 501  | غير منفذ              |
| 502  | بوابة سيئة            |
| 503  | الخدمة غير متوفرة     |
| 504  | انتهاء مهلة البوابة   |

> \[!TIP]
> إذا تلقيت رمز حالة 5xx (والذي لا ينبغي أن يحدث)، يرجى الاتصال بنا على <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> وسنساعدك في حل مشكلتك فورًا.


## Localization {#localization}

تمت ترجمة خدمتنا إلى أكثر من 25 لغة مختلفة. جميع رسائل استجابة API مترجمة إلى آخر لغة تم اكتشافها للمستخدم الذي يقوم بطلب API. يمكنك تجاوز ذلك بتمرير رأس `Accept-Language` مخصص. لا تتردد في تجربته باستخدام قائمة اللغات المنسدلة في أسفل هذه الصفحة.


## Pagination {#pagination}

> \[!NOTE]
> اعتبارًا من 1 نوفمبر 2024، ستقوم نقاط نهاية API لـ [قائمة النطاقات](#list-domains) و [قائمة أسماء النطاقات المستعارة](#list-domain-aliases) بتعيين القيمة الافتراضية إلى `1000` كحد أقصى للنتائج في الصفحة. إذا كنت ترغب في الاشتراك في هذا السلوك مبكرًا، يمكنك تمرير `?paginate=true` كمعامل استعلام إضافي إلى عنوان URL الخاص باستعلام نقطة النهاية.

يتم دعم الترقيم في جميع نقاط نهاية API التي تعرض نتائج.

فقط قدم خصائص سلسلة الاستعلام `page` (وبشكل اختياري `limit`).

يجب أن تكون الخاصية `page` رقمًا أكبر من أو يساوي `1`. إذا قدمت `limit` (وهو أيضًا رقم)، فإن الحد الأدنى هو `10` والحد الأقصى هو `50` (ما لم يُذكر خلاف ذلك).

| Querystring Parameter | Required | Type   | Description                                                                                                                                               |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | لا       | رقم    | صفحة النتائج التي سيتم إرجاعها. إذا لم يتم تحديدها، ستكون قيمة `page` هي `1`. يجب أن تكون رقمًا أكبر من أو يساوي `1`.                                  |
| `limit`               | لا       | رقم    | عدد النتائج التي سيتم إرجاعها في كل صفحة. القيمة الافتراضية هي `10` إذا لم يتم تحديدها. يجب أن تكون رقمًا أكبر من أو يساوي `1`، وأقل من أو يساوي `50`. |
لتحديد ما إذا كانت هناك نتائج إضافية متاحة أم لا، نوفر رؤوس استجابة HTTP التالية (والتي يمكنك تحليلها من أجل التصفح البرمجي للصفحات):

| HTTP Response Header | Example                                                                                                                                                                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | إجمالي عدد الصفحات المتاحة.                                                                                                                                                                                                                                                                                                                                       |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | الصفحة الحالية من النتائج المعادة (مثلاً بناءً على معامل الاستعلام `page`).                                                                                                                                                                                                                                                                                        |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | إجمالي عدد النتائج في الصفحة المعادة (مثلاً بناءً على معامل الاستعلام `limit` والنتائج الفعلية المعادة).                                                                                                                                                                                                                                                           |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | إجمالي عدد العناصر المتاحة عبر جميع الصفحات.                                                                                                                                                                                                                                                                                                                     |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | نوفر رأس استجابة HTTP باسم `Link` يمكنك تحليله كما هو موضح في المثال. هذا [مماثل لـ GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (مثلاً لن يتم توفير كل القيم إذا لم تكن ذات صلة أو متاحة، مثلًا لن يتم توفير `"next"` إذا لم تكن هناك صفحة أخرى). |
> مثال طلب:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## السجلات {#logs}

### استرجاع السجلات {#retrieve-logs}

تتيح لك واجهة برمجة التطبيقات الخاصة بنا تنزيل السجلات الخاصة بحسابك برمجياً. إرسال طلب إلى هذه النقطة النهائية سيعالج جميع السجلات الخاصة بحسابك ويرسلها إليك عبر البريد الإلكتروني كمرفق (ملف جدول بيانات [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) مضغوط باستخدام [Gzip](https://en.wikipedia.org/wiki/Gzip)) بمجرد الانتهاء.

هذا يسمح لك بإنشاء مهام خلفية باستخدام [وظيفة Cron](https://en.wikipedia.org/wiki/Cron) أو باستخدام برنامج جدولة المهام الخاص بنا [Bree لـ Node.js](https://github.com/breejs/bree) لتلقي السجلات متى شئت. لاحظ أن هذه النقطة النهائية محدودة بـ `10` طلبات يومياً.

المرفق هو النسخة بالحروف الصغيرة من `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` والبريد الإلكتروني نفسه يحتوي على ملخص موجز للسجلات المسترجعة. يمكنك أيضاً تنزيل السجلات في أي وقت من [حسابي → السجلات](/my-account/logs)

> `GET /v1/logs/download`

| معامل سلسلة الاستعلام | مطلوب | النوع          | الوصف                                                                                                                         |
| --------------------- | ------ | -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | لا     | نص (FQDN)      | تصفية السجلات حسب النطاق المؤهل بالكامل ("FQDN"). إذا لم تقدم هذا، فسيتم استرجاع جميع السجلات عبر جميع النطاقات.              |
| `q`                   | لا     | نص            | البحث في السجلات حسب البريد الإلكتروني، النطاق، اسم الاسم المستعار، عنوان IP، أو التاريخ (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY`, أو `M.D.YY`). |
| `bounce_category`     | لا     | نص            | البحث في السجلات حسب فئة الارتداد المحددة (مثلاً `blocklist`).                                                                |
| `response_code`       | لا     | رقم            | البحث في السجلات حسب رمز استجابة الخطأ المحدد (مثلاً `421` أو `550`).                                                        |

> مثال طلب:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> مثال وظيفة Cron (في منتصف الليل كل يوم):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

لاحظ أنه يمكنك استخدام خدمات مثل [Crontab.guru](https://crontab.guru/) للتحقق من صحة صيغة تعبير وظيفة الكرون الخاصة بك.

> مثال وظيفة Cron (في منتصف الليل كل يوم **ومع سجلات لليوم السابق**):

لنظام MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

لنظام Linux و Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## الحساب {#account}

### إنشاء حساب {#create-account}

> `POST /v1/account`

| معامل الجسم | مطلوب | النوع           | الوصف          |
| ------------ | ------ | -------------- | -------------- |
| `email`      | نعم    | نص (بريد إلكتروني) | عنوان البريد الإلكتروني |
| `password`   | نعم    | نص             | كلمة المرور    |

> مثال طلب:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### استرجاع الحساب {#retrieve-account}

> `GET /v1/account`

> مثال طلب:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### تحديث الحساب {#update-account}

> `PUT /v1/account`

| معامل الجسم   | مطلوب | النوع           | الوصف               |
| -------------- | ------ | -------------- | ------------------- |
| `email`        | لا     | نص (بريد إلكتروني) | عنوان البريد الإلكتروني |
| `given_name`   | لا     | نص             | الاسم الأول         |
| `family_name`  | لا     | نص             | اسم العائلة         |
| `avatar_url`   | لا     | نص (رابط URL)  | رابط صورة الأفاتار  |

> مثال طلب:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## جهات اتصال الأسماء المستعارة (CardDAV) {#alias-contacts-carddav}

> \[!ملاحظة]
> على عكس نقاط نهاية API الأخرى، تتطلب هذه [المصادقة](#authentication) بأن يكون "اسم المستخدم" مساويًا لاسم المستخدم المستعار و"كلمة المرور" مساوية لكلمة المرور التي تم إنشاؤها للاسم المستعار كعناوين تفويض أساسية (Basic Authorization headers).
> \[!WARNING]
> هذا القسم الخاص بنقاط النهاية قيد التطوير وسيتم إصداره (نأمل) في عام 2024. في هذه الأثناء يرجى استخدام عميل IMAP من قائمة "التطبيقات" المنسدلة في تنقل موقعنا الإلكتروني.

### قائمة جهات الاتصال {#list-contacts}

> `GET /v1/contacts`

**قريباً**

### إنشاء جهة اتصال {#create-contact}

> `POST /v1/contacts`

**قريباً**

### استرجاع جهة اتصال {#retrieve-contact}

> `GET /v1/contacts/:id`

**قريباً**

### تحديث جهة اتصال {#update-contact}

> `PUT /v1/contacts/:id`

**قريباً**

### حذف جهة اتصال {#delete-contact}

> `DELETE /v1/contacts/:id`

**قريباً**


## تقاويم الأسماء المستعارة (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> على عكس نقاط نهاية API الأخرى، تتطلب هذه [المصادقة](#authentication) بأن يكون "اسم المستخدم" مساويًا لاسم مستخدم الاسم المستعار و"كلمة المرور" مساوية لكلمة المرور التي تم إنشاؤها للاسم المستعار كعناوين تفويض أساسية.

> \[!WARNING]
> هذا القسم الخاص بنقاط النهاية قيد التطوير وسيتم إصداره (نأمل) في عام 2024. في هذه الأثناء يرجى استخدام عميل IMAP من قائمة "التطبيقات" المنسدلة في تنقل موقعنا الإلكتروني.

### قائمة التقاويم {#list-calendars}

> `GET /v1/calendars`

**قريباً**

### إنشاء تقويم {#create-calendar}

> `POST /v1/calendars`

**قريباً**

### استرجاع تقويم {#retrieve-calendar}

> `GET /v1/calendars/:id`

**قريباً**

### تحديث تقويم {#update-calendar}

> `PUT /v1/calendars/:id`

**قريباً**

### حذف تقويم {#delete-calendar}

> `DELETE /v1/calendars/:id`

**قريباً**


## رسائل الأسماء المستعارة (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> على عكس نقاط نهاية API الأخرى، تتطلب هذه [المصادقة](#authentication) بأن يكون "اسم المستخدم" مساويًا لاسم مستخدم الاسم المستعار و"كلمة المرور" مساوية لكلمة المرور التي تم إنشاؤها للاسم المستعار كعناوين تفويض أساسية.

> \[!WARNING]
> هذا القسم الخاص بنقاط النهاية قيد التطوير وسيتم إصداره (نأمل) في عام 2024. في هذه الأثناء يرجى استخدام عميل IMAP من قائمة "التطبيقات" المنسدلة في تنقل موقعنا الإلكتروني.

يرجى التأكد من اتباع تعليمات الإعداد لنطاقك.

يمكن العثور على هذه التعليمات في قسم الأسئلة الشائعة لدينا [هل تدعم استقبال البريد الإلكتروني باستخدام IMAP؟](/faq#do-you-support-receiving-email-with-imap).

### قائمة والبحث عن الرسائل {#list-and-search-for-messages}

> `GET /v1/messages`

**قريباً**

### إنشاء رسالة {#create-message}

> \[!NOTE]
> هذا **لن** يرسل بريدًا إلكترونيًا – بل سيضيف الرسالة فقط إلى مجلد صندوق بريدك (على سبيل المثال، هذا مشابه لأمر IMAP `APPEND`). إذا كنت ترغب في إرسال بريد إلكتروني، فراجع [إنشاء بريد SMTP صادر](#create-outbound-smtp-email) أدناه. بعد إنشاء بريد SMTP الصادر، يمكنك بعد ذلك إلحاق نسخة منه باستخدام هذه النقطة النهاية إلى صندوق بريد الاسم المستعار لأغراض التخزين.

> `POST /v1/messages`

**قريباً**

### استرجاع رسالة {#retrieve-message}

> `GET /v1/messages/:id`

**قريباً**

### تحديث رسالة {#update-message}

> `PUT /v1/messages/:id`

**قريباً**

### حذف رسالة {#delete-message}

> `DELETE /v1/messages:id`

**قريباً**


## مجلدات الأسماء المستعارة (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> نقاط نهاية المجلدات التي تستخدم مسار المجلد <code>/v1/folders/:path</code> كنقطة نهاية قابلة للتبادل مع معرف المجلد <code>:id</code>. هذا يعني أنه يمكنك الإشارة إلى المجلد إما بواسطة <code>path</code> أو <code>id</code> الخاص به.

> \[!WARNING]
> هذا القسم الخاص بنقاط النهاية قيد التطوير وسيتم إصداره (نأمل) في عام 2024. في هذه الأثناء يرجى استخدام عميل IMAP من قائمة "التطبيقات" المنسدلة في تنقل موقعنا الإلكتروني.

### قائمة المجلدات {#list-folders}

> `GET /v1/folders`

**قريباً**

### إنشاء مجلد {#create-folder}

> `POST /v1/folders`

**قريباً**

### استرجاع مجلد {#retrieve-folder}

> `GET /v1/folders/:id`

**قريباً**

### تحديث مجلد {#update-folder}

> `PUT /v1/folders/:id`

**قريباً**

### حذف مجلد {#delete-folder}

> `DELETE /v1/folders/:id`

**قريباً**

### نسخ مجلد {#copy-folder}

> `POST /v1/folders/:id/copy`

**قريباً**


## رسائل البريد الصادرة {#outbound-emails}

يرجى التأكد من اتباع تعليمات الإعداد لنطاقك.

يمكن العثور على هذه التعليمات في [حسابي → النطاقات → الإعدادات → تكوين SMTP الصادر](/my-account/domains). تحتاج إلى التأكد من إعداد DKIM، ومسار الإرجاع، وDMARC لإرسال SMTP الصادر باستخدام نطاقك.
### الحصول على حد رسائل SMTP الصادرة {#get-outbound-smtp-email-limit}

هذه نقطة نهاية بسيطة تُرجع كائن JSON يحتوي على `count` و `limit` لعدد رسائل SMTP الصادرة اليومية على أساس كل حساب.

> `GET /v1/emails/limit`

> مثال على الطلب:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### قائمة رسائل SMTP الصادرة {#list-outbound-smtp-emails}

لاحظ أن هذه النقطة النهاية لا تُرجع قيم خصائص `message` أو `headers` أو `rejectedErrors` للبريد الإلكتروني.

لإرجاع تلك الخصائص وقيمها، يرجى استخدام نقطة النهاية [استرجاع البريد الإلكتروني](#retrieve-email) مع معرف البريد الإلكتروني.

> `GET /v1/emails`

| معامل سلسلة الاستعلام | مطلوب | النوع                      | الوصف                                                                                                                                               |
| --------------------- | ------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | لا     | نص (يدعم التعبيرات النمطية) | البحث عن رسائل البريد الإلكتروني بواسطة البيانات الوصفية                                                                                           |
| `domain`              | لا     | نص (يدعم التعبيرات النمطية) | البحث عن رسائل البريد الإلكتروني بواسطة اسم النطاق                                                                                                |
| `sort`                | لا     | نص                       | الترتيب حسب حقل معين (ضع بادئة شرطة واحدة `-` للترتيب بالعكس). الافتراضي هو `created_at` إذا لم يتم التعيين.                                      |
| `page`                | لا     | رقم                       | راجع [الترقيم الصفحي](#pagination) لمزيد من التفاصيل                                                                                              |
| `limit`               | لا     | رقم                       | راجع [الترقيم الصفحي](#pagination) لمزيد من التفاصيل                                                                                              |

> مثال على الطلب:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### إنشاء رسالة SMTP صادرة {#create-outbound-smtp-email}

واجهة برمجة التطبيقات الخاصة بنا لإنشاء بريد إلكتروني مستوحاة من وتستخدم تكوين خيارات رسالة Nodemailer. يرجى الرجوع إلى [تكوين رسالة Nodemailer](https://nodemailer.com/message/) لجميع معلمات الجسم أدناه.

لاحظ أنه باستثناء `envelope` و `dkim` (لأننا نضبطهما تلقائيًا لك)، ندعم جميع خيارات Nodemailer. نقوم تلقائيًا بتعيين خيارات `disableFileAccess` و `disableUrlAccess` إلى `true` لأغراض الأمان.

يجب عليك إما تمرير الخيار الوحيد `raw` مع البريد الإلكتروني الكامل الخام الخاص بك بما في ذلك الرؤوس **أو** تمرير خيارات معلمات الجسم الفردية أدناه.

ستقوم نقطة النهاية هذه تلقائيًا بترميز الرموز التعبيرية إذا وُجدت في الرؤوس (مثل سطر الموضوع `Subject: 🤓 Hello` يتحول تلقائيًا إلى `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). هدفنا هو إنشاء واجهة برمجة تطبيقات بريد إلكتروني سهلة الاستخدام للغاية ومحمية ضد الأخطاء.

**المصادقة:** تدعم هذه النقطة النهاية كل من [مصادقة رمز API](#api-token-authentication-recommended-for-most-endpoints) و [مصادقة بيانات اعتماد الاسم المستعار](#alias-credentials-authentication-for-outbound-email). راجع قسم [المصادقة](#authentication) أعلاه للتفاصيل.

> `POST /v1/emails`

| معلمة الجسم     | مطلوب | النوع             | الوصف                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------- | ------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | لا     | نص (بريد إلكتروني) | عنوان البريد الإلكتروني للمرسل (يجب أن يكون موجودًا كاسم مستعار للنطاق).                                                                                                                                                                                                                                                                                                                                                                                    |
| `to`             | لا     | نص أو مصفوفة      | قائمة مفصولة بفواصل أو مصفوفة من المستلمين لرأس "إلى".                                                                                                                                                                                                                                                                                                                                                                                                       |
| `cc`             | لا     | نص أو مصفوفة      | قائمة مفصولة بفواصل أو مصفوفة من المستلمين لرأس "نسخة إلى".                                                                                                                                                                                                                                                                                                                                                                                                  |
| `bcc`            | لا     | نص أو مصفوفة      | قائمة مفصولة بفواصل أو مصفوفة من المستلمين لرأس "نسخة مخفية الوجهة".                                                                                                                                                                                                                                                                                                                                                                                         |
| `subject`        | لا     | نص                | موضوع البريد الإلكتروني.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `text`           | لا     | نص أو مخزن بيانات | النسخة النصية العادية من الرسالة.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `html`           | لا     | نص أو مخزن بيانات | النسخة بصيغة HTML من الرسالة.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `attachments`    | لا     | مصفوفة            | مصفوفة من كائنات المرفقات (انظر [الحقول الشائعة في Nodemailer](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                              |
| `sender`         | لا     | نص                | عنوان البريد الإلكتروني لرأس "المرسل" (انظر [الحقول المتقدمة في Nodemailer](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                         |
| `replyTo`        | لا     | نص                | عنوان البريد الإلكتروني لرأس "الرد إلى".                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `inReplyTo`      | لا     | نص                | معرف الرسالة التي يتم الرد عليها.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `references`     | لا     | نص أو مصفوفة      | قائمة مفصولة بمسافات أو مصفوفة من معرفات الرسائل.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `attachDataUrls` | لا     | منطقي             | إذا كانت القيمة `true`، يتم تحويل صور `data:` في محتوى HTML للرسالة إلى مرفقات مدمجة.                                                                                                                                                                                                                                                                                                                                                                         |
| `watchHtml`      | لا     | نص                | نسخة HTML خاصة بساعات Apple Watch ([وفقًا لوثائق Nodemailer](https://nodemailer.com/message/#content-options))، الساعات الحديثة لا تتطلب تعيين هذا الخيار.                                                                                                                                                                                                                                                                                                |
| `amp`            | لا     | نص                | نسخة HTML خاصة بـ AMP4EMAIL (انظر [مثال Nodemailer](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                                            |
| `icalEvent`      | لا     | كائن               | حدث iCalendar لاستخدامه كمحتوى بديل للرسالة (انظر [أحداث التقويم في Nodemailer](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                                         |
| `alternatives`   | لا     | مصفوفة            | مصفوفة من محتويات الرسالة البديلة (انظر [المحتوى البديل في Nodemailer](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                        |
| `encoding`       | لا     | نص                | الترميز للنصوص و HTML (الافتراضي `"utf-8"`، ويدعم أيضًا قيم الترميز `"hex"` و `"base64"`).                                                                                                                                                                                                                                                                                                                                                                   |
| `raw`            | لا     | نص أو مخزن بيانات | رسالة مخصصة بتنسيق RFC822 لاستخدامها (بدلاً من التي يتم إنشاؤها بواسطة Nodemailer – انظر [المصدر المخصص في Nodemailer](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                                     |
| `textEncoding`   | لا     | نص                | الترميز الذي يُجبر على استخدامه لقيم النص (إما `"quoted-printable"` أو `"base64"`). القيمة الافتراضية هي الأقرب للكشف (لـ ASCII استخدم `"quoted-printable"`).                                                                                                                                                                                                                                                                                             |
| `priority`       | لا     | نص                | مستوى أولوية البريد الإلكتروني (يمكن أن يكون `"high"`، `"normal"` (الافتراضي)، أو `"low"`). لاحظ أن القيمة `"normal"` لا تضبط رأس أولوية (هذا هو السلوك الافتراضي). إذا تم تعيين `"high"` أو `"low"`، فسيتم تعيين رؤوس `X-Priority` و `X-MSMail-Priority` و `Importance` [وفقًا لذلك](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | لا     | كائن أو مصفوفة    | كائن أو مصفوفة من حقول الرؤوس الإضافية للتعيين (انظر [رؤوس مخصصة في Nodemailer](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                                            |
| `messageId`      | لا     | نص                | قيمة اختيارية لـ Message-ID لرأس "Message-ID" (سيتم إنشاء قيمة افتراضية تلقائيًا إذا لم يتم تعيينها – لاحظ أن القيمة يجب أن [تلتزم بمواصفة RFC2822](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                                                   |
| `date`           | لا     | نص أو تاريخ       | قيمة تاريخ اختيارية ستُستخدم إذا كان رأس التاريخ مفقودًا بعد التحليل، وإلا سيتم استخدام سلسلة UTC الحالية إذا لم يتم تعيينها. لا يمكن أن يكون رأس التاريخ أكثر من 30 يومًا مقدمًا عن الوقت الحالي.                                                                                                                                                                                                                                                     |
| `list`           | لا     | كائن               | كائن اختياري لرؤوس `List-*` (انظر [رؤوس القائمة في Nodemailer](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                                  |
> مثال طلب (رمز API):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> مثال طلب (بيانات اعتماد الاسم المستعار):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> مثال طلب (البريد الإلكتروني الخام):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### استرجاع بريد SMTP الصادر {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> مثال طلب:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### حذف بريد SMTP الصادر {#delete-outbound-smtp-email}

سيؤدي حذف البريد الإلكتروني إلى تعيين الحالة إلى `"rejected"` (وبالتالي عدم معالجته في الطابور) فقط إذا كانت الحالة الحالية واحدة من `"pending"`، `"queued"`، أو `"deferred"`. قد نقوم بمسح البريد الإلكتروني تلقائيًا بعد 30 يومًا من إنشائه و/أو إرساله – لذلك يجب عليك الاحتفاظ بنسخة من رسائل SMTP الصادرة في عميلك أو قاعدة بياناتك أو تطبيقك. يمكنك الرجوع إلى قيمة معرف البريد الإلكتروني في قاعدة بياناتك إذا رغبت – يتم إرجاع هذه القيمة من كل من نقاط النهاية [إنشاء بريد إلكتروني](#create-email) و [استرجاع بريد إلكتروني](#retrieve-email).

> `DELETE /v1/emails/:id`

> مثال طلب:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## النطاقات {#domains}

> \[!TIP]
> نقاط نهاية النطاقات التي تستخدم اسم النطاق <code>/v1/domains/:domain_name</code> كنقطة نهاية قابلة للتبديل مع معرف النطاق <code>:domain_id</code>. هذا يعني أنه يمكنك الإشارة إلى النطاق إما بواسطة <code>الاسم</code> أو <code>المعرف</code>.

### قائمة النطاقات {#list-domains}

> \[!NOTE]
> اعتبارًا من 1 نوفمبر 2024، ستُعيّن نقاط نهاية API لـ [قائمة النطاقات](#list-domains) و [قائمة أسماء النطاقات المستعارة](#list-domain-aliases) إلى حد أقصى `1000` نتيجة لكل صفحة بشكل افتراضي. إذا كنت ترغب في الاشتراك في هذا السلوك مبكرًا، يمكنك تمرير `?paginate=true` كمعامل استعلام إضافي إلى عنوان URL لنقطة النهاية. راجع [الترقيم الصفحي](#pagination) لمزيد من التفاصيل.

> `GET /v1/domains`

| معامل الاستعلام        | مطلوب | النوع                      | الوصف                                                                                                                                            |
| --------------------- | ------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | لا     | نص (يدعم التعبيرات النمطية) | البحث عن النطاقات بالاسم                                                                                                                         |
| `name`                | لا     | نص (يدعم التعبيرات النمطية) | البحث عن النطاقات بالاسم                                                                                                                         |
| `sort`                | لا     | نص                       | الترتيب حسب حقل معين (ضع بادئة شرطة واحدة `-` للترتيب بالعكس). الافتراضي هو `created_at` إذا لم يتم التعيين.                                   |
| `page`                | لا     | رقم                       | راجع [الترقيم الصفحي](#pagination) لمزيد من التفاصيل                                                                                           |
| `limit`               | لا     | رقم                       | راجع [الترقيم الصفحي](#pagination) لمزيد من التفاصيل                                                                                           |

> مثال طلب:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### إنشاء نطاق {#create-domain}

> `POST /v1/domains`

| معامل الجسم                  | مطلوب | النوع                                          | الوصف                                                                                                                                                                                                                                                                                                              |
| ---------------------------- | ------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `domain`                     | نعم    | نص (اسم نطاق مؤهل بالكامل أو IP)              | اسم النطاق المؤهل بالكامل ("FQDN") أو عنوان IP                                                                                                                                                                                                                                                                     |
| `team_domain`                | لا     | نص (معرف النطاق أو اسم النطاق؛ FQDN)          | تعيين هذا النطاق تلقائيًا إلى نفس الفريق من نطاق آخر. هذا يعني أن جميع الأعضاء من هذا النطاق سيتم تعيينهم كأعضاء فريق، وسيتم تعيين `plan` تلقائيًا إلى `team` أيضًا. يمكنك تعيينه إلى `"none"` إذا لزم الأمر لتعطيله صراحة، لكن هذا ليس ضروريًا.                                                        |
| `plan`                       | لا     | نص (قابل للتعداد)                             | نوع الخطة (يجب أن تكون `"free"`، `"enhanced_protection"`، أو `"team"`، الافتراضي `"free"` أو خطة المستخدم المدفوعة الحالية إذا كان لديه واحدة)                                                                                                                                                                   |
| `catchall`                   | لا     | نص (عناوين بريد إلكتروني مفصولة) أو منطقي    | إنشاء اسم مستعار افتراضي شامل، الافتراضي `true` (إذا كان `true` سيستخدم عنوان بريد المستخدم في API كمستلم، وإذا كان `false` فلن يتم إنشاء اسم مستعار شامل). إذا تم تمرير نص، فهو قائمة مفصولة بعناوين البريد الإلكتروني لاستخدامها كمستلمين (مفصولة بفواصل أسطر، فراغ، و/أو فاصلة)                         |
| `has_adult_content_protection` | لا     | منطقي                                         | ما إذا كان سيتم تمكين حماية المحتوى البالغ من نوع Spam Scanner على هذا النطاق                                                                                                                                                                                                                                     |
| `has_phishing_protection`    | لا     | منطقي                                         | ما إذا كان سيتم تمكين حماية التصيد الاحتيالي من نوع Spam Scanner على هذا النطاق                                                                                                                                                                                                                                    |
| `has_executable_protection`  | لا     | منطقي                                         | ما إذا كان سيتم تمكين حماية الملفات التنفيذية من نوع Spam Scanner على هذا النطاق                                                                                                                                                                                                                                    |
| `has_virus_protection`       | لا     | منطقي                                         | ما إذا كان سيتم تمكين حماية الفيروسات من نوع Spam Scanner على هذا النطاق                                                                                                                                                                                                                                           |
| `has_recipient_verification` | لا     | منطقي                                         | الإعداد الافتراضي العالمي للنطاق لما إذا كان يجب على مستلمي الأسماء المستعارة النقر على رابط تحقق بالبريد الإلكتروني لكي تمر الرسائل                                                                                                                                                                            |
| `ignore_mx_check`            | لا     | منطقي                                         | ما إذا كان سيتم تجاهل فحص سجل MX على النطاق للتحقق. هذا مخصص بشكل رئيسي للمستخدمين الذين لديهم قواعد تكوين متقدمة لتبادل MX ويحتاجون إلى الاحتفاظ بتبادل MX الحالي وتحويله إلى نظامنا.                                                                                                                        |
| `retention_days`             | لا     | رقم                                           | عدد صحيح بين `0` و `30` يمثل عدد أيام الاحتفاظ لتخزين رسائل SMTP الصادرة بعد تسليمها بنجاح أو حدوث خطأ دائم. الافتراضي `0`، مما يعني أن رسائل SMTP الصادرة يتم مسحها وحذفها فورًا لأمانك.                                                                                                                     |
| `bounce_webhook`             | لا     | نص (URL) أو منطقي (false)                      | عنوان URL الخاص بـ `http://` أو `https://` الذي تختاره لإرسال ويب هوك الارتداد إليه. سنرسل طلب `POST` إلى هذا العنوان مع معلومات عن فشل رسائل SMTP الصادرة (مثل الفشل الناعم أو الصلب – حتى تتمكن من إدارة المشتركين لديك وإدارة البريد الصادر برمجيًا).                                                    |
| `max_quota_per_alias`        | لا     | نص                                           | الحد الأقصى لحصة التخزين للأسماء المستعارة على هذا النطاق. أدخل قيمة مثل "1 GB" سيتم تحليلها بواسطة [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                                          |
> مثال طلب:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### استرجاع النطاق {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> مثال طلب:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### التحقق من سجلات النطاق {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> مثال طلب:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### التحقق من سجلات SMTP للنطاق {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> مثال طلب:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### قائمة كلمات المرور الشاملة للنطاق {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> مثال طلب:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### إنشاء كلمة مرور شاملة للنطاق {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| معامل الجسم | مطلوب | النوع   | الوصف                                                                                                                                                                                                                     |
| ------------ | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | لا     | نص     | كلمة المرور الجديدة المخصصة التي تريد استخدامها لكلمة المرور الشاملة للنطاق. لاحظ أنه يمكنك ترك هذا الحقل فارغًا أو عدم تضمينه في جسم طلب API إذا كنت ترغب في الحصول على كلمة مرور قوية وعشوائية يتم إنشاؤها تلقائيًا. |
| `description`  | لا     | نص     | وصف لأغراض التنظيم فقط.                                                                                                                                                                                                   |

> مثال طلب:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### إزالة كلمة المرور الشاملة للنطاق {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> مثال طلب:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### تحديث النطاق {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| معامل الجسم                   | مطلوب | النوع                            | الوصف                                                                                                                                                                                                                                                                                     |
| ----------------------------- | ------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                   | لا     | نص أو رقم                       | المنفذ المخصص لتكوين إعادة توجيه SMTP (الافتراضي هو `"25"`)                                                                                                                                                                                                                              |
| `has_adult_content_protection` | لا     | منطقي                           | ما إذا كان سيتم تفعيل حماية المحتوى البالغ من نوع Spam Scanner على هذا النطاق                                                                                                                                                                                                             |
| `has_phishing_protection`     | لا     | منطقي                           | ما إذا كان سيتم تفعيل حماية التصيد الاحتيالي من نوع Spam Scanner على هذا النطاق                                                                                                                                                                                                           |
| `has_executable_protection`   | لا     | منطقي                           | ما إذا كان سيتم تفعيل حماية الملفات التنفيذية من نوع Spam Scanner على هذا النطاق                                                                                                                                                                                                         |
| `has_virus_protection`        | لا     | منطقي                           | ما إذا كان سيتم تفعيل حماية الفيروسات من نوع Spam Scanner على هذا النطاق                                                                                                                                                                                                                 |
| `has_recipient_verification`  | لا     | منطقي                           | الإعداد الافتراضي للنطاق العالمي لما إذا كان يجب على المستلمين البدلاء النقر على رابط تحقق بالبريد الإلكتروني للسماح بمرور الرسائل الإلكترونية                                                                                                                                          |
| `ignore_mx_check`             | لا     | منطقي                           | ما إذا كان سيتم تجاهل فحص سجل MX على النطاق للتحقق. هذا مخصص بشكل رئيسي للمستخدمين الذين لديهم قواعد تكوين متقدمة لتبادل MX ويحتاجون إلى الاحتفاظ بتبادل MX الحالي وإعادة التوجيه إلى نظامنا.                                                                                         |
| `retention_days`              | لا     | رقم                            | عدد صحيح بين `0` و `30` يمثل عدد أيام الاحتفاظ لتخزين رسائل SMTP الصادرة بعد تسليمها بنجاح أو حدوث خطأ دائم. القيمة الافتراضية هي `0`، مما يعني أن رسائل SMTP الصادرة يتم حذفها وتعديلها فورًا لأمانك.                                                                             |
| `bounce_webhook`              | لا     | نص (رابط URL) أو منطقي (false) | عنوان URL الخاص بالويب هوك `http://` أو `https://` الذي تختاره لإرسال إشعارات الارتداد إليه. سنرسل طلب `POST` إلى هذا العنوان مع معلومات عن فشل رسائل SMTP الصادرة (مثل الفشل المؤقت أو الدائم – حتى تتمكن من إدارة المشتركين لديك وبرمجيًا إدارة البريد الصادر).                     |
| `max_quota_per_alias`         | لا     | نص                            | الحد الأقصى لحصة التخزين للبدائل على اسم النطاق هذا. أدخل قيمة مثل "1 GB" والتي سيتم تحليلها بواسطة [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                 |
> طلب مثال:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### حذف النطاق {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> طلب مثال:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## الدعوات {#invites}

### قبول دعوة النطاق {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> طلب مثال:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### إنشاء دعوة نطاق {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| معامل الجسم | مطلوب | النوع                | الوصف                                                                                     |
| ------------ | ------- | --------------------- | ----------------------------------------------------------------------------------------- |
| `email`      | نعم     | نص (بريد إلكتروني)   | عنوان البريد الإلكتروني لدعوة قائمة أعضاء النطاق                                         |
| `group`      | نعم     | نص (قابل للتعداد)     | المجموعة التي سيتم إضافة المستخدم إليها في عضوية النطاق (يمكن أن تكون إما `"admin"` أو `"user"`) |

> طلب مثال:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> إذا كان المستخدم الذي تتم دعوته عضوًا مقبولًا بالفعل في أي نطاقات أخرى يكون المسؤول الذي يدعوه عضوًا فيها، فسيتم قبول الدعوة تلقائيًا ولن يتم إرسال بريد إلكتروني.

### إزالة دعوة نطاق {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| معامل الجسم | مطلوب | النوع           | الوصف                                         |
| ------------ | ------- | ---------------- | ---------------------------------------------- |
| `email`      | نعم     | نص (بريد إلكتروني) | عنوان البريد الإلكتروني لإزالته من قائمة أعضاء النطاق |

> طلب مثال:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## الأعضاء {#members}

### تحديث عضو النطاق {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| معامل الجسم | مطلوب | النوع                | الوصف                                                                                   |
| ------------ | ------- | --------------------- | ----------------------------------------------------------------------------------------- |
| `group`      | نعم     | نص (قابل للتعداد)     | المجموعة التي سيتم تحديث المستخدم إليها في عضوية النطاق (يمكن أن تكون إما `"admin"` أو `"user"`) |

> طلب مثال:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### إزالة عضو النطاق {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> طلب مثال:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## الأسماء المستعارة {#aliases}

### إنشاء كلمة مرور لاسم مستعار {#generate-an-alias-password}

لاحظ أنه إذا لم تقم بإرسال تعليمات عبر البريد الإلكتروني، فسيكون اسم المستخدم وكلمة المرور في جسم استجابة JSON لطلب ناجح بالتنسيق `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| معامل الجسم           | مطلوب | النوع    | الوصف                                                                                                                                                                                                                                                                                             |
| --------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`        | لا      | نص       | كلمة المرور الجديدة المخصصة التي تريد استخدامها للاسم المستعار. لاحظ أنه يمكنك ترك هذا الحقل فارغًا أو عدم تضمينه تمامًا في جسم طلب API إذا كنت ترغب في الحصول على كلمة مرور قوية وعشوائية التوليد.                                                                                          |
| `password`            | لا      | نص       | كلمة المرور الحالية للاسم المستعار لتغيير كلمة المرور دون حذف تخزين صندوق البريد IMAP الحالي (انظر خيار `is_override` أدناه إذا لم تعد تملك كلمة المرور الحالية).                                                                                                                           |
| `is_override`         | لا      | منطقي    | **استخدم بحذر**: هذا سيقوم بالكتابة فوق كلمة مرور الاسم المستعار وقاعدة البيانات بالكامل، وسيحذف بشكل دائم تخزين IMAP الحالي ويعيد تعيين قاعدة بيانات البريد الإلكتروني SQLite الخاصة بالاسم المستعار بالكامل. يرجى عمل نسخة احتياطية إذا أمكن إذا كان لديك صندوق بريد مرتبط بهذا الاسم المستعار. |
| `emailed_instructions`| لا      | نص       | عنوان البريد الإلكتروني لإرسال كلمة مرور الاسم المستعار وتعليمات الإعداد إليه.                                                                                                                                                                                                                   |
> مثال طلب:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### قائمة أسماء النطاقات المستعارة {#list-domain-aliases}

> \[!ملاحظة]
> اعتبارًا من 1 نوفمبر 2024، ستُعيّن نقاط نهاية API لـ [قائمة النطاقات](#list-domains) و [قائمة أسماء النطاقات المستعارة](#list-domain-aliases) إلى حد أقصى `1000` نتيجة لكل صفحة بشكل افتراضي. إذا كنت ترغب في الاشتراك في هذا السلوك مبكرًا، يمكنك تمرير `?paginate=true` كمعامل استعلام إضافي إلى عنوان URL لنقطة النهاية. راجع [الترقيم الصفحي](#pagination) لمزيد من التفاصيل.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| معامل الاستعلام        | مطلوب | النوع                      | الوصف                                                                                                                                               |
| --------------------- | ------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | لا     | نص (يدعم التعبيرات النمطية) | البحث عن أسماء مستعارة في نطاق حسب الاسم أو التسمية أو المستلم                                                                                     |
| `name`                | لا     | نص (يدعم التعبيرات النمطية) | البحث عن أسماء مستعارة في نطاق حسب الاسم                                                                                                          |
| `recipient`           | لا     | نص (يدعم التعبيرات النمطية) | البحث عن أسماء مستعارة في نطاق حسب المستلم                                                                                                       |
| `sort`                | لا     | نص                       | الترتيب حسب حقل معين (ضع شرطة واحدة `-` كبادئة للترتيب بالعكس). الافتراضي هو `created_at` إذا لم يتم التعيين.                                    |
| `page`                | لا     | رقم                       | راجع [الترقيم الصفحي](#pagination) لمزيد من التفاصيل                                                                                            |
| `limit`               | لا     | رقم                       | راجع [الترقيم الصفحي](#pagination) لمزيد من التفاصيل                                                                                            |

> مثال طلب:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### إنشاء اسم نطاق مستعار جديد {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| معامل الجسم                  | مطلوب | النوع                                   | الوصف                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------- | ------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                      | لا     | نص                                     | اسم الاسم المستعار (إذا لم يُقدّم أو كان فارغًا، يتم إنشاء اسم مستعار عشوائي)                                                                                                                                                                                                                                                                                                            |
| `recipients`                | لا     | نص أو مصفوفة                          | قائمة المستلمين (يجب أن تكون نصًا مفصولًا بفواصل أو مسافات أو فواصل أسطر أو مصفوفة من عناوين بريد إلكتروني صالحة، أسماء نطاقات مؤهلة بالكامل ("FQDN")، عناوين IP، و/أو عناوين URL لخدمات الويب – وإذا لم تُقدّم أو كانت مصفوفة فارغة، سيتم تعيين بريد المستخدم الذي يقوم بطلب API كمستلم)                                                                                     |
| `description`               | لا     | نص                                     | وصف الاسم المستعار                                                                                                                                                                                                                                                                                                                                                                         |
| `labels`                    | لا     | نص أو مصفوفة                          | قائمة التسميات (يجب أن تكون نصًا مفصولًا بفواصل أو مسافات أو فواصل أسطر أو مصفوفة)                                                                                                                                                                                                                                                                                                       |
| `has_recipient_verification`| لا     | منطقي                                  | يتطلب من المستلمين النقر على رابط تحقق عبر البريد الإلكتروني لتمرير الرسائل (يُفترض الإعداد الخاص بالنطاق إذا لم يُحدد صراحة في جسم الطلب)                                                                                                                                                                                                                                              |
| `is_enabled`                | لا     | منطقي                                  | تمكين أو تعطيل هذا الاسم المستعار (إذا تم تعطيله، لن تُوجّه الرسائل إلى أي مكان ولكن ستُرجع رموز حالة ناجحة). إذا تم تمرير قيمة، يتم تحويلها إلى منطقي باستخدام [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                                     |
| `error_code_if_disabled`    | لا     | رقم (إما `250`، `421`، أو `550`)       | سيرفض البريد الوارد إلى هذا الاسم المستعار إذا كان `is_enabled` هو `false` مع إما `250` (تسليم هادئ إلى لا مكان، مثل الثقب الأسود أو `/dev/null`)، `421` (رفض مؤقت؛ وإعادة المحاولة لمدة تصل إلى ~5 أيام) أو `550` فشل دائم ورفض. الافتراضي هو `250`.                                                                                                                                   |
| `has_imap`                  | لا     | منطقي                                  | تمكين أو تعطيل تخزين IMAP لهذا الاسم المستعار (إذا تم تعطيله، فلن تُخزن الرسائل الواردة في [تخزين IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). إذا تم تمرير قيمة، يتم تحويلها إلى منطقي باستخدام [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                      |
| `has_pgp`                   | لا     | منطقي                                  | تمكين أو تعطيل [تشفير OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) لـ [تخزين البريد الإلكتروني المشفر IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) باستخدام `public_key` الخاص بالاسم المستعار.                                                                                                     |
| `public_key`                | لا     | نص                                     | مفتاح OpenPGP العام بصيغة ASCII Armor ([انقر هنا لعرض مثال](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); مثل مفتاح GPG لـ `support@forwardemail.net`). ينطبق هذا فقط إذا كان `has_pgp` مضبوطًا على `true`. [تعرف على المزيد حول التشفير من طرف إلى طرف في الأسئلة الشائعة](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                 | لا     | نص                                     | الحد الأقصى للتخزين لهذا الاسم المستعار. اتركه فارغًا لإعادة التعيين إلى الحد الأقصى الحالي للنطاق أو أدخل قيمة مثل "1 GB" التي سيتم تحليلها بواسطة [bytes](https://github.com/visionmedia/bytes.js). يمكن تعديل هذه القيمة فقط بواسطة مسؤولي النطاق.                                                                                                                                  |
| `vacation_responder_is_enabled` | لا  | منطقي                                  | تمكين أو تعطيل الرد الآلي أثناء الإجازة.                                                                                                                                                                                                                                                                                                                                                   |
| `vacation_responder_start_date` | لا  | نص                                     | تاريخ بدء الرد الآلي أثناء الإجازة (إذا تم التمكين ولم يتم تعيين تاريخ بدء هنا، يفترض أنه بدأ بالفعل). ندعم تنسيقات التواريخ مثل `MM/DD/YYYY`، `YYYY-MM-DD`، وتنسيقات أخرى عبر التحليل الذكي باستخدام `dayjs`.                                                                                                                                                                         |
| `vacation_responder_end_date`   | لا  | نص                                     | تاريخ انتهاء الرد الآلي أثناء الإجازة (إذا تم التمكين ولم يتم تعيين تاريخ انتهاء هنا، يفترض أنه لا ينتهي أبدًا ويرد إلى الأبد). ندعم تنسيقات التواريخ مثل `MM/DD/YYYY`، `YYYY-MM-DD`، وتنسيقات أخرى عبر التحليل الذكي باستخدام `dayjs`.                                                                                                                                                 |
| `vacation_responder_subject`    | لا  | نص                                     | الموضوع بنص عادي للرد الآلي أثناء الإجازة، مثل "خارج المكتب". نستخدم `striptags` لإزالة جميع علامات HTML هنا.                                                                                                                                                                                                                                                                             |
| `vacation_responder_message`    | لا  | نص                                     | الرسالة بنص عادي للرد الآلي أثناء الإجازة، مثل "سأكون خارج المكتب حتى فبراير.". نستخدم `striptags` لإزالة جميع علامات HTML هنا.                                                                                                                                                                                                                                                           |
> طلب مثال:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### استرجاع اسم مستعار للنطاق {#retrieve-domain-alias}

يمكنك استرجاع اسم مستعار للنطاق إما بواسطة `id` أو بواسطة قيمة `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> طلب مثال:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> طلب مثال:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### تحديث اسم مستعار للنطاق {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| معامل الجسم                    | مطلوب | النوع                                  | الوصف                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | ------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                        | لا     | نص                                    | اسم المستعار                                                                                                                                                                                                                                                                                                                                                                              |
| `recipients`                  | لا     | نص أو مصفوفة                         | قائمة المستلمين (يجب أن تكون نصًا مفصولًا بفواصل أو مسافات أو فواصل أسطر أو مصفوفة من عناوين بريد إلكتروني صحيحة، أسماء نطاقات مؤهلة بالكامل ("FQDN")، عناوين IP، و/أو روابط ويب هوك)                                                                                                                                                                                                   |
| `description`                 | لا     | نص                                    | وصف المستعار                                                                                                                                                                                                                                                                                                                                                                              |
| `labels`                      | لا     | نص أو مصفوفة                         | قائمة العلامات (يجب أن تكون نصًا مفصولًا بفواصل أو مسافات أو فواصل أسطر أو مصفوفة)                                                                                                                                                                                                                                                                                                       |
| `has_recipient_verification`  | لا     | منطقي                                 | يتطلب من المستلمين النقر على رابط تحقق عبر البريد الإلكتروني لتدفق الرسائل (يتم التعيين افتراضيًا إلى إعداد النطاق إذا لم يتم تعيينه صراحة في جسم الطلب)                                                                                                                                                                                                                                |
| `is_enabled`                  | لا     | منطقي                                 | ما إذا كان يجب تمكين أو تعطيل هذا المستعار (إذا تم تعطيله، فلن يتم توجيه الرسائل إلى أي مكان ولكن سيتم إرجاع رموز حالة ناجحة). إذا تم تمرير قيمة، يتم تحويلها إلى منطقي باستخدام [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                       |
| `error_code_if_disabled`      | لا     | رقم (إما `250`، `421`، أو `550`)     | سيتم رفض البريد الوارد إلى هذا المستعار إذا كان `is_enabled` هو `false` مع إما `250` (تسليم هادئ إلى لا مكان، مثل الثقب الأسود أو `/dev/null`)، `421` (رفض مؤقت؛ وإعادة المحاولة لمدة تصل إلى ~5 أيام) أو `550` فشل دائم ورفض. القيمة الافتراضية هي `250`.                                                                                                                               |
| `has_imap`                    | لا     | منطقي                                 | ما إذا كان يجب تمكين أو تعطيل تخزين IMAP لهذا المستعار (إذا تم تعطيله، فلن يتم تخزين الرسائل الواردة في [تخزين IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). إذا تم تمرير قيمة، يتم تحويلها إلى منطقي باستخدام [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                      |
| `has_pgp`                     | لا     | منطقي                                 | ما إذا كان يجب تمكين أو تعطيل [تشفير OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) لـ [تخزين البريد الإلكتروني المشفر IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) باستخدام `public_key` الخاص بالمستعار.                                                                                                   |
| `public_key`                  | لا     | نص                                    | مفتاح OpenPGP العام بصيغة ASCII Armor ([انقر هنا لعرض مثال](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); مثل مفتاح GPG لـ `support@forwardemail.net`). ينطبق هذا فقط إذا كان لديك `has_pgp` مضبوطًا على `true`. [تعرف على المزيد حول التشفير من طرف إلى طرف في الأسئلة الشائعة لدينا](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                   | لا     | نص                                    | الحد الأقصى لحصة التخزين لهذا المستعار. اتركه فارغًا لإعادة التعيين إلى الحد الأقصى الحالي للنطاق أو أدخل قيمة مثل "1 GB" التي سيتم تحليلها بواسطة [bytes](https://github.com/visionmedia/bytes.js). يمكن تعديل هذه القيمة فقط بواسطة مسؤولي النطاق.                                                                                                                               |
| `vacation_responder_is_enabled` | لا   | منطقي                                 | ما إذا كان يجب تمكين أو تعطيل الرد الآلي للعطلة.                                                                                                                                                                                                                                                                                                                                           |
| `vacation_responder_start_date` | لا   | نص                                    | تاريخ بدء الرد الآلي للعطلة (إذا تم التمكين ولم يتم تعيين تاريخ بدء هنا، فإنه يفترض أنه قد بدأ بالفعل). ندعم تنسيقات التواريخ مثل `MM/DD/YYYY`، `YYYY-MM-DD`، وتنسيقات أخرى عبر التحليل الذكي باستخدام `dayjs`.                                                                                                                                                                      |
| `vacation_responder_end_date` | لا    | نص                                    | تاريخ انتهاء الرد الآلي للعطلة (إذا تم التمكين ولم يتم تعيين تاريخ انتهاء هنا، فإنه يفترض أنه لا ينتهي أبدًا ويرد إلى الأبد). ندعم تنسيقات التواريخ مثل `MM/DD/YYYY`، `YYYY-MM-DD`، وتنسيقات أخرى عبر التحليل الذكي باستخدام `dayjs`.                                                                                                                                                  |
| `vacation_responder_subject`  | لا     | نص                                    | الموضوع بنص عادي للرد الآلي للعطلة، مثل "خارج المكتب". نستخدم `striptags` لإزالة جميع علامات HTML هنا.                                                                                                                                                                                                                                                                                     |
| `vacation_responder_message`  | لا     | نص                                    | الرسالة بنص عادي للرد الآلي للعطلة، مثل "سأكون خارج المكتب حتى فبراير.". نستخدم `striptags` لإزالة جميع علامات HTML هنا.                                                                                                                                                                                                                                                                   |
> طلب مثال:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### حذف اسم مستعار للنطاق {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> طلب مثال:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## التشفير {#encrypt}

نسمح لك بتشفير السجلات حتى في الخطة المجانية دون أي تكلفة. يجب ألا تكون الخصوصية ميزة، بل يجب أن تكون مدمجة بطبيعتها في جميع جوانب المنتج. بناءً على الطلبات الكثيرة في [نقاش Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) وعلى [قضايا GitHub الخاصة بنا](https://github.com/forwardemail/forwardemail.net/issues/254) أضفنا هذا.

### تشفير سجل TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| معامل الجسم | مطلوب | النوع   | الوصف                                  |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input`        | نعم      | نص    | أي سجل TXT نصي صالح من Forward Email |

> طلب مثال:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
