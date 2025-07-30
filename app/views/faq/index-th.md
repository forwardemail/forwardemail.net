# คำถามที่พบบ่อย {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## สารบัญ {#table-of-contents}

* [เริ่มต้นอย่างรวดเร็ว](#quick-start)
* [การแนะนำ](#introduction)
  * [ส่งต่ออีเมลคืออะไร](#what-is-forward-email)
  * [ใครใช้ Forward Email](#who-uses-forward-email)
  * [ประวัติการส่งต่ออีเมลคืออะไร](#what-is-forward-emails-history)
  * [บริการนี้เร็วแค่ไหน](#how-fast-is-this-service)
* [ไคลเอนต์อีเมล](#email-clients)
  * [ธันเดอร์เบิร์ด](#thunderbird)
  * [ไมโครซอฟต์ เอาท์ลุค](#microsoft-outlook)
  * [แอปเปิลเมล](#apple-mail)
  * [อุปกรณ์พกพา](#mobile-devices)
  * [วิธีการส่งเมลโดยใช้ Gmail](#how-to-send-mail-as-using-gmail)
  * [คู่มือฟรีสำหรับการส่งอีเมลในชื่อโดยใช้ Gmail คืออะไร](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [การกำหนดค่าการกำหนดเส้นทาง Gmail ขั้นสูง](#advanced-gmail-routing-configuration)
  * [การกำหนดค่าการกำหนดเส้นทาง Outlook ขั้นสูง](#advanced-outlook-routing-configuration)
* [การแก้ไขปัญหา](#troubleshooting)
  * [ทำไมฉันไม่ได้รับอีเมลทดสอบของฉัน](#why-am-i-not-receiving-my-test-emails)
  * [ฉันจะกำหนดค่าไคลเอนต์อีเมลของฉันให้ทำงานกับการส่งต่ออีเมลได้อย่างไร](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [เหตุใดอีเมลของฉันจึงไปอยู่ในสแปมและขยะ และฉันสามารถตรวจสอบชื่อเสียงโดเมนของฉันได้อย่างไร](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [ฉันควรทำอย่างไรหากได้รับอีเมลขยะ](#what-should-i-do-if-i-receive-spam-emails)
  * [เหตุใดอีเมลทดสอบที่ฉันส่งถึงตัวเองใน Gmail จึงแสดงเป็น "น่าสงสัย"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [ฉันสามารถลบ via forwardemail dot net ใน Gmail ได้ไหม](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [การจัดการข้อมูล](#data-management)
  * [เซิร์ฟเวอร์ของคุณอยู่ที่ไหน](#where-are-your-servers-located)
  * [ฉันจะส่งออกและสำรองข้อมูลกล่องจดหมายของฉันได้อย่างไร](#how-do-i-export-and-backup-my-mailbox)
  * [ฉันจะนำเข้าและย้ายกล่องจดหมายที่มีอยู่ของฉันได้อย่างไร](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [คุณสนับสนุนการโฮสต์ด้วยตนเองหรือไม่](#do-you-support-self-hosting)
* [การกำหนดค่าอีเมล](#email-configuration)
  * [ฉันจะเริ่มต้นและตั้งค่าการส่งต่ออีเมลได้อย่างไร](#how-do-i-get-started-and-set-up-email-forwarding)
  * [ฉันสามารถใช้การแลกเปลี่ยน MX และเซิร์ฟเวอร์หลายตัวสำหรับการส่งต่อขั้นสูงได้หรือไม่](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [ฉันจะตั้งค่าการตอบกลับอัตโนมัติเมื่อไม่อยู่ที่สำนักงานได้อย่างไร](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [ฉันจะตั้งค่า SPF สำหรับการส่งต่ออีเมลได้อย่างไร](#how-do-i-set-up-spf-for-forward-email)
  * [ฉันจะตั้งค่า DKIM สำหรับการส่งต่ออีเมลได้อย่างไร](#how-do-i-set-up-dkim-for-forward-email)
  * [ฉันจะตั้งค่า DMARC สำหรับการส่งต่ออีเมลได้อย่างไร](#how-do-i-set-up-dmarc-for-forward-email)
  * [ฉันจะเชื่อมต่อและกำหนดค่าผู้ติดต่อของฉันได้อย่างไร](#how-do-i-connect-and-configure-my-contacts)
  * [ฉันจะเชื่อมต่อและกำหนดค่าปฏิทินของฉันได้อย่างไร](#how-do-i-connect-and-configure-my-calendars)
  * [ฉันจะเพิ่มปฏิทินและจัดการปฏิทินที่มีอยู่ได้อย่างไร](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [ฉันจะตั้งค่า SRS สำหรับการส่งต่ออีเมลได้อย่างไร](#how-do-i-set-up-srs-for-forward-email)
  * [ฉันจะตั้งค่า MTA-STS สำหรับการส่งต่ออีเมลได้อย่างไร](#how-do-i-set-up-mta-sts-for-forward-email)
  * [ฉันจะเพิ่มรูปโปรไฟล์ลงในที่อยู่อีเมลของฉันได้อย่างไร](#how-do-i-add-a-profile-picture-to-my-email-address)
* [คุณสมบัติขั้นสูง](#advanced-features)
  * [คุณสนับสนุนจดหมายข่าวหรือรายการส่งไปรษณีย์สำหรับอีเมลที่เกี่ยวข้องกับการตลาดหรือไม่](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [คุณรองรับการส่งอีเมลด้วย API หรือไม่](#do-you-support-sending-email-with-api)
  * [คุณรองรับการรับอีเมลด้วย IMAP หรือไม่](#do-you-support-receiving-email-with-imap)
  * [คุณรองรับ POP3 หรือไม่](#do-you-support-pop3)
  * [คุณรองรับปฏิทิน (CalDAV) หรือไม่](#do-you-support-calendars-caldav)
  * [คุณรองรับการติดต่อ (CardDAV) หรือไม่](#do-you-support-contacts-carddav)
  * [คุณรองรับการส่งอีเมลด้วย SMTP หรือไม่](#do-you-support-sending-email-with-smtp)
  * [คุณรองรับ OpenPGP/MIME, การเข้ารหัสแบบ end-to-end ("E2EE") และ Web Key Directory ("WKD") หรือไม่](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [คุณสนับสนุน MTA-STS หรือไม่](#do-you-support-mta-sts)
  * [คุณรองรับรหัสผ่านและ WebAuthn หรือไม่](#do-you-support-passkeys-and-webauthn)
  * [คุณสนับสนุนแนวทางปฏิบัติที่ดีที่สุดของอีเมลหรือไม่](#do-you-support-email-best-practices)
  * [คุณสนับสนุนเว็บฮุกแบบเด้งกลับหรือไม่](#do-you-support-bounce-webhooks)
  * [คุณสนับสนุนเว็บฮุกหรือไม่](#do-you-support-webhooks)
  * [คุณรองรับนิพจน์ทั่วไปหรือ regex หรือไม่](#do-you-support-regular-expressions-or-regex)
  * [ขีดจำกัด SMTP ขาออกของคุณคืออะไร](#what-are-your-outbound-smtp-limits)
  * [ฉันจำเป็นต้องได้รับการอนุมัติเพื่อเปิดใช้งาน SMTP หรือไม่](#do-i-need-approval-to-enable-smtp)
  * [การตั้งค่าการกำหนดค่าเซิร์ฟเวอร์ SMTP ของคุณคืออะไร](#what-are-your-smtp-server-configuration-settings)
  * [การตั้งค่าการกำหนดค่าเซิร์ฟเวอร์ IMAP ของคุณคืออะไร](#what-are-your-imap-server-configuration-settings)
  * [การตั้งค่าการกำหนดค่าเซิร์ฟเวอร์ POP3 ของคุณคืออะไร](#what-are-your-pop3-server-configuration-settings)
  * [การกำหนดค่ารีเลย์ SMTP แบบ Postfix](#postfix-smtp-relay-configuration)
* [ความปลอดภัย](#security)
  * [เทคนิคการเพิ่มความแข็งแกร่งให้กับเซิร์ฟเวอร์ขั้นสูง](#advanced-server-hardening-techniques)
  * [คุณมีใบรับรอง SOC 2 หรือ ISO 27001 หรือไม่](#do-you-have-soc-2-or-iso-27001-certifications)
  * [คุณใช้การเข้ารหัส TLS สำหรับการส่งต่ออีเมลหรือไม่](#do-you-use-tls-encryption-for-email-forwarding)
  * [คุณรักษาส่วนหัวการตรวจสอบสิทธิ์อีเมลไว้หรือไม่](#do-you-preserve-email-authentication-headers)
  * [คุณรักษาส่วนหัวอีเมลต้นฉบับและป้องกันการปลอมแปลงหรือไม่](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [คุณจะป้องกันสแปมและการละเมิดได้อย่างไร](#how-do-you-protect-against-spam-and-abuse)
  * [คุณเก็บเนื้อหาอีเมลไว้ในดิสก์หรือไม่](#do-you-store-email-content-on-disk)
  * [เนื้อหาอีเมลอาจถูกเปิดเผยระหว่างที่ระบบขัดข้องได้หรือไม่](#can-email-content-be-exposed-during-system-crashes)
  * [ใครมีสิทธิ์เข้าถึงโครงสร้างพื้นฐานอีเมลของคุณ](#who-has-access-to-your-email-infrastructure)
  * [คุณใช้ผู้ให้บริการโครงสร้างพื้นฐานใดบ้าง](#what-infrastructure-providers-do-you-use)
  * [คุณเสนอข้อตกลงการประมวลผลข้อมูล (DPA) หรือไม่](#do-you-offer-a-data-processing-agreement-dpa)
  * [คุณจัดการกับการแจ้งเตือนการละเมิดข้อมูลอย่างไร](#how-do-you-handle-data-breach-notifications)
  * [คุณเสนอสภาพแวดล้อมการทดสอบหรือไม่](#do-you-offer-a-test-environment)
  * [คุณมีเครื่องมือตรวจสอบและแจ้งเตือนหรือไม่](#do-you-provide-monitoring-and-alerting-tools)
  * [คุณจะมั่นใจได้อย่างไรว่ามีความพร้อมใช้งานสูง](#how-do-you-ensure-high-availability)
  * [คุณปฏิบัติตามมาตรา 889 ของพระราชบัญญัติการอนุญาตการป้องกันประเทศ (NDAA) หรือไม่](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [รายละเอียดระบบและเทคนิค](#system-and-technical-details)
  * [คุณเก็บอีเมล์และเนื้อหาไว้หรือไม่](#do-you-store-emails-and-their-contents)
  * [ระบบการส่งต่ออีเมลของคุณทำงานอย่างไร](#how-does-your-email-forwarding-system-work)
  * [คุณดำเนินการอีเมลเพื่อส่งต่ออย่างไร](#how-do-you-process-an-email-for-forwarding)
  * [คุณจัดการกับปัญหาการส่งอีเมลอย่างไร](#how-do-you-handle-email-delivery-issues)
  * [คุณจัดการกับที่อยู่ IP ของคุณที่ถูกบล็อกอย่างไร](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [ที่อยู่ของ Postmaster คืออะไร](#what-are-postmaster-addresses)
  * [ที่อยู่ที่ไม่มีการตอบกลับคืออะไร](#what-are-no-reply-addresses)
  * [ที่อยู่ IP ของเซิร์ฟเวอร์ของคุณคืออะไร](#what-are-your-servers-ip-addresses)
  * [คุณมีรายการอนุญาตหรือไม่](#do-you-have-an-allowlist)
  * [นามสกุลโดเมนใดบ้างที่ได้รับอนุญาตตามค่าเริ่มต้น](#what-domain-name-extensions-are-allowlisted-by-default)
  * [เกณฑ์รายการอนุญาตของคุณคืออะไร](#what-is-your-allowlist-criteria)
  * [นามสกุลโดเมนอะไรบ้างที่สามารถใช้ได้ฟรี](#what-domain-name-extensions-can-be-used-for-free)
  * [คุณมีรายการสีเทาหรือไม่](#do-you-have-a-greylist)
  * [คุณมีรายการปฏิเสธหรือไม่](#do-you-have-a-denylist)
  * [คุณมีการจำกัดอัตราหรือไม่](#do-you-have-rate-limiting)
  * [คุณจะป้องกันการกระเจิงกลับได้อย่างไร](#how-do-you-protect-against-backscatter)
  * [ป้องกันการตีกลับจากผู้ส่งสแปมที่รู้จัก](#prevent-bounces-from-known-mail-from-spammers)
  * [ป้องกันการตีกลับที่ไม่จำเป็นเพื่อป้องกันการกระเจิงกลับ](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [คุณจะกำหนดลายนิ้วมืออีเมลได้อย่างไร](#how-do-you-determine-an-email-fingerprint)
  * [ฉันสามารถส่งต่ออีเมลไปยังพอร์ตอื่นนอกเหนือจาก 25 ได้หรือไม่ (เช่น หาก ISP ของฉันบล็อกพอร์ต 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [รองรับเครื่องหมายบวก + สำหรับนามแฝง Gmail หรือไม่](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [รองรับโดเมนย่อยหรือไม่](#does-it-support-sub-domains)
  * [นี่จะส่งต่อส่วนหัวอีเมลของฉันหรือไม่](#does-this-forward-my-emails-headers)
  * [นี่ทดสอบดีแล้วใช่ไหม](#is-this-well-tested)
  * [คุณส่งข้อความตอบกลับและรหัส SMTP ต่อไปหรือไม่](#do-you-pass-along-smtp-response-messages-and-codes)
  * [คุณจะป้องกันสแปมเมอร์และสร้างชื่อเสียงในการส่งต่ออีเมลที่ดีได้อย่างไร](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [คุณทำการค้นหา DNS บนชื่อโดเมนได้อย่างไร](#how-do-you-perform-dns-lookups-on-domain-names)
* [บัญชีและการเรียกเก็บเงิน](#account-and-billing)
  * [คุณเสนอการรับประกันคืนเงินสำหรับแผนแบบชำระเงินหรือไม่](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [หากฉันเปลี่ยนแผน คุณจะคิดอัตราส่วนและคืนเงินส่วนต่างให้ไหม](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [ฉันสามารถใช้บริการส่งต่ออีเมลนี้เป็นเซิร์ฟเวอร์ MX แบบ "สำรอง" หรือ "สำรอง" ได้หรือไม่](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [ฉันสามารถปิดใช้งานนามแฝงเฉพาะได้หรือไม่](#can-i-disable-specific-aliases)
  * [ฉันสามารถส่งต่ออีเมลไปยังผู้รับหลายคนได้หรือไม่](#can-i-forward-emails-to-multiple-recipients)
  * [ฉันสามารถมีผู้รับแบบครอบคลุมทั่วโลกหลายรายได้หรือไม่](#can-i-have-multiple-global-catch-all-recipients)
  * [มีขีดจำกัดสูงสุดสำหรับจำนวนที่อยู่อีเมลที่ฉันสามารถส่งต่อไปยังนามแฝงได้หรือไม่](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [ฉันสามารถส่งต่ออีเมล์ซ้ำๆ ได้ไหม](#can-i-recursively-forward-emails)
  * [คนอื่นสามารถยกเลิกการลงทะเบียนหรือลงทะเบียนการส่งต่ออีเมลของฉันโดยไม่ได้รับอนุญาตได้หรือไม่](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [มันฟรียังไง](#how-is-it-free)
  * [ขนาดอีเมลสูงสุดจำกัดอยู่ที่เท่าไร](#what-is-the-max-email-size-limit)
  * [คุณเก็บบันทึกอีเมล์หรือไม่](#do-you-store-logs-of-emails)
  * [คุณเก็บบันทึกข้อผิดพลาดหรือไม่](#do-you-store-error-logs)
  * [คุณอ่านอีเมลของฉันไหม](#do-you-read-my-emails)
  * [ฉันสามารถ "ส่งเมลในชื่อ" ใน Gmail ด้วยสิ่งนี้ได้ไหม](#can-i-send-mail-as-in-gmail-with-this)
  * [ฉันสามารถ "ส่งเมลเป็น" ใน Outlook ด้วยสิ่งนี้ได้หรือไม่](#can-i-send-mail-as-in-outlook-with-this)
  * [ฉันสามารถ "ส่งเมลในชื่อ" ใน Apple Mail และ iCloud Mail ด้วยสิ่งนี้ได้หรือไม่](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [ฉันสามารถส่งต่ออีเมลไม่จำกัดจำนวนด้วยวิธีนี้ได้หรือไม่](#can-i-forward-unlimited-emails-with-this)
  * [คุณเสนอโดเมนไม่จำกัดในราคาเดียวหรือไม่](#do-you-offer-unlimited-domains-for-one-price)
  * [คุณยอมรับวิธีการชำระเงินแบบใด](#which-payment-methods-do-you-accept)
* [แหล่งข้อมูลเพิ่มเติม](#additional-resources)

## เริ่มต้นอย่างรวดเร็ว {#quick-start}

วิธีเริ่มต้นใช้งานการส่งต่ออีเมล:

1. **สร้างบัญชี** ที่ [forwardemail.net/register](https://forwardemail.net/register)

2. **เพิ่มและยืนยันโดเมนของคุณ** ภายใต้ [บัญชีของฉัน → โดเมน](/my-account/domains)

3. **เพิ่มและกำหนดค่านามแฝงอีเมล/กล่องจดหมาย** ภายใต้ [บัญชีของฉัน → โดเมน](/my-account/domains) → นามแฝง

4. **ทดสอบการตั้งค่าของคุณ** โดยส่งอีเมลไปยังนามแฝงใหม่ของคุณ

> \[!TIP]
> การเปลี่ยนแปลง DNS อาจใช้เวลาถึง 24-48 ชั่วโมงจึงจะเผยแพร่ไปทั่วโลก แต่โดยทั่วไปจะมีผลเร็วกว่านั้นมาก

> \[!IMPORTANT]
> เพื่อประสิทธิภาพในการจัดส่งที่ดีขึ้น เราขอแนะนำให้ตั้งค่าระเบียน [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) และ [DMARC](#how-do-i-set-up-dmarc-for-forward-email)

## บทนำ {#introduction}

### อีเมลส่งต่อคืออะไร {#what-is-forward-email}

> \[!NOTE]
> การส่งต่ออีเมลเหมาะอย่างยิ่งสำหรับบุคคลทั่วไป ธุรกิจขนาดเล็ก และนักพัฒนาที่ต้องการที่อยู่อีเมลระดับมืออาชีพ โดยไม่ต้องเสียค่าใช้จ่ายและบำรุงรักษาโซลูชันโฮสติ้งอีเมลแบบเต็มรูปแบบ

Forward Email คือ **ผู้ให้บริการอีเมลที่มีคุณลักษณะครบครัน** และ **ผู้ให้บริการโฮสติ้งอีเมลสำหรับชื่อโดเมนแบบกำหนดเอง**

เป็นบริการฟรีและโอเพ่นซอร์สเพียงบริการเดียวที่ให้คุณใช้ที่อยู่อีเมลโดเมนที่กำหนดเองได้โดยไม่ต้องยุ่งยากกับการตั้งค่าและดูแลรักษาเซิร์ฟเวอร์อีเมลของคุณเอง

บริการของเราจะส่งต่ออีเมลที่ส่งถึงโดเมนที่กำหนดเองของคุณไปยังบัญชีอีเมลที่มีอยู่ของคุณ และคุณยังสามารถใช้เราเป็นผู้ให้บริการโฮสติ้งอีเมลเฉพาะของคุณได้อีกด้วย

คุณสมบัติหลักของการส่งต่ออีเมล:

* **อีเมลโดเมนแบบกำหนดเอง**: ใช้ที่อยู่อีเมลแบบมืออาชีพพร้อมชื่อโดเมนของคุณเอง
* **ระดับฟรี**: ส่งต่ออีเมลพื้นฐานฟรี
* **ความเป็นส่วนตัวขั้นสูง**: เราไม่อ่านอีเมลหรือขายข้อมูลของคุณ
* **โอเพนซอร์ส**: ฐานโค้ดทั้งหมดของเราพร้อมใช้งานบน GitHub
* **รองรับ SMTP, IMAP และ POP3**: ความสามารถในการส่งและรับอีเมลอย่างเต็มรูปแบบ
* **การเข้ารหัสแบบ End-to-End**: รองรับ OpenPGP/MIME
* **นามแฝง Catch-All แบบกำหนดเอง**: สร้างนามแฝงอีเมลได้ไม่จำกัด

คุณสามารถเปรียบเทียบเราได้กับผู้ให้บริการอีเมลอื่นๆ มากกว่า 56 รายบน [หน้าเปรียบเทียบอีเมลของเรา](/blog/best-email-service)

> \[!TIP]
> เรียนรู้เพิ่มเติมเกี่ยวกับการส่งต่ออีเมลโดยอ่าน [เอกสารทางเทคนิค](/technical-whitepaper.pdf) ฟรีของเรา

### ใครใช้ Forward Email {#who-uses-forward-email}

เราให้บริการโฮสติ้งอีเมลและบริการส่งต่ออีเมลแก่โดเมนมากกว่า 500,000 โดเมน และผู้ใช้ที่มีชื่อเสียงเหล่านี้:

| ลูกค้า | กรณีศึกษา |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| โรงเรียนนายเรือสหรัฐอเมริกา | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| แคนนอนิคัล | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| เกม Netflix |  |
| มูลนิธิลินุกซ์ | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| มูลนิธิ PHP |  |
| ฟ็อกซ์นิวส์เรดิโอ |  |
| การขายโฆษณาของดิสนีย์ |  |
| เจคิวรี | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| ไลน์เอจโอเอส |  |
| อูบุนตู | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| ฟรี | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| ลูบันตู | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| มหาวิทยาลัยเคมบริดจ์ | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| มหาวิทยาลัยแมริแลนด์ | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| มหาวิทยาลัยวอชิงตัน | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| มหาวิทยาลัยทัฟส์ | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| วิทยาลัยสวอร์ธมอร์ | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| รัฐบาลแห่งออสเตรเลียใต้ |  |
| รัฐบาลสาธารณรัฐโดมินิกัน |  |
| บิน<span>.</span>io |  |
| โรงแรมอาร์ซีดี |  |
| ไอแซค ซี. ชลูเอเตอร์ (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| เดวิด ไฮเนไมเออร์ ฮันส์สัน (Ruby on Rails) |  |

### ประวัติการส่งต่ออีเมลคืออะไร {#what-is-forward-emails-history}

คุณสามารถเรียนรู้เพิ่มเติมเกี่ยวกับการส่งต่ออีเมลได้ที่ [หน้าเกี่ยวกับเรา](/about)

### บริการนี้เร็วแค่ไหน {#how-fast-is-this-service}

> \[!NOTE]
> ระบบของเราออกแบบมาเพื่อความเร็วและความน่าเชื่อถือ โดยมีเซิร์ฟเวอร์สำรองหลายตัวเพื่อให้แน่ใจว่าอีเมลของคุณจะถูกส่งถึงคุณอย่างรวดเร็ว

การส่งต่ออีเมลจะส่งข้อความโดยมีความล่าช้าเพียงเล็กน้อย โดยปกติภายในไม่กี่วินาทีหลังจากได้รับ

ตัวชี้วัดประสิทธิภาพ:

* **ระยะเวลาการจัดส่งโดยเฉลี่ย**: น้อยกว่า 5-10 วินาทีตั้งแต่ได้รับจนถึงการส่งต่อ ([ดูหน้าการตรวจสอบ "TTI" ของ Time to Inbox ของเรา](/tti))
* **ระยะเวลาการทำงาน**: ความพร้อมให้บริการ 99.9%+
* **โครงสร้างพื้นฐานทั่วโลก**: เซิร์ฟเวอร์ตั้งอยู่ในตำแหน่งที่เหมาะสมเพื่อการกำหนดเส้นทางที่ดีที่สุด
* **การปรับขนาดอัตโนมัติ**: ระบบของเราจะปรับขนาดในช่วงเวลาที่มีการใช้งานอีเมลสูงสุด

เราดำเนินการแบบเรียลไทม์ ซึ่งแตกต่างจากผู้ให้บริการรายอื่นที่ต้องอาศัยการรอคิวที่ล่าช้า

เราไม่ได้เขียนลงดิสก์หรือเก็บบันทึก – ด้วย [ข้อยกเว้นของข้อผิดพลาด](#do-you-store-error-logs) และ [SMTP ขาออก](#do-you-support-sending-email-with-smtp) (ดู [นโยบายความเป็นส่วนตัว](/privacy) ของเรา)

ทุกอย่างทำในหน่วยความจำและ [ซอร์สโค้ดของเราอยู่บน GitHub](https://github.com/forwardemail)

## ไคลเอนต์อีเมล {#email-clients}

### ธันเดอร์เบิร์ด {#thunderbird}

1. สร้างนามแฝงใหม่และสร้างรหัสผ่านในแดชบอร์ดการส่งต่ออีเมลของคุณ
2. เปิด Thunderbird แล้วไปที่ **แก้ไข → การตั้งค่าบัญชี → การดำเนินการบัญชี → เพิ่มบัญชีอีเมล**
3. ป้อนชื่อ ที่อยู่อีเมลสำหรับการส่งต่อ และรหัสผ่านของคุณ
4. คลิก **กำหนดค่าด้วยตนเอง** และป้อน:
* ขาเข้า: IMAP, `imap.forwardemail.net`, พอร์ต 993, SSL/TLS
* ขาออก: SMTP, `smtp.forwardemail.net`, พอร์ต 587, STARTTLS
5. คลิก **เสร็จสิ้น**

### ไมโครซอฟท์ เอาท์ลุค {#microsoft-outlook}

1. สร้างนามแฝงใหม่และสร้างรหัสผ่านในแดชบอร์ดการส่งต่ออีเมลของคุณ
2. ไปที่ **ไฟล์ → เพิ่มบัญชี**
3. ป้อนที่อยู่อีเมลสำหรับการส่งต่อของคุณ แล้วคลิก **เชื่อมต่อ**
4. เลือก **ตัวเลือกขั้นสูง** และเลือก **ให้ฉันตั้งค่าบัญชีของฉันด้วยตนเอง**
5. เลือก **IMAP** และป้อน:
* ขาเข้า: `imap.forwardemail.net`, พอร์ต 993, SSL
* ขาออก: `smtp.forwardemail.net`, พอร์ต 587, TLS
* ชื่อผู้ใช้: ที่อยู่อีเมลแบบเต็มของคุณ
* รหัสผ่าน: รหัสผ่านที่คุณสร้างขึ้น
6. คลิก **เชื่อมต่อ**

### แอปเปิลเมล {#apple-mail}

1. สร้างนามแฝงใหม่และสร้างรหัสผ่านในแดชบอร์ดการส่งต่ออีเมลของคุณ
2. ไปที่ **อีเมล → การตั้งค่า → บัญชี → +**
3. เลือก **บัญชีอีเมลอื่น**
4. ป้อนชื่อ ที่อยู่อีเมลสำหรับการส่งต่อ และรหัสผ่านของคุณ
5. สำหรับการตั้งค่าเซิร์ฟเวอร์ ให้ป้อน:
* ขาเข้า: `imap.forwardemail.net`
* ขาออก: `smtp.forwardemail.net`
* ชื่อผู้ใช้: ที่อยู่อีเมลแบบเต็มของคุณ
* รหัสผ่าน: รหัสผ่านที่คุณสร้างขึ้น
6. คลิก **ลงชื่อเข้าใช้**

### อุปกรณ์เคลื่อนที่ {#mobile-devices}

สำหรับ iOS:

1. ไปที่ **การตั้งค่า → อีเมล → บัญชี → เพิ่มบัญชี → อื่นๆ**
2. แตะ **เพิ่มบัญชีอีเมล** แล้วกรอกรายละเอียดของคุณ
3. สำหรับการตั้งค่าเซิร์ฟเวอร์ ให้ใช้การตั้งค่า IMAP และ SMTP เช่นเดียวกับข้างต้น

สำหรับ Android:

1. ไปที่ **การตั้งค่า → บัญชี → เพิ่มบัญชี → ส่วนตัว (IMAP)**
2. ป้อนที่อยู่อีเมลสำหรับส่งต่อและรหัสผ่านของคุณ
3. สำหรับการตั้งค่าเซิร์ฟเวอร์ ให้ใช้การตั้งค่า IMAP และ SMTP เช่นเดียวกับข้างต้น

### วิธีการส่งเมลโดยใช้ Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">เวลาติดตั้งโดยประมาณ:</strong>
<span>น้อยกว่า 10 นาที</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
การเริ่มต้นใช้งาน:
</strong>
<span>
หากคุณทำตามคำแนะนำข้างต้นใน <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">วิธีเริ่มต้นใช้งานและตั้งค่าการส่งต่ออีเมล</a> แล้ว คุณสามารถอ่านต่อด้านล่างได้
</span>
</div>

<div id="ส่งอีเมลเป็นเนื้อหา">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
โปรดตรวจสอบให้แน่ใจว่าคุณได้อ่าน<a href="/terms" class="alert-link" target="_blank">ข้อกำหนด</a>, <a href="/privacy" class="alert-link" target="_blank">นโยบายความเป็นส่วนตัว</a> และ<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">ข้อจำกัด SMTP ขาออก</a> ของเราแล้ว การใช้งานของคุณถือเป็นการยอมรับและตกลง
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
หากคุณเป็นนักพัฒนา โปรดดู<a class="alert-link" href="/email-api#outbound-emails" target="_blank">เอกสาร API อีเมล</a>ของเรา
</span>
</div>

1. ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> การกำหนดค่า SMTP ขาออก และปฏิบัติตามคำแนะนำในการตั้งค่า

2. สร้างนามแฝงใหม่สำหรับโดเมนของคุณภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code><hello@example.com></code>)

3. คลิกที่ <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ถัดจากนามแฝงที่สร้างขึ้นใหม่ คัดลอกไปยังคลิปบอร์ดของคุณและเก็บรหัสผ่านที่สร้างขึ้นที่แสดงบนหน้าจอไว้อย่างปลอดภัย

4. ไปที่ [จีเมล](https://gmail.com) และภายใต้ [การตั้งค่า <i class="fa fa-angle-right"></i> บัญชีและการนำเข้า <i class="fa fa-angle-right"></i> ส่งอีเมลเป็น](https://mail.google.com/mail/u/0/#settings/accounts) คลิก "เพิ่มที่อยู่อีเมลอื่น"

5. เมื่อได้รับแจ้งให้ป้อน "ชื่อ" ให้ป้อนชื่อที่คุณต้องการให้อีเมลของคุณปรากฏเป็น "จาก" (เช่น "Linus Torvalds")

6. เมื่อได้รับแจ้งให้ป้อน "ที่อยู่อีเมล" ให้ป้อนที่อยู่อีเมลเต็มของนามแฝงที่คุณสร้างไว้ภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code><hello@example.com></code>)

7. ยกเลิกการเลือก "ถือเป็นนามแฝง"

8. คลิก "ขั้นตอนถัดไป" เพื่อดำเนินการต่อ

9. เมื่อได้รับแจ้งให้ป้อน "SMTP Server" ให้ป้อน <code>smtp.forwardemail.net</code> และปล่อยให้พอร์ตเป็น <code>587</code>

10. เมื่อได้รับแจ้งให้ป้อน "ชื่อผู้ใช้" ให้ป้อนที่อยู่อีเมลเต็มของนามแฝงที่คุณสร้างขึ้นภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code><hello@example.com></code>)

11. เมื่อได้รับแจ้งให้ใส่ "รหัสผ่าน" ให้วางรหัสผ่านจาก <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ในขั้นตอนที่ 3 ด้านบน

12. ปล่อยให้ปุ่มตัวเลือกถูกเลือกไว้สำหรับ "การเชื่อมต่อที่ปลอดภัยโดยใช้ TLS"

13. คลิก "เพิ่มบัญชี" เพื่อดำเนินการต่อ

14. เปิดแท็บใหม่ไปที่ [จีเมล](https://gmail.com) และรอรับอีเมลยืนยัน (คุณจะได้รับรหัสยืนยันที่ยืนยันว่าคุณเป็นเจ้าของที่อยู่อีเมลที่คุณพยายาม "ส่งอีเมลในชื่อ")

15. เมื่อมาถึงแล้ว ให้คัดลอกและวางรหัสยืนยันที่พร้อมท์ที่คุณได้รับในขั้นตอนก่อนหน้า

16. เมื่อดำเนินการเสร็จแล้ว ให้กลับไปที่อีเมลและคลิกลิงก์เพื่อ "ยืนยันคำขอ" คุณอาจต้องทำขั้นตอนนี้และขั้นตอนก่อนหน้าเพื่อให้การตั้งค่าอีเมลถูกต้อง

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ยินดีด้วย!
</strong>
<span>
คุณทำตามขั้นตอนทั้งหมดเรียบร้อยแล้ว
</span>
</div>
</div>

</div>

### คำแนะนำฟรีสำหรับ Send Mail As โดยใช้ Gmail คืออะไร {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">สำคัญ:</strong> คู่มือฉบับเดิมที่ให้บริการฟรีนี้ถูกยกเลิกการใช้งานตั้งแต่เดือนพฤษภาคม 2566 เนื่องจาก <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we รองรับ SMTP ขาออกแล้ว</a> หากคุณใช้คู่มือด้านล่างนี้ <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this จะทำให้อีเมลขาออกของคุณ</a>แสดงข้อความ "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" ใน Gmail</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">เวลาติดตั้งโดยประมาณ:</strong>
<span>น้อยกว่า 10 นาที</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
การเริ่มต้นใช้งาน:
</strong>
<span>
หากคุณทำตามคำแนะนำข้างต้นใน <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">วิธีเริ่มต้นใช้งานและตั้งค่าการส่งต่ออีเมล</a> แล้ว คุณสามารถอ่านต่อด้านล่างได้
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="วิธีการส่งอีเมลโดยใช้ Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="คู่มือฟรีแบบดั้งเดิม">

1. คุณต้องเปิดใช้งาน [การยืนยันตัวตนแบบสองปัจจัยของ Gmail][gmail-2fa] จึงจะใช้งานได้ ไปที่ <https://www.google.com/landing/2step/> หากคุณยังไม่ได้เปิดใช้งาน

2. เมื่อเปิดใช้งานการยืนยันตัวตนแบบสองปัจจัยแล้ว (หรือหากคุณเปิดใช้งานอยู่แล้ว) ให้ไปที่ <https://myaccount.google.com/apppasswords>.

3. เมื่อระบบแจ้งให้ "เลือกแอปและอุปกรณ์ที่คุณต้องการสร้างรหัสผ่านแอป":
* เลือก "อีเมล" ใต้รายการดรอปดาวน์สำหรับ "เลือกแอป"
* เลือก "อื่นๆ" ใต้รายการดรอปดาวน์สำหรับ "เลือกอุปกรณ์"
* เมื่อระบบแจ้งให้ป้อนข้อความ ให้ป้อนที่อยู่อีเมลของโดเมนที่คุณกำหนดเองซึ่งคุณจะส่งต่อ (เช่น <code><hello@example.com></code> - ซึ่งจะช่วยให้คุณติดตามได้ในกรณีที่คุณใช้บริการนี้สำหรับหลายบัญชี)

4. คัดลอกรหัสผ่านไปยังคลิปบอร์ดที่สร้างขึ้นโดยอัตโนมัติ
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
หากคุณใช้ G Suite โปรดไปที่แผงควบคุมผู้ดูแลระบบ <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">แอป <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> การตั้งค่าสำหรับ Gmail <i class="fa fa-angle-right"></i> การตั้งค่า</a> และตรวจสอบให้แน่ใจว่าได้เลือก "อนุญาตให้ผู้ใช้ส่งอีเมลผ่านเซิร์ฟเวอร์ SMTP ภายนอก..." การเปลี่ยนแปลงนี้อาจใช้เวลาสักครู่ในการเปิดใช้งาน โปรดรอสักครู่
</span>
</div>

5. ไปที่ [จีเมล](https://gmail.com) และภายใต้ [การตั้งค่า <i class="fa fa-angle-right"></i> บัญชีและการนำเข้า <i class="fa fa-angle-right"></i> ส่งอีเมลเป็น](https://mail.google.com/mail/u/0/#settings/accounts) คลิก "เพิ่มที่อยู่อีเมลอื่น"

6. เมื่อได้รับแจ้งให้ป้อน "ชื่อ" ให้ป้อนชื่อที่คุณต้องการให้อีเมลของคุณปรากฏเป็น "จาก" (เช่น "Linus Torvalds")

7. เมื่อได้รับแจ้งให้ป้อน "ที่อยู่อีเมล" ให้ป้อนที่อยู่อีเมลพร้อมโดเมนที่กำหนดเองที่คุณใช้ข้างต้น (เช่น <code><hello@example.com></code>)

8. ยกเลิกการเลือก "ถือเป็นนามแฝง"

9. คลิก "ขั้นตอนถัดไป" เพื่อดำเนินการต่อ

10. เมื่อได้รับแจ้งให้ป้อน "SMTP Server" ให้ป้อน <code>smtp.gmail.com</code> และปล่อยให้พอร์ตเป็น <code>587</code>

11. เมื่อระบบถามถึง "ชื่อผู้ใช้" ให้ป้อนส่วนของอีเมล Gmail ของคุณโดยไม่ต้องใส่ส่วน <span>gmail.com</span> (เช่น ใส่แค่ "user" ถ้าอีเมลของฉันคือ <span><user@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
หากส่วน "ชื่อผู้ใช้" ถูกกรอกโดยอัตโนมัติ <u><strong>คุณจะต้องเปลี่ยนส่วนนี้</strong></u> เป็นส่วนชื่อผู้ใช้ของอีเมล Gmail ของคุณแทน
</span>
</div>

12. เมื่อได้รับแจ้งให้ป้อน "รหัสผ่าน" ให้วางรหัสผ่านที่คุณสร้างขึ้นในขั้นตอนที่ 2 ข้างต้นจากคลิปบอร์ดของคุณ

13. ปล่อยให้ปุ่มตัวเลือกถูกเลือกไว้สำหรับ "การเชื่อมต่อที่ปลอดภัยโดยใช้ TLS"

14. คลิก "เพิ่มบัญชี" เพื่อดำเนินการต่อ

15. เปิดแท็บใหม่ไปที่ [จีเมล](https://gmail.com) และรอรับอีเมลยืนยัน (คุณจะได้รับรหัสยืนยันที่ยืนยันว่าคุณเป็นเจ้าของที่อยู่อีเมลที่คุณพยายาม "ส่งอีเมลในชื่อ")

16. เมื่อมาถึงแล้ว ให้คัดลอกและวางรหัสยืนยันที่พร้อมท์ที่คุณได้รับในขั้นตอนก่อนหน้า

17. เมื่อดำเนินการเสร็จแล้ว ให้กลับไปที่อีเมลและคลิกลิงก์เพื่อ "ยืนยันคำขอ" คุณอาจต้องทำขั้นตอนนี้และขั้นตอนก่อนหน้าเพื่อให้การตั้งค่าอีเมลถูกต้อง

</div>

### การกำหนดค่าการกำหนดเส้นทาง Gmail ขั้นสูง {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">เวลาโดยประมาณในการตั้งค่า:</strong>
<span>15-30 นาที</span>
</div>

หากคุณต้องการตั้งค่าการกำหนดเส้นทางขั้นสูงใน Gmail เพื่อให้ชื่อแทนที่ไม่ตรงกับกล่องจดหมายส่งต่อไปยังการแลกเปลี่ยนอีเมลของ Forward Email ให้ทำตามขั้นตอนเหล่านี้:

1. เข้าสู่ระบบคอนโซลผู้ดูแลระบบ Google ที่ [admin.google.com](https://admin.google.com)
2. ไปที่ **แอป → Google Workspace → Gmail → การกำหนดเส้นทาง**
3. คลิก **เพิ่มเส้นทาง** และกำหนดค่าการตั้งค่าต่อไปนี้:

**การตั้งค่าผู้รับรายเดียว:**

* เลือก "เปลี่ยนผู้รับซองจดหมาย" และป้อนที่อยู่ Gmail หลักของคุณ
* เลือก "เพิ่มส่วนหัว X-Gm-Original-To กับผู้รับเดิม"

**รูปแบบผู้รับซองจดหมาย:**

* เพิ่มรูปแบบที่ตรงกับกล่องจดหมายที่ไม่มีอยู่ทั้งหมด (เช่น `.*@yourdomain.com`)

**การตั้งค่าเซิร์ฟเวอร์อีเมล:**

* เลือก "กำหนดเส้นทางไปยังโฮสต์" และป้อน `mx1.forwardemail.net` เป็นเซิร์ฟเวอร์หลัก
* เพิ่ม `mx2.forwardemail.net` เป็นเซิร์ฟเวอร์สำรอง
* ตั้งค่าพอร์ตเป็น 25
* เลือก "ต้องใช้ TLS" เพื่อความปลอดภัย

4. คลิก **บันทึก** เพื่อสร้างเส้นทาง

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
การกำหนดค่านี้จะใช้งานได้เฉพาะกับบัญชี Google Workspace ที่มีโดเมนที่กำหนดเองเท่านั้น ไม่สามารถใช้กับบัญชี Gmail ทั่วไปได้
</span>
</div>

### การกำหนดค่าการกำหนดเส้นทาง Outlook ขั้นสูง {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">เวลาโดยประมาณในการตั้งค่า:</strong>
<span>15-30 นาที</span>
</div>

สำหรับผู้ใช้ Microsoft 365 (เดิมคือ Office 365) ที่ต้องการตั้งค่าการกำหนดเส้นทางขั้นสูงเพื่อให้ชื่อแทนที่ไม่ตรงกับกล่องจดหมายถูกส่งต่อไปยังการแลกเปลี่ยนอีเมลของ Forward Email:

1. เข้าสู่ระบบศูนย์ดูแลระบบ Microsoft 365 ที่ [admin.microsoft.com](https://admin.microsoft.com)
2. ไปที่ **Exchange → การรับส่งอีเมล → กฎ**
3. คลิก **เพิ่มกฎ** แล้วเลือก **สร้างกฎใหม่**
4. ตั้งชื่อกฎของคุณ (เช่น "ส่งต่อกล่องจดหมายที่ไม่มีอยู่ไปยังอีเมลส่งต่อ")
5. ใต้ **ใช้กฎนี้ถ้า** ให้เลือก:
* "ที่อยู่ผู้รับตรงกับ..."
* ป้อนรูปแบบที่ตรงกับที่อยู่ทั้งหมดในโดเมนของคุณ (เช่น `*@yourdomain.com`)
6. ใต้ **ดำเนินการดังต่อไปนี้** ให้เลือก:
* "เปลี่ยนเส้นทางข้อความไปยัง..."
* เลือก "เซิร์ฟเวอร์อีเมลต่อไปนี้"
* ป้อน `mx1.forwardemail.net` และพอร์ต 25
* เพิ่ม `mx2.forwardemail.net` เป็นเซิร์ฟเวอร์สำรอง
7. ใต้ **ยกเว้นถ้า** ให้เลือก:
* "ผู้รับคือ..."
* เพิ่มกล่องจดหมายที่มีอยู่ทั้งหมดของคุณที่ไม่ควรส่งต่อ
8. ตั้งค่า ลำดับความสำคัญของกฎเพื่อให้แน่ใจว่ากฎจะทำงานตามหลังกฎการรับส่งเมลอื่นๆ
9. คลิก **บันทึก** เพื่อเปิดใช้งานกฎ

## การแก้ไขปัญหา {#troubleshooting}

### ทำไมฉันไม่ได้รับอีเมลทดสอบ {#why-am-i-not-receiving-my-test-emails}

หากคุณกำลังส่งอีเมลทดสอบถึงตัวเอง อีเมลดังกล่าวอาจไม่ปรากฏในกล่องจดหมาย เนื่องจากมีส่วนหัว "Message-ID" เหมือนกัน

นี่เป็นปัญหาที่ทราบกันดีและยังส่งผลกระทบต่อบริการต่างๆ เช่น Gmail ด้วย <a href="https://support.google.com/a/answer/1703601">Here คือคำตอบอย่างเป็นทางการของ Gmail เกี่ยวกับปัญหานี้</a>

หากยังคงพบปัญหาอยู่ แสดงว่าปัญหาน่าจะเกิดจากการแพร่กระจาย DNS คุณอาจต้องรออีกสักหน่อยแล้วลองใหม่อีกครั้ง (หรือลองตั้งค่า TTL ต่ำลงในระเบียน <strong class="notranslate">TXT</strong> ของคุณ)

**ยังคงประสบปัญหาอยู่หรือไม่** โปรด<a href="/help">ติดต่อเรา</a>เพื่อให้เราสามารถช่วยตรวจสอบปัญหาและหาทางแก้ไขได้อย่างรวดเร็ว

### ฉันจะกำหนดค่าไคลเอนต์อีเมลของฉันให้ทำงานกับการส่งต่ออีเมล {#how-do-i-configure-my-email-client-to-work-with-forward-email} ได้อย่างไร

<div class="mb-3">
บริการของเรารองรับโปรแกรมรับส่งอีเมลยอดนิยม เช่น:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> เดสก์ท็อป</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> เทอร์มินัล</a></li>
  </ul>
</div>

<div class="alert alert-primary">
ชื่อผู้ใช้ของคุณคือที่อยู่อีเมลของนามแฝง และรหัสผ่านมาจาก <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ("รหัสผ่านปกติ")
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>หากคุณใช้ Thunderbird โปรดตรวจสอบให้แน่ใจว่าได้ตั้งค่า "ความปลอดภัยการเชื่อมต่อ" เป็น "SSL/TLS" และวิธีการตรวจสอบสิทธิ์เป็น "รหัสผ่านปกติ"</span>
</div>

| พิมพ์ | ชื่อโฮสต์ | โปรโตคอล | พอร์ต |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **แนะนำ** | `993` และ `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **แนะนำ** หรือ TLS (STARTTLS) | `465` และ `2465` สำหรับ SSL/TLS (หรือ) `587`, `2587`, `2525` และ `25` สำหรับ TLS (STARTTLS) |

### ทำไมอีเมลของฉันจึงไปอยู่ในสแปมและขยะ และฉันสามารถตรวจสอบชื่อเสียงโดเมนของฉันได้อย่างไร {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

หัวข้อนี้จะแนะนำคุณว่าอีเมลขาออกของคุณใช้เซิร์ฟเวอร์ SMTP ของเราหรือไม่ (เช่น `smtp.forwardemail.net`) (หรือส่งต่อผ่าน `mx1.forwardemail.net` หรือ `mx2.forwardemail.net`) และถูกส่งไปในโฟลเดอร์สแปมหรือขยะของผู้รับ

เราตรวจสอบ [ที่อยู่ IP](#what-are-your-servers-ip-addresses) เทียบกับ [ผู้ปฏิเสธ DNS ที่มีชื่อเสียงทั้งหมด](#how-do-you-handle-your-ip-addresses-becoming-blocked) เป็นประจำ **ดังนั้น ปัญหานี้จึงน่าจะเกิดจากชื่อเสียงของโดเมนโดยเฉพาะ**

อีเมลอาจไปอยู่ในโฟลเดอร์สแปมได้ด้วยเหตุผลหลายประการ:

1. **ขาดการตรวจสอบสิทธิ์**: ตั้งค่าระเบียน [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) และ [DMARC](#how-do-i-set-up-dmarc-for-forward-email)

2. **ชื่อเสียงของโดเมน**: โดเมนใหม่มักจะมีชื่อเสียงเป็นกลางจนกว่าจะสร้างประวัติการส่ง

3. **ตัวกระตุ้นเนื้อหา**: คำหรือวลีบางคำสามารถกระตุ้นตัวกรองสแปมได้

4. **รูปแบบการส่ง**: ปริมาณอีเมลที่เพิ่มขึ้นอย่างกะทันหันอาจดูน่าสงสัย

คุณสามารถลองใช้เครื่องมือเหล่านี้หนึ่งรายการหรือมากกว่าเพื่อตรวจสอบชื่อเสียงและหมวดหมู่ของโดเมนของคุณ:

| ชื่อเครื่องมือ | URL | พิมพ์ |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| ข้อเสนอแนะเกี่ยวกับการจัดหมวดหมู่โดเมน Cloudflare | <https://radar.cloudflare.com/โดเมน/ฟีดแบ็ก> | การแบ่งประเภท |
| เครื่องตรวจสอบ IP และชื่อเสียงโดเมนของ Spamhaus | <https://check.spamhaus.org/> | DNSBL |
| ศูนย์ชื่อเสียง IP และโดเมน Cisco Talos | <https://talosintelligence.com/reputation_center> | ชื่อเสียง |
| การค้นหา IP และชื่อเสียงโดเมนของ Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| การตรวจสอบบัญชีดำของ MX Toolbox | <https://mxtoolbox.com/รายการดำ.aspx> | บัญชีดำ |
| เครื่องมือ Google Postmaster | <https://www.gmail.com/postmaster/> | ชื่อเสียง |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | ชื่อเสียง |
| การตรวจสอบบัญชีดำ MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| คะแนนผู้ส่ง | <https://senderscore.org/act/blocklist-remover/> | ชื่อเสียง |
| การประเมินค่าต่ำ | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| การลบ IP ของ Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | การถอดถอน |
| การลบ IP ของ Cloudmark | <https://csi.cloudmark.com/en/รีเซ็ต/> | การถอดถอน |
| สแปมคอป | <https://www.spamcop.net/bl.shtml> | DNSBL |
| การลบ IP ของ Microsoft Outlook และ Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/โพสต์มาสเตอร์> | การถอดถอน |
| UCEPROTECT ระดับ 1, 2 และ 3 | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| backscatterer.org ของ UCEPROTECT | <https://www.backscatterer.org/> | การป้องกันการกระเจิงกลับ |
| Whitelisted.org ของ UCEPROTECT | <https://www.whitelisted.org/> (ต้องเสียค่าธรรมเนียม) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | การถอดถอน |
| AOL/Verizon (เช่น `[IPTS04]`) | <https://senders.yahooinc.com/> | การถอดถอน |
| บริษัท ค็อกซ์ คอมมิวนิเคชั่นส์ | `unblock.request@cox.net` | การถอดถอน |
| t-online.de (เยอรมัน/T-Mobile) | `tobr@rx.t-online.de` | การถอดถอน |

> \[!TIP]
> เริ่มต้นด้วยอีเมลคุณภาพสูงปริมาณน้อยเพื่อสร้างชื่อเสียงที่ดีก่อนที่จะส่งอีเมลปริมาณมาก

> \[!IMPORTANT]
> หากโดเมนของคุณอยู่ในบัญชีดำ บัญชีดำแต่ละรายการจะมีกระบวนการลบของตัวเอง โปรดตรวจสอบคำแนะนำบนเว็บไซต์ของแต่ละโดเมน

> \[!TIP]
> หากคุณต้องการความช่วยเหลือเพิ่มเติมหรือพบว่าเราถูกระบุเป็นสแปมโดยผู้ให้บริการอีเมลบางราย โปรด<a href="/help">ติดต่อเรา</a>

### ฉันควรทำอย่างไรหากได้รับอีเมลขยะ {#what-should-i-do-if-i-receive-spam-emails}

คุณควรยกเลิกการสมัครรับอีเมล (ถ้าเป็นไปได้) และบล็อคผู้ส่ง

โปรดอย่ารายงานข้อความว่าเป็นสแปม แต่ให้ส่งต่อไปยังระบบป้องกันการละเมิดที่เราจัดทำขึ้นเองและเน้นเรื่องความเป็นส่วนตัวแทน

**ที่อยู่อีเมลที่จะส่งต่อสแปมคือ:** <abuse@forwardemail.net>

### เหตุใดอีเมลทดสอบที่ส่งถึงตัวเองใน Gmail จึงแสดงเป็น "น่าสงสัย" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

หากคุณเห็นข้อความแสดงข้อผิดพลาดนี้ใน Gmail เมื่อคุณส่งการทดสอบถึงตัวคุณเอง หรือเมื่อบุคคลที่คุณกำลังส่งอีเมลถึงโดยใช้ชื่อแฝงของคุณเห็นอีเมลจากคุณเป็นครั้งแรก **โปรดอย่ากังวล** เนื่องจากนี่เป็นคุณลักษณะด้านความปลอดภัยในตัวของ Gmail

คุณสามารถคลิก "ดูปลอดภัย" ได้เลย ตัวอย่างเช่น หากคุณส่งข้อความทดสอบโดยใช้ฟีเจอร์ส่งอีเมลเป็น (ถึงคนอื่น) พวกเขาจะไม่เห็นข้อความนี้

อย่างไรก็ตาม หากผู้ใช้เห็นข้อความนี้ แสดงว่าปกติแล้วพวกเขาคุ้นเคยกับการเห็นอีเมลของคุณที่ส่งมาจาก <john@gmail.com> แทนที่จะเป็น <john@customdomain.com> (เป็นเพียงตัวอย่าง) Gmail จะแจ้งเตือนผู้ใช้เพื่อให้แน่ใจว่าทุกอย่างปลอดภัย เผื่อไว้ในกรณีที่ไม่มีวิธีแก้ไข

### ฉันสามารถลบ via forwardemail dot net ใน Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail} ได้หรือไม่

หัวข้อนี้เกี่ยวข้องกับ [ปัญหาที่ทราบกันดีใน Gmail ที่มีข้อมูลเพิ่มเติมปรากฏถัดจากชื่อผู้ส่ง](https://support.google.com/mail/answer/1311182)

ตั้งแต่เดือนพฤษภาคม 2023 เป็นต้นไป เราสนับสนุนการส่งอีเมลด้วย SMTP เป็นส่วนเสริมสำหรับผู้ใช้ที่ชำระเงินทุกคน ซึ่งหมายความว่า คุณสามารถลบ <span class="notranslate">via forwardemail dot net</span> ใน Gmail ได้

โปรดทราบว่าหัวข้อคำถามที่พบบ่อยนี้มีไว้สำหรับผู้ใช้คุณลักษณะ [วิธีการส่งเมลโดยใช้ Gmail](#how-to-send-mail-as-using-gmail) โดยเฉพาะ

โปรดดูส่วนของ [คุณรองรับการส่งอีเมลด้วย SMTP หรือไม่](#do-you-support-sending-email-with-smtp) เพื่อดูคำแนะนำในการกำหนดค่า

## การจัดการข้อมูล {#data-management}

### เซิร์ฟเวอร์ของคุณอยู่ที่ไหน {#where-are-your-servers-located}

> \[!TIP]
> เร็วๆ นี้ เราอาจประกาศสถานที่ตั้งศูนย์ข้อมูลในสหภาพยุโรปของเรา ซึ่งโฮสต์ภายใต้ [forwardemail.eu](https://forwardemail.eu) ติดตามการสนทนาได้ที่ <https://github.com/orgs/forwardemail/discussions/336> เพื่อรับข้อมูลอัปเดต

เซิร์ฟเวอร์ของเราตั้งอยู่ในเดนเวอร์ รัฐโคโลราโดเป็นหลัก โปรดดู <https://forwardemail.net/ips> สำหรับรายชื่อที่อยู่ IP ทั้งหมดของเรา

คุณสามารถเรียนรู้เกี่ยวกับโปรเซสเซอร์ย่อยของเราได้ที่หน้า [GDPR](/gdpr), [DPA](/dpa) และ [ความเป็นส่วนตัว](/privacy)

### ฉันจะส่งออกและสำรองข้อมูลกล่องจดหมายของฉัน {#how-do-i-export-and-backup-my-mailbox} ได้อย่างไร

คุณสามารถส่งออกกล่องจดหมายของคุณเป็นรูปแบบ [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [เอ็มบ็อกซ์](https://en.wikipedia.org/wiki/Mbox) หรือรูปแบบเข้ารหัส [SQLite](https://en.wikipedia.org/wiki/SQLite) ได้ตลอดเวลา

ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง <i class="fa fa-angle-right"></i> ดาวน์โหลดการสำรองข้อมูลและเลือกประเภทรูปแบบการส่งออกที่คุณต้องการ

คุณจะได้รับลิงก์สำหรับดาวน์โหลดไฟล์ส่งออกทางอีเมลเมื่อเสร็จสิ้น

โปรดทราบว่าลิงก์ดาวน์โหลดการส่งออกนี้จะหมดอายุหลังจาก 4 ชั่วโมงเนื่องจากปัญหาความปลอดภัย

หากคุณต้องการตรวจสอบรูปแบบ EML หรือ Mbox ที่ส่งออก เครื่องมือโอเพ่นซอร์สเหล่านี้อาจเป็นประโยชน์:

| ชื่อ | รูปแบบ | แพลตฟอร์ม | URL ของ GitHub |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| โปรแกรมดู MBox | เอ็มบ็อกซ์ | หน้าต่าง | <https://github.com/eneam/mboxviewer> |
| mbox-web-viewer | เอ็มบ็อกซ์ | ทุกแพลตฟอร์ม | <https://github.com/PHMRanger/mbox-web-viewer> |
| โปรแกรมอ่าน Eml | EML | หน้าต่าง | <https://github.com/ayamadori/EmlReader> |
| โปรแกรมดูอีเมล์ | EML | วีเอสโค้ด | <https://github.com/joelharkes/vscode_email_viewer> |
| โปรแกรมอ่าน EML | EML | ทุกแพลตฟอร์ม | <https://github.com/s0ph1e/eml-reader> |

นอกจากนี้ หากคุณต้องการแปลงไฟล์ Mbox เป็นไฟล์ EML คุณสามารถใช้ <https://github.com/noelmartinon/mboxzilla>. ได้

### ฉันจะนำเข้าและย้ายกล่องจดหมายที่มีอยู่ของฉัน {#how-do-i-import-and-migrate-my-existing-mailbox} ได้อย่างไร

คุณสามารถนำเข้าอีเมลของคุณไปยัง Forward Email ได้อย่างง่ายดาย (เช่น ใช้ [ธันเดอร์เบิร์ด](https://www.thunderbird.net)) ด้วยคำแนะนำด้านล่างนี้:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
คุณต้องทำตามขั้นตอนทั้งหมดต่อไปนี้เพื่อนำเข้าอีเมลที่มีอยู่ของคุณ
</span>
</div>

1. ส่งออกอีเมล์ของคุณจากผู้ให้บริการอีเมล์ที่มีอยู่ของคุณ:

| ผู้ให้บริการอีเมล์ | รูปแบบการส่งออก | คำแนะนำในการส่งออก |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| จีเมล | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| แนวโน้ม | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">เคล็ดลับ:</strong> <span>หากคุณใช้ Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">รูปแบบการส่งออก PST</a>) คุณสามารถทำตามคำแนะนำภายใต้ "อื่นๆ" ด้านล่างได้อย่างง่ายดาย อย่างไรก็ตาม เราได้จัดเตรียมลิงก์ไว้ด้านล่างเพื่อแปลงไฟล์ PST เป็นรูปแบบ MBOX/EML ตามระบบปฏิบัติการของคุณ:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba สำหรับ Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst สำหรับ Windows cygwin</a> – (เช่น <code>readpst -u -o $OUT_DIR $IN_DIR</code> แทนที่ <code>$OUT_DIR</code> และ <code>$IN_DIR</code> พร้อมเส้นทางไดเรกทอรีเอาต์พุตและเส้นทางไดเรกทอรีอินพุตตามลำดับ)</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst สำหรับ Ubuntu/Linux</a> – (เช่น <code>sudo apt-get install readpst</code> จากนั้น <code>readpst -u -o $OUT_DIR $IN_DIR</code> โดยแทนที่ <code>$OUT_DIR</code> และ <code>$IN_DIR</code> ด้วยเส้นทางไดเรกทอรีเอาต์พุตและเส้นทางไดเรกทอรีอินพุตตามลำดับ)</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst สำหรับ macOS (ผ่าน brew)</a> – (เช่น <code>brew install libpst</code> จากนั้น <code>readpst -u -o $OUT_DIR $IN_DIR</code> โดยแทนที่ <code>$OUT_DIR</code> และ <code>$IN_DIR</code> ด้วยเส้นทางไดเรกทอรีเอาต์พุตและเส้นทางไดเรกทอรีอินพุตตามลำดับ</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">ตัวแปลง PST สำหรับ Windows (GitHub)</a></li></ul><br /></span></div> |
| แอปเปิลเมล | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| ฟาสต์เมล์ | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-ดาวน์โหลดข้อมูลทั้งหมดของคุณ#downloadmail> |
| โปรตอนเมล | MBOX/EML | <https://proton.me/support/อีเมลส่งออก-นำเข้า-ส่งออกแอป> |
| ตุตาโนต้า | EML | <https://github.com/crepererum-oss/tatutanatata> |
| คิด | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| โซโห | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| อื่น | [Use Thunderbird](https://www.thunderbird.net) | ตั้งค่าบัญชีอีเมลที่มีอยู่ของคุณใน Thunderbird แล้วใช้ปลั๊กอิน [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) เพื่อส่งออกและนำเข้าอีเมลของคุณ **คุณยังสามารถคัดลอก/วาง หรือลาก/วางอีเมลระหว่างบัญชีหนึ่งไปยังอีกบัญชีหนึ่งได้อย่างง่ายดาย** |

2. ดาวน์โหลด ติดตั้ง และเปิด [ธันเดอร์เบิร์ด](https://www.thunderbird.net)

3. สร้างบัญชีใหม่โดยใช้ที่อยู่อีเมลเต็มของนามแฝงของคุณ (เช่น <code><you@yourdomain.com></code>) และรหัสผ่านที่คุณสร้างขึ้น <strong>หากคุณยังไม่มีรหัสผ่านที่คุณสร้างขึ้น โปรด<a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">ดูคำแนะนำการตั้งค่าของเรา</a></strong>

4. ดาวน์โหลดและติดตั้งปลั๊กอิน [เครื่องมือนำเข้าส่งออกของ](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird

5. สร้างโฟลเดอร์ใหม่ในเครื่อง Thunderbird จากนั้นคลิกขวาที่โฟลเดอร์นั้น → เลือกตัวเลือก `ImportExportTools NG` → เลือก `Import mbox file` (สำหรับรูปแบบการส่งออก MBOX) หรือ `Import messages` / `Import all messages from a directory` (สำหรับรูปแบบการส่งออก EML)

6. ลาก/วางจากโฟลเดอร์ในเครื่องไปยังโฟลเดอร์ IMAP ใหม่ (หรือที่มีอยู่แล้ว) ใน Thunderbird ที่คุณต้องการอัปโหลดข้อความไปยังพื้นที่จัดเก็บ IMAP ด้วยบริการของเรา วิธีนี้จะช่วยให้มั่นใจได้ว่าข้อความจะได้รับการสำรองข้อมูลออนไลน์ด้วยพื้นที่จัดเก็บที่เข้ารหัสด้วย SQLite ของเรา

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>
หากคุณสับสนเกี่ยวกับวิธีการนำเข้าสู่ Thunderbird คุณสามารถดูคำแนะนำอย่างเป็นทางการได้ที่ <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> และ <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
เมื่อคุณเสร็จสิ้นกระบวนการส่งออกและนำเข้า คุณอาจต้องการเปิดใช้งานการส่งต่อในบัญชีอีเมลที่มีอยู่ และตั้งค่าระบบตอบกลับอัตโนมัติเพื่อแจ้งผู้ส่งว่าคุณมีที่อยู่อีเมลใหม่ (เช่น หากก่อนหน้านี้คุณใช้ Gmail และตอนนี้กำลังใช้อีเมลที่มีชื่อโดเมนที่กำหนดเอง)
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ยินดีด้วย!
</strong>
<span>
คุณทำตามขั้นตอนทั้งหมดเรียบร้อยแล้ว
</span>
</div>
</div>

### คุณสนับสนุนการโฮสต์ด้วยตนเอง {#do-you-support-self-hosting} หรือไม่

ใช่ ตั้งแต่เดือนมีนาคม 2025 เป็นต้นไป เรารองรับตัวเลือกการโฮสต์ด้วยตนเอง อ่านบล็อก [ที่นี่](https://forwardemail.net/blog/docs/self-hosted-solution) ดู [คู่มือโฮสต์ด้วยตนเอง](https://forwardemail.net/self-hosted) เพื่อเริ่มต้นใช้งาน และสำหรับผู้ที่สนใจเวอร์ชันแบบละเอียดทีละขั้นตอน โปรดดูคู่มือ [อูบุนตู](https://forwardemail.net/guides/selfhosted-on-ubuntu) หรือ [เดเบียน](https://forwardemail.net/guides/selfhosted-on-debian) ของเรา

## การกำหนดค่าอีเมล {#email-configuration}

### ฉันจะเริ่มต้นและตั้งค่าการส่งต่ออีเมล {#how-do-i-get-started-and-set-up-email-forwarding} ได้อย่างไร

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">เวลาติดตั้งโดยประมาณ:</strong>
<span>น้อยกว่า 10 นาที</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
การเริ่มต้นใช้งาน:
</strong>
<span>
โปรดอ่านและทำตามขั้นตอนที่ 1 ถึง 8 ด้านล่างอย่างละเอียด อย่าลืมแทนที่ที่อยู่อีเมล <code>user@gmail.com</code> ด้วยที่อยู่อีเมลที่คุณต้องการส่งต่ออีเมล (หากยังไม่ถูกต้อง) เช่นเดียวกัน อย่าลืมแทนที่ <code>example.com</code> ด้วยชื่อโดเมนที่คุณกำหนดเอง (หากยังไม่ถูกต้อง)
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">หากคุณจดทะเบียนชื่อโดเมนไว้แล้ว คุณต้องข้ามขั้นตอนนี้ไปโดยสิ้นเชิงและไปที่ขั้นตอนที่สอง! มิฉะนั้น คุณสามารถ<a href="/domain-registration" rel="noopener noreferrer">คลิกที่นี่เพื่อจดทะเบียนชื่อโดเมนของคุณ</a></li>
<li class="mb-2 mb-md-3 mb-lg-5">
คุณจำได้ไหมว่าจดทะเบียนโดเมนไว้ที่ไหน? เมื่อจำได้แล้ว ให้ทำตามคำแนะนำด้านล่าง:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
คุณต้องเปิดแท็บใหม่และลงชื่อเข้าใช้ผู้รับจดทะเบียนโดเมนของคุณ คุณสามารถคลิกที่ "ผู้รับจดทะเบียน" ด้านล่างเพื่อดำเนินการนี้โดยอัตโนมัติ ในแท็บใหม่นี้ คุณต้องไปที่หน้าการจัดการ DNS ของผู้รับจดทะเบียนของคุณ และเราได้แสดงขั้นตอนการนำทางแบบทีละขั้นตอนไว้ด้านล่างภายใต้คอลัมน์ "ขั้นตอนการกำหนดค่า" เมื่อคุณไปที่หน้านี้ในแท็บใหม่แล้ว คุณสามารถกลับมาที่แท็บนี้และดำเนินการต่อไปยังขั้นตอนที่สามด้านล่างได้
<strong class="font-weight-bold">อย่าเพิ่งปิดแท็บที่เปิดอยู่ คุณจะต้องใช้แท็บนี้สำหรับขั้นตอนต่อไป!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>ผู้รับจดทะเบียน</th>
<th>ขั้นตอนการกำหนดค่า</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> ศูนย์โดเมน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> แก้ไขการตั้งค่า DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon เส้นทาง 53</a></td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> โซนที่โฮสต์ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> เซิร์ฟเวอร์ของฉัน <i class="fa fa-angle-right"></i> การจัดการโดเมน <i class="fa fa-angle-right"></i> ตัวจัดการ DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>สำหรับ ROCK: เข้าสู่ระบบ <i class="fa fa-angle-right"></i> โดเมน <i class="fa fa-angle-right"></i> (คลิกไอคอน ▼ ถัดจากการจัดการ) <i class="fa fa-angle-right"></i> DNS
<br />
สำหรับระบบเก่า: เข้าสู่ระบบ <i class="fa fa-angle-right"></i> โดเมน <i class="fa fa-angle-right"></i> ตัวแก้ไขโซน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS ง่ายๆ</a></td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> จัดการ</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> เครือข่าย <i class="fa fa-angle-right"></i> โดเมน <i class="fa fa-angle-right"></i> (เลือก โดเมนของคุณ) <i class="fa fa-angle-right"></i> เพิ่มเติม <i class="fa fa-angle-right"></i> จัดการโดเมน</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> ในมุมมองบัตร คลิกจัดการโดเมนของคุณ <i class="fa fa-angle-right"></i> ในมุมมองรายการ คลิก
ไอคอนรูปเฟือง <i class="fa fa-angle-right"></i> DNS และเนมเซิร์ฟเวอร์ <i class="fa fa-angle-right"></i> ระเบียน DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> ดู</a>
</td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> จัดการ <i class="fa fa-angle-right"></i> (คลิกไอคอนรูปเฟือง) <i class="fa fa-angle-right"></i> คลิกที่ DNS และเนมเซิร์ฟเวอร์ในเมนูด้านซ้าย</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> แผงควบคุม <i class="fa fa-angle-right"></i> โดเมน <i class="fa fa-angle-right"></i> จัดการโดเมน <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> ภาพรวม <i class="fa fa-angle-right"></i> จัดการ <i class="fa fa-angle-right"></i> ตัวแก้ไขแบบง่าย <i class="fa fa-angle-right"></i> บันทึก</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> การจัดการ <i class="fa fa-angle-right"></i> แก้ไขโซน</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> ดู</a>
</td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> จัดการโดเมนของฉัน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> จัดการ DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 โดเมน</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> ดู</a>
</td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> กำหนดค่า DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> ดู</a>
</td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> รายการโดเมน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> จัดการ <i class="fa fa-angle-right"></i> DNS ขั้นสูง</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> ตั้งค่า Netlify DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 Solutions</a></td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> ผู้จัดการบัญชี <i class="fa fa-angle-right"></i> ชื่อโดเมนของฉัน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> จัดการ <i class="fa fa-angle-right"></i> เปลี่ยนตำแหน่งที่โดเมนชี้ <i class="fa fa-angle-right"></i> DNS ขั้นสูง</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> ดู</a>
</td>
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> โดเมนที่จัดการ <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> การตั้งค่า DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> เมนูหลัก <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> โดเมน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i>
การตั้งค่าขั้นสูง <i class="fa fa-angle-right"></i> ระเบียนที่กำหนดเอง</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 ตอนนี้</a></td>
<td>กำลังใช้งาน CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> หน้าโดเมน <i class="fa fa-angle-right"></i> (เลือกโดเมนของคุณ) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> หน้าโดเมน <i class="fa fa-angle-right"></i> (คลิก <i class="fa fa-ellipsis-h"></i> ไอคอน) <i class="fa fa-angle-right"></i> เลือกจัดการระเบียน DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8
<td>เข้าสู่ระบบ <i class="fa fa-angle-right"></i> โดเมน <i class="fa fa-angle-right"></i> โดเมนของฉัน</td>
</tr>
<tr>
<td>อื่นๆ</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">สำคัญ:</strong> ไม่พบชื่อผู้รับจดทะเบียนของคุณที่นี่ใช่ไหม เพียงค้นหาบนอินเทอร์เน็ตสำหรับ "วิธีเปลี่ยนระเบียน DNS บน $REGISTRAR" (แทนที่ $REGISTRAR ด้วยชื่อผู้รับจดทะเบียนโดเมนของคุณ เช่น "วิธีเปลี่ยนระเบียน DNS บน GoDaddy" หากคุณใช้ GoDaddy)</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">ใช้หน้าการจัดการ DNS ของผู้รับจดทะเบียนโดเมนของคุณ (แท็บอื่นที่คุณเปิดไว้) ตั้งค่าระเบียน "MX" ต่อไปนี้:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
โปรดทราบว่าไม่ควรมีการตั้งค่าระเบียน MX อื่นใด ระเบียนทั้งสองที่แสดงด้านล่างต้องมีอยู่จริง โปรดตรวจสอบให้แน่ใจว่าไม่มีการพิมพ์ผิด และคุณสะกดทั้ง mx1 และ mx2 ถูกต้อง หากมีระเบียน MX อยู่แล้ว โปรดลบออกทั้งหมด
ค่า "TTL" ไม่จำเป็นต้องเป็น 3600 แต่อาจเป็นค่าที่ต่ำกว่าหรือสูงกว่าได้หากจำเป็น
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>ชื่อ/โฮสต์/นามแฝง</th>
<th class="text-center">TTL</th>
<th>ประเภท</th>
<th>ลำดับความสำคัญ</th>
<th>คำตอบ/ค่า</th>
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">ใช้หน้าการจัดการ DNS ของผู้ให้บริการจดทะเบียนของคุณ (แท็บอื่นที่คุณเปิดไว้) ตั้งค่าระเบียน <strong class="notranslate">TXT</strong> ต่อไปนี้:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
หากคุณใช้แพ็กเกจแบบชำระเงิน คุณต้องข้ามขั้นตอนนี้ไปโดยสิ้นเชิงและไปที่ขั้นตอนที่ห้า! หากคุณไม่ได้ใช้แพ็กเกจแบบชำระเงิน ที่อยู่ที่ส่งต่อของคุณจะถูกค้นหาแบบสาธารณะ – ไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> และอัปเกรดโดเมนของคุณเป็นแพ็กเกจแบบชำระเงินหากต้องการ หากคุณต้องการเรียนรู้เพิ่มเติมเกี่ยวกับแพ็กเกจแบบชำระเงิน โปรดดูหน้า <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">ราคา</a> ของเรา หรือคุณสามารถเลือกชุดค่าผสมหนึ่งชุดหรือมากกว่าจากตัวเลือก A ถึงตัวเลือก F ที่ระบุไว้ด้านล่างได้
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
อย่าลืมแทนที่ค่าข้างต้นในคอลัมน์ "ค่า" ด้วยที่อยู่อีเมลของคุณเอง ค่า "TTL" ไม่จำเป็นต้องเป็น 3600 แต่อาจใช้ค่าที่ต่ำกว่าหรือสูงกว่าได้หากจำเป็น ค่า "Time to Live" ("TTL") ที่ต่ำกว่าจะช่วยให้มั่นใจได้ว่าการเปลี่ยนแปลงใดๆ ที่เกิดขึ้นกับระเบียน DNS ของคุณในอนาคตจะถูกเผยแพร่ไปทั่วอินเทอร์เน็ตได้เร็วขึ้น – ลองนึกถึงระยะเวลาที่จะถูกแคชไว้ในหน่วยความจำ (เป็นวินาที) คุณสามารถดูข้อมูลเพิ่มเติมเกี่ยวกับ <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL ได้บน Wikipedia</a>
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ตัวเลือก B:
</strong>
<span>
หากคุณต้องการส่งต่ออีเมลเพียงรายการเดียว (เช่น <code>hello@example.com</code> ไปยัง <code>user@gmail.com</code> การดำเนินการนี้จะส่งต่อ "hello+test@example.com" ไปยัง "user+test@gmail.com" โดยอัตโนมัติด้วย):
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
หากคุณกำลังส่งต่ออีเมลหลายฉบับ คุณจะต้องคั่นอีเมลเหล่านั้นด้วยเครื่องหมายจุลภาค:
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
คุณสามารถตั้งค่าการส่งต่ออีเมลได้ไม่จำกัดจำนวน เพียงแต่ต้องแน่ใจว่าไม่ตัดตัวอักษรเกิน 255 ตัวในบรรทัดเดียว และขึ้นต้นแต่ละบรรทัดด้วย "forward-email=" ดูตัวอย่างด้านล่าง:
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
<td><em>"@", ".", หรือเว้นว่างไว้</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", หรือเว้นว่างไว้</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", หรือเว้นว่างไว้</em></td>
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
คุณยังสามารถระบุชื่อโดเมนในระเบียน <strong class="notranslate">TXT</strong> ของคุณ เพื่อให้มีการส่งต่อนามแฝงสากล (เช่น "user@example.com" จะถูกส่งต่อไปยัง "user@example.net"):
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
คุณยังสามารถใช้เว็บฮุกเป็นนามแฝงทั่วไปหรือนามแฝงเฉพาะเพื่อส่งต่ออีเมลได้อีกด้วย ดูตัวอย่างและส่วนเต็มเกี่ยวกับเว็บฮุกที่ชื่อ <a href="#do-you-support-webhooks" class="alert-link">คุณรองรับเว็บฮุกหรือไม่</a> ด้านล่าง
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
คุณยังสามารถใช้นิพจน์ทั่วไป ("regex") เพื่อจับคู่นามแฝงและจัดการการแทนที่เพื่อส่งต่ออีเมลได้อีกด้วย ดูตัวอย่างและส่วนเต็มเกี่ยวกับ regex ที่ชื่อ <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">คุณรองรับนิพจน์ทั่วไปหรือ regex</a> ด้านล่าง
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>ต้องการ regex ขั้นสูงที่มีการแทนที่หรือไม่</strong> ดูตัวอย่างและส่วนเต็มเกี่ยวกับ regex ที่ชื่อ <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">คุณรองรับ regular expression หรือ regex</a> ด้านล่าง
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>ตัวอย่างง่ายๆ:</strong> หากฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `linus@example.com` หรือ `torvalds@example.com` ส่งต่อไปยัง `user@gmail.com`:
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
กฎการส่งต่อแบบ Catch-all อาจเรียกว่า "fall-through" ได้เช่นกัน
ซึ่งหมายความว่าอีเมลขาเข้าที่ตรงกับกฎการส่งต่ออย่างน้อยหนึ่งข้อจะถูกนำมาใช้แทนการใช้ catch-all
กฎเฉพาะประกอบด้วยที่อยู่อีเมลและนิพจน์ทั่วไป
<br /><br />
ตัวอย่างเช่น:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
อีเมลที่ส่งไปยัง <code>hello@example.com</code> จะ **ไม่** ถูกส่งต่อไปยัง <code>second@gmail.com</code> (catch-all) ด้วยการกำหนดค่านี้ และจะถูกส่งไปยัง <code>first@gmail.com</code> เท่านั้น
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">ใช้หน้าการจัดการ DNS ของผู้ให้บริการจดทะเบียนของคุณ (แท็บอื่นที่คุณเปิดไว้) ตั้งค่าระเบียน <strong class="notranslate">TXT</strong> ต่อไปนี้เพิ่มเติม:

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
หากคุณใช้ Gmail (เช่น Send Mail As) หรือ G Suite คุณจะต้องเพิ่ม <code>include:_spf.google.com</code> ต่อท้ายค่าด้านบน เช่น:
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
หากคุณมีบรรทัดที่คล้ายกันที่มี "v=spf1" อยู่แล้ว คุณจะต้องเพิ่ม <code>include:spf.forwardemail.net</code> ไว้ข้างหน้าระเบียน "include:host.com" ที่มีอยู่ และข้างหน้า "-all" ในบรรทัดเดียวกัน ตัวอย่างเช่น:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
โปรดทราบว่ามีความแตกต่างระหว่าง "-all" และ "~all" เครื่องหมาย "-" บ่งชี้ว่าการตรวจสอบ SPF ควรล้มเหลวหากไม่ตรงกัน และ "~" บ่งชี้ว่าการตรวจสอบ SPF ควรล้มเหลว เราขอแนะนำให้ใช้วิธีการ "-all" เพื่อป้องกันการปลอมแปลงโดเมน
<br /><br />
คุณอาจต้องระบุค่า SPF ของโฮสต์ใดก็ตามที่คุณกำลังส่งอีเมล (เช่น Outlook)
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">ยืนยันบันทึก DNS ของคุณโดยใช้เครื่องมือ "ยืนยันบันทึก" ของเราซึ่งมีอยู่ที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า

</li><li class="mb-2 mb-md-3 mb-lg-5">ส่งอีเมลทดสอบเพื่อยืนยันว่าใช้งานได้ โปรดทราบว่าอาจใช้เวลาสักครู่ก่อนที่ระเบียน DNS ของคุณจะเผยแพร่

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>
</span>
หากคุณไม่ได้รับอีเมลทดสอบ หรือได้รับอีเมลทดสอบที่ระบุว่า "โปรดระมัดระวังข้อความนี้" โปรดดูคำตอบสำหรับ <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">เหตุใดฉันจึงไม่ได้รับอีเมลทดสอบ</a> และ <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">เหตุใดอีเมลทดสอบที่ส่งถึงฉันใน Gmail จึงแสดงสถานะ "น่าสงสัย"</a> ตามลำดับ
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">หากคุณต้องการ "ส่งอีเมลในชื่อ" จาก Gmail คุณจะต้อง<strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">ดูวิดีโอนี้</a></strong> หรือทำตามขั้นตอนภายใต้<a href="#how-to-send-mail-as-using-gmail">How เพื่อส่งอีเมลในชื่อโดยใช้ Gmail</a> ด้านล่าง

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ยินดีด้วย!
</strong>
<span>
คุณทำตามขั้นตอนทั้งหมดเรียบร้อยแล้ว
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>
ส่วนเสริมเพิ่มเติมที่แสดงอยู่ด้านล่างนี้ โปรดทราบว่าส่วนเสริมเหล่านี้เป็นเพียงตัวเลือกเสริมและอาจไม่จำเป็น เราต้องการอย่างน้อยให้ข้อมูลเพิ่มเติมแก่คุณหากจำเป็น
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ส่วนเสริมเพิ่มเติม:
</strong>
<span>
หากคุณกำลังใช้ฟีเจอร์ <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How เพื่อส่งอีเมลในชื่อโดยใช้ Gmail</a> คุณอาจต้องการเพิ่มตัวเองในรายการอนุญาต ดู <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">คำแนะนำเหล่านี้จาก Gmail</a> ในหัวข้อนี้
</span>
</div>

### ฉันสามารถใช้การแลกเปลี่ยน MX และเซิร์ฟเวอร์หลายรายการสำหรับการส่งต่อขั้นสูงได้หรือไม่ {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

ใช่ แต่ **คุณควรมี MX exchange เพียงรายการเดียวในบันทึก DNS ของคุณ**

อย่าพยายามใช้ "ลำดับความสำคัญ" เป็นวิธีการกำหนดค่าการแลกเปลี่ยน MX หลายรายการ

แทนที่จะทำเช่นนั้น คุณจะต้องกำหนดค่าการแลกเปลี่ยน MX ที่มีอยู่ของคุณเพื่อส่งต่ออีเมลสำหรับนามแฝงที่ไม่ตรงกันทั้งหมดไปยังการแลกเปลี่ยนของบริการของเรา (`mx1.forwardemail.net` และ/หรือ `mx2.forwardemail.net`)

หากคุณกำลังใช้ Google Workspace และต้องการส่งต่อนามแฝงที่ไม่ตรงกันทั้งหมดไปยังบริการของเรา โปรดดู <https://support.google.com/a/answer/6297084>.

หากคุณกำลังใช้ Microsoft 365 (Outlook) และคุณต้องการส่งต่อนามแฝงที่ไม่ตรงกันทั้งหมดไปยังบริการของเรา โปรดดู <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> และ <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### ฉันจะตั้งค่าการตอบกลับอัตโนมัติเมื่อไม่อยู่ที่สำนักงานได้อย่างไร {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง และสร้างหรือแก้ไขนามแฝงที่คุณต้องการกำหนดค่าตัวตอบกลับอัตโนมัติวันหยุด

คุณสามารถกำหนดวันที่เริ่มต้น วันที่สิ้นสุด หัวเรื่อง และข้อความ และเปิดใช้งานหรือปิดใช้งานได้ตลอดเวลา:

* ขณะนี้รองรับหัวเรื่องและข้อความแบบข้อความธรรมดา (เราใช้แพ็กเกจ `striptags` ภายในเพื่อลบ HTML)
* หัวเรื่องจำกัดความยาวไม่เกิน 100 ตัวอักษร
* ข้อความจำกัดความยาวไม่เกิน 1,000 ตัวอักษร
* การตั้งค่าจำเป็นต้องมีการกำหนดค่า SMTP ขาออก (เช่น คุณต้องตั้งค่าระเบียน DKIM, DMARC และ Return-Path DNS)
* ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> การกำหนดค่า SMTP ขาออก และทำตามคำแนะนำในการตั้งค่า
* ไม่สามารถเปิดใช้งาน Vacation Responder บนชื่อโดเมนแบบ Vanity ทั่วโลกได้ (เช่น ไม่รองรับ [ที่อยู่แบบใช้แล้วทิ้ง](/disposable-addresses))
* ไม่สามารถเปิดใช้งานผู้ตอบกลับช่วงวันหยุดสำหรับนามแฝงที่มีไวด์การ์ด/แคชทั้งหมด (`*`) หรือนิพจน์ทั่วไปได้

ไม่เหมือนกับระบบเมลเช่น `postfix` (เช่น ที่ใช้ส่วนขยายตัวกรองวันหยุด `sieve`) – การส่งต่ออีเมลจะเพิ่มลายเซ็น DKIM ของคุณโดยอัตโนมัติ ป้องกันปัญหาการเชื่อมต่อหลอกเมื่อส่งการตอบกลับวันหยุด (เช่น เนื่องจากปัญหาการเชื่อมต่อ SSL/TLS ทั่วไปและเซิร์ฟเวอร์ที่บำรุงรักษาแบบเดิม) และยังรองรับการเข้ารหัส Open WKD และ PGP สำหรับการตอบกลับวันหยุดอีกด้วย

<!--
* เพื่อป้องกันการละเมิด จะมีการหักเครดิต SMTP ขาออก 1 เครดิตสำหรับข้อความตอบกลับอัตโนมัติแต่ละข้อความที่ส่ง
* บัญชีแบบชำระเงินทั้งหมดมีเครดิต 300 เครดิตต่อวันตามค่าเริ่มต้น หากคุณต้องการเครดิตมากกว่านี้ โปรดติดต่อเรา
-->

1. เราจะส่งข้อความเพียงครั้งเดียวต่อผู้ส่ง [อยู่ในรายชื่อที่อนุญาต](#do-you-have-an-allowlist) ทุก ๆ 4 วัน (ซึ่งคล้ายกับพฤติกรรมของ Gmail)

* แคช Redis ของเราใช้ลายนิ้วมือ `alias_id` และ `sender` ในขณะที่ `alias_id` คือชื่อแทนของ MongoDB ID และ `sender` คือที่อยู่ From (หากอยู่ในรายการที่อนุญาต) หรือโดเมนรูทในที่อยู่ From (หากไม่ได้อยู่ในรายการที่อนุญาต) เพื่อความง่าย อายุการใช้งานของลายนิ้วมือในแคชจึงถูกตั้งค่าเป็น 4 วัน

* แนวทางของเราในการใช้โดเมนรากที่แยกวิเคราะห์ในที่อยู่ผู้ส่งที่ไม่ได้อยู่ในรายการอนุญาต ช่วยป้องกันการละเมิดจากผู้ส่งที่ไม่ค่อยเป็นที่รู้จัก (เช่น ผู้กระทำที่เป็นอันตราย) จากการส่งข้อความตอบกลับช่วงวันหยุดจำนวนมาก

2. เราจะส่งเฉพาะเมื่อ MAIL FROM และ/หรือ From ไม่ว่างเปล่า และไม่มี [ชื่อผู้ใช้ postmaster](#what-are-postmaster-addresses) (ส่วนที่อยู่ก่อน @ ในอีเมล) (ไม่คำนึงถึงตัวพิมพ์เล็กหรือใหญ่)

3. เราจะไม่ส่งหากข้อความต้นฉบับมีส่วนหัวใด ๆ ต่อไปนี้ (ไม่คำนึงถึงตัวพิมพ์เล็กหรือใหญ่):

* ส่วนหัวของ `auto-submitted` มีค่าไม่เท่ากับ `no`
* ส่วนหัวของ `x-auto-response-suppress` มีค่าเป็น `dr`, `autoreply`, `auto-reply`, `auto_reply` หรือ `all`
* ส่วนหัวของ `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 หรือ `no`7 (โดยไม่คำนึงถึงค่า)
* ส่วนหัวของ `no`8 มีค่าเป็น `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 หรือ `x-auto-response-suppress`3

4. เราจะไม่ส่งหากที่อยู่อีเมล MAIL FROM หรือ From ลงท้ายด้วย `+donotreply`, `-donotreply`, `+noreply` หรือ `-noreply`

5. เราจะไม่ส่งข้อมูลหากส่วนชื่อผู้ใช้ที่อยู่อีเมลจากเป็น `mdaemon` และมีส่วนหัวที่ไม่คำนึงถึงตัวพิมพ์เล็กและใหญ่เป็น `X-MDDSN-Message`

6. เราจะไม่ส่งหากมีส่วนหัว `content-type` ที่ไม่คำนึงถึงตัวพิมพ์เล็กและใหญ่ของ `multipart/report`

### ฉันจะตั้งค่า SPF สำหรับการส่งต่ออีเมล {#how-do-i-set-up-spf-for-forward-email} ได้อย่างไร

ใช้หน้าการจัดการ DNS ของผู้ให้บริการจดทะเบียนของคุณ ตั้งค่าระเบียน <strong class="notranslate">TXT</strong> ต่อไปนี้:

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
หากคุณใช้ Gmail (เช่น Send Mail As) หรือ G Suite คุณจะต้องเพิ่ม <code>include:_spf.google.com</code> ต่อท้ายค่าด้านบน เช่น:
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
หากคุณใช้ Microsoft Outlook หรือ Live.com คุณจะต้องเพิ่ม <code>include:spf.protection.outlook.com</code> ลงในระเบียน SPF <strong class="notranslate">TXT</strong> ของคุณ ตัวอย่างเช่น:
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
หากคุณมีบรรทัดที่คล้ายกันที่มี "v=spf1" อยู่แล้ว คุณจะต้องเพิ่ม <code>include:spf.forwardemail.net</code> ไว้ข้างหน้าระเบียน "include:host.com" ที่มีอยู่ และข้างหน้า "-all" ในบรรทัดเดียวกัน ตัวอย่างเช่น:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
โปรดทราบว่ามีความแตกต่างระหว่าง "-all" และ "~all" เครื่องหมาย "-" บ่งชี้ว่าการตรวจสอบ SPF ควรล้มเหลวหากไม่ตรงกัน และ "~" บ่งชี้ว่าการตรวจสอบ SPF ควรล้มเหลว เราขอแนะนำให้ใช้วิธีการ "-all" เพื่อป้องกันการปลอมแปลงโดเมน
<br /><br />
คุณอาจต้องระบุค่า SPF ของโฮสต์ใดก็ตามที่คุณกำลังส่งอีเมล (เช่น Outlook)
</span>
</div>

### ฉันจะตั้งค่า DKIM สำหรับการส่งต่ออีเมล {#how-do-i-set-up-dkim-for-forward-email} ได้อย่างไร

ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> การกำหนดค่า SMTP ขาออก และปฏิบัติตามคำแนะนำในการตั้งค่า

### ฉันจะตั้งค่า DMARC สำหรับการส่งต่ออีเมล {#how-do-i-set-up-dmarc-for-forward-email} ได้อย่างไร

ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> การกำหนดค่า SMTP ขาออก และปฏิบัติตามคำแนะนำในการตั้งค่า

### ฉันจะเชื่อมต่อและกำหนดค่าผู้ติดต่อของฉัน {#how-do-i-connect-and-configure-my-contacts} ได้อย่างไร

**ในการกำหนดค่าผู้ติดต่อของคุณ ให้ใช้ URL ของ CardDAV ของ:** `https://carddav.forwardemail.net` (หรือเพียงแค่ `carddav.forwardemail.net` หากไคลเอนต์ของคุณอนุญาต)

### ฉันจะเชื่อมต่อและกำหนดค่าปฏิทินของฉันได้อย่างไร {#how-do-i-connect-and-configure-my-calendars}

**ในการกำหนดค่าปฏิทินของคุณ ให้ใช้ URL CalDAV ของ:** `https://caldav.forwardemail.net` (หรือเพียงแค่ `caldav.forwardemail.net` หากไคลเอนต์ของคุณอนุญาต)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="ตัวอย่างการตั้งค่าการส่งต่ออีเมลปฏิทิน CalDAV Thunderbird" />

### ฉันจะเพิ่มปฏิทินเพิ่มเติมและจัดการปฏิทินที่มีอยู่ได้อย่างไร {#how-do-i-add-more-calendars-and-manage-existing-calendars}

หากคุณต้องการเพิ่มปฏิทินเพิ่มเติม เพียงเพิ่ม URL ปฏิทินใหม่เป็น: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**อย่าลืมแทนที่ `calendar-name` ด้วยชื่อปฏิทินที่คุณต้องการ**)

คุณสามารถเปลี่ยนชื่อและสีของปฏิทินหลังจากสร้างแล้วได้ เพียงใช้แอปพลิเคชันปฏิทินที่คุณต้องการ (เช่น Apple Mail หรือ [ธันเดอร์เบิร์ด](https://thunderbird.net))

### ฉันจะตั้งค่า SRS สำหรับการส่งต่ออีเมล {#how-do-i-set-up-srs-for-forward-email} ได้อย่างไร

เราตั้งค่า [แผนการเขียนใหม่ของผู้ส่ง](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") โดยอัตโนมัติ – คุณไม่จำเป็นต้องทำด้วยตนเอง

### ฉันจะตั้งค่า MTA-STS สำหรับการส่งต่ออีเมล {#how-do-i-set-up-mta-sts-for-forward-email} ได้อย่างไร

โปรดดู [ส่วนของเราเกี่ยวกับ MTA-STS](#do-you-support-mta-sts) เพื่อดูข้อมูลเชิงลึกเพิ่มเติม

### ฉันจะเพิ่มรูปโปรไฟล์ลงในที่อยู่อีเมลของฉันได้อย่างไร {#how-do-i-add-a-profile-picture-to-my-email-address}

หากคุณใช้ Gmail ให้ทำตามขั้นตอนด้านล่างนี้:

1. ไปที่ <https://google.com> และออกจากระบบบัญชีอีเมลทั้งหมด
2. คลิก "ลงชื่อเข้าใช้" แล้วคลิก "บัญชีอื่น" ในเมนูแบบเลื่อนลง
3. เลือก "ใช้บัญชีอื่น"
4. เลือก "สร้างบัญชี"
5. เลือก "ใช้ที่อยู่อีเมลปัจจุบันของฉันแทน"
6. ป้อนที่อยู่อีเมลชื่อโดเมนที่คุณกำหนดเอง
7. เรียกดูอีเมลยืนยันที่ส่งไปยังที่อยู่อีเมลของคุณ
8. ป้อนรหัสยืนยันจากอีเมลนี้
9. กรอกข้อมูลโปรไฟล์สำหรับบัญชี Google ใหม่ของคุณ
10. ยอมรับนโยบายความเป็นส่วนตัวและข้อกำหนดการใช้งานทั้งหมด
11. ไปที่ <https://google.com> แล้วคลิกไอคอนโปรไฟล์ของคุณที่มุมขวาบน แล้วคลิกปุ่ม "เปลี่ยน"
12. อัปโหลดรูปภาพหรืออวาตาร์ใหม่สำหรับบัญชีของคุณ
13. การเปลี่ยนแปลงจะใช้เวลาประมาณ 1-2 ชั่วโมงในการเผยแพร่ แต่บางครั้งอาจรวดเร็วมาก
14. ส่งอีเมลทดสอบ และรูปภาพโปรไฟล์จะปรากฏขึ้น

## คุณสมบัติขั้นสูง {#advanced-features}

### คุณสนับสนุนจดหมายข่าวหรือรายการส่งไปรษณีย์สำหรับอีเมลที่เกี่ยวข้องกับการตลาดหรือไม่ {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

ใช่ คุณสามารถอ่านเพิ่มเติมได้ที่ <https://forwardemail.net/guides/newsletter-with-listmonk>.

โปรดทราบว่าเพื่อรักษาชื่อเสียงของ IP และรับประกันความสามารถในการส่ง Forward Email จึงมีกระบวนการตรวจสอบด้วยตนเองในแต่ละโดเมนสำหรับ **การอนุมัติจดหมายข่าว** ส่งอีเมลไปที่ <support@forwardemail.net> หรือเปิด [คำขอความช่วยเหลือ](https://forwardemail.net/help) เพื่อขออนุมัติ โดยทั่วไปจะใช้เวลาไม่เกิน 24 ชั่วโมง โดยคำขอส่วนใหญ่จะได้รับการดำเนินการภายใน 1-2 ชั่วโมง ในอนาคตอันใกล้นี้ เรามุ่งมั่นที่จะทำให้กระบวนการนี้รวดเร็วขึ้นด้วยการควบคุมสแปมและการแจ้งเตือนเพิ่มเติม กระบวนการนี้ช่วยให้มั่นใจได้ว่าอีเมลของคุณจะไปถึงกล่องจดหมาย และข้อความของคุณจะไม่ถูกทำเครื่องหมายว่าเป็นสแปม

### คุณรองรับการส่งอีเมลด้วย API {#do-you-support-sending-email-with-api} หรือไม่

ใช่ ตั้งแต่เดือนพฤษภาคม 2023 เป็นต้นไป เรารองรับการส่งอีเมลโดยใช้ API เป็นส่วนเสริมสำหรับผู้ใช้ที่ชำระเงินทุกคน

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
โปรดตรวจสอบให้แน่ใจว่าคุณได้อ่าน<a href="/terms" class="alert-link" target="_blank">ข้อกำหนด</a>, <a href="/privacy" class="alert-link" target="_blank">นโยบายความเป็นส่วนตัว</a> และ<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">ข้อจำกัด SMTP ขาออก</a> ของเราแล้ว การใช้งานของคุณถือเป็นการยอมรับและตกลง
</span>
</div>

โปรดดูส่วน [อีเมล์](/email-api#outbound-emails) ในเอกสาร API ของเราสำหรับตัวเลือก ตัวอย่าง และข้อมูลเชิงลึกเพิ่มเติม

เพื่อส่งอีเมลขาออกด้วย API ของเรา คุณต้องใช้โทเค็น API ที่มีอยู่ภายใต้ [ความปลอดภัยของฉัน](/my-account/security)

### คุณรองรับการรับอีเมลด้วย IMAP {#do-you-support-receiving-email-with-imap} หรือไม่

ใช่ ตั้งแต่วันที่ 16 ตุลาคม 2023 เป็นต้นไป เรารองรับการรับอีเมลผ่าน IMAP เป็นส่วนเสริมสำหรับผู้ใช้ที่ชำระเงินทุกคน **โปรดอ่านบทความเจาะลึกของเรา** เกี่ยวกับ [คุณลักษณะการจัดเก็บกล่องจดหมาย SQLite ที่เข้ารหัสของเราทำงานอย่างไร](/blog/docs/best-quantum-safe-encrypted-email-service)

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
โปรดตรวจสอบให้แน่ใจว่าคุณได้อ่าน<a href="/terms" class="alert-link" target="_blank">ข้อกำหนด</a>และ<a href="/privacy" class="alert-link" target="_blank">นโยบายความเป็นส่วนตัว</a>ของเราแล้ว การใช้งานของคุณถือเป็นการยอมรับและตกลง
</span>
</div>

1. สร้างนามแฝงใหม่สำหรับโดเมนของคุณภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code><hello@example.com></code>)

2. คลิกที่ <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ถัดจากนามแฝงที่สร้างขึ้นใหม่ คัดลอกไปยังคลิปบอร์ดของคุณและเก็บรหัสผ่านที่สร้างขึ้นที่แสดงบนหน้าจอไว้อย่างปลอดภัย

3. ใช้แอปพลิเคชันอีเมลที่คุณต้องการ เพิ่มหรือกำหนดค่าบัญชีด้วยนามแฝงที่คุณสร้างขึ้นใหม่ (เช่น <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>เราขอแนะนำให้ใช้ <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple เมล</a> หรือ <a href="/blog/open-source" class="alert-link" target="_blank">ทางเลือกแบบโอเพนซอร์สที่เน้นความเป็นส่วนตัว</a></span>
</div>

4. เมื่อได้รับแจ้งให้ป้อนชื่อเซิร์ฟเวอร์ IMAP ให้ป้อน `imap.forwardemail.net`

5. เมื่อระบบถามหาพอร์ตเซิร์ฟเวอร์ IMAP ให้ป้อน `993` (SSL/TLS) – ดู [พอร์ต IMAP สำรอง](/faq#what-are-your-imap-server-configuration-settings) หากจำเป็น
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>หากคุณใช้ Thunderbird โปรดตรวจสอบให้แน่ใจว่าได้ตั้งค่า "Connection security" เป็น "SSL/TLS" และวิธีการตรวจสอบสิทธิ์ (Authentication method) เป็น "Normal password"</span>
</div>

6. เมื่อได้รับแจ้งให้ป้อนรหัสผ่านเซิร์ฟเวอร์ IMAP ให้วางรหัสผ่านจาก <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ในขั้นตอนที่ 2 ด้านบน

7. **บันทึกการตั้งค่าของคุณ** – หากคุณประสบปัญหา โปรด<a href="/help">ติดต่อเรา</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ยินดีด้วย!
</strong>
<span>
คุณทำตามขั้นตอนทั้งหมดเรียบร้อยแล้ว
</span>
</div>
</div>

</div>

### คุณรองรับ POP3 {#do-you-support-pop3} หรือไม่

ใช่ ตั้งแต่วันที่ 4 ธันวาคม 2023 เป็นต้นไป เรารองรับ [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) เป็นส่วนเสริมสำหรับผู้ใช้ที่ชำระเงินทุกคน **โปรดอ่านบทความเจาะลึกของเรา** เกี่ยวกับ [คุณลักษณะการจัดเก็บกล่องจดหมาย SQLite ที่เข้ารหัสของเราทำงานอย่างไร](/blog/docs/best-quantum-safe-encrypted-email-service)

<div id="pop3-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
โปรดตรวจสอบให้แน่ใจว่าคุณได้อ่าน<a href="/terms" class="alert-link" target="_blank">ข้อกำหนด</a>และ<a href="/privacy" class="alert-link" target="_blank">นโยบายความเป็นส่วนตัว</a>ของเราแล้ว การใช้งานของคุณถือเป็นการยอมรับและตกลง
</span>
</div>

1. สร้างนามแฝงใหม่สำหรับโดเมนของคุณภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code><hello@example.com></code>)

2. คลิกที่ <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ถัดจากนามแฝงที่สร้างขึ้นใหม่ คัดลอกไปยังคลิปบอร์ดของคุณและเก็บรหัสผ่านที่สร้างขึ้นที่แสดงบนหน้าจอไว้อย่างปลอดภัย

3. ใช้แอปพลิเคชันอีเมลที่คุณต้องการ เพิ่มหรือกำหนดค่าบัญชีด้วยนามแฝงที่คุณสร้างขึ้นใหม่ (เช่น <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>เราขอแนะนำให้ใช้ <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple เมล</a> หรือ <a href="/blog/open-source" class="alert-link" target="_blank">ทางเลือกแบบโอเพนซอร์สที่เน้นความเป็นส่วนตัว</a></span>
</div>

4. เมื่อได้รับแจ้งให้ระบุชื่อเซิร์ฟเวอร์ POP3 ให้ป้อน `pop3.forwardemail.net`

5. เมื่อได้รับแจ้งให้ระบุพอร์ตเซิร์ฟเวอร์ POP3 ให้ป้อน `995` (SSL/TLS) – ดู [พอร์ต POP3 สำรอง](/faq#what-are-your-pop3-server-configuration-settings) หากจำเป็น
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>หากคุณใช้ Thunderbird โปรดตรวจสอบให้แน่ใจว่าได้ตั้งค่า "Connection security" เป็น "SSL/TLS" และวิธีการตรวจสอบสิทธิ์ (Authentication method) เป็น "Normal password"</span>
</div>

6. เมื่อได้รับแจ้งให้ป้อนรหัสผ่านเซิร์ฟเวอร์ POP3 ให้วางรหัสผ่านจาก <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ในขั้นตอนที่ 2 ด้านบน

7. **บันทึกการตั้งค่าของคุณ** – หากคุณประสบปัญหา โปรด<a href="/help">ติดต่อเรา</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ยินดีด้วย!
</strong>
<span>
คุณทำตามขั้นตอนทั้งหมดเรียบร้อยแล้ว
</span>
</div>
</div>

</div>

### คุณรองรับปฏิทิน (CalDAV) หรือไม่ {#do-you-support-calendars-caldav}

ใช่ เราได้เพิ่มฟีเจอร์นี้ตั้งแต่วันที่ 5 กุมภาพันธ์ 2024 เป็นต้นไป เซิร์ฟเวอร์ของเราคือ `caldav.forwardemail.net` และยังมีการตรวจสอบสถานะใน <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">หน้าสถานะ</a> ของเราด้วย

รองรับทั้ง IPv4 และ IPv6 และสามารถใช้งานได้ผ่านพอร์ต `443` (HTTPS)

| เข้าสู่ระบบ | ตัวอย่าง | คำอธิบาย |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ชื่อผู้ใช้ | `user@example.com` | ที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> |
| รหัสผ่าน | `************************` | รหัสผ่านที่สร้างขึ้นเฉพาะนามแฝง |

เพื่อที่จะใช้การรองรับปฏิทิน **ผู้ใช้** จะต้องเป็นที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> และ **รหัสผ่าน** จะต้องเป็นรหัสผ่านที่สร้างขึ้นเฉพาะนามแฝง

### คุณรองรับการติดต่อ (CardDAV) {#do-you-support-contacts-carddav} หรือไม่

ใช่ เราได้เพิ่มฟีเจอร์นี้ตั้งแต่วันที่ 12 มิถุนายน 2025 เป็นต้นไป เซิร์ฟเวอร์ของเราคือ `carddav.forwardemail.net` และยังมีการตรวจสอบสถานะใน <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">หน้าสถานะ</a> ของเราด้วย

รองรับทั้ง IPv4 และ IPv6 และสามารถใช้งานได้ผ่านพอร์ต `443` (HTTPS)

| เข้าสู่ระบบ | ตัวอย่าง | คำอธิบาย |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ชื่อผู้ใช้ | `user@example.com` | ที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> |
| รหัสผ่าน | `************************` | รหัสผ่านที่สร้างขึ้นเฉพาะนามแฝง |

เพื่อที่จะใช้การสนับสนุนการติดต่อ **ผู้ใช้** จะต้องเป็นที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> และ **รหัสผ่าน** จะต้องเป็นรหัสผ่านที่สร้างขึ้นเฉพาะนามแฝง

### คุณรองรับการส่งอีเมลด้วย SMTP {#do-you-support-sending-email-with-smtp} หรือไม่

ใช่ ตั้งแต่เดือนพฤษภาคม 2023 เป็นต้นไป เรารองรับการส่งอีเมลด้วย SMTP เป็นส่วนเสริมสำหรับผู้ใช้ที่ชำระเงินทุกคน

<div id="smtp-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
โปรดตรวจสอบให้แน่ใจว่าคุณได้อ่าน<a href="/terms" class="alert-link" target="_blank">ข้อกำหนด</a>, <a href="/privacy" class="alert-link" target="_blank">นโยบายความเป็นส่วนตัว</a> และ<a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">ข้อจำกัด SMTP ขาออก</a> ของเราแล้ว การใช้งานของคุณถือเป็นการยอมรับและตกลง
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
หากคุณใช้ Gmail โปรดดู<a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">คู่มือส่งอีเมลในนามด้วย Gmail</a> ของเรา หากคุณเป็นนักพัฒนา โปรดดู<a class="alert-link" href="/email-api#outbound-emails" target="_blank">เอกสาร API อีเมล</a> ของเรา
</span>
</div>

1. ไปที่ <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> การตั้งค่า <i class="fa fa-angle-right"></i> การกำหนดค่า SMTP ขาออก และปฏิบัติตามคำแนะนำในการตั้งค่า

2. สร้างนามแฝงใหม่สำหรับโดเมนของคุณภายใต้ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code><hello@example.com></code>)

3. คลิกที่ <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ถัดจากนามแฝงที่สร้างขึ้นใหม่ คัดลอกไปยังคลิปบอร์ดของคุณและเก็บรหัสผ่านที่สร้างขึ้นที่แสดงบนหน้าจอไว้อย่างปลอดภัย

4. ใช้แอปพลิเคชันอีเมลที่คุณต้องการ เพิ่มหรือกำหนดค่าบัญชีด้วยนามแฝงที่คุณสร้างขึ้นใหม่ (เช่น <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>เราขอแนะนำให้ใช้ <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple เมล</a> หรือ <a href="/blog/open-source" class="alert-link" target="_blank">ทางเลือกแบบโอเพนซอร์สที่เน้นความเป็นส่วนตัว</a></span>
</div>

5. เมื่อได้รับแจ้งให้ระบุชื่อเซิร์ฟเวอร์ SMTP ให้ป้อน `smtp.forwardemail.net`

6. เมื่อระบบถามหาพอร์ตเซิร์ฟเวอร์ SMTP ให้ป้อน `465` (SSL/TLS) – ดู [พอร์ต SMTP สำรอง](/faq#what-are-your-smtp-server-configuration-settings) หากจำเป็น
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>หากคุณใช้ Thunderbird โปรดตรวจสอบให้แน่ใจว่าได้ตั้งค่า "Connection security" เป็น "SSL/TLS" และวิธีการตรวจสอบสิทธิ์ (Authentication method) เป็น "Normal password"</span>
</div>

7. เมื่อได้รับแจ้งให้ป้อนรหัสผ่านเซิร์ฟเวอร์ SMTP ให้วางรหัสผ่านจาก <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> ในขั้นตอนที่ 3 ด้านบน

8. **บันทึกการตั้งค่าของคุณและส่งอีเมลทดสอบครั้งแรกของคุณ** – หากคุณประสบปัญหา โปรด<a href="/help">ติดต่อเรา</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
โปรดทราบว่าเพื่อรักษาชื่อเสียง IP และให้มั่นใจถึงความสามารถในการส่ง เรามีกระบวนการตรวจสอบด้วยตนเองในแต่ละโดเมนสำหรับการอนุมัติ SMTP ขาออก ซึ่งโดยทั่วไปจะใช้เวลาน้อยกว่า 24 ชั่วโมง โดยคำขอส่วนใหญ่จะได้รับการดำเนินการภายใน 1-2 ชั่วโมง ในอนาคตอันใกล้นี้ เรามุ่งมั่นที่จะทำให้กระบวนการนี้เกิดขึ้นได้ทันทีด้วยการควบคุมสแปมและการแจ้งเตือนเพิ่มเติม กระบวนการนี้ช่วยให้มั่นใจได้ว่าอีเมลของคุณจะไปถึงกล่องจดหมาย และข้อความของคุณจะไม่ถูกทำเครื่องหมายว่าเป็นสแปม
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ยินดีด้วย!
</strong>
<span>
คุณทำตามขั้นตอนทั้งหมดเรียบร้อยแล้ว
</span>
</div>
</div>

</div>

### คุณรองรับ OpenPGP/MIME, การเข้ารหัสแบบ end-to-end ("E2EE") และ Web Key Directory ("WKD") หรือไม่ {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

ใช่ เรารองรับ [โอเพ่นพีจีพี](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [การเข้ารหัสแบบ end-to-end ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) และการค้นหาคีย์สาธารณะโดยใช้ [ไดเรกทอรีคีย์เว็บ ("WKD")](https://wiki.gnupg.org/WKD) คุณสามารถกำหนดค่า OpenPGP ได้โดยใช้ [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) หรือ [โฮสต์คีย์ของคุณเอง](https://wiki.gnupg.org/WKDHosting) (ดู [นี่คือ gist สำหรับการตั้งค่าเซิร์ฟเวอร์ WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79))

* การค้นหา WKD จะถูกแคชไว้เป็นเวลา 1 ชั่วโมงเพื่อให้มั่นใจว่าอีเมลจะถูกส่งตรงเวลา → ดังนั้นหากคุณเพิ่ม เปลี่ยนแปลง หรือลบคีย์ WKD โปรดส่งอีเมลถึงเราที่ `support@forwardemail.net` พร้อมระบุที่อยู่อีเมลของคุณ เพื่อให้เราล้างแคชด้วยตนเอง
* เรารองรับการเข้ารหัส PGP สำหรับข้อความที่ส่งต่อผ่านการค้นหา WKD หรือใช้คีย์ PGP ที่อัปโหลดบนอินเทอร์เฟซของเรา
* คีย์ที่อัปโหลดจะมีผลบังคับ ตราบใดที่เปิดใช้งาน/ทำเครื่องหมายในช่อง PGP
* ข้อความที่ส่งไปยังเว็บฮุกยังไม่ได้เข้ารหัสด้วย PGP
* หากคุณมีนามแฝงหลายชื่อที่ตรงกับที่อยู่สำหรับส่งต่อที่กำหนด (เช่น regex/wildcard/exact combo) และหากมีมากกว่าหนึ่งชื่อในนั้นที่มีคีย์ PGP ที่อัปโหลดและมีการเลือก PGP แล้ว → เราจะส่งอีเมลแจ้งเตือนข้อผิดพลาดให้คุณ และจะไม่เข้ารหัสข้อความด้วยคีย์ PGP ที่อัปโหลดของคุณ ปัญหานี้เกิดขึ้นน้อยมาก และมักจะเกิดขึ้นกับผู้ใช้ขั้นสูงที่มีกฎนามแฝงที่ซับซ้อนเท่านั้น
* **การเข้ารหัส PGP จะไม่ถูกนำไปใช้กับการส่งต่ออีเมลผ่านเซิร์ฟเวอร์ MX ของเรา หากผู้ส่งมีนโยบายปฏิเสธ DMARC หากคุณต้องการการเข้ารหัส PGP สำหรับอีเมล *ทั้งหมด* เราขอแนะนำให้ใช้บริการ IMAP ของเราและกำหนดค่าคีย์ PGP สำหรับนามแฝงสำหรับอีเมลขาเข้าของคุณ**

**คุณสามารถตรวจสอบการตั้งค่า Web Key Directory ของคุณได้ที่ <https://wkd.chimbosonic.com/> (โอเพ่นซอร์ส) หรือ <https://www.webkeydirectory.com/> (เป็นกรรมสิทธิ์)**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
การเข้ารหัสอัตโนมัติ:
</strong>
<span>หากคุณกำลังใช้ <a href="#do-you-support-sending-email-with-smtp" class="alert-link">บริการ SMTP ขาออก</a> ของเราและส่งข้อความที่ไม่ได้เข้ารหัส เราจะพยายามเข้ารหัสข้อความโดยอัตโนมัติตามผู้รับแต่ละรายโดยใช้ <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
คุณต้องทำตามขั้นตอนทั้งหมดต่อไปนี้เพื่อเปิดใช้งาน OpenPGP สำหรับชื่อโดเมนที่กำหนดเองของคุณ
</span>
</div>

1. ดาวน์โหลดและติดตั้งปลั๊กอินที่แนะนำของไคลเอนต์อีเมลของคุณด้านล่าง:

| ไคลเอนต์อีเมล | แพลตฟอร์ม | ปลั๊กอินที่แนะนำ | หมายเหตุ |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ธันเดอร์เบิร์ด | เดสก์ท็อป | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird มีการรองรับ OpenPGP ในตัว |
| จีเมล | เบราว์เซอร์ | [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) (ใบอนุญาตกรรมสิทธิ์) | Gmail ไม่รองรับ OpenPGP แต่คุณสามารถดาวน์โหลดปลั๊กอินโอเพนซอร์ส [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้ |
| แอปเปิลเมล | แมคโอเอส | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail ไม่รองรับ OpenPGP แต่คุณสามารถดาวน์โหลดปลั๊กอินโอเพ่นซอร์ส [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) ได้ |
| แอปเปิลเมล | ไอโอเอส | [PGPro](https://github.com/opensourceios/PGPro/) หรือ [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (ใบอนุญาตกรรมสิทธิ์) | Apple Mail ไม่รองรับ OpenPGP แต่คุณสามารถดาวน์โหลดปลั๊กอินโอเพนซอร์ส [PGPro](https://github.com/opensourceios/PGPro/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้ |
| แนวโน้ม | หน้าต่าง | [gpg4win](https://www.gpg4win.de/index.html) | ไคลเอนต์อีเมลเดสก์ท็อปของ Outlook ไม่รองรับ OpenPGP อย่างไรก็ตามคุณสามารถดาวน์โหลดปลั๊กอินโอเพ่นซอร์ส [gpg4win](https://www.gpg4win.de/index.html) ได้ |
| แนวโน้ม | เบราว์เซอร์ | [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) (ใบอนุญาตกรรมสิทธิ์) | ไคลเอนต์อีเมลบนเว็บของ Outlook ไม่รองรับ OpenPGP อย่างไรก็ตามคุณสามารถดาวน์โหลดปลั๊กอินโอเพนซอร์ส [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้ |
| แอนดรอยด์ | มือถือ | [OpenKeychain](https://www.openkeychain.org/) หรือ [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients) เช่น [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) และ [FairEmail](https://github.com/M66B/FairEmail) ทั้งคู่รองรับปลั๊กอินโอเพนซอร์ส [OpenKeychain](https://www.openkeychain.org/) หรือจะใช้ปลั๊กอินโอเพนซอร์ส (แบบมีลิขสิทธิ์) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) ก็ได้ |
| กูเกิล โครม | เบราว์เซอร์ | [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) (ใบอนุญาตกรรมสิทธิ์) | คุณสามารถดาวน์โหลดส่วนขยายเบราว์เซอร์โอเพ่นซอร์ส [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้ |
| มอซิลลา ไฟร์ฟอกซ์ | เบราว์เซอร์ | [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) (ใบอนุญาตกรรมสิทธิ์) | คุณสามารถดาวน์โหลดส่วนขยายเบราว์เซอร์โอเพ่นซอร์ส [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้ |
| ไมโครซอฟต์ เอดจ์ | เบราว์เซอร์ | [Mailvelope](https://mailvelope.com/) | คุณสามารถดาวน์โหลดส่วนขยายเบราว์เซอร์โอเพ่นซอร์ส [Mailvelope](https://mailvelope.com/) ได้ |
| กล้าหาญ | เบราว์เซอร์ | [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) (ใบอนุญาตกรรมสิทธิ์) | คุณสามารถดาวน์โหลดส่วนขยายเบราว์เซอร์โอเพ่นซอร์ส [Mailvelope](https://mailvelope.com/) หรือ [FlowCrypt](https://flowcrypt.com/download) ได้ |
| บัลซา | เดสก์ท็อป | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa มีการรองรับ OpenPGP ในตัว |
| เคเอ็มเมล | เดสก์ท็อป | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail มีการรองรับ OpenPGP ในตัว |
| วิวัฒนาการของ GNOME | เดสก์ท็อป | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution มีการสนับสนุน OpenPGP ในตัว |
| เทอร์มินัล | เดสก์ท็อป | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | คุณสามารถใช้ [gpg command line tool](https://www.gnupg.org/download/) โอเพนซอร์สเพื่อสร้างคีย์ใหม่จากบรรทัดคำสั่งได้ |

2. เปิดปลั๊กอิน สร้างคีย์สาธารณะของคุณ และกำหนดค่าไคลเอนต์อีเมลของคุณเพื่อใช้งานคีย์ดังกล่าว

3. อัปโหลดคีย์สาธารณะของคุณที่ <https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>คุณสามารถไปที่ <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> เพื่อจัดการคีย์ของคุณในอนาคต</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ส่วนเสริมเพิ่มเติม:
</strong>
<span>
หากคุณกำลังใช้บริการ <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">พื้นที่จัดเก็บที่เข้ารหัส (IMAP/POP3)</a> ของเรา และต้องการให้อีเมล<i>ทั้งหมด</i>ที่เก็บไว้ในฐานข้อมูล SQLite (ที่เข้ารหัสแล้ว) ของคุณได้รับการเข้ารหัสด้วยคีย์สาธารณะของคุณ ให้ไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง (เช่น <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> แก้ไข <i class="fa fa-angle-right"></i> OpenPGP และอัปโหลดคีย์สาธารณะของคุณ
</span>
</div>

4. เพิ่มระเบียน `CNAME` ใหม่ลงในชื่อโดเมนของคุณ (เช่น `example.com`):

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
<span>หากนามแฝงของคุณใช้ <a class="alert-link" href="/disposable-addresses" target="_blank">โดเมนแบบ vanity/disposable</a> ของเรา (เช่น <code>hideaddress.net</code>) คุณสามารถข้ามขั้นตอนนี้ได้</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
ยินดีด้วย!
</strong>
<span>
คุณทำตามขั้นตอนทั้งหมดเรียบร้อยแล้ว
</span>
</div>
</div>

### คุณสนับสนุน MTA-STS {#do-you-support-mta-sts} หรือไม่

ใช่ ตั้งแต่วันที่ 2 มีนาคม 2023 เรารองรับ [MTA-STS](https://www.hardenize.com/blog/mta-sts) แล้ว คุณสามารถใช้ [เทมเพลตนี้](https://github.com/jpawlowski/mta-sts.template) ได้หากต้องการเปิดใช้งานบนโดเมนของคุณ

การกำหนดค่าของเราสามารถพบได้สาธารณะบน GitHub ที่ <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### คุณรองรับรหัสผ่านและ WebAuthn {#do-you-support-passkeys-and-webauthn} หรือไม่

ใช่! ตั้งแต่วันที่ 13 ธันวาคม 2023 เราได้เพิ่มการรองรับรหัสผ่าน [เนื่องจากความต้องการที่สูง](https://github.com/orgs/forwardemail/discussions/182) แล้ว

รหัสผ่านช่วยให้คุณเข้าสู่ระบบได้อย่างปลอดภัยโดยไม่ต้องใช้รหัสผ่านและการยืนยันตัวตนแบบสองปัจจัย

คุณสามารถตรวจสอบตัวตนของคุณด้วยการสัมผัส การจดจำใบหน้า รหัสผ่านบนอุปกรณ์ หรือ PIN

เราอนุญาตให้คุณจัดการรหัสผ่านได้สูงสุด 30 รหัสในคราวเดียว เพื่อให้คุณสามารถเข้าสู่ระบบจากอุปกรณ์ทั้งหมดของคุณได้อย่างง่ายดาย

เรียนรู้เพิ่มเติมเกี่ยวกับรหัสผ่านได้ที่ลิงก์ต่อไปนี้:

* [ลงชื่อเข้าใช้แอปพลิเคชันและเว็บไซต์ของคุณด้วยรหัสผ่าน](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [ใช้รหัสผ่านเพื่อลงชื่อเข้าใช้แอปและเว็บไซต์บน iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [บทความวิกิพีเดียเกี่ยวกับ Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### คุณสนับสนุนแนวทางปฏิบัติที่ดีที่สุดสำหรับอีเมลหรือไม่ {#do-you-support-email-best-practices}

ใช่ เรามีระบบรองรับ SPF, DKIM, DMARC, ARC และ SRS ในตัวสำหรับทุกแพ็กเกจ นอกจากนี้ เรายังทำงานร่วมกับผู้เขียนต้นฉบับของข้อกำหนดเหล่านี้และผู้เชี่ยวชาญด้านอีเมลท่านอื่นๆ อย่างกว้างขวาง เพื่อให้มั่นใจถึงความสมบูรณ์แบบและความสามารถในการส่งมอบที่สูง

### คุณรองรับเว็บฮุกแบบเด้งกลับหรือไม่ {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
กำลังมองหาเอกสารเกี่ยวกับเว็บฮุกอีเมลอยู่ใช่ไหม? ดู <a href="/faq#do-you-support-webhooks" class="alert-link">คุณรองรับเว็บฮุกหรือไม่</a> สำหรับข้อมูลเชิงลึกเพิ่มเติม
<span>
</span>
</div>

ใช่ เราได้เพิ่มฟีเจอร์นี้ตั้งแต่วันที่ 14 สิงหาคม 2024 เป็นต้นไป คุณสามารถไปที่บัญชีของฉัน → โดเมน → การตั้งค่า → URL เว็บฮุก Bounce และกำหนดค่า URL `http://` หรือ `https://` ที่เราจะส่งคำขอ `POST` ทุกครั้งที่อีเมล SMTP ขาออกถูกตีกลับ

สิ่งนี้มีประโยชน์สำหรับคุณในการจัดการและตรวจสอบ SMTP ขาออกของคุณ และสามารถใช้ในการรักษาสมาชิก ยกเลิก และตรวจจับเมื่อใดก็ตามที่เกิดการตีกลับ

เพย์โหลดเว็บฮุกของ Bounce จะถูกส่งเป็น JSON พร้อมคุณสมบัติเหล่านี้:

* `email_id` (สตริง) - รหัสอีเมลที่ตรงกับอีเมลในบัญชีของฉัน → อีเมล (SMTP ขาออก)
* `list_id` (สตริง) - ค่าส่วนหัว `List-ID` (ไม่คำนึงถึงตัวพิมพ์เล็ก-ใหญ่) หากมี จากอีเมลขาออกเดิม
* `list_unsubscribe` (สตริง) - ค่าส่วนหัว `List-Unsubscribe` (ไม่คำนึงถึงตัวพิมพ์เล็ก-ใหญ่) หากมี จากอีเมลขาออกเดิม
* `feedback_id` (สตริง) - ค่าส่วนหัว `Feedback-ID` (ไม่คำนึงถึงตัวพิมพ์เล็ก-ใหญ่) หากมี จากอีเมลขาออกเดิม
* `recipient` (สตริง) - ที่อยู่อีเมลของผู้รับที่อีเมลตีกลับหรือเกิดข้อผิดพลาด
* `message` (สตริง) - ข้อความแสดงข้อผิดพลาดโดยละเอียดสำหรับการตีกลับ
* `response` (สตริง) - ข้อความตอบกลับ SMTP
* `list_id`0 (ตัวเลข) - รหัสตอบกลับ SMTP ที่แยกวิเคราะห์แล้ว
* `list_id`1 (สตริง) - หากรหัสตอบกลับมาจากแหล่งที่เชื่อถือได้ ค่านี้จะถูกเติมด้วยชื่อโดเมนราก (เช่น `list_id`2 หรือ `list_id`3)
* `list_id`4 (อ็อบเจ็กต์) - อ็อบเจ็กต์ที่มีคุณสมบัติต่อไปนี้ ซึ่งแสดงรายละเอียดสถานะการตีกลับและการปฏิเสธ
* `list_id`5 (สตริง) - การดำเนินการตีกลับ (เช่น `list_id`6)
* `list_id`7 (สตริง) - เหตุผลของการตีกลับ (เช่น `list_id`8)
* `list_id`9 (สตริง) - หมวดหมู่การตีกลับ (เช่น `List-ID`0)
* `List-ID`1 (ตัวเลข) - รหัสสถานะการตีกลับ (เช่น `List-ID`2)
* `List-ID`3 (สตริง) - รหัสการตีกลับจากข้อความตอบกลับ (เช่น `List-ID`4)
* `List-ID`5 (ตัวเลข) - หมายเลขบรรทัดที่วิเคราะห์แล้ว หากมี `List-ID`6 (เช่น `List-ID`7)
* `List-ID`8 (ออบเจ็กต์) - คู่ค่าคีย์ของส่วนหัวสำหรับอีเมลขาออก
* `List-ID`9 (สตริง) - วันที่จัดรูปแบบ `list_unsubscribe`0 สำหรับ เมื่อเกิดข้อผิดพลาดการตีกลับ

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

ต่อไปนี้เป็นหมายเหตุเพิ่มเติมบางประการเกี่ยวกับเว็บฮุก Bounce:

* หากเพย์โหลดของเว็บฮุกมีค่า `list_id`, `list_unsubscribe` หรือ `feedback_id` คุณควรดำเนินการที่เหมาะสมเพื่อลบ `recipient` ออกจากรายการหากจำเป็น
* หากค่า `bounce.category` เป็น `"block"`, `"recipient"`, `"spam"` หรือ `"virus"` คุณควรลบผู้ใช้รายนั้นออกจากรายการ
* หากคุณต้องการตรวจสอบเพย์โหลดของเว็บฮุก (เพื่อให้แน่ใจว่ามาจากเซิร์ฟเวอร์ของเราจริงๆ) คุณสามารถใช้ [แก้ไขที่อยู่ IP ของไคลเอนต์ระยะไกลโดยใช้การค้นหาแบบย้อนกลับ](https://nodejs.org/api/dns.html#dnspromisesreverseip) ซึ่งควรเป็น `list_unsubscribe`0
* คุณยังสามารถตรวจสอบ IP เทียบกับ `list_unsubscribe`1 ได้อีกด้วย
* ไปที่บัญชีของฉัน → โดเมน → การตั้งค่า → คีย์ยืนยันเพย์โหลดลายเซ็น Webhook เพื่อรับคีย์ Webhook ของคุณ
* คุณสามารถหมุนเวียนคีย์นี้ได้ตลอดเวลาด้วยเหตุผลด้านความปลอดภัย
* คำนวณและเปรียบเทียบค่า `list_unsubscribe`2 จากคำขอ Webhook ของเรากับค่าเนื้อหาที่คำนวณได้โดยใช้คีย์นี้ ตัวอย่างวิธีการดำเนินการสามารถดูได้ที่ `list_unsubscribe`3
* ดูการสนทนาที่ <`list_unsubscribe`4 สำหรับข้อมูลเชิงลึกเพิ่มเติม
* เราจะรอไม่เกิน `list_unsubscribe`5 วินาทีเพื่อให้ปลายทาง Webhook ของคุณตอบกลับด้วยรหัสสถานะ `list_unsubscribe`6 และเราจะลองใหม่อีกครั้งไม่เกิน `list_unsubscribe`7 ครั้ง
* หากเราตรวจพบว่า URL Webhook ของคุณมีการตีกลับและมีข้อผิดพลาดขณะที่เราพยายามส่งคำขอ เราจะส่งอีเมลแจ้งให้คุณทราบสัปดาห์ละครั้ง

### คุณรองรับเว็บฮุก {#do-you-support-webhooks} หรือไม่

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
กำลังมองหาเอกสารเกี่ยวกับเว็บฮุกแบบ Bounce อยู่ใช่ไหม? ดู <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">คุณรองรับเว็บฮุกแบบ Bounce หรือไม่</a> สำหรับข้อมูลเชิงลึกเพิ่มเติม
<span>
</span>
</div>

ใช่แล้ว เราได้เพิ่มฟีเจอร์นี้ตั้งแต่วันที่ 15 พฤษภาคม 2020 เป็นต้นไป คุณสามารถเพิ่มเว็บฮุกได้อย่างง่ายดายเช่นเดียวกับที่คุณทำกับผู้รับทั่วไป! โปรดตรวจสอบให้แน่ใจว่าคุณได้เพิ่มโปรโตคอล "http" หรือ "https" ไว้ใน URL ของเว็บฮุก

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
การปกป้องความเป็นส่วนตัวขั้นสูง:
</strong>
<span>
หากคุณใช้แพ็กเกจแบบชำระเงิน (ซึ่งมีการปกป้องความเป็นส่วนตัวขั้นสูง) โปรดไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> แล้วคลิกที่ "นามแฝง" ถัดจากโดเมนของคุณเพื่อกำหนดค่าเว็บฮุก หากคุณต้องการเรียนรู้เพิ่มเติมเกี่ยวกับแพ็กเกจแบบชำระเงิน โปรดดูหน้า <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">ราคา</a> ของเรา หรือทำตามคำแนะนำด้านล่างต่อไป
</span>
</div>

หากคุณใช้แผนฟรี เพียงเพิ่มระเบียน DNS <strong class="notranslate">TXT</strong> ใหม่ตามที่แสดงด้านล่าง:

ตัวอย่างเช่น ถ้าฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `alias@example.com` ส่งต่อไปยังจุดสิ้นสุดการทดสอบ [ถังขยะ](https://requestbin.com/r/en8pfhdgcculn?inspect) ใหม่:

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

หรือบางทีคุณอาจต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `example.com` ส่งต่อไปยังจุดสิ้นสุดนี้:

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

**หมายเหตุเพิ่มเติมเกี่ยวกับเว็บฮุกมีดังนี้:**

* หากคุณต้องการตรวจสอบเพย์โหลดของเว็บฮุก (เพื่อให้แน่ใจว่ามาจากเซิร์ฟเวอร์ของเราจริง) คุณสามารถใช้ [แก้ไขที่อยู่ IP ของไคลเอนต์ระยะไกลโดยใช้การค้นหาแบบย้อนกลับ](https://nodejs.org/api/dns.html#dnspromisesreverseip) ซึ่งควรเป็น `mx1.forwardemail.net` หรือ `mx2.forwardemail.net`
* คุณยังสามารถตรวจสอบ IP เทียบกับ [ที่อยู่ IP ที่เราเผยแพร่](#what-are-your-servers-ip-addresses) ได้อีกด้วย
* หากคุณใช้แพ็กเกจแบบชำระเงิน ให้ไปที่ บัญชีของฉัน → โดเมน → การตั้งค่า → คีย์ยืนยันเพย์โหลดลายเซ็นเว็บฮุก เพื่อรับคีย์เว็บฮุกของคุณ
* คุณสามารถหมุนเวียนคีย์นี้ได้ตลอดเวลาด้วยเหตุผลด้านความปลอดภัย
* คำนวณและเปรียบเทียบค่า `X-Webhook-Signature` จากคำขอเว็บฮุกของเรากับค่าเนื้อหาที่คำนวณได้โดยใช้คีย์นี้ ตัวอย่างวิธีการดำเนินการนี้มีอยู่ที่ [โพสต์ Stack Overflow นี้](https://stackoverflow.com/a/68885281)
* ดูการสนทนาที่ <https://github.com/forwardemail/free-email-forwarding/issues/235> สำหรับข้อมูลเชิงลึกเพิ่มเติม
* หากเว็บฮุกไม่ตอบสนองด้วยรหัสสถานะ `200` เราจะจัดเก็บการตอบสนองไว้ใน [บันทึกข้อผิดพลาดถูกสร้างขึ้น](#do-you-store-error-logs) ซึ่งเป็นประโยชน์สำหรับการดีบัก
* คำขอ HTTP ของเว็บฮุกจะลองใหม่สูงสุด 3 ครั้งทุกครั้งที่พยายามเชื่อมต่อ SMTP โดยมีระยะเวลาหมดเวลาสูงสุด 60 วินาทีต่อคำขอ POST ปลายทาง **โปรดทราบว่านี่ไม่ได้หมายความว่าจะลองใหม่เพียง 3 ครั้งเท่านั้น** แต่จะส่งรหัส SMTP 421 (ซึ่งระบุให้ผู้ส่งลองใหม่อีกครั้งในภายหลัง) หลังจากความพยายามส่งคำขอ HTTP POST ล้มเหลวครั้งที่ 3 ซึ่งหมายความว่าอีเมลจะลองใหม่อย่างต่อเนื่องเป็นเวลาหลายวันจนกว่าจะได้รหัสสถานะ 200
* เราจะลองใหม่โดยอัตโนมัติตามสถานะเริ่มต้นและรหัสข้อผิดพลาดที่ใช้ใน [วิธีการลองใหม่ของ superagent](https://ladjs.github.io/superagent/#retrying-requests) (เราเป็นผู้ดูแลระบบ)
* เราจัดกลุ่มคำขอ HTTP ของเว็บฮุกที่ส่งไปยังปลายทางเดียวกันไว้ในคำขอเดียว แทนที่จะส่งหลายคำขอ เพื่อประหยัดทรัพยากรและเพิ่มความเร็วในการตอบสนอง ตัวอย่างเช่น หากคุณส่งอีเมลไปที่ <webhook1@example.com>, <webhook2@example.com> และ <webhook3@example.com> และทั้งหมดนี้ได้รับการกำหนดค่าให้เข้าถึง URL ปลายทาง *ที่ตรงกัน* เดียวกัน ระบบจะสร้างคำขอเพียงรายการเดียว เราจัดกลุ่มอีเมลโดยการจับคู่ปลายทางที่ตรงกันด้วยความเท่าเทียมกันอย่างเคร่งครัด
* โปรดทราบว่าเราใช้เมธอด "simpleParser" ของไลบรารี `mx1.forwardemail.net`0 เพื่อแยกวิเคราะห์ข้อความเป็นอ็อบเจ็กต์ที่เป็นมิตรกับ JSON
* ค่าอีเมลดิบเป็นสตริงจะถูกกำหนดเป็นคุณสมบัติ "raw"
* ผลลัพธ์การตรวจสอบสิทธิ์จะถูกกำหนดเป็นคุณสมบัติ "dkim", "spf", "arc", "dmarc" และ "bimi"
* ส่วนหัวอีเมลที่แยกวิเคราะห์แล้วจะถูกกำหนดเป็นคุณสมบัติ "headers" แต่โปรดทราบว่าคุณสามารถใช้ "headerLines" เพื่อให้การวนซ้ำและการแยกวิเคราะห์ง่ายขึ้น
* ผู้รับที่จัดกลุ่มสำหรับเว็บฮุกนี้จะถูกจัดกลุ่มเข้าด้วยกันและกำหนดเป็นคุณสมบัติ "ผู้รับ"
* ข้อมูลเซสชัน SMTP จะถูกกำหนดเป็นคุณสมบัติ "เซสชัน" ซึ่งประกอบด้วยข้อมูลเกี่ยวกับผู้ส่งข้อความ เวลาที่ข้อความมาถึง HELO และชื่อโฮสต์ของไคลเอ็นต์ ค่าชื่อโฮสต์ของไคลเอ็นต์เป็น `mx1.forwardemail.net`1 อาจเป็น FQDN (จากการค้นหา PTR แบบย้อนกลับ) หรือเป็น `mx1.forwardemail.net`2 ที่รวมอยู่ในวงเล็บ (เช่น `mx1.forwardemail.net`3)
* หากคุณต้องการวิธีที่รวดเร็วในการรับค่าของ `mx1.forwardemail.net`4 คุณสามารถใช้ค่าของ `mx1.forwardemail.net`5 (ดูตัวอย่างด้านล่าง) ส่วนหัว `mx1.forwardemail.net`6 คือส่วนหัวที่เราเพิ่มลงในข้อความเพื่อแก้ไขจุดบกพร่องกับผู้รับเดิม (ก่อนการส่งต่อแบบซ่อน) สำหรับข้อความ
* หากคุณต้องการลบคุณสมบัติ `mx1.forwardemail.net`7 และ/หรือ `mx1.forwardemail.net`8 ออกจากเนื้อหาเพย์โหลด เพียงเพิ่ม `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 หรือ `mx2.forwardemail.net`1 ลงในจุดสิ้นสุดของเว็บฮุกของคุณเป็นพารามิเตอร์ querystring (เช่น `mx2.forwardemail.net`2)
* หากมีไฟล์แนบ ไฟล์เหล่านั้นจะถูกเพิ่มเข้ากับอาร์เรย์ `mx2.forwardemail.net`3 พร้อมค่าบัฟเฟอร์ คุณสามารถแยกไฟล์เหล่านั้นกลับเข้าไปในเนื้อหาได้โดยใช้วิธีการของ JavaScript เช่น:

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
เคล็ดลับ:
</strong>
อยากรู้ไหมว่าคำขอ webhook จากอีเมลที่ส่งต่อมีลักษณะอย่างไร? เราได้รวบรวมตัวอย่างไว้ด้านล่างแล้ว!
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

### คุณรองรับนิพจน์ทั่วไปหรือ regex {#do-you-support-regular-expressions-or-regex}

ใช่ เราได้เพิ่มฟีเจอร์นี้ตั้งแต่วันที่ 27 กันยายน 2021 เป็นต้นไป คุณสามารถเขียนนิพจน์ทั่วไป ("regex") เพื่อจับคู่นามแฝงและดำเนินการแทนที่ได้

นามแฝงที่รองรับนิพจน์ทั่วไปคือนามแฝงที่ขึ้นต้นด้วย `/` และลงท้ายด้วย `/` และผู้รับคือที่อยู่อีเมลหรือเว็บฮุก ผู้รับยังสามารถรวมการรองรับการแทนที่นิพจน์ทั่วไป (เช่น `$1`, `$2`) ได้ด้วย

เรารองรับแฟล็กนิพจน์ทั่วไปสองแบบ ได้แก่ `i` และ `g` แฟล็กที่ไม่คำนึงถึงตัวพิมพ์เล็ก-ใหญ่ของ `i` เป็นค่าเริ่มต้นถาวรและจะถูกบังคับใช้อยู่เสมอ คุณสามารถเพิ่มแฟล็กส่วนกลางของ `g` ได้โดยการเติม `/g` ต่อท้าย `/`

โปรดทราบว่าเรายังสนับสนุน <a href="#can-i-disable-specific-aliases">disabled alias feature</a> สำหรับส่วนผู้รับด้วยการสนับสนุน regex ของเราด้วย

นิพจน์ทั่วไปไม่ได้รับการสนับสนุนบน<a href="/disposable-addresses" target="_blank">โดเมน vanity ทั่วโลก</a> (เนื่องจากอาจเป็นช่องโหว่ด้านความปลอดภัย)

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
การปกป้องความเป็นส่วนตัวขั้นสูง:
</strong>
<span>
หากคุณใช้แพ็กเกจแบบชำระเงิน (ซึ่งมีการปกป้องความเป็นส่วนตัวขั้นสูง) โปรดไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> แล้วคลิกที่ "นามแฝง" ถัดจากโดเมนของคุณเพื่อกำหนดค่านิพจน์ทั่วไป หากคุณต้องการเรียนรู้เพิ่มเติมเกี่ยวกับแพ็กเกจแบบชำระเงิน โปรดดูหน้า <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">ราคา</a> ของเรา หรือทำตามคำแนะนำด้านล่างต่อไป
</span>
</div>

หากคุณใช้แผนฟรี ให้เพียงเพิ่มระเบียน DNS <strong class="notranslate">TXT</strong> ใหม่โดยใช้ตัวอย่างหนึ่งรายการหรือมากกว่านั้นด้านล่างนี้:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>ตัวอย่างง่ายๆ:</strong> หากฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `linus@example.com` หรือ `torvalds@example.com` ส่งต่อไปยัง `user@gmail.com`:
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
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>ตัวอย่างการแทนที่ชื่อ นามสกุล:</strong> ลองนึกภาพว่าที่อยู่อีเมลบริษัทของคุณทั้งหมดอยู่ในรูปแบบ `firstname.lastname@example.com` หากฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยังรูปแบบ `firstname.lastname@example.com` ส่งต่อไปยัง `firstname.lastname@company.com` พร้อมรองรับการแทนที่ (<a href="https://regexr.com/66hnu" class="alert-link">ดูการทดสอบบน RegExr</a>):
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
<strong>ตัวอย่างการแทนที่การกรองสัญลักษณ์บวก:</strong> หากฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `info@example.com` หรือ `support@example.com` ส่งต่อไปยัง `user+info@gmail.com` หรือ `user+support@gmail.com` ตามลำดับ (พร้อมรองรับการแทนที่) (<a href="https://regexr.com/66ho7" class="alert-link">ดูการทดสอบบน RegExr</a>):
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
<strong>ตัวอย่างการแทนที่คิวรีสตริงของเว็บฮุก:</strong> บางทีคุณอาจต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `example.com` ไปยัง <a href="#do-you-support-webhooks" class="alert-link">เว็บฮุก</a> และมีคีย์คิวรีสตริงแบบไดนามิก "to" พร้อมค่าของส่วนชื่อผู้ใช้ของที่อยู่อีเมล (<a href="https://regexr.com/66ho4" class="alert-link">ดูการทดสอบบน RegExr</a>):
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
<strong>ตัวอย่างการปฏิเสธแบบเงียบ:</strong> หากคุณต้องการปิดใช้งานอีเมลทั้งหมดที่ตรงกับรูปแบบที่กำหนด และปฏิเสธแบบเงียบ (ผู้ส่งจะเห็นว่าข้อความถูกส่งสำเร็จ แต่จริงๆ แล้วไม่ได้ส่งไปถึงผู้รับ) พร้อมรหัสสถานะ `250` (ดู <a href="#can-i-disable-specific-aliases" class="alert-link">ฉันสามารถปิดใช้งานนามแฝงเฉพาะได้หรือไม่</a>) ให้ใช้วิธีการเดียวกันนี้โดยใส่เครื่องหมายอัศเจรีย์ "!" เพียงตัวเดียว วิธีนี้จะแสดงให้ผู้ส่งทราบว่าข้อความถูกส่งสำเร็จ แต่จริงๆ แล้วไม่ได้ส่งไปถึงผู้รับ (เช่น blackhole หรือ `/dev/null`)
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
<strong>ตัวอย่างการปฏิเสธแบบ Soft:</strong> หากคุณต้องการปิดใช้งานอีเมลทั้งหมดที่ตรงกับรูปแบบที่กำหนด และต้องการปฏิเสธแบบ Soft ด้วยรหัสสถานะ `421` (ดู <a href="#can-i-disable-specific-aliases" class="alert-link">ฉันสามารถปิดใช้งานนามแฝงเฉพาะได้หรือไม่</a>) ให้ใช้วิธีการเดียวกันนี้โดยใส่เครื่องหมายอัศเจรีย์ "!!" สองตัว วิธีนี้จะบอกให้ผู้ส่งลองส่งอีเมลอีกครั้ง และอีเมลที่ส่งไปยังนามแฝงนี้จะถูกลองส่งอีเมลอีกครั้งประมาณ 5 วัน จากนั้นจะถูกปฏิเสธอย่างถาวร
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
<strong>ตัวอย่างการปฏิเสธแบบฮาร์ด:</strong> หากคุณต้องการปิดใช้งานอีเมลทั้งหมดที่ตรงกับรูปแบบที่กำหนด และต้องการปฏิเสธแบบฮาร์ดด้วยรหัสสถานะ `550` (ดู <a href="#can-i-disable-specific-aliases" class="alert-link">ฉันสามารถปิดใช้งานนามแฝงเฉพาะได้หรือไม่</a>) ให้ใช้วิธีการเดียวกันนี้โดยใส่เครื่องหมายอัศเจรีย์สามตัว "!!!" วิธีนี้จะแสดงให้ผู้ส่งทราบว่าเกิดข้อผิดพลาดถาวร และอีเมลจะไม่ถูกส่งซ้ำ อีเมลเหล่านั้นจะถูกปฏิเสธสำหรับนามแฝงนี้
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
อยากรู้วิธีเขียนนิพจน์ทั่วไปหรือต้องการทดสอบการแทนที่ใช่ไหม? คุณสามารถไปที่เว็บไซต์ทดสอบนิพจน์ทั่วไปฟรี <a href="https://regexr.com" class="alert-link">RegExr</a> ได้ที่ <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### ขีดจำกัด SMTP ขาออกของคุณคือเท่าไร {#what-are-your-outbound-smtp-limits}

เราจำกัดจำนวนผู้ใช้และโดเมนไว้ที่ 300 ข้อความ SMTP ขาออกต่อวัน โดยเฉลี่ยแล้วมีอีเมลมากกว่า 9,000 ฉบับต่อเดือน หากคุณต้องการเกินจำนวนนี้หรือมีอีเมลจำนวนมากอย่างต่อเนื่อง โปรด [ติดต่อเรา](https://forwardemail.net/help)

### ฉันต้องได้รับการอนุมัติเพื่อเปิดใช้งาน SMTP {#do-i-need-approval-to-enable-smtp} หรือไม่

ใช่ โปรดทราบว่าเพื่อรักษาชื่อเสียงของ IP และรับประกันความสามารถในการนำส่ง Forward Email มีกระบวนการตรวจสอบด้วยตนเองในแต่ละโดเมนสำหรับการอนุมัติ SMTP ขาออก ส่งอีเมลไปที่ <support@forwardemail.net> หรือเปิด [คำขอความช่วยเหลือ](https://forwardemail.net/help) เพื่อขออนุมัติ โดยทั่วไปจะใช้เวลาไม่เกิน 24 ชั่วโมง โดยคำขอส่วนใหญ่จะได้รับการดำเนินการภายใน 1-2 ชั่วโมง ในอนาคตอันใกล้นี้ เรามุ่งมั่นที่จะทำให้กระบวนการนี้รวดเร็วขึ้นด้วยการควบคุมสแปมและการแจ้งเตือนเพิ่มเติม กระบวนการนี้ช่วยให้มั่นใจได้ว่าอีเมลของคุณจะไปถึงกล่องจดหมาย และข้อความของคุณจะไม่ถูกทำเครื่องหมายว่าเป็นสแปม

### การตั้งค่าการกำหนดค่าเซิร์ฟเวอร์ SMTP ของคุณคืออะไร {#what-are-your-smtp-server-configuration-settings}

เซิร์ฟเวอร์ของเราคือ `smtp.forwardemail.net` และยังได้รับการตรวจสอบจาก<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">หน้าสถานะ</a>ของเราด้วย

รองรับทั้ง IPv4 และ IPv6 และสามารถใช้งานได้ผ่านพอร์ต `465` และ `2465` สำหรับ SSL/TLS และ `587`, `2587`, `2525` และ `25` สำหรับ TLS (STARTTLS)

| โปรโตคอล | ชื่อโฮสต์ | พอร์ต | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **ต้องการ** | `smtp.forwardemail.net` | `465`, `2465` | :เครื่องหมายถูกสีขาว: | :เครื่องหมายถูกสีขาว: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :เครื่องหมายถูกสีขาว: | :เครื่องหมายถูกสีขาว: |

| เข้าสู่ระบบ | ตัวอย่าง | คำอธิบาย |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ชื่อผู้ใช้ | `user@example.com` | ที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> |
| รหัสผ่าน | `************************` | รหัสผ่านที่สร้างขึ้นเฉพาะนามแฝง |

เพื่อส่งอีเมลขาออกด้วย SMTP **ผู้ใช้ SMTP** จะต้องเป็นที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> และ **รหัสผ่าน SMTP** จะต้องเป็นรหัสผ่านที่สร้างขึ้นเฉพาะนามแฝง

โปรดดู [คุณรองรับการส่งอีเมลด้วย SMTP หรือไม่](#do-you-support-sending-email-with-smtp) สำหรับคำแนะนำทีละขั้นตอน

### การตั้งค่าการกำหนดค่าเซิร์ฟเวอร์ IMAP ของคุณคืออะไร {#what-are-your-imap-server-configuration-settings}

เซิร์ฟเวอร์ของเราคือ `imap.forwardemail.net` และยังได้รับการตรวจสอบจาก<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">หน้าสถานะ</a>ของเราด้วย

รองรับทั้ง IPv4 และ IPv6 และสามารถใช้งานได้ผ่านพอร์ต `993` และ `2993` สำหรับ SSL/TLS

| โปรโตคอล | ชื่อโฮสต์ | พอร์ต | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **ต้องการ** | `imap.forwardemail.net` | `993`, `2993` | :เครื่องหมายถูกสีขาว: | :เครื่องหมายถูกสีขาว: |

| เข้าสู่ระบบ | ตัวอย่าง | คำอธิบาย |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ชื่อผู้ใช้ | `user@example.com` | ที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> |
| รหัสผ่าน | `************************` | รหัสผ่านที่สร้างขึ้นเฉพาะนามแฝง |

เพื่อเชื่อมต่อกับ IMAP **ผู้ใช้ IMAP** จะต้องเป็นที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> และ **รหัสผ่าน IMAP** จะต้องเป็นรหัสผ่านที่สร้างขึ้นเฉพาะนามแฝง

โปรดดู [คุณรองรับการรับอีเมลด้วย IMAP หรือไม่](#do-you-support-receiving-email-with-imap) สำหรับคำแนะนำทีละขั้นตอน

### การตั้งค่าการกำหนดค่าเซิร์ฟเวอร์ POP3 ของคุณคืออะไร {#what-are-your-pop3-server-configuration-settings}

เซิร์ฟเวอร์ของเราคือ `pop3.forwardemail.net` และยังได้รับการตรวจสอบจาก<a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">หน้าสถานะ</a>ของเราด้วย

รองรับทั้ง IPv4 และ IPv6 และสามารถใช้งานได้ผ่านพอร์ต `995` และ `2995` สำหรับ SSL/TLS

| โปรโตคอล | ชื่อโฮสต์ | พอร์ต | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **ต้องการ** | `pop3.forwardemail.net` | `995`, `2995` | :เครื่องหมายถูกสีขาว: | :เครื่องหมายถูกสีขาว: |

| เข้าสู่ระบบ | ตัวอย่าง | คำอธิบาย |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ชื่อผู้ใช้ | `user@example.com` | ที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> |
| รหัสผ่าน | `************************` | รหัสผ่านที่สร้างขึ้นเฉพาะนามแฝง |

เพื่อเชื่อมต่อกับ POP3 **ผู้ใช้ POP3** จะต้องเป็นที่อยู่อีเมลของนามแฝงที่มีอยู่สำหรับโดเมนที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> และ **รหัสผ่าน IMAP** จะต้องเป็นรหัสผ่านที่สร้างขึ้นเฉพาะนามแฝง

โปรดดู [คุณรองรับ POP3 หรือไม่](#do-you-support-pop3) สำหรับคำแนะนำทีละขั้นตอน

### การกำหนดค่ารีเลย์ SMTP Postfix {#postfix-smtp-relay-configuration}

คุณสามารถกำหนดค่า Postfix ให้ส่งต่ออีเมลผ่านเซิร์ฟเวอร์ SMTP ของ Forward Email ได้ ซึ่งมีประโยชน์สำหรับแอปพลิเคชันเซิร์ฟเวอร์ที่ต้องส่งอีเมล

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
จำเป็นต้องใช้แพ็กเกจแบบชำระเงินที่เปิดใช้งานการเข้าถึง SMTP
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

2. ในระหว่างการติดตั้ง ให้เลือก "ไซต์อินเทอร์เน็ต" เมื่อได้รับแจ้งเกี่ยวกับประเภทการกำหนดค่า

#### การกำหนดค่า {#configuration}

1. แก้ไขไฟล์กำหนดค่า Postfix หลัก:

```bash
sudo nano /etc/postfix/main.cf
```

2. เพิ่มหรือแก้ไขการตั้งค่าเหล่านี้:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. สร้างไฟล์รหัสผ่าน SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. เพิ่มข้อมูลประจำตัวในการส่งต่ออีเมลของคุณ:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. รักษาความปลอดภัยและแฮชไฟล์รหัสผ่าน:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. รีสตาร์ท Postfix:

```bash
sudo systemctl restart postfix
```

#### กำลังทดสอบ {#testing}

ทดสอบการกำหนดค่าของคุณโดยส่งอีเมลทดสอบ:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## ความปลอดภัย {#security}

### เทคนิคการทำให้เซิร์ฟเวอร์แข็งแกร่งขั้นสูง {#advanced-server-hardening-techniques}

> \[!TIP]
> เรียนรู้เพิ่มเติมเกี่ยวกับโครงสร้างพื้นฐานด้านความปลอดภัยของเราได้ที่ [หน้าความปลอดภัยของเรา](/security)

Forward Email ใช้เทคนิคการเสริมความแข็งแกร่งให้กับเซิร์ฟเวอร์จำนวนมากเพื่อรับรองความปลอดภัยของโครงสร้างพื้นฐานและข้อมูลของคุณ:

1. **ความปลอดภัยเครือข่าย**:
* ไฟร์วอลล์ตาราง IP ที่มีกฎเกณฑ์เข้มงวด
* Fail2ban สำหรับการป้องกันแบบ Brute Force
* การตรวจสอบความปลอดภัยและการทดสอบการเจาะระบบเป็นประจำ
* การเข้าถึงแบบผู้ดูแลระบบเฉพาะ VPN

2. **การเสริมความแข็งแกร่งของระบบ**:
* การติดตั้งแพ็กเกจขั้นต่ำ
* การอัปเดตความปลอดภัยเป็นประจำ
* SELinux ในโหมดบังคับใช้
* ปิดใช้งานการเข้าถึง SSH รูท
* การตรวจสอบสิทธิ์โดยใช้คีย์เท่านั้น

3. **ความปลอดภัยของแอปพลิเคชัน**:
* ส่วนหัวของนโยบายความปลอดภัยของเนื้อหา (CSP)
* ความปลอดภัยในการขนส่งที่เข้มงวดของ HTTPS (HSTS)
* ส่วนหัวของการป้องกัน XSS
* ตัวเลือกเฟรมและส่วนหัวของนโยบายผู้อ้างอิง
* การตรวจสอบการอ้างอิงอย่างสม่ำเสมอ

4. **การปกป้องข้อมูล**:
* การเข้ารหัสดิสก์ทั้งหมดด้วย LUKS
* การจัดการคีย์ที่ปลอดภัย
* การสำรองข้อมูลเป็นประจำด้วยการเข้ารหัส
* แนวทางปฏิบัติในการลดข้อมูลให้เหลือน้อยที่สุด

5. **การตรวจสอบและการตอบสนอง**:
* การตรวจจับการบุกรุกแบบเรียลไทม์
* การสแกนความปลอดภัยอัตโนมัติ
* การบันทึกและวิเคราะห์แบบรวมศูนย์
* ขั้นตอนการตอบสนองต่อเหตุการณ์

> \[!IMPORTANT]
> แนวทางปฏิบัติด้านความปลอดภัยของเราได้รับการอัปเดตอย่างต่อเนื่องเพื่อรับมือกับภัยคุกคามและช่องโหว่ใหม่ๆ

> \[!TIP]
> เพื่อความปลอดภัยสูงสุด เราขอแนะนำให้ใช้บริการของเราที่มีการเข้ารหัสแบบ end-to-end ผ่าน OpenPGP

### คุณมีใบรับรอง SOC 2 หรือ ISO 27001 หรือไม่ {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> การส่งต่ออีเมลดำเนินการบนโครงสร้างพื้นฐานที่จัดทำโดยผู้ประมวลผลย่อยที่ได้รับการรับรอง เพื่อให้มั่นใจว่าเป็นไปตามมาตรฐานอุตสาหกรรม

Forward Email ไม่ได้ถือใบรับรอง SOC 2 Type II หรือ ISO 27001 โดยตรง อย่างไรก็ตาม บริการนี้ดำเนินการบนโครงสร้างพื้นฐานที่จัดทำโดยผู้ให้บริการย่อยที่ได้รับการรับรอง:

* **DigitalOcean**: ได้รับการรับรองมาตรฐาน SOC 2 Type II และ SOC 3 Type II (ตรวจสอบโดย Schellman & Company LLC) และ ISO 27001 ในศูนย์ข้อมูลหลายแห่ง รายละเอียด: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: ได้รับการรับรอง SOC 2+ (HIPAA), การรับรอง ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019 รายละเอียด: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: สอดคล้องกับ SOC 2 (ติดต่อ DataPacket โดยตรงเพื่อขอรับการรับรอง) ผู้ให้บริการโครงสร้างพื้นฐานระดับองค์กร (สาขาเดนเวอร์) รายละเอียด: <https://www.datapacket.com/datacenters/denver>

อีเมลส่งต่อปฏิบัติตามแนวทางปฏิบัติที่ดีที่สุดของอุตสาหกรรมสำหรับการตรวจสอบความปลอดภัย และมีส่วนร่วมกับนักวิจัยด้านความปลอดภัยอิสระเป็นประจำ ที่มา: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### คุณใช้การเข้ารหัส TLS สำหรับการส่งต่ออีเมลหรือไม่ {#do-you-use-tls-encryption-for-email-forwarding}

ใช่ การส่งต่ออีเมลบังคับใช้ TLS 1.2+ อย่างเคร่งครัดสำหรับการเชื่อมต่อทั้งหมด (HTTPS, SMTP, IMAP, POP3) และใช้ MTA-STS เพื่อรองรับ TLS ที่ดีขึ้น การใช้งานประกอบด้วย:

* การบังคับใช้ TLS 1.2+ สำหรับการเชื่อมต่ออีเมลทั้งหมด
* การแลกเปลี่ยนคีย์ ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) เพื่อการรักษาความลับในการส่งต่อที่สมบูรณ์แบบ
* ชุดรหัสที่ทันสมัยพร้อมการอัปเดตความปลอดภัยเป็นประจำ
* รองรับ HTTP/2 เพื่อประสิทธิภาพและความปลอดภัยที่ดีขึ้น
* HSTS (HTTP Strict Transport Security) พร้อมการโหลดล่วงหน้าในเบราว์เซอร์หลักๆ
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** เพื่อการบังคับใช้ TLS อย่างเข้มงวด

ที่มา: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**การใช้งาน MTA-STS**: อีเมลส่งต่อใช้การบังคับใช้ MTA-STS อย่างเข้มงวดในฐานโค้ด เมื่อเกิดข้อผิดพลาด TLS และมีการบังคับใช้ MTA-STS ระบบจะส่งรหัสสถานะ SMTP 421 กลับมาเพื่อให้แน่ใจว่าอีเมลจะถูกลองใหม่ในภายหลัง แทนที่จะส่งแบบไม่ปลอดภัย รายละเอียดการใช้งาน:

* การตรวจจับข้อผิดพลาด TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* การบังคับใช้ MTA-STS ในตัวช่วยส่งอีเมล: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

การตรวจสอบของบุคคลที่สาม: <https://www.hardenize.com/report/forwardemail.net/1750312779> แสดงคะแนน "ดี" สำหรับมาตรการความปลอดภัย TLS และการขนส่งทั้งหมด

### คุณรักษาส่วนหัวการตรวจสอบสิทธิ์อีเมลไว้หรือไม่ {#do-you-preserve-email-authentication-headers}

ใช่ การส่งต่ออีเมลจะดำเนินการและรักษาส่วนหัวการตรวจสอบสิทธิ์อีเมลอย่างครอบคลุม:

* **SPF (Sender Policy Framework)**: ใช้งานและเก็บรักษาอย่างเหมาะสม
* **DKIM (DomainKeys Identified Mail)**: รองรับเต็มรูปแบบพร้อมการจัดการคีย์ที่เหมาะสม
* **DMARC**: บังคับใช้นโยบายสำหรับอีเมลที่ไม่ผ่านการตรวจสอบ SPF หรือ DKIM
* **ARC**: แม้จะไม่ได้ระบุรายละเอียดอย่างชัดเจน แต่คะแนนการปฏิบัติตามข้อกำหนดที่สมบูรณ์แบบของบริการนี้แสดงให้เห็นถึงการจัดการส่วนหัวการตรวจสอบสิทธิ์ที่ครอบคลุม

ที่มา: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

การตรวจสอบความถูกต้อง: การทดสอบอีเมลของ Internet.nl แสดงคะแนน 100/100 โดยเฉพาะสำหรับการใช้งาน "SPF, DKIM และ DMARC" การประเมิน Hardenize ยืนยันคะแนน "ดี" สำหรับ SPF และ DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### คุณรักษาส่วนหัวอีเมลต้นฉบับและป้องกันการปลอมแปลงหรือไม่ {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> การส่งต่ออีเมลใช้การป้องกันการปลอมแปลงที่ซับซ้อนเพื่อป้องกันการใช้อีเมลในทางที่ผิด

การส่งต่ออีเมลจะรักษาส่วนหัวอีเมลดั้งเดิมไว้ในขณะที่ใช้การป้องกันการปลอมแปลงที่ครอบคลุมผ่านฐานโค้ด MX:

* **การรักษาส่วนหัว**: ส่วนหัวการตรวจสอบความถูกต้องดั้งเดิมจะยังคงอยู่ในระหว่างการส่งต่อ
* **การป้องกันการปลอมแปลง**: การบังคับใช้นโยบาย DMARC ป้องกันการปลอมแปลงส่วนหัวโดยการปฏิเสธอีเมลที่ไม่ผ่านการตรวจสอบ SPF หรือ DKIM
* **การป้องกันการแทรกส่วนหัว**: การตรวจสอบความถูกต้องและการกำจัดข้อมูลอินพุตโดยใช้ไลบรารี striptags
* **การป้องกันขั้นสูง**: การตรวจจับฟิชชิ่งที่ซับซ้อนพร้อมการตรวจจับการปลอมแปลง การป้องกันการปลอมแปลง และระบบแจ้งเตือนผู้ใช้

**รายละเอียดการใช้งาน MX**: ตรรกะการประมวลผลอีเมลหลักได้รับการจัดการโดยฐานโค้ดเซิร์ฟเวอร์ MX โดยเฉพาะ:

* ตัวจัดการข้อมูล MX หลัก: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* การกรองอีเมลตามอำเภอใจ (ป้องกันการปลอมแปลง): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

ตัวช่วย `isArbitrary` ใช้กฎป้องกันการปลอมแปลงที่ซับซ้อน รวมถึงการตรวจจับการแอบอ้างโดเมน วลีที่ถูกบล็อก และรูปแบบฟิชชิ่งต่างๆ

ที่มา: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### คุณจะป้องกันสแปมและการละเมิดได้อย่างไร {#how-do-you-protect-against-spam-and-abuse}

การส่งต่ออีเมลใช้การป้องกันแบบหลายชั้นที่ครอบคลุม:

* **การจำกัดอัตรา**: ใช้กับความพยายามยืนยันตัวตน จุดสิ้นสุด API และการเชื่อมต่อ SMTP
* **การแยกทรัพยากร**: ระหว่างผู้ใช้เพื่อป้องกันผลกระทบจากผู้ใช้ที่มีปริมาณการใช้งานสูง
* **การป้องกัน DDoS**: การป้องกันแบบหลายชั้นผ่านระบบ Shield ของ DataPacket และ Cloudflare
* **การปรับขนาดอัตโนมัติ**: การปรับทรัพยากรแบบไดนามิกตามความต้องการ
* **การป้องกันการละเมิด**: การตรวจสอบการป้องกันการละเมิดเฉพาะผู้ใช้และการบล็อกเนื้อหาที่เป็นอันตรายโดยใช้แฮช
* **การตรวจสอบสิทธิ์อีเมล**: โปรโตคอล SPF, DKIM, DMARC พร้อมการตรวจจับฟิชชิ่งขั้นสูง

ที่มา:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (รายละเอียดการป้องกัน DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### คุณเก็บเนื้อหาอีเมลไว้ในดิสก์ {#do-you-store-email-content-on-disk} หรือไม่

> \[!IMPORTANT]
> การส่งต่ออีเมลใช้สถาปัตยกรรมแบบ Zero-Knowledge ซึ่งป้องกันไม่ให้เนื้อหาอีเมลถูกเขียนลงดิสก์

* **สถาปัตยกรรมแบบ Zero-Knowledge**: กล่องจดหมาย SQLite ที่เข้ารหัสแยกกันหมายความว่าอีเมลที่ส่งต่อจะไม่สามารถเข้าถึงเนื้อหาอีเมลได้
* **การประมวลผลในหน่วยความจำ**: การประมวลผลอีเมลเกิดขึ้นในหน่วยความจำทั้งหมด หลีกเลี่ยงการจัดเก็บข้อมูลบนดิสก์
* **ไม่มีการบันทึกเนื้อหา**: "เราไม่บันทึกหรือจัดเก็บเนื้อหาอีเมลหรือข้อมูลเมตาลงในดิสก์"
* **การเข้ารหัสแบบแซนด์บ็อกซ์**: คีย์การเข้ารหัสจะไม่ถูกจัดเก็บบนดิสก์ในรูปแบบข้อความธรรมดา

**หลักฐานฐานโค้ด MX**: เซิร์ฟเวอร์ MX ประมวลผลอีเมลทั้งหมดในหน่วยความจำโดยไม่ต้องเขียนเนื้อหาลงดิสก์ ตัวจัดการการประมวลผลอีเมลหลักสาธิตวิธีการในหน่วยความจำนี้: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

ที่มา:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (บทคัดย่อ)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (รายละเอียดแบบ Zero-knowledge)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (การเข้ารหัสแบบแซนด์บ็อกซ์)

### เนื้อหาอีเมลอาจถูกเปิดเผยในระหว่างที่ระบบขัดข้องได้หรือไม่ {#can-email-content-be-exposed-during-system-crashes}

ไม่ การส่งต่ออีเมลใช้มาตรการป้องกันที่ครอบคลุมต่อการเปิดเผยข้อมูลที่เกี่ยวข้องกับความผิดพลาด:

* **ปิดใช้งาน Core Dumps**: ป้องกันการเปิดเผยหน่วยความจำระหว่างการขัดข้อง
* **ปิดใช้งานหน่วยความจำสลับ**: ปิดใช้งานอย่างสมบูรณ์เพื่อป้องกันการดึงข้อมูลสำคัญจากไฟล์สลับ
* **สถาปัตยกรรมในหน่วยความจำ**: เนื้อหาอีเมลจะอยู่ในหน่วยความจำชั่วคราวเท่านั้นระหว่างการประมวลผล
* **การป้องกันคีย์การเข้ารหัส**: คีย์จะไม่ถูกจัดเก็บไว้ในดิสก์ในรูปแบบข้อความธรรมดา
* **ความปลอดภัยทางกายภาพ**: ดิสก์ที่เข้ารหัส LUKS v2 ป้องกันการเข้าถึงข้อมูลทางกายภาพ
* **ปิดใช้งานที่เก็บข้อมูล USB**: ป้องกันการดึงข้อมูลโดยไม่ได้รับอนุญาต

**การจัดการข้อผิดพลาดสำหรับปัญหาของระบบ**: การส่งต่ออีเมลใช้ฟังก์ชันตัวช่วย `isCodeBug` และ `isTimeoutError` เพื่อให้แน่ใจว่าหากเกิดปัญหาการเชื่อมต่อฐานข้อมูล ปัญหาเครือข่าย DNS/รายการบล็อค หรือปัญหาการเชื่อมต่ออัปสตรีม ระบบจะส่งคืนรหัสสถานะ SMTP 421 เพื่อให้แน่ใจว่าอีเมลจะถูกลองส่งใหม่ในภายหลังแทนที่จะสูญหายหรือเปิดเผย

รายละเอียดการดำเนินการ:

* การจัดประเภทข้อผิดพลาด: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* การจัดการข้อผิดพลาดการหมดเวลาในการประมวลผล MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

ที่มา: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### ใครมีสิทธิ์เข้าถึงโครงสร้างพื้นฐานอีเมลของคุณ {#who-has-access-to-your-email-infrastructure}

Forward Email ใช้การควบคุมการเข้าถึงที่ครอบคลุมสำหรับการเข้าถึงทีมวิศวกรขั้นต่ำ 2-3 คนพร้อมข้อกำหนด 2FA ที่เข้มงวด:

* **การควบคุมการเข้าถึงตามบทบาท**: สำหรับบัญชีทีมที่มีสิทธิ์ตามทรัพยากร
* **หลักการสิทธิ์ขั้นต่ำ**: ใช้กับทุกระบบ
* **การแบ่งแยกหน้าที่**: ระหว่างบทบาทปฏิบัติการ
* **การจัดการผู้ใช้**: แยกผู้ใช้ deploy และ devops ที่มีสิทธิ์ที่แตกต่างกัน
* **ปิดใช้งานการเข้าสู่ระบบ root**: บังคับให้เข้าถึงผ่านบัญชีที่ผ่านการรับรองความถูกต้องอย่างถูกต้อง
* **2FA ที่เข้มงวด**: ไม่มี 2FA บน SMS เนื่องจากมีความเสี่ยงต่อการโจมตี MiTM - ใช้ได้เฉพาะโทเค็นบนแอปหรือฮาร์ดแวร์เท่านั้น
* **การบันทึกการตรวจสอบที่ครอบคลุม**: พร้อมการแก้ไขข้อมูลที่ละเอียดอ่อน
* **การตรวจจับความผิดปกติอัตโนมัติ**: สำหรับรูปแบบการเข้าถึงที่ผิดปกติ
* **การตรวจสอบความปลอดภัยตามปกติ**: ของบันทึกการเข้าถึง
* **การป้องกันการโจมตี Evil Maid**: ปิดใช้งานที่เก็บข้อมูล USB และมาตรการรักษาความปลอดภัยทางกายภาพอื่นๆ

ที่มา:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (การควบคุมการอนุญาต)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (ความปลอดภัยเครือข่าย)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (การป้องกันการโจมตีจากแม่บ้านชั่วร้าย)

### คุณใช้ผู้ให้บริการโครงสร้างพื้นฐานรายใด {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> การส่งต่ออีเมลใช้ตัวประมวลผลย่อยโครงสร้างพื้นฐานหลายตัวพร้อมใบรับรองการปฏิบัติตามข้อกำหนดที่ครอบคลุม

รายละเอียดทั้งหมดมีอยู่ในหน้าการปฏิบัติตาม GDPR ของเรา: <https://forwardemail.net/gdpr>

**ซับโปรเซสเซอร์โครงสร้างพื้นฐานหลัก:**

| ผู้ให้บริการ | ได้รับการรับรองกรอบความเป็นส่วนตัวของข้อมูล | หน้าการปฏิบัติตาม GDPR |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **คลาวด์แฟลร์** | ✅ ใช่ครับ | https://www.cloudflare.com/trust-hub/gdpr/ |
| **แพ็คเก็ตข้อมูล** | ❌ ไม่ | <https://www.datapacket.com/นโยบายความเป็นส่วนตัว> |
| **ดิจิทัลโอเชียน** | ❌ ไม่ | ลิขสิทธิ์ © 2018 digitalocean.com |
| **วัลเตอร์** | ❌ ไม่ | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**รายละเอียดการรับรอง:**

**ดิจิทัลโอเชียน**

* SOC 2 Type II และ SOC 3 Type II (ตรวจสอบโดย Schellman & Company LLC)
* ได้รับการรับรองมาตรฐาน ISO 27001 ในศูนย์ข้อมูลหลายแห่ง
* สอดคล้องกับมาตรฐาน PCI-DSS
* ได้รับการรับรอง CSA STAR ระดับ 1
* ได้รับการรับรอง APEC CBPR PRP
* รายละเอียด: <https://www.digitalocean.com/trust/certification-reports>

**วัลเตอร์**

* ได้รับการรับรอง SOC 2+ (HIPAA)
* สอดคล้องกับ PCI Merchant
* ได้รับการรับรอง CSA STAR ระดับ 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* รายละเอียด: <https://www.vultr.com/legal/compliance/>

**แพ็คเก็ตข้อมูล**

* สอดคล้องกับมาตรฐาน SOC 2 (ติดต่อ DataPacket โดยตรงเพื่อขอรับการรับรอง)
* โครงสร้างพื้นฐานระดับองค์กร (สาขาเดนเวอร์)
* การป้องกัน DDoS ผ่านชุดความปลอดภัยทางไซเบอร์ของ Shield
* การสนับสนุนทางเทคนิคตลอด 24 ชั่วโมงทุกวัน
* เครือข่ายทั่วโลกครอบคลุม 58 ศูนย์ข้อมูล
* รายละเอียด: <https://www.datapacket.com/datacenters/denver>

**ผู้ประมวลผลการชำระเงิน:**

* **Stripe**: ได้รับการรับรองกรอบความเป็นส่วนตัวของข้อมูล - <https://stripe.com/legal/privacy-center>
* **PayPal**: ไม่ได้รับการรับรอง DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### คุณมีข้อตกลงการประมวลผลข้อมูล (DPA) {#do-you-offer-a-data-processing-agreement-dpa} หรือไม่

ใช่ Forward Email มีข้อตกลงการประมวลผลข้อมูล (DPA) ที่ครอบคลุม ซึ่งสามารถลงนามร่วมกับข้อตกลงองค์กรของเราได้ ดูสำเนา DPA ของเราได้ที่: <https://forwardemail.net/dpa>

**รายละเอียด DPA:**

* ครอบคลุมการปฏิบัติตาม GDPR และกรอบข้อตกลง EU-US/Swiss-US Privacy Shield
* ยอมรับโดยอัตโนมัติเมื่อยอมรับข้อกำหนดในการให้บริการของเรา
* ไม่จำเป็นต้องลงนามแยกต่างหากสำหรับ DPA มาตรฐาน
* มีข้อตกลง DPA แบบกำหนดเองผ่าน Enterprise License

**กรอบการปฏิบัติตาม GDPR:**
DPA ของเรามีรายละเอียดเกี่ยวกับการปฏิบัติตาม GDPR รวมถึงข้อกำหนดการถ่ายโอนข้อมูลระหว่างประเทศ ดูข้อมูลเพิ่มเติมได้ที่: <https://forwardemail.net/gdpr>

สำหรับลูกค้าองค์กรที่ต้องการเงื่อนไข DPA ที่กำหนดเองหรือข้อตกลงตามสัญญาที่เฉพาะเจาะจง สามารถแก้ไขได้ผ่านโปรแกรม **ใบอนุญาตองค์กร (250 ดอลลาร์/เดือน)** ของเรา

### คุณจัดการกับการแจ้งเตือนการละเมิดข้อมูลอย่างไร {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> สถาปัตยกรรมแบบ Zero-Knowledge ของ Forward Email ช่วยจำกัดผลกระทบจากการละเมิดได้อย่างมาก

* **การเปิดเผยข้อมูลจำกัด**: ไม่สามารถเข้าถึงเนื้อหาอีเมลที่เข้ารหัสได้เนื่องจากสถาปัตยกรรมแบบ Zero-Knowledge
* **การรวบรวมข้อมูลขั้นต่ำ**: มีเพียงข้อมูลสมาชิกพื้นฐานและบันทึก IP ที่จำกัดเพื่อความปลอดภัย
* **กรอบการทำงานของผู้ประมวลผลย่อย**: DigitalOcean และ Vultr รักษาขั้นตอนการตอบสนองต่อเหตุการณ์ที่สอดคล้องกับ GDPR

**ข้อมูลตัวแทน GDPR:**
Forward Email ได้แต่งตั้งตัวแทน GDPR ตามมาตรา 27:

**ตัวแทนสหภาพยุโรป:**
บริษัท Osano International Compliance Services Limited
เรียน: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**ตัวแทนในสหราชอาณาจักร:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

สำหรับลูกค้าองค์กรที่ต้องการ SLA สำหรับการแจ้งการละเมิดที่เฉพาะเจาะจง ควรมีการหารือเรื่องนี้เป็นส่วนหนึ่งของข้อตกลง **สิทธิ์ใช้งานระดับองค์กร**

ที่มา:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### คุณมีสภาพแวดล้อมการทดสอบ {#do-you-offer-a-test-environment} หรือไม่

เอกสารทางเทคนิคของ Forward Email ไม่ได้อธิบายโหมดแซนด์บ็อกซ์เฉพาะไว้อย่างชัดเจน อย่างไรก็ตาม วิธีการทดสอบที่เป็นไปได้มีดังนี้:

* **ตัวเลือกการโฮสต์ด้วยตนเอง**: ความสามารถในการโฮสต์ด้วยตนเองที่ครอบคลุมสำหรับการสร้างสภาพแวดล้อมการทดสอบ
* **อินเทอร์เฟซ API**: ศักยภาพสำหรับการทดสอบการกำหนดค่าด้วยโปรแกรม
* **โอเพ่นซอร์ส**: โค้ดโอเพ่นซอร์ส 100% ช่วยให้ลูกค้าสามารถตรวจสอบตรรกะการส่งต่อได้
* **หลายโดเมน**: การรองรับหลายโดเมนช่วยให้สามารถสร้างโดเมนทดสอบได้

สำหรับลูกค้าองค์กรที่ต้องการความสามารถแซนด์บ็อกซ์อย่างเป็นทางการ ควรมีการหารือเรื่องนี้เป็นส่วนหนึ่งของข้อตกลง **ใบอนุญาตองค์กร**

แหล่งที่มา: <https://github.com/forwardemail/forwardemail.net> (รายละเอียดสภาพแวดล้อมการพัฒนา)

### คุณมีเครื่องมือตรวจสอบและแจ้งเตือนหรือไม่ {#do-you-provide-monitoring-and-alerting-tools}

การส่งต่ออีเมลช่วยให้สามารถตรวจสอบแบบเรียลไทม์ได้โดยมีข้อจำกัดบางประการ:

**มีอยู่:**

* **การตรวจสอบการส่งมอบแบบเรียลไทม์**: ตัวชี้วัดประสิทธิภาพที่เปิดเผยต่อสาธารณะสำหรับผู้ให้บริการอีเมลรายใหญ่
* **การแจ้งเตือนอัตโนมัติ**: ทีมวิศวกรจะได้รับการแจ้งเตือนเมื่อเวลาในการส่งมอบเกิน 10 วินาที
* **การตรวจสอบที่โปร่งใส**: ระบบตรวจสอบแบบโอเพนซอร์ส 100%
* **การตรวจสอบโครงสร้างพื้นฐาน**: การตรวจจับความผิดปกติอัตโนมัติและการบันทึกการตรวจสอบที่ครอบคลุม

**ข้อจำกัด:**

* เว็บฮุกที่เผชิญหน้ากับลูกค้าหรือการแจ้งเตือนสถานะการจัดส่งที่ใช้ API ไม่ได้รับการบันทึกไว้อย่างชัดเจน

สำหรับลูกค้าองค์กรที่ต้องการเว็บฮุกสถานะการจัดส่งโดยละเอียดหรือการบูรณาการการตรวจสอบแบบกำหนดเอง ความสามารถเหล่านี้อาจพร้อมใช้งานผ่านข้อตกลง **ใบอนุญาตองค์กร**

ที่มา:

* <https://forwardemail.net> (จอแสดงผลการตรวจสอบแบบเรียลไทม์)
* <https://github.com/forwardemail/forwardemail.net> (การใช้งานการตรวจสอบ)

### คุณจะมั่นใจได้อย่างไรว่ามีความพร้อมใช้งานสูง {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> การส่งต่ออีเมลใช้การสำรองข้อมูลที่ครอบคลุมระหว่างผู้ให้บริการโครงสร้างพื้นฐานหลายราย

* **โครงสร้างพื้นฐานแบบกระจาย**: ผู้ให้บริการหลายราย (DigitalOcean, Vultr, DataPacket) ครอบคลุมทุกภูมิภาค
* **การปรับสมดุลโหลดทางภูมิศาสตร์**: การปรับสมดุลโหลดตามตำแหน่งทางภูมิศาสตร์บน Cloudflare พร้อมเฟลโอเวอร์อัตโนมัติ
* **การปรับขนาดอัตโนมัติ**: การปรับทรัพยากรแบบไดนามิกตามความต้องการ
* **การป้องกัน DDoS แบบหลายชั้น**: ผ่านระบบ Shield ของ DataPacket และ Cloudflare
* **การสำรองเซิร์ฟเวอร์**: เซิร์ฟเวอร์หลายเครื่องต่อภูมิภาคพร้อมเฟลโอเวอร์อัตโนมัติ
* **การจำลองฐานข้อมูล**: การซิงโครไนซ์ข้อมูลแบบเรียลไทม์ในหลายสถานที่
* **การตรวจสอบและแจ้งเตือน**: การตรวจสอบตลอด 24 ชั่วโมงทุกวัน พร้อมการตอบสนองต่อเหตุการณ์อัตโนมัติ

**ความมุ่งมั่นด้านเวลาการทำงาน**: ความพร้อมให้บริการ 99.9%+ พร้อมการตรวจสอบที่โปร่งใสที่ <https://forwardemail.net>

ที่มา:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### คุณปฏิบัติตามมาตรา 889 ของพระราชบัญญัติการอนุญาตการป้องกันประเทศ (NDAA) หรือไม่ {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> การส่งต่ออีเมลเป็นไปตามมาตรา 889 อย่างสมบูรณ์ผ่านการคัดเลือกพันธมิตรด้านโครงสร้างพื้นฐานอย่างรอบคอบ

ใช่ การส่งต่ออีเมลเป็นไปตาม **มาตรา 889** มาตรา 889 ของพระราชบัญญัติการอนุญาตการป้องกันประเทศ (NDAA) ห้ามไม่ให้หน่วยงานรัฐบาลใช้หรือทำสัญญากับหน่วยงานที่ใช้อุปกรณ์โทรคมนาคมและกล้องวงจรปิดจากบริษัทเฉพาะ (Huawei, ZTE, Hikvision, Dahua และ Hytera)

**การส่งต่ออีเมลช่วยให้เป็นไปตามมาตรา 889 ได้อย่างไร:**

การส่งต่ออีเมลนั้นอาศัยผู้ให้บริการโครงสร้างพื้นฐานหลักสองรายเท่านั้น ซึ่งทั้งสองรายไม่ได้ใช้อุปกรณ์ต้องห้ามตามมาตรา 889:

1. **Cloudflare**: พันธมิตรหลักของเราสำหรับบริการเครือข่ายและความปลอดภัยอีเมล
2. **DataPacket**: ผู้ให้บริการโครงสร้างพื้นฐานเซิร์ฟเวอร์หลักของเรา (ใช้อุปกรณ์ของ Arista Networks และ Cisco เท่านั้น)
3. **ผู้ให้บริการสำรองข้อมูล**: ผู้ให้บริการสำรองข้อมูล Digital Ocean และ Vultr ของเรายังได้รับการยืนยันเป็นลายลักษณ์อักษรว่าเป็นไปตามมาตรา 889

**ความมุ่งมั่นของ Cloudflare**: Cloudflare ระบุไว้อย่างชัดเจนในจรรยาบรรณบุคคลที่สามว่าจะไม่ใช้เครื่องมือโทรคมนาคม ผลิตภัณฑ์เฝ้าระวังวิดีโอ หรือบริการจากหน่วยงานที่ต้องห้ามตามมาตรา 889

**กรณีการใช้งานของรัฐบาล**: การปฏิบัติตามมาตรา 889 ของเราได้รับการตรวจสอบเมื่อ **สถาบันการเดินเรือแห่งสหรัฐอเมริกา** เลือกการส่งต่ออีเมลสำหรับความต้องการในการส่งต่ออีเมลที่ปลอดภัย ซึ่งต้องมีเอกสารมาตรฐานการปฏิบัติตามของรัฐบาลกลางของเรา

หากต้องการทราบรายละเอียดทั้งหมดเกี่ยวกับกรอบการปฏิบัติตามข้อกำหนดของรัฐบาลของเรา รวมถึงกฎระเบียบของรัฐบาลกลางที่กว้างขึ้น โปรดอ่านกรณีศึกษาที่ครอบคลุมของเรา: [สอดคล้องกับมาตรา 889 ของบริการอีเมลของรัฐบาลกลาง](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## รายละเอียดระบบและเทคนิค {#system-and-technical-details}

### คุณจัดเก็บอีเมลและเนื้อหาหรือไม่ {#do-you-store-emails-and-their-contents}

ไม่ เราไม่ได้เขียนลงดิสก์หรือเก็บบันทึก – ด้วย [ข้อยกเว้นของข้อผิดพลาด](#do-you-store-error-logs) และ [SMTP ขาออก](#do-you-support-sending-email-with-smtp) (ดู [นโยบายความเป็นส่วนตัว](/privacy) ของเรา)

ทุกอย่างทำในหน่วยความจำและ [ซอร์สโค้ดของเราอยู่บน GitHub](https://github.com/forwardemail)

### ระบบส่งต่ออีเมลของคุณทำงานอย่างไร {#how-does-your-email-forwarding-system-work}

อีเมลอาศัย [โปรโตคอล SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) โปรโตคอลนี้ประกอบด้วยคำสั่งที่ส่งไปยังเซิร์ฟเวอร์ (ส่วนใหญ่ทำงานบนพอร์ต 25) การเชื่อมต่อเริ่มต้นจะเริ่มต้นขึ้น จากนั้นผู้ส่งจะระบุว่าอีเมลมาจากใคร ("MAIL FROM") ตามด้วยตำแหน่งที่จะส่ง ("RCPT TO") และสุดท้ายคือส่วนหัวและเนื้อหาของอีเมล ("DATA") ขั้นตอนการส่งต่ออีเมลของเรามีรายละเอียดสัมพันธ์กับคำสั่งโปรโตคอล SMTP แต่ละคำสั่งด้านล่าง:

* การเชื่อมต่อเริ่มต้น (ไม่มีชื่อคำสั่ง เช่น `telnet example.com 25`) - นี่คือการเชื่อมต่อเริ่มต้น เราจะตรวจสอบผู้ส่งที่ไม่อยู่ใน [รายการที่อนุญาต](#do-you-have-an-allowlist) กับ [รายชื่อผู้ปฏิเสธ](#do-you-have-a-denylist) สุดท้าย หากผู้ส่งไม่อยู่ในรายการอนุญาต เราจะตรวจสอบว่าพวกเขาอยู่ใน [อยู่ในบัญชีเทา](#do-you-have-a-greylist) หรือไม่

* `HELO` - ระบุคำทักทายเพื่อระบุ FQDN, ที่อยู่ IP หรือชื่อตัวจัดการอีเมลของผู้ส่ง ค่านี้สามารถปลอมแปลงได้ ดังนั้นเราจึงไม่ต้องพึ่งพาข้อมูลนี้ แต่จะใช้การค้นหาชื่อโฮสต์แบบย้อนกลับของที่อยู่ IP ของการเชื่อมต่อแทน

* `MAIL FROM` - ระบุที่อยู่อีเมลจากซองจดหมายของอีเมล หากป้อนค่า จะต้องเป็นที่อยู่อีเมล RFC 5322 ที่ถูกต้อง อนุญาตให้เว้นว่างไว้ได้ เราใช้ [ตรวจสอบการกระเจิงกลับ](#how-do-you-protect-against-backscatter) ที่นี่ และเรายังตรวจสอบ MAIL FROM กับ [รายชื่อผู้ปฏิเสธ](#do-you-have-a-denylist) ของเราด้วย สุดท้ายเราจะตรวจสอบผู้ส่งที่ไม่อยู่ในรายการที่อนุญาตให้จำกัดอัตรา (ดูข้อมูลเพิ่มเติมในส่วน [การจำกัดอัตรา](#do-you-have-rate-limiting) และ [รายการที่อนุญาต](#do-you-have-an-allowlist))

* `RCPT TO` - ระบุผู้รับอีเมล ซึ่งต้องเป็นที่อยู่อีเมล RFC 5322 ที่ถูกต้อง เราอนุญาตให้มีผู้รับซองจดหมายได้สูงสุด 50 รายต่อข้อความ (ซึ่งแตกต่างจากส่วนหัว "ถึง" ในอีเมล) นอกจากนี้ เรายังตรวจสอบที่อยู่ [แผนการเขียนใหม่ของผู้ส่ง](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") ที่ถูกต้องที่นี่ เพื่อป้องกันการปลอมแปลงด้วยชื่อโดเมน SRS ของเรา

* `DATA` - นี่คือส่วนหลักของบริการของเราที่ประมวลผลอีเมล ดูส่วน [คุณดำเนินการอีเมลเพื่อส่งต่ออย่างไร](#how-do-you-process-an-email-for-forwarding) ด้านล่างสำหรับข้อมูลเชิงลึกเพิ่มเติม

### คุณประมวลผลอีเมลเพื่อส่งต่อ {#how-do-you-process-an-email-for-forwarding} อย่างไร

หัวข้อนี้จะอธิบายกระบวนการของเราที่เกี่ยวข้องกับคำสั่งโปรโตคอล SMTP `DATA` ในส่วน [ระบบการส่งต่ออีเมลของคุณทำงานอย่างไร](#how-does-your-email-forwarding-system-work) ด้านบน โดยจะกล่าวถึงวิธีที่เราประมวลผลส่วนหัว เนื้อหา ความปลอดภัยของอีเมล กำหนดว่าจะต้องส่งไปที่ใด และวิธีจัดการการเชื่อมต่อ

1. หากข้อความมีขนาดเกินขนาดสูงสุด 50MB ระบบจะปฏิเสธด้วยรหัสข้อผิดพลาด 552

2. หากข้อความไม่มีส่วนหัว "จาก" หรือหากค่าใดๆ ในส่วนหัว "จาก" ไม่ใช่ที่อยู่อีเมล RFC 5322 ที่ถูกต้อง ข้อความนั้นจะถูกปฏิเสธพร้อมรหัสข้อผิดพลาด 550

3. หากข้อความมีส่วนหัว "ได้รับ" มากกว่า 25 หัวข้อ แสดงว่าข้อความนั้นติดอยู่ในลูปการเปลี่ยนเส้นทาง และถูกปฏิเสธด้วยรหัสข้อผิดพลาด 550

4. เราจะใช้ลายนิ้วมือของอีเมล (ดูส่วนที่เกี่ยวกับ [การพิมพ์ลายนิ้วมือ](#how-do-you-determine-an-email-fingerprint)) เพื่อตรวจสอบดูว่าข้อความได้รับการพยายามส่งซ้ำอีกครั้งหรือไม่เป็นเวลามากกว่า 5 วัน (ซึ่งตรงกับ [พฤติกรรม postfix เริ่มต้น](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)) และหากเป็นเช่นนั้น ระบบจะปฏิเสธด้วยรหัสข้อผิดพลาด 550

5. เราจัดเก็บผลลัพธ์จากการสแกนอีเมลในหน่วยความจำโดยใช้ [เครื่องสแกนสแปม](https://spamscanner.net)

6. หากมีผลลัพธ์ใดๆ ที่ไม่เป็นไปตามที่คาดหวังจาก Spam Scanner ระบบจะปฏิเสธด้วยรหัสข้อผิดพลาด 554 ณ เวลาที่เขียนบทความนี้ ผลลัพธ์ที่ไม่เป็นไปตามที่คาดหวังนี้รวมเฉพาะการทดสอบ GTUBE เท่านั้น ดู <https://spamassassin.apache.org/gtube/> สำหรับข้อมูลเชิงลึกเพิ่มเติม

7. เราจะเพิ่มส่วนหัวต่อไปนี้ในข้อความเพื่อวัตถุประสงค์ในการแก้ไขจุดบกพร่องและป้องกันการละเมิด:

* `Received` - เราเพิ่มส่วนหัว Received มาตรฐานนี้ พร้อมด้วย IP ต้นทางและโฮสต์, ประเภทการส่ง, ข้อมูลการเชื่อมต่อ TLS, วันที่/เวลา และผู้รับ
* `X-Original-To` - ผู้รับดั้งเดิมของข้อความ:
* มีประโยชน์สำหรับการระบุตำแหน่งเดิมของอีเมลที่ส่งถึง (นอกเหนือจากส่วนหัว "Received")
* จะถูกเพิ่มตามผู้รับแต่ละคน ณ เวลาของ IMAP และ/หรือการส่งต่อแบบซ่อน (เพื่อปกป้องความเป็นส่วนตัว)
* `X-Forward-Email-Website` - มีลิงก์ไปยังเว็บไซต์ของเรา <https://forwardemail.net>
* `X-Forward-Email-Version` - [เซมเวอร์](https://semver.org/) เวอร์ชันปัจจุบันจาก `package.json` ในฐานโค้ดของเรา
* `X-Forward-Email-Session-ID` - ค่า ID เซสชันที่ใช้สำหรับการแก้ไขข้อบกพร่อง (ใช้ในสภาพแวดล้อมที่ไม่ใช่การใช้งานจริงเท่านั้น)
* `X-Forward-Email-Sender` - รายการที่คั่นด้วยเครื่องหมายจุลภาค ประกอบด้วยที่อยู่ MAIL FROM ของซองจดหมายเดิม (หากไม่เว้นว่างไว้) FQDN ของไคลเอนต์ PTR แบบย้อนกลับ (หากมี) และที่อยู่ IP ของผู้ส่ง
* `X-Forward-Email-ID` - ใช้ได้เฉพาะกับ SMTP ขาออก และสัมพันธ์กับรหัสอีเมลที่เก็บไว้ใน บัญชีของฉัน → อีเมล
* `X-Original-To`0 - มีค่าเป็น `X-Original-To`1
* `X-Original-To`2 - มีค่าเป็น `X-Original-To`3
* `X-Original-To`4 - มีค่าเป็น `X-Original-To`5

8. จากนั้นเราจะตรวจสอบข้อความสำหรับ [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) และ [DMARC](https://en.wikipedia.org/wiki/DMARC)

* หากข้อความไม่ผ่านการตรวจสอบ DMARC และโดเมนมีนโยบายการปฏิเสธ (เช่น `p=reject` [อยู่ในนโยบาย DMARC](https://wikipedia.org/wiki/DMARC)) ระบบจะปฏิเสธด้วยรหัสข้อผิดพลาด 550 โดยทั่วไป นโยบาย DMARC สำหรับโดเมนจะอยู่ในระเบียน <strong class="notranslate">TXT</strong> ของโดเมนย่อย `_dmarc` (เช่น `dig _dmarc.example.com txt`)
* หากข้อความไม่ผ่านการตรวจสอบ SPF และโดเมนมีนโยบาย hard fail (เช่น `-all` อยู่ในนโยบาย SPF ไม่ใช่ `~all` หรือไม่มีนโยบายเลย) ระบบจะปฏิเสธด้วยรหัสข้อผิดพลาด 550 โดยทั่วไป นโยบาย SPF สำหรับโดเมนจะอยู่ในระเบียน <strong class="notranslate">TXT</strong> ของโดเมนราก (เช่น `dig example.com txt`) โปรดดูส่วนนี้เพื่อดูข้อมูลเพิ่มเติมเกี่ยวกับ [การส่งเมล์เหมือนกับ Gmail](#can-i-send-mail-as-in-gmail-with-this) ที่เกี่ยวข้องกับ SPF

9. ขณะนี้เราประมวลผลผู้รับข้อความตามที่รวบรวมจากคำสั่ง `RCPT TO` ในส่วน [ระบบการส่งต่ออีเมลของคุณทำงานอย่างไร](#how-does-your-email-forwarding-system-work) ด้านบน สำหรับผู้รับแต่ละราย เราจะดำเนินการดังต่อไปนี้:

* เราค้นหาระเบียน <strong class="notranslate">TXT</strong> ของชื่อโดเมน (ส่วนที่อยู่หลังสัญลักษณ์ `@` เช่น `example.com` หากที่อยู่อีเมลคือ `test@example.com`) ตัวอย่างเช่น หากโดเมนคือ `example.com` เราจะค้นหา DNS เช่น `dig example.com txt`
* เราวิเคราะห์ระเบียน <strong class="notranslate">TXT</strong> ทั้งหมดที่ขึ้นต้นด้วย `forward-email=` (แพ็กเกจฟรี) หรือ `forward-email-site-verification=` (แพ็กเกจแบบชำระเงิน) โปรดทราบว่าเราวิเคราะห์ทั้งสองรายการเพื่อประมวลผลอีเมลในขณะที่ผู้ใช้กำลังอัปเกรดหรือดาวน์เกรดแพ็กเกจ
* จากเรกคอร์ด <strong class="notranslate">TXT</strong> ที่แยกวิเคราะห์เหล่านี้ เราจะวนซ้ำเพื่อแยกค่าการกำหนดค่าการส่งต่อ (ดังที่อธิบายไว้ในส่วน [ฉันจะเริ่มต้นและตั้งค่าการส่งต่ออีเมลได้อย่างไร](#how-do-i-get-started-and-set-up-email-forwarding) ด้านบน) โปรดทราบว่าเรารองรับค่า `forward-email-site-verification=` เพียงค่าเดียว และหากระบุค่ามากกว่าหนึ่งค่า จะเกิดข้อผิดพลาด 550 และผู้ส่งจะได้รับข้อความตีกลับสำหรับผู้รับรายนี้
* เราวนซ้ำการกำหนดค่าการส่งต่อที่แยกออกมาเพื่อกำหนดวิธีการส่งต่อแบบรวม การส่งต่อตามนิพจน์ทั่วไป และการกำหนดค่าการส่งต่ออื่นๆ ที่รองรับทั้งหมด ซึ่งปัจจุบันเรียกว่า "ที่อยู่สำหรับส่งต่อ" ของเรา
* สำหรับที่อยู่สำหรับส่งต่อแต่ละที่อยู่ เรารองรับการค้นหาแบบเรียกซ้ำหนึ่งครั้ง (ซึ่งจะเริ่มชุดการดำเนินการนี้ใหม่กับที่อยู่ที่ระบุ) หากพบการจับคู่แบบเรียกซ้ำ ผลลัพธ์หลักจะถูกลบออกจากที่อยู่สำหรับส่งต่อ และจะเพิ่มที่อยู่ย่อยเข้าไป
* ที่อยู่สำหรับส่งต่อจะถูกแยกวิเคราะห์เพื่อระบุความไม่ซ้ำกัน (เนื่องจากเราไม่ต้องการส่งซ้ำไปยังที่อยู่ใดที่อยู่หนึ่ง หรือสร้างการเชื่อมต่อไคลเอนต์ SMTP ที่ไม่จำเป็นเพิ่มเติม)
* สำหรับที่อยู่สำหรับส่งต่อแต่ละที่อยู่ เราจะค้นหาชื่อโดเมนโดยเทียบกับปลายทาง API `/v1/max-forwarded-addresses` ของเรา (เพื่อกำหนดจำนวนที่อยู่ซึ่งโดเมนได้รับอนุญาตให้ส่งต่ออีเมลไปยังนามแฝง เช่น 10 ตามค่าเริ่มต้น - ดูหัวข้อ `example.com`0) หากเกินขีดจำกัดนี้ จะเกิดข้อผิดพลาด 550 และผู้ส่งจะได้รับอีเมลตีกลับสำหรับผู้รับรายนี้
* เราค้นหาการตั้งค่าของผู้รับเดิมโดยเทียบกับปลายทาง API `example.com`1 ของเรา ซึ่งรองรับการค้นหาสำหรับผู้ใช้ที่ชำระเงิน (พร้อมตัวเลือกสำรองสำหรับผู้ใช้ฟรี) การดำเนินการนี้จะส่งคืนอ็อบเจ็กต์การกำหนดค่าสำหรับการตั้งค่าขั้นสูงสำหรับ `example.com`2 (ตัวเลข เช่น `example.com`3), `example.com`4 (บูลีน), `example.com`5 (บูลีน), `example.com`6 (บูลีน) และ `example.com`7 (บูลีน)
* จากการตั้งค่าเหล่านี้ เราจะตรวจสอบกับผลลัพธ์ของโปรแกรมสแกนสแปม และหากเกิดข้อผิดพลาดใดๆ ข้อความจะถูกปฏิเสธพร้อมรหัสข้อผิดพลาด 554 (เช่น หากเปิดใช้งาน `example.com`8 เราจะตรวจสอบผลลัพธ์ของโปรแกรมสแกนสแปมเพื่อหาไวรัส) โปรดทราบว่าผู้ใช้แพ็กเกจฟรีทุกคนจะเลือกรับการตรวจสอบเนื้อหาสำหรับผู้ใหญ่ ฟิชชิ่ง ไฟล์ปฏิบัติการ และไวรัส โดยค่าเริ่มต้น ผู้ใช้แผนชำระเงินทั้งหมดจะเลือกเข้าร่วมด้วยเช่นกัน แต่การกำหนดค่านี้สามารถเปลี่ยนได้ภายใต้หน้าการตั้งค่าสำหรับโดเมนในแดชบอร์ดการส่งต่ออีเมล

10. สำหรับที่อยู่การส่งต่อของผู้รับแต่ละรายที่ได้รับการประมวลผล เราจะดำเนินการดังต่อไปนี้:

* ระบบจะตรวจสอบที่อยู่กับ [รายชื่อผู้ปฏิเสธ](#do-you-have-a-denylist) ของเรา และหากปรากฏอยู่ ระบบจะแสดงรหัสข้อผิดพลาด 421 (ซึ่งหมายถึงให้ผู้ส่งลองใหม่อีกครั้งในภายหลัง)
* หากที่อยู่นั้นเป็นเว็บฮุก เราจะตั้งค่าบูลีนสำหรับการดำเนินการในอนาคต (ดูด้านล่าง – เราจะจัดกลุ่มเว็บฮุกที่คล้ายกันเข้าด้วยกันเพื่อสร้างคำขอ POST เดียว แทนที่จะจัดหลายคำขอเพื่อนำส่ง)
* หากที่อยู่นั้นเป็นที่อยู่อีเมล เราจะแยกวิเคราะห์โฮสต์สำหรับการดำเนินการในอนาคต (ดูด้านล่าง – เราจะจัดกลุ่มโฮสต์ที่คล้ายกันเข้าด้วยกันเพื่อสร้างการเชื่อมต่อเดียว แทนที่จะจัดหลายการเชื่อมต่อแยกกันเพื่อนำส่ง)

11. หากไม่มีผู้รับและไม่มีการตีกลับ เราจะตอบกลับด้วยข้อผิดพลาด 550 ว่า "ผู้รับไม่ถูกต้อง"

12. หากมีผู้รับ เราจะดำเนินการซ้ำ (จัดกลุ่มตามโฮสต์เดียวกัน) และส่งอีเมล ดูส่วน [คุณจัดการกับปัญหาการส่งอีเมลอย่างไร](#how-do-you-handle-email-delivery-issues) ด้านล่างสำหรับข้อมูลเชิงลึกเพิ่มเติม

* หากเกิดข้อผิดพลาดใดๆ ขณะส่งอีเมล เราจะจัดเก็บข้อผิดพลาดเหล่านั้นไว้ในหน่วยความจำเพื่อประมวลผลในภายหลัง
* เราจะใช้รหัสข้อผิดพลาดที่ต่ำที่สุด (หากมี) จากการส่งอีเมล และใช้เป็นรหัสตอบกลับสำหรับคำสั่ง `DATA` ซึ่งหมายความว่าโดยทั่วไปแล้วอีเมลที่ยังไม่ได้ส่งจะถูกส่งซ้ำโดยผู้ส่งเดิม แต่อีเมลที่ส่งไปแล้วจะไม่ถูกส่งซ้ำในครั้งถัดไปที่ส่งข้อความ (ตามที่เราใช้ [การพิมพ์ลายนิ้วมือ](#how-do-you-determine-an-email-fingerprint))
* หากไม่มีข้อผิดพลาดใดๆ เกิดขึ้น เราจะส่งรหัสสถานะการตอบกลับ SMTP สำเร็จ 250
* การตีกลับหมายถึงความพยายามในการส่งอีเมลใดๆ ก็ตามที่ส่งผลให้รหัสสถานะมีค่ามากกว่าหรือเท่ากับ 500 (ล้มเหลวถาวร)

13. หากไม่มีการตีกลับเกิดขึ้น (ความล้มเหลวถาวร) จากนั้นเราจะส่งคืนรหัสสถานะการตอบสนอง SMTP ของรหัสข้อผิดพลาดต่ำสุดจากความล้มเหลวที่ไม่ถาวร (หรือรหัสสถานะสำเร็จ 250 หากไม่มีเลย)

14. หากเกิดการตีกลับ เราจะส่งอีเมลตีกลับในเบื้องหลังหลังจากส่งรหัสข้อผิดพลาดที่ต่ำที่สุดกลับไปยังผู้ส่ง อย่างไรก็ตาม หากรหัสข้อผิดพลาดที่ต่ำที่สุดมากกว่า 500 เราจะไม่ส่งอีเมลตีกลับใดๆ เนื่องจากหากเราส่งอีเมลตีกลับ ผู้ส่งจะได้รับอีเมลตีกลับซ้ำ (เช่น อีเมลจาก MTA ขาออก เช่น Gmail และอีเมลจากเรา) ดูข้อมูลเพิ่มเติมได้ที่หัวข้อ [คุณจะป้องกันการกระเจิงกลับได้อย่างไร](#how-do-you-protect-against-backscatter) ด้านล่าง

### คุณจัดการกับปัญหาการส่งอีเมลอย่างไร {#how-do-you-handle-email-delivery-issues}

โปรดทราบว่าเราจะเขียนอีเมลใหม่โดยใช้ "Friendly-From" ก็ต่อเมื่อนโยบาย DMARC ของผู้ส่งไม่ผ่าน และไม่มีลายเซ็น DKIM ใดที่ตรงกับส่วนหัว "From" ซึ่งหมายความว่าเราจะแก้ไขส่วนหัว "From" ในข้อความ ตั้งค่าเป็น "X-Original-From" และตั้งค่า "Reply-To" หากยังไม่ได้ตั้งค่าไว้ นอกจากนี้ เราจะปิดผนึกตราประทับ ARC ในข้อความอีกครั้งหลังจากแก้ไขส่วนหัวเหล่านี้

เรายังใช้การแยกวิเคราะห์ข้อความแสดงข้อผิดพลาดแบบชาญฉลาดในทุกระดับของสแต็กของเรา – ในโค้ดของเรา คำขอ DNS, ข้อมูลภายในของ Node.js, คำขอ HTTP (เช่น 408, 413 และ 429 จะถูกแมปไปยังโค้ดตอบสนอง SMTP ของ 421 ถ้าผู้รับเป็นเว็บฮุก) และการตอบสนองของเซิร์ฟเวอร์อีเมล (เช่น การตอบสนองด้วย "defer" หรือ "slowdown" จะถูกส่งกลับเป็นข้อผิดพลาด 421)

ตรรกะของเราเป็นแบบป้องกันข้อผิดพลาด (dummy-proof) และจะลองส่งซ้ำอีกครั้งหากพบข้อผิดพลาด SSL/TLS ปัญหาการเชื่อมต่อ และอื่นๆ เป้าหมายของการป้องกันข้อผิดพลาด (dummy-proofing) คือการเพิ่มความสามารถในการส่งไปยังผู้รับทั้งหมดให้สูงสุดสำหรับการกำหนดค่าการส่งต่อ

หากผู้รับเป็นเว็บฮุก เราจะอนุญาตให้คำขอเสร็จสิ้นภายใน 60 วินาที โดยสามารถลองใหม่ได้สูงสุด 3 ครั้ง (รวมเป็น 4 คำขอก่อนที่จะล้มเหลว) โปรดทราบว่าเราได้วิเคราะห์รหัสข้อผิดพลาด 408, 413 และ 429 อย่างถูกต้อง และจับคู่กับรหัสตอบกลับ SMTP 421

มิฉะนั้น หากผู้รับเป็นที่อยู่อีเมล เราจะพยายามส่งอีเมลโดยใช้ TLS แบบฉวยโอกาส (เราจะพยายามใช้ STARTTLS หากมีอยู่บนเซิร์ฟเวอร์อีเมลของผู้รับ) หากเกิดข้อผิดพลาด SSL/TLS ขณะพยายามส่งอีเมล เราจะพยายามส่งอีเมลโดยไม่ใช้ TLS (โดยไม่ใช้ STARTTLS)

หากเกิดข้อผิดพลาด DNS หรือการเชื่อมต่อใดๆ เราจะส่งรหัสการตอบสนอง SMTP 421 ไปยังคำสั่ง `DATA` มิฉะนั้น หากมีข้อผิดพลาดระดับ >= 500 ก็จะส่งการตีกลับ

หากเราตรวจพบว่าเซิร์ฟเวอร์อีเมลที่เราพยายามจะส่งไปนั้นถูกบล็อกที่อยู่ IP ของการแลกเปลี่ยนอีเมลของเราหนึ่งที่อยู่หรือมากกว่านั้น (เช่น ด้วยเทคโนโลยีใดก็ตามที่ใช้ในการชะลอการส่งสแปม) เราจะส่งรหัสตอบกลับ SMTP 421 เพื่อให้ผู้ส่งลองส่งข้อความอีกครั้งในภายหลัง (และเราจะได้รับการแจ้งเตือนถึงปัญหาดังกล่าวเพื่อหวังว่าจะแก้ไขปัญหาได้ก่อนที่จะลองอีกครั้ง)

### คุณจัดการกับที่อยู่ IP ของคุณที่ถูกบล็อกอย่างไร {#how-do-you-handle-your-ip-addresses-becoming-blocked}

เราตรวจสอบรายชื่อผู้ปฏิเสธ DNS หลักๆ ทั้งหมดเป็นประจำ และหากที่อยู่ IP ของการแลกเปลี่ยนอีเมล ("MX") ของเราอยู่ในรายชื่อผู้ปฏิเสธหลัก เราจะดึงที่อยู่ดังกล่าวออกจากระเบียน DNS A แบบรอบโรบินที่เกี่ยวข้องหากเป็นไปได้ จนกว่าปัญหาจะได้รับการแก้ไข

ขณะนี้ เรายังอยู่ในรายชื่อ DNS Allowance List หลายรายการ และเราให้ความสำคัญกับรายชื่อ DNS Denyllist ที่ถูกตรวจสอบอย่างจริงจัง หากคุณพบปัญหาใดๆ ก่อนที่เราจะมีโอกาสแก้ไข โปรดแจ้งให้เราทราบเป็นลายลักษณ์อักษรที่ <support@forwardemail.net>

ที่อยู่ IP ของเราเปิดเผยต่อสาธารณะ [ดูส่วนด้านล่างนี้เพื่อดูข้อมูลเชิงลึกเพิ่มเติม](#what-are-your-servers-ip-addresses)

### ที่อยู่ postmaster คืออะไร {#what-are-postmaster-addresses}

เพื่อป้องกันการตีกลับที่ส่งผิดที่และการส่งข้อความตอบกลับวันหยุดไปยังกล่องจดหมายที่ไม่ได้รับการตรวจสอบหรือไม่มีอยู่ เราจึงรักษารายชื่อชื่อผู้ใช้ที่คล้ายกับ mailer-daemon:

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
* [และที่อยู่ที่ไม่ตอบกลับ](#what-are-no-reply-addresses)

ดู [RFC 5320 ส่วนที่ 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) เพื่อดูข้อมูลเชิงลึกเพิ่มเติมเกี่ยวกับการใช้รายการประเภทนี้เพื่อสร้างระบบอีเมลที่มีประสิทธิภาพ

### ที่อยู่ที่ไม่มีการตอบกลับคืออะไร {#what-are-no-reply-addresses}

ชื่อผู้ใช้อีเมลที่เทียบเท่ากับสิ่งต่อไปนี้ (ไม่คำนึงถึงตัวพิมพ์ใหญ่-เล็ก) ถือเป็นที่อยู่อีเมลที่ไม่มีการตอบกลับ:

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

รายการนี้ได้รับการดูแลรักษา [เป็นโครงการโอเพ่นซอร์สบน GitHub](https://github.com/forwardemail/reserved-email-addresses-list)

### ที่อยู่ IP ของเซิร์ฟเวอร์ของคุณคืออะไร {#what-are-your-servers-ip-addresses}

เราเผยแพร่ที่อยู่ IP ของเราที่ <https://forwardemail.net/ips>.

### คุณมีรายการอนุญาต {#do-you-have-an-allowlist} หรือไม่

ใช่ เรามี [รายชื่อนามสกุลโดเมน](#what-domain-name-extensions-are-allowlisted-by-default) ที่เป็นรายการอนุญาตตามค่าเริ่มต้น และรายการอนุญาตแบบไดนามิก แคช และแบบหมุนเวียนตาม [เกณฑ์ที่เข้มงวด](#what-is-your-allowlist-criteria)

อีเมล โดเมน และผู้รับทั้งหมดจากลูกค้าที่ใช้แผนแบบชำระเงินจะถูกเพิ่มลงในรายการอนุญาตของเราโดยอัตโนมัติ

### นามสกุลโดเมนใดบ้างที่ได้รับอนุญาตตามค่าเริ่มต้น {#what-domain-name-extensions-are-allowlisted-by-default}

นามสกุลโดเมนต่อไปนี้ถือว่าอยู่ในรายการอนุญาตตามค่าเริ่มต้น (โดยไม่คำนึงว่าจะอยู่ในรายการ Umbrella Popularity List หรือไม่):

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

นอกจากนี้ [โดเมนระดับบนสุดของแบรนด์และองค์กร](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) เหล่านี้ยังอยู่ในรายการที่อนุญาตตามค่าเริ่มต้น (เช่น `apple` สำหรับ `applecard.apple` สำหรับใบแจ้งยอดธนาคาร Apple Card):

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
<li class="list-inline-item"><code class="notranslate">บาสเกตบอล</code></li>
<li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
<li class="list-inline-item"><code class="notranslate">bbc</code></li>
<li class="list-inline-item"><code class="notranslate">bbt</code></li>
<li class="list-inline-item"><code class="notranslate">bbva</code></li>
<li class="list-inline-item"><code class="notranslate">bcg</code></li>
<li class="list-inline-item"><code class="notranslate">เบนท์ลีย์</code></li>
<li class="list-inline-item"><code class="notranslate">ภารตี</code></li>
<li class="list-inline-item"><code class="notranslate">บิง</code></li>
<li class="list-inline-item"><code class="notranslate">บลังโก</code></li>
<li class="list-inline-item"><code class="notranslate">บลูมเบิร์ก</code></li>
<li class="list-inline-item"><code class="notranslate">bms</code></li>
<li class="list-inline-item"><code class="notranslate">bmw</code></li>
<li class="list-inline-item"><code class="notranslate">bnl</code></li>
<li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
<li class="list-inline-item"><code class="notranslate">boehringer</code></li>
<li class="list-inline-item"><code class="notranslate">bond</code></li>
<li class="list-inline-item"><code class="notranslate">การจอง</code></li>
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
<li class="list-inline-item"><code class="notranslate">ไครสเลอร์</code></li>
<li class="list-inline-item"><code class="notranslate">cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">ซิสโก้</code></li>
<li class="list-inline-item"><code class="notranslate">ซิตาเดล</code></li>
<li class="list-inline-item"><code class="notranslate">ซิตี้</code></li>
<li class="list-inline-item"><code class="notranslate">ซิติก</code></li>
<li class="list-inline-item"><code class="notranslate">คลับเมด</code></li>
<li class="list-inline-item"><code class="notranslate">คอมคาสต์</code></li>
<li class="list-inline-item"><code class="notranslate">commbank</code></li>
<li class="list-inline-item"><code class="notranslate">เครดิตยูเนียน</code></li>
<li class="list-inline-item"><code class="notranslate">คราวน์</code></li>
<li class="list-inline-item"><code class="notranslate">crs</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><code class="notranslate">dabur</code></li>
<li class="list-inline-item"><code class="notranslate">datsun</code></li>
<li class="list-inline-item"><code class="notranslate">ตัวแทนจำหน่าย</code></li>
<li class="list-inline-item"><code class="notranslate">dell</code></li>
<li class="list-inline-item"><code class="notranslate">deloitte</code></li>
<li class="list-inline-item"><code class="notranslate">delta</code></li>
<li class="list-inline-item"><code class="notranslate">dhl</code></li>
<li class="list-inline-item"><code class="notranslate">discover</code></li>
<li class="list-inline-item"><code class="notranslate">dish</code></li>
<li class="list-inline-item"><code class="notranslate">dnp</code></li>
<li class="list-inline-item"><code class="notranslate">dodge</code></li>
<li class="list-inline-item"><code class="notranslate">ดันลอป</code></li>
<li class="list-inline-item"><code class="notranslate">ดูปองต์</code></li>
<li class="list-inline-item"><code class="notranslate">dvag</code></li>
<li class="list-inline-item"><code class="notranslate">edeka</code></li>
<li class="list-inline-item"><code class="notranslate">emerck</code></li>
<li class="list-inline-item"><code class="notranslate">epson</code></li>
<li class="list-inline-item"><code class="notranslate">ericsson</code></li>
<li class="list-inline-item"><code class="notranslate">erni</code></li>
<li class="list-inline-item"><code class="notranslate">esurance</code></li>
<li class="list-inline-item"><code class="notranslate">etisalat</code></li>
<li class="list-inline-item"><code class="notranslate">ยูโรวิชัน</code></li>
<li class="list-inline-item"><code class="notranslate">เอเวอร์แบงก์</code></li>
<li class="list-inline-item"><code class="notranslate">เอ็กซ์ตร้าสเปซ</code></li>
<li class="list-inline-item"><code class="notranslate">เฟจ</code></li>
<li class="list-inline-item"><code class="notranslate">แฟร์วินด์ส</code></li>
<li class="list-inline-item"><code class="notranslate">เกษตรกร</code></li>
<li class="list-inline-item"><code class="notranslate">เฟดเอ็กซ์</code></li>
<li class="list-inline-item"><code class="notranslate">เฟดเอ็กซ์</code></li>
<li class="list-inline-item"><code class="notranslate">เฟดเอ็กซ์</code></li>
<li class="list-inline-item"><code class="notranslate">เกษตรกร</code></li>
<li class="list-inline-item"><code class="notranslate">เฟดเอ็กซ์</code></li>
<li class="list-inline-item"><code class="notranslate">เฟอร์รารี</code></li>
<li class="list-inline-item"><code class="notranslate">เฟอร์เรโร</code></li>
<li class="list-inline-item"><code class="notranslate">เฟียต</code></li>
<li class="list-inline-item"><code class="notranslate">ความเที่ยงตรง</code></li>
<li class="list-inline-item"><code class="notranslate">ไฟร์สโตน</code></li>
<li class="list-inline-item"><code class="notranslate">เฟิร์มเดล</code></li>
<li class="list-inline-item"><code class="notranslate">flickr</code></li>
<li class="list-inline-item"><code class="notranslate">flir</code></li>
<li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
<li class="list-inline-item"><code class="notranslate">ฟอร์ด</code></li>
<li class="list-inline-item"><code class="notranslate">ฟ็อกซ์</code></li>
<li class="list-inline-item"><code class="notranslate">เฟรเซเนียส</code></li>
<li class="list-inline-item"><code class="notranslate">ฟอเร็กซ์</code></li>
<li class="list-inline-item"><code class="notranslate">ฟรอแกน</code></li>
<li class="list-inline-item"><code class="notranslate">ฟรอนเทียร์</code></li>
<li class="list-inline-item"><code class="notranslate">ฟูจิตสึ</code></li>
<li class="list-inline-item"><code class="notranslate">ฟูจิซีร็อกซ์</code></li>
<li class="list-inline-item"><code class="notranslate">gallo</code></li>
<li class="list-inline-item"><code class="notranslate">gallup</code></li>
<li class="list-inline-item"><code class="notranslate">gap</code></li>
<li class="list-inline-item"><code class="notranslate">gbiz</code></li>
<li class="list-inline-item"><code class="notranslate">gea</code></li>
<li class="list-inline-item"><code class="notranslate">genting</code></li>
<li class="list-inline-item"><code class="notranslate">ให้</code></li>
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
<li class="list-inline-item"><code class="notranslate">เกรนเจอร์</code></li>
<li class="list-inline-item"><code class="notranslate">การ์เดียน</code></li>
<li class="list-inline-item"><code class="notranslate">กุชชี่</code></li>
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
<li class="list-inline-item"><code class="notranslate">IBM</code></li>
<li class="list-inline-item"><code class="notranslate">IEEE</code></li>
<li class="list-inline-item"><code class="notranslate">ifm</code></li>
<li class="list-inline-item"><code class="notranslate">ikano</code></li>
<li class="list-inline-item"><code class="notranslate">IMDB</code></li>
<li class="list-inline-item"><code class="notranslate">Infiniti</code></li>
<li class="list-inline-item"><code class="notranslate">Intel</code></li>
<li class="list-inline-item"><code class="notranslate">Intuit</code></li>
<li class="list-inline-item"><code class="notranslate">IPIRANGA</code></li>
<li class="list-inline-item"><code class="notranslate">เลือก</code></li>
<li class="list-inline-item"><code class="notranslate">itau</code></li>
<li class="list-inline-item"><code class="notranslate">itv</code></li>
<li class="list-inline-item"><code class="notranslate">iveco</code></li>
<li class="list-inline-item"><code class="notranslate">jaguar</code></li>
<li class="list-inline-item"><code class="notranslate">java</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code class="notranslate">jcp</code></li>
<li class="list-inline-item"><code class="notranslate">รถจี๊ป</code></li>
<li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
<li class="list-inline-item"><code class="notranslate">จูนิเปอร์</code></li>
<li class="list-inline-item"><code class="notranslate">kddi</code></li>
<li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
<li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
<li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
<li class="list-inline-item"><code class="notranslate">kfh</code></li>
<li class="list-inline-item"><code class="notranslate">เกีย</code></li>
<li class="list-inline-item"><code class="notranslate">คินเดอร์</code></li>
<li class="list-inline-item"><code class="notranslate">คินเดิล</code></li>
<li class="list-inline-item"><code class="notranslate">โคมัตสึ</code></li>
<li class="list-inline-item"><code class="notranslate">เคพีเอ็มจี</code></li>
<li class="list-inline-item"><code class="notranslate">เคร็ด</code></li>
<li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
<li class="list-inline-item"><code class="notranslate">ลาไคซ่า</code></li>
<li class="list-inline-item"><code class="notranslate">แลดโบร๊กส์</code></li>
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
<li class="list-inline-item"><code class="notranslate">ไลฟ์สไตล์</code></li>
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
<li class="list-inline-item"><code class="notranslate">ลูปิน</code></li>
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
<li class="list-inline-item"><code class="notranslate">มอร์มอน</code></li>
<li class="list-inline-item"><code class="notranslate">moto</code></li>
<li class="list-inline-item"><code class="notranslate">movistar</code></li>
<li class="list-inline-item"><code class="notranslate">msd</code></li>
<li class="list-inline-item"><code class="notranslate">mtn</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">mutual</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">nationwide</code></li>
<li class="list-inline-item"><code class="notranslate">ธรรมชาติ</code></ li>
<li class="list-inline-item"><code class="notranslate">nba</code></li>
<li class="list-inline-item"><code class="notranslate">nec</code></li>
<li class="list-inline-item"><code class="notranslate">netflix</code></li>
<li class="list-inline-item"><code class="notranslate">neustar</code></li>
<li class="list-inline-item"><code class="notranslate">newholland</code></li>
<li class="list-inline-item"><code class="notranslate">nfl</code></li>
<li class="list-inline-item"><code class="notranslate">nhk</code></li>
<li class="list-inline-item"><code class="notranslate">nico</code></li>
<li class="list-inline-item"><code class="notranslate">ไนกี้</code></li>
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
<li class="list-inline-item"><code class="notranslate">play</code></li>
<li class="list-inline-item"><code class="notranslate">pohl</code></li>
<li class="list-inline-item"><code class="notranslate">politie</code></li>
<li class="list-inline-item"><code class="notranslate">praxi</code></li>
<li class="list-inline-item"><code class="notranslate">prod</code></li>
<li class="list-inline-item"><code class="notranslate">progressive</code></li>
<li class="list-inline-item"><code class="notranslate">pru</code></li>
<li class="list-inline-item"><code class="notranslate">prudential</code></li>
<li class="list-inline-item"><code class="notranslate">pwc</code></li>
<!--<li class="list-inline-item"><code class="notranslate">เควส</code></li>-->
<li class="list-inline-item"><code class="notranslate">qvc</code></li>
<li class="list-inline-item"><code class="notranslate">เรดสโตน</code></li>
<li class="list-inline-item"><code class="notranslate">reliance</code></li>
<li class="list-inline-item"><code class="notranslate">rexroth</code></li>
<li class="list-inline-item"><code class="notranslate">ricoh</code></li>
<li class="list-inline-item"><code class="notranslate">rmit</code></li>
<li class="list-inline-item"><code class="notranslate">rocher</code></li>
<li class="list-inline-item"><code class="notranslate">rogers</code></li>
<li class="list-inline-item"><code class="notranslate">rwe</code></li>
<li class="list-inline-item"><code class="notranslate">ความปลอดภัย</code></li>
<li class="list-inline-item"><code class="notranslate">ซากุระ</code></li>
<li class="list-inline-item"><code class="notranslate">ซัมซุง</code></li>
<li class="list-inline-item"><code class="notranslate">แซนด์วิค</code></li>
<li class="list-inline-item"><code class="notranslate">แซนด์วิคโคโรม้อนท์</code></li>
<li class="list-inline-item"><code class="notranslate">ซาโนฟี่</code></li>
<li class="list-inline-item"><code class="notranslate">แซป</code></li>
<li class="list-inline-item"><code class="notranslate">แซป</code></li>
<li class="list-inline-item"><code class="notranslate">แซกโซ</code></li>
<li class="list-inline-item"><code class="notranslate">sbi</code></li>
<!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
<li class="list-inline-item"><code class="notranslate">sca</code></li>
<li class="list-inline-item"><code class="notranslate">scb</code></li>
<li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
<li class="list-inline-item"><code class="notranslate">schmidt</code></li>
<li class="list-inline-item"><code class="notranslate">schwarz</code></li>
<li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><code class="notranslate">scor</code></li>
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
<li class="list-inline-item"><code class="notranslate">สมาร์ท</code></li>
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
<li class="list-inline-item"><code class="notranslate">ตัวอย่าง</code></li>
<li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
<li class="list-inline-item"><code class="notranslate">symantec</code></li>
<li class="list-inline-item"><code class="notranslate">taobao</code></li>
<li class="list-inline-item"><code class="notranslate">target</code></li>
<li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
<li class="list-inline-item"><code class="notranslate">tdk</code></li>
<li class="list-inline-item"><code class="notranslate">telecity</code></li>
<li class="list-inline-item"><code class="notranslate">telefonica</code></li>
<li class="list-inline-item"><code class="notranslate">เทมาเส็ก</code></li>
<li class="list-inline-item"><code class="notranslate">เทวา</code></li>
<li class="list-inline-item"><code class="notranslate">ทิฟฟานี่</code></li>
<li class="list-inline-item"><code class="notranslate">tjx</code></li>
<li class="list-inline-item"><code class="notranslate">toray</code></li>
<li class="list-inline-item"><code class="notranslate">toshiba</code></li>
<li class="list-inline-item"><code class="notranslate">รวม</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">นักเดินทาง</code></li>
<li class="list-inline-item"><code class="notranslate">tui</code></li>
<li class="list-inline-item"><code class="notranslate">ทีวี</code></li>
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
<li class="list-inline-item"><code class="notranslate">วอลโว่</code></li>
<li class="list-inline-item"><code class="notranslate">วอลมาร์ท</code></li>
<li class="list-inline-item"><code class="notranslate">วอลเตอร์</code></li>
<li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
<li class="list-inline-item"><code class="notranslate">เวเบอร์</code></li>
<li class="list-inline-item"><code class="notranslate">เวียร์</code></li>
<li class="list-inline-item"><code class="notranslate">วิลเลียมฮิลล์</code></li>
<li class="list-inline-item"><code class="notranslate">วินโดวส์</code></li>
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

ณ วันที่ 18 มีนาคม 2025 เรายังได้เพิ่มดินแดนโพ้นทะเลของฝรั่งเศสเหล่านี้ลงในรายการนี้ด้วย ([ตามคำขอ GitHub นี้](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

ณ วันที่ 8 กรกฎาคม 2025 เราได้เพิ่มประเทศเฉพาะยุโรปดังต่อไปนี้:

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

เราไม่ได้รวม `cz`, `ru` และ `ua` โดยเฉพาะเนื่องจากมีกิจกรรมสแปมจำนวนมาก

### เกณฑ์รายการอนุญาตของคุณคืออะไร {#what-is-your-allowlist-criteria}

เรามีรายการคงที่ของ [ส่วนขยายชื่อโดเมนที่อนุญาตตามค่าเริ่มต้น](#what-domain-name-extensions-are-allowlisted-by-default) และเรายังรักษารายการอนุญาตแบบไดนามิกที่แคชและหมุนเวียนตามเกณฑ์ที่เข้มงวดต่อไปนี้:

* โดเมนรากของผู้ส่งต้องอยู่ในรูปแบบ [ส่วนขยายชื่อโดเมนที่ตรงกับรายการที่เราเสนอในแผนฟรีของเรา](#what-domain-name-extensions-can-be-used-for-free) (โดยเพิ่ม `biz` และ `info`) เรายังรวม `edu`, `gov` และ `mil` ที่ตรงกันบางส่วน เช่น `xyz.gov.au` และ `xyz.edu.au`
* โดเมนรากของผู้ส่งต้องอยู่ในผลลัพธ์ที่แยกวิเคราะห์จากโดเมนรากที่ไม่ซ้ำกัน 100,000 อันดับแรกจาก [รายชื่อความนิยมของร่ม](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL")
* โดเมนรากของผู้ส่งต้องอยู่ในผลลัพธ์ 50,000 อันดับแรกจากโดเมนรากที่ไม่ซ้ำกันที่ปรากฏอย่างน้อย 4 ใน 7 วันที่ผ่านมาของ UPL (ประมาณ 50%+)
* โดเมนรากของผู้ส่งต้องไม่ใช่ [จัดหมวดหมู่](https://radar.cloudflare.com/categorization-feedback/) เนื่องจากมีเนื้อหาสำหรับผู้ใหญ่หรือมัลแวร์จาก Cloudflare
* โดเมนรากของผู้ส่งต้องมีระเบียน A หรือ MX ที่ตั้งค่าไว้
* โดเมนรากของผู้ส่งต้องมีระเบียน A, ระเบียน MX, ระเบียน DMARC ที่มี `biz`0 หรือ `biz`1 หรือระเบียน SPF ที่มีตัวระบุ `biz`2 หรือ `biz`3

หากตรงตามเกณฑ์นี้ โดเมนรากของผู้ส่งจะถูกแคชไว้เป็นเวลา 7 วัน โปรดทราบว่างานอัตโนมัติของเราทำงานทุกวัน ดังนั้นนี่จึงเป็นแคชรายการอนุญาตแบบโรลลิ่งที่อัปเดตทุกวัน

งานอัตโนมัติของเราจะดาวน์โหลด UPL ในหน่วยความจำ 7 วันก่อนหน้า แตกไฟล์ และวิเคราะห์ในหน่วยความจำตามเกณฑ์ที่เข้มงวดข้างต้น

โดเมนยอดนิยมในขณะที่เขียนนี้ เช่น Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify และอื่นๆ อีกมากมาย – รวมอยู่ในนั้นด้วยแน่นอน

หากคุณเป็นผู้ส่งที่ไม่อยู่ในรายการอนุญาตของเรา ในครั้งแรกที่โดเมนรูท FQDN หรือที่อยู่ IP ของคุณส่งอีเมล คุณจะอยู่ในสถานะ [อัตราจำกัด](#do-you-have-rate-limiting) และ [อยู่ในบัญชีเทา](#do-you-have-a-greylist) โปรดทราบว่านี่เป็นแนวปฏิบัติมาตรฐานที่ใช้เป็นมาตรฐานอีเมล ไคลเอ็นต์เซิร์ฟเวอร์อีเมลส่วนใหญ่จะพยายามส่งซ้ำหากได้รับข้อผิดพลาดเกี่ยวกับขีดจำกัดอัตราหรือรายการสีเทา (เช่น รหัสสถานะข้อผิดพลาดระดับ 421 หรือ 4xx)

**โปรดทราบว่าผู้ส่งเฉพาะ เช่น `a@gmail.com`, `b@xyz.edu` และ `c@gov.au` ยังสามารถเป็น [ถูกปฏิเสธ](#do-you-have-a-denylist) ได้** (เช่น หากเราตรวจจับสแปม ฟิชชิ่ง หรือมัลแวร์จากผู้ส่งเหล่านั้นโดยอัตโนมัติ)

### นามสกุลโดเมนใดที่สามารถใช้งานได้ฟรี {#what-domain-name-extensions-can-be-used-for-free}

ณ วันที่ 31 มีนาคม 2023 เราได้บังคับใช้กฎการป้องกันสแปมแบบครอบคลุมใหม่เพื่อปกป้องผู้ใช้และบริการของเรา

กฎใหม่นี้อนุญาตให้ใช้เฉพาะนามสกุลโดเมนต่อไปนี้เท่านั้นในแผนฟรีของเรา:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">โฆษณา</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">แอป</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">ที่</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">เป็น</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">โดย</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
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
<li class="list-inline-item"><code class="notranslate">ครอบครัว</code></li>
<li class="list-inline-item"><code class="notranslate">fi</code></li>
<li class="list-inline-item"><code class="notranslate">fm</code></li>
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">ie</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">in</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">คือ</code></li>
<li class="list-inline-item"><code class="notranslate">มัน</code></li>
<li class="list-inline-item"><code class="notranslate">ฉัน</code></li>
<li class="list-inline-item"><code class="notranslate">jp</code></li>
<li class="list-inline-item"><code class="notranslate">ke</code></li>
<li class="list-inline-item"><code class="notranslate">kr</code></li>
<li class="list-inline-item"><code class="notranslate">la</code></li>
<li class="list-inline-item"><code class="notranslate">li</code></li>
<li class="list-inline-item"><code class="notranslate">lv</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">no</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">ถึง</code></li>
<li class="list-inline-item"><code class="notranslate">ทีวี</code></li>
<li class="list-inline-item"><code class="notranslate">สหราชอาณาจักร</code></li>
<li class="list-inline-item"><code class="notranslate">สหรัฐอเมริกา</code></li>
<li class="list-inline-item"><code class="notranslate">อุซ</code></li>
<li class="list-inline-item"><code class="notranslate">vc</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### คุณมีรายการสีเทา {#do-you-have-a-greylist} หรือไม่

ใช่ เราใช้นโยบาย [อีเมลรายการสีเทา](https://en.wikipedia.org/wiki/Greylisting_\(email\)) ที่ผ่อนปรนมาก Greylisting มีผลเฉพาะกับผู้ส่งที่ไม่อยู่ในรายการอนุญาตของเราเท่านั้น และจะอยู่ในแคชของเราเป็นเวลา 30 วัน

สำหรับผู้ส่งรายใหม่ เราจะจัดเก็บคีย์ไว้ในฐานข้อมูล Redis ของเราเป็นเวลา 30 วัน โดยกำหนดค่าตามเวลาที่อีเมลมาถึงเริ่มต้นของคำขอแรก จากนั้นเราจะปฏิเสธอีเมลของพวกเขาด้วยรหัสสถานะการลองส่งใหม่เป็น 450 และอนุญาตให้ส่งได้หลังจากผ่านไป 5 นาทีเท่านั้น

หากพวกเขาได้รอสำเร็จเป็นเวลา 5 นาทีจากเวลาที่มาถึงเริ่มต้นนี้ อีเมลของพวกเขาจะได้รับการยอมรับและพวกเขาจะไม่ได้รับรหัสสถานะ 450 นี้

คีย์ประกอบด้วยโดเมนราก FQDN หรือที่อยู่ IP ของผู้ส่ง ซึ่งหมายความว่าโดเมนย่อยใดๆ ที่ผ่านรายการเกรย์ลิสต์ก็จะผ่านสำหรับโดเมนรากเช่นกัน และในทางกลับกัน (นี่คือสิ่งที่เราหมายถึงนโยบายที่ "หละหลวมมาก")

ตัวอย่างเช่น หากอีเมลมาจาก `test.example.com` ก่อนที่เราจะเห็นอีเมลมาจาก `example.com` อีเมลใดๆ จาก `test.example.com` และ/หรือ `example.com` จะต้องรอ 5 นาทีนับจากเวลาที่การเชื่อมต่อเริ่มต้นมาถึง เราไม่ได้กำหนดให้ทั้ง `test.example.com` และ `example.com` ต้องรอ 5 นาทีเป็นของตัวเอง (นโยบาย greylisting ของเรามีผลบังคับใช้ที่ระดับโดเมนราก)

โปรดทราบว่าการอยู่ในรายการสีเทาจะไม่มีผลกับผู้ส่งใดๆ ใน [รายการที่อนุญาต](#do-you-have-an-allowlist) ของเรา (เช่น Meta, Amazon, Netflix, Google, Microsoft ในขณะที่เขียนข้อความนี้)

### คุณมีรายการปฏิเสธ {#do-you-have-a-denylist} หรือไม่

ใช่ เราใช้งานรายการปฏิเสธของเราเองและอัปเดตโดยอัตโนมัติแบบเรียลไทม์และด้วยตนเองโดยอิงจากสแปมและกิจกรรมที่เป็นอันตรายที่ตรวจพบ

นอกจากนี้ เรายังดึงที่อยู่ IP ทั้งหมดจากรายการปฏิเสธ UCEPROTECT ระดับ 1 ที่ <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> ทุกชั่วโมง และป้อนข้อมูลดังกล่าวลงในรายการปฏิเสธของเรา โดยจะหมดอายุภายใน 7 วัน

ผู้ส่งที่พบในรายการปฏิเสธจะได้รับรหัสข้อผิดพลาด 421 (ระบุให้ผู้ส่งลองใหม่อีกครั้งในภายหลัง) หากเป็น [ไม่อยู่ในรายชื่ออนุญาต](#do-you-have-an-allowlist)

การใช้รหัสสถานะ 421 แทนรหัสสถานะ 554 จะทำให้สามารถบรรเทาผลบวกปลอมที่อาจเกิดขึ้นได้แบบเรียลไทม์ จากนั้นจึงส่งข้อความได้สำเร็จในการลองครั้งต่อไป

**วิธีนี้ได้รับการออกแบบมาแตกต่างจากบริการอีเมลอื่นๆ** ที่หากคุณถูกบล็อก จะเกิดข้อผิดพลาดถาวรและร้ายแรงขึ้น บ่อยครั้งการขอให้ผู้ส่งลองส่งอีเมลใหม่อีกครั้ง (โดยเฉพาะจากองค์กรขนาดใหญ่) เป็นเรื่องยาก ดังนั้น วิธีนี้จึงทำให้มีเวลาประมาณ 5 วันนับจากวันที่ส่งอีเมลครั้งแรก ทั้งผู้ส่ง ผู้รับ หรือเรา เข้ามาช่วยเหลือและแก้ไขปัญหา (โดยการขอให้ลบรายการปฏิเสธ)

คำขอลบรายการที่ปฏิเสธทั้งหมดจะได้รับการตรวจสอบแบบเรียลไทม์โดยผู้ดูแลระบบ (เช่น เพื่อให้รายการบวกปลอมที่เกิดซ้ำสามารถอยู่ในรายการอนุญาตโดยถาวรโดยผู้ดูแลระบบได้)

สามารถร้องขอการลบรายการที่ปฏิเสธได้ที่ <https://forwardemail.net/denylist>. ผู้ใช้ที่ชำระเงินจะได้รับการดำเนินการคำขอการลบรายการที่ปฏิเสธทันที ในขณะที่ผู้ใช้ที่ไม่ชำระเงินจะต้องรอให้ผู้ดูแลระบบดำเนินการคำขอของตน

ผู้ส่งที่ถูกตรวจพบว่าส่งเนื้อหาสแปมหรือไวรัสจะถูกเพิ่มลงในรายการปฏิเสธโดยใช้วิธีการต่อไปนี้:

1. [ลายนิ้วมือข้อความเริ่มต้น](#how-do-you-determine-an-email-fingerprint) จะถูกจัดอยู่ในรายการสีเทาเมื่อตรวจพบสแปมหรือรายการบล็อกจากผู้ส่งที่ "เชื่อถือได้" (เช่น `gmail.com`, `microsoft.com`, `apple.com`)
* หากผู้ส่งอยู่ในรายการอนุญาต ข้อความจะอยู่ในรายการสีเทาเป็นเวลา 1 ชั่วโมง
* หากผู้ส่งไม่อยู่ในรายการอนุญาต ข้อความจะอยู่ในรายการสีเทาเป็นเวลา 6 ชั่วโมง
2. เราแยกคีย์รายการปฏิเสธจากข้อมูลจากผู้ส่งและข้อความ และสำหรับแต่ละคีย์เหล่านี้ เราจะสร้างตัวนับ (หากยังไม่มี) เพิ่มค่าขึ้นทีละ 1 และแคชไว้เป็นเวลา 24 ชั่วโมง
* สำหรับผู้ส่งที่อยู่ในรายการอนุญาต:
* เพิ่มคีย์สำหรับที่อยู่อีเมล "MAIL FROM" ในซองจดหมาย หากมี SPF ที่ผ่านหรือไม่มี SPF และไม่ใช่ [ชื่อผู้ใช้ postmaster](#what-are-postmaster-addresses) หรือ [ชื่อผู้ใช้ที่ไม่ต้องตอบกลับ](#what-are-no-reply-addresses)
* หากส่วนหัว "จาก" อยู่ในรายการที่อนุญาต ให้เพิ่มคีย์สำหรับที่อยู่อีเมลส่วนหัว "จาก" หากผ่าน SPF หรือผ่านและจัดแนว DKIM
* หากส่วนหัว "จาก" ไม่อยู่ในรายการที่อนุญาต ให้เพิ่มคีย์สำหรับที่อยู่อีเมลส่วนหัว "จาก" และชื่อโดเมนรากที่วิเคราะห์แล้ว
* สำหรับผู้ส่งที่ไม่อยู่ในรายการที่อนุญาต:
* เพิ่มคีย์สำหรับที่อยู่อีเมล "MAIL FROM" ในซองจดหมาย หากผ่าน SPF
* หากส่วนหัว "จาก" อยู่ในรายการที่อนุญาต ให้เพิ่มคีย์สำหรับที่อยู่อีเมลส่วนหัว "จาก" หากผ่าน SPF หรือผ่านและจัดแนว DKIM
* หากส่วนหัว "จาก" ไม่อยู่ในรายการที่อนุญาต ให้เพิ่มคีย์สำหรับที่อยู่อีเมลส่วนหัว "จาก" และชื่อโดเมนรากที่วิเคราะห์แล้ว
* เพิ่มคีย์สำหรับที่อยู่ IP ระยะไกลของผู้ส่ง
* เพิ่มคีย์สำหรับชื่อโฮสต์ที่แก้ไขโดยไคลเอนต์โดยการค้นหาแบบย้อนกลับจากที่อยู่ IP ของผู้ส่ง (ถ้ามี)
* เพิ่มคีย์สำหรับโดเมนรากของชื่อโฮสต์ที่แก้ไขแล้วของไคลเอนต์ (ถ้ามี และหากแตกต่างจากชื่อโฮสต์ที่แก้ไขแล้วของไคลเอนต์)
3. หากตัวนับถึง 5 สำหรับผู้ส่งและคีย์ที่ไม่ได้อยู่ในรายการอนุญาต เราจะปฏิเสธคีย์นั้นเป็นเวลา 30 วัน และจะส่งอีเมลไปยังทีมตรวจสอบการละเมิดของเรา ตัวเลขเหล่านี้อาจมีการเปลี่ยนแปลง และจะมีการอัปเดตที่นี่เมื่อเราตรวจสอบการละเมิด
4. หากตัวนับถึง 10 สำหรับผู้ส่งและคีย์ที่ไม่ได้อยู่ในรายการอนุญาต เราจะปฏิเสธคีย์นั้นเป็นเวลา 7 วัน และจะส่งอีเมลไปยังทีมตรวจสอบการละเมิดของเรา ตัวเลขเหล่านี้อาจมีการเปลี่ยนแปลง และจะมีการอัปเดตที่นี่เมื่อเราตรวจสอบการละเมิด

> **หมายเหตุ:** ในอนาคตอันใกล้นี้ เราจะนำระบบตรวจสอบชื่อเสียงมาใช้ ระบบจะคำนวณเวลาที่ควรปฏิเสธผู้ส่ง โดยพิจารณาจากเกณฑ์เปอร์เซ็นต์ (ต่างจากตัวนับแบบพื้นฐานดังที่กล่าวไว้ข้างต้น)

### คุณมีอัตราจำกัด {#do-you-have-rate-limiting} หรือไม่

การจำกัดอัตราผู้ส่งทำได้โดยการแยกวิเคราะห์โดเมนรากจากการค้นหา PTR แบบย้อนกลับบนที่อยู่ IP ของผู้ส่ง หรือหากไม่พบผลลัพธ์ ระบบจะใช้ที่อยู่ IP ของผู้ส่งแทน โปรดทราบว่าเราจะเรียกสิ่งนี้ว่า `Sender` ด้านล่าง

เซิร์ฟเวอร์ MX ของเรามีขีดจำกัดรายวันสำหรับอีเมลขาเข้าที่ได้รับสำหรับ [ที่เก็บข้อมูล IMAP ที่เข้ารหัส](/blog/docs/best-quantum-safe-encrypted-email-service):

* แทนที่จะจำกัดอัตราอีเมลขาเข้าที่ได้รับตามนามแฝงแต่ละรายการ (เช่น `you@yourdomain.com`) เราจะจำกัดอัตราตามชื่อโดเมนของนามแฝงนั้นเอง (เช่น `yourdomain.com`) วิธีนี้จะช่วยป้องกันไม่ให้ `Senders` ล้นกล่องจดหมายของนามแฝงทั้งหมดในโดเมนของคุณพร้อมกัน
* เรามีข้อจำกัดทั่วไปที่ใช้กับ `Senders` ทั้งหมดในบริการของเรา โดยไม่คำนึงถึงผู้รับ:
* `Senders` ที่เราพิจารณาว่า "เชื่อถือได้" ในฐานะแหล่งที่มาของข้อมูลจริง (เช่น `gmail.com`, `microsoft.com`, `apple.com`) จำกัดการส่งไว้ที่ 100 GB ต่อวัน
* `Senders` ที่เป็น [อยู่ในรายชื่อที่อนุญาต](#do-you-have-an-allowlist) จำกัดการส่งไม่เกิน 10 GB ต่อวัน
* `yourdomain.com`0 อื่นๆ ทั้งหมด จำกัดการส่งไม่เกิน 1 GB และ/หรือ 1,000 ข้อความต่อวัน
* เรามีขีดจำกัดเฉพาะสำหรับ `yourdomain.com`1 และ `yourdomain.com`2 ที่ 1 GB และ/หรือ 1,000 ข้อความต่อวัน

เซิร์ฟเวอร์ MX ยังจำกัดข้อความที่จะส่งต่อไปยังผู้รับหนึ่งรายหรือมากกว่านั้นผ่านการจำกัดอัตรา – แต่สิ่งนี้ใช้ได้เฉพาะกับ `Senders` เท่านั้น ไม่ใช่กับ [รายการที่อนุญาต](#do-you-have-an-allowlist):

* เราอนุญาตให้เชื่อมต่อได้สูงสุด 100 ครั้งต่อชั่วโมง ต่อโดเมนรูท FQDN ที่ได้รับการแก้ไข `Sender` (หรือ) ที่อยู่ IP ระยะไกล `Sender` (หากไม่มี PTR ย้อนกลับ) และต่อผู้รับซองจดหมายถึง เราจัดเก็บคีย์สำหรับการจำกัดอัตราเป็นแฮชการเข้ารหัสในฐานข้อมูล Redis ของเรา

* หากคุณกำลังส่งอีเมลผ่านระบบของเรา โปรดตรวจสอบให้แน่ใจว่าคุณได้ตั้งค่า PTR ย้อนกลับสำหรับที่อยู่ IP ทั้งหมดของคุณแล้ว (มิฉะนั้น โดเมนรูท FQDN ที่ไม่ซ้ำกันหรือที่อยู่ IP ที่คุณส่งออกมาจะถูกจำกัดอัตรา)

* โปรดทราบว่าหากคุณส่งผ่านระบบยอดนิยม เช่น Amazon SES คุณจะไม่ถูกจำกัดอัตรา เนื่องจาก (ในขณะที่เขียนนี้) Amazon SES อยู่ในรายชื่อที่อนุญาตของเรา

* หากคุณส่งจากโดเมน เช่น `test.abc.123.example.com` ขีดจำกัดอัตราจะถูกกำหนดไว้ที่ `example.com` ผู้ส่งสแปมจำนวนมากใช้โดเมนย่อยหลายร้อยโดเมนเพื่อหลีกเลี่ยงตัวกรองสแปมทั่วไปที่จำกัดอัตราเฉพาะชื่อโฮสต์ที่ไม่ซ้ำกัน แทนที่จะจำกัดเฉพาะโดเมนรูท FQDN ที่ไม่ซ้ำกัน

* `Senders` ที่เกินขีดจำกัดอัตราจะถูกปฏิเสธด้วยข้อผิดพลาด 421

เซิร์ฟเวอร์ IMAP และ SMTP ของเราจำกัดนามแฝงของคุณจากการมีการเชื่อมต่อพร้อมกันมากกว่า `60` ครั้ง

เซิร์ฟเวอร์ MX ของเราจำกัดผู้ส่ง [ไม่ได้อยู่ในรายการอนุญาต](#do-you-have-an-allowlist) จากการสร้างการเชื่อมต่อพร้อมกันมากกว่า 10 ครั้ง (โดยมีระยะเวลาหมดอายุแคช 3 นาทีสำหรับตัวนับ ซึ่งสะท้อนถึงเวลาหมดเวลาของซ็อกเก็ตของเราที่ 3 นาที)

### คุณจะป้องกันการกระจายกลับ {#how-do-you-protect-against-backscatter} ได้อย่างไร

การตีกลับที่ส่งผิดทางหรือสแปม (เรียกว่า "[การกระเจิงกลับ](https://en.wikipedia.org/wiki/Backscatter_\(email\))") อาจทำให้ที่อยู่ IP ของผู้ส่งได้รับชื่อเสียงในทางลบ

เราใช้สองขั้นตอนเพื่อป้องกันการกระเจิงกลับ ซึ่งมีรายละเอียดอยู่ในส่วน [ป้องกันการตีกลับจากผู้ส่งสแปมที่รู้จัก](#prevent-bounces-from-known-mail-from-spammers) และ [ป้องกันการตีกลับที่ไม่จำเป็นเพื่อป้องกันการกระเจิงกลับ](#prevent-unnecessary-bounces-to-protect-against-backscatter) ด้านล่าง

### ป้องกันการตีกลับจากผู้ส่งสแปม MAIL FROM ที่รู้จัก {#prevent-bounces-from-known-mail-from-spammers}

เราดึงรายการจาก [Backscatter.org](https://www.backscatterer.org/) (ขับเคลื่อนโดย [UCEPROTECT](https://www.uceprotect.net/)) ที่ <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> ทุก ๆ ชั่วโมง และป้อนข้อมูลเหล่านี้ลงในฐานข้อมูล Redis ของเรา (เราเปรียบเทียบความแตกต่างล่วงหน้าด้วย ในกรณีที่มีการลบ IP ใด ๆ ที่ต้องได้รับความเคารพ)

หาก MAIL FROM ว่างเปล่าหรือเท่ากับ (ไม่คำนึงถึงตัวพิมพ์เล็กหรือใหญ่) ใดๆ ใน [ที่อยู่ของผู้ดูแลไปรษณีย์](#what-are-postmaster-addresses) (ส่วนก่อน @ ในอีเมล) จากนั้นเราจะตรวจสอบเพื่อดูว่า IP ของผู้ส่งตรงกับหนึ่งในรายการนี้หรือไม่

หาก IP ของผู้ส่งอยู่ในรายการ (และไม่อยู่ใน [รายการที่อนุญาต](#do-you-have-an-allowlist) ของเรา) เราจะส่งข้อผิดพลาด 554 พร้อมข้อความ `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}` เราจะได้รับการแจ้งเตือนหากผู้ส่งอยู่ในทั้งรายการ Backscatterer และรายการอนุญาตของเรา เพื่อที่เราจะสามารถแก้ไขปัญหาได้หากจำเป็น

เทคนิคที่อธิบายไว้ในส่วนนี้ปฏิบัติตามคำแนะนำ "โหมดปลอดภัย" ที่ <https://www.backscatterer.org/?target=usage> – โดยที่เราจะตรวจสอบ IP ของผู้ส่งเฉพาะในกรณีที่ตรงตามเงื่อนไขบางประการแล้วเท่านั้น

### ป้องกันการตีกลับที่ไม่จำเป็นเพื่อป้องกันการกระเจิงกลับ {#prevent-unnecessary-bounces-to-protect-against-backscatter}

อีเมลตีกลับคืออีเมลที่ระบุว่าการส่งต่ออีเมลไปยังผู้รับล้มเหลวโดยสิ้นเชิง และจะไม่ส่งอีเมลซ้ำอีก

เหตุผลทั่วไปที่ทำให้ปรากฏอยู่ในรายชื่อ Backscatterer คือการตีกลับที่ส่งผิดทิศทางหรือสแปม ดังนั้นเราต้องป้องกันสิ่งนี้ด้วยวิธีการบางประการ:

1. เราจะส่งอีเมลเฉพาะเมื่อเกิดข้อผิดพลาดรหัสสถานะมากกว่าหรือเท่ากับ 500 (เมื่ออีเมลที่พยายามส่งต่อล้มเหลว เช่น Gmail ตอบกลับด้วยข้อผิดพลาดระดับ 500)

2. เราส่งเพียงครั้งเดียวเท่านั้น (เราใช้คีย์ลายนิ้วมือการตีกลับที่คำนวณแล้วและเก็บไว้ในแคชเพื่อป้องกันการส่งข้อความซ้ำ) ลายนิ้วมือการตีกลับคือคีย์ที่ประกอบด้วยลายนิ้วมือของข้อความรวมกับแฮชของที่อยู่การตีกลับและรหัสข้อผิดพลาด ดูส่วน [การพิมพ์ลายนิ้วมือ](#how-do-you-determine-an-email-fingerprint) สำหรับข้อมูลเชิงลึกเพิ่มเติมเกี่ยวกับวิธีการคำนวณลายนิ้วมือข้อความ ลายนิ้วมือการตีกลับที่ส่งสำเร็จจะหมดอายุหลังจาก 7 วันในแคช Redis ของเรา

3. เราจะส่งเฉพาะเมื่อ MAIL FROM และ/หรือ From ไม่ว่างเปล่า และไม่มี [ชื่อผู้ใช้ postmaster](#what-are-postmaster-addresses) (ส่วนที่อยู่ก่อน @ ในอีเมล) (ไม่คำนึงถึงตัวพิมพ์เล็กหรือใหญ่)

4. เราจะไม่ส่งหากข้อความต้นฉบับมีส่วนหัวใด ๆ ต่อไปนี้ (ไม่คำนึงถึงตัวพิมพ์เล็กหรือใหญ่):

* ส่วนหัวของ `auto-submitted` มีค่าไม่เท่ากับ `no`
* ส่วนหัวของ `x-auto-response-suppress` มีค่าเป็น `dr`, `autoreply`, `auto-reply`, `auto_reply` หรือ `all`
* ส่วนหัวของ `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 หรือ `no`7 (โดยไม่คำนึงถึงค่า)
* ส่วนหัวของ `no`8 มีค่าเป็น `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 หรือ `x-auto-response-suppress`3

5. เราจะไม่ส่งหากที่อยู่อีเมล MAIL FROM หรือ From ลงท้ายด้วย `+donotreply`, `-donotreply`, `+noreply` หรือ `-noreply`

6. เราจะไม่ส่งข้อมูลหากส่วนชื่อผู้ใช้ที่อยู่อีเมลจากเป็น `mdaemon` และมีส่วนหัวที่ไม่คำนึงถึงตัวพิมพ์เล็กและใหญ่เป็น `X-MDDSN-Message`

7. เราจะไม่ส่งหากมีส่วนหัว `content-type` ที่ไม่คำนึงถึงตัวพิมพ์เล็กและใหญ่ของ `multipart/report`

### คุณจะกำหนดลายนิ้วมืออีเมล {#how-do-you-determine-an-email-fingerprint} ได้อย่างไร

ลายนิ้วมือของอีเมลใช้เพื่อกำหนดความเฉพาะตัวของอีเมลและเพื่อป้องกันไม่ให้มีการส่งข้อความซ้ำซ้อนและส่ง [การตีกลับซ้ำ](#prevent-unnecessary-bounces-to-protect-against-backscatter)

ลายนิ้วมือจะคำนวณจากรายการต่อไปนี้:

* ชื่อโฮสต์ FQDN หรือที่อยู่ IP ที่แก้ไขโดยไคลเอนต์
* ค่าส่วนหัว `Message-ID` (ถ้ามี)
* ค่าส่วนหัว `Date` (ถ้ามี)
* ค่าส่วนหัว `From` (ถ้ามี)
* ค่าส่วนหัว `To` (ถ้ามี)
* ค่าส่วนหัว `Cc` (ถ้ามี)
* ค่าส่วนหัว `Subject` (ถ้ามี)
* ค่าส่วนหัว `Body` (ถ้ามี)

### ฉันสามารถส่งต่ออีเมลไปยังพอร์ตอื่นนอกเหนือจาก 25 ได้หรือไม่ (เช่น หาก ISP ของฉันบล็อกพอร์ต 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

ใช่ครับ/ค่ะ เราได้เพิ่มฟีเจอร์นี้ตั้งแต่วันที่ 5 พฤษภาคม 2020 เป็นต้นไป ขณะนี้ฟีเจอร์นี้เป็นฟีเจอร์เฉพาะโดเมน ไม่ใช่ฟีเจอร์เฉพาะนามแฝง หากคุณต้องการให้ฟีเจอร์นี้เฉพาะนามแฝง โปรดติดต่อเราเพื่อแจ้งความต้องการของคุณ

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
การปกป้องความเป็นส่วนตัวขั้นสูง:
</strong>
<span>
หากคุณใช้แพ็กเกจแบบชำระเงิน (ซึ่งมีการปกป้องความเป็นส่วนตัวขั้นสูง) โปรดไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> คลิกที่ "ตั้งค่า" ถัดจากโดเมนของคุณ จากนั้นคลิกที่ "การตั้งค่า" หากคุณต้องการเรียนรู้เพิ่มเติมเกี่ยวกับแพ็กเกจแบบชำระเงิน โปรดดูหน้า <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">ราคา</a> ของเรา หรือทำตามคำแนะนำด้านล่างต่อไป
</span>
</div>

หากคุณใช้แผนฟรี ให้เพียงเพิ่มระเบียน DNS <strong class="notranslate">TXT</strong> ใหม่ตามที่แสดงด้านล่าง แต่เปลี่ยนพอร์ตจาก 25 เป็นพอร์ตที่คุณเลือก

ตัวอย่างเช่น ถ้าฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `example.com` ส่งต่อไปยังพอร์ต SMTP ของผู้รับนามแฝง 1337 แทนที่จะเป็น 25:

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
สถานการณ์ที่พบบ่อยที่สุดสำหรับการตั้งค่าการส่งต่อพอร์ตแบบกำหนดเองคือเมื่อคุณต้องการส่งต่ออีเมลทั้งหมดที่ส่งไปยัง example.com ไปยังพอร์ตอื่นที่ example.com นอกเหนือจากมาตรฐาน SMTP ของพอร์ต 25 ในการตั้งค่านี้ เพียงเพิ่มระเบียน catch-all <strong class="notranslate">TXT</strong> ต่อไปนี้
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

### รองรับเครื่องหมายบวก + สำหรับนามแฝง Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases} หรือไม่

ใช่อย่างแน่นอน

### รองรับโดเมนย่อย {#does-it-support-sub-domains} หรือไม่

ใช่ แน่นอน แทนที่จะใช้ "@", "." หรือช่องว่างเป็นชื่อ/โฮสต์/นามแฝง คุณใช้ชื่อโดเมนย่อยเป็นค่าแทนก็ได้

หากคุณต้องการให้ `foo.example.com` ส่งต่ออีเมล ให้ป้อน `foo` เป็นค่าชื่อ/โฮสต์/นามแฝงในการตั้งค่า DNS ของคุณ (สำหรับทั้งระเบียน MX และ <strong class="notranslate">TXT</strong>)

### นี่จะส่งต่อส่วนหัวอีเมลของฉัน {#does-this-forward-my-emails-headers}

ใช่อย่างแน่นอน

### นี่คือ {#is-this-well-tested} ที่ผ่านการทดสอบอย่างดี

ใช่ มีการทดสอบที่เขียนด้วย [อาวา](https://github.com/avajs/ava) และยังครอบคลุมโค้ดด้วย

### คุณส่งข้อความตอบกลับ SMTP และรหัส {#do-you-pass-along-smtp-response-messages-and-codes}

ใช่ แน่นอน ตัวอย่างเช่น หากคุณกำลังส่งอีเมลไปยัง `hello@example.com` และอีเมลนั้นลงทะเบียนไว้เพื่อส่งต่อไปยัง `user@gmail.com` ข้อความตอบกลับ SMTP และรหัสจากเซิร์ฟเวอร์ SMTP "gmail.com" จะถูกส่งกลับแทนพร็อกซีเซิร์ฟเวอร์ที่ "mx1.forwardemail.net" หรือ "mx2.forwardemail.net"

### คุณจะป้องกันสแปมเมอร์และรับรองชื่อเสียงการส่งต่ออีเมลที่ดีได้อย่างไร {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

ดูส่วนต่างๆ ของเราเกี่ยวกับ [ระบบการส่งต่ออีเมลของคุณทำงานอย่างไร](#how-does-your-email-forwarding-system-work), [คุณจัดการกับปัญหาการส่งอีเมลอย่างไร](#how-do-you-handle-email-delivery-issues) และ [คุณจัดการกับที่อยู่ IP ของคุณที่ถูกบล็อกอย่างไร](#how-do-you-handle-your-ip-addresses-becoming-blocked) ด้านบน

### คุณดำเนินการค้นหา DNS บนชื่อโดเมน {#how-do-you-perform-dns-lookups-on-domain-names} ได้อย่างไร

เราได้สร้างโครงการซอฟต์แวร์โอเพนซอร์ส :tangerine: [ส้มแมนดาริน](https://github.com/forwardemail/tangerine) และใช้สำหรับการค้นหา DNS เซิร์ฟเวอร์ DNS เริ่มต้นที่ใช้คือ `1.1.1.1` และ `1.0.0.1` และการสอบถาม DNS จะดำเนินการผ่าน [DNS ผ่าน HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") ที่เลเยอร์แอปพลิเคชัน

:tangerine: [ส้มแมนดาริน](https://github.com/tangerine) ใช้ [บริการ DNS ของผู้บริโภคที่เน้นความเป็นส่วนตัวเป็นอันดับแรกของ CloudFlare ตามค่าเริ่มต้น][cloudflare-dns]

บัญชี ## และการเรียกเก็บเงิน {#account-and-billing}

### คุณเสนอการรับประกันคืนเงินสำหรับแผนแบบชำระเงินหรือไม่ {#do-you-offer-a-money-back-guarantee-on-paid-plans}

ใช่! การคืนเงินอัตโนมัติจะเกิดขึ้นเมื่อคุณอัปเกรด ดาวน์เกรด หรือยกเลิกบัญชีภายใน 30 วันนับจากวันที่แพ็กเกจของคุณเริ่มต้นใช้งานครั้งแรก เงื่อนไขนี้มีผลเฉพาะลูกค้าใหม่เท่านั้น

### หากฉันเปลี่ยนแผน คุณจะคิดอัตราส่วนและคืนเงินส่วนต่างหรือไม่ {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

เราไม่คิดอัตราส่วนหรือคืนเงินส่วนต่างเมื่อคุณเปลี่ยนแพ็กเกจ แต่เราจะแปลงระยะเวลาที่เหลือจากวันหมดอายุแพ็กเกจเดิมของคุณให้เป็นระยะเวลาที่ใกล้เคียงที่สุดสำหรับแพ็กเกจใหม่ของคุณ (ปัดเศษลงตามเดือน)

โปรดทราบว่าหากคุณอัปเกรดหรือดาวน์เกรดระหว่างแผนแบบชำระเงินภายในระยะเวลา 30 วันนับตั้งแต่เริ่มใช้แผนแบบชำระเงินครั้งแรก เราจะคืนเงินเต็มจำนวนจากแผนปัจจุบันของคุณโดยอัตโนมัติ

### ฉันสามารถใช้บริการส่งต่ออีเมลนี้เป็นเซิร์ฟเวอร์ MX แบบ "สำรอง" หรือ "สำรอง" ได้หรือไม่ {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

ไม่แนะนำให้ใช้วิธีนี้ เนื่องจากคุณสามารถใช้เซิร์ฟเวอร์แลกเปลี่ยนอีเมลได้เพียงเครื่องเดียวในแต่ละครั้ง โดยปกติแล้วจะไม่ลองส่งคำขอแบบย้อนกลับซ้ำอีก เนื่องจากการกำหนดค่าลำดับความสำคัญไม่ถูกต้อง และเซิร์ฟเวอร์อีเมลไม่ปฏิบัติตามการตรวจสอบลำดับความสำคัญของการแลกเปลี่ยน MX

### ฉันสามารถปิดใช้งานนามแฝงเฉพาะ {#can-i-disable-specific-aliases} ได้หรือไม่

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
หากคุณใช้แพ็กเกจแบบชำระเงิน คุณต้องไปที่ <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> นามแฝง <i class="fa fa-angle-right"></i> แก้ไขนามแฝง <i class="fa fa-angle-right"></i> ยกเลิกการเลือกช่องทำเครื่องหมาย "ใช้งานอยู่" <i class="fa fa-angle-right"></i> ดำเนินการต่อ
</span>
</div>

ใช่ เพียงแก้ไขระเบียน DNS <strong class="notranslate">TXT</strong> ของคุณและเติมคำนำหน้านามแฝงด้วยเครื่องหมายอัศเจรีย์หนึ่ง สองหรือสามตัว (ดูด้านล่าง)

โปรดทราบว่าคุณ *ควร* เก็บรักษาการแมป ":" ไว้ เนื่องจากจำเป็นต้องใช้หากคุณตัดสินใจปิดใช้งาน (และยังใช้สำหรับการนำเข้าหากคุณอัปเกรดเป็นแผนแบบชำระเงินของเรา)

**สำหรับการปฏิเสธแบบเงียบ (ผู้ส่งจะเห็นว่าข้อความถูกส่งสำเร็จ แต่จริงๆ แล้วไม่ได้ส่งไปไหนเลย) (รหัสสถานะ `250`) :** หากคุณเติม "!" (เครื่องหมายอัศเจรีย์ตัวเดียว) ลงในนามแฝง ระบบจะส่งรหัสสถานะสำเร็จ `250` กลับไปยังผู้ส่งที่พยายามส่งไปยังที่อยู่นี้ แต่ตัวอีเมลเองจะไม่ส่งไปไหนเลย (เช่น แบล็กโฮลหรือ `/dev/null`)

**สำหรับการปฏิเสธแบบอ่อน (รหัสสถานะ `421`)** หากคุณเติม "!!" (เครื่องหมายอัศเจรีย์สองตัว) ลงในนามแฝง ระบบจะส่งรหัสสถานะข้อผิดพลาดแบบอ่อน `421` กลับไปยังผู้ส่งที่พยายามส่งไปยังที่อยู่นี้ และโดยทั่วไปอีเมลจะถูกลองส่งใหม่อีกครั้งนานถึง 5 วันก่อนที่จะถูกปฏิเสธและตีกลับ

**สำหรับการปฏิเสธแบบถาวร (รหัสสถานะ `550`) :** หากคุณเติม "!!!" (เครื่องหมายอัศเจรีย์สามตัว) ลงในนามแฝง ระบบจะส่งรหัสสถานะข้อผิดพลาดถาวร `550` กลับไปยังผู้ส่งที่พยายามส่งไปยังที่อยู่นี้ และอีเมลจะถูกปฏิเสธและตีกลับ

ตัวอย่างเช่น ถ้าฉันต้องการให้อีเมลทั้งหมดที่ส่งไปยัง `alias@example.com` หยุดไหลไปยัง `user@gmail.com` และถูกปฏิเสธและตีกลับ (เช่น ใช้เครื่องหมายอัศเจรีย์สามตัว)

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
คุณยังสามารถเขียนที่อยู่ผู้รับที่ส่งต่อใหม่เป็น "nobody@forwardemail.net" ซึ่งจะส่งต่อไปยัง nobody ดังตัวอย่างด้านล่าง
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
หากต้องการความปลอดภัยที่เพิ่มขึ้น คุณสามารถลบส่วน ":user@gmail.com" (หรือ ":nobody@forwardemail.net") ออก โดยเหลือเพียง "!!!alias" ดังตัวอย่างด้านล่าง
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

### ฉันสามารถส่งต่ออีเมลไปยังผู้รับหลายรายได้ไหม {#can-i-forward-emails-to-multiple-recipients}

ใช่ แน่นอน เพียงระบุผู้รับหลายคนในบันทึก <strong class="notranslate">TXT</strong> ของคุณ

ตัวอย่างเช่น ถ้าฉันต้องการให้อีเมลที่ส่งไปยัง `hello@example.com` ได้รับการส่งต่อไปยัง `user+a@gmail.com` และ `user+b@gmail.com` บันทึก <strong class="notranslate">TXT</strong> ของฉันจะมีลักษณะดังนี้:

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

หรือคุณสามารถระบุเป็นสองบรรทัดแยกกันได้ เช่นนี้:

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

ขึ้นอยู่กับคุณ!

### ฉันสามารถมีผู้รับแบบ catch-all ทั่วโลกหลายรายได้ไหม {#can-i-have-multiple-global-catch-all-recipients}

ใช่ คุณสามารถทำได้ เพียงระบุผู้รับแบบ catch-all ทั่วโลกหลายรายในบันทึก <strong class="notranslate">TXT</strong> ของคุณ

ตัวอย่างเช่น ถ้าฉันต้องการให้อีเมลทุกฉบับที่ส่งไปยัง `*@example.com` (เครื่องหมายดอกจันหมายถึงไวด์การ์ดหรือจับทั้งหมด) ได้รับการส่งต่อไปยัง `user+a@gmail.com` และ `user+b@gmail.com` บันทึก <strong class="notranslate">TXT</strong> ของฉันจะมีลักษณะดังนี้:

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

หรือคุณสามารถระบุเป็นสองบรรทัดแยกกันได้ เช่นนี้:

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

ขึ้นอยู่กับคุณ!

### มีขีดจำกัดสูงสุดสำหรับจำนวนที่อยู่อีเมลที่ฉันสามารถส่งต่อไปยังนามแฝง {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias} หรือไม่

ใช่ ขีดจำกัดเริ่มต้นคือ 10 ซึ่งไม่ได้หมายความว่าคุณจะสามารถมีนามแฝงในชื่อโดเมนได้เพียง 10 ชื่อเท่านั้น คุณสามารถมีนามแฝงได้มากเท่าที่ต้องการ (ไม่จำกัดจำนวน) หมายความว่าคุณสามารถส่งต่อนามแฝงหนึ่งชื่อไปยังที่อยู่อีเมลที่ไม่ซ้ำกันได้ 10 ที่อยู่ คุณสามารถมี `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (ตั้งแต่ 1-10) และอีเมลใดๆ ที่ส่งถึง `hello@example.com` จะถูกส่งต่อไปยัง `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (ตั้งแต่ 1-10)

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
เคล็ดลับ:
</strong>
<span>
ต้องการผู้รับมากกว่า 10 คนต่อนามแฝงใช่ไหม? ส่งอีเมลมาหาเรา เรายินดีที่จะเพิ่มวงเงินให้บัญชีของคุณ
</span>
</div>

### ฉันสามารถส่งต่ออีเมลซ้ำๆ ได้ไหม {#can-i-recursively-forward-emails}

ได้ แต่คุณยังต้องปฏิบัติตามขีดจำกัดสูงสุด หากคุณมี `hello:linus@example.com` และ `linus:user@gmail.com` อีเมลที่ส่งไปยัง `hello@example.com` จะถูกส่งต่อไปยัง `linus@example.com` และ `user@gmail.com` โปรดทราบว่าจะเกิดข้อผิดพลาดหากคุณพยายามส่งต่ออีเมลซ้ำๆ เกินขีดจำกัดสูงสุด

### ผู้อื่นสามารถยกเลิกการลงทะเบียนหรือลงทะเบียนการส่งต่ออีเมลของฉันโดยไม่ได้รับอนุญาตจากฉันได้หรือไม่ {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

เราใช้การตรวจสอบระเบียน MX และ <strong class="notranslate">TXT</strong> ดังนั้นหากคุณเพิ่มระเบียน MX และ <strong class="notranslate">TXT</strong> ของบริการนี้ ถือว่าคุณลงทะเบียนแล้ว แต่หากคุณลบระเบียนเหล่านี้ออกไป ถือว่าคุณไม่ได้ลงทะเบียน คุณเป็นเจ้าของโดเมนและการจัดการ DNS ของคุณเอง ดังนั้นหากมีใครเข้าถึงได้ นั่นอาจเป็นปัญหา

### ฟรีได้ยังไง {#how-is-it-free}

Forward Email นำเสนอบริการแบบฟรีโดยใช้การผสมผสานระหว่างการพัฒนาโอเพ่นซอร์ส โครงสร้างพื้นฐานที่มีประสิทธิภาพ และแผนแบบชำระเงินเสริมที่รองรับบริการ

ระดับฟรีของเราได้รับการสนับสนุนโดย:

1. **การพัฒนาโอเพ่นซอร์ส**: ฐานโค้ดของเราเป็นโอเพ่นซอร์ส ซึ่งช่วยให้ชุมชนมีส่วนร่วมและดำเนินงานได้อย่างโปร่งใส

2. **โครงสร้างพื้นฐานที่มีประสิทธิภาพ**: เราได้เพิ่มประสิทธิภาพระบบของเราเพื่อจัดการการส่งต่ออีเมลด้วยทรัพยากรที่น้อยที่สุด

3. **แผนพรีเมียมแบบชำระเงิน**: ผู้ใช้ที่ต้องการฟีเจอร์เพิ่มเติม เช่น การส่ง SMTP, การรับ IMAP หรือตัวเลือกความเป็นส่วนตัวที่ได้รับการปรับปรุง สมัครแผนแบบชำระเงินของเรา

4. **ข้อจำกัดการใช้งานที่เหมาะสม**: ระดับฟรีมีนโยบายการใช้งานที่เหมาะสมเพื่อป้องกันการละเมิด

> \[!NOTE]
> เรามุ่งมั่นที่จะคงการส่งต่ออีเมลพื้นฐานให้ฟรี พร้อมทั้งมอบฟีเจอร์ระดับพรีเมียมให้กับผู้ใช้ที่มีความต้องการขั้นสูง

> \[!TIP]
> หากคุณพบว่าบริการของเรามีคุณค่า โปรดพิจารณาอัปเกรดเป็นแผนแบบชำระเงินเพื่อสนับสนุนการพัฒนาและการบำรุงรักษาอย่างต่อเนื่อง

### ขีดจำกัดขนาดอีเมลสูงสุดคือเท่าใด {#what-is-the-max-email-size-limit}

เราตั้งค่าเริ่มต้นไว้ที่ 50MB ซึ่งรวมถึงเนื้อหา ส่วนหัว และไฟล์แนบ โปรดทราบว่าบริการต่างๆ เช่น Gmail และ Outlook อนุญาตให้จำกัดขนาดได้เพียง 25MB เท่านั้น และหากคุณส่งไฟล์เกินขีดจำกัดเมื่อส่งไปยังที่อยู่ของผู้ให้บริการเหล่านั้น คุณจะได้รับข้อความแสดงข้อผิดพลาด

ข้อผิดพลาดพร้อมรหัสการตอบสนองที่เหมาะสมจะถูกส่งกลับมาหากเกินขีดจำกัดขนาดไฟล์

### คุณเก็บบันทึกอีเมลหรือไม่ {#do-you-store-logs-of-emails}

ไม่ เราไม่ได้เขียนลงดิสก์หรือเก็บบันทึก – ด้วย [ข้อยกเว้นของข้อผิดพลาด](#do-you-store-error-logs) และ [SMTP ขาออก](#do-you-support-sending-email-with-smtp) (ดู [นโยบายความเป็นส่วนตัว](/privacy) ของเรา)

ทุกอย่างทำในหน่วยความจำและ [ซอร์สโค้ดของเราอยู่บน GitHub](https://github.com/forwardemail)

### คุณเก็บบันทึกข้อผิดพลาด {#do-you-store-error-logs} หรือไม่

**ใช่ คุณสามารถเข้าถึงบันทึกข้อผิดพลาดได้ภายใต้ [บัญชีของฉัน → บันทึก](/my-account/logs) หรือ [บัญชีของฉัน → โดเมน](/my-account/domains)**

ตั้งแต่เดือนกุมภาพันธ์ 2023 เราจัดเก็บบันทึกข้อผิดพลาดสำหรับรหัสตอบกลับ SMTP ของ `4xx` และ `5xx` เป็นระยะเวลา 7 วัน ซึ่งประกอบด้วยข้อผิดพลาด SMTP ซองจดหมาย และส่วนหัวอีเมล (เรา **ไม่** จัดเก็บเนื้อหาอีเมลหรือไฟล์แนบ)

บันทึกข้อผิดพลาดช่วยให้คุณตรวจสอบอีเมลสำคัญที่หายไปและลดข้อผิดพลาดที่ผิดพลาดของสแปมสำหรับ [โดเมนของคุณ](/my-account/domains) นอกจากนี้ยังเป็นแหล่งข้อมูลที่ยอดเยี่ยมสำหรับการแก้ไขปัญหาเกี่ยวกับ [เว็บฮุกอีเมล](#do-you-support-webhooks) (เนื่องจากบันทึกข้อผิดพลาดมีการตอบสนองของจุดสิ้นสุดเว็บฮุก)

ไม่สามารถเข้าถึงบันทึกข้อผิดพลาดสำหรับ [การจำกัดอัตรา](#do-you-have-rate-limiting) และ [บัญชีเทา](#do-you-have-a-greylist) ได้เนื่องจากการเชื่อมต่อสิ้นสุดก่อนกำหนด (เช่น ก่อนที่จะส่งคำสั่ง `RCPT TO` และ `MAIL FROM` ได้)

ดู [นโยบายความเป็นส่วนตัว](/privacy) ของเราเพื่อดูข้อมูลเชิงลึกเพิ่มเติม

### คุณอ่านอีเมลของฉันไหม {#do-you-read-my-emails}

ไม่เลย ไม่แน่นอน ดู [นโยบายความเป็นส่วนตัว](/privacy) ของเรา

บริการส่งต่ออีเมลอื่นๆ หลายแห่งจัดเก็บและอาจอ่านอีเมลของคุณได้ ไม่มีเหตุผลใดที่อีเมลที่ส่งต่อจะต้องถูกจัดเก็บในดิสก์ ดังนั้นเราจึงได้ออกแบบโซลูชันโอเพนซอร์สตัวแรกที่ทำทุกอย่างได้ในหน่วยความจำ

เราเชื่อว่าคุณควรมีสิทธิ์ในความเป็นส่วนตัว และเราเคารพสิทธิ์นั้นอย่างเคร่งครัด โค้ดที่นำมาใช้กับเซิร์ฟเวอร์คือ [ซอฟต์แวร์โอเพ่นซอร์สบน GitHub](https://github.com/forwardemail) เพื่อความโปร่งใสและสร้างความน่าเชื่อถือ

### ฉันสามารถ "ส่งอีเมลในชื่อ" ใน Gmail ด้วย {#can-i-send-mail-as-in-gmail-with-this} นี้ได้หรือไม่

ใช่! เราได้เพิ่มฟีเจอร์นี้ตั้งแต่วันที่ 2 ตุลาคม 2018 เป็นต้นไป ดู [วิธีการส่งเมลโดยใช้ Gmail](#how-to-send-mail-as-using-gmail) ด้านบน!

คุณควรตั้งค่าระเบียน SPF สำหรับ Gmail ในการกำหนดค่า DNS ของคุณด้วยระเบียน <strong class="notranslate">TXT</strong>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
หากคุณใช้ Gmail (เช่น Send Mail As) หรือ G Suite คุณจะต้องเพิ่ม <code>include:_spf.google.com</code> ลงในระเบียน SPF <strong class="notranslate">TXT</strong> ของคุณ ตัวอย่างเช่น:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### ฉันสามารถ "ส่งเมลในชื่อ" ใน Outlook ด้วย {#can-i-send-mail-as-in-outlook-with-this} นี้ได้หรือไม่

ใช่! เราได้เพิ่มฟีเจอร์นี้ตั้งแต่วันที่ 2 ตุลาคม 2018 เป็นต้นไป เพียงดูลิงก์สองลิงก์จาก Microsoft ด้านล่างนี้:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

คุณควรตั้งค่าระเบียน SPF สำหรับ Outlook ในการกำหนดค่า DNS ของคุณด้วยระเบียน <strong class="notranslate">TXT</strong>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
สำคัญ:
</strong>
<span>
หากคุณใช้ Microsoft Outlook หรือ Live.com คุณจะต้องเพิ่ม <code>include:spf.protection.outlook.com</code> ลงในระเบียน SPF <strong class="notranslate">TXT</strong> ของคุณ ตัวอย่างเช่น:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### ฉันสามารถ "ส่งอีเมลในชื่อ" ใน Apple Mail และ iCloud Mail ด้วย {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this} นี้ได้หรือไม่

หากคุณเป็นสมาชิก iCloud+ คุณสามารถใช้โดเมนที่กำหนดเองได้ [บริการของเรายังเข้ากันได้กับ Apple Mail อีกด้วย](#apple-mail)

โปรดดู <https://support.apple.com/en-us/102540> เพื่อดูข้อมูลเพิ่มเติม

### ฉันสามารถส่งต่ออีเมลไม่จำกัดจำนวนด้วย {#can-i-forward-unlimited-emails-with-this} นี้ได้หรือไม่

ใช่ แต่ผู้ส่งที่ "ยังไม่เป็นที่รู้จัก" จะถูกจำกัดอัตราการเชื่อมต่อไว้ที่ 100 ครั้งต่อชั่วโมงต่อชื่อโฮสต์หรือ IP โปรดดูหัวข้อ [การจำกัดอัตรา](#do-you-have-rate-limiting) และ [เกรย์ลิสต์](#do-you-have-a-greylist) ด้านบน

โดย "ไม่รู้จักค่อนข้างมาก" เราหมายถึงผู้ส่งที่ไม่ปรากฏใน [รายการที่อนุญาต](#do-you-have-an-allowlist)

หากเกินขีดจำกัดนี้ เราจะส่งรหัสตอบกลับ 421 เพื่อแจ้งให้เซิร์ฟเวอร์อีเมลของผู้ส่งลองใหม่อีกครั้งในภายหลัง

### คุณเสนอโดเมนไม่จำกัดในราคาเดียวหรือไม่ {#do-you-offer-unlimited-domains-for-one-price}

ใช่ครับ ไม่ว่าคุณจะใช้แพ็กเกจไหน คุณจะจ่ายเพียงอัตราเดียวต่อเดือน ซึ่งครอบคลุมโดเมนทั้งหมดของคุณ

### คุณยอมรับวิธีการชำระเงินแบบใด {#which-payment-methods-do-you-accept}

การส่งต่ออีเมลยอมรับวิธีการชำระเงินครั้งเดียวหรือรายเดือน/รายไตรมาส/รายปีดังต่อไปนี้:

1. **บัตรเครดิต/เดบิต/การโอนเงินผ่านธนาคาร**: Visa, Mastercard, American Express, Discover, JCB, Diners Club ฯลฯ
2. **PayPal**: เชื่อมโยงบัญชี PayPal ของคุณเพื่อการชำระเงินที่ง่ายดาย
3. **คริปโตเคอร์เรนซี**: เรารับชำระเงินผ่านสกุลเงินดิจิทัลของ Stripe บนเครือข่าย Ethereum, Polygon และ Solana

> \[!NOTE]
> เราจัดเก็บข้อมูลการชำระเงินแบบจำกัดบนเซิร์ฟเวอร์ของเรา ซึ่งรวมถึงรหัสระบุการชำระเงินและการอ้างอิงถึงธุรกรรม ลูกค้า การสมัครสมาชิก และรหัสการชำระเงิน [ลายทาง](https://stripe.com/global) และ [เพย์พาล](https://www.paypal.com) เท่านั้น

> \[!TIP]
> เพื่อความเป็นส่วนตัวสูงสุด โปรดพิจารณาใช้การชำระเงินด้วยสกุลเงินดิจิทัล

การชำระเงินทั้งหมดได้รับการประมวลผลอย่างปลอดภัยผ่าน Stripe หรือ PayPal ข้อมูลการชำระเงินของคุณจะไม่ถูกจัดเก็บบนเซิร์ฟเวอร์ของเรา

## แหล่งข้อมูลเพิ่มเติม {#additional-resources}

> \[!TIP]
> บทความด้านล่างนี้ได้รับการอัปเดตเป็นประจำ พร้อมคำแนะนำ เคล็ดลับ และข้อมูลทางเทคนิคใหม่ๆ โปรดตรวจสอบเนื้อหาล่าสุดอยู่เสมอ

* [กรณีศึกษาและเอกสารประกอบสำหรับนักพัฒนา](/blog/docs)
* [ทรัพยากร](/resources)
* [คำแนะนำ](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/