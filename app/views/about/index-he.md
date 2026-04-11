# אודות Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# אודות Forward Email {#about-forward-email-1}


## תוכן העניינים {#table-of-contents}

* [סקירה כללית](#overview)
* [המייסד והמשימה](#founder-and-mission)
* [ציר זמן](#timeline)
  * [2017 - הקמה והשקה](#2017---founding-and-launch)
  * [2018 - תשתית ואינטגרציה](#2018---infrastructure-and-integration)
  * [2019 - מהפכת הביצועים](#2019---performance-revolution)
  * [2020 - מיקוד בפרטיות ואבטחה](#2020---privacy-and-security-focus)
  * [2021 - מודרניזציה של הפלטפורמה](#2021---platform-modernization)
  * [2023 - הרחבת תשתית ותכונות](#2023---infrastructure-and-feature-expansion)
  * [2024 - אופטימיזציה של השירות ותכונות מתקדמות](#2024---service-optimization-and-advanced-features)
  * [2025 - שיפורי פרטיות ותמיכה בפרוטוקולים {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - תאימות RFC וסינון מתקדם {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [עקרונות יסוד](#core-principles)
* [מצב נוכחי](#current-status)


## סקירה כללית {#overview}

> \[!TIP]
> לפרטים טכניים על הארכיטקטורה שלנו, יישומי האבטחה ומפת הדרכים, ראו את [המסמך הטכני](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email היא שירות [חינמי וקוד פתוח](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") של [העברת דואר אלקטרוני](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") המתמקד ב[זכות המשתמש לפרטיות](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). מה שהחל כפתרון פשוט להעברת דואר אלקטרוני בשנת 2017 התפתח לפלטפורמת דואר אלקטרוני מקיפה המציעה שמות דומיין מותאמים אישית ללא הגבלה, כתובות דואר אלקטרוני ואליאסים ללא הגבלה, כתובות דואר אלקטרוני חד-פעמיות ללא הגבלה, הגנה מפני דואר זבל ופישינג, אחסון תיבת דואר מוצפן, ותכונות מתקדמות רבות נוספות.

השירות מנוהל ונמצא בבעלות צוות המייסדים המקורי של המעצבים והמפתחים. הוא בנוי ב-100% תוכנה בקוד פתוח באמצעות [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS"), ו-[SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## המייסד והמשימה {#founder-and-mission}

Forward Email נוסדה על ידי **ניקולאס באו** בשנת 2017. לפי [המסמך הטכני של Forward Email](https://forwardemail.net/technical-whitepaper.pdf), באו חיפש בתחילה פתרון פשוט וחסכוני לאפשר דואר אלקטרוני על שמות דומיין עבור פרויקטים צדדיים שלו. לאחר מחקר של האפשרויות הזמינות, הוא החל לקודד את הפתרון שלו ורכש את הדומיין `forwardemail.net` ב-2 באוקטובר 2017.

המשימה של Forward Email חורגת מעבר לספק שירותי דואר אלקטרוני — היא שואפת לשנות את האופן שבו התעשייה מתייחסת לפרטיות ואבטחת דואר אלקטרוני. הערכים המרכזיים של החברה כוללים שקיפות, שליטה של המשתמש, והגנה על פרטיות באמצעות יישום טכני ולא רק הבטחות מדיניות.


## ציר זמן {#timeline}

### 2017 - הקמה והשקה {#2017---founding-and-launch}

**2 באוקטובר 2017**: ניקולאס באו רכש את הדומיין `forwardemail.net` לאחר מחקר של פתרונות דואר אלקטרוני חסכוניים לפרויקטים צדדיים שלו.

**5 בנובמבר 2017**: באו יצר קובץ JavaScript באורך 634 שורות באמצעות [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") להעברת דואר אלקטרוני לכל שם דומיין מותאם אישית. יישום ראשוני זה פורסם כקוד פתוח ב-[GitHub](https://github.com/forwardemail) והשירות הושק באמצעות GitHub Pages.
**נובמבר 2017**: Forward Email הושק רשמית לאחר שחרור ראשוני. הגרסה המוקדמת הייתה מבוססת DNS בלבד ללא תהליך רישום או יצירת חשבון — פשוט קובץ README שנכתב ב-Markdown עם הוראות. משתמשים יכלו להגדיר העברת דואר על ידי קונפיגורציית רשומות MX שיצביעו ל-`mx1.forwardemail.net` ו-`mx2.forwardemail.net`, והוספת רשומת TXT עם `forward-email=user@gmail.com`.

הפשטות והיעילות של הפתרון הזה משכו תשומת לב ממפתחים בולטים, כולל [David Heinemeier Hansson](https://dhh.dk) (יוצר Ruby on Rails), שממשיך להשתמש ב-Forward Email בדומיין שלו `dhh.dk` עד היום.

### 2018 - תשתית ואינטגרציה {#2018---infrastructure-and-integration}

**אפריל 2018**: כאשר [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") השיקה את [שירות ה-DNS לצרכנים עם דגש על פרטיות](https://blog.cloudflare.com/announcing-1111/), Forward Email החליפה את השימוש ב-[OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") ל-[Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") לטיפול בבקשות [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), מה שהדגים את מחויבות החברה לבחירות תשתית עם דגש על פרטיות.

**אוקטובר 2018**: Forward Email אפשרה למשתמשים "Send Mail As" עם [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") ו-[Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), והרחיבה את יכולות האינטגרציה עם ספקי דואר פופולריים.

### 2019 - מהפכת ביצועים {#2019---performance-revolution}

**מאי 2019**: Forward Email שחררה את v2, שהיוותה כתיבה מחדש משמעותית מהגרסאות הראשוניות. עדכון זה התמקד בשיפורי [ביצועים](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") באמצעות שימוש ב-[streams](https://en.wikipedia.org/wiki/Streams "Streams") של [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), והניח את היסודות לסקלביליות של הפלטפורמה.

### 2020 - דגש על פרטיות ואבטחה {#2020---privacy-and-security-focus}

**פברואר 2020**: Forward Email שחררה את תוכנית הגנת הפרטיות המוגברת, שאפשרה למשתמשים לכבות את הגדרת רשומות DNS ציבוריות עם כינויים להגדרת העברת הדואר שלהם. באמצעות תוכנית זו, מידע על כינויי הדואר האלקטרוני של המשתמש מוסתר מלהיות ניתן לחיפוש ציבורי באינטרנט. החברה גם שחררה תכונה לאפשר או להשבית כינויים ספציפיים תוך כדי שהם ממשיכים להופיע ככתובות דואר תקינות ומחזירות קודי [SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") מוצלחים, כאשר המיילים מתבטלים מיד (בדומה להפניית פלט ל-[/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**אפריל 2020**: לאחר התמודדות עם חסימות רבות של פתרונות זיהוי ספאם קיימים שלא כיבדו את מדיניות הפרטיות של Forward Email, החברה שחררה את גרסת האלפא הראשונית של סורק הספאם. פתרון [סינון אנטי-ספאם](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") זה, שהוא חינמי וקוד פתוח לחלוטין, משתמש בגישת [מסנן ספאם Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") בשילוב עם הגנה מפני [פישינג](https://en.wikipedia.org/wiki/Phishing "Phishing") ו-[התקפות הומוגרפיות IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email גם שחררה [אימות דו-שלבי](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) באמצעות [סיסמאות חד-פעמיות](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) לאבטחת חשבון משופרת.

**מאי 2020**: Forward Email אפשרה [העברת פורטים מותאמת אישית](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") כפתרון לעקיפת חסימות פורטים מצד [ספקי אינטרנט](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). החברה גם שחררה את [ממשק ה-RESTful API להעברת דואר חינמית](email-api) עם תיעוד מלא ודוגמאות בקשות ותשובות בזמן אמת, יחד עם תמיכה ב-webhooks.
**אוגוסט 2020**: Forward Email הוסיפה תמיכה במערכת אימות האימייל [Authenticated Received Chain](arc) ("ARC"), שהחיזקה עוד יותר את אבטחת האימייל ואת יכולת המסירה שלו.

**23 בנובמבר 2020**: Forward Email השיקה באופן פומבי את השירות מחוץ לתוכנית הבטא שלה, ציון דרך משמעותי בהתפתחות הפלטפורמה.

### 2021 - מודרניזציה של הפלטפורמה {#2021---platform-modernization}

**פברואר 2021**: Forward Email שינתה את בסיס הקוד שלה כדי להסיר את כל התלויות ב-[Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), מה שאפשר לערימה שלה להיות 100% מבוססת על [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") ו-[Node.js](https://en.wikipedia.org/wiki/Node.js). החלטה ארכיטקטונית זו תאמה את המחויבות של החברה לשמור על ערימת טכנולוגיה עקבית וקוד פתוח.

**27 בספטמבר 2021**: Forward Email [הוסיפה תמיכה](email-forwarding-regex-pattern-filter) בכינויים להעברת אימייל שתואמים ל-[ביטויים רגולריים](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), מה שמספק למשתמשים יכולות ניתוב אימייל מתקדמות יותר.

### 2023 - תשתית והרחבת תכונות {#2023---infrastructure-and-feature-expansion}

**ינואר 2023**: Forward Email השיקה אתר מחודש ומאופטם למהירות טעינה, ששיפר את חוויית המשתמש והביצועים.

**פברואר 2023**: החברה הוסיפה תמיכה ב-[יומני שגיאות](/faq#do-you-store-error-logs) ויישמה ערכת צבעים של [מצב כהה](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) באתר, בתגובה להעדפות המשתמשים ולצרכי נגישות.

**מרץ 2023**: Forward Email שחררה את [Tangerine](https://github.com/forwardemail/tangerine#readme) ואינטגרציה שלה בכל התשתית, המאפשרת שימוש ב-[DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") בשכבת היישום. החברה גם הוסיפה תמיכה ב-[MTA-STS](/faq#do-you-support-mta-sts) והחליפה את [hCaptcha](/) ל-[Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**אפריל 2023**: Forward Email יישמה ואוטומטה תשתית חדשה לחלוטין. כל השירות התחיל לפעול על DNS מאוזן עומסים עולמי ומבוסס קרבה עם בדיקות בריאות ומנגנון כשל באמצעות [Cloudflare](https://cloudflare.com), שהחליף את גישת ה-DNS בסיבוב הקודם. החברה עברה לשרתים **פיזיים ייעודיים** במספר ספקים, כולל [Vultr](https://www.vultr.com/?ref=429848) ו-[Digital Ocean](https://m.do.co/c/a7cecd27e071), שני ספקים בעלי תאימות SOC 2 Type 1. מסדי הנתונים MongoDB ו-Redis הועברו לקונפיגורציות מקובצות עם צמתים ראשיים ומחליפים לזמינות גבוהה, הצפנת SSL מקצה לקצה, הצפנה במנוחה, ושחזור נקודתי (PITR).

**מאי 2023**: Forward Email השיקה את תכונת **SMTP יוצא** שלהם ל[שליחת אימייל עם SMTP](/faq#do-you-support-sending-email-with-smtp) ו[שליחת אימייל עם API](/faq#do-you-support-sending-email-with-api). תכונה זו כוללת מנגנוני הגנה מובנים להבטחת מסירה גבוהה, מערכת תורים ונסיונות מודרנית וחזקה, ו[תומכת ביומני שגיאות בזמן אמת](/faq#do-you-store-error-logs).

**נובמבר 2023**: Forward Email השיקה את תכונת [**אחסון תיבת דואר מוצפן**](/blog/docs/best-quantum-safe-encrypted-email-service) ל[תמיכה ב-IMAP](/faq#do-you-support-receiving-email-with-imap), המהווה התקדמות משמעותית בפרטיות ובאבטחת האימייל.

**דצמבר 2023**: החברה [הוסיפה תמיכה](/faq#do-you-support-pop3) ב-[POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [מפתחות גישה ו-WebAuthn](/faq#do-you-support-passkeys-and-webauthn), ניטור [זמן להגעת האימייל לתיבה](/faq#i), ו-[OpenPGP לאחסון IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - אופטימיזציה של השירות ותכונות מתקדמות {#2024---service-optimization-and-advanced-features}

**פברואר 2024**: Forward Email [הוסיפה תמיכה ביומנים (CalDAV)](/faq#do-you-support-calendars-caldav), והרחיבה את יכולות הפלטפורמה מעבר לאימייל לכלול סינכרון יומנים.
**מרץ עד יולי 2024**: Forward Email שחררה אופטימיזציות ושיפורים משמעותיים לשירותי IMAP, POP3 ו-CalDAV שלה, במטרה להפוך את השירות למהיר כמו, אם לא מהיר יותר, מהחלופות.

**יולי 2024**: החברה [הוסיפה תמיכה ב-Push ל-iOS](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) כדי להתמודד עם חוסר התמיכה בפקודת IMAP `IDLE` באפליקציית Apple Mail ב-iOS, מה שמאפשר התראות בזמן אמת למכשירי Apple iOS. Forward Email גם הוסיפה ניטור זמן להגעה לתיבת הדואר ("TTI") לשירות שלה ול-Yahoo/AOL, והחלה לאפשר למשתמשים להצפין את כל רשומת ה-DNS TXT שלהם אפילו בתכנית החינמית. כפי שהתבקש בדיוני [Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) ובבעיות ב-[GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), החברה הוסיפה את היכולת לסנכרן שמות חלופיים שידחו בשקט `250`, דחייה רכה `421`, או דחייה קשה `550` כאשר הם מושבתים.

**אוגוסט 2024**: Forward Email הוסיפה תמיכה בייצוא תיבות דואר בפורמטים של [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) ו-[Mbox](https://en.wikipedia.org/wiki/Mbox) (בנוסף לפורמט הייצוא הקיים של [SQLite](https://en.wikipedia.org/wiki/SQLite)). [תמיכה בחתימת Webhook נוספה](https://forwardemail.net/faq#do-you-support-bounce-webhooks), והחברה החלה לאפשר למשתמשים לשלוח ניוזלטרים, הודעות ופרסום בדואר דרך שירות ה-SMTP היוצא שלהם. כמו כן, הוטמעו מכסות אחסון כלל-דומיין וספציפיות לשמות חלופיים עבור IMAP/POP3/CalDAV.

### 2025 - שיפורי פרטיות ותמיכה בפרוטוקולים {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**ספטמבר 2024 עד ינואר 2025**: Forward Email [הוסיפה תכונת מענה חופשה מבוקשת מאוד והצפנת OpenPGP/WKD להעברת דואר](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), בהתבסס על יכולות האחסון המוצפן של תיבות הדואר שכבר יושמו.

**21 בינואר 2025**: חברו הטוב ביותר של המייסד, "ג'ק", כלבו הנאמן, נפטר בשלווה בגיל כמעט 11. ג'ק [ייזכר תמיד](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) על ליוויו הבלתי מתפשר שתמך ביצירת Forward Email. [המסמך הטכני של Forward Email](https://forwardemail.net/technical-whitepaper.pdf) מוקדש לג'ק, בהוקרה על תפקידו בפיתוח השירות.

**פברואר 2025**: Forward Email עברה ל-[DataPacket](https://www.datapacket.com) כספק מרכז הנתונים הראשי החדש שלה, תוך יישום חומרה ייעודית, ממוקדת ביצועים, על מתכת נקייה לשיפור אמינות ומהירות השירות.

**מרץ 2025**: גרסה 1.0 של Forward Email שוחררה רשמית.

**אפריל 2025**: פורסמה הגרסה הראשונה של [המסמך הטכני של Forward Email](https://forwardemail.net/technical-whitepaper.pdf), והחברה החלה לקבל תשלומים במטבעות קריפטוגרפיים.

**מאי 2025**: השירות השיק תיעוד API חדש באמצעות [Scalar](https://github.com/scalar/scalar).

**יוני 2025**: Forward Email השיקה תמיכה בפרוטוקול [CardDAV](/faq#do-you-support-contacts-carddav), והרחיבה את יכולות הפלטפורמה לכלול סינכרון אנשי קשר לצד שירותי הדואר והלוח שנה הקיימים.

**אוגוסט 2025**: הפלטפורמה הוסיפה תמיכה ב-[CalDAV VTODO/משימות](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), המאפשרת ניהול משימות לצד אירועי לוח שנה.

**נובמבר 2025**: אבטחת הפלטפורמה שודרגה עם מעבר מ-PBKDF2 ל-[Argon2id](https://en.wikipedia.org/wiki/Argon2) עבור גיבוב סיסמאות, והתשתית הועברה מ-Redis ל-[Valkey](https://github.com/valkey-io/valkey).

**דצמבר 2025**: גרסה 2.0 שוחררה, שכללה תמיכה ב-[REQUIRETLS (RFC 8689)](/rfc#requiretls-support) לאכיפת הצפנת TLS בהעברת דואר ושדרוג ל-[OpenPGP.js](https://github.com/openpgpjs/openpgpjs) גרסה 6.
### 2026 - תאימות RFC וסינון מתקדם {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**ינואר 2026**: Forward Email פרסמה [מסמך תאימות פרוטוקול RFC מקיף](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) והוסיפה תמיכה ב-[הצפנת S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) ובסינון דואר מקיף באמצעות [Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) עם תמיכה בפרוטוקול [ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering). ממשק ה-REST API הורחב ל-39 נקודות קצה.

**פברואר 2026**: לקוח הדואר האלקטרוני הרשמי בקוד פתוח הושק ב-[mail.forwardemail.net](https://mail.forwardemail.net) ([קוד מקור ב-GitHub](https://github.com/forwardemail/mail.forwardemail.net)). הפלטפורמה הוסיפה גם תמיכה ב-[הרחבות תזמון CalDAV (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities), ו-[Domain Connect](https://domainconnect.org) להגדרת DNS בלחיצה אחת. הודעות דחיפה בזמן אמת ל-IMAP, CalDAV ו-CardDAV הושקו באמצעות WebSockets.

**מרץ 2026**: נוספה תמיכה באחסון מותאם אישית תואם S3 לכל דומיין, יחד עם כלי שורת פקודה לניהול. התחילו עבודות על אפליקציות שולחן עבודה וניידות חוצות פלטפורמות ל-macOS, Windows, Linux, iOS ו-Android המשתמשות באותו בסיס קוד של דואר אלקטרוני בקוד פתוח, שנבנה עם [Tauri](https://tauri.app).


## עקרונות יסוד {#core-principles}

מאז הקמתה, Forward Email שומרת על מחויבות איתנה לעקרונות פרטיות ואבטחה:

**פילוסופיית קוד פתוח 100%**: בניגוד למתחרים הפותחים רק את הממשק הקדמי שלהם ושומרים את הצד האחורי סגור, Forward Email הפכה את כל בסיס הקוד שלה—גם קדמי וגם אחורי—זמין לבחינה ציבורית ב-[GitHub](https://github.com/forwardemail).

**עיצוב שמעדיף פרטיות**: מהיום הראשון, Forward Email יישמה גישה ייחודית של עיבוד בזיכרון שמונעת כתיבת מיילים לדיסק, מה שמבדיל אותה משירותי דואר אלקטרוני רגילים ששומרים הודעות במסדי נתונים או מערכות קבצים.

**חדשנות מתמשכת**: השירות התפתח מפתרון הפניית דואר פשוט לפלטפורמת דואר מקיפה עם תכונות כמו תיבות דואר מוצפנות, הצפנה עמידה בפני מחשוב קוונטי, ותמיכה בפרוטוקולים סטנדרטיים כולל SMTP, IMAP, POP3 ו-CalDAV.

**שקיפות**: כל הקוד פתוח וזמין לבחינה, מה שמאפשר למשתמשים לאמת טענות פרטיות במקום להסתמך רק על הצהרות שיווקיות.

**שליטה למשתמש**: העצמת המשתמשים עם אפשרויות, כולל היכולת לארח את כל הפלטפורמה בעצמם אם ירצו.


## המצב הנוכחי {#current-status}

נכון למרץ 2026, Forward Email משרתת מעל 1.6+ million דומיינים ברחבי העולם, כולל ארגונים מובילים בתעשייה כגון:

* **חברות טכנולוגיה**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **ארגוני מדיה**: Fox News Radio, Disney Ad Sales
* **מוסדות חינוך**: אוניברסיטת קיימברידג', אוניברסיטת מרילנד, אוניברסיטת וושינגטון, אוניברסיטת טאפטס, Swarthmore College
* **גופים ממשלתיים**: ממשלת דרום אוסטרליה, ממשלת הרפובליקה הדומיניקנית
* **ארגונים נוספים**: RCD Hotels, Fly<span>.</span>io
* **מפתחים בולטים**: Isaac Z. Schlueter (יוצר npm), David Heinemeier Hansson (יוצר Ruby on Rails)

הפלטפורמה ממשיכה להתפתח עם שחרורי תכונות ושיפורי תשתית סדירים, ושומרת על מעמדה כשירות הדואר האלקטרוני היחיד שהוא 100% קוד פתוח, מוצפן, ממוקד פרטיות, שקוף ועמיד בפני מחשוב קוונטי הזמין כיום.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
