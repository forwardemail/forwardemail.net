# เกี่ยวกับการส่งต่ออีเมล {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# เกี่ยวกับการส่งต่ออีเมล {#about-forward-email-1}

## สารบัญ {#table-of-contents}

* [ภาพรวม](#overview)
* [ผู้ก่อตั้งและพันธกิจ](#founder-and-mission)
* [ไทม์ไลน์](#timeline)
  * [2017 - ก่อตั้งและเปิดตัว](#2017---founding-and-launch)
  * [2018 - โครงสร้างพื้นฐานและการบูรณาการ](#2018---infrastructure-and-integration)
  * [2019 - การปฏิวัติประสิทธิภาพ](#2019---performance-revolution)
  * [2020 - เน้นความเป็นส่วนตัวและความปลอดภัย](#2020---privacy-and-security-focus)
  * [2021 - การปรับปรุงแพลตฟอร์ม](#2021---platform-modernization)
  * [2023 - การขยายโครงสร้างพื้นฐานและคุณสมบัติ](#2023---infrastructure-and-feature-expansion)
  * [2024 - การเพิ่มประสิทธิภาพการบริการและคุณลักษณะขั้นสูง](#2024---service-optimization-and-advanced-features)
  * [2025 - การปรับปรุงความเป็นส่วนตัวและการสนับสนุนโปรโตคอล](#2025---privacy-enhancements-and-protocol-support)
  * [2026 - การปฏิบัติตาม RFC และการกรองขั้นสูง](#2026---rfc-compliance-and-advanced-filtering)
* [หลักการสำคัญ](#core-principles)
* [สถานะปัจจุบัน](#current-status)

## ภาพรวม {#overview}

> \[!TIP]
> สำหรับรายละเอียดทางเทคนิคเกี่ยวกับสถาปัตยกรรม การใช้งานด้านความปลอดภัย และแผนงานของเรา โปรดดู [เอกสารทางเทคนิค](https://forwardemail.net/technical-whitepaper.pdf)

Forward Email เป็นบริการ [ฟรีและโอเพนซอร์ส](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [การส่งต่ออีเมล](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") ที่มุ่งเน้นไปที่ [สิทธิในการมีความเป็นส่วนตัว](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") ของผู้ใช้ สิ่งที่เริ่มต้นจากโซลูชันการส่งต่ออีเมลแบบง่ายๆ ในปี 2017 ได้พัฒนาเป็นแพลตฟอร์มอีเมลที่ครอบคลุม นำเสนอชื่อโดเมนที่กำหนดเองได้ไม่จำกัด ที่อยู่อีเมลและนามแฝงไม่จำกัด ที่อยู่อีเมลแบบใช้ครั้งเดียวไม่จำกัด การป้องกันสแปมและฟิชชิ่ง พื้นที่จัดเก็บกล่องจดหมายที่เข้ารหัส และฟีเจอร์ขั้นสูงอีกมากมาย

บริการนี้ได้รับการดูแลและเป็นเจ้าของโดยทีมนักออกแบบและนักพัฒนาผู้ก่อตั้ง สร้างขึ้นด้วยซอฟต์แวร์โอเพนซอร์ส 100% โดยใช้ [จาวาสคริปต์](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") และ [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP")

## ผู้ก่อตั้งและพันธกิจ {#founder-and-mission}

Forward Email ก่อตั้งโดย **Nicholas Baugh** ในปี 2017 ตามข้อมูลใน [เอกสารทางเทคนิคเกี่ยวกับการส่งต่ออีเมล](https://forwardemail.net/technical-whitepaper.pdf) Baugh กำลังมองหาโซลูชันที่ประหยัดและใช้งานง่ายสำหรับการเปิดใช้งานอีเมลบนชื่อโดเมนสำหรับโปรเจกต์เสริมของเขา หลังจากศึกษาตัวเลือกต่างๆ ที่มีอยู่ เขาจึงเริ่มเขียนโค้ดโซลูชันของตัวเองและซื้อโดเมน `forwardemail.net` ในวันที่ 2 ตุลาคม 2017

พันธกิจของ Forward Email ไม่ได้จำกัดอยู่แค่การให้บริการอีเมลเท่านั้น แต่ยังมุ่งหวังที่จะเปลี่ยนแปลงแนวทางปฏิบัติด้านความเป็นส่วนตัวและความปลอดภัยของอีเมลในอุตสาหกรรม ค่านิยมหลักของบริษัทประกอบด้วยความโปร่งใส การควบคุมของผู้ใช้ และการปกป้องความเป็นส่วนตัวผ่านการใช้งานทางเทคนิค มากกว่าแค่คำมั่นสัญญาเชิงนโยบาย

## ไทม์ไลน์ {#timeline}

### 2017 - การก่อตั้งและการเปิดตัว {#2017---founding-and-launch}

**2 ตุลาคม 2017**: Nicholas Baugh ซื้อโดเมน `forwardemail.net` หลังจากค้นคว้าโซลูชันอีเมลที่คุ้มต้นทุนสำหรับโปรเจ็กต์เสริมของเขา

**5 พฤศจิกายน 2017**: Baugh สร้างไฟล์ JavaScript ขนาด 634 บรรทัดโดยใช้ [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") เพื่อส่งต่ออีเมลสำหรับชื่อโดเมนที่กำหนดเอง การใช้งานเบื้องต้นนี้เผยแพร่เป็นโอเพนซอร์สให้กับ [GitHub](https://github.com/forwardemail) และเปิดตัวบริการโดยใช้ GitHub Pages

**พฤศจิกายน 2017**: อีเมลส่งต่อเปิดตัวอย่างเป็นทางการหลังจากเปิดตัวครั้งแรก เวอร์ชันแรกใช้ DNS ล้วนๆ โดยไม่ต้องลงทะเบียนบัญชีหรือขั้นตอนการสมัครใดๆ มีเพียงไฟล์ README ที่เขียนด้วย Markdown พร้อมคำแนะนำ ผู้ใช้สามารถตั้งค่าการส่งต่ออีเมลได้โดยกำหนดค่าระเบียน MX ให้ชี้ไปที่ `mx1.forwardemail.net` และ `mx2.forwardemail.net` และเพิ่มระเบียน TXT ด้วย `forward-email=user@gmail.com`

ความเรียบง่ายและประสิทธิภาพของโซลูชันนี้ดึงดูดความสนใจจากนักพัฒนาที่มีชื่อเสียง รวมถึง [เดวิด ไฮเนไมเออร์ ฮันส์สัน](https://dhh.dk) (ผู้สร้าง Ruby on Rails) ซึ่งยังคงใช้ Forward Email บนโดเมน `dhh.dk` ของเขาจนถึงทุกวันนี้

### 2018 - โครงสร้างพื้นฐานและการบูรณาการ {#2018---infrastructure-and-integration}

**เมษายน 2561**: เมื่อ [คลาวด์แฟลร์](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") เปิดตัว [บริการ DNS ของผู้บริโภคที่ให้ความสำคัญกับความเป็นส่วนตัวเป็นอันดับแรก](https://blog.cloudflare.com/announcing-1111/) การส่งต่ออีเมลได้เปลี่ยนจากการใช้ [โอเพ่นดีเอ็นเอส](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") เป็น [คลาวด์แฟลร์](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") เพื่อจัดการการค้นหา [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") ซึ่งแสดงให้เห็นถึงความมุ่งมั่นของบริษัทในการเลือกโครงสร้างพื้นฐานที่เน้นความเป็นส่วนตัว

**ตุลาคม 2018**: การส่งต่ออีเมลช่วยให้ผู้ใช้สามารถ "ส่งอีเมลในชื่อ" ด้วย [จีเมล](https://en.wikipedia.org/wiki/Gmail "Gmail") และ [แนวโน้ม](https://en.wikipedia.org/wiki/Outlook "Outlook") ซึ่งขยายความสามารถในการบูรณาการกับผู้ให้บริการอีเมลยอดนิยม

### 2019 - การปฏิวัติประสิทธิภาพ {#2019---performance-revolution}

**พฤษภาคม 2019**: อีเมลส่งต่อได้เปิดตัวเวอร์ชัน 2 ซึ่งเป็นการแก้ไขครั้งใหญ่จากเวอร์ชันเริ่มต้น การอัปเดตนี้มุ่งเน้นไปที่การปรับปรุง [ผลงาน](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") ผ่านการใช้ [ลำธาร](https://en.wikipedia.org/wiki/Streams "Streams") ของ [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") ซึ่งเป็นการสร้างรากฐานสำหรับความสามารถในการปรับขนาดของแพลตฟอร์ม

### 2020 - มุ่งเน้นเรื่องความเป็นส่วนตัวและความปลอดภัย {#2020---privacy-and-security-focus}

**กุมภาพันธ์ 2020**: Forward Email เปิดตัวแผน Enhanced Privacy Protection ซึ่งอนุญาตให้ผู้ใช้ปิดการตั้งค่ารายการบันทึก DNS สาธารณะด้วยนามแฝงการกำหนดค่าการส่งต่ออีเมล แผนนี้จะช่วยซ่อนข้อมูลนามแฝงอีเมลของผู้ใช้ไม่ให้สามารถค้นหาได้ทางอินเทอร์เน็ต นอกจากนี้ บริษัทยังได้เปิดตัวฟีเจอร์สำหรับเปิดใช้งานหรือปิดใช้งานนามแฝงเฉพาะ โดยยังคงให้นามแฝงเหล่านั้นปรากฏเป็นที่อยู่อีเมลที่ถูกต้อง และส่งคืน [รหัสสถานะ SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") ที่สำเร็จ โดยอีเมลจะถูกลบออกทันที (คล้ายกับการส่งเอาต์พุตไปยัง [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device"))

**เมษายน 2020**: หลังจากประสบปัญหามากมายกับโซลูชันตรวจจับสแปมที่มีอยู่เดิมที่ไม่เป็นไปตามนโยบายความเป็นส่วนตัวของ Forward Email บริษัทจึงได้เปิดตัว Spam Scanner เวอร์ชันอัลฟ่ารุ่นแรก โซลูชัน [การกรองสแปม](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") แบบโอเพนซอร์สที่ให้บริการฟรีนี้ใช้วิธีการ [ตัวกรองสแปม Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") ร่วมกับการป้องกัน [แอนตี้ฟิชชิ่ง](https://en.wikipedia.org/wiki/Phishing "Phishing") และ [การโจมตีโฮโมกราฟ IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") นอกจากนี้ Forward Email ยังได้เปิดตัว [การตรวจสอบสิทธิ์แบบสองปัจจัย](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) โดยใช้ [รหัสผ่านครั้งเดียว](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) เพื่อเพิ่มความปลอดภัยให้กับบัญชีอีกด้วย

**พฤษภาคม 2020**: อีเมลส่งต่ออนุญาตให้ใช้ [การส่งต่อพอร์ต](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") แบบกำหนดเองเป็นวิธีแก้ปัญหาชั่วคราวสำหรับผู้ใช้ในการหลีกเลี่ยงการบล็อกพอร์ตโดย [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") นอกจากนี้ บริษัทยังได้เปิดตัว [RESTful API สำหรับการส่งต่ออีเมลฟรี](email-api) พร้อมเอกสารประกอบฉบับสมบูรณ์ ตัวอย่างคำขอและการตอบกลับแบบเรียลไทม์ และการรองรับเว็บฮุก

**สิงหาคม 2020**: เพิ่มการรองรับระบบการตรวจสอบสิทธิ์อีเมล [โซ่ที่ได้รับการตรวจสอบแล้ว](arc) ("ARC") เพื่อเสริมความปลอดภัยและการส่งมอบอีเมลให้แข็งแกร่งยิ่งขึ้น

**23 พฤศจิกายน 2020**: Forward Email เปิดตัวต่อสาธารณะจากโปรแกรมเบต้า ซึ่งถือเป็นก้าวสำคัญในการพัฒนาแพลตฟอร์ม

### 2021 - การปรับปรุงแพลตฟอร์ม {#2021---platform-modernization}

**กุมภาพันธ์ 2021**: Forward Email ได้ปรับโครงสร้างโค้ดใหม่โดยลบการอ้างอิง [งูหลาม](https://en.wikipedia.org/wiki/Python_\(programming_language\) "ภาษาโปรแกรม Python") ทั้งหมด ทำให้สแต็กของพวกเขากลายเป็น [จาวาสคริปต์](https://en.wikipedia.org/wiki/JavaScript "JavaScript") และ [Node.js](https://en.wikipedia.org/wiki/Node.js) ได้ 100% การตัดสินใจด้านสถาปัตยกรรมนี้สอดคล้องกับความมุ่งมั่นของบริษัทในการรักษาสแต็กเทคโนโลยีโอเพนซอร์สให้สอดคล้องกัน

**27 กันยายน 2021**: ส่งต่ออีเมล [เพิ่มการสนับสนุน](email-forwarding-regex-pattern-filter) สำหรับนามแฝงการส่งต่ออีเมลให้ตรงกับ [นิพจน์ทั่วไป](https://en.wikipedia.org/wiki/Regular_expression "Regular expression") โดยมอบความสามารถในการกำหนดเส้นทางอีเมลที่ซับซ้อนยิ่งขึ้นแก่ผู้ใช้

### 2023 - การขยายโครงสร้างพื้นฐานและคุณลักษณะ {#2023---infrastructure-and-feature-expansion}

**มกราคม 2023**: Forward Email เปิดตัวเว็บไซต์ที่ได้รับการออกแบบใหม่และปรับให้ความเร็วหน้าเว็บเหมาะสม ซึ่งช่วยปรับปรุงประสบการณ์และประสิทธิภาพของผู้ใช้

**กุมภาพันธ์ 2023**: บริษัทได้เพิ่มการสนับสนุนสำหรับ [บันทึกข้อผิดพลาด](/faq#do-you-store-error-logs) และนำรูปแบบสีเว็บไซต์ [โหมดมืด](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) มาใช้ เพื่อตอบสนองต่อความต้องการของผู้ใช้และความต้องการด้านการเข้าถึง

**มีนาคม 2023**: Forward Email เปิดตัว [ส้มแมนดาริน](https://github.com/forwardemail/tangerine#readme) และผสานรวมเข้ากับโครงสร้างพื้นฐาน ทำให้สามารถใช้ [DNS ผ่าน HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ในเลเยอร์แอปพลิเคชันได้ นอกจากนี้ บริษัทยังได้เพิ่มการรองรับ [MTA-STS](/faq#do-you-support-mta-sts) และเปลี่ยนจาก [hCaptcha](/) เป็น [คลาวด์แฟลร์ เทิร์นสไทล์](https://developers.cloudflare.com/turnstile)

**เมษายน 2566**: ได้มีการนำ Forward Email มาใช้และดำเนินการโครงสร้างพื้นฐานใหม่ทั้งหมดโดยอัตโนมัติ บริการทั้งหมดเริ่มทำงานบน DNS แบบโหลดบาลานซ์และอิงตามความใกล้ชิดทั่วโลก พร้อมการตรวจสอบสถานะและเฟลโอเวอร์โดยใช้ [คลาวด์แฟลร์](https://cloudflare.com) แทนที่วิธีการ DNS แบบ Round-Robin เดิม บริษัทได้เปลี่ยนไปใช้ **เซิร์ฟเวอร์แบบ Bare Metal** กับผู้ให้บริการหลายราย รวมถึง [วัลเตอร์](https://www.vultr.com/?ref=429848) และ [มหาสมุทรดิจิทัล](https://m.do.co/c/a7cecd27e071) ซึ่งทั้งสองรายเป็นผู้ให้บริการที่สอดคล้องกับมาตรฐาน SOC 2 Type 1 ฐานข้อมูล MongoDB และ Redis ถูกย้ายไปยังการกำหนดค่าแบบคลัสเตอร์ที่มีโหนดหลักและโหนดสำรองสำหรับความพร้อมใช้งานสูง การเข้ารหัส SSL แบบ end-to-end การเข้ารหัสขณะพัก และการกู้คืน ณ จุดเวลา (PITR)

**พฤษภาคม 2023**: Forward Email เปิดตัวฟีเจอร์ **SMTP ขาออก** สำหรับคำขอ [การส่งอีเมลด้วย SMTP](/faq#do-you-support-sending-email-with-smtp) และ [การส่งอีเมลด้วย API](/faq#do-you-support-sending-email-with-api) ฟีเจอร์นี้ประกอบด้วยระบบป้องกันในตัวเพื่อให้มั่นใจถึงความสามารถในการส่งสูง ระบบคิวและการลองส่งใหม่ที่ทันสมัยและแข็งแกร่ง และ [รองรับการบันทึกข้อผิดพลาดแบบเรียลไทม์](/faq#do-you-store-error-logs)

**พฤศจิกายน 2023**: Forward Email เปิดตัวฟีเจอร์ [**ที่เก็บกล่องจดหมายแบบเข้ารหัส**](/blog/docs/best-quantum-safe-encrypted-email-service) สำหรับ [การรองรับ IMAP](/faq#do-you-support-receiving-email-with-imap) ซึ่งแสดงถึงความก้าวหน้าครั้งสำคัญในด้านความเป็นส่วนตัวและความปลอดภัยของอีเมล

**ธันวาคม 2023**: บริษัท [เพิ่มการสนับสนุน](/faq#do-you-support-pop3) สำหรับการตรวจสอบ [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [รหัสผ่านและ WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [ถึงเวลาส่งจดหมาย](/faq#i) และ [OpenPGP สำหรับที่เก็บข้อมูล IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)

### 2024 - การเพิ่มประสิทธิภาพบริการและคุณลักษณะขั้นสูง {#2024---service-optimization-and-advanced-features}

**กุมภาพันธ์ 2024**: ส่งต่ออีเมล [เพิ่มการรองรับปฏิทิน (CalDAV)](/faq#do-you-support-calendars-caldav) ขยายความสามารถของแพลตฟอร์มให้กว้างไกลกว่าอีเมลเพื่อรวมถึงการซิงโครไนซ์ปฏิทิน

**มีนาคมถึงกรกฎาคม 2567**: Forward Email เปิดตัวการปรับปรุงและเพิ่มประสิทธิภาพครั้งสำคัญให้กับบริการ IMAP, POP3 และ CalDAV โดยมีเป้าหมายเพื่อให้บริการของตนรวดเร็วเท่าหรือเร็วกว่าทางเลือกอื่นๆ

**กรกฎาคม 2024**: บริษัท [เพิ่มการรองรับ iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) จะแก้ไขปัญหา Apple Mail บน iOS ที่ขาดการรองรับคำสั่ง `IDLE` แบบ IMAP ทำให้อุปกรณ์ Apple iOS สามารถส่งการแจ้งเตือนแบบเรียลไทม์ได้ นอกจากนี้ Forward Email ยังได้เพิ่มการตรวจสอบเวลาเข้ากล่องจดหมาย ("TTI") สำหรับบริการของตนเองและ Yahoo/AOL และเริ่มอนุญาตให้ผู้ใช้เข้ารหัสระเบียน DNS TXT ทั้งหมดได้แม้ในแพ็กเกจฟรี ตามคำขอใน [การสนทนาเกี่ยวกับแนวทางความเป็นส่วนตัว](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) และ [ปัญหาของ GitHub](https://github.com/forwardemail/forwardemail.net/issues/254) บริษัทได้เพิ่มความสามารถของนามแฝงในการปฏิเสธ `250` แบบเงียบๆ ปฏิเสธ `421` แบบซอฟต์ หรือปฏิเสธ `550` แบบฮาร์ด เมื่อปิดใช้งาน

**สิงหาคม 2024**: อีเมลส่งต่อได้เพิ่มการรองรับการส่งออกกล่องจดหมายเป็นรูปแบบ [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) และ [เอ็มบ็อกซ์](https://en.wikipedia.org/wiki/Mbox) (นอกเหนือจากรูปแบบการส่งออก [SQLite](https://en.wikipedia.org/wiki/SQLite) ที่มีอยู่) [เพิ่มการรองรับลายเซ็นเว็บฮุกแล้ว](https://forwardemail.net/faq#do-you-support-bounce-webhooks) และบริษัทได้เริ่มอนุญาตให้ผู้ใช้ส่งจดหมายข่าว ประกาศ และการตลาดทางอีเมลผ่านบริการ SMTP ขาออก นอกจากนี้ยังมีการนำโควต้าพื้นที่เก็บข้อมูลสำหรับ IMAP/POP3/CalDAV ทั้งแบบโดเมนและแบบเฉพาะนามแฝงมาใช้ด้วย

### 2025 - การปรับปรุงความเป็นส่วนตัวและการสนับสนุนโปรโตคอล {#2025---privacy-enhancements-and-protocol-support}

**กันยายน 2567 ถึงมกราคม 2568**: ส่งต่ออีเมล [เพิ่มฟีเจอร์ตอบกลับวันหยุดที่ได้รับการร้องขออย่างมากและการเข้ารหัส OpenPGP/WKD สำหรับการส่งต่ออีเมล](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) โดยสร้างขึ้นจากความสามารถในการจัดเก็บกล่องจดหมายเข้ารหัสที่ใช้งานแล้ว

**21 มกราคม 2568**: "แจ็ค" เพื่อนรักของผู้ก่อตั้ง สุนัขคู่ใจผู้ซื่อสัตย์ของเขา ได้เสียชีวิตลงอย่างสงบด้วยวัยเกือบ 11 ปี แจ็ค [จะถูกจดจำตลอดไป](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) มอบแด่มิตรภาพอันเหนียวแน่นที่สนับสนุนการสร้าง Forward Email [เอกสารทางเทคนิคเกี่ยวกับการส่งต่ออีเมล](https://forwardemail.net/technical-whitepaper.pdf) นี้ขออุทิศแด่แจ็ค เพื่อแสดงความขอบคุณต่อบทบาทของเขาในการพัฒนาบริการนี้

**กุมภาพันธ์ 2568**: Forward Email ได้เปลี่ยนมาใช้ [ดาต้าแพ็คเก็ต](https://www.datapacket.com) เป็นผู้ให้บริการศูนย์ข้อมูลหลักรายใหม่ โดยใช้ฮาร์ดแวร์แบบเปล่าที่เน้นประสิทธิภาพและปรับแต่งได้ เพื่อปรับปรุงความน่าเชื่อถือและความเร็วในการให้บริการให้ดียิ่งขึ้น

**มิถุนายน 2568**: การส่งต่ออีเมลเปิดตัวการสนับสนุนสำหรับ [โปรโตคอล CardDAV](/faq#do-you-support-contacts-carddav) ซึ่งขยายความสามารถของแพลตฟอร์มเพื่อรวมการซิงโครไนซ์ข้อมูลติดต่อควบคู่ไปกับบริการอีเมลและปฏิทินที่มีอยู่

### 2026 - การปฏิบัติตาม RFC และการกรองขั้นสูง {#2026---rfc-compliance-and-advanced-filtering}

**มกราคม 2569**: Forward Email เผยแพร่เอกสาร[การปฏิบัติตามโปรโตคอล RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison)ที่ครอบคลุม โดยอธิบายรายละเอียดการสนับสนุนมาตรฐานเต็มรูปแบบสำหรับ SMTP, IMAP, POP3 และ CalDAV แพลตฟอร์มยังเพิ่ม[การสนับสนุน REQUIRETLS (RFC 8689)](/faq#requiretls-support) สำหรับการเข้ารหัส TLS บังคับในการส่งอีเมล [การเข้ารหัส S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) สำหรับการลงนามและเข้ารหัสข้อความอย่างปลอดภัย และ[การกรองอีเมล Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) พร้อม[โปรโตคอล ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering) สำหรับการกรองอีเมลฝั่งเซิร์ฟเวอร์ [REST API](/email-api) ถูกขยายเป็น 39 endpoints ครอบคลุมข้อความ โฟลเดอร์ รายชื่อติดต่อ ปฏิทิน และกิจกรรมปฏิทิน

## หลักการสำคัญ {#core-principles}

ตั้งแต่เริ่มก่อตั้ง Forward Email ได้รักษาความมุ่งมั่นอย่างแน่วแน่ต่อหลักการความเป็นส่วนตัวและความปลอดภัย:

**ปรัชญาโอเพ่นซอร์ส 100%**: ไม่เหมือนกับคู่แข่งที่เปิดเฉพาะส่วน frontend เท่านั้นโดยปิด backend ไว้ Forward Email ได้เปิดให้ฐานโค้ดทั้งหมดของตน ทั้ง frontend และ backend ตรวจสอบได้โดยสาธารณะบน [GitHub](https://github.com/forwardemail)

**การออกแบบที่เน้นความเป็นส่วนตัวเป็นอันดับแรก**: ตั้งแต่วันแรก Forward Email ได้นำแนวทางการประมวลผลในหน่วยความจำที่ไม่ซ้ำใครมาใช้ ซึ่งหลีกเลี่ยงการเขียนอีเมลลงในดิสก์ ทำให้แตกต่างจากบริการอีเมลทั่วไปที่เก็บข้อความในฐานข้อมูลหรือระบบไฟล์

**นวัตกรรมอย่างต่อเนื่อง**: บริการได้พัฒนาจากโซลูชันการส่งต่ออีเมลแบบเรียบง่ายไปเป็นแพลตฟอร์มอีเมลที่ครอบคลุมพร้อมฟีเจอร์ต่างๆ เช่น เมลบ็อกซ์ที่เข้ารหัส การเข้ารหัสที่ทนทานต่อควอนตัม และการรองรับโปรโตคอลมาตรฐาน รวมถึง SMTP, IMAP, POP3 และ CalDAV

**ความโปร่งใส**: การทำให้โค้ดทั้งหมดเป็นโอเพนซอร์สและพร้อมสำหรับการตรวจสอบ ช่วยให้มั่นใจว่าผู้ใช้สามารถยืนยันคำกล่าวอ้างเรื่องความเป็นส่วนตัวได้ แทนที่จะเชื่อถือเพียงคำชี้แจงทางการตลาดเท่านั้น

**การควบคุมของผู้ใช้**: มอบอำนาจให้ผู้ใช้ด้วยตัวเลือกต่างๆ รวมถึงความสามารถในการโฮสต์แพลตฟอร์มทั้งหมดด้วยตัวเองหากต้องการ

## สถานะปัจจุบัน {#current-status}

ณ ปี 2025 Forward Email ให้บริการโดเมนมากกว่า 500,000 โดเมนทั่วโลก รวมถึงองค์กรที่มีชื่อเสียงและผู้นำในอุตสาหกรรม เช่น:

* **บริษัทเทคโนโลยี**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **องค์กรสื่อ**: Fox News Radio, Disney Ad Sales
* **สถาบันการศึกษา**: มหาวิทยาลัยเคมบริดจ์, มหาวิทยาลัยแมริแลนด์, มหาวิทยาลัยวอชิงตัน, มหาวิทยาลัยทัฟส์, วิทยาลัยสวอร์ธมอร์
* **หน่วยงานรัฐบาล**: รัฐบาลเซาท์ออสเตรเลีย, รัฐบาลสาธารณรัฐโดมินิกัน
* **องค์กรอื่นๆ**: RCD Hotels, Fly<span>.</span>io
* **นักพัฒนาที่มีชื่อเสียง**: Isaac Z. Schlueter (ผู้สร้าง npm), David Heinemeier Hansson (ผู้สร้าง Ruby on Rails)

แพลตฟอร์มยังคงพัฒนาอย่างต่อเนื่องด้วยการเปิดตัวคุณลักษณะใหม่และการปรับปรุงโครงสร้างพื้นฐานอย่างสม่ำเสมอ โดยยังคงรักษาตำแหน่งบริการอีเมลแบบโอเพ่นซอร์ส 100% เข้ารหัส เน้นความเป็นส่วนตัว โปร่งใส และต้านทานควอนตัมเพียงรายเดียวที่มีอยู่ในปัจจุบัน

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />