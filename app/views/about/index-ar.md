# حول إعادة توجيه البريد الإلكتروني {#about-forward-email}

<img تحميل="كسول" src="/img/articles/about.webp" alt="" class="rounded-lg" />

# About Forward Email {#about-forward-email-1}

## جدول المحتويات {#table-of-contents}

* [ملخص](#overview)
* [المؤسس والرسالة](#founder-and-mission)
* [الجدول الزمني](#timeline)
  * [2017 - التأسيس والإطلاق](#2017---founding-and-launch)
  * [2018 - البنية التحتية والتكامل](#2018---infrastructure-and-integration)
  * [2019 - ثورة الأداء](#2019---performance-revolution)
  * [2020 - التركيز على الخصوصية والأمان](#2020---privacy-and-security-focus)
  * [2021 - تحديث المنصة](#2021---platform-modernization)
  * [2023 - توسيع البنية التحتية والميزات](#2023---infrastructure-and-feature-expansion)
  * [2024 - تحسين الخدمة والميزات المتقدمة](#2024---service-optimization-and-advanced-features)
  * [2025 - الابتكار المستمر](#2025---continued-innovation)
* [المبادئ الأساسية](#core-principles)
* [الحالة الحالية](#current-status)

## Overview {#overview}

> \[!TIP]
> For technical details about our architecture, security implementations, and roadmap, see the [Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

إعادة توجيه البريد الإلكتروني هي خدمة [مجاني ومفتوح المصدر](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [إعادة توجيه البريد الإلكتروني](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") تُركز على [الحق في الخصوصية](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") المستخدم. ما بدأ كحل بسيط لإعادة توجيه البريد الإلكتروني في عام 2017 تطور إلى منصة بريد إلكتروني شاملة تُقدم عددًا غير محدود من أسماء النطاقات المخصصة، وعناوين البريد الإلكتروني والأسماء المستعارة، وعناوين البريد الإلكتروني المؤقتة، وحماية من البريد العشوائي والتصيد الاحتيالي، وتخزينًا مشفرًا لصناديق البريد، والعديد من الميزات المتقدمة.

الخدمة مملوكة ومدارة من قِبل فريقها المؤسس الأصلي من المصممين والمطورين. صُممت باستخدام برمجيات مفتوحة المصدر 100% باستخدام [جافا سكريبت](https://en.wikipedia.org/wiki/JavaScript "JavaScript")، و[Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")، و[DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")، و[HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS")، و[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS")، و[SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Founder and Mission {#founder-and-mission}

Forward Email was founded by **Nicholas Baugh** in 2017. According to the [ورقة بيضاء فنية حول إعادة توجيه البريد الإلكتروني](https://forwardemail.net/technical-whitepaper.pdf), Baugh was initially searching for a cost-effective and simple solution for enabling email on domain names for his side-projects. After researching available options, he began coding his own solution and purchased the domain `forwardemail.net` on October 2, 2017.

تتجاوز مهمة شركة Forward Email تقديم خدمات البريد الإلكتروني، بل تهدف إلى تغيير طريقة تعامل القطاع مع خصوصية البريد الإلكتروني وأمانه. تشمل قيم الشركة الأساسية الشفافية، وتحكم المستخدم، وحماية الخصوصية من خلال التنفيذ التقني، وليس مجرد وعود بالسياسات.

## الجدول الزمني {#timeline}

### 2017 - التأسيس والإطلاق {#2017---founding-and-launch}

**2 أكتوبر 2017**: اشترى نيكولاس باوغ المجال `forwardemail.net` بعد البحث عن حلول بريد إلكتروني فعالة من حيث التكلفة لمشاريعه الجانبية.

**٥ نوفمبر ٢٠١٧**: أنشأ باوغ ملف جافا سكريبت مكون من ٦٣٤ سطرًا باستخدام [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") لإعادة توجيه رسائل البريد الإلكتروني لأي اسم نطاق مخصص. نُشر هذا التنفيذ الأولي كمصدر مفتوح على [جيثب](https://github.com/forwardemail)، وتم إطلاق الخدمة باستخدام صفحات GitHub.

**نوفمبر 2017**: أُطلقت خدمة إعادة توجيه البريد الإلكتروني رسميًا بعد إصدار أولي. كانت النسخة الأولية تعتمد كليًا على نظام أسماء النطاقات (DNS) دون الحاجة إلى تسجيل حساب أو عملية تسجيل - مجرد ملف README مكتوب بلغة Markdown مع التعليمات. يمكن للمستخدمين إعداد إعادة توجيه البريد الإلكتروني عن طريق تكوين سجلات MX للإشارة إلى `mx1.forwardemail.net` و `mx2.forwardemail.net`، وإضافة سجل TXT مع `forward-email=user@gmail.com`.

لقد جذبت بساطة وفعالية هذا الحل انتباه المطورين البارزين، بما في ذلك [ديفيد هاينماير هانسون](https://dhh.dk) (منشئ Ruby on Rails)، الذي يستمر في استخدام Forward Email على نطاقه `dhh.dk` حتى يومنا هذا.

### 2018 - البنية التحتية والتكامل {#2018---infrastructure-and-integration}

**أبريل 2018**: عندما أطلقت [كلاود فلير](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") [خدمة DNS للمستهلكين التي تضع الخصوصية في المقام الأول](https://blog.cloudflare.com/announcing-1111/)، تحولت خدمة Forward Email من استخدام [أوبن دي إن إس](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") إلى [كلاود فلير](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") للتعامل مع عمليات البحث [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")، مما يوضح التزام الشركة باختيارات البنية الأساسية التي تركز على الخصوصية.

**أكتوبر 2018**: سمح إعادة توجيه البريد الإلكتروني للمستخدمين بـ "إرسال البريد باسم" مع [جيميل](https://en.wikipedia.org/wiki/Gmail "Gmail") و [التوقعات](https://en.wikipedia.org/wiki/Outlook "Outlook")، مما أدى إلى توسيع قدرات التكامل مع موفري البريد الإلكتروني المشهورين.

### 2019 - ثورة الأداء {#2019---performance-revolution}

مايو ٢٠١٩: صدر الإصدار الثاني من Forward Email، والذي مثّل إعادة صياغة شاملة للإصدارات الأصلية. ركّز هذا التحديث على تحسينات [أداء](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") من خلال استخدام [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")_، مما أرسى أسس قابلية توسّع المنصة.

### 2020 - التركيز على الخصوصية والأمان {#2020---privacy-and-security-focus}

**فبراير 2020**: أطلقت شركة Forward Email خطة حماية الخصوصية المُحسّنة، التي تُتيح للمستخدمين إيقاف تشغيل إدخالات سجلات DNS العامة باستخدام أسماء البريد الإلكتروني المستعارة المُعدّة لإعادة توجيه البريد الإلكتروني. من خلال هذه الخطة، تُخفى معلومات اسم البريد الإلكتروني المستعار للمستخدم عن إمكانية البحث العام عبر الإنترنت. كما أطلقت الشركة ميزة لتمكين أو تعطيل أسماء بريد إلكتروني مُحددة مع السماح لها بالظهور كعناوين بريد إلكتروني صالحة وإرجاع [رموز حالة SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") بنجاح، مع حذف رسائل البريد الإلكتروني فورًا (على غرار توجيه الإخراج إلى [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**أبريل 2020**: بعد مواجهة العديد من العقبات مع حلول كشف البريد العشوائي الحالية التي لم تلتزم بسياسة خصوصية Forward Email، أصدرت الشركة النسخة التجريبية الأولية من Spam Scanner. يستخدم هذا الحل المجاني والمفتوح المصدر بالكامل [تصفية البريد العشوائي](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") نهج [مرشح البريد العشوائي Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") مع حماية [مكافحة التصيد الاحتيالي](https://en.wikipedia.org/wiki/Phishing "Phishing") و [هجوم متجانس IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). كما أصدرت Forward Email [المصادقة الثنائية](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (المصادقة الثنائية) باستخدام [كلمات مرور لمرة واحدة](https://en.wikipedia.org/wiki/One-time_password "One-time password") (كلمة مرور لمرة واحدة) لتعزيز أمان الحساب.

**مايو ٢٠٢٠**: أتاحت خدمة إعادة توجيه البريد الإلكتروني تخصيص [إعادة توجيه المنفذ](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") كحل بديل للمستخدمين للتحايل على حظر المنفذ بواسطة [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). كما أصدرت الشركة [إعادة توجيه البريد الإلكتروني مجانًا باستخدام واجهة برمجة التطبيقات RESTful](email-api) مع توثيق كامل وأمثلة فورية للطلبات والردود، بالإضافة إلى دعم خطافات الويب.

**أغسطس 2020**: أضافت خدمة Forward Email الدعم لنظام مصادقة البريد الإلكتروني [سلسلة الاستلام المعتمدة](arc) ("ARC")، مما يعزز أمان البريد الإلكتروني وإمكانية تسليمه بشكل أكبر.

**23 نوفمبر 2020**: تم إطلاق Forward Email علنًا من برنامجها التجريبي، مما يمثل إنجازًا مهمًا في تطوير المنصة.

### 2021 - تحديث المنصة {#2021---platform-modernization}

**فبراير ٢٠٢١**: أعادت شركة Forward Email تصميم قاعدة برمجيتها لإزالة جميع تبعيات [بايثون](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (لغة برمجة)")، مما سمح لمكدسها بأن يصبح ١٠٠٪ من [جافا سكريبت](https://en.wikipedia.org/wiki/JavaScript "JavaScript") و [Node.js](https://en.wikipedia.org/wiki/Node.js). يتوافق هذا القرار المعماري مع التزام الشركة بالحفاظ على مجموعة برمجية متسقة ومفتوحة المصدر.

**27 سبتمبر 2021**: إعادة توجيه البريد الإلكتروني [تمت إضافة الدعم](email-forwarding-regex-pattern-filter) لمطابقة أسماء إعادة توجيه البريد الإلكتروني مع [التعبيرات العادية](https://en.wikipedia.org/wiki/Regular_expression "Regular expression")، مما يوفر للمستخدمين إمكانيات توجيه بريد إلكتروني أكثر تطورًا.

### 2023 - توسيع البنية التحتية والميزات {#2023---infrastructure-and-feature-expansion}

**يناير 2023**: أطلقت شركة Forward Email موقعًا إلكترونيًا تم إعادة تصميمه وتحسين سرعة الصفحات فيه، مما أدى إلى تحسين تجربة المستخدم والأداء.

**فبراير 2023**: أضافت الشركة الدعم لـ [سجلات الأخطاء](/faq#do-you-store-error-logs) ونفذت مخطط ألوان لموقع الويب [الوضع المظلم](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme)، استجابةً لتفضيلات المستخدم واحتياجات إمكانية الوصول.

مارس ٢٠٢٣: أصدرت شركة Forward Email بروتوكول [اليوسفي](https://github.com/forwardemail/tangerine#readme) ودمجته في بنيتها التحتية، مما أتاح استخدام بروتوكول [DNS عبر HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") على مستوى التطبيقات. كما أضافت الشركة دعمًا لبروتوكول [MTA-STS](/faq#do-you-support-mta-sts) وانتقلت من [إتش كابتشا](/) إلى [بوابة كلاود فلير الدوارة](https://developers.cloudflare.com/turnstile).

**أبريل ٢٠٢٣**: قامت شركة Forward Email بتنفيذ بنية تحتية جديدة بالكامل وأتمتتها. بدأت الخدمة بالكامل بالعمل على نظام أسماء نطاقات (DNS) متوازن الحمل عالميًا وقائم على القرب، مع فحوصات سلامة وتجاوز الأعطال باستخدام [كلاود فلير](https://cloudflare.com)، ليحل محل نهج DNS الدوري السابق. انتقلت الشركة إلى **خوادم مكشوفة** عبر العديد من المزودين، بما في ذلك [فولتر](https://www.vultr.com/?ref=429848) و [المحيط الرقمي](https://m.do.co/c/a7cecd27e071)، وكلاهما متوافق مع معيار SOC 2 من النوع الأول. نُقلت قواعد بيانات MongoDB وRedis إلى تكوينات مجمعة مع عقد رئيسية واحتياطية لتحقيق توافر عالٍ، وتشفير SSL شامل، وتشفير في حالة السكون، واستعادة البيانات من نقطة زمنية محددة (PITR).

مايو ٢٠٢٣: أطلقت شركة Forward Email ميزة **SMTP الصادر** لطلبات [إرسال البريد الإلكتروني باستخدام SMTP](/faq#do-you-support-sending-email-with-smtp) و[إرسال البريد الإلكتروني باستخدام واجهة برمجة التطبيقات](/faq#do-you-support-sending-email-with-api). تتضمن هذه الميزة إجراءات حماية مدمجة لضمان قابلية توصيل عالية، ونظامًا حديثًا وقويًا لقوائم الانتظار وإعادة المحاولة، و[يدعم سجلات الأخطاء في الوقت الفعلي](/faq#do-you-store-error-logs).

**نوفمبر 2023**: أطلقت شركة Forward Email ميزة [**تخزين صندوق البريد المشفر**](/blog/docs/best-quantum-safe-encrypted-email-service) لـ [دعم IMAP](/faq#do-you-support-receiving-email-with-imap)، وهو ما يمثل تقدمًا كبيرًا في خصوصية البريد الإلكتروني وأمانه.

**ديسمبر 2023**: الشركة [تمت إضافة الدعم](/faq#do-you-support-pop3) لمراقبة [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)، و[مفاتيح المرور وWebAuthn](/faq#do-you-support-passkeys-and-webauthn)، و[الوقت للبريد الوارد](/faq#i)، و[OpenPGP لتخزين IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - تحسين الخدمة والميزات المتقدمة {#2024---service-optimization-and-advanced-features}

**فبراير 2024**: إعادة توجيه البريد الإلكتروني [تمت إضافة دعم التقويم (CalDAV)](/faq#do-you-support-calendars-caldav)، مما يؤدي إلى توسيع قدرات المنصة إلى ما هو أبعد من البريد الإلكتروني لتشمل مزامنة التقويم.

**من مارس إلى يوليو 2024**: أصدرت شركة Forward Email تحسينات وتحسينات رئيسية لخدمات IMAP وPOP3 وCalDAV، بهدف جعل خدمتها سريعة مثل البدائل، إن لم تكن أسرع منها.

يوليو ٢٠٢٤: قامت الشركة بـ [تمت إضافة دعم iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) لمعالجة مشكلة عدم دعم تطبيق Apple Mail لأوامر IMAP `IDLE` على نظام iOS، مما يتيح إرسال إشعارات فورية لأجهزة Apple iOS. كما أضافت خدمة Forward Email وقتًا لمراقبة البريد الوارد ("TTI") لخدمتها الخاصة وYahoo/AOL، وبدأت في السماح للمستخدمين بتشفير سجل DNS TXT الخاص بهم بالكامل حتى في الباقة المجانية. وكما هو مطلوب في [مناقشات أدلة الخصوصية](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) و[مشاكل GitHub](https://github.com/forwardemail/forwardemail.net/issues/254)، أضافت الشركة إمكانية رفض الأسماء المستعارة `250` بهدوء، أو رفضها بشكل مؤقت `421`، أو رفضها بشكل قاطع `550` عند تعطيلها.

**أغسطس ٢٠٢٤**: أضافت خدمة Forward Email دعمًا لتصدير صناديق البريد بتنسيقي [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) و[إم بوكس](https://en.wikipedia.org/wiki/Mbox) (بالإضافة إلى تنسيق التصدير الحالي [SQLite](https://en.wikipedia.org/wiki/SQLite)). كما بدأت الشركة في السماح للمستخدمين بإرسال النشرات الإخبارية والإعلانات والرسائل التسويقية عبر البريد الإلكتروني من خلال خدمة SMTP الصادرة. كما تم تطبيق حصص تخزين خاصة بالنطاق والاسم المستعار لبروتوكولات IMAP/POP3/CalDAV.

### 2025 - الابتكار المستمر {#2025---continued-innovation}

**من سبتمبر 2024 إلى يناير 2025**: إعادة توجيه البريد الإلكتروني [تمت إضافة ميزة الرد التلقائي المطلوبة بشدة وتشفير OpenPGP/WKD لإعادة توجيه البريد الإلكتروني](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254)، بناءً على إمكانيات تخزين صندوق البريد المشفر التي تم تنفيذها بالفعل.

**٢١ يناير ٢٠٢٥**: رحل عن عالمنا بسلام "جاك"، صديق المؤسس المقرب، رفيقه الكلب الوفي، عن عمر يناهز الحادية عشرة. نتقدم بخالص الشكر والتقدير لجاك على صداقته الدائمة التي دعمت إنشاء خدمة "فوروارد إيميل". يُهدى هذا الوسام لجاك، تقديرًا لدوره في تطوير الخدمة.

**فبراير 2025**: تحولت شركة Forward Email إلى [حزمة البيانات](https://www.datapacket.com) كمزود مركز بيانات أساسي جديد لها، وتنفيذ أجهزة مخصصة تركز على الأداء، وأجهزة عارية لتعزيز موثوقية الخدمة وسرعتها بشكل أكبر.

**يونيو 2025**: أطلقت Forward Email الدعم لـ [بروتوكول CardDAV](/faq#do-you-support-contacts-carddav)، مما أدى إلى توسيع قدرات المنصة لتشمل مزامنة جهات الاتصال جنبًا إلى جنب مع خدمات البريد الإلكتروني والتقويم الحالية.

## المبادئ الأساسية {#core-principles}

منذ إنشائها، حافظت شركة Forward Email على التزامها الراسخ بمبادئ الخصوصية والأمان:

**فلسفة مفتوحة المصدر بنسبة 100%**: على عكس المنافسين الذين يجعلون واجهاتهم الأمامية مفتوحة المصدر فقط مع إبقاء واجهاتهم الخلفية مغلقة، فإن Forward Email جعلت قاعدة الكود الخاصة بها بالكامل - كل من الواجهة الأمامية والخلفية - متاحة للتدقيق العام على [جيثب](https://github.com/forwardemail).

**تصميم يركز على الخصوصية أولاً**: منذ اليوم الأول، نفذت Forward Email نهجًا فريدًا للمعالجة في الذاكرة يتجنب كتابة رسائل البريد الإلكتروني على القرص، مما يميزها عن خدمات البريد الإلكتروني التقليدية التي تخزن الرسائل في قواعد البيانات أو أنظمة الملفات.

**الابتكار المستمر**: تطورت الخدمة من حل بسيط لإعادة توجيه البريد الإلكتروني إلى منصة بريد إلكتروني شاملة مع ميزات مثل صناديق البريد المشفرة، والتشفير المقاوم للكم، ودعم البروتوكولات القياسية بما في ذلك SMTP وIMAP وPOP3 وCalDAV.

**الشفافية**: جعل جميع التعليمات البرمجية مفتوحة المصدر ومتاحة للتفتيش، مما يضمن قدرة المستخدمين على التحقق من ادعاءات الخصوصية بدلاً من الاعتماد فقط على بيانات التسويق.

**التحكم بالمستخدم**: تمكين المستخدمين من الخيارات، بما في ذلك القدرة على استضافة المنصة بأكملها ذاتيًا إذا رغبوا في ذلك.

## الحالة الحالية {#current-status}

اعتبارًا من عام 2025، تخدم Forward Email أكثر من 500000 نطاق حول العالم، بما في ذلك المنظمات البارزة وقادة الصناعة مثل:

* **شركات التكنولوجيا**: كانونيكال (أوبونتو)، ألعاب نتفليكس، مؤسسة لينكس، مؤسسة بي إتش بي، جي كويري، لاينيج أو إس
* **المؤسسات الإعلامية**: إذاعة فوكس نيوز، مبيعات إعلانات ديزني
* **المؤسسات التعليمية**: جامعة كامبريدج، جامعة ماريلاند، جامعة واشنطن، جامعة تافتس، كلية سوارثمور
* **الهيئات الحكومية**: حكومة جنوب أستراليا، حكومة جمهورية الدومينيكان
* **مؤسسات أخرى**: فنادق آر سي دي، فلاي<span>.</span>io
* **المطورون البارزون**: إسحاق ز. شلويتر (مبتكر npm)، ديفيد هاينماير هانسون (مبتكر روبي أون ريلز)

تستمر المنصة في التطور مع إصدارات منتظمة للميزات وتحسينات البنية التحتية، مما يحافظ على مكانتها باعتبارها خدمة البريد الإلكتروني الوحيدة مفتوحة المصدر بنسبة 100% والمشفرة والموجهة نحو الخصوصية والشفافة والمقاومة للكم المتاحة اليوم.

<img تحميل="كسول" src="/img/articles/about-footer.webp" alt="" class="rounded-lg" />