# كيفية تحسين البنية التحتية لإنتاج Node.js: أفضل الممارسات {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## جدول المحتويات {#table-of-contents}

* [مقدمة](#foreword)
* [ثورة تحسين أداء النواة الواحدة بنسبة 573%](#our-573-single-core-performance-optimization-revolution)
  * [لماذا يُعد تحسين أداء النواة الواحدة أمرًا مهمًا بالنسبة إلى Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [محتوى ذو صلة](#related-content)
* [إعداد بيئة إنتاج Node.js: مجموعة التكنولوجيا الخاصة بنا](#nodejs-production-environment-setup-our-technology-stack)
  * [مدير الحزم: pnpm لكفاءة الإنتاج](#package-manager-pnpm-for-production-efficiency)
  * [إطار عمل الويب: Koa لإنتاج Node.js الحديث](#web-framework-koa-for-modern-nodejs-production)
  * [معالجة الوظائف الخلفية: Bree لضمان موثوقية الإنتاج](#background-job-processing-bree-for-production-reliability)
  * [معالجة الأخطاء: @hapi/boom لموثوقية الإنتاج](#error-handling-hapiboom-for-production-reliability)
* [كيفية مراقبة تطبيقات Node.js في الإنتاج](#how-to-monitor-nodejs-applications-in-production)
  * [مراقبة إنتاج Node.js على مستوى النظام](#system-level-nodejs-production-monitoring)
  * [مراقبة مستوى التطبيق لإنتاج Node.js](#application-level-monitoring-for-nodejs-production)
  * [مراقبة خاصة بالتطبيق](#application-specific-monitoring)
* [مراقبة إنتاج Node.js باستخدام فحوصات صحة PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [نظام فحص صحة PM2 الخاص بنا](#our-pm2-health-check-system)
  * [تكوين إنتاج PM2 الخاص بنا](#our-pm2-production-configuration)
  * [النشر الآلي لـ PM2](#automated-pm2-deployment)
* [نظام معالجة أخطاء الإنتاج وتصنيفها](#production-error-handling-and-classification-system)
  * [تنفيذنا لـ isCodeBug للإنتاج](#our-iscodebug-implementation-for-production)
  * [التكامل مع تسجيل الإنتاج لدينا](#integration-with-our-production-logging)
  * [محتوى ذو صلة](#related-content-1)
* [تصحيح أخطاء الأداء المتقدم باستخدام v8-profiler-next وcpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [نهجنا في إنشاء ملفات تعريف لإنتاج Node.js](#our-profiling-approach-for-nodejs-production)
  * [كيفية تنفيذ تحليل لقطة الكومة](#how-we-implement-heap-snapshot-analysis)
  * [سير عمل تصحيح أخطاء الأداء](#performance-debugging-workflow)
  * [التنفيذ الموصى به لتطبيق Node.js الخاص بك](#recommended-implementation-for-your-nodejs-application)
  * [التكامل مع مراقبة الإنتاج لدينا](#integration-with-our-production-monitoring)
* [أمان البنية التحتية لإنتاج Node.js](#nodejs-production-infrastructure-security)
  * [الأمان على مستوى النظام لإنتاج Node.js](#system-level-security-for-nodejs-production)
  * [أمان التطبيقات لتطبيقات Node.js](#application-security-for-nodejs-applications)
  * [أتمتة أمن البنية التحتية](#infrastructure-security-automation)
  * [محتوى الأمان الخاص بنا](#our-security-content)
* [هندسة قواعد البيانات لتطبيقات Node.js](#database-architecture-for-nodejs-applications)
  * [تنفيذ SQLite لإنتاج Node.js](#sqlite-implementation-for-nodejs-production)
  * [تنفيذ MongoDB لإنتاج Node.js](#mongodb-implementation-for-nodejs-production)
* [معالجة وظيفة الخلفية الإنتاجية في Node.js](#nodejs-production-background-job-processing)
  * [إعداد خادم Bree الخاص بنا للإنتاج](#our-bree-server-setup-for-production)
  * [أمثلة على وظائف الإنتاج](#production-job-examples)
  * [أنماط جدولة الوظائف الخاصة بنا لإنتاج Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [الصيانة الآلية لتطبيقات Node.js الإنتاجية](#automated-maintenance-for-production-nodejs-applications)
  * [تنفيذ عملية التنظيف لدينا](#our-cleanup-implementation)
  * [إدارة مساحة القرص لإنتاج Node.js](#disk-space-management-for-nodejs-production)
  * [أتمتة صيانة البنية التحتية](#infrastructure-maintenance-automation)
* [دليل تنفيذ نشر Node.js الإنتاجي](#nodejs-production-deployment-implementation-guide)
  * [قم بدراسة الكود الفعلي الخاص بنا للحصول على أفضل ممارسات الإنتاج](#study-our-actual-code-for-production-best-practices)
  * [تعلم من منشورات مدونتنا](#learn-from-our-blog-posts)
  * [أتمتة البنية التحتية لإنتاج Node.js](#infrastructure-automation-for-nodejs-production)
  * [دراسات الحالة الخاصة بنا](#our-case-studies)
* [الاستنتاج: أفضل ممارسات نشر إنتاج Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [قائمة الموارد الكاملة لإنتاج Node.js](#complete-resource-list-for-nodejs-production)
  * [ملفات التنفيذ الأساسية لدينا](#our-core-implementation-files)
  * [تنفيذات الخادم لدينا](#our-server-implementations)
  * [أتمتة البنية التحتية لدينا](#our-infrastructure-automation)
  * [منشورات مدونتنا التقنية](#our-technical-blog-posts)
  * [دراسات الحالة الخاصة بمؤسستنا](#our-enterprise-case-studies)

## مقدمة {#foreword}

في Forward Email، أمضينا سنوات في إتقان إعداد بيئة إنتاج Node.js. يستعرض هذا الدليل الشامل أفضل ممارساتنا المجربة لنشر Node.js في بيئة الإنتاج، مع التركيز على تحسين الأداء والمراقبة والدروس المستفادة من توسيع نطاق تطبيقات Node.js للتعامل مع ملايين المعاملات اليومية.

## ثورة تحسين أداء النواة الواحدة بنسبة 573% {#our-573-single-core-performance-optimization-revolution}

عندما انتقلنا من معالجات Intel إلى معالجات AMD Ryzen، حققنا تحسنًا في الأداء بنسبة 573% في تطبيقات Node.js. لم يكن هذا مجرد تحسين بسيط، بل غيّر جذريًا أداء تطبيقات Node.js في بيئة الإنتاج، ويُظهر أهمية تحسين أداء النواة الواحدة لأي تطبيق Node.js.

> \[!TIP]
> للحصول على أفضل ممارسات نشر Node.js في بيئة الإنتاج، يُعد اختيار الأجهزة أمرًا بالغ الأهمية. اخترنا استضافة DataPacket خصيصًا لتوفر AMD Ryzen، لأن أداء النواة الواحدة أساسي لتطبيقات Node.js، حيث أن تنفيذ JavaScript يتم عبر خيط واحد.

### لماذا يُعد تحسين أداء النواة الفردية أمرًا مهمًا بالنسبة إلى Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

لقد أدى انتقالنا من Intel إلى AMD Ryzen إلى:

* **تحسّن الأداء بنسبة ٥٧٣٪** في معالجة الطلبات (موثّق في [صفحة حالة GitHub الخاصة بنا (مشكلة #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **التخلص من تأخيرات المعالجة** للحصول على استجابات شبه فورية (مذكورة في [مشكلة GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **نسبة سعر إلى أداء أفضل** لبيئات إنتاج Node.js
* **أوقات استجابة مُحسّنة** في جميع نقاط نهاية تطبيقاتنا

كان تحسين الأداء كبيرًا لدرجة أننا نعتبر الآن معالجات AMD Ryzen أساسية لأي نشر إنتاجي جدي لـ Node.js، سواء كنت تُشغّل تطبيقات ويب، أو واجهات برمجة تطبيقات، أو خدمات مصغرة، أو أي عبء عمل آخر يتعلق بـ Node.js.

### محتوى ذو صلة {#related-content}

لمزيد من التفاصيل حول خيارات البنية التحتية لدينا، يُرجى الاطلاع على:

* [أفضل خدمة إعادة توجيه بريد إلكتروني]](https://forwardemail.net/blog/docs/best-email-forwarding-service) - مقارنات الأداء)
* [حل الاستضافة الذاتية](https://forwardemail.net/blog/docs/self-hosted-solution) - توصيات الأجهزة

إعداد بيئة إنتاج Node.js ##: مجموعة التكنولوجيا الخاصة بنا {#nodejs-production-environment-setup-our-technology-stack}

تتضمن أفضل ممارساتنا لنشر Node.js في الإنتاج اختيارات تقنية مدروسة بناءً على سنوات من الخبرة في الإنتاج. إليك ما نستخدمه ولماذا تنطبق هذه الخيارات على أي تطبيق Node.js:

مدير الحزمة ###: pnpm لكفاءة الإنتاج {#package-manager-pnpm-for-production-efficiency}

**ما نستخدمه:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (الإصدار المثبت)

لقد اخترنا pnpm بدلاً من npm وyarn لإعداد بيئة إنتاج Node.js الخاصة بنا للأسباب التالية:

* **أوقات تثبيت أسرع** في خطوط أنابيب CI/CD
* **كفاءة مساحة القرص** من خلال الربط الثابت
* **حل دقيق للتبعيات** يمنع التبعيات الوهمية
* **أداء أفضل** في عمليات النشر الإنتاجية

كجزء من أفضل ممارسات نشر Node.js في الإنتاج، نُثبّت إصدارات دقيقة من الأدوات المهمة مثل pnpm لضمان اتساق الأداء في جميع البيئات وأجهزة أعضاء الفريق.

**تفاصيل التنفيذ:**

* [تكوين package.json الخاص بنا](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [تدوينة مدونة نظام إدارة الأداء الوطني الخاص بنا](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

إطار عمل الويب ###: Koa لإنتاج Node.js الحديث {#web-framework-koa-for-modern-nodejs-production}

**ما نستخدمه:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

اخترنا Koa بدلاً من Express لبنية Node.js الإنتاجية بفضل دعمه الحديث لـ async/await وتركيبته الأنظف للبرامج الوسيطة. ساهم مؤسسنا، نيك باو، في كلٍّ من Express وKoa، مما منحنا فهمًا عميقًا لكلا الإطارين للاستخدام الإنتاجي.

تنطبق هذه الأنماط سواء كنت تقوم ببناء واجهات برمجة تطبيقات REST، أو خوادم GraphQL، أو تطبيقات الويب، أو الخدمات المصغرة.

**أمثلة التنفيذ لدينا:**

* [إعداد خادم الويب](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [تكوين خادم API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [دليل تنفيذ نماذج الاتصال](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### معالجة الوظيفة الخلفية: Bree لموثوقية الإنتاج {#background-job-processing-bree-for-production-reliability}

**ما نستخدمه:** مجدول [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

لقد أنشأنا Bree وصيانته لأن مُجدولات المهام الحالية لم تُلبِّ احتياجاتنا لدعم خيوط العمل وميزات JavaScript الحديثة في بيئات Node.js الإنتاجية. ينطبق هذا على أي تطبيق Node.js يحتاج إلى معالجة خلفية، أو مهام مجدولة، أو خيوط عمل.

**أمثلة التنفيذ لدينا:**

* [إعداد خادم بري](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [جميع تعريفات الوظائف لدينا](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [وظيفة فحص صحة PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [تنفيذ مهمة التنظيف](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

معالجة الخطأ ###: @hapi/boom لموثوقية الإنتاج {#error-handling-hapiboom-for-production-reliability}

**ما نستخدمه:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

نستخدم @hapi/boom لاستجابات منظمة للأخطاء في جميع تطبيقات Node.js الإنتاجية. ينطبق هذا النمط على أي تطبيق Node.js يتطلب معالجة متسقة للأخطاء.

**أمثلة التنفيذ لدينا:**

* [مساعد تصنيف الأخطاء](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [تنفيذ المسجل](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## كيفية مراقبة تطبيقات Node.js في الإنتاج {#how-to-monitor-nodejs-applications-in-production}

لقد تطور نهجنا في مراقبة تطبيقات Node.js في بيئة الإنتاج على مر السنين من تشغيل التطبيقات على نطاق واسع. نطبق المراقبة على طبقات متعددة لضمان الموثوقية والأداء لأي نوع من تطبيقات Node.js.

### مراقبة إنتاج Node.js على مستوى النظام {#system-level-nodejs-production-monitoring}

**تنفيذنا الأساسي:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**ما نستخدمه:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

عتبات مراقبة الإنتاج لدينا (من رمز الإنتاج الفعلي لدينا):

* **حد أقصى لحجم الكومة ٢ غيغابايت** مع تنبيهات تلقائية
* **حد تحذير استخدام الذاكرة ٢٥٪**
* **حد تحذير استخدام وحدة المعالجة المركزية ٨٠٪**
* **حد تحذير استخدام القرص ٧٥٪**

> \[!WARNING]
> تعمل هذه الحدود مع إعدادات أجهزتنا المحددة. عند تنفيذ مراقبة إنتاج Node.js، راجع تنفيذ monitor-server.js لفهم المنطق الدقيق وتعديل القيم بما يتناسب مع إعداداتك.

### مراقبة مستوى التطبيق لإنتاج Node.js {#application-level-monitoring-for-nodejs-production}

**تصنيف الخطأ لدينا:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

يميز هذا المساعد بين:

* **أخطاء برمجية فعلية** تتطلب اهتمامًا فوريًا
* **أخطاء المستخدم** التي تُعتبر سلوكًا متوقعًا
* **أعطال الخدمة الخارجية** التي لا يمكننا التحكم فيها

ينطبق هذا النمط على أي تطبيق Node.js - تطبيقات الويب، أو واجهات برمجة التطبيقات، أو الخدمات المصغرة، أو الخدمات الخلفية.

**تنفيذ التسجيل الخاص بنا:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

نحن ننفذ عملية تحرير شاملة للحقول لحماية المعلومات الحساسة مع الحفاظ على قدرات التصحيح المفيدة في بيئة إنتاج Node.js الخاصة بنا.

### مراقبة خاصة بالتطبيق {#application-specific-monitoring}

**تنفيذات الخادم لدينا:**

* [خادم SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [خادم IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [خادم POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**مراقبة قائمة الانتظار:** نُطبّق حدودًا لقائمة الانتظار تبلغ 5 جيجابايت، ونُطبّق مهلة زمنية قدرها 180 ثانية لمعالجة الطلبات، وذلك لمنع استنفاد الموارد. تُطبّق هذه الأنماط على أي تطبيق Node.js يحتوي على قوائم انتظار أو معالجة خلفية.

## مراقبة إنتاج Node.js باستخدام فحوصات صحة PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

لقد حسّنا بيئة إنتاج Node.js لدينا باستخدام PM2 على مر سنوات من الخبرة في الإنتاج. تُعد فحوصات PM2 الخاصة بنا ضرورية للحفاظ على موثوقية أي تطبيق Node.js.

### نظام فحص صحة PM2 الخاص بنا {#our-pm2-health-check-system}

**تنفيذنا الأساسي:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

تتضمن مراقبة إنتاج Node.js لدينا مع فحوصات صحة PM2 ما يلي:

* **يعمل كل ٢٠ دقيقة** عبر جدولة المهام الدورية
* **يتطلب ١٥ دقيقة تشغيل كحد أدنى** قبل اعتبار العملية سليمة
* **يتحقق من حالة العملية واستخدام الذاكرة**
* **يعيد تشغيل العمليات الفاشلة تلقائيًا**
* **يمنع تكرار إعادة التشغيل** من خلال فحص الحالة الذكي

> \[!CAUTION]
> لأفضل ممارسات نشر Node.js في الإنتاج، نحتاج إلى 15 دقيقة أو أكثر من وقت التشغيل قبل اعتبار العملية سليمة لتجنب تكرار إعادة التشغيل. هذا يمنع تكرار الأعطال عند مواجهة العمليات مشاكل في الذاكرة أو غيرها من المشاكل.

### تكوين إنتاج PM2 الخاص بنا {#our-pm2-production-configuration}

**إعداد نظامنا البيئي:** دراسة ملفات بدء تشغيل الخادم لدينا لإعداد بيئة إنتاج Node.js:

* [خادم الويب](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [خادم API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [جدولة بري](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [خادم SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

تنطبق هذه الأنماط سواء كنت تقوم بتشغيل تطبيقات Express أو خوادم Koa أو واجهات برمجة تطبيقات GraphQL أو أي تطبيق Node.js آخر.

### النشر التلقائي لـ PM2 {#automated-pm2-deployment}

**نشر PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

نحن نقوم بأتمتة عملية إعداد PM2 بالكامل من خلال Ansible لضمان نشر إنتاج Node.js بشكل متسق عبر جميع خوادمنا.

## نظام معالجة وتصنيف أخطاء الإنتاج {#production-error-handling-and-classification-system}

أحد أفضل ممارسات نشر إنتاج Node.js الأكثر قيمة لدينا هو تصنيف الأخطاء الذكي الذي ينطبق على أي تطبيق Node.js:

### تنفيذ isCodeBug الخاص بنا للإنتاج {#our-iscodebug-implementation-for-production}

**المصدر:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

يوفر هذا المساعد تصنيفًا ذكيًا للأخطاء لتطبيقات Node.js في الإنتاج من أجل:

* **إعطاء الأولوية للأخطاء الفعلية** على أخطاء المستخدم
* **تحسين استجابتنا للحوادث** بالتركيز على المشكلات الحقيقية
* **تقليل إرهاق التنبيهات** من أخطاء المستخدم المتوقعة
* **فهم أفضل** للمشكلات التي يسببها التطبيق مقابل المشكلات التي يسببها المستخدم

ينطبق هذا النمط على أي تطبيق Node.js - سواء كنت تقوم ببناء مواقع التجارة الإلكترونية أو منصات SaaS أو واجهات برمجة التطبيقات أو الخدمات المصغرة.

تكامل ### مع تسجيل الإنتاج الخاص بنا {#integration-with-our-production-logging}

**تكامل مسجل البيانات لدينا:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

يستخدم مسجل البيانات لدينا `isCodeBug` لتحديد مستويات التنبيه وتحرير الحقول، مما يضمن حصولنا على إشعارات حول المشكلات الحقيقية أثناء تصفية الضوضاء في بيئة إنتاج Node.js الخاصة بنا.

### محتوى ذو صلة {#related-content-1}

تعرف على المزيد حول أنماط معالجة الأخطاء لدينا:

* [بناء نظام دفع موثوق](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - أنماط معالجة الأخطاء
* [حماية خصوصية البريد الإلكتروني](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - معالجة أخطاء الأمان

## تصحيح أخطاء الأداء المتقدم باستخدام v8-profiler-next وcpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

نستخدم أدوات تحليل بيانات متقدمة لتحليل لقطات الكومة وتصحيح أخطاء نفاد الذاكرة (OOM)، واختناقات الأداء، ومشاكل ذاكرة Node.js في بيئة الإنتاج لدينا. تُعد هذه الأدوات أساسية لأي تطبيق Node.js يواجه تسريبات في الذاكرة أو مشاكل في الأداء.

### نهجنا في إنشاء ملفات التعريف لإنتاج Node.js {#our-profiling-approach-for-nodejs-production}

**الأدوات التي نوصي بها:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - لإنشاء لقطات كومة الذاكرة المؤقتة وملفات تعريف وحدة المعالجة المركزية
* [`cpupro`](https://github.com/discoveryjs/cpupro) - لتحليل ملفات تعريف وحدة المعالجة المركزية ولقطات كومة الذاكرة المؤقتة

نستخدم v8-profiler-next وcpupro معًا لإنشاء سير عمل متكامل لتصحيح أخطاء الأداء لتطبيقات Node.js. يساعدنا هذا المزيج في تحديد تسريبات الذاكرة، واختناقات الأداء، وتحسين شيفرة الإنتاج.

### كيفية تنفيذ تحليل لقطة الكومة {#how-we-implement-heap-snapshot-analysis}

**تنفيذ المراقبة لدينا:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

تتضمن مراقبة الإنتاج لدينا إنشاء لقطات كومة تلقائية عند تجاوز حدود الذاكرة. يساعدنا هذا في تصحيح أخطاء OOM قبل أن تتسبب في تعطل التطبيق.

**أنماط التنفيذ الرئيسية:**

* **لقطات تلقائية** عندما يتجاوز حجم الكومة حد ٢ غيغابايت
* **تحليل البيانات المستند إلى الإشارة** للتحليل عند الطلب في بيئة الإنتاج
* **سياسات الاحتفاظ** لإدارة تخزين اللقطات
* **التكامل مع مهام التنظيف لدينا** للصيانة الآلية

### سير عمل تصحيح أخطاء الأداء {#performance-debugging-workflow}

**دراسة تنفيذنا الفعلي:**

* [مراقبة تنفيذ الخادم](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - مراقبة الكومة وإنشاء اللقطات
* [مهمة التنظيف](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - الاحتفاظ باللقطة وتنظيفها
* [تكامل المسجل](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - تسجيل الأداء

### التنفيذ الموصى به لتطبيق Node.js الخاص بك {#recommended-implementation-for-your-nodejs-application}

**لتحليل لقطة الكومة:**

١. **تثبيت v8-profiler-next** لإنشاء اللقطات.
٢. **استخدام cpupro** لتحليل اللقطات المُولّدة.
٣. **تنفيذ عتبات مراقبة** مشابهة لملف monitor-server.js.
٤. **إعداد التنظيف التلقائي** لإدارة تخزين اللقطات.
٥. **إنشاء معالجات إشارات** لإنشاء ملفات تعريف عند الطلب في بيئة الإنتاج.

**لتحليل ملف تعريف وحدة المعالجة المركزية:**

١. **إنشاء ملفات تعريف وحدة المعالجة المركزية** خلال فترات التحميل العالي
٢. **التحليل باستخدام cpupro** لتحديد الاختناقات
٣. **التركيز على المسارات الساخنة** وفرص التحسين
٤. **مراقبة تحسينات الأداء قبل/بعد**

> \[!WARNING]
> قد يؤثر إنشاء لقطات كومة الذاكرة المؤقتة وملفات تعريف وحدة المعالجة المركزية (CPU) على الأداء. نوصي بتطبيق نظام تقييد السرعة وتفعيل إنشاء ملفات التعريف فقط عند التحقق من مشاكل محددة أو أثناء فترات الصيانة.

تكامل ### مع مراقبة الإنتاج لدينا {#integration-with-our-production-monitoring}

تتكامل أدوات تحديد الملفات الشخصية لدينا مع استراتيجية المراقبة الأوسع نطاقًا لدينا:

* **تشغيل تلقائي** بناءً على عتبات الذاكرة/وحدة المعالجة المركزية
* **دمج التنبيهات** عند اكتشاف مشاكل في الأداء
* **تحليل تاريخي** لتتبع اتجاهات الأداء بمرور الوقت
* **الارتباط بمقاييس التطبيق** لتصحيح شامل للأخطاء

لقد ساعدنا هذا النهج في تحديد تسريبات الذاكرة وحلها، وتحسين مسارات التعليمات البرمجية الساخنة، والحفاظ على الأداء المستقر في بيئة إنتاج Node.js الخاصة بنا.

## أمان البنية التحتية للإنتاج في Node.js {#nodejs-production-infrastructure-security}

نُطبّق أمانًا شاملًا لبنية إنتاج Node.js التحتية من خلال أتمتة Ansible. تُطبّق هذه الممارسات على أي تطبيق Node.js:

### أمان على مستوى النظام لإنتاج Node.js {#system-level-security-for-nodejs-production}

**تنفيذنا لـ Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

إجراءاتنا الأمنية الرئيسية لبيئات إنتاج Node.js:

* **تم تعطيل التبديل** لمنع كتابة البيانات الحساسة على القرص.
* **تم تعطيل تفريغات النواة** لمنع تفريغات الذاكرة التي تحتوي على معلومات حساسة.
* **تم حظر وحدة تخزين USB** لمنع الوصول غير المصرح به إلى البيانات.
* **ضبط معلمات النواة** لضمان الأمان والأداء.

عند تطبيق أفضل ممارسات نشر Node.js في بيئة الإنتاج، قد يؤدي تعطيل التبديل إلى إيقاف تشغيل التطبيقات بسبب نفاد الذاكرة إذا تجاوز تطبيقك سعة ذاكرة الوصول العشوائي (RAM) المتاحة. نراقب استخدام الذاكرة بعناية ونحدد حجم خوادمنا بشكل مناسب.

### أمان التطبيقات لتطبيقات Node.js {#application-security-for-nodejs-applications}

**تحرير حقل السجل الخاص بنا:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

نقوم بحذف الحقول الحساسة من السجلات، بما في ذلك كلمات المرور والرموز ومفاتيح API والمعلومات الشخصية. هذا يحمي خصوصية المستخدم مع الحفاظ على إمكانيات تصحيح الأخطاء في أي بيئة إنتاج Node.js.

### أتمتة أمان البنية التحتية {#infrastructure-security-automation}

**إعدادنا الكامل لـ Ansible لإنتاج Node.js:**

* [دليل الأمان](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [إدارة مفاتيح SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [إدارة الشهادات](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [إعداد DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### محتوى الأمان الخاص بنا {#our-security-content}

تعرف على المزيد حول نهجنا الأمني:

* [أفضل شركات التدقيق الأمني](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [البريد الإلكتروني المشفر Quantum Safe](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [لماذا نعتمد على أمن البريد الإلكتروني مفتوح المصدر؟](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## هندسة قاعدة البيانات لتطبيقات Node.js {#database-architecture-for-nodejs-applications}

نستخدم نهج قاعدة بيانات هجينة مُحسّن لتطبيقات Node.js. يمكن تكييف هذه الأنماط مع أي تطبيق Node.js:

تنفيذ SQLite ### لإنتاج Node.js {#sqlite-implementation-for-nodejs-production}

**ما نستخدمه:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**تكويننا:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

نحن نستخدم SQLite للبيانات الخاصة بالمستخدم في تطبيقات Node.js الخاصة بنا لأنه يوفر:

* **عزل البيانات** لكل مستخدم/مستأجر
* **أداء أفضل** لاستعلامات المستخدم الفردي
* **نسخ احتياطي وترحيل مبسطان**
* **تعقيد أقل** مقارنةً بقواعد البيانات المشتركة

يعمل هذا النمط بشكل جيد لتطبيقات SaaS أو الأنظمة متعددة المستأجرين أو أي تطبيق Node.js يحتاج إلى عزل البيانات.

### تنفيذ MongoDB لإنتاج Node.js {#mongodb-implementation-for-nodejs-production}

**ما نستخدمه:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**تنفيذ الإعداد الخاص بنا:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**تكويننا:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

نحن نستخدم MongoDB لبيانات التطبيق في بيئة إنتاج Node.js الخاصة بنا لأنها توفر:

* **مخطط مرن** لهياكل البيانات المتطورة
* **أداء أفضل** للاستعلامات المعقدة
* **إمكانيات التوسع الأفقي**
* **لغة استعلام غنية**

> \[!NOTE]
> نهجنا الهجين يُحسّن استخدامنا المُحدد. ادرس أنماط استخدام قاعدة البيانات الفعلية في قاعدة الكود لفهم ما إذا كان هذا النهج يُناسب احتياجات تطبيق Node.js الخاص بك.

## معالجة وظيفة الخلفية الإنتاجية لـ Node.js {#nodejs-production-background-job-processing}

لقد بنينا بنية وظائف الخلفية لدينا حول Bree لضمان نشر Node.js الإنتاجي بشكل موثوق. ينطبق هذا على أي تطبيق Node.js يحتاج إلى معالجة خلفية:

### إعداد خادم Bree الخاص بنا للإنتاج {#our-bree-server-setup-for-production}

**تنفيذنا الرئيسي:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**نشر Ansible الخاص بنا:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### أمثلة على وظائف الإنتاج {#production-job-examples}

**مراقبة الصحة:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**أتمتة التنظيف:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**جميع وظائفنا:** [تصفح دليل الوظائف الكامل لدينا](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

تنطبق هذه الأنماط على أي تطبيق Node.js يحتاج إلى:

* مهام مجدولة (معالجة البيانات، التقارير، التنظيف)
* معالجة الخلفية (تغيير حجم الصور، إرسال البريد الإلكتروني، استيراد البيانات)
* مراقبة الحالة والصيانة
* استخدام خيط العامل للمهام التي تتطلب استخدامًا مكثفًا لوحدة المعالجة المركزية

### أنماط جدولة الوظائف الخاصة بنا لإنتاج Node.js {#our-job-scheduling-patterns-for-nodejs-production}

قم بدراسة أنماط جدولة الوظائف الفعلية لدينا في دليل الوظائف الخاص بنا لفهم:

* كيف نُطبّق جدولة شبيهة بجدولة المهام الدورية (Cron) في إنتاج Node.js
* منطق معالجة الأخطاء وإعادة المحاولة
* كيف نستخدم خيوط العمل العاملة للمهام التي تتطلب الكثير من وحدة المعالجة المركزية (CPU)

## الصيانة الآلية لتطبيقات Node.js الإنتاجية {#automated-maintenance-for-production-nodejs-applications}

نطبق صيانة استباقية لمنع مشاكل إنتاج Node.js الشائعة. تنطبق هذه الأنماط على أي تطبيق Node.js:

### تنفيذ عملية التنظيف لدينا {#our-cleanup-implementation}

**المصدر:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

تستهدف صيانتنا الآلية لتطبيقات إنتاج Node.js ما يلي:

* **ملفات مؤقتة** أقدم من ٢٤ ساعة
* **ملفات السجل** تجاوزت حدود الاحتفاظ
* **ملفات التخزين المؤقت** والبيانات المؤقتة
* **الملفات المحمّلة** التي لم تعد هناك حاجة إليها
* **لقطات كومة** من تصحيح أخطاء الأداء

تنطبق هذه الأنماط على أي تطبيق Node.js يقوم بإنشاء ملفات مؤقتة أو سجلات أو بيانات مخزنة مؤقتًا.

### إدارة مساحة القرص لإنتاج Node.js {#disk-space-management-for-nodejs-production}

**حدود المراقبة لدينا:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **حدود قائمة الانتظار** للمعالجة في الخلفية
* **حد تحذير استخدام القرص بنسبة ٧٥٪**
* **التنظيف التلقائي** عند تجاوز الحدود

### أتمتة صيانة البنية التحتية {#infrastructure-maintenance-automation}

**أتمتة Ansible الخاصة بنا لإنتاج Node.js:**

* [نشر البيئة](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [إدارة مفاتيح النشر](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## دليل تنفيذ نشر Node.js الإنتاجي {#nodejs-production-deployment-implementation-guide}

### دراسة الكود الفعلي لدينا لأفضل ممارسات الإنتاج {#study-our-actual-code-for-production-best-practices}

**ابدأ بهذه الملفات الرئيسية لإعداد بيئة إنتاج Node.js:**

١. **التكوين:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
٢. **المراقبة:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
٣. **معالجة الأخطاء:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
٤. **التسجيل:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
٥. **حالة العملية:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### تعلم من منشورات مدونتنا {#learn-from-our-blog-posts}

**أدلة التنفيذ الفنية الخاصة بنا لإنتاج Node.js:**

* [نظام بيئي لحزم NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [أنظمة دفع المباني](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [تنفيذ خصوصية البريد الإلكتروني](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [نماذج الاتصال JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [تكامل البريد الإلكتروني React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### أتمتة البنية الأساسية لإنتاج Node.js {#infrastructure-automation-for-nodejs-production}

**دليل Ansible الذي يجب دراسته لنشر Node.js في الإنتاج:**

* [دليل كتب اللعب الكاملة](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [تعزيز الأمن](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [إعداد Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### دراسات الحالة الخاصة بنا {#our-case-studies}

**تنفيذات مؤسستنا:**

* [دراسة حالة مؤسسة لينكس](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [دراسة حالة كانونيكال أوبونتو](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [إعادة توجيه البريد الإلكتروني للخريجين](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## الاستنتاج: أفضل ممارسات نشر إنتاج Node.js {#conclusion-nodejs-production-deployment-best-practices}

تُظهر البنية الأساسية لإنتاج Node.js أن تطبيقات Node.js يمكنها تحقيق موثوقية على مستوى المؤسسة من خلال:

* **خيارات أجهزة مُثبتة** (معالج AMD Ryzen لتحسين أداء النواة الواحدة بنسبة 573%)
* **مراقبة إنتاج Node.js مُختبرة عمليًا** مع عتبات مُحددة واستجابات آلية
* **تصنيف ذكي للأخطاء** لتحسين الاستجابة للحوادث في بيئات الإنتاج
* **تصحيح أخطاء الأداء المُتقدم** مع v8-profiler-next وcpupro لمنع أخطاء التشغيل التلقائي (OOM)
* **تعزيز أمني شامل** من خلال أتمتة Ansible
* **بنية قاعدة بيانات هجينة** مُحسّنة لتلبية احتياجات التطبيقات
* **صيانة آلية** لمنع مشاكل إنتاج Node.js الشائعة

**الخلاصة الرئيسية:** ادرس ملفات التنفيذ الفعلية ومنشورات المدونة لدينا بدلاً من اتباع أفضل الممارسات العامة. توفر قاعدة بياناتنا أنماطًا عملية لنشر Node.js في بيئة الإنتاج، والتي يمكن تكييفها مع أي تطبيق Node.js - تطبيقات الويب، واجهات برمجة التطبيقات، الخدمات المصغرة، أو الخدمات الخلفية.

## قائمة الموارد الكاملة لإنتاج Node.js {#complete-resource-list-for-nodejs-production}

### ملفات التنفيذ الأساسية لدينا {#our-core-implementation-files}

* [التكوين الرئيسي](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [تبعيات الحزمة](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [مراقبة الخادم](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [تصنيف الخطأ](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [نظام التسجيل](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [فحوصات صحة PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [التنظيف التلقائي](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### تنفيذات الخادم لدينا {#our-server-implementations}

* [خادم الويب](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [خادم API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [جدولة بري](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [خادم SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [خادم IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [خادم POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### أتمتة البنية التحتية لدينا {#our-infrastructure-automation}

* [جميع كتيبات Ansible الخاصة بنا](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [تعزيز الأمن](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [إعداد Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [تكوين قاعدة البيانات](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### منشورات مدونتنا التقنية {#our-technical-blog-posts}

* [تحليل النظام البيئي للإدارة السليمة للنفايات](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [تنفيذ نظام الدفع](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [دليل فني حول خصوصية البريد الإلكتروني](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [نماذج الاتصال JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [تكامل البريد الإلكتروني React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [دليل الحلول المستضافة ذاتيًا](https://forwardemail.net/blog/docs/self-hosted-solution)

### دراسات الحالة الخاصة بمؤسستنا {#our-enterprise-case-studies}

* [تنفيذ Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [دراسة حالة كانونيكال أوبونتو](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [الامتثال للحكومة الفيدرالية](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [أنظمة البريد الإلكتروني للخريجين](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)