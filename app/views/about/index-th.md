# เกี่ยวกับการส่งต่ออีเมล {#about-forward-email}

<img กำลังโหลด="ขี้เกียจ" src="/img/articles/about.webp" alt="" class="rounded-lg" />

# About Forward Email {#about-forward-email-1}

## สารบัญ {#table-of-contents}

* [ภาพรวม](#overview)
* [ผู้ก่อตั้งและพันธกิจ](#founder-and-mission)
* [ไทม์ไลน์](#timeline)
  * [2017 – การก่อตั้งและเปิดตัว](#2017---founding-and-launch)
  * [2018 – โครงสร้างพื้นฐานและการบูรณาการ](#2018---infrastructure-and-integration)
  * [2019 - ปฏิวัติประสิทธิภาพ](#2019---performance-revolution)
  * [2020 – เน้นความเป็นส่วนตัวและความปลอดภัย](#2020---privacy-and-security-focus)
  * [2021 - การปรับปรุงแพลตฟอร์ม](#2021---platform-modernization)
  * [2023 – การขยายโครงสร้างพื้นฐานและคุณสมบัติ](#2023---infrastructure-and-feature-expansion)
  * [2024 - การเพิ่มประสิทธิภาพบริการและคุณสมบัติขั้นสูง](#2024---service-optimization-and-advanced-features)
  * [2025 – นวัตกรรมต่อเนื่อง](#2025---continued-innovation)
* [หลักการพื้นฐาน](#core-principles)
* [สถานะปัจจุบัน](#current-status)

## Overview {#overview}

> \[!TIP]
> For technical details about our architecture, security implementations, and roadmap, see the [Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email คือบริการ [ฟรีและโอเพ่นซอร์ส](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [การส่งต่ออีเมล์](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") ที่มุ่งเน้น [สิทธิในการมีความเป็นส่วนตัว](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") ของผู้ใช้ สิ่งที่เริ่มต้นจากโซลูชันการส่งต่ออีเมลแบบง่ายๆ ในปี 2017 ได้พัฒนาเป็นแพลตฟอร์มอีเมลที่ครอบคลุม นำเสนอชื่อโดเมนที่กำหนดเองได้ไม่จำกัด ที่อยู่อีเมลและนามแฝงไม่จำกัด ที่อยู่อีเมลแบบใช้ครั้งเดียวทิ้งได้ไม่จำกัด การป้องกันสแปมและฟิชชิ่ง พื้นที่จัดเก็บกล่องจดหมายที่เข้ารหัส และฟีเจอร์ขั้นสูงอีกมากมาย

บริการนี้ได้รับการดูแลและเป็นเจ้าของโดยทีมนักออกแบบและนักพัฒนาผู้ก่อตั้งเดิม สร้างขึ้นด้วยซอฟต์แวร์โอเพนซอร์ส 100% โดยใช้ [จาวาสคริปต์](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") และ [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP")

## Founder and Mission {#founder-and-mission}

Forward Email was founded by **Nicholas Baugh** in 2017. According to the [เอกสารทางเทคนิคเกี่ยวกับการส่งต่ออีเมล](https://forwardemail.net/technical-whitepaper.pdf), Baugh was initially searching for a cost-effective and simple solution for enabling email on domain names for his side-projects. After researching available options, he began coding his own solution and purchased the domain `forwardemail.net` on October 2, 2017.

ภารกิจของ Forward Email ไม่ใช่แค่เพียงการให้บริการอีเมล แต่ยังมุ่งหวังที่จะเปลี่ยนแปลงแนวทางที่อุตสาหกรรมใช้ในการจัดการความเป็นส่วนตัวและความปลอดภัยของอีเมลอีกด้วย ค่านิยมหลักของบริษัท ได้แก่ ความโปร่งใส การควบคุมของผู้ใช้ และการปกป้องความเป็นส่วนตัวผ่านการดำเนินการทางเทคนิค มากกว่าแค่คำมั่นสัญญาในนโยบาย

## ไทม์ไลน์ {#timeline}

### 2017 - การก่อตั้งและการเปิดตัว {#2017---founding-and-launch}

**2 ตุลาคม 2017**: Nicholas Baugh ซื้อโดเมน `forwardemail.net` หลังจากค้นคว้าโซลูชันอีเมลที่คุ้มต้นทุนสำหรับโปรเจ็กต์เสริมของเขา

**5 พฤศจิกายน 2017**: Baugh สร้างไฟล์ JavaScript ขนาด 634 บรรทัดโดยใช้ [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") เพื่อส่งต่ออีเมลสำหรับชื่อโดเมนที่กำหนดเอง การใช้งานเบื้องต้นนี้เผยแพร่เป็นโอเพนซอร์สไปยัง [GitHub](https://github.com/forwardemail) และเปิดตัวบริการโดยใช้ GitHub Pages

**พฤศจิกายน 2017**: Forward Email เปิดตัวอย่างเป็นทางการหลังจากเปิดตัวครั้งแรก เวอร์ชันแรกใช้ DNS ล้วนๆ โดยไม่ต้องลงทะเบียนบัญชีหรือขั้นตอนการสมัครใดๆ มีเพียงไฟล์ README ที่เขียนด้วยภาษา Markdown พร้อมคำแนะนำ ผู้ใช้สามารถตั้งค่าการส่งต่ออีเมลได้โดยกำหนดค่าระเบียน MX ให้ชี้ไปที่ `mx1.forwardemail.net` และ `mx2.forwardemail.net` และเพิ่มระเบียน TXT ด้วย `forward-email=user@gmail.com`

ความเรียบง่ายและประสิทธิภาพของโซลูชันนี้ดึงดูดความสนใจจากนักพัฒนาที่มีชื่อเสียง รวมถึง [เดวิด ไฮเนไมเออร์ แฮนส์สัน](https://dhh.dk) (ผู้สร้าง Ruby on Rails) ซึ่งยังคงใช้ Forward Email บนโดเมน `dhh.dk` ของเขาจนถึงทุกวันนี้

### 2018 - โครงสร้างพื้นฐานและการบูรณาการ {#2018---infrastructure-and-integration}

**เมษายน 2561**: เมื่อ [คลาวด์แฟลร์](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") เปิดตัว [บริการ DNS ของผู้บริโภคที่เน้นความเป็นส่วนตัวเป็นอันดับแรก](https://blog.cloudflare.com/announcing-1111/) การส่งต่ออีเมลได้เปลี่ยนจากการใช้ [โอเพ่น DNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") เป็น [คลาวด์แฟลร์](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") สำหรับจัดการการค้นหา [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") ซึ่งแสดงให้เห็นถึงความมุ่งมั่นของบริษัทในการเลือกโครงสร้างพื้นฐานที่เน้นความเป็นส่วนตัว

**ตุลาคม 2018**: การส่งต่ออีเมลช่วยให้ผู้ใช้สามารถ "ส่งอีเมลในชื่อ" ด้วย [จีเมล](https://en.wikipedia.org/wiki/Gmail "Gmail") และ [แนวโน้ม](https://en.wikipedia.org/wiki/Outlook "Outlook") ซึ่งขยายความสามารถในการบูรณาการกับผู้ให้บริการอีเมลยอดนิยม

### 2019 - การปฏิวัติประสิทธิภาพ {#2019---performance-revolution}

**พฤษภาคม 2019**: อีเมลส่งต่อได้เปิดตัวเวอร์ชัน 2 ซึ่งเป็นการแก้ไขครั้งใหญ่จากเวอร์ชันเริ่มต้น การอัปเดตนี้มุ่งเน้นไปที่การปรับปรุง [ผลงาน](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") ผ่านการใช้ [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") ของ [ลำธาร](https://en.wikipedia.org/wiki/Streams "Streams") ซึ่งเป็นการวางรากฐานสำหรับความสามารถในการปรับขนาดของแพลตฟอร์ม

### 2020 - เน้นความเป็นส่วนตัวและความปลอดภัย {#2020---privacy-and-security-focus}

**กุมภาพันธ์ 2020**: Forward Email เปิดตัวแผน Enhanced Privacy Protection ซึ่งอนุญาตให้ผู้ใช้ปิดการตั้งค่ารายการ DNS สาธารณะด้วยนามแฝงการกำหนดค่าการส่งต่ออีเมล แผนนี้จะช่วยซ่อนข้อมูลนามแฝงอีเมลของผู้ใช้ไม่ให้สามารถค้นหาได้ทางอินเทอร์เน็ต นอกจากนี้ บริษัทยังได้เปิดตัวฟีเจอร์สำหรับเปิดใช้งานหรือปิดใช้งานนามแฝงเฉพาะ โดยยังคงให้นามแฝงเหล่านั้นปรากฏเป็นที่อยู่อีเมลที่ถูกต้อง และส่งคืน [รหัสสถานะ SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") ที่สำเร็จ โดยอีเมลจะถูกลบออกทันที (คล้ายกับการส่งเอาต์พุตไปยัง [/เดฟ/null](https://en.wikipedia.org/wiki/Null_device "Null device"))

**เมษายน 2020**: หลังจากประสบปัญหามากมายกับโซลูชันตรวจจับสแปมที่มีอยู่เดิมที่ไม่เป็นไปตามนโยบายความเป็นส่วนตัวของ Forward Email บริษัทจึงได้เปิดตัว Spam Scanner เวอร์ชันอัลฟ่ารุ่นแรก โซลูชัน [การกรองป้องกันสแปม](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") แบบโอเพนซอร์สที่ให้บริการฟรีนี้ใช้วิธีการ [ตัวกรองสแปม Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") ร่วมกับการป้องกัน [ต่อต้านการฟิชชิ่ง](https://en.wikipedia.org/wiki/Phishing "Phishing") และ [การโจมตีโฮโมกราฟ IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") นอกจากนี้ Forward Email ยังได้เปิดตัว [การตรวจสอบสิทธิ์แบบสองปัจจัย](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) โดยใช้ [รหัสผ่านครั้งเดียว](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) เพื่อเพิ่มความปลอดภัยให้กับบัญชีอีกด้วย

**พฤษภาคม 2020**: อีเมลส่งต่ออนุญาตให้ใช้ [การส่งต่อพอร์ต](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") แบบกำหนดเองเป็นวิธีแก้ปัญหาชั่วคราวสำหรับผู้ใช้ในการหลีกเลี่ยงการบล็อกพอร์ตโดย [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") ของตนเอง นอกจากนี้ บริษัทยังได้เปิดตัว [RESTful API สำหรับการส่งต่ออีเมลฟรี](email-api) พร้อมเอกสารประกอบที่ครบถ้วน ตัวอย่างคำขอและการตอบกลับแบบเรียลไทม์ รวมถึงการสนับสนุนเว็บฮุก

**สิงหาคม 2020**: เพิ่มการรองรับอีเมลส่งต่อสำหรับระบบการตรวจสอบสิทธิ์อีเมล [โซ่ที่ได้รับการตรวจสอบแล้ว](arc) ("ARC") ซึ่งช่วยเสริมความปลอดภัยและการส่งมอบอีเมลให้แข็งแกร่งยิ่งขึ้น

**23 พฤศจิกายน 2020**: Forward Email เปิดตัวต่อสาธารณะจากโปรแกรมเบต้า ซึ่งถือเป็นก้าวสำคัญในการพัฒนาแพลตฟอร์ม

### 2021 - การปรับปรุงแพลตฟอร์ม {#2021---platform-modernization}

**กุมภาพันธ์ 2021**: Forward Email ได้ปรับโครงสร้างโค้ดใหม่โดยลบการอ้างอิง [งูหลาม](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (ภาษาโปรแกรม)") ทั้งหมด ทำให้สแต็กของพวกเขากลายเป็น [จาวาสคริปต์](https://en.wikipedia.org/wiki/JavaScript "JavaScript") และ [Node.js](https://en.wikipedia.org/wiki/Node.js) ได้ 100% การตัดสินใจด้านสถาปัตยกรรมนี้สอดคล้องกับความมุ่งมั่นของบริษัทในการรักษาสแต็กเทคโนโลยีโอเพนซอร์สให้สอดคล้องกัน

**27 กันยายน 2021**: ส่งต่ออีเมล [เพิ่มการสนับสนุน](email-forwarding-regex-pattern-filter) สำหรับนามแฝงการส่งต่ออีเมลให้ตรงกับ [นิพจน์ทั่วไป](https://en.wikipedia.org/wiki/Regular_expression "Regular expression") โดยมอบความสามารถในการกำหนดเส้นทางอีเมลที่ซับซ้อนยิ่งขึ้นแก่ผู้ใช้

### 2023 - การขยายโครงสร้างพื้นฐานและคุณสมบัติ {#2023---infrastructure-and-feature-expansion}

**มกราคม 2023**: Forward Email เปิดตัวเว็บไซต์ที่ได้รับการออกแบบใหม่และปรับให้ความเร็วของหน้าเว็บเหมาะสม ซึ่งช่วยปรับปรุงประสบการณ์และประสิทธิภาพของผู้ใช้

**กุมภาพันธ์ 2023**: บริษัทได้เพิ่มการสนับสนุนสำหรับ [บันทึกข้อผิดพลาด](/faq#do-you-store-error-logs) และนำรูปแบบสีเว็บไซต์ [โหมดมืด](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) มาใช้ เพื่อตอบสนองต่อความต้องการของผู้ใช้และความต้องการด้านการเข้าถึง

**มีนาคม 2023**: Forward Email เปิดตัว [ส้มแมนดาริน](https://github.com/forwardemail/tangerine#readme) และผสานรวมเข้ากับโครงสร้างพื้นฐาน ทำให้สามารถใช้ [DNS ผ่าน HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ในชั้นแอปพลิเคชันได้ นอกจากนี้ บริษัทยังได้เพิ่มการรองรับ [MTA-STS](/faq#do-you-support-mta-sts) และเปลี่ยนจาก [hCaptcha](/) เป็น [ประตูหมุน Cloudflare](https://developers.cloudflare.com/turnstile)

**เมษายน 2566**: ได้มีการนำ Forward Email มาใช้และดำเนินการโครงสร้างพื้นฐานใหม่ทั้งหมดโดยอัตโนมัติ บริการทั้งหมดเริ่มทำงานบน DNS แบบโหลดบาลานซ์และอิงตามความใกล้ชิดทั่วโลก พร้อมการตรวจสอบสถานะและเฟลโอเวอร์โดยใช้ [คลาวด์แฟลร์](https://cloudflare.com) แทนที่วิธีการ DNS แบบ Round-Robin เดิม บริษัทได้เปลี่ยนไปใช้ **เซิร์ฟเวอร์แบบ Bare Metal** กับผู้ให้บริการหลายราย รวมถึง [วัลเตอร์](https://www.vultr.com/?ref=429848) และ [มหาสมุทรดิจิทัล](https://m.do.co/c/a7cecd27e071) ซึ่งทั้งสองรายเป็นผู้ให้บริการที่สอดคล้องกับมาตรฐาน SOC 2 ประเภท 1 ฐานข้อมูล MongoDB และ Redis ถูกย้ายไปยังการกำหนดค่าแบบคลัสเตอร์ที่มีโหนดหลักและโหนดสำรองสำหรับความพร้อมใช้งานสูง การเข้ารหัส SSL แบบ end-to-end การเข้ารหัสขณะพัก และการกู้คืนข้อมูล ณ จุดเวลา (PITR)

**พฤษภาคม 2023**: Forward Email เปิดตัวฟีเจอร์ **SMTP ขาออก** สำหรับคำขอ [การส่งอีเมล์ด้วย SMTP](/faq#do-you-support-sending-email-with-smtp) และ [การส่งอีเมล์ด้วย API](/faq#do-you-support-sending-email-with-api) ฟีเจอร์นี้ประกอบด้วยระบบป้องกันในตัวเพื่อให้มั่นใจถึงความสามารถในการส่งสูง ระบบคิวและการลองส่งใหม่ที่ทันสมัยและแข็งแกร่ง และ [รองรับการบันทึกข้อผิดพลาดแบบเรียลไทม์](/faq#do-you-store-error-logs)

**พฤศจิกายน 2023**: Forward Email เปิดตัวฟีเจอร์ [**ระบบจัดเก็บกล่องจดหมายแบบเข้ารหัส**](/blog/docs/best-quantum-safe-encrypted-email-service) สำหรับ [การรองรับ IMAP](/faq#do-you-support-receiving-email-with-imap) ซึ่งถือเป็นความก้าวหน้าครั้งสำคัญในด้านความเป็นส่วนตัวและความปลอดภัยของอีเมล

**ธันวาคม 2023**: บริษัท [เพิ่มการสนับสนุน](/faq#do-you-support-pop3) สำหรับการตรวจสอบ [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [รหัสผ่านและ WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [ถึงเวลาที่จะส่งข้อความ](/faq#i) และ [OpenPGP สำหรับการจัดเก็บ IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)

### 2024 - การเพิ่มประสิทธิภาพบริการและคุณลักษณะขั้นสูง {#2024---service-optimization-and-advanced-features}

**กุมภาพันธ์ 2024**: ส่งต่ออีเมล [เพิ่มการรองรับปฏิทิน (CalDAV)](/faq#do-you-support-calendars-caldav) ขยายความสามารถของแพลตฟอร์มให้เกินกว่าอีเมลเพื่อรวมถึงการซิงโครไนซ์ปฏิทิน

**เดือนมีนาคมถึงกรกฎาคม 2024**: Forward Email เปิดตัวการปรับปรุงและเพิ่มประสิทธิภาพครั้งสำคัญให้กับบริการ IMAP, POP3 และ CalDAV โดยมีเป้าหมายเพื่อให้บริการของพวกเขารวดเร็วพอๆ กับทางเลือกอื่นๆ หรืออาจจะเร็วกว่าด้วยซ้ำ

**กรกฎาคม 2024**: บริษัท [เพิ่มการรองรับ iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) แก้ไขปัญหาที่ Apple Mail บน iOS ขาดการรองรับคำสั่ง IMAP `IDLE` ทำให้อุปกรณ์ Apple iOS สามารถส่งการแจ้งเตือนแบบเรียลไทม์ได้ นอกจากนี้ Forward Email ยังได้เพิ่มการตรวจสอบเวลาเข้ากล่องจดหมาย ("TTI") สำหรับบริการของตนเองและ Yahoo/AOL และเริ่มอนุญาตให้ผู้ใช้เข้ารหัสระเบียน DNS TXT ทั้งหมดได้แม้ในแพ็กเกจฟรี ตามคำขอใน [การสนทนาเกี่ยวกับแนวทางความเป็นส่วนตัว](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) และ [ปัญหาของ GitHub](https://github.com/forwardemail/forwardemail.net/issues/254) บริษัทได้เพิ่มความสามารถในการใช้นามแฝงเพื่อปฏิเสธ `250` อย่างเงียบๆ ปฏิเสธแบบ soft `421` หรือปฏิเสธแบบ hard `550` เมื่อปิดใช้งาน

**สิงหาคม 2024**: อีเมลส่งต่อได้เพิ่มการรองรับการส่งออกกล่องจดหมายเป็นรูปแบบ [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) และ [เอ็มบ็อกซ์](https://en.wikipedia.org/wiki/Mbox) (เพิ่มเติมจากรูปแบบการส่งออก [SQLite](https://en.wikipedia.org/wiki/SQLite) ที่มีอยู่) [เพิ่มการรองรับลายเซ็น Webhook แล้ว](https://forwardemail.net/faq#do-you-support-bounce-webhooks) และบริษัทได้เริ่มอนุญาตให้ผู้ใช้ส่งจดหมายข่าว ประกาศ และการตลาดทางอีเมลผ่านบริการ SMTP ขาออก นอกจากนี้ยังมีการนำโควต้าพื้นที่เก็บข้อมูลสำหรับ IMAP/POP3/CalDAV ทั้งแบบโดเมนและแบบเฉพาะนามแฝงมาใช้ด้วย

### 2025 - นวัตกรรมต่อเนื่อง {#2025---continued-innovation}

**กันยายน 2567 ถึงมกราคม 2568**: ส่งต่ออีเมล [เพิ่มคุณสมบัติการตอบกลับช่วงวันหยุดที่ได้รับการร้องขอเป็นอย่างมากและการเข้ารหัส OpenPGP/WKD สำหรับการส่งต่ออีเมล](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) โดยสร้างขึ้นจากความสามารถในการจัดเก็บกล่องจดหมายเข้ารหัสที่ใช้งานแล้ว

**21 มกราคม 2568**: "แจ็ค" เพื่อนรักของผู้ก่อตั้ง สุนัขคู่ใจผู้ซื่อสัตย์ของเขา ได้เสียชีวิตลงอย่างสงบด้วยวัยเกือบ 11 ปี แจ็ค [จะถูกจดจำตลอดไป](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) เนื่องในโอกาสมิตรภาพอันเหนียวแน่นที่สนับสนุนการสร้าง Forward Email [เอกสารทางเทคนิคเกี่ยวกับการส่งต่ออีเมล](https://forwardemail.net/technical-whitepaper.pdf) นี้ขออุทิศให้กับแจ็ค เพื่อแสดงความขอบคุณต่อบทบาทของเขาในการพัฒนาบริการนี้

**กุมภาพันธ์ 2568**: อีเมลส่งต่อถูกเปลี่ยนเป็น [ดาต้าแพ็คเก็ต](https://www.datapacket.com) เป็นผู้ให้บริการศูนย์ข้อมูลหลักรายใหม่ โดยใช้ฮาร์ดแวร์แบบเปล่าที่เน้นประสิทธิภาพและปรับแต่งได้ เพื่อปรับปรุงความน่าเชื่อถือและความเร็วในการให้บริการให้ดียิ่งขึ้น

**มิถุนายน 2568**: การส่งต่ออีเมลเปิดตัวการสนับสนุนสำหรับ [โปรโตคอล CardDAV](/faq#do-you-support-contacts-carddav) โดยขยายความสามารถของแพลตฟอร์มเพื่อรวมการซิงโครไนซ์รายชื่อติดต่อควบคู่ไปกับบริการอีเมลและปฏิทินที่มีอยู่

## หลักการสำคัญ {#core-principles}

ตั้งแต่เริ่มก่อตั้ง Forward Email ได้รักษาความมุ่งมั่นอย่างแน่วแน่ต่อหลักการความเป็นส่วนตัวและความปลอดภัย:

**ปรัชญาโอเพ่นซอร์ส 100%**: ไม่เหมือนกับคู่แข่งที่เปิดซอร์สเฉพาะส่วน frontend เท่านั้นโดยปิดส่วน backend ไว้ Forward Email ได้เปิดให้ฐานโค้ดทั้งหมดของตน ทั้ง frontend และ backend ตรวจสอบได้โดยสาธารณะที่ [GitHub](https://github.com/forwardemail)

**การออกแบบที่เน้นความเป็นส่วนตัวเป็นอันดับแรก**: ตั้งแต่วันแรก Forward Email ได้นำแนวทางการประมวลผลในหน่วยความจำเฉพาะมาใช้ ซึ่งหลีกเลี่ยงการเขียนอีเมลลงในดิสก์ ซึ่งทำให้แตกต่างจากบริการอีเมลทั่วไปที่เก็บข้อความในฐานข้อมูลหรือระบบไฟล์

**นวัตกรรมอย่างต่อเนื่อง**: บริการได้พัฒนาจากโซลูชันการส่งต่ออีเมลแบบง่ายๆ ไปเป็นแพลตฟอร์มอีเมลที่ครอบคลุมพร้อมฟีเจอร์เช่น เมลบ็อกซ์ที่เข้ารหัส การเข้ารหัสที่ทนทานต่อควอนตัม และการรองรับโปรโตคอลมาตรฐานรวมถึง SMTP, IMAP, POP3 และ CalDAV

**ความโปร่งใส**: การทำให้โค้ดทั้งหมดเป็นโอเพนซอร์สและพร้อมสำหรับการตรวจสอบ ช่วยให้มั่นใจว่าผู้ใช้สามารถยืนยันคำกล่าวอ้างเรื่องความเป็นส่วนตัวได้ แทนที่จะเชื่อถือเพียงคำกล่าวอ้างทางการตลาดเท่านั้น

**การควบคุมของผู้ใช้**: มอบอำนาจให้ผู้ใช้ด้วยตัวเลือกต่างๆ รวมถึงความสามารถในการโฮสต์แพลตฟอร์มทั้งหมดด้วยตัวเองหากต้องการ

## สถานะปัจจุบัน {#current-status}

ตั้งแต่ปี 2025 เป็นต้นมา Forward Email ได้ให้บริการโดเมนมากกว่า 500,000 โดเมนทั่วโลก รวมถึงองค์กรที่มีชื่อเสียงและผู้นำในอุตสาหกรรม เช่น:

* **บริษัทเทคโนโลยี**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **องค์กรสื่อ**: Fox News Radio, Disney Ad Sales
* **สถาบันการศึกษา**: The University of Cambridge, The University of Maryland, The University of Washington, Tufts University, Swarthmore College
* **หน่วยงานของรัฐ**: Government of South Australia, Government of Dominican Republic
* **องค์กรอื่นๆ**: RCD Hotels, Fly<span>.</span>io
* **นักพัฒนาที่มีชื่อเสียง**: Isaac Z. Schlueter (ผู้สร้าง npm), David Heinemeier Hansson (ผู้สร้าง Ruby on Rails)

แพลตฟอร์มยังคงพัฒนาอย่างต่อเนื่องด้วยการเปิดตัวคุณลักษณะใหม่และการปรับปรุงโครงสร้างพื้นฐานอย่างสม่ำเสมอ ทำให้ยังคงรักษาตำแหน่งบริการอีเมลที่เป็นโอเพ่นซอร์ส 100% เข้ารหัส เน้นความเป็นส่วนตัว โปร่งใส และต้านทานควอนตัมเพียงรายเดียวในปัจจุบัน

<img กำลังโหลด="ขี้เกียจ" src="/img/articles/about-footer.webp" alt="" class="rounded-lg" />