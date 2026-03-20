# מדריך מלא להגדרת דואר אלקטרוני ב-NAS עם Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

הגדרת התראות דואר אלקטרוני ב-NAS שלך לא צריכה להיות סיוט. בין אם יש לך Synology, QNAP, או אפילו התקנת Raspberry Pi, מדריך זה יגרום למכשיר שלך לתקשר עם Forward Email כך שתדע באמת מתי משהו משתבש.

רוב מכשירי ה-NAS יכולים לשלוח התראות דואר אלקטרוני על תקלות בכוננים, אזהרות טמפרטורה, השלמת גיבויים ואירועי אבטחה. הבעיה? ספקי דואר רבים הפכו קפדניים לגבי אבטחה, ומכשירים ישנים לעיתים לא מצליחים לעמוד בקצב. כאן Forward Email נכנס לתמונה - אנו תומכים גם במכשירים מודרניים וגם במכשירים ישנים.

מדריך זה כולל הגדרת דואר אלקטרוני ל-75+ ספקי NAS עם הוראות שלב אחר שלב, מידע על תאימות וטיפים לפתרון בעיות. לא משנה איזה מכשיר אתה משתמש, נגרום להתראות שלך לעבוד.


## תוכן העניינים {#table-of-contents}

* [למה אתה צריך התראות דואר אלקטרוני ב-NAS](#why-you-need-nas-email-notifications)
* [בעיית TLS (ואיך אנחנו פותרים אותה)](#the-tls-problem-and-how-we-fix-it)
* [הגדרות SMTP של Forward Email](#forward-email-smtp-settings)
* [מטריצת תאימות מקיפה לספקי NAS](#comprehensive-nas-provider-compatibility-matrix)
* [הגדרת דואר אלקטרוני ב-Synology NAS](#synology-nas-email-configuration)
  * [שלבי ההגדרה](#configuration-steps)
* [הגדרת דואר אלקטרוני ב-QNAP NAS](#qnap-nas-email-configuration)
  * [שלבי ההגדרה](#configuration-steps-1)
  * [בעיות נפוצות בפתרון תקלות ב-QNAP](#common-qnap-troubleshooting-issues)
* [הגדרת Legacy ב-ReadyNAS](#readynas-legacy-configuration)
  * [שלבי הגדרת Legacy](#legacy-configuration-steps)
  * [פתרון תקלות ב-ReadyNAS](#readynas-troubleshooting)
* [הגדרת TerraMaster NAS](#terramaster-nas-configuration)
* [הגדרת ASUSTOR NAS](#asustor-nas-configuration)
* [הגדרת Buffalo TeraStation](#buffalo-terastation-configuration)
* [הגדרת Western Digital My Cloud](#western-digital-my-cloud-configuration)
* [הגדרת דואר אלקטרוני ב-TrueNAS](#truenas-email-configuration)
* [הגדרת OpenMediaVault](#openmediavault-configuration)
* [הגדרת Raspberry Pi NAS](#raspberry-pi-nas-configuration)
  * [הגדרת Raspberry Pi ראשונית](#initial-raspberry-pi-setup)
  * [הגדרת שיתוף קבצים Samba](#samba-file-sharing-configuration)
  * [הגדרת שרת FTP](#ftp-server-setup)
  * [הגדרת התראות דואר אלקטרוני](#email-notification-configuration)
  * [תכונות מתקדמות ל-Raspberry Pi NAS](#advanced-raspberry-pi-nas-features)
  * [פתרון תקלות דואר אלקטרוני ב-Raspberry Pi](#raspberry-pi-email-troubleshooting)
  * [אופטימיזציית ביצועים](#performance-optimization)
  * [שיקולי אבטחה](#security-considerations)


## למה אתה צריך התראות דואר אלקטרוני ב-NAS {#why-you-need-nas-email-notifications}

ה-NAS שלך עוקב אחרי המון דברים - בריאות הכוננים, טמפרטורה, בעיות רשת, אירועי אבטחה. בלי התראות דואר אלקטרוני, בעיות עלולות להישאר בלתי מורגשות במשך שבועות, מה שעלול לגרום לאובדן נתונים או לפרצות אבטחה.

התראות דואר אלקטרוני נותנות לך התראות מיידיות כאשר כוננים מתחילים להיכשל, מזהירות מפני ניסיונות גישה לא מורשים, מאשרות גיבויים מוצלחים ושומרות אותך מעודכן לגבי מצב המערכת. Forward Email מוודא שההתראות הקריטיות האלה אכן מגיעות אליך.


## בעיית TLS (ואיך אנחנו פותרים אותה) {#the-tls-problem-and-how-we-fix-it}

הנה העניין: אם ה-NAS שלך יוצר לפני 2020, סביר להניח שהוא תומך רק ב-TLS 1.0. Gmail, Outlook ורוב הספקים הפסיקו לתמוך בזה כבר לפני שנים. המכשיר שלך מנסה לשלוח דואר, נדחה, ואתה נשאר בחושך.

Forward Email פותר את זה עם תמיכה בשני פורטים. מכשירים מודרניים משתמשים בפורטים הסטנדרטיים שלנו (`465` ו-`587`), בעוד שמכשירים ישנים יכולים להשתמש בפורטים הוותיקים שלנו (`2455` ו-`2555`) שעדיין תומכים ב-TLS 1.0.

> \[!IMPORTANT]
> Forward Email תומך גם במכשירי NAS מודרניים וגם בישנים באמצעות אסטרטגיית שני הפורטים שלנו. השתמש בפורטים 465/587 למכשירים מודרניים עם תמיכה ב-TLS 1.2+, ובפורט 2455/2555 למכשירים ישנים שתומכים רק ב-TLS 1.0.


## הגדרות SMTP של Forward Email {#forward-email-smtp-settings}
הנה מה שצריך לדעת על הגדרת SMTP שלנו:

**למכשירי NAS מודרניים (2020+):** השתמש ב-`smtp.forwardemail.net` עם פורט `465` (SSL/TLS) או פורט `587` (STARTTLS). אלה עובדים עם קושחה עדכנית התומכת ב-TLS 1.2+.

**למכשירי NAS ישנים יותר:** השתמש ב-`smtp.forwardemail.net` עם פורט `2455` (SSL/TLS) או פורט `2555` (STARTTLS). אלה תומכים ב-TLS 1.0 למכשירים ישנים.

**אימות:** השתמש בכינוי Forward Email שלך כשם המשתמש ובסיסמה שנוצרה מ-[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) (לא בסיסמת החשבון שלך).

> \[!CAUTION]
> לעולם אל תשתמש בסיסמת הכניסה לחשבון שלך לאימות SMTP. תמיד השתמש בסיסמה שנוצרה מ-[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) להגדרת NAS.

> \[!TIP]
> בדוק את גרסת הקושחה של מכשיר ה-NAS שלך ואת תמיכת ה-TLS לפני ההגדרה. רוב המכשירים שיוצרו אחרי 2020 תומכים בפרוטוקולי TLS מודרניים, בעוד שמכשירים ישנים יותר בדרך כלל דורשים פורטים לתאימות ישנה.


## מטריצת תאימות מקיפה לספקי NAS {#comprehensive-nas-provider-compatibility-matrix}

המטריצה הבאה מספקת מידע מפורט על תאימות לספקי NAS מרכזיים, כולל רמות תמיכת TLS, מצב הקושחה, והגדרות מומלצות של Forward Email.

| ספק NAS          | דגמים נוכחיים  | תמיכת TLS   | מצב קושחה      | פורטים מומלצים  | בעיות נפוצות                                                                                                                                          | מדריך הגדרה/צילום מסך                                                                                                                         |
| ---------------- | -------------- | ----------- | -------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology         | DSM 7.x        | TLS 1.2+    | פעיל           | `465`, `587`    | [הגדרת STARTTLS](https://community.synology.com/enu/forum/2/post/124584)                                                                              | [הגדרת התראות דוא"ל ב-DSM](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                                   |
| QNAP             | QTS 5.x        | TLS 1.2+    | פעיל           | `465`, `587`    | [כשלונות במרכז ההתראות](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)      | [הגדרת שרת דוא"ל ב-QTS](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html)          |
| Raspberry Pi     | Raspberry Pi OS| TLS 1.2+    | פעיל           | `465`, `587`    | [בעיות בפתרון DNS](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                        | [מדריך הגדרת דוא"ל ל-Raspberry Pi](#raspberry-pi-nas-configuration)                                                                             |
| ASUSTOR          | ADM 4.x        | TLS 1.2+    | פעיל           | `465`, `587`    | [אימות תעודה](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                                 | [הגדרת התראות ASUSTOR](https://www.asustor.com/en/online/online_help?id=8)                                                                     |
| TerraMaster      | TOS 6.x        | TLS 1.2     | פעיל           | `465`, `587`    | [אימות SMTP](https://www.terra-master.com/global/forum/)                                                                                            | [הגדרת דוא"ל TerraMaster](https://www.terra-master.com/global/support/download.php)                                                             |
| TrueNAS          | SCALE/CORE     | TLS 1.2+    | פעיל           | `465`, `587`    | [הגדרת תעודת SSL](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                               | [מדריך הגדרת דוא"ל TrueNAS](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)                      |
| Buffalo          | TeraStation    | TLS 1.2     | מוגבל          | `465`, `587`    | [תאימות קושחה](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)                 | [הגדרת דוא"ל TeraStation](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)  |
| Western Digital  | My Cloud OS 5  | TLS 1.2     | מוגבל          | `465`, `587`    | [תאימות מערכת הפעלה ישנה](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                             | [הגדרת דוא"ל My Cloud](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                             |
| OpenMediaVault   | OMV 7.x        | TLS 1.2+    | פעיל           | `465`, `587`    | [תלויות תוספים](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                           | [הגדרת התראות OMV](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                        |
| Netgear ReadyNAS | OS 6.x         | TLS 1.0 בלבד| הופסק          | `2455`, `2555`  | [תמיכת TLS ישנה](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                           | [הגדרת התראות דוא"ל ReadyNAS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)          |
| Drobo            | Dashboard      | TLS 1.2     | הופסק          | `465`, `587`    | [תמיכה מוגבלת](https://myprojects.drobo.com/support/)                                                                                              | [התראות דוא"ל Drobo](https://www.drobo.com/support/)                                                                                           |
מטריצה זו מדגימה את החלוקה הברורה בין מערכות NAS מודרניות שמתוחזקות באופן פעיל לבין מכשירים ישנים שדורשים שיקולי תאימות מיוחדים. רוב מכשירי ה-NAS הנוכחיים תומכים בסטנדרטים מודרניים של TLS ויכולים להשתמש ביציאות ה-SMTP הראשיות של Forward Email ללא כל תצורה מיוחדת.


## תצורת דואר אלקטרוני ל-Synology NAS {#synology-nas-email-configuration}

מכשירי Synology עם DSM די פשוטים להקמה. הם תומכים ב-TLS מודרני, כך שניתן להשתמש ביציאות הסטנדרטיות שלנו ללא בעיות.

> \[!NOTE]
> Synology DSM 7.x מספק את תכונות ההתראות בדואר האלקטרוני המקיפות ביותר. גרסאות DSM ישנות יותר עשויות לכלול אפשרויות תצורה מוגבלות.

### שלבי התצורה {#configuration-steps}

1. **גש לממשק הווב של DSM** על ידי הזנת כתובת ה-IP של מכשיר ה-NAS שלך או מזהה QuickConnect בדפדפן אינטרנט.

2. **נווט ללוח הבקרה** ובחר בקטגוריית "התראות", ואז לחץ על לשונית "דואר אלקטרוני" כדי לגשת לאפשרויות תצורת הדואר.

3. **הפעל התראות בדואר אלקטרוני** על ידי סימון תיבת הסימון "הפעל התראות בדואר אלקטרוני".

4. **הגדר את שרת ה-SMTP** על ידי הזנת `smtp.forwardemail.net` ככתובת השרת.

5. **הגדר את תצורת היציאה** ליציאה 465 עבור חיבורי SSL/TLS (מומלץ). יציאה 587 עם STARTTLS נתמכת גם כחלופה.

6. **הגדר אימות** על ידי בחירת "נדרש אימות SMTP" והזנת הכינוי שלך ב-Forward Email בשדה שם המשתמש.

7. **הזן את הסיסמה שלך** באמצעות הסיסמה שנוצרה ב-[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

8. **הגדר כתובות נמענים** על ידי הזנת עד חמש כתובות דואר אלקטרוני שיקבלו התראות.

9. **הגדר סינון התראות** כדי לשלוט באירועים שמפעילים התראות בדואר, למנוע עומס התראות תוך הבטחת דיווח על אירועים קריטיים.

10. **בדוק את התצורה** באמצעות פונקציית הבדיקה המובנית של DSM כדי לוודא שכל ההגדרות נכונות ושהתקשורת עם שרתי Forward Email פועלת כראוי.

> \[!TIP]
> Synology מאפשרת סוגי התראות שונים לנמענים שונים, ומספקת גמישות באופן הפצת ההתראות בצוות שלך.


## תצורת דואר אלקטרוני ל-QNAP NAS {#qnap-nas-email-configuration}

מכשירי QNAP עם QTS עובדים מצוין עם Forward Email. הם תומכים ב-TLS מודרני ויש להם ממשק ווב נוח לתצורה.

> \[!IMPORTANT]
> ב-QNAP QTS 5.2.4 הייתה בעיה ידועה עם התראות בדואר אלקטרוני ש-[תוקנה ב-QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). ודא שהקושחה שלך מעודכנת כדי למנוע כשלי התראות.

### שלבי התצורה {#configuration-steps-1}

1. **גש לממשק הווב של מכשיר ה-QNAP שלך** על ידי הזנת כתובת ה-IP שלו בדפדפן אינטרנט.

2. **נווט ללוח הבקרה** ובחר ב"חשבון שירות וזיווג מכשירים", ואז לחץ על קטגוריית "דואר אלקטרוני" כדי להתחיל בתצורת הדואר.

3. **לחץ על "הוסף שירות SMTP"** כדי ליצור תצורת דואר חדשה.

4. **הגדר את שרת ה-SMTP** על ידי הזנת `smtp.forwardemail.net` ככתובת שרת ה-SMTP.

5. **בחר את פרוטוקול האבטחה המתאים** - בחר "SSL/TLS" עם יציאה `465` (מומלץ). יציאה `587` עם STARTTLS נתמכת גם כן.

6. **הגדר את מספר היציאה** - יציאה `465` עם SSL/TLS מומלצת. יציאה `587` עם STARTTLS זמינה גם אם יש צורך.

7. **הזן את פרטי האימות שלך** באמצעות הכינוי שלך ב-Forward Email כשם המשתמש והסיסמה שנוצרה ב-[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

8. **הגדר מידע על השולח** על ידי הזנת שם תיאורי בשדה "מאת", כגון "מערכת QNAP NAS" או שם המארח של המכשיר שלך.

9. **הגדר כתובות נמענים** לסוגי התראות שונים. QNAP מאפשרת להגדיר קבוצות נמענים מרובות לסוגי התראות שונים.

10. **בדוק את התצורה** באמצעות פונקציית הבדיקה המובנית של QNAP כדי לוודא שכל ההגדרות פועלות כראוי.

> \[!TIP]
> אם אתה נתקל ב[בעיות תצורת SMTP של Gmail](https://forum.qnap.com/viewtopic.php?t=152466), אותם שלבי פתרון בעיות חלים גם על Forward Email. ודא שהאימות מופעל כראוי ושהפרטים נכונים.
> \[!NOTE]
> מכשירי QNAP תומכים בתזמון התראות מתקדם, המאפשר לך להגדיר שעות שקט שבהן התראות לא קריטיות מדוכאות. זה שימושי במיוחד בסביבות עסקיות.

### בעיות נפוצות בפתרון תקלות QNAP {#common-qnap-troubleshooting-issues}

אם מכשיר ה-QNAP שלך [לא מצליח לשלוח מיילי התראה](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), בדוק את הדברים הבאים:

* אמת שהפרטי ההתחברות שלך ל-Forward Email נכונים
* ודא שכתובת שרת ה-SMTP היא בדיוק `smtp.forwardemail.net`
* אשר שהפורט תואם לשיטת ההצפנה שלך (`465` ל-SSL/TLS מומלץ; `587` ל-STARTTLS נתמך גם כן)
* בדוק שה-[הגדרת שרת ה-SMTP](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) מאפשרת את החיבור


## תצורת ReadyNAS ישנה {#readynas-legacy-configuration}

מכשירי Netgear ReadyNAS מציגים אתגרים ייחודיים עקב הפסקת תמיכת הקושחה שלהם ותלות בפרוטוקולי TLS 1.0 ישנים. עם זאת, התמיכה של Forward Email בפורטים ישנים מבטיחה שמכשירים אלו יוכלו להמשיך לשלוח התראות בדוא"ל באופן אמין.

> \[!CAUTION]
> ReadyNAS OS 6.x תומך רק ב-TLS 1.0, מה שדורש את פורטי התאימות הישנים של Forward Email `2455` ו-`2555`. פורטים מודרניים `465` ו-`587` לא יעבדו עם מכשירים אלו.

### שלבי תצורה ישנה {#legacy-configuration-steps}

1. **גש לממשק האינטרנט של ReadyNAS** על ידי הזנת כתובת ה-IP של המכשיר בדפדפן.

2. **נווט ל-System > Settings > Alerts** כדי לגשת לחלק תצורת המייל.

3. **הגדר את שרת ה-SMTP** על ידי הזנת `smtp.forwardemail.net` ככתובת השרת.

4. **הגדר את פורט החיבור** ל-`2455` עבור חיבורי SSL/TLS או ל-`2555` עבור חיבורי STARTTLS - אלו פורטי התאימות הישנים של Forward Email.

5. **אפשר אימות** והזן את שם המשתמש ככינוי Forward Email שלך ואת הסיסמה שנוצרה ב-[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **הגדר מידע על השולח** עם כתובת "מ-" תיאורית לזיהוי מכשיר ReadyNAS.

7. **הוסף כתובות דוא"ל של נמענים** באמצעות כפתור ה-+ בחלק אנשי הקשר של המייל.

8. **בדוק את התצורה** כדי לוודא שחיבור TLS הישן פועל כראוי.

> \[!IMPORTANT]
> מכשירי ReadyNAS דורשים את הפורטים הישנים מכיוון שהם אינם יכולים להקים חיבורים מאובטחים באמצעות פרוטוקולי TLS מודרניים. זו [מגבלה ידועה](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) של הקושחה שהופסקה.

### פתרון תקלות ReadyNAS {#readynas-troubleshooting}

בעיות נפוצות בתצורת המייל של ReadyNAS כוללות:

* **אי התאמה בגרסת TLS**: ודא שאתה משתמש בפורטים `2455` או `2555`, לא בפורטים המודרניים
* **כשלי אימות**: אמת שהפרטי ההתחברות שלך ל-Forward Email נכונים
* **חיבוריות רשת**: בדוק שה-ReadyNAS יכול להגיע ל-`smtp.forwardemail.net`
* **מגבלות קושחה**: דגמי ReadyNAS ישנים עשויים לדרוש [הגדרות HTTPS נוספות](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

מכשירי ReadyNAS הפועלים על OS 6.x וגרסאות מוקדמות תומכים רק בחיבורים TLS 1.0, שרוב ספקי המייל המודרניים כבר אינם מקבלים. פורטי ה-legacy הייעודיים של Forward Email (2455 ו-2555) תומכים במיוחד בפרוטוקולים הישנים הללו, ומבטיחים המשכיות תפקודית למשתמשי ReadyNAS.

כדי להגדיר מייל במכשירי ReadyNAS, גש לממשק האינטרנט של המכשיר דרך כתובת ה-IP שלו. נווט לקטגוריית System ובחר ב-"Notifications" כדי לגשת לאפשרויות תצורת המייל.

בחלק תצורת המייל, אפשר התראות דוא"ל והזן את smtp.forwardemail.net כשרת SMTP. זה קריטי - השתמש בפורטי התאימות הישנים של Forward Email במקום פורטי SMTP סטנדרטיים.

לחיבורי SSL/TLS, הגדר את הפורט ל-2455 במקום הפורט הסטנדרטי 465 (מומלץ). לחיבורי STARTTLS, השתמש בפורט 2555 במקום פורט 587. פורטים מיוחדים אלו שומרים על תאימות TLS 1.0 תוך מתן האבטחה הטובה ביותר הזמינה למכשירים ישנים.
הזן את שם המשתמש ככינוי Forward Email שלך ואת הסיסמה שנוצרה לאימות. מכשירי ReadyNAS תומכים באימות SMTP, הנדרש לחיבורי Forward Email.

הגדר את כתובת הדוא"ל של השולח ואת כתובות הנמענים בהתאם לדרישות ההודעות שלך. ReadyNAS מאפשר כתובות נמענים מרובות, מה שמאפשר לך להפיץ התראות לחברי צוות שונים או לחשבונות דוא"ל שונים.

בדוק את ההגדרות בקפידה, מכיוון שמכשירי ReadyNAS עשויים לא לספק הודעות שגיאה מפורטות אם ההגדרה נכשלת. אם הבדיקה הסטנדרטית לא עובדת, ודא שאתה משתמש ביציאות הוותיקות הנכונות (2455 או 2555) במקום ביציאות SMTP המודרניות.

שקול את ההשלכות הביטחוניות של שימוש בפרוטוקולי TLS ישנים. בעוד שיציאות ה-TLS הוותיקות של Forward Email מספקות את האבטחה הטובה ביותר הזמינה למכשירים ישנים, מומלץ לשדרג למערכת NAS מודרנית עם תמיכה ב-TLS עדכנית כאשר זה אפשרי.


## הגדרת TerraMaster NAS {#terramaster-nas-configuration}

מכשירי TerraMaster הפועלים על TOS 6.x תומכים ב-TLS מודרני ופועלים היטב עם יציאות Forward Email הסטנדרטיות.

> \[!NOTE]
> TerraMaster TOS 6.x מספקת תכונות התראה בדוא"ל מקיפות. ודא שהקושחה שלך מעודכנת עבור התאימות הטובה ביותר.

1. **גש להגדרות המערכת**
   * התחבר לממשק האינטרנט של TerraMaster שלך
   * עבור אל **לוח בקרה** > **התראות**

2. **הגדר את הגדרות SMTP**
   * שרת: `smtp.forwardemail.net`
   * יציאה: `465` (SSL/TLS, מומלץ) או `587` (STARTTLS)
   * שם משתמש: כינוי Forward Email שלך
   * סיסמה: סיסמה שנוצרה מ-[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **הפעל התראות**
   * סמן את סוגי ההתראות שברצונך לקבל
   * בדוק את ההגדרות עם פונקציית הבדיקה המובנית

> \[!TIP]
> מכשירי TerraMaster פועלים בצורה הטובה ביותר עם יציאה `465` עבור חיבורי SSL/TLS (מומלץ). אם אתה נתקל בבעיות, יציאה `587` עם STARTTLS נתמכת גם כן.


## הגדרת ASUSTOR NAS {#asustor-nas-configuration}

מכשירי ASUSTOR עם ADM 4.x כוללים תמיכה יציבה בהתראות דוא"ל ופועלים בצורה חלקה עם Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x כוללת אפשרויות סינון התראות מתקדמות. ניתן להתאים אילו אירועים מפעילים התראות בדוא"ל.

1. **פתח את הגדרות ההתראות**
   * גש לממשק האינטרנט של ADM
   * עבור אל **הגדרות** > **התראות**

2. **הגדר את תצורת SMTP**
   * שרת SMTP: `smtp.forwardemail.net`
   * יציאה: `465` (SSL/TLS, מומלץ) או `587` (STARTTLS)
   * אימות: הפעל
   * שם משתמש: כינוי Forward Email שלך
   * סיסמה: סיסמה שנוצרה מ-[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **הגדר סוגי התראות**
   * בחר אילו אירועי מערכת יפעילו דוא"ל
   * הגדר כתובות נמענים
   * בדוק את ההגדרות

> \[!IMPORTANT]
> מכשירי ASUSTOR דורשים שהאימות יופעל במפורש בהגדרות SMTP. אל תשכח לסמן אפשרות זו.


## הגדרת Buffalo TeraStation {#buffalo-terastation-configuration}

מכשירי Buffalo TeraStation כוללים יכולות התראה בדוא"ל מוגבלות אך פונקציונליות. ההגדרה פשוטה ברגע שאתה יודע איפה לחפש.

> \[!CAUTION]
> עדכוני קושחה ל-Buffalo TeraStation הם לא תכופים. ודא שאתה משתמש בקושחה העדכנית ביותר הזמינה לדגם שלך לפני הגדרת הדוא"ל.

1. **גש להגדרות האינטרנט**
   * התחבר לממשק האינטרנט של TeraStation שלך
   * עבור אל **מערכת** > **התראות**

2. **הגדר את הגדרות הדוא"ל**
   * שרת SMTP: `smtp.forwardemail.net`
   * יציאה: `465` (SSL/TLS, מומלץ) או `587` (STARTTLS)
   * שם משתמש: כינוי Forward Email שלך
   * סיסמה: סיסמה שנוצרה מ-[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * הפעל הצפנת SSL/TLS

3. **הגדר העדפות התראה**
   * בחר אילו אירועים יפעילו דוא"ל (שגיאות דיסק, התראות טמפרטורה וכו')
   * הזן כתובות דוא"ל של נמענים
   * שמור ובדוק את ההגדרות

> \[!NOTE]
> ייתכן שלחלק מדגמי TeraStation הישנים יש אפשרויות מוגבלות להגדרת SMTP. בדוק את התיעוד של הדגם שלך עבור יכולות ספציפיות.
## תצורת Western Digital My Cloud {#western-digital-my-cloud-configuration}

מכשירי Western Digital My Cloud הפועלים על OS 5 תומכים בהתראות בדואר אלקטרוני, אם כי הממשק יכול להיות מעט מוסתר בהגדרות.

> \[!WARNING]
> Western Digital הפסיקה את התמיכה ברבים מדגמי My Cloud. בדוק אם המכשיר שלך עדיין מקבל עדכוני קושחה לפני שתסתמך על התראות בדואר אלקטרוני לאירועים קריטיים.

1. **נווט להגדרות**
   * פתח את לוח הבקרה של My Cloud בדפדפן
   * עבור ל- **Settings** > **General** > **Notifications**

2. **הגדר פרטי SMTP**
   * שרת דואר: `smtp.forwardemail.net`
   * פורט: `465` (SSL/TLS, מומלץ) או `587` (STARTTLS)
   * שם משתמש: הכינוי שלך ב-Forward Email
   * סיסמה: סיסמה שנוצרה מ-[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * הפעל הצפנה

3. **הגדר סוגי התראות**
   * בחר קטגוריות התראות (התראות מערכת, בריאות הדיסק וכו')
   * הוסף כתובות דואר אלקטרוני של נמענים
   * בדוק את תצורת הדואר האלקטרוני

> \[!TIP]
> אנו ממליצים להשתמש בפורט `465` עם SSL/TLS. אם יש בעיות, פורט `587` עם STARTTLS נתמך גם כן.


## תצורת TrueNAS לדואר אלקטרוני {#truenas-email-configuration}

TrueNAS (גם SCALE וגם CORE) מציע תמיכה מצוינת בהתראות דואר אלקטרוני עם אפשרויות תצורה מפורטות.

> \[!NOTE]
> TrueNAS מספקת חלק מהתכונות המקיפות ביותר להתראות דואר אלקטרוני בין מערכות NAS. ניתן להגדיר כללי התראה מפורטים ומספר נמענים.

1. **גש להגדרות מערכת**
   * התחבר לממשק האינטרנט של TrueNAS
   * עבור ל- **System** > **Email**

2. **הגדר הגדרות SMTP**
   * שרת דואר יוצא: `smtp.forwardemail.net`
   * פורט שרת הדואר: `465` (מומלץ) או `587`
   * אבטחה: SSL/TLS (ל-465, מומלץ) או STARTTLS (ל-587)
   * שם משתמש: הכינוי שלך ב-Forward Email
   * סיסמה: סיסמה שנוצרה מ-[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **הגדר התראות**
   * עבור ל- **System** > **Alert Services**
   * הגדר אילו התראות יש לשלוח בדואר אלקטרוני
   * הגדר כתובות נמענים ורמות התראה
   * בדוק את התצורה עם פונקציית הבדיקה המובנית

> \[!IMPORTANT]
> TrueNAS מאפשרת להגדיר רמות התראה שונות (INFO, NOTICE, WARNING, ERROR, CRITICAL). בחר רמות מתאימות כדי למנוע ספאם בדואר אלקטרוני תוך הבטחת דיווח על בעיות קריטיות.


## תצורת OpenMediaVault {#openmediavault-configuration}

OpenMediaVault מספקת יכולות התראות בדואר אלקטרוני יציבות דרך ממשק האינטרנט שלה. תהליך ההגדרה נקי ופשוט.

> \[!NOTE]
> מערכת ההתראות של OpenMediaVault מבוססת תוספים. ודא שיש לך את תוסף ההתראות בדואר אלקטרוני מותקן ומופעל.

1. **גש להגדרות התראות**
   * פתח את ממשק האינטרנט של OpenMediaVault
   * עבור ל- **System** > **Notification** > **Email**

2. **הגדר פרמטרי SMTP**
   * שרת SMTP: `smtp.forwardemail.net`
   * פורט: `465` (SSL/TLS, מומלץ) או `587` (STARTTLS)
   * שם משתמש: הכינוי שלך ב-Forward Email
   * סיסמה: סיסמה שנוצרה מ-[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * הפעל SSL/TLS

3. **הגדר כללי התראה**
   * עבור ל- **System** > **Notification** > **Notifications**
   * הגדר אילו אירועי מערכת יפעילו שליחת דואר אלקטרוני
   * הגדר כתובות נמענים
   * בדוק את פונקציונליות הדואר האלקטרוני

> \[!TIP]
> OpenMediaVault מאפשרת להגדיר לוחות זמנים להתראות. ניתן להגדיר שעות שקט או להגביל תדירות התראות כדי למנוע הצפה בהתראות.


## תצורת Raspberry Pi NAS {#raspberry-pi-nas-configuration}

Raspberry Pi מהווה נקודת כניסה מצוינת לפונקציונליות NAS, ומציע פתרון חסכוני לסביבות ביתיות ומשרדים קטנים. הגדרת Raspberry Pi כמכשיר NAS כוללת תצורת פרוטוקולי שיתוף קבצים, התראות בדואר אלקטרוני ושירותי רשת חיוניים.

> \[!TIP]
> לחובבי Raspberry Pi, אנו ממליצים בחום להשלים את הגדרת ה-NAS שלך עם [PiKVM](https://pikvm.org/) לניהול שרת מרחוק ו-[Pi-hole](https://pi-hole.net/) לחסימת פרסומות ברשת וניהול DNS. כלים אלו יוצרים סביבת מעבדה ביתית מקיפה.
### הגדרת ראשונית של Raspberry Pi {#initial-raspberry-pi-setup}

לפני הגדרת שירותי NAS, ודא ש-Raspberry Pi שלך מריץ את מערכת ההפעלה Raspberry Pi OS העדכנית ביותר ויש לו אחסון מספק. כרטיס microSD איכותי (Class 10 או טוב יותר) או כונן USB 3.0 SSD מספקים ביצועים ואמינות טובים יותר לפעולות NAS.

1. **עדכן את המערכת** על ידי הרצת `sudo apt update && sudo apt upgrade -y` כדי לוודא שכל החבילות מעודכנות.

2. **אפשר גישה דרך SSH** באמצעות `sudo systemctl enable ssh && sudo systemctl start ssh` לניהול מרחוק.

3. **הגדר כתובת IP סטטית** על ידי עריכת הקובץ `/etc/dhcpcd.conf` כדי להבטיח גישה עקבית לרשת.

4. **הגדר אחסון חיצוני** על ידי חיבור והרכבת כונני USB או הגדרת מערכי RAID לצורך רדונדנסיות של נתונים.

### הגדרת שיתוף קבצים Samba {#samba-file-sharing-configuration}

Samba מספקת שיתוף קבצים תואם Windows, מה שהופך את ה-Raspberry Pi שלך לנגיש מכל מכשיר ברשת שלך. תהליך ההגדרה כולל התקנת Samba, יצירת שיתופים, והגדרת אימות משתמשים.

התקן את Samba באמצעות `sudo apt install samba samba-common-bin` והגדר את קובץ ההגדרות הראשי ב-`/etc/samba/smb.conf`. צור תיקיות משותפות והגדר הרשאות מתאימות באמצעות `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

הגדר שיתופי Samba על ידי הוספת סעיפים לקובץ ההגדרות עבור כל תיקיה משותפת. הגדר אימות משתמשים באמצעות `sudo smbpasswd -a username` ליצירת סיסמאות ספציפיות ל-Samba לגישה ברשת.

> \[!IMPORTANT]
> תמיד השתמש בסיסמאות חזקות למשתמשי Samba ושקול לאפשר גישה לאורחים רק לתיקיות משותפות שאינן רגישות. עיין ב-[התיעוד הרשמי של Samba](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) להגדרות אבטחה מתקדמות.

### הגדרת שרת FTP {#ftp-server-setup}

FTP מספק שיטה נוספת לגישה לקבצים, במיוחד שימושית לגיבויים אוטומטיים וניהול קבצים מרחוק. התקן והגדר את vsftpd (Very Secure FTP Daemon) לשירותי FTP אמינים.

התקן את vsftpd באמצעות `sudo apt install vsftpd` והגדר את השירות על ידי עריכת `/etc/vsftpd.conf`. אפשר גישה למשתמשים מקומיים, הגדר הגדרות מצב פסיבי, והגדר הגבלות אבטחה מתאימות.

צור משתמשי FTP והגדר הרשאות גישה לתיקיות. שקול להשתמש ב-SFTP (SSH File Transfer Protocol) במקום FTP המסורתי לאבטחה משופרת, שכן הוא מצפין את כל העברת הנתונים.

> \[!CAUTION]
> FTP המסורתי משדר סיסמאות בטקסט ברור. תמיד השתמש ב-SFTP או הגדר FTP עם הצפנת TLS להעברות קבצים מאובטחות. עיין ב-[הנחיות האבטחה הטובות ביותר של vsftpd](https://security.appspot.com/vsftpd.html) לפני הפריסה.

### הגדרת התראות דוא"ל {#email-notification-configuration}

הגדר את Raspberry Pi NAS שלך לשלוח התראות דוא"ל עבור אירועי מערכת, התראות אחסון, ומצב סיום גיבוי. זה כולל התקנה והגדרה של סוכן העברת דואר והגדרת אינטגרציה עם Forward Email.

התקן את `msmtp` כלקוח SMTP קל משקל באמצעות `sudo apt install msmtp msmtp-mta`. צור את קובץ ההגדרות ב-`/etc/msmtprc` עם ההגדרות הבאות:

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

הגדר התראות מערכת על ידי יצירת משימות cron וסקריפטים לניטור מערכת שמשתמשים ב-msmtp לשליחת התראות. צור סקריפטים לניטור שטח דיסק, התראות טמפרטורה, והתראות סיום גיבוי.

### תכונות מתקדמות ל-Raspberry Pi NAS {#advanced-raspberry-pi-nas-features}

שפר את Raspberry Pi NAS שלך עם שירותים נוספים ויכולות ניטור. התקן והגדר כלי ניטור רשת, פתרונות גיבוי אוטומטיים, ושירותי גישה מרחוק.

הגדר את [Nextcloud](https://nextcloud.com/) לפונקציונליות ענן עם גישה לקבצים מבוססת דפדפן, סינכרון לוח שנה, ותכונות שיתופיות. התקן באמצעות Docker או מדריך ההתקנה הרשמי של Nextcloud ל-Raspberry Pi.
הגדר גיבויים אוטומטיים באמצעות `rsync` ו-`cron` ליצירת גיבויים מתוזמנים של נתונים קריטיים. הגדר התראות בדוא"ל להשלמת הגיבוי ולהתרעות על כישלונות באמצעות תצורת Forward Email שלך.

יישם ניטור רשת באמצעות כלים כמו [Nagios](https://www.nagios.org/) או [Zabbix](https://www.zabbix.com/) לניטור בריאות המערכת, חיבוריות הרשת וזמינות השירותים.

> \[!NOTE]
> למשתמשים המנהלים תשתיות רשת, שקלו לשלב את [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) עם הגדרת PiKVM שלכם לשליטה מרחוק במתגים פיזיים. מדריך השילוב ב-[Python](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) מספק הוראות מפורטות לאוטומציה של ניהול מכשירים פיזיים.

### פתרון בעיות דוא"ל ב-Raspberry Pi {#raspberry-pi-email-troubleshooting}

בעיות נפוצות בתצורת דוא"ל ב-Raspberry Pi כוללות בעיות בפתרון DNS, הגבלות חומת אש וכישלונות אימות. האופי הקל של מערכות Raspberry Pi עלול לגרום לפעמים לבעיות תזמון עם חיבורי SMTP.

אם ההתראות בדוא"ל נכשלות, בדוק את קובץ הלוג של `msmtp` ב-`/var/log/msmtp.log` לקבלת הודעות שגיאה מפורטות. וודא שפרטי ההתחברות שלך ל-Forward Email נכונים ושה-Raspberry Pi יכול לפתור את `smtp.forwardemail.net`.

בדוק את פונקציונליות הדוא"ל באמצעות שורת הפקודה: `echo "Test message" | msmtp recipient@example.com`. זה עוזר לבודד בעיות תצורה מבעיות ספציפיות לאפליקציה.

הגדר הגדרות DNS נכונות ב-`/etc/resolv.conf` אם אתה נתקל בבעיות בפתרון DNS. שקול להשתמש בשרתי DNS ציבוריים כמו `8.8.8.8` או `1.1.1.1` אם ה-DNS המקומי לא אמין.

### אופטימיזציית ביצועים {#performance-optimization}

אופטימז את ביצועי Raspberry Pi NAS שלך באמצעות תצורה נכונה של אחסון, הגדרות רשת ומשאבי מערכת. השתמש במכשירי אחסון איכותיים והגדר אפשרויות מערכת קבצים מתאימות לשימוש שלך.

אפשר את אתחול USB 3.0 לביצועי אחסון טובים יותר אם אתה משתמש בכוננים חיצוניים. הגדר את חלוקת זיכרון ה-GPU באמצעות `sudo raspi-config` כדי להקצות יותר RAM לפעולות מערכת במקום לעיבוד גרפי.

נטר את ביצועי המערכת באמצעות כלים כמו `htop`, `iotop` ו-`nethogs` לזיהוי צווארי בקבוק ואופטימיזציה של שימוש במשאבים. שקול שדרוג ל-Raspberry Pi 4 עם 8GB RAM ליישומי NAS תובעניים.

יישם פתרונות קירור מתאימים למניעת התרסקות תרמית במהלך פעולות אינטנסיביות. נטר את טמפרטורת המעבד באמצעות `/opt/vc/bin/vcgencmd measure_temp` וודא אוורור מספק.

### שיקולי אבטחה {#security-considerations}

אבטח את Raspberry Pi NAS שלך באמצעות יישום בקרות גישה נכונות, אמצעי אבטחת רשת ועדכוני אבטחה שוטפים. שנה סיסמאות ברירת מחדל, השבת שירותים מיותרים והגדר חוקים לחומת אש.

התקן והגדר את `fail2ban` להגנה מפני התקפות כוח גס על SSH ושירותים אחרים. הגדר עדכוני אבטחה אוטומטיים באמצעות `unattended-upgrades` כדי להבטיח ש_PATCHים קריטיים יוחלו במהירות.

הגדר הפרדת רשת כדי לבודד את ה-NAS שלך ממכשירי רשת אחרים ככל האפשר. השתמש בגישה דרך VPN לחיבורים מרוחקים במקום לחשוף שירותים ישירות לאינטרנט.

גבה באופן קבוע את תצורת Raspberry Pi והנתונים שלך למניעת אובדן נתונים כתוצאה מכשלים בחומרה או תקריות אבטחה. בדוק נהלי שחזור גיבויים כדי להבטיח יכולות שחזור נתונים.

תצורת Raspberry Pi NAS מספקת בסיס מצוין ללימוד מושגי אחסון רשת תוך מתן פונקציונליות מעשית לסביבות ביתיות ומשרדים קטנים. השילוב עם Forward Email מבטיח אספקת התראות אמינה לניטור המערכת ותחזוקה.
