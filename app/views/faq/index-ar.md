# الأسئلة المتكررة {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="الأسئلة المتكررة حول خدمة إعادة توجيه البريد الإلكتروني" class="rounded-lg" />


## جدول المحتويات {#table-of-contents}

* [البدء السريع](#quick-start)
* [مقدمة](#introduction)
  * [ما هي خدمة إعادة توجيه البريد الإلكتروني](#what-is-forward-email)
  * [من يستخدم خدمة إعادة توجيه البريد الإلكتروني](#who-uses-forward-email)
  * [ما هو تاريخ خدمة إعادة توجيه البريد الإلكتروني](#what-is-forward-emails-history)
  * [ما مدى سرعة هذه الخدمة](#how-fast-is-this-service)
* [عملاء البريد الإلكتروني](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [الأجهزة المحمولة](#mobile-devices)
  * [تكوين Sendmail SMTP Relay](#sendmail-smtp-relay-configuration)
  * [تكوين Exim4 SMTP Relay](#exim4-smtp-relay-configuration)
  * [تكوين عميل msmtp SMTP](#msmtp-smtp-client-configuration)
  * [عملاء البريد الإلكتروني عبر سطر الأوامر](#command-line-email-clients)
  * [تكوين البريد الإلكتروني على ويندوز](#windows-email-configuration)
  * [تكوين Postfix SMTP Relay](#postfix-smtp-relay-configuration)
  * [كيفية إرسال البريد كـ باستخدام Gmail](#how-to-send-mail-as-using-gmail)
  * [ما هو الدليل المجاني القديم لإرسال البريد كـ باستخدام Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [تكوين التوجيه المتقدم في Gmail](#advanced-gmail-routing-configuration)
  * [تكوين التوجيه المتقدم في Outlook](#advanced-outlook-routing-configuration)
* [استكشاف الأخطاء وإصلاحها](#troubleshooting)
  * [لماذا لا أتلقى رسائل البريد الإلكتروني التجريبية](#why-am-i-not-receiving-my-test-emails)
  * [كيف أُعد عميل البريد الإلكتروني للعمل مع خدمة إعادة توجيه البريد الإلكتروني](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [لماذا تصل رسائل بريدي الإلكتروني إلى البريد المزعج والغير هام وكيف يمكنني التحقق من سمعة نطاقي](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [ماذا أفعل إذا تلقيت رسائل بريد مزعجة](#what-should-i-do-if-i-receive-spam-emails)
  * [لماذا تظهر رسائل البريد التجريبية المرسلة إلى نفسي في Gmail على أنها "مريبة"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [هل يمكنني إزالة عبارة via forwardemail dot net في Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [إدارة البيانات](#data-management)
  * [أين تقع خوادمكم](#where-are-your-servers-located)
  * [كيف أصدر نسخة احتياطية من صندوق بريدي](#how-do-i-export-and-backup-my-mailbox)
  * [كيف أستورد وأهاجر صندوق بريدي الحالي](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [كيف أستخدم تخزين S3 متوافق خاص بي للنسخ الاحتياطية](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [كيف أحول نسخ SQLite الاحتياطية إلى ملفات EML](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [هل تدعمون الاستضافة الذاتية](#do-you-support-self-hosting)
* [تكوين البريد الإلكتروني](#email-configuration)
  * [كيف أبدأ وأُعد إعادة توجيه البريد الإلكتروني](#how-do-i-get-started-and-set-up-email-forwarding)
  * [هل يمكنني استخدام عدة خوادم تبادل MX وإعادة توجيه متقدمة](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [كيف أُعد رد تلقائي للعطلة (الرد الآلي خارج المكتب)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [كيف أُعد SPF لخدمة إعادة توجيه البريد الإلكتروني](#how-do-i-set-up-spf-for-forward-email)
  * [كيف أُعد DKIM لخدمة إعادة توجيه البريد الإلكتروني](#how-do-i-set-up-dkim-for-forward-email)
  * [كيف أُعد DMARC لخدمة إعادة توجيه البريد الإلكتروني](#how-do-i-set-up-dmarc-for-forward-email)
  * [كيف أطلع على تقارير DMARC](#how-do-i-view-dmarc-reports)
  * [كيف أوصل وأُعد جهات الاتصال الخاصة بي](#how-do-i-connect-and-configure-my-contacts)
  * [كيف أوصل وأُعد التقويمات الخاصة بي](#how-do-i-connect-and-configure-my-calendars)
  * [كيف أضيف تقاويم أكثر وأدير التقويمات الحالية](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [كيف أوصل وأُعد المهام والتذكيرات](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [لماذا لا أستطيع إنشاء مهام في تذكيرات macOS](#why-cant-i-create-tasks-in-macos-reminders)
  * [كيف أُعد Tasks.org على أندرويد](#how-do-i-set-up-tasksorg-on-android)
  * [كيف أُعد SRS لخدمة إعادة توجيه البريد الإلكتروني](#how-do-i-set-up-srs-for-forward-email)
  * [كيف أُعد MTA-STS لخدمة إعادة توجيه البريد الإلكتروني](#how-do-i-set-up-mta-sts-for-forward-email)
  * [كيف أضيف صورة ملف شخصي إلى عنوان بريدي الإلكتروني](#how-do-i-add-a-profile-picture-to-my-email-address)
* [الميزات المتقدمة](#advanced-features)
  * [هل تدعمون النشرات الإخبارية أو قوائم البريد للتسويق](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [هل تدعمون إرسال البريد الإلكتروني عبر API](#do-you-support-sending-email-with-api)
  * [هل تدعمون استقبال البريد الإلكتروني عبر IMAP](#do-you-support-receiving-email-with-imap)
  * [هل تدعمون POP3](#do-you-support-pop3)
  * [هل تدعمون التقاويم (CalDAV)](#do-you-support-calendars-caldav)
  * [هل تدعمون المهام والتذكيرات (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [هل تدعمون جهات الاتصال (CardDAV)](#do-you-support-contacts-carddav)
  * [هل تدعمون إرسال البريد الإلكتروني عبر SMTP](#do-you-support-sending-email-with-smtp)
  * [هل تدعمون OpenPGP/MIME، التشفير من طرف إلى طرف ("E2EE")، ودليل المفاتيح على الويب ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [هل تدعمون تشفير S/MIME](#do-you-support-smime-encryption)
  * [هل تدعمون تصفية البريد الإلكتروني باستخدام Sieve](#do-you-support-sieve-email-filtering)
  * [هل تدعمون MTA-STS](#do-you-support-mta-sts)
  * [هل تدعمون مفاتيح المرور وWebAuthn](#do-you-support-passkeys-and-webauthn)
  * [هل تدعمون أفضل ممارسات البريد الإلكتروني](#do-you-support-email-best-practices)
  * [هل تدعمون webhooks للارتداد](#do-you-support-bounce-webhooks)
  * [هل تدعمون webhooks](#do-you-support-webhooks)
  * [هل تدعمون التعبيرات النمطية أو regex](#do-you-support-regular-expressions-or-regex)
  * [ما هي حدود SMTP الصادرة لديكم](#what-are-your-outbound-smtp-limits)
  * [هل أحتاج إلى موافقة لتمكين SMTP](#do-i-need-approval-to-enable-smtp)
  * [ما هي إعدادات تكوين خادم SMTP لديكم](#what-are-your-smtp-server-configuration-settings)
  * [ما هي إعدادات تكوين خادم IMAP لديكم](#what-are-your-imap-server-configuration-settings)
  * [ما هي إعدادات تكوين خادم POP3 لديكم](#what-are-your-pop3-server-configuration-settings)
  * [كيف أُعد اكتشاف البريد الإلكتروني التلقائي لنطاقي](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [الأمان](#security-1)
  * [تقنيات تعزيز أمان الخادم المتقدمة](#advanced-server-hardening-techniques)
  * [هل لديكم شهادات SOC 2 أو ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [هل تستخدمون تشفير TLS لإعادة توجيه البريد الإلكتروني](#do-you-use-tls-encryption-for-email-forwarding)
  * [هل تحتفظون برؤوس مصادقة البريد الإلكتروني](#do-you-preserve-email-authentication-headers)
  * [هل تحتفظون بالرؤوس الأصلية للبريد الإلكتروني وتمنعون التزوير](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [كيف تحمون من البريد المزعج والإساءة](#how-do-you-protect-against-spam-and-abuse)
  * [هل تخزنون محتوى البريد الإلكتروني على القرص](#do-you-store-email-content-on-disk)
  * [هل يمكن أن يتعرض محتوى البريد الإلكتروني للكشف أثناء تعطل النظام](#can-email-content-be-exposed-during-system-crashes)
  * [من لديه حق الوصول إلى بنية البريد الإلكتروني الخاصة بكم](#who-has-access-to-your-email-infrastructure)
  * [ما هي مزودات البنية التحتية التي تستخدمونها](#what-infrastructure-providers-do-you-use)
  * [هل تقدمون اتفاقية معالجة البيانات (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [كيف تتعاملون مع إشعارات خروقات البيانات](#how-do-you-handle-data-breach-notifications)
  * [هل تقدمون بيئة اختبار](#do-you-offer-a-test-environment)
  * [هل توفرون أدوات المراقبة والتنبيه](#do-you-provide-monitoring-and-alerting-tools)
  * [كيف تضمنون التوفر العالي](#how-do-you-ensure-high-availability)
  * [هل تلتزمون بالقسم 889 من قانون تفويض الدفاع الوطني (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [تفاصيل النظام والتقنية](#system-and-technical-details)
  * [هل تخزنون الرسائل ومحتوياتها](#do-you-store-emails-and-their-contents)
  * [كيف يعمل نظام إعادة توجيه البريد الإلكتروني لديكم](#how-does-your-email-forwarding-system-work)
  * [كيف تعالجون البريد الإلكتروني لإعادة التوجيه](#how-do-you-process-an-email-for-forwarding)
  * [كيف تتعاملون مع مشاكل تسليم البريد الإلكتروني](#how-do-you-handle-email-delivery-issues)
  * [كيف تتعاملون مع حظر عناوين IP الخاصة بكم](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [ما هي عناوين البريد الإلكتروني الخاصة بمدير البريد (postmaster)](#what-are-postmaster-addresses)
  * [ما هي عناوين البريد الإلكتروني "لا ترد" (no-reply)](#what-are-no-reply-addresses)
  * [ما هي عناوين IP الخاصة بخوادمكم](#what-are-your-servers-ip-addresses)
  * [هل لديكم قائمة سماح](#do-you-have-an-allowlist)
  * [ما هي امتدادات أسماء النطاقات المسموح بها افتراضياً](#what-domain-name-extensions-are-allowlisted-by-default)
  * [ما هي معايير قائمة السماح لديكم](#what-is-your-allowlist-criteria)
  * [ما هي امتدادات أسماء النطاقات التي يمكن استخدامها مجاناً](#what-domain-name-extensions-can-be-used-for-free)
  * [هل لديكم قائمة رمادية](#do-you-have-a-greylist)
  * [هل لديكم قائمة حظر](#do-you-have-a-denylist)
  * [هل لديكم تحديد معدل](#do-you-have-rate-limiting)
  * [كيف تحمون من الارتداد العكسي (backscatter)](#how-do-you-protect-against-backscatter)
  * [منع الارتدادات من مرسلي البريد المزعج المعروفين](#prevent-bounces-from-known-mail-from-spammers)
  * [منع الارتدادات غير الضرورية للحماية من الارتداد العكسي](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [كيف تحددون بصمة البريد الإلكتروني](#how-do-you-determine-an-email-fingerprint)
  * [هل يمكنني إعادة توجيه البريد إلى منافذ غير 25 (مثلاً إذا كان مزود الإنترنت قد حظر المنفذ 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [هل يدعم الرمز + لأسماء مستعارة في Gmail](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [هل يدعم النطاقات الفرعية](#does-it-support-sub-domains)
  * [هل يعيد توجيه رؤوس بريدي الإلكتروني](#does-this-forward-my-emails-headers)
  * [هل تم اختباره جيداً](#is-this-well-tested)
  * [هل تمررون رسائل واستجابات SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [كيف تمنعون المرسلين المزعجين وتضمنون سمعة جيدة لإعادة توجيه البريد الإلكتروني](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [كيف تقومون بعمليات بحث DNS على أسماء النطاقات](#how-do-you-perform-dns-lookups-on-domain-names)
* [الحساب والفوترة](#account-and-billing)
  * [هل تقدمون ضمان استرداد المال على الخطط المدفوعة](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [إذا قمت بتغيير الخطة هل تقومون بالتسعير النسبي ورد الفرق](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [هل يمكنني استخدام خدمة إعادة توجيه البريد هذه كخادم MX "احتياطي" أو "تبديل تلقائي"](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [هل يمكنني تعطيل أسماء مستعارة محددة](#can-i-disable-specific-aliases)
  * [هل يمكنني إعادة توجيه البريد إلى عدة مستلمين](#can-i-forward-emails-to-multiple-recipients)
  * [هل يمكنني وجود عدة مستلمين شاملين عالميين](#can-i-have-multiple-global-catch-all-recipients)
  * [هل هناك حد أقصى لعدد عناوين البريد التي يمكنني إعادة توجيهها لكل اسم مستعار](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [هل يمكنني إعادة توجيه البريد بشكل متكرر](#can-i-recursively-forward-emails)
  * [هل يمكن للناس إلغاء تسجيل أو تسجيل إعادة توجيه بريدي الإلكتروني بدون إذني](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [كيف هي مجانية](#how-is-it-free)
  * [ما هو الحد الأقصى لحجم البريد الإلكتروني](#what-is-the-max-email-size-limit)
  * [هل تخزنون سجلات البريد الإلكتروني](#do-you-store-logs-of-emails)
  * [هل تخزنون سجلات الأخطاء](#do-you-store-error-logs)
  * [هل تقرأون بريدي الإلكتروني](#do-you-read-my-emails)
  * [هل يمكنني "إرسال البريد كـ" في Gmail باستخدام هذه الخدمة](#can-i-send-mail-as-in-gmail-with-this)
  * [هل يمكنني "إرسال البريد كـ" في Outlook باستخدام هذه الخدمة](#can-i-send-mail-as-in-outlook-with-this)
  * [هل يمكنني "إرسال البريد كـ" في Apple Mail و iCloud Mail باستخدام هذه الخدمة](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [هل يمكنني إعادة توجيه عدد غير محدود من الرسائل باستخدام هذه الخدمة](#can-i-forward-unlimited-emails-with-this)
  * [هل تقدمون نطاقات غير محدودة بسعر واحد](#do-you-offer-unlimited-domains-for-one-price)
  * [ما هي طرق الدفع التي تقبلونها](#which-payment-methods-do-you-accept)
* [الموارد الإضافية](#additional-resources)
## بداية سريعة {#quick-start}

للبدء مع Forward Email:

1. **أنشئ حسابًا** على [forwardemail.net/register](https://forwardemail.net/register)

2. **أضف وحقق من نطاقك** تحت [حسابي → النطاقات](/my-account/domains)

3. **أضف وقم بتكوين الأسماء المستعارة/صناديق البريد الإلكتروني** تحت [حسابي → النطاقات](/my-account/domains) → الأسماء المستعارة

4. **اختبر إعدادك** عن طريق إرسال بريد إلكتروني إلى أحد الأسماء المستعارة الجديدة الخاصة بك

> \[!TIP]
> قد تستغرق تغييرات DNS ما يصل إلى 24-48 ساعة للانتشار عالميًا، على الرغم من أنها غالبًا ما تأخذ مفعولًا في وقت أقرب بكثير.

> \[!IMPORTANT]
> لتعزيز إمكانية التسليم، نوصي بإعداد سجلات [SPF](#how-do-i-set-up-spf-for-forward-email)، و[DKIM](#how-do-i-set-up-dkim-for-forward-email)، و[DMARC](#how-do-i-set-up-dmarc-for-forward-email).


## مقدمة {#introduction}

### ما هو Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email مثالي للأفراد، والشركات الصغيرة، والمطورين الذين يرغبون في عناوين بريد إلكتروني احترافية دون تكلفة وصيانة حل استضافة بريد إلكتروني كامل.

Forward Email هو **مزود خدمة بريد إلكتروني متكامل الميزات** و**مزود استضافة بريد إلكتروني لأسماء النطاقات المخصصة**.

إنه الخدمة الوحيدة المجانية والمفتوحة المصدر، ويتيح لك استخدام عناوين بريد إلكتروني بنطاق مخصص دون تعقيد إعداد وصيانة خادم البريد الإلكتروني الخاص بك.

تقوم خدمتنا بإعادة توجيه الرسائل الإلكترونية المرسلة إلى نطاقك المخصص إلى حساب بريدك الإلكتروني الحالي – ويمكنك حتى استخدامنا كمزود استضافة بريد إلكتروني مخصص لك.

الميزات الرئيسية لـ Forward Email:

* **بريد إلكتروني بنطاق مخصص**: استخدم عناوين بريد إلكتروني احترافية مع اسم نطاقك الخاص
* **الخطة المجانية**: إعادة توجيه البريد الإلكتروني الأساسية بدون تكلفة
* **خصوصية محسنة**: نحن لا نقرأ رسائلك الإلكترونية ولا نبيع بياناتك
* **مفتوح المصدر**: كامل قاعدة الشيفرة الخاصة بنا متاحة على GitHub
* **دعم SMTP وIMAP وPOP3**: قدرات كاملة لإرسال واستقبال البريد الإلكتروني
* **تشفير من النهاية إلى النهاية**: دعم OpenPGP/MIME
* **أسماء مستعارة مخصصة شاملة**: أنشئ عددًا غير محدود من الأسماء المستعارة للبريد الإلكتروني

يمكنك مقارنتنا مع أكثر من 56 مزود خدمة بريد إلكتروني آخر على [صفحة مقارنة البريد الإلكتروني الخاصة بنا](/blog/best-email-service).

> \[!TIP]
> تعرّف أكثر على Forward Email بقراءة [الورقة التقنية المجانية](/technical-whitepaper.pdf)

### من يستخدم Forward Email {#who-uses-forward-email}

نحن نوفر خدمة استضافة البريد الإلكتروني وإعادة توجيه البريد الإلكتروني لأكثر من 1.6 مليون نطاق وهؤلاء المستخدمين البارزين:

| العميل                                  | دراسة حالة                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| الأكاديمية البحرية الأمريكية            | [:page_facing_up: دراسة حالة](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                                | [:page_facing_up: دراسة حالة](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                            |                                                                                                          |
| مؤسسة لينكس                             | [:page_facing_up: دراسة حالة](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| مؤسسة PHP                               |                                                                                                          |
| فوكس نيوز راديو                         |                                                                                                          |
| مبيعات إعلانات ديزني                   |                                                                                                          |
| jQuery                                   | [:page_facing_up: دراسة حالة](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                                |                                                                                                          |
| أوبونتو                                 | [:page_facing_up: دراسة حالة](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| كوبونتو                                 | [:page_facing_up: دراسة حالة](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| لوبونتو                                 | [:page_facing_up: دراسة حالة](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| جامعة كامبريدج                         | [:page_facing_up: دراسة حالة](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| جامعة ميريلاند                         | [:page_facing_up: دراسة حالة](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| جامعة واشنطن                           | [:page_facing_up: دراسة حالة](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| جامعة تافتس                            | [:page_facing_up: دراسة حالة](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| كلية سوارثمور                         | [:page_facing_up: دراسة حالة](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| حكومة جنوب أستراليا                   |                                                                                                          |
| حكومة جمهورية الدومينيكان             |                                                                                                          |
| Fly<span>.</span>io                      |                                                                                                          |
| فنادق RCD                              |                                                                                                          |
| إسحاق ز. شلوتر (npm)                   | [:page_facing_up: دراسة حالة](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| ديفيد هاينماير هانسون (روبي أون ريلز) |                                                                                                          |
### ما هو تاريخ Forward Email {#what-is-forward-emails-history}

يمكنك معرفة المزيد عن Forward Email على [صفحة من نحن](/about).

### ما مدى سرعة هذه الخدمة {#how-fast-is-this-service}

> \[!NOTE]
> نظامنا مصمم للسرعة والموثوقية، مع عدة خوادم احتياطية لضمان تسليم رسائلك الإلكترونية بسرعة.

يقوم Forward Email بتسليم الرسائل بأقل تأخير، عادةً خلال ثوانٍ من الاستلام.

مقاييس الأداء:

* **متوسط وقت التسليم**: أقل من 5-10 ثوانٍ من الاستلام إلى الإعادة ([انظر صفحة مراقبة وقت الوصول إلى البريد "TTI"](/tti))
* **مدة التشغيل**: توفر الخدمة بنسبة 99.9%+
* **البنية التحتية العالمية**: خوادم موزعة استراتيجياً لتحقيق التوجيه الأمثل
* **التوسع التلقائي**: نظامنا يتوسع خلال فترات الذروة في البريد الإلكتروني

نحن نعمل في الوقت الحقيقي، على عكس مزودي الخدمة الآخرين الذين يعتمدون على قوائم انتظار مؤجلة.

لا نقوم بالكتابة على القرص أو تخزين السجلات – مع [استثناء الأخطاء](#do-you-store-error-logs) و [SMTP الصادر](#do-you-support-sending-email-with-smtp) (انظر [سياسة الخصوصية](/privacy)).

كل شيء يتم في الذاكرة و [رمز المصدر الخاص بنا على GitHub](https://github.com/forwardemail).


## عملاء البريد الإلكتروني {#email-clients}

### Thunderbird {#thunderbird}

1. أنشئ اسم مستعار جديد وولّد كلمة مرور في لوحة تحكم Forward Email الخاصة بك
2. افتح Thunderbird واذهب إلى **تحرير → إعدادات الحساب → إجراءات الحساب → إضافة حساب بريد**
3. أدخل اسمك، عنوان Forward Email، وكلمة المرور
4. انقر على **الإعداد اليدوي** وأدخل:
   * الوارد: IMAP، `imap.forwardemail.net`، المنفذ 993، SSL/TLS
   * الصادر: SMTP، `smtp.forwardemail.net`، المنفذ 465، SSL/TLS (موصى به؛ المنفذ 587 مع STARTTLS مدعوم أيضاً)
5. انقر على **تم**

### Microsoft Outlook {#microsoft-outlook}

1. أنشئ اسم مستعار جديد وولّد كلمة مرور في لوحة تحكم Forward Email الخاصة بك
2. اذهب إلى **ملف → إضافة حساب**
3. أدخل عنوان Forward Email الخاص بك وانقر على **اتصال**
4. اختر **خيارات متقدمة** وحدد **دعني أعد حسابي يدوياً**
5. اختر **IMAP** وأدخل:
   * الوارد: `imap.forwardemail.net`، المنفذ 993، SSL
   * الصادر: `smtp.forwardemail.net`، المنفذ 465، SSL/TLS (موصى به؛ المنفذ 587 مع STARTTLS مدعوم أيضاً)
   * اسم المستخدم: عنوان بريدك الإلكتروني الكامل
   * كلمة المرور: كلمة المرور التي ولّدتها
6. انقر على **اتصال**

### Apple Mail {#apple-mail}

1. أنشئ اسم مستعار جديد وولّد كلمة مرور في لوحة تحكم Forward Email الخاصة بك
2. اذهب إلى **البريد → التفضيلات → الحسابات → +**
3. اختر **حساب بريد آخر**
4. أدخل اسمك، عنوان Forward Email، وكلمة المرور
5. لإعدادات الخادم، أدخل:
   * الوارد: `imap.forwardemail.net`
   * الصادر: `smtp.forwardemail.net`
   * اسم المستخدم: عنوان بريدك الإلكتروني الكامل
   * كلمة المرور: كلمة المرور التي ولّدتها
6. انقر على **تسجيل الدخول**

### eM Client {#em-client}

1. أنشئ اسم مستعار جديد وولّد كلمة مرور في لوحة تحكم Forward Email الخاصة بك
2. افتح eM Client واذهب إلى **القائمة → الحسابات → + إضافة حساب**
3. انقر على **البريد** ثم اختر **آخر**
4. أدخل عنوان Forward Email الخاص بك وانقر على **التالي**
5. أدخل إعدادات الخادم التالية:
   * **خادم الوارد**: `imap.forwardemail.net`
   * **خادم الصادر**: `smtp.forwardemail.net`
6. أدخل عنوان بريدك الإلكتروني الكامل كـ **اسم المستخدم** وكلمة المرور التي ولّدتها كـ **كلمة المرور** لكل من خوادم الوارد والصادر.
7. سيختبر eM Client الاتصال. بمجرد النجاح، انقر على **التالي**.
8. أدخل اسمك واختر اسم الحساب.
9. انقر على **إنهاء**.

### الأجهزة المحمولة {#mobile-devices}

لنظام iOS:

1. اذهب إلى **الإعدادات → البريد → الحسابات → إضافة حساب → آخر**
2. اضغط على **إضافة حساب بريد** وأدخل بياناتك
3. لإعدادات الخادم، استخدم نفس إعدادات IMAP و SMTP المذكورة أعلاه

لنظام Android:

1. اذهب إلى **الإعدادات → الحسابات → إضافة حساب → شخصي (IMAP)**
2. أدخل عنوان Forward Email وكلمة المرور
3. لإعدادات الخادم، استخدم نفس إعدادات IMAP و SMTP المذكورة أعلاه

### إعداد ترحيل SMTP لـ Sendmail {#sendmail-smtp-relay-configuration}

يمكنك تكوين Sendmail لترحيل الرسائل عبر خوادم SMTP الخاصة بـ Forward Email. هذا إعداد شائع للأنظمة القديمة أو التطبيقات التي تعتمد على Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">الوقت المقدر للإعداد:</strong>
  <span>أقل من 20 دقيقة</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    هذا يتطلب خطة مدفوعة مع تمكين الوصول إلى SMTP.
  </span>
</div>

#### التكوين {#configuration}

1. حرر ملف `sendmail.mc` الخاص بك، الموجود عادة في `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. أضف الأسطر التالية لتعريف المضيف الذكي والمصادقة:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. أنشئ ملف المصادقة `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. أضف بيانات اعتماد Forward Email إلى ملف `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. أنشئ قاعدة بيانات المصادقة وأمّن الملفات:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. أعد بناء تكوين Sendmail وأعد تشغيل الخدمة:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### الاختبار {#testing}

أرسل بريدًا إلكترونيًا تجريبيًا للتحقق من التكوين:

```bash
echo "Test email from Sendmail" | mail -s "اختبار Sendmail" recipient@example.com
```

### تكوين ترحيل SMTP لـ Exim4 {#exim4-smtp-relay-configuration}

Exim4 هو MTA شائع على أنظمة ديبيان. يمكنك تكوينه لاستخدام Forward Email كمضيف ذكي.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">الوقت المقدر للإعداد:</strong>
  <span>أقل من 15 دقيقة</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    هذا يتطلب خطة مدفوعة مع تمكين الوصول إلى SMTP.
  </span>
</div>

#### التكوين {#configuration-1}

1. شغّل أداة تكوين Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. اختر الخيارات التالية:
   * **النوع العام لتكوين البريد:** البريد المرسل عبر smarthost؛ المستلم عبر SMTP أو fetchmail
   * **اسم بريد النظام:** your.hostname
   * **عناوين IP للاستماع لاتصالات SMTP الواردة:** 127.0.0.1 ; ::1
   * **وجهات أخرى يتم قبول البريد لها:** (اتركها فارغة)
   * **النطاقات التي يتم ترحيل البريد لها:** (اتركها فارغة)
   * **عنوان IP أو اسم المضيف للمضيف الذكي الصادر:** smtp.forwardemail.net::465
   * **إخفاء اسم البريد المحلي في البريد الصادر؟** لا
   * **الحفاظ على الحد الأدنى من استعلامات DNS (الاتصال عند الطلب)؟** لا
   * **طريقة تسليم البريد المحلي:** تنسيق Mbox في /var/mail/
   * **تقسيم التكوين إلى ملفات صغيرة؟** لا

3. حرر ملف `passwd.client` لإضافة بيانات اعتمادك:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. أضف السطر التالي:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. حدّث التكوين وأعد تشغيل Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### الاختبار {#testing-1}

أرسل بريدًا إلكترونيًا تجريبيًا:

```bash
echo "Test from Exim4" | mail -s "اختبار Exim4" recipient@example.com
```

### تكوين عميل SMTP msmtp {#msmtp-smtp-client-configuration}

msmtp هو عميل SMTP خفيف الوزن مفيد لإرسال البريد الإلكتروني من السكريبتات أو تطبيقات سطر الأوامر.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">الوقت المقدر للإعداد:</strong>
  <span>أقل من 10 دقائق</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    هذا يتطلب خطة مدفوعة مع تمكين الوصول إلى SMTP.
  </span>
</div>

#### التهيئة {#configuration-2}

1. أنشئ أو حرر ملف تهيئة msmtp في `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. أضف التهيئة التالية:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. اضبط الأذونات الصحيحة لملف التهيئة:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### الاختبار {#testing-2}

أرسل بريدًا إلكترونيًا تجريبيًا:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### عملاء البريد الإلكتروني عبر سطر الأوامر {#command-line-email-clients}

يمكن تكوين عملاء البريد الإلكتروني الشائعين عبر سطر الأوامر مثل [Mutt](https://gitlab.com/muttmua/mutt)، [NeoMutt](https://neomutt.org)، و [Alpine](https://alpine.x10.mx/alpine/release/) لاستخدام خوادم SMTP الخاصة بـ Forward Email لإرسال البريد. ستكون التهيئة مشابهة لإعداد `msmtp`، حيث تقدم تفاصيل خادم SMTP وبيانات اعتمادك في ملفات التهيئة الخاصة بكل منهم (`.muttrc`، `.neomuttrc`، أو `.pinerc`).

### تهيئة البريد الإلكتروني على ويندوز {#windows-email-configuration}

لمستخدمي ويندوز، يمكنك تكوين عملاء البريد الإلكتروني الشائعين مثل **Microsoft Outlook** و **eM Client** باستخدام إعدادات IMAP و SMTP المقدمة في حساب Forward Email الخاص بك. للاستخدام عبر سطر الأوامر أو السكربتات، يمكنك استخدام الأمر `Send-MailMessage` في PowerShell (رغم أنه يعتبر قديمًا) أو أداة ترحيل SMTP خفيفة مثل [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### تهيئة ترحيل SMTP لـ Postfix {#postfix-smtp-relay-configuration}

يمكنك تكوين Postfix لترحيل الرسائل عبر خوادم SMTP الخاصة بـ Forward Email. هذا مفيد لتطبيقات الخادم التي تحتاج إلى إرسال رسائل بريد إلكتروني.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">الوقت المقدر للإعداد:</strong>
  <span>أقل من 15 دقيقة</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    هذا يتطلب خطة مدفوعة مع تمكين الوصول إلى SMTP.
  </span>
</div>

#### التثبيت {#installation}

1. ثبّت Postfix على خادمك:

```bash
# أوبونتو/ديبيان
sudo apt update && sudo apt install postfix

# سنتوس/آر إتش إي إل
sudo yum install postfix

# ماك أو إس
brew install postfix
```

2. أثناء التثبيت، اختر "Internet Site" عند طلب نوع التهيئة.

#### التهيئة {#configuration-3}

1. حرر ملف التهيئة الرئيسي لـ Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. أضف أو عدّل هذه الإعدادات:

```
# تهيئة ترحيل SMTP
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. أنشئ ملف كلمة مرور SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. أضف بيانات اعتماد Forward Email الخاصة بك:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. أَمّن وهاش ملف كلمة المرور:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. أعد تشغيل Postfix:

```bash
sudo systemctl restart postfix
```

#### الاختبار {#testing-3}

اختبر تهيئتك بإرسال بريد إلكتروني تجريبي:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### كيفية إرسال البريد كـ باستخدام Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">الوقت المقدر للإعداد:</strong>
  <span>أقل من 10 دقائق</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    البدء:
  </strong>
  <span>
    إذا كنت قد اتبعت التعليمات أعلاه تحت <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">كيف أبدأ وأعد توجيه البريد الإلكتروني</a>، فيمكنك متابعة القراءة أدناه.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    يرجى التأكد من قراءة <a href="/terms" class="alert-link" target="_blank">الشروط</a>، <a href="/privacy" class="alert-link" target="_blank">سياسة الخصوصية</a>، و <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">حدود SMTP الصادرة</a> – يُعتبر استخدامك بمثابة إقرار وموافقة.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    إذا كنت مطورًا، فراجع <a class="alert-link" href="/email-api#outbound-emails" target="_blank">توثيق API البريد الإلكتروني</a> الخاص بنا.
  </span>
</div>

1. اذهب إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> تكوين SMTP الصادر واتبع تعليمات الإعداد

2. أنشئ اسم مستعار جديد لنطاقك تحت <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثلاً <code><hello@example.com></code>)

3. انقر على <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> بجانب الاسم المستعار الذي أنشأته حديثًا. انسخها إلى الحافظة واحتفظ بكلمة المرور التي تم إنشاؤها بأمان كما تظهر على الشاشة.

4. اذهب إلى [Gmail](https://gmail.com) وتحت [الإعدادات <i class="fa fa-angle-right"></i> الحسابات والاستيراد <i class="fa fa-angle-right"></i> إرسال البريد كـ](https://mail.google.com/mail/u/0/#settings/accounts)، انقر على "إضافة عنوان بريد إلكتروني آخر"

5. عند طلب "الاسم"، أدخل الاسم الذي تريد أن يظهر به بريدك الإلكتروني كـ "من" (مثلاً "لينوس تورفالدس").

6. عند طلب "عنوان البريد الإلكتروني"، أدخل عنوان البريد الإلكتروني الكامل لاسم مستعار أنشأته تحت <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثلاً <code><hello@example.com></code>)

7. قم بإلغاء تحديد "اعتباره اسمًا مستعارًا"

8. انقر على "الخطوة التالية" للمتابعة

9. عند طلب "خادم SMTP"، أدخل <code>smtp.forwardemail.net</code> وغيّر المنفذ إلى <code>465</code>

10. عند طلب "اسم المستخدم"، أدخل عنوان البريد الإلكتروني الكامل لاسم مستعار أنشأته تحت <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثلاً <code><hello@example.com></code>)

11. عند طلب "كلمة المرور"، الصق كلمة المرور من <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> في الخطوة 3 أعلاه

12. اختر زر الاختيار لـ "اتصال آمن باستخدام SSL"

13. انقر على "إضافة حساب" للمتابعة

14. افتح تبويبًا جديدًا إلى [Gmail](https://gmail.com) وانتظر وصول رسالة التحقق الخاصة بك (ستتلقى رمز تحقق يؤكد أنك مالك عنوان البريد الإلكتروني الذي تحاول "إرسال البريد كـ")

15. بمجرد وصولها، انسخ والصق رمز التحقق في المطالبة التي تلقيتها في الخطوة السابقة
16. بمجرد الانتهاء من ذلك، عد إلى البريد الإلكتروني وانقر على الرابط لـ "تأكيد الطلب". من المرجح أن تحتاج إلى تنفيذ هذه الخطوة والخطوة السابقة لكي يتم تكوين البريد الإلكتروني بشكل صحيح.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      تهانينا!
    </strong>
    <span>
      لقد أكملت جميع الخطوات بنجاح.
    </span>
  </div>
</div>

</div>

### ما هو الدليل الخالي من التراث لإرسال البريد كـ باستخدام Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">مهم:</strong> هذا الدليل الخالي من التراث مهجور اعتبارًا من مايو 2023 لأن <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">نحن الآن ندعم SMTP الصادر</a>. إذا استخدمت الدليل أدناه، فإن <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">هذا سيجعل بريدك الصادر</a> يظهر "<span class="notranslate text-danger font-weight-bold">عبر forwardemail dot net</span>" في Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">الوقت المقدر للإعداد:</strong>
  <span>أقل من 10 دقائق</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    البدء:
  </strong>
  <span>
    إذا كنت قد اتبعت التعليمات أعلاه تحت <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">كيف أبدأ وأعد توجيه البريد الإلكتروني</a>، فيمكنك متابعة القراءة أدناه.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. تحتاج إلى تمكين [المصادقة الثنائية من Gmail][gmail-2fa] لكي يعمل هذا. قم بزيارة <https://www.google.com/landing/2step/> إذا لم تكن مفعلة.

2. بمجرد تمكين المصادقة الثنائية (أو إذا كانت مفعلة بالفعل)، قم بزيارة <https://myaccount.google.com/apppasswords>.

3. عند المطالبة بـ "حدد التطبيق والجهاز الذي تريد إنشاء كلمة مرور التطبيق له":
   * اختر "البريد" من القائمة المنسدلة لـ "حدد التطبيق"
   * اختر "آخر" من القائمة المنسدلة لـ "حدد الجهاز"
   * عند المطالبة بإدخال نص، أدخل عنوان البريد الإلكتروني الخاص بنطاقك المخصص الذي تقوم بإعادة التوجيه منه (مثلاً <code><hello@example.com></code> - هذا سيساعدك على تتبع الأمر في حال استخدامك هذه الخدمة لعدة حسابات)

4. انسخ كلمة المرور التي تم إنشاؤها تلقائيًا إلى الحافظة الخاصة بك
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       مهم:
     </strong>
     <span>
       إذا كنت تستخدم G Suite، قم بزيارة لوحة الإدارة الخاصة بك <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">التطبيقات <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> إعدادات Gmail <i class="fa fa-angle-right"></i> الإعدادات</a> وتأكد من تحديد "السماح للمستخدمين بإرسال البريد عبر خادم SMTP خارجي...". سيكون هناك بعض التأخير لتفعيل هذا التغيير، لذا يرجى الانتظار لبضع دقائق.
     </span>
   </div>

5. اذهب إلى [Gmail](https://gmail.com) وتحت [الإعدادات <i class="fa fa-angle-right"></i> الحسابات والاستيراد <i class="fa fa-angle-right"></i> إرسال البريد كـ](https://mail.google.com/mail/u/0/#settings/accounts)، انقر على "إضافة عنوان بريد إلكتروني آخر"

6. عند المطالبة بـ "الاسم"، أدخل الاسم الذي تريد أن يظهر به بريدك الإلكتروني "من" (مثلاً "لينوس تورفالدس")

7. عند المطالبة بـ "عنوان البريد الإلكتروني"، أدخل عنوان البريد الإلكتروني الخاص بنطاقك المخصص الذي استخدمته أعلاه (مثلاً <code><hello@example.com></code>)
8. قم بإلغاء تحديد "التعامل كاسم مستعار"

9. انقر على "الخطوة التالية" للمتابعة

10. عند المطالبة بـ "خادم SMTP"، أدخل <code>smtp.gmail.com</code> واترك المنفذ كـ <code>587</code>

11. عند المطالبة بـ "اسم المستخدم"، أدخل الجزء من عنوان Gmail الخاص بك بدون جزء <span>gmail.com</span> (مثلاً فقط "user" إذا كان بريدي الإلكتروني هو <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        مهم:
      </strong>
      <span>
        إذا تم تعبئة جزء "اسم المستخدم" تلقائيًا، فستحتاج <u><strong>إلى تغييره</strong></u> إلى جزء اسم المستخدم من عنوان Gmail الخاص بك بدلاً من ذلك.
      </span>
    </div>

12. عند المطالبة بـ "كلمة المرور"، الصق من الحافظة كلمة المرور التي أنشأتها في الخطوة 2 أعلاه

13. اترك زر الاختيار محددًا لـ "اتصال مؤمن باستخدام TLS"

14. انقر على "إضافة حساب" للمتابعة

15. افتح تبويبًا جديدًا إلى [Gmail](https://gmail.com) وانتظر وصول رسالة التحقق الخاصة بك (ستتلقى رمز تحقق يؤكد أنك مالك عنوان البريد الإلكتروني الذي تحاول "الإرسال كـ")

16. بمجرد وصولها، انسخ والصق رمز التحقق في المطالبة التي تلقيتها في الخطوة السابقة

17. بعد ذلك، عد إلى البريد الإلكتروني وانقر على الرابط لـ "تأكيد الطلب". من المرجح أن تحتاج إلى تنفيذ هذه الخطوة والخطوة السابقة لكي يتم تكوين البريد الإلكتروني بشكل صحيح.

</div>

### تكوين التوجيه المتقدم في Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">الوقت المقدر للإعداد:</strong>
  <span>15-30 دقيقة</span>
</div>

إذا كنت تريد إعداد التوجيه المتقدم في Gmail بحيث يتم إعادة توجيه الأسماء المستعارة التي لا تطابق صندوق بريد إلى خوادم البريد الخاصة بـ Forward Email، فاتبع الخطوات التالية:

1. سجّل الدخول إلى وحدة تحكم مسؤول Google الخاصة بك على [admin.google.com](https://admin.google.com)
2. اذهب إلى **التطبيقات → Google Workspace → Gmail → التوجيه**
3. انقر على **إضافة مسار** وقم بتكوين الإعدادات التالية:

**إعدادات المستلم الفردي:**

* اختر "تغيير مستلم الظرف" وأدخل عنوان Gmail الأساسي الخاص بك
* تحقق من "إضافة رأس X-Gm-Original-To مع المستلم الأصلي"

**أنماط مستلم الظرف:**

* أضف نمطًا يطابق جميع صناديق البريد غير الموجودة (مثلاً `.*@yourdomain.com`)

**إعدادات خادم البريد الإلكتروني:**

* اختر "التوجيه إلى المضيف" وأدخل `mx1.forwardemail.net` كخادم أساسي
* أضف `mx2.forwardemail.net` كخادم احتياطي
* اضبط المنفذ على 25
* اختر "طلب TLS" للأمان

4. انقر على **حفظ** لإنشاء المسار

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    هذا التكوين سيعمل فقط لحسابات Google Workspace التي تستخدم نطاقات مخصصة، وليس لحسابات Gmail العادية.
  </span>
</div>

### تكوين التوجيه المتقدم في Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">الوقت المقدر للإعداد:</strong>
  <span>15-30 دقيقة</span>
</div>

لمستخدمي Microsoft 365 (المعروف سابقًا بـ Office 365) الذين يرغبون في إعداد التوجيه المتقدم بحيث يتم إعادة توجيه الأسماء المستعارة التي لا تطابق صندوق بريد إلى خوادم البريد الخاصة بـ Forward Email:

1. سجّل الدخول إلى مركز إدارة Microsoft 365 على [admin.microsoft.com](https://admin.microsoft.com)
2. اذهب إلى **Exchange → تدفق البريد → القواعد**
3. انقر على **إضافة قاعدة** واختر **إنشاء قاعدة جديدة**
4. سمّ القاعدة الخاصة بك (مثلاً "إعادة توجيه صناديق البريد غير الموجودة إلى Forward Email")
5. تحت **تطبيق هذه القاعدة إذا**، اختر:
   * "عنوان المستلم يطابق..."
   * أدخل نمطًا يطابق جميع العناوين في نطاقك (مثلاً `*@yourdomain.com`)
6. تحت **قم بما يلي**، اختر:
   * "إعادة توجيه الرسالة إلى..."
   * اختر "خادم البريد التالي"
   * أدخل `mx1.forwardemail.net` والمنفذ 25
   * أضف `mx2.forwardemail.net` كخادم احتياطي
7. تحت **باستثناء إذا**، اختر:
   * "المستلم هو..."
   * أضف جميع صناديق البريد الموجودة التي لا يجب إعادة توجيهها
8. اضبط أولوية القاعدة لضمان تشغيلها بعد قواعد تدفق البريد الأخرى
9. انقر على **حفظ** لتفعيل القاعدة
## استكشاف الأخطاء وإصلاحها {#troubleshooting}

### لماذا لا أتلقى رسائل الاختبار الخاصة بي {#why-am-i-not-receiving-my-test-emails}

إذا كنت ترسل رسالة اختبار إلى نفسك، فقد لا تظهر في صندوق الوارد لأن لها نفس رأس "Message-ID".

هذه مشكلة معروفة على نطاق واسع، وتؤثر أيضًا على خدمات مثل Gmail.  <a href="https://support.google.com/a/answer/1703601">إليك الإجابة الرسمية من Gmail بخصوص هذه المشكلة</a>.

إذا استمرت المشكلة، فمن المرجح أن تكون مشكلة في انتشار DNS. ستحتاج إلى الانتظار لفترة أطول قليلاً والمحاولة مرة أخرى (أو محاولة تعيين قيمة TTL أقل على سجلات <strong class="notranslate">TXT</strong> الخاصة بك).

**هل لا تزال تواجه مشاكل؟**  يرجى <a href="/help">الاتصال بنا</a> حتى نتمكن من المساعدة في التحقيق في المشكلة وإيجاد حل سريع.

### كيف أقوم بتكوين عميل البريد الإلكتروني الخاص بي للعمل مع Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  تعمل خدمتنا مع عملاء البريد الإلكتروني الشائعين مثل:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> سطح المكتب</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> الطرفية</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  اسم المستخدم هو عنوان البريد الإلكتروني للبديل الخاص بك وكلمة المرور من <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("كلمة المرور العادية").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
  <span>إذا كنت تستخدم Thunderbird، فتأكد من تعيين "أمان الاتصال" إلى "SSL/TLS" وطريقة المصادقة إلى "كلمة المرور العادية".</span>
</div>

| النوع |         اسم المضيف        |         البروتوكول        |                                            المنافذ                                           |
| :--: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **مفضل**  |                                      `993` و `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **موصى به** | `465` و `2465` لـ SSL/TLS (موصى به) أو `587`، `2587`، `2525`، و `25` لـ STARTTLS |

### لماذا تصل رسائلي إلى البريد المزعج والغير هام وكيف يمكنني التحقق من سمعة نطاقي {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
هذا القسم يرشدك إذا كانت رسائلك الصادرة تستخدم خوادم SMTP الخاصة بنا (مثل `smtp.forwardemail.net`) (أو يتم توجيهها عبر `mx1.forwardemail.net` أو `mx2.forwardemail.net`) ويتم تسليمها في مجلد الرسائل المزعجة أو البريد غير الهام للمستلمين.

نحن نراقب بانتظام [عناوين IP الخاصة بنا](#what-are-your-servers-ip-addresses) مقابل [جميع قوائم الحظر الموثوقة لنظام أسماء النطاقات](#how-do-you-handle-your-ip-addresses-becoming-blocked)، **لذلك من المرجح أن تكون المشكلة متعلقة بسمعة النطاق بشكل خاص**.

يمكن أن تصل الرسائل إلى مجلدات الرسائل المزعجة لأسباب عدة:

1. **عدم وجود التوثيق**: قم بإعداد سجلات [SPF](#how-do-i-set-up-spf-for-forward-email)، و[DKIM](#how-do-i-set-up-dkim-for-forward-email)، و[DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **سمعة النطاق**: غالبًا ما تكون النطاقات الجديدة ذات سمعة محايدة حتى تثبت تاريخ إرسال.

3. **محفزات المحتوى**: بعض الكلمات أو العبارات قد تؤدي إلى تفعيل فلاتر الرسائل المزعجة.

4. **أنماط الإرسال**: الزيادات المفاجئة في حجم الرسائل قد تبدو مريبة.

يمكنك محاولة استخدام أداة واحدة أو أكثر لفحص سمعة وتصنيف نطاقك:

#### أدوات فحص السمعة وقوائم الحظر {#reputation-and-blocklist-check-tools}

| اسم الأداة                                  | الرابط                                                        | النوع                  |
| ------------------------------------------- | ------------------------------------------------------------- | ---------------------- |
| Cloudflare Domain Categorization Feedback   | <https://radar.cloudflare.com/domains/feedback>               | تصنيف                  |
| Spamhaus IP and Domain Reputation Checker   | <https://check.spamhaus.org/>                                 | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>             | سمعة                   |
| Barracuda IP and Domain Reputation Lookup   | <https://www.barracudacentral.org/lookups/lookup-reputation>  | DNSBL                  |
| MX Toolbox Blacklist Check                  | <https://mxtoolbox.com/blacklists.aspx>                       | قائمة حظر              |
| Google Postmaster Tools                     | <https://www.gmail.com/postmaster/>                           | سمعة                   |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                               | سمعة                   |
| MultiRBL.valli.org Blacklist Check          | <https://multirbl.valli.org/lookup/>                          | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>              | سمعة                   |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                         | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                      | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                            | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3             | <https://www.uceprotect.net/en/rblcheck.php>                  | DNSBL                  |
| UCEPROTECT's backscatterer.org              | <https://www.backscatterer.org/>                              | حماية من الارتداد      |
| UCEPROTECT's whitelisted.org                | <https://www.whitelisted.org/> (يتطلب رسوم)                   | DNSWL                  |

#### نماذج طلب إزالة IP حسب المزود {#ip-removal-request-forms-by-provider}

إذا تم حظر عنوان IP الخاص بك من قبل مزود بريد إلكتروني معين، استخدم نموذج الإزالة المناسب أو الاتصال أدناه:

| المزود                                  | نموذج الإزالة / الاتصال                                                                                     | ملاحظات                                      |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | نموذج اتصال للمرسلين بالجملة                  |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | بوابة إزالة IP لـ Office 365                  |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | مركز مرسلي Yahoo                             |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | تستخدم Apple خدمة Proofpoint لسمعة IP         |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | فحص وإزالة IP من Proofpoint                   |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | فحص وإزالة سمعة Barracuda                     |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | طلب إعادة تعيين Cloudmark CSI                 |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | نموذج طلب إزالة حظر IP من GoDaddy             |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | طلب إزالة IP من Comcast                        |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | اتصل بدعم Spectrum للإزالة                      |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | بريد إلكتروني لطلب الإزالة                    |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | بريد إلكتروني لطلب الإزالة                    |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | يستخدم Cloudfilter                            |
| Windstream                             | `abuse@windstream.net`                                                                                     | بريد إلكتروني لطلب الإزالة                    |
| t-online.de (ألمانيا)                  | `tobr@rx.t-online.de`                                                                                      | بريد إلكتروني لطلب الإزالة                    |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | استخدم نموذج الاتصال أو البريد `abuse@orange.fr` |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | نموذج اتصال مدير البريد GMX                    |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | بوابة مدير البريد Mail.ru                      |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | بوابة مدير البريد Yandex                       |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | طلب إدراج في القائمة البيضاء لـ QQ Mail (صيني) |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | بوابة مدير البريد Netease                      |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | الاتصال عبر وحدة تحكم Alibaba Cloud           |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | وحدة تحكم AWS SES > إزالة من القائمة السوداء  |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | الاتصال بدعم SendGrid                         |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | يستخدم قوائم حظر طرف ثالث - اتصل بالقائمة المحددة |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | الاتصال بدعم Fastmail                         |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | الاتصال بدعم Zoho                             |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | الاتصال بدعم Proton                           |
| Tutanota                               | <https://tutanota.com/support>                                                                             | الاتصال بدعم Tutanota                         |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | الاتصال بدعم Hushmail                         |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | الاتصال بدعم Mailbox.org                      |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | الاتصال بدعم Posteo                           |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | الاتصال بدعم DuckDuckGo                       |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | الاتصال بدعم Sonic                            |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | الاتصال بدعم Telus                            |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | الاتصال بدعم Vodafone                         |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | الاتصال بدعم Spark NZ                         |
| UOL/BOL (البرازيل)                    | <https://ajuda.uol.com.br/>                                                                                | الاتصال بدعم UOL (البرتغالية)                 |
| Libero (إيطاليا)                      | <https://aiuto.libero.it/>                                                                                 | الاتصال بدعم Libero (الإيطالية)               |
| Telenet (بلجيكا)                      | <https://www2.telenet.be/en/support/>                                                                      | الاتصال بدعم Telenet                          |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | الاتصال بدعم أعمال Facebook                   |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | الاتصال بدعم LinkedIn                         |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | الاتصال بدعم Groups.io                        |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | أداة مرسل Vade Secure                         |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | الاتصال بدعم Cloudflare                       |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | الاتصال بدعم Hornetsecurity                   |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | الاتصال عبر مزود الاستضافة                    |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | الاتصال بدعم Mail2World                       |
> \[!TIP]
> ابدأ بحجم منخفض من الرسائل الإلكترونية عالية الجودة لبناء سمعة إيجابية قبل الإرسال بكميات أكبر.

> \[!IMPORTANT]
> إذا كان نطاقك مدرجًا في قائمة سوداء، فلكل قائمة سوداء عملية إزالة خاصة بها. تحقق من مواقعهم للحصول على التعليمات.

> \[!TIP]
> إذا كنت بحاجة إلى مساعدة إضافية أو وجدت أننا مدرجون خطأً كرسائل مزعجة من قبل مزود خدمة البريد الإلكتروني معين، فيرجى <a href="/help">الاتصال بنا</a>.

### ماذا يجب أن أفعل إذا تلقيت رسائل بريد إلكتروني مزعجة {#what-should-i-do-if-i-receive-spam-emails}

يجب عليك إلغاء الاشتراك من قائمة البريد الإلكتروني (إذا أمكن) وحظر المرسل.

يرجى عدم الإبلاغ عن الرسالة كبريد مزعج، بل إعادة توجيهها إلى نظام منع الإساءة الذي يتم إدارته يدويًا ويركز على الخصوصية.

**عنوان البريد الإلكتروني لإعادة توجيه الرسائل المزعجة إليه هو:** <abuse@forwardemail.net>

### لماذا تظهر رسائل الاختبار التي أرسلها لنفسي في Gmail على أنها "مريبة" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

إذا رأيت رسالة الخطأ هذه في Gmail عند إرسال اختبار لنفسك، أو عندما يرى شخص تراسله باستخدام الاسم المستعار بريدًا منك لأول مرة، **يرجى عدم القلق** – فهذه ميزة أمان مدمجة في Gmail.

يمكنك ببساطة النقر على "يبدو آمنًا". على سبيل المثال، إذا أرسلت رسالة اختبار باستخدام ميزة إرسال البريد كـ (لشخص آخر)، فلن يروا هذه الرسالة.

ومع ذلك، إذا رأوا هذه الرسالة، فذلك لأنهم اعتادوا عادةً على رؤية رسائلك تأتي من <john@gmail.com> بدلاً من <john@customdomain.com> (كمثال فقط). يقوم Gmail بتنبيه المستخدمين فقط للتأكد من أن الأمور آمنة، ولا يوجد حل بديل.

### هل يمكنني إزالة عبارة via forwardemail dot net في Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

هذا الموضوع مرتبط بـ [مشكلة معروفة على نطاق واسع في Gmail حيث تظهر معلومات إضافية بجانب اسم المرسل](https://support.google.com/mail/answer/1311182).

اعتبارًا من مايو 2023، ندعم إرسال البريد الإلكتروني عبر SMTP كإضافة لجميع المستخدمين المدفوعين – مما يعني أنه يمكنك إزالة <span class="notranslate">via forwardemail dot net</span> في Gmail.

يرجى ملاحظة أن هذا الموضوع مخصص لأولئك الذين يستخدمون ميزة [كيفية إرسال البريد كـ باستخدام Gmail](#how-to-send-mail-as-using-gmail).

يرجى مراجعة القسم الخاص بـ [هل تدعمون إرسال البريد الإلكتروني عبر SMTP](#do-you-support-sending-email-with-smtp) للحصول على تعليمات التكوين.


## إدارة البيانات {#data-management}

### أين تقع خوادمكم {#where-are-your-servers-located}

> \[!TIP]
> قد نعلن قريبًا عن موقع مركز بياناتنا في الاتحاد الأوروبي المستضاف تحت [forwardemail.eu](https://forwardemail.eu). اشترك في النقاش على <https://github.com/orgs/forwardemail/discussions/336> للحصول على التحديثات.

تقع خوادمنا بشكل رئيسي في دنفر، كولورادو – راجع <https://forwardemail.net/ips> لقائمة عناوين IP الكاملة الخاصة بنا.

يمكنك التعرف على المعالجات الفرعية لدينا في صفحات [GDPR](/gdpr)، و [DPA](/dpa)، و [الخصوصية](/privacy).

### كيف أقوم بتصدير ونسخ صندوق بريدي احتياطيًا {#how-do-i-export-and-backup-my-mailbox}

يمكنك في أي وقت تصدير صناديق بريدك بصيغ [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)، أو [Mbox](https://en.wikipedia.org/wiki/Mbox)، أو بصيغ [SQLite](https://en.wikipedia.org/wiki/SQLite) المشفرة.

اذهب إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة <i class="fa fa-angle-right"></i> تحميل النسخة الاحتياطية واختر نوع صيغة التصدير المفضلة لديك.

سيتم إرسال رابط لتحميل التصدير عبر البريد الإلكتروني بمجرد الانتهاء.

يرجى ملاحظة أن رابط تحميل التصدير هذا ينتهي بعد 4 ساعات لأسباب أمنية.

إذا كنت بحاجة إلى فحص صيغ EML أو Mbox التي صدرتها، فقد تكون هذه الأدوات مفتوحة المصدر مفيدة:

| الاسم            | الصيغة | النظام الأساسي | رابط GitHub                                         |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | ويندوز        | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | جميع الأنظمة  | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | ويندوز        | <https://github.com/ayamadori/EmlReader>            |
| عارض البريد الإلكتروني |   EML  | VSCode        | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | جميع الأنظمة  | <https://github.com/s0ph1e/eml-reader>              |
بالإضافة إلى ذلك إذا كنت بحاجة إلى تحويل ملف Mbox إلى ملف EML، فيمكنك استخدام <https://github.com/noelmartinon/mboxzilla>.

### كيف يمكنني استيراد ونقل صندوق بريدي الحالي {#how-do-i-import-and-migrate-my-existing-mailbox}

يمكنك بسهولة استيراد بريدك الإلكتروني إلى Forward Email (مثلاً باستخدام [Thunderbird](https://www.thunderbird.net)) مع التعليمات أدناه:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    يجب عليك اتباع جميع الخطوات التالية من أجل استيراد بريدك الإلكتروني الحالي.
  </span>
</div>

1. قم بتصدير بريدك الإلكتروني من مزود البريد الإلكتروني الحالي:

   | مزود البريد الإلكتروني | صيغة التصدير                                  | تعليمات التصدير                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | ---------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail                  | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook                | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">نصيحة:</strong> <span>إذا كنت تستخدم Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">صيغة تصدير PST</a>)، فيمكنك ببساطة اتباع التعليمات تحت "أخرى" أدناه. ومع ذلك، قمنا بتوفير روابط أدناه لتحويل PST إلى صيغة MBOX/EML بناءً على نظام التشغيل الخاص بك:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba لنظام ويندوز</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst لنظام ويندوز cygwin</a> – (مثلاً <code>readpst -u -o $OUT_DIR $IN_DIR</code> مع استبدال <code>$OUT_DIR</code> و <code>$IN_DIR</code> بمسارات مجلد الإخراج ومدخلات المجلد على التوالي).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst لأوبونتو/لينكس</a> – (مثلاً <code>sudo apt-get install readpst</code> ثم <code>readpst -u -o $OUT_DIR $IN_DIR</code> مع استبدال <code>$OUT_DIR</code> و <code>$IN_DIR</code> بمسارات مجلد الإخراج ومدخلات المجلد على التوالي).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst لنظام macOS (عبر brew)</a> – (مثلاً <code>brew install libpst</code> ثم <code>readpst -u -o $OUT_DIR $IN_DIR</code> مع استبدال <code>$OUT_DIR</code> و <code>$IN_DIR</code> بمسارات مجلد الإخراج ومدخلات المجلد على التوالي).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">محول PST لنظام ويندوز (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail             | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail               | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail            | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota               | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi                  | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho                   | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | أخرى                   | [استخدم Thunderbird](https://www.thunderbird.net) | قم بإعداد حساب بريدك الإلكتروني الحالي في Thunderbird ثم استخدم إضافة [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) لتصدير واستيراد بريدك الإلكتروني. **قد تتمكن أيضًا من نسخ/لصق أو سحب/إفلات الرسائل بين حساب وآخر ببساطة.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. قم بتنزيل وتثبيت وفتح [Thunderbird](https://www.thunderbird.net).

3. أنشئ حسابًا جديدًا باستخدام عنوان البريد الإلكتروني الكامل للكنية الخاصة بك (مثل <code><you@yourdomain.com></code>) وكلمة المرور التي تم إنشاؤها.  <strong>إذا لم يكن لديك كلمة مرور تم إنشاؤها بعد، فـ <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">راجع تعليمات الإعداد الخاصة بنا</a></strong>.

4. قم بتنزيل وتثبيت إضافة [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) الخاصة بـ Thunderbird.

5. أنشئ مجلدًا محليًا جديدًا في Thunderbird، ثم انقر بزر الماوس الأيمن عليه → اختر خيار `ImportExportTools NG` → اختر `Import mbox file` (لتنسيق تصدير MBOX) – أو – `Import messages` / `Import all messages from a directory` (لتنسيق تصدير EML).

6. اسحب/أسقط من المجلد المحلي إلى مجلد IMAP جديد (أو موجود) في Thunderbird ترغب في رفع الرسائل إليه في تخزين IMAP مع خدمتنا.  هذا سيضمن نسخها احتياطيًا عبر الإنترنت باستخدام تخزيننا المشفر SQLite.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       نصيحة:
     </strong>
     <span>
       إذا كنت مرتبكًا حول كيفية الاستيراد إلى Thunderbird، فيمكنك الرجوع إلى التعليمات الرسمية على <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> و <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    بمجرد إكمال عملية التصدير والاستيراد، قد ترغب أيضًا في تمكين إعادة التوجيه على حساب بريدك الإلكتروني الحالي وإعداد رد تلقائي لإخطار المرسلين بأن لديك عنوان بريد إلكتروني جديد (على سبيل المثال إذا كنت تستخدم Gmail سابقًا والآن تستخدم بريدًا إلكترونيًا مع اسم نطاق مخصص).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      تهانينا!
    </strong>
    <span>
      لقد أكملت جميع الخطوات بنجاح.
    </span>
  </div>
</div>

### كيف أستخدم تخزين S3 متوافق خاص بي للنسخ الاحتياطية {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

يمكن لمستخدمي الخطط المدفوعة تكوين مزود تخزين متوافق مع [S3](https://en.wikipedia.org/wiki/Amazon_S3) خاص بهم على أساس كل نطاق للنسخ الاحتياطية IMAP/SQLite.  هذا يعني أن نسخ صندوق بريدك المشفرة يمكن تخزينها على بنيتك التحتية الخاصة بدلاً من (أو بالإضافة إلى) التخزين الافتراضي لدينا.

تشمل المزودات المدعومة [Amazon S3](https://aws.amazon.com/s3/)، [Cloudflare R2](https://developers.cloudflare.com/r2/)، [MinIO](https://github.com/minio/minio)، [Backblaze B2](https://www.backblaze.com/cloud-storage)، [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces)، وأي خدمة أخرى متوافقة مع S3.

#### الإعداد {#setup}

1. أنشئ دلوًا **خاصًا** مع مزود S3 المتوافق الخاص بك. يجب ألا يكون الدلو متاحًا للعامة.
2. أنشئ بيانات اعتماد الوصول (معرّف مفتاح الوصول والمفتاح السري) مع أذونات قراءة/كتابة على الدلو.
3. اذهب إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعدادات المتقدمة <i class="fa fa-angle-right"></i> تخزين S3 متوافق مخصص.
4. فعّل **"تمكين تخزين S3 متوافق مخصص"** واملأ عنوان نقطة النهاية، معرّف مفتاح الوصول، المفتاح السري، المنطقة، واسم الدلو.
5. انقر على **"اختبار الاتصال"** للتحقق من بيانات الاعتماد، الوصول إلى الدلو، وأذونات الكتابة.
6. انقر على **"حفظ"** لتطبيق الإعدادات.

#### كيف تعمل النسخ الاحتياطية {#how-backups-work}

يتم تشغيل النسخ الاحتياطية تلقائيًا لكل كنية IMAP متصلة. يتحقق خادم IMAP من جميع الاتصالات النشطة مرة واحدة في الساعة ويرسل نسخة احتياطية لكل كنية متصلة. يمنع قفل قائم على Redis تشغيل نسخ احتياطية مكررة خلال 30 دقيقة من بعضها البعض، ويتم تخطي النسخ الاحتياطي الفعلي إذا تم إكمال نسخة احتياطية ناجحة خلال آخر 24 ساعة (ما لم يتم طلب النسخ الاحتياطي صراحة من قبل المستخدم للتنزيل).
يمكن أيضًا تشغيل النسخ الاحتياطية يدويًا بالنقر على **"تنزيل النسخة الاحتياطية"** لأي اسم مستعار في لوحة التحكم.  النسخ الاحتياطية اليدوية تعمل دائمًا بغض النظر عن نافذة الـ 24 ساعة.

تعمل عملية النسخ الاحتياطي كما يلي:

1. يتم نسخ قاعدة بيانات SQLite باستخدام `VACUUM INTO`، والذي ينشئ لقطة متسقة دون مقاطعة الاتصالات النشطة ويحافظ على تشفير قاعدة البيانات.
2. يتم التحقق من ملف النسخة الاحتياطية بفتحه لتأكيد أن التشفير لا يزال صالحًا.
3. يتم حساب تجزئة SHA-256 ومقارنتها مع النسخة الاحتياطية الموجودة في التخزين.  إذا تطابقت التجزئة، يتم تخطي الرفع (لا تغييرات منذ آخر نسخة احتياطية).
4. يتم رفع النسخة الاحتياطية إلى S3 باستخدام رفع متعدد الأجزاء عبر مكتبة [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. يتم إنشاء رابط تنزيل موقع (صالح لمدة 4 ساعات) ويتم إرساله عبر البريد الإلكتروني إلى المستخدم.

#### صيغ النسخ الاحتياطية {#backup-formats}

يتم دعم ثلاث صيغ للنسخ الاحتياطية:

| الصيغة   | الامتداد  | الوصف                                                                       |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | لقطة قاعدة بيانات SQLite مشفرة خام (الافتراضي للنسخ الاحتياطية التلقائية عبر IMAP) |
| `mbox`   | `.zip`    | ملف ZIP محمي بكلمة مرور يحتوي على صندوق البريد بصيغة mbox                   |
| `eml`    | `.zip`    | ملف ZIP محمي بكلمة مرور يحتوي على ملفات `.eml` فردية لكل رسالة             |

> **نصيحة:** إذا كان لديك ملفات نسخ احتياطية `.sqlite` وترغب في تحويلها إلى ملفات `.eml` محليًا، استخدم أداة CLI المستقلة الخاصة بنا **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**.  تعمل على ويندوز، لينكس، وماك ولا تتطلب اتصالًا بالشبكة.

#### تسمية الملفات وبنية المفتاح {#file-naming-and-key-structure}

عند استخدام **تخزين S3 مخصص**، يتم تخزين ملفات النسخ الاحتياطية مع بادئة طابع زمني [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) بحيث يتم الاحتفاظ بكل نسخة احتياطية ككائن منفصل.  هذا يمنحك سجل نسخ احتياطية كامل في الدلو الخاص بك.

صيغة المفتاح هي:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

على سبيل المثال:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

الـ `alias_id` هو معرف MongoDB ObjectId للاسم المستعار.  يمكنك العثور عليه في صفحة إعدادات الاسم المستعار أو عبر API.

عند استخدام **التخزين الافتراضي (النظامي)**، يكون المفتاح مسطحًا (مثل `65a31c53c36b75ed685f3fda.sqlite`) وكل نسخة احتياطية تستبدل السابقة.

> **ملاحظة:** نظرًا لأن تخزين S3 المخصص يحتفظ بجميع إصدارات النسخ الاحتياطية، فإن استخدام التخزين سيزداد مع الوقت.  نوصي بتكوين [قواعد دورة الحياة](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) على الدلو الخاص بك لحذف النسخ الاحتياطية القديمة تلقائيًا (مثل حذف الكائنات الأقدم من 30 أو 90 يومًا).

#### ملكية البيانات وسياسة الحذف {#data-ownership-and-deletion-policy}

دلوك المخصص في S3 تحت سيطرتك الكاملة.  نحن **لا نحذف أو نعدل** الملفات في دلوك المخصص — لا عند حذف اسم مستعار، ولا عند إزالة نطاق، ولا أثناء أي عمليات تنظيف.  نحن فقط نكتب ملفات النسخ الاحتياطية الجديدة إلى دلوك.

هذا يعني:

* **حذف الاسم المستعار** — عند حذف اسم مستعار، نقوم بإزالة النسخة الاحتياطية من تخزين النظام الافتراضي فقط.  أي نسخ احتياطية كتبت سابقًا إلى دلوك S3 المخصص تبقى دون تغيير.
* **إزالة النطاق** — إزالة نطاق لا تؤثر على الملفات في دلوك المخصص.
* **إدارة الاحتفاظ** — أنت مسؤول عن إدارة التخزين في دلوك الخاص، بما في ذلك تكوين قواعد دورة الحياة لحذف النسخ الاحتياطية القديمة.

إذا قمت بتعطيل تخزين S3 المخصص أو العودة إلى التخزين الافتراضي، يتم الاحتفاظ بالملفات الموجودة في دلوك.  النسخ الاحتياطية المستقبلية ستُكتب ببساطة إلى التخزين الافتراضي بدلاً من ذلك.

#### الأمان {#security}

* يتم **تشفير** معرف مفتاح الوصول والمفتاح السري الخاص بك أثناء التخزين باستخدام [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) قبل تخزينهما في قاعدة بياناتنا.  يتم فك التشفير فقط أثناء التشغيل عند تنفيذ عمليات النسخ الاحتياطي.
* نتحقق تلقائيًا من أن دلوك **غير متاح للعامة**.  إذا تم اكتشاف دلوك عام، سيتم رفض التكوين عند الحفظ.  إذا تم اكتشاف وصول عام أثناء النسخ الاحتياطي، نعود إلى التخزين الافتراضي ونبلغ جميع مديري النطاقات عبر البريد الإلكتروني.
* يتم التحقق من صحة بيانات الاعتماد عند الحفظ عبر استدعاء [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) لضمان وجود الدلو وصحة بيانات الاعتماد.  إذا فشل التحقق، يتم تعطيل تخزين S3 المخصص تلقائيًا.
* يتضمن كل ملف نسخة احتياطية تجزئة SHA-256 في بيانات تعريف S3 الخاصة به، والتي تُستخدم لاكتشاف قواعد البيانات غير المتغيرة وتخطي عمليات الرفع المكررة.
#### إشعارات الأخطاء {#error-notifications}

إذا فشل النسخ الاحتياطي عند استخدام تخزين S3 المخصص الخاص بك (مثلًا بسبب انتهاء صلاحية بيانات الاعتماد أو مشكلة في الاتصال)، سيتم إخطار جميع مديري النطاقات عبر البريد الإلكتروني. هذه الإشعارات محدودة بمعدل مرة كل 6 ساعات لمنع التنبيهات المكررة. إذا تم اكتشاف أن الدلو الخاص بك متاح للعامة أثناء وقت النسخ الاحتياطي، سيتم إخطار المديرين مرة واحدة يوميًا.

#### API {#api}

يمكنك أيضًا تكوين تخزين S3 مخصص عبر API:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

لاختبار الاتصال عبر API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### كيف أحول نسخ SQLite الاحتياطية إلى ملفات EML {#how-do-i-convert-sqlite-backups-to-eml-files}

إذا قمت بتنزيل أو تخزين نسخ SQLite الاحتياطية (سواء من التخزين الافتراضي لدينا أو من [دلوك S3 المخصص](#how-do-i-use-my-own-s3-compatible-storage-for-backups) الخاص بك)، يمكنك تحويلها إلى ملفات `.eml` قياسية باستخدام أداة CLI المستقلة الخاصة بنا **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. يمكن فتح ملفات EML باستخدام أي عميل بريد إلكتروني ([Thunderbird](https://www.thunderbird.net/)، [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook)، [Apple Mail](https://support.apple.com/mail)، إلخ) أو استيرادها إلى خوادم بريد أخرى.

#### التثبيت {#installation-1}

يمكنك إما تنزيل ملف ثنائي مُجمّع مسبقًا (لا يتطلب [Node.js](https://github.com/nodejs/node)) أو تشغيله مباشرة باستخدام [Node.js](https://github.com/nodejs/node):

**الملفات الثنائية المُجمّعة مسبقًا** — قم بتنزيل أحدث إصدار لمنصتك من [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| المنصة   | المعمارية     | الملف                                |
| -------- | ------------- | ----------------------------------- |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`   |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64` |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64`|
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe` |

> **لمستخدمي macOS:** بعد التنزيل، قد تحتاج إلى إزالة خاصية الحجز قبل تشغيل الملف الثنائي:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (استبدل `./convert-sqlite-to-eml-darwin-arm64` بالمسار الفعلي للملف الذي تم تنزيله.)

> **لمستخدمي Linux:** بعد التنزيل، قد تحتاج إلى جعل الملف الثنائي قابلًا للتنفيذ:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (استبدل `./convert-sqlite-to-eml-linux-x64` بالمسار الفعلي للملف الذي تم تنزيله.)

**من المصدر** (يتطلب [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### الاستخدام {#usage}

تدعم الأداة وضعي التشغيل التفاعلي وغير التفاعلي.

**الوضع التفاعلي** — شغّل الأداة بدون معطيات وسيُطلب منك إدخال جميع البيانات:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - تحويل نسخة SQLite الاحتياطية إلى EML
  =============================================

  مسار ملف النسخة الاحتياطية SQLite: /path/to/backup.sqlite
  كلمة مرور IMAP/الاسم المستعار: ********
  مسار ملف ZIP الناتج [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**الوضع غير التفاعلي** — مرر المعطيات عبر وسائط سطر الأوامر لأتمتة السكربتات:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| الوسيط              | الوصف                                                                          |
| ------------------- | ------------------------------------------------------------------------------ |
| `--path <path>`     | مسار ملف النسخة الاحتياطية المشفرة SQLite                                      |
| `--password <pass>` | كلمة مرور IMAP/الاسم المستعار لفك التشفير                                     |
| `--output <path>`   | مسار ملف ZIP الناتج (الافتراضي: يتم إنشاؤه تلقائيًا مع طابع زمني ISO 8601)     |
| `--help`            | عرض رسالة المساعدة                                                             |
#### تنسيق الإخراج {#output-format}

ينتج الأداة أرشيف ZIP محمي بكلمة مرور (مشفر AES-256) يحتوي على:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

ملفات EML منظمة حسب مجلد صندوق البريد. كلمة مرور ZIP هي نفسها كلمة مرور IMAP/الاسم المستعار الخاص بك. كل ملف `.eml` هو رسالة بريد إلكتروني قياسية وفقًا لـ [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) مع رؤوس كاملة، نص الرسالة، والمرفقات التي تم إعادة بنائها من قاعدة بيانات SQLite.

#### كيف يعمل {#how-it-works}

1. يفتح قاعدة بيانات SQLite المشفرة باستخدام كلمة مرور IMAP/الاسم المستعار الخاص بك (يدعم كل من شفرات [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) و [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. يقرأ جدول صناديق البريد لاكتشاف هيكل المجلدات.
3. لكل رسالة، يفك تشفير mimeTree (المخزن كـ JSON مضغوط باستخدام [Brotli](https://github.com/google/brotli)) من جدول الرسائل.
4. يعيد بناء ملف EML الكامل من خلال التنقل في شجرة MIME وجلب محتويات المرفقات من جدول المرفقات.
5. يجمع كل شيء في أرشيف ZIP محمي بكلمة مرور باستخدام [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### هل تدعم الاستضافة الذاتية {#do-you-support-self-hosting}

نعم، اعتبارًا من مارس 2025، ندعم خيار الاستضافة الذاتية. اقرأ المدونة [هنا](https://forwardemail.net/blog/docs/self-hosted-solution). اطلع على [دليل الاستضافة الذاتية](https://forwardemail.net/self-hosted) للبدء. وللمهتمين بنسخة أكثر تفصيلاً خطوة بخطوة، راجع أدلتنا الخاصة بـ [أوبونتو](https://forwardemail.net/guides/selfhosted-on-ubuntu) أو [ديبيان](https://forwardemail.net/guides/selfhosted-on-debian).

## إعداد البريد الإلكتروني {#email-configuration}

### كيف أبدأ وأعد توجيه البريد الإلكتروني {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">الوقت المقدر للإعداد:</strong>
  <span>أقل من 10 دقائق</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    البدء:
  </strong>
  <span>
    اقرأ بعناية واتبع الخطوات من واحد إلى ثمانية المذكورة أدناه. تأكد من استبدال عنوان البريد الإلكتروني <code>user@gmail.com</code> بعنوان البريد الإلكتروني الذي تريد إعادة توجيه الرسائل إليه (إذا لم يكن دقيقًا بالفعل). وبالمثل، تأكد من استبدال <code>example.com</code> باسم النطاق المخصص الخاص بك (إذا لم يكن دقيقًا بالفعل).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">إذا كنت قد سجلت اسم النطاق الخاص بك بالفعل في مكان ما، فيجب عليك تخطي هذه الخطوة تمامًا والانتقال إلى الخطوة الثانية! وإلا يمكنك <a href="/domain-registration" rel="noopener noreferrer">النقر هنا لتسجيل اسم النطاق الخاص بك</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  هل تتذكر أين سجلت نطاقك؟ بمجرد تذكرك، اتبع التعليمات أدناه:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    يجب عليك فتح تبويب جديد وتسجيل الدخول إلى مسجل النطاق الخاص بك. يمكنك بسهولة النقر على "المسجل" أدناه للقيام بذلك تلقائيًا. في هذا التبويب الجديد، يجب عليك الانتقال إلى صفحة إدارة DNS في المسجل الخاص بك – وقد وفرنا خطوات التنقل خطوة بخطوة أدناه تحت عمود "خطوات التكوين". بمجرد التنقل إلى هذه الصفحة في التبويب الجديد، يمكنك العودة إلى هذا التبويب والمتابعة إلى الخطوة الثالثة أدناه.
    <strong class="font-weight-bold">لا تغلق التبويب المفتوح بعد؛ ستحتاجه للخطوات المستقبلية!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>المسجل</th>
      <th>خطوات التكوين</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> مركز النطاقات <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> تحرير إعدادات DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> المناطق المستضافة <i class="fa fa-angle-right"></i> (اختر نطاقك)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> خوادمي <i class="fa fa-angle-right"></i> إدارة النطاق <i class="fa fa-angle-right"></i> مدير DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>لـ ROCK: تسجيل الدخول <i class="fa fa-angle-right"></i> النطاقات <i class="fa fa-angle-right"></i> (انقر على أيقونة ▼ بجانب الإدارة) <i class="fa fa-angle-right"></i> DNS
      <br />
      للنسخة القديمة: تسجيل الدخول <i class="fa fa-angle-right"></i> النطاقات <i class="fa fa-angle-right"></i> محرر المنطقة <i class="fa fa-angle-right"></i> (اختر نطاقك)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (اختر نطاقك)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> (اختر نطاقك)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> إدارة</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> الشبكات <i class="fa fa-angle-right"></i> النطاقات <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> المزيد <i class="fa fa-angle-right"></i> إدارة النطاق</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> في عرض البطاقات، انقر إدارة على نطاقك <i class="fa fa-angle-right"></i> في عرض القائمة، انقر على
أيقونة الترس <i class="fa fa-angle-right"></i> DNS وخوادم الأسماء <i class="fa fa-angle-right"></i> سجلات DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> شاهد</a>
      </td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إدارة <i class="fa fa-angle-right"></i> (انقر على أيقونة الترس) <i class="fa fa-angle-right"></i> انقر على DNS وخوادم الأسماء في القائمة الجانبية</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> لوحة التحكم <i class="fa fa-angle-right"></i> النطاقات <i class="fa fa-angle-right"></i> إدارة النطاقات <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> نظرة عامة <i class="fa fa-angle-right"></i> إدارة <i class="fa fa-angle-right"></i> المحرر البسيط <i class="fa fa-angle-right"></i> السجلات</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> الإدارة <i class="fa fa-angle-right"></i> تحرير المنطقة</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> شاهد</a>
      </td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> إدارة نطاقاتي <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إدارة DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> شاهد</a>
      </td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> تكوين DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> شاهد</a>
      </td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> قائمة النطاقات <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إدارة <i class="fa fa-angle-right"></i> DNS متقدم</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إعداد DNS Netlify</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> مدير الحساب <i class="fa fa-angle-right"></i> أسماء نطاقاتي <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إدارة <i class="fa fa-angle-right"></i> تغيير وجهة النطاق <i class="fa fa-angle-right"></i> DNS متقدم</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> شاهد</a>
      </td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> النطاقات المُدارة <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إعدادات DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> قائمة الصفحة الرئيسية <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> النطاقات <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i>
إعدادات متقدمة <i class="fa fa-angle-right"></i> سجلات مخصصة</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>باستخدام CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> صفحة النطاقات <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> صفحة النطاقات <i class="fa fa-angle-right"></i> (انقر على أيقونة <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> اختر إدارة سجلات DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>تسجيل الدخول <i class="fa fa-angle-right"></i> النطاقات <i class="fa fa-angle-right"></i> نطاقاتي</td>
    </tr>
    <tr>
      <td>أخرى</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">مهم:</strong> لا ترى اسم المسجل الخاص بك مدرجًا هنا؟ ببساطة ابحث على الإنترنت عن "كيفية تغيير سجلات DNS على $REGISTRAR" (استبدل $REGISTRAR باسم المسجل الخاص بك – مثل "كيفية تغيير سجلات DNS على GoDaddy" إذا كنت تستخدم GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">باستخدام صفحة إدارة DNS الخاصة بالمسجل (التبويب الآخر الذي فتحته)، قم بتعيين سجلات "MX" التالية:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    لاحظ أنه يجب ألا تكون هناك سجلات MX أخرى مضبوطة. يجب أن توجد كلا السجلين الموضحين أدناه. تأكد من عدم وجود أخطاء إملائية؛ وأنك كتبت كل من mx1 و mx2 بشكل صحيح. إذا كانت هناك سجلات MX موجودة بالفعل، يرجى حذفها بالكامل.
    لا تحتاج قيمة "TTL" لأن تكون 3600، يمكن أن تكون قيمة أقل أو أعلى إذا لزم الأمر.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الأولوية</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">باستخدام صفحة إدارة DNS الخاصة بمسجل النطاق الخاص بك (علامة التبويب الأخرى التي فتحتها)، قم بضبط سجل (سجلات) <strong class="notranslate">TXT</strong> التالية:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    إذا كنت على خطة مدفوعة، فيجب عليك تخطي هذه الخطوة تمامًا والانتقال إلى الخطوة الخامسة! إذا لم تكن على خطة مدفوعة، فستكون عناوين البريد الإلكتروني المعاد توجيهها قابلة للبحث علنًا – انتقل إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> وقم بترقية نطاقك إلى خطة مدفوعة إذا رغبت. إذا كنت ترغب في معرفة المزيد عن الخطط المدفوعة، راجع صفحة <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">التسعير</a> الخاصة بنا. وإلا يمكنك الاستمرار في اختيار واحد أو أكثر من التركيبات من الخيار أ إلى الخيار و المدرجة أدناه.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    الخيار أ:
  </strong>
  <span>
    إذا كنت تقوم بإعادة توجيه جميع الرسائل الإلكترونية من نطاقك، (مثل "all@example.com"، "hello@example.com"، إلخ) إلى عنوان محدد "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
  <span>
    تأكد من استبدال القيم أعلاه في عمود "القيمة" بعنوان بريدك الإلكتروني الخاص. لا تحتاج قيمة "TTL" لأن تكون 3600، يمكن أن تكون قيمة أقل أو أعلى إذا لزم الأمر. ستضمن قيمة وقت العيش ("TTL") الأقل أن أي تغييرات مستقبلية تُجرى على سجلات DNS الخاصة بك تنتشر عبر الإنترنت بشكل أسرع – فكر في هذا على أنه مدة التخزين المؤقت في الذاكرة (بالثواني). يمكنك معرفة المزيد عن <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">وقت العيش على ويكيبيديا</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    الخيار ب:
  </strong>
  <span>
    إذا كنت تحتاج فقط إلى إعادة توجيه عنوان بريد إلكتروني واحد (مثل <code>hello@example.com</code> إلى <code>user@gmail.com</code>؛ هذا سيعيد توجيه "hello+test@example.com" إلى "user+test@gmail.com" تلقائيًا أيضًا):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    الخيار ج:
  </strong>
  <span>
    إذا كنت تقوم بإعادة توجيه عدة رسائل بريد إلكتروني، فستحتاج إلى فصلها بفاصلة:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    الخيار د:
  </strong>
  <span>
    يمكنك إعداد عدد غير محدود من عناوين البريد الإلكتروني لإعادة التوجيه – فقط تأكد من عدم تجاوز 255 حرفًا في السطر الواحد وابدأ كل سطر بـ "forward-email=". المثال التالي موضح أدناه:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    الخيار هـ:
  </strong>
  <span>
    يمكنك أيضًا تحديد اسم نطاق في سجل <strong class="notranslate">TXT</strong> الخاص بك لإجراء إعادة توجيه عالمي للأسماء المستعارة (مثلاً "user@example.com" سيتم إعادة توجيهه إلى "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=example.net</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    الخيار و:
  </strong>
  <span>
    يمكنك حتى استخدام webhooks كاسم مستعار عالمي أو فردي لإعادة توجيه الرسائل الإلكترونية إليها. انظر المثال والقسم الكامل عن webhooks بعنوان <a href="#do-you-support-webhooks" class="alert-link">هل تدعم webhooks</a> أدناه.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    الخيار G:
  </strong>
  <span>
    يمكنك حتى استخدام التعبيرات النمطية ("regex") لمطابقة الأسماء المستعارة وللتعامل مع الاستبدالات لإعادة توجيه الرسائل الإلكترونية. راجع الأمثلة والقسم الكامل عن التعبيرات النمطية بعنوان <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">هل تدعم التعبيرات النمطية أو regex</a> أدناه.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>هل تحتاج إلى تعبير نمطي متقدم مع استبدال؟</strong> راجع الأمثلة والقسم الكامل عن التعبيرات النمطية بعنوان <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">هل تدعم التعبيرات النمطية أو regex</a> أدناه.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>مثال بسيط:</strong> إذا أردت أن يتم إعادة توجيه جميع الرسائل الإلكترونية التي تذهب إلى `linus@example.com` أو `torvalds@example.com` إلى `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    قواعد إعادة التوجيه الشاملة يمكن وصفها أيضاً بأنها "السقوط من خلال".
    هذا يعني أن الرسائل الإلكترونية الواردة التي تطابق قاعدة إعادة توجيه محددة واحدة على الأقل سيتم استخدامها بدلاً من القاعدة الشاملة.
    القواعد المحددة تشمل عناوين البريد الإلكتروني والتعبيرات النمطية.
    <br /><br />
    على سبيل المثال:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    الرسائل المرسلة إلى <code>hello@example.com</code> **لن** يتم إعادة توجيهها إلى <code>second@gmail.com</code> (القاعدة الشاملة) مع هذا التكوين، وبدلاً من ذلك سيتم تسليمها فقط إلى <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">باستخدام صفحة إدارة DNS الخاصة بمسجل النطاق الخاص بك (علامة التبويب الأخرى التي فتحتها)، قم بالإضافة إلى ذلك بتعيين سجل <strong class="notranslate">TXT</strong> التالي:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    إذا كنت تستخدم Gmail (مثل إرسال البريد كـ) أو G Suite، فستحتاج إلى إضافة <code>include:_spf.google.com</code> إلى القيمة أعلاه، على سبيل المثال:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
  <span>
    إذا كان لديك بالفعل سطر مشابه يحتوي على "v=spf1"، فستحتاج إلى إضافة <code>include:spf.forwardemail.net</code> مباشرة قبل أي سجلات "include:host.com" موجودة وقبل "-all" في نفس السطر، على سبيل المثال:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    لاحظ أن هناك فرقاً بين "-all" و "~all". "-" تعني أن فحص SPF يجب أن يفشل إذا لم يتطابق، و "~" تعني أن فحص SPF يجب أن يفشل بشكل ناعم. نوصي باستخدام نهج "-all" لمنع تزوير النطاق.
    <br /><br />
    قد تحتاج أيضاً إلى تضمين سجل SPF لأي مضيف ترسل البريد منه (مثل Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">تحقق من سجلات DNS الخاصة بك باستخدام أداة "التحقق من السجلات" المتوفرة في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعداد.

</li><li class="mb-2 mb-md-3 mb-lg-5">أرسل بريدًا إلكترونيًا تجريبيًا لتأكيد أنه يعمل. لاحظ أنه قد يستغرق بعض الوقت حتى تنتشر سجلات DNS الخاصة بك.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
  <span>
  </span>
    إذا لم تكن تتلقى رسائل البريد الإلكتروني التجريبية، أو تلقيت رسالة تجريبية تقول "كن حذرًا مع هذه الرسالة"، فراجع الإجابات الخاصة بـ <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">لماذا لا أتلقى رسائل البريد الإلكتروني التجريبية الخاصة بي</a> و <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">لماذا تظهر رسائل البريد الإلكتروني التجريبية المرسلة إلى نفسي في Gmail على أنها "مريبة"</a> على التوالي.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">إذا كنت ترغب في "إرسال البريد كـ" من Gmail، فستحتاج إلى <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">مشاهدة هذا الفيديو</a></strong>، أو اتباع الخطوات تحت <a href="#how-to-send-mail-as-using-gmail">كيفية إرسال البريد كـ باستخدام Gmail</a> أدناه.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      تهانينا!
    </strong>
    <span>
      لقد أكملت جميع الخطوات بنجاح.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
  <span>
    الإضافات الاختيارية مدرجة أدناه. لاحظ أن هذه الإضافات اختيارية تمامًا وقد لا تكون ضرورية. أردنا على الأقل تزويدك بمعلومات إضافية إذا لزم الأمر.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    إضافة اختيارية:
  </strong>
  <span>
    إذا كنت تستخدم ميزة <a class="alert-link" href="#how-to-send-mail-as-using-gmail">كيفية إرسال البريد كـ باستخدام Gmail</a>، فقد ترغب في إضافة نفسك إلى قائمة السماح. راجع <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">هذه التعليمات من Gmail</a> حول هذا الموضوع.
  </span>
</div>

### هل يمكنني استخدام عدة تبادلات MX وخوادم لإعادة التوجيه المتقدمة {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

نعم، ولكن **يجب أن يكون لديك تبادل MX واحد فقط مدرج في سجلات DNS الخاصة بك**.

لا تحاول استخدام "الأولوية" كطريقة لتكوين عدة تبادلات MX.

بدلاً من ذلك، تحتاج إلى تكوين تبادل MX الحالي لإعادة توجيه البريد لجميع الأسماء المستعارة غير المتطابقة إلى تبادلات خدمتنا (`mx1.forwardemail.net` و/أو `mx2.forwardemail.net`).

إذا كنت تستخدم Google Workspace وترغب في إعادة توجيه جميع الأسماء المستعارة غير المتطابقة إلى خدمتنا، فراجع <https://support.google.com/a/answer/6297084>.

إذا كنت تستخدم Microsoft 365 (Outlook) وترغب في إعادة توجيه جميع الأسماء المستعارة غير المتطابقة إلى خدمتنا، فراجع <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> و <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### كيف أقوم بإعداد رد تلقائي للعطلة (الرد التلقائي خارج المكتب) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

اذهب إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة وأنشئ أو حرر الاسم المستعار الذي ترغب في تكوين رد تلقائي للعطلة له.
لديك القدرة على تكوين تاريخ بدء، تاريخ انتهاء، موضوع، ورسالة، وتمكينها أو تعطيلها في أي وقت:

* يتم دعم الموضوع والرسالة بنص عادي حاليًا (نستخدم حزمة `striptags` داخليًا لإزالة أي HTML).
* الموضوع محدود بـ 100 حرف.
* الرسالة محدودة بـ 1000 حرف.
* يتطلب الإعداد تكوين SMTP الصادر (على سبيل المثال، ستحتاج إلى إعداد سجلات DKIM و DMARC و Return-Path في DNS).
  * اذهب إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> تكوين SMTP الصادر واتبع تعليمات الإعداد.
* لا يمكن تمكين الرد الآلي للإجازة على أسماء النطاقات العالمية المزيفة (على سبيل المثال، [العناوين المؤقتة](/disposable-addresses) غير مدعومة).
* لا يمكن تمكين الرد الآلي للإجازة للأسماء المستعارة التي تحتوي على أحرف بدل/شاملة (`*`) أو التعبيرات النمطية.

على عكس أنظمة البريد مثل `postfix` (على سبيل المثال التي تستخدم امتداد فلتر الإجازة `sieve`) – يقوم Forward Email تلقائيًا بإضافة توقيع DKIM الخاص بك، ويمنع مشاكل الاتصال عند إرسال ردود الإجازة (على سبيل المثال بسبب مشاكل شائعة في اتصال SSL/TLS والخوادم القديمة المدارة)، ويدعم حتى Open WKD و تشفير PGP لردود الإجازة.

<!--
* لمنع الإساءة، سيتم خصم رصيد SMTP صادر واحد لكل رسالة رد إجازة يتم إرسالها.
  * جميع الحسابات المدفوعة تتضمن 300 رصيد يوميًا بشكل افتراضي. إذا كنت بحاجة إلى كمية أكبر، يرجى الاتصال بنا.
-->

1. نرسل مرة واحدة فقط لكل مرسل [مسموح به](#do-you-have-an-allowlist) كل 4 أيام (وهو مشابه لسلوك Gmail).

   * يستخدم ذاكرة التخزين المؤقت Redis لدينا بصمة `alias_id` و `sender`، حيث أن `alias_id` هو معرف MongoDB للاسم المستعار و `sender` هو إما عنوان From (إذا كان مسموحًا به) أو النطاق الجذري في عنوان From (إذا لم يكن مسموحًا به). لتبسيط الأمور، تم تعيين انتهاء صلاحية هذه البصمة في الذاكرة المؤقتة إلى 4 أيام.

   * نهجنا باستخدام النطاق الجذري المستخرج من عنوان From للمرسلين غير المسموح لهم يمنع الإساءة من المرسلين غير المعروفين نسبيًا (مثل الجهات الخبيثة) من إغراق رسائل الرد الآلي للإجازة.

2. نرسل فقط عندما لا يكون MAIL FROM و/أو From فارغًا ولا يحتوي (بغض النظر عن حالة الأحرف) على اسم مستخدم [postmaster](#what-are-postmaster-addresses) (الجزء قبل @ في البريد الإلكتروني).

3. لا نرسل إذا كانت الرسالة الأصلية تحتوي على أي من الرؤوس التالية (بغض النظر عن حالة الأحرف):

   * رأس `auto-submitted` بقيمة لا تساوي `no`.
   * رأس `x-auto-response-suppress` بقيمة `dr`، `autoreply`، `auto-reply`، `auto_reply`، أو `all`
   * رأس `list-id`، `list-subscribe`، `list-unsubscribe`، `list-help`، `list-post`، `list-owner`، `list-archive`، `x-autoreply`، `x-autorespond`، أو `x-auto-respond` (بغض النظر عن القيمة).
   * رأس `precedence` بقيمة `bulk`، `autoreply`، `auto-reply`، `auto_reply`، أو `list`.

4. لا نرسل إذا كان عنوان البريد الإلكتروني MAIL FROM أو From ينتهي بـ `+donotreply`، `-donotreply`، `+noreply`، أو `-noreply`.

5. لا نرسل إذا كان الجزء الخاص باسم المستخدم في عنوان البريد الإلكتروني From هو `mdaemon` وكان يحتوي على رأس `X-MDDSN-Message` بغض النظر عن حالة الأحرف.

6. لا نرسل إذا كان هناك رأس `content-type` بقيمة `multipart/report` بغض النظر عن حالة الأحرف.

### كيف أقوم بإعداد SPF لـ Forward Email {#how-do-i-set-up-spf-for-forward-email}

باستخدام صفحة إدارة DNS الخاصة بمسجل النطاق الخاص بك، قم بإعداد سجل <strong class="notranslate">TXT</strong> التالي:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@"، "."، أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    إذا كنت تستخدم Gmail (على سبيل المثال إرسال البريد كـ) أو G Suite، فستحتاج إلى إضافة <code>include:_spf.google.com</code> إلى القيمة أعلاه، على سبيل المثال:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    إذا كنت تستخدم Microsoft Outlook أو Live.com، فستحتاج إلى إضافة <code>include:spf.protection.outlook.com</code> إلى سجل SPF <strong class="notranslate">TXT</strong> الخاص بك، على سبيل المثال:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
  <span>
    إذا كان لديك بالفعل سطر مشابه يحتوي على "v=spf1"، فستحتاج إلى إضافة <code>include:spf.forwardemail.net</code> مباشرة قبل أي سجلات "include:host.com" موجودة وقبل "-all" في نفس السطر، على سبيل المثال:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    لاحظ أن هناك فرقًا بين "-all" و "~all". يشير "-" إلى أن فحص SPF يجب أن يفشل إذا لم يتطابق، و "~" يشير إلى أن فحص SPF يجب أن يكون فشلًا ناعمًا. نوصي باستخدام طريقة "-all" لمنع تزوير النطاق.
    <br /><br />
    قد تحتاج أيضًا إلى تضمين سجل SPF لأي مضيف ترسل البريد منه (مثل Outlook).
  </span>
</div>

### كيف أقوم بإعداد DKIM لـ Forward Email {#how-do-i-set-up-dkim-for-forward-email}

اذهب إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> تكوين SMTP الصادر واتبع تعليمات الإعداد.

### كيف أقوم بإعداد DMARC لـ Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

اذهب إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> تكوين SMTP الصادر واتبع تعليمات الإعداد.

### كيف يمكنني عرض تقارير DMARC {#how-do-i-view-dmarc-reports}

يوفر Forward Email لوحة تحكم شاملة لتقارير DMARC تتيح لك مراقبة أداء مصادقة البريد الإلكتروني عبر جميع نطاقاتك من واجهة واحدة.

**ما هي تقارير DMARC؟**

تقارير DMARC (مصادقة الرسائل المستندة إلى النطاق، والتقارير، والامتثال) هي ملفات XML ترسلها خوادم البريد المستلمة تخبرك بكيفية مصادقة رسائلك الإلكترونية. تساعدك هذه التقارير على فهم:

* عدد الرسائل التي يتم إرسالها من نطاقك
* ما إذا كانت تلك الرسائل تجتاز مصادقة SPF و DKIM
* الإجراءات التي تتخذها الخوادم المستلمة (قبول، حجر صحي، أو رفض)
* عناوين IP التي ترسل البريد نيابة عن نطاقك

**كيفية الوصول إلى تقارير DMARC**

اذهب إلى <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> تقارير DMARC</a> لعرض لوحة التحكم الخاصة بك. يمكنك أيضًا الوصول إلى تقارير خاصة بالنطاق من <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> بالنقر على زر "DMARC" بجانب أي نطاق.

**ميزات لوحة التحكم**

توفر لوحة تقارير DMARC:

* **مقاييس ملخصة**: إجمالي التقارير المستلمة، إجمالي الرسائل المحللة، معدل توافق SPF، معدل توافق DKIM، ومعدل النجاح العام
* **مخطط الرسائل مع مرور الوقت**: اتجاه بصري لحجم البريد الإلكتروني ومعدلات المصادقة خلال آخر 30 يومًا
* **ملخص التوافق**: مخطط دونات يوضح توزيع توافق SPF مقابل DKIM
* **تصرف الرسائل**: مخطط شريطي مكدس يوضح كيفية تعامل الخوادم المستلمة مع رسائلك (مقبولة، محجوزة، أو مرفوضة)
* **جدول التقارير الحديثة**: قائمة مفصلة بتقارير DMARC الفردية مع إمكانية التصفية والتقسيم إلى صفحات
* **تصفية النطاقات**: تصفية التقارير حسب نطاق معين عند إدارة عدة نطاقات
**لماذا هذا مهم**

بالنسبة للمنظمات التي تدير عدة نطاقات (مثل الشركات الكبرى، المنظمات غير الربحية، أو الوكالات)، تقارير DMARC ضرورية لـ:

* **تحديد المرسلين غير المصرح لهم**: اكتشاف ما إذا كان هناك من ينتحل نطاقك
* **تحسين قابلية التسليم**: ضمان مرور رسائل البريد الإلكتروني الشرعية الخاصة بك عبر التوثيق
* **مراقبة بنية البريد الإلكتروني التحتية**: تتبع الخدمات وعناوين IP التي ترسل نيابة عنك
* **الامتثال**: الحفاظ على رؤية توثيق البريد الإلكتروني من أجل تدقيقات الأمان

على عكس الخدمات الأخرى التي تتطلب أدوات مراقبة DMARC منفصلة، يتضمن Forward Email معالجة تقارير DMARC وتصويرها كجزء من حسابك دون تكلفة إضافية.

**المتطلبات**

* تقارير DMARC متاحة فقط للخطط المدفوعة
* يجب أن يكون نطاقك مُعدًا لـ DMARC (انظر [كيف أقوم بإعداد DMARC لـ Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* يتم جمع التقارير تلقائيًا عندما ترسل خوادم البريد المستلمة التقارير إلى عنوان تقارير DMARC الذي قمت بتكوينه

**تقارير البريد الإلكتروني الأسبوعية**

يتلقى مستخدمو الخطط المدفوعة تلقائيًا ملخصات تقارير DMARC الأسبوعية عبر البريد الإلكتروني. تتضمن هذه الرسائل الإلكترونية:

* إحصائيات ملخصة لجميع نطاقاتك
* معدلات محاذاة SPF و DKIM
* تفصيل حالة الرسائل (مقبولة، محجوزة، مرفوضة)
* أبرز المنظمات المبلغة (Google، Microsoft، Yahoo، إلخ)
* عناوين IP التي بها مشاكل في المحاذاة والتي قد تحتاج إلى اهتمام
* روابط مباشرة إلى لوحة تقارير DMARC الخاصة بك

يتم إرسال التقارير الأسبوعية تلقائيًا ولا يمكن تعطيلها بشكل منفصل عن إشعارات البريد الإلكتروني الأخرى.

### كيف أقوم بربط وتكوين جهات الاتصال الخاصة بي {#how-do-i-connect-and-configure-my-contacts}

**لتكوين جهات الاتصال الخاصة بك، استخدم عنوان CardDAV التالي:** `https://carddav.forwardemail.net` (أو ببساطة `carddav.forwardemail.net` إذا سمح عميل البريد بذلك)

### كيف أقوم بربط وتكوين التقويمات الخاصة بي {#how-do-i-connect-and-configure-my-calendars}

**لتكوين التقويم الخاص بك، استخدم عنوان CalDAV التالي:** `https://caldav.forwardemail.net` (أو ببساطة `caldav.forwardemail.net` إذا سمح عميل البريد بذلك)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### كيف أضيف المزيد من التقويمات وأدير التقويمات الحالية {#how-do-i-add-more-calendars-and-manage-existing-calendars}

إذا كنت ترغب في إضافة تقويمات إضافية، فقط أضف عنوان تقويم جديد: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**تأكد من استبدال `calendar-name` باسم التقويم الذي تريده**)

يمكنك تغيير اسم التقويم ولونه بعد الإنشاء – فقط استخدم تطبيق التقويم المفضل لديك (مثل Apple Mail أو [Thunderbird](https://thunderbird.net)).

### كيف أقوم بربط وتكوين المهام والتذكيرات {#how-do-i-connect-and-configure-tasks-and-reminders}

**لتكوين المهام والتذكيرات، استخدم نفس عنوان CalDAV الخاص بالتقويمات:** `https://caldav.forwardemail.net` (أو ببساطة `caldav.forwardemail.net` إذا سمح عميل البريد بذلك)

سيتم فصل المهام والتذكيرات تلقائيًا عن أحداث التقويم إلى مجموعة تقويم خاصة بها باسم "التذكيرات" أو "المهام".

**تعليمات الإعداد حسب النظام:**

**macOS/iOS:**

1. أضف حساب CalDAV جديد في تفضيلات النظام > حسابات الإنترنت (أو الإعدادات > الحسابات على iOS)
2. استخدم `caldav.forwardemail.net` كخادم
3. أدخل اسم مستعار Forward Email وكلمة المرور المُولدة
4. بعد الإعداد، سترى مجموعتي "التقويم" و"التذكيرات"
5. استخدم تطبيق التذكيرات لإنشاء وإدارة المهام

**Android مع Tasks.org:**

1. قم بتثبيت Tasks.org من متجر Google Play أو F-Droid
2. اذهب إلى الإعدادات > المزامنة > إضافة حساب > CalDAV
3. أدخل الخادم: `https://caldav.forwardemail.net`
4. أدخل اسم مستعار Forward Email وكلمة المرور المُولدة
5. سيكتشف Tasks.org تلقائيًا تقاويم المهام الخاصة بك

**Thunderbird:**

1. قم بتثبيت إضافة Lightning إذا لم تكن مثبتة بالفعل
2. أنشئ تقويمًا جديدًا من النوع "CalDAV"
3. استخدم العنوان: `https://caldav.forwardemail.net`
4. أدخل بيانات اعتماد Forward Email الخاصة بك
5. ستكون الأحداث والمهام متاحة في واجهة التقويم

### لماذا لا يمكنني إنشاء مهام في تذكيرات macOS {#why-cant-i-create-tasks-in-macos-reminders}
إذا كنت تواجه مشكلة في إنشاء المهام في تطبيق التذكيرات على macOS، جرب خطوات استكشاف الأخطاء التالية:

1. **تحقق من إعداد الحساب**: تأكد من تكوين حساب CalDAV الخاص بك بشكل صحيح مع `caldav.forwardemail.net`

2. **تحقق من وجود تقاويم منفصلة**: يجب أن ترى كل من "التقويم" و"التذكيرات" في حسابك. إذا كنت ترى فقط "التقويم"، فقد لا يكون دعم المهام مفعلًا بالكامل بعد.

3. **تحديث الحساب**: حاول إزالة حساب CalDAV الخاص بك وإضافته مرة أخرى في تفضيلات النظام > حسابات الإنترنت

4. **تحقق من اتصال الخادم**: اختبر إمكانية الوصول إلى `https://caldav.forwardemail.net` في متصفحك

5. **تحقق من بيانات الاعتماد**: تأكد من استخدامك للبريد الإلكتروني المستعار الصحيح وكلمة المرور المولدة (وليس كلمة مرور حسابك)

6. **فرض المزامنة**: في تطبيق التذكيرات، حاول إنشاء مهمة ثم تحديث المزامنة يدويًا

**المشاكل الشائعة:**

* **"لم يتم العثور على تقويم التذكيرات"**: قد يحتاج الخادم إلى بعض الوقت لإنشاء مجموعة التذكيرات عند الوصول لأول مرة
* **عدم مزامنة المهام**: تحقق من أن كلا الجهازين يستخدمان بيانات اعتماد حساب CalDAV نفسها
* **محتوى مختلط**: تأكد من إنشاء المهام في تقويم "التذكيرات"، وليس في "التقويم" العام

### كيف أقوم بإعداد Tasks.org على أندرويد {#how-do-i-set-up-tasksorg-on-android}

Tasks.org هو مدير مهام مفتوح المصدر شهير يعمل بشكل ممتاز مع دعم مهام CalDAV الخاص بـ Forward Email.

**التثبيت والإعداد:**

1. **تثبيت Tasks.org**:
   * من متجر Google Play: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * من F-Droid: [Tasks.org على F-Droid](https://f-droid.org/packages/org.tasks/)

2. **تكوين مزامنة CalDAV**:
   * افتح Tasks.org
   * اذهب إلى ☰ القائمة > الإعدادات > المزامنة
   * اضغط على "إضافة حساب"
   * اختر "CalDAV"

3. **أدخل إعدادات Forward Email**:
   * **عنوان الخادم**: `https://caldav.forwardemail.net`
   * **اسم المستخدم**: البريد الإلكتروني المستعار الخاص بك في Forward Email (مثلاً `you@yourdomain.com`)
   * **كلمة المرور**: كلمة المرور المولدة الخاصة بالمستعار
   * اضغط على "إضافة حساب"

4. **اكتشاف الحساب**:
   * سيقوم Tasks.org باكتشاف تقاويم المهام تلقائيًا
   * يجب أن ترى مجموعة "التذكيرات" تظهر
   * اضغط على "الاشتراك" لتمكين المزامنة لتقويم المهام

5. **اختبار المزامنة**:
   * أنشئ مهمة اختبار في Tasks.org
   * تحقق من ظهورها في عملاء CalDAV الآخرين (مثل تطبيق التذكيرات على macOS)
   * تحقق من مزامنة التغييرات في كلا الاتجاهين

**الميزات المتاحة:**

* ✅ إنشاء وتحرير المهام
* ✅ تواريخ الاستحقاق والتذكيرات
* ✅ إكمال المهام وحالتها
* ✅ مستويات الأولوية
* ✅ المهام الفرعية وتسلسل المهام
* ✅ الوسوم والفئات
* ✅ مزامنة ثنائية الاتجاه مع عملاء CalDAV الآخرين

**استكشاف الأخطاء وإصلاحها:**

* إذا لم تظهر تقاويم المهام، حاول تحديث المزامنة يدويًا في إعدادات Tasks.org
* تأكد من وجود مهمة واحدة على الأقل تم إنشاؤها على الخادم (يمكنك إنشاء واحدة أولاً في تطبيق التذكيرات على macOS)
* تحقق من اتصال الشبكة بـ `caldav.forwardemail.net`

### كيف أقوم بإعداد SRS لـ Forward Email {#how-do-i-set-up-srs-for-forward-email}

نقوم تلقائيًا بتكوين [مخطط إعادة كتابة المرسل](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – لا تحتاج إلى القيام بذلك بنفسك.

### كيف أقوم بإعداد MTA-STS لـ Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

يرجى الرجوع إلى [قسمنا حول MTA-STS](#do-you-support-mta-sts) لمزيد من المعلومات.

### كيف أضيف صورة ملف شخصي إلى عنوان بريدي الإلكتروني {#how-do-i-add-a-profile-picture-to-my-email-address}

إذا كنت تستخدم Gmail، فاتبع الخطوات التالية:

1. اذهب إلى <https://google.com> وقم بتسجيل الخروج من جميع حسابات البريد الإلكتروني
2. انقر على "تسجيل الدخول" وفي القائمة المنسدلة اختر "حساب آخر"
3. اختر "استخدام حساب آخر"
4. اختر "إنشاء حساب"
5. اختر "استخدام عنوان بريدي الإلكتروني الحالي بدلاً من ذلك"
6. أدخل عنوان بريدك الإلكتروني الخاص بالنطاق المخصص
7. استلم رسالة التحقق المرسلة إلى بريدك الإلكتروني
8. أدخل رمز التحقق من هذه الرسالة
9. أكمل معلومات الملف الشخصي لحساب Google الجديد الخاص بك
10. وافق على جميع سياسات الخصوصية وشروط الاستخدام
11. اذهب إلى <https://google.com> وفي الزاوية العلوية اليمنى، انقر على أيقونة ملفك الشخصي، ثم انقر على زر "تغيير"
12. قم بتحميل صورة جديدة أو صورة رمزية لحسابك
13. ستستغرق التغييرات حوالي 1-2 ساعة للانتشار، ولكن قد تكون سريعة أحيانًا.
14. أرسل بريدًا إلكترونيًا تجريبيًا ويجب أن تظهر صورة الملف الشخصي.
## الميزات المتقدمة {#advanced-features}

### هل تدعم النشرات الإخبارية أو قوائم البريد الإلكتروني للبريد التسويقي {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

نعم، يمكنك قراءة المزيد على <https://forwardemail.net/guides/newsletter-with-listmonk>.

يرجى ملاحظة أنه للحفاظ على سمعة عنوان الـ IP وضمان إمكانية التسليم، لدى Forward Email عملية مراجعة يدوية على أساس كل نطاق من أجل **الموافقة على النشرة الإخبارية**. راسل البريد الإلكتروني <support@forwardemail.net> أو افتح [طلب مساعدة](https://forwardemail.net/help) للموافقة. عادةً ما تستغرق هذه العملية أقل من 24 ساعة، مع تنفيذ معظم الطلبات خلال 1-2 ساعة. في المستقبل القريب نهدف إلى جعل هذه العملية فورية مع ضوابط إضافية للبريد المزعج والتنبيهات. تضمن هذه العملية وصول رسائلك إلى صندوق الوارد وعدم تصنيفها كبريد مزعج.

### هل تدعم إرسال البريد الإلكتروني عبر API {#do-you-support-sending-email-with-api}

نعم، اعتبارًا من مايو 2023 ندعم إرسال البريد الإلكتروني عبر API كإضافة لجميع المستخدمين المدفوعين.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    يرجى التأكد من قراءة <a href="/terms" class="alert-link" target="_blank">الشروط</a>، <a href="/privacy" class="alert-link" target="_blank">سياسة الخصوصية</a>، و <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">حدود SMTP الصادرة</a> &ndash; يعتبر استخدامك إقرارًا وموافقة.
  </span>
</div>

يرجى الاطلاع على قسمنا الخاص بـ [البريد الإلكتروني](/email-api#outbound-emails) في توثيق API الخاص بنا للاطلاع على الخيارات، الأمثلة، والمزيد من المعلومات.

لإرسال البريد الإلكتروني الصادر باستخدام API الخاص بنا، يجب عليك استخدام رمز API الخاص بك المتوفر ضمن [أماني](/my-account/security).

### هل تدعم استقبال البريد الإلكتروني عبر IMAP {#do-you-support-receiving-email-with-imap}

نعم، اعتبارًا من 16 أكتوبر 2023 ندعم استقبال البريد الإلكتروني عبر IMAP كإضافة لجميع المستخدمين المدفوعين. **يرجى قراءة مقالنا المتعمق** حول [كيفية عمل ميزة تخزين صندوق البريد المشفر SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    يرجى التأكد من قراءة <a href="/terms" class="alert-link" target="_blank">الشروط</a> و <a href="/privacy" class="alert-link" target="_blank">سياسة الخصوصية</a> &ndash; يعتبر استخدامك إقرارًا وموافقة.
  </span>
</div>

1. أنشئ اسم مستعار جديد لنطاقك ضمن <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثلاً <code><hello@example.com></code>)

2. انقر على <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> بجانب الاسم المستعار الذي تم إنشاؤه حديثًا. انسخها إلى الحافظة واحتفظ بكلمة المرور المولدة بأمان كما هو معروض على الشاشة.

3. باستخدام تطبيق البريد الإلكتروني المفضل لديك، أضف أو قم بتكوين حساب باستخدام الاسم المستعار الذي أنشأته حديثًا (مثلاً <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       نصيحة:
     </strong>
     <span>نوصي باستخدام <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>، <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>، <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>، أو <a href="/blog/open-source" class="alert-link" target="_blank">بديل مفتوح المصدر ويركز على الخصوصية</a>.</span>
   </div>

4. عند طلب اسم خادم IMAP، أدخل `imap.forwardemail.net`

5. عند طلب منفذ خادم IMAP، أدخل `993` (SSL/TLS) – راجع [منافذ IMAP البديلة](/faq#what-are-your-imap-server-configuration-settings) إذا لزم الأمر
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       نصيحة:
     </strong>
     <span>إذا كنت تستخدم Thunderbird، فتأكد من تعيين "أمان الاتصال" إلى "SSL/TLS" وطريقة المصادقة إلى "كلمة مرور عادية".</span>
   </div>
6. عند طلب كلمة مرور خادم IMAP، الصق كلمة المرور من <strong class="text-success"><i class="fa fa-key"></i> توليد كلمة المرور</strong> في الخطوة 2 أعلاه

7. **احفظ إعداداتك** – إذا واجهت مشاكل، يرجى <a href="/help">الاتصال بنا</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      تهانينا!
    </strong>
    <span>
      لقد أكملت جميع الخطوات بنجاح.
    </span>
  </div>
</div>

</div>

### هل تدعم POP3 {#do-you-support-pop3}

نعم، اعتبارًا من 4 ديسمبر 2023 ندعم [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) كإضافة لجميع المستخدمين المدفوعين. **يرجى قراءة مقالنا المتعمق** حول [كيفية عمل ميزة تخزين صندوق البريد المشفر SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    يرجى التأكد من قراءة <a href="/terms" class="alert-link" target="_blank">الشروط</a> و <a href="/privacy" class="alert-link" target="_blank">سياسة الخصوصية</a> الخاصة بنا – يعتبر استخدامك إقرارًا وموافقة.
  </span>
</div>

1. أنشئ اسم مستعار جديد لنطاقك تحت <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثلاً <code><hello@example.com></code>)

2. انقر على <strong class="text-success"><i class="fa fa-key"></i> توليد كلمة المرور</strong> بجانب الاسم المستعار الذي تم إنشاؤه حديثًا. انسخها إلى الحافظة واحتفظ بكلمة المرور المولدة بأمان كما هو معروض على الشاشة.

3. باستخدام تطبيق البريد الإلكتروني المفضل لديك، أضف أو قم بتكوين حساب باستخدام الاسم المستعار الذي أنشأته حديثًا (مثلاً <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       نصيحة:
     </strong>
     <span>نوصي باستخدام <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>، <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>، <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>، أو <a href="/blog/open-source" class="alert-link" target="_blank">بديل مفتوح المصدر ويركز على الخصوصية</a>.</span>
   </div>

4. عند طلب اسم خادم POP3، أدخل `pop3.forwardemail.net`

5. عند طلب منفذ خادم POP3، أدخل `995` (SSL/TLS) – راجع [منافذ POP3 البديلة](/faq#what-are-your-pop3-server-configuration-settings) إذا لزم الأمر
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       نصيحة:
     </strong>
     <span>إذا كنت تستخدم Thunderbird، فتأكد من تعيين "أمان الاتصال" إلى "SSL/TLS" وطريقة المصادقة إلى "كلمة مرور عادية".</span>
   </div>

6. عند طلب كلمة مرور خادم POP3، الصق كلمة المرور من <strong class="text-success"><i class="fa fa-key"></i> توليد كلمة المرور</strong> في الخطوة 2 أعلاه

7. **احفظ إعداداتك** – إذا واجهت مشاكل، يرجى <a href="/help">الاتصال بنا</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      تهانينا!
    </strong>
    <span>
      لقد أكملت جميع الخطوات بنجاح.
    </span>
  </div>
</div>

</div>

### هل تدعم التقويمات (CalDAV) {#do-you-support-calendars-caldav}

نعم، اعتبارًا من 5 فبراير 2024 أضفنا هذه الميزة. خادمنا هو `caldav.forwardemail.net` ويتم مراقبته أيضًا على <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">صفحة الحالة</a> الخاصة بنا.
يدعم كل من IPv4 و IPv6 ومتوفّر عبر المنفذ `443` (HTTPS).

| تسجيل الدخول | مثال                      | الوصف                                                                                                                                                                                    |
| ------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| اسم المستخدم | `user@example.com`        | عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>.          |
| كلمة المرور  | `************************` | كلمة مرور مولدة خاصة بالاسم المستعار.                                                                                                                                                     |

لاستخدام دعم التقويم، يجب أن يكون **المستخدم** هو عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> – ويجب أن تكون **كلمة المرور** كلمة مرور مولدة خاصة بالاسم المستعار.

### هل تدعم المهام والتذكيرات (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

نعم، اعتبارًا من 14 أكتوبر 2025 أضفنا دعم CalDAV VTODO للمهام والتذكيرات. يستخدم هذا نفس الخادم الخاص بدعم التقويم لدينا: `caldav.forwardemail.net`.

يدعم خادم CalDAV الخاص بنا كل من مكونات أحداث التقويم (VEVENT) والمهام (VTODO) باستخدام **التقويمات الموحدة**. هذا يعني أن كل تقويم يمكن أن يحتوي على كل من الأحداث والمهام، مما يوفر أقصى قدر من المرونة والتوافق عبر جميع عملاء CalDAV.

**كيف تعمل التقويمات والقوائم:**

* **كل تقويم يدعم كل من الأحداث والمهام** - يمكنك إضافة أحداث، مهام، أو كلاهما إلى أي تقويم
* **قوائم تذكيرات Apple** - كل قائمة تنشئها في تذكيرات Apple تصبح تقويمًا منفصلًا على الخادم
* **تقويمات متعددة** - يمكنك إنشاء عدد من التقويمات حسب حاجتك، لكل منها اسمه ولونه وتنظيمه الخاص
* **مزامنة عبر العملاء** - تتزامن المهام والأحداث بسلاسة بين جميع العملاء المتوافقين

**عملاء المهام المدعومون:**

* **تذكيرات macOS** - دعم كامل لإنشاء المهام وتحريرها وإكمالها والمزامنة
* **تذكيرات iOS** - دعم كامل عبر جميع أجهزة iOS
* **Tasks.org (أندرويد)** - مدير مهام مفتوح المصدر شهير مع مزامنة CalDAV
* **Thunderbird** - دعم المهام والتقويم في عميل البريد الإلكتروني على سطح المكتب
* **أي مدير مهام متوافق مع CalDAV** - دعم مكون VTODO القياسي

**ميزات المهام المدعومة:**

* إنشاء المهام وتحريرها وحذفها
* تواريخ الاستحقاق وتواريخ البدء
* حالة إكمال المهمة (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* مستويات أولوية المهام
* المهام المتكررة
* أوصاف وملاحظات المهام
* المزامنة عبر أجهزة متعددة
* المهام الفرعية مع خاصية RELATED-TO
* تذكيرات المهام مع VALARM

بيانات تسجيل الدخول هي نفسها المستخدمة لدعم التقويم:

| تسجيل الدخول | مثال                      | الوصف                                                                                                                                                                                    |
| ------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| اسم المستخدم | `user@example.com`        | عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>.          |
| كلمة المرور  | `************************` | كلمة مرور مولدة خاصة بالاسم المستعار.                                                                                                                                                     |

**ملاحظات مهمة:**

* **كل قائمة تذكيرات هي تقويم منفصل** - عند إنشاء قائمة جديدة في تذكيرات Apple، يتم إنشاء تقويم جديد على خادم CalDAV
* **مستخدمو Thunderbird** - ستحتاج إلى الاشتراك يدويًا في كل تقويم/قائمة تريد مزامنتها، أو استخدام عنوان URL الرئيسي للتقويم: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **مستخدمو Apple** - يتم اكتشاف التقويم تلقائيًا، لذا ستظهر جميع تقاويمك وقوائمك في Calendar.app و Reminders.app
* **التقويمات الموحدة** - جميع التقويمات تدعم كل من الأحداث والمهام، مما يمنحك مرونة في كيفية تنظيم بياناتك
### هل تدعم جهات الاتصال (CardDAV) {#do-you-support-contacts-carddav}

نعم، اعتبارًا من 12 يونيو 2025 أضفنا هذه الميزة. خادمنا هو `carddav.forwardemail.net` ويتم مراقبته أيضًا على <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">صفحة الحالة</a> الخاصة بنا.

يدعم كل من IPv4 و IPv6 ومتاح عبر المنفذ `443` (HTTPS).

| تسجيل الدخول | مثال                      | الوصف                                                                                                                                                                                    |
| ------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| اسم المستخدم | `user@example.com`        | عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>.          |
| كلمة المرور  | `************************` | كلمة مرور مولدة خاصة بالاسم المستعار.                                                                                                                                                     |

لاستخدام دعم جهات الاتصال، يجب أن يكون **المستخدم** هو عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> – ويجب أن تكون **كلمة المرور** كلمة مرور مولدة خاصة بالاسم المستعار.

### هل تدعم إرسال البريد الإلكتروني عبر SMTP {#do-you-support-sending-email-with-smtp}

نعم، اعتبارًا من مايو 2023 ندعم إرسال البريد الإلكتروني عبر SMTP كإضافة لجميع المستخدمين المدفوعين.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    يرجى التأكد من قراءة <a href="/terms" class="alert-link" target="_blank">الشروط</a>، <a href="/privacy" class="alert-link" target="_blank">سياسة الخصوصية</a>، و <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">حدود SMTP الصادرة</a> – يعتبر استخدامك إقرارًا وموافقة.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    إذا كنت تستخدم Gmail، فراجع <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">دليل إرسال البريد كـ Gmail</a>. إذا كنت مطورًا، فراجع <a class="alert-link" href="/email-api#outbound-emails" target="_blank">وثائق API البريد الإلكتروني</a>.
  </span>
</div>

1. اذهب إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> تكوين SMTP الصادر واتبع تعليمات الإعداد

2. أنشئ اسم مستعار جديد لنطاقك تحت <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثلاً <code><hello@example.com></code>)

3. انقر على <strong class="text-success"><i class="fa fa-key"></i> توليد كلمة مرور</strong> بجانب الاسم المستعار الذي تم إنشاؤه حديثًا. انسخها إلى الحافظة واحتفظ بكلمة المرور المولدة بأمان كما هو معروض على الشاشة.

4. باستخدام تطبيق البريد الإلكتروني المفضل لديك، أضف أو قم بتكوين حساب باستخدام الاسم المستعار الذي أنشأته حديثًا (مثلاً <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       نصيحة:
     </strong>
     <span>نوصي باستخدام <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>، <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>، <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>، أو <a href="/blog/open-source" class="alert-link" target="_blank">بديل مفتوح المصدر ويركز على الخصوصية</a>.</span>
   </div>
5. عند طلب اسم خادم SMTP، أدخل `smtp.forwardemail.net`

6. عند طلب منفذ خادم SMTP، أدخل `465` (SSL/TLS) – راجع [منافذ SMTP البديلة](/faq#what-are-your-smtp-server-configuration-settings) إذا لزم الأمر
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       نصيحة:
     </strong>
     <span>إذا كنت تستخدم Thunderbird، فتأكد من تعيين "أمان الاتصال" إلى "SSL/TLS" وطريقة المصادقة إلى "كلمة مرور عادية".</span>
   </div>

7. عند طلب كلمة مرور خادم SMTP، الصق كلمة المرور من <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> في الخطوة 3 أعلاه

8. **احفظ إعداداتك وأرسل أول بريد إلكتروني تجريبي** – إذا واجهت مشاكل، يرجى <a href="/help">الاتصال بنا</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    يرجى ملاحظة أنه للحفاظ على سمعة عنوان IP وضمان إمكانية التسليم، لدينا عملية مراجعة يدوية على أساس كل نطاق للموافقة على SMTP الصادر. عادةً ما تستغرق هذه العملية أقل من 24 ساعة، مع تلبية معظم الطلبات خلال 1-2 ساعة. في المستقبل القريب، نهدف إلى جعل هذه العملية فورية مع ضوابط إضافية للبريد المزعج والتنبيهات. تضمن هذه العملية وصول رسائلك إلى صندوق الوارد وعدم تصنيف رسائلك كبريد مزعج.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      تهانينا!
    </strong>
    <span>
      لقد أكملت جميع الخطوات بنجاح.
    </span>
  </div>
</div>

</div>

### هل تدعمون OpenPGP/MIME، التشفير من طرف إلى طرف ("E2EE")، ودليل مفاتيح الويب ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

نعم، نحن ندعم [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP)، و[التشفير من طرف إلى طرف ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption)، واكتشاف المفاتيح العامة باستخدام [دليل مفاتيح الويب ("WKD")](https://wiki.gnupg.org/WKD). يمكنك تكوين OpenPGP باستخدام [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) أو [استضافة مفاتيحك الخاصة](https://wiki.gnupg.org/WKDHosting) (راجع [هذا الجيست لإعداد خادم WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* يتم تخزين نتائج بحث WKD مؤقتًا لمدة ساعة لضمان تسليم البريد الإلكتروني في الوقت المناسب → لذلك إذا أضفت أو غيرت أو أزلت مفتاح WKD الخاص بك، يرجى مراسلتنا عبر البريد الإلكتروني على `support@forwardemail.net` مع عنوان بريدك الإلكتروني لكي نقوم بمسح التخزين المؤقت يدويًا.
* نحن ندعم تشفير PGP للرسائل التي يتم إعادة توجيهها عبر بحث WKD أو باستخدام مفتاح PGP مرفوع على واجهتنا.
* المفاتيح المرفوعة لها الأولوية طالما تم تفعيل/تحديد خانة PGP.
* الرسائل المرسلة إلى webhooks غير مشفرة حاليًا باستخدام PGP.
* إذا كان لديك عدة ألقاب تطابق عنوان إعادة التوجيه المعطى (مثل تعبيرات عادية/رموز بدل/مزيج دقيق) وإذا كان أكثر من واحد منها يحتوي على مفتاح PGP مرفوع وتم تحديد PGP → فسوف نرسل لك رسالة تنبيه خطأ ولن نقوم بتشفير الرسالة باستخدام مفتاح PGP المرفوع الخاص بك. هذا نادر جدًا وعادةً ما ينطبق فقط على المستخدمين المتقدمين الذين لديهم قواعد ألقاب معقدة.
* **لن يتم تطبيق تشفير PGP على إعادة توجيه البريد الإلكتروني عبر خوادم MX الخاصة بنا إذا كان المرسل لديه سياسة DMARC بالرفض. إذا كنت تحتاج إلى تشفير PGP على *كل* البريد، فنقترح استخدام خدمة IMAP الخاصة بنا وتكوين مفتاح PGP الخاص بك للقب الخاص بك للبريد الوارد.**

**يمكنك التحقق من إعداد دليل مفاتيح الويب الخاص بك على <https://wkd.chimbosonic.com/> (مفتوح المصدر) أو <https://www.webkeydirectory.com/> (خاص).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    التشفير التلقائي:
  </strong>
  <span>إذا كنت تستخدم <a href="#do-you-support-sending-email-with-smtp" class="alert-link">خدمة SMTP الصادرة</a> الخاصة بنا وترسل رسائل غير مشفرة، فسوف نحاول تلقائيًا تشفير الرسائل على أساس كل مستلم باستخدام <a class="alert-link" href="https://wiki.gnupg.org/WKD">دليل مفاتيح الويب ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    يجب عليك اتباع جميع الخطوات التالية لتمكين OpenPGP لنطاقك المخصص.
  </span>
</div>

1. قم بتنزيل وتثبيت الإضافة الموصى بها لعميل البريد الإلكتروني الخاص بك أدناه:

   | عميل البريد الإلكتروني | النظام الأساسي | الإضافة الموصى بها                                                                                                                                                                    | ملاحظات                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | ---------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird            | سطح المكتب     | [تكوين OpenPGP في Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | يحتوي Thunderbird على دعم مدمج لـ OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                            |
   | Gmail                  | المتصفح        | [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download) (ترخيص ملكية)                                                                                     | لا يدعم Gmail OpenPGP، ولكن يمكنك تنزيل الإضافة مفتوحة المصدر [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                    |
   | Apple Mail             | macOS          | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | لا يدعم Apple Mail OpenPGP، ولكن يمكنك تنزيل الإضافة مفتوحة المصدر [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                       |
   | Apple Mail             | iOS            | [PGPro](https://github.com/opensourceios/PGPro/) أو [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (ترخيص ملكية)                                  | لا يدعم Apple Mail OpenPGP، ولكن يمكنك تنزيل الإضافة مفتوحة المصدر [PGPro](https://github.com/opensourceios/PGPro/) أو [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                    |
   | Outlook                | Windows        | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | لا يدعم عميل البريد المكتبي Outlook OpenPGP، ولكن يمكنك تنزيل الإضافة مفتوحة المصدر [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                    |
   | Outlook                | المتصفح        | [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download) (ترخيص ملكية)                                                                                     | لا يدعم عميل البريد الإلكتروني عبر الويب Outlook OpenPGP، ولكن يمكنك تنزيل الإضافة مفتوحة المصدر [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                          |
   | Android                | الجوال         | [OpenKeychain](https://www.openkeychain.org/) أو [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [عملاء البريد الإلكتروني على أندرويد](/blog/open-source/android-email-clients) مثل [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) و [FairEmail](https://github.com/M66B/FairEmail) يدعمان الإضافة مفتوحة المصدر [OpenKeychain](https://www.openkeychain.org/). يمكنك بدلاً من ذلك استخدام الإضافة مفتوحة المصدر (ترخيص ملكية) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome          | المتصفح        | [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download) (ترخيص ملكية)                                                                                     | يمكنك تنزيل إضافة المتصفح مفتوحة المصدر [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Mozilla Firefox        | المتصفح        | [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download) (ترخيص ملكية)                                                                                     | يمكنك تنزيل إضافة المتصفح مفتوحة المصدر [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Microsoft Edge         | المتصفح        | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | يمكنك تنزيل إضافة المتصفح مفتوحة المصدر [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                                |
   | Brave                  | المتصفح        | [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download) (ترخيص ملكية)                                                                                     | يمكنك تنزيل إضافة المتصفح مفتوحة المصدر [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Balsa                  | سطح المكتب     | [تكوين OpenPGP في Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                                | يحتوي Balsa على دعم مدمج لـ OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | KMail                  | سطح المكتب     | [تكوين OpenPGP في KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                   | يحتوي KMail على دعم مدمج لـ OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | GNOME Evolution        | سطح المكتب     | [تكوين OpenPGP في Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                                   | يحتوي GNOME Evolution على دعم مدمج لـ OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Terminal               | سطح المكتب     | [تكوين gpg في Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                             | يمكنك استخدام أداة سطر الأوامر مفتوحة المصدر [gpg](https://www.gnupg.org/download/) لإنشاء مفتاح جديد من خلال سطر الأوامر.                                                                                                                                                                                                                                                                                                            |
2. افتح الإضافة، أنشئ مفتاحك العام، وقم بتكوين عميل البريد الإلكتروني الخاص بك لاستخدامه.

3. قم بتحميل مفتاحك العام على <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       نصيحة:
     </strong>
     <span>يمكنك زيارة <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> لإدارة مفتاحك في المستقبل.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       إضافة اختيارية:
     </strong>
     <span>
       إذا كنت تستخدم خدمتنا <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">لتخزين مشفر (IMAP/POP3)</a> وترغب في أن يتم تشفير <i>كل</i> البريد الإلكتروني المخزن في قاعدة بيانات SQLite الخاصة بك (وهي مشفرة بالفعل) باستخدام مفتاحك العام، فانتقل إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثل <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> تحرير <i class="fa fa-angle-right"></i> OpenPGP وقم بتحميل مفتاحك العام.
     </span>
   </div>

4. أضف سجل `CNAME` جديد إلى اسم نطاقك (مثلاً `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>الاسم/المضيف/الاسم المستعار</th>
         <th class="text-center">TTL</th>
         <th>النوع</th>
         <th>الإجابة/القيمة</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td><code>openpgpkey</code></td>
         <td class="text-center">3600</td>
         <td class="notranslate">CNAME</td>
         <td><code>wkd.keys.openpgp.org</code></td>
       </tr>
     </tbody>
   </table>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       نصيحة:
     </strong>
     <span>إذا كان الاسم المستعار الخاص بك يستخدم <a class="alert-link" href="/disposable-addresses" target="_blank">نطاقات مزيفة/مؤقتة</a> (مثل <code>hideaddress.net</code>)، فيمكنك تخطي هذه الخطوة.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      تهانينا!
    </strong>
    <span>
      لقد أكملت جميع الخطوات بنجاح.
    </span>
  </div>
</div>

### هل تدعمون تشفير S/MIME {#do-you-support-smime-encryption}

نعم، نحن ندعم تشفير [S/MIME (امتدادات البريد الإلكتروني الآمنة/متعددة الأغراض)](https://en.wikipedia.org/wiki/S/MIME) كما هو معرف في [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). يوفر S/MIME تشفيرًا من طرف إلى طرف باستخدام شهادات X.509، والتي تحظى بدعم واسع من قبل عملاء البريد الإلكتروني المؤسسيين.

ندعم كل من شهادات RSA و ECC (التشفير بمنحنيات إهليلجية):

* **شهادات RSA**: الحد الأدنى 2048 بت، ويوصى بـ 4096 بت
* **شهادات ECC**: منحنيات NIST P-256، P-384، و P-521

لتكوين تشفير S/MIME لاسمك المستعار:

1. احصل على شهادة S/MIME من سلطة شهادات موثوقة (CA) أو أنشئ شهادة موقعة ذاتيًا للاختبار.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       نصيحة:
     </strong>
     <span>شهادات S/MIME المجانية متوفرة من مزودين مثل <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> أو <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. صدّر شهادتك بصيغة PEM (الشهادة العامة فقط، وليس المفتاح الخاص).

3. اذهب إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثل <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> تحرير <i class="fa fa-angle-right"></i> S/MIME وقم بتحميل شهادتك العامة.
4. بمجرد التكوين، سيتم تشفير جميع الرسائل الواردة إلى الاسم المستعار الخاص بك باستخدام شهادة S/MIME الخاصة بك قبل تخزينها أو إعادة توجيهها.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ملاحظة:
     </strong>
     <span>
       يتم تطبيق تشفير S/MIME على الرسائل الواردة التي لم يتم تشفيرها مسبقًا. إذا كانت الرسالة مشفرة بالفعل باستخدام OpenPGP أو S/MIME، فلن يتم إعادة تشفيرها.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       هام:
     </strong>
     <span>
       لن يتم تطبيق تشفير S/MIME على إعادة توجيه البريد الإلكتروني عبر خوادم MX الخاصة بنا إذا كان لدى المرسل سياسة DMARC بالرفض. إذا كنت تحتاج إلى تشفير S/MIME على <em>جميع</em> الرسائل، فنقترح استخدام خدمة IMAP الخاصة بنا وتكوين شهادة S/MIME الخاصة بك للاسم المستعار للبريد الوارد.
     </span>
   </div>

عملاء البريد الإلكتروني التالية لديهم دعم مدمج لـ S/MIME:

| عميل البريد الإلكتروني | النظام الأساسي | ملاحظات                                                                                                               |
| --------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| Apple Mail            | macOS          | دعم مدمج لـ S/MIME. اذهب إلى Mail > Preferences > Accounts > حسابك > Trust لتكوين الشهادات.                            |
| Apple Mail            | iOS            | دعم مدمج لـ S/MIME. اذهب إلى Settings > Mail > Accounts > حسابك > Advanced > S/MIME للتكوين.                           |
| Microsoft Outlook     | Windows        | دعم مدمج لـ S/MIME. اذهب إلى File > Options > Trust Center > Trust Center Settings > Email Security للتكوين.           |
| Microsoft Outlook     | macOS          | دعم مدمج لـ S/MIME. اذهب إلى Tools > Accounts > Advanced > Security للتكوين.                                           |
| Thunderbird           | Desktop        | دعم مدمج لـ S/MIME. اذهب إلى Account Settings > End-To-End Encryption > S/MIME للتكوين.                                |
| GNOME Evolution       | Desktop        | دعم مدمج لـ S/MIME. اذهب إلى Edit > Preferences > Mail Accounts > حسابك > Security للتكوين.                            |
| KMail                 | Desktop        | دعم مدمج لـ S/MIME. اذهب إلى Settings > Configure KMail > Identities > هويتك > Cryptography للتكوين.                    |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      تهانينا!
    </strong>
    <span>
      لقد قمت بتكوين تشفير S/MIME بنجاح للاسم المستعار الخاص بك.
    </span>
  </div>
</div>

### هل تدعمون تصفية البريد الإلكتروني باستخدام Sieve {#do-you-support-sieve-email-filtering}

نعم! نحن ندعم تصفية البريد الإلكتروني باستخدام [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) كما هو معرف في [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve هي لغة برمجة معيارية وقوية لتصفية البريد الإلكتروني على الخادم تتيح لك تنظيم الرسائل الواردة وتصفيتها والرد عليها تلقائيًا.

#### امتدادات Sieve المدعومة {#supported-sieve-extensions}

ندعم مجموعة شاملة من امتدادات Sieve:

| الامتداد                    | RFC                                                                                     | الوصف                                           |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | حفظ الرسائل في مجلدات محددة                      |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                               | رفض الرسائل مع رسالة خطأ                         |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                               | ردود تلقائية للعطلات/خارج المكتب                 |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                               | فترات استجابة دقيقة للردود التلقائية             |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                               | تعيين علامات IMAP (\Seen, \Flagged, إلخ)         |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | اختبار مرسل/مستلم الظرف                           |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                               | اختبار محتوى جسم الرسالة                         |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                               | تخزين واستخدام المتغيرات في السكريبتات           |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                               | مقارنات علاقية (أكبر من، أصغر من)                |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                               | مقارنات رقمية                                    |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                               | نسخ الرسائل أثناء إعادة التوجيه                   |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                               | إضافة أو حذف رؤوس الرسائل                         |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | اختبار قيم التاريخ/الوقت                         |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | الوصول إلى تكرارات رؤوس محددة                      |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)  | مطابقة التعبيرات النمطية                          |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                               | إرسال الإشعارات (مثل mailto:)                     |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                               | الوصول إلى معلومات البيئة                         |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                               | اختبار وجود صندوق البريد، إنشاء صناديق بريد       |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                               | حفظ في صناديق بريد خاصة الاستخدام (\Junk, \Trash) |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                               | اكتشاف الرسائل المكررة                            |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                               | اختبار توفر الامتداد                              |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                               | الوصول إلى أجزاء عنوان المستخدم+التفاصيل         |
#### الإضافات غير المدعومة {#extensions-not-supported}

الإضافات التالية غير مدعومة حالياً:

| الإضافة                                                        | السبب                                                               |
| ------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                     | خطر أمني (حقن سكريبت) ويتطلب تخزين سكريبت عالمي                   |
| `mboxmetadata` / `servermetadata`                             | يتطلب دعم إضافة IMAP METADATA                                      |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | لم يتم تنفيذ معالجة شجرة MIME المعقدة بعد                           |

#### أمثلة على سكريبتات Sieve {#example-sieve-scripts}

**تصنيف النشرات الإخبارية في مجلد:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**الرد التلقائي أثناء الإجازة:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "أنا حالياً خارج المكتب وسأرد عند عودتي.";
```

**تمييز الرسائل من مرسلين مهمين:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**رفض الرسائل المزعجة ذات المواضيع المحددة:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "تم رفض الرسالة بسبب محتوى مزعج.";
}
```

#### إدارة سكريبتات Sieve {#managing-sieve-scripts}

يمكنك إدارة سكريبتات Sieve الخاصة بك بعدة طرق:

1. **واجهة الويب**: اذهب إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة <i class="fa fa-angle-right"></i> سكريبتات Sieve لإنشاء وإدارة السكريبتات.

2. **بروتوكول ManageSieve**: اتصل باستخدام أي عميل متوافق مع ManageSieve (مثل إضافة Sieve لثندربرد أو [sieve-connect](https://github.com/philpennock/sieve-connect)) إلى `imap.forwardemail.net`. استخدم المنفذ `2190` مع STARTTLS (موصى به لمعظم العملاء) أو المنفذ `4190` مع TLS ضمني.

3. **واجهة برمجة التطبيقات (API)**: استخدم [REST API](/api#sieve-scripts) لإدارة السكريبتات برمجياً.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ملاحظة:
  </strong>
  <span>
    يتم تطبيق تصفية Sieve على الرسائل الواردة قبل تخزينها في صندوق بريدك. يتم تنفيذ السكريبتات حسب الأولوية، وتحدد أول عملية مطابقة كيفية التعامل مع الرسالة.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    الأمان:
  </strong>
  <span>
    لأسباب أمنية، تقتصر عمليات إعادة التوجيه على 10 لكل سكريبت و100 يومياً. يتم تحديد معدل الردود التلقائية لمنع سوء الاستخدام.
  </span>
</div>

### هل تدعمون MTA-STS {#do-you-support-mta-sts}

نعم، اعتباراً من 2 مارس 2023 ندعم [MTA-STS](https://www.hardenize.com/blog/mta-sts). يمكنك استخدام [هذا القالب](https://github.com/jpawlowski/mta-sts.template) إذا رغبت في تفعيله على نطاقك.

يمكن العثور على إعداداتنا علناً على GitHub في <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### هل تدعمون مفاتيح المرور وWebAuthn {#do-you-support-passkeys-and-webauthn}

نعم! اعتباراً من 13 ديسمبر 2023 أضفنا دعم مفاتيح المرور [بسبب الطلب الكبير](https://github.com/orgs/forwardemail/discussions/182).

تسمح لك مفاتيح المرور بتسجيل الدخول بأمان دون الحاجة إلى كلمة مرور أو مصادقة ثنائية.

يمكنك التحقق من هويتك باستخدام اللمس، التعرف على الوجه، كلمة مرور الجهاز، أو رمز PIN.

نسمح لك بإدارة حتى 30 مفتاح مرور في آن واحد، بحيث يمكنك تسجيل الدخول بكل أجهزتك بسهولة.

تعرف على المزيد حول مفاتيح المرور من الروابط التالية:

* [تسجيل الدخول إلى تطبيقاتك ومواقعك باستخدام مفاتيح المرور](https://support.google.com/android/answer/14124480?hl=en) (جوجل)
* [استخدام مفاتيح المرور لتسجيل الدخول إلى التطبيقات والمواقع على iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (آبل)
* [مقال ويكيبيديا عن مفاتيح المرور](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### هل تدعم أفضل ممارسات البريد الإلكتروني {#do-you-support-email-best-practices}

نعم. لدينا دعم مدمج لـ SPF و DKIM و DMARC و ARC و SRS عبر جميع الخطط. كما عملنا بشكل مكثف مع المؤلفين الأصليين لهذه المواصفات وخبراء البريد الإلكتروني الآخرين لضمان الكمال والتسليم العالي.

### هل تدعم webhooks للارتداد {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
    هل تبحث عن توثيق حول webhooks البريد الإلكتروني؟ انظر <a href="/faq#do-you-support-webhooks" class="alert-link">هل تدعم webhooks؟</a> لمزيد من المعلومات.
  <span>
  </span>
</div>

نعم، اعتبارًا من 14 أغسطس 2024 أضفنا هذه الميزة. يمكنك الآن الذهاب إلى حسابي → النطاقات → الإعدادات → عنوان URL الخاص بـ Bounce Webhook وتكوين عنوان URL يبدأ بـ `http://` أو `https://` سنرسل إليه طلب `POST` كلما ارتدت رسائل SMTP الصادرة.

هذا مفيد لإدارة ومراقبة SMTP الصادر الخاص بك – ويمكن استخدامه للحفاظ على المشتركين، وإلغاء الاشتراك، واكتشاف متى تحدث الارتدادات.

يتم إرسال بيانات الارتداد كـ JSON بالخصائص التالية:

* `email_id` (سلسلة) - معرف البريد الإلكتروني الذي يتوافق مع بريد إلكتروني في حسابي → الرسائل (SMTP الصادر)
* `list_id` (سلسلة) - قيمة رأس `List-ID` (غير حساسة لحالة الأحرف)، إن وجدت، من البريد الإلكتروني الأصلي الصادر
* `list_unsubscribe` (سلسلة) - قيمة رأس `List-Unsubscribe` (غير حساسة لحالة الأحرف)، إن وجدت، من البريد الإلكتروني الأصلي الصادر
* `feedback_id` (سلسلة) - قيمة رأس `Feedback-ID` (غير حساسة لحالة الأحرف)، إن وجدت، من البريد الإلكتروني الأصلي الصادر
* `recipient` (سلسلة) - عنوان البريد الإلكتروني للمستلم الذي ارتد أو حدث له خطأ
* `message` (سلسلة) - رسالة خطأ مفصلة للارتداد
* `response` (سلسلة) - رسالة استجابة SMTP
* `response_code` (رقم) - رمز استجابة SMTP المحلل
* `truth_source` (سلسلة) - إذا كان رمز الاستجابة من مصدر موثوق، سيتم ملء هذه القيمة باسم النطاق الجذري (مثل `google.com` أو `yahoo.com`)
* `bounce` (كائن) - كائن يحتوي على الخصائص التالية التي توضح حالة الارتداد والرفض
  * `action` (سلسلة) - إجراء الارتداد (مثل `"reject"`)
  * `message` (سلسلة) - سبب الارتداد (مثل `"Message Sender Blocked By Receiving Server"`)
  * `category` (سلسلة) - فئة الارتداد (مثل `"block"`)
  * `code` (رقم) - رمز حالة الارتداد (مثل `554`)
  * `status` (سلسلة) - رمز الارتداد من رسالة الاستجابة (مثل `5.7.1`)
  * `line` (رقم) - رقم السطر المحلل، إن وجد، [من قائمة تحليل الارتداد Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (مثل `526`)
* `headers` (كائن) - أزواج المفتاح والقيمة لرؤوس البريد الإلكتروني الصادر
* `bounced_at` (سلسلة) - تاريخ بتنسيق [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) لوقت حدوث خطأ الارتداد

على سبيل المثال:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

إليك بعض الملاحظات الإضافية بخصوص webhooks الارتداد:

* إذا كانت بيانات webhook تحتوي على قيمة `list_id` أو `list_unsubscribe` أو `feedback_id`، فيجب عليك اتخاذ الإجراء المناسب لإزالة `recipient` من القائمة إذا لزم الأمر.
  * إذا كانت قيمة `bounce.category` واحدة من `"block"` أو `"recipient"` أو `"spam"` أو `"virus"`، فيجب بالتأكيد إزالة المستخدم من القائمة.
* إذا كنت بحاجة للتحقق من بيانات webhook (للتأكد من أنها تأتي فعلاً من خادمنا)، يمكنك [حل اسم مضيف عنوان IP الخاص بالعميل عن طريق البحث العكسي](https://nodejs.org/api/dns.html#dnspromisesreverseip) – يجب أن يكون `smtp.forwardemail.net`.
  * يمكنك أيضًا التحقق من IP مقابل [عناوين IP المنشورة لدينا](#what-are-your-servers-ip-addresses).
  * اذهب إلى حسابي → النطاقات → الإعدادات → مفتاح التحقق من توقيع بيانات webhook للحصول على مفتاح webhook الخاص بك.
    * يمكنك تدوير هذا المفتاح في أي وقت لأسباب أمنية.
    * احسب وقارن قيمة `X-Webhook-Signature` من طلب webhook الخاص بنا مع القيمة المحسوبة للجسم باستخدام هذا المفتاح. مثال على كيفية القيام بذلك متاح في [هذا المنشور على Stack Overflow](https://stackoverflow.com/a/68885281).
  * راجع النقاش في <https://github.com/forwardemail/free-email-forwarding/issues/235> لمزيد من المعلومات.
* سننتظر حتى `5` ثوانٍ لاستجابة نقطة نهاية webhook الخاصة بك بحالة `200`، وسنحاول إعادة الإرسال حتى `1` مرة.
* إذا اكتشفنا أن عنوان URL الخاص بـ bounce webhook يحتوي على خطأ أثناء محاولة إرسال طلب إليه، فسنرسل لك بريدًا إلكترونيًا مجاملة مرة واحدة في الأسبوع.
### هل تدعم الويب هوكس {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
    هل تبحث عن توثيق حول ويب هوكس الارتداد؟ انظر <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">هل تدعم ويب هوكس الارتداد؟</a> لمزيد من المعلومات.
  <span>
  </span>
</div>

نعم، اعتبارًا من 15 مايو 2020 أضفنا هذه الميزة. يمكنك ببساطة إضافة ويب هوك(ات) تمامًا كما تفعل مع أي مستلم! يرجى التأكد من أن عنوان URL الخاص بالويب هوك يبدأ ببروتوكول "http" أو "https".

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    حماية خصوصية محسنة:
  </strong>
  <span>
    إذا كنت على خطة مدفوعة (تتميز بحماية خصوصية محسنة)، فالرجاء الذهاب إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> والنقر على "الأسماء المستعارة" بجانب نطاقك لتكوين الويب هوكس الخاصة بك. إذا كنت ترغب في معرفة المزيد عن الخطط المدفوعة، راجع صفحة <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">التسعير</a> الخاصة بنا. وإلا يمكنك متابعة التعليمات أدناه.
  </span>
</div>

إذا كنت على الخطة المجانية، فما عليك سوى إضافة سجل DNS <strong class="notranslate">TXT</strong> جديد كما هو موضح أدناه:

على سبيل المثال، إذا أردت أن يتم إعادة توجيه جميع الرسائل التي تذهب إلى `alias@example.com` إلى نقطة اختبار [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) جديدة:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

أو ربما تريد أن يتم إعادة توجيه جميع الرسائل التي تذهب إلى `example.com` إلى هذه النقطة:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**إليك ملاحظات إضافية بخصوص الويب هوكس:**

* إذا كنت بحاجة للتحقق من حمولة الويب هوك (للتأكد من أنها فعلاً قادمة من خادمنا)، يمكنك [حل اسم مضيف العميل البعيد باستخدام بحث عكسي](https://nodejs.org/api/dns.html#dnspromisesreverseip) – يجب أن يكون إما `mx1.forwardemail.net` أو `mx2.forwardemail.net`.
  * يمكنك أيضًا التحقق من عنوان الـ IP مقابل [عناوين IP المنشورة لدينا](#what-are-your-servers-ip-addresses).
  * إذا كنت على خطة مدفوعة، فاذهب إلى حسابي → النطاقات → الإعدادات → مفتاح التحقق من توقيع الويب هوك للحصول على مفتاح الويب هوك الخاص بك.
    * يمكنك تدوير هذا المفتاح في أي وقت لأسباب أمنية.
    * احسب وقارن قيمة `X-Webhook-Signature` من طلب الويب هوك الخاص بنا مع القيمة المحسوبة للجسم باستخدام هذا المفتاح. مثال على كيفية القيام بذلك متاح في [هذا المنشور على Stack Overflow](https://stackoverflow.com/a/68885281).
  * راجع النقاش في <https://github.com/forwardemail/free-email-forwarding/issues/235> لمزيد من المعلومات.
* إذا لم يستجب الويب هوك برمز حالة `200`، فسنخزن استجابته في [سجل الأخطاء الذي تم إنشاؤه](#do-you-store-error-logs) – وهو مفيد لأغراض التصحيح.
* ستتم محاولة طلبات HTTP للويب هوك حتى 3 مرات في كل محاولة اتصال SMTP، مع مهلة قصوى 60 ثانية لكل طلب POST للنقطة النهائية. **لاحظ أن هذا لا يعني أنه يعيد المحاولة 3 مرات فقط**، بل سيستمر في إعادة المحاولة بمرور الوقت عن طريق إرسال رمز SMTP 421 (الذي يشير إلى المرسل لإعادة المحاولة لاحقًا) بعد محاولة طلب POST HTTP الثالثة الفاشلة. هذا يعني أن البريد الإلكتروني سيحاول إعادة الإرسال باستمرار لأيام حتى يتم تحقيق رمز حالة 200.
* سنعيد المحاولة تلقائيًا بناءً على رموز الحالة والأخطاء الافتراضية المستخدمة في [طريقة إعادة المحاولة في superagent](https://ladjs.github.io/superagent/#retrying-requests) (نحن من صانعيها).
* نجمع طلبات HTTP للويب هوك إلى نفس النقطة النهائية في طلب واحد بدلاً من عدة طلبات لتوفير الموارد وتسريع وقت الاستجابة. على سبيل المثال، إذا أرسلت بريدًا إلكترونيًا إلى <webhook1@example.com>، <webhook2@example.com>، و <webhook3@example.com>، وكلها مكونة للوصول إلى نفس عنوان URL للنقطة النهائية *بالضبط*، فسيتم إجراء طلب واحد فقط. نجمع الطلبات بناءً على تطابق دقيق للنقطة النهائية.
* لاحظ أننا نستخدم مكتبة [mailparser](https://nodemailer.com/extras/mailparser/) وطريقة "simpleParser" لتحليل الرسالة إلى كائن مناسب لـ JSON.
* القيمة الخام للبريد الإلكتروني كسلسلة نصية تُعطى في الخاصية "raw".
* نتائج المصادقة تُعطى في الخصائص "dkim"، "spf"، "arc"، "dmarc"، و "bimi".
* رؤوس البريد الإلكتروني المحللة تُعطى في الخاصية "headers" – ولكن لاحظ أيضًا أنه يمكنك استخدام "headerLines" لتسهيل التكرار والتحليل.
* المستلمون المجمّعون لهذا الويب هوك يتم تجميعهم معًا ويُعطون في الخاصية "recipients".
* معلومات جلسة SMTP تُعطى في الخاصية "session". تحتوي هذه على معلومات عن مرسل الرسالة، وقت وصول الرسالة، HELO، واسم مضيف العميل. قيمة اسم مضيف العميل كـ `session.clientHostname` هي إما FQDN (من بحث PTR عكسي) أو هي `session.remoteAddress` ملفوفة بين أقواس (مثل `"[127.0.0.1]"`).
* إذا كنت بحاجة إلى طريقة سريعة للحصول على قيمة `X-Original-To`، يمكنك استخدام قيمة `session.recipient` (انظر المثال أدناه). رأس `X-Original-To` هو رأس نضيفه للرسائل لأغراض التصحيح مع المستلم الأصلي (قبل إعادة التوجيه المقنعة) للرسالة.
* إذا كنت بحاجة إلى إزالة خصائص `attachments` و/أو `raw` من جسم الحمولة، ببساطة أضف `?attachments=false`، `?raw=false`، أو `?attachments=false&raw=false` إلى نقطة نهاية الويب هوك كمعامل استعلام (مثل `https://example.com/webhook?attachments=false&raw=false`).
* إذا كانت هناك مرفقات، فسيتم إلحاقها بمصفوفة `attachments` بقيم Buffer. يمكنك تحليلها مرة أخرى إلى محتوى باستخدام نهج مع JavaScript مثل:
  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
  <span>
  </span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### هل تدعم التعبيرات النمطية أو الريجيكس {#do-you-support-regular-expressions-or-regex}

نعم، اعتبارًا من 27 سبتمبر 2021 أضفنا هذه الميزة. يمكنك ببساطة كتابة التعبيرات النمطية ("regex") لمطابقة الأسماء المستعارة وإجراء الاستبدالات.

الأسماء المستعارة المدعومة بالتعبيرات النمطية هي التي تبدأ بـ `/` وتنتهي بـ `/` ومستلموها هم عناوين بريد إلكتروني أو ويب هوكس. يمكن أن تتضمن المستلمون أيضًا دعم استبدال الريجيكس (مثل `$1`، `$2`).

ندعم علامتين للتعبيرات النمطية وهما `i` و `g`. علامة تجاهل حالة الأحرف `i` هي الافتراضية الدائمة ويتم فرضها دائمًا. يمكن إضافة العلامة العالمية `g` من قبلك عن طريق إلحاق النهاية `/` بـ `/g`.

لاحظ أننا ندعم أيضًا <a href="#can-i-disable-specific-aliases">ميزة تعطيل الأسماء المستعارة</a> لجزء المستلم مع دعم الريجيكس.

التعبيرات النمطية غير مدعومة على <a href="/disposable-addresses" target="_blank">نطاقات التزيين العالمية</a> (لأن هذا قد يشكل ثغرة أمنية).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    حماية خصوصية محسنة:
  </strong>
  <span>
    إذا كنت على خطة مدفوعة (تتميز بحماية خصوصية محسنة)، فالرجاء الذهاب إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> والنقر على "الأسماء المستعارة" بجانب نطاقك لتكوين الأسماء المستعارة، بما في ذلك تلك التي تحتوي على تعبيرات نمطية. إذا كنت ترغب في معرفة المزيد عن الخطط المدفوعة، راجع صفحة <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">التسعير</a> الخاصة بنا.
  </span>
</div>

#### أمثلة على حماية الخصوصية المحسنة {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>اسم الاسم المستعار</th>
      <th>التأثير</th>
      <th>اختبار</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>رسائل إلى `linus@example.com` أو `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">عرض الاختبار على RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>رسائل إلى `24highst@example.com` أو `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">عرض الاختبار على RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
    لاختبار هذه على <a href="https://regexr.com" class="alert-link">RegExr</a>، اكتب التعبير في الصندوق العلوي، ثم اكتب اسم مستعار كمثال في مربع النص أدناه. إذا تطابق، سيتحول إلى اللون الأزرق.
  <span>
  </span>
</div>

#### أمثلة للخطة المجانية {#examples-for-the-free-plan}

إذا كنت على الخطة المجانية، فما عليك سوى إضافة سجل DNS <strong class="notranslate">TXT</strong> جديد باستخدام واحد أو أكثر من الأمثلة المقدمة أدناه:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>مثال بسيط:</strong> إذا أردت أن يتم توجيه جميع الرسائل التي تذهب إلى `linus@example.com` أو `torvalds@example.com` إلى `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>مثال استبدال الاسم الأول واسم العائلة:</strong> تخيل أن جميع عناوين بريد شركتك هي من نمط `firstname.lastname@example.com`. إذا أردت أن يتم توجيه جميع الرسائل التي تذهب إلى نمط `firstname.lastname@example.com` إلى `firstname.lastname@company.com` مع دعم الاستبدال (<a href="https://regexr.com/66hnu" class="alert-link">عرض الاختبار على RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>مثال على استبدال ترشيح رمز الجمع:</strong> إذا أردت أن يتم توجيه جميع الرسائل التي تذهب إلى `info@example.com` أو `support@example.com` إلى `user+info@gmail.com` أو `user+support@gmail.com` على التوالي (مع دعم الاستبدال) (<a href="https://regexr.com/66ho7" class="alert-link">عرض الاختبار على RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>مثال استبدال سلسلة استعلام Webhook:</strong> ربما تريد أن تذهب جميع الرسائل التي تذهب إلى `example.com` إلى <a href="#do-you-support-webhooks" class="alert-link">webhook</a> وأن تحتوي على مفتاح سلسلة استعلام ديناميكي "to" بقيمة جزء اسم المستخدم من عنوان البريد الإلكتروني (<a href="https://regexr.com/66ho4" class="alert-link">عرض الاختبار على RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>مثال الرفض الهادئ:</strong> إذا كنت تريد تعطيل جميع الرسائل التي تطابق نمطًا معينًا ورفضها بهدوء (يظهر للمرسل كما لو أن الرسالة أُرسلت بنجاح، لكنها في الواقع لا تذهب إلى أي مكان) مع رمز الحالة `250` (انظر <a href="#can-i-disable-specific-aliases" class="alert-link">هل يمكنني تعطيل أسماء مستعارة محددة</a>)، فببساطة استخدم نفس النهج مع علامة تعجب واحدة "!". هذا يشير إلى المرسل أن الرسالة تم تسليمها بنجاح، لكنها في الواقع لم تذهب إلى أي مكان (مثل الثقب الأسود أو `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>مثال الرفض الناعم:</strong> إذا كنت تريد تعطيل جميع الرسائل التي تطابق نمطًا معينًا ورفضها برفض ناعم مع رمز الحالة `421` (انظر <a href="#can-i-disable-specific-aliases" class="alert-link">هل يمكنني تعطيل أسماء مستعارة محددة</a>)، فببساطة استخدم نفس النهج مع علامتي تعجب "!!". هذا يشير إلى المرسل لإعادة محاولة إرسال البريد الإلكتروني، وسيتم إعادة محاولة إرسال الرسائل إلى هذا الاسم المستعار لمدة حوالي 5 أيام ثم يتم رفضها نهائيًا.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>مثال على الرفض الصارم:</strong> إذا كنت تريد تعطيل جميع الرسائل الإلكترونية التي تطابق نمطًا معينًا ورفضها بشكل صارم مع رمز الحالة `550` (انظر <a href="#can-i-disable-specific-aliases" class="alert-link">هل يمكنني تعطيل الأسماء المستعارة المحددة</a>)، فببساطة استخدم نفس النهج مع ثلاث علامات تعجب "!!!". هذا يشير إلى المرسل بوجود خطأ دائم ولن تحاول الرسائل الإلكترونية الإرسال مرة أخرى، بل سيتم رفضها لهذا الاسم المستعار.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
    هل ترغب في معرفة كيفية كتابة تعبير عادي أو تحتاج إلى اختبار الاستبدال الخاص بك؟ يمكنك زيارة موقع اختبار التعبيرات العادية المجاني <a href="https://regexr.com" class="alert-link">RegExr</a> على <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### ما هي حدود SMTP الصادرة الخاصة بك {#what-are-your-outbound-smtp-limits}

نقوم بتحديد معدل المستخدمين والنطاقات إلى 300 رسالة SMTP صادرة في اليوم الواحد. هذا يعادل أكثر من 9000 رسالة بريد إلكتروني في الشهر التقويمي. إذا كنت بحاجة إلى تجاوز هذا العدد أو لديك رسائل كبيرة باستمرار، يرجى [الاتصال بنا](https://forwardemail.net/help).

### هل أحتاج إلى موافقة لتمكين SMTP {#do-i-need-approval-to-enable-smtp}

نعم، يرجى ملاحظة أنه للحفاظ على سمعة عنوان IP وضمان إمكانية التسليم، لدى Forward Email عملية مراجعة يدوية على أساس كل نطاق للموافقة على SMTP الصادر. أرسل بريدًا إلكترونيًا إلى <support@forwardemail.net> أو افتح [طلب مساعدة](https://forwardemail.net/help) للموافقة. عادةً ما تستغرق هذه العملية أقل من 24 ساعة، مع معظم الطلبات التي يتم تلبيتها خلال 1-2 ساعة. في المستقبل القريب، نهدف إلى جعل هذه العملية فورية مع ضوابط إضافية للبريد المزعج والتنبيهات. تضمن هذه العملية وصول رسائلك إلى صندوق الوارد وعدم تصنيفها كبريد مزعج.

### ما هي إعدادات تكوين خادم SMTP الخاص بك {#what-are-your-smtp-server-configuration-settings}

خادمنا هو `smtp.forwardemail.net` ويتم مراقبته أيضًا على <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">صفحة الحالة</a>.

يدعم كل من IPv4 و IPv6 ومتوافر عبر المنافذ `465` و `2465` لـ SSL/TLS (موصى به) و `587`، `2587`، `2525`، و `25` لـ TLS (STARTTLS).

**اعتبارًا من أكتوبر 2025**، ندعم الآن **اتصالات TLS 1.0 القديمة** على المنافذ `2455` (SSL/TLS) و `2555` (STARTTLS) للأجهزة القديمة مثل الطابعات، الماسحات الضوئية، الكاميرات، وعملاء البريد الإلكتروني القدامى الذين لا يمكنهم دعم إصدارات TLS الحديثة. تُقدم هذه المنافذ كبديل لجيميل، ياهو، أوتلوك، ومزودين آخرين الذين أوقفوا دعم بروتوكولات TLS القديمة.

> \[!CAUTION]
> **دعم TLS 1.0 القديم (المنافذ 2455 و 2555)**: تستخدم هذه المنافذ بروتوكول TLS 1.0 المهجور والذي يحتوي على ثغرات أمنية معروفة (BEAST، POODLE). استخدم هذه المنافذ فقط إذا كان جهازك لا يدعم TLS 1.2 أو أعلى على الإطلاق. نوصي بشدة بترقية برنامج الجهاز الثابت أو التبديل إلى عملاء بريد إلكتروني حديثين كلما أمكن ذلك. هذه المنافذ مخصصة فقط لتوافق الأجهزة القديمة (طابعات قديمة، ماسحات ضوئية، كاميرات، أجهزة إنترنت الأشياء).

|                                     البروتوكول                                     | اسم المضيف                |            المنافذ            |        IPv4        |        IPv6        | ملاحظات                                  |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **مفضل**                             | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | TLS 1.2+ حديث (موصى به)          |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | مدعوم (يفضل منفذ SSL/TLS `465`)  |
|                             `SSL/TLS` **قديم فقط**                            | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 للأجهزة القديمة فقط |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **قديم فقط** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 للأجهزة القديمة فقط |
| تسجيل الدخول | مثال                      | الوصف                                                                                                                                                                                    |
| ----------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| اسم المستخدم | `user@example.com`        | عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>.          |
| كلمة المرور | `************************` | اسم مستعار                                                                                                                                                                               |

لكي تتمكن من إرسال البريد الصادر عبر SMTP، يجب أن يكون **مستخدم SMTP** هو عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> – ويجب أن تكون **كلمة مرور SMTP** كلمة مرور مولدة خاصة بالاسم المستعار.

يرجى الرجوع إلى [هل تدعم إرسال البريد الإلكتروني عبر SMTP](#do-you-support-sending-email-with-smtp) للحصول على تعليمات خطوة بخطوة.

### ما هي إعدادات تكوين خادم IMAP الخاصة بكم {#what-are-your-imap-server-configuration-settings}

خادمنا هو `imap.forwardemail.net` ويتم مراقبته أيضًا على <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">صفحة الحالة</a> الخاصة بنا.

يدعم كل من IPv4 و IPv6 ومتوافر عبر المنافذ `993` و `2993` لاتصالات SSL/TLS.

|         البروتوكول        | اسم المضيف               |     المنافذ    |        IPv4        |        IPv6        |
| :-----------------------: | ------------------------ | :------------: | :----------------: | :----------------: |
| `SSL/TLS` **مفضل**         | `imap.forwardemail.net`  | `993`, `2993`  | :white_check_mark: | :white_check_mark: |

| تسجيل الدخول | مثال                      | الوصف                                                                                                                                                                                    |
| ----------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| اسم المستخدم | `user@example.com`        | عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>.          |
| كلمة المرور | `************************` | كلمة مرور مولدة خاصة بالاسم المستعار.                                                                                                                                                    |

لكي تتمكن من الاتصال عبر IMAP، يجب أن يكون **مستخدم IMAP** هو عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> – ويجب أن تكون **كلمة مرور IMAP** كلمة مرور مولدة خاصة بالاسم المستعار.

يرجى الرجوع إلى [هل تدعم استقبال البريد الإلكتروني عبر IMAP](#do-you-support-receiving-email-with-imap) للحصول على تعليمات خطوة بخطوة.

### ما هي إعدادات تكوين خادم POP3 الخاصة بكم {#what-are-your-pop3-server-configuration-settings}

خادمنا هو `pop3.forwardemail.net` ويتم مراقبته أيضًا على <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">صفحة الحالة</a> الخاصة بنا.

يدعم كل من IPv4 و IPv6 ومتوافر عبر المنافذ `995` و `2995` لاتصالات SSL/TLS.

|         البروتوكول        | اسم المضيف               |     المنافذ    |        IPv4        |        IPv6        |
| :-----------------------: | ------------------------ | :------------: | :----------------: | :----------------: |
| `SSL/TLS` **مفضل**         | `pop3.forwardemail.net`  | `995`, `2995`  | :white_check_mark: | :white_check_mark: |
| تسجيل الدخول | مثال                      | الوصف                                                                                                                                                                                    |
| ----------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| اسم المستخدم | `user@example.com`        | عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>.          |
| كلمة المرور | `************************` | كلمة مرور مولدة خاصة بالاسم المستعار.                                                                                                                                                     |

للاتصال بـ POP3، يجب أن يكون **مستخدم POP3** هو عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> – ويجب أن تكون **كلمة مرور IMAP** كلمة مرور مولدة خاصة بالاسم المستعار.

يرجى الرجوع إلى [هل تدعم POP3](#do-you-support-pop3) للحصول على تعليمات خطوة بخطوة.

### كيف أقوم بإعداد الاكتشاف التلقائي للبريد الإلكتروني لنطاقي {#how-do-i-set-up-email-autodiscovery-for-my-domain}

يتيح الاكتشاف التلقائي للبريد الإلكتروني لعملاء البريد مثل **Thunderbird**، **Apple Mail**، **Microsoft Outlook**، والأجهزة المحمولة اكتشاف إعدادات خوادم IMAP وSMTP وPOP3 وCalDAV وCardDAV الصحيحة تلقائيًا عند إضافة المستخدم لحسابه البريدي. يتم تعريف ذلك بواسطة [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (البريد الإلكتروني) و[RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) ويستخدم سجلات DNS SRV.

تنشر Forward Email سجلات الاكتشاف التلقائي على `forwardemail.net`. يمكنك إما إضافة سجلات SRV مباشرة إلى نطاقك، أو استخدام نهج CNAME الأبسط.

#### الخيار أ: سجلات CNAME (الأبسط) {#option-a-cname-records-simplest}

أضف هذين السجلين CNAME إلى DNS الخاص بنطاقك. هذا يفوض الاكتشاف التلقائي إلى خوادم Forward Email:

|  النوع | الاسم/المضيف    | الهدف/القيمة                  |
| :----: | --------------- | ----------------------------- |
| CNAME  | `autoconfig`    | `autoconfig.forwardemail.net` |
| CNAME  | `autodiscover`  | `autodiscover.forwardemail.net` |

يُستخدم سجل `autoconfig` بواسطة **Thunderbird** والعملاء الآخرين المبنيين على Mozilla. يُستخدم سجل `autodiscover` بواسطة **Microsoft Outlook**.

#### الخيار ب: سجلات SRV (مباشر) {#option-b-srv-records-direct}

إذا كنت تفضل إضافة السجلات مباشرة (أو مزود DNS الخاص بك لا يدعم CNAME على النطاقات الفرعية)، أضف سجلات SRV التالية إلى نطاقك:

| النوع | الاسم/المضيف         | الأولوية | الوزن | المنفذ | الهدف/القيمة               | الغرض                                  |
| :----:| -------------------- | :-------:| :----:| :----: | -------------------------- | ------------------------------------- |
| SRV   | `_imaps._tcp`        |    0     |   1   |  993   | `imap.forwardemail.net`    | IMAP عبر SSL/TLS (مفضل)                |
| SRV   | `_imap._tcp`         |    0     |   0   |   0    | `.`                        | IMAP نص عادي معطل                     |
| SRV   | `_submissions._tcp`  |    0     |   1   |  465   | `smtp.forwardemail.net`    | إرسال SMTP (SSL/TLS، موصى به)          |
| SRV   | `_submission._tcp`   |    5     |   1   |  587   | `smtp.forwardemail.net`    | إرسال SMTP (STARTTLS)                  |
| SRV   | `_pop3s._tcp`        |   10     |   1   |  995   | `pop3.forwardemail.net`    | POP3 عبر SSL/TLS                      |
| SRV   | `_pop3._tcp`         |    0     |   0   |   0    | `.`                        | POP3 نص عادي معطل                     |
| SRV   | `_caldavs._tcp`      |    0     |   1   |  443   | `caldav.forwardemail.net`  | CalDAV عبر TLS (التقاويم)              |
| SRV   | `_caldav._tcp`       |    0     |   0   |   0    | `.`                        | CalDAV نص عادي معطل                   |
| SRV   | `_carddavs._tcp`     |    0     |   1   |  443   | `carddav.forwardemail.net` | CardDAV عبر TLS (جهات الاتصال)         |
| SRV   | `_carddav._tcp`      |    0     |   0   |   0    | `.`                        | CardDAV نص عادي معطل                  |
> \[!NOTE]
> لدى IMAP قيمة أولوية أقل (0) من POP3 (10)، مما يخبر عملاء البريد الإلكتروني بتفضيل IMAP على POP3 عندما يكون كلاهما متاحًا. تشير السجلات التي تستهدف `.` (نقطة واحدة) إلى أن نسخ النص العادي (غير المشفرة) من تلك البروتوكولات معطلة عمدًا وفقًا لـ [RFC 6186 القسم 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). تتبع سجلات SRV الخاصة بـ CalDAV و CardDAV [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) لاكتشاف التقويم وجهات الاتصال تلقائيًا.

#### أي عملاء البريد الإلكتروني يدعمون الاكتشاف التلقائي؟ {#which-email-clients-support-autodiscovery}

| العميل             | البريد الإلكتروني                                | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | سجلات `autoconfig` CNAME أو SRV                   | سجلات `autoconfig` XML أو SRV (RFC 6764)  |
| Apple Mail (macOS) | سجلات SRV (RFC 6186)                             | سجلات SRV (RFC 6764)                       |
| Apple Mail (iOS)   | سجلات SRV (RFC 6186)                             | سجلات SRV (RFC 6764)                       |
| Microsoft Outlook  | سجلات `autodiscover` CNAME أو `_autodiscover._tcp` SRV | غير مدعوم                                |
| GNOME (Evolution)  | سجلات SRV (RFC 6186)                             | سجلات SRV (RFC 6764)                       |
| KDE (KMail)        | سجلات SRV (RFC 6186)                             | سجلات SRV (RFC 6764)                       |
| eM Client          | `autoconfig` أو `autodiscover`                    | سجلات SRV (RFC 6764)                       |

> \[!TIP]
> لأفضل توافق عبر جميع العملاء، نوصي باستخدام **الخيار أ** (سجلات CNAME) مع سجلات SRV من **الخيار ب**. تغطي طريقة CNAME وحدها غالبية عملاء البريد الإلكتروني. تضمن سجلات SRV الخاصة بـ CalDAV/CardDAV أن عملاء التقويم وجهات الاتصال يمكنهم أيضًا اكتشاف إعدادات الخادم تلقائيًا.

## الأمان {#security-1}

### تقنيات تعزيز أمان الخادم المتقدمة {#advanced-server-hardening-techniques}

> \[!TIP]
> تعرّف على المزيد حول بنية الأمان لدينا في [صفحة الأمان الخاصة بنا](/security).

يقوم Forward Email بتنفيذ العديد من تقنيات تعزيز أمان الخادم لضمان أمان بنيتنا التحتية وبياناتك:

1. **أمان الشبكة**:
   * جدار حماية IP tables بقواعد صارمة
   * Fail2ban للحماية من هجمات القوة الغاشمة
   * تدقيقات أمان منتظمة واختبارات اختراق
   * وصول إداري عبر VPN فقط

2. **تعزيز النظام**:
   * تثبيت الحد الأدنى من الحزم
   * تحديثات أمان منتظمة
   * SELinux في وضع التنفيذ
   * تعطيل وصول SSH للمستخدم الجذر
   * المصادقة باستخدام المفاتيح فقط

3. **أمان التطبيق**:
   * رؤوس سياسة أمان المحتوى (CSP)
   * أمان النقل الصارم عبر HTTPS (HSTS)
   * رؤوس حماية ضد XSS
   * خيارات الإطار ورؤوس سياسة المرجع
   * تدقيقات الاعتماديات المنتظمة

4. **حماية البيانات**:
   * تشفير كامل للقرص باستخدام LUKS
   * إدارة مفاتيح آمنة
   * نسخ احتياطية منتظمة مع التشفير
   * ممارسات تقليل البيانات

5. **المراقبة والاستجابة**:
   * كشف التسلل في الوقت الحقيقي
   * فحص أمني آلي
   * تسجيل مركزي وتحليل
   * إجراءات الاستجابة للحوادث

> \[!IMPORTANT]
> يتم تحديث ممارسات الأمان لدينا باستمرار لمعالجة التهديدات والثغرات الناشئة.

> \[!TIP]
> لأقصى درجات الأمان، نوصي باستخدام خدمتنا مع التشفير من الطرف إلى الطرف عبر OpenPGP.

### هل لديكم شهادات SOC 2 أو ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> يعمل Forward Email على بنية تحتية مقدمة من معالجات فرعية معتمدة لضمان الامتثال لمعايير الصناعة.

لا يحمل Forward Email شهادات SOC 2 Type II أو ISO 27001 مباشرة. ومع ذلك، تعمل الخدمة على بنية تحتية مقدمة من معالجات فرعية معتمدة:

* **DigitalOcean**: معتمدة SOC 2 Type II و SOC 3 Type II (تم تدقيقها من قبل Schellman & Company LLC)، ومعتمدة ISO 27001 في مراكز بيانات متعددة. التفاصيل: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: معتمد SOC 2+ (HIPAA)، شهادات ISO/IEC: 20000-1:2018، 27001:2022، 27017:2015، 27018:2019. التفاصيل: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: متوافق مع SOC 2 (اتصل بـ DataPacket مباشرة للحصول على الشهادة)، مزود بنية تحتية بمستوى المؤسسات (موقع دنفر). التفاصيل: <https://www.datapacket.com/datacenters/denver>

يتبع Forward Email أفضل الممارسات الصناعية لتدقيقات الأمان ويتفاعل بانتظام مع باحثي الأمان المستقلين. المصدر: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### هل تستخدم تشفير TLS لإعادة توجيه البريد الإلكتروني {#do-you-use-tls-encryption-for-email-forwarding}

نعم. يفرض Forward Email بشكل صارم TLS 1.2+ لجميع الاتصالات (HTTPS، SMTP، IMAP، POP3) ويطبق MTA-STS لدعم TLS معزز. تشمل التنفيذ:

* فرض TLS 1.2+ لجميع اتصالات البريد الإلكتروني
* تبادل مفاتيح ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) للسرية التامة للأمام
* مجموعات تشفير حديثة مع تحديثات أمان منتظمة
* دعم HTTP/2 لتحسين الأداء والأمان
* HSTS (HTTP Strict Transport Security) مع التحميل المسبق في المتصفحات الرئيسية
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** لفرض TLS الصارم

المصدر: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**تنفيذ MTA-STS**: ينفذ Forward Email فرض MTA-STS الصارم في قاعدة الشيفرة. عند حدوث أخطاء TLS وفرض MTA-STS، يعيد النظام رموز حالة SMTP 421 لضمان إعادة محاولة إرسال الرسائل لاحقًا بدلاً من تسليمها بشكل غير آمن. تفاصيل التنفيذ:

* اكتشاف أخطاء TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* فرض MTA-STS في مساعد send-email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

التحقق من طرف ثالث: <https://www.hardenize.com/report/forwardemail.net/1750312779> يظهر تقييمات "جيدة" لجميع تدابير TLS وأمان النقل.

### هل تحتفظ برؤوس مصادقة البريد الإلكتروني {#do-you-preserve-email-authentication-headers}

نعم. ينفذ Forward Email بشكل شامل ويحافظ على رؤوس مصادقة البريد الإلكتروني:

* **SPF (إطار سياسة المرسل)**: منفذ ومحفوظ بشكل صحيح
* **DKIM (مفاتيح المجال للبريد الإلكتروني الموقع)**: دعم كامل مع إدارة مفاتيح صحيحة
* **DMARC**: فرض السياسة للرسائل التي تفشل في التحقق من SPF أو DKIM
* **ARC**: رغم عدم التفصيل الصريح، تشير درجات الامتثال المثالية للخدمة إلى معالجة شاملة لرؤوس المصادقة

المصدر: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

التحقق: اختبار البريد الإلكتروني Internet.nl يظهر درجة 100/100 تحديدًا لتنفيذ "SPF، DKIM، وDMARC". تقييم Hardenize يؤكد تقييمات "جيدة" لـ SPF وDMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### هل تحتفظ بالرؤوس الأصلية للبريد الإلكتروني وتمنع التزوير {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> ينفذ Forward Email حماية متقدمة ضد التزوير لمنع إساءة استخدام البريد الإلكتروني.

يحافظ Forward Email على الرؤوس الأصلية للبريد الإلكتروني مع تنفيذ حماية شاملة ضد التزوير من خلال قاعدة شيفرة MX:

* **الحفاظ على الرؤوس**: يتم الحفاظ على رؤوس المصادقة الأصلية أثناء إعادة التوجيه
* **مكافحة التزوير**: فرض سياسة DMARC يمنع تزوير الرؤوس برفض الرسائل التي تفشل في التحقق من SPF أو DKIM
* **منع حقن الرؤوس**: التحقق من صحة المدخلات وتنقيتها باستخدام مكتبة striptags
* **الحماية المتقدمة**: كشف متقدم للتصيد الاحتيالي مع اكتشاف التزوير، منع الانتحال، وأنظمة إعلام المستخدم

**تفاصيل تنفيذ MX**: تتم معالجة منطق البريد الإلكتروني الأساسي بواسطة قاعدة شيفرة خادم MX، تحديدًا:

* المعالج الرئيسي لبيانات MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* تصفية البريد الإلكتروني التعسفي (مكافحة التزوير): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

يقوم مساعد `isArbitrary` بتنفيذ قواعد مكافحة التزوير المتقدمة بما في ذلك اكتشاف انتحال النطاق، العبارات المحظورة، وأنماط التصيد المختلفة.
### كيف تحمي نفسك من البريد المزعج والإساءة {#how-do-you-protect-against-spam-and-abuse}

يقوم Forward Email بتنفيذ حماية متعددة الطبقات شاملة:

* **تحديد المعدل**: يُطبق على محاولات المصادقة، ونقاط نهاية API، واتصالات SMTP
* **عزل الموارد**: بين المستخدمين لمنع التأثير من المستخدمين ذوي الحجم العالي
* **حماية DDoS**: حماية متعددة الطبقات من خلال نظام Shield الخاص بـ DataPacket وCloudflare
* **التحجيم التلقائي**: تعديل الموارد ديناميكيًا بناءً على الطلب
* **منع الإساءة**: فحوصات منع الإساءة الخاصة بالمستخدم وحظر المحتوى الخبيث بناءً على التجزئة
* **مصادقة البريد الإلكتروني**: بروتوكولات SPF وDKIM وDMARC مع كشف متقدم للتصيد الاحتيالي

المصادر:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (تفاصيل حماية DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### هل تخزن محتوى البريد الإلكتروني على القرص {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> يستخدم Forward Email بنية صفر معرفة تمنع كتابة محتوى البريد الإلكتروني على القرص.

* **بنية صفر معرفة**: صناديق بريد SQLite مشفرة بشكل فردي تعني أن Forward Email لا يمكنه الوصول إلى محتوى البريد الإلكتروني
* **المعالجة في الذاكرة**: تتم معالجة البريد الإلكتروني بالكامل في الذاكرة، متجنبًا التخزين على القرص
* **عدم تسجيل المحتوى**: "نحن لا نسجل أو نخزن محتوى البريد الإلكتروني أو بيانات التعريف على القرص"
* **التشفير المعزول**: مفاتيح التشفير لا تُخزن أبدًا على القرص بنص واضح

**دليل قاعدة كود MX**: يعالج خادم MX الرسائل بالكامل في الذاكرة دون كتابة المحتوى على القرص. يوضح المعالج الرئيسي لمعالجة البريد الإلكتروني هذا النهج في الذاكرة: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

المصادر:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (الملخص)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (تفاصيل صفر معرفة)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (التشفير المعزول)

### هل يمكن أن يتعرض محتوى البريد الإلكتروني للكشف أثناء تعطل النظام {#can-email-content-be-exposed-during-system-crashes}

لا. يقوم Forward Email بتنفيذ تدابير شاملة لمنع تعرض البيانات أثناء الأعطال:

* **تعطيل تفريغ النواة**: يمنع تعرض الذاكرة أثناء الأعطال
* **تعطيل الذاكرة الافتراضية (Swap)**: معطل تمامًا لمنع استخراج البيانات الحساسة من ملفات التبديل
* **بنية في الذاكرة**: محتوى البريد الإلكتروني موجود فقط في الذاكرة المتطايرة أثناء المعالجة
* **حماية مفاتيح التشفير**: المفاتيح لا تُخزن أبدًا على القرص بنص واضح
* **الأمان المادي**: أقراص مشفرة بـ LUKS v2 تمنع الوصول المادي إلى البيانات
* **تعطيل تخزين USB**: يمنع استخراج البيانات غير المصرح به

**معالجة الأخطاء لمشاكل النظام**: يستخدم Forward Email دوال مساعدة `isCodeBug` و `isTimeoutError` لضمان أنه إذا حدثت أي مشاكل في اتصال قاعدة البيانات، أو مشاكل في شبكة DNS/قائمة الحظر، أو مشاكل في الاتصال العلوي، يعيد النظام رموز حالة SMTP 421 لضمان إعادة محاولة إرسال الرسائل لاحقًا بدلاً من فقدانها أو تعرضها.

تفاصيل التنفيذ:

* تصنيف الأخطاء: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* معالجة أخطاء المهلة في معالجة MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

المصدر: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### من لديه حق الوصول إلى بنية البريد الإلكتروني الخاصة بك {#who-has-access-to-your-email-infrastructure}

يقوم Forward Email بتنفيذ ضوابط وصول شاملة لفريق الهندسة الصغير المكون من 2-3 أشخاص مع متطلبات صارمة للمصادقة الثنائية:

* **التحكم في الوصول بناءً على الدور**: لحسابات الفريق مع أذونات قائمة على الموارد
* **مبدأ أقل امتياز**: يُطبق في جميع الأنظمة
* **فصل الواجبات**: بين الأدوار التشغيلية
* **إدارة المستخدمين**: مستخدمون منفصلون للنشر وعمليات التطوير مع أذونات مميزة
* **تعطيل تسجيل الدخول كـ root**: يجبر الوصول عبر حسابات مصادق عليها بشكل صحيح
* **مصادقة ثنائية صارمة**: لا توجد مصادقة ثنائية عبر الرسائل النصية بسبب خطر هجمات MiTM - فقط عبر التطبيقات أو الرموز المادية
* **تسجيل تدقيق شامل**: مع تنقيح البيانات الحساسة
* **كشف تلقائي للشذوذ**: لأنماط الوصول غير المعتادة
* **مراجعات أمنية منتظمة**: لسجلات الوصول
* **منع هجمات الخادمة الشريرة**: تعطيل تخزين USB وتدابير أمان مادي أخرى
المصادر:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (ضوابط التفويض)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (أمن الشبكة)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (منع هجوم الخادمة الشريرة)

### ما هي مزودات البنية التحتية التي تستخدمها {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> يستخدم Forward Email عدة معالجات فرعية للبنية التحتية مع شهادات امتثال شاملة.

التفاصيل الكاملة متاحة على صفحة الامتثال لـ GDPR لدينا: <https://forwardemail.net/gdpr>

**المعالجات الفرعية الأساسية للبنية التحتية:**

| المزود           | معتمد في إطار خصوصية البيانات | صفحة الامتثال لـ GDPR                                                                    |
| ---------------- | ----------------------------- | ---------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ نعم                        | <https://www.cloudflare.com/trust-hub/gdpr/>                                            |
| **DataPacket**   | ❌ لا                         | <https://www.datapacket.com/privacy-policy>                                             |
| **DigitalOcean** | ❌ لا                         | <https://www.digitalocean.com/legal/gdpr>                                               |
| **GitHub**       | ✅ نعم                        | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ لا                         | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                         |

**الشهادات التفصيلية:**

**DigitalOcean**

* SOC 2 النوع الثاني و SOC 3 النوع الثاني (تم التدقيق من قبل Schellman & Company LLC)
* معتمد ISO 27001 في عدة مراكز بيانات
* متوافق مع PCI-DSS
* معتمد CSA STAR المستوى 1
* معتمد APEC CBPR PRP
* التفاصيل: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* معتمد SOC 2+ (HIPAA)
* متوافق مع PCI Merchant
* معتمد CSA STAR المستوى 1
* ISO/IEC 20000-1:2018، 27001:2022، 27017:2015، 27018:2019
* التفاصيل: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* متوافق مع SOC 2 (اتصل بـ DataPacket مباشرة للحصول على الشهادة)
* بنية تحتية بمستوى المؤسسات (موقع دنفر)
* حماية DDoS من خلال مجموعة Shield للأمن السيبراني
* دعم فني على مدار الساعة طوال أيام الأسبوع
* شبكة عالمية عبر 58 مركز بيانات
* التفاصيل: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* معتمد في إطار خصوصية البيانات (الاتحاد الأوروبي-الولايات المتحدة، سويسرا-الولايات المتحدة، والامتداد البريطاني)
* استضافة شفرة المصدر، CI/CD، وإدارة المشاريع
* اتفاقية حماية بيانات GitHub متاحة
* التفاصيل: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**معالجات الدفع:**

* **Stripe**: معتمد في إطار خصوصية البيانات - <https://stripe.com/legal/privacy-center>
* **PayPal**: غير معتمد في إطار خصوصية البيانات - <https://www.paypal.com/uk/legalhub/privacy-full>

### هل تقدمون اتفاقية معالجة بيانات (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

نعم، يقدم Forward Email اتفاقية معالجة بيانات شاملة (DPA) يمكن توقيعها مع اتفاقية المؤسسة الخاصة بنا. نسخة من اتفاقية معالجة البيانات متاحة على: <https://forwardemail.net/dpa>

**تفاصيل اتفاقية معالجة البيانات:**

* تغطي الامتثال لـ GDPR وأُطُر درع الخصوصية بين الاتحاد الأوروبي والولايات المتحدة/سويسرا والولايات المتحدة
* تُقبل تلقائيًا عند الموافقة على شروط الخدمة الخاصة بنا
* لا حاجة لتوقيع منفصل لاتفاقية معالجة البيانات القياسية
* ترتيبات اتفاقية معالجة بيانات مخصصة متاحة من خلال ترخيص المؤسسة

**إطار امتثال GDPR:**
تفاصيل اتفاقية معالجة البيانات لدينا تغطي الامتثال لـ GDPR وكذلك متطلبات نقل البيانات الدولية. المعلومات الكاملة متاحة على: <https://forwardemail.net/gdpr>

بالنسبة لعملاء المؤسسات الذين يحتاجون إلى شروط اتفاقية معالجة بيانات مخصصة أو ترتيبات تعاقدية محددة، يمكن معالجة ذلك من خلال برنامج **ترخيص المؤسسة (250 دولارًا شهريًا)**.

### كيف تتعاملون مع إشعارات خرق البيانات {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> تقلل بنية Forward Email ذات المعرفة الصفرية بشكل كبير من تأثير الخروقات.
* **تعرض محدود للبيانات**: لا يمكن الوصول إلى محتوى البريد الإلكتروني المشفر بسبب بنية المعرفة الصفرية  
* **جمع بيانات محدود**: فقط معلومات المشترك الأساسية وسجلات IP محدودة لأغراض الأمان  
* **أطر المعالجات الفرعية**: تحتفظ DigitalOcean وGitHub وVultr بإجراءات استجابة للحوادث متوافقة مع اللائحة العامة لحماية البيانات (GDPR)  

**معلومات ممثل اللائحة العامة لحماية البيانات (GDPR):**  
عين Forward Email ممثلين للائحة العامة لحماية البيانات وفقًا للمادة 27:  

**ممثل الاتحاد الأوروبي:**  
Osano International Compliance Services Limited  
ATTN: LFHC  
3 Dublin Landings, North Wall Quay  
Dublin 1, D01C4E0  

**ممثل المملكة المتحدة:**  
Osano UK Compliance LTD  
ATTN: LFHC  
42-46 Fountain Street, Belfast  
Antrim, BT1 - 5EF  

بالنسبة لعملاء المؤسسات الذين يحتاجون إلى اتفاقيات مستوى خدمة محددة لإشعارات الاختراق، يجب مناقشة ذلك كجزء من اتفاقية **رخصة المؤسسة**.  

المصادر:  

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>  
* <https://forwardemail.net/gdpr>  

### هل تقدم بيئة اختبار {#do-you-offer-a-test-environment}  

لا تصف الوثائق التقنية لـ Forward Email بشكل صريح وضع صندوق رمل مخصص. ومع ذلك، تشمل طرق الاختبار المحتملة:  

* **خيار الاستضافة الذاتية**: قدرات استضافة ذاتية شاملة لإنشاء بيئات اختبار  
* **واجهة برمجة التطبيقات (API)**: إمكانية اختبار التكوينات برمجيًا  
* **مفتوح المصدر**: الشفرة مفتوحة المصدر 100% تتيح للعملاء فحص منطق إعادة التوجيه  
* **دومينات متعددة**: دعم الدومينات المتعددة قد يمكن من إنشاء دومينات اختبار  

بالنسبة لعملاء المؤسسات الذين يحتاجون إلى قدرات صندوق رمل رسمية، يجب مناقشة ذلك كجزء من ترتيب **رخصة المؤسسة**.  

المصدر: <https://github.com/forwardemail/forwardemail.net> (تفاصيل بيئة التطوير)  

### هل توفر أدوات مراقبة وتنبيه {#do-you-provide-monitoring-and-alerting-tools}  

يوفر Forward Email مراقبة في الوقت الحقيقي مع بعض القيود:  

**متوفر:**  

* **مراقبة التسليم في الوقت الحقيقي**: مقاييس أداء مرئية علنًا لمزودي البريد الإلكتروني الرئيسيين  
* **تنبيه تلقائي**: يتم تنبيه فريق الهندسة عند تجاوز أوقات التسليم 10 ثوانٍ  
* **مراقبة شفافة**: أنظمة مراقبة مفتوحة المصدر 100%  
* **مراقبة البنية التحتية**: كشف تلقائي للشذوذ وتسجيل تدقيق شامل  

**القيود:**  

* لم يتم توثيق إشعارات حالة التسليم عبر الويب هوكس أو API الموجهة للعملاء بشكل صريح  

بالنسبة لعملاء المؤسسات الذين يحتاجون إلى ويب هوكس مفصلة لحالة التسليم أو تكاملات مراقبة مخصصة، قد تتوفر هذه القدرات من خلال ترتيبات **رخصة المؤسسة**.  

المصادر:  

* <https://forwardemail.net> (عرض المراقبة في الوقت الحقيقي)  
* <https://github.com/forwardemail/forwardemail.net> (تنفيذ المراقبة)  

### كيف تضمن التوفر العالي {#how-do-you-ensure-high-availability}  

> \[!IMPORTANT]  
> ينفذ Forward Email تكرارًا شاملاً عبر مزودي البنية التحتية المتعددين.  

* **بنية تحتية موزعة**: مزودون متعددون (DigitalOcean، Vultr، DataPacket) عبر مناطق جغرافية  
* **توازن تحميل جغرافي**: توازن تحميل جغرافي قائم على Cloudflare مع تحويل تلقائي عند الفشل  
* **توسع تلقائي**: تعديل الموارد ديناميكيًا بناءً على الطلب  
* **حماية متعددة الطبقات ضد هجمات DDoS**: عبر نظام Shield الخاص بـ DataPacket وCloudflare  
* **تكرار الخوادم**: خوادم متعددة لكل منطقة مع تحويل تلقائي عند الفشل  
* **تكرار قواعد البيانات**: مزامنة بيانات في الوقت الحقيقي عبر مواقع متعددة  
* **المراقبة والتنبيه**: مراقبة على مدار الساعة مع استجابة تلقائية للحوادث  

**التزام التوفر**: توفر الخدمة بنسبة 99.9%+ مع مراقبة شفافة متاحة على <https://forwardemail.net>  

المصادر:  

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>  
* <https://www.datapacket.com/datacenters/denver>  

### هل تلتزم بالقسم 889 من قانون تفويض الدفاع الوطني (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}  

> \[!IMPORTANT]  
> Forward Email ملتزم تمامًا بالقسم 889 من خلال اختيار دقيق لشركاء البنية التحتية.  

نعم، Forward Email **ملتزم بالقسم 889**. يحظر القسم 889 من قانون تفويض الدفاع الوطني (NDAA) على الوكالات الحكومية استخدام أو التعاقد مع كيانات تستخدم معدات الاتصالات والمراقبة الفيديوية من شركات محددة (Huawei، ZTE، Hikvision، Dahua، وHytera).
**كيف يحقق Forward Email الامتثال للقسم 889:**

يعتمد Forward Email حصريًا على مزودين رئيسيين للبنية التحتية، لا يستخدم أي منهما معدات محظورة بموجب القسم 889:

1. **Cloudflare**: شريكنا الأساسي لخدمات الشبكة وأمان البريد الإلكتروني  
2. **DataPacket**: مزودنا الأساسي للبنية التحتية للخوادم (يستخدم معدات Arista Networks و Cisco حصريًا)  
3. **مزودو النسخ الاحتياطي**: مزودو النسخ الاحتياطي لدينا Digital Ocean و Vultr تم تأكيد امتثالهم للقسم 889 كتابيًا أيضًا.

**التزام Cloudflare**: توضح Cloudflare صراحة في مدونة قواعد السلوك الخاصة بالأطراف الثالثة أنها لا تستخدم معدات الاتصالات أو منتجات المراقبة بالفيديو أو الخدمات من أي كيانات محظورة بموجب القسم 889.

**حالة استخدام الحكومة**: تم التحقق من امتثالنا للقسم 889 عندما اختارت **الأكاديمية البحرية الأمريكية** Forward Email لاحتياجات إعادة توجيه البريد الإلكتروني الآمن الخاصة بها، مما تطلب توثيق معايير الامتثال الفيدرالية لدينا.

للحصول على تفاصيل كاملة حول إطار عمل الامتثال الحكومي لدينا، بما في ذلك اللوائح الفيدرالية الأوسع، اقرأ دراستنا الشاملة: [خدمة البريد الإلكتروني الحكومية الفيدرالية متوافقة مع القسم 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## تفاصيل النظام والتقنية {#system-and-technical-details}

### هل تقومون بتخزين الرسائل الإلكترونية ومحتوياتها {#do-you-store-emails-and-their-contents}

لا، نحن لا نكتب على القرص أو نخزن السجلات – مع [استثناء الأخطاء](#do-you-store-error-logs) و [SMTP الصادر](#do-you-support-sending-email-with-smtp) (انظر [سياسة الخصوصية](/privacy)).

يتم كل شيء في الذاكرة و [رمز المصدر الخاص بنا على GitHub](https://github.com/forwardemail).

### كيف يعمل نظام إعادة توجيه البريد الإلكتروني الخاص بكم {#how-does-your-email-forwarding-system-work}

يعتمد البريد الإلكتروني على [بروتوكول SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). يتكون هذا البروتوكول من أوامر تُرسل إلى خادم (يعمل عادة على المنفذ 25). هناك اتصال أولي، ثم يحدد المرسل من أين يأتي البريد ("MAIL FROM")، يليه إلى أين يذهب ("RCPT TO")، وأخيرًا رؤوس البريد ومحتوى البريد نفسه ("DATA"). يتم وصف تدفق نظام إعادة توجيه البريد الإلكتروني لدينا بالنسبة لكل أمر من أوامر بروتوكول SMTP أدناه:

* الاتصال الأولي (بدون اسم أمر، مثل `telnet example.com 25`) - هذا هو الاتصال الأولي. نتحقق من المرسلين الذين ليسوا في [قائمة السماح](#do-you-have-an-allowlist) مقابل [قائمة الرفض](#do-you-have-a-denylist). وأخيرًا، إذا لم يكن المرسل في قائمة السماح، نتحقق مما إذا تم [وضعه في القائمة الرمادية](#do-you-have-a-greylist).

* `HELO` - يشير هذا إلى تحية لتحديد اسم المضيف المؤهل بالكامل للمرسل، أو عنوان IP، أو اسم معالج البريد. يمكن تزوير هذه القيمة، لذلك لا نعتمد على هذه البيانات ونستخدم بدلاً من ذلك البحث العكسي لاسم المضيف لعنوان IP الخاص بالاتصال.

* `MAIL FROM` - يشير هذا إلى عنوان البريد الظرفي للرسالة. إذا تم إدخال قيمة، يجب أن تكون عنوان بريد إلكتروني صالح وفق RFC 5322. القيم الفارغة مسموح بها. نحن [نبحث عن الارتداد العكسي](#how-do-you-protect-against-backscatter) هنا، ونفحص أيضًا MAIL FROM مقابل [قائمة الرفض](#do-you-have-a-denylist). وأخيرًا نتحقق من المرسلين الذين ليسوا في قائمة السماح للحد من المعدل (انظر القسم الخاص بـ [الحد من المعدل](#do-you-have-rate-limiting) و [قائمة السماح](#do-you-have-an-allowlist) لمزيد من المعلومات).

* `RCPT TO` - يشير هذا إلى المستلم (المستلمين) للرسالة. يجب أن تكون هذه عناوين بريد إلكتروني صالحة وفق RFC 5322. نسمح فقط بما يصل إلى 50 مستلم ظرفي لكل رسالة (وهذا يختلف عن رأس "إلى" في البريد الإلكتروني). نتحقق أيضًا من وجود عنوان [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") صالح هنا للحماية من التزوير باستخدام اسم نطاق SRS الخاص بنا.

* `DATA` - هذا هو الجزء الأساسي من خدمتنا الذي يعالج البريد الإلكتروني. انظر القسم [كيف تعالجون البريد الإلكتروني لإعادة التوجيه](#how-do-you-process-an-email-for-forwarding) أدناه لمزيد من التفاصيل.
### كيف تقوم بمعالجة البريد الإلكتروني لإعادة التوجيه {#how-do-you-process-an-email-for-forwarding}

تصف هذه القسم عمليتنا المتعلقة بأمر بروتوكول SMTP `DATA` في القسم [كيف يعمل نظام إعادة توجيه البريد الإلكتروني الخاص بك](#how-does-your-email-forwarding-system-work) أعلاه – وهي كيفية معالجة رؤوس البريد الإلكتروني، والمحتوى، والأمان، وتحديد المكان الذي يجب تسليمه إليه، وكيفية التعامل مع الاتصالات.

1. إذا تجاوزت الرسالة الحد الأقصى للحجم وهو 50 ميجابايت، فسيتم رفضها برمز الخطأ 552.

2. إذا لم تحتوي الرسالة على رأس "From"، أو إذا كانت أي من القيم في رأس "From" ليست عناوين بريد إلكتروني صالحة وفقًا لـ RFC 5322، فسيتم رفضها برمز الخطأ 550.

3. إذا كانت الرسالة تحتوي على أكثر من 25 رأس "Received"، فتم تحديد أنها عالقة في حلقة إعادة توجيه، ويتم رفضها برمز الخطأ 550.

4. باستخدام بصمة البريد الإلكتروني (انظر القسم الخاص بـ [بصمة البريد الإلكتروني](#how-do-you-determine-an-email-fingerprint))، سنتحقق مما إذا تم محاولة إعادة المحاولة للرسالة لأكثر من 5 أيام (وهو ما يتطابق مع [سلوك postfix الافتراضي](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime))، وإذا كان الأمر كذلك، فسيتم رفضها برمز الخطأ 550.

5. نقوم بتخزين نتائج فحص البريد الإلكتروني باستخدام [Spam Scanner](https://spamscanner.net) في الذاكرة.

6. إذا كانت هناك أي نتائج عشوائية من Spam Scanner، فسيتم رفضها برمز الخطأ 554. تشمل النتائج العشوائية فقط اختبار GTUBE في وقت كتابة هذا النص. راجع <https://spamassassin.apache.org/gtube/> لمزيد من المعلومات.

7. سنضيف الرؤوس التالية إلى الرسالة لأغراض التصحيح ومنع الإساءة:

   * `Received` - نضيف هذا الرأس القياسي مع عنوان IP الأصلي والمضيف، نوع الإرسال، معلومات اتصال TLS، التاريخ/الوقت، والمستلم.
   * `X-Original-To` - المستلم الأصلي للرسالة:
     * هذا مفيد لتحديد المكان الذي تم تسليم البريد الإلكتروني إليه في الأصل (بالإضافة إلى رأس "Received").
     * يتم إضافته على أساس كل مستلم في وقت IMAP و/أو إعادة التوجيه المقنعة (لحماية الخصوصية).
   * `X-Forward-Email-Website` - يحتوي على رابط إلى موقعنا الإلكتروني <https://forwardemail.net>
   * `X-Forward-Email-Version` - الإصدار الحالي [SemVer](https://semver.org/) من `package.json` لقاعدة الشيفرة الخاصة بنا.
   * `X-Forward-Email-Session-ID` - قيمة معرف الجلسة المستخدمة لأغراض التصحيح (تنطبق فقط في بيئات غير الإنتاج).
   * `X-Forward-Email-Sender` - قائمة مفصولة بفواصل تحتوي على عنوان MAIL FROM الأصلي (إذا لم يكن فارغًا)، واسم المضيف العكسي PTR للعميل (إذا كان موجودًا)، وعنوان IP للمرسل.
   * `X-Forward-Email-ID` - هذا ينطبق فقط على SMTP الصادر ويرتبط بمعرف البريد الإلكتروني المخزن في حسابي → الرسائل الإلكترونية
   * `X-Report-Abuse` - بقيمة `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - بقيمة `abuse@forwardemail.net`.
   * `X-Complaints-To` - بقيمة `abuse@forwardemail.net`.

8. ثم نتحقق من الرسالة لـ [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail)، [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework)، [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain)، و [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * إذا فشلت الرسالة في DMARC وكان للنطاق سياسة رفض (مثل `p=reject` [كانت في سياسة DMARC](https://wikipedia.org/wiki/DMARC))، فسيتم رفضها برمز الخطأ 550. عادةً ما يمكن العثور على سياسة DMARC لنطاق في سجل <strong class="notranslate">TXT</strong> الفرعي `_dmarc`، (مثل `dig _dmarc.example.com txt`).
   * إذا فشلت الرسالة في SPF وكان للنطاق سياسة فشل صارمة (مثل `-all` في سياسة SPF بدلاً من `~all` أو عدم وجود سياسة على الإطلاق)، فسيتم رفضها برمز الخطأ 550. عادةً ما يمكن العثور على سياسة SPF لنطاق في سجل <strong class="notranslate">TXT</strong> للنطاق الجذر (مثل `dig example.com txt`). راجع هذا القسم لمزيد من المعلومات حول [إرسال البريد كـ Gmail](#can-i-send-mail-as-in-gmail-with-this) بخصوص SPF.
9. الآن نقوم بمعالجة المستلمين للرسالة كما تم جمعهم من أمر `RCPT TO` في القسم [كيف يعمل نظام إعادة توجيه البريد الإلكتروني الخاص بك](#how-does-your-email-forwarding-system-work) أعلاه. لكل مستلم، نقوم بالعمليات التالية:

   * نقوم بالبحث عن سجلات <strong class="notranslate">TXT</strong> لاسم النطاق (الجزء بعد رمز `@`، مثلًا `example.com` إذا كان عنوان البريد الإلكتروني هو `test@example.com`). على سبيل المثال، إذا كان النطاق هو `example.com` نقوم بعملية بحث DNS مثل `dig example.com txt`.
   * نقوم بتحليل جميع سجلات <strong class="notranslate">TXT</strong> التي تبدأ إما بـ `forward-email=` (لخطط مجانية) أو `forward-email-site-verification=` (لخطط مدفوعة). لاحظ أننا نقوم بتحليل كلاهما، لمعالجة الرسائل أثناء ترقية أو تخفيض المستخدم للخطط.
   * من هذه السجلات <strong class="notranslate">TXT</strong> المحللة، نقوم بالتكرار عليها لاستخراج تكوين إعادة التوجيه (كما هو موضح في القسم [كيف أبدأ وأعد إعداد إعادة توجيه البريد الإلكتروني](#how-do-i-get-started-and-set-up-email-forwarding) أعلاه). لاحظ أننا ندعم فقط قيمة واحدة لـ `forward-email-site-verification=`، وإذا تم توفير أكثر من واحدة، فسيحدث خطأ 550 وسيتلقى المرسل ردًا مرتدًا لهذا المستلم.
   * بشكل متكرر، نقوم بالتكرار على تكوين إعادة التوجيه المستخرج لتحديد إعادة التوجيه العامة، وإعادة التوجيه بناءً على التعبيرات النمطية، وجميع تكوينات إعادة التوجيه الأخرى المدعومة – والتي تُعرف الآن باسم "عناوين إعادة التوجيه" الخاصة بنا.
   * لكل عنوان إعادة توجيه، ندعم بحثًا تكراريًا واحدًا (والذي سيبدأ سلسلة العمليات هذه مرة أخرى على العنوان المعطى). إذا تم العثور على تطابق تكراري، فسيتم إزالة النتيجة الأصلية من عناوين إعادة التوجيه، وإضافة النتائج الفرعية.
   * يتم تحليل عناوين إعادة التوجيه للتحقق من التفرد (لأننا لا نريد إرسال نسخ مكررة إلى عنوان واحد أو إنشاء اتصالات SMTP إضافية غير ضرورية).
   * لكل عنوان إعادة توجيه، نقوم بالبحث عن اسم نطاقه مقابل نقطة النهاية API `/v1/max-forwarded-addresses` (لتحديد عدد العناوين التي يسمح للنطاق بإعادة توجيه البريد الإلكتروني إليها لكل اسم مستعار، مثلًا 10 بشكل افتراضي – انظر القسم الخاص بـ [الحد الأقصى لإعادة التوجيه لكل اسم مستعار](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). إذا تم تجاوز هذا الحد، فسيحدث خطأ 550 وسيتلقى المرسل ردًا مرتدًا لهذا المستلم.
   * نقوم بالبحث عن إعدادات المستلم الأصلي مقابل نقطة النهاية API `/v1/settings`، والتي تدعم البحث للمستخدمين المدفوعين (مع وجود بديل للمستخدمين المجانيين). هذا يعيد كائن تكوين للإعدادات المتقدمة لـ `port` (رقم، مثلًا `25`)، `has_adult_content_protection` (قيمة منطقية)، `has_phishing_protection` (قيمة منطقية)، `has_executable_protection` (قيمة منطقية)، و `has_virus_protection` (قيمة منطقية).
   * بناءً على هذه الإعدادات، نتحقق بعد ذلك من نتائج فاحص الرسائل المزعجة وإذا حدثت أي أخطاء، يتم رفض الرسالة برمز الخطأ 554 (مثلًا إذا كان `has_virus_protection` مفعّلًا، فسنقوم بفحص نتائج فاحص الرسائل المزعجة للفيروسات). لاحظ أن جميع مستخدمي الخطط المجانية سيتم اختيارهم تلقائيًا للفحص ضد المحتوى البالغ، والتصيد الاحتيالي، والبرامج التنفيذية، والفيروسات. بشكل افتراضي، يتم اختيار جميع مستخدمي الخطط المدفوعة أيضًا، لكن يمكن تعديل هذا التكوين ضمن صفحة الإعدادات لنطاق في لوحة تحكم Forward Email).

10. لكل عناوين إعادة التوجيه للمستلم المعالج، نقوم بعد ذلك بالعمليات التالية:

    * يتم فحص العنوان مقابل [قائمة الرفض](#do-you-have-a-denylist)، وإذا كان مدرجًا، فسيحدث رمز الخطأ 421 (يشير للمرسل بإعادة المحاولة لاحقًا).
    * إذا كان العنوان هو webhook، فنقوم بتعيين قيمة منطقية للعمليات المستقبلية (انظر أدناه – نجمع معًا webhooks المتشابهة لعمل طلب POST واحد بدلاً من عدة طلبات للتسليم).
    * إذا كان العنوان هو عنوان بريد إلكتروني، فنقوم بتحليل المضيف للعمليات المستقبلية (انظر أدناه – نجمع معًا المضيفين المتشابهين لعمل اتصال واحد بدلاً من عدة اتصالات فردية للتسليم).
11. إذا لم يكن هناك مستلمون ولم تكن هناك رسائل مرتدة، فإننا نرد بخطأ 550 مع رسالة "مستلمون غير صالحون".

12. إذا كان هناك مستلمون، فإننا نتكرر عليهم (مجمّعين حسب نفس المضيف) ونقوم بتسليم الرسائل الإلكترونية. انظر القسم [كيف تتعامل مع مشاكل تسليم البريد الإلكتروني](#how-do-you-handle-email-delivery-issues) أدناه لمزيد من التوضيح.

    * إذا حدثت أي أخطاء أثناء إرسال الرسائل الإلكترونية، فسنقوم بتخزينها في الذاكرة للمعالجة لاحقًا.
    * سنأخذ أدنى رمز خطأ (إن وجد) من إرسال الرسائل الإلكترونية – ونستخدمه كرمز استجابة لأمر `DATA`. هذا يعني أن الرسائل التي لم تُسلم عادةً ما سيتم إعادة محاولة إرسالها من قبل المرسل الأصلي، بينما الرسائل التي تم تسليمها بالفعل لن تُعاد إرسالها في المرة القادمة التي يتم فيها إرسال الرسالة (لأننا نستخدم [البصمة](#how-do-you-determine-an-email-fingerprint)).
    * إذا لم تحدث أخطاء، فسوف نرسل رمز حالة استجابة SMTP ناجح 250.
    * يُعتبر الارتداد أي محاولة تسليم تؤدي إلى رمز حالة >= 500 (فشل دائم).

13. إذا لم تحدث ارتدادات (فشل دائم)، فسوف نعيد رمز حالة استجابة SMTP لأدنى رمز خطأ من الأخطاء غير الدائمة (أو رمز حالة ناجح 250 إذا لم تكن هناك أخطاء).

14. إذا حدثت ارتدادات، فسوف نرسل رسائل ارتداد في الخلفية بعد إعادة أدنى رمز من جميع رموز الأخطاء إلى المرسل. ومع ذلك، إذا كان أدنى رمز خطأ >= 500، فلن نرسل أي رسائل ارتداد. وذلك لأنه إذا فعلنا، فسيتلقى المرسلون رسالة ارتداد مزدوجة (مثل واحدة من خادم البريد الصادر الخاص بهم، مثل Gmail – وأخرى منا). انظر القسم حول [كيف تحمي نفسك من الارتداد العكسي](#how-do-you-protect-against-backscatter) أدناه لمزيد من التوضيح.

### كيف تتعامل مع مشاكل تسليم البريد الإلكتروني {#how-do-you-handle-email-delivery-issues}

لاحظ أننا سنقوم بإعادة كتابة "المرسل الودي" على الرسائل الإلكترونية فقط إذا لم يكن سياسة DMARC للمرسل ناجحة و لم تكن توقيعات DKIM متوافقة مع رأس "From". هذا يعني أننا سنغير رأس "From" في الرسالة، ونضع "X-Original-From"، ونضع أيضًا "Reply-To" إذا لم يكن مضبوطًا مسبقًا. سنعيد أيضًا ختم ARC على الرسالة بعد تعديل هذه الرؤوس.

نستخدم أيضًا تحليلًا ذكيًا لرسائل الخطأ على كل مستوى من مكدسنا – في الكود الخاص بنا، طلبات DNS، مكونات Node.js الداخلية، طلبات HTTP (مثل 408، 413، و429 يتم تحويلها إلى رمز استجابة SMTP 421 إذا كان المستلم هو webhook)، واستجابات خادم البريد (مثل الاستجابات التي تحتوي على "defer" أو "slowdown" سيتم إعادة محاولة إرسالها كأخطاء 421).

منطقنا سهل الاستخدام وسنقوم أيضًا بإعادة المحاولة لأخطاء SSL/TLS، مشاكل الاتصال، والمزيد. الهدف من سهولة الاستخدام هو تعظيم إمكانية التسليم لجميع المستلمين في تكوين إعادة التوجيه.

إذا كان المستلم هو webhook، فسوف نسمح بمهلة 60 ثانية لإكمال الطلب مع ما يصل إلى 3 محاولات إعادة (أي 4 طلبات إجمالاً قبل الفشل). لاحظ أننا نحلل بشكل صحيح رموز الخطأ 408، 413، و429 ونحولها إلى رمز استجابة SMTP 421.

أما إذا كان المستلم هو عنوان بريد إلكتروني، فسوف نحاول إرسال البريد الإلكتروني باستخدام TLS انتهازي (نحاول استخدام STARTTLS إذا كان متاحًا على خادم البريد الخاص بالمستلم). إذا حدث خطأ SSL/TLS أثناء محاولة إرسال البريد الإلكتروني، فسوف نحاول إرسال البريد الإلكتروني بدون TLS (دون استخدام STARTTLS).

إذا حدثت أي أخطاء في DNS أو الاتصال، فسوف نعيد إلى أمر `DATA` رمز استجابة SMTP 421، وإلا إذا كانت هناك أخطاء بمستوى >= 500، فسيتم إرسال رسائل الارتداد.

إذا اكتشفنا أن خادم البريد الذي نحاول التسليم إليه قد حظر واحدًا أو أكثر من عناوين IP الخاصة بتبادل البريد لدينا (مثلًا بواسطة التقنية التي يستخدمونها لتأجيل المرسلين المزعجين)، فسوف نرسل رمز استجابة SMTP 421 ليقوم المرسل بإعادة محاولة إرسال رسالته لاحقًا (ونحن نتلقى تنبيهًا بالمشكلة حتى نتمكن من حلها قبل المحاولة التالية).

### كيف تتعامل مع حظر عناوين IP الخاصة بك {#how-do-you-handle-your-ip-addresses-becoming-blocked}
نحن نراقب بشكل روتيني جميع قوائم الرفض الرئيسية لنظام أسماء النطاقات (DNS) وإذا تم إدراج أي من عناوين IP الخاصة بتبادل البريد ("MX") في قائمة رفض رئيسية، فسوف نقوم بإزالتها من سجل DNS A ذي التناوب الدائري ذي الصلة إذا أمكن ذلك حتى يتم حل المشكلة.

في وقت كتابة هذا، نحن مدرجون أيضًا في عدة قوائم سماح لنظام أسماء النطاقات، ونحن نأخذ مراقبة قوائم الرفض على محمل الجد. إذا لاحظت أي مشاكل قبل أن تتاح لنا الفرصة لحلها، يرجى إعلامنا كتابيًا على <support@forwardemail.net>.

عناوين IP الخاصة بنا متاحة للجمهور، [انظر هذا القسم أدناه لمزيد من المعلومات](#what-are-your-servers-ip-addresses).

### ما هي عناوين البريد الإلكتروني لمسؤول البريد {#what-are-postmaster-addresses}

من أجل منع ارتداد الرسائل الموجهة بشكل خاطئ وإرسال رسائل الرد التلقائي للعطلات إلى صناديق بريد غير مراقبة أو غير موجودة، نقوم بالحفاظ على قائمة بأسماء المستخدمين المشابهة لـ mailer-daemon:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [وأي عنوان لا يرد عليه](#what-are-no-reply-addresses)

انظر [RFC 5320 القسم 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) لمزيد من المعلومات حول كيفية استخدام قوائم مثل هذه لإنشاء أنظمة بريد إلكتروني فعالة.

### ما هي عناوين البريد الإلكتروني التي لا ترد {#what-are-no-reply-addresses}

تعتبر أسماء المستخدمين للبريد الإلكتروني التي تساوي أيًا من التالي (غير حساسة لحالة الأحرف) عناوين لا ترد:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

يتم الحفاظ على هذه القائمة [كمشروع مفتوح المصدر على GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### ما هي عناوين IP الخاصة بخوادمكم {#what-are-your-servers-ip-addresses}

ننشر عناوين IP الخاصة بنا على <https://forwardemail.net/ips>.

### هل لديكم قائمة سماح {#do-you-have-an-allowlist}

نعم، لدينا [قائمة بامتدادات أسماء النطاقات](#what-domain-name-extensions-are-allowlisted-by-default) التي يتم السماح بها بشكل افتراضي وقائمة سماح ديناميكية ومخزنة ومتجددة تعتمد على [معايير صارمة](#what-is-your-allowlist-criteria).

يتم التحقق تلقائيًا من جميع النطاقات والبريد الإلكتروني وعناوين IP المستخدمة من قبل العملاء المدفوعين مقابل قائمة الرفض لدينا كل ساعة – مما ينبه المسؤولين الذين يمكنهم التدخل يدويًا إذا لزم الأمر.

بالإضافة إلى ذلك، إذا تم إدراج أحد نطاقاتك أو عناوين البريد الإلكتروني الخاصة به في قائمة الرفض (على سبيل المثال لإرسال البريد المزعج، الفيروسات، أو بسبب هجمات انتحال الهوية) – فسيتم إخطار مسؤولي النطاق (أنتم) ومسؤولي فريقنا عبر البريد الإلكتروني فورًا. نوصي بشدة بأن تقوم بـ [تكوين DMARC](#how-do-i-set-up-dmarc-for-forward-email) لمنع ذلك.

### ما هي امتدادات أسماء النطاقات التي يتم السماح بها بشكل افتراضي {#what-domain-name-extensions-are-allowlisted-by-default}

تعتبر امتدادات أسماء النطاقات التالية مسموح بها بشكل افتراضي (بغض النظر عما إذا كانت على قائمة شعبية Umbrella أم لا):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
  <li class="list-inline-item"><code class="notranslate">dni.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fed.us</code></li>
  <li class="list-inline-item"><code class="notranslate">isa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">kids.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ak.us</code></li>
  <li class="list-inline-item"><code class="notranslate">al.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ar.us</code></li>
  <li class="list-inline-item"><code class="notranslate">as.us</code></li>
  <li class="list-inline-item"><code class="notranslate">az.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ca.us</code></li>
  <li class="list-inline-item"><code class="notranslate">co.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ct.us</code></li>
  <li class="list-inline-item"><code class="notranslate">dc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">de.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fl.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ga.us</code></li>
  <li class="list-inline-item"><code class="notranslate">gu.us</code></li>
  <li class="list-inline-item"><code class="notranslate">hi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ia.us</code></li>
  <li class="list-inline-item"><code class="notranslate">id.us</code></li>
  <li class="list-inline-item"><code class="notranslate">il.us</code></li>
  <li class="list-inline-item"><code class="notranslate">in.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ks.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ky.us</code></li>
  <li class="list-inline-item"><code class="notranslate">la.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ma.us</code></li>
  <li class="list-inline-item"><code class="notranslate">md.us</code></li>
  <li class="list-inline-item"><code class="notranslate">me.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mo.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ne.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nj.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nm.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ny.us</code></li>
  <li class="list-inline-item"><code class="notranslate">oh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ok.us</code></li>
  <li class="list-inline-item"><code class="notranslate">or.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pr.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ri.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.au</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.at</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.br</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">school.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">health.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.in</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.in</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">es.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.es</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.th</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.th</code></li>
  <li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
  <li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">go.id</code></li>
  <li class="list-inline-item"><code class="notranslate">go.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">go.ke</code></li>
  <li class="list-inline-item"><code class="notranslate">go.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">go.th</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.es</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.af</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.al</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.am</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.au</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.az</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.be</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gov.by</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.co</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.il</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.im</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.in</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.it</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.je</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.my</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.np</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.py</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.se</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.si</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.za</code></li>
  <li class="list-inline-item"><code class="notranslate">government.pn</code></li>
  <li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gv.at</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">police.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>
بالإضافة إلى ذلك، فإن هذه [نطاقات العلامات التجارية والشركات من المستوى الأعلى](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) مدرجة في القائمة البيضاء بشكل افتراضي (على سبيل المثال `apple` لـ `applecard.apple` لكشوف حسابات بنك Apple Card):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
اعتبارًا من 18 مارس 2025 أضفنا أيضًا هذه الأراضي الفرنسية الخارجية إلى هذه القائمة ([وفقًا لهذا الطلب على GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

اعتبارًا من 8 يوليو 2025 أضفنا هذه الدول الخاصة بأوروبا:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

في أكتوبر 2025 أضفنا أيضًا <code class="notranslate">cz</code> (جمهورية التشيك) بناءً على الطلب.

لم ندرج تحديدًا `ru` و `ua` بسبب النشاط العالي للبريد المزعج.

### ما هي معايير قائمة السماح الخاصة بك {#what-is-your-allowlist-criteria}

لدينا قائمة ثابتة من [امتدادات أسماء النطاقات المسموح بها افتراضيًا](#what-domain-name-extensions-are-allowlisted-by-default) – ونحافظ أيضًا على قائمة سماح ديناميكية ومخبأة ومتجددة بناءً على المعايير الصارمة التالية:

* يجب أن يكون نطاق الجذر للمرسل من [امتداد اسم نطاق يتطابق مع القائمة التي نقدمها في خطتنا المجانية](#what-domain-name-extensions-can-be-used-for-free) (مع إضافة `biz` و `info`). كما ندرج تطابقات جزئية لـ `edu` و `gov` و `mil`، مثل `xyz.gov.au` و `xyz.edu.au`.
* يجب أن يكون نطاق الجذر للمرسل ضمن أفضل 100,000 نتيجة فريدة لنطاقات الجذر من قائمة شعبية Umbrella ([Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List")) ("UPL").
* يجب أن يكون نطاق الجذر للمرسل ضمن أفضل 50,000 نتيجة من نطاقات الجذر الفريدة التي ظهرت في 4 أيام على الأقل من الأيام السبعة الماضية لقوائم UPL (~50%+).
* يجب ألا يكون نطاق الجذر للمرسل [مصنفًا](https://radar.cloudflare.com/categorization-feedback/) كمحتوى للبالغين أو برمجيات خبيثة من قبل Cloudflare.
* يجب أن يحتوي نطاق الجذر للمرسل على سجلات A أو MX.
* يجب أن يحتوي نطاق الجذر للمرسل على سجلات A أو سجلات MX أو سجل DMARC مع `p=reject` أو `p=quarantine`، أو سجل SPF مع مؤهل `-all` أو `~all`.

إذا تم استيفاء هذه المعايير، فسيتم تخزين نطاق الجذر للمرسل في ذاكرة التخزين المؤقت لمدة 7 أيام. لاحظ أن مهمتنا الآلية تعمل يوميًا – لذلك هذه قائمة سماح متجددة يتم تحديثها يوميًا.

ستقوم مهمتنا الآلية بتنزيل قوائم UPL للأيام السبعة السابقة في الذاكرة، وفك ضغطها، ثم تحليلها في الذاكرة وفقًا للمعايير الصارمة أعلاه.

النطاقات الشهيرة في وقت كتابة هذا النص مثل Google و Yahoo و Microsoft و Amazon و Meta و Twitter و Netflix و Spotify والمزيد – مدرجة بالطبع.
إذا كنت مرسلًا غير مدرج في قائمة السماح لدينا، فسيتم في المرة الأولى التي يرسل فيها اسم النطاق الجذري FQDN الخاص بك أو عنوان IP بريدًا إلكترونيًا، [تقييد معدل الإرسال](#do-you-have-rate-limiting) و[القائمة الرمادية](#do-you-have-a-greylist). لاحظ أن هذا إجراء قياسي معتمد كمعيار للبريد الإلكتروني. ستقوم معظم عملاء خوادم البريد الإلكتروني بمحاولة إعادة الإرسال إذا تلقوا خطأ تقييد معدل الإرسال أو خطأ القائمة الرمادية (مثل رمز حالة الخطأ 421 أو رمز خطأ من المستوى 4xx).

**لاحظ أن مرسلين محددين مثل `a@gmail.com`، `b@xyz.edu`، و `c@gov.au` يمكنهم أيضًا أن يكونوا [مدرجين في قائمة الحظر](#do-you-have-a-denylist)** (على سبيل المثال إذا اكتشفنا تلقائيًا رسائل غير مرغوب فيها أو تصيد احتيالي أو برامج ضارة من هؤلاء المرسلين).

### ما هي امتدادات أسماء النطاقات التي يمكن استخدامها مجانًا {#what-domain-name-extensions-can-be-used-for-free}

اعتبارًا من 31 مارس 2023، قمنا بفرض قاعدة شاملة جديدة لمكافحة الرسائل غير المرغوب فيها لحماية مستخدمينا وخدماتنا.

تسمح هذه القاعدة الجديدة باستخدام امتدادات أسماء النطاقات التالية فقط في خطتنا المجانية:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### هل لديك قائمة رمادية {#do-you-have-a-greylist}

نعم، لدينا سياسة [القائمة الرمادية للبريد الإلكتروني](https://en.wikipedia.org/wiki/Greylisting_\(email\)) متساهلة جدًا. تنطبق القائمة الرمادية فقط على المرسلين غير الموجودين في قائمتنا البيضاء وتستمر في ذاكرة التخزين المؤقت لدينا لمدة 30 يومًا.

بالنسبة لأي مرسل جديد، نقوم بتخزين مفتاح في قاعدة بيانات Redis لدينا لمدة 30 يومًا بقيمة تم تعيينها لوقت وصول أول طلب لهم. ثم نرفض بريدهم الإلكتروني مع رمز حالة إعادة المحاولة 450 ولا نسمح له بالمرور إلا بعد مرور 5 دقائق.

إذا انتظروا بنجاح لمدة 5 دقائق من وقت الوصول الأولي هذا، فسيتم قبول رسائلهم الإلكترونية ولن يتلقوا رمز الحالة 450 هذا.

يتكون المفتاح إما من اسم النطاق الجذري المؤهل بالكامل (FQDN) أو عنوان IP الخاص بالمرسل. هذا يعني أن أي نطاق فرعي يمر عبر القائمة الرمادية سيمر أيضًا للنطاق الجذري، والعكس صحيح (هذا ما نعنيه بسياسة "متساهلة جدًا").

على سبيل المثال، إذا جاء بريد إلكتروني من `test.example.com` قبل أن نرى بريدًا من `example.com`، فسيضطر أي بريد من `test.example.com` و/أو `example.com` إلى الانتظار 5 دقائق من وقت الوصول الأولي للاتصال. نحن لا نجعل كل من `test.example.com` و `example.com` ينتظران فترات الخمس دقائق الخاصة بهما (تنطبق سياسة القائمة الرمادية لدينا على مستوى النطاق الجذري).

لاحظ أن القائمة الرمادية لا تنطبق على أي مرسل في [القائمة البيضاء](#do-you-have-an-allowlist) لدينا (مثل Meta، Amazon، Netflix، Google، Microsoft في وقت كتابة هذا).

### هل لديك قائمة حظر {#do-you-have-a-denylist}

نعم، ندير قائمتنا الخاصة للحظر ونقوم بتحديثها تلقائيًا في الوقت الحقيقي ويدويًا بناءً على النشاطات المزعجة والخبيثة المكتشفة.

نقوم أيضًا بسحب جميع عناوين IP من قائمة الحظر UCEPROTECT المستوى 1 على <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> كل ساعة وندخلها في قائمتنا للحظر مع انتهاء صلاحية بعد 7 أيام.

المرسلون الموجودون في قائمة الحظر سيتلقون رمز الخطأ 421 (يشير للمرسل بإعادة المحاولة لاحقًا) إذا [لم يكونوا في القائمة البيضاء](#do-you-have-an-allowlist).

باستخدام رمز الحالة 421 بدلاً من 554، يمكن التخفيف من الإيجابيات الكاذبة المحتملة في الوقت الحقيقي ثم يمكن تسليم الرسالة بنجاح في المحاولة التالية.

**هذا مصمم بشكل مختلف عن خدمات البريد الأخرى**، حيث إذا تم وضعك في قائمة الحظر، يحدث فشل دائم وصارم. غالبًا ما يكون من الصعب طلب إعادة المحاولة من المرسلين (خاصة من المؤسسات الكبيرة)، وبالتالي تعطي هذه الطريقة حوالي 5 أيام من محاولة البريد الإلكتروني الأولى إما للمرسل أو المستلم أو لنا للتدخل وحل المشكلة (عن طريق طلب إزالة من قائمة الحظر).

جميع طلبات إزالة الحظر تتم مراقبتها في الوقت الحقيقي من قبل المسؤولين (مثلًا حتى يمكن السماح دائمًا بالإيجابيات الكاذبة المتكررة من قبل المسؤولين).

يمكن طلب إزالة الحظر على <https://forwardemail.net/denylist>. يتم معالجة طلبات إزالة الحظر للمستخدمين المدفوعين فورًا، بينما يجب على المستخدمين غير المدفوعين الانتظار حتى يقوم المسؤولون بمعالجة طلبهم.

المرسلون الذين يتم اكتشاف إرسالهم للبريد المزعج أو محتوى فيروسي سيتم إضافتهم إلى قائمة الحظر بالنهج التالي:

1. يتم وضع [بصمة الرسالة الأولية](#how-do-you-determine-an-email-fingerprint) في القائمة الرمادية عند اكتشاف البريد المزعج أو وجودها في قائمة الحظر من مرسل "موثوق" (مثل `gmail.com`، `microsoft.com`، `apple.com`).
   * إذا كان المرسل في القائمة البيضاء، يتم وضع الرسالة في القائمة الرمادية لمدة ساعة واحدة.
   * إذا لم يكن المرسل في القائمة البيضاء، يتم وضع الرسالة في القائمة الرمادية لمدة 6 ساعات.
2. نقوم بتحليل مفاتيح قائمة الحظر من معلومات المرسل والرسالة، ولكل من هذه المفاتيح ننشئ (إذا لم يكن موجودًا بالفعل) عدادًا، نزيده بمقدار 1، ونخزنه لمدة 24 ساعة.
   * للمرسلين في القائمة البيضاء:
     * إضافة مفتاح لعنوان البريد الإلكتروني في الظرف "MAIL FROM" إذا كان لديه SPF ناجح أو لا يوجد SPF، ولم يكن [اسم مستخدم postmaster](#what-are-postmaster-addresses) أو [اسم مستخدم no-reply](#what-are-no-reply-addresses).
     * إذا كان رأس "From" في القائمة البيضاء، فقم بإضافة مفتاح لعنوان البريد الإلكتروني في رأس "From" إذا كان لديه SPF ناجح أو DKIM ناجح ومتوافق.
     * إذا لم يكن رأس "From" في القائمة البيضاء، فقم بإضافة مفتاح لعنوان البريد الإلكتروني في رأس "From" واسم النطاق الجذري المحلل الخاص به.
   * للمرسلين غير الموجودين في القائمة البيضاء:
     * إضافة مفتاح لعنوان البريد الإلكتروني في الظرف "MAIL FROM" إذا كان لديه SPF ناجح.
     * إذا كان رأس "From" في القائمة البيضاء، فقم بإضافة مفتاح لعنوان البريد الإلكتروني في رأس "From" إذا كان لديه SPF ناجح أو DKIM ناجح ومتوافق.
     * إذا لم يكن رأس "From" في القائمة البيضاء، فقم بإضافة مفتاح لعنوان البريد الإلكتروني في رأس "From" واسم النطاق الجذري المحلل الخاص به.
     * إضافة مفتاح لعنوان IP البعيد للمرسل.
     * إضافة مفتاح لاسم المضيف المحلّل للعميل عن طريق البحث العكسي من عنوان IP الخاص بالمرسل (إن وجد).
     * إضافة مفتاح للنطاق الجذري لاسم المضيف المحلّل للعميل (إن وجد، وإذا كان يختلف عن اسم المضيف المحلّل للعميل).
3. إذا وصل العداد إلى 5 لمرسل ومفتاح غير موجود في القائمة البيضاء، فإننا نضيف المفتاح إلى قائمة الحظر لمدة 30 يومًا ويتم إرسال بريد إلكتروني إلى فريق مكافحة الإساءة لدينا. قد تتغير هذه الأرقام وسيتم تحديثها هنا أثناء مراقبة الإساءة.
4. إذا وصل العداد إلى 10 لمرسل ومفتاح موجود في القائمة البيضاء، فإننا نضيف المفتاح إلى قائمة الحظر لمدة 7 أيام ويتم إرسال بريد إلكتروني إلى فريق مكافحة الإساءة لدينا. قد تتغير هذه الأرقام وسيتم تحديثها هنا أثناء مراقبة الإساءة.
> **ملاحظة:** في المستقبل القريب سنقدم مراقبة السمعة. ستقوم مراقبة السمعة بحساب متى يتم إدراج المرسل في القائمة السوداء بناءً على عتبة نسبة مئوية (بدلاً من عداد بدائي كما هو مذكور أعلاه).

### هل لديك تحديد معدل {#do-you-have-rate-limiting}

تحديد معدل المرسل يكون إما حسب النطاق الجذري المستخرج من بحث PTR عكسي على عنوان IP الخاص بالمرسل – أو إذا لم ينتج عن ذلك نتيجة، فإنه يستخدم ببساطة عنوان IP الخاص بالمرسل. لاحظ أننا نشير إلى هذا باسم `Sender` أدناه.

خوادم MX لدينا لديها حدود يومية للبريد الوارد المستلم لـ [تخزين IMAP المشفر](/blog/docs/best-quantum-safe-encrypted-email-service):

* بدلاً من تحديد معدل البريد الوارد المستلم على أساس كل اسم مستعار فردي (مثل `you@yourdomain.com`) – نحن نحدد المعدل حسب اسم نطاق الاسم المستعار نفسه (مثل `yourdomain.com`). هذا يمنع `Senders` من إغراق صناديق البريد لجميع الأسماء المستعارة عبر نطاقك دفعة واحدة.
* لدينا حدود عامة تنطبق على جميع `Senders` عبر خدمتنا بغض النظر عن المستلم:
  * `Senders` الذين نعتبرهم "موثوقين" كمصدر للحقيقة (مثل `gmail.com`، `microsoft.com`، `apple.com`) محدودون بإرسال 100 جيجابايت يوميًا.
  * `Senders` الذين هم [في القائمة المسموح بها](#do-you-have-an-allowlist) محدودون بإرسال 10 جيجابايت يوميًا.
  * جميع `Senders` الآخرين محدودون بإرسال 1 جيجابايت و/أو 1000 رسالة يوميًا.
* لدينا حد محدد لكل `Sender` و `yourdomain.com` وهو 1 جيجابايت و/أو 1000 رسالة يوميًا.

تقوم خوادم MX أيضًا بتحديد الرسائل التي يتم إعادة توجيهها إلى مستلم أو أكثر من خلال تحديد المعدل – لكن هذا ينطبق فقط على `Senders` غير الموجودين في [القائمة المسموح بها](#do-you-have-an-allowlist):

* نسمح فقط بما يصل إلى 100 اتصال في الساعة، لكل مجال جذري FQDN محلل لـ `Sender` (أو) عنوان IP البعيد لـ `Sender` (إذا لم يتوفر PTR عكسي)، ولكل مستلم في الظرف. نحن نخزن المفتاح لتحديد المعدل كهاش تشفير في قاعدة بيانات Redis الخاصة بنا.

* إذا كنت ترسل بريدًا إلكترونيًا من خلال نظامنا، يرجى التأكد من إعداد PTR عكسي لجميع عناوين IP الخاصة بك (وإلا سيتم تحديد معدل كل مجال جذري FQDN فريد أو عنوان IP ترسل منه).

* لاحظ أنه إذا كنت ترسل عبر نظام شائع مثل Amazon SES، فلن يتم تحديد معدل عليك لأن (في وقت كتابة هذا) Amazon SES مدرج في قائمتنا المسموح بها.

* إذا كنت ترسل من نطاق مثل `test.abc.123.example.com`، فسيتم فرض تحديد المعدل على `example.com`. يستخدم العديد من مرسلي البريد المزعج مئات النطاقات الفرعية لتجاوز مرشحات البريد المزعج الشائعة التي تحدد المعدل فقط لأسماء المضيف الفريدة بدلاً من المجالات الجذرية FQDN الفريدة.

* `Senders` الذين يتجاوزون حد المعدل سيتم رفضهم بخطأ 421.

تقوم خوادم IMAP و SMTP بتحديد عدد الاتصالات المتزامنة لأسماء مستعاراتك بحيث لا تتجاوز `60` اتصالًا في نفس الوقت.

تقوم خوادم MX بتحديد المرسلين [غير الموجودين في القائمة المسموح بها](#do-you-have-an-allowlist) من إنشاء أكثر من 10 اتصالات متزامنة (مع انتهاء صلاحية ذاكرة التخزين المؤقت للعداد بعد 3 دقائق، والتي تعكس مهلة المقبس لدينا البالغة 3 دقائق).

### كيف تحمي من الارتداد العكسي {#how-do-you-protect-against-backscatter}

الارتدادات الموجهة بشكل خاطئ أو البريد المزعج المرتد (المعروف باسم "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") يمكن أن تسبب سمعة سلبية لعناوين IP الخاصة بالمرسل.

نتخذ خطوتين للحماية من الارتداد العكسي، والتي يتم تفصيلها في الأقسام التالية [منع الارتدادات من مرسلي MAIL FROM المعروفين](#prevent-bounces-from-known-mail-from-spammers) و [منع الارتدادات غير الضرورية للحماية من الارتداد العكسي](#prevent-unnecessary-bounces-to-protect-against-backscatter) أدناه.

### منع الارتدادات من مرسلي MAIL FROM المعروفين {#prevent-bounces-from-known-mail-from-spammers}

نستخرج القائمة من [Backscatter.org](https://www.backscatterer.org/) (مدعوم من [UCEPROTECT](https://www.uceprotect.net/)) على <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> كل ساعة وندخلها في قاعدة بيانات Redis الخاصة بنا (نقارن أيضًا الفرق مسبقًا؛ في حال تم إزالة أي عناوين IP يجب احترامها).
إذا كان MAIL FROM فارغًا أو يساوي (بغض النظر عن حالة الأحرف) أيًا من [عناوين مدير البريد](#what-are-postmaster-addresses) (الجزء قبل @ في البريد الإلكتروني)، فإننا نتحقق مما إذا كان عنوان IP للمرسل يطابق واحدًا من هذه القائمة.

إذا كان عنوان IP للمرسل مدرجًا (وليس في [قائمة السماح](#do-you-have-an-allowlist) الخاصة بنا)، فإننا نرسل خطأ 554 مع الرسالة `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. سيتم تنبيهنا إذا كان المرسل موجودًا في كل من قائمة Backscatterer وقائمة السماح لدينا حتى نتمكن من حل المشكلة إذا لزم الأمر.

التقنيات الموضحة في هذا القسم تلتزم بتوصية "الوضع الآمن" في <https://www.backscatterer.org/?target=usage> – حيث نتحقق من عنوان IP للمرسل فقط إذا تم استيفاء شروط معينة مسبقًا.

### منع الارتدادات غير الضرورية للحماية من الارتداد العكسي {#prevent-unnecessary-bounces-to-protect-against-backscatter}

الارتدادات هي رسائل بريد إلكتروني تشير إلى فشل إعادة توجيه البريد الإلكتروني بالكامل إلى المستلم ولن يتم إعادة المحاولة.

سبب شائع لإدراجك في قائمة Backscatterer هو الارتدادات الموجهة بشكل خاطئ أو البريد العشوائي للارتدادات، لذا يجب أن نحمي ضد هذا بعدة طرق:

1. نرسل فقط عندما تحدث أخطاء برمز حالة >= 500 (عندما تفشل محاولات إعادة توجيه البريد الإلكتروني، مثل استجابة Gmail بخطأ من المستوى 500).

2. نرسل مرة واحدة فقط (نستخدم مفتاح بصمة ارتداد محسوب ونخزنه في ذاكرة التخزين المؤقت لمنع الإرسال المكرر). بصمة الارتداد هي مفتاح هو بصمة الرسالة مدمجة مع تجزئة عنوان الارتداد ورمز الخطأ الخاص به). راجع القسم الخاص بـ [بصمة الرسالة](#how-do-you-determine-an-email-fingerprint) لمزيد من الفهم حول كيفية حساب بصمة الرسالة. ستنتهي صلاحية بصمات الارتداد التي تم إرسالها بنجاح بعد 7 أيام في ذاكرة Redis الخاصة بنا.

3. نرسل فقط عندما لا يكون MAIL FROM و/أو From فارغًا ولا يحتوي (بغض النظر عن حالة الأحرف) على اسم مستخدم [مدير البريد](#what-are-postmaster-addresses) (الجزء قبل @ في البريد الإلكتروني).

4. لا نرسل إذا كانت الرسالة الأصلية تحتوي على أي من الرؤوس التالية (بغض النظر عن حالة الأحرف):

   * رأس `auto-submitted` بقيمة لا تساوي `no`.
   * رأس `x-auto-response-suppress` بقيمة `dr`، `autoreply`، `auto-reply`، `auto_reply`، أو `all`
   * رأس `list-id`، `list-subscribe`، `list-unsubscribe`، `list-help`، `list-post`، `list-owner`، `list-archive`، `x-autoreply`، `x-autorespond`، أو `x-auto-respond` (بغض النظر عن القيمة).
   * رأس `precedence` بقيمة `bulk`، `autoreply`، `auto-reply`، `auto_reply`، أو `list`.

5. لا نرسل إذا كان عنوان البريد الإلكتروني MAIL FROM أو From ينتهي بـ `+donotreply`، `-donotreply`، `+noreply`، أو `-noreply`.

6. لا نرسل إذا كان جزء اسم المستخدم في عنوان البريد الإلكتروني From هو `mdaemon` وكان يحتوي على رأس `X-MDDSN-Message` بغض النظر عن حالة الأحرف.

7. لا نرسل إذا كان هناك رأس `content-type` بقيمة `multipart/report` بغض النظر عن حالة الأحرف.

### كيف تحدد بصمة البريد الإلكتروني {#how-do-you-determine-an-email-fingerprint}

تُستخدم بصمة البريد الإلكتروني لتحديد تفرد البريد الإلكتروني ومنع تسليم الرسائل المكررة وإرسال [ارتدادات مكررة](#prevent-unnecessary-bounces-to-protect-against-backscatter).

يتم حساب البصمة من القائمة التالية:

* اسم المضيف FQDN أو عنوان IP الذي تم حله من العميل
* قيمة رأس `Message-ID` (إن وجدت)
* قيمة رأس `Date` (إن وجدت)
* قيمة رأس `From` (إن وجدت)
* قيمة رأس `To` (إن وجدت)
* قيمة رأس `Cc` (إن وجدت)
* قيمة رأس `Subject` (إن وجدت)
* قيمة `Body` (إن وجدت)

### هل يمكنني إعادة توجيه الرسائل إلى منافذ غير 25 (مثلاً إذا كان مزود خدمة الإنترنت قد حظر المنفذ 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

نعم، اعتبارًا من 5 مايو 2020 أضفنا هذه الميزة. حاليًا الميزة خاصة بالنطاق، وليس خاصة بالاسم المستعار. إذا كنت تحتاج أن تكون خاصة بالاسم المستعار، يرجى الاتصال بنا لإبلاغنا باحتياجاتك.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    حماية خصوصية محسنة:
  </strong>
  <span>
    إذا كنت على خطة مدفوعة (تتميز بحماية خصوصية محسنة)، فالرجاء الذهاب إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>، انقر على "الإعداد" بجانب نطاقك، ثم انقر على "الإعدادات". إذا كنت ترغب في معرفة المزيد عن الخطط المدفوعة، راجع صفحة <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">التسعير</a> الخاصة بنا. وإلا يمكنك متابعة التعليمات أدناه.
  </span>
</div>
إذا كنت تستخدم الخطة المجانية، فما عليك سوى إضافة سجل DNS <strong class="notranslate">TXT</strong> جديد كما هو موضح أدناه، ولكن قم بتغيير المنفذ من 25 إلى المنفذ الذي تختاره.

على سبيل المثال، إذا أردت أن يتم توجيه جميع الرسائل الإلكترونية التي تذهب إلى `example.com` إلى منفذ SMTP الخاص بالمستلمين المستعارين 1337 بدلاً من 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
    السيناريو الأكثر شيوعًا لإعداد إعادة التوجيه بمنفذ مخصص هو عندما تريد توجيه جميع الرسائل الإلكترونية التي تذهب إلى example.com إلى منفذ مختلف في example.com، غير المنفذ القياسي SMTP 25. لإعداد ذلك، ببساطة أضف سجل <strong class="notranslate">TXT</strong> شامل كما يلي.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### هل يدعم رمز الزائد + لأسماء مستعارة في جيميل {#does-it-support-the-plus--symbol-for-gmail-aliases}

نعم، بالتأكيد.

### هل يدعم النطاقات الفرعية {#does-it-support-sub-domains}

نعم، بالتأكيد. بدلاً من استخدام "@", ".", أو فارغ كاسم/مضيف/اسم مستعار، يمكنك استخدام اسم النطاق الفرعي كقيمة بدلاً من ذلك.

إذا أردت أن يتم توجيه الرسائل الإلكترونية إلى `foo.example.com`، فأدخل `foo` كقيمة الاسم/المضيف/الاسم المستعار في إعدادات DNS الخاصة بك (لكل من سجلات MX و<strong class="notranslate">TXT</strong>).

### هل يعيد توجيه رؤوس رسائل البريد الإلكتروني الخاصة بي {#does-this-forward-my-emails-headers}

نعم، بالتأكيد.

### هل تم اختباره جيدًا {#is-this-well-tested}

نعم، تم كتابة اختبارات باستخدام [ava](https://github.com/avajs/ava) ويوجد أيضًا تغطية للكود.

### هل تمرر رسائل واستجابات SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

نعم، بالتأكيد. على سبيل المثال، إذا كنت ترسل رسالة إلى `hello@example.com` وكانت مسجلة لإعادة التوجيه إلى `user@gmail.com`، فسيتم إرجاع رسالة واستجابة SMTP من خادم SMTP الخاص بـ "gmail.com" بدلاً من خادم البروكسي في "mx1.forwardemail.net" أو "mx2.forwardemail.net".

### كيف تمنعون المرسلين العشوائيين وتضمنون سمعة جيدة لإعادة توجيه البريد الإلكتروني {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

راجع أقسامنا حول [كيف يعمل نظام إعادة توجيه البريد الإلكتروني الخاص بك](#how-does-your-email-forwarding-system-work)، [كيف تتعامل مع مشاكل تسليم البريد الإلكتروني](#how-do-you-handle-email-delivery-issues)، و [كيف تتعامل مع حظر عناوين IP الخاصة بك](#how-do-you-handle-your-ip-addresses-becoming-blocked) أعلاه.

### كيف تقومون بعمليات بحث DNS على أسماء النطاقات {#how-do-you-perform-dns-lookups-on-domain-names}

أنشأنا مشروع برمجيات مفتوح المصدر :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) ونستخدمه لعمليات بحث DNS. خوادم DNS الافتراضية المستخدمة هي `1.1.1.1` و `1.0.0.1`، وتتم استعلامات DNS عبر [DNS عبر HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") على طبقة التطبيق.

:tangerine: [Tangerine](https://github.com/tangerine) يستخدم [خدمة DNS الخاصة بالمستهلك من CloudFlare التي تركز على الخصوصية بشكل افتراضي][cloudflare-dns].


## الحساب والفوترة {#account-and-billing}

### هل تقدمون ضمان استرداد الأموال على الخطط المدفوعة {#do-you-offer-a-money-back-guarantee-on-paid-plans}

نعم! يتم استرداد الأموال تلقائيًا عند الترقية أو التخفيض أو إلغاء حسابك خلال 30 يومًا من بدء خطتك لأول مرة. هذا ينطبق فقط على العملاء الجدد.
### إذا قمت بتغيير الخطط هل تقومون بالتقسيط واسترداد الفرق {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

نحن لا نقوم بالتقسيط ولا نسترد الفرق عند تغيير الخطط. بدلاً من ذلك، نقوم بتحويل المدة المتبقية من تاريخ انتهاء خطة الاشتراك الحالية إلى أقرب مدة نسبية لخطة الاشتراك الجديدة (مقربة للأسفل حسب الأشهر).

لاحظ أنه إذا قمت بالترقية أو التخفيض بين الخطط المدفوعة خلال نافذة 30 يومًا منذ بدء خطة مدفوعة لأول مرة، فسنقوم تلقائيًا باسترداد المبلغ الكامل من خطتك الحالية.

### هل يمكنني استخدام خدمة إعادة توجيه البريد الإلكتروني هذه كخادم MX "احتياطي" أو "تبديل تلقائي" {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

لا، لا يُنصح بذلك، حيث يمكنك استخدام خادم تبادل بريد إلكتروني واحد فقط في كل مرة. عادةً لا يتم إعادة محاولة الخوادم الاحتياطية بسبب سوء تكوين الأولويات وعدم احترام خوادم البريد لفحص أولوية تبادل MX.

### هل يمكنني تعطيل ألقاب معينة {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    إذا كنت على خطة مدفوعة، فيجب عليك الذهاب إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الألقاب <i class="fa fa-angle-right"></i> تعديل اللقب <i class="fa fa-angle-right"></i> إلغاء تحديد مربع "نشط" <i class="fa fa-angle-right"></i> متابعة.
  </span>
</div>

نعم، ببساطة قم بتحرير سجل <strong class="notranslate">TXT</strong> الخاص بك وأضف بادئة للقب إما بعلامة تعجب واحدة أو اثنتين أو ثلاث علامات تعجب (انظر أدناه).

لاحظ أنه *يجب* عليك الحفاظ على ":" في التعيين، حيث أن هذا مطلوب إذا قررت إيقاف هذا لاحقًا (ويُستخدم أيضًا للاستيراد إذا قمت بالترقية إلى إحدى خططنا المدفوعة).

**للرفض الصامت (يظهر للمرسل كما لو تم إرسال الرسالة بنجاح، لكنها في الواقع لا تصل إلى أي مكان) (رمز الحالة `250`):** إذا قمت بإضافة بادئة "!" (علامة تعجب واحدة) إلى اللقب، فسيتم إرجاع رمز حالة ناجح `250` للمرسلين الذين يحاولون الإرسال إلى هذا العنوان، لكن الرسائل نفسها لن تصل إلى أي مكان (مثل ثقب أسود أو `/dev/null`).

**للرفض الناعم (رمز الحالة `421`):** إذا قمت بإضافة بادئة "!!" (علامتي تعجب) إلى اللقب، فسيتم إرجاع رمز خطأ ناعم `421` للمرسلين الذين يحاولون الإرسال إلى هذا العنوان، وغالبًا ما تتم إعادة محاولة إرسال الرسائل لمدة تصل إلى 5 أيام قبل الرفض والارتداد.

**للرفض الصارم (رمز الحالة `550`):** إذا قمت بإضافة بادئة "!!!" (ثلاث علامات تعجب) إلى اللقب، فسيتم إرجاع رمز خطأ دائم `550` للمرسلين الذين يحاولون الإرسال إلى هذا العنوان، وسيتم رفض الرسائل وارتدادها.

على سبيل المثال، إذا أردت أن تتوقف جميع الرسائل التي تذهب إلى `alias@example.com` عن المرور إلى `user@gmail.com` ويتم رفضها وارتدادها (مثلاً باستخدام ثلاث علامات تعجب):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/اللقب</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
  <span>
    يمكنك أيضًا إعادة كتابة عنوان المستلم المعاد توجيهه ببساطة إلى "nobody@forwardemail.net"، والذي سيقوم بتوجيهه إلى لا أحد كما في المثال أدناه.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/اللقب</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
  <span>
    إذا كنت تريد زيادة الأمان، يمكنك أيضًا إزالة الجزء ":user@gmail.com" (أو ":nobody@forwardemail.net")، تاركًا فقط "!!!alias" كما في المثال أدناه.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### هل يمكنني إعادة توجيه الرسائل إلى عدة مستلمين {#can-i-forward-emails-to-multiple-recipients}

نعم، بالتأكيد. فقط حدد عدة مستلمين في سجلات <strong class="notranslate">TXT</strong> الخاصة بك.

على سبيل المثال، إذا أردت أن يتم إعادة توجيه رسالة تصل إلى `hello@example.com` إلى `user+a@gmail.com` و `user+b@gmail.com`، فسيكون سجل <strong class="notranslate">TXT</strong> الخاص بي كما يلي:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

أو يمكنك تحديدهم في سطرين منفصلين، مثل هذا:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

الأمر متروك لك!

### هل يمكنني وجود عدة مستلمين عامين شاملين {#can-i-have-multiple-global-catch-all-recipients}

نعم، يمكنك ذلك. فقط حدد عدة مستلمين عامين شاملين في سجلات <strong class="notranslate">TXT</strong> الخاصة بك.

على سبيل المثال، إذا أردت أن يتم إعادة توجيه كل رسالة تصل إلى `*@example.com` (النجمة تعني أنها بدل شامل أو catch-all) إلى `user+a@gmail.com` و `user+b@gmail.com`، فسيكون سجل <strong class="notranslate">TXT</strong> الخاص بي كما يلي:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

أو يمكنك تحديدهم في سطرين منفصلين، مثل هذا:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>الاسم/المضيف/الاسم المستعار</th>
      <th class="text-center">TTL</th>
      <th>النوع</th>
      <th>الإجابة/القيمة</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", أو فارغ</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
الأمر متروك لك!

### هل هناك حد أقصى لعدد عناوين البريد الإلكتروني التي يمكنني إعادة توجيهها لكل اسم مستعار {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

نعم، الحد الافتراضي هو 10. هذا لا يعني أنه يمكنك فقط أن يكون لديك 10 أسماء مستعارة على اسم النطاق الخاص بك. يمكنك أن يكون لديك عدد غير محدود من الأسماء المستعارة. يعني ذلك أنه يمكنك فقط إعادة توجيه اسم مستعار واحد إلى 10 عناوين بريد إلكتروني فريدة. يمكنك أن يكون لديك `hello:user+1@gmail.com`، `hello:user+2@gmail.com`، `hello:user+3@gmail.com`، … (من 1-10) – وأي رسائل إلى `hello@example.com` سيتم إعادة توجيهها إلى `user+1@gmail.com`، `user+2@gmail.com`، `user+3@gmail.com`، … (من 1-10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    نصيحة:
  </strong>
  <span>
    هل تحتاج إلى أكثر من 10 مستلمين لكل اسم مستعار؟ أرسل لنا بريدًا إلكترونيًا وسنكون سعداء بزيادة حد حسابك.
  </span>
</div>

### هل يمكنني إعادة توجيه الرسائل بشكل متكرر {#can-i-recursively-forward-emails}

نعم، يمكنك ذلك، ولكن يجب عليك الالتزام بالحد الأقصى. إذا كان لديك `hello:linus@example.com` و `linus:user@gmail.com`، فستتم إعادة توجيه الرسائل إلى `hello@example.com` إلى `linus@example.com` و `user@gmail.com`. لاحظ أنه سيتم إصدار خطأ إذا حاولت إعادة توجيه الرسائل بشكل متكرر يتجاوز الحد الأقصى.

### هل يمكن للناس إلغاء تسجيل أو تسجيل إعادة توجيه بريدي الإلكتروني بدون إذني {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

نستخدم التحقق من سجلات MX و <strong class="notranslate">TXT</strong>، لذلك إذا أضفت سجلات MX و <strong class="notranslate">TXT</strong> الخاصة بهذه الخدمة، فأنت مسجل. إذا أزلتها، فأنت غير مسجل. أنت تملك نطاقك وإدارة DNS، فإذا كان لدى شخص ما حق الوصول إلى ذلك فهذه مشكلة.

### كيف هو مجاني {#how-is-it-free}

يقدم Forward Email طبقة مجانية من خلال مزيج من التطوير مفتوح المصدر، والبنية التحتية الفعالة، وخطط مدفوعة اختيارية تدعم الخدمة.

تدعم طبقتنا المجانية:

1. **التطوير مفتوح المصدر**: قاعدة الشيفرة الخاصة بنا مفتوحة المصدر، مما يسمح بمساهمات المجتمع وتشغيل شفاف.

2. **البنية التحتية الفعالة**: قمنا بتحسين أنظمتنا للتعامل مع إعادة توجيه البريد الإلكتروني بأقل الموارد.

3. **خطط مدفوعة مميزة**: المستخدمون الذين يحتاجون إلى ميزات إضافية مثل إرسال SMTP، استقبال IMAP، أو خيارات خصوصية محسنة يشتركون في خططنا المدفوعة.

4. **حدود استخدام معقولة**: تحتوي الطبقة المجانية على سياسات استخدام عادلة لمنع الإساءة.

> \[!NOTE]
> نحن ملتزمون بالحفاظ على إعادة توجيه البريد الإلكتروني الأساسية مجانية مع تقديم ميزات مميزة للمستخدمين ذوي الاحتياجات المتقدمة.

> \[!TIP]
> إذا وجدت خدمتنا ذات قيمة، فكر في الترقية إلى خطة مدفوعة لدعم التطوير والصيانة المستمرة.

### ما هو الحد الأقصى لحجم البريد الإلكتروني {#what-is-the-max-email-size-limit}

الحد الافتراضي هو 50 ميجابايت، ويشمل المحتوى، والرؤوس، والمرفقات. لاحظ أن خدمات مثل Gmail و Outlook تسمح فقط بحد 25 ميجابايت، وإذا تجاوزت الحد عند الإرسال إلى عناوين في تلك الخدمات ستتلقى رسالة خطأ.

يتم إرجاع خطأ مع رمز الاستجابة المناسب إذا تم تجاوز حد حجم الملف.

### هل تخزن سجلات البريد الإلكتروني {#do-you-store-logs-of-emails}

لا، نحن لا نكتب على القرص أو نخزن سجلات – مع [استثناء الأخطاء](#do-you-store-error-logs) و [SMTP الصادر](#do-you-support-sending-email-with-smtp) (انظر [سياسة الخصوصية](/privacy)).

كل شيء يتم في الذاكرة و [شيفرتنا المصدرية على GitHub](https://github.com/forwardemail).

### هل تخزن سجلات الأخطاء {#do-you-store-error-logs}

**نعم. يمكنك الوصول إلى سجلات الأخطاء تحت [حسابي → السجلات](/my-account/logs) أو [حسابي → النطاقات](/my-account/domains).**

اعتبارًا من فبراير 2023، نخزن سجلات الأخطاء لرموز استجابة SMTP `4xx` و `5xx` لمدة 7 أيام – والتي تحتوي على خطأ SMTP، الظرف، ورؤوس البريد الإلكتروني (نحن **لا نخزن** محتوى البريد الإلكتروني ولا المرفقات).
تسمح سجلات الأخطاء لك بالتحقق من الرسائل الإلكترونية المهمة المفقودة والتقليل من الإيجابيات الكاذبة للبريد المزعج لـ [نطاقاتك](/my-account/domains). كما أنها مصدر رائع لتصحيح المشكلات مع [ويب هوكس البريد الإلكتروني](#do-you-support-webhooks) (نظرًا لأن سجلات الأخطاء تحتوي على استجابة نقطة نهاية الويب هوك).

سجلات الأخطاء الخاصة بـ [تحديد المعدل] (#do-you-have-rate-limiting) و [القائمة الرمادية] (#do-you-have-a-greylist) غير متاحة لأن الاتصال ينتهي مبكرًا (على سبيل المثال قبل أن يتم إرسال أوامر `RCPT TO` و `MAIL FROM`).

راجع [سياسة الخصوصية](/privacy) لمزيد من المعلومات.

### هل تقرأ بريدي الإلكتروني {#do-you-read-my-emails}

لا، على الإطلاق لا. راجع [سياسة الخصوصية](/privacy).

تخزن العديد من خدمات إعادة توجيه البريد الإلكتروني الأخرى رسائلك الإلكترونية وقد تقرأها. لا يوجد سبب يجعل الرسائل المعاد توجيهها تحتاج إلى التخزين على القرص – ولهذا قمنا بتصميم أول حل مفتوح المصدر يقوم بكل شيء في الذاكرة.

نعتقد أنه يجب أن يكون لديك حق الخصوصية ونحن نحترم ذلك بشدة. الكود الذي يتم نشره على الخادم هو [برنامج مفتوح المصدر على GitHub](https://github.com/forwardemail) للشفافية وبناء الثقة.

### هل يمكنني "إرسال البريد كـ" في Gmail باستخدام هذا {#can-i-send-mail-as-in-gmail-with-this}

نعم! اعتبارًا من 2 أكتوبر 2018 أضفنا هذه الميزة. راجع [كيفية إرسال البريد كـ باستخدام Gmail](#how-to-send-mail-as-using-gmail) أعلاه!

يجب عليك أيضًا تعيين سجل SPF لـ Gmail في تكوين DNS الخاص بك في سجل <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    إذا كنت تستخدم Gmail (مثل إرسال البريد كـ) أو G Suite، فستحتاج إلى إضافة <code>include:_spf.google.com</code> إلى سجل SPF <strong class="notranslate">TXT</strong> الخاص بك، على سبيل المثال:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### هل يمكنني "إرسال البريد كـ" في Outlook باستخدام هذا {#can-i-send-mail-as-in-outlook-with-this}

نعم! اعتبارًا من 2 أكتوبر 2018 أضفنا هذه الميزة. ببساطة اطلع على هذين الرابطين من Microsoft أدناه:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

يجب عليك أيضًا تعيين سجل SPF لـ Outlook في تكوين DNS الخاص بك في سجل <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    مهم:
  </strong>
  <span>
    إذا كنت تستخدم Microsoft Outlook أو Live.com، فستحتاج إلى إضافة <code>include:spf.protection.outlook.com</code> إلى سجل SPF <strong class="notranslate">TXT</strong> الخاص بك، على سبيل المثال:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### هل يمكنني "إرسال البريد كـ" في Apple Mail و iCloud Mail باستخدام هذا {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

إذا كنت مشتركًا في iCloud+، يمكنك استخدام نطاق مخصص. [خدمتنا متوافقة أيضًا مع Apple Mail](#apple-mail).

يرجى مراجعة <https://support.apple.com/en-us/102540> لمزيد من المعلومات.

### هل يمكنني إعادة توجيه عدد غير محدود من الرسائل الإلكترونية باستخدام هذا {#can-i-forward-unlimited-emails-with-this}

نعم، ومع ذلك يتم تحديد معدل المرسلين "غير المعروفين نسبيًا" إلى 100 اتصال في الساعة لكل اسم مضيف أو عنوان IP. راجع القسم الخاص بـ [تحديد المعدل](#do-you-have-rate-limiting) و [القائمة الرمادية](#do-you-have-a-greylist) أعلاه.

بـ "غير المعروفين نسبيًا"، نعني المرسلين الذين لا يظهرون في [القائمة المسموح بها](#do-you-have-an-allowlist).

إذا تم تجاوز هذا الحد، نرسل رمز استجابة 421 الذي يخبر خادم البريد الخاص بالمرسل بإعادة المحاولة لاحقًا.

### هل تقدم نطاقات غير محدودة بسعر واحد {#do-you-offer-unlimited-domains-for-one-price}

نعم. بغض النظر عن الخطة التي تستخدمها، ستدفع سعرًا شهريًا واحدًا فقط – يغطي جميع نطاقاتك.
### ما هي طرق الدفع التي تقبلونها {#which-payment-methods-do-you-accept}

يقبل Forward Email طرق الدفع التالية لمرة واحدة أو الدفع الشهري/الربع سنوي/السنوي:

1. **بطاقات الائتمان/الخصم/التحويلات البنكية**: فيزا، ماستركارد، أمريكان إكسبريس، ديسكفر، JCB، داينرز كلوب، إلخ.
2. **باي بال**: اربط حساب باي بال الخاص بك لسهولة الدفع
3. **العملات المشفرة**: نقبل المدفوعات عبر مدفوعات العملات المستقرة من Stripe على شبكات إيثيريوم، بوليجون، وسولانا

> \[!NOTE]
> نقوم بتخزين معلومات دفع محدودة على خوادمنا، والتي تشمل فقط معرفات الدفع والمرجعيات إلى معاملات [Stripe](https://stripe.com/global) و[PayPal](https://www.paypal.com) ومعرفات العملاء والاشتراكات والمدفوعات.

> \[!TIP]
> لأقصى قدر من الخصوصية، فكر في استخدام مدفوعات العملات المشفرة.

جميع المدفوعات تتم معالجتها بأمان عبر Stripe أو PayPal. لا يتم تخزين تفاصيل الدفع الخاصة بك على خوادمنا أبدًا.


## موارد إضافية {#additional-resources}

> \[!TIP]
> مقالاتنا أدناه يتم تحديثها بانتظام مع أدلة جديدة، ونصائح، ومعلومات تقنية. تحقق منها باستمرار للحصول على أحدث المحتويات.

* [دراسات حالة ووثائق المطورين](/blog/docs)
* [الموارد](/resources)
* [الأدلة](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
