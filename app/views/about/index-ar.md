# عن فورورد إيميل {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="فريق وقصة شركة فورورد إيميل" class="rounded-lg" />

# عن فورورد إيميل {#about-forward-email-1}


## جدول المحتويات {#table-of-contents}

* [نظرة عامة](#overview)
* [المؤسس والرسالة](#founder-and-mission)
* [الجدول الزمني](#timeline)
  * [2017 - التأسيس والإطلاق](#2017---founding-and-launch)
  * [2018 - البنية التحتية والتكامل](#2018---infrastructure-and-integration)
  * [2019 - ثورة الأداء](#2019---performance-revolution)
  * [2020 - التركيز على الخصوصية والأمان](#2020---privacy-and-security-focus)
  * [2021 - تحديث المنصة](#2021---platform-modernization)
  * [2023 - توسيع البنية التحتية والميزات](#2023---infrastructure-and-feature-expansion)
  * [2024 - تحسين الخدمة والميزات المتقدمة](#2024---service-optimization-and-advanced-features)
  * [2025 - تحسينات الخصوصية ودعم البروتوكولات {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - الامتثال لمواصفات RFC والتصفية المتقدمة {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [المبادئ الأساسية](#core-principles)
* [الحالة الحالية](#current-status)


## نظرة عامة {#overview}

> \[!TIP]
> للتفاصيل التقنية حول هيكلنا، وتنفيذات الأمان، وخارطة الطريق، راجع [الورقة التقنية](https://forwardemail.net/technical-whitepaper.pdf).

فورورد إيميل هي خدمة [مجانية ومفتوحة المصدر](https://en.wikipedia.org/wiki/Free_and_open-source "مجانية ومفتوحة المصدر") لإعادة توجيه البريد الإلكتروني [email forwarding](https://en.wikipedia.org/wiki/Email_forwarding "إعادة توجيه البريد الإلكتروني") تركز على [حق المستخدم في الخصوصية](https://en.wikipedia.org/wiki/Right_to_privacy "حق الخصوصية"). ما بدأ كحل بسيط لإعادة توجيه البريد الإلكتروني في 2017 تطور إلى منصة بريد إلكتروني شاملة تقدم أسماء نطاقات مخصصة غير محدودة، وعناوين بريد إلكتروني وأسماء مستعارة غير محدودة، وعناوين بريد إلكتروني مؤقتة غير محدودة، وحماية من الرسائل المزعجة والتصيد الاحتيالي، وتخزين مشفر لصناديق البريد، والعديد من الميزات المتقدمة.

الخدمة مملوكة ومدارة من قبل فريق المؤسسين الأصلي من المصممين والمطورين. تم بناؤها باستخدام برمجيات مفتوحة المصدر 100% باستخدام [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript")، و[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")، و[DNS](https://en.wikipedia.org/wiki/Domain_Name_System "نظام أسماء النطاقات")، و[HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS")، و[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS")، و[SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## المؤسس والرسالة {#founder-and-mission}

تأسست فورورد إيميل على يد **نيكولاس باو** في 2017. وفقًا لـ [الورقة التقنية لفورورد إيميل](https://forwardemail.net/technical-whitepaper.pdf)، كان باو يبحث في البداية عن حل بسيط وفعال من حيث التكلفة لتمكين البريد الإلكتروني على أسماء النطاقات لمشاريعه الجانبية. بعد البحث في الخيارات المتاحة، بدأ في برمجة حله الخاص وشراء النطاق `forwardemail.net` في 2 أكتوبر 2017.

تتجاوز رسالة فورورد إيميل تقديم خدمات البريد الإلكتروني فقط—فهي تهدف إلى تغيير كيفية تعامل الصناعة مع خصوصية وأمان البريد الإلكتروني. تشمل القيم الأساسية للشركة الشفافية، وتحكم المستخدم، وحماية الخصوصية من خلال التنفيذ التقني وليس مجرد وعود سياسية.


## الجدول الزمني {#timeline}

### 2017 - التأسيس والإطلاق {#2017---founding-and-launch}

**2 أكتوبر 2017**: اشترى نيكولاس باو النطاق `forwardemail.net` بعد بحثه عن حلول بريد إلكتروني فعالة من حيث التكلفة لمشاريعه الجانبية.

**5 نوفمبر 2017**: أنشأ باو ملف جافاسكريبت مكون من 634 سطرًا باستخدام [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") لإعادة توجيه البريد الإلكتروني لأي اسم نطاق مخصص. تم نشر هذا التنفيذ الأولي كمصدر مفتوح على [GitHub](https://github.com/forwardemail) وتم إطلاق الخدمة باستخدام صفحات GitHub.
**نوفمبر 2017**: تم إطلاق Forward Email رسميًا بعد إصدار أولي. كانت النسخة المبكرة تعتمد بالكامل على DNS بدون تسجيل حساب أو عملية اشتراك—مجرد ملف README مكتوب بلغة Markdown يحتوي على تعليمات. كان بإمكان المستخدمين إعداد إعادة توجيه البريد الإلكتروني عن طريق تكوين سجلات MX للإشارة إلى `mx1.forwardemail.net` و `mx2.forwardemail.net`، وإضافة سجل TXT يحتوي على `forward-email=user@gmail.com`.

جذبت بساطة وفعالية هذا الحل انتباه مطورين بارزين، بما في ذلك [ديفيد هاينماير هانسون](https://dhh.dk) (مبتكر Ruby on Rails)، الذي لا يزال يستخدم Forward Email على نطاقه `dhh.dk` حتى اليوم.

### 2018 - البنية التحتية والتكامل {#2018---infrastructure-and-integration}

**أبريل 2018**: عندما أطلقت [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") خدمتها [DNS للمستهلكين مع التركيز على الخصوصية](https://blog.cloudflare.com/announcing-1111/)، انتقلت Forward Email من استخدام [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") إلى [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") لمعالجة عمليات البحث في [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")، مما يعكس التزام الشركة بخيارات بنية تحتية تركز على الخصوصية.

**أكتوبر 2018**: سمحت Forward Email للمستخدمين بـ "إرسال البريد كـ" مع [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") و [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook")، موسعة قدرات التكامل مع مزودي البريد الإلكتروني الشائعين.

### 2019 - ثورة الأداء {#2019---performance-revolution}

**مايو 2019**: أصدرت Forward Email النسخة 2، والتي مثلت إعادة كتابة كبيرة عن الإصدارات الأولية. ركز هذا التحديث على تحسينات [الأداء](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") من خلال استخدام [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") و [streams](https://en.wikipedia.org/wiki/Streams "Streams")، مما أسس لقاعدة توسعية للمنصة.

### 2020 - التركيز على الخصوصية والأمان {#2020---privacy-and-security-focus}

**فبراير 2020**: أطلقت Forward Email خطة حماية الخصوصية المعززة، التي تسمح للمستخدمين بإيقاف إعداد إدخالات سجلات DNS العامة مع ألقاب إعادة توجيه البريد الإلكتروني الخاصة بهم. من خلال هذه الخطة، يتم إخفاء معلومات لقب البريد الإلكتروني للمستخدم من أن تكون قابلة للبحث علنًا عبر الإنترنت. كما أطلقت الشركة ميزة تمكّن من تفعيل أو تعطيل ألقاب محددة مع السماح لها بالظهور كعناوين بريد إلكتروني صالحة وإرجاع رموز حالة [SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") ناجحة، مع تجاهل الرسائل فورًا (مماثل لتوجيه الإخراج إلى [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**أبريل 2020**: بعد مواجهة العديد من العقبات مع حلول الكشف عن البريد المزعج الموجودة التي لم تحترم سياسة الخصوصية الخاصة بـ Forward Email، أطلقت الشركة النسخة الأولية التجريبية من ماسح البريد المزعج. يستخدم هذا الحل المجاني والمفتوح المصدر بالكامل لتصفية البريد المزعج [تقنية تصفية البريد المزعج بايز الساذج](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") مع حماية من [التصيد الاحتيالي](https://en.wikipedia.org/wiki/Phishing "Phishing") وهجمات [التشابه الحرفي في أسماء النطاقات](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). كما أطلقت Forward Email ميزة [المصادقة الثنائية](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) باستخدام [كلمات المرور لمرة واحدة](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) لتعزيز أمان الحساب.

**مايو 2020**: سمحت Forward Email بإعادة توجيه [المنافذ المخصصة](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") كحل بديل للمستخدمين لتجاوز حظر المنافذ من قبل [مزود خدمة الإنترنت](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). كما أطلقت الشركة [واجهة برمجة التطبيقات RESTful لإعادة توجيه البريد الإلكتروني المجاني](email-api) مع توثيق كامل وأمثلة على الطلبات والاستجابات في الوقت الحقيقي، بالإضافة إلى دعم الويب هوكس.
**أغسطس 2020**: أضاف Forward Email دعمًا لنظام مصادقة البريد الإلكتروني [Authenticated Received Chain](arc) ("ARC")، مما عزز أمان البريد الإلكتروني وقابلية التسليم بشكل أكبر.

**23 نوفمبر 2020**: أطلق Forward Email نسخته العامة بعد انتهاء برنامج البيتا، مما يمثل خطوة مهمة في تطوير المنصة.

### 2021 - تحديث المنصة {#2021---platform-modernization}

**فبراير 2021**: أعاد Forward Email هيكلة قاعدة الشيفرة الخاصة بهم لإزالة جميع الاعتمادات على [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), مما سمح لأن تصبح تقنيتهم 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") و [Node.js](https://en.wikipedia.org/wiki/Node.js). جاء هذا القرار المعماري تماشيًا مع التزام الشركة بالحفاظ على تكديس تقني مفتوح المصدر ومتسق.

**27 سبتمبر 2021**: أضاف Forward Email [دعمًا](email-forwarding-regex-pattern-filter) لأسماء البريد الإلكتروني المعاد توجيهها لتتطابق مع [التعبيرات النمطية](https://en.wikipedia.org/wiki/Regular_expression "Regular expression")، مما يوفر للمستخدمين قدرات توجيه بريد إلكتروني أكثر تطورًا.

### 2023 - توسيع البنية التحتية والميزات {#2023---infrastructure-and-feature-expansion}

**يناير 2023**: أطلق Forward Email موقعًا معاد تصميمه ومحسّنًا لسرعة الصفحات، مما حسن تجربة المستخدم والأداء.

**فبراير 2023**: أضافت الشركة دعمًا لـ [سجلات الأخطاء](/faq#do-you-store-error-logs) وطبقت نظام ألوان موقع [الوضع الداكن](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme)، استجابةً لتفضيلات المستخدمين واحتياجات الوصول.

**مارس 2023**: أطلق Forward Email [Tangerine](https://github.com/forwardemail/tangerine#readme) ودمجه في بنيتهم التحتية، مما مكن من استخدام [DNS عبر HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") على طبقة التطبيق. كما أضافت الشركة دعمًا لـ [MTA-STS](/faq#do-you-support-mta-sts) وانتقلت من [hCaptcha](/) إلى [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**أبريل 2023**: نفذ Forward Email بنية تحتية جديدة مؤتمتة بالكامل. بدأ تشغيل الخدمة بأكملها على DNS موزع عالميًا ومتوازن حسب القرب مع فحوصات صحة وتبديل تلقائي باستخدام [Cloudflare](https://cloudflare.com)، مستبدلين نهج DNS الدائري السابق. انتقلت الشركة إلى **خوادم معدنية صافية** عبر مزودين متعددين، بما في ذلك [Vultr](https://www.vultr.com/?ref=429848) و [Digital Ocean](https://m.do.co/c/a7cecd27e071)، وكلاهما مزودان متوافقان مع SOC 2 Type 1. تم نقل قواعد بيانات MongoDB و Redis إلى تكوينات عنقودية مع عقد رئيسية واحتياطية لتوفير توافر عالي، وتشفير SSL شامل، وتشفير أثناء التخزين، واستعادة نقطة زمنية (PITR).

**مايو 2023**: أطلق Forward Email ميزة **SMTP الصادرة** الخاصة بهم لـ [إرسال البريد الإلكتروني عبر SMTP](/faq#do-you-support-sending-email-with-smtp) و [إرسال البريد الإلكتروني عبر API](/faq#do-you-support-sending-email-with-api). تتضمن هذه الميزة ضوابط مدمجة لضمان قابلية تسليم عالية، ونظام قوائم انتظار وإعادة محاولة حديث وقوي، و [دعم سجلات الأخطاء في الوقت الحقيقي](/faq#do-you-store-error-logs).

**نوفمبر 2023**: أطلق Forward Email ميزة [**تخزين صندوق البريد المشفر**](/blog/docs/best-quantum-safe-encrypted-email-service) الخاصة بهم لـ [دعم IMAP](/faq#do-you-support-receiving-email-with-imap)، مما يمثل تقدمًا كبيرًا في خصوصية وأمان البريد الإلكتروني.

**ديسمبر 2023**: أضافت الشركة [دعمًا](/faq#do-you-support-pop3) لـ [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)، و [المفاتيح المارة و WebAuthn](/faq#do-you-support-passkeys-and-webauthn)، و [مراقبة وقت الوصول إلى البريد](/faq#i)، و [OpenPGP لتخزين IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - تحسين الخدمة والميزات المتقدمة {#2024---service-optimization-and-advanced-features}

**فبراير 2024**: أضاف Forward Email [دعم التقويم (CalDAV)](/faq#do-you-support-calendars-caldav)، موسعًا قدرات المنصة لتشمل مزامنة التقويم إلى جانب البريد الإلكتروني.
**مارس إلى يوليو 2024**: أطلقت Forward Email تحسينات وتحسينات كبيرة على خدمات IMAP وPOP3 وCalDAV الخاصة بها، بهدف جعل خدمتها سريعة مثل، إن لم تكن أسرع من، البدائل.

**يوليو 2024**: أضافت الشركة [دعم الدفع على iOS](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) لمعالجة نقص دعم أمر IMAP `IDLE` في Apple Mail على iOS، مما مكن من الإشعارات في الوقت الحقيقي لأجهزة Apple iOS. كما أضافت Forward Email مراقبة الوقت حتى الوصول إلى البريد الوارد ("TTI") لخدمتها الخاصة وYahoo/AOL، وبدأت بالسماح للمستخدمين بتشفير سجل DNS TXT بالكامل حتى في الخطة المجانية. بناءً على الطلبات في [مناقشات Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) و[مشاكل GitHub](https://github.com/forwardemail/forwardemail.net/issues/254)، أضافت الشركة إمكانية أن ترفض الأسماء المستعارة إما بهدوء `250`، أو رفضًا ناعمًا `421`، أو رفضًا قاسيًا `550` عند تعطيلها.

**أغسطس 2024**: أضافت Forward Email دعمًا لتصدير صناديق البريد بصيغ [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) و[Mbox](https://en.wikipedia.org/wiki/Mbox) (بالإضافة إلى صيغة التصدير الحالية [SQLite](https://en.wikipedia.org/wiki/SQLite)). [تمت إضافة دعم توقيع Webhook](https://forwardemail.net/faq#do-you-support-bounce-webhooks)، وبدأت الشركة بالسماح للمستخدمين بإرسال النشرات الإخبارية والإعلانات والتسويق عبر البريد الإلكتروني من خلال خدمة SMTP الصادرة الخاصة بهم. كما تم تنفيذ حصص تخزين على مستوى النطاق والأسماء المستعارة لـ IMAP/POP3/CalDAV.

### 2025 - تحسينات الخصوصية ودعم البروتوكولات {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**سبتمبر 2024 إلى يناير 2025**: أضافت Forward Email [ميزة الرد الآلي على الإجازات المطلوبة بشدة وتشفير OpenPGP/WKD لإعادة توجيه البريد الإلكتروني](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254)، بناءً على قدراتها السابقة في تخزين صناديق البريد المشفرة.

**21 يناير 2025**: توفي صديق المؤسس المفضل "جاك"، رفيقه الكلب الوفي، بسلام عن عمر يقارب 11 عامًا. سيُذكر جاك [دائمًا](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) لرفاقته الثابتة التي دعمت إنشاء Forward Email. تم إهداء [الورقة التقنية لـ Forward Email](https://forwardemail.net/technical-whitepaper.pdf) إلى جاك، معترفين بدوره في تطوير الخدمة.

**فبراير 2025**: انتقلت Forward Email إلى [DataPacket](https://www.datapacket.com) كمزود مركز البيانات الأساسي الجديد، مع تنفيذ أجهزة مخصصة موجهة للأداء على عتاد معدني صلب لتعزيز موثوقية الخدمة وسرعتها.

**مارس 2025**: تم إصدار النسخة 1.0 من Forward Email رسميًا.

**أبريل 2025**: نُشرت النسخة الأولى من [الورقة التقنية لـ Forward Email](https://forwardemail.net/technical-whitepaper.pdf)، وبدأت الشركة في قبول مدفوعات العملات المشفرة.

**مايو 2025**: أطلقت الخدمة توثيق API جديد باستخدام [Scalar](https://github.com/scalar/scalar).

**يونيو 2025**: أطلقت Forward Email دعمًا لبروتوكول [CardDAV](/faq#do-you-support-contacts-carddav)، موسعة قدرات المنصة لتشمل مزامنة جهات الاتصال إلى جانب خدمات البريد الإلكتروني والتقويم الحالية.

**أغسطس 2025**: أضافت المنصة دعم [CalDAV VTODO/المهام](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\))، مما مكن إدارة المهام إلى جانب أحداث التقويم.

**نوفمبر 2025**: تم تعزيز أمان المنصة من خلال الترحيل من PBKDF2 إلى [Argon2id](https://en.wikipedia.org/wiki/Argon2) لتجزئة كلمات المرور، وتم ترحيل البنية التحتية من Redis إلى [Valkey](https://github.com/valkey-io/valkey).

**ديسمبر 2025**: تم إصدار النسخة 2.0، مع تقديم دعم [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) لتشفير TLS الإجباري على نقل البريد الإلكتروني وترقية إلى [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) الإصدار 6.
### 2026 - الامتثال لمواصفات RFC والتصفية المتقدمة {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**يناير 2026**: أصدرت Forward Email وثيقة شاملة حول [الامتثال لبروتوكولات RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) وأضافت دعمًا لـ [تشفير S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) و [تصفية البريد الإلكتروني الشاملة باستخدام Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) مع دعم [بروتوكول ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering). كما تم توسيع واجهة برمجة التطبيقات REST لتشمل 39 نقطة نهاية.

**فبراير 2026**: تم إطلاق عميل البريد الإلكتروني الرسمي مفتوح المصدر على الويب في [mail.forwardemail.net](https://mail.forwardemail.net) ([الكود المصدري على GitHub](https://github.com/forwardemail/mail.forwardemail.net)). كما أضافت المنصة دعمًا لـ [امتدادات جدولة CalDAV (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638)، و [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities)، و [Domain Connect](https://domainconnect.org) لإعداد DNS بنقرة واحدة. تم إطلاق إشعارات الدفع في الوقت الحقيقي لـ IMAP و CalDAV و CardDAV باستخدام WebSockets.

**مارس 2026**: تمت إضافة دعم لتخزين مخصص متوافق مع S3 لكل نطاق، إلى جانب أداة سطر أوامر للإدارة. بدأ العمل على تطبيقات سطح المكتب والهواتف المحمولة متعددة المنصات لأنظمة macOS و Windows و Linux و iOS و Android باستخدام نفس قاعدة كود البريد الإلكتروني مفتوح المصدر، والمبنية باستخدام [Tauri](https://tauri.app).


## المبادئ الأساسية {#core-principles}

منذ تأسيسها، حافظت Forward Email على التزام راسخ بمبادئ الخصوصية والأمان:

**فلسفة مفتوحة المصدر 100%**: على عكس المنافسين الذين يفتحون فقط الواجهات الأمامية بينما يحتفظون بالواجهات الخلفية مغلقة، جعلت Forward Email كامل قاعدة الكود الخاصة بها—الواجهة الأمامية والخلفية—متاحة للفحص العام على [GitHub](https://github.com/forwardemail).

**تصميم يركز على الخصوصية**: من اليوم الأول، نفذت Forward Email نهج معالجة فريد في الذاكرة يتجنب كتابة الرسائل إلى القرص، مما يميزها عن خدمات البريد التقليدية التي تخزن الرسائل في قواعد بيانات أو أنظمة ملفات.

**الابتكار المستمر**: تطورت الخدمة من حل بسيط لإعادة توجيه البريد الإلكتروني إلى منصة بريد إلكتروني شاملة بميزات مثل صناديق بريد مشفرة، تشفير مقاوم للحوسبة الكمومية، ودعم للبروتوكولات القياسية بما في ذلك SMTP و IMAP و POP3 و CalDAV.

**الشفافية**: جعل كل الكود مفتوح المصدر ومتاحة للفحص، مما يضمن أن المستخدمين يمكنهم التحقق من ادعاءات الخصوصية بدلاً من مجرد الثقة في بيانات التسويق.

**تحكم المستخدم**: تمكين المستخدمين من الخيارات، بما في ذلك القدرة على استضافة المنصة بالكامل بأنفسهم إذا رغبوا.


## الحالة الحالية {#current-status}

حتى مارس 2026، تخدم Forward Email أكثر من 1.6+ million نطاق حول العالم، بما في ذلك منظمات بارزة وقادة صناعيين مثل:

* **شركات التكنولوجيا**: Canonical (Ubuntu)، Netflix Games، مؤسسة Linux، مؤسسة PHP، jQuery، LineageOS
* **المنظمات الإعلامية**: Fox News Radio، Disney Ad Sales
* **المؤسسات التعليمية**: جامعة كامبريدج، جامعة ميريلاند، جامعة واشنطن، جامعة تافتس، كلية Swarthmore
* **الجهات الحكومية**: حكومة جنوب أستراليا، حكومة جمهورية الدومينيكان
* **منظمات أخرى**: RCD Hotels، Fly<span>.</span>io
* **مطورون بارزون**: Isaac Z. Schlueter (مُنشئ npm)، David Heinemeier Hansson (مُنشئ Ruby on Rails)

تستمر المنصة في التطور مع إصدارات ميزات منتظمة وتحسينات في البنية التحتية، محافظة على مكانتها كخدمة البريد الإلكتروني الوحيدة 100% مفتوحة المصدر، مشفرة، تركز على الخصوصية، شفافة، ومقاومة للحوسبة الكمومية المتاحة اليوم.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
