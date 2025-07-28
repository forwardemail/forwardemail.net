# Self-Hosted Releases {#self-hosted-releases}

يوثق هذا القسم سير عمل CI/CD لحل ForwardEmail المستضاف ذاتيًا، ويشرح كيفية بناء صور Docker ونشرها وتوزيعها.

## Table of Contents {#table-of-contents}

* [ملخص](#overview)
* [سير عمل CI/CD](#cicd-workflow)
  * [سير عمل إجراءات GitHub](#github-actions-workflow)
  * [بنية صورة Docker](#docker-image-structure)
* [عملية النشر](#deployment-process)
  * [تثبيت](#installation)
  * [تكوين Docker Compose](#docker-compose-configuration)
* [ميزات الصيانة](#maintenance-features)
  * [التحديثات التلقائية](#automatic-updates)
  * [النسخ الاحتياطي والاستعادة](#backup-and-restore)
  * [تجديد الشهادة](#certificate-renewal)
* [الإصدارات](#versioning)
* [الوصول إلى الصور](#accessing-images)
* [المساهمة](#contributing)

## Overview {#overview}

يستخدم حل ForwardEmail المُستضاف ذاتيًا إجراءات GitHub لإنشاء ونشر صور Docker تلقائيًا عند إنشاء إصدار جديد. بعد ذلك، تصبح هذه الصور متاحة للمستخدمين لنشرها على خوادمهم باستخدام برنامج الإعداد المُرفق.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

تم تعريف عملية إنشاء ونشر صورة Docker ذاتية الاستضافة في `.github/workflows/docker-image-build-publish.yml`. سير العمل هذا:

١. **المشغلات**: يتم التشغيل تلقائيًا عند نشر إصدار جديد من GitHub.
٢. **البيئة**: يعمل على Ubuntu مع Node.js 18.20.4.
٣. **عملية البناء**:
* التحقق من كود المستودع.
* إعداد Docker Buildx لعمليات البناء متعددة المنصات.
* تسجيل الدخول إلى سجل حاويات GitHub (GHCR).
* تحديث المخطط للنشر الذاتي.
* بناء صورة Docker باستخدام `self-hosting/Dockerfile-selfhosted`.
* وضع علامة على الصورة بكل من إصدار الإصدار و`latest`.
* دفع الصور إلى سجل حاويات GitHub.

```yaml
# Key workflow steps
name: Build and Publish Self-Hosted Docker Image

on:
  release:
    types: [published]  # Trigger on new releases

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      # Setup steps...

      # Build and publish Docker image
      - name: Build / Publish Docker image to GitHub Container Registry
        run: |
          IMAGE_NAME=ghcr.io/${{ github.repository }}-selfhosted:${{ github.ref_name }}
          docker build -f self-hosting/Dockerfile-selfhosted -t $IMAGE_NAME .
          docker tag $IMAGE_NAME ghcr.io/${{ github.repository }}-selfhosted:latest
          docker push $IMAGE_NAME
          docker push ghcr.io/${{ github.repository }}-selfhosted:latest
```

### بنية صورة Docker {#docker-image-structure}

تم إنشاء صورة Docker باستخدام نهج متعدد المراحل محدد في `self-hosting/Dockerfile-selfhosted`:

١. **مرحلة البناء**:
* استخدام Node.js 20 كصورة أساسية
* تعيين متغير البيئة `SELF_HOSTED=true`
* تثبيت التبعيات باستخدام pnpm
* بناء التطبيق في وضع الإنتاج

٢. **المرحلة النهائية**:
* استخدام صورة Node.js 20 أصغر حجمًا
* تثبيت تبعيات النظام الضرورية فقط
* إنشاء المجلدات المطلوبة لتخزين البيانات
* نسخ التطبيق المُنشأ من مرحلة البناء

يضمن هذا النهج تحسين الصورة النهائية من حيث الحجم والأمان.

## عملية النشر {#deployment-process}

### التثبيت {#installation}

يمكن للمستخدمين نشر الحل المستضاف ذاتيًا باستخدام البرنامج النصي للإعداد المقدم:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

هذا النص:

1. استنساخ المستودع
2. إعداد البيئة
3. تكوين إعدادات DNS وجدار الحماية
4. إنشاء شهادات SSL
5. استخراج أحدث صور Docker
6. بدء تشغيل الخدمات باستخدام Docker Compose

### تكوين Docker Compose {#docker-compose-configuration}

يحدد ملف `docker-compose-self-hosted.yml` جميع الخدمات المطلوبة للحل المستضاف ذاتيًا:

* **الويب**: واجهة الويب الرئيسية
* **واجهة برمجة التطبيقات**: خادم واجهة برمجة التطبيقات للوصول البرمجي
* **SMTP**: خدمة إرسال البريد الإلكتروني
* **IMAP/POP3**: خدمات استرجاع البريد الإلكتروني
* **MX**: خدمة تبادل البريد
* **CalDAV**: خدمة التقويم
* **CardDAV**: خدمة جهات الاتصال
* **MongoDB**: قاعدة بيانات لتخزين بيانات المستخدم
* **Redis**: مخزن بيانات في الذاكرة
* **SQLite**: قاعدة بيانات لتخزين رسائل البريد الإلكتروني

تستخدم كل خدمة نفس صورة Docker ولكن بنقاط دخول مختلفة، مما يسمح بهندسة معيارية مع تبسيط الصيانة.

## ميزات الصيانة {#maintenance-features}

يتضمن الحل المستضاف ذاتيًا العديد من ميزات الصيانة:

### التحديثات التلقائية {#automatic-updates}

يمكن للمستخدمين تمكين التحديثات التلقائية التي من شأنها:

* اسحب أحدث نسخة من Docker كل ليلة.
* أعد تشغيل الخدمات باستخدام النسخة المُحدّثة.
* سجّل عملية التحديث.

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### النسخ الاحتياطي والاستعادة {#backup-and-restore}

يوفر الإعداد خيارات لـ:

* إعداد نسخ احتياطية منتظمة على وحدة تخزين متوافقة مع S3
* نسخ بيانات MongoDB وRedis وSQLite احتياطيًا
* استعادة البيانات من النسخ الاحتياطية في حال حدوث أي عطل

### تجديد الشهادة {#certificate-renewal}

يتم إدارة شهادات SSL تلقائيًا مع خيارات لـ:

* إنشاء شهادات جديدة أثناء الإعداد
* تجديد الشهادات عند الحاجة
* تكوين DKIM لمصادقة البريد الإلكتروني

## إصدار {#versioning}

يقوم كل إصدار GitHub بإنشاء صورة Docker جديدة تحمل العلامة:

1. إصدار الإصدار المحدد (مثلًا، `v1.0.0`)
2. وسم `latest` لأحدث إصدار

يمكن للمستخدمين اختيار استخدام إصدار محدد للاستقرار أو علامة `latest` للحصول دائمًا على أحدث الميزات.

## الوصول إلى الصور {#accessing-images}

صور Docker متاحة للعامة على:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (مثال على وسم الإصدار)

لا يلزم المصادقة لسحب هذه الصور.

## المساهمة {#contributing}

للمساهمة في الحل المستضاف ذاتيًا:

1. قم بإجراء تعديلات على الملفات ذات الصلة في مجلد `self-hosting`
2. اختبر محليًا أو على خادم VPS يعمل بنظام Ubuntu باستخدام البرنامج النصي `setup.sh` المُرفق
3. أرسل طلب سحب
4. بمجرد الدمج وإنشاء إصدار جديد، سيقوم سير عمل CI تلقائيًا ببناء ونشر نسخة Docker المُحدثة.