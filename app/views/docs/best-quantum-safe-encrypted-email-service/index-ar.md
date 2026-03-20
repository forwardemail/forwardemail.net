# البريد الإلكتروني المقاوم للحوسبة الكمومية: كيف نستخدم صناديق بريد SQLite المشفرة للحفاظ على أمان بريدك الإلكتروني {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="رسم توضيحي لخدمة البريد الإلكتروني المشفرة الآمنة ضد الحوسبة الكمومية" class="rounded-lg" />


## جدول المحتويات {#table-of-contents}

* [مقدمة](#foreword)
* [مقارنة مزودي خدمة البريد الإلكتروني](#email-service-provider-comparison)
* [كيف تعمل الخدمة](#how-does-it-work)
* [التقنيات](#technologies)
  * [قواعد البيانات](#databases)
  * [الأمان](#security)
  * [صناديق البريد](#mailboxes)
  * [التزامن](#concurrency)
  * [النسخ الاحتياطية](#backups)
  * [البحث](#search)
  * [المشاريع](#projects)
  * [المزودون](#providers)
* [أفكار](#thoughts)
  * [المبادئ](#principles)
  * [التجارب](#experiments)
  * [نقص البدائل](#lack-of-alternatives)
  * [جرب Forward Email](#try-out-forward-email)


## مقدمة {#foreword}

> \[!IMPORTANT]
> خدمتنا البريدية [مفتوحة المصدر 100%](https://github.com/forwardemail) وتركز على الخصوصية من خلال صناديق بريد SQLite المشفرة والآمنة.

حتى أطلقنا دعم [IMAP](/faq#do-you-support-receiving-email-with-imap)، كنا نستخدم MongoDB لتلبية احتياجاتنا في تخزين البيانات الدائم.

هذه التقنية مذهلة وما زلنا نستخدمها حتى اليوم – ولكن لكي تحصل على التشفير أثناء التخزين مع MongoDB، تحتاج إلى استخدام مزود يقدم MongoDB Enterprise، مثل Digital Ocean أو Mongo Atlas – أو دفع رسوم ترخيص للمؤسسات (وبالتالي التعامل مع تأخير فرق المبيعات).

كان فريقنا في [Forward Email](https://forwardemail.net) بحاجة إلى حل تخزين مشفر، قابل للتطوير، موثوق، وسهل الاستخدام للمطورين لصناديق بريد IMAP. كمطورين مفتوحين المصدر، كان استخدام تقنية تحتاج إلى دفع رسوم ترخيص للحصول على ميزة التشفير أثناء التخزين مخالفًا لـ [مبادئنا](#principles) – لذا قمنا بالتجربة والبحث وتطوير حل جديد من الصفر لتلبية هذه الاحتياجات.

بدلاً من استخدام قاعدة بيانات مشتركة لتخزين صناديق بريدك، نقوم بتخزين صناديق بريدك وتشفيرها بشكل فردي باستخدام كلمة مرورك (التي لا يملكها إلا أنت).  **خدمتنا البريدية آمنة جدًا لدرجة أنه إذا نسيت كلمة مرورك، فإنك تفقد صندوق بريدك** (ويجب عليك الاسترداد من النسخ الاحتياطية غير المتصلة أو البدء من جديد).

تابع القراءة حيث نغوص في التفاصيل أدناه مع [مقارنة مزودي خدمة البريد الإلكتروني](#email-service-provider-comparison)، [كيف تعمل خدمتنا](#how-does-it-work)، [تقنياتنا](#technologies)، وأكثر.


## مقارنة مزودي خدمة البريد الإلكتروني {#email-service-provider-comparison}

نحن المزود الوحيد لخدمة البريد الإلكتروني المفتوحة المصدر 100% والمركزة على الخصوصية الذي يخزن صناديق بريد SQLite مشفرة بشكل فردي، ويقدم نطاقات، وأسماء مستعارة، ومستخدمين غير محدودين، ويدعم SMTP الصادر، وIMAP، وPOP3:

**على عكس مزودي البريد الإلكتروني الآخرين، لا تحتاج إلى دفع مقابل التخزين على أساس كل نطاق أو اسم مستعار مع Forward Email.** التخزين مشترك عبر حسابك بالكامل – لذا إذا كان لديك عدة أسماء نطاقات مخصصة وعدة أسماء مستعارة على كل منها، فنحن الحل المثالي لك. لاحظ أنه يمكنك فرض حدود تخزين إذا رغبت على أساس كل نطاق أو اسم مستعار.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">اقرأ مقارنة خدمات البريد الإلكتروني <i class="fa fa-search-plus"></i></a>


## كيف تعمل الخدمة {#how-does-it-work}

1. باستخدام عميل البريد الإلكتروني الخاص بك مثل Apple Mail، Thunderbird، Gmail، أو Outlook – تتصل بخوادمنا الآمنة [IMAP](/faq#do-you-support-receiving-email-with-imap) باستخدام اسم المستخدم وكلمة المرور الخاصة بك:

   * اسم المستخدم هو الاسم المستعار الكامل مع النطاق الخاص بك مثل `hello@example.com`.
   * كلمة المرور يتم إنشاؤها عشوائيًا وتُعرض لك فقط لمدة 30 ثانية عند النقر على <strong class="text-success"><i class="fa fa-key"></i> إنشاء كلمة مرور</strong> من <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة.
2. بمجرد الاتصال، سيرسل عميل البريد الإلكتروني الخاص بك [أوامر بروتوكول IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) إلى خادم IMAP الخاص بنا لمزامنة صندوق بريدك. يشمل ذلك كتابة وتخزين رسائل البريد الإلكتروني المسودة والإجراءات الأخرى التي قد تقوم بها (مثل تصنيف بريد إلكتروني كـ مهم أو تعليم بريد إلكتروني كبريد مزعج/بريد غير مرغوب فيه).

3. تستقبل خوادم تبادل البريد (المعروفة عادةً باسم خوادم "MX") البريد الوارد الجديد وتخزنه في صندوق بريدك. عند حدوث ذلك، سيتم إعلام عميل البريد الإلكتروني الخاص بك ومزامنة صندوق بريدك. يمكن لخوادم تبادل البريد لدينا إعادة توجيه بريدك الإلكتروني إلى مستلم واحد أو أكثر (بما في ذلك [webhooks](/faq#do-you-support-webhooks))، أو تخزين بريدك الإلكتروني لك في تخزين IMAP المشفر لدينا، **أو كلاهما**!

   > \[!TIP]
   > مهتم بمعرفة المزيد؟ اقرأ [كيفية إعداد إعادة توجيه البريد الإلكتروني](/faq#how-do-i-get-started-and-set-up-email-forwarding)، [كيف يعمل نظام تبادل البريد لدينا](/faq#how-does-your-email-forwarding-system-work)، أو اطلع على [أدلتنا](/guides).

4. خلف الكواليس، يعمل تصميم تخزين البريد الإلكتروني الآمن لدينا بطريقتين للحفاظ على تشفير صناديق بريدك وجعلها متاحة فقط لك:

   * عندما يتم استلام بريد جديد لك من مرسل، تقوم خوادم تبادل البريد لدينا بالكتابة إلى صندوق بريد مؤقت، فردي، ومشفر خاص بك.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

   * عندما تتصل بخادم IMAP الخاص بنا باستخدام عميل البريد الإلكتروني الخاص بك، يتم تشفير كلمة المرور الخاصة بك في الذاكرة وتُستخدم لقراءة وكتابة صندوق بريدك. لا يمكن قراءة أو كتابة صندوق بريدك إلا باستخدام هذه الكلمة السرية. ضع في اعتبارك أنه بما أنك الوحيد الذي يمتلك هذه الكلمة السرية، **فقط أنت** يمكنك قراءة وكتابة صندوق بريدك عند الوصول إليه. في المرة التالية التي يحاول فيها عميل البريد الإلكتروني الخاص بك الاستعلام عن البريد أو المزامنة، سيتم نقل رسائلك الجديدة من صندوق البريد المؤقت هذا وتخزينها في ملف صندوق بريدك الفعلي باستخدام كلمة المرور التي زودتنا بها. لاحظ أن صندوق البريد المؤقت هذا يتم مسحه وحذفه بعد ذلك بحيث يكون فقط صندوق بريدك المحمي بكلمة المرور يحتوي على الرسائل.

   * **إذا كنت متصلاً بـ IMAP (مثل استخدام عميل بريد إلكتروني مثل Apple Mail أو Thunderbird)، فلن نحتاج إلى الكتابة إلى تخزين القرص المؤقت. بدلاً من ذلك، يتم جلب كلمة مرور IMAP المشفرة في الذاكرة واستخدامها. في الوقت الحقيقي، عندما تحاول رسالة التسليم إليك، نرسل طلب WebSocket إلى جميع خوادم IMAP نسألهم إذا كان لديهم جلسة نشطة لك (هذا هو جزء الجلب)، ثم بعد ذلك نمرر كلمة المرور المشفرة في الذاكرة – لذلك لا نحتاج إلى الكتابة إلى صندوق بريد مؤقت، يمكننا الكتابة إلى صندوق بريدك المشفر الفعلي باستخدام كلمة مرورك المشفرة.**

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

5. [يتم عمل نسخ احتياطية لصناديق بريدك المشفرة](#backups) يوميًا. يمكنك أيضًا طلب نسخة احتياطية جديدة في أي وقت أو تنزيل أحدث نسخة احتياطية من <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة. إذا قررت التبديل إلى خدمة بريد إلكتروني أخرى، يمكنك بسهولة الترحيل، التنزيل، التصدير، ومسح صناديق بريدك والنسخ الاحتياطية في أي وقت.


## التقنيات {#technologies}

### قواعد البيانات {#databases}

استكشفنا طبقات تخزين قواعد بيانات أخرى محتملة، لكن لم ترضِ أي منها متطلباتنا بقدر ما فعلت SQLite:
| قاعدة البيانات                                               |                                                                    التشفير أثناء التخزين                                                                   |  [صناديق بريد معزولة](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\))  |                           الترخيص                           | [مستخدمة في كل مكان](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star:       |                          :white_check_mark: نعم مع [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: الملكية العامة              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                          |                   :x: ["متوفر فقط في MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: قاعدة بيانات علائقية                               |                   :x: AGPL و `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)                   |                                             :x: [الشبكة فقط](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: قاعدة بيانات علائقية                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                                 |                                   :x: [غير مختبر وغير مدعوم بعد؟](https://github.com/canonical/dqlite/issues/32)                                  | :x: [غير مختبر وغير مدعوم بعد؟](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)                    |                                :white_check_mark: [نعم](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: قاعدة بيانات علائقية                               | :white_check_mark: `PostgreSQL` (مشابه لـ `BSD` أو `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                              | :white_check_mark: [لـ InnoDB فقط](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: قاعدة بيانات علائقية                               |          :white_check_mark: `GPLv2` و `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)        |                               :x: [ميزة للمؤسسات فقط](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: قاعدة بيانات علائقية                               |                  :x: `BUSL-1.1` وغيرها                  |                             :x:                             |

> هنا [مقالة مدونة تقارن عدة خيارات لتخزين قاعدة بيانات SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) في الجدول أعلاه.

### الأمان {#security}

نستخدم في جميع الأوقات [التشفير أثناء التخزين](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard))، و[التشفير أثناء النقل](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security))، و[DNS عبر HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") باستخدام :tangerine: [Tangerine](https://tangeri.ne)، و[sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) لتشفير صناديق البريد. بالإضافة إلى ذلك نستخدم المصادقة الثنائية القائمة على الرموز (بدلاً من الرسائل النصية التي قد تتعرض لهجمات [الرجل في الوسط](https://en.wikipedia.org/wiki/Man-in-the-middle_attack))، ومفاتيح SSH الدوارة مع تعطيل وصول الجذر، والوصول الحصري إلى الخوادم عبر عناوين IP مقيدة، والمزيد.
في حالة حدوث [هجوم الخادمة الشريرة](https://en.wikipedia.org/wiki/Evil_maid_attack) أو موظف مارق من بائع طرف ثالث، **لا يمكن فتح صندوق بريدك إلا باستخدام كلمة المرور التي قمت بإنشائها**. كن مطمئنًا، نحن لا نعتمد على أي بائعين طرف ثالث سوى مزودي خوادمنا المتوافقة مع SOC Type 2 من Cloudflare وDataPacket وDigital Ocean وGitHub وVultr.

هدفنا هو تقليل عدد [نقاط الفشل الفردية](https://en.wikipedia.org/wiki/Single_point_of_failure) قدر الإمكان.

### صناديق البريد {#mailboxes}

> **ملخص؛** تستخدم خوادم IMAP لدينا قواعد بيانات SQLite مشفرة بشكل فردي لكل صندوق بريد من صناديق بريدك.

[SQLite هي قاعدة بيانات مضمنة شائعة للغاية](https://www.sqlite.org/mostdeployed.html) – وهي تعمل حاليًا على هاتفك وجهاز الكمبيوتر الخاص بك – [وتُستخدم من قبل جميع التقنيات الكبرى تقريبًا](https://www.sqlite.org/famous.html).

على سبيل المثال، على خوادمنا المشفرة هناك قاعدة بيانات SQLite لكل صندوق بريد مثل `linux@example.com` و`info@example.com` و`hello@example.com` وهكذا – واحدة لكل منها كملف قاعدة بيانات `.sqlite`. نحن لا نستخدم عنوان البريد الإلكتروني لتسمية ملفات قاعدة البيانات – بل نستخدم BSON ObjectID وUUID فريدة يتم إنشاؤها والتي لا تكشف عن صاحب صندوق البريد أو عنوان البريد الإلكتروني الخاص به (مثل `353a03f21e534321f5d6e267.sqlite`).

كل من هذه القواعد البيانات مشفرة بنفسها باستخدام كلمة مرورك (التي لا يملكها إلا أنت) باستخدام [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). هذا يعني أن صناديق بريدك مشفرة بشكل فردي، مستقلة، [معزولة](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\))، وقابلة للنقل.

لقد قمنا بضبط SQLite بدقة باستخدام [PRAGMA](https://www.sqlite.org/pragma.html) التالية:

| `PRAGMA`                 | الغرض                                                                                                                                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [تشفير قاعدة بيانات SQLite باستخدام ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). راجع `better-sqlite3-multiple-ciphers` تحت [Projects](#projects) لمزيد من التفاصيل.                                 |
| `key="****************"` | هذه هي كلمة المرور الخاصة بك المفككة في الذاكرة فقط والتي يتم تمريرها عبر اتصال IMAP الخاص بعميل البريد الإلكتروني إلى خادمنا. يتم إنشاء وإغلاق نسخ جديدة من قاعدة البيانات لكل جلسة قراءة وكتابة (لضمان العزل والحماية).                            |
| `journal_model=WAL`      | سجل الكتابة المسبق ("[WAL](https://www.sqlite.org/wal.html)") [الذي يعزز الأداء ويسمح بالوصول المتزامن للقراءة](https://litestream.io/tips/#wal-journal-mode).                                                                                         |
| `busy_timeout=5000`      | يمنع أخطاء قفل الكتابة [أثناء تنفيذ عمليات كتابة أخرى](https://litestream.io/tips/#busy-timeout).                                                                                                                                                      |
| `synchronous=NORMAL`     | يزيد من متانة المعاملات [دون خطر تلف البيانات](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                                         |
| `foreign_keys=ON`        | يفرض التحقق من مراجع المفاتيح الأجنبية (مثل العلاقة من جدول إلى آخر). [بشكل افتراضي هذا غير مفعل في SQLite](https://www.sqlite.org/foreignkeys.html)، ولكن من أجل التحقق وسلامة البيانات يجب تفعيله.                                                  |
| `encoding='UTF-8'`       | [الترميز الافتراضي](https://www.sqlite.org/pragma.html#pragma_encoding) المستخدم لضمان سلامة المطور.                                                                                                                                                      |
> جميع الإعدادات الافتراضية الأخرى من SQLite كما هو محدد في [توثيق PRAGMA الرسمي](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### التزامن {#concurrency}

> **ملخص؛** نستخدم `WebSocket` للقراءات والكتابات المتزامنة إلى صناديق البريد المشفرة الخاصة بك في SQLite.

#### القراءات {#reads}

قد يقوم عميل البريد الإلكتروني على هاتفك بحل `imap.forwardemail.net` إلى أحد عناوين IP الخاصة بنا في Digital Ocean – وقد يقوم عميل سطح المكتب بحل عنوان IP منفصل من [مزود](#providers) مختلف تمامًا.

بغض النظر عن خادم IMAP الذي يتصل به عميل البريد الإلكتروني الخاص بك، نريد أن تكون الاتصال لقراءة قاعدة البيانات في الوقت الحقيقي بدقة 100%. يتم ذلك من خلال WebSockets.

#### الكتابات {#writes}

الكتابة إلى قاعدة البيانات الخاصة بك مختلفة قليلاً – حيث أن SQLite هي قاعدة بيانات مضمنة وصندوق بريدك يعيش في ملف واحد بشكل افتراضي.

لقد استكشفنا خيارات مثل `litestream`، و `rqlite`، و `dqlite` أدناه – ولكن لم ترق أي منها لمتطلباتنا.

لإنجاز الكتابات مع تمكين تسجيل الكتابة المسبق ("[WAL](https://www.sqlite.org/wal.html)") – نحتاج إلى التأكد من أن خادمًا واحدًا فقط ("الرئيسي") مسؤول عن ذلك. [WAL](https://www.sqlite.org/wal.html) يسرع بشكل كبير التزامن ويسمح لكاتب واحد وعدة قراء.

الخادم الرئيسي يعمل على خوادم البيانات مع الأقراص المركبة التي تحتوي على صناديق البريد المشفرة. من ناحية التوزيع، يمكنك اعتبار جميع خوادم IMAP الفردية خلف `imap.forwardemail.net` خوادم ثانوية ("ثانوية").

ننجز الاتصال ثنائي الاتجاه باستخدام [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* تستخدم الخوادم الرئيسية نسخة من خادم `WebSocketServer` من [ws](https://github.com/websockets/ws).
* تستخدم الخوادم الثانوية نسخة من عميل `WebSocket` من [ws](https://github.com/websockets/ws) مغلفة بـ [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) و [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). هذان الغلافان يضمنان أن `WebSocket` يعيد الاتصال ويمكنه إرسال واستقبال البيانات لكتابات قاعدة بيانات محددة.

### النسخ الاحتياطية {#backups}

> **ملخص؛** يتم عمل نسخ احتياطية لصناديق بريدك المشفرة يوميًا. يمكنك أيضًا طلب نسخة احتياطية جديدة فورًا أو تنزيل أحدث نسخة احتياطية في أي وقت من <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">حسابي <i class="fa fa-angle-right"></i> النطاقات</a> <i class="fa fa-angle-right"></i> الأسماء المستعارة.

بالنسبة للنسخ الاحتياطية، نقوم ببساطة بتشغيل أمر SQLite `VACUUM INTO` يوميًا أثناء معالجة أوامر IMAP، والذي يستفيد من كلمة المرور المشفرة الخاصة بك من اتصال IMAP في الذاكرة. يتم تخزين النسخ الاحتياطية إذا لم يتم اكتشاف نسخة احتياطية موجودة أو إذا تغيرت قيمة [SHA-256](https://en.wikipedia.org/wiki/SHA-2) للملف مقارنةً بأحدث نسخة احتياطية.

لاحظ أننا نستخدم أمر `VACUUM INTO` بدلاً من الأمر المدمج `backup` لأنه إذا تم تعديل صفحة أثناء عملية أمر `backup`، فعليه أن يبدأ من جديد. يأخذ أمر `VACUUM INTO` لقطة. راجع هذه التعليقات على [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) و [Hacker News](https://news.ycombinator.com/item?id=31387556) لمزيد من الفهم.

بالإضافة إلى ذلك، نستخدم `VACUUM INTO` بدلاً من `backup`، لأن أمر `backup` سيترك قاعدة البيانات غير مشفرة لفترة وجيزة حتى يتم استدعاء `rekey` (انظر هذا التعليق على GitHub [comment](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) لفهم أعمق).

سيقوم الخادم الثانوي بإعطاء تعليمات للخادم الرئيسي عبر اتصال `WebSocket` لتنفيذ النسخ الاحتياطي – ثم يتلقى الخادم الرئيسي الأمر للقيام بذلك وبعدها:

1. الاتصال بصندوق بريدك المشفر.
2. الحصول على قفل كتابة.
3. تشغيل نقطة تحقق WAL عبر `wal_checkpoint(PASSIVE)`.
4. تشغيل أمر SQLite `VACUUM INTO`.
5. التأكد من أن الملف المنسوخ يمكن فتحه باستخدام كلمة المرور المشفرة (كإجراء أمان/تأكيد).
6. رفعه إلى Cloudflare R2 للتخزين (أو إلى مزودك الخاص إذا تم تحديده).
<!--
7. قم بضغط ملف النسخة الاحتياطية الناتج باستخدام `gzip`.
8. قم برفعه إلى Cloudflare R2 للتخزين (أو إلى مزودك الخاص إذا تم تحديده).
-->

تذكر أن صناديق بريدك مشفرة – وبينما لدينا قيود على عناوين IP وإجراءات تحقق أخرى للاتصالات عبر WebSocket – في حالة وجود جهة خبيثة، يمكنك الاطمئنان إلى أنه ما لم يكن حمولة WebSocket تحتوي على كلمة مرور IMAP الخاصة بك، فلن تتمكن من فتح قاعدة بياناتك.

يتم تخزين نسخة احتياطية واحدة فقط لكل صندوق بريد في الوقت الحالي، ولكن في المستقبل قد نقدم استعادة نقطة زمنية ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### البحث {#search}

تدعم خوادم IMAP لدينا أمر `SEARCH` مع استعلامات معقدة، وتعبيرات منتظمة، والمزيد.

يعود الأداء السريع للبحث إلى [FTS5](https://www.sqlite.org/fts5.html) و [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

نخزن قيم `Date` في صناديق بريد SQLite كسلاسل [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) عبر [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (مع توقيت UTC لكي تعمل مقارنات المساواة بشكل صحيح).

يتم أيضًا تخزين الفهارس لجميع الخصائص التي توجد في استعلامات البحث.

### المشاريع {#projects}

إليك جدول يوضح المشاريع التي نستخدمها في شفرتنا المصدرية وعملية التطوير (مرتبة أبجديًا):

| المشروع                                                                                      | الغرض                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Ansible](https://www.ansible.com/)                                                          | منصة أتمتة DevOps لصيانة وتوسيع وإدارة أسطول خوادمنا بالكامل بسهولة.                                                                                                                                                                                                                                                                                              |
| [Bree](https://github.com/breejs/bree)                                                       | مجدول مهام لـ Node.js و JavaScript مع دعم cron، والتواريخ، و ms، و later، ودعم سهل الاستخدام للبشر.                                                                                                                                                                                                                                                                |
| [Cabin](https://github.com/cabinjs/cabin)                                                    | مكتبة تسجيل JavaScript و Node.js صديقة للمطور مع مراعاة الأمان والخصوصية.                                                                                                                                                                                                                                                                                           |
| [Lad](https://github.com/ladjs/lad)                                                          | إطار عمل Node.js الذي يدعم كامل هندستنا وتصميمنا الهندسي مع MVC والمزيد.                                                                                                                                                                                                                                                                                           |
| [MongoDB](https://www.mongodb.com/)                                                          | حل قاعدة بيانات NoSQL نستخدمه لتخزين جميع البيانات الأخرى خارج صناديق البريد (مثل حسابك، الإعدادات، النطاقات، وتكوينات الأسماء المستعارة).                                                                                                                                                                                                                      |
| [Mongoose](https://github.com/Automattic/mongoose)                                           | نمذجة مستندات MongoDB ("ODM") التي نستخدمها عبر كامل البنية التحتية لدينا. كتبنا مساعدين خاصين يسمحون لنا بالاستمرار ببساطة في استخدام **Mongoose مع SQLite** :tada:                                                                                                                                                                                           |
| [Node.js](https://nodejs.org/en)                                                             | Node.js هو بيئة تشغيل جافاسكريبت مفتوحة المصدر وعبر المنصات التي تشغل جميع عمليات الخادم لدينا.                                                                                                                                                                                                                                                                  |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                       | حزمة Node.js لإرسال البريد الإلكتروني، وإنشاء الاتصالات، والمزيد. نحن راعٍ رسمي لهذا المشروع.                                                                                                                                                                                                                                                                     |
| [Redis](https://redis.io/)                                                                   | قاعدة بيانات في الذاكرة للتخزين المؤقت، وقنوات النشر/الاشتراك، وطلبات DNS عبر HTTPS.                                                                                                                                                                                                                                                                             |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                   | امتداد تشفير لـ SQLite يسمح بتشفير ملفات قاعدة البيانات بالكامل (بما في ذلك سجل الكتابة المسبق ("[WAL](https://www.sqlite.org/wal.html)"), الدفتر، التراجع، …).                                                                                                                                                                                                   |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                  | محرر SQLite بصري (يمكنك استخدامه أيضًا) لاختبار، وتنزيل، وعرض صناديق البريد التطويرية.                                                                                                                                                                                                                                                                          |
| [SQLite](https://www.sqlite.org/about.html)                                                  | طبقة قاعدة بيانات مضمنة لتخزين IMAP قابل للتوسع، مستقل، سريع، وموثوق.                                                                                                                                                                                                                                                                                            |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                   | أداة مكافحة البريد المزعج، تصفية البريد الإلكتروني، ومنع التصيد لـ Node.js (بديلنا لـ [Spam Assassin](https://spamassassin.apache.org/) و [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                              |
| [Tangerine](https://tangeri.ne)                                                              | طلبات DNS عبر HTTPS مع Node.js والتخزين المؤقت باستخدام Redis – مما يضمن الاتساق العالمي والمزيد.                                                                                                                                                                                                                                                                  |
| [Thunderbird](https://www.thunderbird.net/)                                                  | يستخدم فريق التطوير لدينا هذا (وينصح به أيضًا) كـ **عميل البريد الإلكتروني المفضل للاستخدام مع Forward Email**.                                                                                                                                                                                                                                                  |
| [UTM](https://github.com/utmapp/UTM)                                                         | يستخدم فريق التطوير لدينا هذا لإنشاء آلات افتراضية لنظامي iOS و macOS لاختبار عملاء البريد الإلكتروني المختلفين (بالتوازي) مع خوادم IMAP و SMTP لدينا.                                                                                                                                                                                                         |
| [Ubuntu](https://ubuntu.com/download/server)                                                 | نظام تشغيل خادم حديث مفتوح المصدر مبني على Linux يشغل كل بنيتنا التحتية.                                                                                                                                                                                                                                                                                          |
| [WildDuck](https://github.com/nodemailer/wildduck)                                           | مكتبة خادم IMAP – راجع ملاحظاته حول [إلغاء تكرار المرفقات](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) و [دعم بروتوكول IMAP](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                                                |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | مكتبة API سريعة وبسيطة لـ Node.js للتفاعل برمجيًا مع SQLite3.                                                                                                                                                                                                                                                                                                   |
| [email-templates](https://github.com/forwardemail/email-templates)                           | إطار عمل بريد إلكتروني صديق للمطور لإنشاء، ومعاينة، وإرسال رسائل بريد إلكتروني مخصصة (مثل إشعارات الحساب والمزيد).                                                                                                                                                                                                                                               |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                       | منشئ استعلامات SQL باستخدام بناء جملة على نمط Mongo. يوفر هذا الوقت لفريق التطوير لدينا لأننا نستطيع الاستمرار في الكتابة بأسلوب Mongo عبر كامل البنية التحتية مع نهج مستقل عن قاعدة البيانات. **كما يساعد على تجنب هجمات حقن SQL باستخدام معلمات الاستعلام.**                                                                                             |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                       | أداة SQL لاستخراج معلومات حول مخطط قاعدة البيانات الحالي. يسمح لنا هذا بالتحقق بسهولة من أن جميع الفهارس، والجداول، والأعمدة، والقيود، والمزيد صحيحة ومتطابقة `1:1` مع ما يجب أن تكون عليه. كتبنا حتى مساعدين آليين لإضافة أعمدة وفهارس جديدة إذا تم إجراء تغييرات على مخططات قواعد البيانات (مع تنبيهات خطأ مفصلة للغاية أيضًا).                |
| [knex](https://github.com/knex/knex)                                                         | منشئ استعلامات SQL نستخدمه فقط لترحيل قواعد البيانات والتحقق من المخطط عبر `knex-schema-inspector`.                                                                                                                                                                                                                                                               |
| [mandarin](https://github.com/ladjs/mandarin)                                                | ترجمة عبارات [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) تلقائية مع دعم Markdown باستخدام [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                                 |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                          | حزمة Node.js لحل وإنشاء الاتصالات مع خوادم MX والتعامل مع الأخطاء.                                                                                                                                                                                                                                                                                               |
| [pm2](https://github.com/Unitech/pm2)                                                        | مدير عمليات إنتاج Node.js مع موازن تحميل مدمج ([محسن](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) للأداء).                                                                                                                                                                                                                                   |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                     | مكتبة خادم SMTP – نستخدمها لخوادم تبادل البريد ("MX") وخوادم SMTP الصادرة.                                                                                                                                                                                                                                                                                       |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                | أداة مفيدة لاختبار خوادم IMAP مقابل المعايير ومواصفات RFC لبروتوكول IMAP. تم إنشاء هذا المشروع بواسطة فريق [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (خادم IMAP و POP3 مفتوح المصدر نشط منذ يوليو 2002). اختبرنا خادم IMAP لدينا بشكل مكثف باستخدام هذه الأداة.                                                                                 |
> يمكنك العثور على مشاريع أخرى نستخدمها في [رمز المصدر الخاص بنا على GitHub](https://github.com/forwardemail).

### المزودون {#providers}

| المزود                                        | الغرض                                                                                                                      |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | مزود DNS، فحوصات الصحة، موازنات التحميل، وتخزين النسخ الاحتياطية باستخدام [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | استضافة رمز المصدر، التكامل المستمر/التسليم المستمر، وإدارة المشاريع.                                                                          |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | استضافة خوادم مخصصة وقواعد بيانات مُدارة.                                                                              |
| [Vultr](https://www.vultr.com/?ref=7429848)     | استضافة خوادم مخصصة.                                                                                                    |
| [DataPacket](https://www.datapacket.com)        | استضافة خوادم مخصصة.                                                                                                    |


## الأفكار {#thoughts}

### المبادئ {#principles}

تم تصميم Forward Email وفقًا لهذه المبادئ:

1. كن دائمًا صديقًا للمطورين، مع التركيز على الأمان والخصوصية، والشفافية.
2. الالتزام بـ [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)، [Unix](https://en.wikipedia.org/wiki/Unix_philosophy)، [KISS](https://en.wikipedia.org/wiki/KISS_principle)، [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)، [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)، [Twelve Factor](https://12factor.net/)، [موسى أوكام](https://en.wikipedia.org/wiki/Occam%27s_razor)، و [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. استهداف المطورين المبتدئين، المعتمدين على الذات، و[الذين يحققون أرباحًا بالكاد](http://www.paulgraham.com/ramenprofitable.html)

### التجارب {#experiments}

> **ملخص؛** في النهاية، استخدام تخزين الكائنات المتوافق مع S3 و/أو الجداول الافتراضية ليس ممكنًا تقنيًا لأسباب تتعلق بالأداء وعرضة للأخطاء بسبب قيود الذاكرة.

لقد أجرينا بعض التجارب التي أدت إلى حل SQLite النهائي كما نوقش أعلاه.

كان أحد هذه التجارب محاولة استخدام [rclone]() و SQLite معًا مع طبقة تخزين متوافقة مع S3.

قادنا هذا التجربة إلى فهم واكتشاف حالات حافة حول استخدام rclone و SQLite و [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* إذا قمت بتمكين العلم `--vfs-cache-mode writes` مع rclone، فستكون عمليات القراءة جيدة، ولكن عمليات الكتابة سيتم تخزينها مؤقتًا.
  * إذا كان لديك عدة خوادم IMAP موزعة عالميًا، فسيكون التخزين المؤقت غير متزامن بينها ما لم يكن لديك كاتب واحد ومستمعون متعددون (مثل نهج النشر/الاشتراك).
  * هذا معقد للغاية وإضافة أي تعقيد إضافي مثل هذا سيؤدي إلى المزيد من نقاط الفشل الفردية.
  * مزودو التخزين المتوافقون مع S3 لا يدعمون تغييرات الملفات الجزئية – مما يعني أن أي تغيير في ملف `.sqlite` سيؤدي إلى تغيير كامل وإعادة تحميل قاعدة البيانات.
  * توجد حلول أخرى مثل `rsync`، لكنها ليست موجهة لدعم سجل الكتابة المسبق ("[WAL](https://www.sqlite.org/wal.html)") – لذلك انتهى بنا الأمر بمراجعة Litestream. لحسن الحظ، استخدامنا للتشفير يقوم بالفعل بتشفير ملفات [WAL](https://www.sqlite.org/wal.html) لنا، لذا لا نحتاج للاعتماد على Litestream لذلك. ومع ذلك، لم نكن واثقين بعد من Litestream للاستخدام في الإنتاج ولدينا بعض الملاحظات أدناه حول ذلك.
  * استخدام هذا الخيار `--vfs-cache-mode writes` (الطريقة *الوحيدة* لاستخدام SQLite عبر `rclone` للكتابة) سيحاول نسخ قاعدة البيانات بالكامل من البداية في الذاكرة – التعامل مع صندوق بريد بحجم 10 جيجابايت مقبول، لكن التعامل مع صناديق بريد متعددة ذات تخزين عالي جدًا سيسبب لخوادم IMAP الوصول إلى حدود الذاكرة وأخطاء `ENOMEM`، أعطال التقسيم، وتلف البيانات.
* إذا حاولت استخدام [الجداول الافتراضية](https://www.sqlite.org/vtab.html) في SQLite (مثل استخدام [s3db](https://github.com/jrhy/s3db)) لجعل البيانات تعيش على طبقة تخزين متوافقة مع S3، فستواجه عدة مشاكل أخرى:
  * ستكون عمليات القراءة والكتابة بطيئة جدًا لأن نقاط نهاية API الخاصة بـ S3 ستحتاج إلى استدعاءات HTTP `GET`، `PUT`، `HEAD`، و `POST`.
  * أظهرت اختبارات التطوير أن تجاوز 500 ألف إلى مليون سجل على الإنترنت الليفي لا يزال محدودًا بمعدل نقل البيانات للكتابة والقراءة إلى مزودي التخزين المتوافقين مع S3. على سبيل المثال، قام مطورونا بتشغيل حلقات `for` لتنفيذ بيانات SQL `INSERT` متسلسلة وأخرى تكتب كميات كبيرة من البيانات دفعة واحدة. في كلتا الحالتين، كان الأداء بطيئًا بشكل مذهل.
  * الجداول الافتراضية **لا يمكن أن تحتوي على فهارس**، أو بيانات `ALTER TABLE`، و[قيود](https://stackoverflow.com/a/12507650) [أخرى](https://sqlite.org/lang_createvtab.html) – مما يؤدي إلى تأخيرات تصل إلى دقيقة أو دقيقتين أو أكثر حسب كمية البيانات.
  * تم تخزين الكائنات بدون تشفير ولا يتوفر دعم تشفير أصلي بسهولة.
* استكشفنا أيضًا استخدام [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) الذي يشبه من الناحية المفاهيمية والتقنية النقطة السابقة (لذا لديه نفس المشاكل). من الممكن استخدام بناء مخصص لـ `sqlite3` مغلف بالتشفير مثل [wxSQLite3](https://github.com/utelle/wxsqlite3) (الذي نستخدمه حاليًا في حلنا أعلاه) من خلال [تعديل ملف الإعداد](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* نهج محتمل آخر هو استخدام [امتداد multiplex](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c)، لكنه محدود بسعة 32 جيجابايت وسيتطلب بناء معقد ومشاكل تطوير.
* بيانات `ALTER TABLE` مطلوبة (لذا هذا يستبعد تمامًا استخدام الجداول الافتراضية). نحن بحاجة إلى بيانات `ALTER TABLE` لكي يعمل الربط مع `knex-schema-inspector` بشكل صحيح – مما يضمن عدم تلف البيانات وأن الصفوف المسترجعة يمكن تحويلها إلى مستندات صالحة وفقًا لتعريفات مخطط `mongoose` الخاصة بنا (والتي تشمل التحقق من القيود، نوع المتغير، والتحقق من صحة البيانات التعسفية).
* تقريبًا جميع مشاريع S3 المتوافقة مع SQLite في مجتمع المصدر المفتوح مكتوبة بلغة Python (وليس JavaScript التي نستخدمها في 100% من مكدسنا).
* مكتبات الضغط مثل [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (انظر [التعليقات](https://news.ycombinator.com/item?id=32303762)) تبدو واعدة، لكنها [قد لا تكون جاهزة للاستخدام الإنتاجي بعد](https://github.com/phiresky/sqlite-zstd#usage). بدلاً من ذلك، سيكون الضغط على جانب التطبيق لأنواع البيانات مثل `String`، `Object`، `Map`، `Array`، `Set`، و `Buffer` نهجًا أنظف وأسهل (وأيضًا أسهل للهجرة، حيث يمكننا تخزين علم `Boolean` أو عمود – أو حتى استخدام `PRAGMA` `user_version=1` للضغط أو `user_version=0` لعدم الضغط كبيانات وصفية لقاعدة البيانات).
  * لحسن الحظ، لدينا بالفعل إزالة التكرار للمرفقات في تخزين خادم IMAP – لذلك كل رسالة تحتوي على نفس المرفق لن تحتفظ بنسخة من المرفق – بدلاً من ذلك يتم تخزين مرفق واحد لرسائل وخيوط متعددة في صندوق البريد (ويتم استخدام مرجع خارجي لاحقًا).
* مشروع Litestream، وهو حل تكرار ونسخ احتياطي لـ SQLite، واعد جدًا ومن المرجح أن نستخدمه في المستقبل.
  * ليس لتقليل من قيمة المؤلفين – لأننا نحب عملهم ومساهماتهم في المصدر المفتوح لأكثر من عقد من الزمن – لكن من الاستخدام الواقعي يبدو أن هناك [الكثير من المشاكل](https://github.com/benbjohnson/litestream/issues) و[خطر فقدان البيانات من الاستخدام](https://github.com/benbjohnson/litestream/issues/218).
* يجب أن يكون استعادة النسخ الاحتياطية سهلة وبسيطة. استخدام حل مثل MongoDB مع `mongodump` و `mongoexport` ليس فقط مملًا، بل يستغرق وقتًا طويلاً وله تعقيد في الإعداد.
  * قواعد بيانات SQLite تجعل الأمر بسيطًا (إنها ملف واحد).
  * أردنا تصميم حل يمكن للمستخدمين من خلاله أخذ صندوق بريدهم والمغادرة في أي لحظة.
    * أوامر Node.js بسيطة مثل `fs.unlink('mailbox.sqlite'))` ويتم مسحه نهائيًا من التخزين على القرص.
    * يمكننا أيضًا استخدام API متوافق مع S3 مع HTTP `DELETE` لإزالة اللقطات والنسخ الاحتياطية بسهولة للمستخدمين.
  * كانت SQLite الحل الأبسط، الأسرع، والأكثر فعالية من حيث التكلفة.
### نقص البدائل {#lack-of-alternatives}

حسب علمنا، لا توجد خدمات بريد إلكتروني أخرى مصممة بهذه الطريقة ولا هي مفتوحة المصدر.

نعتقد أن هذا قد يكون بسبب اعتماد خدمات البريد الإلكتروني الحالية على تكنولوجيا قديمة في الإنتاج مع [كود معقد](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

معظم، إن لم يكن كل، مزودي خدمات البريد الإلكتروني الحاليين إما مغلقو المصدر أو يعلنون أنهم مفتوحو المصدر، **لكن في الواقع فقط الواجهة الأمامية لهم هي مفتوحة المصدر.**

**أكثر جزء حساس في البريد الإلكتروني** (التخزين الفعلي/التفاعل مع IMAP/SMTP) **يتم كله في الخلفية (الخادم)، *وليس* في الواجهة الأمامية (العميل)**.

### جرب Forward Email {#try-out-forward-email}

سجل اليوم على <https://forwardemail.net>! :rocket:
