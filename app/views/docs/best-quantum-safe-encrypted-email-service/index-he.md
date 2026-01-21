# דוא"ל עמיד בפני קוונטים: כיצד אנו משתמשים בתיבות דואר מוצפנות של SQLite כדי לשמור על הדוא"ל שלך בטוח {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />

## תוכן עניינים

* [הַקדָמָה](#foreword)
* [השוואה בין ספקי שירותי דוא"ל](#email-service-provider-comparison)
* [איך זה עובד](#how-does-it-work)
* [טכנולוגיות](#technologies)
  * [מאגרי מידע](#databases)
  * [בִּטָחוֹן](#security)
  * [תיבות דואר](#mailboxes)
  * [מקביליות](#concurrency)
  * [גיבויים](#backups)
  * [לְחַפֵּשׂ](#search)
  * [פרויקטים](#projects)
  * [ספקים](#providers)
* [מחשבות](#thoughts)
  * [עקרונות](#principles)
  * [ניסויים](#experiments)
  * [חוסר בחלופות](#lack-of-alternatives)
  * [נסה העברת דוא"ל](#try-out-forward-email)

## הקדמה {#foreword}

> \[!IMPORTANT]
> שירות הדוא"ל שלנו הוא [100% קוד פתוח](https://github.com/forwardemail) וממוקד בפרטיות באמצעות תיבות דואר SQLite מאובטחות ומוצפנות.

עד שהשקנו את [תמיכה ב-IMAP](/faq#do-you-support-receiving-email-with-imap), השתמשנו ב-MongoDB לצורכי אחסון הנתונים המתמשכים שלנו.

הטכנולוגיה הזו מדהימה ואנחנו עדיין משתמשים בה היום – אבל כדי לקבל הצפנה במנוחה עם MongoDB צריך להשתמש בספק שמציע MongoDB Enterprise, כמו Digital Ocean או Mongo Atlas – או לשלם עבור רישיון ארגוני (ובעקבות זאת לעבוד עם זמן השהייה של צוות המכירות).

הצוות שלנו ב-[העברת דוא"ל](https://forwardemail.net) היה זקוק לפתרון אחסון מוצפן, אמין, ידידותי למפתחים, הניתן להרחבה, עבור תיבות דואר של IMAP. כמפתחי קוד פתוח, שימוש בטכנולוגיה שעליכם לשלם דמי רישיון כדי לקבל את תכונת ההצפנה במנוחה עמד בניגוד ל-[העקרונות שלנו](#principles) - ולכן ניסינו, חקרנו ופיתחנו פתרון חדש מאפס כדי לענות על צרכים אלה.

במקום להשתמש במסד נתונים משותף לאחסון תיבות הדואר שלכם, אנו מאחסנים ומצפינים את תיבות הדואר שלכם באופן פרטני באמצעות הסיסמה שלכם (שיש רק לכם). **שירות הדוא"ל שלנו כל כך מאובטח שאם תשכחו את הסיסמה, תאבדו את תיבת הדואר שלכם** (ותצטרכו לשחזר אותה באמצעות גיבויים לא מקוונים או להתחיל מחדש).

המשיכו לקרוא כשאנחנו צוללים לעומק למטה עם [השוואה בין ספקי שירותי דוא"ל](#email-service-provider-comparison), [איך השירות שלנו עובד](#how-does-it-work), [מחסנית הטכנולוגיה שלנו](#technologies) ועוד.

## השוואה בין ספקי שירותי דוא"ל {#email-service-provider-comparison}

אנחנו ספק שירותי הדוא"ל היחיד בקוד פתוח לחלוטין ובעל מודעות פרטיות, המאחסן תיבות דואר של SQLite מוצפנות בנפרד, מציע מספר בלתי מוגבל של דומיינים, כינויים ומשתמשים, ותמיכה ב-SMTP, IMAP ו-POP3 יוצאים:

בניגוד לספקי דוא"ל אחרים, אינך צריך לשלם עבור אחסון על בסיס דומיין או כינוי עם Forward Email.** האחסון משותף לכל החשבון שלך - כך שאם יש לך מספר שמות דומיין מותאמים אישית וכינויים מרובים בכל אחד מהם, אנחנו הפתרון המושלם עבורך. שים לב שעדיין תוכל לאכוף מגבלות אחסון אם תרצה בכך על בסיס דומיין או כינוי.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">קרא השוואת שירותי דוא"ל <i class="fa fa-search-plus"></i></a>

## איך זה עובד {#how-does-it-work}

1. באמצעות תוכנת הדוא"ל שלך, כגון Apple Mail, Thunderbird, Gmail או Outlook – אתה מתחבר לשרתי [IMAP](/faq#do-you-support-receiving-email-with-imap) המאובטחים שלנו באמצעות שם המשתמש והסיסמה שלך:

* שם המשתמש שלך הוא הכינוי המלא שלך עם הדומיין שלך, כגון `hello@example.com`.
* הסיסמה שלך נוצרת באופן אקראי ומוצגת לך רק למשך 30 שניות כשאתה לוחץ על <strong class="text-success"><i class="fa fa-key"></i> צור סיסמה</strong> מתוך <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים.

2. לאחר החיבור, תוכנת הדוא"ל שלך תשלח את הקוד [פקודות פרוטוקול IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) לשרת ה-IMAP שלנו כדי לשמור על סנכרון תיבת הדואר שלך. זה כולל כתיבה ואחסון של טיוטות דוא"ל ופעולות אחרות שאתה עשוי לבצע (למשל, סמן דוא"ל כחשוב או סמן דוא"ל כספאם/דואר זבל).

3. שרתי דואר אלקטרוני (הידועים בדרך כלל כשרתי "MX") מקבלים דואר אלקטרוני נכנס חדש ומאחסנים אותו בתיבת הדואר שלך. כאשר זה קורה, לקוח הדוא"ל שלך יקבל הודעה ויסנכרן את תיבת הדואר שלך. שרתי דואר אלקטרוני שלנו יכולים להעביר את הדוא"ל שלך לנמען אחד או יותר (כולל [ווים לרשת](/faq#do-you-support-webhooks)), לאחסן את הדוא"ל שלך עבורך באחסון IMAP מוצפן שלך אצלנו, **או שניהם**!

> \[!TIP]
> מעוניינים ללמוד עוד? קראו את [כיצד להגדיר העברת דוא"ל](/faq#how-do-i-get-started-and-set-up-email-forwarding), [כיצד פועל שירות חילופי הדואר שלנו](/faq#how-does-your-email-forwarding-system-work), או צפו ב-[המדריכים שלנו](/guides).

4. מאחורי הקלעים, עיצוב אחסון הדוא"ל המאובטח שלנו פועל בשתי דרכים כדי לשמור על תיבות הדואר שלך מוצפנות ונגישות רק לך:

* כאשר מתקבל עבורך דואר חדש משולח, שרתי חילופי הדואר שלנו כותבים לתיבת דואר זמנית, אישית ומוצפנת עבורך.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* כאשר אתם מתחברים לשרת ה-IMAP שלנו באמצעות תוכנת הדוא"ל שלכם, הסיסמה שלכם מוצפנת בזיכרון ומשמשת לקריאה וכתיבה לתיבת הדואר שלכם. ניתן לקרוא ולכתוב לתיבת הדואר שלכם רק באמצעות סיסמה זו. זכרו שמכיוון שאתם היחידים עם סיסמה זו, **רק אתם** יכולים לקרוא ולכתוב לתיבת הדואר שלכם כשאתם ניגשים אליה. בפעם הבאה שתתכנת הדוא"ל שלכם ינסה לחפש דואר או לסנכרן, ההודעות החדשות שלכם יועברו מתיבת הדואר הזמנית הזו ויאוחסנו בקובץ תיבת הדואר בפועל באמצעות הסיסמה שסיפקתם. שימו לב שתיבת הדואר הזמנית הזו נמחקת לאחר מכן, כך שרק תיבת הדואר המוגנת בסיסמה שלכם מכילה את ההודעות.

אם אתם מחוברים ל-IMAP (למשל, באמצעות תוכנת דוא"ל כמו Apple Mail או Thunderbird), איננו צריכים לכתוב לאחסון דיסק זמני. סיסמת ה-IMAP המוצפנת בזיכרון שלכם נלקחת ונעשה בה שימוש. בזמן אמת, כאשר מנסים לשלוח הודעה אליכם, אנו שולחים בקשת WebSocket לכל שרתי ה-IMAP ושואלים אותם אם יש להם הפעלה פעילה עבורכם (זהו חלק האחזור), ולאחר מכן נעביר את הסיסמה המוצפנת בזיכרון - כך שלא נצטרך לכתוב לתיבת דואר זמנית, נוכל לכתוב לתיבת הדואר המוצפנת שלכם באמצעות הסיסמה המוצפנת.

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

5. גיבויים [גיבויים של תיבות הדואר המוצפנות שלך](#backups) מתבצעים מדי יום. ניתן גם לבקש גיבוי חדש בכל עת או להוריד את הגיבוי האחרון מ-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i> כינויים. אם תחליט לעבור לשירות דוא"ל אחר, תוכל בקלות להעביר, להוריד, לייצא ולנקות את תיבות הדואר והגיבויים שלך בכל עת.

## טכנולוגיות {#technologies}

### מסדי נתונים {#databases}

בדקנו שכבות אחסון אפשריות אחרות של מסדי נתונים, אך אף אחת מהן לא עמדה בדרישות שלנו כמו SQLite:

| מסד נתונים | הצפנה במנוחה | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) תיבות דואר | רִשָׁיוֹן | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: | :white_check_mark: כן עם [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :סימן_וי_לבן: | :white_check_mark: נחלת הכלל | :סימן_וי_לבן: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: מסד נתונים יחסי | :x: AGPL ו-`SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: מסד נתונים יחסי | :סימן_וי_לבן: __קוד_תא_0__ | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :סימן_וי_לבן: __קוד_תא_0__ | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :סימן_וי_לבן: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: מסד נתונים יחסי | :white_check_mark: `PostgreSQL` (דומה ל-`BSD` או `MIT`) | :x: |
| [MariaDB](https://mariadb.com/) | :סימן_וי_לבן: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: מסד נתונים יחסי | :סימן_וי_לבן: `GPLv2` ו-`BUSL-1.1` | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: מסד נתונים יחסי | :x: `BUSL-1.1` ואחרים | :x: |

> הנה [פוסט בבלוג שמשווה מספר אפשרויות אחסון של מסדי נתונים של SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) בטבלה למעלה.

### אבטחה {#security}

בכל עת אנו משתמשים בהצפנות [הצפנה במנוחה](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [הצפנה בתהליך העברה](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS דרך HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") תוך שימוש בהצפנות :tangerine: [מַנדָרִינָה](https://tangeri.ne), ו-[סקליט](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([צ'אצ'ה20-פולי1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) בתיבות דואר. בנוסף, אנו משתמשים באימות דו-שלבי מבוסס טוקנים (בניגוד ל-SMS שחשוד ב-[התקפות אדם באמצע](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), במפתחות SSH מסתובבים עם גישת root מושבתת, גישה בלעדית לשרתים דרך כתובות IP מוגבלות ועוד.

במקרה של עובד [התקפת עוזרת בית רעה](https://en.wikipedia.org/wiki/Evil_maid_attack) או עובד סורר מספק צד שלישי, **עדיין ניתן לפתוח את תיבת הדואר שלך רק באמצעות הסיסמה שיצרת**. היו סמוכים ובטוחים, איננו מסתמכים על ספקי צד שלישי מלבד ספקי שרתי התלונות מסוג SOC 2 שלנו, Cloudflare, DataPacket, Digital Ocean ו-Vultr.

המטרה שלנו היא שיהיו כמה שפחות [נקודת כשלים אחת](https://en.wikipedia.org/wiki/Single_point_of_failure).

### תיבות דואר {#mailboxes}

> **tldr;** שרתי ה-IMAP שלנו משתמשים במסדי נתונים של SQLite מוצפנים בנפרד עבור כל אחת מתיבות הדואר שלך.

מסד הנתונים המוטמע [SQLite פופולרי ביותר](https://www.sqlite.org/mostdeployed.html) – הוא פועל כעת בטלפון ובמחשב שלך – [ומשמשים כמעט את כל הטכנולוגיות העיקריות](https://www.sqlite.org/famous.html).

לדוגמה, בשרתים המוצפנים שלנו יש תיבת דואר של מסד נתונים SQLite עבור `linux@example.com`, `info@example.com`, `hello@example.com` וכן הלאה - אחת לכל אחת כקובץ מסד נתונים `.sqlite`. אנחנו גם לא נותנים שמות לקבצי מסד הנתונים עם כתובת הדוא"ל - במקום זאת אנחנו משתמשים ב-BSON ObjectID וב-UUID ייחודיים שנוצרים, שאינם משתפים למי שייכת תיבת הדואר או באיזו כתובת דוא"ל היא נמצאת (למשל `353a03f21e534321f5d6e267.sqlite`).

כל אחד ממסדי הנתונים הללו מוצפן באמצעות הסיסמה שלך (שיש לך בלבד) באמצעות [סקליט](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([צ'אצ'ה20-פולי1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). משמעות הדבר היא שתיבות הדואר שלך מוצפנות בנפרד, עצמאיות, [ארגז חול](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) וניידות.

ביצענו כיוונון עדין של SQLite עם ה-[PRAGMA](https://www.sqlite.org/pragma.html) הבא:

| `PRAGMA` | מַטָרָה |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). ראה `better-sqlite3-multiple-ciphers` תחת [Projects](#projects) לקבלת תובנות נוספות. |
| `key="****************"` | זוהי סיסמתך המפוענחת בזיכרון בלבד, אשר מועברת דרך חיבור ה-IMAP של לקוח הדוא"ל שלך לשרת שלנו. מופעי מסד נתונים חדשים נוצרים ונסגרים עבור כל סשן קריאה וכתיבה (על מנת להבטיח אחסון בארגז חול ובידוד). |
| `journal_model=WAL` | יומן כתיבה מראש ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | מונע שגיאות נעילת כתיבה [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | מגביר את עמידות העסקאות [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | אוכף את האכפתיות של הפניות למפתחות זרים (למשל, קשר מטבלה אחת לאחרת). [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), אך לצורך אימות ושלמות נתונים יש להפעיל זאת. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) לשימוש כדי להבטיח שפיות המפתח. |

> כל שאר הגדרות ברירת המחדל הן מ-SQLite כפי שצוין ב-[תיעוד רשמי של PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### בו-זמניות {#concurrency}

> **tldr;** אנו משתמשים ב-`WebSocket` לקריאה וכתיבה בו-זמנית לתיבות הדואר המוצפנות של SQLite.

#### קריאות {#reads}

ייתכן שלקוח הדוא"ל בטלפון שלך יהיה `imap.forwardemail.net` לאחת מכתובות ה-IP של Digital Ocean שלנו - ולקוח שולחן העבודה שלך יהיה [ספק](#providers) אחר לגמרי.

ללא קשר לשרת ה-IMAP שאליו מתחבר לקוח הדוא"ל שלך, אנו רוצים שהחיבור יקרא ממסד הנתונים שלך בזמן אמת בדיוק של 100%. זה נעשה באמצעות WebSockets.

#### כותב את {#writes}

כתיבה למסד הנתונים שלך שונה במקצת - מכיוון ש-SQLite הוא מסד נתונים מוטמע ותיבת הדואר שלך נמצאת בקובץ יחיד כברירת מחדל.

בדקנו אפשרויות כגון `litestream`, `rqlite` ו-`dqlite` להלן - אולם אף אחת מהן לא עמדה בדרישות שלנו.

כדי לבצע כתיבות עם רישום כתיבה מראש ("[WAL](https://www.sqlite.org/wal.html)") מופעל - עלינו לוודא שרק שרת אחד ("ראשי") אחראי לכך. [WAL](https://www.sqlite.org/wal.html) מאיץ באופן דרסטי את המקביליות ומאפשר כותב אחד וקוראים מרובים.

השרת הראשי פועל על שרתי הנתונים כאשר אמצעי האחסון המותקנים המכילים את תיבות הדואר המוצפנות. מנקודת מבט של הפצה, ניתן להתייחס לכל שרתי ה-IMAP הבודדים שמאחורי `imap.forwardemail.net` כשרתים משניים ("משניים").

אנו משיגים תקשורת דו-כיוונית עם [שקעי אינטרנט](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* שרתים ראשיים משתמשים במופע של שרת `WebSocketServer` של [ws](https://github.com/websockets/ws).
* שרתים משניים משתמשים במופע של לקוח `WebSocket` של [ws](https://github.com/websockets/ws), אשר עטוף ב-[שקע-רשת-כפי-שהובטח](https://github.com/vitalets/websocket-as-promised) וב-[חיבור מחדש של שקע אינטרנט](https://github.com/opensumi/reconnecting-websocket). שני עטיפות אלו מבטיחות ש-`WebSocket` יתחבר מחדש ויכול לשלוח ולקבל נתונים עבור כתיבות ספציפיות למסד הנתונים.

### גיבויים {#backups}

> **tldr;** גיבויים של תיבות הדואר המוצפנות שלך מתבצעים מדי יום. תוכל גם לבקש גיבוי חדש באופן מיידי או להוריד את הגיבוי העדכני ביותר בכל עת מ-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i>דומיינים</a> <i class="fa fa-angle-right"></i>כינויים.

עבור גיבויים, אנו פשוט מפעילים את פקודת SQLite `VACUUM INTO` בכל יום במהלך עיבוד פקודות IMAP, אשר ממנפת את הסיסמה המוצפנת שלך מחיבור IMAP בזיכרון. גיבויים נשמרים אם לא מזוהה גיבוי קיים או אם ה-hash של [SHA-256](https://en.wikipedia.org/wiki/SHA-2) השתנה בקובץ בהשוואה לגיבוי האחרון.

שימו לב שאנו משתמשים בפקודה `VACUUM INTO` בניגוד לפקודה המובנית `backup`, מכיוון שאם דף משתנה במהלך פעולת פקודה `backup`, הוא חייב להתחיל מחדש. הפקודה `VACUUM INTO` תצלם תמונה. עיינו בהערות אלה על [גיטהאב](https://github.com/benbjohnson/litestream.io/issues/56) ו-[חדשות האקרים](https://news.ycombinator.com/item?id=31387556) לקבלת תובנות נוספות.

בנוסף, אנו משתמשים ב-`VACUUM INTO` במקום ב-`backup`, מכיוון שהפקודה `backup` תשאיר את מסד הנתונים לא מוצפן למשך זמן קצר עד ש-`rekey` יופעל (ראו GitHub [הֶעָרָה](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) לקבלת תובנות).

הגיבוי המשני יורה לגיבוי הראשי דרך החיבור `WebSocket` לבצע את הגיבוי - והגיבוי הראשי יקבל לאחר מכן את הפקודה לעשות זאת ולאחר מכן:

1. התחבר לתיבת הדואר המוצפנת שלך.
2. השג נעילת כתיבה.
3. הפעל נקודת ביקורת WAL דרך `wal_checkpoint(PASSIVE)`.
4. הפעל את פקודת SQLite `VACUUM INTO`.
5. ודא שניתן לפתוח את הקובץ שהועתק באמצעות הסיסמה המוצפנת (הגנה/הגנה מפני דמה).
6. העלה אותו ל-Cloudflare R2 לאחסון (או לספק שלך אם צוין).

<!--
7. דחוסו את קובץ הגיבוי שנוצר באמצעות `gzip`.
8. העלו אותו ל-Cloudflare R2 לאחסון (או לספק שלכם אם צוין).
-->

זכרו שתיבות הדואר שלכם מוצפנות - ולמרות שיש לנו מגבלות IP ואמצעי אימות אחרים עבור תקשורת WebSocket - במקרה של גורם שלילי, אתם יכולים להיות סמוכים ובטוחים שאם לתוכנת WebSocket אין את סיסמת ה-IMAP שלכם, היא לא תוכל לפתוח את מסד הנתונים שלכם.

כרגע מאוחסן גיבוי אחד בלבד לכל תיבת דואר, אך בעתיד ייתכן שנציע שחזור נקודתי בזמן ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### חיפוש {#search}

שרתי ה-IMAP שלנו תומכים בפקודה `SEARCH` עם שאילתות מורכבות, ביטויים רגולריים ועוד.

ביצועי חיפוש מהירים הודות ל-[FTS5](https://www.sqlite.org/fts5.html) ול-[sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

אנו מאחסנים ערכי `Date` בתיבות הדואר של SQLite כמחרוזות [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) דרך [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (עם אזור זמן UTC כדי שהשוואות השוויון יפעלו כראוי).

מדדים נשמרים גם עבור כל הנכסים שנמצאים בשאילתות חיפוש.

### פרויקטים {#projects}

הנה טבלה המפרטת את הפרויקטים בהם אנו משתמשים בקוד המקור ובתהליך הפיתוח שלנו (מסודרת לפי סדר אלפביתי):

| פּרוֹיֶקט | מַטָרָה |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | פלטפורמת אוטומציה של DevOps לתחזוקה, הרחבה וניהול של כל צי השרתים שלנו בקלות. |
| [Bree](https://github.com/breejs/bree) | מתזמן משימות עבור Node.js ו-JavaScript עם cron, dates, ms, later ותמיכה ידידותית למשתמש. |
| [Cabin](https://github.com/cabinjs/cabin) | ספריית רישום JavaScript ו-Node.js ידידותית למפתחים, תוך התחשבות באבטחה ופרטיות. |
| [Lad](https://github.com/ladjs/lad) | מסגרת Node.js אשר מניעה את כל הארכיטקטורה והעיצוב ההנדסי שלנו באמצעות MVC ועוד. |
| [MongoDB](https://www.mongodb.com/) | פתרון מסד נתונים NoSQL שאנו משתמשים בו לאחסון כל הנתונים האחרים מחוץ לתיבות דואר (למשל, החשבון שלך, הגדרות, דומיינים ותצורות כינויים). |
| [Mongoose](https://github.com/Automattic/mongoose) | מודל מסמכי אובייקטים של MongoDB ("ODM") בו אנו משתמשים בכל המחסנית שלנו. כתבנו עוזרים מיוחדים המאפשרים לנו להמשיך להשתמש ב- **Mongoose עם SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js היא סביבת ריצה של JavaScript בקוד פתוח, חוצת פלטפורמות, אשר מפעילה את כל תהליכי השרת שלנו. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | חבילת Node.js לשליחת מיילים, יצירת קשרים ועוד. אנו נותני חסות רשמיים של פרויקט זה. |
| [Redis](https://redis.io/) | מסד נתונים בזיכרון עבור אחסון במטמון, ערוצי פרסום/הרשמה ובקשות DNS דרך HTTPS. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | הרחבת הצפנה עבור SQLite המאפשרת הצפנת קבצי מסד נתונים שלמים (כולל יומן כתיבה מראש ("[WAL](https://www.sqlite.org/wal.html)"), יומן, החזרה למצב קודם,...). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | עורך SQLite חזותי (שגם בו תוכלו להשתמש) לבדיקה, הורדה וצפייה בתיבות דואר של פיתוח. |
| [SQLite](https://www.sqlite.org/about.html) | שכבת מסד נתונים מוטמעת לאחסון IMAP ניתן להרחבה, עצמאי, מהיר ועמיד. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | כלי Node.js למניעת ספאם, סינון דוא"ל ומניעת פישינג (האלטרנטיבה שלנו ל-[Spam Assassin](https://spamassassin.apache.org/) ו-[rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | בקשות DNS דרך HTTPS עם Node.js ואחסון במטמון באמצעות Redis – מה שמבטיח עקביות גלובלית ועוד. |
| [Thunderbird](https://www.thunderbird.net/) | צוות הפיתוח שלנו משתמש בזה (וגם ממליץ על זה) כ **לקוח הדוא"ל המועדף לשימוש עם Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | צוות הפיתוח שלנו משתמש בתוכנה זו ליצירת מכונות וירטואליות עבור iOS ו-macOS על מנת לבדוק לקוחות דוא"ל שונים (במקביל) עם שרתי IMAP ו-SMTP שלנו. |
| [Ubuntu](https://ubuntu.com/download/server) | מערכת הפעלה מודרנית בקוד פתוח מבוססת לינוקס, המפעילה את כל התשתית שלנו. |
| [WildDuck](https://github.com/nodemailer/wildduck) | ספריית שרת IMAP – ראו את ההערות שלה על [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) ו-[IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | ספריית API מהירה ופשוטה עבור Node.js לאינטראקציה עם SQLite3 באופן תכנותי. |
| [email-templates](https://github.com/forwardemail/email-templates) | מסגרת דוא"ל ידידותית למפתחים ליצירה, תצוגה מקדימה ושליחת דוא"ל מותאמים אישית (למשל התראות חשבון ועוד). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | בונה שאילתות SQL המשתמש בתחביר בסגנון Mongo. זה חוסך לצוות הפיתוח שלנו זמן מכיוון שאנחנו יכולים להמשיך לכתוב בסגנון Mongo על פני כל המחסנית עם גישה אגנוסטית של מסד הנתונים. **זה גם עוזר להימנע מהתקפות הזרקת SQL באמצעות פרמטרי שאילתה.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | כלי SQL לחילוץ מידע על סכימות מסד נתונים קיימות. זה מאפשר לנו לאמת בקלות שכל האינדקסים, הטבלאות, העמודות, האילוצים ועוד תקינים ועומדים ב-`1:1` כפי שהם אמורים להיות. אפילו כתבנו עוזרים אוטומטיים כדי להוסיף עמודות ואינדקסים חדשים אם מתבצעים שינויים בסכימות מסד נתונים (עם התראות שגיאה מפורטות ביותר גם כן). |
| [knex](https://github.com/knex/knex) | בונה שאילתות SQL בו אנו משתמשים רק עבור העברות מסדי נתונים ואימות סכימה דרך `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | תרגום אוטומטי של ביטויים [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) עם תמיכה ב-Markdown באמצעות [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | חבילת Node.js לפתרון ויצירת חיבורים עם שרתי MX ולטפל בשגיאות. |
| [pm2](https://github.com/Unitech/pm2) | מנהל תהליכי ייצור של Node.js עם מאזן עומסים מובנה ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) לביצועים). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | ספריית שרתי SMTP – אנו משתמשים בה עבור חילופי הדואר שלנו ("MX") ושרתי SMTP יוצאים. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | כלי שימושי לבדיקת שרתי IMAP מול מדדי ביצועים ותאימות פרוטוקול IMAP של מפרט RFC. פרויקט זה נוצר על ידי צוות [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (שרת IMAP ו-POP3 פעיל בקוד פתוח מיולי 2002). בדקנו בהרחבה את שרת ה-IMAP שלנו בעזרת כלי זה. |

> ניתן למצוא פרויקטים נוספים בהם אנו משתמשים ב-[קוד המקור שלנו ב-GitHub](https://github.com/forwardemail).

### ספקים {#providers}

| ספק | מַטָרָה |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | ספק DNS, בדיקות תקינות, מאזני עומסים ואחסון גיבוי באמצעות [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | אירוח שרתים ייעודיים וניהול מסדי נתונים. |
| [Vultr](https://www.vultr.com/?ref=7429848) | אירוח שרת ייעודי. |
| [DataPacket](https://www.datapacket.com) | אירוח שרת ייעודי. |

מחשבות זמניות {##}

### עקרונות

העברת דוא"ל מתוכננת לפי העקרונות הבאים:

1. היו תמיד ידידותיים למפתחים, ממוקדים באבטחה ובפרטיות, ושקופים.
2. הקפידו על [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [יוניקס](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [שנים עשר גורמים](https://12factor.net/), [התער של אוקאם](https://en.wikipedia.org/wiki/Occam%27s_razor), ו-[ניתוח מוצרים לכלבים](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. התמקדו במפתחים חסרי ניסיון, עם ניסיון bootstrapped, ו-[ראמן-רווחי](http://www.paulgraham.com/ramenprofitable.html)

### ניסויים {#experiments}

> **tldr;** בסופו של דבר, שימוש באחסון אובייקטים תואם S3 ו/או טבלאות וירטואליות אינו בר ביצוע מבחינה טכנית מסיבות ביצועים ומועד לשגיאות עקב מגבלות זיכרון.

ביצענו מספר ניסויים שהובילו לפתרון SQLite הסופי שלנו כפי שנדון לעיל.

אחת מהן הייתה לנסות להשתמש ב-[rclone]() וב-SQLite יחד עם שכבת אחסון תואמת S3.

ניסוי זה הוביל אותנו להבנה טובה יותר ולגילוי מקרי קצה סביב השימוש ב-rclone, SQLite ו-[VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* אם תפעילו את הדגל `--vfs-cache-mode writes` עם rclone, הקריאות יהיו בסדר, אך הכתיבות יאוחסנו במטמון.
* אם יש לכם מספר שרתי IMAP הפזורים ברחבי העולם, המטמון יהיה כבוי ביניהם אלא אם כן יש לכם כותב יחיד ומאזינים מרובים (למשל גישת pub/sub).
* זה מורכב להפליא והוספת כל מורכבות נוספת כזו תגרום ליותר נקודות כשל בודדות.
* ספקי אחסון תואמי S3 אינם תומכים בשינויים חלקיים של קבצים - מה שאומר שכל שינוי בקובץ `.sqlite` יביא לשינוי מלא והעלאה מחדש של מסד הנתונים.
* קיימים פתרונות אחרים כמו `rsync`, אך הם אינם מתמקדים בתמיכה ב-write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") - אז בסופו של דבר בדקנו את Litestream. למרבה המזל, השימוש בהצפנה שלנו כבר מצפין את קבצי [WAL](https://www.sqlite.org/wal.html) עבורנו, כך שאנחנו לא צריכים להסתמך על Litestream לשם כך. עם זאת, עדיין לא היינו בטוחים ב-Litestream לשימוש ייצור ויש לנו כמה הערות בהמשך בנושא.
* שימוש באפשרות `--vfs-cache-mode writes` (הדרך ה*יחידה* להשתמש ב-SQLite על פני `rclone` לכתיבה) ינסה להעתיק את כל מסד הנתונים מאפס לזיכרון – טיפול בתיבת דואר אחת של 10 ג'יגה-בייט הוא בסדר, אולם טיפול בתיבות דואר מרובות עם נפח אחסון גבוה במיוחד יגרום לשרתי IMAP להיתקל במגבלות זיכרון ושגיאות `ENOMEM`, תקלות פילוח ופגיעה בנתונים.
* אם תנסה להשתמש ב-SQLite [שולחנות וירטואליים](https://www.sqlite.org/vtab.html) (למשל, באמצעות [s3db](https://github.com/jrhy/s3db)) על מנת שהנתונים יהיו חיים בשכבת אחסון תואמת S3, תיתקל במספר בעיות נוספות:
* קריאה וכתיבה יהיו איטיות ביותר מכיוון שיהיה צורך לפגוע בנקודות קצה של API S3 באמצעות שיטות HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2 ו-`.sqlite`3.
* בדיקות פיתוח הראו שעולה על 500,000-1 מיליון+ רשומות באינטרנט סיב אופטי עדיין מוגבל על ידי תפוקת הכתיבה והקריאה לספקים תואמי S3. לדוגמה, המפתחים שלנו הרצו לולאות `.sqlite`4 כדי לבצע הן משפטי SQL `.sqlite`5 עוקבים והן כאלה שכתבו כמויות גדולות של נתונים בכמות גדולה. בשני המקרים הביצועים היו איטיים באופן מדהים.
* טבלאות וירטואליות **לא יכולות להכיל אינדקסים**, משפטי `.sqlite`6 ומשפטי `.sqlite`7 `.sqlite`8 - מה שמוביל לעיכובים של עד 1-2 דקות או יותר, בהתאם לכמות הנתונים.
* אובייקטים אוחסנו ללא הצפנה ואין תמיכה בהצפנה מקורית זמינה.
* בחנו גם את השימוש ב-`.sqlite`9, הדומה מבחינה רעיונית וטכנית לנקודה הקודמת (כך שיש לה אותן בעיות). אפשרות אחת תהיה להשתמש בבניית `rsync`0 מותאמת אישית עטופה בהצפנה כגון `rsync`1 (שאותה אנו משתמשים כעת בפתרון שלנו לעיל) דרך `rsync`2.
* גישה פוטנציאלית נוספת הייתה להשתמש ב-`rsync`3, אולם לכך יש מגבלה של 32 ג'יגה-בייט והיא תדרוש כאבי ראש מורכבים של בנייה ופיתוח.
* נדרשות פקודות `rsync`4 (כך שזה שולל לחלוטין את השימוש בטבלאות וירטואליות). אנו זקוקים לפקודות `rsync`5 כדי שה-hook שלנו עם `rsync`6 יעבוד כראוי - מה שמבטיח שהנתונים לא ייפגמו ושורות שאוחזרו יוכלו להיות מומרות למסמכים תקפים בהתאם להגדרות הסכימה `rsync`7 שלנו (הכוללות אילוץ, סוג משתנה ואימות נתונים שרירותי).
* כמעט כל הפרויקטים התואמים ל-S3 הקשורים ל-SQLite בקהילת הקוד הפתוח הם בפייתון (ולא ב-JavaScript שאנו משתמשים בו עבור 100% מהמחסנית שלנו).

* ספריות דחיסה כגון `rsync`8 (ראה `rsync`9) נראות מבטיחות, אבל __PROTECTED_LINK_189__0. במקום זאת, דחיסה בצד האפליקציה על סוגי נתונים כגון __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 ו-__PROTECTED_LINK_189__6 תהיה גישה נקייה וקלה יותר (וגם קלה יותר להעברה, מכיוון שנוכל לאחסן דגל או עמודה __PROTECTED_LINK_189__7 - או אפילו להשתמש ב-__PROTECTED_LINK_189__8 __PROTECTED_LINK_189__9 לדחיסה או ב-__PROTECTED_LINK_190__0 ללא דחיסה כמטא-נתונים של מסד הנתונים).
* למרבה המזל, כבר יש לנו ביטול כפילויות של קבצים מצורפים מיושם באחסון שרת ה-IMAP שלנו - לכן כל הודעה עם אותו קובץ מצורף לא תשמור עותק של הקובץ המצורף - במקום זאת, קובץ מצורף יחיד מאוחסן עבור הודעות ושרשורים מרובים בתיבת דואר (ולאחר מכן נעשה שימוש בהפניה זרה).
* פרויקט Litestream, שהוא פתרון שכפול וגיבוי של SQLite, מבטיח מאוד וסביר להניח שנשתמש בו בעתיד.
* לא כדי לפגוע באמינותם של המחברים - כי אנחנו אוהבים את עבודתם ותרומתם לקוד פתוח כבר למעלה מעשור - אולם משימוש בעולם האמיתי נראה שיש __PROTECTED_LINK_190__1 ו- __PROTECTED_LINK_190__2.
* שחזור גיבוי צריך להיות חלק וטריוויאלי. שימוש בפתרון כמו MongoDB עם __PROTECTED_LINK_190__3 ו- __PROTECTED_LINK_190__4 הוא לא רק מייגע, אלא גם גוזל זמן רב ומורכב בתצורה.
* מסדי נתונים של SQLite הופכים את זה לפשוט (זה קובץ יחיד).
* רצינו לעצב פתרון שבו משתמשים יכולים לקחת את תיבת הדואר שלהם ולעזוב בכל רגע.
* פקודות Node.js פשוטות ל- __PROTECTED_LINK_190__5 והוא נמחק לצמיתות מאחסון הדיסק.
* באופן דומה, אנו יכולים להשתמש ב-API תואם S3 עם HTTP __PROTECTED_LINK_190__6 כדי להסיר בקלות תמונות וגיבויים עבור משתמשים.
* SQLite היה הפתרון הפשוט, המהיר והחסכוני ביותר.

### חוסר חלופות {#lack-of-alternatives}

למיטב ידיעתנו, אף שירותי דוא"ל אחרים אינם מתוכננים כך וגם אינם קוד פתוח.

אנחנו *חושבים שזה יכול להיות בגלל* ששירותי דוא"ל קיימים משתמשים בטכנולוגיה מדור קודם בתהליך ייצור עם [קוד ספגטי](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

רוב, אם לא כולם, ספקי שירותי הדוא"ל הקיימים הם קוד סגור או מפרסמים כקוד פתוח, **אבל במציאות רק הקצה הקדמי שלהם הוא קוד פתוח.**

**החלק הרגיש ביותר בדוא"ל** (האינטראקציה בפועל בין אחסון/IMAP/SMTP) **מתבצע כולו בקצה האחורי (שרת), ו*לא* בקצה הקדמי (לקוח)**.

### נסה העברת דוא"ל {#try-out-forward-email}

הירשמו עוד היום ב- <https://forwardemail.net>! :rocket: