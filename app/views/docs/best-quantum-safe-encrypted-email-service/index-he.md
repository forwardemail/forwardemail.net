# דואר אלקטרוני עמיד לקוונטים: איך אנחנו משתמשים בתיבות דואר SQLite מוצפנות כדי לשמור על הדואר האלקטרוני שלך בטוח {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="איור שירות דואר אלקטרוני מוצפן בטוח לקוונטים" class="rounded-lg" />


## תוכן העניינים {#table-of-contents}

* [הקדמה](#foreword)
* [השוואת ספקי שירות דואר אלקטרוני](#email-service-provider-comparison)
* [איך זה עובד](#how-does-it-work)
* [טכנולוגיות](#technologies)
  * [מסדי נתונים](#databases)
  * [אבטחה](#security)
  * [תיבות דואר](#mailboxes)
  * [ריבוי משימות](#concurrency)
  * [גיבויים](#backups)
  * [חיפוש](#search)
  * [פרויקטים](#projects)
  * [ספקים](#providers)
* [מחשבות](#thoughts)
  * [עקרונות](#principles)
  * [ניסויים](#experiments)
  * [חוסר חלופות](#lack-of-alternatives)
  * [נסה את Forward Email](#try-out-forward-email)


## הקדמה {#foreword}

> \[!IMPORTANT]
> שירות הדואר האלקטרוני שלנו הוא [קוד פתוח במאה אחוז](https://github.com/forwardemail) וממוקד בפרטיות באמצעות תיבות דואר SQLite מאובטחות ומוצפנות.

עד שהשקנו את [תמיכת IMAP](/faq#do-you-support-receiving-email-with-imap), השתמשנו ב-MongoDB לצרכי אחסון הנתונים המתמידים שלנו.

הטכנולוגיה הזו מדהימה ואנחנו עדיין משתמשים בה היום – אך כדי לקבל הצפנה במצב מנוחה עם MongoDB, יש צורך להשתמש בספק שמציע MongoDB Enterprise, כמו Digital Ocean או Mongo Atlas – או לשלם עבור רישיון ארגוני (ולעבוד עם עיכובים מצד צוות המכירות).

הצוות שלנו ב-[Forward Email](https://forwardemail.net) היה זקוק לפתרון אחסון ידידותי למפתחים, סקלאבילי, אמין ומוצפן עבור תיבות דואר IMAP. כמפתחים בקוד פתוח, השימוש בטכנולוגיה שדורשת תשלום עבור רישיון כדי לקבל את תכונת ההצפנה במצב מנוחה היה מנוגד ל-[העקרונות שלנו](#principles) – ולכן ניסינו, חקרנו ופיתחנו פתרון חדש מאפס כדי לענות על הצרכים הללו.

במקום להשתמש במסד נתונים משותף לאחסון תיבות הדואר שלך, אנחנו מאחסנים ומצפינים כל תיבת דואר בנפרד עם הסיסמה שלך (שיש רק לך).  **שירות הדואר האלקטרוני שלנו כל כך מאובטח שאם תשכח את הסיסמה שלך, תאבד את תיבת הדואר שלך** (ותצטרך לשחזר מגיבויים לא מקוונים או להתחיל מחדש).

המשך לקרוא כשאנחנו נכנסים לעומק עם [השוואת ספקי שירות דואר אלקטרוני](#email-service-provider-comparison), [איך השירות שלנו עובד](#how-does-it-work), [ערימת הטכנולוגיה שלנו](#technologies) ועוד.


## השוואת ספקי שירות דואר אלקטרוני {#email-service-provider-comparison}

אנחנו ספק שירות הדואר האלקטרוני היחיד שהוא 100% קוד פתוח וממוקד פרטיות, שמאחסן תיבות דואר SQLite מוצפנות בנפרד, מציע דומיינים, כינויים ומשתמשים ללא הגבלה, ותומך ב-SMTP יוצא, IMAP ו-POP3:

**בניגוד לספקי דואר אחרים, אינך צריך לשלם עבור אחסון על בסיס דומיין או כינוי עם Forward Email.** האחסון משותף לכל החשבון שלך – אז אם יש לך מספר שמות דומיין מותאמים אישית וכינויים מרובים על כל אחד מהם, אנחנו הפתרון המושלם עבורך. שים לב שניתן עדיין לאכוף מגבלות אחסון אם תרצה על בסיס דומיין או כינוי.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">קרא השוואת שירותי דואר אלקטרוני <i class="fa fa-search-plus"></i></a>


## איך זה עובד {#how-does-it-work}

1. באמצעות לקוח הדואר האלקטרוני שלך כגון Apple Mail, Thunderbird, Gmail או Outlook – אתה מתחבר לשרתי [IMAP](/faq#do-you-support-receiving-email-with-imap) המאובטחים שלנו באמצעות שם המשתמש והסיסמה שלך:

   * שם המשתמש שלך הוא הכינוי המלא עם הדומיין שלך כמו `hello@example.com`.
   * הסיסמה שלך נוצרת באקראי ומוצגת רק לך למשך 30 שניות כשאתה לוחץ על <strong class="text-success"><i class="fa fa-key"></i> צור סיסמה</strong> מתוך <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים.
2. ברגע שמתחברים, לקוח הדואר האלקטרוני שלך ישלח [פקודות פרוטוקול IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) לשרת ה-IMAP שלנו כדי לשמור על סינכרון תיבת הדואר שלך. זה כולל כתיבה ואחסון של מיילים טיוטה ופעולות נוספות שאתה עשוי לבצע (למשל לסמן מייל כחשוב או לסמן מייל כספאם/דואר זבל).

3. שרתי החלפת הדואר (המכונים בדרך כלל "MX") מקבלים מיילים נכנסים חדשים ואוחסנים אותם בתיבת הדואר שלך. כאשר זה קורה, לקוח הדואר שלך יקבל התראה ויסנכרן את תיבת הדואר. שרתי החלפת הדואר שלנו יכולים להעביר את המייל שלך לנמען אחד או יותר (כולל [webhooks](/faq#do-you-support-webhooks)), לאחסן את המייל שלך עבורך באחסון ה-IMAP המוצפן שלנו, **או את שניהם**!

   > \[!TIP]
   > מעוניין ללמוד עוד? קרא [כיצד להגדיר העברת דואר](/faq#how-do-i-get-started-and-set-up-email-forwarding), [כיצד עובד שירות החלפת הדואר שלנו](/faq#how-does-your-email-forwarding-system-work), או עיין ב[המדריכים שלנו](/guides).

4. מאחורי הקלעים, עיצוב אחסון הדואר המאובטח שלנו פועל בשתי דרכים כדי לשמור על תיבות הדואר מוצפנות ונגישות רק עבורך:

   * כאשר מתקבל דואר חדש עבורך מהשולח, שרתי החלפת הדואר שלנו כותבים לתיבת דואר אישית, זמנית ומוצפנת עבורך.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: הודעה נכנסת התקבלה עבור הכינוי שלך (למשל you@yourdomain.com).
         MX->>SQLite: ההודעה מאוחסנת בתיבת דואר זמנית.
         Note over MX,SQLite: מעביר לנמענים אחרים ו-webhooks שהוגדרו.
         MX->>Sender: הצלחה!
     ```

   * כאשר אתה מתחבר לשרת ה-IMAP שלנו עם לקוח הדואר שלך, הסיסמה שלך מוצפנת בזיכרון ומשמשת לקריאה וכתיבה בתיבת הדואר שלך. ניתן לקרוא ולכתוב לתיבת הדואר רק עם סיסמה זו. זכור כי מאחר ואתה היחיד שיש לו סיסמה זו, **רק אתה** יכול לקרוא ולכתוב לתיבת הדואר שלך כאשר אתה ניגש אליה. בפעם הבאה שלקוח הדואר שלך ינסה לבדוק דואר או לסנכרן, ההודעות החדשות יועברו מתיבת הדואר הזמנית הזו ויאוחסנו בקובץ תיבת הדואר האמיתי שלך באמצעות הסיסמה שסיפקת. שים לב שתיבת הדואר הזמנית הזו נמחקת לאחר מכן כך שרק תיבת הדואר המוגנת בסיסמה שלך מכילה את ההודעות.

   * **אם אתה מחובר ל-IMAP (למשל באמצעות לקוח דואר כמו Apple Mail או Thunderbird), אז אין צורך לכתוב לאחסון זמני בדיסק. הסיסמה המוצפנת בזיכרון של IMAP שלך נשלפת ומשמשת במקום זאת. בזמן אמת, כאשר מייל מנסה להימסר אליך, אנו שולחים בקשת WebSocket לכל שרתי ה-IMAP ושואלים אם יש להם סשן פעיל עבורך (זהו שלב השליפה), ולאחר מכן מעבירים את הסיסמה המוצפנת בזיכרון – כך שאין צורך לכתוב לתיבת דואר זמנית, ניתן לכתוב לתיבת הדואר המוצפנת האמיתית שלך באמצעות הסיסמה המוצפנת שלך.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: אתה מתחבר לשרת IMAP באמצעות לקוח דואר.
         IMAP->>SQLite: העברת הודעה מתיבת הדואר הזמנית לתיבת הדואר של הכינוי שלך.
         Note over IMAP,SQLite: תיבת הדואר של הכינוי שלך זמינה רק בזיכרון באמצעות סיסמת IMAP.
         SQLite->>IMAP: שולף הודעות כפי שנדרש על ידי לקוח הדואר.
         IMAP->>You: הצלחה!
     ```

5. [גיבויים של תיבות הדואר המוצפנות שלך](#backups) מתבצעים מדי יום. ניתן גם לבקש גיבוי חדש בכל עת או להוריד את הגיבוי האחרון מ-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים. אם תחליט לעבור לשירות דואר אחר, תוכל בקלות להגר, להוריד, לייצא ולמחוק את תיבות הדואר והגיבויים שלך בכל עת.


## טכנולוגיות {#technologies}

### מסדי נתונים {#databases}

בדקנו שכבות אחסון מסד נתונים אחרות, אך אף אחת מהן לא ענתה על דרישותינו כמו SQLite:
| Database                                               |                                                                    Encryption-at-rest                                                                   |  [תיבות דואר מבודדות](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\))  |                           רישיון                           | [משמש בכל מקום](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: כן עם [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: דומיין ציבורי              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["זמין רק ב-MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: מסד נתונים רלציוני                               |                   :x: AGPL ו-`SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [רק ברשת](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: מסד נתונים רלציוני                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [לא נבדק ועדיין לא נתמך?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [לא נבדק ועדיין לא נתמך?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [כן](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: מסד נתונים רלציוני                               | :white_check_mark: `PostgreSQL` (דומה ל-`BSD` או `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [רק עבור InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: מסד נתונים רלציוני                               |          :white_check_mark: `GPLv2` ו-`BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [תכונה רק לארגונים](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: מסד נתונים רלציוני                               |                  :x: `BUSL-1.1` ואחרים                  |                             :x:                             |

> הנה [פוסט בלוג שמשווה מספר אפשרויות אחסון מסד נתונים SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) בטבלה למעלה.

### אבטחה {#security}

בכל עת אנו משתמשים ב-[הצפנה במנוחה](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [הצפנה בהעברה](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS מעל HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") באמצעות :tangerine: [Tangerine](https://tangeri.ne), ובהצפנת [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) על תיבות הדואר. בנוסף, אנו משתמשים באימות דו-שלבי מבוסס טוקן (בניגוד ל-SMS הרגיש ל-[התקפות אדם בתווך](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), מפתחות SSH מסתובבים עם גישת root מושבתת, גישה בלעדית לשרתים דרך כתובות IP מוגבלות, ועוד.
במקרה של [התקפת משרתת רעה](https://en.wikipedia.org/wiki/Evil_maid_attack) או עובד מרושע מספק צד שלישי, **תיבת הדואר שלך עדיין יכולה להיפתח רק עם הסיסמה שיצרת**. תהיה בטוח, אנחנו לא מסתמכים על ספקי צד שלישי אחרים מלבד ספקי השרתים שלנו התואמים ל-SOC Type 2 של Cloudflare, DataPacket, Digital Ocean, GitHub, ו-Vultr.

המטרה שלנו היא שיהיו כמה שפחות [נקודות כשל יחידות](https://en.wikipedia.org/wiki/Single_point_of_failure) ככל האפשר.

### תיבות דואר {#mailboxes}

> **תקציר;** שרתי ה-IMAP שלנו משתמשים במסדי נתונים SQLite מוצפנים בנפרד עבור כל אחת מתיבות הדואר שלך.

[SQLite הוא מסד נתונים משובץ פופולרי מאוד](https://www.sqlite.org/mostdeployed.html) – הוא פועל כרגע בטלפון ובמחשב שלך – [ומשמש כמעט את כל הטכנולוגיות הגדולות](https://www.sqlite.org/famous.html).

לדוגמה, בשרתים המוצפנים שלנו יש מסד נתונים SQLite עבור תיבת הדואר של `linux@example.com`, `info@example.com`, `hello@example.com` וכן הלאה – אחד לכל תיבה כקובץ מסד נתונים `.sqlite`. אנחנו לא קוראים לקבצי מסד הנתונים על פי כתובת האימייל – במקום זאת אנחנו משתמשים ב-BSON ObjectID ו-UUID ייחודיים שנוצרים שאינם חושפים למי שייכת תיבת הדואר או איזו כתובת אימייל היא (למשל `353a03f21e534321f5d6e267.sqlite`).

כל אחד ממסדי הנתונים האלה מוצפן בעצמו באמצעות הסיסמה שלך (שיש רק לך) באמצעות [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). משמעות הדבר היא שתיבות הדואר שלך מוצפנות בנפרד, עצמאיות, [מבודדות](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)), וניידות.

כיווננו את SQLite עם ה-[PRAGMA](https://www.sqlite.org/pragma.html) הבאים:

| `PRAGMA`                 | מטרה                                                                                                                                                                                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [הצפנת מסד נתונים SQLite ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). עיין ב-`better-sqlite3-multiple-ciphers` תחת [Projects](#projects) לקבלת תובנות נוספות.                                   |
| `key="****************"` | זוהי הסיסמה שלך מפוענחת בזיכרון בלבד שמועברת דרך חיבור ה-IMAP של לקוח האימייל שלך לשרת שלנו. מופעלות מופעי מסד נתונים חדשים וננעלים עבור כל סשן קריאה וכתיבה (כדי להבטיח בידוד ומבודדות).                                                             |
| `journal_model=WAL`      | יומן כתיבה מקדימה ("[WAL](https://www.sqlite.org/wal.html)") [שמשפר ביצועים ומאפשר גישה לקריאה במקביל](https://litestream.io/tips/#wal-journal-mode).                                                                                                 |
| `busy_timeout=5000`      | מונע שגיאות נעילת כתיבה [בזמן שכתיבות אחרות מתבצעות](https://litestream.io/tips/#busy-timeout).                                                                                                                                                      |
| `synchronous=NORMAL`     | מגדיל את עמידות העסקאות [בלי סיכון לשחיתות נתונים](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                                   |
| `foreign_keys=ON`        | מחייב הפניות מפתח זר (למשל קשר מטבלה אחת לאחרת). [ברירת המחדל ב-SQLite היא לא להפעיל זאת](https://www.sqlite.org/foreignkeys.html), אך לצורך אימות ושלמות הנתונים יש להפעיל זאת.                                                                   |
| `encoding='UTF-8'`       | [קידוד ברירת מחדל](https://www.sqlite.org/pragma.html#pragma_encoding) לשימוש להבטחת שפיות המפתח.                                                                                                                                                      |
> כל ברירות המחדל האחרות הן מ-SQLite כפי שמפורט ב-[התיעוד הרשמי של PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### תחרותיות {#concurrency}

> **תקציר;** אנו משתמשים ב-`WebSocket` לקריאות וכתיבות מקבילות לתיבות הדואר המוצפנות שלך ב-SQLite.

#### קריאות {#reads}

לקוח הדואר האלקטרוני שלך בטלפון עשוי לפתור את `imap.forwardemail.net` לאחד מכתובות ה-IP של Digital Ocean שלנו – ולקוח שולחן העבודה שלך עשוי לפתור כתובת IP נפרדת מספק [שונה](#providers) לחלוטין.

ללא קשר לאיזה שרת IMAP לקוח הדואר שלך מתחבר, אנו רוצים שהחיבור יקרא מהמסד נתונים שלך בזמן אמת עם דיוק של 100%. זה נעשה באמצעות WebSockets.

#### כתיבות {#writes}

הכתיבה למסד הנתונים שלך שונה במקצת – מכיוון ש-SQLite הוא מסד נתונים מוטמע ותיבת הדואר שלך נמצאת בקובץ יחיד כברירת מחדל.

בדקנו אפשרויות כמו `litestream`, `rqlite`, ו-`dqlite` למטה – אך אף אחת מהן לא ענתה על הדרישות שלנו.

כדי לבצע כתיבות עם רישום מראש לכתיבה ("[WAL](https://www.sqlite.org/wal.html)") מופעל – עלינו לוודא שרק שרת אחד ("ראשי") אחראי על כך. [WAL](https://www.sqlite.org/wal.html) מזרז משמעותית את התחרותיות ומאפשר כותב אחד ורבים קוראים.

הראשי פועל על שרתי הנתונים עם הכוננים המותקנים המכילים את תיבות הדואר המוצפנות. מבחינת הפצה, ניתן לראות את כל שרתי ה-IMAP הפרטניים מאחורי `imap.forwardemail.net` כשרתים משניים ("משני").

אנו משיגים תקשורת דו-כיוונית עם [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* שרתי הראשי משתמשים במופע של שרת `WebSocketServer` מ-[ws](https://github.com/websockets/ws).
* שרתי המשני משתמשים במופע של לקוח `WebSocket` מ-[ws](https://github.com/websockets/ws) שעוטף עם [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) ו-[reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). שני העוטפים הללו מבטיחים שה-`WebSocket` יתחבר מחדש ויוכל לשלוח ולקבל נתונים עבור כתיבות מסד נתונים ספציפיות.

### גיבויים {#backups}

> **תקציר;** גיבויים של תיבות הדואר המוצפנות שלך נעשים מדי יום. אתה יכול גם לבקש מיידית גיבוי חדש או להוריד את הגיבוי האחרון בכל עת מ-<a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">החשבון שלי <i class="fa fa-angle-right"></i> דומיינים</a> <i class="fa fa-angle-right"></i> כינויים.

לגיבויים, אנו פשוט מריצים את פקודת SQLite `VACUUM INTO` כל יום במהלך עיבוד פקודות IMAP, שמשתמשת בסיסמת ההצפנה שלך מחיבור IMAP בזיכרון. הגיבויים נשמרים אם לא זוהה גיבוי קיים או אם ערך ה-[SHA-256](https://en.wikipedia.org/wiki/SHA-2) השתנה בקובץ לעומת הגיבוי האחרון.

שים לב שאנו משתמשים בפקודת `VACUUM INTO` במקום בפקודת `backup` המובנית כי אם דף משתנה במהלך פעולת פקודת `backup`, אז יש להתחיל מחדש. פקודת `VACUUM INTO` תיצור צילום מצב. ראה את ההערות האלה ב-[GitHub](https://github.com/benbjohnson/litestream.io/issues/56) וב-[Hacker News](https://news.ycombinator.com/item?id=31387556) לקבלת תובנות נוספות.

בנוסף, אנו משתמשים ב-`VACUUM INTO` במקום ב-`backup`, כי פקודת `backup` תשאיר את מסד הנתונים לא מוצפן לפרק זמן קצר עד ש-`rekey` יופעל (ראה את ההערה הזו ב-GitHub [comment](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) לקבלת תובנה).

המשני ינחה את הראשי דרך חיבור ה-`WebSocket` לבצע את הגיבוי – והראשי יקבל את הפקודה לעשות זאת ולאחר מכן:

1. יתחבר לתיבת הדואר המוצפנת שלך.
2. ירכוש נעילת כתיבה.
3. יריץ נקודת ביקורת WAL באמצעות `wal_checkpoint(PASSIVE)`.
4. יריץ את פקודת SQLite `VACUUM INTO`.
5. יוודא שהקובץ שהועתק ניתן לפתיחה עם הסיסמה המוצפנת (אבטחה/הגנה מפני טעויות).
6. יעלה אותו ל-Cloudflare R2 לאחסון (או לספק שלך אם צוין).
<!--
7. דחוס את קובץ הגיבוי שנוצר עם `gzip`.
8. העלה אותו ל-Cloudflare R2 לאחסון (או לספק שלך אם צוין).
-->

זכור שתיבות הדואר שלך מוצפנות – ובזמן שיש לנו הגבלות IP ואמצעי אימות נוספים לתקשורת WebSocket – במקרה של שחקן זדוני, תוכל להיות בטוח שאם מטען ה-WebSocket אינו מכיל את סיסמת ה-IMAP שלך, הוא לא יוכל לפתוח את מסד הנתונים שלך.

נשמר גיבוי אחד בלבד לכל תיבת דואר כרגע, אך בעתיד ייתכן ונציע שחזור נקודתי בזמן ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### חיפוש {#search}

שרת ה-IMAP שלנו תומך בפקודת `SEARCH` עם שאילתות מורכבות, ביטויים רגולריים ועוד.

ביצועי חיפוש מהירים הודות ל-[FTS5](https://www.sqlite.org/fts5.html) ו-[sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

אנו מאחסנים ערכי `Date` בתיבות הדואר של SQLite כמחרוזות [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) דרך [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (עם אזור זמן UTC כדי שהשוואות שוויון יעבדו כראוי).

אינדקסים נשמרים גם עבור כל התכונות שנמצאות בשאילתות החיפוש.

### פרויקטים {#projects}

להלן טבלה המתארת פרויקטים שאנו משתמשים בהם בקוד המקור ובתהליך הפיתוח שלנו (ממוינים אלפביתית):

| פרויקט                                                                                       | מטרה                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | פלטפורמת אוטומציה DevOps לתחזוקה, סקיילינג וניהול כל צי השרתים שלנו בקלות.                                                                                                                                                                                                                                                               |
| [Bree](https://github.com/breejs/bree)                                                        | מתזמן משימות ל-Node.js ו-JavaScript עם תמיכה ב-cron, תאריכים, ms, later ותמיכה ידידותית למשתמש.                                                                                                                                                                                                                                                                    |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | ספריית לוגים ידידותית למפתחים ב-JavaScript ו-Node.js עם דגש על אבטחה ופרטיות.                                                                                                                                                                                                                                                                         |
| [Lad](https://github.com/ladjs/lad)                                                           | מסגרת Node.js שמפעילה את כל הארכיטקטורה ועיצוב ההנדסה שלנו עם MVC ועוד.                                                                                                                                                                                                                                                                     |
| [MongoDB](https://www.mongodb.com/)                                                           | פתרון מסד נתונים NoSQL שאנו משתמשים בו לאחסון כל שאר הנתונים מחוץ לתיבות הדואר (למשל החשבון שלך, הגדרות, דומיינים וקונפיגורציות כינויים).                                                                                                                                                                                                                |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | מודל מסמכים אובייקטיבי ל-MongoDB ("ODM") שאנו משתמשים בו בכל הסטאק שלנו. כתבנו עזרים מיוחדים שמאפשרים לנו להמשיך להשתמש ב**Mongoose עם SQLite** :tada:                                                                                                                                                                                      |
| [Node.js](https://nodejs.org/en)                                                              | Node.js היא סביבת ריצה חוצה פלטפורמות וקוד פתוח ל-JavaScript שמריצה את כל תהליכי השרת שלנו.                                                                                                                                                                                                                                                    |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | חבילת Node.js לשליחת מיילים, יצירת חיבורים ועוד. אנו ספונסרים רשמיים של הפרויקט הזה.                                                                                                                                                                                                                                                     |
| [Redis](https://redis.io/)                                                                    | מסד נתונים בזיכרון לאחסון מטמון, ערוצי פרסום/מנוי, ובקשות DNS דרך HTTPS.                                                                                                                                                                                                                                                                             |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | תוסף הצפנה ל-SQLite שמאפשר הצפנת קבצי מסד נתונים שלמים (כולל write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), יומן, rollback ועוד).                                                                                                                                                                                     |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | עורך SQLite ויזואלי (שגם אתה יכול להשתמש בו) לבדיקת, הורדת וצפייה בתיבות דואר לפיתוח.                                                                                                                                                                                                                                                                   |
| [SQLite](https://www.sqlite.org/about.html)                                                   | שכבת מסד נתונים מוטמעת לאחסון IMAP סקיילבילי, עצמאי, מהיר ועמיד.                                                                                                                                                                                                                                                                              |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | כלי נגד ספאם, סינון מיילים ומניעת פישינג ב-Node.js (האלטרנטיבה שלנו ל-[Spam Assassin](https://spamassassin.apache.org/) ו-[rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                              |
| [Tangerine](https://tangeri.ne)                                                               | בקשות DNS דרך HTTPS עם Node.js ואחסון מטמון באמצעות Redis – שמבטיח עקביות גלובלית ועוד.                                                                                                                                                                                                                                                       |
| [Thunderbird](https://www.thunderbird.net/)                                                   | צוות הפיתוח שלנו משתמש בזה (וממליץ גם) כלקוח המייל המועדף לשימוש עם Forward Email.                                                                                                                                                                                                                                                |
| [UTM](https://github.com/utmapp/UTM)                                                          | צוות הפיתוח שלנו משתמש בזה ליצירת מכונות וירטואליות ל-iOS ו-macOS כדי לבדוק לקוחות מייל שונים (במקביל) עם שרתי ה-IMAP וה-SMTP שלנו.                                                                                                                                                                                                      |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | מערכת הפעלה מודרנית מבוססת לינוקס בקוד פתוח שמפעילה את כל התשתית שלנו.                                                                                                                                                                                                                                                                       |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | ספריית שרת IMAP – ראה את ההערות שלו על [הסרת כפילויות בקבצים מצורפים](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) ו-[תמיכה בפרוטוקול IMAP](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                                  |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | ספריית API מהירה ופשוטה ל-Node.js לאינטראקציה עם SQLite3 בצורה תכנותית.                                                                                                                                                                                                                                                                                   |
| [email-templates](https://github.com/forwardemail/email-templates)                            | מסגרת מייל ידידותית למפתחים ליצירה, תצוגה ושליחה של מיילים מותאמים אישית (למשל התראות חשבון ועוד).                                                                                                                                                                                                                                                 |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | בונה שאילתות SQL עם תחביר בסגנון Mongo. זה חוסך לצוות הפיתוח שלנו זמן כי אנו יכולים להמשיך לכתוב בסגנון Mongo בכל הסטאק בגישה שאינה תלויה במסד נתונים.  **זה גם עוזר למנוע התקפות SQL injection על ידי שימוש בפרמטרים בשאילתה.**                                                                                              |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | כלי SQL לחילוץ מידע על סכמת מסד נתונים קיימת. זה מאפשר לנו לאמת בקלות שכל האינדקסים, הטבלאות, העמודות, המגבלות ועוד תקינים ותואמים `1:1` למה שהם צריכים להיות.  כתבנו אפילו עזרים אוטומטיים להוספת עמודות ואינדקסים חדשים אם נעשות שינויים בסכמות מסד הנתונים (עם התראות שגיאה מפורטות מאוד). |
| [knex](https://github.com/knex/knex)                                                          | בונה שאילתות SQL שאנו משתמשים בו רק למיגרציות מסד נתונים ולאימות סכמות דרך `knex-schema-inspector`.                                                                                                                                                                                                                                                   |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | תרגום אוטומטי של ביטויים [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) עם תמיכה ב-Markdown באמצעות [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                     |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | חבילת Node.js לפתרון והקמת חיבורים עם שרתי MX וטיפול בשגיאות.                                                                                                                                                                                                                                                                              |
| [pm2](https://github.com/Unitech/pm2)                                                         | מנהל תהליכים ל-Node.js בסביבת ייצור עם מאזן עומסים מובנה ([מכוון היטב](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) לביצועים).                                                                                                                                                                                                   |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | ספריית שרת SMTP – אנו משתמשים בזה לשרת החלפת המייל ("MX") ושרת ה-SMTP היוצא שלנו.                                                                                                                                                                                                                                                                            |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | כלי שימושי לבדיקת שרתי IMAP מול מדדים ותקינות פרוטוקול IMAP לפי RFC.  הפרויקט נוצר על ידי צוות [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (שרת IMAP ו-POP3 בקוד פתוח פעיל מאז יולי 2002). בדקנו לעומק את שרת ה-IMAP שלנו עם הכלי הזה.                                    |
> אתה יכול למצוא פרויקטים נוספים שבהם אנו משתמשים ב-[קוד המקור שלנו ב-GitHub](https://github.com/forwardemail).

### ספקים {#providers}

| ספק                                            | מטרה                                                                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | ספק DNS, בדיקות בריאות, מאזני עומס ואחסון גיבוי באמצעות [Cloudflare R2](https://developers.cloudflare.com/r2).              |
| [GitHub](https://github.com/)                   | אחסון קוד מקור, CI/CD וניהול פרויקטים.                                                                                      |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | אירוח שרתים ייעודיים ומסדי נתונים מנוהלים.                                                                                  |
| [Vultr](https://www.vultr.com/?ref=7429848)     | אירוח שרתים ייעודיים.                                                                                                        |
| [DataPacket](https://www.datapacket.com)        | אירוח שרתים ייעודיים.                                                                                                        |


## מחשבות {#thoughts}

### עקרונות {#principles}

Forward Email מעוצב בהתאם לעקרונות הבאים:

1. תמיד להיות ידידותי למפתחים, ממוקד אבטחה ופרטיות, ושקוף.
2. לעמוד ב-[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor), ו-[dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. לפנות למפתחים עצמאיים, ממומנים בעצמם, ו[רווחיים מרמן](http://www.paulgraham.com/ramenprofitable.html)

### ניסויים {#experiments}

> **תקציר;** בסופו של דבר שימוש באחסון אובייקטים תואם S3 ו/או טבלאות וירטואליות אינו ישים טכנית מסיבות ביצועים ורגיש לשגיאות עקב מגבלות זיכרון.

ביצענו כמה ניסויים שהובילו לפתרון SQLite הסופי שלנו כפי שנדון לעיל.

אחד מהם היה ניסיון להשתמש ב-[rclone]() ו-SQLite יחד עם שכבת אחסון תואמת S3.

ניסוי זה הוביל אותנו להבנה נוספת ולגילוי מקרים קצה סביב השימוש ב-rclone, SQLite ו-[VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* אם מפעילים את הדגל `--vfs-cache-mode writes` עם rclone, אז הקריאות יהיו בסדר, אך הכתיבות יישמרו במטמון.
  * אם יש לך מספר שרתי IMAP המפוזרים ברחבי העולם, אז המטמון יהיה לא סינכרוני ביניהם אלא אם יש כותב יחיד ומספר מאזינים (למשל גישת pub/sub).
  * זה מורכב מאוד והוספת כל מורכבות נוספת כזו תגרום לנקודות כשל בודדות נוספות.
  * ספקי אחסון תואמי S3 אינם תומכים בשינויים חלקיים בקבצים – מה שאומר שכל שינוי בקובץ `.sqlite` יגרום לשינוי מלא והעלאה מחדש של מסד הנתונים.
  * קיימות פתרונות אחרים כמו `rsync`, אך הם אינם מתמקדים בתמיכה בכתיבת יומן מקדימה ("[WAL](https://www.sqlite.org/wal.html)") – לכן סקרנו את Litestream. למזלנו השימוש בהצפנה שלנו כבר מצפין את קבצי [WAL](https://www.sqlite.org/wal.html), כך שאיננו צריכים להסתמך על Litestream לכך. עם זאת, עדיין לא היינו בטוחים בשימוש ב-Litestream לייצור ויש לנו כמה הערות להלן.
  * שימוש באפשרות `--vfs-cache-mode writes` (הדרך *היחידה* להשתמש ב-SQLite מעל `rclone` לכתיבות) ינסה להעתיק את כל מסד הנתונים מההתחלה בזיכרון – טיפול בתיבת דואר של 10 גיגה-בייט הוא בסדר, אך טיפול במספר תיבות דואר עם אחסון גבוה מאוד יגרום לשרתי IMAP להיתקל במגבלות זיכרון ובשגיאות `ENOMEM`, קריסות זיכרון, ושחיתות נתונים.
* אם תנסה להשתמש ב-[טבלאות וירטואליות](https://www.sqlite.org/vtab.html) של SQLite (למשל באמצעות [s3db](https://github.com/jrhy/s3db)) כדי לאחסן נתונים בשכבת אחסון תואמת S3, תיתקל בכמה בעיות נוספות:
  * קריאות וכתיבות יהיו איטיות מאוד כי יש לפנות לנקודות קצה של S3 עם שיטות HTTP `GET`, `PUT`, `HEAD`, ו-`POST`.
  * בדיקות פיתוח הראו כי מעבר ל-500K-1M+ רשומות באינטרנט סיבים אופטיים עדיין מוגבל על ידי קצב הכתיבה והקריאה לספקי אחסון תואמי S3. לדוגמה, המפתחים שלנו הריצו לולאות `for` לביצוע הצהרות SQL `INSERT` סדרתיות וכתיבה בכמויות גדולות. בשני המקרים הביצועים היו איטיים להפליא.
  * לטבלאות וירטואליות **אין אפשרות לאינדקסים**, הצהרות `ALTER TABLE`, ו[מגבלות](https://sqlite.org/lang_createvtab.html) [אחרות](https://stackoverflow.com/a/12507650) – מה שמוביל לעיכובים של 1-2 דקות ואף יותר בהתאם לכמות הנתונים.
  * האובייקטים נשמרו ללא הצפנה ואין תמיכה טבעית בהצפנה זמינה.
* גם בדקנו שימוש ב-[sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) שהוא דומה מבחינה רעיונית וטכנית לנקודה הקודמת (ולכן יש לו את אותן הבעיות). אפשרות תהיה להשתמש בבניית `sqlite3` מותאמת עם הצפנה כמו [wxSQLite3](https://github.com/utelle/wxsqlite3) (שאנחנו משתמשים בה כיום בפתרון שלנו לעיל) דרך [עריכת קובץ ההתקנה](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* גישה פוטנציאלית נוספת הייתה להשתמש ב[הרחבת multiplex](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), אך יש לה מגבלה של 32 גיגה-בייט והיא תדרוש בנייה מורכבת וכאבי ראש בפיתוח.
* הצהרות `ALTER TABLE` נדרשות (כך שזה שולל לחלוטין שימוש בטבלאות וירטואליות). אנו זקוקים להצהרות `ALTER TABLE` כדי שה-hook שלנו עם `knex-schema-inspector` יעבוד כראוי – מה שמבטיח שהנתונים לא ייפגמו ושהשורות שנשלפות יוכלו להיות מומרות למסמכים תקינים לפי הגדרות הסכימה של `mongoose` שלנו (שכוללות הגבלות, סוג משתנה, ואימות נתונים שרירותי).
* כמעט כל הפרויקטים התואמים ל-S3 הקשורים ל-SQLite בקהילה הקוד הפתוח הם בפייתון (ולא ב-JavaScript שאנו משתמשים בו ב-100% מהסטאק שלנו).
* ספריות דחיסה כמו [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (ראה [הערות](https://news.ycombinator.com/item?id=32303762)) נראות מבטיחות, אך [ייתכן שעדיין אינן מוכנות לשימוש בייצור](https://github.com/phiresky/sqlite-zstd#usage). במקום זאת, דחיסה בצד היישום על סוגי נתונים כמו `String`, `Object`, `Map`, `Array`, `Set`, ו-`Buffer` תהיה גישה נקייה וקלה יותר (וגם קלה יותר למיגרציה, שכן נוכל לאחסן דגל `Boolean` או עמודה – או אפילו להשתמש ב-`PRAGMA` `user_version=1` לדחיסה או `user_version=0` ללא דחיסה כמטא-נתוני מסד הנתונים).
  * למזלנו כבר יש לנו יישום של הסרת שכפולים בקבצים מצורפים באחסון שרת ה-IMAP שלנו – לכן כל הודעה עם אותו קובץ מצורף לא תשמור עותק של הקובץ – במקום זאת קובץ מצורף יחיד נשמר עבור הודעות ושרשורים מרובים בתיבת דואר (והפניה זרה משמשת לאחר מכן).
* פרויקט Litestream, שהוא פתרון שכפול וגיבוי ל-SQLite, מבטיח מאוד ונשתמש בו ככל הנראה בעתיד.
  * לא לזלזל במחבר(ים) – כי אנו אוהבים את עבודתם ותרומתם לקוד פתוח כבר למעלה מעשור – אך משימוש בעולם האמיתי נראה שיש [הרבה כאבי ראש](https://github.com/benbjohnson/litestream/issues) ו[אובדן נתונים פוטנציאלי משימוש](https://github.com/benbjohnson/litestream/issues/218).
* שחזור גיבויים צריך להיות ללא חיכוכים וטריוויאלי. שימוש בפתרון כמו MongoDB עם `mongodump` ו-`mongoexport` הוא לא רק מייגע, אלא גם גוזל זמן ומורכב בקונפיגורציה.
  * מסדי נתונים של SQLite עושים זאת פשוט (זהו קובץ יחיד).
  * רצינו לעצב פתרון שבו משתמשים יוכלו לקחת את תיבת הדואר שלהם ולעזוב בכל רגע.
    * פקודות Node.js פשוטות כמו `fs.unlink('mailbox.sqlite')` ומסד הנתונים נמחק לצמיתות מאחסון הדיסק.
    * נוכל באותה צורה להשתמש ב-API תואם S3 עם HTTP `DELETE` כדי להסיר בקלות צילומי מצב וגיבויים למשתמשים.
  * SQLite היה הפתרון הפשוט, המהיר והחסכוני ביותר.
### חוסר באלטרנטיבות {#lack-of-alternatives}

למיטב ידיעתנו, אין שירותי דואר אלקטרוני אחרים שעוצבו בצורה זו ואינם קוד פתוח.

אנחנו *חושבים שזה עשוי להיות* בגלל ששירותי דואר קיימים משתמשים בטכנולוגיה ישנה בפרודקשן עם [קוד ספגטי](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

רוב אם לא כל ספקי שירותי הדואר הקיימים הם או קוד סגור או מפרסמים עצמם כקוד פתוח, **אבל במציאות רק החזית שלהם היא קוד פתוח.**

**החלק הרגיש ביותר בדואר האלקטרוני** (האחסון בפועל/IMAP/SMTP) **נעשה כולו בצד השרת (back-end), ו*לא* בצד הלקוח (front-end).**

### נסו את Forward Email {#try-out-forward-email}

הירשמו היום בכתובת <https://forwardemail.net>! :rocket:
