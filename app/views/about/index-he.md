# אודות העברת דוא"ל {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# אודות העברת דוא"ל {#about-forward-email-1}

## תוכן עניינים

* [סקירה כללית](#overview)
* [מייסד ומשימה](#founder-and-mission)
* [ציר זמן](#timeline)
  * [2017 - הקמה והשקה](#2017---founding-and-launch)
  * [2018 - תשתיות ואינטגרציה](#2018---infrastructure-and-integration)
  * [2019 - מהפכת הביצועים](#2019---performance-revolution)
  * [2020 - התמקדות בפרטיות ואבטחה](#2020---privacy-and-security-focus)
  * [2021 - מודרניזציה של הפלטפורמה](#2021---platform-modernization)
  * [2023 - הרחבת תשתית ותכונות](#2023---infrastructure-and-feature-expansion)
  * [2024 - אופטימיזציה של שירות ותכונות מתקדמות](#2024---service-optimization-and-advanced-features)
  * [2025 - שיפורי פרטיות ותמיכה בפרוטוקולים](#2025---privacy-enhancements-and-protocol-support)
  * [2026 - תאימות RFC וסינון מתקדם](#2026---rfc-compliance-and-advanced-filtering)
* [עקרונות ליבה](#core-principles)
* [מצב נוכחי](#current-status)

## סקירה כללית של {#overview}

> \[!TIP]
> לפרטים טכניים על הארכיטקטורה שלנו, יישומי אבטחה ומפת דרכים, עיינו ב-[נייר עמדה טכני](https://forwardemail.net/technical-whitepaper.pdf).

שירות "העברת דוא"ל" הוא שירות [חינמי וקוד פתוח](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [העברת דוא"ל](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") המתמקד ב-[הזכות לפרטיות](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") של המשתמש. מה שהחל כפתרון פשוט להעברת דוא"ל בשנת 2017 התפתח לפלטפורמת דוא"ל מקיפה המציעה שמות דומיין מותאמים אישית ללא הגבלה, כתובות דוא"ל וכינויים ללא הגבלה, כתובות דוא"ל חד פעמיות ללא הגבלה, הגנה מפני ספאם ופישינג, אחסון תיבות דואר מוצפן ותכונות מתקדמות רבות.

השירות מתוחזק ובבעלות צוות המייסדים המקורי שלו, המורכב ממעצבים ומפתחים. הוא בנוי עם תוכנה בקוד פתוח לחלוטין באמצעות [ג'אווהסקריפט](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") ו-[SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## מייסד ומשימה {#founder-and-mission}

חברת Forward Email נוסדה על ידי **ניקולס בו** בשנת 2017. לפי [סקירה טכנית להעברת דוא"ל](https://forwardemail.net/technical-whitepaper.pdf), בו חיפש בתחילה פתרון חסכוני ופשוט להפעלת דוא"ל על שמות דומיין עבור פרויקטים צדדיים שלו. לאחר מחקר על אפשרויות זמינות, הוא החל לקודד פתרון משלו ורכש את הדומיין `forwardemail.net` ב-2 באוקטובר 2017.

המשימה של Forward Email משתרעת מעבר לאספקת שירותי דוא"ל - היא שואפת לשנות את האופן שבו התעשייה מגגישה לפרטיות ואבטחת דוא"ל. ערכי הליבה של החברה כוללים שקיפות, בקרת משתמשים והגנה על הפרטיות באמצעות יישום טכני ולא רק הבטחות מדיניות.

## ציר זמן {#timeline}

### 2017 - הקמה והשקה {#2017---founding-and-launch}

**2 באוקטובר, 2017**: ניקולס באו רכש את הדומיין `forwardemail.net` לאחר שחקר פתרונות דוא"ל חסכוניים עבור פרויקטים צדדיים שלו.

**5 בנובמבר, 2017**: Baugh יצר קובץ JavaScript בן 634 שורות באמצעות [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") כדי להעביר הודעות דוא"ל עבור כל שם דומיין מותאם אישית. יישום ראשוני זה פורסם כקוד פתוח עבור [גיטהאב](https://github.com/forwardemail) והשירות הושק באמצעות GitHub Pages.

**נובמבר 2017**: העברת דוא"ל הושקה רשמית לאחר גרסה ראשונית. הגרסה המוקדמת הייתה מבוססת DNS בלבד ללא רישום חשבון או תהליך הרשמה - פשוט קובץ README שנכתב ב-Markdown עם הוראות. משתמשים יכלו להגדיר העברת דוא"ל על ידי הגדרת רשומות MX כך שיפנו אל `mx1.forwardemail.net` ו-`mx2.forwardemail.net`, והוספת רשומת TXT עם `forward-email=user@gmail.com`.

הפשטות והיעילות של פתרון זה משכו תשומת לב מצד מפתחים בולטים, כולל [דיוויד היינמאייר הנסון](https://dhh.dk) (יוצר Ruby on Rails), שממשיך להשתמש ב-Forward Email בדומיין שלו `dhh.dk` עד היום.

### 2018 - תשתית ואינטגרציה {#2018---infrastructure-and-integration}

**אפריל 2018**: כאשר [קלאודפלאר](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") השיקו את [שירות DNS לצרכנים שמתמקד בפרטיות](https://blog.cloudflare.com/announcing-1111/) שלהם, העברת דוא"ל עברה משימוש ב-[OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") ל-[קלאודפלאר](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") לטיפול בחיפושי [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), מה שמדגים את מחויבות החברה לבחירות תשתית המתמקדות בפרטיות.

**אוקטובר 2018**: העברת דוא"ל אפשרה למשתמשים "לשלוח דוא"ל כ" עם [ג'ימייל](https://en.wikipedia.org/wiki/Gmail "Gmail") ו- [הַשׁקָפָה](https://en.wikipedia.org/wiki/Outlook "Outlook"), ובכך הרחיבה את יכולות האינטגרציה עם ספקי דוא"ל פופולריים.

### 2019 - מהפכת הביצועים {#2019---performance-revolution}

**מאי 2019**: גרסה 2 של העברת דוא"ל שוחררה, שהיוותה כתיבה מחדש משמעותית מהגרסאות הראשוניות. עדכון זה התמקד בשיפורים ב-[ביצועים](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") באמצעות שימוש ב-[זרמים](https://en.wikipedia.org/wiki/Streams "Streams") של [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), ובכך ביסס את היסודות להרחבה של הפלטפורמה.

### 2020 - התמקדות בפרטיות ואבטחה {#2020---privacy-and-security-focus}

**פברואר 2020**: חברת Forward Email הוציאה את תוכנית Enhanced Privacy Protection, המאפשרת למשתמשים לבטל את הגדרת רשומות DNS ציבוריות עם כינויי תצורת העברת הדוא"ל שלהם. באמצעות תוכנית זו, פרטי כינויי הדוא"ל של המשתמש מוסתרים מחיפוש ציבורי באינטרנט. החברה גם הוציאה תכונה המאפשרת או מבטלת כינויים ספציפיים, תוך מתן אפשרות להופיע ככתובות דוא"ל תקפות ולהחזיר [קודי סטטוס של SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") מוצלח, כאשר הודעות הדוא"ל נמחקות באופן מיידי (בדומה לפלט צנרת ל-[/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**אפריל 2020**: לאחר שנתקלו באינספור מכשולים עם פתרונות קיימים לגילוי דואר זבל שלא כיבדו את מדיניות הפרטיות של Forward Email, החברה הוציאה את גרסת האלפא הראשונית שלה של Spam Scanner. פתרון [סינון נגד דואר זבל](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") זה, חינמי לחלוטין וקוד פתוח, משתמש בגישת [מסנן דואר זבל של Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") בשילוב עם הגנה של [אנטי-פישינג](https://en.wikipedia.org/wiki/Phishing "Phishing") ו-[מתקפת הומוגרפיה של IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email הוציאה גם את [אימות דו-שלבי](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) באמצעות [סיסמאות חד-פעמיות](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) לאבטחת חשבון משופרת.

**מאי 2020**: העברת דוא"ל אפשרה [העברת פורטים](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") מותאם אישית כפתרון עוקף למשתמשים כדי לעקוף חסימת פורטים על ידי [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") שלהם. החברה גם פרסמה את [העברת דוא"ל חינמית עם ממשק API RESTful](email-api) שלה עם תיעוד מלא ודוגמאות של בקשות ותגובה בזמן אמת, יחד עם תמיכה ב-webhooks.

**אוגוסט 2020**: תמיכה במערכת אימות הדוא"ל [שרשרת קבלה מאומתת](arc) ("ARC") נוספה לתוכנית "Forward Email", מה שחיזק עוד יותר את אבטחת הדוא"ל ואת יכולת המסירה שלו.

**23 בנובמבר 2020**: תוכנית "העברת דוא"ל" הושקה לציבור לאחר תוכנית הבטא שלה, מה שסימן אבן דרך משמעותית בפיתוח הפלטפורמה.

### 2021 - מודרניזציה של הפלטפורמה {#2021---platform-modernization}

**פברואר 2021**: חברת Forward Email ביצעה שינויים בבסיס הקוד שלה כדי להסיר את כל התלויות של [פִּיתוֹן](https://en.wikipedia.org/wiki/Python_\(programming_language\) "שפת תכנות Python"), מה שאפשר ל-Stack שלה להפוך ל-100% [ג'אווהסקריפט](https://en.wikipedia.org/wiki/JavaScript "JavaScript") ו-[Node.js](https://en.wikipedia.org/wiki/Node.js). החלטה ארכיטקטונית זו תאמה את מחויבות החברה לשמירה על מחסנית טכנולוגיות עקבית בקוד פתוח.

**27 בספטמבר 2021**: העברת דוא"ל [תמיכה נוספת](email-forwarding-regex-pattern-filter) עבור כינויי העברת דוא"ל שיתאימו ל-[ביטויים רגולריים](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), מה שמספק למשתמשים יכולות ניתוב דוא"ל מתוחכמות יותר.

### 2023 - הרחבת תשתית ותכונות {#2023---infrastructure-and-feature-expansion}

**ינואר 2023**: Forward Email השיקה אתר אינטרנט שעוצב מחדש ומותאם למהירות הגלישה, תוך שיפור חוויית המשתמש והביצועים.

**פברואר 2023**: החברה הוסיפה תמיכה עבור [יומני שגיאות](/faq#do-you-store-error-logs) ויישמה ערכת צבעים לאתר [מצב כהה](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme), בהתאם להעדפות המשתמש ולצורכי הנגישות.

**מרץ 2023**: העברת דוא"ל הוציאה את [מַנדָרִינָה](https://github.com/forwardemail/tangerine#readme) ושילבה אותו בכל התשתית שלה, מה שאפשר שימוש ב-[DNS דרך HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") בשכבת האפליקציה. החברה גם הוסיפה תמיכה ב-[MTA-STS](/faq#do-you-support-mta-sts) ועברה מ-[hCaptcha](/) ל-[שער מסתובב קלאודפלייר](https://developers.cloudflare.com/turnstile).

**אפריל 2023**: העברת דוא"ל הוטמעה ואוטומציה של תשתית חדשה לחלוטין. השירות כולו החל לפעול על DNS מבוסס עומסים גלובליים ומבוססי קירבה עם בדיקות תקינות וגיבוי בעת שימוש ב-[קלאודפלאר](https://cloudflare.com), והחליף את גישת ה-DNS הקודמת מסוג Round-Robin. החברה עברה ל-**שרתי Bare Metal** על פני ספקים מרובים, כולל [וולטר](https://www.vultr.com/?ref=429848) ו-[האוקיינוס הדיגיטלי](https://m.do.co/c/a7cecd27e071), שניהם ספקים תואמי SOC 2 Type 1. מסדי נתונים של MongoDB ו-Redis הועברו לתצורות מקובצות עם צמתים ראשיים ומתנה לזמינות גבוהה, הצפנת SSL מקצה לקצה, הצפנה במנוחה ושחזור בזמן (PITR).

**מאי 2023**: Forward Email השיקה את תכונת **SMTP יוצא** שלה עבור בקשות [שליחת דוא"ל באמצעות SMTP](/faq#do-you-support-sending-email-with-smtp) ו- [שליחת דוא"ל עם API](/faq#do-you-support-sending-email-with-api). תכונה זו כוללת אמצעי הגנה מובנים כדי להבטיח מסירה גבוהה, מערכת תור וניסיון חוזר מודרנית וחזקה, ו- [תומך ביומני שגיאות בזמן אמת](/faq#do-you-store-error-logs).

**נובמבר 2023**: Forward Email השיקה את התכונה [**אחסון תיבות דואר מוצפן**](/blog/docs/best-quantum-safe-encrypted-email-service) עבור [תמיכה ב-IMAP](/faq#do-you-support-receiving-email-with-imap), המייצגת התקדמות משמעותית בפרטיות ואבטחת דוא"ל.

**דצמבר 2023**: החברה [תמיכה נוספת](/faq#do-you-support-pop3) עבור ניטור [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [מפתחות ו-WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [זמן לתיבת הדואר הנכנס](/faq#i) ו-[OpenPGP לאחסון IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - אופטימיזציה של שירות ותכונות מתקדמות {#2024---service-optimization-and-advanced-features}

**פברואר 2024**: העברת דוא"ל [נוספה תמיכה בלוח שנה (CalDAV)](/faq#do-you-support-calendars-caldav), הרחבת יכולות הפלטפורמה מעבר לדוא"ל וכוללת סנכרון לוח שנה.

**מרץ עד יולי 2024**: Forward Email פרסמה אופטימיזציות ושיפורים משמעותיים לשירותי IMAP, POP3 ו-CalDAV שלה, במטרה להפוך את השירות שלהם למהיר כמו, אם לא מהיר יותר, מחלופות.

**יולי 2024**: החברה [נוספה תמיכה ב-iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) תתייחס ל-Apple Mail בנוגע לחוסר התמיכה בפקודות IMAP `IDLE` ב-iOS, מה שמאפשר התראות בזמן אמת עבור מכשירי Apple iOS. העברת דוא"ל גם הוסיפה ניטור זמן לתיבת הדואר הנכנס ("TTI") עבור השירות שלה ו-Yahoo/AOL, והחלה לאפשר למשתמשים להצפין את כל רשומת ה-DNS TXT שלהם אפילו בתוכנית החינמית. כפי שנדרש ב-[דיונים על מדריכי פרטיות](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) וב-[בעיות ב-GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), החברה הוסיפה את היכולת לכינויים לדחות בשקט את `250`, לדחות רכה את `421`, או לדחות מוחלטת את `550` כאשר האפשרות מושבתת.

**אוגוסט 2024**: תמיכה בייצוא תיבות דואר בפורמטים [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) ו-[Mbox](https://en.wikipedia.org/wiki/Mbox) נוספה לפורמט הייצוא הקיים [SQLite](https://en.wikipedia.org/wiki/SQLite). [נוספה תמיכה בחתימות Webhook](https://forwardemail.net/faq#do-you-support-bounce-webhooks), והחברה החלה לאפשר למשתמשים לשלוח ניוזלטרים, הודעות ושיווק בדוא"ל דרך שירות ה-SMTP היוצא שלה. כמו כן, יושמו מכסות אחסון כלל-דומיין וספציפיות לכינויים עבור IMAP/POP3/CalDAV.

### 2025 - שיפורי פרטיות ותמיכה בפרוטוקולים {#2025---privacy-enhancements-and-protocol-support}

**ספטמבר 2024 עד ינואר 2025**: העברת דוא"ל [נוספה תכונה מבוקשת מאוד של מענה לחופשה והצפנת OpenPGP/WKD להעברת דוא"ל](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), בהתבסס על יכולות אחסון תיבות דואר מוצפנות שכבר יושמו.

**21 בינואר 2025**: חברו הטוב ביותר של המייסד, "ג'ק", בן לווייתו הכלבי הנאמן, נפטר בשלווה בגיל כמעט 11. ג'ק [תמיד ייזכר](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) על חברותו הבלתי מעורערת שתמכה ביצירת שירות "העברה לדוא"ל". ה-[סקירה טכנית להעברת דוא"ל](https://forwardemail.net/technical-whitepaper.pdf) מוקדש לג'ק, כהוקרה על תפקידו בפיתוח השירות.

**פברואר 2025**: העברת דוא"ל עברה ל-[חבילת נתונים](https://www.datapacket.com) כספק מרכז הנתונים הראשי החדש שלהם, תוך יישום חומרה מותאמת אישית, ממוקדת ביצועים, Bare Metal, כדי לשפר עוד יותר את אמינות השירות ומהירותו.

**יוני 2025**: תמיכה ב-[פרוטוקול CardDAV](/faq#do-you-support-contacts-carddav) הושקה בפלטפורמה Forward Email, מה שמרחיב את יכולות הפלטפורמה כך שתכלול סנכרון אנשי קשר לצד שירותי דוא"ל ויומן קיימים.

### 2026 - תאימות RFC וסינון מתקדם {#2026---rfc-compliance-and-advanced-filtering}

**ינואר 2026**: Forward Email פרסם מסמך מקיף של [תאימות לפרוטוקול RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) המפרט תמיכה מלאה בתקנים עבור SMTP, IMAP, POP3 ו-CalDAV. הפלטפורמה גם הוסיפה [תמיכה ב-REQUIRETLS (RFC 8689)](/faq#requiretls-support) להצפנת TLS מאולצת בהעברת דוא"ל, [הצפנת S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) לחתימה והצפנה מאובטחת של הודעות, ו[סינון דוא"ל Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) עם [פרוטוקול ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering) לסינון דוא"ל בצד השרת. ה-[REST API](/email-api) הורחב ל-39 נקודות קצה המכסים הודעות, תיקיות, אנשי קשר, לוחות שנה ואירועי לוח שנה.

## עקרונות ליבה

מאז הקמתה, Forward Email שמרה על מחויבות איתנה לעקרונות פרטיות ואבטחה:

**פילוסופיית קוד פתוח לחלוטין**: בניגוד למתחרים שמפתחים קוד פתוח רק לשרתים הממשקיים שלהם תוך שמירה על שרתים אחוריים סגורים, Forward Email הפכה את כל בסיס הקוד שלה - הן לשרת הממשק והן לשרת האחורי - לזמין לבדיקה ציבורית ב-[גיטהאב](https://github.com/forwardemail).

**עיצוב שפרטיות במקום הראשון**: מהיום הראשון, Forward Email יישמה גישת עיבוד ייחודית בזיכרון, המונעת כתיבת מיילים לדיסק, ובכך מבדילה אותה משירותי דוא"ל קונבנציונליים המאחסנים הודעות במסדי נתונים או במערכות קבצים.

**חדשנות מתמשכת**: השירות התפתח מפתרון פשוט להעברת דוא"ל לפלטפורמת דוא"ל מקיפה עם תכונות כמו תיבות דואר מוצפנות, הצפנה עמידה בפני קוונטים ותמיכה בפרוטוקולים סטנדרטיים, כולל SMTP, IMAP, POP3 ו-CalDAV.

**שקיפות**: הפיכת כל הקוד לקוד פתוח וזמין לבדיקה, תוך הבטחה שמשתמשים יוכלו לאמת טענות פרטיות במקום פשוט לסמוך על הצהרות שיווק.

**בקרת משתמש**: העצמת משתמשים עם אפשרויות, כולל היכולת לארח את כל הפלטפורמה באופן עצמאי במידת הצורך.

## סטטוס נוכחי {#current-status}

נכון לשנת 2025, Forward Email משרת מעל 500,000 דומיינים ברחבי העולם, כולל ארגונים בולטים ומובילי תעשייה כגון:

* **חברות טכנולוגיה**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **ארגוני מדיה**: Fox News Radio, Disney Ad Sales
* **מוסדות חינוך**: אוניברסיטת קיימברידג', אוניברסיטת מרילנד, אוניברסיטת וושינגטון, אוניברסיטת טאפטס, מכללת סוורת'מור
* **גופים ממשלתיים**: ממשלת דרום אוסטרליה, ממשלת הרפובליקה הדומיניקנית
* **ארגונים אחרים**: RCD Hotels, Fly<span>.</span>io
* **מפתחים בולטים**: Isaac Z. Schlueter (יוצר npm), David Heinemeier Hansson (יוצר Ruby on Rails)

הפלטפורמה ממשיכה להתפתח עם מהדורות קבועות של תכונות ושיפורי תשתית, תוך שמירה על מעמדה כשירות הדוא"ל היחיד הזמין כיום, המוצפן בקוד פתוח לחלוטין, שקוף ועמיד בפני תהליכים קוונטיים, וממוקד בפרטיות.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />