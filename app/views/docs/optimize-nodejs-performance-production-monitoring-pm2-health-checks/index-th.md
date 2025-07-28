# วิธีเพิ่มประสิทธิภาพโครงสร้างพื้นฐานการผลิตของ Node.js: แนวทางปฏิบัติที่ดีที่สุด {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img กำลังโหลด="ขี้เกียจ" src="/img/articles/nodejs-performance.webp" alt="" class="rounded-lg" />

## สารบัญ {#table-of-contents}

* [คำนำ](#foreword)
* [การปฏิวัติการเพิ่มประสิทธิภาพแกนเดี่ยว 573% ของเรา](#our-573-single-core-performance-optimization-revolution)
  * [เหตุใดการเพิ่มประสิทธิภาพการทำงานของ Single Core จึงมีความสำคัญสำหรับ Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [เนื้อหาที่เกี่ยวข้อง](#related-content)
* [การตั้งค่าสภาพแวดล้อมการผลิต Node.js: สแต็กเทคโนโลยีของเรา](#nodejs-production-environment-setup-our-technology-stack)
  * [ตัวจัดการแพ็คเกจ: pnpm เพื่อประสิทธิภาพการผลิต](#package-manager-pnpm-for-production-efficiency)
  * [กรอบงานเว็บ: Koa สำหรับการผลิต Node.js สมัยใหม่](#web-framework-koa-for-modern-nodejs-production)
  * [การประมวลผลงานพื้นฐาน: Bree สำหรับความน่าเชื่อถือของการผลิต](#background-job-processing-bree-for-production-reliability)
  * [การจัดการข้อผิดพลาด: @hapi/boom เพื่อความน่าเชื่อถือของการผลิต](#error-handling-hapiboom-for-production-reliability)
* [วิธีการตรวจสอบแอปพลิเคชัน Node.js ในการผลิต](#how-to-monitor-nodejs-applications-in-production)
  * [การตรวจสอบการผลิต Node.js ระดับระบบ](#system-level-nodejs-production-monitoring)
  * [การตรวจสอบระดับแอปพลิเคชันสำหรับการผลิต Node.js](#application-level-monitoring-for-nodejs-production)
  * [การตรวจสอบเฉพาะแอปพลิเคชัน](#application-specific-monitoring)
* [การตรวจสอบการผลิต Node.js ด้วยการตรวจสอบสุขภาพ PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [ระบบตรวจสุขภาพ PM2 ของเรา](#our-pm2-health-check-system)
  * [การกำหนดค่าการผลิต PM2 ของเรา](#our-pm2-production-configuration)
  * [การปรับใช้ PM2 อัตโนมัติ](#automated-pm2-deployment)
* [ระบบจัดการและจำแนกข้อผิดพลาดในการผลิต](#production-error-handling-and-classification-system)
  * [การใช้งาน isCodeBug ของเราสำหรับการผลิต](#our-iscodebug-implementation-for-production)
  * [การบูรณาการกับการบันทึกการผลิตของเรา](#integration-with-our-production-logging)
  * [เนื้อหาที่เกี่ยวข้อง](#related-content-1)
* [การดีบักประสิทธิภาพขั้นสูงด้วย v8-profiler-next และ cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [แนวทางการสร้างโปรไฟล์ของเราสำหรับการผลิต Node.js](#our-profiling-approach-for-nodejs-production)
  * [เราใช้การวิเคราะห์ Heap Snapshot อย่างไร](#how-we-implement-heap-snapshot-analysis)
  * [เวิร์กโฟลว์การดีบักประสิทธิภาพ](#performance-debugging-workflow)
  * [การใช้งานที่แนะนำสำหรับแอปพลิเคชัน Node.js ของคุณ](#recommended-implementation-for-your-nodejs-application)
  * [การบูรณาการกับการตรวจสอบการผลิตของเรา](#integration-with-our-production-monitoring)
* [การรักษาความปลอดภัยโครงสร้างพื้นฐานการผลิต Node.js](#nodejs-production-infrastructure-security)
  * [ความปลอดภัยระดับระบบสำหรับการผลิต Node.js](#system-level-security-for-nodejs-production)
  * [ความปลอดภัยของแอปพลิเคชันสำหรับแอปพลิเคชัน Node.js](#application-security-for-nodejs-applications)
  * [ระบบอัตโนมัติความปลอดภัยโครงสร้างพื้นฐาน](#infrastructure-security-automation)
  * [เนื้อหาความปลอดภัยของเรา](#our-security-content)
* [สถาปัตยกรรมฐานข้อมูลสำหรับแอปพลิเคชัน Node.js](#database-architecture-for-nodejs-applications)
  * [การนำ SQLite ไปใช้สำหรับการผลิต Node.js](#sqlite-implementation-for-nodejs-production)
  * [การนำ MongoDB ไปใช้สำหรับการผลิต Node.js](#mongodb-implementation-for-nodejs-production)
* [งานเบื้องหลังการผลิต Node.js](#nodejs-production-background-job-processing)
  * [การตั้งค่าเซิร์ฟเวอร์ Bree ของเราสำหรับการผลิต](#our-bree-server-setup-for-production)
  * [ตัวอย่างงานการผลิต](#production-job-examples)
  * [รูปแบบการจัดตารางงานของเราสำหรับการผลิต Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [การบำรุงรักษาอัตโนมัติสำหรับแอปพลิเคชัน Node.js การผลิต](#automated-maintenance-for-production-nodejs-applications)
  * [การดำเนินการทำความสะอาดของเรา](#our-cleanup-implementation)
  * [การจัดการพื้นที่ดิสก์สำหรับการผลิต Node.js](#disk-space-management-for-nodejs-production)
  * [การบำรุงรักษาโครงสร้างพื้นฐานระบบอัตโนมัติ](#infrastructure-maintenance-automation)
* [คู่มือการนำไปใช้งานการปรับใช้การผลิต Node.js](#nodejs-production-deployment-implementation-guide)
  * [ศึกษาโค้ดจริงของเราสำหรับแนวทางปฏิบัติที่ดีที่สุดในการผลิต](#study-our-actual-code-for-production-best-practices)
  * [เรียนรู้จากโพสต์บล็อกของเรา](#learn-from-our-blog-posts)
  * [โครงสร้างพื้นฐานอัตโนมัติสำหรับการผลิต Node.js](#infrastructure-automation-for-nodejs-production)
  * [กรณีศึกษาของเรา](#our-case-studies)
* [บทสรุป: แนวทางปฏิบัติที่ดีที่สุดในการปรับใช้การผลิต Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [รายการทรัพยากรที่สมบูรณ์สำหรับการผลิต Node.js](#complete-resource-list-for-nodejs-production)
  * [ไฟล์การใช้งานหลักของเรา](#our-core-implementation-files)
  * [การใช้งานเซิร์ฟเวอร์ของเรา](#our-server-implementations)
  * [โครงสร้างพื้นฐานอัตโนมัติของเรา](#our-infrastructure-automation)
  * [บทความบล็อกทางเทคนิคของเรา](#our-technical-blog-posts)
  * [กรณีศึกษาองค์กรของเรา](#our-enterprise-case-studies)

## คำนำ {#foreword}

ที่ Forward Email เราใช้เวลาหลายปีในการปรับปรุงการตั้งค่าสภาพแวดล้อมการผลิต Node.js ของเราให้สมบูรณ์แบบ คู่มือฉบับสมบูรณ์นี้จะแบ่งปันแนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js ในการผลิตซึ่งผ่านการทดสอบการใช้งานจริง โดยเน้นที่การเพิ่มประสิทธิภาพการทำงาน การตรวจสอบ และบทเรียนที่เราได้เรียนรู้ในการปรับขนาดแอปพลิเคชัน Node.js ให้รองรับธุรกรรมรายวันนับล้านรายการ

## การปฏิวัติการเพิ่มประสิทธิภาพแกนเดี่ยว 573% ของเรา {#our-573-single-core-performance-optimization-revolution}

เมื่อเราเปลี่ยนจากโปรเซสเซอร์ Intel มาเป็น AMD Ryzen เราประสบความสำเร็จใน**การปรับปรุงประสิทธิภาพ 573%** ในแอปพลิเคชัน Node.js ของเรา ซึ่งไม่ใช่เพียงการปรับปรุงเล็กน้อยเท่านั้น แต่ยังเปลี่ยนแปลงประสิทธิภาพการทำงานของแอปพลิเคชัน Node.js ในการผลิตโดยพื้นฐาน และแสดงให้เห็นถึงความสำคัญของการปรับปรุงประสิทธิภาพแบบคอร์เดียวสำหรับแอปพลิเคชัน Node.js ใดๆ ก็ตาม

> \[!TIP]
> For Node.js production deployment best practices, hardware choice is critical. We specifically chose DataPacket hosting for their AMD Ryzen availability because single-core performance is crucial for Node.js applications since JavaScript execution is single-threaded.

### เหตุใดการเพิ่มประสิทธิภาพการทำงานของ Single Core จึงมีความสำคัญสำหรับ Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

การโยกย้ายของเราจาก Intel ไปสู่ AMD Ryzen ส่งผลให้:

* **ประสิทธิภาพการทำงานดีขึ้น 573%** ในการประมวลผลคำขอ (ดูเอกสารประกอบใน [หน้าสถานะของเรา ปัญหา GitHub #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671)
* **ขจัดความล่าช้าในการประมวลผล** สำหรับการตอบกลับแบบแทบจะทันที (กล่าวถึงใน [ปัญหา GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298)
* **อัตราส่วนราคาต่อประสิทธิภาพที่ดีขึ้น** สำหรับสภาพแวดล้อมการใช้งานจริงของ Node.js
* **เวลาตอบสนองที่ดีขึ้น** ในทุกจุดเชื่อมต่อแอปพลิเคชันของเรา

การเพิ่มประสิทธิภาพนั้นสำคัญมากจนปัจจุบันเราถือว่าโปรเซสเซอร์ AMD Ryzen เป็นสิ่งจำเป็นสำหรับการใช้งานจริงของ Node.js ไม่ว่าคุณจะใช้งานเว็บแอปพลิเคชัน, API, ไมโครเซอร์วิส หรือเวิร์กโหลดอื่นๆ ของ Node.js

### เนื้อหาที่เกี่ยวข้อง {#related-content}

สำหรับรายละเอียดเพิ่มเติมเกี่ยวกับตัวเลือกโครงสร้างพื้นฐานของเรา โปรดดูที่:

* [บริการส่งต่ออีเมลที่ดีที่สุด](https://forwardemail.net/blog/docs/best-email-forwarding-service) - การเปรียบเทียบประสิทธิภาพ
* [โซลูชันโฮสต์ด้วยตนเอง](https://forwardemail.net/blog/docs/self-hosted-solution) - คำแนะนำด้านฮาร์ดแวร์

## การตั้งค่าสภาพแวดล้อมการผลิต Node.js: สแต็กเทคโนโลยีของเรา {#nodejs-production-environment-setup-our-technology-stack}

แนวทางปฏิบัติที่ดีที่สุดในการปรับใช้การผลิต Node.js ของเราประกอบด้วยการเลือกเทคโนโลยีอย่างรอบคอบโดยพิจารณาจากประสบการณ์การผลิตหลายปี นี่คือสิ่งที่เราใช้และเหตุผลที่ตัวเลือกเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ใดๆ:

### ตัวจัดการแพ็คเกจ: pnpm เพื่อประสิทธิภาพการผลิต {#package-manager-pnpm-for-production-efficiency}

**สิ่งที่เราใช้:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (เวอร์ชันปักหมุด)

เราเลือก pnpm แทน npm และ yarn สำหรับการตั้งค่าสภาพแวดล้อมการผลิต Node.js ของเราเนื่องจาก:

* **เวลาในการติดตั้งเร็วขึ้น** ใน CI/CD pipeline
* **ประสิทธิภาพพื้นที่ดิสก์** ผ่านการเชื่อมโยงแบบฮาร์ด
* **การแก้ไขการอ้างอิงที่เข้มงวด** ที่ป้องกันการอ้างอิงแบบหลอก
* **ประสิทธิภาพที่ดีขึ้น** ในการใช้งานจริง

> \[!NOTE]
> As part of our Node.js production deployment best practices, we pin exact versions of critical tools like pnpm to ensure consistent behavior across all environments and team members' machines.

**รายละเอียดการดำเนินการ:**

* [การกำหนดค่า package.json ของเรา](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [โพสต์บล็อกระบบนิเวศ NPM ของเรา](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### กรอบงานเว็บ: Koa สำหรับการผลิต Node.js สมัยใหม่ {#web-framework-koa-for-modern-nodejs-production}

**สิ่งที่เราใช้:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

เราเลือก Koa แทน Express สำหรับโครงสร้างพื้นฐานการผลิต Node.js ของเราเนื่องจากรองรับ async/wait ที่ทันสมัยและมีมิดเดิลแวร์ที่สะอาดขึ้น Nick Baugh ผู้ก่อตั้งของเรามีส่วนสนับสนุนทั้ง Express และ Koa ทำให้เราเข้าใจเฟรมเวิร์กทั้งสองสำหรับการใช้งานการผลิตอย่างลึกซึ้ง

รูปแบบเหล่านี้ใช้ได้ไม่ว่าคุณจะกำลังสร้าง REST API, เซิร์ฟเวอร์ GraphQL, แอปพลิเคชันเว็บ หรือไมโครเซอร์วิส

**ตัวอย่างการใช้งานของเรา:**

* [การตั้งค่าเซิร์ฟเวอร์เว็บ](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [การกำหนดค่าเซิร์ฟเวอร์ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [คู่มือการนำแบบฟอร์มติดต่อไปใช้](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### การประมวลผลงานพื้นหลัง: Bree สำหรับความน่าเชื่อถือของการผลิต {#background-job-processing-bree-for-production-reliability}

**สิ่งที่เราใช้:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) ตัวกำหนดเวลา

เราสร้างและดูแล Bree เนื่องจากตัวกำหนดตารางงานที่มีอยู่ไม่ตรงตามความต้องการของเราในการรองรับเธรดเวิร์กเกอร์และฟีเจอร์ JavaScript สมัยใหม่ในสภาพแวดล้อม Node.js ของการผลิต ซึ่งใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ที่ต้องการการประมวลผลเบื้องหลัง งานที่กำหนดเวลาไว้ หรือเธรดเวิร์กเกอร์

**ตัวอย่างการใช้งานของเรา:**

* [การตั้งค่าเซิร์ฟเวอร์ Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [คำจำกัดความงานทั้งหมดของเรา](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [งานตรวจสุขภาพ PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [การดำเนินการงานทำความสะอาด](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### การจัดการข้อผิดพลาด: @hapi/boom สำหรับความน่าเชื่อถือของการผลิต {#error-handling-hapiboom-for-production-reliability}

**สิ่งที่เราใช้:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

เราใช้ @hapi/boom สำหรับการตอบสนองต่อข้อผิดพลาดแบบมีโครงสร้างตลอดการใช้งาน Node.js ของเรา รูปแบบนี้ใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ที่ต้องการการจัดการข้อผิดพลาดที่สม่ำเสมอ

**ตัวอย่างการใช้งานของเรา:**

* [ตัวช่วยจำแนกข้อผิดพลาด](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [การนำ Logger ไปใช้งาน](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## วิธีการตรวจสอบแอปพลิเคชัน Node.js ในระบบการผลิต {#how-to-monitor-nodejs-applications-in-production}

แนวทางของเราในการตรวจสอบแอปพลิเคชัน Node.js ในระบบการผลิตได้พัฒนามาจากการทำงานแอปพลิเคชันตามขนาดต่างๆ เป็นเวลาหลายปี เราใช้การตรวจสอบในหลายชั้นเพื่อให้มั่นใจถึงความน่าเชื่อถือและประสิทธิภาพสำหรับแอปพลิเคชัน Node.js ทุกประเภท

### การตรวจสอบการผลิต Node.js ระดับระบบ {#system-level-nodejs-production-monitoring}

**การใช้งานหลักของเรา:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**สิ่งที่เราใช้:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

เกณฑ์การติดตามการผลิตของเรา (จากโค้ดการผลิตจริงของเรา):

* **ขีดจำกัดขนาดฮีป 2GB** พร้อมการแจ้งเตือนอัตโนมัติ
* **การใช้หน่วยความจำ 25%** เกณฑ์การแจ้งเตือน
* **การใช้ CPU 80%** เกณฑ์การแจ้งเตือน
* **การใช้ดิสก์ 75%** เกณฑ์การแจ้งเตือน

> \[!WARNING]
> These thresholds work for our specific hardware configuration. When implementing Node.js production monitoring, review our monitor-server.js implementation to understand the exact logic and adapt the values for your setup.

### การตรวจสอบระดับแอปพลิเคชันสำหรับการผลิต Node.js {#application-level-monitoring-for-nodejs-production}

**การจำแนกข้อผิดพลาดของเรา:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

ตัวช่วยนี้จะแยกแยะระหว่าง:

* **ข้อบกพร่องของโค้ดจริง** ที่ต้องได้รับการแก้ไขทันที
* **ข้อผิดพลาดของผู้ใช้** ซึ่งเป็นพฤติกรรมที่คาดว่าจะเกิดขึ้น
* **ความล้มเหลวของบริการภายนอก** ที่เราไม่สามารถควบคุมได้

รูปแบบนี้ใช้ได้กับแอปพลิเคชัน Node.js ทั้งหมด ไม่ว่าจะเป็นแอปพลิเคชันเว็บ API ไมโครเซอร์วิส หรือบริการพื้นหลัง

**การใช้งานการบันทึกข้อมูลของเรา:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

เราใช้การแก้ไขภาคสนามแบบครอบคลุมเพื่อปกป้องข้อมูลที่ละเอียดอ่อนในขณะที่ยังคงรักษาความสามารถในการดีบักที่มีประโยชน์ในสภาพแวดล้อมการผลิต Node.js ของเรา

### การตรวจสอบเฉพาะแอปพลิเคชัน {#application-specific-monitoring}

**การใช้งานเซิร์ฟเวอร์ของเรา:**

* [เซิร์ฟเวอร์ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [เซิร์ฟเวอร์ IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [เซิร์ฟเวอร์ POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**การตรวจสอบคิว:** เราใช้การจำกัดคิวที่ 5GB และระยะเวลาหมดเวลา 180 วินาทีสำหรับการประมวลผลคำขอเพื่อป้องกันการใช้ทรัพยากรจนหมด รูปแบบเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ที่มีคิวหรือการประมวลผลเบื้องหลัง

## การตรวจสอบการผลิต Node.js ด้วยการตรวจสอบสุขภาพ PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

เราได้ปรับปรุงการตั้งค่าสภาพแวดล้อมการผลิต Node.js ด้วย PM2 จากประสบการณ์การผลิตหลายปี การตรวจสอบสุขภาพ PM2 ของเรามีความจำเป็นสำหรับการรักษาความน่าเชื่อถือในแอปพลิเคชัน Node.js

### ระบบตรวจสอบสุขภาพ PM2 ของเรา {#our-pm2-health-check-system}

**การใช้งานหลักของเรา:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

การตรวจสอบการผลิต Node.js ของเราพร้อมการตรวจสอบสุขภาพ PM2 ประกอบด้วย:

* **ทำงานทุก ๆ 20 นาที** ผ่านการกำหนดตารางเวลา cron
* **ต้องมีเวลาทำงานขั้นต่ำ 15 นาที** ก่อนที่จะพิจารณาว่ากระบวนการนั้นมีสุขภาพดี
* **ตรวจสอบสถานะกระบวนการและการใช้หน่วยความจำ**
* **รีสตาร์ทกระบวนการที่ล้มเหลวโดยอัตโนมัติ**
* **ป้องกันลูปการรีสตาร์ท** ผ่านการตรวจสอบสุขภาพอัจฉริยะ

> \[!CAUTION]
> For Node.js production deployment best practices, we require 15+ minutes uptime before considering a process healthy to avoid restart loops. This prevents cascading failures when processes are struggling with memory or other issues.

### การกำหนดค่าการผลิต PM2 ของเรา {#our-pm2-production-configuration}

**การตั้งค่าระบบนิเวศของเรา:** ศึกษาไฟล์เริ่มต้นเซิร์ฟเวอร์ของเราสำหรับการตั้งค่าสภาพแวดล้อมการผลิต Node.js:

* [เว็บเซิร์ฟเวอร์](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [เซิร์ฟเวอร์ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [ตัวจัดตารางเวลาของบรี](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [เซิร์ฟเวอร์ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

รูปแบบเหล่านี้ใช้ได้ไม่ว่าคุณจะรันแอป Express, เซิร์ฟเวอร์ Koa, GraphQL API หรือแอปพลิเคชัน Node.js อื่น ๆ

### การปรับใช้ PM2 อัตโนมัติ {#automated-pm2-deployment}

**การปรับใช้ PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

เราทำให้การตั้งค่า PM2 ทั้งหมดของเราเป็นแบบอัตโนมัติโดยใช้ Ansible เพื่อให้แน่ใจว่าการปรับใช้การผลิต Node.js สอดคล้องกันบนเซิร์ฟเวอร์ทั้งหมดของเรา

## ระบบจัดการและจำแนกข้อผิดพลาดในการผลิต {#production-error-handling-and-classification-system}

แนวทางปฏิบัติที่ดีที่สุดในการปรับใช้การผลิต Node.js ที่มีคุณค่าที่สุดประการหนึ่งของเราคือการจำแนกข้อผิดพลาดอัจฉริยะที่ใช้ได้กับแอปพลิเคชัน Node.js ทุกแอปพลิเคชัน:

### การใช้งาน isCodeBug ของเราสำหรับการผลิต {#our-iscodebug-implementation-for-production}

**ที่มา:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

ตัวช่วยนี้ให้การจำแนกข้อผิดพลาดอัจฉริยะสำหรับแอปพลิเคชัน Node.js ในการผลิตเพื่อ:

* **ให้ความสำคัญกับจุดบกพร่องที่เกิดขึ้นจริง** มากกว่าข้อผิดพลาดของผู้ใช้
* **ปรับปรุงการตอบสนองต่อเหตุการณ์** โดยเน้นที่ปัญหาที่เกิดขึ้นจริง
* **ลดความเหนื่อยล้าจากการแจ้งเตือน** จากข้อผิดพลาดของผู้ใช้ที่คาดว่าจะเกิดขึ้น
* **เข้าใจปัญหาที่เกิดขึ้นกับแอปพลิเคชันได้ดีขึ้นเมื่อเทียบกับปัญหาที่เกิดจากผู้ใช้

รูปแบบนี้ใช้ได้กับแอปพลิเคชัน Node.js ทุกแอปพลิเคชัน ไม่ว่าคุณจะกำลังสร้างไซต์อีคอมเมิร์ซ แพลตฟอร์ม SaaS, API หรือไมโครเซอร์วิส

### การบูรณาการกับการบันทึกการผลิตของเรา {#integration-with-our-production-logging}

**การรวมระบบบันทึกข้อมูลของเรา:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

โปรแกรมบันทึกข้อมูลของเราใช้ `isCodeBug` เพื่อกำหนดระดับการแจ้งเตือนและการแก้ไขข้อมูลในฟิลด์ เพื่อให้แน่ใจว่าเราได้รับการแจ้งเตือนเกี่ยวกับปัญหาที่แท้จริงในขณะที่กรองสัญญาณรบกวนในสภาพแวดล้อมการผลิต Node.js ของเรา

### เนื้อหาที่เกี่ยวข้อง {#related-content-1}

เรียนรู้เพิ่มเติมเกี่ยวกับรูปแบบการจัดการข้อผิดพลาดของเรา:

* [การสร้างระบบการชำระเงินที่เชื่อถือได้](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - รูปแบบการจัดการข้อผิดพลาด
* [การปกป้องความเป็นส่วนตัวของอีเมล์](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - การจัดการข้อผิดพลาดด้านความปลอดภัย

## การดีบักประสิทธิภาพขั้นสูงด้วย v8-profiler-next และ cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

เราใช้เครื่องมือสร้างโปรไฟล์ขั้นสูงเพื่อวิเคราะห์สแน็ปช็อตฮีปและแก้ไขปัญหา OOM (Out of Memory) คอขวดด้านประสิทธิภาพ และปัญหาหน่วยความจำของ Node.js ในสภาพแวดล้อมการผลิตของเรา เครื่องมือเหล่านี้มีความจำเป็นสำหรับแอปพลิเคชัน Node.js ใดๆ ที่ประสบปัญหาหน่วยความจำรั่วไหลหรือปัญหาด้านประสิทธิภาพ

### แนวทางการสร้างโปรไฟล์ของเราสำหรับการผลิต Node.js {#our-profiling-approach-for-nodejs-production}

**เครื่องมือที่เราแนะนำ:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - สำหรับการสร้างสแนปช็อตฮีปและโปรไฟล์ CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - สำหรับการวิเคราะห์โปรไฟล์ CPU และสแนปช็อตฮีป

> \[!TIP]
> We use v8-profiler-next and cpupro together to create a complete performance debugging workflow for our Node.js applications. This combination helps us identify memory leaks, performance bottlenecks, and optimize our production code.

### วิธีที่เราใช้การวิเคราะห์ Heap Snapshot {#how-we-implement-heap-snapshot-analysis}

**การดำเนินการตรวจสอบของเรา:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

การตรวจสอบการผลิตของเราประกอบด้วยการสร้างสแน็ปช็อตฮีปอัตโนมัติเมื่อเกินขีดจำกัดหน่วยความจำ ซึ่งช่วยให้เราแก้ไขปัญหา OOM ก่อนที่จะทำให้แอปพลิเคชันขัดข้อง

**รูปแบบการดำเนินการที่สำคัญ:**

* **การสแน็ปช็อตอัตโนมัติ** เมื่อขนาดฮีปเกินขีดจำกัด 2GB
* **การสร้างโปรไฟล์ตามสัญญาณ** สำหรับการวิเคราะห์ตามความต้องการในการผลิต
* **นโยบายการเก็บรักษา** สำหรับการจัดการที่เก็บสแน็ปช็อต
* **การบูรณาการกับงานการล้างข้อมูลของเรา** สำหรับการบำรุงรักษาอัตโนมัติ

### เวิร์กโฟลว์การดีบักประสิทธิภาพ {#performance-debugging-workflow}

**ศึกษาการใช้งานจริงของเรา:**

* [ตรวจสอบการใช้งานเซิร์ฟเวอร์](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - การตรวจสอบฮีปและการสร้างสแนปช็อต
* [งานทำความสะอาด](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - การเก็บรักษาและล้างข้อมูลสแนปช็อต
* [การรวมระบบบันทึกข้อมูล](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - การบันทึกประสิทธิภาพ

### การใช้งานที่แนะนำสำหรับแอปพลิเคชัน Node.js ของคุณ {#recommended-implementation-for-your-nodejs-application}

**สำหรับการวิเคราะห์สแน็ปช็อตฮีป:**

1. **ติดตั้ง v8-profiler-next** สำหรับการสร้างสแน็ปช็อต
2. **ใช้ cpupro** สำหรับการวิเคราะห์สแน็ปช็อตที่สร้างขึ้น
3. **ใช้เกณฑ์การตรวจสอบ** คล้ายกับ monitor-server.js ของเรา
4. **ตั้งค่าการล้างข้อมูลอัตโนมัติ** เพื่อจัดการที่เก็บสแน็ปช็อต
5. **สร้างตัวจัดการสัญญาณ** สำหรับการสร้างโปรไฟล์ตามความต้องการในการผลิต

**สำหรับการสร้างโปรไฟล์ CPU:**

1. **สร้างโปรไฟล์ CPU** ในช่วงเวลาที่มีโหลดสูง
2. **วิเคราะห์ด้วย cpupro** เพื่อระบุคอขวด
3. **เน้นที่เส้นทางหลัก** และโอกาสในการเพิ่มประสิทธิภาพ
4. **ตรวจสอบก่อน/หลัง** การปรับปรุงประสิทธิภาพ

> \[!WARNING]
> Generating heap snapshots and CPU profiles can impact performance. We recommend implementing throttling and only enabling profiling when investigating specific issues or during maintenance windows.

### การบูรณาการกับการตรวจสอบการผลิตของเรา {#integration-with-our-production-monitoring}

เครื่องมือสร้างโปรไฟล์ของเราบูรณาการกับกลยุทธ์การตรวจสอบที่กว้างขึ้นของเรา:

* **การทริกเกอร์อัตโนมัติ** ขึ้นอยู่กับเกณฑ์หน่วยความจำ/ซีพียู
* **การรวมการแจ้งเตือน** เมื่อตรวจพบปัญหาประสิทธิภาพ
* **การวิเคราะห์ประวัติ** เพื่อติดตามแนวโน้มประสิทธิภาพในช่วงเวลา
* **การเชื่อมโยงกับเมตริกแอปพลิเคชัน** สำหรับการดีบักอย่างครอบคลุม

แนวทางนี้ช่วยให้เราสามารถระบุและแก้ไขการรั่วไหลของหน่วยความจำ เพิ่มประสิทธิภาพเส้นทางโค้ดร้อน และรักษาประสิทธิภาพที่เสถียรในสภาพแวดล้อมการผลิต Node.js ของเรา

## ความปลอดภัยโครงสร้างพื้นฐานการผลิต Node.js {#nodejs-production-infrastructure-security}

เราใช้ระบบรักษาความปลอดภัยที่ครอบคลุมสำหรับโครงสร้างพื้นฐานการผลิต Node.js ของเราผ่านระบบอัตโนมัติของ Ansible แนวทางปฏิบัตินี้ใช้ได้กับแอปพลิเคชัน Node.js ทุกแอปพลิเคชัน:

### ความปลอดภัยระดับระบบสำหรับการผลิต Node.js {#system-level-security-for-nodejs-production}

**การใช้งาน Ansible ของเรา:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

มาตรการรักษาความปลอดภัยที่สำคัญของเราสำหรับสภาพแวดล้อมการผลิต Node.js:

* **ปิดการทำงานของ Swap** เพื่อป้องกันไม่ให้ข้อมูลสำคัญถูกเขียนลงในดิสก์
* **ปิดการทำงานของ Core dumps** เพื่อป้องกันไม่ให้มีการถ่ายโอนข้อมูลหน่วยความจำที่มีข้อมูลสำคัญ
* **บล็อกที่เก็บข้อมูล USB** เพื่อป้องกันการเข้าถึงข้อมูลที่ไม่ได้รับอนุญาต
* **ปรับแต่งพารามิเตอร์เคอร์เนล** สำหรับทั้งความปลอดภัยและประสิทธิภาพ

> \[!WARNING]
> When implementing Node.js production deployment best practices, disabling swap can cause out-of-memory kills if your application exceeds available RAM. We monitor memory usage carefully and size our servers appropriately.

### ความปลอดภัยของแอปพลิเคชันสำหรับแอปพลิเคชัน Node.js {#application-security-for-nodejs-applications}

**การแก้ไขฟิลด์บันทึกของเรา:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

เราลบข้อมูลสำคัญออกจากบันทึกต่างๆ รวมถึงรหัสผ่าน โทเค็น คีย์ API และข้อมูลส่วนบุคคล ซึ่งจะช่วยปกป้องความเป็นส่วนตัวของผู้ใช้ในขณะที่ยังคงความสามารถในการแก้ไขข้อบกพร่องในสภาพแวดล้อมการผลิต Node.js

### ระบบรักษาความปลอดภัยโครงสร้างพื้นฐานอัตโนมัติ {#infrastructure-security-automation}

**การตั้งค่า Ansible ที่สมบูรณ์ของเราสำหรับการผลิต Node.js:**

* [คู่มือการรักษาความปลอดภัย](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [การจัดการคีย์ SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [การจัดการใบรับรอง](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [การตั้งค่า DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### เนื้อหาความปลอดภัยของเรา {#our-security-content}

เรียนรู้เพิ่มเติมเกี่ยวกับแนวทางการรักษาความปลอดภัยของเรา:

* [บริษัทตรวจสอบความปลอดภัยที่ดีที่สุด](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [อีเมลเข้ารหัส Quantum Safe](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [เหตุใดจึงต้องใช้การรักษาความปลอดภัยอีเมลแบบโอเพนซอร์ส](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## สถาปัตยกรรมฐานข้อมูลสำหรับแอปพลิเคชัน Node.js {#database-architecture-for-nodejs-applications}

เราใช้แนวทางฐานข้อมูลไฮบริดที่ปรับให้เหมาะสมสำหรับแอปพลิเคชัน Node.js ของเรา รูปแบบเหล่านี้สามารถปรับให้เหมาะกับแอปพลิเคชัน Node.js ใดๆ ก็ได้:

### การใช้งาน SQLite สำหรับการผลิต Node.js {#sqlite-implementation-for-nodejs-production}

**สิ่งที่เราใช้:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**การกำหนดค่าของเรา:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

เราใช้ SQLite สำหรับข้อมูลเฉพาะผู้ใช้ในแอปพลิเคชัน Node.js เนื่องจากมีคุณลักษณะเหล่านี้:

* **การแยกข้อมูล** ต่อผู้ใช้/ผู้เช่า
* **ประสิทธิภาพที่ดีขึ้น** สำหรับการสอบถามผู้ใช้รายเดียว
* **การสำรองข้อมูลและการโยกย้ายที่ง่ายขึ้น**
* **ความซับซ้อนที่ลดลง** เมื่อเทียบกับฐานข้อมูลที่ใช้ร่วมกัน

รูปแบบนี้ใช้งานได้ดีสำหรับแอปพลิเคชัน SaaS ระบบผู้เช่าหลายราย หรือแอปพลิเคชัน Node.js ใดๆ ที่ต้องการแยกข้อมูล

### การใช้งาน MongoDB สำหรับการผลิต Node.js {#mongodb-implementation-for-nodejs-production}

**สิ่งที่เราใช้:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**การใช้งานการตั้งค่าของเรา:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**การกำหนดค่าของเรา:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

เราใช้ MongoDB สำหรับข้อมูลแอปพลิเคชันในสภาพแวดล้อมการผลิต Node.js เนื่องจากมีสิ่งต่อไปนี้:

* **โครงร่างที่ยืดหยุ่น** สำหรับโครงสร้างข้อมูลที่พัฒนาขึ้น
* **ประสิทธิภาพที่ดีขึ้น** สำหรับแบบสอบถามที่ซับซ้อน
* **ความสามารถในการปรับขนาดแนวนอน**
* **ภาษาสอบถามข้อมูลที่หลากหลาย**

> \[!NOTE]
> Our hybrid approach optimizes for our specific use case. Study our actual database usage patterns in the codebase to understand if this approach fits your Node.js application needs.

## การประมวลผลงานเบื้องหลังการผลิต Node.js {#nodejs-production-background-job-processing}

เราสร้างสถาปัตยกรรมงานเบื้องหลังโดยยึดตาม Bree เพื่อการปรับใช้การผลิต Node.js ที่เชื่อถือได้ ซึ่งใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ที่ต้องการการประมวลผลเบื้องหลัง:

### การตั้งค่าเซิร์ฟเวอร์ Bree ของเราสำหรับการผลิต {#our-bree-server-setup-for-production}

**การใช้งานหลักของเรา:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**การใช้งาน Ansible ของเรา:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### ตัวอย่างงานการผลิต {#production-job-examples}

**การติดตามสุขภาพ:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**การทำความสะอาดอัตโนมัติ:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**งานทั้งหมดของเรา:** [เรียกดูไดเรกทอรีงานทั้งหมดของเรา](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

รูปแบบเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ที่ต้องการ:

* งานตามกำหนดเวลา (การประมวลผลข้อมูล รายงาน การล้างข้อมูล)
* การประมวลผลพื้นหลัง (การปรับขนาดภาพ การส่งอีเมล การนำเข้าข้อมูล)
* การตรวจสอบและบำรุงรักษาสุขภาพ
* การใช้เธรดเวิร์กเกอร์สำหรับงานที่ใช้ CPU หนัก

### รูปแบบการจัดตารางงานของเราสำหรับการผลิต Node.js {#our-job-scheduling-patterns-for-nodejs-production}

ศึกษารูปแบบการจัดตารางงานจริงของเราในไดเร็กทอรีงานเพื่อทำความเข้าใจ:

* วิธีที่เราใช้การกำหนดตารางเวลาแบบ cron ในการผลิต Node.js
* การจัดการข้อผิดพลาดและตรรกะการลองใหม่ของเรา
* วิธีที่เราใช้เธรดเวิร์กเกอร์สำหรับงานที่ใช้ CPU หนัก

## การบำรุงรักษาอัตโนมัติสำหรับแอปพลิเคชัน Node.js การผลิต {#automated-maintenance-for-production-nodejs-applications}

เราใช้การบำรุงรักษาเชิงรุกเพื่อป้องกันปัญหาการผลิต Node.js ทั่วไป รูปแบบเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ทุกแอปพลิเคชัน:

### การใช้งานการล้างข้อมูลของเรา {#our-cleanup-implementation}

**ที่มา:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

การบำรุงรักษาอัตโนมัติของเราสำหรับแอปพลิเคชันการผลิต Node.js มีเป้าหมาย:

* **ไฟล์ชั่วคราว** ที่เก่ากว่า 24 ชั่วโมง
* **ไฟล์บันทึก** เกินขีดจำกัดการเก็บรักษา
* **ไฟล์แคช** และข้อมูลชั่วคราว
* **ไฟล์ที่อัปโหลด** ที่ไม่จำเป็นอีกต่อไป
* **สแน็ปช็อตฮีป** จากการดีบักประสิทธิภาพ

รูปแบบเหล่านี้ใช้กับแอปพลิเคชัน Node.js ใด ๆ ที่สร้างไฟล์ชั่วคราว บันทึก หรือข้อมูลแคช

### การจัดการพื้นที่ดิสก์สำหรับการผลิต Node.js {#disk-space-management-for-nodejs-production}

**เกณฑ์การตรวจสอบของเรา:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **ข้อจำกัดคิว** สำหรับการประมวลผลเบื้องหลัง
* **การใช้งานดิสก์ 75%** เกณฑ์การเตือน
* **การล้างข้อมูลอัตโนมัติ** เมื่อเกินเกณฑ์

### การบำรุงรักษาโครงสร้างพื้นฐานอัตโนมัติ {#infrastructure-maintenance-automation}

**ระบบอัตโนมัติ Ansible ของเราสำหรับการผลิต Node.js:**

* [การปรับใช้สภาพแวดล้อม](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [การจัดการคีย์การใช้งาน](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## คู่มือการใช้งานการปรับใช้ Node.js Production {#nodejs-production-deployment-implementation-guide}

### ศึกษาโค้ดจริงของเราสำหรับแนวทางปฏิบัติที่ดีที่สุดในการผลิต {#study-our-actual-code-for-production-best-practices}

**เริ่มต้นด้วยไฟล์สำคัญเหล่านี้สำหรับการตั้งค่าสภาพแวดล้อมการผลิต Node.js:**

1. **การกำหนดค่า:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **การตรวจสอบ:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **การจัดการข้อผิดพลาด:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **การบันทึก:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **สุขภาพของกระบวนการ:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### เรียนรู้จากโพสต์บล็อกของเรา {#learn-from-our-blog-posts}

**คู่มือการใช้งานทางเทคนิคของเราสำหรับการผลิต Node.js:**

* [ระบบนิเวศแพ็คเกจ NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [การสร้างระบบการชำระเงิน](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [การนำความเป็นส่วนตัวของอีเมล์ไปใช้](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [แบบฟอร์มการติดต่อ JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [การบูรณาการอีเมล React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### โครงสร้างพื้นฐานอัตโนมัติสำหรับการผลิต Node.js {#infrastructure-automation-for-nodejs-production}

**คู่มือ Ansible ของเราสำหรับการศึกษาการใช้งานการผลิต Node.js:**

* [ไดเรกทอรีเพลย์บุ๊กที่สมบูรณ์](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [การเสริมความปลอดภัย](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [การตั้งค่า Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### กรณีศึกษาของเรา {#our-case-studies}

**การใช้งานองค์กรของเรา:**

* [กรณีศึกษามูลนิธิ Linux](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [กรณีศึกษา Ubuntu อย่างเป็นทางการ](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [การส่งต่ออีเมล์ของศิษย์เก่า](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## บทสรุป: แนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js Production {#conclusion-nodejs-production-deployment-best-practices}

โครงสร้างพื้นฐานการผลิต Node.js ของเราแสดงให้เห็นว่าแอปพลิเคชัน Node.js สามารถบรรลุความน่าเชื่อถือระดับองค์กรได้ผ่าน:

* **ตัวเลือกฮาร์ดแวร์ที่พิสูจน์แล้ว** (AMD Ryzen สำหรับการเพิ่มประสิทธิภาพการทำงานแบบคอร์เดียว 573%)
* **การตรวจสอบการผลิต Node.js ที่ผ่านการทดสอบการใช้งานจริง** ด้วยเกณฑ์เฉพาะและการตอบสนองอัตโนมัติ
* **การจำแนกข้อผิดพลาดอัจฉริยะ** เพื่อปรับปรุงการตอบสนองต่อเหตุการณ์ในสภาพแวดล้อมการผลิต
* **การดีบักประสิทธิภาพขั้นสูง** ด้วย v8-profiler-next และ cpupro เพื่อป้องกัน OOM
* **การเสริมความแข็งแกร่งด้านความปลอดภัยอย่างครอบคลุม** ผ่านการทำงานอัตโนมัติของ Ansible
* **สถาปัตยกรรมฐานข้อมูลไฮบริด** ปรับให้เหมาะสมสำหรับความต้องการของแอปพลิเคชัน
* **การบำรุงรักษาอัตโนมัติ** เพื่อป้องกันปัญหาการผลิต Node.js ทั่วไป

**ข้อคิดเห็นที่สำคัญ:** ศึกษาไฟล์การใช้งานจริงและโพสต์บล็อกของเราแทนที่จะปฏิบัติตามแนวทางปฏิบัติที่ดีที่สุดทั่วไป ฐานโค้ดของเรามอบรูปแบบการใช้งานจริงสำหรับการใช้งาน Node.js ที่สามารถนำไปปรับใช้กับแอปพลิเคชัน Node.js ใดๆ ก็ได้ ไม่ว่าจะเป็นแอปพลิเคชันบนเว็บ API ไมโครเซอร์วิส หรือบริการเบื้องหลัง

## รายการทรัพยากรทั้งหมดสำหรับการผลิต Node.js {#complete-resource-list-for-nodejs-production}

### ไฟล์การใช้งานหลักของเรา {#our-core-implementation-files}

* [การกำหนดค่าหลัก](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [แพ็คเกจที่ต้องพึ่งพา](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [การตรวจสอบเซิร์ฟเวอร์](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [การจำแนกข้อผิดพลาด](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [ระบบการบันทึกข้อมูล](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [ตรวจสุขภาพ PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [การทำความสะอาดอัตโนมัติ](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### การใช้งานเซิร์ฟเวอร์ของเรา {#our-server-implementations}

* [เว็บเซิร์ฟเวอร์](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [เซิร์ฟเวอร์ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [ตัวจัดตารางเวลาของบรี](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [เซิร์ฟเวอร์ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [เซิร์ฟเวอร์ IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [เซิร์ฟเวอร์ POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### โครงสร้างพื้นฐานอัตโนมัติของเรา {#our-infrastructure-automation}

* [คู่มือ Ansible ทั้งหมดของเรา](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [การเสริมความปลอดภัย](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [การตั้งค่า Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [การกำหนดค่าฐานข้อมูล](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### บทความบล็อกทางเทคนิคของเรา {#our-technical-blog-posts}

* [การวิเคราะห์ระบบนิเวศ NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [การดำเนินการระบบชำระเงิน](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [คู่มือทางเทคนิคเกี่ยวกับความเป็นส่วนตัวของอีเมล](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [แบบฟอร์มการติดต่อ JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [การบูรณาการอีเมล React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [คู่มือโซลูชันโฮสต์ด้วยตนเอง](https://forwardemail.net/blog/docs/self-hosted-solution)

### กรณีศึกษาองค์กรของเรา {#our-enterprise-case-studies}

* [การนำ Linux Foundation ไปใช้งาน](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [กรณีศึกษา Ubuntu อย่างเป็นทางการ](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [การปฏิบัติตามของรัฐบาลกลาง](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [ระบบอีเมล์ศิษย์เก่า](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)