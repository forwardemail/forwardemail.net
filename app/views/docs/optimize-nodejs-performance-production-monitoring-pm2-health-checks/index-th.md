# วิธีเพิ่มประสิทธิภาพโครงสร้างพื้นฐาน Node.js สำหรับการใช้งานจริง: แนวทางปฏิบัติที่ดีที่สุด {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="คู่มือการเพิ่มประสิทธิภาพ Node.js" class="rounded-lg" />


## สารบัญ {#table-of-contents}

* [คำนำ](#foreword)
* [การปฏิวัติการเพิ่มประสิทธิภาพ Single Core 573% ของเรา](#our-573-single-core-performance-optimization-revolution)
  * [ทำไมการเพิ่มประสิทธิภาพ Single Core ถึงสำคัญสำหรับ Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [เนื้อหาที่เกี่ยวข้อง](#related-content)
* [การตั้งค่าสภาพแวดล้อมการใช้งานจริง Node.js: เทคโนโลยีของเรา](#nodejs-production-environment-setup-our-technology-stack)
  * [ตัวจัดการแพ็กเกจ: pnpm เพื่อประสิทธิภาพการใช้งานจริง](#package-manager-pnpm-for-production-efficiency)
  * [เว็บเฟรมเวิร์ก: Koa สำหรับ Node.js รุ่นใหม่](#web-framework-koa-for-modern-nodejs-production)
  * [การประมวลผลงานเบื้องหลัง: Bree เพื่อความน่าเชื่อถือในการใช้งานจริง](#background-job-processing-bree-for-production-reliability)
  * [การจัดการข้อผิดพลาด: @hapi/boom เพื่อความน่าเชื่อถือในการใช้งานจริง](#error-handling-hapiboom-for-production-reliability)
* [วิธีการตรวจสอบแอปพลิเคชัน Node.js ในการใช้งานจริง](#how-to-monitor-nodejs-applications-in-production)
  * [การตรวจสอบ Node.js ระดับระบบ](#system-level-nodejs-production-monitoring)
  * [การตรวจสอบระดับแอปพลิเคชันสำหรับ Node.js ในการใช้งานจริง](#application-level-monitoring-for-nodejs-production)
  * [การตรวจสอบเฉพาะแอปพลิเคชัน](#application-specific-monitoring)
* [การตรวจสอบ Node.js ในการใช้งานจริงด้วย PM2 Health Checks](#nodejs-production-monitoring-with-pm2-health-checks)
  * [ระบบตรวจสอบสุขภาพ PM2 ของเรา](#our-pm2-health-check-system)
  * [การตั้งค่า PM2 สำหรับการใช้งานจริงของเรา](#our-pm2-production-configuration)
  * [การปรับใช้ PM2 อัตโนมัติ](#automated-pm2-deployment)
* [ระบบจัดการและจำแนกข้อผิดพลาดในการใช้งานจริง](#production-error-handling-and-classification-system)
  * [การใช้งาน isCodeBug ของเราสำหรับการใช้งานจริง](#our-iscodebug-implementation-for-production)
  * [การผสานรวมกับระบบบันทึกข้อมูลการใช้งานจริงของเรา](#integration-with-our-production-logging)
  * [เนื้อหาที่เกี่ยวข้อง](#related-content-1)
* [การดีบักประสิทธิภาพขั้นสูงด้วย v8-profiler-next และ cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [แนวทางการโปรไฟล์ของเราสำหรับ Node.js ในการใช้งานจริง](#our-profiling-approach-for-nodejs-production)
  * [วิธีการวิเคราะห์ Heap Snapshot ของเรา](#how-we-implement-heap-snapshot-analysis)
  * [เวิร์กโฟลว์การดีบักประสิทธิภาพ](#performance-debugging-workflow)
  * [การใช้งานที่แนะนำสำหรับแอปพลิเคชัน Node.js ของคุณ](#recommended-implementation-for-your-nodejs-application)
  * [การผสานรวมกับการตรวจสอบการใช้งานจริงของเรา](#integration-with-our-production-monitoring)
* [ความปลอดภัยโครงสร้างพื้นฐาน Node.js ในการใช้งานจริง](#nodejs-production-infrastructure-security)
  * [ความปลอดภัยระดับระบบสำหรับ Node.js ในการใช้งานจริง](#system-level-security-for-nodejs-production)
  * [ความปลอดภัยแอปพลิเคชันสำหรับ Node.js](#application-security-for-nodejs-applications)
  * [ระบบอัตโนมัติความปลอดภัยโครงสร้างพื้นฐาน](#infrastructure-security-automation)
  * [เนื้อหาด้านความปลอดภัยของเรา](#our-security-content)
* [สถาปัตยกรรมฐานข้อมูลสำหรับแอปพลิเคชัน Node.js](#database-architecture-for-nodejs-applications)
  * [การใช้งาน SQLite สำหรับ Node.js ในการใช้งานจริง](#sqlite-implementation-for-nodejs-production)
  * [การใช้งาน MongoDB สำหรับ Node.js ในการใช้งานจริง](#mongodb-implementation-for-nodejs-production)
* [การประมวลผลงานเบื้องหลัง Node.js ในการใช้งานจริง](#nodejs-production-background-job-processing)
  * [การตั้งค่าเซิร์ฟเวอร์ Bree ของเราสำหรับการใช้งานจริง](#our-bree-server-setup-for-production)
  * [ตัวอย่างงานในสภาพแวดล้อมจริง](#production-job-examples)
  * [รูปแบบการจัดตารางงานของเราสำหรับ Node.js ในการใช้งานจริง](#our-job-scheduling-patterns-for-nodejs-production)
* [การบำรุงรักษาอัตโนมัติสำหรับแอปพลิเคชัน Node.js ในการใช้งานจริง](#automated-maintenance-for-production-nodejs-applications)
  * [การใช้งานระบบทำความสะอาดของเรา](#our-cleanup-implementation)
  * [การจัดการพื้นที่ดิสก์สำหรับ Node.js ในการใช้งานจริง](#disk-space-management-for-nodejs-production)
  * [ระบบอัตโนมัติการบำรุงรักษาโครงสร้างพื้นฐาน](#infrastructure-maintenance-automation)
* [คู่มือการใช้งานจริงสำหรับการปรับใช้ Node.js](#nodejs-production-deployment-implementation-guide)
  * [ศึกษารหัสจริงของเราเพื่อแนวทางปฏิบัติที่ดีที่สุด](#study-our-actual-code-for-production-best-practices)
  * [เรียนรู้จากบทความบล็อกของเรา](#learn-from-our-blog-posts)
  * [ระบบอัตโนมัติสำหรับโครงสร้างพื้นฐาน Node.js ในการใช้งานจริง](#infrastructure-automation-for-nodejs-production)
  * [กรณีศึกษาของเรา](#our-case-studies)
* [บทสรุป: แนวทางปฏิบัติที่ดีที่สุดสำหรับการปรับใช้ Node.js ในการใช้งานจริง](#conclusion-nodejs-production-deployment-best-practices)
* [รายการทรัพยากรครบถ้วนสำหรับ Node.js ในการใช้งานจริง](#complete-resource-list-for-nodejs-production)
  * [ไฟล์การใช้งานหลักของเรา](#our-core-implementation-files)
  * [การใช้งานเซิร์ฟเวอร์ของเรา](#our-server-implementations)
  * [ระบบอัตโนมัติโครงสร้างพื้นฐานของเรา](#our-infrastructure-automation)
  * [บทความบล็อกเทคนิคของเรา](#our-technical-blog-posts)
  * [กรณีศึกษาธุรกิจของเรา](#our-enterprise-case-studies)
## คำนำ {#foreword}

ที่ Forward Email เราใช้เวลาหลายปีในการปรับแต่งการตั้งค่าสภาพแวดล้อมการผลิต Node.js ของเรา คู่มือฉบับสมบูรณ์นี้จะแบ่งปันแนวทางปฏิบัติที่ผ่านการทดสอบจริงสำหรับการปรับใช้ Node.js ในสภาพแวดล้อมการผลิต โดยเน้นที่การเพิ่มประสิทธิภาพการทำงาน การตรวจสอบ และบทเรียนที่เราได้เรียนรู้จากการขยายขนาดแอปพลิเคชัน Node.js เพื่อรองรับธุรกรรมหลายล้านรายการต่อวัน

## การปฏิวัติการเพิ่มประสิทธิภาพประสิทธิภาพคอร์เดี่ยว 573% ของเรา {#our-573-single-core-performance-optimization-revolution}

เมื่อเราย้ายจากโปรเซสเซอร์ Intel ไปยัง AMD Ryzen เราสามารถทำให้แอปพลิเคชัน Node.js ของเรามี **ประสิทธิภาพดีขึ้น 573%** นี่ไม่ใช่แค่การปรับแต่งเล็กน้อย แต่เป็นการเปลี่ยนแปลงพื้นฐานที่ทำให้แอปพลิเคชัน Node.js ของเราทำงานได้ดีขึ้นในสภาพแวดล้อมการผลิต และแสดงให้เห็นถึงความสำคัญของการเพิ่มประสิทธิภาพประสิทธิภาพคอร์เดี่ยวสำหรับแอปพลิเคชัน Node.js ทุกตัว

> \[!TIP]
> สำหรับแนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js ในสภาพแวดล้อมการผลิต การเลือกฮาร์ดแวร์เป็นสิ่งสำคัญ เราเลือกใช้โฮสติ้ง DataPacket โดยเฉพาะเพราะมี AMD Ryzen ให้เลือก เนื่องจากประสิทธิภาพคอร์เดี่ยวมีความสำคัญสำหรับแอปพลิเคชัน Node.js เพราะการรัน JavaScript เป็นแบบ single-threaded

### ทำไมการเพิ่มประสิทธิภาพประสิทธิภาพคอร์เดี่ยวจึงสำคัญสำหรับ Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

การย้ายจาก Intel ไปยัง AMD Ryzen ของเราทำให้เกิด:

* **ประสิทธิภาพดีขึ้น 573%** ในการประมวลผลคำขอ (มีเอกสารใน [GitHub Issue #1519 ของหน้า status ของเรา](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **ขจัดความล่าช้าในการประมวลผล** จนเกือบตอบสนองทันที (กล่าวถึงใน [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **อัตราส่วนราคาต่อประสิทธิภาพที่ดีกว่าสำหรับสภาพแวดล้อมการผลิต Node.js**
* **เวลาตอบสนองที่ดีขึ้น** ในทุกจุดเชื่อมต่อของแอปพลิเคชันของเรา

การเพิ่มประสิทธิภาพนี้มีผลอย่างมากจนตอนนี้เราถือว่าโปรเซสเซอร์ AMD Ryzen เป็นสิ่งจำเป็นสำหรับการปรับใช้ Node.js ในสภาพแวดล้อมการผลิตอย่างจริงจัง ไม่ว่าคุณจะรันเว็บแอปพลิเคชัน API ไมโครเซอร์วิส หรือภาระงาน Node.js อื่น ๆ

### เนื้อหาที่เกี่ยวข้อง {#related-content}

สำหรับรายละเอียดเพิ่มเติมเกี่ยวกับการเลือกโครงสร้างพื้นฐานของเรา โปรดดู:

* [บริการส่งต่ออีเมลที่ดีที่สุด](https://forwardemail.net/blog/docs/best-email-forwarding-service) - การเปรียบเทียบประสิทธิภาพ
* [โซลูชันโฮสต์ด้วยตนเอง](https://forwardemail.net/blog/docs/self-hosted-solution) - คำแนะนำฮาร์ดแวร์

## การตั้งค่าสภาพแวดล้อมการผลิต Node.js: เทคโนโลยีสแตกของเรา {#nodejs-production-environment-setup-our-technology-stack}

แนวทางปฏิบัติที่ดีที่สุดของเราสำหรับการปรับใช้ Node.js ในสภาพแวดล้อมการผลิตรวมถึงการเลือกเทคโนโลยีอย่างรอบคอบโดยอิงจากประสบการณ์การผลิตหลายปี นี่คือสิ่งที่เราใช้และเหตุผลที่การเลือกเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ทุกตัว:

### ตัวจัดการแพ็กเกจ: pnpm เพื่อประสิทธิภาพในการผลิต {#package-manager-pnpm-for-production-efficiency}

**สิ่งที่เราใช้:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (เวอร์ชันที่กำหนดแน่นอน)

เราเลือกใช้ pnpm แทน npm และ yarn สำหรับการตั้งค่าสภาพแวดล้อมการผลิต Node.js ของเราเพราะ:

* **เวลาติดตั้งที่เร็วขึ้น** ใน pipeline CI/CD
* **ประหยัดพื้นที่ดิสก์** ผ่านการเชื่อมโยงแบบ hard link
* **การแก้ไข dependency ที่เข้มงวด** ป้องกัน dependency ผี
* **ประสิทธิภาพที่ดีกว่า** ในการปรับใช้ในสภาพแวดล้อมการผลิต

> \[!NOTE]
> เป็นส่วนหนึ่งของแนวทางปฏิบัติที่ดีที่สุดสำหรับการปรับใช้ Node.js ในสภาพแวดล้อมการผลิต เรากำหนดเวอร์ชันที่แน่นอนของเครื่องมือสำคัญอย่าง pnpm เพื่อให้แน่ใจว่าพฤติกรรมจะสอดคล้องกันในทุกสภาพแวดล้อมและเครื่องของสมาชิกในทีมทุกคน

**รายละเอียดการใช้งาน:**

* [การตั้งค่า package.json ของเรา](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [บทความบล็อกระบบนิเวศ NPM ของเรา](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### เว็บเฟรมเวิร์ก: Koa สำหรับ Node.js การผลิตสมัยใหม่ {#web-framework-koa-for-modern-nodejs-production}

**สิ่งที่เราใช้:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
เราเลือกใช้ Koa แทน Express สำหรับโครงสร้างพื้นฐาน Node.js ในการผลิตของเราเนื่องจากรองรับ async/await ที่ทันสมัยและการจัดการ middleware ที่สะอาดกว่า ผู้ก่อตั้งของเรา Nick Baugh มีส่วนร่วมในทั้ง Express และ Koa ทำให้เราเข้าใจลึกซึ้งเกี่ยวกับทั้งสองเฟรมเวิร์กสำหรับการใช้งานในสภาพแวดล้อมการผลิต

รูปแบบเหล่านี้ใช้ได้ไม่ว่าคุณจะสร้าง REST APIs, เซิร์ฟเวอร์ GraphQL, เว็บแอปพลิเคชัน หรือไมโครเซอร์วิส

**ตัวอย่างการใช้งานของเรา:**

* [การตั้งค่าเว็บเซิร์ฟเวอร์](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [การกำหนดค่าเซิร์ฟเวอร์ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [คู่มือการใช้งานฟอร์มติดต่อ](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### การประมวลผลงานเบื้องหลัง: Bree สำหรับความน่าเชื่อถือในการผลิต {#background-job-processing-bree-for-production-reliability}

**สิ่งที่เราใช้:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) ตัวจัดตารางงาน

เราได้สร้างและดูแล Bree เพราะตัวจัดตารางงานที่มีอยู่ไม่ตอบโจทย์ความต้องการของเราในเรื่องการรองรับ worker thread และฟีเจอร์ JavaScript ที่ทันสมัยในสภาพแวดล้อม Node.js สำหรับการผลิต รูปแบบนี้ใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ที่ต้องการการประมวลผลเบื้องหลัง งานที่ตั้งเวลาไว้ หรือ worker threads

**ตัวอย่างการใช้งานของเรา:**

* [การตั้งค่าเซิร์ฟเวอร์ Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [นิยามงานทั้งหมดของเรา](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [งานตรวจสอบสุขภาพ PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [การใช้งานงานล้างข้อมูล](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### การจัดการข้อผิดพลาด: @hapi/boom สำหรับความน่าเชื่อถือในการผลิต {#error-handling-hapiboom-for-production-reliability}

**สิ่งที่เราใช้:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

เราใช้ @hapi/boom สำหรับการตอบกลับข้อผิดพลาดที่มีโครงสร้างในแอปพลิเคชัน Node.js สำหรับการผลิตทั้งหมด รูปแบบนี้ใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ที่ต้องการการจัดการข้อผิดพลาดที่สม่ำเสมอ

**ตัวอย่างการใช้งานของเรา:**

* [ตัวช่วยจำแนกประเภทข้อผิดพลาด](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [การใช้งาน logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## วิธีการตรวจสอบแอปพลิเคชัน Node.js ในการผลิต {#how-to-monitor-nodejs-applications-in-production}

แนวทางของเราในการตรวจสอบแอปพลิเคชัน Node.js ในการผลิตได้พัฒนาขึ้นผ่านประสบการณ์หลายปีในการรันแอปพลิเคชันในระดับใหญ่ เราดำเนินการตรวจสอบในหลายชั้นเพื่อให้มั่นใจในความน่าเชื่อถือและประสิทธิภาพสำหรับแอปพลิเคชัน Node.js ทุกประเภท

### การตรวจสอบระดับระบบสำหรับ Node.js ในการผลิต {#system-level-nodejs-production-monitoring}

**การใช้งานหลักของเรา:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**สิ่งที่เราใช้:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

เกณฑ์การตรวจสอบในการผลิตของเรา (จากโค้ดการผลิตจริง):

* **ขีดจำกัด heap ขนาด 2GB** พร้อมการแจ้งเตือนอัตโนมัติ
* **เกณฑ์เตือนการใช้หน่วยความจำ 25%**
* **เกณฑ์แจ้งเตือนการใช้ CPU 80%**
* **เกณฑ์เตือนการใช้ดิสก์ 75%**

> \[!WARNING]
> เกณฑ์เหล่านี้เหมาะกับการกำหนดค่าฮาร์ดแวร์เฉพาะของเรา เมื่อดำเนินการตรวจสอบ Node.js ในการผลิต โปรดตรวจสอบการใช้งาน monitor-server.js ของเราเพื่อเข้าใจตรรกะที่แน่นอนและปรับค่าตามการตั้งค่าของคุณ

### การตรวจสอบระดับแอปพลิเคชันสำหรับ Node.js ในการผลิต {#application-level-monitoring-for-nodejs-production}

**การจำแนกข้อผิดพลาดของเรา:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

ตัวช่วยนี้แยกแยะระหว่าง:

* **บั๊กโค้ดจริง** ที่ต้องการความสนใจทันที
* **ข้อผิดพลาดของผู้ใช้** ที่เป็นพฤติกรรมที่คาดหวัง
* **ความล้มเหลวของบริการภายนอก** ที่เราไม่สามารถควบคุมได้

รูปแบบนี้ใช้ได้กับแอปพลิเคชัน Node.js ใดๆ — เว็บแอป, API, ไมโครเซอร์วิส หรือบริการเบื้องหลัง
**การใช้งานระบบบันทึกของเรา:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

เราดำเนินการปกปิดข้อมูลในฟิลด์อย่างครอบคลุมเพื่อปกป้องข้อมูลที่ละเอียดอ่อนในขณะที่ยังคงรักษาความสามารถในการดีบักที่มีประโยชน์ในสภาพแวดล้อมการผลิต Node.js ของเรา

### การตรวจสอบเฉพาะแอปพลิเคชัน {#application-specific-monitoring}

**การใช้งานเซิร์ฟเวอร์ของเรา:**

* [เซิร์ฟเวอร์ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [เซิร์ฟเวอร์ IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [เซิร์ฟเวอร์ POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**การตรวจสอบคิว:** เรากำหนดขีดจำกัดคิวที่ 5GB และตั้งเวลาหมดเวลา 180 วินาทีสำหรับการประมวลผลคำขอเพื่อป้องกันการใช้ทรัพยากรเกินขีดจำกัด รูปแบบเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ใด ๆ ที่มีคิวหรือการประมวลผลเบื้องหลัง


## การตรวจสอบ Node.js ในสภาพแวดล้อมการผลิตด้วยการตรวจสุขภาพ PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

เราปรับปรุงการตั้งค่าสภาพแวดล้อมการผลิต Node.js ของเราด้วย PM2 จากประสบการณ์การผลิตหลายปี การตรวจสุขภาพ PM2 ของเราเป็นสิ่งจำเป็นสำหรับการรักษาความน่าเชื่อถือในแอปพลิเคชัน Node.js ใด ๆ

### ระบบตรวจสุขภาพ PM2 ของเรา {#our-pm2-health-check-system}

**การใช้งานหลักของเรา:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

การตรวจสอบ Node.js ในสภาพแวดล้อมการผลิตด้วยการตรวจสุขภาพ PM2 ของเรารวมถึง:

* **ทำงานทุก 20 นาที** ผ่านการตั้งเวลา cron
* **ต้องการเวลาทำงานอย่างน้อย 15 นาที** ก่อนพิจารณาว่ากระบวนการมีสุขภาพดี
* **ตรวจสอบสถานะกระบวนการและการใช้หน่วยความจำ**
* **รีสตาร์ทกระบวนการที่ล้มเหลวโดยอัตโนมัติ**
* **ป้องกันการวนลูปรีสตาร์ท** ด้วยการตรวจสุขภาพอย่างชาญฉลาด

> \[!CAUTION]
> สำหรับแนวทางปฏิบัติที่ดีที่สุดในการปรับใช้ Node.js ในสภาพแวดล้อมการผลิต เราต้องการเวลาทำงาน 15 นาทีขึ้นไปก่อนพิจารณาว่ากระบวนการมีสุขภาพดีเพื่อหลีกเลี่ยงการวนลูปรีสตาร์ท ซึ่งช่วยป้องกันความล้มเหลวแบบต่อเนื่องเมื่อกระบวนการประสบปัญหาเกี่ยวกับหน่วยความจำหรือปัญหาอื่น ๆ

### การตั้งค่า PM2 สำหรับการผลิตของเรา {#our-pm2-production-configuration}

**การตั้งค่า ecosystem ของเรา:** ศึกษาไฟล์เริ่มต้นเซิร์ฟเวอร์ของเราเพื่อการตั้งค่าสภาพแวดล้อมการผลิต Node.js:

* [เซิร์ฟเวอร์เว็บ](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [เซิร์ฟเวอร์ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [ตัวกำหนดเวลาของ Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [เซิร์ฟเวอร์ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

รูปแบบเหล่านี้ใช้ได้ไม่ว่าคุณจะรันแอป Express, เซิร์ฟเวอร์ Koa, API GraphQL หรือแอปพลิเคชัน Node.js อื่น ๆ

### การปรับใช้ PM2 อัตโนมัติ {#automated-pm2-deployment}

**การปรับใช้ PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

เราทำให้การตั้งค่า PM2 ทั้งหมดเป็นอัตโนมัติผ่าน Ansible เพื่อให้แน่ใจว่าการปรับใช้ Node.js ในสภาพแวดล้อมการผลิตมีความสม่ำเสมอในเซิร์ฟเวอร์ทั้งหมดของเรา


## ระบบจัดการและจำแนกข้อผิดพลาดในสภาพแวดล้อมการผลิต {#production-error-handling-and-classification-system}

หนึ่งในแนวทางปฏิบัติที่ดีที่สุดที่มีคุณค่ามากที่สุดสำหรับการปรับใช้ Node.js ในสภาพแวดล้อมการผลิตของเราคือการจำแนกข้อผิดพลาดอย่างชาญฉลาดที่ใช้ได้กับแอปพลิเคชัน Node.js ใด ๆ:

### การใช้งาน isCodeBug ของเราสำหรับการผลิต {#our-iscodebug-implementation-for-production}

**แหล่งที่มา:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

ตัวช่วยนี้ให้การจำแนกข้อผิดพลาดอย่างชาญฉลาดสำหรับแอปพลิเคชัน Node.js ในสภาพแวดล้อมการผลิตเพื่อ:

* **ให้ความสำคัญกับบั๊กจริง** มากกว่าข้อผิดพลาดของผู้ใช้
* **ปรับปรุงการตอบสนองต่อเหตุการณ์** โดยมุ่งเน้นที่ปัญหาจริง
* **ลดความเหนื่อยล้าจากการแจ้งเตือน** ที่เกิดจากข้อผิดพลาดของผู้ใช้ที่คาดการณ์ได้
* **เข้าใจได้ดีขึ้น** ระหว่างปัญหาที่เกิดจากแอปพลิเคชันกับที่เกิดจากผู้ใช้

รูปแบบนี้ใช้ได้กับแอปพลิเคชัน Node.js ใด ๆ — ไม่ว่าคุณจะสร้างเว็บไซต์อีคอมเมิร์ซ แพลตฟอร์ม SaaS, API หรือไมโครเซอร์วิส

### การผสานรวมกับระบบบันทึกของเราในสภาพแวดล้อมการผลิต {#integration-with-our-production-logging}

**การผสานรวม logger ของเรา:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Our logger ใช้ `isCodeBug` เพื่อกำหนดระดับการแจ้งเตือนและการปกปิดข้อมูลในฟิลด์ เพื่อให้แน่ใจว่าเราจะได้รับการแจ้งเตือนเกี่ยวกับปัญหาจริงในขณะที่กรองเสียงรบกวนในสภาพแวดล้อมการผลิต Node.js ของเรา

### Related Content {#related-content-1}

เรียนรู้เพิ่มเติมเกี่ยวกับรูปแบบการจัดการข้อผิดพลาดของเรา:

* [การสร้างระบบชำระเงินที่เชื่อถือได้](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - รูปแบบการจัดการข้อผิดพลาด
* [การปกป้องความเป็นส่วนตัวของอีเมล](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - การจัดการข้อผิดพลาดด้านความปลอดภัย


## การดีบักประสิทธิภาพขั้นสูงด้วย v8-profiler-next และ cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

เราใช้เครื่องมือโปรไฟล์ขั้นสูงเพื่อวิเคราะห์ heap snapshots และดีบักปัญหา OOM (Out of Memory), คอขวดประสิทธิภาพ และปัญหาหน่วยความจำ Node.js ในสภาพแวดล้อมการผลิตของเรา เครื่องมือเหล่านี้จำเป็นสำหรับแอปพลิเคชัน Node.js ที่ประสบปัญหารั่วไหลของหน่วยความจำหรือปัญหาประสิทธิภาพ

### วิธีการโปรไฟล์ของเราสำหรับ Node.js Production {#our-profiling-approach-for-nodejs-production}

**เครื่องมือที่เราแนะนำ:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - สำหรับสร้าง heap snapshots และ CPU profiles
* [`cpupro`](https://github.com/discoveryjs/cpupro) - สำหรับวิเคราะห์ CPU profiles และ heap snapshots

> \[!TIP]
> เราใช้ v8-profiler-next และ cpupro ร่วมกันเพื่อสร้างเวิร์กโฟลว์การดีบักประสิทธิภาพที่สมบูรณ์สำหรับแอปพลิเคชัน Node.js ของเรา การผสมผสานนี้ช่วยให้เราระบุการรั่วไหลของหน่วยความจำ คอขวดประสิทธิภาพ และปรับแต่งโค้ดในสภาพแวดล้อมการผลิตของเรา

### วิธีที่เรานำการวิเคราะห์ Heap Snapshot มาใช้ {#how-we-implement-heap-snapshot-analysis}

**การติดตามของเรา:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

การติดตามในสภาพแวดล้อมการผลิตของเรารวมถึงการสร้าง heap snapshot อัตโนมัติเมื่อเกินเกณฑ์หน่วยความจำ ซึ่งช่วยให้เราดีบักปัญหา OOM ก่อนที่จะทำให้แอปพลิเคชันล่ม

**รูปแบบการใช้งานสำคัญ:**

* **สร้าง snapshot อัตโนมัติ** เมื่อขนาด heap เกินเกณฑ์ 2GB
* **โปรไฟล์แบบสัญญาณ** สำหรับการวิเคราะห์ตามคำขอในสภาพแวดล้อมการผลิต
* **นโยบายการเก็บรักษา** สำหรับจัดการการเก็บ snapshot
* **การผสานกับงานล้างข้อมูลของเรา** สำหรับการบำรุงรักษาอัตโนมัติ

### เวิร์กโฟลว์การดีบักประสิทธิภาพ {#performance-debugging-workflow}

**ศึกษาการใช้งานจริงของเรา:**

* [การติดตามเซิร์ฟเวอร์](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - การติดตาม heap และการสร้าง snapshot
* [งานล้างข้อมูล](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - การเก็บรักษาและล้าง snapshot
* [การผสานกับ logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - การบันทึกประสิทธิภาพ

### การใช้งานที่แนะนำสำหรับแอปพลิเคชัน Node.js ของคุณ {#recommended-implementation-for-your-nodejs-application}

**สำหรับการวิเคราะห์ heap snapshot:**

1. **ติดตั้ง v8-profiler-next** สำหรับการสร้าง snapshot
2. **ใช้ cpupro** สำหรับวิเคราะห์ snapshot ที่สร้างขึ้น
3. **นำเกณฑ์การติดตามมาใช้** คล้ายกับ monitor-server.js ของเรา
4. **ตั้งค่าการล้างข้อมูลอัตโนมัติ** เพื่อจัดการการเก็บ snapshot
5. **สร้างตัวจัดการสัญญาณ** สำหรับโปรไฟล์ตามคำขอในสภาพแวดล้อมการผลิต

**สำหรับการโปรไฟล์ CPU:**

1. **สร้าง CPU profiles** ในช่วงเวลาที่โหลดสูง
2. **วิเคราะห์ด้วย cpupro** เพื่อระบุคอขวด
3. **เน้นเส้นทางร้อน** และโอกาสในการปรับแต่ง
4. **ติดตามก่อน/หลัง** การปรับปรุงประสิทธิภาพ

> \[!WARNING]
> การสร้าง heap snapshots และ CPU profiles อาจส่งผลกระทบต่อประสิทธิภาพ เราแนะนำให้ใช้การควบคุมความถี่และเปิดใช้งานโปรไฟล์เฉพาะเมื่อสืบสวนปัญหาเฉพาะหรือในช่วงเวลาบำรุงรักษา

### การผสานกับการติดตามในสภาพแวดล้อมการผลิตของเรา {#integration-with-our-production-monitoring}

เครื่องมือโปรไฟล์ของเราผสานรวมกับกลยุทธ์การติดตามที่กว้างขึ้นของเรา:

* **การทริกเกอร์อัตโนมัติ** ตามเกณฑ์หน่วยความจำ/CPU
* **การผสานการแจ้งเตือน** เมื่อพบปัญหาประสิทธิภาพ
* **การวิเคราะห์ย้อนหลัง** เพื่อติดตามแนวโน้มประสิทธิภาพตามเวลา
* **การเชื่อมโยงกับเมตริกของแอปพลิเคชัน** เพื่อการดีบักที่ครอบคลุม
วิธีการนี้ช่วยให้เราสามารถระบุและแก้ไขปัญหาการรั่วไหลของหน่วยความจำ ปรับเส้นทางโค้ดที่รันบ่อยให้เหมาะสม และรักษาประสิทธิภาพที่เสถียรในสภาพแวดล้อมการผลิต Node.js ของเรา


## ความปลอดภัยโครงสร้างพื้นฐานการผลิต Node.js {#nodejs-production-infrastructure-security}

เราดำเนินการรักษาความปลอดภัยอย่างครอบคลุมสำหรับโครงสร้างพื้นฐานการผลิต Node.js ของเราผ่านการทำงานอัตโนมัติด้วย Ansible แนวปฏิบัติเหล่านี้ใช้กับแอปพลิเคชัน Node.js ใดๆ:

### ความปลอดภัยระดับระบบสำหรับการผลิต Node.js {#system-level-security-for-nodejs-production}

**การใช้งาน Ansible ของเรา:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

มาตรการความปลอดภัยหลักของเราสำหรับสภาพแวดล้อมการผลิต Node.js:

* **ปิดการใช้งาน swap** เพื่อป้องกันไม่ให้ข้อมูลที่ละเอียดอ่อนถูกเขียนลงดิสก์
* **ปิดการใช้งาน core dumps** เพื่อป้องกันการดัมพ์หน่วยความจำที่มีข้อมูลละเอียดอ่อน
* **บล็อกการใช้งาน USB storage** เพื่อป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต
* **ปรับแต่งพารามิเตอร์เคอร์เนล** ทั้งด้านความปลอดภัยและประสิทธิภาพ

> \[!WARNING]
> เมื่อดำเนินการตามแนวปฏิบัติที่ดีที่สุดสำหรับการปรับใช้ Node.js ในการผลิต การปิดการใช้งาน swap อาจทำให้เกิดการฆ่าโปรเซสเนื่องจากหน่วยความจำไม่เพียงพอหากแอปพลิเคชันของคุณใช้ RAM เกินขนาดที่มี เราติดตามการใช้งานหน่วยความจำอย่างระมัดระวังและกำหนดขนาดเซิร์ฟเวอร์ให้เหมาะสม

### ความปลอดภัยของแอปพลิเคชันสำหรับแอป Node.js {#application-security-for-nodejs-applications}

**การลบข้อมูลในฟิลด์ล็อกของเรา:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

เราลบข้อมูลที่ละเอียดอ่อนออกจากล็อก เช่น รหัสผ่าน โทเค็น กุญแจ API และข้อมูลส่วนบุคคล เพื่อปกป้องความเป็นส่วนตัวของผู้ใช้ในขณะที่ยังคงรักษาความสามารถในการดีบักในสภาพแวดล้อมการผลิต Node.js ใดๆ

### การทำงานอัตโนมัติความปลอดภัยโครงสร้างพื้นฐาน {#infrastructure-security-automation}

**การตั้งค่า Ansible ครบถ้วนสำหรับการผลิต Node.js ของเรา:**

* [Security playbook](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSH keys management](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Certificate management](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM setup](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### เนื้อหาความปลอดภัยของเรา {#our-security-content}

เรียนรู้เพิ่มเติมเกี่ยวกับแนวทางความปลอดภัยของเรา:

* [บริษัทตรวจสอบความปลอดภัยที่ดีที่สุด](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [อีเมลเข้ารหัสปลอดภัยควอนตัม](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [ทำไมต้องความปลอดภัยอีเมลแบบโอเพนซอร์ส](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## สถาปัตยกรรมฐานข้อมูลสำหรับแอป Node.js {#database-architecture-for-nodejs-applications}

เราใช้แนวทางฐานข้อมูลแบบผสมผสานที่ปรับให้เหมาะสมสำหรับแอป Node.js ของเรา รูปแบบเหล่านี้สามารถปรับใช้กับแอป Node.js ใดๆ:

### การใช้งาน SQLite สำหรับการผลิต Node.js {#sqlite-implementation-for-nodejs-production}

**สิ่งที่เราใช้:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**การตั้งค่าของเรา:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

เราใช้ SQLite สำหรับข้อมูลเฉพาะผู้ใช้ในแอป Node.js ของเราเพราะมันให้:

* **การแยกข้อมูล** ต่อผู้ใช้/ผู้เช่า
* **ประสิทธิภาพที่ดีกว่า** สำหรับการสืบค้นผู้ใช้คนเดียว
* **การสำรองข้อมูลและการย้ายข้อมูลที่ง่ายขึ้น**
* **ความซับซ้อนลดลง** เมื่อเทียบกับฐานข้อมูลที่ใช้ร่วมกัน

รูปแบบนี้เหมาะสำหรับแอป SaaS ระบบหลายผู้เช่า หรือแอป Node.js ใดๆ ที่ต้องการการแยกข้อมูล

### การใช้งาน MongoDB สำหรับการผลิต Node.js {#mongodb-implementation-for-nodejs-production}

**สิ่งที่เราใช้:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**การตั้งค่าของเรา:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**การกำหนดค่าของเรา:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

เราใช้ MongoDB สำหรับข้อมูลแอปพลิเคชันในสภาพแวดล้อมการผลิต Node.js ของเราเนื่องจากมันให้:

* **โครงสร้างสคีมาที่ยืดหยุ่น** สำหรับโครงสร้างข้อมูลที่พัฒนาไปตามเวลา
* **ประสิทธิภาพที่ดีกว่า** สำหรับการสืบค้นที่ซับซ้อน
* **ความสามารถในการขยายแนวนอน**
* **ภาษาสืบค้นที่ทรงพลัง**

> \[!NOTE]
> แนวทางผสมผสานของเราได้รับการปรับให้เหมาะสมกับกรณีการใช้งานเฉพาะของเรา ศึกษารูปแบบการใช้งานฐานข้อมูลจริงของเราในโค้ดเบสเพื่อทำความเข้าใจว่าวิธีนี้เหมาะกับความต้องการแอปพลิเคชัน Node.js ของคุณหรือไม่


## การประมวลผลงานพื้นหลังใน Node.js Production {#nodejs-production-background-job-processing}

เราสร้างสถาปัตยกรรมงานพื้นหลังของเรารอบๆ Bree สำหรับการปรับใช้ Node.js production ที่เชื่อถือได้ ซึ่งใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ที่ต้องการการประมวลผลงานพื้นหลัง:

### การตั้งค่าเซิร์ฟเวอร์ Bree ของเราสำหรับ Production {#our-bree-server-setup-for-production}

**การใช้งานหลักของเรา:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**การปรับใช้ด้วย Ansible ของเรา:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### ตัวอย่างงานใน Production {#production-job-examples}

**การตรวจสอบสุขภาพ:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**การทำความสะอาดอัตโนมัติ:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**งานทั้งหมดของเรา:** [เรียกดูไดเรกทอรีงานทั้งหมดของเรา](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

รูปแบบเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ที่ต้องการ:

* งานที่กำหนดเวลา (การประมวลผลข้อมูล, รายงาน, การทำความสะอาด)
* การประมวลผลงานพื้นหลัง (ปรับขนาดภาพ, ส่งอีเมล, นำเข้าข้อมูล)
* การตรวจสอบสุขภาพและการบำรุงรักษา
* การใช้เธรดงานสำหรับงานที่ใช้ CPU หนัก

### รูปแบบการกำหนดเวลางานของเราสำหรับ Node.js Production {#our-job-scheduling-patterns-for-nodejs-production}

ศึกษารูปแบบการกำหนดเวลางานจริงของเราในไดเรกทอรีงานเพื่อเข้าใจ:

* วิธีที่เรานำการกำหนดเวลาแบบ cron มาใช้ใน Node.js production
* การจัดการข้อผิดพลาดและตรรกะการลองใหม่ของเรา
* วิธีที่เราใช้เธรดงานสำหรับงานที่ใช้ CPU หนัก


## การบำรุงรักษาอัตโนมัติสำหรับแอปพลิเคชัน Node.js Production {#automated-maintenance-for-production-nodejs-applications}

เราดำเนินการบำรุงรักษาเชิงรุกเพื่อป้องกันปัญหาทั่วไปใน Node.js production รูปแบบเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ใดๆ:

### การใช้งานการทำความสะอาดของเรา {#our-cleanup-implementation}

**แหล่งที่มา:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

การบำรุงรักษาอัตโนมัติของเราสำหรับแอปพลิเคชัน Node.js production มุ่งเป้าไปที่:

* **ไฟล์ชั่วคราว** ที่เก่ากว่า 24 ชั่วโมง
* **ไฟล์ล็อก** ที่เกินขีดจำกัดการเก็บรักษา
* **ไฟล์แคช** และข้อมูลชั่วคราว
* **ไฟล์ที่อัปโหลด** ที่ไม่จำเป็นอีกต่อไป
* **Heap snapshots** จากการดีบักประสิทธิภาพ

รูปแบบเหล่านี้ใช้ได้กับแอปพลิเคชัน Node.js ใดๆ ที่สร้างไฟล์ชั่วคราว, ล็อก หรือข้อมูลแคช

### การจัดการพื้นที่ดิสก์สำหรับ Node.js Production {#disk-space-management-for-nodejs-production}

**เกณฑ์การตรวจสอบของเรา:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **ขีดจำกัดคิว** สำหรับการประมวลผลงานพื้นหลัง
* **75% การใช้งานดิสก์** เป็นเกณฑ์เตือน
* **การทำความสะอาดอัตโนมัติ** เมื่อเกินเกณฑ์

### การบำรุงรักษาโครงสร้างพื้นฐานอัตโนมัติ {#infrastructure-maintenance-automation}

**การทำงานอัตโนมัติด้วย Ansible สำหรับ Node.js production ของเรา:**

* [การปรับใช้สภาพแวดล้อม](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [การจัดการคีย์การปรับใช้](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## คู่มือการใช้งานการปรับใช้ Node.js Production {#nodejs-production-deployment-implementation-guide}
### ศึกษาโค้ดจริงของเราสำหรับแนวทางปฏิบัติที่ดีที่สุดในการใช้งานจริง {#study-our-actual-code-for-production-best-practices}

**เริ่มต้นด้วยไฟล์สำคัญเหล่านี้สำหรับการตั้งค่าสภาพแวดล้อมการใช้งานจริงของ Node.js:**

1. **การกำหนดค่า:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **การตรวจสอบ:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **การจัดการข้อผิดพลาด:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **การบันทึก:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **สุขภาพของกระบวนการ:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### เรียนรู้จากบทความบล็อกของเรา {#learn-from-our-blog-posts}

**คู่มือการใช้งานทางเทคนิคของเราสำหรับ Node.js ในการใช้งานจริง:**

* [ระบบนิเวศของแพ็กเกจ NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [การสร้างระบบชำระเงิน](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [การใช้งานความเป็นส่วนตัวของอีเมล](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [ฟอร์มติดต่อด้วย JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [การรวมอีเมลกับ React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### ระบบอัตโนมัติของโครงสร้างพื้นฐานสำหรับ Node.js ในการใช้งานจริง {#infrastructure-automation-for-nodejs-production}

**เพลย์บุ๊ก Ansible ของเราเพื่อศึกษาในการปรับใช้ Node.js ในการใช้งานจริง:**

* [ไดเรกทอรีเพลย์บุ๊กทั้งหมด](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [การเสริมความปลอดภัย](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [การตั้งค่า Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### กรณีศึกษาของเรา {#our-case-studies}

**การใช้งานในองค์กรของเรา:**

* [กรณีศึกษาของ Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [กรณีศึกษาของ Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [การส่งต่ออีเมลศิษย์เก่า](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## สรุป: แนวทางปฏิบัติที่ดีที่สุดสำหรับการปรับใช้ Node.js ในการใช้งานจริง {#conclusion-nodejs-production-deployment-best-practices}

โครงสร้างพื้นฐานการใช้งานจริงของ Node.js ของเราชี้ให้เห็นว่าแอปพลิเคชัน Node.js สามารถบรรลุความน่าเชื่อถือระดับองค์กรได้ผ่าน:

* **การเลือกฮาร์ดแวร์ที่พิสูจน์แล้ว** (AMD Ryzen สำหรับการเพิ่มประสิทธิภาพคอร์เดี่ยว 573%)
* **การตรวจสอบ Node.js ในการใช้งานจริงที่ผ่านการทดสอบอย่างเข้มข้น** ด้วยเกณฑ์เฉพาะและการตอบสนองอัตโนมัติ
* **การจำแนกข้อผิดพลาดอย่างชาญฉลาด** เพื่อปรับปรุงการตอบสนองเหตุการณ์ในสภาพแวดล้อมการใช้งานจริง
* **การดีบักประสิทธิภาพขั้นสูง** ด้วย v8-profiler-next และ cpupro เพื่อป้องกัน OOM
* **การเสริมความปลอดภัยอย่างครอบคลุม** ผ่านระบบอัตโนมัติของ Ansible
* **สถาปัตยกรรมฐานข้อมูลแบบผสมผสาน** ที่ปรับแต่งสำหรับความต้องการของแอปพลิเคชัน
* **การบำรุงรักษาอัตโนมัติ** เพื่อป้องกันปัญหาทั่วไปของ Node.js ในการใช้งานจริง

**ข้อสรุปสำคัญ:** ศึกษาไฟล์การใช้งานจริงและบทความบล็อกของเราแทนที่จะปฏิบัติตามแนวทางทั่วไป โค้ดของเรานำเสนอรูปแบบจริงสำหรับการปรับใช้ Node.js ในการใช้งานจริงที่สามารถปรับใช้กับแอปพลิเคชัน Node.js ใด ๆ — เว็บแอป, API, ไมโครเซอร์วิส หรือบริการเบื้องหลัง


## รายการทรัพยากรครบถ้วนสำหรับ Node.js ในการใช้งานจริง {#complete-resource-list-for-nodejs-production}

### ไฟล์การใช้งานหลักของเรา {#our-core-implementation-files}

* [การกำหนดค่าหลัก](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [แพ็กเกจและการพึ่งพา](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [การตรวจสอบเซิร์ฟเวอร์](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [การจำแนกข้อผิดพลาด](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [ระบบบันทึก](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [การตรวจสอบสุขภาพ PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [การทำความสะอาดอัตโนมัติ](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### การดำเนินการเซิร์ฟเวอร์ของเรา {#our-server-implementations}

* [เซิร์ฟเวอร์เว็บ](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [เซิร์ฟเวอร์ API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [ตัวจัดตาราง Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [เซิร์ฟเวอร์ SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [เซิร์ฟเวอร์ IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [เซิร์ฟเวอร์ POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### การทำงานอัตโนมัติของโครงสร้างพื้นฐานของเรา {#our-infrastructure-automation}

* [Ansible playbooks ทั้งหมดของเรา](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [การเสริมความปลอดภัย](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [การตั้งค่า Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [การกำหนดค่าฐานข้อมูล](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### บทความบล็อกทางเทคนิคของเรา {#our-technical-blog-posts}

* [การวิเคราะห์ระบบนิเวศ NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [การดำเนินการระบบการชำระเงิน](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [คู่มือเทคนิคความเป็นส่วนตัวของอีเมล](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [ฟอร์มติดต่อ JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [การรวมอีเมล React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [คู่มือโซลูชันโฮสต์ด้วยตนเอง](https://forwardemail.net/blog/docs/self-hosted-solution)

### กรณีศึกษาธุรกิจองค์กรของเรา {#our-enterprise-case-studies}

* [การดำเนินการ Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [กรณีศึกษาของ Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [การปฏิบัติตามข้อกำหนดของรัฐบาลกลาง](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [ระบบอีเมลศิษย์เก่า](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
