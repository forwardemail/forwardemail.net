# วิธีเพิ่มประสิทธิภาพโครงสร้างพื้นฐานการผลิต Node.js: แนวทางปฏิบัติที่ดีที่สุด {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## สารบัญ {#table-of-contents}

* [คำนำ](#foreword)
* [การปฏิวัติการเพิ่มประสิทธิภาพแกนเดี่ยว 573% ของเรา](#our-573-single-core-performance-optimization-revolution)
  * [เหตุใดการเพิ่มประสิทธิภาพการทำงานของ Single Core จึงมีความสำคัญสำหรับ Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [เนื้อหาที่เกี่ยวข้อง](#related-content)
* [การตั้งค่าสภาพแวดล้อมการผลิต Node.js: สแต็กเทคโนโลยีของเรา](#nodejs-production-environment-setup-our-technology-stack)
  * [ตัวจัดการแพ็คเกจ: pnpm เพื่อประสิทธิภาพการผลิต](#package-manager-pnpm-for-production-efficiency)
  * [กรอบงานเว็บ: Koa สำหรับการผลิต Node.js สมัยใหม่](#web-framework-koa-for-modern-nodejs-production)
  * [การประมวลผลงานเบื้องหลัง: Bree เพื่อความน่าเชื่อถือของการผลิต](#background-job-processing-bree-for-production-reliability)
  * [การจัดการข้อผิดพลาด: @hapi/boom เพื่อความน่าเชื่อถือของการผลิต](#error-handling-hapiboom-for-production-reliability)
* [วิธีการตรวจสอบแอปพลิเคชัน Node.js ในระบบการผลิต](#how-to-monitor-nodejs-applications-in-production)
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
* [ความปลอดภัยโครงสร้างพื้นฐานการผลิต Node.js](#nodejs-production-infrastructure-security)
  * [ความปลอดภัยระดับระบบสำหรับการผลิต Node.js](#system-level-security-for-nodejs-production)
  * [ความปลอดภัยของแอปพลิเคชันสำหรับแอปพลิเคชัน Node.js](#application-security-for-nodejs-applications)
  * [ระบบอัตโนมัติด้านความปลอดภัยโครงสร้างพื้นฐาน](#infrastructure-security-automation)
  * [เนื้อหาความปลอดภัยของเรา](#our-security-content)
* [สถาปัตยกรรมฐานข้อมูลสำหรับแอปพลิเคชัน Node.js](#database-architecture-for-nodejs-applications)
  * [การใช้งาน SQLite สำหรับการผลิต Node.js](#sqlite-implementation-for-nodejs-production)
  * [การนำ MongoDB ไปใช้งานจริงสำหรับ Node.js Production](#mongodb-implementation-for-nodejs-production)
* [การประมวลผลงานเบื้องหลังการผลิต Node.js](#nodejs-production-background-job-processing)
  * [การตั้งค่าเซิร์ฟเวอร์ Bree ของเราสำหรับการผลิต](#our-bree-server-setup-for-production)
  * [ตัวอย่างงานการผลิต](#production-job-examples)
  * [รูปแบบการจัดตารางงานของเราสำหรับการผลิต Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [การบำรุงรักษาอัตโนมัติสำหรับแอปพลิเคชัน Node.js การผลิต](#automated-maintenance-for-production-nodejs-applications)
  * [การดำเนินการทำความสะอาดของเรา](#our-cleanup-implementation)
  * [การจัดการพื้นที่ดิสก์สำหรับการผลิต Node.js](#disk-space-management-for-nodejs-production)
  * [การบำรุงรักษาโครงสร้างพื้นฐานอัตโนมัติ](#infrastructure-maintenance-automation)
* [คู่มือการใช้งานการปรับใช้ Node.js Production](#nodejs-production-deployment-implementation-guide)
  * [ศึกษาโค้ดจริงของเราสำหรับแนวทางปฏิบัติที่ดีที่สุดในการผลิต](#study-our-actual-code-for-production-best-practices)
  * [เรียนรู้จากโพสต์บล็อกของเรา](#learn-from-our-blog-posts)
  * [โครงสร้างพื้นฐานอัตโนมัติสำหรับการผลิต Node.js](#infrastructure-automation-for-nodejs-production)
  * [กรณีศึกษาของเรา](#our-case-studies)
* [บทสรุป: แนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js Production](#conclusion-nodejs-production-deployment-best-practices)
* [รายการทรัพยากรที่สมบูรณ์สำหรับการผลิต Node.js](#complete-resource-list-for-nodejs-production)
  * [ไฟล์การใช้งานหลักของเรา](#our-core-implementation-files)
  * [การใช้งานเซิร์ฟเวอร์ของเรา](#our-server-implementations)
  * [โครงสร้างพื้นฐานอัตโนมัติของเรา](#our-infrastructure-automation)
  * [โพสต์บล็อกทางเทคนิคของเรา](#our-technical-blog-posts)
  * [กรณีศึกษาองค์กรของเรา](#our-enterprise-case-studies)

## คำนำ {#foreword}

ที่ Forward Email เราใช้เวลาหลายปีในการปรับปรุงการตั้งค่าสภาพแวดล้อมการใช้งานจริงของ Node.js คู่มือฉบับสมบูรณ์นี้จะแบ่งปันแนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js ที่ใช้งานจริง ซึ่งผ่านการทดสอบการใช้งานจริงมาแล้ว โดยเน้นที่การเพิ่มประสิทธิภาพ การตรวจสอบ และบทเรียนที่เราได้เรียนรู้จากการขยายแอปพลิเคชัน Node.js ให้รองรับธุรกรรมหลายล้านรายการต่อวัน

## การปฏิวัติการเพิ่มประสิทธิภาพแกนเดี่ยว 573% ของเรา {#our-573-single-core-performance-optimization-revolution}

เมื่อเราเปลี่ยนจากโปรเซสเซอร์ Intel มาเป็น AMD Ryzen เราประสบความสำเร็จ **ประสิทธิภาพการทำงานเพิ่มขึ้น 573%** ในแอปพลิเคชัน Node.js ของเรา นี่ไม่ใช่แค่การปรับปรุงประสิทธิภาพเล็กน้อย แต่มันยังเปลี่ยนแปลงประสิทธิภาพการทำงานของแอปพลิเคชัน Node.js ของเราในระบบการผลิตอย่างพื้นฐาน และแสดงให้เห็นถึงความสำคัญของการปรับปรุงประสิทธิภาพแบบ Single Core สำหรับแอปพลิเคชัน Node.js ใดๆ ก็ตาม

> \[!TIP]
> สำหรับแนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js ในการผลิต การเลือกฮาร์ดแวร์เป็นสิ่งสำคัญอย่างยิ่ง เราเลือก DataPacket hosting โดยเฉพาะเนื่องจากความพร้อมใช้งานของ AMD Ryzen เนื่องจากประสิทธิภาพแบบซิงเกิลคอร์มีความสำคัญอย่างยิ่งสำหรับแอปพลิเคชัน Node.js เนื่องจากการทำงานของ JavaScript เป็นแบบซิงเกิลเธรด

### เหตุใดการเพิ่มประสิทธิภาพการทำงานของ Single Core จึงมีความสำคัญสำหรับ Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

การย้ายข้อมูลจาก Intel ไปสู่ AMD Ryzen ของเราส่งผลให้:

* **ประสิทธิภาพเพิ่มขึ้น 573%** ในการประมวลผลคำขอ (ดูเอกสารใน [ปัญหา GitHub #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671 ในหน้าสถานะของเรา
* **ขจัดความล่าช้าในการประมวลผล** สำหรับการตอบกลับแบบแทบจะทันที (กล่าวถึงใน [ปัญหา GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **อัตราส่วนราคาต่อประสิทธิภาพที่ดีขึ้น** สำหรับสภาพแวดล้อมการใช้งานจริงของ Node.js
* **เวลาตอบสนองที่ดีขึ้น** ในทุกจุดเชื่อมต่อแอปพลิเคชันของเรา

การเพิ่มประสิทธิภาพนั้นสำคัญมากจนปัจจุบันเราถือว่าโปรเซสเซอร์ AMD Ryzen เป็นสิ่งจำเป็นสำหรับการใช้งานจริงของ Node.js ไม่ว่าคุณจะใช้งานเว็บแอปพลิเคชัน, API, ไมโครเซอร์วิส หรือเวิร์กโหลดอื่นๆ ของ Node.js

### เนื้อหาที่เกี่ยวข้อง {#related-content}

สำหรับรายละเอียดเพิ่มเติมเกี่ยวกับตัวเลือกโครงสร้างพื้นฐานของเรา โปรดดูที่:

* [บริการส่งต่ออีเมลที่ดีที่สุด](https://forwardemail.net/blog/docs/best-email-forwarding-service) - การเปรียบเทียบประสิทธิภาพ
* [โซลูชันโฮสต์ด้วยตนเอง](https://forwardemail.net/blog/docs/self-hosted-solution) - คำแนะนำด้านฮาร์ดแวร์

## การตั้งค่าสภาพแวดล้อมการผลิต Node.js: สแต็กเทคโนโลยีของเรา {#nodejs-production-environment-setup-our-technology-stack}

แนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js ในระบบการผลิตของเราประกอบด้วยการเลือกใช้เทคโนโลยีอย่างรอบคอบโดยพิจารณาจากประสบการณ์การใช้งานจริงที่ยาวนาน นี่คือสิ่งที่เราใช้และเหตุผลที่ตัวเลือกเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ทุกตัว:

ตัวจัดการแพ็คเกจ ###: pnpm เพื่อประสิทธิภาพการผลิต {#package-manager-pnpm-for-production-efficiency}

**สิ่งที่เราใช้:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (เวอร์ชันปักหมุด)

เราเลือก pnpm แทน npm และ yarn สำหรับการตั้งค่าสภาพแวดล้อมการผลิต Node.js ของเราเนื่องจาก:

* **เวลาในการติดตั้งเร็วขึ้น** ในไปป์ไลน์ CI/CD
* **ประสิทธิภาพพื้นที่ดิสก์** ผ่านการเชื่อมโยงแบบฮาร์ดลิงก์
* **การแก้ไขการอ้างอิงที่เข้มงวด** เพื่อป้องกันการอ้างอิงแบบหลอก
* **ประสิทธิภาพที่ดีขึ้น** ในการใช้งานจริง

> \[!NOTE]
> ในฐานะส่วนหนึ่งของแนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js ในการผลิต เราได้ปักหมุดเวอร์ชันที่ตรงกันของเครื่องมือสำคัญๆ เช่น pnpm เพื่อให้แน่ใจว่ามีการทำงานที่สอดคล้องกันในทุกสภาพแวดล้อมและเครื่องของสมาชิกในทีม

**รายละเอียดการดำเนินการ:**

* [การกำหนดค่า package.json ของเรา](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [โพสต์บล็อกระบบนิเวศ NPM ของเรา](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### กรอบงานเว็บ: Koa สำหรับการผลิต Node.js สมัยใหม่ {#web-framework-koa-for-modern-nodejs-production}

**สิ่งที่เราใช้:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

เราเลือกใช้ Koa แทน Express สำหรับโครงสร้างพื้นฐานการผลิตของ Node.js ของเรา เนื่องจากรองรับ async/await ที่ทันสมัย และมีโครงสร้างมิดเดิลแวร์ที่สะอาดตา Nick Baugh ผู้ก่อตั้งของเราได้ร่วมพัฒนาทั้ง Express และ Koa ซึ่งทำให้เรามีความเข้าใจอย่างลึกซึ้งเกี่ยวกับเฟรมเวิร์กทั้งสองสำหรับการใช้งานจริง

รูปแบบเหล่านี้ใช้ได้ไม่ว่าคุณจะกำลังสร้าง REST API, เซิร์ฟเวอร์ GraphQL, แอปพลิเคชันเว็บ หรือไมโครเซอร์วิส

**ตัวอย่างการใช้งานของเรา:**

* [การตั้งค่าเว็บเซิร์ฟเวอร์](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [การกำหนดค่าเซิร์ฟเวอร์ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [คู่มือการใช้งานแบบฟอร์มติดต่อ](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### การประมวลผลงานพื้นหลัง: Bree สำหรับความน่าเชื่อถือของการผลิต {#background-job-processing-bree-for-production-reliability}

**สิ่งที่เราใช้:** ตัวกำหนดเวลา [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

เราสร้างและดูแล Bree เนื่องจากตัวกำหนดตารางงานที่มีอยู่ไม่ตรงกับความต้องการของเราในการรองรับเธรดเวิร์กเกอร์และฟีเจอร์ JavaScript สมัยใหม่ในสภาพแวดล้อม Node.js เวอร์ชันใช้งานจริง ปัญหานี้เกิดขึ้นกับแอปพลิเคชัน Node.js ใดๆ ที่ต้องการการประมวลผลเบื้องหลัง งานที่กำหนดเวลาไว้ หรือเธรดเวิร์กเกอร์

**ตัวอย่างการใช้งานของเรา:**

* [การตั้งค่าเซิร์ฟเวอร์ Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [คำจำกัดความงานทั้งหมดของเรา](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [งานตรวจสุขภาพ PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [การดำเนินการงานทำความสะอาด](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

การจัดการข้อผิดพลาด ###: @hapi/boom สำหรับความน่าเชื่อถือในการผลิต {#error-handling-hapiboom-for-production-reliability}

**สิ่งที่เราใช้:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

เราใช้ @hapi/boom สำหรับการตอบสนองต่อข้อผิดพลาดแบบมีโครงสร้างตลอดการใช้งาน Node.js ของเรา รูปแบบนี้ใช้ได้กับทุกแอปพลิเคชัน Node.js ที่ต้องการการจัดการข้อผิดพลาดที่สอดคล้องกัน

**ตัวอย่างการใช้งานของเรา:**

* [ตัวช่วยจำแนกข้อผิดพลาด](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [การนำ Logger ไปใช้งาน](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## วิธีการตรวจสอบแอปพลิเคชัน Node.js ในระบบการผลิต {#how-to-monitor-nodejs-applications-in-production}

แนวทางของเราในการตรวจสอบแอปพลิเคชัน Node.js ในระบบใช้งานจริงได้พัฒนามาจากประสบการณ์การใช้งานแอปพลิเคชันขนาดใหญ่หลายปี เราใช้การตรวจสอบหลายชั้นเพื่อให้มั่นใจถึงความน่าเชื่อถือและประสิทธิภาพสำหรับแอปพลิเคชัน Node.js ทุกประเภท

### การตรวจสอบการผลิต Node.js ระดับระบบ {#system-level-nodejs-production-monitoring}

**การใช้งานหลักของเรา:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**สิ่งที่เราใช้:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

เกณฑ์การติดตามการผลิตของเรา (จากโค้ดการผลิตจริงของเรา):

* **จำกัดขนาดฮีป 2GB** พร้อมการแจ้งเตือนอัตโนมัติ
* **เกณฑ์การเตือนการใช้งานหน่วยความจำ 25%**
* **เกณฑ์การเตือนการใช้งาน CPU 80%**
* **เกณฑ์การเตือนการใช้งานดิสก์ 75%**

> \[!WARNING]
> เกณฑ์เหล่านี้ใช้ได้กับการกำหนดค่าฮาร์ดแวร์เฉพาะของเรา เมื่อใช้งานการตรวจสอบการใช้งานจริงของ Node.js โปรดตรวจสอบการใช้งาน monitor-server.js ของเราเพื่อทำความเข้าใจตรรกะที่ถูกต้องและปรับค่าให้เหมาะกับการตั้งค่าของคุณ

### การตรวจสอบระดับแอปพลิเคชันสำหรับการผลิต Node.js {#application-level-monitoring-for-nodejs-production}

**การจำแนกข้อผิดพลาดของเรา:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

ตัวช่วยนี้จะแยกแยะความแตกต่างระหว่าง:

* **ข้อผิดพลาดของโค้ดจริง** ที่ต้องได้รับการแก้ไขทันที
* **ข้อผิดพลาดของผู้ใช้** ซึ่งเป็นพฤติกรรมที่คาดไว้
* **ความล้มเหลวของบริการภายนอก** ที่เราไม่สามารถควบคุมได้

รูปแบบนี้ใช้ได้กับแอปพลิเคชัน Node.js ทุกประเภท ไม่ว่าจะเป็นแอปเว็บ API ไมโครเซอร์วิส หรือบริการพื้นหลัง

**การใช้งานการบันทึกข้อมูลของเรา:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

เราใช้การแก้ไขข้อมูลภาคสนามที่ครอบคลุมเพื่อปกป้องข้อมูลที่ละเอียดอ่อนในขณะที่ยังคงรักษาความสามารถในการแก้ไขจุดบกพร่องที่มีประโยชน์ในสภาพแวดล้อมการผลิต Node.js ของเรา

### การตรวจสอบเฉพาะแอปพลิเคชัน {#application-specific-monitoring}

**การใช้งานเซิร์ฟเวอร์ของเรา:**

* [เซิร์ฟเวอร์ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [เซิร์ฟเวอร์ IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [เซิร์ฟเวอร์ POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**การตรวจสอบคิว:** เราใช้ขีดจำกัดคิว 5GB และระยะเวลาหมดเวลา 180 วินาทีสำหรับการประมวลผลคำขอเพื่อป้องกันการใช้ทรัพยากรจนหมด รูปแบบเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ที่มีคิวหรือการประมวลผลเบื้องหลัง

## การตรวจสอบการผลิต Node.js ด้วยการตรวจสอบสุขภาพ PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

เราได้ปรับปรุงการตั้งค่าสภาพแวดล้อมการผลิต Node.js ด้วย PM2 ตลอดประสบการณ์การผลิตหลายปี การตรวจสอบสุขภาพ PM2 ของเรามีความสำคัญอย่างยิ่งต่อการรักษาความน่าเชื่อถือในแอปพลิเคชัน Node.js ใดๆ

### ระบบตรวจสอบสุขภาพ PM2 ของเรา {#our-pm2-health-check-system}

**การใช้งานหลักของเรา:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

การตรวจสอบการผลิต Node.js ของเราพร้อมการตรวจสอบสุขภาพ PM2 ประกอบด้วย:

* **ทำงานทุก 20 นาที** ผ่านการจัดตารางเวลา cron
* **ต้องการเวลาทำงานอย่างน้อย 15 นาที** ก่อนที่จะพิจารณาว่ากระบวนการนั้นอยู่ในสภาพดี
* **ตรวจสอบสถานะกระบวนการและการใช้งานหน่วยความจำ**
* **รีสตาร์ทกระบวนการที่ล้มเหลวโดยอัตโนมัติ**
* **ป้องกันการวนซ้ำการรีสตาร์ท** ผ่านการตรวจสอบสุขภาพอัจฉริยะ

> \[!CAUTION]
> สำหรับแนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js ในการผลิต เรากำหนดให้มีเวลาทำงานอย่างน้อย 15 นาทีก่อนที่จะพิจารณาว่ากระบวนการอยู่ในสภาพดี เพื่อหลีกเลี่ยงการเกิดลูปการรีสตาร์ท วิธีนี้ช่วยป้องกันความล้มเหลวแบบเรียงซ้อนเมื่อกระบวนการมีปัญหากับหน่วยความจำหรือปัญหาอื่นๆ

### การกำหนดค่าการผลิต PM2 ของเรา {#our-pm2-production-configuration}

**การตั้งค่าระบบนิเวศของเรา:** ศึกษาไฟล์การเริ่มต้นเซิร์ฟเวอร์ของเราสำหรับการตั้งค่าสภาพแวดล้อมการผลิต Node.js:

* [เว็บเซิร์ฟเวอร์](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [เซิร์ฟเวอร์ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [ตัวจัดตารางเวลาของบรี](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [เซิร์ฟเวอร์ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

รูปแบบเหล่านี้ใช้ได้ไม่ว่าคุณจะรันแอป Express, เซิร์ฟเวอร์ Koa, GraphQL API หรือแอปพลิเคชัน Node.js อื่นๆ

### การปรับใช้ PM2 อัตโนมัติ {#automated-pm2-deployment}

**การปรับใช้ PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

เราทำให้การตั้งค่า PM2 ทั้งหมดของเราเป็นแบบอัตโนมัติโดยใช้ Ansible เพื่อให้แน่ใจว่าการปรับใช้การผลิต Node.js สอดคล้องกันบนเซิร์ฟเวอร์ทั้งหมดของเรา

## ระบบจัดการและจำแนกข้อผิดพลาดในการผลิต {#production-error-handling-and-classification-system}

แนวทางปฏิบัติที่ดีที่สุดในการปรับใช้การผลิต Node.js ที่มีคุณค่าที่สุดประการหนึ่งของเราคือการจำแนกข้อผิดพลาดอัจฉริยะที่ใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ก็ตาม:

### การใช้งาน isCodeBug ของเราสำหรับการผลิต {#our-iscodebug-implementation-for-production}

**ที่มา:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

ตัวช่วยนี้ช่วยจำแนกข้อผิดพลาดอย่างชาญฉลาดสำหรับแอปพลิเคชัน Node.js ในการผลิตเพื่อ:

* **ให้ความสำคัญกับข้อผิดพลาดที่เกิดขึ้นจริง** มากกว่าข้อผิดพลาดของผู้ใช้
* **ปรับปรุงการตอบสนองต่อเหตุการณ์** โดยมุ่งเน้นไปที่ปัญหาที่เกิดขึ้นจริง
* **ลดความเหนื่อยล้าจากการแจ้งเตือน** จากข้อผิดพลาดของผู้ใช้ที่คาดว่าจะเกิดขึ้น
* **เข้าใจปัญหาที่เกิดขึ้นจากแอปพลิเคชันและปัญหาที่ผู้ใช้สร้างขึ้นได้ดีขึ้น

รูปแบบนี้ใช้ได้กับแอปพลิเคชัน Node.js ทุกประเภท ไม่ว่าคุณจะกำลังสร้างไซต์อีคอมเมิร์ซ แพลตฟอร์ม SaaS, API หรือไมโครเซอร์วิส

การบูรณาการ ### กับการบันทึกการผลิตของเรา {#integration-with-our-production-logging}

**การรวมระบบบันทึกข้อมูลของเรา:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

โปรแกรมบันทึกข้อมูลของเราใช้ `isCodeBug` เพื่อกำหนดระดับการแจ้งเตือนและการแก้ไขข้อมูลในฟิลด์ เพื่อให้แน่ใจว่าเราได้รับการแจ้งเตือนเกี่ยวกับปัญหาที่แท้จริงในขณะที่กรองสัญญาณรบกวนในสภาพแวดล้อมการผลิต Node.js ของเรา

### เนื้อหาที่เกี่ยวข้อง {#related-content-1}

เรียนรู้เพิ่มเติมเกี่ยวกับรูปแบบการจัดการข้อผิดพลาดของเรา:

* [การสร้างระบบการชำระเงินที่เชื่อถือได้](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - รูปแบบการจัดการข้อผิดพลาด
* [การปกป้องความเป็นส่วนตัวของอีเมล](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - การจัดการข้อผิดพลาดด้านความปลอดภัย

## การดีบักประสิทธิภาพขั้นสูงด้วย v8-profiler-next และ cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

เราใช้เครื่องมือสร้างโปรไฟล์ขั้นสูงเพื่อวิเคราะห์สแนปช็อตฮีปและแก้ไขปัญหา OOM (หน่วยความจำไม่เพียงพอ) ปัญหาคอขวดด้านประสิทธิภาพ และปัญหาหน่วยความจำของ Node.js ในสภาพแวดล้อมการผลิตของเรา เครื่องมือเหล่านี้จำเป็นสำหรับแอปพลิเคชัน Node.js ใดๆ ที่ประสบปัญหาหน่วยความจำรั่วหรือปัญหาด้านประสิทธิภาพ

### แนวทางการสร้างโปรไฟล์ของเราสำหรับการผลิต Node.js {#our-profiling-approach-for-nodejs-production}

**เครื่องมือที่เราแนะนำ:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - สำหรับการสร้างสแนปช็อตฮีปและโปรไฟล์ CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - สำหรับการวิเคราะห์โปรไฟล์ CPU และสแนปช็อตฮีป

> \[!TIP]
> เราใช้ v8-profiler-next และ cpupro ร่วมกันเพื่อสร้างเวิร์กโฟลว์การดีบักประสิทธิภาพที่สมบูรณ์สำหรับแอปพลิเคชัน Node.js ของเรา การผสมผสานนี้ช่วยให้เราระบุการรั่วไหลของหน่วยความจำ ปัญหาคอขวดด้านประสิทธิภาพ และเพิ่มประสิทธิภาพโค้ดที่ใช้งานจริงของเรา

### วิธีที่เราใช้การวิเคราะห์ Heap Snapshot {#how-we-implement-heap-snapshot-analysis}

**การดำเนินการตรวจสอบของเรา:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

การตรวจสอบการผลิตของเรารวมถึงการสร้างสแน็ปช็อตฮีปอัตโนมัติเมื่อเกินขีดจำกัดหน่วยความจำ ซึ่งช่วยให้เราสามารถแก้ไขปัญหา OOM ก่อนที่จะทำให้แอปพลิเคชันขัดข้อง

**รูปแบบการดำเนินการที่สำคัญ:**

* **สร้างสแน็ปช็อตอัตโนมัติ** เมื่อขนาดฮีปเกินขีดจำกัด 2GB
* **การสร้างโปรไฟล์ตามสัญญาณ** สำหรับการวิเคราะห์ตามความต้องการในการใช้งานจริง
* **นโยบายการเก็บรักษา** สำหรับการจัดการพื้นที่จัดเก็บสแน็ปช็อต
* **การผสานรวมกับงานล้างข้อมูลของเรา** สำหรับการบำรุงรักษาอัตโนมัติ

### เวิร์กโฟลว์การดีบักประสิทธิภาพ {#performance-debugging-workflow}

**ศึกษาการใช้งานจริงของเรา:**

* [การใช้งานเซิร์ฟเวอร์มอนิเตอร์](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - การตรวจสอบฮีปและการสร้างสแนปช็อต
* [งานทำความสะอาด](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - การเก็บรักษาและล้างข้อมูลสแนปช็อต
* [การรวม Logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - การบันทึกประสิทธิภาพ

### การใช้งานที่แนะนำสำหรับแอปพลิเคชัน Node.js ของคุณ {#recommended-implementation-for-your-nodejs-application}

**สำหรับการวิเคราะห์สแน็ปช็อตฮีป:**

1. **ติดตั้ง v8-profiler-next** สำหรับการสร้างสแนปช็อต
2. **ใช้ cpupro** สำหรับการวิเคราะห์สแนปช็อตที่สร้างขึ้น
3. **ใช้เกณฑ์การตรวจสอบ** คล้ายกับไฟล์ monitor-server.js ของเรา
4. **ตั้งค่าการล้างข้อมูลอัตโนมัติ** เพื่อจัดการพื้นที่จัดเก็บสแนปช็อต
5. **สร้างตัวจัดการสัญญาณ** สำหรับการสร้างโปรไฟล์ตามความต้องการในการใช้งานจริง

**สำหรับการสร้างโปรไฟล์ CPU:**

1. **สร้างโปรไฟล์ CPU** ในช่วงที่มีโหลดสูง
2. **วิเคราะห์ด้วย cpupro** เพื่อระบุปัญหาคอขวด
3. **มุ่งเน้นไปที่เส้นทางหลัก** และโอกาสในการเพิ่มประสิทธิภาพ
4. **ตรวจสอบประสิทธิภาพก่อน/หลัง** การปรับปรุงประสิทธิภาพ

> \[!WARNING]
> การสร้างสแนปช็อตฮีปและโปรไฟล์ CPU อาจส่งผลกระทบต่อประสิทธิภาพการทำงาน เราขอแนะนำให้ใช้การควบคุมปริมาณข้อมูลและเปิดใช้งานการทำโปรไฟล์เฉพาะเมื่อตรวจสอบปัญหาเฉพาะหรือระหว่างช่วงเวลาการบำรุงรักษา

การบูรณาการ ### กับการตรวจสอบการผลิตของเรา {#integration-with-our-production-monitoring}

เครื่องมือสร้างโปรไฟล์ของเราบูรณาการกับกลยุทธ์การตรวจสอบที่กว้างขึ้นของเรา:

* **การทริกเกอร์อัตโนมัติ** ขึ้นอยู่กับเกณฑ์หน่วยความจำ/CPU
* **การรวมการแจ้งเตือน** เมื่อตรวจพบปัญหาด้านประสิทธิภาพ
* **การวิเคราะห์ประวัติ** เพื่อติดตามแนวโน้มประสิทธิภาพเมื่อเวลาผ่านไป
* **การเชื่อมโยงกับเมตริกแอปพลิเคชัน** เพื่อการดีบักอย่างครอบคลุม

แนวทางนี้ช่วยให้เราสามารถระบุและแก้ไขการรั่วไหลของหน่วยความจำ เพิ่มประสิทธิภาพเส้นทางโค้ดร้อน และรักษาประสิทธิภาพที่เสถียรในสภาพแวดล้อมการผลิต Node.js ของเรา

## โครงสร้างพื้นฐานการผลิต Node.js ความปลอดภัย {#nodejs-production-infrastructure-security}

เราใช้ระบบรักษาความปลอดภัยที่ครอบคลุมสำหรับโครงสร้างพื้นฐานการผลิต Node.js ของเราผ่านระบบอัตโนมัติของ Ansible แนวทางปฏิบัตินี้ใช้ได้กับแอปพลิเคชัน Node.js ทุกตัว:

### ความปลอดภัยระดับระบบสำหรับการผลิต Node.js {#system-level-security-for-nodejs-production}

**การใช้งาน Ansible ของเรา:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

มาตรการรักษาความปลอดภัยที่สำคัญของเราสำหรับสภาพแวดล้อมการผลิต Node.js:

* **ปิดใช้งาน Swap** เพื่อป้องกันการเขียนข้อมูลสำคัญลงดิสก์
* **ปิดใช้งาน Core dump** เพื่อป้องกันการถ่ายโอนข้อมูลหน่วยความจำที่มีข้อมูลสำคัญ
* **บล็อกที่เก็บข้อมูล USB** เพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต
* **ปรับแต่งพารามิเตอร์เคอร์เนล** เพื่อความปลอดภัยและประสิทธิภาพ

> \[!WARNING]
> เมื่อนำแนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js มาใช้ การปิด Swap อาจทำให้เกิดปัญหาหน่วยความจำไม่เพียงพอ หากแอปพลิเคชันของคุณมี RAM เกินขีดจำกัด เราตรวจสอบการใช้งานหน่วยความจำอย่างรอบคอบและปรับขนาดเซิร์ฟเวอร์ของเราให้เหมาะสม

### ความปลอดภัยของแอปพลิเคชันสำหรับแอปพลิเคชัน Node.js {#application-security-for-nodejs-applications}

**การแก้ไขฟิลด์บันทึกของเรา:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

เราปกปิดข้อมูลสำคัญจากบันทึกต่างๆ ซึ่งรวมถึงรหัสผ่าน โทเค็น คีย์ API และข้อมูลส่วนบุคคล เพื่อปกป้องความเป็นส่วนตัวของผู้ใช้ ในขณะเดียวกันก็รักษาความสามารถในการแก้ไขข้อบกพร่องในสภาพแวดล้อมการผลิตของ Node.js ไว้

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
* [เหตุใดจึงต้องรักษาความปลอดภัยอีเมลแบบโอเพนซอร์ส](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## สถาปัตยกรรมฐานข้อมูลสำหรับแอปพลิเคชัน Node.js {#database-architecture-for-nodejs-applications}

เราใช้แนวทางฐานข้อมูลแบบไฮบริดที่ปรับให้เหมาะสมที่สุดสำหรับแอปพลิเคชัน Node.js ของเรา รูปแบบเหล่านี้สามารถปรับใช้กับแอปพลิเคชัน Node.js ใดๆ ก็ได้:

### การใช้งาน SQLite สำหรับการผลิต Node.js {#sqlite-implementation-for-nodejs-production}

**สิ่งที่เราใช้:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**การกำหนดค่าของเรา:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

เราใช้ SQLite สำหรับข้อมูลเฉพาะผู้ใช้ในแอปพลิเคชัน Node.js เนื่องจากมีคุณลักษณะดังต่อไปนี้:

* **การแยกข้อมูล** ต่อผู้ใช้/ผู้เช่า
* **ประสิทธิภาพที่ดีขึ้น** สำหรับการสืบค้นข้อมูลแบบผู้ใช้รายเดียว
* **การสำรองข้อมูลและการโยกย้ายข้อมูลง่ายขึ้น**
* **ความซับซ้อนลดลง** เมื่อเทียบกับฐานข้อมูลที่ใช้ร่วมกัน

รูปแบบนี้ใช้งานได้ดีสำหรับแอปพลิเคชัน SaaS ระบบผู้เช่าหลายราย หรือแอปพลิเคชัน Node.js ใดๆ ที่จำเป็นต้องแยกข้อมูล

### การใช้งาน MongoDB สำหรับการผลิต Node.js {#mongodb-implementation-for-nodejs-production}

**สิ่งที่เราใช้:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**การใช้งานการตั้งค่าของเรา:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**การกำหนดค่าของเรา:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

เราใช้ MongoDB สำหรับข้อมูลแอปพลิเคชันในสภาพแวดล้อมการผลิต Node.js เนื่องจากมีคุณลักษณะต่อไปนี้:

* **โครงสร้างข้อมูลที่ยืดหยุ่น** สำหรับการพัฒนาโครงสร้างข้อมูล
* **ประสิทธิภาพที่ดีขึ้น** สำหรับการสืบค้นข้อมูลที่ซับซ้อน
* **ความสามารถในการปรับขนาดแนวนอน**
* **ภาษาการสืบค้นข้อมูลที่หลากหลาย**

> \[!NOTE]
> แนวทางแบบไฮบริดของเราปรับให้เหมาะสมกับกรณีการใช้งานเฉพาะของเรา ศึกษารูปแบบการใช้งานฐานข้อมูลจริงของเราในฐานโค้ดเพื่อทำความเข้าใจว่าแนวทางนี้เหมาะกับความต้องการแอปพลิเคชัน Node.js ของคุณหรือไม่

## การประมวลผลงานเบื้องหลังการผลิต Node.js {#nodejs-production-background-job-processing}

เราสร้างสถาปัตยกรรมงานเบื้องหลังโดยใช้ Bree เพื่อการปรับใช้ Node.js ในระบบการผลิตที่เชื่อถือได้ ซึ่งใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ที่ต้องการการประมวลผลเบื้องหลัง:

### การตั้งค่าเซิร์ฟเวอร์ Bree ของเราสำหรับการผลิต {#our-bree-server-setup-for-production}

**การใช้งานหลักของเรา:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**การปรับใช้ Ansible ของเรา:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### ตัวอย่างงานการผลิต {#production-job-examples}

**การติดตามสุขภาพ:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**การล้างข้อมูลอัตโนมัติ:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**งานทั้งหมดของเรา:** [เรียกดูไดเรกทอรีงานทั้งหมดของเรา](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

รูปแบบเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ที่ต้องการ:

* งานที่กำหนดเวลาไว้ (ประมวลผลข้อมูล, รายงาน, ล้างข้อมูล)
* ประมวลผลเบื้องหลัง (ปรับขนาดภาพ, ส่งอีเมล, นำเข้าข้อมูล)
* การตรวจสอบและบำรุงรักษาสุขภาพ
* การใช้งานเธรดเวิร์กเกอร์สำหรับงานที่ใช้ CPU หนัก

### รูปแบบการจัดตารางงานของเราสำหรับการผลิต Node.js {#our-job-scheduling-patterns-for-nodejs-production}

ศึกษารูปแบบการกำหนดตารางงานจริงของเราในไดเร็กทอรีงานของเราเพื่อทำความเข้าใจ:

* วิธีที่เรานำระบบจัดตารางเวลาแบบ cron มาใช้ใน Node.js production
* ตรรกะการจัดการข้อผิดพลาดและการลองใหม่ของเรา
* วิธีที่เราใช้ worker threads สำหรับงานที่ใช้ CPU หนัก

## การบำรุงรักษาอัตโนมัติสำหรับแอปพลิเคชัน Node.js การผลิต {#automated-maintenance-for-production-nodejs-applications}

เราใช้การบำรุงรักษาเชิงรุกเพื่อป้องกันปัญหาการใช้งาน Node.js ทั่วไป รูปแบบเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ทุกตัว:

### การดำเนินการล้างข้อมูลของเรา {#our-cleanup-implementation}

**ที่มา:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

การบำรุงรักษาอัตโนมัติของเราสำหรับแอปพลิเคชันการผลิต Node.js มีเป้าหมาย:

* **ไฟล์ชั่วคราว** ที่เก่ากว่า 24 ชั่วโมง
* **ไฟล์บันทึก** เกินขีดจำกัดการเก็บรักษา
* **ไฟล์แคช** และข้อมูลชั่วคราว
* **ไฟล์ที่อัปโหลด** ที่ไม่ต้องการอีกต่อไป
* **สแนปช็อตฮีป** จากการดีบักประสิทธิภาพ

รูปแบบเหล่านี้ใช้กับแอปพลิเคชัน Node.js ใดๆ ที่สร้างไฟล์ชั่วคราว บันทึก หรือข้อมูลแคช

### การจัดการพื้นที่ดิสก์สำหรับการผลิต Node.js {#disk-space-management-for-nodejs-production}

**เกณฑ์การตรวจสอบของเรา:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **ขีดจำกัดคิว** สำหรับการประมวลผลเบื้องหลัง
* **การใช้งานดิสก์ 75%** เกณฑ์การเตือน
* **การล้างข้อมูลอัตโนมัติ** เมื่อเกินเกณฑ์

### การบำรุงรักษาโครงสร้างพื้นฐานอัตโนมัติ {#infrastructure-maintenance-automation}

**ระบบอัตโนมัติ Ansible ของเราสำหรับการผลิต Node.js:**

* [การปรับใช้สภาพแวดล้อม](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [การจัดการคีย์การปรับใช้](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## คู่มือการใช้งาน Node.js Production Deployment {#nodejs-production-deployment-implementation-guide}

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
* [การนำนโยบายความเป็นส่วนตัวของอีเมลไปใช้](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [แบบฟอร์มติดต่อ JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [การบูรณาการอีเมล React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### โครงสร้างพื้นฐานอัตโนมัติสำหรับการผลิต Node.js {#infrastructure-automation-for-nodejs-production}

**คู่มือ Ansible ของเราสำหรับการศึกษาการใช้งานการผลิต Node.js:**

* [ไดเรกทอรีคู่มือการเล่นที่สมบูรณ์](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [การเสริมความแข็งแกร่งด้านความปลอดภัย](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [การตั้งค่า Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### กรณีศึกษาของเรา {#our-case-studies}

**การใช้งานองค์กรของเรา:**

* [กรณีศึกษาของมูลนิธิ Linux](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [กรณีศึกษา Ubuntu แบบดั้งเดิม](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [การส่งต่ออีเมลศิษย์เก่า](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## บทสรุป: แนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js Production {#conclusion-nodejs-production-deployment-best-practices}

โครงสร้างพื้นฐานการผลิต Node.js ของเราแสดงให้เห็นว่าแอปพลิเคชัน Node.js สามารถบรรลุความน่าเชื่อถือระดับองค์กรได้ผ่าน:

* **ตัวเลือกฮาร์ดแวร์ที่พิสูจน์แล้ว** (AMD Ryzen สำหรับการเพิ่มประสิทธิภาพคอร์เดี่ยว 573%)
* **การตรวจสอบการผลิต Node.js ที่ผ่านการทดสอบการใช้งานจริง** พร้อมเกณฑ์เฉพาะและการตอบสนองอัตโนมัติ
* **การจำแนกข้อผิดพลาดอัจฉริยะ** เพื่อปรับปรุงการตอบสนองต่อเหตุการณ์ในสภาพแวดล้อมการผลิต
* **การดีบักประสิทธิภาพขั้นสูง** ด้วย v8-profiler-next และ cpupro เพื่อป้องกัน OOM
* **การเสริมความแข็งแกร่งด้านความปลอดภัยอย่างครอบคลุม** ผ่านระบบอัตโนมัติ Ansible
* **สถาปัตยกรรมฐานข้อมูลแบบไฮบริด** ปรับให้เหมาะสมกับความต้องการของแอปพลิเคชัน
* **การบำรุงรักษาอัตโนมัติ** เพื่อป้องกันปัญหาทั่วไปในการผลิต Node.js

**ประเด็นสำคัญ:** ศึกษาไฟล์การใช้งานจริงและโพสต์บล็อกของเรา แทนที่จะปฏิบัติตามแนวทางปฏิบัติที่ดีที่สุดทั่วไป ฐานโค้ดของเรามีรูปแบบการใช้งานจริงสำหรับการปรับใช้ Node.js ในระบบจริง ซึ่งสามารถปรับใช้กับแอปพลิเคชัน Node.js ใดๆ ก็ได้ ไม่ว่าจะเป็นเว็บแอป, API, ไมโครเซอร์วิส หรือบริการเบื้องหลัง

## รายการทรัพยากรทั้งหมดสำหรับการผลิต Node.js {#complete-resource-list-for-nodejs-production}

### ไฟล์การใช้งานหลักของเรา {#our-core-implementation-files}

* [การกำหนดค่าหลัก](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [การอ้างอิงแพ็คเกจ](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [การตรวจสอบเซิร์ฟเวอร์](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [การจำแนกประเภทข้อผิดพลาด](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [ระบบบันทึกข้อมูล](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [การตรวจสุขภาพ PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
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
* [การเสริมความแข็งแกร่งด้านความปลอดภัย](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [การตั้งค่า Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [การกำหนดค่าฐานข้อมูล](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### บล็อกทางเทคนิคของเรา {#our-technical-blog-posts}

* [การวิเคราะห์ระบบนิเวศ NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [การนำระบบการชำระเงินไปปฏิบัติ](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [คู่มือทางเทคนิคเกี่ยวกับความเป็นส่วนตัวของอีเมล](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [แบบฟอร์มติดต่อ JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [การบูรณาการอีเมล React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [คู่มือโซลูชันโฮสต์ด้วยตนเอง](https://forwardemail.net/blog/docs/self-hosted-solution)

### กรณีศึกษาองค์กรของเรา {#our-enterprise-case-studies}

* [การนำ Linux Foundation ไปใช้งาน](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [กรณีศึกษา Ubuntu แบบดั้งเดิม](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [การปฏิบัติตามข้อกำหนดของรัฐบาลกลาง](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [ระบบอีเมล์ศิษย์เก่า](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)