# คำถามที่พบบ่อย {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="คำถามที่พบบ่อยเกี่ยวกับ Forward Email" class="rounded-lg" />


## สารบัญ {#table-of-contents}

* [เริ่มต้นอย่างรวดเร็ว](#quick-start)
* [บทนำ](#introduction)
  * [Forward Email คืออะไร](#what-is-forward-email)
  * [ใครใช้ Forward Email](#who-uses-forward-email)
  * [ประวัติของ Forward Email คืออะไร](#what-is-forward-emails-history)
  * [บริการนี้เร็วแค่ไหน](#how-fast-is-this-service)
* [โปรแกรมรับส่งอีเมล](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [อุปกรณ์มือถือ](#mobile-devices)
  * [การตั้งค่า Sendmail SMTP Relay](#sendmail-smtp-relay-configuration)
  * [การตั้งค่า Exim4 SMTP Relay](#exim4-smtp-relay-configuration)
  * [การตั้งค่า msmtp SMTP Client](#msmtp-smtp-client-configuration)
  * [โปรแกรมรับส่งอีเมลแบบบรรทัดคำสั่ง](#command-line-email-clients)
  * [การตั้งค่าอีเมลบน Windows](#windows-email-configuration)
  * [การตั้งค่า Postfix SMTP Relay](#postfix-smtp-relay-configuration)
  * [วิธีส่งอีเมลในนาม Gmail](#how-to-send-mail-as-using-gmail)
  * [คู่มือฟรีแบบเก่าสำหรับการส่งอีเมลในนาม Gmail คืออะไร](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [การตั้งค่าเส้นทางขั้นสูงของ Gmail](#advanced-gmail-routing-configuration)
  * [การตั้งค่าเส้นทางขั้นสูงของ Outlook](#advanced-outlook-routing-configuration)
* [การแก้ไขปัญหา](#troubleshooting)
  * [ทำไมฉันถึงไม่ได้รับอีเมลทดสอบของฉัน](#why-am-i-not-receiving-my-test-emails)
  * [ฉันจะตั้งค่าโปรแกรมรับส่งอีเมลให้ทำงานกับ Forward Email ได้อย่างไร](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [ทำไมอีเมลของฉันถึงไปอยู่ในโฟลเดอร์สแปมและจังค์ และฉันจะตรวจสอบชื่อเสียงโดเมนได้อย่างไร](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [ฉันควรทำอย่างไรถ้าฉันได้รับอีเมลสแปม](#what-should-i-do-if-i-receive-spam-emails)
  * [ทำไมอีเมลทดสอบที่ส่งถึงตัวเองใน Gmail ถึงแสดงว่า "น่าสงสัย"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [ฉันลบ via forwardemail dot net ใน Gmail ได้ไหม](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [การจัดการข้อมูล](#data-management)
  * [เซิร์ฟเวอร์ของคุณตั้งอยู่ที่ไหน](#where-are-your-servers-located)
  * [ฉันจะส่งออกและสำรองข้อมูลกล่องจดหมายของฉันได้อย่างไร](#how-do-i-export-and-backup-my-mailbox)
  * [ฉันจะนำเข้าและย้ายกล่องจดหมายที่มีอยู่ของฉันได้อย่างไร](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [ฉันจะใช้ที่เก็บข้อมูลที่เข้ากันได้กับ S3 ของตัวเองสำหรับการสำรองข้อมูลได้อย่างไร](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [ฉันจะแปลงการสำรองข้อมูล SQLite เป็นไฟล์ EML ได้อย่างไร](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [คุณรองรับการโฮสต์ด้วยตนเองไหม](#do-you-support-self-hosting)
* [การตั้งค่าอีเมล](#email-configuration)
  * [ฉันจะเริ่มต้นและตั้งค่าการส่งต่ออีเมลได้อย่างไร](#how-do-i-get-started-and-set-up-email-forwarding)
  * [ฉันสามารถใช้ MX หลายตัวและเซิร์ฟเวอร์หลายเครื่องสำหรับการส่งต่อขั้นสูงได้ไหม](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [ฉันจะตั้งค่าตอบกลับอัตโนมัติช่วงวันหยุด (out of office auto-responder) ได้อย่างไร](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [ฉันจะตั้งค่า SPF สำหรับ Forward Email ได้อย่างไร](#how-do-i-set-up-spf-for-forward-email)
  * [ฉันจะตั้งค่า DKIM สำหรับ Forward Email ได้อย่างไร](#how-do-i-set-up-dkim-for-forward-email)
  * [ฉันจะตั้งค่า DMARC สำหรับ Forward Email ได้อย่างไร](#how-do-i-set-up-dmarc-for-forward-email)
  * [ฉันจะดูรายงาน DMARC ได้อย่างไร](#how-do-i-view-dmarc-reports)
  * [ฉันจะเชื่อมต่อและตั้งค่ารายชื่อผู้ติดต่อได้อย่างไร](#how-do-i-connect-and-configure-my-contacts)
  * [ฉันจะเชื่อมต่อและตั้งค่าปฏิทินได้อย่างไร](#how-do-i-connect-and-configure-my-calendars)
  * [ฉันจะเพิ่มปฏิทินและจัดการปฏิทินที่มีอยู่ได้อย่างไร](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [ฉันจะเชื่อมต่อและตั้งค่าภารกิจและการเตือนได้อย่างไร](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [ทำไมฉันถึงสร้างภารกิจใน macOS Reminders ไม่ได้](#why-cant-i-create-tasks-in-macos-reminders)
  * [ฉันจะตั้งค่า Tasks.org บน Android ได้อย่างไร](#how-do-i-set-up-tasksorg-on-android)
  * [ฉันจะตั้งค่า SRS สำหรับ Forward Email ได้อย่างไร](#how-do-i-set-up-srs-for-forward-email)
  * [ฉันจะตั้งค่า MTA-STS สำหรับ Forward Email ได้อย่างไร](#how-do-i-set-up-mta-sts-for-forward-email)
  * [ฉันจะเพิ่มรูปโปรไฟล์ให้กับที่อยู่อีเมลของฉันได้อย่างไร](#how-do-i-add-a-profile-picture-to-my-email-address)
* [ฟีเจอร์ขั้นสูง](#advanced-features)
  * [คุณรองรับจดหมายข่าวหรือรายชื่อส่งเมลสำหรับอีเมลการตลาดไหม](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [คุณรองรับการส่งอีเมลผ่าน API ไหม](#do-you-support-sending-email-with-api)
  * [คุณรองรับการรับอีเมลผ่าน IMAP ไหม](#do-you-support-receiving-email-with-imap)
  * [คุณรองรับ POP3 ไหม](#do-you-support-pop3)
  * [คุณรองรับปฏิทิน (CalDAV) ไหม](#do-you-support-calendars-caldav)
  * [คุณรองรับภารกิจและการเตือนความจำ (CalDAV VTODO) ไหม](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [คุณรองรับรายชื่อผู้ติดต่อ (CardDAV) ไหม](#do-you-support-contacts-carddav)
  * [คุณรองรับการส่งอีเมลผ่าน SMTP ไหม](#do-you-support-sending-email-with-smtp)
  * [คุณรองรับ OpenPGP/MIME, การเข้ารหัสแบบ end-to-end ("E2EE"), และ Web Key Directory ("WKD") ไหม](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [คุณรองรับการเข้ารหัส S/MIME ไหม](#do-you-support-smime-encryption)
  * [คุณรองรับการกรองอีเมลด้วย Sieve ไหม](#do-you-support-sieve-email-filtering)
  * [คุณรองรับ MTA-STS ไหม](#do-you-support-mta-sts)
  * [คุณรองรับ passkeys และ WebAuthn ไหม](#do-you-support-passkeys-and-webauthn)
  * [คุณรองรับแนวทางปฏิบัติที่ดีที่สุดของอีเมลไหม](#do-you-support-email-best-practices)
  * [คุณรองรับ bounce webhooks ไหม](#do-you-support-bounce-webhooks)
  * [คุณรองรับ webhooks ไหม](#do-you-support-webhooks)
  * [คุณรองรับ regular expressions หรือ regex ไหม](#do-you-support-regular-expressions-or-regex)
  * [ข้อจำกัด SMTP ขาออกของคุณคืออะไร](#what-are-your-outbound-smtp-limits)
  * [ฉันต้องได้รับอนุมัติเพื่อเปิดใช้งาน SMTP ไหม](#do-i-need-approval-to-enable-smtp)
  * [การตั้งค่าเซิร์ฟเวอร์ SMTP ของคุณคืออะไร](#what-are-your-smtp-server-configuration-settings)
  * [การตั้งค่าเซิร์ฟเวอร์ IMAP ของคุณคืออะไร](#what-are-your-imap-server-configuration-settings)
  * [การตั้งค่าเซิร์ฟเวอร์ POP3 ของคุณคืออะไร](#what-are-your-pop3-server-configuration-settings)
  * [ฉันจะตั้งค่า autodiscovery อีเมลสำหรับโดเมนของฉันได้อย่างไร](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [ความปลอดภัย](#security-1)
  * [เทคนิคการเสริมความแข็งแกร่งของเซิร์ฟเวอร์ขั้นสูง](#advanced-server-hardening-techniques)
  * [คุณมีใบรับรอง SOC 2 หรือ ISO 27001 ไหม](#do-you-have-soc-2-or-iso-27001-certifications)
  * [คุณใช้การเข้ารหัส TLS สำหรับการส่งต่ออีเมลไหม](#do-you-use-tls-encryption-for-email-forwarding)
  * [คุณเก็บรักษาหัวข้อการตรวจสอบอีเมลไหม](#do-you-preserve-email-authentication-headers)
  * [คุณเก็บรักษาหัวข้ออีเมลต้นฉบับและป้องกันการปลอมแปลงไหม](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [คุณป้องกันสแปมและการละเมิดอย่างไร](#how-do-you-protect-against-spam-and-abuse)
  * [คุณเก็บเนื้อหาอีเมลบนดิสก์ไหม](#do-you-store-email-content-on-disk)
  * [เนื้อหาอีเมลอาจถูกเปิดเผยในระหว่างระบบล่มไหม](#can-email-content-be-exposed-during-system-crashes)
  * [ใครเข้าถึงโครงสร้างพื้นฐานอีเมลของคุณได้บ้าง](#who-has-access-to-your-email-infrastructure)
  * [คุณใช้ผู้ให้บริการโครงสร้างพื้นฐานใดบ้าง](#what-infrastructure-providers-do-you-use)
  * [คุณมีข้อตกลงการประมวลผลข้อมูล (DPA) ไหม](#do-you-offer-a-data-processing-agreement-dpa)
  * [คุณจัดการการแจ้งเตือนการละเมิดข้อมูลอย่างไร](#how-do-you-handle-data-breach-notifications)
  * [คุณมีสภาพแวดล้อมสำหรับทดสอบไหม](#do-you-offer-a-test-environment)
  * [คุณมีเครื่องมือสำหรับการตรวจสอบและแจ้งเตือนไหม](#do-you-provide-monitoring-and-alerting-tools)
  * [คุณรับประกันความพร้อมใช้งานสูงอย่างไร](#how-do-you-ensure-high-availability)
  * [คุณปฏิบัติตามมาตรฐาน Section 889 ของพระราชบัญญัติการอนุมัติการป้องกันแห่งชาติ (NDAA) ไหม](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [รายละเอียดระบบและเทคนิค](#system-and-technical-details)
  * [คุณเก็บอีเมลและเนื้อหาของอีเมลไหม](#do-you-store-emails-and-their-contents)
  * [ระบบส่งต่ออีเมลของคุณทำงานอย่างไร](#how-does-your-email-forwarding-system-work)
  * [คุณประมวลผลอีเมลเพื่อส่งต่ออย่างไร](#how-do-you-process-an-email-for-forwarding)
  * [คุณจัดการปัญหาการส่งอีเมลอย่างไร](#how-do-you-handle-email-delivery-issues)
  * [คุณจัดการเมื่อที่อยู่ IP ของคุณถูกบล็อกอย่างไร](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [ที่อยู่อีเมล postmaster คืออะไร](#what-are-postmaster-addresses)
  * [ที่อยู่อีเมล no-reply คืออะไร](#what-are-no-reply-addresses)
  * [ที่อยู่ IP ของเซิร์ฟเวอร์คุณคืออะไร](#what-are-your-servers-ip-addresses)
  * [คุณมีรายการอนุญาตไหม](#do-you-have-an-allowlist)
  * [นามสกุลโดเมนใดบ้างที่ถูกอนุญาตโดยค่าเริ่มต้น](#what-domain-name-extensions-are-allowlisted-by-default)
  * [เกณฑ์รายการอนุญาตของคุณคืออะไร](#what-is-your-allowlist-criteria)
  * [นามสกุลโดเมนใดบ้างที่ใช้ได้ฟรี](#what-domain-name-extensions-can-be-used-for-free)
  * [คุณมีรายการเทาหรือไม่](#do-you-have-a-greylist)
  * [คุณมีรายการปฏิเสธไหม](#do-you-have-a-denylist)
  * [คุณมีการจำกัดอัตราการส่งไหม](#do-you-have-rate-limiting)
  * [คุณป้องกัน backscatter อย่างไร](#how-do-you-protect-against-backscatter)
  * [ป้องกันการเด้งจากผู้ส่ง MAIL FROM ที่รู้จัก](#prevent-bounces-from-known-mail-from-spammers)
  * [ป้องกันการเด้งที่ไม่จำเป็นเพื่อปกป้องจาก backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [คุณกำหนดลายนิ้วมืออีเมลอย่างไร](#how-do-you-determine-an-email-fingerprint)
  * [ฉันสามารถส่งต่ออีเมลไปยังพอร์ตอื่นที่ไม่ใช่ 25 ได้ไหม (เช่น ถ้า ISP ของฉันบล็อกพอร์ต 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [รองรับสัญลักษณ์บวก + สำหรับนามแฝง Gmail ไหม](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [รองรับซับโดเมนไหม](#does-it-support-sub-domains)
  * [ส่งต่อหัวข้ออีเมลของฉันไหม](#does-this-forward-my-emails-headers)
  * [ผ่านการทดสอบอย่างดีไหม](#is-this-well-tested)
  * [คุณส่งต่อข้อความและรหัสตอบกลับ SMTP ไหม](#do-you-pass-along-smtp-response-messages-and-codes)
  * [คุณป้องกันสแปมเมอร์และรักษาชื่อเสียงการส่งต่ออีเมลอย่างไร](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [คุณทำการค้นหา DNS บนชื่อโดเมนอย่างไร](#how-do-you-perform-dns-lookups-on-domain-names)
* [บัญชีและการชำระเงิน](#account-and-billing)
  * [คุณมีการรับประกันคืนเงินสำหรับแผนที่ชำระเงินไหม](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [ถ้าฉันเปลี่ยนแผน คุณคิดอัตราส่วนและคืนเงินส่วนต่างไหม](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [ฉันสามารถใช้บริการส่งต่ออีเมลนี้เป็นเซิร์ฟเวอร์ MX "สำรอง" หรือ "สำรองล้มเหลว" ได้ไหม](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [ฉันปิดใช้งานนามแฝงเฉพาะได้ไหม](#can-i-disable-specific-aliases)
  * [ฉันสามารถส่งต่ออีเมลไปยังผู้รับหลายคนได้ไหม](#can-i-forward-emails-to-multiple-recipients)
  * [ฉันสามารถมีผู้รับ catch-all หลายคนทั่วโลกได้ไหม](#can-i-have-multiple-global-catch-all-recipients)
  * [มีขีดจำกัดสูงสุดของจำนวนที่อยู่อีเมลที่ฉันสามารถส่งต่อได้ต่อหนึ่งนามแฝงไหม](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [ฉันสามารถส่งต่ออีเมลแบบเรียกซ้ำได้ไหม](#can-i-recursively-forward-emails)
  * [คนอื่นสามารถยกเลิกหรือลงทะเบียนการส่งต่ออีเมลของฉันโดยไม่ได้รับอนุญาตไหม](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [บริการนี้ฟรีได้อย่างไร](#how-is-it-free)
  * [ขนาดอีเมลสูงสุดคือเท่าไร](#what-is-the-max-email-size-limit)
  * [คุณเก็บบันทึกอีเมลไหม](#do-you-store-logs-of-emails)
  * [คุณเก็บบันทึกข้อผิดพลาดไหม](#do-you-store-error-logs)
  * [คุณอ่านอีเมลของฉันไหม](#do-you-read-my-emails)
  * [ฉันสามารถ "ส่งอีเมลในนาม" ใน Gmail ด้วยบริการนี้ได้ไหม](#can-i-send-mail-as-in-gmail-with-this)
  * [ฉันสามารถ "ส่งอีเมลในนาม" ใน Outlook ด้วยบริการนี้ได้ไหม](#can-i-send-mail-as-in-outlook-with-this)
  * [ฉันสามารถ "ส่งอีเมลในนาม" ใน Apple Mail และ iCloud Mail ด้วยบริการนี้ได้ไหม](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [ฉันสามารถส่งต่ออีเมลได้ไม่จำกัดด้วยบริการนี้ไหม](#can-i-forward-unlimited-emails-with-this)
  * [คุณมีโดเมนไม่จำกัดในราคาหนึ่งราคาไหม](#do-you-offer-unlimited-domains-for-one-price)
  * [คุณรับวิธีการชำระเงินแบบใดบ้าง](#which-payment-methods-do-you-accept)
* [แหล่งข้อมูลเพิ่มเติม](#additional-resources)
## Quick Start {#quick-start}

เพื่อเริ่มต้นกับ Forward Email:

1. **สร้างบัญชีผู้ใช้** ที่ [forwardemail.net/register](https://forwardemail.net/register)

2. **เพิ่มและยืนยันโดเมนของคุณ** ภายใต้ [My Account → Domains](/my-account/domains)

3. **เพิ่มและตั้งค่าอีเมลอาลิอาส/กล่องจดหมาย** ภายใต้ [My Account → Domains](/my-account/domains) → Aliases

4. **ทดสอบการตั้งค่าของคุณ** โดยส่งอีเมลไปยังหนึ่งในอาลิอาสใหม่ของคุณ

> \[!TIP]
> การเปลี่ยนแปลง DNS อาจใช้เวลาถึง 24-48 ชั่วโมงในการแพร่กระจายทั่วโลก แม้ว่ามักจะมีผลเร็วกว่า

> \[!IMPORTANT]
> เพื่อเพิ่มประสิทธิภาพการส่งอีเมล เราแนะนำให้ตั้งค่า [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), และ [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records


## Introduction {#introduction}

### What is Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email เหมาะสำหรับบุคคล ธุรกิจขนาดเล็ก และนักพัฒนาที่ต้องการที่อยู่อีเมลมืออาชีพโดยไม่ต้องเสียค่าใช้จ่ายและการดูแลรักษาโฮสติ้งอีเมลเต็มรูปแบบ

Forward Email คือ **ผู้ให้บริการอีเมลที่มีฟีเจอร์ครบถ้วน** และ **ผู้ให้บริการโฮสติ้งอีเมลสำหรับชื่อโดเมนที่กำหนดเอง**

เป็นบริการฟรีและโอเพนซอร์สเพียงหนึ่งเดียวที่ให้คุณใช้ที่อยู่อีเมลโดเมนกำหนดเองโดยไม่ต้องยุ่งยากกับการตั้งค่าและดูแลเซิร์ฟเวอร์อีเมลของตัวเอง

บริการของเราจะส่งต่ออีเมลที่ส่งไปยังโดเมนกำหนดเองของคุณไปยังบัญชีอีเมลที่มีอยู่ของคุณ – และคุณยังสามารถใช้เราเป็นผู้ให้บริการโฮสติ้งอีเมลเฉพาะของคุณได้ด้วย

คุณสมบัติหลักของ Forward Email:

* **อีเมลโดเมนกำหนดเอง**: ใช้ที่อยู่อีเมลมืออาชีพกับชื่อโดเมนของคุณเอง
* **ระดับฟรี**: การส่งต่ออีเมลพื้นฐานโดยไม่มีค่าใช้จ่าย
* **ความเป็นส่วนตัวที่เพิ่มขึ้น**: เราไม่อ่านอีเมลของคุณหรือขายข้อมูลของคุณ
* **โอเพนซอร์ส**: โค้ดทั้งหมดของเราพร้อมให้ดูบน GitHub
* **รองรับ SMTP, IMAP, และ POP3**: ความสามารถในการส่งและรับอีเมลอย่างเต็มรูปแบบ
* **การเข้ารหัสแบบ End-to-End**: รองรับ OpenPGP/MIME
* **อาลิอาสแบบ Catch-All กำหนดเอง**: สร้างอีเมลอาลิอาสได้ไม่จำกัด

คุณสามารถเปรียบเทียบเรากับผู้ให้บริการอีเมลอื่นๆ กว่า 56 รายได้ที่ [หน้าเปรียบเทียบบริการอีเมลของเรา](/blog/best-email-service)

> \[!TIP]
> เรียนรู้เพิ่มเติมเกี่ยวกับ Forward Email โดยอ่าน [Technical Whitepaper](/technical-whitepaper.pdf) ฟรีของเรา

### Who uses Forward Email {#who-uses-forward-email}

เรามอบบริการโฮสติ้งอีเมลและการส่งต่ออีเมลให้กับโดเมนกว่า 500,000+ โดเมน และผู้ใช้ที่โดดเด่นเหล่านี้:

| ลูกค้า                                  | กรณีศึกษา                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| U.S. Naval Academy                       | [:page_facing_up: กรณีศึกษา](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                                | [:page_facing_up: กรณีศึกษา](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                            |                                                                                                          |
| The Linux Foundation                     | [:page_facing_up: กรณีศึกษา](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| The PHP Foundation                       |                                                                                                          |
| Fox News Radio                           |                                                                                                          |
| Disney Ad Sales                          |                                                                                                          |
| jQuery                                   | [:page_facing_up: กรณีศึกษา](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                                |                                                                                                          |
| Ubuntu                                   | [:page_facing_up: กรณีศึกษา](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                                  | [:page_facing_up: กรณีศึกษา](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                                  | [:page_facing_up: กรณีศึกษา](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| The University of Cambridge              | [:page_facing_up: กรณีศึกษา](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Maryland               | [:page_facing_up: กรณีศึกษา](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Washington             | [:page_facing_up: กรณีศึกษา](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Tufts University                         | [:page_facing_up: กรณีศึกษา](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Swarthmore College                       | [:page_facing_up: กรณีศึกษา](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Government of South Australia            |                                                                                                          |
| Government of Dominican Republic         |                                                                                                          |
| Fly<span>.</span>io                      |                                                                                                          |
| RCD Hotels                               |                                                                                                          |
| Isaac Z. Schlueter (npm)                 | [:page_facing_up: กรณีศึกษา](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### ประวัติของ Forward Email {#what-is-forward-emails-history}

คุณสามารถเรียนรู้เพิ่มเติมเกี่ยวกับ Forward Email ได้ที่ [หน้าข้อมูลของเรา](/about)

### บริการนี้เร็วแค่ไหน {#how-fast-is-this-service}

> \[!NOTE]
> ระบบของเราออกแบบมาเพื่อความรวดเร็วและความน่าเชื่อถือ โดยมีเซิร์ฟเวอร์สำรองหลายเครื่องเพื่อให้แน่ใจว่าอีเมลของคุณจะถูกส่งถึงอย่างรวดเร็ว

Forward Email ส่งข้อความด้วยความล่าช้าน้อยที่สุด โดยปกติภายในไม่กี่วินาทีหลังจากได้รับ

ตัวชี้วัดประสิทธิภาพ:

* **เวลาส่งโดยเฉลี่ย**: น้อยกว่า 5-10 วินาทีจากการรับถึงการส่งต่อ ([ดูหน้าติดตามเวลาเข้าสู่กล่องจดหมาย "TTI"](/tti))
* **เวลาทำงาน**: มีบริการใช้งานได้มากกว่า 99.9%
* **โครงสร้างพื้นฐานทั่วโลก**: เซิร์ฟเวอร์ตั้งอยู่ในตำแหน่งยุทธศาสตร์เพื่อการส่งต่อที่เหมาะสมที่สุด
* **การปรับขนาดอัตโนมัติ**: ระบบของเราปรับขนาดในช่วงเวลาที่มีอีเมลจำนวนมาก

เราทำงานแบบเรียลไทม์ แตกต่างจากผู้ให้บริการรายอื่นที่ใช้คิวแบบหน่วงเวลา

เราไม่เขียนลงดิสก์หรือเก็บบันทึก – ยกเว้น [ข้อผิดพลาด](#do-you-store-error-logs) และ [SMTP ขาออก](#do-you-support-sending-email-with-smtp) (ดู [นโยบายความเป็นส่วนตัวของเรา](/privacy))

ทุกอย่างทำงานในหน่วยความจำ และ [ซอร์สโค้ดของเราอยู่บน GitHub](https://github.com/forwardemail)


## โปรแกรมรับส่งอีเมล {#email-clients}

### Thunderbird {#thunderbird}

1. สร้างอีเมลแฝงใหม่และสร้างรหัสผ่านในแดชบอร์ด Forward Email ของคุณ
2. เปิด Thunderbird แล้วไปที่ **แก้ไข → การตั้งค่าบัญชี → การดำเนินการบัญชี → เพิ่มบัญชีอีเมล**
3. กรอกชื่อของคุณ ที่อยู่อีเมล Forward Email และรหัสผ่าน
4. คลิก **กำหนดค่าด้วยตนเอง** และกรอก:
   * ขาเข้า: IMAP, `imap.forwardemail.net`, พอร์ต 993, SSL/TLS
   * ขาออก: SMTP, `smtp.forwardemail.net`, พอร์ต 465, SSL/TLS (แนะนำ; พอร์ต 587 พร้อม STARTTLS ก็รองรับ)
5. คลิก **เสร็จสิ้น**

### Microsoft Outlook {#microsoft-outlook}

1. สร้างอีเมลแฝงใหม่และสร้างรหัสผ่านในแดชบอร์ด Forward Email ของคุณ
2. ไปที่ **ไฟล์ → เพิ่มบัญชี**
3. กรอกที่อยู่อีเมล Forward Email ของคุณแล้วคลิก **เชื่อมต่อ**
4. เลือก **ตัวเลือกขั้นสูง** และเลือก **ให้ฉันตั้งค่าบัญชีด้วยตนเอง**
5. เลือก **IMAP** และกรอก:
   * ขาเข้า: `imap.forwardemail.net`, พอร์ต 993, SSL
   * ขาออก: `smtp.forwardemail.net`, พอร์ต 465, SSL/TLS (แนะนำ; พอร์ต 587 พร้อม STARTTLS ก็รองรับ)
   * ชื่อผู้ใช้: ที่อยู่อีเมลเต็มของคุณ
   * รหัสผ่าน: รหัสผ่านที่คุณสร้าง
6. คลิก **เชื่อมต่อ**

### Apple Mail {#apple-mail}

1. สร้างอีเมลแฝงใหม่และสร้างรหัสผ่านในแดชบอร์ด Forward Email ของคุณ
2. ไปที่ **เมล → การตั้งค่า → บัญชี → +**
3. เลือก **บัญชีอีเมลอื่น**
4. กรอกชื่อของคุณ ที่อยู่อีเมล Forward Email และรหัสผ่าน
5. สำหรับการตั้งค่าเซิร์ฟเวอร์ ให้กรอก:
   * ขาเข้า: `imap.forwardemail.net`
   * ขาออก: `smtp.forwardemail.net`
   * ชื่อผู้ใช้: ที่อยู่อีเมลเต็มของคุณ
   * รหัสผ่าน: รหัสผ่านที่คุณสร้าง
6. คลิก **ลงชื่อเข้าใช้**

### eM Client {#em-client}

1. สร้างอีเมลแฝงใหม่และสร้างรหัสผ่านในแดชบอร์ด Forward Email ของคุณ
2. เปิด eM Client แล้วไปที่ **เมนู → บัญชี → + เพิ่มบัญชี**
3. คลิกที่ **เมล** แล้วเลือก **อื่นๆ**
4. กรอกที่อยู่อีเมล Forward Email ของคุณแล้วคลิก **ถัดไป**
5. กรอกการตั้งค่าเซิร์ฟเวอร์ดังนี้:
   * **เซิร์ฟเวอร์ขาเข้า**: `imap.forwardemail.net`
   * **เซิร์ฟเวอร์ขาออก**: `smtp.forwardemail.net`
6. กรอกที่อยู่อีเมลเต็มของคุณเป็น **ชื่อผู้ใช้** และรหัสผ่านที่คุณสร้างเป็น **รหัสผ่าน** สำหรับทั้งเซิร์ฟเวอร์ขาเข้าและขาออก
7. eM Client จะทดสอบการเชื่อมต่อ เมื่อผ่านแล้ว คลิก **ถัดไป**
8. กรอกชื่อของคุณและเลือกชื่อบัญชี
9. คลิก **เสร็จสิ้น**

### อุปกรณ์มือถือ {#mobile-devices}

สำหรับ iOS:

1. ไปที่ **การตั้งค่า → เมล → บัญชี → เพิ่มบัญชี → อื่นๆ**
2. แตะ **เพิ่มบัญชีเมล** และกรอกรายละเอียดของคุณ
3. สำหรับการตั้งค่าเซิร์ฟเวอร์ ใช้การตั้งค่า IMAP และ SMTP เดียวกับด้านบน

สำหรับ Android:

1. ไปที่ **การตั้งค่า → บัญชี → เพิ่มบัญชี → ส่วนบุคคล (IMAP)**
2. กรอกที่อยู่อีเมล Forward Email และรหัสผ่าน
3. สำหรับการตั้งค่าเซิร์ฟเวอร์ ใช้การตั้งค่า IMAP และ SMTP เดียวกับด้านบน

### การตั้งค่า Sendmail SMTP Relay {#sendmail-smtp-relay-configuration}

คุณสามารถตั้งค่า Sendmail ให้ส่งต่ออีเมลผ่านเซิร์ฟเวอร์ SMTP ของ Forward Email ซึ่งเป็นการตั้งค่าที่ใช้กันทั่วไปสำหรับระบบเก่าหรือแอปพลิเคชันที่พึ่งพา Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">เวลาติดตั้งโดยประมาณ:</strong>
  <span>น้อยกว่า 20 นาที</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    สิ่งนี้ต้องใช้แผนชำระเงินที่เปิดใช้งานการเข้าถึง SMTP
  </span>
</div>

#### การตั้งค่า {#configuration}

1. แก้ไขไฟล์ `sendmail.mc` ของคุณ ซึ่งโดยปกติจะอยู่ที่ `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. เพิ่มบรรทัดต่อไปนี้เพื่อกำหนด smart host และการตรวจสอบสิทธิ์:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. สร้างไฟล์การตรวจสอบสิทธิ์ `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. เพิ่มข้อมูลรับรอง Forward Email ของคุณลงในไฟล์ `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. สร้างฐานข้อมูลการตรวจสอบสิทธิ์และตั้งค่าสิทธิ์ไฟล์ให้ปลอดภัย:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. สร้างการตั้งค่า Sendmail ใหม่และรีสตาร์ทบริการ:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### การทดสอบ {#testing}

ส่งอีเมลทดสอบเพื่อตรวจสอบการตั้งค่า:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### การตั้งค่า Exim4 SMTP Relay {#exim4-smtp-relay-configuration}

Exim4 เป็น MTA ที่ได้รับความนิยมบนระบบ Debian-based คุณสามารถตั้งค่าให้ใช้ Forward Email เป็น smarthost ได้

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">เวลาติดตั้งโดยประมาณ:</strong>
  <span>น้อยกว่า 15 นาที</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    สิ่งนี้ต้องใช้แผนชำระเงินที่เปิดใช้งานการเข้าถึง SMTP
  </span>
</div>

#### การตั้งค่า {#configuration-1}

1. รันเครื่องมือการตั้งค่า Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. เลือกตัวเลือกดังต่อไปนี้:
   * **ประเภทการตั้งค่าเมลทั่วไป:** เมลที่ส่งโดย smarthost; รับผ่าน SMTP หรือ fetchmail
   * **ชื่อเมลระบบ:** your.hostname
   * **ที่อยู่ IP ที่จะฟังสำหรับการเชื่อมต่อ SMTP ขาเข้า:** 127.0.0.1 ; ::1
   * **ปลายทางอื่นที่ยอมรับเมล:** (เว้นว่าง)
   * **โดเมนที่จะส่งต่อเมล:** (เว้นว่าง)
   * **ที่อยู่ IP หรือชื่อโฮสต์ของ smarthost ขาออก:** smtp.forwardemail.net::465
   * **ซ่อนชื่อเมลท้องถิ่นในเมลขาออก?** ไม่
   * **เก็บจำนวนการค้นหา DNS ให้น้อยที่สุด (Dial-on-Demand)?** ไม่
   * **วิธีการส่งเมลท้องถิ่น:** รูปแบบ Mbox ใน /var/mail/
   * **แยกการตั้งค่าเป็นไฟล์เล็ก ๆ?** ไม่

3. แก้ไขไฟล์ `passwd.client` เพื่อเพิ่มข้อมูลรับรองของคุณ:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. เพิ่มบรรทัดต่อไปนี้:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. อัปเดตการตั้งค่าและรีสตาร์ท Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### การทดสอบ {#testing-1}

ส่งอีเมลทดสอบ:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### การตั้งค่า msmtp SMTP Client {#msmtp-smtp-client-configuration}

msmtp เป็นไคลเอนต์ SMTP ขนาดเล็กที่มีประโยชน์สำหรับการส่งอีเมลจากสคริปต์หรือแอปพลิเคชันบรรทัดคำสั่ง

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">เวลาติดตั้งโดยประมาณ:</strong>
  <span>น้อยกว่า 10 นาที</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    สิ่งนี้ต้องใช้แผนชำระเงินที่เปิดใช้งานการเข้าถึง SMTP
  </span>
</div>

#### การตั้งค่า {#configuration-2}

1. สร้างหรือแก้ไขไฟล์การตั้งค่า msmtp ที่ `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. เพิ่มการตั้งค่าดังต่อไปนี้:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. ตั้งค่าสิทธิ์ที่ถูกต้องสำหรับไฟล์การตั้งค่า:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### การทดสอบ {#testing-2}

ส่งอีเมลทดสอบ:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### โปรแกรมอีเมลบนบรรทัดคำสั่ง {#command-line-email-clients}

โปรแกรมอีเมลบนบรรทัดคำสั่งยอดนิยม เช่น [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org), และ [Alpine](https://alpine.x10.mx/alpine/release/) สามารถตั้งค่าให้ใช้เซิร์ฟเวอร์ SMTP ของ Forward Email สำหรับส่งอีเมลได้ การตั้งค่าจะคล้ายกับการตั้งค่า `msmtp` โดยที่คุณต้องระบุรายละเอียดเซิร์ฟเวอร์ SMTP และข้อมูลรับรองของคุณในไฟล์การตั้งค่าที่เกี่ยวข้อง (`.muttrc`, `.neomuttrc`, หรือ `.pinerc`)

### การตั้งค่าอีเมลบน Windows {#windows-email-configuration}

สำหรับผู้ใช้ Windows คุณสามารถตั้งค่าโปรแกรมอีเมลยอดนิยม เช่น **Microsoft Outlook** และ **eM Client** โดยใช้การตั้งค่า IMAP และ SMTP ที่ให้ไว้ในบัญชี Forward Email ของคุณ สำหรับการใช้งานบนบรรทัดคำสั่งหรือสคริปต์ คุณสามารถใช้คำสั่ง PowerShell `Send-MailMessage` (แม้ว่าจะถือว่าเลิกใช้แล้ว) หรือเครื่องมือ SMTP relay ขนาดเล็กอย่าง [E-MailRelay](https://github.com/graeme-walker/emailrelay)

### การตั้งค่า Postfix SMTP Relay {#postfix-smtp-relay-configuration}

คุณสามารถตั้งค่า Postfix ให้ส่งต่ออีเมลผ่านเซิร์ฟเวอร์ SMTP ของ Forward Email ได้ ซึ่งเหมาะสำหรับแอปพลิเคชันเซิร์ฟเวอร์ที่ต้องการส่งอีเมล

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">เวลาประมาณในการตั้งค่า:</strong>
  <span>น้อยกว่า 15 นาที</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    สิ่งนี้ต้องใช้แผนชำระเงินที่เปิดใช้งานการเข้าถึง SMTP
  </span>
</div>

#### การติดตั้ง {#installation}

1. ติดตั้ง Postfix บนเซิร์ฟเวอร์ของคุณ:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. ในระหว่างการติดตั้ง ให้เลือก "Internet Site" เมื่อถูกถามเกี่ยวกับประเภทการตั้งค่า

#### การตั้งค่า {#configuration-3}

1. แก้ไขไฟล์การตั้งค่าหลักของ Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. เพิ่มหรือแก้ไขการตั้งค่าต่อไปนี้:

```
# การตั้งค่า SMTP relay
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. สร้างไฟล์รหัสผ่าน SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. เพิ่มข้อมูลรับรอง Forward Email ของคุณ:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. ตั้งค่าสิทธิ์และแฮชไฟล์รหัสผ่าน:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. รีสตาร์ท Postfix:

```bash
sudo systemctl restart postfix
```

#### การทดสอบ {#testing-3}

ทดสอบการตั้งค่าของคุณโดยส่งอีเมลทดสอบ:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### วิธีส่งอีเมลในนาม Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">เวลาติดตั้งโดยประมาณ:</strong>
  <span>น้อยกว่า 10 นาที</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    เริ่มต้นใช้งาน:
  </strong>
  <span>
    หากคุณได้ทำตามคำแนะนำข้างต้นในหัวข้อ <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">ฉันจะเริ่มต้นและตั้งค่าการส่งต่ออีเมลได้อย่างไร</a> แล้ว คุณสามารถอ่านต่อด้านล่างได้เลย
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    โปรดตรวจสอบให้แน่ใจว่าคุณได้อ่าน <a href="/terms" class="alert-link" target="_blank">ข้อกำหนด</a>, <a href="/privacy" class="alert-link" target="_blank">นโยบายความเป็นส่วนตัว</a> และ <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">ข้อจำกัด SMTP ขาออก</a> ของเราแล้ว &ndash; การใช้งานของคุณถือเป็นการรับทราบและยอมรับ
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    หากคุณเป็นนักพัฒนา โปรดดูเอกสาร <a class="alert-link" href="/email-api#outbound-emails" target="_blank">API อีเมล</a> ของเรา
  </span>
</div>

1. ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> การกำหนดค่า SMTP ขาออก และทำตามคำแนะนำการตั้งค่า

2. สร้างนามแฝงใหม่สำหรับโดเมนของคุณภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code><hello@example.com></code>)

3. คลิกที่ <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ข้างนามแฝงที่สร้างใหม่ คัดลอกไปยังคลิปบอร์ดและเก็บรหัสผ่านที่สร้างขึ้นอย่างปลอดภัยตามที่แสดงบนหน้าจอ

4. ไปที่ [Gmail](https://gmail.com) และภายใต้ [การตั้งค่า <i class="fa fa-angle-right"></i> บัญชีและการนำเข้า <i class="fa fa-angle-right"></i> ส่งอีเมลในนาม](https://mail.google.com/mail/u/0/#settings/accounts) คลิก "เพิ่มที่อยู่อีเมลอื่น"

5. เมื่อถูกถาม "ชื่อ" ให้กรอกชื่อที่คุณต้องการให้แสดงเป็นผู้ส่งอีเมล (เช่น "Linus Torvalds")

6. เมื่อถูกถาม "ที่อยู่อีเมล" ให้กรอกที่อยู่อีเมลเต็มของนามแฝงที่คุณสร้างภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code><hello@example.com></code>)

7. ยกเลิกเลือก "ปฏิบัติเป็นนามแฝง"

8. คลิก "ขั้นตอนถัดไป" เพื่อดำเนินการต่อ

9. เมื่อถูกถาม "เซิร์ฟเวอร์ SMTP" ให้กรอก <code>smtp.forwardemail.net</code> และเปลี่ยนพอร์ตเป็น <code>465</code>

10. เมื่อถูกถาม "ชื่อผู้ใช้" ให้กรอกที่อยู่อีเมลเต็มของนามแฝงที่คุณสร้างภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code><hello@example.com></code>)

11. เมื่อถูกถาม "รหัสผ่าน" ให้วางรหัสผ่านจาก <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ในขั้นตอนที่ 3 ข้างต้น

12. เลือกปุ่มวิทยุสำหรับ "การเชื่อมต่อที่ปลอดภัยโดยใช้ SSL"

13. คลิก "เพิ่มบัญชี" เพื่อดำเนินการต่อ

14. เปิดแท็บใหม่ไปที่ [Gmail](https://gmail.com) และรอให้อีเมลยืนยันของคุณมาถึง (คุณจะได้รับรหัสยืนยันที่ยืนยันว่าคุณเป็นเจ้าของที่อยู่อีเมลที่คุณพยายาม "ส่งอีเมลในนาม")

15. เมื่อได้รับแล้ว ให้คัดลอกและวางรหัสยืนยันในช่องที่แสดงในขั้นตอนก่อนหน้า
16. เมื่อคุณทำขั้นตอนนั้นเสร็จแล้ว ให้กลับไปที่อีเมลและคลิกลิงก์เพื่อ "ยืนยันคำขอ" คุณจะต้องทำขั้นตอนนี้และขั้นตอนก่อนหน้าเพื่อให้อีเมลถูกตั้งค่าอย่างถูกต้อง

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ขอแสดงความยินดี!
    </strong>
    <span>
      คุณได้ทำทุกขั้นตอนสำเร็จแล้ว
    </span>
  </div>
</div>

</div>

### คู่มือฟรีแบบเก่าสำหรับการส่งอีเมลในนาม Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">สำคัญ:</strong> คู่มือฟรีแบบเก่านี้เลิกใช้ตั้งแต่เดือนพฤษภาคม 2023 เนื่องจาก <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">ตอนนี้เรารองรับการส่งอีเมลผ่าน SMTP แล้ว</a> หากคุณใช้คู่มือด้านล่างนี้ <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">จะทำให้อีเมลขาออกของคุณ</a> แสดงข้อความ "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" ใน Gmail</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">เวลาประมาณในการตั้งค่า:</strong>
  <span>น้อยกว่า 10 นาที</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    เริ่มต้นใช้งาน:
  </strong>
  <span>
    หากคุณได้ทำตามคำแนะนำข้างต้นในหัวข้อ <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">ฉันจะเริ่มต้นและตั้งค่าการส่งต่ออีเมลได้อย่างไร</a> แล้ว คุณสามารถอ่านต่อด้านล่างได้เลย
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. คุณต้องเปิดใช้งาน [การยืนยันตัวตนสองขั้นตอนของ Gmail][gmail-2fa] เพื่อให้วิธีนี้ทำงานได้ หากยังไม่ได้เปิดใช้งาน ให้ไปที่ <https://www.google.com/landing/2step/>

2. เมื่อเปิดใช้งานการยืนยันตัวตนสองขั้นตอนแล้ว (หรือถ้าเปิดใช้งานอยู่แล้ว) ให้ไปที่ <https://myaccount.google.com/apppasswords>

3. เมื่อถูกถามว่า "เลือกแอปและอุปกรณ์ที่คุณต้องการสร้างรหัสผ่านแอปสำหรับ":
   * เลือก "Mail" ในเมนูดรอปดาวน์ของ "เลือกแอป"
   * เลือก "Other" ในเมนูดรอปดาวน์ของ "เลือกอุปกรณ์"
   * เมื่อถูกถามให้กรอกข้อความ ให้กรอกที่อยู่อีเมลโดเมนของคุณที่คุณส่งต่อ (เช่น <code><hello@example.com></code> - เพื่อช่วยให้คุณติดตามได้หากใช้บริการนี้กับหลายบัญชี)

4. คัดลอกรหัสผ่านที่สร้างขึ้นโดยอัตโนมัติไปยังคลิปบอร์ดของคุณ
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       สำคัญ:
     </strong>
     <span>
       หากคุณใช้ G Suite ให้ไปที่แผงผู้ดูแลระบบของคุณ <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">แอป <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> การตั้งค่าสำหรับ Gmail <i class="fa fa-angle-right"></i> การตั้งค่า</a> และตรวจสอบให้แน่ใจว่าได้เลือก "อนุญาตให้ผู้ใช้ส่งอีเมลผ่านเซิร์ฟเวอร์ SMTP ภายนอก..." การเปลี่ยนแปลงนี้จะใช้เวลาสักครู่ในการเปิดใช้งาน กรุณารอสักครู่
     </span>
   </div>

5. ไปที่ [Gmail](https://gmail.com) และในเมนู [การตั้งค่า <i class="fa fa-angle-right"></i> บัญชีและการนำเข้า <i class="fa fa-angle-right"></i> ส่งอีเมลในนาม](https://mail.google.com/mail/u/0/#settings/accounts) คลิก "เพิ่มที่อยู่อีเมลอื่น"

6. เมื่อถูกถามว่า "ชื่อ" ให้กรอกชื่อที่คุณต้องการให้แสดงเป็นผู้ส่ง (เช่น "Linus Torvalds")

7. เมื่อถูกถามว่า "ที่อยู่อีเมล" ให้กรอกที่อยู่อีเมลโดเมนที่คุณใช้ข้างต้น (เช่น <code><hello@example.com></code>)
8. ยกเลิกการเลือก "Treat as an alias"

9. คลิก "Next Step" เพื่อดำเนินการต่อ

10. เมื่อมีการถามหา "SMTP Server" ให้กรอก <code>smtp.gmail.com</code> และปล่อยพอร์ตเป็น <code>587</code>

11. เมื่อมีการถามหา "Username" ให้กรอกส่วนของที่อยู่อีเมล Gmail ของคุณโดยไม่ต้องใส่ <span>gmail.com</span> (เช่น แค่ "user" ถ้าอีเมลของฉันคือ <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        สำคัญ:
      </strong>
      <span>
        หากส่วน "Username" ถูกกรอกอัตโนมัติ <u><strong>คุณจะต้องเปลี่ยนตรงนี้</strong></u> เป็นส่วนชื่อผู้ใช้ของที่อยู่อีเมล Gmail ของคุณแทน
      </span>
    </div>

12. เมื่อมีการถามหา "Password" ให้วางรหัสผ่านที่คุณสร้างไว้ในขั้นตอนที่ 2 ข้างต้นจากคลิปบอร์ดของคุณ

13. ปล่อยให้ปุ่มวิทยุถูกเลือกสำหรับ "Secured connection using TLS"

14. คลิก "Add Account" เพื่อดำเนินการต่อ

15. เปิดแท็บใหม่ไปที่ [Gmail](https://gmail.com) และรอให้อีเมลยืนยันตัวตนของคุณมาถึง (คุณจะได้รับรหัสยืนยันที่ยืนยันว่าคุณเป็นเจ้าของที่อยู่อีเมลที่คุณพยายามจะ "ส่งอีเมลในนาม")

16. เมื่อได้รับแล้ว ให้คัดลอกและวางรหัสยืนยันที่ได้รับในขั้นตอนก่อนหน้า

17. เมื่อทำเสร็จแล้ว ให้กลับไปที่อีเมลและคลิกลิงก์เพื่อ "ยืนยันคำขอ" คุณจะต้องทำขั้นตอนนี้และขั้นตอนก่อนหน้าเพื่อให้อีเมลถูกตั้งค่าอย่างถูกต้อง

</div>

### การตั้งค่าการกำหนดเส้นทาง Gmail ขั้นสูง {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">เวลาประมาณในการตั้งค่า:</strong>
  <span>15-30 นาที</span>
</div>

หากคุณต้องการตั้งค่าการกำหนดเส้นทางขั้นสูงใน Gmail เพื่อให้ชื่อเล่นที่ไม่ตรงกับกล่องจดหมายใด ๆ ส่งต่อไปยัง mail exchanges ของ Forward Email ให้ทำตามขั้นตอนเหล่านี้:

1. เข้าสู่ระบบ Google Admin console ที่ [admin.google.com](https://admin.google.com)
2. ไปที่ **Apps → Google Workspace → Gmail → Routing**
3. คลิกที่ **Add Route** และตั้งค่าตามนี้:

**การตั้งค่าผู้รับเดี่ยว:**

* เลือก "Change envelope recipient" และกรอกที่อยู่อีเมล Gmail หลักของคุณ
* เลือก "Add X-Gm-Original-To header with original recipient"

**รูปแบบผู้รับซองจดหมาย:**

* เพิ่มรูปแบบที่ตรงกับกล่องจดหมายที่ไม่มีอยู่ทั้งหมด (เช่น `.*@yourdomain.com`)

**การตั้งค่าเซิร์ฟเวอร์อีเมล:**

* เลือก "Route to host" และกรอก `mx1.forwardemail.net` เป็นเซิร์ฟเวอร์หลัก
* เพิ่ม `mx2.forwardemail.net` เป็นเซิร์ฟเวอร์สำรอง
* ตั้งพอร์ตเป็น 25
* เลือก "Require TLS" เพื่อความปลอดภัย

4. คลิก **Save** เพื่อสร้างเส้นทาง

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    การตั้งค่านี้จะใช้ได้เฉพาะกับบัญชี Google Workspace ที่มีโดเมนกำหนดเองเท่านั้น ไม่สามารถใช้กับบัญชี Gmail ปกติได้
  </span>
</div>

### การตั้งค่าการกำหนดเส้นทาง Outlook ขั้นสูง {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">เวลาประมาณในการตั้งค่า:</strong>
  <span>15-30 นาที</span>
</div>

สำหรับผู้ใช้ Microsoft 365 (เดิมชื่อ Office 365) ที่ต้องการตั้งค่าการกำหนดเส้นทางขั้นสูงเพื่อให้ชื่อเล่นที่ไม่ตรงกับกล่องจดหมายใด ๆ ส่งต่อไปยัง mail exchanges ของ Forward Email:

1. เข้าสู่ระบบศูนย์ผู้ดูแลระบบ Microsoft 365 ที่ [admin.microsoft.com](https://admin.microsoft.com)
2. ไปที่ **Exchange → Mail flow → Rules**
3. คลิก **Add a rule** และเลือก **Create a new rule**
4. ตั้งชื่อกฎของคุณ (เช่น "Forward non-existent mailboxes to Forward Email")
5. ภายใต้ **Apply this rule if** ให้เลือก:
   * "The recipient address matches..."
   * กรอกรูปแบบที่ตรงกับที่อยู่อีเมลทั้งหมดในโดเมนของคุณ (เช่น `*@yourdomain.com`)
6. ภายใต้ **Do the following** ให้เลือก:
   * "Redirect the message to..."
   * เลือก "The following mail server"
   * กรอก `mx1.forwardemail.net` และพอร์ต 25
   * เพิ่ม `mx2.forwardemail.net` เป็นเซิร์ฟเวอร์สำรอง
7. ภายใต้ **Except if** ให้เลือก:
   * "The recipient is..."
   * เพิ่มกล่องจดหมายที่มีอยู่ทั้งหมดของคุณที่ไม่ควรถูกส่งต่อ
8. ตั้งค่าความสำคัญของกฎเพื่อให้ทำงานหลังจากกฎการไหลของเมลอื่น ๆ
9. คลิก **Save** เพื่อเปิดใช้งานกฎ
## การแก้ไขปัญหา {#troubleshooting}

### ทำไมฉันถึงไม่ได้รับอีเมลทดสอบของฉัน {#why-am-i-not-receiving-my-test-emails}

หากคุณส่งอีเมลทดสอบไปหาตัวเอง อีเมลนั้นอาจจะไม่แสดงในกล่องจดหมายของคุณเนื่องจากมีหัวข้อ "Message-ID" เหมือนกัน

นี่เป็นปัญหาที่เป็นที่รู้จักกันอย่างกว้างขวาง และยังส่งผลกระทบต่อบริการต่างๆ เช่น Gmail  <a href="https://support.google.com/a/answer/1703601">นี่คือคำตอบอย่างเป็นทางการของ Gmail เกี่ยวกับปัญหานี้</a>

หากคุณยังคงมีปัญหาอยู่ นั่นน่าจะเป็นปัญหาเกี่ยวกับการแพร่กระจาย DNS คุณจะต้องรออีกสักระยะแล้วลองใหม่อีกครั้ง (หรือพยายามตั้งค่า TTL ที่ต่ำลงในระเบียน <strong class="notranslate">TXT</strong> ของคุณ)

**ยังมีปัญหาอยู่หรือไม่?**  กรุณา <a href="/help">ติดต่อเรา</a> เพื่อให้เราช่วยตรวจสอบปัญหาและหาทางแก้ไขอย่างรวดเร็ว

### ฉันจะตั้งค่าไคลเอนต์อีเมลของฉันให้ทำงานกับ Forward Email ได้อย่างไร {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  บริการของเราทำงานร่วมกับไคลเอนต์อีเมลยอดนิยม เช่น:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  ชื่อผู้ใช้ของคุณคือที่อยู่อีเมลของนามแฝงของคุณ และรหัสผ่านมาจาก <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("รหัสผ่านปกติ")
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
  <span>หากคุณใช้ Thunderbird ให้แน่ใจว่า "Connection security" ตั้งค่าเป็น "SSL/TLS" และวิธีการตรวจสอบสิทธิ์ตั้งเป็น "Normal password"</span>
</div>

| ประเภท |         ชื่อโฮสต์        |         โปรโตคอล        |                                            พอร์ต                                           |
| :----: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP   | `imap.forwardemail.net`  |  SSL/TLS **แนะนำ**      |                                      `993` และ `2993`                                      |
| SMTP   | `smtp.forwardemail.net`  | SSL/TLS **แนะนำ**       | `465` และ `2465` สำหรับ SSL/TLS (แนะนำ) หรือ `587`, `2587`, `2525` และ `25` สำหรับ STARTTLS |

### ทำไมอีเมลของฉันถึงไปอยู่ในโฟลเดอร์สแปมและจังค์ และฉันจะตรวจสอบชื่อเสียงโดเมนของฉันได้อย่างไร {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
ส่วนนี้จะแนะนำคุณหากอีเมลขาออกของคุณใช้เซิร์ฟเวอร์ SMTP ของเรา (เช่น `smtp.forwardemail.net`) (หรือถูกส่งต่อผ่าน `mx1.forwardemail.net` หรือ `mx2.forwardemail.net`) และถูกจัดส่งไปยังโฟลเดอร์สแปมหรือจังค์ของผู้รับ

เราตรวจสอบ [ที่อยู่ IP](#what-are-your-servers-ip-addresses) ของเราอย่างสม่ำเสมอกับ [รายการ DNS denylist ที่น่าเชื่อถือทั้งหมด](#how-do-you-handle-your-ip-addresses-becoming-blocked) **ดังนั้นจึงมีความเป็นไปได้สูงว่าเป็นปัญหาเฉพาะเกี่ยวกับชื่อเสียงโดเมน**

อีเมลอาจถูกจัดให้อยู่ในโฟลเดอร์สแปมด้วยเหตุผลหลายประการ:

1. **ขาดการตรวจสอบสิทธิ์**: ตั้งค่า [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) และ [DMARC](#how-do-i-set-up-dmarc-for-forward-email)

2. **ชื่อเสียงโดเมน**: โดเมนใหม่มักมีชื่อเสียงเป็นกลางจนกว่าจะสร้างประวัติการส่ง

3. **เนื้อหาที่กระตุ้น**: คำหรือวลีบางอย่างอาจกระตุ้นตัวกรองสแปม

4. **รูปแบบการส่ง**: การเพิ่มขึ้นอย่างรวดเร็วของปริมาณอีเมลอาจดูน่าสงสัย

คุณสามารถลองใช้เครื่องมือหนึ่งหรือมากกว่านี้เพื่อตรวจสอบชื่อเสียงและการจัดหมวดหมู่ของโดเมนของคุณ:

#### เครื่องมือตรวจสอบชื่อเสียงและรายการบล็อก {#reputation-and-blocklist-check-tools}

| ชื่อเครื่องมือ                              | URL                                                          | ประเภท                  |
| ------------------------------------------- | ------------------------------------------------------------ | ----------------------- |
| Cloudflare Domain Categorization Feedback   | <https://radar.cloudflare.com/domains/feedback>              | การจัดหมวดหมู่          |
| Spamhaus IP and Domain Reputation Checker   | <https://check.spamhaus.org/>                                | DNSBL                   |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | ชื่อเสียง               |
| Barracuda IP and Domain Reputation Lookup   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                   |
| MX Toolbox Blacklist Check                  | <https://mxtoolbox.com/blacklists.aspx>                      | รายการบล็อก            |
| Google Postmaster Tools                     | <https://www.gmail.com/postmaster/>                          | ชื่อเสียง               |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                              | ชื่อเสียง               |
| MultiRBL.valli.org Blacklist Check          | <https://multirbl.valli.org/lookup/>                         | DNSBL                   |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | ชื่อเสียง               |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                   |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                   |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                   |
| UCEPROTECT's Levels 1, 2, and 3             | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                   |
| UCEPROTECT's backscatterer.org              | <https://www.backscatterer.org/>                             | การป้องกัน backscatter |
| UCEPROTECT's whitelisted.org                | <https://www.whitelisted.org/> (requires a fee)              | DNSWL                   |

#### แบบฟอร์มคำขอปลดบล็อก IP ตามผู้ให้บริการ {#ip-removal-request-forms-by-provider}

หากที่อยู่ IP ของคุณถูกบล็อกโดยผู้ให้บริการอีเมลเฉพาะ ให้ใช้แบบฟอร์มปลดบล็อกหรือช่องทางติดต่อที่เหมาะสมด้านล่าง:

| ผู้ให้บริการ                            | แบบฟอร์มปลดบล็อก / ช่องทางติดต่อ                                                                                     | หมายเหตุ                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | แบบฟอร์มติดต่อผู้ส่งจำนวนมาก                 |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | พอร์ทัลปลดบล็อก IP ของ Office 365           |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Yahoo Sender Hub                             |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple ใช้ Proofpoint สำหรับชื่อเสียง IP      |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | ตรวจสอบและปลดบล็อก IP ของ Proofpoint        |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | ตรวจสอบชื่อเสียงและปลดบล็อก Barracuda      |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | คำขอรีเซ็ต Cloudmark CSI                      |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | แบบฟอร์มคำขอปลดบล็อก IP ของ GoDaddy        |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | คำขอปลดบล็อก IP ของ Comcast                  |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | ติดต่อฝ่ายสนับสนุน Spectrum เพื่อปลดบล็อก   |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | อีเมลสำหรับคำขอปลดบล็อก                      |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | อีเมลสำหรับคำขอปลดบล็อก                      |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | ใช้ Cloudfilter                               |
| Windstream                             | `abuse@windstream.net`                                                                                     | อีเมลสำหรับคำขอปลดบล็อก                      |
| t-online.de (Germany)                  | `tobr@rx.t-online.de`                                                                                      | อีเมลสำหรับคำขอปลดบล็อก                      |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | ใช้แบบฟอร์มติดต่อหรืออีเมล `abuse@orange.fr` |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | แบบฟอร์มติดต่อ GMX postmaster                |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | พอร์ทัล postmaster ของ Mail.ru                |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | พอร์ทัล postmaster ของ Yandex                 |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | การสมัคร whitelist ของ QQ Mail (ภาษาจีน)      |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | พอร์ทัล postmaster ของ Netease                |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | ติดต่อผ่านคอนโซล Alibaba Cloud               |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | คอนโซล AWS SES > การปลดบล็อก Blacklist      |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | ติดต่อฝ่ายสนับสนุน SendGrid                   |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | ใช้ RBL ของบุคคลที่สาม - ติดต่อ RBL เฉพาะ    |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | ติดต่อฝ่ายสนับสนุน Fastmail                   |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | ติดต่อฝ่ายสนับสนุน Zoho                       |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | ติดต่อฝ่ายสนับสนุน Proton                      |
| Tutanota                               | <https://tutanota.com/support>                                                                             | ติดต่อฝ่ายสนับสนุน Tutanota                    |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | ติดต่อฝ่ายสนับสนุน Hushmail                    |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | ติดต่อฝ่ายสนับสนุน Mailbox.org                 |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | ติดต่อฝ่ายสนับสนุน Posteo                      |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | ติดต่อฝ่ายสนับสนุน DuckDuckGo                  |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | ติดต่อฝ่ายสนับสนุน Sonic                        |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | ติดต่อฝ่ายสนับสนุน Telus                        |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | ติดต่อฝ่ายสนับสนุน Vodafone                     |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | ติดต่อฝ่ายสนับสนุน Spark NZ                     |
| UOL/BOL (Brazil)                       | <https://ajuda.uol.com.br/>                                                                                | ติดต่อฝ่ายสนับสนุน UOL (ภาษาโปรตุเกส)          |
| Libero (Italy)                         | <https://aiuto.libero.it/>                                                                                 | ติดต่อฝ่ายสนับสนุน Libero (ภาษาอิตาลี)          |
| Telenet (Belgium)                      | <https://www2.telenet.be/en/support/>                                                                      | ติดต่อฝ่ายสนับสนุน Telenet                      |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | ติดต่อฝ่ายสนับสนุนธุรกิจ Facebook               |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | ติดต่อฝ่ายสนับสนุน LinkedIn                      |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | ติดต่อฝ่ายสนับสนุน Groups.io                     |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | เครื่องมือผู้ส่งของ Vade Secure                   |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | ติดต่อฝ่ายสนับสนุน Cloudflare                    |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | ติดต่อฝ่ายสนับสนุน Hornetsecurity                |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | ติดต่อผ่านผู้ให้บริการโฮสติ้ง                    |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | ติดต่อฝ่ายสนับสนุน Mail2World                     |
> \[!TIP]
> เริ่มต้นด้วยปริมาณอีเมลคุณภาพสูงในปริมาณน้อยเพื่อสร้างชื่อเสียงที่ดี ก่อนส่งในปริมาณมากขึ้น

> \[!IMPORTANT]
> หากโดเมนของคุณอยู่ในบัญชีดำ แต่ละบัญชีดำจะมีขั้นตอนการลบของตัวเอง ตรวจสอบเว็บไซต์ของพวกเขาสำหรับคำแนะนำ

> \[!TIP]
> หากคุณต้องการความช่วยเหลือเพิ่มเติมหรือพบว่าเราถูกระบุเป็นสแปมโดยผิดพลาดโดยผู้ให้บริการอีเมลบางราย กรุณา <a href="/help">ติดต่อเรา</a>

### ฉันควรทำอย่างไรหากได้รับอีเมลสแปม {#what-should-i-do-if-i-receive-spam-emails}

คุณควรยกเลิกการสมัครรับอีเมล (ถ้าเป็นไปได้) และบล็อกผู้ส่ง

กรุณาอย่ารายงานข้อความเป็นสแปม แต่ให้ส่งต่อไปยังระบบป้องกันการละเมิดที่เราคัดกรองด้วยมือและเน้นความเป็นส่วนตัวของเราแทน

**ที่อยู่อีเมลสำหรับส่งต่อสแปมคือ:** <abuse@forwardemail.net>

### ทำไมอีเมลทดสอบที่ส่งถึงตัวเองใน Gmail ถึงแสดงว่า "น่าสงสัย" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

หากคุณเห็นข้อความแสดงข้อผิดพลาดนี้ใน Gmail เมื่อคุณส่งอีเมลทดสอบถึงตัวเอง หรือเมื่อบุคคลที่คุณส่งอีเมลด้วยนามแฝงของคุณเห็นอีเมลจากคุณเป็นครั้งแรก ให้ **อย่ากังวล** – เพราะนี่เป็นฟีเจอร์ความปลอดภัยในตัวของ Gmail

คุณสามารถคลิก "ดูปลอดภัย" ได้เลย ตัวอย่างเช่น หากคุณส่งข้อความทดสอบโดยใช้ฟีเจอร์ส่งอีเมลในนาม (send mail as) ไปยังคนอื่น พวกเขาจะไม่เห็นข้อความนี้

แต่ถ้าพวกเขาเห็นข้อความนี้ ก็เพราะว่าพวกเขาคุ้นเคยกับการเห็นอีเมลของคุณมาจาก <john@gmail.com> แทนที่จะเป็น <john@customdomain.com> (แค่ตัวอย่าง) Gmail จะแจ้งเตือนผู้ใช้เพื่อให้แน่ใจว่าสิ่งต่าง ๆ ปลอดภัย เผื่อไว้ ไม่มีวิธีแก้ไข

### ฉันสามารถลบ via forwardemail dot net ใน Gmail ได้ไหม {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

หัวข้อนี้เกี่ยวข้องกับ [ปัญหาที่รู้จักกันดีใน Gmail ที่มีข้อมูลเพิ่มเติมแสดงถัดจากชื่อผู้ส่ง](https://support.google.com/mail/answer/1311182)

ตั้งแต่เดือนพฤษภาคม 2023 เราสนับสนุนการส่งอีเมลด้วย SMTP เป็นส่วนเสริมสำหรับผู้ใช้ที่ชำระเงินทั้งหมด – ซึ่งหมายความว่าคุณสามารถลบ <span class="notranslate">via forwardemail dot net</span> ใน Gmail ได้

โปรดทราบว่าหัวข้อนี้เฉพาะสำหรับผู้ที่ใช้ฟีเจอร์ [วิธีส่งอีเมลในนามโดยใช้ Gmail](#how-to-send-mail-as-using-gmail)

โปรดดูส่วนของ [คุณสนับสนุนการส่งอีเมลด้วย SMTP หรือไม่](#do-you-support-sending-email-with-smtp) สำหรับคำแนะนำการตั้งค่า


## การจัดการข้อมูล {#data-management}

### เซิร์ฟเวอร์ของคุณตั้งอยู่ที่ไหน {#where-are-your-servers-located}

> \[!TIP]
> เราอาจประกาศตำแหน่งศูนย์ข้อมูลในสหภาพยุโรปที่โฮสต์ภายใต้ [forwardemail.eu](https://forwardemail.eu) ในเร็วๆ นี้ สมัครรับการอภิปรายได้ที่ <https://github.com/orgs/forwardemail/discussions/336> เพื่อรับข่าวสาร

เซิร์ฟเวอร์ของเราตั้งอยู่หลักๆ ที่เมืองเดนเวอร์ รัฐโคโลราโด – ดูได้ที่ <https://forwardemail.net/ips> สำหรับรายการที่อยู่ IP ทั้งหมดของเรา

คุณสามารถเรียนรู้เกี่ยวกับผู้ประมวลผลข้อมูลรองของเราได้ที่หน้า [GDPR](/gdpr), [DPA](/dpa), และ [ความเป็นส่วนตัว](/privacy)

### ฉันจะส่งออกและสำรองข้อมูลกล่องจดหมายของฉันได้อย่างไร {#how-do-i-export-and-backup-my-mailbox}

คุณสามารถส่งออกกล่องจดหมายของคุณเป็นรูปแบบ [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox), หรือ [SQLite](https://en.wikipedia.org/wiki/SQLite) ที่เข้ารหัสได้ทุกเมื่อ

ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง <i class="fa fa-angle-right"></i> ดาวน์โหลดสำรองข้อมูล และเลือกประเภทรูปแบบส่งออกที่คุณต้องการ

คุณจะได้รับอีเมลลิงก์สำหรับดาวน์โหลดไฟล์ส่งออกเมื่อกระบวนการเสร็จสิ้น

โปรดทราบว่าลิงก์ดาวน์โหลดนี้จะหมดอายุหลังจาก 4 ชั่วโมงเพื่อความปลอดภัย

หากคุณต้องการตรวจสอบไฟล์ EML หรือ Mbox ที่ส่งออก เครื่องมือโอเพนซอร์สเหล่านี้อาจมีประโยชน์:

| ชื่อ             | รูปแบบ | แพลตฟอร์ม    | URL GitHub                                          |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows       | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | ทุกแพลตฟอร์ม | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows       | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode        | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | ทุกแพลตฟอร์ม | <https://github.com/s0ph1e/eml-reader>              |
นอกจากนี้หากคุณต้องการแปลงไฟล์ Mbox เป็นไฟล์ EML คุณสามารถใช้ <https://github.com/noelmartinon/mboxzilla> ได้

### ฉันจะนำเข้าและย้ายกล่องจดหมายที่มีอยู่ของฉันได้อย่างไร {#how-do-i-import-and-migrate-my-existing-mailbox}

คุณสามารถนำเข้าอีเมลของคุณไปยัง Forward Email ได้อย่างง่ายดาย (เช่น ใช้ [Thunderbird](https://www.thunderbird.net)) โดยทำตามคำแนะนำด้านล่างนี้:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    คุณต้องปฏิบัติตามขั้นตอนทั้งหมดต่อไปนี้เพื่อที่จะนำเข้าอีเมลที่มีอยู่ของคุณ
  </span>
</div>

1. ส่งออกอีเมลของคุณจากผู้ให้บริการอีเมลที่มีอยู่:

   | ผู้ให้บริการอีเมล | รูปแบบการส่งออก                              | คำแนะนำการส่งออก                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">เคล็ดลับ:</strong> <span>หากคุณใช้ Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">รูปแบบการส่งออก PST</a>) คุณสามารถทำตามคำแนะนำในส่วน "อื่นๆ" ด้านล่างได้เลย อย่างไรก็ตามเราได้จัดเตรียมลิงก์ด้านล่างเพื่อแปลง PST เป็นรูปแบบ MBOX/EML ตามระบบปฏิบัติการของคุณ:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba สำหรับ Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst สำหรับ Windows cygwin</a> – (เช่น <code>readpst -u -o $OUT_DIR $IN_DIR</code> โดยแทนที่ <code>$OUT_DIR</code> และ <code>$IN_DIR</code> ด้วยเส้นทางโฟลเดอร์ผลลัพธ์และโฟลเดอร์อินพุตตามลำดับ)</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst สำหรับ Ubuntu/Linux</a> – (เช่น <code>sudo apt-get install readpst</code> แล้วตามด้วย <code>readpst -u -o $OUT_DIR $IN_DIR</code> โดยแทนที่ <code>$OUT_DIR</code> และ <code>$IN_DIR</code> ด้วยเส้นทางโฟลเดอร์ผลลัพธ์และโฟลเดอร์อินพุตตามลำดับ)</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst สำหรับ macOS (ผ่าน brew)</a> – (เช่น <code>brew install libpst</code> แล้วตามด้วย <code>readpst -u -o $OUT_DIR $IN_DIR</code> โดยแทนที่ <code>$OUT_DIR</code> และ <code>$IN_DIR</code> ด้วยเส้นทางโฟลเดอร์ผลลัพธ์และโฟลเดอร์อินพุตตามลำดับ)</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter สำหรับ Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | อื่นๆ          | [ใช้ Thunderbird](https://www.thunderbird.net) | ตั้งค่าบัญชีอีเมลที่มีอยู่ของคุณใน Thunderbird แล้วใช้ปลั๊กอิน [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) เพื่อส่งออกและนำเข้าอีเมลของคุณ  **คุณอาจสามารถคัดลอก/วาง หรือ ลาก/วาง อีเมลระหว่างบัญชีหนึ่งไปยังอีกบัญชีหนึ่งได้อย่างง่ายดาย**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. ดาวน์โหลด ติดตั้ง และเปิดใช้งาน [Thunderbird](https://www.thunderbird.net)

3. สร้างบัญชีใหม่โดยใช้ที่อยู่อีเมลเต็มของอาลิอัสของคุณ (เช่น <code><you@yourdomain.com></code>) และรหัสผ่านที่สร้างขึ้นของคุณ  <strong>หากคุณยังไม่มีรหัสผ่านที่สร้างขึ้น โปรด <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">ดูคำแนะนำการตั้งค่าของเรา</a></strong>

4. ดาวน์โหลดและติดตั้งปลั๊กอิน [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) สำหรับ Thunderbird

5. สร้างโฟลเดอร์ท้องถิ่นใหม่ใน Thunderbird จากนั้นคลิกขวาที่โฟลเดอร์ → เลือกตัวเลือก `ImportExportTools NG` → เลือก `Import mbox file` (สำหรับรูปแบบการส่งออก MBOX) – หรือ – `Import messages` / `Import all messages from a directory` (สำหรับรูปแบบการส่งออก EML)

6. ลาก/วางจากโฟลเดอร์ท้องถิ่นไปยังโฟลเดอร์ IMAP ใหม่ (หรือที่มีอยู่) ใน Thunderbird ที่คุณต้องการอัปโหลดข้อความไปยังพื้นที่เก็บข้อมูล IMAP กับบริการของเรา  วิธีนี้จะช่วยให้ข้อความของคุณถูกสำรองข้อมูลออนไลน์ด้วยพื้นที่เก็บข้อมูลที่เข้ารหัส SQLite ของเรา

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       เคล็ดลับ:
     </strong>
     <span>
       หากคุณสับสนเกี่ยวกับวิธีการนำเข้าข้อมูลใน Thunderbird คุณสามารถดูคำแนะนำอย่างเป็นทางการได้ที่ <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> และ <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    เมื่อคุณทำกระบวนการส่งออกและนำเข้าเสร็จสิ้นแล้ว คุณอาจต้องการเปิดใช้งานการส่งต่อในบัญชีอีเมลที่มีอยู่ของคุณและตั้งค่าการตอบกลับอัตโนมัติเพื่อแจ้งผู้ส่งว่าคุณมีที่อยู่อีเมลใหม่ (เช่น หากคุณเคยใช้ Gmail มาก่อนและตอนนี้ใช้ที่อยู่อีเมลที่มีโดเมนของคุณเอง)
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ขอแสดงความยินดี!
    </strong>
    <span>
      คุณได้ทำขั้นตอนทั้งหมดสำเร็จเรียบร้อยแล้ว
    </span>
  </div>
</div>

### ฉันจะใช้พื้นที่เก็บข้อมูลที่เข้ากันได้กับ S3 ของตัวเองสำหรับการสำรองข้อมูลได้อย่างไร {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

ผู้ใช้แผนชำระเงินสามารถกำหนดค่าผู้ให้บริการพื้นที่เก็บข้อมูลที่เข้ากันได้กับ [S3](https://en.wikipedia.org/wiki/Amazon_S3) ของตนเองในแต่ละโดเมนสำหรับการสำรองข้อมูล IMAP/SQLite ซึ่งหมายความว่าการสำรองข้อมูลกล่องจดหมายที่เข้ารหัสของคุณสามารถเก็บไว้บนโครงสร้างพื้นฐานของคุณเองแทนที่จะใช้ (หรือเพิ่มเติมจาก) พื้นที่เก็บข้อมูลเริ่มต้นของเรา

ผู้ให้บริการที่รองรับได้แก่ [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) และบริการอื่น ๆ ที่เข้ากันได้กับ S3

#### การตั้งค่า {#setup}

1. สร้างบัคเก็ต **ส่วนตัว** กับผู้ให้บริการที่เข้ากันได้กับ S3 ของคุณ บัคเก็ตต้องไม่สามารถเข้าถึงได้สาธารณะ
2. สร้างข้อมูลรับรองการเข้าถึง (access key ID และ secret access key) ที่มีสิทธิ์อ่าน/เขียนในบัคเก็ต
3. ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่าขั้นสูง <i class="fa fa-angle-right"></i> พื้นที่เก็บข้อมูลที่เข้ากันได้กับ S3 แบบกำหนดเอง
4. ทำเครื่องหมายที่ **"เปิดใช้งานพื้นที่เก็บข้อมูลที่เข้ากันได้กับ S3 แบบกำหนดเอง"** และกรอก URL จุดเชื่อมต่อ, access key ID, secret access key, ภูมิภาค และชื่อบัคเก็ตของคุณ
5. คลิก **"ทดสอบการเชื่อมต่อ"** เพื่อตรวจสอบข้อมูลรับรอง การเข้าถึงบัคเก็ต และสิทธิ์การเขียน
6. คลิก **"บันทึก"** เพื่อใช้การตั้งค่า

#### วิธีการทำงานของการสำรองข้อมูล {#how-backups-work}

การสำรองข้อมูลจะถูกเรียกใช้อัตโนมัติสำหรับอาลิอัส IMAP ที่เชื่อมต่อทั้งหมด เซิร์ฟเวอร์ IMAP จะตรวจสอบการเชื่อมต่อที่ใช้งานทั้งหมดทุกชั่วโมงและส่งคำสั่งสำรองข้อมูลสำหรับอาลิอัสที่เชื่อมต่อแต่ละรายการ ล็อกแบบ Redis จะป้องกันไม่ให้การสำรองข้อมูลซ้ำกันทำงานภายใน 30 นาที และการสำรองข้อมูลจริงจะถูกข้ามหากมีการสำรองข้อมูลที่สำเร็จแล้วภายใน 24 ชั่วโมงที่ผ่านมา (เว้นแต่จะมีการร้องขอการสำรองข้อมูลโดยผู้ใช้เพื่อดาวน์โหลด)
การสำรองข้อมูลยังสามารถเริ่มต้นด้วยตนเองได้โดยการคลิก **"Download Backup"** สำหรับอาลิอัสใดก็ได้ในแดชบอร์ด การสำรองข้อมูลด้วยตนเองจะทำงานเสมอโดยไม่คำนึงถึงช่วงเวลา 24 ชั่วโมง

กระบวนการสำรองข้อมูลทำงานดังนี้:

1. ฐานข้อมูล SQLite จะถูกคัดลอกโดยใช้ `VACUUM INTO` ซึ่งสร้างภาพสแนปช็อตที่สอดคล้องกันโดยไม่รบกวนการเชื่อมต่อที่ใช้งานอยู่และรักษาการเข้ารหัสฐานข้อมูลไว้
2. ไฟล์สำรองข้อมูลจะถูกตรวจสอบโดยการเปิดเพื่อยืนยันว่าการเข้ารหัสยังคงถูกต้อง
3. จะคำนวณค่าแฮช SHA-256 และเปรียบเทียบกับไฟล์สำรองข้อมูลที่มีอยู่ในที่เก็บข้อมูล หากค่าแฮชตรงกัน จะข้ามการอัปโหลด (ไม่มีการเปลี่ยนแปลงตั้งแต่การสำรองข้อมูลครั้งล่าสุด)
4. ไฟล์สำรองข้อมูลจะถูกอัปโหลดไปยัง S3 โดยใช้ multipart upload ผ่านไลบรารี [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage)
5. จะสร้าง URL ดาวน์โหลดที่ลงนามแล้ว (ใช้ได้ 4 ชั่วโมง) และส่งอีเมลไปยังผู้ใช้

#### Backup Formats {#backup-formats}

รองรับรูปแบบการสำรองข้อมูลสามแบบ:

| รูปแบบ   | นามสกุล  | คำอธิบาย                                                                 |
| -------- | --------- | ------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | ภาพสแนปช็อตฐานข้อมูล SQLite ที่เข้ารหัสแบบดิบ (ค่าเริ่มต้นสำหรับการสำรองข้อมูล IMAP อัตโนมัติ) |
| `mbox`   | `.zip`    | ไฟล์ ZIP ที่ป้องกันด้วยรหัสผ่านซึ่งบรรจุกล่องจดหมายในรูปแบบ mbox          |
| `eml`    | `.zip`    | ไฟล์ ZIP ที่ป้องกันด้วยรหัสผ่านซึ่งบรรจุไฟล์ `.eml` แยกแต่ละข้อความ         |

> **เคล็ดลับ:** หากคุณมีไฟล์สำรองข้อมูล `.sqlite` และต้องการแปลงเป็นไฟล์ `.eml` ในเครื่อง ให้ใช้เครื่องมือ CLI แบบสแตนด์อโลนของเรา **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)** ซึ่งรองรับ Windows, Linux และ macOS และไม่ต้องการการเชื่อมต่อเครือข่าย

#### File Naming and Key Structure {#file-naming-and-key-structure}

เมื่อใช้ **ที่เก็บข้อมูล S3 แบบกำหนดเอง** ไฟล์สำรองข้อมูลจะถูกเก็บด้วยคำนำหน้าระบุเวลาตาม [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) เพื่อให้แต่ละการสำรองข้อมูลถูกเก็บเป็นอ็อบเจ็กต์แยกต่างหาก ซึ่งช่วยให้คุณมีประวัติการสำรองข้อมูลครบถ้วนในบัคเก็ตของคุณเอง

รูปแบบคีย์คือ:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

ตัวอย่างเช่น:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` คือ MongoDB ObjectId ของอาลิอัส คุณสามารถหาได้จากหน้าการตั้งค่าอาลิอัสหรือผ่าน API

เมื่อใช้ **ที่เก็บข้อมูลเริ่มต้น (ระบบ)** คีย์จะเป็นแบบแบน (เช่น `65a31c53c36b75ed685f3fda.sqlite`) และแต่ละการสำรองข้อมูลจะเขียนทับไฟล์ก่อนหน้า

> **หมายเหตุ:** เนื่องจากที่เก็บข้อมูล S3 แบบกำหนดเองจะเก็บเวอร์ชันการสำรองข้อมูลทั้งหมด การใช้งานพื้นที่เก็บข้อมูลจะเพิ่มขึ้นตามเวลา เราแนะนำให้ตั้งค่า [กฎวงจรชีวิต](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) บนบัคเก็ตของคุณเพื่อให้ไฟล์สำรองข้อมูลเก่าหมดอายุโดยอัตโนมัติ (เช่น ลบอ็อบเจ็กต์ที่เก่ากว่า 30 หรือ 90 วัน)

#### Data Ownership and Deletion Policy {#data-ownership-and-deletion-policy}

บัคเก็ต S3 แบบกำหนดเองของคุณอยู่ภายใต้การควบคุมของคุณอย่างสมบูรณ์ เรา **ไม่เคยลบหรือแก้ไข** ไฟล์ในบัคเก็ต S3 แบบกำหนดเองของคุณ — ไม่ว่าจะเป็นตอนที่ลบอาลิอัส, ลบโดเมน หรือระหว่างการทำความสะอาดใดๆ เราจะเขียนไฟล์สำรองข้อมูลใหม่ลงในบัคเก็ตของคุณเท่านั้น

ซึ่งหมายความว่า:

* **การลบอาลิอัส** — เมื่อคุณลบอาลิอัส เราจะลบไฟล์สำรองข้อมูลจากที่เก็บข้อมูลระบบเริ่มต้นของเราเท่านั้น ไฟล์สำรองข้อมูลที่เคยเขียนไปยังบัคเก็ต S3 แบบกำหนดเองของคุณจะยังคงอยู่ไม่ถูกแตะต้อง
* **การลบโดเมน** — การลบโดเมนจะไม่ส่งผลกระทบต่อไฟล์ในบัคเก็ตของคุณ
* **การจัดการการเก็บรักษา** — คุณเป็นผู้รับผิดชอบในการจัดการพื้นที่เก็บข้อมูลในบัคเก็ตของคุณเอง รวมถึงการตั้งค่ากฎวงจรชีวิตเพื่อให้ไฟล์สำรองข้อมูลเก่าหมดอายุ

หากคุณปิดการใช้งานที่เก็บข้อมูล S3 แบบกำหนดเองหรือสลับกลับไปใช้ที่เก็บข้อมูลเริ่มต้น ไฟล์ที่มีอยู่ในบัคเก็ตของคุณจะยังคงถูกเก็บไว้ การสำรองข้อมูลในอนาคตจะถูกเขียนไปยังที่เก็บข้อมูลเริ่มต้นของเราแทน

#### Security {#security}

* รหัสประจำตัวและรหัสลับการเข้าถึงของคุณจะถูก **เข้ารหัสขณะพัก** โดยใช้ [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) ก่อนเก็บในฐานข้อมูลของเรา และจะถูกถอดรหัสเฉพาะเมื่อทำงานสำรองข้อมูลเท่านั้น
* เราจะตรวจสอบโดยอัตโนมัติว่าบัคเก็ตของคุณ **ไม่สามารถเข้าถึงได้สาธารณะ** หากตรวจพบบัคเก็ตสาธารณะ การตั้งค่าจะถูกปฏิเสธเมื่อบันทึก หากตรวจพบการเข้าถึงสาธารณะในเวลาสำรองข้อมูล เราจะเปลี่ยนไปใช้ที่เก็บข้อมูลเริ่มต้นและแจ้งผู้ดูแลโดเมนทั้งหมดทางอีเมล
* ข้อมูลรับรองจะถูกตรวจสอบเมื่อบันทึกผ่านการเรียก [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) เพื่อยืนยันว่าบัคเก็ตมีอยู่และข้อมูลรับรองถูกต้อง หากการตรวจสอบล้มเหลว ที่เก็บข้อมูล S3 แบบกำหนดเองจะถูกปิดใช้งานโดยอัตโนมัติ
* ไฟล์สำรองข้อมูลแต่ละไฟล์จะมีค่าแฮช SHA-256 ในเมตาดาต้าของ S3 ซึ่งใช้ตรวจจับฐานข้อมูลที่ไม่เปลี่ยนแปลงและข้ามการอัปโหลดซ้ำซ้อน
#### การแจ้งเตือนข้อผิดพลาด {#error-notifications}

หากการสำรองข้อมูลล้มเหลวเมื่อใช้ที่เก็บข้อมูล S3 แบบกำหนดเองของคุณ (เช่น เนื่องจากข้อมูลรับรองหมดอายุหรือปัญหาการเชื่อมต่อ) ผู้ดูแลโดเมนทั้งหมดจะได้รับการแจ้งเตือนทางอีเมล การแจ้งเตือนเหล่านี้จะถูกจำกัดความถี่ไม่เกินครั้งละ 6 ชั่วโมงเพื่อป้องกันการแจ้งเตือนซ้ำ หากตรวจพบว่าบัคเก็ตของคุณสามารถเข้าถึงได้สาธารณะในเวลาสำรองข้อมูล ผู้ดูแลระบบจะได้รับการแจ้งเตือนวันละครั้ง

#### API {#api}

คุณยังสามารถกำหนดค่าที่เก็บข้อมูล S3 แบบกำหนดเองผ่าน API ได้:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

เพื่อทดสอบการเชื่อมต่อผ่าน API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### ฉันจะแปลงการสำรองข้อมูล SQLite เป็นไฟล์ EML ได้อย่างไร {#how-do-i-convert-sqlite-backups-to-eml-files}

หากคุณดาวน์โหลดหรือเก็บการสำรองข้อมูล SQLite (ไม่ว่าจะจากที่เก็บข้อมูลเริ่มต้นของเราหรือ [บัคเก็ต S3 แบบกำหนดเองของคุณ](#how-do-i-use-my-own-s3-compatible-storage-for-backups)) คุณสามารถแปลงเป็นไฟล์ `.eml` มาตรฐานโดยใช้เครื่องมือ CLI แบบสแตนด์อโลนของเรา **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)** ไฟล์ EML สามารถเปิดด้วยโปรแกรมรับส่งอีเมลใดก็ได้ ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) เป็นต้น) หรือสามารถนำเข้าไปยังเซิร์ฟเวอร์อีเมลอื่น ๆ ได้

#### การติดตั้ง {#installation-1}

คุณสามารถดาวน์โหลดไบนารีที่สร้างไว้ล่วงหน้า (ไม่ต้องใช้ [Node.js](https://github.com/nodejs/node)) หรือรันโดยตรงด้วย [Node.js](https://github.com/nodejs/node):

**ไบนารีที่สร้างไว้ล่วงหน้า** — ดาวน์โหลดเวอร์ชันล่าสุดสำหรับแพลตฟอร์มของคุณจาก [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| แพลตฟอร์ม | สถาปัตยกรรม  | ไฟล์                                 |
| -------- | ------------- | ------------------------------------ |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **ผู้ใช้ macOS:** หลังดาวน์โหลด คุณอาจต้องลบแอตทริบิวต์กักกันก่อนรันไบนารี:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (แทนที่ `./convert-sqlite-to-eml-darwin-arm64` ด้วยเส้นทางจริงของไฟล์ที่ดาวน์โหลด)

> **ผู้ใช้ Linux:** หลังดาวน์โหลด คุณอาจต้องตั้งค่าให้ไบนารีสามารถรันได้:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (แทนที่ `./convert-sqlite-to-eml-linux-x64` ด้วยเส้นทางจริงของไฟล์ที่ดาวน์โหลด)

**จากซอร์สโค้ด** (ต้องใช้ [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### การใช้งาน {#usage}

เครื่องมือนี้รองรับทั้งโหมดโต้ตอบและไม่โต้ตอบ

**โหมดโต้ตอบ** — รันโดยไม่ต้องใส่อาร์กิวเมนต์ แล้วคุณจะถูกถามข้อมูลทั้งหมด:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - แปลงการสำรองข้อมูล SQLite เป็น EML
  =============================================

  เส้นทางไปยังไฟล์สำรอง SQLite: /path/to/backup.sqlite
  รหัสผ่าน IMAP/อาลิอัส: ********
  เส้นทางไฟล์ ZIP ผลลัพธ์ [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**โหมดไม่โต้ตอบ** — ส่งอาร์กิวเมนต์ผ่านแฟล็กบรรทัดคำสั่งสำหรับการเขียนสคริปต์และอัตโนมัติ:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| แฟล็ก                | คำอธิบาย                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| `--path <path>`     | เส้นทางไปยังไฟล์สำรองข้อมูล SQLite ที่เข้ารหัส                                  |
| `--password <pass>` | รหัสผ่าน IMAP/อาลิอัสสำหรับถอดรหัส                                           |
| `--output <path>`   | เส้นทางไฟล์ ZIP ผลลัพธ์ (ค่าเริ่มต้น: สร้างอัตโนมัติพร้อมเวลาตามมาตรฐาน ISO 8601) |
| `--help`            | แสดงข้อความช่วยเหลือ                                                        |
#### Output Format {#output-format}

เครื่องมือนี้สร้างไฟล์ ZIP ที่ป้องกันด้วยรหัสผ่าน (เข้ารหัสด้วย AES-256) ซึ่งประกอบด้วย:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

ไฟล์ EML จะถูกจัดเรียงตามโฟลเดอร์กล่องจดหมาย รหัสผ่าน ZIP จะเหมือนกับรหัสผ่าน IMAP/อีเมลแฝงของคุณ ไฟล์ `.eml` แต่ละไฟล์เป็นข้อความอีเมลมาตรฐานตาม [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) ที่มีหัวเรื่องครบถ้วน ข้อความในตัว และไฟล์แนบที่สร้างขึ้นใหม่จากฐานข้อมูล SQLite

#### How It Works {#how-it-works}

1. เปิดฐานข้อมูล SQLite ที่เข้ารหัสโดยใช้รหัสผ่าน IMAP/อีเมลแฝงของคุณ (รองรับทั้งการเข้ารหัส [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) และ [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard))
2. อ่านตาราง Mailboxes เพื่อค้นหาโครงสร้างโฟลเดอร์
3. สำหรับแต่ละข้อความ ถอดรหัส mimeTree (เก็บเป็น JSON ที่บีบอัดด้วย [Brotli](https://github.com/google/brotli)) จากตาราง Messages
4. สร้างไฟล์ EML เต็มรูปแบบโดยเดินตามโครงสร้าง MIME และดึงเนื้อหาไฟล์แนบจากตาราง Attachments
5. บรรจุทุกอย่างลงในไฟล์ ZIP ที่ป้องกันด้วยรหัสผ่านโดยใช้ [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted)

### Do you support self-hosting {#do-you-support-self-hosting}

ใช่ ตั้งแต่เดือนมีนาคม 2025 เรารองรับตัวเลือกการโฮสต์ด้วยตนเอง อ่านบล็อกได้ที่ [นี่](https://forwardemail.net/blog/docs/self-hosted-solution) ดูคู่มือ [self-hosted guide](https://forwardemail.net/self-hosted) เพื่อเริ่มต้น และสำหรับผู้ที่สนใจเวอร์ชันที่แยกขั้นตอนอย่างละเอียด ดูคู่มือของเราแบบ [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) หรือ [Debian](https://forwardemail.net/guides/selfhosted-on-debian)

## Email Configuration {#email-configuration}

### How do I get started and set up email forwarding {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">เวลาที่คาดว่าจะใช้ในการตั้งค่า:</strong>
  <span>น้อยกว่า 10 นาที</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    เริ่มต้นใช้งาน:
  </strong>
  <span>
    โปรดอ่านและปฏิบัติตามขั้นตอนตั้งแต่หนึ่งถึงแปดอย่างระมัดระวัง อย่าลืมเปลี่ยนที่อยู่อีเมล <code>user@gmail.com</code> เป็นที่อยู่อีเมลที่คุณต้องการส่งต่ออีเมลไป (ถ้ายังไม่ถูกต้อง) และเปลี่ยน <code>example.com</code> เป็นชื่อโดเมนของคุณเอง (ถ้ายังไม่ถูกต้อง)
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">ถ้าคุณได้ลงทะเบียนชื่อโดเมนของคุณที่ไหนสักแห่งแล้ว ให้ข้ามขั้นตอนนี้ไปเลยและไปที่ขั้นตอนที่สอง! มิฉะนั้นคุณสามารถ <a href="/domain-registration" rel="noopener noreferrer">คลิกที่นี่เพื่อลงทะเบียนชื่อโดเมนของคุณ</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  คุณจำได้ไหมว่าลงทะเบียนโดเมนของคุณที่ไหน? เมื่อคุณจำได้แล้ว ให้ทำตามคำแนะนำด้านล่างนี้:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    คุณต้องเปิดแท็บใหม่และเข้าสู่ระบบผู้ลงทะเบียนโดเมนของคุณ คุณสามารถคลิกที่ "Registrar" ด้านล่างเพื่อทำสิ่งนี้โดยอัตโนมัติ ในแท็บใหม่นี้ คุณต้องไปที่หน้าการจัดการ DNS ที่ผู้ลงทะเบียนของคุณ &ndash; และเราได้จัดเตรียมขั้นตอนการนำทางทีละขั้นตอนไว้ในคอลัมน์ "Steps to Configure" ด้านล่าง เมื่อคุณไปถึงหน้านี้ในแท็บใหม่แล้ว คุณสามารถกลับมาที่แท็บนี้และดำเนินการต่อที่ขั้นตอนที่สามด้านล่าง
    <strong class="font-weight-bold">อย่าปิดแท็บที่เปิดไว้ตอนนี้; คุณจะต้องใช้ในขั้นตอนถัดไป!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ผู้ลงทะเบียน</th>
      <th>ขั้นตอนการตั้งค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> ศูนย์โดเมน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> แก้ไขการตั้งค่า DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> My Servers <i class="fa fa-angle-right"></i> การจัดการโดเมน <i class="fa fa-angle-right"></i> ตัวจัดการ DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>สำหรับ ROCK: เข้าสู่ระบบ <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (คลิกไอคอน ▼ ข้างจัดการ) <i class="fa fa-angle-right"></i> DNS
      <br />
      สำหรับ LEGACY: เข้าสู่ระบบ <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Zone editor <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> จัดการ</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> เครือข่าย <i class="fa fa-angle-right"></i> โดเมน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> เพิ่มเติม <i class="fa fa-angle-right"></i> จัดการโดเมน</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> ในมุมมองการ์ด คลิกจัดการโดเมนของคุณ <i class="fa fa-angle-right"></i> ในมุมมองรายการ คลิกไอคอนฟันเฟือง <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> บันทึก DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> ดู</a>
      </td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> จัดการ <i class="fa fa-angle-right"></i> (คลิกไอคอนฟันเฟือง) <i class="fa fa-angle-right"></i> คลิกที่ DNS &amp; Nameservers ในเมนูด้านซ้าย</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> แผงควบคุม <i class="fa fa-angle-right"></i> โดเมน <i class="fa fa-angle-right"></i> จัดการโดเมน <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> ภาพรวม <i class="fa fa-angle-right"></i> จัดการ <i class="fa fa-angle-right"></i> ตัวแก้ไขง่าย <i class="fa fa-angle-right"></i> บันทึก</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> การจัดการ <i class="fa fa-angle-right"></i> แก้ไขโซน</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> ดู</a>
      </td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> จัดการโดเมนของฉัน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> จัดการ DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> ดู</a>
      </td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> ตั้งค่า DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> ดู</a>
      </td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> รายการโดเมน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> จัดการ <i class="fa fa-angle-right"></i> DNS ขั้นสูง</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> ตั้งค่า Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> ผู้จัดการบัญชี <i class="fa fa-angle-right"></i> ชื่อโดเมนของฉัน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> จัดการ <i class="fa fa-angle-right"></i> เปลี่ยนที่อยู่โดเมน <i class="fa fa-angle-right"></i> DNS ขั้นสูง</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> ดู</a>
      </td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> โดเมนที่จัดการ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> การตั้งค่า DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> เมนูหน้าแรก <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> โดเมน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i>
การตั้งค่าขั้นสูง <i class="fa fa-angle-right"></i> บันทึกที่กำหนดเอง</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>ใช้คำสั่ง "now" CLI <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> หน้าโดเมน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> หน้าโดเมน <i class="fa fa-angle-right"></i> (คลิกไอคอน <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> เลือกจัดการบันทึก DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> โดเมน <i class="fa fa-angle-right"></i> โดเมนของฉัน</td>
    </tr>
    <tr>
      <td>อื่น ๆ</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">สำคัญ:</strong> ไม่เห็นชื่อผู้ลงทะเบียนของคุณในรายการนี้หรือ? เพียงค้นหาในอินเทอร์เน็ตด้วยคำว่า "วิธีเปลี่ยนบันทึก DNS บน $REGISTRAR" (แทนที่ $REGISTRAR ด้วยชื่อผู้ลงทะเบียนของคุณ เช่น "วิธีเปลี่ยนบันทึก DNS บน GoDaddy" หากคุณใช้ GoDaddy)</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">ใช้หน้าการจัดการ DNS ของผู้ลงทะเบียนของคุณ (แท็บอื่นที่คุณเปิดไว้) ตั้งค่าบันทึก "MX" ดังต่อไปนี้:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    โปรดทราบว่าจะต้องไม่มีระเบียน MX อื่นใดถูกตั้งค่าไว้ ทั้งสองระเบียนที่แสดงด้านล่างต้องมีอยู่แน่นอน ตรวจสอบให้แน่ใจว่าไม่มีการพิมพ์ผิด และคุณสะกด mx1 และ mx2 ถูกต้อง หากมีระเบียน MX อยู่แล้ว กรุณาลบออกให้หมด
    ค่า "TTL" ไม่จำเป็นต้องเป็น 3600 อาจเป็นค่าน้อยกว่าหรือมากกว่านี้ได้ตามความจำเป็น
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Priority</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">ใช้หน้าการจัดการ DNS ของผู้ลงทะเบียนโดเมนของคุณ (แท็บอื่นที่คุณเปิดอยู่) ตั้งค่าระเบียน <strong class="notranslate">TXT</strong> ดังต่อไปนี้:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    หากคุณใช้แผนบริการแบบชำระเงิน คุณต้องข้ามขั้นตอนนี้ไปอย่างสมบูรณ์และไปที่ขั้นตอนที่ห้า! หากคุณไม่ได้ใช้แผนบริการแบบชำระเงิน ที่อยู่อีเมลที่ถูกส่งต่อจะสามารถค้นหาได้สาธารณะ – ไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> และอัปเกรดโดเมนของคุณเป็นแผนบริการแบบชำระเงินหากต้องการ หากคุณต้องการเรียนรู้เพิ่มเติมเกี่ยวกับแผนบริการแบบชำระเงิน ดูที่หน้า <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">ราคาค่าบริการ</a> ของเรา มิฉะนั้นคุณสามารถเลือกหนึ่งหรือหลายตัวเลือกจากตัวเลือก A ถึงตัวเลือก F ที่ระบุด้านล่างได้
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ตัวเลือก A:
  </strong>
  <span>
    หากคุณกำลังส่งต่ออีเมลทั้งหมดจากโดเมนของคุณ (เช่น "all@example.com", "hello@example.com" เป็นต้น) ไปยังที่อยู่อีเมลเฉพาะ "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
  <span>
    โปรดตรวจสอบให้แน่ใจว่าได้แทนที่ค่าด้านบนในคอลัมน์ "ค่า" ด้วยที่อยู่อีเมลของคุณเอง ค่า "TTL" ไม่จำเป็นต้องเป็น 3600 อาจเป็นค่าน้อยกว่าหรือมากกว่านี้ได้ตามความจำเป็น ค่า TTL ที่ต่ำกว่าจะช่วยให้การเปลี่ยนแปลงในระเบียน DNS ของคุณถูกเผยแพร่ไปทั่วอินเทอร์เน็ตได้เร็วขึ้น – คิดว่านี่คือระยะเวลาที่จะถูกเก็บไว้ในแคชหน่วยความจำ (วินาที) คุณสามารถเรียนรู้เพิ่มเติมเกี่ยวกับ <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL บนวิกิพีเดีย</a>
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ตัวเลือก B:
  </strong>
  <span>
    หากคุณต้องการส่งต่อเพียงที่อยู่อีเมลเดียว (เช่น <code>hello@example.com</code> ไปยัง <code>user@gmail.com</code>; ซึ่งจะส่งต่อ "hello+test@example.com" ไปยัง "user+test@gmail.com" โดยอัตโนมัติด้วย):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ตัวเลือก C:
  </strong>
  <span>
    หากคุณกำลังส่งต่ออีเมลหลายฉบับ คุณจะต้องแยกพวกมันด้วยเครื่องหมายจุลภาค:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ตัวเลือก D:
  </strong>
  <span>
    คุณสามารถตั้งค่าการส่งต่ออีเมลได้ไม่จำกัดจำนวน – เพียงแค่แน่ใจว่าแต่ละบรรทัดไม่เกิน 255 ตัวอักษร และเริ่มต้นแต่ละบรรทัดด้วย "forward-email=" ตัวอย่างดังต่อไปนี้:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ตัวเลือก E:
  </strong>
  <span>
    คุณยังสามารถระบุชื่อโดเมนในระเบียน <strong class="notranslate">TXT</strong> ของคุณเพื่อให้มีการส่งต่ออีเมลแบบนามแฝงทั่วโลก (เช่น "user@example.com" จะถูกส่งต่อไปยัง "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=example.net</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ตัวเลือก F:
  </strong>
  <span>
    คุณยังสามารถใช้เว็บฮุคเป็นนามแฝงทั่วโลกหรือรายบุคคลเพื่อส่งต่ออีเมลได้ ดูตัวอย่างและส่วนเต็มเกี่ยวกับเว็บฮุคในหัวข้อ <a href="#do-you-support-webhooks" class="alert-link">คุณรองรับเว็บฮุคหรือไม่</a> ด้านล่าง
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ตัวเลือก G:
  </strong>
  <span>
    คุณสามารถใช้ regular expressions ("regex") สำหรับจับคู่กับนามแฝงและจัดการการแทนที่เพื่อส่งต่ออีเมลได้ ดูตัวอย่างและส่วนเต็มเกี่ยวกับ regex ชื่อ <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">คุณรองรับ regular expressions หรือ regex หรือไม่</a> ด้านล่าง
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>ต้องการ regex ขั้นสูงพร้อมการแทนที่หรือไม่?</strong> ดูตัวอย่างและส่วนเต็มเกี่ยวกับ regex ชื่อ <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">คุณรองรับ regular expressions หรือ regex หรือไม่</a> ด้านล่าง
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>ตัวอย่างง่าย:</strong> หากฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `linus@example.com` หรือ `torvalds@example.com` ส่งต่อไปยัง `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    กฎการส่งต่อแบบ catch-all อาจอธิบายได้ว่าเป็น "fall-through"
    หมายความว่าอีเมลที่เข้ามาซึ่งตรงกับกฎการส่งต่อเฉพาะอย่างน้อยหนึ่งข้อจะถูกใช้แทน catch-all
    กฎเฉพาะรวมถึงที่อยู่อีเมลและ regular expressions
    <br /><br />
    ตัวอย่าง:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    อีเมลที่ส่งไปยัง <code>hello@example.com</code> จะ **ไม่** ถูกส่งต่อไปยัง <code>second@gmail.com</code> (catch-all) ด้วยการตั้งค่านี้ และจะถูกส่งไปยัง <code>first@gmail.com</code> เท่านั้น
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">ใช้หน้าการจัดการ DNS ของผู้ให้บริการจดทะเบียนของคุณ (แท็บอื่นที่คุณเปิดอยู่) เพิ่มเติมตั้งค่าบันทึก <strong class="notranslate">TXT</strong> ดังต่อไปนี้:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    หากคุณใช้ Gmail (เช่น ส่งอีเมลในนาม) หรือ G Suite คุณจะต้องเพิ่ม <code>include:_spf.google.com</code> ลงในค่าข้างต้น เช่น:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
  <span>
    หากคุณมีบรรทัดที่คล้ายกันที่มี "v=spf1" อยู่แล้ว คุณจะต้องเพิ่ม <code>include:spf.forwardemail.net</code> ก่อนบันทึก "include:host.com" ที่มีอยู่และก่อน "-all" ในบรรทัดเดียวกัน เช่น:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    โปรดทราบว่ามีความแตกต่างระหว่าง "-all" และ "~all" เครื่องหมาย "-" หมายความว่าการตรวจสอบ SPF จะล้มเหลวหากไม่ตรงกัน และ "~" หมายความว่าการตรวจสอบ SPF จะล้มเหลวแบบนุ่มนวล เราแนะนำให้ใช้วิธี "-all" เพื่อป้องกันการปลอมแปลงโดเมน
    <br /><br />
    คุณอาจต้องรวมบันทึก SPF สำหรับโฮสต์ที่คุณส่งอีเมลจาก (เช่น Outlook) ด้วย
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">ตรวจสอบระเบียน DNS ของคุณโดยใช้เครื่องมือ "Verify Records" ของเราที่มีให้ที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า

</li><li class="mb-2 mb-md-3 mb-lg-5">ส่งอีเมลทดสอบเพื่อยืนยันว่าทำงานได้ โปรดทราบว่าอาจใช้เวลาสักครู่สำหรับระเบียน DNS ของคุณในการแพร่กระจาย

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
  <span>
  </span>
    หากคุณไม่ได้รับอีเมลทดสอบ หรือได้รับอีเมลทดสอบที่ระบุว่า "ระวังข้อความนี้" ให้ดูคำตอบสำหรับ <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">ทำไมฉันถึงไม่ได้รับอีเมลทดสอบของฉัน</a> และ <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">ทำไมอีเมลทดสอบที่ส่งถึงตัวเองใน Gmail ถึงแสดงว่า "น่าสงสัย"</a> ตามลำดับ
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">หากคุณต้องการ "ส่งอีเมลในนาม" จาก Gmail คุณจะต้อง <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">ดูวิดีโอนี้</a></strong> หรือทำตามขั้นตอนในหัวข้อ <a href="#how-to-send-mail-as-using-gmail">วิธีส่งอีเมลในนามโดยใช้ Gmail</a> ด้านล่าง

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ขอแสดงความยินดี!
    </strong>
    <span>
      คุณได้ทำขั้นตอนทั้งหมดเสร็จสมบูรณ์เรียบร้อยแล้ว
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
  <span>
    ส่วนเสริมที่เป็นทางเลือกมีระบุไว้ด้านล่าง โปรดทราบว่าส่วนเสริมเหล่านี้เป็นทางเลือกทั้งหมดและอาจไม่จำเป็น เราต้องการอย่างน้อยให้ข้อมูลเพิ่มเติมแก่คุณหากจำเป็น
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ส่วนเสริมทางเลือก:
  </strong>
  <span>
    หากคุณกำลังใช้ฟีเจอร์ <a class="alert-link" href="#how-to-send-mail-as-using-gmail">วิธีส่งอีเมลในนามโดยใช้ Gmail</a> คุณอาจต้องการเพิ่มตัวเองในรายการอนุญาต ดู <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">คำแนะนำเหล่านี้โดย Gmail</a> ในหัวข้อนี้
  </span>
</div>

### ฉันสามารถใช้ MX exchange และเซิร์ฟเวอร์หลายตัวสำหรับการส่งต่อขั้นสูงได้หรือไม่ {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

ได้ แต่ **คุณควรมี MX exchange เพียงตัวเดียวที่ระบุในระเบียน DNS ของคุณ**

อย่าพยายามใช้ "Priority" เป็นวิธีการตั้งค่า MX exchange หลายตัว

แทนที่จะเป็นเช่นนั้น คุณต้องตั้งค่า MX exchange ที่มีอยู่ของคุณให้ส่งต่ออีเมลสำหรับนามแฝงที่ไม่ตรงกับทั้งหมดไปยัง MX exchange ของบริการของเรา (`mx1.forwardemail.net` และ/หรือ `mx2.forwardemail.net`)

หากคุณใช้ Google Workspace และต้องการส่งต่ออีเมลสำหรับนามแฝงที่ไม่ตรงกับทั้งหมดไปยังบริการของเรา ให้ดูที่ <https://support.google.com/a/answer/6297084>

หากคุณใช้ Microsoft 365 (Outlook) และต้องการส่งต่ออีเมลสำหรับนามแฝงที่ไม่ตรงกับทั้งหมดไปยังบริการของเรา ให้ดูที่ <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> และ <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>

### ฉันจะตั้งค่าตอบกลับอัตโนมัติช่วงวันหยุด (vacation responder) ได้อย่างไร {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง และสร้างหรือตั้งค่านามแฝงที่คุณต้องการตั้งค่าตอบกลับอัตโนมัติช่วงวันหยุดสำหรับนามแฝงนั้น
คุณสามารถกำหนดวันที่เริ่มต้น วันที่สิ้นสุด หัวเรื่อง และข้อความ รวมถึงเปิดหรือปิดใช้งานได้ตลอดเวลา:

* ขณะนี้รองรับหัวเรื่องและข้อความแบบข้อความธรรมดา (เราใช้แพ็กเกจ `striptags` ภายในเพื่อลบ HTML ใด ๆ)
* หัวเรื่องจำกัดที่ 100 ตัวอักษร
* ข้อความจำกัดที่ 1000 ตัวอักษร
* การตั้งค่าต้องการการกำหนดค่า Outbound SMTP (เช่น คุณจะต้องตั้งค่า DKIM, DMARC และระเบียน DNS Return-Path)
  * ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> การกำหนดค่า Outbound SMTP และทำตามคำแนะนำการตั้งค่า
* ไม่สามารถเปิดใช้งานตัวตอบกลับวันหยุดสำหรับชื่อโดเมนแวนิตี้ทั่วโลก (เช่น [ที่อยู่อีเมลใช้ครั้งเดียว](/disposable-addresses) ไม่ได้รับการสนับสนุน)
* ไม่สามารถเปิดใช้งานตัวตอบกลับวันหยุดสำหรับนามแฝงที่มี wildcard/catch-all (`*`) หรือ regular expressions

แตกต่างจากระบบอีเมลเช่น `postfix` (เช่น ที่ใช้ส่วนขยายตัวกรองวันหยุด `sieve`) – Forward Email จะเพิ่มลายเซ็น DKIM ของคุณโดยอัตโนมัติ ป้องกันปัญหาการเชื่อมต่อเมื่อส่งข้อความตอบกลับวันหยุด (เช่น เนื่องจากปัญหาการเชื่อมต่อ SSL/TLS ทั่วไปและเซิร์ฟเวอร์ที่ดูแลรักษาแบบเก่า) และยังรองรับ Open WKD และการเข้ารหัส PGP สำหรับข้อความตอบกลับวันหยุดด้วย

<!--
* เพื่อป้องกันการใช้งานในทางที่ผิด จะมีการหักเครดิต SMTP ขาออก 1 เครดิตสำหรับแต่ละข้อความตอบกลับวันหยุดที่ส่งออก
  * บัญชีที่ชำระเงินทั้งหมดจะได้รับเครดิต 300 เครดิตต่อวันโดยค่าเริ่มต้น หากคุณต้องการจำนวนมากขึ้น กรุณาติดต่อเรา
-->

1. เราส่งเพียงครั้งเดียวต่อผู้ส่งที่ [อนุญาต](#do-you-have-an-allowlist) ทุก 4 วัน (ซึ่งคล้ายกับพฤติกรรมของ Gmail)

   * แคช Redis ของเราใช้ลายนิ้วมือของ `alias_id` และ `sender` โดยที่ `alias_id` คือ ID นามแฝงใน MongoDB และ `sender` คือที่อยู่อีเมล From (ถ้าอนุญาต) หรือโดเมนรากในที่อยู่อีเมล From (ถ้าไม่อนุญาต) เพื่อความง่าย ลายนิ้วมือนี้ในแคชจะหมดอายุใน 4 วัน

   * วิธีการของเราในการใช้โดเมนรากที่แยกวิเคราะห์จากที่อยู่อีเมล From สำหรับผู้ส่งที่ไม่ได้รับอนุญาตช่วยป้องกันการใช้งานในทางที่ผิดจากผู้ส่งที่ไม่ค่อยรู้จัก (เช่น ผู้ประสงค์ร้าย) ที่ส่งข้อความตอบกลับวันหยุดจำนวนมาก

2. เราส่งเฉพาะเมื่อ MAIL FROM และ/หรือ From ไม่ว่างเปล่าและไม่มี (ไม่สนใจตัวพิมพ์) [ชื่อผู้ใช้ postmaster](#what-are-postmaster-addresses) (ส่วนก่อนเครื่องหมาย @ ในอีเมล)

3. เราไม่ส่งถ้าข้อความต้นฉบับมีหัวข้อใด ๆ ต่อไปนี้ (ไม่สนใจตัวพิมพ์):

   * หัวข้อ `auto-submitted` ที่มีค่าไม่เท่ากับ `no`
   * หัวข้อ `x-auto-response-suppress` ที่มีค่าเป็น `dr`, `autoreply`, `auto-reply`, `auto_reply` หรือ `all`
   * หัวข้อ `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` หรือ `x-auto-respond` (ไม่สนใจค่า)
   * หัวข้อ `precedence` ที่มีค่าเป็น `bulk`, `autoreply`, `auto-reply`, `auto_reply` หรือ `list`

4. เราไม่ส่งถ้าที่อยู่อีเมล MAIL FROM หรือ From ลงท้ายด้วย `+donotreply`, `-donotreply`, `+noreply` หรือ `-noreply`

5. เราไม่ส่งถ้าส่วนชื่อผู้ใช้ของที่อยู่อีเมล From คือ `mdaemon` และมีหัวข้อ `X-MDDSN-Message` (ไม่สนใจตัวพิมพ์)

6. เราไม่ส่งถ้ามีหัวข้อ `content-type` เป็น `multipart/report` (ไม่สนใจตัวพิมพ์)

### ฉันจะตั้งค่า SPF สำหรับ Forward Email ได้อย่างไร {#how-do-i-set-up-spf-for-forward-email}

โดยใช้หน้าการจัดการ DNS ของผู้ลงทะเบียนโดเมนของคุณ ให้ตั้งค่าระเบียน <strong class="notranslate">TXT</strong> ดังนี้:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    หากคุณใช้ Gmail (เช่น ส่งอีเมลในนาม) หรือ G Suite คุณจะต้องเพิ่ม <code>include:_spf.google.com</code> ต่อท้ายค่าข้างต้น เช่น:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    หากคุณใช้ Microsoft Outlook หรือ Live.com คุณจะต้องเพิ่ม <code>include:spf.protection.outlook.com</code> ลงในระเบียน SPF <strong class="notranslate">TXT</strong> ของคุณ เช่น:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
  <span>
    หากคุณมีบรรทัดที่คล้ายกันที่มี "v=spf1" อยู่แล้ว คุณจะต้องเพิ่ม <code>include:spf.forwardemail.net</code> ก่อนระเบียน "include:host.com" ที่มีอยู่และก่อน "-all" ในบรรทัดเดียวกัน เช่น:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    โปรดทราบว่ามีความแตกต่างระหว่าง "-all" และ "~all" เครื่องหมาย "-" หมายความว่าการตรวจสอบ SPF ควรล้มเหลวหากไม่ตรงกัน และ "~" หมายความว่าการตรวจสอบ SPF ควรล้มเหลวแบบนุ่มนวล เราแนะนำให้ใช้วิธี "-all" เพื่อป้องกันการปลอมแปลงโดเมน
    <br /><br />
    คุณอาจจำเป็นต้องรวมระเบียน SPF สำหรับโฮสต์ที่คุณส่งอีเมลจาก (เช่น Outlook) ด้วย
  </span>
</div>

### วิธีตั้งค่า DKIM สำหรับ Forward Email {#how-do-i-set-up-dkim-for-forward-email}

ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> การกำหนดค่า SMTP ขาออก และทำตามคำแนะนำการตั้งค่า

### วิธีตั้งค่า DMARC สำหรับ Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> การกำหนดค่า SMTP ขาออก และทำตามคำแนะนำการตั้งค่า

### วิธีดูรายงาน DMARC {#how-do-i-view-dmarc-reports}

Forward Email มีแดชบอร์ดรายงาน DMARC ที่ครอบคลุมซึ่งช่วยให้คุณติดตามประสิทธิภาพการตรวจสอบสิทธิ์อีเมลของคุณในทุกโดเมนจากอินเทอร์เฟซเดียว

**รายงาน DMARC คืออะไร?**

รายงาน DMARC (Domain-based Message Authentication, Reporting, and Conformance) เป็นไฟล์ XML ที่ส่งโดยเซิร์ฟเวอร์รับอีเมลซึ่งแจ้งให้คุณทราบว่าอีเมลของคุณได้รับการตรวจสอบสิทธิ์อย่างไร รายงานเหล่านี้ช่วยให้คุณเข้าใจ:

* จำนวนอีเมลที่ส่งจากโดเมนของคุณ
* ว่าอีเมลเหล่านั้นผ่านการตรวจสอบ SPF และ DKIM หรือไม่
* การดำเนินการที่เซิร์ฟเวอร์รับทำ (ยอมรับ, กักกัน, หรือปฏิเสธ)
* ที่อยู่ IP ใดที่ส่งอีเมลในนามของโดเมนของคุณ

**วิธีเข้าถึงรายงาน DMARC**

ไปที่ <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> รายงาน DMARC</a> เพื่อดูแดชบอร์ดของคุณ คุณยังสามารถเข้าถึงรายงานเฉพาะโดเมนได้จาก <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> โดยคลิกปุ่ม "DMARC" ข้างโดเมนใดก็ได้

**คุณสมบัติของแดชบอร์ด**

แดชบอร์ดรายงาน DMARC มี:

* **สรุปเมตริก**: จำนวนรายงานที่ได้รับ, จำนวนข้อความที่วิเคราะห์, อัตราการจัดตำแหน่ง SPF, อัตราการจัดตำแหน่ง DKIM, และอัตราการผ่านโดยรวม
* **กราฟข้อความตามเวลา**: แนวโน้มปริมาณอีเมลและอัตราการตรวจสอบสิทธิ์ใน 30 วันที่ผ่านมา
* **สรุปการจัดตำแหน่ง**: กราฟโดนัทแสดงการแจกแจงการจัดตำแหน่ง SPF กับ DKIM
* **การจัดการข้อความ**: กราฟแท่งซ้อนแสดงวิธีที่เซิร์ฟเวอร์รับจัดการอีเมลของคุณ (ยอมรับ, กักกัน, หรือปฏิเสธ)
* **ตารางรายงานล่าสุด**: รายการรายละเอียดของรายงาน DMARC แต่ละฉบับพร้อมตัวกรองและการแบ่งหน้า
* **การกรองโดเมน**: กรองรายงานตามโดเมนเฉพาะเมื่อจัดการหลายโดเมน
**ทำไมเรื่องนี้ถึงสำคัญ**

สำหรับองค์กรที่จัดการหลายโดเมน (เช่น บริษัทขนาดใหญ่ องค์กรไม่แสวงหากำไร หรือเอเจนซี่) รายงาน DMARC มีความสำคัญสำหรับ:

* **ระบุผู้ส่งที่ไม่ได้รับอนุญาต**: ตรวจจับว่ามีใครปลอมแปลงโดเมนของคุณหรือไม่
* **ปรับปรุงการส่งอีเมลให้ถึงปลายทาง**: ทำให้อีเมลที่ถูกต้องผ่านการตรวจสอบการยืนยันตัวตน
* **ตรวจสอบโครงสร้างพื้นฐานอีเมล**: ติดตามบริการและ IP ที่ส่งอีเมลแทนคุณ
* **การปฏิบัติตามข้อกำหนด**: รักษาการมองเห็นการยืนยันตัวตนอีเมลสำหรับการตรวจสอบความปลอดภัย

แตกต่างจากบริการอื่นที่ต้องใช้เครื่องมือแยกสำหรับตรวจสอบ DMARC Forward Email รวมการประมวลผลและแสดงผลรายงาน DMARC เป็นส่วนหนึ่งของบัญชีของคุณโดยไม่มีค่าใช้จ่ายเพิ่มเติม

**ข้อกำหนด**

* รายงาน DMARC ใช้ได้เฉพาะแผนที่ชำระเงินเท่านั้น
* โดเมนของคุณต้องตั้งค่า DMARC แล้ว (ดู [วิธีตั้งค่า DMARC สำหรับ Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* รายงานจะถูกรวบรวมโดยอัตโนมัติเมื่อเซิร์ฟเวอร์รับส่งเมลส่งรายงานไปยังที่อยู่อีเมลรายงาน DMARC ที่คุณตั้งค่าไว้

**รายงานอีเมลรายสัปดาห์**

ผู้ใช้แผนชำระเงินจะได้รับสรุปรายงาน DMARC รายสัปดาห์ทางอีเมลโดยอัตโนมัติ อีเมลเหล่านี้ประกอบด้วย:

* สถิติสรุปสำหรับทุกโดเมนของคุณ
* อัตราการจัดตำแหน่ง SPF และ DKIM
* การแจกแจงสถานะข้อความ (ยอมรับ, กักกัน, ปฏิเสธ)
* องค์กรที่รายงานสูงสุด (Google, Microsoft, Yahoo ฯลฯ)
* ที่อยู่ IP ที่มีปัญหาการจัดตำแหน่งซึ่งอาจต้องได้รับการดูแล
* ลิงก์ตรงไปยังแดชบอร์ดรายงาน DMARC ของคุณ

รายงานรายสัปดาห์จะถูกส่งโดยอัตโนมัติและไม่สามารถปิดแยกจากการแจ้งเตือนอีเมลอื่น ๆ ได้

### วิธีเชื่อมต่อและตั้งค่าผู้ติดต่อของฉัน {#how-do-i-connect-and-configure-my-contacts}

**ในการตั้งค่าผู้ติดต่อของคุณ ให้ใช้ URL CardDAV:** `https://carddav.forwardemail.net` (หรือเพียง `carddav.forwardemail.net` หากไคลเอนต์ของคุณรองรับ)

### วิธีเชื่อมต่อและตั้งค่าปฏิทินของฉัน {#how-do-i-connect-and-configure-my-calendars}

**ในการตั้งค่าปฏิทินของคุณ ให้ใช้ URL CalDAV:** `https://caldav.forwardemail.net` (หรือเพียง `caldav.forwardemail.net` หากไคลเอนต์ของคุณรองรับ)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### วิธีเพิ่มปฏิทินเพิ่มเติมและจัดการปฏิทินที่มีอยู่ {#how-do-i-add-more-calendars-and-manage-existing-calendars}

หากคุณต้องการเพิ่มปฏิทินเพิ่มเติม ให้เพิ่ม URL ปฏิทินใหม่เป็น: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**อย่าลืมเปลี่ยน `calendar-name` เป็นชื่อปฏิทินที่คุณต้องการ**)

คุณสามารถเปลี่ยนชื่อและสีของปฏิทินหลังจากสร้างแล้วได้ – เพียงใช้แอปปฏิทินที่คุณชอบ (เช่น Apple Mail หรือ [Thunderbird](https://thunderbird.net))

### วิธีเชื่อมต่อและตั้งค่าภารกิจและการเตือนความจำ {#how-do-i-connect-and-configure-tasks-and-reminders}

**ในการตั้งค่าภารกิจและการเตือนความจำ ให้ใช้ URL CalDAV เดียวกับปฏิทิน:** `https://caldav.forwardemail.net` (หรือเพียง `caldav.forwardemail.net` หากไคลเอนต์ของคุณรองรับ)

ภารกิจและการเตือนความจำจะถูกแยกออกจากเหตุการณ์ปฏิทินโดยอัตโนมัติเป็นคอลเลกชันปฏิทิน "Reminders" หรือ "Tasks" ของตัวเอง

**คำแนะนำการตั้งค่าตามแพลตฟอร์ม:**

**macOS/iOS:**

1. เพิ่มบัญชี CalDAV ใหม่ใน System Preferences > Internet Accounts (หรือ Settings > Accounts บน iOS)
2. ใช้ `caldav.forwardemail.net` เป็นเซิร์ฟเวอร์
3. ใส่อีเมลแอลิอัส Forward Email และรหัสผ่านที่สร้างขึ้น
4. หลังตั้งค่าเสร็จ คุณจะเห็นทั้งคอลเลกชัน "Calendar" และ "Reminders"
5. ใช้แอป Reminders เพื่อสร้างและจัดการภารกิจ

**Android กับ Tasks.org:**

1. ติดตั้ง Tasks.org จาก Google Play Store หรือ F-Droid
2. ไปที่ Settings > Synchronization > Add Account > CalDAV
3. ใส่เซิร์ฟเวอร์: `https://caldav.forwardemail.net`
4. ใส่อีเมลแอลิอัส Forward Email และรหัสผ่านที่สร้างขึ้น
5. Tasks.org จะค้นหาปฏิทินภารกิจของคุณโดยอัตโนมัติ

**Thunderbird:**

1. ติดตั้ง Lightning add-on หากยังไม่ได้ติดตั้ง
2. สร้างปฏิทินใหม่โดยเลือกประเภท "CalDAV"
3. ใช้ URL: `https://caldav.forwardemail.net`
4. ใส่ข้อมูลรับรอง Forward Email ของคุณ
5. เหตุการณ์และภารกิจจะพร้อมใช้งานในอินเทอร์เฟซปฏิทิน

### ทำไมฉันถึงไม่สามารถสร้างภารกิจใน macOS Reminders ได้ {#why-cant-i-create-tasks-in-macos-reminders}
หากคุณประสบปัญหาในการสร้างงานใน macOS Reminders ให้ลองทำตามขั้นตอนแก้ไขปัญหาเหล่านี้:

1. **ตรวจสอบการตั้งค่าบัญชี**: ตรวจสอบให้แน่ใจว่าบัญชี CalDAV ของคุณถูกตั้งค่าอย่างถูกต้องกับ `caldav.forwardemail.net`

2. **ตรวจสอบปฏิทินแยกต่างหาก**: คุณควรเห็นทั้ง "Calendar" และ "Reminders" ในบัญชีของคุณ หากคุณเห็นแค่ "Calendar" เท่านั้น อาจหมายความว่าการสนับสนุนงานยังไม่ถูกเปิดใช้งานเต็มที่

3. **รีเฟรชบัญชี**: ลองลบบัญชี CalDAV แล้วเพิ่มใหม่ใน System Preferences > Internet Accounts

4. **ตรวจสอบการเชื่อมต่อเซิร์ฟเวอร์**: ทดสอบว่าคุณสามารถเข้าถึง `https://caldav.forwardemail.net` ในเบราว์เซอร์ของคุณได้

5. **ตรวจสอบข้อมูลรับรอง**: ตรวจสอบว่าคุณใช้ alias email และรหัสผ่านที่สร้างขึ้นเฉพาะ (ไม่ใช่รหัสผ่านบัญชีของคุณ)

6. **บังคับซิงค์**: ในแอป Reminders ให้ลองสร้างงานแล้วรีเฟรชการซิงค์ด้วยตนเอง

**ปัญหาที่พบบ่อย:**

* **"Reminders calendar not found"**: เซิร์ฟเวอร์อาจต้องใช้เวลาสักครู่ในการสร้างคอลเลกชัน Reminders เมื่อเข้าถึงครั้งแรก
* **งานไม่ซิงค์**: ตรวจสอบให้แน่ใจว่าอุปกรณ์ทั้งสองใช้ข้อมูลรับรองบัญชี CalDAV เดียวกัน
* **เนื้อหาผสมกัน**: ตรวจสอบให้งานถูกสร้างในปฏิทิน "Reminders" ไม่ใช่ "Calendar" ทั่วไป

### วิธีตั้งค่า Tasks.org บน Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org เป็นแอปจัดการงานโอเพนซอร์สยอดนิยมที่ทำงานได้ดีเยี่ยมกับการสนับสนุนงาน CalDAV ของ Forward Email

**การติดตั้งและตั้งค่า:**

1. **ติดตั้ง Tasks.org**:
   * จาก Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * จาก F-Droid: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **ตั้งค่าการซิงค์ CalDAV**:
   * เปิด Tasks.org
   * ไปที่ ☰ เมนู > การตั้งค่า > การซิงโครไนซ์
   * แตะ "เพิ่มบัญชี"
   * เลือก "CalDAV"

3. **กรอกการตั้งค่า Forward Email**:
   * **URL เซิร์ฟเวอร์**: `https://caldav.forwardemail.net`
   * **ชื่อผู้ใช้**: alias Forward Email ของคุณ (เช่น `you@yourdomain.com`)
   * **รหัสผ่าน**: รหัสผ่านที่สร้างเฉพาะสำหรับ alias ของคุณ
   * แตะ "เพิ่มบัญชี"

4. **ค้นหาบัญชี**:
   * Tasks.org จะค้นหาปฏิทินงานของคุณโดยอัตโนมัติ
   * คุณควรเห็นคอลเลกชัน "Reminders" ปรากฏขึ้น
   * แตะ "สมัครสมาชิก" เพื่อเปิดใช้งานการซิงค์สำหรับปฏิทินงาน

5. **ทดสอบการซิงค์**:
   * สร้างงานทดสอบใน Tasks.org
   * ตรวจสอบให้งานปรากฏในไคลเอนต์ CalDAV อื่นๆ (เช่น macOS Reminders)
   * ยืนยันว่าการเปลี่ยนแปลงซิงค์สองทาง

**ฟีเจอร์ที่มี:**

* ✅ การสร้างและแก้ไขงาน
* ✅ กำหนดวันครบกำหนดและการแจ้งเตือน
* ✅ การทำเครื่องหมายงานเสร็จและสถานะ
* ✅ ระดับความสำคัญ
* ✅ งานย่อยและลำดับชั้นของงาน
* ✅ แท็กและหมวดหมู่
* ✅ ซิงค์สองทางกับไคลเอนต์ CalDAV อื่นๆ

**การแก้ไขปัญหา:**

* หากไม่มีปฏิทินงานปรากฏ ลองรีเฟรชด้วยตนเองในการตั้งค่า Tasks.org
* ตรวจสอบว่าคุณมีงานอย่างน้อยหนึ่งงานที่สร้างบนเซิร์ฟเวอร์ (คุณสามารถสร้างใน macOS Reminders ก่อน)
* ตรวจสอบการเชื่อมต่อเครือข่ายไปยัง `caldav.forwardemail.net`

### วิธีตั้งค่า SRS สำหรับ Forward Email {#how-do-i-set-up-srs-for-forward-email}

เราจะตั้งค่า [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") ให้โดยอัตโนมัติ – คุณไม่จำเป็นต้องตั้งค่าเอง

### วิธีตั้งค่า MTA-STS สำหรับ Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

โปรดดูที่ [ส่วนของเราที่เกี่ยวกับ MTA-STS](#do-you-support-mta-sts) เพื่อข้อมูลเพิ่มเติม

### วิธีเพิ่มรูปโปรไฟล์ให้กับที่อยู่อีเมลของฉัน {#how-do-i-add-a-profile-picture-to-my-email-address}

หากคุณใช้ Gmail ให้ทำตามขั้นตอนด้านล่างนี้:

1. ไปที่ <https://google.com> และออกจากระบบอีเมลทั้งหมด
2. คลิก "Sign In" แล้วในเมนูดรอปดาวน์คลิก "other account"
3. เลือก "Use another account"
4. เลือก "Create account"
5. เลือก "Use my current email address instead"
6. กรอกที่อยู่อีเมลโดเมนของคุณเอง
7. รับอีเมลยืนยันที่ส่งไปยังที่อยู่อีเมลของคุณ
8. กรอกรหัสยืนยันจากอีเมลนี้
9. กรอกข้อมูลโปรไฟล์สำหรับบัญชี Google ใหม่ของคุณ
10. ยอมรับนโยบายความเป็นส่วนตัวและข้อกำหนดการใช้งานทั้งหมด
11. ไปที่ <https://google.com> และที่มุมขวาบน คลิกไอคอนโปรไฟล์ของคุณ แล้วคลิกปุ่ม "change"
12. อัปโหลดรูปภาพหรืออวาตาร์ใหม่สำหรับบัญชีของคุณ
13. การเปลี่ยนแปลงจะใช้เวลาประมาณ 1-2 ชั่วโมงในการเผยแพร่ แต่บางครั้งอาจเร็วมาก
14. ส่งอีเมลทดสอบและรูปโปรไฟล์ควรจะแสดงขึ้น
## คุณสมบัติขั้นสูง {#advanced-features}

### คุณรองรับจดหมายข่าวหรือรายชื่ออีเมลสำหรับการตลาดหรือไม่ {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

ใช่ คุณสามารถอ่านเพิ่มเติมได้ที่ <https://forwardemail.net/guides/newsletter-with-listmonk>.

โปรดทราบว่าเพื่อรักษาชื่อเสียงของ IP และเพื่อให้แน่ใจว่าสามารถส่งอีเมลได้ Forward Email มีขั้นตอนการตรวจสอบด้วยตนเองในแต่ละโดเมนสำหรับ **การอนุมัติจดหมายข่าว** ส่งอีเมลไปที่ <support@forwardemail.net> หรือเปิด [คำขอความช่วยเหลือ](https://forwardemail.net/help) เพื่อขออนุมัติ โดยปกติจะใช้เวลาน้อยกว่า 24 ชั่วโมง โดยคำขอส่วนใหญ่จะได้รับการอนุมัติภายใน 1-2 ชั่วโมง ในอนาคตอันใกล้นี้เรามุ่งหวังที่จะทำให้กระบวนการนี้เป็นแบบทันทีพร้อมการควบคุมสแปมและการแจ้งเตือนเพิ่มเติม กระบวนการนี้ช่วยให้แน่ใจว่าอีเมลของคุณจะถึงกล่องจดหมายและข้อความของคุณจะไม่ถูกทำเครื่องหมายว่าเป็นสแปม

### คุณรองรับการส่งอีเมลด้วย API หรือไม่ {#do-you-support-sending-email-with-api}

ใช่ ตั้งแต่เดือนพฤษภาคม 2023 เป็นต้นมา เรารองรับการส่งอีเมลด้วย API เป็นส่วนเสริมสำหรับผู้ใช้ที่ชำระเงินทั้งหมด

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    โปรดตรวจสอบให้แน่ใจว่าคุณได้อ่าน <a href="/terms" class="alert-link" target="_blank">ข้อกำหนด</a>, <a href="/privacy" class="alert-link" target="_blank">นโยบายความเป็นส่วนตัว</a> และ <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">ข้อจำกัด SMTP ขาออก</a> &ndash; การใช้งานของคุณถือเป็นการรับทราบและยอมรับ
  </span>
</div>

โปรดดูส่วนของเราเกี่ยวกับ [อีเมล](/email-api#outbound-emails) ในเอกสาร API ของเราเพื่อดูตัวเลือก ตัวอย่าง และข้อมูลเชิงลึกเพิ่มเติม

เพื่อส่งอีเมลขาออกด้วย API ของเรา คุณต้องใช้โทเค็น API ของคุณที่มีอยู่ภายใต้ [บัญชีของฉัน ความปลอดภัย](/my-account/security)

### คุณรองรับการรับอีเมลด้วย IMAP หรือไม่ {#do-you-support-receiving-email-with-imap}

ใช่ ตั้งแต่วันที่ 16 ตุลาคม 2023 เป็นต้นมา เรารองรับการรับอีเมลผ่าน IMAP เป็นส่วนเสริมสำหรับผู้ใช้ที่ชำระเงินทั้งหมด  **โปรดอ่านบทความเชิงลึกของเรา** เกี่ยวกับ [วิธีการทำงานของฟีเจอร์การจัดเก็บกล่องจดหมาย SQLite ที่เข้ารหัส](/blog/docs/best-quantum-safe-encrypted-email-service)

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    โปรดตรวจสอบให้แน่ใจว่าคุณได้อ่าน <a href="/terms" class="alert-link" target="_blank">ข้อกำหนด</a> และ <a href="/privacy" class="alert-link" target="_blank">นโยบายความเป็นส่วนตัว</a> &ndash; การใช้งานของคุณถือเป็นการรับทราบและยอมรับ
  </span>
</div>

1. สร้างนามแฝงใหม่สำหรับโดเมนของคุณภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code><hello@example.com></code>)

2. คลิกที่ <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ข้างนามแฝงที่สร้างใหม่ คัดลอกไปยังคลิปบอร์ดของคุณและเก็บรหัสผ่านที่สร้างขึ้นอย่างปลอดภัยตามที่แสดงบนหน้าจอ

3. ใช้แอปพลิเคชันอีเมลที่คุณชื่นชอบ เพิ่มหรือกำหนดค่าบัญชีด้วยนามแฝงที่คุณสร้างใหม่ (เช่น <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       เคล็ดลับ:
     </strong>
     <span>เราแนะนำให้ใช้ <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> หรือ <a href="/blog/open-source" class="alert-link" target="_blank">ทางเลือกแบบโอเพนซอร์สและเน้นความเป็นส่วนตัว</a>.</span>
   </div>

4. เมื่อระบบถามชื่อเซิร์ฟเวอร์ IMAP ให้กรอก `imap.forwardemail.net`

5. เมื่อระบบถามพอร์ตเซิร์ฟเวอร์ IMAP ให้กรอก `993` (SSL/TLS) – ดู [พอร์ต IMAP ทางเลือก](/faq#what-are-your-imap-server-configuration-settings) หากจำเป็น
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       เคล็ดลับ:
     </strong>
     <span>หากคุณใช้ Thunderbird ให้แน่ใจว่า "ความปลอดภัยการเชื่อมต่อ" ตั้งค่าเป็น "SSL/TLS" และวิธีการตรวจสอบสิทธิ์ตั้งเป็น "รหัสผ่านปกติ"</span>
   </div>
6. เมื่อระบบขอรหัสผ่านเซิร์ฟเวอร์ IMAP ให้วางรหัสผ่านจาก <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ในขั้นตอนที่ 2 ข้างต้น

7. **บันทึกการตั้งค่าของคุณ** – หากคุณพบปัญหา กรุณา <a href="/help">ติดต่อเรา</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ขอแสดงความยินดี!
    </strong>
    <span>
      คุณได้ทำขั้นตอนทั้งหมดสำเร็จเรียบร้อยแล้ว
    </span>
  </div>
</div>

</div>

### คุณรองรับ POP3 {#do-you-support-pop3}

ใช่ ตั้งแต่วันที่ 4 ธันวาคม 2023 เรารองรับ [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) เป็นฟีเจอร์เสริมสำหรับผู้ใช้ที่ชำระเงินทั้งหมด  **โปรดอ่านบทความเชิงลึกของเรา** เกี่ยวกับ [วิธีการทำงานของฟีเจอร์เก็บกล่องจดหมาย SQLite ที่เข้ารหัสของเรา](/blog/docs/best-quantum-safe-encrypted-email-service)

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    โปรดตรวจสอบว่าคุณได้อ่าน <a href="/terms" class="alert-link" target="_blank">ข้อกำหนด</a> และ <a href="/privacy" class="alert-link" target="_blank">นโยบายความเป็นส่วนตัว</a> ของเราแล้ว &ndash; การใช้งานของคุณถือเป็นการรับทราบและยอมรับ
  </span>
</div>

1. สร้างนามแฝงใหม่สำหรับโดเมนของคุณภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code><hello@example.com></code>)

2. คลิกที่ <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ข้างนามแฝงที่สร้างใหม่ คัดลอกไปยังคลิปบอร์ดและเก็บรหัสผ่านที่สร้างขึ้นอย่างปลอดภัยตามที่แสดงบนหน้าจอ

3. ใช้แอปอีเมลที่คุณชื่นชอบ เพิ่มหรือกำหนดค่าบัญชีด้วยนามแฝงที่สร้างใหม่ของคุณ (เช่น <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       เคล็ดลับ:
     </strong>
     <span>เราแนะนำให้ใช้ <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> หรือ <a href="/blog/open-source" class="alert-link" target="_blank">ทางเลือกแบบโอเพ่นซอร์สและเน้นความเป็นส่วนตัว</a>.</span>
   </div>

4. เมื่อระบบขอชื่อเซิร์ฟเวอร์ POP3 ให้กรอก `pop3.forwardemail.net`

5. เมื่อระบบขอพอร์ตเซิร์ฟเวอร์ POP3 ให้กรอก `995` (SSL/TLS) – ดู [พอร์ต POP3 ทางเลือก](/faq#what-are-your-pop3-server-configuration-settings) หากจำเป็น
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       เคล็ดลับ:
     </strong>
     <span>หากคุณใช้ Thunderbird ให้ตรวจสอบว่า "ความปลอดภัยการเชื่อมต่อ" ตั้งเป็น "SSL/TLS" และวิธีการตรวจสอบสิทธิ์ตั้งเป็น "รหัสผ่านปกติ"</span>
   </div>

6. เมื่อระบบขอรหัสผ่านเซิร์ฟเวอร์ POP3 ให้วางรหัสผ่านจาก <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ในขั้นตอนที่ 2 ข้างต้น

7. **บันทึกการตั้งค่าของคุณ** – หากคุณพบปัญหา กรุณา <a href="/help">ติดต่อเรา</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ขอแสดงความยินดี!
    </strong>
    <span>
      คุณได้ทำขั้นตอนทั้งหมดสำเร็จเรียบร้อยแล้ว
    </span>
  </div>
</div>

</div>

### คุณรองรับปฏิทิน (CalDAV) {#do-you-support-calendars-caldav}

ใช่ ตั้งแต่วันที่ 5 กุมภาพันธ์ 2024 เราได้เพิ่มฟีเจอร์นี้ เซิร์ฟเวอร์ของเราคือ `caldav.forwardemail.net` และยังมีการตรวจสอบสถานะบน <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">หน้าสถานะ</a> ของเราอีกด้วย
It supports both IPv4 and IPv6 and is available over port `443` (HTTPS).

| Login    | Example                    | Description                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | ที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a>. |
| Password | `************************` | รหัสผ่านที่สร้างขึ้นเฉพาะสำหรับนามแฝงนั้น                                                                                                                                              |

เพื่อใช้การสนับสนุนปฏิทิน, **ผู้ใช้** ต้องเป็นที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> – และ **รหัสผ่าน** ต้องเป็นรหัสผ่านที่สร้างขึ้นเฉพาะสำหรับนามแฝงนั้น

### คุณรองรับงานและการเตือนความจำ (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

ใช่, ตั้งแต่วันที่ 14 ตุลาคม 2025 เราได้เพิ่มการสนับสนุน CalDAV VTODO สำหรับงานและการเตือนความจำแล้ว ซึ่งใช้เซิร์ฟเวอร์เดียวกับการสนับสนุนปฏิทินของเรา: `caldav.forwardemail.net`

เซิร์ฟเวอร์ CalDAV ของเราสนับสนุนทั้งเหตุการณ์ปฏิทิน (VEVENT) และองค์ประกอบงาน (VTODO) โดยใช้ **ปฏิทินแบบรวม** ซึ่งหมายความว่าปฏิทินแต่ละอันสามารถมีทั้งเหตุการณ์และงานได้ เพื่อให้มีความยืดหยุ่นสูงสุดและความเข้ากันได้กับไคลเอนต์ CalDAV ทุกตัว

**วิธีการทำงานของปฏิทินและรายการ:**

* **ปฏิทินแต่ละอันรองรับทั้งเหตุการณ์และงาน** - คุณสามารถเพิ่มเหตุการณ์ งาน หรือทั้งสองอย่างในปฏิทินใดก็ได้
* **รายการ Apple Reminders** - รายการแต่ละรายการที่คุณสร้างใน Apple Reminders จะกลายเป็นปฏิทินแยกต่างหากบนเซิร์ฟเวอร์
* **ปฏิทินหลายรายการ** - คุณสามารถสร้างปฏิทินได้ตามต้องการ แต่ละอันมีชื่อ สี และการจัดระเบียบของตัวเอง
* **การซิงค์ข้ามไคลเอนต์** - งานและเหตุการณ์ซิงค์กันอย่างราบรื่นระหว่างไคลเอนต์ที่เข้ากันได้ทั้งหมด

**ไคลเอนต์งานที่รองรับ:**

* **macOS Reminders** - รองรับเต็มรูปแบบสำหรับการสร้าง แก้ไข ทำเครื่องหมายว่างานเสร็จ และซิงค์
* **iOS Reminders** - รองรับเต็มรูปแบบในอุปกรณ์ iOS ทุกเครื่อง
* **Tasks.org (Android)** - ตัวจัดการงานโอเพนซอร์สยอดนิยมที่มีการซิงค์ CalDAV
* **Thunderbird** - รองรับงานและปฏิทินในไคลเอนต์อีเมลบนเดสก์ท็อป
* **ตัวจัดการงานที่รองรับ CalDAV ทุกตัว** - รองรับองค์ประกอบ VTODO มาตรฐาน

**คุณสมบัติงานที่รองรับ:**

* การสร้าง แก้ไข และลบงาน
* วันที่ครบกำหนดและวันที่เริ่มต้น
* สถานะความคืบหน้างาน (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* ระดับความสำคัญของงาน
* งานที่ทำซ้ำได้
* คำอธิบายและบันทึกของงาน
* การซิงค์หลายอุปกรณ์
* งานย่อยที่มีคุณสมบัติ RELATED-TO
* การเตือนงานด้วย VALARM

ข้อมูลเข้าสู่ระบบเหมือนกับการสนับสนุนปฏิทิน:

| Login    | Example                    | Description                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | ที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a>. |
| Password | `************************` | รหัสผ่านที่สร้างขึ้นเฉพาะสำหรับนามแฝงนั้น                                                                                                                                              |

**หมายเหตุสำคัญ:**

* **รายการ Reminders แต่ละรายการเป็นปฏิทินแยกต่างหาก** - เมื่อคุณสร้างรายการใหม่ใน Apple Reminders จะสร้างปฏิทินใหม่บนเซิร์ฟเวอร์ CalDAV
* **ผู้ใช้ Thunderbird** - คุณจะต้องสมัครสมาชิกปฏิทิน/รายการแต่ละรายการที่ต้องการซิงค์ด้วยตนเอง หรือใช้ URL โฮมปฏิทิน: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **ผู้ใช้ Apple** - การค้นหาปฏิทินจะเกิดขึ้นโดยอัตโนมัติ ดังนั้นปฏิทินและรายการทั้งหมดของคุณจะปรากฏใน Calendar.app และ Reminders.app
* **ปฏิทินแบบรวม** - ปฏิทินทั้งหมดรองรับทั้งเหตุการณ์และงาน ทำให้คุณมีความยืดหยุ่นในการจัดระเบียบข้อมูลของคุณ
### คุณรองรับรายชื่อผู้ติดต่อ (CardDAV) {#do-you-support-contacts-carddav}

ใช่ ตั้งแต่วันที่ 12 มิถุนายน 2025 เราได้เพิ่มฟีเจอร์นี้ เซิร์ฟเวอร์ของเราคือ `carddav.forwardemail.net` และยังมีการตรวจสอบบน <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">หน้าสถานะ</a> ของเรา

รองรับทั้ง IPv4 และ IPv6 และสามารถใช้งานผ่านพอร์ต `443` (HTTPS)

| การเข้าสู่ระบบ | ตัวอย่าง                   | คำอธิบาย                                                                                                                                                                                |
| -------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ชื่อผู้ใช้     | `user@example.com`         | ที่อยู่อีเมลของอีเมลแอเลียสที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a>          |
| รหัสผ่าน      | `************************` | รหัสผ่านที่สร้างขึ้นเฉพาะสำหรับแอเลียส                                                                                                                                                   |

เพื่อใช้การรองรับรายชื่อผู้ติดต่อ **ผู้ใช้** ต้องเป็นที่อยู่อีเมลของแอเลียสที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> – และ **รหัสผ่าน** ต้องเป็นรหัสผ่านที่สร้างขึ้นเฉพาะสำหรับแอเลียสนั้น

### คุณรองรับการส่งอีเมลด้วย SMTP หรือไม่ {#do-you-support-sending-email-with-smtp}

ใช่ ตั้งแต่เดือนพฤษภาคม 2023 เรารองรับการส่งอีเมลด้วย SMTP เป็นฟีเจอร์เสริมสำหรับผู้ใช้ที่ชำระเงินทั้งหมด

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    โปรดตรวจสอบให้แน่ใจว่าคุณได้อ่าน <a href="/terms" class="alert-link" target="_blank">ข้อกำหนด</a> ของเรา, <a href="/privacy" class="alert-link" target="_blank">นโยบายความเป็นส่วนตัว</a> และ <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">ข้อจำกัด SMTP ขาออก</a> &ndash; การใช้งานของคุณถือเป็นการรับทราบและยอมรับ
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    หากคุณใช้ Gmail โปรดดู <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">คู่มือส่งอีเมลในชื่อโดเมน Gmail</a> หากคุณเป็นนักพัฒนา โปรดดู <a class="alert-link" href="/email-api#outbound-emails" target="_blank">เอกสาร API อีเมล</a> ของเรา
  </span>
</div>

1. ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> การตั้งค่า SMTP ขาออก และทำตามคำแนะนำการตั้งค่า

2. สร้างแอเลียสใหม่สำหรับโดเมนของคุณภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> แอเลียส (เช่น <code><hello@example.com></code>)

3. คลิกที่ <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ถัดจากแอเลียสที่สร้างใหม่ คัดลอกไปยังคลิปบอร์ดและเก็บรหัสผ่านที่สร้างขึ้นอย่างปลอดภัยตามที่แสดงบนหน้าจอ

4. ใช้แอปอีเมลที่คุณชื่นชอบ เพิ่มหรือกำหนดค่าบัญชีด้วยแอเลียสที่คุณสร้างใหม่ (เช่น <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       เคล็ดลับ:
     </strong>
     <span>เราแนะนำให้ใช้ <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> หรือ <a href="/blog/open-source" class="alert-link" target="_blank">ทางเลือกแบบโอเพนซอร์สและเน้นความเป็นส่วนตัว</a> </span>
   </div>
5. เมื่อถูกถามชื่อเซิร์ฟเวอร์ SMTP ให้ใส่ `smtp.forwardemail.net`

6. เมื่อถูกถามพอร์ตเซิร์ฟเวอร์ SMTP ให้ใส่ `465` (SSL/TLS) – ดู [พอร์ต SMTP ทางเลือก](/faq#what-are-your-smtp-server-configuration-settings) หากจำเป็น
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       เคล็ดลับ:
     </strong>
     <span>หากคุณใช้ Thunderbird ให้แน่ใจว่า "Connection security" ตั้งค่าเป็น "SSL/TLS" และวิธีการตรวจสอบสิทธิ์ตั้งเป็น "Normal password"</span>
   </div>

7. เมื่อถูกถามรหัสผ่านเซิร์ฟเวอร์ SMTP ให้วางรหัสผ่านจาก <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ในขั้นตอนที่ 3 ข้างต้น

8. **บันทึกการตั้งค่าของคุณและส่งอีเมลทดสอบครั้งแรก** – หากคุณพบปัญหา กรุณา <a href="/help">ติดต่อเรา</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    โปรดทราบว่าเพื่อรักษาชื่อเสียง IP และเพื่อให้แน่ใจว่าสามารถส่งอีเมลได้ เรามีกระบวนการตรวจสอบด้วยตนเองสำหรับการอนุมัติ SMTP ขาออกในแต่ละโดเมน โดยปกติจะใช้เวลาน้อยกว่า 24 ชั่วโมง โดยคำขอส่วนใหญ่จะได้รับการอนุมัติภายใน 1-2 ชั่วโมง ในอนาคตอันใกล้นี้เรามุ่งหวังที่จะทำให้กระบวนการนี้เป็นแบบทันทีพร้อมกับการควบคุมสแปมและการแจ้งเตือนเพิ่มเติม กระบวนการนี้ช่วยให้แน่ใจว่าอีเมลของคุณจะถึงกล่องจดหมายและข้อความของคุณจะไม่ถูกทำเครื่องหมายเป็นสแปม
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ขอแสดงความยินดี!
    </strong>
    <span>
      คุณได้ทำขั้นตอนทั้งหมดสำเร็จเรียบร้อยแล้ว
    </span>
  </div>
</div>

</div>

### คุณรองรับ OpenPGP/MIME, การเข้ารหัสแบบ end-to-end ("E2EE") และ Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

ใช่ เรารองรับ [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [การเข้ารหัสแบบ end-to-end ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) และการค้นหากุญแจสาธารณะโดยใช้ [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD) คุณสามารถตั้งค่า OpenPGP โดยใช้ [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) หรือ [โฮสต์กุญแจของคุณเอง](https://wiki.gnupg.org/WKDHosting) (ดู [gist นี้สำหรับการตั้งค่าเซิร์ฟเวอร์ WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79))

* การค้นหา WKD จะถูกแคชไว้ 1 ชั่วโมงเพื่อให้แน่ใจว่าการส่งอีเมลเป็นไปอย่างทันท่วงที → ดังนั้นหากคุณเพิ่ม เปลี่ยนแปลง หรือเอากุญแจ WKD ออก กรุณาส่งอีเมลถึงเราที่ `support@forwardemail.net` พร้อมที่อยู่อีเมลของคุณเพื่อให้เราล้างแคชด้วยตนเอง
* เรารองรับการเข้ารหัส PGP สำหรับข้อความที่ถูกส่งต่อผ่านการค้นหา WKD หรือโดยใช้กุญแจ PGP ที่อัปโหลดผ่านอินเทอร์เฟซของเรา
* กุญแจที่อัปโหลดจะมีความสำคัญตราบใดที่ช่องทำเครื่องหมาย PGP ถูกเปิดใช้งาน/เลือก
* ข้อความที่ส่งไปยัง webhook ปัจจุบันยังไม่ถูกเข้ารหัสด้วย PGP
* หากคุณมีนามแฝงหลายรายการที่ตรงกับที่อยู่อีเมลส่งต่อ (เช่น การจับคู่ regex/wildcard/แบบตรง) และหากมากกว่าหนึ่งรายการมีการอัปโหลดกุญแจ PGP และเปิดใช้งาน PGP → เราจะส่งอีเมลแจ้งเตือนข้อผิดพลาดและจะไม่เข้ารหัสข้อความด้วยกุญแจ PGP ที่อัปโหลดของคุณ นี่เป็นกรณีที่เกิดขึ้นน้อยมากและมักจะใช้กับผู้ใช้ขั้นสูงที่มีกฎนามแฝงซับซ้อน
* **การเข้ารหัส PGP จะไม่ถูกนำไปใช้กับการส่งต่ออีเมลผ่านเซิร์ฟเวอร์ MX ของเราหากผู้ส่งมีนโยบาย DMARC เป็น reject หากคุณต้องการการเข้ารหัส PGP สำหรับอีเมล *ทั้งหมด* เราแนะนำให้ใช้บริการ IMAP ของเราและตั้งค่ากุญแจ PGP สำหรับนามแฝงของคุณสำหรับอีเมลขาเข้า**

**คุณสามารถตรวจสอบการตั้งค่า Web Key Directory ของคุณได้ที่ <https://wkd.chimbosonic.com/> (โอเพนซอร์ส) หรือ <https://www.webkeydirectory.com/> (เชิงพาณิชย์)**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    การเข้ารหัสอัตโนมัติ:
  </strong>
  <span>หากคุณใช้ <a href="#do-you-support-sending-email-with-smtp" class="alert-link">บริการ SMTP ขาออกของเรา</a> และส่งข้อความที่ไม่ได้เข้ารหัส เราจะพยายามเข้ารหัสข้อความโดยอัตโนมัติในแต่ละผู้รับโดยใช้ <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a></span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    คุณต้องปฏิบัติตามขั้นตอนทั้งหมดต่อไปนี้เพื่อเปิดใช้งาน OpenPGP สำหรับชื่อโดเมนที่กำหนดเองของคุณ
  </span>
</div>

1. ดาวน์โหลดและติดตั้งปลั๊กอินที่แนะนำสำหรับโปรแกรมรับส่งอีเมลของคุณด้านล่างนี้:

   | โปรแกรมรับส่งอีเมล | แพลตฟอร์ม | ปลั๊กอินที่แนะนำ                                                                                                                                                                    | หมายเหตุ                                                                                                                                                                                                                                                                                                                                                                                                                                |
   | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | เดสก์ท็อป  | [กำหนดค่า OpenPGP ใน Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird มีการรองรับ OpenPGP ในตัว                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gmail           | เบราว์เซอร์  | [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) (ไลเซนส์แบบกรรมสิทธิ์)                                                                            | Gmail ไม่รองรับ OpenPGP แต่คุณสามารถดาวน์โหลดปลั๊กอินโอเพนซอร์ส [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้                                                                                                                                                                                                                                                                               |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple Mail ไม่รองรับ OpenPGP แต่คุณสามารถดาวน์โหลดปลั๊กอินโอเพนซอร์ส [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) ได้                                                                                                                                                                                                                                                                      |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) หรือ [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (ไลเซนส์แบบกรรมสิทธิ์)                           | Apple Mail ไม่รองรับ OpenPGP แต่คุณสามารถดาวน์โหลดปลั๊กอินโอเพนซอร์ส [PGPro](https://github.com/opensourceios/PGPro/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้                                                                                                                                                                                                                                                               |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | โปรแกรมรับส่งอีเมลบนเดสก์ท็อปของ Outlook ไม่รองรับ OpenPGP แต่คุณสามารถดาวน์โหลดปลั๊กอินโอเพนซอร์ส [gpg4win](https://www.gpg4win.de/index.html) ได้                                                                                                                                                                                                                                                                                   |
   | Outlook         | เบราว์เซอร์  | [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) (ไลเซนส์แบบกรรมสิทธิ์)                                                                            | โปรแกรมรับส่งอีเมลบนเว็บของ Outlook ไม่รองรับ OpenPGP แต่คุณสามารถดาวน์โหลดปลั๊กอินโอเพนซอร์ส [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้                                                                                                                                                                                                                                               |
   | Android         | มือถือ   | [OpenKeychain](https://www.openkeychain.org/) หรือ [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [โปรแกรมรับส่งอีเมลบน Android](/blog/open-source/android-email-clients) เช่น [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) และ [FairEmail](https://github.com/M66B/FairEmail) รองรับปลั๊กอินโอเพนซอร์ส [OpenKeychain](https://www.openkeychain.org/) คุณสามารถใช้ปลั๊กอินโอเพนซอร์ส (ไลเซนส์แบบกรรมสิทธิ์) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) เป็นทางเลือกได้เช่นกัน |
   | Google Chrome   | เบราว์เซอร์  | [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) (ไลเซนส์แบบกรรมสิทธิ์)                                                                            | คุณสามารถดาวน์โหลดส่วนขยายเบราว์เซอร์โอเพนซอร์ส [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้                                                                                                                                                                                                                                                                                              |
   | Mozilla Firefox | เบราว์เซอร์  | [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) (ไลเซนส์แบบกรรมสิทธิ์)                                                                            | คุณสามารถดาวน์โหลดส่วนขยายเบราว์เซอร์โอเพนซอร์ส [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้                                                                                                                                                                                                                                                                                              |
   | Microsoft Edge  | เบราว์เซอร์  | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | คุณสามารถดาวน์โหลดส่วนขยายเบราว์เซอร์โอเพนซอร์ส [Mailvelope](https://mailvelope.com/) ได้                                                                                                                                                                                                                                                                                                                                             |
   | Brave           | เบราว์เซอร์  | [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) (ไลเซนส์แบบกรรมสิทธิ์)                                                                            | คุณสามารถดาวน์โหลดส่วนขยายเบราว์เซอร์โอเพนซอร์ส [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้                                                                                                                                                                                                                                                                                              |
   | Balsa           | เดสก์ท็อป  | [กำหนดค่า OpenPGP ใน Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                            | Balsa มีการรองรับ OpenPGP ในตัว                                                                                                                                                                                                                                                                                                                                                                                                          |
   | KMail           | เดสก์ท็อป  | [กำหนดค่า OpenPGP ใน KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                 | KMail มีการรองรับ OpenPGP ในตัว                                                                                                                                                                                                                                                                                                                                                                                                          |
   | GNOME Evolution | เดสก์ท็อป  | [กำหนดค่า OpenPGP ใน Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                               | GNOME Evolution มีการรองรับ OpenPGP ในตัว                                                                                                                                                                                                                                                                                                                                                                                                |
   | Terminal        | เดสก์ท็อป  | [กำหนดค่า gpg ใน Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                           | คุณสามารถใช้เครื่องมือบรรทัดคำสั่งโอเพนซอร์ส [gpg](https://www.gnupg.org/download/) เพื่อสร้างกุญแจใหม่จากบรรทัดคำสั่งได้                                                                                                                                                                                                                                                                                                            |
2. เปิดปลั๊กอิน สร้างกุญแจสาธารณะของคุณ และตั้งค่าโปรแกรมอีเมลของคุณให้ใช้กุญแจนี้

3. อัปโหลดกุญแจสาธารณะของคุณที่ <https://keys.openpgp.org/upload>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       เคล็ดลับ:
     </strong>
     <span>คุณสามารถเยี่ยมชม <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> เพื่อจัดการกุญแจของคุณในอนาคตได้</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       ส่วนเสริมเพิ่มเติม:
     </strong>
     <span>
       หากคุณกำลังใช้บริการ <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">ที่เก็บข้อมูลเข้ารหัส (IMAP/POP3)</a> ของเรา และต้องการให้ <i>อีเมลทั้งหมด</i> ที่เก็บไว้ในฐานข้อมูล SQLite (ที่เข้ารหัสอยู่แล้ว) ของคุณถูกเข้ารหัสด้วยกุญแจสาธารณะของคุณ ให้ไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> อีเมลแฝง (เช่น <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> แก้ไข <i class="fa fa-angle-right"></i> OpenPGP และอัปโหลดกุญแจสาธารณะของคุณ
     </span>
   </div>

4. เพิ่มระเบียน `CNAME` ใหม่ในชื่อโดเมนของคุณ (เช่น `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>ชื่อ/โฮสต์/อีเมลแฝง</th>
         <th class="text-center">TTL</th>
         <th>ประเภท</th>
         <th>คำตอบ/ค่า</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td><code>openpgpkey</code></td>
         <td class="text-center">3600</td>
         <td class="notranslate">CNAME</td>
         <td><code>wkd.keys.openpgp.org</code></td>
       </tr>
     </tbody>
   </table>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       เคล็ดลับ:
     </strong>
     <span>ถ้าอีเมลแฝงของคุณใช้ <a class="alert-link" href="/disposable-addresses" target="_blank">โดเมนแวนิตี้/ใช้ครั้งเดียว</a> ของเรา (เช่น <code>hideaddress.net</code>) คุณสามารถข้ามขั้นตอนนี้ได้</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ขอแสดงความยินดี!
    </strong>
    <span>
      คุณได้ทำขั้นตอนทั้งหมดสำเร็จเรียบร้อยแล้ว
    </span>
  </div>
</div>

### คุณรองรับการเข้ารหัส S/MIME {#do-you-support-smime-encryption}

ใช่ เรารองรับการเข้ารหัส [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) ตามที่กำหนดใน [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551) S/MIME ให้การเข้ารหัสแบบ end-to-end โดยใช้ใบรับรอง X.509 ซึ่งได้รับการสนับสนุนอย่างกว้างขวางโดยโปรแกรมอีเมลสำหรับองค์กร

เรารองรับทั้งใบรับรอง RSA และ ECC (Elliptic Curve Cryptography):

* **ใบรับรอง RSA**: อย่างน้อย 2048 บิต แนะนำ 4096 บิต
* **ใบรับรอง ECC**: เส้นโค้ง NIST P-256, P-384 และ P-521

วิธีตั้งค่าการเข้ารหัส S/MIME สำหรับอีเมลแฝงของคุณ:

1. ขอใบรับรอง S/MIME จากหน่วยงานออกใบรับรองที่เชื่อถือได้ (CA) หรือสร้างใบรับรองเซลฟ์ซายน์สำหรับการทดสอบ

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       เคล็ดลับ:
     </strong>
     <span>ใบรับรอง S/MIME ฟรีมีให้จากผู้ให้บริการเช่น <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> หรือ <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a></span>
   </div>

2. ส่งออกใบรับรองของคุณในรูปแบบ PEM (เฉพาะใบรับรองสาธารณะ ไม่ใช่กุญแจส่วนตัว)

3. ไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> อีเมลแฝง (เช่น <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> แก้ไข <i class="fa fa-angle-right"></i> S/MIME และอัปโหลดใบรับรองสาธารณะของคุณ
4. เมื่อกำหนดค่าเสร็จแล้ว อีเมลขาเข้าทั้งหมดที่ส่งไปยังนามแฝงของคุณจะถูกเข้ารหัสโดยใช้ใบรับรอง S/MIME ของคุณก่อนที่จะถูกจัดเก็บหรือส่งต่อ

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       หมายเหตุ:
     </strong>
     <span>
       การเข้ารหัส S/MIME จะถูกใช้กับข้อความขาเข้าที่ยังไม่ได้ถูกเข้ารหัส หากข้อความนั้นถูกเข้ารหัสด้วย OpenPGP หรือ S/MIME อยู่แล้ว จะไม่ถูกเข้ารหัสซ้ำอีก
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       สำคัญ:
     </strong>
     <span>
       การเข้ารหัส S/MIME จะไม่ถูกใช้กับการส่งต่ออีเมลผ่านเซิร์ฟเวอร์ MX ของเราหากผู้ส่งมีนโยบาย DMARC เป็น reject หากคุณต้องการการเข้ารหัส S/MIME กับอีเมล <em>ทั้งหมด</em> เราแนะนำให้ใช้บริการ IMAP ของเราและกำหนดค่าใบรับรอง S/MIME สำหรับนามแฝงของคุณสำหรับอีเมลขาเข้า
     </span>
   </div>

ไคลเอนต์อีเมลต่อไปนี้มีการรองรับ S/MIME ในตัว:

| ไคลเอนต์อีเมล      | แพลตฟอร์ม | หมายเหตุ                                                                                                               |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | รองรับ S/MIME ในตัว ไปที่ Mail > Preferences > Accounts > บัญชีของคุณ > Trust เพื่อกำหนดค่าใบรับรอง                  |
| Apple Mail        | iOS      | รองรับ S/MIME ในตัว ไปที่ Settings > Mail > Accounts > บัญชีของคุณ > Advanced > S/MIME เพื่อกำหนดค่า                  |
| Microsoft Outlook | Windows  | รองรับ S/MIME ในตัว ไปที่ File > Options > Trust Center > Trust Center Settings > Email Security เพื่อกำหนดค่า       |
| Microsoft Outlook | macOS    | รองรับ S/MIME ในตัว ไปที่ Tools > Accounts > Advanced > Security เพื่อกำหนดค่า                                       |
| Thunderbird       | Desktop  | รองรับ S/MIME ในตัว ไปที่ Account Settings > End-To-End Encryption > S/MIME เพื่อกำหนดค่า                            |
| GNOME Evolution   | Desktop  | รองรับ S/MIME ในตัว ไปที่ Edit > Preferences > Mail Accounts > บัญชีของคุณ > Security เพื่อกำหนดค่า                   |
| KMail             | Desktop  | รองรับ S/MIME ในตัว ไปที่ Settings > Configure KMail > Identities > ตัวตนของคุณ > Cryptography เพื่อกำหนดค่า          |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      ขอแสดงความยินดี!
    </strong>
    <span>
      คุณได้กำหนดค่าการเข้ารหัส S/MIME สำหรับนามแฝงของคุณเรียบร้อยแล้ว
    </span>
  </div>
</div>

### คุณรองรับการกรองอีเมลด้วย Sieve หรือไม่ {#do-you-support-sieve-email-filtering}

ใช่! เรารองรับการกรองอีเมลด้วย [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) ตามที่กำหนดใน [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228) Sieve เป็นภาษาสคริปต์ที่มีมาตรฐานและทรงพลังสำหรับการกรองอีเมลฝั่งเซิร์ฟเวอร์ที่ช่วยให้คุณจัดระเบียบ กรอง และตอบกลับข้อความขาเข้าโดยอัตโนมัติ

#### ส่วนขยาย Sieve ที่รองรับ {#supported-sieve-extensions}

เรารองรับชุดส่วนขยาย Sieve อย่างครบถ้วน:

| ส่วนขยาย                    | RFC                                                                                    | คำอธิบาย                                      |
| ---------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | จัดเก็บข้อความลงในโฟลเดอร์เฉพาะ               |
| `reject` / `ereject`         | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | ปฏิเสธข้อความพร้อมข้อผิดพลาด                  |
| `vacation`                   | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | ตอบกลับอัตโนมัติเมื่อไม่อยู่หรือวันหยุด         |
| `vacation-seconds`           | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | กำหนดช่วงเวลาการตอบกลับวันหยุดอย่างละเอียด     |
| `imap4flags`                 | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | ตั้งค่า IMAP flags (\Seen, \Flagged, ฯลฯ)      |
| `envelope`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | ทดสอบผู้ส่ง/ผู้รับในซองจดหมาย                   |
| `body`                       | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | ทดสอบเนื้อหาของข้อความ                          |
| `variables`                  | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | เก็บและใช้ตัวแปรในสคริปต์                        |
| `relational`                 | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | การเปรียบเทียบเชิงสัมพันธ์ (มากกว่า น้อยกว่า)    |
| `comparator-i;ascii-numeric` | [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | การเปรียบเทียบเชิงตัวเลข                         |
| `copy`                       | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | คัดลอกข้อความในขณะเปลี่ยนเส้นทาง                 |
| `editheader`                 | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | เพิ่มหรือลบหัวข้อข้อความ                        |
| `date`                       | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | ทดสอบค่าวันที่/เวลา                              |
| `index`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | เข้าถึงการเกิดขึ้นของหัวข้อเฉพาะ                 |
| `regex`                      | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | การจับคู่ด้วยนิพจน์ปกติ                          |
| `enotify`                    | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | ส่งการแจ้งเตือน (เช่น mailto:)                   |
| `environment`                | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | เข้าถึงข้อมูลสภาพแวดล้อม                        |
| `mailbox`                    | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | ทดสอบการมีอยู่ของกล่องจดหมาย สร้างกล่องจดหมาย  |
| `special-use`                | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | จัดเก็บลงกล่องจดหมายพิเศษ (\Junk, \Trash)       |
| `duplicate`                  | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | ตรวจจับข้อความซ้ำ                                |
| `ihave`                      | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | ทดสอบการมีอยู่ของส่วนขยาย                        |
| `subaddress`                 | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | เข้าถึงส่วนที่อยู่ผู้ใช้+รายละเอียด               |
#### Extensions Not Supported {#extensions-not-supported}

ส่วนขยายต่อไปนี้ยังไม่รองรับในขณะนี้:

| Extension                                                       | Reason                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `include`                                                       | ความเสี่ยงด้านความปลอดภัย (การแทรกสคริปต์) และต้องการการจัดเก็บสคริปต์แบบทั่วโลก |
| `mboxmetadata` / `servermetadata`                               | ต้องการการรองรับส่วนขยาย IMAP METADATA                            |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | การจัดการโครงสร้าง MIME ที่ซับซ้อนยังไม่ได้รับการพัฒนา             |

#### Example Sieve Scripts {#example-sieve-scripts}

**จัดเก็บจดหมายข่าวลงในโฟลเดอร์:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**ตอบกลับอัตโนมัติเมื่ออยู่ในช่วงวันหยุด:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "I am currently out of the office and will respond when I return.";
```

**ทำเครื่องหมายข้อความจากผู้ส่งที่สำคัญ:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**ปฏิเสธสแปมที่มีหัวข้อเฉพาะ:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Message rejected due to spam content.";
}
```

#### Managing Sieve Scripts {#managing-sieve-scripts}

คุณสามารถจัดการสคริปต์ Sieve ของคุณได้หลายวิธี:

1. **เว็บอินเทอร์เฟซ**: ไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> อาลิอาส <i class="fa fa-angle-right"></i> สคริปต์ Sieve เพื่อสร้างและจัดการสคริปต์

2. **โปรโตคอล ManageSieve**: เชื่อมต่อโดยใช้ไคลเอนต์ที่รองรับ ManageSieve (เช่น ส่วนเสริม Sieve ของ Thunderbird หรือ [sieve-connect](https://github.com/philpennock/sieve-connect)) ไปยัง `imap.forwardemail.net` ใช้พอร์ต `2190` กับ STARTTLS (แนะนำสำหรับไคลเอนต์ส่วนใหญ่) หรือพอร์ต `4190` กับ TLS แบบ implicit

3. **API**: ใช้ [REST API](/api#sieve-scripts) ของเราเพื่อจัดการสคริปต์แบบโปรแกรม

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    หมายเหตุ:
  </strong>
  <span>
    การกรอง Sieve จะถูกนำไปใช้กับข้อความที่เข้ามาก่อนที่จะถูกเก็บในกล่องจดหมายของคุณ สคริปต์จะถูกดำเนินการตามลำดับความสำคัญ และการกระทำที่ตรงกับเงื่อนไขแรกจะเป็นตัวกำหนดวิธีการจัดการข้อความนั้น
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    ความปลอดภัย:
  </strong>
  <span>
    เพื่อความปลอดภัย การกระทำการเปลี่ยนเส้นทางถูกจำกัดไว้ที่ 10 ครั้งต่อสคริปต์และ 100 ครั้งต่อวัน การตอบกลับช่วงวันหยุดถูกจำกัดอัตราเพื่อป้องกันการใช้งานในทางที่ผิด
  </span>
</div>

### Do you support MTA-STS {#do-you-support-mta-sts}

ใช่ ตั้งแต่วันที่ 2 มีนาคม 2023 เรารองรับ [MTA-STS](https://www.hardenize.com/blog/mta-sts) คุณสามารถใช้ [เทมเพลตนี้](https://github.com/jpawlowski/mta-sts.template) หากต้องการเปิดใช้งานบนโดเมนของคุณ

การตั้งค่าของเราสามารถดูได้สาธารณะบน GitHub ที่ <https://github.com/forwardemail/mta-sts.forwardemail.net>

### Do you support passkeys and WebAuthn {#do-you-support-passkeys-and-webauthn}

ใช่! ตั้งแต่วันที่ 13 ธันวาคม 2023 เราได้เพิ่มการรองรับ passkeys [เนื่องจากความต้องการสูง](https://github.com/orgs/forwardemail/discussions/182)

Passkeys ช่วยให้คุณเข้าสู่ระบบได้อย่างปลอดภัยโดยไม่ต้องใช้รหัสผ่านและการยืนยันตัวตนสองขั้นตอน

คุณสามารถยืนยันตัวตนด้วยการสัมผัส การจดจำใบหน้า รหัสผ่านอุปกรณ์ หรือ PIN

เรายอมให้คุณจัดการ passkeys ได้สูงสุด 30 รายการพร้อมกัน เพื่อให้คุณสามารถเข้าสู่ระบบด้วยอุปกรณ์ทั้งหมดของคุณได้อย่างง่ายดาย

เรียนรู้เพิ่มเติมเกี่ยวกับ passkeys ได้ที่ลิงก์ต่อไปนี้:

* [เข้าสู่ระบบแอปและเว็บไซต์ของคุณด้วย passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [ใช้ passkeys เพื่อเข้าสู่ระบบแอปและเว็บไซต์บน iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [บทความวิกิพีเดียเกี่ยวกับ Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### คุณสนับสนุนแนวทางปฏิบัติที่ดีที่สุดของอีเมลหรือไม่ {#do-you-support-email-best-practices}

ใช่ เรามีการสนับสนุนในตัวสำหรับ SPF, DKIM, DMARC, ARC และ SRS ในทุกแผนบริการ เราได้ทำงานอย่างกว้างขวางร่วมกับผู้เขียนต้นฉบับของข้อกำหนดเหล่านี้และผู้เชี่ยวชาญด้านอีเมลอื่น ๆ เพื่อให้มั่นใจในความสมบูรณ์แบบและการส่งอีเมลที่มีประสิทธิภาพสูง

### คุณสนับสนุนเว็บฮุคสำหรับอีเมลเด้งหรือไม่ {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
    กำลังมองหาคู่มือเกี่ยวกับเว็บฮุคอีเมลอยู่หรือไม่? ดูที่ <a href="/faq#do-you-support-webhooks" class="alert-link">คุณสนับสนุนเว็บฮุคหรือไม่?</a> เพื่อข้อมูลเพิ่มเติม
  <span>
  </span>
</div>

ใช่ ตั้งแต่วันที่ 14 สิงหาคม 2024 เราได้เพิ่มฟีเจอร์นี้แล้ว คุณสามารถไปที่ บัญชีของฉัน → โดเมน → การตั้งค่า → URL เว็บฮุคอีเมลเด้ง และกำหนดค่า URL `http://` หรือ `https://` ที่เราจะส่งคำขอ `POST` ไปเมื่อใดก็ตามที่อีเมล SMTP ขาออกเด้ง

สิ่งนี้มีประโยชน์สำหรับคุณในการจัดการและตรวจสอบ SMTP ขาออกของคุณ – และสามารถใช้เพื่อรักษาผู้สมัครสมาชิก, ยกเลิกการสมัคร และตรวจจับเมื่อเกิดการเด้ง

ข้อมูลเว็บฮุคอีเมลเด้งจะถูกส่งในรูปแบบ JSON พร้อมคุณสมบัติดังนี้:

* `email_id` (String) - รหัสอีเมลที่ตรงกับอีเมลใน บัญชีของฉัน → อีเมล (SMTP ขาออก)
* `list_id` (String) - ค่าของหัวข้อ `List-ID` (ไม่สนใจตัวพิมพ์) ถ้ามี จากอีเมลขาออกต้นฉบับ
* `list_unsubscribe` (String) - ค่าของหัวข้อ `List-Unsubscribe` (ไม่สนใจตัวพิมพ์) ถ้ามี จากอีเมลขาออกต้นฉบับ
* `feedback_id` (String) - ค่าของหัวข้อ `Feedback-ID` (ไม่สนใจตัวพิมพ์) ถ้ามี จากอีเมลขาออกต้นฉบับ
* `recipient` (String) - ที่อยู่อีเมลของผู้รับที่เกิดการเด้งหรือผิดพลาด
* `message` (String) - ข้อความแสดงข้อผิดพลาดโดยละเอียดสำหรับการเด้ง
* `response` (String) - ข้อความตอบกลับ SMTP
* `response_code` (Number) - รหัสตอบกลับ SMTP ที่ถูกแยกวิเคราะห์
* `truth_source` (String) - ถ้ารหัสตอบกลับมาจากแหล่งที่เชื่อถือได้ ค่านี้จะถูกเติมด้วยชื่อโดเมนหลัก (เช่น `google.com` หรือ `yahoo.com`)
* `bounce` (Object) - อ็อบเจ็กต์ที่มีคุณสมบัติต่อไปนี้ซึ่งอธิบายสถานะการเด้งและการปฏิเสธ
  * `action` (String) - การกระทำของการเด้ง (เช่น `"reject"`)
  * `message` (String) - เหตุผลการเด้ง (เช่น `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - หมวดหมู่การเด้ง (เช่น `"block"`)
  * `code` (Number) - รหัสสถานะการเด้ง (เช่น `554`)
  * `status` (String) - รหัสการเด้งจากข้อความตอบกลับ (เช่น `5.7.1`)
  * `line` (Number) - หมายเลขบรรทัดที่ถูกแยกวิเคราะห์ ถ้ามี [จากรายการแยกวิเคราะห์การเด้งของ Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (เช่น `526`)
* `headers` (Object) - คู่คีย์และค่าของหัวข้อสำหรับอีเมลขาออก
* `bounced_at` (String) - วันที่ในรูปแบบ [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) เมื่อเกิดข้อผิดพลาดการเด้ง

ตัวอย่างเช่น:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

นี่คือบันทึกเพิ่มเติมเกี่ยวกับเว็บฮุคอีเมลเด้ง:

* หากข้อมูลเว็บฮุคมีค่า `list_id`, `list_unsubscribe` หรือ `feedback_id` คุณควรดำเนินการที่เหมาะสมเพื่อลบ `recipient` ออกจากรายการหากจำเป็น
  * หากค่า `bounce.category` เป็นหนึ่งใน `"block"`, `"recipient"`, `"spam"`, หรือ `"virus"` คุณควรลบผู้ใช้จากรายการอย่างแน่นอน
* หากคุณต้องการตรวจสอบข้อมูลเว็บฮุค (เพื่อให้แน่ใจว่ามาจากเซิร์ฟเวอร์ของเรา) คุณสามารถ [แก้ไขชื่อโฮสต์ของไอพีไคลเอนต์ระยะไกลโดยใช้การค้นหากลับ](https://nodejs.org/api/dns.html#dnspromisesreverseip) – ควรเป็น `smtp.forwardemail.net`
  * คุณยังสามารถตรวจสอบไอพีกับ [ที่อยู่ไอพีที่เราประกาศไว้](#what-are-your-servers-ip-addresses)
  * ไปที่ บัญชีของฉัน → โดเมน → การตั้งค่า → คีย์ตรวจสอบลายเซ็นข้อมูลเว็บฮุค เพื่อรับคีย์เว็บฮุคของคุณ
    * คุณสามารถหมุนเวียนคีย์นี้ได้ทุกเมื่อเพื่อเหตุผลด้านความปลอดภัย
    * คำนวณและเปรียบเทียบค่าของ `X-Webhook-Signature` จากคำขอเว็บฮุคของเรากับค่าที่คำนวณจากเนื้อหาด้วยคีย์นี้ ตัวอย่างวิธีทำมีใน [โพสต์ Stack Overflow นี้](https://stackoverflow.com/a/68885281)
  * ดูการอภิปรายที่ <https://github.com/forwardemail/free-email-forwarding/issues/235> เพื่อข้อมูลเพิ่มเติม
* เราจะรอการตอบกลับสถานะโค้ด `200` จากจุดสิ้นสุดเว็บฮุคของคุณนานถึง `5` วินาที และจะลองส่งซ้ำสูงสุด `1` ครั้ง
* หากเราตรวจพบว่า URL เว็บฮุคของคุณมีข้อผิดพลาดในขณะที่เราพยายามส่งคำขอ เราจะส่งอีเมลแจ้งเตือนให้คุณสัปดาห์ละครั้งเป็นการให้เกียรติ
### คุณรองรับเว็บฮุกหรือไม่ {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
    กำลังมองหาคู่มือเกี่ยวกับเว็บฮุกบาวน์ซ์อยู่หรือไม่? ดูที่ <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">คุณรองรับเว็บฮุกบาวน์ซ์หรือไม่?</a> เพื่อข้อมูลเพิ่มเติม
  <span>
  </span>
</div>

ใช่ ตั้งแต่วันที่ 15 พฤษภาคม 2020 เราได้เพิ่มฟีเจอร์นี้แล้ว คุณสามารถเพิ่มเว็บฮุกได้เหมือนกับที่คุณทำกับผู้รับอีเมลทุกคน! โปรดตรวจสอบให้แน่ใจว่าคุณมีโปรโตคอล "http" หรือ "https" นำหน้าที่ URL ของเว็บฮุก

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    การปกป้องความเป็นส่วนตัวที่เพิ่มขึ้น:
  </strong>
  <span>
    หากคุณใช้แผนชำระเงิน (ซึ่งมีฟีเจอร์การปกป้องความเป็นส่วนตัวที่เพิ่มขึ้น) กรุณาไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> และคลิกที่ "นามแฝง" ข้างโดเมนของคุณเพื่อกำหนดค่าเว็บฮุกของคุณ หากคุณต้องการเรียนรู้เพิ่มเติมเกี่ยวกับแผนชำระเงิน ดูที่หน้า <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">ราคา</a> ของเรา มิฉะนั้นคุณสามารถทำตามคำแนะนำด้านล่างต่อไปได้
  </span>
</div>

หากคุณใช้แผนฟรี ให้เพิ่มระเบียน DNS <strong class="notranslate">TXT</strong> ใหม่ตามตัวอย่างด้านล่าง:

ตัวอย่างเช่น หากฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `alias@example.com` ถูกส่งต่อไปยัง [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) จุดทดสอบใหม่:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

หรือบางทีคุณอาจต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `example.com` ถูกส่งต่อไปยังจุดปลายทางนี้:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**นี่คือบันทึกเพิ่มเติมเกี่ยวกับเว็บฮุก:**

* หากคุณต้องการตรวจสอบ payload ของเว็บฮุก (เพื่อให้แน่ใจว่ามาจากเซิร์ฟเวอร์ของเรา) คุณสามารถ [แก้ไขชื่อโฮสต์ของไคลเอนต์จากที่อยู่ IP ของไคลเอนต์โดยใช้การค้นหากลับ](https://nodejs.org/api/dns.html#dnspromisesreverseip) – ควรเป็น `mx1.forwardemail.net` หรือ `mx2.forwardemail.net`
  * คุณยังสามารถตรวจสอบ IP กับ [ที่อยู่ IP ที่เราประกาศไว้](#what-are-your-servers-ip-addresses)
  * หากคุณใช้แผนชำระเงิน ให้ไปที่ บัญชีของฉัน → โดเมน → การตั้งค่า → คีย์ตรวจสอบลายเซ็น payload เว็บฮุก เพื่อรับคีย์เว็บฮุกของคุณ
    * คุณสามารถหมุนเวียนคีย์นี้ได้ทุกเมื่อเพื่อความปลอดภัย
    * คำนวณและเปรียบเทียบค่า `X-Webhook-Signature` จากคำขอเว็บฮุกของเรากับค่าที่คำนวณจาก body โดยใช้คีย์นี้ ตัวอย่างวิธีทำมีที่ [โพสต์ Stack Overflow นี้](https://stackoverflow.com/a/68885281)
  * ดูการอภิปรายที่ <https://github.com/forwardemail/free-email-forwarding/issues/235> เพื่อข้อมูลเพิ่มเติม
* หากเว็บฮุกไม่ตอบกลับด้วยรหัสสถานะ `200` เราจะเก็บการตอบกลับไว้ใน [บันทึกข้อผิดพลาดที่สร้างขึ้น](#do-you-store-error-logs) – ซึ่งมีประโยชน์สำหรับการดีบัก
* คำขอ HTTP เว็บฮุกจะลองใหม่สูงสุด 3 ครั้งในแต่ละครั้งที่เชื่อมต่อ SMTP โดยมีเวลาหมดเวลาสูงสุด 60 วินาทีต่อคำขอ POST ต่อจุดปลายทาง **โปรดทราบว่านี่ไม่ได้หมายความว่าจะลองใหม่แค่ 3 ครั้งเท่านั้น** จริงๆ แล้วจะลองใหม่อย่างต่อเนื่องโดยส่งรหัส SMTP 421 (ซึ่งบ่งชี้ให้ผู้ส่งลองใหม่ภายหลัง) หลังจากความพยายาม POST HTTP ล้มเหลวครั้งที่ 3 ซึ่งหมายความว่าอีเมลจะลองใหม่ต่อเนื่องเป็นวันจนกว่าจะได้รับรหัสสถานะ 200
* เราจะลองใหม่โดยอัตโนมัติตามรหัสสถานะและรหัสข้อผิดพลาดเริ่มต้นที่ใช้ใน [วิธี retry ของ superagent](https://ladjs.github.io/superagent/#retrying-requests) (เราเป็นผู้ดูแล)
* เรารวมคำขอ HTTP เว็บฮุกไปยังจุดปลายทางเดียวกันในคำขอเดียวแทนที่จะส่งหลายคำขอเพื่อประหยัดทรัพยากรและเร่งเวลาตอบสนอง ตัวอย่างเช่น หากคุณส่งอีเมลไปยัง <webhook1@example.com>, <webhook2@example.com>, และ <webhook3@example.com> และทั้งหมดนี้ตั้งค่าให้ไปยัง URL จุดปลายทาง *เดียวกันเป๊ะ* จะมีการส่งคำขอเพียงคำขอเดียว เรารวมกันโดยการจับคู่จุดปลายทางอย่างเคร่งครัด
* โปรดทราบว่าเราใช้ไลบรารี [mailparser](https://nodemailer.com/extras/mailparser/) ด้วยวิธี "simpleParser" เพื่อแปลงข้อความเป็นอ็อบเจ็กต์ที่เป็นมิตรกับ JSON
* ค่าของอีเมลดิบในรูปแบบ String จะถูกเก็บเป็นคุณสมบัติ "raw"
* ผลลัพธ์การตรวจสอบการพิสูจน์ตัวตนจะถูกเก็บเป็นคุณสมบัติ "dkim", "spf", "arc", "dmarc", และ "bimi"
* ส่วนหัวอีเมลที่ถูกแยกวิเคราะห์จะถูกเก็บเป็นคุณสมบัติ "headers" – แต่โปรดทราบว่าคุณสามารถใช้ "headerLines" เพื่อความง่ายในการวนลูปและแยกวิเคราะห์
* ผู้รับที่ถูกรวมกลุ่มสำหรับเว็บฮุกนี้จะถูกรวมและเก็บเป็นคุณสมบัติ "recipients"
* ข้อมูลเซสชัน SMTP จะถูกเก็บเป็นคุณสมบัติ "session" ซึ่งประกอบด้วยข้อมูลเกี่ยวกับผู้ส่งข้อความ, เวลาที่ข้อความมาถึง, HELO, และชื่อโฮสต์ของไคลเอนต์ ค่าโฮสต์ของไคลเอนต์ใน `session.clientHostname` จะเป็น FQDN (จากการค้นหา PTR กลับ) หรือเป็น `session.remoteAddress` ที่ห่อด้วยวงเล็บ (เช่น `"[127.0.0.1]"`)
* หากคุณต้องการวิธีด่วนในการรับค่าของ `X-Original-To` คุณสามารถใช้ค่าของ `session.recipient` (ดูตัวอย่างด้านล่าง) ส่วนหัว `X-Original-To` เป็นส่วนหัวที่เราเพิ่มในข้อความเพื่อการดีบักพร้อมผู้รับเดิม (ก่อนการส่งต่อแบบปิดบัง) สำหรับข้อความนั้น
* หากคุณต้องการลบคุณสมบัติ `attachments` และ/หรือ `raw` ออกจาก payload body ให้เพิ่ม `?attachments=false`, `?raw=false`, หรือ `?attachments=false&raw=false` ต่อท้าย URL จุดปลายทางเว็บฮุกของคุณเป็นพารามิเตอร์ querystring (เช่น `https://example.com/webhook?attachments=false&raw=false`)
* หากมีไฟล์แนบ ไฟล์แนบจะถูกเพิ่มเข้าไปในอาร์เรย์ `attachments` โดยมีค่าเป็น Buffer คุณสามารถแปลงกลับเป็นเนื้อหาโดยใช้วิธีการใน JavaScript เช่น:
  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
  <span>
  </span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### คุณรองรับ regular expressions หรือ regex ไหม {#do-you-support-regular-expressions-or-regex}

ใช่ ตั้งแต่วันที่ 27 กันยายน 2021 เราได้เพิ่มฟีเจอร์นี้ คุณสามารถเขียน regular expressions ("regex") เพื่อจับคู่ aliases และทำการแทนที่ได้อย่างง่ายดาย

aliases ที่รองรับ regular expression คือ aliases ที่ขึ้นต้นด้วย `/` และลงท้ายด้วย `/` และผู้รับจะต้องเป็นที่อยู่อีเมลหรือเว็บฮุก ผู้รับยังสามารถรวมการรองรับการแทนที่ regex (เช่น `$1`, `$2`) ได้ด้วย

เรารองรับสอง flag ของ regular expression ได้แก่ `i` และ `g` flag `i` สำหรับไม่สนใจตัวพิมพ์ใหญ่-เล็กเป็นค่าเริ่มต้นถาวรและจะถูกบังคับใช้เสมอ ส่วน flag `g` สำหรับ global สามารถเพิ่มได้โดยการต่อท้าย `/` ด้วย `/g`

โปรดทราบว่าเรายังรองรับ <a href="#can-i-disable-specific-aliases">ฟีเจอร์ปิดใช้งาน alias</a> สำหรับส่วนผู้รับใน regex ด้วย

regular expressions ไม่รองรับใน <a href="/disposable-addresses" target="_blank">โดเมน vanity ทั่วโลก</a> (เนื่องจากอาจเป็นช่องโหว่ด้านความปลอดภัย)

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    การปกป้องความเป็นส่วนตัวที่เพิ่มขึ้น:
  </strong>
  <span>
    หากคุณใช้แผนชำระเงิน (ซึ่งมีฟีเจอร์การปกป้องความเป็นส่วนตัวที่เพิ่มขึ้น) กรุณาไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> และคลิกที่ "Aliases" ข้างโดเมนของคุณเพื่อกำหนดค่า aliases รวมถึงที่มี regular expressions หากคุณต้องการเรียนรู้เพิ่มเติมเกี่ยวกับแผนชำระเงิน โปรดดูที่หน้า <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">ราคา</a> ของเรา
  </span>
</div>

#### ตัวอย่างสำหรับการปกป้องความเป็นส่วนตัวที่เพิ่มขึ้น {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ Alias</th>
      <th>ผลลัพธ์</th>
      <th>ทดสอบ</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>อีเมลไปยัง `linus@example.com` หรือ `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">ดูการทดสอบบน RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>อีเมลไปยัง `24highst@example.com` หรือ `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">ดูการทดสอบบน RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
    เพื่อทดสอบเหล่านี้ที่ <a href="https://regexr.com" class="alert-link">RegExr</a> ให้เขียนนิพจน์ในกล่องด้านบน แล้วพิมพ์ alias ตัวอย่างในกล่องข้อความด้านล่าง หากตรงกัน มันจะเปลี่ยนเป็นสีน้ำเงิน
  <span>
  </span>
</div>

#### ตัวอย่างสำหรับแผนฟรี {#examples-for-the-free-plan}

หากคุณใช้แผนฟรี ให้เพิ่มระเบียน DNS <strong class="notranslate">TXT</strong> ใหม่โดยใช้ตัวอย่างหนึ่งหรือมากกว่าที่ให้ไว้ด้านล่างนี้:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>ตัวอย่างง่าย:</strong> หากฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `linus@example.com` หรือ `torvalds@example.com` ถูกส่งต่อไปยัง `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/Alias</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>ตัวอย่างการแทนที่ชื่อจริง นามสกุล:</strong> สมมติว่าอีเมลของบริษัทคุณทั้งหมดมีรูปแบบ `firstname.lastname@example.com` หากฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยังรูปแบบ `firstname.lastname@example.com` ถูกส่งต่อไปยัง `firstname.lastname@company.com` โดยรองรับการแทนที่ (<a href="https://regexr.com/66hnu" class="alert-link">ดูการทดสอบบน RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>ตัวอย่างการแทนที่ด้วยสัญลักษณ์บวก:</strong> หากฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `info@example.com` หรือ `support@example.com` ถูกส่งต่อไปยัง `user+info@gmail.com` หรือ `user+support@gmail.com` ตามลำดับ (โดยรองรับการแทนที่) (<a href="https://regexr.com/66ho7" class="alert-link">ดูการทดสอบบน RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>ตัวอย่างการแทนที่ querystring ของ Webhook:</strong> บางทีคุณอาจต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `example.com` ไปยัง <a href="#do-you-support-webhooks" class="alert-link">webhook</a> และมีคีย์ querystring แบบไดนามิกชื่อ "to" โดยมีค่าคือส่วนชื่อผู้ใช้ของที่อยู่อีเมล (<a href="https://regexr.com/66ho4" class="alert-link">ดูการทดสอบบน RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>ตัวอย่างการปฏิเสธแบบเงียบ:</strong> หากคุณต้องการให้อีเมลทั้งหมดที่ตรงกับรูปแบบหนึ่งถูกปิดใช้งานและปฏิเสธแบบเงียบ (ผู้ส่งจะเห็นเหมือนข้อความถูกส่งสำเร็จ แต่จริงๆ แล้วไม่ถูกส่งไปไหน) ด้วยรหัสสถานะ `250` (ดู <a href="#can-i-disable-specific-aliases" class="alert-link">ฉันสามารถปิดใช้งานนามแฝงเฉพาะได้หรือไม่</a>) ให้ใช้วิธีเดียวกันนี้โดยใส่เครื่องหมายตกใจเดียว "!".  ซึ่งหมายถึงผู้ส่งว่าข้อความถูกส่งสำเร็จ แต่จริงๆ แล้วไม่ถูกส่งไปไหน (เช่น blackhole หรือ `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>ตัวอย่างการปฏิเสธแบบนุ่มนวล:</strong> หากคุณต้องการให้อีเมลทั้งหมดที่ตรงกับรูปแบบหนึ่งถูกปิดใช้งานและปฏิเสธแบบนุ่มนวลด้วยรหัสสถานะ `421` (ดู <a href="#can-i-disable-specific-aliases" class="alert-link">ฉันสามารถปิดใช้งานนามแฝงเฉพาะได้หรือไม่</a>) ให้ใช้วิธีเดียวกันนี้โดยใส่เครื่องหมายตกใจสองตัว "!!".  ซึ่งหมายถึงผู้ส่งให้ลองส่งอีเมลอีกครั้ง และอีเมลไปยังนามแฝงนี้จะถูกลองส่งใหม่ประมาณ 5 วันก่อนจะปฏิเสธถาวร
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>ตัวอย่างการปฏิเสธอย่างรุนแรง:</strong> หากคุณต้องการให้อีเมลทั้งหมดที่ตรงกับรูปแบบใดรูปแบบหนึ่งถูกปิดใช้งานและปฏิเสธอย่างรุนแรงด้วยรหัสสถานะ `550` (ดู <a href="#can-i-disable-specific-aliases" class="alert-link">ฉันสามารถปิดใช้งานนามแฝงเฉพาะได้หรือไม่</a>) ให้ใช้วิธีเดียวกันนี้โดยใส่เครื่องหมายตกใจสามตัว "!!!" ซึ่งจะแจ้งให้ผู้ส่งทราบถึงข้อผิดพลาดถาวรและอีเมลจะไม่พยายามส่งใหม่ จะถูกปฏิเสธสำหรับนามแฝงนี้
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
    อยากรู้วิธีเขียนนิพจน์ปกติหรือจำเป็นต้องทดสอบการแทนที่ของคุณหรือไม่? คุณสามารถไปที่เว็บไซต์ทดสอบนิพจน์ปกติฟรี <a href="https://regexr.com" class="alert-link">RegExr</a> ที่ <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### ข้อจำกัดการส่งอีเมล SMTP ขาออกของคุณคืออะไร {#what-are-your-outbound-smtp-limits}

เราจำกัดอัตราการส่งของผู้ใช้และโดเมนที่ 300 ข้อความ SMTP ขาออกต่อ 1 วัน ซึ่งเฉลี่ยมากกว่า 9000+ อีเมลในหนึ่งเดือนปฏิทิน หากคุณต้องการเกินจำนวนนี้หรือมีอีเมลขนาดใหญ่เป็นประจำ กรุณา [ติดต่อเรา](https://forwardemail.net/help)

### ฉันต้องได้รับการอนุมัติเพื่อเปิดใช้งาน SMTP หรือไม่ {#do-i-need-approval-to-enable-smtp}

ใช่ โปรดทราบว่าเพื่อรักษาชื่อเสียงของ IP และเพื่อให้แน่ใจว่าสามารถส่งอีเมลได้ Forward Email มีขั้นตอนการตรวจสอบด้วยตนเองสำหรับแต่ละโดเมนเพื่อขออนุมัติการส่ง SMTP ขาออก ส่งอีเมลไปที่ <support@forwardemail.net> หรือเปิด [คำขอความช่วยเหลือ](https://forwardemail.net/help) เพื่อขออนุมัติ โดยปกติจะใช้เวลาน้อยกว่า 24 ชั่วโมง โดยคำขอส่วนใหญ่จะได้รับการอนุมัติภายใน 1-2 ชั่วโมง ในอนาคตอันใกล้นี้เรามุ่งหวังที่จะทำให้กระบวนการนี้เป็นแบบทันทีพร้อมการควบคุมสแปมและการแจ้งเตือนเพิ่มเติม กระบวนการนี้ช่วยให้แน่ใจว่าอีเมลของคุณจะถึงกล่องจดหมายและข้อความของคุณจะไม่ถูกทำเครื่องหมายว่าเป็นสแปม

### การตั้งค่าการกำหนดค่าเซิร์ฟเวอร์ SMTP ของคุณคืออะไร {#what-are-your-smtp-server-configuration-settings}

เซิร์ฟเวอร์ของเราคือ `smtp.forwardemail.net` และยังมีการตรวจสอบบน <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">หน้าสถานะ</a> ของเรา

รองรับทั้ง IPv4 และ IPv6 และสามารถใช้งานได้ผ่านพอร์ต `465` และ `2465` สำหรับ SSL/TLS (แนะนำ) และ `587`, `2587`, `2525` และ `25` สำหรับ TLS (STARTTLS)

**ตั้งแต่เดือนตุลาคม 2025** เรารองรับการเชื่อมต่อ **TLS 1.0 แบบเก่า** บนพอร์ต `2455` (SSL/TLS) และ `2555` (STARTTLS) สำหรับอุปกรณ์เก่าเช่น เครื่องพิมพ์ สแกนเนอร์ กล้อง และไคลเอนต์อีเมลรุ่นเก่าที่ไม่รองรับ TLS เวอร์ชันใหม่ พอร์ตเหล่านี้ถูกจัดเตรียมเป็นทางเลือกแทน Gmail, Yahoo, Outlook และผู้ให้บริการอื่นๆ ที่เลิกสนับสนุนโปรโตคอล TLS รุ่นเก่าแล้ว

> \[!CAUTION]
> **การรองรับ TLS 1.0 แบบเก่า (พอร์ต 2455 และ 2555)**: พอร์ตเหล่านี้ใช้โปรโตคอล TLS 1.0 ที่เลิกใช้แล้วซึ่งมีช่องโหว่ด้านความปลอดภัยที่ทราบ (BEAST, POODLE) ใช้พอร์ตเหล่านี้เฉพาะเมื่ออุปกรณ์ของคุณไม่สามารถรองรับ TLS 1.2 หรือสูงกว่าได้เท่านั้น เราแนะนำอย่างยิ่งให้คุณอัปเกรดเฟิร์มแวร์ของอุปกรณ์หรือเปลี่ยนไปใช้ไคลเอนต์อีเมลรุ่นใหม่เมื่อเป็นไปได้ พอร์ตเหล่านี้มีไว้สำหรับความเข้ากันได้กับฮาร์ดแวร์รุ่นเก่าเท่านั้น (เครื่องพิมพ์เก่า สแกนเนอร์ กล้อง อุปกรณ์ IoT)

|                                     โปรโตคอล                                     | ชื่อโฮสต์                |            พอร์ต            |        IPv4        |        IPv6        | หมายเหตุ                              |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **แนะนำ**                             | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | TLS 1.2+ รุ่นใหม่ (แนะนำ)             |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | รองรับ (แนะนำพอร์ต SSL/TLS `465`)     |
|                             `SSL/TLS` **สำหรับรุ่นเก่าเท่านั้น**                            | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 สำหรับอุปกรณ์เก่าเท่านั้น |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **สำหรับรุ่นเก่าเท่านั้น** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 สำหรับอุปกรณ์เก่าเท่านั้น |
| เข้าสู่ระบบ | ตัวอย่าง                   | คำอธิบาย                                                                                                                                                                                |
| ----------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ชื่อผู้ใช้  | `user@example.com`         | ที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a>               |
| รหัสผ่าน   | `************************` | นามแฝง                                                                                                                                                                                  |

เพื่อส่งอีเมลขาออกด้วย SMTP, **ผู้ใช้ SMTP** ต้องเป็นที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> – และ **รหัสผ่าน SMTP** ต้องเป็นรหัสผ่านที่สร้างขึ้นเฉพาะสำหรับนามแฝง

โปรดดูที่ [คุณรองรับการส่งอีเมลด้วย SMTP หรือไม่](#do-you-support-sending-email-with-smtp) สำหรับคำแนะนำทีละขั้นตอน

### การตั้งค่าการกำหนดค่าของเซิร์ฟเวอร์ IMAP ของคุณคืออะไร {#what-are-your-imap-server-configuration-settings}

เซิร์ฟเวอร์ของเราคือ `imap.forwardemail.net` และยังถูกตรวจสอบบน <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">หน้าสถานะ</a> ของเรา

รองรับทั้ง IPv4 และ IPv6 และสามารถใช้งานได้ผ่านพอร์ต `993` และ `2993` สำหรับ SSL/TLS

|         โปรโตคอล         | ชื่อโฮสต์               |     พอร์ต     |        IPv4        |        IPv6        |
| :-----------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **แนะนำ**       | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| เข้าสู่ระบบ | ตัวอย่าง                   | คำอธิบาย                                                                                                                                                                                |
| ----------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ชื่อผู้ใช้  | `user@example.com`         | ที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a>               |
| รหัสผ่าน   | `************************` | รหัสผ่านที่สร้างขึ้นเฉพาะสำหรับนามแฝง                                                                                                                                                   |

เพื่อเชื่อมต่อกับ IMAP, **ผู้ใช้ IMAP** ต้องเป็นที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> – และ **รหัสผ่าน IMAP** ต้องเป็นรหัสผ่านที่สร้างขึ้นเฉพาะสำหรับนามแฝง

โปรดดูที่ [คุณรองรับการรับอีเมลด้วย IMAP หรือไม่](#do-you-support-receiving-email-with-imap) สำหรับคำแนะนำทีละขั้นตอน

### การตั้งค่าการกำหนดค่าของเซิร์ฟเวอร์ POP3 ของคุณคืออะไร {#what-are-your-pop3-server-configuration-settings}

เซิร์ฟเวอร์ของเราคือ `pop3.forwardemail.net` และยังถูกตรวจสอบบน <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">หน้าสถานะ</a> ของเรา

รองรับทั้ง IPv4 และ IPv6 และสามารถใช้งานได้ผ่านพอร์ต `995` และ `2995` สำหรับ SSL/TLS

|         โปรโตคอล         | ชื่อโฮสต์               |     พอร์ต     |        IPv4        |        IPv6        |
| :-----------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **แนะนำ**       | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Login    | Example                    | Description                                                                                                                                                                               |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`         | ที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a>. |
| Password | `************************` | รหัสผ่านที่สร้างขึ้นเฉพาะสำหรับนามแฝงนั้น                                                                                                                                              |

เพื่อเชื่อมต่อกับ POP3, **ผู้ใช้ POP3** ต้องเป็นที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> – และ **รหัสผ่าน IMAP** ต้องเป็นรหัสผ่านที่สร้างขึ้นเฉพาะสำหรับนามแฝงนั้น

โปรดดูที่ [คุณรองรับ POP3 หรือไม่](#do-you-support-pop3) สำหรับคำแนะนำทีละขั้นตอน

### ฉันจะตั้งค่า autodiscovery อีเมลสำหรับโดเมนของฉันได้อย่างไร {#how-do-i-set-up-email-autodiscovery-for-my-domain}

Autodiscovery อีเมลช่วยให้อีเมลไคลเอนต์ เช่น **Thunderbird**, **Apple Mail**, **Microsoft Outlook**, และอุปกรณ์มือถือ ตรวจจับการตั้งค่าเซิร์ฟเวอร์ IMAP, SMTP, POP3, CalDAV, และ CardDAV ที่ถูกต้องโดยอัตโนมัติเมื่อผู้ใช้เพิ่มบัญชีอีเมลของตน ซึ่งกำหนดโดย [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (อีเมล) และ [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) และใช้ระเบียน DNS SRV

Forward Email เผยแพร่ระเบียน autodiscovery บน `forwardemail.net` คุณสามารถเพิ่มระเบียน SRV โดยตรงไปยังโดเมนของคุณ หรือใช้วิธี CNAME ที่ง่ายกว่า

#### ตัวเลือก A: ระเบียน CNAME (ง่ายที่สุด) {#option-a-cname-records-simplest}

เพิ่มระเบียน CNAME สองระเบียนนี้ไปยัง DNS ของโดเมนคุณ วิธีนี้จะมอบหมาย autodiscovery ให้กับเซิร์ฟเวอร์ของ Forward Email:

|  Type | Name/Host      | Target/Value                    |
| :---: | -------------- | ------------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net`   |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

ระเบียน `autoconfig` ใช้โดย **Thunderbird** และไคลเอนต์ที่ใช้ Mozilla อื่น ๆ ระเบียน `autodiscover` ใช้โดย **Microsoft Outlook**

#### ตัวเลือก B: ระเบียน SRV (โดยตรง) {#option-b-srv-records-direct}

ถ้าคุณต้องการเพิ่มระเบียนโดยตรง (หรือผู้ให้บริการ DNS ของคุณไม่รองรับ CNAME บนซับโดเมน) ให้เพิ่มระเบียน SRV เหล่านี้ไปยังโดเมนของคุณ:

| Type | Name/Host           | Priority | Weight | Port | Target/Value               | Purpose                                |
| :--: | ------------------- | :------: | :----: | :--: | -------------------------- | -------------------------------------- |
|  SRV | `_imaps._tcp`       |     0    |    1   |  993 | `imap.forwardemail.net`    | IMAP ผ่าน SSL/TLS (แนะนำ)              |
|  SRV | `_imap._tcp`        |     0    |    0   |   0  | `.`                        | ปิดใช้งาน IMAP แบบข้อความธรรมดา       |
|  SRV | `_submissions._tcp` |     0    |    1   |  465 | `smtp.forwardemail.net`    | การส่ง SMTP (SSL/TLS, แนะนำ)           |
|  SRV | `_submission._tcp`  |     5    |    1   |  587 | `smtp.forwardemail.net`    | การส่ง SMTP (STARTTLS)                  |
|  SRV | `_pop3s._tcp`       |    10    |    1   |  995 | `pop3.forwardemail.net`    | POP3 ผ่าน SSL/TLS                      |
|  SRV | `_pop3._tcp`        |     0    |    0   |   0  | `.`                        | ปิดใช้งาน POP3 แบบข้อความธรรมดา        |
|  SRV | `_caldavs._tcp`     |     0    |    1   |  443 | `caldav.forwardemail.net`  | CalDAV ผ่าน TLS (ปฏิทิน)                |
|  SRV | `_caldav._tcp`      |     0    |    0   |   0  | `.`                        | ปิดใช้งาน CalDAV แบบข้อความธรรมดา       |
|  SRV | `_carddavs._tcp`    |     0    |    1   |  443 | `carddav.forwardemail.net` | CardDAV ผ่าน TLS (รายชื่อผู้ติดต่อ)      |
|  SRV | `_carddav._tcp`     |     0    |    0   |   0  | `.`                        | ปิดใช้งาน CardDAV แบบข้อความธรรมดา      |
> \[!NOTE]
> IMAP มีค่าความสำคัญต่ำกว่า (0) เมื่อเทียบกับ POP3 (10) ซึ่งบอกให้โปรแกรมอีเมลเลือกใช้ IMAP แทน POP3 เมื่อทั้งสองพร้อมใช้งาน ระเบียนที่มีเป้าหมายเป็น `.` (จุดเดียว) หมายความว่ารูปแบบข้อความธรรมดา (ไม่เข้ารหัส) ของโปรโตคอลเหล่านั้นถูกปิดใช้งานโดยเจตนาตาม [RFC 6186 Section 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4) ระเบียน SRV ของ CalDAV และ CardDAV ปฏิบัติตาม [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) สำหรับการค้นหาอัตโนมัติของปฏิทินและรายชื่อผู้ติดต่อ

#### โปรแกรมอีเมลใดบ้างที่รองรับการค้นหาอัตโนมัติ? {#which-email-clients-support-autodiscovery}

| โปรแกรม           | อีเมล                                            | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | ระเบียน `autoconfig` CNAME หรือ SRV              | ระเบียน `autoconfig` XML หรือ SRV (RFC 6764) |
| Apple Mail (macOS) | ระเบียน SRV (RFC 6186)                           | ระเบียน SRV (RFC 6764)                     |
| Apple Mail (iOS)   | ระเบียน SRV (RFC 6186)                           | ระเบียน SRV (RFC 6764)                     |
| Microsoft Outlook  | ระเบียน `autodiscover` CNAME หรือ SRV `_autodiscover._tcp` | ไม่รองรับ                                |
| GNOME (Evolution)  | ระเบียน SRV (RFC 6186)                           | ระเบียน SRV (RFC 6764)                     |
| KDE (KMail)        | ระเบียน SRV (RFC 6186)                           | ระเบียน SRV (RFC 6764)                     |
| eM Client          | ระเบียน `autoconfig` หรือ `autodiscover`         | ระเบียน SRV (RFC 6764)                     |

> \[!TIP]
> เพื่อความเข้ากันได้ดีที่สุดกับทุกโปรแกรม เราแนะนำให้ใช้ **ตัวเลือก A** (ระเบียน CNAME) ร่วมกับระเบียน SRV จาก **ตัวเลือก B** วิธี CNAME เพียงอย่างเดียวครอบคลุมโปรแกรมอีเมลส่วนใหญ่ ระเบียน SRV ของ CalDAV/CardDAV ช่วยให้โปรแกรมปฏิทินและรายชื่อผู้ติดต่อสามารถค้นหาการตั้งค่าเซิร์ฟเวอร์ของคุณโดยอัตโนมัติได้เช่นกัน


## ความปลอดภัย {#security-1}

### เทคนิคการเสริมความแข็งแกร่งของเซิร์ฟเวอร์ขั้นสูง {#advanced-server-hardening-techniques}

> \[!TIP]
> เรียนรู้เพิ่มเติมเกี่ยวกับโครงสร้างพื้นฐานด้านความปลอดภัยของเราได้ที่ [หน้าความปลอดภัยของเรา](/security)

Forward Email ใช้เทคนิคการเสริมความแข็งแกร่งของเซิร์ฟเวอร์หลายอย่างเพื่อรับประกันความปลอดภัยของโครงสร้างพื้นฐานและข้อมูลของคุณ:

1. **ความปลอดภัยเครือข่าย**:
   * ไฟร์วอลล์ IP tables พร้อมกฎเข้มงวด
   * Fail2ban สำหรับป้องกันการโจมตีแบบบรูทฟอร์ซ
   * การตรวจสอบความปลอดภัยและทดสอบเจาะระบบเป็นประจำ
   * การเข้าถึงผู้ดูแลระบบผ่าน VPN เท่านั้น

2. **การเสริมความแข็งแกร่งของระบบ**:
   * ติดตั้งแพ็กเกจขั้นต่ำสุด
   * อัปเดตความปลอดภัยเป็นประจำ
   * ใช้ SELinux ในโหมดบังคับใช้
   * ปิดการเข้าถึง SSH ด้วย root
   * ใช้การยืนยันตัวตนด้วยกุญแจเท่านั้น

3. **ความปลอดภัยของแอปพลิเคชัน**:
   * ส่วนหัว Content Security Policy (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * ส่วนหัวป้องกัน XSS
   * ส่วนหัวตัวเลือกเฟรมและนโยบายผู้ส่งอ้างอิง
   * ตรวจสอบการพึ่งพาเป็นประจำ

4. **การปกป้องข้อมูล**:
   * การเข้ารหัสดิสก์เต็มรูปแบบด้วย LUKS
   * การจัดการกุญแจอย่างปลอดภัย
   * การสำรองข้อมูลพร้อมการเข้ารหัสเป็นประจำ
   * การปฏิบัติการลดข้อมูลให้น้อยที่สุด

5. **การตรวจสอบและตอบสนอง**:
   * การตรวจจับการบุกรุกแบบเรียลไทม์
   * การสแกนความปลอดภัยอัตโนมัติ
   * การบันทึกและวิเคราะห์แบบรวมศูนย์
   * ขั้นตอนการตอบสนองเหตุการณ์

> \[!IMPORTANT]
> แนวปฏิบัติด้านความปลอดภัยของเราจะได้รับการอัปเดตอย่างต่อเนื่องเพื่อรับมือกับภัยคุกคามและช่องโหว่ที่เกิดขึ้นใหม่

> \[!TIP]
> เพื่อความปลอดภัยสูงสุด เราแนะนำให้ใช้บริการของเราควบคู่กับการเข้ารหัสแบบ end-to-end ผ่าน OpenPGP

### คุณมีใบรับรอง SOC 2 หรือ ISO 27001 หรือไม่ {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email ดำเนินงานบนโครงสร้างพื้นฐานที่จัดหาโดยผู้ให้บริการรองที่ได้รับการรับรองเพื่อให้เป็นไปตามมาตรฐานอุตสาหกรรม

Forward Email ไม่มีใบรับรอง SOC 2 Type II หรือ ISO 27001 โดยตรง แต่บริการดำเนินงานบนโครงสร้างพื้นฐานที่จัดหาโดยผู้ให้บริการรองที่ได้รับการรับรอง:

* **DigitalOcean**: ได้รับการรับรอง SOC 2 Type II และ SOC 3 Type II (ตรวจสอบโดย Schellman & Company LLC) และได้รับการรับรอง ISO 27001 ที่ศูนย์ข้อมูลหลายแห่ง รายละเอียด: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: ได้รับการรับรอง SOC 2+ (HIPAA), ใบรับรอง ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019 รายละเอียด: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: ปฏิบัติตาม SOC 2 (ติดต่อ DataPacket โดยตรงเพื่อขอใบรับรอง), ผู้ให้บริการโครงสร้างพื้นฐานระดับองค์กร (สถานที่ตั้งที่ Denver) รายละเอียด: <https://www.datapacket.com/datacenters/denver>

Forward Email ปฏิบัติตามแนวทางปฏิบัติที่ดีที่สุดในอุตสาหกรรมสำหรับการตรวจสอบความปลอดภัยและมีการติดต่อกับนักวิจัยด้านความปลอดภัยอิสระอย่างสม่ำเสมอ แหล่งที่มา: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### คุณใช้การเข้ารหัส TLS สำหรับการส่งต่ออีเมลหรือไม่ {#do-you-use-tls-encryption-for-email-forwarding}

ใช่ Forward Email บังคับใช้ TLS 1.2+ อย่างเข้มงวดสำหรับการเชื่อมต่อทั้งหมด (HTTPS, SMTP, IMAP, POP3) และใช้ MTA-STS เพื่อเพิ่มการสนับสนุน TLS การใช้งานประกอบด้วย:

* การบังคับใช้ TLS 1.2+ สำหรับการเชื่อมต่ออีเมลทั้งหมด
* การแลกเปลี่ยนกุญแจ ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) เพื่อความลับสมบูรณ์แบบล่วงหน้า
* ชุดรหัสลับสมัยใหม่พร้อมการอัปเดตความปลอดภัยอย่างสม่ำเสมอ
* การสนับสนุน HTTP/2 เพื่อประสิทธิภาพและความปลอดภัยที่ดีขึ้น
* HSTS (HTTP Strict Transport Security) พร้อมการโหลดล่วงหน้าในเบราว์เซอร์หลัก
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** สำหรับการบังคับใช้ TLS อย่างเข้มงวด

แหล่งที่มา: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**การใช้งาน MTA-STS**: Forward Email ใช้การบังคับใช้ MTA-STS อย่างเข้มงวดในฐานรหัส เมื่อเกิดข้อผิดพลาด TLS และมีการบังคับใช้ MTA-STS ระบบจะส่งรหัสสถานะ SMTP 421 เพื่อให้แน่ใจว่าอีเมลจะถูกลองส่งใหม่ในภายหลังแทนที่จะส่งแบบไม่ปลอดภัย รายละเอียดการใช้งาน:

* การตรวจจับข้อผิดพลาด TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* การบังคับใช้ MTA-STS ในตัวช่วยส่งอีเมล: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

การตรวจสอบโดยบุคคลที่สาม: <https://www.hardenize.com/report/forwardemail.net/1750312779> แสดงการให้คะแนน "ดี" สำหรับมาตรการ TLS และความปลอดภัยในการขนส่งทั้งหมด

### คุณเก็บรักษาหัวข้อการตรวจสอบสิทธิ์อีเมลหรือไม่ {#do-you-preserve-email-authentication-headers}

ใช่ Forward Email ใช้และเก็บรักษาหัวข้อการตรวจสอบสิทธิ์อีเมลอย่างครบถ้วน:

* **SPF (Sender Policy Framework)**: ใช้งานและเก็บรักษาอย่างถูกต้อง
* **DKIM (DomainKeys Identified Mail)**: รองรับเต็มรูปแบบพร้อมการจัดการกุญแจอย่างเหมาะสม
* **DMARC**: บังคับใช้นโยบายสำหรับอีเมลที่ล้มเหลวในการตรวจสอบ SPF หรือ DKIM
* **ARC**: แม้จะไม่ได้ระบุอย่างชัดเจน แต่คะแนนการปฏิบัติตามอย่างสมบูรณ์แบบของบริการบ่งชี้ว่ามีการจัดการหัวข้อการตรวจสอบสิทธิ์อย่างครบถ้วน

แหล่งที่มา: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

การตรวจสอบ: การทดสอบอีเมล Internet.nl แสดงคะแนน 100/100 สำหรับการใช้งาน "SPF, DKIM, และ DMARC" โดยเฉพาะ การประเมิน Hardenize ยืนยันการให้คะแนน "ดี" สำหรับ SPF และ DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### คุณเก็บรักษาหัวข้ออีเมลต้นฉบับและป้องกันการปลอมแปลงหรือไม่ {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email ใช้การป้องกันการปลอมแปลงขั้นสูงเพื่อป้องกันการใช้งานอีเมลในทางที่ผิด

Forward Email เก็บรักษาหัวข้ออีเมลต้นฉบับในขณะที่ใช้การป้องกันการปลอมแปลงอย่างครบถ้วนผ่านฐานรหัส MX:

* **การเก็บรักษาหัวข้อ**: หัวข้อการตรวจสอบสิทธิ์ต้นฉบับถูกเก็บรักษาไว้ในระหว่างการส่งต่อ
* **การป้องกันการปลอมแปลง**: การบังคับใช้นโยบาย DMARC ป้องกันการปลอมแปลงหัวข้อโดยการปฏิเสธอีเมลที่ล้มเหลวในการตรวจสอบ SPF หรือ DKIM
* **การป้องกันการฉีดหัวข้อ**: การตรวจสอบและทำความสะอาดข้อมูลนำเข้าโดยใช้ไลบรารี striptags
* **การป้องกันขั้นสูง**: การตรวจจับฟิชชิ่งขั้นสูงพร้อมการตรวจจับการปลอมแปลง, การป้องกันการแอบอ้างตัวตน และระบบแจ้งเตือนผู้ใช้

**รายละเอียดการใช้งาน MX**: ตรรกะการประมวลผลอีเมลหลักถูกจัดการโดยฐานรหัสเซิร์ฟเวอร์ MX โดยเฉพาะ:

* ตัวจัดการข้อมูล MX หลัก: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* การกรองอีเมลโดยพลการ (ป้องกันการปลอมแปลง): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

ตัวช่วย `isArbitrary` ใช้กฎการป้องกันการปลอมแปลงขั้นสูงรวมถึงการตรวจจับการแอบอ้างโดเมน, วลีที่ถูกบล็อก และรูปแบบฟิชชิ่งต่างๆ
### คุณป้องกันสแปมและการละเมิดอย่างไร {#how-do-you-protect-against-spam-and-abuse}

Forward Email ใช้มาตรการป้องกันหลายชั้นอย่างครอบคลุม:

* **การจำกัดอัตรา**: ใช้กับการพยายามยืนยันตัวตน, จุดเชื่อมต่อ API, และการเชื่อมต่อ SMTP
* **การแยกทรัพยากร**: ระหว่างผู้ใช้เพื่อป้องกันผลกระทบจากผู้ใช้ที่มีปริมาณสูง
* **การป้องกัน DDoS**: การป้องกันหลายชั้นผ่านระบบ Shield ของ DataPacket และ Cloudflare
* **การปรับขนาดอัตโนมัติ**: การปรับทรัพยากรแบบไดนามิกตามความต้องการ
* **การป้องกันการละเมิด**: การตรวจสอบการละเมิดเฉพาะผู้ใช้และการบล็อกเนื้อหาที่เป็นอันตรายโดยใช้แฮช
* **การยืนยันตัวตนอีเมล**: โปรโตคอล SPF, DKIM, DMARC พร้อมการตรวจจับฟิชชิ่งขั้นสูง

แหล่งข้อมูล:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (รายละเอียดการป้องกัน DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### คุณเก็บเนื้อหาอีเมลไว้บนดิสก์หรือไม่ {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email ใช้สถาปัตยกรรมแบบ zero-knowledge ที่ป้องกันไม่ให้เนื้อหาอีเมลถูกเขียนลงดิสก์

* **สถาปัตยกรรมแบบ Zero-Knowledge**: กล่องจดหมาย SQLite ที่เข้ารหัสแยกแต่ละบุคคลหมายความว่า Forward Email ไม่สามารถเข้าถึงเนื้อหาอีเมลได้
* **การประมวลผลในหน่วยความจำ**: การประมวลผลอีเมลเกิดขึ้นทั้งหมดในหน่วยความจำโดยไม่เก็บลงดิสก์
* **ไม่มีการบันทึกเนื้อหา**: "เราไม่บันทึกหรือเก็บเนื้อหาอีเมลหรือเมตาดาต้าลงดิสก์"
* **การเข้ารหัสแบบแซนด์บ็อกซ์**: กุญแจเข้ารหัสไม่เคยถูกเก็บในรูปแบบข้อความธรรมดาบนดิสก์

**หลักฐานจากโค้ด MX**: เซิร์ฟเวอร์ MX ประมวลผลอีเมลทั้งหมดในหน่วยความจำโดยไม่เขียนเนื้อหาลงดิสก์ ตัวจัดการการประมวลผลอีเมลหลักแสดงวิธีการนี้: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

แหล่งข้อมูล:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (บทคัดย่อ)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (รายละเอียด zero-knowledge)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (การเข้ารหัสแบบแซนด์บ็อกซ์)

### เนื้อหาอีเมลสามารถถูกเปิดเผยในระหว่างระบบล่มได้หรือไม่ {#can-email-content-be-exposed-during-system-crashes}

ไม่ได้ Forward Email ใช้มาตรการป้องกันอย่างครอบคลุมเพื่อป้องกันการเปิดเผยข้อมูลจากการล่มของระบบ:

* **ปิดการใช้งาน Core Dumps**: ป้องกันการเปิดเผยหน่วยความจำในระหว่างล่ม
* **ปิดการใช้งาน Swap Memory**: ปิดใช้งานอย่างสมบูรณ์เพื่อป้องกันการดึงข้อมูลที่ละเอียดอ่อนจากไฟล์ swap
* **สถาปัตยกรรมในหน่วยความจำ**: เนื้อหาอีเมลมีอยู่เฉพาะในหน่วยความจำชั่วคราวในระหว่างการประมวลผล
* **การปกป้องกุญแจเข้ารหัส**: กุญแจไม่เคยถูกเก็บในรูปแบบข้อความธรรมดาบนดิสก์
* **ความปลอดภัยทางกายภาพ**: ดิสก์เข้ารหัส LUKS v2 ป้องกันการเข้าถึงข้อมูลทางกายภาพ
* **ปิดการใช้งาน USB Storage**: ป้องกันการดึงข้อมูลโดยไม่ได้รับอนุญาต

**การจัดการข้อผิดพลาดสำหรับปัญหาระบบ**: Forward Email ใช้ฟังก์ชันช่วย `isCodeBug` และ `isTimeoutError` เพื่อให้แน่ใจว่าหากเกิดปัญหาการเชื่อมต่อฐานข้อมูล, ปัญหาเครือข่าย DNS/บล็อกลิสต์ หรือปัญหาการเชื่อมต่อกับระบบต้นทาง ระบบจะส่งรหัสสถานะ SMTP 421 เพื่อให้แน่ใจว่าอีเมลจะถูกลองส่งใหม่ในภายหลังแทนที่จะสูญหายหรือถูกเปิดเผย

รายละเอียดการใช้งาน:

* การจำแนกข้อผิดพลาด: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* การจัดการข้อผิดพลาด timeout ในการประมวลผล MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

แหล่งที่มา: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### ใครสามารถเข้าถึงโครงสร้างพื้นฐานอีเมลของคุณได้บ้าง {#who-has-access-to-your-email-infrastructure}

Forward Email ใช้มาตรการควบคุมการเข้าถึงอย่างครอบคลุมสำหรับทีมวิศวกรรมขนาดเล็ก 2-3 คน โดยมีข้อกำหนด 2FA อย่างเข้มงวด:

* **การควบคุมการเข้าถึงตามบทบาท**: สำหรับบัญชีทีมพร้อมสิทธิ์ตามทรัพยากร
* **หลักการสิทธิ์น้อยที่สุด**: ใช้กับทุกระบบ
* **การแยกหน้าที่**: ระหว่างบทบาทการปฏิบัติงาน
* **การจัดการผู้ใช้**: ผู้ใช้ deploy และ devops แยกกันพร้อมสิทธิ์ที่แตกต่างกัน
* **ปิดการใช้งานการเข้าสู่ระบบ root**: บังคับให้เข้าถึงผ่านบัญชีที่ได้รับการยืนยันตัวตนอย่างถูกต้อง
* **2FA อย่างเข้มงวด**: ไม่มี 2FA ผ่าน SMS เนื่องจากความเสี่ยงของการโจมตี MiTM — ใช้เฉพาะแอปหรือโทเค็นฮาร์ดแวร์เท่านั้น
* **การบันทึกตรวจสอบอย่างครอบคลุม**: พร้อมการลบข้อมูลที่ละเอียดอ่อน
* **การตรวจจับความผิดปกติอัตโนมัติ**: สำหรับรูปแบบการเข้าถึงที่ผิดปกติ
* **การตรวจสอบความปลอดภัยเป็นประจำ**: ของบันทึกการเข้าถึง
* **การป้องกันการโจมตี Evil Maid**: ปิดการใช้งาน USB storage และมาตรการความปลอดภัยทางกายภาพอื่นๆ
Sources:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (การควบคุมการอนุญาต)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (ความปลอดภัยของเครือข่าย)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (การป้องกันการโจมตีแบบ evil maid)

### ผู้ให้บริการโครงสร้างพื้นฐานที่คุณใช้คือใคร {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email ใช้ผู้ประมวลผลย่อยโครงสร้างพื้นฐานหลายรายที่มีใบรับรองการปฏิบัติตามข้อกำหนดอย่างครบถ้วน

รายละเอียดครบถ้วนสามารถดูได้ที่หน้าการปฏิบัติตาม GDPR ของเรา: <https://forwardemail.net/gdpr>

**ผู้ประมวลผลย่อยโครงสร้างพื้นฐานหลัก:**

| ผู้ให้บริการ      | ได้รับการรับรองกรอบความเป็นส่วนตัวข้อมูล | หน้าการปฏิบัติตาม GDPR                                                                       |
| ---------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ ใช่                                   | <https://www.cloudflare.com/trust-hub/gdpr/>                                                 |
| **DataPacket**   | ❌ ไม่ใช่                                | <https://www.datapacket.com/privacy-policy>                                                  |
| **DigitalOcean** | ❌ ไม่ใช่                                | <https://www.digitalocean.com/legal/gdpr>                                                    |
| **GitHub**       | ✅ ใช่                                   | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>   |
| **Vultr**        | ❌ ไม่ใช่                                | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                              |

**ใบรับรองโดยละเอียด:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (ตรวจสอบโดย Schellman & Company LLC)
* ได้รับการรับรอง ISO 27001 ที่ศูนย์ข้อมูลหลายแห่ง
* ปฏิบัติตาม PCI-DSS
* ได้รับการรับรอง CSA STAR ระดับ 1
* ได้รับการรับรอง APEC CBPR PRP
* รายละเอียด: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* ได้รับการรับรอง SOC 2+ (HIPAA)
* ปฏิบัติตาม PCI Merchant
* ได้รับการรับรอง CSA STAR ระดับ 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* รายละเอียด: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* ปฏิบัติตาม SOC 2 (ติดต่อ DataPacket โดยตรงเพื่อขอใบรับรอง)
* โครงสร้างพื้นฐานระดับองค์กร (ที่ตั้งเดนเวอร์)
* การป้องกัน DDoS ผ่านชุดความปลอดภัยไซเบอร์ Shield
* สนับสนุนทางเทคนิคตลอด 24/7
* เครือข่ายทั่วโลกครอบคลุม 58 ศูนย์ข้อมูล
* รายละเอียด: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* ได้รับการรับรองกรอบความเป็นส่วนตัวข้อมูล (EU-U.S., Swiss-U.S., และ UK Extension)
* โฮสต์ซอร์สโค้ด, CI/CD, และการจัดการโครงการ
* มีข้อตกลงการปกป้องข้อมูลของ GitHub
* รายละเอียด: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**ผู้ประมวลผลการชำระเงิน:**

* **Stripe**: ได้รับการรับรองกรอบความเป็นส่วนตัวข้อมูล - <https://stripe.com/legal/privacy-center>
* **PayPal**: ไม่ได้รับการรับรอง DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### คุณมีข้อตกลงการประมวลผลข้อมูล (DPA) หรือไม่ {#do-you-offer-a-data-processing-agreement-dpa}

ใช่ Forward Email มีข้อตกลงการประมวลผลข้อมูล (DPA) ที่ครอบคลุมซึ่งสามารถลงนามได้พร้อมกับข้อตกลงองค์กรของเรา สำเนาของ DPA ของเราสามารถดูได้ที่: <https://forwardemail.net/dpa>

**รายละเอียด DPA:**

* ครอบคลุมการปฏิบัติตาม GDPR และกรอบความเป็นส่วนตัว EU-US/Swiss-US Privacy Shield
* ยอมรับโดยอัตโนมัติเมื่อยอมรับข้อกำหนดในการให้บริการของเรา
* ไม่ต้องลงนามแยกสำหรับ DPA มาตรฐาน
* มีการจัดการ DPA แบบกำหนดเองผ่านใบอนุญาตองค์กร

**กรอบการปฏิบัติตาม GDPR:**
DPA ของเรารายงานการปฏิบัติตาม GDPR รวมถึงข้อกำหนดการโอนข้อมูลระหว่างประเทศ ข้อมูลครบถ้วนสามารถดูได้ที่: <https://forwardemail.net/gdpr>

สำหรับลูกค้าองค์กรที่ต้องการเงื่อนไข DPA แบบกำหนดเองหรือข้อตกลงสัญญาเฉพาะ สามารถจัดการได้ผ่านโปรแกรม **ใบอนุญาตองค์กร ($250/เดือน)** ของเรา

### คุณจัดการการแจ้งเตือนการละเมิดข้อมูลอย่างไร {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> สถาปัตยกรรมแบบ zero-knowledge ของ Forward Email ช่วยจำกัดผลกระทบจากการละเมิดข้อมูลอย่างมาก
* **การเปิดเผยข้อมูลอย่างจำกัด**: ไม่สามารถเข้าถึงเนื้อหาอีเมลที่เข้ารหัสได้เนื่องจากสถาปัตยกรรมแบบ zero-knowledge
* **การเก็บรวบรวมข้อมูลอย่างน้อยที่สุด**: เก็บข้อมูลผู้สมัครสมาชิกพื้นฐานและบันทึก IP จำกัดเพื่อความปลอดภัย
* **กรอบการทำงานของผู้ประมวลผลข้อมูลรอง**: DigitalOcean, GitHub และ Vultr มีขั้นตอนตอบสนองเหตุการณ์ที่สอดคล้องกับ GDPR

**ข้อมูลตัวแทน GDPR:**
Forward Email ได้แต่งตั้งตัวแทน GDPR ตามข้อ 27:

**ตัวแทนสหภาพยุโรป:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**ตัวแทนสหราชอาณาจักร:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

สำหรับลูกค้าองค์กรที่ต้องการ SLA การแจ้งเตือนการละเมิดเฉพาะ ควรหารือเป็นส่วนหนึ่งของข้อตกลง **Enterprise License**

แหล่งที่มา:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### คุณมีสภาพแวดล้อมทดสอบให้หรือไม่ {#do-you-offer-a-test-environment}

เอกสารทางเทคนิคของ Forward Email ไม่ได้ระบุอย่างชัดเจนถึงโหมด sandbox เฉพาะ อย่างไรก็ตาม วิธีการทดสอบที่เป็นไปได้ ได้แก่:

* **ตัวเลือกโฮสต์ด้วยตนเอง**: ความสามารถในการโฮสต์ด้วยตนเองอย่างครบถ้วนสำหรับสร้างสภาพแวดล้อมทดสอบ
* **อินเทอร์เฟซ API**: มีศักยภาพสำหรับการทดสอบการตั้งค่าแบบโปรแกรม
* **โอเพนซอร์ส**: โค้ด 100% แบบโอเพนซอร์สช่วยให้ลูกค้าสามารถตรวจสอบตรรกะการส่งต่อได้
* **หลายโดเมน**: รองรับหลายโดเมนอาจช่วยให้สร้างโดเมนทดสอบได้

สำหรับลูกค้าองค์กรที่ต้องการความสามารถ sandbox อย่างเป็นทางการ ควรหารือเป็นส่วนหนึ่งของข้อตกลง **Enterprise License**

แหล่งที่มา: <https://github.com/forwardemail/forwardemail.net> (รายละเอียดสภาพแวดล้อมการพัฒนา)

### คุณมีเครื่องมือสำหรับการตรวจสอบและแจ้งเตือนหรือไม่ {#do-you-provide-monitoring-and-alerting-tools}

Forward Email มีการตรวจสอบแบบเรียลไทม์พร้อมข้อจำกัดบางประการ:

**มีให้ใช้งาน:**

* **การตรวจสอบการส่งแบบเรียลไทม์**: เมตริกประสิทธิภาพที่เปิดเผยต่อสาธารณะสำหรับผู้ให้บริการอีเมลหลัก
* **การแจ้งเตือนอัตโนมัติ**: ทีมวิศวกรรมได้รับแจ้งเมื่อเวลาการส่งเกิน 10 วินาที
* **การตรวจสอบที่โปร่งใส**: ระบบตรวจสอบแบบโอเพนซอร์ส 100%
* **การตรวจสอบโครงสร้างพื้นฐาน**: การตรวจจับความผิดปกติอัตโนมัติและบันทึกการตรวจสอบอย่างครบถ้วน

**ข้อจำกัด:**

* ไม่มีเอกสารชัดเจนเกี่ยวกับ webhook สำหรับลูกค้าหรือการแจ้งสถานะการส่งผ่าน API

สำหรับลูกค้าองค์กรที่ต้องการ webhook สถานะการส่งโดยละเอียดหรือการผสานรวมการตรวจสอบแบบกำหนดเอง ความสามารถเหล่านี้อาจมีให้ผ่านข้อตกลง **Enterprise License**

แหล่งที่มา:

* <https://forwardemail.net> (การแสดงผลการตรวจสอบแบบเรียลไทม์)
* <https://github.com/forwardemail/forwardemail.net> (การใช้งานการตรวจสอบ)

### คุณรับประกันความพร้อมใช้งานสูงอย่างไร {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email ใช้ระบบสำรองข้อมูลอย่างครบถ้วนผ่านผู้ให้บริการโครงสร้างพื้นฐานหลายราย

* **โครงสร้างพื้นฐานแบบกระจาย**: ผู้ให้บริการหลายราย (DigitalOcean, Vultr, DataPacket) ในหลายภูมิภาค
* **การกระจายโหลดตามภูมิศาสตร์**: การกระจายโหลดตามตำแหน่งทางภูมิศาสตร์โดย Cloudflare พร้อมการสลับสำรองอัตโนมัติ
* **การปรับขนาดอัตโนมัติ**: การปรับทรัพยากรแบบไดนามิกตามความต้องการ
* **การป้องกัน DDoS หลายชั้น**: ผ่านระบบ Shield ของ DataPacket และ Cloudflare
* **การสำรองเซิร์ฟเวอร์**: เซิร์ฟเวอร์หลายเครื่องต่อภูมิภาคพร้อมการสลับสำรองอัตโนมัติ
* **การทำสำเนาฐานข้อมูล**: การซิงโครไนซ์ข้อมูลแบบเรียลไทม์ในหลายสถานที่
* **การตรวจสอบและแจ้งเตือน**: การตรวจสอบตลอด 24/7 พร้อมการตอบสนองเหตุการณ์อัตโนมัติ

**การรับประกันเวลาทำงาน**: ความพร้อมให้บริการมากกว่า 99.9% พร้อมการตรวจสอบที่โปร่งใสที่ <https://forwardemail.net>

แหล่งที่มา:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### คุณปฏิบัติตามมาตรา 889 ของพระราชบัญญัติอนุมัติการป้องกันประเทศแห่งชาติ (NDAA) หรือไม่ {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email ปฏิบัติตามมาตรา 889 อย่างเต็มที่ผ่านการคัดเลือกพันธมิตรโครงสร้างพื้นฐานอย่างรอบคอบ

ใช่ Forward Email ปฏิบัติตาม **มาตรา 889** มาตรา 889 ของพระราชบัญญัติอนุมัติการป้องกันประเทศแห่งชาติ (NDAA) ห้ามหน่วยงานรัฐบาลใช้หรือทำสัญญากับหน่วยงานที่ใช้เครื่องมือโทรคมนาคมและกล้องวงจรปิดจากบริษัทเฉพาะ (Huawei, ZTE, Hikvision, Dahua และ Hytera)
**วิธีที่ Forward Email ปฏิบัติตามข้อกำหนด Section 889:**

Forward Email พึ่งพาผู้ให้บริการโครงสร้างพื้นฐานหลักสองรายเท่านั้น ซึ่งไม่มีรายใดใช้เครื่องมือที่ถูกห้ามตาม Section 889:

1. **Cloudflare**: พันธมิตรหลักของเราสำหรับบริการเครือข่ายและความปลอดภัยอีเมล
2. **DataPacket**: ผู้ให้บริการหลักของเราในด้านโครงสร้างพื้นฐานเซิร์ฟเวอร์ (ใช้เฉพาะอุปกรณ์จาก Arista Networks และ Cisco)
3. **ผู้ให้บริการสำรองข้อมูล**: ผู้ให้บริการสำรองข้อมูลของเรา Digital Ocean และ Vultr ได้รับการยืนยันเป็นลายลักษณ์อักษรว่าปฏิบัติตาม Section 889

**คำมั่นสัญญาของ Cloudflare**: Cloudflare ระบุอย่างชัดเจนในรหัสจรรยาบรรณของบุคคลที่สามว่าพวกเขาไม่ใช้เครื่องมือสื่อสาร โทรทัศน์วงจรปิด หรือบริการจากหน่วยงานที่ถูกห้ามตาม Section 889

**กรณีการใช้งานของรัฐบาล**: การปฏิบัติตาม Section 889 ของเราได้รับการตรวจสอบเมื่อ **US Naval Academy** เลือกใช้ Forward Email สำหรับความต้องการการส่งต่ออีเมลที่ปลอดภัย โดยต้องการเอกสารแสดงมาตรฐานการปฏิบัติตามของรัฐบาลกลาง

สำหรับรายละเอียดครบถ้วนเกี่ยวกับกรอบการปฏิบัติตามของรัฐบาล รวมถึงกฎระเบียบของรัฐบาลกลางเพิ่มเติม โปรดอ่านกรณีศึกษาฉบับสมบูรณ์ของเรา: [บริการอีเมลรัฐบาลกลางที่ปฏิบัติตาม Section 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## รายละเอียดระบบและเทคนิค {#system-and-technical-details}

### คุณเก็บอีเมลและเนื้อหาของอีเมลหรือไม่ {#do-you-store-emails-and-their-contents}

ไม่ เราไม่เขียนลงดิสก์หรือเก็บบันทึก – ยกเว้น [ข้อผิดพลาด](#do-you-store-error-logs) และ [SMTP ขาออก](#do-you-support-sending-email-with-smtp) (ดู [นโยบายความเป็นส่วนตัว](/privacy))

ทุกอย่างทำงานในหน่วยความจำ และ [ซอร์สโค้ดของเราอยู่บน GitHub](https://github.com/forwardemail)

### ระบบส่งต่ออีเมลของคุณทำงานอย่างไร {#how-does-your-email-forwarding-system-work}

อีเมลใช้ [โปรโตคอล SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) โปรโตคอลนี้ประกอบด้วยคำสั่งที่ส่งไปยังเซิร์ฟเวอร์ (โดยทั่วไปจะทำงานบนพอร์ต 25) มีการเชื่อมต่อเริ่มต้น จากนั้นผู้ส่งจะระบุว่าเมลมาจากใคร ("MAIL FROM") ตามด้วยที่อยู่ปลายทาง ("RCPT TO") และสุดท้ายคือส่วนหัวและเนื้อหาของอีเมล ("DATA") ลำดับการทำงานของระบบส่งต่ออีเมลของเราจะอธิบายตามคำสั่งโปรโตคอล SMTP แต่ละคำสั่งดังนี้:

* การเชื่อมต่อเริ่มต้น (ไม่มีชื่อคำสั่ง เช่น `telnet example.com 25`) – นี่คือการเชื่อมต่อเริ่มต้น เราตรวจสอบผู้ส่งที่ไม่ได้อยู่ใน [allowlist](#do-you-have-an-allowlist) ของเรากับ [denylist](#do-you-have-a-denylist) ของเรา สุดท้าย หากผู้ส่งไม่อยู่ใน allowlist เราจะตรวจสอบว่าพวกเขาอยู่ใน [greylist](#do-you-have-a-greylist) หรือไม่

* `HELO` – เป็นการทักทายเพื่อระบุ FQDN, ที่อยู่ IP หรือชื่อผู้จัดการเมลของผู้ส่ง ค่านี้สามารถปลอมแปลงได้ ดังนั้นเราจึงไม่พึ่งพาข้อมูลนี้ แต่ใช้การค้นหาชื่อโฮสต์ย้อนกลับของที่อยู่ IP ที่เชื่อมต่อแทน

* `MAIL FROM` – ระบุที่อยู่อีเมลของซองจดหมายต้นทาง หากมีการป้อนค่า ต้องเป็นที่อยู่อีเมลที่ถูกต้องตาม RFC 5322 ค่าที่ว่างเปล่าถูกอนุญาต เรา [ตรวจสอบ backscatter](#how-do-you-protect-against-backscatter) ที่นี่ และยังตรวจสอบ MAIL FROM กับ [denylist](#do-you-have-a-denylist) ของเรา สุดท้ายเราตรวจสอบผู้ส่งที่ไม่อยู่ใน allowlist สำหรับการจำกัดอัตรา (ดูส่วน [Rate Limiting](#do-you-have-rate-limiting) และ [allowlist](#do-you-have-an-allowlist) สำหรับข้อมูลเพิ่มเติม)

* `RCPT TO` – ระบุผู้รับอีเมล ต้องเป็นที่อยู่อีเมลที่ถูกต้องตาม RFC 5322 เราอนุญาตผู้รับในซองจดหมายสูงสุด 50 รายต่อข้อความ (ซึ่งแตกต่างจากส่วนหัว "To" ในอีเมล) เรายังตรวจสอบที่อยู่ [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") ที่ถูกต้องที่นี่เพื่อป้องกันการปลอมแปลงด้วยชื่อโดเมน SRS ของเรา

* `DATA` – นี่คือส่วนสำคัญของบริการของเราที่ประมวลผลอีเมล ดูส่วน [How do you process an email for forwarding](#how-do-you-process-an-email-for-forwarding) ด้านล่างเพื่อข้อมูลเชิงลึกเพิ่มเติม
### คุณประมวลผลอีเมลสำหรับการส่งต่ออย่างไร {#how-do-you-process-an-email-for-forwarding}

ส่วนนี้อธิบายกระบวนการของเราที่เกี่ยวข้องกับคำสั่งโปรโตคอล SMTP `DATA` ในส่วน [ระบบส่งต่ออีเมลของคุณทำงานอย่างไร](#how-does-your-email-forwarding-system-work) ข้างต้น – ซึ่งเป็นวิธีที่เราประมวลผลส่วนหัวอีเมล เนื้อหา ความปลอดภัย กำหนดว่าต้องส่งไปที่ใด และวิธีที่เราจัดการการเชื่อมต่อ

1. หากข้อความมีขนาดเกินขนาดสูงสุด 50mb จะถูกปฏิเสธด้วยรหัสข้อผิดพลาด 552

2. หากข้อความไม่มีส่วนหัว "From" หรือหากค่าต่างๆ ในส่วนหัว "From" ไม่ใช่อีเมลตามมาตรฐาน RFC 5322 ที่ถูกต้อง จะถูกปฏิเสธด้วยรหัสข้อผิดพลาด 550

3. หากข้อความมีส่วนหัว "Received" มากกว่า 25 รายการ จะถูกพิจารณาว่าติดอยู่ในลูปการเปลี่ยนเส้นทาง และจะถูกปฏิเสธด้วยรหัสข้อผิดพลาด 550

4. โดยใช้ลายนิ้วมือของอีเมล (ดูในส่วน [Fingerprinting](#how-do-you-determine-an-email-fingerprint)) เราจะตรวจสอบว่าได้พยายามส่งข้อความซ้ำเกิน 5 วันหรือไม่ (ซึ่งตรงกับ [พฤติกรรมเริ่มต้นของ postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)) และถ้าใช่ จะถูกปฏิเสธด้วยรหัสข้อผิดพลาด 550

5. เราจะเก็บผลลัพธ์จากการสแกนอีเมลโดยใช้ [Spam Scanner](https://spamscanner.net) ในหน่วยความจำ

6. หากมีผลลัพธ์ใดๆ จาก Spam Scanner ที่เป็นแบบ arbitrary จะถูกปฏิเสธด้วยรหัสข้อผิดพลาด 554 ผลลัพธ์ arbitrary ในขณะเขียนนี้รวมถึงการทดสอบ GTUBE เท่านั้น ดูรายละเอียดเพิ่มเติมได้ที่ <https://spamassassin.apache.org/gtube/>

7. เราจะเพิ่มส่วนหัวต่อไปนี้ในข้อความเพื่อวัตถุประสงค์ในการดีบักและป้องกันการละเมิด:

   * `Received` - เราจะเพิ่มส่วนหัว Received มาตรฐานนี้พร้อมกับ IP และโฮสต์ต้นทาง ประเภทการส่งข้อมูล ข้อมูลการเชื่อมต่อ TLS วันที่/เวลา และผู้รับ
   * `X-Original-To` - ผู้รับเดิมของข้อความ:
     * มีประโยชน์สำหรับการระบุว่าอีเมลถูกส่งไปที่ใดเดิม (นอกเหนือจากส่วนหัว "Received")
     * จะถูกเพิ่มในแต่ละผู้รับในขณะที่ทำ IMAP และ/หรือ การส่งต่อแบบปกปิด (เพื่อปกป้องความเป็นส่วนตัว)
   * `X-Forward-Email-Website` - มีลิงก์ไปยังเว็บไซต์ของเราที่ <https://forwardemail.net>
   * `X-Forward-Email-Version` - เวอร์ชัน [SemVer](https://semver.org/) ปัจจุบันจาก `package.json` ของฐานรหัสของเรา
   * `X-Forward-Email-Session-ID` - ค่ารหัสเซสชันที่ใช้สำหรับการดีบัก (ใช้เฉพาะในสภาพแวดล้อมที่ไม่ใช่การผลิต)
   * `X-Forward-Email-Sender` - รายการที่คั่นด้วยเครื่องหมายจุลภาคซึ่งประกอบด้วยที่อยู่ MAIL FROM ของซองจดหมายเดิม (ถ้าไม่ว่างเปล่า) ชื่อโฮสต์ PTR กลับด้านของไคลเอนต์ (ถ้ามี) และที่อยู่ IP ของผู้ส่ง
   * `X-Forward-Email-ID` - ใช้เฉพาะสำหรับ SMTP ขาออกและเชื่อมโยงกับ ID อีเมลที่เก็บในบัญชีของฉัน → อีเมล
   * `X-Report-Abuse` - มีค่าเป็น `abuse@forwardemail.net`
   * `X-Report-Abuse-To` - มีค่าเป็น `abuse@forwardemail.net`
   * `X-Complaints-To` - มีค่าเป็น `abuse@forwardemail.net`

8. จากนั้นเราจะตรวจสอบข้อความสำหรับ [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), และ [DMARC](https://en.wikipedia.org/wiki/DMARC)

   * หากข้อความล้มเหลว DMARC และโดเมนมีนโยบายปฏิเสธ (เช่น `p=reject` [อยู่ในนโยบาย DMARC](https://wikipedia.org/wiki/DMARC)) จะถูกปฏิเสธด้วยรหัสข้อผิดพลาด 550 โดยปกตินโยบาย DMARC สำหรับโดเมนจะพบได้ในระเบียน <strong class="notranslate">TXT</strong> ของซับโดเมน `_dmarc` (เช่น `dig _dmarc.example.com txt`)
   * หากข้อความล้มเหลว SPF และโดเมนมีนโยบายล้มเหลวอย่างรุนแรง (เช่น `-all` อยู่ในนโยบาย SPF แทนที่จะเป็น `~all` หรือไม่มีนโยบายเลย) จะถูกปฏิเสธด้วยรหัสข้อผิดพลาด 550 โดยปกตินโยบาย SPF สำหรับโดเมนจะพบได้ในระเบียน <strong class="notranslate">TXT</strong> ของโดเมนหลัก (เช่น `dig example.com txt`) ดูส่วนนี้สำหรับข้อมูลเพิ่มเติมเกี่ยวกับ [การส่งอีเมลในนาม Gmail](#can-i-send-mail-as-in-gmail-with-this) เกี่ยวกับ SPF
9. ตอนนี้เราจะประมวลผลผู้รับข้อความที่รวบรวมมาจากคำสั่ง `RCPT TO` ในส่วน [ระบบส่งต่ออีเมลของคุณทำงานอย่างไร](#how-does-your-email-forwarding-system-work) ข้างต้น สำหรับแต่ละผู้รับ เราจะดำเนินการดังต่อไปนี้:

   * เราจะค้นหาบันทึก <strong class="notranslate">TXT</strong> ของชื่อโดเมน (ส่วนที่อยู่หลังสัญลักษณ์ `@` เช่น `example.com` หากที่อยู่อีเมลคือ `test@example.com`) ตัวอย่างเช่น หากโดเมนคือ `example.com` เราจะทำการค้นหา DNS เช่น `dig example.com txt`
   * เราจะวิเคราะห์บันทึก <strong class="notranslate">TXT</strong> ทั้งหมดที่ขึ้นต้นด้วย `forward-email=` (แผนฟรี) หรือ `forward-email-site-verification=` (แผนชำระเงิน) โปรดทราบว่าเราจะวิเคราะห์ทั้งสองแบบเพื่อประมวลผลอีเมลในขณะที่ผู้ใช้กำลังอัปเกรดหรือดาวน์เกรดแผน
   * จากบันทึก <strong class="notranslate">TXT</strong> ที่วิเคราะห์แล้ว เราจะวนลูปเพื่อดึงการตั้งค่าการส่งต่อ (ตามที่อธิบายในส่วน [ฉันจะเริ่มต้นและตั้งค่าการส่งต่ออีเมลได้อย่างไร](#how-do-i-get-started-and-set-up-email-forwarding) ข้างต้น) โปรดทราบว่าเรารองรับเพียงค่า `forward-email-site-verification=` หนึ่งค่าเท่านั้น และหากมีมากกว่าหนึ่งค่า จะเกิดข้อผิดพลาด 550 และผู้ส่งจะได้รับการแจ้งเตือนการส่งล้มเหลวสำหรับผู้รับนี้
   * เราจะวนลูปแบบเรียกซ้ำผ่านการตั้งค่าการส่งต่อที่ดึงมาเพื่อกำหนดการส่งต่อแบบทั่วโลก การส่งต่อแบบ regex และการตั้งค่าการส่งต่ออื่น ๆ ที่รองรับทั้งหมด – ซึ่งตอนนี้เรียกว่า "ที่อยู่สำหรับส่งต่อ"
   * สำหรับแต่ละที่อยู่สำหรับส่งต่อ เรารองรับการค้นหาแบบเรียกซ้ำหนึ่งครั้ง (ซึ่งจะเริ่มชุดการดำเนินการนี้ใหม่สำหรับที่อยู่นั้น) หากพบการจับคู่แบบเรียกซ้ำ ผลลัพธ์ของพาเรนต์จะถูกลบออกจากที่อยู่สำหรับส่งต่อ และเพิ่มที่อยู่ลูกแทน
   * ที่อยู่สำหรับส่งต่อจะถูกวิเคราะห์เพื่อความไม่ซ้ำกัน (เนื่องจากเราไม่ต้องการส่งซ้ำไปยังที่อยู่เดียวกันหรือสร้างการเชื่อมต่อ SMTP ที่ไม่จำเป็นเพิ่มเติม)
   * สำหรับแต่ละที่อยู่สำหรับส่งต่อ เราจะค้นหาชื่อโดเมนของมันกับ API endpoint `/v1/max-forwarded-addresses` (เพื่อกำหนดจำนวนที่อยู่ที่โดเมนนั้นได้รับอนุญาตให้ส่งต่ออีเมลต่ออาลิอาส เช่น 10 โดยค่าเริ่มต้น – ดูส่วน [ขีดจำกัดสูงสุดของการส่งต่ออีเมลต่ออาลิอาส](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)) หากเกินขีดจำกัดนี้ จะเกิดข้อผิดพลาด 550 และผู้ส่งจะได้รับการแจ้งเตือนการส่งล้มเหลวสำหรับผู้รับนี้
   * เราจะค้นหาการตั้งค่าของผู้รับต้นทางกับ API endpoint `/v1/settings` ซึ่งรองรับการค้นหาสำหรับผู้ใช้แบบชำระเงิน (พร้อมตัวเลือกสำรองสำหรับผู้ใช้ฟรี) ซึ่งจะส่งคืนอ็อบเจ็กต์การตั้งค่าสำหรับการตั้งค่าขั้นสูง เช่น `port` (ตัวเลข เช่น `25`), `has_adult_content_protection` (บูลีน), `has_phishing_protection` (บูลีน), `has_executable_protection` (บูลีน), และ `has_virus_protection` (บูลีน)
   * จากการตั้งค่าเหล่านี้ เราจะตรวจสอบผลลัพธ์จาก Spam Scanner และหากพบข้อผิดพลาดใด ๆ ข้อความจะถูกปฏิเสธด้วยรหัสข้อผิดพลาด 554 (เช่น หากเปิดใช้งาน `has_virus_protection` เราจะตรวจสอบผลลัพธ์ของ Spam Scanner สำหรับไวรัส) โปรดทราบว่าผู้ใช้แผนฟรีทั้งหมดจะถูกเลือกให้ตรวจสอบเนื้อหาผู้ใหญ่ การฟิชชิ่ง ไฟล์ปฏิบัติการ และไวรัสโดยอัตโนมัติ โดยค่าเริ่มต้นผู้ใช้แผนชำระเงินทั้งหมดก็ถูกเลือกเช่นกัน แต่การตั้งค่านี้สามารถเปลี่ยนแปลงได้ในหน้าการตั้งค่าสำหรับโดเมนในแดชบอร์ด Forward Email

10. สำหรับที่อยู่สำหรับส่งต่อของผู้รับแต่ละรายที่ผ่านการประมวลผลแล้ว เราจะดำเนินการดังต่อไปนี้:

    * ที่อยู่นั้นจะถูกตรวจสอบกับ [denylist](#do-you-have-a-denylist) ของเรา และหากอยู่ในรายการ จะเกิดข้อผิดพลาด 421 (แจ้งให้ผู้ส่งลองส่งใหม่ในภายหลัง)
    * หากที่อยู่นั้นเป็น webhook เราจะตั้งค่าบูลีนสำหรับการดำเนินการในอนาคต (ดูด้านล่าง – เราจะจัดกลุ่ม webhook ที่คล้ายกันเพื่อทำการร้องขอ POST ครั้งเดียวแทนที่จะหลายครั้งสำหรับการส่ง)
    * หากที่อยู่นั้นเป็นที่อยู่อีเมล เราจะวิเคราะห์โฮสต์สำหรับการดำเนินการในอนาคต (ดูด้านล่าง – เราจะจัดกลุ่มโฮสต์ที่คล้ายกันเพื่อสร้างการเชื่อมต่อครั้งเดียวแทนที่จะหลายการเชื่อมต่อแยกกันสำหรับการส่ง)
11. หากไม่มีผู้รับและไม่มีการเด้งกลับ เราจะตอบกลับด้วยข้อผิดพลาด 550 ว่า "Invalid recipients"

12. หากมีผู้รับ เราจะวนลูปผ่านผู้รับเหล่านั้น (จัดกลุ่มตามโฮสต์เดียวกัน) และส่งอีเมล ดูส่วน [How do you handle email delivery issues](#how-do-you-handle-email-delivery-issues) ด้านล่างเพื่อข้อมูลเชิงลึกเพิ่มเติม

    * หากเกิดข้อผิดพลาดใด ๆ ขณะส่งอีเมล เราจะเก็บข้อผิดพลาดเหล่านั้นไว้ในหน่วยความจำเพื่อประมวลผลในภายหลัง
    * เราจะใช้รหัสข้อผิดพลาดต่ำสุด (ถ้ามี) จากการส่งอีเมล – และใช้เป็นรหัสตอบกลับสำหรับคำสั่ง `DATA` ซึ่งหมายความว่าอีเมลที่ส่งไม่สำเร็จจะถูกส่งซ้ำโดยผู้ส่งเดิม แต่สำหรับอีเมลที่ส่งสำเร็จแล้วจะไม่ถูกส่งซ้ำในครั้งถัดไปที่ส่งข้อความ (เนื่องจากเราใช้ [Fingerprinting](#how-do-you-determine-an-email-fingerprint))
    * หากไม่มีข้อผิดพลาดเกิดขึ้น เราจะส่งรหัสสถานะ SMTP 250 สำเร็จ
    * การเด้งกลับถูกกำหนดว่าเป็นการพยายามส่งที่ส่งผลให้เกิดรหัสสถานะ >= 500 (ความล้มเหลวถาวร)

13. หากไม่มีการเด้งกลับ (ความล้มเหลวถาวร) เราจะส่งรหัสสถานะ SMTP ที่เป็นรหัสข้อผิดพลาดต่ำสุดจากความล้มเหลวที่ไม่ถาวร (หรือรหัสสถานะ 250 สำเร็จหากไม่มีข้อผิดพลาด)

14. หากเกิดการเด้งกลับ เราจะส่งอีเมลเด้งกลับในเบื้องหลังหลังจากส่งรหัสข้อผิดพลาดต่ำสุดทั้งหมดกลับไปยังผู้ส่ง อย่างไรก็ตาม หากรหัสข้อผิดพลาดต่ำสุด >= 500 เราจะไม่ส่งอีเมลเด้งกลับใด ๆ เนื่องจากหากส่ง จะทำให้ผู้ส่งได้รับอีเมลเด้งกลับสองครั้ง (เช่น หนึ่งจาก MTA ขาออกของพวกเขา เช่น Gmail และอีกหนึ่งจากเรา) ดูส่วน [How do you protect against backscatter](#how-do-you-protect-against-backscatter) ด้านล่างเพื่อข้อมูลเชิงลึกเพิ่มเติม

### How do you handle email delivery issues {#how-do-you-handle-email-delivery-issues}

โปรดทราบว่าเราจะทำการเขียนทับ "Friendly-From" บนอีเมลก็ต่อเมื่อและเฉพาะเมื่อ นโยบาย DMARC ของผู้ส่งไม่ผ่าน AND ไม่มีลายเซ็น DKIM ที่สอดคล้องกับหัวข้อ "From" ซึ่งหมายความว่าเราจะเปลี่ยนหัวข้อ "From" ในข้อความ ตั้งค่า "X-Original-From" และตั้งค่า "Reply-To" หากยังไม่ได้ตั้งค่า นอกจากนี้เราจะทำการประทับตรา ARC ใหม่บนข้อความหลังจากเปลี่ยนแปลงหัวข้อเหล่านี้

เรายังใช้การวิเคราะห์ข้อความข้อผิดพลาดอย่างชาญฉลาดในทุกระดับของสแตกของเรา – ในโค้ดของเรา, คำขอ DNS, ส่วนภายในของ Node.js, คำขอ HTTP (เช่น 408, 413, และ 429 จะถูกแมปเป็นรหัสตอบกลับ SMTP 421 หากผู้รับเป็น webhook) และการตอบกลับของเซิร์ฟเวอร์เมล (เช่น การตอบกลับที่มีคำว่า "defer" หรือ "slowdown" จะถูกส่งซ้ำเป็นข้อผิดพลาด 421)

ตรรกะของเราใช้งานง่ายและจะพยายามส่งซ้ำสำหรับข้อผิดพลาด SSL/TLS, ปัญหาการเชื่อมต่อ และอื่น ๆ เป้าหมายของการทำให้ใช้งานง่ายคือเพื่อเพิ่มโอกาสในการส่งถึงผู้รับทั้งหมดสำหรับการตั้งค่าการส่งต่อ

หากผู้รับเป็น webhook เราจะอนุญาตให้มีเวลารอคำขอ 60 วินาทีเพื่อให้เสร็จสมบูรณ์ พร้อมกับการลองใหม่สูงสุด 3 ครั้ง (รวมเป็น 4 คำขอก่อนล้มเหลว) โปรดทราบว่าเราจะวิเคราะห์รหัสข้อผิดพลาด 408, 413, และ 429 อย่างถูกต้องและแมปเป็นรหัสตอบกลับ SMTP 421

หากผู้รับเป็นที่อยู่อีเมล เราจะพยายามส่งอีเมลด้วย opportunistic TLS (เราจะพยายามใช้ STARTTLS หากมีในเซิร์ฟเวอร์เมลของผู้รับ) หากเกิดข้อผิดพลาด SSL/TLS ขณะพยายามส่งอีเมล เราจะพยายามส่งอีเมลโดยไม่ใช้ TLS (ไม่ใช้ STARTTLS)

หากเกิดข้อผิดพลาด DNS หรือการเชื่อมต่อ เราจะส่งรหัสตอบกลับ SMTP 421 สำหรับคำสั่ง `DATA` มิฉะนั้นหากมีข้อผิดพลาดระดับ >= 500 จะมีการส่งอีเมลเด้งกลับ

หากเราตรวจพบว่าเซิร์ฟเวอร์อีเมลที่เราพยายามส่งมีที่อยู่ IP ของเราอย่างน้อยหนึ่งรายการถูกบล็อก (เช่น โดยเทคโนโลยีใด ๆ ที่ใช้สำหรับเลื่อนการส่งของสแปมเมอร์) เราจะส่งรหัสตอบกลับ SMTP 421 เพื่อให้ผู้ส่งลองส่งข้อความใหม่ในภายหลัง (และเราจะได้รับแจ้งปัญหาเพื่อพยายามแก้ไขก่อนการพยายามครั้งถัดไป)

### How do you handle your IP addresses becoming blocked {#how-do-you-handle-your-ip-addresses-becoming-blocked}
เราตรวจสอบรายชื่อ DNS denylist หลักทั้งหมดอย่างสม่ำเสมอ และหากที่อยู่ IP ของ mail exchange ("MX") ของเราถูกระบุใน denylist หลัก เราจะดึงออกจาก DNS A record round robin ที่เกี่ยวข้องหากเป็นไปได้จนกว่าปัญหาจะได้รับการแก้ไข

ในขณะที่เขียนนี้ เราถูกระบุใน DNS allowlist หลายรายการด้วย และเราจริงจังกับการตรวจสอบ denylist หากคุณพบปัญหาใด ๆ ก่อนที่เราจะมีโอกาสแก้ไข โปรดแจ้งให้เราทราบเป็นลายลักษณ์อักษรที่ <support@forwardemail.net>

ที่อยู่ IP ของเราสามารถดูได้สาธารณะ [ดูส่วนนี้ด้านล่างเพื่อข้อมูลเพิ่มเติม](#what-are-your-servers-ip-addresses)

### ที่อยู่อีเมล postmaster คืออะไร {#what-are-postmaster-addresses}

เพื่อป้องกันการส่งอีเมลเด้งผิดที่และการส่งข้อความตอบกลับช่วงวันหยุดไปยังกล่องจดหมายที่ไม่ได้รับการตรวจสอบหรือไม่มีอยู่จริง เราจะเก็บรายชื่อชื่อผู้ใช้ที่คล้ายกับ mailer-daemon ดังนี้:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [และที่อยู่อีเมล no-reply ใด ๆ](#what-are-no-reply-addresses)

ดู [RFC 5320 Section 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) เพื่อเข้าใจเพิ่มเติมเกี่ยวกับวิธีการใช้รายชื่อเหล่านี้ในการสร้างระบบอีเมลที่มีประสิทธิภาพ

### ที่อยู่อีเมล no-reply คืออะไร {#what-are-no-reply-addresses}

ชื่อผู้ใช้อีเมลที่ตรงกับรายการต่อไปนี้ (ไม่สนใจตัวพิมพ์ใหญ่-เล็ก) ถือเป็นที่อยู่อีเมล no-reply:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

รายชื่อนี้ได้รับการดูแล [ในฐานะโครงการโอเพนซอร์สบน GitHub](https://github.com/forwardemail/reserved-email-addresses-list)

### ที่อยู่ IP ของเซิร์ฟเวอร์ของคุณคืออะไร {#what-are-your-servers-ip-addresses}

เราประกาศที่อยู่ IP ของเราที่ <https://forwardemail.net/ips>

### คุณมี allowlist หรือไม่ {#do-you-have-an-allowlist}

ใช่ เรามี [รายชื่อส่วนขยายชื่อโดเมน](#what-domain-name-extensions-are-allowlisted-by-default) ที่ได้รับการอนุญาตโดยค่าเริ่มต้น และมี allowlist แบบไดนามิกที่แคชและหมุนเวียนตาม [เกณฑ์เข้มงวด](#what-is-your-allowlist-criteria)

โดเมน อีเมล และที่อยู่ IP ทั้งหมดที่ใช้โดยลูกค้าที่ชำระเงินจะถูกตรวจสอบกับ denylist ของเราโดยอัตโนมัติทุกชั่วโมง – ซึ่งจะแจ้งเตือนผู้ดูแลระบบที่สามารถแทรกแซงด้วยตนเองหากจำเป็น

นอกจากนี้ หากโดเมนของคุณหรือที่อยู่อีเมลของโดเมนนั้นถูกระบุใน denylist (เช่น สำหรับการส่งสแปม ไวรัส หรือเนื่องจากการโจมตีแอบอ้าง) – ผู้ดูแลโดเมน (คุณ) และทีมผู้ดูแลของเราจะได้รับแจ้งทางอีเมลทันที เราขอแนะนำอย่างยิ่งให้คุณ [ตั้งค่า DMARC](#how-do-i-set-up-dmarc-for-forward-email) เพื่อป้องกันเหตุการณ์นี้

### ส่วนขยายชื่อโดเมนใดบ้างที่ได้รับอนุญาตโดยค่าเริ่มต้น {#what-domain-name-extensions-are-allowlisted-by-default}

ส่วนขยายชื่อโดเมนต่อไปนี้ถือว่าได้รับอนุญาตโดยค่าเริ่มต้น (ไม่ว่าจะอยู่ใน Umbrella Popularity List หรือไม่ก็ตาม):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
  <li class="list-inline-item"><code class="notranslate">dni.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fed.us</code></li>
  <li class="list-inline-item"><code class="notranslate">isa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">kids.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ak.us</code></li>
  <li class="list-inline-item"><code class="notranslate">al.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ar.us</code></li>
  <li class="list-inline-item"><code class="notranslate">as.us</code></li>
  <li class="list-inline-item"><code class="notranslate">az.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ca.us</code></li>
  <li class="list-inline-item"><code class="notranslate">co.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ct.us</code></li>
  <li class="list-inline-item"><code class="notranslate">dc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">de.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fl.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ga.us</code></li>
  <li class="list-inline-item"><code class="notranslate">gu.us</code></li>
  <li class="list-inline-item"><code class="notranslate">hi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ia.us</code></li>
  <li class="list-inline-item"><code class="notranslate">id.us</code></li>
  <li class="list-inline-item"><code class="notranslate">il.us</code></li>
  <li class="list-inline-item"><code class="notranslate">in.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ks.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ky.us</code></li>
  <li class="list-inline-item"><code class="notranslate">la.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ma.us</code></li>
  <li class="list-inline-item"><code class="notranslate">md.us</code></li>
  <li class="list-inline-item"><code class="notranslate">me.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mo.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ne.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nj.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nm.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ny.us</code></li>
  <li class="list-inline-item"><code class="notranslate">oh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ok.us</code></li>
  <li class="list-inline-item"><code class="notranslate">or.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pr.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ri.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.au</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.at</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.br</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">school.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">health.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.in</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.in</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">es.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.es</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.th</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.th</code></li>
  <li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
  <li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">go.id</code></li>
  <li class="list-inline-item"><code class="notranslate">go.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">go.ke</code></li>
  <li class="list-inline-item"><code class="notranslate">go.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">go.th</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.es</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.af</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.al</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.am</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.au</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.az</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.be</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gov.by</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.co</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.il</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.im</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.in</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.it</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.je</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.my</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.np</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.py</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.se</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.si</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.za</code></li>
  <li class="list-inline-item"><code class="notranslate">government.pn</code></li>
  <li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gv.at</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">police.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>
นอกจากนี้ [โดเมนระดับบนสุดของแบรนด์และบริษัท](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) เหล่านี้ได้รับการอนุญาตโดยค่าเริ่มต้น (เช่น `apple` สำหรับ `applecard.apple` สำหรับใบแจ้งยอดบัญชีธนาคาร Apple Card):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
ตั้งแต่วันที่ 18 มีนาคม 2025 เราได้เพิ่มดินแดนโพ้นทะเลของฝรั่งเศสเหล่านี้ในรายการนี้ด้วย ([ตามคำขอ GitHub นี้](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

ตั้งแต่วันที่ 8 กรกฎาคม 2025 เราได้เพิ่มประเทศเฉพาะในยุโรปเหล่านี้:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

ในเดือนตุลาคม 2025 เราได้เพิ่ม <code class="notranslate">cz</code> (สาธารณรัฐเช็ก) เนื่องจากความต้องการ

เราไม่ได้รวม `ru` และ `ua` เนื่องจากกิจกรรมสแปมสูง

### เกณฑ์การอนุญาตของคุณคืออะไร {#what-is-your-allowlist-criteria}

เรามีรายการคงที่ของ [นามสกุลโดเมนที่ได้รับอนุญาตโดยค่าเริ่มต้น](#what-domain-name-extensions-are-allowlisted-by-default) – และเรายังดูแลรายการอนุญาตแบบไดนามิกที่เก็บแคชและหมุนเวียนตามเกณฑ์เข้มงวดดังต่อไปนี้:

* โดเมนรากของผู้ส่งต้องเป็น [นามสกุลโดเมนที่ตรงกับรายการที่เรามีในแผนฟรี](#what-domain-name-extensions-can-be-used-for-free) (โดยเพิ่ม `biz` และ `info`) เรารวมถึงการจับคู่บางส่วนของ `edu`, `gov` และ `mil` เช่น `xyz.gov.au` และ `xyz.edu.au`
* โดเมนรากของผู้ส่งต้องอยู่ใน 100,000 อันดับแรกของผลลัพธ์โดเมนรากที่ไม่ซ้ำจาก [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL")
* โดเมนรากของผู้ส่งต้องอยู่ใน 50,000 อันดับแรกของโดเมนรากที่ไม่ซ้ำซึ่งปรากฏอย่างน้อย 4 วันจาก 7 วันที่ผ่านมาใน UPL (~50% ขึ้นไป)
* โดเมนรากของผู้ส่งต้องไม่ถูก [จัดหมวดหมู่](https://radar.cloudflare.com/categorization-feedback/) ว่าเป็นเนื้อหาผู้ใหญ่หรือมัลแวร์โดย Cloudflare
* โดเมนรากของผู้ส่งต้องมีระเบียน A หรือ MX ตั้งค่าไว้
* โดเมนรากของผู้ส่งต้องมีระเบียน A หรือ MX หรือระเบียน DMARC ที่มี `p=reject` หรือ `p=quarantine` หรือระเบียน SPF ที่มีตัวกำหนด `-all` หรือ `~all`

ถ้าเกณฑ์นี้เป็นไปตามเงื่อนไข โดเมนรากของผู้ส่งจะถูกเก็บแคชไว้ 7 วัน โปรดทราบว่างานอัตโนมัติของเราทำงานทุกวัน – ดังนั้นนี่คือแคชรายการอนุญาตแบบหมุนเวียนที่อัปเดตทุกวัน

งานอัตโนมัติของเราจะดาวน์โหลด UPL ของ 7 วันที่ผ่านมาในหน่วยความจำ, แตกไฟล์ และแยกวิเคราะห์ในหน่วยความจำตามเกณฑ์เข้มงวดข้างต้น

โดเมนยอดนิยมในขณะที่เขียนนี้ เช่น Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify และอื่น ๆ – แน่นอนว่ารวมอยู่ด้วยแล้ว
หากคุณเป็นผู้ส่งที่ไม่ได้อยู่ในรายการอนุญาตของเรา ครั้งแรกที่โดเมนราก FQDN หรือที่อยู่ IP ของคุณส่งอีเมล คุณจะถูก [จำกัดอัตรา](#do-you-have-rate-limiting) และ [ถูกจัดให้อยู่ในรายการสีเทา](#do-you-have-a-greylist) โปรดทราบว่านี่เป็นแนวปฏิบัติมาตรฐานที่ใช้เป็นมาตรฐานอีเมล ลูกค้าส่วนใหญ่ของเซิร์ฟเวอร์อีเมลจะพยายามส่งซ้ำหากได้รับข้อผิดพลาดจำกัดอัตราหรือรายการสีเทา (เช่น รหัสสถานะข้อผิดพลาดระดับ 421 หรือ 4xx)

**โปรดทราบว่าผู้ส่งเฉพาะ เช่น `a@gmail.com`, `b@xyz.edu` และ `c@gov.au` ยังสามารถถูก [บล็อก](#do-you-have-a-denylist)** (เช่น หากเราตรวจจับสแปม ฟิชชิ่ง หรือมัลแวร์จากผู้ส่งเหล่านั้นโดยอัตโนมัติ)

### ส่วนขยายชื่อโดเมนใดบ้างที่สามารถใช้ได้ฟรี {#what-domain-name-extensions-can-be-used-for-free}

ตั้งแต่วันที่ 31 มีนาคม 2023 เราได้บังคับใช้กฎสแปมใหม่แบบครอบคลุมเพื่อปกป้องผู้ใช้และบริการของเรา

กฎใหม่นี้อนุญาตให้ใช้เฉพาะส่วนขยายชื่อโดเมนต่อไปนี้บนแผนบริการฟรีของเรา:

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### คุณมี greylist หรือไม่ {#do-you-have-a-greylist}

ใช่ เรามีนโยบาย [email greylisting](https://en.wikipedia.org/wiki/Greylisting_\(email\)) ที่ค่อนข้างผ่อนปรน Greylisting จะใช้กับผู้ส่งที่ไม่ได้อยู่ใน allowlist ของเราเท่านั้น และจะเก็บไว้ในแคชของเรานาน 30 วัน

สำหรับผู้ส่งใหม่ เราจะเก็บคีย์ในฐานข้อมูล Redis ของเราเป็นเวลา 30 วัน โดยมีค่ากำหนดเป็นเวลาที่มาถึงครั้งแรกของคำขอ จากนั้นเราจะปฏิเสธอีเมลของพวกเขาด้วยรหัสสถานะ retry 450 และอนุญาตให้ผ่านได้ก็ต่อเมื่อผ่านไปแล้ว 5 นาที

ถ้าพวกเขารอครบ 5 นาทีจากเวลาที่มาถึงครั้งแรก อีเมลของพวกเขาจะถูกยอมรับและจะไม่รับรหัสสถานะ 450 นี้อีก

คีย์ประกอบด้วยโดเมน root FQDN หรือที่อยู่ IP ของผู้ส่ง ซึ่งหมายความว่าโดเมนย่อยใด ๆ ที่ผ่าน greylist ก็จะผ่านสำหรับโดเมน root ด้วย และในทางกลับกัน (นี่คือสิ่งที่เราหมายถึงนโยบาย "ผ่อนปรนมาก")

ตัวอย่างเช่น หากอีเมลมาจาก `test.example.com` ก่อนที่เราจะเห็นอีเมลจาก `example.com` อีเมลจาก `test.example.com` และ/หรือ `example.com` จะต้องรอ 5 นาทีจากเวลาที่มาถึงครั้งแรกของการเชื่อมต่อ เราจะไม่ทำให้ทั้ง `test.example.com` และ `example.com` ต้องรอ 5 นาทีของตัวเอง (นโยบาย greylisting ของเราจะใช้ในระดับโดเมน root)

โปรดทราบว่า greylisting จะไม่ใช้กับผู้ส่งที่อยู่ใน [allowlist](#do-you-have-an-allowlist) ของเรา (เช่น Meta, Amazon, Netflix, Google, Microsoft ณ เวลาที่เขียนนี้)

### คุณมี denylist หรือไม่ {#do-you-have-a-denylist}

ใช่ เราดำเนินการ denylist ของเราเองและอัปเดตโดยอัตโนมัติแบบเรียลไทม์และด้วยตนเองตามกิจกรรมสแปมหรือกิจกรรมที่เป็นอันตรายที่ตรวจพบ

เรายังดึงที่อยู่ IP ทั้งหมดจาก denylist ระดับ 1 ของ UCEPROTECT ที่ <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> ทุกชั่วโมงและป้อนเข้า denylist ของเราพร้อมวันหมดอายุ 7 วัน

ผู้ส่งที่พบใน denylist จะได้รับรหัสข้อผิดพลาด 421 (บ่งชี้ให้ผู้ส่งลองใหม่ในภายหลัง) หากพวกเขา [ไม่ได้อยู่ใน allowlist](#do-you-have-an-allowlist)

โดยการใช้รหัสสถานะ 421 แทนรหัส 554 จะช่วยลดความผิดพลาดที่อาจเกิดขึ้นแบบ false positives ได้แบบเรียลไทม์ และข้อความจะถูกส่งสำเร็จในการพยายามครั้งถัดไป

**นี่ถูกออกแบบแตกต่างจากบริการอีเมลอื่น ๆ** ที่ถ้าคุณถูกใส่ใน blocklist จะเกิดความล้มเหลวแบบถาวรและรุนแรง มักจะยากที่จะขอให้ผู้ส่งลองส่งข้อความใหม่ (โดยเฉพาะจากองค์กรขนาดใหญ่) ดังนั้นวิธีนี้จึงให้เวลาประมาณ 5 วันนับจากการพยายามส่งอีเมลครั้งแรก เพื่อให้ผู้ส่ง ผู้รับ หรือเรา สามารถเข้ามาจัดการและแก้ไขปัญหาได้ (โดยการขอให้ลบออกจาก denylist)

คำขอลบออกจาก denylist ทั้งหมดจะถูกตรวจสอบแบบเรียลไทม์โดยผู้ดูแลระบบ (เช่น เพื่อให้ false positives ที่เกิดซ้ำสามารถถูกเพิ่มใน allowlist อย่างถาวรโดยผู้ดูแลระบบ)

คำขอลบออกจาก denylist สามารถขอได้ที่ <https://forwardemail.net/denylist> ผู้ใช้ที่ชำระเงินจะได้รับการดำเนินการคำขอทันที ในขณะที่ผู้ใช้ที่ไม่ชำระเงินต้องรอให้ผู้ดูแลระบบดำเนินการคำขอ

ผู้ส่งที่ตรวจพบว่ากำลังส่งสแปมหรือเนื้อหาไวรัสจะถูกเพิ่มใน denylist ตามขั้นตอนดังนี้:

1. [ลายนิ้วมือข้อความเริ่มต้น](#how-do-you-determine-an-email-fingerprint) จะถูก greylisted เมื่อพบสแปมหรือถูกบล็อกจาก "ผู้ส่งที่เชื่อถือได้" (เช่น `gmail.com`, `microsoft.com`, `apple.com`)
   * หากผู้ส่งอยู่ใน allowlist ข้อความจะถูก greylist เป็นเวลา 1 ชั่วโมง
   * หากผู้ส่งไม่อยู่ใน allowlist ข้อความจะถูก greylist เป็นเวลา 6 ชั่วโมง
2. เราจะวิเคราะห์คีย์ denylist จากข้อมูลของผู้ส่งและข้อความ และสำหรับแต่ละคีย์ เราจะสร้าง (ถ้ายังไม่มี) ตัวนับ เพิ่มค่าขึ้น 1 และเก็บไว้ในแคชเป็นเวลา 24 ชั่วโมง
   * สำหรับผู้ส่งที่อยู่ใน allowlist:
     * เพิ่มคีย์สำหรับที่อยู่อีเมล "MAIL FROM" ของซองจดหมาย หากผ่าน SPF หรือไม่มี SPF และไม่ใช่ [ชื่อผู้ใช้ postmaster](#what-are-postmaster-addresses) หรือ [ชื่อผู้ใช้ no-reply](#what-are-no-reply-addresses)
     * หาก header "From" อยู่ใน allowlist ให้เพิ่มคีย์สำหรับที่อยู่อีเมลใน header "From" หากผ่าน SPF หรือผ่านและสอดคล้องกับ DKIM
     * หาก header "From" ไม่อยู่ใน allowlist ให้เพิ่มคีย์สำหรับที่อยู่อีเมลใน header "From" และชื่อโดเมน root ที่แยกวิเคราะห์ได้
   * สำหรับผู้ส่งที่ไม่อยู่ใน allowlist:
     * เพิ่มคีย์สำหรับที่อยู่อีเมล "MAIL FROM" ของซองจดหมาย หากผ่าน SPF
     * หาก header "From" อยู่ใน allowlist ให้เพิ่มคีย์สำหรับที่อยู่อีเมลใน header "From" หากผ่าน SPF หรือผ่านและสอดคล้องกับ DKIM
     * หาก header "From" ไม่อยู่ใน allowlist ให้เพิ่มคีย์สำหรับที่อยู่อีเมลใน header "From" และชื่อโดเมน root ที่แยกวิเคราะห์ได้
     * เพิ่มคีย์สำหรับที่อยู่ IP ระยะไกลของผู้ส่ง
     * เพิ่มคีย์สำหรับชื่อโฮสต์ที่แก้ไขโดยการค้นหากลับจากที่อยู่ IP ของผู้ส่ง (ถ้ามี)
     * เพิ่มคีย์สำหรับโดเมน root ของชื่อโฮสต์ที่แก้ไข (ถ้ามี และถ้าแตกต่างจากชื่อโฮสต์ที่แก้ไข)
3. หากตัวนับถึง 5 สำหรับผู้ส่งและคีย์ที่ไม่อยู่ใน allowlist เราจะเพิ่มคีย์นั้นใน denylist เป็นเวลา 30 วัน และส่งอีเมลไปยังทีม abuse ของเรา ตัวเลขเหล่านี้อาจเปลี่ยนแปลงและจะอัปเดตที่นี่ตามการตรวจสอบ abuse
4. หากตัวนับถึง 10 สำหรับผู้ส่งและคีย์ที่อยู่ใน allowlist เราจะเพิ่มคีย์นั้นใน denylist เป็นเวลา 7 วัน และส่งอีเมลไปยังทีม abuse ของเรา ตัวเลขเหล่านี้อาจเปลี่ยนแปลงและจะอัปเดตที่นี่ตามการตรวจสอบ abuse
> **หมายเหตุ:** ในอนาคตอันใกล้นี้เราจะนำการตรวจสอบชื่อเสียงมาใช้ การตรวจสอบชื่อเสียงจะคำนวณเวลาที่จะปฏิเสธผู้ส่งโดยอิงจากเกณฑ์เปอร์เซ็นต์ (แทนที่จะใช้ตัวนับพื้นฐานตามที่กล่าวไว้ข้างต้น)

### คุณมีการจำกัดอัตราการส่งหรือไม่ {#do-you-have-rate-limiting}

การจำกัดอัตราการส่งของผู้ส่งจะใช้โดเมนรากที่ได้จากการค้นหา PTR แบบย้อนกลับบนที่อยู่ IP ของผู้ส่ง – หรือถ้าไม่ได้ผลลัพธ์ ก็จะใช้ที่อยู่ IP ของผู้ส่งโดยตรง โปรดทราบว่าเราจะเรียกสิ่งนี้ว่า `Sender` ด้านล่าง

เซิร์ฟเวอร์ MX ของเรามีขีดจำกัดรายวันสำหรับอีเมลขาเข้าที่ได้รับสำหรับ [การจัดเก็บ IMAP แบบเข้ารหัส](/blog/docs/best-quantum-safe-encrypted-email-service):

* แทนที่จะจำกัดอัตราการรับอีเมลขาเข้าบนฐานของอีเมลแฝงแต่ละอัน (เช่น `you@yourdomain.com`) – เราจะจำกัดอัตราตามชื่อโดเมนของอีเมลแฝงนั้นเอง (เช่น `yourdomain.com`) วิธีนี้ช่วยป้องกันไม่ให้ `Senders` ส่งอีเมลล้นกล่องจดหมายของอีเมลแฝงทั้งหมดในโดเมนของคุณพร้อมกัน
* เรามีขีดจำกัดทั่วไปที่ใช้กับ `Senders` ทุกคนในบริการของเราโดยไม่คำนึงถึงผู้รับ:
  * `Senders` ที่เราถือว่าเป็นแหล่งข้อมูลที่ "เชื่อถือได้" (เช่น `gmail.com`, `microsoft.com`, `apple.com`) จะถูกจำกัดการส่งที่ 100 GB ต่อวัน
  * `Senders` ที่อยู่ใน [allowlist](#do-you-have-an-allowlist) จะถูกจำกัดการส่งที่ 10 GB ต่อวัน
  * `Senders` อื่น ๆ ทั้งหมดจะถูกจำกัดการส่งที่ 1 GB และ/หรือ 1000 ข้อความต่อวัน
* เรามีขีดจำกัดเฉพาะสำหรับ `Sender` และ `yourdomain.com` ที่ 1 GB และ/หรือ 1000 ข้อความต่อวัน

เซิร์ฟเวอร์ MX ยังจำกัดข้อความที่ถูกส่งต่อไปยังผู้รับหนึ่งหรือมากกว่าผ่านการจำกัดอัตรา – แต่จะใช้กับ `Senders` ที่ไม่อยู่ใน [allowlist](#do-you-have-an-allowlist) เท่านั้น:

* เราอนุญาตสูงสุด 100 การเชื่อมต่อต่อชั่วโมง ต่อโดเมนราก FQDN ที่แก้ไขของ `Sender` (หรือ) ที่อยู่ IP ระยะไกลของ `Sender` (ถ้าไม่มี PTR แบบย้อนกลับ) และต่อผู้รับในซองจดหมาย เราจะเก็บคีย์สำหรับการจำกัดอัตราเป็นแฮชเข้ารหัสในฐานข้อมูล Redis ของเรา

* หากคุณส่งอีเมลผ่านระบบของเรา โปรดตรวจสอบให้แน่ใจว่าคุณตั้งค่า PTR แบบย้อนกลับสำหรับที่อยู่ IP ทั้งหมดของคุณ (มิฉะนั้นแต่ละโดเมนราก FQDN หรือที่อยู่ IP ที่คุณส่งจากจะแสดงผลจำกัดอัตรา)

* โปรดทราบว่าหากคุณส่งผ่านระบบยอดนิยมเช่น Amazon SES คุณจะไม่ถูกจำกัดอัตราเนื่องจาก (ในเวลาที่เขียนนี้) Amazon SES อยู่ใน allowlist ของเรา

* หากคุณส่งจากโดเมนเช่น `test.abc.123.example.com` การจำกัดอัตราจะถูกบังคับใช้กับ `example.com` ผู้ส่งสแปมจำนวนมากใช้ซับโดเมนหลายร้อยโดเมนเพื่อหลีกเลี่ยงตัวกรองสแปมทั่วไปที่จำกัดอัตราเฉพาะชื่อโฮสต์ที่ไม่ซ้ำกันแทนที่จะเป็นโดเมนราก FQDN ที่ไม่ซ้ำกัน

* `Senders` ที่เกินขีดจำกัดอัตราจะถูกปฏิเสธด้วยข้อผิดพลาด 421

เซิร์ฟเวอร์ IMAP และ SMTP ของเราจำกัดอีเมลแฝงของคุณไม่ให้มีการเชื่อมต่อพร้อมกันเกิน `60` การเชื่อมต่อ

เซิร์ฟเวอร์ MX ของเราจำกัดผู้ส่ง [ที่ไม่อยู่ใน allowlist](#do-you-have-an-allowlist) ไม่ให้สร้างการเชื่อมต่อพร้อมกันเกิน 10 การเชื่อมต่อ (โดยมีการหมดอายุแคชตัวนับ 3 นาที ซึ่งสอดคล้องกับเวลาหมดอายุซ็อกเก็ตของเราที่ 3 นาที)

### คุณป้องกัน backscatter อย่างไร {#how-do-you-protect-against-backscatter}

การเด้งกลับที่ส่งผิดที่หรือสแปมเด้งกลับ (รู้จักกันในชื่อ "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") อาจทำให้ชื่อเสียงของที่อยู่ IP ของผู้ส่งเสียหายได้

เราดำเนินการสองขั้นตอนเพื่อป้องกัน backscatter ซึ่งอธิบายไว้ในส่วนต่อไปนี้ [ป้องกันการเด้งกลับจากผู้ส่ง MAIL FROM ที่รู้จัก](#prevent-bounces-from-known-mail-from-spammers) และ [ป้องกันการเด้งกลับที่ไม่จำเป็นเพื่อป้องกัน backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) ด้านล่าง

### ป้องกันการเด้งกลับจากผู้ส่ง MAIL FROM ที่รู้จัก {#prevent-bounces-from-known-mail-from-spammers}

เราดึงรายการจาก [Backscatter.org](https://www.backscatterer.org/) (ขับเคลื่อนโดย [UCEPROTECT](https://www.uceprotect.net/)) ที่ <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> ทุกชั่วโมงและป้อนข้อมูลเข้าในฐานข้อมูล Redis ของเรา (เรายังเปรียบเทียบความแตกต่างล่วงหน้าในกรณีที่มี IP ใดถูกลบออกที่ต้องเคารพ)
ถ้า MAIL FROM ว่างเปล่าหรือเท่ากับ (ไม่สนใจตัวพิมพ์เล็ก-ใหญ่) ที่อยู่ [postmaster addresses](#what-are-postmaster-addresses) ใดๆ (ส่วนที่อยู่ก่อนเครื่องหมาย @ ในอีเมล) เราจะตรวจสอบว่า IP ของผู้ส่งตรงกับรายการนี้หรือไม่

ถ้า IP ของผู้ส่งถูกระบุไว้ (และไม่อยู่ใน [allowlist](#do-you-have-an-allowlist) ของเรา) เราจะส่งข้อผิดพลาด 554 พร้อมข้อความ `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}` เราจะได้รับการแจ้งเตือนหากผู้ส่งอยู่ในทั้งรายการ Backscatterer และ allowlist ของเราเพื่อให้เราสามารถแก้ไขปัญหาได้หากจำเป็น

เทคนิคที่อธิบายในส่วนนี้เป็นไปตามคำแนะนำ "SAFE MODE" ที่ <https://www.backscatterer.org/?target=usage> – ซึ่งเราจะตรวจสอบ IP ของผู้ส่งเฉพาะเมื่อเงื่อนไขบางอย่างได้รับการตอบสนองแล้วเท่านั้น

### ป้องกันการส่งอีเมลตอบกลับที่ไม่จำเป็นเพื่อปกป้องจาก backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Bounces คืออีเมลที่บ่งชี้ว่าการส่งต่ออีเมลล้มเหลวอย่างสมบูรณ์ไปยังผู้รับและจะไม่มีการพยายามส่งซ้ำ

เหตุผลทั่วไปที่ทำให้ถูกระบุในรายการ Backscatterer คือการส่งอีเมลตอบกลับผิดที่หรือสแปมตอบกลับ ดังนั้นเราต้องป้องกันสิ่งนี้ด้วยวิธีต่างๆ ดังนี้:

1. เราจะส่งเฉพาะเมื่อเกิดข้อผิดพลาดรหัสสถานะ >= 500 (เมื่ออีเมลที่พยายามส่งต่อล้มเหลว เช่น Gmail ตอบกลับด้วยข้อผิดพลาดระดับ 500)

2. เราจะส่งเพียงครั้งเดียวเท่านั้น (เราใช้คีย์ลายนิ้วมือ bounce ที่คำนวณได้และเก็บไว้ในแคชเพื่อป้องกันการส่งซ้ำ) ลายนิ้วมือ bounce คือคีย์ที่เป็นลายนิ้วมือของข้อความรวมกับแฮชของที่อยู่อีเมล bounce และรหัสข้อผิดพลาด ดูส่วน [Fingerprinting](#how-do-you-determine-an-email-fingerprint) เพื่อเข้าใจเพิ่มเติมเกี่ยวกับวิธีการคำนวณลายนิ้วมือข้อความ ลายนิ้วมือ bounce ที่ส่งสำเร็จจะหมดอายุหลังจาก 7 วันในแคช Redis ของเรา

3. เราจะส่งเฉพาะเมื่อ MAIL FROM และ/หรือ From ไม่ว่างเปล่าและไม่ประกอบด้วย (ไม่สนใจตัวพิมพ์เล็ก-ใหญ่) ชื่อผู้ใช้ [postmaster](#what-are-postmaster-addresses) (ส่วนที่อยู่ก่อนเครื่องหมาย @ ในอีเมล)

4. เราจะไม่ส่งถ้าข้อความต้นฉบับมีหัวข้อใดๆ ต่อไปนี้ (ไม่สนใจตัวพิมพ์เล็ก-ใหญ่):

   * หัวข้อ `auto-submitted` ที่มีค่าไม่เท่ากับ `no`
   * หัวข้อ `x-auto-response-suppress` ที่มีค่าเป็น `dr`, `autoreply`, `auto-reply`, `auto_reply`, หรือ `all`
   * หัวข้อ `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, หรือ `x-auto-respond` (ไม่ว่าจะมีค่าใด)
   * หัวข้อ `precedence` ที่มีค่าเป็น `bulk`, `autoreply`, `auto-reply`, `auto_reply`, หรือ `list`

5. เราจะไม่ส่งถ้าที่อยู่อีเมล MAIL FROM หรือ From ลงท้ายด้วย `+donotreply`, `-donotreply`, `+noreply`, หรือ `-noreply`

6. เราจะไม่ส่งถ้าชื่อผู้ใช้อีเมล From เป็น `mdaemon` และมีหัวข้อ `X-MDDSN-Message` (ไม่สนใจตัวพิมพ์เล็ก-ใหญ่)

7. เราจะไม่ส่งถ้ามีหัวข้อ `content-type` เป็น `multipart/report` (ไม่สนใจตัวพิมพ์เล็ก-ใหญ่)

### วิธีการกำหนดลายนิ้วมืออีเมล {#how-do-you-determine-an-email-fingerprint}

ลายนิ้วมืออีเมลใช้สำหรับกำหนดความเฉพาะตัวของอีเมลและป้องกันการส่งข้อความซ้ำและการส่ง [bounce ซ้ำ](#prevent-unnecessary-bounces-to-protect-against-backscatter)

ลายนิ้วมือถูกคำนวณจากรายการต่อไปนี้:

* ชื่อโฮสต์ FQDN หรือที่อยู่ IP ที่แก้ไขโดยไคลเอนต์
* ค่าหัวข้อ `Message-ID` (ถ้ามี)
* ค่าหัวข้อ `Date` (ถ้ามี)
* ค่าหัวข้อ `From` (ถ้ามี)
* ค่าหัวข้อ `To` (ถ้ามี)
* ค่าหัวข้อ `Cc` (ถ้ามี)
* ค่าหัวข้อ `Subject` (ถ้ามี)
* ค่าของ `Body` (ถ้ามี)

### ฉันสามารถส่งต่ออีเมลไปยังพอร์ตอื่นที่ไม่ใช่ 25 ได้ไหม (เช่น ถ้า ISP ของฉันบล็อกพอร์ต 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

ได้ ตั้งแต่วันที่ 5 พฤษภาคม 2020 เราได้เพิ่มฟีเจอร์นี้แล้ว ตอนนี้ฟีเจอร์นี้เป็นแบบเฉพาะโดเมน ไม่ใช่เฉพาะ alias หากคุณต้องการให้เป็นแบบเฉพาะ alias กรุณาติดต่อเราเพื่อแจ้งความต้องการของคุณ

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    การปกป้องความเป็นส่วนตัวที่เพิ่มขึ้น:
  </strong>
  <span>
    หากคุณใช้แผนบริการแบบชำระเงิน (ซึ่งมีฟีเจอร์การปกป้องความเป็นส่วนตัวที่เพิ่มขึ้น) กรุณาไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> คลิกที่ "ตั้งค่า" ข้างโดเมนของคุณ แล้วคลิกที่ "การตั้งค่า" หากคุณต้องการเรียนรู้เพิ่มเติมเกี่ยวกับแผนบริการแบบชำระเงิน โปรดดูที่หน้า <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">ราคาของเรา</a> มิฉะนั้นคุณสามารถทำตามคำแนะนำด้านล่างต่อไปได้
  </span>
</div>
หากคุณใช้แผนฟรี ให้เพิ่มระเบียน DNS <strong class="notranslate">TXT</strong> ใหม่ตามที่แสดงด้านล่างนี้ แต่เปลี่ยนพอร์ตจาก 25 เป็นพอร์ตที่คุณเลือก

ตัวอย่างเช่น หากฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `example.com` ถูกส่งต่อไปยังพอร์ต SMTP ของผู้รับอีเมลสำรองที่ 1337 แทนพอร์ต 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
    สถานการณ์ที่พบบ่อยที่สุดสำหรับการตั้งค่าการส่งต่อพอร์ตแบบกำหนดเองคือเมื่อคุณต้องการส่งต่ออีเมลทั้งหมดที่ส่งไปยัง example.com ไปยังพอร์ตที่แตกต่างกันที่ example.com แทนพอร์ต SMTP มาตรฐานที่พอร์ต 25 ในการตั้งค่านี้ ให้เพิ่มระเบียน <strong class="notranslate">TXT</strong> แบบ catch-all ดังต่อไปนี้
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### รองรับสัญลักษณ์บวก + สำหรับนามแฝง Gmail หรือไม่ {#does-it-support-the-plus--symbol-for-gmail-aliases}

ใช่ แน่นอน

### รองรับซับโดเมนหรือไม่ {#does-it-support-sub-domains}

ใช่ แน่นอน แทนที่จะใช้ "@", ".", หรือเว้นว่างเป็นชื่อ/โฮสต์/นามแฝง คุณเพียงแค่ใช้ชื่อซับโดเมนเป็นค่าแทน

หากคุณต้องการให้ `foo.example.com` ส่งต่ออีเมล ให้ใส่ `foo` เป็นค่าในช่องชื่อ/โฮสต์/นามแฝงในการตั้งค่า DNS ของคุณ (ทั้งสำหรับระเบียน MX และ <strong class="notranslate">TXT</strong>)

### การส่งต่ออีเมลนี้ส่งต่อส่วนหัวของอีเมลของฉันหรือไม่ {#does-this-forward-my-emails-headers}

ใช่ แน่นอน

### ได้รับการทดสอบอย่างดีหรือไม่ {#is-this-well-tested}

ใช่ มีการเขียนเทสต์ด้วย [ava](https://github.com/avajs/ava) และมีการครอบคลุมโค้ดด้วย

### คุณส่งต่อข้อความและรหัสตอบกลับ SMTP หรือไม่ {#do-you-pass-along-smtp-response-messages-and-codes}

ใช่ แน่นอน ตัวอย่างเช่น หากคุณส่งอีเมลไปยัง `hello@example.com` และมีการลงทะเบียนให้ส่งต่อไปยัง `user@gmail.com` ข้อความตอบกลับและรหัส SMTP จากเซิร์ฟเวอร์ SMTP ของ "gmail.com" จะถูกส่งกลับแทนเซิร์ฟเวอร์พร็อกซีที่ "mx1.forwardemail.net" หรือ "mx2.forwardemail.net"

### คุณป้องกันสแปมเมอร์และรักษาชื่อเสียงการส่งต่ออีเมลที่ดีอย่างไร {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

ดูส่วนของเราเกี่ยวกับ [ระบบการส่งต่ออีเมลของคุณทำงานอย่างไร](#how-does-your-email-forwarding-system-work), [คุณจัดการปัญหาการส่งอีเมลอย่างไร](#how-do-you-handle-email-delivery-issues), และ [คุณจัดการกับที่อยู่ IP ของคุณที่ถูกบล็อกอย่างไร](#how-do-you-handle-your-ip-addresses-becoming-blocked) ข้างต้น

### คุณทำการค้นหา DNS บนชื่อโดเมนอย่างไร {#how-do-you-perform-dns-lookups-on-domain-names}

เราได้สร้างโปรเจกต์ซอฟต์แวร์โอเพนซอร์ส :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) และใช้สำหรับการค้นหา DNS เซิร์ฟเวอร์ DNS เริ่มต้นที่ใช้คือ `1.1.1.1` และ `1.0.0.1` และการสืบค้น DNS จะผ่าน [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ในชั้นแอปพลิเคชัน

:tangerine: [Tangerine](https://github.com/tangerine) ใช้ [บริการ DNS สำหรับผู้บริโภคที่เน้นความเป็นส่วนตัวของ CloudFlare โดยค่าเริ่มต้น][cloudflare-dns]


## บัญชีและการชำระเงิน {#account-and-billing}

### คุณมีการรับประกันคืนเงินสำหรับแผนที่ชำระเงินหรือไม่ {#do-you-offer-a-money-back-guarantee-on-paid-plans}

ใช่! การคืนเงินอัตโนมัติจะเกิดขึ้นเมื่อคุณอัปเกรด ลดระดับ หรือยกเลิกบัญชีของคุณภายใน 30 วันนับจากวันที่แผนของคุณเริ่มต้น นี่ใช้ได้เฉพาะกับลูกค้าใหม่เท่านั้น
### หากฉันเปลี่ยนแผน คุณจะคำนวณอัตราส่วนและคืนเงินส่วนต่างหรือไม่ {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

เราไม่คำนวณอัตราส่วนและไม่คืนเงินส่วนต่างเมื่อคุณเปลี่ยนแผน แต่เราจะแปลงระยะเวลาที่เหลือจากวันที่หมดอายุของแผนปัจจุบันของคุณเป็นระยะเวลาที่ใกล้เคียงที่สุดสำหรับแผนใหม่ของคุณ (ปัดลงเป็นเดือน)

โปรดทราบว่าหากคุณอัปเกรดหรือลดระดับระหว่างแผนที่ชำระเงินภายในระยะเวลา 30 วันนับตั้งแต่เริ่มใช้แผนที่ชำระเงินครั้งแรก เราจะคืนเงินเต็มจำนวนจากแผนปัจจุบันของคุณโดยอัตโนมัติ

### ฉันสามารถใช้บริการส่งต่ออีเมลนี้เป็นเซิร์ฟเวอร์ MX "สำรอง" หรือ "สำรองล้มเหลว" ได้หรือไม่ {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

ไม่ได้ แนะนำว่าไม่ควรใช้ เนื่องจากคุณสามารถใช้เซิร์ฟเวอร์แลกเปลี่ยนอีเมลได้เพียงหนึ่งเครื่องในแต่ละครั้ง โดยปกติ fallback จะไม่ถูกลองใหม่เนื่องจากการตั้งค่าความสำคัญผิดพลาดและเซิร์ฟเวอร์อีเมลไม่เคารพการตรวจสอบลำดับความสำคัญของ MX

### ฉันสามารถปิดใช้งานนามแฝงเฉพาะได้หรือไม่ {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    หากคุณใช้แผนที่ชำระเงิน คุณต้องไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง <i class="fa fa-angle-right"></i> แก้ไขนามแฝง <i class="fa fa-angle-right"></i> ยกเลิกเลือกช่องทำเครื่องหมาย "ใช้งาน" <i class="fa fa-angle-right"></i> ดำเนินการต่อ
  </span>
</div>

ใช่ เพียงแก้ไขระเบียน DNS <strong class="notranslate">TXT</strong> ของคุณและเติมเครื่องหมายตกใจหนึ่ง สอง หรือสามตัวหน้าชื่อนามแฝง (ดูด้านล่าง)

โปรดทราบว่าคุณ *ควร* รักษาการแมป ":" ไว้ เนื่องจากจำเป็นหากคุณตัดสินใจปิดใช้งานนี้ในภายหลัง (และยังใช้สำหรับการนำเข้าเมื่อคุณอัปเกรดเป็นแผนที่ชำระเงินของเรา)

**สำหรับการปฏิเสธแบบเงียบ (ผู้ส่งจะเห็นเหมือนส่งข้อความสำเร็จ แต่จริงๆ แล้วอีเมลจะไม่ไปไหน) (รหัสสถานะ `250`):** หากคุณเติมเครื่องหมายตกใจหนึ่งตัว "!" หน้าชื่อนามแฝง ระบบจะส่งรหัสสถานะ `250` ที่ประสบความสำเร็จไปยังผู้ส่งที่พยายามส่งไปยังที่อยู่นี้ แต่ตัวอีเมลจะไม่ถูกส่งไปไหน (เช่น หลุมดำหรือ `/dev/null`)

**สำหรับการปฏิเสธแบบอ่อน (รหัสสถานะ `421`):** หากคุณเติมเครื่องหมายตกใจสองตัว "!!" หน้าชื่อนามแฝง ระบบจะส่งรหัสสถานะข้อผิดพลาดแบบอ่อน `421` ไปยังผู้ส่งที่พยายามส่งไปยังที่อยู่นี้ และอีเมลจะถูกลองส่งใหม่เป็นเวลานานถึง 5 วันก่อนถูกปฏิเสธและเด้งกลับ

**สำหรับการปฏิเสธแบบรุนแรง (รหัสสถานะ `550`):** หากคุณเติมเครื่องหมายตกใจสามตัว "!!!" หน้าชื่อนามแฝง ระบบจะส่งรหัสสถานะข้อผิดพลาดถาวร `550` ไปยังผู้ส่งที่พยายามส่งไปยังที่อยู่นี้ และอีเมลจะถูกปฏิเสธและเด้งกลับ

ตัวอย่างเช่น หากฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `alias@example.com` หยุดไหลไปยัง `user@gmail.com` และถูกปฏิเสธและเด้งกลับ (เช่น ใช้เครื่องหมายตกใจสามตัว):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
  <span>
    คุณยังสามารถเขียนที่อยู่อีเมลผู้รับที่ส่งต่อใหม่เป็น "nobody@forwardemail.net" ซึ่งจะส่งเส้นทางไปยัง nobody ตามตัวอย่างด้านล่าง
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
  <span>
    หากคุณต้องการความปลอดภัยที่เพิ่มขึ้น คุณสามารถลบส่วน ":user@gmail.com" (หรือ ":nobody@forwardemail.net") ออก เหลือเพียง "!!!alias" ตามตัวอย่างด้านล่างนี้
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### ฉันสามารถส่งต่ออีเมลไปยังผู้รับหลายคนได้ไหม {#can-i-forward-emails-to-multiple-recipients}

ได้แน่นอน เพียงระบุผู้รับหลายคนในระเบียน <strong class="notranslate">TXT</strong> ของคุณ

ตัวอย่างเช่น หากฉันต้องการให้อีเมลที่ส่งไปยัง `hello@example.com` ถูกส่งต่อไปยัง `user+a@gmail.com` และ `user+b@gmail.com` ระเบียน <strong class="notranslate">TXT</strong> ของฉันจะมีลักษณะดังนี้:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

หรือคุณอาจระบุแยกเป็นสองบรรทัด เช่นนี้:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

แล้วแต่คุณเลย!

### ฉันสามารถมีผู้รับ global catch-all หลายคนได้ไหม {#can-i-have-multiple-global-catch-all-recipients}

ได้ คุณสามารถระบุผู้รับ global catch-all หลายคนในระเบียน <strong class="notranslate">TXT</strong> ของคุณ

ตัวอย่างเช่น หากฉันต้องการให้อีเมลทุกฉบับที่ส่งไปยัง `*@example.com` (เครื่องหมายดอกจันหมายถึง wildcard หรือ catch-all) ถูกส่งต่อไปยัง `user+a@gmail.com` และ `user+b@gmail.com` ระเบียน <strong class="notranslate">TXT</strong> ของฉันจะมีลักษณะดังนี้:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

หรือคุณอาจระบุแยกเป็นสองบรรทัด เช่นนี้:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>ชื่อ/โฮสต์/นามแฝง</th>
      <th class="text-center">TTL</th>
      <th>ประเภท</th>
      <th>คำตอบ/ค่า</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", หรือเว้นว่าง</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
เป็นเรื่องของคุณ!

### มีขีดจำกัดสูงสุดของจำนวนที่อยู่อีเมลที่ฉันสามารถส่งต่อได้ต่ออาลิอัสหรือไม่ {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

ใช่ ขีดจำกัดเริ่มต้นคือ 10 ซึ่งไม่ได้หมายความว่าคุณจะมีอาลิอัสได้แค่ 10 อาลิอัสบนชื่อโดเมนของคุณ คุณสามารถมีอาลิอัสได้เท่าที่ต้องการ (จำนวนไม่จำกัด) หมายความว่าคุณสามารถส่งต่ออาลิอัสหนึ่งไปยังที่อยู่อีเมลที่ไม่ซ้ำกันได้ 10 ที่อยู่เท่านั้น คุณอาจมี `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (ตั้งแต่ 1-10) – และอีเมลใด ๆ ที่ส่งไปยัง `hello@example.com` จะถูกส่งต่อไปยัง `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (ตั้งแต่ 1-10)

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    เคล็ดลับ:
  </strong>
  <span>
    ต้องการผู้รับมากกว่า 10 รายต่ออาลิอัสหรือไม่? ส่งอีเมลถึงเรา เรายินดีที่จะเพิ่มขีดจำกัดบัญชีของคุณ
  </span>
</div>

### ฉันสามารถส่งต่ออีเมลแบบเรียกซ้ำได้หรือไม่ {#can-i-recursively-forward-emails}

ได้ คุณสามารถทำได้ แต่คุณยังต้องปฏิบัติตามขีดจำกัดสูงสุด หากคุณมี `hello:linus@example.com` และ `linus:user@gmail.com` อีเมลที่ส่งไปยัง `hello@example.com` จะถูกส่งต่อไปยัง `linus@example.com` และ `user@gmail.com` โปรดทราบว่าจะเกิดข้อผิดพลาดหากคุณพยายามส่งต่ออีเมลแบบเรียกซ้ำเกินขีดจำกัดสูงสุด

### คนอื่นสามารถยกเลิกหรือลงทะเบียนการส่งต่ออีเมลของฉันโดยไม่ได้รับอนุญาตหรือไม่ {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

เราใช้การตรวจสอบระเบียน MX และ <strong class="notranslate">TXT</strong> ดังนั้นถ้าคุณเพิ่มระเบียน MX และ <strong class="notranslate">TXT</strong> ของบริการนี้ คุณก็ถือว่าลงทะเบียนแล้ว หากคุณลบออก คุณก็จะถูกยกเลิกการลงทะเบียน คุณเป็นเจ้าของโดเมนและการจัดการ DNS ของคุณเอง ดังนั้นถ้ามีคนเข้าถึงสิ่งนั้นได้ นั่นคือปัญหา

### ทำไมถึงฟรี {#how-is-it-free}

Forward Email มีแผนบริการฟรีผ่านการพัฒนาแบบโอเพนซอร์ส โครงสร้างพื้นฐานที่มีประสิทธิภาพ และแผนบริการแบบชำระเงินที่สนับสนุนบริการนี้

แผนบริการฟรีของเราสนับสนุนโดย:

1. **การพัฒนาแบบโอเพนซอร์ส**: โค้ดของเราเป็นโอเพนซอร์ส เปิดโอกาสให้ชุมชนมีส่วนร่วมและดำเนินงานอย่างโปร่งใส

2. **โครงสร้างพื้นฐานที่มีประสิทธิภาพ**: เราได้ปรับแต่งระบบของเราให้จัดการการส่งต่ออีเมลด้วยทรัพยากรที่น้อยที่สุด

3. **แผนพรีเมียมแบบชำระเงิน**: ผู้ใช้ที่ต้องการฟีเจอร์เพิ่มเติม เช่น การส่ง SMTP, การรับ IMAP หรือทางเลือกความเป็นส่วนตัวที่เพิ่มขึ้น สามารถสมัครแผนชำระเงินของเรา

4. **ขีดจำกัดการใช้งานที่เหมาะสม**: แผนฟรีมีนโยบายการใช้งานที่เป็นธรรมเพื่อป้องกันการใช้งานในทางที่ผิด

> \[!NOTE]
> เรามุ่งมั่นที่จะให้บริการส่งต่ออีเมลพื้นฐานฟรี ในขณะที่มีฟีเจอร์พรีเมียมสำหรับผู้ใช้ที่มีความต้องการขั้นสูงกว่า

> \[!TIP]
> หากคุณเห็นว่าบริการของเรามีคุณค่า โปรดพิจารณาอัปเกรดเป็นแผนชำระเงินเพื่อสนับสนุนการพัฒนาและบำรุงรักษาต่อเนื่อง

### ขนาดอีเมลสูงสุดที่รองรับคือเท่าไร {#what-is-the-max-email-size-limit}

เรากำหนดขนาดสูงสุดที่ 50MB ซึ่งรวมเนื้อหา หัวเรื่อง และไฟล์แนบ โปรดทราบว่าบริการอย่าง Gmail และ Outlook อนุญาตขนาดสูงสุดเพียง 25MB และหากคุณส่งเกินขนาดนี้ไปยังที่อยู่อีเมลของผู้ให้บริการเหล่านั้น คุณจะได้รับข้อความแสดงข้อผิดพลาด

จะมีการส่งกลับข้อผิดพลาดพร้อมรหัสตอบสนองที่เหมาะสมหากเกินขนาดไฟล์ที่กำหนด

### คุณเก็บบันทึกอีเมลหรือไม่ {#do-you-store-logs-of-emails}

ไม่ เราไม่เขียนลงดิสก์หรือเก็บบันทึก – ยกเว้น [ข้อผิดพลาด](#do-you-store-error-logs) และ [SMTP ขาออก](#do-you-support-sending-email-with-smtp) (ดู [นโยบายความเป็นส่วนตัว](/privacy))

ทุกอย่างทำในหน่วยความจำ และ [ซอร์สโค้ดของเราอยู่บน GitHub](https://github.com/forwardemail)

### คุณเก็บบันทึกข้อผิดพลาดหรือไม่ {#do-you-store-error-logs}

**ใช่ คุณสามารถเข้าถึงบันทึกข้อผิดพลาดได้ที่ [บัญชีของฉัน → บันทึก](/my-account/logs) หรือ [บัญชีของฉัน → โดเมน](/my-account/domains)**

ตั้งแต่กุมภาพันธ์ 2023 เราเก็บบันทึกข้อผิดพลาดสำหรับรหัสตอบสนอง SMTP `4xx` และ `5xx` เป็นระยะเวลา 7 วัน – ซึ่งประกอบด้วยข้อผิดพลาด SMTP ซองจดหมาย และหัวเรื่องอีเมล (เรา **ไม่** เก็บเนื้อหาอีเมลหรือไฟล์แนบ)
บันทึกข้อผิดพลาดช่วยให้คุณตรวจสอบอีเมลสำคัญที่ขาดหายไปและลดความผิดพลาดของสแปมสำหรับ [โดเมนของคุณ](/my-account/domains) นอกจากนี้ยังเป็นแหล่งข้อมูลที่ดีสำหรับการแก้ไขปัญหากับ [เว็บฮุคอีเมล](#do-you-support-webhooks) (เนื่องจากบันทึกข้อผิดพลาดมีการตอบกลับของเว็บฮุคเอ็นด์พอยต์)

บันทึกข้อผิดพลาดสำหรับ [การจำกัดอัตรา](#do-you-have-rate-limiting) และ [การจัดกลุ่มสีเทา](#do-you-have-a-greylist) ไม่สามารถเข้าถึงได้เนื่องจากการเชื่อมต่อสิ้นสุดก่อนเวลา (เช่น ก่อนที่คำสั่ง `RCPT TO` และ `MAIL FROM` จะถูกส่ง)

ดู [นโยบายความเป็นส่วนตัวของเรา](/privacy) เพื่อข้อมูลเพิ่มเติม

### คุณอ่านอีเมลของฉันหรือไม่ {#do-you-read-my-emails}

ไม่เลย ไม่มีทาง ดู [นโยบายความเป็นส่วนตัวของเรา](/privacy)

บริการส่งต่ออีเมลอื่นๆ หลายแห่งเก็บและอาจอ่านอีเมลของคุณได้ ไม่มีเหตุผลที่อีเมลที่ส่งต่อจะต้องถูกเก็บไว้ในที่เก็บข้อมูลดิสก์ – ดังนั้นเราจึงออกแบบโซลูชันโอเพนซอร์สตัวแรกที่ทำงานทั้งหมดในหน่วยความจำ

เราเชื่อว่าคุณควรมีสิทธิ์ในความเป็นส่วนตัวและเราปฏิบัติตามอย่างเคร่งครัด โค้ดที่ติดตั้งบนเซิร์ฟเวอร์เป็น [ซอฟต์แวร์โอเพนซอร์สบน GitHub](https://github.com/forwardemail) เพื่อความโปร่งใสและสร้างความไว้วางใจ

### ฉันสามารถ "ส่งอีเมลในนาม" ใน Gmail ด้วยสิ่งนี้ได้หรือไม่ {#can-i-send-mail-as-in-gmail-with-this}

ได้! ตั้งแต่วันที่ 2 ตุลาคม 2018 เราได้เพิ่มฟีเจอร์นี้แล้ว ดู [วิธีส่งอีเมลในนามโดยใช้ Gmail](#how-to-send-mail-as-using-gmail) ข้างต้น!

คุณควรกำหนดระเบียน SPF สำหรับ Gmail ในการตั้งค่า DNS ของคุณในระเบียน <strong class="notranslate">TXT</strong>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    หากคุณใช้ Gmail (เช่น ส่งอีเมลในนาม) หรือ G Suite คุณจะต้องเพิ่ม <code>include:_spf.google.com</code> ลงในระเบียน SPF <strong class="notranslate">TXT</strong> ของคุณ เช่น:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### ฉันสามารถ "ส่งอีเมลในนาม" ใน Outlook ด้วยสิ่งนี้ได้หรือไม่ {#can-i-send-mail-as-in-outlook-with-this}

ได้! ตั้งแต่วันที่ 2 ตุลาคม 2018 เราได้เพิ่มฟีเจอร์นี้แล้ว เพียงดูสองลิงก์จาก Microsoft ด้านล่างนี้:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

คุณควรกำหนดระเบียน SPF สำหรับ Outlook ในการตั้งค่า DNS ของคุณในระเบียน <strong class="notranslate">TXT</strong>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    สำคัญ:
  </strong>
  <span>
    หากคุณใช้ Microsoft Outlook หรือ Live.com คุณจะต้องเพิ่ม <code>include:spf.protection.outlook.com</code> ลงในระเบียน SPF <strong class="notranslate">TXT</strong> ของคุณ เช่น:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### ฉันสามารถ "ส่งอีเมลในนาม" ใน Apple Mail และ iCloud Mail ด้วยสิ่งนี้ได้หรือไม่ {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

หากคุณเป็นผู้สมัครสมาชิก iCloud+ คุณสามารถใช้โดเมนที่กำหนดเองได้ [บริการของเรายังเข้ากันได้กับ Apple Mail](#apple-mail)

โปรดดู <https://support.apple.com/en-us/102540> สำหรับข้อมูลเพิ่มเติม

### ฉันสามารถส่งต่ออีเมลได้ไม่จำกัดด้วยสิ่งนี้หรือไม่ {#can-i-forward-unlimited-emails-with-this}

ได้ อย่างไรก็ตาม ผู้ส่ง "ที่ค่อนข้างไม่เป็นที่รู้จัก" จะถูกจำกัดอัตราไว้ที่ 100 การเชื่อมต่อต่อชั่วโมงต่อชื่อโฮสต์หรือ IP ดูส่วน [การจำกัดอัตรา](#do-you-have-rate-limiting) และ [การจัดกลุ่มสีเทา](#do-you-have-a-greylist) ข้างต้น

โดย "ที่ค่อนข้างไม่เป็นที่รู้จัก" หมายถึงผู้ส่งที่ไม่ปรากฏใน [รายการอนุญาต](#do-you-have-an-allowlist)

หากเกินขีดจำกัดนี้ เราจะส่งรหัสตอบกลับ 421 ซึ่งบอกให้เซิร์ฟเวอร์เมลของผู้ส่งลองใหม่ในภายหลัง

### คุณมีโดเมนไม่จำกัดในราคาหนึ่งราคาไหม {#do-you-offer-unlimited-domains-for-one-price}

ได้ ไม่ว่าคุณจะใช้แผนใด คุณจะจ่ายเพียงอัตรารายเดือนเดียว – ซึ่งครอบคลุมโดเมนทั้งหมดของคุณ
### วิธีการชำระเงินที่คุณยอมรับ {#which-payment-methods-do-you-accept}

Forward Email ยอมรับวิธีการชำระเงินแบบครั้งเดียวหรือรายเดือน/รายไตรมาส/รายปี ดังนี้:

1. **บัตรเครดิต/เดบิต/โอนเงินผ่านธนาคาร**: Visa, Mastercard, American Express, Discover, JCB, Diners Club เป็นต้น
2. **PayPal**: เชื่อมต่อบัญชี PayPal ของคุณเพื่อการชำระเงินที่ง่ายดาย
3. **สกุลเงินดิจิทัล**: เรารับชำระเงินผ่านการชำระเงิน stablecoin ของ Stripe บนเครือข่าย Ethereum, Polygon และ Solana

> \[!NOTE]
> เราจัดเก็บข้อมูลการชำระเงินในปริมาณจำกัดบนเซิร์ฟเวอร์ของเรา ซึ่งรวมถึงตัวระบุการชำระเงินและการอ้างอิงไปยัง [Stripe](https://stripe.com/global) และ [PayPal](https://www.paypal.com) สำหรับธุรกรรม ลูกค้า การสมัครสมาชิก และรหัสการชำระเงิน

> \[!TIP]
> เพื่อความเป็นส่วนตัวสูงสุด ให้พิจารณาใช้การชำระเงินด้วยสกุลเงินดิจิทัล

การชำระเงินทั้งหมดจะถูกดำเนินการอย่างปลอดภัยผ่าน Stripe หรือ PayPal รายละเอียดการชำระเงินของคุณจะไม่ถูกจัดเก็บบนเซิร์ฟเวอร์ของเรา


## แหล่งข้อมูลเพิ่มเติม {#additional-resources}

> \[!TIP]
> บทความของเราในด้านล่างนี้ได้รับการอัปเดตอย่างสม่ำเสมอด้วยคำแนะนำ เคล็ดลับ และข้อมูลทางเทคนิคใหม่ๆ ตรวจสอบบ่อยๆ เพื่อรับเนื้อหาล่าสุด

* [กรณีศึกษา & เอกสารสำหรับนักพัฒนา](/blog/docs)
* [แหล่งข้อมูล](/resources)
* [คำแนะนำ](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
