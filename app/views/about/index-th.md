# เกี่ยวกับ Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="เรื่องราวทีมและบริษัท Forward Email" class="rounded-lg" />

# เกี่ยวกับ Forward Email {#about-forward-email-1}


## สารบัญ {#table-of-contents}

* [ภาพรวม](#overview)
* [ผู้ก่อตั้งและพันธกิจ](#founder-and-mission)
* [ไทม์ไลน์](#timeline)
  * [2017 - การก่อตั้งและเปิดตัว](#2017---founding-and-launch)
  * [2018 - โครงสร้างพื้นฐานและการผสานรวม](#2018---infrastructure-and-integration)
  * [2019 - การปฏิวัติประสิทธิภาพ](#2019---performance-revolution)
  * [2020 - การเน้นความเป็นส่วนตัวและความปลอดภัย](#2020---privacy-and-security-focus)
  * [2021 - การปรับปรุงแพลตฟอร์ม](#2021---platform-modernization)
  * [2023 - การขยายโครงสร้างพื้นฐานและฟีเจอร์](#2023---infrastructure-and-feature-expansion)
  * [2024 - การเพิ่มประสิทธิภาพบริการและฟีเจอร์ขั้นสูง](#2024---service-optimization-and-advanced-features)
  * [2025 - การปรับปรุงความเป็นส่วนตัวและการสนับสนุนโปรโตคอล {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - การปฏิบัติตาม RFC และการกรองขั้นสูง {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [หลักการสำคัญ](#core-principles)
* [สถานะปัจจุบัน](#current-status)


## ภาพรวม {#overview}

> \[!TIP]
> สำหรับรายละเอียดทางเทคนิคเกี่ยวกับสถาปัตยกรรม การใช้งานด้านความปลอดภัย และแผนงาน โปรดดูที่ [Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf)

Forward Email คือบริการ [ฟรีและโอเพนซอร์ส](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") สำหรับ [การส่งต่ออีเมล](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") ที่เน้นสิทธิ์ของผู้ใช้ในเรื่อง [ความเป็นส่วนตัว](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") สิ่งที่เริ่มต้นจากการเป็นโซลูชันส่งต่ออีเมลง่ายๆ ในปี 2017 ได้พัฒนาเป็นแพลตฟอร์มอีเมลครบวงจรที่ให้บริการชื่อโดเมนที่กำหนดเองได้ไม่จำกัด ที่อยู่อีเมลและนามแฝงไม่จำกัด ที่อยู่อีเมลใช้ครั้งเดียวไม่จำกัด การป้องกันสแปมและฟิชชิ่ง การจัดเก็บกล่องจดหมายแบบเข้ารหัส และฟีเจอร์ขั้นสูงอีกมากมาย

บริการนี้ได้รับการดูแลและเป็นเจ้าของโดยทีมผู้ก่อตั้งเดิมที่เป็นนักออกแบบและนักพัฒนา สร้างขึ้นด้วยซอฟต์แวร์โอเพนซอร์ส 100% โดยใช้ [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") และ [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## ผู้ก่อตั้งและพันธกิจ {#founder-and-mission}

Forward Email ก่อตั้งโดย **Nicholas Baugh** ในปี 2017 ตามที่ระบุใน [Forward Email Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf) Baugh เริ่มแรกกำลังมองหาโซลูชันที่คุ้มค่าและเรียบง่ายสำหรับเปิดใช้งานอีเมลบนชื่อโดเมนสำหรับโปรเจกต์ข้างเคียงของเขา หลังจากศึกษาตัวเลือกที่มี เขาจึงเริ่มเขียนโค้ดโซลูชันของตัวเองและซื้อโดเมน `forwardemail.net` เมื่อวันที่ 2 ตุลาคม 2017

พันธกิจของ Forward Email ไม่ได้จำกัดแค่การให้บริการอีเมลเท่านั้น แต่ยังมุ่งเปลี่ยนแปลงวิธีที่อุตสาหกรรมจัดการกับความเป็นส่วนตัวและความปลอดภัยของอีเมล ค่านิยมหลักของบริษัทประกอบด้วยความโปร่งใส การควบคุมโดยผู้ใช้ และการปกป้องความเป็นส่วนตัวผ่านการใช้งานทางเทคนิคแทนที่จะเป็นเพียงคำสัญญาทางนโยบาย


## ไทม์ไลน์ {#timeline}

### 2017 - การก่อตั้งและเปิดตัว {#2017---founding-and-launch}

**2 ตุลาคม 2017**: Nicholas Baugh ซื้อโดเมน `forwardemail.net` หลังจากศึกษาวิธีแก้ปัญหาอีเมลที่คุ้มค่าสำหรับโปรเจกต์ข้างเคียงของเขา

**5 พฤศจิกายน 2017**: Baugh สร้างไฟล์ JavaScript ขนาด 634 บรรทัดโดยใช้ [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") เพื่อส่งต่ออีเมลสำหรับชื่อโดเมนที่กำหนดเองใดๆ การใช้งานเริ่มต้นนี้ถูกเผยแพร่เป็นโอเพนซอร์สบน [GitHub](https://github.com/forwardemail) และบริการถูกเปิดตัวโดยใช้ GitHub Pages
**พฤศจิกายน 2017**: Forward Email เปิดตัวอย่างเป็นทางการหลังจากการเปิดตัวครั้งแรก เวอร์ชันแรกเป็นแบบ DNS ล้วน ๆ โดยไม่มีการลงทะเบียนบัญชีหรือกระบวนการสมัครใช้งาน—เพียงแค่ไฟล์ README ที่เขียนด้วย Markdown พร้อมคำแนะนำ ผู้ใช้สามารถตั้งค่าการส่งต่ออีเมลได้โดยการกำหนดค่า MX records ให้ชี้ไปที่ `mx1.forwardemail.net` และ `mx2.forwardemail.net` และเพิ่ม TXT record ด้วยค่า `forward-email=user@gmail.com`

ความเรียบง่ายและประสิทธิภาพของโซลูชันนี้ดึงดูดความสนใจจากนักพัฒนาชื่อดังหลายคน รวมถึง [David Heinemeier Hansson](https://dhh.dk) (ผู้สร้าง Ruby on Rails) ซึ่งยังคงใช้ Forward Email บนโดเมน `dhh.dk` ของเขาจนถึงปัจจุบัน

### 2018 - โครงสร้างพื้นฐานและการรวมระบบ {#2018---infrastructure-and-integration}

**เมษายน 2018**: เมื่อ [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") เปิดตัว [บริการ DNS สำหรับผู้บริโภคที่เน้นความเป็นส่วนตัวเป็นหลัก](https://blog.cloudflare.com/announcing-1111/) Forward Email ได้เปลี่ยนจากการใช้ [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") มาใช้ [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") สำหรับการค้นหา [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") แสดงให้เห็นถึงความมุ่งมั่นของบริษัทในการเลือกใช้โครงสร้างพื้นฐานที่เน้นความเป็นส่วนตัว

**ตุลาคม 2018**: Forward Email อนุญาตให้ผู้ใช้ "ส่งอีเมลในนาม" กับ [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") และ [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook") ขยายความสามารถในการรวมระบบกับผู้ให้บริการอีเมลยอดนิยม

### 2019 - การปฏิวัติด้านประสิทธิภาพ {#2019---performance-revolution}

**พฤษภาคม 2019**: Forward Email เปิดตัวเวอร์ชัน 2 ซึ่งเป็นการเขียนใหม่ครั้งใหญ่จากเวอร์ชันแรก การอัปเดตนี้เน้นการปรับปรุง [ประสิทธิภาพ](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") ผ่านการใช้ [streams](https://en.wikipedia.org/wiki/Streams "Streams") ของ [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") วางรากฐานสำหรับความสามารถในการปรับขนาดของแพลตฟอร์ม

### 2020 - เน้นความเป็นส่วนตัวและความปลอดภัย {#2020---privacy-and-security-focus}

**กุมภาพันธ์ 2020**: Forward Email เปิดตัวแผน Enhanced Privacy Protection ซึ่งอนุญาตให้ผู้ใช้ปิดการตั้งค่าการบันทึก DNS สาธารณะด้วยนามแฝงการส่งต่ออีเมลของพวกเขา ผ่านแผนนี้ ข้อมูลนามแฝงอีเมลของผู้ใช้จะถูกซ่อนจากการค้นหาสาธารณะบนอินเทอร์เน็ต บริษัทฯ ยังเปิดตัวฟีเจอร์ที่อนุญาตให้เปิดหรือปิดใช้งานนามแฝงเฉพาะในขณะที่ยังคงให้แสดงเป็นที่อยู่อีเมลที่ถูกต้องและส่งคืน [รหัสสถานะ SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") ที่ประสบความสำเร็จ โดยอีเมลจะถูกทิ้งทันที (คล้ายกับการส่งผลลัพธ์ไปที่ [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device"))

**เมษายน 2020**: หลังจากเผชิญกับอุปสรรคมากมายกับโซลูชันตรวจจับสแปมที่มีอยู่ซึ่งไม่เคารพนโยบายความเป็นส่วนตัวของ Forward Email บริษัทฯ ได้เปิดตัวเวอร์ชันอัลฟ่าของ Spam Scanner ซึ่งเป็นโซลูชัน [การกรองสแปม](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") แบบฟรีและโอเพนซอร์สโดยใช้วิธี [Naive Bayes spam filter](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") ร่วมกับการป้องกัน [anti-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") และ [IDN homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") Forward Email ยังเปิดตัว [การยืนยันตัวตนแบบสองปัจจัย](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) โดยใช้ [รหัสผ่านใช้ครั้งเดียว](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) เพื่อเพิ่มความปลอดภัยของบัญชี

**พฤษภาคม 2020**: Forward Email อนุญาตให้ใช้ [port forwarding](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") แบบกำหนดเองเป็นวิธีแก้ไขสำหรับผู้ใช้ที่ต้องการหลีกเลี่ยงการบล็อกพอร์ตโดย [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") บริษัทฯ ยังเปิดตัว [Free Email Forwarding RESTful API](email-api) พร้อมเอกสารครบถ้วนและตัวอย่างคำขอและการตอบสนองแบบเรียลไทม์ รวมถึงรองรับเว็บฮุกส์ด้วย
**สิงหาคม 2020**: Forward Email เพิ่มการรองรับระบบการตรวจสอบอีเมล [Authenticated Received Chain](arc) ("ARC") ซึ่งช่วยเสริมความปลอดภัยและความน่าเชื่อถือในการส่งอีเมลให้แข็งแกร่งยิ่งขึ้น

**23 พฤศจิกายน 2020**: Forward Email เปิดตัวอย่างเป็นทางการหลังจากสิ้นสุดโปรแกรมเบต้า ถือเป็นก้าวสำคัญในการพัฒนาของแพลตฟอร์ม

### 2021 - การปรับปรุงแพลตฟอร์ม {#2021---platform-modernization}

**กุมภาพันธ์ 2021**: Forward Email ปรับโครงสร้างโค้ดใหม่โดยลบการพึ่งพา [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)") ทั้งหมด ทำให้สแตกเทคโนโลยีของพวกเขากลายเป็น 100% [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") และ [Node.js](https://en.wikipedia.org/wiki/Node.js) การตัดสินใจทางสถาปัตยกรรมนี้สอดคล้องกับความมุ่งมั่นของบริษัทในการรักษาสแตกเทคโนโลยีแบบโอเพ่นซอร์สที่สอดคล้องกัน

**27 กันยายน 2021**: Forward Email [เพิ่มการรองรับ](email-forwarding-regex-pattern-filter) สำหรับอีเมลฟอร์เวิร์ดอัลเลียสที่ตรงกับ [regular expressions](https://en.wikipedia.org/wiki/Regular_expression "Regular expression") เพื่อมอบความสามารถในการกำหนดเส้นทางอีเมลที่ซับซ้อนยิ่งขึ้นแก่ผู้ใช้

### 2023 - การขยายโครงสร้างพื้นฐานและฟีเจอร์ {#2023---infrastructure-and-feature-expansion}

**มกราคม 2023**: Forward Email เปิดตัวเว็บไซต์ที่ออกแบบใหม่และเพิ่มประสิทธิภาพความเร็วหน้าเว็บ เพื่อปรับปรุงประสบการณ์และประสิทธิภาพของผู้ใช้

**กุมภาพันธ์ 2023**: บริษัทเพิ่มการรองรับ [error logs](/faq#do-you-store-error-logs) และนำเสนอธีมสีเว็บไซต์แบบ [dark mode](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) เพื่อตอบสนองความต้องการและความสะดวกในการเข้าถึงของผู้ใช้

**มีนาคม 2023**: Forward Email เปิดตัว [Tangerine](https://github.com/forwardemail/tangerine#readme) และผสานรวมในโครงสร้างพื้นฐานทั้งหมด ช่วยให้สามารถใช้ [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ในระดับแอปพลิเคชัน บริษัทยังเพิ่มการรองรับ [MTA-STS](/faq#do-you-support-mta-sts) และเปลี่ยนจาก [hCaptcha](/) มาใช้ [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile)

**เมษายน 2023**: Forward Email ดำเนินการและทำให้อัตโนมัติของโครงสร้างพื้นฐานใหม่ทั้งหมด บริการทั้งหมดเริ่มทำงานบน DNS ที่มีการโหลดบาลานซ์ทั่วโลกและอิงตามความใกล้เคียง พร้อมตรวจสอบสุขภาพและระบบ failover โดยใช้ [Cloudflare](https://cloudflare.com) แทนวิธี round-robin DNS เดิม บริษัทเปลี่ยนมาใช้ **เซิร์ฟเวอร์แบบ bare metal** จากผู้ให้บริการหลายราย รวมถึง [Vultr](https://www.vultr.com/?ref=429848) และ [Digital Ocean](https://m.do.co/c/a7cecd27e071) ซึ่งเป็นผู้ให้บริการที่ผ่านการรับรอง SOC 2 Type 1 ฐานข้อมูล MongoDB และ Redis ถูกย้ายไปยังการตั้งค่าคลัสเตอร์ที่มีโหนดหลักและโหนดสำรองเพื่อความพร้อมใช้งานสูง พร้อมการเข้ารหัส SSL แบบ end-to-end, การเข้ารหัสข้อมูลขณะพัก และการกู้คืนข้อมูลแบบ point-in-time recovery (PITR)

**พฤษภาคม 2023**: Forward Email เปิดตัวฟีเจอร์ **SMTP ขาออก** สำหรับ [การส่งอีเมลด้วย SMTP](/faq#do-you-support-sending-email-with-smtp) และ [การส่งอีเมลด้วย API](/faq#do-you-support-sending-email-with-api) ฟีเจอร์นี้มาพร้อมกับระบบป้องกันในตัวเพื่อให้มั่นใจในความน่าเชื่อถือสูง ระบบคิวและการลองใหม่ที่ทันสมัยและแข็งแกร่ง และ [รองรับการบันทึกข้อผิดพลาดแบบเรียลไทม์](/faq#do-you-store-error-logs)

**พฤศจิกายน 2023**: Forward Email เปิดตัวฟีเจอร์ [**การจัดเก็บกล่องจดหมายแบบเข้ารหัส**](/blog/docs/best-quantum-safe-encrypted-email-service) สำหรับ [การรองรับ IMAP](/faq#do-you-support-receiving-email-with-imap) ซึ่งเป็นก้าวสำคัญในการพัฒนาความเป็นส่วนตัวและความปลอดภัยของอีเมล

**ธันวาคม 2023**: บริษัท [เพิ่มการรองรับ](/faq#do-you-support-pop3) สำหรับ [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeys และ WebAuthn](/faq#do-you-support-passkeys-and-webauthn), การตรวจสอบ [time to inbox](/faq#i) และ [OpenPGP สำหรับการจัดเก็บ IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)

### 2024 - การปรับแต่งบริการและฟีเจอร์ขั้นสูง {#2024---service-optimization-and-advanced-features}

**กุมภาพันธ์ 2024**: Forward Email [เพิ่มการรองรับปฏิทิน (CalDAV)](/faq#do-you-support-calendars-caldav) ขยายความสามารถของแพลตฟอร์มให้ครอบคลุมมากกว่าแค่อีเมล รวมถึงการซิงโครไนซ์ปฏิทินด้วย
**มีนาคม ถึง กรกฎาคม 2024**: Forward Email ได้ปล่อยการปรับแต่งและปรับปรุงครั้งใหญ่สำหรับบริการ IMAP, POP3 และ CalDAV โดยมีเป้าหมายเพื่อทำให้บริการของตนเร็วเท่าหรือเร็วกว่าทางเลือกอื่นๆ

**กรกฎาคม 2024**: บริษัท [เพิ่มการรองรับ iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) เพื่อแก้ไขปัญหาการขาดการรองรับคำสั่ง IMAP `IDLE` ใน Apple Mail บน iOS ทำให้สามารถแจ้งเตือนแบบเรียลไทม์สำหรับอุปกรณ์ Apple iOS ได้ Forward Email ยังเพิ่มการตรวจสอบเวลาถึงกล่องจดหมาย ("TTI") สำหรับบริการของตนเองและ Yahoo/AOL และเริ่มอนุญาตให้ผู้ใช้เข้ารหัสระเบียน DNS TXT ทั้งหมดแม้ในแผนฟรี ตามคำขอใน [การอภิปราย Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) และ [ปัญหาใน GitHub](https://github.com/forwardemail/forwardemail.net/issues/254) บริษัทได้เพิ่มความสามารถให้กับนามแฝงในการปฏิเสธแบบเงียบ `250` ปฏิเสธแบบอ่อน `421` หรือปฏิเสธแบบรุนแรง `550` เมื่อถูกปิดใช้งาน

**สิงหาคม 2024**: Forward Email เพิ่มการรองรับการส่งออกกล่องจดหมายในรูปแบบ [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) และ [Mbox](https://en.wikipedia.org/wiki/Mbox) (นอกเหนือจากรูปแบบการส่งออก [SQLite](https://en.wikipedia.org/wiki/SQLite) ที่มีอยู่แล้ว) [เพิ่มการรองรับลายเซ็น Webhook](https://forwardemail.net/faq#do-you-support-bounce-webhooks) และบริษัทเริ่มอนุญาตให้ผู้ใช้ส่งจดหมายข่าว ประกาศ และการตลาดผ่านอีเมลผ่านบริการ SMTP ขาออกของตน นอกจากนี้ยังมีการกำหนดโควต้าพื้นที่เก็บข้อมูลสำหรับ IMAP/POP3/CalDAV ทั้งในระดับโดเมนและนามแฝง

### 2025 - การปรับปรุงความเป็นส่วนตัวและการรองรับโปรโตคอล {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**กันยายน 2024 ถึง มกราคม 2025**: Forward Email [เพิ่มฟีเจอร์ตอบกลับอัตโนมัติช่วงวันหยุดที่ได้รับความนิยมสูงและการเข้ารหัส OpenPGP/WKD สำหรับการส่งต่ออีเมล](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) โดยต่อยอดจากความสามารถในการจัดเก็บกล่องจดหมายที่เข้ารหัสที่มีอยู่แล้ว

**21 มกราคม 2025**: เพื่อนสนิทของผู้ก่อตั้ง "แจ็ค" สุนัขผู้ซื่อสัตย์ของเขา ได้จากไปอย่างสงบในวัยเกือบ 11 ปี แจ็ค [จะได้รับการจดจำเสมอ](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) สำหรับความเป็นเพื่อนที่ไม่เปลี่ยนแปลงซึ่งสนับสนุนการสร้าง Forward Email [เอกสารเทคนิคของ Forward Email](https://forwardemail.net/technical-whitepaper.pdf) ได้อุทิศให้กับแจ็ค เพื่อยอมรับบทบาทของเขาในการพัฒนาบริการนี้

**กุมภาพันธ์ 2025**: Forward Email เปลี่ยนมาใช้ [DataPacket](https://www.datapacket.com) เป็นผู้ให้บริการศูนย์ข้อมูลหลักใหม่ โดยนำฮาร์ดแวร์แบบเปลือยโลหะที่เน้นประสิทธิภาพมาใช้เพื่อเพิ่มความน่าเชื่อถือและความเร็วของบริการ

**มีนาคม 2025**: เวอร์ชัน 1.0 ของ Forward Email ได้เปิดตัวอย่างเป็นทางการ

**เมษายน 2025**: เวอร์ชันแรกของ [เอกสารเทคนิค Forward Email](https://forwardemail.net/technical-whitepaper.pdf) ได้เผยแพร่ และบริษัทเริ่มรับชำระเงินด้วยสกุลเงินดิจิทัล

**พฤษภาคม 2025**: บริการเปิดตัวเอกสาร API ใหม่โดยใช้ [Scalar](https://github.com/scalar/scalar)

**มิถุนายน 2025**: Forward Email เปิดตัวการรองรับโปรโตคอล [CardDAV](/faq#do-you-support-contacts-carddav) ขยายความสามารถของแพลตฟอร์มให้รวมการซิงโครไนซ์รายชื่อติดต่อควบคู่ไปกับบริการอีเมลและปฏิทินที่มีอยู่

**สิงหาคม 2025**: แพลตฟอร์มเพิ่มการรองรับ [CalDAV VTODO/งาน](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)) ทำให้สามารถจัดการงานควบคู่ไปกับเหตุการณ์ในปฏิทินได้

**พฤศจิกายน 2025**: ความปลอดภัยของแพลตฟอร์มได้รับการปรับปรุงด้วยการย้ายจาก PBKDF2 ไปยัง [Argon2id](https://en.wikipedia.org/wiki/Argon2) สำหรับการแฮชรหัสผ่าน และโครงสร้างพื้นฐานถูกย้ายจาก Redis ไปยัง [Valkey](https://github.com/valkey-io/valkey)

**ธันวาคม 2025**: เวอร์ชัน 2.0 ได้เปิดตัว โดยเพิ่มการรองรับ [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) สำหรับการบังคับใช้การเข้ารหัส TLS ในการส่งอีเมล และอัปเกรดเป็น [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) เวอร์ชัน 6
### 2026 - การปฏิบัติตาม RFC และการกรองขั้นสูง {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**มกราคม 2026**: Forward Email ได้เผยแพร่ [เอกสารการปฏิบัติตามโปรโตคอล RFC อย่างครบถ้วน](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) และเพิ่มการรองรับ [การเข้ารหัส S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) รวมถึงการกรองอีเมลแบบ [Sieve อย่างครบถ้วน (RFC 5228)](/faq#do-you-support-sieve-email-filtering) พร้อมการรองรับโปรโตคอล [ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering) นอกจากนี้ REST API ยังขยายไปถึง 39 endpoints

**กุมภาพันธ์ 2026**: เว็บเมลไคลเอนต์แบบโอเพนซอร์สอย่างเป็นทางการเปิดตัวที่ [mail.forwardemail.net](https://mail.forwardemail.net) ([ซอร์สโค้ดบน GitHub](https://github.com/forwardemail/mail.forwardemail.net)) แพลตฟอร์มยังเพิ่มการรองรับ [CalDAV Scheduling Extensions (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) และ [Domain Connect](https://domainconnect.org) สำหรับการตั้งค่า DNS ด้วยคลิกเดียว การแจ้งเตือนแบบพุชเรียลไทม์สำหรับ IMAP, CalDAV และ CardDAV ถูกเปิดตัวโดยใช้ WebSockets

**มีนาคม 2026**: เพิ่มการรองรับการจัดเก็บข้อมูลแบบ S3-compatible ที่กำหนดเองต่อโดเมน พร้อมเครื่องมือบรรทัดคำสั่งสำหรับการจัดการ เริ่มพัฒนาแอปพลิเคชันเดสก์ท็อปและมือถือข้ามแพลตฟอร์มสำหรับ macOS, Windows, Linux, iOS และ Android โดยใช้ฐานโค้ดเว็บเมลโอเพนซอร์สเดียวกัน สร้างด้วย [Tauri](https://tauri.app)


## หลักการสำคัญ {#core-principles}

ตั้งแต่เริ่มต้น Forward Email ได้ยึดมั่นในหลักการความเป็นส่วนตัวและความปลอดภัยอย่างเคร่งครัด:

**ปรัชญาโอเพนซอร์ส 100%**: แตกต่างจากคู่แข่งที่เปิดซอร์สเฉพาะส่วนหน้าแต่ปิดส่วนหลัง Forward Email เปิดเผยโค้ดทั้งหมดทั้งส่วนหน้าและส่วนหลังให้สาธารณะตรวจสอบได้บน [GitHub](https://github.com/forwardemail)

**การออกแบบเน้นความเป็นส่วนตัวเป็นหลัก**: ตั้งแต่วันแรก Forward Email ใช้วิธีการประมวลผลในหน่วยความจำที่ไม่เขียนอีเมลลงดิสก์ แตกต่างจากบริการอีเมลทั่วไปที่เก็บข้อความในฐานข้อมูลหรือระบบไฟล์

**นวัตกรรมอย่างต่อเนื่อง**: บริการพัฒนาจากการส่งต่ออีเมลอย่างง่ายไปสู่แพลตฟอร์มอีเมลครบวงจรที่มีฟีเจอร์เช่น กล่องจดหมายเข้ารหัส, การเข้ารหัสต้านทานควอนตัม และรองรับโปรโตคอลมาตรฐานอย่าง SMTP, IMAP, POP3 และ CalDAV

**ความโปร่งใส**: เปิดเผยโค้ดทั้งหมดเป็นโอเพนซอร์สเพื่อให้ผู้ใช้สามารถตรวจสอบข้อเรียกร้องด้านความเป็นส่วนตัวได้ แทนที่จะเชื่อเพียงคำโฆษณา

**การควบคุมโดยผู้ใช้**: ให้ผู้ใช้มีทางเลือก รวมถึงความสามารถในการโฮสต์แพลตฟอร์มทั้งหมดด้วยตนเองหากต้องการ


## สถานะปัจจุบัน {#current-status}

ณ เดือนมีนาคม 2026 Forward Email ให้บริการโดเมนมากกว่า 1.6 ล้านโดเมนทั่วโลก รวมถึงองค์กรและผู้นำในอุตสาหกรรมที่โดดเด่น เช่น:

* **บริษัทเทคโนโลยี**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **องค์กรสื่อ**: Fox News Radio, Disney Ad Sales
* **สถาบันการศึกษา**: มหาวิทยาลัยเคมบริดจ์, มหาวิทยาลัยแมริแลนด์, มหาวิทยาลัยวอชิงตัน, มหาวิทยาลัยทัฟต์ส, วิทยาลัยสวาร์ทมอร์
* **หน่วยงานรัฐบาล**: รัฐบาลเซาท์ออสเตรเลีย, รัฐบาลโดมินิกัน
* **องค์กรอื่นๆ**: RCD Hotels, Fly<span>.</span>io
* **นักพัฒนาที่มีชื่อเสียง**: Isaac Z. Schlueter (ผู้สร้าง npm), David Heinemeier Hansson (ผู้สร้าง Ruby on Rails)

แพลตฟอร์มยังคงพัฒนาอย่างต่อเนื่องด้วยการปล่อยฟีเจอร์และปรับปรุงโครงสร้างพื้นฐานอย่างสม่ำเสมอ รักษาตำแหน่งเป็นบริการอีเมลที่โอเพนซอร์ส 100%, เข้ารหัส, เน้นความเป็นส่วนตัว, โปร่งใส และต้านทานควอนตัมเพียงแห่งเดียวที่มีให้บริการในปัจจุบัน

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
