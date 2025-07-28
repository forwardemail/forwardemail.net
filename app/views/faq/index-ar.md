# الأسئلة الشائعة {#frequently-asked-questions}

<img تحميل="كسول" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## جدول المحتويات {#table-of-contents}

* [البدء السريع](#quick-start)
* [مقدمة](#introduction)
  * [ما هو إعادة توجيه البريد الإلكتروني](#what-is-forward-email)
  * [من يستخدم إعادة توجيه البريد الإلكتروني؟](#who-uses-forward-email)
  * [ما هو تاريخ Forward Email؟](#what-is-forward-emails-history)
  * [ما مدى سرعة هذه الخدمة؟](#how-fast-is-this-service)
* [عملاء البريد الإلكتروني](#email-clients)
  * [طائر الرعد](#thunderbird)
  * [مايكروسوفت أوتلوك](#microsoft-outlook)
  * [بريد آبل](#apple-mail)
  * [الأجهزة المحمولة](#mobile-devices)
  * [كيفية إرسال البريد باسم باستخدام Gmail](#how-to-send-mail-as-using-gmail)
  * [ما هو الدليل المجاني القديم لإرسال البريد باسم باستخدام Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [تكوين توجيه Gmail المتقدم](#advanced-gmail-routing-configuration)
  * [تكوين التوجيه المتقدم لبرنامج Outlook](#advanced-outlook-routing-configuration)
* [استكشاف الأخطاء وإصلاحها](#troubleshooting)
  * [لماذا لا أتلقى رسائل البريد الإلكتروني الاختبارية الخاصة بي](#why-am-i-not-receiving-my-test-emails)
  * [كيف أقوم بتكوين عميل البريد الإلكتروني الخاص بي للعمل مع إعادة توجيه البريد الإلكتروني](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [لماذا تصل رسائل البريد الإلكتروني الخاصة بي إلى البريد العشوائي وكيف يمكنني التحقق من سمعة نطاقي](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [ماذا يجب أن أفعل إذا تلقيت رسائل بريد إلكتروني غير مرغوب فيها](#what-should-i-do-if-i-receive-spam-emails)
  * [لماذا تظهر رسائل البريد الإلكتروني الاختبارية المرسلة إليّ في Gmail على أنها "مشبوهة"؟](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [هل يمكنني إزالة via forwardemail dot net في Gmail؟](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [إدارة البيانات](#data-management)
  * [أين تقع خوادمك؟](#where-are-your-servers-located)
  * [كيف أقوم بتصدير صندوق بريدي والنسخ الاحتياطي له؟](#how-do-i-export-and-backup-my-mailbox)
  * [كيف يمكنني استيراد ونقل صندوق البريد الإلكتروني الحالي الخاص بي](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [هل تدعم الاستضافة الذاتية؟](#do-you-support-self-hosting)
* [تكوين البريد الإلكتروني](#email-configuration)
  * [كيف أبدأ وأقوم بإعداد إعادة توجيه البريد الإلكتروني](#how-do-i-get-started-and-set-up-email-forwarding)
  * [هل يمكنني استخدام عدة بورصات وخوادم MX لإعادة التوجيه المتقدم؟](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [كيف أقوم بإعداد المجيب التلقائي أثناء الإجازة (الرد التلقائي خارج المكتب)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [كيف أقوم بإعداد SPF لإعادة توجيه البريد الإلكتروني؟](#how-do-i-set-up-spf-for-forward-email)
  * [كيف أقوم بإعداد DKIM لإعادة توجيه البريد الإلكتروني](#how-do-i-set-up-dkim-for-forward-email)
  * [كيف أقوم بإعداد DMARC لإعادة توجيه البريد الإلكتروني](#how-do-i-set-up-dmarc-for-forward-email)
  * [كيف أقوم بتوصيل جهات الاتصال الخاصة بي وتكوينها](#how-do-i-connect-and-configure-my-contacts)
  * [كيف أقوم بتوصيل وتكوين تقويماتي؟](#how-do-i-connect-and-configure-my-calendars)
  * [كيف يمكنني إضافة المزيد من التقويمات وإدارة التقويمات الموجودة](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [كيف أقوم بإعداد SRS لإعادة توجيه البريد الإلكتروني](#how-do-i-set-up-srs-for-forward-email)
  * [كيف أقوم بإعداد MTA-STS لإعادة توجيه البريد الإلكتروني؟](#how-do-i-set-up-mta-sts-for-forward-email)
  * [كيف أضيف صورة شخصية إلى عنوان بريدي الإلكتروني](#how-do-i-add-a-profile-picture-to-my-email-address)
* [الميزات المتقدمة](#advanced-features)
  * [هل تدعم النشرات الإخبارية أو قوائم البريد الإلكتروني للتسويق؟](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [هل تدعم إرسال البريد الإلكتروني باستخدام واجهة برمجة التطبيقات (API)](#do-you-support-sending-email-with-api)
  * [هل تدعم تلقي البريد الإلكتروني باستخدام IMAP؟](#do-you-support-receiving-email-with-imap)
  * [هل تدعم POP3](#do-you-support-pop3)
  * [هل تدعم التقويمات (CalDAV)](#do-you-support-calendars-caldav)
  * [هل تدعم جهات الاتصال (CardDAV)](#do-you-support-contacts-carddav)
  * [هل تدعم إرسال البريد الإلكتروني باستخدام SMTP؟](#do-you-support-sending-email-with-smtp)
  * [هل تدعم OpenPGP/MIME والتشفير من البداية إلى النهاية ("E2EE") ودليل مفتاح الويب ("WKD")؟](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [هل تدعم MTA-STS؟](#do-you-support-mta-sts)
  * [هل تدعم مفاتيح المرور وWebAuthn؟](#do-you-support-passkeys-and-webauthn)
  * [هل تدعم أفضل ممارسات البريد الإلكتروني؟](#do-you-support-email-best-practices)
  * [هل تدعم خطافات الويب المرتدة؟](#do-you-support-bounce-webhooks)
  * [هل تدعمون خطافات الويب؟](#do-you-support-webhooks)
  * [هل تدعم التعبيرات العادية أو التعبيرات العادية؟](#do-you-support-regular-expressions-or-regex)
  * [ما هي حدود SMTP الصادرة لديك؟](#what-are-your-outbound-smtp-limits)
  * [هل أحتاج إلى موافقة لتمكين SMTP؟](#do-i-need-approval-to-enable-smtp)
  * [ما هي إعدادات تكوين خادم SMTP الخاص بك](#what-are-your-smtp-server-configuration-settings)
  * [ما هي إعدادات تكوين خادم IMAP الخاص بك](#what-are-your-imap-server-configuration-settings)
  * [ما هي إعدادات تكوين خادم POP3 الخاص بك](#what-are-your-pop3-server-configuration-settings)
  * [تكوين Postfix SMTP Relay](#postfix-smtp-relay-configuration)
* [حماية](#security)
  * [تقنيات تقوية الخادم المتقدمة](#advanced-server-hardening-techniques)
  * [هل لديك شهادة SOC 2 أو ISO 27001؟](#do-you-have-soc-2-or-iso-27001-certifications)
  * [هل تستخدم تشفير TLS لإعادة توجيه البريد الإلكتروني؟](#do-you-use-tls-encryption-for-email-forwarding)
  * [هل تحافظ على رؤوس مصادقة البريد الإلكتروني؟](#do-you-preserve-email-authentication-headers)
  * [هل تحافظ على عناوين البريد الإلكتروني الأصلية وتمنع التزييف؟](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [كيف تحمي نفسك من البريد العشوائي والإساءة؟](#how-do-you-protect-against-spam-and-abuse)
  * [هل تقوم بتخزين محتوى البريد الإلكتروني على القرص؟](#do-you-store-email-content-on-disk)
  * [هل يمكن الكشف عن محتوى البريد الإلكتروني أثناء تعطل النظام؟](#can-email-content-be-exposed-during-system-crashes)
  * [من لديه حق الوصول إلى البنية التحتية لبريدك الإلكتروني؟](#who-has-access-to-your-email-infrastructure)
  * [ما هي مقدمي البنية التحتية التي تستخدمها](#what-infrastructure-providers-do-you-use)
  * [هل تقدم اتفاقية معالجة البيانات (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [كيفية التعامل مع إشعارات خرق البيانات](#how-do-you-handle-data-breach-notifications)
  * [هل تقدم بيئة اختبار؟](#do-you-offer-a-test-environment)
  * [هل توفر أدوات المراقبة والتنبيه؟](#do-you-provide-monitoring-and-alerting-tools)
  * [كيف تضمن توفرًا عاليًا؟](#how-do-you-ensure-high-availability)
  * [هل أنت متوافق مع المادة 889 من قانون تفويض الدفاع الوطني (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [تفاصيل النظام والتقنية](#system-and-technical-details)
  * [هل تقوم بتخزين رسائل البريد الإلكتروني ومحتوياتها؟](#do-you-store-emails-and-their-contents)
  * [كيف يعمل نظام إعادة توجيه البريد الإلكتروني الخاص بك](#how-does-your-email-forwarding-system-work)
  * [كيفية معالجة البريد الإلكتروني لإعادة التوجيه](#how-do-you-process-an-email-for-forwarding)
  * [كيف تتعامل مع مشكلات تسليم البريد الإلكتروني](#how-do-you-handle-email-delivery-issues)
  * [كيف تتعامل مع حظر عناوين IP الخاصة بك؟](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [ما هي عناوين مدير البريد؟](#what-are-postmaster-addresses)
  * [ما هي عناوين عدم الرد](#what-are-no-reply-addresses)
  * [ما هي عناوين IP الخاصة بخادمك؟](#what-are-your-servers-ip-addresses)
  * [هل لديك قائمة مسموح بها؟](#do-you-have-an-allowlist)
  * [ما هي امتدادات أسماء النطاق المسموح بها افتراضيًا](#what-domain-name-extensions-are-allowlisted-by-default)
  * [ما هي معايير القائمة المسموح بها لديك؟](#what-is-your-allowlist-criteria)
  * [ما هي امتدادات أسماء النطاقات التي يمكن استخدامها مجانًا](#what-domain-name-extensions-can-be-used-for-free)
  * [هل لديك قائمة رمادية؟](#do-you-have-a-greylist)
  * [هل لديك قائمة الرفض؟](#do-you-have-a-denylist)
  * [هل لديك معدل الحد؟](#do-you-have-rate-limiting)
  * [كيف تحمي نفسك من التشتت الخلفي؟](#how-do-you-protect-against-backscatter)
  * [منع ارتدادات البريد من مرسلي البريد العشوائي المعروفين](#prevent-bounces-from-known-mail-from-spammers)
  * [منع الارتدادات غير الضرورية للحماية من التشتت الخلفي](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [كيف تحدد بصمة البريد الإلكتروني](#how-do-you-determine-an-email-fingerprint)
  * [هل يمكنني إعادة توجيه رسائل البريد الإلكتروني إلى منافذ أخرى غير المنفذ 25 (على سبيل المثال إذا قام مزود خدمة الإنترنت الخاص بي بحظر المنفذ 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [هل يدعم رمز ++ للأسماء المستعارة في Gmail؟](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [هل يدعم النطاقات الفرعية](#does-it-support-sub-domains)
  * [هل يؤدي هذا إلى إعادة توجيه عناوين بريدي الإلكتروني؟](#does-this-forward-my-emails-headers)
  * [هل تم اختبار هذا جيدا؟](#is-this-well-tested)
  * [هل تقوم بتمرير رسائل ورموز الاستجابة SMTP؟](#do-you-pass-along-smtp-response-messages-and-codes)
  * [كيف تمنع مرسلي البريد العشوائي وتضمن سمعة جيدة في إعادة توجيه البريد الإلكتروني](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [كيف تقوم بإجراء عمليات بحث DNS على أسماء النطاقات](#how-do-you-perform-dns-lookups-on-domain-names)
* [الحساب والفواتير](#account-and-billing)
  * [هل تقدم ضمان استرداد الأموال على الخطط المدفوعة؟](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [إذا قمت بتغيير الخطط، هل تقومون بتقسيم المبلغ واسترداد الفرق؟](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [هل يمكنني استخدام خدمة إعادة توجيه البريد الإلكتروني هذه كخادم MX "احتياطي" أو "متوقف"؟](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [هل يمكنني تعطيل أسماء مستعارة معينة؟](#can-i-disable-specific-aliases)
  * [هل يمكنني إعادة توجيه رسائل البريد الإلكتروني إلى عدة مستلمين؟](#can-i-forward-emails-to-multiple-recipients)
  * [هل يمكنني الحصول على عدة مستلمين عالميين](#can-i-have-multiple-global-catch-all-recipients)
  * [هل يوجد حد أقصى لعدد عناوين البريد الإلكتروني التي يمكنني إعادة توجيهها لكل اسم مستعار؟](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [هل يمكنني إعادة توجيه رسائل البريد الإلكتروني بشكل متكرر؟](#can-i-recursively-forward-emails)
  * [هل يمكن للأشخاص إلغاء التسجيل أو تسجيل إعادة توجيه بريدي الإلكتروني دون إذني؟](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [كيف هو مجاني](#how-is-it-free)
  * [ما هو الحد الأقصى لحجم البريد الإلكتروني؟](#what-is-the-max-email-size-limit)
  * [هل تقوم بتخزين سجلات رسائل البريد الإلكتروني؟](#do-you-store-logs-of-emails)
  * [هل تقوم بتخزين سجلات الأخطاء؟](#do-you-store-error-logs)
  * [هل تقرأ رسائلي الإلكترونية؟](#do-you-read-my-emails)
  * [هل يمكنني "إرسال البريد باسم" في Gmail باستخدام هذا؟](#can-i-send-mail-as-in-gmail-with-this)
  * [هل يمكنني "إرسال البريد باسم" في Outlook باستخدام هذا؟](#can-i-send-mail-as-in-outlook-with-this)
  * [هل يمكنني "إرسال البريد باسم" في Apple Mail و iCloud Mail باستخدام هذا؟](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [هل يمكنني إعادة توجيه عدد غير محدود من رسائل البريد الإلكتروني باستخدام هذا؟](#can-i-forward-unlimited-emails-with-this)
  * [هل تقدمون نطاقات غير محدودة بسعر واحد؟](#do-you-offer-unlimited-domains-for-one-price)
  * [ما هي طرق الدفع التي تقبلونها؟](#which-payment-methods-do-you-accept)
* [موارد إضافية](#additional-resources)

## بدء التشغيل السريع {#quick-start}

للبدء في إعادة توجيه البريد الإلكتروني:

1. **إنشاء حساب** على [forwardemail.net/register](https://forwardemail.net/register)

2. **أضف نطاقك وتحقق منه** تحت [حسابي → النطاقات](/my-account/domains)

3. **إضافة وتكوين أسماء مستعارة/صناديق بريد إلكتروني** ضمن [حسابي → النطاقات](/my-account/domains) → أسماء مستعارة

4. **اختبر إعداداتك** عن طريق إرسال بريد إلكتروني إلى أحد الأسماء المستعارة الجديدة لديك

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

## مقدمة {#introduction}

### ما هو البريد الإلكتروني المعاد توجيهه {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email هو **موفر خدمة بريد إلكتروني متكامل الميزات** و**موفر استضافة البريد الإلكتروني لأسماء النطاق المخصصة**.

إنها الخدمة الوحيدة المجانية والمفتوحة المصدر، وتتيح لك استخدام عناوين البريد الإلكتروني للمجال المخصص دون تعقيد إعداد وصيانة خادم البريد الإلكتروني الخاص بك.

تعمل خدمتنا على إعادة توجيه رسائل البريد الإلكتروني المرسلة إلى المجال المخصص الخاص بك إلى حساب البريد الإلكتروني الحالي لديك - ويمكنك حتى استخدامنا كمزود استضافة بريد إلكتروني مخصص لك.

الميزات الرئيسية لخدمة إعادة توجيه البريد الإلكتروني:

* **بريد إلكتروني بنطاق مخصص**: استخدم عناوين بريد إلكتروني احترافية مع اسم نطاقك الخاص.
* **المستوى المجاني**: إعادة توجيه أساسية للبريد الإلكتروني مجانًا.
* **خصوصية مُحسّنة**: لا نقرأ رسائلك الإلكترونية ولا نبيع بياناتك.
* **مفتوح المصدر**: قاعدة بياناتنا البرمجية كاملةً متاحة على GitHub.
* **دعم SMTP وIMAP وPOP3**: إمكانيات إرسال واستقبال بريد إلكتروني كاملة.
* **التشفير الشامل**: دعم OpenPGP/MIME.
* **أسماء مستعارة مخصصة**: أنشئ أسماء مستعارة غير محدودة للبريد الإلكتروني.

يمكنك مقارنتنا بأكثر من 56 مزود خدمة بريد إلكتروني آخر على [صفحة مقارنة البريد الإلكتروني لدينا](/blog/best-email-service).

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### من يستخدم إعادة توجيه البريد الإلكتروني {#who-uses-forward-email}

نحن نقدم خدمة استضافة البريد الإلكتروني وإعادة توجيه البريد الإلكتروني لأكثر من 500000 نطاق وهؤلاء المستخدمين البارزين:

| عميل | دراسة الحالة |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| الأكاديمية البحرية الأمريكية | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| قانوني | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| ألعاب نتفليكس |  |
| مؤسسة لينكس | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| مؤسسة PHP |  |
| إذاعة فوكس نيوز |  |
| مبيعات إعلانات ديزني |  |
| جيكويري | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| أوبونتو | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| حر | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| لوبنتو | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| جامعة كامبريدج | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| جامعة ماريلاند | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| جامعة واشنطن | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| جامعة تافتس | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| كلية سوارثمور | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| حكومة جنوب أستراليا |  |
| حكومة جمهورية الدومينيكان |  |
| ذبابة<span>.</span>io |  |
| فنادق RCD |  |
| إسحاق ز. شلويتر (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| ديفيد هاينماير هانسون (روبي أون ريلز) |  |

### ما هو تاريخ إعادة توجيه البريد الإلكتروني {#what-is-forward-emails-history}

يمكنك معرفة المزيد عن إعادة توجيه البريد الإلكتروني على [صفحتنا حول](/about).

### ما مدى سرعة هذه الخدمة؟ {#how-fast-is-this-service}

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

توفر خدمة Forward Email إمكانية تسليم الرسائل بأقل قدر من التأخير، عادةً في غضون ثوانٍ من استلامها.

مقاييس الأداء:

* **متوسط وقت التسليم**: أقل من ٥-١٠ ثوانٍ من الاستلام إلى إعادة التوجيه ([راجع صفحة مراقبة وقت الوصول إلى البريد الوارد "TTI"](/tti))
* **مدة التشغيل**: توافر الخدمة بنسبة تزيد عن ٩٩.٩٪
* **البنية التحتية العالمية**: خوادم موزعة بشكل استراتيجي لضمان التوجيه الأمثل
* **التوسع التلقائي**: نظامنا يتوسع خلال فترات ذروة استخدام البريد الإلكتروني

نحن نعمل في الوقت الحقيقي، على عكس مقدمي الخدمات الآخرين الذين يعتمدون على طوابير الانتظار المتأخرة.

نحن لا نكتب على القرص أو نخزن السجلات - باستخدام [استثناء الأخطاء](#do-you-store-error-logs) و [SMTP الصادر](#do-you-support-sending-email-with-smtp) (راجع [سياسة الخصوصية](/privacy)).

يتم تنفيذ كل شيء في الذاكرة و[كود المصدر الخاص بنا موجود على GitHub](https://github.com/forwardemail).

## عملاء البريد الإلكتروني {#email-clients}

### ثندربيرد {#thunderbird}

١. أنشئ اسمًا مستعارًا جديدًا وأنشئ كلمة مرور في لوحة تحكم إعادة توجيه البريد الإلكتروني.
٢. افتح Thunderbird وانتقل إلى **تعديل ← إعدادات الحساب ← إجراءات الحساب ← إضافة حساب بريد إلكتروني**.
٣. أدخل اسمك، وعنوان إعادة توجيه البريد الإلكتروني، وكلمة المرور.
٤. انقر على **التهيئة يدويًا** وأدخل:

* البريد الوارد: IMAP، `imap.forwardemail.net`، المنفذ ٩٩٣، SSL/TLS.
* البريد الصادر: SMTP، `smtp.forwardemail.net`، المنفذ ٥٨٧، STARTTLS.
٥. انقر على **تم**.

### مايكروسوفت أوتلوك {#microsoft-outlook}

١. أنشئ اسمًا مستعارًا جديدًا وأنشئ كلمة مرور في لوحة معلومات إعادة توجيه البريد الإلكتروني.
٢. انتقل إلى **ملف ← إضافة حساب**.
٣. أدخل عنوان بريدك الإلكتروني لإعادة توجيه البريد الإلكتروني، ثم انقر على **اتصال**.
٤. اختر **خيارات متقدمة**، ثم حدد **إعداد حسابي يدويًا**.
٥. حدد **IMAP** وأدخل:

* البريد الوارد: `imap.forwardemail.net`، المنفذ ٩٩٣، SSL.
* البريد الصادر: `smtp.forwardemail.net`، المنفذ ٥٨٧، TLS.
* اسم المستخدم: عنوان بريدك الإلكتروني الكامل.
* كلمة المرور: كلمة المرور المُنشأة.
٦. انقر على **اتصال**.

### بريد Apple {#apple-mail}

١. أنشئ اسمًا مستعارًا جديدًا وأنشئ كلمة مرور في لوحة معلومات إعادة توجيه البريد الإلكتروني.
٢. انتقل إلى **البريد الإلكتروني ← التفضيلات ← الحسابات ← +**
٣. اختر **حساب بريد آخر**
٤. أدخل اسمك، وعنوان إعادة توجيه البريد الإلكتروني، وكلمة المرور.
٥. لإعدادات الخادم، أدخل:

* الوارد: `imap.forwardemail.net`
* الصادر: `smtp.forwardemail.net`
* اسم المستخدم: عنوان بريدك الإلكتروني الكامل
* كلمة المرور: كلمة المرور المُنشأة.
٦. انقر على **تسجيل الدخول**

### الأجهزة المحمولة {#mobile-devices}

بالنسبة لنظام iOS:

١. انتقل إلى **الإعدادات ← البريد ← الحسابات ← إضافة حساب ← أخرى**
٢. انقر على **إضافة حساب بريد** وأدخل بياناتك.
٣. لإعدادات الخادم، استخدم نفس إعدادات IMAP وSMTP المذكورة أعلاه.

للاندرويد:

١. انتقل إلى **الإعدادات ← الحسابات ← إضافة حساب ← شخصي (IMAP)**
٢. أدخل عنوان بريدك الإلكتروني وكلمة المرور لإعادة التوجيه.
٣. لإعدادات الخادم، استخدم نفس إعدادات IMAP وSMTP المذكورة أعلاه.

### كيفية إرسال البريد باسم باستخدام Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">الوقت المُقدّر للإعداد:</strong>
<span>أقل من ١٠ دقائق</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
البدء:
</strong>
<span>
إذا اتبعت التعليمات المذكورة أعلاه في قسم <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">كيفية البدء وإعداد إعادة توجيه البريد الإلكتروني</a>، يمكنك متابعة القراءة أدناه.
</span>
</div>

<div id="إرسال البريد الإلكتروني كمحتوى">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
يرجى التأكد من قراءة <a href="/terms" class="alert-link" target="_blank">الشروط</a>، و<a href="/privacy" class="alert-link" target="_blank">سياسة الخصوصية</a>، و<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">حدود SMTP الصادرة</a>، ويُعتبر استخدامك إقرارًا وموافقة.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
إذا كنت مطورًا، يُرجى مراجعة <a class="alert-link" href="/email-api#outbound-emails" target="_blank">وثائق واجهة برمجة تطبيقات البريد الإلكتروني</a>.
</span>
</div>

1. انتقل إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> تكوين SMTP الصادر واتبع تعليمات الإعداد

2. أنشئ اسمًا مستعارًا جديدًا لنطاقك ضمن <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثل <code><hello@example.com></code>)

٣. انقر على <strong class="text-success"><i class="fa fa-key"></i>إنشاء كلمة مرور</strong> بجوار الاسم المستعار الذي تم إنشاؤه حديثًا. انسخ كلمة المرور المُنشأة إلى الحافظة، ثم احفظها بأمان.

4. انتقل إلى [جيميل](https://gmail.com) وتحت [الإعدادات <i class="fa fa-angle-right"></i> الحسابات والاستيراد <i class="fa fa-angle-right"></i> إرسال البريد باسم](https://mail.google.com/mail/u/0/#settings/accounts)، انقر فوق "إضافة عنوان بريد إلكتروني آخر"

5. عند مطالبتك بـ "الاسم"، أدخل الاسم الذي تريد أن يظهر بريدك الإلكتروني عليه باعتباره "من" (على سبيل المثال "Linus Torvalds").

٦. عند طلب "عنوان البريد الإلكتروني"، أدخل عنوان البريد الإلكتروني الكامل للاسم المستعار الذي أنشأته ضمن <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثل <code><hello@example.com></code>)

7. قم بإلغاء تحديد "المعاملة كاسم مستعار"

8. انقر فوق "الخطوة التالية" للمتابعة

9. عند مطالبتك بـ "خادم SMTP"، أدخل <code>smtp.forwardemail.net</code> واترك المنفذ كما هو <code>587</code>

١٠. عند طلب "اسم المستخدم"، أدخل عنوان البريد الإلكتروني الكامل للاسم المستعار الذي أنشأته ضمن <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثل <code><hello@example.com></code>)

11. عند مطالبتك بـ "كلمة المرور"، الصق كلمة المرور من <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> في الخطوة 3 أعلاه

12. اترك زر الاختيار محددًا لـ "اتصال آمن باستخدام TLS"

13. انقر فوق "إضافة حساب" للمتابعة

14. افتح علامة تبويب جديدة في [جيميل](https://gmail.com) وانتظر وصول رسالة التحقق عبر البريد الإلكتروني (ستتلقى رمز تحقق يؤكد ملكيتك لعنوان البريد الإلكتروني الذي تحاول "إرساله كـ")

15. بمجرد وصوله، انسخ ولصق رمز التحقق عند المطالبة التي تلقيتها في الخطوة السابقة

١٦. بعد الانتهاء، ارجع إلى البريد الإلكتروني وانقر على رابط "تأكيد الطلب". ستحتاج على الأرجح إلى تنفيذ هذه الخطوة والخطوة السابقة لضبط البريد الإلكتروني بشكل صحيح.

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

### ما هو الدليل المجاني القديم لإرسال البريد باسم باستخدام Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">هام:</strong> هذا الدليل المجاني القديم غير صالح للاستخدام اعتبارًا من مايو ٢٠٢٣، حيث يدعم <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we الآن بروتوكول SMTP الصادر</a>. إذا استخدمت الدليل أدناه، فسيؤدي استخدام <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this إلى ظهور رسالة بريدك الإلكتروني الصادرة</a> "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" في Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">الوقت المُقدّر للإعداد:</strong>
<span>أقل من ١٠ دقائق</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
البدء:
</strong>
<span>
إذا اتبعت التعليمات المذكورة أعلاه في قسم <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">كيفية البدء وإعداد إعادة توجيه البريد الإلكتروني</a>، يمكنك متابعة القراءة أدناه.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="كيفية إرسال بريد إلكتروني باستخدام Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

١. يجب تفعيل [المصادقة الثنائية في Gmail][gmail-2fa] لتعمل هذه الميزة. تفضل بزيارة <https://www.google.com/landing/2step/> إذا لم تكن مفعلة لديك.

2. بمجرد تمكين المصادقة الثنائية (أو إذا كنت قد قمت بتمكينها بالفعل)، قم بزيارة <https://myaccount.google.com/apppasswords>.

٣. عند طلب "تحديد التطبيق والجهاز الذي تريد إنشاء كلمة مرور له":
* اختر "البريد" من القائمة المنسدلة "تحديد تطبيق".
* اختر "أخرى" من القائمة المنسدلة "تحديد جهاز".
* عند طلب إدخال نص، أدخل عنوان البريد الإلكتروني لنطاقك المخصص الذي تُعيد توجيه الرسائل منه (مثال: <code><hello@example.com></code> - سيساعدك هذا على تتبع الرسائل في حال استخدامك لهذه الخدمة لحسابات متعددة).

٤. انسخ كلمة المرور المُولّدة تلقائيًا إلى الحافظة.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
إذا كنت تستخدم G Suite، فتفضل بزيارة لوحة الإدارة <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">التطبيقات <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> إعدادات Gmail <i class="fa fa-angle-right"></i> الإعدادات</a> وتأكد من تحديد "السماح للمستخدمين بإرسال البريد عبر خادم SMTP خارجي...". قد يستغرق تفعيل هذا التغيير بعض الوقت، لذا يُرجى الانتظار لبضع دقائق.
</span>
</div>

5. انتقل إلى [جيميل](https://gmail.com) وتحت [الإعدادات <i class="fa fa-angle-right"></i> الحسابات والاستيراد <i class="fa fa-angle-right"></i> إرسال البريد باسم](https://mail.google.com/mail/u/0/#settings/accounts)، انقر فوق "إضافة عنوان بريد إلكتروني آخر"

6. عند مطالبتك بـ "الاسم"، أدخل الاسم الذي تريد أن يظهر بريدك الإلكتروني عليه كـ "من" (على سبيل المثال "لينوس تورفالدس")

7. عند مطالبتك بـ "عنوان البريد الإلكتروني"، أدخل عنوان البريد الإلكتروني مع النطاق المخصص الذي استخدمته أعلاه (على سبيل المثال <code><hello@example.com></code>)

8. قم بإلغاء تحديد "المعاملة كاسم مستعار"

9. انقر فوق "الخطوة التالية" للمتابعة

١٠. عند طلب "خادم SMTP"، أدخل <code>smtp.gmail.com</code> واترك المنفذ كما هو <code>587</code>

١١. عند طلب "اسم المستخدم"، أدخل جزء عنوان Gmail الخاص بك بدون <span>gmail.com</span> (على سبيل المثال، أدخل "المستخدم" فقط إذا كان بريدي الإلكتروني هو <span><user@gmail.com></span>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">

هام:
</strong>
<span>
إذا كان جزء "اسم المستخدم" يُملأ تلقائيًا، فسيتعين عليك تغييره إلى جزء اسم المستخدم في عنوان Gmail الخاص بك.
</span>
</div>

12. عند مطالبتك بإدخال "كلمة المرور"، الصق كلمة المرور التي أنشأتها في الخطوة 2 أعلاه من الحافظة.

13. اترك زر الاختيار محددًا لـ "اتصال آمن باستخدام TLS"

14. انقر فوق "إضافة حساب" للمتابعة

15. افتح علامة تبويب جديدة في [جيميل](https://gmail.com) وانتظر وصول رسالة التحقق عبر البريد الإلكتروني (ستتلقى رمز تحقق يؤكد ملكيتك لعنوان البريد الإلكتروني الذي تحاول "إرساله كـ")

16. بمجرد وصوله، انسخ ولصق رمز التحقق عند المطالبة التي تلقيتها في الخطوة السابقة

١٧. بعد الانتهاء، ارجع إلى البريد الإلكتروني وانقر على رابط "تأكيد الطلب". ستحتاج على الأرجح إلى تنفيذ هذه الخطوة والخطوة السابقة لضبط البريد الإلكتروني بشكل صحيح.

</div>

### تكوين توجيه Gmail المتقدم {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">الوقت المُقدّر للإعداد:</strong>
<span>15-30 دقيقة</span>
</div>

إذا كنت تريد إعداد التوجيه المتقدم في Gmail بحيث يتم إعادة توجيه الأسماء المستعارة التي لا تتطابق مع صندوق البريد إلى تبادلات البريد الإلكتروني في Forward Email، فاتبع الخطوات التالية:

١. سجّل الدخول إلى وحدة تحكم مشرف جوجل على الرابط [admin.google.com](https://admin.google.com)
٢. انتقل إلى **التطبيقات ← Google Workspace ← Gmail ← التوجيه**
٣. انقر على **إضافة مسار** واضبط الإعدادات التالية:

**إعدادات المستلم الفردي:**

* اختر "تغيير مستلم الظرف" وأدخل عنوان Gmail الرئيسي.
* فعّل خيار "إضافة رأس X-Gm-Original-To مع المستلم الأصلي".

**أنماط مستلمي المظاريف:**

* أضف نمطًا يتطابق مع جميع صناديق البريد غير الموجودة (على سبيل المثال، `.*@yourdomain.com`)

**إعدادات خادم البريد الإلكتروني:**

* حدد "توجيه إلى المضيف" وأدخل `mx1.forwardemail.net` كخادم أساسي.
* أضف `mx2.forwardemail.net` كخادم احتياطي.
* اضبط المنفذ على 25.
* حدد "يتطلب TLS" للأمان.

4. انقر فوق **حفظ** لإنشاء المسار

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
يعمل هذا الإعداد فقط مع حسابات Google Workspace ذات النطاقات المخصصة، وليس مع حسابات Gmail العادية.
</span>
</div>

### تكوين توجيه Outlook المتقدم {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">الوقت المُقدّر للإعداد:</strong>
<span>15-30 دقيقة</span>
</div>

بالنسبة لمستخدمي Microsoft 365 (المعروف سابقًا باسم Office 365) الذين يرغبون في إعداد التوجيه المتقدم بحيث يتم إعادة توجيه الأسماء المستعارة التي لا تتطابق مع صندوق البريد إلى تبادلات البريد الإلكتروني الخاصة بـ Forward Email:

١. سجّل الدخول إلى مركز إدارة Microsoft 365 على الرابط [admin.microsoft.com](https://admin.microsoft.com)
٢. انتقل إلى **Exchange ← تدفق البريد ← القواعد**
٣. انقر على **إضافة قاعدة** وحدد **إنشاء قاعدة جديدة**
٤. سمِّ القاعدة (مثلًا، "إعادة توجيه صناديق البريد غير الموجودة إلى إعادة توجيه البريد الإلكتروني")
٥. ضمن **تطبيق هذه القاعدة إذا**، حدد:
* "عنوان المستلم يطابق..."
* أدخل نمطًا يطابق جميع العناوين في نطاقك (مثلًا، `*@yourdomain.com`)
٦. ضمن **قم بما يلي**، حدد:
* "إعادة توجيه الرسالة إلى..."
* اختر "خادم البريد التالي"
* أدخل `mx1.forwardemail.net` والمنفذ ٢٥
* أضف `mx2.forwardemail.net` كخادم احتياطي
٧. ضمن **إلا إذا**، حدد:
* "المستلم هو..."
* أضف جميع صناديق البريد الحالية التي لا ينبغي إعادة توجيهها

8. عيّن أولوية القاعدة لضمان تشغيلها بعد قواعد تدفق البريد الأخرى

9. انقر على **حفظ** لتفعيل القاعدة

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

### لماذا لا أتلقى رسائل البريد الإلكتروني الاختبارية الخاصة بي {#why-am-i-not-receiving-my-test-emails}

إذا كنت ترسل رسالة بريد إلكتروني اختبارية إلى نفسك، فقد لا تظهر في صندوق الوارد لديك لأنها تحتوي على نفس عنوان "معرف الرسالة".

هذه مشكلة معروفة على نطاق واسع، وتؤثر أيضًا على خدمات مثل Gmail. <a href="https://support.google.com/a/answer/1703601">Here هو إجابة Gmail الرسمية بخصوص هذه المشكلة</a>.

إذا استمرت المشاكل، فمن المرجح أن المشكلة تتعلق بانتشار DNS. ستحتاج إلى الانتظار قليلًا والمحاولة مرة أخرى (أو حاول ضبط قيمة TTL أقل لسجلات <strong class="notranslate">TXT</strong>).

**هل لا تزال تواجه مشكلات؟** يرجى <a href="/help">الاتصال بنا</a> حتى نتمكن من مساعدتك في التحقيق في المشكلة وإيجاد حل سريع.

### كيف أقوم بتكوين عميل البريد الإلكتروني الخاص بي للعمل مع إعادة توجيه البريد الإلكتروني {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
تعمل خدمتنا مع برامج البريد الإلكتروني الشائعة مثل:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> أندرويد&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> لينكس&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> سطح المكتب</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light نص داكن"><i class="fab fa-firefox-browser"></i> موزيلا فايرفوكس&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">سفاري&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> جوجل كروم&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light نص داكن"><i class="fas fa-terminal"></i> طرفية</a></li>
</ul>
</div>

<div class="alert alert-primary">

اسم المستخدم هو عنوان البريد الإلكتروني لاسمك المستعار، وكلمة المرور من <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> ("كلمة مرور عادية").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
<span>إذا كنت تستخدم Thunderbird، فتأكد من ضبط "أمان الاتصال" على "SSL/TLS" وضبط طريقة المصادقة على "كلمة مرور عادية".</span>
</div>

| يكتب | اسم المضيف | بروتوكول | الموانئ |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **المفضل** | `993` و `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **المفضل** أو TLS (STARTTLS) | `465` و`2465` لـ SSL/TLS (أو) `587` و`2587` و`2525` و`25` لـ TLS (STARTTLS) |

### لماذا تصل رسائل البريد الإلكتروني الخاصة بي إلى البريد العشوائي والغير مرغوب فيه وكيف يمكنني التحقق من سمعة نطاقي {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

يرشدك هذا القسم إلى ما إذا كان بريدك الصادر يستخدم خوادم SMTP الخاصة بنا (على سبيل المثال `smtp.forwardemail.net`) (أو يتم إعادة توجيهه عبر `mx1.forwardemail.net` أو `mx2.forwardemail.net`) ويتم تسليمه إلى مجلد البريد العشوائي أو غير المرغوب فيه لدى المستلمين.

نحن نقوم بشكل روتيني بمراقبة [عناوين IP](#what-are-your-servers-ip-addresses) مقابل [جميع قوائم الرفض الخاصة بـ DNS ذات السمعة الطيبة](#how-do-you-handle-your-ip-addresses-becoming-blocked)، **لذلك فمن المرجح أن تكون المشكلة متعلقة بسمعة المجال**.

يمكن أن تصل رسائل البريد الإلكتروني إلى مجلدات البريد العشوائي لعدة أسباب:

1. **المصادقة المفقودة**: قم بإعداد سجلات [SPF](#how-do-i-set-up-spf-for-forward-email)، و[DKIM](#how-do-i-set-up-dkim-for-forward-email)، و[DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **سمعة المجال**: غالبًا ما تتمتع المجالات الجديدة بسمعة محايدة حتى يتم إنشاء سجل إرسال.

3. **محفزات المحتوى**: يمكن لبعض الكلمات أو العبارات أن تؤدي إلى تشغيل مرشحات البريد العشوائي.

4. **أنماط الإرسال**: قد تبدو الزيادة المفاجئة في حجم رسائل البريد الإلكتروني مثيرة للريبة.

يمكنك محاولة استخدام واحدة أو أكثر من هذه الأدوات للتحقق من سمعة مجال عملك وتصنيفه:

| اسم الأداة | URL | يكتب |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| تعليقات حول تصنيف نطاق Cloudflare | <https://radar.cloudflare.com/domains/feedback> | التصنيف |
| أداة Spamhaus للتحقق من سمعة IP والنطاق | <https://check.spamhaus.org/> | DNSBL |
| مركز Cisco Talos لسمعة IP والنطاق | <https://talosintelligence.com/reputation_center> | سمعة |
| البحث عن سمعة IP والنطاق لـ Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| التحقق من القائمة السوداء لـ MX Toolbox | <https://mxtoolbox.com/blacklists.aspx> | القائمة السوداء |
| أدوات مدير البريد من Google | <https://www.gmail.com/postmaster/> | سمعة |
| مركز مرسل ياهو | <https://senders.yahooinc.com/> | سمعة |
| التحقق من القائمة السوداء لـ MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| درجة المرسل | <https://senderscore.org/act/blocklist-remover/> | سمعة |
| عدم التقييم | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| إزالة IP الخاص بـ Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | إزالة |
| إزالة IP الخاص بـ Cloudmark | <https://csi.cloudmark.com/ar/reset/> | إزالة |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| إزالة IP الخاص بـ Microsoft Outlook وOffice 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | إزالة |
| مستويات 1 و2 و3 من UCEPROTECT | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| موقع backscatterer.org التابع لـ UCEPROTECT | <https://www.backscatterer.org/> | حماية التشتت الخلفي |
| موقع UCEPROTECT's whitelisted.org | <https://www.whitelisted.org/> (يتطلب رسومًا) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | إزالة |
| AOL/Verizon (على سبيل المثال `[IPTS04]`) | <https://senders.yahooinc.com/> | إزالة |
| شركة كوكس للاتصالات | `unblock.request@cox.net` | إزالة |
| t-online.de (الألمانية/T-Mobile) | `tobr@rx.t-online.de` | إزالة |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### ماذا يجب أن أفعل إذا تلقيت رسائل بريد إلكتروني غير مرغوب فيها؟ {#what-should-i-do-if-i-receive-spam-emails}

يجب عليك إلغاء الاشتراك في قائمة البريد الإلكتروني (إن أمكن) وحظر المرسل.

يرجى عدم الإبلاغ عن الرسالة باعتبارها رسالة غير مرغوب فيها، بل قم بدلاً من ذلك بتوجيهها إلى نظام منع إساءة الاستخدام الذي تم إعداده يدويًا والذي يركز على الخصوصية.

**عنوان البريد الإلكتروني لإعادة توجيه البريد العشوائي إليه هو:** <abuse@forwardemail.net>

### لماذا تظهر رسائل البريد الإلكتروني الاختبارية المرسلة إلى نفسي في Gmail على أنها "مشبوهة" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

إذا رأيت رسالة الخطأ هذه في Gmail عندما ترسل اختبارًا إلى نفسك، أو عندما يرى الشخص الذي تراسله عبر البريد الإلكتروني باستخدام اسمك المستعار رسالة بريد إلكتروني منك لأول مرة، فلا داعي للقلق، فهذه ميزة أمان مدمجة في Gmail.

يمكنك ببساطة النقر على "يبدو آمنًا". على سبيل المثال، إذا أرسلتَ رسالة تجريبية باستخدام ميزة "إرسال بريد كـ" (إلى شخص آخر)، فلن يراها.

إذا رأوا هذه الرسالة، فذلك لأنهم اعتادوا على رؤية رسائلك من <john@gmail.com> بدلاً من <john@customdomain.com> (مثال). سيُنبه Gmail المستخدمين للتأكد من سلامة الرسائل، تحسبًا لعدم وجود حل بديل.

### هل يمكنني إزالة via forwardemail dot net في Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

يرتبط هذا الموضوع بـ [مشكلة معروفة على نطاق واسع في Gmail حيث تظهر معلومات إضافية بجوار اسم المرسل](https://support.google.com/mail/answer/1311182).

اعتبارًا من مايو 2023، ندعم إرسال البريد الإلكتروني باستخدام SMTP كإضافة لجميع المستخدمين المدفوعين - مما يعني أنه يمكنك إزالة <span class="notranslate">via forwardemail dot net</span> في Gmail.

يرجى ملاحظة أن موضوع الأسئلة الشائعة هذا مخصص لأولئك الذين يستخدمون ميزة [كيفية إرسال البريد باسم باستخدام Gmail](#how-to-send-mail-as-using-gmail).

يرجى الاطلاع على القسم الخاص بـ [هل تدعم إرسال البريد الإلكتروني باستخدام SMTP؟](#do-you-support-sending-email-with-smtp) للحصول على تعليمات التكوين.

## إدارة البيانات {#data-management}

### أين تقع خوادمك؟ {#where-are-your-servers-located}

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

تتواجد خوادمنا بشكل أساسي في دنفر، كولورادو - راجع <https://forwardemail.net/ips> للحصول على القائمة الكاملة لعناوين IP.

يمكنك التعرف على المعالجات الفرعية لدينا على صفحاتنا [GDPR](/gdpr)، و[DPA](/dpa)، و[خصوصية](/privacy).

### كيف يمكنني تصدير صندوق البريد الخاص بي والنسخ الاحتياطي له؟ {#how-do-i-export-and-backup-my-mailbox}

يمكنك في أي وقت تصدير صناديق البريد الخاصة بك بتنسيق [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)، أو [إم بوكس](https://en.wikipedia.org/wiki/Mbox)، أو تنسيق [SQLite](https://en.wikipedia.org/wiki/SQLite) المشفر.

انتقل إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة <i class="fa fa-angle-right"></i> قم بتنزيل النسخة الاحتياطية وحدد نوع تنسيق التصدير المفضل لديك.

سيتم إرسال رابط إليك عبر البريد الإلكتروني لتنزيل التصدير بمجرد الانتهاء منه.

يرجى ملاحظة أن رابط تنزيل التصدير هذا ينتهي صلاحيته بعد 4 ساعات لأسباب أمنية.

إذا كنت بحاجة إلى فحص تنسيقات EML أو Mbox التي قمت بتصديرها، فقد تكون أدوات المصدر المفتوح التالية مفيدة:

| اسم | شكل | منصة | رابط GitHub |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| عارض MBox | إم بوكس | ويندوز | <https://github.com/eneam/mboxviewer> |
| عارض ويب mbox | إم بوكس | جميع المنصات | <https://github.com/PHMRanger/mbox-web-viewer> |
| قارئ إيمل | EML | ويندوز | <https://github.com/ayamadori/EmlReader> |
| عارض البريد الإلكتروني | EML | كود VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| قارئ eml | EML | جميع المنصات | <https://github.com/s0ph1e/eml-reader> |

بالإضافة إلى ذلك، إذا كنت بحاجة إلى تحويل ملف Mbox إلى ملف EML، فيمكنك استخدام <https://github.com/noelmartinon/mboxzilla>.

### كيف يمكنني استيراد ونقل صندوق البريد الإلكتروني الحالي الخاص بي {#how-do-i-import-and-migrate-my-existing-mailbox}

يمكنك بسهولة استيراد بريدك الإلكتروني إلى إعادة توجيه البريد الإلكتروني (على سبيل المثال باستخدام [طائر الرعد](https://www.thunderbird.net)) باتباع الإرشادات أدناه:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:

</strong>
<span>
يجب عليك اتباع جميع الخطوات التالية لاستيراد بريدك الإلكتروني الحالي.
</span>
</div>

1. قم بتصدير بريدك الإلكتروني من مزود البريد الإلكتروني الحالي لديك:

| مزود البريد الإلكتروني | تنسيق التصدير | تعليمات التصدير |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| جيميل | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| التوقعات | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">نصيحة:</strong> <span>إذا كنت تستخدم Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">تنسيق تصدير PST</a>)، فيمكنك ببساطة اتباع التعليمات الموجودة ضمن "أخرى" أدناه. مع ذلك، قمنا بتوفير روابط أدناه لتحويل ملفات PST إلى صيغة MBOX/EML بناءً على نظام التشغيل لديك:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba لنظام Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst لنظام Windows cygwin</a> – (على سبيل المثال <code>readpst -u -o $OUT_DIR $IN_DIR</code> استبدال <code>$OUT_DIR</code> و<code>$IN_DIR</code> مع مسارات دليل الإخراج ودليل الإدخال على التوالي).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst لنظامي التشغيل Ubuntu/Linux</a> - (على سبيل المثال <code>sudo apt-get install readpst</code> ثم <code>readpst -u -o $OUT_DIR $IN_DIR</code>، مع استبدال <code>$OUT_DIR</code> و<code>$IN_DIR</code> بمساري دليل الإخراج ودليل الإدخال على التوالي).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst لنظام التشغيل macOS (عبر brew)</a> - (على سبيل المثال <code>brew install libpst</code> ثم <code>readpst -u -o $OUT_DIR $IN_DIR</code>، مع استبدال <code>$OUT_DIR</code> و<code>$IN_DIR</code> بمسارات دليل الإخراج ودليل الإدخال على التوالي).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">محول PST لنظام Windows (GitHub)</a></li></ul><br /></span></div> |
| بريد آبل | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| البريد السريع | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-تنزيل-جميع-بياناتك#downloadmail> |
| بريد بروتون | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| توتانوتا | EML | <https://github.com/crepererum-oss/tatutanatata> |
| يفكر | EML | <https://docs.gandi.net/ar/gandimail/common_operations/backup_email.html#contents> |
| زوهو | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| آخر | [Use Thunderbird](https://www.thunderbird.net) | أنشئ حساب بريدك الإلكتروني الحالي في Thunderbird، ثم استخدم الإضافة [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) لتصدير بريدك الإلكتروني واستيراده. **يمكنك أيضًا نسخ/لصق أو سحب/إفلات رسائل البريد الإلكتروني بسهولة بين حساب وآخر.** |

2. قم بتنزيل [طائر الرعد](https://www.thunderbird.net) وتثبيته وفتحه.

٣. أنشئ حسابًا جديدًا باستخدام عنوان البريد الإلكتروني الكامل لاسمك المستعار (مثل <code><you@yourdomain.com></code>) وكلمة المرور المُولّدة. <strong>إذا لم تكن لديك كلمة مرور مُولّدة بعد، فراجع <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">تعليمات الإعداد</a></strong>.

4. قم بتنزيل وتثبيت البرنامج الإضافي [أدوات الاستيراد والتصدير](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird.

5. قم بإنشاء مجلد محلي جديد في Thunderbird، ثم انقر بزر الماوس الأيمن فوقه → حدد الخيار `ImportExportTools NG` → اختر `Import mbox file` (لتنسيق تصدير MBOX) - أو - `Import messages` / `Import all messages from a directory` (لتنسيق تصدير EML).

٦. اسحب/أفلت من المجلد المحلي إلى مجلد IMAP جديد (أو موجود) في Thunderbird الذي ترغب في تحميل الرسائل إليه في وحدة تخزين IMAP عبر خدمتنا. سيضمن هذا نسخها احتياطيًا عبر الإنترنت باستخدام وحدة تخزين SQLite المشفرة لدينا.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
<span>
إذا كنتَ محتارًا بشأن كيفية الاستيراد إلى Thunderbird، يمكنكَ الرجوع إلى التعليمات الرسمية على <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> و<a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
بعد إتمام عملية التصدير والاستيراد، قد ترغب أيضًا في تفعيل إعادة التوجيه على حساب بريدك الإلكتروني الحالي وإعداد رد تلقائي لإعلام المُرسِلين بوجود عنوان بريد إلكتروني جديد (على سبيل المثال، إذا كنت تستخدم Gmail سابقًا وتستخدم الآن بريدًا إلكترونيًا باسم نطاقك المخصص).
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

### هل تدعم الاستضافة الذاتية؟ {#do-you-support-self-hosting}

نعم، اعتبارًا من مارس ٢٠٢٥، ندعم خيار الاستضافة الذاتية. اقرأ المدونة [هنا](https://forwardemail.net/blog/docs/self-hosted-solution). اطلع على [دليل مستضاف ذاتيًا](https://forwardemail.net/self-hosted) للبدء. ولمن يرغب في الحصول على نسخة أكثر تفصيلًا خطوة بخطوة، يُرجى الاطلاع على أدلتنا المستندة إلى [أوبونتو](https://forwardemail.net/guides/selfhosted-on-ubuntu) أو [ديبيان](https://forwardemail.net/guides/selfhosted-on-debian).

## تكوين البريد الإلكتروني {#email-configuration}

### كيف أبدأ وأقوم بإعداد إعادة توجيه البريد الإلكتروني {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">الوقت المُقدّر للإعداد:</strong>
<span>أقل من ١٠ دقائق</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">

البدء:
</strong>
<span>
اقرأ الخطوات من واحد إلى ثمانية أدناه بعناية واتبعها. تأكد من استبدال عنوان البريد الإلكتروني <code>user@gmail.com</code> بعنوان البريد الإلكتروني الذي ترغب في إعادة توجيه رسائل البريد الإلكتروني إليه (إن لم يكن صحيحًا). وبالمثل، تأكد من استبدال <code>example.com</code> باسم نطاقك المخصص (إن لم يكن صحيحًا).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">إذا كنت قد سجلت اسم نطاقك في موقع ما، فعليك تخطي هذه الخطوة تمامًا والانتقال إلى الخطوة الثانية! وإلا يمكنك <a href="/domain-registration" rel="noopener noreferrer">النقر هنا لتسجيل اسم نطاقك</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
هل تتذكر مكان تسجيل نطاقك؟ بعد ذلك، اتبع التعليمات التالية:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>

يجب عليك فتح علامة تبويب جديدة وتسجيل الدخول إلى مُسجِّل نطاقك. يمكنك بسهولة النقر على "مُسجِّل النطاق" أدناه للقيام بذلك تلقائيًا. في هذه العلامة التبويبية الجديدة، يجب عليك الانتقال إلى صفحة إدارة نظام أسماء النطاقات (DNS) لدى مُسجِّل النطاق الخاص بك - وقد وفرنا خطوات التنقل خطوة بخطوة أدناه ضمن عمود "خطوات التهيئة". بعد الانتقال إلى هذه الصفحة في علامة التبويب الجديدة، يمكنك العودة إليها والانتقال إلى الخطوة الثالثة أدناه.
<strong class="font-weight-bold">لا تغلق علامة التبويب المفتوحة الآن؛ ستحتاج إليها للخطوات المستقبلية!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>مسجل النطاق</th>
<th>خطوات التهيئة</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> مركز النطاقات <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> تعديل إعدادات DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> المناطق المستضافة <i class="fa fa-angle-right"></i> (اختر نطاقك)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> خوادمي <i class="fa fa-angle-right"></i> إدارة النطاقات <i class="fa fa-angle-right"></i> مدير DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>للإصدارات القديمة: تسجيل الدخول <i class="fa fa-angle-right"></i> النطاقات <i class="fa fa-angle-right"></i> (انقر على الرمز ▼ بجوار الإدارة) <i class="fa fa-angle-right"></i> DNS
<br />
للإصدارات القديمة: تسجيل الدخول <i class="fa fa-angle-right"></i> النطاقات <i class="fa fa-angle-right"></i> محرر المناطق <i class="fa fa-angle-right"></i> (اختر نطاقك)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS بسهولة</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (اختر نطاقك)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> إدارة</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i>الشبكات <i class="fa fa-angle-right"></i>النطاقات <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i>المزيد <i class="fa fa-angle-right"></i>إدارة النطاق</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> في عرض البطاقة، انقر على "إدارة" نطاقك <i class="fa fa-angle-right"></i> في عرض القائمة، انقر على رمز الترس <i class="fa fa-angle-right"></i> سجلات DNS وخوادم الأسماء <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> مشاهدة</a>
</td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إدارة <i class="fa fa-angle-right"></i> (انقر على رمز الترس) <i class="fa fa-angle-right"></i> انقر على DNS وخوادم الأسماء في القائمة اليسرى</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> لوحة التحكم <i class="fa fa-angle-right"></i> النطاقات <i class="fa fa-angle-right"></i> إدارة النطاقات <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> نظرة عامة <i class="fa fa-angle-right"></i> إدارة <i class="fa fa-angle-right"></i> محرر بسيط <i class="fa fa-angle-right"></i> السجلات</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> الإدارة <i class="fa fa-angle-right"></i> تعديل المنطقة</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> مشاهدة</a>
</td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> إدارة نطاقاتي <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إدارة DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google نطاقات</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> مشاهدة</a>
</td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> تهيئة DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> مشاهدة</a>
</td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> قائمة النطاقات <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إدارة <i class="fa fa-angle-right"></i> DNS متقدم</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إعداد Netlify DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network الحلول</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> مدير الحساب <i class="fa fa-angle-right"></i> أسماء نطاقاتي <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إدارة <i class="fa fa-angle-right"></i> تغيير مواقع النطاق <i class="fa fa-angle-right"></i> نظام أسماء النطاقات المتقدم</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> مشاهدة</a>
</td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> النطاقات المُدارة <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> إعدادات DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> القائمة الرئيسية <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> النطاقات <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i>
الإعدادات المتقدمة <i class="fa fa-angle-right"></i> السجلات المخصصة</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's الآن</a></td>
<td>استخدام "now" سطر الأوامر <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> صفحة النطاقات <i class="fa fa-angle-right"></i> (اختر نطاقك) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> صفحة النطاقات <i class="fa fa-angle-right"></i> (انقر على أيقونة <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> حدد إدارة سجلات DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
<td>تسجيل الدخول <i class="fa fa-angle-right"></i> النطاقات <i class="fa fa-angle-right"></i> نطاقاتي</td>
</tr>
<tr>
<td>أخرى</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">هام:</strong> ألا ترى اسم مسجل النطاقات الخاص بك مدرجًا هنا؟ ابحث ببساطة على الإنترنت عن "كيفية تغيير سجلات DNS على $REGISTRAR" (استبدل $REGISTRAR باسم مسجل النطاقات الخاص بك - على سبيل المثال "كيفية تغيير سجلات DNS على GoDaddy" إذا كنت تستخدم GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">باستخدام صفحة إدارة DNS الخاصة بمسجل النطاقات الخاص بك (علامة التبويب الأخرى التي فتحتها)، اضبط سجلات "MX" التالية:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>

ملاحظة: يجب ألا تكون هناك أي سجلات MX أخرى. يجب أن يكون كلا السجلين الموضحين أدناه موجودين. تأكد من عدم وجود أخطاء إملائية، وأن يكون كل من mx1 وmx2 مكتوبين بشكل صحيح. إذا كانت هناك سجلات MX موجودة بالفعل، فيُرجى حذفها تمامًا.

ليس بالضرورة أن تكون قيمة "TTL" 3600، ويمكن أن تكون قيمة أقل أو أعلى إذا لزم الأمر.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">باستخدام صفحة إدارة DNS الخاصة بمسجل النطاق الخاص بك (علامة التبويب الأخرى التي فتحتها)، قم بتعيين سجلات <strong class="notranslate">TXT</strong> التالية:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
إذا كنت مشتركًا في باقة مدفوعة، فعليك تخطي هذه الخطوة تمامًا والانتقال إلى الخطوة الخامسة! أما إذا لم تكن مشتركًا في باقة مدفوعة، فستكون عناوينك المُعاد توجيهها قابلة للبحث العام - انتقل إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> وقم بترقية نطاقك إلى باقة مدفوعة إذا رغبت في ذلك. لمعرفة المزيد عن الباقات المدفوعة، تفضل بزيارة صفحة <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">الأسعار</a>. بخلاف ذلك، يمكنك الاستمرار في اختيار تركيبة واحدة أو أكثر من الخيار (أ) إلى الخيار (و) المذكورة أدناه.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
الخيار أ:
</strong>
<span>
إذا كنت تُعيد توجيه جميع رسائل البريد الإلكتروني من نطاقك (مثل "all@example.com"، "hello@example.com"، إلخ) إلى عنوان مُحدد "user@gmail.com":
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
تأكد من استبدال القيم أعلاه في عمود "القيمة" بعنوان بريدك الإلكتروني. ليس بالضرورة أن تكون قيمة "TTL" 3600، بل يمكن أن تكون قيمة أقل أو أعلى عند الحاجة. سيضمن انخفاض قيمة "TTL" نشر أي تغييرات مستقبلية تُجرى على سجلات DNS عبر الإنترنت بشكل أسرع - تخيل هذا كمدة تخزينها مؤقتًا في الذاكرة (بالثواني). يمكنك معرفة المزيد حول <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL على ويكيبيديا</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
الخيار ب:
</strong>
<span>
إذا كنت تحتاج فقط إلى إعادة توجيه عنوان بريد إلكتروني واحد (مثل <code>hello@example.com</code> إلى <code>user@gmail.com</code>؛ سيؤدي هذا أيضًا إلى إعادة توجيه "hello+test@example.com" إلى "user+test@gmail.com" تلقائيًا):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
إذا كنت تُعيد توجيه عدة رسائل بريد إلكتروني، فافصلها بفاصلة:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
<th>النوع</th>
<th>الإجابة/القيمة</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@" أو "." أو فارغ</em></td>
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
يمكنك إعداد عدد لا نهائي من رسائل إعادة التوجيه - فقط تأكد من عدم تجاوز 255 حرفًا في سطر واحد، وابدأ كل سطر بـ "forward-email=". إليك مثال:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
يمكنك أيضًا تحديد اسم نطاق في سجل <strong class="notranslate">TXT</strong> لإعادة توجيه الاسم المستعار عالميًا (على سبيل المثال، سيتم إعادة توجيه "user@example.com" إلى "user@example.net"):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
الخيار F:
</strong>
<span>
يمكنك أيضًا استخدام خطافات الويب كاسم مستعار عام أو فردي لإعادة توجيه رسائل البريد الإلكتروني إليه. راجع المثال والقسم الكامل حول خطافات الويب بعنوان <a href="#do-you-support-webhooks" class="alert-link">هل تدعم خطافات الويب</a> أدناه.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
الخيار ز:
</strong>
<span>
يمكنك أيضًا استخدام التعبيرات النمطية ("regex") لمطابقة الأسماء المستعارة ومعالجة عمليات الاستبدال لإعادة توجيه رسائل البريد الإلكتروني إليها. راجع الأمثلة والقسم الكامل حول التعبيرات النمطية بعنوان <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">هل تدعم التعبيرات النمطية أم التعبيرات النمطية</a> أدناه.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>هل تحتاج إلى تعبيرات عادية متقدمة مع الاستبدال؟</strong> راجع الأمثلة والقسم الكامل حول التعبيرات العادية بعنوان <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">هل تدعم التعبيرات العادية أو التعبيرات العادية</a> أدناه.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>مثال بسيط:</strong> إذا أردتُ إعادة توجيه جميع رسائل البريد الإلكتروني المرسلة إلى `linus@example.com` أو `torvalds@example.com` إلى `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
هام:
</strong>
<span>
يمكن وصف قواعد إعادة التوجيه الشاملة أيضًا بأنها "غير قابلة للتكرار". هذا يعني أنه سيتم استخدام رسائل البريد الإلكتروني الواردة التي تتوافق مع قاعدة إعادة توجيه واحدة على الأقل بدلاً من قواعد إعادة التوجيه الشاملة.
تشمل القواعد المحددة عناوين البريد الإلكتروني والتعبيرات العادية.
<br /><br />
على سبيل المثال:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
لن تُعاد توجيه رسائل البريد الإلكتروني المُرسَلة إلى <code>hello@example.com</code> إلى <code>second@gmail.com</code> (العنوان العام) باستخدام هذا الإعداد، بل ستُرسَل فقط إلى <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">باستخدام صفحة إدارة DNS الخاصة بمسجل النطاق الخاص بك (علامة التبويب الأخرى التي فتحتها)، قم أيضًا بتعيين سجل <strong class="notranslate">TXT</strong> التالي:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
هام:
</strong>
<span>
إذا كنت تستخدم Gmail (مثل إرسال البريد باسم) أو G Suite، فستحتاج إلى إضافة <code>include:_spf.google.com</code> إلى القيمة أعلاه، على سبيل المثال:
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
إذا كان لديك سطر مشابه يحتوي على "v=spf1"، فستحتاج إلى إضافة <code>include:spf.forwardemail.net</code> قبل أي سجل "include:host.com" موجود وقبل "-all" في نفس السطر، على سبيل المثال:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
لاحظ وجود فرق بين "-all" و"~all". تشير "-" إلى فشل فحص SPF في حال عدم التطابق، وتشير "~" إلى فشل فحص SPF. نوصي باستخدام طريقة "-all" لمنع تزوير النطاق.
<br /><br />
قد تحتاج أيضًا إلى تضمين سجل SPF لأي مُضيف تُرسل منه البريد (مثل Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">تحقق من سجلات DNS الخاصة بك باستخدام أداة "التحقق من السجلات" المتوفرة في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعداد.

</li><li class="mb-2 mb-md-3 mb-lg-5">أرسل بريدًا إلكترونيًا تجريبيًا للتأكد من نجاح العملية. يُرجى العلم أن نشر سجلات DNS قد يستغرق بعض الوقت.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
<span>
</span>
إذا لم تستلم رسائل بريد إلكتروني تجريبية، أو تلقيت رسالة بريد إلكتروني تجريبية تقول "انتبه لهذه الرسالة"، فراجع إجابات <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">لماذا لا أستلم رسائل البريد الإلكتروني التجريبية</a> و<a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">لماذا تظهر رسائل البريد الإلكتروني التجريبية المرسلة إليّ في Gmail على أنها "مشبوهة"</a> على التوالي.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">إذا كنت ترغب في "إرسال البريد باسم" من Gmail، فستحتاج إلى <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">مشاهدة هذا الفيديو</a></strong>، أو اتباع الخطوات الموجودة تحت <a href="#how-to-send-mail-as-using-gmail">How لإرسال البريد باسم باستخدام Gmail</a> أدناه.

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

الإضافات الاختيارية مُدرجة أدناه. يُرجى العلم أن هذه الإضافات اختيارية تمامًا وقد لا تكون ضرورية. نودّ على الأقل تزويدك بمعلومات إضافية عند الحاجة.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
إضافة اختيارية:
</strong>
<span>
إذا كنت تستخدم ميزة <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How لإرسال بريد كـ باستخدام Gmail</a>، فقد ترغب في إضافة نفسك إلى قائمة المسموح لهم. راجع <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">هذه التعليمات من Gmail</a> حول هذا الموضوع.
</span>
</div>

### هل يمكنني استخدام عدة بورصات وخوادم MX لإعادة التوجيه المتقدم؟ {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

نعم، ولكن **يجب أن يكون لديك بورصة MX واحدة فقط مدرجة في سجلات DNS الخاصة بك**.

لا تحاول استخدام "الأولوية" كطريقة لتكوين تبادلات MX متعددة.

بدلاً من ذلك، يتعين عليك تكوين تبادل MX الحالي لديك لإعادة توجيه البريد لجميع الأسماء المستعارة غير المطابقة إلى تبادلات خدمتنا (`mx1.forwardemail.net` و/أو `mx2.forwardemail.net`).

إذا كنت تستخدم Google Workspace وتريد إعادة توجيه جميع الأسماء المستعارة غير المطابقة إلى خدمتنا، فراجع <https://support.google.com/a/answer/6297084>.

إذا كنت تستخدم Microsoft 365 (Outlook) وتريد إعادة توجيه جميع الأسماء المستعارة غير المطابقة إلى خدمتنا، فراجع <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> و<https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### كيف أقوم بإعداد مجيب الإجازة (مجيب تلقائي خارج المكتب) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

انتقل إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة وقم بإنشاء أو تحرير الاسم المستعار الذي ترغب في تكوين برنامج الرد التلقائي للإجازة له.

لديك القدرة على تكوين تاريخ البدء وتاريخ الانتهاء والموضوع والرسالة، وتمكينها أو تعطيلها في أي وقت:

* يدعم حاليًا النص العادي (نستخدم حزمة `striptags` داخليًا لإزالة أي HTML).
* يقتصر طول الموضوع على 100 حرف.
* تقتصر الرسالة على 1000 حرف.
* يتطلب الإعداد تهيئة SMTP الصادر (على سبيل المثال، ستحتاج إلى إعداد سجلات DKIM وDMARC وDNS لمسار الإرجاع).
* انتقل إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> تهيئة SMTP الصادر واتبع تعليمات الإعداد.
* لا يمكن تفعيل مُجيب العطل على أسماء النطاقات العالمية (على سبيل المثال، لا يدعم [عناوين يمكن التخلص منها](/disposable-addresses)).

* لا يمكن تفعيل مُجيب العطل للأسماء المستعارة التي تحتوي على أحرف بديلة/جملة شاملة (`*`) أو التعبيرات العادية.

على عكس أنظمة البريد مثل `postfix` (على سبيل المثال، التي تستخدم ملحق مرشح الإجازة `sieve`) – يضيف Forward Email توقيع DKIM الخاص بك تلقائيًا، ويمنع مشكلات الاتصال الوهمية عند إرسال استجابات الإجازة (على سبيل المثال، بسبب مشكلات اتصال SSL/TLS الشائعة والخوادم القديمة)، ويدعم أيضًا تشفير Open WKD وPGP لاستجابات الإجازة.

<!--
* لمنع إساءة الاستخدام، سيتم خصم رصيد SMTP صادر واحد لكل رسالة رد تلقائي مُرسلة.
* تتضمن جميع الحسابات المدفوعة 300 رصيد يوميًا افتراضيًا. إذا كنت بحاجة إلى مبلغ أكبر، يُرجى التواصل معنا.
-->

1. نرسل رسالة واحدة فقط لكل مرسل [مدرج في القائمة المسموح بها](#do-you-have-an-allowlist) كل 4 أيام (وهو ما يشبه سلوك Gmail).

* تستخدم ذاكرة التخزين المؤقت Redis الخاصة بنا بصمةً مكونةً من `alias_id` و`sender`، بينما `alias_id` هو معرف MongoDB البديل، و`sender` هو عنوان المرسل (إذا كان مُدرجًا في القائمة المسموح بها) أو نطاق الجذر في عنوان المرسل (إذا لم يكن مُدرجًا في القائمة المسموح بها). للتبسيط، تم ضبط مدة صلاحية هذه البصمة في ذاكرة التخزين المؤقت على 4 أيام.

* إن نهجنا المتمثل في استخدام المجال الجذر الذي تم تحليله في عنوان المرسل للمرسلين غير المدرجين في القائمة المسموح بها يمنع إساءة الاستخدام من قبل المرسلين غير المعروفين نسبيًا (مثل الجهات الخبيثة) من إغراق رسائل المستجيب التلقائي.

2. نرسل فقط عندما لا يكون حقل "البريد من" و/أو "من" فارغًا ولا يحتوي على (غير حساس لحالة الأحرف) [اسم المستخدم مدير مكتب البريد](#what-are-postmaster-addresses) (الجزء قبل @ في البريد الإلكتروني).

3. لا نرسل الرسالة إذا كانت الرسالة الأصلية تحتوي على أي من العناوين التالية (غير حساسة لحالة الأحرف):

* رأس `auto-submitted` بقيمة لا تساوي `no`.
* رأس `x-auto-response-suppress` بقيمة `dr`، أو `autoreply`، أو `auto-reply`، أو `auto_reply`، أو `all`
* رأس `list-id`، أو `list-subscribe`، أو `list-unsubscribe`، أو `list-help`، أو `list-post`، أو `list-owner` `list-archive`، أو `x-autoreply`، أو `x-autorespond`، أو `x-auto-respond` (بغض النظر عن القيمة).
* رأس `precedence` بقيمة `bulk`، أو `autoreply`، أو `auto-reply`، أو `auto_reply`، أو `list`.

4. لن نرسل إذا كان عنوان البريد الإلكتروني المرسل أو المرسل ينتهي بـ `+donotreply`، أو `-donotreply`، أو `+noreply`، أو `-noreply`.

5. لا نرسل إذا كان جزء اسم المستخدم الخاص بعنوان البريد الإلكتروني المرسل هو `mdaemon` وكان به رأس غير حساس لحالة الأحرف `X-MDDSN-Message`.

6. لا نرسل إذا كان هناك رأس `content-type` غير حساس لحالة الأحرف لـ `multipart/report`.

### كيف أقوم بإعداد SPF لإعادة توجيه البريد الإلكتروني {#how-do-i-set-up-spf-for-forward-email}

باستخدام صفحة إدارة DNS الخاصة بمسجل النطاق الخاص بك، قم بتعيين سجل <strong class="notranslate">TXT</strong> التالي:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
هام:
</strong>
<span>
إذا كنت تستخدم Gmail (مثل إرسال البريد باسم) أو G Suite، فستحتاج إلى إضافة <code>include:_spf.google.com</code> إلى القيمة أعلاه، على سبيل المثال:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
إذا كنت تستخدم Microsoft Outlook أو Live.com، فستحتاج إلى إضافة <code>include:spf.protection.outlook.com</code> إلى سجل SPF <strong class="notranslate">TXT</strong>، على سبيل المثال:
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
إذا كان لديك سطر مشابه يحتوي على "v=spf1"، فستحتاج إلى إضافة <code>include:spf.forwardemail.net</code> قبل أي سجل "include:host.com" موجود وقبل "-all" في نفس السطر، على سبيل المثال:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
لاحظ وجود فرق بين "-all" و"~all". تشير "-" إلى فشل فحص SPF في حال عدم التطابق، وتشير "~" إلى فشل فحص SPF. نوصي باستخدام طريقة "-all" لمنع تزوير النطاق.
<br /><br />
قد تحتاج أيضًا إلى تضمين سجل SPF لأي مُضيف تُرسل منه البريد (مثل Outlook).
</span>
</div>

### كيف أقوم بإعداد DKIM لإعادة توجيه البريد الإلكتروني {#how-do-i-set-up-dkim-for-forward-email}

انتقل إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> تكوين SMTP الصادر واتبع تعليمات الإعداد.

### كيف أقوم بإعداد DMARC لإعادة توجيه البريد الإلكتروني {#how-do-i-set-up-dmarc-for-forward-email}

انتقل إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> تكوين SMTP الصادر واتبع تعليمات الإعداد.

### كيف يمكنني الاتصال بجهات الاتصال الخاصة بي وتكوينها؟ {#how-do-i-connect-and-configure-my-contacts}

**لتكوين جهات الاتصال الخاصة بك، استخدم عنوان URL لـ CardDAV:** `https://carddav.forwardemail.net` (أو ببساطة `carddav.forwardemail.net` إذا سمح العميل بذلك)

### كيف أقوم بتوصيل تقويماتي وتكوينها؟ {#how-do-i-connect-and-configure-my-calendars}

**لتكوين التقويم الخاص بك، استخدم عنوان URL لـ CalDAV الخاص بـ:** `https://caldav.forwardemail.net` (أو ببساطة `caldav.forwardemail.net` إذا سمح العميل بذلك)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="مثال إعداد تقويم CalDAV Thunderbird لإعادة توجيه البريد الإلكتروني" />

### كيف يمكنني إضافة المزيد من التقويمات وإدارة التقويمات الموجودة {#how-do-i-add-more-calendars-and-manage-existing-calendars}

إذا كنت ترغب في إضافة تقويمات إضافية، فما عليك سوى إضافة عنوان URL جديد للتقويم: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**تأكد من استبدال `calendar-name` باسم التقويم المطلوب**)

بإمكانك تغيير اسم التقويم ولونه بعد إنشائه - ما عليك سوى استخدام تطبيق التقويم المفضل لديك (على سبيل المثال Apple Mail أو [طائر الرعد](https://thunderbird.net)).

### كيف أقوم بإعداد SRS لإعادة توجيه البريد الإلكتروني {#how-do-i-set-up-srs-for-forward-email}

نقوم تلقائيًا بتكوين [مخطط إعادة كتابة المرسل](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") - لا تحتاج إلى القيام بذلك بنفسك.

### كيف أقوم بإعداد MTA-STS لإعادة توجيه البريد الإلكتروني {#how-do-i-set-up-mta-sts-for-forward-email}

يرجى الرجوع إلى [قسمنا حول MTA-STS](#do-you-support-mta-sts) لمزيد من المعلومات.

### كيف أضيف صورة شخصية إلى عنوان بريدي الإلكتروني {#how-do-i-add-a-profile-picture-to-my-email-address}

إذا كنت تستخدم Gmail، فاتبع الخطوات التالية:

١. انتقل إلى <https://google.com> وسجّل الخروج من جميع حسابات البريد الإلكتروني.
٢. انقر على "تسجيل الدخول"، ثم انقر على "حساب آخر" من القائمة المنسدلة.
٣. اختر "استخدام حساب آخر".
٤. اختر "إنشاء حساب".
٥. اختر "استخدام عنوان بريدي الإلكتروني الحالي بدلاً من ذلك".
٦. أدخل عنوان البريد الإلكتروني لاسم نطاقك المخصص.
٧. استرد رسالة التحقق المرسلة إلى بريدك الإلكتروني.
٨. أدخل رمز التحقق من هذه الرسالة.
٩. أكمل معلومات ملفك الشخصي لحساب جوجل الجديد.
١٠. وافق على جميع سياسات الخصوصية وشروط الاستخدام.
١١. انتقل إلى <https://google.com>، وفي الزاوية العلوية اليمنى، انقر على رمز ملفك الشخصي، ثم انقر على زر "تغيير".
١٢. حمّل صورة أو صورة رمزية جديدة لحسابك.
١٣. سيستغرق تطبيق التغييرات من ساعة إلى ساعتين تقريبًا، ولكن قد تكون سريعة جدًا في بعض الأحيان.
١٤. أرسل بريدًا إلكترونيًا تجريبيًا، وستظهر صورة الملف الشخصي.

## الميزات المتقدمة {#advanced-features}

### هل تدعم النشرات الإخبارية أو قوائم البريد الإلكتروني للتسويق؟ {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

نعم، يمكنك قراءة المزيد على <https://forwardemail.net/guides/newsletter-with-listmonk>.

يرجى العلم أنه للحفاظ على سمعة IP وضمان سهولة التسليم، تُجري Forward Email عملية مراجعة يدوية لكل نطاق لموافقة النشرة الإخبارية. راسل <support@forwardemail.net> أو افتح [طلب المساعدة](https://forwardemail.net/help) للموافقة. عادةً ما يستغرق هذا أقل من 24 ساعة، ويتم الرد على معظم الطلبات خلال ساعة إلى ساعتين. نهدف قريبًا إلى جعل هذه العملية فورية من خلال إضافة عناصر تحكم إضافية في البريد العشوائي والتنبيهات. تضمن هذه العملية وصول رسائلك إلى صندوق الوارد وعدم تصنيفها كرسائل عشوائية.

### هل تدعم إرسال البريد الإلكتروني باستخدام واجهة برمجة التطبيقات {#do-you-support-sending-email-with-api}

نعم، اعتبارًا من مايو 2023، ندعم إرسال البريد الإلكتروني باستخدام واجهة برمجة التطبيقات كإضافة لجميع المستخدمين المدفوعين.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
يرجى التأكد من قراءة <a href="/terms" class="alert-link" target="_blank">الشروط</a>، و<a href="/privacy" class="alert-link" target="_blank">سياسة الخصوصية</a>، و<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">حدود SMTP الصادرة</a>، ويُعتبر استخدامك إقرارًا وموافقة.
</span>
</div>

يرجى الاطلاع على قسمنا حول [رسائل البريد الإلكتروني](/email-api#outbound-emails) في وثائق واجهة برمجة التطبيقات الخاصة بنا للحصول على الخيارات والأمثلة والمزيد من المعلومات.

لإرسال بريد إلكتروني صادر باستخدام واجهة برمجة التطبيقات (API) الخاصة بنا، يجب عليك استخدام رمز واجهة برمجة التطبيقات (API) المتوفر ضمن [أمني](/my-account/security).

### هل تدعم تلقي البريد الإلكتروني باستخدام IMAP {#do-you-support-receiving-email-with-imap}

نعم، اعتبارًا من 16 أكتوبر 2023، ندعم استلام رسائل البريد الإلكتروني عبر IMAP كإضافة لجميع المستخدمين المدفوعين. **يرجى قراءة مقالتنا المفصلة** حول [كيف تعمل ميزة تخزين صندوق بريد SQLite المشفر لدينا](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
يرجى التأكد من قراءة <a href="/terms" class="alert-link" target="_blank">الشروط</a> و<a href="/privacy" class="alert-link" target="_blank">سياسة الخصوصية</a>، ويُعتبر استخدامك إقرارًا وموافقة.
</span>
</div>

1. أنشئ اسمًا مستعارًا جديدًا لنطاقك ضمن <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثل <code><hello@example.com></code>)

٢. انقر على <strong class="text-success"><i class="fa fa-key"></i>إنشاء كلمة مرور</strong> بجوار الاسم المستعار الذي تم إنشاؤه حديثًا. انسخ كلمة المرور المُنشأة إلى الحافظة، ثم احفظها بأمان.

٣. باستخدام تطبيق البريد الإلكتروني المفضل لديك، أضف أو أنشئ حسابًا باسمك المستعار الجديد (مثل <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
<span>نوصي باستخدام <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>، <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>، <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>، أو <a href="/blog/open-source" class="alert-link" target="_blank">بديل مفتوح المصدر يركز على الخصوصية</a>.</span>
</div>

4. عند مطالبتك باسم خادم IMAP، أدخل `imap.forwardemail.net`

٥. عند طلب منفذ خادم IMAP، أدخل `993` (SSL/TLS) - راجع [منافذ IMAP البديلة](/faq#what-are-your-imap-server-configuration-settings) إذا لزم الأمر.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
<span>إذا كنت تستخدم Thunderbird، فتأكد من ضبط "أمان الاتصال" على "SSL/TLS" وضبط طريقة المصادقة على "كلمة مرور عادية".</span>
</div>

6. عند مطالبتك بكلمة مرور خادم IMAP، الصق كلمة المرور من <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> في الخطوة 2 أعلاه

7. **احفظ إعداداتك** - إذا كنت تواجه مشكلات، فيرجى <a href="/help">الاتصال بنا</a>

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

نعم، اعتبارًا من 4 ديسمبر 2023، ندعم [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) كإضافة لجميع المستخدمين المدفوعين. **يرجى قراءة مقالتنا المفصلة** حول [كيف تعمل ميزة تخزين صندوق بريد SQLite المشفر لدينا](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
يرجى التأكد من قراءة <a href="/terms" class="alert-link" target="_blank">الشروط</a> و<a href="/privacy" class="alert-link" target="_blank">سياسة الخصوصية</a>، ويُعتبر استخدامك إقرارًا وموافقة.
</span>
</div>

1. أنشئ اسمًا مستعارًا جديدًا لنطاقك ضمن <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثل <code><hello@example.com></code>)

٢. انقر على <strong class="text-success"><i class="fa fa-key"></i>إنشاء كلمة مرور</strong> بجوار الاسم المستعار الذي تم إنشاؤه حديثًا. انسخ كلمة المرور المُنشأة إلى الحافظة، ثم احفظها بأمان.

٣. باستخدام تطبيق البريد الإلكتروني المفضل لديك، أضف أو أنشئ حسابًا باسمك المستعار الجديد (مثل <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
<span>نوصي باستخدام <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>، <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>، <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>، أو <a href="/blog/open-source" class="alert-link" target="_blank">بديل مفتوح المصدر يركز على الخصوصية</a>.</span>
</div>

4. عند مطالبتك باسم خادم POP3، أدخل `pop3.forwardemail.net`

٥. عند طلب منفذ خادم POP3، أدخل `995` (SSL/TLS) - راجع [منافذ POP3 البديلة](/faq#what-are-your-pop3-server-configuration-settings) إذا لزم الأمر.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
<span>إذا كنت تستخدم Thunderbird، فتأكد من ضبط "أمان الاتصال" على "SSL/TLS" وضبط طريقة المصادقة على "كلمة مرور عادية".</span>
</div>

6. عند مطالبتك بكلمة مرور خادم POP3، الصق كلمة المرور من <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> في الخطوة 2 أعلاه

7. **احفظ إعداداتك** - إذا كنت تواجه مشكلات، فيرجى <a href="/help">الاتصال بنا</a>

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

نعم، أضفنا هذه الميزة اعتبارًا من 5 فبراير 2024. خادمنا محمي بـ `caldav.forwardemail.net`، وهو مُراقَب أيضًا على <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">صفحة الحالة</a>.

إنه يدعم كل من IPv4 و IPv6 ومتاح عبر المنفذ `443` (HTTPS).

| تسجيل الدخول | مثال | وصف |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| اسم المستخدم | `user@example.com` | عنوان البريد الإلكتروني للاسم المستعار الموجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>. |
| كلمة المرور | `************************` | كلمة مرور تم إنشاؤها خصيصًا للاسم المستعار. |

لاستخدام دعم التقويم، يجب أن يكون **المستخدم** هو عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> - ويجب أن تكون **كلمة المرور** كلمة مرور تم إنشاؤها خصيصًا للاسم المستعار.

### هل تدعم جهات الاتصال (CardDAV) {#do-you-support-contacts-carddav}

نعم، أضفنا هذه الميزة اعتبارًا من ١٢ يونيو ٢٠٢٥. خادمنا محمي بـ `carddav.forwardemail.net`، وهو مُراقَب أيضًا على <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">صفحة الحالة</a>.

إنه يدعم كل من IPv4 و IPv6 ومتاح عبر المنفذ `443` (HTTPS).

| تسجيل الدخول | مثال | وصف |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| اسم المستخدم | `user@example.com` | عنوان البريد الإلكتروني للاسم المستعار الموجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>. |
| كلمة المرور | `************************` | كلمة مرور تم إنشاؤها خصيصًا للاسم المستعار. |

لاستخدام دعم جهات الاتصال، يجب أن يكون **المستخدم** هو عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> - ويجب أن تكون **كلمة المرور** كلمة مرور تم إنشاؤها خصيصًا للاسم المستعار.

### هل تدعم إرسال البريد الإلكتروني باستخدام SMTP {#do-you-support-sending-email-with-smtp}

نعم، اعتبارًا من مايو 2023، ندعم إرسال البريد الإلكتروني باستخدام SMTP كإضافة لجميع المستخدمين المدفوعين.

<div id="تعليمات smtp">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
يرجى التأكد من قراءة <a href="/terms" class="alert-link" target="_blank">الشروط</a>، و<a href="/privacy" class="alert-link" target="_blank">سياسة الخصوصية</a>، و<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">حدود SMTP الصادرة</a>، ويُعتبر استخدامك إقرارًا وموافقة.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
إذا كنت تستخدم Gmail، يُرجى مراجعة <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">دليل إرسال البريد كـ Gmail</a>. إذا كنت مطورًا، يُرجى مراجعة <a class="alert-link" href="/email-api#outbound-emails" target="_blank">وثائق واجهة برمجة تطبيقات البريد الإلكتروني</a>.
</span>
</div>

1. انتقل إلى <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الإعدادات <i class="fa fa-angle-right"></i> تكوين SMTP الصادر واتبع تعليمات الإعداد

2. أنشئ اسمًا مستعارًا جديدًا لنطاقك ضمن <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثل <code><hello@example.com></code>)

٣. انقر على <strong class="text-success"><i class="fa fa-key"></i>إنشاء كلمة مرور</strong> بجوار الاسم المستعار الذي تم إنشاؤه حديثًا. انسخ كلمة المرور المُنشأة إلى الحافظة، ثم احفظها بأمان.

٤. باستخدام تطبيق البريد الإلكتروني المفضل لديك، أضف أو هيئ حسابًا باسمك المستعار الجديد (مثل <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
<span>نوصي باستخدام <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>، <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>، <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>، أو <a href="/blog/open-source" class="alert-link" target="_blank">بديل مفتوح المصدر يركز على الخصوصية</a>.</span>
</div>

5. عند مطالبتك باسم خادم SMTP، أدخل `smtp.forwardemail.net`

٦. عند طلب منفذ خادم SMTP، أدخل `465` (SSL/TLS) - راجع [منافذ SMTP البديلة](/faq#what-are-your-smtp-server-configuration-settings) إذا لزم الأمر.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
<span>إذا كنت تستخدم Thunderbird، فتأكد من ضبط "أمان الاتصال" على "SSL/TLS" وضبط طريقة المصادقة على "كلمة مرور عادية".</span>
</div>

7. عند مطالبتك بكلمة مرور خادم SMTP، الصق كلمة المرور من <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> في الخطوة 3 أعلاه

8. **احفظ إعداداتك وأرسل بريدك الإلكتروني التجريبي الأول** - إذا واجهت أي مشاكل، فيرجى <a href="/help">الاتصال بنا</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
يرجى العلم أنه للحفاظ على سمعة IP وضمان سهولة التسليم، نعتمد عملية مراجعة يدوية لكل نطاق لموافقة SMTP الصادرة. عادةً ما تستغرق هذه العملية أقل من ٢٤ ساعة، ويتم الرد على معظم الطلبات خلال ساعة إلى ساعتين. نهدف قريبًا إلى جعل هذه العملية فورية من خلال إضافة عناصر تحكم في البريد العشوائي والتنبيهات. تضمن هذه العملية وصول رسائلك إلى صندوق الوارد وعدم تصنيفها كرسائل عشوائية.
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

### هل تدعم OpenPGP/MIME، والتشفير من البداية إلى النهاية ("E2EE")، ودليل مفتاح الويب ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

نعم، ندعم [برنامج OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP) و[التشفير من البداية إلى النهاية ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) واكتشاف المفاتيح العامة باستخدام [دليل مفتاح الويب ("WKD")](https://wiki.gnupg.org/WKD). يمكنك تهيئة OpenPGP باستخدام [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) أو [استضافة مفاتيحك بنفسك](https://wiki.gnupg.org/WKDHosting) (راجع [هذا هو ملخص لإعداد خادم WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* يتم تخزين عمليات بحث WKD مؤقتًا لمدة ساعة واحدة لضمان تسليم البريد الإلكتروني في الوقت المناسب → لذلك، إذا أضفت أو غيّرت أو أزلت مفتاح WKD الخاص بك، يُرجى مراسلتنا عبر البريد الإلكتروني على `support@forwardemail.net` مع عنوان بريدك الإلكتروني لنقوم بمسح ذاكرة التخزين المؤقت يدويًا.
* ندعم تشفير PGP للرسائل التي يتم إعادة توجيهها عبر بحث WKD أو باستخدام مفتاح PGP مُحمّل على واجهتنا.
* تُعتد بالمفاتيح المُحمّلة طالما تم تفعيل/تحديد مربع اختيار PGP.
* الرسائل المُرسلة إلى خطافات الويب غير مُشفّرة حاليًا باستخدام PGP.
* إذا كان لديك عدة أسماء مستعارة تُطابق عنوان إعادة توجيه مُعيّن (مثل regex/wildcard/exact combo)، وإذا كان أكثر من واحد منها يحتوي على مفتاح PGP مُحمّل ومُفعّل عليه PGP →، فسنرسل إليك بريدًا إلكترونيًا لتنبيهك بالخطأ ولن نُشفّر الرسالة باستخدام مفتاح PGP المُحمّل. هذا نادر جدًا، وعادةً ما ينطبق فقط على المستخدمين المتقدمين الذين لديهم قواعد معقدة للأسماء المستعارة.
* **لن يُطبّق تشفير PGP على إعادة توجيه البريد الإلكتروني عبر خوادم MX الخاصة بنا إذا كان لدى المُرسِل سياسة رفض DMARC. إذا كنتَ بحاجة إلى تشفير PGP على *جميع* رسائل البريد الإلكتروني، فننصحك باستخدام خدمة IMAP الخاصة بنا وتكوين مفتاح PGP الخاص بك للاسم المستعار للبريد الوارد.**

**يمكنك التحقق من صحة إعداد دليل مفتاح الويب الخاص بك في <https://wkd.chimbosonic.com/> (مفتوح المصدر) أو <https://www.webkeydirectory.com/> (خاص).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
التشفير التلقائي:
</strong>
<span>إذا كنت تستخدم <a href="#do-you-support-sending-email-with-smtp" class="alert-link">خدمة SMTP الصادرة</a> وترسل رسائل غير مشفرة، فسنحاول تلقائيًا تشفير الرسائل لكل مستلم باستخدام <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:

</strong>
<span>
يجب عليك اتباع جميع الخطوات التالية لتفعيل OpenPGP لاسم نطاقك المخصص.
</span>
</div>

1. قم بتنزيل البرنامج الإضافي الموصى به لعميل البريد الإلكتروني الخاص بك وتثبيته أدناه:

| عميل البريد الإلكتروني | منصة | المكونات الإضافية الموصى بها | ملحوظات |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| طائر الرعد | سطح المكتب | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | يتضمن Thunderbird دعمًا مدمجًا لـ OpenPGP. |
| جيميل | المتصفح | [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download) (ترخيص خاص) | لا يدعم Gmail OpenPGP، ولكن يمكنك تنزيل البرنامج الإضافي مفتوح المصدر [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download). |
| بريد آبل | ماك أو إس | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | لا يدعم Apple Mail OpenPGP، ولكن يمكنك تنزيل البرنامج الإضافي مفتوح المصدر [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| بريد آبل | اي او اس | [PGPro](https://github.com/opensourceios/PGPro/) أو [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (ترخيص خاص) | لا يدعم Apple Mail OpenPGP، ولكن يمكنك تنزيل البرنامج الإضافي مفتوح المصدر [PGPro](https://github.com/opensourceios/PGPro/) أو [FlowCrypt](https://flowcrypt.com/download). |
| التوقعات | ويندوز | [gpg4win](https://www.gpg4win.de/index.html) | لا يدعم عميل البريد الإلكتروني لسطح المكتب الخاص بـ Outlook OpenPGP، ولكن يمكنك تنزيل البرنامج الإضافي مفتوح المصدر [gpg4win](https://www.gpg4win.de/index.html). |
| التوقعات | المتصفح | [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download) (ترخيص خاص) | لا يدعم عميل البريد الإلكتروني المستند إلى الويب الخاص بـ Outlook OpenPGP، ومع ذلك يمكنك تنزيل البرنامج الإضافي مفتوح المصدر [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download). |
| أندرويد | متحرك | [OpenKeychain](https://www.openkeychain.org/) أو [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | تدعم كلٌّ من [Android mail clients](/blog/open-source/android-email-clients)، مثل [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) و[FairEmail](https://github.com/M66B/FairEmail)، المكون الإضافي مفتوح المصدر [OpenKeychain](https://www.openkeychain.org/). يمكنك أيضًا استخدام المكون الإضافي مفتوح المصدر (المرخص ملكيةً) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| جوجل كروم | المتصفح | [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download) (ترخيص خاص) | يمكنك تنزيل ملحق المتصفح مفتوح المصدر [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download). |
| موزيلا فايرفوكس | المتصفح | [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download) (ترخيص خاص) | يمكنك تنزيل ملحق المتصفح مفتوح المصدر [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download). |
| مايكروسوفت إيدج | المتصفح | [Mailvelope](https://mailvelope.com/) | يمكنك تنزيل ملحق المتصفح مفتوح المصدر [Mailvelope](https://mailvelope.com/). |
| شجاع | المتصفح | [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download) (ترخيص خاص) | يمكنك تنزيل ملحق المتصفح مفتوح المصدر [Mailvelope](https://mailvelope.com/) أو [FlowCrypt](https://flowcrypt.com/download). |
| خشب البلسا | سطح المكتب | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | يتمتع Balsa بدعم مدمج لـ OpenPGP. |
| كي ميل | سطح المكتب | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | يتمتع KMail بدعم مدمج لـ OpenPGP. |
| تطور جنوم | سطح المكتب | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | يتضمن GNOME Evolution دعمًا مدمجًا لـ OpenPGP. |
| صالة | سطح المكتب | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | بإمكانك استخدام [gpg command line tool](https://www.gnupg.org/download/) مفتوح المصدر لإنشاء مفتاح جديد من سطر الأوامر. |

2. افتح البرنامج المساعد، وقم بإنشاء مفتاحك العام، ثم قم بتكوين عميل البريد الإلكتروني الخاص بك لاستخدامه.

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
إذا كنت تستخدم خدمة <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">التخزين المشفر (IMAP/POP3)</a> وترغب في تشفير جميع رسائل البريد الإلكتروني المخزنة في قاعدة بيانات SQLite (المشفرة مسبقًا) باستخدام مفتاحك العام، فانتقل إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة (مثال: <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> عدّل <i class="fa fa-angle-right"></i> OpenPGP وحمّل مفتاحك العام.
</span>
</div>

4. أضف سجلًا جديدًا `CNAME` إلى اسم المجال الخاص بك (على سبيل المثال `example.com`):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
<span>إذا كان اسمك المستعار يستخدم <a class="alert-link" href="/disposable-addresses" target="_blank">نطاقاتنا الشخصية/الخاصة</a> (مثل <code>hideaddress.net</code>)، فيمكنك تخطي هذه الخطوة.</span>
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

### هل تدعم MTA-STS {#do-you-support-mta-sts}

نعم، اعتبارًا من 2 مارس 2023، ندعم [MTA-STS](https://www.hardenize.com/blog/mta-sts). يمكنك استخدام [هذا القالب](https://github.com/jpawlowski/mta-sts.template) إذا كنت ترغب في تفعيله على نطاقك.

يمكن العثور على تكويننا علنًا على GitHub على <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### هل تدعم مفاتيح المرور وWebAuthn؟ {#do-you-support-passkeys-and-webauthn}

نعم! اعتبارًا من ١٣ ديسمبر ٢٠٢٣، أضفنا دعمًا لمفاتيح المرور [بسبب الطلب المرتفع](https://github.com/orgs/forwardemail/discussions/182).

تتيح لك مفاتيح المرور تسجيل الدخول بشكل آمن دون الحاجة إلى كلمة مرور أو مصادقة ثنائية العوامل.

يمكنك التحقق من هويتك عن طريق اللمس، أو التعرف على الوجه، أو كلمة المرور المستندة إلى الجهاز، أو رقم التعريف الشخصي (PIN).

نحن نسمح لك بإدارة ما يصل إلى 30 مفتاح مرور في وقت واحد، بحيث يمكنك تسجيل الدخول باستخدام جميع أجهزتك بسهولة.

تعرف على المزيد حول مفاتيح المرور من خلال الروابط التالية:

* [تسجيل الدخول إلى تطبيقاتك ومواقع الويب باستخدام مفاتيح المرور](https://support.google.com/android/answer/14124480?hl=en) (جوجل)
* [استخدم مفاتيح المرور لتسجيل الدخول إلى التطبيقات ومواقع الويب على iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (آبل)
* [مقالة ويكيبيديا عن مفاتيح المرور](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### هل تدعم أفضل ممارسات البريد الإلكتروني؟ {#do-you-support-email-best-practices}

نعم. نوفر دعمًا مدمجًا لـ SPF وDKIM وDMARC وARC وSRS في جميع الباقات. كما عملنا بشكل مكثف مع المؤلفين الأصليين لهذه المواصفات وخبراء البريد الإلكتروني الآخرين لضمان الجودة العالية وسهولة التوصيل.

### هل تدعم خطافات الويب المرتدة؟ {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
هل تبحث عن وثائق حول خطافات البريد الإلكتروني؟ راجع <a href="/faq#do-you-support-webhooks" class="alert-link">هل تدعمون خطافات البريد الإلكتروني؟</a> لمزيد من المعلومات.
<span>
</span>
</div>

نعم، اعتبارًا من 14 أغسطس 2024، أضفنا هذه الميزة. يمكنك الآن الانتقال إلى حسابي ← النطاقات ← الإعدادات ← رابط خطاف الويب المرتد وتكوين رابط `http://` أو `https://` الذي سنرسل إليه طلب `POST` عند ارتداد رسائل SMTP الصادرة.

يعد هذا مفيدًا لك لإدارة ومراقبة SMTP الصادر الخاص بك - ويمكن استخدامه للحفاظ على المشتركين، وإلغاء الاشتراك، واكتشاف متى تحدث الارتدادات.

يتم إرسال حمولات Bounce Webhook بتنسيق JSON مع الخصائص التالية:

* `email_id` (سلسلة نصية) - مُعرّف البريد الإلكتروني المُطابق لرسالة بريد إلكتروني في "حسابي" ← رسائل البريد الإلكتروني (SMTP صادر).
* `list_id` (سلسلة نصية) - قيمة رأس `List-ID` (غير حساسة لحالة الأحرف)، إن وجدت، من البريد الإلكتروني الصادر الأصلي.
* `list_unsubscribe` (سلسلة نصية) - قيمة رأس `List-Unsubscribe` (غير حساسة لحالة الأحرف)، إن وجدت، من البريد الإلكتروني الصادر الأصلي.
* `feedback_id` (سلسلة نصية) - قيمة رأس `Feedback-ID` (غير حساسة لحالة الأحرف)، إن وجدت، من البريد الإلكتروني الصادر الأصلي.
* `recipient` (سلسلة أحرف) - عنوان البريد الإلكتروني للمستلم الذي ارتد أو حدث خطأ.
* `message` (سلسلة أحرف) - رسالة خطأ مفصلة للارتداد.
* `response` (سلسلة أحرف) - رسالة استجابة SMTP.
* `response_code` (رقم) - رمز استجابة SMTP المُحلل.
* `truth_source` (سلسلة أحرف) - إذا كان رمز الاستجابة من مصدر موثوق، فسيتم ملء هذه القيمة باسم نطاق الجذر (مثلًا `google.com` أو `yahoo.com`)
* `bounce` (كائن) - كائن يحتوي على الخصائص التالية التي تُفصّل حالة الارتداد والرفض: * `action` (سلسلة نصية) - إجراء الارتداد (مثال: `"reject"`)
* `message` (سلسلة نصية) - سبب الارتداد (مثال: `"Message Sender Blocked By Receiving Server"`)
* `category` (سلسلة نصية) - فئة الارتداد (مثال: `"block"`)
* `code` (رقم) - رمز حالة الارتداد (مثال: `554`)
* `status` (سلسلة نصية) - رمز الارتداد من رسالة الرد (مثال: `5.7.1`)
* `line` (رقم) - رقم السطر المُحلَّل، إن وُجد، [من قائمة تحليل الارتداد الخاصة بـ Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (مثال: `526`)
* `headers` (كائن) - زوج من رؤوس البريد الإلكتروني الصادر ذي القيمة الرئيسية
* `bounced_at` (سلسلة نصية) - تاريخ حدوث خطأ الارتداد بتنسيق [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601)

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

فيما يلي بعض الملاحظات الإضافية المتعلقة بخطافات الويب المرتدة:

* إذا كانت حمولة خطاف الويب تحتوي على قيمة `list_id`، أو `list_unsubscribe`، أو `feedback_id`، فعليك اتخاذ الإجراء المناسب لإزالة `recipient` من القائمة إذا لزم الأمر.

* إذا كانت قيمة `bounce.category` إحدى القيم التالية `"block"`، أو `"recipient"`، أو `"spam"`، أو `"virus"`، فعليك بالتأكيد إزالة المستخدم من القائمة.
* إذا كنت بحاجة إلى التحقق من حمولات خطاف الويب (للتأكد من أنها قادمة بالفعل من خادمنا)، فيمكنك [حل عنوان IP للعميل البعيد واسم مضيف العميل باستخدام البحث العكسي](https://nodejs.org/api/dns.html#dnspromisesreverseip) - يجب أن يكون `smtp.forwardemail.net`.
* يمكنك أيضًا التحقق من عنوان IP مقابل [عناوين IP المنشورة لدينا](#what-are-your-servers-ip-addresses).
* انتقل إلى حسابي ← النطاقات ← الإعدادات ← مفتاح التحقق من حمولة توقيع خطاف الويب للحصول على مفتاح خطاف الويب الخاص بك.
* يمكنك تغيير هذا المفتاح في أي وقت لأسباب أمنية.
* احسب وقارن قيمة `X-Webhook-Signature` من طلب خطاف الويب الخاص بنا مع قيمة النص المحسوبة باستخدام هذا المفتاح. يتوفر مثال على كيفية القيام بذلك على [هذه التدوينة من Stack Overflow](https://stackoverflow.com/a/68885281).
* راجع المناقشة على <https://github.com/forwardemail/free-email-forwarding/issues/235> لمزيد من المعلومات.
* سننتظر حتى `5` ثانية حتى تستجيب نقطة نهاية خطاف الويب لديك برمز حالة `200`، وسنعيد المحاولة حتى `1` مرة.
* إذا اكتشفنا وجود خطأ في عنوان URL لخطاف الويب المرتد أثناء محاولتنا إرسال طلب إليه، فسنرسل إليك بريدًا إلكترونيًا مجانيًا مرة واحدة أسبوعيًا.

### هل تدعم خطافات الويب {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
هل تبحث عن وثائق حول خطافات الويب المرتدة؟ راجع <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">هل تدعمون خطافات الويب المرتدة؟</a> لمزيد من المعلومات.
<span>
</span>
</div>

نعم، أضفنا هذه الميزة اعتبارًا من ١٥ مايو ٢٠٢٠. يمكنك ببساطة إضافة خطاف ويب (خطافات ويب) كما تفعل مع أي مستلم! يُرجى التأكد من إضافة بروتوكول "http" أو "https" في عنوان URL الخاص بخطاف الويب.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">

حماية خصوصية مُحسّنة:
</strong>
<span>
إذا كنت مشتركًا في باقة مدفوعة (تتميز بحماية خصوصية مُحسّنة)، يُرجى الانتقال إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> والنقر على "الأسماء المستعارة" بجوار نطاقك لتكوين خطافات الويب. لمعرفة المزيد عن الباقات المدفوعة، يُرجى زيارة صفحة <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">الأسعار</a>. أو يُمكنك متابعة التعليمات أدناه.
</span>
</div>

إذا كنت تستخدم الخطة المجانية، فما عليك سوى إضافة سجل DNS جديد <strong class="notranslate">TXT</strong> كما هو موضح أدناه:

على سبيل المثال، إذا كنت أريد إعادة توجيه جميع رسائل البريد الإلكتروني التي تذهب إلى `alias@example.com` إلى نقطة نهاية اختبار جديدة [صندوق الطلبات](https://requestbin.com/r/en8pfhdgcculn?inspect):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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

أو ربما تريد إعادة توجيه جميع رسائل البريد الإلكتروني التي تذهب إلى `example.com` إلى نقطة النهاية هذه:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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

**فيما يلي ملاحظات إضافية بخصوص خطافات الويب:**

* إذا كنت بحاجة إلى التحقق من حمولات خطاف الويب (للتأكد من أنها قادمة بالفعل من خادمنا)، فيمكنك [حل عنوان IP للعميل البعيد واسم مضيف العميل باستخدام البحث العكسي](https://nodejs.org/api/dns.html#dnspromisesreverseip) - يجب أن يكون إما `mx1.forwardemail.net` أو `mx2.forwardemail.net`.
* يمكنك أيضًا التحقق من عنوان IP مقابل [عناوين IP المنشورة لدينا](#what-are-your-servers-ip-addresses).
* إذا كنت مشتركًا في باقة مدفوعة، فانتقل إلى حسابي ← النطاقات ← الإعدادات ← مفتاح التحقق من حمولة توقيع خطاف الويب للحصول على مفتاح خطاف الويب الخاص بك.
* يمكنك تغيير هذا المفتاح في أي وقت لأسباب أمنية.
* احسب وقارن قيمة `X-Webhook-Signature` من طلب خطاف الويب الخاص بنا مع قيمة النص المحسوبة باستخدام هذا المفتاح. يتوفر مثال على كيفية القيام بذلك على [هذه التدوينة من Stack Overflow](https://stackoverflow.com/a/68885281).
* راجع المناقشة على <https://github.com/forwardemail/free-email-forwarding/issues/235> لمزيد من المعلومات.
* إذا لم يستجب خطاف الويب برمز الحالة `200`، فسنخزن استجابته في [تم إنشاء سجل الأخطاء](#do-you-store-error-logs) - وهو أمر مفيد لتصحيح الأخطاء.
* ستُعاد محاولة طلبات HTTP لخطاف الويب حتى 3 مرات في كل محاولة اتصال SMTP، مع مهلة زمنية قصوى تبلغ 60 ثانية لكل طلب POST لنقطة النهاية. **ملاحظة: هذا لا يعني إعادة المحاولة 3 مرات فقط**، بل سيُعاد المحاولة باستمرار بمرور الوقت عن طريق إرسال رمز SMTP 421 (الذي يُشير إلى إعادة المحاولة لاحقًا) بعد محاولة طلب HTTP POST الفاشلة الثالثة. هذا يعني أن البريد الإلكتروني سيُعاد المحاولة باستمرار لعدة أيام حتى يتم الوصول إلى رمز الحالة 200.
* سنعيد المحاولة تلقائيًا بناءً على الحالة الافتراضية ورموز الخطأ المستخدمة في [طريقة إعادة المحاولة للوكيل الفائق](https://ladjs.github.io/superagent/#retrying-requests) (نحن المشرفون).
* نقوم بتجميع طلبات HTTP لخطاف الويب إلى نفس نقطة النهاية في طلب واحد بدلاً من عدة طلبات لتوفير الموارد وتسريع وقت الاستجابة. على سبيل المثال، إذا أرسلت بريدًا إلكترونيًا إلى <webhook1@example.com> و<webhook2@example.com> و<webhook3@example.com>، وكانت جميعها مُهيأة للوصول إلى نفس عنوان URL لنقطة النهاية *الدقيقة*، فسيتم إرسال طلب واحد فقط. نقوم بالتجميع بناءً على مطابقة نقطة النهاية الدقيقة مع مراعاة المساواة التامة.
* لاحظ أننا نستخدم دالة "simpleParser" في مكتبة [محلل البريد](https://nodemailer.com/extras/mailparser/) لتحليل الرسالة إلى كائن متوافق مع JSON.
* قيمة البريد الإلكتروني الخام كسلسلة نصية تُعطى كخاصية "raw".
* تُعرَض نتائج المصادقة بالخصائص "dkim" و"spf" و"arc" و"dmarc" و"bimi".
* تُعرَض رؤوس البريد الإلكتروني المُحلَّلة بالخاصية "headers"، ولكن يُرجى أيضًا ملاحظة أنه يُمكن استخدام "headerLines" لتسهيل التكرار والتحليل.
* تُجمَّع مُستلِمو هذا الخطاف الشبكي معًا وتُعرَض بالخاصية "recipients".
* تُعرَض معلومات جلسة SMTP بالخاصية "session". تحتوي هذه الخاصية على معلومات حول مُرسِل الرسالة، ووقت وصولها، وHELO، واسم مُضيف العميل. قيمة اسم مُضيف العميل، وهي `session.clientHostname`، إما أن تكون اسم المجال المؤهل بالكامل (FQDN) (من بحث PTR عكسي) أو `session.remoteAddress` مُحاطة بأقواس (مثل `"[127.0.0.1]"`).
* إذا كنت بحاجة إلى طريقة سريعة للحصول على قيمة `X-Original-To`، فيمكنك استخدام قيمة `session.recipient` (انظر المثال أدناه). رأس الرسالة `X-Original-To` هو رأس نضيفه إلى الرسائل لتصحيح الأخطاء مع المستلم الأصلي (قبل إعادة التوجيه المقنع). * إذا كنت بحاجة إلى إزالة الخاصيتين `attachments` و/أو `raw` من نص الحمولة، فما عليك سوى إضافة `?attachments=false` أو `?raw=false` أو `?attachments=false&raw=false` إلى نقطة نهاية خطاف الويب كمعامل سلسلة استعلام (مثل `https://example.com/webhook?attachments=false&raw=false`).
* إذا كانت هناك مرفقات، فسيتم إضافتها إلى مصفوفة `attachments` مع قيم المخزن المؤقت. يمكنك تحليلها وتحويلها إلى محتوى باستخدام طريقة في جافا سكريبت مثل:

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
نصيحة:
</strong>
هل ترغب بمعرفة شكل طلب خطاف الويب من رسائل البريد الإلكتروني المُعاد توجيهها؟ أرفقنا لك مثالاً أدناه!
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

### هل تدعم التعبيرات العادية أو التعبيرات العادية؟ {#do-you-support-regular-expressions-or-regex}

نعم، أضفنا هذه الميزة اعتبارًا من ٢٧ سبتمبر ٢٠٢١. يمكنك ببساطة كتابة تعبيرات عادية ("regex") لمطابقة الأسماء المستعارة وإجراء عمليات الاستبدال.

الأسماء المستعارة المدعومة بالتعابير العادية هي تلك التي تبدأ بـ `/` وتنتهي بـ `/`، ومستلموها هم عناوين البريد الإلكتروني أو خطافات الويب. يمكن للمستلمين أيضًا تضمين دعم استبدال التعابير العادية (مثل `$1` و `$2`).

ندعم علامتي تعبير عادي، وهما `i` و`g`. علم عدم حساسية الأحرف `i` هو علم افتراضي دائم، ويتم تطبيقه دائمًا. يمكنك إضافة العلم العالمي `g` بإضافة النهاية `/` إلى `/g`.

لاحظ أننا ندعم أيضًا <a href="#can-i-disable-specific-aliases">disabled alias feature</a> لجزء المستلم من خلال دعمنا لـ regex.

لا يتم دعم التعبيرات العادية على <a href="/disposable-addresses" target="_blank">المجالات العالمية</a> (حيث يمكن أن يكون هذا بمثابة ثغرة أمنية).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">

حماية خصوصية مُحسّنة:
</strong>
<span>
إذا كنت مشتركًا في باقة مدفوعة (تتميز بحماية خصوصية مُحسّنة)، يُرجى الانتقال إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> والنقر على "الأسماء المستعارة" بجوار نطاقك لتكوين التعبيرات العادية. لمعرفة المزيد عن الباقات المدفوعة، يُرجى زيارة صفحة <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">الأسعار</a>. أو يُمكنك متابعة التعليمات أدناه.
</span>
</div>

إذا كنت تستخدم الخطة المجانية، فما عليك سوى إضافة سجل DNS جديد <strong class="notranslate">TXT</strong> باستخدام واحد أو أكثر من الأمثلة المقدمة أدناه:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>مثال بسيط:</strong> إذا أردتُ إعادة توجيه جميع رسائل البريد الإلكتروني المرسلة إلى `linus@example.com` أو `torvalds@example.com` إلى `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
<strong>مثال على استبدال الاسم الأول واسم العائلة:</strong> تخيل أن جميع عناوين البريد الإلكتروني لشركتك تتبع النمط `firstname.lastname@example.com`. إذا أردتُ إعادة توجيه جميع رسائل البريد الإلكتروني التي تتبع النمط `firstname.lastname@example.com` إلى `firstname.lastname@company.com` مع دعم الاستبدال (<a href="https://regexr.com/66hnu" class="alert-link">عرض الاختبار على RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
<strong>مثال على استبدال فلترة رمز الزائد:</strong> إذا أردتُ إعادة توجيه جميع رسائل البريد الإلكتروني المرسلة إلى `info@example.com` أو `support@example.com` إلى `user+info@gmail.com` أو `user+support@gmail.com` على التوالي (مع دعم الاستبدال) (<a href="https://regexr.com/66ho7" class="alert-link">عرض الاختبار على RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
<strong>مثال على استبدال سلسلة استعلام خطاف الويب:</strong> ربما ترغب في أن تنتقل جميع رسائل البريد الإلكتروني التي تصل إلى `example.com` إلى <a href="#do-you-support-webhooks" class="alert-link">خطاف ويب</a> وأن يكون مفتاح سلسلة استعلام ديناميكي "to" بقيمة اسم المستخدم في عنوان البريد الإلكتروني (<a href="https://regexr.com/66ho4" class="alert-link">عرض الاختبار على RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
<strong>مثال على الرفض الهادئ:</strong> إذا كنت ترغب في تعطيل جميع رسائل البريد الإلكتروني التي تتوافق مع نمط معين ورفضها بهدوء (تبدو للمرسل كما لو أن الرسالة أُرسلت بنجاح، لكنها في الواقع لا تصل إلى أي مكان) مع رمز الحالة `250` (انظر <a href="#can-i-disable-specific-aliases" class="alert-link">هل يمكنني تعطيل أسماء مستعارة معينة</a>)، فاستخدم ببساطة نفس الأسلوب مع علامة تعجب واحدة "!". هذا يُشير إلى المرسل أن الرسالة قد وصلت بنجاح، لكنها في الواقع لا تصل إلى أي مكان (مثل blackhole أو `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
<strong>مثال على الرفض المؤقت:</strong> إذا كنت ترغب في تعطيل جميع رسائل البريد الإلكتروني التي تُطابق نمطًا مُعينًا، ورفضها مؤقتًا برمز الحالة `421` (انظر <a href="#can-i-disable-specific-aliases" class="alert-link">هل يُمكنني تعطيل أسماء مستعارة مُحددة</a>)، فما عليك سوى استخدام نفس الأسلوب مع علامة تعجب مزدوجة "!!". يُشير هذا إلى مُرسِل الرسالة لإعادة محاولة إرسال بريده الإلكتروني، وسيتم إعادة محاولة إرسال الرسائل المُرسَلة إلى هذا الاسم المستعار لمدة 5 أيام تقريبًا، ثم سيتم رفضها نهائيًا.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
<strong>مثال على الرفض النهائي:</strong> إذا كنت ترغب في تعطيل جميع رسائل البريد الإلكتروني التي تُطابق نمطًا مُعينًا، ورفضها نهائيًا برمز الحالة `550` (انظر <a href="#can-i-disable-specific-aliases" class="alert-link">هل يُمكنني تعطيل أسماء مستعارة مُحددة</a>)، فما عليك سوى استخدام نفس الأسلوب مع علامة تعجب ثلاثية "!!!". يُشير هذا إلى وجود خطأ دائم في الرسائل، ولن تُعاد مُحاولة إرسالها، وسيتم رفضها لهذا الاسم المستعار.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
هل ترغب في معرفة كيفية كتابة تعبير نمطي أو اختبار بديله؟ يمكنك زيارة موقع اختبار التعبيرات النمطية المجاني <a href="https://regexr.com" class="alert-link">RegExr</a> على <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### ما هي حدود SMTP الصادرة لديك؟ {#what-are-your-outbound-smtp-limits}

نحدد للمستخدمين والنطاقات الحد الأقصى المسموح به لرسائل SMTP الصادرة يوميًا بـ 300 رسالة. هذا يعني في المتوسط أكثر من 9000 رسالة بريد إلكتروني شهريًا. إذا كنت بحاجة إلى تجاوز هذا العدد أو لديك رسائل بريد إلكتروني كبيرة باستمرار، فيُرجى [اتصل بنا](https://forwardemail.net/help).

### هل أحتاج إلى موافقة لتمكين SMTP {#do-i-need-approval-to-enable-smtp}

نعم، يُرجى العلم أنه للحفاظ على سمعة IP وضمان سهولة التسليم، تُجري Forward Email عملية مراجعة يدوية لكل نطاق لموافقة SMTP الصادرة. راسل <support@forwardemail.net> أو افتح [طلب المساعدة](https://forwardemail.net/help) للموافقة. عادةً ما يستغرق هذا أقل من 24 ساعة، ويتم الرد على معظم الطلبات خلال ساعة إلى ساعتين. نهدف قريبًا إلى جعل هذه العملية فورية من خلال ضوابط إضافية للرسائل غير المرغوب فيها والتنبيهات. تضمن هذه العملية وصول رسائلك إلى صندوق الوارد وعدم تصنيفها كرسائل غير مرغوب فيها.

### ما هي إعدادات تكوين خادم SMTP الخاص بك {#what-are-your-smtp-server-configuration-settings}

خادمنا هو `smtp.forwardemail.net` ويتم مراقبته أيضًا على <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">صفحة الحالة</a> الخاصة بنا.

إنه يدعم كل من IPv4 و IPv6 ومتاح عبر المنافذ `465` و `2465` لـ SSL/TLS و `587` و `2587` و `2525` و `25` لـ TLS (STARTTLS).

| بروتوكول | اسم المضيف | الموانئ | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **مفضل** | `smtp.forwardemail.net` | `465`, `2465` | :علامة_التحقق_البيضاء: | :علامة_التحقق_البيضاء: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :علامة_التحقق_البيضاء: | :علامة_التحقق_البيضاء: |

| تسجيل الدخول | مثال | وصف |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| اسم المستخدم | `user@example.com` | عنوان البريد الإلكتروني للاسم المستعار الموجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>. |
| كلمة المرور | `************************` | كلمة مرور تم إنشاؤها خصيصًا للاسم المستعار. |

لإرسال بريد إلكتروني صادر باستخدام SMTP، يجب أن يكون **مستخدم SMTP** هو عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> - ويجب أن تكون **كلمة مرور SMTP** كلمة مرور تم إنشاؤها خصيصًا للاسم المستعار.

يرجى الرجوع إلى [هل تدعم إرسال البريد الإلكتروني باستخدام SMTP؟](#do-you-support-sending-email-with-smtp) للحصول على تعليمات خطوة بخطوة.

### ما هي إعدادات تكوين خادم IMAP الخاص بك {#what-are-your-imap-server-configuration-settings}

خادمنا هو `imap.forwardemail.net` ويتم مراقبته أيضًا على <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">صفحة الحالة</a> الخاصة بنا.

إنه يدعم كل من IPv4 و IPv6 ومتاح عبر المنفذين `993` و `2993` لـ SSL/TLS.

| بروتوكول | اسم المضيف | الموانئ | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **مفضل** | `imap.forwardemail.net` | `993`, `2993` | :علامة_التحقق_البيضاء: | :علامة_التحقق_البيضاء: |

| تسجيل الدخول | مثال | وصف |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| اسم المستخدم | `user@example.com` | عنوان البريد الإلكتروني للاسم المستعار الموجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>. |
| كلمة المرور | `************************` | كلمة مرور تم إنشاؤها خصيصًا للاسم المستعار. |

للاتصال بـ IMAP، يجب أن يكون **مستخدم IMAP** هو عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> - ويجب أن تكون **كلمة مرور IMAP** كلمة مرور تم إنشاؤها خصيصًا للاسم المستعار.

يرجى الرجوع إلى [هل تدعم تلقي البريد الإلكتروني باستخدام IMAP؟](#do-you-support-receiving-email-with-imap) للحصول على تعليمات خطوة بخطوة.

### ما هي إعدادات تكوين خادم POP3 الخاص بك {#what-are-your-pop3-server-configuration-settings}

خادمنا هو `pop3.forwardemail.net` ويتم مراقبته أيضًا على <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">صفحة الحالة</a> الخاصة بنا.

إنه يدعم كل من IPv4 و IPv6 ومتاح عبر المنفذين `995` و `2995` لـ SSL/TLS.

| بروتوكول | اسم المضيف | الموانئ | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **مفضل** | `pop3.forwardemail.net` | `995`, `2995` | :علامة_التحقق_البيضاء: | :علامة_التحقق_البيضاء: |

| تسجيل الدخول | مثال | وصف |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| اسم المستخدم | `user@example.com` | عنوان البريد الإلكتروني للاسم المستعار الموجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>. |
| كلمة المرور | `************************` | كلمة مرور تم إنشاؤها خصيصًا للاسم المستعار. |

للاتصال بـ POP3، يجب أن يكون **مستخدم POP3** هو عنوان البريد الإلكتروني لاسم مستعار موجود للنطاق في <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> - ويجب أن تكون **كلمة مرور IMAP** كلمة مرور تم إنشاؤها خصيصًا للاسم المستعار.

يرجى الرجوع إلى [هل تدعم POP3](#do-you-support-pop3) للحصول على تعليمات خطوة بخطوة.

### تكوين Postfix SMTP Relay {#postfix-smtp-relay-configuration}

يمكنك تهيئة Postfix لإعادة توجيه رسائل البريد الإلكتروني عبر خوادم SMTP التابعة لـ Forward Email. هذا مفيد لتطبيقات الخادم التي تحتاج إلى إرسال رسائل بريد إلكتروني.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">الوقت المُقدّر للإعداد:</strong>
<span>أقل من ١٥ دقيقة</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
يتطلب هذا اشتراكًا مدفوعًا مع تفعيل وصول SMTP.
</span>
</div>

#### التثبيت {#installation}

1. قم بتثبيت Postfix على الخادم الخاص بك:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. أثناء التثبيت، حدد "موقع الإنترنت" عند مطالبتك بنوع التكوين.

#### التكوين {#configuration}

1. قم بتعديل ملف تكوين Postfix الرئيسي:

```bash
sudo nano /etc/postfix/main.cf
```

2. إضافة أو تعديل هذه الإعدادات:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. إنشاء ملف كلمة مرور SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. أضف بيانات اعتماد إعادة توجيه البريد الإلكتروني الخاصة بك:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. تأمين ملف كلمة المرور وتجزئته:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. إعادة تشغيل Postfix:

```bash
sudo systemctl restart postfix
```

#### اختبار {#testing}

اختبر تكوينك عن طريق إرسال بريد إلكتروني اختباري:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## الأمان {#security}

### تقنيات تقوية الخادم المتقدمة {#advanced-server-hardening-techniques}

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

تطبق Forward Email العديد من تقنيات تقوية الخادم لضمان أمان البنية التحتية لدينا وبياناتك:

١. **أمن الشبكات**:
* جدار حماية لجداول عناوين IP بقواعد صارمة
* نظام Fail2ban للحماية من هجمات القوة الغاشمة
* عمليات تدقيق أمنية واختبار اختراق منتظمة
* وصول إداري عبر VPN فقط

٢. **تعزيز النظام**:
* تثبيت حزمة بسيطة
* تحديثات أمنية منتظمة
* SELinux في وضع الإنفاذ
* تعطيل وصول الجذر عبر SSH
* المصادقة القائمة على المفتاح فقط

٣. **أمان التطبيق**:
* رؤوس سياسة أمان المحتوى (CSP)
* أمان النقل الصارم لـ HTTPS (HSTS)
* رؤوس حماية XSS
* رؤوس خيارات الإطار ورؤوس سياسة المُحيل
* عمليات تدقيق دورية للتبعيات

٤. **حماية البيانات**:
* تشفير كامل للقرص باستخدام LUKS
* إدارة آمنة للمفاتيح
* نسخ احتياطية منتظمة مع التشفير
* ممارسات تقليل البيانات

٥. **المراقبة والاستجابة**:
* كشف التسلل في الوقت الفعلي
* فحص أمني آلي
* تسجيل وتحليل مركزي
* إجراءات الاستجابة للحوادث

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### هل لديك شهادات SOC 2 أو ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

لا تحمل خدمة "إعادة توجيه البريد الإلكتروني" شهادات SOC 2 Type II أو ISO 27001 مباشرةً. مع ذلك، تعمل الخدمة على بنية تحتية توفرها معالجات فرعية معتمدة:

* **DigitalOcean**: حاصل على شهادة SOC 2 Type II وSOC 3 Type II (خضعت للتدقيق من قِبل Schellman & Company LLC)، وشهادة ISO 27001 في العديد من مراكز البيانات. التفاصيل: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: حاصل على شهادة SOC 2+ (HIPAA)، وشهادات ISO/IEC: 20000-1:2018، 27001:2022، 27017:2015، 27018:2019. التفاصيل: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: متوافق مع معيار SOC 2 (تواصل مع DataPacket مباشرةً للحصول على الشهادة)، مزود بنية تحتية على مستوى المؤسسات (موقع دنفر). التفاصيل: <https://www.datapacket.com/datacenters/denver>

تتبع Forward Email أفضل ممارسات الصناعة في عمليات تدقيق الأمان، وتتعاون بانتظام مع باحثين أمنيين مستقلين. المصدر: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### هل تستخدم تشفير TLS لإعادة توجيه البريد الإلكتروني؟ {#do-you-use-tls-encryption-for-email-forwarding}

نعم. يُطبّق تطبيق Forward Email بروتوكول TLS الإصدار 1.2+‎ بشكل صارم على جميع الاتصالات (HTTPS، SMTP، IMAP، POP3) ويُطبّق بروتوكول MTA-STS لدعم TLS مُحسّن. يتضمن التطبيق ما يلي:

* تطبيق TLS 1.2+ لجميع اتصالات البريد الإلكتروني.
* تبادل مفاتيح ECDHE (منحنى بيضاوي ديفي-هيلمان سريع الزوال) لضمان سرية تامة.
* مجموعات تشفير حديثة مع تحديثات أمنية منتظمة.
* دعم HTTP/2 لتحسين الأداء والأمان.
* HSTS (أمان نقل HTTP الصارم) مع التحميل المسبق في المتصفحات الرئيسية.
* **أمان نقل البريد الصارم لوكيل نقل البريد (MTA-STS)** لتطبيق TLS صارم.

المصدر: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**تطبيق MTA-STS**: يُطبّق نظام إعادة توجيه البريد الإلكتروني تطبيقًا صارمًا لمعايير MTA-STS في قاعدة البيانات. عند حدوث أخطاء TLS وتطبيق MTA-STS، يُعيد النظام رموز حالة SMTP 421 لضمان إعادة إرسال رسائل البريد الإلكتروني لاحقًا بدلًا من تسليمها بشكل غير آمن. تفاصيل التطبيق:

* اكتشاف خطأ TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* تطبيق MTA-STS في مساعد إرسال البريد الإلكتروني: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

التحقق من صحة الطرف الثالث: <https://www.hardenize.com/report/forwardemail.net/1750312779> يعرض تقييمات "جيدة" لجميع إجراءات أمان النقل وTLS.

### هل تحافظ على رؤوس مصادقة البريد الإلكتروني؟ {#do-you-preserve-email-authentication-headers}

نعم. يُطبّق Forward Email عناوين مصادقة البريد الإلكتروني ويحافظ عليها بشكل شامل:

* **SPF (إطار عمل سياسة المُرسِل)**: مُنفَّذ ومُحافظ عليه بشكل صحيح.
* **DKIM (البريد المُعرَّف بمفاتيح النطاق)**: دعم كامل مع إدارة مفاتيح سليمة.
* **DMARC**: تطبيق السياسة على رسائل البريد الإلكتروني التي تفشل في التحقق من صحة SPF أو DKIM.
* **ARC**: على الرغم من عدم توضيحها بشكل صريح، إلا أن درجات الامتثال المثالية للخدمة تُشير إلى معالجة شاملة لرؤوس المصادقة.

المصدر: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

التحقق: أظهر اختبار بريد Internet.nl درجة 100/100 خاصة بتطبيقات "SPF وDKIM وDMARC". يؤكد تقييم Hardenize حصوله على تقييم "جيد" لتطبيقات SPF وDMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### هل تحافظ على عناوين البريد الإلكتروني الأصلية وتمنع التزييف؟ {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

يحافظ Forward Email على عناوين البريد الإلكتروني الأصلية مع تنفيذ حماية شاملة ضد التزييف من خلال قاعدة بيانات MX:

* **حفظ الرؤوس**: يتم الاحتفاظ برؤوس المصادقة الأصلية أثناء إعادة التوجيه.
* **مكافحة انتحال الهوية**: يمنع تطبيق سياسة DMARC انتحال الرؤوس من خلال رفض رسائل البريد الإلكتروني التي تفشل في التحقق من صحة SPF أو DKIM.
* **منع حقن الرؤوس**: التحقق من صحة المدخلات وتعقيمها باستخدام مكتبة striptags.
* **الحماية المتقدمة**: كشف متطور عن التصيد الاحتيالي مع أنظمة كشف الانتحال ومنع انتحال الهوية وإشعار المستخدم.

**تفاصيل تنفيذ MX**: يتم التعامل مع منطق معالجة البريد الإلكتروني الأساسي بواسطة قاعدة بيانات خادم MX، على وجه التحديد:

* معالج بيانات MX الرئيسي: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* تصفية عشوائية للبريد الإلكتروني (مكافحة انتحال الهوية): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

ينفذ المساعد `isArbitrary` قواعد متطورة لمكافحة التصيد الاحتيالي بما في ذلك اكتشاف انتحال هوية المجال والعبارات المحظورة وأنماط التصيد المختلفة.

المصدر: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### كيف تحمي نفسك من البريد العشوائي والإساءة؟ {#how-do-you-protect-against-spam-and-abuse}

ينفذ Forward Email حماية شاملة متعددة الطبقات:

* **تحديد المعدل**: يُطبّق على محاولات المصادقة، ونقاط نهاية واجهة برمجة التطبيقات (API)، واتصالات SMTP.
* **عزل الموارد**: بين المستخدمين لمنع تأثير المستخدمين ذوي الاستخدام الكثيف.
* **حماية DDoS**: حماية متعددة الطبقات من خلال نظامي DataPacket Shield وCloudflare.
* **التوسع التلقائي**: تعديل ديناميكي للموارد بناءً على الطلب.
* **منع إساءة الاستخدام**: فحوصات خاصة بالمستخدم لمنع إساءة الاستخدام، وحظر قائم على التجزئة للمحتوى الضار.
* **مصادقة البريد الإلكتروني**: بروتوكولات SPF وDKIM وDMARC مع كشف متقدم للتصيد الاحتيالي.

مصادر:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (تفاصيل حماية DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### هل تقوم بتخزين محتوى البريد الإلكتروني على القرص {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

* **بنية المعرفة الصفرية**: صناديق بريد SQLite المشفرة بشكل فردي تعني أن خدمة إعادة توجيه البريد الإلكتروني لا يمكنها الوصول إلى محتوى البريد الإلكتروني.
* **المعالجة في الذاكرة**: تتم معالجة البريد الإلكتروني بالكامل في الذاكرة، مما يتجنب تخزين البيانات على القرص.
* **عدم تسجيل المحتوى**: "لا نسجل أو نخزن محتوى البريد الإلكتروني أو بياناته الوصفية على القرص".
* **التشفير المعزول**: لا تُخزّن مفاتيح التشفير على القرص كنص عادي.

**دليل قاعدة بيانات MX**: يُعالج خادم MX رسائل البريد الإلكتروني بالكامل في الذاكرة دون كتابة أي محتوى على القرص. يُظهر مُعالج البريد الإلكتروني الرئيسي هذا النهج في الذاكرة: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

مصادر:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (ملخص)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (تفاصيل المعرفة الصفرية)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (تشفير معزول)

### هل يمكن عرض محتوى البريد الإلكتروني أثناء تعطل النظام؟ {#can-email-content-be-exposed-during-system-crashes}

لا. تطبق خدمة Forward Email ضمانات شاملة ضد تعرض البيانات المرتبطة بالأعطال:

* **تعطيل تفريغات النواة**: يمنع تعريض الذاكرة للخطر أثناء الأعطال.
* **تعطيل ذاكرة المبادلة**: معطل تمامًا لمنع استخراج البيانات الحساسة من ملفات المبادلة.
* **بنية الذاكرة الداخلية**: يتواجد محتوى البريد الإلكتروني فقط في الذاكرة غير المستقرة أثناء المعالجة.
* **حماية مفتاح التشفير**: لا تُخزَّن المفاتيح على القرص كنص عادي.
* **الأمان المادي**: تمنع أقراص LUKS v2 المشفرة الوصول المادي إلى البيانات.
* **تعطيل تخزين USB**: يمنع استخراج البيانات غير المصرح به.

**معالجة الأخطاء الخاصة بمشكلات النظام**: يستخدم Forward Email وظائف المساعدة `isCodeBug` و `isTimeoutError` لضمان أنه في حالة حدوث أي مشكلات في اتصال قاعدة البيانات أو مشكلات في شبكة DNS/قائمة الحظر أو مشكلات في الاتصال الصاعد، يقوم النظام بإرجاع رموز حالة SMTP 421 لضمان إعادة محاولة إرسال رسائل البريد الإلكتروني لاحقًا بدلاً من فقدها أو عرضها.

تفاصيل التنفيذ:

* تصنيف الخطأ: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* معالجة خطأ انتهاء المهلة في معالجة MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

المصدر: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### من لديه حق الوصول إلى البنية التحتية لبريدك الإلكتروني {#who-has-access-to-your-email-infrastructure}

تطبق Forward Email ضوابط وصول شاملة لفريق الهندسة الذي يتكون من 2-3 أشخاص مع متطلبات 2FA صارمة:

* **التحكم في الوصول القائم على الأدوار**: لحسابات الفريق ذات الأذونات القائمة على الموارد
* **مبدأ الحد الأدنى من الامتيازات**: يُطبق في جميع الأنظمة
* **فصل المهام**: بين الأدوار التشغيلية
* **إدارة المستخدمين**: فصل مستخدمي النشر ومستخدمي التطوير بصلاحيات مختلفة
* **تعطيل تسجيل الدخول الجذري**: فرض الوصول من خلال حسابات مُصادق عليها بشكل صحيح
* **التحقق الثنائي الصارم**: لا يوجد مصادقة ثنائية عبر الرسائل النصية القصيرة بسبب خطر هجمات MITM - فقط رموز التطبيقات أو الأجهزة
* **تسجيل التدقيق الشامل**: مع حذف البيانات الحساسة
* **الكشف التلقائي عن الشذوذ**: لأنماط الوصول غير المعتادة
* **مراجعات أمنية دورية**: لسجلات الوصول
* **منع هجوم الخادمة الشريرة**: تعطيل وحدة تخزين USB وإجراءات أمنية مادية أخرى

مصادر:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (ضوابط التفويض)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (أمان الشبكة)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (منع هجوم الخادمة الشريرة)

### ما هي مزودي البنية التحتية التي تستخدمها؟ {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

التفاصيل الكاملة متاحة على صفحة الامتثال لـ GDPR الخاصة بنا: <https://forwardemail.net/gdpr>

**معالجات البنية التحتية الأساسية الفرعية:**

| مزود | إطار عمل خصوصية البيانات المعتمد | صفحة الامتثال لقانون حماية البيانات العامة (GDPR) |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **كلاود فلير** | ✅ نعم | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **حزمة البيانات** | ❌ لا | <https://www.datapacket.com/privacy-policy> |
| **المحيط الرقمي** | ❌ لا | <https://www.digitalocean.com/legal/gdpr> |
| **فولتر** | ❌ لا | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**الشهادات التفصيلية:**

**المحيط الرقمي**

* SOC 2 النوع الثاني وSOC 3 النوع الثاني (تم تدقيقهما من قِبل شركة Schellman & Company LLC)
* حاصل على شهادة ISO 27001 في مراكز بيانات متعددة
* متوافق مع PCI-DSS
* حاصل على شهادة CSA STAR المستوى 1
* حاصل على شهادة APEC CBPR PRP
* التفاصيل: <https://www.digitalocean.com/trust/certification-reports>

**فولتر**

* حاصل على شهادة SOC 2+ (HIPAA)
* متوافق مع PCI Merchant
* حاصل على شهادة CSA STAR المستوى 1
* ISO/IEC 20000-1:2018، 27001:2022، 27017:2015، 27018:2019
* التفاصيل: <https://www.vultr.com/legal/compliance/>

**حزمة البيانات**

* متوافق مع معيار SOC 2 (تواصل مع DataPacket مباشرةً للحصول على الشهادة)
* بنية تحتية بمستوى المؤسسات (موقع دنفر)
* حماية من هجمات حجب الخدمة الموزعة (DDoS) من خلال حزمة Shield للأمن السيبراني
* دعم فني على مدار الساعة طوال أيام الأسبوع
* شبكة عالمية تغطي 58 مركز بيانات
* التفاصيل: <https://www.datapacket.com/datacenters/denver>

**معالجات الدفع:**

* **Stripe**: معتمد من إطار عمل خصوصية البيانات - <https://stripe.com/legal/privacy-center>
* **PayPal**: غير معتمد من إطار عمل خصوصية البيانات - <https://www.paypal.com/uk/legalhub/privacy-full>

### هل تقدم اتفاقية معالجة البيانات (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

نعم، تقدم Forward Email اتفاقية شاملة لمعالجة البيانات (DPA) يمكن توقيعها مع اتفاقية مؤسستنا. تتوفر نسخة من اتفاقية معالجة البيانات (DPA) على الرابط التالي: <https://forwardemail.net/dpa>

**تفاصيل وكالة حماية البيانات:**

* يشمل الامتثال للوائح حماية البيانات العامة (GDPR) وأطر عمل درع الخصوصية بين الاتحاد الأوروبي والولايات المتحدة/سويسرا والولايات المتحدة.
* يُقبل تلقائيًا عند الموافقة على شروط الخدمة.
* لا حاجة لتوقيع منفصل لاتفاقية معالجة البيانات القياسية.
* تتوفر ترتيبات معالجة بيانات مخصصة من خلال ترخيص المؤسسة.

**إطار الامتثال للائحة العامة لحماية البيانات:**
يُفصّل اتفاق معالجة البيانات لدينا الامتثال للائحة العامة لحماية البيانات، بالإضافة إلى متطلبات نقل البيانات الدولية. تتوفر المعلومات الكاملة على الرابط التالي: <https://forwardemail.net/gdpr>

بالنسبة لعملاء المؤسسات الذين يحتاجون إلى شروط DPA مخصصة أو ترتيبات تعاقدية محددة، فيمكن معالجة هذه الأمور من خلال برنامج **ترخيص المؤسسة (250 دولارًا أمريكيًا/الشهر)** الخاص بنا.

### كيف تتعامل مع إشعارات خرق البيانات {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

* **تعرض محدود للبيانات**: لا يمكن الوصول إلى محتوى البريد الإلكتروني المشفر بسبب بنية المعرفة الصفرية.
* **جمع بيانات محدود**: معلومات أساسية فقط للمشتركين وسجلات IP محدودة لأغراض الأمان.
* **أطر عمل المعالجات الفرعية**: تلتزم DigitalOcean وVultr بإجراءات استجابة للحوادث متوافقة مع اللائحة العامة لحماية البيانات.

**معلومات ممثل اللائحة العامة لحماية البيانات:**
عيّنت شركة Forward Email ممثلين لها وفقًا للمادة ٢٧ من اللائحة العامة لحماية البيانات:

**ممثل الاتحاد الأوروبي:**
شركة أوسانو الدولية لخدمات الامتثال المحدودة
لعناية: LFHC
3 دبلن لاندينغز، رصيف نورث وول
دبلن 1، D01C4E0

**ممثل المملكة المتحدة:**
شركة أوسانو للامتثال المحدودة في المملكة المتحدة
لعناية: LFHC
42-46 شارع فاونتن، بلفاست
أنتريم، BT1 - 5EF

بالنسبة لعملاء المؤسسات الذين يحتاجون إلى اتفاقيات مستوى الخدمة الخاصة بإشعارات الاختراق، فيجب مناقشة ذلك كجزء من اتفاقية **ترخيص المؤسسة**.

مصادر:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### هل تقدم بيئة اختبار {#do-you-offer-a-test-environment}

لا تصف الوثائق الفنية لبرنامج Forward Email صراحةً وضع الحماية المخصص. مع ذلك، تشمل أساليب الاختبار المحتملة ما يلي:

* **خيار الاستضافة الذاتية**: إمكانيات استضافة ذاتية شاملة لإنشاء بيئات اختبار.
* **واجهة برمجة التطبيقات**: إمكانية الاختبار البرمجي للتكوينات.
* **مفتوح المصدر**: شفرة مفتوحة المصدر بنسبة 100% تتيح للعملاء فحص منطق إعادة التوجيه.
* **نطاقات متعددة**: دعم نطاقات متعددة يُمكّن من إنشاء نطاق اختبار.

بالنسبة لعملاء المؤسسات الذين يحتاجون إلى إمكانيات الحماية الرسمية، فيجب مناقشة هذا الأمر كجزء من ترتيب **ترخيص المؤسسة**.

المصدر: <https://github.com/forwardemail/forwardemail.net> (تفاصيل بيئة التطوير)

### هل توفر أدوات المراقبة والتنبيه؟ {#do-you-provide-monitoring-and-alerting-tools}

يوفر البريد الإلكتروني المباشر مراقبة في الوقت الفعلي مع بعض القيود:

**متاح:**

* **مراقبة التسليم في الوقت الفعلي**: مقاييس أداء مرئية للعامة لكبار مزودي خدمات البريد الإلكتروني.
* **التنبيهات التلقائية**: يتم تنبيه فريق الهندسة عند تجاوز أوقات التسليم 10 ثوانٍ.
* **مراقبة شفافة**: أنظمة مراقبة مفتوحة المصدر بنسبة 100%.
* **مراقبة البنية التحتية**: اكتشاف تلقائي للأخطاء وتسجيل تدقيق شامل.

**القيود:**

* لا يتم توثيق خطافات الويب الموجهة للعملاء أو إشعارات حالة التسليم المستندة إلى واجهة برمجة التطبيقات بشكل صريح

بالنسبة لعملاء المؤسسات الذين يحتاجون إلى خطافات ويب لحالة التسليم التفصيلية أو تكاملات مراقبة مخصصة، قد تكون هذه الإمكانات متاحة من خلال ترتيبات **ترخيص المؤسسة**.

مصادر:

* <https://forwardemail.net> (عرض مراقبة آنية)
* <https://github.com/forwardemail/forwardemail.net> (تنفيذ المراقبة)

### كيف يمكنك ضمان التوفر العالي {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **البنية التحتية الموزعة**: مزودو خدمات متعددون (DigitalOcean، Vultr، DataPacket) عبر مناطق جغرافية مختلفة.
* **موازنة الأحمال الجغرافية**: موازنة أحمال جغرافية قائمة على Cloudflare مع إمكانية التعافي التلقائي من الأعطال.
* **التوسع التلقائي**: تعديل ديناميكي للموارد بناءً على الطلب.
* **حماية متعددة الطبقات من هجمات DDoS**: من خلال نظام DataPacket Shield وCloudflare.
* **تكرار الخوادم**: خوادم متعددة لكل منطقة مع إمكانية التعافي التلقائي من الأعطال.
* **تكرار قاعدة البيانات**: مزامنة البيانات في الوقت الفعلي عبر مواقع متعددة.
* **المراقبة والتنبيه**: مراقبة على مدار الساعة طوال أيام الأسبوع مع استجابة تلقائية للحوادث.

**الالتزام بالوقت الفعلي**: توافر خدمة بنسبة 99.9%+ مع مراقبة شفافة متاحة على <https://forwardemail.net>

مصادر:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### هل أنت متوافق مع المادة 889 من قانون تفويض الدفاع الوطني (NDAA)؟ {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

نعم، خدمة إعادة توجيه البريد الإلكتروني **متوافقة مع المادة 889**. تحظر المادة 889 من قانون تفويض الدفاع الوطني (NDAA) على الهيئات الحكومية استخدام أو التعاقد مع جهات تستخدم معدات اتصالات ومراقبة بالفيديو من شركات محددة (هواوي، وZTE، وهيكفيجن، وداهوا، وهيتيرا).

**كيف يحقق البريد الإلكتروني المباشر الامتثال للمادة 889:**

تعتمد خدمة Forward Email بشكل حصري على اثنين من مقدمي البنية التحتية الرئيسيين، ولا يستخدم أي منهما معدات محظورة بموجب القسم 889:

١. **Cloudflare**: شريكنا الرئيسي لخدمات الشبكات وأمان البريد الإلكتروني
٢. **DataPacket**: مزودنا الرئيسي للبنية التحتية للخوادم (باستخدام معدات Arista Networks وCisco حصريًا)
٣. **موفرو النسخ الاحتياطي**: تم تأكيد التزام مزودي النسخ الاحتياطي لدينا، Digital Ocean وVultr، كتابيًا بالقسم ٨٨٩.

**التزام Cloudflare**: تنص Cloudflare صراحةً في مدونة قواعد السلوك الخاصة بها على أنها لا تستخدم معدات الاتصالات أو منتجات أو خدمات مراقبة الفيديو من أي كيانات محظورة بموجب القسم 889.

**حالة استخدام حكومية**: تم التحقق من امتثالنا للمادة 889 عندما اختارت **الأكاديمية البحرية الأمريكية** خدمة Forward Email لتلبية احتياجات إعادة توجيه البريد الإلكتروني الآمنة، الأمر الذي يتطلب توثيق معايير الامتثال الفيدرالية لدينا.

للحصول على تفاصيل كاملة حول إطار عملنا للامتثال الحكومي، بما في ذلك اللوائح الفيدرالية الأوسع، اقرأ دراسة الحالة الشاملة الخاصة بنا: [خدمة البريد الإلكتروني للحكومة الفيدرالية متوافقة مع المادة 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## تفاصيل النظام والتقنية {#system-and-technical-details}

### هل تقوم بتخزين رسائل البريد الإلكتروني ومحتوياتها؟ {#do-you-store-emails-and-their-contents}

لا، نحن لا نكتب على القرص أو نخزن السجلات - باستخدام [استثناء الأخطاء](#do-you-store-error-logs) و [SMTP الصادر](#do-you-support-sending-email-with-smtp) (راجع [سياسة الخصوصية](/privacy)).

يتم تنفيذ كل شيء في الذاكرة و[كود المصدر الخاص بنا موجود على GitHub](https://github.com/forwardemail).

### كيف يعمل نظام إعادة توجيه البريد الإلكتروني الخاص بك؟ {#how-does-your-email-forwarding-system-work}

يعتمد البريد الإلكتروني على بروتوكول [بروتوكول SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). يتكون هذا البروتوكول من أوامر تُرسل إلى خادم (يعمل عادةً على المنفذ 25). يبدأ الاتصال، ثم يُحدد المُرسِل مصدر البريد ("MAIL FROM")، ثم يُحدد وجهة البريد ("RCPT TO")، وأخيرًا عناوين البريد الإلكتروني ونصه ("DATA"). فيما يلي وصف لسير نظام إعادة توجيه البريد الإلكتروني لدينا بالنسبة لكل أمر من أوامر بروتوكول SMTP:

* الاتصال الأولي (بدون اسم أمر، مثلًا `telnet example.com 25`) - هذا هو الاتصال الأولي. نتحقق من المرسلين غير الموجودين في [القائمة المسموح بها](#do-you-have-an-allowlist) لدينا مقابل [قائمة الرفض](#do-you-have-a-denylist) لدينا. وأخيرًا، إذا لم يكن المرسل مدرجًا في قائمة المسموح بها لدينا، فنتحقق مما إذا كان قد تم [مُدرج في القائمة الرمادية](#do-you-have-a-greylist).

* `HELO` - يشير هذا إلى تحية لتحديد اسم النطاق المؤهل بالكامل (FQDN) للمُرسِل، أو عنوان IP، أو اسم مُعالج البريد. يمكن تزييف هذه القيمة، لذا لا نعتمد على هذه البيانات، بل نستخدم البحث العكسي عن اسم المضيف لعنوان IP الخاص بالاتصال.

* `MAIL FROM` - يشير هذا إلى عنوان البريد المرسل من الظرف. في حال إدخال قيمة، يجب أن يكون عنوان بريد إلكتروني صالحًا وفقًا لمعيار RFC 5322. القيم الفارغة مسموح بها. نقوم هنا بـ [التحقق من التشتت الخلفي](#how-do-you-protect-against-backscatter)، ونتحقق أيضًا من عنوان البريد المرسل مقابل [قائمة الرفض](#do-you-have-a-denylist). أخيرًا، نتحقق من المُرسِلين غير المُدرجين في قائمة المسموح لهم لتحديد معدل الإرسال (للمزيد من المعلومات، راجع قسمي [تحديد المعدل](#do-you-have-rate-limiting) و [القائمة المسموح بها](#do-you-have-an-allowlist)).

* `RCPT TO` - يشير هذا إلى مُستلِم/مُستلِمي البريد الإلكتروني. يجب أن تكون هذه عناوين بريد إلكتروني صالحة وفقًا لمعيار RFC 5322. لا نسمح إلا بـ 50 مُستلِمًا لكل رسالة (هذا يختلف عن عنوان "إلى" في البريد الإلكتروني). نتحقق أيضًا من وجود عنوان [مخطط إعادة كتابة المرسل](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") صالح هنا للحماية من انتحال اسم نطاق SRS الخاص بنا.

* `DATA` - هذا هو الجزء الأساسي من خدمتنا الذي يُعالج رسائل البريد الإلكتروني. راجع القسم [كيفية معالجة البريد الإلكتروني لإعادة التوجيه](#how-do-you-process-an-email-for-forwarding) أدناه لمزيد من المعلومات.

### كيف تقوم بمعالجة البريد الإلكتروني لإعادة التوجيه {#how-do-you-process-an-email-for-forwarding}

يصف هذا القسم عمليتنا المتعلقة بأمر بروتوكول SMTP `DATA` في القسم [كيف يعمل نظام إعادة توجيه البريد الإلكتروني الخاص بك](#how-does-your-email-forwarding-system-work) أعلاه - وهو يتعلق بكيفية معالجة رؤوس البريد الإلكتروني ونصه وأمانه وتحديد المكان الذي يجب تسليمه إليه وكيفية التعامل مع الاتصالات.

1. إذا تجاوز حجم الرسالة الحد الأقصى وهو 50 ميجا بايت، فسيتم رفضها برمز الخطأ 552.

2. إذا لم تتضمن الرسالة عنوان "من"، أو إذا لم تكن أي من القيم الموجودة في عنوان "من" عناوين بريد إلكتروني صالحة وفقًا لمعيار RFC 5322، فسيتم رفضها برمز الخطأ 550.

3. إذا كانت الرسالة تحتوي على أكثر من 25 عنوان "مستلمة"، فسيتم تحديد أنها عالقة في حلقة إعادة التوجيه، ويتم رفضها برمز الخطأ 550.

4. باستخدام بصمة البريد الإلكتروني (راجع القسم الخاص بـ [بصمات الأصابع](#how-do-you-determine-an-email-fingerprint))، سوف نتحقق مما إذا كانت الرسالة قد تمت محاولتها مرة أخرى لأكثر من 5 أيام (والتي تتطابق مع [سلوك البادئة الافتراضية](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime))، وإذا كان الأمر كذلك، فسيتم رفضها برمز الخطأ 550.

5. نقوم بتخزين النتائج في الذاكرة من مسح البريد الإلكتروني باستخدام [ماسح البريد العشوائي](https://spamscanner.net).

٦. في حال وجود أي نتائج عشوائية من Spam Scanner، فسيتم رفضها مع رمز الخطأ ٥٥٤. تشمل النتائج العشوائية اختبار GTUBE فقط وقت كتابة هذه السطور. راجع <https://spamassassin.apache.org/gtube/> لمزيد من المعلومات.

7. سنضيف العناوين التالية إلى الرسالة لأغراض تصحيح الأخطاء ومنع إساءة الاستخدام:

* `Received` - نضيف رأس "استلام" القياسي هذا مع عنوان IP الأصلي والمضيف، ونوع الإرسال، ومعلومات اتصال TLS، والتاريخ/الوقت، والمستلم.
* `X-Original-To` - المستلم الأصلي للرسالة:
* هذا مفيد لتحديد مكان تسليم البريد الإلكتروني الأصلي (بالإضافة إلى رأس "استلام").
* يُضاف هذا لكل مستلم عند استخدام IMAP و/أو إعادة التوجيه المقنع (لحماية الخصوصية).
* `X-Forward-Email-Website` - يحتوي على رابط لموقعنا الإلكتروني <https://forwardemail.net>
* `X-Forward-Email-Version` - الإصدار الحالي [سيمفر](https://semver.org/) من `package.json` لقاعدة بياناتنا البرمجية.
* `X-Forward-Email-Session-ID` - قيمة معرف جلسة تُستخدم لأغراض التصحيح (تنطبق فقط على البيئات غير الإنتاجية).
* `X-Forward-Email-Sender` - قائمة مفصولة بفواصل تحتوي على عنوان البريد الأصلي (MAIL FROM) (إذا لم يكن فارغًا)، واسم المجال الكامل المؤهل لعميل PTR العكسي (إن وجد)، وعنوان IP للمرسل.
* `X-Forward-Email-ID` - ينطبق هذا فقط على رسائل SMTP الصادرة، ويرتبط بمعرف البريد الإلكتروني المُخزّن في حسابي ← رسائل البريد الإلكتروني.
* `X-Report-Abuse` - بقيمة `abuse@forwardemail.net`.
* `X-Report-Abuse-To` - بقيمة `abuse@forwardemail.net`.
* `X-Complaints-To` - بقيمة `abuse@forwardemail.net`.

8. نقوم بعد ذلك بالتحقق من الرسالة الخاصة بـ [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail)، و[SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework)، و[ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain)، و[DMARC](https://en.wikipedia.org/wiki/DMARC).

* إذا فشلت الرسالة في اجتياز اختبار DMARC وكان النطاق يتبع سياسة رفض (مثل: `p=reject` [كان في سياسة DMARC](https://wikipedia.org/wiki/DMARC))، فسيتم رفضها برمز الخطأ 550. عادةً، يمكن العثور على سياسة DMARC للنطاق في سجل <strong class="notranslate">TXT</strong> للنطاق الفرعي `_dmarc` (مثل: `dig _dmarc.example.com txt`).
* إذا فشلت الرسالة في اختبار SPF وكان النطاق يتبع سياسة فشل تام (مثل: `-all` كانت ضمن سياسة SPF، وليس `~all` أو لا توجد أي سياسة على الإطلاق)، فسيتم رفضها برمز الخطأ 550. عادةً ما يمكن العثور على سياسة SPF لنطاق ما في سجل <strong class="notranslate">TXT</strong> للنطاق الجذر (مثل `dig example.com txt`). راجع هذا القسم لمزيد من المعلومات حول [إرسال البريد كما هو الحال مع Gmail](#can-i-send-mail-as-in-gmail-with-this) بخصوص SPF.

٩. الآن، نقوم بمعالجة مُستلِمي الرسالة كما جُمِعوا من أمر `RCPT TO` في القسم [كيف يعمل نظام إعادة توجيه البريد الإلكتروني الخاص بك](#how-does-your-email-forwarding-system-work) أعلاه. لكل مُستلِم، نُجري العمليات التالية:

* نبحث في سجلات <strong class="notranslate">TXT</strong> لاسم النطاق (الجزء الذي يلي رمز `@`، على سبيل المثال `example.com` إذا كان عنوان البريد الإلكتروني `test@example.com`). على سبيل المثال، إذا كان اسم النطاق هو `example.com`، فإننا نجري بحث DNS مثل `dig example.com txt`.
* نحلل جميع سجلات <strong class="notranslate">TXT</strong> التي تبدأ إما بـ `forward-email=` (الخطط المجانية) أو `forward-email-site-verification=` (الخطط المدفوعة). لاحظ أننا نُحلل كلا النظامين لمعالجة رسائل البريد الإلكتروني أثناء ترقية المستخدم لخططه أو تخفيضها.
* من سجلات <strong class="notranslate">TXT</strong> المُحللة، نُكرر العملية لاستخراج إعدادات إعادة التوجيه (كما هو موضح في القسم [كيف أبدأ وأقوم بإعداد إعادة توجيه البريد الإلكتروني](#how-do-i-get-started-and-set-up-email-forwarding) أعلاه). يُرجى العلم أننا ندعم قيمة واحدة فقط من `forward-email-site-verification=`، وإذا تم إدخال أكثر من قيمة، فسيحدث خطأ 550 وسيتلقى المُرسِل رسالة مرتدة لهذا المُستلِم.
* نُكرر العملية بشكل متكرر لاستخراج إعدادات إعادة التوجيه لتحديد إعادة التوجيه الشاملة، وإعادة التوجيه القائمة على التعابير العادية، وجميع إعدادات إعادة التوجيه الأخرى المدعومة - والتي تُعرف الآن باسم "عناوين إعادة التوجيه".
* لكل عنوان إعادة توجيه، ندعم بحثًا متكررًا واحدًا (سيبدأ سلسلة العمليات هذه على العنوان المُعطى). إذا تم العثور على تطابق متكرر، فسيتم حذف النتيجة الأصلية من عناوين إعادة التوجيه، وستتم إضافة العناوين الفرعية.
* يتم تحليل عناوين إعادة التوجيه للتأكد من تفردها (لأننا لا نريد إرسال عناوين مكررة إلى عنوان واحد أو توليد اتصالات إضافية غير ضرورية عبر عميل SMTP).
* لكل عنوان إعادة توجيه، نبحث عن اسم نطاقه في نقطة نهاية واجهة برمجة التطبيقات الخاصة بنا `/v1/max-forwarded-addresses` (لتحديد عدد العناوين المسموح للنطاق بإعادة توجيه البريد الإلكتروني إليها لكل اسم مستعار، على سبيل المثال، 10 عناوين افتراضيًا - راجع قسم [الحد الأقصى لإعادة التوجيه لكل اسم مستعار](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). في حال تجاوز هذا الحد، سيحدث خطأ 550 وسيتلقى المرسل إشعارًا بارتداد البريد لهذا المستلم.
* نبحث عن إعدادات المستلم الأصلي في نقطة نهاية واجهة برمجة التطبيقات الخاصة بنا `/v1/settings`، والتي تدعم البحث عن المستخدمين المدفوعين (مع خيار بديل للمستخدمين المجانيين). يُرجع هذا كائن تكوين للإعدادات المتقدمة لـ `port` (رقم، مثلًا `25`)، و`has_adult_content_protection` (منطقي)، و`has_phishing_protection` (منطقي)، و`has_executable_protection` (منطقي)، و`has_virus_protection` (منطقي).
* بناءً على هذه الإعدادات، نتحقق من نتائج فحص البريد العشوائي، وفي حال حدوث أي أخطاء، تُرفض الرسالة برمز خطأ 554 (مثلًا، إذا تم تفعيل `has_virus_protection`، فسنتحقق من نتائج فحص البريد العشوائي بحثًا عن الفيروسات). يرجى ملاحظة أن جميع مستخدمي الخطة المجانية سيشتركون في عمليات التحقق من المحتوى غير اللائق، والتصيد الاحتيالي، والملفات التنفيذية، والفيروسات. بشكل افتراضي، جميع مستخدمي الخطة المدفوعة مشتركون أيضًا، ولكن يمكن تعديل هذا الإعداد من صفحة الإعدادات الخاصة بالنطاق في لوحة معلومات إعادة توجيه البريد الإلكتروني.

10. بالنسبة لكل عنوان إعادة توجيه للمستلم الذي تمت معالجته، نقوم بعد ذلك بإجراء العمليات التالية:

* يتم التحقق من العنوان وفقًا لـ [قائمة الرفض](#do-you-have-a-denylist)، وإذا كان مُدرجًا، فسيظهر رمز خطأ 421 (يُشير إلى المُرسِل لإعادة المحاولة لاحقًا).
* إذا كان العنوان خطاف ويب، فسنُعيّن قيمة منطقية للعمليات المستقبلية (انظر أدناه - نُجمّع خطافات الويب المتشابهة معًا لإنشاء طلب POST واحد بدلًا من طلبات متعددة للتسليم).
* إذا كان العنوان عنوان بريد إلكتروني، فسنُحلل المُضيف للعمليات المستقبلية (انظر أدناه - نُجمّع المُضيفات المتشابهة معًا لإنشاء اتصال واحد بدلًا من اتصالات فردية متعددة للتسليم).

11. إذا لم يكن هناك مستلمون ولا ارتدادات، فسنرد بخطأ 550 "مستلمون غير صالحين".

١٢. إذا كان هناك مستلمون، فسنكرر العملية عليهم (مُجمّعين معًا بواسطة نفس المُضيف) ونُسلّم رسائل البريد الإلكتروني. راجع قسم [كيف تتعامل مع مشكلات تسليم البريد الإلكتروني](#how-do-you-handle-email-delivery-issues) أدناه لمزيد من المعلومات.

* في حال حدوث أي أخطاء أثناء إرسال رسائل البريد الإلكتروني، سنخزنها في الذاكرة لمعالجتها لاحقًا.

* سنأخذ رمز الخطأ الأقل (إن وُجد) من إرسال رسائل البريد الإلكتروني، ونستخدمه كرمز استجابة لأمر `DATA`. هذا يعني أن رسائل البريد الإلكتروني التي لم تُسلّم ستُعاد عادةً من قِبل المُرسِل الأصلي، بينما لن تُعاد إرسال رسائل البريد الإلكتروني التي تم تسليمها بالفعل في المرة التالية التي تُرسَل فيها الرسالة (لأننا نستخدم [بصمات الأصابع](#how-do-you-determine-an-email-fingerprint)).

* في حال عدم حدوث أي أخطاء، سنرسل رمز حالة استجابة SMTP ناجحًا بقيمة 250.

* يُعَدّ الارتداد هو أي محاولة تسليم ينتج عنها رمز حالة >= 500 (أعطال دائمة).

13. إذا لم تحدث أي ارتدادات (فشل دائم)، فسوف نقوم بإرجاع رمز حالة استجابة SMTP لأدنى رمز خطأ من الفشل غير الدائم (أو رمز حالة ناجح 250 إذا لم يكن هناك أي فشل).

١٤. في حال حدوث ارتدادات، سنرسل رسائل بريد إلكتروني مرتدة في الخلفية بعد إرجاع أدنى رمز خطأ إلى المُرسِل. أما إذا كان أدنى رمز خطأ >= ٥٠٠، فلن نُرسل أي رسائل مرتدة. هذا لأنه في حال فعلنا ذلك، سيتلقى المُرسِلون رسالة بريد إلكتروني مرتدة مزدوجة (مثل رسالة من وسيط نقل البريد الصادر، مثل Gmail، ورسالة أخرى منّا أيضًا). راجع قسم [كيف تحمي نفسك من التشتت الخلفي؟](#how-do-you-protect-against-backscatter) أدناه لمزيد من المعلومات.

### كيف تتعامل مع مشكلات تسليم البريد الإلكتروني؟ {#how-do-you-handle-email-delivery-issues}

لاحظ أننا سنقوم بإعادة كتابة "من الصديق" على رسائل البريد الإلكتروني فقط إذا لم يتم تمرير سياسة DMARC الخاصة بالمرسل ولم يتم محاذاة توقيعات DKIM مع رأس "من". وهذا يعني أننا سنغير رأس "من" في الرسالة، ونحدد "X-Original-From"، ونحدد أيضًا "Reply-To" إذا لم يكن محددًا بالفعل. وسنعيد أيضًا ختم ختم ARC على الرسالة بعد تغيير هذه الرؤوس.

نحن نستخدم أيضًا التحليل الذكي لرسائل الخطأ في كل مستوى من مستويات المكدس لدينا - في الكود الخاص بنا، طلبات DNS، وداخليات Node.js، وطلبات HTTP (على سبيل المثال، يتم تعيين 408 و413 و429 إلى رمز استجابة SMTP 421 إذا كان المستلم عبارة عن خطاف ويب)، واستجابات خادم البريد (على سبيل المثال، سيتم إعادة محاولة الاستجابات التي تحتوي على "تأجيل" أو "إبطاء" كأخطاء 421).

منطقنا مُحصّن ضد الأخطاء، وسيُعيد المحاولة أيضًا في حال وجود أخطاء SSL/TLS، أو مشاكل في الاتصال، وغيرها. الهدف من هذا المُحصّن هو زيادة إمكانية توصيل الرسائل إلى جميع المستلمين في إعدادات إعادة التوجيه.

إذا كان المستلم هو خطاف ويب، فسنسمح بفترة انتظار مدتها 60 ثانية لإكمال الطلب مع ما يصل إلى 3 محاولات إعادة (أي 4 طلبات إجمالاً قبل الفشل). يُرجى العلم أننا نحلل رموز الخطأ 408 و413 و429 بشكل صحيح ونربطها برمز استجابة SMTP 421.

إذا كان المستلم عنوان بريد إلكتروني، فسنحاول إرسال البريد الإلكتروني باستخدام بروتوكول TLS (نحاول استخدام STARTTLS إذا كان متوفرًا على خادم بريد المستلم). في حال حدوث خطأ في SSL/TLS أثناء محاولة إرسال البريد الإلكتروني، فسنحاول إرساله بدون بروتوكول TLS (بدون استخدام STARTTLS).

إذا حدثت أي أخطاء DNS أو أخطاء اتصال، فسوف نعود إلى الأمر `DATA` برمز استجابة SMTP 421، وإلا إذا كان هناك أخطاء بمستوى >= 500، فسيتم إرسال الارتدادات.

إذا اكتشفنا أن خادم البريد الإلكتروني الذي نحاول تسليم البريد إليه لديه عنوان IP واحد أو أكثر من عناوين تبادل البريد الإلكتروني لدينا محظور (على سبيل المثال، بواسطة أي تقنية يستخدمونها لتأجيل مرسلي البريد العشوائي)، فسنرسل رمز استجابة SMTP 421 للمرسل لإعادة محاولة إرسال رسالته لاحقًا (ونحن ننبه إلى المشكلة حتى نتمكن من حلها قبل المحاولة التالية).

### كيف تتعامل مع حظر عناوين IP الخاصة بك؟ {#how-do-you-handle-your-ip-addresses-becoming-blocked}

نقوم بشكل روتيني بمراقبة جميع قوائم الرفض الرئيسية لـ DNS وإذا تم إدراج أي من عناوين IP لتبادل البريد ("MX") في قائمة رفض رئيسية، فسنقوم بسحبها من جولة سجلات DNS A ذات الصلة إذا كان ذلك ممكنًا حتى يتم حل المشكلة.

في وقت كتابة هذه السطور، نُدرج أيضًا في عدة قوائم DNS المسموح بها، ونأخذ مراقبة قوائم الحظر على محمل الجد. إذا لاحظت أي مشاكل قبل أن نتمكن من حلها، يُرجى إبلاغنا كتابيًا على <support@forwardemail.net>.

عناوين IP الخاصة بنا متاحة للعامة، [انظر هذا القسم أدناه لمزيد من المعلومات](#what-are-your-servers-ip-addresses).

### ما هي عناوين مدير البريد {#what-are-postmaster-addresses}

من أجل منع عمليات الارتداد الموجهة بشكل خاطئ وإرسال رسائل الرد التلقائي إلى صناديق بريد غير مراقبة أو غير موجودة، فإننا نحتفظ بقائمة من أسماء المستخدمين مثل برنامج Mailer-daemon:

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
* [وأي عنوان لا يمكن الرد عليه](#what-are-no-reply-addresses)

راجع [RFC 5320 القسم 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) للحصول على مزيد من المعلومات حول كيفية استخدام القوائم مثل هذه لإنشاء أنظمة بريد إلكتروني فعالة.

### ما هي عناوين عدم الرد {#what-are-no-reply-addresses}

تعتبر أسماء مستخدمي البريد الإلكتروني التي تساوي أيًا من الأسماء التالية (غير حساسة لحالة الأحرف) بمثابة عناوين عدم الرد:

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

يتم صيانة هذه القائمة [كمشروع مفتوح المصدر على GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### ما هي عناوين IP الخاصة بخادمك {#what-are-your-servers-ip-addresses}

نقوم بنشر عناوين IP الخاصة بنا على <https://forwardemail.net/ips>.

### هل لديك قائمة مسموح بها {#do-you-have-an-allowlist}

نعم، لدينا [قائمة امتدادات اسم النطاق](#what-domain-name-extensions-are-allowlisted-by-default) المسموح بها بشكل افتراضي وقائمة مسموح بها ديناميكية ومخزنة مؤقتًا ومتجددة استنادًا إلى [معايير صارمة](#what-is-your-allowlist-criteria).

سيتم إضافة جميع رسائل البريد الإلكتروني والمجالات والمستلمين من العملاء المشتركين في الخطط المدفوعة تلقائيًا إلى القائمة المسموح بها لدينا.

### ما هي امتدادات أسماء النطاق المسموح بها افتراضيًا {#what-domain-name-extensions-are-allowlisted-by-default}

تعتبر امتدادات أسماء النطاقات التالية مدرجة في القائمة المسموح بها بشكل افتراضي (بغض النظر عما إذا كانت مدرجة في قائمة الشعبية الشاملة أم لا):

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
<li فئة "list-inline-item"><code class="notranslate">ca.us</code></li>
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
<li فئة "list-inline-item"><code class="notranslate">la.us</code></li>
<li class="list-inline-item"><code class="notranslate">ma.us</code></li>
<li class="list-inline-item"><code class="notranslate">md.us</code></li>
<li class="list-inline-item"><code class="notranslate">me.us</code></li>
<li class="list-inline-item"><code class="notranslate">mi.us</code></li>
<li class="list-inline-item"><code class="notranslate">mn.us</code></li>
<li class="list-inline-item"><code class="notranslate">mo.us</code></li>
<li class="list-inline-item"><code ms.us
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
<li فئة "list-inline-item"><code class="notranslate">go.jp</code></li>
<li class="list-inline-item"><code class="notranslate">go.ke</code></li>
<li class="list-inline-item"><code class="notranslate">go.kr</code></li>
<li class="list-inline-item"><code class="notranslate">go.th</code></li>
<li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
<li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gob.es</code></li>
<li class="list-inline-item"><code gob.mx
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
<li class="list-inline-item"><code gov.by
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
<li class="list-inline-item"><code البرلمان البريطاني (parliament.uk)
<li class="list-inline-item"><code class="notranslate">الشرطة البريطانية (police.uk)</code></li>
<li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
<li class="list-inline-item"><code class="notranslate">الملكية البريطانية (royal.uk)</code></li>
<li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
<li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

بالإضافة إلى ذلك، يتم إدراج [نطاقات المستوى الأعلى للعلامات التجارية والشركات](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) في القائمة المسموح بها بشكل افتراضي (على سبيل المثال `apple` لـ `applecard.apple` لكشوف حسابات بنك Apple Card):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">أكسنتشر</code></li>
<li class="list-inline-item"><code class="notranslate">أكو</code></li>
<li class="list-inline-item"><code class="notranslate">إيج</code></li>
<li class="list-inline-item"><code class="notranslate">أيتنا</code></li>
<li class="list-inline-item"><code class="notranslate">أفل</code></li>
<li class="list-inline-item"><code class="notranslate">أغاخان</code></li>
<li class="list-inline-item"><code class="notranslate">إيج</code></li>
<li class="list-inline-item"><code class="notranslate">إيغو</code></li>
<li class="list-inline-item"><code إيرباص
<li class="list-inline-item"><code class="notranslate">إيرتل</code></li>
<li class="list-inline-item"><code class="notranslate">akdn</code></li>
<li class="list-inline-item"><code class="notranslate">ألفاروميو</code></li>
<li class="list-inline-item"><code class="notranslate">علي بابا</code></li>
<li class="list-inline-item"><code class="notranslate">ألي باي</code></li>
<li class="list-inline-item"><code class="notranslate">أل فينانز</code></li>
<li class="list-inline-item"><code class="notranslate">أول ستيت</code></li>
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
<li class="list-inline-item"><code class="notranslate">أرامكو</code></li>
<li class="list-inline-item"><code class="notranslate">أودي</code></li>
<li class="list-inline-item"><code class="notranslate">auspost</code></li>
<li class="list-inline-item"><code class="notranslate">aws</code></li>
<li class="list-inline-item"><code class="notranslate">axa</code></li>
<li class="list-inline-item"><code class="notranslate">أزور</code></li>
<li class="list-inline-item"><code class="notranslate">بايدو</code></li>
<li class="list-inline-item"><code class="notranslate">بانانا ريبوبليك</code></li>
<li class="list-inline-item"><code class="notranslate">باركلاي كارد</code></li>
<li class="list-inline-item"><code class="notranslate">باركلايز</code></li>
<li class="list-inline-item"><code class="notranslate">كرة السلة</code></li>
<li class="list-inline-item"><code class="notranslate">باوهاوس</code></li>
<li class="list-inline-item"><code class="notranslate">بي بي سي</code></li>
<li class="list-inline-item"><code class="notranslate">bbt</code></li>
<li class="list-inline-item"><code class="notranslate">bbva</code></li>
<li class="list-inline-item"><code class="notranslate">bcg</code></li>
<li class="list-inline-item"><code class="notranslate">بنتلي</code></li>
<li class="list-inline-item"><code class="notranslate">بهارتي</code></li>
<li class="list-inline-item"><code class="notranslate">بينج</code></li>
<li class="list-inline-item"><code class="notranslate">بلانكو</code></li>
<li class="list-inline-item"><code class="notranslate">بلومبرغ</code></li>
<li class="list-inline-item"><code class="notranslate">bms</code></li>
<li class="list-inline-item"><code class="notranslate">bmw</code></li>
<li class="list-inline-item"><code class="notranslate">bnl</code></li>
<li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
<li class="list-inline-item"><code class="notranslate">boehringer</code></li>
<li class="list-inline-item"><code class="notranslate">bond</code></li>
<li class="list-inline-item"><code class="notranslate">booking</code></li>
<li class="list-inline-item"><code class="notranslate">bosch</code></li>
<li فئة "list-inline-item"><code class="notranslate">بوستيك</code></li>
<li class="list-inline-item"><code class="notranslate">براديسكو</code></li>
<li class="list-inline-item"><code class="notranslate">بريدجستون</code></li>
<li class="list-inline-item"><code class="notranslate">براذر</code></li>
<li class="list-inline-item"><code class="notranslate">بوجاتي</code></li>
<li class="list-inline-item"><code class="notranslate">كال</code></li>
<li class="list-inline-item"><code class="notranslate">كالفنكلين</code></li>
<li class="list-inline-item"><code class="notranslate">كانون</code></li>
<li class="list-inline-item"><code class="notranslate">كابيتالون</code></li>
<li class="list-inline-item"><code class="notranslate">كارافان</code></li>
<li class="list-inline-item"><code class="notranslate">كارتييه</code></li>
<li class="list-inline-item"><code class="notranslate">سي بي إيه</code></li>
<li class="list-inline-item"><code class="notranslate">سي بي إن</code></li>
<li class="list-inline-item"><code class="notranslate">سي بي آر إي</code></li>
<li class="list-inline-item"><code class="notranslate">سي بي إس</code></li>
<li class="list-inline-item"><code class="notranslate">سيرن</code></li>
<li class="list-inline-item"><code class="notranslate">cfa</code></li>
<li class="list-inline-item"><code class="notranslate">chanel</code></li>
<li class="list-inline-item"><code class="notranslate">chase</code></li>
<li class="list-inline-item"><code class="notranslate">chintai</code></li>
<li class="list-inline-item"><code class="notranslate">chrome</code></li>
<li class="list-inline-item"><code class="notranslate">chrysler</code></li>
<li class="list-inline-item"><code class="notranslate">cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">cisco</code></li>
<li class="list-inline-item"><code class="notranslate">القلعة</code></li>
<li class="list-inline-item"><code class="notranslate">سيتي</code></li>
<li class="list-inline-item"><code class="notranslate">سيتيك</code></li>
<li class="list-inline-item"><code class="notranslate">كلوبميد</code></li>
<li class="list-inline-item"><code class="notranslate">كومكاست</code></li>
<li class="list-inline-item"><code class="notranslate">كومبانك</code></li>
<li class="list-inline-item"><code class="notranslate">اتحاد ائتماني</code></li>
<li class="list-inline-item"><code class="notranslate">كراون</code></li>
<li class="list-inline-item"><code class="notranslate">crs</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><code class="notranslate">dabur</code></li>
<li class="list-inline-item"><code class="notranslate">datsun</code></li>
<li class="list-inline-item"><code class="notranslate">dealer</code></li>
<li class="list-inline-item"><code class="notranslate">dell</code></li>
<li class="list-inline-item"><code class="notranslate">deloitte</code></li>
<li class="list-inline-item"><code class="notranslate">دلتا</code></li>
<li class="list-inline-item"><code class="notranslate">دي إتش إل</code></li>
<li class="list-inline-item"><code class="notranslate">ديسكوفر</code></li>
<li class="list-inline-item"><code class="notranslate">ديش</code></li>
<li class="list-inline-item"><code class="notranslate">دي إن بي</code></li>
<li class="list-inline-item"><code class="notranslate">دودج</code></li>
<li class="list-inline-item"><code class="notranslate">دنلوب</code></li>
<li class="list-inline-item"><code class="notranslate">دوبونت</code></li>
<li class="list-inline-item"><code class="notranslate">dvag</code></li>
<li class="list-inline-item"><code class="notranslate">edeka</code></li>
<li class="list-inline-item"><code class="notranslate">emerck</code></li>
<li class="list-inline-item"><code class="notranslate">epson</code></li>
<li class="list-inline-item"><code class="notranslate">ericsson</code></li>
<li class="list-inline-item"><code class="notranslate">erni</code></li>
<li class="list-inline-item"><code class="notranslate">esurance</code></li>
<li class="list-inline-item"><code class="notranslate">etisalat</code></li>
<li class="list-inline-item"><code class="notranslate">يوروفيجن</code></li>
<li class="list-inline-item"><code class="notranslate">إيفربانك</code></li>
<li class="list-inline-item"><code class="notranslate">مسافة إضافية</code></li>
<li class="list-inline-item"><code class="notranslate">فاجي</code></li>
<li class="list-inline-item"><code class="notranslate">فيرويندز</code></li>
<li class="list-inline-item"><code class="notranslate">مزارعون</code></li>
<li class="list-inline-item"><code class="notranslate">فيديكس</code></li>
<li class="list-inline-item"><code class="notranslate">فيراري</code></li>
<li فيريرو
فيات
فيديليتي
فايرستون
فيريرو
فيريرو

فيريستون

فيريستون

فيريستون

فلسميدث
<li class="list-inline-item"><code class="notranslate">فورد</code></li>
<li class="list-inline-item"><code class="notranslate">ثعلب</code></li>
<li class="list-inline-item"><code class="notranslate">فريسينيوس</code></li>
<li class="list-inline-item"><code class="notranslate">فوركس</code></li>
<li class="list-inline-item"><code class="notranslate">فروغانز</code></li>
<li class="list-inline-item"><code class="notranslate">فرونتير</code></li>
<li class="list-inline-item"><code class="notranslate">فوجيتسو</code></li>
<li class="list-inline-item"><code class="notranslate">فوجيكسروكس</code></li>
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
<li class="list-inline-item"><code class="notranslate">جوجل</code></li>
<li class="list-inline-item"><code class="notranslate">جرينجر</code></li>
<li class="list-inline-item"><code class="notranslate">غارديان</code></li>
<li class="list-inline-item"><code class="notranslate">غوتشي</code></li>
<li class="list-inline-item"><code class="notranslate">إتش بي أو</code></li>
<li class="list-inline-item"><code class="notranslate">hdfc</code></li>
<li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
<li class="list-inline-item"><code class="notranslate">هيرميس</code></li>
<li class="list-inline-item"><code class="notranslate">هيساميتسو</code></li>
<li class="list-inline-item"><code class="notranslate">هيتاشي</code></li>
<li class="list-inline-item"><code class="notranslate">hkt</code></li>
<li class="list-inline-item"><code class="notranslate">هوندا</code></li>
<li class="list-inline-item"><code class="notranslate">هونيويل</code></li>
<li class="list-inline-item"><code class="notranslate">هوتميل</code></li>
<li class="list-inline-item"><code class="notranslate">إتش إس بي سي</code></li>
<li class="list-inline-item"><code class="notranslate">هيوز</code></li>
<li class="list-inline-item"><code class="notranslate">هايات</code></li>
<li class="list-inline-item"><code class="notranslate">هيونداي</code></li>
<li class="list-inline-item"><code class="notranslate">آي بي إم</code></li>
<li class="list-inline-item"><code class="notranslate">ieee</code></li>
<li class="list-inline-item"><code class="notranslate">ifm</code></li>
<li class="list-inline-item"><code class="notranslate">إيكانو</code></li>
<li class="list-inline-item"><code class="notranslate">imdb</code></li>
<li class="list-inline-item"><code class="notranslate">إنفينيتي</code></li>
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
<li class="list-inline-item"><code class="notranslate">كيري لوجيستكس</code></li>
<li class="list-inline-item"><code class="notranslate">كيري بروبرتيز</code></li>
<li class="list-inline-item"><code class="notranslate">كيه إف إتش</code></li>
<li class="list-inline-item"><code class="notranslate">كيا</code></li>
<li class="list-inline-item"><code class="notranslate">كيندر</code></li>
<li class="list-inline-item"><code class="notranslate">كيندل</code></li>
<li class="list-inline-item"><code class="notranslate">كوماتسو</code></li>
<li class="list-inline-item"><code class="notranslate">kpmg</code></li>
<li class="list-inline-item"><code class="notranslate">kred</code></li>
<li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
<li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
<li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
<li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
<li class="list-inline-item"><code class="notranslate">lancaster</code></li>
<li class="list-inline-item"><code class="notranslate">lancia</code></li>
<li لانكوم
<li class="list-inline-item"><code class="notranslate">لاند روفر</code></li>
<li class="list-inline-item"><code class="notranslate">لانكسيس</code></li>
<li class="list-inline-item"><code class="notranslate">لاسال</code></li>
<li class="list-inline-item"><code class="notranslate">لاتروب</code></li>
<li class="list-inline-item"><code class="notranslate">lds</code></li>
<li class="list-inline-item"><code class="notranslate">ليكلير</code></li>
<li class="list-inline-item"><code class="notranslate">ليغو</code></li>
<li class="list-inline-item"><code class="notranslate">رابطة</code></li>
<li class="list-inline-item"><code class="notranslate">لكزس</code></li>
<li class="list-inline-item"><code class="notranslate">ليدل</code></li>
<li class="list-inline-item"><code class="notranslate">نمط حياة</code></li>
<li class="list-inline-item"><code class="notranslate">ليلي</code></li>
<li class="list-inline-item"><code class="notranslate">لينكولن</code></li>
<li class="list-inline-item"><code class="notranslate">ليند</code></li>
<li class="list-inline-item"><code class="notranslate">ليبسي</code></li>
<li ليكسيل
<li class="list-inline-item"><code class="notranslate">لوكس</code></li>
<li class="list-inline-item"><code class="notranslate">لوت</code></li>
<li class="list-inline-item"><code class="notranslate">lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
<li class="list-inline-item"><code class="notranslate">لوندبيك</code></li>
<li class="list-inline-item"><code class="notranslate">لوبين</code></li>
<li class="list-inline-item"><code class="notranslate">مايسيز</code></li>
<li class="list-inline-item"><code class="notranslate">مايف</code></li>
<li class="list-inline-item"><code class="notranslate">مان</code></li>
<li class="list-inline-item"><code class="notranslate">مانجو</code></li>
<li class="list-inline-item"><code class="notranslate">ماريوت</code></li>
<li class="list-inline-item"><code class="notranslate">مازيراتي</code></li>
<li class="list-inline-item"><code class="notranslate">ماتيل</code></li>
<li class="list-inline-item"><code class="notranslate">ماكينزي</code></li>
<li class="list-inline-item"><code class="notranslate">ميتلايف</code></li>
<li مايكروسوفت
<li class="list-inline-item"><code class="notranslate">ميني</code></li>
<li class="list-inline-item"><code class="notranslate">ميت</code></li>
<li class="list-inline-item"><code class="notranslate">ميتسوبيشي</code></li>
<li class="list-inline-item"><code class="notranslate">إم إل بي</code></li>
<li class="list-inline-item"><code class="notranslate">إم إم إيه</code></li>
<li class="list-inline-item"><code class="notranslate">موناش</code></li>
<li class="list-inline-item"><code class="notranslate">مورمون</code></li>
<li class="list-inline-item"><code class="notranslate">moto</code></li>
<li class="list-inline-item"><code class="notranslate">movistar</code></li>
<li class="list-inline-item"><code class="notranslate">msd</code></li>
<li class="list-inline-item"><code class="notranslate">mtn</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">mutual</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">nationalwide</code></li>
<li class="list-inline-item"><code class="notranslate">الطبيعة</code></ li>
<li class="list-inline-item"><code class="notranslate">nba</code></li>
<li class="list-inline-item"><code class="notranslate">nec</code></li>
<li class="list-inline-item"><code class="notranslate">netflix</code></li>
<li class="list-inline-item"><code class="notranslate">neustar</code></li>
<li class="list-inline-item"><code class="notranslate">newholland</code></li>
<li class="list-inline-item"><code class="notranslate">nfl</code></li>
<li class="list-inline-item"><code class="notranslate">nhk</code></li>
<li class="list-inline-item"><code نيكو
<li class="list-inline-item"><code class="notranslate">نايكي</code></li>
<li class="list-inline-item"><code class="notranslate">نيكون</code></li>
<li class="list-inline-item"><code class="notranslate">نيسان</code></li>
<li class="list-inline-item"><code class="notranslate">نيساي</code></li>
<li class="list-inline-item"><code class="notranslate">نوكيا</code></li>
<li class="list-inline-item"><code class="notranslate">نورثويسترن ميوتشوال</code></li>
<li class="list-inline-item"><code class="notranslate">نورتون</code></li>
<li class="list-inline-item"><code class="notranslate">nra</code></li>
<li class="list-inline-item"><code class="notranslate">ntt</code></li>
<li class="list-inline-item"><code class="notranslate">obi</code></li>
<li class="list-inline-item"><code class="notranslate">office</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oracle</code></li>
<li class="list-inline-item"><code class="notranslate">orange</code></li>
<li class="list-inline-item"><code class="notranslate">otsuka</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li class="list-inline-item"><code class="notranslate">باناسونيك</code></li>
<li class="list-inline-item"><code class="notranslate">pccw</code></li>
<li class="list-inline-item"><code class="notranslate">فايزر</code></li>
<li class="list-inline-item"><code class="notranslate">فيليبس</code></li>
<li class="list-inline-item"><code class="notranslate">بياجيه</code></li>
<li class="list-inline-item"><code class="notranslate">بيكتيت</code></li>
<li class="list-inline-item"><code class="notranslate">بينغ</code></li>
<li class="list-inline-item"><code class="notranslate">رائد</code></li>
<li class="list-inline-item"><code class="notranslate">لعب</code></li>
<li class="list-inline-item"><code class="notranslate">بلاي ستيشن</code></li>
<li class="list-inline-item"><code class="notranslate">بوهل</code></li>
<li class="list-inline-item"><code class="notranslate">سياسة</code></li>
<li class="list-inline-item"><code class="notranslate">ممارسة</code></li>
<li class="list-inline-item"><code class="notranslate">إنتاج</code></li>
<li class="list-inline-item"><code class="notranslate">تقدمي</code></li>
<li class="list-inline-item"><code class="notranslate">pru</code></li>
<li class="list-inline-item"><code class="notranslate">prudential</code></li>
<li class="list-inline-item"><code class="notranslate">pwc</code></li>
<!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
<li class="list-inline-item"><code class="notranslate">qvc</code></li>
<li class="list-inline-item"><code class="notranslate">redstone</code></li>
<li class="list-inline-item"><code class="notranslate">reliance</code></li>
<li class="list-inline-item"><code class="notranslate">ريكسروث</code></li>
<li class="list-inline-item"><code class="notranslate">ريكو</code></li>
<li class="list-inline-item"><code class="notranslate">رميت</code></li>
<li class="list-inline-item"><code class="notranslate">روشيه</code></li>
<li class="list-inline-item"><code class="notranslate">روجرز</code></li>
<li class="list-inline-item"><code class="notranslate">روي</code></li>
<li class="list-inline-item"><code class="notranslate">سلامة</code></li>
<li class="list-inline-item"><code class="notranslate">ساكورا</code></li>
<li class="list-inline-item"><code سامسونج
<li class="list-inline-item"><code class="notranslate">ساندفيك</code></li>
<li class="list-inline-item"><code class="notranslate">ساندفيك كورومانت</code></li>
<li class="list-inline-item"><code class="notranslate">سانوفي</code></li>
<li class="list-inline-item"><code class="notranslate">ساب</code></li>
<li class="list-inline-item"><code class="notranslate">ساكسو</code></li>
<li class="list-inline-item"><code class="notranslate">إس بي آي</code></li>
<!--<li class="list-inline-item"><code class="notranslate">إس بي إس</code></li>-->
<li class="list-inline-item"><code class="notranslate">sca</code></li>
<li class="list-inline-item"><code class="notranslate">scb</code></li>
<li class="list-inline-item"><code class="notranslate">شايفلر</code></li>
<li class="list-inline-item"><code class="notranslate">شميدت</code></li>
<li class="list-inline-item"><code class="notranslate">شوارتز</code></li>
<li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><code class="notranslate">scor</code></li>
<li class="list-inline-item"><code class="notranslate">مقعد</code></li>
<li class="list-inline-item"><code class="notranslate">sener</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">sew</code></li>
<li class="list-inline-item"><code class="notranslate">seven</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">seek</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">sharp</code></li>
<li فئة "list-inline-item"><code class="notranslate">شو</code></li>
<li class="list-inline-item"><code class="notranslate">شل</code></li>
<li class="list-inline-item"><code class="notranslate">شريرام</code></li>
<li class="list-inline-item"><code class="notranslate">سينا</code></li>
<li class="list-inline-item"><code class="notranslate">سكاي</code></li>
<li class="list-inline-item"><code class="notranslate">سكايب</code></li>
<li class="list-inline-item"><code class="notranslate">سمارت</code></li>
<li class="list-inline-item"><code class="notranslate">sncf</code></li>
<li سوفت بنك
<li class="list-inline-item"><code class="notranslate">سوهو</code></li>
<li class="list-inline-item"><code class="notranslate">سوني</code></li>
<li class="list-inline-item"><code class="notranslate">سبيغل</code></li>
<li class="list-inline-item"><code class="notranslate">ستادا</code></li>
<li class="list-inline-item"><code class="notranslate">ستابلز</code></li>
<li class="list-inline-item"><code class="notranslate">ستار</code></li>
<li class="list-inline-item"><code class="notranslate">ستار هب</code></li>
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
<li class="list-inline-item"><code تيماسيك
<li class="list-inline-item"><code class="notranslate">تيڤا</code></li>
<li class="list-inline-item"><code class="notranslate">تيفاني</code></li>
<li class="list-inline-item"><code class="notranslate">تي جي إكس</code></li>
<li class="list-inline-item"><code class="notranslate">توراي</code></li>
<li class="list-inline-item"><code class="notranslate">توشيبا</code></li>
<li class="list-inline-item"><code class="notranslate">الإجمالي</code></li>
<li class="list-inline-item"><code class="notranslate">تويوتا</code></li>
<li class="list-inline-item"><code قناة السفر
<li class="list-inline-item"><code class="notranslate">مسافرون</code></li>
<li class="list-inline-item"><code class="notranslate">توي</code></li>
<li class="list-inline-item"><code class="notranslate">تلفزيونات</code></li>
<li class="list-inline-item"><code class="notranslate">يو بي إس</code></li>
<li class="list-inline-item"><code class="notranslate">يونيكوم</code></li>
<li class="list-inline-item"><code class="notranslate">uol</code></li>
<li class="list-inline-item"><code class="notranslate">يو بي إس</code></li>
<li class="list-inline-item"><code class="notranslate">فانغارد</code></li>
<li class="list-inline-item"><code class="notranslate">فيريساين</code></li>
<li class="list-inline-item"><code class="notranslate">فيج</code></li>
<li class="list-inline-item"><code class="notranslate">فايكنج</code></li>
<li class="list-inline-item"><code class="notranslate">فيرجن</code></li>
<li class="list-inline-item"><code class="notranslate">فيزا</code></li>
<li class="list-inline-item"><code class="notranslate">فيستا</code></li>
<li class="list-inline-item"><code class="notranslate">فيستابرينت</code></li>
<li class="list-inline-item"><code فيفو
<li class="list-inline-item"><code class="notranslate">فولكس فاجن</code></li>
<li class="list-inline-item"><code class="notranslate">فولفو</code></li>
<li class="list-inline-item"><code class="notranslate">وول مارت</code></li>
<li class="list-inline-item"><code class="notranslate">والتر</code></li>
<li class="list-inline-item"><code class="notranslate">ويذر تشانيل</code></li>
<li class="list-inline-item"><code class="notranslate">ويبر</code></li>
<li class="list-inline-item"><code class="notranslate">وير</code></li>
<li class="list-inline-item"><code class="notranslate"> class="notranslate">williamhill</code></li>
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
<li فئة "list-inline-item"><code class="notranslate">زيبو</code></li>
</ul>

اعتبارًا من 18 مارس 2025، أضفنا أيضًا هذه الأقاليم الفرنسية الخارجية إلى هذه القائمة ([وفقًا لطلب GitHub هذا](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">bzh</code></li>
<li class="list-inline-item"><code class="notranslate">gf</code></li>
<li class="list-inline-item"><code class="notranslate">gp</code></li>
<li class="list-inline-item"><code class="notranslate">mq</code></li>
<li class="list-inline-item"><code class="notranslate">nc</code></li>
<li class="list-inline-item"><code class="notranslate">pf</code></li>
<li class="list-inline-item"><code class="notranslate">pm</code></li>
<li class="list-inline-item"><code <li class="list-inline-item"><code class="notranslate">tf</code></li>
<li class="list-inline-item"><code class="notranslate">wf</code></li>
<li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

اعتبارًا من 8 يوليو 2025، أضفنا البلدان التالية الخاصة بأوروبا:

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

لم نقم على وجه التحديد بتضمين `cz`، و`ru`، و`ua` بسبب نشاط البريد العشوائي المرتفع.

### ما هي معايير القائمة المسموح بها لديك؟ {#what-is-your-allowlist-criteria}

لدينا قائمة ثابتة من [امتدادات اسم النطاق المسموح بها افتراضيًا](#what-domain-name-extensions-are-allowlisted-by-default) - ونقوم أيضًا بالحفاظ على قائمة مسموح بها ديناميكية ومخزنة مؤقتًا ومتجددة استنادًا إلى المعايير الصارمة التالية:

* يجب أن يكون نطاق جذر المُرسِل من نوع [امتداد اسم النطاق الذي يتطابق مع القائمة التي نقدمها في خطتنا المجانية](#what-domain-name-extensions-can-be-used-for-free) (مع إضافة `biz` و `info`). كما نُضمِّن التطابقات الجزئية `edu` و `gov` و `mil`، مثل `xyz.gov.au` و `xyz.edu.au`.
* يجب أن يكون نطاق جذر المُرسِل ضمن أفضل 100,000 نتيجة تحليل فريدة لنطاق جذر من [قائمة شعبية المظلة](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* يجب أن يكون نطاق جذر المُرسِل ضمن أفضل 50,000 نتيجة من نطاقات جذر فريدة تظهر في 4 أيام على الأقل من أصل 7 أيام من قوائم UPL (أكثر من 50%).
* يجب ألا يكون نطاق جذر المُرسِل [مصنفة](https://radar.cloudflare.com/categorization-feedback/) محتوى للبالغين أو برامج ضارة من قِبل Cloudflare.
* يجب أن يحتوي نطاق جذر المُرسِل على سجلات A أو MX مُعيَّنة.
* يجب أن يحتوي نطاق جذر المُرسِل على سجل (سجلات) A، أو سجل (سجلات) MX، أو سجل DMARC مع `p=reject` أو `p=quarantine`، أو سجل SPF مع المؤهل `-all` أو `~all`.

في حال استيفاء هذا المعيار، سيتم تخزين نطاق جذر المُرسِل مؤقتًا لمدة 7 أيام. يُرجى العلم بأن مهمتنا الآلية تعمل يوميًا، وبالتالي فهي عبارة عن ذاكرة تخزين مؤقتة لقائمة السماح المتجددة تُحدَّث يوميًا.

ستقوم مهمتنا الآلية بتنزيل الأيام السبعة السابقة من UPL الموجودة في الذاكرة، وفك ضغطها، ثم تحليل الذاكرة وفقًا للمعايير الصارمة المذكورة أعلاه.

تتضمن هذه القائمة بالطبع المجالات الشهيرة في وقت كتابة هذه السطور، مثل Google وYahoo وMicrosoft وAmazon وMeta وTwitter وNetflix وSpotify والمزيد.

إذا كنتَ مُرسِلًا غير مُدرج في قائمتنا المسموح بها، ففي أول مرة يُرسِل فيها نطاق جذر اسم النطاق الكامل المؤهل (FQDN) أو عنوان IP الخاص بك بريدًا إلكترونيًا، ستكون [معدل محدود](#do-you-have-rate-limiting) و[مُدرج في القائمة الرمادية](#do-you-have-a-greylist). يُرجى العلم أن هذه ممارسة مُتّبعة كمعيار للبريد الإلكتروني. ستُحاول مُعظم برامج خادم البريد الإلكتروني إعادة المحاولة إذا تلقّت خطأً في حدّ السرعة أو في القائمة الرمادية (مثل رمز حالة خطأ بمستوى 421 أو 4xx).

**لاحظ أن المرسلين المحددين مثل `a@gmail.com` و `b@xyz.edu` و `c@gov.au` لا يزالون قادرين على [تم رفضه](#do-you-have-a-denylist)** (على سبيل المثال، إذا اكتشفنا تلقائيًا رسائل البريد العشوائي أو التصيد الاحتيالي أو البرامج الضارة من هؤلاء المرسلين).

### ما هي امتدادات أسماء النطاقات التي يمكن استخدامها مجانًا {#what-domain-name-extensions-can-be-used-for-free}

اعتبارًا من 31 مارس 2023، قمنا بتطبيق قاعدة عامة جديدة بشأن البريد العشوائي لحماية مستخدمينا وخدماتنا.

تسمح هذه القاعدة الجديدة باستخدام امتدادات اسم النطاق التالية فقط في خطتنا المجانية:

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
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">by</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
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
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
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
<li class="list-inline-item"><code class="notranslate">lv</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">no</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code المملكة المتحدة
<li class="list-inline-item"><code class="notranslate">us</code></li>
<li class="list-inline-item"><code class="notranslate">uz</code></li>
<li class="list-inline-item"><code class="notranslate">vc</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">زا</code></li>
</ul>

### هل لديك قائمة رمادية {#do-you-have-a-greylist}

نعم، لدينا سياسة متساهلة جدًا ([القائمة الرمادية للبريد الإلكتروني](https://en.wikipedia.org/wiki/Greylisting_\(email\)). يُطبق الإدراج في القائمة الرمادية فقط على المُرسِلين غير المُدرجين في قائمتنا المسموح بها، ويستمر في ذاكرة التخزين المؤقت لدينا لمدة 30 يومًا.

لأي مُرسِل جديد، نُخزّن مفتاحًا في قاعدة بيانات Redis لمدة 30 يومًا بقيمة مُعيّنة لوقت الوصول الأولي لطلبه الأول. ثم نرفض رسالته الإلكترونية برمز إعادة المحاولة 450، ولا نسمح بمرورها إلا بعد مرور 5 دقائق.

إذا نجحوا في الانتظار لمدة 5 دقائق من وقت الوصول الأولي هذا، فسيتم قبول رسائل البريد الإلكتروني الخاصة بهم ولن يتلقوا رمز الحالة 450 هذا.

يتكون المفتاح إما من نطاق جذر اسم المجال المؤهل بالكامل (FQDN) أو عنوان IP للمُرسِل. هذا يعني أن أي نطاق فرعي يتجاوز القائمة الرمادية سيُصبح أيضًا نطاقًا جذرًا، والعكس صحيح (هذا ما نعنيه بسياسة "متساهلة للغاية").

على سبيل المثال، إذا ورد بريد إلكتروني من `test.example.com` قبل أن نتلقى بريدًا إلكترونيًا من `example.com`، فإن أي بريد إلكتروني من `test.example.com` و/أو `example.com` سينتظر 5 دقائق من وقت الوصول الأولي للاتصال. لا نجعل كلًا من `test.example.com` و `example.com` ينتظران 5 دقائق خاصة بهما (تنطبق سياسة القائمة الرمادية لدينا على مستوى نطاق الجذر).

يرجى ملاحظة أن القائمة الرمادية لا تنطبق على أي مرسل على [القائمة المسموح بها](#do-you-have-an-allowlist) (على سبيل المثال Meta وAmazon وNetflix وGoogle وMicrosoft في وقت كتابة هذه السطور).

### هل لديك قائمة حظر {#do-you-have-a-denylist}

نعم، نحن ندير قائمة الحظر الخاصة بنا ونقوم بتحديثها تلقائيًا في الوقت الفعلي ويدويًا بناءً على البريد العشوائي والأنشطة الضارة التي تم اكتشافها.

نقوم أيضًا بسحب جميع عناوين IP من قائمة الحظر UCEPROTECT Level 1 في <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> كل ساعة وإدخالها في قائمة الحظر الخاصة بنا مع انتهاء الصلاحية بعد 7 أيام.

سيتلقى المرسلون الموجودون في قائمة الرفض رمز الخطأ 421 (يشير إلى المرسل لإعادة المحاولة لاحقًا) إذا قاموا [غير مسموح بها](#do-you-have-an-allowlist).

من خلال استخدام رمز الحالة 421 بدلاً من رمز الحالة 554، يمكن التخفيف من احتمالية حدوث نتائج إيجابية خاطئة في الوقت الفعلي ومن ثم يمكن تسليم الرسالة بنجاح في المحاولة التالية.

**صُمم هذا بخلاف خدمات البريد الأخرى**، حيث يؤدي وضعك في قائمة الحظر إلى عطل دائم وصعب. غالبًا ما يكون من الصعب مطالبة المُرسِلين بإعادة إرسال الرسائل (خاصةً من المؤسسات الكبيرة)، ولذلك يمنح هذا النهج المُرسِل أو المُستلِم أو نحن حوالي 5 أيام من تاريخ المحاولة الأولى للتدخل وحل المشكلة (عن طريق طلب إزالة قائمة الحظر).

يتم مراقبة جميع طلبات إزالة القائمة المرفوضة في الوقت الفعلي بواسطة المسؤولين (على سبيل المثال، حتى يتمكن المسؤولون من إدراج الإيجابيات الخاطئة المتكررة في القائمة المرفوضة بشكل دائم).

يمكن تقديم طلبات إزالة القائمة المحظورة على <https://forwardemail.net/denylist>. تتم معالجة طلبات إزالة القائمة المحظورة للمستخدمين المدفوعين على الفور، بينما يتعين على المستخدمين غير المدفوعين انتظار المسؤولين لمعالجة طلباتهم.

سيتم إضافة المرسلين الذين يتم اكتشاف إرسالهم لمحتوى غير مرغوب فيه أو فيروسي إلى قائمة الرفض بالطريقة التالية:

١. يُدرج [بصمة الرسالة الأولية](#how-do-you-determine-an-email-fingerprint) في القائمة الرمادية عند اكتشاف رسائل غير مرغوب فيها أو رسائل محظورة من مُرسِل "موثوق" (مثل `gmail.com`، `microsoft.com`، `apple.com`).
* إذا كان المُرسِل مُدرجًا في القائمة المسموح بها، تُدرج الرسالة في القائمة الرمادية لمدة ساعة واحدة.
* إذا لم يكن المُرسِل مُدرجًا في القائمة المسموح بها، تُدرج الرسالة في القائمة الرمادية لمدة 6 ساعات.
٢. نُحلل مفاتيح القائمة المحظورة من معلومات المُرسِل والرسالة، ولكلٍّ من هذه المفاتيح، نُنشئ عدادًا (إن لم يكن موجودًا بالفعل)، ونزيده بمقدار ١، ونُخزّنه مؤقتًا لمدة ٢٤ ساعة.
* للمُرسِلين المُدرَجين في القائمة المسموح بها:
* أضف مفتاحًا لعنوان البريد الإلكتروني للمغلف "MAIL FROM" إذا كان لديه SPF مُفعَّل أو بدون SPF، ولم يكن [اسم مستخدم مدير مكتب البريد](#what-are-postmaster-addresses) أو [اسم المستخدم بدون رد](#what-are-no-reply-addresses).
* إذا كان رأس "From" مُدرَجًا في القائمة المسموح بها، فأضف مفتاحًا لعنوان البريد الإلكتروني للمغلف "From" إذا كان لديه SPF مُفعَّل أو DKIM مُفعَّل ومُحاذي.
* إذا لم يكن رأس "From" مُدرَجًا في القائمة المسموح بها، فأضف مفتاحًا لعنوان البريد الإلكتروني للمغلف "From" واسم نطاقه الجذري المُحلَّل.
* للمُرسِلين غير المُدرَجين في القائمة المسموح بها:
* أضف مفتاحًا لعنوان البريد الإلكتروني للمغلف "MAIL FROM" إذا كان لديه SPF مُفعَّل.
* إذا كان رأس "From" مُدرَجًا في القائمة المسموح بها، فأضف مفتاحًا لعنوان البريد الإلكتروني للمغلف "From" إذا كان لديه SPF مُفعَّل أو DKIM مُفعَّل ومُحاذي. * إذا لم يكن عنوان "من" مدرجًا في القائمة المسموح بها، فأضف مفتاحًا لعنوان البريد الإلكتروني في العنوان "من" واسم نطاقه الجذري المُحلل.
* أضف مفتاحًا لعنوان IP البعيد للمُرسِل.
* أضف مفتاحًا لاسم المضيف الذي حلّه العميل عن طريق البحث العكسي من عنوان IP للمُرسِل (إن وُجد).
* أضف مفتاحًا للنطاق الجذر لاسم المضيف الذي حلّه العميل (إن وُجد، وإذا كان مختلفًا عن اسم المضيف الذي حلّه العميل).

3. إذا وصل العداد إلى 5 لمُرسِل ومفتاح غير مدرجين في القائمة المسموح بها، فسيتم حظر المفتاح لمدة 30 يومًا، وسيتم إرسال بريد إلكتروني إلى فريق إساءة الاستخدام لدينا. قد تتغير هذه الأرقام وسيتم تحديثها هنا أثناء مراقبة إساءة الاستخدام.

4. إذا وصل العداد إلى 10 لمُرسِل ومفتاح مدرجين في القائمة المسموح بها، فسيتم حظر المفتاح لمدة 7 أيام، وسيتم إرسال بريد إلكتروني إلى فريق إساءة الاستخدام لدينا. قد تتغير هذه الأرقام وسيتم تحديثها هنا أثناء مراقبة إساءة الاستخدام.

> **ملاحظة:** سنُطلق قريبًا ميزة مراقبة السمعة. ستحسب هذه الميزة متى يجب حظر مُرسِل بناءً على نسبة مئوية (بدلاً من عدّاد بدائي كما ذُكر سابقًا).

### هل لديك حد للسرعة؟ {#do-you-have-rate-limiting}

يتم تحديد معدل الإرسال إما عن طريق تحليل نطاق الجذر من خلال بحث عكسي عن PTR على عنوان IP الخاص بالمرسل، أو إذا لم يُسفر ذلك عن نتيجة، فسيتم ببساطة استخدام عنوان IP الخاص بالمرسل. يُرجى ملاحظة أننا نشير إلى هذا باسم `Sender` أدناه.

لدى خوادم MX الخاصة بنا حدود يومية للبريد الوارد المستلم لـ [تخزين IMAP المشفر](/blog/docs/best-quantum-safe-encrypted-email-service):

* بدلاً من تحديد معدل الرسائل الواردة بناءً على اسم مستعار فردي (مثل `you@yourdomain.com`)، نقوم بتحديد المعدل بناءً على اسم نطاق الاسم المستعار نفسه (مثل `yourdomain.com`). هذا يمنع `Senders` من إغراق صناديق الوارد بجميع الأسماء المستعارة في نطاقك دفعة واحدة. * لدينا حدود عامة تُطبق على جميع رسائل `Senders` عبر خدمتنا، بغض النظر عن المُستلِم:

* رسائل `Senders` التي نعتبرها "موثوقة" كمصدر موثوق (مثل `gmail.com`، `microsoft.com`، `apple.com`) محدودة بإرسال 100 جيجابايت يوميًا.

* رسائل `Senders` التي تحمل [مدرج في القائمة المسموح بها](#do-you-have-an-allowlist) محدودة بإرسال 10 جيجابايت يوميًا.

* جميع رسائل `Senders` الأخرى محدودة بإرسال 1 جيجابايت و/أو 1000 رسالة يوميًا.

* لدينا حد محدد لكل `Sender` و `yourdomain.com` وهو 1 جيجابايت و/أو 1000 رسالة يوميًا.

تقوم خوادم MX أيضًا بالحد من الرسائل التي يتم إعادة توجيهها إلى مستلم واحد أو أكثر من خلال تحديد المعدل - ولكن هذا ينطبق فقط على `Senders` وليس على [القائمة المسموح بها](#do-you-have-an-allowlist):

* نسمح فقط بما يصل إلى ١٠٠ اتصال في الساعة، لكل نطاق جذر FQDN مُحلَّل (أو) عنوان IP بعيد (في حال عدم توفر PTR عكسي)، ولكل مستلم مظروف. نخزن المفتاح لتحديد السرعة كتجزئة تشفيرية في قاعدة بيانات Redis الخاصة بنا.

* إذا كنت ترسل بريدًا إلكترونيًا عبر نظامنا، فيرجى التأكد من إعداد PTR عكسي لجميع عناوين IP الخاصة بك (وإلا فسيتم تقييد معدل كل نطاق جذر FQDN فريد أو عنوان IP ترسل منه).

* لاحظ أنه إذا قمت بالإرسال عبر نظام شائع مثل Amazon SES، فلن يتم تقييد سعرك نظرًا لأن (في وقت كتابة هذه السطور) Amazon SES مدرج في القائمة المسموح بها لدينا.

* إذا كنت ترسل من نطاق مثل `test.abc.123.example.com`، فسيتم فرض حد السرعة على `example.com`. يستخدم العديد من مرسلي البريد العشوائي مئات النطاقات الفرعية للالتفاف على مرشحات البريد العشوائي الشائعة التي تفرض حدًا أقصى على أسماء المضيفين الفريدة فقط، بدلاً من نطاقات الجذر المؤهلة بالكامل (FQDN) الفريدة.

* `Senders` التي تتجاوز حد المعدل سيتم رفضها مع الخطأ 421.

تحد خوادم IMAP وSMTP الخاصة بنا من حصول الأسماء المستعارة الخاصة بك على أكثر من `60` اتصالات متزامنة في وقت واحد.

تقوم خوادم MX الخاصة بنا بتقييد المرسلين [غير مدرج في القائمة المسموح بها](#do-you-have-an-allowlist) من إنشاء أكثر من 10 اتصالات متزامنة (مع انتهاء صلاحية ذاكرة التخزين المؤقت لمدة 3 دقائق للعداد، وهو ما يعكس مهلة المقبس الخاصة بنا لمدة 3 دقائق).

### كيف تحمي نفسك من التشتت الخلفي؟ {#how-do-you-protect-against-backscatter}

يمكن أن تتسبب الارتدادات الموجهة بشكل خاطئ أو رسائل البريد العشوائي المرتد (المعروفة باسم "[التشتت الخلفي](https://en.wikipedia.org/wiki/Backscatter_\(email\))") في سمعة سلبية لعناوين IP الخاصة بالمرسل.

نحن نتخذ خطوتين للحماية من التشتت الخلفي، والتي تم تفصيلها في الأقسام التالية [منع ارتدادات البريد من مرسلي البريد العشوائي المعروفين](#prevent-bounces-from-known-mail-from-spammers) و [منع الارتدادات غير الضرورية للحماية من التشتت الخلفي](#prevent-unnecessary-bounces-to-protect-against-backscatter) أدناه.

### منع ارتدادات البريد من مرسلي البريد العشوائي المعروفين {#prevent-bounces-from-known-mail-from-spammers}

نقوم بسحب القائمة من [Backscatter.org](https://www.backscatterer.org/) (مدعومة بواسطة [UCEPROTECT](https://www.uceprotect.net/)) في <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> كل ساعة ونقوم بإدخالها في قاعدة بيانات Redis الخاصة بنا (نقوم أيضًا بمقارنة الفرق مسبقًا؛ في حالة إزالة أي عناوين IP تحتاج إلى الالتزام).

إذا كان MAIL FROM فارغًا أو مساويًا (غير حساس لحالة الأحرف) لأي من [عناوين مدير مكتب البريد](#what-are-postmaster-addresses) (الجزء قبل @ في البريد الإلكتروني)، فإننا نتحقق لمعرفة ما إذا كان عنوان IP الخاص بالمرسل يتطابق مع أحد العناوين من هذه القائمة.

إذا كان عنوان IP للمُرسِل مُدرجًا (وليس مُدرجًا في [القائمة المسموح بها](#do-you-have-an-allowlist))، فسنُرسل خطأ 554 مع الرسالة `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. سيتم تنبيهنا إذا كان المُرسِل مُدرجًا في قائمتي المُشتت الخلفي والقائمة المسموح بها، حتى نتمكن من حل المشكلة عند الحاجة.

تلتزم التقنيات الموضحة في هذا القسم بتوصية "الوضع الآمن" في <https://www.backscatterer.org/?target=usage> - حيث نتحقق فقط من عنوان IP الخاص بالمرسل إذا تم استيفاء شروط معينة بالفعل.

### منع الارتدادات غير الضرورية للحماية من التشتت الخلفي {#prevent-unnecessary-bounces-to-protect-against-backscatter}

الارتدادات هي رسائل بريد إلكتروني تشير إلى فشل إعادة توجيه البريد الإلكتروني إلى المستلم تمامًا ولن تتم إعادة محاولة إرسال البريد الإلكتروني.

السبب الشائع لإدراجك في قائمة Backscatterer هو الارتدادات الموجهة بشكل خاطئ أو البريد العشوائي المرتد، لذا يتعين علينا الحماية من ذلك بعدة طرق:

1. نرسل فقط عندما تحدث أخطاء رمز الحالة >= 500 (عندما تفشل محاولات إعادة توجيه رسائل البريد الإلكتروني، على سبيل المثال، يستجيب Gmail بخطأ مستوى 500).

٢. نرسل مرة واحدة فقط (نستخدم مفتاح بصمة ارتداد محسوبًا ونخزنه في ذاكرة التخزين المؤقت لمنع إرسال رسائل مكررة). بصمة الارتداد هي مفتاح بصمة الرسالة، مضافًا إليه تجزئة عنوان الارتداد ورمز الخطأ الخاص به. راجع قسم [بصمات الأصابع](#how-do-you-determine-an-email-fingerprint) لمزيد من المعلومات حول كيفية حساب بصمة الرسالة. تنتهي صلاحية بصمات الارتداد المرسلة بنجاح بعد ٧ أيام في ذاكرة التخزين المؤقت Redis.

3. نرسل فقط عندما لا يكون حقل "البريد من" و/أو "من" فارغًا ولا يحتوي على (غير حساس لحالة الأحرف) [اسم المستخدم مدير مكتب البريد](#what-are-postmaster-addresses) (الجزء قبل @ في البريد الإلكتروني).

4. لا نرسل الرسالة إذا كانت الرسالة الأصلية تحتوي على أي من العناوين التالية (غير حساسة لحالة الأحرف):

* رأس `auto-submitted` بقيمة لا تساوي `no`.
* رأس `x-auto-response-suppress` بقيمة `dr`، أو `autoreply`، أو `auto-reply`، أو `auto_reply`، أو `all`
* رأس `list-id`، أو `list-subscribe`، أو `list-unsubscribe`، أو `list-help`، أو `list-post`، أو `list-owner`، `list-archive`، أو `x-autoreply`، أو `x-autorespond`، أو `x-auto-respond` (بغض النظر عن القيمة).
* رأس `precedence` بقيمة `bulk`، أو `autoreply`، أو `auto-reply`، أو `auto_reply`، أو `list`.

5. لا نقوم بالإرسال إذا كان عنوان البريد الإلكتروني المرسل أو المرسل ينتهي بـ `+donotreply`، أو `-donotreply`، أو `+noreply`، أو `-noreply`.

6. لا نرسل إذا كان جزء اسم المستخدم في عنوان البريد الإلكتروني المرسل هو `mdaemon` وكان به رأس غير حساس لحالة الأحرف `X-MDDSN-Message`.

7. لا نرسل إذا كان هناك رأس `content-type` غير حساس لحالة الأحرف لـ `multipart/report`.

### كيف يمكنك تحديد بصمة البريد الإلكتروني {#how-do-you-determine-an-email-fingerprint}

يتم استخدام بصمة البريد الإلكتروني لتحديد مدى تفرد البريد الإلكتروني ومنع تسليم الرسائل المكررة وإرسال [الارتدادات المكررة](#prevent-unnecessary-bounces-to-protect-against-backscatter).

يتم حساب بصمة الإصبع من القائمة التالية:

* اسم مضيف FQDN أو عنوان IP المُحلَّل من قِبل العميل
* قيمة رأس `Message-ID` (إن وجدت)
* قيمة رأس `Date` (إن وجدت)
* قيمة رأس `From` (إن وجدت)
* قيمة رأس `To` (إن وجدت)
* قيمة رأس `Cc` (إن وجدت)
* قيمة رأس `Subject` (إن وجدت)
* قيمة `Body` (إن وجدت)

### هل يمكنني إعادة توجيه رسائل البريد الإلكتروني إلى منافذ أخرى غير 25 (على سبيل المثال إذا قام مزود خدمة الإنترنت الخاص بي بحظر المنفذ 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

نعم، أضفنا هذه الميزة اعتبارًا من 5 مايو 2020. حاليًا، الميزة مخصصة لنطاق محدد، وليست خاصة بالاسم المستعار. إذا كنت ترغب في أن تكون خاصة بالاسم المستعار، يُرجى التواصل معنا لإعلامنا باحتياجاتك.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">

حماية خصوصية مُحسّنة:
</strong>
<span>
إذا كنت مشتركًا في باقة مدفوعة (تتميز بحماية خصوصية مُحسّنة)، يُرجى الانتقال إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a>، والنقر على "إعدادات" بجوار نطاقك، ثم على "الإعدادات". لمعرفة المزيد عن الباقات المدفوعة، يُرجى زيارة صفحة <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">الأسعار</a>. أو يُمكنك متابعة التعليمات أدناه.
</span>
</div>

إذا كنت تستخدم الخطة المجانية، فما عليك سوى إضافة سجل DNS جديد <strong class="notranslate">TXT</strong> كما هو موضح أدناه، ولكن قم بتغيير المنفذ من 25 إلى المنفذ الذي تختاره.

على سبيل المثال، إذا كنت أريد إعادة توجيه جميع رسائل البريد الإلكتروني التي تذهب إلى `example.com` إلى منفذ SMTP الخاص بمستلمي الأسماء المستعارة وهو 1337 بدلاً من 25:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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

الحالة الأكثر شيوعًا لإعداد إعادة توجيه المنفذ المخصص هي عندما ترغب في إعادة توجيه جميع رسائل البريد الإلكتروني المرسلة إلى example.com إلى منفذ مختلف على example.com، بخلاف منفذ SMTP القياسي 25. لإعداد هذا، ما عليك سوى إضافة سجل <strong class="notranslate">TXT</strong> الشامل التالي.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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

### هل يدعم رمز الجمع + لأسماء Gmail البديلة؟ {#does-it-support-the-plus--symbol-for-gmail-aliases}

نعم بالتأكيد.

### هل يدعم النطاقات الفرعية {#does-it-support-sub-domains}

نعم، بالتأكيد. بدلاً من استخدام "@" أو "." أو فراغ كاسم/مضيف/اسم مستعار، استخدم اسم النطاق الفرعي كقيمة.

إذا كنت تريد أن يقوم `foo.example.com` بإعادة توجيه رسائل البريد الإلكتروني، فأدخل `foo` كقيمة الاسم/المضيف/الاسم المستعار في إعدادات DNS (لسجلات MX و<strong class="notranslate">TXT</strong>).

### هل يؤدي هذا إلى إعادة توجيه عناوين بريدي الإلكتروني {#does-this-forward-my-emails-headers}

نعم بالتأكيد.

### هل تم اختبار هذا جيدًا؟ {#is-this-well-tested}

نعم، يحتوي على اختبارات مكتوبة باستخدام [افا](https://github.com/avajs/ava) ويحتوي أيضًا على تغطية للكود.

### هل تقوم بتمرير رسائل ورموز استجابة SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

نعم، بالتأكيد. على سبيل المثال، إذا كنت ترسل بريدًا إلكترونيًا إلى `hello@example.com` وكان مُسجَّلاً لإعادة التوجيه إلى `user@gmail.com`، فسيتم إرجاع رسالة استجابة SMTP والرمز من خادم SMTP الخاص بـ "gmail.com" بدلاً من خادم الوكيل على "mx1.forwardemail.net" أو "mx2.forwardemail.net".

### كيف تمنع مرسلي البريد العشوائي وتضمن سمعة جيدة في إعادة توجيه البريد الإلكتروني؟ {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

راجع أقسامنا حول [كيف يعمل نظام إعادة توجيه البريد الإلكتروني الخاص بك](#how-does-your-email-forwarding-system-work)، و[كيف تتعامل مع مشكلات تسليم البريد الإلكتروني](#how-do-you-handle-email-delivery-issues)، و[كيف تتعامل مع حظر عناوين IP الخاصة بك؟](#how-do-you-handle-your-ip-addresses-becoming-blocked) أعلاه.

### كيف يمكنك إجراء عمليات بحث DNS على أسماء النطاقات {#how-do-you-perform-dns-lookups-on-domain-names}

أنشأنا مشروع برمجي مفتوح المصدر :tangerine: [اليوسفي](https://github.com/forwardemail/tangerine) ونستخدمه لعمليات بحث DNS. خوادم DNS الافتراضية المستخدمة هي `1.1.1.1` و `1.0.0.1`، ويتم إجراء استعلامات DNS من خلال [DNS عبر HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") في طبقة التطبيقات.

:tangerine: [اليوسفي](https://github.com/tangerine) يستخدم [خدمة DNS للمستهلك التي تضع الخصوصية أولاً في المقام الأول من CloudFlare بشكل افتراضي][cloudflare-dns].

## الحساب والفواتير {#account-and-billing}

### هل تقدمون ضمان استرداد الأموال على الخطط المدفوعة؟ {#do-you-offer-a-money-back-guarantee-on-paid-plans}

نعم! يتم استرداد المبالغ المدفوعة تلقائيًا عند ترقية حسابك أو تخفيضه أو إلغائه خلال 30 يومًا من تاريخ بدء اشتراكك. ينطبق هذا فقط على العملاء الجدد.

### إذا قمت بتبديل الخطط، فهل تقومون بتوزيع التكلفة واسترداد الفرق؟ {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

لا نقوم بتوزيع الاشتراكات أو برد الفرق عند تغيير باقتك. بدلاً من ذلك، نقوم بتحويل المدة المتبقية من تاريخ انتهاء صلاحية باقتك الحالية إلى أقرب مدة نسبية لباقتك الجديدة (مقربًا بالشهر).

يرجى ملاحظة أنه إذا قمت بالترقية أو التخفيض بين الخطط المدفوعة خلال فترة 30 يومًا منذ بدء خطة مدفوعة لأول مرة، فسوف نقوم تلقائيًا برد المبلغ بالكامل من خطتك الحالية.

### هل يمكنني استخدام خدمة إعادة توجيه البريد الإلكتروني هذه كخادم MX "احتياطي" أو "مؤقت"؟ {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

لا، لا يُنصح بذلك، إذ لا يمكنك استخدام سوى خادم تبادل بريد إلكتروني واحد في كل مرة. عادةً لا تُعاد محاولة استخدام البدائل بسبب أخطاء في إعدادات الأولوية وعدم التزام خوادم البريد الإلكتروني بفحص أولوية تبادل البريد الإلكتروني.

### هل يمكنني تعطيل أسماء مستعارة معينة {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
إذا كنت مشتركًا في باقة مدفوعة، فعليك الانتقال إلى <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة <i class="fa fa-angle-right"></i> تعديل الاسم المستعار <i class="fa fa-angle-right"></i> إلغاء تحديد مربع الاختيار "نشط" <i class="fa fa-angle-right"></i> متابعة.
</span>
</div>

نعم، ما عليك سوى تعديل سجل DNS <strong class="notranslate">TXT</strong> الخاص بك وإضافة بادئة للاسم المستعار إما بعلامة تعجب واحدة أو اثنتين أو ثلاث علامات تعجب (انظر أدناه).

لاحظ أنه *يجب* عليك الحفاظ على تعيين ":"، حيث أن هذا مطلوب إذا قررت إيقاف تشغيله (ويستخدم أيضًا للاستيراد إذا قمت بالترقية إلى إحدى خططنا المدفوعة).

**للرفض الهادئ (يبدو للمرسل كما لو أن الرسالة تم إرسالها بنجاح، ولكنها في الواقع لا تذهب إلى أي مكان) (رمز الحالة `250`):** إذا قمت بإضافة بادئة "!" (علامة تعجب واحدة) إلى اسم مستعار، فسوف يعيد رمز حالة ناجح `250` إلى المرسلين الذين يحاولون الإرسال إلى هذا العنوان، ولكن رسائل البريد الإلكتروني نفسها لن تذهب إلى أي مكان (على سبيل المثال، ثقب أسود أو `/dev/null`).

**بالنسبة للرفض الناعم (رمز الحالة `421`):** إذا قمت بإضافة بادئة "!!" (علامة تعجب مزدوجة) إلى اسم مستعار، فسوف يتم إرجاع رمز حالة خطأ ناعم `421` إلى المرسلين الذين يحاولون الإرسال إلى هذا العنوان، وغالبًا ما تتم إعادة محاولة إرسال رسائل البريد الإلكتروني لمدة تصل إلى 5 أيام قبل الرفض والارتداد.

**بالنسبة للرفض النهائي (رمز الحالة `550`):** إذا قمت بإضافة البادئة "!!!" (علامة تعجب ثلاثية) إلى اسم مستعار، فسوف يتم إرجاع رمز حالة خطأ دائم `550` إلى المرسلين الذين يحاولون الإرسال إلى هذا العنوان وسيتم رفض رسائل البريد الإلكتروني وترتد.

على سبيل المثال، إذا كنت أريد أن تتوقف جميع رسائل البريد الإلكتروني التي تذهب إلى `alias@example.com` عن التدفق إلى `user@gmail.com` ويتم رفضها وترتد (على سبيل المثال، استخدم ثلاث علامات تعجب):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
يمكنك أيضًا إعادة كتابة عنوان المستلم المُعاد توجيهه إلى "nobody@forwardemail.net"، مما سيؤدي إلى عدم توجيهه إلى أي شخص كما في المثال أدناه.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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
إذا كنت ترغب في زيادة الأمان، يمكنك أيضًا إزالة الجزء ":user@gmail.com" (أو ":nobody@forwardemail.net")، مع ترك "!!!alias" فقط كما في المثال أدناه.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
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

### هل يمكنني إعادة توجيه رسائل البريد الإلكتروني إلى عدة مستلمين؟ {#can-i-forward-emails-to-multiple-recipients}

نعم، بالتأكيد. ما عليك سوى تحديد عدة مستلمين في سجلات <strong class="notranslate">TXT</strong>.

على سبيل المثال، إذا كنت أريد توجيه بريد إلكتروني يذهب إلى `hello@example.com` إلى `user+a@gmail.com` و`user+b@gmail.com`، فسيبدو سجل <strong class="notranslate">TXT</strong> الخاص بي على هذا النحو:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
<th>النوع</th>
<th>الإجابة/القيمة</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@" أو "." أو فارغ</em></td>
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
<th class="text-center">مدة البقاء</th>
<th>النوع</th>
<th>الإجابة/القيمة</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", أو فراغ</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", ".", أو فراغ</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

الأمر متروك لك!

### هل يمكنني الحصول على عدة مستلمين عالميين شاملين؟ {#can-i-have-multiple-global-catch-all-recipients}

نعم، يمكنك ذلك. ما عليك سوى تحديد عدة مستلمين عالميين في سجلات <strong class="notranslate">TXT</strong>.

على سبيل المثال، إذا كنت أريد إعادة توجيه كل بريد إلكتروني يذهب إلى `*@example.com` (النجمة تعني أنه حرف بدل أو ما شابه ذلك) إلى `user+a@gmail.com` و `user+b@gmail.com`، فإن سجل <strong class="notranslate">TXT</strong> الخاص بي سيبدو كما يلي:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>الاسم/المضيف/الاسم المستعار</th>
<th class="text-center">مدة البقاء</th>
<th>النوع</th>
<th>الإجابة/القيمة</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@" أو "." أو فارغ</em></td>
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
<th class="text-center">مدة البقاء</th>
<th>النوع</th>
<th>الإجابة/القيمة</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", أو فراغ</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, ".", أو فراغ</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

الأمر متروك لك!

### هل يوجد حد أقصى لعدد عناوين البريد الإلكتروني التي يمكنني إعادة توجيهها لكل اسم مستعار {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

نعم، الحد الأقصى الافتراضي هو 10. هذا لا يعني أنه يمكنك استخدام 10 أسماء مستعارة فقط على اسم نطاقك. يمكنك استخدام أي عدد تريده من الأسماء المستعارة (عدد غير محدود). هذا يعني أنه يمكنك إعادة توجيه اسم مستعار واحد فقط إلى 10 عناوين بريد إلكتروني فريدة. يمكنك استخدام `hello:user+1@gmail.com`، `hello:user+2@gmail.com`، `hello:user+3@gmail.com`، ... (من 1 إلى 10) - وأي رسائل بريد إلكتروني إلى `hello@example.com` ستُعاد توجيهها إلى `user+1@gmail.com`، `user+2@gmail.com`، `user+3@gmail.com`، ... (من 1 إلى 10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
نصيحة:
</strong>
<span>
هل تحتاج لأكثر من ١٠ مستلمين لكل اسم مستعار؟ راسلنا عبر البريد الإلكتروني، وسيسعدنا زيادة حد حساباتك.
</span>
</div>

### هل يمكنني إعادة توجيه رسائل البريد الإلكتروني بشكل متكرر {#can-i-recursively-forward-emails}

نعم، يمكنك ذلك، ولكن يجب عليك الالتزام بالحد الأقصى. إذا كان لديك `hello:linus@example.com` و`linus:user@gmail.com`، فسيتم إعادة توجيه رسائل البريد الإلكتروني المرسلة إلى `hello@example.com` إلى `linus@example.com` و`user@gmail.com`. يُرجى ملاحظة أنه سيتم عرض خطأ إذا حاولت إعادة توجيه رسائل البريد الإلكتروني بشكل متكرر بعد تجاوز الحد الأقصى.

### هل يمكن للأشخاص إلغاء التسجيل أو تسجيل إعادة توجيه بريدي الإلكتروني دون إذني {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

نستخدم التحقق من سجلات MX و<strong class="notranslate">TXT</strong>، لذا إذا أضفتَ سجلات MX و<strong class="notranslate">TXT</strong> الخاصة بهذه الخدمة، فأنتَ مُسجَّل. إذا أزلتَها، فأنتَ غير مُسجَّل. أنت تملك نطاقك وإدارة DNS، لذا إذا كان بإمكان أي شخص الوصول إليها، فهذه مشكلة.

### كيف يكون مجانيًا {#how-is-it-free}

يقدم Forward Email طبقة مجانية من خلال مجموعة من التطوير مفتوح المصدر والبنية الأساسية الفعالة والخطط المدفوعة الاختيارية التي تدعم الخدمة.

يتم دعم المستوى المجاني لدينا بواسطة:

1. **التطوير مفتوح المصدر**: قاعدة الكود الخاصة بنا مفتوحة المصدر، مما يسمح بمساهمات المجتمع والتشغيل الشفاف.

2. **البنية التحتية الفعالة**: لقد قمنا بتحسين أنظمتنا للتعامل مع إعادة توجيه البريد الإلكتروني باستخدام الحد الأدنى من الموارد.

3. **خطط الدفع المميزة**: يمكن للمستخدمين الذين يحتاجون إلى ميزات إضافية مثل إرسال SMTP أو استلام IMAP أو خيارات الخصوصية المحسنة الاشتراك في خططنا المدفوعة.

4. **حدود الاستخدام المعقولة**: تتمتع الطبقة المجانية بسياسات الاستخدام العادل لمنع إساءة الاستخدام.

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### ما هو الحد الأقصى لحجم البريد الإلكتروني {#what-is-the-max-email-size-limit}

الحد الأقصى للحجم الافتراضي هو 50 ميغابايت، ويشمل المحتوى والرؤوس والمرفقات. يُرجى العلم أن خدمات مثل Gmail وOutlook تسمح فقط بـ 25 ميغابايت، وفي حال تجاوز الحد عند الإرسال إلى عناوين لدى هذه الخدمات، ستتلقى رسالة خطأ.

يتم إرجاع خطأ في رمز الاستجابة الصحيح إذا تم تجاوز حد حجم الملف.

### هل تقوم بتخزين سجلات رسائل البريد الإلكتروني {#do-you-store-logs-of-emails}

لا، نحن لا نكتب على القرص أو نخزن السجلات - باستخدام [استثناء الأخطاء](#do-you-store-error-logs) و [SMTP الصادر](#do-you-support-sending-email-with-smtp) (راجع [سياسة الخصوصية](/privacy)).

يتم تنفيذ كل شيء في الذاكرة و[كود المصدر الخاص بنا موجود على GitHub](https://github.com/forwardemail).

### هل تقوم بتخزين سجلات الأخطاء {#do-you-store-error-logs}

**نعم. يمكنك الوصول إلى سجلات الأخطاء ضمن [حسابي → السجلات](/my-account/logs) أو [حسابي → النطاقات](/my-account/domains).**

اعتبارًا من فبراير 2023، نقوم بتخزين سجلات الأخطاء لرموز استجابة SMTP `4xx` و `5xx` لمدة 7 أيام - والتي تحتوي على خطأ SMTP والمغلف ورؤوس البريد الإلكتروني (نحن **لا** نخزن نص البريد الإلكتروني أو المرفقات).

تتيح لك سجلات الأخطاء التحقق من رسائل البريد الإلكتروني المهمة المفقودة والحد من ظهور نتائج إيجابية خاطئة للرسائل غير المرغوب فيها فيما يتعلق بـ [نطاقاتك](/my-account/domains). كما أنها مصدر ممتاز لاستكشاف أخطاء [خطافات البريد الإلكتروني](#do-you-support-webhooks) وإصلاحها (لأن سجلات الأخطاء تحتوي على استجابة نقطة نهاية خطاف الويب).

لا يمكن الوصول إلى سجلات الأخطاء الخاصة بـ [تحديد المعدل](#do-you-have-rate-limiting) و [القائمة الرمادية](#do-you-have-a-greylist) نظرًا لأن الاتصال ينتهي مبكرًا (على سبيل المثال، قبل أن يتم إرسال الأوامر `RCPT TO` و `MAIL FROM`).

راجع [سياسة الخصوصية](/privacy) لمزيد من المعلومات.

### هل تقرأ رسائل البريد الإلكتروني الخاصة بي؟ {#do-you-read-my-emails}

لا، على الإطلاق. راجع [سياسة الخصوصية](/privacy).

تخزن العديد من خدمات إعادة توجيه البريد الإلكتروني الأخرى رسائلك الإلكترونية، وقد تقرأها. لا داعي لتخزين رسائل البريد الإلكتروني المُعاد توجيهها على القرص الصلب، ولذلك صممنا أول حل مفتوح المصدر يُجري كل ذلك في الذاكرة.

نؤمن بحقك في الخصوصية، ونحترمه تمامًا. الكود المُستخدم على الخادم مُحمي بـ [برمجيات مفتوحة المصدر على GitHub](https://github.com/forwardemail) لضمان الشفافية وبناء الثقة.

### هل يمكنني "إرسال البريد باسم" في Gmail باستخدام هذا {#can-i-send-mail-as-in-gmail-with-this}

نعم! اعتبارًا من ٢ أكتوبر ٢٠١٨، أضفنا هذه الميزة. انظر [كيفية إرسال البريد باسم باستخدام Gmail](#how-to-send-mail-as-using-gmail) أعلاه!

يجب عليك أيضًا تعيين سجل SPF لـ Gmail في سجل <strong class="notranslate">TXT</strong> لتكوين DNS الخاص بك.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
إذا كنت تستخدم Gmail (مثل إرسال البريد باسم) أو G Suite، فستحتاج إلى إضافة <code>include:_spf.google.com</code> إلى سجل SPF <strong class="notranslate">TXT</strong>، على سبيل المثال:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### هل يمكنني "إرسال البريد باسم" في Outlook باستخدام هذا {#can-i-send-mail-as-in-outlook-with-this}

نعم! ابتداءً من ٢ أكتوبر ٢٠١٨، أضفنا هذه الميزة. ما عليك سوى الاطلاع على هذين الرابطين من مايكروسوفت أدناه:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

يجب عليك أيضًا تعيين سجل SPF لبرنامج Outlook في سجل <strong class="notranslate">TXT</strong> الخاص بتكوين DNS.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
هام:
</strong>
<span>
إذا كنت تستخدم Microsoft Outlook أو Live.com، فستحتاج إلى إضافة <code>include:spf.protection.outlook.com</code> إلى سجل SPF <strong class="notranslate">TXT</strong>، على سبيل المثال:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### هل يمكنني "إرسال البريد باسم" في Apple Mail و iCloud Mail باستخدام هذا {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

إذا كنت مشتركًا في iCloud+، فيمكنك استخدام نطاق مخصص. [خدمتنا متوافقة أيضًا مع Apple Mail](#apple-mail).

يرجى الاطلاع على <https://support.apple.com/en-us/102540> لمزيد من المعلومات.

### هل يمكنني إعادة توجيه عدد غير محدود من رسائل البريد الإلكتروني باستخدام هذا {#can-i-forward-unlimited-emails-with-this}

نعم، ولكن بالنسبة للمرسلين "غير المعروفين نسبيًا"، يقتصر معدل الاتصال على 100 اتصال في الساعة لكل اسم مضيف أو عنوان IP. راجع قسمي [تحديد المعدل](#do-you-have-rate-limiting) و[القائمة الرمادية](#do-you-have-a-greylist) أعلاه.

بـ "غير معروف نسبيًا"، فإننا نعني المرسلين الذين لا يظهرون في [القائمة المسموح بها](#do-you-have-an-allowlist).

إذا تم تجاوز هذا الحد، فإننا نرسل رمز استجابة 421 الذي يخبر خادم البريد الخاص بالمرسل بإعادة المحاولة لاحقًا.

### هل تقدمون عددًا غير محدود من النطاقات بسعر واحد؟ {#do-you-offer-unlimited-domains-for-one-price}

نعم. بغض النظر عن الباقة التي تختارها، ستدفع رسمًا شهريًا واحدًا فقط، يغطي جميع نطاقاتك.

### ما هي طرق الدفع التي تقبلونها؟ {#which-payment-methods-do-you-accept}

تقبل خدمة Forward Email طرق الدفع التالية لمرة واحدة أو شهرية/ربع سنوية/سنوية:

١. **بطاقات الائتمان/الخصم/التحويلات المصرفية**: فيزا، ماستركارد، أمريكان إكسبريس، ديسكوفر، جيه سي بي، داينرز كلوب، إلخ.
٢. **باي بال**: اربط حساب باي بال الخاص بك لتسهيل الدفع.
٣. **العملات المشفرة**: نقبل الدفع عبر عملة سترايب المستقرة على شبكات إيثريوم، بوليجون، وسولانا.

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

تتم معالجة جميع المدفوعات بأمان عبر Stripe أو PayPal. لا يتم تخزين بيانات دفعك على خوادمنا.

## موارد إضافية {#additional-resources}

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [دراسات الحالة ووثائق المطورين](/blog/docs)
* [موارد](/resources)
* [أدلة](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/