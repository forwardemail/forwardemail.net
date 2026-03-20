# Quantum Resistant Email: วิธีที่เราใช้กล่องจดหมาย SQLite ที่เข้ารหัสเพื่อรักษาความปลอดภัยอีเมลของคุณ {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="ภาพประกอบบริการอีเมลที่เข้ารหัสปลอดภัยจากควอนตัม" class="rounded-lg" />


## สารบัญ {#table-of-contents}

* [คำนำ](#foreword)
* [การเปรียบเทียบบริการอีเมล](#email-service-provider-comparison)
* [มันทำงานอย่างไร](#how-does-it-work)
* [เทคโนโลยี](#technologies)
  * [ฐานข้อมูล](#databases)
  * [ความปลอดภัย](#security)
  * [กล่องจดหมาย](#mailboxes)
  * [ความขนาน](#concurrency)
  * [การสำรองข้อมูล](#backups)
  * [การค้นหา](#search)
  * [โครงการ](#projects)
  * [ผู้ให้บริการ](#providers)
* [ความคิด](#thoughts)
  * [หลักการ](#principles)
  * [การทดลอง](#experiments)
  * [ขาดทางเลือก](#lack-of-alternatives)
  * [ลองใช้ Forward Email](#try-out-forward-email)


## คำนำ {#foreword}

> \[!IMPORTANT]
> บริการอีเมลของเราเป็น [โอเพนซอร์ส 100%](https://github.com/forwardemail) และเน้นความเป็นส่วนตัวผ่านกล่องจดหมาย SQLite ที่ปลอดภัยและเข้ารหัส

จนกระทั่งเราเปิดตัว [การรองรับ IMAP](/faq#do-you-support-receiving-email-with-imap) เราใช้ MongoDB สำหรับความต้องการจัดเก็บข้อมูลถาวรของเรา

เทคโนโลยีนี้ยอดเยี่ยมและเรายังคงใช้งานอยู่จนถึงวันนี้ – แต่เพื่อให้มีการเข้ารหัสข้อมูลขณะพักกับ MongoDB คุณต้องใช้ผู้ให้บริการที่มี MongoDB Enterprise เช่น Digital Ocean หรือ Mongo Atlas – หรือจ่ายค่าลิขสิทธิ์แบบองค์กร (และต้องทำงานกับทีมขายที่มีความล่าช้า)

ทีมงานของเราที่ [Forward Email](https://forwardemail.net) ต้องการโซลูชันการจัดเก็บที่เป็นมิตรกับนักพัฒนา, ขยายตัวได้, เชื่อถือได้ และเข้ารหัสสำหรับกล่องจดหมาย IMAP ในฐานะนักพัฒนาโอเพนซอร์ส การใช้เทคโนโลยีที่ต้องจ่ายค่าลิขสิทธิ์เพื่อให้ได้ฟีเจอร์การเข้ารหัสข้อมูลขณะพักนั้นขัดกับ [หลักการของเรา](#principles) – ดังนั้นเราจึงทดลอง วิจัย และพัฒนาโซลูชันใหม่ตั้งแต่ต้นเพื่อตอบสนองความต้องการเหล่านี้

แทนที่จะใช้ฐานข้อมูลร่วมกันเพื่อเก็บกล่องจดหมายของคุณ เราจะเก็บและเข้ารหัสกล่องจดหมายของคุณแต่ละกล่องด้วยรหัสผ่านของคุณ (ซึ่งมีเพียงคุณเท่านั้นที่มี)  **บริการอีเมลของเราปลอดภัยมากจนถ้าคุณลืมรหัสผ่าน คุณจะสูญเสียกล่องจดหมายของคุณ** (และต้องกู้คืนด้วยการสำรองข้อมูลออฟไลน์หรือเริ่มต้นใหม่)

อ่านต่อไปขณะที่เราลงลึกด้านล่างด้วย [การเปรียบเทียบบริการอีเมล](#email-service-provider-comparison), [วิธีการทำงานของบริการเรา](#how-does-it-work), [เทคโนโลยีของเรา](#technologies) และอื่นๆ


## การเปรียบเทียบบริการอีเมล {#email-service-provider-comparison}

เราเป็นผู้ให้บริการอีเมลที่เป็นโอเพนซอร์ส 100% และเน้นความเป็นส่วนตัวเพียงรายเดียวที่เก็บกล่องจดหมาย SQLite ที่เข้ารหัสแยกกัน, เสนอชื่อโดเมน, อีเมลแฝง และผู้ใช้ไม่จำกัด และรองรับ SMTP ขาออก, IMAP และ POP3:

**แตกต่างจากผู้ให้บริการอีเมลรายอื่น คุณไม่จำเป็นต้องจ่ายค่าพื้นที่เก็บข้อมูลแยกตามโดเมนหรืออีเมลแฝงกับ Forward Email**  พื้นที่เก็บข้อมูลถูกแชร์ทั่วทั้งบัญชีของคุณ – ดังนั้นถ้าคุณมีชื่อโดเมนที่กำหนดเองหลายชื่อและหลายอีเมลแฝงในแต่ละชื่อ เราคือโซลูชันที่สมบูรณ์แบบสำหรับคุณ โปรดทราบว่าคุณยังสามารถบังคับใช้ขีดจำกัดพื้นที่เก็บข้อมูลได้หากต้องการแยกตามโดเมนหรืออีเมลแฝง

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">อ่านการเปรียบเทียบบริการอีเมล <i class="fa fa-search-plus"></i></a>


## มันทำงานอย่างไร {#how-does-it-work}

1. ใช้ไคลเอนต์อีเมลของคุณ เช่น Apple Mail, Thunderbird, Gmail หรือ Outlook – คุณเชื่อมต่อกับเซิร์ฟเวอร์ [IMAP](/faq#do-you-support-receiving-email-with-imap) ที่ปลอดภัยของเราโดยใช้ชื่อผู้ใช้และรหัสผ่านของคุณ:

   * ชื่อผู้ใช้ของคุณคืออีเมลแฝงเต็มรูปแบบพร้อมโดเมน เช่น `hello@example.com`
   * รหัสผ่านของคุณถูกสร้างแบบสุ่มและแสดงให้คุณเห็นเพียง 30 วินาทีเมื่อคุณคลิก <strong class="text-success"><i class="fa fa-key"></i> สร้างรหัสผ่าน</strong> จาก <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> อีเมลแฝง.
2. เมื่อเชื่อมต่อแล้ว โปรแกรมรับส่งอีเมลของคุณจะส่ง [คำสั่งโปรโตคอล IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) ไปยังเซิร์ฟเวอร์ IMAP ของเราเพื่อให้กล่องจดหมายของคุณซิงค์กัน ซึ่งรวมถึงการเขียนและเก็บร่างอีเมลและการกระทำอื่นๆ ที่คุณอาจทำ (เช่น การติดป้ายอีเมลว่า สำคัญ หรือการทำเครื่องหมายอีเมลว่าเป็น สแปมหรือจดหมายขยะ)

3. เซิร์ฟเวอร์แลกเปลี่ยนอีเมล (ที่รู้จักกันทั่วไปว่า "เซิร์ฟเวอร์ MX") จะรับอีเมลขาเข้าที่ใหม่และเก็บไว้ในกล่องจดหมายของคุณ เมื่อเกิดเหตุการณ์นี้ โปรแกรมรับส่งอีเมลของคุณจะได้รับการแจ้งเตือนและซิงค์กล่องจดหมาย เซิร์ฟเวอร์แลกเปลี่ยนอีเมลของเราสามารถส่งต่ออีเมลของคุณไปยังผู้รับหนึ่งหรือมากกว่านั้น (รวมถึง [เว็บฮุค](/faq#do-you-support-webhooks)) เก็บอีเมลของคุณไว้ในพื้นที่เก็บข้อมูล IMAP ที่เข้ารหัสกับเรา **หรือทั้งสองอย่าง!**

   > \[!TIP]
   > สนใจเรียนรู้เพิ่มเติมไหม? อ่าน [วิธีตั้งค่าการส่งต่ออีเมล](/faq#how-do-i-get-started-and-set-up-email-forwarding), [วิธีการทำงานของบริการแลกเปลี่ยนอีเมลของเรา](/faq#how-does-your-email-forwarding-system-work) หรือดู [คู่มือของเรา](/guides)

4. เบื้องหลัง การออกแบบพื้นที่เก็บอีเมลที่ปลอดภัยของเราทำงานในสองวิธีเพื่อให้กล่องจดหมายของคุณถูกเข้ารหัสและเข้าถึงได้เฉพาะคุณเท่านั้น:

   * เมื่อได้รับอีเมลใหม่สำหรับคุณจากผู้ส่ง เซิร์ฟเวอร์แลกเปลี่ยนอีเมลของเราจะเขียนไปยังกล่องจดหมายชั่วคราวส่วนตัวและเข้ารหัสสำหรับคุณ

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

   * เมื่อคุณเชื่อมต่อกับเซิร์ฟเวอร์ IMAP ของเราด้วยโปรแกรมรับส่งอีเมล รหัสผ่านของคุณจะถูกเข้ารหัสในหน่วยความจำและใช้เพื่ออ่านและเขียนไปยังกล่องจดหมายของคุณ กล่องจดหมายของคุณสามารถอ่านและเขียนได้เฉพาะด้วยรหัสผ่านนี้เท่านั้น โปรดทราบว่าเนื่องจากคุณเป็นคนเดียวที่มีรหัสผ่านนี้ **มีเพียงคุณเท่านั้น** ที่สามารถอ่านและเขียนกล่องจดหมายของคุณเมื่อคุณเข้าถึงมัน ครั้งถัดไปที่โปรแกรมรับส่งอีเมลของคุณพยายามตรวจสอบอีเมลหรือซิงค์ ข้อความใหม่ของคุณจะถูกโอนจากกล่องจดหมายชั่วคราวนี้และเก็บไว้ในไฟล์กล่องจดหมายจริงของคุณโดยใช้รหัสผ่านที่คุณให้ไว้ โปรดทราบว่ากล่องจดหมายชั่วคราวนี้จะถูกล้างและลบทิ้งหลังจากนั้นเพื่อให้มีเพียงกล่องจดหมายที่ป้องกันด้วยรหัสผ่านของคุณเท่านั้นที่มีข้อความเหล่านั้น

   * **หากคุณเชื่อมต่อกับ IMAP (เช่น ใช้โปรแกรมรับส่งอีเมลอย่าง Apple Mail หรือ Thunderbird) เราไม่จำเป็นต้องเขียนลงในพื้นที่เก็บข้อมูลชั่วคราวบนดิสก์ รหัสผ่าน IMAP ที่เข้ารหัสในหน่วยความจำของคุณจะถูกดึงมาใช้แทน ในเวลาจริง เมื่อมีข้อความพยายามส่งถึงคุณ เราจะส่งคำขอ WebSocket ไปยังเซิร์ฟเวอร์ IMAP ทั้งหมดเพื่อถามว่ามีเซสชันที่ใช้งานสำหรับคุณหรือไม่ (นี่คือส่วนของการดึงข้อมูล) และจากนั้นจะส่งต่อรหัสผ่านที่เข้ารหัสในหน่วยความจำนี้ – ดังนั้นเราจึงไม่จำเป็นต้องเขียนลงในกล่องจดหมายชั่วคราว เราสามารถเขียนลงในกล่องจดหมายที่เข้ารหัสจริงของคุณโดยใช้รหัสผ่านที่เข้ารหัสของคุณได้**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. [การสำรองข้อมูลกล่องจดหมายที่เข้ารหัสของคุณ](#backups) จะถูกทำทุกวัน คุณยังสามารถขอสำรองข้อมูลใหม่ได้ทุกเมื่อหรือดาวน์โหลดสำรองข้อมูลล่าสุดได้จาก <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> อลิอาส หากคุณตัดสินใจเปลี่ยนไปใช้บริการอีเมลอื่น คุณสามารถย้าย ดาวน์โหลด ส่งออก และล้างกล่องจดหมายและการสำรองข้อมูลของคุณได้อย่างง่ายดายทุกเมื่อ


## เทคโนโลยี {#technologies}

### ฐานข้อมูล {#databases}

เราได้สำรวจชั้นเก็บข้อมูลฐานข้อมูลอื่นๆ แต่ไม่มีตัวใดที่ตอบสนองความต้องการของเราได้ดีเท่า SQLite:
| Database                                               |                                                                    Encryption-at-rest                                                                   |  [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Mailboxes  |                           License                           | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: ใช่กับ [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: สาธารณสมบัติ              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["มีเฉพาะใน MongoDB Enterprise เท่านั้น"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: ฐานข้อมูลเชิงสัมพันธ์                               |                   :x: AGPL และ `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [เฉพาะเครือข่าย](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: ฐานข้อมูลเชิงสัมพันธ์                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [ยังไม่ได้ทดสอบและยังไม่รองรับ?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [ยังไม่ได้ทดสอบและยังไม่รองรับ?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [ใช่](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: ฐานข้อมูลเชิงสัมพันธ์                               | :white_check_mark: `PostgreSQL` (คล้ายกับ `BSD` หรือ `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [สำหรับ InnoDB เท่านั้น](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: ฐานข้อมูลเชิงสัมพันธ์                               |          :white_check_mark: `GPLv2` และ `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [ฟีเจอร์เฉพาะ Enterprise](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: ฐานข้อมูลเชิงสัมพันธ์                               |                  :x: `BUSL-1.1` และอื่นๆ                   |                             :x:                             |

> นี่คือ [บทความบล็อกที่เปรียบเทียบตัวเลือกการจัดเก็บฐานข้อมูล SQLite หลายตัว](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) ในตารางด้านบน

### Security {#security}

ตลอดเวลาที่เราใช้ [encryption-at-rest](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [encryption-in-transit](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") โดยใช้ :tangerine: [Tangerine](https://tangeri.ne), และ [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) การเข้ารหัสบนกล่องจดหมาย นอกจากนี้เรายังใช้การยืนยันตัวตนสองปัจจัยแบบใช้โทเค็น (แตกต่างจาก SMS ซึ่งเสี่ยงต่อ [man-in-the-middle-attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), การหมุนเวียนกุญแจ SSH พร้อมปิดการเข้าถึง root, การเข้าถึงเซิร์ฟเวอร์เฉพาะผ่านที่อยู่ IP ที่จำกัด และอื่นๆ อีกมากมาย
ในกรณีที่เกิด [การโจมตีแบบ evil maid](https://en.wikipedia.org/wiki/Evil_maid_attack) หรือพนักงานที่ไม่ซื่อสัตย์จากผู้ให้บริการภายนอก, **กล่องจดหมายของคุณยังคงเปิดได้เฉพาะด้วยรหัสผ่านที่คุณสร้างขึ้นเท่านั้น**. โปรดมั่นใจว่า เราไม่พึ่งพาผู้ให้บริการภายนอกใดๆ นอกจากผู้ให้บริการเซิร์ฟเวอร์ที่เป็นไปตามมาตรฐาน SOC Type 2 ของเรา ได้แก่ Cloudflare, DataPacket, Digital Ocean, GitHub และ Vultr

เป้าหมายของเราคือการมี [single point of failures](https://en.wikipedia.org/wiki/Single_point_of_failure) ให้น้อยที่สุดเท่าที่จะเป็นไปได้

### Mailboxes {#mailboxes}

> **สรุปสั้นๆ;** เซิร์ฟเวอร์ IMAP ของเราใช้ฐานข้อมูล SQLite ที่เข้ารหัสแยกกันสำหรับแต่ละกล่องจดหมายของคุณ

[SQLite เป็นฐานข้อมูลฝังตัวที่ได้รับความนิยมอย่างมาก](https://www.sqlite.org/mostdeployed.html) – ปัจจุบันมันทำงานอยู่บนโทรศัพท์และคอมพิวเตอร์ของคุณ – [และถูกใช้โดยเทคโนโลยีหลักเกือบทั้งหมด](https://www.sqlite.org/famous.html)

ตัวอย่างเช่น บนเซิร์ฟเวอร์ที่เข้ารหัสของเรา มีฐานข้อมูล SQLite สำหรับกล่องจดหมาย `linux@example.com`, `info@example.com`, `hello@example.com` เป็นต้น – หนึ่งฐานข้อมูลสำหรับแต่ละกล่องในรูปแบบไฟล์ `.sqlite` เราไม่ได้ตั้งชื่อไฟล์ฐานข้อมูลด้วยที่อยู่อีเมล แต่ใช้ BSON ObjectID และ UUID ที่ไม่ซ้ำกันซึ่งไม่เปิดเผยว่าเป็นของใครหรือเป็นอีเมลใด (เช่น `353a03f21e534321f5d6e267.sqlite`)

ฐานข้อมูลแต่ละชุดนี้ถูกเข้ารหัสด้วยรหัสผ่านของคุณ (ซึ่งมีเพียงคุณเท่านั้นที่มี) โดยใช้ [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) ซึ่งหมายความว่ากล่องจดหมายของคุณถูกเข้ารหัสแยกกัน, เป็นอิสระ, [sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) และพกพาได้

เราได้ปรับแต่ง SQLite ด้วย [PRAGMA](https://www.sqlite.org/pragma.html) ดังต่อไปนี้:

| `PRAGMA`                 | จุดประสงค์                                                                                                                                                                                                                                               |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [การเข้ารหัสฐานข้อมูล SQLite ด้วย ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). ดู `better-sqlite3-multiple-ciphers` ในส่วน [Projects](#projects) เพื่อข้อมูลเชิงลึกเพิ่มเติม                                      |
| `key="****************"` | นี่คือรหัสผ่านที่ถอดรหัสในหน่วยความจำเท่านั้นซึ่งถูกส่งผ่านการเชื่อมต่อ IMAP ของไคลเอนต์อีเมลของคุณไปยังเซิร์ฟเวอร์ของเรา อินสแตนซ์ฐานข้อมูลใหม่จะถูกสร้างและปิดสำหรับแต่ละเซสชันอ่านและเขียน (เพื่อให้แน่ใจในเรื่อง sandboxing และการแยกกัน)       |
| `journal_model=WAL`      | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [ซึ่งช่วยเพิ่มประสิทธิภาพและอนุญาตให้เข้าถึงการอ่านพร้อมกันได้](https://litestream.io/tips/#wal-journal-mode)                                                                                 |
| `busy_timeout=5000`      | ป้องกันข้อผิดพลาดล็อกเขียน [ในขณะที่มีการเขียนอื่นๆ กำลังดำเนินอยู่](https://litestream.io/tips/#busy-timeout)                                                                                                                                          |
| `synchronous=NORMAL`     | เพิ่มความทนทานของธุรกรรม [โดยไม่มีความเสี่ยงของการเสียหายของข้อมูล](https://litestream.io/tips/#synchronous-pragma)                                                                                                                                |
| `foreign_keys=ON`        | บังคับใช้การอ้างอิงคีย์ต่างประเทศ (เช่น ความสัมพันธ์จากตารางหนึ่งไปยังอีกตารางหนึ่ง) [โดยปกติจะไม่เปิดใช้งานใน SQLite](https://www.sqlite.org/foreignkeys.html) แต่เพื่อการตรวจสอบและความสมบูรณ์ของข้อมูลควรเปิดใช้งานไว้                                      |
| `encoding='UTF-8'`       | [การเข้ารหัสเริ่มต้น](https://www.sqlite.org/pragma.html#pragma_encoding) ที่ใช้เพื่อให้แน่ใจว่านักพัฒนาจะเข้าใจและใช้งานได้อย่างถูกต้อง                                                                                                               |
> ค่าปริยายอื่น ๆ ทั้งหมดมาจาก SQLite ตามที่ระบุไว้ใน [เอกสาร PRAGMA อย่างเป็นทางการ](https://www.sqlite.org/pragma.html#pragma_auto_vacuum)

### การทำงานพร้อมกัน {#concurrency}

> **สรุปสั้น ๆ;** เราใช้ `WebSocket` สำหรับการอ่านและเขียนพร้อมกันไปยังกล่องจดหมาย SQLite ที่เข้ารหัสของคุณ

#### การอ่าน {#reads}

ไคลเอนต์อีเมลของคุณบนโทรศัพท์อาจแก้ไข `imap.forwardemail.net` ไปยังที่อยู่ IP ของ Digital Ocean หนึ่งในของเรา – และไคลเอนต์บนเดสก์ท็อปของคุณอาจแก้ไขไปยัง IP แยกต่างหากจาก [ผู้ให้บริการ](#providers) รายอื่นโดยสิ้นเชิง

ไม่ว่าจะเชื่อมต่อกับเซิร์ฟเวอร์ IMAP ใด เราต้องการให้การเชื่อมต่อนั้นอ่านจากฐานข้อมูลของคุณแบบเรียลไทม์ด้วยความถูกต้อง 100% ซึ่งทำได้ผ่าน WebSockets

#### การเขียน {#writes}

การเขียนไปยังฐานข้อมูลของคุณจะแตกต่างกันเล็กน้อย – เนื่องจาก SQLite เป็นฐานข้อมูลฝังตัวและกล่องจดหมายของคุณอยู่ในไฟล์เดียวโดยค่าเริ่มต้น

เราได้สำรวจตัวเลือกต่าง ๆ เช่น `litestream`, `rqlite` และ `dqlite` ด้านล่าง – แต่ไม่มีตัวเลือกใดที่ตอบสนองความต้องการของเรา

เพื่อให้สามารถเขียนด้วยการเปิดใช้งาน write-ahead-logging ("[WAL](https://www.sqlite.org/wal.html)") – เราต้องมั่นใจว่าเซิร์ฟเวอร์เพียงตัวเดียว ("Primary") เป็นผู้รับผิดชอบในการทำเช่นนั้น [WAL](https://www.sqlite.org/wal.html) ช่วยเร่งความเร็วในการทำงานพร้อมกันอย่างมากและอนุญาตให้มีผู้เขียนหนึ่งคนและผู้อ่านหลายคน

Primary ทำงานบนเซิร์ฟเวอร์ข้อมูลที่มีโวลุ่มเมานต์ซึ่งบรรจุกล่องจดหมายที่เข้ารหัส จากมุมมองการกระจาย คุณสามารถพิจารณาเซิร์ฟเวอร์ IMAP แต่ละตัวที่อยู่เบื้องหลัง `imap.forwardemail.net` เป็นเซิร์ฟเวอร์รอง ("Secondary")

เราทำการสื่อสารสองทางด้วย [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* เซิร์ฟเวอร์ Primary ใช้ตัวอย่างของเซิร์ฟเวอร์ `WebSocketServer` จาก [ws](https://github.com/websockets/ws)
* เซิร์ฟเวอร์ Secondary ใช้ตัวอย่างของไคลเอนต์ `WebSocket` จาก [ws](https://github.com/websockets/ws) ที่ถูกห่อด้วย [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) และ [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket) ตัวห่อหุ้มสองตัวนี้ช่วยให้ `WebSocket` สามารถเชื่อมต่อใหม่และส่ง/รับข้อมูลสำหรับการเขียนฐานข้อมูลเฉพาะได้

### การสำรองข้อมูล {#backups}

> **สรุปสั้น ๆ;** การสำรองข้อมูลกล่องจดหมายที่เข้ารหัสของคุณจะทำทุกวัน คุณยังสามารถขอสำรองข้อมูลใหม่ทันทีหรือดาวน์โหลดสำรองข้อมูลล่าสุดได้ทุกเมื่อจาก <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">บัญชีของฉัน <i class="fa fa-angle-right"></i> โดเมน</a> <i class="fa fa-angle-right"></i> อีเมลแฝง

สำหรับการสำรองข้อมูล เราเพียงแค่รันคำสั่ง SQLite `VACUUM INTO` ทุกวันในระหว่างการประมวลผลคำสั่ง IMAP ซึ่งใช้รหัสผ่านที่เข้ารหัสของคุณจากการเชื่อมต่อ IMAP ในหน่วยความจำ การสำรองข้อมูลจะถูกเก็บไว้หากไม่พบการสำรองข้อมูลเดิมหรือหากแฮช [SHA-256](https://en.wikipedia.org/wiki/SHA-2) ของไฟล์เปลี่ยนแปลงไปเมื่อเทียบกับการสำรองข้อมูลล่าสุด

โปรดทราบว่าเราใช้คำสั่ง `VACUUM INTO` แทนคำสั่ง `backup` ที่มีอยู่ในตัว เพราะถ้ามีการแก้ไขหน้าในระหว่างการดำเนินการคำสั่ง `backup` จะต้องเริ่มใหม่ คำสั่ง `VACUUM INTO` จะทำการถ่ายภาพสถานะ (snapshot) ดูความคิดเห็นเหล่านี้ใน [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) และ [Hacker News](https://news.ycombinator.com/item?id=31387556) เพื่อข้อมูลเชิงลึกเพิ่มเติม

นอกจากนี้เราใช้ `VACUUM INTO` แทน `backup` เพราะคำสั่ง `backup` จะทำให้ฐานข้อมูลไม่ถูกเข้ารหัสชั่วคราวจนกว่าจะเรียกใช้ `rekey` (ดูความคิดเห็นใน GitHub นี้ [comment](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) เพื่อข้อมูลเชิงลึก)

Secondary จะสั่งให้ Primary ผ่านการเชื่อมต่อ `WebSocket` ให้ดำเนินการสำรองข้อมูล – และ Primary จะได้รับคำสั่งนั้นและดำเนินการดังนี้:

1. เชื่อมต่อกับกล่องจดหมายที่เข้ารหัสของคุณ
2. ได้รับล็อกสำหรับการเขียน
3. รันจุดตรวจสอบ WAL ผ่าน `wal_checkpoint(PASSIVE)`
4. รันคำสั่ง SQLite `VACUUM INTO`
5. ตรวจสอบว่าไฟล์ที่คัดลอกสามารถเปิดได้ด้วยรหัสผ่านที่เข้ารหัส (เพื่อความปลอดภัย/ป้องกันข้อผิดพลาด)
6. อัปโหลดไปยัง Cloudflare R2 เพื่อเก็บรักษา (หรือผู้ให้บริการของคุณเองหากระบุไว้)
<!--
7. บีบอัดไฟล์สำรองที่ได้ด้วย `gzip`
8. อัปโหลดไปยัง Cloudflare R2 เพื่อเก็บรักษา (หรือผู้ให้บริการของคุณเองหากระบุไว้)
-->

โปรดจำไว้ว่ากล่องจดหมายของคุณถูกเข้ารหัส – และแม้ว่าเราจะมีข้อจำกัด IP และมาตรการการตรวจสอบสิทธิ์อื่น ๆ สำหรับการสื่อสาร WebSocket – ในกรณีที่มีผู้ประสงค์ร้าย คุณมั่นใจได้ว่า เว้นแต่ payload ของ WebSocket จะมีรหัสผ่าน IMAP ของคุณ มันจะไม่สามารถเปิดฐานข้อมูลของคุณได้

ในขณะนี้จะเก็บสำรองเพียงชุดเดียวต่อกล่องจดหมายเท่านั้น แต่ในอนาคตเราอาจเสนอการกู้คืนจุดเวลา ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)")

### ค้นหา {#search}

เซิร์ฟเวอร์ IMAP ของเรารองรับคำสั่ง `SEARCH` พร้อมกับการค้นหาที่ซับซ้อน, นิพจน์ปกติ และอื่น ๆ

ประสิทธิภาพการค้นหาที่รวดเร็วเป็นผลมาจาก [FTS5](https://www.sqlite.org/fts5.html) และ [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex)

เราจัดเก็บค่า `Date` ในกล่องจดหมาย SQLite เป็นสตริง [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) ผ่าน [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (โดยใช้โซนเวลา UTC เพื่อให้การเปรียบเทียบความเท่าเทียมทำงานได้อย่างถูกต้อง)

ดัชนียังถูกจัดเก็บสำหรับคุณสมบัติทั้งหมดที่อยู่ในคำค้นหา

### โครงการ {#projects}

นี่คือตารางแสดงโครงการที่เราใช้ในซอร์สโค้ดและกระบวนการพัฒนา (เรียงตามลำดับตัวอักษร):

| โครงการ                                                                                      | จุดประสงค์                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Ansible](https://www.ansible.com/)                                                          | แพลตฟอร์มอัตโนมัติ DevOps สำหรับการดูแลรักษา, ขยาย และจัดการเซิร์ฟเวอร์ทั้งหมดของเราได้อย่างง่ายดาย                                                                                                                                                                                                                                                               |
| [Bree](https://github.com/breejs/bree)                                                       | ตัวจัดตารางงานสำหรับ Node.js และ JavaScript พร้อมการรองรับ cron, วันที่, ms, later และใช้งานง่ายสำหรับมนุษย์                                                                                                                                                                                                                                                        |
| [Cabin](https://github.com/cabinjs/cabin)                                                    | ไลบรารีล็อก JavaScript และ Node.js ที่เป็นมิตรกับนักพัฒนาด้วยความปลอดภัยและความเป็นส่วนตัวในใจ                                                                                                                                                                                                                                                                   |
| [Lad](https://github.com/ladjs/lad)                                                          | เฟรมเวิร์ก Node.js ที่ขับเคลื่อนสถาปัตยกรรมและการออกแบบวิศวกรรมทั้งหมดของเราด้วย MVC และอื่น ๆ                                                                                                                                                                                                                                                                     |
| [MongoDB](https://www.mongodb.com/)                                                          | โซลูชันฐานข้อมูล NoSQL ที่เราใช้สำหรับเก็บข้อมูลอื่น ๆ นอกเหนือจากกล่องจดหมาย (เช่น บัญชีของคุณ, การตั้งค่า, โดเมน และการกำหนดค่าอีเมลแฝง)                                                                                                                                                                                                                      |
| [Mongoose](https://github.com/Automattic/mongoose)                                           | การสร้างแบบจำลองเอกสารวัตถุ MongoDB ("ODM") ที่เราใช้ทั่วทั้งสแตก เราเขียนตัวช่วยพิเศษที่ช่วยให้เราสามารถใช้ **Mongoose กับ SQLite** ต่อไปได้ :tada:                                                                                                                                                                                                             |
| [Node.js](https://nodejs.org/en)                                                             | Node.js คือสภาพแวดล้อมรันไทม์ JavaScript แบบโอเพนซอร์สข้ามแพลตฟอร์มที่รันกระบวนการเซิร์ฟเวอร์ทั้งหมดของเรา                                                                                                                                                                                                                                                        |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                       | แพ็กเกจ Node.js สำหรับส่งอีเมล, สร้างการเชื่อมต่อ และอื่น ๆ เราเป็นผู้สนับสนุนอย่างเป็นทางการของโครงการนี้                                                                                                                                                                                                                                                         |
| [Redis](https://redis.io/)                                                                   | ฐานข้อมูลในหน่วยความจำสำหรับแคช, ช่องทางเผยแพร่/สมัครรับ และคำขอ DNS ผ่าน HTTPS                                                                                                                                                                                                                                                                                   |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                   | ส่วนขยายการเข้ารหัสสำหรับ SQLite เพื่อให้ไฟล์ฐานข้อมูลทั้งหมดถูกเข้ารหัส (รวมถึง write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …)                                                                                                                                                                                               |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                  | ตัวแก้ไข SQLite แบบกราฟิก (ซึ่งคุณก็สามารถใช้ได้) สำหรับทดสอบ, ดาวน์โหลด และดูการพัฒนากล่องจดหมาย                                                                                                                                                                                                                                                                   |
| [SQLite](https://www.sqlite.org/about.html)                                                  | ชั้นฐานข้อมูลฝังตัวสำหรับการจัดเก็บ IMAP ที่ปรับขนาดได้, เป็นอิสระ, รวดเร็ว และทนทาน                                                                                                                                                                                                                                                                              |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                   | เครื่องมือป้องกันสแปม, กรองอีเมล และป้องกันฟิชชิ่งบน Node.js (ทางเลือกของเราสำหรับ [Spam Assassin](https://spamassassin.apache.org/) และ [rspamd](https://github.com/rspamd/rspamd))                                                                                                                                                                              |
| [Tangerine](https://tangeri.ne)                                                              | คำขอ DNS ผ่าน HTTPS ด้วย Node.js และแคชโดยใช้ Redis – ซึ่งช่วยให้ความสอดคล้องทั่วโลกและอื่น ๆ อีกมากมาย                                                                                                                                                                                                                                                             |
| [Thunderbird](https://www.thunderbird.net/)                                                  | ทีมพัฒนาของเราใช้ (และแนะนำ) โปรแกรมนี้เป็น **ไคลเอนต์อีเมลที่แนะนำให้ใช้กับ Forward Email**                                                                                                                                                                                                                                                                       |
| [UTM](https://github.com/utmapp/UTM)                                                         | ทีมพัฒนาของเราใช้สร้างเครื่องเสมือนสำหรับ iOS และ macOS เพื่อทดสอบไคลเอนต์อีเมลต่าง ๆ (พร้อมกัน) กับเซิร์ฟเวอร์ IMAP และ SMTP ของเรา                                                                                                                                                                                                                                |
| [Ubuntu](https://ubuntu.com/download/server)                                                 | ระบบปฏิบัติการเซิร์ฟเวอร์ Linux แบบโอเพนซอร์สสมัยใหม่ที่ขับเคลื่อนโครงสร้างพื้นฐานทั้งหมดของเรา                                                                                                                                                                                                                                                                   |
| [WildDuck](https://github.com/nodemailer/wildduck)                                           | ไลบรารีเซิร์ฟเวอร์ IMAP – ดูบันทึกเกี่ยวกับ [การลบซ้ำไฟล์แนบ](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) และ [การรองรับโปรโตคอล IMAP](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md)                                                                                  |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | ไลบรารี API ที่รวดเร็วและเรียบง่ายสำหรับ Node.js เพื่อโต้ตอบกับ SQLite3 โดยโปรแกรม                                                                                                                                                                                                                                                                                   |
| [email-templates](https://github.com/forwardemail/email-templates)                           | เฟรมเวิร์กอีเมลที่เป็นมิตรกับนักพัฒนาเพื่อสร้าง, แสดงตัวอย่าง และส่งอีเมลที่กำหนดเอง (เช่น การแจ้งเตือนบัญชีและอื่น ๆ)                                                                                                                                                                                                                                               |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                       | ตัวสร้างคำสั่ง SQL โดยใช้ไวยากรณ์สไตล์ Mongo ช่วยประหยัดเวลาทีมพัฒนาด้วยการเขียนแบบ Mongo ทั่วทั้งสแตกด้วยแนวทางที่ไม่ขึ้นกับฐานข้อมูล **ยังช่วยป้องกันการโจมตี SQL injection โดยใช้พารามิเตอร์คำสั่ง**                                                                                                                                                          |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                       | เครื่องมือ SQL สำหรับดึงข้อมูลเกี่ยวกับโครงสร้างฐานข้อมูลที่มีอยู่ ช่วยให้เราตรวจสอบได้ง่ายว่าดัชนี, ตาราง, คอลัมน์, ข้อจำกัด และอื่น ๆ ถูกต้องและตรงกับที่ควรจะเป็น `1:1` เรายังเขียนตัวช่วยอัตโนมัติสำหรับเพิ่มคอลัมน์และดัชนีใหม่หากมีการเปลี่ยนแปลงโครงสร้างฐานข้อมูล (พร้อมแจ้งเตือนข้อผิดพลาดอย่างละเอียด) |
| [knex](https://github.com/knex/knex)                                                         | ตัวสร้างคำสั่ง SQL ที่เราใช้เฉพาะสำหรับการย้ายฐานข้อมูลและตรวจสอบโครงสร้างผ่าน `knex-schema-inspector`                                                                                                                                                                                                                                                           |
| [mandarin](https://github.com/ladjs/mandarin)                                                | การแปลวลี [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) อัตโนมัติพร้อมรองรับ Markdown โดยใช้ [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest)                                                                                                                                                   |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                          | แพ็กเกจ Node.js สำหรับแก้ไขและสร้างการเชื่อมต่อกับเซิร์ฟเวอร์ MX และจัดการข้อผิดพลาด                                                                                                                                                                                                                                                                              |
| [pm2](https://github.com/Unitech/pm2)                                                        | ตัวจัดการกระบวนการผลิต Node.js พร้อมโหลดบาลานเซอร์ในตัว ([ปรับแต่ง](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) เพื่อประสิทธิภาพ)                                                                                                                                                                                                           |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                     | ไลบรารีเซิร์ฟเวอร์ SMTP – เราใช้สำหรับเซิร์ฟเวอร์แลกเปลี่ยนอีเมล ("MX") และเซิร์ฟเวอร์ SMTP ขาออก                                                                                                                                                                                                                                                                |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                | เครื่องมือที่มีประโยชน์สำหรับทดสอบเซิร์ฟเวอร์ IMAP กับเกณฑ์มาตรฐานและความเข้ากันได้กับโปรโตคอล IMAP ตาม RFC โครงการนี้สร้างโดยทีม [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (เซิร์ฟเวอร์ IMAP และ POP3 แบบโอเพนซอร์สที่เปิดตัวในเดือนกรกฎาคม 2002) เราได้ทดสอบเซิร์ฟเวอร์ IMAP ของเราอย่างละเอียดด้วยเครื่องมือนี้ |
> คุณสามารถค้นหาโปรเจกต์อื่น ๆ ที่เราใช้ได้ใน [ซอร์สโค้ดของเราบน GitHub](https://github.com/forwardemail)

### ผู้ให้บริการ {#providers}

| ผู้ให้บริการ                                    | จุดประสงค์                                                                                                                   |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | ผู้ให้บริการ DNS, การตรวจสอบสุขภาพ, ตัวโหลดบาลานเซอร์ และการจัดเก็บข้อมูลสำรองโดยใช้ [Cloudflare R2](https://developers.cloudflare.com/r2) |
| [GitHub](https://github.com/)                   | โฮสต์ซอร์สโค้ด, CI/CD และการจัดการโปรเจกต์                                                                                 |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | โฮสต์เซิร์ฟเวอร์เฉพาะและฐานข้อมูลที่มีการจัดการ                                                                             |
| [Vultr](https://www.vultr.com/?ref=7429848)     | โฮสต์เซิร์ฟเวอร์เฉพาะ                                                                                                      |
| [DataPacket](https://www.datapacket.com)        | โฮสต์เซิร์ฟเวอร์เฉพาะ                                                                                                      |


## ความคิด {#thoughts}

### หลักการ {#principles}

Forward Email ถูกออกแบบตามหลักการเหล่านี้:

1. เป็นมิตรกับนักพัฒนาเสมอ มุ่งเน้นความปลอดภัยและความเป็นส่วนตัว และโปร่งใส
2. ปฏิบัติตาม [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor), และ [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. มุ่งเป้าไปที่นักพัฒนาที่มีความขยันขันแข็ง เริ่มต้นด้วยงบประมาณจำกัด และ [ทำกำไรจากราเมน](http://www.paulgraham.com/ramenprofitable.html)

### การทดลอง {#experiments}

> **สรุป;** ในที่สุดการใช้ที่เก็บข้อมูลแบบวัตถุที่เข้ากันได้กับ S3 และ/หรือ Virtual Tables ไม่สามารถทำได้ทางเทคนิคเนื่องจากเหตุผลด้านประสิทธิภาพและมีแนวโน้มเกิดข้อผิดพลาดเนื่องจากข้อจำกัดของหน่วยความจำ

เราได้ทำการทดลองหลายอย่างจนได้โซลูชัน SQLite สุดท้ายตามที่กล่าวไว้ข้างต้น

หนึ่งในนั้นคือการลองใช้ [rclone]() และ SQLite ร่วมกับชั้นเก็บข้อมูลที่เข้ากันได้กับ S3

การทดลองนั้นทำให้เราเข้าใจและค้นพบกรณีขอบที่เกี่ยวข้องกับ rclone, SQLite และการใช้งาน [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) ดังนี้:

* หากคุณเปิดใช้งานแฟล็ก `--vfs-cache-mode writes` กับ rclone การอ่านจะทำงานได้ดี แต่การเขียนจะถูกแคชไว้
  * หากคุณมีเซิร์ฟเวอร์ IMAP หลายตัวกระจายทั่วโลก แคชจะไม่ตรงกันระหว่างเซิร์ฟเวอร์เหล่านั้น เว้นแต่จะมีผู้เขียนเพียงคนเดียวและผู้ฟังหลายคน (เช่น วิธี pub/sub)
  * สิ่งนี้ซับซ้อนมาก และการเพิ่มความซับซ้อนเพิ่มเติมเช่นนี้จะทำให้เกิดจุดล้มเหลวเดียวมากขึ้น
  * ผู้ให้บริการเก็บข้อมูลที่เข้ากันได้กับ S3 ไม่รองรับการเปลี่ยนแปลงไฟล์บางส่วน – ซึ่งหมายความว่าการเปลี่ยนแปลงใด ๆ ของไฟล์ `.sqlite` จะทำให้ฐานข้อมูลถูกเปลี่ยนแปลงและอัปโหลดใหม่ทั้งหมด
  * มีโซลูชันอื่นเช่น `rsync` แต่ไม่ได้เน้นการรองรับ write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") – ดังนั้นเราจึงได้ทบทวน Litestream โชคดีที่การเข้ารหัสของเราเข้ารหัสไฟล์ [WAL](https://www.sqlite.org/wal.html) อยู่แล้ว ดังนั้นเราไม่จำเป็นต้องพึ่งพา Litestream สำหรับเรื่องนี้ อย่างไรก็ตาม เรายังไม่มั่นใจใน Litestream สำหรับการใช้งานในสภาพแวดล้อมจริงและมีบันทึกบางอย่างด้านล่าง
  * การใช้ตัวเลือก `--vfs-cache-mode writes` (วิธี *เดียว* ที่จะใช้ SQLite ผ่าน `rclone` สำหรับการเขียน) จะพยายามคัดลอกฐานข้อมูลทั้งหมดใหม่ในหน่วยความจำ – การจัดการกล่องจดหมายขนาด 10 GB ตัวเดียวถือว่าโอเค แต่การจัดการกล่องจดหมายหลายกล่องที่มีพื้นที่เก็บข้อมูลสูงมากจะทำให้เซิร์ฟเวอร์ IMAP ประสบปัญหาข้อจำกัดหน่วยความจำและเกิดข้อผิดพลาด `ENOMEM`, segmentation faults และข้อมูลเสียหาย
* หากคุณพยายามใช้ SQLite [Virtual Tables](https://www.sqlite.org/vtab.html) (เช่น การใช้ [s3db](https://github.com/jrhy/s3db)) เพื่อให้ข้อมูลอยู่บนชั้นเก็บข้อมูลที่เข้ากันได้กับ S3 คุณจะพบปัญหาเพิ่มเติมหลายอย่าง:
  * การอ่านและเขียนจะช้ามากเนื่องจากต้องเรียกใช้ API ของ S3 ด้วย HTTP `GET`, `PUT`, `HEAD` และ `POST`
  * การทดสอบพัฒนาพบว่าการเกิน 500K-1M+ ระเบียนบนอินเทอร์เน็ตไฟเบอร์ยังถูกจำกัดด้วยอัตราการเขียนและอ่านไปยังผู้ให้บริการที่เข้ากันได้กับ S3 ตัวอย่างเช่น นักพัฒนาของเรารันลูป `for` เพื่อทำทั้งคำสั่ง SQL `INSERT` แบบเรียงลำดับและแบบเขียนข้อมูลจำนวนมาก ในทั้งสองกรณีประสิทธิภาพช้ามาก
  * ตารางเสมือน **ไม่สามารถมีดัชนี**, คำสั่ง `ALTER TABLE` และ [ข้อจำกัดอื่น ๆ](https://stackoverflow.com/a/12507650) [เพิ่มเติม](https://sqlite.org/lang_createvtab.html) – ซึ่งทำให้เกิดความล่าช้านานถึง 1-2 นาทีหรือมากกว่านั้นขึ้นอยู่กับปริมาณข้อมูล
  * วัตถุถูกเก็บโดยไม่เข้ารหัสและไม่มีการรองรับการเข้ารหัสในตัวที่พร้อมใช้งาน
* เรายังได้สำรวจการใช้ [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) ซึ่งมีแนวคิดและเทคนิคคล้ายกับข้อก่อนหน้า (ดังนั้นจึงมีปัญหาเหมือนกัน) ความเป็นไปได้คือการใช้ `sqlite3` ที่สร้างขึ้นเองพร้อมการเข้ารหัสเช่น [wxSQLite3](https://github.com/utelle/wxsqlite3) (ซึ่งเราใช้ในโซลูชันของเราข้างต้น) ผ่าน [การแก้ไขไฟล์ setup](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276)
* แนวทางที่เป็นไปได้อีกอย่างคือการใช้ [ส่วนขยาย multiplex](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c) แต่มีข้อจำกัดที่ 32 GB และต้องการการสร้างและพัฒนาที่ซับซ้อน
* คำสั่ง `ALTER TABLE` จำเป็นต้องใช้ (ดังนั้นจึงตัดการใช้ Virtual Tables ออกไปโดยสิ้นเชิง) เราต้องการคำสั่ง `ALTER TABLE` เพื่อให้ hook ของเรากับ `knex-schema-inspector` ทำงานอย่างถูกต้อง – ซึ่งช่วยให้มั่นใจว่าข้อมูลไม่เสียหายและแถวที่ดึงมาแปลงเป็นเอกสารที่ถูกต้องตามคำจำกัดความ schema ของ `mongoose` ของเรา (ซึ่งรวมถึงข้อจำกัด ประเภทตัวแปร และการตรวจสอบข้อมูลแบบกำหนดเอง)
* เกือบทุกโปรเจกต์ที่เกี่ยวข้องกับ SQLite และเข้ากันได้กับ S3 ในชุมชนโอเพนซอร์สเป็นภาษา Python (ไม่ใช่ JavaScript ซึ่งเราใช้สำหรับสแตกทั้งหมด 100%)
* ไลบรารีบีบอัดเช่น [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (ดู [ความคิดเห็น](https://news.ycombinator.com/item?id=32303762)) ดูมีแนวโน้มดี แต่ [อาจยังไม่พร้อมสำหรับการใช้งานในสภาพแวดล้อมจริง](https://github.com/phiresky/sqlite-zstd#usage) แทนที่จะใช้การบีบอัดฝั่งแอปพลิเคชันกับประเภทข้อมูลเช่น `String`, `Object`, `Map`, `Array`, `Set`, และ `Buffer` จะเป็นวิธีที่สะอาดและง่ายกว่า (และง่ายต่อการย้ายข้อมูลด้วย เพราะเราสามารถเก็บธง `Boolean` หรือคอลัมน์ – หรือแม้แต่ใช้ `PRAGMA` `user_version=1` สำหรับการบีบอัด หรือ `user_version=0` สำหรับไม่บีบอัดเป็นเมตาดาต้าของฐานข้อมูล)
  * โชคดีที่เราได้ดำเนินการลดการซ้ำซ้อนของไฟล์แนบในที่เก็บเซิร์ฟเวอร์ IMAP แล้ว – ดังนั้นทุกข้อความที่มีไฟล์แนบเหมือนกันจะไม่เก็บสำเนาไฟล์แนบซ้ำ – แต่จะเก็บไฟล์แนบเดียวสำหรับหลายข้อความและเธรดในกล่องจดหมาย (และใช้การอ้างอิงภายนอกแทน)
* โปรเจกต์ Litestream ซึ่งเป็นโซลูชันการทำซ้ำและสำรองข้อมูล SQLite นั้นมีแนวโน้มดีมากและเราน่าจะใช้ในอนาคต
  * ไม่ได้ดูถูกผู้เขียน – เพราะเราชื่นชมงานและการมีส่วนร่วมของพวกเขาต่อโอเพนซอร์สมานานกว่าทศวรรษ – แต่จากการใช้งานจริงดูเหมือนว่าจะมี [ปัญหามากมาย](https://github.com/benbjohnson/litestream/issues) และ [ความเสี่ยงการสูญหายของข้อมูลจากการใช้งาน](https://github.com/benbjohnson/litestream/issues/218)
* การกู้คืนข้อมูลสำรองต้องเป็นเรื่องง่ายและไม่ซับซ้อน การใช้โซลูชันเช่น MongoDB กับ `mongodump` และ `mongoexport` นั้นไม่เพียงแต่ยุ่งยาก แต่ยังใช้เวลานานและมีความซับซ้อนในการตั้งค่า
  * ฐานข้อมูล SQLite ทำให้ง่าย (เพราะเป็นไฟล์เดียว)
  * เราต้องการออกแบบโซลูชันที่ผู้ใช้สามารถนำกล่องจดหมายของตนออกไปได้ทุกเมื่อ
    * คำสั่ง Node.js ง่าย ๆ เช่น `fs.unlink('mailbox.sqlite')` และไฟล์จะถูกลบอย่างถาวรจากที่เก็บข้อมูลบนดิสก์
    * เราสามารถใช้ API ที่เข้ากันได้กับ S3 พร้อม HTTP `DELETE` เพื่อลบ snapshot และข้อมูลสำรองสำหรับผู้ใช้งานได้อย่างง่ายดาย
  * SQLite เป็นโซลูชันที่ง่ายที่สุด เร็วที่สุด และคุ้มค่าที่สุด
### ขาดทางเลือก {#lack-of-alternatives}

เท่าที่เราทราบ ไม่มีบริการอีเมลอื่นใดที่ออกแบบในลักษณะนี้หรือเป็นโอเพนซอร์ส

เราคิดว่า *อาจเป็นเพราะ* บริการอีเมลที่มีอยู่ใช้เทคโนโลยีเก่าในระบบจริงพร้อมกับ [โค้ดสปาเก็ตตี้](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:

ผู้ให้บริการอีเมลส่วนใหญ่ถ้าไม่ทั้งหมดจะเป็นซอร์สปิดหรือโฆษณาว่าเป็นโอเพนซอร์ส **แต่ในความเป็นจริงมีเพียงส่วนหน้าของพวกเขาเท่านั้นที่เป็นโอเพนซอร์ส**

**ส่วนที่ละเอียดอ่อนที่สุดของอีเมล** (การจัดเก็บจริง/IMAP/SMTP) **ทั้งหมดทำงานบนฝั่งหลังบ้าน (เซิร์ฟเวอร์) และ *ไม่ใช่* บนฝั่งหน้า (ไคลเอนต์)**

### ลองใช้ Forward Email {#try-out-forward-email}

สมัครวันนี้ได้ที่ <https://forwardemail.net>! :rocket:
