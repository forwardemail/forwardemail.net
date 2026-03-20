# كيفية تحسين بنية إنتاج Node.js: أفضل الممارسات {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="دليل تحسين أداء Node.js" class="rounded-lg" />


## جدول المحتويات {#table-of-contents}

* [مقدمة](#foreword)
* [ثورتنا في تحسين أداء النواة الواحدة بنسبة 573٪](#our-573-single-core-performance-optimization-revolution)
  * [لماذا يهم تحسين أداء النواة الواحدة لـ Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [محتوى ذو صلة](#related-content)
* [إعداد بيئة إنتاج Node.js: مجموعة تقنياتنا](#nodejs-production-environment-setup-our-technology-stack)
  * [مدير الحزم: pnpm لكفاءة الإنتاج](#package-manager-pnpm-for-production-efficiency)
  * [إطار الويب: Koa لإنتاج Node.js الحديث](#web-framework-koa-for-modern-nodejs-production)
  * [معالجة الوظائف الخلفية: Bree لموثوقية الإنتاج](#background-job-processing-bree-for-production-reliability)
  * [معالجة الأخطاء: @hapi/boom لموثوقية الإنتاج](#error-handling-hapiboom-for-production-reliability)
* [كيفية مراقبة تطبيقات Node.js في الإنتاج](#how-to-monitor-nodejs-applications-in-production)
  * [مراقبة إنتاج Node.js على مستوى النظام](#system-level-nodejs-production-monitoring)
  * [المراقبة على مستوى التطبيق لإنتاج Node.js](#application-level-monitoring-for-nodejs-production)
  * [المراقبة الخاصة بالتطبيق](#application-specific-monitoring)
* [مراقبة إنتاج Node.js باستخدام فحوصات صحة PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [نظام فحص الصحة الخاص بنا في PM2](#our-pm2-health-check-system)
  * [تكوين الإنتاج الخاص بنا لـ PM2](#our-pm2-production-configuration)
  * [نشر PM2 الآلي](#automated-pm2-deployment)
* [نظام معالجة وتصنيف الأخطاء في الإنتاج](#production-error-handling-and-classification-system)
  * [تنفيذ isCodeBug الخاص بنا للإنتاج](#our-iscodebug-implementation-for-production)
  * [التكامل مع تسجيل الإنتاج الخاص بنا](#integration-with-our-production-logging)
  * [محتوى ذو صلة](#related-content-1)
* [تصحيح الأداء المتقدم باستخدام v8-profiler-next و cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [نهجنا في التحليل لـ Node.js في الإنتاج](#our-profiling-approach-for-nodejs-production)
  * [كيفية تنفيذ تحليل لقطات الذاكرة](#how-we-implement-heap-snapshot-analysis)
  * [سير عمل تصحيح الأداء](#performance-debugging-workflow)
  * [التنفيذ الموصى به لتطبيق Node.js الخاص بك](#recommended-implementation-for-your-nodejs-application)
  * [التكامل مع مراقبة الإنتاج الخاصة بنا](#integration-with-our-production-monitoring)
* [أمن بنية إنتاج Node.js](#nodejs-production-infrastructure-security)
  * [الأمن على مستوى النظام لإنتاج Node.js](#system-level-security-for-nodejs-production)
  * [أمن التطبيقات لتطبيقات Node.js](#application-security-for-nodejs-applications)
  * [أتمتة أمن البنية التحتية](#infrastructure-security-automation)
  * [محتوى الأمان الخاص بنا](#our-security-content)
* [هيكل قاعدة البيانات لتطبيقات Node.js](#database-architecture-for-nodejs-applications)
  * [تنفيذ SQLite لإنتاج Node.js](#sqlite-implementation-for-nodejs-production)
  * [تنفيذ MongoDB لإنتاج Node.js](#mongodb-implementation-for-nodejs-production)
* [معالجة الوظائف الخلفية في إنتاج Node.js](#nodejs-production-background-job-processing)
  * [إعداد خادم Bree الخاص بنا للإنتاج](#our-bree-server-setup-for-production)
  * [أمثلة على الوظائف في الإنتاج](#production-job-examples)
  * [أنماط جدولة الوظائف الخاصة بنا لإنتاج Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [الصيانة الآلية لتطبيقات Node.js في الإنتاج](#automated-maintenance-for-production-nodejs-applications)
  * [تنفيذ التنظيف الخاص بنا](#our-cleanup-implementation)
  * [إدارة مساحة القرص لإنتاج Node.js](#disk-space-management-for-nodejs-production)
  * [أتمتة صيانة البنية التحتية](#infrastructure-maintenance-automation)
* [دليل تنفيذ نشر إنتاج Node.js](#nodejs-production-deployment-implementation-guide)
  * [ادرس كودنا الفعلي لأفضل ممارسات الإنتاج](#study-our-actual-code-for-production-best-practices)
  * [تعلم من منشورات مدونتنا](#learn-from-our-blog-posts)
  * [أتمتة البنية التحتية لإنتاج Node.js](#infrastructure-automation-for-nodejs-production)
  * [دراسات الحالة الخاصة بنا](#our-case-studies)
* [الخاتمة: أفضل ممارسات نشر إنتاج Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [قائمة الموارد الكاملة لإنتاج Node.js](#complete-resource-list-for-nodejs-production)
  * [ملفات التنفيذ الأساسية الخاصة بنا](#our-core-implementation-files)
  * [تنفيذات الخادم الخاصة بنا](#our-server-implementations)
  * [أتمتة البنية التحتية الخاصة بنا](#our-infrastructure-automation)
  * [منشورات مدونتنا التقنية](#our-technical-blog-posts)
  * [دراسات الحالة المؤسسية الخاصة بنا](#our-enterprise-case-studies)
## مقدمة {#foreword}

في Forward Email، قضينا سنوات في تحسين إعداد بيئة الإنتاج لـ Node.js. يشارك هذا الدليل الشامل أفضل الممارسات المجربة لنشر Node.js في بيئة الإنتاج، مع التركيز على تحسين الأداء، والمراقبة، والدروس التي تعلمناها من توسيع تطبيقات Node.js للتعامل مع ملايين المعاملات اليومية.

## ثورتنا في تحسين أداء النواة الواحدة بنسبة 573% {#our-573-single-core-performance-optimization-revolution}

عندما انتقلنا من معالجات Intel إلى معالجات AMD Ryzen، حققنا **تحسين أداء بنسبة 573%** في تطبيقات Node.js الخاصة بنا. لم يكن هذا مجرد تحسين طفيف—بل غيّر بشكل جذري كيفية أداء تطبيقات Node.js في بيئة الإنتاج ويُظهر أهمية تحسين أداء النواة الواحدة لأي تطبيق Node.js.

> \[!TIP]
> بالنسبة لأفضل ممارسات نشر Node.js في الإنتاج، فإن اختيار الأجهزة أمر حاسم. اخترنا استضافة DataPacket تحديدًا لتوفر معالجات AMD Ryzen لأن أداء النواة الواحدة ضروري لتطبيقات Node.js نظرًا لأن تنفيذ JavaScript يتم في خيط واحد.

### لماذا يهم تحسين أداء النواة الواحدة لـ Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

أدى انتقالنا من Intel إلى AMD Ryzen إلى:

* **تحسين أداء بنسبة 573%** في معالجة الطلبات (موثق في [مشكلة GitHub رقم 1519 في صفحة الحالة الخاصة بنا](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **إلغاء تأخيرات المعالجة** لتصل إلى استجابات شبه فورية (مذكورة في [مشكلة GitHub رقم 298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **نسبة سعر إلى أداء أفضل** لبيئات إنتاج Node.js
* **تحسين أوقات الاستجابة** عبر جميع نقاط نهاية تطبيقنا

كان تعزيز الأداء كبيرًا لدرجة أننا نعتبر الآن معالجات AMD Ryzen ضرورية لأي نشر جاد لـ Node.js في الإنتاج، سواء كنت تشغل تطبيقات ويب، أو واجهات برمجة التطبيقات، أو الخدمات المصغرة، أو أي عبء عمل آخر لـ Node.js.

### محتوى ذو صلة {#related-content}

لمزيد من التفاصيل حول اختيارات البنية التحتية لدينا، اطلع على:

* [أفضل خدمة إعادة توجيه البريد الإلكتروني](https://forwardemail.net/blog/docs/best-email-forwarding-service) - مقارنات الأداء
* [الحل المستضاف ذاتيًا](https://forwardemail.net/blog/docs/self-hosted-solution) - توصيات الأجهزة

## إعداد بيئة إنتاج Node.js: مجموعة تقنياتنا {#nodejs-production-environment-setup-our-technology-stack}

تشمل أفضل ممارسات نشر Node.js في الإنتاج لدينا اختيارات تقنية مدروسة بناءً على سنوات من الخبرة في الإنتاج. إليك ما نستخدمه ولماذا تنطبق هذه الاختيارات على أي تطبيق Node.js:

### مدير الحزم: pnpm لكفاءة الإنتاج {#package-manager-pnpm-for-production-efficiency}

**ما نستخدمه:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (الإصدار المثبت)

اخترنا pnpm بدلاً من npm و yarn لإعداد بيئة إنتاج Node.js لدينا بسبب:

* **أوقات تثبيت أسرع** في خطوط CI/CD
* **كفاءة في استخدام مساحة القرص** من خلال الربط الصلب
* **حل صارم للتبعيات** يمنع التبعيات الوهمية
* **أداء أفضل** في عمليات النشر الإنتاجية

> \[!NOTE]
> كجزء من أفضل ممارسات نشر Node.js في الإنتاج، نثبت إصدارات دقيقة للأدوات الحيوية مثل pnpm لضمان سلوك متسق عبر جميع البيئات وأجهزة أعضاء الفريق.

**تفاصيل التنفيذ:**

* [تكوين package.json الخاص بنا](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [مقالة مدونة نظام NPM الخاص بنا](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### إطار العمل الويب: Koa لإنتاج Node.js الحديث {#web-framework-koa-for-modern-nodejs-production}

**ما نستخدمه:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
اخترنا Koa بدلاً من Express لبنية الإنتاج الخاصة بنا في Node.js بسبب دعمه الحديث لـ async/await وتركيبه الأنظف للوسائط الوسيطة. ساهم مؤسسنا Nick Baugh في كل من Express و Koa، مما منحنا فهماً عميقاً لكلتا الإطارات لاستخدامها في الإنتاج.

تنطبق هذه الأنماط سواء كنت تبني واجهات برمجة تطبيقات REST، أو خوادم GraphQL، أو تطبيقات ويب، أو خدمات مصغرة.

**أمثلة على تنفيذنا:**

* [إعداد خادم الويب](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [تكوين خادم API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [دليل تنفيذ نماذج الاتصال](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### معالجة الوظائف الخلفية: Bree للموثوقية في الإنتاج {#background-job-processing-bree-for-production-reliability}

**ما نستخدمه:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) المجدول

أنشأنا ونحافظ على Bree لأن مجدولات الوظائف الموجودة لم تلبي احتياجاتنا لدعم خيوط العمل وميزات جافاسكريبت الحديثة في بيئات Node.js الإنتاجية. ينطبق هذا على أي تطبيق Node.js يحتاج إلى معالجة خلفية، مهام مجدولة، أو خيوط عمل.

**أمثلة على تنفيذنا:**

* [إعداد خادم Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [جميع تعريفات وظائفنا](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [وظيفة فحص صحة PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [تنفيذ وظيفة التنظيف](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### معالجة الأخطاء: @hapi/boom للموثوقية في الإنتاج {#error-handling-hapiboom-for-production-reliability}

**ما نستخدمه:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

نستخدم @hapi/boom للاستجابات المنظمة للأخطاء في جميع تطبيقات Node.js الإنتاجية لدينا. يعمل هذا النمط لأي تطبيق Node.js يحتاج إلى معالجة أخطاء متسقة.

**أمثلة على تنفيذنا:**

* [مساعد تصنيف الأخطاء](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [تنفيذ المسجل](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## كيفية مراقبة تطبيقات Node.js في الإنتاج {#how-to-monitor-nodejs-applications-in-production}

تطورت طريقتنا في مراقبة تطبيقات Node.js في الإنتاج عبر سنوات من تشغيل التطبيقات على نطاق واسع. ننفذ المراقبة على عدة طبقات لضمان الموثوقية والأداء لأي نوع من تطبيقات Node.js.

### مراقبة Node.js على مستوى النظام في الإنتاج {#system-level-nodejs-production-monitoring}

**تنفيذنا الأساسي:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**ما نستخدمه:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

عوائق المراقبة في الإنتاج لدينا (من كود الإنتاج الفعلي):

* **حد حجم الكومة 2GB** مع تنبيهات تلقائية
* **عتبة تحذير استخدام الذاكرة 25%**
* **عتبة تنبيه استخدام وحدة المعالجة المركزية 80%**
* **عتبة تحذير استخدام القرص 75%**

> \[!WARNING]
> تعمل هذه العوائق مع تكوين الأجهزة الخاص بنا. عند تنفيذ مراقبة Node.js في الإنتاج، راجع تنفيذ monitor-server.js لفهم المنطق الدقيق وتكييف القيم حسب إعدادك.

### مراقبة على مستوى التطبيق لـ Node.js في الإنتاج {#application-level-monitoring-for-nodejs-production}

**تصنيف الأخطاء لدينا:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

يميز هذا المساعد بين:

* **أخطاء الكود الفعلية** التي تتطلب اهتماماً فورياً
* **أخطاء المستخدم** التي هي سلوك متوقع
* **فشل الخدمات الخارجية** التي لا يمكننا التحكم بها

ينطبق هذا النمط على أي تطبيق Node.js - تطبيقات ويب، APIs، خدمات مصغرة، أو خدمات خلفية.
**تنفيذ التسجيل الخاص بنا:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

نقوم بتنفيذ إخفاء شامل للحقول لحماية المعلومات الحساسة مع الحفاظ على قدرات تصحيح الأخطاء المفيدة في بيئة الإنتاج الخاصة بنا على Node.js.

### المراقبة الخاصة بالتطبيق {#application-specific-monitoring}

**تنفيذات الخادم الخاصة بنا:**

* [خادم SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [خادم IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [خادم POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**مراقبة الطوابير:** نقوم بتطبيق حدود طابور بحجم 5 جيجابايت ووقت انتهاء معالجة الطلبات 180 ثانية لمنع استنفاد الموارد. تنطبق هذه الأنماط على أي تطبيق Node.js يحتوي على طوابير أو معالجة خلفية.


## مراقبة إنتاج Node.js باستخدام فحوصات صحة PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

قمنا بتحسين إعداد بيئة إنتاج Node.js الخاصة بنا باستخدام PM2 على مدار سنوات من الخبرة في الإنتاج. فحوصات صحة PM2 لدينا ضرورية للحفاظ على الموثوقية في أي تطبيق Node.js.

### نظام فحص صحة PM2 الخاص بنا {#our-pm2-health-check-system}

**التنفيذ الأساسي لدينا:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

تشمل مراقبة إنتاج Node.js باستخدام فحوصات صحة PM2 لدينا:

* **يعمل كل 20 دقيقة** عبر جدولة cron
* **يتطلب وقت تشغيل لا يقل عن 15 دقيقة** قبل اعتبار العملية صحية
* **يتحقق من حالة العملية واستخدام الذاكرة**
* **يعيد تشغيل العمليات الفاشلة تلقائيًا**
* **يمنع حلقات إعادة التشغيل** من خلال فحص الصحة الذكي

> \[!CAUTION]
> لأفضل ممارسات نشر إنتاج Node.js، نطلب وقت تشغيل يزيد عن 15 دقيقة قبل اعتبار العملية صحية لتجنب حلقات إعادة التشغيل. هذا يمنع الفشل المتسلسل عندما تواجه العمليات مشاكل في الذاكرة أو غيرها.

### تكوين إنتاج PM2 الخاص بنا {#our-pm2-production-configuration}

**إعداد النظام البيئي لدينا:** ادرس ملفات بدء تشغيل الخادم الخاصة بنا لإعداد بيئة إنتاج Node.js:

* [خادم الويب](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [خادم API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [مجدول Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [خادم SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

تنطبق هذه الأنماط سواء كنت تشغل تطبيقات Express أو خوادم Koa أو واجهات برمجة تطبيقات GraphQL أو أي تطبيق Node.js آخر.

### نشر PM2 الآلي {#automated-pm2-deployment}

**نشر PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

نقوم بأتمتة إعداد PM2 بالكامل من خلال Ansible لضمان نشرات إنتاج Node.js متسقة عبر جميع خوادمنا.


## نظام التعامل مع الأخطاء والتصنيف في الإنتاج {#production-error-handling-and-classification-system}

واحدة من أكثر ممارسات نشر إنتاج Node.js قيمة هي التصنيف الذكي للأخطاء الذي ينطبق على أي تطبيق Node.js:

### تنفيذ isCodeBug الخاص بنا للإنتاج {#our-iscodebug-implementation-for-production}

**المصدر:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

يوفر هذا المساعد تصنيفًا ذكيًا للأخطاء لتطبيقات Node.js في الإنتاج من أجل:

* **إعطاء الأولوية للأخطاء الحقيقية** على أخطاء المستخدم
* **تحسين استجابتنا للحوادث** من خلال التركيز على المشاكل الحقيقية
* **تقليل إرهاق التنبيهات** الناتج عن أخطاء المستخدم المتوقعة
* **فهم أفضل** للمشاكل الناتجة عن التطبيق مقابل تلك الناتجة عن المستخدم

يعمل هذا النمط مع أي تطبيق Node.js - سواء كنت تبني مواقع تجارة إلكترونية، منصات SaaS، واجهات برمجة تطبيقات، أو خدمات مصغرة.

### التكامل مع تسجيل الإنتاج الخاص بنا {#integration-with-our-production-logging}

**تكامل المسجل الخاص بنا:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
يستخدم مسجل الأحداث لدينا `isCodeBug` لتحديد مستويات التنبيه وحجب الحقول، مما يضمن إعلامنا بالمشاكل الحقيقية مع تصفية الضوضاء في بيئة الإنتاج الخاصة بنا على Node.js.

### المحتوى ذو الصلة {#related-content-1}

تعرف على المزيد حول أنماط معالجة الأخطاء لدينا:

* [بناء نظام دفع موثوق](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - أنماط معالجة الأخطاء
* [حماية خصوصية البريد الإلكتروني](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - معالجة أخطاء الأمان


## تصحيح الأداء المتقدم باستخدام v8-profiler-next و cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

نستخدم أدوات تحليل متقدمة لتحليل لقطات الذاكرة المؤقتة (heap snapshots) وتصحيح مشاكل نفاد الذاكرة (OOM)، واختناقات الأداء، ومشاكل ذاكرة Node.js في بيئة الإنتاج لدينا. هذه الأدوات ضرورية لأي تطبيق Node.js يعاني من تسريبات الذاكرة أو مشاكل الأداء.

### نهجنا في التحليل لتطبيقات Node.js في الإنتاج {#our-profiling-approach-for-nodejs-production}

**الأدوات التي نوصي بها:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - لإنشاء لقطات الذاكرة المؤقتة وملفات تعريف وحدة المعالجة المركزية
* [`cpupro`](https://github.com/discoveryjs/cpupro) - لتحليل ملفات تعريف وحدة المعالجة المركزية ولقطات الذاكرة المؤقتة

> \[!TIP]
> نستخدم v8-profiler-next و cpupro معًا لإنشاء سير عمل كامل لتصحيح الأداء لتطبيقات Node.js الخاصة بنا. تساعدنا هذه المجموعة في تحديد تسريبات الذاكرة، واختناقات الأداء، وتحسين كود الإنتاج لدينا.

### كيف ننفذ تحليل لقطات الذاكرة المؤقتة {#how-we-implement-heap-snapshot-analysis}

**تنفيذ المراقبة لدينا:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

تشمل مراقبة الإنتاج لدينا إنشاء لقطات الذاكرة المؤقتة تلقائيًا عند تجاوز حدود الذاكرة. يساعدنا هذا في تصحيح مشاكل نفاد الذاكرة قبل أن تتسبب في تعطل التطبيق.

**أنماط التنفيذ الرئيسية:**

* **لقطات تلقائية** عند تجاوز حجم الذاكرة المؤقتة حد 2 جيجابايت
* **التحليل بناءً على الإشارات** للتحليل عند الطلب في الإنتاج
* **سياسات الاحتفاظ** لإدارة تخزين اللقطات
* **التكامل مع مهام التنظيف لدينا** للصيانة التلقائية

### سير عمل تصحيح الأداء {#performance-debugging-workflow}

**ادرس تنفيذنا الفعلي:**

* [تنفيذ خادم المراقبة](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - مراقبة الذاكرة المؤقتة وإنشاء اللقطات
* [مهمة التنظيف](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - الاحتفاظ باللقطات والتنظيف
* [تكامل المسجل](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - تسجيل الأداء

### التنفيذ الموصى به لتطبيق Node.js الخاص بك {#recommended-implementation-for-your-nodejs-application}

**لتحليل لقطات الذاكرة المؤقتة:**

1. **تثبيت v8-profiler-next** لإنشاء اللقطات
2. **استخدام cpupro** لتحليل اللقطات المنشأة
3. **تنفيذ حدود المراقبة** مشابهة لـ monitor-server.js الخاص بنا
4. **إعداد التنظيف التلقائي** لإدارة تخزين اللقطات
5. **إنشاء معالجات الإشارات** للتحليل عند الطلب في الإنتاج

**لتحليل وحدة المعالجة المركزية:**

1. **إنشاء ملفات تعريف وحدة المعالجة المركزية** خلال فترات الحمل العالي
2. **التحليل باستخدام cpupro** لتحديد الاختناقات
3. **التركيز على المسارات الساخنة** وفرص التحسين
4. **المراقبة قبل/بعد** تحسينات الأداء

> \[!WARNING]
> قد يؤثر إنشاء لقطات الذاكرة المؤقتة وملفات تعريف وحدة المعالجة المركزية على الأداء. نوصي بتنفيذ التحكم في التردد وتفعيل التحليل فقط عند التحقيق في مشكلات محددة أو خلال نوافذ الصيانة.

### التكامل مع مراقبة الإنتاج لدينا {#integration-with-our-production-monitoring}

تتكامل أدوات التحليل لدينا مع استراتيجيتنا الأوسع للمراقبة:

* **التشغيل التلقائي** بناءً على حدود الذاكرة/وحدة المعالجة المركزية
* **تكامل التنبيهات** عند اكتشاف مشاكل الأداء
* **التحليل التاريخي** لتتبع اتجاهات الأداء مع مرور الوقت
* **الارتباط مع مقاييس التطبيق** لتصحيح شامل
لقد ساعدنا هذا النهج في تحديد وحل تسريبات الذاكرة، وتحسين مسارات الكود الساخن، والحفاظ على أداء مستقر في بيئة الإنتاج الخاصة بنا على Node.js.


## أمان بنية تحتية إنتاج Node.js {#nodejs-production-infrastructure-security}

نقوم بتنفيذ أمان شامل لبنية تحتية إنتاج Node.js الخاصة بنا من خلال أتمتة Ansible. تنطبق هذه الممارسات على أي تطبيق Node.js:

### أمان على مستوى النظام لإنتاج Node.js {#system-level-security-for-nodejs-production}

**تنفيذ Ansible الخاص بنا:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

إجراءات الأمان الرئيسية لدينا لبيئات إنتاج Node.js:

* **تعطيل التبديل (Swap)** لمنع كتابة البيانات الحساسة على القرص
* **تعطيل تفريغ النواة (Core dumps)** لمنع تفريغ الذاكرة التي تحتوي على معلومات حساسة
* **حظر تخزين USB** لمنع الوصول غير المصرح به إلى البيانات
* **ضبط معلمات النواة** للأمان والأداء على حد سواء

> \[!WARNING]
> عند تنفيذ أفضل ممارسات نشر إنتاج Node.js، قد يؤدي تعطيل التبديل إلى قتل العمليات بسبب نفاد الذاكرة إذا تجاوز تطبيقك ذاكرة الوصول العشوائي المتاحة. نحن نراقب استخدام الذاكرة بعناية ونحدد حجم خوادمنا بشكل مناسب.

### أمان التطبيق لتطبيقات Node.js {#application-security-for-nodejs-applications}

**إخفاء الحقول في السجلات لدينا:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

نقوم بإخفاء الحقول الحساسة من السجلات بما في ذلك كلمات المرور، الرموز، مفاتيح API، والمعلومات الشخصية. هذا يحمي خصوصية المستخدم مع الحفاظ على قدرات التصحيح في أي بيئة إنتاج Node.js.

### أتمتة أمان البنية التحتية {#infrastructure-security-automation}

**إعداد Ansible الكامل لإنتاج Node.js لدينا:**

* [ملف تشغيل الأمان](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [إدارة مفاتيح SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [إدارة الشهادات](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [إعداد DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### محتوى الأمان الخاص بنا {#our-security-content}

تعرف على المزيد حول نهج الأمان لدينا:

* [أفضل شركات تدقيق الأمان](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [البريد الإلكتروني المشفر الآمن من الكم](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [لماذا أمان البريد الإلكتروني مفتوح المصدر](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## بنية قاعدة البيانات لتطبيقات Node.js {#database-architecture-for-nodejs-applications}

نستخدم نهج قاعدة بيانات هجين محسن لتطبيقات Node.js الخاصة بنا. يمكن تكييف هذه الأنماط لأي تطبيق Node.js:

### تنفيذ SQLite لإنتاج Node.js {#sqlite-implementation-for-nodejs-production}

**ما نستخدمه:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**تكويننا:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

نستخدم SQLite للبيانات الخاصة بالمستخدم في تطبيقات Node.js لدينا لأنها توفر:

* **عزل البيانات** لكل مستخدم/مستأجر
* **أداء أفضل** لاستعلامات المستخدم الواحد
* **نسخ احتياطي مبسط** وترحيل
* **تعقيد أقل** مقارنة بقواعد البيانات المشتركة

يعمل هذا النمط بشكل جيد لتطبيقات SaaS، أنظمة متعددة المستأجرين، أو أي تطبيق Node.js يحتاج إلى عزل البيانات.

### تنفيذ MongoDB لإنتاج Node.js {#mongodb-implementation-for-nodejs-production}

**ما نستخدمه:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**تنفيذ الإعداد الخاص بنا:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**تكويننا:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

نستخدم MongoDB لبيانات التطبيق في بيئة الإنتاج الخاصة بنا على Node.js لأنها توفر:

* **مخطط مرن** لهياكل البيانات المتطورة
* **أداء أفضل** للاستعلامات المعقدة
* **قدرات التوسع الأفقي**
* **لغة استعلام غنية**

> \[!NOTE]
> نهجنا الهجين يُحسّن لحالة الاستخدام الخاصة بنا. ادرس أنماط استخدام قاعدة البيانات الفعلية في قاعدة الشيفرة لفهم ما إذا كان هذا النهج يناسب احتياجات تطبيق Node.js الخاص بك.


## معالجة الوظائف الخلفية في بيئة إنتاج Node.js {#nodejs-production-background-job-processing}

بنينا بنية الوظائف الخلفية لدينا حول Bree لنشر موثوق في بيئة إنتاج Node.js. ينطبق هذا على أي تطبيق Node.js يحتاج إلى معالجة خلفية:

### إعداد خادم Bree الخاص بنا للإنتاج {#our-bree-server-setup-for-production}

**التنفيذ الرئيسي لدينا:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**نشر Ansible الخاص بنا:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### أمثلة على الوظائف في الإنتاج {#production-job-examples}

**مراقبة الصحة:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**أتمتة التنظيف:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**جميع وظائفنا:** [تصفح دليل الوظائف الكامل لدينا](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

تنطبق هذه الأنماط على أي تطبيق Node.js يحتاج إلى:

* مهام مجدولة (معالجة بيانات، تقارير، تنظيف)
* معالجة خلفية (تغيير حجم الصور، إرسال البريد الإلكتروني، استيراد البيانات)
* مراقبة الصحة والصيانة
* استخدام خيوط العمل للمهام المكثفة على وحدة المعالجة المركزية

### أنماط جدولة الوظائف لدينا لإنتاج Node.js {#our-job-scheduling-patterns-for-nodejs-production}

ادرس أنماط جدولة الوظائف الفعلية في دليل الوظائف لدينا لفهم:

* كيف ننفذ جدولة شبيهة بـ cron في إنتاج Node.js
* منطق التعامل مع الأخطاء وإعادة المحاولة لدينا
* كيف نستخدم خيوط العمل للمهام المكثفة على وحدة المعالجة المركزية


## الصيانة الآلية لتطبيقات إنتاج Node.js {#automated-maintenance-for-production-nodejs-applications}

ننفيذ صيانة استباقية لمنع المشاكل الشائعة في إنتاج Node.js. تنطبق هذه الأنماط على أي تطبيق Node.js:

### تنفيذ التنظيف لدينا {#our-cleanup-implementation}

**المصدر:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

تستهدف صيانة الإنتاج الآلية لتطبيقات Node.js لدينا:

* **الملفات المؤقتة** التي تزيد عن 24 ساعة
* **ملفات السجل** التي تتجاوز حدود الاحتفاظ
* **ملفات التخزين المؤقت** والبيانات المؤقتة
* **الملفات المرفوعة** التي لم تعد مطلوبة
* **لقطات الذاكرة المؤقتة** من تصحيح الأداء

تنطبق هذه الأنماط على أي تطبيق Node.js يولد ملفات مؤقتة أو سجلات أو بيانات مخزنة مؤقتًا.

### إدارة مساحة القرص لإنتاج Node.js {#disk-space-management-for-nodejs-production}

**عوائق المراقبة لدينا:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **حدود قائمة الانتظار** للمعالجة الخلفية
* **تحذير عند استخدام 75% من القرص**
* **تنظيف تلقائي** عند تجاوز العوائق

### أتمتة صيانة البنية التحتية {#infrastructure-maintenance-automation}

**أتمتة Ansible الخاصة بنا لإنتاج Node.js:**

* [نشر البيئة](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [إدارة مفاتيح النشر](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## دليل تنفيذ نشر إنتاج Node.js {#nodejs-production-deployment-implementation-guide}
### ادرس كودنا الفعلي لأفضل ممارسات الإنتاج {#study-our-actual-code-for-production-best-practices}

**ابدأ بهذه الملفات الأساسية لإعداد بيئة إنتاج Node.js:**

1. **التكوين:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **المراقبة:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **معالجة الأخطاء:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **التسجيل:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **صحة العملية:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### تعلم من منشورات مدونتنا {#learn-from-our-blog-posts}

**أدلة التنفيذ التقنية لدينا لإنتاج Node.js:**

* [نظام حزم NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [بناء أنظمة الدفع](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [تنفيذ خصوصية البريد الإلكتروني](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [نماذج الاتصال بجافاسكريبت](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [تكامل البريد الإلكتروني مع React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### أتمتة البنية التحتية لإنتاج Node.js {#infrastructure-automation-for-nodejs-production}

**كتب تشغيل Ansible الخاصة بنا للدراسة لنشر إنتاج Node.js:**

* [دليل كتب التشغيل الكامل](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [تعزيز الأمان](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [إعداد Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### دراسات الحالة لدينا {#our-case-studies}

**تنفيذاتنا للمؤسسات:**

* [دراسة حالة مؤسسة لينكس](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [دراسة حالة Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [إعادة توجيه بريد الخريجين](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## الخلاصة: أفضل ممارسات نشر إنتاج Node.js {#conclusion-nodejs-production-deployment-best-practices}

تُظهر بنية إنتاج Node.js لدينا أن تطبيقات Node.js يمكن أن تحقق موثوقية على مستوى المؤسسات من خلال:

* **اختيارات الأجهزة المثبتة** (AMD Ryzen لتحسين أداء النواة الواحدة بنسبة 573%)
* **مراقبة إنتاج Node.js المجربة** مع حدود محددة واستجابات آلية
* **تصنيف ذكي للأخطاء** لتحسين الاستجابة للحوادث في بيئات الإنتاج
* **تصحيح أداء متقدم** باستخدام v8-profiler-next و cpupro لمنع نفاد الذاكرة (OOM)
* **تعزيز أمان شامل** من خلال أتمتة Ansible
* **هندسة قاعدة بيانات هجينة** محسنة لاحتياجات التطبيق
* **صيانة آلية** لمنع المشاكل الشائعة في إنتاج Node.js

**النقطة الأساسية:** ادرس ملفات التنفيذ الفعلية ومنشورات المدونة لدينا بدلاً من اتباع أفضل الممارسات العامة. يوفر كودنا أنماطًا واقعية لنشر إنتاج Node.js يمكن تكييفها لأي تطبيق Node.js - تطبيقات الويب، واجهات برمجة التطبيقات، الخدمات المصغرة، أو الخدمات الخلفية.


## قائمة الموارد الكاملة لإنتاج Node.js {#complete-resource-list-for-nodejs-production}

### ملفات التنفيذ الأساسية لدينا {#our-core-implementation-files}

* [التكوين الرئيسي](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [اعتمادات الحزم](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [مراقبة الخادم](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [تصنيف الأخطاء](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [نظام التسجيل](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [فحوصات صحة PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [تنظيف آلي](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### تنفيذات خوادمنا {#our-server-implementations}

* [خادم الويب](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [خادم API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [مجدول Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [خادم SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [خادم IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [خادم POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### أتمتة البنية التحتية لدينا {#our-infrastructure-automation}

* [جميع ملفات Ansible الخاصة بنا](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [تعزيز الأمان](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [إعداد Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [تكوين قاعدة البيانات](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### منشورات مدونتنا التقنية {#our-technical-blog-posts}

* [تحليل نظام NPM البيئي](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [تنفيذ نظام الدفع](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [الدليل التقني لخصوصية البريد الإلكتروني](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [نماذج الاتصال بجافا سكريبت](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [تكامل البريد الإلكتروني مع React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [دليل الحلول المستضافة ذاتياً](https://forwardemail.net/blog/docs/self-hosted-solution)

### دراسات حالة المؤسسات لدينا {#our-enterprise-case-studies}

* [تنفيذ مؤسسة لينكس](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [دراسة حالة Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [الامتثال لحكومة الاتحاد الفيدرالي](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [أنظمة البريد الإلكتروني للخريجين](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
